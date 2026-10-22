/* =====================================================================
   Mandarin Gurukul — Devanagari hints (Hindi bridge)
   MG.deva.hint(syl) → { dv, asp, ret, round, buzz, e, er }
   Ek hi akshar + badge = Mandarin ka asli farq:
     b = प      p = प 💨      (farq sirf hawa ka)
     j = च      zh = च 👅     (farq sirf zubaan ka)
     x = श      sh = श 👅
   ===================================================================== */
(function () {
  const DV = {};

  /* initial → [akshar, 💨 hawa, 👅 zubaan peeche] */
  const INI = {
    b: ['प'], p: ['प', 1], m: ['म'], f: ['फ़'],
    d: ['त'], t: ['त', 1], n: ['न'], l: ['ल'],
    g: ['क'], k: ['क', 1], h: ['ह'],
    j: ['च'], q: ['च', 1], x: ['श'],
    zh: ['च', 0, 1], ch: ['च', 1, 1], sh: ['श', 0, 1], r: ['र', 0, 1],
    z: ['त्स'], c: ['त्स', 1], s: ['स'],
  };
  const INI_ORDER = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's'];

  /* final → [consonant ke baad, akela, khaas nishaan]
     E = Mandarin "e" (gale se 'uh') · U = ü (😗) · ER = 'r' wali awaaz */
  const FIN = {
    a: ['ा', 'आ'], ai: ['ाइ', 'आइ'], an: ['ान', 'आन'], ang: ['ाङ', 'आङ'], ao: ['ाओ', 'आओ'],
    e: ['', 'अ', 'E'], ei: ['ेइ', 'एइ'], en: ['न', 'अन'], eng: ['ङ', 'अङ'], er: ['र', 'आर', 'ER'],
    o: ['्वो', 'ओ'], ou: ['ोउ', 'ओउ'], ong: ['ुङ', 'उङ'],
    i: ['ी', 'ई'], ia: ['्या'], iao: ['्याओ'], ie: ['्ये'], iu: ['्योउ'], ian: ['्येन'],
    in: ['िन'], iang: ['्याङ'], ing: ['िङ'], iong: ['्योङ'],
    u: ['ू', 'ऊ'], ua: ['्वा'], uo: ['्वो'], uai: ['्वाइ'], ui: ['्वेइ'], uan: ['्वान'], un: ['्वन'], uang: ['्वाङ'],
    'ü': ['ी', '', 'U'], 'üe': ['्वे', '', 'U'], 'üan': ['्वेन', '', 'U'], 'ün': ['ीन', '', 'U'],
  };

  /* erhua: aakhri n / i gir jaata hai, ng naak mein chala jaata hai, phir 'र' */
  const ER_FIN = {
    an: 'ा', ai: 'ा', ian: '्या', uan: '्वा', uai: '्वा', en: '', ei: '', un: '्व', ui: '्व',
    in: 'ी', 'ün': 'ी', 'üan': '्वे', ang: 'ाँ', iang: '्याँ', uang: '्वाँ', ing: 'ीँ', ong: 'ुँ', eng: 'ँ',
  };

  /* y- / w- wale syllables (koi asli initial nahi) */
  const YW = {
    yi: 'यी', yin: 'यिन', ying: 'यिङ', ya: 'या', yao: 'याओ', ye: 'ये', you: 'योउ', yan: 'येन',
    yang: 'याङ', yong: 'योङ', yo: 'यो', yu: ['यी', 'U'], yue: ['य्वे', 'U'], yuan: ['य्वेन', 'U'], yun: ['यीन', 'U'],
    wu: 'वू', wa: 'वा', wo: 'वो', wai: 'वाइ', wei: 'वेइ', wan: 'वान', wen: 'वन', wang: 'वाङ', weng: 'वङ',
    m: 'म्', n: 'न्', ng: 'ङ्', hm: 'ह्म्',
  };

  DV.hint = function (syl) {
    const base = syl.base;
    const er = !!syl.er;
    const out = { dv: '', asp: false, ret: false, round: false, buzz: false, e: false, er };

    if (YW[base]) {
      const v = YW[base];
      out.dv = Array.isArray(v) ? v[0] : v;
      if (Array.isArray(v) && v[1] === 'U') out.round = true;
      if (er) out.dv = out.dv.replace(/(न|इ|ङ)$/, '') + 'र';
      return out;
    }

    const ini = INI_ORDER.find(i => base.startsWith(i) && base.length > i.length) || '';
    let fin = base.slice(ini.length);
    if ('jqx'.includes(ini) && ini && fin.startsWith('u')) fin = 'ü' + fin.slice(1);   // ju = jü
    const [akshar, asp, ret] = ini ? INI[ini] : ['', 0, 0];
    out.asp = !!asp; out.ret = !!ret;

    /* buzz vowel: zi ci si / zhi chi shi ri — koi ई nahi */
    if (fin === 'i' && ['z', 'c', 's', 'zh', 'ch', 'sh', 'r'].includes(ini)) {
      out.buzz = true;
      if (er) { out.dv = akshar + 'र'; return out; }
      if (ini === 'r') out.dv = 'र्';
      else if (out.ret) out.dv = akshar + '्र्';
      else out.dv = akshar + '्';
      return out;
    }

    const f = FIN[fin];
    if (!f) { out.dv = akshar + '?'; return out; }
    if (f[2] === 'U') out.round = true;
    if (f[2] === 'E') out.e = true;
    if (!ini) {                                   // a, ai, e, er, ou ...
      out.dv = f[1] || f[0];
      if (f[2] === 'ER') out.er = true;
      if (er) out.dv = out.dv.replace(/(न|इ|ङ)$/, '') + 'र';
      return out;
    }
    let after = f[0];
    if (fin === 'o' && !'bpmf'.includes(ini)) after = 'ो';        // lo 咯
    if (er) after = (fin in ER_FIN ? ER_FIN[fin] : after) + 'र';
    out.dv = akshar + after;
    return out;
  };

  /* legend — app ke "?" button aur Awaaz Lab mein dikhta hai */
  DV.BADGES = [
    { k: 'asp', icon: '💨', name: 'Hawa', text: 'Is akshar ke saath zor ki hawa nikaalo, jaise प ki jagah फ (phal wala). Muh ke aage kaagaz rakho: kaagaz hilna chahiye.' },
    { k: 'ret', icon: '👅', name: 'Zubaan peeche', text: 'Zubaan ki nok ko thoda peeche mod ke bolo, jaise ट / ष bolte waqt hoti hai.' },
    { k: 'buzz', icon: '🐝', name: 'Bhanbhanahat', text: 'Is syllable mein ई nahi hai. Akshar ki awaaz ko hi lamba khinch ke bhanbhanao: स्सस्, श्र्र्.' },
    { k: 'round', icon: '😗', name: 'Gol hoth', text: 'ü wali awaaz: zubaan ई bolne wali jagah par rakho, aur hoth ऊ jaise gol karo.' },
    { k: 'e', icon: '〰️', name: 'Gale wala "uh"', text: 'Mandarin ka "e" ए nahi hai. Gale ke peeche se halka "uh" bolo, jaise kisi ne pet mein mukka maara ho.' },
    { k: 'er', icon: '🌀', name: '"r" wali awaaz', text: 'Hindi ka र (zubaan ki tap) nahi. Zubaan peeche mod ke English "are" jaisa "r" bolo.' },
  ];

  if (typeof MG !== 'undefined') MG.deva = DV;
  if (typeof module !== 'undefined' && module.exports) module.exports = DV;
})();
