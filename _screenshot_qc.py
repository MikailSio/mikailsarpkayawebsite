"""Visual QC: screenshot 8 random/critical lessons that were recently fixed."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
OUT.mkdir(exist_ok=True)
for p in OUT.glob("qc-*.png"):
    p.unlink()

# Selection: recently-fixed lessons across critical tracks
TARGETS = [
    ('huggingface', 1, 'HF L1 (agent-fixed)'),
    ('huggingface', 6, 'HF L6 (agent-fixed)'),
    ('mlsec', 5, 'mlsec L5 (agent-fixed)'),
    ('mlsec', 9, 'mlsec L9 (agent-fixed)'),
    ('crypto', 9, 'crypto L9 tür→tur fix'),
    ('pandas', 1, 'pandas L1 (diakritik)'),
    ('pandas', 6, 'pandas L6 (diakritik)'),
    ('pandas', 8, 'pandas L8 (cafe syntax fix)'),
    ('sklearn', 5, 'sklearn L5 (outcomes)'),
    ('netsec', 4, 'netsec L4 (${jndi escape)'),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for track, lesson, label in TARGETS:
        url = f"http://localhost:3456/tutorials/{track}/{lesson}.html"
        out = OUT / f"qc-{track}-L{lesson}.png"
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
        try:
            page.route("**/pyodide*/**", lambda r: r.abort())
            page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
            page.goto(url, wait_until="load", timeout=45000)
            page.evaluate("(async () => { await document.fonts.ready; })()")
            page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
            page.evaluate("document.querySelectorAll('.pyodide-notice, .pyodide-loading-toast, [class*=pyodide]').forEach(e => e.remove());")
            page.wait_for_timeout(2000)
            page.screenshot(path=str(out), full_page=False)
            # Also capture page title + first H1 for content sanity
            title = page.title()
            h1 = page.evaluate("(() => { const h = document.querySelector('h1, .lesson-title, .l-title'); return h ? h.innerText.slice(0,80) : 'NO-H1'; })()")
            print(f"  OK {track}/L{lesson}: title={title[:50]!r} h1={h1!r}")
        except Exception as e:
            print(f"  FAIL {track}/L{lesson}: {str(e)[:80]}")
        page.context.close()
    browser.close()
