#!/usr/bin/env node
/* Export original Mandarin lesson lines only; never synthesize random quiz traps.
   Pure local collection, reused by the generator and manifest coverage checks. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');

/* TTS kabhi polyphone galat padhta hai. Yahan zh → jo text TTS ko bhejna hai
   (wahi awaaz, pakki reading wala homophone). App mein zh waisa hi dikhta hai.
   Har entry 2026-10-22 ko saved clip vs homophone variants se verify hui. */
const SPEAK = {
  '我干了，你随意。': '我甘了，你随意。',   // toast: gān le (glass khaali), TTS gàn le padhta tha
  '我肚子疼。': '我度子疼。',               // dùzi (pet); Yunxi dǔzi (tripe) padhta tha
};

function collect() {
  const context = vm.createContext({ console, Math, Date, JSON, Object, Array, String, Number, Boolean, Map, Set, RegExp });
  const scripts = [...fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  const files = ['core.js', 'pinyin.js', 'data-core.js', ...scripts.filter(f => /^data-.+\.js$/.test(f) && f !== 'data-core.js')];
  vm.runInContext(files.map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n;\n') + '\nglobalThis.__MG = MG;', context);
  const texts = new Map();
  function walk(value, where, level) {
    if (!value || typeof value !== 'object') return;
    if (!Array.isArray(value) && typeof value.zh === 'string' && typeof value.py === 'string' && /\p{Script=Han}/u.test(value.zh)) {
      const zh = value.zh.trim();
      let line = texts.get(zh);
      if (!line) {
        line = { zh, pinyin: [], levels: [], locations: [] };
        if (SPEAK[zh]) line.speak = SPEAK[zh];
        texts.set(zh, line);
      }
      if (!line.pinyin.includes(value.py)) line.pinyin.push(value.py);
      if (!line.levels.includes(level)) line.levels.push(level);
      line.locations.push(where);
    }
    Object.entries(value).forEach(([k, v]) => walk(v, where + '.' + k, level));
  }
  const MG = context.__MG;
  MG.tracks.forEach(track => (MG.levelSets[track.id] || []).forEach(level => walk(level, level.id, level.id)));
  return { schema: 1, voices: { female: 'zh-CN-XiaoxiaoNeural', male: 'zh-CN-YunxiNeural' }, rates: { norm: '+0%', slow: '-25%' }, texts: [...texts.values()].sort((a, b) => a.zh.localeCompare(b.zh, 'en')) };
}

if (require.main === module) {
  const catalog = collect();
  const output = process.argv[2];
  if (output) {
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(catalog, null, 2) + '\n');
    console.log(`${catalog.texts.length} unique Mandarin lines; ${catalog.texts.length * 4} voice/speed clips planned.`);
  } else process.stdout.write(JSON.stringify(catalog, null, 2) + '\n');
}
module.exports = { collect };
