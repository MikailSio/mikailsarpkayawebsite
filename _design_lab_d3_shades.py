"""3 D3 koyu ton varyantı — saf siyah / soft warm dark / koyu gri."""
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com")
SHELL = ROOT / "tutorials/c/1-D3.html"  # already has D3 fonts
shell_html = SHELL.read_text(encoding='utf-8')

SHADES = {
    'D3-black': {  # Saf siyah (original D)
        '--bg-0': '#000000',
        '--bg-1': '#0a0a0a',
        '--bg-2': '#141414',
        '--surface': '#0a0a0a',
        '--surface-hover': '#1a1a1a',
        '--border': '#2a2a2a',
        '--border-strong': '#444444',
    },
    'D3-deep': {  # Soft warm dark (önerim)
        '--bg-0': '#0e1014',
        '--bg-1': '#14171c',
        '--bg-2': '#1a1e25',
        '--surface': '#14171c',
        '--surface-hover': '#1c2129',
        '--border': '#2a3038',
        '--border-strong': '#3a4250',
    },
    'D3-gray': {  # Daha açık gri (alternatif)
        '--bg-0': '#1a1d22',
        '--bg-1': '#20242b',
        '--bg-2': '#272c34',
        '--surface': '#20242b',
        '--surface-hover': '#272c34',
        '--border': '#383e48',
        '--border-strong': '#4a525e',
    },
}

for key, vars in SHADES.items():
    # D3 CSS + shade override
    d3_css = (ROOT / "tutorials/c/style-D3.css").read_text(encoding='utf-8')
    override = f"\n\n/* === {key} shade override === */\n:root {{\n"
    for k, v in vars.items():
        override += f"  {k}: {v} !important;\n"
    override += "}\n"
    override += "body { background: var(--bg-0) !important; }\n"
    out_css = ROOT / f"tutorials/c/style-{key}.css"
    out_css.write_text(d3_css + override, encoding='utf-8')

    # Shell
    new_shell = shell_html.replace(
        '<link rel="stylesheet" href="style-D3.css?v=1">',
        f'<link rel="stylesheet" href="style-{key}.css?v=1">'
    )
    new_shell = new_shell.replace(
        '<title>[D3]',
        f'<title>[{key}]'
    )
    out_shell = ROOT / f"tutorials/c/1-{key}.html"
    out_shell.write_text(new_shell, encoding='utf-8')

    print(f"✓ {key} → /tutorials/c/1-{key}.html  (bg: {vars['--bg-0']})")
