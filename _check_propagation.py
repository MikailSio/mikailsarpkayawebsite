import sys
from pathlib import Path
import collections
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path('tutorials')
no_match = []
for sub in ROOT.iterdir():
    if not sub.is_dir() or sub.name == 'fourier':
        continue
    for f in sub.glob('*.html'):
        if f.stem == 'index' or not f.stem.isdigit():
            continue
        txt = f.read_text(encoding='utf-8')
        if 'tutorials/fourier/1' not in txt:
            no_match.append(str(f.relative_to(ROOT)).replace('\\', '/'))

print(f'Total shells without fourier: {len(no_match)}')
by_track = collections.Counter(f.split('/')[0] for f in no_match)
for t, c in by_track.most_common():
    print(f'  {t}: {c}')
