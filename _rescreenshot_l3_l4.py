"""Re-screenshot L3, L4 with extended wait."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")

with sync_playwright() as p:
    browser = p.chromium.launch()
    for n in [3, 4]:
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
        page.route("**/pyodide*/**", lambda r: r.abort())
        page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
        try:
            page.goto(f"http://localhost:3456/tutorials/fourier/{n}.html", wait_until="networkidle", timeout=60000)
            page.evaluate("(async () => { await document.fonts.ready; })()")
            page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
            page.wait_for_timeout(5000)
            page.screenshot(path=str(OUT / f"fourier-L{n}-retry.png"), full_page=False)
            h1 = page.evaluate("document.querySelector('h1.topic-title')?.innerText")
            sects = page.evaluate("document.querySelectorAll('h2.lesson-title').length")
            plots = page.evaluate("document.querySelectorAll('.js-plotly-plot').length")
            print(f"  L{n}: h1={h1!r}, sections={sects}, plots={plots}")
        except Exception as e:
            print(f"  L{n} FAIL: {str(e)[:80]}")
        page.context.close()
    browser.close()
