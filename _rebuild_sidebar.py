"""Rebuild the sidebar HTML across all shells with a new categorized structure.
Replaces the entire <aside class="sidebar...">...</aside> block.
"""
import re
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

# ============================================================
# CATEGORY → SUBGROUP → TRACK structure
# Each track: (slug, en_label, tr_label, lessons_count, [optional list of lesson titles])
# ============================================================

# Lesson titles for tracks — keyed by slug → list of (en, tr) tuples
TRACK_LESSONS = {
    # We'll compute lesson titles on-the-fly from each track's existing sidebar if simpler;
    # but for explicit control we define some here. Empty list = auto-generate "Lesson N"
}

# Categories with sub-groups and tracks
SIDEBAR_STRUCTURE = [
    {
        'icon': '🤖', 'en': 'Artificial Intelligence', 'tr': 'Yapay Zeka',
        'subgroups': [
            ('ML Foundations', 'ML Temelleri', ['ml-theory', 'math']),
            ('Deep Learning', 'Derin Öğrenme', ['deep', 'pytorch']),
            ('Data Science', 'Veri Bilimi', ['numpy', 'pandas', 'matplotlib', 'sql', 'sklearn']),
            ('NLP & LLMs', 'NLP & LLM\'ler', ['nlp', 'huggingface', 'langchain', 'agents', 'multimodal']),
            ('Computer Vision', 'Bilgisayarlı Görü', ['cv']),
            ('Audio Processing', 'Ses İşleme', ['audio']),
            ('Reinforcement Learning', 'Pekiştirmeli Öğrenme', ['rl']),
            ('Specialized AI', 'Özelleşmiş AI', ['recsys', 'gnn', 'causal', 'vectordb', 'timeseries']),
        ],
    },
    {
        'icon': '📐', 'en': 'Mathematics', 'tr': 'Matematik',
        'subgroups': [
            ('Mathematics', 'Matematik', ['matematik']),
            ('University Math', 'Üniversite Matematiği', ['linalg', 'calculus']),
            ('Engineering Math', 'Mühendislik Matematiği', ['fourier', 'diffeq', 'control', 'complex']),
            ('Probability & Discrete', 'Olasılık & Ayrık', ['markov', 'discrete']),
            ('ALES Numerical', 'ALES Sayısal', ['ales']),
        ],
    },
    {
        'icon': '💻', 'en': 'Programming', 'tr': 'Programlama',
        'subgroups': [
            ('Programming Languages', 'Programlama Dilleri', ['c', 'cpp', 'python', 'js']),
        ],
    },
    {
        'icon': '🔒', 'en': 'Cybersecurity', 'tr': 'Siber Güvenlik',
        'subgroups': [
            ('Network Security', 'Ağ Güvenliği', ['netsec']),
            ('Cryptography', 'Kriptografi', ['crypto']),
            ('ML Security', 'ML Güvenliği', ['mlsec']),
            ('Forensics', 'Adli Bilişim', ['forensics']),
            ('Blockchain', 'Blockchain', ['blockchain']),
        ],
    },
    {
        'icon': '⚖️', 'en': 'AI Ethics & Law', 'tr': 'AI Etik & Hukuk',
        'subgroups': [
            ('Trust & Safety', 'Güven & Güvenlik', ['safety', 'fairness', 'privacy', 'compliance']),
        ],
    },
    {
        'icon': '🏭', 'en': 'Production & Ops', 'tr': 'Üretim & Operasyon',
        'subgroups': [
            ('MLOps & Infrastructure', 'MLOps & Altyapı', ['mlops', 'gpu', 'edge']),
        ],
    },
    {
        'icon': '🛠️', 'en': 'Tools', 'tr': 'Araçlar',
        'subgroups': [
            ('Documentation', 'Doküman', ['latex']),
        ],
    },
    {
        'icon': '🌐', 'en': 'Application Areas', 'tr': 'Uygulama Alanları',
        'subgroups': [
            ('Domain Specific', 'Alana Özel', ['bio', 'iot']),
        ],
    },
]

# ============================================================
# Track metadata (label + lesson count)
# ============================================================

TRACK_LABELS = {
    'agents': ('Agents (LangChain/AutoGen)', 'Agents (LangChain/AutoGen)'),
    'ales': ('ALES Math', 'ALES Sayısal'),
    'audio': ('Audio ML', 'Ses İşleme & ML'),
    'bio': ('Bioinformatics ML', 'Biyoinformatik ML'),
    'blockchain': ('Blockchain Security', 'Blockchain Güvenliği'),
    'c': ('C Language', 'C Dili'),
    'calculus': ('Calculus', 'Kalkülüs'),
    'causal': ('Causal Inference', 'Nedensel Çıkarım'),
    'complex': ('Complex Analysis', 'Karmaşık Analiz'),
    'compliance': ('Compliance & Audit', 'Uyumluluk & Denetim'),
    'control': ('Control Theory', 'Kontrol Teorisi'),
    'cpp': ('C++', 'C++'),
    'crypto': ('Cryptography', 'Kriptografi'),
    'cv': ('Computer Vision', 'Bilgisayarlı Görü'),
    'deep': ('Deep Learning', 'Derin Öğrenme'),
    'diffeq': ('Differential Equations', 'Diferansiyel Denklemler'),
    'discrete': ('Discrete Math & Graphs', 'Ayrık Mat. & Çizgeler'),
    'edge': ('Edge & Mobile ML', 'Edge & Mobil ML'),
    'fairness': ('Fairness', 'Adalet'),
    'forensics': ('Digital Forensics', 'Adli Bilişim'),
    'fourier': ('Fourier & Signal', 'Fourier & Sinyal'),
    'gnn': ('Graph Neural Networks', 'Çizge Sinir Ağları'),
    'gpu': ('GPU Programming', 'GPU Programlama'),
    'huggingface': ('HuggingFace', 'HuggingFace'),
    'iot': ('IoT ML', 'IoT ML'),
    'js': ('JavaScript', 'JavaScript'),
    'langchain': ('LangChain', 'LangChain'),
    'latex': ('LaTeX', 'LaTeX'),
    'linalg': ('Linear Algebra', 'Doğrusal Cebir'),
    'matematik': ('Mathematics', 'Matematik'),
    'markov': ('Markov & MCMC', 'Markov & MCMC'),
    'math': ('ML Mathematics', 'ML Matematik'),
    'matplotlib': ('Matplotlib', 'Matplotlib'),
    'ml-theory': ('ML Theory', 'ML Teorisi'),
    'mlops': ('MLOps', 'MLOps'),
    'mlsec': ('ML Security', 'ML Güvenliği'),
    'multimodal': ('Multimodal LLMs', 'Çok Modlu LLM\'ler'),
    'netsec': ('Network Security', 'Ağ Güvenliği'),
    'nlp': ('Natural Language Processing', 'NLP'),
    'numpy': ('NumPy', 'NumPy'),
    'pandas': ('Pandas', 'Pandas'),
    'privacy': ('Privacy', 'Gizlilik'),
    'python': ('Python Core', 'Python Çekirdek'),
    'pytorch': ('PyTorch', 'PyTorch'),
    'recsys': ('Recommender Systems', 'Öneri Sistemleri'),
    'rl': ('Reinforcement Learning', 'Pekiştirmeli Öğrenme'),
    'safety': ('AI Safety', 'AI Güvenliği'),
    'sklearn': ('scikit-learn', 'scikit-learn'),
    'sql': ('SQL', 'SQL'),
    'timeseries': ('Time Series ML', 'Zaman Serisi ML'),
    'vectordb': ('Vector Databases', 'Vektör Veritabanları'),
}


def get_track_lesson_count(slug):
    """Count lessons by listing L*.js files in the track directory."""
    track_dir = ROOT / slug
    if not track_dir.exists():
        return 0
    return len(list(track_dir.glob("L*.js")))


# Custom display order for tracks where logical order differs from URL number.
# For lise-mat: foundations → special functions → geometry → advanced algebra
# → calculus → probability/statistics. URLs stay as L1..L107 (no file renames).
CUSTOM_LESSON_ORDER = {
    'matematik': [
        # Tier 1 — Cebir Temelleri
        40, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 50, 51,
        52, 53, 54, 55, 56, 57, 58, 59,
        60, 61, 62,
        # Tier 2 — Özel Fonksiyonlar
        35, 36, 37, 38, 39,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        # Tier 3 — Geometri
        82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93,
        76, 77, 78, 79, 80, 81,
        # Tier 4 — İleri Cebir
        63, 64, 65, 66, 67,
        68, 69, 70, 71,
        72, 73, 74, 75,
        # Tier 5 — Analiz
        11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 30, 31, 32, 33, 34,
        # Tier 6 — Olasılık & İstatistik
        94, 95, 96, 97, 98, 99, 100, 101,
        102, 103, 104, 105, 106, 107,
    ],
}


def get_track_lesson_titles(slug):
    """Extract lesson titles from track's first shell by reading sidebar entries.
    Returns list of (lesson_num, en_title, tr_title) in display order
    (uses CUSTOM_LESSON_ORDER[slug] if defined, otherwise sorted by lesson number)."""
    # try to read from first shell's sidebar
    first_shell = ROOT / slug / "1.html"
    if not first_shell.exists():
        return []
    try:
        txt = first_shell.read_text(encoding='utf-8')
    except Exception:
        return []
    # find all sb-lesson entries for THIS track
    pattern = rf'<a href="/tutorials/{re.escape(slug)}/(\d+)"[^>]*class="sb-lesson[^"]*"><span class="num">\d+</span><span class="lbl"\s+data-en="([^"]+)"\s+data-tr="([^"]+)"'
    matches = re.findall(pattern, txt)
    if not matches:
        return []
    by_num = {int(n): (en, tr) for n, en, tr in matches}
    if slug in CUSTOM_LESSON_ORDER:
        # Sort by custom order; skip lessons not in the data (defensive)
        order = CUSTOM_LESSON_ORDER[slug]
        return [(n, by_num[n][0], by_num[n][1]) for n in order if n in by_num]
    # Default: sort by lesson number
    return sorted([(n, en, tr) for n, (en, tr) in by_num.items()], key=lambda x: x[0])


def build_track_html(slug, current_track=None, current_lesson=None):
    """Build the HTML for a single track block (label + lesson list)."""
    en_label, tr_label = TRACK_LABELS.get(slug, (slug, slug))
    lessons = get_track_lesson_titles(slug)
    if not lessons:
        # Fall back to numeric lessons
        count = get_track_lesson_count(slug)
        lessons = [(i, f'Lesson {i}', f'Ders {i}') for i in range(1, count + 1)]
    is_current_track = (current_track == slug)
    track_class = 'sb-track open current' if is_current_track else 'sb-track'

    items_html = []
    for pos, (n, lt_en, lt_tr) in enumerate(lessons, start=1):
        is_active = is_current_track and current_lesson == n
        active_cls = ' active' if is_active else ''
        items_html.append(
            f'              <a href="/tutorials/{slug}/{n}" class="sb-lesson{active_cls}">'
            f'<span class="num">{pos:02d}</span>'
            f'<span class="lbl" data-en="{lt_en}" data-tr="{lt_tr}">{lt_en}</span></a>'
        )
    items = '\n'.join(items_html)
    return (
        f'          <div class="{track_class}">\n'
        f'            <div class="sb-track-label" data-en="{en_label}" data-tr="{tr_label}">{en_label}</div>\n'
        f'            <div class="sb-track-items">\n'
        f'{items}\n'
        f'            </div>\n'
        f'          </div>'
    )


def build_subgroup_html(en, tr, tracks, current_track=None, current_lesson=None):
    """A subgroup is a labeled cluster of tracks."""
    tracks_html = '\n'.join(build_track_html(t, current_track, current_lesson) for t in tracks)
    return (
        f'        <div class="sb-subgroup">\n'
        f'          <div class="sb-subgroup-label" data-en="{en}" data-tr="{tr}">{en}</div>\n'
        f'{tracks_html}\n'
        f'        </div>'
    )


def build_section_html(icon, en, tr, subgroups, current_track=None, current_lesson=None, is_open=False):
    """Build a top-level section (collapsible)."""
    # Determine if any subgroup contains the current_track → open by default
    has_current = current_track and any(current_track in tracks for _, _, tracks in subgroups)
    open_cls = ' open' if (is_open or has_current) else ''
    aria_expanded = 'true' if (is_open or has_current) else 'false'

    subgroups_html = '\n'.join(build_subgroup_html(sg_en, sg_tr, tracks, current_track, current_lesson) for sg_en, sg_tr, tracks in subgroups)
    return (
        f'    <div class="sb-section{open_cls}">\n'
        f'      <div class="sb-section-label" role="button" tabindex="0" aria-expanded="{aria_expanded}">'
        f'<span class="sb-icon" aria-hidden="true">{icon}</span>'
        f'<span class="sb-label-text" data-en="{en}" data-tr="{tr}">{en}</span></div>\n'
        f'      <div class="sb-section-items">\n'
        f'{subgroups_html}\n'
        f'      </div>\n'
        f'    </div>'
    )


def build_sidebar_inner(current_track=None, current_lesson=None):
    """Build the inner sidebar content (between the existing wrapper elements)."""
    sections_html = '\n'.join(
        build_section_html(s['icon'], s['en'], s['tr'], s['subgroups'], current_track, current_lesson)
        for s in SIDEBAR_STRUCTURE
    )
    return sections_html


def update_shell_sidebar(shell_path: Path):
    """Replace the existing sidebar's body (all sb-section blocks) with the new structure."""
    try:
        txt = shell_path.read_text(encoding='utf-8')
    except Exception as e:
        return False, f"read error: {e}"

    # Identify current_track / current_lesson from path
    parts = shell_path.parts
    # parts: ..., 'tutorials', '<track>', '<num>.html'
    try:
        i = parts.index('tutorials')
        current_track = parts[i + 1]
        current_lesson = int(shell_path.stem)
    except (ValueError, IndexError):
        return False, "couldn't parse path"

    # Find sidebar bounds: aside class="sidebar..." ... </aside>
    # We'll preserve everything OUTSIDE the inner section blocks.
    # Specifically, look for the FIRST <div class="sb-section..."> and LAST </aside>
    # and replace between them.

    # The sidebar wrapper structure:
    # <aside class="sidebar ..." ...>
    #   <style>...</style>            ← keep
    #   <div class="sb-header">...</div>   ← keep
    #   <div class="sb-current-track">...</div>  ← preserve, has track-specific data
    #   <div class="sb-current-lesson">...</div>  ← preserve, has lesson-specific
    #   <div class="sb-sep"></div>    ← keep
    #   <div class="sb-tree">         ← inner content here
    #     <div class="sb-section">...</div>  ← REPLACE this block
    #     ...
    #     <div class="sb-section">...</div>
    #   </div>
    # </aside>

    # Find the first <div class="sb-section ...">
    first_sec = re.search(r'    <div class="sb-section(?:\s+open)?"\s*>\s*\n\s*<div class="sb-section-label"', txt)
    if not first_sec:
        return False, "no sb-section found"
    # Find the last </aside>
    last_aside = txt.rfind('</aside>')
    if last_aside < 0:
        return False, "no </aside> found"
    # Within the region between first_sec.start() and last_aside, identify the closing of the LAST sb-section (after which only wrappers remain)
    # The structure ends with `    </div>\n  </aside>` or similar — find the last `</div>` before </aside>
    # Approach: find the position just before the closing wrapper(s). We need to find where the LAST sb-section's outer </div> closes.
    # Find all positions of `    </div>` followed by either `  </aside>` or another wrapper.

    # Simpler heuristic: between first sb-section and </aside>, find the FINAL `    </div>` that is preceded by an sb-section ending.
    # Actually we know that after the last sb-section, there's a "  </aside>" preceded by some closing divs.
    # Let me look for `    </div>\n  </aside>` pattern.
    end_match = re.search(r'    </div>\s*\n\s*</aside>', txt[first_sec.start():])
    if not end_match:
        # Maybe just </aside> directly
        end_match = re.search(r'\s*</aside>', txt[first_sec.start():])
        if not end_match:
            return False, "couldn't find sidebar end"
        replace_end = first_sec.start() + end_match.start()
    else:
        replace_end = first_sec.start() + end_match.start() + len('    </div>')

    new_sidebar = build_sidebar_inner(current_track, current_lesson)
    new_txt = txt[:first_sec.start()] + new_sidebar + '\n' + txt[replace_end:]
    shell_path.write_text(new_txt, encoding='utf-8')
    return True, "ok"


def main():
    all_shells = []
    for sub in ROOT.iterdir():
        if not sub.is_dir():
            continue
        for f in sub.glob("*.html"):
            if f.stem == 'index' or not f.stem.isdigit():
                continue
            all_shells.append(f)

    stats = {'updated': 0, 'failed': 0}
    failed_files = []
    for f in all_shells:
        ok, msg = update_shell_sidebar(f)
        if ok:
            stats['updated'] += 1
        else:
            stats['failed'] += 1
            failed_files.append((f.relative_to(ROOT), msg))

    print(f"Processed {len(all_shells)} shells")
    print(f"  updated: {stats['updated']}")
    print(f"  failed:  {stats['failed']}")
    if failed_files:
        print("\nFailed files (first 10):")
        for fp, msg in failed_files[:10]:
            print(f"  {fp}: {msg}")


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--test':
        # Test on one shell
        test_shell = ROOT / 'fourier' / '1.html'
        ok, msg = update_shell_sidebar(test_shell)
        print(f"Test {test_shell.name}: ok={ok}, msg={msg}")
    else:
        main()
