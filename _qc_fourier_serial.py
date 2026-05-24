"""Serial (one at a time) QC of all 8 fourier lessons EN+TR with new browser context each time."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')

OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
for p in OUT.glob("fseq-*.png"):
    p.unlink()

results = []
with sync_playwright() as p:
    for n in range(1, 9):
        for lang in ['en', 'tr']:
            # Fresh browser per page to avoid resource buildup
            browser = p.chromium.launch()
            page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.route("**/pyodide*/**", lambda r: r.abort())
            page.route("**/cdn.jsdelivr.net/pyodide/**", lambda r: r.abort())
            page.add_init_script(f"try{{localStorage.setItem('tut-lang','{lang}')}}catch(e){{}}")
            try:
                page.goto(f"http://localhost:3456/tutorials/fourier/{n}.html", wait_until="load", timeout=45000)
                page.evaluate("(async () => { await document.fonts.ready; })()")
                page.evaluate(f"if(window.setLang) setLang('{lang}')")
                page.evaluate("const l=document.getElementById('loader'); if(l) l.style.display='none';")
                page.wait_for_timeout(4000)  # ensure plots render
                page.screenshot(path=str(OUT / f"fseq-L{n}-{lang}.png"), full_page=False)
                stats = page.evaluate("""() => ({
                    h1: document.querySelector('h1.topic-title')?.innerText,
                    sects: document.querySelectorAll('.lesson-title, .l-title, .cc-title, h2.l-title').length,
                    plots: document.querySelectorAll('.js-plotly-plot').length,
                    bg: getComputedStyle(document.body).backgroundColor,
                    outcomes: !!document.querySelector('.lesson-outcomes'),
                    content_len: document.getElementById('lessonContent')?.innerHTML.length || 0,
                })""")
                results.append((n, lang, stats, errors[:2]))
                err_summary = f", errs={len(errors)}" if errors else ""
                h1_str = repr(stats['h1'])[:40]
                print(f"  L{n}/{lang}: h1={h1_str}, sects={stats['sects']}, plots={stats['plots']}, outcomes={stats['outcomes']}, content={stats['content_len']}b{err_summary}")
            except Exception as e:
                print(f"  L{n}/{lang} FAIL: {str(e)[:80]}")
                results.append((n, lang, None, [str(e)]))
            browser.close()

print("\n=== SUMMARY ===")
ok = sum(1 for r in results if r[2] and r[2]['content_len'] > 5000 and r[2]['plots'] > 0)
print(f"  {ok}/{len(results)} pages OK (content > 5KB AND plots > 0)")
for r in results:
    n, lang, stats, errs = r
    if not stats or stats['content_len'] <= 5000 or stats['plots'] == 0:
        print(f"  L{n}/{lang}: {stats} | errs={errs}")
