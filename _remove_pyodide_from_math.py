"""Phase 2a: Remove Pyodide Lab section from non-AI math lessons.
Replaces with classical worked examples placeholder.

Target lessons: complex L1-L6, fourier L1-L7, diffeq L1-L7,
                markov L1-L4, discrete L1-L4, control L1-L6.

Skip (AI-bound, keep Python): fourier/L8, diffeq/L8, markov L5-L6,
       discrete L5-L6, control L7, linalg L7-L8, math L1-L11.
Skip (legacy format, needs separate rewrite): calculus L1-L6, linalg L1-L6.
"""
import re
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

# AI-free math lessons (Phase 2a target)
TARGETS = []
TARGETS += [('complex', n) for n in range(1, 7)]
TARGETS += [('fourier', n) for n in range(1, 8)]
TARGETS += [('diffeq', n) for n in range(1, 8)]
TARGETS += [('markov', n) for n in range(1, 5)]
TARGETS += [('discrete', n) for n in range(1, 5)]
TARGETS += [('control', n) for n in range(1, 7)]

# Replacement content for the removed section
REPL_TEMPLATE_EN = """<h2 class="lesson-title">{n}. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>"""

REPL_TEMPLATE_TR = """<h2 class="lesson-title">{n}. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>"""


def remove_pyodide_from_section(text, lang_label):
    """Find and remove Pyodide section + its code-wrap blocks.
    lang_label: 'en' or 'tr' for replacement template selection.

    Returns: (new_text, sections_removed_count, pythons_removed_count)
    """
    new_text = text
    sec_count = 0
    py_count = 0

    # Patterns for the Pyodide/Python lab section heading — match anywhere in heading
    en_patterns = [
        r'[^<]*Pyodide[^<]*',
        r'Practical\s+(?:Python\s+)?Exercise[^<]*',
        r'Hands-on\s+(?:Lab|Exercise)[^<]*',
        r'Python\s+Lab[^<]*',
    ]
    tr_patterns = [
        r'[^<]*Pyodide[^<]*',
        r'Pratik\s+(?:Python\s+)?(?:Egzersiz|Al[ıi][şs]t[ıi]rma|Lab)[^<]*',
        r'[^<]*Laboratuvar[ıi][^<]*',
    ]

    all_pats = en_patterns + tr_patterns

    # Find all heading occurrences for Pyodide-themed sections
    for pat in all_pats:
        heading_re = re.compile(r'<h2 class="lesson-title">(\d+)\.\s*' + pat + r'</h2>', re.IGNORECASE)
        for m in heading_re.finditer(new_text):
            heading_start = m.start()
            heading_end = m.end()
            section_num = m.group(1)
            # Look for next <div class="code-wrap"> after heading
            cw_start_match = re.search(r'<div class="code-wrap">', new_text[heading_end:])
            if not cw_start_match:
                continue
            cw_start = heading_end + cw_start_match.start()
            # Find matching closing </div> for this code-wrap
            # code-wrap usually has nested divs: code-label, pre/code, etc. Use a counter approach.
            i = cw_start + len('<div class="code-wrap">')
            depth = 1
            while i < len(new_text) and depth > 0:
                open_m = re.search(r'<div\b', new_text[i:])
                close_m = re.search(r'</div>', new_text[i:])
                if not close_m:
                    break
                if open_m and open_m.start() < close_m.start():
                    depth += 1
                    i += open_m.end()
                else:
                    depth -= 1
                    i += close_m.end()
            cw_end = i
            # Determine language by content
            # If heading matches a TR pattern, use TR template
            is_tr = any(re.search(p, m.group(0), re.IGNORECASE) for p in tr_patterns)
            tmpl = (REPL_TEMPLATE_TR if is_tr else REPL_TEMPLATE_EN).format(n=section_num)
            # Replace heading + code-wrap with template
            new_text = new_text[:heading_start] + tmpl + new_text[cw_end:]
            sec_count += 1
            py_count += 1
            break  # process one at a time, then iterate
        if sec_count > 0:
            # restart loop after a replacement to handle multiple
            pass

    # Need to iterate multiple times since each replacement changes the text
    # Re-run until no more changes
    prev_text = None
    iterations = 0
    while new_text != prev_text and iterations < 10:
        prev_text = new_text
        for pat in all_pats:
            heading_re = re.compile(r'<h2 class="lesson-title">(\d+)\.\s*' + pat + r'</h2>', re.IGNORECASE)
            m = heading_re.search(new_text)
            if not m:
                continue
            heading_start = m.start()
            heading_end = m.end()
            section_num = m.group(1)
            cw_start_match = re.search(r'<div class="code-wrap">', new_text[heading_end:])
            if not cw_start_match:
                # No code-wrap found — just remove the heading?
                continue
            cw_start = heading_end + cw_start_match.start()
            # Find matching </div> using depth counter
            i = cw_start + len('<div class="code-wrap">')
            depth = 1
            while i < len(new_text) and depth > 0:
                open_m = re.search(r'<div\b', new_text[i:])
                close_m = re.search(r'</div>', new_text[i:])
                if not close_m:
                    break
                if open_m and open_m.start() < close_m.start():
                    depth += 1
                    i = i + open_m.end()
                else:
                    depth -= 1
                    i = i + close_m.end()
            cw_end = i
            # Decide language
            is_tr = any(re.search(p, m.group(0), re.IGNORECASE) for p in tr_patterns)
            tmpl = (REPL_TEMPLATE_TR if is_tr else REPL_TEMPLATE_EN).format(n=section_num)
            new_text = new_text[:heading_start] + tmpl + new_text[cw_end:]
            sec_count += 1
            py_count += 1
            break  # restart outer loop
        iterations += 1

    return new_text, sec_count - (sec_count // 2 if sec_count > 0 else 0)  # avoid double counting from initial scan


def clean_lesson(track, lesson_num):
    """Process one lesson file."""
    fp = ROOT / track / f'L{lesson_num}.js'
    if not fp.exists():
        return None, "file not found"
    txt = fp.read_text(encoding='utf-8')
    new_txt, count = remove_pyodide_from_section(txt, 'auto')
    if new_txt != txt:
        fp.write_text(new_txt, encoding='utf-8')
        return count, "ok"
    return 0, "no change"


def main():
    total = 0
    no_change = 0
    failed = 0
    for track, n in TARGETS:
        count, msg = clean_lesson(track, n)
        if count is None:
            failed += 1
            print(f"  {track}/L{n}: FAIL ({msg})")
        elif count == 0:
            no_change += 1
            print(f"  {track}/L{n}: (no Pyodide section found)")
        else:
            total += count
            print(f"  {track}/L{n}: removed {count} section(s)")

    print(f"\nTotal Pyodide sections removed: {total}")
    print(f"  No change: {no_change}")
    print(f"  Failed: {failed}")


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--test':
        # Test on a single lesson first
        print("Testing on fourier/L1...")
        count, msg = clean_lesson('fourier', 1)
        print(f"  fourier/L1: count={count}, msg={msg}")
    else:
        main()
