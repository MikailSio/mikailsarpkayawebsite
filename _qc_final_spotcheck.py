"""Quick QC: screenshot 8 representative lessons across all 6 tracks."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
for p in OUT.glob("final-qc-*.png"):
    p.unlink()

TARGETS = [
    ('fourier', 1),  # already-verified track
    ('fourier', 3),  # had the bug
    ('diffeq', 6),   # SDE — was big
    ('markov', 5),   # I wrote inline
    ('markov', 2),   # agent-written
    ('discrete', 5), # generator-written
    ('complex', 3),  # agent-written
    ('calculus', 7), # ek dersler
    ('linalg', 8),   # ek dersler
    ('math', 11),    # ek dersler
]

with sync_playwright() as p:
    for track, n in TARGETS:
        browser = p.chromium.launch()
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.route("**/pyodide*/**", lambda r: r.abort())
        page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
        try:
            page.goto(f"http://localhost:3456/tutorials/{track}/{n}.html", wait_until="load", timeout=45000)
            page.evaluate("(async () => { await document.fonts.ready; })()")
            page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
            page.wait_for_timeout(4500)
            page.screenshot(path=str(OUT / f"final-qc-{track}-L{n}.png"), full_page=False)
            stats = page.evaluate("""() => ({
              h1: document.querySelector('h1.topic-title')?.innerText,
              content_len: document.getElementById('lessonContent')?.innerHTML.length || 0,
              plots: document.querySelectorAll('.js-plotly-plot').length,
            })""")
            err_str = f", errs={len(errors)}" if errors else ""
            print(f"  {track}/L{n}: h1={stats['h1'][:50] if stats['h1'] else 'NONE'!r}, content={stats['content_len']}b, plots={stats['plots']}{err_str}")
        except Exception as e:
            print(f"  {track}/L{n} FAIL: {str(e)[:80]}")
        browser.close()
