"""Playwright-based screenshots with proper font loading."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
OUT.mkdir(exist_ok=True)

designs = ['D', 'D1', 'D2', 'D3']

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1440, "height": 900})

    for d in designs:
        url = f"http://localhost:3456/tutorials/c/1-{d}.html"
        out = OUT / f"design-{d}-pw.png"
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        # wait for fonts
        page.evaluate("document.fonts.ready")
        # hide loader
        page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
        # wait briefly for any final layout shifts
        page.wait_for_timeout(800)
        page.screenshot(path=str(out), full_page=False)  # viewport only
        # verify font
        font_body = page.evaluate("getComputedStyle(document.body).fontFamily")
        font_h1 = page.evaluate("const h=document.querySelector('h1,.l-title,.lesson-title'); h ? getComputedStyle(h).fontFamily : null")
        print(f"  {d}: body={font_body[:60]}  h1={font_h1[:60] if font_h1 else 'NA'}")
        page.close()

    browser.close()

print("\nDone.")
