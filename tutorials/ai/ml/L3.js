/* ml-L3.js — ML Theory Lesson 3: Lojistik Regresyon & Sınıflandırma Temelleri (TR + EN) */
var ML_L3 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/ai/ml/linear-regression">Ders 2</a>\'de sayısal hedef tahmin ettik. Şimdi kategorik hedefe — <em>"bu müşteri kayıp mı?"</em> evet/hayır sorusuna — geçiyoruz. Lojistik regresyonun lineer regresyonun nasıl bir uzantısı olduğunu, sigmoid\'in neyi çözdüğünü, cross-entropy kayıp fonksiyonunu ve karar sınırı kavramını göreceksin. Üstüne kısaca <strong>kNN</strong> ve <strong>Naive Bayes</strong> alternatif algoritmaları tanıtılacak.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Sigmoid fonksiyonunun lineer çıktıyı 0-1 olasılığına nasıl sıkıştırdığını çıkaracaksın</li><li>Lojistik regresyonun cross-entropy kaybını maximum likelihood\'dan türeteceksin</li><li>İki öznitelikte karar sınırının lineer denklem olduğunu çizeceksin</li><li>Polinom genişletme veya kernel ile lineer-olmayan sınırlar elde edeceksin</li><li>Churn verisinde lojistik regresyon, kNN ve Naive Bayes\'i sklearn ile karşılaştıracaksın</li></ul></div>'

+ '<h2 class="l-title">1. Sınıflandırma Nedir?</h2>'

+ '<p class="l-text"><strong>Sınıflandırma</strong>, hedef değişkenin <em>kategorik</em> olduğu denetimli öğrenme görevidir. Olası çıktılar bir küçük etiket kümesinden gelir: {evet, hayır}, {spam, spam değil}, {olumlu, nötr, olumsuz}.</p>'

+ '<ul class="l-list">'
+ '<li><strong>İkili (binary):</strong> 2 sınıf. Müşteri kayıp mı? Evet/Hayır.</li>'
+ '<li><strong>Çok sınıflı (multiclass):</strong> 3+ sınıf, biri seçilir. Müşteri segmenti: A/B/C/D.</li>'
+ '<li><strong>Çok etiketli (multilabel):</strong> Aynı örneğe birden çok etiket. Bir e-postanın "iş, acil, faturalar" tag\'leri olabilir.</li>'
+ '</ul>'

+ '<p class="l-text">Bu derste ikiliye odaklanıyoruz — müşteri kayıp problemi tipik bir ikili sınıflandırma.</p>'

+ '<h2 class="l-title">2. Lineer Regresyonu Sınıflandırmaya Uyarlamak — Niye Yetmez?</h2>'

+ '<p class="l-text">"Yaş" gibi bir özellikten "kayıp olasılığı"nı tahmin etmek istiyoruz. İlk akla gelen: lineer regresyon kullan, çıktıyı 0.5\'ten kes. Sorun ne?</p>'

+ '<div class="calc-example"><div class="example-label">PROBLEM SEZGISI</div><div class="example-body">'
+ '<p class="l-text">Lineer regresyon <em>ŷ = wx + b</em>: yaş 30 için ŷ = 0.2 (kayıp olası değil), yaş 60 için ŷ = 0.85 (kayıp olası). Tamam.</p>'
+ '<p class="l-text">Ama yaş 90 için ŷ = 1.4 — <strong>1\'i geçti!</strong> Yaş 5 için ŷ = -0.3 — <strong>negatif olasılık!</strong> Bu olasılık olarak anlamlı değil. Üstelik aykırı (uç) değerler regresyon doğrusunu bozar, sınıflandırma sınırını yanlış yere çeker.</p>'
+ '</div></div>'

+ '<p class="l-text">Çözüm: lineer çıktıyı bir <strong>sıkıştırma fonksiyonu</strong>ndan geçir, sonuç hep 0-1 arasında olsun. Bu fonksiyona <strong>sigmoid</strong> denir.</p>'

+ '<h2 class="l-title">3. Sigmoid — Sıkıştırma Fonksiyonu</h2>'

+ '<p class="l-text"><strong>Sigmoid (lojistik fonksiyon)</strong>:</p>'

+ '<div class="katex-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>'

+ '<p class="l-text">Özellikleri:</p>'

+ '<ul class="l-list">'
+ '<li><em>z → +∞</em>: σ(z) → 1</li>'
+ '<li><em>z → -∞</em>: σ(z) → 0</li>'
+ '<li><em>z = 0</em>: σ(z) = 0.5 (kararsız nokta)</li>'
+ '<li>Çıktı her zaman (0, 1) aralığında — olasılık olarak yorumlanabilir</li>'
+ '<li>S harfi gibi düzgün bir eğri — türevlenebilir, gradyan iniş için ideal</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-sigmoid-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var z=[];var s=[];'
+ 'for(var i=-60;i<=60;i++){z.push(i/10);s.push(1/(1+Math.exp(-i/10)));}'
+ 'var t1={x:z,y:s,type:"scatter",mode:"lines",line:{color:T.accent,width:3},name:"σ(z)"};'
+ 'var t2={x:[-6,6],y:[0.5,0.5],type:"scatter",mode:"lines",line:{color:"rgba(128,128,128,.4)",width:1,dash:"dash"},name:"karar eşiği = 0.5"};'
+ 'var layout={title:{text:"Sigmoid fonksiyonu",font:{color:T.text,size:13}},xaxis:{title:"z",color:T.text,gridcolor:T.grid,zerolinecolor:T.grid},yaxis:{title:"σ(z)",color:T.text,gridcolor:T.grid,range:[-0.05,1.05]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-sigmoid-tr"))Plotly.newPlot("plot-sigmoid-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Sigmoid herhangi bir reel sayıyı 0-1 arasına sıkıştırır. Negatif girdiler 0\'a yakın, pozitif girdiler 1\'e yakın çıkar. z=0 noktasında çıktı 0.5\'tir — modelin "ikiye bölündüğü" yer. Karar eşiği genelde 0.5: σ(z) > 0.5 ise olumlu (kayıp), değilse olumsuz tahmin.</div>'

+ '<h2 class="l-title">4. Lojistik Regresyon Modeli</h2>'

+ '<p class="l-text">Şimdi lineer kombinasyonu sigmoid\'e bağlayalım:</p>'

+ '<div class="katex-block">$$z = \\mathbf{w}^\\top \\mathbf{x} + b, \\qquad P(y=1 \\mid \\mathbf{x}) = \\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>'

+ '<p class="l-text">Yani: girdi vektöründen lineer skor hesapla → sigmoid\'den geçir → olasılık çıkar. Müşteri verisinde:</p>'

+ '<div class="calc-example"><div class="example-label">SOMUT HESAP</div><div class="example-body">'
+ '<p class="l-text">Diyelim ki eğitilen ağırlıklar: <em>w<sub>yaş</sub> = 0.05, w<sub>ücret</sub> = 0.02, w<sub>süre</sub> = -0.15, b = -2</em></p>'
+ '<p class="l-text">M2 (yaş 62, ücret 220, süre 3) için:</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7;padding:.5rem 1rem">'
+ 'z = 0.05·62 + 0.02·220 + (-0.15)·3 + (-2)'
+ '<br>z = 3.1 + 4.4 - 0.45 - 2 = 5.05'
+ '<br>σ(5.05) ≈ 0.994'
+ '</p>'
+ '<p class="l-text">Yani M2\'nin kayıp olma olasılığı %99.4. Gerçek etiket de "Evet" — model doğru tahmin etti.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. Cross-Entropy — Sınıflandırmanın Kayıp Fonksiyonu</h2>'

+ '<p class="l-text">Lineer regresyonda MSE kullanmıştık. Lojistik regresyonda MSE iyi çalışmaz (kayıp yüzeyi konveks değil). Doğru kayıp <strong>cross-entropy</strong>:</p>'

+ '<div class="katex-block">$$\\mathcal{L}(\\mathbf{w}) = -\\frac{1}{n}\\sum_{i=1}^{n} \\bigl[\\, y_i \\log \\hat{p}_i + (1-y_i) \\log(1-\\hat{p}_i) \\,\\bigr]$$</div>'

+ '<p class="l-text">Burada <em>ŷ<sub>i</sub> = σ(w<sup>⊤</sup>x<sub>i</sub> + b)</em> tahmin olasılığı, <em>y<sub>i</sub></em> ∈ {0, 1} gerçek etiket. Sezgi:</p>'

+ '<ul class="l-list">'
+ '<li><strong>y = 1 ise:</strong> sadece <em>log p</em> sayılır. Model emin ve doğru (p ≈ 1) → log ≈ 0, kayıp düşük. Emin ama yanlış (p ≈ 0) → log -∞, kayıp ağır cezalı.</li>'
+ '<li><strong>y = 0 ise:</strong> sadece <em>log(1-p)</em> sayılır. Aynı mantık tersine.</li>'
+ '</ul>'

+ '<p class="l-text">Yani cross-entropy modelin <em>emin ve yanlış</em> olduğu durumları çok ağır cezalandırır. Bu, dürüst tahmin yapmaya iter — model emin olmadığında 0.5 civarı çıkış verir.</p>'

+ '<h2 class="l-title">6. Karar Sınırı — Geometrik Görüntü</h2>'

+ '<p class="l-text">Lojistik regresyon iki sınıfı bir <strong>karar sınırıyla</strong> ayırır. İki özellikli (yaş, ücret) bir örnekte sınır bir <em>doğru</em>dur: <em>w<sub>1</sub>x<sub>1</sub> + w<sub>2</sub>x<sub>2</sub> + b = 0</em>.</p>'

+ '<p class="l-text">Doğrunun bir tarafında olasılık > 0.5 (model "evet" der), diğer tarafında < 0.5 (model "hayır" der). Üç özellikte sınır bir düzlem, çok özellikte hiperdüzlem.</p>'

+ '<div class="plotly-graph"><div id="plot-decision-tr" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var x_no=[28,35,31];var y_no=[120,85,95];'
+ 'var x_yes=[62,48,55];var y_yes=[220,180,240];'
+ 'var bx=[20,70];var by=[270,55];'
+ 'var t1={x:x_no,y:y_no,name:"Kalan (y=0)",type:"scatter",mode:"markers",marker:{color:T.accent,size:14,symbol:"circle"}};'
+ 'var t2={x:x_yes,y:y_yes,name:"Kayıp (y=1)",type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.85)",size:14,symbol:"x"}};'
+ 'var t3={x:bx,y:by,name:"Karar sınırı",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.7)",width:2,dash:"dash"}};'
+ 'var layout={title:{text:"Lojistik regresyon karar sınırı",font:{color:T.text,size:13}},xaxis:{title:"Yaş",color:T.text,gridcolor:T.grid},yaxis:{title:"Aylık ücret",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-decision-tr"))Plotly.newPlot("plot-decision-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> 6 müşterinin yaş-ücret düzlemindeki konumu. Mor noktalar (daire) "kalanlar", kırmızı noktalar (X) "kayıplar". Kesikli çizgi lojistik regresyonun öğrendiği karar sınırı. Sınırın sağındaki/üstündeki tarafta σ(z) > 0.5, model "kayıp" der; soldaki/altındaki tarafta "kalan". Veri lineer ayrılabilir olduğu için tek bir doğru iyi iş çıkarıyor.</div>'

+ '<h2 class="l-title">7. Lineer Olmayan Sınırlar — Polinom & Çekirdek</h2>'

+ '<p class="l-text">Bazı problemlerde sınıflar lineer olarak ayrılabilir değildir. Örneğin "yaş çok genç YA DA çok yaşlı olanlar kayıp olur" durumunda doğrusal sınır yetmez.</p>'

+ '<p class="l-text">Çözümler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Polinom genişletme:</strong> x², xy, y² gibi yeni özellikler türet → karar sınırı eğri olur.</li>'
+ '<li><strong>SVM (Support Vector Machine) + çekirdek:</strong> Yüksek boyutlu uzayda lineer sınır çekmek için çekirdek hilesi (RBF, polinom).</li>'
+ '<li><strong>Karar ağaçları (<a href="/tutorials/ai/ml/trees-ensembles-xgboost">Ders 7</a>):</strong> Doğal olarak lineer olmayan, eksen-paralel sınırlar.</li>'
+ '<li><strong>Sinir ağları:</strong> Çoklu nöron katmanlarıyla istenen karmaşık sınırlar.</li>'
+ '</ul>'

+ '<h2 class="l-title">8. Alternatif: kNN — En Yakın K Komşu</h2>'

+ '<p class="l-text"><strong>k-Nearest Neighbors (kNN)</strong> tamamen farklı bir felsefe: hiç model eğitmez. Tahmin zamanı geldiğinde:</p>'

+ '<ol class="l-list">'
+ '<li>Yeni nokta için, eğitim setindeki en yakın <em>k</em> komşuyu bul (Öklid mesafesi).</li>'
+ '<li>Bu k komşunun çoğunluk sınıfını ata.</li>'
+ '</ol>'

+ '<p class="l-text">Müşteri kayıp problemi için: yeni bir müşteri geldiğinde, ona en benzeyen 5 müşteriyi bul; çoğu kayıp olduysa "evet", çoğu kaldıysa "hayır" de.</p>'

+ '<p class="l-text"><strong>Avantajlar:</strong> sezgisel, eğitim süresi yok, lineer olmayan sınırlara doğal uyum. <strong>Dezavantajlar:</strong> her tahmin için tüm eğitim setine bakar — büyük veride yavaş; yüksek boyutta "boyutluluk laneti" (curse of dimensionality) saldırır; özelliklerin ölçekleri farklıysa mesafe yanıltıcı olur (scaling şart).</p>'

+ '<h2 class="l-title">9. Alternatif: Naive Bayes</h2>'

+ '<p class="l-text"><strong>Naive Bayes</strong> Bayes teoremi üzerine kuruludur. Detaylı olarak <a href="/tutorials/ai/nlp/text-classification">NLP Ders 3</a>\'te işlenir; burada kısa hatırlatma:</p>'

+ '<div class="katex-block">$$P(y \\mid \\mathbf{x}) \\propto P(y) \\cdot \\prod_{i=1}^{p} P(x_i \\mid y)$$</div>'

+ '<p class="l-text">"Naive" sıfatı şu varsayımdan: <em>özellikler sınıf verildiğinde birbirinden bağımsız</em>. Gerçeklikte bu yanlıştır (yaş ve gelir ilişkili) ama pratikte iyi çalışır. Özellikle metin sınıflandırma (NLP) ve spam filtreleme klasiği.</p>'

+ '<p class="l-text">Tablo verisinde Naive Bayes genelde lojistik regresyondan zayıftır; ama hesaplama olarak çok hızlı, baseline olarak iyi.</p>'

+ '<h2 class="l-title">10. Python — Üç Algoritmayı Karşılaştır</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Lojistik regresyon, kNN, Naive Bayes karşılaştırma<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KNeighborsClassifier'
+ '\n<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> GaussianNB'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n'
+ '\n<span class="cm"># 6 müşteri: [yaş, aylık_ücret, süre]</span>'
+ '\nX = np.<span class="fn">array</span>([[<span class="num">28</span>,<span class="num">120</span>,<span class="num">14</span>],[<span class="num">62</span>,<span class="num">220</span>,<span class="num">3</span>],[<span class="num">35</span>,<span class="num">85</span>,<span class="num">36</span>],'
+ '\n              [<span class="num">48</span>,<span class="num">180</span>,<span class="num">2</span>],[<span class="num">31</span>,<span class="num">95</span>,<span class="num">22</span>],[<span class="num">55</span>,<span class="num">240</span>,<span class="num">5</span>]])'
+ '\ny = np.<span class="fn">array</span>([<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>])  <span class="cm"># 0=kalan, 1=kayıp</span>'
+ '\n'
+ '\n<span class="cm"># kNN için scaling şart (mesafe ölçekten etkilenir)</span>'
+ '\nmodels = {'
+ '\n    <span class="str">"LogReg"</span>: <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">LogisticRegression</span>()),'
+ '\n    <span class="str">"kNN"</span>:    <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">KNeighborsClassifier</span>(n_neighbors=<span class="num">3</span>)),'
+ '\n    <span class="str">"NaiveBayes"</span>: <span class="fn">GaussianNB</span>(),'
+ '\n}'
+ '\n'
+ '\n<span class="cm"># Yeni müşteri: 50 yaş, 200 TL, 4 ay süre — büyük olasılıkla kayıp</span>'
+ '\nyeni = [[<span class="num">50</span>,<span class="num">200</span>,<span class="num">4</span>]]'
+ '\n<span class="kw">for</span> name, model <span class="kw">in</span> models.<span class="fn">items</span>():'
+ '\n    model.<span class="fn">fit</span>(X, y)'
+ '\n    pred = model.<span class="fn">predict</span>(yeni)[<span class="num">0</span>]'
+ '\n    proba = model.<span class="fn">predict_proba</span>(yeni)[<span class="num">0</span>][<span class="num">1</span>]'
+ '\n    <span class="fn">print</span>(<span class="str">f"{name:12} tahmin={pred} P(kayıp)={proba:.2%}"</span>)'
+ '\n<span class="cm"># LogReg       tahmin=1  P(kayıp)=94%</span>'
+ '\n<span class="cm"># kNN          tahmin=1  P(kayıp)=100%</span>'
+ '\n<span class="cm"># NaiveBayes   tahmin=1  P(kayıp)=89%</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Üç farklı sınıflandırıcı aynı veride. <code>StandardScaler</code> her özelliği ortalama 0, varyans 1 yapar — kNN için kritik (yaş 28 ile ücret 220 farklı ölçeklerde, normalize etmezsen ücret kNN\'de baskın olur). Lojistik regresyon scaling olmadan da çalışır ama yapmak iyi alışkanlık. Üç algoritma da yeni müşteriyi "kayıp" olarak tahmin etti, olasılıklar farklı. Pratikte hangisinin iyi olduğunu cross-validation ile test ederiz (<a href="/tutorials/ai/ml/generalization-bias-variance">Ders 4</a>).</p>'

+ '<h2 class="l-title">11. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Sınıflandırmanın temellerini öğrendik. Ama şu an "iyi tahmin yapıyoruz" diye nereden biliyoruz? 6 müşteride doğru tahmin yapmak yeterli mi, yoksa model ezberlemiş olabilir mi? <a href="/tutorials/ai/ml/generalization-bias-variance">Ders 4</a>\'te <strong>genelleme</strong> meselesini ele alacağız: bias-variance trade-off, train/val/test ayrımı, cross-validation. ML\'in en kritik kavramlarından biri.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Sınıflandırma (kategorik hedef tahmini) ile regresyonun farkını öğrendin. Lineer regresyonun sınıflandırmaya niye yetmediğini somut olarak gördün. Sigmoid fonksiyonunun rolünü, lojistik regresyonun nasıl lineer kombinasyon + sigmoid olduğunu kavradın. Cross-entropy kayıp fonksiyonunu ve niye MSE yerine kullanıldığını öğrendin. Karar sınırının geometrik anlamını, polinom & çekirdek ile lineer olmayan sınırları gördün. İki alternatif algoritmayı (kNN ve Naive Bayes) tanıdın, ne zaman tercih edileceğini anladın. sklearn ile üç algoritmayı pipeline\'larla karşılaştırdın.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/ai/ml/linear-regression">Lesson 2</a> we predicted a numeric target. Now we move to a categorical target — <em>"will this customer churn?"</em>, yes/no. You will see how logistic regression extends linear regression, what sigmoid solves, the cross-entropy loss, and the geometric idea of a decision boundary. We will also briefly cover <strong>kNN</strong> and <strong>Naive Bayes</strong> as alternative classifiers.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Derive how sigmoid squashes a linear score into a 0-1 probability</li><li>Derive cross-entropy loss for logistic regression from maximum likelihood</li><li>Plot the decision boundary as a linear equation in two features</li><li>Build non-linear boundaries with polynomial expansion or kernels</li><li>Compare logistic regression, kNN, and Naive Bayes on the churn dataset</li></ul></div>'

+ '<h2 class="l-title">1. What is Classification?</h2>'

+ '<p class="l-text"><strong>Classification</strong> is supervised learning where the target is <em>categorical</em>. Outputs come from a small label set: {yes, no}, {spam, not spam}, {positive, neutral, negative}.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Binary:</strong> 2 classes. Will the customer churn? Yes/No.</li>'
+ '<li><strong>Multiclass:</strong> 3+ classes, pick one. Customer segment: A/B/C/D.</li>'
+ '<li><strong>Multilabel:</strong> multiple labels per example. An email can be tagged "work, urgent, billing".</li>'
+ '</ul>'

+ '<p class="l-text">This lesson focuses on binary — churn is a typical binary classification.</p>'

+ '<h2 class="l-title">2. Adapting Linear Regression to Classification — Why It Fails</h2>'

+ '<p class="l-text">We want to predict "churn probability" from features like "age". The first idea: use linear regression and threshold at 0.5. The problem?</p>'

+ '<div class="calc-example"><div class="example-label">PROBLEM INTUITION</div><div class="example-body">'
+ '<p class="l-text">Linear regression <em>ŷ = wx + b</em>: for age 30 ŷ = 0.2 (unlikely to churn), age 60 ŷ = 0.85 (likely). Fine.</p>'
+ '<p class="l-text">But for age 90 ŷ = 1.4 — <strong>over 1!</strong> For age 5 ŷ = -0.3 — <strong>negative probability!</strong> Meaningless. Plus extreme values warp the regression line and shift the boundary in the wrong direction.</p>'
+ '</div></div>'

+ '<p class="l-text">The fix: pass the linear output through a <strong>squashing function</strong> so the result is always in 0-1. This function is the <strong>sigmoid</strong>.</p>'

+ '<h2 class="l-title">3. Sigmoid — The Squashing Function</h2>'

+ '<p class="l-text"><strong>Sigmoid (logistic function)</strong>:</p>'

+ '<div class="katex-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>'

+ '<p class="l-text">Properties:</p>'

+ '<ul class="l-list">'
+ '<li><em>z → +∞</em>: σ(z) → 1</li>'
+ '<li><em>z → -∞</em>: σ(z) → 0</li>'
+ '<li><em>z = 0</em>: σ(z) = 0.5 (the indecision point)</li>'
+ '<li>Output always in (0, 1) — interpretable as probability</li>'
+ '<li>Smooth S-shape — differentiable, ideal for gradient descent</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-sigmoid-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var z=[];var s=[];'
+ 'for(var i=-60;i<=60;i++){z.push(i/10);s.push(1/(1+Math.exp(-i/10)));}'
+ 'var t1={x:z,y:s,type:"scatter",mode:"lines",line:{color:T.accent,width:3},name:"σ(z)"};'
+ 'var t2={x:[-6,6],y:[0.5,0.5],type:"scatter",mode:"lines",line:{color:"rgba(128,128,128,.4)",width:1,dash:"dash"},name:"threshold = 0.5"};'
+ 'var layout={title:{text:"The sigmoid function",font:{color:T.text,size:13}},xaxis:{title:"z",color:T.text,gridcolor:T.grid,zerolinecolor:T.grid},yaxis:{title:"σ(z)",color:T.text,gridcolor:T.grid,range:[-0.05,1.05]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-sigmoid-en"))Plotly.newPlot("plot-sigmoid-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> The sigmoid squashes any real number into 0-1. Negative inputs go near 0, positive near 1. At z=0 the output is 0.5 — the model\'s indecision point. The default decision threshold is 0.5: σ(z) > 0.5 → predict positive (churn), else negative.</div>'

+ '<h2 class="l-title">4. Logistic Regression Model</h2>'

+ '<p class="l-text">Now combine linear with sigmoid:</p>'

+ '<div class="katex-block">$$z = \\mathbf{w}^\\top \\mathbf{x} + b, \\qquad P(y=1 \\mid \\mathbf{x}) = \\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>'

+ '<p class="l-text">So: linear score from inputs → through sigmoid → out comes a probability. On the customer data:</p>'

+ '<div class="calc-example"><div class="example-label">CONCRETE COMPUTATION</div><div class="example-body">'
+ '<p class="l-text">Suppose the trained weights: <em>w<sub>age</sub> = 0.05, w<sub>fee</sub> = 0.08, w<sub>tenure</sub> = -0.15, b = -2</em></p>'
+ '<p class="l-text">For C2 (age 62, fee $55, tenure 3):</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7;padding:.5rem 1rem">'
+ 'z = 0.05·62 + 0.08·55 + (-0.15)·3 + (-2)'
+ '<br>z = 3.1 + 4.4 - 0.45 - 2 = 5.05'
+ '<br>σ(5.05) ≈ 0.994'
+ '</p>'
+ '<p class="l-text">So C2\'s churn probability is 99.4%. The true label is "Yes" — the model predicted correctly.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. Cross-Entropy — The Classification Loss</h2>'

+ '<p class="l-text">For linear regression we used MSE. For logistic regression MSE does not work well (the loss surface is not convex). The right loss is <strong>cross-entropy</strong>:</p>'

+ '<div class="katex-block">$$\\mathcal{L}(\\mathbf{w}) = -\\frac{1}{n}\\sum_{i=1}^{n} \\bigl[\\, y_i \\log \\hat{p}_i + (1-y_i) \\log(1-\\hat{p}_i) \\,\\bigr]$$</div>'

+ '<p class="l-text">Where <em>ŷ<sub>i</sub> = σ(w<sup>⊤</sup>x<sub>i</sub> + b)</em> is the predicted probability and <em>y<sub>i</sub></em> ∈ {0, 1} the true label. Intuition:</p>'

+ '<ul class="l-list">'
+ '<li><strong>If y = 1:</strong> only <em>log p</em> counts. Confident and correct (p ≈ 1) → log ≈ 0, low loss. Confident but wrong (p ≈ 0) → log -∞, very high loss.</li>'
+ '<li><strong>If y = 0:</strong> only <em>log(1-p)</em> counts. Mirror image.</li>'
+ '</ul>'

+ '<p class="l-text">So cross-entropy heavily penalises being <em>confidently wrong</em>. It pushes the model to output ~0.5 when uncertain rather than committing.</p>'

+ '<h2 class="l-title">6. The Decision Boundary — Geometric View</h2>'

+ '<p class="l-text">Logistic regression separates classes with a <strong>decision boundary</strong>. With two features (age, fee) the boundary is a <em>line</em>: <em>w<sub>1</sub>x<sub>1</sub> + w<sub>2</sub>x<sub>2</sub> + b = 0</em>.</p>'

+ '<p class="l-text">On one side the probability is > 0.5 (model predicts "yes"); on the other < 0.5 ("no"). With three features the boundary is a plane; with many features, a hyperplane.</p>'

+ '<div class="plotly-graph"><div id="plot-decision-en" style="width:100%;height:420px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var x_no=[28,35,31];var y_no=[30,22,24];'
+ 'var x_yes=[62,48,55];var y_yes=[55,45,60];'
+ 'var bx=[20,70];var by=[68,15];'
+ 'var t1={x:x_no,y:y_no,name:"Stayed (y=0)",type:"scatter",mode:"markers",marker:{color:T.accent,size:14,symbol:"circle"}};'
+ 'var t2={x:x_yes,y:y_yes,name:"Churned (y=1)",type:"scatter",mode:"markers",marker:{color:"rgba(248,113,113,.85)",size:14,symbol:"x"}};'
+ 'var t3={x:bx,y:by,name:"Decision boundary",type:"scatter",mode:"lines",line:{color:"rgba(167,139,250,.7)",width:2,dash:"dash"}};'
+ 'var layout={title:{text:"Logistic regression decision boundary",font:{color:T.text,size:13}},xaxis:{title:"Age",color:T.text,gridcolor:T.grid},yaxis:{title:"Monthly fee ($)",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.12}};'
+ 'if(document.getElementById("plot-decision-en"))Plotly.newPlot("plot-decision-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Our 6 customers in the (age, fee) plane. Purple dots are "stayed", red Xs "churned". The dashed line is the boundary logistic regression learned. On one side σ(z) > 0.5 — predict churn; on the other, predict stay. The data is linearly separable here so a single line works well.</div>'

+ '<h2 class="l-title">7. Non-Linear Boundaries — Polynomials & Kernels</h2>'

+ '<p class="l-text">Sometimes classes are not linearly separable — for example, "very young OR very old" customers churn. A straight line will not do.</p>'

+ '<p class="l-text">Solutions:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Polynomial expansion:</strong> add new features like x², xy, y² → boundary becomes curved.</li>'
+ '<li><strong>SVM with kernels:</strong> draw a linear boundary in a higher-dimensional space via the kernel trick (RBF, polynomial).</li>'
+ '<li><strong>Decision trees (<a href="/tutorials/ai/ml/trees-ensembles-xgboost">Lesson 7</a>):</strong> naturally non-linear, axis-aligned boundaries.</li>'
+ '<li><strong>Neural networks:</strong> arbitrarily complex boundaries via stacked layers.</li>'
+ '</ul>'

+ '<h2 class="l-title">8. Alternative: kNN — k Nearest Neighbours</h2>'

+ '<p class="l-text"><strong>k-Nearest Neighbours (kNN)</strong> follows a different philosophy: it does not train a model. At prediction time:</p>'

+ '<ol class="l-list">'
+ '<li>For a new point, find the <em>k</em> nearest examples in the training set (Euclidean distance).</li>'
+ '<li>Take the majority class among those k.</li>'
+ '</ol>'

+ '<p class="l-text">For churn: when a new customer arrives, find the 5 most similar customers; if most churned predict "yes", else "no".</p>'

+ '<p class="l-text"><strong>Pros:</strong> intuitive, zero training time, naturally non-linear. <strong>Cons:</strong> every prediction scans the whole training set — slow on big data; suffers from the "curse of dimensionality"; if features are on different scales the distance is misleading (always scale!).</p>'

+ '<h2 class="l-title">9. Alternative: Naive Bayes</h2>'

+ '<p class="l-text"><strong>Naive Bayes</strong> is built on Bayes\' theorem. Detailed in <a href="/tutorials/ai/nlp/text-classification">NLP Lesson 3</a>; quick reminder:</p>'

+ '<div class="katex-block">$$P(y \\mid \\mathbf{x}) \\propto P(y) \\cdot \\prod_{i=1}^{p} P(x_i \\mid y)$$</div>'

+ '<p class="l-text">"Naive" because it assumes <em>features are independent given the class</em>. False in practice (age and income are correlated) but works well empirically. Especially classic in text classification (NLP) and spam filtering.</p>'

+ '<p class="l-text">On tabular data Naive Bayes typically loses to logistic regression; but it is very fast and a good baseline.</p>'

+ '<h2 class="l-title">10. Python — Comparing Three Algorithms</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Logistic regression, kNN, Naive Bayes side-by-side<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression'
+ '\n<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KNeighborsClassifier'
+ '\n<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> GaussianNB'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n'
+ '\n<span class="cm"># 6 customers: [age, monthly_fee, tenure]</span>'
+ '\nX = np.<span class="fn">array</span>([[<span class="num">28</span>,<span class="num">30</span>,<span class="num">14</span>],[<span class="num">62</span>,<span class="num">55</span>,<span class="num">3</span>],[<span class="num">35</span>,<span class="num">22</span>,<span class="num">36</span>],'
+ '\n              [<span class="num">48</span>,<span class="num">45</span>,<span class="num">2</span>],[<span class="num">31</span>,<span class="num">24</span>,<span class="num">22</span>],[<span class="num">55</span>,<span class="num">60</span>,<span class="num">5</span>]])'
+ '\ny = np.<span class="fn">array</span>([<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>])  <span class="cm"># 0=stay, 1=churn</span>'
+ '\n'
+ '\n<span class="cm"># kNN needs scaling (distance is scale-sensitive)</span>'
+ '\nmodels = {'
+ '\n    <span class="str">"LogReg"</span>: <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">LogisticRegression</span>()),'
+ '\n    <span class="str">"kNN"</span>:    <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">KNeighborsClassifier</span>(n_neighbors=<span class="num">3</span>)),'
+ '\n    <span class="str">"NaiveBayes"</span>: <span class="fn">GaussianNB</span>(),'
+ '\n}'
+ '\n'
+ '\n<span class="cm"># New customer: 50yo, $50/mo, 4 months tenure — likely to churn</span>'
+ '\nnew = [[<span class="num">50</span>,<span class="num">50</span>,<span class="num">4</span>]]'
+ '\n<span class="kw">for</span> name, model <span class="kw">in</span> models.<span class="fn">items</span>():'
+ '\n    model.<span class="fn">fit</span>(X, y)'
+ '\n    pred = model.<span class="fn">predict</span>(new)[<span class="num">0</span>]'
+ '\n    proba = model.<span class="fn">predict_proba</span>(new)[<span class="num">0</span>][<span class="num">1</span>]'
+ '\n    <span class="fn">print</span>(<span class="str">f"{name:12} pred={pred} P(churn)={proba:.2%}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Three classifiers on the same data. <code>StandardScaler</code> centres each feature to zero mean and unit variance — critical for kNN (distance becomes meaningless if age 28 vs fee 55 dominate). Logistic regression works without scaling but it is good practice. All three predict "churn" for the new customer with different probabilities. Which one is actually best needs cross-validation (<a href="/tutorials/ai/ml/generalization-bias-variance">Lesson 4</a>).</p>'

+ '<h2 class="l-title">11. What\'s Next</h2>'

+ '<p class="l-text">We have classification fundamentals. But how do we know our predictions are "good"? Are 6 correct training predictions enough, or did the model just memorise? <a href="/tutorials/ai/ml/generalization-bias-variance">Lesson 4</a> tackles <strong>generalisation</strong>: bias-variance trade-off, train/val/test split, cross-validation. One of the most important ideas in ML.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The difference between classification (categorical target) and regression. Why linear regression fails for classification. The role of the sigmoid and how logistic regression is just linear-combination + sigmoid. The cross-entropy loss and why MSE is not used here. The geometric meaning of the decision boundary and how polynomials/kernels make it non-linear. Two alternative classifiers (kNN and Naive Bayes) and when to use each. sklearn pipelines comparing three algorithms on the same data.</div>'

};
