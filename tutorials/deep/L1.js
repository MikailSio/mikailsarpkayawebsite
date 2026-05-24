/* dl-new-L1.js — Deep Learning Lesson 1: Sinir Ağına Giriş — Perceptron & MLP (TR + EN) */
var DL_L1 = {

tr:
'<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Türev Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L17)</span></li><li><a href="/tutorials/matematik/19" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Zincir Kuralı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L19)</span></li><li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrisler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li><li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Vektörler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L91)</span></li></ul></div><script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Derin öğrenmenin temel taşı: <em>sinir ağı</em>. Tek bir nörondan (perceptron) çok katmanlı ağa (MLP) yolu, her adımda ne hesaplandığını sezgisel ve matematiksel olarak göreceksin. Tüm 11 ders boyunca takip edeceğimiz somut örnek burada tanıtılır: <strong>el yazısı rakam tanıma — MNIST</strong>. 28×28 piksellik görüntülerden hangi rakamı (0-9) gösterdiğini tahmin etmek.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Bir perceptronun ağırlıklı toplam ve aktivasyon hesabını çıkaracaksın</li><li>MNIST 28×28 görüntüleri 784 boyutlu vektöre düzleştirip MLP\'ye besleyeceksin</li><li>Forward pass\'i el ile hesaplayıp katman katman izleyeceksin</li><li>Universal Approximation teoreminin neden çok katmanı haklı çıkardığını açıklayacaksın</li><li>PyTorch ile ilk MLP\'ni kuracak ve toplam parametre sayısını hesaplayacaksın</li></ul></div>'

+ '<h2 class="l-title">1. Sinir Ağı Nedir?</h2>'

+ '<p class="l-text">Bir <strong>sinir ağı</strong>, beynin nöronlarından <em>çok kabaca</em> ilham alarak tasarlanmış matematiksel bir fonksiyondur. Girdiyi alır, ağırlıklı toplam yapar, doğrusal olmayan bir dönüşüm uygular, çıktı üretir. Birçok bu işlemin üst üste yığılması <em>derin öğrenme</em>nin "derin"liğini oluşturur.</p>'

+ '<p class="l-text">Klasik makine öğrenmesi (<a href="/tutorials/ml-theory/">ML Theory</a>) dersinde gördüğümüz gibi, bir model girdi vektöründen çıktı tahminini öğrenir. Sinir ağları aynı şeyi yapar — sadece çok daha esnek bir fonksiyon ailesi kullanarak. Bu esneklik onları görüntü, ses, metin gibi karmaşık verilerde son teknoloji yapar.</p>'

+ '<h2 class="l-title">2. Bütün Kursun Örneği — MNIST</h2>'

+ '<p class="l-text"><strong>MNIST</strong>, derin öğrenmenin "merhaba dünya"sıdır. 60.000 eğitim + 10.000 test görüntüsünden oluşan bir veri seti; her görüntü 28×28 piksel grayscale ve 0-9 arasında bir el yazısı rakam içerir.</p>'

+ '<div class="calc-example"><div class="example-label">MNIST — VERİ ÖZELLİKLERİ</div><div class="example-body">'
+ '<ul class="l-list">'
+ '<li><strong>Girdi:</strong> 28×28 = 784 piksel. Her piksel 0-255 arası grayscale değer.</li>'
+ '<li><strong>Çıktı:</strong> 10 sınıf (0, 1, 2, ..., 9). Her görüntü tek bir rakamı gösterir.</li>'
+ '<li><strong>Boyut:</strong> 60K eğitim, 10K test. Modern GPU\'larda saniyeler içinde eğitilebilir.</li>'
+ '<li><strong>Hedef:</strong> Yeni bir görüntü verildiğinde hangi rakam olduğunu tahmin et.</li>'
+ '</ul>'
+ '</div></div>'

+ '<p class="l-text">Bu kursta MNIST üzerinden başlayıp giderek daha karmaşık problemlere — Fashion-MNIST (kıyafet sınıflandırma), CIFAR-10 (renkli görüntüler), IMDB (metin sentiment) — geçeceğiz. Her algoritma aynı omurga örnek üzerinden işlenir.</p>'

+ '<h2 class="l-title">3. Perceptron — Tek Nöron</h2>'

+ '<p class="l-text">Sinir ağı zincirinin en küçük halkası: <strong>tek nöron (perceptron)</strong>. Bir nöron şu işlemi yapar:</p>'

+ '<ol class="l-list">'
+ '<li>Girdileri (<em>x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>n</sub></em>) ağırlıklarla (<em>w<sub>1</sub>, w<sub>2</sub>, ..., w<sub>n</sub></em>) çarp.</li>'
+ '<li>Hepsini topla, bir bias (<em>b</em>) ekle. Sonuca "ağırlıklı toplam" veya "lineer skor" (<em>z</em>) denir.</li>'
+ '<li><em>z</em>\'yi bir <strong>aktivasyon fonksiyonu</strong>na geçir. Çıktı bu fonksiyonun değeri.</li>'
+ '</ol>'

+ '<div class="katex-block">$$z = \\sum_{i=1}^{n} w_i x_i + b = \\mathbf{w}^\\top \\mathbf{x} + b$$</div>'

+ '<div class="katex-block">$$\\hat{y} = f(z)$$</div>'

+ '<p class="l-text">Eğer <em>f(z) = z</em> (özdeşlik) seçersen, bu lineer regresyon — <a href="/tutorials/ml-theory/2">ML L2</a>. Eğer <em>f(z) = σ(z)</em> (sigmoid) seçersen, lojistik regresyon — <a href="/tutorials/ml-theory/3">ML L3</a>. <strong>Yani perceptron derin öğrenmenin değil, klasik ML\'in de temel yapı taşıdır.</strong> Aradaki fark, sinir ağında çok sayıda perceptron\'u üst üste yığmamızdır.</p>'

+ '<h2 class="l-title">4. Çok Katmanlı Ağ (MLP) — Derinlik Geliyor</h2>'

+ '<p class="l-text">Tek perceptron sadece <em>doğrusal olarak ayrılabilir</em> problemleri çözebilir. Ünlü XOR problemi (1969, Minsky &amp; Papert) bunu kanıtladı — tek perceptron XOR\'u öğrenemez. Çözüm: <strong>çok katmanlı perceptron (MLP)</strong>.</p>'

+ '<p class="l-text">MLP\'de nöronlar katmanlara dizilir:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Girdi katmanı:</strong> Veri buradan girer. MNIST için 784 nöron (her piksel için bir tane).</li>'
+ '<li><strong>Gizli katmanlar (hidden):</strong> İşin yapıldığı yer. Giriş ile çıktı arasındaki tüm ara katmanlar. Her birinin kendi nöron sayısı, ağırlıkları, aktivasyon fonksiyonu.</li>'
+ '<li><strong>Çıktı katmanı:</strong> Tahmini üretir. MNIST için 10 nöron (her rakam için bir olasılık).</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">TİPİK BIR MNIST MLP MİMARİSİ</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9;text-align:center">'
+ '<strong>784</strong> (28×28 piksel) → <strong>128</strong> ReLU → <strong>64</strong> ReLU → <strong>10</strong> softmax'
+ '</p>'
+ '<p class="l-text">İlk katman: 784 girdiyi 128 nörona bağlar (tam-bağlı/dense). 784×128 + 128 = 100.480 parametre. İkinci katman: 128→64 = 8.256. Üçüncü katman: 64→10 = 650. <strong>Toplam: ~109.000 parametre.</strong> Bu ağ MNIST\'te %97-98 doğruluğa rahat ulaşır.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. Forward Pass — İleri Hesaplama</h2>'

+ '<p class="l-text">Bir MLP nasıl tahmin yapar? Girdiden çıkışa adım adım gidilir; bu sürece <strong>forward pass</strong> denir. Matematiksel olarak her katman bir lineer dönüşüm + aktivasyondur:</p>'

+ '<div class="katex-block">$$\\mathbf{a}^{(\\ell)} = f^{(\\ell)}\\!\\left( W^{(\\ell)} \\mathbf{a}^{(\\ell-1)} + \\mathbf{b}^{(\\ell)} \\right)$$</div>'

+ '<p class="l-text">Burada <em>a<sup>(ℓ)</sup></em> ℓ. katmanın aktivasyonları, <em>W<sup>(ℓ)</sup></em> ve <em>b<sup>(ℓ)</sup></em> o katmanın ağırlık matrisi ve bias\'ı, <em>f<sup>(ℓ)</sup></em> o katmanın aktivasyon fonksiyonu. <em>a<sup>(0)</sup></em> = girdi, son <em>a<sup>(L)</sup></em> = çıktı tahmini.</p>'

+ '<p class="l-text">MNIST örneğinde 5 görüntülük bir batch:</p>'

+ '<ol class="l-list">'
+ '<li>Girdi: <em>X</em> (5, 784) boyutunda matris (her satır bir görüntü).</li>'
+ '<li>Katman 1: <em>X · W<sub>1</sub><sup>⊤</sup> + b<sub>1</sub></em> → ReLU → (5, 128) boyutlu çıktı.</li>'
+ '<li>Katman 2: önceki sonuç × W<sub>2</sub><sup>⊤</sup> + b<sub>2</sub> → ReLU → (5, 64).</li>'
+ '<li>Katman 3: × W<sub>3</sub><sup>⊤</sup> + b<sub>3</sub> → softmax → (5, 10).</li>'
+ '<li>Çıktı: her görüntü için 10 olasılık (toplamı 1).</li>'
+ '</ol>'

+ '<h2 class="l-title">6. Niye Çok Katman Çalışır? — Universal Approximation</h2>'

+ '<p class="l-text">Cybenko (1989), Hornik (1991): <em>tek bir gizli katmana sahip MLP, yeterince geniş olursa, sürekli her fonksiyonu istenen hassasiyetle yaklaştırabilir.</em> Bu <strong>universal approximation teoremi</strong>dir.</p>'

+ '<p class="l-text">Yani teorik olarak tek katman yeterli — pratikte değil. Aynı performans için tek katman aşırı geniş olmak zorunda; oysa <em>derin</em> mimariler (çok katman) çok daha verimli. Her katman bir önceki katmanın temsilini "yeniden ifade eder", özellikleri hiyerarşik olarak öğrenir:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Katman 1:</strong> Düşük seviye — kenar, çizgi, doku.</li>'
+ '<li><strong>Katman 2:</strong> Orta seviye — basit şekiller (daire, dik açı).</li>'
+ '<li><strong>Katman 3+:</strong> Yüksek seviye — rakam parçaları (bir 0\'ın halkası, bir 4\'ün T\'si).</li>'
+ '<li><strong>Son katman:</strong> Sınıf — bu tüm bir 0 mı, 4 mü?</li>'
+ '</ul>'

+ '<p class="l-text">Bu hiyerarşik öğrenme görüntü ve metin gibi karmaşık verilerde derin öğrenmenin gücünün kalbidir.</p>'

+ '<h2 class="l-title">7. Modelin Parametre Sayısı</h2>'

+ '<p class="l-text">Bir MLP\'nin "büyüklüğü" parametre sayısıyla ölçülür. Bir katmanın parametreleri:</p>'

+ '<div class="katex-block">$$|W^{(\\ell)}| = n_{\\ell-1} \\cdot n_{\\ell}, \\qquad |b^{(\\ell)}| = n_{\\ell}$$</div>'

+ '<p class="l-text"><em>n<sub>ℓ</sub></em>: ℓ. katmanın nöron sayısı. Toplam parametre = tüm katmanların toplamı.</p>'

+ '<div class="plotly-graph"><div id="plot-params-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__dlRegDraw(function(){'
+ 'var T=window.__dlChartTheme();'
+ 'var models=["LeNet (1998)","VGG-16 (2014)","ResNet-50 (2015)","BERT-base (2018)","GPT-3 (2020)","GPT-4 (2023)"];'
+ 'var params=[60e3,138e6,25e6,110e6,175e9,1700e9];'
+ 'var t1={x:models,y:params,type:"bar",marker:{color:T.accent}};'
+ 'var layout={title:{text:"Modern modellerin parametre sayısı (logaritmik)",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{title:"Parametre sayısı",color:T.text,gridcolor:T.grid,type:"log"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:80}};'
+ 'if(document.getElementById("plot-params-tr"))Plotly.newPlot("plot-params-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> 1998\'den günümüze derin ağların parametre sayısının patlaması. LeNet 60 bin, GPT-4 1.7 trilyon — 25 yılda <strong>30 milyon kat</strong> büyüme. Y ekseni logaritmik. Modeller büyüdükçe daha çok veri ve hesap gerek; bu trend "ölçek yasası" olarak adlandırılır.</div>'

+ '<h2 class="l-title">8. PyTorch ile İlk MLP</h2>'

+ '<p class="l-text">Teorinin ardından kod. PyTorch derin öğrenmenin standart kütüphanesi haline geldi. MNIST için minimal MLP:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> PyTorch — MNIST MLP modeli<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch'
+ '\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn'
+ '\n'
+ '\n<span class="kw">class</span> MNISTMlp(nn.Module):'
+ '\n    <span class="kw">def</span> <span class="fn">__init__</span>(self):'
+ '\n        <span class="fn">super</span>().<span class="fn">__init__</span>()'
+ '\n        self.flatten = nn.<span class="fn">Flatten</span>()  <span class="cm"># 28×28 → 784</span>'
+ '\n        self.layers = nn.<span class="fn">Sequential</span>('
+ '\n            nn.<span class="fn">Linear</span>(<span class="num">784</span>, <span class="num">128</span>),'
+ '\n            nn.<span class="fn">ReLU</span>(),'
+ '\n            nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">64</span>),'
+ '\n            nn.<span class="fn">ReLU</span>(),'
+ '\n            nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">10</span>),'
+ '\n        )'
+ '\n'
+ '\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):'
+ '\n        x = self.<span class="fn">flatten</span>(x)'
+ '\n        <span class="kw">return</span> self.<span class="fn">layers</span>(x)'
+ '\n'
+ '\n<span class="cm"># Modeli oluştur ve parametre sayısını gör</span>'
+ '\nmodel = <span class="fn">MNISTMlp</span>()'
+ '\nn_params = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())'
+ '\n<span class="fn">print</span>(<span class="str">f"Toplam parametre: {n_params:,}"</span>)'
+ '\n<span class="cm"># Toplam parametre: 109,386</span>'
+ '\n'
+ '\n<span class="cm"># Bir görüntü üzerinde forward pass</span>'
+ '\nimg = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">1</span>, <span class="num">28</span>, <span class="num">28</span>)  <span class="cm"># (batch=1, kanal=1, 28×28)</span>'
+ '\nlogits = <span class="fn">model</span>(img)'
+ '\n<span class="fn">print</span>(logits.<span class="fn">shape</span>)'
+ '\n<span class="cm"># torch.Size([1, 10]) — 10 sınıf için skorlar</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> PyTorch\'ta her sinir ağı bir <code>nn.Module</code>\'dur. <code>__init__</code>\'te katmanları tanımlarsın, <code>forward</code>\'ta veri akışını yazarsın. <code>nn.Sequential</code> katmanları sırayla zincirlemenin kısa yolu. <code>nn.Flatten</code> 2D görüntüyü 1D vektöre düzleştirir (Conv katmanlarda yapmazsan, MLP\'de şart). Son katman 10 nöron — softmax\'ı manuel uygulamayız çünkü cross-entropy kayıp fonksiyonu içinde yapılır (sayısal kararlılık için).</p>'

+ '<h2 class="l-title">9. Klasik ML\'den Niye DL\'e?</h2>'

+ '<p class="l-text">XGBoost (<a href="/tutorials/ml-theory/7">ML L7</a>) gibi klasik modeller tablo verilerinde mükemmel. Niye DL\'e ihtiyaç var?</p>'

+ '<ul class="l-list">'
+ '<li><strong>Yapılandırılmamış veri:</strong> Görüntü, ses, metin tabular değildir. Klasik ML için ham özellik çıkarımı (SIFT, HOG, BoW) gerekir; DL bunu otomatik öğrenir.</li>'
+ '<li><strong>Hiyerarşik temsil:</strong> Derin ağlar veri içindeki çok katmanlı yapıyı (kenar→şekil→nesne) doğal yakalar.</li>'
+ '<li><strong>Ölçeklenebilirlik:</strong> Veri ve hesap büyüdükçe DL kalitesi artmaya devam eder; klasik ML doygunluğa ulaşır.</li>'
+ '<li><strong>Transfer öğrenme:</strong> Bir görevde öğrenilen DL temsiller başka görevlere taşınabilir; klasik ML\'de zor.</li>'
+ '</ul>'

+ '<p class="l-text">Yine de: <strong>tablo verisinde XGBoost hâlâ DL\'i çoğu zaman yener.</strong> "DL > klasik ML" iddiası genellemedir; doğru sorun-doğru araç eşleşmesi önemlidir.</p>'

+ '<h2 class="l-title">10. Bir Sonraki Adım</h2>'

+ '<p class="l-text">Sinir ağının iskeletini öğrendik. Ama bir konuyu hızlı geçtik: <em>aktivasyon fonksiyonu nedir, niye var, hangisini seçeriz?</em> Forward pass\'in son adımı bu — ve sonsuz çeşit bir nuance taşır. <a href="/tutorials/deep/2">Ders 2</a>\'de aktivasyon fonksiyonlarını ve onlarla ortakta çalışan <em>kayıp fonksiyonları</em>nı detayda inceleyeceğiz: ReLU, sigmoid, tanh, GELU, Swish, ve hangisi ne zaman.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Sinir ağının ne olduğunu (matematiksel fonksiyon, beyin değil) ve klasik ML\'le sürekliliğini gördün. MNIST veri setini ve niye derin öğrenmenin "merhaba dünya"sı olduğunu öğrendin. Tek perceptron\'un mekaniğini (ağırlıklı toplam + aktivasyon) ve neden tek başına yetmediğini (XOR sorunu) anladın. Çok katmanlı ağın (MLP) yapısını, forward pass matematiğini, hiyerarşik özellik öğrenmeyi gördün. Universal approximation teoremini ve niye derin&gt;geniş tercih edildiğini öğrendin. Parametre sayma mantığını ve modern modellerin ölçek patlamasını gördün. PyTorch\'ta 20 satırda bir MNIST MLP yazdın. Klasik ML\'le DL\'i ne zaman tercih edeceğini kavradın.</div>'

,

en:
'<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Derivative Definition</a> <span style="opacity:0.55;font-size:0.82em">(Math L17)</span></li><li><a href="/tutorials/matematik/19" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Chain Rule</a> <span style="opacity:0.55;font-size:0.82em">(Math L19)</span></li><li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li><li><a href="/tutorials/matematik/91" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Geometric Vectors</a> <span style="opacity:0.55;font-size:0.82em">(Math L91)</span></li></ul></div><script>(function(){var g=window;g.__dlChartDrawers=g.__dlChartDrawers||[];g.__dlChartTheme=g.__dlChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=g.__dlRegDraw||function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> The cornerstone of deep learning: the <em>neural network</em>. From a single neuron (perceptron) to a multi-layer network (MLP), you will see what is computed at each step intuitively and mathematically. The running example for all 11 lessons is introduced here: <strong>handwritten digit recognition — MNIST</strong>. Predicting which digit (0-9) is shown in a 28×28 grayscale image.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Derive a perceptron as a weighted sum plus a non-linear activation</li><li>Flatten MNIST 28×28 images into a 784-dim vector and feed an MLP</li><li>Compute a forward pass by hand and trace it layer by layer</li><li>Explain why the Universal Approximation Theorem justifies many layers</li><li>Build your first MLP in PyTorch and count its total parameters</li></ul></div>'

+ '<h2 class="l-title">1. What Is a Neural Network?</h2>'

+ '<p class="l-text">A <strong>neural network</strong> is a mathematical function loosely inspired by brain neurons. It takes an input, computes a weighted sum, applies a non-linear transformation, and produces an output. Stacking many such operations creates the "depth" of <em>deep learning</em>.</p>'

+ '<p class="l-text">As we saw in classical ML (<a href="/tutorials/ml-theory/">ML Theory</a>), a model learns to predict an output from an input vector. Neural networks do the same — they just use a far more flexible family of functions. That flexibility is what makes them state-of-the-art for complex data like images, audio, and text.</p>'

+ '<h2 class="l-title">2. The Running Example — MNIST</h2>'

+ '<p class="l-text"><strong>MNIST</strong> is the "hello world" of deep learning. 60,000 train + 10,000 test grayscale 28×28 images of handwritten digits 0-9.</p>'

+ '<div class="calc-example"><div class="example-label">MNIST — KEY FACTS</div><div class="example-body">'
+ '<ul class="l-list">'
+ '<li><strong>Input:</strong> 28×28 = 784 pixels. Each pixel a grayscale value 0-255.</li>'
+ '<li><strong>Output:</strong> 10 classes (0, 1, 2, ..., 9). Each image shows one digit.</li>'
+ '<li><strong>Size:</strong> 60K train, 10K test. Trains in seconds on a modern GPU.</li>'
+ '<li><strong>Goal:</strong> given a new image, predict which digit it shows.</li>'
+ '</ul>'
+ '</div></div>'

+ '<p class="l-text">We start with MNIST then progress to harder problems — Fashion-MNIST (clothing), CIFAR-10 (colour images), IMDB (text sentiment). Each algorithm is taught through this same backbone example.</p>'

+ '<h2 class="l-title">3. The Perceptron — A Single Neuron</h2>'

+ '<p class="l-text">The smallest link in the chain: <strong>a single neuron (perceptron)</strong>. It performs:</p>'

+ '<ol class="l-list">'
+ '<li>Multiply inputs (<em>x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>n</sub></em>) by weights (<em>w<sub>1</sub>, w<sub>2</sub>, ..., w<sub>n</sub></em>).</li>'
+ '<li>Sum them all and add a bias (<em>b</em>). The result is the "weighted sum" or "linear score" (<em>z</em>).</li>'
+ '<li>Pass <em>z</em> through an <strong>activation function</strong>. The output is its value.</li>'
+ '</ol>'

+ '<div class="katex-block">$$z = \\sum_{i=1}^{n} w_i x_i + b = \\mathbf{w}^\\top \\mathbf{x} + b$$</div>'

+ '<div class="katex-block">$$\\hat{y} = f(z)$$</div>'

+ '<p class="l-text">If <em>f(z) = z</em> (identity), this is linear regression — <a href="/tutorials/ml-theory/2">ML L2</a>. If <em>f(z) = σ(z)</em> (sigmoid), it is logistic regression — <a href="/tutorials/ml-theory/3">ML L3</a>. <strong>So the perceptron is not unique to deep learning — it is the building block of classical ML too.</strong> The difference is that neural networks stack many of them together.</p>'

+ '<h2 class="l-title">4. Multi-Layer Perceptron (MLP) — Going Deep</h2>'

+ '<p class="l-text">A single perceptron solves only <em>linearly separable</em> problems. Minsky &amp; Papert (1969) famously proved a single perceptron cannot learn XOR. The fix: <strong>multi-layer perceptron (MLP)</strong>.</p>'

+ '<p class="l-text">In an MLP, neurons are arranged in layers:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Input layer:</strong> data enters here. For MNIST, 784 neurons (one per pixel).</li>'
+ '<li><strong>Hidden layers:</strong> where the work happens. All intermediate layers between input and output. Each has its own neuron count, weights, and activation.</li>'
+ '<li><strong>Output layer:</strong> produces the prediction. For MNIST, 10 neurons (one probability per digit).</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">A TYPICAL MNIST MLP ARCHITECTURE</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9;text-align:center">'
+ '<strong>784</strong> (28×28 pixels) → <strong>128</strong> ReLU → <strong>64</strong> ReLU → <strong>10</strong> softmax'
+ '</p>'
+ '<p class="l-text">Layer 1: connects 784 inputs to 128 neurons (fully connected). 784×128 + 128 = 100,480 parameters. Layer 2: 128→64 = 8,256. Layer 3: 64→10 = 650. <strong>Total: ~109,000 parameters.</strong> This network easily reaches 97-98% accuracy on MNIST.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. Forward Pass — Computing the Output</h2>'

+ '<p class="l-text">How does an MLP make a prediction? Step by step from input to output — the <strong>forward pass</strong>. Each layer is a linear transformation followed by an activation:</p>'

+ '<div class="katex-block">$$\\mathbf{a}^{(\\ell)} = f^{(\\ell)}\\!\\left( W^{(\\ell)} \\mathbf{a}^{(\\ell-1)} + \\mathbf{b}^{(\\ell)} \\right)$$</div>'

+ '<p class="l-text">Where <em>a<sup>(ℓ)</sup></em> is layer ℓ\'s activations, <em>W<sup>(ℓ)</sup></em> and <em>b<sup>(ℓ)</sup></em> are its weight matrix and bias, <em>f<sup>(ℓ)</sup></em> is its activation. <em>a<sup>(0)</sup></em> = input, final <em>a<sup>(L)</sup></em> = output prediction.</p>'

+ '<p class="l-text">For an MNIST batch of 5 images:</p>'

+ '<ol class="l-list">'
+ '<li>Input: <em>X</em> of shape (5, 784) — each row an image.</li>'
+ '<li>Layer 1: <em>X · W<sub>1</sub><sup>⊤</sup> + b<sub>1</sub></em> → ReLU → output (5, 128).</li>'
+ '<li>Layer 2: previous × W<sub>2</sub><sup>⊤</sup> + b<sub>2</sub> → ReLU → (5, 64).</li>'
+ '<li>Layer 3: × W<sub>3</sub><sup>⊤</sup> + b<sub>3</sub> → softmax → (5, 10).</li>'
+ '<li>Output: 10 probabilities per image (sum to 1).</li>'
+ '</ol>'

+ '<h2 class="l-title">6. Why Do Many Layers Work? — Universal Approximation</h2>'

+ '<p class="l-text">Cybenko (1989), Hornik (1991): <em>a single-hidden-layer MLP, given enough width, can approximate any continuous function to arbitrary precision.</em> This is the <strong>universal approximation theorem</strong>.</p>'

+ '<p class="l-text">In theory one layer suffices — in practice not. The same performance demands an absurdly wide layer; <em>deep</em> architectures (many layers) are far more efficient. Each layer "re-expresses" the previous representation, learning features hierarchically:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Layer 1:</strong> low-level — edges, lines, textures.</li>'
+ '<li><strong>Layer 2:</strong> mid-level — basic shapes (circles, right angles).</li>'
+ '<li><strong>Layer 3+:</strong> high-level — digit parts (the loop of a 0, the T of a 4).</li>'
+ '<li><strong>Final layer:</strong> the class — is this a 0 or a 4?</li>'
+ '</ul>'

+ '<p class="l-text">This hierarchical learning is the heart of deep learning\'s power on complex data like images and text.</p>'

+ '<h2 class="l-title">7. Counting Parameters</h2>'

+ '<p class="l-text">A model\'s "size" is measured by parameter count. For one layer:</p>'

+ '<div class="katex-block">$$|W^{(\\ell)}| = n_{\\ell-1} \\cdot n_{\\ell}, \\qquad |b^{(\\ell)}| = n_{\\ell}$$</div>'

+ '<p class="l-text"><em>n<sub>ℓ</sub></em> is layer ℓ\'s neuron count. Total params = sum across layers.</p>'

+ '<div class="plotly-graph"><div id="plot-params-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__dlRegDraw(function(){'
+ 'var T=window.__dlChartTheme();'
+ 'var models=["LeNet (1998)","VGG-16 (2014)","ResNet-50 (2015)","BERT-base (2018)","GPT-3 (2020)","GPT-4 (2023)"];'
+ 'var params=[60e3,138e6,25e6,110e6,175e9,1700e9];'
+ 'var t1={x:models,y:params,type:"bar",marker:{color:T.accent}};'
+ 'var layout={title:{text:"Parameter counts of modern models (log scale)",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{title:"Parameters",color:T.text,gridcolor:T.grid,type:"log"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:50,r:30,b:90,l:80}};'
+ 'if(document.getElementById("plot-params-en"))Plotly.newPlot("plot-params-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> The explosion of parameter counts from 1998 to today. LeNet 60K, GPT-4 1.7T — a <strong>30 million × growth</strong> in 25 years. Y axis log scale. Bigger models need more data and compute; this trend is the "scaling laws".</div>'

+ '<h2 class="l-title">8. PyTorch — Your First MLP</h2>'

+ '<p class="l-text">After theory, code. PyTorch is the standard library for deep learning. A minimal MLP for MNIST:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> PyTorch — MNIST MLP model<button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch'
+ '\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn'
+ '\n'
+ '\n<span class="kw">class</span> MNISTMlp(nn.Module):'
+ '\n    <span class="kw">def</span> <span class="fn">__init__</span>(self):'
+ '\n        <span class="fn">super</span>().<span class="fn">__init__</span>()'
+ '\n        self.flatten = nn.<span class="fn">Flatten</span>()  <span class="cm"># 28×28 → 784</span>'
+ '\n        self.layers = nn.<span class="fn">Sequential</span>('
+ '\n            nn.<span class="fn">Linear</span>(<span class="num">784</span>, <span class="num">128</span>),'
+ '\n            nn.<span class="fn">ReLU</span>(),'
+ '\n            nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">64</span>),'
+ '\n            nn.<span class="fn">ReLU</span>(),'
+ '\n            nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">10</span>),'
+ '\n        )'
+ '\n'
+ '\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):'
+ '\n        x = self.<span class="fn">flatten</span>(x)'
+ '\n        <span class="kw">return</span> self.<span class="fn">layers</span>(x)'
+ '\n'
+ '\n<span class="cm"># Build the model and count parameters</span>'
+ '\nmodel = <span class="fn">MNISTMlp</span>()'
+ '\nn_params = <span class="fn">sum</span>(p.<span class="fn">numel</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())'
+ '\n<span class="fn">print</span>(<span class="str">f"Total parameters: {n_params:,}"</span>)'
+ '\n<span class="cm"># Total parameters: 109,386</span>'
+ '\n'
+ '\n<span class="cm"># Forward pass on a single image</span>'
+ '\nimg = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">1</span>, <span class="num">28</span>, <span class="num">28</span>)  <span class="cm"># (batch=1, channel=1, 28×28)</span>'
+ '\nlogits = <span class="fn">model</span>(img)'
+ '\n<span class="fn">print</span>(logits.<span class="fn">shape</span>)'
+ '\n<span class="cm"># torch.Size([1, 10]) — scores for 10 classes</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Every PyTorch network is an <code>nn.Module</code>. You define layers in <code>__init__</code> and the data flow in <code>forward</code>. <code>nn.Sequential</code> chains layers in order. <code>nn.Flatten</code> reshapes a 2D image to 1D (mandatory for an MLP; not needed for conv layers). The final layer has 10 neurons — we do not apply softmax manually because the cross-entropy loss does it internally for numerical stability.</p>'

+ '<h2 class="l-title">9. Why DL If Classical ML Already Works?</h2>'

+ '<p class="l-text">Classical models like XGBoost (<a href="/tutorials/ml-theory/7">ML L7</a>) are great on tabular data. So why DL?</p>'

+ '<ul class="l-list">'
+ '<li><strong>Unstructured data:</strong> images, audio, text are not tabular. Classical ML needs handcrafted features (SIFT, HOG, BoW); DL learns them automatically.</li>'
+ '<li><strong>Hierarchical representation:</strong> deep nets naturally capture multi-level structure (edges → shapes → objects).</li>'
+ '<li><strong>Scalability:</strong> as data and compute grow, DL keeps improving; classical ML saturates.</li>'
+ '<li><strong>Transfer learning:</strong> representations learned on one task move to another; hard with classical ML.</li>'
+ '</ul>'

+ '<p class="l-text">Still: <strong>on tabular data XGBoost usually beats DL.</strong> "DL beats classical ML" is an over-generalisation; right tool for the right problem.</p>'

+ '<h2 class="l-title">10. What\'s Next</h2>'

+ '<p class="l-text">We learned the skeleton of a neural network. But we glossed over one thing: <em>what is an activation function, why do we need it, which to choose?</em> The final step of the forward pass — and packed with nuance. <a href="/tutorials/deep/2">Lesson 2</a> covers activation functions and the <em>loss functions</em> that pair with them: ReLU, sigmoid, tanh, GELU, Swish, and which to use when.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What a neural network is (a mathematical function, not a brain). The MNIST dataset and why it is the "hello world" of DL. The mechanics of a single perceptron (weighted sum + activation) and why one alone is not enough (XOR). The MLP architecture, forward-pass math, and hierarchical feature learning. The universal approximation theorem and why deep beats wide. How to count parameters and the explosion of model size in modern DL. A 20-line PyTorch MLP for MNIST. When to choose classical ML vs DL.</div>'

};
