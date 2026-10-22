/* =====================================================================
   Mandarin Gurukul — pinyin ka visual roop (HTML strings)
   MG.pv.line(phrase)      → syllable stacks: contour · pinyin · Devanagari · 汉
   MG.pv.inline(py)        → ek line mein rangeen pinyin (choices ke liye)
   MG.pv.glyph(chao, tone) → chhoti tone line (SVG)
   MG.pv.visual(key)       → explain-cards ke diagram (tonechart, sandhi33 …)
   ===================================================================== */
(function () {
  const PV = {};
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const prof = () => (typeof MG !== 'undefined' && MG.state ? MG.state.profile : { showDeva: true, showBadges: true, showHan: true });

  /* Chao 1–5 → y (viewBox 30×22) */
  const Y = v => 19 - (v - 1) * 4;
  PV.glyph = function (chao, tone, cls) {
    let body;
    if (chao.length === 1) body = `<circle cx="15" cy="${Y(chao[0])}" r="2.8" fill="currentColor"/>`;
    else {
      const xs = chao.length === 2 ? [5, 25] : [5, 14, 25];
      const pts = chao.map((v, i) => `${xs[i]},${Y(v)}`).join(' ');
      body = `<polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return `<svg class="cg ${cls || ''}" viewBox="0 0 30 22" aria-hidden="true">`
      + `<line x1="2" x2="28" y1="${Y(3)}" y2="${Y(3)}" class="cg-mid"/>${body}</svg>`;
  };

  /* zh ke Han akshar ko syllables se jodo (erhua = X + 儿) */
  function hanUnits(zh, syls) {
    const units = [...String(zh || '')].filter(ch => /\p{Script=Han}/u.test(ch));
    const need = syls.reduce((n, s) => n + (s.er ? 2 : 1), 0);
    if (units.length !== need) return null;
    let k = 0;
    return syls.map(s => { const u = s.er ? units[k] + units[k + 1] : units[k]; k += s.er ? 2 : 1; return u; });
  }

  function devaHtml(syl, p) {
    const h = MG.deva.hint(syl);
    const cls = 'd' + (h.e ? ' d-e' : '') + (h.er ? ' d-er' : '');
    let badges = '';
    if (p.showBadges) {
      if (h.asp) badges += '<sup title="💨 hawa ke saath">💨</sup>';
      if (h.ret) badges += '<sup title="👅 zubaan peeche">👅</sup>';
      if (h.buzz) badges += '<sup title="🐝 ई nahi, bhanbhanahat">🐝</sup>';
      if (h.round) badges += '<sup title="😗 hoth gol">😗</sup>';
    }
    return `<i class="${cls}">${h.dv}${badges}</i>`;
  }

  function sylTitle(s) {
    const T = MG.TONES || {};
    const say = T[s.say] ? T[s.say].name : '';
    if (s.sandhiApprox) return 'Lambi Tone 3 sequence: simplified grouping. Rhythm ke saath pattern badal sakta hai.';
    if (s.changed) return `Likha Tone ${s.tone || 'neutral'}, bolo ${say} (3+3 niyam)`;
    if (s.say === 3 && s.chao.length === 2) return 'Tone 3 beech mein: sirf neeche dabao (upar mat uthao)';
    return say;
  }

  /* phrase / line → stacked pinyin. opts: { big, han, deva, zh, py, say } */
  PV.line = function (o, opts) {
    opts = opts || {};
    const p = Object.assign({}, prof(), opts.profile || {});
    const showHan = opts.han != null ? opts.han : p.showHan;
    const showDeva = opts.deva != null ? opts.deva : p.showDeva;
    const a = MG.py.analyze(o.py, o.say);
    const han = showHan ? hanUnits(o.zh, a.syls) : null;
    let si = 0, out = '', curWord = -1;
    a.tokens.forEach(t => {
      if (t.t === 'syl') {
        const s = a.syls[si];
        if (t.w !== curWord) { if (curWord !== -1) out += '</span>'; out += '<span class="w">'; curWord = t.w; }
        out += `<span class="sy t${s.say}${s.changed ? ' chg' : ''}" title="${esc(sylTitle(s))}">`
          + PV.glyph(s.chao, s.say)
          + `<b class="p">${esc(t.text)}</b>`
          + (showDeva ? devaHtml(s, p) : '')
          + (han ? `<u class="h">${han[si]}</u>` : '')
          + '</span>';
        si++;
      } else {
        if (curWord !== -1) { out += '</span>'; curWord = -1; }
        out += `<span class="pu${t.t === 'foreign' ? ' fx' : ''}">${esc(t.text)}</span>`;
      }
    });
    if (curWord !== -1) out += '</span>';
    return `<div class="pyl${opts.big ? ' big' : ''}">${out}</div>`;
  };

  /* Roman Hinglish articulation cues supplement the precise pinyin, not replace it. */
  PV.mouthCue = function (phrase) {
    const syls = MG.py.analyze(phrase.py).syls;
    const bases = syls.map(s => s.base);
    const cues = [];
    if (bases.some(b => /^[jqx]/.test(b))) cues.push('j/q/x: zubaan ka tip neeche ke daanton ke paas; q mein extra hawa.');
    if (bases.some(b => /^(zh|ch|sh|r)/.test(b))) cues.push('zh/ch/sh/r: zubaan thodi peeche; har sound ko Hindi ka exact match mat samjho.');
    if (bases.some(b => /ü/.test(b) || /^(ju|qu|xu|yu)/.test(b))) cues.push('ü sound: zubaan "ee" wali, hoth "oo" jaise gol.');
    if (bases.some(b => /^[ptk]/.test(b))) cues.push('p/t/k: muh ke saamne haath rakho; hawa ka puff feel karo.');
    if (bases.some(b => /^[bdg]/.test(b))) cues.push('b/d/g: hawa ka strong puff nahi. English voiced b/d/g ki copy mat karo.');
    return '<span aria-hidden="true">👄</span><span><b>Mouth cue</b><br>' + esc(cues.slice(0, 2).join(' ') || 'Ek shabd ko dheere bolo, phir poori phrase jodo. Tone ki line ke saath haath chalao.') + '</span>';
  };

  /* compact coloured pinyin in one row (choices, lists) */
  PV.inline = function (py, opts) {
    opts = opts || {};
    const a = MG.py.analyze(py);
    let si = 0, out = '', prevWord = -1;
    a.tokens.forEach(t => {
      if (t.t === 'syl') {
        const s = a.syls[si++];
        if (t.w !== prevWord && out && !/\s$/.test(out)) out += ' ';
        out += opts.plain ? esc(t.text) : `<span class="t${s.say}">${esc(t.text)}</span>`;
        prevWord = t.w;
      } else { out += (t.t === 'foreign' && out ? ' ' : '') + esc(t.text); prevWord = -1; }
    });
    return `<span class="pyi">${out}</span>`;
  };

  /* tone pattern (e.g. [2,3]) → row of contour glyphs, used as quiz buttons */
  PV.pattern = function (tones) {
    const syls = tones.map(t => ({ say: t, chao: t === 1 ? [5,5] : t === 2 ? [3,5] : t === 3 ? [2,1,4] : t === 4 ? [5,1] : [3] }));
    return `<span class="pat">${syls.map(s => `<span class="t${s.say}">${PV.glyph(s.chao, s.say)}</span>`).join('')}</span>`;
  };
  PV.patternName = function (tones) {
    return tones.map(t => (t === 0 ? '·' : t)).join(' + ');
  };

  /* ---------- explain-card visuals ---------- */
  const TONE_DEMO = [
    { t: 1, chao: [5, 5], py: 'mā', hi: 'doctor wala "aaaa"' },
    { t: 2, chao: [3, 5], py: 'má', hi: 'hairaani wala "Haan?!"' },
    { t: 3, chao: [2, 1, 4], py: 'mǎ', hi: 'soch wala "hmm…" (neeche)' },
    { t: 4, chao: [5, 1], py: 'mà', hi: 'gusse wala "Bas!"' },
    { t: 0, chao: [3], py: 'ma', hi: 'chhota, halka' },
  ];
  function scaleRows() {
    return [5, 4, 3, 2, 1].map(v => `<line x1="34" x2="236" y1="${10 + (5 - v) * 14}" y2="${10 + (5 - v) * 14}" class="vz-grid"/>`
      + `<text x="22" y="${14 + (5 - v) * 14}" class="vz-lbl">${v}</text>`).join('');
  }
  PV.visual = function (key) {
    if (key === 'tonechart') {
      const lines = TONE_DEMO.slice(0, 4).map((d, i) => {
        const x0 = 40 + i * 50, w = 40;
        const xs = d.chao.length === 2 ? [x0, x0 + w] : [x0, x0 + w / 2, x0 + w];
        const pts = d.chao.map((v, k) => `${xs[k]},${10 + (5 - v) * 14}`).join(' ');
        return `<polyline points="${pts}" class="vz-tone t${d.t}" fill="none"/>`
          + `<text x="${x0 + w / 2}" y="84" class="vz-py t${d.t}" text-anchor="middle">${d.py}</text>`;
      }).join('');
      return `<div class="vz"><svg viewBox="0 0 250 92" class="vz-svg">${scaleRows()}${lines}</svg>`
        + `<div class="vz-cap">5 = sabse ooncha sur, 1 = sabse neecha. Har line ek tone ki shakal hai.</div>`
        + `<div class="vz-legend">${TONE_DEMO.map(d => `<span class="t${d.t}">${PV.glyph(d.chao, d.t)} <b>${d.py}</b> ${esc(d.hi)}</span>`).join('')}</div></div>`;
    }
    const m = /^tone([0-4])$/.exec(key);
    if (m) {
      const d = TONE_DEMO.find(x => x.t === +m[1]);
      const T = MG.TONES[d.t];
      return `<div class="vz vz-one t${d.t}">${PV.glyph(d.chao, d.t, 'xl')}<div><b>${esc(T.name)}</b><br>${esc(T.hint)}</div></div>`;
    }
    if (key === 'sandhi33') {
      // say = py → likhe hue tones hi bole jaate hain (koi 3+3 badlaav nahi) = "Likha" view
      const opt = { han: false, deva: false };
      return `<div class="vz vz-row"><div><div class="vz-tag">Likha</div>${PV.line({ py: 'nǐ hǎo', say: 'nǐ hǎo' }, opt)}</div>`
        + `<div class="vz-arrow">➜</div><div><div class="vz-tag">Bolte hain</div>${PV.line({ py: 'nǐ hǎo' }, opt)}</div></div>`
        + '<div class="vz-cap">Do Tone 3 saath aayein to pehla Tone 3, Tone 2 ban jaata hai. App aise syllable par ↻ nishaan lagata hai.</div>';
    }
    if (key === 'badges') {
      return `<div class="vz vz-badges">${MG.deva.BADGES.map(b => `<div><span class="vz-b">${b.icon}</span><b>${esc(b.name)}</b> — ${esc(b.text)}</div>`).join('')}</div>`;
    }
    if (key === 'mouth') {
      return '<div class="vz vz-mouth">'
        + '<div><span>😁</span><b>Muskaan</b><br>j q x, i: hoth failao, zubaan ki nok neeche ke daanton ke peeche</div>'
        + '<div><span>😗</span><b>Gol hoth</b><br>ü: zubaan ई wali jagah, hoth ऊ jaise gol</div>'
        + '<div><span>👅</span><b>Zubaan peeche</b><br>zh ch sh r: nok ko upar-peeche mod lo, jaise ट / ष</div>'
        + '<div><span>💨</span><b>Hawa</b><br>p t k q c ch: muh ke aage kaagaz hile</div></div>';
    }
    return '';
  };

  /* ---------- asli photos (photos.js) ----------
     Phrase ke zh mein photo ka koi shabd ho (饺子, 长城 …) → photo, warna emoji.
     Sabse lamba milta shabd jeet-ta hai (涮羊肉 > 羊肉串 wagairah). */
  let wordIndex = null;
  PV.photoFor = function (p) {
    if (!p || !p.zh || typeof MG === 'undefined' || !MG.PHOTOS) return null;
    if (!wordIndex) {
      wordIndex = [];
      Object.entries(MG.PHOTOS).forEach(([k, ph]) => (ph.words || []).forEach(w => wordIndex.push([w, k])));
      wordIndex.sort((a, b) => b[0].length - a[0].length);
    }
    const hit = wordIndex.find(([w]) => String(p.zh).includes(w));
    return hit ? MG.PHOTOS[hit[1]] : null;
  };
  /* size: 'card' | 'big' | 'thumb' */
  PV.pic = function (p, size) {
    const ph = PV.photoFor(p);
    const emoji = esc((p && p.img) || '💬');
    if (!ph) return `<span class="pc-img${size === 'thumb' ? ' sm' : size === 'big' ? ' big' : ''}">${emoji}</span>`;
    return `<figure class="ph ph-${size || 'card'}"><img src="${esc(ph.src)}" alt="${esc(ph.title)}" loading="lazy">`
      + (size === 'thumb' ? '' : `<figcaption>${emoji}</figcaption>`) + '</figure>';
  };

  if (typeof MG !== 'undefined') MG.pv = PV;
  if (typeof module !== 'undefined' && module.exports) module.exports = PV;
})();
