"""
D-Font variants — D'nin iskeletinde 3 farklı playful/comic font deneyi.

D1 — Comic Neue (her yerde — Comic Sans replacement)
D2 — Fredoka (rounded friendly — modern playful)
D3 — Caveat headings + Geist body (handwritten H1/H2 sadece)

Output:
  tutorials/c/1-D1.html  +  style-D1.css
  tutorials/c/1-D2.html  +  style-D2.css
  tutorials/c/1-D3.html  +  style-D3.css
"""
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com")
SHELL = ROOT / "tutorials/c/1.html"
BASE_CSS = ROOT / "tutorials/c/style.css"
DESIGN_D_CSS = ROOT / "tutorials/c/style-D.css"

shell_html = SHELL.read_text(encoding='utf-8')
design_d_css = DESIGN_D_CSS.read_text(encoding='utf-8')

# Google Fonts preconnect already in shell head. We add Google Fonts link.

GOOGLE_FONTS = {
    'D1': 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Geist+Mono:wght@400;500&display=swap',
    'D2': 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
    'D3': 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap',
}

FONT_OVERRIDES = {
    'D1': """
/* === D1 — Comic Neue (Comic Sans replacement) === */
:root {
  --font-sans: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif !important;
  --font-display: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif !important;
}
body, .main, p, li, .card, .lesson-card, .cc-card, .info-card, .objective-card,
.sidebar.sb-v3, .sb-current-title, .sb-lesson, .sb-section-label {
  font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif !important;
}
h1, h2, h3, h4, h5, h6, .l-title, .lesson-title, .cc-title, .card-title {
  font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif !important;
  font-weight: 700 !important;
}
.nav-logo { font-family: 'Comic Neue', cursive !important; font-weight: 700 !important; }
/* Code stays monospace — readability */
pre, code, pre code { font-family: 'Geist Mono', 'JetBrains Mono', monospace !important; }
""",
    'D2': """
/* === D2 — Fredoka (rounded friendly modern playful) === */
:root {
  --font-sans: 'Fredoka', 'Inter', sans-serif !important;
  --font-display: 'Fredoka', 'Inter', sans-serif !important;
}
body, .main, p, li, .card, .lesson-card, .cc-card, .info-card, .objective-card,
.sidebar.sb-v3, .sb-current-title, .sb-lesson, .sb-section-label {
  font-family: 'Fredoka', 'Inter', sans-serif !important;
}
h1, h2, h3, h4, h5, h6, .l-title, .lesson-title, .cc-title, .card-title {
  font-family: 'Fredoka', 'Inter', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: -0.02em !important;
}
.nav-logo { font-family: 'Fredoka', sans-serif !important; font-weight: 700 !important; }
/* Code stays monospace */
pre, code, pre code { font-family: 'Geist Mono', 'JetBrains Mono', monospace !important; }
""",
    'D3': """
/* === D3 — Caveat headings + Geist body (selective handwritten) === */
:root {
  --font-display: 'Caveat', cursive !important;
  --font-sans: 'Geist', 'Inter', sans-serif !important;
}
/* Body & UI stays clean Geist */
body, .main, p, li, .card, .lesson-card, .cc-card, .info-card, .objective-card,
.sidebar.sb-v3, .sb-current-title, .sb-lesson, .sb-section-label {
  font-family: 'Geist', 'Inter', sans-serif !important;
}
/* Only big headings get Caveat handwritten flair */
h1, .l-title, .lesson-title {
  font-family: 'Caveat', cursive !important;
  font-weight: 700 !important;
  font-size: clamp(3.5rem, 7vw, 5rem) !important;
  letter-spacing: 0 !important;
  line-height: 1 !important;
  color: var(--text-0) !important;
  margin-bottom: 1.5rem !important;
}
h2 {
  font-family: 'Caveat', cursive !important;
  font-weight: 700 !important;
  font-size: 2.4rem !important;
  letter-spacing: 0 !important;
  color: var(--accent) !important;
}
h2::before {
  background: var(--accent) !important;
}
h3 {
  font-family: 'Geist', sans-serif !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  font-size: 0.95rem !important;
}
.cc-title, .card-title {
  font-family: 'Caveat', cursive !important;
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  color: var(--accent) !important;
}
.nav-logo {
  font-family: 'Caveat', cursive !important;
  font-weight: 700 !important;
  font-size: 1.8rem !important;
}
/* Code stays monospace */
pre, code, pre code { font-family: 'Geist Mono', 'JetBrains Mono', monospace !important; }
""",
}

for key, override in FONT_OVERRIDES.items():
    # CSS = D base + font override
    css_out = ROOT / f"tutorials/c/style-{key}.css"
    css_out.write_text(design_d_css + "\n\n" + override, encoding='utf-8')

    # Shell: copy + change CSS link + inject Google Fonts link in head
    new_shell = shell_html.replace(
        '<link rel="stylesheet" href="style.css?v=1">',
        f'<link rel="stylesheet" href="{GOOGLE_FONTS[key]}">\n<link rel="stylesheet" href="style-{key}.css?v=1">'
    )
    new_shell = new_shell.replace(
        '<title>Hello World &amp; Compilation — C Language — Mikail Sarpkaya</title>',
        f'<title>[{key}] {{"D1":"Comic Neue","D2":"Fredoka","D3":"Caveat headings"}}[key] — Hello World</title>'.replace("{key}", key)
    )
    html_out = ROOT / f"tutorials/c/1-{key}.html"
    html_out.write_text(new_shell, encoding='utf-8')

    print(f"✓ {key} → http://localhost:3456/tutorials/c/1-{key}.html")
