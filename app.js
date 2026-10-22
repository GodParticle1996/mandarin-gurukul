/* =====================================================================
   Mandarin Gurukul — Screens (1/2)
   topbar · onboarding · home · track · level runner · level complete
   (Dojo, Diary, Legend, Settings → app-extra.js · boot → boot.js)
   ===================================================================== */
const appEl = document.getElementById('app');
const topbarEl = document.getElementById('topbar');

const STAGE_LABEL = {
  learn: '📖 Seekho', explain: '💡 Samjho', meaning: '🤔 Matlab batao', recall: '🗣️ Kaise bologe?',
  match: '🧩 Jodi banao', tones: '🎵 Tone pehchano', quiz: '🎯 Situation', dialogue: '🎬 Baat-cheet',
  build: '🧱 Sentence banao', bins: '🗂️ Chhanto',
};

function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

/* ---------------- topbar ---------------- */
function renderTopbar() {
  const r = MG.currentRank(), nr = MG.nextRank();
  const pct = nr ? Math.max(4, Math.round(((MG.state.xp - r.xp) / (nr.xp - r.xp)) * 100)) : 100;
  const due = MG.dueCards().length;
  topbarEl.innerHTML =
    `<button class="tb-home" id="tbHome" title="Home">🐉 <b>Mandarin Gurukul</b></button>`
    + `<div class="tb-rank" title="${esc(r.name)}${nr ? ' → ' + esc(nr.name) + ' @ ' + nr.xp + ' XP' : ''}">`
    + `<span class="tb-ricon">${r.icon}</span><div><div class="tb-rname">${esc(r.name)}</div>`
    + `<div class="xpbar"><div style="width:${pct}%"></div></div></div><small>${MG.state.xp} XP</small></div>`
    + `<div class="tb-streak${MG.streakAlive() ? '' : ' cold'}" title="Din lagataar">🔥 ${MG.state.streak.count}</div>`
    + `<button class="tb-dojo${due ? ' hot' : ''}" id="tbDojo" title="Revision Dojo">🃏 ${due}</button>`;
  topbarEl.querySelector('#tbHome').onclick = () => go('#/');
  topbarEl.querySelector('#tbDojo').onclick = () => go('#/dojo');
}

/* ---------------- onboarding (pehli baar) ---------------- */
function showOnboarding(step) {
  step = step || 1;
  appEl.innerHTML = '';
  const card = el('div', 'onb');
  if (step === 1) {
    card.innerHTML = `<div class="onb-art">${MG.sceneArt('family')}</div><h2>Namaste! Mandarin Gurukul mein swagat hai</h2>
      <ul class="onb-list">
        <li>🗣️ Yahan sirf <b>bolna aur samajhna</b> hai. Chinese akshar padhna zaroori nahi.</li>
        <li>🎨 Har syllable ke upar ek <b>rangeen line</b> hai: awaaz upar jaayegi ya neeche.</li>
        <li>🧭 Hinglish mein meaning aur mouth cues milenge. Devanagari hints Settings mein optional hain.</li>
        <li>🏮 Situations asli hain: GF ki family, restaurant, dost, taxi, hotel.</li>
      </ul><p class="hint">Pehla goal clear baat-cheet hai. Accent hona normal hai. Na samajh aaye to repeat aur slower wale phrases kaam aayenge.</p>`;
    const b = el('button', 'btn primary big', 'Aage ➜');
    b.onclick = () => showOnboarding(2);
    card.appendChild(b);
  } else if (step === 2) {
    card.innerHTML = `<h2>Aap kaun ho?</h2>
      <p>GF ke parents ko aap bologe <b>"Main Xiǎoyǔ ka boyfriend / ki girlfriend hoon"</b>. Chinese mein relationship ke liye alag shabd hain. Yeh choice Settings mein badal sakte ho.</p>`;
    const row = el('div', 'row wrap');
    [['m', '👨🏽 Main ladka hoon', '我是晓雨的男朋友 · nánpéngyou'], ['f', '👩🏽 Main ladki hoon', '我是晓雨的女朋友 · nǚpéngyou']].forEach(([g, label, sub]) => {
      const b = el('button', 'btn choice', `${label}<small>${sub}</small>`);
      b.onclick = () => { MG.state.profile.gender = g; MG.saveState(); showOnboarding(3); };
      row.appendChild(b);
    });
    card.appendChild(row);
  } else {
    card.innerHTML = `<h2>Rang aur nishaan — bas itna yaad rakho</h2>${MG.pv.visual('tonechart')}
      <div class="onb-ex">${MG.pv.line({ zh: '你好！', py: 'Nǐ hǎo!' }, { big: true })}
      <p>"Nǐ hǎo" likha hai, par pehla syllable <b>narangi (Tone 2)</b> hai aur ↻ nishaan wala hai: do Tone 3 saath aayein to pehla Tone 2 ban jaata hai.
      App basic tone changes dikhata hai. Lambi phrases mein rhythm ke hisaab se tone grouping badal sakti hai.</p></div>
      <p class="practice-note">Suno se normal awaaz aur Dheere se slow awaaz suno. Phir khud bolo. App tumhari pronunciation ko grade nahi karta; Hindi hints approximate hain.</p><p class="muted">Badges: 💨 hawa · 👅 zubaan peeche · 🐝 bhanbhanahat · 😗 gol hoth. Poori list "🎨 Rang aur nishaan" mein hai.</p>`;
    const b = el('button', 'btn primary big', 'Shuru karein 🚀');
    b.onclick = () => { MG.state.profile.onboarded = true; MG.saveState(); go('#/'); };
    card.appendChild(b);
  }
  appEl.appendChild(card);
}

/* ---------------- home ---------------- */
function showHome() {
  if (!MG.state.profile.onboarded) return showOnboarding(1);
  MG.showDashboard();
}

/* ---------------- track map ---------------- */
function showTrack(track) {
  appEl.innerHTML = '';
  const pr = MG.trackProgress(track);
  const head = el('div', 'thead', `<button class="btn ghost small" id="back">⬅</button><div class="th-icon">${track.icon}</div>`
    + `<div><h2>${esc(track.name)}</h2><p>${esc(track.blurb)}</p><div class="pbar"><div style="width:${pr.total ? Math.round(pr.done / pr.total * 100) : 0}%"></div></div>`
    + `<small>${pr.done}/${pr.total} levels poore</small></div>`);
  head.querySelector('#back').onclick = () => go('#/');
  appEl.appendChild(head);
  if (pr.complete) appEl.appendChild(el('div', 'cert', `<div class="cert-t">🏅 ${esc(track.certTitle)}</div><div>${esc(track.motto)}</div>`));
  const path = el('div', 'lpath');
  const levels = MG.levelsOf(track);
  if (!levels.length) path.appendChild(el('div', 'empty', '🚧 Is track ke levels abhi ban rahe hain.'));
  levels.forEach((l, i) => {
    const done = MG.state.completed.includes(l.id);
    const open = MG.levelUnlocked(l);
    const stars = MG.state.stars[l.id] || 0;
    const b = el('button', 'lcard' + (done ? ' done' : open ? ' open' : ' locked'));
    b.innerHTML = `<div class="lc-num">${done ? '✓' : open ? l.icon : '🔒'}</div><div class="lc-body">`
      + `<small>Level ${i + 1}</small><b>${esc(l.title)}</b><span>${esc(l.goal)}</span></div>`
      + `<div class="lc-stars">${done ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : ''}</div>`;
    b.onclick = () => { if (open) go('#/level/' + l.id); else shake(b); };
    path.appendChild(b);
  });
  appEl.appendChild(path);
}

/* ---------------- level runner ---------------- */
function levelHeader(L, label, idx, n) {
  const h = el('div', 'lhead');
  h.innerHTML = `<button class="btn ghost small" id="quit" title="Band karo">✕</button>`
    + `<div class="lh-mid"><b>${L.icon} ${esc(L.title)}</b><small>${label}</small>`
    + `<div class="pbar thin"><div style="width:${Math.round((idx / n) * 100)}%"></div></div></div>`;
  h.querySelector('#quit').onclick = () => go('#/track/' + L.track);
  if (MG.voice.available() && MG.voice.selector) { const picker = MG.voice.selector(); picker.classList.add('lesson-voice-select'); h.appendChild(picker); }
  return h;
}

function startLevel(level) {
  const c = MG.state.checkpoint;
  MG.session = c && c.levelId === level.id && c.stageIdx < level.stages.length
    ? { level, stageIdx: c.stageIdx, firstTry: c.firstTry, total: c.total, replay: MG.state.completed.includes(level.id) }
    : { level, stageIdx: -1, firstTry: 0, total: 0, replay: MG.state.completed.includes(level.id) };
  MG.saveCheckpoint();
  if (MG.session.stageIdx >= 0) runStage(); else showScene();
}

/* scene: level hamesha ek asli problem se shuru hota hai */
function showScene() {
  const L = MG.session.level, sc = L.scene;
  appEl.innerHTML = '';
  appEl.appendChild(levelHeader(L, '🎬 Scene', 0, L.stages.length + 1));
  const box = el('div', 'scene');
  box.innerHTML = `${MG.sceneArt(L.track, 'scene-art')}<div class="scene-eyebrow">ABHI KI SITUATION</div><p class="sc-text">${esc(sc.text)}</p><div class="sc-goal">🎯 ${esc(L.goal)}</div><h3>${esc(sc.ask)}</h3>`;
  const opts = el('div', 'opts');
  const fb = el('div', 'feedback');
  let tried = false;
  shuffle(sc.choices).forEach(c => {
    const b = el('button', 'opt', c.py ? MG.pv.inline(c.py) : esc(c.text));
    b.onclick = () => {
      if (c.ok) {
        if (!tried && !MG.state.sceneAwards.includes(L.id)) { MG.state.sceneAwards.push(L.id); MG.addXP(MG.SCENE_XP); MG.saveState(); }
        b.classList.add('right');
        fb.className = 'feedback ok';
        fb.innerHTML = `✅ <b>${tried ? 'Ab sahi!' : 'Bilkul sahi!'}</b> ${esc(c.why)}`;
        opts.querySelectorAll('button').forEach(x => { x.disabled = true; });
        const norm = py => MG.py.strip(py).toLowerCase().replace(/[^a-zü]/g, '');
        const phrase = (L.phrases || []).map(MG.view).find(p => c.py && norm(p.py) === norm(c.py));
        const voiceButtons = phrase && MG.voice.buttons(phrase);
        if (voiceButtons) fb.appendChild(voiceButtons);
        const go2 = el('button', 'btn primary', 'Chalo seekhein ➜');
        go2.onclick = () => { MG.session.stageIdx = 0; runStage(); };
        box.appendChild(go2);
      } else {
        tried = true;
        b.classList.add('wrong'); b.disabled = true; shake(b);
        fb.className = 'feedback bad';
        fb.innerHTML = `❌ ${esc(c.why)} <span class="muted">Ek aur try?</span>`;
      }
    };
    opts.appendChild(b);
  });
  box.append(opts, fb);
  appEl.appendChild(box);
}

function runStage() {
  MG.voice.stop();
  MG.saveCheckpoint();
  const L = MG.session.level;
  const st = L.stages[MG.session.stageIdx];
  if (!st) return levelComplete();
  if (!MG.renderers[st.type]) { MG.session.stageIdx++; return runStage(); }   // audio stages (baad mein)
  appEl.innerHTML = '';
  appEl.appendChild(levelHeader(L, STAGE_LABEL[st.type] || st.type, MG.session.stageIdx + 1, L.stages.length + 1));
  const arena = el('div', 'arena');
  appEl.appendChild(arena);
  window.scrollTo(0, 0);
  MG.renderers[st.type](st, arena, stats => {
    MG.session.firstTry += stats.firstTry || 0;
    MG.session.total += stats.total || 0;
    MG.session.stageIdx++;
    runStage();
  });
}

function levelComplete() {
  MG.voice.stop();
  const L = MG.session.level, s = MG.session;
  const ratio = s.total ? s.firstTry / s.total : 1;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
  const firstTime = !MG.state.completed.includes(L.id);
  const xp = s.firstTry * MG.XP_PER_ITEM + (stars === 3 ? MG.PERFECT_BONUS : 0);
  if (firstTime) {
    MG.state.completed.push(L.id);
    MG.enrollLevelCards(L);
  }
  MG.state.stars[L.id] = Math.max(MG.state.stars[L.id] || 0, stars);
  MG.saveState();
  if (firstTime) MG.addXP(xp);
  MG.session.replay = true;
  MG.session.finished = true;
  MG.state.checkpoint = null;
  MG.recordActivity('lesson');

  const track = MG.trackById(L.track);
  const levels = MG.levelsOf(track);
  const nextL = MG.nextLevel() || levels[levels.indexOf(L) + 1];
  appEl.innerHTML = '';
  const box = el('div', 'finish');
  box.innerHTML = `<div class="finish-big">${stars === 3 ? '🏆' : stars === 2 ? '🎉' : '👍'}</div>`
    + `<h2>${esc(L.title)} — poora!</h2><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`
    + `<p class="practice-note">Stars visual quizzes ke hain. Boli hui pronunciation abhi assess nahi hoti.</p><p>Pehli koshish mein sahi: <b>${s.firstTry}/${s.total}</b>${firstTime ? ` · <b>+${xp} XP</b>` : ' · (replay — XP pehle mil chuka)'}</p>`
    + (firstTime ? `<p>🃏 ${L.phrases.length} phrases Revision Dojo mein gaye. Kal se yaad dilaayenge.</p>` : '')
    + (MG.trackProgress(track).complete ? `<div class="cert"><div class="cert-t">🏅 ${esc(track.certTitle)}</div><div>${esc(track.motto)}</div></div>` : '');
  const row = el('div', 'row wrap');
  if (nextL) {
    const b = el('button', 'btn primary big', `Agla: ${nextL.icon} ${esc(nextL.title)} ➜`);
    b.onclick = () => go('#/level/' + nextL.id);
    row.appendChild(b);
  }
  const t = el('button', 'btn ghost', `${track.icon} Track map`);
  t.onclick = () => go('#/track/' + track.id);
  const h = el('button', 'btn ghost', '🏠 Home');
  h.onclick = () => go('#/');
  row.append(t, h);
  box.appendChild(row);
  appEl.appendChild(box);
}
