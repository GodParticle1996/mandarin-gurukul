/* Track: emergency — Hinglish speaking practice. Check: node validate.js --track emergency --py */
MG.registerLevels("emergency", [
  {
    "id": "emg-01",
    "icon": "🆘",
    "title": "Madad: kho gaye ya phone gum hai",
    "goal": "Location dikha kar madad maango; phone/passport loss aur police ki zarurat clear karo.",
    "scene": {
      "img": "🚶📱❌",
      "text": "Akele market se nikalte waqt phone nahi mil raha. Shop staff ke paas jaakar pehle problem batani hai.",
      "ask": "Phone gum hone ki line kya hai?",
      "choices": [
        {
          "py": "Wǒ de shǒujī diū le.",
          "ok": true,
          "why": "Shǒujī = phone; diū le = gum ho gaya."
        },
        {
          "py": "Wǒ mílù le.",
          "ok": false,
          "why": "Yeh raasta bhatakne ki problem hai, phone gum hone ki nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "emg-help-please",
        "zh": "请帮帮我。",
        "py": "Qǐng bāng bāng wǒ.",
        "hi": "Please meri madad kijiye.",
        "img": "🙋🆘",
        "who": "you",
        "note": "Problem batane se pehle attention lene ki simple line."
      },
      {
        "id": "emg-lost-way",
        "zh": "我迷路了。",
        "py": "Wǒ mílù le.",
        "hi": "Main raasta bhatak gaya/gayi hoon.",
        "img": "🚶🧭❓",
        "who": "you",
        "note": "Mílù = raasta kho dena; item gum hona diū le hai."
      },
      {
        "id": "emg-phone-lost",
        "zh": "我的手机丢了。",
        "py": "Wǒ de shǒujī diū le.",
        "hi": "Mera phone gum ho gaya.",
        "img": "📱❌",
        "who": "you",
        "note": "Diū le sirf gum hone ko batata hai; chori ka claim nahi."
      },
      {
        "id": "emg-passport-lost",
        "zh": "我的护照丢了。",
        "py": "Wǒ de hùzhào diū le.",
        "hi": "Mera passport gum ho gaya.",
        "img": "🛂❌",
        "who": "you",
        "note": "Hùzhào = passport. Phone aur passport ke words alag rakho."
      },
      {
        "id": "emg-call-help",
        "zh": "能帮我打个电话吗？",
        "py": "Néng bāng wǒ dǎ ge diànhuà ma?",
        "hi": "Kya mere liye ek phone call karne mein madad kar sakte hain?",
        "img": "☎️🙋",
        "who": "you",
        "note": "Trusted contact ka number paper par backup rakhna useful hai."
      },
      {
        "id": "emg-my-address",
        "zh": "这是我的地址。",
        "py": "Zhè shì wǒ de dìzhǐ.",
        "hi": "Yeh mera address hai.",
        "img": "📍📝",
        "who": "you",
        "note": "Saved hotel address ya paper card dikhate hue bolo."
      },
      {
        "id": "emg-call-police",
        "zh": "请帮我报警。",
        "py": "Qǐng bāng wǒ bàojǐng.",
        "hi": "Please police ko report karne mein madad kijiye.",
        "img": "👮☎️",
        "who": "you",
        "note": "Bàojǐng = police ko alert/report karna. Actual police ki zarurat ho tab bolo."
      },
      {
        "id": "emg-police-number",
        "zh": "请打110。",
        "py": "Qǐng dǎ yāo yāo líng.",
        "hi": "Please 110 dial kijiye.",
        "img": "☎️👮",
        "who": "you",
        "note": "Mainland China: police 110. Number mein 1 aksar yāo bolte hain. Medical ambulance 120 hai."
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
            "h": "Help maangte waqt kya ready rakhein?",
            "text": "Hotel ka Chinese address aur trusted contact ka number paper par rakho. Help maangte waqt location aur problem chhoti lines mein batao. Mainland police 110; ambulance 120; fire 119."
          }
        ]
      },
      {
        "type": "dialogue",
        "title": "Shop staff se help",
        "lines": [
          {
            "who": "you",
            "zh": "请帮帮我。",
            "py": "Qǐng bāng bāng wǒ.",
            "hi": "Please meri madad kijiye.",
            "choices": [
              {
                "py": "Xièxie!",
                "hi": "Shukriya!",
                "why": "Staff ne abhi problem nahi jaani. Pehle help maango, phir problem batao."
              }
            ]
          },
          {
            "who": "staff",
            "zh": "怎么了？",
            "py": "Zěnme le?",
            "hi": "Kya hua?"
          },
          {
            "who": "you",
            "zh": "我的手机丢了。",
            "py": "Wǒ de shǒujī diū le.",
            "hi": "Mera phone gum ho gaya.",
            "choices": [
              {
                "py": "Wǒ mílù le.",
                "hi": "Main raasta bhatak gaya/gayi.",
                "why": "Phone nahi mil raha. Mílù route ki problem hai."
              }
            ]
          },
          {
            "who": "you",
            "zh": "能帮我打个电话吗？",
            "py": "Néng bāng wǒ dǎ ge diànhuà ma?",
            "hi": "Kya mere liye ek call karne mein madad kar sakte hain?"
          },
          {
            "who": "staff",
            "zh": "您要打给谁？",
            "py": "Nín yào dǎ gěi shéi?",
            "hi": "Aap kisko call karna chahte hain?"
          },
          {
            "who": "you",
            "zh": "请帮我给朋友打电话。",
            "py": "Qǐng bāng wǒ gěi péngyou dǎ diànhuà.",
            "hi": "Please mere dost ko call karne mein madad kijiye."
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
            "q": "Aapko hotel ka route nahi mil raha. Kaunsi problem line sahi hai?",
            "choices": [
              {
                "py": "Wǒ mílù le."
              },
              {
                "py": "Wǒ de shǒujī diū le."
              },
              {
                "py": "Wǒ de hùzhào diū le."
              }
            ],
            "answer": 0,
            "why": "Mílù = raasta bhatakna. Diū le phone ya passport jaise item gum hone ko batata hai."
          },
          {
            "q": "Police ki emergency help ke liye mainland China ka number kaunsa hai?",
            "choices": [
              "110 — yāo yāo líng",
              "120 — yāo èr líng",
              "119 — yāo yāo jiǔ"
            ],
            "answer": 0,
            "why": "110 police, 120 medical ambulance aur 119 fire service hai. Medical emergency ke liye police number ko ambulance number mat samjho."
          },
          {
            "q": "Passport nahi mil raha. Kaunsi line actual problem batati hai?",
            "choices": [
              {
                "py": "Wǒ de hùzhào diū le."
              },
              {
                "py": "Zhè shì wǒ de dìzhǐ."
              },
              {
                "py": "Wǒ mílù le."
              }
            ],
            "answer": 0,
            "why": "Hùzhào = passport. Dìzhǐ address hai; mílù raasta bhatakna hai."
          }
        ]
      }
    ]
  },
  {
    "id": "emg-02",
    "icon": "🏥",
    "title": "Health aur allergy clearly batao",
    "goal": "Body ki problem aur peanut allergy batao; medical emergency mein ambulance maango.",
    "scene": {
      "img": "🍜🥜⚠️",
      "text": "Restaurant mein peanut allergy batani hai. Sirf peanuts pasand nahi kehna kaafi nahi hai. Allergy ka exact word use karna hai.",
      "ask": "Kaunsi line allergy batati hai?",
      "choices": [
        {
          "py": "Wǒ duì huāshēng guòmǐn.",
          "ok": true,
          "why": "Guòmǐn = allergy; huāshēng = peanut."
        },
        {
          "py": "Wǒ bù xǐhuan huāshēng.",
          "ok": false,
          "why": "Yeh peanuts pasand nahi batata hai; medical allergy nahi."
        }
      ]
    },
    "phrases": [
      {
        "id": "emg-unwell",
        "zh": "我不舒服。",
        "py": "Wǒ bù shūfu.",
        "hi": "Meri tabiyat theek nahi hai.",
        "img": "🤒",
        "who": "you",
        "note": "Shūfu ka fu halka hai. Agli line mein actual symptom batao."
      },
      {
        "id": "emg-headache",
        "zh": "我头疼。",
        "py": "Wǒ tóu téng.",
        "hi": "Mere sir mein dard hai.",
        "img": "🤕",
        "who": "you",
        "note": "Tóu = sir. Téng = dard."
      },
      {
        "id": "emg-stomachache",
        "zh": "我肚子疼。",
        "py": "Wǒ dùzi téng.",
        "hi": "Mere pet mein dard hai.",
        "img": "🤢",
        "who": "you",
        "note": "Dùzi = pet; zi ko halka rakho."
      },
      {
        "id": "emg-peanut-allergy",
        "zh": "我对花生过敏。",
        "py": "Wǒ duì huāshēng guòmǐn.",
        "hi": "Mujhe peanuts se allergy hai.",
        "img": "🥜🚫",
        "who": "you",
        "note": "Sirf apni actual allergy ke liye bolo. Guòmǐn ko food preference ka substitute mat banao."
      },
      {
        "id": "emg-contains-peanuts",
        "zh": "这个菜有花生吗？",
        "py": "Zhège cài yǒu huāshēng ma?",
        "hi": "Kya dish mein peanuts hain?",
        "img": "🍲🥜❓",
        "who": "you",
        "note": "Dish ki taraf ishara karo. Allergy bhi clearly batao; sirf ingredient sawaal kaafi nahi."
      },
      {
        "id": "emg-breathing",
        "zh": "我呼吸困难。",
        "py": "Wǒ hūxī kùnnan.",
        "hi": "Mujhe saans lene mein mushkil ho rahi hai.",
        "img": "😮‍💨🆘",
        "who": "you",
        "note": "Breathing ki difficulty ko clear words mein batane ki urgent line."
      },
      {
        "id": "emg-ambulance",
        "zh": "请帮我叫救护车。",
        "py": "Qǐng bāng wǒ jiào jiùhùchē.",
        "hi": "Please mere liye ambulance bulaiye.",
        "img": "🚑☎️",
        "who": "you",
        "note": "Jiùhùchē = ambulance. Medical emergency mein request clear rakho."
      },
      {
        "id": "emg-ambulance-number",
        "zh": "请打120。",
        "py": "Qǐng dǎ yāo èr líng.",
        "hi": "Please 120 dial kijiye.",
        "img": "☎️🚑",
        "who": "you",
        "note": "Mainland China medical ambulance: 120. 110 police ke liye hai."
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
            "h": "Allergy aur pasand mein kya farq hai?",
            "text": "Guòmǐn allergy batata hai; bù xǐhuan sirf pasand nahi batata. Apni actual allergy ka food name use karo. Staff se ingredient confirm karwao; symptom ho to actual symptom clear bolo."
          }
        ]
      },
      {
        "type": "dialogue",
        "title": "Restaurant mein allergy communicate",
        "lines": [
          {
            "who": "you",
            "zh": "我对花生过敏。",
            "py": "Wǒ duì huāshēng guòmǐn.",
            "hi": "Mujhe peanuts se allergy hai.",
            "choices": [
              {
                "py": "Wǒ bù xǐhuan huāshēng.",
                "hi": "Mujhe peanuts pasand nahi.",
                "why": "Medical allergy aur taste preference alag hain. Guòmǐn bolkar allergy clear karo."
              }
            ]
          },
          {
            "who": "waiter",
            "zh": "您想点哪个菜？",
            "py": "Nín xiǎng diǎn nǎge cài?",
            "hi": "Aap kaunsi dish order karna chahte hain?"
          },
          {
            "who": "you",
            "zh": "这个菜有花生吗？",
            "py": "Zhège cài yǒu huāshēng ma?",
            "hi": "Kya dish mein peanuts hain?",
            "choices": [
              {
                "py": "Wǒ dùzi téng.",
                "hi": "Mere pet mein dard hai.",
                "why": "Ab ingredients poochhne hain. Pet dard ki line ingredient ka sawaal nahi poochhti."
              }
            ]
          },
          {
            "who": "waiter",
            "zh": "我去问一下厨师。",
            "py": "Wǒ qù wèn yíxià chúshī.",
            "hi": "Main chef se poochhkar aata/aati hoon."
          },
          {
            "who": "you",
            "zh": "谢谢，请帮我确认。",
            "py": "Xièxie, qǐng bāng wǒ quèrèn.",
            "hi": "Shukriya, please confirm kar dijiye."
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
            "q": "Mujhe peanuts se allergy hai: kaunsa word medical meaning clear karta hai?",
            "choices": [
              {
                "py": "Wǒ duì huāshēng guòmǐn."
              },
              {
                "py": "Wǒ bù xǐhuan huāshēng."
              },
              {
                "py": "Wǒ tóu téng."
              }
            ],
            "answer": 0,
            "why": "Guòmǐn allergy hai. Bù xǐhuan sirf pasand nahi batata hai; tóu téng headache hai."
          },
          {
            "q": "Saans lene mein mushkil ho rahi hai. Kaunsi line symptom clear karti hai?",
            "choices": [
              {
                "py": "Wǒ dùzi téng."
              },
              {
                "py": "Wǒ hūxī kùnnan."
              },
              {
                "py": "Zhège cài yǒu huāshēng ma?"
              }
            ],
            "answer": 1,
            "why": "Hūxī = breathing, kùnnan = difficult. Dùzi téng pet dard hai; ingredient sawaal symptom report nahi hai."
          },
          {
            "q": "Medical emergency mein ambulance bulane ke liye kaunsa number?",
            "choices": [
              "120 — yāo èr líng",
              "110 — yāo yāo líng",
              "119 — yāo yāo jiǔ"
            ],
            "answer": 0,
            "why": "120 medical ambulance hai. 110 police aur 119 fire service ke liye hain."
          }
        ]
      }
    ]
  }
]);
