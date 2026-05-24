"""Re-screenshot L2 with extended wait."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.route("**/pyodide*/**", lambda r: r.abort())
    page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
    page.goto("http://localhost:3456/tutorials/fourier/2.html", wait_until="networkidle", timeout=60000)
    page.evaluate("(async () => { await document.fonts.ready; })()")
    page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
    page.wait_for_timeout(5000)  # longer wait
    page.screenshot(path=str(OUT / "fourier-L2-retry.png"), full_page=False)
    h1 = page.evaluate("document.querySelector('h1.topic-title')?.innerText")
    bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
    print(f"  h1: {h1!r}  body bg: {bg}")
    browser.close()
