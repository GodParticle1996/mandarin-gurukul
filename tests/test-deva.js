#!/usr/bin/env node
/* Devanagari hint tests — node tests/test-deva.js */
const path = require('path');
const PY = require(path.join(__dirname, '..', 'pinyin.js'));
const DV = require(path.join(__dirname, '..', 'deva.js'));

let pass = 0, fail = 0;
const flags = h => ['asp', 'ret', 'buzz', 'round', 'e', 'er'].filter(k => h[k]).join('+');
/* [pinyin, expected Devanagari, expected flags] */
const CASES = [
  ['nǐ', 'नी', ''], ['hǎo', 'हाओ', ''], ['xiè', 'श्ये', ''], ['zhōng', 'चुङ', 'ret'],
  ['guó', 'क्वो', ''], ['qǐng', 'चिङ', 'asp'], ['shì', 'श्र्', 'ret+buzz'], ['sì', 'स्', 'buzz'],
  ['rì', 'र्', 'ret+buzz'], ['chī', 'च्र्', 'asp+ret+buzz'], ['nǚ', 'नी', 'round'], ['xué', 'श्वे', 'round'],
  ['yuán', 'य्वेन', 'round'], ['qù', 'ची', 'asp+round'], ['péng', 'पङ', 'asp'], ['rén', 'रन', 'ret'],
  ['è', 'अ', 'e'], ['èr', 'आर', 'er'], ['de', 'त', 'e'], ['kuài', 'क्वाइ', 'asp'], ['duì', 'त्वेइ', ''],
  ['chūn', 'च्वन', 'asp+ret'], ['jūn', 'चीन', 'round'], ['bō', 'प्वो', ''], ['cài', 'त्साइ', 'asp'],
  ['zài', 'त्साइ', ''], ['fàn', 'फ़ान', ''], ['wǒ', 'वो', ''], ['yǒu', 'योउ', ''], ['jiǔ', 'च्योउ', ''],
  ['tiān', 'त्येन', 'asp'], ['xiǎng', 'श्याङ', ''], ['diǎnr', 'त्यार', 'er'], ['nǎr', 'नार', 'er'],
  ['wánr', 'वार', 'er'], ['zhèr', 'चर', 'ret+e+er'], ['huìr', 'ह्वर', 'er'], ['ēn', 'अन', ''],
];
for (const [py, want, wantFlags] of CASES) {
  const syl = PY.analyze(py).syls[0];
  const h = DV.hint(syl);
  const good = h.dv === want && flags(h) === wantFlags;
  if (good) pass++; else fail++;
  console.log(`  ${good ? '✅' : '❌'} ${py.padEnd(7)} → ${h.dv} ${flags(h)}${good ? '' : `   (chahiye: ${want} ${wantFlags})`}`);
}
/* sweep: inventory ke har syllable (aur uske erhua roop) ka hint bane, '?' na aaye */
const broken = [];
PY.allSyllables().forEach(base => {
  [false, true].forEach(er => {
    const h = DV.hint({ base, er });
    if (!h.dv || h.dv.includes('?')) broken.push(base + (er ? 'r' : '') + '→' + h.dv);
  });
});
if (broken.length) { fail++; console.log('  ❌ sweep: hint nahi bana →', broken.slice(0, 20).join(', ')); }
else { pass++; console.log(`  ✅ sweep: ${PY.syllableCount()} syllables × (normal + erhua) sabka hint bana`); }
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
