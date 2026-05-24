"""Confirm L3 now loads and renders."""
import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.route("**/pyodide*/**", lambda r: r.abort())
    page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
    page.goto("http://localhost:3456/tutorials/fourier/3.html", wait_until="load", timeout=45000)
    page.evaluate("(async () => { await document.fonts.ready; })()")
    page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
    page.wait_for_timeout(4000)
    info = page.evaluate("""() => ({
      h1: document.querySelector('h1.topic-title')?.innerText,
      defined: typeof window.FOURIER_L3,
      en_len: window.FOURIER_L3?.en?.length || 0,
      plots: document.querySelectorAll('.js-plotly-plot').length,
      content_len: document.getElementById('lessonContent')?.innerHTML.length || 0,
    })""")
    page.screenshot(path=str("_design_screens/fseq-L3-en-fixed.png"), full_page=False)
    print(f"  h1: {info['h1']!r}")
    print(f"  FOURIER_L3 type: {info['defined']}, EN len: {info['en_len']}")
    print(f"  plots: {info['plots']}, content_len: {info['content_len']}")
    print(f"  errors ({len(errors)}):", errors[:3])
    browser.close()
