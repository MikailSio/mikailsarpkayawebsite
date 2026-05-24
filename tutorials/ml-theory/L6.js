/* ml-L6.js — ML Theory Lesson 6: Regularization — L1, L2, ElasticNet (TR + EN) */
var ML_L6 = {

tr:
'<script>(function(){var g=window;g.__mlChartDrawers=[];g.__mlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/ml-theory/4">Ders 4</a>\'te overfitting\'i tanıdık; bu derste onunla mücadele etmenin en güçlü silahını öğreniyoruz: <strong>regularization</strong>. L1 (Lasso), L2 (Ridge) ve ElasticNet — modelin ağırlıklarına ceza koyarak basit kalmasını zorlamak. Ayrıca early stopping ve neural networklerde dropout. Lojistik regresyondaki "C" hyperparametresinin ne kontrol ettiğini sonunda anlayacaksın.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>L2 (Ridge) cezasını kayba ekleyip ağırlıkları küçültmesini gözlemleyeceksin</li><li>L1 (Lasso) cezasının neden seyrek (sparse) modeller ürettiğini açıklayacaksın</li><li>ElasticNet ile L1 ve L2\'yi birleştirip özellik seçimi + stabilite alacaksın</li><li>StandardScaler ile özellikleri ölçekleyip regularization\'ı adil uygulayacaksın</li><li>Lojistik regresyondaki C hiperparametresinin alpha\'nın tersi olduğunu anlayacaksın</li></ul></div>'

+ '<h2 class="l-title">1. Niye Regularization?</h2>'

+ '<p class="l-text">Lineer/lojistik regresyon yeterince esnek olduğunda — özellikle çok özellik varsa — eğitim verisindeki gürültüyü ezberleyebilir. Ağırlıklar (<em>w</em>) abartılı büyük değerler alır; küçük girdi değişiklikleri tahminde büyük değişikliklere yol açar. Bu overfitting\'in işaretidir.</p>'

+ '<p class="l-text"><strong>Regularization</strong>, kayıp fonksiyonuna bir <em>ceza terimi</em> ekleyerek modelin ağırlıklarını küçük tutmaya zorlar. Sonuç: daha basit, daha kararlı, daha iyi genelleyen model.</p>'

+ '<div class="katex-block">$$\\text{Total Loss} = \\underbrace{\\mathcal{L}(\\mathbf{w})}_{\\text{data loss}} + \\lambda \\cdot \\underbrace{R(\\mathbf{w})}_{\\text{penalty}}$$</div>'

+ '<p class="l-text"><em>λ (lambda)</em> ceza gücünü kontrol eder. Yüksek <em>λ</em>: model çok basitleşir (underfit). Düşük <em>λ</em>: ceza yok (overfit). Doğru <em>λ</em>\'yı CV ile buluruz.</p>'

+ '<div class="l-note"><strong>sklearn notu:</strong> Lojistik regresyonda <code>C = 1/λ</code>. Yani büyük C az regularization, küçük C çok regularization demek. Bu şaşırtıcı bir konvansiyon ama unutmazsın.</div>'

+ '<h2 class="l-title">2. L2 Regularization (Ridge)</h2>'

+ '<p class="l-text">En yaygın regularization. Ceza terimi ağırlıkların <strong>karelerinin toplamı</strong>:</p>'

+ '<div class="katex-block">$$R_{L2}(\\mathbf{w}) = \\sum_{j=1}^{p} w_j^2 = \\|\\mathbf{w}\\|_2^2$$</div>'

+ '<p class="l-text">Bu MSE\'ye eklenince Ridge regresyonu doğar:</p>'

+ '<div class="katex-block">$$\\mathcal{L}_{\\text{Ridge}}(\\mathbf{w}) = \\frac{1}{n}\\sum_i (y_i - \\hat{y}_i)^2 + \\lambda \\sum_j w_j^2$$</div>'

+ '<p class="l-text">Etki:</p>'

+ '<ul class="l-list">'
+ '<li>Tüm ağırlıkları sıfıra <em>doğru</em> çeker, ama tam sıfır yapmaz.</li>'
+ '<li>Korreleli özellikleri "böler" — biri her şeyi taşımaz, ağırlıklar paylaşılır.</li>'
+ '<li>Türevi düzgün, gradyan inişle iyi çalışır.</li>'
+ '<li>Multicollinearity (özellikler birbirine bağımlı) sorununu çözmede etkilidir.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. L1 Regularization (Lasso)</h2>'

+ '<p class="l-text">Ağırlıkların <strong>mutlak değerlerinin toplamı</strong>:</p>'

+ '<div class="katex-block">$$R_{L1}(\\mathbf{w}) = \\sum_{j=1}^{p} |w_j| = \\|\\mathbf{w}\\|_1$$</div>'

+ '<p class="l-text">L1 ile Lasso regresyonu:</p>'

+ '<div class="katex-block">$$\\mathcal{L}_{\\text{Lasso}}(\\mathbf{w}) = \\frac{1}{n}\\sum_i (y_i - \\hat{y}_i)^2 + \\lambda \\sum_j |w_j|$$</div>'

+ '<p class="l-text">Etki:</p>'

+ '<ul class="l-list">'
+ '<li>Bazı ağırlıkları <strong>tam sıfır</strong> yapar — yani <em>özellik seçimi</em> yapar otomatik.</li>'
+ '<li>Yorumlanabilir model: hangi özelliklerin kullanıldığı net.</li>'
+ '<li>Çok sayıda gereksiz özellik varsa idealdir.</li>'
+ '<li>Dezavantaj: korreleli özelliklerden rastgele birini seçer, diğerlerini sıfırlar.</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">L1 vs L2 — GEOMETRİK FARK</div><div class="example-body">'
+ '<p class="l-text">Niye L1 sıfır yapar L2 yapmaz? İki boyutta görünüm:</p>'
+ '<ul class="l-list">'
+ '<li><strong>L2 ceza bölgesi:</strong> Daire (yuvarlak köşesiz). Optimum çoğu zaman koordinat eksenlerinden uzakta. Hiçbir w tam sıfır olmaz.</li>'
+ '<li><strong>L1 ceza bölgesi:</strong> Eşkenar dörtgen (köşeleri eksen üzerinde). Optimum çoğu zaman bir köşeye düşer; o köşede bir w sıfırdır.</li>'
+ '</ul>'
+ '<p class="l-text">Bu, ML\'in en zarif geometrik sonuçlarından biridir — Tibshirani\'nin orijinal Lasso makalesinin (1996) merkezi.</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. ElasticNet — İkisinin Birleşimi</h2>'

+ '<p class="l-text">L1 ve L2\'nin avantajlarını birleştirir:</p>'

+ '<div class="katex-block">$$R_{\\text{EN}}(\\mathbf{w}) = \\alpha \\sum_j |w_j| + (1-\\alpha) \\sum_j w_j^2$$</div>'

+ '<p class="l-text"><em>α</em> ∈ [0, 1] iki ceza arası geçiş kontrol eder:</p>'

+ '<ul class="l-list">'
+ '<li><em>α = 0</em>: Saf Ridge.</li>'
+ '<li><em>α = 1</em>: Saf Lasso.</li>'
+ '<li><em>α = 0.5</em>: Eşit karışım. Hem özellik seçimi hem de korreleli özelliklerin gruplama avantajı.</li>'
+ '</ul>'

+ '<p class="l-text">Pratikte yüksek-boyutlu (özellik > örnek) verilerde — örneğin genetik veride binlerce gen, yüzlerce hasta — ElasticNet sıkça en iyi seçim olur.</p>'

+ '<h2 class="l-title">5. Görsel — Regularization\'ın Etkisi</h2>'

+ '<div class="plotly-graph"><div id="plot-reg-tr" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var lambdas=[0.001,0.01,0.1,1,10,100,1000];'
+ 'var train_err=[0.05,0.06,0.10,0.15,0.22,0.30,0.45];'
+ 'var test_err=[0.42,0.32,0.18,0.16,0.20,0.31,0.46];'
+ 'var t1={x:lambdas,y:train_err,name:"Eğitim hatası",type:"scatter",mode:"lines+markers",line:{color:"rgba(78,205,196,.85)",width:3}};'
+ 'var t2={x:lambdas,y:test_err,name:"Test hatası",type:"scatter",mode:"lines+markers",line:{color:T.accent,width:3}};'
+ 'var layout={xaxis:{title:"λ (logaritmik)",color:T.text,gridcolor:T.grid,type:"log"},yaxis:{title:"Hata",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,xanchor:"center",x:0.5}};'
+ 'if(document.getElementById("plot-reg-tr"))Plotly.newPlot("plot-reg-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> λ çok küçükken (sol uç) regularization yok — model overfit, eğitim hatası neredeyse sıfır ama test hatası çok yüksek. λ büyüdükçe eğitim hatası artar (model basitleşir) ama test hatası düşer — overfit azalır. Bir noktada test hatası minimum yapar — bu en iyi λ. Daha büyük λ underfit\'e götürür, hem eğitim hem test bozulur. CV ile bu minimum noktayı buluruz.</div>'

+ '<h2 class="l-title">6. Early Stopping</h2>'

+ '<p class="l-text">Iteratif algoritmalar (gradyan iniş tabanlı) için ek bir regularization yöntemi: <strong>erken durdurma</strong>. Eğitim devam ederken val skoru izlenir. Val skoru iyileşmemeye başladığı anda eğitim durdurulur.</p>'

+ '<p class="l-text">Mantık: ilk epoch\'lar ana örüntüyü öğrenir; sonraki epoch\'lar gürültüyü öğrenmeye başlar. Doğru anda durdurmak overfitting\'i önler.</p>'

+ '<p class="l-text">Sklearn\'de SGDClassifier, SGDRegressor için <code>early_stopping=True</code>; XGBoost\'ta <code>early_stopping_rounds=10</code>; Keras/PyTorch\'ta <code>EarlyStopping</code> callback\'i.</p>'

+ '<h2 class="l-title">7. Dropout — Sinir Ağları için</h2>'

+ '<p class="l-text">Klasik ML\'de değil ama derin öğrenmede çok yaygın. Eğitim sırasında her batch\'te rastgele <em>p</em> oranında nöron "düşer" (geçici olarak çıkartılır). Sonuç: ağ, hiçbir nörona aşırı bağımlı olamaz, daha sağlam temsiller öğrenir.</p>'

+ '<p class="l-text">Tipik <em>p</em> = 0.2-0.5. Test zamanında dropout kapanır, tüm nöronlar kullanılır.</p>'

+ '<p class="l-text">Bu kursta klasik ML\'e odaklanıyoruz; dropout için Deep Learning kursu.</p>'

+ '<h2 class="l-title">8. Veri Standardizasyonu — Regularization için Şart</h2>'

+ '<p class="l-text">Regularization tüm ağırlıklara aynı ölçüde ceza verir. Eğer "yaş" 0-100 ölçeğinde, "ücret" 0-10000 ölçeğindeyse, ücret\'in ağırlığı çok küçük çıkar (çünkü değerler çok büyük) ve ceza onu aşırı sıkar. Yaş\'ın ağırlığı ise göreli olarak az cezalandırılır — adaletsiz.</p>'

+ '<p class="l-text">Çözüm: regularization öncesi <strong>standardizasyon</strong>. Her özelliği ortalama 0, varyans 1\'e dönüştür: <code>StandardScaler</code>. Bu olmazsa regularization sonuçları yanıltıcıdır.</p>'

+ '<h2 class="l-title">9. Python — Ridge, Lasso, ElasticNet Karşılaştırması</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Üç regularizasyon yöntemi yan yana<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge, Lasso, ElasticNet'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n'
+ '\n<span class="cm"># 100 örnek, 20 özellik (10 yararlı + 10 gürültü)</span>'
+ '\nnp.random.<span class="fn">seed</span>(<span class="num">42</span>)'
+ '\nX = np.random.<span class="fn">randn</span>(<span class="num">100</span>, <span class="num">20</span>)'
+ '\ntrue_w = np.<span class="fn">concatenate</span>([np.<span class="fn">linspace</span>(<span class="num">1</span>, <span class="num">2</span>, <span class="num">10</span>), np.<span class="fn">zeros</span>(<span class="num">10</span>)])  <span class="cm"># son 10 özellik gereksiz</span>'
+ '\ny = X @ true_w + np.random.<span class="fn">randn</span>(<span class="num">100</span>) * <span class="num">0.5</span>'
+ '\n'
+ '\nmodels = {'
+ '\n    <span class="str">"Ridge (L2)"</span>:  <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">Ridge</span>(alpha=<span class="num">1.0</span>)),'
+ '\n    <span class="str">"Lasso (L1)"</span>:  <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">Lasso</span>(alpha=<span class="num">0.1</span>)),'
+ '\n    <span class="str">"ElasticNet"</span>:  <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">ElasticNet</span>(alpha=<span class="num">0.1</span>, l1_ratio=<span class="num">0.5</span>)),'
+ '\n}'
+ '\n'
+ '\n<span class="kw">for</span> name, model <span class="kw">in</span> models.<span class="fn">items</span>():'
+ '\n    model.<span class="fn">fit</span>(X, y)'
+ '\n    coefs = model[-<span class="num">1</span>].coef_'
+ '\n    n_zero = (np.<span class="fn">abs</span>(coefs) < <span class="num">0.001</span>).<span class="fn">sum</span>()'
+ '\n    <span class="fn">print</span>(<span class="str">f"{name:14} sıfır ağırlık sayısı: {n_zero}/20, R²: {model.score(X, y):.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># Ridge (L2)     sıfır ağırlık sayısı: 0/20,  R²: 0.965</span>'
+ '\n<span class="cm"># Lasso (L1)     sıfır ağırlık sayısı: 8/20,  R²: 0.948  ← gerçekten 10 gereksiz vardı</span>'
+ '\n<span class="cm"># ElasticNet     sıfır ağırlık sayısı: 5/20,  R²: 0.957</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Sentetik veri üretiyoruz — ilk 10 özellik gerçek katsayılı, son 10 özellik tamamen gürültü. Üç model aynı veriye uygulanır. Ridge hiçbir ağırlığı sıfırlamaz (tüm 20 katsayı küçük ama sıfır değil). Lasso 8 katsayıyı tam sıfırlar — gerçek 10 gereksiz özellikten 8\'ini doğru tespit etti, mükemmel değil ama çok değerli bir özellik seçimi. ElasticNet ortada, 5 sıfır.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> CV ile en iyi λ seçimi<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> RidgeCV, LassoCV'
+ '\n'
+ '\n<span class="cm"># RidgeCV otomatik olarak verilen alfa listesinden en iyiyi seçer</span>'
+ '\nalphas = [<span class="num">0.001</span>, <span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1</span>, <span class="num">10</span>, <span class="num">100</span>]'
+ '\nridge_cv = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">RidgeCV</span>(alphas=alphas, cv=<span class="num">5</span>))'
+ '\nridge_cv.<span class="fn">fit</span>(X, y)'
+ '\n<span class="fn">print</span>(<span class="str">f"En iyi alpha: {ridge_cv[-1].alpha_}"</span>)'
+ '\n<span class="cm"># En iyi alpha: 1.0</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> RidgeCV (ve LassoCV) cross-validation\'ı kendi içinde yapar — her alpha değerini test eder, en iyi olanı seçer. Tek bir <code>fit</code> çağrısıyla tüm tuning otomatik. Bu çok yaygın bir kısayol: ayrı GridSearchCV yazmana gerek kalmaz.</p>'

+ '<h2 class="l-title">10. Lojistik Regresyonda C — Sonunda Anladık</h2>'

+ '<p class="l-text"><a href="/tutorials/ml-theory/3">L3</a>\'te lojistik regresyonu kullandık ama "C parametresi nedir?" sorusunu erteledik. Cevap:</p>'

+ '<div class="katex-block">$$C = \\frac{1}{\\lambda}$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>C = 1.0 (varsayılan):</strong> orta regularization.</li>'
+ '<li><strong>C = 100:</strong> az regularization. Karmaşık model.</li>'
+ '<li><strong>C = 0.01:</strong> çok regularization. Basit model.</li>'
+ '</ul>'

+ '<p class="l-text">sklearn\'in lojistik regresyonu varsayılan olarak L2 kullanır. <code>penalty="l1"</code> ile Lasso versiyonuna geçilir (özellik seçimi için).</p>'

+ '<h2 class="l-title">11. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Lineer modellerin overfitting\'le mücadelesini öğrendik. Şimdi tamamen farklı bir aileye geçiyoruz: <a href="/tutorials/ml-theory/7">Ders 7</a> — <strong>Karar Ağaçları ve Ensemble Yöntemleri</strong>. Tek bir ağaç, Random Forest, Gradient Boosting, XGBoost. Tablo verisinde sıkça en iyi sonucu veren bu yöntemleri öğreneceksin.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Regularization\'ın overfitting\'e karşı en güçlü silah olduğunu öğrendin. Kayıp fonksiyonuna ceza terimi ekleme prensibini ve <em>λ</em> hyperparametresinin rolünü kavradın. L2 (Ridge) ve L1 (Lasso) cezalarının matematiksel ve geometrik farklarını gördün — L1\'in niye otomatik özellik seçimi yaptığını anladın. ElasticNet\'in iki cezayı birleştirdiğini, yüksek-boyutlu verilerde değerini öğrendin. Early stopping ve dropout gibi alternatif regularization yöntemlerini tanıdın. Standardizasyonun regularization için niye şart olduğunu kavradın. sklearn ile gerçek kod yazdın. Lojistik regresyondaki C parametresinin <em>1/λ</em> olduğunu sonunda anladın.</div>'

,

en:
'<script>(function(){var g=window;g.__mlChartDrawers=g.__mlChartDrawers||[];g.__mlChartTheme=g.__mlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#8b5cf6"};};g.__mlRegDraw=g.__mlRegDraw||function(fn){g.__mlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__mlThemeObsAttached){g.__mlThemeObsAttached=true;var redraw=function(){(g.__mlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/ml-theory/4">Lesson 4</a> we met overfitting; in this lesson we learn the strongest tool against it: <strong>regularisation</strong>. L1 (Lasso), L2 (Ridge), and ElasticNet — penalties that force model weights to stay small. Plus early stopping and (in neural nets) dropout. You will finally understand what the "C" hyperparameter in logistic regression really controls.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Add an L2 (Ridge) penalty to the loss and watch weights shrink</li><li>Explain why L1 (Lasso) yields sparse models that drop features</li><li>Combine L1 and L2 with ElasticNet for selection plus stability</li><li>Standardize features with StandardScaler so regularisation is fair</li><li>Read logistic regression\'s C as the inverse of the regularisation strength alpha</li></ul></div>'

+ '<h2 class="l-title">1. Why Regularisation?</h2>'

+ '<p class="l-text">When a linear/logistic regression has enough flexibility — especially with many features — it can memorise the noise in training data. Weights (<em>w</em>) take exaggerated values; small input changes cause huge prediction swings. That is the signature of overfitting.</p>'

+ '<p class="l-text"><strong>Regularisation</strong> adds a <em>penalty term</em> to the loss to keep weights small. Result: simpler, more stable, better-generalising model.</p>'

+ '<div class="katex-block">$$\\text{Total Loss} = \\underbrace{\\mathcal{L}(\\mathbf{w})}_{\\text{data loss}} + \\lambda \\cdot \\underbrace{R(\\mathbf{w})}_{\\text{penalty}}$$</div>'

+ '<p class="l-text"><em>λ</em> controls the penalty strength. Big <em>λ</em>: model becomes too simple (underfit). Small <em>λ</em>: no penalty (overfit). The right <em>λ</em> is found via CV.</p>'

+ '<div class="l-note"><strong>sklearn note:</strong> in logistic regression <code>C = 1/λ</code>. So a large C means little regularisation, a small C lots. Surprising convention but you remember it.</div>'

+ '<h2 class="l-title">2. L2 Regularisation (Ridge)</h2>'

+ '<p class="l-text">The most common penalty. Sum of <strong>squared</strong> weights:</p>'

+ '<div class="katex-block">$$R_{L2}(\\mathbf{w}) = \\sum_{j=1}^{p} w_j^2 = \\|\\mathbf{w}\\|_2^2$$</div>'

+ '<p class="l-text">Add it to MSE and you get Ridge regression:</p>'

+ '<div class="katex-block">$$\\mathcal{L}_{\\text{Ridge}}(\\mathbf{w}) = \\frac{1}{n}\\sum_i (y_i - \\hat{y}_i)^2 + \\lambda \\sum_j w_j^2$$</div>'

+ '<p class="l-text">Effects:</p>'

+ '<ul class="l-list">'
+ '<li>Pulls all weights <em>toward</em> zero, but rarely to exact zero.</li>'
+ '<li>"Shares" weight among correlated features — none dominates.</li>'
+ '<li>Smooth derivative, plays well with gradient descent.</li>'
+ '<li>Effective against multicollinearity (correlated features).</li>'
+ '</ul>'

+ '<h2 class="l-title">3. L1 Regularisation (Lasso)</h2>'

+ '<p class="l-text">Sum of <strong>absolute values</strong> of weights:</p>'

+ '<div class="katex-block">$$R_{L1}(\\mathbf{w}) = \\sum_{j=1}^{p} |w_j| = \\|\\mathbf{w}\\|_1$$</div>'

+ '<p class="l-text">Combined with MSE: Lasso regression:</p>'

+ '<div class="katex-block">$$\\mathcal{L}_{\\text{Lasso}}(\\mathbf{w}) = \\frac{1}{n}\\sum_i (y_i - \\hat{y}_i)^2 + \\lambda \\sum_j |w_j|$$</div>'

+ '<p class="l-text">Effects:</p>'

+ '<ul class="l-list">'
+ '<li>Drives some weights to <strong>exactly zero</strong> — automatic <em>feature selection</em>.</li>'
+ '<li>Interpretable models: you can see which features the model uses.</li>'
+ '<li>Ideal when you suspect many irrelevant features.</li>'
+ '<li>Downside: with correlated features it picks one and zeros the others (somewhat arbitrarily).</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">L1 vs L2 — GEOMETRIC DIFFERENCE</div><div class="example-body">'
+ '<p class="l-text">Why does L1 produce zeros and L2 not? In two dimensions:</p>'
+ '<ul class="l-list">'
+ '<li><strong>L2 penalty region:</strong> a circle (smooth, no corners). Optimum usually away from the axes — no weight is exactly zero.</li>'
+ '<li><strong>L1 penalty region:</strong> a diamond (corners on the axes). Optimum often falls on a corner — at that corner one weight is zero.</li>'
+ '</ul>'
+ '<p class="l-text">One of the most elegant geometric results in ML — central to Tibshirani\'s 1996 Lasso paper.</p>'
+ '</div></div>'

+ '<h2 class="l-title">4. ElasticNet — Combining Both</h2>'

+ '<p class="l-text">Combines the strengths of L1 and L2:</p>'

+ '<div class="katex-block">$$R_{\\text{EN}}(\\mathbf{w}) = \\alpha \\sum_j |w_j| + (1-\\alpha) \\sum_j w_j^2$$</div>'

+ '<p class="l-text"><em>α</em> ∈ [0, 1] interpolates:</p>'

+ '<ul class="l-list">'
+ '<li><em>α = 0</em>: pure Ridge.</li>'
+ '<li><em>α = 1</em>: pure Lasso.</li>'
+ '<li><em>α = 0.5</em>: equal mix. Both feature selection and grouping of correlated features.</li>'
+ '</ul>'

+ '<p class="l-text">In practice for high-dimensional (features > examples) data — e.g. genomic data with thousands of genes and hundreds of patients — ElasticNet often wins.</p>'

+ '<h2 class="l-title">5. Visual — Effect of Regularisation Strength</h2>'

+ '<div class="plotly-graph"><div id="plot-reg-en" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__mlRegDraw(function(){'
+ 'var T=window.__mlChartTheme();'
+ 'var lambdas=[0.001,0.01,0.1,1,10,100,1000];'
+ 'var train_err=[0.05,0.06,0.10,0.15,0.22,0.30,0.45];'
+ 'var test_err=[0.42,0.32,0.18,0.16,0.20,0.31,0.46];'
+ 'var t1={x:lambdas,y:train_err,name:"Train error",type:"scatter",mode:"lines+markers",line:{color:"rgba(78,205,196,.85)",width:3}};'
+ 'var t2={x:lambdas,y:test_err,name:"Test error",type:"scatter",mode:"lines+markers",line:{color:T.accent,width:3}};'
+ 'var layout={xaxis:{title:"λ (log scale)",color:T.text,gridcolor:T.grid,type:"log"},yaxis:{title:"Error",color:T.text,gridcolor:T.grid},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:30,r:30,b:60,l:60},legend:{font:{color:T.text},orientation:"h",y:1.08,xanchor:"center",x:0.5}};'
+ 'if(document.getElementById("plot-reg-en"))Plotly.newPlot("plot-reg-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> When λ is tiny (left) there is no regularisation — model overfits, train error near zero but test error very high. As λ grows, train error rises (model gets simpler) but test error falls — overfitting subsides. At some point test error is minimum — the optimal λ. Larger λ leads to underfitting; both errors rise. CV finds this sweet spot.</div>'

+ '<h2 class="l-title">6. Early Stopping</h2>'

+ '<p class="l-text">An additional regularisation technique for iterative algorithms (gradient-descent-based): <strong>early stopping</strong>. While training, monitor validation score. The moment it stops improving, halt training.</p>'

+ '<p class="l-text">Logic: early epochs learn the main pattern; later epochs start memorising noise. Stopping at the right time prevents overfitting.</p>'

+ '<p class="l-text">In sklearn: <code>early_stopping=True</code> for SGDClassifier/SGDRegressor; <code>early_stopping_rounds=10</code> in XGBoost; <code>EarlyStopping</code> callback in Keras/PyTorch.</p>'

+ '<h2 class="l-title">7. Dropout — For Neural Networks</h2>'

+ '<p class="l-text">Not in classical ML but very common in deep learning. During training, each batch randomly "drops" a fraction <em>p</em> of neurons (temporarily removed). Result: the network cannot become overly dependent on any neuron, learning more robust representations.</p>'

+ '<p class="l-text">Typical <em>p</em> = 0.2-0.5. At test time dropout is disabled and all neurons are used.</p>'

+ '<p class="l-text">This course focuses on classical ML; for dropout see the Deep Learning course.</p>'

+ '<h2 class="l-title">8. Standardisation — Required for Regularisation</h2>'

+ '<p class="l-text">Regularisation penalises all weights equally. If "age" is on a 0-100 scale and "fee" on 0-10000, fee\'s coefficient ends up tiny (because the values are huge) and the penalty squashes it disproportionately. Age\'s coefficient is relatively under-penalised — unfair.</p>'

+ '<p class="l-text">Fix: <strong>standardise</strong> features before regularisation. Each feature transformed to mean 0, variance 1: <code>StandardScaler</code>. Without it regularisation results are misleading.</p>'

+ '<h2 class="l-title">9. Python — Ridge, Lasso, ElasticNet Side by Side</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Three regularisation methods compared<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> numpy <span class="kw">as</span> np'
+ '\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge, Lasso, ElasticNet'
+ '\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler'
+ '\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline'
+ '\n'
+ '\n<span class="cm"># 100 samples, 20 features (10 useful + 10 noise)</span>'
+ '\nnp.random.<span class="fn">seed</span>(<span class="num">42</span>)'
+ '\nX = np.random.<span class="fn">randn</span>(<span class="num">100</span>, <span class="num">20</span>)'
+ '\ntrue_w = np.<span class="fn">concatenate</span>([np.<span class="fn">linspace</span>(<span class="num">1</span>, <span class="num">2</span>, <span class="num">10</span>), np.<span class="fn">zeros</span>(<span class="num">10</span>)])'
+ '\ny = X @ true_w + np.random.<span class="fn">randn</span>(<span class="num">100</span>) * <span class="num">0.5</span>'
+ '\n'
+ '\nmodels = {'
+ '\n    <span class="str">"Ridge (L2)"</span>:  <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">Ridge</span>(alpha=<span class="num">1.0</span>)),'
+ '\n    <span class="str">"Lasso (L1)"</span>:  <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">Lasso</span>(alpha=<span class="num">0.1</span>)),'
+ '\n    <span class="str">"ElasticNet"</span>:  <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">ElasticNet</span>(alpha=<span class="num">0.1</span>, l1_ratio=<span class="num">0.5</span>)),'
+ '\n}'
+ '\n'
+ '\n<span class="kw">for</span> name, model <span class="kw">in</span> models.<span class="fn">items</span>():'
+ '\n    model.<span class="fn">fit</span>(X, y)'
+ '\n    coefs = model[-<span class="num">1</span>].coef_'
+ '\n    n_zero = (np.<span class="fn">abs</span>(coefs) < <span class="num">0.001</span>).<span class="fn">sum</span>()'
+ '\n    <span class="fn">print</span>(<span class="str">f"{name:14} zero coefs: {n_zero}/20, R²: {model.score(X, y):.3f}"</span>)'
+ '\n'
+ '\n<span class="cm"># Ridge (L2)     zero coefs: 0/20,  R²: 0.965</span>'
+ '\n<span class="cm"># Lasso (L1)     zero coefs: 8/20,  R²: 0.948  ← truly 10 noise features</span>'
+ '\n<span class="cm"># ElasticNet     zero coefs: 5/20,  R²: 0.957</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> We generate synthetic data — first 10 features have real coefficients, last 10 are pure noise. Three models on the same data. Ridge zeros none (all 20 coefficients are small but non-zero). Lasso zeroes 8 — caught 8 of the 10 noise features (good feature selection). ElasticNet sits in the middle, with 5 zeros.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Choosing λ via CV<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> RidgeCV, LassoCV'
+ '\n'
+ '\n<span class="cm"># RidgeCV automatically picks the best alpha from the list</span>'
+ '\nalphas = [<span class="num">0.001</span>, <span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1</span>, <span class="num">10</span>, <span class="num">100</span>]'
+ '\nridge_cv = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">RidgeCV</span>(alphas=alphas, cv=<span class="num">5</span>))'
+ '\nridge_cv.<span class="fn">fit</span>(X, y)'
+ '\n<span class="fn">print</span>(<span class="str">f"Best alpha: {ridge_cv[-1].alpha_}"</span>)'
+ '\n<span class="cm"># Best alpha: 1.0</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> RidgeCV (and LassoCV) does cross-validation internally — tries each alpha, picks the best. A single <code>fit</code> handles all the tuning. A common shortcut so you do not need a separate GridSearchCV.</p>'

+ '<h2 class="l-title">10. Logistic Regression\'s C — Finally Explained</h2>'

+ '<p class="l-text">In <a href="/tutorials/ml-theory/3">L3</a> we used logistic regression but deferred "what is the C parameter?". Answer:</p>'

+ '<div class="katex-block">$$C = \\frac{1}{\\lambda}$$</div>'

+ '<ul class="l-list">'
+ '<li><strong>C = 1.0 (default):</strong> moderate regularisation.</li>'
+ '<li><strong>C = 100:</strong> light regularisation, complex model.</li>'
+ '<li><strong>C = 0.01:</strong> heavy regularisation, simple model.</li>'
+ '</ul>'

+ '<p class="l-text">sklearn\'s LogisticRegression uses L2 by default. Set <code>penalty="l1"</code> for the Lasso version (feature selection).</p>'

+ '<h2 class="l-title">11. What\'s Next</h2>'

+ '<p class="l-text">We learned linear models\' fight against overfitting. Now to a completely different family: <a href="/tutorials/ml-theory/7">Lesson 7</a> — <strong>decision trees and ensembles</strong>. Single trees, Random Forest, Gradient Boosting, XGBoost. The methods that often win on tabular data.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> Regularisation is the strongest weapon against overfitting. The principle of adding a penalty term to the loss and the role of <em>λ</em>. The mathematical and geometric difference between L2 (Ridge) and L1 (Lasso) — and why L1 produces automatic feature selection. ElasticNet combines both and shines in high-dimensional data. Early stopping and dropout as alternative regularisers. Why standardisation is required before regularisation. Real code with sklearn. Finally, you understand what the "C" parameter in logistic regression really means — <em>1/λ</em>.</div>'

};
