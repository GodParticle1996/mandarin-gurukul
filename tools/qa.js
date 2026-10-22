#!/usr/bin/env node
/* Real-browser QA in a fresh context and an ephemeral localhost server.
   node tools/qa.js              -> /tmp/mandarin-gurukul-qa/{REPORT.json,*.png}
   PLAYWRIGHT=/path/to/playwright and MG_FONTCONFIG=/path/to/fonts.conf supported.
   This script never opens an existing browser profile or changes user progress. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const ROOT = path.resolve(__dirname, '..');
const OUT = process.env.MG_QA_OUT || '/tmp/mandarin-gurukul-qa';
const report = { checks: [], screenshots: [], browserErrors: [], httpFailures: [], failedRequests: [] };

function findPlaywright() {
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
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.mp3': 'audio/mpeg' };
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url, 'http://localhost');
        let pathname = decodeURIComponent(url.pathname);
        if (pathname.endsWith('/')) pathname += 'index.html';
        const file = path.resolve(ROOT, '.' + pathname);
        if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
          res.writeHead(404); res.end('Not found'); return;
        }
        res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
        fs.createReadStream(file).pipe(res);
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
  let server, browser;
  try {
    server = await serve();
    const base = `http://127.0.0.1:${server.address().port}/`;
    browser = await launch(findPlaywright().chromium);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, timezoneId: 'America/Toronto', colorScheme: 'light', serviceWorkers: 'allow' });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    let offline = false;
    page.on('pageerror', error => report.browserErrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.browserErrors.push(message.text()); });
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) report.httpFailures.push({ url: response.url(), status: response.status() }); });
    page.on('requestfailed', request => {
      const error = request.failure()?.errorText || 'unknown';
      if (!offline && !error.includes('ERR_ABORTED')) report.failedRequests.push({ url: request.url(), error });
    });
    await page.addInitScript(() => {
      window.__qaMediaPlays = 0;
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function (...args) { window.__qaMediaPlays++; return play.apply(this, args); };
    });
    const goto = async hash => {
      await page.goto(base + hash, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => typeof MG !== 'undefined' && document.querySelector('#app')?.children.length > 0);
    };
    const shot = async name => {
      const file = name.replace(/[^\w-]/g, '-') + '.png';
      const active = await page.evaluateHandle(() => document.activeElement);
      try {
        await page.evaluate(() => {
          document.activeElement?.blur?.();
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        });
        await page.waitForFunction(() => window.scrollY === 0);
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.screenshot({ path: path.join(OUT, file), fullPage: true });
      } finally {
        // Capturing a clean image must not remove a dialog's keyboard focus
        // before the following Escape/focus-restoration behavior is tested.
        await active.evaluate(node => { if (node?.isConnected) node.focus?.({ preventScroll: true }); });
        await active.dispose();
      }
      report.screenshots.push(file);
    };
    const noOverflow = async name => {
      const layout = await page.evaluate(() => ({ width: innerWidth, body: document.body.scrollWidth, root: document.documentElement.scrollWidth }));
      assert.ok(Math.max(layout.body, layout.root) <= layout.width + 1, name + ' overflow: ' + JSON.stringify(layout));
      assert.ok((await page.locator('#app').innerText()).trim().length > 0, name + ' is empty');
    };
    const audioStaysIdle = async () => {
      assert.equal(await page.evaluate(() => MG.voice.available()), true, 'packaged pronunciation audio should be available');
      assert.equal(await page.evaluate(() => window.__qaMediaPlays), 0, 'rendering and navigation must never start pronunciation audio');
      assert.equal(await page.locator('.vbtn[data-voice-state=playing]').count(), 0);
    };

    await check('three-step onboarding works and preserves speaking-first defaults', async () => {
      await goto('');
      assert.equal(await page.locator('.onb').count(), 1);
      await noOverflow('onboarding 1'); await shot('mobile-onboarding');
      await page.locator('.onb .btn.primary').click();
      await noOverflow('onboarding 2');
      await page.locator('.onb .btn.choice').first().click();
      await noOverflow('onboarding 3');
      await page.locator('.onb .btn.primary').click();
      await page.waitForSelector('.welcome-hero');
      const profile = await page.evaluate(() => MG.state.profile);
      assert.equal(profile.onboarded, true); assert.equal(profile.gender, 'm');
      assert.equal(profile.showHan, false); assert.equal(profile.showDeva, false);
      await noOverflow('dashboard'); await audioStaysIdle(); await shot('mobile-home');
    });

    await check('situations expose every track and the plan includes all lessons once', async () => {
      await goto('#/situations');
      assert.equal(await page.locator('.all-scenarios .scenario-tile').count(), 11);
      assert.equal(await page.locator('.scenario-tile.locked').count(), 0);
      const order = await page.evaluate(() => MG.studyOrder().map(l => ({ id: l.id, track: l.track })));
      assert.equal(order.length, new Set(order.map(l => l.id)).size);
      const tracks = new Set(order.map(l => l.track));
      assert.equal(tracks.size, 11, 'all 11 tracks need content and a place in the path');
      await goto('#/plan');
      assert.equal(await page.locator('.week-card').count(), 6);
      assert.equal(await page.locator('.path-row').count(), Math.min(42, order.length));
      const plannedTrackNames = new Set(await page.locator('.path-row small').allTextContents());
      const expectedTrackNames = await page.evaluate(() => MG.tracks.filter(t => t.id !== 'north').map(t => t.name.split(' — ')[0]));
      expectedTrackNames.forEach(name => assert.ok(plannedTrackNames.has(name), name + ' appears in the standard-Mandarin six-week plan'));
      await noOverflow('plan'); await shot('mobile-plan');
    });

    await check('leaving and reloading a lesson resumes the next saved stage', async () => {
      await goto('#/level/bas-01');
      assert.equal(await page.locator('.scene').count(), 1);
      for (let tries = 0; tries < 10 && !await page.locator('.scene > .btn.primary').count(); tries++) {
        await page.locator('.scene .opt:not([disabled])').first().click();
      }
      await page.locator('.scene > .btn.primary').click();
      assert.equal(await page.evaluate(() => MG.session.stageIdx), 0);
      assert.equal(await page.locator('.learn').count(), 1, 'bas-01 should begin with phrase cards');
      for (let cards = 0; cards < 20 && await page.evaluate(() => MG.session.stageIdx === 0); cards++) {
        await page.locator('.learn .row > .btn.primary').click();
      }
      const checkpoint = await page.evaluate(() => MG.state.checkpoint);
      assert.equal(checkpoint.stageIdx, 1);
      await page.reload({ waitUntil: 'networkidle' });
      assert.deepEqual(await page.evaluate(() => MG.state.checkpoint), checkpoint);
      assert.equal(await page.evaluate(() => MG.session.stageIdx), 1);
      assert.equal(await page.locator('.scene').count(), 0);
      await page.locator('#quit').click();
      await goto('#/');
      const resume = page.getByRole('button', { name: /Jahan chhoda tha/ });
      assert.equal(await resume.count(), 1);
      await resume.click();
      await page.waitForFunction(() => MG.session?.level.id === 'bas-01' && MG.session.stageIdx === 1);
      await noOverflow('resumed lesson'); await shot('mobile-checkpoint');
    });

    await check('conversation requires reveal then self-check and records completion honestly', async () => {
      const before = await page.evaluate(() => (MG.state.activity[MG.todayStr()] || {}).conversation || 0);
      await goto('#/conversation/fam-01');
      let turns = 0, remembered = 0;
      const expected = await page.evaluate(() => MG.levelById('fam-01').stages.find(s => s.type === 'dialogue').lines.filter(l => l.who === 'you').length);
      for (let guard = 0; guard < 50 && !await page.locator('.rehearsal .finish').count(); guard++) {
        const reveal = page.getByRole('button', { name: 'Answer dikhao', exact: true });
        if (await reveal.count()) {
          assert.equal(await page.locator('.recalled-answer').count(), 0);
          assert.equal(await page.getByRole('button', { name: 'Khud yaad tha', exact: true }).count(), 0);
          await reveal.click();
          assert.equal(await page.locator('.recalled-answer .pyl').count(), 1);
          if (!turns) await shot('mobile-conversation-reveal');
          turns++;
          const knew = turns % 2 === 1;
          if (knew) remembered++;
          await page.getByRole('button', { name: knew ? 'Khud yaad tha' : 'Hint chahiye thi', exact: true }).click();
        } else {
          const meaning = page.getByRole('button', { name: 'Meaning dekho', exact: true });
          if (await meaning.count()) await meaning.click();
          await page.getByRole('button', { name: 'Aage →', exact: true }).click();
        }
      }
      assert.ok(expected > 0); assert.equal(turns, expected);
      assert.ok((await page.locator('.rehearsal .finish').innerText()).includes(`${remembered}/${turns}`));
      assert.equal(await page.evaluate(() => MG.state.activity[MG.todayStr()].conversation), before + 1);
      await audioStaysIdle(); await noOverflow('conversation result'); await shot('mobile-conversation-complete');
    });

    await check('tone slider and animation move the pitch guide without playing audio', async () => {
      await goto('#/tones');
      await page.locator('.tone-tab[data-tone="2"]').click();
      const slider = page.getByRole('slider', { name: 'Tone path progress' });
      await slider.focus(); await slider.press('End');
      assert.equal(Number(await page.locator('#tone-dot').getAttribute('cx')), 288);
      assert.equal(Number(await page.locator('#tone-dot').getAttribute('cy')), 20);
      await slider.press('Home');
      assert.equal(Number(await page.locator('#tone-dot').getAttribute('cx')), 12);
      await page.getByRole('button', { name: 'Motion dekho →', exact: true }).click();
      await page.waitForFunction(() => Number(document.querySelector('.motion-slider input').value) === 100
        && Number(document.querySelector('#tone-dot').getAttribute('cx')) === 288);
      assert.equal(Number(await page.locator('#tone-dot').getAttribute('cx')), 288);
      assert.equal(await page.evaluate(() => window.__qaMediaPlays), 0);
      await audioStaysIdle(); await noOverflow('tone lab'); await shot('mobile-tone-lab');
      await page.getByRole('button', { name: 'Warm-up practice ki ✓', exact: true }).click();
      await page.waitForSelector('.daily-count');
      assert.ok(await page.evaluate(() => MG.state.activity[MG.todayStr()].review >= 1));
    });

    await check('Dojo still earns revision XP after leaving a replayed lesson', async () => {
      await page.evaluate(() => {
        const id = MG.levelById('ton-01').phrases[0].id;
        MG.state.completed.push('ton-01');
        Object.values(MG.state.dojo).forEach(c => { c.due = Date.now() + MG.DAY; });
        MG.state.dojo[id] = { box: 0, due: 0, miss: 0 };
        MG.saveState();
      });
      await goto('#/level/ton-01');
      assert.equal(await page.evaluate(() => MG.session.replay), true);
      const xp = await page.evaluate(() => MG.state.xp);
      await goto('#/dojo');
      assert.equal(await page.evaluate(() => MG.session), null);
      await page.locator('.dojo .btn.primary').click();
      await page.locator('.dojo .btn.good').click();
      assert.equal(await page.evaluate(() => MG.state.xp), xp + 5);
      assert.equal(await page.locator('.dojo .finish').count(), 1);
    });

    await check('Dikhao card closes with Escape and returns keyboard focus', async () => {
      await goto('#/diary');
      const trigger = page.getByTitle('Dikhao card', { exact: true }).first();
      await trigger.focus(); await trigger.click();
      assert.equal(await page.locator('.fullcard').count(), 1);
      await noOverflow('Dikhao card'); await shot('mobile-dikhao');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.fullcard').count(), 0);
      assert.equal(await trigger.evaluate(button => document.activeElement === button), true);
    });

    const tracks = await page.evaluate(() => MG.tracks.map(t => ({ id: t.id, first: MG.levelsOf(t)[0]?.id })));
    for (const viewport of [{ width: 390, height: 844, name: 'mobile' }, { width: 1280, height: 900, name: 'desktop' }]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const routes = ['#/', '#/situations', '#/practice', '#/plan', '#/diary', '#/legend', '#/settings', '#/tones', '#/dojo', ...tracks.map(t => '#/track/' + t.id), ...tracks.map(t => '#/level/' + t.first)];
      for (const hash of routes) {
        await check(viewport.name + ' screen ' + hash, async () => {
          await goto(hash); await noOverflow(hash); await audioStaysIdle();
          const brokenImages = await page.locator('img').evaluateAll(images => images.filter(image => image.complete && image.naturalWidth === 0).map(image => image.src));
          assert.deepEqual(brokenImages, []);
          if (['#/', '#/situations', '#/practice', '#/settings'].includes(hash)) await shot(viewport.name + '-' + (hash.slice(2) || 'home'));
        });
      }
      // Render every exercise type with real lesson data, including types that
      // occur after several cards and would otherwise be missed by route smoke tests.
      const types = await page.evaluate(() => [...new Set(MG.tracks.flatMap(t => MG.levelsOf(t)).flatMap(l => l.stages.map(s => s.type)))]);
      for (const type of types) {
        await check(viewport.name + ' exercise ' + type, async () => {
          await page.evaluate(type => {
            const l = MG.tracks.flatMap(t => MG.levelsOf(t)).find(l => l.stages.some(s => s.type === type));
            MG.session = { level: l, stageIdx: l.stages.findIndex(s => s.type === type), firstTry: 0, total: 0, replay: false };
            runStage();
          }, type);
          await noOverflow(type); await audioStaysIdle();
        });
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    for (const hash of ['#/', '#/practice', '#/tones', '#/situations', '#/settings']) {
      await check('dark mobile screen ' + hash, async () => {
        await goto(hash);
        assert.equal(await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches), true);
        await noOverflow(hash); await audioStaysIdle();
        assert.equal(await page.evaluate(() => window.__qaMediaPlays), 0);
        await shot('dark-mobile-' + (hash.slice(2) || 'home'));
      });
    }
    await page.emulateMedia({ colorScheme: 'light' });
    await page.setViewportSize({ width: 1280, height: 900 });

    await check('offline app download caches the learning shell and scenario atlas without downloading audio packs', async () => {
      await goto('#/settings');
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      const assets = await page.evaluate(() => MG.offlineList().map(url => new URL(url, location.href).href));
      assert.equal(assets.length, new Set(assets).size, 'offline resources should be unique');
      assert.equal(assets.filter(url => /\.mp3(?:\?|$)/.test(url)).length, 0, 'audio downloads must be an explicit separate choice');
      await goto('#/situations');
      const art = await page.locator('.scenario-art').first().evaluate(node => getComputedStyle(node).backgroundImage);
      const artURL = /url\(["']?([^"')]+)["']?\)/.exec(art)?.[1];
      assert.ok(artURL, 'scenario artwork must have a real bitmap asset');
      assert.ok(assets.includes(new URL(artURL, base).href), 'scenario atlas must be included in offline download');
      await goto('#/settings');
      const download = page.locator('#offline-shell-download');
      await download.click();
      await page.waitForFunction(async urls => (await Promise.all(urls.map(url => caches.match(url).then(r => !!r && r.ok)))).every(Boolean), [...new Set(assets)], { timeout: 30000 });
      await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => b.id === 'offline-shell-download' && b.textContent.includes('verified') && b.textContent.includes('✅') && !b.disabled));
      report.offlineResources = [...new Set(assets)].length;
      offline = true;
      await context.setOffline(true);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.settings').count(), 1);
      const results = await page.evaluate(async urls => Promise.all(urls.map(async url => {
        try { const response = await fetch(url); return { url, ok: response.ok, status: response.status }; }
        catch (error) { return { url, ok: false, error: error.message }; }
      })), [...new Set(assets)]);
      assert.deepEqual(results.filter(r => !r.ok), [], 'every downloaded resource must succeed offline');
      await page.evaluate(() => { location.hash = '#/situations'; });
      await page.waitForSelector('.all-scenarios');
      assert.equal(await page.locator('.scenario-tile').count(), 11);
      await noOverflow('offline situations'); await shot('desktop-offline-situations');
      await context.setOffline(false); offline = false;
    });

    await check('all page resources succeed and no browser errors or accidental audio occur', async () => {
      assert.deepEqual(report.httpFailures, []);
      assert.deepEqual(report.failedRequests, []);
      assert.deepEqual(report.browserErrors, []);
      assert.equal(await page.evaluate(() => window.__qaMediaPlays), 0);
    });
    await context.close();
  } finally {
    if (browser) await browser.close();
    if (server) {
      server.closeAllConnections?.();
      await new Promise(resolve => server.close(resolve));
    }
    report.passed = report.checks.filter(c => c.passed).length;
    report.failed = report.checks.filter(c => !c.passed).length;
    fs.writeFileSync(path.join(OUT, 'REPORT.json'), JSON.stringify(report, null, 2));
  }
}

main().then(() => console.log(`\n${report.passed} passed, ${report.failed} failed. Report: ${path.join(OUT, 'REPORT.json')}`))
  .catch(error => { console.error('\n❌ ' + error.stack); process.exitCode = 1; });
