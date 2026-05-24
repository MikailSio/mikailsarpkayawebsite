"""
D3-BLACK MIGRATION
==================
Apply D3-black design across all 44 tutorial tracks (456 lessons).

What it does:
  1. Update tutorials/lesson-master.css → append D3-black design overrides
     (using var(--accent) instead of hardcoded cyan, so per-track accent preserved)
  2. Re-snapshot tutorials/{track}/style.css for all 44 tracks
     (core2 + lesson-master + {track}.css → merged)
  3. Add Google Fonts link (Caveat + Geist + Geist Mono) to every shell
  4. Remove theme toggle button from every shell
  5. Bump cache version: style.css?v=1 → style.css?v=3
"""
import sys, re, shutil
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com")
TUTS = ROOT / "tutorials"

# ============================================================
# D3-BLACK DESIGN OVERRIDES (uses var(--accent) per-track)
# ============================================================
D3_BLACK_OVERRIDES = """

/* ============================================================
   ★ ACTIVE DESIGN — D3-BLACK ★
   Pure black + Geist body + Caveat headings + per-track accent
   Last appended → wins via specificity + !important
   ============================================================ */

:root {
  --bg-0: #000000;
  --bg-1: #0a0a0a;
  --bg-2: #141414;
  --surface: #0a0a0a;
  --surface-hover: #1a1a1a;
  --border: #2a2a2a;
  --border-strong: #444444;
  --text-0: #ffffff;
  --text-1: #ededed;
  --text-2: #a0a0a0;
  --text-3: #707070;
  --accent-soft: color-mix(in srgb, var(--accent, #4de87a) 14%, transparent);
  --accent-glow: color-mix(in srgb, var(--accent, #4de87a) 35%, transparent);
  --font-display: 'Caveat', cursive;
  --font-sans: 'Geist', 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', 'DM Mono', monospace;
}

/* Hardcode dark theme everywhere */
html, html[data-theme="dark"], html[data-theme="light"] {
  color-scheme: dark;
}

body, html[data-theme="dark"] body, html[data-theme="light"] body {
  background: #000000 !important;
  color: var(--text-1) !important;
  font-family: var(--font-sans) !important;
  font-feature-settings: 'ss01', 'cv11';
  letter-spacing: -0.011em !important;
}

/* === Typography — Caveat handwritten H1/H2 + Geist body === */
h1, .l-title, .lesson-title {
  font-family: 'Caveat', cursive !important;
  font-weight: 700 !important;
  font-size: clamp(3.5rem, 7vw, 5rem) !important;
  letter-spacing: 0 !important;
  line-height: 1 !important;
  color: var(--text-0) !important;
  margin-bottom: 1.5rem !important;
  -webkit-text-fill-color: var(--text-0) !important;
  background: none !important;
}

h2 {
  font-family: 'Caveat', cursive !important;
  font-weight: 700 !important;
  font-size: 2.4rem !important;
  letter-spacing: 0 !important;
  color: var(--accent) !important;
  margin-top: 3rem !important;
  margin-bottom: 1rem !important;
  position: relative;
  padding-left: 1rem;
  line-height: 1.1 !important;
}
h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.4rem;
  bottom: 0.4rem;
  width: 4px;
  background: var(--accent);
}

h3 {
  font-family: 'Geist', sans-serif !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  color: var(--accent) !important;
  margin-top: 2rem !important;
  margin-bottom: 0.75rem !important;
}

h4, h5, h6 {
  font-family: 'Geist', sans-serif !important;
  font-weight: 700 !important;
  color: var(--text-0) !important;
}

.cc-title, .card-title {
  font-family: 'Caveat', cursive !important;
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  color: var(--accent) !important;
}

p, li {
  font-size: 1rem !important;
  line-height: 1.65 !important;
  color: var(--text-1) !important;
}

/* === Sharp brutalist cards === */
.card, .lesson-card, .cc-card, .info-card, .objective-card {
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  border-left: 4px solid var(--accent) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  padding: 1.5rem 2rem !important;
  transition: all 0.18s ease !important;
}
.card:hover, .lesson-card:hover, .cc-card:hover {
  background: var(--surface-hover) !important;
  border-color: var(--border-strong) !important;
  border-left-color: var(--accent) !important;
  transform: translateX(4px) !important;
  box-shadow: -4px 0 0 var(--accent) !important;
}

/* === Code blocks — terminal style === */
pre, .code-block {
  background: #000000 !important;
  border: 1px solid var(--border) !important;
  border-radius: 6px !important;
  padding: 1.25rem 1.5rem !important;
  font-family: var(--font-mono) !important;
  font-size: 0.88rem !important;
  font-weight: 400 !important;
  line-height: 1.6 !important;
  color: var(--text-0) !important;
  box-shadow: 0 0 0 1px var(--border), 0 12px 24px rgba(0, 0, 0, 0.4) !important;
  position: relative;
}
pre::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
}

code {
  background: var(--bg-2) !important;
  color: var(--accent) !important;
  padding: 0.15rem 0.5rem !important;
  border-radius: 3px !important;
  border: 1px solid var(--border) !important;
  font-family: var(--font-mono) !important;
  font-size: 0.88em !important;
  font-weight: 500 !important;
}
pre code {
  background: transparent !important;
  border: none !important;
  color: var(--text-0) !important;
  padding: 0 !important;
}

/* === Links === */
a:not(.sb-lesson):not(.nav-logo):not(.sb-back):not(.color-swatch) {
  color: var(--accent) !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  border-bottom: 1px solid var(--accent-soft);
  padding-bottom: 1px;
  transition: border-color 0.2s, color 0.2s;
}
a:not(.sb-lesson):not(.nav-logo):not(.sb-back):not(.color-swatch):hover {
  border-bottom-color: var(--accent) !important;
  color: var(--text-0) !important;
}

/* === Tables — bold grid === */
table {
  border: 2px solid var(--text-0) !important;
  border-collapse: collapse !important;
  margin: 2rem 0 !important;
}
th {
  background: var(--text-0) !important;
  color: #000000 !important;
  font-family: 'Geist', sans-serif !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  font-size: 0.85rem !important;
  letter-spacing: 0.06em !important;
  padding: 0.75rem 1rem !important;
  border: none !important;
}
td {
  border: 1px solid var(--border) !important;
  padding: 0.75rem 1rem !important;
  color: var(--text-1) !important;
}

/* === Sidebar === */
.sidebar.sb-v3 {
  background: #000000 !important;
  border-right: 1px solid var(--border) !important;
  font-family: 'Geist', sans-serif !important;
}
.sb-section.open > .sb-section-label {
  color: var(--accent) !important;
  font-weight: 600 !important;
}
.sb-lesson { color: var(--text-2) !important; }
.sb-lesson:hover {
  background: var(--bg-2) !important;
  color: var(--accent) !important;
  border-left: 2px solid var(--accent) !important;
}

/* === Nav === */
#nav {
  background: #000000 !important;
  border-bottom: 1px solid var(--border) !important;
  backdrop-filter: none !important;
}
.nav-logo {
  font-family: 'Caveat', cursive !important;
  font-weight: 700 !important;
  font-size: 1.8rem !important;
  color: var(--text-0) !important;
}

/* === Tags & badges — sharp === */
.tag, .badge, .chip {
  background: transparent !important;
  color: var(--accent) !important;
  border: 1px solid var(--accent) !important;
  border-radius: 0 !important;
  padding: 0.15rem 0.6rem !important;
  font-family: var(--font-mono) !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
}

/* === Theme toggle removal — hide button if still in DOM === */
#themeTog { display: none !important; }
"""

# ============================================================
# STEP 1: Append D3-black to lesson-master.css
# ============================================================
LM_PATH = TUTS / "lesson-master.css"
lm_text = LM_PATH.read_text(encoding='utf-8')

# Remove old D3-black section if it was previously appended
marker = "/* ============================================================\n   ★ ACTIVE DESIGN — D3-BLACK ★"
if marker in lm_text:
    lm_text = lm_text.split(marker)[0].rstrip() + "\n"

new_lm = lm_text + D3_BLACK_OVERRIDES
LM_PATH.write_text(new_lm, encoding='utf-8')
print(f"✓ Updated tutorials/lesson-master.css ({len(new_lm):,} bytes)")

# ============================================================
# STEP 2: Re-snapshot each track's style.css
# ============================================================
CORE2 = (ROOT / "core2.css").read_text(encoding='utf-8')
LM = new_lm

TRACKS = []
for d in sorted(TUTS.iterdir()):
    if not d.is_dir():
        continue
    track = d.name
    if track in ('ai', 'css', 'glossary', 'languages', 'web'):
        continue  # helper dirs, skip
    if (d / 'style.css').exists():
        TRACKS.append(track)

print(f"\n=== Re-snapshotting style.css for {len(TRACKS)} tracks ===")
for track in TRACKS:
    track_css = TUTS / track / f"{track}.css"
    track_css_text = track_css.read_text(encoding='utf-8') if track_css.exists() else f":root {{ --accent: #4de87a; }}"
    merged = "\n".join([
        "/* === core2.css === */", CORE2,
        "\n/* === lesson-master.css === */", LM,
        f"\n/* === {track}.css === */", track_css_text,
    ])
    out = TUTS / track / "style.css"
    out.write_text(merged, encoding='utf-8')
print(f"✓ Snapshotted {len(TRACKS)} track style.css files")

# ============================================================
# STEP 3: Update all shells (Google Fonts + theme toggle removal + cache bump)
# ============================================================
GFONTS = '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">'

# Theme toggle button pattern in shells (long inline button)
THEME_TOG_PATTERN = re.compile(
    r'<button class="nav-btn" id="themeTog"[^>]*>.*?</button>',
    re.DOTALL
)

# Collect all shells: tutorials/{track}/[0-9]*.html
shells = []
for track in TRACKS:
    shells.extend((TUTS / track).glob("[0-9]*.html"))

print(f"\n=== Updating {len(shells)} shells ===")
gf_added = tog_removed = cache_bumped = 0
for shell in shells:
    text = shell.read_text(encoding='utf-8')
    orig = text

    # 1. Add Google Fonts link (if not already)
    if 'family=Caveat' not in text:
        # Insert right after the existing fonts.googleapis.com link
        text = text.replace(
            '<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue',
            f'{GFONTS}\n<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue',
            1
        )
        gf_added += 1

    # 2. Remove theme toggle button
    if 'id="themeTog"' in text:
        text = THEME_TOG_PATTERN.sub('', text)
        tog_removed += 1

    # 3. Bump cache: style.css?v=N → style.css?v=3
    text2 = re.sub(r'style\.css\?v=\d+', 'style.css?v=3', text)
    if text2 != text:
        cache_bumped += 1
    text = text2

    if text != orig:
        shell.write_text(text, encoding='utf-8')

print(f"  Google Fonts added: {gf_added}")
print(f"  Theme toggle removed: {tog_removed}")
print(f"  Cache bumped: {cache_bumped}")

print("\n=== DONE ===")
print(f"Total shells updated: {len(shells)}")
print(f"Total tracks re-snapshotted: {len(TRACKS)}")
