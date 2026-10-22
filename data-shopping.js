/* Track: shopping — Hinglish speaking practice. Check: node validate.js --track shopping --py */
MG.registerLevels("shopping", [
  {
    "id": "shp-01",
    "icon": "🏷️",
    "title": "Price: chaudah ya chaalees?",
    "goal": "Price poochho, 14 aur 40 ka farq pehchaano aur market mein politely poochho.",
    "scene": {
      "img": "🛍️🏷️❓",
      "text": "Market mein ek chhota gift pasand aaya. Price tag dikh nahi raha. Seller se gift ki price poochhni hai.",
      "ask": "Gift ki taraf ishara karke kya bologe?",
      "choices": [
        {
          "py": "Zhège duōshao qián?",
          "ok": true,
          "why": "Duōshao qián = kitne paise."
        },
        {
          "py": "Wǒ yào zhège.",
          "ok": false,
          "why": "Yeh kharidne ki choice batata hai; price nahi poochhta."
        }
      ]
    },
    "phrases": [
      {
        "id": "shp-how-much",
        "zh": "这个多少钱？",
        "py": "Zhège duōshao qián?",
        "hi": "Yeh kitne ka hai?",
        "img": "🏷️❓",
        "who": "you",
        "note": "Gift ya item ki taraf ishara karke bolo."
      },
      {
        "id": "shp-per-jin",
        "zh": "一斤多少钱？",
        "py": "Yì jīn duōshao qián?",
        "hi": "Aadha kilo kitne ka hai?",
        "img": "⚖️🍎",
        "who": "you",
        "note": "Mainland China mein ek jīn = 500 g. Kilogram ke liye gōngjīn alag word hai."
      },
      {
        "id": "shp-forty",
        "zh": "四十块。",
        "py": "Sìshí kuài.",
        "hi": "Chaalees yuan.",
        "img": "💴4️⃣0️⃣",
        "who": "seller",
        "note": "Sì = 4; shí = 10. Sìshí = 4 × 10."
      },
      {
        "id": "shp-fourteen",
        "zh": "十四块。",
        "py": "Shísì kuài.",
        "hi": "Chaudah yuan.",
        "img": "💴1️⃣4️⃣",
        "who": "seller",
        "note": "Shí = 10; sì = 4. Shísì = 10 + 4."
      },
      {
        "id": "shp-expensive",
        "zh": "太贵了。",
        "py": "Tài guì le.",
        "hi": "Kaafi mehenga hai.",
        "img": "🏷️😬",
        "who": "you",
        "note": "Price sunne ke baad bolo. Tone ko friendly rakho."
      },
      {
        "id": "shp-cheaper",
        "zh": "能便宜一点儿吗？",
        "py": "Néng piányi yìdiǎnr ma?",
        "hi": "Kya thoda sasta kar sakte hain?",
        "img": "🏷️⬇️",
        "who": "you",
        "note": "Negotiation waale stall par poochho. Fixed-price shop mein discount guaranteed nahi."
      },
      {
        "id": "shp-browse",
        "zh": "我再看看。",
        "py": "Wǒ zài kànkan.",
        "hi": "Main thoda aur dekhunga/dekhungi.",
        "img": "👀🛍️",
        "who": "you",
        "note": "Bina kharide aage dekhne ka polite jawab."
      },
      {
        "id": "shp-want-this",
        "zh": "我要这个。",
        "py": "Wǒ yào zhège.",
        "hi": "Mujhe yeh lena hai.",
        "img": "☝️🛍️",
        "who": "you",
        "note": "Item ki taraf ishara karo. Yào Tone 4 hai; yǎo nahi."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Market mein price confirm",
        "lines": [
          {
            "who": "you",
            "zh": "这个多少钱？",
            "py": "Zhège duōshao qián?",
            "hi": "Yeh kitne ka hai?",
            "choices": [
              {
                "py": "Wǒ yào zhège.",
                "hi": "Mujhe yeh lena hai.",
                "why": "Pehle price poochhni hai. Yào zhège kharidne ki choice bata deta hai."
              }
            ]
          },
          {
            "who": "seller",
            "zh": "四十块。",
            "py": "Sìshí kuài.",
            "hi": "Chaalees yuan."
          },
          {
            "who": "you",
            "zh": "能便宜一点儿吗？",
            "py": "Néng piányi yìdiǎnr ma?",
            "hi": "Kya thoda sasta kar sakte hain?",
            "choices": [
              {
                "py": "Yì jīn duōshao qián?",
                "hi": "Aadha kilo kitne ka hai?",
                "why": "Gift ka discount poochhna hai. Jīn weight ke hisaab se bike items ke liye hai."
              }
            ]
          },
          {
            "who": "seller",
            "zh": "三十五块。",
            "py": "Sānshíwǔ kuài.",
            "hi": "Paintis yuan."
          },
          {
            "who": "you",
            "zh": "我要这个。",
            "py": "Wǒ yào zhège.",
            "hi": "Mujhe yeh lena hai."
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
            "q": "Seller Shísì kuài bolta hai. Amount kya hai?",
            "choices": [
              "Chaudah yuan",
              "Chaalees yuan",
              "Chaar yuan"
            ],
            "answer": 0,
            "why": "Shí + sì = 10 + 4 = 14. Sìshí mein order badalta hai: 4 × 10 = 40."
          },
          {
            "q": "Fruit seller ke yahaan Yì jīn ka weight kya hai?",
            "choices": [
              "500 gram",
              "1 kilogram",
              "100 gram"
            ],
            "answer": 0,
            "why": "Mainland jīn 500 gram hota hai. Ek kilogram ke liye liǎng jīn ya yì gōngjīn bolo."
          },
          {
            "q": "Gift abhi nahi kharidna. Aur shops dekhni hain.",
            "choices": [
              {
                "py": "Wǒ yào zhège."
              },
              {
                "py": "Wǒ zài kànkan."
              },
              {
                "py": "Néng piányi yìdiǎnr ma?"
              }
            ],
            "answer": 1,
            "why": "Zài kànkan = thoda aur dekhna. Yào zhège kharidne ki choice hai; piányi discount maangta hai."
          }
        ]
      }
    ]
  },
  {
    "id": "shp-02",
    "icon": "💳",
    "title": "Payment: QR, cash ya card?",
    "goal": "Payment ka tareeqa poochho, QR ka turn clear karo aur payment status batao.",
    "scene": {
      "img": "🛍️📱💳",
      "text": "Convenience store par total ready hai. WeChat payment chalega ya nahi, confirm karna hai.",
      "ask": "Kaunsa sawaal poochhoge?",
      "choices": [
        {
          "py": "Kěyǐ yòng Wēixìn ma?",
          "ok": true,
          "why": "WeChat se payment possible hai ya nahi, seedhe poochha."
        },
        {
          "py": "Wǒ yǐjīng fù le.",
          "ok": false,
          "why": "Yeh payment ho jaane ka claim hai; payment method ka sawaal nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "shp-wechat-pay",
        "zh": "可以用微信吗？",
        "py": "Kěyǐ yòng Wēixìn ma?",
        "hi": "WeChat se payment kar sakte hain?",
        "img": "📱💚",
        "who": "you",
        "note": "Wēixìn = WeChat. Merchant aur aapke account ka support alag se confirm hoga."
      },
      {
        "id": "shp-alipay",
        "zh": "可以用支付宝吗？",
        "py": "Kěyǐ yòng Zhīfùbǎo ma?",
        "hi": "Alipay se payment kar sakte hain?",
        "img": "📱💙",
        "who": "you",
        "note": "Zhīfùbǎo = Alipay. App setup ka promise nahi; payment option poochhne ki line hai."
      },
      {
        "id": "shp-who-scans",
        "zh": "我扫你还是你扫我？",
        "py": "Wǒ sǎo nǐ háishi nǐ sǎo wǒ?",
        "hi": "Main tumhara QR scan karoon ya tum mera?",
        "img": "📱🔲↔️",
        "who": "you",
        "note": "Háishi = ya, choice ke sawaal mein. Wǒ / nǐ se scanner ka turn badalta hai."
      },
      {
        "id": "shp-cash",
        "zh": "收现金吗？",
        "py": "Shōu xiànjīn ma?",
        "hi": "Cash lete hain?",
        "img": "💵❓",
        "who": "you",
        "note": "Xiànjīn = cash. Payment se pehle merchant se poochho."
      },
      {
        "id": "shp-card",
        "zh": "可以刷卡吗？",
        "py": "Kěyǐ shuākǎ ma?",
        "hi": "Card se pay kar sakte hain?",
        "img": "💳❓",
        "who": "you",
        "note": "Shuākǎ = card se payment. Apna specific card accepted hai ya nahi, terminal par confirm karo."
      },
      {
        "id": "shp-paid",
        "zh": "我已经付了。",
        "py": "Wǒ yǐjīng fù le.",
        "hi": "Main payment kar chuka/chuki hoon.",
        "img": "📱✅",
        "who": "you",
        "note": "Sirf actual success ke baad bolo. Confirmation merchant ko dikhane ke liye ready rakho."
      },
      {
        "id": "shp-wait",
        "zh": "请等一下。",
        "py": "Qǐng děng yíxià.",
        "hi": "Please ek moment rukiye.",
        "img": "✋⏳",
        "who": "you",
        "note": "Payment app kholne ya cash nikaalne ke liye time maango."
      },
      {
        "id": "shp-bag-question",
        "zh": "需要袋子吗？",
        "py": "Xūyào dàizi ma?",
        "hi": "Bag chahiye?",
        "img": "🛍️❓",
        "who": "staff",
        "note": "Cashier ka common sawaal. Dàizi ka zi halka hai."
      }
    ],
    "stages": [
      {
        "type": "learn"
      },
      {
        "type": "dialogue",
        "title": "Counter par QR payment",
        "lines": [
          {
            "who": "you",
            "zh": "可以用微信吗？",
            "py": "Kěyǐ yòng Wēixìn ma?",
            "hi": "WeChat se payment kar sakte hain?",
            "choices": [
              {
                "py": "Wǒ yǐjīng fù le.",
                "hi": "Payment ho gayi hai.",
                "why": "Payment abhi nahi hui. Pehle accepted method poochho."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "可以。",
            "py": "Kěyǐ.",
            "hi": "Haan, kar sakte hain."
          },
          {
            "who": "you",
            "zh": "我扫你还是你扫我？",
            "py": "Wǒ sǎo nǐ háishi nǐ sǎo wǒ?",
            "hi": "Main tumhara QR scan karoon ya tum mera?"
          },
          {
            "who": "staff",
            "zh": "你扫我。",
            "py": "Nǐ sǎo wǒ.",
            "hi": "Tum mera QR scan karo."
          },
          {
            "who": "you",
            "zh": "请等一下。",
            "py": "Qǐng děng yíxià.",
            "hi": "Please ek moment rukiye.",
            "choices": [
              {
                "py": "Shōu xiànjīn ma?",
                "hi": "Cash lete hain?",
                "why": "WeChat method confirm hai; app kholne ke liye sirf waqt chahiye."
              }
            ]
          },
          {
            "who": "you",
            "zh": "我已经付了。",
            "py": "Wǒ yǐjīng fù le.",
            "hi": "Payment ho gayi hai."
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
            "q": "Cashier Nǐ sǎo wǒ bolta hai. Scanner kaun use karega?",
            "choices": [
              "Aap cashier ka QR scan karoge",
              "Cashier aapka QR scan karega",
              "Dono ko QR scan nahi karna"
            ],
            "answer": 0,
            "why": "Cashier ke sentence mein nǐ aap ho. Nǐ sǎo wǒ = aap cashier ka QR scan karo."
          },
          {
            "q": "App mein payment failed hai. Dobara try karne ko waqt chahiye.",
            "choices": [
              {
                "py": "Wǒ yǐjīng fù le."
              },
              {
                "py": "Qǐng děng yíxià."
              },
              {
                "py": "Xūyào dàizi ma?"
              }
            ],
            "answer": 1,
            "why": "Děng yíxià = ek moment wait. Failed payment par yǐjīng fù le bolna galat status batata hai."
          },
          {
            "q": "Cash backup use karna hai. Acceptance kaise poochhoge?",
            "choices": [
              {
                "py": "Kěyǐ shuākǎ ma?"
              },
              {
                "py": "Shōu xiànjīn ma?"
              },
              {
                "py": "Kěyǐ yòng Wēixìn ma?"
              }
            ],
            "answer": 1,
            "why": "Xiànjīn = cash. Shuākǎ card ke liye hai; Wēixìn mobile app hai."
          }
        ]
      }
    ]
  }
]);
