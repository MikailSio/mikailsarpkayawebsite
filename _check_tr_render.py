"""Switch to TR and screenshot pandas/L6 to verify diakritik restoration."""
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
    page.route("**/cdn.plot.ly/**", lambda r: r.abort())
    # Set TR lang before navigating
    page.add_init_script("try{localStorage.setItem('tut-lang','tr')}catch(e){}")
    page.goto("http://localhost:3456/tutorials/pandas/6.html", wait_until="domcontentloaded", timeout=60000)
    page.evaluate("(async () => { await document.fonts.ready; })()")
    page.evaluate("if(window.setLang) setLang('tr')")
    page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
    page.wait_for_timeout(2000)
    out = OUT / "qc-pandas-L6-TR.png"
    page.screenshot(path=str(out), full_page=False)
    # extract first 500 chars of body text to inspect TR
    body_txt = page.evaluate("document.querySelector('.lesson-content, .l-content, body').innerText.slice(0, 800)")
    print("BODY TEXT:")
    print(body_txt)
    browser.close()
