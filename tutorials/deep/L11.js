/* dl-new-L11.js — Deep Learning Lesson 11: Üretim, Verimlilik & MLOps (TR + EN) */
var DL_L11 = {

tr:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Eğitilmiş modeli gerçek dünyaya çıkarma sanatı. <strong>Verimlilik:</strong> mixed precision, quantization, pruning, distillation. <strong>Dağıtık eğitim:</strong> data/model/pipeline paralelliği, ZeRO. <strong>MLOps:</strong> model versiyonlama, izleme, drift, A/B test, retraining. Pratikte derin öğrenmenin son ama kritik halkası — modeli sadece eğitmek yetmez, ürün haline getirmek lazım.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Mixed precision (FP16/BF16) ile bellek ve hız kazançlarını ölçeceksin</li><li>Post-training quantization ve pruning ile modeli küçültüp doğruluk düşüşünü kıyaslayacaksın</li><li>Knowledge distillation ile büyük öğretmenden küçük öğrenci eğiteceksin</li><li>Data, model ve pipeline paralelliğini ZeRO ile çoklu GPU\'ya dağıtacaksın</li><li>Üretimde drift, A/B test ve retraining döngüsünü bir MLOps pipeline\'ında kuracaksın</li></ul></div>'

+ '<h2 class="l-title">1. Niye Bu Konu?</h2>'

+ '<p class="l-text">Eğittiğin model %95 accuracy verdi — kutlama vakti? Hayır, asıl iş şimdi başlıyor. Üretim ortamında karşılaşacağın sorular:</p>'

+ '<ul class="l-list">'
+ '<li>Bu model GPU\'suz bir telefonda çalışacak mı?</li>'
+ '<li>Dakikada 10.000 istek geldiğinde latency 100ms\'in altında kalır mı?</li>'
+ '<li>3 ay sonra veri dağılımı değişirse model bunu fark edecek mi?</li>'
+ '<li>Yeni versiyon eskisinden gerçekten daha iyi olduğunu nasıl göstereceğim?</li>'
+ '</ul>'

+ '<p class="l-text">Bu derste bu soruların cevapları. Akademik dünyada ihmal edilir; sanayide her şey budur.</p>'

+ '<h2 class="l-title">2. Mixed Precision Training</h2>'

+ '<p class="l-text">Standart eğitim FP32 (32-bit float). Modern GPU\'lar FP16/BF16\'da 2-8× daha hızlı. Mixed precision: kritik yerlerde FP32, hesabın çoğunda FP16.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler\n\nscaler = <span class="fn">GradScaler</span>()\n\n<span class="kw">for</span> x, y <span class="kw">in</span> train_loader:\n    optimizer.<span class="fn">zero_grad</span>()\n    <span class="kw">with</span> <span class="fn">autocast</span>():            <span class="cm"># forward FP16</span>\n        logits = <span class="fn">model</span>(x)\n        loss = <span class="fn">criterion</span>(logits, y)\n    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()  <span class="cm"># gradient scaling</span>\n    scaler.<span class="fn">step</span>(optimizer)\n    scaler.<span class="fn">update</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> <code>autocast</code> blok içindeki op\'ları otomatik FP16\'ya çevirir; sayısal stabilite gereken yerler (LayerNorm, softmax) FP32\'de kalır. <code>GradScaler</code> küçük FP16 gradyanların underflow olmasını engellemek için scale eder. Sonuç: ~2× hız, yarı bellek.</p>'

+ '<p class="l-text"><strong>BF16 (bfloat16):</strong> A100/H100 GPU\'larda. FP16 ile aynı boyut, FP32 ile aynı dynamic range. GradScaler gereksiz, daha kolay kullanım.</p>'

+ '<h2 class="l-title">3. Quantization — Sonradan Hafifletme</h2>'

+ '<p class="l-text">Modeli eğittikten sonra ağırlıkları INT8 (veya INT4) ile temsil et. 4× daha küçük, çoğu CPU\'da daha hızlı çıkarım.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Post-training quantization (PTQ)</div><div class="card-body">Eğitim bitince ağırlıkları INT8\'e dönüştür. Hızlı ama kalite kaybı olabilir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Quantization-aware training (QAT)</div><div class="card-body">Eğitim sırasında quantization gürültüsünü simüle et — model ona uyum sağlar. Daha az kalite kaybı.</div></div>'
+ '<div class="calc-card"><div class="card-title">Dynamic quantization</div><div class="card-body">Sadece ağırlıkları kuantize et, aktivasyonlar runtime\'da. Transformer için yaygın.</div></div>'
+ '<div class="calc-card"><div class="card-title">GPTQ / AWQ (LLM\'ler)</div><div class="card-body">4-bit weight-only quantization. 70B modeli 35GB yerine 9GB\'a indir. <code>bitsandbytes</code>, <code>auto-gptq</code> kütüphaneleri.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.quantization <span class="kw">as</span> Q\n\nmodel.<span class="fn">eval</span>()\nmodel_int8 = Q.<span class="fn">quantize_dynamic</span>(\n    model,\n    {nn.Linear},     <span class="cm"># hangi katmanlar quantize edilsin</span>\n    dtype=torch.qint8,\n)\n<span class="cm"># 4× küçük model, CPU\'da çoğu zaman daha hızlı</span></code></pre></div></div>'

+ '<h2 class="l-title">4. Pruning — Gereksiz Ağırlıkları Sil</h2>'

+ '<p class="l-text">Eğitilmiş ağda birçok ağırlık ≈ 0. Bunları gerçekten 0 yap → seyrek model → küçük + hızlı.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Unstructured (magnitude) pruning:</strong> En küçük %X ağırlığı sil. Yüksek seyreklik mümkün, ama özel donanım gerekir.</li>'
+ '<li><strong>Structured pruning:</strong> Tüm bir nöron, kanal veya kafa\'yı sil. Donanım hızlandırır.</li>'
+ '<li><strong>Iterative magnitude pruning + retrain:</strong> Bir kısmı sil, yeniden eğit, tekrarla. Lottery ticket hipotezi (Frankle &amp; Carbin 2018).</li>'
+ '</ul>'

+ '<h2 class="l-title">5. Knowledge Distillation</h2>'

+ '<p class="l-text">Büyük "öğretmen" model + küçük "öğrenci" model. Öğrenci sadece etiketleri değil, öğretmenin softmax çıktılarını da taklit eder.</p>'

+ '<div class="katex-block">$$\\mathcal{L} = \\alpha \\cdot \\mathcal{L}_{CE}(y, \\text{student}) + (1-\\alpha) \\cdot T^2 \\cdot KL(\\text{teacher}_T, \\text{student}_T)$$</div>'

+ '<p class="l-text"><em>T</em> = temperature, softmax\'ı yumuşatır. Öğretmenin "yumuşak" olasılıkları (örn. "kedi 0.7, köpek 0.2, tilki 0.05") tek-sıcak etiketten daha bilgilendirici — kategoriler arası ilişkiyi öğretir.</p>'

+ '<p class="l-text"><strong>Pratik örnek:</strong> DistilBERT. BERT-base 110M parametre; DistilBERT 66M (40% küçük), %97 performans. Edge cihazlarda ideal.</p>'

+ '<h2 class="l-title">6. Dağıtık Eğitim — Genel Strateji</h2>'

+ '<p class="l-text">Bir GPU yetmediğinde:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Data Parallelism (DP, DDP)</div><div class="card-body">Modeli her GPU\'ya kopyala, batch\'i böl, her GPU bir parça işler, gradyanlar all-reduce ile toplanır. PyTorch <code>DistributedDataParallel</code> standart.</div></div>'
+ '<div class="calc-card"><div class="card-title">Tensor / Model Parallelism</div><div class="card-body">Tek katman bile bir GPU\'ya sığmıyorsa: ağırlık matrislerini GPU\'lara böl. Megatron-LM, NVIDIA çözümü.</div></div>'
+ '<div class="calc-card"><div class="card-title">Pipeline Parallelism</div><div class="card-body">Modeli katmanlara böl, her GPU farklı katmanları taşır. Mikrobatch\'lerle pipeline doldurulur.</div></div>'
+ '<div class="calc-card"><div class="card-title">ZeRO (DeepSpeed)</div><div class="card-body">Optimizer state, gradyan, ağırlık partition\'la — bellek lineer azalır. Microsoft\'un büyük model çözümü. ZeRO-3 ile her şey shardlanır.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># PyTorch DDP — basit kullanım</span>\n<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist\n<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP\n\ndist.<span class="fn">init_process_group</span>(<span class="str">"nccl"</span>)\nmodel = <span class="fn">DDP</span>(model.<span class="fn">cuda</span>(local_rank), device_ids=[local_rank])\n<span class="cm"># Eğitim aynı, ama her GPU kendi mini-batch\'ini işler</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> NCCL backend ile process group başlat, modeli DDP ile sar. Forward/backward aynı; backward sırasında gradyanlar otomatik all-reduce ile senkronize olur.</p>'

+ '<h2 class="l-title">7. Çıkarım Servisi (Serving)</h2>'

+ '<p class="l-text">Modeli production\'da nasıl sunarsın?</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Triton Inference Server (NVIDIA)</div><div class="card-body">Çoklu framework desteği, dynamic batching, model versioning. GPU sunucularda standart.</div></div>'
+ '<div class="calc-card"><div class="card-title">TorchServe</div><div class="card-body">PyTorch resmi serving çözümü. Daha hafif, kolay kurulum.</div></div>'
+ '<div class="calc-card"><div class="card-title">ONNX Runtime</div><div class="card-body">Modeli framework-bağımsız ONNX formatına dönüştür. CPU/GPU/mobil her yerde optimize çalışır.</div></div>'
+ '<div class="calc-card"><div class="card-title">TensorRT</div><div class="card-body">NVIDIA\'nın inference optimizer\'ı. 5-10× hız. Production GPU çıkarımının altın standardı.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>LLM\'ler için özel:</strong> vLLM, TGI (Text Generation Inference), llama.cpp — paged attention, continuous batching, KV-cache yönetimi gibi LLM\'e özgü optimizasyonlarla 10×+ throughput.</p>'

+ '<h2 class="l-title">8. Dynamic Batching</h2>'

+ '<p class="l-text">Tek istek geldiğinde GPU\'da tonlarca atıl çekirdek var. <strong>Dynamic batching:</strong> kısa süre bekle, gelen istekleri tek batch yap, hepsini bir GPU çağrısında işle. Latency biraz artar, throughput katlanır.</p>'

+ '<p class="l-text">Trade-off: ne kadar bekleyeceğin (timeout) ve max batch size — kullanıcı tahammülü ile maliyet arasında denge.</p>'

+ '<h2 class="l-title">9. MLOps — Model Yaşam Döngüsü</h2>'

+ '<p class="l-text">Bir model eğitildi, deploy edildi — iş bitti? Hayır. Üretim modelinin <strong>yaşam döngüsü</strong> var:</p>'

+ '<div class="calc-graph" style="height:300px"><div id="dl-l11-loop"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l11-loop"))return;var th=window.__dlChartTheme();var labels=["1. Veri Toplama","2. Model Eğitimi","3. Değerlendirme","4. Deployment","5. Monitoring","6. Drift Tespit","7. Retraining"];var n=labels.length;var x=[],y=[];var radius=1;for(var i=0;i<n;i++){var ang=2*Math.PI*i/n - Math.PI/2;x.push(radius*Math.cos(ang));y.push(radius*Math.sin(ang));}x.push(x[0]);y.push(y[0]);var traces=[{type:"scatter",mode:"lines",x:x,y:y,line:{color:th.accent,width:2},showlegend:false,hoverinfo:"skip"},{type:"scatter",mode:"markers+text",x:x.slice(0,n),y:y.slice(0,n),text:labels,textposition:"middle center",textfont:{color:th.text,size:11,family:"sans-serif"},marker:{size:80,color:th.paper,line:{color:th.accent,width:2}},showlegend:false,hoverinfo:"skip"}];Plotly.newPlot("dl-l11-loop",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{visible:false,range:[-1.5,1.5]},yaxis:{visible:false,range:[-1.5,1.5],scaleanchor:"x",scaleratio:1},margin:{t:30,r:20,b:20,l:20},height:280,title:{text:"MLOps döngüsü",font:{color:th.text,size:13}},showlegend:false},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Her aşama otomasyon ve gözlem ister.</p>'

+ '<h2 class="l-title">10. Experiment Tracking & Versioning</h2>'

+ '<p class="l-text">100 farklı hiperparametre kombinasyonu denedin — hangisi neydi, hangi git commit\'iyle eğitildi, hangi data versiyonunu kullandın? Bunu hatırlayamazsın. Araçlar:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">MLflow</div><div class="card-body">Açık kaynak, kendin host edebilirsin. Experiment, metric, artifact, model registry.</div></div>'
+ '<div class="calc-card"><div class="card-title">Weights &amp; Biases (W&amp;B)</div><div class="card-body">SaaS. Güzel UI, sweep (hyperparameter search), report. Akademik & sanayi popüler.</div></div>'
+ '<div class="calc-card"><div class="card-title">DVC (Data Version Control)</div><div class="card-body">Git\'in büyük veri versiyonu. Dataset hashleri ile reproducibility.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hugging Face Hub</div><div class="card-body">Model + dataset + space (demo) versioning. Açık kaynak çalışmalar için en kolay.</div></div>'
+ '</div>'

+ '<h2 class="l-title">11. Monitoring & Drift</h2>'

+ '<p class="l-text">Üretimde ilk gün %95 accuracy modelin 6 ay sonra %78\'e düşebilir — kullanıcı davranışı, dünya, içerik değişti. Bunu fark etmek için:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Performance drift:</strong> Test seti üzerinde periyodik değerlendirme. Etiket alınabiliyorsa.</li>'
+ '<li><strong>Data drift:</strong> Girdi dağılımının istatistikleri (ortalama, std, KS-test) eğitim verisinden uzaklaşıyor mu?</li>'
+ '<li><strong>Concept drift:</strong> p(y|x) ilişkisi değişti mi? Dolaylı belirtiler (model güveni düşmesi, prediction dağılım kayması).</li>'
+ '<li><strong>Latency / error rate:</strong> Sistem sağlığı izlemesi (Prometheus, Grafana, Datadog).</li>'
+ '</ul>'

+ '<p class="l-text">Drift tespit edildiğinde: alarm, otomatik retraining trigger, fallback model, insan müdahalesi.</p>'

+ '<h2 class="l-title">12. A/B Testing</h2>'

+ '<p class="l-text">Yeni modeli yayına almadan önce: trafik %5\'ini yeni modele yönlendir, %95\'i eski modelde tut. İstatistiksel anlamlılık kazandığında geçiş yap.</p>'

+ '<p class="l-text"><strong>Önemli metrikler:</strong> sadece offline metric (accuracy) değil, online metric (CTR, conversion, session duration). Çoğu zaman birbirini takip eder, ama her zaman değil — offline iyileşmenin online\'a yansımaması yaygın.</p>'

+ '<p class="l-text"><strong>Shadow mode:</strong> Yeni model her isteği görür ama tahminleri kullanılmaz, sadece loglanır. Trafiği etkilemeden gerçek dünyada test edersin.</p>'

+ '<h2 class="l-title">13. Reproducibility</h2>'

+ '<p class="l-text">Aynı kodu, aynı veriyi 6 ay sonra çalıştırdığında aynı modeli üretebilmelisin. Gerekenler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Random seed sabit:</strong> torch, numpy, python random — hepsini sabitle. CUDA için <code>torch.use_deterministic_algorithms(True)</code>.</li>'
+ '<li><strong>Bağımlılık dondurma:</strong> <code>requirements.txt</code> + Docker image. PyTorch versiyonu CUDA versiyonu önemli.</li>'
+ '<li><strong>Veri hashleme:</strong> Dataset\'in tam halini hashle (DVC, Git LFS).</li>'
+ '<li><strong>Konfig dosyası:</strong> Tüm hiperparametreler YAML/JSON\'da. Hydra, OmegaConf yardımcı.</li>'
+ '</ul>'

+ '<h2 class="l-title">14. Etik, Güvenlik, Sorumluluk</h2>'

+ '<p class="l-text">Production ML\'in son ama en az teknik olmayan boyutu:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Bias / fairness:</strong> Modelin farklı grup\'larda farklı performansı varsa (ırk, cinsiyet, yaş) — etik ve yasal sorun. Aequitas, Fairlearn gibi araçlarla audit.</li>'
+ '<li><strong>Adversarial robustness:</strong> Küçük input perturbasyonu modeli kandırabiliyor mu? Güvenlik kritik uygulamalarda test et.</li>'
+ '<li><strong>Privacy:</strong> Model eğitim verisini "ezberliyor" mu? Differential privacy, federated learning.</li>'
+ '<li><strong>Açıklanabilirlik:</strong> SHAP, LIME, Integrated Gradients ile tahminleri açıkla. Düzenleyici ortamlarda zorunlu.</li>'
+ '</ul>'

+ '<div class="think-box"><strong>📌 Özetle:</strong> Eğitilmiş model = işin yarısı. Verimlilik (mixed precision, quantization, pruning, distillation), dağıtım (DDP, ZeRO, model parallel), serving (Triton, ONNX, vLLM), MLOps (tracking, monitoring, drift, A/B). Modern derin öğrenme mühendisi sadece eğitmiyor — modelin gerçek dünyada uzun süre güvenilir çalışmasını sağlıyor. <strong>Kurs Tamamlandı.</strong> Şimdi öğrendiklerini kendi projeyle pekiştirme zamanı: bir veri, bir hipotez, bir model, bir fine-tune, bir küçük servis. Her ders bir araç sundu — birleştir.</div>'

+ '<div class="lesson-formula-ref" style="margin-top:2em"><a href="/tutorials/deep/">📚 Tüm DL Dersleri</a> &nbsp;|&nbsp; <a href="/tutorials/nlp/">📘 NLP Kursu</a> &nbsp;|&nbsp; <a href="/tutorials/ml-theory/">🧠 ML Theory</a></div>'

,

en:
'<script>(function(){var g=window;g.__dlChartDrawers=[];g.__dlChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#c8a96e"};};g.__dlRegDraw=function(fn){g.__dlChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__dlThemeObsAttached){g.__dlThemeObsAttached=true;var redraw=function(){(g.__dlChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn in this lesson:</strong> The art of taking a trained model into the real world. <strong>Efficiency:</strong> mixed precision, quantization, pruning, distillation. <strong>Distributed training:</strong> data/model/pipeline parallelism, ZeRO. <strong>MLOps:</strong> model versioning, monitoring, drift, A/B testing, retraining. The last but critical link in practical deep learning — training the model is not enough; it must be turned into a product.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 IN THIS LESSON YOU WILL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Measure the memory and speed gains of mixed precision (FP16/BF16)</li><li>Compare the accuracy drop after post-training quantization and pruning</li><li>Train a small student from a large teacher using knowledge distillation</li><li>Distribute data, model and pipeline parallelism across multiple GPUs with ZeRO</li><li>Set up the drift, A/B test and retraining loop in production within an MLOps pipeline</li></ul></div>'

+ '<h2 class="l-title">1. Why This Topic?</h2>'

+ '<p class="l-text">The model you trained scored 95% accuracy — time to celebrate? No, the real work starts now. Questions you will face in production:</p>'

+ '<ul class="l-list">'
+ '<li>Will this model run on a phone without a GPU?</li>'
+ '<li>When 10,000 requests arrive per minute, will latency stay under 100 ms?</li>'
+ '<li>If the data distribution changes 3 months from now, will the model notice?</li>'
+ '<li>How will I show that the new version is really better than the old one?</li>'
+ '</ul>'

+ '<p class="l-text">In this lesson the answers to those questions. Neglected in academia; in industry it is everything.</p>'

+ '<h2 class="l-title">2. Mixed Precision Training</h2>'

+ '<p class="l-text">Standard training is FP32 (32-bit float). Modern GPUs are 2-8× faster in FP16/BF16. Mixed precision: FP32 in critical places, FP16 for most of the computation.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler\n\nscaler = <span class="fn">GradScaler</span>()\n\n<span class="kw">for</span> x, y <span class="kw">in</span> train_loader:\n    optimizer.<span class="fn">zero_grad</span>()\n    <span class="kw">with</span> <span class="fn">autocast</span>():            <span class="cm"># forward FP16</span>\n        logits = <span class="fn">model</span>(x)\n        loss = <span class="fn">criterion</span>(logits, y)\n    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()  <span class="cm"># gradient scaling</span>\n    scaler.<span class="fn">step</span>(optimizer)\n    scaler.<span class="fn">update</span>()</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> <code>autocast</code> automatically converts ops inside the block to FP16; places that need numerical stability (LayerNorm, softmax) stay in FP32. <code>GradScaler</code> scales the small FP16 gradients to prevent underflow. Result: ~2× speed, half the memory.</p>'

+ '<p class="l-text"><strong>BF16 (bfloat16):</strong> Available on A100/H100 GPUs. Same size as FP16, same dynamic range as FP32. GradScaler is unnecessary, easier to use.</p>'

+ '<h2 class="l-title">3. Quantization — Compress After the Fact</h2>'

+ '<p class="l-text">After training the model, represent the weights in INT8 (or INT4). 4× smaller, faster inference on most CPUs.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Post-training quantization (PTQ)</div><div class="card-body">After training, convert weights to INT8. Fast but quality may drop.</div></div>'
+ '<div class="calc-card"><div class="card-title">Quantization-aware training (QAT)</div><div class="card-body">Simulate quantization noise during training — the model adapts. Less quality loss.</div></div>'
+ '<div class="calc-card"><div class="card-title">Dynamic quantization</div><div class="card-body">Quantize weights only, activations at runtime. Common for Transformers.</div></div>'
+ '<div class="calc-card"><div class="card-title">GPTQ / AWQ (LLMs)</div><div class="card-body">4-bit weight-only quantization. Bring a 70B model from 35GB down to 9GB. <code>bitsandbytes</code>, <code>auto-gptq</code> libraries.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="kw">import</span> torch.quantization <span class="kw">as</span> Q\n\nmodel.<span class="fn">eval</span>()\nmodel_int8 = Q.<span class="fn">quantize_dynamic</span>(\n    model,\n    {nn.Linear},     <span class="cm"># which layers to quantize</span>\n    dtype=torch.qint8,\n)\n<span class="cm"># 4× smaller model, often faster on CPU</span></code></pre></div></div>'

+ '<h2 class="l-title">4. Pruning — Remove Unnecessary Weights</h2>'

+ '<p class="l-text">In a trained network many weights ≈ 0. Make them really 0 → sparse model → smaller + faster.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Unstructured (magnitude) pruning:</strong> Remove the smallest X% of weights. High sparsity is possible, but specialized hardware is required.</li>'
+ '<li><strong>Structured pruning:</strong> Remove an entire neuron, channel or head. Hardware actually accelerates.</li>'
+ '<li><strong>Iterative magnitude pruning + retrain:</strong> Remove a portion, retrain, repeat. The lottery ticket hypothesis (Frankle &amp; Carbin 2018).</li>'
+ '</ul>'

+ '<h2 class="l-title">5. Knowledge Distillation</h2>'

+ '<p class="l-text">A large "teacher" model + a small "student" model. The student imitates not only the labels but also the teacher\'s softmax outputs.</p>'

+ '<div class="katex-block">$$\\mathcal{L} = \\alpha \\cdot \\mathcal{L}_{CE}(y, \\text{student}) + (1-\\alpha) \\cdot T^2 \\cdot KL(\\text{teacher}_T, \\text{student}_T)$$</div>'

+ '<p class="l-text"><em>T</em> = temperature, softens the softmax. The teacher\'s "soft" probabilities (e.g. "cat 0.7, dog 0.2, fox 0.05") are more informative than a one-hot label — they teach the relations between categories.</p>'

+ '<p class="l-text"><strong>Practical example:</strong> DistilBERT. BERT-base has 110M parameters; DistilBERT has 66M (40% smaller), 97% of the performance. Ideal for edge devices.</p>'

+ '<h2 class="l-title">6. Distributed Training — The General Strategy</h2>'

+ '<p class="l-text">When one GPU is not enough:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Data Parallelism (DP, DDP)</div><div class="card-body">Replicate the model on every GPU, split the batch, each GPU processes a piece, gradients are summed via all-reduce. PyTorch <code>DistributedDataParallel</code> is standard.</div></div>'
+ '<div class="calc-card"><div class="card-title">Tensor / Model Parallelism</div><div class="card-body">If even a single layer does not fit on one GPU: split weight matrices across GPUs. Megatron-LM, NVIDIA\'s solution.</div></div>'
+ '<div class="calc-card"><div class="card-title">Pipeline Parallelism</div><div class="card-body">Split the model into layers, each GPU carries different layers. The pipeline is filled with microbatches.</div></div>'
+ '<div class="calc-card"><div class="card-title">ZeRO (DeepSpeed)</div><div class="card-body">Partition optimizer state, gradients and weights — memory drops linearly. Microsoft\'s big model solution. With ZeRO-3 everything is sharded.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><div class="code-block"><pre><code><span class="cm"># PyTorch DDP — basic usage</span>\n<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist\n<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP\n\ndist.<span class="fn">init_process_group</span>(<span class="str">"nccl"</span>)\nmodel = <span class="fn">DDP</span>(model.<span class="fn">cuda</span>(local_rank), device_ids=[local_rank])\n<span class="cm"># Training is the same, but each GPU handles its own mini-batch</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Initialize the process group with the NCCL backend, wrap the model with DDP. Forward/backward are the same; gradients are automatically synchronized via all-reduce during backward.</p>'

+ '<h2 class="l-title">7. Inference Service (Serving)</h2>'

+ '<p class="l-text">How do you serve the model in production?</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Triton Inference Server (NVIDIA)</div><div class="card-body">Multi-framework support, dynamic batching, model versioning. Standard on GPU servers.</div></div>'
+ '<div class="calc-card"><div class="card-title">TorchServe</div><div class="card-body">PyTorch\'s official serving solution. Lighter, easy to set up.</div></div>'
+ '<div class="calc-card"><div class="card-title">ONNX Runtime</div><div class="card-body">Convert the model to the framework-agnostic ONNX format. Runs optimized on CPU/GPU/mobile everywhere.</div></div>'
+ '<div class="calc-card"><div class="card-title">TensorRT</div><div class="card-body">NVIDIA\'s inference optimizer. 5-10× speed. The gold standard of production GPU inference.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>For LLMs specifically:</strong> vLLM, TGI (Text Generation Inference), llama.cpp — 10×+ throughput thanks to LLM-specific optimizations like paged attention, continuous batching, KV-cache management.</p>'

+ '<h2 class="l-title">8. Dynamic Batching</h2>'

+ '<p class="l-text">When a single request arrives, there are tons of idle cores on the GPU. <strong>Dynamic batching:</strong> wait briefly, batch arriving requests together, process them all in a single GPU call. Latency rises a bit, throughput multiplies.</p>'

+ '<p class="l-text">Trade-off: how long to wait (timeout) and the max batch size — a balance between user tolerance and cost.</p>'

+ '<h2 class="l-title">9. MLOps — The Model Lifecycle</h2>'

+ '<p class="l-text">A model is trained, deployed — done? No. A production model has a <strong>lifecycle</strong>:</p>'

+ '<div class="calc-graph" style="height:300px"><div id="dl-l11-loop-en"></div></div>'

+ '<script>(function(){function draw(){if(!window.Plotly||!document.getElementById("dl-l11-loop-en"))return;var th=window.__dlChartTheme();var labels=["1. Data Collection","2. Model Training","3. Evaluation","4. Deployment","5. Monitoring","6. Drift Detection","7. Retraining"];var n=labels.length;var x=[],y=[];var radius=1;for(var i=0;i<n;i++){var ang=2*Math.PI*i/n - Math.PI/2;x.push(radius*Math.cos(ang));y.push(radius*Math.sin(ang));}x.push(x[0]);y.push(y[0]);var traces=[{type:"scatter",mode:"lines",x:x,y:y,line:{color:th.accent,width:2},showlegend:false,hoverinfo:"skip"},{type:"scatter",mode:"markers+text",x:x.slice(0,n),y:y.slice(0,n),text:labels,textposition:"middle center",textfont:{color:th.text,size:11,family:"sans-serif"},marker:{size:80,color:th.paper,line:{color:th.accent,width:2}},showlegend:false,hoverinfo:"skip"}];Plotly.newPlot("dl-l11-loop-en",traces,{paper_bgcolor:th.paper,plot_bgcolor:th.plot,font:{color:th.text},xaxis:{visible:false,range:[-1.5,1.5]},yaxis:{visible:false,range:[-1.5,1.5],scaleanchor:"x",scaleratio:1},margin:{t:30,r:20,b:20,l:20},height:280,title:{text:"MLOps loop",font:{color:th.text,size:13}},showlegend:false},{displayModeBar:false,responsive:true});}window.__dlRegDraw(draw);})();</script>'

+ '<p class="l-text">Every stage requires automation and observation.</p>'

+ '<h2 class="l-title">10. Experiment Tracking & Versioning</h2>'

+ '<p class="l-text">You tried 100 different hyperparameter combos — which was which, with which git commit was each trained, which data version did you use? You will not remember. Tools:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">MLflow</div><div class="card-body">Open source, you can self-host. Experiment, metric, artifact, model registry.</div></div>'
+ '<div class="calc-card"><div class="card-title">Weights &amp; Biases (W&amp;B)</div><div class="card-body">SaaS. Beautiful UI, sweep (hyperparameter search), reports. Popular in academia & industry.</div></div>'
+ '<div class="calc-card"><div class="card-title">DVC (Data Version Control)</div><div class="card-body">Git\'s big-data version. Reproducibility via dataset hashes.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hugging Face Hub</div><div class="card-body">Model + dataset + space (demo) versioning. The easiest for open-source work.</div></div>'
+ '</div>'

+ '<h2 class="l-title">11. Monitoring & Drift</h2>'

+ '<p class="l-text">A model with 95% accuracy on its first day in production may drop to 78% six months later — user behavior, the world, content has changed. To notice this:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Performance drift:</strong> Periodic evaluation on a test set. If labels are obtainable.</li>'
+ '<li><strong>Data drift:</strong> Are the input distribution\'s statistics (mean, std, KS-test) drifting away from the training data?</li>'
+ '<li><strong>Concept drift:</strong> Has the p(y|x) relationship changed? Indirect signs (model confidence dropping, prediction distribution shifting).</li>'
+ '<li><strong>Latency / error rate:</strong> System health monitoring (Prometheus, Grafana, Datadog).</li>'
+ '</ul>'

+ '<p class="l-text">When drift is detected: alert, automatic retraining trigger, fallback model, human intervention.</p>'

+ '<h2 class="l-title">12. A/B Testing</h2>'

+ '<p class="l-text">Before pushing the new model live: route 5% of traffic to the new model, keep 95% on the old. When statistical significance is reached, switch over.</p>'

+ '<p class="l-text"><strong>Important metrics:</strong> not just offline metrics (accuracy), but online metrics (CTR, conversion, session duration). They usually track each other, but not always — it is common for offline improvements not to translate to online ones.</p>'

+ '<p class="l-text"><strong>Shadow mode:</strong> The new model sees every request but its predictions are not used, only logged. You test in the real world without affecting traffic.</p>'

+ '<h2 class="l-title">13. Reproducibility</h2>'

+ '<p class="l-text">Running the same code on the same data 6 months later, you should be able to reproduce the same model. What is needed:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Fixed random seed:</strong> torch, numpy, python random — fix them all. For CUDA, <code>torch.use_deterministic_algorithms(True)</code>.</li>'
+ '<li><strong>Pin dependencies:</strong> <code>requirements.txt</code> + Docker image. PyTorch version and CUDA version matter.</li>'
+ '<li><strong>Data hashing:</strong> Hash the exact state of the dataset (DVC, Git LFS).</li>'
+ '<li><strong>Config file:</strong> All hyperparameters in YAML/JSON. Hydra and OmegaConf help.</li>'
+ '</ul>'

+ '<h2 class="l-title">14. Ethics, Security, Responsibility</h2>'

+ '<p class="l-text">The last but least technical dimension of production ML:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Bias / fairness:</strong> If the model has different performance on different groups (race, gender, age) — an ethical and legal issue. Audit with tools like Aequitas, Fairlearn.</li>'
+ '<li><strong>Adversarial robustness:</strong> Can small input perturbations fool the model? Test this in security-critical applications.</li>'
+ '<li><strong>Privacy:</strong> Does the model "memorize" training data? Differential privacy, federated learning.</li>'
+ '<li><strong>Explainability:</strong> Explain predictions with SHAP, LIME, Integrated Gradients. Mandatory in regulated environments.</li>'
+ '</ul>'

+ '<div class="think-box"><strong>📌 In summary:</strong> A trained model = half the job. Efficiency (mixed precision, quantization, pruning, distillation), distribution (DDP, ZeRO, model parallel), serving (Triton, ONNX, vLLM), MLOps (tracking, monitoring, drift, A/B). The modern deep learning engineer does not just train — they ensure the model runs reliably for a long time in the real world. <strong>Course Complete.</strong> Now is the time to consolidate what you learned with your own project: a dataset, a hypothesis, a model, a fine-tune, a small service. Each lesson handed you a tool — combine them.</div>'

+ '<div class="lesson-formula-ref" style="margin-top:2em"><a href="/tutorials/deep/">📚 All DL Lessons</a> &nbsp;|&nbsp; <a href="/tutorials/nlp/">📘 NLP Course</a> &nbsp;|&nbsp; <a href="/tutorials/ml-theory/">🧠 ML Theory</a></div>'

};
