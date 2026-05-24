"""Round 3: stem-based replacement for Turkish suffix variants."""
import re
from pathlib import Path

# Stem-suffix replacements: (stem-bad, stem-good) - matched with optional suffix
STEM_PAIRS = [
    # birleştir-* family
    ("birlestir", "birleştir"),
    ("Birlestir", "Birleştir"),
    # sekillendirme-*
    ("sekillendir", "şekillendir"),
    ("Sekillendir", "Şekillendir"),
    # düzenli/duzelt
    ("duzenli", "düzenli"),
    ("Duzenli", "Düzenli"),
    ("duzeltme", "düzeltme"),
    # eslestirme
    ("eslestir", "eşleştir"),
    ("Eslestir", "Eşleştir"),
    ("eslesm", "eşleşm"),
    # bekledig
    ("bekledig", "beklediğ"),
    # diger conjugations
    ("dustugu", "düştüğü"),
    ("dustuk", "düştük"),
]

# Word-anchored: bad word followed by ANY Turkish letters/digits (greedy)
def replace_stem(txt, bad, good):
    """Match `<bad><suffix>` where suffix is alphanumeric or Turkish chars."""
    # word-start boundary + bad + greedy suffix
    pat = r'(?<![A-Za-zÇĞİÖŞÜçğıöşü])' + re.escape(bad) + r'([a-zığşöçü]*)\b'
    def sub(m):
        return good + m.group(1)
    return re.subn(pat, sub, txt)

def fix(path: Path):
    txt = path.read_text(encoding='utf-8')
    original = txt
    cnt = 0
    for bad, good in STEM_PAIRS:
        txt, n = replace_stem(txt, bad, good)
        cnt += n
    if txt != original:
        path.write_text(txt, encoding='utf-8')
    return cnt

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")
targets = ["pandas/L1.js", "pandas/L2.js", "pandas/L6.js"]
for t in targets:
    p = ROOT / t
    if p.exists():
        n = fix(p)
        print(f"  {t}: {n} replacements")
