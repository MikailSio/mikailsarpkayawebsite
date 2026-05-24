"""Load L3.js inside a real browser via <script src> and capture the actual parse error."""
import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(("page", str(e))))
    page.on("console", lambda m: errors.append((m.type, m.text)) if m.type in ('error', 'warning') else None)
    # Block pyodide
    page.route("**/pyodide*/**", lambda r: r.abort())
    page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())

    # Visit the shell so the L3.js script tag loads
    page.goto("http://localhost:3456/tutorials/fourier/3.html", wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(4000)

    # Check if window.FOURIER_L3 was defined
    defined = page.evaluate("typeof window.FOURIER_L3")
    print(f"  typeof FOURIER_L3: {defined}")
    if defined != 'undefined':
        en_len = page.evaluate("window.FOURIER_L3.en?.length || 0")
        tr_len = page.evaluate("window.FOURIER_L3.tr?.length || 0")
        print(f"  EN length: {en_len}, TR length: {tr_len}")

    print(f"\n  Errors ({len(errors)}):")
    for t, msg in errors:
        # try to find the script that failed
        if 'token' in msg.lower() or 'syntax' in msg.lower() or 'unexpected' in msg.lower():
            print(f"    [{t}] ⚠ {msg[:400]}")
        else:
            print(f"    [{t}] {msg[:200]}")
    browser.close()
