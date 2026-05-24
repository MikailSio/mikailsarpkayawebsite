"""Insert Fourier track into the Mathematics sidebar section of every shell site-wide.
The fourier shells already have it; this updates ALL OTHER shells.
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

FOURIER_BLOCK = """          <div class="sb-track">
            <div class="sb-track-label" data-en="Fourier &amp; Signal" data-tr="Fourier &amp; Sinyal">Fourier &amp; Signal</div>
            <div class="sb-track-items">
              <a href="/tutorials/fourier/1" class="sb-lesson"><span class="num">01</span><span class="lbl" data-en="Periodic Functions &amp; Sinusoids" data-tr="Periyodik Fonksiyonlar">Periodic Functions & Sinusoids</span></a>
              <a href="/tutorials/fourier/2" class="sb-lesson"><span class="num">02</span><span class="lbl" data-en="Fourier Series" data-tr="Fourier Serileri">Fourier Series</span></a>
              <a href="/tutorials/fourier/3" class="sb-lesson"><span class="num">03</span><span class="lbl" data-en="Complex Exponential" data-tr="Karmaşık Üstel">Complex Exponential</span></a>
              <a href="/tutorials/fourier/4" class="sb-lesson"><span class="num">04</span><span class="lbl" data-en="Fourier Transform" data-tr="Fourier Dönüşümü">Fourier Transform</span></a>
              <a href="/tutorials/fourier/5" class="sb-lesson"><span class="num">05</span><span class="lbl" data-en="DFT &amp; FFT" data-tr="DFT &amp; FFT">DFT & FFT</span></a>
              <a href="/tutorials/fourier/6" class="sb-lesson"><span class="num">06</span><span class="lbl" data-en="Laplace Transform" data-tr="Laplace Dönüşümü">Laplace Transform</span></a>
              <a href="/tutorials/fourier/7" class="sb-lesson"><span class="num">07</span><span class="lbl" data-en="Wavelets" data-tr="Wavelet">Wavelets</span></a>
              <a href="/tutorials/fourier/8" class="sb-lesson"><span class="num">08</span><span class="lbl" data-en="Spectral Methods in ML" data-tr="ML'de Spektral">Spectral Methods in ML</span></a>
            </div>
          </div>
"""

# Pattern: anchor right after the closing of Calculus sb-track, BEFORE ML Mathematics sb-track
# We want to insert FOURIER_BLOCK between Calculus and ML Mathematics.

# Look for the line: <div class="sb-track-label" data-en="ML Mathematics"... and insert before it
# Identify Calculus end: line ending </div> then 2-3 lines later "ML Mathematics" label

CALCULUS_END_PATTERN = re.compile(
    r'(<a href="/tutorials/calculus/6"[^>]*>.*?</a>\s*\n\s*</div>\s*\n\s*</div>\s*\n)'
    r'(\s*<div class="sb-track[^"]*">\s*\n\s*<div class="sb-track-label" data-en="ML Mathematics")',
    re.DOTALL
)

def update_shell(path: Path) -> int:
    """Return 0 if no change, 1 if updated, 2 if already had fourier, -1 if pattern not found."""
    try:
        txt = path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"  ERR read {path}: {e}")
        return -2
    if 'tutorials/fourier/1' in txt and 'sb-lesson' in txt and 'Fourier &amp; Signal' in txt:
        return 2
    m = CALCULUS_END_PATTERN.search(txt)
    if not m:
        return -1
    new_txt = txt[:m.end(1)] + FOURIER_BLOCK + txt[m.start(2):]
    path.write_text(new_txt, encoding='utf-8')
    return 1

# Find all shell HTML files (skip index.html and the fourier shells themselves)
all_shells = []
for sub in ROOT.iterdir():
    if not sub.is_dir():
        continue
    for f in sub.glob("*.html"):
        # only numeric or 'index' shells we own
        nm = f.stem
        if nm == 'index':
            continue
        # Skip fourier (already done)
        if sub.name == 'fourier':
            continue
        if not nm.isdigit():
            continue
        all_shells.append(f)

print(f"Found {len(all_shells)} target shells")

stats = {'updated': 0, 'already': 0, 'no_match': 0, 'error': 0}
no_match_files = []
for f in all_shells:
    r = update_shell(f)
    if r == 1:
        stats['updated'] += 1
    elif r == 2:
        stats['already'] += 1
    elif r == -1:
        stats['no_match'] += 1
        no_match_files.append(str(f.relative_to(ROOT)))
    else:
        stats['error'] += 1

print(f"\nStats:")
print(f"  updated: {stats['updated']}")
print(f"  already had: {stats['already']}")
print(f"  no Calculus→ML Math pattern: {stats['no_match']}")
print(f"  errors: {stats['error']}")
if no_match_files:
    print(f"\nFiles without expected pattern (first 10):")
    for nm in no_match_files[:10]:
        print(f"  {nm}")
