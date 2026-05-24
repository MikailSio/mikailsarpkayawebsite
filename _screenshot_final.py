"""Final screenshots: 4 tracks showcasing enhanced accent across palette."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
# Clear old
for p in OUT.glob("final-*.png"):
    p.unlink()

TRACKS = [
    ('c', 1, 'Programming Languages — Green'),
    ('pandas', 1, 'Data — Cyan'),
    ('pytorch', 1, 'Deep Learning — Pink'),
    ('nlp', 1, 'NLP — Purple'),
    ('mlops', 1, 'MLOps — Orange'),
    ('mlsec', 1, 'Security — Yellow'),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for track, lesson, label in TRACKS:
        url = f"http://localhost:3456/tutorials/{track}/{lesson}.html"
        out = OUT / f"final-{track}.png"
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
        try:
            # Block Pyodide and KaTeX to speed up
            page.route("**/pyodide*/**", lambda r: r.abort())
            page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
            page.goto(url, wait_until="load", timeout=45000)
            page.evaluate("(async () => { await document.fonts.ready; })()")
            page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
            page.evaluate("document.querySelectorAll('.pyodide-notice, .pyodide-loading-toast, [class*=pyodide]').forEach(e => e.remove());")
            page.wait_for_timeout(3500)
            page.screenshot(path=str(out), full_page=False)
            print(f"  ✓ {track} ({label})")
        except Exception as e:
            print(f"  ✗ {track}: {str(e)[:60]}")
        page.context.close()
    browser.close()
