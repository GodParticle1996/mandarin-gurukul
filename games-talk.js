/* =====================================================================
   Mandarin Gurukul — Game renderers (2/2)
   quiz | dialogue | build | bins
   ===================================================================== */

/* choice (string ya { py }) → html */
MG.g.choiceHtml = function (c) {
  if (typeof c === 'string') return esc(c);
  return MG.pv.inline(c.py) + (c.hi ? `<span class="opt-hi">${esc(c.hi)}</span>` : '');
};
/* pinyin kisi level-phrase se milta hai? (galti → us phrase ka Dojo card) */
MG.g.phraseByPy = function (py) {
  const norm = s => MG.py.strip(String(s)).toLowerCase().replace(/[^a-zü]/g, '');
  const n = norm(py);
  return (MG.session.level.phrases || []).find(p => norm(p.py) === n) || null;
};

/* ================================================================
   QUIZ — situation wale sawaal
   ================================================================ */
MG.renderers.quiz = function (stage, arena, onDone) {
  const qs = stage.questions.map(q => {
    const right = q.choices[q.answer];
    const hit = typeof right === 'object' ? MG.g.phraseByPy(right.py) : null;
    return {
      prompt: `<div class="q-text">${esc(q.q)}</div>`,
      options: q.choices.map((c, k) => ({ html: MG.g.choiceHtml(c), ok: k === q.answer, why: esc(q.why) })),
      why: esc(q.why),
      after: typeof right === 'object' && right.py ? MG.pv.line(right) : '',
      audio: hit ? MG.view(hit) : right,
      phraseId: hit ? hit.id : null,
    };
  });
  MG.g.mcq(arena, qs, onDone);
};

/* ================================================================
   DIALOGUE — comic strip. "you" line par choices ho to pehle chuno.
   ================================================================ */
MG.renderers.dialogue = function (stage, arena, onDone) {
  const lines = stage.lines.map(l => (l.who === 'you' ? MG.view(l) : l));
  let i = 0, firstTry = 0, total = 0;
  const box = el('div', 'dlg');
  box.appendChild(el('div', 'dlg-title', `🎬 ${esc(stage.title)}`));
  const strip = el('div', 'dlg-strip');
  const ctrl = el('div', 'dlg-ctrl');
  box.append(strip, ctrl);
  arena.appendChild(box);

  function bubble(l) {
    const mine = l.who === 'you';
    const b = el('div', 'bub ' + (mine ? 'me' : 'them'));
    const c = CAST[l.who] || CAST.stranger;
    b.innerHTML = `<div class="bub-who">${MG.castEmoji(l.who)}<span>${esc(mine ? 'Aap' : c.name)}</span></div>`
      + `<div class="bub-body">${MG.pv.line(l)}<div class="bub-hi blur" title="Tap: matlab dekho">${esc(l.hi)}</div></div>`;
    const hi = b.querySelector('.bub-hi');
    hi.setAttribute('role', 'button'); hi.setAttribute('tabindex', '0');
    hi.onclick = () => hi.classList.remove('blur');
    hi.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hi.click(); } };
    if (mine) hi.classList.remove('blur');
    const vb = MG.voice.buttons(l, l.who);
    if (vb) b.querySelector('.bub-who').appendChild(vb);
    return b;
  }

  function step() {
    MG.voice.stop();
    ctrl.innerHTML = '';
    if (i >= lines.length) return finish();
    const l = lines[i];
    if (l.who === 'you' && l.choices) {
      total++;
      const ask = el('div', 'bub me ask', `<div class="bub-who">${MG.castEmoji('you')}<span>Aapki baari — kya bologe?</span></div>`);
      strip.appendChild(ask);
      ask.scrollIntoView({ behavior: 'smooth', block: 'end' });
      const opts = el('div', 'opts');
      const fb = el('div', 'feedback');
      let tried = false;
      shuffle([{ py: l.py, hi: l.hi, ok: true }, ...l.choices]).forEach(o => {
        const btn = el('button', 'opt', MG.pv.inline(o.py) + (o.hi ? `<span class="opt-hi">${esc(o.hi)}</span>` : ''));
        btn.onclick = () => {
          if (o.ok) {
            if (!tried) firstTry++;
            ask.remove();
            strip.appendChild(bubble(l));
            i++;
            step();
          } else {
            tried = true;
            btn.classList.add('wrong'); btn.disabled = true; shake(btn);
            const hit = MG.g.phraseByPy(l.py);
            if (hit) MG.noteMistake(hit.id);
            fb.className = 'feedback bad';
            fb.innerHTML = `❌ ${esc(o.why || 'Yeh is moment ke liye sahi nahi.')}`;
          }
        };
        opts.appendChild(btn);
      });
      ctrl.append(opts, fb);
      return;
    }
    const b = bubble(l);
    strip.appendChild(b);
    b.scrollIntoView({ behavior: 'smooth', block: 'end' });
    i++;
    if (i >= lines.length) return finish();
    const nextIsMine = lines[i].who === 'you' && lines[i].choices;
    const next = el('button', 'btn primary', nextIsMine ? 'Ab aapki baari ➜' : 'Aage ➜');
    next.onclick = step;
    ctrl.appendChild(next);
  }

  function finish() {
    ctrl.innerHTML = '';
    ctrl.appendChild(el('div', 'hint', 'Poora dialogue upar hai. Har line ko ek baar zor se padh ke bolo, khaas kar aapki lines.'));
    const done = el('button', 'btn primary', 'Ho gaya ✓');
    done.onclick = () => onDone({ firstTry, total });
    ctrl.appendChild(done);
  }
  step();
};

/* ================================================================
   BUILD — blocks jod ke sentence banao
   ================================================================ */
MG.renderers.build = function (stage, arena, onDone) {
  const norm = s => MG.py.strip(String(s)).toLowerCase().replace(/[^a-zü' ]/g, ' ').replace(/\s+/g, ' ').trim();
  let i = 0, firstTry = 0;
  const box = el('div', 'build');
  arena.appendChild(box);
  function show() {
    MG.voice.stop();
    const it = MG.view(stage.items[i]);
    const blocks = it.blocks || it.py.replace(/[.,!?;:]/g, ' ').split(/\s+/).filter(Boolean);
    const want = norm(blocks.join(' '));
    let tried = false;
    box.innerHTML = '';
    box.appendChild(MG.g.progress(i, stage.items.length));
    box.appendChild(el('div', 'q-label', 'Blocks ko sahi order mein lagao:'));
    box.appendChild(el('div', 'q-hi', esc(it.hi)));
    const answer = el('div', 'b-answer');
    const pool = el('div', 'b-pool');
    const fb = el('div', 'feedback');
    const chips = shuffle(blocks.concat(it.extra || [])).map(t => {
      const c = el('button', 'chip', MG.pv.inline(t));
      c.dataset.t = t;
      c.onclick = () => {
        if (c.parentNode === pool) answer.appendChild(c); else pool.appendChild(c);
        fb.className = 'feedback'; fb.innerHTML = '';
      };
      pool.appendChild(c);
      return c;
    });
    void chips;
    const check = el('button', 'btn primary', 'Check ✓');
    check.onclick = () => {
      const got = norm([...answer.children].map(c => c.dataset.t).join(' '));
      if (got === want) {
        if (!tried) firstTry++;
        fb.className = 'feedback ok';
        fb.innerHTML = `✅ <b>Sahi!</b><div class="after">${MG.pv.line(it)}</div>`;
        check.remove();
        const next = el('button', 'btn primary', i < stage.items.length - 1 ? 'Agla ➜' : 'Ho gaya ✓');
        next.onclick = () => { if (i < stage.items.length - 1) { i++; show(); } else onDone({ firstTry, total: stage.items.length }); };
        box.appendChild(next);
      } else {
        tried = true;
        shake(answer);
        const hit = MG.g.phraseByPy(it.py);
        if (hit) MG.noteMistake(hit.id);
        fb.className = 'feedback bad';
        fb.innerHTML = answer.children.length < blocks.length
          ? '❌ Abhi kuch blocks baaki hain (ya ek faltu block laga hai).'
          : '❌ Order galat hai. Yaad rakho: Kaun → Kab → Kahan → Kya karna.';
      }
    };
    box.append(answer, pool, fb, check);
  }
  show();
};

/* ================================================================
   BINS — cheezon ko sahi dibbe mein daalo
   ================================================================ */
MG.renderers.bins = function (stage, arena, onDone) {
  let firstTry = 0, placed = 0, selected = null;
  const wrongOnce = new Set();
  const box = el('div', 'bins');
  box.appendChild(el('div', 'q-text', esc(stage.q)));
  const row = el('div', 'bins-row');
  const pool = el('div', 'pool');
  const fb = el('div', 'feedback');
  stage.bins.forEach(b => {
    const z = el('div', 'bin', `<div class="bin-label">${esc(b.label)}</div><div class="bin-items"></div>`);
    z.setAttribute('role', 'button');
    z.setAttribute('tabindex', '0');
    z.setAttribute('aria-label', b.label + ' mein selected item daalo');
    z.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); z.click(); } };
    z.onclick = () => {
      if (!selected) return;
      const it = selected._item;
      if (it.bin === b.id) {
        if (!wrongOnce.has(selected)) firstTry++;
        z.querySelector('.bin-items').appendChild(selected);
        selected.classList.remove('sel'); selected.classList.add('right'); selected.disabled = true;
        selected = null; placed++;
        fb.className = 'feedback ok'; fb.innerHTML = '✅ Sahi dibba!';
        if (placed === stage.items.length) {
          const next = el('button', 'btn primary', 'Ho gaya ✓');
          next.onclick = () => onDone({ firstTry, total: stage.items.length });
          box.appendChild(next);
        }
      } else {
        wrongOnce.add(selected);
        shake(z);
        fb.className = 'feedback bad'; fb.innerHTML = '❌ Is dibbe mein nahi. Dobara socho.';
      }
    };
    row.appendChild(z);
  });
  shuffle(stage.items).forEach(it => {
    const c = el('button', 'chip', it.py ? MG.pv.inline(it.py) : esc(it.text));
    c._item = it;
    c.onclick = e => {
      e.stopPropagation();
      if (c.disabled) return;
      pool.querySelectorAll('.chip').forEach(x => x.classList.remove('sel'));
      c.classList.add('sel'); selected = c;
    };
    pool.appendChild(c);
  });
  box.append(el('div', 'q-label', 'Pehle chip chuno, phir dibbe par tap karo.'), pool, row, fb);
  arena.appendChild(box);
};
