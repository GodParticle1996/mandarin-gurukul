/* Versioned offline shell. Installation succeeds only when the whole kit is saved.
   Bump VERSION after shell/content/asset changes. Keep cache ownership scoped to mg-. */
const VERSION = 'mg-v2-speaking-6-audio';
// Audio paths are content hashes; downloads survive shell upgrades.
const AUDIO_CACHE = 'mg-audio-v1';
const PRECACHE = [
  './',
  'index.html',
  'style.css',
  'manifest.webmanifest',
  'icon.svg',
  'icon-192.png',
  'icon-512.png',
  'core.js',
  'pinyin.js',
  'deva.js',
  'data-core.js',
  'photos.js',
  'pyview.js',
  'voice.js',
  'audio-manifest.js',
  'games.js',
  'games-talk.js',
  'data-tones.js',
  'data-sounds.js',
  'data-basics.js',
  'data-basics-extra.js',
  'data-family.js',
  'data-food.js',
  'data-friends.js',
  'data-travel.js',
  'data-shopping.js',
  'data-emergency.js',
  'data-builder.js',
  'data-north.js',
  'app.js',
  'app-extra.js',
  'practice.js',
  'boot.js',
  'img/baijiu.jpg',
  'img/baozi.jpg',
  'img/bianpao.jpg',
  'img/bingdiao.jpg',
  'img/changcheng.jpg',
  'img/chuanr.jpg',
  'img/chunlian.jpg',
  'img/disanxian.jpg',
  'img/ditie.jpg',
  'img/doufu.jpg',
  'img/doujiang.jpg',
  'img/fanqiechaodan.jpg',
  'img/gaotie.jpg',
  'img/gongbao.jpg',
  'img/gugong.jpg',
  'img/hongbao.jpg',
  'img/huoguo.jpg',
  'img/hutong.jpg',
  'img/jianbing.jpg',
  'img/jiaozi.jpg',
  'img/kaoya.jpg',
  'img/kuaizi.jpg',
  'img/majiang.jpg',
  'img/mantou.jpg',
  'img/mapo.jpg',
  'img/miantiao.jpg',
  'img/mifan.jpg',
  'img/scenarios-v2.png',
  'img/shuanyangrou.jpg',
  'img/tanghulu.jpg',
  'img/tiananmen.jpg',
  'img/tuoxie.jpg',
  'img/yiheyuan.jpg',
  'img/youtiao.jpg',
  'img/zhajiangmian.jpg',
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => (k === 'mg-v1' || k.startsWith('mg-v2-speaking-')) && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Safari and iOS request byte ranges, including when the app is offline.
   Keep only complete 200 responses in Cache Storage; never cache a 206 fragment. */
async function audioRangeResponse(request, response) {
  const range = request.headers.get('Range');
  if (!range || !/^bytes=/i.test(range.trim())) return response;
  // A server may ignore an unsupported multi-range request and return the full file.
  if (range.includes(',')) return response;
  const bytes = await response.arrayBuffer();
  const length = bytes.byteLength;
  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.set('Accept-Ranges', 'bytes');
  const invalid = () => {
    headers.set('Content-Range', 'bytes */' + length);
    headers.set('Content-Length', '0');
    return new Response(null, { status: 416, statusText: 'Range Not Satisfiable', headers });
  };
  const match = /^bytes=(\d*)-(\d*)$/i.exec(range.trim());
  if (!match || (!match[1] && !match[2]) || !length) return invalid();
  let start, end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return invalid();
    start = Math.max(0, length - suffix); end = length - 1;
  } else {
    start = Number(match[1]); end = match[2] ? Number(match[2]) : length - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= length || start > end) return invalid();
    end = Math.min(end, length - 1);
  }
  const body = bytes.slice(start, end + 1);
  headers.set('Content-Range', `bytes ${start}-${end}/${length}`);
  headers.set('Content-Length', String(body.byteLength));
  return new Response(body, { status: 206, statusText: 'Partial Content', headers });
}

async function completeAudio(response) {
  if (response.status !== 200 || response.headers.has('Content-Range')) return null;
  const body = await response.arrayBuffer();
  if (!body.byteLength) return null;
  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.set('Content-Length', String(body.byteLength));
  headers.set('X-MG-Audio-Bytes', String(body.byteLength));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(body, { status: 200, statusText: 'OK', headers });
}

async function serveAudio(request) {
  let cache = null;
  try { cache = await caches.open(AUDIO_CACHE); } catch (_) { /* Storage blocked: play online. */ }
  // The cache key never has Range; its value is always one complete MP3.
  const clean = new URL(request.url); clean.search = '';
  const key = clean.href;
  let cached = null;
  try { if (cache) cached = await cache.match(key); } catch (_) { /* Storage unavailable. */ }
  const hit = cached && cached.status === 200 && !cached.headers.has('Content-Range') ? cached : null;
  if (hit && request.cache !== 'reload') return audioRangeResponse(request, hit);
  try {
    const headers = new Headers(request.headers);
    headers.delete('Range'); headers.delete('If-Range');
    const fullRequest = new Request(request, { headers });
    const response = await fetch(fullRequest);
    const complete = await completeAudio(response.clone());
    if (!complete) return response;
    // Playback can continue online if storage is full; explicit pack downloads
    // separately verify cache.put and report quota failures to the learner.
    try { if (cache) await cache.put(key, complete.clone()); } catch (_) { /* online playback */ }
    return audioRangeResponse(request, complete);
  } catch (error) {
    if (hit) return audioRangeResponse(request, hit);
    return Response.error();
  }
}

self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'MG_CACHE_SHELL' || !event.ports[0]) return;
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(VERSION);
      // addAll is atomic: a failed resource cannot leave a partly replaced shell.
      await cache.addAll(PRECACHE.map(url => new Request(new URL(url, self.location.href).href, { cache: 'reload' })));
      const checks = await Promise.all(PRECACHE.map(url => cache.match(url)));
      if (checks.some(response => !response || response.status !== 200)) throw new Error('Incomplete shell');
      event.ports[0].postMessage({ ok: true, total: PRECACHE.length });
    } catch (_) { event.ports[0].postMessage({ ok: false }); }
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (/\/audio\/[^/]+\.mp3$/i.test(url.pathname)) {
    event.respondWith(serveAudio(req));
    return;
  }
  event.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit && req.cache !== 'reload') return hit;
    try {
      const response = await fetch(req);
      if (response.status === 200 && !response.headers.has('Content-Range')) {
        try { await cache.put(req, response.clone()); } catch (_) { /* online shell still works */ }
      }
      return response;
    } catch (err) {
      if (hit) return hit;
      if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
      return Response.error();
    }
  }));
});
