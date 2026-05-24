"""Generate 8 fourier/N.html shells by templating from calculus/1.html.
Also generates fourier/index.html for the track landing page.
"""
import re
from pathlib import Path
import shutil

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")
TPL = (ROOT / "calculus" / "1.html").read_text(encoding='utf-8')

# 8 fourier lessons: (slug-en, slug-tr-short, title-en, title-tr, hero-en, hero-tr, desc-en, desc-tr, deco-symbol, reading-min)
LESSONS = [
    # L1
    {
        'title_en': 'Periodic Functions & Sinusoids',
        'title_tr': 'Periyodik Fonksiyonlar & Sinüsler',
        'hero_en':  "PERIODIC <span class='accent'>FUNCTIONS</span>",
        'hero_tr':  "PERİYODİK <span class='accent'>FONKSİYONLAR</span>",
        'desc_en':  "Sines, cosines, amplitude, phase, frequency — the <strong>building blocks of all signals</strong>.",
        'desc_tr':  "Sinüs, kosinüs, genlik, faz, frekans — <strong>tüm sinyallerin yapı taşları</strong>.",
        'deco':     '∿',
        'reading':  18,
    },
    # L2
    {
        'title_en': 'Fourier Series',
        'title_tr': 'Fourier Serileri',
        'hero_en':  "FOURIER <span class='accent'>SERIES</span>",
        'hero_tr':  "FOURIER <span class='accent'>SERİLERİ</span>",
        'desc_en':  "Decomposing periodic signals into infinite sums of sines and cosines — <strong>Fourier's revolutionary idea</strong>.",
        'desc_tr':  "Periyodik sinyalleri sonsuz sinüs-kosinüs toplamlarına ayrıştırma — <strong>Fourier'in devrim niteliğindeki fikri</strong>.",
        'deco':     'Σ',
        'reading':  24,
    },
    # L3
    {
        'title_en': 'Complex Exponential Form',
        'title_tr': 'Karmaşık Üstel Form',
        'hero_en':  "COMPLEX <span class='accent'>EXPONENTIAL</span>",
        'hero_tr':  "KARMAŞIK <span class='accent'>ÜSTEL FORM</span>",
        'desc_en':  "From Euler's formula to the compact <code>e^(iωt)</code> notation — the <strong>language modern signal processing speaks</strong>.",
        'desc_tr':  "Euler formülünden kompakt <code>e^(iωt)</code> gösterimine — <strong>modern sinyal işlemenin konuştuğu dil</strong>.",
        'deco':     'e^iω',
        'reading':  20,
    },
    # L4
    {
        'title_en': 'Continuous Fourier Transform',
        'title_tr': 'Sürekli Fourier Dönüşümü',
        'hero_en':  "FOURIER <span class='accent'>TRANSFORM</span>",
        'hero_tr':  "FOURIER <span class='accent'>DÖNÜŞÜMÜ</span>",
        'desc_en':  "Time domain ↔ frequency domain. The transform that reveals <strong>what frequencies hide inside any signal</strong>.",
        'desc_tr':  "Zaman ekseni ↔ frekans ekseni. <strong>Her sinyalin içinde hangi frekansların gizlendiğini</strong> ortaya çıkaran dönüşüm.",
        'deco':     'ℱ',
        'reading':  26,
    },
    # L5
    {
        'title_en': 'Discrete Fourier Transform & FFT',
        'title_tr': 'Ayrık Fourier (DFT) & FFT',
        'hero_en':  "DFT &amp; <span class='accent'>FFT</span>",
        'hero_tr':  "DFT &amp; <span class='accent'>FFT</span>",
        'desc_en':  "Sampled signals, the discrete Fourier transform, and Cooley-Tukey's <code>O(N log N)</code> algorithm — <strong>the most important algorithm of the 20th century</strong>.",
        'desc_tr':  "Örneklenmiş sinyaller, ayrık Fourier dönüşümü ve Cooley-Tukey'in <code>O(N log N)</code> algoritması — <strong>20. yüzyılın en önemli algoritması</strong>.",
        'deco':     'N²→N㏒N',
        'reading':  28,
    },
    # L6
    {
        'title_en': 'Laplace Transform',
        'title_tr': 'Laplace Dönüşümü',
        'hero_en':  "LAPLACE <span class='accent'>TRANSFORM</span>",
        'hero_tr':  "LAPLACE <span class='accent'>DÖNÜŞÜMÜ</span>",
        'desc_en':  "Fourier's broader cousin — handles transients, initial conditions, and unstable systems. The <strong>workhorse of control theory and EE</strong>.",
        'desc_tr':  "Fourier'in geniş kardeşi — geçici durumları, başlangıç koşullarını ve kararsız sistemleri ele alır. <strong>Kontrol teorisi ve elektrik mühendisliğinin can damarı</strong>.",
        'deco':     'ℒ',
        'reading':  24,
    },
    # L7
    {
        'title_en': 'Wavelets',
        'title_tr': 'Wavelet Dönüşümleri',
        'hero_en':  "WAVELET <span class='accent'>TRANSFORM</span>",
        'hero_tr':  "WAVELET <span class='accent'>DÖNÜŞÜMÜ</span>",
        'desc_en':  "When Fourier isn't enough: <strong>time-frequency localization</strong>. Mother wavelets, scaling, and multiresolution analysis.",
        'desc_tr':  "Fourier'in yetmediği yerde: <strong>zaman-frekans yerelleştirmesi</strong>. Ana wavelet'ler, ölçekleme ve çok çözünürlüklü analiz.",
        'deco':     'ψ',
        'reading':  22,
    },
    # L8
    {
        'title_en': "Spectral Methods in ML",
        'title_tr': "ML'de Spektral Yöntemler",
        'hero_en':  "SPECTRAL <span class='accent'>METHODS</span>",
        'hero_tr':  "SPEKTRAL <span class='accent'>YÖNTEMLER</span>",
        'desc_en':  "CNN as frequency filter, spectral attention, Fourier Neural Operators (FNO), and why Diffusion models <strong>love the frequency domain</strong>.",
        'desc_tr':  "Frekans filtresi olarak CNN, spektral attention, Fourier Neural Operators (FNO) ve Diffusion modellerin <strong>frekans alanını neden sevdiği</strong>.",
        'deco':     'CNN★ℱ',
        'reading':  26,
    },
]

# Build a new Math sidebar block with fourier track inserted after Calculus
# Find the math section in calculus template
NEW_MATH_SECTION = """    <div class="sb-section open">
      <div class="sb-section-label" role="button" tabindex="0" aria-expanded="false"><span class="sb-icon" aria-hidden="true">📐</span><span class="sb-label-text" data-en="Mathematics" data-tr="Matematik">Mathematics</span></div>
      <div class="sb-section-items">
          <div class="sb-track">
            <div class="sb-track-label" data-en="Linear Algebra" data-tr="Doğrusal Cebir">Linear Algebra</div>
            <div class="sb-track-items">
              <a href="/tutorials/linalg/1" class="sb-lesson"><span class="num">01</span><span class="lbl" data-en="Vectors &amp; Spaces" data-tr="Vektörler &amp; Uzaylar">Vectors & Spaces</span></a>
              <a href="/tutorials/linalg/2" class="sb-lesson"><span class="num">02</span><span class="lbl" data-en="Matrices" data-tr="Matrisler">Matrices</span></a>
              <a href="/tutorials/linalg/3" class="sb-lesson"><span class="num">03</span><span class="lbl" data-en="Linear Systems" data-tr="Doğrusal Sistemler">Linear Systems</span></a>
              <a href="/tutorials/linalg/4" class="sb-lesson"><span class="num">04</span><span class="lbl" data-en="Eigenvalues" data-tr="Özdeğerler">Eigenvalues</span></a>
              <a href="/tutorials/linalg/5" class="sb-lesson"><span class="num">05</span><span class="lbl" data-en="SVD" data-tr="SVD">SVD</span></a>
              <a href="/tutorials/linalg/6" class="sb-lesson"><span class="num">06</span><span class="lbl" data-en="Tensors" data-tr="Tensörler">Tensors</span></a>
            </div>
          </div>
          <div class="sb-track">
            <div class="sb-track-label" data-en="Calculus" data-tr="Kalkülüs">Calculus</div>
            <div class="sb-track-items">
              <a href="/tutorials/calculus/1" class="sb-lesson"><span class="num">01</span><span class="lbl" data-en="Limits &amp; Derivatives" data-tr="Limitler &amp; Türevler">Limits & Derivatives</span></a>
              <a href="/tutorials/calculus/2" class="sb-lesson"><span class="num">02</span><span class="lbl" data-en="Differentiation Rules" data-tr="Türev Kuralları">Differentiation Rules</span></a>
              <a href="/tutorials/calculus/3" class="sb-lesson"><span class="num">03</span><span class="lbl" data-en="Partial Derivatives" data-tr="Kısmi Türevler">Partial Derivatives</span></a>
              <a href="/tutorials/calculus/4" class="sb-lesson"><span class="num">04</span><span class="lbl" data-en="Chain Rule &amp; Backprop" data-tr="Zincir Kuralı &amp; Backprop">Chain Rule & Backprop</span></a>
              <a href="/tutorials/calculus/5" class="sb-lesson"><span class="num">05</span><span class="lbl" data-en="Integration for ML" data-tr="ML İçin İntegral">Integration for ML</span></a>
              <a href="/tutorials/calculus/6" class="sb-lesson"><span class="num">06</span><span class="lbl" data-en="Optimization &amp; GD" data-tr="Optimizasyon &amp; GD">Optimization & GD</span></a>
            </div>
          </div>
          <div class="sb-track open current">
            <div class="sb-track-label" data-en="Fourier &amp; Signal" data-tr="Fourier &amp; Sinyal">Fourier &amp; Signal</div>
            <div class="sb-track-items">
              <a href="/tutorials/fourier/1" class="sb-lesson __FOURIER_ACTIVE_1__"><span class="num">01</span><span class="lbl" data-en="Periodic Functions &amp; Sinusoids" data-tr="Periyodik Fonksiyonlar">Periodic Functions & Sinusoids</span></a>
              <a href="/tutorials/fourier/2" class="sb-lesson __FOURIER_ACTIVE_2__"><span class="num">02</span><span class="lbl" data-en="Fourier Series" data-tr="Fourier Serileri">Fourier Series</span></a>
              <a href="/tutorials/fourier/3" class="sb-lesson __FOURIER_ACTIVE_3__"><span class="num">03</span><span class="lbl" data-en="Complex Exponential" data-tr="Karmaşık Üstel">Complex Exponential</span></a>
              <a href="/tutorials/fourier/4" class="sb-lesson __FOURIER_ACTIVE_4__"><span class="num">04</span><span class="lbl" data-en="Fourier Transform" data-tr="Fourier Dönüşümü">Fourier Transform</span></a>
              <a href="/tutorials/fourier/5" class="sb-lesson __FOURIER_ACTIVE_5__"><span class="num">05</span><span class="lbl" data-en="DFT &amp; FFT" data-tr="DFT &amp; FFT">DFT & FFT</span></a>
              <a href="/tutorials/fourier/6" class="sb-lesson __FOURIER_ACTIVE_6__"><span class="num">06</span><span class="lbl" data-en="Laplace Transform" data-tr="Laplace Dönüşümü">Laplace Transform</span></a>
              <a href="/tutorials/fourier/7" class="sb-lesson __FOURIER_ACTIVE_7__"><span class="num">07</span><span class="lbl" data-en="Wavelets" data-tr="Wavelet">Wavelets</span></a>
              <a href="/tutorials/fourier/8" class="sb-lesson __FOURIER_ACTIVE_8__"><span class="num">08</span><span class="lbl" data-en="Spectral Methods in ML" data-tr="ML'de Spektral">Spectral Methods in ML</span></a>
            </div>
          </div>"""

# Get original math section and the part after Fourier slot
ORIG_MATH_SECTION_START = '    <div class="sb-section open">\n      <div class="sb-section-label" role="button" tabindex="0" aria-expanded="false"><span class="sb-icon" aria-hidden="true">📐</span><span class="sb-label-text" data-en="Mathematics" data-tr="Matematik">Mathematics</span></div>\n      <div class="sb-section-items">\n          <div class="sb-track">\n            <div class="sb-track-label" data-en="Linear Algebra"'

# Extract everything from "ML Mathematics" onward (which should stay)
m = re.search(r'(          <div class="sb-track">\s*\n\s*<div class="sb-track-label" data-en="ML Mathematics".*)', TPL, re.DOTALL)
if not m:
    raise SystemExit("Could not find ML Mathematics section in template")
ML_MATH_AND_AFTER = m.group(1)
# Trim to just the closing of Mathematics section
# Find the </div></div></div> that ends the Mathematics sb-section
# In calculus/1.html, Mathematics ends at line ~640 after ALES Math (45 lessons)

# Build the final new Math section: NEW_MATH + ML_MATH_AND_AFTER
FULL_NEW_MATH = NEW_MATH_SECTION + "\n" + ML_MATH_AND_AFTER

# Now build a regex to replace OLD Math section with NEW
OLD_MATH_PATTERN = (
    r'    <div class="sb-section open">\s*\n'
    r'      <div class="sb-section-label" role="button" tabindex="0" aria-expanded="false"><span class="sb-icon" aria-hidden="true">📐</span><span class="sb-label-text" data-en="Mathematics" data-tr="Matematik">Mathematics</span></div>.*?'
    r'(?=    </div>\s*\n  </aside>)'  # stop before "    </div>" then </aside>
)

# Build base modified template (sidebar updated)
base_tpl = re.sub(OLD_MATH_PATTERN, FULL_NEW_MATH + "\n", TPL, flags=re.DOTALL)

# Sanity check
assert "fourier/1" in base_tpl, "fourier inserted check failed"
assert "Linear Algebra" in base_tpl, "Linear Algebra kept check"
assert "ML Mathematics" in base_tpl, "ML Mathematics kept check"

# Now per-lesson customization
OUT_DIR = ROOT / "fourier"
OUT_DIR.mkdir(exist_ok=True)

for i, L in enumerate(LESSONS, start=1):
    page = base_tpl
    title_en = L['title_en']
    title_tr = L['title_tr']
    # Plain-text variants (without HTML entities)
    title_en_plain = title_en.replace('&amp;', '&')
    title_tr_plain = title_tr.replace('&amp;', '&')
    desc_for_meta_en = title_en_plain + f" — Lesson {i} of Fourier Analysis & Signal Processing. Interactive Fourier lesson · FFT, Laplace, spectral methods · mikailsarpkaya.com"

    # --- Meta block (line 5)
    # Build new meta string
    new_meta = (
        f'<meta name="viewport" content="width=device-width,initial-scale=1.0">'
        f'<meta name="description" content="{title_en_plain} — Lesson {i} of Fourier Analysis &amp; Signal Processing. Interactive Fourier lesson · FFT, Laplace, spectral methods · mikailsarpkaya.com">'
        f'<meta property="og:title" content="{title_en_plain} — Fourier Analysis">'
        f'<meta property="og:description" content="{title_en_plain} — Lesson {i} of Fourier Analysis &amp; Signal Processing. Interactive Fourier lesson · FFT, Laplace, spectral methods · mikailsarpkaya.com">'
        f'<meta property="og:type" content="article">'
        f'<meta property="og:url" content="https://mikailsarpkaya.com/tutorials/fourier/{i}">'
        f'<meta property="og:site_name" content="Mikail Sarpkaya">'
        f'<meta property="og:image" content="https://mikailsarpkaya.com/og-image.png">'
        f'<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
        f'<meta name="twitter:image" content="https://mikailsarpkaya.com/og-image.png">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{title_en_plain}">'
        f'<meta name="twitter:description" content="{title_en_plain} — Lesson {i} of Fourier Analysis &amp; Signal Processing. Interactive Fourier lesson · FFT, Laplace, spectral methods · mikailsarpkaya.com">'
        f'<link rel="canonical" href="https://mikailsarpkaya.com/tutorials/fourier/{i}">'
        f'<link rel="alternate" hreflang="en" href="https://mikailsarpkaya.com/tutorials/fourier/{i}">'
        f'<link rel="alternate" hreflang="tr" href="https://mikailsarpkaya.com/tutorials/fourier/{i}">'
        f'<link rel="alternate" hreflang="x-default" href="https://mikailsarpkaya.com/tutorials/fourier/{i}">'
    )
    page = re.sub(r'<meta name="viewport"[^<]*>.*?<link rel="alternate" hreflang="x-default"[^>]*>', new_meta, page, count=1, flags=re.DOTALL)

    # --- <title>
    page = re.sub(r'<title>[^<]*</title>', f'<title>{title_en} — Fourier — Mikail Sarpkaya</title>', page, count=1)

    # --- JSON-LD
    new_jsonld = (
        '<script type="application/ld+json">{"@context": "https://schema.org", "@type": "LearningResource", '
        f'"name": "{title_en_plain}", "description": "{title_en_plain} — lesson {i} of Fourier Analysis & Signal Processing.", '
        f'"url": "https://mikailsarpkaya.com/tutorials/fourier/{i}", '
        '"inLanguage": ["en", "tr"], "learningResourceType": "Tutorial", "educationalUse": "self-study", '
        '"isPartOf": {"@type": "Course", "name": "Fourier Analysis & Signal Processing", "url": "https://mikailsarpkaya.com/tutorials/fourier/"}, '
        '"author": {"@type": "Person", "name": "Mikail Sarpkaya", "url": "https://mikailsarpkaya.com/"}, '
        '"publisher": {"@type": "Person", "name": "Mikail Sarpkaya"}}</script>'
    )
    page = re.sub(r'<script type="application/ld\+json">.*?</script>', new_jsonld, page, count=1, flags=re.DOTALL)

    # --- Loader name (FOUR letters: F O U R)
    page = re.sub(r'<div class="ld-name">.*?</div>', '<div class="ld-name"><span>F</span><span>O</span><span>U</span><span>R</span></div>', page, count=1)

    # --- Sidebar current-title
    page = re.sub(r'<div class="sb-current-title"[^>]*>[^<]*</div>',
                  '<div class="sb-current-title" data-en="FOURIER" data-tr="FOURIER">FOURIER</div>',
                  page, count=1)
    # current-lesson ttl
    n_padded = f"{i:02d}"
    page = re.sub(
        r'<span class="ttl"[^>]*>[^<]*</span>',
        f'<span class="ttl" data-en="{title_en}" data-tr="{title_tr}">{title_en}</span>',
        page, count=1
    )
    # current-lesson num
    page = re.sub(r'(<div class="sb-current-lesson"[^>]*>\s*<span class="num">)\d+(</span>)',
                  r'\g<1>' + n_padded + r'\g<2>', page, count=1)

    # --- Sidebar active mark (replace placeholders)
    for j in range(1, 9):
        marker = f'__FOURIER_ACTIVE_{j}__'
        page = page.replace(marker, 'active' if j == i else '')

    # --- Hero section
    page = re.sub(
        r'<div class="topic-eyebrow"[^>]*>[^<]*</div>',
        f'<div class="topic-eyebrow" data-en="Lesson {n_padded} · Fourier" data-tr="Ders {n_padded} · Fourier">Lesson {n_padded} · Fourier</div>',
        page, count=1
    )
    page = re.sub(
        r'<h1 class="topic-title"[^>]*>.*?</h1>',
        f'<h1 class="topic-title" data-en="{L["hero_en"]}" data-tr="{L["hero_tr"]}">{L["hero_en"]}</h1>',
        page, count=1, flags=re.DOTALL
    )
    page = re.sub(
        r'<p class="topic-desc"[^>]*>.*?</p>',
        f'<p class="topic-desc" data-en="{L["desc_en"]}" data-tr="{L["desc_tr"]}">{L["desc_en"]}</p>',
        page, count=1, flags=re.DOTALL
    )
    # Reading time
    page = re.sub(r'<div class="meta-item"><span class="meta-label" data-en="Reading" data-tr="Okuma">Reading</span> \d+ min</div>',
                  f'<div class="meta-item"><span class="meta-label" data-en="Reading" data-tr="Okuma">Reading</span> {L["reading"]} min</div>',
                  page, count=1)
    # Tools (use Plotly + NumPy + SciPy for fourier)
    page = re.sub(r'<div class="meta-item"><span class="meta-label" data-en="Tools" data-tr="Araçlar">Tools</span>[^<]*</div>',
                  '<div class="meta-item"><span class="meta-label" data-en="Tools" data-tr="Araçlar">Tools</span> NumPy · SciPy · Plotly</div>',
                  page, count=1)
    # Topic deco symbol
    page = re.sub(r'<div class="topic-deco" aria-hidden="true">[^<]*</div>',
                  f'<div class="topic-deco" aria-hidden="true">{L["deco"]}</div>',
                  page, count=1)

    # --- Lesson content L.js include
    page = re.sub(r'<script src="L\d+\.js\?v=1"></script>', f'<script src="L{i}.js?v=1"></script>', page, count=1)
    # CALCULUS_L1 → FOURIER_Li (both references)
    page = page.replace('CALCULUS_L1', f'FOURIER_L{i}')

    # --- Lesson nav at bottom (prev/next)
    prev_lbl_en, prev_lbl_tr, prev_href = '', '', ''
    next_lbl_en, next_lbl_tr, next_href = '', '', ''
    if i == 1:
        prev_href = '/tutorials/calculus/6'
        prev_lbl_en, prev_lbl_tr = '← Calculus: GD', '← Kalkülüs: GD'
    else:
        prev_href = f'/tutorials/fourier/{i-1}'
        prev_lbl_en = '← ' + LESSONS[i-2]['title_en']
        prev_lbl_tr = '← ' + LESSONS[i-2]['title_tr']
    if i == 8:
        next_href = '/tutorials/fourier/'
        next_lbl_en, next_lbl_tr = 'Course Complete ✓', 'Kurs Tamamlandı ✓'
    else:
        next_href = f'/tutorials/fourier/{i+1}'
        next_lbl_en = f'Next: {LESSONS[i]["title_en"]} →'
        next_lbl_tr = f'Sonraki: {LESSONS[i]["title_tr"]} →'

    new_nav = (
        f'<div class="lesson-nav">'
        f'<a href="{prev_href}" class="ln-btn" data-en="{prev_lbl_en}" data-tr="{prev_lbl_tr}">{prev_lbl_en}</a>'
        f'<span class="ln-center" data-en="Lesson {i} of 8" data-tr="Ders {i} / 8">Lesson {i} of 8</span>'
        f'<a href="{next_href}" class="ln-btn ln-next" data-en="{next_lbl_en}" data-tr="{next_lbl_tr}">{next_lbl_en}</a>'
        f'</div>'
    )
    page = re.sub(r'<div class="lesson-nav">.*?</div>', new_nav, page, count=1, flags=re.DOTALL)

    # --- Lab section "Hello from ..."
    page = page.replace('print("Hello from Limits &amp; Derivatives!")',
                        f'print("Hello from {title_en_plain}!")')

    # Write
    out = OUT_DIR / f"{i}.html"
    out.write_text(page, encoding='utf-8')
    print(f"  wrote {out.name}: {title_en}")

print("\nDone — 8 fourier shells generated.")
