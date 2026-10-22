/* Mandarin Gurukul — recorded Standard Mandarin pronunciation.
   MP3s are generated ahead of time: no browser TTS, microphone, or API key.
   One Audio element is reused so a learner's tap also works on mobile Safari. */
(function () {
  const VOICES = { female: 'zh-CN-XiaoxiaoNeural', male: 'zh-CN-YunxiNeural' };
  const controls = new Set();
  const selectors = new Set();
  let sequence = 0;
  let view = { key: null, status: 'idle', message: '' };

  function active(request) { return MG.voice._current === request; }
  function clearTimer(request) {
    if (request.timer != null) clearTimeout(request.timer);
    request.timer = null;
  }
  function settle(request, result) {
    if (request.resolve) { request.resolve(result); request.resolve = null; }
  }
  function clean(request) {
    clearTimer(request);
    request.listeners.forEach(([name, listener]) => request.audio.removeEventListener(name, listener));
    request.listeners = [];
  }
  function resetAudio(audio) {
    if (!audio) return;
    try { audio.pause(); } catch (e) { /* Audio may not have loaded yet. */ }
    try { audio.currentTime = 0; } catch (e) { /* Some webviews reject seeking before metadata. */ }
  }
  function render(record) {
    const keys = ['norm', 'slow'].map(speed => MG.voice.keyFor(record.zh, record.who, speed === 'slow'));
    record.buttons.forEach((button, index) => {
      const present = MG.voice.has(record.zh, record.who, index === 1);
      const selected = view.key === keys[index];
      const status = selected ? view.status : 'idle';
      const running = status === 'loading' || status === 'playing';
      button.textContent = running ? '■ Stop' : index ? '🐢 Dheere' : '▶ Suno';
      button.disabled = !present;
      button.hidden = index === 1 && !present;
      button.dataset.voiceState = status;
      button.setAttribute('aria-pressed', String(running));
      button.setAttribute('aria-busy', String(status === 'loading'));
      button.setAttribute('aria-label', running ? 'Pronunciation roko' : index ? 'Dheere Mandarin pronunciation suno' : 'Mandarin pronunciation suno');
      button.title = `${index ? 'Natural slow' : 'Normal'} · ${MG.voice.voiceFor(record.who) === VOICES.male ? 'Male' : 'Female'} reference voice`;
    });
    const selected = keys.includes(view.key);
    record.status.textContent = selected ? view.message : '';
    record.wrap.dataset.voiceState = selected ? view.status : 'idle';
  }
  function renderAll() {
    controls.forEach(record => {
      // A route can replace hundreds of cards; do not retain their old DOM.
      if (record.connected && record.wrap.isConnected === false) controls.delete(record);
      else { if (record.wrap.isConnected) record.connected = true; render(record); }
    });
    selectors.forEach(record => {
      if (record.connected && record.select.isConnected === false) selectors.delete(record);
      else {
        if (record.select.isConnected) record.connected = true;
        record.select.value = MG.voice.voiceFor() === VOICES.male ? 'male' : 'female';
      }
    });
  }
  function finish(request, status, message) {
    if (!active(request)) return;
    clean(request);
    MG.voice._current = null;
    settle(request, false);
    resetAudio(request.audio);
    view = { key: status === 'error' ? request.key : null, status, message: message || '' };
    renderAll();
  }
  function failed(request, error) {
    const blocked = error && error.name === 'NotAllowedError';
    finish(request, 'error', blocked
      ? 'Browser ne audio roka. Suno ya Dheere ko dobara tap karo.'
      : 'Audio load nahi hua. Internet ya offline download check karke dobara tap karo.');
  }
  function armTimeout(request) {
    clearTimer(request);
    request.timer = setTimeout(() => {
      if (active(request)) finish(request, 'error', 'Audio load hone mein zyada waqt laga. Dobara tap karo.');
    }, MG.voice._loadTimeoutMs);
  }
  function started(request) {
    if (!active(request) || request.audio.paused || request.audio.ended) return;
    clearTimer(request);
    request.status = 'playing';
    view = { key: request.key, status: 'playing', message: request.slow ? 'Dheere awaaz chal rahi hai.' : 'Awaaz chal rahi hai.' };
    settle(request, true);
    renderAll();
  }

  MG.voice = {
    VOICES,
    _audio: null,
    _current: null,
    _loadTimeoutMs: 15000,
    voiceFor() {
      const profile = MG.state && MG.state.profile;
      return VOICES[profile && profile.referenceVoice === 'male' ? 'male' : 'female'];
    },
    keyFor(zh, who, slow) {
      return `${MG.voice.voiceFor(who)}|${slow ? 'slow' : 'norm'}|${String(zh == null ? '' : zh).trim()}`;
    },
    available() {
      return typeof MG.AUDIO === 'object' && MG.AUDIO !== null && Object.keys(MG.AUDIO).length > 0;
    },
    has(zh, who, slow) {
      const audio = MG.AUDIO;
      return !!audio && typeof audio === 'object' && typeof audio[MG.voice.keyFor(zh, who, slow)] === 'string'
        && audio[MG.voice.keyFor(zh, who, slow)].length > 0;
    },
    setReferenceVoice(choice) {
      if (!Object.prototype.hasOwnProperty.call(VOICES, choice) || !MG.state || !MG.state.profile) return false;
      if (MG.state.profile.referenceVoice === choice) return true;
      MG.voice.stop();
      MG.state.profile.referenceVoice = choice;
      MG.saveState();
      renderAll();
      return true;
    },
    selector(title) {
      const select = MG.el('select', 'voice-select');
      select.setAttribute('aria-label', title || 'Reference awaaz');
      select.title = title || 'Reference awaaz';
      [['female', 'Female · Xiaoxiao'], ['male', 'Male · Yunxi']].forEach(([value, text]) => {
        const option = MG.el('option');
        option.value = value;
        option.textContent = text;
        select.appendChild(option);
      });
      select.value = MG.voice.voiceFor() === VOICES.male ? 'male' : 'female';
      select.addEventListener('click', event => event.stopPropagation());
      select.onchange = event => { event.stopPropagation(); MG.voice.setReferenceVoice(select.value); };
      selectors.add({ select, connected: false });
      return select;
    },
    play(zh, who, slow) {
      // Always settle the previous request, even when a browser leaves play()
      // pending during a source change. Its late promise cannot change our UI.
      MG.voice.stop();
      if (!MG.voice.has(zh, who, slow)) return Promise.resolve(false);
      const key = MG.voice.keyFor(zh, who, slow);
      if (!MG.voice._audio) {
        try { MG.voice._audio = new Audio(); }
        catch (e) {
          view = { key, status: 'error', message: 'Is browser mein audio nahi chala. Doosre browser mein try karo.' };
          renderAll();
          return Promise.resolve(false);
        }
      }
      const audio = MG.voice._audio;
      const request = { token: ++sequence, key, zh: String(zh).trim(), who, slow: !!slow,
        audio, status: 'loading', listeners: [], timer: null, resolve: null };
      const promise = new Promise(resolve => { request.resolve = resolve; });
      MG.voice._current = request;
      view = { key, status: 'loading', message: 'Audio load ho raha hai…' };
      renderAll();
      const on = (name, listener) => {
        audio.addEventListener(name, listener);
        request.listeners.push([name, listener]);
      };
      on('playing', () => started(request));
      on('ended', () => finish(request, 'idle'));
      on('error', () => failed(request, audio.error));
      on('pause', () => { if (audio.paused) finish(request, 'idle'); });
      ['waiting', 'stalled'].forEach(name => on(name, () => {
        if (!active(request)) return;
        request.status = 'loading';
        view = { key, status: 'loading', message: 'Audio load ho raha hai…' };
        armTimeout(request);
        renderAll();
      }));
      armTimeout(request);
      try {
        // Slow clips are separately synthesized speech, never a slowed player.
        audio.preload = 'auto';
        audio.src = MG.AUDIO[key];
        audio.playbackRate = 1;
        audio.defaultPlaybackRate = 1;
        // Keep play() synchronous with the tap; awaiting fetch/load breaks the
        // user gesture requirement on iPhone and some Android webviews.
        const result = audio.play();
        if (result && typeof result.then === 'function') result.then(() => started(request), error => failed(request, error));
      } catch (error) { failed(request, error); }
      return promise;
    },
    stop() {
      const request = MG.voice._current;
      if (request) {
        clean(request);
        MG.voice._current = null;
        settle(request, false);
      }
      resetAudio(MG.voice._audio);
      view = { key: null, status: 'idle', message: '' };
      renderAll();
    },
    buttons(line, who) {
      if (!line || !line.zh || !MG.voice.has(line.zh, who || line.who || 'you', false)) return null;
      const wrap = MG.el('span', 'vbtns');
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', 'Mandarin pronunciation');
      const record = { wrap, zh: String(line.zh).trim(), who: who || line.who || 'you', buttons: [], status: null, connected: false };
      ['norm', 'slow'].forEach((speed, index) => {
        const button = MG.el('button', 'vbtn');
        button.type = 'button';
        button.dataset.speed = speed;
        button.onclick = event => {
          event.stopPropagation();
          const request = MG.voice._current;
          if (request && request.key === MG.voice.keyFor(record.zh, record.who, index === 1)) MG.voice.stop();
          else MG.voice.play(record.zh, record.who, index === 1);
        };
        record.buttons.push(button);
        wrap.appendChild(button);
      });
      const status = MG.el('span', 'voice-status');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.setAttribute('aria-atomic', 'true');
      wrap.appendChild(status);
      record.status = status;
      renderAll();
      controls.add(record);
      render(record);
      return wrap;
    },
    canRecord() { return false; },
  };
})();
