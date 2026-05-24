"""Create empty L1.js-L8.js stubs so shells don't error before agents write content."""
from pathlib import Path

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials\fourier")

TITLES = [
    'Periodic Functions & Sinusoids',
    'Fourier Series',
    'Complex Exponential Form',
    'Continuous Fourier Transform',
    'Discrete Fourier Transform & FFT',
    'Laplace Transform',
    'Wavelets',
    'Spectral Methods in ML',
]
TITLES_TR = [
    'Periyodik Fonksiyonlar & Sinüsler',
    'Fourier Serileri',
    'Karmaşık Üstel Form',
    'Sürekli Fourier Dönüşümü',
    'Ayrık Fourier (DFT) & FFT',
    'Laplace Dönüşümü',
    'Wavelet Dönüşümleri',
    "ML'de Spektral Yöntemler",
]

for i in range(1, 9):
    p = ROOT / f"L{i}.js"
    if p.exists() and p.stat().st_size > 1000:
        print(f"  skip {p.name} (already has content)")
        continue
    stub = (
        f"window.FOURIER_L{i} = {{\n"
        f"  en: `<p class=\"l-text\">Lesson {i}: {TITLES[i-1]} — content coming soon.</p>`,\n"
        f"  tr: `<p class=\"l-text\">Ders {i}: {TITLES_TR[i-1]} — içerik yakında.</p>`\n"
        f"}};\n"
    )
    p.write_text(stub, encoding='utf-8')
    print(f"  stub {p.name}")
