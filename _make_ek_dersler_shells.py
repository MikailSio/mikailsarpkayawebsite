"""Generate HTML shells for the 6 ek dersler:
- calculus/7.html, calculus/8.html
- linalg/7.html, linalg/8.html
- math/10.html, math/11.html

Uses the existing first shell in each track as template.
"""
import re
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

# Define each new lesson's metadata
EK_DERSLER = [
    # calculus L7
    {'track':'calculus','num':7,'module':'CALCULUS_L7','short':'Calc','course_en':'Calculus for ML','desc_meta':'Lagrange multipliers, KKT, constrained optimization',
     'title_en':'Lagrange Multipliers','title_tr':'Lagrange Çarpanları',
     'hero_en':"LAGRANGE <span class='accent'>MULTIPLIERS</span>",'hero_tr':"LAGRANGE <span class='accent'>ÇARPANLARI</span>",
     'desc_en':"Constrained optimization, KKT conditions, SVM duality — <strong>solving problems with equality and inequality constraints</strong>.",
     'desc_tr':"Kısıtlı optimizasyon, KKT koşulları, SVM ikilemi — <strong>eşitlik ve eşitsizlik kısıtlarıyla problemler çözme</strong>.",
     'deco':'λ∇g','reading':24,
     'prev_track':'calculus','prev_lesson':6,'prev_title_en':'Optimization & GD','prev_title_tr':'Optimizasyon & GD',
     'next_track':'calculus','next_lesson':8,'next_title_en':'Advanced Vector Analysis','next_title_tr':'İleri Vektör Analizi',
     'total':8},
    # calculus L8
    {'track':'calculus','num':8,'module':'CALCULUS_L8','short':'Calc','course_en':'Calculus for ML','desc_meta':'Divergence, curl, Stokes, Jacobian, Hessian',
     'title_en':'Advanced Vector Analysis','title_tr':'İleri Vektör Analizi',
     'hero_en':"VECTOR <span class='accent'>ANALYSIS</span>",'hero_tr':"VEKTÖR <span class='accent'>ANALİZİ</span>",
     'desc_en':"Divergence, curl, Stokes' and divergence theorems, Jacobian/Hessian matrices — <strong>the geometric language of physics and ML</strong>.",
     'desc_tr':"Diverjans, rotasyonel, Stokes ve diverjans teoremleri, Jacobian/Hessian matrisleri — <strong>fizik ve ML'nin geometrik dili</strong>.",
     'deco':'∇·F','reading':26,
     'prev_track':'calculus','prev_lesson':7,'prev_title_en':'Lagrange Multipliers','prev_title_tr':'Lagrange Çarpanları',
     'next_track':'linalg','next_lesson':1,'next_title_en':'Vectors & Spaces','next_title_tr':'Vektörler & Uzaylar',
     'total':8},
    # linalg L7
    {'track':'linalg','num':7,'module':'LINALG_L7','short':'LinAlg','course_en':'Linear Algebra for ML','desc_meta':'Float32/16/BF16, numerical stability, mixed precision',
     'title_en':'Float Arithmetic & Numerical Stability','title_tr':'Kayan Nokta Aritmetiği & Sayısal Kararlılık',
     'hero_en':"FLOAT &amp; <span class='accent'>STABILITY</span>",'hero_tr':"FLOAT &amp; <span class='accent'>KARARLILIK</span>",
     'desc_en':"IEEE 754 layouts, float16/bfloat16, mixed precision training, gradient clipping — <strong>the bits that ML models actually live in</strong>.",
     'desc_tr':"IEEE 754 yerleşimleri, float16/bfloat16, karışık kesinlik eğitimi, gradyan kırpma — <strong>ML modellerin gerçekten yaşadığı bitler</strong>.",
     'deco':'fp32→fp16','reading':24,
     'prev_track':'linalg','prev_lesson':6,'prev_title_en':'Tensors','prev_title_tr':'Tensörler',
     'next_track':'linalg','next_lesson':8,'next_title_en':'Matrix Calculus & Einsum','next_title_tr':'Matris Analizi & Einsum',
     'total':8},
    # linalg L8
    {'track':'linalg','num':8,'module':'LINALG_L8','short':'LinAlg','course_en':'Linear Algebra for ML','desc_meta':'Matrix calculus, Kronecker, einsum',
     'title_en':'Matrix Calculus & Einsum','title_tr':'Matris Analizi & Einsum',
     'hero_en':"MATRIX <span class='accent'>CALCULUS</span>",'hero_tr':"MATRİS <span class='accent'>ANALİZİ</span>",
     'desc_en':"Matrix derivatives, Kronecker products, einsum notation, attention via einsum — <strong>tensor operations made elegant</strong>.",
     'desc_tr':"Matris türevleri, Kronecker çarpımları, einsum gösterimi, einsum ile attention — <strong>zarif tensor işlemleri</strong>.",
     'deco':'∂L/∂W','reading':24,
     'prev_track':'linalg','prev_lesson':7,'prev_title_en':'Float Arithmetic','prev_title_tr':'Float Aritmetik',
     'next_track':'math','next_lesson':1,'next_title_en':'Probability Fundamentals','next_title_tr':'Olasılık Temelleri',
     'total':8},
    # math L10
    {'track':'math','num':10,'module':'MATH_L10','short':'ML Math','course_en':'ML Mathematics','desc_meta':'PAC learning, VC dim, generalization bounds',
     'title_en':'Statistical Learning Theory','title_tr':'İstatistiksel Öğrenme Teorisi',
     'hero_en':"LEARNING <span class='accent'>THEORY</span>",'hero_tr':"ÖĞRENME <span class='accent'>TEORİSİ</span>",
     'desc_en':"PAC learning, VC dimension, Rademacher complexity, generalization bounds — <strong>when can ML actually be trusted to generalize?</strong>",
     'desc_tr':"PAC öğrenme, VC boyutu, Rademacher karmaşıklığı, genelleme sınırları — <strong>ML ne zaman gerçekten genelleyebilir?</strong>",
     'deco':'VC(H)','reading':26,
     'prev_track':'math','prev_lesson':9,'prev_title_en':'Information Geometry','prev_title_tr':'Bilgi Geometrisi',
     'next_track':'math','next_lesson':11,'next_title_en':'Advanced Probability','next_title_tr':'İleri Olasılık',
     'total':11},
    # math L11
    {'track':'math','num':11,'module':'MATH_L11','short':'ML Math','course_en':'ML Mathematics','desc_meta':'Martingales, concentration inequalities',
     'title_en':'Advanced Probability: Martingales & Concentration','title_tr':'İleri Olasılık: Martingaleler & Yoğunlaşma',
     'hero_en':"MARTINGALES &amp; <span class='accent'>CONCENTRATION</span>",'hero_tr':"MARTINGALELER &amp; <span class='accent'>YOĞUNLAŞMA</span>",
     'desc_en':"Martingales, optional stopping, Azuma-Hoeffding, McDiarmid — <strong>probabilistic tools that power modern ML theory</strong>.",
     'desc_tr':"Martingaleler, isteyebilir durma, Azuma-Hoeffding, McDiarmid — <strong>modern ML teorisini güçlendiren olasılıksal araçlar</strong>.",
     'deco':'E[X_n|F]','reading':26,
     'prev_track':'math','prev_lesson':10,'prev_title_en':'Statistical Learning Theory','prev_title_tr':'İstatistiksel Öğrenme Teorisi',
     'next_track':'math','next_lesson':1,'next_title_en':'Course Complete ✓','next_title_tr':'Kurs Tamamlandı ✓',
     'total':11},
]


def generate_shell(conf):
    # Read existing shell for the track as template (use lesson 1)
    tpl_path = ROOT / conf['track'] / '1.html'
    tpl = tpl_path.read_text(encoding='utf-8')

    title_en_plain = conf['title_en'].replace('&amp;', '&')
    i = conf['num']
    n_padded = f"{i:02d}"

    # 1. Meta tags
    new_meta = (
        f'<meta name="viewport" content="width=device-width,initial-scale=1.0">'
        f'<meta name="description" content="{title_en_plain} — Lesson {i} of {conf["course_en"]}. {conf["desc_meta"]} · mikailsarpkaya.com">'
        f'<meta property="og:title" content="{title_en_plain} — {conf["short"]}">'
        f'<meta property="og:description" content="{title_en_plain} — Lesson {i} of {conf["course_en"]}.">'
        f'<meta property="og:type" content="article">'
        f'<meta property="og:url" content="https://mikailsarpkaya.com/tutorials/{conf["track"]}/{i}">'
        f'<meta property="og:site_name" content="Mikail Sarpkaya">'
        f'<meta property="og:image" content="https://mikailsarpkaya.com/og-image.png">'
        f'<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
        f'<meta name="twitter:image" content="https://mikailsarpkaya.com/og-image.png">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{title_en_plain}">'
        f'<meta name="twitter:description" content="{title_en_plain} — Lesson {i}.">'
        f'<link rel="canonical" href="https://mikailsarpkaya.com/tutorials/{conf["track"]}/{i}">'
        f'<link rel="alternate" hreflang="en" href="https://mikailsarpkaya.com/tutorials/{conf["track"]}/{i}">'
        f'<link rel="alternate" hreflang="tr" href="https://mikailsarpkaya.com/tutorials/{conf["track"]}/{i}">'
        f'<link rel="alternate" hreflang="x-default" href="https://mikailsarpkaya.com/tutorials/{conf["track"]}/{i}">'
    )
    page = re.sub(r'<meta name="viewport"[^<]*>.*?<link rel="alternate" hreflang="x-default"[^>]*>', new_meta, tpl, count=1, flags=re.DOTALL)

    # 2. Title
    page = re.sub(r'<title>[^<]*</title>', f'<title>{conf["title_en"]} — {conf["short"]} — Mikail Sarpkaya</title>', page, count=1)

    # 3. JSON-LD
    new_jsonld = (
        '<script type="application/ld+json">{"@context": "https://schema.org", "@type": "LearningResource", '
        f'"name": "{title_en_plain}", "description": "{title_en_plain} — lesson {i} of {conf["course_en"]}.", '
        f'"url": "https://mikailsarpkaya.com/tutorials/{conf["track"]}/{i}", '
        '"inLanguage": ["en", "tr"], "learningResourceType": "Tutorial", "educationalUse": "self-study", '
        '"author": {"@type": "Person", "name": "Mikail Sarpkaya"}}</script>'
    )
    page = re.sub(r'<script type="application/ld\+json">.*?</script>', new_jsonld, page, count=1, flags=re.DOTALL)

    # 4. Sidebar current-lesson num + ttl
    page = re.sub(r'(<div class="sb-current-lesson"[^>]*>\s*<span class="num">)\d+(</span>)',
                  r'\g<1>' + n_padded + r'\g<2>', page, count=1)
    page = re.sub(r'<span class="ttl"[^>]*>[^<]*</span>',
                  f'<span class="ttl" data-en="{conf["title_en"]}" data-tr="{conf["title_tr"]}">{conf["title_en"]}</span>',
                  page, count=1)

    # 5. Sidebar — strip existing 'active' from same track and add to new lesson
    # First, remove all "active" classes from this track's sidebar entries
    track = conf['track']
    page = re.sub(rf'(<a href="/tutorials/{track}/\d+" class="sb-lesson) active(")', r'\1\2', page)
    # Now, the new lesson isn't yet in sidebar — need to add it
    # For calculus/linalg/math: insert after the highest existing lesson in their sidebar block
    # Match the existing entries and append a new one
    if track == 'calculus':
        existing_anchor = re.search(r'<a href="/tutorials/calculus/6"[^>]*>.*?</a>', page)
        if existing_anchor:
            new_entry = f'\n              <a href="/tutorials/{track}/{i}" class="sb-lesson active"><span class="num">{n_padded}</span><span class="lbl" data-en="{conf["title_en"]}" data-tr="{conf["title_tr"]}">{conf["title_en"]}</span></a>'
            # Insert after existing L6 if this is L7, or after L7 if L8
            target = existing_anchor.group(0)
            if i == 7:
                page = page.replace(target, target + new_entry, 1)
            elif i == 8:
                # Find L7 entry (just added in propagation step)
                l7_anchor = re.search(r'<a href="/tutorials/calculus/7"[^>]*>.*?</a>', page)
                if l7_anchor:
                    page = page.replace(l7_anchor.group(0), l7_anchor.group(0) + new_entry, 1)
                else:
                    page = page.replace(target, target + new_entry, 1)
    elif track == 'linalg':
        existing_anchor = re.search(r'<a href="/tutorials/linalg/6"[^>]*>.*?</a>', page)
        if existing_anchor:
            new_entry = f'\n              <a href="/tutorials/{track}/{i}" class="sb-lesson active"><span class="num">{n_padded}</span><span class="lbl" data-en="{conf["title_en"]}" data-tr="{conf["title_tr"]}">{conf["title_en"]}</span></a>'
            target = existing_anchor.group(0)
            if i == 7:
                page = page.replace(target, target + new_entry, 1)
            elif i == 8:
                l7_anchor = re.search(r'<a href="/tutorials/linalg/7"[^>]*>.*?</a>', page)
                if l7_anchor:
                    page = page.replace(l7_anchor.group(0), l7_anchor.group(0) + new_entry, 1)
                else:
                    page = page.replace(target, target + new_entry, 1)
    elif track == 'math':
        existing_anchor = re.search(r'<a href="/tutorials/math/9"[^>]*>.*?</a>', page)
        if existing_anchor:
            new_entry = f'\n              <a href="/tutorials/{track}/{i}" class="sb-lesson active"><span class="num">{n_padded}</span><span class="lbl" data-en="{conf["title_en"]}" data-tr="{conf["title_tr"]}">{conf["title_en"]}</span></a>'
            target = existing_anchor.group(0)
            if i == 10:
                page = page.replace(target, target + new_entry, 1)
            elif i == 11:
                l10_anchor = re.search(r'<a href="/tutorials/math/10"[^>]*>.*?</a>', page)
                if l10_anchor:
                    page = page.replace(l10_anchor.group(0), l10_anchor.group(0) + new_entry, 1)
                else:
                    page = page.replace(target, target + new_entry, 1)

    # 6. Hero section
    page = re.sub(r'<div class="topic-eyebrow"[^>]*>[^<]*</div>',
                  f'<div class="topic-eyebrow" data-en="Lesson {n_padded} · {conf["short"]}" data-tr="Ders {n_padded} · {conf["short"]}">Lesson {n_padded} · {conf["short"]}</div>',
                  page, count=1)
    page = re.sub(r'<h1 class="topic-title"[^>]*>.*?</h1>',
                  f'<h1 class="topic-title" data-en="{conf["hero_en"]}" data-tr="{conf["hero_tr"]}">{conf["hero_en"]}</h1>',
                  page, count=1, flags=re.DOTALL)
    page = re.sub(r'<p class="topic-desc"[^>]*>.*?</p>',
                  f'<p class="topic-desc" data-en="{conf["desc_en"]}" data-tr="{conf["desc_tr"]}">{conf["desc_en"]}</p>',
                  page, count=1, flags=re.DOTALL)
    page = re.sub(r'<div class="meta-item"><span class="meta-label" data-en="Reading" data-tr="Okuma">Reading</span> \d+ min</div>',
                  f'<div class="meta-item"><span class="meta-label" data-en="Reading" data-tr="Okuma">Reading</span> {conf["reading"]} min</div>',
                  page, count=1)
    page = re.sub(r'<div class="topic-deco" aria-hidden="true">[^<]*</div>',
                  f'<div class="topic-deco" aria-hidden="true">{conf["deco"]}</div>',
                  page, count=1)

    # 7. L.js include + module ref
    page = re.sub(r'<script src="L\d+\.js\?v=1"></script>', f'<script src="L{i}.js?v=1"></script>', page, count=1)
    # First find existing module name and replace (e.g., CALCULUS_L1 → CALCULUS_L7)
    page = re.sub(r'(CALCULUS|LINALG|MATH)_L\d+', conf['module'], page)

    # 8. Lesson nav
    new_nav = (
        f'<div class="lesson-nav">'
        f'<a href="/tutorials/{conf["prev_track"]}/{conf["prev_lesson"]}" class="ln-btn" data-en="← {conf["prev_title_en"]}" data-tr="← {conf["prev_title_tr"]}">← {conf["prev_title_en"]}</a>'
        f'<span class="ln-center" data-en="Lesson {i} of {conf["total"]}" data-tr="Ders {i} / {conf["total"]}">Lesson {i} of {conf["total"]}</span>'
        f'<a href="/tutorials/{conf["next_track"]}/{conf["next_lesson"]}" class="ln-btn ln-next" data-en="Next: {conf["next_title_en"]} →" data-tr="Sonraki: {conf["next_title_tr"]} →">Next: {conf["next_title_en"]} →</a>'
        f'</div>'
    )
    page = re.sub(r'<div class="lesson-nav">.*?</div>', new_nav, page, count=1, flags=re.DOTALL)

    # 9. Lab Hello
    page = re.sub(r'print\("Hello from [^"]+!"\)', f'print("Hello from {title_en_plain}!")', page, count=1)

    # Write
    out = ROOT / conf['track'] / f"{i}.html"
    out.write_text(page, encoding='utf-8')
    print(f"  wrote {conf['track']}/{i}.html ({conf['title_en']})")


for conf in EK_DERSLER:
    generate_shell(conf)
print("Done.")
