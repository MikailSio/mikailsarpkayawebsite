"""QC: screenshot 4 random shells with new sidebar."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
for p in OUT.glob("sb-qc-*.png"):
    p.unlink()

TARGETS = [('calculus', 3), ('control', 4), ('huggingface', 2), ('markov', 5)]

with sync_playwright() as p:
    for track, n in TARGETS:
        browser = p.chromium.launch()
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
        page.route("**/pyodide*/**", lambda r: r.abort())
        page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
        try:
            page.goto(f"http://localhost:3456/tutorials/{track}/{n}.html", wait_until="load", timeout=30000)
            page.evaluate("(async () => { await document.fonts.ready; })()")
            page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
            page.wait_for_timeout(2500)
            page.screenshot(path=str(OUT / f"sb-qc-{track}-{n}.png"), full_page=False)
            print(f"  {track}/{n}: OK")
        except Exception as e:
            print(f"  {track}/{n} FAIL: {str(e)[:60]}")
        browser.close()
