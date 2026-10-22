/* =====================================================================
   Mandarin Gurukul — Ranks, Tracks, Cast
   Naya track add karna ho? Yahan ek entry + ek nayi data-<track>.js file
   (aur index.html + validate.js + boot-test.js ki FILES list mein naam).
   Unlock: `gate: true` wala track (Tone Dojo) pehle; phir sab khul jaate hain.
   ===================================================================== */

const RANKS = [
  { xp: 0,    name: 'Naya Musafir',       icon: '🐣' },
  { xp: 150,  name: 'Nǐ hǎo Nawab',       icon: '👋' },
  { xp: 400,  name: 'Tone Tapasvi',       icon: '🎵' },
  { xp: 750,  name: 'Pinyin Pandit',      icon: '📜' },
  { xp: 1150, name: 'Chopstick Champion', icon: '🥢' },
  { xp: 1650, name: 'Jiaozi Jasoos',      icon: '🥟' },
  { xp: 2250, name: 'Hotpot Hero',        icon: '🍲' },
  { xp: 2950, name: 'Ganbei Guru',        icon: '🥂' },
  { xp: 3750, name: 'Mandarin Dost',       icon: '❄️' },
  { xp: 4650, name: 'Baat-cheet Baadshah',   icon: '🏯' },
  { xp: 5700, name: 'Mandarin Mahaguru',  icon: '🐉' },
];

/* Tracks — is array ka order = home screen ka order = "Aaj ka plan" ka order */
MG.tracks = [
  {
    id: 'tones', prefix: 'ton', icon: '🎵', gate: true, gateCount: 4,
    name: 'Tone Dojo — Chaar Tones ka Khel',
    blurb: 'Mandarin mein ek hi "ma" ke chaar matlab hain: maa, ghoda, daantna... Tone galat = matlab galat. Yahan tone ki shakal (graph) dekh ke bolna seekhoge, 3+3 ka niyam, 一 aur 不 ke badlaav, aur do-syllable tone jodiyan.',
    certTitle: 'TONE TAPASVI', motto: 'Shabd yaad karna aadha kaam hai. Sahi sur mein bolna poora kaam hai.',
  },
  {
    id: 'sounds', prefix: 'snd', icon: '👄',
    name: 'Awaaz Lab — Hindi Bridge',
    blurb: 'Hindi bolne walon ke paas pehle se Mandarin ki chaabi hai. Teen lessons: b/p, d/t, g/k mein hawa ka farq (प/फ, त/थ, क/ख 💨), j q x vs zh ch sh (👅 zubaan peeche), aur ü 😗, Mandarin "e" aur -n/-ng — sab asli shabdon ke saath (包子, 谢谢, 绿茶, 房间).',
    certTitle: 'AWAAZ ACHARYA', motto: 'Hindi ki awaazein Mandarin ka pul hain. Pul par chalna seekho.',
  },
  {
    id: 'basics', prefix: 'bas', icon: '🧱',
    name: 'Pehle Shabd — Survival Kit',
    blurb: 'Pehle din ke shabd: namaste, shukriya, sorry, "samajh nahi aaya, dheere boliye, phir se boliye", apna chhota parichay ("main India se hoon"), 1 se 10 tak ginti aur time poochna.',
    certTitle: 'SURVIVAL SIPAHI', motto: 'Das sahi shabd, sau galat sentences se behtar hain.',
  },
  {
    id: 'family', prefix: 'fam', icon: '👨‍👩‍👧',
    name: 'GF ki Family — Pehli Mulaqat',
    blurb: 'Xiǎoyǔ ke ghar pehli mulaqat: darwaze pe 您 wali izzat, tohfa, apna parichay, mummy-papa ke sawaal, khane ki table, politely mana karna, aur vida lena. Standard Mandarin; har ghar ki preferences alag ho sakti hain.',
    certTitle: 'DAMAAD DARJA', motto: 'Parents ka dil grammar se nahi, izzat aur koshish se jeeta jaata hai.',
  },
  {
    id: 'food', prefix: 'food', icon: '🍜',
    name: 'Khana-Peena — Restaurant',
    blurb: '"Kitne log?" se bill tak: menu pe ungli rakh ke order, teekha kitna, veg / no-beef, garam paani, common menu items (jiaozi, noodles, rice), hotpot, swaad ki tareef, bill aur dabba.',
    certTitle: 'KHAANA KHILAADI', motto: 'Jo order kar sakta hai, woh kahin bhooka nahi rehta.',
  },
  {
    id: 'friends', prefix: 'frd', icon: '🎉',
    name: 'GF ke Dost — Masti aur Baatein',
    blurb: 'Xiǎoyǔ ke doston ke saath: pehli mulaqat aur naam poochna, WeChat add karna aur photo bhejna, aur shaam ka plan pakka karna (kab aur kahan milna hai, "aaj nahi aa sakta").',
    certTitle: 'DOSTI DOOT', motto: 'Hasi aur 3 sahi shabd — dosti shuru.',
  },
  {
    id: 'travel', prefix: 'trv', icon: '🚕',
    name: 'Ghoomna — Taxi, Metro, Hotel',
    blurb: 'Taxi driver (师傅) ko address dikhana aur "yahin rokiye", raasta poochna (left/right/seedha), metro ki line, direction aur exit, aur hotel check-in ke saath kamre ki problem.',
    certTitle: 'SAFAR SARDAR', motto: 'Raasta poochna kamzori nahi, safar ka hissa hai.',
  },
  {
    id: 'shopping', prefix: 'shp', icon: '🛍️',
    name: 'Shopping & Paisa',
    blurb: 'Daam poochna aur 四十 vs 十四 ka jaal, molbhav ("thoda sasta?"), aur payment: WeChat Pay / Alipay ka scan, cash ya card.',
    certTitle: 'MOLBHAV MAHARATHI', motto: 'Pehla daam kabhi aakhri daam nahi hota.',
  },
  {
    id: 'emergency', prefix: 'emg', icon: '🚑',
    name: 'Musibat & Sehat',
    blurb: 'Raasta bhatakna, phone ya passport kho jaana, police (110) se madad, aur tabiyat kharab hone par symptoms aur allergy saaf batana, ambulance (120) bulana.',
    certTitle: 'SANKAT SAATHI', motto: 'Musibat mein ek sahi sentence sabse badi madad hai.',
  },
  {
    id: 'builder', prefix: 'bld', icon: '🧩',
    name: 'Sentence Builder — Apne Vakya',
    blurb: 'Rate hue phrases se aage: Mandarin ke Lego blocks. Word order (kaun → kab → kahan → kya), 吗 aur 去不去 wale sawaal, 想 / 要 / 会 / 可以 / 能, 不 vs 没, aur ginti ke shabd (个 / 杯 / 碗 / 张).',
    certTitle: 'VAKYA VASTUKAR', motto: 'Blocks samajh aaye to har sentence tumhara.',
  },
  {
    id: 'north', prefix: 'nth', icon: '🏮',
    name: 'Optional Bonus — Regional Phrases',
    blurb: 'Extra context ke liye regional examples. Trip ka main course standard Mandarin hai. Bonus words ko bolna zaroori nahi; pehchaan paana kaafi hai.',
    certTitle: 'EXTRA CONTEXT', motto: 'Standard Mandarin pehle. Local words optional.',
  },
];

/* Cast — dialogue mein `who` inme se ek hona chahiye.
   `voice` = legacy cast-voice candidates; current reference player uses the two selectable standard voices.
   'you' ki voice profile.gender se chunegi (m / f). Abhi koi audio nahi bajta. */
const CAST = {
  you:     { name: 'Aap',                     emoji: '🧑🏽', emojiM: '👨🏽', emojiF: '👩🏽', voice: { m: 'zh-CN-YunxiNeural', f: 'zh-CN-XiaoxiaoNeural' } },
  gf:      { name: 'Xiǎoyǔ (GF)',             emoji: '👩🏻', voice: 'zh-CN-XiaoyiNeural' },
  mom:     { name: 'Āyí (GF ki mummy)',       emoji: '👩🏻‍🦱', voice: 'zh-CN-XiaoxiaoNeural' },
  dad:     { name: 'Shūshu (GF ke papa)',     emoji: '👨🏻‍🦳', voice: 'zh-CN-YunjianNeural' },
  nainai:  { name: 'Nǎinai (GF ki daadi)',    emoji: '👵🏻', voice: 'zh-CN-liaoning-XiaobeiNeural' },
  kid:     { name: 'Xiǎo Míng (GF ka bhatija)', emoji: '👦🏻', voice: 'zh-CN-YunxiaNeural' },
  lili:    { name: 'Lìli (GF ki saheli)',     emoji: '👩🏻‍🦰', voice: 'zh-CN-XiaoyiNeural' },
  dawei:   { name: 'Dàwěi (GF ka dost)',      emoji: '👨🏻', voice: 'zh-CN-YunyangNeural' },
  waiter:  { name: 'Fúwùyuán (waiter)',       emoji: '🧑🏻‍🍳', voice: 'zh-CN-YunyangNeural' },
  driver:  { name: 'Shīfu (driver)',          emoji: '🧔🏻', voice: 'zh-CN-YunjianNeural' },
  staff:   { name: 'Staff (hotel / station)', emoji: '🧑🏻‍💼', voice: 'zh-CN-XiaoxiaoNeural' },
  seller:  { name: 'Lǎobǎn (dukaandaar)',     emoji: '🧓🏻', voice: 'zh-CN-YunjianNeural' },
  doctor:  { name: 'Dàifu (doctor)',          emoji: '🧑🏻‍⚕️', voice: 'zh-CN-YunyangNeural' },
  police:  { name: 'Jǐngchá (police)',        emoji: '👮🏻', voice: 'zh-CN-YunyangNeural' },
  stranger:{ name: 'Raah chalta',             emoji: '🧑🏻', voice: 'zh-CN-XiaoxiaoNeural' },
  teacher: { name: 'Laoshi',                  emoji: '🧑‍🏫', voice: { m: 'zh-CN-YunxiNeural', f: 'zh-CN-XiaoxiaoNeural' } },
};
MG.CAST = CAST;
MG.castEmoji = function (who) {
  const c = CAST[who] || CAST.stranger;
  if (who === 'you') return MG.state.profile.gender === 'f' ? c.emojiF : MG.state.profile.gender === 'm' ? c.emojiM : c.emoji;
  return c.emoji;
};

/* Tone colours + naam (pyview.js aur legend) */
MG.TONES = {
  1: { name: 'Tone 1 — seedha ooncha', short: 'ऊँचा, flat', hint: 'Doctor ke saamne "aaaa" jaisa: ooncha aur seedha.' },
  2: { name: 'Tone 2 — upar chadhta', short: 'neeche se upar', hint: 'Hairaani wala "Haan?!" jaisa: beech se upar.' },
  3: { name: 'Tone 3 — neeche dabta', short: 'neeche, dabaa hua', hint: 'Soch mein "hmm..." jaisa: aawaaz neeche dabao. Akela ho to aakhir mein halka upar.' },
  4: { name: 'Tone 4 — girta hua', short: 'upar se neeche', hint: 'Gusse wala "Bas!" jaisa: upar se tezi se neeche.' },
  0: { name: 'Neutral — halka', short: 'chhota, halka', hint: 'Bina zor ke, chhota sa. Uchaai pichhle tone se tay hoti hai.' },
};
