/* dl-new-L7.js — Deep Learning Lesson 7: Transfer Learning & Pre-training (TR + EN) */
var DL_L7 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Sıfırdan eğitmek yerine, başkalarının büyük veriyle eğittiği modeli al ve görevine uyarla — modern derin öğrenmenin pratikteki <em>%90</em>\'ı bu. Feature extraction, fine-tuning, domain adaptation, self-supervised pre-training. ImageNet pretrained ResNet ile küçük görüntü datasetinde nasıl 30 dakikada %90+ accuracy alınır.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Feature extraction ile fine-tuning arasındaki donmuş katman kararını vereceksin</li><li>ImageNet ön-eğitilmiş ResNet\'in son katmanını yeni göreve göre değiştireceksin</li><li>Discriminative learning rate ile alt katmanlara düşük, üst katmanlara yüksek LR vereceksin</li><li>SimCLR ve MAE ile self-supervised ön-eğitimin etiketsiz veriden nasıl güç aldığını açıklayacaksın</li><li>torchvision.models hub\'ından pretrained ağırlıklarla uçtan uca workflow kuracaksın</li></ul></div>'

+ '<h2 class="l-title">1. Niye Sıfırdan Eğitmiyoruz?</h2>'

+ '<p class="l-text">Diyelim ki köpek ırklarını sınıflandırmak istiyorsun, elinde 5.000 fotoğraf var. <a href="/tutorials/ai/dl/cnn-computer-vision">Ders 6</a>\'da gördüğün gibi modern bir CNN (ResNet50, 25M parametre) bu kadar veriyle sıfırdan eğitilirse: ya overfitting, ya yetersiz öğrenme. Kötü sonuç garantili.</p>'

+ '<p class="l-text">Ama ImageNet (1.4M görüntü, 1000 sınıf) üzerinde önceden eğitilmiş bir ResNet50 zaten kenar, doku, parça dedektörlerini öğrenmiş durumda. Köpek ırkları için bu özellikler büyük oranda <em>geçerli</em>. Sadece son katmanı görevine göre ayarlamak yeter.</p>'

+ '<div class="calc-highlight"><strong>Transfer learning özü:</strong> Büyük veri × büyük model ile öğrenilen düşük-orta seviyeli özellikler farklı görevlere taşınabilir. Pratikte ya hızlanır, ya doğruluk artar — çoğu zaman ikisi birden.</div>'

+ '<h2 class="l-title">2. İki Ana Strateji</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">1. Feature Extraction</div><div class="card-body">Pretrained modeli <strong>dondur</strong> (gradients akmaz). Sadece son katmanı (yeni classifier) eğit. Hızlı, düşük veri için ideal.</div></div>'
+ '<div class="calc-card"><div class="card-title">2. Fine-Tuning</div><div class="card-body">Son katmanı eğit, sonra modelin tamamını <em>çok küçük learning rate</em> ile birkaç epoch eğit. Daha iyi sonuç ama overfitting riski yüksek.</div></div>'
+ '</div>'

+ '<p class="l-text">Hangisini seçeceğin iki şeye bağlı: <strong>(1) verin ne kadar büyük</strong>, <strong>(2) görevin pretrain görevine ne kadar yakın</strong>.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Az veri + benzer görev</div><div class="card-body">Sadece son katmanı eğit (feature extraction).</div></div>'
+ '<div class="calc-card"><div class="card-title">Az veri + farklı görev</div><div class="card-body">Erken katmanları dondur, geç katmanları + classifier\'ı fine-tune et.</div></div>'
+ '<div class="calc-card"><div class="card-title">Çok veri + benzer görev</div><div class="card-body">Tüm modeli düşük LR ile fine-tune et.</div></div>'
+ '<div class="calc-card"><div class="card-title">Çok veri + farklı görev</div><div class="card-body">Pretrained model ile başlat, tümünü fine-tune et (sıfırdan eğitmekten yine de iyi).</div></div>'
+ '</div>'

+ '<h2 class="l-title">3. PyTorch Feature Extraction</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n<span class="kw">import</span> torchvision.models <span class="kw">as</span> models\n\nmodel = models.<span class="fn">resnet50</span>(weights=models.ResNet50_Weights.IMAGENET1K_V2)\n\n<span class="cm"># 1) Tüm parametreleri dondur</span>\n<span class="kw">for</span> param <span class="kw">in</span> model.<span class="fn">parameters</span>():\n    param.requires_grad = <span class="kw">False</span>\n\n<span class="cm"># 2) Son FC katmanı yeni görev için değiştir (1000 sınıf -&gt; 10 sınıf)</span>\nin_features = model.fc.in_features\nmodel.fc = nn.<span class="fn">Linear</span>(in_features, <span class="num">10</span>)\n\n<span class="cm"># Sadece yeni fc.weight ve fc.bias requires_grad=True (otomatik)</span>\noptimizer = torch.optim.<span class="fn">Adam</span>(model.fc.<span class="fn">parameters</span>(), lr=<span class="num">1e</span>-<span class="num">3</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> ImageNet üzerinde önceden eğitilmiş ResNet50\'yi yükle. Tüm ağırlıklarını dondur (<code>requires_grad=False</code>). Son fully-connected katmanı (1000 sınıflık ImageNet head) yeni 10 sınıflı bir Linear ile değiştir. Yeni katman varsayılan olarak gradyan akıtır. Sadece bu yeni katmanın parametreleri optimizer\'a verilir — geri kalanı sabit.</p>'

+ '<p class="l-text"><strong>Etkin parametre sayısı:</strong> 2048×10 + 10 ≈ 20.500. Ortalama bir laptopta CPU\'da bile dakikalar içinde eğitilir.</p>'

+ '<h2 class="l-title">4. PyTorch Fine-Tuning</h2>'

+ '<p class="l-text">Feature extraction\'la başla, son katmanı 5-10 epoch eğit. Sonra tüm modeli aç, çok küçük LR ile birkaç epoch daha eğit:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># Aşama 1: feature extraction (yukarıdaki gibi)</span>\n<span class="cm"># ... 5-10 epoch eğit ...</span>\n\n<span class="cm"># Aşama 2: tüm modeli aç</span>\n<span class="kw">for</span> param <span class="kw">in</span> model.<span class="fn">parameters</span>():\n    param.requires_grad = <span class="kw">True</span>\n\n<span class="cm"># Çok küçük LR — pretrained ağırlıkları "yıkmamak" için</span>\noptimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e</span>-<span class="num">5</span>, weight_decay=<span class="num">0.01</span>)\n\n<span class="cm"># Düzenli scheduler\'la birkaç epoch fine-tune</span>\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):\n    <span class="fn">train_one_epoch</span>(model, train_loader, optimizer)\n    val_acc = <span class="fn">evaluate</span>(model, val_loader)\n    <span class="fn">print</span>(<span class="str">f"Epoch {epoch}: val_acc={val_acc:.4f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Pretrained ağırlıkları yeniden açar, ama LR\'yi 100× düşürür (1e-3 → 1e-5). Niye? Pretrained özellikler çok değerli — büyük gradyan adımları onları silebilir (catastrophic forgetting). Küçük adım = hassas düzeltme.</p>'

+ '<h2 class="l-title">5. Discriminative Learning Rates</h2>'

+ '<p class="l-text">Daha sofistike: farklı katmanlara farklı LR ver. Erken katmanlar (genel özellikler) çok yavaş öğrensin, geç katmanlar (göreve özgü) daha hızlı.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># 3 grup: backbone erken, backbone geç, head</span>\nbackbone_early = <span class="fn">list</span>(model.layer1.<span class="fn">parameters</span>()) + <span class="fn">list</span>(model.layer2.<span class="fn">parameters</span>())\nbackbone_late = <span class="fn">list</span>(model.layer3.<span class="fn">parameters</span>()) + <span class="fn">list</span>(model.layer4.<span class="fn">parameters</span>())\nhead = <span class="fn">list</span>(model.fc.<span class="fn">parameters</span>())\n\noptimizer = torch.optim.<span class="fn">AdamW</span>([\n    {<span class="str">"params"</span>: backbone_early, <span class="str">"lr"</span>: <span class="num">1e</span>-<span class="num">6</span>},\n    {<span class="str">"params"</span>: backbone_late, <span class="str">"lr"</span>: <span class="num">1e</span>-<span class="num">5</span>},\n    {<span class="str">"params"</span>: head, <span class="str">"lr"</span>: <span class="num">1e</span>-<span class="num">3</span>},\n], weight_decay=<span class="num">0.01</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Optimizer\'a parametre gruplarını ayrı ayrı ver, her birine kendi LR\'si. fast.ai bu yaklaşımı popülerleştirdi — hem stabil hem etkili.</p>'

+ '<h2 class="l-title">6. Self-Supervised Pre-training</h2>'

+ '<p class="l-text">ImageNet etiketleri pahalı. <strong>Self-supervised learning (SSL)</strong>: etiketsiz veriden bir "yapma görev" (pretext task) tanımla, modeli onunla pretrain et. Sonra az etiketli veriyle fine-tune et.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">SimCLR / MoCo (kontrastif)</div><div class="card-body">Aynı görüntünün iki augment versiyonunu yakın, farklı görüntüleri uzak tut. Embedding uzayı öğrenilir.</div></div>'
+ '<div class="calc-card"><div class="card-title">MAE (Masked Autoencoder)</div><div class="card-body">Görüntünün %75\'ini maskeleyip kalandan tahmin etmesini iste. ViT için harika çalışır.</div></div>'
+ '<div class="calc-card"><div class="card-title">DINO</div><div class="card-body">Knowledge distillation tabanlı SSL. Etiketsiz semantic özellikler öğrenir.</div></div>'
+ '<div class="calc-card"><div class="card-title">CLIP</div><div class="card-body">Görüntü + metin çiftleri kullanılır. Multimodal embedding uzayı. Zero-shot sınıflandırma mümkün.</div></div>'
+ '</div>'

+ '<p class="l-text">NLP\'de aynı fikir: BERT\'in masked language modeling\'i (Ders 9), GPT\'nin next-token prediction\'ı tamamen self-supervised. Etiketsiz internet metni → büyük model → fine-tune ile herhangi bir görev.</p>'

+ '<h2 class="l-title">7. Domain Adaptation</h2>'

+ '<p class="l-text">Train ve test verisi farklı dağılımlardan geliyorsa (örn. eğitim ImageNet\'ten, test medikal görüntüden) standart fine-tuning yetmez. Üç temel yaklaşım:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Feature alignment:</strong> Source ve target domain feature\'larının dağılımlarını yakınlaştır (MMD, CORAL kayıpları).</li>'
+ '<li><strong>Adversarial domain adaptation:</strong> Bir discriminator domain\'i ayırt etmeye çalışsın, encoder onu kandırsın → domain-invariant features.</li>'
+ '<li><strong>Test-time adaptation:</strong> Test sırasında hafif fine-tuning (BN istatistiklerini target\'a uyarla, vs.).</li>'
+ '</ul>'

+ '<h2 class="l-title">8. Layer Freezing Stratejisi</h2>'

+ '<p class="l-text">CNN\'lerde özellik hiyerarşisi çok belirgin: erken = kenar/renk, orta = doku/parça, geç = nesne. Görevin pretrain\'e ne kadar uzaksa, o kadar geç katmana kadar dondur.</p>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l7-freeze"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l7-freeze"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var freeze=["Hepsi donuk","İlk 3/4 donuk","İlk 1/2 donuk","Hiçbiri donuk"];var smallData=[91,93,90,82];var mediumData=[85,89,92,90];var largeData=[78,84,88,93];var traces=[{x:freeze,y:smallData,type:"bar",name:"Az veri (1k)",marker:{color:hex2rgba(th.accent,0.5)}},{x:freeze,y:mediumData,type:"bar",name:"Orta veri (10k)",marker:{color:hex2rgba(th.accent,0.75)}},{x:freeze,y:largeData,type:"bar",name:"Çok veri (100k)",marker:{color:th.accent}}];Plotly.newPlot("dl-l7-freeze",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{tickfont:{color:th.text},gridcolor:th.grid},yaxis:{title:{text:"Test accuracy (%)",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text,range:[70,100]},margin:{t:50,r:30,b:80,l:60},height:360,barmode:"group",legend:{font:{color:th.text}},title:{text:"Veri boyutuna göre optimal donma derecesi (temsili)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Az veriyle çok katmanı fine-tune etmek overfitting üretir. Çok veriyle her şeyi açmak en iyisi. Doğru nokta dataset boyuyla kayar.</p>'

+ '<h2 class="l-title">9. Hub\'lar — Pretrained Modelleri Nereden Bulurum?</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">torchvision.models</div><div class="card-body">ResNet, EfficientNet, ViT, ConvNeXt — ImageNet weights ile. Görüntü için ilk durak.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hugging Face Hub</div><div class="card-body">~500k+ model. NLP (BERT, GPT, T5), vision (ViT, DINO, MAE), audio (Wav2Vec, Whisper). Sektörün de facto deposu.</div></div>'
+ '<div class="calc-card"><div class="card-title">timm (PyTorch Image Models)</div><div class="card-body">Ross Wightman\'ın 1000+ vision modelli kütüphanesi. SOTA mimarilerin hepsi var.</div></div>'
+ '<div class="calc-card"><div class="card-title">PyTorch Hub</div><div class="card-body"><code>torch.hub.load</code> ile resmi/kullanıcı modelleri yüklenir. DINO, BiT, Detectron2 vs.</div></div>'
+ '</div>'

+ '<h2 class="l-title">10. Pratik Workflow — End-to-End</h2>'

+ '<p class="l-text">5.000 görüntülü 10 sınıflı bir görev için tipik akış:</p>'

+ '<div class="calc-example"><div class="example-label">7-ADIM</div><div class="example-body">'
+ '<ol class="l-list" style="padding-left:1.5em">'
+ '<li><strong>Veriyi bölmek:</strong> 80/10/10 train/val/test.</li>'
+ '<li><strong>Augmentation:</strong> RandomCrop, HorizontalFlip, ColorJitter (Ders 5).</li>'
+ '<li><strong>Model seçimi:</strong> ResNet50 (klasik) veya EfficientNet-B0 (verimli) veya ViT-Base (büyük veri varsa).</li>'
+ '<li><strong>Aşama 1 — Feature extraction:</strong> Backbone donuk, sadece head 5-10 epoch eğit, AdamW lr=1e-3.</li>'
+ '<li><strong>Aşama 2 — Fine-tune:</strong> Tümünü aç, lr=1e-5, 5 epoch. Discriminative LR\'ler işe yarayabilir.</li>'
+ '<li><strong>Validation izle:</strong> Early stopping (Ders 5), en iyi checkpoint\'i sakla.</li>'
+ '<li><strong>Test seti:</strong> Sadece bir kez değerlendir — modeli seçtikten sonra.</li>'
+ '</ol>'
+ '</div></div>'

+ '<h2 class="l-title">11. Yaygın Hatalar</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Yanlış normalize</div><div class="card-body">Pretrained model ImageNet mean/std bekliyor. Senin verinin kendi istatistiğini kullanmak modelin gözlerini kapatır. <code>Normalize((0.485,0.456,0.406),(0.229,0.224,0.225))</code> kullan.</div></div>'
+ '<div class="calc-card"><div class="card-title">BatchNorm running stats</div><div class="card-body">Fine-tuning sırasında BN istatistikleri update edilir; çok küçük batch ile bozulabilir. Çözüm: BN katmanlarını <code>eval()</code> moduna al ya da küçük momentum kullan.</div></div>'
+ '<div class="calc-card"><div class="card-title">LR çok büyük</div><div class="card-body">Fine-tuning\'de pretrain LR\'i kullanma — pretrained ağırlıkları yıkar. 10-100× küçült.</div></div>'
+ '<div class="calc-card"><div class="card-title">Validation kullanmamak</div><div class="card-body">Test setinde hiperparametre seçmek = overfitting. Ayrı validation seti şart.</div></div>'
+ '</div>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> Sıfırdan eğitmek lüks, transfer learning standarttır. Pretrained backbone + senin head + iki aşamalı eğitim = en sağlam başlangıç. NLP\'de aynı fikir BERT/GPT olarak gerçekleşir. <strong>Bir sonraki ders: RNN & LSTM.</strong> Şimdiye kadar görüntülerle/sabit-boyutlu girdilerle çalıştık. Sıralı veri (metin, ses, zaman serisi) için yeni bir mimariye geçiyoruz.</div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> Instead of training from scratch, take a model someone else trained on big data and adapt it to your task — <em>90%</em> of modern deep learning in practice is this. Feature extraction, fine-tuning, domain adaptation, self-supervised pre-training. How to get 90%+ accuracy in 30 minutes on a small image dataset with an ImageNet-pretrained ResNet.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Decide which layers to freeze when choosing between feature extraction and fine-tuning</li><li>Replace the last layer of an ImageNet-pretrained ResNet for a new task</li><li>Use discriminative learning rates: low for early layers, high for late ones</li><li>Explain how SimCLR and MAE leverage unlabeled data for self-supervised pre-training</li><li>Build an end-to-end workflow with pretrained weights from the torchvision.models hub</li></ul></div>'

+ '<h2 class="l-title">1. Why Don\'t We Train from Scratch?</h2>'

+ '<p class="l-text">Suppose you want to classify dog breeds and you have 5,000 photos. As you saw in <a href="/tutorials/ai/dl/cnn-computer-vision">Lesson 6</a>, if a modern CNN (ResNet50, 25M parameters) is trained from scratch with this much data: either overfitting or insufficient learning. A bad result is guaranteed.</p>'

+ '<p class="l-text">But a ResNet50 pretrained on ImageNet (1.4M images, 1000 classes) has already learned edge, texture and part detectors. For dog breeds these features are largely <em>relevant</em>. Just adjusting the last layer for your task is enough.</p>'

+ '<div class="calc-highlight"><strong>The essence of transfer learning:</strong> Low-to-mid level features learned with big data × big model can be transferred to other tasks. In practice it either speeds things up, or boosts accuracy — usually both at once.</div>'

+ '<h2 class="l-title">2. Two Main Strategies</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">1. Feature Extraction</div><div class="card-body"><strong>Freeze</strong> the pretrained model (no gradients flow). Only train the last layer (the new classifier). Fast, ideal for small data.</div></div>'
+ '<div class="calc-card"><div class="card-title">2. Fine-Tuning</div><div class="card-body">Train the last layer, then train the whole model with a <em>very small learning rate</em> for a few epochs. Better result but higher overfitting risk.</div></div>'
+ '</div>'

+ '<p class="l-text">Which to choose depends on two things: <strong>(1) how big your data is</strong>, <strong>(2) how close your task is to the pretrain task</strong>.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Little data + similar task</div><div class="card-body">Train only the last layer (feature extraction).</div></div>'
+ '<div class="calc-card"><div class="card-title">Little data + different task</div><div class="card-body">Freeze early layers, fine-tune late layers + classifier.</div></div>'
+ '<div class="calc-card"><div class="card-title">Lots of data + similar task</div><div class="card-body">Fine-tune the whole model with a low LR.</div></div>'
+ '<div class="calc-card"><div class="card-title">Lots of data + different task</div><div class="card-body">Initialize with the pretrained model, fine-tune everything (still better than training from scratch).</div></div>'
+ '</div>'

+ '<h2 class="l-title">3. PyTorch Feature Extraction</h2>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n<span class="kw">import</span> torchvision.models <span class="kw">as</span> models\n\nmodel = models.<span class="fn">resnet50</span>(weights=models.ResNet50_Weights.IMAGENET1K_V2)\n\n<span class="cm"># 1) Freeze all parameters</span>\n<span class="kw">for</span> param <span class="kw">in</span> model.<span class="fn">parameters</span>():\n    param.requires_grad = <span class="kw">False</span>\n\n<span class="cm"># 2) Replace the final FC layer for the new task (1000 classes -&gt; 10 classes)</span>\nin_features = model.fc.in_features\nmodel.fc = nn.<span class="fn">Linear</span>(in_features, <span class="num">10</span>)\n\n<span class="cm"># Only the new fc.weight and fc.bias have requires_grad=True (automatic)</span>\noptimizer = torch.optim.<span class="fn">Adam</span>(model.fc.<span class="fn">parameters</span>(), lr=<span class="num">1e</span>-<span class="num">3</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Load ResNet50 pretrained on ImageNet. Freeze all weights (<code>requires_grad=False</code>). Replace the final fully-connected layer (the 1000-class ImageNet head) with a new 10-class Linear. The new layer flows gradients by default. Only the parameters of this new layer are passed to the optimizer — the rest stays fixed.</p>'

+ '<p class="l-text"><strong>Effective parameter count:</strong> 2048×10 + 10 ≈ 20,500. Trainable in minutes even on a regular laptop CPU.</p>'

+ '<h2 class="l-title">4. PyTorch Fine-Tuning</h2>'

+ '<p class="l-text">Start with feature extraction, train the last layer for 5-10 epochs. Then unfreeze the whole model and train for a few more epochs with a very small LR:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># Stage 1: feature extraction (as above)</span>\n<span class="cm"># ... train for 5-10 epochs ...</span>\n\n<span class="cm"># Stage 2: unfreeze the whole model</span>\n<span class="kw">for</span> param <span class="kw">in</span> model.<span class="fn">parameters</span>():\n    param.requires_grad = <span class="kw">True</span>\n\n<span class="cm"># Very small LR — to avoid "wrecking" the pretrained weights</span>\noptimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e</span>-<span class="num">5</span>, weight_decay=<span class="num">0.01</span>)\n\n<span class="cm"># Fine-tune for a few epochs with a regular scheduler</span>\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):\n    <span class="fn">train_one_epoch</span>(model, train_loader, optimizer)\n    val_acc = <span class="fn">evaluate</span>(model, val_loader)\n    <span class="fn">print</span>(<span class="str">f"Epoch {epoch}: val_acc={val_acc:.4f}"</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Re-opens the pretrained weights but lowers the LR by 100× (1e-3 → 1e-5). Why? Pretrained features are very valuable — large gradient steps can erase them (catastrophic forgetting). Small steps = delicate adjustment.</p>'

+ '<h2 class="l-title">5. Discriminative Learning Rates</h2>'

+ '<p class="l-text">More sophisticated: assign different LRs to different layers. Early layers (general features) should learn very slowly, late layers (task-specific) faster.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># 3 groups: backbone early, backbone late, head</span>\nbackbone_early = <span class="fn">list</span>(model.layer1.<span class="fn">parameters</span>()) + <span class="fn">list</span>(model.layer2.<span class="fn">parameters</span>())\nbackbone_late = <span class="fn">list</span>(model.layer3.<span class="fn">parameters</span>()) + <span class="fn">list</span>(model.layer4.<span class="fn">parameters</span>())\nhead = <span class="fn">list</span>(model.fc.<span class="fn">parameters</span>())\n\noptimizer = torch.optim.<span class="fn">AdamW</span>([\n    {<span class="str">"params"</span>: backbone_early, <span class="str">"lr"</span>: <span class="num">1e</span>-<span class="num">6</span>},\n    {<span class="str">"params"</span>: backbone_late, <span class="str">"lr"</span>: <span class="num">1e</span>-<span class="num">5</span>},\n    {<span class="str">"params"</span>: head, <span class="str">"lr"</span>: <span class="num">1e</span>-<span class="num">3</span>},\n], weight_decay=<span class="num">0.01</span>)</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Pass parameter groups to the optimizer separately, each with its own LR. fast.ai popularized this approach — both stable and effective.</p>'

+ '<h2 class="l-title">6. Self-Supervised Pre-training</h2>'

+ '<p class="l-text">ImageNet labels are expensive. <strong>Self-supervised learning (SSL)</strong>: define a "pretext task" from unlabeled data and pretrain the model with it. Then fine-tune with a small amount of labeled data.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">SimCLR / MoCo (contrastive)</div><div class="card-body">Keep two augmented versions of the same image close, and different images far. An embedding space is learned.</div></div>'
+ '<div class="calc-card"><div class="card-title">MAE (Masked Autoencoder)</div><div class="card-body">Mask 75% of the image and ask it to predict the rest. Works great for ViT.</div></div>'
+ '<div class="calc-card"><div class="card-title">DINO</div><div class="card-body">Knowledge-distillation-based SSL. Learns label-free semantic features.</div></div>'
+ '<div class="calc-card"><div class="card-title">CLIP</div><div class="card-body">Uses image + text pairs. Multimodal embedding space. Zero-shot classification is possible.</div></div>'
+ '</div>'

+ '<p class="l-text">In NLP the same idea: BERT\'s masked language modeling (Lesson 9), GPT\'s next-token prediction are entirely self-supervised. Unlabeled internet text → big model → fine-tune for any task.</p>'

+ '<h2 class="l-title">7. Domain Adaptation</h2>'

+ '<p class="l-text">If train and test data come from different distributions (e.g. training on ImageNet, testing on medical images), standard fine-tuning is not enough. Three core approaches:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Feature alignment:</strong> Bring source and target domain feature distributions closer (MMD, CORAL losses).</li>'
+ '<li><strong>Adversarial domain adaptation:</strong> Have a discriminator try to distinguish the domain and have the encoder fool it → domain-invariant features.</li>'
+ '<li><strong>Test-time adaptation:</strong> Light fine-tuning at test time (adapt BN statistics to the target, etc.).</li>'
+ '</ul>'

+ '<h2 class="l-title">8. Layer Freezing Strategy</h2>'

+ '<p class="l-text">In CNNs the feature hierarchy is very clear: early = edge/color, mid = texture/part, late = object. The further your task is from the pretrain, the deeper you should freeze.</p>'

+ '<div class="calc-graph" style="height:380px"><div id="dl-l7-freeze-en"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l7-freeze-en"))return;var th=window.__dlChartTheme();var hex2rgba=function(h,a){var s=h.replace("#","");if(s.length===3)s=s.split("").map(function(c){return c+c;}).join("");var r=parseInt(s.substring(0,2),16),g=parseInt(s.substring(2,4),16),b=parseInt(s.substring(4,6),16);return"rgba("+r+","+g+","+b+","+a+")";};var freeze=["All frozen","First 3/4 frozen","First 1/2 frozen","None frozen"];var smallData=[91,93,90,82];var mediumData=[85,89,92,90];var largeData=[78,84,88,93];var traces=[{x:freeze,y:smallData,type:"bar",name:"Small data (1k)",marker:{color:hex2rgba(th.accent,0.5)}},{x:freeze,y:mediumData,type:"bar",name:"Medium data (10k)",marker:{color:hex2rgba(th.accent,0.75)}},{x:freeze,y:largeData,type:"bar",name:"Large data (100k)",marker:{color:th.accent}}];Plotly.newPlot("dl-l7-freeze-en",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{tickfont:{color:th.text},gridcolor:th.grid},yaxis:{title:{text:"Test accuracy (%)",font:{color:th.text}},gridcolor:th.grid,zerolinecolor:th.grid,tickcolor:th.text,range:[70,100]},margin:{t:50,r:30,b:80,l:60},height:360,barmode:"group",legend:{font:{color:th.text}},title:{text:"Optimal freezing depth by data size (illustrative)",font:{color:th.text,size:13}}},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Fine-tuning many layers with little data produces overfitting. With lots of data, opening everything is best. The sweet spot shifts with dataset size.</p>'

+ '<h2 class="l-title">9. Hubs — Where Do I Find Pretrained Models?</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">torchvision.models</div><div class="card-body">ResNet, EfficientNet, ViT, ConvNeXt — with ImageNet weights. The first stop for vision.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hugging Face Hub</div><div class="card-body">~500k+ models. NLP (BERT, GPT, T5), vision (ViT, DINO, MAE), audio (Wav2Vec, Whisper). The de facto repo of the industry.</div></div>'
+ '<div class="calc-card"><div class="card-title">timm (PyTorch Image Models)</div><div class="card-body">Ross Wightman\'s library with 1000+ vision models. Has all SOTA architectures.</div></div>'
+ '<div class="calc-card"><div class="card-title">PyTorch Hub</div><div class="card-body">Load official/user models with <code>torch.hub.load</code>. DINO, BiT, Detectron2, etc.</div></div>'
+ '</div>'

+ '<h2 class="l-title">10. Practical Workflow — End-to-End</h2>'

+ '<p class="l-text">Typical flow for a 10-class task with 5,000 images:</p>'

+ '<div class="calc-example"><div class="example-label">7 STEPS</div><div class="example-body">'
+ '<ol class="l-list" style="padding-left:1.5em">'
+ '<li><strong>Split the data:</strong> 80/10/10 train/val/test.</li>'
+ '<li><strong>Augmentation:</strong> RandomCrop, HorizontalFlip, ColorJitter (Lesson 5).</li>'
+ '<li><strong>Model selection:</strong> ResNet50 (classic) or EfficientNet-B0 (efficient) or ViT-Base (if you have lots of data).</li>'
+ '<li><strong>Stage 1 — Feature extraction:</strong> Backbone frozen, train only the head for 5-10 epochs, AdamW lr=1e-3.</li>'
+ '<li><strong>Stage 2 — Fine-tune:</strong> Open everything, lr=1e-5, 5 epochs. Discriminative LRs can help.</li>'
+ '<li><strong>Monitor validation:</strong> Early stopping (Lesson 5), keep the best checkpoint.</li>'
+ '<li><strong>Test set:</strong> Evaluate only once — after the model is selected.</li>'
+ '</ol>'
+ '</div></div>'

+ '<h2 class="l-title">11. Common Mistakes</h2>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Wrong normalization</div><div class="card-body">The pretrained model expects ImageNet mean/std. Using your own data\'s statistics blinds the model. Use <code>Normalize((0.485,0.456,0.406),(0.229,0.224,0.225))</code>.</div></div>'
+ '<div class="calc-card"><div class="card-title">BatchNorm running stats</div><div class="card-body">During fine-tuning the BN statistics get updated; with very small batches they can break. Solution: put BN layers in <code>eval()</code> mode or use a small momentum.</div></div>'
+ '<div class="calc-card"><div class="card-title">LR too large</div><div class="card-body">Do not use the pretrain LR for fine-tuning — it wrecks the pretrained weights. Reduce by 10-100×.</div></div>'
+ '<div class="calc-card"><div class="card-title">Not using validation</div><div class="card-body">Tuning hyperparameters on the test set = overfitting. A separate validation set is mandatory.</div></div>'
+ '</div>'

+ '<div class="think-box"><strong>📌 In summary:</strong> Training from scratch is a luxury, transfer learning is the standard. Pretrained backbone + your head + two-stage training = the soundest start. The same idea takes form as BERT/GPT in NLP. <strong>Next lesson: RNN & LSTM.</strong> So far we worked with images / fixed-size inputs. We move to a new architecture for sequential data (text, audio, time series).</div>'

};
