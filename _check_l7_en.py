"""Check exactly what's failing in L7/en."""
import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.route("**/pyodide*/**", lambda r: r.abort())
    page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
    errors = []
    page.on("pageerror", lambda e: errors.append(('page', str(e))))
    page.on("console", lambda m: errors.append((m.type, m.text[:300])) if m.type == 'error' else None)
    page.goto("http://localhost:3456/tutorials/fourier/7.html", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(3000)
    # Check what's in document
    info = page.evaluate("""() => ({
      h1: document.querySelector('h1.topic-title')?.innerText,
      sec_lesson_title: document.querySelectorAll('.lesson-title').length,
      sec_l_title: document.querySelectorAll('.l-title').length,
      plots_js: document.querySelectorAll('.js-plotly-plot').length,
      plots_div: document.querySelectorAll('[id^="plot-l7"]').length,
      outcomes: !!document.querySelector('.lesson-outcomes'),
      content_html_len: document.getElementById('lessonContent')?.innerHTML.length || 0,
    })""")
    print(f"  h1: {info['h1']!r}")
    print(f"  .lesson-title: {info['sec_lesson_title']}")
    print(f"  .l-title: {info['sec_l_title']}")
    print(f"  .js-plotly-plot: {info['plots_js']}")
    print(f"  [id^='plot-l7']: {info['plots_div']}")
    print(f"  outcomes: {info['outcomes']}")
    print(f"  #lessonContent html length: {info['content_html_len']}")
    print(f"\n  Errors ({len(errors)}):")
    for t, msg in errors[:8]:
        print(f"    [{t}] {msg}")
    browser.close()
