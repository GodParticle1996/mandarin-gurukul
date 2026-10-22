/* =====================================================================
   Mandarin Gurukul — Game renderers (1/2)
   learn | explain | meaning | recall | match | tones   (+ games-talk.js)
   Har renderer: (stage, arena, onDone) → onDone({ firstTry, total })
   Galat jawab → MG.noteMistake(phraseId) → woh phrase Revision Dojo mein.
   ===================================================================== */

MG.renderers = {};
const el = MG.el, shuffle = MG.shuffle, shake = MG.shake, esc = MG.escapeHtml;

/* ---------------- shared helpers ---------------- */
MG.g = {};
/* stage ke phrases (ladki/ladka view ke saath) */
MG.g.phrases = function (stage) {
  const all = (MG.session.level.phrases || []).map(MG.view);
  return stage && stage.ids ? all.filter(p => stage.ids.includes(p.id)) : all;
};
/* distractors: pehle isi level se, phir isi track se, phir poori app se */
MG.g.pool = function (excludeIds) {
  const lvl = MG.session.level;
  const seen = new Set(excludeIds);
  const out = [];
  const add = p => { if (!seen.has(p.id)) { seen.add(p.id); out.push(MG.view(p)); } };
  (lvl.phrases || []).forEach(add);
  (MG.levelSets[lvl.track] || []).forEach(l => (l.phrases || []).forEach(add));
  Object.values(MG.phrases).forEach(add);
  return out;
};
MG.g.take = function (list, n, keyFn) {
  const seen = new Set(), out = [];
  for (const x of list) {
    const k = keyFn(x);
    if (seen.has(k)) continue;
    seen.add(k); out.push(x);
    if (out.length >= n) break;
  }
  return out;
};
MG.g.count = function (stage, fallback, max) {
  return Math.min(stage.count || fallback, max);
};
MG.g.progress = function (i, n) {
  const d = el('div', 'dots');
  for (let k = 0; k < n; k++) d.appendChild(el('span', k < i ? 'dot past' : k === i ? 'dot now' : 'dot'));
  return d;
};
/* same pinyin, galat tones — recall quiz ke "pakdo galti" distractors */
MG.g.spokenKey = function (py, say) {
  return MG.py.analyze(py, say).syls.map(s => s.base + (s.er ? 'r' : '') + ':' + s.say).join('|');
};
MG.g.toneVariants = function (py, n, say) {
  const a = MG.py.analyze(py);
  const tones = a.syls.map(s => s.tone);
  const idx = tones.map((t, i) => i).filter(i => tones[i] !== 0);
  const out = new Set();
  const spoken = MG.g.spokenKey(py, say);
  const seenSpoken = new Set([spoken]);
  for (let guard = 0; out.size < n && guard < 40 && idx.length; guard++) {
    const t2 = tones.slice();
    const flips = idx.length > 2 && Math.random() < 0.4 ? 2 : 1;
    for (let f = 0; f < flips; f++) {
      const k = idx[Math.floor(Math.random() * idx.length)];
      const opts = [1, 2, 3, 4].filter(x => x !== tones[k]);
      t2[k] = opts[Math.floor(Math.random() * opts.length)];
    }
    const v = MG.py.retone(py, t2);
    const key = MG.g.spokenKey(v);
    if (v !== py && !seenSpoken.has(key)) { out.add(v); seenSpoken.add(key); }
  }
  return [...out];
};

/* ---------------- generic MCQ runner ----------------
   q = { prompt (html), options: [{ html, ok, cls? }], why (html), phraseId?, after (html)? } */
MG.g.mcq = function (arena, questions, onDone, opts) {
  opts = opts || {};
  let i = 0, firstTry = 0;
  const box = el('div', 'mcq');
  arena.appendChild(box);
  function show() {
    MG.voice.stop();
    const q = questions[i];
    box.innerHTML = '';
    box.appendChild(MG.g.progress(i, questions.length));
    box.appendChild(el('div', 'q-prompt', q.prompt));
    if (q.listenLine) { const audio = MG.voice.buttons(q.listenLine); if (audio) box.appendChild(audio); }
    const list = el('div', 'opts' + (opts.grid ? ' grid' : ''));
    const fb = el('div', 'feedback');
    fb.setAttribute('aria-live', 'polite');
    let tried = false, solved = false;
    const btns = shuffle(q.options).map(o => {
      const b = el('button', 'opt ' + (o.cls || ''), o.html);
      b.onclick = () => {
        if (solved) return;
        if (o.ok) {
          solved = true;
          if (!tried) firstTry++;
          b.classList.add('right');
          fb.className = 'feedback ok';
          fb.innerHTML = `✅ <b>Sahi!</b> ${q.why || ''}${q.after ? '<div class="after">' + q.after + '</div>' : ''}`;
          if (q.audio) { const audio = MG.voice.buttons(q.audio); if (audio) fb.appendChild(audio); }
          next.disabled = false;
          next.focus && next.focus();
        } else {
          tried = true;
          b.classList.add('wrong'); b.disabled = true;
          shake(b);
          if (q.phraseId) MG.noteMistake(q.phraseId);
          fb.className = 'feedback bad';
          fb.innerHTML = `❌ ${o.why || 'Yeh nahi.'} <span class="muted">Dobara try karo.</span>`;
        }
      };
      list.appendChild(b);
      return b;
    });
    box.append(list, fb);
    const next = el('button', 'btn primary', i < questions.length - 1 ? 'Agla ➜' : 'Ho gaya ✓');
    next.disabled = true;
    next.onclick = () => { if (i < questions.length - 1) { i++; show(); } else onDone({ firstTry, total: questions.length }); };
    box.appendChild(next);
    void btns;
  }
  show();
};

/* ================================================================
   LEARN — ek-ek phrase card: tasveer · pinyin stack · matlab · tip
   ================================================================ */
MG.renderers.learn = function (stage, arena, onDone) {
  const items = MG.g.phrases(stage);
  let i = 0;
  const box = el('div', 'learn');
  arena.appendChild(box);
  function show() {
    MG.voice.stop();
    const p = items[i];
    const theirs = p.who && p.who !== 'you';
    box.innerHTML = '';
    box.appendChild(MG.g.progress(i, items.length));
    const card = el('div', 'pcard');
    card.innerHTML =
      `<div class="pc-top">${MG.pv.pic(p, 'card')}`
      + (theirs ? `<span class="who">${MG.castEmoji(p.who)} ${esc(CAST[p.who].name)} bolenge</span>`
                : `<span class="who you">${MG.castEmoji('you')} Aap bologe</span>`)
      + '</div>'
      + MG.pv.line(p, { big: true })
      + `<div class="pc-hi">${esc(p.hi)}</div>`
      + (p.lit ? `<div class="pc-lit">🧩 ${esc(p.lit)}</div>` : '')
      + (p.note ? `<div class="pc-note">💡 ${esc(p.note)}</div>` : '');
    if (MG.pv.mouthCue) card.appendChild(el('div', 'mouth-cue', MG.pv.mouthCue(p)));
    const retrieval = el('button', 'btn ghost small', 'Answer chhupao · yaad se bolo');
    let hidden = false;
    retrieval.onclick = () => {
      hidden = !hidden;
      card.querySelectorAll('.pyl,.pc-note,.mouth-cue').forEach(n => { n.hidden = hidden; });
      retrieval.textContent = hidden ? 'Answer dikhao · compare karo' : 'Answer chhupao · yaad se bolo';
      retrieval.setAttribute('aria-expanded', String(!hidden));
    };
    card.appendChild(retrieval);
    const vb = MG.voice.buttons(p);
    if (vb) card.appendChild(vb);
    box.appendChild(card);
    const row = el('div', 'row');
    const said = el('button', 'btn ghost', theirs ? '👂 Samajh gaya' : '🗣️ Bol diya ×2');
    said.onclick = () => {
      said.disabled = true;
      MG.state.said[p.id] = (MG.state.said[p.id] || 0) + 1;
      MG.saveState();
      said.classList.add('said');
      said.textContent = theirs ? '✅ Badhiya!' : '✅ Shabaash!';
    };
    const next = el('button', 'btn primary', i < items.length - 1 ? 'Agla ➜' : 'Ho gaya ✓');
    next.onclick = () => { if (i < items.length - 1) { i++; show(); } else onDone({ firstTry: 0, total: 0 }); };
    if (i > 0) {
      const back = el('button', 'btn ghost small', '⬅');
      back.onclick = () => { i--; show(); };
      row.appendChild(back);
    }
    row.append(said, next);
    box.appendChild(row);
    if (!theirs) box.appendChild(el('div', 'hint', 'Tip: rangeen line ke saath haath se sur follow karo. Pehle Suno, phir Dheere; phir khud bolo. Sound hints approximate hain.'));
  }
  show();
};

/* ================================================================
   EXPLAIN — chhote concept cards (heading ek sawaal hota hai)
   ================================================================ */
MG.renderers.explain = function (stage, arena, onDone) {
  let i = 0;
  const box = el('div', 'explain');
  arena.appendChild(box);
  function show() {
    MG.voice.stop();
    const c = stage.cards[i];
    box.innerHTML = '';
    box.appendChild(MG.g.progress(i, stage.cards.length));
    const card = el('div', 'xcard');
    card.innerHTML = `<h3>❓ ${esc(c.h)}</h3>`
      + (c.visual ? MG.pv.visual(c.visual) : '')
      + `<p>${esc(c.text)}</p>`
      + (c.ex ? '<div class="xex">' + c.ex.map(x => `<div class="xex-row">${MG.pv.line(x)}<div class="xex-hi">${esc(x.hi)}</div></div>`).join('') + '</div>' : '')
      + (c.tip ? `<div class="pc-note">💡 ${esc(c.tip)}</div>` : '');
    if (c.ex) card.querySelectorAll('.xex-row').forEach((row, idx) => { const audio = MG.voice.buttons(MG.view(c.ex[idx])); if (audio) row.appendChild(audio); });
    box.appendChild(card);
    const next = el('button', 'btn primary', i < stage.cards.length - 1 ? 'Samajh gaya, aage ➜' : 'Chalo practice ✓');
    next.onclick = () => { if (i < stage.cards.length - 1) { i++; show(); } else onDone({ firstTry: 0, total: 0 }); };
    box.appendChild(next);
  }
  show();
};

/* ================================================================
   MEANING — pinyin dekho → matlab chuno
   ================================================================ */
MG.renderers.meaning = function (stage, arena, onDone) {
  const items = shuffle(MG.g.phrases(stage)).slice(0, MG.g.count(stage, 5, 8));
  const qs = items.map(p => {
    const wrong = MG.g.take(shuffle(MG.g.pool([p.id])).filter(x => x.hi !== p.hi), 3, x => x.hi);
    return {
      prompt: `<div class="q-label">Iska matlab kya hai?</div>${MG.pv.line(p, { big: true, han: false })}`,
      options: [{ html: esc(p.hi), ok: true }, ...wrong.map(w => ({ html: esc(w.hi), why: `"${esc(w.hi)}" ka pinyin alag hai: ${MG.pv.inline(w.py)}` }))],
      listenLine: p,
      why: p.note ? esc(p.note) : '',
      after: MG.pv.pic(p, 'thumb'),
      audio: p,
      phraseId: p.id,
    };
  });
  MG.g.mcq(arena, qs, onDone);
};

/* ================================================================
   RECALL — matlab dekho → sahi pinyin chuno (galat-tone wale jaal ke saath)
   ================================================================ */
MG.renderers.recall = function (stage, arena, onDone) {
  const items = shuffle(MG.g.phrases(stage)).slice(0, MG.g.count(stage, 5, 8));
  const qs = items.map(p => {
    const toneTraps = MG.g.toneVariants(p.py, 2, p.say);
    const others = MG.g.take(shuffle(MG.g.pool([p.id])).filter(x => MG.g.spokenKey(x.py, x.say) !== MG.g.spokenKey(p.py, p.say)), 3 - Math.min(2, toneTraps.length), x => x.py);
    const options = [{ html: MG.pv.inline(p.py), ok: true }]
      .concat(toneTraps.map(v => ({ html: MG.pv.inline(v), why: 'Shabd sahi, par tone galat! Tone ki line dhyaan se dekho.' })))
      .concat(others.map(o => ({ html: MG.pv.inline(o.py), why: `Yeh "${esc(o.hi)}" hai.` })));
    return {
      prompt: `${MG.pv.pic(p, 'big')}<div class="q-label">Kaise bologe?</div><div class="q-hi">${esc(p.hi)}</div>`,
      options,
      why: '',
      after: MG.pv.line(p),
      audio: p,
      phraseId: p.id,
    };
  });
  MG.g.mcq(arena, qs, onDone);
};

/* ================================================================
   MATCH — tasveer/matlab ↔ pinyin jodo
   ================================================================ */
MG.renderers.match = function (stage, arena, onDone) {
  const items = MG.g.take(shuffle(MG.g.phrases(stage)), MG.g.count(stage, 5, 6), p => p.py);
  let firstTry = 0, done = 0, selL = null;
  const missed = new Set();
  const box = el('div', 'match');
  box.appendChild(el('div', 'q-label', 'Jodi banao: baayein tasveer + matlab, daayein pinyin'));
  const cols = el('div', 'match-cols');
  const L = el('div', 'mcol'), R = el('div', 'mcol');
  const fb = el('div', 'feedback');
  items.forEach(p => {
    const a = el('button', 'mitem', `${MG.pv.pic(p, 'thumb')} ${esc(p.hi)}`);
    a.onclick = () => {
      if (a.classList.contains('right')) return;
      L.querySelectorAll('.mitem').forEach(x => x.classList.remove('sel'));
      a.classList.add('sel'); selL = { el: a, p };
    };
    L.appendChild(a);
  });
  shuffle(items).forEach(p => {
    const b = el('button', 'mitem', MG.pv.inline(p.py));
    b.onclick = () => {
      if (!selL || b.classList.contains('right')) return;
      if (selL.p.id === p.id) {
        selL.el.classList.remove('sel'); selL.el.classList.add('right'); b.classList.add('right');
        if (!missed.has(p.id)) firstTry++;
        done++; selL = null;
        fb.className = 'feedback ok'; fb.innerHTML = `✅ ${MG.pv.inline(p.py)} = ${esc(p.hi)}`;
        if (done === items.length) finish();
      } else {
        missed.add(selL.p.id);
        MG.noteMistake(selL.p.id);
        shake(b); shake(selL.el);
        fb.className = 'feedback bad'; fb.innerHTML = `❌ ${MG.pv.inline(p.py)} ka matlab "${esc(p.hi)}" hai.`;
      }
    };
    R.appendChild(b);
  });
  cols.append(L, R);
  box.append(cols, fb);
  arena.appendChild(box);
  function finish() {
    const next = el('button', 'btn primary', 'Ho gaya ✓');
    next.onclick = () => onDone({ firstTry, total: items.length });
    box.appendChild(next);
  }
};

/* ================================================================
   TONES — bina mark ka pinyin → sahi tone pattern chuno
   mode 'written' = likhe hue tones · 'say' = bolte waqt (3+3 ke baad)
   ================================================================ */
MG.renderers.tones = function (stage, arena, onDone) {
  const mode = stage.mode || 'written';
  let items = stage.items
    ? stage.items.map(x => Object.assign({}, x))
    : shuffle(MG.g.phrases(stage)).filter(p => MG.py.analyze(p.py).syls.length <= 4).slice(0, MG.g.count(stage, 5, 8));
  if (mode === 'say') items = items.filter(x => x.say || !MG.py.analyze(x.py).syls.some(s => s.sandhiApprox));
  items = shuffle(items);
  const qs = items.map(x => {
    const a = MG.py.analyze(x.py, x.say);
    const want = a.syls.map(s => (mode === 'say' ? s.say : s.tone));
    const key = t => t.join('-');
    const opts = new Map([[key(want), want]]);
    for (let guard = 0; opts.size < 4 && guard < 60; guard++) {
      const t2 = want.slice();
      const k = Math.floor(Math.random() * t2.length);
      const pool = [1, 2, 3, 4, 0].filter(v => v !== t2[k] && (v !== 0 || k > 0));
      t2[k] = pool[Math.floor(Math.random() * pool.length)];
      if (Math.random() < 0.3 && t2.length > 1) {
        const k2 = (k + 1) % t2.length;
        t2[k2] = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
      }
      opts.set(key(t2), t2);
    }
    const changed = a.syls.some(s => s.changed);
    const label = mode === 'say' ? 'Bolte waqt sur kaise chalega? (3+3 niyam yaad rakho)' : 'Kaunse tones hain?';
    return {
      prompt: `<div class="q-label">${label}</div><div class="q-strip">${esc(MG.py.strip(x.py))}</div><div class="q-hi">${esc(x.hi || '')}</div>`,
      options: [...opts.values()].map(t => ({
        html: `${MG.pv.pattern(t)}<span class="pat-n">${MG.pv.patternName(t)}</span>`,
        ok: key(t) === key(want),
        why: 'Upar ki rangeen lines se milao: kaunsa syllable ooncha, kaunsa neeche?',
        cls: 'patopt',
      })),
      why: a.syls.some(s => s.sandhiApprox) ? 'Lambi Tone 3 sequence mein grouping rhythm par depend karti hai. Yeh ek simplified practice pattern hai.' : mode === 'say' && changed
        ? `Likha ${MG.pv.patternName(a.syls.map(s => s.tone))}, par bolte ${MG.pv.patternName(want)} (3+3 → 2+3).`
        : '',
      after: MG.pv.line(x),
      audio: x,
      phraseId: x.id && MG.phrases[x.id] ? x.id : null,
    };
  });
  MG.g.mcq(arena, qs, onDone, { grid: true });
};
