# Content sources and review notes

Checked 2026-10-22. Scenario lessons are original teaching examples, not quotes or fixed scripts that every Chinese person will use.

## Emergency numbers

- [Beijing municipal government: Emergency Numbers](https://english.beijing.gov.cn/travellinginbeijing/quickguideontravelservices/traveltips/202108/t20210811_2466839.html): mainland China police **110**, fire **119**, medical ambulance **120**. Supports `emg-01` and `emg-02`; the official advice also asks callers to give location and describe the problem/symptoms clearly.
- [Beijing municipal government: 12345 Citizen Service Hotline](https://english.beijing.gov.cn/12345hotline/index.html): independently distinguishes the non-emergency 12345 service from emergency numbers 110/119/120/122. The app does not present 12345 as an ambulance or police emergency number.

Health lessons teach communicating actual symptoms and allergies. They contain no medication selection, dosing, diagnosis, or treatment instructions. Ingredient questions do not guarantee that a dish is safe for an allergy.

## Pronunciation checks

All new friends, travel, shopping, emergency, and basics extension lessons passed `validate.js` for syllable counts, pinyin parsing, spoken 一/不 rules, phrase IDs, choices, and stage structure. The pypinyin cross-check was also run directly with the project's existing Python environment because Node's `spawnSync` returned `EPERM` in the execution sandbox. The four reported alternatives were reviewed:

| Location | Content reading | Automated alternative | Review |
| --- | --- | --- | --- |
| `trv-01` phrase and dialogue (two reports) | 多长时间 `duō cháng shíjiān` | `zhǎng` for 长 | `cháng` expresses length/duration. The grow/elder reading `zhǎng` does not fit this question. [MOE dictionary: 長](https://dict.concised.moe.edu.tw/dictView.jsp?ID=32100&la=0&powerMode=1) lists the duration meaning. |
| `emg-01` dialogue | 谁 `shéi` | `shuí` | Both readings exist; the course uses conversational `shéi`. [MOE dictionary: 誰](https://dict.revised.moe.edu.tw/dictView.jsp?ID=9162&la=0&powerMode=0) explicitly lists both. |
| `emg-02` stomachache | 肚子 `dùzi` | `dǔ` for 肚 | `dù` is the abdomen reading; `dǔ` is the animal stomach/tripe reading. [MOE character dictionary: 肚](https://stroke-order.learningweb.moe.edu.tw/dictMean.jsp?ID=32922) distinguishes the meanings. |

The [MOE dictionary entry for 困難](https://dict.revised.moe.edu.tw/dictView.jsp?ID=78512&la=0&powerMode=0) also records neutral `nan`, supporting the spoken `kùnnan` used in the breathing-difficulty phrase. These MOE references are Taiwan Mandarin dictionary cross-checks, not a claim that every pronunciation convention is identical across mainland China and Taiwan.

Pypinyin is a useful spelling/polyphone check, not native-speaker review. The course still needs a mainland Mandarin speaker to review recordings and conversational wording when audio is added. Visual quizzes and tapping “said aloud” do not measure vocal tone accuracy or prove native-like pronunciation.

## Learning design reference

[Karpicke & Blunt (2011), Retrieval practice produces more learning than elaborative studying with concept mapping](https://pubmed.ncbi.nlm.nih.gov/21252317/) is a primary experiment supporting retrieval practice. It motivates asking learners to retrieve meanings and phrases after seeing lesson cards. The experiment concerns conceptual learning from science texts; it does not validate this app's exact review intervals, prove faster Mandarin learning, or establish a fluency deadline. The app's interval schedule and 15–20 minute routine are product choices.

## Scope of practical examples

Taxi, hotel, QR payment, and friend scenarios teach questions that let the learner confirm local details. They do not promise a route, a hotel's services, card acceptance, WeChat/Alipay account eligibility, or a universal social custom. Sample prices stay in yuan without a fixed INR conversion. A mainland `jīn` is 500 g; no hand-gesture convention is required by these lessons.

## Articulation and connected speech

- [University of Iowa: Interactive Pinyin Exercise](https://pressbooks.uiowa.edu/zheng/chapter/interactive-pinyin-exercise/) and [UT Austin: Mandarin pronunciation guide](https://laits.utexas.edu/ppp/learning.php?unit=1): articulation references for aspiration and rounded-front vowels. Roman Hindi/Devanagari hints remain approximate.
- [Hong Kong Polytechnic University: Initial groups](https://www.polyu.edu.hk/bepth/introduction-to-phonetics/initials/initial-groups/?sc_lang=en): supports distinguishing initial groups rather than treating Hindi sounds as exact matches.
- [Cheng (1987): Mandarin third tone sandhi](https://twpl.library.utoronto.ca/index.php/twpl/article/view/6403): longer third-tone sequences involve prosodic structure and variation. The app uses a simplified word-group heuristic, labels longer runs approximate, preserves explicit `say` overrides, and excludes ambiguous inferred runs from single-answer spoken-pattern questions.
- [ChinesePod: Dinner with the girlfriend's parents](https://www.chinesepod.com/lesson/dinner-with-the-girlfriends-parents): original scenario reference for beginner forms of address. It does not establish universal household customs.

## Final learner preference

The learner confirmed the family is from Fujian and explicitly requested basic standard Mandarin without regional tailoring. Regional examples are optional bonus content at the end of the suggested study order; no Fujian dialect module was added. Fictional character locations are scenario settings, not facts about the learner's family.

Family and food content received an additional contextual polyphone review. Automated flags for 当 (dàng, treat as), 待 (dāi, stay), 干 (gān, dry/finish), phone 喂 (wéi) and variable recognize-only Dongbei 嘎哈 were reviewed rather than blindly replaced. Allergy communication notes follow [FARE's dining-out guidance](https://www.foodallergy.org/resources/dining-out) and [cross-contact explanation](https://www.foodallergy.org/resources/avoiding-cross-contact); ingredient questions are not safety guarantees.

## Pronunciation audio implementation

The local environment installed `edge-tts` 7.3.1. Live service enumeration returned `zh-CN-XiaoxiaoNeural` and `zh-CN-YunxiNeural`; both normal and `-25%` synthesized slow smoke clips succeeded without an API key. The [upstream edge-tts documentation](https://github.com/rany2/edge-tts) documents voice enumeration and synthesis-rate control; [Microsoft's voice list](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) lists the standard Mandarin reference voices. Service availability was tested during this implementation, not promised permanently.

MP3s are generated before serving the app. Browser tests exercise actual decoding, playback, voice/speed switching, errors, cancellation and offline caching. Technical verification does not certify every synthetic clip's lexical tone or conversational naturalness; isolated syllables, polyphones, names and optional regional examples still benefit from native-speaker review. The app provides listening reference and self-practice, without speech recognition or vocal accuracy scores.
