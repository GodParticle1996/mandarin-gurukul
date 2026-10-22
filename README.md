# Mandarin Gurukul

Hinglish mein practical Mandarin speaking practice for a China trip: GF ke parents aur friends, restaurants, taxis, metro, hotels, shopping and asking for help.

49 lessons, 433 indexed phrases, 11 open tracks. A suggested six-week path mixes daily situations with pronunciation foundations, bringing family, food and travel in early. Standard Mandarin is the core; regional examples are optional bonus content at the end. The path suggests one lesson a day, with extra lessons at your pace. It is a practice schedule, not a fluency deadline.

## Use locally

```bash
cd /home/vibekdutta/VixiApps/mandarin-gurukul
python3 -m http.server 8080
```

Open `http://localhost:8080`. No installation or build is needed. Stop with Ctrl+C. On a phone, offline service workers need an HTTPS origin; plain HTTP over a LAN is not equivalent to localhost. No hosting/deployment was performed.

## What to try

1. **Aaj:** revision/tone warm-up, one lesson, one conversation. Default target is 20 minutes, adjustable in Settings.
2. **Situations:** all tracks open immediately. No need to finish the tone course before preparing for a taxi or family visit.
3. **Practice:** try your own spoken answer, reveal the model, then honestly mark recall. Choose another scene from the dropdown. The tone motion lab has an animated guide and keyboard/touch slider.
4. **Phrases:** search in Hinglish, pinyin or Chinese; filter by situation, expand notes, or show a large Chinese card to someone. Available before completing lessons.
5. **Resume:** the last lesson resumes at the saved stage boundary after leaving/reloading. Answers inside an unfinished stage restart. Existing progress remains compatible with the original storage key.

Chinese characters and Devanagari are optional, off for new learners. Existing display preferences are preserved. Six new scenario illustrations supplement the original food/location photos; see [image provenance and prompt](img/SCENARIOS.md).

## Voice pronunciation

**630 unique lines · 2,520 MP3 clips · 32.8 MiB for both voices and speeds.**

Both standard Mandarin reference voices are available: Xiaoxiao (female) and Yunxi (male). Switch in Settings or inside a lesson, conversation or tone lab. This preference is separate from relationship wording.

**Suno** plays the normal recording. **Dheere** plays a separately synthesized, naturally slower recording (`-25%` synthesis rate), at browser playback rate 1. Tap the active control again to stop. Playback is always initiated by a tap; it stops on navigation, stage/card changes, or when the page is hidden.

Recordings cover lesson phrases, dialogue, pronunciation examples, gender wording alternatives and tone demos. Play controls appear in cards, explain examples, quiz feedback, phrasebook, Dojo, conversation rehearsal and tone motion lab. Loading, Stop, error and retry states are visible and accessible. Only one player is active.

Edge TTS is a **build-time** dependency. The web app plays same-origin MP3 files; there is no runtime Microsoft request, API key, browser speech-synthesis dependency or backend. The installed generator was live-tested with `edge-tts==7.3.1`; provider availability can change. TTS is a reference, not a native-speaker certification. There is no microphone recording or vocal pronunciation grading.

See [voice implementation and rebuilding](VOICE-PLAN.md), [sources](dev/content-sources.md), and [audio catalog](audio/catalog.json).

## Offline and progress

The service worker installs a versioned app shell including the audio manifest, images and code. MP3s are downloaded separately: Settings can save the selected voice or both voices, always including normal + slow. Download status shows recording counts and real bytes, supports cancel/resume, and verifies saved files before reporting ready. Previously saved audio survives app-shell upgrades. Cached audio supports byte-range requests used by Safari. Before travel, download on the actual phone and verify lessons after an airplane-mode reload. Browser storage can be evicted; progress is browser/device/origin-specific. Export progress before changing devices or clearing storage.

## Verification

```bash
node validate.js
node boot-test.js
node tests/test-pinyin.js
node tests/test-deva.js
node tests/test-learning-state.js
node tests/test-voice.js
node tests/test-audio-cache.js
node tests/test-audio-manifest.js
node tools/qa.js
MG_QA_FULL_AUDIO=1 node tools/audio-qa.js
```

Browser QA uses existing Playwright/Chromium; `PLAYWRIGHT` can specify its module path. Tests use isolated storage and a temporary port, and close the browser/server afterward. Screenshots and `REPORT.json` go to `/tmp/mandarin-gurukul-qa`. User progress is not reset.

Optional `node validate.js --py` requires `.venv` with pypinyin. It checks spelling and possible readings, not linguistic correctness. Run Python cross-checks sequentially.

## Main files

| File | Responsibility |
| --- | --- |
| `core.js` | State migration, XP, spaced review, checkpoints, study order |
| `practice.js` | Dashboard, situations, six-week path, conversation recall, tone motion |
| `app.js`, `app-extra.js`, `boot.js` | Lessons, completion, phrasebook, settings, routing |
| `pinyin.js`, `pyview.js`, `deva.js` | Pinyin, simplified connected-speech contours, optional Hindi hints |
| `games.js`, `games-talk.js` | Ten exercise types and feedback |
| `data-*.js` | Content; basics extension loads after the original basics file |
| `voice.js` | Reusable MP3 player, states, cancellation and reference selection |
| `audio-manifest.js`, `audio/*.mp3` | Content-addressed recordings and exact byte sizes |
| `tools/collect-audio.js`, `tools/generate-audio.py` | Resumable build-time speech generation |
| `sw.js` | Offline shell; bump version when shipping content/code/assets |

Content format: [BRIEF-CONTENT.md](BRIEF-CONTENT.md). Older trip, exchange-rate and household assumptions in that brief are legacy context; current learner choices and source review notes take precedence.
