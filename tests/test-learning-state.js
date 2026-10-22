#!/usr/bin/env node
/* Isolated persistence and learning-flow regressions. No browser or user data. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const KEY = 'mandaringurukul-v1';
const json = value => JSON.parse(JSON.stringify(value));

function app(saved) {
  const store = new Map(saved === undefined ? [] : [[KEY, typeof saved === 'string' ? saved : JSON.stringify(saved)]]);
  let clock = Date.UTC(2026, 9, 22, 12);
  let seed = 0x67a1b3c5;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const testMath = Object.assign(Object.create(Math), { random });
  class TestDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const context = vm.createContext({
    console, Date: TestDate, Math: testMath, setTimeout: () => {},
    document: { getElementById: () => null },
    localStorage: { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) },
  });
  const content = [...fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').matchAll(/<script src="(data-[^"]+\.js)"/g)]
    .map(m => m[1]).filter(f => f !== 'data-core.js' && fs.existsSync(path.join(ROOT, f)));
  ['core.js', 'pinyin.js', 'data-core.js', ...content, 'pyview.js', 'games.js'].forEach(f => {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), context, { filename: f });
  });
  return {
    MG: vm.runInContext('MG', context),
    saved: () => store.get(KEY),
    tomorrow: () => { clock += 24 * 60 * 60 * 1000; },
    now: () => clock,
    setRandom: fn => { testMath.random = fn; },
  };
}

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✅ ' + name); }
  catch (error) { console.error('  ❌ ' + name); throw error; }
}
console.log('=== Learning state and progression ===');

test('new learner gets speaking-first defaults and independent state objects', () => {
  const { MG } = app();
  assert.equal(MG.state.profile.onboarded, false);
  assert.equal(MG.state.profile.focus, 'balanced');
  assert.equal(MG.state.profile.dailyMinutes, 20);
  assert.equal(MG.state.profile.showHan, false);
  assert.equal(MG.state.profile.showDeva, false);
  assert.equal(MG.state.checkpoint, null);
  const other = MG.defaultState();
  other.completed.push('example'); other.profile.focus = 'travel';
  assert.equal(MG.state.completed.length, 0);
  assert.equal(MG.state.profile.focus, 'balanced');
});

test('old progress migrates without losing XP, completed lessons or display preferences', () => {
  const { MG } = app({ xp: 180, completed: ['ton-01', 'ton-01'], profile: { onboarded: true, gender: 'm', showDeva: true }, stars: { 'ton-01': 2 } });
  assert.equal(MG.state.xp, 180);
  assert.deepEqual(json(MG.state.completed), ['ton-01']);
  assert.equal(MG.state.stars['ton-01'], 2);
  assert.equal(MG.state.profile.showDeva, true);
  assert.equal(MG.state.profile.onboarded, true);
  assert.equal(MG.state.profile.dailyMinutes, 20);
  assert.equal(MG.state.profile.focus, 'balanced');
  assert.deepEqual(json(MG.state.activity), {});
  assert.deepEqual(json(MG.state.sceneAwards), []);
});

test('corrupt JSON and invalid top-level imports recover to a usable fresh state', () => {
  ['{broken', null, {}, { xp: Infinity, completed: [] }, { xp: 5, completed: 'ton-01' }].forEach(saved => {
    const { MG } = app(saved);
    assert.equal(MG.state.xp, 0);
    assert.deepEqual(json(MG.state.completed), []);
    assert.doesNotThrow(() => MG.dueCards());
  });
});

test('invalid nested imports cannot break revision, planning or streak rendering', () => {
  const { MG } = app({ xp: -10, completed: ['ton-01', 99, 'ton-01'], profile: { focus: 'invalid', dailyMinutes: 999 }, dojo: { bad: null, badBox: { box: 99, due: 0 }, badDate: { box: 0, due: 'tomorrow' } }, activity: null, stars: [], said: [], streak: { count: -3, best: 'bad' }, sceneAwards: null });
  assert.equal(MG.state.xp, 0);
  assert.deepEqual(json(MG.state.completed), ['ton-01']);
  assert.deepEqual(json(MG.dueCards()), []);
  assert.equal(MG.state.profile.focus, 'balanced');
  assert.equal(MG.state.profile.dailyMinutes, 20);
  assert.equal(MG.state.streak.count, 0);
  assert.equal(MG.state.streak.best, 0);
  assert.doesNotThrow(() => { MG.recordActivity('review'); MG.nextLevel(); });
});

test('all 11 tracks and every registered lesson are accessible to a new learner', () => {
  const { MG } = app();
  assert.equal(MG.tracks.length, 11);
  MG.tracks.forEach(t => {
    assert.equal(MG.trackUnlocked(t), true, t.id);
    MG.levelsOf(t).forEach(l => assert.equal(MG.levelUnlocked(l), true, l.id));
  });
  assert.equal(MG.trackUnlocked(null), false);
  assert.equal(MG.levelUnlocked(null), false);
});

test('every focus produces a complete, unique study path', () => {
  const { MG } = app();
  const all = MG.tracks.flatMap(t => MG.levelsOf(t)).map(l => l.id).sort();
  ['balanced', 'family', 'travel'].forEach(focus => {
    MG.state.profile.focus = focus;
    const ids = MG.studyOrder().map(l => l.id);
    assert.equal(ids.length, new Set(ids).size, focus + ' has no duplicate lessons');
    assert.deepEqual(json([...ids].sort()), json(all), focus + ' includes all registered lessons');
  });
});

test('balanced starter path includes family, food, foundations and travel early', () => {
  const { MG } = app();
  const tracks = new Set(MG.studyOrder().slice(0, 8).map(l => l.track));
  ['tones', 'basics', 'family', 'food'].forEach(t => assert.ok(tracks.has(t), t));
  if (MG.levelsOf(MG.trackById('travel')).length) assert.ok(tracks.has('travel'));
  const first = MG.nextLevel();
  MG.state.completed.push(first.id);
  assert.notEqual(MG.nextLevel().id, first.id);
  MG.state.completed = MG.studyOrder().map(l => l.id);
  assert.equal(MG.nextLevel(), null);
});

test('optional regional lessons follow the entire standard-Mandarin study path', () => {
  const { MG } = app();
  ['balanced', 'family', 'travel'].forEach(focus => {
    MG.state.profile.focus = focus;
    const order = MG.studyOrder();
    const firstRegional = order.findIndex(l => l.track === 'north');
    if (firstRegional < 0) return;
    assert.ok(order.slice(firstRegional).every(l => l.track === 'north'), focus + ' keeps regional content at the end');
  });
});

test('daily actions accumulate separately and streak advances only once per local day', () => {
  const a = app(), { MG } = a;
  const today = MG.todayStr();
  MG.recordActivity('lesson'); MG.recordActivity('review'); MG.recordActivity('conversation'); MG.recordActivity('review');
  assert.deepEqual(json(MG.state.activity[today]), { lesson: 1, review: 2, conversation: 1 });
  assert.equal(MG.state.streak.count, 1);
  a.tomorrow();
  MG.recordActivity('review');
  assert.equal(MG.state.streak.count, 2);
  assert.deepEqual(json(MG.state.activity[today]), { lesson: 1, review: 2, conversation: 1 });
  assert.deepEqual(json(MG.state.activity[MG.todayStr()]), { review: 1 });
  const reloaded = app(a.saved()).MG;
  assert.deepEqual(json(reloaded.state.activity), json(MG.state.activity));
});

test('lesson checkpoint preserves the completed-stage boundary and scores after reload', () => {
  const a = app(), { MG } = a;
  const level = MG.levelById('ton-01');
  MG.session = { level, stageIdx: 1, firstTry: 3, total: 5, replay: false };
  MG.saveCheckpoint();
  const resumed = app(a.saved()).MG;
  assert.deepEqual(json(resumed.state.checkpoint), { levelId: level.id, stageIdx: 1, firstTry: 3, total: 5, replay: false });
  assert.ok(resumed.levelById(resumed.state.checkpoint.levelId));
  MG.session.finished = true;
  MG.session.stageIdx = 10;
  MG.saveCheckpoint();
  assert.equal(MG.state.checkpoint.stageIdx, 1, 'a finished session cannot overwrite the saved checkpoint');
});

test('malformed checkpoints are discarded while scene checkpoints remain resumable', () => {
  [null, { levelId: 'ton-01', stageIdx: -2, firstTry: 0, total: 0 }, { levelId: 'ton-01', stageIdx: 1, firstTry: 5, total: 2 }, { levelId: 22, stageIdx: 1, firstTry: 0, total: 0 }].forEach(checkpoint => {
    assert.equal(app({ xp: 0, completed: [], checkpoint }).MG.state.checkpoint, null);
  });
  assert.equal(app({ xp: 0, completed: [], checkpoint: { levelId: 'ton-01', stageIdx: -1, firstTry: 0, total: 0 } }).MG.state.checkpoint.stageIdx, -1);
});

test('replaying a lesson cannot farm XP or damage an existing revision schedule', () => {
  const a = app(), { MG } = a;
  const id = Object.keys(MG.phrases)[0];
  MG.state.dojo[id] = { box: 3, due: a.now() + 10 * MG.DAY, miss: 1 };
  const before = json(MG.state.dojo[id]);
  MG.session = { replay: true };
  MG.addXP(100); MG.noteMistake(id);
  assert.equal(MG.state.xp, 0);
  assert.deepEqual(json(MG.state.dojo[id]), before);
  MG.session = null; // router clears the lesson context before ordinary revision
  MG.addXP(MG.CARD_XP);
  assert.equal(MG.state.xp, MG.CARD_XP);
  MG.noteMistake(id);
  assert.equal(MG.state.dojo[id].box, 0);
  assert.equal(MG.state.dojo[id].miss, 2);
});

test('due revision excludes unknown phrases and a successful review postpones a real card', () => {
  const a = app(), { MG } = a;
  const id = Object.keys(MG.phrases)[0];
  MG.state.dojo[id] = { box: 0, due: a.now() - 1, miss: 0 };
  MG.state.dojo.removedPhrase = { box: 0, due: 0, miss: 0 };
  assert.deepEqual(json(MG.dueCards().map(c => c.id)), [id]);
  MG.reviewCard(id, true);
  assert.equal(MG.dueCards().length, 0);
  assert.ok(MG.state.dojo[id].due > a.now());
  assert.ok(app(a.saved()).MG.state.dojo[id].due > a.now());
});

test('random tone distractors never punish the same spoken answer across all phrases', () => {
  const { MG } = app();
  const phrases = Object.values(MG.phrases).flatMap(p => p.f ? [p, Object.assign({}, p, p.f)] : [p]);
  let checked = 0;
  for (const p of phrases) {
    const correct = MG.g.spokenKey(p.py, p.say);
    for (let trial = 0; trial < 8; trial++) {
      const variants = MG.g.toneVariants(p.py, 3, p.say);
      const keys = variants.map(py => MG.g.spokenKey(py));
      assert.ok(keys.every(key => key !== correct), `${p.id}: distractor matches the spoken answer`);
      assert.equal(keys.length, new Set(keys).size, `${p.id}: distractors duplicate each other's spoken answer`);
      checked += variants.length;
    }
  }
  assert.ok(checked > phrases.length, 'the seeded trials actually exercised generated distractors');
});

test('known sandhi collisions are rejected even with explicit spoken overrides', () => {
  const a = app(), { MG } = a;
  // Repeatedly propose a first syllable with Tone 2. It must be rejected for
  // nǐ hǎo -> ní hǎo, and for the content override xiǎojie -> xiáojie.
  let call = 0;
  a.setRandom(() => call++ % 2 === 0 ? 0 : 0.5);
  assert.equal(MG.g.spokenKey('Nǐ hǎo'), MG.g.spokenKey('Ní hǎo'));
  assert.deepEqual(json(MG.g.toneVariants('Nǐ hǎo', 2)), []);
  call = 0;
  assert.equal(MG.g.spokenKey('xiǎojie', 'xiáojie'), MG.g.spokenKey('xiáojie'));
  assert.deepEqual(json(MG.g.toneVariants('xiǎojie', 2, 'xiáojie')), []);
});

test('tone-pattern quiz draws 3+3 differently from 2+3 without applying sandhi twice', () => {
  const { MG } = app();
  const thirdThird = MG.pv.pattern([3, 3]);
  const secondThird = MG.pv.pattern([2, 3]);
  assert.notEqual(thirdThird, secondThird);
  const firstPath = html => /<polyline points="([^"]+)"/.exec(html)[1].split(' ').map(pair => pair.split(',').map(Number));
  const dip = firstPath(thirdThird), rise = firstPath(secondThird);
  assert.equal(dip.length, 3, 'a citation Tone 3 choice includes the low turning point');
  assert.ok(dip[1][1] > dip[0][1] && dip[1][1] > dip[2][1], 'the first 3+3 glyph dips then rises');
  assert.equal(rise.length, 2, 'a Tone 2 choice rises directly');
  assert.ok(rise[1][1] < rise[0][1]);
});

console.log(`\n${passed} passed, 0 failed`);
