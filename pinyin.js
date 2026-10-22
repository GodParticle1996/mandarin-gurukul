/* =====================================================================
   Mandarin Gurukul — Pinyin engine (pure functions: browser + Node)
   MG.py.analyze(py, say) → { syls, tokens, errors }
     syls[i] = { text, base, er, tone (likha hua), say (bola jaata),
                 changed (sandhi se badla?), chao: [Chao 1–5 points] }
   Deva hints: deva.js · HTML: pyview.js
   ===================================================================== */
(function () {
  const PY = {};

  /* ---------- tone-marked vowels → [base, tone] ---------- */
  const MARKS = {};
  [['a', 'āáǎà'], ['e', 'ēéěè'], ['i', 'īíǐì'], ['o', 'ōóǒò'], ['u', 'ūúǔù'], ['ü', 'ǖǘǚǜ']]
    .forEach(([base, set]) => [...set].forEach((ch, i) => { MARKS[ch] = [base, i + 1]; }));
  const MARKED = {};               // base+tone → marked vowel  ('a3' → 'ǎ')
  Object.entries(MARKS).forEach(([ch, [b, t]]) => { MARKED[b + t] = ch; });

  /* ---------- valid syllables ----------
     Rule table: har final ke saath kaunse initials aa sakte hain.
     '_' = koi initial nahi. y-/w- wali spellings neeche alag se.  */
  const FINAL_INITIALS = {
    a: 'b p m f d t n l g k h zh ch sh z c s _',
    ai: 'b p m d t n l g k h zh ch sh z c s _',
    an: 'b p m f d t n l g k h zh ch sh r z c s _',
    ang: 'b p m f d t n l g k h zh ch sh r z c s _',
    ao: 'b p m d t n l g k h zh ch sh r z c s _',
    e: 'm d t n l g k h zh ch sh r z c s _',
    ei: 'b p m f d n l g k h zh sh z _',
    en: 'b p m f d n g k h zh ch sh r z c s _',
    eng: 'b p m f d t n l g k h zh ch sh r z c s _',
    er: '_',
    o: 'b p m f l _',
    ou: 'p m f d t n l g k h zh ch sh r z c s _',
    ong: 'd t n l g k h zh ch r z c s',
    i: 'b p m d t n l j q x z c s zh ch sh r',      // z/c/s/zh/ch/sh/r + i = "buzz" vowel
    ia: 'd l j q x',
    iao: 'b p m d t n l j q x',
    ie: 'b p m d t n l j q x',
    iu: 'm d n l j q x',
    ian: 'b p m d t n l j q x',
    in: 'b p m n l j q x',
    iang: 'n l j q x',
    ing: 'b p m d t n l j q x',
    iong: 'j q x',
    u: 'b p m f d t n l g k h zh ch sh r z c s j q x',   // j/q/x + u = ü
    ua: 'g k h zh ch sh r',
    uo: 'd t n l g k h zh ch sh r z c s',
    uai: 'g k h zh ch sh',
    ui: 'd t g k h zh ch sh r z c s',
    uan: 'd t n l g k h zh ch sh r z c s j q x',
    un: 'd t l g k h zh ch sh r z c s j q x',
    uang: 'g k h zh ch sh',
    'ü': 'n l',
    'üe': 'n l',
    ue: 'j q x',
  };
  const Y_FINALS = 'a ao an ang e i in ing o ong ou u ue uan un';
  const W_FINALS = 'a ai an ang ei en eng o u';
  const INTERJECTIONS = 'm n ng hm';

  const SYL = new Set();
  Object.entries(FINAL_INITIALS).forEach(([fin, inits]) =>
    inits.split(' ').forEach(ini => SYL.add((ini === '_' ? '' : ini) + fin)));
  Y_FINALS.split(' ').forEach(f => SYL.add('y' + f));
  W_FINALS.split(' ').forEach(f => SYL.add('w' + f));
  const INTERJ = new Set(INTERJECTIONS.split(' '));
  INTERJ.forEach(s => SYL.add(s));
  PY.isSyllable = s => SYL.has(s);
  PY.syllableCount = () => SYL.size;
  PY.allSyllables = () => [...SYL];

  /* ---------- helpers ---------- */
  const VOWEL_START = /^[aoe]/;
  const isLetter = ch => /[a-zü]/.test(ch) || !!MARKS[ch];

  /* tone mark kis vowel par lagna chahiye (a/e > ou ka o > aakhri vowel) */
  PY.markIndex = function (base) {
    const core = base;
    if (core.includes('a')) return core.indexOf('a');
    if (core.includes('e')) return core.indexOf('e');
    if (core.includes('ou')) return core.indexOf('o');
    for (let i = core.length - 1; i >= 0; i--) if ('iouü'.includes(core[i])) return i;
    return -1;            // m / n / ng interjections
  };

  /* base + tone → pinyin syllable with the mark in the right place */
  PY.mark = function (base, tone, er) {
    let s = base;
    const k = PY.markIndex(base);
    if (tone >= 1 && tone <= 4 && k >= 0) s = base.slice(0, k) + MARKED[base[k] + tone] + base.slice(k + 1);
    return er ? s + 'r' : s;
  };

  /* ---------- word → syllables (DP, fewest syllables wins) ---------- */
  function segmentPlain(plain) {
    const n = plain.length;
    const best = new Array(n + 1).fill(null);
    best[0] = [];
    for (let i = 1; i <= n; i++) {
      for (let j = Math.max(0, i - 7); j < i; j++) {
        if (!best[j]) continue;
        const piece = plain.slice(j, i);
        if (j > 0 && VOWEL_START.test(piece)) continue;      // a/o/e se shuru → apostrophe chahiye
        if (INTERJ.has(piece) && !(j === 0 && i === n)) continue;   // 嗯 "n"/"ng" sirf akela word
        let ok = null;
        if (SYL.has(piece)) ok = { base: piece, er: false };
        else if (piece.length > 1 && piece.endsWith('r') && SYL.has(piece.slice(0, -1)) && piece !== 'er')
          ok = { base: piece.slice(0, -1), er: true };
        if (!ok) continue;
        const cand = best[j].concat([{ ...ok, from: j, to: i }]);
        if (!best[i] || cand.length < best[i].length) best[i] = cand;
      }
    }
    return best[n];
  }

  /* one chunk (no spaces, no apostrophes) → syllable objects or null */
  function segmentChunk(chunk, errors) {
    const chars = [...chunk];
    const plainChars = [], tones = [];
    for (const ch of chars) {
      const low = ch.toLowerCase();
      if (MARKS[low]) { plainChars.push(MARKS[low][0]); tones.push(MARKS[low][1]); }
      else { plainChars.push(low); tones.push(0); }
    }
    const plain = plainChars.join('');
    const seg = segmentPlain(plain);
    if (!seg) return null;
    return seg.map(p => {
      const text = chars.slice(p.from, p.to).join('');
      const marks = [];
      for (let k = p.from; k < p.to; k++) if (tones[k]) marks.push([k - p.from, tones[k]]);
      let tone = 0;
      if (marks.length > 1) errors.push(`"${text}": ek syllable mein do tone marks`);
      if (marks.length >= 1) {
        tone = marks[0][1];
        const want = PY.markIndex(p.base);
        if (marks[0][0] !== want)
          errors.push(`"${text}": tone mark galat vowel par (sahi: "${PY.mark(p.base, tone, p.er)}")`);
      }
      return { text, base: p.base, er: p.er, tone };
    });
  }

  /* ---------- parse a pinyin line ----------
     tokens: {t:'syl', ...} | {t:'punct', text} | {t:'foreign', text}
     Words = space-separated; apostrophe = syllable boundary (Xī'ān). */
  PY.parse = function (py) {
    const errors = [];
    const tokens = [];
    const src = String(py || '').normalize('NFC').replace(/’/g, "'");
    const re = /[A-Za-zÀ-ɏüÜ']+|[0-9]+|[^\sA-Za-z0-9À-ɏüÜ']+/g;
    let m, word = 0;
    while ((m = re.exec(src))) {
      const tok = m[0];
      if (/^[0-9]+$/.test(tok)) { tokens.push({ t: 'foreign', text: tok }); continue; }
      if (!/[A-Za-zÀ-ɏüÜ]/.test(tok)) { tokens.push({ t: 'punct', text: tok }); continue; }
      const chunks = tok.split("'").filter(Boolean);
      const out = [];
      let failed = false;
      for (const c of chunks) {
        const seg = segmentChunk(c, errors);
        if (!seg) { failed = true; break; }
        out.push(...seg);
      }
      if (failed) {
        // English words (KTV, WiFi, iPhone, OK) — andar capital ho ya jaana-pehchana ho
        const looksForeign = /^[A-Za-z]+$/.test(tok) && (/[A-Z]/.test(tok.slice(1)) || /^(ok|app|wifi)$/i.test(tok));
        if (looksForeign) tokens.push({ t: 'foreign', text: tok });
        else { errors.push(`"${tok}": pinyin syllable samajh nahi aaya`); tokens.push({ t: 'bad', text: tok }); }
        continue;
      }
      out.forEach((s, k) => tokens.push({ t: 'syl', ...s, w: word, first: k === 0, cap: s.text[0] !== s.text[0].toLowerCase() }));
      word++;
    }
    return { tokens, errors };
  };

  /* ---------- tone sandhi + Chao contour ----------
     3+3 → 2+3. Lambe 3-runs mein pinyin word boundaries ko grouping ka
     APPROXIMATION maante hain: pehle word ke andar, phir bachi hui pairs
     right-to-left. Isliye wǒ hěn hǎo → 3-2-3, bǎoguǎn hǎo → 2-2-3.
     Real prosody meaning, stress aur pauses par bhi tikti hai; sirf spelling
     se ek perfect spoken pattern nahi nikal sakte. 3+ runs ko sandhiApprox
     mark karte hain. Content ka `say` reviewed pattern de to woh authoritative
     hai (us par dobara automatic sandhi nahi lagta).
     Background: Cheng (1987), On the prosodic hierarchy and tone sandhi:
     https://twpl.library.utoronto.ca/index.php/twpl/article/view/6403
     一 / 不 ke badlaav content mein PEHLE SE bole-jaane wale roop mein likhe hain
     (yí ge, bú shì) — validate.js inko check karta hai.
     T3 beech mein = "half third" (21, sirf neeche); group ke end par 214.
     Neutral ki uchaai pichhle tone par tikti hai.                        */
  const NEUTRAL_AFTER = { 1: 2, 2: 3, 3: 4, 4: 1 };
  PY.spoken = function (tokens, sayTokens) {
    const syls = tokens.filter(t => t.t === 'syl');
    const sayS = sayTokens ? sayTokens.filter(t => t.t === 'syl') : null;
    const out = syls.map((s, i) => ({ ...s, say: sayS && sayS[i] ? sayS[i].tone : s.tone, changed: false, sandhiApprox: false }));
    // group boundaries: punctuation / foreign tokens
    const groupOf = [];
    let g = 0, si = 0;
    tokens.forEach(t => {
      if (t.t === 'syl') groupOf[si++] = g;
      else g++;
    });
    if (!sayS) {
      for (let i = 0; i < out.length;) {
        if (out[i].say !== 3) { i++; continue; }
        let j = i;
        while (j + 1 < out.length && out[j + 1].say === 3 && groupOf[j + 1] === groupOf[i]) j++;
        // Resolve inside each pinyin word first. A three-syllable word is
        // treated as one unit; its actual rhythm can still need a `say` override.
        for (let k = i; k < j; k++) {
          if (out[k].w === out[k + 1].w) out[k].say = 2;
        }
        // Across words, pair from the right rather than changing every 3.
        // This preserves the initial low tone in wǒ + (hěn hǎo).
        for (let k = j - 1; k >= i; k--) {
          if (out[k].say === 3 && out[k + 1].say === 3) out[k].say = 2;
        }
        if (j - i >= 2) {
          for (let k = i; k <= j; k++) out[k].sandhiApprox = true;
        }
        i = j + 1;
      }
    }
    out.forEach((s, i) => {
      s.g = groupOf[i];
      s.changed = s.say !== s.tone;
      const nextInGroup = out.slice(i + 1).filter((_, k) => groupOf[i + 1 + k] === groupOf[i]);
      const lastFull = !nextInGroup.some(x => x.say !== 0);
      if (s.say === 1) s.chao = [5, 5];
      else if (s.say === 2) s.chao = [3, 5];
      else if (s.say === 4) s.chao = [5, 1];
      else if (s.say === 3) s.chao = (lastFull && nextInGroup.length === 0) ? [2, 1, 4] : [2, 1];
      else {
        const prev = i > 0 && groupOf[i - 1] === groupOf[i] ? out[i - 1] : null;
        const h = !prev ? 3 : prev.say === 0 ? prev.chao[0] : NEUTRAL_AFTER[prev.say];
        s.chao = [h];
      }
    });
    return out;
  };

  /* ---------- one-call API ---------- */
  PY.analyze = function (py, say) {
    const p = PY.parse(py);
    let sayTokens = null;
    const errors = p.errors.slice();
    if (say) {
      const q = PY.parse(say);
      errors.push(...q.errors.map(e => 'say: ' + e));
      const a = p.tokens.filter(t => t.t === 'syl').map(t => t.base + (t.er ? 'r' : ''));
      const b = q.tokens.filter(t => t.t === 'syl').map(t => t.base + (t.er ? 'r' : ''));
      if (a.join(' ') !== b.join(' ')) errors.push(`say "${say}" ke syllables py se alag hain`);
      else sayTokens = q.tokens;
    }
    return { tokens: p.tokens, syls: PY.spoken(p.tokens, sayTokens), errors };
  };

  /* tone pattern string: "3-3" (likha) / "2-3" (bola) */
  PY.pattern = function (syls, which) {
    return syls.map(s => (which === 'say' ? s.say : s.tone)).join('-');
  };

  /* tone marks hata do: "Nǐ hǎo!" → "Ni hao!" */
  PY.strip = function (py) {
    return [...String(py).normalize('NFC')].map(ch => {
      const low = ch.toLowerCase();
      if (!MARKS[low]) return ch;
      const b = MARKS[low][0];
      return ch === low ? b : b.toUpperCase();
    }).join('');
  };

  /* same line, different tones (quiz distractors): tones = [t1, t2, ...] */
  PY.retone = function (py, tones) {
    const { tokens } = PY.parse(py);
    let si = 0, out = '', prevWord = -1;
    tokens.forEach(t => {
      if (t.t === 'syl') {
        const tone = tones[si] != null ? tones[si] : t.tone;
        let s = PY.mark(t.base, tone, t.er);
        if (t.cap) s = s[0].toUpperCase() + s.slice(1);
        const needsApos = !t.first && VOWEL_START.test(t.base);
        if (t.w !== prevWord && out && !/[\s(“"]$/.test(out)) out += ' ';
        out += (needsApos ? "'" : '') + s;
        prevWord = t.w;
        si++;
      } else if (t.t === 'punct') out += t.text;
      else { out += (out && !/\s$/.test(out) ? ' ' : '') + t.text; prevWord = -1; }
    });
    return out;
  };

  /* Han characters gino (punctuation / Latin / digits chhod ke) */
  PY.hanCount = function (zh) {
    return [...String(zh || '')].filter(ch => /\p{Script=Han}/u.test(ch)).length;
  };

  if (typeof MG !== 'undefined') MG.py = PY;
  if (typeof module !== 'undefined' && module.exports) module.exports = PY;
})();
