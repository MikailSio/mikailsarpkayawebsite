"""Inject the actual script texts back and trigger errors."""
import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.route("**/pyodide*/**", lambda r: r.abort())
    page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto("http://localhost:3456/tutorials/fourier/2.html", wait_until="load", timeout=30000)
    page.wait_for_timeout(2500)
    # Try parsing each script and report which has the error
    res = page.evaluate("""() => {
        const scripts = Array.from(document.querySelectorAll('#lessonContent script'));
        return scripts.map((s, i) => {
            try {
                new Function(s.textContent);
                return {idx: i, ok: true, length: s.textContent.length};
            } catch (e) {
                return {idx: i, ok: false, err: e.message, length: s.textContent.length};
            }
        });
    }""")
    for r in res:
        status = 'OK' if r['ok'] else f"ERR: {r.get('err', '')}"
        print(f"  script #{r['idx']} (len={r['length']}): {status}")
    print(f"\nPage errors:")
    for e in errors:
        print(f"  {e}")
    browser.close()
