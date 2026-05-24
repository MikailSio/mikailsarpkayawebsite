"""Screenshot fourier/1.html stub to verify shell renders correctly."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
url = "http://localhost:3456/tutorials/fourier/1.html"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.route("**/pyodide*/**", lambda r: r.abort())
    page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
    page.goto(url, wait_until="load", timeout=30000)
    page.evaluate("(async () => { await document.fonts.ready; })()")
    page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
    page.wait_for_timeout(2000)
    page.screenshot(path=str(OUT / "fourier-stub.png"), full_page=False)
    title = page.title()
    h1 = page.evaluate("(() => { const h = document.querySelector('h1.topic-title'); return h ? h.innerText : 'NO-H1'; })()")
    sidebar_fourier_count = page.evaluate("document.querySelectorAll('a[href^=\"/tutorials/fourier/\"]').length")
    print(f"  title: {title}")
    print(f"  hero h1: {h1}")
    print(f"  sidebar fourier links: {sidebar_fourier_count}")
    browser.close()
