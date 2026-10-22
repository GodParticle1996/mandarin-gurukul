#!/usr/bin/env node
/* Real MP3 and service-worker QA in a fresh browser and ephemeral local server.
   node tools/audio-qa.js                 -> a small real-recording sample
   MG_QA_FULL_AUDIO=1 node tools/audio-qa.js -> download and verify the full pack
   PLAYWRIGHT and MG_FONTCONFIG accept the same overrides as tools/qa.js.
   Never opens the user's browser profile, progress, server or audio cache. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const ROOT = path.resolve(__dirname, '..');
const OUT = process.env.MG_AUDIO_QA_OUT || '/tmp/mandarin-gurukul-audio-qa';
const FULL = process.env.MG_QA_FULL_AUDIO === '1';
const report = { fullPack: FULL, checks: [], screenshots: [], browserErrors: [], audioResponses: [] };
const failures = new Set();
let delayAudio = 0;
function playwright() {
  if (process.env.PLAYWRIGHT) return require(process.env.PLAYWRIGHT);
  const cache = path.join(os.homedir(), '.npm', '_npx');
  for (const dir of fs.existsSync(cache) ? fs.readdirSync(cache) : []) {
    const candidate = path.join(cache, dir, 'node_modules', 'playwright');
    if (fs.existsSync(candidate)) return require(candidate);
  }
  throw new Error('Set PLAYWRIGHT to an installed Playwright package.');
}
async function launch(chromium) {
  const localFonts = path.join(ROOT, '.fonts', 'fonts.conf');
  const fontconfig = process.env.MG_FONTCONFIG || (fs.existsSync(localFonts) ? localFonts : null);
  const options = fontconfig ? { env: { ...process.env, FONTCONFIG_FILE: fontconfig } } : {};
  try { return await chromium.launch(options); }
  catch (original) {
    const cache = path.join(os.homedir(), '.cache', 'ms-playwright');
    const dirs = fs.existsSync(cache) ? fs.readdirSync(cache).filter(d => /^chromium_headless_shell-\d+$/.test(d)).sort().reverse() : [];
    for (const dir of dirs) {
      const executablePath = path.join(cache, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
      if (fs.existsSync(executablePath)) return chromium.launch({ ...options, executablePath });
    }
    throw original;
  }
}
async function serve() {
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.mp3': 'audio/mpeg' };
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url, 'http://localhost');
        let pathname = decodeURIComponent(url.pathname);
        if (pathname.endsWith('/')) pathname += 'index.html';
        const file = path.resolve(ROOT, '.' + pathname);
        if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
          res.writeHead(404); return res.end('Not found');
        }
        if (failures.has(pathname)) { res.writeHead(503); return res.end('Intentional QA network failure'); }
        const respond = () => {
          if (res.destroyed) return;
          const bytes = fs.statSync(file).size;
          const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': bytes, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
          const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
          if (range) {
            const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), bytes - 1) : bytes - 1;
            if (start >= bytes || end < start) { res.writeHead(416, { 'Content-Range': `bytes */${bytes}` }); return res.end(); }
            res.writeHead(206, { ...headers, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${bytes}` });
            return fs.createReadStream(file, { start, end }).pipe(res);
          }
          res.writeHead(200, headers); fs.createReadStream(file).pipe(res);
        };
        if (pathname.endsWith('.mp3') && delayAudio) setTimeout(respond, delayAudio); else respond();
      } catch (error) { res.writeHead(400); res.end('Invalid path'); }
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}
async function check(name, fn) {
  try { await fn(); report.checks.push({ name, passed: true }); console.log('  ✅ ' + name); }
  catch (error) { report.checks.push({ name, passed: false, error: error.message }); throw new Error(name + ': ' + error.message); }
}
async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let server, browser, context;
  try {
    server = await serve();
    const base = `http://127.0.0.1:${server.address().port}/`;
    browser = await launch(playwright().chromium);
    context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'America/Toronto', serviceWorkers: 'allow' });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => report.browserErrors.push(error.message));
    page.on('response', response => {
      if (/\.mp3(?:\?|$)/.test(response.url())) report.audioResponses.push({ url: response.url().replace(base, ''), status: response.status(), type: response.headers()['content-type'] });
    });
    await page.addInitScript(() => {
      window.__audioQA = { calls: 0, playing: 0, maxConcurrent: 0, elements: new Set() };
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function (...args) {
        const q = window.__audioQA;
        q.calls++;
        if (!q.elements.has(this)) {
          q.elements.add(this);
          this.addEventListener('playing', () => {
            q.playing = [...q.elements].filter(a => !a.paused && !a.ended).length;
            q.maxConcurrent = Math.max(q.maxConcurrent, q.playing);
          });
        }
        return play.apply(this, args);
      };
      if (!localStorage.getItem('mandaringurukul-v1')) localStorage.setItem('mandaringurukul-v1', JSON.stringify({ xp: 0, completed: [], profile: { onboarded: true, gender: 'm', referenceVoice: 'female', showHan: false, showDeva: false, dailyMinutes: 20, focus: 'balanced' } }));
    });
    const goto = async hash => {
      await page.goto(base + hash, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => typeof MG !== 'undefined' && MG.voice.available() && !!document.querySelector('#app')?.children.length);
    };
    const noOverflow = async () => {
      const sizes = await page.evaluate(() => [innerWidth, document.body.scrollWidth, document.documentElement.scrollWidth]);
      assert.ok(Math.max(sizes[1], sizes[2]) <= sizes[0] + 1, 'horizontal overflow: ' + sizes.join('/'));
    };
    const shot = async name => {
      const file = name + '.png';
      await page.screenshot({ path: path.join(OUT, file), fullPage: true }); report.screenshots.push(file);
    };
    const fixture = async zh => {
      await page.evaluate(zh => {
        MG.voice.stop(); document.querySelector('#audio-qa-fixture')?.remove();
        const box = document.createElement('div'); box.id = 'audio-qa-fixture';
        box.appendChild(MG.voice.buttons({ zh, hi: 'Real recorded Mandarin QA phrase' }, 'you'));
        document.querySelector('#app').prepend(box);
      }, zh);
      assert.equal(await page.locator('#audio-qa-fixture .vbtn').count(), 2);
    };
    const sound = async speed => {
      await page.locator(`#audio-qa-fixture .vbtn[data-speed="${speed}"]`).click();
      await page.waitForFunction(() => MG.voice._audio && !MG.voice._audio.paused && MG.voice._audio.currentTime > 0 && Number.isFinite(MG.voice._audio.duration));
      return page.evaluate(() => ({ src: MG.voice._audio.currentSrc, duration: MG.voice._audio.duration, rate: MG.voice._audio.playbackRate, time: MG.voice._audio.currentTime }));
    };
    await goto('#/settings');
    const samples = await page.evaluate(() => {
      const texts = [...new Set(Object.keys(MG.AUDIO).map(key => key.split('|').slice(2).join('|')))];
      return texts.filter(zh => zh.length > 12 && zh.length < 60).sort((a, b) => b.length - a.length).slice(0, 3);
    });
    assert.equal(samples.length, 3, 'need several multi-second real recordings for reliable playback testing');
    await check('pronunciation is available but settings and normal navigation never autoplay', async () => {
      for (const hash of ['#/settings', '#/practice', '#/tones', '#/conversation/fam-01']) {
        await goto(hash);
        assert.equal(await page.evaluate(() => window.__audioQA.calls), 0);
      }
      await goto('#/settings');
      assert.equal(await page.locator('#audio-pack-cancel').isVisible(), false, 'cancel is hidden while no download is running');
    });
    let normal, slow, male;
    await check('normal and slow buttons decode different real MP3s at original pitch and rate', async () => {
      await fixture(samples[0]); normal = await sound('norm');
      assert.ok(normal.duration > 1 && normal.time > 0); assert.equal(normal.rate, 1);
      await page.locator('#audio-qa-fixture .vbtn[data-speed="norm"]').click();
      assert.equal(await page.evaluate(() => MG.voice._audio.paused), true, 'active playback button stops audio');
      slow = await sound('slow');
      assert.notEqual(slow.src, normal.src); assert.equal(slow.rate, 1);
      assert.ok(slow.duration > normal.duration, 'slow is naturally synthesized longer, rather than playbackRate manipulation');
      assert.ok(report.audioResponses.some(response => response.type?.startsWith('audio/mpeg') && response.status < 300));
      await shot('mobile-playing-slow');
      await page.evaluate(() => MG.voice.stop());
    });
    await check('female and male reference voices switch without changing learner wording and persist', async () => {
      await goto('#/settings');
      await page.locator('#audio-voice-male').click();
      assert.equal(await page.evaluate(() => MG.state.profile.referenceVoice), 'male');
      assert.equal(await page.evaluate(() => MG.state.profile.gender), 'm');
      await fixture(samples[0]); male = await sound('norm');
      assert.notEqual(male.src, normal.src);
      report.samplePlayback = { femaleNormal: normal, femaleSlow: slow, maleNormal: male };
      await page.evaluate(() => MG.voice.stop());
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => MG.state.profile.referenceVoice), 'male');
      await page.locator('#audio-voice-female').click();
      assert.equal(await page.evaluate(() => MG.state.profile.gender), 'm');
      await shot('mobile-voice-settings');
    });
    await check('rapid clicks keep one player and route changes stop playback', async () => {
      await fixture(samples[0]);
      await page.locator('#audio-qa-fixture .vbtn[data-speed="norm"]').click();
      await page.locator('#audio-qa-fixture .vbtn[data-speed="slow"]').click();
      await page.waitForFunction(() => MG.voice._audio && !MG.voice._audio.paused && MG.voice._audio.currentTime > 0);
      assert.ok((await page.evaluate(() => MG.voice._audio.currentSrc)).endsWith(new URL(slow.src).pathname));
      assert.equal(await page.evaluate(() => window.__audioQA.maxConcurrent), 1);
      await page.evaluate(() => { location.hash = '#/practice'; });
      await page.waitForSelector('.practice-tools');
      assert.equal(await page.evaluate(() => !MG.voice._audio || MG.voice._audio.paused), true);
    });
    await check('advancing a real learning card cancels its pronunciation', async () => {
      await page.evaluate(() => {
        const level = MG.levelById('bas-01');
        MG.session = { level, stageIdx: level.stages.findIndex(s => s.type === 'learn'), firstTry: 0, total: 0, replay: false };
        runStage();
      });
      const pronunciation = page.locator('.learn .pyl').first();
      assert.equal(await pronunciation.isVisible(), true);
      await page.getByRole('button', { name: 'Answer chhupao · yaad se bolo', exact: true }).click();
      assert.equal(await pronunciation.isVisible(), false, 'recall hides pronunciation visually as well as setting hidden');
      await page.getByRole('button', { name: 'Answer dikhao · compare karo', exact: true }).click();
      assert.equal(await pronunciation.isVisible(), true);
      await page.locator('.learn .vbtn[data-speed="slow"]').first().click();
      await page.waitForFunction(() => MG.voice._audio && !MG.voice._audio.paused);
      await page.locator('.learn .row > .btn.primary').click();
      await page.waitForFunction(() => !MG.voice._audio || MG.voice._audio.paused);
      const calls = await page.evaluate(() => window.__audioQA.calls);
      await page.evaluate(() => { MG.session.stageIdx++; runStage(); });
      assert.equal(await page.evaluate(() => window.__audioQA.calls), calls, 'next stage must not autoplay');
    });
    await check('a failed audio request explains the error and the same control retries successfully', async () => {
      await goto('#/settings'); await fixture(samples[1]);
      const url = await page.evaluate(zh => MG.AUDIO[MG.voice.keyFor(zh, 'you', false)], samples[1]);
      await page.evaluate(async url => { for (const name of await caches.keys()) { const cache = await caches.open(name); await cache.delete(new URL(url, location.href)); } }, url);
      failures.add('/' + url);
      await page.locator('#audio-qa-fixture .vbtn[data-speed="norm"]').click();
      await page.waitForFunction(() => document.querySelector('#audio-qa-fixture .vbtn[data-speed="norm"]')?.dataset.voiceState === 'error');
      assert.ok((await page.locator('#audio-qa-fixture .voice-status').innerText()).trim().length > 0);
      failures.delete('/' + url);
      const retried = await sound('norm'); assert.ok(retried.duration > 1);
      await page.evaluate(() => MG.voice.stop());
    });
    await check('voice settings fit mobile, desktop and dark mode with accessible controls', async () => {
      for (const width of [390, 1280]) for (const colorScheme of ['light', 'dark']) {
        await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ colorScheme });
        await goto('#/settings'); await fixture(samples[0]); await noOverflow();
        for (const button of await page.locator('#audio-qa-fixture .vbtn').all()) {
          assert.ok((await button.getAttribute('aria-label'))?.length, 'playback controls have accessible names');
          assert.equal(await button.getAttribute('type'), 'button');
        }
        await shot(`${width}-${colorScheme}-voice-settings`);
      }
    });
    await goto('#/settings');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await check('audio download is explicit, separate from shell caching, and reports actual storage', async () => {
      assert.equal(await page.evaluate(() => MG.offlineList().some(url => /\.mp3$/.test(url))), false);
      if (!FULL) await page.evaluate(texts => {
        const subset = Object.fromEntries(Object.entries(MG.AUDIO).filter(([key]) => texts.includes(key.split('|').slice(2).join('|'))));
        MG.AUDIO = subset;
      }, samples);
      await page.evaluate(async () => { await caches.delete(MG.audioCache.NAME); });
      const before = await page.evaluate(() => MG.audioCache.status('all'));
      assert.equal(before.count, 0); assert.ok(before.total > 0);
      report.packFiles = before.total; report.packBytes = before.totalBytes;
      const selected = await page.evaluate(() => MG.audioCache.files('selected').length);
      assert.equal(selected * 2, before.total, 'selected voice includes normal and slow; all includes both voices');
      await page.selectOption('#audio-pack-scope', 'all');
      await page.locator('#audio-pack-download').click();
      await page.waitForFunction(() => !MG.audioPackTask?.running && document.querySelector('#audio-pack-status')?.textContent.includes('recordings offline verified'), null, { timeout: FULL ? 180000 : 30000 });
      const after = await page.evaluate(() => MG.audioCache.status('all'));
      assert.equal(after.count, before.total); assert.equal(after.bytes, before.totalBytes);
      assert.equal(after.failed || 0, 0);
      report.packDownloadedFiles = after.count; report.packDownloadedBytes = after.bytes;
      await shot('offline-both-voices-ready');
    });
    await check('download cancellation is recoverable and restarting fills only missing recordings', async () => {
      const urls = await page.evaluate(() => MG.audioCache.files('all').map(file => file.url));
      await page.evaluate(async urls => {
        const cache = await caches.open(MG.audioCache.NAME);
        await Promise.all(urls.slice(0, 8).map(url => cache.delete(new URL(url, location.href))));
      }, urls);
      delayAudio = 200;
      const cancelled = await page.evaluate(async () => {
        const controller = new AbortController();
        let scheduled = false;
        const run = MG.audioCache.download('all', { signal: controller.signal, onProgress(progress) {
          if (!scheduled && progress.stage === 'download') { scheduled = true; setTimeout(() => controller.abort(), 40); }
        } });
        try { return await run; } catch (error) { return { name: error.name, message: error.message }; }
      });
      assert.equal(cancelled.cancelled, true, 'cancelled state is reported honestly');
      assert.equal(cancelled.ready, false, 'a cancelled incomplete pack must not claim to be ready');
      delayAudio = 0;
      const complete = await page.evaluate(() => MG.audioCache.download('all'));
      assert.equal(complete.ready, true); assert.equal(complete.count, urls.length);
    });
    await check('every saved MP3 loads offline and byte-range responses cover Safari request patterns', async () => {
      await context.setOffline(true);
      const result = await page.evaluate(async () => {
        const files = MG.audioCache.files('all');
        const failed = [];
        for (const file of files) {
          try { const r = await fetch(file.url); if (!r.ok || (await r.arrayBuffer()).byteLength !== file.bytes) failed.push(file.url); }
          catch { failed.push(file.url); }
        }
        const file = files[0], full = await fetch(file.url), buffer = new Uint8Array(await full.arrayBuffer());
        const ranges = [];
        for (const range of ['bytes=0-1', 'bytes=5-', 'bytes=-8', `bytes=${buffer.length}-`]) {
          const response = await fetch(file.url, { headers: { Range: range } });
          ranges.push({ range, status: response.status, contentRange: response.headers.get('Content-Range'), bytes: [...new Uint8Array(await response.arrayBuffer())] });
        }
        return { failed, verified: files.length - failed.length, length: buffer.length, first: [...buffer.slice(0, 2)], suffix: [...buffer.slice(-8)], ranges };
      });
      assert.deepEqual(result.failed, []);
      report.offlineVerifiedFiles = result.verified;
      report.offlineRanges = result.ranges.map(({ range, status, contentRange, bytes }) => ({ range, status, contentRange, length: bytes.length }));
      assert.equal(result.ranges[0].status, 206); assert.deepEqual(result.ranges[0].bytes, result.first);
      assert.equal(result.ranges[0].contentRange, `bytes 0-1/${result.length}`);
      assert.equal(result.ranges[1].status, 206); assert.equal(result.ranges[1].bytes.length, result.length - 5);
      assert.equal(result.ranges[2].status, 206); assert.deepEqual(result.ranges[2].bytes, result.suffix);
      assert.equal(result.ranges[3].status, 416); assert.equal(result.ranges[3].contentRange, `bytes */${result.length}`);
      await fixture(samples[0]);
      await page.evaluate(() => MG.voice.setReferenceVoice('female')); await fixture(samples[0]);
      const female = await sound('slow'); assert.ok(female.duration > 1);
      await page.evaluate(() => MG.voice.setReferenceVoice('male')); await fixture(samples[0]);
      const man = await sound('norm'); assert.ok(man.duration > 1); assert.notEqual(man.src, female.src);
      await page.evaluate(() => MG.voice.stop());
      await context.setOffline(false);
    });
    await check('voice integration reports no uncaught browser errors and never overlaps players', async () => {
      assert.deepEqual(report.browserErrors, []);
      assert.equal(await page.evaluate(() => window.__audioQA.maxConcurrent), 1);
    });
  } finally {
    if (context) await context.close();
    if (browser) await browser.close();
    if (server) { server.closeAllConnections?.(); await new Promise(resolve => server.close(resolve)); }
    report.passed = report.checks.filter(check => check.passed).length;
    report.failed = report.checks.filter(check => !check.passed).length;
    fs.writeFileSync(path.join(OUT, 'REPORT.json'), JSON.stringify(report, null, 2));
  }
}
main().then(() => console.log(`\n${report.passed} passed, ${report.failed} failed. Report: ${path.join(OUT, 'REPORT.json')}`))
  .catch(error => { console.error('\n❌ ' + error.stack); process.exitCode = 1; });
