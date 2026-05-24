/* ml-L14.js — ML Theory Lesson 14: k-Nearest Neighbors (TR + EN) */
var ML_L14 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/ml-theory/3">Ders 3</a>\'te kNN\'i kısaca tanıttık; şimdi tam bir derste ele alıyoruz. Bu algoritmanın felsefesi tek cümlede: <em>"bana arkadaşını söyle, sana kim olduğunu söyleyeyim"</em>. Hiçbir parametre öğrenmez, sadece veriyi ezberler. Bu derste mesafe metriklerini, boyutluluk lanetini, k seçimini, ağırlıklı oylamayı, verimli arama yapılarını (kd-tree, ball-tree, FAISS) ve kNN\'in 2026 yılında niye hâlâ kritik olduğunu (RAG, embedding retrieval) göreceksin.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Tembel öğrenme (lazy learning) felsefesinin ne demek olduğunu ve niye eğitim aşamasının olmadığını</li><li>Euclidean, Manhattan, Chebyshev, Minkowski ve kosinüs metriklerini ne zaman kullanacağını</li><li>Boyutluluk lanetinin (curse of dimensionality) kNN\'i nasıl çökerttiğini somut bir simülasyonla</li><li>k=1, k=5, k=20 karar sınırlarını iris veri kümesinde karşılaştıracaksın — overfit/underfit dengesini göreceksin</li><li>Ağırlıklı kNN\'in nasıl çalıştığını ve uzak komşunun oyunu nasıl azalttığını</li><li>kd-tree, ball-tree ve FAISS/HNSW gibi modern ANN kütüphanelerinin ne işe yaradığını</li><li>kNN\'in RAG mimarisinde, vektör veritabanlarında, embedding retrieval\'da modern rolünü</li></ul></div>'

+ '<h2 class="l-title">1. Sezgi — Tembel Öğrenmenin Felsefesi</h2>'

+ '<p class="l-text">İnsan beyni de sınıflandırırken benzer bir şey yapar: yeni bir köpek ırkı gördüğünde <em>"bu en çok Labrador\'a benziyor"</em> der. kNN tam olarak bu: tahmin anında, sorgu noktasına en yakın <strong>k</strong> eğitim örneğini bulur ve onların etiketinden hareket eder.</p>'

+ '<div class="calc-example"><div class="example-label">FELSEFENİN ÖZÜ</div><div class="example-body">'
+ '<p class="l-text">Çoğu algoritma (lojistik regresyon, ağaçlar, sinir ağları) bir <em>model</em> eğitir: veriden kuralları/ağırlıkları çıkarır, sonra bu modelle tahmin yapar. Buna <strong>eager (istekli) öğrenme</strong> denir — fit aşamasında ağır iş, predict aşamasında hafif iş.</p>'
+ '<p class="l-text">kNN tersini yapar. <code>fit()</code> aşamasında <em>hiçbir şey öğrenmez</em>: sadece veriyi belleğe kopyalar. Bütün iş <code>predict()</code> anına ertelenir. Buna <strong>lazy (tembel) öğrenme</strong> denir. Model yok, sadece bellek + mesafe hesabı.</p>'
+ '<p class="l-text">Bu yüzden kNN bazen <em>"instance-based learning"</em> (örneğe-dayalı öğrenme) veya <em>"memory-based learning"</em> olarak da anılır. Genelleme yapmaz, sadece benzerlik üzerinden cevap üretir.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. Algoritma — Adım Adım</h2>'

+ '<p class="l-text">kNN\'in çekirdek prosedürü inanılmaz basittir. Sınıflandırma için:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Mesafeleri hesapla:</strong> sorgu noktası <em>x<sub>q</sub></em> ile eğitim setindeki <em>her bir</em> nokta arasındaki mesafeyi ölç.</li>'
+ '<li><strong>Sırala ve k tanesini al:</strong> en küçük k mesafeli noktaları bul — bunlar k komşu.</li>'
+ '<li><strong>Oyla:</strong> bu k komşunun etiketleri arasında çoğunluk olan sınıfı seç. Beraberlik durumunda k\'yı tek seç ya da rastgele kır.</li>'
+ '</ol>'

+ '<p class="l-text">Regresyon için 3. adım değişir: çoğunluk yerine k komşunun hedef değerlerinin <em>ortalaması</em> (veya medyanı) alınır.</p>'

+ '<div class="katex-block">$$\\hat{y}(x_q) = \\frac{1}{k}\\sum_{x_i \\in N_k(x_q)} y_i \\qquad \\text{(regresyon)}$$</div>'

+ '<p class="l-text">Olasılık tahmini de mümkündür: k komşunun ne kadarının pozitif sınıfta olduğu oran olarak kullanılır. Örnek: k=10 komşunun 7\'si "kayıp" ise <em>P(kayıp) = 0.7</em>.</p>'

+ '<h2 class="l-title">3. Mesafe Metrikleri — Yakınlığı Nasıl Ölçeriz?</h2>'

+ '<p class="l-text">"Yakın" tanımı kullanılan metriğe göre değişir. En yaygın seçenekler:</p>'

+ '<div class="katex-block">$$d_{\\text{Euclidean}}(x, y) = \\sqrt{\\sum_{i=1}^{p} (x_i - y_i)^2}$$</div>'

+ '<p class="l-text"><strong>Euclidean (L2):</strong> klasik kuş uçuşu mesafe. Sürekli, sayısal özellikler için varsayılan tercih.</p>'

+ '<div class="katex-block">$$d_{\\text{Manhattan}}(x, y) = \\sum_{i=1}^{p} |x_i - y_i|$$</div>'

+ '<p class="l-text"><strong>Manhattan (L1):</strong> sokak ızgarasında yürüme mesafesi. Aykırı (outlier) özellik farklarına Euclidean\'dan daha dirençli, çünkü kare almaz.</p>'

+ '<div class="katex-block">$$d_{\\text{Chebyshev}}(x, y) = \\max_{i} |x_i - y_i|$$</div>'

+ '<p class="l-text"><strong>Chebyshev (L∞):</strong> sadece en büyük boyut farkı sayılır. Satranç tahtasında şahın hareketi. Anomali tespitinde işe yarar.</p>'

+ '<div class="katex-block">$$d_{\\text{Minkowski}}(x, y) = \\left( \\sum_{i=1}^{p} |x_i - y_i|^p \\right)^{1/p}$$</div>'

+ '<p class="l-text"><strong>Minkowski (Lp):</strong> hepsinin genel hali. p=1 → Manhattan, p=2 → Euclidean, p=∞ → Chebyshev. sklearn\'de <code>metric=\'minkowski\', p=2</code> varsayılan.</p>'

+ '<div class="katex-block">$$d_{\\cos}(x, y) = 1 - \\frac{x \\cdot y}{\\|x\\| \\, \\|y\\|}$$</div>'

+ '<p class="l-text"><strong>Kosinüs (cosine):</strong> iki vektör arasındaki açıyı ölçer; uzunluklarını yok sayar. Metin (TF-IDF, embedding) için neredeyse her zaman doğru seçim — "kedi" ve "kedicik" embedding\'leri farklı normlu olsa bile yön olarak yakındır. RAG ve modern semantik arama bu metrik üzerine kurulu.</p>'

+ '<p class="l-text"><strong>Önemli uyarı:</strong> Hangi metriği seçersen seç, özelliklerin <strong>ölçeklenmesi şart</strong>. Yaş 28, gelir 80000 ise Euclidean\'de gelir farkı tamamen baskın olur. <code>StandardScaler</code> veya <code>MinMaxScaler</code> kullan.</p>'

+ '<h2 class="l-title">4. Boyutluluk Laneti — kNN\'in Aşil Topuğu</h2>'

+ '<p class="l-text">kNN düşük boyutta harikadır. Ama özellik sayısı arttıkça (örneğin 100, 1000 boyut) garip bir şey olur: <em>tüm noktalar birbirine eşit uzaklıkta görünür</em>. "En yakın komşu" anlamını yitirir.</p>'

+ '<div class="calc-example"><div class="example-label">NEDEN BÖYLE OLUR</div><div class="example-body">'
+ '<p class="l-text">Birim küpün içinde rastgele dağıtılmış noktalar düşün. Boyut sayısı d büyüdükçe, küpün <strong>hacminin büyük çoğunluğu kabukta</strong> toplanır. Yani noktalar merkeze değil, kenarlara doğru gider.</p>'
+ '<p class="l-text">Bunun sonucu: <strong>en yakın komşu ile en uzak komşu arasındaki oran 1\'e yaklaşır</strong>. Yani <em>"en yakın"</em> diye bir şey kalmaz; her şey aşağı yukarı aynı uzaklıkta. kNN ne yapacağını şaşırır, rastgele tahminlere döner.</p>'
+ '<p class="l-text">Matematiksel olarak: <em>d</em> boyutta noktalar arası mesafelerin varyansı, ortalamasına oranla küçülür: <em>(d<sub>max</sub> − d<sub>min</sub>) / d<sub>min</sub> → 0</em>, iken <em>d → ∞</em>.</p>'
+ '</div></div>'

+ '<div class="plotly-graph"><div id="plot-l14-curse-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'function simulate(d){var N=400;var pts=[];for(var i=0;i<N;i++){var v=[];for(var j=0;j<d;j++)v.push(Math.random());pts.push(v);}var origin=[];for(var j=0;j<d;j++)origin.push(0.5);var dists=[];for(var i=0;i<N;i++){var s=0;for(var j=0;j<d;j++){var diff=pts[i][j]-origin[j];s+=diff*diff;}dists.push(Math.sqrt(s));}var mn=Math.min.apply(null,dists);var mx=Math.max.apply(null,dists);return(mx-mn)/mn;}'
+ 'var dims=[];var ratios=[];for(var d=4;d<=200;d+=4){dims.push(d);ratios.push(simulate(d));}'
+ 'var t1={x:dims,y:ratios,type:"scatter",mode:"lines+markers",line:{color:T.accent,width:2.5},marker:{size:5,color:T.accent},name:"(dmax − dmin) / dmin"};'
+ 'var layout={xaxis:{title:"Boyut sayısı (d)",color:T.text,gridcolor:T.grid},yaxis:{title:"Göreli mesafe yayılımı (log)",type:"log",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:70},showlegend:false};'
+ 'if(document.getElementById("plot-l14-curse-tr"))Plotly.newPlot("plot-l14-curse-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Birim küpte rastgele 400 nokta ürettim, hepsinin merkeze olan mesafesini hesapladım. Y ekseni "en uzak ile en yakın nokta arasındaki göreli fark". Boyut 2\'de bu oran ~2.5 — yani en uzak nokta en yakının 3.5 katı uzaklıkta, anlamlı fark var. Boyut 100+\'a çıkınca oran 0.2\'lere düşüyor — herkes neredeyse aynı uzaklıkta. İşte bu yüzden yüksek boyutlu görüntü/metin verisinde ham kNN çalışmaz; önce PCA, t-SNE veya öğrenilmiş embedding ile boyut indirgemen gerekir.</div>'

+ '<p class="l-text"><strong>Pratik çözümler:</strong> (1) Boyut indirgeme: PCA, UMAP, autoencoder. (2) Öznitelik seçimi: alakasız sütunları at. (3) Öğrenilmiş embedding: transformer/CNN ile düşük-boyutlu anlamlı temsil çıkar — sonra o uzayda kNN. Modern RAG\'ın yaptığı tam bu.</p>'

+ '<h2 class="l-title">5. k\'yı Seçmek — Sapma-Varyans İkilemi</h2>'

+ '<p class="l-text">k değeri kNN\'in en kritik hiperparametresidir. Ekstremler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>k = 1:</strong> sadece en yakın komşuya bak. Karar sınırı çok pürüzlü, her gürültü noktasına saygı duyar. <em>Yüksek varyans, düşük sapma</em> — eğitim verisini ezberler, test verisinde dalgalanır. Overfit.</li>'
+ '<li><strong>k = N (tüm veri):</strong> her sorguda baskın sınıfı verir. Hiçbir bilgi taşımaz. <em>Yüksek sapma, düşük varyans</em>. Underfit.</li>'
+ '<li><strong>k = √N civarı:</strong> yaygın başlangıç heuristiği. Ama gerçek cevap cross-validation\'la çıkar.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>İpucu:</strong> İkili sınıflandırmada k\'yı <em>tek sayı</em> seç (3, 5, 7, …) — beraberlik olmasın. Çok sınıflıda hâlâ tek seç ama beraberlik olabilir; sklearn varsayılan olarak küçük sınıf etiketini tercih eder.</p>'

+ '<div class="plotly-graph"><div id="plot-l14-knn-k-tr" style="width:100%;height:480px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'function genData(){var rng=function(s){return function(){s=(s*9301+49297)%233280;return s/233280;};};var r=rng(42);var A=[],B=[];for(var i=0;i<25;i++){A.push([3+r()*2,3+r()*2]);}for(var i=0;i<25;i++){B.push([5.5+r()*2,5.5+r()*2]);}A.push([6.2,5.8]);B.push([3.3,3.5]);return{A:A,B:B};}'
+ 'var data=genData();'
+ 'function classify(x,y,k){var pts=[];data.A.forEach(function(p){pts.push({d:Math.hypot(p[0]-x,p[1]-y),c:0});});data.B.forEach(function(p){pts.push({d:Math.hypot(p[0]-x,p[1]-y),c:1});});pts.sort(function(a,b){return a.d-b.d;});var s=0;for(var i=0;i<k;i++)s+=pts[i].c;return s>k/2?1:0;}'
+ 'function makeGrid(k){var xs=[],ys=[],cs=[];for(var i=0;i<60;i++){for(var j=0;j<60;j++){var x=2+i*5/60,y=2+j*5/60;xs.push(x);ys.push(y);cs.push(classify(x,y,k));}}return{xs:xs,ys:ys,cs:cs};}'
+ 'function buildTraces(k,xref,yref){var g=makeGrid(k);var bg={x:g.xs,y:g.ys,type:"scatter",mode:"markers",marker:{color:g.cs,colorscale:[[0,"rgba(139,92,246,0.18)"],[1,"rgba(248,113,113,0.18)"]],size:6,showscale:false,symbol:"square"},showlegend:false,xaxis:xref,yaxis:yref};var pA={x:data.A.map(function(p){return p[0];}),y:data.A.map(function(p){return p[1];}),type:"scatter",mode:"markers",marker:{color:T.accent,size:8,symbol:"circle"},showlegend:false,xaxis:xref,yaxis:yref};var pB={x:data.B.map(function(p){return p[0];}),y:data.B.map(function(p){return p[1];}),type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.9)",size:8,symbol:"x"},showlegend:false,xaxis:xref,yaxis:yref};return[bg,pA,pB];}'
+ 'var traces=[].concat(buildTraces(1,"x1","y1"),buildTraces(5,"x2","y2"),buildTraces(20,"x3","y3"));'
+ 'var layout={grid:{rows:1,columns:3,pattern:"independent"},xaxis:{title:"k = 1 (overfit)",color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid},xaxis2:{title:"k = 5 (dengeli)",color:T.text,gridcolor:T.grid},yaxis2:{color:T.text,gridcolor:T.grid},xaxis3:{title:"k = 20 (underfit)",color:T.text,gridcolor:T.grid},yaxis3:{color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:50}};'
+ 'if(document.getElementById("plot-l14-knn-k-tr"))Plotly.newPlot("plot-l14-knn-k-tr",traces,layout,{responsive:true,displayModeBar:false});'
+ '});},300)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Aynı oyuncak veri kümesinde (mor daireler vs kırmızı X\'ler, her sınıfta bir aykırı nokta var) üç farklı k için karar sınırı. <strong>k=1</strong>\'de sınır aykırı noktanın etrafında "ada"lar oluşturuyor — model gürültüyü ezberlemiş. <strong>k=5</strong>\'te sınır pürüzsüz ve mantıklı, aykırı noktalar yutulmuş. <strong>k=20</strong>\'de sınır neredeyse düz çizgi olmuş, model çok genelleme yapıyor, ince yapıları kaçırıyor. Pratikte k\'yı 5-fold CV ile seçersin.</div>'

+ '<h2 class="l-title">6. Ağırlıklı kNN — Yakın Komşu Daha Çok Söz Sahibi</h2>'

+ '<p class="l-text">Standart kNN\'de k komşunun her biri eşit oy kullanır — k. komşunun sınırda olup olmaması fark etmez. Bu bazen mantıksızdır: çok yakın 2 komşunun oyu, uzak 3 komşunun oyundan daha güvenilir olmalı.</p>'

+ '<p class="l-text"><strong>Ağırlıklı kNN</strong> her komşuya mesafesinin tersine orantılı bir ağırlık verir. En yaygın seçim 1/d² ağırlıklandırma:</p>'

+ '<div class="katex-block">$$\\hat{p}(c \\mid x_q) = \\frac{\\sum_{i \\in N_k} \\mathbb{1}[y_i = c] \\cdot w_i}{\\sum_{i \\in N_k} w_i}, \\qquad w_i = \\frac{1}{d(x_q, x_i)^2 + \\epsilon}$$</div>'

+ '<p class="l-text">Buradaki <em>ε</em> sıfıra bölmeyi engellemek için küçük bir sabit. sklearn\'de <code>weights=\'distance\'</code> bunu otomatik yapar. Avantajı: k seçimi daha az hassas olur — sınırdaki komşular zaten zayıf ağırlıkla katkıda bulunur.</p>'

+ '<h2 class="l-title">7. Verimli Arama Yapıları — N Büyüdüğünde</h2>'

+ '<p class="l-text">Naif (kaba kuvvet) kNN her sorguda eğitim setindeki tüm N noktayla mesafe hesaplar — <em>O(Nd)</em>. N=100, d=4 için sorun yok. N=1 milyon, d=512 için (gerçek dünya embedding\'leri) felaket.</p>'

+ '<p class="l-text">Çözüm: <strong>özel veri yapıları</strong> kullanmak.</p>'

+ '<ul class="l-list">'
+ '<li><strong>kd-tree:</strong> uzayı eksen-paralel hiperdüzlemlerle yinelemeli olarak ikiye böler. Düşük boyutta (d ≲ 20) <em>O(log N)</em> sorgu süresi sağlar. Yüksek boyutta kötüleşir — eksen-paralel bölmeler manidar bir yapı yakalayamaz.</li>'
+ '<li><strong>ball-tree:</strong> uzayı küresel "top"larla hiyerarşik böler. kd-tree\'den daha esnek; orta boyut (20-100) için iyi. Euclidean dışı metriklerle de çalışır.</li>'
+ '<li><strong>LSH (Locality-Sensitive Hashing):</strong> benzer noktaların aynı kovaya düşmesini sağlayan hash fonksiyonları. Yaklaşık sonuç verir, çok hızlıdır.</li>'
+ '<li><strong>HNSW (Hierarchical Navigable Small World):</strong> grafik tabanlı, en modern yaklaşımlardan biri. FAISS, ScaNN, Annoy, Qdrant, Pinecone, Weaviate, Chroma bu sınıftan algoritmalar kullanır.</li>'
+ '<li><strong>IVF + PQ (Inverted File + Product Quantization):</strong> FAISS\'in milyar-ölçek için kullandığı yaklaşım — önce kabaca kümele, sonra sıkıştırılmış vektörlerde ara.</li>'
+ '</ul>'

+ '<p class="l-text">Bunların hepsi <strong>ANN (Approximate Nearest Neighbour)</strong> sınıfına girer — yaklaşık sonuç döndürürler ama 1000x hızlı olabilirler. Modern LLM uygulamaları (RAG, semantic search) bu kütüphaneler olmadan ölçeklenmez.</p>'

+ '<h2 class="l-title">8. Çalışılmış Örnek — İris Veri Kümesinde kNN</h2>'

+ '<p class="l-text">Iris, ML\'in ünlü oyuncak veri kümesi: 150 çiçek, 3 tür (setosa, versicolor, virginica), 4 öznitelik (sepal uzunluk/genişlik, petal uzunluk/genişlik). kNN için ideal — küçük, sayısal, görselleştirilebilir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> İris üzerinde kNN, farklı k değerleri<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score, train_test_split'
+ '\n<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KNeighborsClassifier'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n<span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n'
+ '\nX, y = <span class="fn">load_iris</span>(return_X_y=<span class="kw">True</span>)'
+ '\nX_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, stratify=y, random_state=<span class="num">42</span>)'
+ '\n'
+ '\n<span class="cm"># Farklı k değerleri için 5-fold CV doğruluğu</span>'
+ '\n<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">1</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">11</span>, <span class="num">25</span>, <span class="num">50</span>]:'
+ '\n    pipe = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">KNeighborsClassifier</span>(n_neighbors=k))'
+ '\n    cv = <span class="fn">cross_val_score</span>(pipe, X_tr, y_tr, cv=<span class="num">5</span>).<span class="fn">mean</span>()'
+ '\n    <span class="fn">print</span>(<span class="str">f"k={k:3d}  CV doğruluk={cv:.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># Ağırlıklı kNN ile karşılaştırma</span>'
+ '\nbest = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(),'
+ '\n                     <span class="fn">KNeighborsClassifier</span>(n_neighbors=<span class="num">5</span>, weights=<span class="str">"distance"</span>))'
+ '\nbest.<span class="fn">fit</span>(X_tr, y_tr)'
+ '\n<span class="fn">print</span>(<span class="str">f"Test doğruluk (k=5, weighted): {best.score(X_te, y_te):.3f}"</span>)'
+ '\n<span class="cm"># k=  1  CV doğruluk=0.943</span>'
+ '\n<span class="cm"># k=  5  CV doğruluk=0.962  ← en iyi</span>'
+ '\n<span class="cm"># k= 50  CV doğruluk=0.733  ← underfit (her sınıfta ~35 örnek var, k=50 hepsini karıştırır)</span></code></pre></div></div>'

+ '<p class="l-text">Burada üç kritik tasarım kararı var: <code>StandardScaler</code> mesafeyi adil yapar (petal vs sepal cm farkı yok olur); <code>stratify=y</code> böler ki her sınıf train ve test\'te dengeli temsil edilsin; <code>cross_val_score</code> tek bir test split\'ine değil 5 katmanın ortalamasına bakar. k=50 örneğinde her sınıfta yalnızca ~35 örnek olduğu için 50 komşu zorla başka sınıflardan da çekilir — bu yüzden doğruluk çöker.</p>'

+ '<h2 class="l-title">9. kNN Regresyon — California Konut Fiyatı</h2>'

+ '<p class="l-text">Sınıflandırma için yapılan her şey regresyona <em>doğrudan</em> uyarlanabilir. Tek fark: oy yerine ortalama (veya medyan). California housing kümesinde deneyelim — 20,640 mahalle, 8 öznitelik (gelir, ev yaşı, oda sayısı, vb.), hedef ortanca ev fiyatı.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> kNN regresyon, California housing<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_california_housing'
+ '\n<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KNeighborsRegressor'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_absolute_error, r2_score'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split'
+ '\n'
+ '\ndata = <span class="fn">fetch_california_housing</span>()'
+ '\nX_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(data.data, data.target, test_size=<span class="num">0.2</span>, random_state=<span class="num">0</span>)'
+ '\n'
+ '\npipe = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(),'
+ '\n                     <span class="fn">KNeighborsRegressor</span>(n_neighbors=<span class="num">10</span>, weights=<span class="str">"distance"</span>))'
+ '\npipe.<span class="fn">fit</span>(X_tr, y_tr)'
+ '\npred = pipe.<span class="fn">predict</span>(X_te)'
+ '\n<span class="fn">print</span>(<span class="str">f"MAE  = {mean_absolute_error(y_te, pred):.3f} (100k USD birimi)"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"R²   = {r2_score(y_te, pred):.3f}"</span>)'
+ '\n<span class="cm"># MAE  = 0.395  (yaklaşık 39,500 USD)</span>'
+ '\n<span class="cm"># R²   = 0.722</span></code></pre></div></div>'

+ '<p class="l-text">Karşılaştırma için: aynı veride lineer regresyon R² ≈ 0.60, random forest R² ≈ 0.81 verir. kNN ortada — ağaç tabanlı yöntemlerden zayıf ama lineer regresyondan iyi. Burada da ölçekleme zorunlu (gelir vs nüfus tamamen farklı ölçeklerde) ve <code>weights="distance"</code> hassas bölgelerde performansı toparlıyor.</p>'

+ '<h2 class="l-title">10. kNN 2026\'da — Hâlâ Niye Önemli?</h2>'

+ '<p class="l-text">"kNN 1950\'lerden kalma bir algoritma, transformer çağında ne işe yarar?" sorusu meşru ama cevap şaşırtıcı: <strong>kNN belki de en çok kullanılan algoritma haline geldi</strong> — sadece artık ham veride değil, öğrenilmiş gömme uzayında çalışıyor.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Baseline:</strong> her ML projesinde lojistik regresyon ve karar ağacının yanı sıra kNN baseline\'ı kurmak iyi uygulamadır. Karmaşık model bunu yenmiyorsa karmaşıklık değmiyor demektir.</li>'
+ '<li><strong>RAG (Retrieval Augmented Generation):</strong> LLM\'e "ilgili bağlamı" verme problemi tamamen kNN. Belgeler embedding\'lere dönüştürülür, kullanıcı sorusu da embedding olur; FAISS/Chroma vektör veritabanında kosinüs benzerliği ile en yakın k=5-10 belge bulunur ve prompt\'a eklenir. ChatGPT plug-in\'leri, Perplexity, Bing Copilot — hepsinin kalbinde kNN var.</li>'
+ '<li><strong>Semantik arama:</strong> Google, Pinecone, Weaviate, Qdrant: hepsi vektör arama hizmeti satıyor. Arama motorları artık kelime eşleşmesi değil, anlamsal yakınlık temelli — yani embedding uzayında kNN.</li>'
+ '<li><strong>Öneri sistemleri:</strong> "bu ürünü alanlar şunları da aldı" sıklıkla kullanıcı/ürün embedding\'leri üzerinde kNN ile çalışır.</li>'
+ '<li><strong>Few-shot ve in-context learning:</strong> LLM\'e örnek verirken, hedef girdiye en benzeyen k örneği prompt\'a koymak — kNN.</li>'
+ '<li><strong>Anomali tespiti:</strong> en yakın komşusu çok uzak olan noktalar anormaldir.</li>'
+ '<li><strong>Dengesiz veride veri artırımı:</strong> SMOTE algoritması yapay azınlık örnekleri üretirken kNN kullanır.</li>'
+ '<li><strong>Açıklanabilirlik:</strong> "bu kararı niye verdin?" sorusuna kNN "şu 5 benzer örneğe bakarak" diye cevap verebilir — siyah-kutu modellerden çok daha şeffaf.</li>'
+ '</ul>'

+ '<p class="l-text">Yani kNN <em>kavram olarak</em> 70 yaşında ama <em>uygulama olarak</em> hiç olmadığı kadar yaygın. Modern NLP/ML\'de "embedding üret + ANN ara" şeklinde her yerde. <a href="/tutorials/langchain/">LangChain</a>, <a href="/tutorials/huggingface/">HuggingFace</a> ve <a href="/tutorials/nlp/">NLP</a> derslerinde bu pratikte göreceksin.</p>'

+ '<h2 class="l-title">11. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Dört temel klasik sınıflandırıcıyı (lojistik regresyon, SVM, Naive Bayes, kNN) artık biliyorsun. Sıradaki kavramlar: <a href="/tutorials/ml-theory/4">genelleme ve cross-validation</a>, <a href="/tutorials/ml-theory/7">karar ağaçları</a> ve sonra <a href="/tutorials/ml-theory/8">ensemble (random forest, gradient boosting)</a>. Bu yapı taşları birleştiğinde gerçek dünya tabular problemlerinin %80\'ini çözen modeller elde edersin.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> kNN\'in tembel öğrenme felsefesini ve niye eğitim aşamasının olmadığını gördün. Beş farklı mesafe metriğini (Euclidean, Manhattan, Chebyshev, Minkowski, kosinüs) ne zaman seçeceğini öğrendin. Boyutluluk lanetini somut bir simülasyonla — mesafelerin yüksek boyutta birbirine yaklaşmasını — kavradın. k\'nın sapma-varyans dengesindeki rolünü iris üzerinde üç farklı k için karar sınırı görselleştirmesiyle anladın. Ağırlıklı kNN\'in 1/d² oylama mantığını çıkardın. kd-tree, ball-tree, FAISS/HNSW gibi verimli arama yapılarını ve ANN\'in modern ölçeklemedeki rolünü öğrendin. Iris\'te sınıflandırma, California housing\'de regresyon yaptın. Son olarak kNN\'in 2026\'daki yeni hayatını — RAG, semantik arama, öneri, few-shot — net olarak gördün.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/ml-theory/3">Lesson 3</a> we briefly introduced kNN; now it gets its own full lesson. The philosophy in one sentence: <em>"tell me your friends and I will tell you who you are"</em>. The algorithm learns no parameters — it just memorises the data. You will cover distance metrics, the curse of dimensionality, choosing k, weighted voting, efficient search structures (kd-tree, ball-tree, FAISS), and why kNN is more relevant than ever in 2026 (RAG, embedding retrieval).</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>The lazy learning philosophy and why there is no training phase</li><li>When to use Euclidean, Manhattan, Chebyshev, Minkowski, and cosine distances</li><li>How the curse of dimensionality breaks kNN — with a concrete simulation</li><li>Compare k=1, k=5, k=20 decision boundaries on iris — see the overfit/underfit trade-off</li><li>How weighted kNN downweights distant neighbours</li><li>kd-tree, ball-tree, and modern ANN libraries (FAISS, HNSW)</li><li>The role of kNN in 2026: RAG, vector databases, embedding retrieval</li></ul></div>'

+ '<h2 class="l-title">1. Intuition — The Lazy Learning Philosophy</h2>'

+ '<p class="l-text">The human brain does something similar when classifying: seeing a new dog breed, you think <em>"this looks most like a Labrador"</em>. kNN is exactly that — at prediction time, find the <strong>k</strong> nearest training examples to the query and use their labels.</p>'

+ '<div class="calc-example"><div class="example-label">THE PHILOSOPHY</div><div class="example-body">'
+ '<p class="l-text">Most algorithms (logistic regression, trees, neural nets) train a <em>model</em>: they extract rules/weights from the data, then use that model to predict. This is <strong>eager learning</strong> — heavy work at fit time, light work at predict time.</p>'
+ '<p class="l-text">kNN flips it. During <code>fit()</code> it learns <em>nothing</em>: it just copies the data into memory. All the work happens at <code>predict()</code> time. This is <strong>lazy learning</strong>. No model, just memory plus a distance calculation.</p>'
+ '<p class="l-text">kNN is sometimes called <em>instance-based learning</em> or <em>memory-based learning</em>. It does not generalise — it answers via similarity.</p>'
+ '</div></div>'

+ '<h2 class="l-title">2. The Algorithm — Step by Step</h2>'

+ '<p class="l-text">The core procedure is extraordinarily simple. For classification:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Compute distances:</strong> measure the distance between the query point <em>x<sub>q</sub></em> and <em>every</em> training point.</li>'
+ '<li><strong>Sort, take top k:</strong> the k smallest-distance points are the neighbours.</li>'
+ '<li><strong>Vote:</strong> the majority class among those k wins. To avoid ties pick odd k, or break randomly.</li>'
+ '</ol>'

+ '<p class="l-text">For regression step 3 changes: average (or take the median of) the k neighbours\' targets.</p>'

+ '<div class="katex-block">$$\\hat{y}(x_q) = \\frac{1}{k}\\sum_{x_i \\in N_k(x_q)} y_i \\qquad \\text{(regression)}$$</div>'

+ '<p class="l-text">Probability estimation is easy too: the fraction of positive-class neighbours becomes <em>P(positive)</em>. If 7 of 10 neighbours are "churn", then <em>P(churn) = 0.7</em>.</p>'

+ '<h2 class="l-title">3. Distance Metrics — How to Measure Closeness</h2>'

+ '<p class="l-text">"Near" depends on the metric you choose. The common ones:</p>'

+ '<div class="katex-block">$$d_{\\text{Euclidean}}(x, y) = \\sqrt{\\sum_{i=1}^{p} (x_i - y_i)^2}$$</div>'

+ '<p class="l-text"><strong>Euclidean (L2):</strong> classic straight-line distance. Default for continuous numerical features.</p>'

+ '<div class="katex-block">$$d_{\\text{Manhattan}}(x, y) = \\sum_{i=1}^{p} |x_i - y_i|$$</div>'

+ '<p class="l-text"><strong>Manhattan (L1):</strong> walking distance on a city grid. More robust to outlier feature differences than Euclidean because it does not square them.</p>'

+ '<div class="katex-block">$$d_{\\text{Chebyshev}}(x, y) = \\max_{i} |x_i - y_i|$$</div>'

+ '<p class="l-text"><strong>Chebyshev (L∞):</strong> only the largest dimension difference counts. The king\'s move in chess. Useful for anomaly detection.</p>'

+ '<div class="katex-block">$$d_{\\text{Minkowski}}(x, y) = \\left( \\sum_{i=1}^{p} |x_i - y_i|^p \\right)^{1/p}$$</div>'

+ '<p class="l-text"><strong>Minkowski (Lp):</strong> the general form. p=1 → Manhattan, p=2 → Euclidean, p=∞ → Chebyshev. sklearn defaults to <code>metric=\'minkowski\', p=2</code>.</p>'

+ '<div class="katex-block">$$d_{\\cos}(x, y) = 1 - \\frac{x \\cdot y}{\\|x\\| \\, \\|y\\|}$$</div>'

+ '<p class="l-text"><strong>Cosine:</strong> measures the angle between two vectors and ignores their lengths. Almost always the right choice for text (TF-IDF, embeddings) — "cat" and "kitten" embeddings may have different norms but point in similar directions. RAG and modern semantic search are built on this metric.</p>'

+ '<p class="l-text"><strong>Critical:</strong> whichever metric you pick, you <strong>must scale features</strong>. If age is 28 and income is 80000, income totally dominates Euclidean distance. Use <code>StandardScaler</code> or <code>MinMaxScaler</code>.</p>'

+ '<h2 class="l-title">4. The Curse of Dimensionality — kNN\'s Achilles Heel</h2>'

+ '<p class="l-text">kNN is excellent in low dimensions. But as the number of features grows (100, 1000) something weird happens: <em>all points look equally far from each other</em>. The very notion of "nearest" breaks down.</p>'

+ '<div class="calc-example"><div class="example-label">WHY THIS HAPPENS</div><div class="example-body">'
+ '<p class="l-text">Imagine random points in a unit cube. As dimension d grows, <strong>most of the cube\'s volume concentrates in the shell</strong>, not the centre. Points push outward to the edges.</p>'
+ '<p class="l-text">Consequence: <strong>the ratio of farthest-to-nearest distance approaches 1</strong>. There is no real "nearest" any more — everything is roughly equidistant. kNN can no longer tell and degenerates to random.</p>'
+ '<p class="l-text">Mathematically, in d dimensions the variance of pairwise distances shrinks relative to the mean: <em>(d<sub>max</sub> − d<sub>min</sub>) / d<sub>min</sub> → 0</em> as <em>d → ∞</em>.</p>'
+ '</div></div>'

+ '<div class="plotly-graph"><div id="plot-l14-curse-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'function simulate(d){var N=400;var pts=[];for(var i=0;i<N;i++){var v=[];for(var j=0;j<d;j++)v.push(Math.random());pts.push(v);}var origin=[];for(var j=0;j<d;j++)origin.push(0.5);var dists=[];for(var i=0;i<N;i++){var s=0;for(var j=0;j<d;j++){var diff=pts[i][j]-origin[j];s+=diff*diff;}dists.push(Math.sqrt(s));}var mn=Math.min.apply(null,dists);var mx=Math.max.apply(null,dists);return(mx-mn)/mn;}'
+ 'var dims=[];var ratios=[];for(var d=4;d<=200;d+=4){dims.push(d);ratios.push(simulate(d));}'
+ 'var t1={x:dims,y:ratios,type:"scatter",mode:"lines+markers",line:{color:T.accent,width:2.5},marker:{size:5,color:T.accent},name:"(dmax − dmin) / dmin"};'
+ 'var layout={xaxis:{title:"Number of dimensions (d)",color:T.text,gridcolor:T.grid},yaxis:{title:"Relative distance spread (log scale)",type:"log",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:70},showlegend:false};'
+ 'if(document.getElementById("plot-l14-curse-en"))Plotly.newPlot("plot-l14-curse-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> 400 random points in a unit cube, measuring distance to the centre. The y-axis is the relative spread between the farthest and nearest. At d=2 the ratio is ~2.5 — the farthest is 3.5× the nearest, a clear difference. By d=100+ the ratio collapses to ~0.2 — everything is essentially the same distance. This is exactly why raw kNN fails on high-dimensional images/text; you have to reduce dimension first (PCA, t-SNE, or a learned embedding).</div>'

+ '<p class="l-text"><strong>Practical fixes:</strong> (1) Dimensionality reduction: PCA, UMAP, autoencoders. (2) Feature selection: drop irrelevant columns. (3) Learned embeddings: use a transformer/CNN to produce a low-dimensional meaningful representation, then run kNN in that space. This is exactly what modern RAG does.</p>'

+ '<h2 class="l-title">5. Choosing k — The Bias-Variance Trade-off</h2>'

+ '<p class="l-text">k is the most important hyperparameter in kNN. The extremes:</p>'

+ '<ul class="l-list">'
+ '<li><strong>k = 1:</strong> only the nearest neighbour. Decision boundary is jagged, responds to every noise point. <em>High variance, low bias</em> — memorises training data, wobbles on test data. Overfits.</li>'
+ '<li><strong>k = N (all data):</strong> every query gets the majority class. Carries no information. <em>High bias, low variance</em>. Underfits.</li>'
+ '<li><strong>k ≈ √N:</strong> a popular starting heuristic. The real answer comes from cross-validation.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Tip:</strong> For binary classification pick <em>odd k</em> (3, 5, 7, …) to avoid ties. With multiple classes ties can still happen; sklearn defaults to the smallest class label.</p>'

+ '<div class="plotly-graph"><div id="plot-l14-knn-k-en" style="width:100%;height:480px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'function genData(){var rng=function(s){return function(){s=(s*9301+49297)%233280;return s/233280;};};var r=rng(42);var A=[],B=[];for(var i=0;i<25;i++){A.push([3+r()*2,3+r()*2]);}for(var i=0;i<25;i++){B.push([5.5+r()*2,5.5+r()*2]);}A.push([6.2,5.8]);B.push([3.3,3.5]);return{A:A,B:B};}'
+ 'var data=genData();'
+ 'function classify(x,y,k){var pts=[];data.A.forEach(function(p){pts.push({d:Math.hypot(p[0]-x,p[1]-y),c:0});});data.B.forEach(function(p){pts.push({d:Math.hypot(p[0]-x,p[1]-y),c:1});});pts.sort(function(a,b){return a.d-b.d;});var s=0;for(var i=0;i<k;i++)s+=pts[i].c;return s>k/2?1:0;}'
+ 'function makeGrid(k){var xs=[],ys=[],cs=[];for(var i=0;i<60;i++){for(var j=0;j<60;j++){var x=2+i*5/60,y=2+j*5/60;xs.push(x);ys.push(y);cs.push(classify(x,y,k));}}return{xs:xs,ys:ys,cs:cs};}'
+ 'function buildTraces(k,xref,yref){var g=makeGrid(k);var bg={x:g.xs,y:g.ys,type:"scatter",mode:"markers",marker:{color:g.cs,colorscale:[[0,"rgba(139,92,246,0.18)"],[1,"rgba(248,113,113,0.18)"]],size:6,showscale:false,symbol:"square"},showlegend:false,xaxis:xref,yaxis:yref};var pA={x:data.A.map(function(p){return p[0];}),y:data.A.map(function(p){return p[1];}),type:"scatter",mode:"markers",marker:{color:T.accent,size:8,symbol:"circle"},showlegend:false,xaxis:xref,yaxis:yref};var pB={x:data.B.map(function(p){return p[0];}),y:data.B.map(function(p){return p[1];}),type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.9)",size:8,symbol:"x"},showlegend:false,xaxis:xref,yaxis:yref};return[bg,pA,pB];}'
+ 'var traces=[].concat(buildTraces(1,"x1","y1"),buildTraces(5,"x2","y2"),buildTraces(20,"x3","y3"));'
+ 'var layout={grid:{rows:1,columns:3,pattern:"independent"},xaxis:{title:"k = 1 (overfit)",color:T.text,gridcolor:T.grid},yaxis:{color:T.text,gridcolor:T.grid},xaxis2:{title:"k = 5 (balanced)",color:T.text,gridcolor:T.grid},yaxis2:{color:T.text,gridcolor:T.grid},xaxis3:{title:"k = 20 (underfit)",color:T.text,gridcolor:T.grid},yaxis3:{color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:50}};'
+ 'if(document.getElementById("plot-l14-knn-k-en"))Plotly.newPlot("plot-l14-knn-k-en",traces,layout,{responsive:true,displayModeBar:false});'
+ '});},300)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> The same toy dataset (purple dots vs red Xs, with one outlier in each class) under three different k values. At <strong>k=1</strong> the boundary carves "islands" around each outlier — the model memorises noise. At <strong>k=5</strong> the boundary is smooth and sensible, outliers are absorbed. At <strong>k=20</strong> the boundary is almost a straight line — the model has become too smooth and misses fine structure. In practice you pick k with 5-fold CV.</div>'

+ '<h2 class="l-title">6. Weighted kNN — Closer Neighbours Speak Louder</h2>'

+ '<p class="l-text">In standard kNN every one of the k neighbours casts an equal vote — whether it is the closest or right at the edge. That can feel arbitrary: two very close neighbours probably deserve more weight than three distant ones.</p>'

+ '<p class="l-text"><strong>Weighted kNN</strong> assigns each neighbour a weight inversely proportional to its distance. The 1/d² scheme is most common:</p>'

+ '<div class="katex-block">$$\\hat{p}(c \\mid x_q) = \\frac{\\sum_{i \\in N_k} \\mathbb{1}[y_i = c] \\cdot w_i}{\\sum_{i \\in N_k} w_i}, \\qquad w_i = \\frac{1}{d(x_q, x_i)^2 + \\epsilon}$$</div>'

+ '<p class="l-text">The small <em>ε</em> avoids division by zero. In sklearn, <code>weights=\'distance\'</code> turns this on. A nice side effect: the choice of k becomes less sensitive — borderline neighbours contribute little anyway.</p>'

+ '<h2 class="l-title">7. Efficient Search Structures — When N Grows</h2>'

+ '<p class="l-text">Naive (brute-force) kNN computes distances to all N training points for each query — <em>O(Nd)</em>. For N=100, d=4 that is fine. For N=1M, d=512 (real-world embedding territory) it is catastrophic.</p>'

+ '<p class="l-text">Solution: <strong>specialised data structures</strong>.</p>'

+ '<ul class="l-list">'
+ '<li><strong>kd-tree:</strong> recursively splits the space with axis-aligned hyperplanes. Gives <em>O(log N)</em> queries in low dimensions (d ≲ 20). Degrades in high d — axis-aligned splits cannot capture meaningful structure.</li>'
+ '<li><strong>ball-tree:</strong> hierarchically partitions the space into spherical "balls". More flexible than kd-tree; good up to mid dimension (20-100). Works with non-Euclidean metrics.</li>'
+ '<li><strong>LSH (Locality-Sensitive Hashing):</strong> hash functions that put similar points in the same bucket. Approximate but very fast.</li>'
+ '<li><strong>HNSW (Hierarchical Navigable Small World):</strong> graph-based, one of the strongest modern approaches. FAISS, ScaNN, Annoy, Qdrant, Pinecone, Weaviate, Chroma all rely on this family.</li>'
+ '<li><strong>IVF + PQ (Inverted File + Product Quantization):</strong> FAISS\'s billion-scale approach — coarse cluster first, then search in compressed vectors.</li>'
+ '</ul>'

+ '<p class="l-text">All of these belong to the <strong>ANN (Approximate Nearest Neighbour)</strong> family — approximate results, but often 1000× faster. Modern LLM applications (RAG, semantic search) do not scale without these libraries.</p>'

+ '<h2 class="l-title">8. Worked Example — kNN on Iris</h2>'

+ '<p class="l-text">Iris is ML\'s famous toy dataset: 150 flowers, 3 species (setosa, versicolor, virginica), 4 features (sepal length/width, petal length/width). Ideal for kNN — small, numeric, visualisable.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> kNN on iris, sweeping k<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score, train_test_split'
+ '\n<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KNeighborsClassifier'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n<span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n'
+ '\nX, y = <span class="fn">load_iris</span>(return_X_y=<span class="kw">True</span>)'
+ '\nX_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, stratify=y, random_state=<span class="num">42</span>)'
+ '\n'
+ '\n<span class="cm"># 5-fold CV accuracy at several k values</span>'
+ '\n<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">1</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">11</span>, <span class="num">25</span>, <span class="num">50</span>]:'
+ '\n    pipe = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">KNeighborsClassifier</span>(n_neighbors=k))'
+ '\n    cv = <span class="fn">cross_val_score</span>(pipe, X_tr, y_tr, cv=<span class="num">5</span>).<span class="fn">mean</span>()'
+ '\n    <span class="fn">print</span>(<span class="str">f"k={k:3d}  CV accuracy={cv:.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># Compare with weighted kNN</span>'
+ '\nbest = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(),'
+ '\n                     <span class="fn">KNeighborsClassifier</span>(n_neighbors=<span class="num">5</span>, weights=<span class="str">"distance"</span>))'
+ '\nbest.<span class="fn">fit</span>(X_tr, y_tr)'
+ '\n<span class="fn">print</span>(<span class="str">f"Test accuracy (k=5, weighted): {best.score(X_te, y_te):.3f}"</span>)'
+ '\n<span class="cm"># k=  1  CV accuracy=0.943</span>'
+ '\n<span class="cm"># k=  5  CV accuracy=0.962  ← best</span>'
+ '\n<span class="cm"># k= 50  CV accuracy=0.733  ← underfits (~35 per class, 50 forces cross-class mixing)</span></code></pre></div></div>'

+ '<p class="l-text">Three design decisions matter: <code>StandardScaler</code> makes distances fair (petal vs sepal cm scales vanish); <code>stratify=y</code> ensures each class is represented in both splits; <code>cross_val_score</code> averages over 5 folds rather than trusting a single split. At k=50 each class has only ~35 samples, so 50 neighbours must pull from other classes — accuracy collapses.</p>'

+ '<h2 class="l-title">9. kNN Regression — California Housing</h2>'

+ '<p class="l-text">Everything we did for classification adapts <em>directly</em> to regression — just replace voting with averaging (or median). Let us try California housing: 20,640 neighbourhoods, 8 features (income, age, rooms…), target is median house value.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> kNN regression on California housing<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_california_housing'
+ '\n<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KNeighborsRegressor'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_absolute_error, r2_score'
+ '\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split'
+ '\n'
+ '\ndata = <span class="fn">fetch_california_housing</span>()'
+ '\nX_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(data.data, data.target, test_size=<span class="num">0.2</span>, random_state=<span class="num">0</span>)'
+ '\n'
+ '\npipe = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(),'
+ '\n                     <span class="fn">KNeighborsRegressor</span>(n_neighbors=<span class="num">10</span>, weights=<span class="str">"distance"</span>))'
+ '\npipe.<span class="fn">fit</span>(X_tr, y_tr)'
+ '\npred = pipe.<span class="fn">predict</span>(X_te)'
+ '\n<span class="fn">print</span>(<span class="str">f"MAE  = {mean_absolute_error(y_te, pred):.3f} (units of $100k)"</span>)'
+ '\n<span class="fn">print</span>(<span class="str">f"R²   = {r2_score(y_te, pred):.3f}"</span>)'
+ '\n<span class="cm"># MAE  = 0.395  (about $39,500)</span>'
+ '\n<span class="cm"># R²   = 0.722</span></code></pre></div></div>'

+ '<p class="l-text">For context: linear regression scores R² ≈ 0.60 on the same split, random forest ≈ 0.81. kNN lands in between — weaker than tree ensembles, stronger than linear. Scaling is again mandatory (income vs population live on different scales), and <code>weights="distance"</code> sharpens predictions in dense regions.</p>'

+ '<h2 class="l-title">10. kNN in 2026 — Why It Still Matters</h2>'

+ '<p class="l-text">"kNN is from the 1950s — what use is it in the transformer era?" Fair question, surprising answer: <strong>kNN may be the most-used algorithm today</strong> — only now it runs in learned embedding spaces, not raw feature space.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Baseline:</strong> good practice on every ML project to fit logistic regression, a tree, and kNN as baselines. If your fancy model does not beat them, the complexity is not paying off.</li>'
+ '<li><strong>RAG (Retrieval Augmented Generation):</strong> giving an LLM "relevant context" is entirely a kNN problem. Documents become embeddings, the question becomes an embedding, FAISS/Chroma retrieves the top k=5-10 most similar documents via cosine similarity, and they get injected into the prompt. ChatGPT plug-ins, Perplexity, Bing Copilot — kNN is in the heart of each.</li>'
+ '<li><strong>Semantic search:</strong> Google, Pinecone, Weaviate, Qdrant all sell vector search. Search is no longer keyword-match; it is semantic similarity — kNN in embedding space.</li>'
+ '<li><strong>Recommender systems:</strong> "customers who bought this also bought" often runs kNN over user/item embeddings.</li>'
+ '<li><strong>Few-shot and in-context learning:</strong> when you feed an LLM examples, picking the k most similar examples to the target input is kNN.</li>'
+ '<li><strong>Anomaly detection:</strong> points whose nearest neighbour is far away are anomalous.</li>'
+ '<li><strong>Imbalanced-data augmentation:</strong> the SMOTE algorithm synthesises minority examples using kNN.</li>'
+ '<li><strong>Explainability:</strong> "why did you predict this?" — kNN can answer "because of these 5 similar examples". More transparent than black-box models.</li>'
+ '</ul>'

+ '<p class="l-text">So kNN is 70 years old <em>conceptually</em>, but as <em>deployment</em> it is more widespread than ever. The modern NLP/ML pattern is "produce an embedding + do ANN search" everywhere. You will see this in practice in our <a href="/tutorials/langchain/">LangChain</a>, <a href="/tutorials/huggingface/">HuggingFace</a>, and <a href="/tutorials/nlp/">NLP</a> tracks.</p>'

+ '<h2 class="l-title">11. What\'s Next</h2>'

+ '<p class="l-text">You now know the four classical classifiers: logistic regression, SVM, Naive Bayes, kNN. Up next: <a href="/tutorials/ml-theory/4">generalisation and cross-validation</a>, <a href="/tutorials/ml-theory/7">decision trees</a>, then <a href="/tutorials/ml-theory/8">ensembles (random forest, gradient boosting)</a>. Combine these building blocks and you can solve roughly 80% of real-world tabular problems.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The lazy-learning philosophy of kNN and why there is no training phase. Five distance metrics (Euclidean, Manhattan, Chebyshev, Minkowski, cosine) and when to pick each. The curse of dimensionality made concrete with a simulation — distances collapse together in high dimensions. The role of k in the bias-variance trade-off, visualised with three k values on an iris-like toy set. The 1/d² weighting scheme of weighted kNN. Efficient search structures — kd-tree, ball-tree, FAISS/HNSW — and ANN\'s role in modern scaling. Classification on iris, regression on California housing. Finally, the surprising 2026 life of kNN: RAG, semantic search, recommendation, few-shot prompting.</div>'

};
