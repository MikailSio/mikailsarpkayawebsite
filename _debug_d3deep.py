"""Debug why D3-deep body bg shows transparent."""
import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    page.goto("http://localhost:3456/tutorials/c/1-D3-deep.html", wait_until="networkidle")
    info = page.evaluate("""() => {
      const html = document.documentElement;
      const body = document.body;
      const bs = getComputedStyle(body);
      const hs = getComputedStyle(html);
      const root = getComputedStyle(html);
      return {
        htmlDataTheme: html.getAttribute('data-theme'),
        htmlBg: hs.backgroundColor,
        bodyBg: bs.backgroundColor,
        bodyBgImg: bs.backgroundImage,
        bg0: root.getPropertyValue('--bg-0'),
        bg: root.getPropertyValue('--bg'),
        fontFamily: bs.fontFamily,
        bodyClasses: body.className,
      };
    }""")
    for k, v in info.items():
        print(f"  {k}: {v}")
    browser.close()
