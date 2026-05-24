"""Get the actual rendered HTML and look for problematic script content."""
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
    page.goto("http://localhost:3456/tutorials/fourier/2.html", wait_until="load", timeout=30000)
    page.wait_for_timeout(2500)
    # Get all script texts in lesson content
    scripts_dom = page.evaluate("""
    Array.from(document.querySelectorAll('#lessonContent script')).map((s, i) => ({
      idx: i,
      length: s.textContent.length,
      preview: s.textContent.slice(0, 100),
      end: s.textContent.slice(-100)
    }))
    """)
    print(f"Scripts in lesson content: {len(scripts_dom)}")
    for s in scripts_dom:
        print(f"  #{s['idx']}: len={s['length']}")
        print(f"    start: {s['preview']!r}")
        print(f"    end:   {s['end']!r}")
    print(f"\nPage errors:")
    for e in errors[:5]:
        print(f"  {e}")
    browser.close()
