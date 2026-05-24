"""Screenshot 6 different tracks to verify D3-black propagation."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")

# Sample 6 diverse tracks
TRACKS = [
    ('c', 1, '#4de87a green'),
    ('python', 1, '#4de87a green'),
    ('pytorch', 1, '#ee4c2c orange'),
    ('nlp', 1, '#c8a96e gold'),
    ('linalg', 1, '#14b8a6 teal'),
    ('js', 1, '#facc15 yellow'),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    for track, lesson, color in TRACKS:
        url = f"http://localhost:3456/tutorials/{track}/{lesson}.html"
        out = OUT / f"prop-{track}.png"
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.evaluate("(async () => { await document.fonts.ready; })()")
        page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
        page.wait_for_timeout(1500)
        page.screenshot(path=str(out), full_page=False)
        # verify
        info = page.evaluate("""() => {
          const bs = getComputedStyle(document.body);
          const h1 = document.querySelector('h1, .l-title, .lesson-title');
          const h1s = h1 ? getComputedStyle(h1) : null;
          const root = getComputedStyle(document.documentElement);
          return {
            bg: bs.backgroundColor,
            ff: bs.fontFamily.slice(0,30),
            h1ff: h1s ? h1s.fontFamily.slice(0,20) : 'NA',
            accent: root.getPropertyValue('--accent').trim(),
          };
        }""")
        print(f"  {track}/{lesson}: bg={info['bg']} ff={info['ff']} h1={info['h1ff']} accent={info['accent']}")
        page.close()
    browser.close()
