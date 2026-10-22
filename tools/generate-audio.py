#!/usr/bin/env python3
"""Build-time Edge TTS generator. The web app never invokes this service.

Run node tools/collect-audio.js audio/catalog.json, then this script in .venv.
Jobs are content-addressed, bounded, retryable, and written atomically.
Only a complete generation publishes the browser manifest.
"""
import argparse
import asyncio
import hashlib
import json
import os
from pathlib import Path
import sys
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent.parent


def clip_path(voice, speed, rate, text):
    digest = hashlib.sha256(('edge-tts-7.3.1\0' + voice + '\0' + speed + '\0' + rate + '\0' + text).encode()).hexdigest()[:24]
    return 'audio/' + digest + '.mp3'


async def generate(args):
    import edge_tts
    catalog = json.loads((ROOT / 'audio/catalog.json').read_text())
    jobs = []
    for line in catalog['texts']:
        for voice in catalog['voices'].values():
            for speed, rate in catalog['rates'].items():
                # 'speak' = polyphone fix from collect-audio.js SPEAK; the manifest key stays the shown zh
                text = line.get('speak', line['zh'])
                src = clip_path(voice, speed, rate, text)
                jobs.append((f"{voice}|{speed}|{line['zh']}", src, voice, rate, text))
    if args.limit:
        jobs = jobs[:args.limit]
    if args.plan:
        print(json.dumps({'texts': len(catalog['texts']), 'clips': len(jobs), 'existing': sum((ROOT / j[1]).is_file() for j in jobs)}))
        return 0
    selected = set(catalog['voices'].values())
    available = await asyncio.wait_for(edge_tts.list_voices(), 50)
    missing = selected - {v['ShortName'] for v in available}
    if missing:
        raise RuntimeError('Selected voices unavailable: ' + ', '.join(sorted(missing)))
    queue = asyncio.Queue()
    for job in jobs:
        queue.put_nowait(job)
    complete, failures, manifest = 0, [], {}
    byte_sizes = {}
    (ROOT / 'audio').mkdir(exist_ok=True)

    async def worker():
        nonlocal complete
        while not queue.empty():
            key, src, voice, rate, text = queue.get_nowait()
            output = ROOT / src
            part = output.with_suffix('.part')
            error = None
            # Resume only plausible non-empty MPEG files; full decode is checked separately.
            if not output.is_file() or output.stat().st_size < 512:
                for attempt in range(args.retries + 1):
                    try:
                        request = edge_tts.Communicate(text, voice, rate=rate, connect_timeout=20, receive_timeout=40)
                        await asyncio.wait_for(request.save(str(part)), timeout=65)
                        if part.stat().st_size < 512:
                            raise RuntimeError('empty or truncated speech response')
                        os.replace(part, output)
                        error = None
                        break
                    except Exception as exc:
                        error = f'{type(exc).__name__}: {exc}'
                        part.unlink(missing_ok=True)
                        if attempt < args.retries:
                            await asyncio.sleep(min(12, 2 ** attempt) + 0.2)
            if error:
                failures.append({'key': key, 'error': error})
            else:
                manifest[key] = src
                byte_sizes[src] = output.stat().st_size
            complete += 1
            if complete % 50 == 0 or complete == len(jobs):
                print(f'{complete}/{len(jobs)} processed; {len(manifest)} ready; {len(failures)} failed', flush=True)
            queue.task_done()

    await asyncio.gather(*(worker() for _ in range(args.workers)))
    report = {'schema': 1, 'generatedAt': datetime.now(timezone.utc).isoformat(), 'provider': 'edge-tts', 'providerVersion': edge_tts.__version__, 'rates': catalog['rates'], 'voices': catalog['voices'], 'textCount': len(catalog['texts']), 'clipCount': len(manifest), 'totalBytes': sum(byte_sizes.values()), 'files': byte_sizes, 'failures': failures}
    (ROOT / 'audio/generation-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    if failures or args.limit:
        print('Manifest not published: ' + ('partial test run' if args.limit else 'generation incomplete'), flush=True)
        return 0 if args.limit and not failures else 1
    metadata = {k: v for k, v in report.items() if k != 'failures'}
    source = '/* Generated locally: prerecorded standard Mandarin, normal + naturally slowed synthesis. */\nMG.AUDIO = ' + json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, separators=(',', ':')) + ';\nMG.AUDIO_META = ' + json.dumps(metadata, ensure_ascii=False, separators=(',', ':')) + ';\n'
    temporary = ROOT / 'audio-manifest.js.part'
    temporary.write_text(source)
    os.replace(temporary, ROOT / 'audio-manifest.js')
    print(f"Published {len(manifest)} clips, {sum(byte_sizes.values()) / (1024*1024):.1f} MiB", flush=True)
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workers', type=int, default=4, choices=range(1, 9))
    parser.add_argument('--retries', type=int, default=3)
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--plan', action='store_true')
    args = parser.parse_args()
    try:
        return asyncio.run(generate(args))
    except KeyboardInterrupt:
        print('Interrupted; completed files can be reused.', file=sys.stderr)
        return 130
    except Exception as exc:
        print(f'Generation failed: {type(exc).__name__}: {exc}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
