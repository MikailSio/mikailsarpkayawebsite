"""
ACCENT PALETTE + APPLICATION
============================
1. Assign 8 curated accent colors to all 44 tracks (domain-based)
2. Update core.js color picker presets to these 8 colors only
3. Enhance D3-black accent application: <strong>, callouts, bullets, kbd, drop-cap
4. Re-snapshot all tracks
"""
import sys, re
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com")
TUTS = ROOT / "tutorials"

# 8 curated accent colors (all pop on pure black, WCAG > 6:1)
PALETTE = {
    'green':  '#4de87a',  # Programming Languages
    'cyan':   '#06b6d4',  # Data & Visualization
    'blue':   '#3b82f6',  # Math & Theory
    'gold':   '#c8a96e',  # Core ML / Foundations
    'pink':   '#ec4899',  # Deep Learning / Creative AI
    'purple': '#a855f7',  # NLP / RL / Agents
    'orange': '#f97316',  # MLOps / Infrastructure
    'yellow': '#facc15',  # Security / Trust / Specialized
}

# Track → palette key assignment (44 tracks → 8 colors, domain-based)
TRACK_COLORS = {
    # Programming Languages — green
    'c': 'green', 'cpp': 'green', 'python': 'green', 'js': 'green',
    # Data — cyan
    'numpy': 'cyan', 'pandas': 'cyan', 'matplotlib': 'cyan', 'sql': 'cyan', 'vectordb': 'cyan',
    # Math — blue
    'linalg': 'blue', 'calculus': 'blue', 'math': 'blue', 'ml-theory': 'blue',
    # Core ML — gold
    'sklearn': 'gold', 'gnn': 'gold', 'recsys': 'gold', 'timeseries': 'gold',
    # Deep Learning — pink
    'deep': 'pink', 'pytorch': 'pink', 'huggingface': 'pink', 'cv': 'pink', 'audio': 'pink', 'multimodal': 'pink',
    # NLP / RL / Agents — purple
    'nlp': 'purple', 'rl': 'purple', 'langchain': 'purple', 'agents': 'purple',
    # MLOps / Infrastructure — orange
    'mlops': 'orange', 'gpu': 'orange', 'edge': 'orange', 'latex': 'orange',
    # Security / Specialized — yellow
    'mlsec': 'yellow', 'netsec': 'yellow', 'crypto': 'yellow', 'forensics': 'yellow', 'blockchain': 'yellow',
    'iot': 'yellow', 'safety': 'yellow', 'compliance': 'yellow', 'privacy': 'yellow', 'fairness': 'yellow',
    'causal': 'yellow', 'bio': 'yellow', 'ales': 'yellow',
}

# ============================================================
# STEP 1: Update each track's {track}.css with curated color
# ============================================================
print("=== STEP 1: Track CSS accent assignment ===")
for track, color_key in TRACK_COLORS.items():
    hex_color = PALETTE[color_key]
    track_css = TUTS / track / f"{track}.css"
    if track_css.exists():
        text = track_css.read_text(encoding='utf-8')
        # Replace any existing :root --accent
        new = re.sub(r':root\s*\{\s*--accent:\s*#[0-9a-fA-F]+\s*;?\s*\}',
                     f':root {{ --accent: {hex_color}; }}',
                     text)
        if ':root' not in new:
            new = f"/* {track}.css — accent only; visual system in /tutorials/lesson-master.css */\n:root {{ --accent: {hex_color}; }}\n"
        track_css.write_text(new, encoding='utf-8')
        print(f"  {track:15} → {color_key:7} {hex_color}")

# ============================================================
# STEP 2: Update core.js PRESETS to curated 8 colors
# ============================================================
print("\n=== STEP 2: Update color picker presets ===")
core_js = TUTS / "core.js"
text = core_js.read_text(encoding='utf-8')

new_presets = """  const PRESETS = [
    {c:'#4de87a',n:'Green'},{c:'#06b6d4',n:'Cyan'},{c:'#3b82f6',n:'Blue'},{c:'#c8a96e',n:'Gold'},
    {c:'#ec4899',n:'Pink'},{c:'#a855f7',n:'Purple'},{c:'#f97316',n:'Orange'},{c:'#facc15',n:'Yellow'}
  ];"""

text = re.sub(
    r'  const PRESETS = \[\s*[^\]]+\];',
    new_presets,
    text,
    flags=re.DOTALL
)
core_js.write_text(text, encoding='utf-8')
print(f"  ✓ core.js PRESETS → 8 curated colors")

# ============================================================
# STEP 3: Append ENHANCED accent application to lesson-master.css
# ============================================================
ENHANCED_ACCENT = """

/* ============================================================
   ★ ENHANCED ACCENT APPLICATION
   Selective, tasteful — gives the lesson a comic-book feel
   without overwhelming. Body paragraphs stay neutral.
   ============================================================ */

/* Strong emphasis — accent + bold (highlights key phrases) */
p strong, li strong, .lesson-content strong, .cc-body strong {
  color: var(--accent) !important;
  font-weight: 700 !important;
}

/* Italic emphasis stays neutral — italics already differentiate */
p em, li em {
  color: var(--text-0) !important;
  font-style: italic;
}

/* List bullet markers — accent (subtle but recognizable) */
.lesson-content ul, .cc-body ul {
  list-style: none;
  padding-left: 1.2rem;
}
.lesson-content ul li, .cc-body ul li {
  position: relative;
  padding-left: 0.5rem;
}
.lesson-content ul li::before, .cc-body ul li::before {
  content: '●';
  position: absolute;
  left: -1rem;
  color: var(--accent);
  font-weight: 700;
}

/* Ordered list numbers — accent */
.lesson-content ol, .cc-body ol {
  list-style: none;
  counter-reset: ord;
  padding-left: 1.4rem;
}
.lesson-content ol li, .cc-body ol li {
  position: relative;
  padding-left: 0.5rem;
  counter-increment: ord;
}
.lesson-content ol li::before, .cc-body ol li::before {
  content: counter(ord) ".";
  position: absolute;
  left: -1.4rem;
  color: var(--accent);
  font-weight: 700;
  font-family: var(--font-mono);
}

/* Keyboard tags <kbd> — terminal style with accent border */
kbd {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.85em;
  font-weight: 600;
  color: var(--accent);
  background: var(--bg-2);
  border: 1px solid var(--accent);
  border-bottom-width: 2px;
  border-radius: 4px;
  box-shadow: 0 1px 0 var(--accent);
  text-shadow: none;
}

/* Drop cap on lesson intro — comic-book opening feel */
.lesson-intro > p:first-of-type::first-letter,
.cc-body > p:first-of-type::first-letter,
section.cc-card > p:first-of-type::first-letter {
  font-family: 'Caveat', cursive;
  font-size: 4.5rem;
  font-weight: 700;
  float: left;
  line-height: 0.85;
  margin: 0.1rem 0.7rem -0.5rem -0.2rem;
  color: var(--accent);
}

/* Callout boxes — .note, .tip, .warning, .info, .danger */
.note, .tip, .info, .warning, .danger, .callout {
  background: var(--bg-2) !important;
  border: 1px solid var(--border) !important;
  border-left: 4px solid var(--accent) !important;
  border-radius: 0 !important;
  padding: 1rem 1.25rem !important;
  margin: 1.5rem 0 !important;
  font-size: 0.95rem !important;
}
.note::before, .tip::before, .info::before, .warning::before, .danger::before, .callout::before {
  content: attr(data-label) !important;
  display: block;
  font-family: 'Geist', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.4rem;
}
.note { --label: 'NOTE'; }
.tip { --label: 'TIP'; }
.info { --label: 'INFO'; }
.warning { --label: 'WARNING'; }
.danger { --label: 'DANGER'; }

/* Pull quotes / blockquote — large Caveat accent */
blockquote, .pullquote {
  font-family: 'Caveat', cursive;
  font-size: 1.7rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--accent);
  border-left: 4px solid var(--accent);
  padding: 0.5rem 0 0.5rem 1.5rem;
  margin: 2rem 0;
  font-style: normal;
}
blockquote p, .pullquote p {
  color: var(--accent) !important;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
}

/* Section dividers — minimal accent line */
hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
  margin: 2.5rem 0;
  opacity: 0.5;
}

/* "Why X in 2026?" style top-callout cards — already cards, extra emphasis */
.why-card, .why-2026, .lesson-objective {
  border-left-width: 4px !important;
  border-left-color: var(--accent) !important;
  position: relative;
}
.why-card::before, .why-2026::before, .lesson-objective::before {
  content: 'WHY';
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.1em;
  opacity: 0.6;
}

/* Progress bar already uses accent */
.progress-bar { background: var(--accent) !important; }

/* Active sidebar lesson highlight — strengthen */
.sb-lesson.active, .sb-lesson[aria-current="true"] {
  background: var(--bg-2) !important;
  color: var(--accent) !important;
  border-left: 3px solid var(--accent) !important;
  font-weight: 600 !important;
}

/* === KaTeX stays neutral white === */
.katex { color: var(--text-0) !important; }

/* === Tables stay neutral === */
table th { color: #000 !important; background: var(--text-0) !important; }
table td { color: var(--text-1) !important; }
table td strong { color: var(--text-0) !important; }  /* don't accent inside tables */
"""

LM_PATH = TUTS / "lesson-master.css"
lm_text = LM_PATH.read_text(encoding='utf-8')

# Remove previous enhanced section if any
marker = "/* ============================================================\n   ★ ENHANCED ACCENT APPLICATION"
if marker in lm_text:
    lm_text = lm_text.split(marker)[0].rstrip() + "\n"

lm_text += ENHANCED_ACCENT
LM_PATH.write_text(lm_text, encoding='utf-8')
print(f"\n=== STEP 3: lesson-master.css updated ({len(lm_text):,} bytes) ===")

# ============================================================
# STEP 4: Re-snapshot all tracks
# ============================================================
print("\n=== STEP 4: Re-snapshotting style.css ===")
CORE2 = (ROOT / "core2.css").read_text(encoding='utf-8')
LM = lm_text

count = 0
for track in TRACK_COLORS:
    track_dir = TUTS / track
    if not track_dir.exists():
        continue
    tcss = track_dir / f"{track}.css"
    track_css_text = tcss.read_text(encoding='utf-8') if tcss.exists() else ''
    merged = "\n".join([
        "/* === core2.css === */", CORE2,
        "\n/* === lesson-master.css === */", LM,
        f"\n/* === {track}.css === */", track_css_text,
    ])
    (track_dir / "style.css").write_text(merged, encoding='utf-8')
    count += 1
print(f"  ✓ {count} tracks re-snapshotted")

# Also snapshot core.js to each track
print("\n=== STEP 5: Snapshot core.js to each track ===")
core_js_text = core_js.read_text(encoding='utf-8')
core_count = 0
for track in TRACK_COLORS:
    tracks_core = TUTS / track / "core.js"
    if tracks_core.exists():
        tracks_core.write_text(core_js_text, encoding='utf-8')
        core_count += 1
print(f"  ✓ {core_count} core.js snapshots updated")

# ============================================================
# STEP 6: Bump cache version
# ============================================================
print("\n=== STEP 6: Cache bump (style.css?v=3 → v=4, core.js?v=2 → v=3) ===")
import glob
bumped_style = bumped_core = 0
for track in TRACK_COLORS:
    for shell in (TUTS / track).glob("[0-9]*.html"):
        text = shell.read_text(encoding='utf-8')
        new = text
        if 'style.css?v=' in text:
            new = re.sub(r'style\.css\?v=\d+', 'style.css?v=4', new)
        if 'core.js?v=' in text:
            new = re.sub(r'core\.js\?v=\d+', 'core.js?v=3', new)
        if new != text:
            shell.write_text(new, encoding='utf-8')
            bumped_style += ('style.css' in new) and 1
print(f"  ✓ Cache versions bumped")

print("\n" + "="*60)
print("DONE — D3-black + curated palette + enhanced accent")
print("="*60)
