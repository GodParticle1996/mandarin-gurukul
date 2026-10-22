#!/usr/bin/env node
/* Cache correctness and byte ranges: no real browser, network or learner data. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://mandarin.example/app/';
const absolute = input => new URL(typeof input === 'string' ? input : input.url, BASE).href;
const makeCaches = () => {
  const stores = new Map();
  return {
    stores,
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const values = stores.get(name);
      return {
        async match(input) { return values.get(absolute(input))?.clone(); },
        async put(input, response) { values.set(absolute(input), response.clone()); },
        async keys() { return [...values.keys()].map(url => new Request(url)); },
      };
    },
  };
};

function app(fetch, cacheStorage = makeCaches()) {
  const MG = {
    state: { profile: { referenceVoice: 'female' } },
    PHOTOS: { test: { src: 'img/test.jpg' } },
    AUDIO: {
      'zh-CN-XiaoxiaoNeural|norm|你好': 'audio/female-normal.mp3',
      'zh-CN-XiaoxiaoNeural|slow|你好': 'audio/female-slow.mp3',
      'zh-CN-YunxiNeural|norm|你好': 'audio/male-normal.mp3',
      'zh-CN-YunxiNeural|slow|你好': 'audio/male-slow.mp3',
      'zh-CN-YunxiNeural|norm|unsafe': 'https://other.example/audio/external.mp3',
    },
    AUDIO_META: { files: { 'audio/female-normal.mp3': 5, 'audio/female-slow.mp3': 5, 'audio/male-normal.mp3': 5, 'audio/male-slow.mp3': 5 } },
  };
  const context = vm.createContext({
    MG, URL, Response, Request, Headers, AbortController, console, fetch, caches: cacheStorage,
    document: { baseURI: BASE, querySelectorAll: () => [{ getAttribute: () => 'audio-manifest.js' }] },
    location: { origin: 'https://mandarin.example' },
  });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'app-extra.js'), 'utf8'), context);
  return { MG, cacheStorage };
}
function worker() {
  const events = {};
  const cacheStorage = makeCaches();
  const context = vm.createContext({
    URL, Request, Response, Headers, console, caches: cacheStorage,
    fetch: () => { throw new Error('Network disabled'); },
    self: { location: { origin: 'https://mandarin.example', href: BASE + 'sw.js' }, addEventListener: (name, fn) => { events[name] = fn; } },
  });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), context);
  return { context, cacheStorage, events };
}
const mp3 = () => new Response(new Uint8Array([0x49, 0x44, 0x33, 0x42, 0x43]), { headers: { 'Content-Type': 'audio/mpeg' } });
let passed = 0;
async function test(name, fn) {
  await fn(); passed++;
  console.log('  ✅ ' + name);
}
(async () => {
  await test('shell list excludes MP3 by default; requested audio is same-origin and voice specific', async () => {
    const { MG } = app(() => mp3());
    assert.equal(MG.audioCache.files().length, 2);
    assert.equal(MG.audioCache.files('all').length, 4);
    assert.ok(MG.offlineList().includes('audio-manifest.js'));
    assert.ok(!MG.offlineList().some(url => url.endsWith('.mp3')));
    assert.equal(MG.offlineList({ audio: 'all' }).filter(url => url.endsWith('.mp3')).length, 4);
    MG.state.profile.referenceVoice = 'male';
    assert.ok(MG.audioCache.files().every(file => file.url.includes('male-')));
  });
  await test('download saves complete files, confirms exact bytes and retries only missing files', async () => {
    const fetched = [];
    let fail = true;
    const { MG } = app(async url => {
      fetched.push(url);
      if (fail && url.includes('slow')) return new Response('bad', { status: 503 });
      return mp3();
    });
    const first = await MG.audioCache.download();
    assert.equal(first.ready, false); assert.equal(first.count, 1); assert.equal(first.failed, 1);
    fail = false;
    const second = await MG.audioCache.download();
    assert.equal(second.ready, true); assert.equal(second.count, 2); assert.equal(second.bytes, 10);
    assert.equal(second.totalBytes, 10);
    assert.deepEqual(fetched, ['audio/female-normal.mp3', 'audio/female-slow.mp3', 'audio/female-slow.mp3']);
    const third = await MG.audioCache.download();
    assert.equal(third.ready, true); assert.equal(fetched.length, 3);
  });
  await test('partial and truncated responses never become offline-ready', async () => {
    const { MG } = app(async url => url.includes('slow')
      ? new Response(new Uint8Array([1, 2]), { status: 206, headers: { 'Content-Range': 'bytes 0-1/5' } })
      : new Response(new Uint8Array([1, 2])));
    const result = await MG.audioCache.download();
    assert.equal(result.ready, false); assert.equal(result.count, 0); assert.equal(result.failed, 2);
  });
  await test('failed cache writes and cancellation report actual saved state', async () => {
    const broken = { open: async () => ({ match: async () => undefined, put: async () => { const e = new Error('Quota full'); e.name = 'QuotaExceededError'; throw e; } }) };
    const { MG } = app(async () => mp3(), broken);
    const result = await MG.audioCache.download();
    assert.equal(result.ready, false); assert.equal(result.count, 0); assert.equal(result.error.name, 'QuotaExceededError');
    const cancelled = app(async () => mp3()).MG;
    const controller = new AbortController(); controller.abort();
    const stopped = await cancelled.audioCache.download('selected', { signal: controller.signal });
    assert.equal(stopped.cancelled, true); assert.equal(stopped.count, 0);
  });
  await test('offline MP3 range requests return exact 206 bytes, suffixes and 416 bounds', async () => {
    const { context, cacheStorage, events } = worker();
    const cache = await cacheStorage.open('mg-audio-v1');
    const url = BASE + 'audio/test.mp3';
    const data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    await cache.put(url, new Response(data, { headers: { 'Content-Type': 'audio/mpeg' } }));
    async function get(range) {
      let response;
      events.fetch({ request: new Request(url, { headers: range ? { Range: range } : {} }), respondWith: value => { response = value; } });
      return await response;
    }
    for (const [range, expected, contentRange] of [
      ['bytes=0-1', [0, 1], 'bytes 0-1/10'],
      ['bytes=6-', [6, 7, 8, 9], 'bytes 6-9/10'],
      ['bytes=-3', [7, 8, 9], 'bytes 7-9/10'],
      ['bytes=8-500', [8, 9], 'bytes 8-9/10'],
      ['bytes=-500', [...data], 'bytes 0-9/10'],
    ]) {
      const response = await get(range);
      assert.equal(response.status, 206);
      assert.equal(response.headers.get('Content-Range'), contentRange);
      assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
      assert.equal(Number(response.headers.get('Content-Length')), expected.length);
      assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], expected);
    }
    for (const range of ['bytes=10-', 'bytes=5-2', 'bytes=-0', 'bytes=-', 'bytes=9999999999999999999999-']) {
      const response = await get(range);
      assert.equal(response.status, 416, range);
      assert.equal(response.headers.get('Content-Range'), 'bytes */10');
      assert.equal(response.headers.get('Content-Length'), '0');
      assert.equal((await response.arrayBuffer()).byteLength, 0);
    }
    assert.equal((await get()).status, 200);
    assert.equal((await get('bytes=0-1,4-5')).status, 200);
    assert.equal((await get('words=0-1')).status, 200);
    assert.equal(await vm.runInContext("completeAudio(new Response('partial', {status:206}))", context), null);
  });
  await test('audio is never part of atomic shell install and survives shell cleanup', async () => {
    const { context } = worker();
    const precache = vm.runInContext('PRECACHE', context);
    assert.ok(precache.includes('audio-manifest.js'));
    assert.ok(!precache.some(url => url.endsWith('.mp3')));
    assert.equal(vm.runInContext('AUDIO_CACHE', context), 'mg-audio-v1');
    assert.ok(!vm.runInContext("AUDIO_CACHE.startsWith('mg-v2-speaking-')", context));
  });
  console.log(`\n${passed} audio cache checks passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
