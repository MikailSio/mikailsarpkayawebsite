"""Propagate the new ek dersler links into sidebar of all OTHER shells.
For calculus L7,L8 add to calculus sidebar block everywhere.
Same for linalg L7,L8 and math L10,L11.
"""
import re
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

# Inserts to make
INSERTS = [
    # calculus track in sidebar — add L7, L8 after L6
    {'track':'calculus','anchor':'<a href="/tutorials/calculus/6"',
     'new':[
         '<a href="/tutorials/calculus/7" class="sb-lesson"><span class="num">07</span><span class="lbl" data-en="Lagrange Multipliers" data-tr="Lagrange Çarpanları">Lagrange Multipliers</span></a>',
         '<a href="/tutorials/calculus/8" class="sb-lesson"><span class="num">08</span><span class="lbl" data-en="Advanced Vector Analysis" data-tr="İleri Vektör Analizi">Advanced Vector Analysis</span></a>',
     ]},
    # linalg track — add L7, L8 after L6
    {'track':'linalg','anchor':'<a href="/tutorials/linalg/6"',
     'new':[
         '<a href="/tutorials/linalg/7" class="sb-lesson"><span class="num">07</span><span class="lbl" data-en="Float Arithmetic" data-tr="Kayan Nokta Aritmetiği">Float Arithmetic</span></a>',
         '<a href="/tutorials/linalg/8" class="sb-lesson"><span class="num">08</span><span class="lbl" data-en="Matrix Calculus &amp; Einsum" data-tr="Matris Analizi &amp; Einsum">Matrix Calculus & Einsum</span></a>',
     ]},
    # math track — add L10, L11 after L9
    {'track':'math','anchor':'<a href="/tutorials/math/9"',
     'new':[
         '<a href="/tutorials/math/10" class="sb-lesson"><span class="num">10</span><span class="lbl" data-en="Statistical Learning Theory" data-tr="İstatistiksel Öğrenme">Statistical Learning Theory</span></a>',
         '<a href="/tutorials/math/11" class="sb-lesson"><span class="num">11</span><span class="lbl" data-en="Advanced Probability" data-tr="İleri Olasılık">Advanced Probability</span></a>',
     ]},
]


def update_shell(path):
    try:
        txt = path.read_text(encoding='utf-8')
    except Exception as e:
        return -2
    orig = txt
    changes = 0
    for ins in INSERTS:
        # Match the anchor line + its full <a>...</a>
        pat = re.compile(re.escape(ins['anchor']) + r'[^>]*>.*?</a>')
        m = pat.search(txt)
        if not m:
            continue
        # Check if already present
        check = f'/tutorials/{ins["track"]}/{ins["new"][0].split("/")[2].split(chr(34))[0].split("/")[-1]}'  # parse num
        # Simpler: check if a /track/7" or /math/10" exists
        if ins['track'] in ('calculus','linalg'):
            check_strs = [f'/tutorials/{ins["track"]}/7"', f'/tutorials/{ins["track"]}/8"']
        else:
            check_strs = ['/tutorials/math/10"', '/tutorials/math/11"']
        all_present = all(s in txt for s in check_strs)
        if all_present:
            continue
        # Insert after the anchor's </a>
        insertion = ''
        for new_a in ins['new']:
            insertion += '\n              ' + new_a
        txt = txt.replace(m.group(0), m.group(0) + insertion, 1)
        changes += 1
    if txt != orig:
        path.write_text(txt, encoding='utf-8')
        return changes
    return 0


all_shells = []
for sub in ROOT.iterdir():
    if not sub.is_dir():
        continue
    for f in sub.glob("*.html"):
        if f.stem == 'index' or not f.stem.isdigit():
            continue
        all_shells.append(f)

print(f"Found {len(all_shells)} shells")
stats = {'changed': 0, 'unchanged': 0}
for f in all_shells:
    r = update_shell(f)
    if r and r > 0:
        stats['changed'] += 1
    else:
        stats['unchanged'] += 1
print(f"  changed: {stats['changed']}, unchanged: {stats['unchanged']}")
