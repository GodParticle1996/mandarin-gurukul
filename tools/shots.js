#!/usr/bin/env node
/* =====================================================================
   Asli browser test + screenshots (Playwright Chromium, phone size)
   node tools/shots.js            → shots/*.png + console errors
   node tools/shots.js --icons    → icon-192.png + icon-512.png (icon.svg se)
   Playwright path: PLAYWRIGHT=/path/to/node_modules/playwright (warna npx cache)
   ===================================================================== */
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'shots');

function findPlaywright() {
  if (process.env.PLAYWRIGHT) return require(process.env.PLAYWRIGHT);
  const npx = path.join(require('os').homedir(), '.npm', '_npx');
  for (const d of fs.existsSync(npx) ? fs.readdirSync(npx) : []) {
    const p = path.join(npx, d, 'node_modules', 'playwright');
    if (fs.existsSync(p)) return require(p);
  }
  throw new Error('Playwright nahi mila — PLAYWRIGHT=/path/to/playwright set karo');
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.mp3': 'audio/mpeg' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let f = decodeURIComponent(req.url.split('?')[0]);
      if (f.endsWith('/')) f += 'index.html';
      const p = path.join(ROOT, f);
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); return rsp.end('404'); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

async function icons(browser) {
  const svg = fs.readFileSync(path.join(ROOT, 'icon.svg'), 'utf8');
  for (const size of [192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    // full-bleed laal background: Android "maskable" + iPhone home screen ke liye
    await page.setContent(`<body style="margin:0;background:#b91c1c">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`);
    await page.screenshot({ path: path.join(ROOT, `icon-${size}.png`) });
    await page.close();
  }
  console.log('✅ icon-192.png + icon-512.png');
}

/* Playwright ka version naya browser maange to pehle se pada hua Chromium use karo */
async function launch(chromium) {
  // emoji / Devanagari / Chinese fonts sirf test browser ke liye: MG_FONTCONFIG ya .fonts/fonts.conf
  const local = path.join(ROOT, '.fonts', 'fonts.conf');
  const fc = process.env.MG_FONTCONFIG || (fs.existsSync(local) ? local : null);
  const opts = fc ? { env: { ...process.env, FONTCONFIG_FILE: fc } } : {};
  try { return await chromium.launch(opts); }
  catch (e) {
    const cache = path.join(require('os').homedir(), '.cache', 'ms-playwright');
    const dirs = fs.existsSync(cache) ? fs.readdirSync(cache).filter(d => /^chromium_headless_shell-\d+$/.test(d)).sort().reverse() : [];
    for (const d of dirs) {
      const exe = path.join(cache, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
      if (fs.existsSync(exe)) return chromium.launch({ ...opts, executablePath: exe });
    }
    throw e;
  }
}

async function main() {
  const { chromium } = findPlaywright();
  const browser = await launch(chromium);
  if (process.argv.includes('--icons')) { await icons(browser); await browser.close(); return; }
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: process.argv.includes('--dark') ? 'dark' : 'light' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  const shot = async name => { await page.waitForTimeout(250); await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true }); console.log('📸', name); };
  const click = async sel => { await page.locator(sel).first().click(); await page.waitForTimeout(120); };

  /* 1. pehli baar: onboarding */
  await page.goto(base);
  await shot('01-onboarding-1');
  await click('.onb .btn.primary');
  await shot('02-onboarding-2');
  await click('.onb .btn.choice');
  await shot('03-onboarding-3');
  await click('.onb .btn.primary');
  await shot('04-home');

  /* 2. Tone Dojo level 1 — scene se quiz tak */
  await page.goto(base + '#/track/tones'); await shot('05-track-tones');
  await page.goto(base + '#/level/ton-01'); await shot('06-scene');
  // scene: sahi option tab tak dabao jab tak "Chalo seekhein" na aaye
  for (const b of await page.locator('.scene .opt').all()) {
    if (await page.locator('.scene .btn.primary').count()) break;
    await b.click(); await page.waitForTimeout(80);
  }
  await shot('07-scene-answered');
  await click('.scene .btn.primary');
  await shot('08-explain');
  for (let k = 0; k < 6 && await page.locator('.explain .btn.primary').count(); k++) await click('.explain .btn.primary');
  await shot('09-learn');
  for (let k = 0; k < 12 && await page.locator('.learn .btn.primary').count(); k++) await click('.learn .btn.primary');
  await shot('10-tones-quiz');
  /* baaki stages: har sawaal par options ek-ek dabao jab tak "Agla/Ho gaya" enable na ho */
  for (let guard = 0; guard < 60; guard++) {
    if (await page.locator('.finish').count()) break;
    const next = page.locator('.mcq > .btn.primary:not([disabled])');
    if (await next.count()) { await next.first().click(); await page.waitForTimeout(80); continue; }
    const opts = page.locator('.mcq .opt:not([disabled]):not(.right)');
    if (await opts.count()) { await opts.first().click(); await page.waitForTimeout(60); if (guard === 3) await shot('11-mcq-feedback'); continue; }
    break;
  }
  await shot('12-level-done');

  /* 3. Basics level 1 — dialogue (Tone Dojo ka gate pehle "poora" maan lo) */
  await page.evaluate(() => {
    const gate = MG.tracks.find(t => t.gate);
    MG.state.completed = [...new Set([...MG.state.completed, ...MG.levelsOf(gate).slice(0, MG.gateNeed(gate)).map(l => l.id)])];
    MG.saveState();
  });
  await page.goto(base + '#/level/bas-01'); await page.reload();
  for (const b of await page.locator('.scene .opt').all()) {
    if (await page.locator('.scene .btn.primary').count()) break;
    await b.click(); await page.waitForTimeout(80);
  }
  await click('.scene .btn.primary');
  for (let k = 0; k < 12 && await page.locator('.learn .btn.primary').count(); k++) await click('.learn .btn.primary');
  for (let guard = 0; guard < 30; guard++) {
    const nb = page.locator('.dlg-ctrl > .btn.primary');
    if (await nb.count()) { if ((await nb.innerText()).includes('Ho gaya')) break; await nb.click(); await page.waitForTimeout(80); continue; }
    const o = page.locator('.dlg-ctrl .opt:not([disabled])');
    if (await o.count()) { await o.first().click(); await page.waitForTimeout(80); continue; }
    break;
  }
  await shot('13-dialogue');

  /* 3b. asli photos: food-05 (North China ke khaane) — gate + pichhle levels "done" maan lo */
  const hasFood5 = await page.evaluate(() => {
    const l = MG.levelById('food-05');
    if (!l) return false;
    const before = MG.levelsOf(MG.trackById('food')).slice(0, 4).map(x => x.id);
    const gate = MG.levelsOf(MG.trackById('tones')).slice(0, 4).map(x => x.id);
    MG.state.completed = [...new Set([...MG.state.completed, ...gate, ...before])];
    MG.saveState();
    return true;
  });
  if (hasFood5) {
    await page.goto(base + '#/level/food-05'); await page.reload();
    for (const b of await page.locator('.scene .opt').all()) {
      if (await page.locator('.scene .btn.primary').count()) break;
      await b.click(); await page.waitForTimeout(80);
    }
    await click('.scene .btn.primary');
    for (let k = 0; k < 10 && !(await page.locator('.learn .ph').count()) && await page.locator('.learn .btn.primary').count(); k++) await click('.learn .btn.primary');
    await shot('13b-photo-card');
  }

  /* 4. Diary / Dikhao / Legend / Settings / Dojo */
  await page.goto(base + '#/diary'); await shot('14-diary');
  if (await page.locator('.drow .btn').count()) { await click('.drow .btn'); await shot('15-dikhao-card'); await click('.fullcard'); }
  await page.goto(base + '#/legend'); await shot('16-legend');
  await page.goto(base + '#/settings'); await shot('17-settings');
  await page.evaluate(() => { Object.values(MG.state.dojo).forEach(c => { c.due = 0; }); MG.saveState(); });
  await page.goto(base + '#/dojo'); await page.reload(); await shot('18-dojo');
  if (await page.locator('.dojo .btn.primary').count()) { await click('.dojo .btn.primary'); await shot('19-dojo-flipped'); }

  /* 5. offline: service worker laga? */
  const sw = await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.getRegistration().then(r => !!r));
  console.log(sw ? '✅ service worker registered' : '⚠️ service worker register nahi hua');

  await browser.close(); srv.close();
  if (errors.length) { console.log(`\n❌ ${errors.length} browser errors:`); [...new Set(errors)].forEach(e => console.log('  ', e)); process.exit(1); }
  console.log('\n✅ 0 browser errors');
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
