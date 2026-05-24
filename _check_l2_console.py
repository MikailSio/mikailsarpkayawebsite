"""Check L2 page for console errors that might break CSS rendering."""
import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(("page", str(e))))
    page.on("console", lambda msg: errors.append((msg.type, msg.text)) if msg.type == 'error' else None)
    page.route("**/pyodide*/**", lambda r: r.abort())
    page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
    page.goto("http://localhost:3456/tutorials/fourier/2.html", wait_until="load", timeout=30000)
    page.wait_for_timeout(2500)
    # Check what's rendered
    h1 = page.evaluate("document.querySelector('h1.topic-title')?.innerText")
    body_bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
    lesson_content_count = page.evaluate("document.querySelectorAll('.lesson-title').length")
    print(f"  h1: {h1!r}")
    print(f"  body bg: {body_bg}")
    print(f"  lesson-title count: {lesson_content_count}")
    print(f"  errors ({len(errors)}):")
    for t, msg in errors[:10]:
        print(f"    [{t}] {msg[:200]}")
    browser.close()
