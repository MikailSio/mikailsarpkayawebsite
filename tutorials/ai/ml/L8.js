/* ml-L8.js — ML Theory Lesson 8: Denetimsiz Öğrenme — Clustering (TR + EN) */
var ML_L8 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Şimdiye kadar etiketli verilerde çalıştık. Bu derste etikete ihtiyaç duymadan veriyi <em>kendi başına</em> gruplara ayırmayı öğreniyoruz: <strong>clustering (kümeleme)</strong>. Müşteri kayıp verisinde "doğal müşteri segmentleri" otomatik bulmaya geçiyoruz. k-Means\'ten DBSCAN\'a, hierarchical\'a; her birinin nasıl çalıştığını ve ne zaman tercih edileceğini göreceksin.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>k-Means\'in atama-güncelleme döngüsünü el ile çalıştıracaksın</li><li>Elbow ve silhouette skoruyla en iyi k\'yi seçeceksin</li><li>Hierarchical clustering\'i dendrogram üzerinden okuyacaksın</li><li>DBSCAN\'in eps ve min_samples ile gürültüyü ayırdığını göstereceksin</li><li>Churn verisindeki müşteri segmentlerini sklearn ile çıkarıp yorumlayacaksın</li></ul></div>'

+ '<h2 class="l-title">1. Denetimsiz Öğrenme — Etiket Yok</h2>'

+ '<p class="l-text">Denetimli öğrenmede modele "doğru cevapları" gösteriyorduk. <strong>Denetimsiz öğrenmede etiket yok</strong> — modele sadece veri veriyoruz, "yapıyı kendi keşfet" diyoruz. İki ana görev:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Clustering (bu ders):</strong> "Hangi örnekler birbirine benziyor?" Müşteri segmentasyonu, anomali tespiti.</li>'
+ '<li><strong>Boyut indirgeme (<a href="/tutorials/ai/ml/dimensionality-reduction">L9</a>):</strong> "Hangi özellikler birlikte hareket ediyor?" Görselleştirme, sıkıştırma.</li>'
+ '</ul>'

+ '<p class="l-text">Müşteri kayıp verisinde clustering: müşterileri benzer alışkanlıklara göre 4-5 gruba ayır. Her gruba farklı pazarlama stratejisi uygulayabiliriz. Etiket gerektirmez — veriyi gözleyerek grupları çıkarırız.</p>'

+ '<h2 class="l-title">2. k-Means — En Yaygın Kümeleme</h2>'

+ '<p class="l-text"><strong>k-Means</strong> belki de tüm ML\'in en sevilen algoritmasıdır: basit, hızlı, sezgisel. Hedef: <em>k</em> küme bul, her küme bir <em>merkez</em> (centroid) etrafında.</p>'

+ '<h3 class="l-subtitle">Algoritma — 4 Adım</h3>'

+ '<ol class="l-list">'
+ '<li><strong>Başlat:</strong> <em>k</em> tane merkez rastgele seç.</li>'
+ '<li><strong>Atama:</strong> Her noktayı en yakın merkeze ata.</li>'
+ '<li><strong>Güncelle:</strong> Her merkezi, kendisine atanan noktaların ortalamasına taşı.</li>'
+ '<li><strong>Tekrar:</strong> Atamalar değişmeyene kadar 2-3 adımı tekrarla.</li>'
+ '</ol>'

+ '<h3 class="l-subtitle">Matematik — Kayıp Fonksiyonu</h3>'

+ '<p class="l-text">k-Means şu kaybı minimize eder:</p>'

+ '<div class="katex-block">$$J = \\sum_{i=1}^{n} \\| \\mathbf{x}_i - \\boldsymbol{\\mu}_{c(i)} \\|^2$$</div>'

+ '<p class="l-text"><em>μ<sub>c(i)</sub></em>: noktanın atandığı kümenin merkezi. Yani: <strong>her nokta kendi kümesinin merkezine ne kadar yakınsa o kadar iyi</strong>. Algoritma her iterasyonda kaybı düşürür, sonunda yerel minimuma yakınsar.</p>'

+ '<div class="plotly-graph"><div id="plot-kmeans-tr" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var c1x=[1.2,1.5,2.1,1.8,2.3,1.0];var c1y=[2.1,2.5,2.0,2.7,2.3,2.4];'
+ 'var c2x=[5.5,6.2,5.8,6.5,5.2,6.0];var c2y=[5.0,5.5,5.3,5.8,5.6,5.1];'
+ 'var c3x=[8.5,9.1,8.8,9.3,8.2];var c3y=[1.5,1.8,2.2,1.6,2.0];'
+ 'var t1={x:c1x,y:c1y,name:"Küme 1",type:"scatter",mode:"markers",marker:{color:T.accent,size:11}};'
+ 'var t2={x:c2x,y:c2y,name:"Küme 2",type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.85)",size:11}};'
+ 'var t3={x:c3x,y:c3y,name:"Küme 3",type:"scatter",mode:"markers",marker:{color:"rgba(78,205,196,.85)",size:11}};'
+ 'var tc={x:[1.65,5.87,8.78],y:[2.33,5.38,1.82],name:"Merkezler",type:"scatter",mode:"markers",marker:{color:"#fff",size:18,symbol:"x",line:{width:3,color:"#000"}}};'
+ 'var layout={xaxis:{title:"Aylık ücret (ölçeklenmiş)",color:T.text,gridcolor:T.grid},yaxis:{title:"Süre (ölçeklenmiş)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,xanchor:"center",x:0.5}};'
+ 'if(document.getElementById("plot-kmeans-tr"))Plotly.newPlot("plot-kmeans-tr",[t1,t2,t3,tc],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> İki özelliği (ücret, süre) olan müşteri verisinde k-Means 3 küme bulmuş. Beyaz X\'ler her kümenin merkezleri. Sezgisel olarak: küme 1 = düşük ücret/orta süre (yeni başlamış), küme 2 = yüksek ücret/yüksek süre (premium sadık), küme 3 = yüksek ücret/düşük süre (riskli — kayıp adayları). Etiket olmadan bu yapıyı keşfettik.</div>'

+ '<h3 class="l-subtitle">k-Means Sınırları</h3>'

+ '<ul class="l-list">'
+ '<li><strong>k\'yi önceden bilmen gerek:</strong> Kaç küme istediğine sen karar vereceksin.</li>'
+ '<li><strong>Yuvarlak küme varsayımı:</strong> Küresel/yumuşak kümeler için iyi. Uzun ince şekilli kümeler için kötü.</li>'
+ '<li><strong>Aykırılığa duyarlı:</strong> Bir uç değer bir merkezi sürükler.</li>'
+ '<li><strong>Başlangıca duyarlı:</strong> Rastgele başlangıç farklı sonuç verebilir. <code>k-means++</code> akıllı başlangıç bunu büyük ölçüde çözer.</li>'
+ '<li><strong>Ölçek hassas:</strong> Standardizasyon şart.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. k Seçimi — Elbow ve Silhouette</h2>'

+ '<p class="l-text">"Kaç küme olmalı?" denetimsiz öğrenmenin merkez sorusudur. İki popüler yöntem:</p>'

+ '<h3 class="l-subtitle">Elbow yöntemi</h3>'

+ '<p class="l-text">Farklı <em>k</em> değerleri için kayıp <em>J</em>\'yi çiz. <em>k</em> arttıkça <em>J</em> düşer (her zaman daha çok küme = daha iyi uyum). Ama belirli bir noktadan sonra düşüş yavaşlar — "dirsek" şekli oluşur. Dirsek noktası iyi <em>k</em> seçimidir.</p>'

+ '<div class="plotly-graph"><div id="plot-elbow-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var ks=[1,2,3,4,5,6,7,8,9,10];'
+ 'var inertia=[850,420,180,140,115,100,90,82,76,72];'
+ 'var t1={x:ks,y:inertia,type:"scatter",mode:"lines+markers",line:{color:T.accent,width:3},marker:{size:10}};'
+ 'var layout={xaxis:{title:"Küme sayısı (k)",color:T.text,gridcolor:T.grid},yaxis:{title:"Inertia (toplam kare uzaklık)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60}};'
+ 'if(document.getElementById("plot-elbow-tr"))Plotly.newPlot("plot-elbow-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> k arttıkça inertia (toplam kare uzaklık) düşüyor. k=1\'den 3\'e büyük düşüş, sonra düşüş yavaşlıyor — k=3\'te belirgin bir "dirsek" var. Bu noktadan sonra ek küme eklemek marjinal yarar verir. Pratik: dirsek değeri seçimimiz.</div>'

+ '<h3 class="l-subtitle">Silhouette skoru</h3>'

+ '<p class="l-text">Her nokta için "kendi kümesine ne kadar yakın, en yakın diğer kümeye ne kadar uzak":</p>'

+ '<div class="katex-block">$$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}$$</div>'

+ '<p class="l-text"><em>a(i)</em>: noktanın kendi küme üyelerine ortalama uzaklığı. <em>b(i)</em>: en yakın diğer kümenin üyelerine ortalama uzaklığı. Silhouette ∈ [-1, 1]:</p>'

+ '<ul class="l-list">'
+ '<li><strong>+1\'e yakın:</strong> nokta doğru kümede.</li>'
+ '<li><strong>0:</strong> sınırda, belirsiz.</li>'
+ '<li><strong>-1:</strong> yanlış kümede.</li>'
+ '</ul>'

+ '<p class="l-text">Tüm noktaların silhouette ortalaması bütüncül skor. <em>k</em> değerlerini deneyip en yüksek silhouette skorunu veren <em>k</em>\'yi seç.</p>'

+ '<h2 class="l-title">4. Hierarchical Clustering — Ağaç Yapısı</h2>'

+ '<p class="l-text"><strong>Hiyerarşik kümeleme</strong> kümeler arası ağaç yapısı kurar. İki yaklaşım:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Agglomerative (aşağıdan yukarı):</strong> Her nokta başta kendi kümesi. En yakın iki kümeyi birleştir, tekrar et — tüm noktalar tek kümede olana kadar.</li>'
+ '<li><strong>Divisive (yukarıdan aşağı):</strong> Tüm noktalar tek kümede. Bölmeye başla. Daha az kullanılır.</li>'
+ '</ul>'

+ '<p class="l-text">Sonuç: <strong>dendrogram</strong> denilen ağaç yapısı. Bunu istediğin yükseklikte kesip istediğin sayıda küme elde edersin — <em>k</em>\'yi sonradan seçebilirsin.</p>'

+ '<p class="l-text">Avantajlar:</p>'

+ '<ul class="l-list">'
+ '<li>k\'yi önceden bilmen gerekmez.</li>'
+ '<li>Hiyerarşik yapı (büyük gruplar içinde alt gruplar) doğal verir.</li>'
+ '<li>Yorumlanabilir: hangi noktalar hangi seviyede birleşti görülür.</li>'
+ '</ul>'

+ '<p class="l-text">Dezavantaj: O(n²) bellek ve hesap. Çok büyük verilerde (>10.000 nokta) uygulanabilir değil.</p>'

+ '<h3 class="l-subtitle">Linkage stratejileri</h3>'

+ '<p class="l-text">"İki kümenin uzaklığı" nasıl ölçülür?</p>'

+ '<ul class="l-list">'
+ '<li><strong>Single linkage:</strong> En yakın iki nokta arası uzaklık. Uzun zincir kümeler oluşur.</li>'
+ '<li><strong>Complete linkage:</strong> En uzak iki nokta arası uzaklık. Kompakt kümeler.</li>'
+ '<li><strong>Average linkage:</strong> Ortalama uzaklık. Dengeli.</li>'
+ '<li><strong>Ward linkage:</strong> Birleşince varyans artışı en az olanı seç. En popüler.</li>'
+ '</ul>'

+ '<h2 class="l-title">5. DBSCAN — Yoğunluk Tabanlı</h2>'

+ '<p class="l-text"><strong>DBSCAN (Density-Based Spatial Clustering)</strong> çok farklı bir felsefe: kümeler "yoğun bölgeler"dir; aralarındaki seyrek alanlar onları ayırır.</p>'

+ '<p class="l-text">İki parametre:</p>'

+ '<ul class="l-list">'
+ '<li><strong>eps (ε):</strong> "yakınlık" yarıçapı.</li>'
+ '<li><strong>min_samples:</strong> Bir noktanın "core point" olabilmesi için ε yarıçapında olması gereken minimum komşu sayısı.</li>'
+ '</ul>'

+ '<p class="l-text">Algoritma:</p>'

+ '<ol class="l-list">'
+ '<li>Her noktanın ε-komşuluğunu say.</li>'
+ '<li>min_samples\'tan fazla komşusu olanlar = <strong>core point</strong>.</li>'
+ '<li>Core point\'lerden ulaşılabilen tüm noktalar aynı kümede.</li>'
+ '<li>Hiçbir core\'a ulaşamayan noktalar = <strong>gürültü (noise)</strong>.</li>'
+ '</ol>'

+ '<p class="l-text"><strong>Avantajları:</strong></p>'

+ '<ul class="l-list">'
+ '<li>k\'yi önceden bilmen gerekmez.</li>'
+ '<li>Keyfi şekilli kümeleri yakalar (uzun, eğri vs.).</li>'
+ '<li>Aykırı değerleri otomatik "gürültü" olarak ayırır — anomali tespitiyle iç içe.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Dezavantajları:</strong></p>'

+ '<ul class="l-list">'
+ '<li>eps seçimi zor; küçükse her şey gürültü, büyükse her şey tek küme.</li>'
+ '<li>Farklı yoğunluklu kümelerle uğraşamaz.</li>'
+ '<li>Yüksek boyutlarda mesafe metriği zayıflar (boyutluluk laneti).</li>'
+ '</ul>'

+ '<h2 class="l-title">6. Üç Algoritmayı Karşılaştırma</h2>'

+ '<div class="calc-example"><div class="example-label">NE ZAMAN HANGİSİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Özellik</th><th style="padding:.5rem">k-Means</th><th style="padding:.5rem">Hierarchical</th><th style="padding:.5rem">DBSCAN</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">k önceden gerekli</td><td style="text-align:center">Evet</td><td style="text-align:center">Hayır (sonra seç)</td><td style="text-align:center">Hayır</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Şekil esnekliği</td><td style="text-align:center">Yuvarlak</td><td style="text-align:center">Esnek</td><td style="text-align:center">Çok esnek</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Aykırılık işleme</td><td style="text-align:center">Kötü</td><td style="text-align:center">Orta</td><td style="text-align:center">Çok iyi</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Hız</td><td style="text-align:center">Çok hızlı</td><td style="text-align:center">Yavaş O(n²)</td><td style="text-align:center">Orta</td></tr>'
+ '<tr><td style="padding:.5rem">Büyük veride</td><td style="text-align:center">Mükemmel</td><td style="text-align:center">Pratik değil</td><td style="text-align:center">İyi</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h2 class="l-title">7. GMM — Gaussian Mixture Models</h2>'

+ '<p class="l-text">Bonus algoritma: <strong>Gaussian Mixture Model (GMM)</strong>. k-Means\'in olasılıksal versiyonu. Kümeler artık katı sınıflar değil, Gaussian dağılımlardır. Her nokta her kümeye <em>olasılıkla</em> ait olur (soft clustering).</p>'

+ '<p class="l-text">Avantajları: küme boyutu/şekli farklı olabilir (her küme kendi covariance matrisine sahip), olasılıklı çıktı verir. Dezavantaj: yine k\'yi bilmek gerek, başlatma duyarlı.</p>'

+ '<h2 class="l-title">8. Python — Üç Algoritma Yan Yana</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Müşteri segmentasyonu — k-Means, hierarchical, DBSCAN<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans, AgglomerativeClustering, DBSCAN'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> silhouette_score'
+ '\n'
+ '\n<span class="cm"># X: müşteri özellikleri (yaş, ücret, süre, ...)</span>'
+ '\nscaler = <span class="fn">StandardScaler</span>()'
+ '\nX_scaled = scaler.<span class="fn">fit_transform</span>(X)'
+ '\n'
+ '\n<span class="cm"># 1. k-Means — k=4</span>'
+ '\nkm = <span class="fn">KMeans</span>(n_clusters=<span class="num">4</span>, n_init=<span class="num">10</span>, random_state=<span class="num">42</span>)'
+ '\nlabels_km = km.<span class="fn">fit_predict</span>(X_scaled)'
+ '\n<span class="fn">print</span>(<span class="str">f"k-Means silhouette: {silhouette_score(X_scaled, labels_km):.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># 2. Agglomerative — Ward linkage</span>'
+ '\nag = <span class="fn">AgglomerativeClustering</span>(n_clusters=<span class="num">4</span>, linkage=<span class="str">"ward"</span>)'
+ '\nlabels_ag = ag.<span class="fn">fit_predict</span>(X_scaled)'
+ '\n<span class="fn">print</span>(<span class="str">f"Ward silhouette:    {silhouette_score(X_scaled, labels_ag):.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># 3. DBSCAN — yoğunluk tabanlı</span>'
+ '\ndb = <span class="fn">DBSCAN</span>(eps=<span class="num">0.5</span>, min_samples=<span class="num">10</span>)'
+ '\nlabels_db = db.<span class="fn">fit_predict</span>(X_scaled)'
+ '\nn_clusters = <span class="fn">len</span>(<span class="fn">set</span>(labels_db)) - (<span class="num">1</span> <span class="kw">if</span> -<span class="num">1</span> <span class="kw">in</span> labels_db <span class="kw">else</span> <span class="num">0</span>)'
+ '\nn_noise = <span class="fn">list</span>(labels_db).<span class="fn">count</span>(-<span class="num">1</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"DBSCAN buldu: {n_clusters} küme, {n_noise} gürültü noktası"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Üç algoritma aynı veride. <code>StandardScaler</code> şart — tüm clustering algoritmaları mesafe hesaplar, ölçek kritik. <code>n_init=10</code> k-Means\'i 10 farklı başlangıçla çalıştır, en iyisini al — yerel minimum tuzağına karşı. DBSCAN\'da -1 etiketi "gürültü" demek; gerçek küme sayısı için onu çıkarırız.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> En iyi k\'yi silhouette ile bulma<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt'
+ '\n'
+ '\nks = <span class="fn">range</span>(<span class="num">2</span>, <span class="num">10</span>)'
+ '\nscores = []'
+ '\n<span class="kw">for</span> k <span class="kw">in</span> ks:'
+ '\n    km = <span class="fn">KMeans</span>(n_clusters=k, n_init=<span class="num">10</span>, random_state=<span class="num">42</span>)'
+ '\n    labels = km.<span class="fn">fit_predict</span>(X_scaled)'
+ '\n    s = <span class="fn">silhouette_score</span>(X_scaled, labels)'
+ '\n    scores.<span class="fn">append</span>(s)'
+ '\n    <span class="fn">print</span>(<span class="str">f"k={k}: silhouette={s:.3f}"</span>)'
+ '\n'
+ '\nbest_k = ks[scores.<span class="fn">index</span>(<span class="fn">max</span>(scores))]'
+ '\n<span class="fn">print</span>(<span class="str">f"En iyi k: {best_k}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> 2-9 arası tüm k değerleri için silhouette skoru hesaplar. En yüksek skoru veren k seçilir. Bu sistematik bir yaklaşım — elbow grafiğinden gözle "dirsek" aramaktan daha güvenilir.</p>'

+ '<h2 class="l-title">9. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Kümeleme ile veri içindeki yapıyı keşfettik. Ama 20 boyutlu veride kümeleme görselleştirmek zor. <a href="/tutorials/ai/ml/dimensionality-reduction">Ders 9</a>: <strong>Boyut indirgeme</strong>. PCA, t-SNE, UMAP ile yüksek boyutlu veriyi 2-3 boyuta düşürüp görselleştirme. Plus: özellik mühendisliği için boyut indirgeme.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Denetimsiz öğrenmenin (etiketsiz veriden bilgi çıkarma) ne olduğunu öğrendin. k-Means\'in 4 adımlı algoritmasını ve kayıp fonksiyonunu kavradın. k seçiminde elbow ve silhouette yöntemlerini gördün. Hierarchical clustering\'in ağaç yapısı, dendrogram, ve linkage stratejilerini (Ward, complete vs.) tanıdın. DBSCAN\'in yoğunluk tabanlı felsefesini, eps + min_samples mantığını, gürültü noktalarını öğrendin. Üç algoritmanın artıları/eksileri tablosunu kavradın. GMM\'in soft clustering yaptığını gördün. sklearn ile gerçek kod yazdın.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> So far we worked with labelled data. This lesson learns to <em>self-organise</em> data into groups without labels: <strong>clustering</strong>. We move to discovering "natural customer segments" automatically in the churn data. From k-Means to DBSCAN to hierarchical, you will see how each works and when to choose which.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Run the k-Means assign-update loop by hand on a tiny dataset</li><li>Pick optimal k with the elbow method and silhouette score</li><li>Read hierarchical clustering structure from a dendrogram</li><li>Use DBSCAN with eps and min_samples to separate noise from clusters</li><li>Extract customer segments from churn data with sklearn and interpret them</li></ul></div>'

+ '<h2 class="l-title">1. Unsupervised Learning — No Labels</h2>'

+ '<p class="l-text">In supervised learning we showed the model "right answers". <strong>In unsupervised learning there are no labels</strong> — we only give data and ask the model to find structure. Two main tasks:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Clustering (this lesson):</strong> "Which examples are similar?" Customer segmentation, anomaly detection.</li>'
+ '<li><strong>Dimensionality reduction (<a href="/tutorials/ai/ml/dimensionality-reduction">L9</a>):</strong> "Which features move together?" Visualisation, compression.</li>'
+ '</ul>'

+ '<p class="l-text">Clustering on churn data: split customers into 4-5 groups by similar behaviour. Each group can get a different marketing strategy. No labels needed — we extract the groups from the data itself.</p>'

+ '<h2 class="l-title">2. k-Means — The Most Popular Clustering</h2>'

+ '<p class="l-text"><strong>k-Means</strong> is perhaps the most beloved algorithm in all of ML: simple, fast, intuitive. Goal: find <em>k</em> clusters, each defined by a <em>centroid</em>.</p>'

+ '<h3 class="l-subtitle">Algorithm — 4 Steps</h3>'

+ '<ol class="l-list">'
+ '<li><strong>Initialise:</strong> pick <em>k</em> centroids at random.</li>'
+ '<li><strong>Assign:</strong> assign each point to the nearest centroid.</li>'
+ '<li><strong>Update:</strong> move each centroid to the mean of its assigned points.</li>'
+ '<li><strong>Repeat:</strong> steps 2-3 until assignments stop changing.</li>'
+ '</ol>'

+ '<h3 class="l-subtitle">Math — The Loss</h3>'

+ '<p class="l-text">k-Means minimises:</p>'

+ '<div class="katex-block">$$J = \\sum_{i=1}^{n} \\| \\mathbf{x}_i - \\boldsymbol{\\mu}_{c(i)} \\|^2$$</div>'

+ '<p class="l-text"><em>μ<sub>c(i)</sub></em>: centroid of the point\'s assigned cluster. So: <strong>each point should be as close as possible to its cluster\'s centre</strong>. Each iteration drops the loss; the algorithm converges to a local minimum.</p>'

+ '<div class="plotly-graph"><div id="plot-kmeans-en" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var c1x=[1.2,1.5,2.1,1.8,2.3,1.0];var c1y=[2.1,2.5,2.0,2.7,2.3,2.4];'
+ 'var c2x=[5.5,6.2,5.8,6.5,5.2,6.0];var c2y=[5.0,5.5,5.3,5.8,5.6,5.1];'
+ 'var c3x=[8.5,9.1,8.8,9.3,8.2];var c3y=[1.5,1.8,2.2,1.6,2.0];'
+ 'var t1={x:c1x,y:c1y,name:"Cluster 1",type:"scatter",mode:"markers",marker:{color:T.accent,size:11}};'
+ 'var t2={x:c2x,y:c2y,name:"Cluster 2",type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.85)",size:11}};'
+ 'var t3={x:c3x,y:c3y,name:"Cluster 3",type:"scatter",mode:"markers",marker:{color:"rgba(78,205,196,.85)",size:11}};'
+ 'var tc={x:[1.65,5.87,8.78],y:[2.33,5.38,1.82],name:"Centroids",type:"scatter",mode:"markers",marker:{color:"#fff",size:18,symbol:"x",line:{width:3,color:"#000"}}};'
+ 'var layout={xaxis:{title:"Monthly fee (scaled)",color:T.text,gridcolor:T.grid},yaxis:{title:"Tenure (scaled)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,xanchor:"center",x:0.5}};'
+ 'if(document.getElementById("plot-kmeans-en"))Plotly.newPlot("plot-kmeans-en",[t1,t2,t3,tc],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> On two-feature customer data (fee, tenure) k-Means found 3 clusters. White Xs are the centroids. Intuitively: cluster 1 = low fee/medium tenure (newcomers), cluster 2 = high fee/long tenure (premium loyal), cluster 3 = high fee/short tenure (risky — churn candidates). We discovered this structure without any labels.</div>'

+ '<h3 class="l-subtitle">k-Means Limitations</h3>'

+ '<ul class="l-list">'
+ '<li><strong>You must know k upfront:</strong> the choice is yours.</li>'
+ '<li><strong>Round-cluster assumption:</strong> good for spherical clusters, bad for elongated shapes.</li>'
+ '<li><strong>Outlier-sensitive:</strong> a single extreme point can drag a centroid.</li>'
+ '<li><strong>Initialisation-sensitive:</strong> random init can give different results. <code>k-means++</code> mostly fixes this.</li>'
+ '<li><strong>Scale-sensitive:</strong> standardisation is essential.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. Choosing k — Elbow and Silhouette</h2>'

+ '<p class="l-text">"How many clusters?" is the central question of unsupervised learning. Two popular methods:</p>'

+ '<h3 class="l-subtitle">Elbow method</h3>'

+ '<p class="l-text">Plot the loss <em>J</em> against various <em>k</em> values. As <em>k</em> grows, <em>J</em> drops (more clusters always fit better). But the drop slows after a point — an "elbow" forms. The elbow is a good <em>k</em>.</p>'

+ '<div class="plotly-graph"><div id="plot-elbow-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var ks=[1,2,3,4,5,6,7,8,9,10];'
+ 'var inertia=[850,420,180,140,115,100,90,82,76,72];'
+ 'var t1={x:ks,y:inertia,type:"scatter",mode:"lines+markers",line:{color:T.accent,width:3},marker:{size:10}};'
+ 'var layout={xaxis:{title:"Number of clusters (k)",color:T.text,gridcolor:T.grid},yaxis:{title:"Inertia (sum of squared distances)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60}};'
+ 'if(document.getElementById("plot-elbow-en"))Plotly.newPlot("plot-elbow-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Inertia drops as k grows. From k=1 to 3 a steep drop, then it slows — a clear "elbow" near k=3. Beyond that, additional clusters give marginal returns. Practical: pick the elbow as your k.</div>'

+ '<h3 class="l-subtitle">Silhouette score</h3>'

+ '<p class="l-text">Per-point: "how close to my own cluster vs. how far from the next nearest cluster":</p>'

+ '<div class="katex-block">$$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}$$</div>'

+ '<p class="l-text"><em>a(i)</em>: average distance to own cluster members. <em>b(i)</em>: average distance to nearest other cluster\'s members. Silhouette ∈ [-1, 1]:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Near +1:</strong> point is well-clustered.</li>'
+ '<li><strong>0:</strong> on the border, ambiguous.</li>'
+ '<li><strong>-1:</strong> point is in the wrong cluster.</li>'
+ '</ul>'

+ '<p class="l-text">Mean silhouette across all points is the global score. Try different <em>k</em> values and pick the one with the highest silhouette.</p>'

+ '<h2 class="l-title">4. Hierarchical Clustering — Tree Structure</h2>'

+ '<p class="l-text"><strong>Hierarchical clustering</strong> builds a tree of clusters. Two approaches:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Agglomerative (bottom-up):</strong> every point starts as its own cluster. Merge the two closest clusters; repeat until everything is in one cluster.</li>'
+ '<li><strong>Divisive (top-down):</strong> start with one cluster, split. Less common.</li>'
+ '</ul>'

+ '<p class="l-text">The output is a tree called a <strong>dendrogram</strong>. Cut at any height to get any number of clusters — choose <em>k</em> after the fact.</p>'

+ '<p class="l-text">Pros:</p>'

+ '<ul class="l-list">'
+ '<li>k not needed in advance.</li>'
+ '<li>Hierarchy (groups within groups) is natural.</li>'
+ '<li>Interpretable: you see which points merge at which level.</li>'
+ '</ul>'

+ '<p class="l-text">Con: O(n²) memory and computation. Impractical beyond ~10,000 points.</p>'

+ '<h3 class="l-subtitle">Linkage strategies</h3>'

+ '<p class="l-text">How is "distance between two clusters" defined?</p>'

+ '<ul class="l-list">'
+ '<li><strong>Single linkage:</strong> distance between closest pair. Tends to chain.</li>'
+ '<li><strong>Complete linkage:</strong> distance between farthest pair. Compact clusters.</li>'
+ '<li><strong>Average linkage:</strong> mean pairwise distance. Balanced.</li>'
+ '<li><strong>Ward linkage:</strong> merge that increases variance the least. Most popular.</li>'
+ '</ul>'

+ '<h2 class="l-title">5. DBSCAN — Density-Based</h2>'

+ '<p class="l-text"><strong>DBSCAN (Density-Based Spatial Clustering)</strong> takes a different view: clusters are "dense regions"; sparse areas separate them.</p>'

+ '<p class="l-text">Two parameters:</p>'

+ '<ul class="l-list">'
+ '<li><strong>eps (ε):</strong> the "closeness" radius.</li>'
+ '<li><strong>min_samples:</strong> minimum neighbours within ε for a point to be a "core point".</li>'
+ '</ul>'

+ '<p class="l-text">Algorithm:</p>'

+ '<ol class="l-list">'
+ '<li>Count each point\'s ε-neighbourhood.</li>'
+ '<li>Points with > min_samples neighbours = <strong>core points</strong>.</li>'
+ '<li>All points reachable from core points belong to the same cluster.</li>'
+ '<li>Points not reachable from any core = <strong>noise</strong>.</li>'
+ '</ol>'

+ '<p class="l-text"><strong>Pros:</strong></p>'

+ '<ul class="l-list">'
+ '<li>k not needed in advance.</li>'
+ '<li>Captures arbitrary cluster shapes (long, curved, etc.).</li>'
+ '<li>Outliers automatically labelled "noise" — overlaps with anomaly detection.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Cons:</strong></p>'

+ '<ul class="l-list">'
+ '<li>eps is hard to choose; too small = everything is noise; too large = everything is one cluster.</li>'
+ '<li>Cannot handle clusters of varying density.</li>'
+ '<li>Distance breaks down in high dimensions (curse of dimensionality).</li>'
+ '</ul>'

+ '<h2 class="l-title">6. Comparing the Three</h2>'

+ '<div class="calc-example"><div class="example-label">WHEN TO USE WHICH</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Property</th><th style="padding:.5rem">k-Means</th><th style="padding:.5rem">Hierarchical</th><th style="padding:.5rem">DBSCAN</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">k needed upfront</td><td style="text-align:center">Yes</td><td style="text-align:center">No (cut later)</td><td style="text-align:center">No</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Shape flexibility</td><td style="text-align:center">Round</td><td style="text-align:center">Flexible</td><td style="text-align:center">Very flexible</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Outlier handling</td><td style="text-align:center">Poor</td><td style="text-align:center">Medium</td><td style="text-align:center">Excellent</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Speed</td><td style="text-align:center">Very fast</td><td style="text-align:center">Slow O(n²)</td><td style="text-align:center">Medium</td></tr>'
+ '<tr><td style="padding:.5rem">Big data</td><td style="text-align:center">Excellent</td><td style="text-align:center">Infeasible</td><td style="text-align:center">Good</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<h2 class="l-title">7. GMM — Gaussian Mixture Models</h2>'

+ '<p class="l-text">Bonus: <strong>Gaussian Mixture Model (GMM)</strong>. A probabilistic version of k-Means. Clusters are Gaussian distributions; each point belongs to each cluster <em>with a probability</em> (soft clustering).</p>'

+ '<p class="l-text">Pros: cluster sizes/shapes can vary (each has its own covariance), gives probabilistic outputs. Cons: still need k, init-sensitive.</p>'

+ '<h2 class="l-title">8. Python — Three Algorithms Side by Side</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Customer segmentation — k-Means, hierarchical, DBSCAN<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans, AgglomerativeClustering, DBSCAN'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> silhouette_score'
+ '\n'
+ '\n<span class="cm"># X: customer features (age, fee, tenure, ...)</span>'
+ '\nscaler = <span class="fn">StandardScaler</span>()'
+ '\nX_scaled = scaler.<span class="fn">fit_transform</span>(X)'
+ '\n'
+ '\n<span class="cm"># 1. k-Means — k=4</span>'
+ '\nkm = <span class="fn">KMeans</span>(n_clusters=<span class="num">4</span>, n_init=<span class="num">10</span>, random_state=<span class="num">42</span>)'
+ '\nlabels_km = km.<span class="fn">fit_predict</span>(X_scaled)'
+ '\n<span class="fn">print</span>(<span class="str">f"k-Means silhouette: {silhouette_score(X_scaled, labels_km):.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># 2. Agglomerative — Ward linkage</span>'
+ '\nag = <span class="fn">AgglomerativeClustering</span>(n_clusters=<span class="num">4</span>, linkage=<span class="str">"ward"</span>)'
+ '\nlabels_ag = ag.<span class="fn">fit_predict</span>(X_scaled)'
+ '\n<span class="fn">print</span>(<span class="str">f"Ward silhouette:    {silhouette_score(X_scaled, labels_ag):.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># 3. DBSCAN — density-based</span>'
+ '\ndb = <span class="fn">DBSCAN</span>(eps=<span class="num">0.5</span>, min_samples=<span class="num">10</span>)'
+ '\nlabels_db = db.<span class="fn">fit_predict</span>(X_scaled)'
+ '\nn_clusters = <span class="fn">len</span>(<span class="fn">set</span>(labels_db)) - (<span class="num">1</span> <span class="kw">if</span> -<span class="num">1</span> <span class="kw">in</span> labels_db <span class="kw">else</span> <span class="num">0</span>)'
+ '\nn_noise = <span class="fn">list</span>(labels_db).<span class="fn">count</span>(-<span class="num">1</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"DBSCAN found: {n_clusters} clusters, {n_noise} noise points"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Three algorithms on the same data. <code>StandardScaler</code> is essential — all clustering relies on distances, scale matters. <code>n_init=10</code> runs k-Means with 10 different inits, picks the best — a guard against local minima. In DBSCAN, label -1 means "noise"; we exclude it when counting real clusters.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Picking k via silhouette<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt'
+ '\n'
+ '\nks = <span class="fn">range</span>(<span class="num">2</span>, <span class="num">10</span>)'
+ '\nscores = []'
+ '\n<span class="kw">for</span> k <span class="kw">in</span> ks:'
+ '\n    km = <span class="fn">KMeans</span>(n_clusters=k, n_init=<span class="num">10</span>, random_state=<span class="num">42</span>)'
+ '\n    labels = km.<span class="fn">fit_predict</span>(X_scaled)'
+ '\n    s = <span class="fn">silhouette_score</span>(X_scaled, labels)'
+ '\n    scores.<span class="fn">append</span>(s)'
+ '\n    <span class="fn">print</span>(<span class="str">f"k={k}: silhouette={s:.3f}"</span>)'
+ '\n'
+ '\nbest_k = ks[scores.<span class="fn">index</span>(<span class="fn">max</span>(scores))]'
+ '\n<span class="fn">print</span>(<span class="str">f"Best k: {best_k}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Computes silhouette for k=2..9 and picks the highest. A systematic alternative to eyeballing the elbow plot.</p>'

+ '<h2 class="l-title">9. What\'s Next</h2>'

+ '<p class="l-text">Clustering revealed structure within data. But visualising clusters in 20-dimensional data is hard. <a href="/tutorials/ai/ml/dimensionality-reduction">Lesson 9</a>: <strong>dimensionality reduction</strong>. PCA, t-SNE, UMAP project high-dimensional data to 2-3 dimensions for visualisation. Plus dim-reduction for feature engineering.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What unsupervised learning is (extracting information from unlabelled data). The 4-step k-Means algorithm and its loss function. Choosing k via elbow and silhouette. Hierarchical clustering\'s tree structure, dendrograms, and linkage strategies (Ward, complete, etc.). DBSCAN\'s density-based philosophy, eps + min_samples, noise points. The pros/cons table comparing the three. Soft clustering with GMM. Real sklearn code.</div>'

};
