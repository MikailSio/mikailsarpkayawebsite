"""Screenshot the new sidebar layout for visual QC."""
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
    page.goto("http://localhost:3456/tutorials/fourier/1.html", wait_until="load", timeout=30000)
    page.evaluate("(async () => { await document.fonts.ready; })()")
    page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
    page.wait_for_timeout(2500)
    page.screenshot(path=str(OUT / "new-sidebar-test.png"), full_page=False)
    info = page.evaluate("""() => ({
        h1: document.querySelector('h1.topic-title')?.innerText,
        sections: document.querySelectorAll('.sb-section-label').length,
        subgroups: document.querySelectorAll('.sb-subgroup-label').length,
        tracks: document.querySelectorAll('.sb-track-label').length,
        lessons: document.querySelectorAll('a.sb-lesson').length,
    })""")
    print(f"h1: {info['h1']}")
    print(f"Sidebar — sections: {info['sections']}, subgroups: {info['subgroups']}, tracks: {info['tracks']}, lessons: {info['lessons']}")
    browser.close()
