"""check_links.py — validate internal /tutorials/ links across the new slug structure.

Flags two failure modes in the generated pages:
  1) REWRITE MISS  — a link to a migrated track's OLD numbered URL (/tutorials/nlp/3)
                     that should have become a slug.
  2) BROKEN SLUG   — a /tutorials/<cat>/<sub>/<slug> link with no matching file.
Links to TR content (matematik/ales), shared assets, course bases, and the home
page are treated as OK.
"""
import re
import collections
from pathlib import Path
import gen_tutorials_v4 as G

TUT = G.TUT
NEW_CATS = ["ai", "math", "programming", "security", "tools"]

valid_slugs = set(G.GLOBAL.values())                       # /tutorials/ai/nlp/text-preprocessing
course_bases = {v.rstrip("/") for v in G.COURSE.values()}  # /tutorials/ai/nlp
migrated = set(G.MIGRATE.keys())

href_re = re.compile(r'(?:href|src)="(/tutorials/[^"#?]*)"')
num_re = re.compile(r"^/tutorials/([a-z0-9-]+)/(\d+)$")

rewrite_miss = collections.Counter()
broken_slug = collections.Counter()
file_misses = collections.Counter()
files = [p for c in NEW_CATS for ext in ("*.html", "*.js") for p in (TUT / c).rglob(ext)]

for f in files:
    for href in href_re.findall(f.read_text(encoding="utf-8")):
        h = href.rstrip("/")
        if href in ("/tutorials", "/tutorials/"):
            continue
        if h in valid_slugs or h in course_bases:
            continue
        m = num_re.match(h)
        if m:
            track = m.group(1)
            if track in migrated:
                rewrite_miss[track] += 1            # should have been a slug
                file_misses[str(f.relative_to(TUT))] += 1
            continue                                 # TR (matematik/ales) or non-migrated -> ok
        # an asset or real file on disk?
        rel = h[len("/tutorials/"):]
        if (TUT / rel).exists() or (TUT / (rel + ".html")).exists():
            continue
        # /tutorials/<cat>/<sub> course base already covered; otherwise broken
        broken_slug[h] += 1

print(f"Scanned {len(files)} files.")
print(f"Valid slug URLs: {len(valid_slugs)} | course bases: {len(course_bases)}")
print(f"\nREWRITE MISSES (migrated track still linked by number): {sum(rewrite_miss.values())}")
for t, c in rewrite_miss.most_common(20):
    print(f"   {t}: {c}")
print("\nTop files with misses:")
for fn, c in file_misses.most_common(15):
    print(f"   {fn}: {c}")
print(f"\nBROKEN SLUG LINKS (no file, no redirect): {sum(broken_slug.values())} unique={len(broken_slug)}")
for h, c in broken_slug.most_common(25):
    print(f"   {h}  (x{c})")
