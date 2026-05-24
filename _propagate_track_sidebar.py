"""Generic sidebar propagator. Inserts a track's sidebar block into all OTHER shells
right after the 'after_track' block, mirroring the structure used in the track's own shells.

Usage: python _propagate_track_sidebar.py <slug>
"""
import sys
import re
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

# Import config from _make_track_shells
sys.path.insert(0, str(Path(__file__).parent))
from _make_track_shells import TRACK_CONFIGS

def build_sidebar_block(track_slug, conf):
    n = len(conf['lessons'])
    items = []
    for i, L in enumerate(conf['lessons'], start=1):
        items.append(
            f'              <a href="/tutorials/{track_slug}/{i}" class="sb-lesson">'
            f'<span class="num">{i:02d}</span>'
            f'<span class="lbl" data-en="{L["en"]}" data-tr="{L["tr"]}">{L["en"]}</span></a>'
        )
    items_html = '\n'.join(items)
    return f"""          <div class="sb-track">
            <div class="sb-track-label" data-en="{conf['sidebar_label_en']}" data-tr="{conf['sidebar_label_tr']}">{conf['sidebar_label_en']}</div>
            <div class="sb-track-items">
{items_html}
            </div>
          </div>
"""

def update_shell(path: Path, track_slug: str, new_block: str, after_label_en: str) -> int:
    try:
        txt = path.read_text(encoding='utf-8')
    except Exception as e:
        return -2
    if f'/tutorials/{track_slug}/1' in txt and 'sb-lesson' in txt and conf['sidebar_label_en'] in txt:
        return 2  # already has it
    # Find the after_track block end (between two `          </div>` markers)
    # Use the after_label to anchor
    pat = re.compile(
        r'(          <div class="sb-track[^"]*">\s*\n'
        r'            <div class="sb-track-label" data-en="' + re.escape(after_label_en) + r'".*?</div>\s*\n'
        r'          </div>\s*\n)',
        re.DOTALL
    )
    m = pat.search(txt)
    if not m:
        return -1
    new_txt = txt[:m.end()] + new_block + txt[m.end():]
    path.write_text(new_txt, encoding='utf-8')
    return 1


if __name__ == '__main__':
    slug = sys.argv[1]
    conf = TRACK_CONFIGS[slug]
    after_track = conf['after_track']
    after_label_en = (TRACK_CONFIGS[after_track]['sidebar_label_en']
                      if after_track in TRACK_CONFIGS
                      else 'Fourier &amp; Signal')

    new_block = build_sidebar_block(slug, conf)

    all_shells = []
    for sub in ROOT.iterdir():
        if not sub.is_dir() or sub.name == slug:
            continue
        for f in sub.glob("*.html"):
            if f.stem == 'index' or not f.stem.isdigit():
                continue
            all_shells.append(f)

    print(f"Found {len(all_shells)} target shells. Inserting {slug} after '{after_label_en}'")
    stats = {'updated': 0, 'already': 0, 'no_match': 0}
    for f in all_shells:
        r = update_shell(f, slug, new_block, after_label_en)
        if r == 1: stats['updated'] += 1
        elif r == 2: stats['already'] += 1
        elif r == -1: stats['no_match'] += 1
    print(f"  updated: {stats['updated']}, already had: {stats['already']}, no match: {stats['no_match']}")
