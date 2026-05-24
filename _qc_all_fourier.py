"""Full QC of all 8 fourier lessons: EN + TR screenshots + content sanity."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
# Clear old fourier screenshots
for p in OUT.glob("fqc-*.png"):
    p.unlink()

results = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    for n in range(1, 9):
        for lang in ['en', 'tr']:
            page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.route("**/pyodide*/**", lambda r: r.abort())
            page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
            page.add_init_script(f"try{{localStorage.setItem('tut-lang','{lang}')}}catch(e){{}}")
            try:
                page.goto(f"http://localhost:3456/tutorials/fourier/{n}.html", wait_until="networkidle", timeout=60000)
                page.evaluate("(async () => { await document.fonts.ready; })()")
                page.evaluate(f"if(window.setLang) setLang('{lang}')")
                page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
                page.wait_for_timeout(5000)  # ensure plots render
                page.screenshot(path=str(OUT / f"fqc-L{n}-{lang}.png"), full_page=False)
                stats = page.evaluate("""() => ({
                    h1: document.querySelector('h1.topic-title')?.innerText,
                    sections: document.querySelectorAll('h2.lesson-title').length,
                    plots: document.querySelectorAll('.js-plotly-plot').length,
                    bg: getComputedStyle(document.body).backgroundColor,
                    outcomes: !!document.querySelector('.lesson-outcomes')
                })""")
                results.append((n, lang, stats, errors[:3]))
                err_summary = f", errs={len(errors)}" if errors else ""
                print(f"  L{n}/{lang}: h1={stats['h1']!r}, sects={stats['sections']}, plots={stats['plots']}, outcomes={stats['outcomes']}{err_summary}")
            except Exception as e:
                print(f"  L{n}/{lang} FAIL: {str(e)[:80]}")
                results.append((n, lang, None, [str(e)]))
            page.context.close()
    browser.close()

# Summary
print("\n=== SUMMARY ===")
ok = sum(1 for r in results if r[2] and r[2]['plots'] > 0 and r[2]['outcomes'])
print(f"  {ok}/{len(results)} pages fully rendered with plots and outcomes box")
issues = [r for r in results if not r[2] or r[2]['plots'] == 0 or not r[2]['outcomes']]
if issues:
    print(f"  Issues:")
    for n, lang, stats, errs in issues:
        print(f"    L{n}/{lang}: {stats} | errs={errs}")
