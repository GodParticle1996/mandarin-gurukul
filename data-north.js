/* Track: 🧣 North China — Format: BRIEF-CONTENT.md · Check: node validate.js --track north */
MG.registerLevels('north', [
  {
    id: 'nth-01', icon: '🧣', title: 'Ghar par izzat, madad aur mausam',
    goal: 'Parents ko politely greet karo, ghar ka rule poochho aur chhoti weather baat karo.',
    scene: { img: '🚪👩🏻🥿', text: 'Xiǎoyǔ ke parents ke ghar pehli baar aaye ho. Darwaze par slippers rakhe hain. Har ghar ka routine alag ho sakta hai.', ask: 'Pehli greeting mein kaunsa aap use karoge?', choices: [
      { py: 'Nín hǎo!', ok: true, why: 'nín izzat wala aap hai. Parents ke saath polite starting choice.' },
      { py: 'Nǐ qù nǎr?', ok: false, why: 'Nǐ qù nǎr? kahan jaa rahe ho poochta hai. Pehli greeting ke liye Nín hǎo bolo.' },
    ] },
    phrases: [
      { id: 'nth-nin-hao', zh: '您好！', py: 'Nín hǎo!', hi: 'Namaste!', img: '🙏👋', note: 'Parents ko Shūshu / Āyí kehkar greet kar sakte ho. nín izzat wala aap.' },
      { id: 'nth-slippers', zh: '要换拖鞋吗？', py: 'Yào huàn tuōxié ma?', hi: 'Kya slippers pehen loon?', img: '👞➡️🥿', note: 'Ghar ka rule poochho. Har Chinese ghar mein same footwear routine assume mat karo.' },
      { id: 'nth-help-you', zh: '我来帮您。', py: 'Wǒ lái bāng nín.', hi: 'Main aapki madad kar deta/deti hoon.', img: '🙋🤝', note: 'Madad offer karo. Host mana kare to host ki preference maan sakte ho.' },
      { id: 'nth-rest', zh: '您歇着吧。', py: 'Nín xiēzhe ba.', hi: 'Aap aaraam kijiye.', img: '🛋️😌', note: 'Madad offer karte waqt warm line. zhe aur ba chhote neutral syllables.' },
      { id: 'nth-cold-today', zh: '今天真冷。', py: 'Jīntiān zhēn lěng.', hi: 'Aaj sach mein bahut thand hai.', img: '🥶❄️', note: 'Mausam ki simple baat. Temperature ko har city ya season mein same assume mat karo.' },
      { id: 'nth-warm', zh: '很暖和。', py: 'Hěn nuǎnhuo.', hi: 'Kaafi garam aur comfortable hai.', img: '🏠☀️', note: 'nuǎnhuo cozy warm hai; scorching hot nahi. huo neutral hai.' },
      { id: 'nth-wait-moment', zh: '我等一会儿。', py: 'Wǒ děng yíhuìr.', hi: 'Main thodi der rukta/rukti hoon.', img: '⏳', note: 'huìr ek syllable hai. 一, huì se pehle yí ho jaata hai.' },
      { id: 'nth-no-problem', zh: '没事儿。', py: 'Méi shìr.', hi: 'Koi dikkat nahi / theek hai.', img: '👌😌', note: 'Northern casual form. Méi shì bhi natural standard Mandarin hai.' },
    ],
    stages: [
      { type: 'learn' },
      { type: 'explain', cards: [
        { h: 'Parents ko kaise address karein?', text: 'Shūshu = uncle; Āyí = aunty. Nín izzat wala aap hai. Pehli mulaqat mein warm aur polite raho. Family ki preference samajhkar address adjust kar sakte ho.' },
        { h: 'Slippers aur madad ka fixed rule hai?', text: 'Har ghar ka routine alag hai. Slippers poochho, madad offer karo, host ki preference maan lo. Khana, drink ya household routine ko compulsory Chinese custom mat samjho.' },
        { h: 'Erhua ka r kaise jodega?', text: 'shìr aur huìr mein r pichhle syllable ka hissa hai. Alag er syllable mat jodo. Erhua northern speech mein common hai; har word mein r lagana zaroori nahi.', visual: 'mouth' },
      ] },
      { type: 'dialogue', title: 'Thande din parents ke ghar', lines: [
        { who: 'you', zh: '阿姨，您好！', py: 'Āyí, nín hǎo!', hi: 'Aunty, namaste!', choices: [ { py: 'Zàijiàn!', hi: 'Phir milenge!', why: 'Abhi ghar aaye ho. Greeting chahiye; zàijiàn vida lete waqt hai.' } ] },
        { who: 'mom', zh: '快请进。', py: 'Kuài qǐng jìn.', hi: 'Aaiye, andar aaiye.' },
        { who: 'you', zh: '要换拖鞋吗？', py: 'Yào huàn tuōxié ma?', hi: 'Kya slippers pehen loon?' },
        { who: 'mom', zh: '要。', py: 'Yào.', hi: 'Haan.' },
        { who: 'you', zh: '今天真冷。', py: 'Jīntiān zhēn lěng.', hi: 'Aaj bahut thand hai.' },
        { who: 'dad', zh: '进来吧。', py: 'Jìnlái ba.', hi: 'Andar aao.' },
      ] },
      { type: 'meaning', count: 5 },
      { type: 'match', count: 5 },
      { type: 'recall', count: 5 },
      { type: 'quiz', questions: [
        { q: 'Āyí kitchen mein kaam kar rahi hain. Madad offer kaise karoge?', choices: [ { py: 'Wǒ lái bāng nín.' }, { py: 'Jīntiān zhēn lěng.' }, { py: 'Wǒ děng yíhuìr.' } ], answer: 0, why: 'Wǒ lái bāng nín seedhi polite help offer hai. Mausam ki baat aur rukne ki line help offer nahi hain.' },
        { q: 'Slippers dikhne par beginner ka useful next step?', choices: [ 'Host se slippers ka rule poochhna.', 'Har Chinese ghar ka rule same maan lena.' ], answer: 0, why: 'Ghar ke routines badalte hain. Yào huàn tuōxié ma? se sawaal clear aur polite rehta hai; national rule assume nahi karna padta.' },
        { q: 'Méi shìr ka final r kya hai?', choices: [ 'shì ke saath juda hua northern ending', 'Ek alag, poora er syllable' ], answer: 0, why: 'Erhua mein r pichhle syllable se judta hai. Méi shì-er jaisa extra syllable target nahi hai.' },
      ] },
    ],
  },
  {
    id: 'nth-02', icon: '🗨️', title: 'Regional baat pehchaano, standard bolo',
    goal: 'Kuch northern phrases ka matlab pehchaano aur samajh na aaye to standard Mandarin maango.',
    scene: { img: '👵🏻💬❓', text: 'Family gathering mein ek relative regional expression bolte hain. Har expression ko copy karna zaroori nahi; matlab clear karna kaafi useful hai.', ask: 'Regional speech samajh nahi aayi. Safe request?', choices: [
      { py: 'Qǐng shuō pǔtōnghuà.', ok: true, why: 'Standard Mandarin ki polite request hai. Regional slang bolne ki acting zaroori nahi.' },
      { py: 'Zéi hǎo!', ok: false, why: 'Zéi hǎo ka matlab bahut achha hai. Confusion ko clear nahi karta; familiar tone har setting mein fit nahi hoti.' },
    ] },
    phrases: [
      { id: 'nth-where-going', zh: '你去哪儿？', py: 'Nǐ qù nǎr?', hi: 'Tum kahan jaa rahe/rahi ho?', img: '🚶📍❓', who: 'gf', note: 'nǎr northern speech mein common; nǎlǐ bhi standard aur widely understood.' },
      { id: 'nth-here', zh: '在这儿。', py: 'Zài zhèr.', hi: 'Yahan hai.', img: '👇📍', note: 'zhèr ka r juda hua hai. Zài zhèlǐ bhi natural standard Mandarin.' },
      { id: 'nth-laoke', zh: '唠嗑', py: 'Làokē', hi: 'Gupshup karna', img: '👵🏻💬', who: 'nainai', note: 'Northern/Dongbei expression: pehchaanne ke liye. Apni speech mein liáotiān bol sakte ho.' },
      { id: 'nth-zei-hao', zh: '贼好！', py: 'Zéi hǎo!', hi: 'Bahut achha!', img: '🤩👍', who: 'dawei', note: 'Northern/Dongbei casual expression: pehchaanne ke liye. Zéi yahan very ka kaam karta hai.' },
      { id: 'nth-za-ban', zh: '咋办？', py: 'Zǎ bàn?', hi: 'Ab kya karein?', img: '🤷❓', who: 'dawei', note: 'Casual regional zǎ = kaise. Pehchaano; standard zěnme bàn? bolna kaafi hai.' },
      { id: 'nth-pretty-good', zh: '挺好的。', py: 'Tǐng hǎo de.', hi: 'Kaafi achha hai.', img: '👍🙂', note: 'Standard Mandarin mein bhi common. Har casual phrase dialect nahi hota.' },
      { id: 'nth-no-rush', zh: '不用急。', py: 'Bú yòng jí.', hi: 'Jaldi karne ki zaroorat nahi.', img: '⏳😌', note: 'Widely used standard Mandarin. yòng Tone 4 se pehle 不 bú hota hai.' },
      { id: 'nth-standard-request', zh: '请说普通话。', py: 'Qǐng shuō pǔtōnghuà.', hi: 'Please standard Mandarin mein boliye.', img: '🙋💬', note: 'Regional speech samajh na aaye to polite request. Accent ka mazaak mat banao.' },
    ],
    stages: [
      { type: 'learn' },
      { type: 'explain', cards: [
        { h: 'Regional words bolna compulsory hai?', text: 'Nahi. Làokē, zéi hǎo aur zǎ bàn pehchaanne ke liye hain. Apni speech mein liáotiān, hěn hǎo aur zěnme bàn use kar sakte ho. Standard Mandarin ko priority do.' },
        { h: 'Har northern speaker same kyun nahi bolega?', text: 'City, umar, family aur person se vocabulary aur accent badalte hain. Beijing aur Dongbei ek hi accent nahi hain. Regional phrases ko kisi person ki fixed aadat mat maano.' },
        { h: 'Samajh na aaye to next move kya hai?', text: 'Qǐng shuō pǔtōnghuà se standard Mandarin maango. Zaroorat par Qǐng shuō màn yìdiǎnr: zara dheere boliye. Regional word copy karne se pehle meaning confirm karo.', ex: [ { zh: '请说慢一点儿。', py: 'Qǐng shuō màn yìdiǎnr.', hi: 'Zara dheere boliye.' } ] },
      ] },
      { type: 'dialogue', title: 'Regional word par meaning clear karna', lines: [
        { who: 'nainai', zh: '唠嗑。', py: 'Làokē.', hi: 'Gupshup karte hain.' },
        { who: 'you', zh: '请说普通话。', py: 'Qǐng shuō pǔtōnghuà.', hi: 'Please standard Mandarin mein boliye.', choices: [ { py: 'Zéi hǎo!', hi: 'Bahut achha!', why: 'Meaning clear nahi hai. Zéi hǎo praise hai; standard Mandarin ki request nahi.' } ] },
        { who: 'gf', zh: '聊天。', py: 'Liáotiān.', hi: 'Gupshup karna.' },
        { who: 'you', zh: '好，谢谢。', py: 'Hǎo, xièxie.', hi: 'Theek hai, shukriya.' },
      ] },
      { type: 'meaning', count: 6 },
      { type: 'match', count: 5 },
      { type: 'recall', count: 5 },
      { type: 'quiz', questions: [
        { q: 'Relative Làokē bolte hain. Meaning kya hai?', choices: [ 'Gupshup karna', 'Kitne paise?', 'Jaldi karna' ], answer: 0, why: 'Làokē casual chat hai. Standard alternative liáotiān hai; price ya rushing ki baat nahi.' },
        { q: 'Zǎ bàn? samajh aaya. Standard Mandarin mein kaunsa equivalent?', choices: [ { py: 'Zěnme bàn?' }, { py: 'Nǐ qù nǎr?' }, { py: 'Tǐng hǎo de.' } ], answer: 0, why: 'Zǎ bàn aur zěnme bàn dono kya karein/kaise handle karein poochte hain. Nǎr destination hai; tǐng hǎo de praise hai.' },
        { q: 'Regional vocabulary ka beginner goal kya hai?', choices: [ 'Meaning pehchaano; apne jawab ke liye standard Mandarin use karo.', 'Har family member ko same slang se address karo.' ], answer: 0, why: 'Meaning pehchaanne se conversation follow karna aasaan hota hai. Slang ka fit relationship aur context par depend karta hai; sab par same slang force mat karo.' },
      ] },
    ],
  },
]);
