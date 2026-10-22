#!/usr/bin/env node
/* Pinyin engine tests — node tests/test-pinyin.js */
const path = require('path');
const PY = require(path.join(__dirname, '..', 'pinyin.js'));

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ✅', name); }
  else { fail++; console.log('  ❌', name, extra !== undefined ? '\n     → ' + JSON.stringify(extra) : ''); }
};
const sylStr = py => PY.analyze(py).syls.map(s => s.base + (s.er ? 'r' : '') + s.tone).join(' ');
const sayStr = (py, say) => PY.analyze(py, say).syls.map(s => s.say).join('-');
const chaoStr = py => PY.analyze(py).syls.map(s => s.chao.join('')).join(' ');
const errs = py => PY.analyze(py).errors;

console.log('=== Syllables ===');
ok('inventory size is realistic (390–430)', PY.syllableCount() >= 390 && PY.syllableCount() <= 430, PY.syllableCount());
['zhuang', 'shei', 'zei', 'nüe', 'lüe', 'jiong', 'yuan', 'weng', 'er', 'ri', 'si', 'dia', 'miu']
  .forEach(s => ok(`"${s}" valid`, PY.isSyllable(s)));
['ji' + 'e' + 'n', 'fi', 'bü', 'zhi' + 'a', 'gi', 'ku' + 'e']
  .forEach(s => ok(`"${s}" invalid`, !PY.isSyllable(s)));

console.log('=== Parsing ===');
ok('Āyí hǎo!', sylStr('Āyí hǎo!') === 'a1 yi2 hao3', sylStr('Āyí hǎo!'));
ok('Zhōngguó', sylStr('Zhōngguó') === 'zhong1 guo2');
ok('nánpéngyou (neutral last)', sylStr('nánpéngyou') === 'nan2 peng2 you0');
ok('Duìbuqǐ', sylStr('Duìbuqǐ') === 'dui4 bu0 qi3');
ok("Xī'ān apostrophe", sylStr("Xī'ān") === 'xi1 an1', sylStr("Xī'ān"));
ok('xian = 1 syllable', sylStr('xiān') === 'xian1');
ok("fāng'àn", sylStr("fāng'àn") === 'fang1 an4');
ok('erhua yìdiǎnr', sylStr('yìdiǎnr') === 'yi4 dianr3', sylStr('yìdiǎnr'));
ok('erhua Nǎr?', sylStr('Nǎr?') === 'nar3');
ok('ér is a syllable, not e+r', sylStr("nǚ'ér") === 'nü3 er2', sylStr("nǚ'ér"));
ok('Dongbei: ēnna, zéi hǎochī', sylStr('ēnna zéi hǎochī') === 'en1 na0 zei2 hao3 chi1');
ok('WiFi = foreign token', PY.parse('WiFi mìmǎ').tokens[0].t === 'foreign');
ok('digits = foreign token', PY.parse('Dǎ 110').tokens[1].t === 'foreign');

console.log('=== Errors caught ===');
ok('breve ĭ (not caron ǐ) rejected', errs('Nĭ hǎo').length > 0);
ok('mark on wrong vowel (haǒ)', errs('haǒ').some(e => e.includes('galat vowel')), errs('haǒ'));
ok('two marks in one syllable', errs('hǎó').length > 0);
ok('typo syllable rejected (jien)', errs('ji' + 'en').length > 0);

console.log('=== Sandhi (spoken tones) ===');
ok('Nǐ hǎo → 2-3', sayStr('Nǐ hǎo!') === '2-3');
ok('Wǒ + (hěn hǎo): preserve initial low tone → 3-2-3', sayStr('Wǒ hěn hǎo.') === '3-2-3');
ok('one word + two-syllable word: hěn yǒuhǎo → 3-2-3', sayStr('hěn yǒuhǎo') === '3-2-3');
ok('two-syllable word + one word: bǎoguǎn hǎo → 2-2-3', sayStr('bǎoguǎn hǎo') === '2-2-3');
ok('single-word three-tone convention: zhǎnlǎnguǎn → 2-2-3', sayStr('zhǎnlǎnguǎn') === '2-2-3');
ok('word plus another pair preserves internal grouping', sayStr('shuǐguǒ hěn hǎo') === '2-3-2-3');
ok('automatic grouping of 3+ thirds is marked approximate', PY.analyze('Wǒ hěn hǎo').syls.every(s => s.sandhiApprox));
ok('a simple pair does not need the long-run approximation marker', PY.analyze('Nǐ hǎo').syls.every(s => !s.sandhiApprox));
ok('grouping keeps first wǒ low in connected-speech contour', chaoStr('Wǒ hěn hǎo.') === '21 35 214');
ok('comma breaks the 3-3 run', sayStr('Hǎo, wǒ yě qù.') === '3-2-3-4', sayStr('Hǎo, wǒ yě qù.'));
ok('foreign token breaks a third-tone run', sayStr('Wǒ OK hěn hǎo') === '3-2-3');
ok('neutral breaks the run: jiějie stays 3-0', sayStr('jiějie') === '3-0');
ok('say override: xiǎojie → xiáojie', sayStr('xiǎojie', 'xiáojie') === '2-0');
ok('explicit say can select another phrase grouping', sayStr('Wǒ hěn hǎo', 'Wó hén hǎo') === '2-2-3');
ok('explicit say bypasses automatic long-run inference', PY.analyze('Wǒ hěn hǎo', 'Wǒ hěn hǎo').syls.every(s => s.say === 3 && !s.sandhiApprox));
ok('say with different syllables = error', PY.analyze('xiǎojie', 'xiáoyu').errors.length > 0);

console.log('=== Chao contours ===');
ok('T1 55, T2 35, T4 51', chaoStr('tā lái qù') === '55 35 51', chaoStr('tā lái qù'));
ok('T3 at end = 214, mid = 21', chaoStr('hǎo, hǎochī') === '214 21 55', chaoStr('hǎo, hǎochī'));
ok('neutral height follows previous tone (4→1, 1→2, 2→3, 3→4)',
  chaoStr('xièxie māma yéye jiějie') === '51 1 55 2 35 3 21 4', chaoStr('xièxie māma yéye jiějie'));

console.log('=== Helpers ===');
ok('strip', PY.strip('Nǐ hǎo! Lǜ') === 'Ni hao! Lü', PY.strip('Nǐ hǎo! Lǜ'));
ok('retone', PY.retone('Nǐ hǎo!', [1, 4]) === 'Nī hào!', PY.retone('Nǐ hǎo!', [1, 4]));
ok('retone keeps apostrophe', PY.retone("Xī'ān", []) === "Xī'ān", PY.retone("Xī'ān", []));
ok('retone keeps erhua', PY.retone('yìdiǎnr', [2, 3]) === 'yídiǎnr', PY.retone('yìdiǎnr', [2, 3]));
ok('mark puts tone on o of ou', PY.mark('dou', 1) === 'dōu');
ok('mark on last vowel of iu/ui', PY.mark('jiu', 3) === 'jiǔ' && PY.mark('gui', 4) === 'guì');
ok('hanCount skips Latin + punctuation', PY.hanCount('我要去KTV唱歌儿！') === 6);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
