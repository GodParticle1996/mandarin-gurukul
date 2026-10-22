/* Track: travel — Hinglish speaking practice. Check: node validate.js --track travel --py */
MG.registerLevels("travel", [
  {
    "id": "trv-01",
    "icon": "🚕",
    "title": "Taxi: address dikhao, stop batao",
    "goal": "Driver ko destination dikhao, pickup location batao aur safe stop maango.",
    "scene": {
      "img": "🚕📱📍",
      "text": "Taxi mil gayi. Hotel ka Chinese address phone par saved hai. Address padhne ke bajaye phone dikha kar driver ko destination batana hai.",
      "ask": "Phone dikhate hue kya bologe?",
      "choices": [
        {
          "py": "Qǐng qù zhège dìfang.",
          "ok": true,
          "why": "Driver se phone par dikhaye address par jaane ko kaha."
        },
        {
          "py": "Qǐng zài zhèr tíng.",
          "ok": false,
          "why": "Yeh gaadi rokne ki request hai, destination par jaane ki nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "trv-driver-hello",
        "zh": "师傅，您好！",
        "py": "Shīfu, nín hǎo!",
        "hi": "Driver ji, namaste!",
        "img": "🚕🙏",
        "who": "you",
        "note": "Shīfu driver ko address karne ka common respectful tareeqa hai. Fu halka hai."
      },
      {
        "id": "trv-this-place",
        "zh": "请去这个地方。",
        "py": "Qǐng qù zhège dìfang.",
        "hi": "Please phone par dikhaye address par chaliye.",
        "img": "📱📍",
        "who": "you",
        "note": "Chinese address ya map pin dikhate hue bolo. Dìfang ka fang neutral hai."
      },
      {
        "id": "trv-at-entrance",
        "zh": "我在门口。",
        "py": "Wǒ zài ménkǒu.",
        "hi": "Main entrance par hoon.",
        "img": "🚪🙋",
        "who": "you",
        "note": "Pickup call par gate ka naam ya number bhi share karo."
      },
      {
        "id": "trv-how-long",
        "zh": "大概要多长时间？",
        "py": "Dàgài yào duō cháng shíjiān?",
        "hi": "Lagbhag kitna time lagega?",
        "img": "🚕⏱️",
        "who": "you",
        "note": "Dàgài = lagbhag. Traffic ke saath driver ka estimate badal sakta hai."
      },
      {
        "id": "trv-stop-here",
        "zh": "请在这儿停。",
        "py": "Qǐng zài zhèr tíng.",
        "hi": "Please yahaan gaadi rokiye.",
        "img": "🚕🛑",
        "who": "you",
        "note": "Stop ki request do; driver ko safe jagah chunne do."
      },
      {
        "id": "trv-stop-ahead",
        "zh": "前面停一下。",
        "py": "Qiánmian tíng yíxià.",
        "hi": "Thoda aage gaadi rok dijiye.",
        "img": "🚕⬆️🛑",
        "who": "you",
        "note": "Qiánmian = aage. 一下 yíxià request ko chhota aur casual banata hai."
      },
      {
        "id": "trv-arrived-question",
        "zh": "到了吗？",
        "py": "Dào le ma?",
        "hi": "Kya destination aa gaya?",
        "img": "📍❓",
        "who": "you",
        "note": "Dào = pahunchna. Le ko chhota bolo."
      },
      {
        "id": "trv-driver-thanks",
        "zh": "谢谢师傅！",
        "py": "Xièxie shīfu!",
        "hi": "Shukriya, driver ji!",
        "img": "🚕🙏",
        "who": "you",
        "note": "Ride khatam hone par chhoti friendly line."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Taxi mein hotel ka address",
        "lines": [
          {
            "who": "driver",
            "zh": "去哪儿？",
            "py": "Qù nǎr?",
            "hi": "Kahaan jaana hai?"
          },
          {
            "who": "you",
            "zh": "请去这个地方。",
            "py": "Qǐng qù zhège dìfang.",
            "hi": "Please phone par dikhaye address par chaliye.",
            "choices": [
              {
                "py": "Wǒ zài ménkǒu.",
                "hi": "Main entrance par hoon.",
                "why": "Aap taxi mein baithe ho. Driver ko ab destination chahiye, pickup location nahi."
              }
            ]
          },
          {
            "who": "driver",
            "zh": "好。",
            "py": "Hǎo.",
            "hi": "Theek hai."
          },
          {
            "who": "you",
            "zh": "大概要多长时间？",
            "py": "Dàgài yào duō cháng shíjiān?",
            "hi": "Lagbhag kitna time lagega?"
          },
          {
            "who": "driver",
            "zh": "大概二十分钟。",
            "py": "Dàgài èrshí fēnzhōng.",
            "hi": "Lagbhag bees minute."
          },
          {
            "who": "you",
            "zh": "谢谢师傅！",
            "py": "Xièxie shīfu!",
            "hi": "Shukriya, driver ji!"
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
            "q": "Driver pickup ke liye phone karta hai. Aap building ke entrance par ho.",
            "choices": [
              {
                "py": "Wǒ zài ménkǒu."
              },
              {
                "py": "Dào le ma?"
              },
              {
                "py": "Qiánmian tíng yíxià."
              }
            ],
            "answer": 0,
            "why": "Ménkǒu = entrance. Dào le ma? driver se arrival poochhta hai; aapki location nahi batata."
          },
          {
            "q": "Hotel ka address phone par dikhaya. Travel duration poochho.",
            "choices": [
              {
                "py": "Qǐng zài zhèr tíng."
              },
              {
                "py": "Dàgài yào duō cháng shíjiān?"
              },
              {
                "py": "Shīfu, nín hǎo!"
              }
            ],
            "answer": 1,
            "why": "Duō cháng shíjiān = kitna time. Tíng gaadi rokne ko kehta hai."
          },
          {
            "q": "Gaadi thoda aage rukwani hai. Kaunsi line mein aage ka cue hai?",
            "choices": [
              {
                "py": "Qiánmian tíng yíxià."
              },
              {
                "py": "Wǒ zài ménkǒu."
              },
              {
                "py": "Qǐng qù zhège dìfang."
              }
            ],
            "answer": 0,
            "why": "Qiánmian = aage. Qù zhège dìfang destination ki line hai, stopping point ki nahi."
          }
        ]
      }
    ]
  },
  {
    "id": "trv-02",
    "icon": "🧭",
    "title": "Raasta: left, right aur seedha",
    "goal": "Washroom ka raasta poochho aur teen basic direction shabd pehchaano.",
    "scene": {
      "img": "🚶🚻❓",
      "text": "Market mein washroom chahiye. Sign samajh nahi aa raha. Paas ke staff se washroom ka location poochhna hai.",
      "ask": "Kaunsa sawaal kaam karega?",
      "choices": [
        {
          "py": "Qǐngwèn, xǐshǒujiān zài nǎr?",
          "ok": true,
          "why": "Xǐshǒujiān = washroom. Zài nǎr = kahaan hai."
        },
        {
          "py": "Qǐng zài shuō yí biàn.",
          "ok": false,
          "why": "Yeh pehle kahi baat dohraane ki request hai; pehla sawaal nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "trv-toilet-where",
        "zh": "请问，洗手间在哪儿？",
        "py": "Qǐngwèn, xǐshǒujiān zài nǎr?",
        "hi": "Excuse me, washroom kahaan hai?",
        "img": "🚻❓",
        "who": "you",
        "note": "Qǐngwèn sawaal ki polite shuruaat hai."
      },
      {
        "id": "trv-how-walk",
        "zh": "怎么走？",
        "py": "Zěnme zǒu?",
        "hi": "Raasta kaise jaata hai?",
        "img": "🚶🧭",
        "who": "you",
        "note": "Pehle destination clear karo, phir zěnme zǒu poochho."
      },
      {
        "id": "trv-go-forward",
        "zh": "往前走。",
        "py": "Wǎng qián zǒu.",
        "hi": "Aage chalo.",
        "img": "🚶⬆️",
        "who": "stranger",
        "note": "Raasta batane wale ka common instruction."
      },
      {
        "id": "trv-turn-left",
        "zh": "左转。",
        "py": "Zuǒ zhuǎn.",
        "hi": "Left mudho.",
        "img": "⬅️",
        "who": "stranger",
        "note": "Zuǒ = left. Zhuǎn = mudna."
      },
      {
        "id": "trv-turn-right",
        "zh": "右转。",
        "py": "Yòu zhuǎn.",
        "hi": "Right mudho.",
        "img": "➡️",
        "who": "stranger",
        "note": "Yòu = right; yòu Tone 4 mein neeche girta hai."
      },
      {
        "id": "trv-straight",
        "zh": "一直走。",
        "py": "Yìzhí zǒu.",
        "hi": "Seedha chalte jao.",
        "img": "🚶⬆️⬆️",
        "who": "stranger",
        "note": "Yìzhí = lagataar / seedha. 一 zhí se pehle yì hai."
      },
      {
        "id": "trv-far-question",
        "zh": "远吗？",
        "py": "Yuǎn ma?",
        "hi": "Kya door hai?",
        "img": "📍↔️❓",
        "who": "you",
        "note": "Yuǎn mein hoth gol rakhkar ü wala sound shuru hota hai."
      },
      {
        "id": "trv-repeat-directions",
        "zh": "请再说一遍。",
        "py": "Qǐng zài shuō yí biàn.",
        "hi": "Please ek baar phir bataiye.",
        "img": "🔁💬",
        "who": "you",
        "note": "Zài = phir; yí biàn = ek baar. Guess karke galat turn mat lo."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Washroom tak do turns",
        "lines": [
          {
            "who": "you",
            "zh": "请问，洗手间在哪儿？",
            "py": "Qǐngwèn, xǐshǒujiān zài nǎr?",
            "hi": "Excuse me, washroom kahaan hai?",
            "choices": [
              {
                "py": "Yuǎn ma?",
                "hi": "Kya door hai?",
                "why": "Destination bataye bina sirf doori poochhne se staff ko washroom ka context nahi milta."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "往前走，右转。",
            "py": "Wǎng qián zǒu, yòu zhuǎn.",
            "hi": "Aage chalo, phir right mudho."
          },
          {
            "who": "you",
            "zh": "请再说一遍。",
            "py": "Qǐng zài shuō yí biàn.",
            "hi": "Please ek baar phir bataiye.",
            "choices": [
              {
                "py": "Zuǒ zhuǎn.",
                "hi": "Left mudho.",
                "why": "Aapko instruction repeat chahiye. Zuǒ zhuǎn bolkar khud left turn ka instruction doge."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "一直走，右转。",
            "py": "Yìzhí zǒu, yòu zhuǎn.",
            "hi": "Seedha jao, phir right mudho."
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
            "q": "Staff ne Yòu zhuǎn bola. Kaunsi direction?",
            "choices": [
              {
                "py": "Yòu zhuǎn."
              },
              {
                "py": "Zuǒ zhuǎn."
              },
              {
                "py": "Yìzhí zǒu."
              }
            ],
            "answer": 0,
            "why": "Yòu zhuǎn = right mudho. Zuǒ zhuǎn = left; yìzhí zǒu = seedha. Screen ke right arrow ko imagine karke bolo."
          },
          {
            "q": "Raasta samajh nahi aaya. Dobara batane ki request karo.",
            "choices": [
              {
                "py": "Qǐng zài shuō yí biàn."
              },
              {
                "py": "Wǎng qián zǒu."
              },
              {
                "py": "Zuǒ zhuǎn."
              }
            ],
            "answer": 0,
            "why": "Zài shuō yí biàn = ek baar phir boliye. Baaki options raasta dete hain; repeat nahi maangte."
          },
          {
            "q": "Washroom ka location poochh liya. Ab poochhna hai: door hai kya?",
            "choices": [
              {
                "py": "Zěnme zǒu?"
              },
              {
                "py": "Yuǎn ma?"
              },
              {
                "py": "Yòu zhuǎn."
              }
            ],
            "answer": 1,
            "why": "Yuǎn = door. Zěnme zǒu route poochhta hai; doori ka direct sawaal Yuǎn ma? hai."
          }
        ]
      }
    ]
  },
  {
    "id": "trv-03",
    "icon": "🚇",
    "title": "Metro: line, direction aur exit",
    "goal": "Metro line aur transfer poochho; direction aur exit confirm karo.",
    "scene": {
      "img": "🚇🗺️❓",
      "text": "Beijing Railway Station jaana hai. Metro station mil gaya, par line number nahi pata. Staff se line number poochhna hai.",
      "ask": "Line number kaise poochhoge?",
      "choices": [
        {
          "py": "Qù Běijīngzhàn zuò jǐ hào xiàn?",
          "ok": true,
          "why": "Jǐ hào xiàn = kaunsi numbered line."
        },
        {
          "py": "Cóng jǐ hào chūkǒu chū?",
          "ok": false,
          "why": "Yeh exit number poochhta hai, metro line nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "trv-metro-where",
        "zh": "地铁站在哪儿？",
        "py": "Dìtiězhàn zài nǎr?",
        "hi": "Metro station kahaan hai?",
        "img": "🚇📍",
        "who": "you",
        "note": "Dìtiě = metro. Zhàn = station."
      },
      {
        "id": "trv-metro-line",
        "zh": "去北京站坐几号线？",
        "py": "Qù Běijīngzhàn zuò jǐ hào xiàn?",
        "hi": "Beijing Railway Station ke liye kaunsi metro line loon?",
        "img": "🚉🚇❓",
        "who": "you",
        "note": "Běijīngzhàn ek specific railway station hai; Beijing South aur Beijing West alag stations hain."
      },
      {
        "id": "trv-transfer-where",
        "zh": "在哪儿换乘？",
        "py": "Zài nǎr huànchéng?",
        "hi": "Transfer kahaan karna hai?",
        "img": "🚇🔁🚇",
        "who": "you",
        "note": "Huànchéng = ek line se doosri line mein badalna."
      },
      {
        "id": "trv-wrong-direction",
        "zh": "我坐错方向了。",
        "py": "Wǒ zuò cuò fāngxiàng le.",
        "hi": "Main galat direction ki metro mein chadh gaya/gayi.",
        "img": "🚇↩️",
        "who": "you",
        "note": "Cuò = galat. Staff ko problem seedhe batao."
      },
      {
        "id": "trv-next-station",
        "zh": "下一站是哪儿？",
        "py": "Xià yí zhàn shì nǎr?",
        "hi": "Agla station kaunsa hai?",
        "img": "🚇➡️📍",
        "who": "you",
        "note": "一 zhàn (Tone 4) se pehle yí hai."
      },
      {
        "id": "trv-exit-number",
        "zh": "从几号出口出？",
        "py": "Cóng jǐ hào chūkǒu chū?",
        "hi": "Kaunse number ke exit se nikloon?",
        "img": "🚪🔢❓",
        "who": "you",
        "note": "Meeting ke liye station ke saath exit number bhi confirm karo."
      },
      {
        "id": "trv-metro-direction",
        "zh": "请问，往哪个方向？",
        "py": "Qǐngwèn, wǎng nǎge fāngxiàng?",
        "hi": "Excuse me, kis direction mein jaana hai?",
        "img": "🚇↔️❓",
        "who": "you",
        "note": "Destination ya map dikhakar sawaal poochho."
      },
      {
        "id": "trv-security-check",
        "zh": "请先安检。",
        "py": "Qǐng xiān ānjiǎn.",
        "hi": "Please pehle security check karwaiye.",
        "img": "🎒🔍",
        "who": "staff",
        "note": "Station staff ki line. Ānjiǎn = security check."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Station staff se route confirm",
        "lines": [
          {
            "who": "you",
            "zh": "去北京站坐几号线？",
            "py": "Qù Běijīngzhàn zuò jǐ hào xiàn?",
            "hi": "Beijing Railway Station ke liye kaunsi metro line loon?",
            "choices": [
              {
                "py": "Cóng jǐ hào chūkǒu chū?",
                "hi": "Kaunse exit se nikloon?",
                "why": "Aapko pehle line chahiye. Exit ka sawaal station se nikalte waqt kaam aata hai."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "您现在在哪儿？",
            "py": "Nín xiànzài zài nǎr?",
            "hi": "Aap abhi kahaan hain?"
          },
          {
            "who": "you",
            "zh": "我在这儿。",
            "py": "Wǒ zài zhèr.",
            "hi": "Main map par dikhayi jagah par hoon."
          },
          {
            "who": "staff",
            "zh": "我帮您看看。",
            "py": "Wǒ bāng nín kànkan.",
            "hi": "Main aapka route check kar deta/deti hoon."
          },
          {
            "who": "you",
            "zh": "在哪儿换乘？",
            "py": "Zài nǎr huànchéng?",
            "hi": "Transfer kahaan karna hai?",
            "choices": [
              {
                "py": "Xià yí zhàn shì nǎr?",
                "hi": "Agla station kaunsa hai?",
                "why": "Aapko line badalne ka station chahiye. Agla station zaroori nahi ki transfer station ho."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "我给您指一下。",
            "py": "Wǒ gěi nín zhǐ yíxià.",
            "hi": "Main map par dikha deta/deti hoon."
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
            "q": "Staff route dikha raha hai. Line change ka station kaise poochhoge?",
            "choices": [
              {
                "py": "Zài nǎr huànchéng?"
              },
              {
                "py": "Xià yí zhàn shì nǎr?"
              },
              {
                "py": "Dìtiězhàn zài nǎr?"
              }
            ],
            "answer": 0,
            "why": "Huànchéng = transfer. Xià yí zhàn sirf agla station poochhta hai; dono station alag ho sakte hain."
          },
          {
            "q": "Dost station ke bahar wait karega. Kaunsa detail ab confirm karna hai?",
            "choices": [
              {
                "py": "Cóng jǐ hào chūkǒu chū?"
              },
              {
                "py": "Qǐng xiān ānjiǎn."
              },
              {
                "py": "Wǒ zuò cuò fāngxiàng le."
              }
            ],
            "answer": 0,
            "why": "Chūkǒu = exit. Ānjiǎn security check hai; wrong direction wali line problem batati hai."
          },
          {
            "q": "Metro opposite direction mein ja rahi hai. Staff ko problem batao.",
            "choices": [
              {
                "py": "Wǒ zuò cuò fāngxiàng le."
              },
              {
                "py": "Zài nǎr huànchéng?"
              },
              {
                "py": "Qǐng xiān ānjiǎn."
              }
            ],
            "answer": 0,
            "why": "Cuò fāngxiàng = galat direction. Transfer ka sawaal bolne se galat direction ki problem clear nahi hoti."
          }
        ]
      }
    ]
  },
  {
    "id": "trv-04",
    "icon": "🏨",
    "title": "Hotel: check-in aur room problem",
    "goal": "Booking aur passport batao, checkout poochho aur room problem report karo.",
    "scene": {
      "img": "🧳🏨🛎️",
      "text": "Hotel reception par pahunche. Booking pehle se hai. Receptionist ko pehle booking ke baare mein batana hai.",
      "ask": "Check-in kaise shuru karoge?",
      "choices": [
        {
          "py": "Wǒ yǒu yùdìng.",
          "ok": true,
          "why": "Yùdìng = reservation."
        },
        {
          "py": "Jǐ diǎn tuìfáng?",
          "ok": false,
          "why": "Yeh checkout ka time poochhta hai; booking ka parichay nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "trv-have-booking",
        "zh": "我有预订。",
        "py": "Wǒ yǒu yùdìng.",
        "hi": "Meri reservation hai.",
        "img": "🏨✅",
        "who": "you",
        "note": "Booking name aur confirmation phone par ready rakho."
      },
      {
        "id": "trv-my-passport",
        "zh": "这是我的护照。",
        "py": "Zhè shì wǒ de hùzhào.",
        "hi": "Yeh mera passport hai.",
        "img": "🛂",
        "who": "you",
        "note": "Passport dene ke waqt bolo. Hùzhào mein dono tones girte hain."
      },
      {
        "id": "trv-checkout-time",
        "zh": "几点退房？",
        "py": "Jǐ diǎn tuìfáng?",
        "hi": "Checkout kitne baje hai?",
        "img": "🏨🕛",
        "who": "you",
        "note": "Tuìfáng = checkout. Har hotel ka time confirm karo."
      },
      {
        "id": "trv-breakfast-question",
        "zh": "有早餐吗？",
        "py": "Yǒu zǎocān ma?",
        "hi": "Breakfast available hai?",
        "img": "🥣❓",
        "who": "you",
        "note": "Breakfast available hona aur booking mein included hona alag baatein hain."
      },
      {
        "id": "trv-wifi-password",
        "zh": "WiFi密码是多少？",
        "py": "WiFi mìmǎ shì duōshao?",
        "hi": "WiFi ka password kya hai?",
        "img": "📶🔑",
        "who": "you",
        "note": "Mìmǎ = password. Duōshao ka shao aksar halka hota hai."
      },
      {
        "id": "trv-room-floor",
        "zh": "房间在几楼？",
        "py": "Fángjiān zài jǐ lóu?",
        "hi": "Room kaunsi floor par hai?",
        "img": "🏨🔢",
        "who": "you",
        "note": "Jǐ lóu = kaunsi floor."
      },
      {
        "id": "trv-no-hot-water",
        "zh": "房间没有热水。",
        "py": "Fángjiān méiyǒu rèshuǐ.",
        "hi": "Room mein garam paani nahi aa raha.",
        "img": "🚿❄️",
        "who": "you",
        "note": "Rèshuǐ = garam paani. Problem batao; staff se check karwao."
      },
      {
        "id": "trv-change-room",
        "zh": "能换个房间吗？",
        "py": "Néng huàn ge fángjiān ma?",
        "hi": "Kya room change kar sakte hain?",
        "img": "🛏️🔁",
        "who": "you",
        "note": "Request hai; availability reception confirm karega."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Check-in ki chhoti baat",
        "lines": [
          {
            "who": "staff",
            "zh": "您好！",
            "py": "Nín hǎo!",
            "hi": "Namaste!"
          },
          {
            "who": "you",
            "zh": "我有预订。",
            "py": "Wǒ yǒu yùdìng.",
            "hi": "Meri reservation hai.",
            "choices": [
              {
                "py": "Fángjiān méiyǒu rèshuǐ.",
                "hi": "Room mein garam paani nahi hai.",
                "why": "Abhi check-in shuru ho raha hai. Room problem baad mein report hoti hai."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "请出示护照。",
            "py": "Qǐng chūshì hùzhào.",
            "hi": "Please passport dikhaiye."
          },
          {
            "who": "you",
            "zh": "这是我的护照。",
            "py": "Zhè shì wǒ de hùzhào.",
            "hi": "Yeh mera passport hai."
          },
          {
            "who": "you",
            "zh": "几点退房？",
            "py": "Jǐ diǎn tuìfáng?",
            "hi": "Checkout kitne baje hai?",
            "choices": [
              {
                "py": "Fángjiān zài jǐ lóu?",
                "hi": "Room kaunsi floor par hai?",
                "why": "Checkout ka time poochhna hai. Jǐ lóu floor number poochhta hai."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "中午十二点。",
            "py": "Zhōngwǔ shí'èr diǎn.",
            "hi": "Dopahar baarah baje."
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
            "q": "Receptionist ne passport maanga. Passport dete hue kya bologe?",
            "choices": [
              {
                "py": "Zhè shì wǒ de hùzhào."
              },
              {
                "py": "Wǒ yǒu yùdìng."
              },
              {
                "py": "WiFi mìmǎ shì duōshao?"
              }
            ],
            "answer": 0,
            "why": "Hùzhào = passport. Booking ki line passport identify nahi karti."
          },
          {
            "q": "Shower ka paani garam nahi ho raha. Problem kaise bataoge?",
            "choices": [
              {
                "py": "Fángjiān zài jǐ lóu?"
              },
              {
                "py": "Fángjiān méiyǒu rèshuǐ."
              },
              {
                "py": "Yǒu zǎocān ma?"
              }
            ],
            "answer": 1,
            "why": "Méiyǒu rèshuǐ = garam paani nahi hai. Jǐ lóu floor poochhta hai, maintenance problem nahi."
          },
          {
            "q": "Room problem ke baad room badalne ki request kya hai?",
            "choices": [
              {
                "py": "Néng huàn ge fángjiān ma?"
              },
              {
                "py": "Jǐ diǎn tuìfáng?"
              },
              {
                "py": "Wǒ yǒu yùdìng."
              }
            ],
            "answer": 0,
            "why": "Huàn ge fángjiān = room badalna. Tuìfáng checkout hai; room change ka matlab checkout nahi."
          }
        ]
      }
    ]
  }
]);
