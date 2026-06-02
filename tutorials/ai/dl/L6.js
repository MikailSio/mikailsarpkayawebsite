/* dl-new-L6.js — Deep Learning Lesson 6: CNN & Bilgisayarla Görü (TR + EN) */
var DL_L6 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Görüntülerle çalışmak için neden tam-bağlantılı (FC) katman yetersiz, <strong>konvolüsyon</strong> nedir ve nasıl işler. Filter, stride, padding, pooling, kanal kavramları. Klasik mimari: LeNet → AlexNet → VGG → ResNet — her birinin ne getirdiği. CIFAR-10 üzerinde küçük bir CNN\'in PyTorch implementasyonu.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>FC katmanın neden 224×224 görüntü için patladığını parametre sayarak göstereceksin</li><li>Konvolüsyonu kernel + stride + padding ile elden hesaplayacaksın</li><li>MaxPool ve AvgPool ile feature map boyutunu yarıya indireceksin</li><li>LeNet, AlexNet, VGG ve ResNet skip connection mimarisini karşılaştıracaksın</li><li>CIFAR-10 üstünde küçük bir CNN\'i PyTorch ile eğiteceksin</li></ul></div>'

+ '<h2 class="l-title">1. FC Katman Neden Yetmez?</h2>'

+ '<p class="l-text">28×28 MNIST görüntüsünü 784\'lük vektör yaptık (Ders 1). 224×224×3 doğal bir RGB görüntü içinse: <strong>150.528</strong> giriş özelliği. İlk gizli katman 1024 nöron olsa: 150.528 × 1024 = <strong>154 milyon parametre</strong> — sadece ilk katmanda. Patlama.</p>'

+ '<p class="l-text">Daha kötüsü: FC katman <em>uzamsal yapıyı</em> hiç bilmiyor. Bir kediyi kedi yapan: kulağı (yerel desen), gözü, çenesi (yerel desenler) ve aralarındaki uzamsal ilişki. Düz vektörde piksel #5 ile #6 komşu mu, bilmiyor.</p>'

+ '<p class="l-text">Üç temel ihtiyaç:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Yerel bağlantılılık:</strong> Bir nöron tüm pikselleri değil, küçük bir bölgeyi görsün.</li>'
+ '<li><strong>Parametre paylaşımı:</strong> Aynı filtre görüntünün her yerinde gezsin (translation invariance).</li>'
+ '<li><strong>Hiyerarşi:</strong> Düşük seviye → kenar/köşe; orta → desen/parça; yüksek → nesne.</li>'
+ '</ul>'

+ '<p class="l-text">Bu üç fikir <strong>konvolüsyon katmanını</strong> tanımlar.</p>'

+ '<h2 class="l-title">2. Konvolüsyon — Tek Cümlede</h2>'

+ '<p class="l-text">Küçük bir matris (filter / kernel) görüntü üzerinde gezer; her konumda dot-product alır; çıktı piksel olur.</p>'

+ '<div class="katex-block">$$y[i,j] = \\sum_{m=0}^{k-1} \\sum_{n=0}^{k-1} W[m,n] \\cdot x[i+m, j+n] + b$$</div>'

+ '<p class="l-text"><em>k</em> = filter boyutu (3, 5, 7), <em>W</em> = öğrenilebilir filter ağırlıkları, <em>b</em> = bias. Aynı W tüm konumlarda kullanılır — parametre paylaşımı. Tek bir 3×3 filter sadece <strong>9 ağırlık + 1 bias = 10 parametre</strong>.</p>'

+ '<div class="calc-example"><div class="example-label">SAYISAL ÖRNEK: 3×3 KENAR DEDEKTÖRÜ</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Filter (Sobel-x):'
+ '<br>&nbsp;&nbsp;[ -1, &nbsp;0, &nbsp;1 ]'
+ '<br>&nbsp;&nbsp;[ -2, &nbsp;0, &nbsp;2 ]'
+ '<br>&nbsp;&nbsp;[ -1, &nbsp;0, &nbsp;1 ]'
+ '</p>'
+ '<p class="l-text">Görüntünün dikey kenarlarını vurgular: solda karanlık, sağda parlak ise pozitif çıktı. CNN bu filtreyi <em>elle yazmıyor</em> — eğitimle keşfediyor. İlk katman filtreleri tipik olarak kenar/yön dedektörlerine benzer.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. Stride, Padding, Çıktı Boyutu</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Stride (s)</div><div class="card-body">Filtrenin her adımda kaç piksel kaydığı. Stride 1 = her piksel; stride 2 = boyutu yarıya indir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Padding (p)</div><div class="card-body">Görüntünün etrafına sıfır ekleme. "Same" padding: çıktı boyutu = giriş boyutu (k=3, p=1 ile).</div></div>'
+ '<div class="calc-card"><div class="card-title">Çıktı boyutu</div><div class="card-body">H_out = ⌊(H_in + 2p - k)/s⌋ + 1. Aynı W için.</div></div>'
+ '</div>'

+ '<p class="l-text">Örnek: 28×28 girişe k=3, p=1, s=1 uygula → 28×28 çıkış (boyut korunur). Stride 2 ile → 14×14 (yarılanır).</p>'

+ '<h2 class="l-title">4. Kanallar (Channels)</h2>'

+ '<p class="l-text">RGB görüntü 3 kanal: kırmızı, yeşil, mavi. Bir konvolüsyon filtresi tüm kanallara aynı anda bakar — yani 3×3 filtre aslında 3×3×3 = <strong>27 ağırlık</strong>. Çıktı tek bir 2D haritadır.</p>'

+ '<p class="l-text">Bir Conv katmanı genellikle <em>birden fazla filtre</em> içerir: örn. 32 farklı 3×3 filtre. Çıktı 32 kanallı bir tensör olur — her kanal farklı bir özellik haritası (kenar dedektörü, doku dedektörü, vs.). Sonraki Conv katman bu 32 kanalı girdi olarak alır, kendi filtreleri 3×3×32 boyutundadır.</p>'

+ '<div class="katex-block">$$\\text{Parametre} = k \\times k \\times C_{\\text{in}} \\times C_{\\text{out}} + C_{\\text{out}}$$</div>'

+ '<p class="l-text">Örnek: 3×3 conv, 64 kanal → 128 kanal: 3·3·64·128 + 128 = <strong>73.856 parametre</strong>. FC ile 224×224×64 → 128 olsa: 224·224·64·128 = ~411 milyon. Konvolüsyon binlerce kat tasarruf sağlar.</p>'

+ '<h2 class="l-title">5. Pooling — Boyut Azaltma</h2>'

+ '<p class="l-text"><strong>Max pooling 2×2 (stride 2):</strong> Görüntüyü 2×2 bloklara böl, her bloğun en büyüğünü al. Çıktı boyutu yarılanır.</p>'

+ '<div class="calc-example"><div class="example-label">MAX POOLING 2×2</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);line-height:1.9">'
+ 'Giriş: &nbsp;&nbsp;[1, 3, 2, 4]'
+ '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 6, 1, 2]'
+ '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[7, 2, 3, 8]'
+ '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 0, 4, 9]'
+ '<br>'
+ '<br>Çıkış: &nbsp;[max(1,3,5,6), max(2,4,1,2)] = [6, 4]'
+ '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[max(7,2,1,0), max(3,8,4,9)] = [7, 9]'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>Faydaları:</strong> Boyut küçülür → hesap hafifler. Çevirim invarianslığı (translation invariance) artar — küçük kaymalar emilir. Receptive field büyür: derin katmanlar görüntünün geniş bölgelerini "görür".</p>'

+ '<p class="l-text"><strong>Modern alternatif:</strong> Pooling yerine stride 2 conv. Daha esnek, öğrenilebilir.</p>'

+ '<h2 class="l-title">6. Tipik CNN Mimarisi</h2>'

+ '<p class="l-text">Klasik kalıp:</p>'

+ '<div class="katex-block">$$\\text{Conv} \\to \\text{BatchNorm} \\to \\text{ReLU} \\to (\\text{Pool}) \\quad \\text{ block repeats}$$</div>'

+ '<p class="l-text">Sonra Flatten + FC katman(lar) + softmax. Erken katmanlar küçük filtre, çok kanal yok; geç katmanlar dar uzamsal boyut, çok kanal. <strong>Spatial dimension azalırken channel dimension artar</strong> — bilginin uzamdan kanala "akışı".</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">LeNet-5 (1998)</div><div class="card-body">Yann LeCun. MNIST için tasarlandı. 2 conv + 2 FC. CNN\'in atası.</div></div>'
+ '<div class="calc-card"><div class="card-title">AlexNet (2012)</div><div class="card-body">Krizhevsky. ImageNet 2012\'yi kazandı, derin öğrenme devrimini başlattı. 8 katman, ReLU, dropout, GPU eğitimi.</div></div>'
+ '<div class="calc-card"><div class="card-title">VGG (2014)</div><div class="card-body">Sadece 3×3 conv\'lardan oluşur, 16-19 katman. Sade, etkili, ama çok parametreli (138M).</div></div>'
+ '<div class="calc-card"><div class="card-title">ResNet (2015)</div><div class="card-body">He et al. <strong>Skip connection</strong> ile 152 katman eğitilebildi. Vanishing gradient sorununu çözdü. Hâlâ baseline.</div></div>'
+ '</div>'

+ '<h2 class="l-title">7. Skip Connection (ResNet Fikri)</h2>'

+ '<p class="l-text">Çok derin ağlarda gradyanlar sönümlenir, eğitim duraklar. Çözüm fikri çok basit: katmanın çıktısına girdisini ekle.</p>'

+ '<div class="katex-block">$$y = F(x; W) + x$$</div>'

+ '<p class="l-text"><em>F</em> = iki konv katmanlı bir blok. Eğer <em>F</em>\'nin öğrenmesi gereken en iyi şey kimlik (identity) ise, kolayca <em>F → 0</em> öğrenir, <em>y = x</em> olur. Skip connection olmadan kimlik öğrenmek bile zor olabilirdi.</p>'

+ '<p class="l-text">Backward pass\'te gradyan <em>F</em>\'den geçerken zayıflasa bile, ekleme operasyonundan dolayı gradyan doğrudan <em>x</em>\'e de akar — vanishing gradient hafifler. Bu fikir Transformer\'da (Ders 9) ve modern her büyük modelde standardır.</p>'

+ '<h2 class="l-title">8. PyTorch CNN — CIFAR-10</h2>'

+ '<p class="l-text">CIFAR-10: 60.000 adet 32×32 RGB görüntü, 10 sınıf (uçak, otomobil, kuş...). Klasik benchmark. Küçük ama gerçekçi bir CNN:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">SmallCNN</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, num_classes=<span class="num">10</span>):\n        <span class="fn">super</span>().<span class="fn">__init__</span>()\n        <span class="kw">self</span>.features = nn.<span class="fn">Sequential</span>(\n            <span class="cm"># Blok 1: 32x32x3 -&gt; 16x16x32</span>\n            nn.<span class="fn">Conv2d</span>(<span class="num">3</span>, <span class="num">32</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">32</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">Conv2d</span>(<span class="num">32</span>, <span class="num">32</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">32</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">MaxPool2d</span>(<span class="num">2</span>),\n            <span class="cm"># Blok 2: 16x16x32 -&gt; 8x8x64</span>\n            nn.<span class="fn">Conv2d</span>(<span class="num">32</span>, <span class="num">64</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">64</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">Conv2d</span>(<span class="num">64</span>, <span class="num">64</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">64</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">MaxPool2d</span>(<span class="num">2</span>),\n            <span class="cm"># Blok 3: 8x8x64 -&gt; 4x4x128</span>\n            nn.<span class="fn">Conv2d</span>(<span class="num">64</span>, <span class="num">128</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">128</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">MaxPool2d</span>(<span class="num">2</span>),\n        )\n        <span class="kw">self</span>.classifier = nn.<span class="fn">Sequential</span>(\n            nn.<span class="fn">Flatten</span>(),\n            nn.<span class="fn">Linear</span>(<span class="num">4</span>*<span class="num">4</span>*<span class="num">128</span>, <span class="num">256</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">Dropout</span>(<span class="num">0.5</span>),\n            nn.<span class="fn">Linear</span>(<span class="num">256</span>, num_classes),\n        )\n\n    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x):\n        x = <span class="kw">self</span>.<span class="fn">features</span>(x)\n        x = <span class="kw">self</span>.<span class="fn">classifier</span>(x)\n        <span class="kw">return</span> x</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> 3 conv blok ile özellik çıkarma, sonra FC ile sınıflandırma. Her blokta kanal sayısı artar (3→32→64→128), uzamsal boyut yarılanır (32→16→8→4). BatchNorm her conv\'dan sonra (Ders 5). Son: 4·4·128 = 2048 boyutlu vektör → 256 → 10 sınıf.</p>'

+ '<p class="l-text"><strong>Toplam parametre:</strong> Yaklaşık 600k. Aynı görevde 3 katmanlı FC (3072 → 1024 → 512 → 10) yaklaşık 3.7M parametre alır ve daha kötü accuracy verir. CNN\'in etkinliği bu.</p>'

+ '<h2 class="l-title">9. Eğitim Döngüsü</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch, torchvision\n<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader\n<span class="kw">import</span> torchvision.transforms <span class="kw">as</span> T\n\ntransform_train = T.<span class="fn">Compose</span>([\n    T.<span class="fn">RandomCrop</span>(<span class="num">32</span>, padding=<span class="num">4</span>),\n    T.<span class="fn">RandomHorizontalFlip</span>(),\n    T.<span class="fn">ToTensor</span>(),\n    T.<span class="fn">Normalize</span>((<span class="num">0.4914</span>, <span class="num">0.4822</span>, <span class="num">0.4465</span>), (<span class="num">0.247</span>, <span class="num">0.243</span>, <span class="num">0.261</span>)),\n])\n\ntrain_set = torchvision.datasets.<span class="fn">CIFAR10</span>(<span class="str">"./data"</span>, train=<span class="kw">True</span>, download=<span class="kw">True</span>, transform=transform_train)\ntrain_loader = <span class="fn">DataLoader</span>(train_set, batch_size=<span class="num">128</span>, shuffle=<span class="kw">True</span>, num_workers=<span class="num">2</span>)\n\ndevice = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>\nmodel = <span class="fn">SmallCNN</span>().<span class="fn">to</span>(device)\noptimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e</span>-<span class="num">4</span>, weight_decay=<span class="num">0.01</span>)\ncriterion = nn.<span class="fn">CrossEntropyLoss</span>()\n\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):\n    model.<span class="fn">train</span>()\n    <span class="kw">for</span> x, y <span class="kw">in</span> train_loader:\n        x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)\n        optimizer.<span class="fn">zero_grad</span>()\n        loss = <span class="fn">criterion</span>(<span class="fn">model</span>(x), y)\n        loss.<span class="fn">backward</span>()\n        optimizer.<span class="fn">step</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> CIFAR-10\'u indir, augmentation uygula (Ders 5), AdamW ile eğit (Ders 4). 20 epoch sonra ~85% accuracy beklenir. Daha derin ResNet ile %95+ mümkün.</p>'

+ '<h2 class="l-title">10. Receptive Field</h2>'

+ '<p class="l-text">Bir nöronun "gördüğü" giriş bölgesi — ağda derinleştikçe büyür. Tek 3×3 conv: 3×3 RF. İki ardışık 3×3 conv: 5×5 RF. Üç tane: 7×7 RF.</p>'

+ '<div class="katex-block">$$RF_{\\ell+1} = RF_\\ell + (k - 1) \\cdot \\prod_{i=1}^{\\ell} s_i$$</div>'

+ '<p class="l-text">Stride ve pooling RF\'i çok hızlı büyütür. Derin bir ResNet\'in son katmanı tüm girdi görüntüsünü görür. Bu yüzden son katman küresel kararlar alabilir ("bu kedidir").</p>'

+ '<p class="l-text"><strong>Pratik kural:</strong> İki 3×3 conv = bir 5×5 conv (aynı RF), ama daha az parametre + daha çok lineer-olmama (iki ReLU). VGG bu nedenle 5×5 yerine ardışık 3×3\'ler kullanır.</p>'

+ '<h2 class="l-title">11. Ne Zaman CNN, Ne Zaman ViT?</h2>'

+ '<p class="l-text">2020\'den itibaren <strong>Vision Transformer (ViT)</strong> CNN\'lere ciddi rakip. Görüntüyü 16×16 yamalara böler, her yamayı bir "token" gibi Transformer\'a verir. Çok büyük datasetlerde (ImageNet-21k, JFT-300M) CNN\'i geçer.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">CNN Tercih Edilir</div><div class="card-body">Küçük-orta dataset (≤ 1M), yerel doku ağırlıklı görevler (segmentation, detection), düşük hesap bütçesi.</div></div>'
+ '<div class="calc-card"><div class="card-title">ViT Tercih Edilir</div><div class="card-body">Büyük dataset (10M+) veya pretrain edilmiş ViT, küresel ilişki gerektiren görevler, transfer learning.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hibrit (ConvNeXt, Swin)</div><div class="card-body">CNN\'in yerel verimliliği + Transformer\'ın küresel modeli. SOTA seviyesinde dengeli seçim.</div></div>'
+ '</div>'

+ '<p class="l-text">Pratik tavsiye: Yeni bir vision görevi için, önce ImageNet pretrain edilmiş bir ResNet50 veya ViT-Base ile transfer learning dene (Ders 7\'nin konusu).</p>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> Konvolüsyon = yerel + paylaşımlı + hiyerarşik. FC\'nin patlattığı parametre sayısını binlerce kat azaltır, görüntünün uzamsal yapısını korur. BatchNorm + ReLU + skip connection ile derin ağ eğitilebilir hale gelir. <strong>Bir sonraki ders: Transfer Learning.</strong> Sıfırdan eğitmek yerine ImageNet üzerinde önceden eğitilmiş bir modeli görevimize uyarlamak — pratik derin öğrenmenin %90\'ı.</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> Why fully connected (FC) layers are insufficient for working with images, what <strong>convolution</strong> is and how it works. The concepts of filter, stride, padding, pooling, channel. Classic architectures: LeNet → AlexNet → VGG → ResNet — what each contributed. A PyTorch implementation of a small CNN on CIFAR-10.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Show by counting parameters why an FC layer explodes for a 224×224 image</li><li>Compute convolution by hand with kernel + stride + padding</li><li>Halve the feature map size with MaxPool and AvgPool</li><li>Compare LeNet, AlexNet, VGG and the ResNet skip connection architecture</li><li>Train a small CNN on CIFAR-10 with PyTorch</li></ul></div>'

+ '<h2 class="l-title">1. Why Doesn\'t the FC Layer Suffice?</h2>'

+ '<p class="l-text">We turned a 28×28 MNIST image into a 784-dim vector (Lesson 1). For a natural 224×224×3 RGB image: <strong>150,528</strong> input features. If the first hidden layer has 1024 neurons: 150,528 × 1024 = <strong>154 million parameters</strong> — in just the first layer. Explosion.</p>'

+ '<p class="l-text">Worse: the FC layer knows nothing about <em>spatial structure</em>. What makes a cat a cat: its ear (a local pattern), its eye, its chin (local patterns) and the spatial relations between them. In a flat vector you do not know whether pixel #5 and #6 are neighbors.</p>'

+ '<p class="l-text">Three core needs:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Local connectivity:</strong> A neuron should see a small region, not all pixels.</li>'
+ '<li><strong>Parameter sharing:</strong> The same filter should slide everywhere in the image (translation invariance).</li>'
+ '<li><strong>Hierarchy:</strong> Low level → edge/corner; mid → pattern/part; high → object.</li>'
+ '</ul>'

+ '<p class="l-text">These three ideas define the <strong>convolutional layer</strong>.</p>'

+ '<h2 class="l-title">2. Convolution — In One Sentence</h2>'

+ '<p class="l-text">A small matrix (filter / kernel) slides over the image; at each position it takes a dot-product; the output becomes a pixel.</p>'

+ '<div class="katex-block">$$y[i,j] = \\sum_{m=0}^{k-1} \\sum_{n=0}^{k-1} W[m,n] \\cdot x[i+m, j+n] + b$$</div>'

+ '<p class="l-text"><em>k</em> = filter size (3, 5, 7), <em>W</em> = learnable filter weights, <em>b</em> = bias. The same W is used at every position — parameter sharing. A single 3×3 filter has only <strong>9 weights + 1 bias = 10 parameters</strong>.</p>'

+ '<div class="calc-example"><div class="example-label">NUMERICAL EXAMPLE: 3×3 EDGE DETECTOR</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.95rem;line-height:1.9">'
+ 'Filter (Sobel-x):'
+ '<br>&nbsp;&nbsp;[ -1, &nbsp;0, &nbsp;1 ]'
+ '<br>&nbsp;&nbsp;[ -2, &nbsp;0, &nbsp;2 ]'
+ '<br>&nbsp;&nbsp;[ -1, &nbsp;0, &nbsp;1 ]'
+ '</p>'
+ '<p class="l-text">Highlights vertical edges: positive output if dark on the left, bright on the right. The CNN does not <em>hand-write</em> this filter — it discovers it through training. The first-layer filters typically resemble edge/orientation detectors.</p>'
+ '</div></div>'

+ '<h2 class="l-title">3. Stride, Padding, Output Size</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Stride (s)</div><div class="card-body">How many pixels the filter slides per step. Stride 1 = every pixel; stride 2 = halve the size.</div></div>'
+ '<div class="calc-card"><div class="card-title">Padding (p)</div><div class="card-body">Adding zeros around the image. "Same" padding: output size = input size (with k=3, p=1).</div></div>'
+ '<div class="calc-card"><div class="card-title">Output size</div><div class="card-body">H_out = ⌊(H_in + 2p - k)/s⌋ + 1. For the same W.</div></div>'
+ '</div>'

+ '<p class="l-text">Example: apply k=3, p=1, s=1 to a 28×28 input → 28×28 output (size preserved). With stride 2 → 14×14 (halved).</p>'

+ '<h2 class="l-title">4. Channels</h2>'

+ '<p class="l-text">An RGB image has 3 channels: red, green, blue. A convolutional filter looks at all channels at once — that is, a 3×3 filter is actually 3×3×3 = <strong>27 weights</strong>. The output is a single 2D map.</p>'

+ '<p class="l-text">A Conv layer usually contains <em>multiple filters</em>: e.g. 32 different 3×3 filters. The output is a 32-channel tensor — each channel is a different feature map (edge detector, texture detector, etc.). The next Conv layer takes these 32 channels as input; its filters are 3×3×32 in shape.</p>'

+ '<div class="katex-block">$$\\text{Parameters} = k \\times k \\times C_{\\text{in}} \\times C_{\\text{out}} + C_{\\text{out}}$$</div>'

+ '<p class="l-text">Example: 3×3 conv, 64 channels → 128 channels: 3·3·64·128 + 128 = <strong>73,856 parameters</strong>. With FC, 224×224×64 → 128 would be: 224·224·64·128 = ~411 million. Convolution saves thousands of times the cost.</p>'

+ '<h2 class="l-title">5. Pooling — Downsampling</h2>'

+ '<p class="l-text"><strong>Max pooling 2×2 (stride 2):</strong> Split the image into 2×2 blocks and take the largest of each block. Output size is halved.</p>'

+ '<div class="calc-example"><div class="example-label">MAX POOLING 2×2</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);line-height:1.9">'
+ 'Input: &nbsp;&nbsp;[1, 3, 2, 4]'
+ '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 6, 1, 2]'
+ '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[7, 2, 3, 8]'
+ '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 0, 4, 9]'
+ '<br>'
+ '<br>Output: &nbsp;[max(1,3,5,6), max(2,4,1,2)] = [6, 4]'
+ '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[max(7,2,1,0), max(3,8,4,9)] = [7, 9]'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text"><strong>Benefits:</strong> Size shrinks → computation gets lighter. Translation invariance increases — small shifts are absorbed. Receptive field grows: deep layers "see" wide regions of the image.</p>'

+ '<p class="l-text"><strong>Modern alternative:</strong> A stride-2 conv instead of pooling. More flexible, learnable.</p>'

+ '<h2 class="l-title">6. Typical CNN Architecture</h2>'

+ '<p class="l-text">Classic pattern:</p>'

+ '<div class="katex-block">$$\\text{Conv} \\to \\text{BatchNorm} \\to \\text{ReLU} \\to (\\text{Pool}) \\quad \\text{ block repeats}$$</div>'

+ '<p class="l-text">Then Flatten + FC layer(s) + softmax. Early layers small filter, not many channels; late layers narrow spatial size, many channels. <strong>Spatial dimension shrinks while channel dimension grows</strong> — information "flowing" from space into channels.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">LeNet-5 (1998)</div><div class="card-body">Yann LeCun. Designed for MNIST. 2 conv + 2 FC. The ancestor of CNNs.</div></div>'
+ '<div class="calc-card"><div class="card-title">AlexNet (2012)</div><div class="card-body">Krizhevsky. Won ImageNet 2012, started the deep learning revolution. 8 layers, ReLU, dropout, GPU training.</div></div>'
+ '<div class="calc-card"><div class="card-title">VGG (2014)</div><div class="card-body">Made up only of 3×3 convs, 16-19 layers. Simple, effective, but very heavy in parameters (138M).</div></div>'
+ '<div class="calc-card"><div class="card-title">ResNet (2015)</div><div class="card-body">He et al. Trained 152 layers thanks to <strong>skip connections</strong>. Solved vanishing gradients. Still a baseline.</div></div>'
+ '</div>'

+ '<h2 class="l-title">7. Skip Connection (The ResNet Idea)</h2>'

+ '<p class="l-text">In very deep networks gradients vanish and training stalls. The fix is very simple: add the input back to the layer\'s output.</p>'

+ '<div class="katex-block">$$y = F(x; W) + x$$</div>'

+ '<p class="l-text"><em>F</em> = a block of two conv layers. If the best thing <em>F</em> can learn is the identity, it can easily learn <em>F → 0</em>, giving <em>y = x</em>. Without skip connections even learning the identity could be hard.</p>'

+ '<p class="l-text">In the backward pass, even if the gradient weakens going through <em>F</em>, the gradient also flows directly into <em>x</em> through the addition operation — vanishing gradients ease. This idea is standard in Transformers (Lesson 9) and every modern large model.</p>'

+ '<h2 class="l-title">8. PyTorch CNN — CIFAR-10</h2>'

+ '<p class="l-text">CIFAR-10: 60,000 32×32 RGB images, 10 classes (airplane, automobile, bird...). A classic benchmark. A small but realistic CNN:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">SmallCNN</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, num_classes=<span class="num">10</span>):\n        <span class="fn">super</span>().<span class="fn">__init__</span>()\n        <span class="kw">self</span>.features = nn.<span class="fn">Sequential</span>(\n            <span class="cm"># Block 1: 32x32x3 -&gt; 16x16x32</span>\n            nn.<span class="fn">Conv2d</span>(<span class="num">3</span>, <span class="num">32</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">32</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">Conv2d</span>(<span class="num">32</span>, <span class="num">32</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">32</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">MaxPool2d</span>(<span class="num">2</span>),\n            <span class="cm"># Block 2: 16x16x32 -&gt; 8x8x64</span>\n            nn.<span class="fn">Conv2d</span>(<span class="num">32</span>, <span class="num">64</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">64</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">Conv2d</span>(<span class="num">64</span>, <span class="num">64</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">64</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">MaxPool2d</span>(<span class="num">2</span>),\n            <span class="cm"># Block 3: 8x8x64 -&gt; 4x4x128</span>\n            nn.<span class="fn">Conv2d</span>(<span class="num">64</span>, <span class="num">128</span>, <span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.<span class="fn">BatchNorm2d</span>(<span class="num">128</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">MaxPool2d</span>(<span class="num">2</span>),\n        )\n        <span class="kw">self</span>.classifier = nn.<span class="fn">Sequential</span>(\n            nn.<span class="fn">Flatten</span>(),\n            nn.<span class="fn">Linear</span>(<span class="num">4</span>*<span class="num">4</span>*<span class="num">128</span>, <span class="num">256</span>),\n            nn.<span class="fn">ReLU</span>(inplace=<span class="kw">True</span>),\n            nn.<span class="fn">Dropout</span>(<span class="num">0.5</span>),\n            nn.<span class="fn">Linear</span>(<span class="num">256</span>, num_classes),\n        )\n\n    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x):\n        x = <span class="kw">self</span>.<span class="fn">features</span>(x)\n        x = <span class="kw">self</span>.<span class="fn">classifier</span>(x)\n        <span class="kw">return</span> x</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Feature extraction with 3 conv blocks, then classification with FC. In each block channel count grows (3→32→64→128) and spatial size halves (32→16→8→4). BatchNorm after each conv (Lesson 5). End: a 4·4·128 = 2048-dim vector → 256 → 10 classes.</p>'

+ '<p class="l-text"><strong>Total parameters:</strong> About 600k. A 3-layer FC (3072 → 1024 → 512 → 10) on the same task takes about 3.7M parameters and gives worse accuracy. This is the efficiency of the CNN.</p>'

+ '<h2 class="l-title">9. Training Loop</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch, torchvision\n<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader\n<span class="kw">import</span> torchvision.transforms <span class="kw">as</span> T\n\ntransform_train = T.<span class="fn">Compose</span>([\n    T.<span class="fn">RandomCrop</span>(<span class="num">32</span>, padding=<span class="num">4</span>),\n    T.<span class="fn">RandomHorizontalFlip</span>(),\n    T.<span class="fn">ToTensor</span>(),\n    T.<span class="fn">Normalize</span>((<span class="num">0.4914</span>, <span class="num">0.4822</span>, <span class="num">0.4465</span>), (<span class="num">0.247</span>, <span class="num">0.243</span>, <span class="num">0.261</span>)),\n])\n\ntrain_set = torchvision.datasets.<span class="fn">CIFAR10</span>(<span class="str">"./data"</span>, train=<span class="kw">True</span>, download=<span class="kw">True</span>, transform=transform_train)\ntrain_loader = <span class="fn">DataLoader</span>(train_set, batch_size=<span class="num">128</span>, shuffle=<span class="kw">True</span>, num_workers=<span class="num">2</span>)\n\ndevice = <span class="str">"cuda"</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">"cpu"</span>\nmodel = <span class="fn">SmallCNN</span>().<span class="fn">to</span>(device)\noptimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e</span>-<span class="num">4</span>, weight_decay=<span class="num">0.01</span>)\ncriterion = nn.<span class="fn">CrossEntropyLoss</span>()\n\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):\n    model.<span class="fn">train</span>()\n    <span class="kw">for</span> x, y <span class="kw">in</span> train_loader:\n        x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)\n        optimizer.<span class="fn">zero_grad</span>()\n        loss = <span class="fn">criterion</span>(<span class="fn">model</span>(x), y)\n        loss.<span class="fn">backward</span>()\n        optimizer.<span class="fn">step</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Download CIFAR-10, apply augmentation (Lesson 5), train with AdamW (Lesson 4). After 20 epochs ~85% accuracy is expected. With deeper ResNet, 95%+ is achievable.</p>'

+ '<h2 class="l-title">10. Receptive Field</h2>'

+ '<p class="l-text">The input region a neuron "sees" — grows as we go deeper in the network. A single 3×3 conv: 3×3 RF. Two consecutive 3×3 convs: 5×5 RF. Three: 7×7 RF.</p>'

+ '<div class="katex-block">$$RF_{\\ell+1} = RF_\\ell + (k - 1) \\cdot \\prod_{i=1}^{\\ell} s_i$$</div>'

+ '<p class="l-text">Stride and pooling grow the RF very fast. The last layer of a deep ResNet sees the entire input image. That is why the last layer can make global decisions ("this is a cat").</p>'

+ '<p class="l-text"><strong>Practical rule:</strong> Two 3×3 convs = one 5×5 conv (same RF), but with fewer parameters + more nonlinearity (two ReLUs). VGG uses consecutive 3×3s instead of 5×5 for this reason.</p>'

+ '<h2 class="l-title">11. When CNN, When ViT?</h2>'

+ '<p class="l-text">Since 2020, the <strong>Vision Transformer (ViT)</strong> has been a serious rival to CNNs. It splits the image into 16×16 patches and feeds each patch as a "token" to a Transformer. On very large datasets (ImageNet-21k, JFT-300M) it surpasses CNNs.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">CNN preferred</div><div class="card-body">Small-medium dataset (≤ 1M), tasks dominated by local texture (segmentation, detection), low compute budget.</div></div>'
+ '<div class="calc-card"><div class="card-title">ViT preferred</div><div class="card-body">Large dataset (10M+) or pretrained ViT, tasks requiring global relations, transfer learning.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hybrid (ConvNeXt, Swin)</div><div class="card-body">CNN\'s local efficiency + Transformer\'s global modeling. A balanced choice at SOTA level.</div></div>'
+ '</div>'

+ '<p class="l-text">Practical advice: For a new vision task, first try transfer learning with an ImageNet-pretrained ResNet50 or ViT-Base (the topic of Lesson 7).</p>'

+ '<div class="think-box"><strong>📌 In summary:</strong> Convolution = local + shared + hierarchical. It reduces the parameter count that FC explodes by thousands of times and preserves the spatial structure of the image. With BatchNorm + ReLU + skip connection, deep networks become trainable. <strong>Next lesson: Transfer Learning.</strong> Adapting a model pre-trained on ImageNet to our task instead of training from scratch — 90% of practical deep learning.</div>'

};
