/* Speaking-first screens. No microphone, speech grading or network service.
   Conversation lines share the prerecorded Mandarin audio adapter. */
(function () {
  const art = {
    family: [0, 0, 'Indian visitor GF ke parents se ghar ke darwaze par milta hai'],
    food: [100, 0, 'Restaurant mein visitor waiter ke saath menu se order karta hai'],
    friends: [0, 45.8, 'Cafe mein GF aur friends ke saath introductions aur phone contacts'],
    travel: [100, 45.8, 'Visitor taxi driver ko phone par destination dikhata hai'],
    shopping: [0, 100, 'Fruit stall par visitor seller se kharidari karta hai'],
    basics: [100, 100, 'Hotel reception par visitor receptionist se baat karta hai'],
  };
  MG.sceneArt = function (track, cls) {
    const a = art[track];
    if (!a) return `<div class="scene-symbol ${cls || ''}" aria-hidden="true">${(MG.trackById(track) || {}).icon || '🗣️'}<span>dekho · socho · bolo</span></div>`;
    return `<div class="scenario-art ${cls || ''} art-${track}" role="img" aria-label="${esc(a[2])}" style="background-position:${a[0]}% ${a[1]}%"></div>`;
  };
  MG.renderNav = function (hash) {
    const nav = document.getElementById('bottom-nav');
    nav.innerHTML = '';
    nav.hidden = !MG.state.profile.onboarded || hash.startsWith('#/level/') || hash.startsWith('#/conversation/');
    if (nav.hidden) return;
    [['#/', '⌂', 'Aaj'], ['#/situations', '▦', 'Situations'], ['#/practice', '↻', 'Practice'], ['#/diary', '▤', 'Phrases']].forEach(([h, icon, title]) => {
      const active = h === hash || (h === '#/situations' && hash.startsWith('#/track/')) || (h === '#/practice' && ['#/dojo', '#/tones'].includes(hash));
      const b = el('button', active ? 'nav-item active' : 'nav-item', `<span aria-hidden="true">${icon}</span>${title}`);
      if (active) b.setAttribute('aria-current', 'page');
      b.onclick = () => go(h);
      nav.appendChild(b);
    });
  };
  MG.showDashboard = function () {
    appEl.innerHTML = '';
    const next = MG.nextLevel(), cp = MG.state.checkpoint;
    const resume = cp && MG.levelById(cp.levelId);
    const completed = MG.state.completed.filter(id => MG.levelById(id)).length;
    const total = MG.studyOrder().length;
    const activity = MG.state.activity[MG.todayStr()] || {};
    const hero = el('section', 'welcome-hero');
    hero.innerHTML = `<div class="welcome-copy"><span class="eyebrow">TUMHARA CHINA SPEAKING KIT</span><h1>Chhoti practice.<br>Asli baat-cheet.</h1><p>Roz ${MG.state.profile.dailyMinutes} minute. Family se hello, khana order, taxi mein raasta—ek situation roz.</p><div class="hero-meta"><span>6-week flexible path</span><span>${completed}/${total} lessons</span></div></div>${MG.sceneArt('family', 'hero-art')}`;
    appEl.appendChild(hero);
    const plan = el('section', 'daily-card');
    plan.innerHTML = `<div class="section-heading"><div><span class="eyebrow">AAJ KA CHHOTA PLAN</span><h2>Bas yeh 3 steps</h2></div><span class="daily-count">${['review', 'lesson', 'conversation'].filter(k => activity[k]).length}/3</span></div>`;
    const due = MG.dueCards().length;
    const rows = [
      ['review', due ? 'Yaad se bolo' : 'Sur ka warm-up', due ? `${due} due cards · pehle jawab, phir reveal` : 'Tone ka motion samjho · 2–3 min', due ? '#/dojo' : '#/tones', '01'],
      ['lesson', resume ? 'Jahan chhoda tha' : next ? next.title : 'Apna favourite lesson dohrao', resume ? `${resume.title} · last completed stage se` : 'Ek nayi situation · lagbhag 10 min', resume ? '#/level/' + resume.id : next ? '#/level/' + next.id : '#/situations', '02'],
      ['conversation', 'Bina hints baat karo', 'Scene chuno → khud bolo → answer dekho · 3–5 min', '#/practice', '03'],
    ];
    rows.forEach(([k, title, sub, h, n]) => {
      const b = el('button', 'daily-step' + (activity[k] ? ' checked' : ''), `<span class="step-number">${activity[k] ? '✓' : n}</span><span><b>${esc(title)}</b><small>${esc(sub)}</small></span><span aria-hidden="true">↗</span>`);
      b.onclick = () => go(h); plan.appendChild(b);
    });
    appEl.appendChild(plan);
    const links = el('div', 'dashboard-tools');
    [['6-week path', '#/plan'], ['Quick phrases', '#/diary'], ['Settings', '#/settings']].forEach(([label, h]) => {
      const b = el('button', 'btn ghost small', label + ' ↗'); b.onclick = () => go(h); links.appendChild(b);
    });
    appEl.appendChild(links);
    const section = el('section', 'home-scenarios');
    section.innerHTML = '<div class="section-heading"><div><span class="eyebrow">AAJ KAHAN BAAT KARNI HAI?</span><h2>Situation se seekho</h2></div></div>';
    const grid = el('div', 'scenario-grid');
    ['family', 'food', 'friends', 'travel'].forEach(id => grid.appendChild(MG.trackTile(MG.trackById(id), true)));
    section.appendChild(grid); appEl.appendChild(section);
    appEl.appendChild(el('p', 'practice-note', 'Suno → Dheere → khud bolo. Female/male reference voice Settings ya lesson mein badal sakte ho. App tumhari boli hui pronunciation grade nahi karta.'));
  };
  MG.trackTile = function (track, compact) {
    const labels = { family: 'GF ki family', food: 'Khana order karo', friends: 'Naye dost', travel: 'Taxi, metro, hotel', shopping: 'Shopping aur payment', basics: 'Survival phrases', north: 'Optional regional bonus' };
    const pr = MG.trackProgress(track);
    const b = el('button', 'scenario-tile' + (compact ? ' compact' : ''));
    b.innerHTML = MG.sceneArt(track.id) + `<span class="tile-copy"><b>${esc(labels[track.id] || track.name.split(' — ')[0])}</b><small>${pr.done}/${pr.total} lessons · ${pr.complete ? 'revision ready' : 'kholo aur practice karo'}</small></span><span class="tile-arrow" aria-hidden="true">↗</span>`;
    b.onclick = () => go('#/track/' + track.id);
    return b;
  };
  MG.showSituations = function () {
    appEl.innerHTML = '';
    appEl.appendChild(backHead('Situation chuno', 'Saare tracks khule hain. Suggested order chahiye to Aaj ka plan follow karo.'));
    const grid = el('div', 'scenario-grid all-scenarios');
    ['family', 'food', 'friends', 'travel', 'shopping', 'basics', 'emergency', 'sounds', 'tones', 'builder', 'north'].forEach(id => grid.appendChild(MG.trackTile(MG.trackById(id))));
    appEl.appendChild(grid);
  };
  MG.showPlan = function () {
    appEl.innerHTML = '';
    appEl.appendChild(backHead('Tumhara 6-week path', 'Roz ek lesson + chhota revision + conversation. Busy din ho to sirf revision karo. Extra lessons apni pace par.'));
    const order = MG.studyOrder();
    const names = ['Hello aur pehla din', 'Daily life mein confidence', 'Family aur friends', 'Khud sentence banao', 'Mixed situations', 'Trip rehearsal'];
    for (let week = 0; week < 6; week++) {
      const section = el('section', 'week-card');
      section.innerHTML = `<span class="eyebrow">WEEK ${week + 1}</span><h3>${names[week]}</h3>`;
      const lessons = order.slice(week * 7, (week + 1) * 7);
      lessons.forEach((l, i) => {
        const done = MG.state.completed.includes(l.id);
        const b = el('button', 'path-row', `<span class="path-day">${done ? '✓' : week * 7 + i + 1}</span><span><b>${esc(l.title)}</b><small>${esc(MG.trackById(l.track).name.split(' — ')[0])}</small></span><span>↗</span>`);
        b.onclick = () => go('#/level/' + l.id); section.appendChild(b);
      });
      if (!lessons.length) section.appendChild(el('p', 'muted', 'Favourite scenes dohrao aur due cards revise karo.'));
      appEl.appendChild(section);
    }
    if (order.length > 42) appEl.appendChild(el('p', 'practice-note', `${order.length - 42} extra lessons Situations mein hain. Path complete hone par bhi apni pace par seekh sakte ho.`));
  };
  MG.showPractice = function () {
    appEl.innerHTML = '';
    appEl.appendChild(backHead('Bolne ki baari tumhari', 'Answer padhne se pehle khud bolo. Phir compare karo aur honestly mark karo.'));
    const tools = el('div', 'practice-tools');
    [['↗', 'Tone motion lab', 'Awaaz ka raasta aankhon se samjho', '#/tones'], ['↻', 'Revision Dojo', `${MG.dueCards().length} cards due · yaad se jawab do`, '#/dojo']].forEach(([icon, title, sub, hash]) => {
      const b = el('button', 'tool-card', `<span>${icon}</span><div><b>${title}</b><small>${sub}</small></div>`);
      b.onclick = () => go(hash); tools.appendChild(b);
    });
    appEl.appendChild(tools);
    appEl.appendChild(el('h2', '', 'Ek scene rehearse karo'));
    const grid = el('div', 'scenario-grid');
    ['family', 'food', 'friends', 'travel', 'shopping', 'basics', 'emergency'].forEach(id => {
      const track = MG.trackById(id);
      const l = MG.levelsOf(track).find(level => level.stages.some(st => st.type === 'dialogue'));
      if (!l) return;
      const b = MG.trackTile(track);
      b.querySelector('small').textContent = 'Bina hints → reveal → self-check';
      b.onclick = () => go('#/conversation/' + l.id); grid.appendChild(b);
    });
    appEl.appendChild(grid);
  };
  MG.showConversation = function (levelId) {
    const L = MG.levelById(levelId);
    const st = L && L.stages.find(s => s.type === 'dialogue');
    if (!st) return MG.showPractice();
    const lines = st.lines.map(MG.view);
    let i = 0, remembered = 0, turns = 0;
    appEl.innerHTML = '';
    appEl.appendChild(backHead('Scene rehearsal', 'Self-check hai: app awaaz record ya grade nahi kar raha.'));
    if (MG.voice.available() && MG.voice.selector) appEl.appendChild(MG.voice.selector());
    appEl.appendChild(el('div', 'rehearsal-scene', MG.sceneArt(L.track) + `<h2>${esc(st.title)}</h2>`));
    const box = el('section', 'rehearsal'); appEl.appendChild(box);
    function advance() { MG.voice.stop(); i++; draw(); }
    function draw() {
      box.innerHTML = '';
      if (i >= lines.length) {
        MG.recordActivity('conversation');
        box.innerHTML = `<div class="finish"><span class="eyebrow">SCENE COMPLETE</span><h2>Baat-cheet ho gayi!</h2><p>Tumhare self-check mein <b>${remembered}/${turns}</b> answers bina hint yaad the.</p><p class="muted">Ab wahi lines ek baar natural flow mein bolo.</p></div>`;
        const repeat = el('button', 'btn primary', 'Dobara rehearse karo'); repeat.onclick = () => MG.showConversation(L.id);
        const next = el('button', 'btn ghost', 'Doosra scene'); next.onclick = () => go('#/practice'); box.append(repeat, next); return;
      }
      const l = lines[i], mine = l.who === 'you';
      box.appendChild(MG.g.progress(i, lines.length));
      box.appendChild(el('p', 'eyebrow', `${MG.castEmoji(l.who)} ${mine ? 'TUMHARI BAARI' : esc((CAST[l.who] || CAST.stranger).name)}`));
      if (mine) {
        box.appendChild(el('h3', 'recall-prompt', esc(l.hi)));
        box.appendChild(el('p', 'muted', 'Mandarin mein khud bolo. Answer tabhi kholo jab try kar liya ho.'));
        const reveal = el('button', 'btn primary', 'Answer dikhao');
        reveal.onclick = () => {
          reveal.remove();
          box.appendChild(el('div', 'recalled-answer', MG.pv.line(l, { big: true })));
          const vb = MG.voice.buttons(l, l.who); if (vb) box.appendChild(vb);
          box.appendChild(el('p', 'hint', 'Model audio suno, phir apna jawab dobara bolo. Self-check karo; app pronunciation grade nahi karta.'));
          const row = el('div', 'row wrap');
          [['Hint chahiye thi', false], ['Khud yaad tha', true]].forEach(([label, ok]) => {
            const b = el('button', 'btn ' + (ok ? 'good' : 'ghost'), label);
            b.onclick = () => {
              turns++; if (ok) remembered++;
              const norm = x => MG.py.strip(x).toLowerCase().replace(/[^a-zü]/g, '');
              const p = L.phrases.map(MG.view).find(p => norm(p.py) === norm(l.py));
              if (p) { MG.addCard(p.id); if (!ok) MG.noteMistake(p.id); }
              advance();
            };
            row.appendChild(b);
          });
          box.appendChild(row);
        };
        box.appendChild(reveal);
      } else {
        box.appendChild(el('div', 'partner-line', MG.pv.line(l, { big: true })));
        const vb = MG.voice.buttons(l, l.who); if (vb) box.appendChild(vb);
        const meaning = el('button', 'btn ghost small', 'Meaning dekho');
        meaning.onclick = () => { meaning.replaceWith(el('p', 'pc-hi', esc(l.hi))); };
        const next = el('button', 'btn primary', 'Aage →'); next.onclick = advance;
        box.append(meaning, next);
      }
    }
    draw();
    const more = el('div', 'scene-select');
    const label = el('label', '', 'Is situation ka doosra scene ');
    const select = el('select', 'search');
    MG.levelsOf(MG.trackById(L.track)).filter(level => level.stages.some(s => s.type === 'dialogue')).forEach(level => {
      const option = el('option', '', esc(level.title)); option.value = level.id; option.selected = level.id === L.id; select.appendChild(option);
    });
    select.onchange = () => go('#/conversation/' + select.value);
    label.appendChild(select); more.appendChild(label); appEl.appendChild(more);
  };
  MG.showToneLab = function () {
    appEl.innerHTML = '';
    appEl.appendChild(backHead('Tone motion lab', 'Sur ki direction dekho aur haath se follow karte hue bolo. Yeh awaaz ka analysis nahi hai.'));
    const demos = [
      { n: 1, zh: '妈', py: 'mā', hi: 'maa', cue: 'Ooncha shuru, seedha rakho.', pts: [[12, 20], [288, 20]] },
      { n: 2, zh: '麻', py: 'má', hi: 'sunn / jhunjhunahat', cue: 'Beech se ooncha le jao.', pts: [[12, 100], [288, 20]] },
      { n: 3, zh: '马', py: 'mǎ', hi: 'ghoda', cue: 'Neeche jao. Akele bolte waqt end mein rise ho sakta hai.', pts: [[12, 140], [130, 180], [288, 60]] },
      { n: 4, zh: '骂', py: 'mà', hi: 'daantna', cue: 'Oonche se tezi se neeche lao.', pts: [[12, 20], [288, 180]] },
      { n: 0, zh: '吗', py: 'ma', hi: 'sawaal ka halka particle', cue: 'Chhota aur halka. Height pichhle tone par depend karti hai.', pts: [[12, 100], [288, 100]] },
    ];
    const box = el('section', 'tone-lab');
    const tabs = el('div', 'tone-tabs'); const content = el('div'); box.append(tabs, content); appEl.appendChild(box);
    if (MG.voice.available() && MG.voice.selector) box.prepend ? box.prepend(MG.voice.selector()) : box.appendChild(MG.voice.selector());
    function choose(d) {
      MG.voice.stop();
      if (MG.toneAnimation) cancelAnimationFrame(MG.toneAnimation);
      tabs.querySelectorAll('button').forEach(b => { const on = b.dataset.tone === String(d.n); b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
      const points = d.pts.map(p => p.join(',')).join(' ');
      content.innerHTML = `<div class="tone-word t${d.n}"><strong>${d.py}</strong><span>${d.hi}</span></div><p class="tone-cue">${d.cue}</p><div class="motion-chart t${d.n}"><span class="pitch-high">ooncha</span><span class="pitch-low">neecha</span><svg viewBox="0 0 300 200" role="img" aria-label="Tone ${d.n} ka sur path"><path class="chart-grid" d="M12 20H288M12 60H288M12 100H288M12 140H288M12 180H288"/><polyline class="motion-path" points="${points}"/><circle id="tone-dot" r="9" cx="12" cy="${d.pts[0][1]}"/></svg></div><label class="motion-slider">Sur ka raasta: <input type="range" min="0" max="100" value="0" aria-label="Tone path progress"></label>`;
      const slider = content.querySelector('input');
      const dot = content.querySelector('#tone-dot');
      function move(value) {
        const t = Number(value) / 100 * (d.pts.length - 1), idx = Math.min(Math.floor(t), d.pts.length - 2), f = t - idx;
        const a = d.pts[idx], b = d.pts[idx + 1];
        dot.setAttribute('cx', a[0] + (b[0] - a[0]) * f); dot.setAttribute('cy', a[1] + (b[1] - a[1]) * f);
      }
      slider.oninput = () => { if (MG.toneAnimation) cancelAnimationFrame(MG.toneAnimation); move(slider.value); };
      const animate = el('button', 'btn primary', 'Motion dekho →');
      animate.onclick = () => {
        if (MG.toneAnimation) cancelAnimationFrame(MG.toneAnimation);
        let start;
        const frame = now => { if (start == null) start = now; const v = Math.min(100, (now - start) / (d.n === 0 ? 6 : 18)); slider.value = v; move(v); if (v < 100) MG.toneAnimation = requestAnimationFrame(frame); };
        MG.toneAnimation = requestAnimationFrame(frame);
      };
      content.appendChild(animate);
      const audio = MG.voice.buttons(d, 'teacher'); if (audio) content.appendChild(audio);
    }
    demos.forEach(d => {
      const b = el('button', 'tone-tab t' + d.n, `Tone ${d.n || 'neutral'}`); b.dataset.tone = String(d.n); b.onclick = () => choose(d); tabs.appendChild(b);
    });
    choose(demos[0]);
    appEl.appendChild(el('p', 'practice-note', 'Connected speech: Tone 3 aksar low rehta hai; har syllable par bada dip-rise mat banao. Do Tone 3 saath hon to pehla rising hota hai. Lambi phrases ki grouping rhythm par depend karti hai.'));
    const done = el('button', 'btn good', 'Warm-up practice ki ✓'); done.onclick = () => { MG.recordActivity('review'); go('#/'); }; appEl.appendChild(done);
  };
})();
