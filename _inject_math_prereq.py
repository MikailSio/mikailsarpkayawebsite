"""Inject a 'Math prerequisites' callout box at the top of L1.js for AI/Math tracks.
Box links to specific Matematik (lise-mat) lessons that are foundational for that track.
Bilingual (EN + TR).
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

# Per-track prereq lessons (lise-mat lesson numbers + display titles)
# Lesson numbers must exist in lise-mat (1-109)
TRACK_PREREQS = {
    'linalg': [
        (40, 'Functions &amp; Notation', 'Fonksiyon Tanımı'),
        (72, 'Matrices &amp; Operations', 'Matris &amp; İşlemler'),
        (73, 'Determinants', 'Determinantlar'),
        (91, 'Geometric Vectors', 'Vektörler'),
    ],
    'calculus': [
        (40, 'Functions &amp; Notation', 'Fonksiyon Tanımı'),
        (11, 'Intuitive Limit', 'Sezgisel Limit'),
        (17, 'Derivative Definition', 'Türev Tanımı'),
        (27, 'Antiderivative', 'Ters Türev'),
    ],
    'math': [
        (40, 'Functions', 'Fonksiyonlar'),
        (72, 'Matrices', 'Matrisler'),
        (94, 'Probability Basics', 'Olasılık Temelleri'),
        (101, 'Expected Value &amp; Variance', 'Beklenen Değer'),
    ],
    'markov': [
        (72, 'Matrices', 'Matrisler'),
        (94, 'Probability Basics', 'Olasılık Temelleri'),
        (97, "Bayes' Theorem", 'Bayes Teoremi'),
        (101, 'Expected Value &amp; Variance', 'Beklenen Değer'),
    ],
    'discrete': [
        (65, 'Sum Formulas (Σ)', 'Toplam Formülleri (Σ)'),
        (98, 'Permutations', 'Permütasyon'),
        (99, 'Combinations', 'Kombinasyon'),
    ],
    'complex': [
        (68, 'Complex Numbers Intro', 'Karmaşık Sayılar Giriş'),
        (69, 'Complex Arithmetic', 'Karmaşık İşlemler'),
        (70, 'Polar Form', 'Kutupsal Form'),
        (71, 'De Moivre &amp; Roots', 'De Moivre &amp; Kökler'),
    ],
    'fourier': [
        (1, 'Unit Circle', 'Birim Çember'),
        (4, 'Trig Identities I', 'Trig Özdeşlikler I'),
        (8, 'Trig Function Graphs', 'Trig Fonksiyon Grafikleri'),
        (27, 'Antiderivative', 'Ters Türev'),
    ],
    'diffeq': [
        (17, 'Derivative Definition', 'Türev Tanımı'),
        (22, 'First-Derivative Test', 'İlk Türev Testi'),
        (27, 'Antiderivative', 'Ters Türev'),
        (28, 'Integration Techniques', 'İntegrasyon Teknikleri'),
    ],
    'numpy': [
        (40, 'Functions &amp; Notation', 'Fonksiyon Tanımı'),
        (72, 'Matrices &amp; Operations', 'Matris &amp; İşlemler'),
        (91, 'Geometric Vectors', 'Vektörler'),
    ],
    'pytorch': [
        (17, 'Derivative Definition', 'Türev Tanımı'),
        (72, 'Matrices &amp; Operations', 'Matris &amp; İşlemler'),
        (91, 'Geometric Vectors', 'Vektörler'),
        (40, 'Functions &amp; Notation', 'Fonksiyon Tanımı'),
    ],
    'sklearn': [
        (40, 'Functions &amp; Notation', 'Fonksiyon Tanımı'),
        (94, 'Probability Basics', 'Olasılık Temelleri'),
        (101, 'Expected Value &amp; Variance', 'Beklenen Değer'),
        (102, 'Mean, Median, Mode', 'Ortalama, Medyan, Mod'),
    ],
    'ml-theory': [
        (72, 'Matrices', 'Matrisler'),
        (94, 'Probability Basics', 'Olasılık Temelleri'),
        (97, "Bayes' Theorem", 'Bayes Teoremi'),
        (101, 'Expected Value &amp; Variance', 'Beklenen Değer'),
    ],
    'nlp': [
        (72, 'Matrices', 'Matrisler'),
        (91, 'Geometric Vectors', 'Vektörler'),
        (94, 'Probability Basics', 'Olasılık Temelleri'),
    ],
    'cv': [
        (72, 'Matrices', 'Matrisler'),
        (91, 'Geometric Vectors', 'Vektörler'),
        (17, 'Derivative Definition', 'Türev Tanımı'),
    ],
    'rl': [
        (94, 'Probability Basics', 'Olasılık Temelleri'),
        (101, 'Expected Value &amp; Variance', 'Beklenen Değer'),
        (72, 'Matrices', 'Matrisler'),
    ],
    'deep': [
        (17, 'Derivative Definition', 'Türev Tanımı'),
        (19, 'Chain Rule', 'Zincir Kuralı'),
        (72, 'Matrices', 'Matrisler'),
        (91, 'Geometric Vectors', 'Vektörler'),
    ],
}


def build_box(track_slug):
    prereqs = TRACK_PREREQS[track_slug]
    items_en = '\n'.join(
        f'<li><a href="/tutorials/matematik/{n}" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">{en}</a> <span style="opacity:0.55;font-size:0.82em">(Math L{n})</span></li>'
        for n, en, tr in prereqs
    )
    items_tr = '\n'.join(
        f'<li><a href="/tutorials/matematik/{n}" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">{tr}</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L{n})</span></li>'
        for n, en, tr in prereqs
    )

    en_box = (
        '<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">\n'
        '<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>\n'
        '<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>\n'
        f'<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">\n'
        f'{items_en}\n'
        '</ul>\n'
        '</div>\n'
    )

    tr_box = (
        '<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">\n'
        '<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>\n'
        '<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>\n'
        f'<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">\n'
        f'{items_tr}\n'
        '</ul>\n'
        '</div>\n'
    )
    return en_box, tr_box


def inject(track_slug):
    fp = ROOT / track_slug / 'L1.js'
    if not fp.exists():
        return False, f'no L1.js for {track_slug}'
    txt = fp.read_text(encoding='utf-8')
    # Skip if already injected
    if 'class="math-prereq"' in txt:
        return False, 'already injected'

    en_box, tr_box = build_box(track_slug)
    # Escape single quotes for inclusion in single-quoted strings
    en_box_sq = en_box.replace("'", "\\'").replace('\n', '')
    tr_box_sq = tr_box.replace("'", "\\'").replace('\n', '')

    # Try template-literal style first (window.XXX = { en: `...`, tr: `...` })
    new_txt = re.sub(
        r"(en:\s*`)",
        lambda m: m.group(1) + en_box,
        txt,
        count=1,
    )
    new_txt = re.sub(
        r"(tr:\s*`)",
        lambda m: m.group(1) + tr_box,
        new_txt,
        count=1,
    )

    if new_txt == txt:
        # Try single-quoted style (var XXX = { en: '...', tr: '...' })
        new_txt = re.sub(
            r"(en:\s*')",
            lambda m: m.group(1) + en_box_sq,
            txt,
            count=1,
        )
        new_txt = re.sub(
            r"(tr:\s*')",
            lambda m: m.group(1) + tr_box_sq,
            new_txt,
            count=1,
        )

    if new_txt == txt:
        return False, 'pattern not found'

    fp.write_text(new_txt, encoding='utf-8')
    return True, 'injected'


if __name__ == '__main__':
    for slug in TRACK_PREREQS.keys():
        ok, msg = inject(slug)
        print(f'{slug}: {msg}')
