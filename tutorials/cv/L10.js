window.CV_L10 = {

en: `<p class="l-text"><strong>For decades vision and language lived in separate research camps. CLIP collapsed the wall between them.</strong> By learning a shared embedding space where pictures and captions sit close together, OpenAI's CLIP model unlocked zero-shot classification, image-text retrieval, and the text understanding inside Stable Diffusion.</p>

<p class="l-text">In this lesson you will learn the contrastive image-text objective, how zero-shot classification works, image-text retrieval, open-vocabulary detection, and modern multimodal LLMs like LLaVA and BLIP.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Train a contrastive image-text encoder pair with CLIP's InfoNCE objective</li>
<li>Run zero-shot classification by ranking class prompts against an image</li>
<li>Build cosine-similarity image-text retrieval over a small photo collection</li>
<li>Detect arbitrary object names with open-vocabulary OWL-ViT and Grounding DINO</li>
<li>Call multimodal LLMs LLaVA and BLIP for image captioning and VQA</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Bridging Vision and Language</h2>
<p class="l-text">A multimodal model lives in two worlds at once. CLIP's recipe: train an image encoder and a text encoder so that matched (image, caption) pairs land at the same point in a shared D-dim space, while mismatched pairs are pushed apart.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Image encoder</div><div class="card-body">Vision Transformer or ResNet that produces a vector per image.</div></div>
<div class="calc-card"><div class="card-title">Text encoder</div><div class="card-body">Causal Transformer producing a vector per caption.</div></div>
<div class="calc-card"><div class="card-title">Shared space</div><div class="card-body">L2-normalized D-dim vectors. Cosine similarity → match score.</div></div>
<div class="calc-card"><div class="card-title">Training data</div><div class="card-body">CLIP trained on 400M image-caption pairs scraped from the web.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Contrastive Loss</h2>
<p class="l-text">In each batch of N (image, text) pairs, the model computes an N x N similarity matrix. The diagonal entries are the matching pairs; off-diagonal are negatives.</p>
<div class="katex-block">$$L = -\\frac{1}{N}\\sum_i \\log \\frac{\\exp(\\text{sim}(I_i, T_i)/\\tau)}{\\sum_j \\exp(\\text{sim}(I_i, T_j)/\\tau)}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Numerator</div><div class="card-body">Score of the correct match.</div></div>
<div class="calc-card"><div class="card-title">Denominator</div><div class="card-body">Sum over all texts in the batch — softmax over candidates.</div></div>
<div class="calc-card"><div class="card-title">Temperature τ</div><div class="card-body">Learnable scalar that controls sharpness of the softmax.</div></div>
<div class="calc-card"><div class="card-title">Symmetric</div><div class="card-body">Apply the same loss in the text-to-image direction; final loss = average.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Zero-Shot Classification</h2>
<p class="l-text">A trained CLIP can classify images into arbitrary categories — without any fine-tuning. You just write the candidate labels as natural-language prompts and pick the one with highest similarity.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> CLIPProcessor, CLIPModel
<span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> torch

model = CLIPModel.<span class="fn">from_pretrained</span>(<span class="str">'openai/clip-vit-base-patch32'</span>)
proc  = CLIPProcessor.<span class="fn">from_pretrained</span>(<span class="str">'openai/clip-vit-base-patch32'</span>)

image = Image.<span class="fn">open</span>(<span class="str">'photo.jpg'</span>)
labels = [<span class="str">'a dog'</span>, <span class="str">'a cat'</span>, <span class="str">'a horse'</span>, <span class="str">'a car'</span>]
inputs = <span class="fn">proc</span>(text=labels, images=image, return_tensors=<span class="str">'pt'</span>, padding=<span class="kw">True</span>)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs)

probs = out.logits_per_image.<span class="fn">softmax</span>(-<span class="num">1</span>)[<span class="num">0</span>]
<span class="kw">for</span> lbl, p <span class="kw">in</span> <span class="fn">zip</span>(labels, probs):
    <span class="fn">print</span>(f<span class="str">'{lbl}: {p:.3f}'</span>)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toy CLIP: TF-IDF text vector + flattened mean-pooled image vector, projected to a shared 16-D space; cosine similarity gives the text-image score.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

texts_q = ['a colorful cat picture', 'a green mountain', 'red abstract art']

# Text embeddings
v = TfidfVectorizer(max_features=16).fit(texts_q + list(df_reviews['text'].head(50)))
T = v.transform(texts_q).toarray()
T = np.pad(T, ((0,0),(0, max(0, 16 - T.shape[1]))))[:, :16]

# Image embedding: per-channel mean over 4x4 grid -&gt; 48 dims, then pad to 16 by mean-pool
patches = img.reshape(4, 16, 4, 16, 3).mean(axis=(1, 3))  # (4,4,3)
img_vec = patches.mean(axis=(0, 1))                       # (3,)
img_vec = np.tile(img_vec, 16)[:16] / 255.0

sims = cosine_similarity(T, img_vec.reshape(1, -1)).flatten()
for t, s in zip(texts_q, sims):
    print(f'{round(float(s),3):&gt;6}   {t}')</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Load the public CLIP model and matching processor. 2) Build a list of candidate labels in natural language ("a dog" works better than just "dog" because the training data uses captions). 3) The processor tokenizes texts and resizes/normalizes the image. 4) <code>logits_per_image</code> is the similarity matrix; softmax over candidates gives probabilities for each label.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Image-Text Retrieval</h2>
<p class="l-text">Once images and texts share a space, search becomes a vector lookup.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Index</div><div class="card-body">Encode all images once, store vectors in FAISS / pgvector.</div></div>
<div class="calc-card"><div class="card-title">Text → image</div><div class="card-body">Encode the query text, find nearest image vectors.</div></div>
<div class="calc-card"><div class="card-title">Image → text</div><div class="card-body">Encode query image, find nearest captions.</div></div>
<div class="calc-card"><div class="card-title">Apps</div><div class="card-body">Photo libraries, e-commerce search, content moderation.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Open-Vocabulary Detection</h2>
<p class="l-text">Traditional detectors are stuck with their training classes. Open-vocabulary models like OWL-ViT and GroundingDINO use CLIP-style text encoders to detect anything you can describe.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">OWL-ViT</div><div class="card-body">ViT-based detector with text-conditioned classification head.</div></div>
<div class="calc-card"><div class="card-title">GroundingDINO</div><div class="card-body">Combines DINO detector with grounded language alignment.</div></div>
<div class="calc-card"><div class="card-title">SAM + CLIP</div><div class="card-body">SAM produces masks; CLIP labels each mask. Modular and powerful.</div></div>
<div class="calc-card"><div class="card-title">Use cases</div><div class="card-body">Robotics, AR, accessibility, content moderation at scale.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Multimodal LLMs: BLIP, LLaVA, Flamingo</h2>
<p class="l-text">The next step beyond CLIP: multimodal language models that take images <em>and</em> text as input and generate text answers.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BLIP / BLIP-2</div><div class="card-body">Vision encoder + Q-Former + LLM. Captioning, VQA, retrieval.</div></div>
<div class="calc-card"><div class="card-title">LLaVA</div><div class="card-body">CLIP-ViT features projected into a Llama LLM. Open-source flagship.</div></div>
<div class="calc-card"><div class="card-title">Flamingo</div><div class="card-body">DeepMind's gated cross-attention architecture for few-shot multimodal.</div></div>
<div class="calc-card"><div class="card-title">GPT-4V, Gemini</div><div class="card-body">Closed multimodal models with broad capabilities.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> BlipProcessor, BlipForConditionalGeneration
proc  = BlipProcessor.<span class="fn">from_pretrained</span>(<span class="str">'Salesforce/blip-image-captioning-base'</span>)
model = BlipForConditionalGeneration.<span class="fn">from_pretrained</span>(<span class="str">'Salesforce/blip-image-captioning-base'</span>)

inputs = <span class="fn">proc</span>(image, return_tensors=<span class="str">'pt'</span>)
caption = proc.<span class="fn">decode</span>(model.<span class="fn">generate</span>(**inputs)[<span class="num">0</span>], skip_special_tokens=<span class="kw">True</span>)
<span class="fn">print</span>(caption)   <span class="cm"># e.g. 'a dog running across a sunny field'</span>
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toy captioning: pick the most similar caption from a candidate list using TF-IDF + image color statistics — same retrieval pattern BLIP-2 uses internally.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

candidates = [
    'a vibrant colorful image',
    'a dark grayscale photograph',
    'a green-dominated landscape',
    'a red abstract painting'
]

# Image features: rgb means
r, g, b = img[...,0].mean(), img[...,1].mean(), img[...,2].mean()
descr = []
if g &gt; r and g &gt; b: descr.append('green')
if r &gt; g: descr.append('red')
if (r + g + b) / 3 &lt; 100: descr.append('dark')
if abs(r - g) &lt; 5 and abs(g - b) &lt; 5: descr.append('grayscale')

img_text = ' '.join(descr) or 'colorful image'

v = TfidfVectorizer().fit(candidates + [img_text])
sims = cosine_similarity(v.transform([img_text]), v.transform(candidates)).flatten()
best = int(np.argmax(sims))
print('image features:', img_text)
print('caption       :', candidates[best])
print('score         :', round(float(sims[best]), 3))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Load BLIP image-captioning model. 2) Processor handles image preprocessing. 3) <code>generate</code> runs autoregressive decoding to produce a caption. 4) Decode tokens to text. Same pattern with text input enables visual question answering.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Zero-Shot vs Supervised Comparison</h2>
<p class="l-text">CLIP zero-shot is impressive; a fine-tuned supervised model still wins on its specific task — but the gap is small.</p>
<div id="cv-l10-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> CLIP places images and text in a shared embedding space.<br><strong>2.</strong> The contrastive loss matches diagonal pairs and pushes off-diagonal apart.<br><strong>3.</strong> Zero-shot classification needs only natural-language label prompts.<br><strong>4.</strong> Image ↔ text retrieval becomes nearest-neighbor search.<br><strong>5.</strong> Open-vocabulary detectors (OWL-ViT, GroundingDINO) detect anything describable.<br><strong>6.</strong> Multimodal LLMs (BLIP, LLaVA) combine vision encoders with LLMs for captioning and VQA.<br><strong>7.</strong> InternVL and Qwen2-VL are the 2024 open multimodal LLM SOTA; Depth Anything v2 is the zero-shot depth foundation model.<br><strong>8.</strong> Next lesson: deploying these models in production — quantization, ONNX, edge.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Landscape: InternVL, Qwen2-VL, Depth Anything v2</h2>
<p class="l-text"><strong>InternVL (OpenGVLab, 2024)</strong> scales the vision encoder up to 6B (InternViT-6B) and pairs it with an LLM via QLLaMA, reaching up to 26B total params. The flagship InternVL 1.5 / 2 narrowed the gap to GPT-4V on most multimodal benchmarks while staying fully open-weight. The trick: build a vision encoder as large as the language model, not a tiny adapter clipped to a giant LLM.</p>
<p class="l-text"><strong>Qwen2-VL (Alibaba, August 2024)</strong> introduces dynamic resolution — the model adapts to images of any aspect ratio and resolution, no fixed 224x224 — and Multimodal RoPE that encodes 2D position into rotary embeddings. The 72B variant understands video up to 20 minutes long with second-level localization, and the 7B variant runs on a single consumer GPU while leading open-source on DocVQA, MathVista, and visual agent tasks.</p>
<p class="l-text"><strong>Depth Anything v2 (Hong Kong U + TikTok, June 2024)</strong> is the modern zero-shot relative-depth model. v2 retrains on 1.5M synthetic-rendered images plus 62M unlabeled real images distilled by a teacher, fixing the "hairy edges and transparency" failures of v1. It produces dense per-pixel depth from any photo with no calibration — used in 3D photography, NeRF priors, robotic grasping, and image-editing depth-of-field.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Which to Pick</div><div class="card-body">Multimodal LLM for chat / VQA: Qwen2-VL-7B or InternVL2-8B (open). Pure depth: Depth Anything v2 (small / base / large).</div></div>
<div class="calc-card"><div class="card-title">NLP Crossover</div><div class="card-body">Qwen2-VL's dynamic resolution + Multimodal RoPE is the same RoPE used in Llama-style LLMs, extended to 2D. The NLP positional encoding toolbox now drives vision too.</div></div>
<div class="calc-card"><div class="card-title">Licenses</div><div class="card-body">InternVL: MIT. Qwen2-VL: Tongyi Qianwen (commercial OK with conditions). Depth Anything v2: Apache 2.0 (small/base) and CC-BY-NC-4.0 (large).</div></div>
</div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var tasks = ['ImageNet','CIFAR-100','Food-101','Pets','Flowers'];
  var sup   = [0.86, 0.81, 0.92, 0.93, 0.97];
  var clip  = [0.76, 0.71, 0.88, 0.88, 0.71];
  var t1 = { x:tasks, y:sup,  name:'Supervised',     type:'bar', marker:{color:'#888'} };
  var t2 = { x:tasks, y:clip, name:'CLIP zero-shot', type:'bar', marker:{color:'#c8a96e'} };
  var layout = { barmode:'group', margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'Accuracy'} };
  var en = document.getElementById('cv-l10-plot-en'); if (en) Plotly.newPlot(en, [t1,t2], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l10-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:tasks,y:sup,name:'Denetimli',type:'bar',marker:{color:'#888'}},{x:tasks,y:clip,name:'CLIP sıfır-atış',type:'bar',marker:{color:'#c8a96e'}}], Object.assign({}, layout, {yaxis:{title:'Doğruluk'}}), {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Onlarca yıl görme ve dil ayrı araştırma kamplarında yaşadı. CLIP arasındaki duvarı yıktı.</strong> Görüntüler ve altyazıların birbirine yakın olduğu paylaşımlı bir gömme uzayı öğrenerek OpenAI'nin CLIP modeli sıfır-atış sınıflandırmayı, görüntü-metin erişimini ve Stable Diffusion içindeki metin anlayışını mümkün kıldı.</p>

<p class="l-text">Bu derste karşılaştırmalı görüntü-metin amacını, sıfır-atış sınıflandırmanın nasıl çalıştığını, görüntü-metin erişimini, açık sözlüklü tespiti ve LLaVA, BLIP gibi modern çok modlu LLM'leri öğreneceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>CLIP'in InfoNCE amacıyla karşılaştırmalı görüntü-metin enkoder çifti eğitmeyi</li>
<li>Sınıf promptlarını bir görüntüye karşı sıralayarak sıfır-atış sınıflandırma yapmayı</li>
<li>Küçük bir fotoğraf koleksiyonu üzerinde kosinüs benzerliği ile görüntü-metin erişimi kurmayı</li>
<li>Açık sözlüklü OWL-ViT ve Grounding DINO ile keyfi nesne adlarını tespit etmeyi</li>
<li>Çok modlu LLM'ler LLaVA ve BLIP'i görüntü altyazılama ve VQA için çağırmayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Görme ile Dili Köprülemek</h2>
<p class="l-text">Çok modlu model aynı anda iki dünyada yaşar. CLIP'in tarifi: görüntü enkoderi ve metin enkoderini, eşleşen (görüntü, altyazı) çiftleri paylaşımlı D boyutlu uzayda aynı noktaya düşecek, eşleşmeyen çiftler birbirinden uzaklaşacak şekilde eğit.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Görüntü enkoderi</div><div class="card-body">Görüntü başına vektör üreten Vision Transformer ya da ResNet.</div></div>
<div class="calc-card"><div class="card-title">Metin enkoderi</div><div class="card-body">Altyazı başına vektör üreten nedensel Transformer.</div></div>
<div class="calc-card"><div class="card-title">Paylaşımlı uzay</div><div class="card-body">L2 normalize edilmiş D boyutlu vektörler. Kosinüs benzerliği → eşleşme skoru.</div></div>
<div class="calc-card"><div class="card-title">Eğitim verisi</div><div class="card-body">CLIP webten kazınmış 400M görüntü-altyazı çiftiyle eğitildi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Karşılaştırmalı Kayıp</h2>
<p class="l-text">N (görüntü, metin) çiftli her batch'te model N x N benzerlik matrisi hesaplar. Köşegen elemanları doğru çiftler; köşegen dışı negatiflerdir.</p>
<div class="katex-block">$$L = -\\frac{1}{N}\\sum_i \\log \\frac{\\exp(\\text{sim}(I_i, T_i)/\\tau)}{\\sum_j \\exp(\\text{sim}(I_i, T_j)/\\tau)}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pay</div><div class="card-body">Doğru eşleşmenin skoru.</div></div>
<div class="calc-card"><div class="card-title">Payda</div><div class="card-body">Batch'teki tüm metinler üzerinde toplam — adaylar üzerinde softmax.</div></div>
<div class="calc-card"><div class="card-title">Sıcaklık τ</div><div class="card-body">Softmax keskinliğini kontrol eden öğrenilebilir skaler.</div></div>
<div class="calc-card"><div class="card-title">Simetrik</div><div class="card-body">Aynı kayıp metinden görüntüye yönde de uygulanır; toplam kayıp ortalama.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Sıfır-Atış Sınıflandırma</h2>
<p class="l-text">Eğitilmiş bir CLIP, hiç ince ayar yapmadan görüntüleri keyfi kategorilere sınıflar. Sadece aday etiketleri doğal dil prompt'u olarak yazar ve en yüksek benzerliği seçersiniz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> CLIPProcessor, CLIPModel
<span class="kw">from</span> PIL <span class="kw">import</span> Image
<span class="kw">import</span> torch

model = CLIPModel.<span class="fn">from_pretrained</span>(<span class="str">'openai/clip-vit-base-patch32'</span>)
proc  = CLIPProcessor.<span class="fn">from_pretrained</span>(<span class="str">'openai/clip-vit-base-patch32'</span>)

gor = Image.<span class="fn">open</span>(<span class="str">'foto.jpg'</span>)
etiketler = [<span class="str">'bir köpek'</span>, <span class="str">'bir kedi'</span>, <span class="str">'bir at'</span>, <span class="str">'bir araba'</span>]
inputs = <span class="fn">proc</span>(text=etiketler, images=gor, return_tensors=<span class="str">'pt'</span>, padding=<span class="kw">True</span>)

<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs)

probs = out.logits_per_image.<span class="fn">softmax</span>(-<span class="num">1</span>)[<span class="num">0</span>]
<span class="kw">for</span> e, p <span class="kw">in</span> <span class="fn">zip</span>(etiketler, probs):
    <span class="fn">print</span>(f<span class="str">'{e}: {p:.3f}'</span>)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak CLIP: TF-IDF metin vektörü + düzleştirilmiş mean-pooled görüntü vektörü, paylaşılan 16-D uzaya yansıtılır; cosine similarity metin-görüntü skoru.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

sorgular = ['rengarenk bir kedi fotoğrafı', 'yeşil bir dağ', 'kırmızı soyut sanat']

# Metin embedding'leri
v = TfidfVectorizer(max_features=16).fit(sorgular + list(df_reviews['text'].head(50)))
T = v.transform(sorgular).toarray()
T = np.pad(T, ((0,0),(0, max(0, 16 - T.shape[1]))))[:, :16]

# Görüntü embedding'i: 4x4 grid üzerinde kanal başına ortalama -&gt; 48 boyut, sonra mean-pool ile 16'ya pad
yamalar = img.reshape(4, 16, 4, 16, 3).mean(axis=(1, 3))  # (4,4,3)
gorsel_vec = yamalar.mean(axis=(0, 1))                    # (3,)
gorsel_vec = np.tile(gorsel_vec, 16)[:16] / 255.0

skorlar = cosine_similarity(T, gorsel_vec.reshape(1, -1)).flatten()
for t, s in zip(sorgular, skorlar):
    print(f'{round(float(s),3):&gt;6}   {t}')</code></pre></div></div>

<p class="l-text"><strong>Burada dört önemli detay var:</strong> 1) Açık CLIP modelini ve eşleşen processor'u yükle. 2) Aday etiketleri doğal dilde liste yap (eğitim verisi altyazı kullandığı için "bir köpek", sadece "köpek"ten daha iyi çalışır). 3) Processor metinleri tokenize eder ve görüntüyü yeniden boyutlandırır/normalleştirir. 4) <code>logits_per_image</code> benzerlik matrisidir; adaylar üzerinde softmax her etikete olasılık verir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Görüntü-Metin Erişimi</h2>
<p class="l-text">Görüntü ve metinler aynı uzayı paylaştığında arama vektör araması haline gelir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">İndeks</div><div class="card-body">Tüm görüntüleri bir kez kodla, vektörleri FAISS / pgvector'da sakla.</div></div>
<div class="calc-card"><div class="card-title">Metin → görüntü</div><div class="card-body">Sorgu metnini kodla, en yakın görüntü vektörlerini bul.</div></div>
<div class="calc-card"><div class="card-title">Görüntü → metin</div><div class="card-body">Sorgu görüntüsünü kodla, en yakın altyazıları bul.</div></div>
<div class="calc-card"><div class="card-title">Uygulamalar</div><div class="card-body">Foto kütüphaneleri, e-ticaret arama, içerik denetimi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Açık Sözlüklü Tespit</h2>
<p class="l-text">Geleneksel dedektörler eğitim sınıflarına bağlı. OWL-ViT ve GroundingDINO gibi açık sözlüklü modeller CLIP tarzı metin enkoderleriyle tarif edebildiğiniz her şeyi tespit eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">OWL-ViT</div><div class="card-body">Metin koşullu sınıflandırma başlığı olan ViT tabanlı dedektör.</div></div>
<div class="calc-card"><div class="card-title">GroundingDINO</div><div class="card-body">DINO dedektörünü temellendirilmiş dil hizalamasıyla birleştirir.</div></div>
<div class="calc-card"><div class="card-title">SAM + CLIP</div><div class="card-body">SAM maske üretir; CLIP her maskeyi etiketler. Modüler ve güçlü.</div></div>
<div class="calc-card"><div class="card-title">Kullanım</div><div class="card-body">Robotik, AR, erişilebilirlik, ölçekte içerik denetimi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Çok Modlu LLM'ler: BLIP, LLaVA, Flamingo</h2>
<p class="l-text">CLIP'in ötesindeki sonraki adım: girdi olarak görüntü <em>ve</em> metin alıp metin yanıt üreten çok modlu dil modelleri.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BLIP / BLIP-2</div><div class="card-body">Görme enkoderi + Q-Former + LLM. Altyazı, VQA, erişim.</div></div>
<div class="calc-card"><div class="card-title">LLaVA</div><div class="card-body">CLIP-ViT özellikleri Llama LLM'e yansıtılır. Açık kaynak amiral gemisi.</div></div>
<div class="calc-card"><div class="card-title">Flamingo</div><div class="card-body">DeepMind'in az-atış çok modal için kapılı çapraz dikkat mimarisi.</div></div>
<div class="calc-card"><div class="card-title">GPT-4V, Gemini</div><div class="card-body">Geniş kapasiteli kapalı çok modlu modeller.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> BlipProcessor, BlipForConditionalGeneration
proc  = BlipProcessor.<span class="fn">from_pretrained</span>(<span class="str">'Salesforce/blip-image-captioning-base'</span>)
model = BlipForConditionalGeneration.<span class="fn">from_pretrained</span>(<span class="str">'Salesforce/blip-image-captioning-base'</span>)

inputs = <span class="fn">proc</span>(gor, return_tensors=<span class="str">'pt'</span>)
altyazi = proc.<span class="fn">decode</span>(model.<span class="fn">generate</span>(**inputs)[<span class="num">0</span>], skip_special_tokens=<span class="kw">True</span>)
<span class="fn">print</span>(altyazi)   <span class="cm"># örn. 'güneşli bir tarlada koşan bir köpek'</span>
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak captioning: TF-IDF + görüntü renk istatistikleriyle aday listeden en benzer açıklamayı seç — BLIP-2'nin içinde kullandığı retrieval kalıbı.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

adaylar = [
    'canlı renkli bir görüntü',
    'koyu gri tonlu bir fotoğraf',
    'yeşilin baskın olduğu bir manzara',
    'kırmızı soyut bir tablo'
]

# Görüntü öznitelikleri: rgb ortalamaları
r, g, b = img[...,0].mean(), img[...,1].mean(), img[...,2].mean()
ozellikler = []
if g &gt; r and g &gt; b: ozellikler.append('yeşil')
if r &gt; g: ozellikler.append('kırmızı')
if (r + g + b) / 3 &lt; 100: ozellikler.append('koyu')
if abs(r - g) &lt; 5 and abs(g - b) &lt; 5: ozellikler.append('gri tonlu')

gorsel_metni = ' '.join(ozellikler) or 'renkli görüntü'

v = TfidfVectorizer().fit(adaylar + [gorsel_metni])
skorlar = cosine_similarity(v.transform([gorsel_metni]), v.transform(adaylar)).flatten()
en_iyi = int(np.argmax(skorlar))
print('görüntü öznitelikleri:', gorsel_metni)
print('açıklama             :', adaylar[en_iyi])
print('skor                 :', round(float(skorlar[en_iyi]), 3))</code></pre></div></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) BLIP görüntü-altyazı modelini yükle. 2) Processor görüntü ön işlemeyi yapar. 3) <code>generate</code> otoregresif kod çözmeyi koşturup altyazı üretir. 4) Tokenleri metne çöz. Aynı desen metin girdisiyle görsel soru yanıtlamayı mümkün kılar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Sıfır-Atış ve Denetimli Karşılaştırma</h2>
<p class="l-text">CLIP sıfır-atış etkileyici; ince ayarlı denetimli model özel görevde hâlâ kazanır — ama fark küçük.</p>
<div id="cv-l10-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> CLIP görüntü ve metni paylaşımlı bir gömme uzayına yerleştirir.<br><strong>2.</strong> Karşılaştırmalı kayıp köşegen çiftleri eşler ve köşegen dışını iter.<br><strong>3.</strong> Sıfır-atış sınıflandırma yalnızca doğal dil etiket prompt'u ister.<br><strong>4.</strong> Görüntü ↔ metin erişimi en yakın komşu aramasına dönüşür.<br><strong>5.</strong> Açık sözlüklü dedektörler (OWL-ViT, GroundingDINO) tarif edilen her şeyi tespit eder.<br><strong>6.</strong> Çok modlu LLM'ler (BLIP, LLaVA) görme enkoderlerini LLM'lerle birleştirir.<br><strong>7.</strong> InternVL ve Qwen2-VL 2024'ün açık çok modlu LLM SOTA'sıdır; Depth Anything v2 sıfır-atış derinlik temel modelidir.<br><strong>8.</strong> Sonraki ders: bu modelleri üretime almak — kuantizasyon, ONNX, kenar.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024-2026 Panorama: InternVL, Qwen2-VL, Depth Anything v2</h2>
<p class="l-text"><strong>InternVL (OpenGVLab, 2024)</strong>, görme enkoderini 6B'ye (InternViT-6B) ölçekler ve QLLaMA üzerinden bir LLM ile eşler; toplamda 26B parametreye ulaşır. Amiral gemi InternVL 1.5 / 2, çoğu çok modlu kıyaslamada GPT-4V'ye olan farkı kapatırken tamamen açık ağırlıklı kalır. Numara şu: görme enkoderini, dev bir LLM'e tutturulmuş küçük bir adaptör değil, dil modeli kadar büyük yap.</p>
<p class="l-text"><strong>Qwen2-VL (Alibaba, Ağustos 2024)</strong>, dinamik çözünürlük getirir — model herhangi bir en-boy oranı ve çözünürlükteki görüntüye uyum sağlar, sabit 224x224 yok — ve 2D konumu döner gömmelere kodlayan Multimodal RoPE kullanır. 72B varyantı 20 dakikaya kadar videoyu saniye düzeyinde lokalize ederek anlar; 7B varyantı tek bir tüketici GPU'sunda çalışırken DocVQA, MathVista ve görsel ajan görevlerinde açık kaynak liderliğini elinde tutar.</p>
<p class="l-text"><strong>Depth Anything v2 (Hong Kong Ü. + TikTok, Haziran 2024)</strong> modern sıfır-atış göreli derinlik modelidir. v2, 1.5M sentetik render edilmiş görüntü artı bir öğretmen tarafından damıtılan 62M etiketsiz gerçek görüntü ile yeniden eğitilir; v1'in "tüylü kenarlar ve şeffaflık" başarısızlıklarını giderir. Herhangi bir fotoğraftan kalibrasyon gerektirmeden piksel başına yoğun derinlik üretir — 3D fotoğraf, NeRF öncülleri, robotik kavrama ve görüntü düzenlemede alan derinliği için kullanılır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hangisini Seç</div><div class="card-body">Sohbet / VQA için çok modlu LLM: Qwen2-VL-7B veya InternVL2-8B (açık). Saf derinlik: Depth Anything v2 (small / base / large).</div></div>
<div class="calc-card"><div class="card-title">NLP Köprüsü</div><div class="card-body">Qwen2-VL'in dinamik çözünürlüğü + Multimodal RoPE, Llama tarzı LLM'lerde kullanılan aynı RoPE'nin 2D'ye genişletilmiş halidir. NLP konum kodlama kutusu artık görmeyi de sürüyor.</div></div>
<div class="calc-card"><div class="card-title">Lisanslar</div><div class="card-body">InternVL: MIT. Qwen2-VL: Tongyi Qianwen (koşullarla ticari serbest). Depth Anything v2: Apache 2.0 (small/base) ve CC-BY-NC-4.0 (large).</div></div>
</div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var tasks = ['ImageNet','CIFAR-100','Food-101','Pets','Flowers'];
  var sup   = [0.86, 0.81, 0.92, 0.93, 0.97];
  var clip  = [0.76, 0.71, 0.88, 0.88, 0.71];
  var t1 = { x:tasks, y:sup,  name:'Supervised',     type:'bar', marker:{color:'#888'} };
  var t2 = { x:tasks, y:clip, name:'CLIP zero-shot', type:'bar', marker:{color:'#c8a96e'} };
  var layout = { barmode:'group', margin:{t:20,r:20,b:60,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, yaxis:{title:'Doğruluk'} };
  var en = document.getElementById('cv-l10-plot-en'); if (en) Plotly.newPlot(en, [t1,t2], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l10-plot-tr'); if (tr) Plotly.newPlot(tr, [{x:tasks,y:sup,name:'Denetimli',type:'bar',marker:{color:'#888'}},{x:tasks,y:clip,name:'CLIP sıfır-atış',type:'bar',marker:{color:'#c8a96e'}}], Object.assign({}, layout, {yaxis:{title:'Doğruluk'}}), {displayModeBar:false});
}, 250);</script>
`
};
