# Content brief — Mandarin Gurukul

You write ONE content file: `data-<track>.js`. Do not edit any other file.
Read this brief, then the two sample levels: `data-tones.js` (ton-01) and `data-basics.js` (bas-01).
They show every field and stage type. Copy their shape exactly.

## Who learns from this

- An Indian learner going to China in **1–2 months**, practicing **15–20 minutes/day**, with some greetings known. Balanced focus: daily travel plus girlfriend's parents and friends. The family is from Fujian, but the learner explicitly wants basic standard Mandarin, not regional tailoring. Keep regional phrases optional. **Xiǎoyǔ (晓雨)** and the Beijing/Shenyang household are fictional practice characters, not confirmed facts about the learner's partner.
- The goal is **speaking and listening only**. The learner will never read Chinese characters.
  The app shows pinyin with tone colours and contour lines. Devanagari hints are optional and off for new learners. Hindi sound cues are approximate; no visual quiz grades vocal accuracy.
- The learner reads **Hinglish**: Hindi in Roman script, with simple English words. Plain English text does not stick for them.
- Use short, easy-to-follow steps. Every line should make sense on its own. **Never use a pronoun as a stand-in for a noun named earlier.**
  Do not write isse, usse, iska, uska, wahan, or "it/this/that" for something named earlier. Repeat the actual noun.
  - ❌ "Mummy khana parosti hain. Usko mana mat karo, bas thoda lo."
  - ✅ "Mummy khana parosti hain. Mummy ka khana mana mat karo, bas thoda lo."
  `validate.js` warns on these words. Fix every warning of this kind.
- Use realistic situations with illustrative prices in kuài/yuan. Do not hard-code an INR exchange rate or imply sample prices are live quotes. Use short, plain sentences. Do not write explain-it-back exercises.
- Prerecorded normal/slow Mandarin audio now exists for original `zh`/`py` lines. Keep paired `zh` and tone-marked `py` on real models and dialogue; regeneration creates both reference voices. Do not synthesize wrong-tone distractors as if they were correct models. Existing visual quizzes remain supported; listening tasks must use actual clips and never autoplay.

## Cast (`who` field) — from data-core.js

`you` (the learner), `gf` (Xiǎoyǔ), `mom` (Āyí: warm, feeds you non-stop), `dad` (Shūshu: quiet, loves a báijiǔ toast, asks about your job),
`nainai` (grandma, strong Dongbei accent), `kid` (Xiǎo Míng, 8, Xiǎoyǔ's nephew), `lili` (Xiǎoyǔ's chatty friend, loves KTV),
`dawei` (friend, tech guy, BBQ and beer), `waiter`, `driver` (DiDi/taxi shīfu), `staff` (hotel/station/shop), `seller` (market lǎobǎn),
`doctor`, `police`, `stranger`, `teacher`.
Introduce **Shūshu / Āyí** and **您 nín** as polite beginner choices; real household preferences vary. Do not insist after genuine refusal, require alcohol, or promise a reaction. Ask the partner about household preferences.
The learner's gender is unknown. When a phrase depends on gender (男朋友/女朋友, 帅/漂亮 about the learner), give the male version in the
main fields and a female override: `f: { zh: '…女朋友…', py: '…nǚpéngyou…', hi: '…' }`.

## Pinyin rules (validate.js enforces them)

- Use tone marks (ā á ǎ à), never numbers. The neutral tone has **no mark** (xièxie, péngyou, shénme, māma).
- Separate words with spaces and join the syllables inside a word: `Hěn gāoxìng rènshi nín.` Capitalise the first word and names (Běijīng, Xiǎoyǔ).
- Use ASCII punctuation in `py` (`, . ? !`) and Chinese punctuation in `zh` (，。？！).
- **Write 一 and 不 as they are spoken**: bú shì, bú yào, bú kèqi, but bù hǎo, bù lái. Write yí ge, yíyàng, yí cì, but yìqǐ, yì bēi, yìdiǎnr. Counting/ordinal: yī.
  Do **not** write the 3+3 change (nǐ hǎo stays nǐ hǎo). The app draws that change itself.
- **Erhua (North!)**: write it on the syllable: nǎr, zhèr, yìdiǎnr, yíhuìr, méi shìr, hǎowánr. The zh has 儿: 哪儿, 一点儿.
- Each Chinese character equals one syllable, and an erhua syllable equals two characters (X+儿). The validator counts them.
- Prices and quantities use Han numerals in zh (五十块, 一百块). Use digits only for digit-by-digit numbers (110, phone numbers, room 302).
- English words such as KTV, WiFi, AA, iPhone, OK go into both zh and py unchanged.
- Rare spoken exception (a neutral syllable that still triggers 3+3, e.g. 小姐): add `say: 'xiáojie'` with the spoken tones.

## File shape

```js
/* Track: <icon> <name> — Format: BRIEF-CONTENT.md · Check: node validate.js --track <id> */
MG.registerLevels('<trackId>', [
  { id: '<prefix>-02', icon: '🚪', title: '≤ 48 chars', goal: 'one visible finish line for this level',
    scene: { img: '🚪🧑🏽🎁', text: 'Problem first: a real moment, 2–3 short sentences.', ask: 'Kya bologe?',
      choices: [ { py: 'Āyí hǎo!', ok: true, why: '…' }, { py: 'Nǐ hǎo!', ok: false, why: '…' } ] },   // 2–4, exactly one ok:true; use py OR text
    phrases: [ { id: 'fam-ayihao', zh: '阿姨好！', py: 'Āyí hǎo!', hi: 'Aunty, namaste!', img: '👩🏻‍🦱', who: 'you',
                 note: 'optional, 1–2 short lines', lit: 'optional word-by-word: aunty + achha' } ],    // 6–10 per level (4–14 allowed)
    stages: [ … ] },
]);
```

- Level ids: `<prefix>-NN`, where the prefix is in data-core.js (ton, snd, bas, fam, food, frd, trv, shp, emg, bld, nth).
- Phrase ids: lowercase a-z 0-9 and `-`, unique across the whole app. Start each one with the track prefix (`fam-gift-xinyi`).
- `img`: 1–4 emoji that **show** the meaning (the learner is very visual). `who`: who says the line (default `you`). Phrases that other people say (`mom` asks a question) help the learner understand what they hear.
- `hi`: natural Hinglish meaning. `note`: when to use the phrase, a politeness tip, or a pronunciation trap. Keep notes to 1–2 lines.

## Stage types (no audio yet)

| type | fields | what the learner does |
|---|---|---|
| `learn` | `ids?` (default: all phrases) | goes through phrase cards and says each phrase aloud |
| `explain` | `cards: [{ h, text, ex?: [{zh,py,hi}], visual?, tip? }]` (1–4 cards) | short concept cards. `h` is a **question** ("Kab 您 bolein?"). `visual` ∈ tonechart, tone1–4, tone0, badges, sandhi33, mouth |
| `meaning` | `count?` 3–8, `ids?` | sees the pinyin and picks the Hinglish meaning (auto-generated from phrases) |
| `recall` | `count?`, `ids?` | sees the meaning and picks the right pinyin. Distractors include the same words with wrong tones (auto) |
| `match` | `count?` 3–6, `ids?` | pairs emoji/meaning with pinyin (auto) |
| `tones` | `mode: 'written' \| 'say'`, `items?: [{zh,py,hi}]` (≥3) or `count` | sees pinyin without marks and picks the tone pattern |
| `quiz` | `questions: [{ q, choices: [string \| {py, zh?}], answer, why }]` | situation MCQs ("Mummy teesri baar bowl bhar rahi hain. Kya bologe?"). 3–4 questions, 2–4 choices |
| `dialogue` | `title, lines: [{ who, zh, py, hi, choices? }]` | comic-strip conversation. On `you` lines, `choices: [{py, hi, why}]` are WRONG options; the line itself is the right answer. ≥1 line must have choices |
| `build` | `items: [{ hi, zh, py, blocks?, extra? }]` | arranges pinyin word blocks into the sentence. `blocks` = word groups in order (≥3). `extra` = distractor blocks |
| `bins` | `q, bins: [{id,label}], items: [{py \| text, bin}]` | sorts items into 2–4 groups (polite vs casual, 不 vs 没 …) |

Every level needs: `scene` + `learn` + **at least 3 practice stages**. Situation tracks need **one dialogue per level**.
Order: learn → (explain if needed) → dialogue → 2–3 of meaning/recall/match/tones/build/bins → quiz.
Quiz `why`: say why the right answer is right AND why the tempting wrong answer is wrong.

## Quality bar

- Use natural spoken mainland Mandarin, the way people in Beijing and Dongbei actually say it, not stiff textbook lines. Mark Beijing/Dongbei words as such in `note`.
- Cultural notes must be accurate and respectful, with no stereotypes. Avoid politics.
- Get the tones right. When unsure of a character's reading, pick a common unambiguous word.
- Every phrase must be useful in the situation. Do not add filler vocabulary.

## Process (keep it lean, it is the user's quota)

1. Write the file early: the first 2–3 levels with Write, then add the rest with Edit (insert before the final `]);`).
2. After each chunk, run `node validate.js --track <id> --py`. Fix **all ERR lines**. Fix pypinyin warnings that are real mistakes
   (ignore them for neutral tones and correct spoken forms). Fix every ADHD pronoun warning.
3. Do not re-read your whole file. Use the error messages, and Read only the lines you need.
4. Finish with a 5-line report: levels written, phrase count, validator result, and any reading you were unsure about.

---

# Track outlines

Write the levels listed for your track. Each bullet is a level: title, then the key content. Natural extra phrases are welcome.

## tones (`ton-`, ton-01 already done → write ton-02 … ton-08)
- ton-02 Tone 1 vs Tone 4 — seedha vs girta: bā/bà (八/爸), tā/dà, shū/shù, gāo/gào; useful words 他 吃 喝 书 去 是 大 对. `tones` stage + `bins` (T1 vs T4, toneless py via text field).
- ton-03 Tone 2 vs Tone 3 — sabse badi confusion: Tone 3 = neeche (low), Tone 2 = beech se upar. yú/yǔ (鱼/雨), táng/tǎng, mǎi/mài (买/卖, buy vs sell!), 茶 钱 来 人 没 vs 好 我 你 很 买.
- ton-04 Tone 3 ka sach — half-third + 3+3: low tone in the middle; 你好 很好 我很好 可以 水果 老板 洗手间; vs 好吃 很忙 我是 (half third). visual sandhi33. `tones` mode 'say'.
- ton-05 不 aur 一 ka jaadu: 不是 不要 不对 不客气 vs 不好 不来 不吃; 一个 一样 一下 vs 一起 一杯 一点儿; yī when counting (第一, 一月).
- ton-06 Neutral tone — halka aur chhota: 谢谢 妈妈 爸爸 朋友 什么 我们 东西 喜欢 的 了 吗 吧; height after T1/2/3/4 (visual tone0).
- ton-07 Tone jodiyan 1: pairs starting with T1/T2: 中国 今天 吃饭 喝水 咖啡 回家 明天 没有 学习 银行; `tones` mode 'say'.
- ton-08 Tone jodiyan 2: pairs starting with T3/T4: 北京 好吃 很忙 你好 可是 再见 印度 认识 大学 汽车 上海. Final mixed tones test.

## sounds (`snd-`, write snd-01 … snd-08)
Teach each sound with a Roman Hinglish mouth cue, optional approximate Devanagari anchor, and badge (💨 hawa, 👅 zubaan peeche, 🐝 bhanbhanahat, 😗 gol hoth, 〰️ gale wala "uh"). Use `explain` with `visual: 'badges'` or `'mouth'`.
- snd-01 b/p, d/t, g/k — hawa ka khel 💨: b=प, p=प💨 (फ as in phal), d=त, t=त💨 (थ), g=क, k=क💨 (ख). Kaagaz test. bàba/pà, dà/tā, gè/kè, péngyou, kěyǐ.
- snd-02 f vs p, h vs k — Hindi walon ki galti: f = फ़ (real f), p ≠ f (饭 fàn vs 盘 pán); h = ह, a bit raspy like ख़ (好 hǎo vs 考 kǎo, 喝 hē vs 渴 kě); 火锅 飞机.
- snd-03 j q x — muskurake bolo: j=च q=च💨 (छ) x=श, tongue tip behind the lower teeth; 家 九 请 去 钱 谢谢 小 想 喜欢.
- snd-04 zh ch sh r — zubaan peeche 👅: vs j q x: 知/鸡, 吃/七, 是/戏, **十 shí vs 四 sì, 十四 vs 四十** (prices!); 中国 茶 这 说 热 人.
- snd-05 z c s — "ts" wali awaaz + 🐝: 在 菜 三 早 自己 厕所 (toilet!) 词; zi/ci/si have no ई.
- snd-06 ü 😗 and e 〰️ — Hindi mein nahi: 女 nǚ vs 努 nǔ, 绿 lǜ vs 路 lù, 去 鱼 雨 学 月; e: 饿 喝 热 车 可乐 的 vs 也 yě.
- snd-07 -n vs -ng (न vs ङ): 饭/房, 山/上, 心/星, 门/梦; 晚上 名字 中文 朋友 北京.
- snd-08 儿 — Beijing wali "r" (erhua): 哪儿 这儿 那儿 一点儿 一会儿 玩儿 好玩儿 小孩儿 一块儿; 二 èr, 儿子; 哪里 nǎlǐ = 哪儿 nǎr (the South says nǎlǐ).

## basics (`bas-`, bas-01 already done → write bas-02 … bas-08)
- bas-02 Haan, na, theek hai: 是/不是, 对/不对, 好/好的, 行 (Beijing "OK"), 可以, 没问题, 有/没有, 要/不要, 嗯.
- bas-03 Samajh nahi aaya — madad maango: 我听不懂, 请说慢一点儿, 请再说一遍, 你会说英语吗, 我会说一点儿中文, …用中文怎么说, 什么意思.
- bas-04 Ginti 1–10 + haath ke ishaare: 一…十, 零, 两 vs 二, 幺 (yāo in phone numbers); Chinese one-hand signs for 6 7 8 9 10 (describe them with emoji + text).
- bas-05 11–100 aur paise: 十一 二十 九十九 一百; 块 毛; 多少钱; yuan amounts; 四十 vs 十四 trap.
- bas-06 Samay aur din: 现在几点, 三点, 半, 今天 明天 昨天, 早上 晚上, 星期一…星期天, 周末.
- bas-07 Sawaal ke shabd: 什么 哪儿 谁 几 多少 怎么 为什么 什么时候 + 吗.
- bas-08 Chhota parichay: 我叫…, 我是印度人, 我从印度来, 我在IT公司工作, 很高兴认识你, 我的中文不太好, 我在学中文.

## family (`fam-`, write fam-01 … fam-10) — the user's top priority
- fam-01 Darwaze pe pehli mulaqat: 叔叔好/阿姨好, 您好, 我是晓雨的男朋友 (f: 女朋友), 我叫…, 很高兴见到你们, 打扰了; they say 快请进, 换拖鞋 (slippers!).
- fam-02 Tohfa dena: 这是给您的, 一点儿小心意; they may politely decline (不用不用, 太客气了), you offer gently (请您收下); respect a genuine refusal; good gifts 茶叶 水果 酒 Indian tea; taboos: clock (送钟), pear, umbrella, 4; give with two hands.
- fam-03 Apna parichay: 我今年…岁, 我是做软件的, 我老家在…, 我家有四口人, 我父母都在印度.
- fam-04 Parents ke sawaal: they ask 你做什么工作, 你今年多大了, 你家里有几口人, 你们怎么认识的, 你喜欢中国吗, 你会做饭吗, 打算在中国待多久 — plus good answers.
- fam-05 Khaane ki table: 叔叔阿姨先吃, 真香, 阿姨做的菜太好吃了, 我自己来 (when they keep filling your bowl), 够了够了, 我吃饱了; they say 多吃点儿, 慢慢吃.
- fam-06 Gānbēi — Dongbei toast: 干杯, 我敬您一杯, 祝叔叔阿姨身体健康, 随意, 我不太会喝酒, 以茶代酒, 走一个 (Dongbei); glass rim lower than the elder's glass.
- fam-07 Tareef aur chhoti baatein: 您家真漂亮, 阿姨看起来真年轻, 今天真冷啊, 晓雨很像您.
- fam-08 Madad karna: 我来帮您, 我来洗碗; they refuse 不用不用 / 您歇着吧; 没事儿 (Beijing).
- fam-09 Vida lena: 叔叔阿姨，我先走了, 谢谢款待, 今天吃得很开心, 您留步; they say 下次再来, 路上小心, 有空来玩儿.
- fam-10 Phone / WeChat video call: 喂 (wéi), 听得见吗, 信号不好, 您吃饭了吗, 祝您生日快乐, nainai with a strong Dongbei accent: 嘎哈呢 (understand only).

## food (`food-`, write food-01 … food-08)
- food-01 "Kitne log?": they say 欢迎光临, 几位; 两位, 有位子吗, 要等多久, 菜单, 有英文菜单吗, 我们先看看.
- food-02 Order — ungli rakh ke: 我要这个, 来一个…, 这个是什么, 推荐什么, 就这些, 服务员 / 你好 to call, 一碗米饭.
- food-03 Teekha? Veg? No beef?: 不要辣, 微辣, 特辣, 我吃素, 有素菜吗, 不要放肉, 我不吃牛肉, 我对花生过敏, 不要香菜, 少油.
- food-04 Paani, chai, beer: 热水 (China serves warm water!), 冰水, 常温, 茶, 一瓶啤酒, 冰的, 可乐, 再来一壶茶.
- food-05 North China ke khaane: 饺子 包子 面条 炸酱面 北京烤鸭 锅包肉 地三鲜 (veg!) 西红柿炒鸡蛋 拍黄瓜 米饭 馒头.
- food-06 Hotpot ki raat: 火锅, 鸳鸯锅, 清汤, 麻辣, 蘸料, 涮羊肉 (Beijing), 豆腐 蘑菇 土豆 青菜, 熟了吗, 好烫.
- food-07 Swaad ki baat: 好吃, 太好吃了, 有点儿咸, 太辣了, 很香, 甜 酸, 味道怎么样 (they ask), 还可以.
- food-08 Bill, dabba, delivery: 买单, 结账, 可以扫码吗, 微信还是支付宝, 打包, 发票, 外卖 (美团), AA, 我请客 + the bill-fight custom.

## friends (`frd-`, write frd-01 … frd-07)
- frd-01 Hi! Naam?: 嗨, 你叫什么名字, 怎么称呼, 叫我…就行, 我是晓雨的男朋友 (f).
- frd-02 India ke sawaal: 你是哪国人, 印度哪里, 印度热吗, 你会说印地语吗, 你来中国多久了, 第一次来中国.
- frd-03 WeChat add: 加个微信吧, 我扫你, 你扫我, 我发给你, 拍张照吧, 拉你进群.
- frd-04 Tareef aur "nahi nahi": they say 你中文说得真好 → 哪里哪里, 过奖了, 还差得远呢; 你们真配.
- frd-05 Reaction words: 真的吗, 太好了, 太棒了, 牛, 厉害, 没事儿, 好啊, 走吧, 不会吧, 绝了.
- frd-06 Plan banao: 晚上有空吗, 几点见, 在哪儿见, 去唱K (KTV), 撸串 (BBQ), 喝一杯, 我请客, 下次我请, 一起去吧.
- frd-07 Bye: 下次见, 拜拜, 回头见, 路上小心, 到家了说一声, 保持联系.

## travel (`trv-`, write trv-01 … trv-08)
- trv-01 DiDi / taxi: 师傅, 去这个地方 (show address), 去…酒店, 多长时间, 就在这儿停, 前面停一下, 到了, 我在门口.
- trv-02 Raasta poochna: 请问, …在哪儿, 怎么走, 往前走, 左转, 右转, 一直走, 远吗, 旁边, 对面.
- trv-03 Metro: 地铁站在哪儿, 坐几号线, 在哪儿换乘, 下一站, 出口, 安检, 往哪个方向.
- trv-04 High-speed train: 高铁, 火车站, 买票, 去上海的票, 几点的车, 二等座, 护照, 检票口, 晚点, 几号车厢.
- trv-05 Airport: 机场, 登机口, 托运, 行李, 航班, 延误, 换钱.
- trv-06 Hotel check-in: 我有预订, 护照, 押金, 几点退房, 有早餐吗, WiFi密码是多少, 房间在几楼.
- trv-07 Kamre mein problem: 空调坏了, 没有热水, 暖气 (North!), 能换个房间吗, 太吵了, 毛巾, 卫生纸, 房卡丢了.
- trv-08 Check-out: 退房, 可以寄存行李吗, 帮我叫一辆车, 发票, 住得很舒服.

## shopping (`shp-`, write shp-01 … shp-07)
- shp-01 Kitne ka hai?: 多少钱, 一斤多少钱 (jīn = 500 g), 太贵了, 便宜一点儿吧, 最低多少, 我再看看.
- shp-02 Molbhav in a market: 一百块, 五十怎么样, 两个一百行吗, 算了, 成交; where bargaining is OK (markets) vs not (malls, supermarkets).
- shp-03 Size, rang, try: 有大号吗, 小号, 可以试试吗, 试衣间, 有别的颜色吗, colours, 太大了, 正好, 我就看看.
- shp-04 Payment: 可以用微信吗, 支付宝, 我扫你还是你扫我, 付款码, 收现金吗, 可以刷卡吗, 找钱.
- shp-05 Convenience store: 便利店, 要袋子吗 (they ask), 不用了, 热一下, 矿泉水, 纸巾, 充电宝, 收银台.
- shp-06 SIM card: 手机卡, 办卡, 流量, 充值, 一个月多少钱, 需要护照吗, 信号.
- shp-07 Return / exchange: 可以退吗, 可以换吗, 坏了, 小票, 退款.

## emergency (`emg-`, write emg-01 … emg-06)
- emg-01 Tabiyat kharab: 我不舒服, 头疼, 肚子疼, 发烧, 感冒了, 拉肚子, 想吐, 很累.
- emg-02 Dawai ki dukaan: 药店在哪儿, 感冒药, 退烧药, 一天吃几次, 饭前还是饭后, 创可贴, 过敏.
- emg-03 Hospital: 医院, 挂号, 急诊, 哪里不舒服 (they ask), 疼了多久了, 我对青霉素过敏.
- emg-04 Kho gaya: 我迷路了, 手机丢了, 护照丢了, 能帮我打个电话吗, 我住在…酒店, 这是我的地址.
- emg-05 Police + numbers: 救命, 报警, 110 (yāo yāo líng), 120, 119, 小偷, 我被偷了, 叫救护车, 印度大使馆.
- emg-06 Phone, battery, internet: 手机没电了, 充电宝, 能借我充一下电吗, 有WiFi吗, 请帮我翻译一下.

## builder (`bld-`, write bld-01 … bld-09) — many `build` stages, each with 3–5 items
- bld-01 Word order: who + when + where + do + what: 我今天在家吃饭, 我明天去北京.
- bld-02 吗 questions and A-not-A: 你是印度人吗, 你去不去, 有没有.
- bld-03 不 vs 没: 我不吃肉 vs 我没吃饭, 没有. Use `bins`.
- bld-04 想 / 要 / 会 / 可以 / 能.
- bld-05 了 — it happened / it changed: 我吃了, 我到了, 下雨了, 我累了.
- bld-06 过 — ever done it?: 我去过北京, 你吃过烤鸭吗, 我没去过上海.
- bld-07 Measure words: 一个人 一杯茶 一碗面 一瓶啤酒 两张票 三位 一件衣服 一双筷子.
- bld-08 太…了, 有点儿, 很, 非常, 不太.
- bld-09 比 and 因为…所以: 北京比上海冷, 这个比那个便宜, 因为下雨，所以我们不去了.

## north (`nth-`, write nth-01 … nth-07)
- nth-01 Beijing ka 儿 aur 您: 您 culture; 哪儿 这儿 一点儿 一会儿 没事儿 好玩儿 倍儿棒 胡同儿 遛弯儿.
- nth-02 Dongbei boli: 贼好 嘎哈呢 唠嗑 老铁 咋整 得劲儿 嗯呐 埋汰 磨叽 (recognise them; say a few for laughs with nainai).
- nth-03 Spring Festival: 新年快乐, 过年好 (northern greeting), 恭喜发财, 拜年, 身体健康, 万事如意.
- nth-04 New Year's Eve: 包饺子 (the family folds dumplings together), 年夜饭, 春晚, 放鞭炮, 红包 for Xiǎo Míng, 守岁.
- nth-05 Sardi aur heating: 好冷啊, 零下二十度, 暖气, 穿多点儿 (they say), 羽绒服, 下雪了, 屋里很暖和.
- nth-06 Ghar ke tareeke aur taboos: slippers, chopsticks never upright in rice, 4 (sì ≈ sǐ), clock/pear gifts, elders sit and eat first, respecting refusals, red-envelope amounts.
- nth-07 Beijing ghoomna: 长城 故宫 天安门 胡同 颐和园 门票 排队 拍照 人太多了.
