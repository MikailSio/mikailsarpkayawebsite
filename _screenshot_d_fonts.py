"""Screenshot D-font variants."""
import subprocess, sys, time
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")

W, H = 1440, 2200

# Add ?nopreload=1 hash trick: inject CSS via URL fragment we control.
# Better: prepend a tiny shim HTML that hides #loader then iframes the real page.
# Even better: just hide loader instantly via injecting CSS through DevTools-style
# Chrome flag. The cleanest: --evaluate-on-new-document not available in CLI.
# Use --virtual-time-budget for high value + add a small wrapper page.

WRAPPER_DIR = Path(r"E:\web\mikailsarpkaya.com\tutorials\c")

for d in ['D', 'D1', 'D2', 'D3']:
    src_shell = WRAPPER_DIR / f"1-{d}.html"
    if not src_shell.exists():
        continue
    # Make a screenshot-only copy with loader pre-hidden
    text = src_shell.read_text(encoding='utf-8')
    # Inject loader-hide CSS right before the closing head tag
    text_shot = text.replace(
        '</head>',
        '<style>#loader{display:none!important}html,body{visibility:visible!important}</style></head>'
    )
    shot_shell = WRAPPER_DIR / f"1-{d}-shot.html"
    shot_shell.write_text(text_shot, encoding='utf-8')

    url = f"http://localhost:3456/tutorials/c/1-{d}-shot.html"
    out = OUT / f"design-{d}.png"
    print(f"Capturing {d}")
    subprocess.run([
        CHROME, "--headless=new", "--disable-gpu", "--no-sandbox",
        f"--window-size={W},{H}", "--hide-scrollbars",
        "--default-background-color=00000000",
        "--virtual-time-budget=25000",
        f"--screenshot={out}",
        url,
    ], capture_output=True, timeout=90)
    if out.exists():
        print(f"  ✓ {out.stat().st_size // 1024} KB")
    # cleanup shot shell
    shot_shell.unlink()
