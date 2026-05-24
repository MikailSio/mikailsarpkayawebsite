"""Final QC: screenshot 5 live production lessons in TR mode."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
for p in OUT.glob("live-*.png"):
    p.unlink()

TARGETS = [
    ('pandas', 6, 'pandas L6 TR diakritik'),
    ('huggingface', 1, 'HF L1'),
    ('netsec', 4, 'netsec L4 fixed template'),
    ('crypto', 9, 'crypto L9'),
    ('mlsec', 5, 'mlsec L5'),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for track, lesson, label in TARGETS:
        url = f"https://mikailsarpkaya.com/tutorials/{track}/{lesson}"
        out = OUT / f"live-{track}-L{lesson}.png"
        page = browser.new_context(viewport={"width": 1440, "height": 900}, ignore_https_errors=True).new_page()
        try:
            page.route("**/pyodide*/**", lambda r: r.abort())
            page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
            page.add_init_script("try{localStorage.setItem('tut-lang','tr')}catch(e){}")
            page.goto(url, wait_until="load", timeout=60000)
            page.evaluate("(async () => { await document.fonts.ready; })()")
            page.evaluate("if(window.setLang) setLang('tr')")
            page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
            page.wait_for_timeout(2500)
            page.screenshot(path=str(out), full_page=False)
            print(f"  OK {label}")
        except Exception as e:
            print(f"  FAIL {label}: {str(e)[:80]}")
        page.context.close()
    browser.close()
