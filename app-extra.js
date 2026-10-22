/* =====================================================================
   Mandarin Gurukul — Screens (2/2)
   Revision Dojo · Meri Diary (+ 📱 Dikhao card) · Rang aur nishaan · Settings
   ===================================================================== */

/* App shell stays small; pronunciation packs are an explicit, resumable download. */
MG.audioCache = (() => {
  const NAME = 'mg-audio-v1';
  const voiceIds = { female: 'zh-CN-XiaoxiaoNeural', male: 'zh-CN-YunxiNeural' };
  const reference = () => MG.state.profile.referenceVoice === 'male' ? 'male' : 'female';
  const supported = () => typeof caches !== 'undefined' && typeof fetch === 'function';
  function byteSize(url) {
    const meta = MG.AUDIO_META && MG.AUDIO_META.files;
    let item = meta && (Array.isArray(meta) ? meta.find(x => (x.path || x.src || x.url) === url) : meta[url]);
    if (item && typeof item === 'object') item = item.bytes || item.size;
    return Number.isFinite(Number(item)) && Number(item) > 0 ? Number(item) : 0;
  }
  function files(scope = 'selected') {
    const id = ((MG.voice && MG.voice.VOICES) || voiceIds)[reference()];
    const rows = Object.entries(MG.AUDIO || {}).filter(([key]) => scope === 'all' || key.startsWith(id + '|'));
    const unique = [...new Set(rows.map(([, url]) => url))];
    return unique.filter(url => {
      try { const u = new URL(url, document.baseURI); return u.origin === location.origin && /\.mp3$/i.test(u.pathname); }
      catch (_) { return false; }
    }).map(url => ({ url, bytes: byteSize(url) }));
  }
  async function stored(cache, file) {
    const response = await cache.match(file.url);
    if (!response || response.status !== 200 || response.headers.has('Content-Range')) return null;
    let bytes = Number(response.headers.get('X-MG-Audio-Bytes') || response.headers.get('Content-Length'));
    if (!bytes) bytes = (await response.arrayBuffer()).byteLength;
    return bytes > 0 && (!file.bytes || bytes === file.bytes) ? bytes : null;
  }
  function totals(list) {
    return { total: list.length, totalBytes: list.every(f => f.bytes > 0) ? list.reduce((n, f) => n + f.bytes, 0) : 0 };
  }
  async function inspect(list, cache) {
    const result = { ...totals(list), count: 0, bytes: 0, missing: [], ready: false };
    // Bounded batches keep large packs responsive without opening thousands of reads at once.
    for (let i = 0; i < list.length; i += 24) {
      const batch = await Promise.all(list.slice(i, i + 24).map(async file => ({ file, bytes: await stored(cache, file) })));
      batch.forEach(({ file, bytes }) => {
        if (bytes) { result.count++; result.bytes += bytes; } else result.missing.push(file.url);
      });
    }
    result.ready = result.total > 0 && result.count === result.total;
    return result;
  }
  async function status(scope = 'selected') {
    if (!supported()) throw new Error('Offline storage is browser mein available nahi. HTTPS ya localhost par kholo.');
    return inspect(files(scope), await caches.open(NAME));
  }
  async function download(scope = 'selected', options = {}) {
    if (!supported()) throw new Error('Offline storage available nahi. HTTPS ya localhost par kholo.');
    const list = files(scope); // Freeze the chosen voice throughout this download.
    if (!list.length) throw new Error('Is voice ki audio files abhi available nahi.');
    const cache = await caches.open(NAME);
    const initial = await inspect(list, cache);
    const queue = list.filter(file => initial.missing.includes(file.url));
    const progress = { ...totals(list), done: initial.count, bytes: initial.bytes, failed: 0, stage: 'download' };
    const report = () => { if (options.onProgress) options.onProgress({ ...progress }); };
    const signal = options.signal;
    const cancelled = () => signal && signal.aborted;
    let firstError = null;
    let fatal = false;
    report();
    async function worker() {
      while (queue.length && !cancelled() && !fatal) {
        const file = queue.shift();
        try {
          const response = await fetch(file.url, { signal, cache: 'no-cache' });
          if (response.status !== 200 || response.headers.has('Content-Range')) throw new Error('Poora MP3 nahi mila (HTTP ' + response.status + ').');
          const buffer = await response.arrayBuffer();
          if (!buffer.byteLength || (file.bytes && file.bytes !== buffer.byteLength)) throw new Error('Audio file adhoori hai. Internet check karke retry karo.');
          if (cancelled()) break;
          const headers = new Headers(response.headers);
          headers.delete('Content-Encoding');
          headers.set('Content-Length', String(buffer.byteLength));
          headers.set('X-MG-Audio-Bytes', String(buffer.byteLength));
          headers.set('Content-Type', 'audio/mpeg');
          await cache.put(file.url, new Response(buffer, { status: 200, headers }));
          if (!(await stored(cache, file))) throw new Error('Browser ne audio save nahi ki. Storage / quota check karo.');
          progress.done++;
          progress.bytes += buffer.byteLength;
        } catch (error) {
          if (cancelled() || error.name === 'AbortError') break;
          progress.failed++;
          if (!firstError) firstError = error;
          if (error.name === 'QuotaExceededError' || /quota|storage|space/i.test(error.message)) fatal = true;
        }
        report();
      }
    }
    await Promise.all([worker(), worker(), worker()]);
    progress.stage = 'verify'; report();
    const verified = await inspect(list, cache);
    return { ...verified, cancelled: !!cancelled(), failed: progress.failed, error: firstError };
  }
  return { NAME, files, status, download, supported, reference };
})();

MG.offlineList = function (options = {}) {
  const scripts = [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src'));
  const shell = ['./', 'index.html', 'style.css', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'img/scenarios-v2.png']
    .concat(scripts).concat(Object.values(MG.PHOTOS || {}).map(p => p.src));
  return [...new Set(shell.concat(options.audio ? MG.audioCache.files(options.audio).map(f => f.url) : []))];
};
MG.formatBytes = bytes => bytes ? (bytes / (1024 * 1024)).toFixed(bytes < 1024 * 1024 ? 2 : 1) + ' MB' : 'size abhi unknown';

function backHead(title, sub) {
  const h = el('div', 'thead slim', `<button class="btn ghost small" id="back">⬅</button><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`);
  h.querySelector('#back').onclick = () => go('#/');
  return h;
}
const fmtDate = ms => { const d = new Date(ms); return `${d.getDate()}/${d.getMonth() + 1}`; };

/* ================================================================
   REVISION DOJO — Leitner flashcards (1, 3, 7, 16, 35, 70 din)
   "Aap bologe" wale phrase: matlab dekho → bolo → palto
   "Doosre bolenge" wale: pinyin dekho → matlab socho → palto
   ================================================================ */
function showDojo() {
  MG.session = null;
  appEl.innerHTML = '';
  const deck = Object.keys(MG.state.dojo).filter(id => MG.phrases[id]);
  const cards = shuffle(MG.dueCards());
  appEl.appendChild(backHead('🃏 Revision Dojo',
    `Deck mein ${deck.length} phrases · aaj due ${cards.length}. Yaad rahe to agli baar der se aayega, bhool gaye to kal phir.`));
  const box = el('div', 'dojo');
  appEl.appendChild(box);
  if (!cards.length) {
    const upcoming = deck.map(id => MG.state.dojo[id].due).sort((a, b) => a - b)[0];
    box.innerHTML = `<div class="empty">🎉 Aaj koi card due nahi.${upcoming ? ` Agla card ${fmtDate(upcoming)} ko.` : ' Level poora karo, phrases yahan aayenge.'}</div>`;
    return;
  }
  let i = 0, right = 0;
  function show() {
    MG.voice.stop();
    if (i >= cards.length) {
      box.innerHTML = `<div class="finish"><div class="finish-big">🧘</div><h2>Dojo session poora!</h2><p>${right}/${cards.length} yaad the.</p></div>`;
      const h = el('button', 'btn primary', '🏠 Home');
      h.onclick = () => go('#/');
      box.appendChild(h);
      renderTopbar();
      return;
    }
    const c = cards[i];
    const p = MG.view(MG.phrases[c.id]);
    const say = !p.who || p.who === 'you';
    box.innerHTML = '';
    box.appendChild(MG.g.progress(i, cards.length));
    const card = el('div', 'pcard flip');
    card.innerHTML = say
      ? `${MG.pv.pic(p, 'big')}<div class="q-label">🗣️ Kaise bologe? Pehle zor se bolo, phir palto.</div><div class="q-hi">${esc(p.hi)}</div>`
      : `<div class="who">${MG.castEmoji(p.who)} ${esc(CAST[p.who].name)} bolte hain:</div>${MG.pv.line(p, { big: true, han: false })}<div class="q-label">👂 Matlab kya hai? Socho, phir palto.</div>`;
    box.appendChild(card);
    if (!say) { const audio = MG.voice.buttons(p); if (audio) card.appendChild(audio); }
    const flip = el('button', 'btn primary', '🔄 Palto');
    flip.onclick = () => {
      MG.voice.stop();
      flip.remove();
      card.querySelectorAll('.vbtns').forEach(control => control.remove());
      card.innerHTML += `<div class="back">${say ? MG.pv.line(p, { big: true }) : ''}<div class="pc-hi">${esc(p.hi)} <span class="pc-img sm">${p.img || ''}</span></div>`
        + (p.note ? `<div class="pc-note">💡 ${esc(p.note)}</div>` : '') + '</div>';
      const vb = MG.voice.buttons(p);
      if (vb) card.appendChild(vb);
      const row = el('div', 'row');
      const no = el('button', 'btn bad', '😕 Bhool gaya');
      const yes = el('button', 'btn good', '🙂 Yaad tha');
      no.onclick = () => { MG.recordActivity('review'); MG.reviewCard(c.id, false); i++; show(); };
      yes.onclick = () => { MG.recordActivity('review'); MG.reviewCard(c.id, true); right++; MG.addXP(MG.CARD_XP); i++; show(); };
      row.append(no, yes);
      box.appendChild(row);
    };
    box.appendChild(flip);
  }
  show();
}

/* ================================================================
   MERI DIARY — seekhe hue phrases, search, aur 📱 Dikhao card
   ================================================================ */
MG.showCard = function (p) {
  p = MG.view(p);
  const o = el('div', 'fullcard');
  // kam akshar = bade akshar (door se bhi padh sakein)
  const n = MG.py.hanCount(p.zh);
  const size = n <= 2 ? 'min(34vw, 40vh)' : n <= 5 ? 'min(17vw, 22vh)' : n <= 10 ? 'min(11vw, 14vh)' : 'min(8vw, 10vh)';
  o.innerHTML = `<div class="fc-zh" style="font-size:${size}">${esc(p.zh)}</div><div class="fc-py">${MG.pv.inline(p.py)}</div>`
    + `<div class="fc-hi">${esc(p.hi)}</div><div class="fc-tip">📱 Yeh screen saamne wale ko dikhao · tap karke band karo</div>`;
  o.setAttribute('role', 'dialog');
  o.setAttribute('aria-modal', 'true');
  o.setAttribute('aria-label', 'Dikhao card: ' + p.hi);
  const audio = MG.voice.buttons(p);
  if (audio) o.appendChild(audio);
  const previous = document.activeElement;
  const close = el('button', 'btn fc-close', 'Band karo ✕');
  const dismiss = () => { MG.voice.stop(); o.remove(); if (previous && previous.focus) previous.focus(); };
  close.onclick = e => { e.stopPropagation(); dismiss(); };
  o.appendChild(close);
  o.onclick = dismiss;
  o.onkeydown = e => {
    if (e.key === 'Escape') dismiss();
    if (e.key === 'Tab') {
      const buttons = [...o.querySelectorAll('button:not(:disabled)')];
      const index = buttons.indexOf(document.activeElement);
      e.preventDefault();
      buttons[(index + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
    }
  };
  document.body.appendChild(o);
  close.focus();
};

function showDiary() {
  appEl.innerHTML = '';
  appEl.appendChild(backHead('Quick phrasebook', 'Saare phrases yahan hain. 📱 Dikhao dabao to bade Chinese akshar khulte hain — taxi driver ya waiter ko dikhane ke liye.'));
  const bar = el('div', 'dbar');
  const q = el('input', 'search');
  q.setAttribute('aria-label', 'Phrase search: Hinglish, pinyin ya Chinese');
  q.placeholder = '🔍 Dhoondo: "paani", "xiexie", "bill"…';
  const all = el('label', 'tog', '<input type="checkbox" checked> Saare phrases (unlearned bhi)');
  const category = el('select', 'search');
  category.setAttribute('aria-label', 'Situation filter');
  category.innerHTML = '<option value="">Har situation</option>' + MG.tracks.map(t => `<option value="${esc(t.id)}">${esc(t.name.split(' — ')[0])}</option>`).join('');
  bar.append(q, category, all);
  const list = el('div', 'dlist');
  appEl.append(bar, list);
  const norm = s => MG.py.strip(String(s || '')).toLowerCase();
  function render() {
    MG.voice.stop();
    const showAll = all.querySelector('input').checked;
    const needle = norm(q.value).trim();
    list.innerHTML = '';
    let n = 0;
    MG.tracks.forEach(t => {
      if (category.value && category.value !== t.id) return;
      const rows = [];
      MG.levelsOf(t).forEach(l => {
        if (!showAll && !MG.state.completed.includes(l.id)) return;
        (l.phrases || []).forEach(p0 => {
          const p = MG.view(p0);
          if (needle && !(norm(p.hi).includes(needle) || norm(p.py).replace(/\s/g, '').includes(needle.replace(/\s/g, '')) || String(p.zh).includes(q.value.trim()))) return;
          rows.push(p);
        });
      });
      if (!rows.length) return;
      list.appendChild(el('h3', 'dgroup', `${t.icon} ${esc(t.name)}`));
      rows.forEach(p => {
        n++;
        const r = el('div', 'drow');
        r.innerHTML = MG.pv.pic(p, 'thumb');
        const expand = el('button', 'dr-expand dr-main', `${MG.pv.inline(p.py)}<small>${esc(p.hi)}</small>`);
        expand.setAttribute('aria-expanded', 'false');
        r.appendChild(expand);
        const show = el('button', 'btn small', '📱');
        show.title = 'Dikhao card';
        show.setAttribute('aria-label', 'Chinese mein dikhao: ' + p.hi);
        show.onclick = e => { e.stopPropagation(); MG.showCard(p); };
        r.appendChild(show);
        expand.onclick = () => {
          MG.voice.stop();
          const open = r.nextSibling && r.nextSibling.classList && r.nextSibling.classList.contains('dexp');
          list.querySelectorAll('.dexp').forEach(x => x.remove());
          list.querySelectorAll('.dr-expand').forEach(b => b.setAttribute('aria-expanded', 'false'));
          if (open) return;
          expand.setAttribute('aria-expanded', 'true');
          const x = el('div', 'dexp', MG.pv.line(p, { big: true }) + (p.note ? `<div class="pc-note">💡 ${esc(p.note)}</div>` : ''));
          const audio = MG.voice.buttons(p);
          if (audio) x.appendChild(audio);
          r.after(x);
        };
        list.appendChild(r);
      });
    });
    if (!n) list.appendChild(el('div', 'empty', needle ? 'Kuch nahi mila. Doosra shabd try karo.' : 'Abhi diary khaali hai. Pehla level poora karo! 🚀'));
  }
  category.onchange = render;
  q.oninput = render;
  all.querySelector('input').onchange = render;
  render();
}

/* ================================================================
   RANG AUR NISHAAN — legend
   ================================================================ */
function showLegend() {
  appEl.innerHTML = '';
  appEl.appendChild(backHead('🎨 Rang aur nishaan', 'Ek baar samajh lo, phir har screen apne aap padhi jaayegi.'));
  const box = el('div', 'legend');
  box.innerHTML = '<h3>1. Har tone ki shakal aur rang</h3>' + MG.pv.visual('tonechart')
    + [1, 2, 3, 4, 0].map(t => `<div class="lg-row t${t}">${MG.pv.glyph(t === 1 ? [5, 5] : t === 2 ? [3, 5] : t === 3 ? [2, 1, 4] : t === 4 ? [5, 1] : [3], t)}`
      + `<div><b>${esc(MG.TONES[t].name)}</b><br>${esc(MG.TONES[t].hint)}</div></div>`).join('')
    + '<h3>2. ↻ nishaan — likha kuch, bolte kuch</h3>' + MG.pv.visual('sandhi33')
    + '<p class="practice-note">Lambi Tone 3 sequences mein grouping aur rhythm matter karte hain. App basic word grouping ka simplified guide dikhata hai; exact natural speech ka ek universal pattern nahi.</p>'
    + '<p>Tone 3 sentence ke beech mein ho to sirf <b>neeche dabao</b> (upar mat uthao). Line chhoti dikhegi: yeh "half third" hai.</p>'
    + '<h3>3. Optional Devanagari badges</h3><p>Hindi hints approximate mouth cues hain; exact Mandarin sounds ka substitute nahi.</p>' + MG.pv.visual('badges')
    + '<h3>4. Pinyin ke shuru wale akshar → Hindi</h3><div class="lg-grid">'
    + 'b p m f d t n l g k h j q x zh ch sh r z c s'.split(' ').map(ini => {
      const base = { j: 'ji', q: 'qi', x: 'xi', zh: 'zhi', ch: 'chi', sh: 'shi', r: 'ri', z: 'zi', c: 'ci', s: 'si' }[ini] || ini + 'a';
      const h = MG.deva.hint({ base, er: false });
      const marks = (h.asp ? '💨' : '') + (h.ret ? '👅' : '') + (h.buzz ? '🐝' : '');
      return `<div class="lg-cell"><b>${ini}</b><span>${h.dv}${marks ? '<sup>' + marks + '</sup>' : ''}</span><small>${base}</small></div>`;
    }).join('') + '</div>';
  appEl.appendChild(box);
}

/* ================================================================
   SETTINGS
   ================================================================ */
function showSettings() {
  appEl.innerHTML = '';
  appEl.appendChild(backHead('⚙️ Settings'));
  const P = MG.state.profile;
  const box = el('div', 'settings');

  const g = el('div', 'set-sec', '<h3>Aap kaun ho?</h3><p class="muted">GF ke parents ko "boyfriend" ya "girlfriend" — Chinese shabd alag hai. Yeh choice lesson mein relationship word chunti hai.</p>');
  const gr = el('div', 'row wrap');
  [['m', '👨🏽 Ladka · 男朋友'], ['f', '👩🏽 Ladki · 女朋友']].forEach(([k, label]) => {
    const b = el('button', 'btn choice' + (P.gender === k ? ' on' : ''), label);
    b.onclick = () => { P.gender = k; MG.saveState(); showSettings(); };
    gr.appendChild(b);
  });
  g.appendChild(gr);
  box.appendChild(g);

  const pace = el('div', 'set-sec', '<h3>Roz ki practice</h3><p class="muted">6-week path flexible hai. Pace aur focus kabhi bhi badlo.</p>');
  const minutes = el('select', 'search');
  minutes.setAttribute('aria-label', 'Daily practice minutes');
  [10,15,20,30].forEach(n => { const o = el('option', '', n + ' min / day'); o.value = n; o.selected = P.dailyMinutes === n; minutes.appendChild(o); });
  minutes.onchange = () => { P.dailyMinutes = Number(minutes.value); MG.saveState(); };
  const focus = el('select', 'search');
  focus.setAttribute('aria-label', 'Learning focus');
  [['balanced','Balanced: daily travel + family/friends'],['family','Family aur friends pehle'],['travel','Travel, food aur shopping pehle']].forEach(([id, name]) => { const o = el('option', '', name); o.value = id; o.selected = P.focus === id; focus.appendChild(o); });
  focus.onchange = () => { P.focus = focus.value; MG.saveState(); };
  pace.append(minutes, focus); box.appendChild(pace);
  const v = el('div', 'set-sec', '<h3>Kya-kya dikhe?</h3>');
  const preview = el('div', 'set-prev');
  const draw = () => { preview.innerHTML = MG.pv.line({ zh: '谢谢，不客气！', py: 'Xièxie, bú kèqi!' }, { big: true }); };
  [['showDeva', 'Devanagari hint (नी · हाओ)'], ['showBadges', 'Badges (💨 👅 🐝 😗)'], ['showHan', 'Chhote Chinese akshar (汉)']].forEach(([k, label]) => {
    const t = el('label', 'tog', `<input type="checkbox"${P[k] ? ' checked' : ''}> ${label}`);
    t.querySelector('input').onchange = e => { P[k] = e.target.checked; MG.saveState(); draw(); };
    v.appendChild(t);
  });
  draw();
  v.appendChild(preview);
  box.appendChild(v);

  const d = el('div', 'set-sec', '<h3>Progress</h3><p class="muted">Laptop se phone pe le jaana ho to Export → phone pe Import.</p>');
  const row = el('div', 'row wrap');
  const ex = el('button', 'btn ghost', '⬇️ Export');
  ex.onclick = () => {
    const blob = new Blob([JSON.stringify(MG.state)], { type: 'application/json' });
    const a = el('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mandarin-gurukul-${MG.todayStr()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const im = el('label', 'btn ghost', '⬆️ Import<input type="file" accept="application/json" hidden>');
  im.querySelector('input').onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    f.text().then(txt => {
      try {
        const s = JSON.parse(txt);
        if (!s || !Number.isFinite(s.xp) || !Array.isArray(s.completed)) throw new Error('format');
        localStorage.setItem(MG.STORE_KEY, txt);
        MG.state = MG.loadState();
        alert('✅ Progress aa gaya!');
        go('#/');
      } catch (err) { alert('❌ Yeh file Mandarin Gurukul ki progress file nahi lagti.'); }
    });
  };
  const rs = el('button', 'btn bad', '🗑️ Reset');
  rs.onclick = () => {
    if (!confirm('Saara progress (XP, levels, Dojo) mit jaayega. Pakka?')) return;
    MG.state = MG.defaultState();
    MG.saveState();
    go('#/');
  };
  row.append(ex, im, rs);
  d.appendChild(row);
  box.appendChild(d);

  const voice = el('div', 'set-sec', '<h3>🔊 Reference awaaz</h3><p class="muted">Standard Mandarin · har phrase ki normal aur naturally slow recording. Suno → pause karo → khud bolo → phir compare karo.</p>');
  const voiceChoices = el('div', 'row wrap');
  [['female', '👩 Xiaoxiao · Female'], ['male', '👨 Yunxi · Male']].forEach(([id, label]) => {
    const choice = el('button', 'btn choice' + (MG.audioCache.reference() === id ? ' on' : ''), label);
    choice.id = 'audio-voice-' + id;
    choice.setAttribute('aria-pressed', String(MG.audioCache.reference() === id));
    choice.onclick = () => {
      if (MG.voice.setReferenceVoice) MG.voice.setReferenceVoice(id);
      else { P.referenceVoice = id; MG.saveState(); }
      voiceChoices.querySelectorAll('button').forEach(button => {
        const selected = button.id === 'audio-voice-' + id;
        button.classList.toggle('on', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      refreshAudioStatus();
    };
    voiceChoices.appendChild(choice);
  });
  voice.appendChild(voiceChoices);
  const sample = MG.voice.buttons({ zh: '你好！', who: 'teacher' });
  if (sample) { voice.appendChild(el('p', 'muted', 'Try karo: Nǐ hǎo! · Hello')); voice.appendChild(sample); }
  box.appendChild(voice);

  const off = el('div', 'set-sec', '<h3>📥 China ke liye offline</h3><p class="muted">App aur photos pehle save karo. Audio pack alag download hota hai; normal aur slow dono recordings saath milti hain. Trip se pehle airplane mode mein sun kar check karo.</p>');
  const save = el('button', 'btn primary', '📥 App aur photos save karo');
  save.id = 'offline-shell-download';
  save.onclick = () => {
    const worker = navigator.serviceWorker && navigator.serviceWorker.controller;
    if (!worker) { save.textContent = '⚠️ Offline helper ke liye app ek baar reload karo'; return; }
    save.disabled = true;
    save.textContent = '📥 App aur photos save ho rahe hain…';
    const channel = new MessageChannel();
    const timeout = setTimeout(() => {
      save.disabled = false;
      save.textContent = '⚠️ Save confirm nahi hua. Internet check karke retry karo.';
      channel.port1.close();
    }, 60000);
    channel.port1.onmessage = event => {
      clearTimeout(timeout);
      save.disabled = false;
      const result = event.data || {};
      save.textContent = result.ok ? `✅ App aur photos: ${result.total} files verified` : '⚠️ App save nahi hua. Internet / browser storage check karke retry karo.';
      channel.port1.close();
    };
    worker.postMessage({ type: 'MG_CACHE_SHELL' }, [channel.port2]);
  };
  off.appendChild(save);
  const scope = el('select', 'search');
  scope.id = 'audio-pack-scope';
  scope.setAttribute('aria-label', 'Offline audio pack');
  scope.innerHTML = '<option value="selected">Selected reference voice</option><option value="all">Dono voices</option>';
  const status = el('p', 'practice-note', 'Audio pack check ho raha hai…');
  status.id = 'audio-pack-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const packRow = el('div', 'row wrap');
  const download = el('button', 'btn primary', '📥 Audio pack download');
  download.id = 'audio-pack-download';
  const cancel = el('button', 'btn ghost', 'Cancel download');
  cancel.id = 'audio-pack-cancel';
  cancel.hidden = true;
  packRow.append(download, cancel);
  off.append(scope, status, packRow);
  off.appendChild(el('p', 'muted', 'Download is device aur browser mein rahega. Dobara dabane par sirf missing files aayengi. Browser storage clear hone par pack phir download karna hoga.'));
  box.appendChild(off);
  let statusRequest = 0;
  const packName = () => scope.value === 'all' ? 'Dono voices' : (MG.audioCache.reference() === 'male' ? 'Yunxi voice' : 'Xiaoxiao voice');
  const resultText = (result, name) => {
    const size = result.totalBytes ? MG.formatBytes(result.totalBytes) : 'size available nahi';
    return result.ready ? `✅ ${name}: ${result.count}/${result.total} recordings offline verified · ${MG.formatBytes(result.bytes)}`
      : `${name}: ${result.count}/${result.total} saved · ${size} total. Normal + slow dono included.`;
  };
  function displayTask(task) {
    if (task.running) scope.value = task.scope;
    scope.disabled = task.running;
    download.disabled = task.running;
    cancel.hidden = !task.running;
    if (task.running && task.progress) {
      const p = task.progress;
      status.textContent = p.stage === 'verify' ? 'Saved audio verify ho rahi hai…'
        : `📥 ${task.name}: ${p.done}/${p.total} recordings · ${MG.formatBytes(p.bytes)}${p.totalBytes ? ' / ' + MG.formatBytes(p.totalBytes) : ''}${p.failed ? ' · ' + p.failed + ' failed' : ''}`;
    } else if (task.result) {
      const r = task.result;
      status.textContent = resultText(r, task.name);
      if (!r.ready && r.cancelled) status.textContent += ' Download cancel hua; saved files safe hain. Resume se missing files aayengi.';
      else if (!r.ready && r.error) status.textContent += ' ' + r.error.message + ' Retry se sirf missing files aayengi.';
      download.textContent = r.ready ? '✓ Audio pack dobara verify / retry' : '📥 Missing audio download / resume';
    } else if (task.error) {
      status.textContent = '⚠️ ' + task.error.message;
    }
  }
  async function refreshAudioStatus() {
    const request = ++statusRequest;
    if (MG.audioPackTask && MG.audioPackTask.running) {
      MG.audioPackTask.update = displayTask;
      displayTask(MG.audioPackTask);
      return;
    }
    scope.disabled = false;
    download.disabled = false;
    cancel.hidden = true;
    const name = packName();
    status.textContent = name + ': saved audio check ho rahi hai…';
    try {
      const result = await MG.audioCache.status(scope.value);
      if (request !== statusRequest) return;
      status.textContent = result.total ? resultText(result, name) : 'Audio catalog abhi available nahi.';
      download.disabled = !result.total;
      download.textContent = result.ready ? '✓ Audio pack verify / retry' : '📥 Audio pack download / resume';
    } catch (error) {
      if (request !== statusRequest) return;
      status.textContent = '⚠️ ' + error.message;
      download.disabled = true;
    }
  }
  scope.onchange = refreshAudioStatus;
  download.onclick = async () => {
    if (MG.audioPackTask && MG.audioPackTask.running) return;
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      status.textContent = '⚠️ Offline playback ke liye app ek baar reload karo; offline helper active hona chahiye.';
      return;
    }
    ++statusRequest;
    const task = { running: true, controller: new AbortController(), name: packName(), scope: scope.value, update: displayTask };
    MG.audioPackTask = task;
    task.progress = { done: 0, total: MG.audioCache.files(task.scope).length, bytes: 0 };
    displayTask(task);
    try {
      task.result = await MG.audioCache.download(task.scope, {
        signal: task.controller.signal,
        onProgress: progress => { task.progress = progress; task.update(task); },
      });
    } catch (error) { task.error = error; }
    task.running = false;
    task.update(task);
  };
  cancel.onclick = () => { if (MG.audioPackTask) MG.audioPackTask.controller.abort(); };
  refreshAudioStatus();

  const photos = Object.values(MG.PHOTOS || {});
  if (photos.length) {
    const cr = el('div', 'set-sec', `<h3>📷 Photo credits</h3><p class="muted">${photos.length} photos Wikimedia Commons se, free licence ke saath.</p>`);
    cr.appendChild(el('div', 'credits', photos.map(p =>
      `<div>${esc(p.title)} — ${esc(p.author)} · ${esc(p.license)} · <a href="${esc(p.page)}" target="_blank" rel="noopener">source</a></div>`).join('')));
    box.appendChild(cr);
  }

  box.appendChild(el('p', 'practice-note', 'Scenario illustrations AI-generated hain. Fictional practice cast hai; household customs aur real logon ki preferences alag ho sakti hain.'));
  const a = el('div', 'set-sec', '<h3>App ke baare mein</h3>');
  const sw = typeof navigator !== 'undefined' && navigator.serviceWorker && navigator.serviceWorker.controller;
  a.innerHTML += `<p>🔊 Awaaz: ${MG.voice.available() ? 'standard Mandarin · normal + natural slow ✅' : 'audio catalog load nahi hua — internet ke saath reload karo'}</p>`
    + `<p>📶 Offline: ${sw ? 'helper active · download ke baad airplane mode mein check karo' : 'abhi nahi — app ko ek baar internet ke saath kholo / Home screen par add karo'}</p>`
    + `<p class="muted">Levels: ${MG.tracks.reduce((n, t) => n + MG.levelsOf(t).length, 0)} · Phrases: ${Object.keys(MG.phrases).length}</p>`;
  box.appendChild(a);
  appEl.appendChild(box);
}
