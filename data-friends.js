/* Track: friends — Hinglish speaking practice. Check: node validate.js --track friends --py */
MG.registerLevels("friends", [
  {
    "id": "frd-01",
    "icon": "🤝",
    "title": "Xiǎoyǔ ke friends se pehli mulaqat",
    "goal": "Apna parichay do, dost ka naam poochho aur Mandarin practice ke baare mein batao.",
    "scene": {
      "img": "👫🤝🎉",
      "text": "Xiǎoyǔ ne Lìli aur Dàwěi se milaya. Naam abhi nahi pata. Friendly shuruaat ke liye pehle naam poochhna hai.",
      "ask": "Dost ka naam kaise poochhoge?",
      "choices": [
        {
          "py": "Nǐ jiào shénme míngzi?",
          "ok": true,
          "why": "Naam poochhne ka seedha, friendly sawaal."
        },
        {
          "py": "Nǐ shì Yìndù rén ma?",
          "ok": false,
          "why": "Yeh nationality ka sawaal hai; naam nahi poochhta."
        }
      ]
    },
    "phrases": [
      {
        "id": "frd-hello",
        "zh": "你好！",
        "py": "Nǐ hǎo!",
        "hi": "Hi / namaste!",
        "img": "👋",
        "who": "you",
        "note": "Friends ke saath nǐ normal hai. Parents ke saath nín rakho."
      },
      {
        "id": "frd-name-question",
        "zh": "你叫什么名字？",
        "py": "Nǐ jiào shénme míngzi?",
        "hi": "Tumhara naam kya hai?",
        "img": "🤝❓",
        "who": "you",
        "note": "míngzi ka zi chhota aur halka hai."
      },
      {
        "id": "frd-relationship",
        "zh": "我是晓雨的男朋友。",
        "py": "Wǒ shì Xiǎoyǔ de nánpéngyou.",
        "hi": "Main Xiǎoyǔ ka boyfriend hoon.",
        "img": "👫",
        "who": "you",
        "note": "Apne relationship ka parichay dene ke liye.",
        "f": {
          "zh": "我是晓雨的女朋友。",
          "py": "Wǒ shì Xiǎoyǔ de nǚpéngyou.",
          "hi": "Main Xiǎoyǔ ki girlfriend hoon."
        }
      },
      {
        "id": "frd-her-friend",
        "zh": "你是晓雨的朋友吗？",
        "py": "Nǐ shì Xiǎoyǔ de péngyou ma?",
        "hi": "Kya tum Xiǎoyǔ ke dost ho?",
        "img": "👩🤝❓",
        "who": "you",
        "note": "Sentence ke end ka ma halka sawaal banata hai."
      },
      {
        "id": "frd-nice-meet",
        "zh": "很高兴认识你！",
        "py": "Hěn gāoxìng rènshi nǐ!",
        "hi": "Tumse milkar khushi hui!",
        "img": "🤝😊",
        "who": "you",
        "note": "rènshi ka shi neutral hai; doosra full Tone 4 mat banao."
      },
      {
        "id": "frd-indian",
        "zh": "我是印度人。",
        "py": "Wǒ shì Yìndù rén.",
        "hi": "Main Indian hoon.",
        "img": "🇮🇳",
        "who": "you",
        "note": "Yìndù mein dono syllable Tone 4 mein neeche girte hain."
      },
      {
        "id": "frd-learning",
        "zh": "我在学中文。",
        "py": "Wǒ zài xué Zhōngwén.",
        "hi": "Main Mandarin seekh raha/rahi hoon.",
        "img": "📚💬",
        "who": "you",
        "note": "Zhōngwén = Chinese language; spoken context mein Mandarin samjha jaata hai."
      },
      {
        "id": "frd-slow-please",
        "zh": "请说慢一点儿。",
        "py": "Qǐng shuō màn yìdiǎnr.",
        "hi": "Please thoda dheere bolo.",
        "img": "🐢💬",
        "who": "you",
        "note": "Dost se pace kam karne ko kaho; har shabd samajhne ka pressure mat lo."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Naam se baat aage badhao",
        "lines": [
          {
            "who": "gf",
            "zh": "这是莉莉。",
            "py": "Zhè shì Lìli.",
            "hi": "Yeh Lìli hai."
          },
          {
            "who": "you",
            "zh": "你好！",
            "py": "Nǐ hǎo!",
            "hi": "Hi!",
            "choices": [
              {
                "py": "Zàijiàn!",
                "hi": "Phir milenge!",
                "why": "Mulaqat shuru hui hai. Zàijiàn vida lene ke liye hai."
              }
            ]
          },
          {
            "who": "lili",
            "zh": "很高兴认识你！",
            "py": "Hěn gāoxìng rènshi nǐ!",
            "hi": "Tumse milkar khushi hui!"
          },
          {
            "who": "you",
            "zh": "我在学中文。",
            "py": "Wǒ zài xué Zhōngwén.",
            "hi": "Main Mandarin seekh raha/rahi hoon.",
            "choices": [
              {
                "py": "Nǐ jiào shénme míngzi?",
                "hi": "Tumhara naam kya hai?",
                "why": "Xiǎoyǔ ne Lìli ka naam bata diya. Ab apni Mandarin practice batao."
              }
            ]
          },
          {
            "who": "you",
            "zh": "请说慢一点儿。",
            "py": "Qǐng shuō màn yìdiǎnr.",
            "hi": "Please thoda dheere bolo."
          },
          {
            "who": "lili",
            "zh": "没问题！",
            "py": "Méi wèntí!",
            "hi": "Koi problem nahi!"
          }
        ]
      },
      {
        "type": "meaning",
        "count": 5
      },
      {
        "type": "recall",
        "count": 5
      },
      {
        "type": "quiz",
        "questions": [
          {
            "q": "Dàwěi ka naam nahi pata. Kaunsa sawaal sahi hai?",
            "choices": [
              {
                "py": "Nǐ jiào shénme míngzi?"
              },
              {
                "py": "Nǐ shì Xiǎoyǔ de péngyou ma?"
              },
              {
                "py": "Wǒ shì Yìndù rén."
              }
            ],
            "answer": 0,
            "why": "Míngzi = naam. Péngyou wala sawaal Xiǎoyǔ se dosti poochhta hai; Yìndù rén apna nationality batata hai."
          },
          {
            "q": "Lìli fast bol rahi hai. Pace kam karwana hai.",
            "choices": [
              {
                "py": "Wǒ zài xué Zhōngwén."
              },
              {
                "py": "Qǐng shuō màn yìdiǎnr."
              },
              {
                "py": "Hěn gāoxìng rènshi nǐ!"
              }
            ],
            "answer": 1,
            "why": "Màn = dheere. Mandarin seekhne ki baat helpful hai, par pace kam karne ki request alag se bolo."
          },
          {
            "q": "India se hone ka simple parichay kya hai?",
            "choices": [
              {
                "py": "Nǐ shì Yìndù rén ma?"
              },
              {
                "py": "Wǒ shì Yìndù rén."
              },
              {
                "py": "Nǐ jiào shénme míngzi?"
              }
            ],
            "answer": 1,
            "why": "Wǒ shì = main hoon. Nǐ shì ... ma? saamne wale ki nationality poochhta hai."
          }
        ]
      }
    ]
  },
  {
    "id": "frd-02",
    "icon": "📱",
    "title": "WeChat add aur photo share",
    "goal": "WeChat add karo, QR scan ka turn batao aur photo maango.",
    "scene": {
      "img": "👫📱🔲",
      "text": "Lìli se milkar achha laga. Lìli phone par WeChat kholti hai. Aap Lìli ka QR scan karna chahte ho.",
      "ask": "Kaunsi line scan ka turn clear karti hai?",
      "choices": [
        {
          "py": "Wǒ sǎo nǐ.",
          "ok": true,
          "why": "Wǒ = main. Aap Lìli ka QR scan karoge."
        },
        {
          "py": "Nǐ sǎo wǒ ba.",
          "ok": false,
          "why": "Nǐ = tum. Yeh Lìli ko aapka QR scan karne ko kehta hai."
        }
      ]
    },
    "phrases": [
      {
        "id": "frd-add-wechat",
        "zh": "加个微信吧。",
        "py": "Jiā ge Wēixìn ba.",
        "hi": "WeChat par add kar lete hain.",
        "img": "📱➕",
        "who": "you",
        "note": "Casual invitation. Ba request ko halka banata hai."
      },
      {
        "id": "frd-i-scan",
        "zh": "我扫你。",
        "py": "Wǒ sǎo nǐ.",
        "hi": "Main tumhara QR scan karta/karti hoon.",
        "img": "📱➡️🔲",
        "who": "you",
        "note": "Scan ke waqt saamne wale ka QR screen par hona chahiye."
      },
      {
        "id": "frd-you-scan",
        "zh": "你扫我吧。",
        "py": "Nǐ sǎo wǒ ba.",
        "hi": "Tum mera QR scan kar lo.",
        "img": "🔲⬅️📱",
        "who": "you",
        "note": "Nǐ sǎo = tum scan karo. Wǒ sǎo = main scan karoon."
      },
      {
        "id": "frd-send-you",
        "zh": "我发给你。",
        "py": "Wǒ fā gěi nǐ.",
        "hi": "Main tumhe bhej deta/deti hoon.",
        "img": "📤📱",
        "who": "you",
        "note": "Photo ya message bhejne ke liye. Fā ka sur seedha ooncha hai."
      },
      {
        "id": "frd-received-question",
        "zh": "你收到了吗？",
        "py": "Nǐ shōudào le ma?",
        "hi": "Tumhe message mil gaya?",
        "img": "📩❓",
        "who": "you",
        "note": "Shōudào = receive karna. Le message pahunchne ka status batata hai."
      },
      {
        "id": "frd-received",
        "zh": "收到了。",
        "py": "Shōudào le.",
        "hi": "Haan, message mil gaya.",
        "img": "📩✅",
        "who": "you",
        "note": "Sirf message milne ki confirmation; shukriya alag se bol sakte ho."
      },
      {
        "id": "frd-photo",
        "zh": "拍张照吧。",
        "py": "Pāi zhāng zhào ba.",
        "hi": "Ek photo lete hain.",
        "img": "📸👫",
        "who": "you",
        "note": "Group photo ka friendly suggestion; photo se pehle consent poochho."
      },
      {
        "id": "frd-send-me",
        "zh": "可以发给我吗？",
        "py": "Kěyǐ fā gěi wǒ ma?",
        "hi": "Kya photo mujhe bhej sakte ho?",
        "img": "📷➡️📱",
        "who": "you",
        "note": "Gěi wǒ = mujhe. Gěi nǐ = tumhe."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "QR kis phone par hai?",
        "lines": [
          {
            "who": "lili",
            "zh": "加个微信吧。",
            "py": "Jiā ge Wēixìn ba.",
            "hi": "WeChat par add kar lete hain."
          },
          {
            "who": "you",
            "zh": "我扫你。",
            "py": "Wǒ sǎo nǐ.",
            "hi": "Main tumhara QR scan karta/karti hoon.",
            "choices": [
              {
                "py": "Nǐ sǎo wǒ ba.",
                "hi": "Tum mera QR scan kar lo.",
                "why": "Aap Lìli ka QR scan karna chahte ho. Nǐ sǎo mein Lìli scan karegi."
              }
            ]
          },
          {
            "who": "lili",
            "zh": "好啊！",
            "py": "Hǎo a!",
            "hi": "Haan, bilkul!"
          },
          {
            "who": "you",
            "zh": "可以发给我吗？",
            "py": "Kěyǐ fā gěi wǒ ma?",
            "hi": "Kya photo mujhe bhej sakti ho?",
            "choices": [
              {
                "py": "Wǒ fā gěi nǐ.",
                "hi": "Main tumhe bhejta/bhejti hoon.",
                "why": "Photo Lìli ke phone par hai. Lìli se photo maango; khud bhejne ka vaada mat karo."
              }
            ]
          },
          {
            "who": "lili",
            "zh": "我发给你。",
            "py": "Wǒ fā gěi nǐ.",
            "hi": "Main tumhe bhej deti hoon."
          },
          {
            "who": "you",
            "zh": "收到了。",
            "py": "Shōudào le.",
            "hi": "Photo mil gayi."
          }
        ]
      },
      {
        "type": "meaning",
        "count": 5
      },
      {
        "type": "recall",
        "count": 5
      },
      {
        "type": "quiz",
        "questions": [
          {
            "q": "Aapke phone par QR khula hai. Dàwěi ko scan karne ko bolo.",
            "choices": [
              {
                "py": "Wǒ sǎo nǐ."
              },
              {
                "py": "Nǐ sǎo wǒ ba."
              },
              {
                "py": "Pāi zhāng zhào ba."
              }
            ],
            "answer": 1,
            "why": "Nǐ sǎo wǒ = tum mera QR scan karo. Wǒ sǎo nǐ mein aap scanner pakadte ho."
          },
          {
            "q": "Lìli ke phone par group photo hai. Apne liye photo maango.",
            "choices": [
              {
                "py": "Wǒ fā gěi nǐ."
              },
              {
                "py": "Shōudào le."
              },
              {
                "py": "Kěyǐ fā gěi wǒ ma?"
              }
            ],
            "answer": 2,
            "why": "Gěi wǒ = mujhe bhejo. Gěi nǐ = tumhe bhejo; direction badal jaati hai."
          },
          {
            "q": "Photo chat mein aa gayi. Chhoti confirmation kya hogi?",
            "choices": [
              {
                "py": "Shōudào le."
              },
              {
                "py": "Nǐ shōudào le ma?"
              },
              {
                "py": "Jiā ge Wēixìn ba."
              }
            ],
            "answer": 0,
            "why": "Shōudào le message milne ki confirmation hai. Nǐ shōudào le ma? saamne wale se confirmation maangta hai."
          }
        ]
      }
    ]
  },
  {
    "id": "frd-03",
    "icon": "🗓️",
    "title": "Friends ke saath plan pakka karo",
    "goal": "Dinner ka plan, milne ka time aur jagah clear karo; zarurat par mana karo.",
    "scene": {
      "img": "👫🗓️🍜",
      "text": "Dàwěi dinner ke liye milna chahta hai. Dinner ke liye haan hai, par meeting ka time nahi pata.",
      "ask": "Time kaise poochhoge?",
      "choices": [
        {
          "py": "Jǐ diǎn jiàn?",
          "ok": true,
          "why": "Jǐ diǎn = kitne baje."
        },
        {
          "py": "Zài nǎr jiàn?",
          "ok": false,
          "why": "Yeh milne ki jagah poochhta hai, time nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "frd-free-evening",
        "zh": "晚上有空吗？",
        "py": "Wǎnshang yǒu kòng ma?",
        "hi": "Shaam ko free ho?",
        "img": "🌆🗓️",
        "who": "you",
        "note": "Free time wala 空 kòng (Tone 4) hai; kōng nahi."
      },
      {
        "id": "frd-dinner-together",
        "zh": "我们一起吃饭吧。",
        "py": "Wǒmen yìqǐ chī fàn ba.",
        "hi": "Saath dinner karte hain.",
        "img": "👫🍜",
        "who": "you",
        "note": "Yìqǐ = saath. 一 ka sur qǐ se pehle yì hota hai."
      },
      {
        "id": "frd-meet-time",
        "zh": "几点见？",
        "py": "Jǐ diǎn jiàn?",
        "hi": "Kitne baje milna hai?",
        "img": "🕕❓",
        "who": "you",
        "note": "Time poochhne ke liye jǐ diǎn. Jagah poochhne ke liye nǎr."
      },
      {
        "id": "frd-meet-place",
        "zh": "在哪儿见？",
        "py": "Zài nǎr jiàn?",
        "hi": "Kahaan milna hai?",
        "img": "📍❓",
        "who": "you",
        "note": "Nǎr ka r ek hi syllable ke saath bolo."
      },
      {
        "id": "frd-meet-six",
        "zh": "六点在地铁站见。",
        "py": "Liù diǎn zài dìtiězhàn jiàn.",
        "hi": "Chhe baje metro station par milte hain.",
        "img": "🕕🚇",
        "who": "you",
        "note": "Real plan mein station ka naam aur exit number bhi confirm karo."
      },
      {
        "id": "frd-cant-today",
        "zh": "我今天不能去。",
        "py": "Wǒ jīntiān bù néng qù.",
        "hi": "Main aaj nahi aa sakta/sakti.",
        "img": "🗓️🙅",
        "who": "you",
        "note": "Bù néng = nahi kar sakna. Polite boundary dena normal hai."
      },
      {
        "id": "frd-next-time",
        "zh": "下次吧。",
        "py": "Xià cì ba.",
        "hi": "Agli baar karte hain.",
        "img": "🗓️➡️",
        "who": "you",
        "note": "Mana karne ke baad friendly ending; haan ka matlab nahi hai."
      },
      {
        "id": "frd-home-message",
        "zh": "到家了说一声。",
        "py": "Dào jiā le shuō yì shēng.",
        "hi": "Ghar pahunchkar ek message kar dena.",
        "img": "🏠💬",
        "who": "you",
        "note": "Close friends ke liye caring line. 一 shēng se pehle yì hai."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Dinner ka plan confirm",
        "lines": [
          {
            "who": "dawei",
            "zh": "晚上有空吗？",
            "py": "Wǎnshang yǒu kòng ma?",
            "hi": "Shaam ko free ho?"
          },
          {
            "who": "you",
            "zh": "我们一起吃饭吧。",
            "py": "Wǒmen yìqǐ chī fàn ba.",
            "hi": "Saath dinner karte hain.",
            "choices": [
              {
                "py": "Xià cì ba.",
                "hi": "Agli baar karte hain.",
                "why": "Aap dinner ke liye haan bolna chahte ho. Xià cì ba aaj ka plan taal deta hai."
              }
            ]
          },
          {
            "who": "dawei",
            "zh": "好啊！",
            "py": "Hǎo a!",
            "hi": "Haan, bilkul!"
          },
          {
            "who": "you",
            "zh": "几点见？",
            "py": "Jǐ diǎn jiàn?",
            "hi": "Kitne baje milna hai?",
            "choices": [
              {
                "py": "Zài nǎr jiàn?",
                "hi": "Kahaan milna hai?",
                "why": "Ab time missing hai. Zài nǎr jiàn jagah ka sawaal hai."
              }
            ]
          },
          {
            "who": "dawei",
            "zh": "六点在地铁站见。",
            "py": "Liù diǎn zài dìtiězhàn jiàn.",
            "hi": "Chhe baje metro station par milte hain."
          },
          {
            "who": "you",
            "zh": "好，六点见！",
            "py": "Hǎo, liù diǎn jiàn!",
            "hi": "Theek hai, chhe baje milte hain!"
          }
        ]
      },
      {
        "type": "meaning",
        "count": 5
      },
      {
        "type": "recall",
        "count": 5
      },
      {
        "type": "quiz",
        "questions": [
          {
            "q": "Dinner ka time pata hai. Restaurant ke paas milna hai ya metro par, clear nahi hai.",
            "choices": [
              {
                "py": "Jǐ diǎn jiàn?"
              },
              {
                "py": "Zài nǎr jiàn?"
              },
              {
                "py": "Wǎnshang yǒu kòng ma?"
              }
            ],
            "answer": 1,
            "why": "Zài nǎr = kis jagah. Jǐ diǎn sirf time poochhta hai."
          },
          {
            "q": "Aaj rest chahiye. Dinner ke liye politely mana karo.",
            "choices": [
              {
                "py": "Wǒ jīntiān bù néng qù."
              },
              {
                "py": "Wǒmen yìqǐ chī fàn ba."
              },
              {
                "py": "Liù diǎn zài dìtiězhàn jiàn."
              }
            ],
            "answer": 0,
            "why": "Bù néng qù = aaj jaana possible nahi. Yìqǐ chī fàn dinner ki invitation hai."
          },
          {
            "q": "Kaunsi line mein time aur jagah dono hain?",
            "choices": [
              {
                "py": "Jǐ diǎn jiàn?"
              },
              {
                "py": "Xià cì ba."
              },
              {
                "py": "Liù diǎn zài dìtiězhàn jiàn."
              }
            ],
            "answer": 2,
            "why": "Liù diǎn = chhe baje; dìtiězhàn = metro station. Baaki lines mein confirmed time aur place nahi hain."
          }
        ]
      }
    ]
  }
]);
