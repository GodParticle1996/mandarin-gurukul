/* =====================================================================
   Mandarin Gurukul — Core: state, XP, streak, spaced repetition, registry
   Loaded FIRST. Everything lives under the global `MG` namespace so
   content files (data-*.js) can self-register levels & phrases.
   (Ported from kafka-gurukul/core.js — Mandarin bolna-sunna edition)
   ===================================================================== */

/* kuch purane browsers/webviews mein scrollIntoView nahi hota — app na toote */
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView)
  Element.prototype.scrollIntoView = function () {};

const MG = {
  STORE_KEY: 'mandaringurukul-v1',
  XP_PER_ITEM: 10,
  PERFECT_BONUS: 20,
  CARD_XP: 5,            // XP per due card reviewed in the Dojo
  SCENE_XP: 5,           // XP for getting the level's opening scene right
  SRS_INTERVALS: [1, 3, 7, 16, 35, 70],   // days — Leitner boxes

  levelSets: {},         // trackId -> [level, ...]  (filled by data-*.js)
  tracks: [],            // filled by data-core.js
  phrases: {},           // phraseId -> phrase (filled by registerLevels)
  state: null,
  session: null,
};

/* ---------------- level registry (extensibility hook) ----------------
   A data file calls:  MG.registerLevels('family', [ {...}, {...} ])
   Multiple calls append — so you can add ONE new level from ANY file.
   Every phrase is also indexed in MG.phrases (Dojo + Diary use it).  */
MG.registerLevels = function (trackId, levels) {
  if (!MG.levelSets[trackId]) MG.levelSets[trackId] = [];
  levels.forEach(level => {
    level.track = trackId;
    (level.phrases || []).forEach(p => {
      p.level = level.id;
      if (!MG.phrases[p.id]) MG.phrases[p.id] = p;
    });
  });
  MG.levelSets[trackId].push(...levels);
};

/* ---------------- persistence ---------------- */
MG.defaultState = function () {
  return {
    xp: 0,
    completed: [],        // level ids
    stars: {},            // levelId -> 1..3
    dojo: {},             // phraseId -> { box, due (ms), miss }
    streak: { last: null, count: 0, best: 0 },
    profile: {
      onboarded: false,
      gender: null,       // relationship wording; independent of the reference speaker
      referenceVoice: 'female',
      showHan: false,      // chhote Chinese akshar (Dikhao card ke liye kaam aate hain)
      showDeva: false,     // Devanagari hint line
      dailyMinutes: 20,
      focus: 'balanced',
      showBadges: true,   // 💨 👅 🐝 😗 badges
    },
    checkpoint: null,
    activity: {},          // local day -> { lesson, review, conversation }
    sceneAwards: [],
    said: {},             // phraseId -> kitni baar "zor se bola" tap kiya
  };
};

MG.normalizeState = function (s) {
  const d = MG.defaultState();
  if (!s || typeof s !== 'object' || !Number.isFinite(s.xp) || !Array.isArray(s.completed)) return d;
  const clean = Object.assign(d, s);
  clean.xp = Math.max(0, s.xp);
  clean.completed = [...new Set(s.completed.filter(id => typeof id === 'string'))];
  clean.profile = Object.assign(MG.defaultState().profile, s.profile || {});
  clean.profile.referenceVoice = ['female', 'male'].includes(clean.profile.referenceVoice) ? clean.profile.referenceVoice : 'female';
  clean.profile.dailyMinutes = [10, 15, 20, 30].includes(clean.profile.dailyMinutes) ? clean.profile.dailyMinutes : 20;
  clean.profile.focus = ['balanced', 'family', 'travel'].includes(clean.profile.focus) ? clean.profile.focus : 'balanced';
  ['stars', 'dojo', 'said', 'activity'].forEach(k => {
    if (!clean[k] || typeof clean[k] !== 'object' || Array.isArray(clean[k])) clean[k] = {};
  });
  clean.dojo = Object.fromEntries(Object.entries(clean.dojo).filter(([id, c]) => c && Number.isFinite(c.due) && Number.isInteger(c.box) && c.box >= 0 && c.box < MG.SRS_INTERVALS.length));
  clean.streak = Object.assign(MG.defaultState().streak, s.streak || {});
  ['count', 'best'].forEach(k => { if (!Number.isFinite(clean.streak[k]) || clean.streak[k] < 0) clean.streak[k] = 0; });
  clean.sceneAwards = Array.isArray(s.sceneAwards) ? s.sceneAwards.filter(id => typeof id === 'string') : [];
  const c = s.checkpoint;
  clean.checkpoint = c && typeof c.levelId === 'string' && Number.isInteger(c.stageIdx) && c.stageIdx >= -1
    && Number.isFinite(c.firstTry) && c.firstTry >= 0 && Number.isFinite(c.total) && c.total >= c.firstTry ? c : null;
  return clean;
};
MG.loadState = function () {
  try { return MG.normalizeState(JSON.parse(localStorage.getItem(MG.STORE_KEY))); }
  catch (e) { return MG.defaultState(); }
};
MG.saveState = function () {
  try { localStorage.setItem(MG.STORE_KEY, JSON.stringify(MG.state)); } catch (e) { /* private mode */ }
};
MG.state = MG.loadState();

/* ---------------- DOM helpers ---------------- */
MG.el = function (tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
MG.shuffle = function (arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
MG.shake = function (node) {
  node.classList.remove('shake');
  void node.offsetWidth;
  node.classList.add('shake');
};
MG.escapeHtml = function (s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

/* ---------------- gender-aware phrase view ----------------
   Kuch phrases ka ladki-version alag hota hai (男朋友 → 女朋友).
   Phrase mein `f: { zh, py, hi }` ho aur profile.gender === 'f' → woh version. */
MG.view = function (p) {
  if (p && p.f && MG.state.profile.gender === 'f') return Object.assign({}, p, p.f);
  return p;
};

/* ---------------- XP & ranks ---------------- */
MG.currentRank = function () {
  let r = RANKS[0];
  for (const rank of RANKS) if (MG.state.xp >= rank.xp) r = rank;
  return r;
};
MG.nextRank = function () { return RANKS.find(r => r.xp > MG.state.xp) || null; };
MG.addXP = function (n) {
  if (MG.session && MG.session.replay) return;
  if (n <= 0) return;
  MG.state.xp += n;
  MG.touchStreak();
  MG.saveState();
  if (typeof renderTopbar === 'function') renderTopbar();
  MG.floatXP(n);
};
MG.floatXP = function (n) {
  const bar = document.getElementById('topbar');
  if (!bar) return;
  const f = MG.el('div', 'xp-float', `+${n} XP`);
  bar.appendChild(f);
  setTimeout(() => f.remove(), 1200);
};

/* ---------------- daily streak ---------------- */
MG.dayStr = function (d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
MG.todayStr = function () { return MG.dayStr(new Date()); };
MG.yesterdayStr = function () { const y = new Date(); y.setDate(y.getDate() - 1); return MG.dayStr(y); };
MG.touchStreak = function () {
  const s = MG.state.streak;
  const today = MG.todayStr();
  if (s.last === today) return;
  s.count = (s.last === MG.yesterdayStr()) ? s.count + 1 : 1;
  s.best = Math.max(s.best, s.count);
  s.last = today;
  MG.saveState();
};
MG.streakAlive = function () {
  const s = MG.state.streak;
  return !!s.last && (s.last === MG.todayStr() || s.last === MG.yesterdayStr());
};

/* ---------------- Revision Dojo: Leitner spaced repetition ----------
   Card id = phrase id (card ke dono taraf phrase data se bante hain).
   - level complete  -> level.phrases deck mein (kal due)
   - galat jawab     -> woh phrase box 0 pe, kal due (mistake card)
   - review sahi     -> box+1 (capped), due = now + interval[box]
   - review galat    -> box = 0, kal due                               */
MG.DAY = 24 * 60 * 60 * 1000;

MG.addCard = function (phraseId) {
  if (!MG.phrases[phraseId] || MG.state.dojo[phraseId]) return;
  MG.state.dojo[phraseId] = { box: 0, due: Date.now() + MG.DAY, miss: 0 };
  MG.saveState();
};

/* game renderers call this on a wrong answer that is about a phrase */
MG.noteMistake = function (phraseId) {
  if (MG.session && MG.session.replay) return;
  if (!phraseId || !MG.phrases[phraseId]) return;
  const c = MG.state.dojo[phraseId];
  if (c) { c.box = 0; c.due = Date.now() + MG.DAY; c.miss = (c.miss || 0) + 1; }
  else MG.state.dojo[phraseId] = { box: 0, due: Date.now() + MG.DAY, miss: 1 };
  MG.saveState();
};

MG.enrollLevelCards = function (level) {
  (level.phrases || []).forEach(p => MG.addCard(p.id));
};

MG.dueCards = function () {
  const now = Date.now();
  return Object.entries(MG.state.dojo)
    .filter(([id, c]) => c.due <= now && MG.phrases[id])
    .map(([id, c]) => ({ id, ...c }));
};

MG.reviewCard = function (id, remembered) {
  const c = MG.state.dojo[id];
  if (!c) return;
  if (remembered) {
    c.box = Math.min(c.box + 1, MG.SRS_INTERVALS.length - 1);
    c.due = Date.now() + MG.SRS_INTERVALS[c.box] * MG.DAY;
  } else {
    c.box = 0;
    c.miss = (c.miss || 0) + 1;
    c.due = Date.now() + MG.DAY;
  }
  MG.saveState();
};

/* ---------------- track helpers ---------------- */
MG.trackById = function (id) { return MG.tracks.find(t => t.id === id); };
MG.levelById = function (id) {
  for (const t of MG.tracks) {
    const l = (MG.levelSets[t.id] || []).find(x => x.id === id);
    if (l) return l;
  }
  return null;
};
MG.levelsOf = function (track) { return MG.levelSets[track.id] || []; };
MG.trackProgress = function (track) {
  const levels = MG.levelsOf(track);
  const done = levels.filter(l => MG.state.completed.includes(l.id)).length;
  return { done, total: levels.length, complete: done === levels.length && levels.length > 0 };
};
/* Unlock rule: foundation track (`gate: true` in data-core.js) ke pehle `gateCount`
   level poore karo, phir baaki saare tracks khul jaate hain. Track ke andar levels order mein. */
MG.gateNeed = function (t) { return Math.min(t.gateCount || Infinity, MG.levelsOf(t).length); };
MG.trackUnlocked = function (track) { return !!track; };
MG.levelUnlocked = function (level) { return !!level && !!MG.trackById(level.track); };
MG.recordActivity = function (kind) {
  const day = MG.todayStr();
  const a = MG.state.activity[day] || (MG.state.activity[day] = {});
  a[kind] = (a[kind] || 0) + 1;
  MG.touchStreak();
  MG.saveState();
};
MG.saveCheckpoint = function () {
  const s = MG.session;
  if (!s || s.finished) return;
  MG.state.checkpoint = { levelId: s.level.id, stageIdx: s.stageIdx, firstTry: s.firstTry, total: s.total, replay: s.replay };
  MG.saveState();
};
/* next level jo abhi karna chahiye (Aaj ka plan) */
MG.studyOrder = function () {
  const intro = ['ton-01', 'bas-02', 'fam-01', 'food-01', 'snd-01', 'bas-01', 'trv-01'];
  const focus = MG.state.profile.focus;
  const tracks = focus === 'family'
    ? ['family', 'friends', 'basics', 'tones', 'food', 'sounds', 'travel', 'builder', 'shopping', 'emergency']
    : focus === 'travel'
    ? ['travel', 'food', 'basics', 'shopping', 'tones', 'sounds', 'emergency', 'family', 'friends', 'builder']
    : ['family', 'food', 'travel', 'basics', 'friends', 'tones', 'sounds', 'shopping', 'builder', 'emergency'];
  const ids = intro.filter(id => MG.levelById(id));
  const seen = new Set(ids);
  const max = Math.max(0, ...Object.values(MG.levelSets).map(ls => ls.length));
  for (let i = 0; i < max; i++) tracks.forEach(t => {
    const l = (MG.levelSets[t] || [])[i];
    if (l && !seen.has(l.id)) { ids.push(l.id); seen.add(l.id); }
  });
  (MG.levelSets.north || []).forEach(l => { if (!seen.has(l.id)) { ids.push(l.id); seen.add(l.id); } });
  return ids.map(id => MG.levelById(id));
};
MG.nextLevel = function () {
  return MG.studyOrder().find(l => !MG.state.completed.includes(l.id)) || null;
};

/* Node (validate.js / tests) ke liye */
if (typeof module !== 'undefined' && module.exports) module.exports = MG;
