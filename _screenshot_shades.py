"""Screenshot 3 dark shade variants via Playwright."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")

variants = ['D3-black', 'D3-deep', 'D3-gray']

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    for v in variants:
        url = f"http://localhost:3456/tutorials/c/1-{v}.html"
        out = OUT / f"shade-{v}.png"
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.evaluate("(async () => { await document.fonts.ready; })()")
        page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
        page.wait_for_timeout(2000)  # extra time for KaTeX, accent picker init
        page.screenshot(path=str(out), full_page=False, omit_background=False)
        bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
        print(f"  {v}: bg={bg}")
        page.close()
    browser.close()
print("Done.")
