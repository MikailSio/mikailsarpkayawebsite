"""Replace existing lise-mat sidebar block with current (107-lesson) version
across all shells that already have a lise-mat block.

Reads the canonical block from the lise-mat shells themselves (e.g. 1.html)
since the generator just wrote it there with the correct 107 entries.
"""
import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

# Extract the canonical lise-mat block from a freshly-generated lise-mat shell
canonical_src = (ROOT / 'matematik' / '1.html').read_text(encoding='utf-8')

# Pattern to find the lise-mat track block
# Look for "sb-track-label" with data-en="High School Math"
block_re = re.compile(
    r'          <div class="sb-track">\s*\n'
    r'            <div class="sb-track-label" data-en="High School Math"[^>]*>[^<]*</div>\s*\n'
    r'            <div class="sb-track-items">.*?\n          </div>\s*\n',
    re.DOTALL,
)

# Get the canonical block from the lise-mat shell
m = block_re.search(canonical_src)
if not m:
    # Try with sb-lesson class variant (active marker)
    block_re_active = re.compile(
        r'          <div class="sb-track">\s*\n'
        r'            <div class="sb-track-label" data-en="High School Math"[^>]*>[^<]*</div>\s*\n'
        r'            <div class="sb-track-items">.*?\n            </div>\s*\n          </div>\s*\n',
        re.DOTALL,
    )
    m = block_re_active.search(canonical_src)

if not m:
    print("Could not find canonical lise-mat block in 1.html")
    sys.exit(1)

canonical_block = m.group(0)
# In the canonical, there's an "active" marker; strip __LISE-MAT_ACTIVE__ tags
canonical_block = re.sub(r' __LISE-MAT_ACTIVE_\d+__', '', canonical_block)
canonical_block = re.sub(r' __LISE_MAT_ACTIVE_\d+__', '', canonical_block)

# Count lessons in canonical
n_lessons = canonical_block.count('class="sb-lesson"')
print(f"Canonical block has {n_lessons} lesson entries")

# Now replace across all non-lise-mat shells
updated = 0
not_found = 0
all_shells = []
for sub in ROOT.iterdir():
    if not sub.is_dir() or sub.name == 'matematik':
        continue
    for f in sub.glob("*.html"):
        if f.stem == 'index' or not f.stem.isdigit():
            continue
        all_shells.append(f)

# Match existing block, more lenient
existing_re = re.compile(
    r'          <div class="sb-track">\s*\n'
    r'            <div class="sb-track-label" data-en="High School Math"[^>]*>[^<]*</div>\s*\n'
    r'            <div class="sb-track-items">.*?\n            </div>\s*\n          </div>\s*\n',
    re.DOTALL,
)

for f in all_shells:
    txt = f.read_text(encoding='utf-8')
    new_txt, count = existing_re.subn(canonical_block, txt)
    if count == 1:
        f.write_text(new_txt, encoding='utf-8')
        updated += 1
    elif count == 0:
        not_found += 1
    else:
        print(f"Warn: {f} has {count} matches")

print(f"Updated: {updated}, not_found: {not_found}, total: {len(all_shells)}")
