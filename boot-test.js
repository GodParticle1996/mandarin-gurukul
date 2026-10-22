#!/usr/bin/env node
/* Boot test — saare screens + har level ka har stage bina browser ke render karo.
   node boot-test.js   (asli browser wala test: node tools/shots.js) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const DIR = __dirname;
const noop = () => {};
function mkEl(tag) {
  const e = {
    tagName: tag, className: '', innerHTML: '', textContent: '', value: '', disabled: false, checked: false,
    style: {}, dataset: {}, children: [], _l: {}, parentNode: null,
    classList: { add: noop, remove: noop, contains: () => false, toggle: noop },
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
    append(...cs) { cs.forEach(c => this.appendChild(c)); },
    after: noop, before: noop, insertBefore(c) { this.children.unshift(c); return c; },
    removeChild(c) { return c; }, remove: noop,
    addEventListener(k, f) { this._l[k] = f; }, removeEventListener: noop,
    querySelector() { return mkEl('div'); }, querySelectorAll() { return []; },
    scrollIntoView: noop, focus: noop, click() { this.onclick && this.onclick({ stopPropagation: noop }); },
    setAttribute: noop, getAttribute: () => null, closest: () => null,
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100 }),
  };
  return e;
}
const sandbox = {
  console, Math, Date, JSON, Object, Array, String, Number, Boolean, Error, Map, Set, Proxy, Symbol, RegExp, Promise,
  isNaN, parseInt, parseFloat, setTimeout: noop, clearTimeout: noop, setInterval: noop,
  confirm: () => false, alert: noop,
  localStorage: { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = v; }, removeItem(k) { delete this._d[k]; } },
  document: { getElementById: () => mkEl('div'), createElement: mkEl, querySelector: () => mkEl('div'), querySelectorAll: () => [], addEventListener: noop, body: mkEl('body') },
  window: { scrollTo: noop, addEventListener: noop },
  location: { hash: '', protocol: 'file:' },
  Element: { prototype: {} },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

/* index.html ki script order hi asli order hai */
const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const FILES = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const present = FILES.filter(f => fs.existsSync(path.join(DIR, f)));
const missing = FILES.filter(f => !fs.existsSync(path.join(DIR, f)));
const src = present.map(f => `/* ${f} */\n` + fs.readFileSync(path.join(DIR, f), 'utf8')).join('\n;\n')
  + `\nglobalThis.__MG=MG; globalThis.__fns={showHome,showTrack,startLevel,showScene,runStage,levelComplete,
     showDojo,showDiary,showLegend,showSettings,showOnboarding,renderTopbar,route};`;

let pass = 0, fail = 0;
const ok = (n, f) => { try { f(); pass++; console.log('  ✅', n); } catch (e) { fail++; console.log('  ❌', n, '\n     →', e.message, (e.stack || '').split('\n')[1] || ''); } };
try { vm.runInContext(src, sandbox, { filename: 'bundle.js' }); }
catch (e) { console.log('❌ BOOT FAILED:', e.message, '\n', (e.stack || '').split('\n').slice(0, 5).join('\n')); process.exit(1); }
console.log(`=== Boot & screens (${present.length} scripts${missing.length ? `, abhi nahi bani: ${missing.join(', ')}` : ''}) ===`);
const MG = sandbox.__MG, F = sandbox.__fns;

ok('app boot hua', () => { if (!MG || !MG.tracks.length) throw new Error('MG/tracks missing'); });
ok('onboarding ke 3 steps', () => [1, 2, 3].forEach(s => F.showOnboarding(s)));
MG.state.profile.onboarded = true;
ok('home', () => F.showHome());
ok('har track ka map', () => MG.tracks.forEach(t => F.showTrack(t)));
ok('Dojo (khaali)', () => F.showDojo());
ok('Diary, Legend, Settings', () => { F.showDiary(); F.showLegend(); F.showSettings(); });

let stages = 0;
ok('har level: scene + har stage ka pehla render (ladka + ladki dono)', () => {
  ['m', 'f'].forEach(g => {
    MG.state.profile.gender = g;
    MG.tracks.forEach(t => (MG.levelSets[t.id] || []).forEach(l => {
      F.startLevel(l);
      l.stages.forEach((st, i) => {
        if (!MG.renderers[st.type]) return;
        MG.session.stageIdx = i;
        try { F.runStage(); stages++; }
        catch (e) { throw new Error(`${l.id} stage ${i} (${st.type}): ${e.message}`); }
      });
    }));
  });
});
ok('level complete screen + Dojo cards bane', () => {
  const l = MG.levelSets.basics[0];
  F.startLevel(l);
  MG.session.firstTry = 8; MG.session.total = 10;
  F.levelComplete();
  if (!MG.state.completed.includes(l.id)) throw new Error('level complete nahi hua');
  if (Object.keys(MG.state.dojo).length < l.phrases.length) throw new Error('Dojo cards nahi bane');
});
ok('Dojo with due cards', () => {
  Object.values(MG.state.dojo).forEach(c => { c.due = 0; });
  F.showDojo();
});
ok('router: har route', () => ['#/', '#/dojo', '#/diary', '#/legend', '#/settings', '#/track/tones', '#/level/ton-01', '#/nahi-hai']
  .forEach(h => { sandbox.location.hash = h; F.route(); }));
ok('sw.js PRECACHE mein index.html ki har script hai', () => {
  const sw = fs.readFileSync(path.join(DIR, 'sw.js'), 'utf8');
  const lost = FILES.filter(f => !sw.includes(`'${f}'`));
  if (lost.length) throw new Error('sw.js mein nahi: ' + lost.join(', '));
});
console.log(`  ℹ️  ${stages} stages render hue`);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
