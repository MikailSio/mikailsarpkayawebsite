"""Extend the lise-mat sidebar block from 62 entries to 107 entries
across all non-lise-mat shells. Adds placeholder Lesson 63..107 entries
right after the Lesson 62 entry, before the closing </div>.
"""
import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

# Build the new entries L63..L107
new_entries = []
for i in range(63, 108):
    new_entries.append(
        f'              <a href="/tutorials/matematik/{i}" class="sb-lesson">'
        f'<span class="num">{i:02d}</span>'
        f'<span class="lbl" data-en="Lesson {i}" data-tr="Ders {i}">Lesson {i}</span></a>'
    )
new_block = '\n'.join(new_entries) + '\n'

# Pattern: find Lesson 62 anchor followed by the closing </div> of the track-items
existing_re = re.compile(
    r'(              <a href="/tutorials/matematik/62" class="sb-lesson">[^\n]*\n)'
    r'(            </div>)',
    re.DOTALL,
)

updated = 0
skipped = 0
all_shells = []
for sub in ROOT.iterdir():
    if not sub.is_dir() or sub.name == 'matematik':
        continue
    for f in sub.glob("*.html"):
        if f.stem == 'index' or not f.stem.isdigit():
            continue
        all_shells.append(f)

for f in all_shells:
    txt = f.read_text(encoding='utf-8')
    # Check if already has lesson 107
    if '/tutorials/matematik/107"' in txt:
        skipped += 1
        continue
    new_txt, count = existing_re.subn(r'\1' + new_block + r'\2', txt)
    if count >= 1:
        f.write_text(new_txt, encoding='utf-8')
        updated += 1
    else:
        skipped += 1

print(f"Updated: {updated}, skipped: {skipped}, total: {len(all_shells)}")
