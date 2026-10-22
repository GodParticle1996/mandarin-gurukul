# Naya content kaise jodein

## Add one new level

1. Open the track's `data-<track>.js` file and add one level object at the end of the `MG.registerLevels('<track>', [ … ])` array.
   The format and the writing rules are in [BRIEF-CONTENT.md](BRIEF-CONTENT.md). Copy a level that already exists.
2. The level id is `<prefix>-NN`, the next number in that track. Phrase ids start with the track prefix and are unique across the app.
3. Run `node validate.js --track <track> --py` and fix every ERR line.
4. Run `node boot-test.js`.
5. Bump `VERSION` in `sw.js` (increment the existing `mg-v2-speaking-*` version) so phones fetch the new content.

## Add a new track

1. Add an entry in `data-core.js` → `MG.tracks` with `id`, `prefix`, `icon`, `name`, `blurb`, `certTitle` and `motto`.
2. Create `data-<id>.js` with `MG.registerLevels('<id>', [ … ])`.
3. Add `<script src="data-<id>.js">` in `index.html`, in the content block before `app.js`.
4. Add the file name to `PRECACHE` in `sw.js` and bump `VERSION`. `boot-test.js` fails if you forget this step.
5. Add the track to `MG.studyOrder` in `core.js` and the situation screens in `practice.js`; the state regression test checks that the path includes every lesson exactly once.

## Add a new stage type

1. Write a renderer in `games.js` or `games-talk.js`: `MG.renderers.<type> = function (stage, arena, onDone) { … onDone({ firstTry, total }); }`.
2. Add the type to `STAGE` in `validate.js` (to check its fields) and to `SCORED` if the stage counts toward the stars.
3. Add a label in `STAGE_LABEL` in `app.js`.

## Voice

See [VOICE-PLAN.md](VOICE-PLAN.md). Playback uses existing `zh` and `who`. Audio review and listening exercise design remain separate work.
