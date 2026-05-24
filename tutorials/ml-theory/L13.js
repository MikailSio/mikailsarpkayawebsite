/* ml-L13.js — ML Theory Lesson 13: Naive Bayes (TR + EN) */
var ML_L13 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/ml-theory/3">Ders 3</a>\'te lojistik regresyonu işlerken Naive Bayes\'i sadece tanıtmıştık. Şimdi bu küçük ama efsanevi algoritmanın detayına iniyoruz. Bayes teoreminden başlayıp "naive" varsayımına, üç farklı varyantına (Gaussian, Multinomial, Bernoulli), Laplace düzleştirmesine ve neden log-uzayında hesap yaptığımıza kadar her şeyi adım adım göreceksin. Final örnek: spam sınıflandırma — Naive Bayes\'in en parladığı alan.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Bayes teoreminden başlayıp P(sınıf|özellikler) formülünü adım adım türeteceksin</li><li>"Naive" varsayımının neden hem yanlış hem işe yarar olduğunu kavrayacaksın</li><li>Gaussian, Multinomial ve Bernoulli varyantlarını ne zaman seçeceğini bileceksin</li><li>Sıfır-frekans problemini Laplace düzleştirmesi ile çözeceksin</li><li>Underflow\'dan kaçınmak için log-olasılık ile hesap yapacaksın</li><li>Spam sınıflandırma örneğini elle çözeceksin — kelime kelime</li><li>Naive Bayes\'i lojistik regresyon ile karşılaştırıp hangisini ne zaman tercih edeceğini öğreneceksin</li></ul></div>'

+ '<h2 class="l-title">1. Bayes Teoremi — Tazeleme</h2>'

+ '<p class="l-text">Naive Bayes adından da anlaşılacağı gibi <strong>Bayes teoremi</strong> üzerine kuruludur. Önce o formülü hatırlayalım:</p>'

+ '<div class="katex-block">$$P(y \\mid \\mathbf{x}) = \\frac{P(\\mathbf{x} \\mid y) \\cdot P(y)}{P(\\mathbf{x})}$$</div>'

+ '<p class="l-text">Kelimelerle:</p>'

+ '<ul class="l-list">'
+ '<li><strong>P(y | x)</strong> — özellikleri gördükten sonra sınıfın olasılığı. <em>Aradığımız şey.</em> Buna <em>posterior</em> denir.</li>'
+ '<li><strong>P(x | y)</strong> — sınıf belliyse özelliklerin olasılığı. <em>Likelihood</em> (olabilirlik).</li>'
+ '<li><strong>P(y)</strong> — sınıfın baştan gelen olasılığı. <em>Prior</em>.</li>'
+ '<li><strong>P(x)</strong> — özelliklerin marjinal olasılığı. Normalizasyon sabiti, sınıfa göre değişmez.</li>'
+ '</ul>'

+ '<p class="l-text">Sınıflandırma yaparken iki sınıf arasında karar veriyoruz, o yüzden payda iki sınıf için de aynı. Yani sadece pay önemli:</p>'

+ '<div class="katex-block">$$P(y \\mid \\mathbf{x}) \\propto P(\\mathbf{x} \\mid y) \\cdot P(y)$$</div>'

+ '<p class="l-text">Soru basitleşti: hangi sınıfta <em>P(x | y) · P(y)</em> daha büyükse o sınıfı seç.</p>'

+ '<div class="calc-example"><div class="example-label">SEZGİ — DOKTOR ÖRNEĞİ</div><div class="example-body">'
+ '<p class="l-text">Hastalık X toplumda %1 oranında (prior = 0.01). Test pozitif çıkanların %95\'i gerçekten hasta (likelihood). Birinin testi pozitif çıktı — gerçekten hasta olma olasılığı ne?</p>'
+ '<p class="l-text">Sezgi <em>%95</em> der ama Bayes\'in cevabı çok daha küçük. Çünkü prior çok düşük: hasta olmama önsel olasılığı %99 — pozitif test bu prior\'ı yenmek zorunda. Bayes düşünüşü budur: <strong>posterior = likelihood × prior</strong>.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. "Naive" Varsayım — Koşullu Bağımsızlık</h2>'

+ '<p class="l-text">Bayes teoremi tek başına bir şey hesaplamıyor. Sorun <em>P(x | y)</em>: birden çok özelliği olan <em>x = (x₁, x₂, ..., xₚ)</em> için bunu nasıl tahmin ederiz?</p>'

+ '<p class="l-text">Doğru cevap: <em>P(x₁, x₂, ..., xₚ | y)</em> hesapla. Ama bu birleşik dağılım bilgi olarak <strong>devasa</strong>. p = 10 ikili özellik için 2¹⁰ = 1024 olası kombinasyon, her sınıf için tahmin etmek gerekir. p = 1000 kelime için 2¹⁰⁰⁰ — gözlemden çok daha fazla parametre.</p>'

+ '<p class="l-text">Naive Bayes\'in çözümü cesur (ve naif): <strong>özellikler sınıf verildiğinde birbirinden bağımsızdır</strong> varsay. O zaman:</p>'

+ '<div class="katex-block">$$P(\\mathbf{x} \\mid y) = P(x_1 \\mid y) \\cdot P(x_2 \\mid y) \\cdot \\ldots \\cdot P(x_p \\mid y) = \\prod_{i=1}^{p} P(x_i \\mid y)$$</div>'

+ '<p class="l-text">Yani p tane <em>tek</em> özellik için koşullu olasılık tahmin et, çarp, bitir. Parametre sayısı 2¹⁰⁰⁰\'den 1000 × (sınıf sayısı)\'na düşer.</p>'

+ '<p class="l-text">Tam tahmin formülü:</p>'

+ '<div class="katex-block">$$\\hat{y} = \\arg\\max_{y} \\; P(y) \\prod_{i=1}^{p} P(x_i \\mid y)$$</div>'

+ '<p class="l-text"><strong>Niye "naive":</strong> bağımsızlık varsayımı gerçeklikte <em>genelde yanlıştır</em>. "Bayes" kelimesi e-postada geçtiyse "teorem" kelimesi de geçme olasılığı yüksek — bunlar bağımsız değil. Ama yine de çalışıyor. Niye?</p>'

+ '<h2 class="l-title">3. Neden Naive Bayes İşe Yarıyor?</h2>'

+ '<p class="l-text">Naive Bayes\'in başarısı paradoks gibi görünür: yanlış bir varsayım yapıyor ama doğru tahmin çıkarıyor. Birkaç sebep var:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Sıralama doğru olsun yeter:</strong> Sınıflandırma için <em>P(spam | x) > P(ham | x)</em> yeterli — kesin değerler değil sıralama önemli. Bağımsızlık varsayımı olasılıkları çarpıtsa bile sıralamayı çoğunlukla bozmaz.</li>'
+ '<li><strong>Yüksek boyutta avantaj:</strong> Metin sınıflandırmada binlerce kelime özelliği var. Lojistik regresyon her özellik için bir parametre öğrenir — örnek azsa overfitting riski. NB her özelliği bağımsız tahmin eder — varyans düşük, bias yüksek, az veriyle daha güvenli.</li>'
+ '<li><strong>Mütevazı veriyle iyi:</strong> 100 e-posta üzerinde bile spam filtre kurulabilir. Logistic regression aynı veride zayıf kalabilir.</li>'
+ '<li><strong>Hızlı:</strong> Eğitim tek geçişte sayım. Tahmin tek geçişte çarpım. GPU yok, gradyan iniş yok, hiperparametre yok (sadece smoothing α).</li>'
+ '</ul>'

+ '<p class="l-text">Bu yüzden 2026 yılında bile, transformer\'lar her yerde olsa da, <strong>metin sınıflandırmada hâlâ ilk attığın baseline Naive Bayes</strong>. Eğer NB\'yi büyük farkla yenemiyorsa, daha karmaşık model gereksiz.</p>'

+ '<h2 class="l-title">4. Üç Varyant — Hangisini Seçeceksin?</h2>'

+ '<p class="l-text">"Naive Bayes" tek bir algoritma değil — özelliğin türüne göre üç farklı varyantı var. Hepsi aynı çatıyı (Bayes + bağımsızlık) paylaşır, sadece <em>P(xᵢ | y)</em>\'yi farklı modeller.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">GaussianNB</div><div class="card-body"><strong>Sürekli sayısal özellikler.</strong> Her sınıf için her özellik için bir Gauss (normal) dağılımı uydurur. Iris\'in petal length\'i, müşterinin yaşı gibi. Parametre: her sınıfa-özelliğe ait μ ve σ².</div></div>'
+ '<div class="calc-card"><div class="card-title">MultinomialNB</div><div class="card-body"><strong>Sayım özellikleri (özellikle metin).</strong> Kelime frekansları, n-gram sayıları için. TfidfVectorizer veya CountVectorizer çıktısı ile mükemmel uyum. Metin sınıflandırmada %90 zaman bu kullanılır.</div></div>'
+ '<div class="calc-card"><div class="card-title">BernoulliNB</div><div class="card-body"><strong>İkili özellikler.</strong> "Kelime e-postada var mı yok mu?" — frekans değil sadece varlık. Kısa metinler (tweet, başlık) için MultinomialNB\'den iyi çıkabilir.</div></div>'
+ '<div class="calc-card"><div class="card-title">ComplementNB</div><div class="card-body"><strong>Dengesiz veri için varyant.</strong> Standart MultinomialNB azınlık sınıfta zayıf çalışır. Complement, her sınıfı <em>diğer</em> sınıflarla karşılaştırır. Sklearn\'de var: <code>ComplementNB</code>.</div></div>'
+ '<div class="calc-card"><div class="card-title">CategoricalNB</div><div class="card-body"><strong>Kategorik özellikler.</strong> Tablo verisinde "şehir", "meslek" gibi nominal alanlar için. Her kategorinin koşullu olasılığını sayar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Karma veri?</div><div class="card-body">Sayısal + kategorik karışıksa: sayısalı GaussianNB, kategoriği MultinomialNB ile ayrı modelleyip olasılıkları çarpabilirsin — ama pratikte sklearn pipeline\'da tek varyantta birleştirmek daha kolay.</div></div>'
+ '</div>'

+ '<h2 class="l-title">5. Maximum Likelihood — Parametreler Nasıl Tahmin Edilir?</h2>'

+ '<p class="l-text">Naive Bayes\'in "eğitimi" parametre tahmininden ibaret. Lineer modeldeki gibi kayıp fonksiyonu minimize etmek yok — sadece eğitim verisinden istatistik çıkarmak var.</p>'

+ '<p class="l-text"><strong>Prior:</strong> Her sınıfın frekansı:</p>'

+ '<div class="katex-block">$$\\hat{P}(y = c) = \\frac{N_c}{N}$$</div>'

+ '<p class="l-text">Nc = c sınıfından örnek sayısı, N = toplam. Spam veri setinde 1000 e-postanın 300\'ü spam ise <em>P(spam) = 0.3</em>.</p>'

+ '<p class="l-text"><strong>Likelihood — Multinomial varyant (metin için):</strong></p>'

+ '<div class="katex-block">$$\\hat{P}(w_i \\mid y = c) = \\frac{\\text{count}(w_i, c)}{\\sum_{j} \\text{count}(w_j, c)}$$</div>'

+ '<p class="l-text">Kelime wᵢ\'nin spam sınıfında geçme olasılığı = (wᵢ\'nin tüm spam e-postalarda toplam frekansı) / (tüm kelimelerin spam e-postalarda toplam frekansı).</p>'

+ '<p class="l-text"><strong>Likelihood — Gaussian varyant (sürekli için):</strong> her sınıf-özellik kombinasyonu için:</p>'

+ '<div class="katex-block">$$\\hat{\\mu}_{c,i} = \\frac{1}{N_c}\\sum_{x \\in c} x_i, \\qquad \\hat{\\sigma}^2_{c,i} = \\frac{1}{N_c}\\sum_{x \\in c} (x_i - \\hat{\\mu}_{c,i})^2$$</div>'

+ '<p class="l-text">Sonra tahminde:</p>'

+ '<div class="katex-block">$$P(x_i \\mid y = c) = \\frac{1}{\\sqrt{2\\pi \\hat{\\sigma}^2_{c,i}}} \\exp\\!\\left( -\\frac{(x_i - \\hat{\\mu}_{c,i})^2}{2 \\hat{\\sigma}^2_{c,i}} \\right)$$</div>'

+ '<p class="l-text">Her sınıf için her özelliğin ortalama ve varyansını sayıyoruz — tek for döngüsünde biter. Bu yüzden NB öyle hızlıdır.</p>'

+ '<div class="plotly-graph"><div id="plot-l13-nb-tr" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var xs=[];for(var i=0;i<=100;i++){xs.push(i/10);}'
+ 'function gauss(x,mu,s){return Math.exp(-Math.pow(x-mu,2)/(2*s*s))/(s*Math.sqrt(2*Math.PI));}'
+ 'var y1=xs.map(function(x){return gauss(x,3.5,0.9);});'
+ 'var y2=xs.map(function(x){return gauss(x,6.5,1.1);});'
+ 'var t1={x:xs,y:y1,type:"scatter",mode:"lines",fill:"tozeroy",line:{color:T.accent,width:2.5},name:"Iris-setosa"};'
+ 'var t2={x:xs,y:y2,type:"scatter",mode:"lines",fill:"tozeroy",line:{color:"rgba(248,113,113,.85)",width:2.5},name:"Iris-versicolor",fillcolor:"rgba(248,113,113,.18)"};'
+ 'var layout={xaxis:{title:"Petal uzunluğu (cm)",color:T.text,gridcolor:T.grid},yaxis:{title:"P(x | sınıf)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},legend:{font:{color:T.text,size:10},orientation:"h",y:1.10,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-l13-nb-tr"))Plotly.newPlot("plot-l13-nb-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik niye önemli:</strong> GaussianNB\'nin tam olarak ne yaptığını gösterir. Her sınıf için her özelliğin ortalama ve varyansını öğrenir, sonra bunu bir Gauss eğrisi olarak tutar. Tahmin zamanında yeni bir <em>x</em> için iki eğriye de bakar — hangisinde daha yüksek yoğunluğa düşüyorsa o sınıf tahmini yapılır. Eğrilerin kesiştiği yer karar sınırı. Iris veri setinde petal uzunluğu setosa ve versicolor\'u tek başına neredeyse mükemmel ayırır — bu yüzden NB iris\'te %95+ doğruluk verir.</div>'

+ '<h2 class="l-title">6. Sıfır-Frekans Problemi — Laplace Düzleştirmesi</h2>'

+ '<p class="l-text">Multinomial NB\'de bir sorun: ya bir kelime spam\'de hiç görünmediyse?</p>'

+ '<div class="calc-example"><div class="example-label">PROBLEM SEZGİSİ</div><div class="example-body">'
+ '<p class="l-text">Eğitim setinde "kuantum" kelimesi hiçbir spam e-postada geçmemiş, sadece 5 normal e-postada. Yeni gelen e-posta: "kuantum yatırım fırsatı dolar bitcoin".</p>'
+ '<p class="l-text">NB tahmin yaparken P("kuantum" | spam) = 0/N hesaplar. Sonra tüm olasılıkları çarpınca <strong>sonuç 0</strong> — diğer 4 kelime spam\'e güçlü işaret etse bile! Bir tek bilinmeyen kelime tüm tahmini öldürür.</p>'
+ '</div></div>'

+ '<p class="l-text">Çözüm <strong>Laplace düzleştirmesi</strong> (additive smoothing): payın üstüne küçük bir sabit α (genelde 1) ekle, paydayı da V·α arttır (V = sözlük büyüklüğü):</p>'

+ '<div class="katex-block">$$\\hat{P}(w_i \\mid y = c) = \\frac{\\text{count}(w_i, c) + \\alpha}{\\sum_{j} \\text{count}(w_j, c) + \\alpha V}$$</div>'

+ '<p class="l-text">Sezgi: her kelimeyi "α kere daha görmüş gibi" yap. Hiç görmediğin bir kelime artık 0 değil küçük bir pozitif değer. Sıfır çarpan yok, kayıp veri yok.</p>'

+ '<p class="l-text"><strong>α seçimi:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>α = 1</strong> — klasik Laplace, sklearn varsayılanı, en yaygın.</li>'
+ '<li><strong>α = 0.1 - 0.5</strong> — büyük veri setlerinde daha az düzleştirme (Lidstone).</li>'
+ '<li><strong>α = 0</strong> — düzleştirme yok, sıfır-frekans problemine açık. Sadece sözlük tam ve veri çok büyükse kullan.</li>'
+ '<li><strong>α → ∞</strong> — tüm kelimelere eşit olasılık verir, modeli yok eder. Aşırı düzleştirme zararlı.</li>'
+ '</ul>'

+ '<p class="l-text">Pratikte α GridSearchCV ile [0.01, 0.1, 0.5, 1.0, 2.0] arasından seçilir. sklearn\'de bu <code>alpha</code> hiperparametresi.</p>'

+ '<h2 class="l-title">7. Sayısal Kararlılık — Log-Uzayında Hesap</h2>'

+ '<p class="l-text">Naive Bayes\'in pratik uygulamasında kritik bir mühendislik detayı: <strong>çarpımları toplamlara çevir</strong>.</p>'

+ '<p class="l-text">Niye? 1000 kelimeli bir e-postada her kelimenin olasılığı ~0.001 mertebesinde. Çarptığımızda 0.001¹⁰⁰⁰ = 10⁻³⁰⁰⁰. Bu sayı çift hassas (double) IEEE 754\'te temsil edilemez — <strong>underflow</strong>. Sonuç tam sıfır olur, ayırt edici bilgi yok olur.</p>'

+ '<p class="l-text">Çözüm: logaritma al. Logaritma çarpımı toplama çevirir:</p>'

+ '<div class="katex-block">$$\\log P(y \\mid \\mathbf{x}) \\propto \\log P(y) + \\sum_{i=1}^{p} \\log P(x_i \\mid y)$$</div>'

+ '<p class="l-text">Şimdi 1000 küçük negatif sayı topluyoruz — sonuç -6900 gibi rahat temsil edilebilir bir değer. Hangi sınıfta log-olasılık en büyükse o seçilir. Logaritma monotonik olduğu için sıralamayı bozmaz.</p>'

+ '<p class="l-text">sklearn bunu otomatik yapar — <code>predict_log_proba()</code> ile log-olasılıkları doğrudan alabilirsin. Manuel implementasyon yazarken bu adımı unutma yoksa modelin tamamen düşer.</p>'

+ '<h2 class="l-title">8. Çalışılmış Örnek — Spam Sınıflandırma</h2>'

+ '<p class="l-text">Hadi her şeyi birleştirelim. Mini bir eğitim setiyle el-hesabı yapalım. 4 e-posta, ikisi spam ikisi ham:</p>'

+ '<div class="calc-example"><div class="example-label">EĞİTİM VERİSİ</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.9rem;line-height:1.8">'
+ 'E1 (spam): "kazan para hızlı"<br>'
+ 'E2 (spam): "para fırsatı hızlı"<br>'
+ 'E3 (ham): "toplantı yarın saat"<br>'
+ 'E4 (ham): "yarın proje toplantısı"'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>Adım 1 — Prior:</strong> Eşit sınıf dağılımı (2 spam, 2 ham).</p>'

+ '<div class="katex-block">$$P(\\text{spam}) = P(\\text{ham}) = 0.5$$</div>'

+ '<p class="l-text"><strong>Adım 2 — Kelime sayımları (Multinomial, α = 1):</strong> Sözlük V = {kazan, para, hızlı, fırsatı, toplantı, yarın, saat, proje, toplantısı} = 9 kelime.</p>'

+ '<p class="l-text">Spam toplam kelime: 6. Ham toplam kelime: 6. Düzleştirilmiş paydası: 6 + 9 = 15.</p>'

+ '<ul class="l-list" style="font-family:var(--mono);font-size:.92rem">'
+ '<li>P("para" | spam) = (2 + 1) / 15 = 0.200</li>'
+ '<li>P("hızlı" | spam) = (2 + 1) / 15 = 0.200</li>'
+ '<li>P("para" | ham) = (0 + 1) / 15 = 0.067</li>'
+ '<li>P("hızlı" | ham) = (0 + 1) / 15 = 0.067</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Adım 3 — Yeni e-posta:</strong> "para hızlı". Hangi sınıf?</p>'

+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.8;padding:.5rem 1rem;background:rgba(128,128,128,0.05);border-radius:6px">'
+ 'log P(spam | x) ∝ log(0.5) + log(0.200) + log(0.200)<br>'
+ '              = -0.693 + (-1.609) + (-1.609) = <strong>-3.911</strong><br><br>'
+ 'log P(ham | x)  ∝ log(0.5) + log(0.067) + log(0.067)<br>'
+ '              = -0.693 + (-2.703) + (-2.703) = <strong>-6.099</strong>'
+ '</p>'

+ '<p class="l-text">Spam log-olasılığı (-3.911) ham\'dan (-6.099) büyük → <strong>spam tahmini</strong>. Olasılığa çevirirsek: P(spam) ≈ 0.90, P(ham) ≈ 0.10. Naive Bayes kalbi budur — sayım, çarpım (log\'da toplam), karşılaştırma. Hepsi bu kadar.</p>'

+ '<h2 class="l-title">9. Naive Bayes vs Lojistik Regresyon</h2>'

+ '<p class="l-text">İki algoritma da olasılıkçı sınıflandırıcı. Hangisini ne zaman seçeceğiz?</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Naive Bayes kazanır</div><div class="card-body"><strong>Az veri</strong> (100-1000 örnek). <strong>Yüksek boyut</strong> (binlerce özellik). <strong>Metin sınıflandırma</strong>. <strong>Streaming/online öğrenme</strong> (partial_fit destekli). <strong>Hızlı baseline</strong> gerektiğinde.</div></div>'
+ '<div class="calc-card"><div class="card-title">Lojistik regresyon kazanır</div><div class="card-body"><strong>Bol veri</strong> (10k+ örnek). <strong>Tablo verisi</strong> (sayısal + kategorik karışık). <strong>Özellikler birbiriyle bağımlı</strong> (NB varsayımı bozuluyor). <strong>Kalibre edilmiş olasılık</strong> istendiğinde — NB aşırı emin tahminler verir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Teorik kıyas</div><div class="card-body">Asimptotik olarak (n → ∞) lojistik regresyon NB\'den iyi performans verir. Ama küçük n\'de NB daha hızlı yakınsar — bias-variance ödünleşmesi.</div></div>'
+ '<div class="calc-card"><div class="card-title">Eğitim hızı</div><div class="card-body">NB: O(n·p), tek geçiş. LR: O(n·p·iterations), gradyan iniş. NB metin verisinde 100x daha hızlı eğitilir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Olasılık kalitesi</div><div class="card-body">NB sınıf sıralaması iyi ama mutlak olasılıklar kalibre değil — genelde 0.99 veya 0.01 gibi uç değerler verir. Eşik tuning veya Platt scaling ile düzeltilir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Yorumlanabilirlik</div><div class="card-body">Her ikisi de yorumlanabilir. NB\'de "spam\'i en çok artıran kelimeler" log P(w|spam) / log P(w|ham) oranıyla bulunur. LR\'de katsayı işareti aynı bilgiyi verir.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Pratik kural:</strong> NLP problemlerine MultinomialNB ile başla. 5 dakika kurarsın, %85+ doğruluk verir. Eğer %95\'e çıkamıyorsan o zaman lojistik regresyon, sonra transformer\'a geç.</p>'

+ '<h2 class="l-title">10. Özet — 2026\'da Naive Bayes Hâlâ Niye Önemli?</h2>'

+ '<p class="l-text">Transformer\'lar her şeyi öğreniyor, GPT-4 sınıflandırma görevlerini sıfır-shot çözüyor — o zaman 1960\'lardan kalma bir algoritma niye hâlâ öğretiliyor?</p>'

+ '<ul class="l-list">'
+ '<li><strong>Baseline gücü:</strong> Bir LLM\'i "spam mı değil mi" diye sınıflandırmaya kurmadan önce, MultinomialNB ile baseline çıkarman çok daha mantıklı. Eğer NB %92 veriyor, transformer %93 veriyor — transformer\'ı production\'a koyma maliyetine değer mi?</li>'
+ '<li><strong>Edge cihazlar:</strong> Mobil, IoT, mikrokontrolcü üzerinde transformer çalıştırılamaz. NB modeli birkaç KB, milisaniyede çalışır.</li>'
+ '<li><strong>Açıklanabilir AI:</strong> Düzenleyici (regulator) "modelin niye spam dedi?" diye sorduğunda NB\'nin cevabı net: "para ve hızlı kelimeleri spam likelihood\'unu yüksek artırdı." LLM\'in cevabı yok.</li>'
+ '<li><strong>Stream işleme:</strong> Yeni veri sürekli geliyorsa <code>partial_fit</code> ile NB online güncellenebilir. Modeli yeniden eğitmek gerek yok.</li>'
+ '<li><strong>Öğretici değer:</strong> Bayes düşünüşü tüm istatistiksel ML\'in temeli. Modern Bayesyen sinir ağları, varyasyonel inferans, RLHF — hepsi aynı prior × likelihood = posterior fikrini kullanır.</li>'
+ '</ul>'

+ '<p class="l-text">Yani Naive Bayes <em>tarihi bir merak</em> değil — günümüzde aktif kullanılan, anlamak zorunda olduğun temel bir araç. <a href="/tutorials/sklearn/10">sklearn Ders 10</a>\'da hepsini sklearn API\'siyle uygulayacaksın.</p>'

+ '<h2 class="l-title">11. Sonraki Adım</h2>'

+ '<p class="l-text">Sınıflandırma alet kutumuza üçüncü algoritmayı (Naive Bayes) ekledik. Şimdiye kadar gördüklerimiz: lineer/lojistik regresyon (Ders 2-3), Naive Bayes (bu ders), kısmen kNN. <a href="/tutorials/ml-theory/4">Ders 4</a>\'te genelleme ve cross-validation\'a bakacağız — bu algoritmaları hangisinin <em>gerçekten</em> daha iyi olduğunu nasıl ölçeceğiz?</p>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğrendin:</strong> Bayes teoreminin posterior = likelihood × prior düşüncesi. Naive bağımsızlık varsayımının nasıl 2¹⁰⁰⁰ parametreyi 1000\'e indirdiği. Üç ana varyant — GaussianNB, MultinomialNB, BernoulliNB — ve hangi veri tipinde hangisini kullanacağın. Maximum likelihood ile parametre tahmini. Laplace düzleştirmesinin sıfır-frekans problemini nasıl çözdüğü. Log-uzayında hesabın underflow\'u nasıl önlediği. Spam sınıflandırma örneğinin elle hesabı. NB ile lojistik regresyonun ne zaman birini ne zaman diğerini tercih edeceğin. 2026\'da NB\'nin baseline ve edge deployment için neden hâlâ kritik olduğu.</div>',


en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/ml-theory/3">Lesson 3</a> we briefly mentioned Naive Bayes while covering logistic regression. Now we go deep into this small but legendary algorithm. Starting from Bayes\' theorem, we work through the "naive" assumption, three variants (Gaussian, Multinomial, Bernoulli), Laplace smoothing, and why every real implementation uses log-space arithmetic. Final example: a fully worked spam classification — the domain where Naive Bayes shines brightest.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Derive P(class|features) from Bayes\' theorem step by step</li><li>Understand why the "naive" assumption is both wrong and useful</li><li>Know when to pick Gaussian, Multinomial, or Bernoulli variants</li><li>Solve the zero-frequency problem with Laplace smoothing</li><li>Compute in log-space to avoid floating-point underflow</li><li>Hand-solve a spam classification example, word by word</li><li>Decide between Naive Bayes and logistic regression for any given task</li></ul></div>'

+ '<h2 class="l-title">1. Bayes\' Theorem — Refresher</h2>'

+ '<p class="l-text">Naive Bayes is built on <strong>Bayes\' theorem</strong>. Let us restate it:</p>'

+ '<div class="katex-block">$$P(y \\mid \\mathbf{x}) = \\frac{P(\\mathbf{x} \\mid y) \\cdot P(y)}{P(\\mathbf{x})}$$</div>'

+ '<p class="l-text">In words:</p>'

+ '<ul class="l-list">'
+ '<li><strong>P(y | x)</strong> — probability of class given features. <em>What we want.</em> Called the <em>posterior</em>.</li>'
+ '<li><strong>P(x | y)</strong> — probability of features given class. The <em>likelihood</em>.</li>'
+ '<li><strong>P(y)</strong> — prior probability of class, before seeing any features.</li>'
+ '<li><strong>P(x)</strong> — marginal probability of the features. Normalisation constant, identical across classes.</li>'
+ '</ul>'

+ '<p class="l-text">When classifying, we compare two classes, and the denominator is identical for both. So only the numerator matters:</p>'

+ '<div class="katex-block">$$P(y \\mid \\mathbf{x}) \\propto P(\\mathbf{x} \\mid y) \\cdot P(y)$$</div>'

+ '<p class="l-text">Simple rule: pick the class with the largest <em>P(x | y) · P(y)</em>.</p>'

+ '<div class="calc-example"><div class="example-label">INTUITION — DOCTOR EXAMPLE</div><div class="example-body">'
+ '<p class="l-text">Disease X has 1% population prevalence (prior = 0.01). The test is 95% sensitive (likelihood). Someone tests positive — what is the actual chance they have the disease?</p>'
+ '<p class="l-text">Intuition says <em>95%</em>, but the Bayesian answer is much smaller, because the prior is tiny: the prior odds of NOT having the disease are 99-to-1, and the positive test must overcome those odds. Bayesian thinking is exactly this: <strong>posterior = likelihood × prior</strong>.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. The "Naive" Assumption — Conditional Independence</h2>'

+ '<p class="l-text">Bayes\' theorem alone does not solve anything. The hard part is <em>P(x | y)</em>: for a feature vector <em>x = (x₁, x₂, ..., xₚ)</em>, how do we estimate this joint probability?</p>'

+ '<p class="l-text">The honest answer: estimate the full joint <em>P(x₁, x₂, ..., xₚ | y)</em>. But this distribution is <strong>enormous</strong>. With p = 10 binary features you have 2¹⁰ = 1024 cells per class. With p = 1000 word features you have 2¹⁰⁰⁰ — vastly more parameters than samples.</p>'

+ '<p class="l-text">Naive Bayes makes a bold (and naive) move: <strong>features are conditionally independent given the class</strong>. Then:</p>'

+ '<div class="katex-block">$$P(\\mathbf{x} \\mid y) = P(x_1 \\mid y) \\cdot P(x_2 \\mid y) \\cdot \\ldots \\cdot P(x_p \\mid y) = \\prod_{i=1}^{p} P(x_i \\mid y)$$</div>'

+ '<p class="l-text">So estimate p single-feature conditionals, multiply, done. Parameter count drops from 2¹⁰⁰⁰ to 1000 × (number of classes).</p>'

+ '<p class="l-text">Full prediction formula:</p>'

+ '<div class="katex-block">$$\\hat{y} = \\arg\\max_{y} \\; P(y) \\prod_{i=1}^{p} P(x_i \\mid y)$$</div>'

+ '<p class="l-text"><strong>Why "naive":</strong> the independence assumption is <em>generally false</em>. If "Bayes" appears in an email, "theorem" probably does too — these are not independent. Yet the algorithm still works. Why?</p>'

+ '<h2 class="l-title">3. Why Does Naive Bayes Work?</h2>'

+ '<p class="l-text">Naive Bayes\' success looks paradoxical: it makes a wrong assumption yet produces correct predictions. Several reasons:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Ranking is what matters:</strong> for classification we only need <em>P(spam | x) > P(ham | x)</em>. The independence violation distorts probabilities but usually preserves the ranking.</li>'
+ '<li><strong>High-dimensional advantage:</strong> in text classification you have thousands of word features. Logistic regression learns one parameter per feature — overfitting risk if samples are scarce. NB estimates each feature independently — low variance, high bias, safer with little data.</li>'
+ '<li><strong>Works with modest data:</strong> you can build a usable spam filter from 100 emails. Logistic regression on the same data might be unstable.</li>'
+ '<li><strong>Fast:</strong> training is a single pass of counts. Prediction is a single pass of products. No GPU, no gradient descent, no hyperparameters except smoothing α.</li>'
+ '</ul>'

+ '<p class="l-text">For these reasons, even in 2026, with transformers everywhere, <strong>your first text-classification baseline should still be Naive Bayes</strong>. If a bigger model cannot beat NB by a wide margin, the extra complexity is not worth it.</p>'

+ '<h2 class="l-title">4. Three Variants — Which to Pick?</h2>'

+ '<p class="l-text">"Naive Bayes" is not one algorithm — there are three variants depending on feature type. All share the same skeleton (Bayes + independence); they differ only in how <em>P(xᵢ | y)</em> is modelled.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">GaussianNB</div><div class="card-body"><strong>Continuous numeric features.</strong> Fits one Gaussian per (class, feature). Iris petal length, customer age, sensor readings. Parameters: μ and σ² per (class, feature).</div></div>'
+ '<div class="calc-card"><div class="card-title">MultinomialNB</div><div class="card-body"><strong>Count features (especially text).</strong> Word frequencies, n-gram counts. Pairs perfectly with TfidfVectorizer or CountVectorizer. The default choice in 90% of text classification work.</div></div>'
+ '<div class="calc-card"><div class="card-title">BernoulliNB</div><div class="card-body"><strong>Binary features.</strong> "Does this word appear in the email or not?" — presence rather than count. Often beats MultinomialNB on very short documents (tweets, headlines).</div></div>'
+ '<div class="calc-card"><div class="card-title">ComplementNB</div><div class="card-body"><strong>Imbalanced-data variant.</strong> Standard MultinomialNB underperforms on minority classes. Complement compares each class against the <em>others</em>. Available in sklearn as <code>ComplementNB</code>.</div></div>'
+ '<div class="calc-card"><div class="card-title">CategoricalNB</div><div class="card-body"><strong>Categorical features.</strong> Tabular data with nominal fields like "city" or "occupation". Estimates one conditional probability per (category, class).</div></div>'
+ '<div class="calc-card"><div class="card-title">Mixed features?</div><div class="card-body">If you have both numeric and categorical: model numerics with GaussianNB and categoricals with MultinomialNB, then combine probabilities. In practice, picking one variant in a sklearn pipeline is usually easier.</div></div>'
+ '</div>'

+ '<h2 class="l-title">5. Maximum Likelihood — Estimating Parameters</h2>'

+ '<p class="l-text">Naive Bayes "training" is just parameter estimation. No loss function to minimise, no gradient descent — just statistics from the training set.</p>'

+ '<p class="l-text"><strong>Prior:</strong> class frequency:</p>'

+ '<div class="katex-block">$$\\hat{P}(y = c) = \\frac{N_c}{N}$$</div>'

+ '<p class="l-text">Nc = number of class-c samples, N = total. If 300 of 1000 emails are spam, <em>P(spam) = 0.3</em>.</p>'

+ '<p class="l-text"><strong>Likelihood — Multinomial variant (text):</strong></p>'

+ '<div class="katex-block">$$\\hat{P}(w_i \\mid y = c) = \\frac{\\text{count}(w_i, c)}{\\sum_{j} \\text{count}(w_j, c)}$$</div>'

+ '<p class="l-text">Probability of word wᵢ given class c = (total occurrences of wᵢ in class-c documents) / (total word occurrences in class-c documents).</p>'

+ '<p class="l-text"><strong>Likelihood — Gaussian variant (continuous):</strong> for each (class, feature):</p>'

+ '<div class="katex-block">$$\\hat{\\mu}_{c,i} = \\frac{1}{N_c}\\sum_{x \\in c} x_i, \\qquad \\hat{\\sigma}^2_{c,i} = \\frac{1}{N_c}\\sum_{x \\in c} (x_i - \\hat{\\mu}_{c,i})^2$$</div>'

+ '<p class="l-text">Then at prediction time:</p>'

+ '<div class="katex-block">$$P(x_i \\mid y = c) = \\frac{1}{\\sqrt{2\\pi \\hat{\\sigma}^2_{c,i}}} \\exp\\!\\left( -\\frac{(x_i - \\hat{\\mu}_{c,i})^2}{2 \\hat{\\sigma}^2_{c,i}} \\right)$$</div>'

+ '<p class="l-text">One mean and one variance per (class, feature) — computed in a single pass. That is why NB is so fast.</p>'

+ '<div class="plotly-graph"><div id="plot-l13-nb-en" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var xs=[];for(var i=0;i<=100;i++){xs.push(i/10);}'
+ 'function gauss(x,mu,s){return Math.exp(-Math.pow(x-mu,2)/(2*s*s))/(s*Math.sqrt(2*Math.PI));}'
+ 'var y1=xs.map(function(x){return gauss(x,3.5,0.9);});'
+ 'var y2=xs.map(function(x){return gauss(x,6.5,1.1);});'
+ 'var t1={x:xs,y:y1,type:"scatter",mode:"lines",fill:"tozeroy",line:{color:T.accent,width:2.5},name:"Iris-setosa"};'
+ 'var t2={x:xs,y:y2,type:"scatter",mode:"lines",fill:"tozeroy",line:{color:"rgba(248,113,113,.85)",width:2.5},name:"Iris-versicolor",fillcolor:"rgba(248,113,113,.18)"};'
+ 'var layout={xaxis:{title:"Petal length (cm)",color:T.text,gridcolor:T.grid},yaxis:{title:"P(x | class)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},legend:{font:{color:T.text,size:10},orientation:"h",y:1.10,x:0.5,xanchor:"center"}};'
+ 'if(document.getElementById("plot-l13-nb-en"))Plotly.newPlot("plot-l13-nb-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Why this plot matters:</strong> It shows exactly what GaussianNB does. For each class it learns the mean and variance of each feature and stores it as a Gaussian curve. At prediction time, given a new <em>x</em>, it checks both curves and picks the class whose density is higher at that x. The crossing point of the curves is the decision boundary. On iris, petal length alone separates setosa from versicolor almost perfectly — which is why GaussianNB hits 95%+ accuracy on iris.</div>'

+ '<h2 class="l-title">6. Zero-Frequency Problem — Laplace Smoothing</h2>'

+ '<p class="l-text">Multinomial NB has one hidden trap: what if a word never appears in the spam class during training?</p>'

+ '<div class="calc-example"><div class="example-label">PROBLEM INTUITION</div><div class="example-body">'
+ '<p class="l-text">In training, the word "quantum" never appears in any spam email; it occurs only in 5 ham emails. A new email arrives: "quantum investment opportunity dollar bitcoin".</p>'
+ '<p class="l-text">NB computes P("quantum" | spam) = 0/N. Then multiplying all word likelihoods gives <strong>zero</strong> — even though the four other words strongly suggest spam! A single unseen word destroys the entire prediction.</p>'
+ '</div></div>'

+ '<p class="l-text">The fix is <strong>Laplace smoothing</strong> (additive smoothing): add a small α (typically 1) to the numerator, and V·α to the denominator (V = vocabulary size):</p>'

+ '<div class="katex-block">$$\\hat{P}(w_i \\mid y = c) = \\frac{\\text{count}(w_i, c) + \\alpha}{\\sum_{j} \\text{count}(w_j, c) + \\alpha V}$$</div>'

+ '<p class="l-text">Intuition: pretend every word has been seen "α extra times". Unseen words now have a small positive probability instead of zero. No zero-products, no information loss.</p>'

+ '<p class="l-text"><strong>Choosing α:</strong></p>'

+ '<ul class="l-list">'
+ '<li><strong>α = 1</strong> — classic Laplace, sklearn default, most common.</li>'
+ '<li><strong>α = 0.1 - 0.5</strong> — lighter smoothing on large datasets (Lidstone).</li>'
+ '<li><strong>α = 0</strong> — no smoothing, exposes you to the zero-frequency problem. Use only with a closed, complete vocabulary.</li>'
+ '<li><strong>α → ∞</strong> — uniform probabilities, destroys the model. Over-smoothing hurts.</li>'
+ '</ul>'

+ '<p class="l-text">In practice α is tuned with GridSearchCV over [0.01, 0.1, 0.5, 1.0, 2.0]. In sklearn this is the <code>alpha</code> hyperparameter.</p>'

+ '<h2 class="l-title">7. Numerical Stability — Compute in Log-Space</h2>'

+ '<p class="l-text">A critical engineering detail in any real NB implementation: <strong>turn products into sums</strong>.</p>'

+ '<p class="l-text">Why? For a 1000-word email, each word probability is around 0.001. Multiplied together: 0.001¹⁰⁰⁰ = 10⁻³⁰⁰⁰. This number is not representable in IEEE 754 double precision — <strong>underflow</strong>. The result becomes exactly zero, and all class discrimination disappears.</p>'

+ '<p class="l-text">Fix: take logs. Log turns products into sums:</p>'

+ '<div class="katex-block">$$\\log P(y \\mid \\mathbf{x}) \\propto \\log P(y) + \\sum_{i=1}^{p} \\log P(x_i \\mid y)$$</div>'

+ '<p class="l-text">Now you add 1000 small negative numbers — a value like -6900 is perfectly representable. The class with the highest log-probability is the predicted class. Since log is monotonic, ranking is preserved.</p>'

+ '<p class="l-text">sklearn handles this automatically — <code>predict_log_proba()</code> returns log-probabilities directly. If you ever hand-roll NB, do not forget this step or your model will silently collapse.</p>'

+ '<h2 class="l-title">8. Worked Example — Spam Classification</h2>'

+ '<p class="l-text">Let us tie everything together with a tiny training set and do the arithmetic by hand. Four emails, two spam, two ham:</p>'

+ '<div class="calc-example"><div class="example-label">TRAINING DATA</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.9rem;line-height:1.8">'
+ 'E1 (spam): "win money fast"<br>'
+ 'E2 (spam): "money offer fast"<br>'
+ 'E3 (ham): "meeting tomorrow time"<br>'
+ 'E4 (ham): "tomorrow project meeting"'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>Step 1 — Prior:</strong> Balanced classes (2 spam, 2 ham).</p>'

+ '<div class="katex-block">$$P(\\text{spam}) = P(\\text{ham}) = 0.5$$</div>'

+ '<p class="l-text"><strong>Step 2 — Word counts (Multinomial, α = 1):</strong> Vocabulary V = {win, money, fast, offer, meeting, tomorrow, time, project} = 8 words.</p>'

+ '<p class="l-text">Total spam tokens: 6. Total ham tokens: 6. Smoothed denominator: 6 + 8 = 14.</p>'

+ '<ul class="l-list" style="font-family:var(--mono);font-size:.92rem">'
+ '<li>P("money" | spam) = (2 + 1) / 14 = 0.214</li>'
+ '<li>P("fast" | spam) = (2 + 1) / 14 = 0.214</li>'
+ '<li>P("money" | ham) = (0 + 1) / 14 = 0.071</li>'
+ '<li>P("fast" | ham) = (0 + 1) / 14 = 0.071</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Step 3 — New email:</strong> "money fast". Which class?</p>'

+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.8;padding:.5rem 1rem;background:rgba(128,128,128,0.05);border-radius:6px">'
+ 'log P(spam | x) ∝ log(0.5) + log(0.214) + log(0.214)<br>'
+ '              = -0.693 + (-1.541) + (-1.541) = <strong>-3.775</strong><br><br>'
+ 'log P(ham | x)  ∝ log(0.5) + log(0.071) + log(0.071)<br>'
+ '              = -0.693 + (-2.645) + (-2.645) = <strong>-5.983</strong>'
+ '</p>'

+ '<p class="l-text">Spam log-prob (-3.775) is greater than ham log-prob (-5.983) → <strong>predict spam</strong>. Converted to probabilities: P(spam) ≈ 0.90, P(ham) ≈ 0.10. That is the entire Naive Bayes algorithm — count, multiply (i.e. add in log-space), compare. Nothing more.</p>'

+ '<h2 class="l-title">9. Naive Bayes vs Logistic Regression</h2>'

+ '<p class="l-text">Both are probabilistic classifiers. When should you pick which?</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Naive Bayes wins</div><div class="card-body"><strong>Small data</strong> (100-1000 samples). <strong>High dimensions</strong> (thousands of features). <strong>Text classification.</strong> <strong>Streaming / online learning</strong> (partial_fit supported). <strong>Fast baseline</strong> needed.</div></div>'
+ '<div class="calc-card"><div class="card-title">Logistic regression wins</div><div class="card-body"><strong>Plenty of data</strong> (10k+ samples). <strong>Tabular data</strong> with mixed numeric/categorical features. <strong>Strong feature dependence</strong> (NB assumption is violated). <strong>Calibrated probabilities</strong> needed — NB tends to produce overconfident outputs.</div></div>'
+ '<div class="calc-card"><div class="card-title">Theoretical comparison</div><div class="card-body">Asymptotically (n → ∞), logistic regression outperforms NB. But for small n, NB converges faster — a classic bias-variance trade-off.</div></div>'
+ '<div class="calc-card"><div class="card-title">Training speed</div><div class="card-body">NB: O(n·p), single pass. LR: O(n·p·iterations), gradient descent. NB is typically 100x faster to train on text data.</div></div>'
+ '<div class="calc-card"><div class="card-title">Probability quality</div><div class="card-body">NB ranks classes well but its absolute probabilities are not calibrated — outputs cluster near 0 and 1. Fix with Platt scaling or isotonic regression if you need real probabilities.</div></div>'
+ '<div class="calc-card"><div class="card-title">Interpretability</div><div class="card-body">Both are interpretable. In NB, the "most spam-indicative words" are those with the largest log P(w|spam) / log P(w|ham) ratio. In LR, the sign and magnitude of coefficients give the same information.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Practical rule:</strong> always start an NLP problem with MultinomialNB. You build it in 5 minutes, it gives 85%+ accuracy. If you cannot push past 95%, then escalate to logistic regression, then to transformers.</p>'

+ '<h2 class="l-title">10. Summary — Why Naive Bayes Still Matters in 2026</h2>'

+ '<p class="l-text">Transformers learn everything; GPT-4 solves classification tasks zero-shot. So why is a 1960s algorithm still on the syllabus?</p>'

+ '<ul class="l-list">'
+ '<li><strong>Baseline power:</strong> before deploying an LLM for "spam or not spam", you should establish a MultinomialNB baseline. If NB gives 92% and the transformer gives 93%, is the production overhead worth it?</li>'
+ '<li><strong>Edge devices:</strong> mobile, IoT, microcontrollers cannot run transformers. An NB model fits in a few KB and runs in microseconds.</li>'
+ '<li><strong>Explainable AI:</strong> when a regulator asks "why did your model flag this as spam?", NB gives a clean answer: "the words \'money\' and \'fast\' raised the spam likelihood by these factors". LLMs do not.</li>'
+ '<li><strong>Stream processing:</strong> with streaming data, <code>partial_fit</code> lets NB update online — no full retraining.</li>'
+ '<li><strong>Educational value:</strong> Bayesian thinking is the foundation of statistical ML. Modern Bayesian neural nets, variational inference, RLHF — all use the same prior × likelihood = posterior idea.</li>'
+ '</ul>'

+ '<p class="l-text">So Naive Bayes is not a historical curiosity — it is an actively used tool you must understand. In <a href="/tutorials/sklearn/10">sklearn Lesson 10</a> you will apply all of this with the sklearn API.</p>'

+ '<h2 class="l-title">11. Next Step</h2>'

+ '<p class="l-text">We have added a third algorithm (Naive Bayes) to our classification toolkit. So far: linear/logistic regression (Lessons 2-3), Naive Bayes (this lesson), and a glimpse of kNN. <a href="/tutorials/ml-theory/4">Lesson 4</a> tackles generalisation and cross-validation — how do we measure which of these algorithms is <em>actually</em> better?</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Bayes\' theorem and the posterior = likelihood × prior idea. How the naive independence assumption reduces 2¹⁰⁰⁰ parameters to 1000. The three main variants (GaussianNB, MultinomialNB, BernoulliNB) and when each is appropriate. Maximum likelihood parameter estimation. How Laplace smoothing solves the zero-frequency problem. Why log-space arithmetic prevents underflow. A hand-computed spam classification example. When to prefer Naive Bayes vs logistic regression. Why NB remains critical in 2026 for baselines and edge deployment.</div>'

};
