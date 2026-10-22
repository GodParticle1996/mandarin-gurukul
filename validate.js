#!/usr/bin/env node
/* =====================================================================
   Mandarin Gurukul — content validator
   node validate.js                 → saare tracks
   node validate.js --track food    → sirf ek track
   node validate.js --py            → + pypinyin cross-check (.venv chahiye)
   Exit 1 agar koi ERROR ho. WARN = dekh lo, zaroori nahi.
   ===================================================================== */
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
const { execFileSync } = require('child_process');
const DIR = __dirname;
const args = process.argv.slice(2);
const onlyTrack = args.includes('--track') ? args[args.indexOf('--track') + 1] : null;
const usePy = args.includes('--py');

/* ---------- load engine + data in a sandbox (same order as index.html) ---------- */
const ENGINE = ['core.js', 'pinyin.js', 'deva.js', 'data-core.js'];
/* --track X → sirf data-X.js load hoti hai (parallel likhte waqt doosri adhoori file beech mein na aaye) */
const DATA = fs.readdirSync(DIR)
  .filter(f => /^data-.+\.js$/.test(f) && f !== 'data-core.js')
  .filter(f => !onlyTrack || f === `data-${onlyTrack}.js` || f.startsWith(`data-${onlyTrack}-`))
  .sort();
const sandbox = { console, Math, Date, JSON, Object, Array, String, Number, Boolean, Error, Map, Set, RegExp, Symbol };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const engineSrc = ENGINE.map(f => `/* ${f} */\n` + fs.readFileSync(path.join(DIR, f), 'utf8')).join('\n;\n')
  + '\nglobalThis.MG = MG; globalThis.__CAST = CAST; globalThis.__RANKS = RANKS;';
try { vm.runInContext(engineSrc, sandbox, { filename: 'engine.js' }); }
catch (e) { console.log('❌ ENGINE LOAD FAILED:', e.message); process.exit(1); }
let loadFailed = false;
DATA.forEach(f => {
  try { vm.runInContext(fs.readFileSync(path.join(DIR, f), 'utf8'), sandbox, { filename: f }); }
  catch (e) {
    loadFailed = true;
    const at = (e.stack || '').split('\n').find(l => l.includes(f)) || '';
    console.log(`❌ ${f} load nahi hui: ${e.message}  ${at.trim()}`);
  }
});
if (loadFailed) process.exit(1);
const MG = sandbox.MG, CAST = sandbox.__CAST, PY = MG.py;

/* ---------- reporting ---------- */
const errors = [], warns = [];
const E = (where, msg) => errors.push(`${where}: ${msg}`);
const W = (where, msg) => warns.push(`${where}: ${msg}`);
const pyLines = [];      // for --py

/* ---------- Hinglish lint (ADHD rule: naam dohraao, pronoun nahi) ---------- */
const STANDIN = /\b(isse|usse|iska|uska|iski|uski|iske|uske|inka|unka|wahan|vahan)\b/i;
function lint(where, text) {
  if (text == null) return;
  const t = String(text);
  const m = t.match(STANDIN);
  if (m) W(where, `"${m[0]}" ki jagah asli naam likho (ADHD niyam): "${t.slice(0, 70)}…"`);
  if (t.length > 280) W(where, `text bahut lamba (${t.length} chars) — 2–3 chhote sentence rakho`);
}

/* ---------- one Chinese line: { zh, py, hi, say? } ---------- */
function checkLine(where, o, opt = {}) {
  if (!o || typeof o !== 'object') return E(where, 'object nahi hai');
  if (opt.needZh !== false && (!o.zh || !/\p{Script=Han}/u.test(o.zh))) E(where, 'zh (Chinese akshar) missing');
  if (!o.py || typeof o.py !== 'string') return E(where, 'py (pinyin) missing');
  if (opt.needHi !== false && !o.hi) E(where, 'hi (Hinglish matlab) missing');
  if (/[，。？！]/.test(o.py)) E(where, `py mein Chinese punctuation hai — ASCII , . ? ! use karo: "${o.py}"`);
  const a = PY.analyze(o.py, o.say);
  a.errors.forEach(e => E(where, `py "${o.py}": ${e}`));
  a.tokens.filter(t => t.t === 'foreign' && !/^\d+$/.test(t.text)).forEach(t => {
    if (!o.zh || !String(o.zh).toLowerCase().includes(t.text.toLowerCase()))
      E(where, `"${t.text}" zh mein nahi hai — typo ya tone mark bhool gaye?`);
  });
  lint(where + '.hi', o.hi);
  if (!o.zh || a.errors.length) return a;

  /* syllable count = Han akshar (erhua = X + 儿 = 2 akshar; digits ek-ek karke) */
  const pyCount = a.syls.reduce((n, s) => n + (s.er ? 2 : 1), 0);
  const pyDigits = a.tokens.filter(t => t.t === 'foreign' && /^\d+$/.test(t.text)).map(t => t.text).join('');
  const zhDigits = (String(o.zh).match(/\d/g) || []).join('');
  const digitsSpoken = zhDigits && zhDigits !== pyDigits;
  const units = [...String(o.zh)].filter(ch => /\p{Script=Han}/u.test(ch) || (digitsSpoken && /\d/.test(ch)));
  if (pyCount !== units.length) {
    E(where, `syllables (${pyCount}) ≠ Chinese akshar (${units.length}): "${o.zh}" / "${o.py}"`);
    return a;
  }
  const erCount = a.syls.filter(s => s.er).length;
  if (erCount > (String(o.zh).match(/儿/g) || []).length) E(where, `erhua "r" hai par zh mein 儿 nahi: "${o.zh}"`);

  /* 一 / 不 : content mein BOLA jaane wala roop likhna hai */
  let pos = 0;
  const at = a.syls.map(s => { const p = pos; pos += s.er ? 2 : 1; return p; });
  a.syls.forEach((s, i) => {
    const ch = units[at[i]];
    const next = a.syls[i + 1] && a.syls[i + 1].g === s.g ? a.syls[i + 1] : null;
    const nextCh = next ? units[at[i + 1]] : null;
    if (ch === '不') {
      if (s.base !== 'bu') E(where, `不 ka pinyin "bu" hona chahiye, mila "${s.text}"`);
      else if (next && s.tone === 4 && next.tone === 4) E(where, `不 + 4th tone → "bú" likho (bú shì, bú yào): "${o.py}"`);
      else if (s.tone === 2 && !(next && next.tone === 4)) E(where, `"bú" sirf 4th tone se pehle — yahan "bù" likho: "${o.py}"`);
    }
    if (ch === '一' && s.base === 'yi' && next) {
      const before4 = next.tone === 4 || nextCh === '个';
      if (s.tone === 4 && before4) E(where, `一 + 4th tone (ya 个) → "yí" likho (yí ge, yíyàng): "${o.py}"`);
      if (s.tone === 2 && !before4) E(where, `"yí" sirf 4th tone (ya 个) se pehle — yahan "yì" (ya ginti mein "yī"): "${o.py}"`);
    }
  });
  pyLines.push({ where, zh: o.zh, syls: a.syls.map(s => [s.base, s.tone, s.er ? 1 : 0]) });
  return a;
}

/* pinyin-only choice (quiz option etc.) — zh optional */
function checkPyOnly(where, py) {
  if (typeof py !== 'string' || !py.trim()) return E(where, 'py khaali');
  PY.parse(py).errors.forEach(e => E(where, `py "${py}": ${e}`));
}

/* ---------- stage validators ---------- */
const SCORED = new Set(['quiz', 'meaning', 'recall', 'tones', 'build', 'match', 'bins', 'dialogue']);
const AUDIO_LATER = new Set(['listen', 'hear-tone', 'shadow', 'speak']);   // voice feature aane par
function checkChoiceList(where, choices, min, max) {
  if (!Array.isArray(choices) || choices.length < min || choices.length > max)
    return E(where, `choices ${min}–${max} chahiye`), false;
  return true;
}

const STAGE = {
  learn(st, where, level) {
    (st.ids || []).forEach(id => { if (!level._ids.has(id)) E(where, `ids mein "${id}" is level ka phrase nahi`); });
  },
  explain(st, where) {
    if (!Array.isArray(st.cards) || st.cards.length < 1 || st.cards.length > 5) return E(where, 'cards 1–5 chahiye');
    st.cards.forEach((c, i) => {
      const w = `${where}.cards[${i}]`;
      if (!c.h) E(w, 'h (sawaal wali heading) missing');
      if (!c.text) E(w, 'text missing');
      lint(w + '.h', c.h); lint(w + '.text', c.text); lint(w + '.tip', c.tip);
      (c.ex || []).forEach((x, k) => checkLine(`${w}.ex[${k}]`, x));
      if (c.visual && !['tonechart', 'tone1', 'tone2', 'tone3', 'tone4', 'tone0', 'badges', 'sandhi33', 'mouth'].includes(c.visual))
        E(w, `visual "${c.visual}" anjaan`);
    });
  },
  quiz(st, where) {
    if (!Array.isArray(st.questions) || !st.questions.length) return E(where, 'questions missing');
    st.questions.forEach((q, i) => {
      const w = `${where}.q[${i}]`;
      if (!q.q) E(w, 'q (sawaal) missing');
      lint(w, q.q); lint(w + '.why', q.why);
      if (!q.why) E(w, 'why (samjhaana) missing');
      if (!checkChoiceList(w, q.choices, 2, 5)) return;
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) E(w, 'answer index galat');
      q.choices.forEach((c, k) => {
        if (typeof c === 'string') { if (!c.trim()) E(w, `choice ${k} khaali`); lint(`${w}.c${k}`, c); }
        else if (c && c.py) { if (c.zh) checkLine(`${w}.c${k}`, c, { needHi: false }); else checkPyOnly(`${w}.c${k}`, c.py); }
        else E(w, `choice ${k}: string ya { py } chahiye`);
      });
    });
  },
  meaning(st, where, level) { autoCount(st, where, level); },
  recall(st, where, level) { autoCount(st, where, level); },
  match(st, where, level) { autoCount(st, where, level, 6); },
  tones(st, where, level) {
    if (st.mode && !['say', 'written'].includes(st.mode)) E(where, 'mode "say" ya "written"');
    if (st.items) {
      if (!Array.isArray(st.items) || st.items.length < 3) return E(where, 'items kam se kam 3');
      st.items.forEach((x, i) => checkLine(`${where}.items[${i}]`, x));
    } else autoCount(st, where, level);
  },
  dialogue(st, where) {
    if (!st.title) E(where, 'title missing');
    lint(where + '.title', st.title);
    if (!Array.isArray(st.lines) || st.lines.length < 3) return E(where, 'lines kam se kam 3');
    let interactive = 0;
    st.lines.forEach((l, i) => {
      const w = `${where}.lines[${i}]`;
      if (!CAST[l.who]) E(w, `who "${l.who}" CAST mein nahi (data-core.js)`);
      checkLine(w, l);
      if (l.choices) {
        interactive++;
        if (l.who !== 'you') E(w, 'choices sirf "you" wali line par');
        if (!checkChoiceList(w + '.choices', l.choices, 1, 3)) return;
        l.choices.forEach((c, k) => {
          const cw = `${w}.choices[${k}]`;
          if (!c || !c.py) return E(cw, '{ py, hi, why } chahiye');
          if (c.zh) checkLine(cw, c); else checkPyOnly(cw, c.py);
          if (!c.why) E(cw, 'why missing (galat kyun hai)');
          lint(cw + '.why', c.why);
        });
      }
    });
    if (!interactive) E(where, 'kam se kam ek "you" line par choices do (dialogue interactive ho)');
    st._scored = interactive > 0;
  },
  build(st, where) {
    if (!Array.isArray(st.items) || !st.items.length) return E(where, 'items missing');
    st.items.forEach((it, i) => {
      const w = `${where}.items[${i}]`;
      checkLine(w, it);
      const words = PY.strip(it.py).toLowerCase().replace(/[^a-zü' ]/g, ' ').split(/\s+/).filter(Boolean);
      const blocks = it.blocks || null;
      if (blocks) {
        const joined = PY.strip(blocks.join(' ')).toLowerCase().replace(/[^a-zü' ]/g, ' ').split(/\s+/).filter(Boolean);
        if (joined.join(' ') !== words.join(' ')) E(w, `blocks jod ke py nahi banta: [${blocks.join(' | ')}] vs "${it.py}"`);
        if (blocks.length < 3) E(w, 'blocks kam se kam 3');
        blocks.forEach(b => checkPyOnly(w + '.block', b));
      } else if (words.length < 3) E(w, 'sentence mein kam se kam 3 words (ya blocks do)');
      (it.extra || []).forEach(x => checkPyOnly(w + '.extra', x));
    });
  },
  bins(st, where) {
    if (!st.q) E(where, 'q missing');
    if (!Array.isArray(st.bins) || st.bins.length < 2 || st.bins.length > 4) return E(where, 'bins 2–4');
    const ids = new Set(st.bins.map(b => b.id));
    st.bins.forEach(b => { if (!b.id || !b.label) E(where, 'bin ko id + label chahiye'); });
    if (!Array.isArray(st.items) || st.items.length < 4) return E(where, 'items kam se kam 4');
    st.items.forEach((it, i) => {
      const w = `${where}.items[${i}]`;
      if (!ids.has(it.bin)) E(w, `bin "${it.bin}" anjaan`);
      if (it.py) checkPyOnly(w, it.py); else if (!it.text) E(w, 'py ya text chahiye');
    });
  },
};
function autoCount(st, where, level, max = 8) {
  (st.ids || []).forEach(id => { if (!level._ids.has(id)) E(where, `ids mein "${id}" is level ka phrase nahi`); });
  const pool = st.ids ? st.ids.length : level.phrases.length;
  if (pool < 4) E(where, `${st.type} ke liye kam se kam 4 phrases chahiye (hain ${pool})`);
  if (st.count != null && (st.count < 3 || st.count > max)) E(where, `count 3–${max}`);
}

/* ---------- walk everything ---------- */
const seenLevel = new Set(), seenPhrase = new Map();
const summary = [];
const castKeys = Object.keys(CAST);
MG.tracks.forEach(track => {
  if (onlyTrack && track.id !== onlyTrack) return;
  const levels = MG.levelSets[track.id] || [];
  if (!levels.length) { W(track.id, 'abhi koi level nahi'); summary.push([track.id, 0, 0]); return; }
  let nPhr = 0;
  levels.forEach((level, li) => {
    const where = `${track.id}/${level.id || '#' + li}`;
    if (!level.id) E(where, 'id missing');
    else if (seenLevel.has(level.id)) E(where, 'level id duplicate');
    seenLevel.add(level.id);
    if (level.id && !new RegExp(`^${track.prefix}-\\d{2}$`).test(level.id)) E(where, `id format "${track.prefix}-NN" chahiye`);
    ['icon', 'title', 'goal'].forEach(k => { if (!level[k]) E(where, `${k} missing`); });
    if (level.title && level.title.length > 48) W(where, 'title 48 chars se lamba');
    lint(where + '.goal', level.goal);

    /* scene — problem first */
    const sc = level.scene;
    if (!sc) E(where, 'scene missing (level problem se shuru hota hai)');
    else {
      ['img', 'text', 'ask'].forEach(k => { if (!sc[k]) E(where + '.scene', `${k} missing`); });
      lint(where + '.scene.text', sc.text); lint(where + '.scene.ask', sc.ask);
      if (checkChoiceList(where + '.scene', sc.choices, 2, 4)) {
        if (sc.choices.filter(c => c.ok).length !== 1) E(where + '.scene', 'exactly ek choice ok:true');
        sc.choices.forEach((c, k) => {
          const w = `${where}.scene.c${k}`;
          if (!c.why) E(w, 'why missing');
          lint(w + '.why', c.why);
          if (c.py) { if (c.zh) checkLine(w, c, { needHi: false }); else checkPyOnly(w, c.py); }
          else if (!c.text) E(w, 'py ya text chahiye');
        });
      }
    }

    /* phrases */
    const phrases = level.phrases || [];
    level._ids = new Set(phrases.map(p => p.id));
    if (phrases.length < 4 || phrases.length > 14) E(where, `phrases 4–14 chahiye (hain ${phrases.length})`);
    phrases.forEach((p, i) => {
      const w = `${where}.phrases[${p.id || i}]`;
      if (!p.id) return E(w, 'id missing');
      if (!/^[a-z0-9-]+$/.test(p.id)) E(w, 'id sirf a-z 0-9 - mein');
      if (seenPhrase.has(p.id)) E(w, `phrase id duplicate (pehle ${seenPhrase.get(p.id)})`);
      seenPhrase.set(p.id, level.id);
      if (p.who && !castKeys.includes(p.who)) E(w, `who "${p.who}" CAST mein nahi`);
      if (!p.img) W(w, 'img (emoji) missing');
      else if (/[A-Za-z]/.test(p.img) && !p.img.startsWith('photo:')) E(w, 'img emoji hona chahiye (ya photo:key)');
      checkLine(w, p);
      if (p.f) checkLine(w + '.f', p.f);
      lint(w + '.note', p.note); lint(w + '.lit', p.lit);
      nPhr++;
    });

    /* stages */
    const stages = level.stages || [];
    if (stages.length < 3) E(where, 'kam se kam 3 stages');
    let scored = 0;
    stages.forEach((st, si) => {
      const w = `${where}.stages[${si}:${st.type}]`;
      if (AUDIO_LATER.has(st.type)) return W(w, 'audio stage — voice feature aane tak skip hoga');
      if (!STAGE[st.type]) return E(w, `stage type "${st.type}" anjaan`);
      STAGE[st.type](st, w, level);
      if (SCORED.has(st.type) && (st.type !== 'dialogue' || st._scored)) scored++;
    });
    if (scored < 2) E(where, `kam se kam 2 quiz-type stages chahiye (hain ${scored})`);
  });
  summary.push([track.id, levels.length, nPhr]);
});

/* ---------- optional pypinyin cross-check ---------- */
if (usePy) {
  const py = path.join(DIR, '.venv', 'bin', 'python');
  if (!fs.existsSync(py)) console.log('ℹ️  --py: .venv nahi mila (python3 -m venv .venv && .venv/bin/pip install pypinyin)');
  else {
    const tmp = path.join(os.tmpdir(), `mg-py-${process.pid}.json`);
    fs.writeFileSync(tmp, JSON.stringify(pyLines));
    try {
      const out = execFileSync(py, ['-I', path.join(DIR, 'tools', 'pycheck.py'), tmp], { encoding: 'utf8' });
      JSON.parse(out).forEach(x => W(x.where, 'pypinyin: ' + x.msg));
    } catch (e) { console.log('ℹ️  pycheck fail:', e.message.split('\n')[0]); }
    fs.unlinkSync(tmp);
  }
}

/* ---------- report ---------- */
console.log('=== Mandarin Gurukul — content check ===');
summary.forEach(([t, l, p]) => console.log(`  ${t.padEnd(10)} ${String(l).padStart(2)} levels  ${String(p).padStart(4)} phrases`));
if (warns.length) { console.log(`\n⚠️  ${warns.length} warnings`); warns.slice(0, 60).forEach(w => console.log('  WARN', w)); if (warns.length > 60) console.log(`  … +${warns.length - 60} aur`); }
if (errors.length) { console.log(`\n❌ ${errors.length} errors`); errors.slice(0, 80).forEach(e => console.log('  ERR ', e)); if (errors.length > 80) console.log(`  … +${errors.length - 80} aur`); }
else console.log('\n✅ 0 errors');
process.exit(errors.length ? 1 : 0);
