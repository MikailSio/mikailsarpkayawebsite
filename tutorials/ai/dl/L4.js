/* dl-new-L4.js — Deep Learning Lesson 4: Optimizasyon & Eğitim Dinamiği (TR + EN) */
var DL_L4 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Gradyanı çıkardık (<a href="/tutorials/ai/dl/backpropagation-computational-graphs">Ders 3</a>); şimdi onu nasıl kullanacağız? Vanilya SGD\'den modern optimizer\'lara: momentum, RMSProp, Adam, AdamW. Learning rate\'in pratikte nasıl seçileceği, scheduler\'lar (cosine, warmup), batch size etkisi. Loss landscape\'in ne anlama geldiği — eğitimin neden her zaman düzgün gitmediği.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Batch, mini-batch ve stokastik gradient descent\'i hız ve gürültü açısından karşılaştıracaksın</li><li>Momentum, RMSProp, Adam ve AdamW güncelleme kurallarını çıkaracaksın</li><li>Learning rate finder ile MNIST için iyi bir LR aralığı seçeceksin</li><li>Cosine annealing ve warmup scheduler\'larını PyTorch eğitim döngüsünde uygulayacaksın</li><li>Train/val loss eğrilerini okuyup overfit ve LR sorunlarını teşhis edeceksin</li></ul></div>'

+ '<h2 class="l-title">1. Gradient Descent\'i Hatırlatma</h2>'

+ '<p class="l-text">Gradyan, kayıp fonksiyonunun en hızlı arttığı yön. Tersine bir adım atarsak kayıp azalır:</p>'

+ '<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)$$</div>'

+ '<p class="l-text"><em>θ</em> = tüm ağırlıklar (W ve b\'ler), <em>η</em> = learning rate (öğrenme oranı). Çok basit bir kural — ama tek başına derin ağda yetersiz. Üç pratik problemi var: <strong>(1)</strong> tüm veri seti üzerinde gradyan hesaplamak çok pahalı, <strong>(2)</strong> kayıp yüzeyi pürüzlü, salınımlı, <strong>(3)</strong> learning rate\'i ayarlamak zor.</p>'

+ '<h2 class="l-title">2. Batch, Mini-Batch ve Stokastik</h2>'

+ '<p class="l-text">60.000 MNIST örneğinde gradyanı hesaplamak için her adımda hepsini birden işlemek mantıksız. Üç varyant var:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Batch GD</div><div class="card-body">Her adımda <em>tüm</em> veri seti. Doğru gradyan, ama yavaş ve büyük bellek. Pratik değil.</div></div>'
+ '<div class="calc-card"><div class="card-title">Stochastic GD (SGD)</div><div class="card-body">Her adımda <em>tek</em> örnek. Hızlı, gürültülü gradyan. Saplandığı lokal minimumlardan kurtulabilir, ama kararsız.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mini-batch GD</div><div class="card-body">Her adımda <em>32–512</em> örnek. Pratik denge: GPU paralelliğini kullanır, gradyan az gürültülüdür. Modern derin öğrenmenin standardı.</div></div>'
+ '</div>'

+ '<p class="l-text">"SGD" terimi pratikte <em>mini-batch SGD</em>\'yi ifade eder; saf tek-örnekli SGD nadiren kullanılır. Ders 3\'teki PyTorch döngüsünü hatırla: <code>for x_batch, y_batch in dataloader</code> — her batch bir adım.</p>'

+ '<h2 class="l-title">3. Vanilla SGD\'nin Sorunları</h2>'

+ '<p class="l-text">Sadece <em>θ ← θ - η·∇L</em> ile sıkıntılar:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Salınım:</strong> Dik vadi şeklindeki kayıp yüzeyinde (örn. uzun bir kanyon), gradyan vadinin duvarlarına çapraz bakar. Adımlar zikzak çizer, ilerleme yavaş.</li>'
+ '<li><strong>Yavaş plato:</strong> Yüzey neredeyse düzse gradyan küçük, adımlar minik — eğitim takılır.</li>'
+ '<li><strong>Lokal minimum / saddle point:</strong> Yüksek boyutlu uzayda saddle point\'ler (eyer noktaları) çok yaygın; gradyan sıfırlanır ama global minimum değildir.</li>'
+ '</ul>'

+ '<p class="l-text">Çözüm fikri: <strong>momentum</strong>. Bir önceki adımın hızını hatırla, ona ekle. Fizikteki kütle gibi — yön sürekli değişmeyen koridorlarda hızlanır, gürültülü yönlerde dengelenir.</p>'

+ '<h2 class="l-title">4. Momentum</h2>'

+ '<div class="katex-block">$$v_{t+1} = \\beta v_t + \\nabla L(\\theta_t), \\quad \\theta_{t+1} = \\theta_t - \\eta v_{t+1}$$</div>'

+ '<p class="l-text"><em>v</em> = "hız" vektörü, gradyanların üstel hareketli ortalaması. <em>β</em> = momentum katsayısı (tipik 0.9). Her adımda hızın %90\'ını koru, %10\'una yeni gradyanı ekle.</p>'

+ '<p class="l-text"><strong>Sezgi:</strong> Vadi boyunca aynı yönde gradyanlar geliyorsa, hız birikir, paralel yöne hızla ilerlersin. Salınımlı yan yönlerde ardışık gradyanlar birbirini iptal eder, hız sönümlenir.</p>'

+ '<div class="calc-example"><div class="example-label">NESTEROV MOMENTUM</div><div class="example-body">'
+ '<p class="l-text">Standart momentumun küçük bir geliştirilmiş hali: gradyanı <em>θ</em>\'da değil, <em>θ - η·β·v</em>\'de hesapla — yani "momentum yönünde bir adım önden bak". Yüksek learning rate\'lerde daha kararlı.</p>'
+ '<div class="katex-block">$$v_{t+1} = \\beta v_t + \\nabla L(\\theta_t - \\eta \\beta v_t)$$</div>'
+ '</div></div>'

+ '<h2 class="l-title">5. AdaGrad ve RMSProp — Adaptif Learning Rate</h2>'

+ '<p class="l-text">Farklı parametrelerin farklı hızda öğrenmeye ihtiyacı var. Sık güncellenen ağırlıklar küçük adım, nadir güncellenenler büyük adım istesin. <strong>AdaGrad</strong> bunu şöyle yapar: her parametrenin kümülatif kare gradyanını tut, learning rate\'i ona böl.</p>'

+ '<div class="katex-block">$$G_t = G_{t-1} + (\\nabla L_t)^2, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{G_t} + \\epsilon} \\nabla L_t$$</div>'

+ '<p class="l-text">Sorun: <em>G</em> sürekli büyür, learning rate sıfıra iner — uzun eğitimde donar. <strong>RMSProp</strong> çözümü: kümülatif toplam yerine üstel hareketli ortalama kullan:</p>'

+ '<div class="katex-block">$$G_t = \\gamma G_{t-1} + (1 - \\gamma)(\\nabla L_t)^2$$</div>'

+ '<p class="l-text"><em>γ ≈ 0.9</em>. Eski gradyanlar zamanla unutulur, learning rate canlı kalır. RNN eğitiminde (Ders 8) standartlardan biri.</p>'

+ '<h2 class="l-title">6. Adam — Modern Standart</h2>'

+ '<p class="l-text"><strong>Adam (Adaptive Moment Estimation)</strong> momentum + RMSProp birleşimi. 2014\'te yayınlandı, hızla "varsayılan" oldu. İki üstel ortalama tut: <em>m</em> = gradyanların ortalaması (1. moment, momentum), <em>v</em> = gradyan karelerinin ortalaması (2. moment, RMSProp).</p>'

+ '<div class="katex-block">$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) \\nabla L_t$$</div>'
+ '<div class="katex-block">$$v_t = \\beta_2 v_{t-1} + (1-\\beta_2) (\\nabla L_t)^2$$</div>'

+ '<p class="l-text">İlk birkaç adımda <em>m</em> ve <em>v</em> sıfıra yakın olur (cold start). Bias düzeltmesi:</p>'

+ '<div class="katex-block">$$\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}$$</div>'

+ '<p class="l-text">Sonunda update:</p>'

+ '<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$</div>'

+ '<p class="l-text"><strong>Tipik hiperparametreler:</strong> β₁ = 0.9, β₂ = 0.999, ε = 10⁻⁸, η = 10⁻³ (veya 3×10⁻⁴ — Karpathy\'nin "ezber" değeri). Adam genellikle "out of the box" çalışır; ilk denemen Adam olsun.</p>'

+ '<h2 class="l-title">7. AdamW — Modern Modern</h2>'

+ '<p class="l-text">Adam\'da L2 regularization (weight decay) doğru uygulanmaz — bias düzeltmesiyle etkileşir. <strong>AdamW</strong> (2017) weight decay\'i ayrı bir adım olarak yapar:</p>'

+ '<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\eta \\left( \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon} + \\lambda \\theta_t \\right)$$</div>'

+ '<p class="l-text"><em>λ</em> = weight decay katsayısı (tipik 0.01). Modern Transformer eğitiminde (BERT, GPT, ViT) varsayılan optimizer\'dır. PyTorch\'ta <code>torch.optim.AdamW</code>.</p>'

+ '<h2 class="l-title">8. Optimizer Karşılaştırma — Bir Bakışta</h2>'

+ '<div class="calc-graph" style="height:440px"><div id="dl-l4-opt"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l4-opt"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var ep=[];for(var i=0;i<=50;i++)ep.push(i);var sgd=ep.map(function(i){return 2.3*Math.exp(-i/30)+0.6+0.05*Math.sin(i/3);});var mom=ep.map(function(i){return 2.3*Math.exp(-i/22)+0.5+0.03*Math.sin(i/3);});var rms=ep.map(function(i){return 2.3*Math.exp(-i/18)+0.45;});var adm=ep.map(function(i){return 2.3*Math.exp(-i/15)+0.35;});var traces=[{x:ep,y:sgd,mode:"lines",name:"SGD",line:{color:hex2rgba(th.accent,0.4),width:2}},{x:ep,y:mom,mode:"lines",name:"Momentum",line:{color:hex2rgba(th.accent,0.6),width:2}},{x:ep,y:rms,mode:"lines",name:"RMSProp",line:{color:hex2rgba(th.accent,0.8),width:2}},{x:ep,y:adm,mode:"lines",name:"Adam",line:{color:th.accent,width:3}}];Plotly.newPlot("dl-l4-opt",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{title:{text:"Epoch",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},yaxis:{title:{text:"Eğitim kaybı",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},margin:{t:50,r:30,b:60,l:60},height:420,legend:{font:{color:th.text}},title:{text:"Aynı problemde 4 optimizer (temsili)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Adam genellikle en hızlı yakınsar ama her zaman en iyi <em>generalization</em> demek değildir. Bazı imaj modellerinde iyi tunlanmış SGD+Momentum (Nesterov) hâlâ Adam\'ı geçer. CV/NLP literatüründe pratik kural: <strong>Transformer/NLP → AdamW; ResNet/imaj → SGD+Momentum</strong>.</p>'

+ '<h2 class="l-title">9. Learning Rate — En Önemli Hiperparametre</h2>'

+ '<p class="l-text">Sadece bir hiperparametre seçeceksen, η\'yi seç. Üç senaryo:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Çok küçük η</div><div class="card-body">Eğitim çok yavaş, kayıp düz iniyor ama hiç dibe vurmuyor. Saatlerce bekledikten sonra hâlâ ilerleme var.</div></div>'
+ '<div class="calc-card"><div class="card-title">Doğru η</div><div class="card-body">Kayıp ilk birkaç epoch\'ta hızla düşer, sonra plato, sonra tekrar küçük iniş. İdeal eğri.</div></div>'
+ '<div class="calc-card"><div class="card-title">Çok büyük η</div><div class="card-body">Kayıp ilk batch\'te NaN olur veya artmaya başlar. Adımlar minimumun üzerinden zıplıyor.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Pratik öneriler:</strong></p>'

+ '<ul class="l-list">'
+ '<li>Adam için varsayılan: <em>η = 3 × 10⁻⁴</em>. Bunu deneyip oradan ayar yap.</li>'
+ '<li>SGD+Momentum için: <em>η = 0.1</em> başlangıç, model ResNet ise standart.</li>'
+ '<li><strong>LR Range Test:</strong> η\'yi 10⁻⁷\'den 1\'e logaritmik artırarak çalıştır, kaybın en hızlı düştüğü η\'yi seç (Smith 2017).</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Learning Rate Scheduling</h2>'

+ '<p class="l-text">Sabit η optimal değil. Başta büyük adım, sonunda küçük adım istiyoruz — büyükle hızlı yakınsa, küçükle hassas dibe in. Üç popüler scheduler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Step decay:</strong> Her N epoch\'ta η\'yi yarıya böl. Klasik, kolay.</li>'
+ '<li><strong>Cosine annealing:</strong> η\'yi başlangıç değerinden 0\'a kosinüs eğrisiyle azalt. Modern Transformer eğitiminin standardı.</li>'
+ '<li><strong>Warmup + cosine:</strong> İlk 1000-10000 adım η\'yi 0\'dan tepe değere lineer artır, sonra cosine ile düşür. Büyük modellerde (BERT, GPT) zorunlu.</li>'
+ '</ul>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l4-sched"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l4-sched"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var st=[];for(var i=0;i<=100;i++)st.push(i);var step=st.map(function(i){return 1e-3*Math.pow(0.5,Math.floor(i/30));});var cos=st.map(function(i){return 1e-3*0.5*(1+Math.cos(Math.PI*i/100));});var warm=st.map(function(i){if(i<10)return 1e-3*(i/10);return 1e-3*0.5*(1+Math.cos(Math.PI*(i-10)/90));});var traces=[{x:st,y:step,mode:"lines",name:"Step decay",line:{color:hex2rgba(th.accent,0.5),width:2}},{x:st,y:cos,mode:"lines",name:"Cosine",line:{color:hex2rgba(th.accent,0.8),width:2}},{x:st,y:warm,mode:"lines",name:"Warmup + Cosine",line:{color:th.accent,width:3}}];Plotly.newPlot("dl-l4-sched",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{title:{text:"Epoch",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},yaxis:{title:{text:"Learning rate",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text,exponentformat:"e"},margin:{t:50,r:30,b:60,l:80},height:360,legend:{font:{color:th.text}},title:{text:"Learning rate scheduler\'ları",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<h2 class="l-title">11. Pratik PyTorch Eğitim Döngüsü</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n<span class="kw">from</span> torch.optim <span class="kw">import</span> AdamW\n<span class="kw">from</span> torch.optim.lr_scheduler <span class="kw">import</span> CosineAnnealingLR\n\nmodel = <span class="fn">MyMLP</span>()  <span class="cm"># Ders 1\'den</span>\ncriterion = nn.<span class="fn">CrossEntropyLoss</span>()\noptimizer = <span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e</span>-<span class="num">4</span>, weight_decay=<span class="num">0.01</span>)\nscheduler = <span class="fn">CosineAnnealingLR</span>(optimizer, T_max=<span class="num">10</span>)  <span class="cm"># 10 epoch</span>\n\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):\n    model.<span class="fn">train</span>()\n    <span class="kw">for</span> x_batch, y_batch <span class="kw">in</span> train_loader:\n        optimizer.<span class="fn">zero_grad</span>()\n        logits = <span class="fn">model</span>(x_batch)\n        loss = <span class="fn">criterion</span>(logits, y_batch)\n        loss.<span class="fn">backward</span>()\n        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)  <span class="cm"># exploding gradient koruması</span>\n        optimizer.<span class="fn">step</span>()\n    scheduler.<span class="fn">step</span>()  <span class="cm"># epoch sonunda LR güncelle</span>\n    <span class="fn">print</span>(<span class="str">f"Epoch {epoch}: lr={scheduler.get_last_lr()[0]:.6f}, loss={loss.item():.4f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> AdamW optimizer\'ı (weight decay 0.01 ile), her epoch sonunda cosine ile düşen LR. <code>clip_grad_norm_</code> gradyan normunu 1.0\'a sınırlar — exploding gradient koruması (Ders 3\'te gördük). <code>scheduler.step()</code> epoch başına bir kez (bazı scheduler\'lar batch başına çağırır — dokümantasyona bak).</p>'

+ '<h2 class="l-title">12. Batch Size Etkisi</h2>'

+ '<p class="l-text">Sıkça karıştırılan konu. Daha büyük batch ≠ otomatik daha iyi.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Küçük batch (32-64):</strong> Gürültülü gradyan, lokal minimumlardan kaçma yeteneği, daha iyi generalization (deneysel).</li>'
+ '<li><strong>Büyük batch (1024+):</strong> Hızlı per-epoch (paralel), ama "sharp minima"ya saplanma eğilimi. Aynı LR ile küçük batch kadar iyi öğrenmez.</li>'
+ '<li><strong>Linear scaling kuralı:</strong> Batch\'i 2× yaparsan η\'yi de 2× yap (yaklaşık). Goyal et al. 2017 büyük modellerde gösterdi.</li>'
+ '</ul>'

+ '<p class="l-text">Pratik: 32, 64, 128, 256 — VRAM\'in izin verdiği kadar. Modern büyük modellerde 4096+ batch ama o seviyede LR scheduling, warmup, gradient accumulation gibi tekniklerle dengelenir.</p>'

+ '<h2 class="l-title">13. Eğitim Eğrilerini Okumak</h2>'

+ '<p class="l-text">Tensorboard veya Weights &amp; Biases\'te şunlara bak:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Train loss düz, val loss düz</div><div class="card-body"><strong>Underfitting.</strong> Model kapasitesi yetersiz, η çok küçük, veya yanlış mimari. Daha derin/geniş ağ dene, η artır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Train düşüyor, val sabit</div><div class="card-body"><strong>Overfitting.</strong> Ders 5\'in konusu. Dropout, weight decay, daha çok veri, augmentation.</div></div>'
+ '<div class="calc-card"><div class="card-title">Loss aniden NaN</div><div class="card-body">Exploding gradient. Gradient clipping, daha küçük η, mixed precision\'ı kontrol et.</div></div>'
+ '<div class="calc-card"><div class="card-title">Loss salınıyor</div><div class="card-body">η çok büyük. Yarıya indir. Veya batch size artır.</div></div>'
+ '</div>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> Modern derin öğrenmede ezber kombo: <strong>AdamW + cosine schedule + warmup + gradient clipping</strong>. Bu setup Transformer\'lar için, ResNet\'ler için SGD+Momentum + step decay daha popüler. <strong>Bir sonraki ders: Regularization & Normalization.</strong> Eğitim eğrisinde overfitting gördük — şimdi onunla nasıl savaşacağız: dropout, batch norm, layer norm, weight decay, data augmentation.</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> We extracted the gradient (<a href="/tutorials/ai/dl/backpropagation-computational-graphs">Lesson 3</a>); now how do we use it? From vanilla SGD to modern optimizers: momentum, RMSProp, Adam, AdamW. How to pick a learning rate in practice, schedulers (cosine, warmup), and the effect of batch size. What the loss landscape means — why training does not always go smoothly.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Compare batch, mini-batch and stochastic gradient descent in terms of speed and noise</li><li>Derive the update rules of momentum, RMSProp, Adam and AdamW</li><li>Pick a good LR range for MNIST using the learning rate finder</li><li>Apply cosine annealing and warmup schedulers in a PyTorch training loop</li><li>Read train/val loss curves to diagnose overfitting and LR issues</li></ul></div>'

+ '<h2 class="l-title">1. Gradient Descent — Recap</h2>'

+ '<p class="l-text">The gradient is the direction in which the loss function increases fastest. If we step in the opposite direction, the loss decreases:</p>'

+ '<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)$$</div>'

+ '<p class="l-text"><em>θ</em> = all weights (Ws and bs), <em>η</em> = learning rate. A very simple rule — but on its own insufficient for deep networks. It has three practical problems: <strong>(1)</strong> computing the gradient over the entire dataset is too expensive, <strong>(2)</strong> the loss surface is rough and oscillatory, <strong>(3)</strong> the learning rate is hard to tune.</p>'

+ '<h2 class="l-title">2. Batch, Mini-Batch and Stochastic</h2>'

+ '<p class="l-text">Processing all 60,000 MNIST examples at once to compute the gradient is unreasonable. Three variants:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Batch GD</div><div class="card-body">The <em>entire</em> dataset at every step. Exact gradient, but slow and memory-hungry. Not practical.</div></div>'
+ '<div class="calc-card"><div class="card-title">Stochastic GD (SGD)</div><div class="card-body">A <em>single</em> example at every step. Fast, noisy gradient. Can escape local minima it gets stuck in, but unstable.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mini-batch GD</div><div class="card-body"><em>32–512</em> examples per step. The practical balance: leverages GPU parallelism, gradient is mildly noisy. The standard in modern deep learning.</div></div>'
+ '</div>'

+ '<p class="l-text">In practice the term "SGD" refers to <em>mini-batch SGD</em>; pure single-example SGD is rarely used. Recall the PyTorch loop from Lesson 3: <code>for x_batch, y_batch in dataloader</code> — each batch is one step.</p>'

+ '<h2 class="l-title">3. Issues with Vanilla SGD</h2>'

+ '<p class="l-text">Just <em>θ ← θ - η·∇L</em> has problems:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Oscillation:</strong> On a steep-valley loss surface (e.g. a long canyon), the gradient points across the walls. Steps zigzag, progress is slow.</li>'
+ '<li><strong>Slow plateau:</strong> If the surface is nearly flat the gradient is tiny, steps are minuscule — training stalls.</li>'
+ '<li><strong>Local minimum / saddle point:</strong> In high-dimensional space saddle points are very common; the gradient vanishes but it is not the global minimum.</li>'
+ '</ul>'

+ '<p class="l-text">The fix: <strong>momentum</strong>. Remember the velocity from the previous step and add to it. Like mass in physics — accelerates in corridors where direction is consistent, dampens in noisy directions.</p>'

+ '<h2 class="l-title">4. Momentum</h2>'

+ '<div class="katex-block">$$v_{t+1} = \\beta v_t + \\nabla L(\\theta_t), \\quad \\theta_{t+1} = \\theta_t - \\eta v_{t+1}$$</div>'

+ '<p class="l-text"><em>v</em> = "velocity" vector, an exponential moving average of the gradients. <em>β</em> = momentum coefficient (typically 0.9). At each step keep 90% of the velocity, add 10% of the new gradient.</p>'

+ '<p class="l-text"><strong>Intuition:</strong> If gradients keep coming in the same direction along a valley, velocity builds up and you race forward in the parallel direction. In oscillatory side directions consecutive gradients cancel each other and velocity dampens.</p>'

+ '<div class="calc-example"><div class="example-label">NESTEROV MOMENTUM</div><div class="example-body">'
+ '<p class="l-text">A small improvement on standard momentum: compute the gradient not at <em>θ</em>, but at <em>θ - η·β·v</em> — that is, "look one step ahead in the direction of momentum". More stable at high learning rates.</p>'
+ '<div class="katex-block">$$v_{t+1} = \\beta v_t + \\nabla L(\\theta_t - \\eta \\beta v_t)$$</div>'
+ '</div></div>'

+ '<h2 class="l-title">5. AdaGrad and RMSProp — Adaptive Learning Rate</h2>'

+ '<p class="l-text">Different parameters need to learn at different speeds. Frequently updated weights should take small steps; rarely updated ones should take big steps. <strong>AdaGrad</strong> does this by accumulating the squared gradients per parameter and dividing the learning rate by it:</p>'

+ '<div class="katex-block">$$G_t = G_{t-1} + (\\nabla L_t)^2, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{G_t} + \\epsilon} \\nabla L_t$$</div>'

+ '<p class="l-text">Problem: <em>G</em> grows without bound, the learning rate goes to zero — long training stalls. <strong>RMSProp</strong>\'s solution: replace the cumulative sum with an exponential moving average:</p>'

+ '<div class="katex-block">$$G_t = \\gamma G_{t-1} + (1 - \\gamma)(\\nabla L_t)^2$$</div>'

+ '<p class="l-text"><em>γ ≈ 0.9</em>. Old gradients are forgotten over time, the learning rate stays alive. One of the standards for RNN training (Lesson 8).</p>'

+ '<h2 class="l-title">6. Adam — The Modern Standard</h2>'

+ '<p class="l-text"><strong>Adam (Adaptive Moment Estimation)</strong> combines momentum + RMSProp. Published in 2014, it quickly became the "default". Maintain two exponential averages: <em>m</em> = mean of the gradients (1st moment, momentum), <em>v</em> = mean of squared gradients (2nd moment, RMSProp).</p>'

+ '<div class="katex-block">$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) \\nabla L_t$$</div>'
+ '<div class="katex-block">$$v_t = \\beta_2 v_{t-1} + (1-\\beta_2) (\\nabla L_t)^2$$</div>'

+ '<p class="l-text">In the first few steps <em>m</em> and <em>v</em> are close to zero (cold start). Bias correction:</p>'

+ '<div class="katex-block">$$\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}$$</div>'

+ '<p class="l-text">Final update:</p>'

+ '<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$</div>'

+ '<p class="l-text"><strong>Typical hyperparameters:</strong> β₁ = 0.9, β₂ = 0.999, ε = 10⁻⁸, η = 10⁻³ (or 3×10⁻⁴ — Karpathy\'s "memorize this" value). Adam usually works "out of the box"; let your first attempt be Adam.</p>'

+ '<h2 class="l-title">7. AdamW — Modern Modern</h2>'

+ '<p class="l-text">L2 regularization (weight decay) is not applied correctly in Adam — it interacts with bias correction. <strong>AdamW</strong> (2017) applies weight decay as a separate step:</p>'

+ '<div class="katex-block">$$\\theta_{t+1} = \\theta_t - \\eta \\left( \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon} + \\lambda \\theta_t \\right)$$</div>'

+ '<p class="l-text"><em>λ</em> = weight decay coefficient (typically 0.01). It is the default optimizer in modern Transformer training (BERT, GPT, ViT). In PyTorch: <code>torch.optim.AdamW</code>.</p>'

+ '<h2 class="l-title">8. Optimizer Comparison — At a Glance</h2>'

+ '<div class="calc-graph" style="height:440px"><div id="dl-l4-opt-en"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l4-opt-en"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var ep=[];for(var i=0;i<=50;i++)ep.push(i);var sgd=ep.map(function(i){return 2.3*Math.exp(-i/30)+0.6+0.05*Math.sin(i/3);});var mom=ep.map(function(i){return 2.3*Math.exp(-i/22)+0.5+0.03*Math.sin(i/3);});var rms=ep.map(function(i){return 2.3*Math.exp(-i/18)+0.45;});var adm=ep.map(function(i){return 2.3*Math.exp(-i/15)+0.35;});var traces=[{x:ep,y:sgd,mode:"lines",name:"SGD",line:{color:hex2rgba(th.accent,0.4),width:2}},{x:ep,y:mom,mode:"lines",name:"Momentum",line:{color:hex2rgba(th.accent,0.6),width:2}},{x:ep,y:rms,mode:"lines",name:"RMSProp",line:{color:hex2rgba(th.accent,0.8),width:2}},{x:ep,y:adm,mode:"lines",name:"Adam",line:{color:th.accent,width:3}}];Plotly.newPlot("dl-l4-opt-en",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{title:{text:"Epoch",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},yaxis:{title:{text:"Training loss",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},margin:{t:50,r:30,b:60,l:60},height:420,legend:{font:{color:th.text}},title:{text:"4 optimizers on the same problem (illustrative)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Adam usually converges fastest but does not always mean the best <em>generalization</em>. On some image models a well-tuned SGD+Momentum (Nesterov) still beats Adam. The practical rule in CV/NLP literature: <strong>Transformer/NLP → AdamW; ResNet/image → SGD+Momentum</strong>.</p>'

+ '<h2 class="l-title">9. Learning Rate — The Most Important Hyperparameter</h2>'

+ '<p class="l-text">If you can tune only one hyperparameter, tune η. Three scenarios:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Too small η</div><div class="card-body">Training is very slow, the loss decreases steadily but never bottoms out. Hours later there is still progress to be made.</div></div>'
+ '<div class="calc-card"><div class="card-title">Right η</div><div class="card-body">Loss drops sharply in the first few epochs, then plateaus, then decreases a bit more. Ideal curve.</div></div>'
+ '<div class="calc-card"><div class="card-title">Too large η</div><div class="card-body">Loss becomes NaN in the first batch or starts to increase. Steps overshoot the minimum.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Practical advice:</strong></p>'

+ '<ul class="l-list">'
+ '<li>Default for Adam: <em>η = 3 × 10⁻⁴</em>. Try this and tune from there.</li>'
+ '<li>For SGD+Momentum: <em>η = 0.1</em> as a starting point, standard if the model is a ResNet.</li>'
+ '<li><strong>LR Range Test:</strong> Run with η increasing logarithmically from 10⁻⁷ to 1 and pick the η at which loss drops fastest (Smith 2017).</li>'
+ '</ul>'

+ '<h2 class="l-title">10. Learning Rate Scheduling</h2>'

+ '<p class="l-text">A constant η is not optimal. We want big steps early and small steps late — converge fast with big, settle precisely with small. Three popular schedulers:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Step decay:</strong> Halve η every N epochs. Classic, easy.</li>'
+ '<li><strong>Cosine annealing:</strong> Decay η from its initial value to 0 along a cosine curve. The standard for modern Transformer training.</li>'
+ '<li><strong>Warmup + cosine:</strong> Linearly ramp η from 0 to peak over the first 1000–10000 steps, then cosine-decay. Mandatory for large models (BERT, GPT).</li>'
+ '</ul>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l4-sched-en"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l4-sched-en"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var st=[];for(var i=0;i<=100;i++)st.push(i);var step=st.map(function(i){return 1e-3*Math.pow(0.5,Math.floor(i/30));});var cos=st.map(function(i){return 1e-3*0.5*(1+Math.cos(Math.PI*i/100));});var warm=st.map(function(i){if(i<10)return 1e-3*(i/10);return 1e-3*0.5*(1+Math.cos(Math.PI*(i-10)/90));});var traces=[{x:st,y:step,mode:"lines",name:"Step decay",line:{color:hex2rgba(th.accent,0.5),width:2}},{x:st,y:cos,mode:"lines",name:"Cosine",line:{color:hex2rgba(th.accent,0.8),width:2}},{x:st,y:warm,mode:"lines",name:"Warmup + Cosine",line:{color:th.accent,width:3}}];Plotly.newPlot("dl-l4-sched-en",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{title:{text:"Epoch",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text},yaxis:{title:{text:"Learning rate",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text,exponentformat:"e"},margin:{t:50,r:30,b:60,l:80},height:360,legend:{font:{color:th.text}},title:{text:"Learning rate schedulers",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<h2 class="l-title">11. Practical PyTorch Training Loop</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n<span class="kw">from</span> torch.optim <span class="kw">import</span> AdamW\n<span class="kw">from</span> torch.optim.lr_scheduler <span class="kw">import</span> CosineAnnealingLR\n\nmodel = <span class="fn">MyMLP</span>()  <span class="cm"># from Lesson 1</span>\ncriterion = nn.<span class="fn">CrossEntropyLoss</span>()\noptimizer = <span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e</span>-<span class="num">4</span>, weight_decay=<span class="num">0.01</span>)\nscheduler = <span class="fn">CosineAnnealingLR</span>(optimizer, T_max=<span class="num">10</span>)  <span class="cm"># 10 epochs</span>\n\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):\n    model.<span class="fn">train</span>()\n    <span class="kw">for</span> x_batch, y_batch <span class="kw">in</span> train_loader:\n        optimizer.<span class="fn">zero_grad</span>()\n        logits = <span class="fn">model</span>(x_batch)\n        loss = <span class="fn">criterion</span>(logits, y_batch)\n        loss.<span class="fn">backward</span>()\n        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)  <span class="cm"># exploding gradient guard</span>\n        optimizer.<span class="fn">step</span>()\n    scheduler.<span class="fn">step</span>()  <span class="cm"># update LR at the end of each epoch</span>\n    <span class="fn">print</span>(<span class="str">f"Epoch {epoch}: lr={scheduler.get_last_lr()[0]:.6f}, loss={loss.item():.4f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> AdamW optimizer (with weight decay 0.01), cosine-decaying LR at the end of each epoch. <code>clip_grad_norm_</code> caps the gradient norm at 1.0 — exploding gradient protection (we saw this in Lesson 3). <code>scheduler.step()</code> is called once per epoch (some schedulers are called per batch — check the documentation).</p>'

+ '<h2 class="l-title">12. The Effect of Batch Size</h2>'

+ '<p class="l-text">A frequently confused topic. Bigger batch ≠ automatically better.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Small batch (32-64):</strong> Noisy gradient, ability to escape local minima, better generalization (empirical).</li>'
+ '<li><strong>Large batch (1024+):</strong> Fast per-epoch (parallel), but tendency to settle in "sharp minima". Does not learn as well as small batches at the same LR.</li>'
+ '<li><strong>Linear scaling rule:</strong> If you double the batch size, double η as well (approximately). Goyal et al. 2017 showed this for large models.</li>'
+ '</ul>'

+ '<p class="l-text">In practice: 32, 64, 128, 256 — as much as VRAM allows. In modern large models batches of 4096+, but at that scale you balance things with techniques like LR scheduling, warmup and gradient accumulation.</p>'

+ '<h2 class="l-title">13. Reading Training Curves</h2>'

+ '<p class="l-text">In Tensorboard or Weights &amp; Biases, look for these:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Train flat, val flat</div><div class="card-body"><strong>Underfitting.</strong> Model capacity is insufficient, η is too small, or the architecture is wrong. Try a deeper/wider network, increase η.</div></div>'
+ '<div class="calc-card"><div class="card-title">Train going down, val flat</div><div class="card-body"><strong>Overfitting.</strong> The topic of Lesson 5. Dropout, weight decay, more data, augmentation.</div></div>'
+ '<div class="calc-card"><div class="card-title">Loss suddenly NaN</div><div class="card-body">Exploding gradient. Gradient clipping, smaller η, check mixed precision.</div></div>'
+ '<div class="calc-card"><div class="card-title">Loss oscillating</div><div class="card-body">η is too large. Halve it. Or increase batch size.</div></div>'
+ '</div>'

+ '<div class="think-box"><strong>📌 In summary:</strong> The default combo in modern deep learning: <strong>AdamW + cosine schedule + warmup + gradient clipping</strong>. This setup is for Transformers; for ResNets, SGD+Momentum + step decay is more popular. <strong>Next lesson: Regularization & Normalization.</strong> We saw overfitting in the training curve — now how do we fight it: dropout, batch norm, layer norm, weight decay, data augmentation.</div>'

};
