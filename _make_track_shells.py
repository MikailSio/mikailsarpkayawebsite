"""Generic track shell generator — works for diffeq, markov, discrete, complex.
Usage: python _make_track_shells.py <track-slug>

Reads from a TRACK_CONFIGS dict below.
"""
import re
import sys
from pathlib import Path

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")
sys.stdout.reconfigure(encoding='utf-8')

TRACK_CONFIGS = {
    'matematik': {
        'name_en': 'Mathematics',
        'name_tr': 'Matematik',
        'short_en': 'Math',
        'short_tr': 'Matematik',
        'loader': 'MATH',
        'course_label_en': 'Mathematics',
        'course_label_tr': 'Matematik',
        'tools': 'GeoGebra · Desmos · Plotly',
        'sidebar_label_en': 'Mathematics',
        'sidebar_label_tr': 'Matematik',
        'after_track': 'control',
        'after_track_lessons': 7,
        'after_track_last_title_en': 'LQR/MPC',
        'after_track_last_title_tr': 'LQR/MPC',
        'desc_meta': 'Mathematics curriculum: trigonometry, calculus, logarithms, complex numbers, geometry, statistics',
        'lessons': [
            # ===== TRIGONOMETRI (10 ders) =====
            {'en': 'Angle Measurement & Unit Circle', 'tr': 'Açı Ölçüsü & Birim Çember', 'hero_en': "ANGLE &amp; <span class='accent'>UNIT CIRCLE</span>", 'hero_tr': "AÇI &amp; <span class='accent'>BİRİM ÇEMBER</span>", 'desc_en': "Degrees, radians, unit circle, signed angles — <strong>foundation of trigonometry</strong>.", 'desc_tr': "Derece, radyan, birim çember, işaretli açılar — <strong>trigonometrinin temeli</strong>.", 'deco': '∠', 'reading': 16},
            {'en': 'Basic Trigonometric Ratios', 'tr': 'Temel Trigonometrik Oranlar', 'hero_en': "TRIG <span class='accent'>RATIOS</span>", 'hero_tr': "TRİG <span class='accent'>ORANLAR</span>", 'desc_en': "Sine, cosine, tangent, cotangent, secant, cosecant — <strong>right triangle ratios</strong>.", 'desc_tr': "Sinüs, kosinüs, tanjant, kotanjant, sekant, kosekant — <strong>dik üçgen oranları</strong>.", 'deco': 'sin θ', 'reading': 16},
            {'en': 'Special Angles & Values', 'tr': 'Özel Açılar & Değerleri', 'hero_en': "SPECIAL <span class='accent'>ANGLES</span>", 'hero_tr': "ÖZEL <span class='accent'>AÇILAR</span>", 'desc_en': "30, 45, 60, 90 ve katları. Sinüs/kosinüs/tanjant değerleri ezbere ve türetimle.", 'desc_tr': "30, 45, 60, 90 ve katları. Sinüs/kosinüs/tanjant değerleri ezbere ve türetimle.", 'deco': '30 45 60', 'reading': 14},
            {'en': 'Trigonometric Identities I (Pythagorean, Sum-Difference)', 'tr': 'Trigonometrik Özdeşlikler I (Pisagor, Toplam-Fark)', 'hero_en': "TRIG <span class='accent'>IDENTITIES I</span>", 'hero_tr': "TRİG <span class='accent'>ÖZDEŞLİKLER I</span>", 'desc_en': "sin²+cos²=1, sum/difference, double/half angle — <strong>essential toolbox</strong>.", 'desc_tr': "sin²+cos²=1, toplam/fark, yarım/iki kat — <strong>vazgeçilmez araçlar</strong>.", 'deco': 'sin²+cos²', 'reading': 20},
            {'en': 'Trigonometric Identities II (Product-to-Sum, Power Reduction)', 'tr': 'Trigonometrik Özdeşlikler II (Çarpım-Toplam, Güç İndirgeme)', 'hero_en': "TRIG <span class='accent'>IDENTITIES II</span>", 'hero_tr': "TRİG <span class='accent'>ÖZDEŞLİKLER II</span>", 'desc_en': "Product-to-sum, sum-to-product, power reduction formulas.", 'desc_tr': "Çarpım-toplam, toplam-çarpım, güç indirgeme formülleri.", 'deco': '2sin·cos', 'reading': 18},
            {'en': 'Trigonometric Equations', 'tr': 'Trigonometrik Denklemler', 'hero_en': "TRIG <span class='accent'>EQUATIONS</span>", 'hero_tr': "TRİG <span class='accent'>DENKLEMLER</span>", 'desc_en': "Solving sin x = a, cos x = a, tan x = a; periodic solutions, general solution form.", 'desc_tr': "sin x = a, cos x = a, tan x = a çözümü; periyodik çözümler, genel form.", 'deco': 'sin x=½', 'reading': 18},
            {'en': 'Law of Sines & Cosines', 'tr': 'Sinüs & Kosinüs Teoremleri', 'hero_en': "LAW OF <span class='accent'>SINES &amp; COSINES</span>", 'hero_tr': "SİNÜS &amp; <span class='accent'>KOSİNÜS</span>", 'desc_en': "a/sinA = b/sinB = c/sinC and c²=a²+b²-2ab cosC. Triangle solving toolkit.", 'desc_tr': "a/sinA = b/sinB = c/sinC ve c²=a²+b²-2ab cosC. Üçgen çözme.", 'deco': 'a/sinA', 'reading': 18},
            {'en': 'Trigonometric Function Graphs', 'tr': 'Trigonometrik Fonksiyon Grafikleri', 'hero_en': "TRIG <span class='accent'>GRAPHS</span>", 'hero_tr': "TRİG <span class='accent'>GRAFİKLER</span>", 'desc_en': "y=sin x, y=cos x, y=tan x grafikleri; periyot, genlik, faz kaydırma.", 'desc_tr': "y=sin x, y=cos x, y=tan x grafikleri; periyot, genlik, faz kaydırma.", 'deco': '~ y=sin x', 'reading': 18},
            {'en': 'Inverse Trigonometric Functions', 'tr': 'Ters Trigonometrik Fonksiyonlar', 'hero_en': "INVERSE <span class='accent'>TRIG</span>", 'hero_tr': "TERS <span class='accent'>TRİG</span>", 'desc_en': "arcsin, arccos, arctan: definitions, domains/ranges, graphs.", 'desc_tr': "arcsin, arccos, arctan: tanım, bölge/görüntü, grafikler.", 'deco': 'arcsin', 'reading': 16},
            {'en': 'Applications: Heights, Distances, Engineering', 'tr': 'Uygulamalar: Yükseklikler, Uzaklıklar, Mühendislik', 'hero_en': "TRIG <span class='accent'>APPLICATIONS</span>", 'hero_tr': "TRİG <span class='accent'>UYGULAMALAR</span>", 'desc_en': "Bina yüksekliği, gemi navigasyonu, vektör bileşenleri, ses dalgaları.", 'desc_tr': "Bina yüksekliği, gemi navigasyonu, vektör bileşenleri, ses dalgaları.", 'deco': 'h=d tanθ', 'reading': 20},
            # ===== LIMIT & SUREKLILIK (6 ders) =====
            {'en': 'Intuitive Limit', 'tr': 'Sezgisel Limit', 'hero_en': "INTUITIVE <span class='accent'>LIMIT</span>", 'hero_tr': "SEZGİSEL <span class='accent'>LİMİT</span>", 'desc_en': "x→a iken f(x) nereye yaklaşır? Sağ/sol limit, grafik okuma.", 'desc_tr': "x→a iken f(x) nereye yaklaşır? Sağ/sol limit, grafik okuma.", 'deco': 'lim', 'reading': 16},
            {'en': 'Limit Laws & Calculation', 'tr': 'Limit Kuralları & Hesaplama', 'hero_en': "LIMIT <span class='accent'>LAWS</span>", 'hero_tr': "LİMİT <span class='accent'>KURALLARI</span>", 'desc_en': "Toplam, çarpım, bölüm; polinom, rasyonel, basit kompozisyon limit hesabı.", 'desc_tr': "Toplam, çarpım, bölüm; polinom, rasyonel, basit kompozisyon limit hesabı.", 'deco': 'lim Σ', 'reading': 18},
            {'en': 'Indeterminate Forms & L\'Hôpital', 'tr': 'Belirsizlik Durumları & L\'Hôpital', 'hero_en': "0/0 &amp; <span class='accent'>L\'HÔPITAL</span>", 'hero_tr': "0/0 &amp; <span class='accent'>L\'HÔPİTAL</span>", 'desc_en': "0/0, ∞/∞, 0·∞ formları; L\'Hôpital kuralı ve uygulamaları.", 'desc_tr': "0/0, ∞/∞, 0·∞ formları; L\'Hôpital kuralı ve uygulamaları.", 'deco': 'f\'/g\'', 'reading': 18},
            {'en': 'Infinite Limits & Asymptotes', 'tr': 'Sonsuz Limitler & Asimptotlar', 'hero_en': "INFINITE <span class='accent'>LIMITS</span>", 'hero_tr': "SONSUZ <span class='accent'>LİMİTLER</span>", 'desc_en': "x→±∞ davranış, dikey/yatay/eğik asimptotlar.", 'desc_tr': "x→±∞ davranış, dikey/yatay/eğik asimptotlar.", 'deco': '→ ∞', 'reading': 16},
            {'en': 'Continuity & Discontinuities', 'tr': 'Süreklilik & Süreksizlikler', 'hero_en': "<span class='accent'>CONTINUITY</span>", 'hero_tr': "<span class='accent'>SÜREKLİLİK</span>", 'desc_en': "Süreklilik tanımı, süreksizlik türleri (kaldırılabilir, sıçrama, sonsuz).", 'desc_tr': "Süreklilik tanımı, süreksizlik türleri (kaldırılabilir, sıçrama, sonsuz).", 'deco': 'f(a)=lim', 'reading': 16},
            {'en': 'Intermediate Value Theorem & Applications', 'tr': 'Ara Değer Teoremi & Uygulamalar', 'hero_en': "IVT &amp; <span class='accent'>APPLICATIONS</span>", 'hero_tr': "IVT &amp; <span class='accent'>UYGULAMALAR</span>", 'desc_en': "Ara değer teoremi, kök bulma uygulamaları, sabit-nokta teoremi girişi.", 'desc_tr': "Ara değer teoremi, kök bulma uygulamaları, sabit-nokta teoremi girişi.", 'deco': 'IVT', 'reading': 16},
            # ===== TUREV (10 ders) =====
            {'en': 'Derivative Definition (Limit-Based)', 'tr': 'Türev Tanımı (Limit Tabanlı)', 'hero_en': "DERIVATIVE <span class='accent'>DEFINITION</span>", 'hero_tr': "TÜREV <span class='accent'>TANIMI</span>", 'desc_en': "f\'(x) = lim_{h→0} [f(x+h)-f(x)]/h. Teğet doğru, hız, anı oran.", 'desc_tr': "f\'(x) = lim_{h→0} [f(x+h)-f(x)]/h. Teğet doğru, hız, anı oran.", 'deco': 'lim Δy/Δx', 'reading': 18},
            {'en': 'Basic Differentiation Rules', 'tr': 'Temel Türev Kuralları', 'hero_en': "DIFF <span class='accent'>RULES</span>", 'hero_tr': "TÜREV <span class='accent'>KURALLARI</span>", 'desc_en': "Sabit, kuvvet kuralı, toplam, fark, sabit çarpan kuralı.", 'desc_tr': "Sabit, kuvvet kuralı, toplam, fark, sabit çarpan kuralı.", 'deco': 'd/dx x^n', 'reading': 14},
            {'en': 'Product, Quotient, Chain Rules', 'tr': 'Çarpım, Bölüm, Zincir Kuralları', 'hero_en': "PRODUCT &amp; <span class='accent'>CHAIN</span>", 'hero_tr': "ÇARPIM &amp; <span class='accent'>ZİNCİR</span>", 'desc_en': "(fg)\', (f/g)\', (f∘g)\'. Karmaşık fonksiyonların türevi.", 'desc_tr': "(fg)\', (f/g)\', (f∘g)\'. Karmaşık fonksiyonların türevi.", 'deco': 'f·g\'+f\'·g', 'reading': 18},
            {'en': 'Derivatives of Trig & Exponential Functions', 'tr': 'Trig & Üstel Fonksiyonların Türevi', 'hero_en': "TRIG &amp; EXP <span class='accent'>DERIVATIVES</span>", 'hero_tr': "TRİG &amp; ÜSTEL <span class='accent'>TÜREVLER</span>", 'desc_en': "(sin x)\', (cos x)\', (tan x)\', (e^x)\', (ln x)\' — türetilmiş tablosu.", 'desc_tr': "(sin x)\', (cos x)\', (tan x)\', (e^x)\', (ln x)\' — türetim ve tablo.", 'deco': 'cos x', 'reading': 16},
            {'en': 'Implicit & Logarithmic Differentiation', 'tr': 'Kapalı & Logaritmik Türev', 'hero_en': "IMPLICIT <span class='accent'>DIFF</span>", 'hero_tr': "KAPALI <span class='accent'>TÜREV</span>", 'desc_en': "y kapalı verildiğinde dy/dx; logaritmik türev alım tekniği.", 'desc_tr': "y kapalı verildiğinde dy/dx; logaritmik türev alım tekniği.", 'deco': 'ln·y', 'reading': 16},
            {'en': 'Higher-Order Derivatives', 'tr': 'Yüksek Mertebe Türevler', 'hero_en': "HIGHER <span class='accent'>DERIVATIVES</span>", 'hero_tr': "YÜKSEK <span class='accent'>TÜREVLER</span>", 'desc_en': "f\'\', f\'\'\', ivme, kısa-vade-uzun-vade hareket.", 'desc_tr': "f\'\', f\'\'\', ivme, kısa-vade-uzun-vade hareket.", 'deco': 'f\'\'', 'reading': 14},
            {'en': 'Increasing/Decreasing & First-Derivative Test', 'tr': 'Artan/Azalan & İlk Türev Testi', 'hero_en': "1ST <span class='accent'>DERIVATIVE TEST</span>", 'hero_tr': "1. TÜREV <span class='accent'>TESTİ</span>", 'desc_en': "f\'>0 artan, f\'<0 azalan; yerel ekstremum yer tayini.", 'desc_tr': "f\'>0 artan, f\'<0 azalan; yerel ekstremum yer tayini.", 'deco': 'f\'(x)=0', 'reading': 16},
            {'en': 'Concavity & Second-Derivative Test', 'tr': 'Bükülme & 2. Türev Testi', 'hero_en': "2ND <span class='accent'>DERIVATIVE TEST</span>", 'hero_tr': "2. TÜREV <span class='accent'>TESTİ</span>", 'desc_en': "Konveks/konkav, bükülme noktası, 2. türev testi.", 'desc_tr': "Konveks/konkav, bükülme noktası, 2. türev testi.", 'deco': 'f\'\'(x)', 'reading': 16},
            {'en': 'Curve Sketching', 'tr': 'Eğri Çizimi', 'hero_en': "CURVE <span class='accent'>SKETCHING</span>", 'hero_tr': "EĞRİ <span class='accent'>ÇİZİMİ</span>", 'desc_en': "Tanım bölgesi, kesişim, asimptot, ekstremum, bükülme — 6 adımda eğri çizimi.", 'desc_tr': "Tanım bölgesi, kesişim, asimptot, ekstremum, bükülme — 6 adımda eğri çizimi.", 'deco': '~↗↘', 'reading': 18},
            {'en': 'Optimization Problems', 'tr': 'Optimizasyon Problemleri', 'hero_en': "OPTIMIZATION <span class='accent'>PROBLEMS</span>", 'hero_tr': "OPTİMİZASYON <span class='accent'>PROBLEMLERİ</span>", 'desc_en': "Maks alan, min yüzey, maks kar problemleri — klasik kelime problemleri.", 'desc_tr': "Maks alan, min yüzey, maks kar problemleri — klasik kelime problemleri.", 'deco': 'max/min', 'reading': 18},
            # ===== INTEGRAL (8 ders) =====
            {'en': 'Antiderivative & Indefinite Integral', 'tr': 'Ters Türev & Belirsiz İntegral', 'hero_en': "<span class='accent'>ANTIDERIVATIVE</span>", 'hero_tr': "<span class='accent'>TERS TÜREV</span>", 'desc_en': "F\'(x) = f(x) ise F belirsiz integraldir. Temel kurallar.", 'desc_tr': "F\'(x) = f(x) ise F belirsiz integraldir. Temel kurallar.", 'deco': '∫f dx', 'reading': 16},
            {'en': 'Basic Integration Techniques', 'tr': 'Temel İntegrasyon Teknikleri', 'hero_en': "INTEGRATION <span class='accent'>TECHNIQUES</span>", 'hero_tr': "İNTEGRASYON <span class='accent'>TEKNİKLERİ</span>", 'desc_en': "Kuvvet, trig, exp, ln integralleri; sabit çarpan.", 'desc_tr': "Kuvvet, trig, exp, ln integralleri; sabit çarpan.", 'deco': '∫x^n', 'reading': 16},
            {'en': 'Substitution Method', 'tr': 'Değişken Değiştirme', 'hero_en': "<span class='accent'>SUBSTITUTION</span>", 'hero_tr': "<span class='accent'>YERİNE KOYMA</span>", 'desc_en': "u-değişken ile zincir-kuralı tersi; trig yerine koyma.", 'desc_tr': "u-değişken ile zincir-kuralı tersi; trig yerine koyma.", 'deco': 'u = g(x)', 'reading': 18},
            {'en': 'Integration by Parts', 'tr': 'Kısmi İntegrasyon', 'hero_en': "<span class='accent'>BY PARTS</span>", 'hero_tr': "<span class='accent'>KISMİ İNTEGRAL</span>", 'desc_en': "∫ u dv = uv - ∫ v du. Çarpım kuralının tersi.", 'desc_tr': "∫ u dv = uv - ∫ v du. Çarpım kuralının tersi.", 'deco': '∫u dv', 'reading': 18},
            {'en': 'Definite Integral & FTC', 'tr': 'Belirli İntegral & Analizin Temel Teoremi', 'hero_en': "DEFINITE <span class='accent'>INTEGRAL</span>", 'hero_tr': "BELİRLİ <span class='accent'>İNTEGRAL</span>", 'desc_en': "Riemann toplamı, FTC: ∫_a^b f(x)dx = F(b)-F(a).", 'desc_tr': "Riemann toplamı, FTC: ∫_a^b f(x)dx = F(b)-F(a).", 'deco': '∫_a^b', 'reading': 18},
            {'en': 'Area Between Curves', 'tr': 'Eğriler Arası Alan', 'hero_en': "<span class='accent'>AREA</span>", 'hero_tr': "<span class='accent'>ALAN</span>", 'desc_en': "İki fonksiyon arası alan hesabı, kesişim noktaları ile.", 'desc_tr': "İki fonksiyon arası alan hesabı, kesişim noktaları ile.", 'deco': '∫(f-g)', 'reading': 16},
            {'en': 'Volumes of Revolution', 'tr': 'Dönme Cisimlerinin Hacmi', 'hero_en': "VOLUMES OF <span class='accent'>REVOLUTION</span>", 'hero_tr': "DÖNME <span class='accent'>HACMİ</span>", 'desc_en': "Disk, halka, kabuk yöntemleri ile dönme cismi hacmi.", 'desc_tr': "Disk, halka, kabuk yöntemleri ile dönme cismi hacmi.", 'deco': 'π∫r²', 'reading': 18},
            {'en': 'Applications: Work, Average Value, Arc Length', 'tr': 'Uygulamalar: İş, Ortalama Değer, Yay Uzunluğu', 'hero_en': "<span class='accent'>APPLICATIONS</span>", 'hero_tr': "<span class='accent'>UYGULAMALAR</span>", 'desc_en': "Fizik (iş), ortalama değer teoremi, yay uzunluğu formülü.", 'desc_tr': "Fizik (iş), ortalama değer teoremi, yay uzunluğu formülü.", 'deco': 'W=∫F·dx', 'reading': 18},
            # ===== LOGARITMA (5 ders) =====
            {'en': 'Exponential Functions', 'tr': 'Üstel Fonksiyonlar', 'hero_en': "<span class='accent'>EXPONENTIAL</span>", 'hero_tr': "<span class='accent'>ÜSTEL</span>", 'desc_en': "y = a^x grafiği, büyume/azalma modelleri, e tabanı özelliği.", 'desc_tr': "y = a^x grafiği, büyume/azalma modelleri, e tabanı özelliği.", 'deco': 'a^x', 'reading': 16},
            {'en': 'Logarithm Definition & Properties', 'tr': 'Logaritma Tanımı & Özellikleri', 'hero_en': "<span class='accent'>LOGARITHM</span>", 'hero_tr': "<span class='accent'>LOGARİTMA</span>", 'desc_en': "log_a x = y ⇔ a^y = x. Toplam, fark, kuvvet özellikleri.", 'desc_tr': "log_a x = y ⇔ a^y = x. Toplam, fark, kuvvet özellikleri.", 'deco': 'log_a', 'reading': 18},
            {'en': 'Natural Logarithm & Common Log', 'tr': 'Doğal & Bayağı Logaritma', 'hero_en': "ln &amp; <span class='accent'>log</span>", 'hero_tr': "ln &amp; <span class='accent'>log</span>", 'desc_en': "e tabanında ln, 10 tabanında log; taban değiştirme formülü.", 'desc_tr': "e tabanında ln, 10 tabanında log; taban değiştirme formülü.", 'deco': 'ln · log', 'reading': 14},
            {'en': 'Logarithmic Equations & Inequalities', 'tr': 'Logaritmik Denklem & Eşitsizlikler', 'hero_en': "LOG <span class='accent'>EQUATIONS</span>", 'hero_tr': "LOG <span class='accent'>DENKLEMLER</span>", 'desc_en': "log denklemleri çözme, monotonluk, eşitsizlikler.", 'desc_tr': "log denklemleri çözme, monotonluk, eşitsizlikler.", 'deco': 'log x=2', 'reading': 16},
            {'en': 'Applications: Sound (dB), pH, Growth Models', 'tr': 'Uygulamalar: Ses (dB), pH, Bü̇yüme Modelleri', 'hero_en': "LOG <span class='accent'>APPLICATIONS</span>", 'hero_tr': "LOG <span class='accent'>UYGULAMALAR</span>", 'desc_en': "Desibel, pH, deprem şiddeti (Richter), nüfus bü̇yümesi.", 'desc_tr': "Desibel, pH, deprem şiddeti (Richter), nüfus bü̇yümesi.", 'deco': 'dB · pH', 'reading': 16},
            # ===== FAZ 3b (23 ders) =====
            # ----- Fonksiyonlar (7 ders) L40-L46 -----
            {'en': 'Function Definition & Notation', 'tr': 'Fonksiyon Tanımı & Gösterimi', 'hero_en': "FUNCTION <span class='accent'>DEFINITION</span>", 'hero_tr': "FONKSİYON <span class='accent'>TANIMI</span>", 'desc_en': "Domain, range, function notation, vertical line test.", 'desc_tr': "Tanım kümesi, görüntü kümesi, fonksiyon gösterimi, dikey doğru testi.", 'deco': 'f: A→B', 'reading': 16},
            {'en': 'Function Types', 'tr': 'Fonksiyon Türleri', 'hero_en': "FUNCTION <span class='accent'>TYPES</span>", 'hero_tr': "FONKSİYON <span class='accent'>TÜRLERİ</span>", 'desc_en': "Linear, quadratic, polynomial, rational, root, absolute value functions.", 'desc_tr': "Doğrusal, ikinci derece, polinom, rasyonel, köklü, mutlak değer fonksiyonları.", 'deco': 'y=mx+b', 'reading': 18},
            {'en': 'Graphs & Transformations', 'tr': 'Grafikler & Dönüşümler', 'hero_en': "GRAPH <span class='accent'>TRANSFORMATIONS</span>", 'hero_tr': "GRAFİK <span class='accent'>DÖNÜŞÜMLER</span>", 'desc_en': "Shifts, reflections, stretching/compression of function graphs.", 'desc_tr': "Fonksiyon grafiklerinin kaydırma, yansıtma, genişletme/sıkıştırma dönüşümleri.", 'deco': 'f(x-h)+k', 'reading': 18},
            {'en': 'Composite Functions', 'tr': 'Bileşke Fonksiyonlar', 'hero_en': "<span class='accent'>COMPOSITE</span> FUNCTIONS", 'hero_tr': "<span class='accent'>BİLEŞKE</span> FONKSİYONLAR", 'desc_en': "(f∘g)(x) = f(g(x)) — composition rules, domain considerations.", 'desc_tr': "(f∘g)(x) = f(g(x)) — bileşke kuralları, tanım kümesi.", 'deco': '(f∘g)', 'reading': 16},
            {'en': 'Inverse Functions', 'tr': 'Ters Fonksiyonlar', 'hero_en': "<span class='accent'>INVERSE</span> FUNCTIONS", 'hero_tr': "<span class='accent'>TERS</span> FONKSİYONLAR", 'desc_en': "One-to-one, finding inverse, graph reflection across y=x.", 'desc_tr': "Bire-bir, ters bulma, y=x ekseninde yansıma.", 'deco': 'f⁻¹', 'reading': 18},
            {'en': 'Piecewise Functions', 'tr': 'Parçalı Fonksiyonlar', 'hero_en': "<span class='accent'>PIECEWISE</span> FUNCTIONS", 'hero_tr': "<span class='accent'>PARÇALI</span> FONKSİYONLAR", 'desc_en': "Multi-rule functions, continuity at junctions, graphing.", 'desc_tr': "Çok-kurallı fonksiyonlar, birleşim noktalarında süreklilik, grafik çizimi.", 'deco': '{f, g}', 'reading': 16},
            {'en': 'Special Functions (Abs, Floor, Sign)', 'tr': 'Özel Fonksiyonlar (Mutlak, Taban, İşaret)', 'hero_en': "SPECIAL <span class='accent'>FUNCTIONS</span>", 'hero_tr': "ÖZEL <span class='accent'>FONKSİYONLAR</span>", 'desc_en': "|x|, ⌊x⌋, ⌈x⌉, sgn(x) — definitions, graphs, properties.", 'desc_tr': "|x|, ⌊x⌋, ⌈x⌉, sgn(x) — tanım, grafik, özellikler.", 'deco': '|x| ⌊x⌋', 'reading': 16},
            # ----- Polinomlar (5 ders) L47-L51 -----
            {'en': 'Polynomial Definition & Degree', 'tr': 'Polinom Tanımı & Derece', 'hero_en': "POLYNOMIAL <span class='accent'>BASICS</span>", 'hero_tr': "POLİNOM <span class='accent'>TEMELLERİ</span>", 'desc_en': "Definition, degree, leading coefficient, end behavior.", 'desc_tr': "Tanım, derece, baş katsayı, sonsuz davranış.", 'deco': 'aₙxⁿ', 'reading': 16},
            {'en': 'Polynomial Operations', 'tr': 'Polinom İşlemleri', 'hero_en': "POLYNOMIAL <span class='accent'>OPERATIONS</span>", 'hero_tr': "POLİNOM <span class='accent'>İŞLEMLERİ</span>", 'desc_en': "Addition, subtraction, multiplication, long division.", 'desc_tr': "Toplama, çıkarma, çarpma, uzun bölme.", 'deco': 'P÷Q', 'reading': 18},
            {'en': 'Division Algorithm & Remainder Theorem', 'tr': 'Bölme Algoritması & Kalan Teoremi', 'hero_en': "<span class='accent'>REMAINDER</span> THEOREM", 'hero_tr': "<span class='accent'>KALAN</span> TEOREMİ", 'desc_en': "P(x) = Q(x)·D(x) + R(x); Bezout's identity; synthetic division.", 'desc_tr': "P(x) = Q(x)·D(x) + R(x); Bezout özdeşliği; sentetik bölme.", 'deco': 'P(a)=R', 'reading': 18},
            {'en': 'Factoring Techniques', 'tr': 'Çarpanlara Ayırma Teknikleri', 'hero_en': "<span class='accent'>FACTORING</span>", 'hero_tr': "<span class='accent'>ÇARPANLARA AYIRMA</span>", 'desc_en': "Common factor, grouping, special products, rational root theorem.", 'desc_tr': "Ortak çarpan, gruplama, özel çarpımlar, rasyonel kök teoremi.", 'deco': '(x-r)', 'reading': 18},
            {'en': 'Identities & Binomial Expansion', 'tr': 'Özdeşlikler & Binom Açılımı', 'hero_en': "<span class='accent'>BINOMIAL</span> EXPANSION", 'hero_tr': "<span class='accent'>BİNOM</span> AÇILIMI", 'desc_en': "(a+b)², (a-b)³, (a+b)ⁿ; Pascal triangle; binomial coefficients.", 'desc_tr': "(a+b)², (a-b)³, (a+b)ⁿ; Pascal üçgeni; binom katsayıları.", 'deco': '(a+b)ⁿ', 'reading': 18},
            # ----- Denklemler (8 ders) L52-L59 -----
            {'en': 'Linear Equations & Inequalities', 'tr': 'Birinci Derece Denklem & Eşitsizlik', 'hero_en': "<span class='accent'>LINEAR</span> EQUATIONS", 'hero_tr': "<span class='accent'>BİRİNCİ DERECE</span>", 'desc_en': "ax + b = 0 solving techniques, word problems.", 'desc_tr': "ax + b = 0 çözüm teknikleri, kelime problemleri.", 'deco': 'ax+b=0', 'reading': 16},
            {'en': 'Systems of Linear Equations', 'tr': 'Doğrusal Denklem Sistemleri', 'hero_en': "LINEAR <span class='accent'>SYSTEMS</span>", 'hero_tr': "DOĞRUSAL <span class='accent'>SİSTEMLER</span>", 'desc_en': "Substitution, elimination, geometric interpretation (intersections).", 'desc_tr': "Yerine koyma, yok etme, geometrik yorum (kesişimler).", 'deco': '2x2', 'reading': 18},
            {'en': 'Quadratic Equations — Formula', 'tr': 'İkinci Derece Denklem — Formül', 'hero_en': "<span class='accent'>QUADRATIC</span> FORMULA", 'hero_tr': "<span class='accent'>KARESEL</span> FORMÜL", 'desc_en': "ax² + bx + c = 0; discriminant; quadratic formula derivation.", 'desc_tr': "ax² + bx + c = 0; diskriminant; karesel formül türetimi.", 'deco': 'b²-4ac', 'reading': 18},
            {'en': 'Quadratic Roots & Vieta', 'tr': 'Karesel Kökler & Vieta', 'hero_en': "ROOTS &amp; <span class='accent'>VIETA</span>", 'hero_tr': "KÖKLER &amp; <span class='accent'>VIETA</span>", 'desc_en': "Sum/product of roots, Vieta formulas, root structures.", 'desc_tr': "Köklerin toplamı/çarpımı, Vieta formülleri, kök yapıları.", 'deco': 'x₁+x₂', 'reading': 16},
            {'en': 'Quadratic Inequalities & Parabola', 'tr': 'Karesel Eşitsizlikler & Parabol', 'hero_en': "QUADRATIC <span class='accent'>INEQUALITIES</span>", 'hero_tr': "KARESEL <span class='accent'>EŞİTSİZLİK</span>", 'desc_en': "ax² + bx + c &gt; 0 solving, parabola graph, sign table.", 'desc_tr': "ax² + bx + c &gt; 0 çözümü, parabol grafiği, işaret tablosu.", 'deco': 'y>0', 'reading': 18},
            {'en': 'Higher-Degree Equations', 'tr': 'Yüksek Dereceli Denklemler', 'hero_en': "HIGHER-DEGREE <span class='accent'>EQUATIONS</span>", 'hero_tr': "YÜKSEK DERECELİ <span class='accent'>DENKLEM</span>", 'desc_en': "Rational root theorem, factoring strategies, complex roots.", 'desc_tr': "Rasyonel kök teoremi, çarpanlara ayırma stratejileri, karmaşık kökler.", 'deco': 'P(x)=0', 'reading': 18},
            {'en': 'Radical & Exponential Equations', 'tr': 'Köklü & Üstel Denklemler', 'hero_en': "RADICAL &amp; <span class='accent'>EXP</span> EQUATIONS", 'hero_tr': "KÖKLÜ &amp; <span class='accent'>ÜSTEL</span> DENKLEM", 'desc_en': "Square/cube root equations, exponential solving techniques.", 'desc_tr': "Kare/küp kök denklemleri, üstel çözüm teknikleri.", 'deco': '√x=a', 'reading': 16},
            {'en': 'Absolute Value Equations', 'tr': 'Modüllü Denklemler', 'hero_en': "<span class='accent'>ABSOLUTE VALUE</span>", 'hero_tr': "<span class='accent'>MUTLAK DEĞER</span>", 'desc_en': "|f(x)| = a, |f(x)| = |g(x)|, case analysis approach.", 'desc_tr': "|f(x)| = a, |f(x)| = |g(x)|, durum analiz yaklaşımı.", 'deco': '|x|=a', 'reading': 14},
            # ----- Eşitsizlikler (3 ders) L60-L62 -----
            {'en': 'Inequality Basics', 'tr': 'Eşitsizlik Temelleri', 'hero_en': "INEQUALITY <span class='accent'>BASICS</span>", 'hero_tr': "EŞİTSİZLİK <span class='accent'>TEMELLERİ</span>", 'desc_en': "Properties, number line solutions, interval notation.", 'desc_tr': "Özellikler, sayı doğrusunda çözümler, aralık gösterimi.", 'deco': 'a<x<b', 'reading': 14},
            {'en': 'Rational Inequalities', 'tr': 'Rasyonel Eşitsizlikler', 'hero_en': "<span class='accent'>RATIONAL</span> INEQUALITIES", 'hero_tr': "<span class='accent'>RASYONEL</span> EŞİTSİZLİKLER", 'desc_en': "P(x)/Q(x) &gt; 0; sign table method; critical points.", 'desc_tr': "P(x)/Q(x) &gt; 0; işaret tablosu yöntemi; kritik noktalar.", 'deco': 'P/Q', 'reading': 16},
            {'en': 'Absolute Value Inequalities', 'tr': 'Mutlak Değerli Eşitsizlikler', 'hero_en': "|<span class='accent'>x</span>| INEQUALITIES", 'hero_tr': "|<span class='accent'>x</span>| EŞİTSİZLİK", 'desc_en': "|f(x)| &lt; a, |f(x)| &gt; a — case analysis, geometric interpretation.", 'desc_tr': "|f(x)| &lt; a, |f(x)| &gt; a — durum analizi, geometrik yorum.", 'deco': '|x|<3', 'reading': 16},
            # ===== FAZ 3c (45 ders) — L63-L107 =====
            # ----- Diziler & Seriler (5 ders) L63-L67 -----
            {'en': 'Arithmetic Sequences', 'tr': 'Aritmetik Diziler', 'hero_en': "ARITHMETIC <span class='accent'>SEQUENCES</span>", 'hero_tr': "ARİTMETİK <span class='accent'>DİZİLER</span>", 'desc_en': "Common difference d, general term aₙ = a₁+(n-1)d, applications.", 'desc_tr': "Ortak fark d, genel terim aₙ = a₁+(n-1)d, uygulamalar.", 'deco': 'a+(n-1)d', 'reading': 16},
            {'en': 'Geometric Sequences', 'tr': 'Geometrik Diziler', 'hero_en': "GEOMETRIC <span class='accent'>SEQUENCES</span>", 'hero_tr': "GEOMETRİK <span class='accent'>DİZİLER</span>", 'desc_en': "Common ratio r, general term aₙ = a₁·r^(n-1), compound interest.", 'desc_tr': "Ortak çarpan r, genel terim aₙ = a₁·r^(n-1), bileşik faiz.", 'deco': 'a·rⁿ⁻¹', 'reading': 16},
            {'en': 'Sum Formulas (Σ)', 'tr': 'Toplam Formülleri (Σ)', 'hero_en': "SUM <span class='accent'>FORMULAS</span>", 'hero_tr': "TOPLAM <span class='accent'>FORMÜLLERİ</span>", 'desc_en': "Σ k, Σ k², Σ k³; arithmetic/geometric series sums; telescoping.", 'desc_tr': "Σ k, Σ k², Σ k³; aritmetik/geometrik seri toplamı; teleskopik.", 'deco': 'Σ k=n(n+1)/2', 'reading': 18},
            {'en': 'Infinite Geometric Series', 'tr': 'Sonsuz Geometrik Seriler', 'hero_en': "<span class='accent'>INFINITE</span> SERIES", 'hero_tr': "<span class='accent'>SONSUZ</span> SERİLER", 'desc_en': "S = a/(1-r) when |r|<1; convergence; repeating decimals.", 'desc_tr': "|r|<1 iken S = a/(1-r); yakınsama; tekrarlı ondalıklar.", 'deco': 'a/(1-r)', 'reading': 16},
            {'en': 'Sequences: Limit, Monotonic, Bounded', 'tr': 'Diziler: Limit, Monoton, Sınırlı', 'hero_en': "SEQUENCE <span class='accent'>LIMITS</span>", 'hero_tr': "DİZİ <span class='accent'>LİMİTLERİ</span>", 'desc_en': "lim aₙ, monotonic + bounded ⇒ convergent; recursive sequences.", 'desc_tr': "lim aₙ, monoton + sınırlı ⇒ yakınsak; özyinelemeli diziler.", 'deco': 'lim aₙ', 'reading': 18},
            # ----- Karmaşık Sayılar (4 ders) L68-L71 -----
            {'en': 'Complex Numbers: Introduction', 'tr': 'Karmaşık Sayılar: Giriş', 'hero_en': "COMPLEX <span class='accent'>NUMBERS</span>", 'hero_tr': "KARMAŞIK <span class='accent'>SAYILAR</span>", 'desc_en': "i² = -1, a+bi form, complex plane (Argand diagram).", 'desc_tr': "i² = -1, a+bi formu, karmaşık düzlem (Argand diyagramı).", 'deco': 'a+bi', 'reading': 16},
            {'en': 'Complex Arithmetic & Conjugate', 'tr': 'Karmaşık İşlemler & Eşlenik', 'hero_en': "COMPLEX <span class='accent'>ARITHMETIC</span>", 'hero_tr': "KARMAŞIK <span class='accent'>İŞLEMLER</span>", 'desc_en': "Addition, multiplication, division via conjugate, properties.", 'desc_tr': "Toplama, çarpma, eşlenik ile bölme, özellikler.", 'deco': 'z·z̄', 'reading': 16},
            {'en': 'Modulus, Argument, Polar Form', 'tr': 'Modül, Argüman, Kutupsal Form', 'hero_en': "POLAR <span class='accent'>FORM</span>", 'hero_tr': "KUTUPSAL <span class='accent'>FORM</span>", 'desc_en': "|z|, arg(z), z = r(cos θ + i sin θ), Euler form r·e^(iθ).", 'desc_tr': "|z|, arg(z), z = r(cos θ + i sin θ), Euler formu r·e^(iθ).", 'deco': 're^(iθ)', 'reading': 18},
            {'en': "De Moivre & Roots of Unity", 'tr': 'De Moivre & Birim Kökler', 'hero_en': "DE MOIVRE &amp; <span class='accent'>ROOTS</span>", 'hero_tr': "DE MOIVRE &amp; <span class='accent'>KÖKLER</span>", 'desc_en': "(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ; n-th roots of complex numbers.", 'desc_tr': "(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ; karmaşık sayıların n. dereceden kökleri.", 'deco': 'zⁿ', 'reading': 18},
            # ----- Matris & Determinant (4 ders) L72-L75 -----
            {'en': 'Matrix Definition & Operations', 'tr': 'Matris Tanımı & İşlemler', 'hero_en': "MATRIX <span class='accent'>BASICS</span>", 'hero_tr': "MATRİS <span class='accent'>TEMELLERİ</span>", 'desc_en': "m×n matrix, addition, scalar multiplication, matrix multiplication.", 'desc_tr': "m×n matris, toplama, skaler çarpma, matris çarpımı.", 'deco': '[aᵢⱼ]', 'reading': 16},
            {'en': 'Determinants (2×2, 3×3)', 'tr': 'Determinantlar (2×2, 3×3)', 'hero_en': "<span class='accent'>DETERMINANTS</span>", 'hero_tr': "<span class='accent'>DETERMİNANTLAR</span>", 'desc_en': "2×2 det, 3×3 Sarrus rule, cofactor expansion, properties.", 'desc_tr': "2×2 det, 3×3 Sarrus kuralı, kofaktör açılımı, özellikler.", 'deco': '|A|', 'reading': 18},
            {'en': 'Inverse Matrix & Linear Systems', 'tr': 'Ters Matris & Doğrusal Sistemler', 'hero_en': "<span class='accent'>INVERSE</span> MATRIX", 'hero_tr': "<span class='accent'>TERS</span> MATRİS", 'desc_en': "A⁻¹ via adjugate; solving AX = B by X = A⁻¹B.", 'desc_tr': "Ek matris ile A⁻¹; AX = B çözümü X = A⁻¹B.", 'deco': 'A⁻¹', 'reading': 18},
            {'en': "Cramer's Rule", 'tr': 'Cramer Kuralı', 'hero_en': "<span class='accent'>CRAMER'S</span> RULE", 'hero_tr': "<span class='accent'>CRAMER</span> KURALI", 'desc_en': "xᵢ = det(Aᵢ)/det(A) for solving n×n systems with unique solution.", 'desc_tr': "n×n tek çözümlü sistemler için xᵢ = det(Aᵢ)/det(A).", 'deco': 'xᵢ=Δᵢ/Δ', 'reading': 16},
            # ----- Analitik Geometri (6 ders) L76-L81 -----
            {'en': 'Coordinate Plane & Distance', 'tr': 'Koordinat Düzlemi & Uzaklık', 'hero_en': "COORD <span class='accent'>PLANE</span>", 'hero_tr': "KOORDİNAT <span class='accent'>DÜZLEMİ</span>", 'desc_en': "Distance formula, midpoint formula, locus.", 'desc_tr': "Uzaklık formülü, orta nokta formülü, geometrik yer.", 'deco': '√((x₂-x₁)²+...)', 'reading': 16},
            {'en': 'Line Equation', 'tr': 'Doğru Denklemi', 'hero_en': "<span class='accent'>LINE</span> EQUATION", 'hero_tr': "<span class='accent'>DOĞRU</span> DENKLEMİ", 'desc_en': "Slope-intercept, point-slope, two-point forms; general Ax+By+C=0.", 'desc_tr': "Eğim-kesim, nokta-eğim, iki nokta formu; genel Ax+By+C=0.", 'deco': 'y=mx+b', 'reading': 16},
            {'en': 'Angle Between Lines, Parallel & Perpendicular', 'tr': 'Doğrular Arası Açı, Paralel & Dik', 'hero_en': "ANGLE &amp; <span class='accent'>SLOPES</span>", 'hero_tr': "AÇI &amp; <span class='accent'>EĞİMLER</span>", 'desc_en': "Parallel m₁=m₂; perpendicular m₁·m₂=-1; angle tan α = |m₁-m₂|/(1+m₁m₂).", 'desc_tr': "Paralel m₁=m₂; dik m₁·m₂=-1; açı tan α = |m₁-m₂|/(1+m₁m₂).", 'deco': 'm₁m₂=-1', 'reading': 18},
            {'en': 'Circle Equation', 'tr': 'Çember Denklemi', 'hero_en': "<span class='accent'>CIRCLE</span> EQUATION", 'hero_tr': "<span class='accent'>ÇEMBER</span> DENKLEMİ", 'desc_en': "(x-a)²+(y-b)²=r²; tangent lines; chord; secant.", 'desc_tr': "(x-a)²+(y-b)²=r²; teğet doğrular; kiriş; kesen.", 'deco': '(x-a)²+(y-b)²=r²', 'reading': 18},
            {'en': 'Conics: Ellipse', 'tr': 'Konikler: Elips', 'hero_en': "<span class='accent'>ELLIPSE</span>", 'hero_tr': "<span class='accent'>ELİPS</span>", 'desc_en': "x²/a² + y²/b² = 1; foci; eccentricity; orbital applications.", 'desc_tr': "x²/a² + y²/b² = 1; odaklar; dış merkezlik; yörünge uygulamaları.", 'deco': 'x²/a²+y²/b²=1', 'reading': 18},
            {'en': 'Conics: Parabola & Hyperbola', 'tr': 'Konikler: Parabol & Hiperbol', 'hero_en': "PARABOLA &amp; <span class='accent'>HYPERBOLA</span>", 'hero_tr': "PARABOL &amp; <span class='accent'>HİPERBOL</span>", 'desc_en': "y²=4px parabola; x²/a²-y²/b²=1 hyperbola; directrix and asymptotes.", 'desc_tr': "y²=4px parabol; x²/a²-y²/b²=1 hiperbol; doğrultman ve asimptotlar.", 'deco': 'y²=4px', 'reading': 18},
            # ----- Geometri (12 ders) L82-L93 -----
            {'en': 'Angles & Triangle Basics', 'tr': 'Açılar & Üçgen Temelleri', 'hero_en': "ANGLE &amp; <span class='accent'>TRIANGLE</span>", 'hero_tr': "AÇI &amp; <span class='accent'>ÜÇGEN</span>", 'desc_en': "Angle types, parallel lines & transversals, triangle inequality.", 'desc_tr': "Açı türleri, paralel doğrular & kesenler, üçgen eşitsizliği.", 'deco': '∠ABC', 'reading': 14},
            {'en': 'Triangle Similarity', 'tr': 'Üçgende Benzerlik', 'hero_en': "TRIANGLE <span class='accent'>SIMILARITY</span>", 'hero_tr': "ÜÇGEN <span class='accent'>BENZERLİĞİ</span>", 'desc_en': "AA, SSS, SAS similarity tests; ratio of corresponding sides.", 'desc_tr': "AA, SSS, SAS benzerlik testleri; karşılıklı kenar oranı.", 'deco': '△ ~ △', 'reading': 16},
            {'en': 'Triangle Metric Relations', 'tr': 'Üçgende Metrik Bağıntılar', 'hero_en': "METRIC <span class='accent'>RELATIONS</span>", 'hero_tr': "METRİK <span class='accent'>BAĞINTILAR</span>", 'desc_en': "Right triangle altitude theorem, Euclidean relations.", 'desc_tr': "Dik üçgende yükseklik teoremi, Öklid bağıntıları.", 'deco': 'h²=p·q', 'reading': 16},
            {'en': 'Pythagorean Generalization (Law of Cosines)', 'tr': 'Pisagor Genelleştirme (Kosinüs Teoremi)', 'hero_en': "<span class='accent'>LAW</span> OF COSINES", 'hero_tr': "<span class='accent'>KOSİNÜS</span> TEOREMİ", 'desc_en': "c²=a²+b²-2ab cos C; generalizes Pythagoras to any triangle.", 'desc_tr': "c²=a²+b²-2ab cos C; Pisagor'u her üçgene genelleştirir.", 'deco': 'c²=a²+b²-2ab·cos', 'reading': 18},
            {'en': 'Quadrilaterals', 'tr': 'Dörtgenler', 'hero_en': "<span class='accent'>QUADRILATERALS</span>", 'hero_tr': "<span class='accent'>DÖRTGENLER</span>", 'desc_en': "Parallelogram, rectangle, rhombus, square, trapezoid — properties.", 'desc_tr': "Paralelkenar, dikdörtgen, eşkenar dörtgen, kare, yamuk — özellikler.", 'deco': '▱', 'reading': 16},
            {'en': 'Inscribed Angles in Circles', 'tr': 'Çember İçi Açılar', 'hero_en': "INSCRIBED <span class='accent'>ANGLES</span>", 'hero_tr': "ÇEMBERDE <span class='accent'>AÇILAR</span>", 'desc_en': "Central, inscribed, tangent-chord angles; cyclic quadrilateral.", 'desc_tr': "Merkez, çevre, teğet-kiriş açıları; kirişler dörtgeni.", 'deco': '∠=½arc', 'reading': 16},
            {'en': 'Perimeter & Area', 'tr': 'Çevre & Alan', 'hero_en': "<span class='accent'>PERIMETER</span> &amp; AREA", 'hero_tr': "<span class='accent'>ÇEVRE</span> &amp; ALAN", 'desc_en': "Triangle, quadrilateral, circle area formulas; Heron's formula.", 'desc_tr': "Üçgen, dörtgen, çember alan formülleri; Heron formülü.", 'deco': 'A=½b·h', 'reading': 16},
            {'en': 'Solid Geometry: Prisms', 'tr': 'Katı Cisimler: Prizmalar', 'hero_en': "<span class='accent'>PRISMS</span>", 'hero_tr': "<span class='accent'>PRİZMALAR</span>", 'desc_en': "Cube, rectangular prism — surface area, volume.", 'desc_tr': "Küp, dikdörtgenler prizması — yüzey alan, hacim.", 'deco': 'V=a·b·c', 'reading': 16},
            {'en': 'Cylinder, Cone, Sphere', 'tr': 'Silindir, Koni, Küre', 'hero_en': "CYLINDER · CONE · <span class='accent'>SPHERE</span>", 'hero_tr': "SİLİNDİR · KONİ · <span class='accent'>KÜRE</span>", 'desc_en': "πr²h, (1/3)πr²h, (4/3)πr³ — circular solid volumes/surfaces.", 'desc_tr': "πr²h, (1/3)πr²h, (4/3)πr³ — yuvarlak katıların hacim/alanı.", 'deco': '4πr²', 'reading': 18},
            {'en': 'Vectors (Geometric)', 'tr': 'Vektörler (Geometrik)', 'hero_en': "<span class='accent'>VECTORS</span>", 'hero_tr': "<span class='accent'>VEKTÖRLER</span>", 'desc_en': "Magnitude, direction, components, dot product, geometry applications.", 'desc_tr': "Büyüklük, yön, bileşenler, iç çarpım, geometri uygulamaları.", 'deco': '⃗v·⃗u', 'reading': 18},
            {'en': 'Transformations (Translation, Rotation, Reflection)', 'tr': 'Dönüşümler (Öteleme, Döndürme, Yansıma)', 'hero_en': "<span class='accent'>TRANSFORMATIONS</span>", 'hero_tr': "<span class='accent'>DÖNÜŞÜMLER</span>", 'desc_en': "Rigid motions of the plane, composition, symmetry groups.", 'desc_tr': "Düzlem rijit hareketleri, bileşke, simetri grupları.", 'deco': '↻ ↔ ⇆', 'reading': 16},
            {'en': 'Locus & Geometric Construction', 'tr': 'Geometrik Yer & İnşa', 'hero_en': "<span class='accent'>LOCUS</span>", 'hero_tr': "GEOMETRİK <span class='accent'>YER</span>", 'desc_en': "Sets of points satisfying conditions; classical compass/straightedge.", 'desc_tr': "Koşulları sağlayan nokta kümeleri; klasik pergel/cetvel.", 'deco': '·{P|d=r}', 'reading': 16},
            # ----- Olasılık & İstatistik (14 ders) L94-L107 -----
            {'en': 'Probability Basics', 'tr': 'Olasılık Temelleri', 'hero_en': "PROBABILITY <span class='accent'>BASICS</span>", 'hero_tr': "OLASILIK <span class='accent'>TEMELLERİ</span>", 'desc_en': "Sample space, event, classical probability P(A)=|A|/|S|.", 'desc_tr': "Örnek uzay, olay, klasik olasılık P(A)=|A|/|S|.", 'deco': 'P(A)', 'reading': 14},
            {'en': 'Independent & Dependent Events', 'tr': 'Bağımsız & Bağımlı Olaylar', 'hero_en': "INDEP. &amp; <span class='accent'>DEP.</span> EVENTS", 'hero_tr': "BAĞIMSIZ &amp; <span class='accent'>BAĞIMLI</span>", 'desc_en': "P(A∩B)=P(A)P(B) for independent; addition/complement rules.", 'desc_tr': "Bağımsız için P(A∩B)=P(A)P(B); toplama/tümleme kuralları.", 'deco': 'P(A∩B)', 'reading': 16},
            {'en': 'Conditional Probability', 'tr': 'Koşullu Olasılık', 'hero_en': "<span class='accent'>CONDITIONAL</span>", 'hero_tr': "<span class='accent'>KOŞULLU</span>", 'desc_en': "P(A|B) = P(A∩B)/P(B); tree diagrams; total probability.", 'desc_tr': "P(A|B) = P(A∩B)/P(B); ağaç diyagramları; toplam olasılık.", 'deco': 'P(A|B)', 'reading': 16},
            {'en': "Bayes' Theorem", 'tr': 'Bayes Teoremi', 'hero_en': "<span class='accent'>BAYES'</span> THEOREM", 'hero_tr': "<span class='accent'>BAYES</span> TEOREMİ", 'desc_en': "P(A|B) = P(B|A)P(A)/P(B); medical test paradox; spam filtering.", 'desc_tr': "P(A|B) = P(B|A)P(A)/P(B); tıbbi test paradoksu; spam filtresi.", 'deco': 'P(A|B)=...', 'reading': 18},
            {'en': 'Permutations', 'tr': 'Permütasyon', 'hero_en': "<span class='accent'>PERMUTATIONS</span>", 'hero_tr': "<span class='accent'>PERMÜTASYON</span>", 'desc_en': "n! orderings, nPr = n!/(n-r)!, circular permutations.", 'desc_tr': "n! sıralama, nPr = n!/(n-r)!, dairesel permütasyon.", 'deco': 'n!', 'reading': 16},
            {'en': 'Combinations', 'tr': 'Kombinasyon', 'hero_en': "<span class='accent'>COMBINATIONS</span>", 'hero_tr': "<span class='accent'>KOMBİNASYON</span>", 'desc_en': "nCr = n!/(r!(n-r)!); Pascal triangle; binomial coefficients.", 'desc_tr': "nCr = n!/(r!(n-r)!); Pascal üçgeni; binom katsayıları.", 'deco': 'C(n,r)', 'reading': 16},
            {'en': 'Binomial Distribution', 'tr': 'Binom Dağılımı', 'hero_en': "<span class='accent'>BINOMIAL</span> DIST.", 'hero_tr': "<span class='accent'>BİNOM</span> DAĞ.", 'desc_en': "P(X=k) = C(n,k)pᵏ(1-p)ⁿ⁻ᵏ; n Bernoulli trials.", 'desc_tr': "P(X=k) = C(n,k)pᵏ(1-p)ⁿ⁻ᵏ; n Bernoulli denemesi.", 'deco': 'B(n,p)', 'reading': 16},
            {'en': 'Expected Value & Variance', 'tr': 'Beklenen Değer & Varyans', 'hero_en': "<span class='accent'>EXPECTED</span> VALUE", 'hero_tr': "<span class='accent'>BEKLENEN</span> DEĞER", 'desc_en': "E[X] = Σ xᵢP(xᵢ), Var(X) = E[X²]-E[X]²; standard deviation.", 'desc_tr': "E[X] = Σ xᵢP(xᵢ), Var(X) = E[X²]-E[X]²; standart sapma.", 'deco': 'E[X]', 'reading': 18},
            {'en': 'Statistics Basics: Mean, Median, Mode', 'tr': 'İstatistik Temelleri: Ortalama, Medyan, Mod', 'hero_en': "MEAN · MEDIAN · <span class='accent'>MODE</span>", 'hero_tr': "ORTALAMA · MEDYAN · <span class='accent'>MOD</span>", 'desc_en': "Central tendency measures; when to use each; skewness intro.", 'desc_tr': "Merkezi eğilim ölçüleri; hangisini ne zaman kullanmalı; çarpıklık girişi.", 'deco': 'x̄ · M · Mo', 'reading': 14},
            {'en': 'Standard Deviation & Quartiles', 'tr': 'Standart Sapma & Çeyrek Sapma', 'hero_en': "STD &amp; <span class='accent'>QUARTILES</span>", 'hero_tr': "STD &amp; <span class='accent'>ÇEYREK</span>", 'desc_en': "σ, IQR, five-number summary, box plot.", 'desc_tr': "σ, IQR, beş-sayı özeti, kutu grafiği.", 'deco': 'σ · IQR', 'reading': 16},
            {'en': 'Histograms & Frequency Distributions', 'tr': 'Histogram & Frekans Dağılımları', 'hero_en': "<span class='accent'>HISTOGRAM</span>", 'hero_tr': "<span class='accent'>HİSTOGRAM</span>", 'desc_en': "Class intervals, frequency tables, relative frequency, cumulative.", 'desc_tr': "Sınıf aralıkları, frekans tabloları, bağıl frekans, birikimli.", 'deco': '▆▇█', 'reading': 14},
            {'en': 'Normal Distribution (Preview)', 'tr': 'Normal Dağılım (Önizleme)', 'hero_en': "<span class='accent'>NORMAL</span> DIST.", 'hero_tr': "<span class='accent'>NORMAL</span> DAĞ.", 'desc_en': "Bell curve N(μ,σ²), 68-95-99.7 rule, z-scores.", 'desc_tr': "Çan eğrisi N(μ,σ²), 68-95-99.7 kuralı, z-skorları.", 'deco': 'N(μ,σ²)', 'reading': 18},
            {'en': 'Data Analysis & Visualization', 'tr': 'Veri Analizi & Görselleştirme', 'hero_en': "<span class='accent'>DATA</span> ANALYSIS", 'hero_tr': "<span class='accent'>VERİ</span> ANALİZİ", 'desc_en': "Reading data, choosing plots, scatter, correlation intuition.", 'desc_tr': "Veri okuma, grafik seçimi, serpilme, korelasyon sezgisi.", 'deco': '~r', 'reading': 16},
            {'en': 'Hypothesis Testing (Preview)', 'tr': 'Hipotez Testi (Önizleme)', 'hero_en': "<span class='accent'>HYPOTHESIS</span> TEST", 'hero_tr': "<span class='accent'>HİPOTEZ</span> TESTİ", 'desc_en': "Null/alternative, p-value intuition, significance threshold.", 'desc_tr': "Null/alternatif hipotez, p-değeri sezgisi, anlamlılık eşiği.", 'deco': 'H₀ vs H₁', 'reading': 18},
        ],
    },
    'control': {
        'name_en': 'Control Theory',
        'name_tr': 'Kontrol Teorisi',
        'short_en': 'Control',
        'short_tr': 'Kontrol',
        'loader': 'CTRL',
        'course_label_en': 'Classical & Modern Control Theory',
        'course_label_tr': 'Klasik ve Modern Kontrol Teorisi',
        'tools': 'NumPy · SciPy · Plotly',
        'sidebar_label_en': 'Control Theory',
        'sidebar_label_tr': 'Kontrol Teorisi',
        'after_track': 'complex',
        'after_track_lessons': 6,
        'after_track_last_title_en': 'Conformal Maps',
        'after_track_last_title_tr': 'Konform Dönüşümler',
        'desc_meta': "PID, state-space, Bode/Nyquist, Lyapunov, root-locus",
        'lessons': [
            {'en': 'System Modeling & Transfer Functions', 'tr': 'Sistem Modelleme & Transfer Fonksiyonları', 'hero_en': "SYSTEM <span class='accent'>MODELING</span>", 'hero_tr': "SİSTEM <span class='accent'>MODELLEME</span>", 'desc_en': "From ODE to transfer function H(s), block diagrams, series/parallel/feedback — <strong>the language of control engineering</strong>.", 'desc_tr': "ODE'den transfer fonksiyonu H(s)'ye, blok diyagramları, seri/paralel/geri besleme — <strong>kontrol mühendisliğinin dili</strong>.", 'deco': "H(s)", 'reading': 24},
            {'en': 'PID Controllers', 'tr': 'PID Kontrolcüleri', 'hero_en': "PID <span class='accent'>CONTROL</span>", 'hero_tr': "PID <span class='accent'>KONTROL</span>", 'desc_en': "Proportional, Integral, Derivative — the workhorse controller. Tuning methods (Ziegler-Nichols), saturation, anti-windup — <strong>industry's most used controller</strong>.", 'desc_tr': "Oransal, İntegral, Türev — iş atı kontrolcü. Ayarlama yöntemleri (Ziegler-Nichols), doyma, anti-windup — <strong>endüstride en çok kullanılan kontrolcü</strong>.", 'deco': "P+I+D", 'reading': 26},
            {'en': 'Bode & Nyquist Analysis', 'tr': 'Bode & Nyquist Analizi', 'hero_en': "BODE &amp; <span class='accent'>NYQUIST</span>", 'hero_tr': "BODE &amp; <span class='accent'>NYQUIST</span>", 'desc_en': "Frequency response, magnitude/phase plots, gain/phase margins, Nyquist stability criterion — <strong>frequency-domain stability</strong>.", 'desc_tr': "Frekans tepkisi, büyüklük/faz grafikleri, kazanç/faz marjları, Nyquist kararlılık kriteri — <strong>frekans-alanı kararlılık</strong>.", 'deco': "20logH", 'reading': 26},
            {'en': 'Root Locus', 'tr': 'Kök Yer Eğrisi', 'hero_en': "ROOT <span class='accent'>LOCUS</span>", 'hero_tr': "KÖK <span class='accent'>YER EĞRİSİ</span>", 'desc_en': "Pole movement vs gain K, design via root placement — <strong>graphical controller design</strong>.", 'desc_tr': "Kazanç K'ya göre kutup hareketi, kök yerleştirme ile tasarım — <strong>grafiksel kontrolcü tasarımı</strong>.", 'deco': "1+KGH", 'reading': 24},
            {'en': 'State-Space Representation', 'tr': 'Durum Uzayı Gösterimi', 'hero_en': "STATE <span class='accent'>SPACE</span>", 'hero_tr': "DURUM <span class='accent'>UZAYI</span>", 'desc_en': "Ẋ = AX + BU, Y = CX + DU. Controllability, observability, eigenvalue placement — <strong>modern control's foundation</strong>.", 'desc_tr': "Ẋ = AX + BU, Y = CX + DU. Kontrol edilebilirlik, gözlemlenebilirlik, özdeğer yerleştirme — <strong>modern kontrolün temeli</strong>.", 'deco': "Ẋ=AX+BU", 'reading': 26},
            {'en': 'Lyapunov Stability', 'tr': 'Lyapunov Kararlılığı', 'hero_en': "LYAPUNOV <span class='accent'>STABILITY</span>", 'hero_tr': "LYAPUNOV <span class='accent'>KARARLILIK</span>", 'desc_en': "Energy-like functions V(x) to prove asymptotic stability without solving the ODE — <strong>the gold standard for nonlinear stability</strong>.", 'desc_tr': "ODE'yi çözmeden asimptotik kararlılığı kanıtlamak için enerji-benzeri V(x) fonksiyonları — <strong>doğrusal olmayan kararlılığın altın standardı</strong>.", 'deco': "V̇(x)<0", 'reading': 26},
            {'en': 'LQR, MPC & Modern Control + RL', 'tr': 'LQR, MPC & Modern Kontrol + RL', 'hero_en': "LQR / <span class='accent'>MPC</span>", 'hero_tr': "LQR / <span class='accent'>MPC</span>", 'desc_en': "Linear Quadratic Regulator, Model Predictive Control, connection to Reinforcement Learning — <strong>optimal control meets ML</strong>.", 'desc_tr': "Doğrusal Karesel Regülatör, Model Öngörülü Kontrol, Pekiştirmeli Öğrenme bağlantısı — <strong>optimal kontrol ML ile buluşuyor</strong>.", 'deco': "min J", 'reading': 26},
        ],
    },
    'diffeq': {
        'name_en': 'Differential Equations',
        'name_tr': 'Diferansiyel Denklemler',
        'short_en': 'Diff Eq',
        'short_tr': 'Diff Eq',
        'loader': 'DIFF',
        'course_label_en': 'Differential Equations for Engineers & ML',
        'course_label_tr': 'Mühendisler ve ML için Diferansiyel Denklemler',
        'tools': 'NumPy · SciPy · Plotly',
        'sidebar_label_en': 'Diff Equations',
        'sidebar_label_tr': 'Diferansiyel Denk.',
        'after_track': 'fourier',  # insert in sidebar after this track
        'after_track_lessons': 8,   # number of lessons in 'after_track' for prev-link
        'after_track_last_title_en': 'Spectral Methods',
        'after_track_last_title_tr': 'Spektral Yöntemler',
        'desc_meta': "ODE, PDE, SDE, Neural ODE",
        'lessons': [
            {'en': 'ODE Fundamentals', 'tr': 'ODE Temelleri', 'hero_en': "ODE <span class='accent'>FUNDAMENTALS</span>", 'hero_tr': "ODE <span class='accent'>TEMELLERİ</span>", 'desc_en': "First-order, separable, exact, integrating factors — the <strong>language of change rates</strong>.", 'desc_tr': "Birinci mertebe, ayrılabilir, tam, integrasyon çarpanları — <strong>değişim oranlarının dili</strong>.", 'deco': "dy/dx", 'reading': 22},
            {'en': 'Second-Order Linear ODEs', 'tr': 'İkinci Mertebe Lineer ODE', 'hero_en': "SECOND-ORDER <span class='accent'>ODE</span>", 'hero_tr': "İKİNCİ MERTEBE <span class='accent'>ODE</span>", 'desc_en': "Constant-coefficient, characteristic equation, damped oscillation — <strong>physics of springs and circuits</strong>.", 'desc_tr': "Sabit katsayılı, karakteristik denklem, sönümlü salınım — <strong>yay ve devre fiziği</strong>.", 'deco': "y\"+by'+cy", 'reading': 24},
            {'en': 'ODE Systems & Matrix Form', 'tr': 'ODE Sistemleri & Matris Formu', 'hero_en': "ODE <span class='accent'>SYSTEMS</span>", 'hero_tr': "ODE <span class='accent'>SİSTEMLERİ</span>", 'desc_en': "Coupled equations, eigenvalue solutions, phase portraits — <strong>multivariate dynamics</strong>.", 'desc_tr': "Bağlı denklemler, özdeğer çözümleri, faz portreleri — <strong>çok değişkenli dinamik</strong>.", 'deco': "Ẋ=AX", 'reading': 24},
            {'en': 'Partial Differential Equations (PDE)', 'tr': 'Kısmi Diferansiyel Denklemler (PDE)', 'hero_en': "PDE <span class='accent'>BASICS</span>", 'hero_tr': "PDE <span class='accent'>TEMELLERİ</span>", 'desc_en': "Heat, wave, Laplace equations — <strong>physics of fields and continuous media</strong>.", 'desc_tr': "Isı, dalga, Laplace denklemleri — <strong>alan ve sürekli ortam fiziği</strong>.", 'deco': "∂u/∂t", 'reading': 26},
            {'en': 'Numerical ODE Methods', 'tr': 'Sayısal ODE Yöntemleri', 'hero_en': "NUMERICAL <span class='accent'>SOLVERS</span>", 'hero_tr': "SAYISAL <span class='accent'>ÇÖZÜCÜLER</span>", 'desc_en': "Euler, Runge-Kutta (RK4), adaptive methods — <strong>simulating dynamical systems</strong>.", 'desc_tr': "Euler, Runge-Kutta (RK4), adaptif yöntemler — <strong>dinamik sistem simülasyonu</strong>.", 'deco': "RK4", 'reading': 22},
            {'en': 'Stochastic Differential Equations (SDE)', 'tr': 'Stokastik Diferansiyel Denklemler (SDE)', 'hero_en': "SDE &amp; <span class='accent'>BROWNIAN</span>", 'hero_tr': "SDE &amp; <span class='accent'>BROWNIAN</span>", 'desc_en': "Brownian motion, Itō calculus, drift-diffusion — <strong>the math behind Diffusion models</strong>.", 'desc_tr': "Brownian hareket, Itō hesabı, drift-difüzyon — <strong>Diffusion modellerin matematiği</strong>.", 'deco': "dX=μdt+σdW", 'reading': 26},
            {'en': 'Variational PDE & Calculus of Variations', 'tr': 'Varyasyonel PDE & Varyasyon Hesabı', 'hero_en': "VARIATIONAL <span class='accent'>METHODS</span>", 'hero_tr': "VARYASYONEL <span class='accent'>YÖNTEMLER</span>", 'desc_en': "Euler-Lagrange, action principle, weak formulations — <strong>foundation of physics and VAEs</strong>.", 'desc_tr': "Euler-Lagrange, hareket ilkesi, zayıf formülasyonlar — <strong>fizik ve VAE'lerin temeli</strong>.", 'deco': "δS=0", 'reading': 24},
            {'en': 'Neural ODEs, Neural SDEs & Flow Matching', 'tr': 'Neural ODE, Neural SDE & Flow Matching', 'hero_en': "NEURAL <span class='accent'>DIFFEQ</span>", 'hero_tr': "NEURAL <span class='accent'>DIFFEQ</span>", 'desc_en': "Continuous-depth networks, normalizing flows, score-based diffusion — <strong>where ODEs meet deep learning</strong>.", 'desc_tr': "Sürekli derinlikli ağlar, normalizing flow'lar, score-tabanlı diffusion — <strong>ODE'lerin derin öğrenmeyle buluştuğu yer</strong>.", 'deco': "f(z,t)", 'reading': 28},
        ],
    },
    'markov': {
        'name_en': 'Markov Chains & MCMC',
        'name_tr': 'Markov Zincirleri & MCMC',
        'short_en': 'Markov',
        'short_tr': 'Markov',
        'loader': 'MKRV',
        'course_label_en': 'Markov Chains, HMM & MCMC',
        'course_label_tr': 'Markov Zincirleri, HMM & MCMC',
        'tools': 'NumPy · SciPy · Plotly',
        'sidebar_label_en': 'Markov &amp; MCMC',
        'sidebar_label_tr': 'Markov &amp; MCMC',
        'after_track': 'diffeq',
        'after_track_lessons': 8,
        'after_track_last_title_en': 'Neural ODE',
        'after_track_last_title_tr': 'Neural ODE',
        'desc_meta': "Markov, HMM, MCMC, Variational Inference",
        'lessons': [
            {'en': 'Markov Chain Fundamentals', 'tr': 'Markov Zinciri Temelleri', 'hero_en': "MARKOV <span class='accent'>CHAINS</span>", 'hero_tr': "MARKOV <span class='accent'>ZİNCİRLERİ</span>", 'desc_en': "States, transitions, transition matrices, stationary distributions — <strong>memoryless random processes</strong>.", 'desc_tr': "Durumlar, geçişler, geçiş matrisleri, durağan dağılımlar — <strong>belleksiz rastgele süreçler</strong>.", 'deco': "P(s'|s)", 'reading': 22},
            {'en': 'Hidden Markov Models (HMM)', 'tr': 'Saklı Markov Modelleri (HMM)', 'hero_en': "HIDDEN <span class='accent'>MARKOV</span>", 'hero_tr': "SAKLI <span class='accent'>MARKOV</span>", 'desc_en': "Observations vs hidden states, Forward-Backward, Viterbi — <strong>classical sequence modeling</strong>.", 'desc_tr': "Gözlem - saklı durum ayrımı, Forward-Backward, Viterbi — <strong>klasik dizi modelleme</strong>.", 'deco': "P(o,s)", 'reading': 24},
            {'en': 'Monte Carlo & MCMC Foundations', 'tr': 'Monte Carlo & MCMC Temelleri', 'hero_en': "MONTE CARLO &amp; <span class='accent'>MCMC</span>", 'hero_tr': "MONTE CARLO &amp; <span class='accent'>MCMC</span>", 'desc_en': "Sampling from intractable distributions, Metropolis-Hastings, Gibbs — <strong>computational Bayesian inference</strong>.", 'desc_tr': "Çözümsüz dağılımlardan örnekleme, Metropolis-Hastings, Gibbs — <strong>hesaplamalı Bayesçi çıkarım</strong>.", 'deco': "π(x)", 'reading': 24},
            {'en': 'Hamiltonian Monte Carlo (HMC) & NUTS', 'tr': 'Hamiltonian Monte Carlo (HMC) & NUTS', 'hero_en': "HMC &amp; <span class='accent'>NUTS</span>", 'hero_tr': "HMC &amp; <span class='accent'>NUTS</span>", 'desc_en': "Physics-inspired sampling using gradients — <strong>the workhorse of modern probabilistic programming (Stan, PyMC, NumPyro)</strong>.", 'desc_tr': "Gradyan kullanan fizik-esinlenmiş örnekleme — <strong>modern olasılıksal programlamanın can damarı (Stan, PyMC, NumPyro)</strong>.", 'deco': "∇log π", 'reading': 24},
            {'en': 'Variational Inference & ELBO', 'tr': 'Varyasyonel Çıkarım & ELBO', 'hero_en': "VARIATIONAL <span class='accent'>INFERENCE</span>", 'hero_tr': "VARYASYONEL <span class='accent'>ÇIKARIM</span>", 'desc_en': "Mean-field, ELBO, KL minimization, reparameterization — <strong>scalable approximate Bayes (VAE foundation)</strong>.", 'desc_tr': "Mean-field, ELBO, KL minimizasyonu, yeniden parametrelendirme — <strong>ölçeklenebilir yaklaşık Bayes (VAE temeli)</strong>.", 'deco': "ELBO", 'reading': 26},
            {'en': 'Bayesian Deep Learning & Modern Apps', 'tr': 'Bayesçi Derin Öğrenme & Modern Uygulamalar', 'hero_en': "BAYESIAN <span class='accent'>DEEP LEARNING</span>", 'hero_tr': "BAYESÇİ <span class='accent'>DERİN ÖĞRENME</span>", 'desc_en': "MC dropout, Bayesian neural nets, RLHF reward modeling, diffusion as Bayesian inference — <strong>uncertainty in modern AI</strong>.", 'desc_tr': "MC dropout, Bayesçi sinir ağları, RLHF ödül modelleme, Bayesçi olarak diffusion — <strong>modern AI'da belirsizlik</strong>.", 'deco': "P(θ|D)", 'reading': 26},
        ],
    },
    'discrete': {
        'name_en': 'Discrete Math & Graph Theory',
        'name_tr': 'Ayrık Matematik & Çizge Teorisi',
        'short_en': 'Discrete',
        'short_tr': 'Ayrık',
        'loader': 'DSCR',
        'course_label_en': 'Discrete Mathematics & Graph Theory',
        'course_label_tr': 'Ayrık Matematik & Çizge Teorisi',
        'tools': 'NumPy · NetworkX · Plotly',
        'sidebar_label_en': 'Discrete &amp; Graphs',
        'sidebar_label_tr': 'Ayrık &amp; Çizge',
        'after_track': 'markov',
        'after_track_lessons': 6,
        'after_track_last_title_en': 'Bayesian DL',
        'after_track_last_title_tr': 'Bayesçi DL',
        'desc_meta': "Combinatorics, graphs, spectral graph theory, GNN basis",
        'lessons': [
            {'en': 'Combinatorics & Counting', 'tr': 'Kombinatorik & Sayma', 'hero_en': "COUNTING &amp; <span class='accent'>COMBINATORICS</span>", 'hero_tr': "SAYMA &amp; <span class='accent'>KOMBİNATORİK</span>", 'desc_en': "Permutations, combinations, binomial coefficients, pigeonhole — <strong>the art of counting without listing</strong>.", 'desc_tr': "Permütasyon, kombinasyon, binom katsayıları, güvercin yuvası — <strong>listelemeden sayma sanatı</strong>.", 'deco': "n!", 'reading': 22},
            {'en': 'Generating Functions & Inclusion-Exclusion', 'tr': 'Üreteç Fonksiyonları & İçerme-Dışlama', 'hero_en': "GENERATING <span class='accent'>FUNCTIONS</span>", 'hero_tr': "ÜRETEÇ <span class='accent'>FONKSİYONLARI</span>", 'desc_en': "Power series for sequences, recurrences solved algebraically, inclusion-exclusion principle — <strong>algebraic combinatorics</strong>.", 'desc_tr': "Dizi için kuvvet serileri, cebirsel olarak çözülen rekürrenler, içerme-dışlama ilkesi — <strong>cebirsel kombinatorik</strong>.", 'deco': "Σaₙxⁿ", 'reading': 22},
            {'en': 'Graph Fundamentals & Traversal', 'tr': 'Çizge Temelleri & Gezme', 'hero_en': "GRAPH <span class='accent'>BASICS</span>", 'hero_tr': "ÇİZGE <span class='accent'>TEMELLERİ</span>", 'desc_en': "Directed/undirected, weighted, BFS, DFS, connectivity, cycles — <strong>structure of relationships</strong>.", 'desc_tr': "Yönlü/yönsüz, ağırlıklı, BFS, DFS, bağlılık, döngüler — <strong>ilişkilerin yapısı</strong>.", 'deco': "V,E", 'reading': 22},
            {'en': 'Graph Algorithms (Dijkstra, MST, Max-Flow)', 'tr': 'Çizge Algoritmaları (Dijkstra, MST, Max-Flow)', 'hero_en': "GRAPH <span class='accent'>ALGORITHMS</span>", 'hero_tr': "ÇİZGE <span class='accent'>ALGORİTMALARI</span>", 'desc_en': "Shortest paths, minimum spanning trees, maximum flow — <strong>workhorses of optimization on networks</strong>.", 'desc_tr': "En kısa yollar, minimum yayılma ağaçları, maksimum akış — <strong>ağ optimizasyonunun can damarları</strong>.", 'deco': "min Σw", 'reading': 24},
            {'en': 'Spectral Graph Theory', 'tr': 'Spektral Çizge Teorisi', 'hero_en': "SPECTRAL <span class='accent'>GRAPHS</span>", 'hero_tr': "SPEKTRAL <span class='accent'>ÇİZGELER</span>", 'desc_en': "Adjacency, Laplacian, Cheeger inequality, spectral clustering — <strong>linear algebra meets graphs (GNN foundation)</strong>.", 'desc_tr': "Komşuluk, Laplacian, Cheeger eşitsizliği, spektral kümeleme — <strong>doğrusal cebir çizgelerle buluşuyor (GNN temeli)</strong>.", 'deco': "L=D-A", 'reading': 26},
            {'en': 'Knowledge Graphs & Dependency Parsing', 'tr': 'Bilgi Grafları & Bağımlılık Ayrıştırma', 'hero_en': "KNOWLEDGE <span class='accent'>GRAPHS</span>", 'hero_tr': "BİLGİ <span class='accent'>GRAFLARI</span>", 'desc_en': "RDF triples, embedding methods (TransE, ComplEx), NLP dependency trees — <strong>structured AI knowledge representation</strong>.", 'desc_tr': "RDF üçlüleri, embedding yöntemleri (TransE, ComplEx), NLP bağımlılık ağaçları — <strong>yapılandırılmış AI bilgi gösterimi</strong>.", 'deco': "(h,r,t)", 'reading': 24},
        ],
    },
    'complex': {
        'name_en': 'Complex Analysis',
        'name_tr': 'Karmaşık Analiz',
        'short_en': 'Complex',
        'short_tr': 'Karmaşık',
        'loader': 'CMPL',
        'course_label_en': 'Complex Analysis for Engineers',
        'course_label_tr': 'Mühendisler için Karmaşık Analiz',
        'tools': 'NumPy · SymPy · Plotly',
        'sidebar_label_en': 'Complex Analysis',
        'sidebar_label_tr': 'Karmaşık Analiz',
        'after_track': 'discrete',
        'after_track_lessons': 6,
        'after_track_last_title_en': 'Knowledge Graphs',
        'after_track_last_title_tr': 'Bilgi Grafları',
        'desc_meta': "Complex numbers, Cauchy-Riemann, residues, conformal maps",
        'lessons': [
            {'en': 'Complex Numbers & Geometric Intuition', 'tr': 'Karmaşık Sayılar & Geometrik Sezgi', 'hero_en': "COMPLEX <span class='accent'>NUMBERS</span>", 'hero_tr': "KARMAŞIK <span class='accent'>SAYILAR</span>", 'desc_en': "z=a+bi as points in 2D, modulus, argument, polar form, multiplication as rotation — <strong>numbers with direction</strong>.", 'desc_tr': "z=a+bi 2D düzlemde noktalar, modül, argüman, polar form, dönme olarak çarpma — <strong>yönü olan sayılar</strong>.", 'deco': "ℂ", 'reading': 22},
            {'en': 'Complex Functions & Continuity', 'tr': 'Karmaşık Fonksiyonlar & Süreklilik', 'hero_en': "COMPLEX <span class='accent'>FUNCTIONS</span>", 'hero_tr': "KARMAŞIK <span class='accent'>FONKSİYONLAR</span>", 'desc_en': "f: ℂ → ℂ, mappings of the plane, limits, continuity — <strong>geometry of complex transformations</strong>.", 'desc_tr': "f: ℂ → ℂ, düzlem dönüşümleri, limitler, süreklilik — <strong>karmaşık dönüşümlerin geometrisi</strong>.", 'deco': "f(z)", 'reading': 22},
            {'en': 'Cauchy-Riemann & Analyticity', 'tr': 'Cauchy-Riemann & Analitiklik', 'hero_en': "CAUCHY-<span class='accent'>RIEMANN</span>", 'hero_tr': "CAUCHY-<span class='accent'>RIEMANN</span>", 'desc_en': "Derivatives, the CR equations, holomorphic = analytic — <strong>why complex differentiability is so strong</strong>.", 'desc_tr': "Türevler, CR denklemleri, holomorfik = analitik — <strong>karmaşık türevlenebilirliğin neden bu kadar güçlü olduğu</strong>.", 'deco': "∂u/∂x", 'reading': 24},
            {'en': 'Complex Integration & Cauchy Theorem', 'tr': 'Karmaşık İntegral & Cauchy Teoremi', 'hero_en': "CAUCHY <span class='accent'>THEOREM</span>", 'hero_tr': "CAUCHY <span class='accent'>TEOREMİ</span>", 'desc_en': "Contour integrals, Cauchy's theorem, integral formula, deformation of contours — <strong>profound integration tools</strong>.", 'desc_tr': "Kontur integralleri, Cauchy teoremi, integral formülü, kontur deformasyonu — <strong>derin integrasyon araçları</strong>.", 'deco': "∮f(z)dz", 'reading': 24},
            {'en': 'Residue Theorem & Real Integrals', 'tr': 'Rezidü Teoremi & Reel İntegraller', 'hero_en': "RESIDUE <span class='accent'>CALCULUS</span>", 'hero_tr': "REZİDÜ <span class='accent'>HESABI</span>", 'desc_en': "Poles, residues, residue theorem — <strong>compute hard real integrals via complex analysis</strong>.", 'desc_tr': "Kutuplar, rezidüler, rezidü teoremi — <strong>karmaşık analizle zor reel integralleri hesaplama</strong>.", 'deco': "Res(f)", 'reading': 24},
            {'en': 'Conformal Maps & Applications', 'tr': 'Konform Dönüşümler & Uygulamaları', 'hero_en': "CONFORMAL <span class='accent'>MAPS</span>", 'hero_tr': "KONFORM <span class='accent'>DÖNÜŞÜMLER</span>", 'desc_en': "Angle-preserving maps, Möbius transforms, applications in fluid dynamics & 2D physics — <strong>geometric power of holomorphic functions</strong>.", 'desc_tr': "Açı koruyan dönüşümler, Möbius dönüşümleri, akışkanlar dinamiği & 2D fizik uygulamaları — <strong>holomorfik fonksiyonların geometrik gücü</strong>.", 'deco': "w=f(z)", 'reading': 22},
        ],
    },
}


# Custom logical display order for tracks (URLs keep natural numbering,
# only sidebar order changes). Keep in sync with CUSTOM_LESSON_ORDER in
# _rebuild_sidebar.py.
CUSTOM_LESSON_ORDER = {
    'matematik': [
        40, 41, 42, 43, 44, 45, 46,             # Fonksiyonlar 7
        47, 48, 49, 50, 51,                      # Polinomlar 5
        52, 53, 54, 55, 56, 57, 58, 59,          # Denklemler 8
        60, 61, 62,                              # Eşitsizlikler 3
        35, 36, 37, 38, 39,                      # Logaritma 5
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,           # Trigonometri 10
        82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93,  # Geometri 12
        76, 77, 78, 79, 80, 81,                  # Analitik 6
        63, 64, 65, 66, 67,                      # Diziler 5
        68, 69, 70, 71,                          # Karmaşık 4
        72, 73, 74, 75,                          # Matris 4
        11, 12, 13, 14, 15, 16,                  # Limit 6
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26,  # Türev 10
        27, 28, 29, 30, 31, 32, 33, 34,          # İntegral 8
        94, 95, 96, 97, 98, 99, 100, 101,        # Olasılık 8
        102, 103, 104, 105, 106, 107,            # İstatistik 6
    ],
}


def build_sidebar_block(track_slug, conf):
    """Build the sidebar HTML block for this track (with placeholders for active markers).
    Uses CUSTOM_LESSON_ORDER[track_slug] if defined to control display order.
    Display number is the position in the sidebar (1, 2, 3...), URL is the original lesson ID."""
    n = len(conf['lessons'])
    # Build (url_index, lesson_dict) list in display order
    if track_slug in CUSTOM_LESSON_ORDER:
        order = CUSTOM_LESSON_ORDER[track_slug]
        seq = [(i, conf['lessons'][i - 1]) for i in order if 1 <= i <= n]
    else:
        seq = list(enumerate(conf['lessons'], start=1))
    items = []
    for pos, (i, L) in enumerate(seq, start=1):
        lbl_en = L['en']
        lbl_tr = L['tr']
        items.append(
            f'              <a href="/tutorials/{track_slug}/{i}" class="sb-lesson __{track_slug.upper().replace("-", "_")}_ACTIVE_{i}__">'
            f'<span class="num">{pos:02d}</span>'
            f'<span class="lbl" data-en="{lbl_en}" data-tr="{lbl_tr}">{lbl_en}</span></a>'
        )
    items_html = '\n'.join(items)
    return f"""          <div class="sb-track open current">
            <div class="sb-track-label" data-en="{conf['sidebar_label_en']}" data-tr="{conf['sidebar_label_tr']}">{conf['sidebar_label_en']}</div>
            <div class="sb-track-items">
{items_html}
            </div>
          </div>
"""


def generate_track(track_slug):
    conf = TRACK_CONFIGS[track_slug]
    n_lessons = len(conf['lessons'])

    # Read fourier template (latest shell with correct sidebar structure)
    TPL = (ROOT / "fourier" / "1.html").read_text(encoding='utf-8')

    # Replace Fourier's "current" sidebar block with the new track's block (only on the first shell pass)
    # The fourier sidebar block in fourier/1.html has class "sb-track open current" and active marker.
    # We need to:
    #   1. Strip the "current"/"active" class from the fourier block
    #   2. Insert the new track block right after fourier block (or after the after_track block)

    # First, strip "open current" from fourier track in the sidebar
    fourier_block_pattern = re.compile(
        r'(          <div class="sb-track) open current(">\s*\n'
        r'            <div class="sb-track-label" data-en="Fourier &amp; Signal".*?</div>\s*\n'
        r'          </div>\s*\n)',
        re.DOTALL
    )
    TPL = fourier_block_pattern.sub(r'\1\2', TPL)
    # Strip 'active' from fourier/N in sidebar
    TPL = re.sub(r'(<a href="/tutorials/fourier/\d+" class="sb-lesson) active(")', r'\1\2', TPL)

    # Build the new track sidebar block
    new_track_block = build_sidebar_block(track_slug, conf)

    # Find where to insert: after fourier block (which ends at "          </div>\n" before ML Mathematics)
    after_track = conf['after_track']

    if after_track == 'fourier':
        insert_pattern = re.compile(
            r'(          <div class="sb-track">\s*\n'
            r'            <div class="sb-track-label" data-en="Fourier &amp; Signal".*?</div>\s*\n'
            r'          </div>\s*\n)',
            re.DOTALL
        )
        TPL = insert_pattern.sub(r'\1' + new_track_block, TPL, count=1)
    else:
        # Insert after the previous custom track (e.g., diffeq → markov)
        prev_label_en = TRACK_CONFIGS[after_track]['sidebar_label_en']
        insert_pattern = re.compile(
            r'(          <div class="sb-track">\s*\n'
            r'            <div class="sb-track-label" data-en="' + re.escape(prev_label_en) + r'".*?</div>\s*\n'
            r'          </div>\s*\n)',
            re.DOTALL
        )
        if not insert_pattern.search(TPL):
            print(f"  WARN: previous track '{after_track}' block not found — inserting after fourier")
            insert_pattern = re.compile(
                r'(          <div class="sb-track">\s*\n'
                r'            <div class="sb-track-label" data-en="Fourier &amp; Signal".*?</div>\s*\n'
                r'          </div>\s*\n)',
                re.DOTALL
            )
        TPL = insert_pattern.sub(r'\1' + new_track_block, TPL, count=1)

    # Create the track output directory
    OUT_DIR = ROOT / track_slug
    OUT_DIR.mkdir(exist_ok=True)

    # Copy shared utility files from fourier
    import shutil
    for util in ['core.js', 'runner.js', 'plotly-fix.js', 'nav.js', 'style.css']:
        src = ROOT / 'fourier' / util
        dst = OUT_DIR / util
        if src.exists() and not dst.exists():
            shutil.copy(src, dst)

    # Per-track CSS (just accent color — math = blue)
    css_path = OUT_DIR / f"{track_slug}.css"
    if not css_path.exists():
        css_path.write_text(f'/* {track_slug}.css — accent only; visual system in /tutorials/lesson-master.css */\n:root {{ --accent: #3b82f6; }}\n', encoding='utf-8')

    # Per-lesson customization
    for i, L in enumerate(conf['lessons'], start=1):
        page = TPL
        n_padded = f"{i:02d}"
        title_en = L['en']
        title_tr = L['tr']
        title_en_plain = title_en.replace('&amp;', '&')

        # Meta block
        new_meta = (
            f'<meta name="viewport" content="width=device-width,initial-scale=1.0">'
            f'<meta name="description" content="{title_en_plain} — Lesson {i} of {conf["course_label_en"]}. Interactive {conf["short_en"]} lesson · {conf["desc_meta"]} · mikailsarpkaya.com">'
            f'<meta property="og:title" content="{title_en_plain} — {conf["name_en"]}">'
            f'<meta property="og:description" content="{title_en_plain} — Lesson {i} of {conf["course_label_en"]}. Interactive {conf["short_en"]} lesson · {conf["desc_meta"]} · mikailsarpkaya.com">'
            f'<meta property="og:type" content="article">'
            f'<meta property="og:url" content="https://mikailsarpkaya.com/tutorials/{track_slug}/{i}">'
            f'<meta property="og:site_name" content="Mikail Sarpkaya">'
            f'<meta property="og:image" content="https://mikailsarpkaya.com/og-image.png">'
            f'<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
            f'<meta name="twitter:image" content="https://mikailsarpkaya.com/og-image.png">'
            f'<meta name="twitter:card" content="summary_large_image">'
            f'<meta name="twitter:title" content="{title_en_plain}">'
            f'<meta name="twitter:description" content="{title_en_plain} — Lesson {i} of {conf["course_label_en"]}.">'
            f'<link rel="canonical" href="https://mikailsarpkaya.com/tutorials/{track_slug}/{i}">'
            f'<link rel="alternate" hreflang="en" href="https://mikailsarpkaya.com/tutorials/{track_slug}/{i}">'
            f'<link rel="alternate" hreflang="tr" href="https://mikailsarpkaya.com/tutorials/{track_slug}/{i}">'
            f'<link rel="alternate" hreflang="x-default" href="https://mikailsarpkaya.com/tutorials/{track_slug}/{i}">'
        )
        page = re.sub(r'<meta name="viewport"[^<]*>.*?<link rel="alternate" hreflang="x-default"[^>]*>', new_meta, page, count=1, flags=re.DOTALL)

        # Title
        page = re.sub(r'<title>[^<]*</title>', f'<title>{title_en} — {conf["short_en"]} — Mikail Sarpkaya</title>', page, count=1)

        # JSON-LD
        new_jsonld = (
            '<script type="application/ld+json">{"@context": "https://schema.org", "@type": "LearningResource", '
            f'"name": "{title_en_plain}", "description": "{title_en_plain} — lesson {i} of {conf["course_label_en"]}.", '
            f'"url": "https://mikailsarpkaya.com/tutorials/{track_slug}/{i}", '
            '"inLanguage": ["en", "tr"], "learningResourceType": "Tutorial", "educationalUse": "self-study", '
            '"isPartOf": {"@type": "Course", '
            f'"name": "{conf["course_label_en"]}", "url": "https://mikailsarpkaya.com/tutorials/{track_slug}/"' '},'
            '"author": {"@type": "Person", "name": "Mikail Sarpkaya", "url": "https://mikailsarpkaya.com/"}, '
            '"publisher": {"@type": "Person", "name": "Mikail Sarpkaya"}}</script>'
        )
        page = re.sub(r'<script type="application/ld\+json">.*?</script>', new_jsonld, page, count=1, flags=re.DOTALL)

        # Loader 4-letter name
        loader_chars = ''.join(f'<span>{c}</span>' for c in conf['loader'])
        page = re.sub(r'<div class="ld-name">.*?</div>', f'<div class="ld-name">{loader_chars}</div>', page, count=1)

        # Sidebar current-title
        cur_title = conf['name_en'].upper()
        page = re.sub(r'<div class="sb-current-title"[^>]*>[^<]*</div>',
                      f'<div class="sb-current-title" data-en="{cur_title}" data-tr="{cur_title}">{cur_title}</div>',
                      page, count=1)
        # current-lesson ttl
        page = re.sub(
            r'<span class="ttl"[^>]*>[^<]*</span>',
            f'<span class="ttl" data-en="{title_en}" data-tr="{title_tr}">{title_en}</span>',
            page, count=1
        )
        # current-lesson num
        page = re.sub(r'(<div class="sb-current-lesson"[^>]*>\s*<span class="num">)\d+(</span>)',
                      r'\g<1>' + n_padded + r'\g<2>', page, count=1)

        # Active markers
        for j in range(1, n_lessons + 1):
            marker = f'__{track_slug.upper().replace("-", "_")}_ACTIVE_{j}__'
            page = page.replace(marker, 'active' if j == i else '')

        # Hero
        page = re.sub(
            r'<div class="topic-eyebrow"[^>]*>[^<]*</div>',
            f'<div class="topic-eyebrow" data-en="Lesson {n_padded} · {conf["short_en"]}" data-tr="Ders {n_padded} · {conf["short_tr"]}">Lesson {n_padded} · {conf["short_en"]}</div>',
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
        # Tools
        page = re.sub(r'<div class="meta-item"><span class="meta-label" data-en="Tools" data-tr="Araçlar">Tools</span>[^<]*</div>',
                      f'<div class="meta-item"><span class="meta-label" data-en="Tools" data-tr="Araçlar">Tools</span> {conf["tools"]}</div>',
                      page, count=1)
        # Deco
        page = re.sub(r'<div class="topic-deco" aria-hidden="true">[^<]*</div>',
                      f'<div class="topic-deco" aria-hidden="true">{L["deco"]}</div>',
                      page, count=1)

        # Lesson content L.js
        page = re.sub(r'<script src="L\d+\.js\?v=1"></script>', f'<script src="L{i}.js?v=1"></script>', page, count=1)
        # Module name
        page = page.replace('FOURIER_L1', f'{track_slug.upper().replace("-", "_")}_L{i}')

        # Lesson nav
        prev_href, prev_lbl_en, prev_lbl_tr = '', '', ''
        next_href, next_lbl_en, next_lbl_tr = '', '', ''
        if i == 1:
            prev_href = f'/tutorials/{after_track}/{conf["after_track_lessons"]}'
            prev_lbl_en = f'← {conf["after_track_last_title_en"]}'
            prev_lbl_tr = f'← {conf["after_track_last_title_tr"]}'
        else:
            prev_href = f'/tutorials/{track_slug}/{i-1}'
            prev_lbl_en = '← ' + conf['lessons'][i-2]['en']
            prev_lbl_tr = '← ' + conf['lessons'][i-2]['tr']
        if i == n_lessons:
            next_href = f'/tutorials/{track_slug}/'
            next_lbl_en = 'Course Complete ✓'
            next_lbl_tr = 'Kurs Tamamlandı ✓'
        else:
            next_href = f'/tutorials/{track_slug}/{i+1}'
            next_lbl_en = f'Next: {conf["lessons"][i]["en"]} →'
            next_lbl_tr = f'Sonraki: {conf["lessons"][i]["tr"]} →'

        new_nav = (
            f'<div class="lesson-nav">'
            f'<a href="{prev_href}" class="ln-btn" data-en="{prev_lbl_en}" data-tr="{prev_lbl_tr}">{prev_lbl_en}</a>'
            f'<span class="ln-center" data-en="Lesson {i} of {n_lessons}" data-tr="Ders {i} / {n_lessons}">Lesson {i} of {n_lessons}</span>'
            f'<a href="{next_href}" class="ln-btn ln-next" data-en="{next_lbl_en}" data-tr="{next_lbl_tr}">{next_lbl_en}</a>'
            f'</div>'
        )
        page = re.sub(r'<div class="lesson-nav">.*?</div>', new_nav, page, count=1, flags=re.DOTALL)

        # Lab Hello
        page = re.sub(r'print\("Hello from [^"]+!"\)', f'print("Hello from {title_en_plain}!")', page, count=1)

        # Write shell
        out = OUT_DIR / f"{i}.html"
        out.write_text(page, encoding='utf-8')

        # Stub L.js
        stub_path = OUT_DIR / f"L{i}.js"
        if not stub_path.exists() or stub_path.stat().st_size < 1000:
            stub = (
                f"window.{track_slug.upper().replace('-', '_')}_L{i} = {{\n"
                f"  en: `<p class=\"l-text\">Lesson {i}: {title_en_plain} — content coming soon.</p>`,\n"
                f"  tr: `<p class=\"l-text\">Ders {i}: {title_tr.replace('&amp;','&')} — içerik yakında.</p>`\n"
                f"}};\n"
            )
            stub_path.write_text(stub, encoding='utf-8')

    # index.html
    idx = OUT_DIR / "index.html"
    idx.write_text(
        f'<!DOCTYPE html>\n<html><head>\n<meta charset="UTF-8">\n'
        f'<meta http-equiv="refresh" content="0;url=/tutorials/{track_slug}/1">\n'
        f'<title>Redirecting to {conf["name_en"]} Lesson 1...</title>\n'
        f'<meta property="og:image" content="https://mikailsarpkaya.com/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:image" content="https://mikailsarpkaya.com/og-image.png"></head><body><a class="skip-link" href="#main">Skip to content</a>\n'
        f'<p>Redirecting to <a href="/tutorials/{track_slug}/1">{conf["name_en"]} Lesson 1</a>...</p>\n'
        f'<script src="/tutorials/interactive-runner.js?v=14" defer></script>\n'
        f'</body></html>\n',
        encoding='utf-8'
    )

    print(f"  generated {n_lessons} shells + stubs for {track_slug}")


if __name__ == '__main__':
    if len(sys.argv) > 1:
        slug = sys.argv[1]
        if slug == 'all':
            for s in ['diffeq', 'markov', 'discrete', 'complex']:
                print(f"=== {s} ===")
                generate_track(s)
        else:
            generate_track(slug)
    else:
        print("Usage: python _make_track_shells.py <slug> | all")
        print(f"Available: {list(TRACK_CONFIGS.keys())}")
