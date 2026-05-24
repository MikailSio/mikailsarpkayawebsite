"""
Design Lab — generate 4 design variants of tutorials/c/1.html
Each variant: own shell + own CSS file (style.css base + design-specific overrides).

Output:
  tutorials/c/1-A.html  +  style-A.css   — Premium Glassmorphism Refined
  tutorials/c/1-B.html  +  style-B.css   — Editorial / Magazine
  tutorials/c/1-C.html  +  style-C.css   — Apple Docs / Minimal Clean
  tutorials/c/1-D.html  +  style-D.css   — Vercel/Brutalist / Bold

Then visit http://localhost:3456/tutorials/c/1-{A,B,C,D}.html
"""
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com")
SHELL = ROOT / "tutorials/c/1.html"
BASE_CSS = ROOT / "tutorials/c/style.css"

shell_html = SHELL.read_text(encoding='utf-8')
base_css = BASE_CSS.read_text(encoding='utf-8')

# ===== DESIGN A — Premium Glassmorphism Refined =====
DESIGN_A_OVERRIDES = """
/* ============================================================
   DESIGN A — Premium Glassmorphism Refined
   Mevcut yönün polished hali: daha smooth, daha sophisticated
   ============================================================ */

:root {
  /* Daha derin & warm dark */
  --bg-0: #0a0c10;
  --bg-1: #0f1218;
  --bg-2: #161a22;
  --surface: rgba(22, 26, 34, 0.55);
  --surface-hover: rgba(28, 33, 43, 0.72);
  --border: rgba(255, 255, 255, 0.06);
  --border-strong: rgba(255, 255, 255, 0.10);

  /* Text */
  --text-0: #f5f6f8;
  --text-1: #c8ccd4;
  --text-2: #8a929e;
  --text-3: #5a626e;

  /* Refined accent (slightly muted green for warmth) */
  --accent: #4de87a;
  --accent-soft: rgba(77, 232, 122, 0.18);
  --accent-glow: rgba(77, 232, 122, 0.25);

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'DM Mono', monospace;
}

html[data-theme="dark"] body {
  background: radial-gradient(ellipse 80% 60% at 50% 0%, #131722 0%, var(--bg-0) 100%) fixed;
  color: var(--text-1);
  font-family: var(--font-sans);
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'ss01';
  letter-spacing: -0.01em;
}

/* Refined glass cards */
.card, .lesson-card, .cc-card, .info-card, .objective-card {
  background: var(--surface) !important;
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--border) !important;
  border-radius: 14px !important;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.04) inset,
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.25),
    0 16px 48px rgba(0, 0, 0, 0.15) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s !important;
}

.card:hover, .lesson-card:hover, .cc-card:hover {
  border-color: var(--border-strong) !important;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.08) inset,
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 16px 32px rgba(0, 0, 0, 0.3),
    0 24px 64px rgba(0, 0, 0, 0.2),
    0 0 0 1px var(--accent-soft) !important;
  transform: translateY(-2px) !important;
}

/* Refined typography */
h1, .l-title, .lesson-title {
  font-family: var(--font-display) !important;
  font-weight: 700 !important;
  font-size: clamp(2rem, 4vw, 2.75rem) !important;
  letter-spacing: -0.03em !important;
  line-height: 1.1 !important;
  background: linear-gradient(180deg, #ffffff 0%, #c8ccd4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-weight: 600 !important;
  font-size: 1.6rem !important;
  letter-spacing: -0.02em !important;
  color: var(--text-0) !important;
  margin-top: 2.5rem !important;
}

h3 {
  font-weight: 600 !important;
  font-size: 1.2rem !important;
  letter-spacing: -0.015em !important;
  color: var(--text-0) !important;
}

p, li {
  line-height: 1.7 !important;
  color: var(--text-1) !important;
}

/* Refined code blocks */
pre, .code-block {
  background: linear-gradient(135deg, #0d1017 0%, #11151e 100%) !important;
  border: 1px solid var(--border) !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  padding: 1.2rem 1.4rem !important;
}

code {
  font-family: var(--font-mono) !important;
  font-feature-settings: 'liga' off;
}

/* Refined links */
a:not(.sb-lesson):not(.nav-logo):not(.sb-back) {
  color: var(--accent) !important;
  text-decoration: none;
  background: linear-gradient(var(--accent), var(--accent)) no-repeat bottom / 0% 1.5px;
  transition: background-size 0.25s;
}
a:not(.sb-lesson):not(.nav-logo):not(.sb-back):hover {
  background-size: 100% 1.5px;
}

/* Sidebar refinement */
.sidebar.sb-v3 .sb-section.open > .sb-section-label {
  color: var(--accent) !important;
}
.sb-lesson:hover {
  background: var(--accent-soft) !important;
  color: var(--text-0) !important;
}

/* Subtle accent glow on tags/badges */
.tag, .badge, .chip {
  background: var(--accent-soft) !important;
  color: var(--accent) !important;
  border: 1px solid var(--accent-soft) !important;
  border-radius: 6px !important;
  padding: 0.2rem 0.6rem !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
}
"""

# ===== DESIGN B — Editorial / Magazine =====
DESIGN_B_OVERRIDES = """
/* ============================================================
   DESIGN B — Editorial / Magazine
   Serif başlıklar + bol boşluk + warm light mode default
   Medium / The New Yorker / Stripe Press
   ============================================================ */

:root {
  /* Warm light palette */
  --bg-0: #fdfaf3;
  --bg-1: #f7f3e8;
  --bg-2: #efeadb;
  --surface: #fdfaf3;
  --surface-hover: #f7f3e8;
  --border: rgba(50, 40, 30, 0.12);
  --border-strong: rgba(50, 40, 30, 0.20);

  /* Ink text */
  --text-0: #1a1610;
  --text-1: #3a3328;
  --text-2: #6b6358;
  --text-3: #95897a;

  /* Sage green accent (warmer) */
  --accent: #5a7a47;
  --accent-soft: rgba(90, 122, 71, 0.12);
  --accent-glow: rgba(90, 122, 71, 0.18);

  /* Typography */
  --font-serif: 'Source Serif Pro', 'Crimson Pro', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', 'JetBrains Mono', monospace;
}

/* Force light mode appearance even in dark theme */
body, html[data-theme="dark"] body, html[data-theme="light"] body {
  background: var(--bg-0) !important;
  color: var(--text-1) !important;
  font-family: var(--font-sans) !important;
  font-size: 17px !important;
  line-height: 1.75 !important;
}

/* Serif headlines */
h1, h2, h3, h4, h5, h6,
.l-title, .lesson-title, .cc-title, .card-title {
  font-family: var(--font-serif) !important;
  color: var(--text-0) !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em !important;
}

h1, .l-title, .lesson-title {
  font-size: clamp(2.4rem, 4.5vw, 3.4rem) !important;
  line-height: 1.15 !important;
  font-weight: 700 !important;
  margin-bottom: 0.5rem !important;
  letter-spacing: -0.025em !important;
}

h2 {
  font-size: 1.85rem !important;
  margin-top: 3.5rem !important;
  margin-bottom: 1rem !important;
  border-bottom: 1px solid var(--border) !important;
  padding-bottom: 0.5rem !important;
}

h3 {
  font-size: 1.35rem !important;
  margin-top: 2.5rem !important;
  font-style: italic !important;
  font-weight: 500 !important;
}

/* Body & paragraph */
p, li {
  color: var(--text-1) !important;
  font-size: 17px !important;
  line-height: 1.75 !important;
  letter-spacing: 0.005em !important;
}

p { margin-bottom: 1.25rem !important; }

/* Subtle cards — just bottom border, no glassmorphism */
.card, .lesson-card, .cc-card, .info-card, .objective-card {
  background: transparent !important;
  border: none !important;
  border-top: 1px solid var(--border) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 2rem 0 !important;
  backdrop-filter: none !important;
}

.card:hover, .lesson-card:hover {
  background: transparent !important;
  transform: none !important;
}

/* Code blocks: warm paper */
pre, .code-block {
  background: #f0ebdc !important;
  border: 1px solid var(--border) !important;
  border-left: 3px solid var(--accent) !important;
  border-radius: 4px !important;
  padding: 1.2rem 1.5rem !important;
  font-family: var(--font-mono) !important;
  font-size: 0.92rem !important;
  box-shadow: none !important;
  color: var(--text-0) !important;
}

code {
  background: var(--accent-soft) !important;
  color: var(--text-0) !important;
  padding: 0.1rem 0.4rem !important;
  border-radius: 3px !important;
  font-family: var(--font-mono) !important;
  font-size: 0.92em !important;
}

pre code {
  background: transparent !important;
  padding: 0 !important;
}

/* Editorial links */
a:not(.sb-lesson):not(.nav-logo):not(.sb-back) {
  color: var(--accent) !important;
  text-decoration: underline !important;
  text-decoration-color: var(--accent-soft) !important;
  text-underline-offset: 3px !important;
  text-decoration-thickness: 2px !important;
}
a:not(.sb-lesson):not(.nav-logo):not(.sb-back):hover {
  text-decoration-color: var(--accent) !important;
}

/* First paragraph drop cap */
.lesson-content > p:first-of-type::first-letter,
.cc-body > p:first-of-type::first-letter {
  font-family: var(--font-serif);
  font-size: 4rem;
  font-weight: 700;
  float: left;
  line-height: 0.85;
  margin: 0.1rem 0.5rem 0 0;
  color: var(--accent);
}

/* Tables — clean editorial */
table {
  border: none !important;
  border-top: 2px solid var(--text-0) !important;
  border-bottom: 2px solid var(--text-0) !important;
}
th {
  border-bottom: 1px solid var(--text-0) !important;
  background: transparent !important;
  font-family: var(--font-serif) !important;
  font-weight: 600 !important;
  color: var(--text-0) !important;
}
td {
  border-color: var(--border) !important;
}

/* Sidebar — minimal serif */
.sidebar.sb-v3 {
  background: var(--bg-1) !important;
  border-right: 1px solid var(--border) !important;
}
.sb-current-title {
  font-family: var(--font-serif) !important;
  color: var(--text-0) !important;
}

/* Nav */
#nav {
  background: var(--bg-0) !important;
  border-bottom: 1px solid var(--border) !important;
  backdrop-filter: none !important;
}
.nav-logo {
  font-family: var(--font-serif) !important;
  font-weight: 700 !important;
  color: var(--text-0) !important;
}
"""

# ===== DESIGN C — Apple Docs / Minimal Clean =====
DESIGN_C_OVERRIDES = """
/* ============================================================
   DESIGN C — Apple Docs / Minimal Clean
   Maksimum sade, system font, çok boşluk, sadece içerik
   ============================================================ */

:root {
  --bg-0: #ffffff;
  --bg-1: #fafafb;
  --bg-2: #f5f5f7;
  --surface: #ffffff;
  --surface-hover: #fafafb;
  --border: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.14);

  --text-0: #1d1d1f;
  --text-1: #3a3a3c;
  --text-2: #6e6e73;
  --text-3: #aeaeb2;

  --accent: #0066cc;
  --accent-soft: rgba(0, 102, 204, 0.10);

  --font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
  --font-mono: 'SF Mono', 'JetBrains Mono', 'Menlo', monospace;
}

body, html[data-theme="dark"] body, html[data-theme="light"] body {
  background: var(--bg-0) !important;
  color: var(--text-0) !important;
  font-family: var(--font-sans) !important;
  font-size: 17px !important;
  line-height: 1.7 !important;
  letter-spacing: -0.011em !important;
  -webkit-font-smoothing: antialiased;
}

/* Typography — Apple-style: heavy hero, light hierarchy */
h1, .l-title, .lesson-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem) !important;
  font-weight: 700 !important;
  letter-spacing: -0.04em !important;
  line-height: 1.07 !important;
  color: var(--text-0) !important;
  margin-bottom: 1.5rem !important;
}

h2 {
  font-size: 1.75rem !important;
  font-weight: 600 !important;
  letter-spacing: -0.025em !important;
  color: var(--text-0) !important;
  margin-top: 4rem !important;
  margin-bottom: 1rem !important;
}

h3 {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  letter-spacing: -0.015em !important;
  color: var(--text-0) !important;
  margin-top: 2.5rem !important;
}

p, li {
  color: var(--text-1) !important;
  font-size: 17px !important;
  line-height: 1.7 !important;
}

/* No cards — just clean content blocks */
.card, .lesson-card, .cc-card, .info-card, .objective-card {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 2rem 0 !important;
  backdrop-filter: none !important;
  margin: 2rem 0 !important;
}

/* Hero objective gets very subtle treatment */
.objective-card, .l-objective {
  background: var(--bg-2) !important;
  border-radius: 18px !important;
  padding: 2rem !important;
  border: none !important;
}

/* Code blocks — clean and quiet */
pre, .code-block {
  background: var(--bg-2) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 1.5rem !important;
  font-family: var(--font-mono) !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
  box-shadow: none !important;
  color: var(--text-0) !important;
}

code {
  background: var(--bg-2) !important;
  color: var(--text-0) !important;
  padding: 0.15rem 0.45rem !important;
  border-radius: 5px !important;
  font-family: var(--font-mono) !important;
  font-size: 0.92em !important;
}

pre code { background: transparent !important; padding: 0 !important; }

/* Links — Apple blue */
a:not(.sb-lesson):not(.nav-logo):not(.sb-back) {
  color: var(--accent) !important;
  text-decoration: none !important;
  font-weight: 500 !important;
}
a:not(.sb-lesson):not(.nav-logo):not(.sb-back):hover {
  text-decoration: underline !important;
  text-underline-offset: 3px !important;
}

/* Tables — clean grid */
table {
  border: none !important;
  border-collapse: collapse !important;
  margin: 2rem 0 !important;
}
th {
  background: var(--bg-2) !important;
  font-weight: 600 !important;
  color: var(--text-0) !important;
  border: none !important;
  padding: 0.75rem 1rem !important;
  text-align: left !important;
}
td {
  border: none !important;
  border-top: 1px solid var(--border) !important;
  padding: 0.75rem 1rem !important;
  color: var(--text-1) !important;
}
tr:first-child td { border-top: none !important; }

/* Sidebar — minimal */
.sidebar.sb-v3 {
  background: var(--bg-1) !important;
  border-right: 1px solid var(--border) !important;
}
.sb-section.open > .sb-section-label {
  color: var(--accent) !important;
}
.sb-lesson {
  color: var(--text-1) !important;
}
.sb-lesson:hover {
  background: var(--bg-2) !important;
  color: var(--text-0) !important;
}

/* Nav — translucent like macOS */
#nav {
  background: rgba(255, 255, 255, 0.72) !important;
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border) !important;
}
.nav-logo, .nav-btn { color: var(--text-0) !important; }

/* Lots of breathing room in main */
.main {
  max-width: 820px !important;
  padding: 3rem 2rem !important;
  margin: 0 auto !important;
}
"""

# ===== DESIGN D — Vercel/Brutalist / Bold Geometric =====
DESIGN_D_OVERRIDES = """
/* ============================================================
   DESIGN D — Vercel / Stripe Press / Bold Brutalist
   Geist/DM Sans, kalın font, keşkin köşeler, kalın borderlar
   Karakterli, modern, tech-bold
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

  /* Electric accent */
  --accent: #00d9ff;
  --accent-2: #ff0080;
  --accent-soft: rgba(0, 217, 255, 0.12);
  --accent-glow: rgba(0, 217, 255, 0.35);

  --font-sans: 'Geist', 'DM Sans', -apple-system, sans-serif;
  --font-display: 'Geist', 'DM Sans', sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
}

body, html[data-theme="dark"] body {
  background: var(--bg-0) !important;
  color: var(--text-1) !important;
  font-family: var(--font-sans) !important;
  font-feature-settings: 'ss01', 'cv11';
  letter-spacing: -0.011em !important;
}

/* BOLD geometric typography */
h1, .l-title, .lesson-title {
  font-family: var(--font-display) !important;
  font-size: clamp(2.5rem, 5vw, 4rem) !important;
  font-weight: 800 !important;
  letter-spacing: -0.04em !important;
  line-height: 1.05 !important;
  color: var(--text-0) !important;
  margin-bottom: 1rem !important;
  text-transform: none !important;
}

h2 {
  font-family: var(--font-display) !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  letter-spacing: -0.03em !important;
  color: var(--text-0) !important;
  margin-top: 3rem !important;
  margin-bottom: 1rem !important;
  position: relative;
  padding-left: 1rem;
}
h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 4px;
  background: var(--accent);
}

h3 {
  font-weight: 700 !important;
  font-size: 1.35rem !important;
  letter-spacing: -0.02em !important;
  color: var(--text-0) !important;
  text-transform: uppercase !important;
  font-size: 0.95rem !important;
  letter-spacing: 0.08em !important;
  color: var(--accent) !important;
}

p, li {
  font-size: 1rem !important;
  line-height: 1.65 !important;
  color: var(--text-1) !important;
}

/* Sharp brutalist cards */
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

.card:hover, .lesson-card:hover {
  background: var(--surface-hover) !important;
  border-color: var(--border-strong) !important;
  border-left-color: var(--accent) !important;
  transform: translateX(4px) !important;
  box-shadow: -4px 0 0 var(--accent) !important;
}

/* Code blocks — terminal style */
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
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%);
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

/* Bold links */
a:not(.sb-lesson):not(.nav-logo):not(.sb-back) {
  color: var(--accent) !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  position: relative;
  padding-bottom: 1px;
  border-bottom: 1px solid var(--accent-soft);
  transition: border-color 0.2s, color 0.2s;
}
a:not(.sb-lesson):not(.nav-logo):not(.sb-back):hover {
  border-bottom-color: var(--accent) !important;
  color: var(--text-0) !important;
}

/* Tables — bold grid */
table {
  border: 2px solid var(--text-0) !important;
  border-collapse: collapse !important;
  margin: 2rem 0 !important;
}
th {
  background: var(--text-0) !important;
  color: var(--bg-0) !important;
  font-family: var(--font-display) !important;
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

/* Sidebar — terminal-ish */
.sidebar.sb-v3 {
  background: var(--bg-0) !important;
  border-right: 1px solid var(--border) !important;
  font-family: var(--font-sans) !important;
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

/* Nav — terminal */
#nav {
  background: var(--bg-0) !important;
  border-bottom: 1px solid var(--border) !important;
  backdrop-filter: none !important;
}
.nav-logo {
  font-family: var(--font-display) !important;
  font-weight: 800 !important;
  letter-spacing: -0.05em !important;
  color: var(--text-0) !important;
}

/* Tags & badges — sharp */
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
"""

# === Generate files ===
designs = {
    'A': ('Premium Glassmorphism Refined', DESIGN_A_OVERRIDES),
    'B': ('Editorial / Magazine', DESIGN_B_OVERRIDES),
    'C': ('Apple Docs / Minimal Clean', DESIGN_C_OVERRIDES),
    'D': ('Vercel / Brutalist / Bold', DESIGN_D_OVERRIDES),
}

for key, (name, overrides) in designs.items():
    # CSS: base + overrides
    css_out = ROOT / f"tutorials/c/style-{key}.css"
    css_out.write_text(base_css + "\n\n" + overrides, encoding='utf-8')

    # Shell: copy + change CSS link
    new_shell = shell_html.replace(
        '<link rel="stylesheet" href="style.css?v=1">',
        f'<link rel="stylesheet" href="style-{key}.css?v=1">'
    )
    # Also tag the design in title so we know which is which
    new_shell = new_shell.replace(
        '<title>Hello World &amp; Compilation — C Language — Mikail Sarpkaya</title>',
        f'<title>[DESIGN {key}] Hello World — {name}</title>'
    )

    html_out = ROOT / f"tutorials/c/1-{key}.html"
    html_out.write_text(new_shell, encoding='utf-8')

    print(f"✓ Design {key} ({name})")
    print(f"  → http://localhost:3456/tutorials/c/1-{key}.html")

print("\n" + "="*60)
print("Karşılaştırma için 4 sekme açıp yan yana koy:")
for key in designs:
    print(f"  http://localhost:3456/tutorials/c/1-{key}.html")
