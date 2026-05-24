"""Re-check nlp + linalg with longer wait."""
import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    for track in ['nlp', 'linalg', 'pandas', 'mlsec']:
        url = f"http://localhost:3456/tutorials/{track}/1.html"
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=60000)
        page.evaluate("(async () => { await document.fonts.ready; })()")
        page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
        page.wait_for_timeout(3000)
        info = page.evaluate("""() => {
          const root = getComputedStyle(document.documentElement);
          const body = getComputedStyle(document.body);
          return {
            accent: root.getPropertyValue('--accent').trim(),
            bg: body.backgroundColor,
            ff: body.fontFamily.slice(0, 40),
          };
        }""")
        out = f"E:\\\\web\\\\mikailsarpkaya.com\\\\_design_screens\\\\recheck-{track}.png"
        page.screenshot(path=out.replace('\\\\', '\\'), full_page=False)
        print(f"  {track}: accent={info['accent']:10} bg={info['bg']:20} ff={info['ff']}")
        page.close()
    browser.close()
