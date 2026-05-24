"""Screenshot fourier L1-L4 (content from completed agents) in both EN and TR."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")

with sync_playwright() as p:
    browser = p.chromium.launch()
    for lesson in [1, 2, 3, 4]:
        for lang in ['en', 'tr']:
            url = f"http://localhost:3456/tutorials/fourier/{lesson}.html"
            out = OUT / f"fourier-L{lesson}-{lang}.png"
            page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
            try:
                page.route("**/pyodide*/**", lambda r: r.abort())
                page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
                page.add_init_script(f"try{{localStorage.setItem('tut-lang','{lang}')}}catch(e){{}}")
                page.goto(url, wait_until="load", timeout=45000)
                page.evaluate("(async () => { await document.fonts.ready; })()")
                page.evaluate(f"if(window.setLang) setLang('{lang}')")
                page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
                page.wait_for_timeout(2500)
                page.screenshot(path=str(out), full_page=False)
                h1 = page.evaluate("(() => { const h = document.querySelector('h2.lesson-title'); return h ? h.innerText.slice(0,80) : 'NO-H2'; })()")
                print(f"  L{lesson}/{lang}: h2={h1!r}")
            except Exception as e:
                print(f"  L{lesson}/{lang} FAIL: {str(e)[:80]}")
            page.context.close()
    browser.close()
