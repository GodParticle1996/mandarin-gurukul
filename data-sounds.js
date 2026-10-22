/* Track: 👄 Sounds — Format: BRIEF-CONTENT.md · Check: node validate.js --track sounds */
MG.registerLevels('sounds', [
  {
    id: 'snd-01', icon: '💨', title: 'Hawa se b/p, d/t, g/k alag karo',
    goal: 'Bina extra hawa aur hawa wale consonants ko pehchaan kar chhote travel phrases bolo.',
    scene: { img: '🥟💨🖐️', text: 'Breakfast counter par baozi order karne hain. English letters ki aadat Mandarin sounds ko badal sakti hai.', ask: 'Mandarin b aur p ka main farq kya hai?', choices: [
      { text: 'p ke saath zyada hawa nikalti hai.', ok: true, why: 'b mein hawa kam; p mein saaf hawa ka puff. Tone ko alag se sambhalo.' },
      { text: 'b hamesha Hindi ब ke bilkul barabar hai.', ok: false, why: 'Hindi cue sirf starting hint hai. Mandarin b ko Hindi ब jaisa voiced banana zaroori nahi.' },
    ] },
    phrases: [
      { id: 'snd-baozi', zh: '包子', py: 'Bāozi', hi: 'Bhaap mein paka hua stuffed bun', img: '🥟', note: 'b: hoth band, phir kam hawa. zi chhota, neutral tone.' },
      { id: 'snd-pao', zh: '跑', py: 'Pǎo', hi: 'Daudna', img: '🏃', note: 'p mein hoth khulte hi hawa ka puff. p English f nahi hai.' },
      { id: 'snd-dao-le', zh: '到了。', py: 'Dào le.', hi: 'Pahunch gaye.', img: '📍✅', note: 'd mein zubaan upar ke daanton ke peeche ridge par; hawa kam.' },
      { id: 'snd-tai-gui', zh: '太贵了。', py: 'Tài guì le.', hi: 'Bahut mehenga hai.', img: '💸😬', note: 't mein hawa ka puff. guì ke g mein hawa kam.' },
      { id: 'snd-gou-le', zh: '够了。', py: 'Gòu le.', hi: 'Kaafi hai.', img: '🍚✋', note: 'g ko English g samajhkar gale ki vibration force mat karo.' },
      { id: 'snd-keyi', zh: '可以。', py: 'Kěyǐ.', hi: 'Kar sakte hain / theek hai.', img: '👌', note: 'k: zubaan ka pichhla hissa release karo, saath mein hawa.' },
      { id: 'snd-bu-yao-pa', zh: '不要怕。', py: 'Bú yào pà.', hi: 'Daro mat.', img: '🤝😌', note: 'bú: agla yào Tone 4 hai. pà ka p hawa wala hai.' },
      { id: 'snd-kan-yixia', zh: '看一下。', py: 'Kàn yíxià.', hi: 'Zara dekhiye.', img: '👀', note: 'k hawa wala hai. yíxià mein 一, xià se pehle Tone 2 hai.' },
    ],
    stages: [
      { type: 'learn' },
      { type: 'explain', cards: [
        { h: 'Hindi se kaunsa starting hint milega?', text: 'b/p ≈ प/फ, g/k ≈ क/ख. फ ka matlab phal wala ph, English f nahi. Hindi sounds aur Mandarin sounds identical nahi hain.', visual: 'badges', tip: '💨 = hawa. b d g kam hawa; p t k hawa ka puff.' },
        { h: 'd aur t mein zubaan kahan rahegi?', text: 'Hindi त/थ sirf rough bridge hain. Mandarin d/t mein zubaan upar ke daanton ke peeche ridge ko touch karti hai. d kam hawa, t zyada hawa.', visual: 'mouth' },
        { h: 'Hawa ko kaise mehsoos karoge?', text: 'Hoth ke saamne hatheli rakho. p, t, k par hawa ka puff check karo. b, d, g par puff chhota rakho. Tone aur vowel ko badle bina consonant practice karo.', visual: 'badges' },
      ] },
      { type: 'dialogue', title: 'Breakfast counter par chhoti baat', lines: [
        { who: 'waiter', zh: '包子？', py: 'Bāozi?', hi: 'Stuffed bun chahiye?' },
        { who: 'you', zh: '看一下。', py: 'Kàn yíxià.', hi: 'Zara dekh loon.', choices: [ { py: 'Dào le.', hi: 'Pahunch gaye.', why: 'Bun dekhna hai. Dào le pahunchne ki baat hai.' } ] },
        { who: 'waiter', zh: '可以。', py: 'Kěyǐ.', hi: 'Bilkul.' },
        { who: 'you', zh: '够了，谢谢。', py: 'Gòu le, xièxie.', hi: 'Kaafi hai, shukriya.' },
      ] },
      { type: 'meaning', count: 5 },
      { type: 'bins', q: 'Shuruaat ke consonant mein hawa ka puff hai?', bins: [ { id: 'low', label: 'Kam hawa: b d g' }, { id: 'puff', label: '💨 Zyada hawa: p t k' } ], items: [
        { py: 'Bāozi', bin: 'low' }, { py: 'Pǎo', bin: 'puff' }, { py: 'Dào le.', bin: 'low' }, { py: 'Tài guì le.', bin: 'puff' }, { py: 'Gòu le.', bin: 'low' }, { py: 'Kěyǐ.', bin: 'puff' },
      ] },
      { type: 'recall', count: 5 },
      { type: 'quiz', questions: [
        { q: 'Mandarin p practice karte waqt hatheli par kya check karoge?', choices: [ 'Hoth khulte hi hawa ka puff', 'Neeche ke hoth ko daanton se dabana' ], answer: 0, why: 'p mein dono hoth release hote hain aur hawa nikalti hai. Hoth-daant wali position f ki taraf le jaati hai.' },
        { q: 'Taxi destination par pahunch gayi. Kaunsa phrase?', choices: [ { py: 'Dào le.' }, { py: 'Tài guì le.' }, { py: 'Pǎo.' } ], answer: 0, why: 'Dào le = pahunch gaye. Tài guì le price par comment hai; pǎo ka matlab daudna hai.' },
        { q: 'b ko Hindi ब ki exact copy maan lena sahi hai?', choices: [ 'Nahi; Mandarin b kam hawa wala hai, Hindi cue approximate hai.', 'Haan; English spelling har Mandarin sound bata deti hai.' ], answer: 0, why: 'Mandarin b/p ka main contrast hawa hai. English letters ya Hindi akshar exact pronunciation ki guarantee nahi dete.' },
      ] },
    ],
  },
  {
    id: 'snd-02', icon: '👅', title: 'j q x aur zh ch sh: zubaan ka map',
    goal: 'Zubaan aage aur zubaan thodi peeche wale sounds ko travel phrases mein alag rakho.',
    scene: { img: '🍵👅💬', text: 'Chai ki dukaan par sawaal poochna hai. Qǐng aur chī ke consonants ko ek hi sound bana dena aasaan hai.', ask: 'j q x mein zubaan ki tip kahan rakhen?', choices: [
      { text: 'Neeche ke saamne wale daanton ke paas.', ok: true, why: 'j q x mein tip neeche, zubaan ka aage wala hissa upar uthta hai.' },
      { text: 'Zubaan ki tip ko bahut peeche modo.', ok: false, why: 'j q x ka target aage hai. zh ch sh mein tip thodi peeche jaati hai; bahut curl karna zaroori nahi.' },
    ] },
    phrases: [
      { id: 'snd-ji-dian', zh: '几点？', py: 'Jǐ diǎn?', hi: 'Kitne baje?', img: '🕒❓', note: 'j mein hawa kam. English j ki exact copy nahi.' },
      { id: 'snd-qing-jin', zh: '请进。', py: 'Qǐng jìn.', hi: 'Andar aaiye.', img: '🚪👋', who: 'staff', note: 'q mein hawa ka puff; j mein kam hawa. Dono mein tip neeche.' },
      { id: 'snd-xiexie', zh: '谢谢。', py: 'Xièxie.', hi: 'Shukriya.', img: '🙏', note: 'x English ks nahi. Halki hiss, tip neeche; doosra xie neutral.' },
      { id: 'snd-zhongguo', zh: '中国', py: 'Zhōngguó', hi: 'China', img: '🇨🇳', note: 'zh mein zubaan ki tip thodi peeche. j se mouth position alag hai.' },
      { id: 'snd-chifan', zh: '吃饭', py: 'Chīfàn', hi: 'Khana khana', img: '🍚🥢', note: 'ch hawa wala hai. chī ka i Hindi ई nahi hai.' },
      { id: 'snd-duoshao-qian', zh: '多少钱？', py: 'Duōshao qián?', hi: 'Kitne paise?', img: '🏷️❓', note: 'shao mein tip thodi peeche; qián mein tip neeche aur hawa.' },
      { id: 'snd-zhe-shi-cha', zh: '这是茶。', py: 'Zhè shì chá.', hi: 'Yeh chai hai.', img: '🍵', note: 'zh aur ch same mouth family; ch mein zyada hawa. shì ko shee mat banao.' },
      { id: 'snd-xue-zhongwen', zh: '我学中文。', py: 'Wǒ xué Zhōngwén.', hi: 'Main Mandarin seekhta/seekhti hoon.', img: '🧑🏽📚', note: 'xué ka u, ü family ka sound hai. Zhōngwén mein zh thoda peeche.' },
    ],
    stages: [
      { type: 'learn' },
      { type: 'explain', cards: [
        { h: 'j q x ke liye mouth kaise set karein?', text: 'Tip neeche ke saamne wale daanton ke paas rakho; zubaan ka aage wala hissa upar uthao. j kam hawa, q hawa wala, x mein halki hiss. Hindi च/छ/श sirf rough cues hain.', visual: 'mouth' },
        { h: 'zh ch sh mein kya badlega?', text: 'Zubaan ki tip thodi upar aur peeche. zh kam hawa; ch hawa wala; sh mein hiss. Hindi ke peeche wale sounds ek starting bridge hain, exact Mandarin sounds nahi.', visual: 'badges' },
        { h: 'shí aur sì ka farq kyun bachana hai?', text: 'shí = das; sì = chaar. sh mein tip peeche, s mein aage. shí ka i lamba ई nahi. Das aur chaar ke tone bhi alag hain.', ex: [ { zh: '十', py: 'Shí', hi: 'Das' }, { zh: '四', py: 'Sì', hi: 'Chaar' } ], visual: 'mouth' },
      ] },
      { type: 'dialogue', title: 'Chai ki dukaan mein sawaal', lines: [
        { who: 'staff', zh: '请进。', py: 'Qǐng jìn.', hi: 'Andar aaiye.' },
        { who: 'you', zh: '这是茶吗？', py: 'Zhè shì chá ma?', hi: 'Kya yeh chai hai?', choices: [ { py: 'Jǐ diǎn?', hi: 'Kitne baje?', why: 'Cup mein kya hai poochna hai. Jǐ diǎn waqt ka sawaal hai.' } ] },
        { who: 'staff', zh: '是。', py: 'Shì.', hi: 'Haan, chai hai.' },
        { who: 'you', zh: '多少钱？', py: 'Duōshao qián?', hi: 'Kitne paise?' },
        { who: 'staff', zh: '十块。', py: 'Shí kuài.', hi: 'Das yuan.' },
      ] },
      { type: 'meaning', count: 5 },
      { type: 'bins', q: 'Pehle consonant ke liye zubaan ki tip ka target chunno.', bins: [ { id: 'front', label: 'j q x: tip neeche/aage' }, { id: 'back', label: 'zh ch sh: tip thodi peeche' } ], items: [
        { py: 'Jǐ', bin: 'front' }, { py: 'Qǐng', bin: 'front' }, { py: 'Xiè', bin: 'front' }, { py: 'Zhōng', bin: 'back' }, { py: 'Chī', bin: 'back' }, { py: 'Shì', bin: 'back' },
      ] },
      { type: 'recall', count: 5 },
      { type: 'quiz', questions: [
        { q: 'q aur j ka basic farq kya hai?', choices: [ 'q mein zyada hawa; j mein kam hawa.', 'q mein tip peeche; j mein tip bhi peeche.' ], answer: 0, why: 'q/j same front mouth family hain, hawa ka farq rakho. Tip peeche le jaane se zh/ch family ki taraf chale jaoge.' },
        { q: 'Price das yuan hai. Sahi pinyin?', choices: [ { py: 'Shí kuài.' }, { py: 'Sì kuài.' } ], answer: 0, why: 'Shí das hai; sì chaar hai. Consonant aur tone dono par dhyaan do.' },
        { q: 'x ko English x ki tarah ks bolna chahiye?', choices: [ 'Nahi; x mein ek soft hiss hai.', 'Haan; Xièxie ko ksee-ksee bolo.' ], answer: 0, why: 'Mandarin x ek consonant hai. Extra k jodne se word ka sound bigadta hai.' },
      ] },
    ],
  },
  {
    id: 'snd-03', icon: '😗', title: 'ü, e aur -n/-ng: chhote mouth moves',
    goal: 'ü ka mouth shape banao aur rice/room jaise words ke endings alag pehchaano.',
    scene: { img: '🍚🏨😗', text: 'Hotel mein room chahiye, restaurant mein rice. Fángjiān aur fàn ke aakhri sounds ek jaise nahi hain.', ask: 'ü banane ka useful starting move?', choices: [
      { text: 'ई wali zubaan rakhkar hoth gol karo.', ok: true, why: 'Zubaan aage aur hoth gol: ü ka useful starting shape. Hindi ऊ ki exact copy mat banao.' },
      { text: 'Har u ko Hindi ऊ ki exact copy banao.', ok: false, why: 'qù, yǔ aur xué mein ü family hai. Mandarin u aur ü alag sounds hain.' },
    ] },
    phrases: [
      { id: 'snd-wo-qu', zh: '我去。', py: 'Wǒ qù.', hi: 'Main jaaunga/jaaungi.', img: '🚶📍', note: 'qù mein dots nahi likhe, par vowel ü hai. Hoth gol, zubaan aage.' },
      { id: 'snd-xia-yu', zh: '下雨了。', py: 'Xià yǔ le.', hi: 'Baarish shuru ho gayi.', img: '🌧️', note: 'yǔ mein ü sound chhupa hai. yǔ ko English you mat banao.' },
      { id: 'snd-lvcha', zh: '绿茶', py: 'Lǜchá', hi: 'Green tea', img: '🍵🌿', note: 'lǜ mein dots rehte hain. lù (路: road) alag word aur alag vowel hai.' },
      { id: 'snd-wo-e', zh: '我饿了。', py: 'Wǒ è le.', hi: 'Mujhe bhookh lagi hai.', img: '😋🍽️', note: 'è ke hoth gol nahi. Zubaan peeche; Hindi ए ki exact copy nahi.' },
      { id: 'snd-he-shui', zh: '喝水', py: 'Hē shuǐ', hi: 'Paani peena', img: '🥛', note: 'hē ka e ek vowel hai; extra ए-ई slide mat jodo.' },
      { id: 'snd-mifan', zh: '米饭', py: 'Mǐfàn', hi: 'Paka hua rice', img: '🍚', note: 'fàn ka final -n: zubaan ki tip upar ridge ko touch karti hai.' },
      { id: 'snd-fangjian', zh: '房间', py: 'Fángjiān', hi: 'Room', img: '🏨🚪', note: 'fáng ka -ng: zubaan ka pichhla hissa upar. Extra g release nahi.' },
      { id: 'snd-beijing', zh: '北京', py: 'Běijīng', hi: 'Beijing', img: '🏯📍', note: 'jīng ka -ng pichhle mouth mein khatam hota hai; jing-uh mat bolo.' },
    ],
    stages: [
      { type: 'learn' },
      { type: 'explain', cards: [
        { h: 'ü ke dots kab gayab hote hain?', text: 'ई wali zubaan rakhkar hoth gol karo: ü ka starting shape. j q x ke baad dots nahi likhte: qù, xué. yu bhi ü family hai. nǚ aur lǜ mein dots zaroori hain.', visual: 'mouth' },
        { h: 'e Hindi ए kyun nahi hai?', text: 'è aur hē mein hoth gol nahi hote, zubaan peeche rehti hai. English uh sirf rough hint hai. Gala dabao mat; relaxed vowel banao.', visual: 'mouth', tip: 'Hindi hints sound ke paas le jaate hain; exact pronunciation ke liye baad mein audio aur feedback chahiye.' },
        { h: '-n aur -ng ka end kahan hota hai?', text: '-n: zubaan ki tip upar ridge par. -ng: zubaan ka pichhla hissa upar, rang ke aakhri sound jaisa rough hint. -ng ke baad extra ग ya vowel mat jodo.', visual: 'mouth', ex: [ { zh: '饭', py: 'Fàn', hi: 'Rice / khana' }, { zh: '房', py: 'Fáng', hi: 'Room se juda word' } ] },
      ] },
      { type: 'dialogue', title: 'Baarish ke din café mein', lines: [
        { who: 'gf', zh: '下雨了。', py: 'Xià yǔ le.', hi: 'Baarish shuru ho gayi.' },
        { who: 'you', zh: '我饿了。', py: 'Wǒ è le.', hi: 'Mujhe bhookh lagi hai.', choices: [ { py: 'Wǒ qù.', hi: 'Main jaaunga/jaaungi.', why: 'Bhookh batani hai. Wǒ qù jaane ka decision hai.' } ] },
        { who: 'gf', zh: '吃米饭吗？', py: 'Chī mǐfàn ma?', hi: 'Rice khaana hai?' },
        { who: 'you', zh: '好，喝绿茶。', py: 'Hǎo, hē lǜchá.', hi: 'Theek hai, green tea piyenge.' },
      ] },
      { type: 'meaning', count: 5 },
      { type: 'match', count: 5 },
      { type: 'recall', count: 5 },
      { type: 'quiz', questions: [
        { q: 'qù ke u ka mouth shape kaunsa hai?', choices: [ 'ü: zubaan aage, hoth gol', 'Hindi ऊ ki hamesha exact copy' ], answer: 0, why: 'q ke baad ü ke dots nahi likhte. Spelling ka u dekhkar vowel ko ordinary u banana galat hoga.' },
        { q: 'Room ka word kaunsa hai?', choices: [ { py: 'Fángjiān' }, { py: 'Mǐfàn' }, { py: 'Lǜchá' } ], answer: 0, why: 'Fángjiān = room. Mǐfàn rice hai; lǜchá green tea hai. Fáng mein -ng ka end peeche hai.' },
        { q: 'Běijīng ke end par kya karna hai?', choices: [ 'Naak wali -ng ending par rukna hai.', 'Ek saaf g aur extra uh bolna hai.' ], answer: 0, why: '-ng ek ending sound hai. Extra g release aur extra vowel se syllable badal jaata hai.' },
      ] },
    ],
  },
]);
