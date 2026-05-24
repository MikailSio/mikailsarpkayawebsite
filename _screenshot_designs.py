"""Take desktop screenshots of 4 design variants via Chrome headless."""
import subprocess, sys, time
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = Path(r"E:\web\mikailsarpkaya.com\_design_screens")
OUT.mkdir(exist_ok=True)

# Clean old
for p in OUT.glob("*.png"):
    p.unlink()

designs = ['A', 'B', 'C', 'D']
W, H = 1440, 2200  # Wide enough to see sidebar + content, tall enough for hero+first sections

for d in designs:
    url = f"http://localhost:3456/tutorials/c/1-{d}.html"
    out = OUT / f"design-{d}.png"
    print(f"Capturing Design {d} → {out.name}")
    subprocess.run([
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--window-size={W},{H}",
        "--hide-scrollbars",
        "--default-background-color=00000000",
        "--virtual-time-budget=8000",
        f"--screenshot={out}",
        url,
    ], capture_output=True, timeout=60)
    if out.exists():
        size_kb = out.stat().st_size // 1024
        print(f"  ✓ {size_kb} KB")
    else:
        print(f"  ✗ failed")

print("\nDone. Files:")
for p in sorted(OUT.glob("*.png")):
    print(f"  {p}")
