"""Quick visual verify for markov/L6."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.route("**/pyodide*/**", lambda r: r.abort())
    page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
    page.goto("http://localhost:3456/tutorials/markov/6.html", wait_until="load", timeout=30000)
    page.evaluate("(async () => { await document.fonts.ready; })()")
    page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
    page.wait_for_timeout(3500)
    page.screenshot(path=str(OUT / "verify-markov-L6.png"), full_page=False)
    info = page.evaluate("""() => ({
        h1: document.querySelector('h1.topic-title')?.innerText,
        sections: document.querySelectorAll('.lesson-title').length,
        plots: document.querySelectorAll('.js-plotly-plot').length,
        content_len: document.getElementById('lessonContent')?.innerHTML.length || 0,
        bg: getComputedStyle(document.body).backgroundColor
    })""")
    print(f"  h1: {info['h1']}")
    print(f"  sections: {info['sections']}")
    print(f"  plots: {info['plots']}")
    print(f"  content: {info['content_len']}b")
    print(f"  bg: {info['bg']}")
    print(f"  errors: {len(errs)}")
    browser.close()
