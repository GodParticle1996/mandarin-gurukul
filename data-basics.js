/* =====================================================================
   Track: 🧱 Pehle Shabd — Survival Kit
   Format: BRIEF-CONTENT.md · Check: node validate.js --track basics
   ===================================================================== */
MG.registerLevels('basics', [
  {
    id: 'bas-01',
    icon: '👋',
    title: 'Namaste, Shukriya, Sorry',
    goal: 'Pehli mulaqat ke 8 jaadui shabd: namaste, shukriya, sorry, excuse me, alvida — aur unke jawab',
    scene: {
      img: '🛬🧳🧑🏽💥🧑🏻',
      text: 'Beijing airport. Aap trolley le ke nikle aur ek aadmi se halka sa takra gaye. Aadmi ne aapka gira hua passport utha ke diya.',
      ask: 'Sabse pehle kya bologe?',
      choices: [
        { py: 'Duìbuqǐ! Xièxie!', ok: true, why: '"Duìbuqǐ" = sorry (takkar ke liye), "Xièxie" = shukriya (passport ke liye). Dono ek saath bilkul natural hain.' },
        { py: 'Nǐ hǎo!', ok: false, why: '"Nǐ hǎo" = namaste. Takkar ke baad pehle sorry aur shukriya chahiye.' },
        { py: 'Zàijiàn!', ok: false, why: '"Zàijiàn" = alvida. Pehle sorry aur shukriya bolo, alvida baad mein.' },
      ],
    },
    phrases: [
      { id: 'bas-nihao', zh: '你好！', py: 'Nǐ hǎo!', hi: 'Namaste / Hello', img: '👋', note: 'Likha "nǐ hǎo" hai, bolte "ní hǎo" hain: do Tone 3 saath aayein to pehla Tone 2 ban jaata hai (app mein ↻ nishaan).' },
      { id: 'bas-ninhao', zh: '您好！', py: 'Nín hǎo!', hi: 'Namaste (izzat se, bado ke liye)', img: '🙏', note: '您 nín = "aap". GF ke parents, bade log aur hotel staff ko "Nín hǎo".' },
      { id: 'bas-xiexie', zh: '谢谢！', py: 'Xièxie!', hi: 'Shukriya', img: '🙏', note: 'Doosra "xie" chhota aur halka (neutral). "Xiè-XIÈ" do baar zor se mat bolo.' },
      { id: 'bas-bukeqi', zh: '不客气。', py: 'Bú kèqi.', hi: 'Koi baat nahi (shukriya ka jawab)', img: '😊', note: '不 bù ke baad 4th tone (kè) aaye to 不 "bú" ban jaata hai.' },
      { id: 'bas-duibuqi', zh: '对不起！', py: 'Duìbuqǐ!', hi: 'Sorry / maaf kijiye', img: '🙇', note: 'Asli galti ke liye: takkar, der se aana, kuch tod dena.' },
      { id: 'bas-meiguanxi', zh: '没关系。', py: 'Méi guānxi.', hi: 'Koi baat nahi (sorry ka jawab)', img: '👌', note: 'Koi "Duìbuqǐ" bole to jawab "Méi guānxi".' },
      { id: 'bas-buhaoyisi', zh: '不好意思。', py: 'Bù hǎoyìsi.', hi: 'Excuse me / thoda sa sorry', img: '😅', note: 'Waiter ko bulana, bheed mein raasta maangna, halki galti — sab mein "Bù hǎoyìsi". Duìbuqǐ se halka.' },
      { id: 'bas-zaijian', zh: '再见！', py: 'Zàijiàn!', hi: 'Alvida / phir milenge', img: '👋', note: 'Dono syllable Tone 4: dono ko upar se neeche girao.' },
    ],
    stages: [
      { type: 'learn' },
      {
        type: 'dialogue',
        title: 'Hotel ki front desk par',
        lines: [
          { who: 'staff', zh: '您好！', py: 'Nín hǎo!', hi: 'Namaste!' },
          { who: 'you', zh: '你好！', py: 'Nǐ hǎo!', hi: 'Namaste!', choices: [{ py: 'Zàijiàn!', hi: 'Alvida!', why: 'Abhi to pahunche ho. Alvida nahi, namaste bolo.' }] },
          { who: 'staff', zh: '这是您的房卡。', py: 'Zhè shì nín de fángkǎ.', hi: 'Yeh aapka room card hai.' },
          { who: 'you', zh: '谢谢！', py: 'Xièxie!', hi: 'Shukriya!', choices: [{ py: 'Duìbuqǐ!', hi: 'Sorry!', why: 'Staff ne room card diya hai. Sorry nahi, shukriya bolo.' }] },
          { who: 'staff', zh: '不客气。', py: 'Bú kèqi.', hi: 'Koi baat nahi.' },
          { who: 'you', zh: '再见！', py: 'Zàijiàn!', hi: 'Phir milenge!', choices: [{ py: 'Méi guānxi.', hi: 'Koi baat nahi.', why: '"Méi guānxi" sorry ka jawab hai. Jaate waqt "Zàijiàn" bolo.' }] },
        ],
      },
      { type: 'meaning', count: 5 },
      { type: 'match', count: 5 },
      {
        type: 'quiz',
        questions: [
          { q: 'Xiǎoyǔ ki mummy ne darwaza khola. Kaunsa namaste?', choices: [{ py: 'Nín hǎo!' }, { py: 'Nǐ hǎo!' }], answer: 0, why: '您 nín izzat wala "aap" hai. Bado aur GF ke parents ke liye hamesha "Nín hǎo".' },
          { q: 'Kisi ne aapko "Xièxie!" bola. Aapka jawab?', choices: [{ py: 'Bú kèqi.' }, { py: 'Méi guānxi.' }, { py: 'Duìbuqǐ.' }], answer: 0, why: '"Xièxie" (shukriya) ka jawab "Bú kèqi" (koi baat nahi). "Méi guānxi" sorry ka jawab hai.' },
          { q: 'Restaurant mein waiter ko bulana hai. Shuruaat kaise karoge?', choices: [{ py: 'Bù hǎoyìsi…' }, { py: 'Zàijiàn!' }, { py: 'Méi guānxi.' }], answer: 0, why: '"Bù hǎoyìsi" = excuse me. Waiter ko bulane ka sabse polite tareeka.' },
        ],
      },
      { type: 'recall', count: 5 },
    ],
  },
]);
