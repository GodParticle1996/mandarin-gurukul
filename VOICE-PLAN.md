# Mandarin pronunciation audio

Listening is implemented. Microphone recording, speech recognition and pronunciation scoring remain deferred.

## Web app behavior

- Two selectable **standard Mandarin** reference voices: `zh-CN-XiaoxiaoNeural` (female) and `zh-CN-YunxiNeural` (male), independent of relationship/gender wording.
- Normal clips use synthesis rate `+0%`; natural slow clips use `-25%`. Browser playback rate stays 1. These are separate recordings, not pitch-shifted copies.
- One shared HTML Audio element. Tap to play/stop; loading, playing, network failure, timeout and retry are visible. Rapid taps settle the previous request. No autoplay.
- Route, lesson stage/card, rehearsal, modal and visibility transitions stop the old clip.
- Settings downloads the selected voice or both voices, including normal and slow, with counts, exact size, cancel/resume and missing-only retries. Cache Storage writes are verified before showing ready. The audio cache is separate from the app shell; Safari-style byte ranges are supported for offline playback.
- No Microsoft request, API key or backend is required when using the app. Serving the files is enough. Service workers need HTTPS or localhost; a plain LAN HTTP address does not give a phone offline mode.

## Rebuild recordings

```bash
cd /home/vibekdutta/VixiApps/mandarin-gurukul
.venv/bin/python -m pip install -r tools/audio-requirements.txt
node tools/collect-audio.js audio/catalog.json
.venv/bin/python tools/generate-audio.py --plan
.venv/bin/python tools/generate-audio.py --workers 4
node tests/test-audio-manifest.js
```

Generation needs internet. It sends only the collected Mandarin lesson text to Edge TTS. `edge-tts==7.3.1` was installed and both voices were live-tested during implementation. This uses the upstream online service; availability and behavior are not guaranteed permanently. See [the upstream project](https://github.com/rany2/edge-tts) and [Microsoft voice documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).

The collector reads the app's content scripts and gathers unique original `zh`/`py` pairs, including female alternatives and examples. Random wrong-tone distractors are not recorded. Jobs are hashed by voice, speed, synthesis rate, provider version and text. Completed MP3s are reused; temporary `.part` files never appear in the playback manifest. Failed requests have bounded retries. A manifest is published atomically only after all jobs succeed. `audio/generation-report.json` records actual byte counts and any failures.

After a content change, regenerate the catalog/recordings, run coverage tests, and bump the shell version in `sw.js` so the new manifest reaches devices. Keep hashed MP3 files stable while a deployed shell may still reference them.

## Verified build snapshot

- 630 unique Mandarin texts across 49 lessons; 2,520 MP3 recordings, 34,411,824 bytes (32.8 MiB) total.
- All recordings probed as MP3, 24 kHz mono, with positive durations (1.008–7.368 seconds).
- 96 broad browser checks and 11 dedicated audio browser checks passed. Full-pack QA downloaded and byte-verified every recording offline; both voices played offline and byte-range responses passed. A final browser pass verified the hidden Cancel control and lesson answer hide/reveal behavior.
- Player lifecycle tests: 11; cache/download/range tests: 6. Content/state and existing pronunciation parser tests remain passing.
- Browser verification uses isolated Chromium contexts at mobile/desktop sizes with dark mode coverage. Native iOS Safari was not run; its offline Range request behavior is covered by response tests.
- Reports: `/tmp/mandarin-gurukul-audio-qa/REPORT.json`, `/tmp/mandarin-gurukul-audio-qa-final/REPORT.json`, `/tmp/mandarin-audio-quality-report.json`.

## Quality and limits

Technical checks cover playable MP3s, complete content coverage, normal/slow separation, both voices, web playback, errors, cancellation and offline caching. Synthetic speech can still choose a wrong polyphone or unusual prosody, particularly with isolated syllables, names and optional regional examples. Chinese recordings and written pinyin have not been certified against one another by a mainland native speaker. A native-speaker review remains useful before treating every clip as a pronunciation reference.

Visual contours are simplified guides. A pitch curve alone cannot grade consonants, vowels, timing, context or intelligibility. No microphone request or vocal accuracy score is exposed by this implementation.
