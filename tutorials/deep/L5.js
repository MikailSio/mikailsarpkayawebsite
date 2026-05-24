/* dl-new-L5.js — Deep Learning Lesson 5: Regularization & Normalization (TR + EN) */
var DL_L5 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Modelin eğitim setini ezberlemesini engellemek (regularization) ve katmanlar arası akışı stabilize etmek (normalization). L1/L2 weight decay, dropout, early stopping, data augmentation; sonra batch norm, layer norm, group norm. Hangi yöntemi ne zaman? Modern ağda hepsi bir arada nasıl çalışır?</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Train/val loss eğrisinden overfitting\'i teşhis edip early stopping uygulayacaksın</li><li>L1 ve L2 weight decay\'i kayıp fonksiyonuna ekleyip etkisini gözlemleyeceksin</li><li>Dropout maskesini eğitimde uygulayıp inference\'ta scaling\'i çıkaracaksın</li><li>MNIST için döndürme, kaydırma ve gürültü ile data augmentation kuracaksın</li><li>BatchNorm, LayerNorm ve GroupNorm\'u batch boyutu ve mimariye göre seçeceksin</li></ul></div>'

+ '<h2 class="l-title">1. Overfitting — Hatırlatma</h2>'

+ '<p class="l-text"><a href="/tutorials/ml-theory/2">ML L2</a> ve <a href="/tutorials/ml-theory/5">ML L5</a>\'te overfitting\'in ne olduğunu gördük: model eğitim verisinin gürültüsünü ezberler, görmediği veride başarısız olur. Derin ağlarda bu sorun çok daha keskin — milyonlarca parametre, hafıza kapasitesi sınırsız gibi.</p>'

+ '<div class="calc-highlight"><strong>Belirti:</strong> Eğitim kaybı düşmeye devam ederken doğrulama (validation) kaybı durakladı, hatta artmaya başladı. Bu noktanın ötesinde model genelleyemiyor.</div>'

+ '<p class="l-text"><strong>Çözüm yelpazesi:</strong> (1) <em>parametreleri kısıtla</em> — weight decay, küçük model. (2) <em>parametreleri rastgele bozmaya zorla</em> — dropout. (3) <em>veriyi büyüt</em> — augmentation. (4) <em>doğru zamanda dur</em> — early stopping. (5) <em>aktivasyonları stabilize et</em> — batch/layer norm.</p>'

+ '<h2 class="l-title">2. L2 Regularization (Weight Decay)</h2>'

+ '<p class="l-text">Kayıp fonksiyonuna ağırlıkların kare toplamından bir ceza ekle:</p>'

+ '<div class="katex-block">$$L_{\\text{toplam}} = L_{\\text{veri}}(\\theta) + \\frac{\\lambda}{2} \\|\\theta\\|^2$$</div>'

+ '<p class="l-text"><em>λ</em> = regularization şiddeti (tipik 10⁻⁴ – 10⁻²). Türevi alındığında her güncellemede ek bir terim çıkar:</p>'

+ '<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\eta (\\nabla L_{\\text{veri}} + \\lambda \\theta_t) = (1 - \\eta \\lambda)\\theta_t - \\eta \\nabla L_{\\text{veri}}$$</div>'

+ '<p class="l-text">Her adımda ağırlığı küçük bir oranda küçült — yani "decay". Bu yüzden adı <strong>weight decay</strong>. Etkisi: gereksiz büyük ağırlıkları cezalandırır, model daha basit fonksiyonlara meyleder.</p>'

+ '<p class="l-text">PyTorch\'ta optimizer parametresi olarak: <code>AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)</code>. <a href="/tutorials/deep/4">Ders 4</a>\'te neden AdamW\'nin bunu doğru yaptığını gördük.</p>'

+ '<h2 class="l-title">3. L1 Regularization</h2>'

+ '<div class="katex-block">$$L_{\\text{toplam}} = L_{\\text{veri}}(\\theta) + \\lambda \\|\\theta\\|_1 = L_{\\text{veri}}(\\theta) + \\lambda \\sum_i |\\theta_i|$$</div>'

+ '<p class="l-text">Mutlak değer cezası. L2\'den farklı olarak ağırlıkları tam olarak <em>sıfıra</em> götürür — seyrek (sparse) modeller üretir. Görüntü/metin sınıflamada nadir kullanılır; özellik seçimi (feature selection) gerektiren senaryolarda popüler. Derin öğrenmede çoğunlukla L2 yeterlidir.</p>'

+ '<h2 class="l-title">4. Dropout — En Etkili Hile</h2>'

+ '<p class="l-text"><strong>Hinton 2012:</strong> Eğitim sırasında her batch\'te rastgele <em>p</em> oranında nöronu sıfırla. Çıkarım (test/inference) sırasında hepsini kullan, ama aktivasyonları (1-p) ile çarp.</p>'

+ '<div class="katex-block">$$h_{\\text{train}} = m \\odot h, \\quad m_i \\sim \\text{Bernoulli}(1-p)$$</div>'

+ '<p class="l-text"><em>p = 0.5</em> klasik FC katmanlarda; CNN\'lerde 0.1–0.2; Transformer\'da attention sonrası 0.1.</p>'

+ '<div class="calc-example"><div class="example-label">PYTORCH</div><div class="example-body"><div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\nmodel = nn.<span class="fn">Sequential</span>(\n    nn.<span class="fn">Linear</span>(<span class="num">784</span>, <span class="num">256</span>),\n    nn.<span class="fn">ReLU</span>(),\n    nn.<span class="fn">Dropout</span>(p=<span class="num">0.5</span>),         <span class="cm"># rastgele yarısı sıfır</span>\n    nn.<span class="fn">Linear</span>(<span class="num">256</span>, <span class="num">128</span>),\n    nn.<span class="fn">ReLU</span>(),\n    nn.<span class="fn">Dropout</span>(p=<span class="num">0.5</span>),\n    nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">10</span>),\n)\n\nmodel.<span class="fn">train</span>()  <span class="cm"># dropout AKTIF</span>\nmodel.<span class="fn">eval</span>()   <span class="cm"># dropout KAPALI (otomatik)</span></code></pre></div></div></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> İki gizli katman arasında dropout. <code>model.train()</code> çağrıldığında dropout aktif (eğitim modu); <code>model.eval()</code> çağrıldığında kapanır (test/validation modu). Bu mod farkını unutmak yaygın bir hatadır.</p>'

+ '<p class="l-text"><strong>Sezgi:</strong> Dropout her batch\'te sanki farklı bir alt-ağ eğitiyormuşsun gibi davranır. Test zamanında bu binlerce alt-ağın "ortalaması" çalışır — implicit bir ensemble. Tek bir nöron bir özelliği taşımaya bel bağlayamaz; her birinin yedeği olur.</p>'

+ '<h2 class="l-title">5. Early Stopping</h2>'

+ '<p class="l-text">En basit regularization. Validation kaybı her epoch ölç; iyileşme durduğunda eğitimi kes, en iyi modeli kaydet.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code>best_val_loss = <span class="fn">float</span>(<span class="str">"inf"</span>)\npatience, bad_epochs = <span class="num">5</span>, <span class="num">0</span>\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">100</span>):\n    <span class="fn">train_one_epoch</span>(model, train_loader)\n    val_loss = <span class="fn">evaluate</span>(model, val_loader)\n    <span class="kw">if</span> val_loss &lt; best_val_loss:\n        best_val_loss = val_loss\n        torch.<span class="fn">save</span>(model.<span class="fn">state_dict</span>(), <span class="str">"best.pt"</span>)\n        bad_epochs = <span class="num">0</span>\n    <span class="kw">else</span>:\n        bad_epochs += <span class="num">1</span>\n        <span class="kw">if</span> bad_epochs &gt;= patience:\n            <span class="fn">print</span>(<span class="str">f"Early stop at epoch {epoch}"</span>)\n            <span class="kw">break</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> 100 epoch hedefi var ama val kaybı 5 epoch boyunca iyileşmezse durdur. <em>patience</em> = sabır: kısa salınımlardan etkilenmesin. Her iyileşmede modeli diske kaydet — sona kalanın değil, en iyinin kullanıldığını garanti et.</p>'

+ '<h2 class="l-title">6. Data Augmentation</h2>'

+ '<p class="l-text">Veriyi yapay olarak çoğalt. Görüntü için: rastgele kırpma, döndürme, çevirme, renk titretme. Metin için: synonym replacement, back-translation. Ses için: noise, pitch shift.</p>'

+ '<div class="calc-example"><div class="example-label">TORCHVISION</div><div class="example-body"><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torchvision.transforms <span class="kw">as</span> T\n\ntrain_tf = T.<span class="fn">Compose</span>([\n    T.<span class="fn">RandomCrop</span>(<span class="num">28</span>, padding=<span class="num">4</span>),\n    T.<span class="fn">RandomHorizontalFlip</span>(),\n    T.<span class="fn">RandomRotation</span>(<span class="num">15</span>),\n    T.<span class="fn">ColorJitter</span>(brightness=<span class="num">0.2</span>, contrast=<span class="num">0.2</span>),\n    T.<span class="fn">ToTensor</span>(),\n    T.<span class="fn">Normalize</span>((<span class="num">0.1307</span>,), (<span class="num">0.3081</span>,)),  <span class="cm"># MNIST mean/std</span>\n])\n\nval_tf = T.<span class="fn">Compose</span>([\n    T.<span class="fn">ToTensor</span>(),\n    T.<span class="fn">Normalize</span>((<span class="num">0.1307</span>,), (<span class="num">0.3081</span>,)),  <span class="cm"># validation\'da augmentation YOK</span>\n])</code></pre></div></div></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Eğitim setindeki her görüntü her epoch\'ta farklı bir varyantta görünür — model orijinali ezberlemek yerine sınıfın <em>genel</em> özelliklerini öğrenmek zorunda kalır. Validation\'da augmentation yapılmaz; gerçek dağılımı ölçmek istiyoruz.</p>'

+ '<p class="l-text"><strong>Modern teknikler:</strong> Mixup (iki örneği lineer karıştır), CutMix (bir görüntünün parçasını diğerine yapıştır), RandAugment (rastgele kombinasyonlar). Bunlar büyük modellerde 1-3% accuracy katkısı verir.</p>'

+ '<h2 class="l-title">7. Internal Covariate Shift Sorunu</h2>'

+ '<p class="l-text">Derin ağda her katmanın girdi dağılımı eğitim ilerledikçe kayar — alt katmanlar değişince üst katmanlar sürekli yeni bir dağılıma uyum sağlamak zorunda. Bu, eğitimi yavaşlatır.</p>'

+ '<p class="l-text"><strong>Çözüm fikri:</strong> Her katmanın girdisini <em>normalize et</em>. Ortalamasını 0, varyansını 1 yap (sonra öğrenilebilir bir scale ve shift uygula).</p>'

+ '<h2 class="l-title">8. Batch Normalization</h2>'

+ '<p class="l-text"><strong>Ioffe &amp; Szegedy 2015.</strong> Bir mini-batch içinde her özelliği (her aktivasyon kanalını) batch boyunca normalize et:</p>'

+ '<div class="katex-block">$$\\mu_B = \\frac{1}{m}\\sum_{i=1}^m x_i, \\quad \\sigma_B^2 = \\frac{1}{m}\\sum_{i=1}^m (x_i - \\mu_B)^2$$</div>'

+ '<div class="katex-block">$$\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}, \\quad y_i = \\gamma \\hat{x}_i + \\beta$$</div>'

+ '<p class="l-text"><em>γ</em> ve <em>β</em> öğrenilebilir parametreler — model isterse normalizasyonu "geri alabilir". <em>ε</em> sayısal stabilite (10⁻⁵).</p>'

+ '<p class="l-text"><strong>Test zamanında:</strong> Tek örnek varsa batch ortalaması alamayız. Çözüm: eğitim boyunca her batch\'in <em>μ</em> ve <em>σ²</em>\'sinin koşan ortalamasını sakla, test\'te bunları kullan. PyTorch <code>nn.BatchNorm1d</code> / <code>BatchNorm2d</code> bunu otomatik yapar.</p>'

+ '<p class="l-text"><strong>Faydaları:</strong></p>'

+ '<ul class="l-list">'
+ '<li>Daha yüksek learning rate kullanılabilir → daha hızlı eğitim.</li>'
+ '<li>Vanishing gradient sorununu hafifletir.</li>'
+ '<li>Hafif bir regularization etkisi (batch içi gürültü).</li>'
+ '<li>Ağırlık başlatmaya duyarlılığı azaltır.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Sorunu:</strong> Batch boyutu küçükse (örn. 1-4) istatistikler güvenilmez. RNN/Transformer gibi sıralı modellerde batch boyu sabit değil — BatchNorm zorlaşır. Bu yüzden <strong>LayerNorm</strong> doğdu.</p>'

+ '<h2 class="l-title">9. Layer Normalization</h2>'

+ '<p class="l-text"><strong>Ba, Kiros &amp; Hinton 2016.</strong> Aynı fikir, ama ortalama-varyans <em>her örnek için ayrı</em> hesaplanır — özellikler boyunca normalize edilir, batch boyunca değil.</p>'

+ '<div class="katex-block">$$\\mu_i = \\frac{1}{H}\\sum_{j=1}^H x_{i,j}, \\quad \\sigma_i^2 = \\frac{1}{H}\\sum_{j=1}^H (x_{i,j} - \\mu_i)^2$$</div>'

+ '<p class="l-text"><em>H</em> = aktivasyon sayısı (özellik boyutu). Her örneğin kendi istatistiği — batch\'e bağımlı değil. Bu yüzden Transformer\'larda (Ders 9) ve RNN\'lerde (Ders 8) standartdır.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">BatchNorm</div><div class="card-body">CNN\'lerde, sabit-boyutlu inputlarla. ResNet, VGG, EfficientNet hepsi BN kullanır. Batch ≥ 16 öneril.</div></div>'
+ '<div class="calc-card"><div class="card-title">LayerNorm</div><div class="card-body">Transformer ve RNN\'de standart. Batch boyu fark etmez. BERT, GPT, ViT hepsi LN kullanır.</div></div>'
+ '<div class="calc-card"><div class="card-title">GroupNorm</div><div class="card-body">Kanallarını gruplara böl, her grup içinde normalize. Küçük batch (1-4) gerektiren detection/segmentation modellerinde popüler.</div></div>'
+ '<div class="calc-card"><div class="card-title">InstanceNorm</div><div class="card-body">Her örnek + her kanal için ayrı normalize. Style transfer/GAN\'larda yaygın.</div></div>'
+ '</div>'

+ '<h2 class="l-title">10. Pratikte Sıralama</h2>'

+ '<p class="l-text">"Linear → Norm → Activation → Dropout" en yaygın sıra. Modern bir blok:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># Klasik MLP bloğu</span>\nblock = nn.<span class="fn">Sequential</span>(\n    nn.<span class="fn">Linear</span>(d_in, d_out),\n    nn.<span class="fn">LayerNorm</span>(d_out),\n    nn.<span class="fn">GELU</span>(),\n    nn.<span class="fn">Dropout</span>(<span class="num">0.1</span>),\n)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Lineer dönüşüm sonrası LayerNorm — aktivasyonların dağılımını sabitler. GELU aktivasyon (Ders 2). Dropout en sona — aktivasyon değerleri üzerinde rastgele maskeleme.</p>'

+ '<p class="l-text">CNN\'de:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># Klasik CNN bloğu</span>\nblock = nn.<span class="fn">Sequential</span>(\n    nn.<span class="fn">Conv2d</span>(c_in, c_out, kernel_size=<span class="num">3</span>, padding=<span class="num">1</span>),\n    nn.<span class="fn">BatchNorm2d</span>(c_out),\n    nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Conv → BatchNorm → ReLU. ResNet ve EfficientNet bu yapıyı temel alır. Dropout CNN\'de daha az kullanılır; BN\'in kendi regularization etkisi yeterli olur.</p>'

+ '<h2 class="l-title">11. Bias-Variance Trade-off Görseli</h2>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l5-tradeoff"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l5-tradeoff"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var ep=[];for(var i=0;i<=50;i++)ep.push(i);var train=ep.map(function(i){return 2.3*Math.exp(-i/8)+0.05;});var valNoReg=ep.map(function(i){var base=2.3*Math.exp(-i/12)+0.4;return i>15?base+(i-15)*0.025:base;});var valReg=ep.map(function(i){return 2.3*Math.exp(-i/14)+0.35;});var traces=[{x:ep,y:train,mode:"lines",name:"Train",line:{color:hex2rgba(th.accent,0.6),width:2}},{x:ep,y:valNoReg,mode:"lines",name:"Val (regularization yok)",line:{color:hex2rgba(th.accent,0.4),width:2,dash:"dash"}},{x:ep,y:valReg,mode:"lines",name:"Val (Dropout + WeightDecay)",line:{color:th.accent,width:3}}];Plotly.newPlot("dl-l5-tradeoff",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{title:{text:"Epoch",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},yaxis:{title:{text:"Kayıp",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},margin:{t:50,r:30,b:60,l:60},height:360,legend:{font:{color:th.text}},title:{text:"Regularization\'ın validation kaybına etkisi (temsili)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Kesik çizgi: regularization yok — train düşüyor, val ~15. epoch\'tan sonra yükselmeye başlıyor (overfitting). Düz çizgi: dropout + weight decay — val daha uzun süre düşmeye devam ediyor, son değer daha iyi.</p>'

+ '<h2 class="l-title">12. Hangisini Ne Zaman?</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Küçük dataset (&lt; 10k)</div><div class="card-body">Augmentation, dropout 0.5, weight decay 1e-4, early stopping mutlaka. Veriyi büyütmek > model küçültmek.</div></div>'
+ '<div class="calc-card"><div class="card-title">Orta dataset (10k–1M)</div><div class="card-body">Hafif dropout (0.1–0.2), weight decay 1e-4, BN/LN. Augmentation çok faydalı.</div></div>'
+ '<div class="calc-card"><div class="card-title">Büyük dataset (1M+)</div><div class="card-body">Daha az regularization gerekir; overfitting zor. Weight decay yeter, dropout opsiyonel. BN/LN normalization için.</div></div>'
+ '<div class="calc-card"><div class="card-title">Transformer / NLP</div><div class="card-body">LayerNorm + Dropout 0.1 + weight decay 0.01 (AdamW ile). Standart kombo.</div></div>'
+ '</div>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> Regularization = ezberi engelleme; Normalization = akışı stabilize etme. Modern derin ağda hepsi katman katman örülür: Linear → Norm → Activation → Dropout. Doğru kombinasyon model + veri + görev üçlüsüne bağlı. <strong>Bir sonraki ders: CNN\'ler.</strong> İlk gerçek mimariye geçiyoruz — görüntülerle çalışmak için neden FC katman yetmez, konvolüsyon nedir, nasıl çalışır.</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> Preventing the model from memorizing the training set (regularization) and stabilizing the flow between layers (normalization). L1/L2 weight decay, dropout, early stopping, data augmentation; then batch norm, layer norm, group norm. Which method when? How do they all work together in a modern network?</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Diagnose overfitting from train/val loss curves and apply early stopping</li><li>Add L1 and L2 weight decay to the loss function and observe their effect</li><li>Apply the dropout mask during training and derive the inference-time scaling</li><li>Set up data augmentation for MNIST with rotation, shift and noise</li><li>Choose between BatchNorm, LayerNorm and GroupNorm based on batch size and architecture</li></ul></div>'

+ '<h2 class="l-title">1. Overfitting — Recap</h2>'

+ '<p class="l-text">In <a href="/tutorials/ml-theory/2">ML L2</a> and <a href="/tutorials/ml-theory/5">ML L5</a> we saw what overfitting is: the model memorizes the noise in the training data and fails on data it has not seen. In deep networks the problem is much sharper — millions of parameters, seemingly limitless memorization capacity.</p>'

+ '<div class="calc-highlight"><strong>Symptom:</strong> Training loss keeps decreasing while validation loss has stalled, or even started to rise. Beyond this point the model can no longer generalize.</div>'

+ '<p class="l-text"><strong>The spectrum of solutions:</strong> (1) <em>constrain the parameters</em> — weight decay, smaller model. (2) <em>force the parameters to be randomly perturbed</em> — dropout. (3) <em>grow the data</em> — augmentation. (4) <em>stop at the right moment</em> — early stopping. (5) <em>stabilize activations</em> — batch/layer norm.</p>'

+ '<h2 class="l-title">2. L2 Regularization (Weight Decay)</h2>'

+ '<p class="l-text">Add a penalty proportional to the sum of squared weights to the loss function:</p>'

+ '<div class="katex-block">$$L_{\\text{total}} = L_{\\text{data}}(\\theta) + \\frac{\\lambda}{2} \\|\\theta\\|^2$$</div>'

+ '<p class="l-text"><em>λ</em> = regularization strength (typically 10⁻⁴ – 10⁻²). When you take the derivative an extra term appears in every update:</p>'

+ '<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\eta (\\nabla L_{\\text{data}} + \\lambda \\theta_t) = (1 - \\eta \\lambda)\\theta_t - \\eta \\nabla L_{\\text{data}}$$</div>'

+ '<p class="l-text">At every step the weight is shrunk by a small fraction — that is, "decay". Hence the name <strong>weight decay</strong>. The effect: penalizes unnecessarily large weights and biases the model toward simpler functions.</p>'

+ '<p class="l-text">In PyTorch as an optimizer parameter: <code>AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)</code>. In <a href="/tutorials/deep/4">Lesson 4</a> we saw why AdamW does this correctly.</p>'

+ '<h2 class="l-title">3. L1 Regularization</h2>'

+ '<div class="katex-block">$$L_{\\text{total}} = L_{\\text{data}}(\\theta) + \\lambda \\|\\theta\\|_1 = L_{\\text{data}}(\\theta) + \\lambda \\sum_i |\\theta_i|$$</div>'

+ '<p class="l-text">Absolute value penalty. Unlike L2, it drives weights all the way to <em>zero</em> — producing sparse models. Rarely used in image/text classification; popular in scenarios that require feature selection. In deep learning L2 is usually enough.</p>'

+ '<h2 class="l-title">4. Dropout — The Most Effective Trick</h2>'

+ '<p class="l-text"><strong>Hinton 2012:</strong> During training zero out neurons at random with probability <em>p</em> in every batch. At inference (test) time use all of them, but multiply activations by (1-p).</p>'

+ '<div class="katex-block">$$h_{\\text{train}} = m \\odot h, \\quad m_i \\sim \\text{Bernoulli}(1-p)$$</div>'

+ '<p class="l-text"><em>p = 0.5</em> classic for FC layers; 0.1–0.2 in CNNs; 0.1 after attention in Transformers.</p>'

+ '<div class="calc-example"><div class="example-label">PYTORCH</div><div class="example-body"><div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\nmodel = nn.<span class="fn">Sequential</span>(\n    nn.<span class="fn">Linear</span>(<span class="num">784</span>, <span class="num">256</span>),\n    nn.<span class="fn">ReLU</span>(),\n    nn.<span class="fn">Dropout</span>(p=<span class="num">0.5</span>),         <span class="cm"># half zeroed at random</span>\n    nn.<span class="fn">Linear</span>(<span class="num">256</span>, <span class="num">128</span>),\n    nn.<span class="fn">ReLU</span>(),\n    nn.<span class="fn">Dropout</span>(p=<span class="num">0.5</span>),\n    nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">10</span>),\n)\n\nmodel.<span class="fn">train</span>()  <span class="cm"># dropout ACTIVE</span>\nmodel.<span class="fn">eval</span>()   <span class="cm"># dropout OFF (automatic)</span></code></pre></div></div></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Dropout between two hidden layers. When <code>model.train()</code> is called dropout is active (training mode); when <code>model.eval()</code> is called it turns off (test/validation mode). Forgetting this mode switch is a very common mistake.</p>'

+ '<p class="l-text"><strong>Intuition:</strong> Dropout acts as if you train a different sub-network in every batch. At test time the "average" of these thousands of sub-networks runs — an implicit ensemble. No single neuron can rely on being the only carrier of a feature; each one has a backup.</p>'

+ '<h2 class="l-title">5. Early Stopping</h2>'

+ '<p class="l-text">The simplest regularization. Measure validation loss every epoch; stop training when improvement stalls and save the best model.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code>best_val_loss = <span class="fn">float</span>(<span class="str">"inf"</span>)\npatience, bad_epochs = <span class="num">5</span>, <span class="num">0</span>\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">100</span>):\n    <span class="fn">train_one_epoch</span>(model, train_loader)\n    val_loss = <span class="fn">evaluate</span>(model, val_loader)\n    <span class="kw">if</span> val_loss &lt; best_val_loss:\n        best_val_loss = val_loss\n        torch.<span class="fn">save</span>(model.<span class="fn">state_dict</span>(), <span class="str">"best.pt"</span>)\n        bad_epochs = <span class="num">0</span>\n    <span class="kw">else</span>:\n        bad_epochs += <span class="num">1</span>\n        <span class="kw">if</span> bad_epochs &gt;= patience:\n            <span class="fn">print</span>(<span class="str">f"Early stop at epoch {epoch}"</span>)\n            <span class="kw">break</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Targets 100 epochs but stops if val loss does not improve for 5 epochs. <em>patience</em> = patience: do not be affected by short oscillations. On every improvement save the model to disk — guarantee that the best is used, not the last.</p>'

+ '<h2 class="l-title">6. Data Augmentation</h2>'

+ '<p class="l-text">Artificially grow your data. For images: random crop, rotation, flip, color jitter. For text: synonym replacement, back-translation. For audio: noise, pitch shift.</p>'

+ '<div class="calc-example"><div class="example-label">TORCHVISION</div><div class="example-body"><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torchvision.transforms <span class="kw">as</span> T\n\ntrain_tf = T.<span class="fn">Compose</span>([\n    T.<span class="fn">RandomCrop</span>(<span class="num">28</span>, padding=<span class="num">4</span>),\n    T.<span class="fn">RandomHorizontalFlip</span>(),\n    T.<span class="fn">RandomRotation</span>(<span class="num">15</span>),\n    T.<span class="fn">ColorJitter</span>(brightness=<span class="num">0.2</span>, contrast=<span class="num">0.2</span>),\n    T.<span class="fn">ToTensor</span>(),\n    T.<span class="fn">Normalize</span>((<span class="num">0.1307</span>,), (<span class="num">0.3081</span>,)),  <span class="cm"># MNIST mean/std</span>\n])\n\nval_tf = T.<span class="fn">Compose</span>([\n    T.<span class="fn">ToTensor</span>(),\n    T.<span class="fn">Normalize</span>((<span class="num">0.1307</span>,), (<span class="num">0.3081</span>,)),  <span class="cm"># NO augmentation in validation</span>\n])</code></pre></div></div></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Each image in the training set appears in a different variant every epoch — instead of memorizing the original, the model is forced to learn the <em>general</em> features of the class. No augmentation in validation; we want to measure the real distribution.</p>'

+ '<p class="l-text"><strong>Modern techniques:</strong> Mixup (linearly mix two examples), CutMix (paste a piece of one image onto another), RandAugment (random combinations). These give 1-3% accuracy gains on large models.</p>'

+ '<h2 class="l-title">7. The Internal Covariate Shift Problem</h2>'

+ '<p class="l-text">In a deep network the input distribution to each layer drifts as training progresses — when lower layers change, upper layers must constantly adapt to a new distribution. This slows training.</p>'

+ '<p class="l-text"><strong>The fix:</strong> <em>Normalize</em> each layer\'s input. Make its mean 0 and variance 1 (then apply a learnable scale and shift).</p>'

+ '<h2 class="l-title">8. Batch Normalization</h2>'

+ '<p class="l-text"><strong>Ioffe &amp; Szegedy 2015.</strong> Inside a mini-batch, normalize each feature (each activation channel) across the batch:</p>'

+ '<div class="katex-block">$$\\mu_B = \\frac{1}{m}\\sum_{i=1}^m x_i, \\quad \\sigma_B^2 = \\frac{1}{m}\\sum_{i=1}^m (x_i - \\mu_B)^2$$</div>'

+ '<div class="katex-block">$$\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}, \\quad y_i = \\gamma \\hat{x}_i + \\beta$$</div>'

+ '<p class="l-text"><em>γ</em> and <em>β</em> are learnable parameters — the model can "undo" the normalization if it wants. <em>ε</em> for numerical stability (10⁻⁵).</p>'

+ '<p class="l-text"><strong>At test time:</strong> With a single example we cannot take the batch mean. Solution: store the running average of <em>μ</em> and <em>σ²</em> from every batch during training, use them at test time. PyTorch <code>nn.BatchNorm1d</code> / <code>BatchNorm2d</code> does this automatically.</p>'

+ '<p class="l-text"><strong>Benefits:</strong></p>'

+ '<ul class="l-list">'
+ '<li>Higher learning rates can be used → faster training.</li>'
+ '<li>Mitigates vanishing gradient.</li>'
+ '<li>Mild regularization effect (in-batch noise).</li>'
+ '<li>Reduces sensitivity to weight initialization.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>Its problem:</strong> If the batch size is small (e.g. 1-4) the statistics are unreliable. In sequential models like RNN/Transformer the batch size is not fixed — BatchNorm becomes hard. Hence <strong>LayerNorm</strong> was born.</p>'

+ '<h2 class="l-title">9. Layer Normalization</h2>'

+ '<p class="l-text"><strong>Ba, Kiros &amp; Hinton 2016.</strong> Same idea, but the mean-variance is computed <em>per example</em> — normalized across features rather than across the batch.</p>'

+ '<div class="katex-block">$$\\mu_i = \\frac{1}{H}\\sum_{j=1}^H x_{i,j}, \\quad \\sigma_i^2 = \\frac{1}{H}\\sum_{j=1}^H (x_{i,j} - \\mu_i)^2$$</div>'

+ '<p class="l-text"><em>H</em> = number of activations (feature dimension). Each example has its own statistics — no dependence on the batch. Hence the standard in Transformers (Lesson 9) and RNNs (Lesson 8).</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">BatchNorm</div><div class="card-body">In CNNs, with fixed-size inputs. ResNet, VGG, EfficientNet all use BN. Batch ≥ 16 recommended.</div></div>'
+ '<div class="calc-card"><div class="card-title">LayerNorm</div><div class="card-body">The standard in Transformers and RNNs. Batch size does not matter. BERT, GPT, ViT all use LN.</div></div>'
+ '<div class="calc-card"><div class="card-title">GroupNorm</div><div class="card-body">Split channels into groups, normalize within each group. Popular in detection/segmentation models that require small batches (1-4).</div></div>'
+ '<div class="calc-card"><div class="card-title">InstanceNorm</div><div class="card-body">Normalize per example + per channel separately. Common in style transfer/GANs.</div></div>'
+ '</div>'

+ '<h2 class="l-title">10. The Order in Practice</h2>'

+ '<p class="l-text">"Linear → Norm → Activation → Dropout" is the most common order. A modern block:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># Classic MLP block</span>\nblock = nn.<span class="fn">Sequential</span>(\n    nn.<span class="fn">Linear</span>(d_in, d_out),\n    nn.<span class="fn">LayerNorm</span>(d_out),\n    nn.<span class="fn">GELU</span>(),\n    nn.<span class="fn">Dropout</span>(<span class="num">0.1</span>),\n)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> A linear transformation followed by LayerNorm — fixes the activation distribution. GELU activation (Lesson 2). Dropout last — random masking on the activation values.</p>'

+ '<p class="l-text">In a CNN:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># Classic CNN block</span>\nblock = nn.<span class="fn">Sequential</span>(\n    nn.<span class="fn">Conv2d</span>(c_in, c_out, kernel_size=<span class="num">3</span>, padding=<span class="num">1</span>),\n    nn.<span class="fn">BatchNorm2d</span>(c_out),\n    nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Conv → BatchNorm → ReLU. ResNet and EfficientNet build on this pattern. Dropout is used less in CNNs; BN\'s own regularization effect is sufficient.</p>'

+ '<h2 class="l-title">11. Bias-Variance Trade-off Visualization</h2>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l5-tradeoff-en"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l5-tradeoff-en"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var ep=[];for(var i=0;i<=50;i++)ep.push(i);var train=ep.map(function(i){return 2.3*Math.exp(-i/8)+0.05;});var valNoReg=ep.map(function(i){var base=2.3*Math.exp(-i/12)+0.4;return i>15?base+(i-15)*0.025:base;});var valReg=ep.map(function(i){return 2.3*Math.exp(-i/14)+0.35;});var traces=[{x:ep,y:train,mode:"lines",name:"Train",line:{color:hex2rgba(th.accent,0.6),width:2}},{x:ep,y:valNoReg,mode:"lines",name:"Val (no regularization)",line:{color:hex2rgba(th.accent,0.4),width:2,dash:"dash"}},{x:ep,y:valReg,mode:"lines",name:"Val (Dropout + WeightDecay)",line:{color:th.accent,width:3}}];Plotly.newPlot("dl-l5-tradeoff-en",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{title:{text:"Epoch",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},yaxis:{title:{text:"Loss",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},margin:{t:50,r:30,b:60,l:60},height:360,legend:{font:{color:th.text}},title:{text:"Effect of regularization on validation loss (illustrative)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Dashed line: no regularization — train decreases, val starts to climb after ~epoch 15 (overfitting). Solid line: dropout + weight decay — val keeps decreasing for longer, final value is better.</p>'

+ '<h2 class="l-title">12. Which One When?</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Small dataset (&lt; 10k)</div><div class="card-body">Augmentation, dropout 0.5, weight decay 1e-4, early stopping is essential. Growing the data > shrinking the model.</div></div>'
+ '<div class="calc-card"><div class="card-title">Medium dataset (10k–1M)</div><div class="card-body">Light dropout (0.1–0.2), weight decay 1e-4, BN/LN. Augmentation is very helpful.</div></div>'
+ '<div class="calc-card"><div class="card-title">Large dataset (1M+)</div><div class="card-body">Less regularization needed; overfitting is hard. Weight decay is enough, dropout optional. BN/LN for normalization.</div></div>'
+ '<div class="calc-card"><div class="card-title">Transformer / NLP</div><div class="card-body">LayerNorm + Dropout 0.1 + weight decay 0.01 (with AdamW). The standard combo.</div></div>'
+ '</div>'

+ '<div class="think-box"><strong>📌 In summary:</strong> Regularization = preventing memorization; Normalization = stabilizing the flow. In a modern deep network they are woven layer by layer: Linear → Norm → Activation → Dropout. The right combination depends on the model + data + task triple. <strong>Next lesson: CNNs.</strong> Moving on to the first real architecture — why FC layers are not enough for images, what convolution is, how it works.</div>'

};
