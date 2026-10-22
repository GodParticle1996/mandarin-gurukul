#!/usr/bin/env node
/* Real voice.js + core persistence, with controlled media events (no network). */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');

function element(tag) {
  return {
    tagName: tag, children: [], attributes: {}, dataset: {}, textContent: '', innerHTML: '',
    className: '', disabled: false, hidden: false, value: '', listeners: {}, isConnected: false,
    appendChild(child) { this.children.push(child); return child; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] ?? null; },
    addEventListener(name, listener) { this.listeners[name] = listener; },
    click() { if (!this.disabled) this.onclick?.({ stopPropagation() {} }); },
  };
}

function app(saved) {
  const store = new Map(saved ? [['mandaringurukul-v1', saved]] : []);
  const timers = new Map();
  let timerId = 0;
  class FakeAudio {
    constructor() {
      FakeAudio.instances.push(this);
      this.listeners = new Map(); this.requests = []; this.paused = true;
      this.ended = false; this.currentTime = 0; this.playbackRate = 1;
    }
    set src(value) { this._src = value; this.paused = true; this.ended = false; }
    get src() { return this._src; }
    addEventListener(name, listener) {
      if (!this.listeners.has(name)) this.listeners.set(name, new Set());
      this.listeners.get(name).add(listener);
    }
    removeEventListener(name, listener) { this.listeners.get(name)?.delete(listener); }
    emit(name) { [...(this.listeners.get(name) || [])].forEach(listener => listener({ target: this })); }
    play() {
      const request = { src: this.src };
      this.requests.push(request);
      return new Promise((resolve, reject) => { request.resolve = resolve; request.reject = reject; });
    }
    pause() { this.paused = true; this.emit('pause'); }
    start() {
      this.paused = false; this.ended = false;
      this.emit('playing'); this.requests.at(-1).resolve();
    }
    end() { this.paused = true; this.ended = true; this.emit('ended'); }
  }
  FakeAudio.instances = [];
  const context = vm.createContext({
    console, Audio: FakeAudio,
    document: { createElement: element, getElementById: () => null },
    localStorage: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    setTimeout: callback => { timers.set(++timerId, callback); return timerId; },
    clearTimeout: id => timers.delete(id),
  });
  ['core.js', 'voice.js'].forEach(file => vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file }));
  const MG = vm.runInContext('MG', context);
  MG.AUDIO = {};
  for (const [choice, voice] of Object.entries(MG.voice.VOICES)) {
    for (const [index, zh] of ['你好', '谢谢'].entries()) {
      for (const speed of ['norm', 'slow']) MG.AUDIO[`${voice}|${speed}|${zh}`] = `audio/${choice}-${index}-${speed}.mp3`;
    }
  }
  const attach = node => { node.isConnected = true; return node; };
  return { MG, voice: MG.voice, Audio: FakeAudio, timers, attach,
    saved: () => store.get('mandaringurukul-v1'),
    flushTimers: () => { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach(callback => callback()); },
  };
}

const tick = () => new Promise(resolve => setImmediate(resolve));
let passed = 0;
async function test(name, fn) {
  await fn(); passed++; console.log('  ✅ ' + name);
}

(async () => {
  console.log('=== Recorded pronunciation lifecycle ===');
  await test('standard reference voice is independent of learner gender and character', () => {
    const { MG, voice } = app();
    MG.state.profile.gender = 'm';
    assert.equal(voice.voiceFor('dad'), voice.VOICES.female);
    assert.equal(voice.keyFor(' 你好 ', 'you', true), 'zh-CN-XiaoxiaoNeural|slow|你好');
    assert.equal(voice.canRecord(), false);
  });
  await test('no manifest means no pretend playback or controls', async () => {
    const { MG, voice, Audio } = app();
    MG.AUDIO = {};
    assert.equal(voice.available(), false);
    assert.equal(voice.buttons({ zh: '你好' }), null);
    assert.equal(await voice.play('你好'), false);
    assert.equal(Audio.instances.length, 0);
  });
  await test('play stays loading until media starts, and resolves before it ends', async () => {
    const { voice, attach, timers } = app();
    const wrap = attach(voice.buttons({ zh: '你好' }));
    const [normal, slow, status] = wrap.children;
    const playback = voice.play('你好');
    let settled = false; playback.then(() => { settled = true; });
    await tick();
    assert.equal(settled, false);
    assert.equal(normal.dataset.voiceState, 'loading');
    assert.equal(normal.textContent, '■ Stop');
    assert.match(status.textContent, /load/);
    assert.equal(status.getAttribute('aria-live'), 'polite');
    assert.equal(normal.getAttribute('aria-pressed'), 'true');
    voice._audio.start();
    assert.equal(await playback, true);
    assert.equal(normal.dataset.voiceState, 'playing');
    assert.equal(slow.textContent, '🐢 Dheere');
    assert.equal(timers.size, 0);
    voice._audio.end();
    assert.equal(voice._current, null);
    assert.equal(normal.textContent, '▶ Suno');
    assert.equal(normal.getAttribute('aria-pressed'), 'false');
    assert.equal(status.textContent, '');
  });
  await test('normal and natural slow use different files at playback rate 1', async () => {
    const { voice, Audio } = app();
    const normal = voice.play('你好');
    voice._audio.start(); assert.equal(await normal, true);
    const normalSrc = voice._audio.src;
    const slow = voice.play('你好', 'you', true);
    assert.notEqual(voice._audio.src, normalSrc);
    assert.match(voice._audio.src, /slow/);
    assert.equal(voice._audio.playbackRate, 1);
    assert.equal(voice._audio.defaultPlaybackRate, 1);
    voice._audio.start(); assert.equal(await slow, true);
    assert.equal(Audio.instances.length, 1, 'one media element is reused');
  });
  await test('rapid source changes settle cancelled requests and ignore late promises', async () => {
    const { voice, attach } = app();
    const firstWrap = attach(voice.buttons({ zh: '你好' }));
    const secondWrap = attach(voice.buttons({ zh: '谢谢' }));
    const first = voice.play('你好');
    const audio = voice._audio;
    const oldRequest = audio.requests[0];
    const second = voice.play('谢谢');
    assert.equal(await first, false);
    oldRequest.reject(Object.assign(new Error('Source interrupted'), { name: 'AbortError' }));
    await tick();
    assert.equal(voice._current.zh, '谢谢');
    assert.equal(secondWrap.children[0].dataset.voiceState, 'loading');
    assert.equal(firstWrap.children[0].dataset.voiceState, 'idle');
    audio.start(); assert.equal(await second, true);
    assert.equal(audio.listeners.get('playing').size, 1);
    voice.stop();
    assert.equal([...audio.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0), 0);
  });
  await test('same active button stops both loading and playing; another clip can play', async () => {
    const { voice, attach } = app();
    const wrap = attach(voice.buttons({ zh: '你好' }));
    const [normal, slow] = wrap.children;
    normal.click();
    const loading = voice._current;
    assert.ok(loading);
    normal.click();
    assert.equal(voice._current, null);
    assert.equal(voice._audio.paused, true);
    normal.click(); voice._audio.start(); await tick();
    normal.click(); assert.equal(voice._current, null);
    slow.click(); assert.equal(voice._current.slow, true);
    voice._audio.start(); await tick();
    assert.equal(slow.dataset.voiceState, 'playing');
    voice.stop();
  });
  await test('network error and blocked playback show a retryable error, never success', async () => {
    const { voice, attach } = app();
    const wrap = attach(voice.buttons({ zh: '你好' }));
    const first = voice.play('你好');
    voice._audio.error = { code: 2 };
    voice._audio.emit('error');
    assert.equal(await first, false);
    assert.equal(wrap.children[0].dataset.voiceState, 'error');
    assert.equal(wrap.children[0].disabled, false);
    assert.match(wrap.children[2].textContent, /dobara/);
    const second = voice.play('你好');
    voice._audio.requests.at(-1).reject(Object.assign(new Error('Tap required'), { name: 'NotAllowedError' }));
    assert.equal(await second, false);
    assert.match(wrap.children[2].textContent, /Browser/);
    const retry = voice.play('你好'); voice._audio.start();
    assert.equal(await retry, true);
    assert.equal(wrap.children[0].dataset.voiceState, 'playing');
    voice.stop();
  });
  await test('hung startup times out and a stalled clip can recover or time out', async () => {
    const { voice, attach, flushTimers, timers } = app();
    const wrap = attach(voice.buttons({ zh: '你好' }));
    const hung = voice.play('你好');
    flushTimers();
    assert.equal(await hung, false);
    assert.equal(wrap.children[0].dataset.voiceState, 'error');
    assert.match(wrap.children[2].textContent, /waqt/);
    const next = voice.play('你好'); voice._audio.start();
    assert.equal(await next, true);
    voice._audio.emit('waiting');
    assert.equal(wrap.children[0].dataset.voiceState, 'loading');
    assert.equal(timers.size, 1);
    voice._audio.emit('playing');
    assert.equal(wrap.children[0].dataset.voiceState, 'playing');
    assert.equal(timers.size, 0);
    voice._audio.emit('stalled'); flushTimers();
    assert.equal(voice._current, null);
    assert.equal(wrap.children[0].dataset.voiceState, 'error');
  });
  await test('voice switch stops pending playback, persists, updates every control and selector', async () => {
    const a = app(), { voice, attach } = a;
    const wrap = attach(voice.buttons({ zh: '你好' }));
    const selector = attach(voice.selector());
    const otherSelector = attach(voice.selector('Awaaz badlo'));
    const pending = voice.play('你好');
    selector.value = 'male'; selector.onchange({ stopPropagation() {} });
    assert.equal(await pending, false);
    assert.equal(voice._current, null);
    assert.equal(otherSelector.value, 'male');
    assert.match(wrap.children[0].title, /Male/);
    assert.equal(app(a.saved()).voice.voiceFor('mom'), voice.VOICES.male);
    const male = voice.play('你好');
    assert.match(voice._audio.src, /male-0-norm/);
    voice._audio.start(); assert.equal(await male, true);
    assert.equal(voice.setReferenceVoice('invalid'), false);
    assert.equal(voice._current.status, 'playing');
    voice.stop();
  });
  await test('multiple controls created before parent insertion all stay synchronized', () => {
    const { voice, attach } = app();
    const first = voice.buttons({ zh: '你好' });
    const second = voice.buttons({ zh: '你好' });
    attach(first); attach(second);
    first.children[0].click();
    assert.equal(first.children[0].dataset.voiceState, 'loading');
    assert.equal(second.children[0].dataset.voiceState, 'loading');
    second.children[0].click();
    assert.equal(first.children[0].textContent, '▶ Suno');
  });
  await test('pause from OS or route stop clears UI without losing phrase siblings', async () => {
    const { voice, attach } = app();
    const card = element('div');
    const meaning = element('p'); meaning.textContent = 'Namaste'; card.appendChild(meaning);
    const wrap = attach(voice.buttons({ zh: '你好' })); card.appendChild(wrap);
    const playback = voice.play('你好'); voice._audio.start(); assert.equal(await playback, true);
    voice._audio.pause();
    assert.equal(voice._current, null);
    assert.equal(wrap.children[0].dataset.voiceState, 'idle');
    assert.equal(card.children[0].textContent, 'Namaste');
    const pending = voice.play('你好'); voice.stop(); assert.equal(await pending, false);
    voice._audio.requests.at(-1).resolve(); await tick();
    assert.equal(voice._current, null);
    assert.equal(wrap.children[2].textContent, '');
  });
  console.log(`\n${passed} passed, 0 failed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
