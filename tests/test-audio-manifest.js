#!/usr/bin/env node
/* Independent content-to-recording audit. No network or user state.
   Run after tools/generate-audio.py: node tests/test-audio-manifest.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const voices = ['zh-CN-XiaoxiaoNeural', 'zh-CN-YunxiNeural'];
const context = vm.createContext({
  console, setTimeout: () => {},
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { getElementById: () => null },
});
const content = [...fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').matchAll(/<script src="(data-[^"]+\.js)"/g)]
  .map(m => m[1]).filter(file => file !== 'data-core.js');
['core.js', 'pinyin.js', 'data-core.js', ...content, 'audio-manifest.js'].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file });
});
const MG = vm.runInContext('MG', context);
const spoken = new Set();
let examples = 0, dialogue = 0, alternatives = 0;
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.zh === 'string' && value.zh.trim()) spoken.add(value.zh.trim());
  if (Array.isArray(value)) value.forEach(collect);
  else Object.values(value).forEach(collect);
}
const levels = MG.tracks.flatMap(track => MG.levelsOf(track));
levels.forEach(level => {
  collect(level);
  level.phrases.forEach(phrase => { if (phrase.f?.zh) alternatives++; });
  level.stages.forEach(stage => {
    if (stage.type === 'dialogue') dialogue += stage.lines.filter(line => line.zh).length;
    if (stage.type === 'explain') examples += stage.cards.reduce((n, card) => n + (card.ex || []).filter(line => line.zh).length, 0);
  });
});
collect(MG.phrases);
assert.ok(spoken.size > 400, 'real lesson content must have been loaded');
assert.ok(dialogue > 0 && examples > 0 && alternatives > 0, 'audit includes dialogue, explain examples and gender wording alternatives');
assert.ok(MG.AUDIO && typeof MG.AUDIO === 'object', 'MG.AUDIO exists');
const missing = [];
for (const zh of spoken) for (const voice of voices) for (const speed of ['norm', 'slow']) {
  if (!MG.AUDIO[`${voice}|${speed}|${zh}`]) missing.push(`${voice}|${speed}|${zh}`);
}
assert.deepEqual(missing, [], 'every spoken Chinese text requires both voices and both natural speeds');
const urls = Object.values(MG.AUDIO);
assert.equal(urls.length, new Set(urls).size, 'each voice/speed recording has its own local file');
let totalBytes = 0;
const hashes = new Map();
for (const [key, url] of Object.entries(MG.AUDIO)) {
  const [voice, speed, ...text] = key.split('|');
  assert.ok(voices.includes(voice), 'only the two standard Mandarin reference voices: ' + key);
  assert.ok(['norm', 'slow'].includes(speed), 'expected norm or slow: ' + key);
  assert.equal(text.join('|'), text.join('|').trim(), 'manifest text is trimmed');
  assert.ok(/^audio\/[a-zA-Z0-9._/-]+\.mp3$/.test(url) && !url.includes('..'), 'safe local MP3 path: ' + url);
  const file = path.join(ROOT, url);
  assert.ok(fs.existsSync(file), 'missing recording: ' + url);
  const buffer = fs.readFileSync(file);
  assert.equal(MG.AUDIO_META?.files?.[url], buffer.length, 'manifest storage estimate matches real MP3 bytes: ' + url);
  assert.ok(buffer.length >= 512, 'recording is empty or implausibly short: ' + url);
  const id3 = buffer.subarray(0, 3).toString() === 'ID3';
  const frame = buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
  assert.ok(id3 || frame, 'recording must contain MP3 data rather than an error response: ' + url);
  hashes.set(key, crypto.createHash('sha256').update(buffer).digest('hex'));
  totalBytes += buffer.length;
}
for (const zh of spoken) for (const voice of voices) {
  assert.notEqual(hashes.get(`${voice}|norm|${zh}`), hashes.get(`${voice}|slow|${zh}`), 'normal and slow are separately synthesized: ' + zh);
}
console.log(`✅ ${levels.length} lessons; ${spoken.size} unique spoken texts; ${dialogue} dialogue lines; ${examples} explain examples; ${alternatives} gender alternatives.`);
console.log(`✅ ${urls.length} real MP3 files, ${(totalBytes / 1024 / 1024).toFixed(1)} MiB; both standard voices and normal/slow coverage complete.`);
