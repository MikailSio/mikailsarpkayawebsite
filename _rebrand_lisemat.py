"""Rebrand 'High School Math / Lise Matematiği' → 'Mathematics / Matematik'
across ALL shells; also replace placeholder lesson labels (Lesson N / Ders N)
with the actual topic name from the track config.
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")
sys.path.insert(0, str(Path(__file__).parent))
from _make_track_shells import TRACK_CONFIGS

LISE_LESSONS = TRACK_CONFIGS['matematik']['lessons']

# 1) Replace all "High School Math" / "Lise Matematiği" data-* attributes
# 2) Replace visible label text
# 3) Replace placeholder "Lesson N / Ders N" entries with real topic names

# Build replacement map: position 1..107 → (en_title, tr_title)
TITLE_MAP = {}
for i, L in enumerate(LISE_LESSONS, start=1):
    TITLE_MAP[i] = (L['en'], L['tr'])

# Comprehensive text rebrand patterns
TEXT_REPLACEMENTS = [
    # data-* attributes
    ('data-en="High School Math"', 'data-en="Mathematics"'),
    ('data-tr="Lise Matematiği"', 'data-tr="Matematik"'),
    ('data-en="Lise Mat"', 'data-en="Math"'),
    ('data-tr="Lise Mat"', 'data-tr="Matematik"'),
    # Free text instances inside HTML element bodies
    ('>High School Math<', '>Mathematics<'),
    ('>Lise Matematiği<', '>Matematik<'),
]

# Topic-name placeholder replacement regex
# Match: <a href="/tutorials/matematik/N" class="sb-lesson"...><span class="num">NN</span><span class="lbl" data-en="Lesson N" data-tr="Ders N">Lesson N</span></a>
PLACEHOLDER_RE = re.compile(
    r'(<a href="/tutorials/matematik/(\d+)" class="sb-lesson"[^>]*><span class="num">\d+</span><span class="lbl" data-en=")'
    r'Lesson \2'
    r'(" data-tr=")'
    r'Ders \2'
    r'(">)'
    r'Lesson \2'
    r'(</span></a>)'
)


def html_escape(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def replace_placeholder(m):
    n = int(m.group(2))
    if n in TITLE_MAP:
        en_title, tr_title = TITLE_MAP[n]
        en_esc = html_escape(en_title)
        tr_esc = html_escape(tr_title)
        # group(1) = `<a ...>...class="lbl" data-en="`
        # group(3) = `" data-tr="`
        # group(5) = `</span></a>`
        return f'{m.group(1)}{en_esc}{m.group(3)}{tr_esc}{m.group(4)}{en_esc}{m.group(5)}'
    return m.group(0)


def process_file(path):
    txt = path.read_text(encoding='utf-8')
    orig = txt
    # Text-based replacements
    for old, new in TEXT_REPLACEMENTS:
        txt = txt.replace(old, new)
    # Placeholder lesson labels → real topic names
    txt = PLACEHOLDER_RE.sub(replace_placeholder, txt)
    if txt != orig:
        path.write_text(txt, encoding='utf-8')
        return True
    return False


# Process all .html shells across all tracks
all_shells = []
for sub in ROOT.iterdir():
    if not sub.is_dir():
        continue
    for f in sub.glob("*.html"):
        if not f.stem.isdigit() and f.stem != 'index':
            continue
        all_shells.append(f)

updated = 0
for f in all_shells:
    if process_file(f):
        updated += 1

print(f"Updated: {updated}/{len(all_shells)} shells")

# Sanity check: count remaining "Lise Mat" / "High School Math" mentions
remaining = 0
for f in all_shells:
    txt = f.read_text(encoding='utf-8')
    if 'High School Math' in txt or 'Lise Matematiği' in txt or 'Lise Mat' in txt:
        remaining += 1
print(f"Remaining shells with leftover label: {remaining}")
