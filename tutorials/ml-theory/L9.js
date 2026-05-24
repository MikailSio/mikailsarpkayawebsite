/* ml-L9.js — ML Theory Lesson 9: Boyut İndirgeme — PCA, t-SNE, UMAP (TR + EN) */
var ML_L9 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Yüksek boyutlu veriyi 2-3 boyuta indirgemenin matematiği ve uygulaması. <strong>PCA</strong> (lineer, hızlı, yorumlanabilir), <strong>t-SNE</strong> (lineer olmayan, görselleştirme şampiyonu), <strong>UMAP</strong> (modern, hem hızlı hem kaliteli). 50 boyutlu müşteri verisini 2 boyuta indirip kümeleri "gözle görmenin" matematiği. Plus: boyut indirgemenin niye sadece görselleştirme değil, "boyutluluk laneti" sorunu için de gerekli olduğu.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Boyutluluk lanetinin mesafe ve örnek seyrekliği üstündeki etkisini açıklayacaksın</li><li>PCA\'yi kovaryans matrisinin özvektörleriyle çıkaracaksın</li><li>t-SNE\'nin perplexity hiperparametresini görselleştirme için ayarlayacaksın</li><li>UMAP ile 50 boyutlu churn verisini 2D\'ye indirgeyeceksin</li><li>PCA + KMeans pipeline\'ı ile küme kalitesini ham verideki ile karşılaştıracaksın</li></ul></div>'

+ '<h2 class="l-title">1. Niye Boyut İndirgeme?</h2>'

+ '<p class="l-text">Müşteri kayıp veri setinde 30+ özellik olabilir: yaş, ücret, süre, sözleşme tipi, ödeme yöntemi, hizmet kullanım miktarları, çağrı geçmişi, vs. Bu veride üç şey zorlaşır:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Görselleştirme imkânsız:</strong> 30 boyutu kafamızda gözümüzde canlandıramayız. Ama 2-3 boyut çizilebilir.</li>'
+ '<li><strong>Boyutluluk laneti:</strong> Yüksek boyutta tüm noktalar birbirine "aynı uzaklıkta" gibi görünür; mesafe ve benzerlik anlamını kaybeder. kNN, k-Means bozulur.</li>'
+ '<li><strong>Hesaplama maliyeti:</strong> Bazı algoritmaların karmaşıklığı boyutla kübik artar.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Boyut indirgeme</strong> bu üç sorunu birden çözer: yüksek boyutlu veriyi düşük boyutta, anlamı koruyacak şekilde temsil eder.</p>'

+ '<h2 class="l-title">2. Boyutluluk Laneti — Sezgi</h2>'

+ '<p class="l-text">2 boyutta birim karenin köşegen uzunluğu √2 ≈ 1.41. 100 boyutta birim küpün köşegeni √100 = 10. Yani boyut arttıkça noktalar arası mesafeler patlar; aynı zamanda <em>tüm</em> mesafeler benzer hale gelir — uzaklık ölçütü ayırt edici gücünü kaybeder.</p>'

+ '<div class="calc-example"><div class="example-label">SOMUT BIR ETKİ</div><div class="example-body">'
+ '<p class="l-text">100 boyutlu rastgele üretilmiş 1000 nokta arasında en yakın komşu uzaklığı ile en uzak komşu uzaklığı oranı:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7;text-align:center">'
+ '2 boyut: 0.05 (en yakın çok daha yakın)'
+ '<br>10 boyut: 0.45'
+ '<br>100 boyut: 0.90  ← her şey neredeyse aynı uzaklıkta!'
+ '</p>'
+ '<p class="l-text">Yüksek boyutta "yakın" anlamını yitirir. kNN gibi mesafe tabanlı algoritmaların yüksek boyutta zayıflama sebebi.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. PCA — Principal Component Analysis</h2>'

+ '<p class="l-text"><strong>PCA</strong> (Temel Bileşenler Analizi) en eski ve en yaygın boyut indirgeme yöntemidir. Sezgi: <em>verinin en çok varyans gösterdiği yönleri bul</em>. Bu yönlere "principal component" (temel bileşen) denir.</p>'

+ '<h3 class="l-subtitle">Sezgisel Görüntü</h3>'

+ '<p class="l-text">2 boyutlu, eğri bir bulut halinde noktalar düşün. PCA önce bulutun en uzun yönünü bulur (PC1) — bu yöne projeksiyon en çok bilgiyi korur. Sonra PC1\'e dik olan ikinci en uzun yönü bulur (PC2). 3 boyutta üçüncü, vs.</p>'

+ '<p class="l-text">İlk birkaç PC genelde verinin %80-95\'ini açıklar. Geri kalan boyutları atarak boyut düşürürüz, az bilgi kaybederiz.</p>'

+ '<h3 class="l-subtitle">Matematik — Özdeğer Ayrıştırması</h3>'

+ '<p class="l-text">PCA aslında <strong>kovaryans matrisinin özdeğer ayrışımı</strong>dır. Veriyi merkezledikten sonra:</p>'

+ '<div class="katex-block">$$\\Sigma = \\frac{1}{n} X^\\top X, \\qquad \\Sigma \\mathbf{v}_i = \\lambda_i \\mathbf{v}_i$$</div>'

+ '<p class="l-text">Burada:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Σ (sigma):</strong> p×p boyutunda kovaryans matrisi.</li>'
+ '<li><strong>v<sub>i</sub>:</strong> i. özvektör — i. principal component\'in yönü.</li>'
+ '<li><strong>λ<sub>i</sub>:</strong> i. özdeğer — o yöndeki varyans miktarı.</li>'
+ '</ul>'

+ '<p class="l-text">Özdeğerleri büyükten küçüğe sırala. İlk <em>d</em> özvektör projeksiyon matrisidir. Boyut p\'den d\'ye iner.</p>'

+ '<div class="katex-block">$$X_{\\text{reduced}} = X \\cdot V_d \\quad (n \\times p) \\cdot (p \\times d) = (n \\times d)$$</div>'

+ '<p class="l-text">Doğrusal cebir ile sevimli — birkaç satır kod, derin geometrik anlam.</p>'

+ '<h3 class="l-subtitle">Açıklanan Varyans</h3>'

+ '<p class="l-text">Kaç PC tutmalı? <strong>Açıklanan varyans oranı</strong>:</p>'

+ '<div class="katex-block">$$\\text{explained variance}_i = \\frac{\\lambda_i}{\\sum_j \\lambda_j}$$</div>'

+ '<p class="l-text">Pratik kural: kümülatif olarak %90-95\'e ulaşana kadar PC tut. Mesela ilk 5 PC %92 varyansı açıklıyorsa 30 boyutu 5\'e indirebilirsin, sadece %8 bilgi kaybıyla.</p>'

+ '<div class="plotly-graph"><div id="plot-pca-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var pcs=[1,2,3,4,5,6,7,8,9,10,15,20,25,30];'
+ 'var ind=[0.42,0.18,0.10,0.07,0.05,0.04,0.035,0.025,0.02,0.015,0.008,0.005,0.003,0.002];'
+ 'var cum=[];var sum=0;'
+ 'for(var i=0;i<ind.length;i++){sum+=ind[i];cum.push(sum);}'
+ 'var t1={x:pcs,y:ind,name:"Bireysel açıklanan varyans",type:"bar",marker:{color:T.accent}};'
+ 'var t2={x:pcs,y:cum,name:"Kümülatif",type:"scatter",mode:"lines+markers",line:{color:"rgba(78,205,196,.9)",width:3},yaxis:"y2"};'
+ 'var layout={xaxis:{title:"Principal Component",color:T.text,gridcolor:T.grid},yaxis:{title:"Bireysel varyans",color:T.text,gridcolor:T.grid,tickformat:".0%"},yaxis2:{title:"Kümülatif",overlaying:"y",side:"right",color:T.text,tickformat:".0%",range:[0,1.05]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:60,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,xanchor:"center",x:0.5}};'
+ 'if(document.getElementById("plot-pca-tr"))Plotly.newPlot("plot-pca-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> 30 boyutlu örnek bir veride PCA sonuçları. Mor barlar her PC\'nin tek başına açıkladığı varyansı gösteriyor — PC1 %42, PC2 %18 gibi. Yeşil çizgi kümülatif: ilk 5 PC %82\'yi, ilk 10 PC %92\'yi açıklar. 30 yerine 10 boyut yeterli olabilir.</div>'

+ '<h3 class="l-subtitle">PCA\'nın Kullanım Alanları</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Görselleştirme:</strong> Yüksek boyutlu veriyi 2D scatter\'a indir.</li>'
+ '<li><strong>Sıkıştırma:</strong> Görüntü sıkıştırma, gen ifadesi.</li>'
+ '<li><strong>Gürültü azaltma:</strong> Düşük varyanslı PC\'leri at — gürültü çoğu zaman buralara düşer.</li>'
+ '<li><strong>Multicollinearity çözümü:</strong> Korreleli özelliklerden bağımsız PC\'ler türetir.</li>'
+ '<li><strong>Önişleme:</strong> Eğitimden önce boyut düşürerek hız kazanma.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">PCA Sınırları</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Lineer:</strong> Eğri/spiral yapıları açamaz.</li>'
+ '<li><strong>Sınıf bilgisini kullanmaz:</strong> Sınıfların ayrımına değil, varyansa bakar. (LDA bu işi yapar — denetimli boyut indirgeme.)</li>'
+ '<li><strong>Yorumlanabilirlik kaybı:</strong> PC\'ler özelliklerin lineer kombinasyonu — orijinal anlamlı sütunlar değil.</li>'
+ '</ul>'

+ '<h2 class="l-title">4. t-SNE — Lineer Olmayan Görselleştirme</h2>'

+ '<p class="l-text"><strong>t-SNE (t-Distributed Stochastic Neighbor Embedding)</strong>, 2008\'de van der Maaten ve Hinton\'un yayını. PCA\'dan tamamen farklı bir felsefe: <em>yüksek boyuttaki yakın noktalar düşük boyutta da yakın olsun</em>.</p>'

+ '<p class="l-text">Sezgi:</p>'

+ '<ol class="l-list">'
+ '<li>Yüksek boyutta her nokta için "diğer noktalara yakınlık" olasılık dağılımı oluştur (Gauss).</li>'
+ '<li>Düşük boyutta (örneğin 2D) her noktaya bir konum ata.</li>'
+ '<li>Düşük boyuttaki yakınlık dağılımıyla yüksek boyuttakinin <em>KL divergence</em>\'ını minimize et.</li>'
+ '<li>İteratif olarak konumları güncelle, dağılımlar uyana kadar.</li>'
+ '</ol>'

+ '<p class="l-text">Sonuç: yüksek boyutta küme yapılarını 2D\'de net şekilde gösterir. <strong>Görselleştirme için altın standart</strong>.</p>'

+ '<div class="l-warn"><strong>UYARILAR:</strong> t-SNE\'nin tehlikeli yanları var.<br>(1) <em>Mesafeler anlamsız:</em> 2D\'deki kümeler arası uzaklık, gerçek uzaklıkla orantılı değildir. Sadece "ayrı/yakın" sezgisi verir.<br>(2) <em>Stokastik:</em> Aynı veriyi iki kez çalıştırınca farklı sonuçlar alırsın. <code>random_state</code> sabitle.<br>(3) <em>Yavaş:</em> O(n²) — 100.000\'den fazla nokta için pratik değil.<br>(4) <em>Perplexity hyperparametresi kritik:</em> 5-50 arası dener; çok küçük = lokal yapı, büyük = global.</div>'

+ '<h2 class="l-title">5. UMAP — Modern Şampiyon</h2>'

+ '<p class="l-text"><strong>UMAP (Uniform Manifold Approximation and Projection)</strong>, 2018, McInnes ve ekibi. t-SNE\'ye matematiksel olarak benzer ama topolojik bir temele dayanır. Pratikte:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Çok daha hızlı:</strong> 1 milyon nokta dakikalar içinde (t-SNE\'de saatler).</li>'
+ '<li><strong>Global yapıyı daha iyi korur:</strong> Kümeler arası uzaklıklar daha anlamlı.</li>'
+ '<li><strong>Yeni veri ekleme mümkün:</strong> t-SNE her şeyi yeniden çalıştırır; UMAP eğitilmiş bir transform sunar.</li>'
+ '<li><strong>Yüksek boyuta da projeksiyon:</strong> 50+ boyut için de iyi (PCA gibi)<br>— sadece görselleştirme değil, önişleme için kullanılabilir.</li>'
+ '</ul>'

+ '<p class="l-text">Modern ML\'de ön-işleme/özellik öğrenme için sıkça UMAP tercih edilir. Görselleştirmede de t-SNE\'yi giderek geride bırakıyor.</p>'

+ '<h2 class="l-title">6. Üç Yöntemin Karşılaştırması</h2>'

+ '<div class="calc-example"><div class="example-label">NE ZAMAN HANGİSİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Özellik</th><th style="padding:.5rem">PCA</th><th style="padding:.5rem">t-SNE</th><th style="padding:.5rem">UMAP</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Lineer / Lineer olmayan</td><td style="text-align:center">Lineer</td><td style="text-align:center">Lineer olmayan</td><td style="text-align:center">Lineer olmayan</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Yorumlanabilirlik</td><td style="text-align:center">Yüksek (PC\'ler yorumlanabilir)</td><td style="text-align:center">Düşük</td><td style="text-align:center">Düşük</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Hız (10k örnek)</td><td style="text-align:center">Çok hızlı</td><td style="text-align:center">Yavaş (~1 dk)</td><td style="text-align:center">Hızlı (saniyeler)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Görselleştirme kalitesi</td><td style="text-align:center">Orta</td><td style="text-align:center">Mükemmel</td><td style="text-align:center">Mükemmel</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Yeni veri transform</td><td style="text-align:center">Evet</td><td style="text-align:center">Hayır</td><td style="text-align:center">Evet</td></tr>'
+ '<tr><td style="padding:.5rem">Boyutlar arası mesafe anlamı</td><td style="text-align:center">Korunur</td><td style="text-align:center">Bozulabilir</td><td style="text-align:center">Korunmaya yakın</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<p class="l-text"><strong>Pratik öneri:</strong> Önce PCA dene (hızlı sanity check). Sonra UMAP (görselleştirme + downstream task için). t-SNE sadece görselleştirme için ve veriniz küçükse.</p>'

+ '<h2 class="l-title">7. Boyut İndirgeme + Clustering — Güçlü İkili</h2>'

+ '<p class="l-text">Yüksek boyutta clustering zayıflar (boyutluluk laneti). Yaygın akış:</p>'

+ '<ol class="l-list">'
+ '<li>30 boyutlu veriyi UMAP ile 5 boyuta indir.</li>'
+ '<li>5 boyutta DBSCAN/k-Means uygula.</li>'
+ '<li>Sonuçları görselleştirmek için ek olarak 2 boyutlu UMAP üret.</li>'
+ '</ol>'

+ '<p class="l-text">Tek dim-reduction\'a bağlı kalmadan, downstream görevin matrisinde anlamlı uzaklıklar elde edersin.</p>'

+ '<h2 class="l-title">8. Python — PCA, t-SNE, UMAP Yan Yana</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Üç boyut indirgeme yöntemi<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> PCA'
+ '\n<span class="kw">from</span> sklearn.manifold <span class="kw">import</span> TSNE'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">import</span> umap'
+ '\n'
+ '\n<span class="cm"># X: 30 özellikli müşteri verisi</span>'
+ '\nX_scaled = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)'
+ '\n'
+ '\n<span class="cm"># 1) PCA — hızlı, lineer</span>'
+ '\npca = <span class="fn">PCA</span>(n_components=<span class="num">2</span>)'
+ '\nX_pca = pca.<span class="fn">fit_transform</span>(X_scaled)'
+ '\n<span class="fn">print</span>(<span class="str">f"PCA açıklanan varyans: {pca.explained_variance_ratio_.sum():.2%}"</span>)'
+ '\n'
+ '\n<span class="cm"># 2) t-SNE — yavaş ama güzel görselleştirme</span>'
+ '\ntsne = <span class="fn">TSNE</span>(n_components=<span class="num">2</span>, perplexity=<span class="num">30</span>, random_state=<span class="num">42</span>)'
+ '\nX_tsne = tsne.<span class="fn">fit_transform</span>(X_scaled)'
+ '\n'
+ '\n<span class="cm"># 3) UMAP — modern, hızlı, kaliteli</span>'
+ '\numap_model = umap.<span class="fn">UMAP</span>(n_components=<span class="num">2</span>, n_neighbors=<span class="num">15</span>, min_dist=<span class="num">0.1</span>, random_state=<span class="num">42</span>)'
+ '\nX_umap = umap_model.<span class="fn">fit_transform</span>(X_scaled)'
+ '\n'
+ '\n<span class="cm"># Plot all three</span>'
+ '\n<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt'
+ '\nfig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">3</span>, figsize=(<span class="num">15</span>, <span class="num">5</span>))'
+ '\n<span class="kw">for</span> ax, data, title <span class="kw">in</span> <span class="fn">zip</span>(axes, [X_pca, X_tsne, X_umap], [<span class="str">"PCA"</span>, <span class="str">"t-SNE"</span>, <span class="str">"UMAP"</span>]):'
+ '\n    ax.<span class="fn">scatter</span>(data[:, <span class="num">0</span>], data[:, <span class="num">1</span>], c=y, cmap=<span class="str">"coolwarm"</span>, s=<span class="num">10</span>)'
+ '\n    ax.<span class="fn">set_title</span>(title)'
+ '\nplt.<span class="fn">show</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> 30 boyutlu veriyi üç farklı yöntemle 2 boyuta indir. PCA hızlı (saniyeler içinde) ama lineer — kümeler iç içe görünebilir. t-SNE ve UMAP lineer olmayan, kümeleri açıkça ayırır. <code>perplexity=30</code> t-SNE\'nin "yakın komşu sayısı" yorumudur. <code>n_neighbors=15</code> UMAP için benzer rol — küçük değer lokal yapıyı korur, büyük değer global yapıyı.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Önişleme için PCA — boyut/zaman kazancı<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score'
+ '\n'
+ '\n<span class="cm"># PCA + lojistik regresyon pipeline</span>'
+ '\npipe = <span class="fn">make_pipeline</span>('
+ '\n    <span class="fn">StandardScaler</span>(),'
+ '\n    <span class="fn">PCA</span>(n_components=<span class="num">0.95</span>),  <span class="cm"># %95 varyansı koruyacak kadar PC tut</span>'
+ '\n    <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>),'
+ '\n)'
+ '\n'
+ '\nscores = <span class="fn">cross_val_score</span>(pipe, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"f1"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"PCA + LR F1: {scores.mean():.3f} ± {scores.std():.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># PCA olmadan</span>'
+ '\npipe_nopca = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>))'
+ '\nscores2 = <span class="fn">cross_val_score</span>(pipe_nopca, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"f1"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"LR (PCA yok): {scores2.mean():.3f} ± {scores2.std():.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> PCA\'yı pipeline\'a entegre et. <code>n_components=0.95</code> sayı yerine yüzde ver: PCA otomatik olarak %95 varyansı yakalayan en küçük PC sayısını seçer. Sonuçları PCA\'sız versiyonla karşılaştır — PCA bilgi kaybetmiş mi, yoksa kazanım sağlıyor mu? Multicollinear veride PCA performansı artırabilir, açıklanabilirlik düşse de.</p>'

+ '<h2 class="l-title">9. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Boyut indirgemeyi öğrendik. Şimdi <em>özellikleri kendimiz oluşturma/iyileştirme</em>ye geçiyoruz. <a href="/tutorials/ml-theory/10">Ders 10</a>: <strong>Özellik mühendisliği & dengesiz veri</strong>. Scaling, encoding, target encoding, polinom etkileşimleri, SMOTE ile dengesizlik. Veri bilim çalışmalarının %70\'i burada — model değil özellik kazanır.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Yüksek boyutlu verinin üç sorununu (görselleştirme, boyutluluk laneti, hesaplama maliyeti) öğrendin. PCA\'nın varyans tabanlı, lineer felsefesini ve özdeğer ayrışımı matematiğini gördün. Açıklanan varyans ile bileşen sayısını seçmeyi öğrendin. PCA\'nın kullanım alanlarını ve sınırlarını tanıdın. t-SNE\'nin lineer olmayan, görselleştirme odaklı yaklaşımını ve tehlikelerini gördün. UMAP\'ın modern, hızlı, hem görselleştirme hem önişleme için ideal yapısını kavradın. Üç yöntemin karşılaştırma tablosunu özümsedin. Boyut indirgeme + clustering ikilisinin yararını öğrendin. sklearn ve umap-learn ile gerçek kod yazdın.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> The math and practice of reducing high-dimensional data to 2-3 dimensions. <strong>PCA</strong> (linear, fast, interpretable), <strong>t-SNE</strong> (non-linear, visualisation champion), <strong>UMAP</strong> (modern, fast and high-quality). Project a 50-dim customer dataset to 2D and "see" the clusters with your own eyes. Plus: dimensionality reduction is not just for plotting — it also fights the curse of dimensionality.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Explain the curse of dimensionality\'s effect on distance and sample sparsity</li><li>Derive PCA as the eigenvectors of the feature covariance matrix</li><li>Tune t-SNE\'s perplexity hyperparameter for cleaner 2D visualisations</li><li>Project a 50-dim churn dataset to 2D with UMAP</li><li>Compare cluster quality before and after a PCA + KMeans pipeline</li></ul></div>'

+ '<h2 class="l-title">1. Why Dimensionality Reduction?</h2>'

+ '<p class="l-text">A churn dataset can have 30+ features: age, fee, tenure, contract type, payment method, usage volumes, call history, and so on. Three things become hard:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Visualisation is impossible:</strong> we cannot picture 30 dimensions. But we can plot 2-3.</li>'
+ '<li><strong>Curse of dimensionality:</strong> in high dimensions all points look "equally far"; distance and similarity lose meaning. kNN, k-Means break.</li>'
+ '<li><strong>Compute cost:</strong> some algorithms scale cubically with dimensions.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Dimensionality reduction</strong> tackles all three: it represents high-dim data in low-dim while preserving meaning.</p>'

+ '<h2 class="l-title">2. Curse of Dimensionality — Intuition</h2>'

+ '<p class="l-text">In 2D, the diagonal of the unit square is √2 ≈ 1.41. In 100D the unit cube\'s diagonal is √100 = 10. Distances explode with dimensions; meanwhile <em>all</em> distances become similar — the metric loses discriminative power.</p>'

+ '<div class="calc-example"><div class="example-label">A CONCRETE EFFECT</div><div class="example-body">'
+ '<p class="l-text">Ratio of "nearest" to "farthest" neighbour among 1000 random points:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7;text-align:center">'
+ '2 dim: 0.05 (nearest is much nearer)'
+ '<br>10 dim: 0.45'
+ '<br>100 dim: 0.90  ← almost everything is equidistant!'
+ '</p>'
+ '<p class="l-text">In high dimensions "near" loses meaning. This is why distance-based algorithms like kNN weaken in high dimensions.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. PCA — Principal Component Analysis</h2>'

+ '<p class="l-text"><strong>PCA</strong> is the oldest and most common dim-reduction. Intuition: <em>find the directions of greatest variance in the data</em>. These are called "principal components".</p>'

+ '<h3 class="l-subtitle">Geometric Picture</h3>'

+ '<p class="l-text">Picture an elongated 2D point cloud. PCA first finds the cloud\'s longest axis (PC1) — projecting onto it preserves the most information. Then the second longest, perpendicular to PC1 (PC2). In 3D, a third, etc.</p>'

+ '<p class="l-text">The first few PCs typically explain 80-95% of variance. We drop the rest, losing little information.</p>'

+ '<h3 class="l-subtitle">Math — Eigendecomposition</h3>'

+ '<p class="l-text">PCA is an <strong>eigendecomposition of the covariance matrix</strong>. After centring the data:</p>'

+ '<div class="katex-block">$$\\Sigma = \\frac{1}{n} X^\\top X, \\qquad \\Sigma \\mathbf{v}_i = \\lambda_i \\mathbf{v}_i$$</div>'

+ '<p class="l-text">Where:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Σ:</strong> the p×p covariance matrix.</li>'
+ '<li><strong>v<sub>i</sub>:</strong> i-th eigenvector — the direction of the i-th PC.</li>'
+ '<li><strong>λ<sub>i</sub>:</strong> i-th eigenvalue — the variance along that direction.</li>'
+ '</ul>'

+ '<p class="l-text">Sort eigenvalues in descending order. Take the top <em>d</em> eigenvectors as the projection matrix. Dimensions go from p to d.</p>'

+ '<div class="katex-block">$$X_{\\text{reduced}} = X \\cdot V_d \\quad (n \\times p) \\cdot (p \\times d) = (n \\times d)$$</div>'

+ '<p class="l-text">Linear algebra magic — a few lines of code, deep geometric meaning.</p>'

+ '<h3 class="l-subtitle">Explained Variance</h3>'

+ '<p class="l-text">How many PCs to keep? <strong>Explained variance ratio</strong>:</p>'

+ '<div class="katex-block">$$\\text{explained variance}_i = \\frac{\\lambda_i}{\\sum_j \\lambda_j}$$</div>'

+ '<p class="l-text">Practical rule: keep PCs until cumulative reaches 90-95%. If the first 5 PCs cover 92%, you can drop from 30 to 5 dims with only 8% information loss.</p>'

+ '<div class="plotly-graph"><div id="plot-pca-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var pcs=[1,2,3,4,5,6,7,8,9,10,15,20,25,30];'
+ 'var ind=[0.42,0.18,0.10,0.07,0.05,0.04,0.035,0.025,0.02,0.015,0.008,0.005,0.003,0.002];'
+ 'var cum=[];var sum=0;'
+ 'for(var i=0;i<ind.length;i++){sum+=ind[i];cum.push(sum);}'
+ 'var t1={x:pcs,y:ind,name:"Individual variance",type:"bar",marker:{color:T.accent}};'
+ 'var t2={x:pcs,y:cum,name:"Cumulative",type:"scatter",mode:"lines+markers",line:{color:"rgba(78,205,196,.9)",width:3},yaxis:"y2"};'
+ 'var layout={xaxis:{title:"Principal Component",color:T.text,gridcolor:T.grid},yaxis:{title:"Individual variance",color:T.text,gridcolor:T.grid,tickformat:".0%"},yaxis2:{title:"Cumulative",overlaying:"y",side:"right",color:T.text,tickformat:".0%",range:[0,1.05]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:60,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,xanchor:"center",x:0.5}};'
+ 'if(document.getElementById("plot-pca-en"))Plotly.newPlot("plot-pca-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> PCA on a 30-dim example. Purple bars: variance per PC — PC1 42%, PC2 18%, etc. Green line: cumulative — top 5 PCs cover 82%, top 10 cover 92%. We can use 10 dims instead of 30.</div>'

+ '<h3 class="l-subtitle">PCA Use Cases</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Visualisation:</strong> reduce high-dim data to a 2D scatter.</li>'
+ '<li><strong>Compression:</strong> image compression, gene expression.</li>'
+ '<li><strong>Noise reduction:</strong> drop low-variance PCs — noise often falls there.</li>'
+ '<li><strong>Decorrelation:</strong> derives PCs that are uncorrelated, fixing multicollinearity.</li>'
+ '<li><strong>Pre-processing:</strong> speed up training by reducing dimensions.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">PCA Limits</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Linear:</strong> cannot unfold curved/spiral structures.</li>'
+ '<li><strong>Ignores labels:</strong> looks at variance, not class separation. (LDA does that — supervised dim-reduction.)</li>'
+ '<li><strong>Loses interpretability:</strong> PCs are linear combinations — not the original meaningful columns.</li>'
+ '</ul>'

+ '<h2 class="l-title">4. t-SNE — Non-linear Visualisation</h2>'

+ '<p class="l-text"><strong>t-SNE (t-Distributed Stochastic Neighbor Embedding)</strong>, van der Maaten and Hinton 2008. Completely different from PCA: <em>nearby points in high-dim should remain nearby in low-dim</em>.</p>'

+ '<p class="l-text">Intuition:</p>'

+ '<ol class="l-list">'
+ '<li>In high-dim: build a probability distribution of "closeness" around each point (Gaussian).</li>'
+ '<li>In low-dim (e.g. 2D): assign each point a position.</li>'
+ '<li>Minimise the KL divergence between the low-dim closeness distribution and the high-dim one.</li>'
+ '<li>Iteratively update positions until they match.</li>'
+ '</ol>'

+ '<p class="l-text">Result: cluster structure from high-dim shows up clearly in 2D. <strong>Gold standard for visualisation</strong>.</p>'

+ '<div class="l-warn"><strong>WARNINGS:</strong> t-SNE has dangerous quirks.<br>(1) <em>Distances are meaningless:</em> distances between clusters in 2D are not proportional to true distances. Only "near vs separated" intuition.<br>(2) <em>Stochastic:</em> two runs on the same data give different results. Set <code>random_state</code>.<br>(3) <em>Slow:</em> O(n²) — impractical for >100k points.<br>(4) <em>Perplexity is critical:</em> try 5-50; small = local structure, large = global.</div>'

+ '<h2 class="l-title">5. UMAP — Modern Champion</h2>'

+ '<p class="l-text"><strong>UMAP (Uniform Manifold Approximation and Projection)</strong>, McInnes et al. 2018. Mathematically similar to t-SNE but rooted in topology. In practice:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Much faster:</strong> 1M points in minutes (t-SNE: hours).</li>'
+ '<li><strong>Better global structure:</strong> distances between clusters are more meaningful.</li>'
+ '<li><strong>Can transform new data:</strong> t-SNE has to refit; UMAP gives a learned transform.</li>'
+ '<li><strong>Projects to higher dims too:</strong> works for 50+ dims (like PCA) — usable beyond visualisation, e.g. for preprocessing.</li>'
+ '</ul>'

+ '<p class="l-text">Modern ML increasingly prefers UMAP for preprocessing/feature learning. It is also overtaking t-SNE for plotting.</p>'

+ '<h2 class="l-title">6. Comparing the Three</h2>'

+ '<div class="calc-example"><div class="example-label">WHEN TO USE WHICH</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Property</th><th style="padding:.5rem">PCA</th><th style="padding:.5rem">t-SNE</th><th style="padding:.5rem">UMAP</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Linear / non-linear</td><td style="text-align:center">Linear</td><td style="text-align:center">Non-linear</td><td style="text-align:center">Non-linear</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Interpretability</td><td style="text-align:center">High (PCs interpretable)</td><td style="text-align:center">Low</td><td style="text-align:center">Low</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Speed (10k samples)</td><td style="text-align:center">Very fast</td><td style="text-align:center">Slow (~1 min)</td><td style="text-align:center">Fast (seconds)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Visualisation quality</td><td style="text-align:center">Medium</td><td style="text-align:center">Excellent</td><td style="text-align:center">Excellent</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Transform new data</td><td style="text-align:center">Yes</td><td style="text-align:center">No</td><td style="text-align:center">Yes</td></tr>'
+ '<tr><td style="padding:.5rem">Distance meaning</td><td style="text-align:center">Preserved</td><td style="text-align:center">Distorted</td><td style="text-align:center">Mostly preserved</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<p class="l-text"><strong>Practical advice:</strong> Try PCA first (fast sanity check). Then UMAP (visualisation + downstream). Use t-SNE only for visualisation on small data.</p>'

+ '<h2 class="l-title">7. Dim-Reduction + Clustering — Strong Combo</h2>'

+ '<p class="l-text">Clustering weakens in high dimensions (curse of dimensionality). Common workflow:</p>'

+ '<ol class="l-list">'
+ '<li>Reduce 30-dim data to 5-dim with UMAP.</li>'
+ '<li>Apply DBSCAN/k-Means on those 5 dims.</li>'
+ '<li>Additionally make a 2-dim UMAP just for visualisation.</li>'
+ '</ol>'

+ '<p class="l-text">By splitting roles you get meaningful distances for clustering and a separate plot for humans.</p>'

+ '<h2 class="l-title">8. Python — PCA, t-SNE, UMAP Side by Side</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Three dim-reduction methods<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> PCA'
+ '\n<span class="kw">from</span> sklearn.manifold <span class="kw">import</span> TSNE'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">import</span> umap'
+ '\n'
+ '\n<span class="cm"># X: 30-feature customer data</span>'
+ '\nX_scaled = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)'
+ '\n'
+ '\n<span class="cm"># 1) PCA — fast, linear</span>'
+ '\npca = <span class="fn">PCA</span>(n_components=<span class="num">2</span>)'
+ '\nX_pca = pca.<span class="fn">fit_transform</span>(X_scaled)'
+ '\n<span class="fn">print</span>(<span class="str">f"PCA explained variance: {pca.explained_variance_ratio_.sum():.2%}"</span>)'
+ '\n'
+ '\n<span class="cm"># 2) t-SNE — slow, beautiful for visualisation</span>'
+ '\ntsne = <span class="fn">TSNE</span>(n_components=<span class="num">2</span>, perplexity=<span class="num">30</span>, random_state=<span class="num">42</span>)'
+ '\nX_tsne = tsne.<span class="fn">fit_transform</span>(X_scaled)'
+ '\n'
+ '\n<span class="cm"># 3) UMAP — modern, fast, high quality</span>'
+ '\numap_model = umap.<span class="fn">UMAP</span>(n_components=<span class="num">2</span>, n_neighbors=<span class="num">15</span>, min_dist=<span class="num">0.1</span>, random_state=<span class="num">42</span>)'
+ '\nX_umap = umap_model.<span class="fn">fit_transform</span>(X_scaled)'
+ '\n'
+ '\n<span class="cm"># Plot all three</span>'
+ '\n<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt'
+ '\nfig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">3</span>, figsize=(<span class="num">15</span>, <span class="num">5</span>))'
+ '\n<span class="kw">for</span> ax, data, title <span class="kw">in</span> <span class="fn">zip</span>(axes, [X_pca, X_tsne, X_umap], [<span class="str">"PCA"</span>, <span class="str">"t-SNE"</span>, <span class="str">"UMAP"</span>]):'
+ '\n    ax.<span class="fn">scatter</span>(data[:, <span class="num">0</span>], data[:, <span class="num">1</span>], c=y, cmap=<span class="str">"coolwarm"</span>, s=<span class="num">10</span>)'
+ '\n    ax.<span class="fn">set_title</span>(title)'
+ '\nplt.<span class="fn">show</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Reduce 30-dim data with three methods. PCA is fast (seconds) but linear — clusters can overlap. t-SNE and UMAP are non-linear and separate clusters cleanly. <code>perplexity=30</code> in t-SNE is roughly "number of effective neighbours". <code>n_neighbors=15</code> plays a similar role in UMAP — small for local, large for global structure.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> PCA as preprocessing — speed/dim wins<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score'
+ '\n'
+ '\n<span class="cm"># PCA + logistic regression pipeline</span>'
+ '\npipe = <span class="fn">make_pipeline</span>('
+ '\n    <span class="fn">StandardScaler</span>(),'
+ '\n    <span class="fn">PCA</span>(n_components=<span class="num">0.95</span>),  <span class="cm"># keep enough PCs for 95% variance</span>'
+ '\n    <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>),'
+ '\n)'
+ '\n'
+ '\nscores = <span class="fn">cross_val_score</span>(pipe, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"f1"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"PCA + LR F1: {scores.mean():.3f} ± {scores.std():.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># Without PCA</span>'
+ '\npipe_nopca = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>))'
+ '\nscores2 = <span class="fn">cross_val_score</span>(pipe_nopca, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"f1"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"LR (no PCA): {scores2.mean():.3f} ± {scores2.std():.3f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> PCA inside a pipeline. <code>n_components=0.95</code> auto-picks the smallest number of PCs covering 95% variance. Compare to a no-PCA pipeline — does PCA lose info or help? On multicollinear data PCA can boost performance, at the cost of interpretability.</p>'

+ '<h2 class="l-title">9. What\'s Next</h2>'

+ '<p class="l-text">We have learned dimensionality reduction. Now to <em>creating/improving features ourselves</em>. <a href="/tutorials/ml-theory/10">Lesson 10</a>: <strong>feature engineering & imbalanced data</strong>. Scaling, encoding, target encoding, polynomial interactions, SMOTE for class imbalance. 70% of data-science work happens here — features win, not models.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The three problems of high-dimensional data (visualisation, curse of dimensionality, compute cost). PCA\'s variance-based, linear philosophy and its eigendecomposition math. Choosing the number of components via explained variance. PCA\'s use cases and limitations. t-SNE\'s non-linear, visualisation-focused approach and its pitfalls. UMAP\'s modern strengths — fast, both visualisation and preprocessing. The comparison table for picking the right method. The dim-reduction + clustering combo. Real code with sklearn and umap-learn.</div>'

};
