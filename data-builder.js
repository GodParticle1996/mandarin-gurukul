/* Track: 🧩 Sentence Builder — Format: BRIEF-CONTENT.md · Check: node validate.js --track builder */
MG.registerLevels('builder', [
  {
    id: 'bld-01', icon: '🧩', title: 'Apni line aur apna sawaal banao',
    goal: 'Who + when + where + action ka order use karke chhoti baat aur sawaal banao.',
    scene: { img: '📅🏠🍚', text: 'Xiǎoyǔ kal ka plan pooch rahi hai. Hindi ka word order seedha copy karoge to Mandarin sentence ulajh sakta hai.', ask: 'Main kal Beijing jaaunga/jaaungi ka natural order?', choices: [
      { py: 'Wǒ míngtiān qù Běijīng.', ok: true, why: 'Main + kal + jaana + Beijing. Time action se pehle; destination qù ke baad.' },
      { py: 'Wǒ Běijīng míngtiān qù.', ok: false, why: 'Hindi ka destination-before-verb order qù wale simple Mandarin sentence mein copy mat karo.' },
    ] },
    phrases: [
      { id: 'bld-indian', zh: '我是印度人。', py: 'Wǒ shì Yìndù rén.', hi: 'Main Indian hoon.', img: '🧑🏽🇮🇳', lit: 'Main + hoon + India ka insaan' },
      { id: 'bld-tomorrow-beijing', zh: '我明天去北京。', py: 'Wǒ míngtiān qù Běijīng.', hi: 'Main kal Beijing jaaunga/jaaungi.', img: '📅🚆🏯', lit: 'Main + kal + jaana + Beijing' },
      { id: 'bld-home-meal', zh: '我今天在家吃饭。', py: 'Wǒ jīntiān zài jiā chīfàn.', hi: 'Main aaj ghar par khana khaaunga/khaaungi.', img: '📅🏠🍚', note: 'Context se aaj ka plan samajh aata hai. Verb ko future ending nahi lagti.' },
      { id: 'bld-indian-question', zh: '你是印度人吗？', py: 'Nǐ shì Yìndù rén ma?', hi: 'Kya tum Indian ho?', img: '🇮🇳❓', note: 'Statement ke end mein halka ma lagao: yes/no sawaal.' },
      { id: 'bld-where-go', zh: '你去哪儿？', py: 'Nǐ qù nǎr?', hi: 'Tum kahan jaa rahe/rahi ho?', img: '🚶📍❓', note: 'nǎr destination ki jagah aata hai. End mein ma mat jodo.' },
      { id: 'bld-what-eat', zh: '你吃什么？', py: 'Nǐ chī shénme?', hi: 'Tum kya khaaoge/khaaogi?', img: '🍽️❓', note: 'shénme khaane ki cheez ki jagah par hai.' },
      { id: 'bld-when-come', zh: '你几点来？', py: 'Nǐ jǐ diǎn lái?', hi: 'Tum kitne baje aaoge/aaogi?', img: '🕒🚶❓', note: 'Time ka sawaal jǐ diǎn action lái se pehle.' },
      { id: 'bld-go-not-go', zh: '你去不去？', py: 'Nǐ qù bu qù?', hi: 'Tum jaaoge/jaaogi ya nahi?', img: '🚶✅❌', note: 'Action + bu + action ek yes/no pattern hai. Beech ka bu halka; end mein ma nahi.' },
    ],
    stages: [
      { type: 'learn' },
      { type: 'explain', cards: [
        { h: 'Sentence ke blocks kis order mein rakhein?', text: 'Simple template: kaun + kab + kahan par + action + kya. Wǒ jīntiān zài jiā chīfàn. Jaane ki destination alag: qù Běijīng = Beijing jaana.' },
        { h: 'Har sawaal ke end mein ma lagega?', text: 'Yes/no ke liye statement + ma: Nǐ shì Yìndù rén ma? Kahan/kya wale sawaal mein nǎr/shénme answer ki jagah lete hain. Nǐ qù nǎr? mein ma nahi chahiye.' },
        { h: 'qù bu qù kaise kaam karta hai?', text: 'Action + bu + action = karoge ya nahi? Nǐ qù bu qù? ek complete sawaal hai. qù bu qù ke end mein ma jodkar dono patterns mix mat karo.' },
      ] },
      { type: 'dialogue', title: 'Xiǎoyǔ ke saath kal ka plan', lines: [
        { who: 'gf', zh: '你明天去哪儿？', py: 'Nǐ míngtiān qù nǎr?', hi: 'Tum kal kahan jaa rahe/rahi ho?' },
        { who: 'you', zh: '我明天去北京。', py: 'Wǒ míngtiān qù Běijīng.', hi: 'Main kal Beijing jaaunga/jaaungi.', choices: [ { py: 'Nǐ chī shénme?', hi: 'Tum kya khaaoge/khaaogi?', why: 'Destination ka jawab dena hai. Khaane ka sawaal kal ki destination nahi batata.' } ] },
        { who: 'gf', zh: '你几点来？', py: 'Nǐ jǐ diǎn lái?', hi: 'Tum kitne baje aaoge/aaogi?' },
        { who: 'you', zh: '我三点来。', py: 'Wǒ sān diǎn lái.', hi: 'Main teen baje aaunga/aaungi.' },
      ] },
      { type: 'build', items: [
        { zh: '我明天去北京。', py: 'Wǒ míngtiān qù Běijīng.', hi: 'Main kal Beijing jaaunga/jaaungi.', blocks: [ 'Wǒ', 'míngtiān', 'qù', 'Běijīng' ] },
        { zh: '我今天在家吃饭。', py: 'Wǒ jīntiān zài jiā chīfàn.', hi: 'Main aaj ghar par khana khaaunga/khaaungi.', blocks: [ 'Wǒ', 'jīntiān', 'zài jiā', 'chīfàn' ] },
        { zh: '你吃什么？', py: 'Nǐ chī shénme?', hi: 'Tum kya khaaoge/khaaogi?', blocks: [ 'Nǐ', 'chī', 'shénme' ] },
      ] },
      { type: 'meaning', count: 5 },
      { type: 'recall', count: 5 },
      { type: 'quiz', questions: [
        { q: 'Dost ki destination poochni hai. Kaunsa sawaal?', choices: [ { py: 'Nǐ qù nǎr?' }, { py: 'Nǐ shì Yìndù rén ma?' }, { py: 'Nǐ jǐ diǎn lái?' } ], answer: 0, why: 'nǎr = kahan. Yìndù rén nationality poochta hai; jǐ diǎn aane ka waqt poochta hai.' },
        { q: 'Kal Beijing jaana hai. Natural word order?', choices: [ { py: 'Wǒ míngtiān qù Běijīng.' }, { py: 'Wǒ Běijīng míngtiān qù.' } ], answer: 0, why: 'Time action se pehle aur destination qù ke baad. Hindi ka verb-at-end order seedha copy karna yahan kaam nahi karta.' },
        { q: 'Jaana hai ya nahi? Sahi sawaal chunno.', choices: [ { py: 'Nǐ qù bu qù?' }, { py: 'Nǐ qù bu qù ma?' } ], answer: 0, why: 'qù bu qù pehle se yes/no pattern hai. A-not-A aur ma ko ek sawaal mein mix mat karo.' },
      ] },
    ],
  },
  {
    id: 'bld-02', icon: '🙋', title: 'Chahiye, kar sakta hoon, nahi hua',
    goal: 'Want, permission, ability aur nahi ke liye sahi chhota pattern chunno.',
    scene: { img: '🍵💺🙋', text: 'Café mein seat khaali dikh rahi hai. Baithne ki permission poochni hai.', ask: 'Kaunsa sawaal seat ki permission maangta hai?', choices: [
      { py: 'Wǒ kěyǐ zuò zhèr ma?', ok: true, why: 'kěyǐ permission poochne ka useful choice hai: kya main yahan baith sakta/sakti hoon?' },
      { py: 'Wǒ huì shuō yìdiǎnr Zhōngwén.', ok: false, why: 'huì shuō learned speaking skill batata hai. Seat par baithne ki permission nahi poochta.' },
    ] },
    phrases: [
      { id: 'bld-want-go', zh: '我想去北京。', py: 'Wǒ xiǎng qù Běijīng.', hi: 'Main Beijing jaana chahta/chahti hoon.', img: '💭🏯', note: 'xiǎng + action: karne ki ichchha. Plan ko softly batane mein useful.' },
      { id: 'bld-want-tea', zh: '我要一杯茶。', py: 'Wǒ yào yì bēi chá.', hi: 'Mujhe ek cup chai chahiye.', img: '🙋🍵', note: 'yào + cheez: order ke liye. Polite tone aur qǐng se request soft kar sakte ho.' },
      { id: 'bld-can-speak', zh: '我会说一点儿中文。', py: 'Wǒ huì shuō yìdiǎnr Zhōngwén.', hi: 'Mujhe thodi Mandarin bolni aati hai.', img: '💬🤏', note: 'huì + action: seekhi hui skill. yìdiǎnr = thodi.' },
      { id: 'bld-may-sit', zh: '我可以坐这儿吗？', py: 'Wǒ kěyǐ zuò zhèr ma?', hi: 'Kya main yahan baith sakta/sakti hoon?', img: '💺❓', note: 'kěyǐ se permission pooch rahe ho.' },
      { id: 'bld-can-help', zh: '您能帮我吗？', py: 'Nín néng bāng wǒ ma?', hi: 'Kya aap meri madad kar sakte hain?', img: '🙋🤝', note: 'néng: ability ya situation allow karti hai? nín izzat wala aap hai.' },
      { id: 'bld-no-meat', zh: '我不吃肉。', py: 'Wǒ bù chī ròu.', hi: 'Main meat nahi khaata/khaati.', img: '🥩🚫', note: 'bù se diet ki aadat ya choice ka inkaar. bù + chī mein Tone 4 rehta hai.' },
      { id: 'bld-not-eaten', zh: '我没吃饭。', py: 'Wǒ méi chīfàn.', hi: 'Maine khana nahi khaaya.', img: '🍚🚫', note: 'méi: khana khane ka kaam hua nahi. Diet ki permanent choice nahi batata.' },
      { id: 'bld-no-cash', zh: '我没有现金。', py: 'Wǒ méiyǒu xiànjīn.', hi: 'Mere paas cash nahi hai.', img: '💵🚫', note: 'yǒu ka negative méiyǒu hai. bù yǒu mat bolo.' },
    ],
    stages: [
      { type: 'learn' },
      { type: 'explain', cards: [
        { h: 'xiǎng aur yào ko kaise choose karein?', text: 'xiǎng + action: karna chahta/chahti hoon. yào + cheez: chahiye, jaise tea order. yào context mein intention ya need bhi ho sakta hai; har jagah ek Hindi meaning force mat karo.' },
        { h: 'huì, néng aur kěyǐ mein useful farq?', text: 'huì: seekhi skill, jaise Mandarin bolna. néng: ability ya situation allow kare, jaise madad kar paana. kěyǐ: permission, jaise seat par baithna. Context mein meanings overlap kar sakte hain.' },
        { h: 'bù ya méi?', text: 'bù: aadat, choice, ya inkaar. méi: kaam hua nahi. méiyǒu: paas nahi. Wǒ bù chī ròu diet batata hai; Wǒ méi chīfàn batata hai ki khana abhi nahi khaaya.' },
      ] },
      { type: 'dialogue', title: 'Café mein seat aur chai', lines: [
        { who: 'you', zh: '我可以坐这儿吗？', py: 'Wǒ kěyǐ zuò zhèr ma?', hi: 'Kya main yahan baith sakta/sakti hoon?', choices: [ { py: 'Wǒ méiyǒu xiànjīn.', hi: 'Mere paas cash nahi hai.', why: 'Pehle seat ki permission poochni hai. Cash ki baat permission nahi poochti.' } ] },
        { who: 'waiter', zh: '可以。', py: 'Kěyǐ.', hi: 'Haan, baith sakte hain.' },
        { who: 'you', zh: '我要一杯茶。', py: 'Wǒ yào yì bēi chá.', hi: 'Mujhe ek cup chai chahiye.' },
        { who: 'waiter', zh: '好的。', py: 'Hǎo de.', hi: 'Theek hai.' },
      ] },
      { type: 'build', items: [
        { zh: '我想去北京。', py: 'Wǒ xiǎng qù Běijīng.', hi: 'Main Beijing jaana chahta/chahti hoon.', blocks: [ 'Wǒ', 'xiǎng', 'qù', 'Běijīng' ] },
        { zh: '我可以坐这儿吗？', py: 'Wǒ kěyǐ zuò zhèr ma?', hi: 'Kya main yahan baith sakta/sakti hoon?', blocks: [ 'Wǒ', 'kěyǐ', 'zuò zhèr', 'ma' ] },
        { zh: '我没有现金。', py: 'Wǒ méiyǒu xiànjīn.', hi: 'Mere paas cash nahi hai.', blocks: [ 'Wǒ', 'méiyǒu', 'xiànjīn' ] },
      ] },
      { type: 'bins', q: 'Aadat/choice hai ya kaam nahi hua/paas nahi?', bins: [ { id: 'bu', label: 'bù: choice ya inkaar' }, { id: 'mei', label: 'méi: nahi hua / paas nahi' } ], items: [
        { py: 'Wǒ bù chī ròu.', bin: 'bu' }, { py: 'Wǒ bù hē jiǔ.', bin: 'bu' }, { py: 'Wǒ méi chīfàn.', bin: 'mei' }, { py: 'Wǒ méiyǒu xiànjīn.', bin: 'mei' },
      ] },
      { type: 'recall', count: 5 },
      { type: 'quiz', questions: [
        { q: 'Tum meat kabhi nahi khaate/khaati. Diet batane wali line?', choices: [ { py: 'Wǒ bù chī ròu.' }, { py: 'Wǒ méi chīfàn.' } ], answer: 0, why: 'bù chī ròu meat nahi khane ki choice batata hai. méi chīfàn ka matlab khana abhi nahi khaaya; vegetarian hona nahi batata.' },
        { q: 'Mandarin bolna seekha hai, bas thoda aata hai. Kaunsa pattern?', choices: [ { py: 'Wǒ huì shuō yìdiǎnr Zhōngwén.' }, { py: 'Wǒ yào yì bēi chá.' } ], answer: 0, why: 'huì shuō learned skill batata hai. yào yì bēi chá chai ka order hai.' },
        { q: 'Cash paas nahi hai. Sahi negative?', choices: [ { py: 'Wǒ méiyǒu xiànjīn.' }, { py: 'Wǒ bù yǒu xiànjīn.' } ], answer: 0, why: 'Possession wale yǒu ka negative méiyǒu hai. bù yǒu standard simple negative form nahi hai.' },
      ] },
    ],
  },
  {
    id: 'bld-03', icon: '🔢', title: 'Kitne cups? Kitne baje?',
    goal: 'Restaurant ki quantity aur meeting ka waqt khud banao.',
    scene: { img: '👥🍵🍚', text: 'Restaurant mein do log hain aur do bowls rice chahiye. Sirf number bolna order ko adhoora chhod sakta hai.', ask: 'Do bowls rice ka phrase?', choices: [
      { py: 'Liǎng wǎn mǐfàn.', ok: true, why: 'liǎng = do; wǎn = bowl ka measure word; mǐfàn = rice.' },
      { py: 'Èr diǎn.', ok: false, why: 'Èr diǎn do baje hai. Bowls ke liye liǎng wǎn chahiye.' },
    ] },
    phrases: [
      { id: 'bld-one-person', zh: '一个人', py: 'Yí ge rén', hi: 'Ek insaan / ek person', img: '🧍', note: 'Number + measure word + noun. ge neutral; 一 ka spoken tone yí.' },
      { id: 'bld-two-guests', zh: '两位。', py: 'Liǎng wèi.', hi: 'Do log.', img: '👥', note: 'Restaurant mein headcount ka polite jawab. wèi logon ke liye respectful measure word.' },
      { id: 'bld-one-tea', zh: '一杯茶', py: 'Yì bēi chá', hi: 'Ek cup chai', img: '🍵', note: 'bēi cup/glass ke liye. bēi Tone 1 hai, isliye 一 yì.' },
      { id: 'bld-two-rice', zh: '两碗米饭', py: 'Liǎng wǎn mǐfàn', hi: 'Do bowls rice', img: '🍚🍚', note: 'Do bowls: liǎng wǎn. Counting sequence ke èr ko yahan copy mat karo.' },
      { id: 'bld-three-tickets', zh: '三张票', py: 'Sān zhāng piào', hi: 'Teen tickets', img: '🎟️🎟️🎟️', note: 'zhāng flat cheezon aur tickets ka common measure word hai.' },
      { id: 'bld-tomorrow-three', zh: '明天三点见。', py: 'Míngtiān sān diǎn jiàn.', hi: 'Kal teen baje milte hain.', img: '📅🕒🤝', note: 'Time + jiàn. Zaroorat ho to afternoon/evening bolkar waqt clear karo.' },
      { id: 'bld-time-now', zh: '现在几点？', py: 'Xiànzài jǐ diǎn?', hi: 'Abhi kitne baje hain?', img: '🕒❓', note: 'jǐ diǎn = kitne baje. Waqt poochne ke liye ma nahi chahiye.' },
      { id: 'bld-tonight-six', zh: '今天晚上六点。', py: 'Jīntiān wǎnshang liù diǎn.', hi: 'Aaj shaam chhe baje.', img: '🌆🕕', note: 'Bada time block pehle: aaj + shaam + chhe baje.' },
    ],
    stages: [
      { type: 'learn' },
      { type: 'explain', cards: [
        { h: 'Number aur noun ke beech kya aata hai?', text: 'Number + measure word + noun: yì bēi chá. Cups ke liye bēi, bowls ke liye wǎn, tickets ke liye zhāng. ge useful common word hai, har noun ke liye exact replacement nahi.' },
        { h: 'Do ke liye liǎng ya èr?', text: 'Measure word se pehle aam taur par liǎng: liǎng wǎn, liǎng wèi. Counting mein èr. Do baje liǎng diǎn bhi bahut common hai; time ko ordinary noun counting se alag seekho.' },
        { h: 'Meeting ka waqt clear kaise karein?', text: 'Pehle din, phir din ka hissa, phir clock time: jīntiān wǎnshang liù diǎn. Sirf sān diǎn bolne par morning/afternoon context se clear hona chahiye.' },
      ] },
      { type: 'dialogue', title: 'Do logon ka restaurant order', lines: [
        { who: 'waiter', zh: '几位？', py: 'Jǐ wèi?', hi: 'Kitne log?' },
        { who: 'you', zh: '两位。', py: 'Liǎng wèi.', hi: 'Do log.', choices: [ { py: 'Sān zhāng piào.', hi: 'Teen tickets.', why: 'Waiter headcount pooch raha hai. Tickets ki quantity restaurant headcount nahi batati.' } ] },
        { who: 'you', zh: '我要两碗米饭。', py: 'Wǒ yào liǎng wǎn mǐfàn.', hi: 'Mujhe do bowls rice chahiye.' },
        { who: 'waiter', zh: '好的。', py: 'Hǎo de.', hi: 'Theek hai.' },
      ] },
      { type: 'build', items: [
        { zh: '我要一杯茶。', py: 'Wǒ yào yì bēi chá.', hi: 'Mujhe ek cup chai chahiye.', blocks: [ 'Wǒ', 'yào', 'yì bēi', 'chá' ] },
        { zh: '我们要两张票。', py: 'Wǒmen yào liǎng zhāng piào.', hi: 'Humein do tickets chahiye.', blocks: [ 'Wǒmen', 'yào', 'liǎng zhāng', 'piào' ] },
        { zh: '明天三点见。', py: 'Míngtiān sān diǎn jiàn.', hi: 'Kal teen baje milte hain.', blocks: [ 'Míngtiān', 'sān diǎn', 'jiàn' ] },
        { zh: '今天晚上六点见。', py: 'Jīntiān wǎnshang liù diǎn jiàn.', hi: 'Aaj shaam chhe baje milte hain.', blocks: [ 'Jīntiān', 'wǎnshang', 'liù diǎn', 'jiàn' ] },
      ] },
      { type: 'match', count: 5 },
      { type: 'recall', count: 5 },
      { type: 'quiz', questions: [
        { q: 'Ek cup chai chahiye. Measure word kaunsa?', choices: [ { py: 'Yì bēi chá.' }, { py: 'Yì zhāng chá.' }, { py: 'Yí ge piào.' } ], answer: 0, why: 'Chai ke cup ke liye bēi. zhāng tickets jaisi flat cheezon ka common measure word hai.' },
        { q: 'Restaurant mein waiter Jǐ wèi? poochta hai. Tum aur Xiǎoyǔ ho. Kya bologe?', choices: [ { py: 'Liǎng wèi.' }, { py: 'Sān zhāng piào.' }, { py: 'Yì bēi chá.' } ], answer: 0, why: 'Liǎng wèi do guests batata hai. Tickets ya chai ki quantity headcount ka jawab nahi hai.' },
        { q: 'Aaj shaam chhe baje ka clear phrase?', choices: [ { py: 'Jīntiān wǎnshang liù diǎn.' }, { py: 'Míngtiān sān diǎn.' }, { py: 'Xiànzài jǐ diǎn?' } ], answer: 0, why: 'Jīntiān wǎnshang liù diǎn mein aaj, shaam aur chhe baje clear hain. Míngtiān kal hai; jǐ diǎn waqt ka sawaal hai.' },
      ] },
    ],
  },
]);
