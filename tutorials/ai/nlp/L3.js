/* nlp-new-L3.js — NLP Course Lesson 3: Klasik Sınıflandırıcılar — Naive Bayes & Lojistik Regresyon (TR + EN) */
var NLP_L3 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/ai/nlp/bow-tfidf-ngrams">Ders 2</a>\'de cümleleri TF-IDF vektörlerine çevirdik. Şimdi bu vektörleri ilk gerçek makine öğrenmesi modeline bağlayacağız. İki klasik sınıflandırıcıyı — <strong>Naive Bayes</strong> ve <strong>Lojistik Regresyon</strong> — sezgi, formül ve mini corpus üzerinde elle hesaplamayla göreceğiz. Ardından sklearn ile gerçek koda dökeceğiz, doğru/yanlış tahminleri bir karışıklık matrisi (confusion matrix) ile inceleyeceğiz.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Bayes teoremiyle Multinomial Naive Bayes sınıflandırıcısının formülünü türetmeyi</li>'
+ '<li>Mini film yorumu corpusunda Naive Bayes\'i Laplace smoothing ile elle hesaplamayı</li>'
+ '<li>Lojistik regresyonun sigmoid fonksiyonunu ve cross-entropy kaybını uygulamayı</li>'
+ '<li>sklearn ile MultinomialNB ve LogisticRegression\'ı TF-IDF üstünde eğitmeyi</li>'
+ '<li>Confusion matrix, precision, recall ve F1 ile model performansını değerlendirmeyi</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Sınıflandırma Nedir?</h2>'

+ '<p class="l-text"><strong>Sınıflandırma</strong>, bir girdiyi önceden tanımlı sınıflardan birine atama işidir. Film yorumu örneğimizde sınıflar <em>olumlu</em> ve <em>olumsuz</em>. Spam tespitinde <em>spam</em> ve <em>spam değil</em>. Haber kategorilemede <em>spor, ekonomi, siyaset, kültür</em>. Hepsinde aynı yapı: girdi → model → sınıf etiketi.</p>'

+ '<p class="l-text">Bizim girdimiz <a href="/tutorials/ai/nlp/bow-tfidf-ngrams">Ders 2</a>\'den geliyor: bir film yorumunun TF-IDF vektörü. Çıktımız iki sınıftan biri olacak. Mini corpus\'umuzu hatırlayalım:</p>'

+ '<div class="calc-example"><div class="example-label">EĞİTİM VERİSİ — 3 ETİKETLİ YORUM</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Yorum 1: <code>"Bu film gerçekten harikaydı."</code> &nbsp;→&nbsp; <strong>olumlu</strong>'
+ '<br>Yorum 2: <code>"Film çok kötüydü, beğenmedim."</code> &nbsp;→&nbsp; <strong>olumsuz</strong>'
+ '<br>Yorum 3: <code>"Film harika, herkese tavsiye ederim."</code> &nbsp;→&nbsp; <strong>olumlu</strong>'
+ '</p>'
+ '<p class="l-text">Modelden istediğimiz: dördüncü, görmediği bir yoruma bakıp olumlu mu olumsuz mu olduğunu söylesin.</p>'
+ '</div></div>'

+ '<p class="l-text">Sınıflandırma <strong>denetimli öğrenme</strong> (supervised learning) olarak adlandırılır — çünkü modele örneklerle birlikte <em>doğru cevapları</em> da gösteriyoruz. Model bu eşlemeyi öğreniyor, sonra yeni veride tahmin yapıyor.</p>'

+ '<h2 class="l-title">2. Bayes Teoremi — Sezgi</h2>'

+ '<p class="l-text">Naive Bayes\'i anlamak için <strong>Bayes teoremi</strong>nden başlamamız gerek. Sezgi şudur: bir olay hakkında ön bilgimiz (önsel olasılık) varsa ve yeni kanıtlar geliyorsa, o ön bilgiyi kanıtların ışığında güncelleriz.</p>'

+ '<div class="calc-example"><div class="example-label">GÜNLÜK BİR ÖRNEK</div><div class="example-body">'
+ '<p class="l-text">Bir hastalık nüfusun %1\'inde görülüyor (önsel olasılık). Bu hastalığı %95 doğrulukla tespit eden bir test var. Test pozitif çıktı — <em>gerçekten hasta mıyım?</em> Cevap birinci bakışta sezgisel değildir. Bayes teoremi bunu net olarak hesaplar:</p>'
+ '<div class="katex-block">$$P(\\text{hasta} \\mid \\text{test+}) = \\frac{P(\\text{test+} \\mid \\text{hasta}) \\cdot P(\\text{hasta})}{P(\\text{test+})}$$</div>'
+ '<p class="l-text">Önsel olasılık (%1) hesaba katıldığında, "test pozitif" çıkmış olsa bile aslında hasta olma olasılığın belki %16. Bu ezberden değil hesaptan gelir.</p>'
+ '</div></div>'

+ '<p class="l-text">NLP\'de aynı yapıyı kullanırız. Bir yorumdaki kelimeleri "test sonuçları" gibi düşünürüz. Olumlu/olumsuz olma olasılığını bu kelimeler verildiğinde güncelleriz:</p>'

+ '<div class="katex-block">$$P(c \\mid w_1, \\dots, w_n) = \\frac{P(w_1, \\dots, w_n \\mid c) \\cdot P(c)}{P(w_1, \\dots, w_n)}$$</div>'

+ '<h2 class="l-title">3. Naive Bayes Sınıflandırıcı</h2>'

+ '<p class="l-text"><strong>Naive Bayes</strong>, Bayes teoreminin NLP\'ye uyarlanmış basit ve şaşırtıcı derecede etkili bir versiyonudur. "Naive" (saf) sıfatını şu güçlü varsayımdan alır: <em>her kelime, sınıf verildiğinde diğer kelimelerden bağımsızdır.</em> Bu varsayım gerçeklikte doğru değildir ("güzel" ve "harika" ilişkili kelimelerdir), ama pratikte modeli işe yarar bir hâle getirir.</p>'

+ '<p class="l-text">Bu varsayımla formül basit bir çarpıma indirgenir:</p>'

+ '<div class="katex-block">$$P(c \\mid d) \\propto P(c) \\cdot \\prod_{i=1}^{n} P(w_i \\mid c)$$</div>'

+ '<p class="l-text">Yani bir yorumun olumlu olma olasılığı:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Önsel olasılık</strong> P(olumlu) — eğitim setinde olumluların oranı.</li>'
+ '<li><strong>Olabilirlik</strong> ∏ P(kelime | olumlu) — yorumdaki her kelimenin olumlu sınıfta görülme olasılıklarının çarpımı.</li>'
+ '<li>Aynısını "olumsuz" için hesaplarız. Hangisi büyükse o sınıfa atarız.</li>'
+ '</ul>'

+ '<p class="l-text">Pratikte sayılar çok küçüldüğü için (çok küçük olasılıklar çarpılınca taşma olur) <strong>logaritma</strong> alırız. Çarpım toplama dönüşür:</p>'

+ '<div class="katex-block">$$\\log P(c \\mid d) \\propto \\log P(c) + \\sum_{i=1}^{n} \\log P(w_i \\mid c)$$</div>'

+ '<h2 class="l-title">4. Mini Corpus Üzerinde Manuel Hesap</h2>'

+ '<p class="l-text">Üç yorumumuzla küçük bir Naive Bayes modeli kuralım. Önce kelime sayımları:</p>'

+ '<div class="calc-example"><div class="example-label">KELİME SAYIMLARI (TOKENİZE EDİLMİŞ)</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Olumlu sınıf (Y1, Y3): <code>["film", "gerçek", "harika", "film", "harika", "herkes", "tavsiye"]</code> — toplam 7 token'
+ '<br>Olumsuz sınıf (Y2): <code>["film", "kötü", "beğen"]</code> — toplam 3 token'
+ '</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Önsel olasılıklar</h3>'

+ '<p class="l-text">Üç yorumdan ikisi olumlu, biri olumsuz:</p>'

+ '<div class="katex-block">$$P(\\text{olumlu}) = \\tfrac{2}{3} \\approx 0.67 \\qquad P(\\text{olumsuz}) = \\tfrac{1}{3} \\approx 0.33$$</div>'

+ '<h3 class="l-subtitle">Kelime olasılıkları (Laplace düzeltmeli)</h3>'

+ '<p class="l-text">Bir kelime sınıfta hiç görünmemişse olasılığı 0 olur ve tüm çarpım 0 olur. Bunu önlemek için <strong>Laplace düzeltmesi</strong> kullanırız: her kelimenin sayısına 1 ekleriz, paydaya da kelime dağarcığı boyutunu (V=7) ekleriz:</p>'

+ '<div class="katex-block">$$P(w \\mid c) = \\frac{\\text{count}(w, c) + 1}{N_c + V}$$</div>'

+ '<p class="l-text">Mesela "harika" kelimesi olumlu sınıfta 2 kez geçti, toplam token sayısı 7, dağarcık boyutu V=7:</p>'

+ '<div class="katex-block">$$P(\\text{harika} \\mid \\text{olumlu}) = \\frac{2 + 1}{7 + 7} = \\frac{3}{14} \\approx 0.214$$</div>'

+ '<h3 class="l-subtitle">Yeni bir yorumu sınıflandırma</h3>'

+ '<p class="l-text">Diyelim ki yeni yorum geldi: <code>"film harika"</code> — token\'ları: <code>["film", "harika"]</code>. Bu olumlu mu olumsuz mu?</p>'

+ '<div class="calc-example"><div class="example-label">SKOR HESABI (LOG OLASILIKLARLA)</div><div class="example-body">'
+ '<p class="l-text"><strong>Olumlu skoru:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">log(2/3) + log P(film|olumlu) + log P(harika|olumlu)</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">= log(0.67) + log(3/14) + log(3/14)</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">≈ -0.40 + (-1.54) + (-1.54) = <strong>-3.48</strong></p>'
+ '<p class="l-text" style="margin-top:.8rem"><strong>Olumsuz skoru:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">log(1/3) + log P(film|olumsuz) + log P(harika|olumsuz)</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">= log(0.33) + log(2/10) + log(1/10)</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">≈ -1.10 + (-1.61) + (-2.30) = <strong>-5.01</strong></p>'
+ '<p class="l-text" style="margin-top:1rem"><strong>Sonuç:</strong> Olumlu skor (-3.48) > Olumsuz skor (-5.01). Model "film harika" yorumunu <strong>olumlu</strong> olarak sınıflandırır. Sezgimizle örtüşür: "harika" kelimesi olumlu sınıfta sık, olumsuzda neredeyse hiç yok.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. Lojistik Regresyon — Ağırlıklı Oylama</h2>'

+ '<p class="l-text">Naive Bayes olasılıklara dayalıydı. <strong>Lojistik regresyon</strong> farklı bir bakış açısı kullanır: her kelimeye bir <em>ağırlık</em> atar, yorumun ağırlıklı toplamını alır, sonucu 0-1 arasındaki bir olasılığa sıkıştırır.</p>'

+ '<p class="l-text">Sezgi şöyle: olumlu sınıfı işaret eden kelimelere pozitif ağırlık (örneğin "harika": +1.5), olumsuz sınıfı işaret edenlere negatif ağırlık ("kötü": -1.8) verilir. Yorumdaki kelimelerin ağırlıkları toplanır, sonuç pozitifse olumlu, negatifse olumsuz tahmin edilir.</p>'

+ '<div class="calc-example"><div class="example-label">SEZGİSEL ÖRNEK — KELİME AĞIRLIKLARI</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Kelime</th><th style="padding:.5rem">Ağırlık (eğitim sonrası)</th><th style="padding:.5rem">Anlam</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">harika</td><td style="text-align:center">+1.5</td><td style="padding:.5rem;color:var(--text-dim)">güçlü olumlu sinyal</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">tavsiye</td><td style="text-align:center">+1.2</td><td style="padding:.5rem;color:var(--text-dim)">olumlu sinyal</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">film</td><td style="text-align:center">+0.05</td><td style="padding:.5rem;color:var(--text-dim)">neredeyse nötr (her yerde)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">kötü</td><td style="text-align:center">-1.8</td><td style="padding:.5rem;color:var(--text-dim)">güçlü olumsuz sinyal</td></tr>'
+ '<tr><td style="padding:.5rem">beğen (\'me\' eki ile)</td><td style="text-align:center">-1.4</td><td style="padding:.5rem;color:var(--text-dim)">olumsuz sinyal</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h2 class="l-title">6. Lojistik Regresyon Formülü</h2>'

+ '<p class="l-text">Lojistik regresyon iki adımdan oluşur:</p>'

+ '<h3 class="l-subtitle">Adım 1: ağırlıklı toplam (lineer skor)</h3>'

+ '<div class="katex-block">$$z = w_1 x_1 + w_2 x_2 + \\cdots + w_n x_n + b$$</div>'

+ '<p class="l-text"><em>x<sub>i</sub></em> kelimenin TF-IDF değeri, <em>w<sub>i</sub></em> öğrenilmiş ağırlığı, <em>b</em> bias terimidir. Sonuç <em>z</em> herhangi bir reel sayı olabilir.</p>'

+ '<h3 class="l-subtitle">Adım 2: sigmoid ile olasılığa çevirme</h3>'

+ '<p class="l-text">Bu reel sayıyı 0-1 arasına sıkıştırmak için <strong>sigmoid</strong> fonksiyonu kullanırız:</p>'

+ '<div class="katex-block">$$P(\\text{olumlu} \\mid d) = \\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>'

+ '<ul class="l-list">'
+ '<li><em>z</em> büyük pozitifse, σ(z) → 1 (yüksek olasılıkla olumlu)</li>'
+ '<li><em>z</em> büyük negatifse, σ(z) → 0 (yüksek olasılıkla olumsuz)</li>'
+ '<li><em>z = 0</em> ise σ(z) = 0.5 (kararsız)</li>'
+ '</ul>'

+ '<p class="l-text">Karar eşiği genelde 0.5\'tir: olasılık &gt; 0.5 ise olumlu, değilse olumsuz tahmin edilir.</p>'

+ '<h2 class="l-title">7. Eğitim — Doğru Ağırlıkları Bulmak</h2>'

+ '<p class="l-text">Lojistik regresyon ağırlıkları (<em>w<sub>i</sub></em>) baştan rastgele başlar. Eğitim sürecinde model, eğitim verisindeki örnekleri kullanarak bu ağırlıkları kademeli olarak günceller. Amaç: modelin verdiği olasılıklarla gerçek etiketler arasındaki farkı en aza indirmek.</p>'

+ '<h3 class="l-subtitle">Kayıp fonksiyonu (cross-entropy)</h3>'

+ '<p class="l-text">Modelin ne kadar yanıldığını ölçen fonksiyona <strong>kayıp (loss)</strong> denir. Lojistik regresyon için standart kayıp <em>çapraz entropi</em>dir:</p>'

+ '<div class="katex-block">$$\\mathcal{L} = -\\bigl[\\, y \\log p + (1-y)\\log(1-p)\\,\\bigr]$$</div>'

+ '<p class="l-text">Burada <em>y</em> gerçek etiket (1=olumlu, 0=olumsuz), <em>p</em> modelin tahmin ettiği olasılık. Model emin ve doğruysa kayıp düşük, emin ve yanlışsa kayıp yüksek.</p>'

+ '<h3 class="l-subtitle">Gradyan iniş (gradient descent)</h3>'

+ '<p class="l-text">Kaybı azaltmak için ağırlıkları nasıl güncelleyelim? Cevap: <strong>kayıp fonksiyonunun gradyanı yönünde değil, ters yönünde</strong> küçük adımlar atarak. Her örneği gördükten sonra ağırlıklar şöyle güncellenir:</p>'

+ '<div class="katex-block">$$w_i \\leftarrow w_i - \\eta \\cdot \\frac{\\partial \\mathcal{L}}{\\partial w_i}$$</div>'

+ '<p class="l-text"><em>η</em> (eta) <strong>öğrenme oranı</strong>dır — adım büyüklüğünü kontrol eder. Çok büyükse model dengesizleşir, çok küçükse eğitim çok uzun sürer. Tipik değerler 0.001–0.1 arasında.</p>'

+ '<div class="l-note"><strong>Sezgi:</strong> Kayıp fonksiyonunu eğimli bir vadi gibi düşün. Top en alt noktayı arıyor (en düşük kayıp). Her adımda eğimin aşağı yönüne küçük bir hareket yapıyor. Yeterince adımdan sonra vadinin dibine ulaşıyor — burada ağırlıklar eğitim verisine en iyi uyum sağlamış oluyor.</div>'

+ '<h2 class="l-title">8. Python\'da Pratik — sklearn ile</h2>'

+ '<p class="l-text">Yukarıdaki tüm matematiği elle yapmak öğrenmek için iyi, ama pratikte sklearn\'in hazır sınıflarını kullanırız. <code>MultinomialNB</code> ve <code>LogisticRegression</code> tek satırlık API ile gelir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Naive Bayes ile sınıflandırma<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer'
+ '\n<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB'
+ '\n'
+ '\nyorumlar = ['
+ '\n    <span class="str">"Bu film gerçekten harikaydı"</span>,'
+ '\n    <span class="str">"Film çok kötüydü beğenmedim"</span>,'
+ '\n    <span class="str">"Film harika herkese tavsiye ederim"</span>,'
+ '\n]'
+ '\netiketler = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>]  <span class="cm"># 1=olumlu, 0=olumsuz</span>'
+ '\n'
+ '\nvect = <span class="fn">TfidfVectorizer</span>()'
+ '\nX = vect.<span class="fn">fit_transform</span>(yorumlar)'
+ '\n'
+ '\nmodel = <span class="fn">MultinomialNB</span>()'
+ '\nmodel.<span class="fn">fit</span>(X, etiketler)'
+ '\n'
+ '\n<span class="cm"># Yeni bir yorumu sınıflandır</span>'
+ '\nyeni = vect.<span class="fn">transform</span>([<span class="str">"film harika"</span>])'
+ '\n<span class="fn">print</span>(model.<span class="fn">predict</span>(yeni))   <span class="cm"># [1] → olumlu</span>'
+ '\n<span class="fn">print</span>(model.<span class="fn">predict_proba</span>(yeni))  <span class="cm"># olasılıklar</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Üç yorumdan oluşan bir eğitim setini TF-IDF\'ye çevirir ve etiketlerle birlikte <code>MultinomialNB</code>\'ye verir. Model <code>fit</code> çağrısıyla tüm kelime olasılıklarını hesaplar. Ardından yeni "film harika" yorumu aynı vectorizer\'dan geçirilir (önemli — eğitim aynı sözlüğü kullanmak için <code>transform</code>) ve model bunu sınıflandırır. <code>predict_proba</code> her sınıfın olasılığını döner.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Lojistik regresyon ile sınıflandırma<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n'
+ '\nmodel = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)'
+ '\nmodel.<span class="fn">fit</span>(X, etiketler)'
+ '\n'
+ '\n<span class="cm"># Hangi kelime hangi yöne çekiyor?</span>'
+ '\nfeature_names = vect.<span class="fn">get_feature_names_out</span>()'
+ '\ncoefs = model.coef_[<span class="num">0</span>]'
+ '\n<span class="kw">for</span> word, coef <span class="kw">in</span> <span class="fn">zip</span>(feature_names, coefs):'
+ '\n    <span class="fn">print</span>(<span class="str">f"{word:15} {coef:+.3f}"</span>)'
+ '\n<span class="cm"># harika    +0.821</span>'
+ '\n<span class="cm"># tavsiye   +0.621</span>'
+ '\n<span class="cm"># kötü      -0.945</span>'
+ '\n<span class="cm"># beğenmedim -0.812</span>'
+ '\n<span class="cm"># film       +0.012</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Aynı eğitim verisiyle bir <code>LogisticRegression</code> modeli eğitir. Eğitim sonrası <code>model.coef_</code> her kelimenin öğrenilmiş ağırlığını verir. Pozitif değerler olumlu sınıfa, negatif değerler olumsuz sınıfa çeken kelimelerdir. Bu lojistik regresyonun en güzel yanlarından biri: <strong>yorumlanabilir</strong> — modelin neyi neden tahmin ettiğini ağırlıklara bakarak anlayabiliriz.</p>'

+ '<h2 class="l-title">9. Değerlendirme — Train/Test ve Confusion Matrix</h2>'

+ '<p class="l-text">Bir modelin gerçek dünyada işe yarayıp yaramadığını ölçmek için onu <strong>görmediği veride</strong> test etmemiz gerekir. Eğitimde kullandığımız veri üzerinde model çok iyi puan alabilir, ama bu ezber olabilir. Bu yüzden veriyi <strong>eğitim (train)</strong> ve <strong>test</strong> olmak üzere ikiye böleriz — genelde 80/20 veya 70/30 oranında.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Train/test split + accuracy<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, confusion_matrix'
+ '\n'
+ '\nX_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>('
+ '\n    X, etiketler, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>'
+ '\n)'
+ '\n'
+ '\nmodel = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(X_train, y_train)'
+ '\ny_pred = model.<span class="fn">predict</span>(X_test)'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="str">"Accuracy:"</span>, <span class="fn">accuracy_score</span>(y_test, y_pred))'
+ '\n<span class="fn">print</span>(<span class="fn">confusion_matrix</span>(y_test, y_pred))'
+ '\n<span class="cm"># [[TN  FP]</span>'
+ '\n<span class="cm">#  [FN  TP]]</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Veriyi %80 eğitim, %20 test olarak böler. Modeli sadece eğitim setiyle eğitir. Test seti üzerinde tahmin yapar ve bunları gerçek etiketlerle karşılaştırır. <strong>Accuracy</strong> doğru tahminlerin oranıdır. <strong>Confusion matrix</strong> hangi sınıfı hangi sınıfla karıştırdığını gösteren bir tablodur:</p>'

+ '<ul class="l-list">'
+ '<li><strong>TP</strong> (true positive): gerçekten olumlu, model olumlu dedi ✓</li>'
+ '<li><strong>TN</strong> (true negative): gerçekten olumsuz, model olumsuz dedi ✓</li>'
+ '<li><strong>FP</strong> (false positive): gerçekte olumsuz, model olumlu dedi (yanılma)</li>'
+ '<li><strong>FN</strong> (false negative): gerçekte olumlu, model olumsuz dedi (yanılma)</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-cls-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["harika","tavsiye","gerçek","film","beğenmedim","kötü"];'
+ 'var coefs=[0.82,0.62,0.45,0.05,-0.81,-0.94];'
+ 'var colors=coefs.map(function(c){return c>=0?T.accent:"rgba(248,113,113,0.85)";});'
+ 'var t1={x:k,y:coefs,type:"bar",marker:{color:colors}};'
+ 'var layout={title:{text:"Lojistik regresyon: kelime ağırlıkları",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Ağırlık (w)",zerolinecolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:80,l:60}};'
+ 'if(document.getElementById("plot-cls-tr"))Plotly.newPlot("plot-cls-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne gösteriyor:</strong> Eğitim sonrası lojistik regresyon her kelimeye bir ağırlık atadı. Pozitif ağırlıklı (renkli) kelimeler olumlu sınıfı işaret ediyor; negatif ağırlıklı (kırmızı) kelimeler olumsuzu. "kötü" en güçlü olumsuz sinyal, "harika" en güçlü olumlu sinyal. "film" neredeyse nötr — her sınıfta var olduğu için ayırt edici değil. Modelin <em>ne öğrendiğini</em> bu kadar açık görmek lojistik regresyonun en büyük avantajlarından biri.</div>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Artık temizlenmiş, sayılaştırılmış ve sınıflandırılmış metinlerle çalışabiliyorsun. Naive Bayes ve lojistik regresyon klasik NLP\'nin temel taşlarıdır — pek çok pratik problemde hâlâ ilk denenen modeller. <a href="/tutorials/ai/nlp/sentiment-analysis">Ders 4</a>\'te bu yöntemleri en yaygın kullanım alanlarından birine — <strong>duygu analizi</strong>na — uygulayacağız. Türkçe yorum verisi üzerinde tam bir uçtan uca pipeline kuracağız: ön işleme, vektörleştirme, sınıflandırma, değerlendirme.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Sınıflandırmanın ne olduğunu, denetimli öğrenmenin temel yapısını öğrendin. Bayes teoreminin sezgisini ve Naive Bayes\'in NLP\'ye nasıl uyarlandığını gördün. Mini corpus üzerinde Naive Bayes hesabını elle yaptın, Laplace düzeltmesinin ne işe yaradığını anladın. Lojistik regresyonu farklı bir bakış açısı olarak — ağırlıklı oylama + sigmoid — kavradın. Cross-entropy kaybını ve gradyan inişin temel mantığını öğrendin. sklearn ile her iki modeli pratiğe döktün ve karşılaştırdın. Train/test ayırma, accuracy ve confusion matrix ile model değerlendirmesini öğrendin.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/ai/nlp/bow-tfidf-ngrams">Lesson 2</a> we turned sentences into TF-IDF vectors. Now we connect those vectors to our first real machine learning models. We will see two classical classifiers — <strong>Naive Bayes</strong> and <strong>Logistic Regression</strong> — through intuition, formula, and hand calculations on the mini corpus. Then we drop into real code with sklearn, evaluate predictions, and read a confusion matrix.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Derive the Multinomial Naive Bayes formula from Bayes theorem</li>'
+ '<li>Hand-compute Naive Bayes with Laplace smoothing on a mini movie review corpus</li>'
+ '<li>Apply the logistic regression sigmoid and cross-entropy loss function</li>'
+ '<li>Train MultinomialNB and LogisticRegression on TF-IDF features in sklearn</li>'
+ '<li>Evaluate performance with a confusion matrix, precision, recall, and F1</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. What is Classification?</h2>'

+ '<p class="l-text"><strong>Classification</strong> is the task of assigning an input to one of a predefined set of classes. In our movie review example the classes are <em>positive</em> and <em>negative</em>. In spam detection: <em>spam</em> and <em>not spam</em>. In news categorisation: <em>sports, business, politics, culture</em>. Same shape: input → model → class label.</p>'

+ '<p class="l-text">Our input comes from <a href="/tutorials/ai/nlp/bow-tfidf-ngrams">Lesson 2</a>: a TF-IDF vector of a movie review. Our output is one of two classes. Recall the mini corpus:</p>'

+ '<div class="calc-example"><div class="example-label">TRAINING DATA — 3 LABELLED REVIEWS</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Review 1: <code>"This movie was truly amazing."</code> &nbsp;→&nbsp; <strong>positive</strong>'
+ '<br>Review 2: <code>"The movie was terrible, did not enjoy."</code> &nbsp;→&nbsp; <strong>negative</strong>'
+ '<br>Review 3: <code>"Amazing movie, recommend it to everyone."</code> &nbsp;→&nbsp; <strong>positive</strong>'
+ '</p>'
+ '<p class="l-text">What we want from the model: given a fourth, unseen review, predict positive or negative.</p>'
+ '</div></div>'

+ '<p class="l-text">Classification is called <strong>supervised learning</strong> — because we provide the model with examples paired with their correct labels. The model learns this mapping, then predicts on new data.</p>'

+ '<h2 class="l-title">2. Bayes\' Theorem — Intuition</h2>'

+ '<p class="l-text">To understand Naive Bayes we start with <strong>Bayes\' theorem</strong>. The intuition: when we have a prior belief about an event and new evidence arrives, we update that belief in light of the evidence.</p>'

+ '<div class="calc-example"><div class="example-label">EVERYDAY EXAMPLE</div><div class="example-body">'
+ '<p class="l-text">A disease occurs in 1% of the population (the prior). A test detects it with 95% accuracy. Your test came back positive — <em>are you actually sick?</em> The intuitive answer is wrong. Bayes\' theorem computes it cleanly:</p>'
+ '<div class="katex-block">$$P(\\text{sick} \\mid \\text{test+}) = \\frac{P(\\text{test+} \\mid \\text{sick}) \\cdot P(\\text{sick})}{P(\\text{test+})}$$</div>'
+ '<p class="l-text">When you factor in the prior (1%), even after a positive test the actual probability of being sick is around 16%. This comes from the math, not from intuition.</p>'
+ '</div></div>'

+ '<p class="l-text">In NLP we apply the same structure. We treat the words in a review like "test results". We update the probability of being positive/negative given those words:</p>'

+ '<div class="katex-block">$$P(c \\mid w_1, \\dots, w_n) = \\frac{P(w_1, \\dots, w_n \\mid c) \\cdot P(c)}{P(w_1, \\dots, w_n)}$$</div>'

+ '<h2 class="l-title">3. The Naive Bayes Classifier</h2>'

+ '<p class="l-text"><strong>Naive Bayes</strong> is a simple and surprisingly effective adaptation of Bayes\' theorem to NLP. It earns the "naive" label from a strong assumption: <em>each word is independent of every other word, given the class.</em> This assumption is not actually true ("good" and "amazing" are correlated), but in practice it makes the model usable and effective.</p>'

+ '<p class="l-text">With this assumption the formula collapses into a simple product:</p>'

+ '<div class="katex-block">$$P(c \\mid d) \\propto P(c) \\cdot \\prod_{i=1}^{n} P(w_i \\mid c)$$</div>'

+ '<p class="l-text">So the probability that a review is positive equals:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Prior</strong> P(positive) — the proportion of positives in the training set.</li>'
+ '<li><strong>Likelihood</strong> ∏ P(word | positive) — the product of how likely each word in the review is under the positive class.</li>'
+ '<li>We compute the same for "negative". Whichever is larger is our prediction.</li>'
+ '</ul>'

+ '<p class="l-text">In practice the numbers shrink very fast (multiplying many small probabilities causes underflow), so we take <strong>logs</strong>. Products become sums:</p>'

+ '<div class="katex-block">$$\\log P(c \\mid d) \\propto \\log P(c) + \\sum_{i=1}^{n} \\log P(w_i \\mid c)$$</div>'

+ '<h2 class="l-title">4. Hand Computation on the Mini Corpus</h2>'

+ '<p class="l-text">Let us build a tiny Naive Bayes model with our three reviews. First the word counts:</p>'

+ '<div class="calc-example"><div class="example-label">WORD COUNTS (TOKENIZED)</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Positive class (R1, R3): <code>["movie", "truly", "amazing", "movie", "amazing", "everyone", "recommend"]</code> — 7 tokens'
+ '<br>Negative class (R2): <code>["movie", "terrible", "enjoy"]</code> — 3 tokens'
+ '</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Priors</h3>'

+ '<p class="l-text">Two of three reviews are positive, one negative:</p>'

+ '<div class="katex-block">$$P(\\text{positive}) = \\tfrac{2}{3} \\approx 0.67 \\qquad P(\\text{negative}) = \\tfrac{1}{3} \\approx 0.33$$</div>'

+ '<h3 class="l-subtitle">Word likelihoods (with Laplace smoothing)</h3>'

+ '<p class="l-text">If a word never appears in a class, its probability is 0 and the entire product is 0. To prevent this we use <strong>Laplace smoothing</strong>: add 1 to each word count and add the vocabulary size (V=7) to the denominator:</p>'

+ '<div class="katex-block">$$P(w \\mid c) = \\frac{\\text{count}(w, c) + 1}{N_c + V}$$</div>'

+ '<p class="l-text">For example "amazing" appears 2 times in the positive class (total 7 tokens, V=7):</p>'

+ '<div class="katex-block">$$P(\\text{amazing} \\mid \\text{positive}) = \\frac{2 + 1}{7 + 7} = \\frac{3}{14} \\approx 0.214$$</div>'

+ '<h3 class="l-subtitle">Classifying a new review</h3>'

+ '<p class="l-text">Suppose a new review arrives: <code>"movie amazing"</code> with tokens <code>["movie", "amazing"]</code>. Positive or negative?</p>'

+ '<div class="calc-example"><div class="example-label">SCORE COMPUTATION (LOG PROBABILITIES)</div><div class="example-body">'
+ '<p class="l-text"><strong>Positive score:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">log(2/3) + log P(movie|pos) + log P(amazing|pos)</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">= log(0.67) + log(3/14) + log(3/14)</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">≈ -0.40 + (-1.54) + (-1.54) = <strong>-3.48</strong></p>'
+ '<p class="l-text" style="margin-top:.8rem"><strong>Negative score:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">log(1/3) + log P(movie|neg) + log P(amazing|neg)</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">= log(0.33) + log(2/10) + log(1/10)</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;padding:.5rem 1rem">≈ -1.10 + (-1.61) + (-2.30) = <strong>-5.01</strong></p>'
+ '<p class="l-text" style="margin-top:1rem"><strong>Result:</strong> Positive score (-3.48) > Negative score (-5.01). The model classifies "movie amazing" as <strong>positive</strong>. This matches our intuition: "amazing" is frequent in the positive class and almost absent in the negative.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. Logistic Regression — Weighted Voting</h2>'

+ '<p class="l-text">Naive Bayes was based on probabilities. <strong>Logistic regression</strong> takes a different angle: it assigns each word a <em>weight</em>, sums them across the document, and squashes the result into a probability between 0 and 1.</p>'

+ '<p class="l-text">The intuition: words that signal the positive class get positive weights ("amazing": +1.5), words signalling the negative class get negative weights ("terrible": -1.8). The weights of all words in a review are summed; if the sum is positive predict positive, otherwise negative.</p>'

+ '<div class="calc-example"><div class="example-label">SAMPLE — WORD WEIGHTS</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem;font-family:var(--mono)">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Word</th><th style="padding:.5rem">Weight (after training)</th><th style="padding:.5rem">Meaning</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">amazing</td><td style="text-align:center">+1.5</td><td style="padding:.5rem;color:var(--text-dim)">strong positive signal</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">recommend</td><td style="text-align:center">+1.2</td><td style="padding:.5rem;color:var(--text-dim)">positive signal</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">movie</td><td style="text-align:center">+0.05</td><td style="padding:.5rem;color:var(--text-dim)">nearly neutral (everywhere)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">terrible</td><td style="text-align:center">-1.8</td><td style="padding:.5rem;color:var(--text-dim)">strong negative signal</td></tr>'
+ '<tr><td style="padding:.5rem">enjoy (with not)</td><td style="text-align:center">-1.4</td><td style="padding:.5rem;color:var(--text-dim)">negative signal in context</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h2 class="l-title">6. The Logistic Regression Formula</h2>'

+ '<p class="l-text">Logistic regression has two steps:</p>'

+ '<h3 class="l-subtitle">Step 1: weighted sum (linear score)</h3>'

+ '<div class="katex-block">$$z = w_1 x_1 + w_2 x_2 + \\cdots + w_n x_n + b$$</div>'

+ '<p class="l-text"><em>x<sub>i</sub></em> is the TF-IDF value of a word, <em>w<sub>i</sub></em> its learnt weight, <em>b</em> is the bias. The result <em>z</em> can be any real number.</p>'

+ '<h3 class="l-subtitle">Step 2: turn it into a probability with sigmoid</h3>'

+ '<p class="l-text">To squash that real number into 0–1 we apply the <strong>sigmoid</strong> function:</p>'

+ '<div class="katex-block">$$P(\\text{positive} \\mid d) = \\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>'

+ '<ul class="l-list">'
+ '<li>Large positive <em>z</em>, σ(z) → 1 (high probability of positive)</li>'
+ '<li>Large negative <em>z</em>, σ(z) → 0 (high probability of negative)</li>'
+ '<li><em>z = 0</em> gives σ(z) = 0.5 (uncertain)</li>'
+ '</ul>'

+ '<p class="l-text">The decision threshold is usually 0.5: probability &gt; 0.5 → predict positive, otherwise negative.</p>'

+ '<h2 class="l-title">7. Training — Finding the Right Weights</h2>'

+ '<p class="l-text">Logistic regression weights (<em>w<sub>i</sub></em>) start randomly. During training the model uses the training examples to update them gradually. The goal: minimise the difference between the model\'s predicted probabilities and the actual labels.</p>'

+ '<h3 class="l-subtitle">Loss function (cross-entropy)</h3>'

+ '<p class="l-text">The function that measures how wrong the model is is called the <strong>loss</strong>. For logistic regression the standard loss is <em>cross-entropy</em>:</p>'

+ '<div class="katex-block">$$\\mathcal{L} = -\\bigl[\\, y \\log p + (1-y)\\log(1-p)\\,\\bigr]$$</div>'

+ '<p class="l-text">Where <em>y</em> is the actual label (1=positive, 0=negative) and <em>p</em> is the model\'s predicted probability. Confident and correct → low loss; confident and wrong → high loss.</p>'

+ '<h3 class="l-subtitle">Gradient descent</h3>'

+ '<p class="l-text">How do we update the weights to reduce loss? Answer: take small steps <strong>in the opposite direction of the gradient</strong> of the loss function. After seeing each example, update:</p>'

+ '<div class="katex-block">$$w_i \\leftarrow w_i - \\eta \\cdot \\frac{\\partial \\mathcal{L}}{\\partial w_i}$$</div>'

+ '<p class="l-text"><em>η</em> (eta) is the <strong>learning rate</strong> — it controls the step size. Too large and training becomes unstable; too small and it takes forever. Typical values are 0.001–0.1.</p>'

+ '<div class="l-note"><strong>Intuition:</strong> Picture the loss function as a sloped valley. A ball is rolling toward the lowest point (minimum loss). At each step it moves slightly downhill. After enough steps it reaches the bottom — at this point the weights fit the training data best.</div>'

+ '<h2 class="l-title">8. Practice in Python — with sklearn</h2>'

+ '<p class="l-text">Doing all this math by hand is good for learning, but in practice we use sklearn\'s prebuilt classes. <code>MultinomialNB</code> and <code>LogisticRegression</code> ship with one-line APIs.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Naive Bayes classification<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer'
+ '\n<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB'
+ '\n'
+ '\nreviews = ['
+ '\n    <span class="str">"This movie was truly amazing"</span>,'
+ '\n    <span class="str">"The movie was terrible did not enjoy"</span>,'
+ '\n    <span class="str">"Amazing movie recommend it to everyone"</span>,'
+ '\n]'
+ '\nlabels = [<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>]  <span class="cm"># 1=positive, 0=negative</span>'
+ '\n'
+ '\nvect = <span class="fn">TfidfVectorizer</span>()'
+ '\nX = vect.<span class="fn">fit_transform</span>(reviews)'
+ '\n'
+ '\nmodel = <span class="fn">MultinomialNB</span>()'
+ '\nmodel.<span class="fn">fit</span>(X, labels)'
+ '\n'
+ '\n<span class="cm"># Classify a new review</span>'
+ '\nnew = vect.<span class="fn">transform</span>([<span class="str">"amazing movie"</span>])'
+ '\n<span class="fn">print</span>(model.<span class="fn">predict</span>(new))   <span class="cm"># [1] → positive</span>'
+ '\n<span class="fn">print</span>(model.<span class="fn">predict_proba</span>(new))</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Turns three reviews into TF-IDF vectors and feeds them with their labels to a <code>MultinomialNB</code>. The <code>fit</code> call computes all word probabilities. Then a new review "amazing movie" is passed through the same vectorizer (important — to use the same vocabulary, call <code>transform</code> not <code>fit_transform</code>) and the model classifies it. <code>predict_proba</code> returns the probability for each class.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Logistic regression classification<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n'
+ '\nmodel = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)'
+ '\nmodel.<span class="fn">fit</span>(X, labels)'
+ '\n'
+ '\n<span class="cm"># Which word pulls in which direction?</span>'
+ '\nfeature_names = vect.<span class="fn">get_feature_names_out</span>()'
+ '\ncoefs = model.coef_[<span class="num">0</span>]'
+ '\n<span class="kw">for</span> word, coef <span class="kw">in</span> <span class="fn">zip</span>(feature_names, coefs):'
+ '\n    <span class="fn">print</span>(<span class="str">f"{word:15} {coef:+.3f}"</span>)'
+ '\n<span class="cm"># amazing   +0.821</span>'
+ '\n<span class="cm"># recommend +0.621</span>'
+ '\n<span class="cm"># terrible  -0.945</span>'
+ '\n<span class="cm"># enjoy     -0.812</span>'
+ '\n<span class="cm"># movie     +0.012</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Trains a <code>LogisticRegression</code> on the same data. After training, <code>model.coef_</code> gives the learnt weight per word. Positive values pull toward the positive class; negative values toward the negative class. This is one of the best things about logistic regression: it is <strong>interpretable</strong> — you can read the weights and understand why the model predicts what it predicts.</p>'

+ '<h2 class="l-title">9. Evaluation — Train/Test and Confusion Matrix</h2>'

+ '<p class="l-text">To know whether a model is actually useful in the real world we test it on <strong>data it has not seen</strong>. A model can score perfectly on its training data — that may just be memorisation. So we split the data into <strong>train</strong> and <strong>test</strong> sets — typically 80/20 or 70/30.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Train/test split + accuracy<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, confusion_matrix'
+ '\n'
+ '\nX_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>('
+ '\n    X, labels, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>'
+ '\n)'
+ '\n'
+ '\nmodel = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(X_train, y_train)'
+ '\ny_pred = model.<span class="fn">predict</span>(X_test)'
+ '\n'
+ '\n<span class="fn">print</span>(<span class="str">"Accuracy:"</span>, <span class="fn">accuracy_score</span>(y_test, y_pred))'
+ '\n<span class="fn">print</span>(<span class="fn">confusion_matrix</span>(y_test, y_pred))'
+ '\n<span class="cm"># [[TN  FP]</span>'
+ '\n<span class="cm">#  [FN  TP]]</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Splits the data 80/20 into train/test. Trains the model only on the training set. Predicts on the test set and compares to the real labels. <strong>Accuracy</strong> is the fraction of correct predictions. <strong>Confusion matrix</strong> shows which class is confused with which:</p>'

+ '<ul class="l-list">'
+ '<li><strong>TP</strong> (true positive): actually positive, predicted positive ✓</li>'
+ '<li><strong>TN</strong> (true negative): actually negative, predicted negative ✓</li>'
+ '<li><strong>FP</strong> (false positive): actually negative, predicted positive (wrong)</li>'
+ '<li><strong>FN</strong> (false negative): actually positive, predicted negative (wrong)</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-cls-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["amazing","recommend","truly","movie","enjoy","terrible"];'
+ 'var coefs=[0.82,0.62,0.45,0.05,-0.81,-0.94];'
+ 'var colors=coefs.map(function(c){return c>=0?T.accent:"rgba(248,113,113,0.85)";});'
+ 'var t1={x:k,y:coefs,type:"bar",marker:{color:colors}};'
+ 'var layout={title:{text:"Logistic regression: word weights",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid,title:"Weight (w)",zerolinecolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:80,l:60}};'
+ 'if(document.getElementById("plot-cls-en"))Plotly.newPlot("plot-cls-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> After training, logistic regression assigned a weight to each word. Positively weighted (coloured) words point toward the positive class; negatively weighted (red) words toward the negative. "terrible" is the strongest negative signal, "amazing" the strongest positive. "movie" is nearly neutral — it appears in both classes so it does not discriminate. Reading what a model has learnt this clearly is one of logistic regression\'s biggest strengths.</div>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">You can now work with cleaned, vectorized, and classified text. Naive Bayes and logistic regression are foundations of classical NLP — they are still the first models tried for many practical problems. <a href="/tutorials/ai/nlp/sentiment-analysis">Lesson 4</a> applies these methods to one of the most popular use cases — <strong>sentiment analysis</strong>. We will build an end-to-end pipeline on Turkish review data: preprocessing, vectorization, classification, evaluation.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What classification is and the basic shape of supervised learning. The intuition behind Bayes\' theorem and how it adapts to NLP as Naive Bayes. You computed a Naive Bayes classification by hand on the mini corpus and saw why Laplace smoothing matters. You learned logistic regression as a different perspective — weighted voting + sigmoid. You picked up cross-entropy loss and the basic logic of gradient descent. You ran both models in sklearn and compared them. You learned model evaluation: train/test split, accuracy, confusion matrix.</div>'

};
