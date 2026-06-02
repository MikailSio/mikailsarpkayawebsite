#!/usr/bin/env python3
"""
ALES dersleri sayisal URL'lerden slug URL'lere refactor.
Eski N.html dosyalari KORUNUR (zero-downtime icin).
Yeni SLUG.html dosyalari olusturulur, ic link'leri slug'a guncellenmis halde.

Kullanim:
    python scripts/rename-ales-to-slugs.py
"""
import json, re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
ALES = ROOT / 'tutorials' / 'ales'
MAP_FILE = ROOT / '.ales-slug-map.json'

if not MAP_FILE.exists():
    print(f"HATA: Slug mapping bulunamadi: {MAP_FILE}")
    sys.exit(1)

with open(MAP_FILE, 'r', encoding='utf-8-sig') as f:
    slug_map = json.load(f)  # {"1": "dogal-sayilar", ...}

print(f"==> {len(slug_map)} ders slug haritasi yuklendi")

# Number'lari DESC order'da islet (10, 11, ... daha once, 1 sona kalsin)
# Boylece /tutorials/ales/1 replace ederken /tutorials/ales/10 bozulmaz
sorted_nums = sorted(slug_map.keys(), key=int, reverse=True)

def replace_refs(content):
    """Tum /tutorials/ales/N referanslarini slug ile degistir."""
    for n in sorted_nums:
        s = slug_map[n]
        # \b yerine (?![0-9]) — sonu rakam degilse match
        content = re.sub(rf'(/tutorials/ales/){n}(?![0-9])', rf'\g<1>{s}', content)
    return content

# === 1. Her ALES HTML icin slug kopyasi olustur ===
copied = 0
for num_str, slug in slug_map.items():
    src = ALES / f'{num_str}.html'
    dst = ALES / f'{slug}.html'
    if not src.exists():
        print(f"   ! Kaynak yok: {src.name}")
        continue
    if dst.exists():
        print(f"   = Hedef zaten var, atlaniyor: {dst.name}")
        continue
    content = src.read_text(encoding='utf-8')
    content = replace_refs(content)
    dst.write_text(content, encoding='utf-8')
    copied += 1
print(f"==> {copied} slug HTML olusturuldu")

# === 2. tutorials/ales/index.html (meta refresh) - dogal-sayilar'a yonlendir ===
ales_idx = ALES / 'index.html'
if ales_idx.exists():
    content = ales_idx.read_text(encoding='utf-8')
    new = replace_refs(content)
    if new != content:
        ales_idx.write_text(new, encoding='utf-8')
        print(f"==> tutorials/ales/index.html guncellendi")

# === 3. tutorials/index.html - ALES kategori linki slug'a ===
tut_idx = ROOT / 'tutorials' / 'index.html'
if tut_idx.exists():
    content = tut_idx.read_text(encoding='utf-8')
    new = replace_refs(content)
    if new != content:
        tut_idx.write_text(new, encoding='utf-8')
        print(f"==> tutorials/index.html guncellendi")

# === 4. tutorials/ales/nav.js, core.js (varsa internal nav array) ===
for js in (ALES / 'nav.js', ALES / 'core.js'):
    if js.exists():
        content = js.read_text(encoding='utf-8')
        new = replace_refs(content)
        if new != content:
            js.write_text(new, encoding='utf-8')
            print(f"==> {js.name} guncellendi")

print(f"\n==> TAMAM. Sonraki: eski N.html dosyalari hala duruyor (zero-downtime icin).")
print(f"   Deploy sonrasi nginx redirect kurulursa silinebilir.")
