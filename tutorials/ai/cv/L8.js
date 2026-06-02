window.CV_L8 = {

en: `<p class="l-text"><strong>"An image is worth 16x16 words."</strong> That single sentence in Dosovitskiy et al. (2020) flipped vision research on its head. By cutting an image into patches and feeding them to a Transformer encoder, the team showed CNNs are not the only path — attention works on pixels too.</p>

<p class="l-text">In this lesson you will see how patch embedding turns an image into tokens, why position encoding matters, what the CLS token is for, ViT vs CNN tradeoffs, and how to fine-tune a HuggingFace ViT in a few lines.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Convert a 224x224 image into 196 patch tokens via linear projection</li>
<li>Add learnable position embeddings and a CLS token for classification</li>
<li>Compare ViT and CNN trade-offs in data efficiency, compute, and inductive bias</li>
<li>Tour Swin Transformer's shifted-window self-attention for hierarchical features</li>
<li>Fine-tune a pretrained HuggingFace ViTForImageClassification on a custom dataset</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Patch Embedding Trick</h2>
<p class="l-text">A 224x224 RGB image becomes a sequence of 16x16 patches: 14 x 14 = 196 patches. Each patch is flattened to a 16·16·3 = 768-D vector and linearly projected to D=768 — exactly like a word embedding.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Image</div><div class="card-body">224 x 224 x 3</div></div>
<div class="calc-card"><div class="card-title">Patches</div><div class="card-body">196 patches of size 16x16x3 = 768.</div></div>
<div class="calc-card"><div class="card-title">Linear projection</div><div class="card-body">Single FC layer maps each patch to D-dim token.</div></div>
<div class="calc-card"><div class="card-title">Token sequence</div><div class="card-body">196 + 1 (CLS) tokens fed to Transformer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Position Embeddings</h2>
<p class="l-text">Self-attention is permutation-invariant — it does not care about token order. We must inject spatial information.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Learned</div><div class="card-body">Trainable parameter table of size (197, D). Default in original ViT.</div></div>
<div class="calc-card"><div class="card-title">Sinusoidal</div><div class="card-body">Fixed sin/cos pattern, like the original Transformer.</div></div>
<div class="calc-card"><div class="card-title">2D-aware</div><div class="card-body">Some variants encode (row, col) separately for better extrapolation to other resolutions.</div></div>
<div class="calc-card"><div class="card-title">RoPE / ALiBi</div><div class="card-body">Modern relative position schemes used in newer ViTs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The CLS Token and Self-Attention</h2>
<p class="l-text">A learnable [CLS] token is prepended to the patch sequence. After all attention layers, the CLS embedding is fed to a small MLP for classification.</p>
<div class="katex-block">$$\\text{Attn}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{Q K^\\top}{\\sqrt{d_k}}\\right) V$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q, K, V</div><div class="card-body">Linear projections of token embeddings.</div></div>
<div class="calc-card"><div class="card-title">Attention scores</div><div class="card-body">Each token "looks at" every other token weighted by similarity.</div></div>
<div class="calc-card"><div class="card-title">Multi-head</div><div class="card-body">Run attention in parallel with different heads, concatenate.</div></div>
<div class="calc-card"><div class="card-title">CLS aggregates</div><div class="card-body">Through layers, CLS gathers info from all patches → final feature for classification.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ViT vs CNN: The Tradeoffs</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inductive bias</div><div class="card-body">CNNs bake in locality and translation equivariance. ViT learns these from scratch.</div></div>
<div class="calc-card"><div class="card-title">Data hunger</div><div class="card-body">ViT shines with 100M+ images. CNNs are still better with small datasets.</div></div>
<div class="calc-card"><div class="card-title">Scaling</div><div class="card-body">ViT scales gracefully to billions of parameters and images.</div></div>
<div class="calc-card"><div class="card-title">Compute</div><div class="card-body">Self-attention is quadratic in token count → high-res images expensive.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Variants: DeiT, Swin, BEiT</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DeiT</div><div class="card-body">Data-efficient ViT trained on ImageNet only via distillation tokens.</div></div>
<div class="calc-card"><div class="card-title">Swin Transformer</div><div class="card-body">Hierarchical, windowed attention. Linear complexity in image size; great for detection.</div></div>
<div class="calc-card"><div class="card-title">BEiT</div><div class="card-body">Masked image modeling — BERT-style pretraining for vision.</div></div>
<div class="calc-card"><div class="card-title">DINO / MAE</div><div class="card-body">Self-supervised ViT pretraining; produces strong features without labels.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Fine-Tuning HuggingFace ViT</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> ViTImageProcessor, ViTForImageClassification
<span class="kw">import</span> torch

proc = ViTImageProcessor.<span class="fn">from_pretrained</span>(<span class="str">'google/vit-base-patch16-224'</span>)
model = ViTForImageClassification.<span class="fn">from_pretrained</span>(
    <span class="str">'google/vit-base-patch16-224'</span>,
    num_labels=<span class="num">10</span>,
    ignore_mismatched_sizes=<span class="kw">True</span>,
)

inputs = <span class="fn">proc</span>(images=image, return_tensors=<span class="str">'pt'</span>)
logits = <span class="fn">model</span>(**inputs).logits
<span class="fn">print</span>(logits.<span class="fn">argmax</span>(-<span class="num">1</span>))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tiny self-attention over flattened image patches: split \`img\` into 8x8 patches, project to vectors, run scaled-dot-product attention with numpy.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

# Patchify 64x64x3 -&gt; (64 patches of 8x8x3)
P = 8
patches = img.reshape(8, P, 8, P, 3).transpose(0, 2, 1, 3, 4).reshape(64, P*P*3)
patches = patches.astype(np.float32) / 255.0

# Linear projection to d_model=16
W = rng.normal(scale=0.1, size=(P*P*3, 16))
X = patches @ W

# Self-attention
Wq, Wk, Wv = rng.normal(size=(3, 16, 16)) * 0.1
Q, K, V = X @ Wq, X @ Wk, X @ Wv
scores = Q @ K.T / np.sqrt(16)
attn = np.exp(scores - scores.max(axis=1, keepdims=True))
attn = attn / attn.sum(axis=1, keepdims=True)
out = attn @ V

print('# patches:', X.shape[0], '  d_model:', X.shape[1])
print('attention row sum:', float(attn[0].sum()))
print('cls-like first patch encoded mean:', round(float(out[0].mean()), 4))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Load the official Google ViT-base/16 with weights pretrained on ImageNet-21k. 2) Replace the classification head with one for our 10 classes. 3) Use the matching processor to resize and normalize the image. 4) Forward pass returns logits we can argmax to a class index. Replace with a Trainer loop for actual fine-tuning.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. ViT vs ResNet at Different Dataset Sizes</h2>
<p class="l-text">CNNs win on small data; ViT wins on big data. The crossover point typically lies between 1M and 10M images.</p>
<div id="cv-l8-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> ViT splits an image into patches and treats them as Transformer tokens.<br><strong>2.</strong> Patch embedding + position embedding + CLS token form the input sequence.<br><strong>3.</strong> Self-attention lets every patch interact with every other patch, globally.<br><strong>4.</strong> ViTs need lots of data unless you pretrain or distill.<br><strong>5.</strong> Swin and similar variants restore some locality bias for efficiency.<br><strong>6.</strong> HuggingFace makes ViT fine-tuning a few lines of code.<br><strong>7.</strong> DINOv2 is the modern self-supervised ViT backbone; Florence-2 unifies many vision tasks via prompts.<br><strong>8.</strong> Next lesson: image generation — GANs, VAEs, and diffusion models.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Landscape: DINOv2 and Florence-2</h2>
<p class="l-text"><strong>DINOv2 (Meta, April 2023)</strong> is a self-supervised ViT trained on 142M curated images (LVD-142M) with no labels at all. The 1.1B-parameter ViT-g/14 variant beats supervised baselines on ImageNet linear probing and produces general-purpose image features that downstream tasks — depth, segmentation, retrieval, classification — can use frozen. It is now the de-facto vision backbone for foundation-model-style transfer, the same role BERT once played in NLP.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DINOv2 Training</div><div class="card-body">Self-distillation: a student ViT matches the output of a momentum-averaged teacher on different augmented crops. No labels needed.</div></div>
<div class="calc-card"><div class="card-title">DINOv2 Sizes</div><div class="card-body">ViT-S/14 (21M), ViT-B/14 (86M), ViT-L/14 (300M), ViT-g/14 (1.1B). Features are dense per-patch.</div></div>
</div>
<p class="l-text"><strong>Florence-2 (Microsoft, June 2024)</strong> is a unified vision-language foundation model that takes a task prompt — like <code>&lt;OD&gt;</code>, <code>&lt;CAPTION&gt;</code>, <code>&lt;OCR&gt;</code>, <code>&lt;REFERRING_EXPRESSION_SEGMENTATION&gt;</code> — and produces structured output for detection, segmentation, captioning, OCR, grounding, all from one model. It comes in two tiny sizes (0.23B base, 0.77B large) yet beats much larger specialists, thanks to its FLD-5B dataset of 5.4B annotations.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Florence-2 Trick</div><div class="card-body">Encoder-decoder ViT with text prompts; the decoder emits text, locations, polygons, masks — task is selected by the prompt.</div></div>
<div class="calc-card"><div class="card-title">Why It Matters</div><div class="card-body">One model replaces five specialists in production. Easy fine-tuning, MIT license, runs on a single GPU.</div></div>
</div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var sizes = ['10K','100K','1M','10M','100M','300M'];
  var resnet = [0.42, 0.65, 0.76, 0.81, 0.84, 0.85];
  var vit    = [0.32, 0.55, 0.74, 0.83, 0.88, 0.90];
  var t1 = { x:sizes, y:resnet, mode:'lines+markers', name:'ResNet-50', line:{color:'#888'} };
  var t2 = { x:sizes, y:vit,    mode:'lines+markers', name:'ViT-Base', line:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:50,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, xaxis:{title:'Pretraining set size'}, yaxis:{title:'ImageNet acc'}, legend:{x:0.05,y:0.95} };
  var en = document.getElementById('cv-l8-plot-en'); if (en) Plotly.newPlot(en, [t1,t2], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l8-plot-tr'); if (tr) Plotly.newPlot(tr, [t1,t2], Object.assign({}, layout, {xaxis:{title:'Ön eğitim seti boyutu'},yaxis:{title:'ImageNet doğruluğu'}}), {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>"Bir görüntü 16x16 kelimeye değer."</strong> Dosovitskiy ve ekibinin (2020) bu tek cümlesi görme araştırmalarını alt üst etti. Görüntüyü yamalara bölüp Transformer enkodere besleyerek CNN'lerin tek yol olmadığını gösterdiler — dikkat piksellerde de işliyor.</p>

<p class="l-text">Bu derste yama gömme, konum gömme, CLS jetonu, ViT ve CNN ödünleşimleri ile birkaç satırda HuggingFace ViT ince ayarını öğreneceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>224x224 görüntüyü doğrusal projeksiyonla 196 patch tokenine dönüştürmeyi</li>
<li>Sınıflandırma için öğrenilebilir konum gömmesi ve CLS tokeni eklemeyi</li>
<li>ViT ile CNN'i veri verimliliği, hesap maliyeti ve tümevarım yanlılığı açısından karşılaştırmayı</li>
<li>Hiyerarşik öznitelikler için Swin Transformer'ın shifted-window self-attention'ını incelemeyi</li>
<li>Önceden eğitilmiş HuggingFace ViTForImageClassification'ı özel bir veri setine fine-tune etmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Yama Gömme Hilesi</h2>
<p class="l-text">224x224 RGB bir görüntü 16x16 yama dizisine dönüşür: 14 x 14 = 196 yama. Her yama 16·16·3 = 768 boyutlu vektöre düzleştirilir ve D=768'e doğrusal yansıtılır — tıpkı bir kelime gömmesi gibi.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Görüntü</div><div class="card-body">224 x 224 x 3</div></div>
<div class="calc-card"><div class="card-title">Yamalar</div><div class="card-body">16x16x3 = 768 boyutlu 196 yama.</div></div>
<div class="calc-card"><div class="card-title">Doğrusal yansıtım</div><div class="card-body">Tek FC katmanı her yamayı D boyutlu jetona eşler.</div></div>
<div class="calc-card"><div class="card-title">Jeton dizisi</div><div class="card-body">Transformer'a 196 + 1 (CLS) jeton verilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Konum Gömmeleri</h2>
<p class="l-text">Öz-dikkat permutasyon değişmezdir — jeton sırasını umursamaz. Uzamsal bilgiyi enjekte etmemiz gerekir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öğrenilen</div><div class="card-body">(197, D) boyutunda eğitilebilir parametre tablosu. Orijinal ViT'te varsayılan.</div></div>
<div class="calc-card"><div class="card-title">Sinüsoidal</div><div class="card-body">Sabit sin/cos deseni, orijinal Transformer'daki gibi.</div></div>
<div class="calc-card"><div class="card-title">2B farkındalıklı</div><div class="card-body">Bazı varyantlar (satır, sütun) ayrı kodlar — başka çözünürlüklere daha iyi geçiş.</div></div>
<div class="calc-card"><div class="card-title">RoPE / ALiBi</div><div class="card-body">Yeni ViT'lerde kullanılan modern göreli konum şemaları.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. CLS Jetonu ve Öz-Dikkat</h2>
<p class="l-text">Yama dizisinin başına öğrenilebilir bir [CLS] jetonu eklenir. Tüm dikkat katmanlarından sonra CLS gömmesi sınıflandırma için küçük bir MLP'ye verilir.</p>
<div class="katex-block">$$\\text{Attn}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{Q K^\\top}{\\sqrt{d_k}}\\right) V$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q, K, V</div><div class="card-body">Jeton gömmelerinin doğrusal yansıtmaları.</div></div>
<div class="calc-card"><div class="card-title">Dikkat skorları</div><div class="card-body">Her jeton, benzerliğe göre ağırlıklandırılmış biçimde diğer tüm jetonlara "bakar".</div></div>
<div class="calc-card"><div class="card-title">Çoklu kafa</div><div class="card-body">Farklı kafalarla paralel dikkat çalıştır, birleştir.</div></div>
<div class="calc-card"><div class="card-title">CLS toplar</div><div class="card-body">Katmanlar boyunca CLS tüm yamalardan bilgi toplar → sınıflandırma için son özellik.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ViT ve CNN Ödünleşimleri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tümevarım yanlılığı</div><div class="card-body">CNN'ler yerellik ve öteleme eşdeğerliğini içerir. ViT bunları sıfırdan öğrenir.</div></div>
<div class="calc-card"><div class="card-title">Veri açlığı</div><div class="card-body">ViT 100M+ görüntüde parlar. CNN'ler küçük veri kümelerinde hâlâ daha iyi.</div></div>
<div class="calc-card"><div class="card-title">Ölçeklenme</div><div class="card-body">ViT, milyarlarca parametre ve görüntüye düzgün ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Hesaplama</div><div class="card-body">Öz-dikkat jeton sayısında karesel — yüksek çözünürlüklü görüntüler pahalı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Varyantlar: DeiT, Swin, BEiT</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DeiT</div><div class="card-body">Yalnız ImageNet üzerinde damıtma jetonlarıyla eğitilen veri-verimli ViT.</div></div>
<div class="calc-card"><div class="card-title">Swin Transformer</div><div class="card-body">Hiyerarşik, pencereli dikkat. Görüntü boyutunda doğrusal karmaşıklık; tespit için harika.</div></div>
<div class="calc-card"><div class="card-title">BEiT</div><div class="card-body">Maskelenmiş görüntü modellemesi — görme için BERT tarzı ön eğitim.</div></div>
<div class="calc-card"><div class="card-title">DINO / MAE</div><div class="card-body">Öz-denetimli ViT ön eğitimi; etiket olmadan güçlü özellikler üretir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. HuggingFace ViT İnce Ayar</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> ViTImageProcessor, ViTForImageClassification
<span class="kw">import</span> torch

proc = ViTImageProcessor.<span class="fn">from_pretrained</span>(<span class="str">'google/vit-base-patch16-224'</span>)
model = ViTForImageClassification.<span class="fn">from_pretrained</span>(
    <span class="str">'google/vit-base-patch16-224'</span>,
    num_labels=<span class="num">10</span>,
    ignore_mismatched_sizes=<span class="kw">True</span>,
)

girdi = <span class="fn">proc</span>(images=img, return_tensors=<span class="str">'pt'</span>)
logits = <span class="fn">model</span>(**girdi).logits
<span class="fn">print</span>(logits.<span class="fn">argmax</span>(-<span class="num">1</span>))
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Düzleştirilmiş görüntü yamaları üzerinde minik self-attention: \`img\`'i 8x8 yamaya böl, vektöre yansıt, numpy ile scaled-dot-product attention.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

# Patchify 64x64x3 -&gt; (64 patches of 8x8x3)
P = 8
patches = img.reshape(8, P, 8, P, 3).transpose(0, 2, 1, 3, 4).reshape(64, P*P*3)
patches = patches.astype(np.float32) / 255.0

# Linear projection to d_model=16
W = rng.normal(scale=0.1, size=(P*P*3, 16))
X = patches @ W

# Self-attention
Wq, Wk, Wv = rng.normal(size=(3, 16, 16)) * 0.1
Q, K, V = X @ Wq, X @ Wk, X @ Wv
scores = Q @ K.T / np.sqrt(16)
attn = np.exp(scores - scores.max(axis=1, keepdims=True))
attn = attn / attn.sum(axis=1, keepdims=True)
out = attn @ V

print('# patches:', X.shape[0], '  d_model:', X.shape[1])
print('attention row sum:', float(attn[0].sum()))
print('cls-like first patch encoded mean:', round(float(out[0].mean()), 4))</code></pre></div></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) ImageNet-21k'da önceden eğitilmiş resmi Google ViT-base/16'yı yükle. 2) Sınıflandırma başlığını 10 sınıflıkla değiştir. 3) Eşleşen processor ile görüntüyü yeniden boyutlandır ve normalleştir. 4) İleri geçiş, argmax ile sınıf indeksine çevrilebilen logit verir. Gerçek ince ayar için Trainer döngüsüyle değiştirin.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Farklı Veri Boyutlarında ViT ve ResNet</h2>
<p class="l-text">Küçük veride CNN, büyük veride ViT kazanır. Geçiş noktası tipik olarak 1M ile 10M görüntü arasındadır.</p>
<div id="cv-l8-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> ViT görüntüyü yamalara böler ve onları Transformer jetonu olarak işler.<br><strong>2.</strong> Yama gömme + konum gömme + CLS jetonu giriş dizisini oluşturur.<br><strong>3.</strong> Öz-dikkat her yamanın diğer her yama ile küresel etkileşimini sağlar.<br><strong>4.</strong> ViT'ler ön eğitim ya da damıtma yapmazsanız çok veri ister.<br><strong>5.</strong> Swin ve benzeri varyantlar verimlilik için bir miktar yerellik yanlılığını geri getirir.<br><strong>6.</strong> HuggingFace ile ViT ince ayarı birkaç satır kod.<br><strong>7.</strong> DINOv2 modern öz-denetimli ViT omurgasıdır; Florence-2 birçok görme görevini promptlarla birleştirir.<br><strong>8.</strong> Sonraki ders: görüntü üretimi — GAN, VAE ve difüzyon modelleri.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Panorama: DINOv2 ve Florence-2</h2>
<p class="l-text"><strong>DINOv2 (Meta, Nisan 2023)</strong>, hiç etiket kullanmadan 142M özenle seçilmiş görüntü (LVD-142M) üzerinde eğitilen öz-denetimli bir ViT'tir. 1.1B parametreli ViT-g/14 varyantı ImageNet doğrusal sondalamada denetimli temelleri yener ve aşağı akış görevlerinin — derinlik, bölütleme, erişim, sınıflandırma — donmuş şekilde kullanabileceği genel amaçlı görüntü özellikleri üretir. NLP'de BERT'in oynadığı rolün şimdi görmedeki karşılığı: temel-model tarzı aktarımın fiili görme omurgası.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DINOv2 Eğitimi</div><div class="card-body">Öz-damıtma: bir öğrenci ViT, momentum ortalamalı öğretmenin farklı artırılmış kırpmalardaki çıktısını eşler. Etiket gerekmez.</div></div>
<div class="calc-card"><div class="card-title">DINOv2 Boyutları</div><div class="card-body">ViT-S/14 (21M), ViT-B/14 (86M), ViT-L/14 (300M), ViT-g/14 (1.1B). Özellikler yama başına yoğundur.</div></div>
</div>
<p class="l-text"><strong>Florence-2 (Microsoft, Haziran 2024)</strong>, bir görev prompt'u — <code>&lt;OD&gt;</code>, <code>&lt;CAPTION&gt;</code>, <code>&lt;OCR&gt;</code>, <code>&lt;REFERRING_EXPRESSION_SEGMENTATION&gt;</code> gibi — alıp tespit, bölütleme, altyazı, OCR, görsel bağlama için yapılandırılmış çıktı üreten birleşik bir görme-dil temel modelidir; hepsi tek modelden. İki minik boyutta gelir (0.23B base, 0.77B large) ama 5.4B açıklama içeren FLD-5B veri kümesi sayesinde çok daha büyük uzmanları geride bırakır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Florence-2 Hilesi</div><div class="card-body">Metin prompt'lu enkoder-dekoder ViT; dekoder metin, konum, çokgen, maske yayınlar — görev prompt ile seçilir.</div></div>
<div class="calc-card"><div class="card-title">Neden Önemli</div><div class="card-body">Bir model üretimde beş uzmanın yerini alır. Kolay ince ayar, MIT lisansı, tek GPU üzerinde çalışır.</div></div>
</div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var sizes = ['10K','100K','1M','10M','100M','300M'];
  var resnet = [0.42, 0.65, 0.76, 0.81, 0.84, 0.85];
  var vit    = [0.32, 0.55, 0.74, 0.83, 0.88, 0.90];
  var t1 = { x:sizes, y:resnet, mode:'lines+markers', name:'ResNet-50', line:{color:'#888'} };
  var t2 = { x:sizes, y:vit,    mode:'lines+markers', name:'ViT-Base', line:{color:'#c8a96e'} };
  var layout = { margin:{t:20,r:20,b:50,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, xaxis:{title:'Ön-eğitim seti boyutu'}, yaxis:{title:'ImageNet acc'}, legend:{x:0.05,y:0.95} };
  var en = document.getElementById('cv-l8-plot-en'); if (en) Plotly.newPlot(en, [t1,t2], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l8-plot-tr'); if (tr) Plotly.newPlot(tr, [t1,t2], Object.assign({}, layout, {xaxis:{title:'Ön eğitim seti boyutu'},yaxis:{title:'ImageNet doğruluğu'}}), {displayModeBar:false});
}, 250);</script>
`
};
