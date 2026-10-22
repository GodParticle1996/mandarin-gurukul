/* Track: basics-extra — Hinglish speaking practice. Check: node validate.js (all tracks) */
MG.registerLevels("basics", [
  {
    "id": "bas-02",
    "icon": "🐢",
    "title": "Samajh nahi aaya? Baat repair karo",
    "goal": "Dheere bolne aur repeat karne ko kaho; English ya translation ki madad maango.",
    "scene": {
      "img": "🧑💬⚡😵",
      "text": "Shop staff ka jawab bahut fast tha. Jawab samajh nahi aaya. Guess karne ke bajaye speed kam karwani hai.",
      "ask": "Kaunsi request pace kam karti hai?",
      "choices": [
        {
          "py": "Qǐng shuō màn yìdiǎnr.",
          "ok": true,
          "why": "Màn = dheere. Staff ko slower bolne ki clear request mili."
        },
        {
          "py": "Qǐng zài shuō yí biàn.",
          "ok": false,
          "why": "Repeat ki request useful hai, par speed kam karne ko nahi kehti."
        }
      ]
    },
    "phrases": [
      {
        "id": "bas-not-understand",
        "zh": "我听不懂。",
        "py": "Wǒ tīng bù dǒng.",
        "hi": "Mujhe boli hui baat samajh nahi aa rahi.",
        "img": "💬❓",
        "who": "you",
        "note": "Tīng = kaan se baat lena; dǒng = samajhna. Fast conversation mein useful repair line."
      },
      {
        "id": "bas-slower",
        "zh": "请说慢一点儿。",
        "py": "Qǐng shuō màn yìdiǎnr.",
        "hi": "Please thoda dheere boliye.",
        "img": "🐢💬",
        "who": "you",
        "note": "Màn = dheere. Yìdiǎnr ko ek chhote flow mein bolo."
      },
      {
        "id": "bas-repeat",
        "zh": "请再说一遍。",
        "py": "Qǐng zài shuō yí biàn.",
        "hi": "Please ek baar phir boliye.",
        "img": "🔁💬",
        "who": "you",
        "note": "Zài = dobara. Yí biàn = ek baar; biàn Tone 4 hai."
      },
      {
        "id": "bas-english-question",
        "zh": "你会说英语吗？",
        "py": "Nǐ huì shuō Yīngyǔ ma?",
        "hi": "Kya aap English bol sakte hain?",
        "img": "🇬🇧💬❓",
        "who": "you",
        "note": "Mandarin mein nǐ normal polite conversation mein bhi use hota hai. Bado ke liye nín."
      },
      {
        "id": "bas-little-chinese",
        "zh": "我会说一点儿中文。",
        "py": "Wǒ huì shuō yìdiǎnr Zhōngwén.",
        "hi": "Main thodi Mandarin bol leta/leti hoon.",
        "img": "💬🤏",
        "who": "you",
        "note": "Yìdiǎnr = thoda. Apni level bata kar conversation ka pace set karo."
      },
      {
        "id": "bas-what-meaning",
        "zh": "这是什么意思？",
        "py": "Zhè shì shénme yìsi?",
        "hi": "Yeh baat ka kya matlab hai?",
        "img": "💬❓",
        "who": "you",
        "note": "Yìsi ka si neutral hai. Abhi boli hui line ke meaning ke liye poochho."
      },
      {
        "id": "bas-how-say-chinese",
        "zh": "用中文怎么说？",
        "py": "Yòng Zhōngwén zěnme shuō?",
        "hi": "Mandarin mein kaise bolte hain?",
        "img": "☝️💬",
        "who": "you",
        "note": "Object dikhao ya English word bolo, phir Mandarin word poochho."
      },
      {
        "id": "bas-help-translate",
        "zh": "请帮我翻译一下。",
        "py": "Qǐng bāng wǒ fānyì yíxià.",
        "hi": "Please translate karne mein meri madad kijiye.",
        "img": "📱🔄💬",
        "who": "you",
        "note": "Dost ya staff se chhoti translation ki request. Yíxià request ko halka banata hai."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "explain",
        "cards": [
          {
            "h": "Slow aur repeat mein kya farq hai?",
            "text": "Màn yìdiǎnr = thoda dheere. Zài shuō yí biàn = ek baar phir. Dono requests saath bhi bol sakte ho: pehle pace, phir repeat. Har word samajhne se pehle repair line yaad rakho."
          }
        ]
      },
      {
        "type": "dialogue",
        "title": "Fast jawab ko slow banao",
        "lines": [
          {
            "who": "staff",
            "zh": "您要袋子吗？",
            "py": "Nín yào dàizi ma?",
            "hi": "Kya aapko bag chahiye?"
          },
          {
            "who": "you",
            "zh": "我听不懂。",
            "py": "Wǒ tīng bù dǒng.",
            "hi": "Mujhe baat samajh nahi aayi.",
            "choices": [
              {
                "py": "Hǎo de.",
                "hi": "Theek hai.",
                "why": "Baat samjhe bina haan bolne se bag ka order galat ho sakta hai. Problem clear karo."
              }
            ]
          },
          {
            "who": "you",
            "zh": "请说慢一点儿。",
            "py": "Qǐng shuō màn yìdiǎnr.",
            "hi": "Please thoda dheere boliye.",
            "choices": [
              {
                "py": "Zàijiàn!",
                "hi": "Phir milenge!",
                "why": "Aap conversation continue karna chahte ho. Zàijiàn conversation khatam karta hai."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "袋子，要吗？",
            "py": "Dàizi, yào ma?",
            "hi": "Bag, chahiye?"
          },
          {
            "who": "you",
            "zh": "谢谢！",
            "py": "Xièxie!",
            "hi": "Shukriya!"
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
            "q": "Jawab ka ek word miss hua. Wahi line dobara chahiye.",
            "choices": [
              {
                "py": "Qǐng zài shuō yí biàn."
              },
              {
                "py": "Qǐng shuō màn yìdiǎnr."
              },
              {
                "py": "Wǒ huì shuō yìdiǎnr Zhōngwén."
              }
            ],
            "answer": 0,
            "why": "Zài shuō yí biàn = ek baar phir boliye. Màn yìdiǎnr speed kam karta hai; repeat ka exact instruction nahi."
          },
          {
            "q": "Samne wale se English bolne ki ability poochho.",
            "choices": [
              {
                "py": "Wǒ huì shuō Yīngyǔ."
              },
              {
                "py": "Nǐ huì shuō Yīngyǔ ma?"
              },
              {
                "py": "Yòng Zhōngwén zěnme shuō?"
              }
            ],
            "answer": 1,
            "why": "Nǐ ... ma? saamne wale se sawaal hai. Wǒ huì ... apni ability batata hai."
          },
          {
            "q": "Menu ki dish ka English word jaante ho. Mandarin word seekhna hai.",
            "choices": [
              {
                "py": "Zhè shì shénme yìsi?"
              },
              {
                "py": "Yòng Zhōngwén zěnme shuō?"
              },
              {
                "py": "Wǒ tīng bù dǒng."
              }
            ],
            "answer": 1,
            "why": "Yòng Zhōngwén zěnme shuō? Mandarin mein bolne ka tareeqa poochhta hai. Yìsi ka sawaal kisi kahi baat ka meaning poochhta hai."
          }
        ]
      }
    ]
  },
  {
    "id": "bas-03",
    "icon": "🙋",
    "title": "Apna chhota parichay do",
    "goal": "India, travel aur Mandarin learning ke baare mein teen chhoti lines bolo.",
    "scene": {
      "img": "🇮🇳👫💬",
      "text": "Xiǎoyǔ ke dost pehli baar mil rahe hain. Dost poochhta hai ki aap kis country se ho. Simple parichay dena hai.",
      "ask": "Kaunsi line nationality batati hai?",
      "choices": [
        {
          "py": "Wǒ shì Yìndù rén.",
          "ok": true,
          "why": "Yìndù rén = Indian person."
        },
        {
          "py": "Wǒ huì shuō Yīngyǔ.",
          "ok": false,
          "why": "Yeh English bolne ki ability hai; nationality nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "bas-intro-indian",
        "zh": "我是印度人。",
        "py": "Wǒ shì Yìndù rén.",
        "hi": "Main Indian hoon.",
        "img": "🇮🇳🙋",
        "who": "you",
        "note": "Yìndù mein dono syllable Tone 4 hain. Rén ka sur upar jaata hai."
      },
      {
        "id": "bas-intro-from-india",
        "zh": "我从印度来。",
        "py": "Wǒ cóng Yìndù lái.",
        "hi": "Main India se hoon.",
        "img": "🇮🇳➡️🙋",
        "who": "you",
        "note": "Cóng = se. Hometown/country ka simple parichay."
      },
      {
        "id": "bas-intro-tourism",
        "zh": "我来中国旅游。",
        "py": "Wǒ lái Zhōngguó lǚyóu.",
        "hi": "Main China ghoomne aaya/aayi hoon.",
        "img": "🇨🇳🧳",
        "who": "you",
        "note": "Lǚyóu = travel / tourism. Lǚ mein hoth gol karke ü banao."
      },
      {
        "id": "bas-intro-learning",
        "zh": "我在学中文。",
        "py": "Wǒ zài xué Zhōngwén.",
        "hi": "Main Mandarin seekh raha/rahi hoon.",
        "img": "📚💬",
        "who": "you",
        "note": "Xué = seekhna; xué ka sur upar uthta hai."
      },
      {
        "id": "bas-intro-english",
        "zh": "我会说英语。",
        "py": "Wǒ huì shuō Yīngyǔ.",
        "hi": "Main English bol sakta/sakti hoon.",
        "img": "🇬🇧💬",
        "who": "you",
        "note": "Huì = learned skill aana. Apni English ability batane ki line."
      },
      {
        "id": "bas-intro-beginner",
        "zh": "我的中文不太好。",
        "py": "Wǒ de Zhōngwén bú tài hǎo.",
        "hi": "Meri Mandarin abhi zyada achhi nahi hai.",
        "img": "🌱💬",
        "who": "you",
        "note": "不 tài (Tone 4) se pehle bú hota hai. Bú tài = zyada nahi."
      },
      {
        "id": "bas-intro-nice-meet",
        "zh": "很高兴认识你！",
        "py": "Hěn gāoxìng rènshi nǐ!",
        "hi": "Aapse milkar khushi hui!",
        "img": "🤝😊",
        "who": "you",
        "note": "Friends ya peers ke liye. Parents ko nǐ ki jagah nín."
      },
      {
        "id": "bas-intro-india-visit",
        "zh": "你来过印度吗？",
        "py": "Nǐ lái guo Yìndù ma?",
        "hi": "Kya tum kabhi India aaye ho?",
        "img": "🇮🇳🧳❓",
        "who": "you",
        "note": "Apna parichay dene ke baad friendly follow-up question."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Teen lines, ek parichay",
        "lines": [
          {
            "who": "lili",
            "zh": "你是哪国人？",
            "py": "Nǐ shì nǎ guó rén?",
            "hi": "Tum kis country se ho?"
          },
          {
            "who": "you",
            "zh": "我是印度人。",
            "py": "Wǒ shì Yìndù rén.",
            "hi": "Main Indian hoon.",
            "choices": [
              {
                "py": "Wǒ huì shuō Yīngyǔ.",
                "hi": "Main English bol sakta/sakti hoon.",
                "why": "Country poochhi gayi hai. English ability se country clear nahi hoti."
              }
            ]
          },
          {
            "who": "you",
            "zh": "我来中国旅游。",
            "py": "Wǒ lái Zhōngguó lǚyóu.",
            "hi": "Main China ghoomne aaya/aayi hoon."
          },
          {
            "who": "lili",
            "zh": "你会说中文吗？",
            "py": "Nǐ huì shuō Zhōngwén ma?",
            "hi": "Kya tum Mandarin bol sakte ho?"
          },
          {
            "who": "you",
            "zh": "我在学中文。",
            "py": "Wǒ zài xué Zhōngwén.",
            "hi": "Main Mandarin seekh raha/rahi hoon.",
            "choices": [
              {
                "py": "Nǐ lái guo Yìndù ma?",
                "hi": "Kya tum India aaye ho?",
                "why": "Pehle apni Mandarin ability ka context do. India visit ka sawaal baad mein poochho."
              }
            ]
          },
          {
            "who": "you",
            "zh": "我的中文不太好。",
            "py": "Wǒ de Zhōngwén bú tài hǎo.",
            "hi": "Meri Mandarin abhi zyada achhi nahi hai."
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
            "q": "Friendly chat mein India visit ke baare mein poochho.",
            "choices": [
              {
                "py": "Wǒ cóng Yìndù lái."
              },
              {
                "py": "Nǐ lái guo Yìndù ma?"
              },
              {
                "py": "Wǒ shì Yìndù rén."
              }
            ],
            "answer": 1,
            "why": "Nǐ lái guo ... ma? visit ka sawaal hai. Wǒ cóng ... apna origin batata hai."
          },
          {
            "q": "Kaunsi line Mandarin learning ko ongoing practice batati hai?",
            "choices": [
              {
                "py": "Wǒ zài xué Zhōngwén."
              },
              {
                "py": "Wǒ huì shuō Yīngyǔ."
              },
              {
                "py": "Wǒ lái Zhōngguó lǚyóu."
              }
            ],
            "answer": 0,
            "why": "Zài xué = seekh raha/rahi hoon. Yīngyǔ English hai; lǚyóu travel hai."
          },
          {
            "q": "Bú tài hǎo mein bú kyun hai?",
            "choices": [
              "Tài Tone 4 hai; 不 ka spoken tone bú banta hai",
              "Har 不 hamesha bú hota hai",
              "Hǎo Tone 3 hai; isi liye bú hota hai"
            ],
            "answer": 0,
            "why": "不 ka tone turant agle syllable tài se badalta hai. Tài Tone 4 hai. Har 不 bú nahi hota; bù hǎo mein bù rehta hai."
          }
        ]
      }
    ]
  },
  {
    "id": "bas-04",
    "icon": "🔢",
    "title": "Ginti aur milne ka time",
    "goal": "0–10 bolo, do log ke liye liǎng use karo aur 3:30 ka time pehchaano.",
    "scene": {
      "img": "👫🍜🕞",
      "text": "Dinner ka plan ban raha hai. Dost ne sān diǎn bàn bola. Meeting ka sahi time samajhna hai.",
      "ask": "3:30 ko Mandarin mein kaise bologe?",
      "choices": [
        {
          "py": "Sān diǎn bàn.",
          "ok": true,
          "why": "Sān = 3; diǎn = baje; bàn = aadha. Time 3:30 hai."
        },
        {
          "py": "Sān diǎn.",
          "ok": false,
          "why": "Yeh 3:00 hai. Bàn chhodne se aadha ghanta badal jaata hai."
        }
      ]
    },
    "phrases": [
      {
        "id": "bas-count-one-three",
        "zh": "一，二，三。",
        "py": "Yī, èr, sān.",
        "hi": "Ek, do, teen.",
        "img": "1️⃣2️⃣3️⃣",
        "who": "you",
        "note": "Counting mein 一 yī rehta hai. Èr = ginti wala do."
      },
      {
        "id": "bas-count-four-six",
        "zh": "四，五，六。",
        "py": "Sì, wǔ, liù.",
        "hi": "Chaar, paanch, chhe.",
        "img": "4️⃣5️⃣6️⃣",
        "who": "you",
        "note": "Sì mein zubaan peeche mat modho; shí ke sh se sound alag hai."
      },
      {
        "id": "bas-count-seven-ten",
        "zh": "七，八，九，十。",
        "py": "Qī, bā, jiǔ, shí.",
        "hi": "Saat, aath, nau, dus.",
        "img": "7️⃣8️⃣9️⃣🔟",
        "who": "you",
        "note": "Qī mein hawa nikalo. Shí mein zubaan thodi peeche rakho."
      },
      {
        "id": "bas-count-zero",
        "zh": "零。",
        "py": "Líng.",
        "hi": "Zero.",
        "img": "0️⃣",
        "who": "you",
        "note": "Phone number mein zero líng hai. Number 1 aksar yāo bola jaata hai."
      },
      {
        "id": "bas-two-people",
        "zh": "两个人。",
        "py": "Liǎng ge rén.",
        "hi": "Do log.",
        "img": "👫",
        "who": "you",
        "note": "Quantity + measure word mein do log = liǎng ge rén; èr ge rén mat yaad karo."
      },
      {
        "id": "bas-current-time",
        "zh": "现在几点？",
        "py": "Xiànzài jǐ diǎn?",
        "hi": "Abhi kitne baje hain?",
        "img": "🕒❓",
        "who": "you",
        "note": "Xiànzài = abhi. Jǐ diǎn = kitne baje."
      },
      {
        "id": "bas-three-thirty",
        "zh": "三点半。",
        "py": "Sān diǎn bàn.",
        "hi": "Saadhe teen baje.",
        "img": "🕞",
        "who": "you",
        "note": "Bàn = aadha. Sān diǎn 3:00; sān diǎn bàn 3:30."
      },
      {
        "id": "bas-today-tomorrow",
        "zh": "今天还是明天？",
        "py": "Jīntiān háishi míngtiān?",
        "hi": "Aaj ya kal?",
        "img": "📅↔️",
        "who": "you",
        "note": "Jīntiān = aaj; míngtiān = aane wala kal. Háishi choice poochhta hai."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "explain",
        "cards": [
          {
            "h": "Èr aur liǎng kab bolte hain?",
            "text": "Ginti bolo: yī, èr, sān. Do log bolo: liǎng ge rén. Phone number ke digits alag-alag bolo; 1 ke liye yāo common hai. Time mein bàn ka matlab aadha ghanta hai."
          }
        ]
      },
      {
        "type": "dialogue",
        "title": "Meeting ka din aur time",
        "lines": [
          {
            "who": "lili",
            "zh": "我们三点半见吧。",
            "py": "Wǒmen sān diǎn bàn jiàn ba.",
            "hi": "Saadhe teen baje milte hain."
          },
          {
            "who": "you",
            "zh": "今天还是明天？",
            "py": "Jīntiān háishi míngtiān?",
            "hi": "Aaj ya kal?",
            "choices": [
              {
                "py": "Xiànzài jǐ diǎn?",
                "hi": "Abhi kitne baje hain?",
                "why": "Plan ka din missing hai. Abhi ka time poochhne se plan ka din clear nahi hoga."
              }
            ]
          },
          {
            "who": "lili",
            "zh": "明天。",
            "py": "Míngtiān.",
            "hi": "Kal."
          },
          {
            "who": "you",
            "zh": "明天三点半见。",
            "py": "Míngtiān sān diǎn bàn jiàn.",
            "hi": "Kal saadhe teen baje milte hain.",
            "choices": [
              {
                "py": "Míngtiān sān diǎn jiàn.",
                "hi": "Kal teen baje milte hain.",
                "why": "Bàn chhoot gaya. Dinner plan ka time 3:30 hai, 3:00 nahi."
              }
            ]
          },
          {
            "who": "lili",
            "zh": "好，明天见！",
            "py": "Hǎo, míngtiān jiàn!",
            "hi": "Theek hai, kal milte hain!"
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
            "q": "Sān diǎn bàn ka time kya hai?",
            "choices": [
              "3:30",
              "3:00",
              "2:30"
            ],
            "answer": 0,
            "why": "Sān = teen; bàn = aadha. 3:00 ke liye sān diǎn, 3:30 ke liye sān diǎn bàn."
          },
          {
            "q": "Restaurant mein do log hain. Natural quantity kya hai?",
            "choices": [
              {
                "py": "Liǎng ge rén."
              },
              {
                "py": "Èr shí ge rén."
              },
              {
                "py": "Yí ge rén."
              }
            ],
            "answer": 0,
            "why": "Liǎng ge rén = do log. Èr shí = bees; yí ge = ek."
          },
          {
            "q": "Plan aaj hai ya kal, clear karna hai.",
            "choices": [
              {
                "py": "Jīntiān háishi míngtiān?"
              },
              {
                "py": "Xiànzài jǐ diǎn?"
              },
              {
                "py": "Sān diǎn bàn."
              }
            ],
            "answer": 0,
            "why": "Jīntiān / míngtiān aaj aur kal hain. Xiànzài jǐ diǎn abhi ka clock time poochhta hai."
          }
        ]
      }
    ]
  }
]);
