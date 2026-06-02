/* nlp-new-L2.js — NLP Course Lesson 2: Token'ları Sayılara Çevirmek — Bag-of-Words & TF-IDF (TR + EN)
 * Pedagojik vizyon: konu anlatım kursu, somut mini corpus üzerinden sıralı, açıklamalı.
 * Türkçe ana dil; 3 film yorumundan oluşan mini corpus tüm ders boyunca takip edilir.
 */
var NLP_L2 = {

/* ================================================================
   TÜRKÇE
   ================================================================ */
tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/ai/nlp/text-preprocessing">Ders 1</a>\'de elinde temiz bir token listesi vardı: <code>["film", "gerçek", "harika"]</code>. Ama makine öğrenmesi modelleri kelime değil, sayı ister. Bu derste o köprüyü kuracağız: token\'ları sayılara, cümleleri sayı vektörlerine çevirmenin iki klasik yolunu — <strong>Bag-of-Words</strong> ve <strong>TF-IDF</strong> — baştan sona göreceğiz. Üç film yorumundan oluşan küçük bir veri seti üzerinde elle hesap yapacağız, sonra Python\'da aynı işlemi sklearn ile çalıştıracağız.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Sözlük (vocabulary) kurmayı ve cümleleri Bag-of-Words sayım vektörüne çevirmeyi</li>'
+ '<li>TF, IDF ve TF-IDF formüllerini elle 3-yorumluk mini corpusta hesaplamayı</li>'
+ '<li>sklearn CountVectorizer ve TfidfVectorizer ile aynı sonucu Python\'da üretmeyi</li>'
+ '<li>min_df, max_df ve ngram_range parametreleriyle özellik uzayını ayarlamayı</li>'
+ '<li>BoW/TF-IDF\'nin sınırlarını (anlam yakınlığı yok, seyrek vektör) tartışmayı</li>'
+ '</ul>'
+ '</div>'

/* ============================================
   1. Niye sayıya çeviriyoruz?
   ============================================ */
+ '<h2 class="l-title">1. Niye Sayıya Çeviriyoruz?</h2>'

+ '<p class="l-text">Makine öğrenmesi modelleri matematik nesneleridir. Bir Naive Bayes sınıflandırıcı, bir lojistik regresyon, bir karar ağacı, bir derin sinir ağı — hepsi <strong>sayısal vektörlerle</strong> çalışır. Modele bir kelime veremeyiz; ona bir sayı dizisi vermeliyiz. Bu yüzden NLP boru hattının ikinci adımı, <a href="/tutorials/ai/nlp/text-preprocessing">Ders 1</a>\'de elde ettiğimiz temiz token\'ları sayısal bir biçime dönüştürmektir. Bu işleme genelde <strong>vektörleştirme</strong> (vectorization) denir.</p>'

+ '<p class="l-text">Bütün ders boyunca aşağıdaki üç film yorumundan oluşan mini bir veri setini takip edeceğiz:</p>'

+ '<div class="calc-example"><div class="example-label">DERS BOYUNCA TAKİP EDECEĞİMİZ MİNİ CORPUS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Yorum 1: <code>"Bu film gerçekten harikaydı."</code>'
+ '<br>Yorum 2: <code>"Film çok kötüydü, beğenmedim."</code>'
+ '<br>Yorum 3: <code>"Film harika, herkese tavsiye ederim."</code>'
+ '</p>'
+ '<p class="l-text">Üç yorum, iki olumlu (1, 3) bir olumsuz (2). <a href="/tutorials/ai/nlp/text-preprocessing">Ders 1</a>\'deki ön işlemeyi uyguladıktan sonra elimizde şu token listeleri var:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Yorum 1 → <code>["film", "gerçek", "harika"]</code>'
+ '<br>Yorum 2 → <code>["film", "kötü", "beğen"]</code>'
+ '<br>Yorum 3 → <code>["film", "harika", "herkes", "tavsiye"]</code>'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Bu üç token listesini bir tabloya nasıl dönüştürebiliriz? Modelimizin önüne sayıları nasıl koyarız? Üç farklı yöntem inceleyeceğiz, en basitten en gelişkine. Hepsi aynı sorunu çözmeye çalışıyor — kelimelerden sayılar üretmek — ama farklı varsayımlarla.</p>'

/* ============================================
   2. En naif yaklaşım — kelime indeksi
   ============================================ */
+ '<h2 class="l-title">2. En Naif Yaklaşım: Kelime İndeksi</h2>'

+ '<p class="l-text">Akla ilk gelen şey: corpus\'taki her benzersiz kelimeye bir numara verelim. Yani bir <strong>sözlük</strong> kuralım:</p>'

+ '<div class="calc-example"><div class="example-label">KELİME → İNDEKS SÖZLÜĞÜ</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9;text-align:center">'
+ '"film" → 0 &nbsp; &nbsp; "gerçek" → 1 &nbsp; &nbsp; "harika" → 2'
+ '<br>"kötü" → 3 &nbsp; &nbsp; "beğen" → 4 &nbsp; &nbsp; "herkes" → 5 &nbsp; &nbsp; "tavsiye" → 6'
+ '</p>'
+ '<p class="l-text">Yorum 1 (<code>["film", "gerçek", "harika"]</code>) bu sözlüğe göre <code>[0, 1, 2]</code> olur.</p>'
+ '</div></div>'

+ '<p class="l-text">Sorun şu: model bu sayıları aldığında <strong>0 ile 2 arasında bir mesafe varmış</strong> gibi davranır. Sanki "film" ile "harika" arasında 2 birimlik bir uzaklık var. Oysa indeksler tamamen rastgele atandı — <code>"film"</code>\'in 0 olması, <code>"harika"</code>\'nın 2 olması herhangi bir matematiksel ilişki anlamına gelmez. İndeksleri farklı atasaydık model farklı sonuçlar verirdi.</p>'

+ '<p class="l-text">Daha kötüsü, farklı uzunluktaki yorumlar farklı uzunlukta vektörler verir. Yorum 1 üç sayılık, Yorum 3 dört sayılık. Ama klasik makine öğrenmesi modelleri <strong>aynı boyda vektörler</strong> ister.</p>'

+ '<p class="l-text">Bu yaklaşım kullanılmaz. Daha akıllı bir temsile ihtiyacımız var: her dökümanı, sözlüğümüzdeki her kelime için bir sütun içeren <strong>aynı boyda bir vektör</strong> olarak göstermek. İşte buna <strong>Bag-of-Words</strong> denir.</p>'

/* ============================================
   3. Bag-of-Words
   ============================================ */
+ '<h2 class="l-title">3. Bag-of-Words (BoW) — Kelimeler Torbası</h2>'

+ '<p class="l-text"><strong>Bag-of-Words</strong> şu sorunun cevabını sayar: <em>"Bu dökümanda her bir kelime kaç kez geçti?"</em> İsim de buradan gelir — kelimeleri bir torbaya doldurur, içlerinden hangisinden kaç tane olduğunu sayarız. Sıra önemsizdir, sadece sıklık önemlidir.</p>'

+ '<p class="l-text">Mini corpus\'umuzdaki tüm benzersiz kelimeleri sıralayarak başlıyoruz. Bu liste bizim <strong>kelime dağarcığımız</strong> (vocabulary). Sonra her döküman için, dağarcıktaki her kelimenin o dökümanda kaç kez geçtiğini sayıyoruz:</p>'

+ '<div class="calc-example"><div class="example-label">BAG-OF-WORDS MATRİSİ — MİNİ CORPUS</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem .6rem;color:var(--accent)">Yorum</th><th style="padding:.5rem">film</th><th style="padding:.5rem">gerçek</th><th style="padding:.5rem">harika</th><th style="padding:.5rem">kötü</th><th style="padding:.5rem">beğen</th><th style="padding:.5rem">herkes</th><th style="padding:.5rem">tavsiye</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem .6rem">Y1 (olumlu)</td><td style="text-align:center">1</td><td style="text-align:center">1</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">0</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem .6rem">Y2 (olumsuz)</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">1</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td></tr>'
+ '<tr><td style="padding:.5rem .6rem">Y3 (olumlu)</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">1</td><td style="text-align:center">1</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Üç yorum, yedi sütun. Her satır artık aynı boyda bir sayı vektörüdür: <code>Y1 = [1,1,1,0,0,0,0]</code>, <code>Y2 = [1,0,0,1,1,0,0]</code>, <code>Y3 = [1,0,1,0,0,1,1]</code>. Bu üç vektörü makine öğrenmesi modeline doğrudan verebiliriz.</p>'
+ '</div></div>'

+ '<p class="l-text">Üç önemli gözlem yap:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Sözlük tüm corpus\'tan oluşur.</strong> Yorum 1\'de "kötü" kelimesi yok ama tablonun "kötü" sütunu var — Yorum 1 için orada 0 yazıyor. Bütün dökümanlar aynı sözlükte gösterilir.</li>'
+ '<li><strong>Vektör boyutu sözlük boyutudur.</strong> Bu mini örnekte 7 boyutlu. Gerçek bir corpus\'ta 30.000-100.000 kelime olur — yani 30.000+ boyutlu seyrek (sparse) vektörler.</li>'
+ '<li><strong>Çoğunluk sıfırdır.</strong> Tipik bir cümlede 10-20 farklı kelime geçer. 30.000 kelimelik sözlükte vektörün %99.9\'u sıfır olur. Bu yüzden seyrek matris yapıları (<code>scipy.sparse</code>) kullanılır.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Matematiksel Gösterim</h3>'

+ '<p class="l-text">Her döküman <em>d</em> için BoW vektörü şöyle tanımlanır:</p>'

+ '<div class="calc-formula"><div class="formula-main" style="text-align:center;font-family:var(--mono);font-size:1.05rem;padding:1rem">BoW(d)<sub>i</sub> = (kelime <em>w<sub>i</sub></em>\'nin döküman <em>d</em>\'de geçme sayısı)</div></div>'

+ '<p class="l-text">Burada <em>i</em>, sözlüğümüzdeki kelime indeksidir. Vektörün <em>i</em>\'nci elemanı, sözlüğün <em>i</em>\'nci kelimesinin dökümanda kaç kez göründüğüdür. Bu kadar.</p>'

/* ============================================
   4. BoW sınırları
   ============================================ */
+ '<h2 class="l-title">4. BoW\'nun Sınırları</h2>'

+ '<p class="l-text">Bag-of-Words basit ve pek çok pratik problemde işe yarayan bir temsildir. Ama önemli sınırları vardır. Hepsini bilmek, modelin neyi yakalayıp neyi kaçıracağını anlamana yardım eder.</p>'

+ '<h3 class="l-subtitle">Sınır 1: kelime sırası tamamen kaybolur</h3>'

+ '<p class="l-text">BoW açısından bu iki cümle <strong>aynıdır</strong>:</p>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:1rem"><code>"film harika"</code> &nbsp; ↔ &nbsp; <code>"harika film"</code></p>'
+ '<p class="l-text">İkisi de aynı kelimeleri içerir, ikisinin BoW vektörü de aynıdır. Türkçedeki esnek kelime sırası bu sorunu bazen daha az görünür kılar, ama kritik anlam farkları kaybolabilir.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Sınır 2: olumsuzlama BoW için görünmez</h3>'

+ '<p class="l-text">Şu iki cümleye bak:</p>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code>"film güzel"</code> (olumlu)</p>'
+ '<p class="l-text" style="text-align:center"><code>"film güzel değil"</code> (olumsuz)</p>'
+ '</div></div>'

+ '<p class="l-text">İkinci cümlenin anlamı tamamen tersine döner ama BoW vektörü neredeyse aynıdır — sadece "değil" sütununda 1 fark vardır. Model "değil"in kendinden önceki kelimeyi olumsuzladığını bilemez. Bu yüzden duygu analizinde BoW tek başına zayıftır. Bir sonraki bölümde göreceğimiz <strong>n-gram</strong>\'lar bu sorunu kısmen çözer.</p>'

+ '<h3 class="l-subtitle">Sınır 3: uzun belgeler kısa belgelerden farklı tonda</h3>'

+ '<p class="l-text">10 kelimelik bir tweet ile 500 kelimelik bir blog yazısının BoW vektörü doğrudan karşılaştırılırsa, blog yazısı her kelime için daha yüksek sayılar üretir — sırf uzun olduğu için. Bu sorunu çözmek için BoW vektörünü dökümandaki toplam kelime sayısına bölerek <strong>normalize</strong> edebiliriz (oran haline getiririz). Ya da daha akıllısı: TF-IDF kullanırız (Bölüm 6).</p>'

+ '<h3 class="l-subtitle">Sınır 4: tüm kelimeler eşit önemde sayılır</h3>'

+ '<p class="l-text">BoW\'da "film" kelimesi de "harika" kelimesi de bir oy hakkı taşır. Ama "film" zaten her yorumda var (her satırda 1 yazıyor) — sınıflandırma için hiçbir bilgi taşımıyor. Asıl ayırt edici kelimeler "harika", "kötü", "beğen" gibi seyrek olanlar. <strong>TF-IDF</strong> bu önem farkını matematiksel olarak yakalar — birazdan göreceğiz.</p>'

/* ============================================
   5. N-gram'lar
   ============================================ */
+ '<h2 class="l-title">5. N-gram\'lar — Kelime Sırasını Kısmen Geri Kazanmak</h2>'

+ '<p class="l-text">BoW kelime sırasını tamamen attı. Ama "değil güzel" ile "güzel değil" arasındaki fark gerçek dünyada önemlidir. <strong>N-gram</strong> denilen basit bir genişletme bu sorunu kısmen çözer: tek tek kelimeler yerine, ardışık <em>n</em> kelimeden oluşan grupları sayarız.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Unigram</strong> (1-gram): tek kelime. Klasik BoW budur. <code>["film", "harika", "değil"]</code></li>'
+ '<li><strong>Bigram</strong> (2-gram): yan yana iki kelime. <code>["film harika", "harika değil"]</code></li>'
+ '<li><strong>Trigram</strong> (3-gram): yan yana üç kelime. <code>["film çok güzeldi"]</code></li>'
+ '</ul>'

+ '<p class="l-text">Bigram\'larla birlikte kullanıldığında BoW şöyle bir avantaj kazanır:</p>'

+ '<div class="calc-example"><div class="example-label">DUYGU ANALİZİNDE BİGRAM\'IN ETKİSİ</div><div class="example-body">'
+ '<p class="l-text"><code>"film güzel değil"</code> cümlesinin unigram\'ları:</p>'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono)"><code>["film", "güzel", "değil"]</code></p>'
+ '<p class="l-text">Aynı cümlenin bigram\'ları:</p>'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono)"><code>["film güzel", "güzel değil"]</code></p>'
+ '<p class="l-text"><code>"güzel değil"</code> bigram\'ı tek başına olumsuz duygunun güçlü bir sinyalidir. Olumlu yorumlarda nadiren görünür, olumsuz yorumlarda sık. Sınıflandırıcı bunu öğrenebilir.</p>'
+ '</div></div>'

+ '<div class="l-warn"><strong>Maliyet:</strong> N-gram\'lar sözlük boyutunu hızla şişirir. Bir corpus\'ta 30.000 farklı kelime varsa, 30.000² = 900 milyon mümkün bigram vardır (gerçekte çoğu hiç görünmez ama yine de yüzbinlerce farklı bigram olur). Bu yüzden pratikte bigram veya trigram\'a kadar gidilir, daha yüksek <em>n</em> değerleri ezbere yol açar.</div>'

/* ============================================
   6. TF-IDF sezgi
   ============================================ */
+ '<h2 class="l-title">6. TF-IDF — Bazı Kelimeler Daha Bilgili</h2>'

+ '<p class="l-text">BoW\'da bir sorun vardı: "film" kelimesi her yorumda 1 yazıyor, hiçbir ayırt edici güç taşımıyor. Asıl bilgi seyrek görünen, dökümana özel olan kelimelerdedir — "harika", "kötü", "tavsiye" gibi. <strong>TF-IDF</strong> (Term Frequency – Inverse Document Frequency) tam olarak bunu ölçer: bir kelimenin bir dökümanda <em>ne kadar bilgi taşıdığını</em>.</p>'

+ '<p class="l-text">Sezgi şudur:</p>'

+ '<ul class="l-list">'
+ '<li>Bir kelime, <strong>bir dökümanda sık geçiyorsa</strong> o döküman için önemlidir. Buna <em>terim frekansı (TF)</em> diyoruz.</li>'
+ '<li>Ama <strong>tüm dökümanlarda geçiyorsa</strong> ayırt edici değildir, önem azalır. Buna <em>ters döküman frekansı (IDF)</em> diyoruz.</li>'
+ '<li>İkisini çarparız: TF × IDF.</li>'
+ '</ul>'

+ '<p class="l-text">Sonuç: <strong>"film" gibi her yerde geçen kelimeler düşük TF-IDF skoru alır. "harika" gibi sadece bir-iki dökümanda geçen kelimeler yüksek skor alır.</strong> Tam istediğimiz şey.</p>'

/* ============================================
   7. TF-IDF formülü
   ============================================ */
+ '<h2 class="l-title">7. TF-IDF Formülü — Adım Adım</h2>'

+ '<h3 class="l-subtitle">Terim Frekansı (TF)</h3>'

+ '<p class="l-text"><strong>TF(t, d)</strong> = <em>t</em> teriminin <em>d</em> dökümanında geçme sayısı. Bazen normalize edilir (toplam kelime sayısına bölünür) ama en sade hâli bu.</p>'

+ '<div class="calc-formula"><div class="formula-main" style="text-align:center;font-family:var(--mono);font-size:1.05rem;padding:1rem">TF(t, d) = (t kelimesinin d\'de geçme sayısı)</div></div>'

+ '<h3 class="l-subtitle">Ters Döküman Frekansı (IDF)</h3>'

+ '<p class="l-text"><strong>IDF(t)</strong>, terimin tüm dökümanlardaki yaygınlığının <em>tersini</em> ölçer. Yaygın olan kelimelerin IDF\'si düşük, nadir olanların IDF\'si yüksek olur. Logaritma kullanılır ki çok büyük veya küçük değerler oluşmasın:</p>'

+ '<div class="calc-formula"><div class="formula-main" style="text-align:center;font-family:var(--mono);font-size:1.05rem;padding:1rem">IDF(t) = log( N / df(t) )</div></div>'

+ '<p class="l-text">Burada:</p>'

+ '<ul class="l-list">'
+ '<li><em>N</em> = corpus\'taki toplam döküman sayısı</li>'
+ '<li><em>df(t)</em> = <em>t</em> teriminin geçtiği döküman sayısı (kaç farklı dökümanda görünüyor)</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">TF-IDF — İkisini Çarpmak</h3>'

+ '<div class="calc-formula"><div class="formula-main" style="text-align:center;font-family:var(--mono);font-size:1.05rem;padding:1rem">TF-IDF(t, d) = TF(t, d) × IDF(t)</div></div>'

+ '<h3 class="l-subtitle">Mini Corpus Üzerinde Hesaplama</h3>'

+ '<p class="l-text">Üç film yorumumuz için TF-IDF skorlarını elle hesaplayalım. <em>N</em> = 3 (üç döküman).</p>'

+ '<div class="calc-example"><div class="example-label">DF VE IDF DEĞERLERİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Kelime</th><th style="padding:.5rem">df (kaç dökümanda?)</th><th style="padding:.5rem">IDF = log(3/df)</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">film</td><td style="text-align:center">3</td><td style="text-align:center">log(3/3) = 0.00</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">gerçek</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">harika</td><td style="text-align:center">2</td><td style="text-align:center">log(3/2) = 0.41</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">kötü</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">beğen</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">herkes</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '<tr><td style="padding:.5rem">tavsiye</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem"><strong>Yorum:</strong> "film" üç dökümanın üçünde de geçtiği için IDF\'si 0 — sıfır bilgi. "harika" iki dökümanda geçtiği için IDF\'si orta. "gerçek", "kötü", "beğen" gibi sadece bir dökümanda geçenlerin IDF\'si en yüksek — en bilgili kelimeler bunlar.</p>'
+ '</div></div>'

+ '<p class="l-text">Şimdi TF-IDF\'yi hesaplayalım. Yorum 1 için (<code>["film", "gerçek", "harika"]</code>):</p>'

+ '<div class="calc-example"><div class="example-label">YORUM 1 — TF-IDF SKORLARI</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Kelime</th><th style="padding:.5rem">TF</th><th style="padding:.5rem">IDF</th><th style="padding:.5rem">TF-IDF</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">film</td><td style="text-align:center">1</td><td style="text-align:center">0.00</td><td style="text-align:center;color:var(--text-dim)">0.00</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">gerçek</td><td style="text-align:center">1</td><td style="text-align:center">1.10</td><td style="text-align:center;color:var(--accent)"><strong>1.10</strong></td></tr>'
+ '<tr><td style="padding:.5rem">harika</td><td style="text-align:center">1</td><td style="text-align:center">0.41</td><td style="text-align:center;color:var(--accent)"><strong>0.41</strong></td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Bu küçük tablodan bile çıkan sonuç şu: BoW\'a göre Yorum 1\'in temsilinde <code>"film"</code> ile <code>"harika"</code> eşit ağırlıktaydı. TF-IDF\'ye göre "film" sıfır ağırlık taşıyor, "gerçek" ve "harika" asıl bilgiyi taşıyor. <strong>Sınıflandırıcı için çok daha kullanışlı bir temsil.</strong></p>'
+ '</div></div>'

/* Plotly: BoW vs TF-IDF kıyaslama */
+ '<div class="plotly-graph"><div id="plot-bow-tfidf-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["film","gerçek","harika","kötü","beğen","herkes","tavsiye"];'
+ 'var bow=[1,1,1,0,0,0,0];'
+ 'var tfidf=[0.00,1.10,0.41,0.00,0.00,0.00,0.00];'
+ 'var t1={x:k,y:bow,name:"BoW",type:"bar",marker:{color:"rgba(128,128,128,.5)"}};'
+ 'var t2={x:k,y:tfidf,name:"TF-IDF",type:"bar",marker:{color:T.accent}};'
+ 'var layout={title:{text:"Yorum 1: BoW vs TF-IDF kelime ağırlıkları",font:{color:T.text,size:13}},barmode:"group",xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Ağırlık"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-bow-tfidf-tr"))Plotly.newPlot("plot-bow-tfidf-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne gösteriyor:</strong> Yorum 1\'deki kelimelerin BoW (gri) ve TF-IDF (renkli) ağırlıkları. BoW\'a göre "film", "gerçek", "harika" eşit ağırlıkta. TF-IDF\'ye göre "film" sıfırlanır (her yerde geçtiği için), "gerçek" en yüksek skoru alır (sadece tek dökümanda var), "harika" orta seviyede (iki dökümanda var). Sınıflandırıcı için "film" sinyal değil, "gerçek" ve "harika" gerçek sinyaldir.</div>'

/* ============================================
   8. Python uygulaması
   ============================================ */
+ '<h2 class="l-title">8. Python\'da Uygulama — sklearn ile</h2>'

+ '<p class="l-text">Yukarıdaki tüm hesaplamayı elle yapmak öğrenmek için iyi, ama gerçek projelerde <strong>sklearn</strong> kütüphanesinin hazır araçlarını kullanırız. Üretim kalitesinde, optimize edilmiş ve seyrek matrislerle çalışan iki sınıf vardır:</p>'

+ '<ul class="l-list">'
+ '<li><code>CountVectorizer</code> — BoW matrisi üretir.</li>'
+ '<li><code>TfidfVectorizer</code> — TF-IDF matrisi üretir.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Bag-of-Words ile sklearn</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> CountVectorizer<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> CountVectorizer'
+ '\n'
+ '\ncorpus = ['
+ '\n    <span class="str">"Bu film gerçekten harikaydı"</span>,'
+ '\n    <span class="str">"Film çok kötüydü beğenmedim"</span>,'
+ '\n    <span class="str">"Film harika herkese tavsiye ederim"</span>,'
+ '\n]'
+ '\n'
+ '\nvectorizer = <span class="fn">CountVectorizer</span>()'
+ '\nX = vectorizer.<span class="fn">fit_transform</span>(corpus)'
+ '\n'
+ '\n<span class="fn">print</span>(vectorizer.<span class="fn">get_feature_names_out</span>())'
+ '\n<span class="cm"># [\'beğenmedim\' \'bu\' \'çok\' \'ederim\' \'film\' \'gerçekten\' \'harika\' ...]</span>'
+ '\n<span class="fn">print</span>(X.<span class="fn">toarray</span>())'
+ '\n<span class="cm"># Her satır bir yorum, her sütun bir kelime, hücreler sayım</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> <code>CountVectorizer</code>\'ı oluşturur, sonra üç yorumdan oluşan listemizi <code>fit_transform</code>\'a verir. Bu fonksiyon iki şey yapar: önce sözlüğü öğrenir (<code>fit</code>), sonra her dökümanı sayım vektörüne çevirir (<code>transform</code>). Çıktı seyrek bir matris — <code>.toarray()</code> ile sıkıştırılmış sürümü görebilirsin. <code>get_feature_names_out()</code> hangi sütunun hangi kelimeye karşılık geldiğini söyler.</p>'

+ '<h3 class="l-subtitle">TF-IDF ile sklearn</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> TfidfVectorizer<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer'
+ '\n'
+ '\nvectorizer = <span class="fn">TfidfVectorizer</span>()'
+ '\nX = vectorizer.<span class="fn">fit_transform</span>(corpus)'
+ '\n'
+ '\n<span class="cm"># X[0] = Yorum 1\'in TF-IDF vektörü</span>'
+ '\n<span class="fn">print</span>(X[<span class="num">0</span>].<span class="fn">toarray</span>().<span class="fn">round</span>(<span class="num">3</span>))'
+ '\n<span class="cm"># Yüksek skorlar: "gerçekten", "harikaydı"; "film" düşük (her yerde var)</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Aynı corpus\'u <code>TfidfVectorizer</code> ile vektörleştirir. API tamamen aynıdır — sadece sınıf ismi değişir. Çıktı vektörü artık 0/1 sayım değil, ondalık TF-IDF skorlarıdır. sklearn varsayılan olarak L2 normalizasyon da uygular, bu yüzden değerler 0-1 arasında kalır. Bu vektörü doğrudan <a href="/tutorials/ai/nlp/text-classification">Ders 3</a>\'teki sınıflandırıcılara verebiliriz.</p>'

/* ============================================
   9. Pratik ipuçları
   ============================================ */
+ '<h2 class="l-title">9. Pratik İpuçları</h2>'

+ '<p class="l-text">CountVectorizer ve TfidfVectorizer\'ın pek çok parametresi vardır. En sık kullanılanları:</p>'

+ '<ul class="l-list">'
+ '<li><code>ngram_range=(1, 2)</code>: hem unigram hem bigram\'ları dahil eder. Sentiment\'te genelde belirgin iyileştirme.</li>'
+ '<li><code>min_df=2</code>: en az iki dökümanda görünmeyen kelimeleri yok sayar. Tek seferlik yazım hatalarını filtreler.</li>'
+ '<li><code>max_df=0.95</code>: dökümanların %95\'inden fazlasında geçen kelimeleri yok sayar. Atlanmış stop words\'leri yakalar.</li>'
+ '<li><code>max_features=5000</code>: sözlük boyutunu sınırlar — sadece en sık 5.000 kelime tutulur. Büyük corpus\'larda hız ve bellek için önemli.</li>'
+ '<li><code>stop_words=...</code>: kendi stop word listenizi geçebilirsiniz (sklearn\'un Türkçe listesi yok, kendi listenizi vermeniz lazım).</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">PRATİK BİR YAPILANDIRMA</div><div class="example-body">'
+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Sentiment için iyi başlangıç<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code>vectorizer = <span class="fn">TfidfVectorizer</span>('
+ '\n    ngram_range=(<span class="num">1</span>, <span class="num">2</span>),     <span class="cm"># unigram + bigram</span>'
+ '\n    min_df=<span class="num">2</span>,              <span class="cm"># en az 2 dökümanda görünsün</span>'
+ '\n    max_df=<span class="num">0.95</span>,           <span class="cm"># corpus\'un %95\'inden fazlasında geçenleri at</span>'
+ '\n    max_features=<span class="num">10000</span>,    <span class="cm"># en sık 10.000 ngram\'ı tut</span>'
+ '\n)'
+ '\nX = vectorizer.<span class="fn">fit_transform</span>(corpus)</code></pre></div></div>'
+ '<p class="l-text" style="margin-top:.8rem"><strong>Bu yapılandırma ne yapar:</strong> Hem tek kelimeleri hem ardışık ikilileri sayar (n-gram), nadir yazım hatalarını ve "film" gibi her yerde geçen kelimeleri otomatik filtreler, sözlüğü 10.000 ngram\'la sınırlar. Çoğu sentiment problemi için dengeli, hızlı bir başlangıçtır.</p>'
+ '</div></div>'

/* ============================================
   10. Sonraki ders
   ============================================ */
+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Şu anda <a href="/tutorials/ai/nlp/text-preprocessing">Ders 1</a>\'in temizlediği token\'ları sayılara çevirebiliyorsun. Mini corpus\'umuzdaki üç yorumun her biri artık bir vektör — TF-IDF skorlarıyla. <a href="/tutorials/ai/nlp/text-classification">Ders 3</a>\'te bu vektörleri ilk gerçek makine öğrenmesi modeline bağlayacağız: <strong>Naive Bayes</strong> ve <strong>lojistik regresyon</strong> ile bir film yorumunun olumlu mu olumsuz mu olduğunu tahmin etmeyi öğreneceğiz. Klasik NLP\'nin altın çağı buradan başlar.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Token\'ları sayılara çevirmenin neden gerekli olduğunu anladın. Naif kelime indeksinin neden çalışmadığını gördün. Bag-of-Words\'ün ne olduğunu, mini bir corpus üzerinde matrisini elle hesapladın. BoW\'un sınırlarını (kelime sırası kayıp, olumsuzlama göremez, uzunluk etkisi, eşit ağırlık) öğrendin. N-gram\'ların kelime sırasını kısmen geri kazandığını gördün. TF-IDF\'nin nasıl yaygın kelimeleri sıfırlayıp seyrek bilgili kelimeleri öne çıkardığını formülüyle ve mini corpus üzerinde elle hesaplayarak takip ettin. sklearn\'un <code>CountVectorizer</code> ve <code>TfidfVectorizer</code>\'ını gerçek koda döktün ve pratik parametrelerini gördün.</div>'

,

/* ================================================================
   ENGLISH
   ================================================================ */
en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/ai/nlp/text-preprocessing">Lesson 1</a> you ended with a clean token list: <code>["movi", "truli", "amaz"]</code>. But machine learning models do not consume words — they consume numbers. This lesson builds that bridge. You will see two classical ways to turn tokens into numbers, and sentences into numerical vectors: <strong>Bag-of-Words</strong> and <strong>TF-IDF</strong>. We will walk through a tiny three-review dataset by hand, then run the same operation in Python with sklearn.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Build a vocabulary and turn sentences into Bag-of-Words count vectors</li>'
+ '<li>Compute TF, IDF, and TF-IDF by hand on a 3-review mini corpus</li>'
+ '<li>Reproduce the same matrices in Python with sklearn CountVectorizer and TfidfVectorizer</li>'
+ '<li>Tune feature space with min_df, max_df, and ngram_range parameters</li>'
+ '<li>Discuss BoW/TF-IDF limits — no semantics, sparse vectors, no word order</li>'
+ '</ul>'
+ '</div>'

/* 1. Why turn into numbers */
+ '<h2 class="l-title">1. Why Turn Words into Numbers?</h2>'

+ '<p class="l-text">Machine learning models are mathematical objects. A Naive Bayes classifier, a logistic regression, a decision tree, a deep neural network — all of them work with <strong>numerical vectors</strong>. We cannot give a model a word; we must give it a sequence of numbers. So the second step of the NLP pipeline is to turn the clean tokens from <a href="/tutorials/ai/nlp/text-preprocessing">Lesson 1</a> into a numerical form. This is generally called <strong>vectorization</strong>.</p>'

+ '<p class="l-text">We will follow this tiny three-review dataset throughout the lesson:</p>'

+ '<div class="calc-example"><div class="example-label">RUNNING MINI CORPUS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Review 1: <code>"This movie was truly amazing."</code>'
+ '<br>Review 2: <code>"The movie was terrible, did not enjoy."</code>'
+ '<br>Review 3: <code>"Amazing movie, recommend it to everyone."</code>'
+ '</p>'
+ '<p class="l-text">Three reviews, two positive (1, 3) and one negative (2). After applying the preprocessing from <a href="/tutorials/ai/nlp/text-preprocessing">Lesson 1</a>, we have these token lists:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Review 1 → <code>["movie", "truly", "amazing"]</code>'
+ '<br>Review 2 → <code>["movie", "terrible", "enjoy"]</code>'
+ '<br>Review 3 → <code>["amazing", "movie", "recommend", "everyone"]</code>'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">How do we turn these three token lists into a table of numbers? We will look at three approaches, from the most naïve to the most useful. All of them try to solve the same problem — generating numbers from words — but with different assumptions.</p>'

/* 2. Naive */
+ '<h2 class="l-title">2. The Naïve Approach: a Word-to-Index Dictionary</h2>'

+ '<p class="l-text">The first idea: assign each unique word in the corpus a number. Build a <strong>vocabulary</strong>:</p>'

+ '<div class="calc-example"><div class="example-label">WORD → INDEX MAPPING</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9;text-align:center">'
+ '"movie" → 0 &nbsp; &nbsp; "truly" → 1 &nbsp; &nbsp; "amazing" → 2'
+ '<br>"terrible" → 3 &nbsp; &nbsp; "enjoy" → 4 &nbsp; &nbsp; "recommend" → 5 &nbsp; &nbsp; "everyone" → 6'
+ '</p>'
+ '<p class="l-text">Review 1 (<code>["movie", "truly", "amazing"]</code>) becomes <code>[0, 1, 2]</code>.</p>'
+ '</div></div>'

+ '<p class="l-text">The problem: when the model sees these numbers, it acts as if there is <strong>a distance of 2 between "movie" and "amazing"</strong>. But the indices are arbitrary — there is no mathematical relationship between "movie" being 0 and "amazing" being 2. If we assigned indices differently, we would get different results.</p>'

+ '<p class="l-text">Worse, reviews of different lengths produce vectors of different lengths. Review 1 has three numbers, Review 3 has four. Classical machine learning models expect <strong>fixed-size vectors</strong>.</p>'

+ '<p class="l-text">This approach is unusable. We need a smarter representation: every document represented as <strong>a fixed-size vector</strong> with one column per word in the vocabulary. That is exactly Bag-of-Words.</p>'

/* 3. BoW */
+ '<h2 class="l-title">3. Bag-of-Words (BoW) — A Bag of Word Counts</h2>'

+ '<p class="l-text"><strong>Bag-of-Words</strong> answers the question: <em>"How many times does each word appear in this document?"</em> The name comes from imagining all words tossed into a bag and counting them — order is lost, only frequency matters.</p>'

+ '<p class="l-text">We start by listing every unique word in the corpus. That list is our <strong>vocabulary</strong>. Then for each document, we count how many times each vocabulary word appears in it:</p>'

+ '<div class="calc-example"><div class="example-label">BAG-OF-WORDS MATRIX — MINI CORPUS</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem .6rem;color:var(--accent)">Review</th><th style="padding:.5rem">movie</th><th style="padding:.5rem">truly</th><th style="padding:.5rem">amazing</th><th style="padding:.5rem">terrible</th><th style="padding:.5rem">enjoy</th><th style="padding:.5rem">recommend</th><th style="padding:.5rem">everyone</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem .6rem">R1 (positive)</td><td style="text-align:center">1</td><td style="text-align:center">1</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">0</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem .6rem">R2 (negative)</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">1</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td></tr>'
+ '<tr><td style="padding:.5rem .6rem">R3 (positive)</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">1</td><td style="text-align:center">0</td><td style="text-align:center">0</td><td style="text-align:center">1</td><td style="text-align:center">1</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Three reviews, seven columns. Each row is now a fixed-size numerical vector: <code>R1 = [1,1,1,0,0,0,0]</code>, <code>R2 = [1,0,0,1,1,0,0]</code>, <code>R3 = [1,0,1,0,0,1,1]</code>. We can hand these vectors directly to a machine learning model.</p>'
+ '</div></div>'

+ '<p class="l-text">Three observations to take away:</p>'

+ '<ul class="l-list">'
+ '<li><strong>The vocabulary is built from the whole corpus.</strong> Review 1 does not contain "terrible", but the table has a column for it — Review 1 just has 0 there. All documents are represented in the same vocabulary.</li>'
+ '<li><strong>Vector dimension equals vocabulary size.</strong> Our toy example has 7 columns. A real corpus has 30,000–100,000 unique words, meaning 30,000+ dimensional sparse vectors.</li>'
+ '<li><strong>Most entries are zero.</strong> A typical sentence contains 10–20 distinct words. In a 30,000-word vocabulary, 99.9% of the vector is zeros. This is why we use sparse matrix data structures (<code>scipy.sparse</code>).</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Mathematical Notation</h3>'

+ '<p class="l-text">For each document <em>d</em>, the BoW vector is defined as:</p>'

+ '<div class="calc-formula"><div class="formula-main" style="text-align:center;font-family:var(--mono);font-size:1.05rem;padding:1rem">BoW(d)<sub>i</sub> = (count of word <em>w<sub>i</sub></em> in document <em>d</em>)</div></div>'

+ '<p class="l-text">Here <em>i</em> is the word index in the vocabulary. The <em>i</em>-th element of the vector is how many times the <em>i</em>-th vocabulary word appears in the document. That is all.</p>'

/* 4. BoW limits */
+ '<h2 class="l-title">4. The Limits of BoW</h2>'

+ '<p class="l-text">Bag-of-Words is simple and works well for many practical problems. But it has important limits. Knowing them helps you understand what the model can and cannot capture.</p>'

+ '<h3 class="l-subtitle">Limit 1: word order is completely lost</h3>'

+ '<p class="l-text">From BoW\'s perspective, these two sentences are <strong>identical</strong>:</p>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:1rem"><code>"movie amazing"</code> &nbsp; ↔ &nbsp; <code>"amazing movie"</code></p>'
+ '<p class="l-text">Both contain the same words, both have the same BoW vector. For some tasks this is fine; for others critical meaning is lost.</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Limit 2: negation flips meaning, BoW does not see it</h3>'

+ '<p class="l-text">Consider these two sentences:</p>'

+ '<div class="calc-example"><div class="example-body">'
+ '<p class="l-text" style="text-align:center"><code>"the movie was good"</code> (positive)</p>'
+ '<p class="l-text" style="text-align:center"><code>"the movie was not good"</code> (negative)</p>'
+ '</div></div>'

+ '<p class="l-text">The second sentence flips meaning entirely, but its BoW vector is almost identical — only one extra 1 in the "not" column. The model has no way to know that "not" negates the word that follows. This is why BoW alone is weak for sentiment. The next section\'s <strong>n-grams</strong> partially solve it.</p>'

+ '<h3 class="l-subtitle">Limit 3: long documents look different from short ones</h3>'

+ '<p class="l-text">Comparing the BoW vector of a 10-word tweet directly to that of a 500-word blog post gives the blog post higher counts for everything — just because it is long. We can fix this by dividing by total word count (normalise to ratios). Or, more cleverly, we can use TF-IDF (Section 6).</p>'

+ '<h3 class="l-subtitle">Limit 4: every word counts equally</h3>'

+ '<p class="l-text">In BoW, "movie" gets a vote and "amazing" gets a vote. But "movie" appears in every review (each row has 1) — it carries no discriminative information. The actually informative words are "amazing", "terrible", "enjoy" — the rare ones. <strong>TF-IDF</strong> captures this importance difference mathematically — coming up next.</p>'

/* 5. N-grams */
+ '<h2 class="l-title">5. N-grams — Recovering Word Order, Partially</h2>'

+ '<p class="l-text">BoW dropped word order entirely. But the difference between "not good" and "good not" matters in the real world. A simple extension called <strong>n-grams</strong> partially fixes this: instead of counting single words, we count groups of <em>n</em> consecutive words.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Unigram</strong> (1-gram): single words. Classical BoW. <code>["movie", "amazing", "not"]</code></li>'
+ '<li><strong>Bigram</strong> (2-gram): two consecutive words. <code>["movie amazing", "amazing not"]</code></li>'
+ '<li><strong>Trigram</strong> (3-gram): three consecutive words. <code>["movie was truly amazing"]</code></li>'
+ '</ul>'

+ '<p class="l-text">When we add bigrams to BoW, we get a real advantage:</p>'

+ '<div class="calc-example"><div class="example-label">BIGRAMS IN SENTIMENT</div><div class="example-body">'
+ '<p class="l-text">Unigrams of <code>"movie was not good"</code>:</p>'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono)"><code>["movie", "was", "not", "good"]</code></p>'
+ '<p class="l-text">Bigrams of the same:</p>'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono)"><code>["movie was", "was not", "not good"]</code></p>'
+ '<p class="l-text"><code>"not good"</code> by itself is a strong negative signal. Rare in positive reviews, common in negative ones. The classifier can learn this.</p>'
+ '</div></div>'

+ '<div class="l-warn"><strong>Cost:</strong> N-grams blow up vocabulary size fast. With 30,000 unigrams, there are 30,000² = 900 million possible bigrams (most never appear, but you still get hundreds of thousands of distinct bigrams). In practice you stop at bigrams or trigrams; higher <em>n</em> overfits.</div>'

/* 6. TF-IDF intuition */
+ '<h2 class="l-title">6. TF-IDF — Some Words Carry More Information</h2>'

+ '<p class="l-text">BoW had a problem: "movie" gets a 1 in every review, contributing nothing discriminative. The real information is in the rare, document-specific words — "amazing", "terrible", "recommend". <strong>TF-IDF</strong> (Term Frequency – Inverse Document Frequency) measures exactly that: how much information a word carries about a specific document.</p>'

+ '<p class="l-text">The intuition:</p>'

+ '<ul class="l-list">'
+ '<li>If a word <strong>appears often in a document</strong>, it is important for that document. We call this <em>term frequency (TF)</em>.</li>'
+ '<li>But if it <strong>appears in every document</strong>, it is not discriminative. We call this <em>inverse document frequency (IDF)</em>.</li>'
+ '<li>We multiply them: TF × IDF.</li>'
+ '</ul>'

+ '<p class="l-text">The result: <strong>"movie"-style words that appear everywhere get low TF-IDF scores. "amazing"-style words appearing in only one or two documents get high scores.</strong> Exactly what we want.</p>'

/* 7. TF-IDF formula */
+ '<h2 class="l-title">7. TF-IDF Formula — Step by Step</h2>'

+ '<h3 class="l-subtitle">Term Frequency (TF)</h3>'

+ '<p class="l-text"><strong>TF(t, d)</strong> = the number of times term <em>t</em> appears in document <em>d</em>. Sometimes normalised (divided by total word count), but the simplest form is just the count.</p>'

+ '<div class="calc-formula"><div class="formula-main" style="text-align:center;font-family:var(--mono);font-size:1.05rem;padding:1rem">TF(t, d) = (count of t in d)</div></div>'

+ '<h3 class="l-subtitle">Inverse Document Frequency (IDF)</h3>'

+ '<p class="l-text"><strong>IDF(t)</strong> measures the <em>inverse</em> of how widespread the term is across documents. Common words get low IDF, rare words get high IDF. We use a logarithm so values do not explode:</p>'

+ '<div class="calc-formula"><div class="formula-main" style="text-align:center;font-family:var(--mono);font-size:1.05rem;padding:1rem">IDF(t) = log( N / df(t) )</div></div>'

+ '<p class="l-text">Where:</p>'

+ '<ul class="l-list">'
+ '<li><em>N</em> = total number of documents in the corpus</li>'
+ '<li><em>df(t)</em> = number of documents containing <em>t</em></li>'
+ '</ul>'

+ '<h3 class="l-subtitle">TF-IDF — Multiplying Them</h3>'

+ '<div class="calc-formula"><div class="formula-main" style="text-align:center;font-family:var(--mono);font-size:1.05rem;padding:1rem">TF-IDF(t, d) = TF(t, d) × IDF(t)</div></div>'

+ '<h3 class="l-subtitle">Computing it on the Mini Corpus</h3>'

+ '<p class="l-text">Let us compute TF-IDF scores for our three reviews by hand. <em>N</em> = 3 (three documents).</p>'

+ '<div class="calc-example"><div class="example-label">DF AND IDF VALUES</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Word</th><th style="padding:.5rem">df (in how many docs?)</th><th style="padding:.5rem">IDF = log(3/df)</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">movie</td><td style="text-align:center">3</td><td style="text-align:center">log(3/3) = 0.00</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">truly</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">amazing</td><td style="text-align:center">2</td><td style="text-align:center">log(3/2) = 0.41</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">terrible</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">enjoy</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">recommend</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '<tr><td style="padding:.5rem">everyone</td><td style="text-align:center">1</td><td style="text-align:center">log(3/1) = 1.10</td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem"><strong>Interpretation:</strong> "movie" appears in all three documents, so its IDF is 0 — zero information. "amazing" appears in two, getting moderate IDF. "truly", "terrible", "enjoy" each appear in only one document, getting the highest IDF — the most informative words.</p>'
+ '</div></div>'

+ '<p class="l-text">Now let us compute TF-IDF scores. For Review 1 (<code>["movie", "truly", "amazing"]</code>):</p>'

+ '<div class="calc-example"><div class="example-label">REVIEW 1 — TF-IDF SCORES</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Word</th><th style="padding:.5rem">TF</th><th style="padding:.5rem">IDF</th><th style="padding:.5rem">TF-IDF</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">movie</td><td style="text-align:center">1</td><td style="text-align:center">0.00</td><td style="text-align:center;color:var(--text-dim)">0.00</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">truly</td><td style="text-align:center">1</td><td style="text-align:center">1.10</td><td style="text-align:center;color:var(--accent)"><strong>1.10</strong></td></tr>'
+ '<tr><td style="padding:.5rem">amazing</td><td style="text-align:center">1</td><td style="text-align:center">0.41</td><td style="text-align:center;color:var(--accent)"><strong>0.41</strong></td></tr>'
+ '</tbody></table></div>'
+ '<p class="l-text" style="margin-top:1rem">Even from this small table the takeaway is clear: under BoW, Review 1\'s representation gave equal weight to "movie" and "amazing". Under TF-IDF, "movie" gets zero weight, while "truly" and "amazing" carry the actual information. <strong>A much more useful representation for a classifier.</strong></p>'
+ '</div></div>'

/* Plotly: BoW vs TF-IDF */
+ '<div class="plotly-graph"><div id="plot-bow-tfidf-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["movie","truly","amazing","terrible","enjoy","recommend","everyone"];'
+ 'var bow=[1,1,1,0,0,0,0];'
+ 'var tfidf=[0.00,1.10,0.41,0.00,0.00,0.00,0.00];'
+ 'var t1={x:k,y:bow,name:"BoW",type:"bar",marker:{color:"rgba(128,128,128,.5)"}};'
+ 'var t2={x:k,y:tfidf,name:"TF-IDF",type:"bar",marker:{color:T.accent}};'
+ 'var layout={title:{text:"Review 1: BoW vs TF-IDF word weights",font:{color:T.text,size:13}},barmode:"group",xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Weight"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-bow-tfidf-en"))Plotly.newPlot("plot-bow-tfidf-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Review 1 word weights under BoW (grey) and TF-IDF (coloured). BoW gives "movie", "truly", "amazing" equal weight. TF-IDF zeroes out "movie" (appears everywhere), gives "truly" the highest score (only in one document), and "amazing" a medium score (in two documents). For a classifier, "movie" is no signal at all; "truly" and "amazing" carry the real signal.</div>'

/* 8. Python */
+ '<h2 class="l-title">8. Python — Doing It with sklearn</h2>'

+ '<p class="l-text">Computing all of this by hand is good for learning, but in real projects we use the prebuilt tools in <strong>sklearn</strong>. Two production-quality, optimised, sparse-matrix-aware classes:</p>'

+ '<ul class="l-list">'
+ '<li><code>CountVectorizer</code> — produces a BoW matrix.</li>'
+ '<li><code>TfidfVectorizer</code> — produces a TF-IDF matrix.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Bag-of-Words with sklearn</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> CountVectorizer<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> CountVectorizer'
+ '\n'
+ '\ncorpus = ['
+ '\n    <span class="str">"This movie was truly amazing"</span>,'
+ '\n    <span class="str">"The movie was terrible did not enjoy"</span>,'
+ '\n    <span class="str">"Amazing movie recommend it to everyone"</span>,'
+ '\n]'
+ '\n'
+ '\nvectorizer = <span class="fn">CountVectorizer</span>()'
+ '\nX = vectorizer.<span class="fn">fit_transform</span>(corpus)'
+ '\n'
+ '\n<span class="fn">print</span>(vectorizer.<span class="fn">get_feature_names_out</span>())'
+ '\n<span class="cm"># [\'amazing\' \'did\' \'enjoy\' \'everyone\' \'it\' \'movie\' ...]</span>'
+ '\n<span class="fn">print</span>(X.<span class="fn">toarray</span>())'
+ '\n<span class="cm"># Each row a review, each column a word, cells are counts</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Creates a <code>CountVectorizer</code> and feeds it our list of three reviews via <code>fit_transform</code>. This call does two things: first it learns the vocabulary (<code>fit</code>), then it converts each document to a count vector (<code>transform</code>). The output is a sparse matrix — call <code>.toarray()</code> to see the dense version. <code>get_feature_names_out()</code> tells you which column corresponds to which word.</p>'

+ '<h3 class="l-subtitle">TF-IDF with sklearn</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> TfidfVectorizer<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer'
+ '\n'
+ '\nvectorizer = <span class="fn">TfidfVectorizer</span>()'
+ '\nX = vectorizer.<span class="fn">fit_transform</span>(corpus)'
+ '\n'
+ '\n<span class="cm"># X[0] = TF-IDF vector for Review 1</span>'
+ '\n<span class="fn">print</span>(X[<span class="num">0</span>].<span class="fn">toarray</span>().<span class="fn">round</span>(<span class="num">3</span>))'
+ '\n<span class="cm"># High scores: "truly", "amazing"; "movie" gets a low score (everywhere)</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Vectorises the same corpus with <code>TfidfVectorizer</code>. The API is identical — only the class name changes. The output is no longer 0/1 counts but decimal TF-IDF scores. By default sklearn applies L2 normalisation, so values stay between 0 and 1. We can hand this vector directly to the classifiers in <a href="/tutorials/ai/nlp/text-classification">Lesson 3</a>.</p>'

/* 9. Practical tips */
+ '<h2 class="l-title">9. Practical Tips</h2>'

+ '<p class="l-text">CountVectorizer and TfidfVectorizer have many parameters. The most commonly used:</p>'

+ '<ul class="l-list">'
+ '<li><code>ngram_range=(1, 2)</code>: include both unigrams and bigrams. Usually a clear improvement for sentiment.</li>'
+ '<li><code>min_df=2</code>: ignore words that appear in fewer than two documents. Filters out rare typos.</li>'
+ '<li><code>max_df=0.95</code>: ignore words that appear in more than 95% of documents. Catches stop words you missed.</li>'
+ '<li><code>max_features=5000</code>: cap the vocabulary at the top 5,000 most frequent words. Important for speed and memory on large corpora.</li>'
+ '<li><code>stop_words=...</code>: pass your own stop word list (sklearn does not ship a Turkish list — provide your own).</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">A PRACTICAL CONFIG</div><div class="example-body">'
+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Good starting point for sentiment<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code>vectorizer = <span class="fn">TfidfVectorizer</span>('
+ '\n    ngram_range=(<span class="num">1</span>, <span class="num">2</span>),     <span class="cm"># unigrams + bigrams</span>'
+ '\n    min_df=<span class="num">2</span>,              <span class="cm"># word must appear in at least 2 docs</span>'
+ '\n    max_df=<span class="num">0.95</span>,           <span class="cm"># drop words in >95% of corpus</span>'
+ '\n    max_features=<span class="num">10000</span>,    <span class="cm"># keep top 10k ngrams</span>'
+ '\n)'
+ '\nX = vectorizer.<span class="fn">fit_transform</span>(corpus)</code></pre></div></div>'
+ '<p class="l-text" style="margin-top:.8rem"><strong>What this config does:</strong> Counts both single words and consecutive word pairs (n-grams), automatically filters rare typos and ubiquitous words like "movie", caps the vocabulary at 10,000 ngrams. A balanced, fast starting point for most sentiment problems.</p>'
+ '</div></div>'

/* 10. Next */
+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">You can now turn the clean tokens from <a href="/tutorials/ai/nlp/text-preprocessing">Lesson 1</a> into numerical vectors. Each of the three reviews in our mini corpus is now a vector — with TF-IDF scores. In <a href="/tutorials/ai/nlp/text-classification">Lesson 3</a> we plug those vectors into a real machine learning model: <strong>Naive Bayes</strong> and <strong>logistic regression</strong> to predict whether a movie review is positive or negative. The classical golden age of NLP starts here.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Why we need to turn tokens into numbers. Why a naïve word-to-index dictionary does not work. What Bag-of-Words is — you computed its matrix by hand on a mini corpus. The limits of BoW (lost word order, no negation handling, length effect, equal weights). How n-grams partially recover word order. How TF-IDF zeroes out ubiquitous words and surfaces rare informative ones, both via formula and by hand on the mini corpus. How sklearn\'s <code>CountVectorizer</code> and <code>TfidfVectorizer</code> turn this into real code, and which parameters matter in practice.</div>'

};
