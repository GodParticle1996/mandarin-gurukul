#!/usr/bin/env python3
"""pypinyin cross-check — `node validate.js --py` isse chalata hai.

Input: JSON list of {where, zh, syls: [[base, tone, er], ...]}
Output: JSON list of {where, msg} — sirf warnings (pypinyin bhi kabhi galat hota hai).
Neutral tone (0) aur 一/不 ke badlaav ko chhod deta hai (woh content mein bole-jaane wale roop mein hain).
"""
import json
import sys

from pypinyin import Style, pinyin


def is_han(c):
    return '㐀' <= c <= '鿿' or '豈' <= c <= '﫿'


def main(path):
    with open(path, encoding='utf-8') as f:
        items = json.load(f)
    out = []
    for it in items:
        chars = [c for c in it['zh'] if is_han(c)]
        need = sum(2 if s[2] else 1 for s in it['syls'])
        if need != len(chars):          # digit-by-digit lines — skip
            continue
        readings = pinyin(''.join(chars), style=Style.TONE3, neutral_tone_with_five=True,
                          v_to_u=True, heteronym=False)
        k = 0
        for base, tone, er in it['syls']:
            ch = chars[k]
            r = readings[k][0] if k < len(readings) else ''
            k += 2 if er else 1
            if ch in '一不' or not r or not r[-1].isdigit():
                continue
            rb, rt = r[:-1], int(r[-1])
            if rb != base:
                out.append({'where': it['where'],
                            'msg': f'{ch}: "{base}" likha, pypinyin "{r}" kehta hai (polyphone ya typo?) — {it["zh"]}'})
            elif tone != 0 and rt != 5 and tone != rt:
                out.append({'where': it['where'],
                            'msg': f'{ch}: tone {tone} likha, pypinyin tone {rt} kehta hai — {it["zh"]}'})
            elif tone != 0 and rt == 5:
                out.append({'where': it['where'],
                            'msg': f'{ch}: pypinyin ke hisaab se neutral tone (bina mark) — {it["zh"]}'})
    print(json.dumps(out, ensure_ascii=False))


if __name__ == '__main__':
    main(sys.argv[1])
