window.MULTIMODAL_L2 = {
en: `<p class="l-text"><strong>CLIP is the single most influential multimodal paper of the decade.</strong> Before it, image-text models needed expensive labeled data and produced narrow classifiers. After it, you could build a zero-shot recognizer for any concept by writing a sentence: "a photo of a {class}" — no fine-tuning, no labels, no per-task training. The 400M (image, caption) pairs scraped from the web, the dual-encoder architecture, and the contrastive InfoNCE objective are now the default recipe across retrieval, search, moderation, dataset filtering (LAION used CLIP scores to clean its 5B), and as the visual front-end of every major VLM through 2024.</p>

<p class="l-text">In this lesson we take CLIP apart and rebuild it. We cover the architecture (ViT-B/32 → ViT-L/14 → ViT-H/14 image towers; a Transformer text tower), the contrastive loss in full mathematical detail, the WIT-400M dataset and its biases, the zero-shot transfer protocol that gave 75–78% top-5 on ImageNet, and the descendants — <strong>OpenCLIP</strong> (Ilharco 2021, scaled to ViT-G/14 on LAION-2B), <strong>EVA-CLIP</strong> (BAAI 2023, masked-image-modeling pretraining), and <strong>SigLIP</strong> (Zhai et al. Google, Mar 2023) which replaced softmax with sigmoid and became the new visual encoder of choice for VLMs (used in PaLI-3, Gemini, Idefics2, and Pixtral).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Reconstruct CLIP's dual-tower architecture and the role of the learned temperature parameter</li>
<li>Derive the symmetric InfoNCE loss and explain why batch size matters so much (32K negatives in a single step)</li>
<li>Run zero-shot classification with prompt templates and ensemble them for +1–2% accuracy</li>
<li>Compare CLIP to OpenCLIP, EVA-CLIP, and SigLIP — when to pick which</li>
<li>Identify CLIP's known weaknesses: composition, counting, fine-grained text in images, modality gap</li>
<li>Apply CLIP scores in production: dataset filtering, retrieval, content moderation, similarity search</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Architecture — Two Towers, One Embedding Space</h2>
<p class="l-text">CLIP is two encoders, both projecting into a shared d-dimensional unit-norm space. The original paper trained five image variants (ResNet-50, ResNet-101, RN50x4, RN50x16, RN50x64) and three ViTs (ViT-B/32, ViT-B/16, ViT-L/14). The ViT variants ate the field; ViT-L/14 trained at 336px ("CLIP@336") is still a strong baseline today. The text tower is a 12-layer Transformer (63M params) with a 49,408-token BPE vocabulary and a 77-token max length.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Image tower</div><div class="card-body">ViT-L/14: 224×224 input → 14×14 patches → 256 patch tokens + 1 CLS → 24 transformer layers, 16 heads, 1024 hidden → take CLS → linear projection to 768-dim → L2 normalize.</div></div>
<div class="calc-card"><div class="card-title">Text tower</div><div class="card-body">BPE tokenize → 77 tokens (pad/truncate) → 12 transformer layers, 8 heads, 512 hidden → take EOT token's hidden state → linear projection to 768-dim → L2 normalize.</div></div>
<div class="calc-card"><div class="card-title">Shared space</div><div class="card-body">Both projections land in the same 768-dim sphere. Similarity is just a dot product (since vectors are unit-norm). A learnable temperature τ scales the logits before softmax.</div></div>
<div class="calc-card"><div class="card-title">Parameter counts</div><div class="card-body">ViT-B/32: 151M total. ViT-L/14: 428M. ViT-L/14@336px: 428M (same params, more compute). OpenCLIP ViT-G/14: 2.5B. Big jumps in transfer accuracy with scale.</div></div>
</div>

<div class="calc-highlight"><strong>Why dual towers?</strong> Two encoders that meet only at the output mean you can <em>cache</em> one side. Pre-encode 100M product images once, then for each user query just embed the text and dot-product against the cached vectors. Single-tower (cross-attention) models cannot do this — they re-run the entire model per query.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Contrastive Objective — InfoNCE in Detail</h2>
<p class="l-text">CLIP's loss is the symmetric image-to-text and text-to-image InfoNCE loss. With a batch of N (image, caption) pairs, you compute the N×N similarity matrix S where S[i,j] = cosine(img_i, text_j) / τ. The diagonal is the "matched" pairs; everything off-diagonal is treated as a negative.</p>

<div class="katex-block">$$L_{i2t} = -\\frac{1}{N} \\sum_{i=1}^{N} \\log \\frac{\\exp(s_{i,i}/\\tau)}{\\sum_{j=1}^{N} \\exp(s_{i,j}/\\tau)}$$</div>

<div class="katex-block">$$L_{t2i} = -\\frac{1}{N} \\sum_{j=1}^{N} \\log \\frac{\\exp(s_{j,j}/\\tau)}{\\sum_{i=1}^{N} \\exp(s_{i,j}/\\tau)}, \\quad L = \\frac{L_{i2t} + L_{t2i}}{2}$$</div>

<p class="l-text">The temperature τ is <em>learned</em> (initialized at 0.07, exp parameterization clipped to ≤100). It controls the entropy of the softmax — too cold and gradients vanish; too hot and the model cannot separate negatives.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why batch size matters</div><div class="card-body">Each pair sees N−1 in-batch negatives. CLIP trained at batch size 32,768 across 256 V100s (gradient accumulation + sharded loss). At batch 256 the contrastive signal is much weaker — quality drops sharply.</div></div>
<div class="calc-card"><div class="card-title">Symmetric loss</div><div class="card-body">Both directions are needed. i2t alone makes the image embeddings collapse to a small region; t2i alone does the same to text. Symmetric averaging keeps both spaces full-rank.</div></div>
<div class="calc-card"><div class="card-title">Why not triplet loss?</div><div class="card-body">Triplet (anchor, positive, hard negative) was the pre-2020 default. InfoNCE uses ALL in-batch samples as negatives — strictly more signal per step, no hard-negative mining needed.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The WIT-400M Dataset and Its Successors</h2>
<p class="l-text">CLIP's data was as important as its architecture. OpenAI scraped <strong>WIT-400M</strong> from the public web by querying for 500K English search terms (WordNet entries, bigrams from Wikipedia, common words from queries). For each query they kept up to 20K (image, alt-text) pairs. Total: 400M pairs. The dataset was never released.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">WIT-400M (closed)</div><div class="card-body">OpenAI's original. 400M pairs, English alt-text. Heavy duplication, many low-quality captions ("DSC_0042.jpg"), but the scale dominated all noise.</div></div>
<div class="calc-card"><div class="card-title">LAION-400M / 5B</div><div class="card-body">Schuhmann et al. 2022. Open replication using Common Crawl + CLIP-score filtering (≥0.28 cosine). LAION-2B-en is the English subset; LAION-5B is multilingual. Powered Stable Diffusion v1, OpenCLIP.</div></div>
<div class="calc-card"><div class="card-title">DataComp / DFN</div><div class="card-body">Apple's DataComp (Gadre 2023) showed that <em>filtering matters more than scale</em>: a curated 1.4B subset beat the full 12.8B. DFN-2B (Apple) and Datacomp-XL push state-of-the-art with smaller, cleaner data.</div></div>
<div class="calc-card"><div class="card-title">Bias and copyright</div><div class="card-body">Web scrapes inherit web biases (gender, race, geography). LAION includes copyrighted images, leading to lawsuits (Getty v. Stability, 2023). Frontier labs now use proprietary, licensed datasets.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Zero-Shot Transfer — The Magic Trick</h2>
<p class="l-text">CLIP's headline result was <strong>76.2% top-5 on ImageNet without ever training on ImageNet</strong>. The trick is purely linguistic: encode each class label as a sentence, encode the test image, pick the class whose sentence is closest.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — real CLIP)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real zero-shot ImageNet with HuggingFace CLIP — Pyodide-blocked</span>
<span class="kw">from</span> transformers <span class="kw">import</span> CLIPProcessor, CLIPModel
<span class="kw">import</span> torch
<span class="kw">from</span> PIL <span class="kw">import</span> Image

model = CLIPModel.<span class="fn">from_pretrained</span>(<span class="str">"openai/clip-vit-large-patch14-336"</span>)
proc  = CLIPProcessor.<span class="fn">from_pretrained</span>(<span class="str">"openai/clip-vit-large-patch14-336"</span>)

<span class="cm"># 80-template ensemble from the CLIP paper</span>
templates = [
    <span class="str">"a photo of a {}."</span>, <span class="str">"a blurry photo of a {}."</span>, <span class="str">"a black and white photo of a {}."</span>,
    <span class="str">"a low resolution photo of a {}."</span>, <span class="str">"a rendition of a {}."</span>, <span class="str">"a bad photo of a {}."</span>,
    <span class="str">"a cropped photo of a {}."</span>, <span class="str">"a close-up photo of a {}."</span>,
    <span class="cm"># ... 72 more templates ...</span>
]

<span class="kw">def</span> <span class="fn">zeroshot_classifier</span>(classnames):
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        weights = []
        <span class="kw">for</span> <span class="kw">cls</span> <span class="kw">in</span> classnames:
            texts = [t.<span class="fn">format</span>(<span class="kw">cls</span>) <span class="kw">for</span> t <span class="kw">in</span> templates]
            inputs = <span class="fn">proc</span>(text=texts, return_tensors=<span class="str">"pt"</span>, padding=<span class="kw">True</span>)
            text_features = model.<span class="fn">get_text_features</span>(**inputs)
            text_features = text_features / text_features.<span class="fn">norm</span>(dim=-<span class="num">1</span>, keepdim=<span class="kw">True</span>)
            weights.<span class="fn">append</span>(text_features.<span class="fn">mean</span>(<span class="num">0</span>))           <span class="cm"># ensemble</span>
        <span class="kw">return</span> torch.<span class="fn">stack</span>(weights).T  <span class="cm"># (D, num_classes)</span>

W = <span class="fn">zeroshot_classifier</span>([<span class="str">"cat"</span>, <span class="str">"dog"</span>, <span class="str">"car"</span>, <span class="str">"tree"</span>])
img = Image.<span class="fn">open</span>(<span class="str">"test.jpg"</span>)
img_feat = model.<span class="fn">get_image_features</span>(**<span class="fn">proc</span>(images=img, return_tensors=<span class="str">"pt"</span>))
img_feat = img_feat / img_feat.<span class="fn">norm</span>(dim=-<span class="num">1</span>, keepdim=<span class="kw">True</span>)
logits = (img_feat @ W).<span class="fn">softmax</span>(dim=-<span class="num">1</span>)
<span class="fn">print</span>(logits)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy zero-shot classifier with TF-IDF on prompt templates and flattened image features. It captures the prompt-ensembling principle: averaging multiple templates per class reduces variance.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

classes = [<span class="str">"cat"</span>, <span class="str">"dog"</span>, <span class="str">"car"</span>]
templates = [
    <span class="str">"a photo of a {}"</span>, <span class="str">"a picture of a {}"</span>, <span class="str">"a close-up of a {}"</span>,
    <span class="str">"a blurry photo of a {}"</span>, <span class="str">"a bright photo of a {}"</span>,
]

<span class="cm"># Make a "training corpus" so TF-IDF has a vocabulary</span>
corpus = [t.<span class="fn">format</span>(c) <span class="kw">for</span> c <span class="kw">in</span> classes <span class="kw">for</span> t <span class="kw">in</span> templates]
corpus += [<span class="str">"sky"</span>, <span class="str">"tree"</span>, <span class="str">"building"</span>, <span class="str">"person"</span>, <span class="str">"ocean"</span>]
vec = <span class="fn">TfidfVectorizer</span>().<span class="fn">fit</span>(corpus)

<span class="cm"># Per-class ensemble: average TF-IDF of all templates for that class</span>
class_embs = []
<span class="kw">for</span> c <span class="kw">in</span> classes:
    embs = vec.<span class="fn">transform</span>([t.<span class="fn">format</span>(c) <span class="kw">for</span> t <span class="kw">in</span> templates]).<span class="fn">toarray</span>()
    embs = embs / (np.linalg.<span class="fn">norm</span>(embs, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>)
    class_embs.<span class="fn">append</span>(embs.<span class="fn">mean</span>(<span class="num">0</span>))
W = np.<span class="fn">stack</span>(class_embs)  <span class="cm"># (3, vocab)</span>

<span class="cm"># A fake "image embedding": project img mean to caption space via fixed random map</span>
np.random.<span class="fn">seed</span>(<span class="num">1</span>)
img_3 = np.random.<span class="fn">rand</span>(<span class="num">16</span>, <span class="num">16</span>, <span class="num">3</span>) * <span class="num">0.3</span>   <span class="cm"># darkish image</span>
img_feat = img_3.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))  <span class="cm"># (3,)</span>
proj = np.random.<span class="fn">RandomState</span>(<span class="num">0</span>).<span class="fn">randn</span>(<span class="num">3</span>, W.shape[<span class="num">1</span>])
img_emb = img_feat @ proj
img_emb = img_emb / (np.linalg.<span class="fn">norm</span>(img_emb) + <span class="num">1e-9</span>)

logits = W @ img_emb
probs = np.<span class="fn">exp</span>(logits - logits.<span class="fn">max</span>())
probs /= probs.<span class="fn">sum</span>()
<span class="kw">for</span> c, p <span class="kw">in</span> <span class="fn">zip</span>(classes, probs):
    <span class="fn">print</span>(f<span class="str">"{c:5s}: {p:.3f}"</span>)
</code></pre></div>
</div>

<p class="l-text">Two production tips from the original paper: (1) Always use prompt templates, not bare class names — "a photo of a cat" beats "cat" by 1.3% on ImageNet. (2) Ensemble across templates — averaging the text embeddings of 80 templates beats any single template by 3.5%.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. OpenCLIP, EVA-CLIP, and SigLIP — The Descendants</h2>
<p class="l-text">CLIP weights were released but the dataset was not. OpenCLIP, EVA-CLIP, and SigLIP each fixed something the original missed. By 2026 SigLIP is the default visual encoder for new VLMs.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenCLIP (Ilharco 2021–)</div><div class="card-body">Open-source replication on LAION-400M, then LAION-2B-en. Scaled up to ViT-G/14 (2.5B params, batch 160K). Ships under the open_clip PyPI package. Backbone for Stable Diffusion text-conditioning.</div></div>
<div class="calc-card"><div class="card-title">EVA-CLIP (BAAI, Sun 2023)</div><div class="card-body">Pretrains the ViT first with masked image modeling (predicting CLIP features as targets), then runs CLIP-style contrastive. Result: ViT-E/14+ at 5B params, +5% on ImageNet zero-shot over OpenCLIP at the same scale.</div></div>
<div class="calc-card"><div class="card-title">SigLIP (Zhai, Google 2023)</div><div class="card-body">Replaces softmax with sigmoid: each (i,j) pair gets an independent binary label. No need for the global softmax denominator → no need for huge batches → trains efficiently at batch 16K instead of 32K. SigLIP-So400m-14-384 is the de-facto encoder for Idefics2, PaLI-3, Pixtral, LLaVA-OneVision.</div></div>
<div class="calc-card"><div class="card-title">When to pick which</div><div class="card-body"><em>Retrieval at scale</em>: OpenCLIP ViT-G or SigLIP-So400m. <em>VLM front-end</em>: SigLIP (high-res, efficient). <em>Research with limited compute</em>: EVA-CLIP (best params/accuracy). <em>Legacy / reproducibility</em>: original OpenAI CLIP.</div></div>
</div>

<div class="katex-block">$$L_{\\text{SigLIP}} = -\\frac{1}{N}\\sum_{i,j} \\log \\sigma\\!\\left(z_{ij}\\,(t \\, s_{ij} + b)\\right), \\quad z_{ij} = \\begin{cases}+1 & i=j\\\\-1 & i\\ne j\\end{cases}$$</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Known Weaknesses and the Modality Gap</h2>
<p class="l-text">CLIP is brilliant at coarse semantics and poor at several specific things. Understanding the failure modes is required reading before you ship a CLIP-powered product.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Composition / binding</div><div class="card-body">"A red cube on a blue sphere" vs "a blue cube on a red sphere" — CLIP often scores them nearly identically. The model encodes a bag of attributes, not bound (object, attribute) pairs. Fix: ARO benchmark; structured-attention variants like NegCLIP.</div></div>
<div class="calc-card"><div class="card-title">Counting</div><div class="card-body">Cannot reliably tell "two dogs" from "three dogs". Visual encoder pools too aggressively. Specialized counters (CountBench, FairFace) needed.</div></div>
<div class="calc-card"><div class="card-title">Fine-grained text in images</div><div class="card-body">Cannot read text in photos at small scale. SigLIP at 384 helps; for documents, switch to OCR-aware encoders (LayoutLM, Donut — see L6).</div></div>
<div class="calc-card"><div class="card-title">Modality gap (Liang 2022)</div><div class="card-body">Image and text embeddings actually live in <em>different cones</em> of the unit sphere — not interleaved as you might assume. The gap is intrinsic to contrastive training. Affects retrieval thresholds; addressed by post-hoc calibration or hubness reduction.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. CLIP in Production — Four Real Use Cases</h2>
<p class="l-text">CLIP is not just an academic artifact. Four high-impact production patterns:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dataset filtering</div><div class="card-body">LAION used CLIP scores ≥0.28 to filter Common Crawl image-text pairs. Stable Diffusion was trained on the result. Without CLIP filtering, the dataset is mostly noise.</div></div>
<div class="calc-card"><div class="card-title">Image search / retrieval</div><div class="card-body">Pre-encode catalog (millions of product images), index with FAISS or HNSW. At query time embed the text, top-k nearest neighbors. Pinterest's visual search and many e-commerce platforms work this way.</div></div>
<div class="calc-card"><div class="card-title">Content moderation</div><div class="card-body">Score images against text prompts like "violence", "weapons", "explicit content". Cheap first-pass filter; combined with specialized classifiers for high-precision rules.</div></div>
<div class="calc-card"><div class="card-title">VLM visual front-end</div><div class="card-body">LLaVA, Idefics, BLIP-2, MiniGPT-4 all use frozen CLIP/SigLIP as the image encoder. The LLM does the language; CLIP does the seeing.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Toy retrieval index — using sklearn for the kNN part, CLIP-style for the embeddings</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

<span class="cm"># Catalog of "products" (text descriptions stand in for image+text pairs)</span>
catalog = [
    <span class="str">"red leather sofa with brass legs"</span>,
    <span class="str">"blue cotton t-shirt with white stripes"</span>,
    <span class="str">"wooden dining table seats six"</span>,
    <span class="str">"vintage denim jacket worn in"</span>,
    <span class="str">"modern stainless-steel kettle"</span>,
    <span class="str">"ceramic coffee mug glazed dark green"</span>,
]
vec = <span class="fn">TfidfVectorizer</span>().<span class="fn">fit</span>(catalog + [<span class="str">"jacket"</span>, <span class="str">"kettle"</span>, <span class="str">"sofa"</span>, <span class="str">"mug"</span>, <span class="str">"table"</span>, <span class="str">"shirt"</span>])
emb = vec.<span class="fn">transform</span>(catalog).<span class="fn">toarray</span>()
emb = emb / (np.linalg.<span class="fn">norm</span>(emb, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>)

idx = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">3</span>, metric=<span class="str">"cosine"</span>).<span class="fn">fit</span>(emb)

<span class="cm"># Query</span>
q_emb = vec.<span class="fn">transform</span>([<span class="str">"something to drink coffee from"</span>]).<span class="fn">toarray</span>()
q_emb = q_emb / (np.linalg.<span class="fn">norm</span>(q_emb) + <span class="num">1e-9</span>)
dists, ids = idx.<span class="fn">kneighbors</span>(q_emb)
<span class="kw">for</span> d, i <span class="kw">in</span> <span class="fn">zip</span>(dists[<span class="num">0</span>], ids[<span class="num">0</span>]):
    <span class="fn">print</span>(f<span class="str">"  cos={1-d:.3f}  {catalog[i]}"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">CLIP is a dual-encoder, contrastively trained model that aligns images and text in a shared 768-dim space. Its 400M-pair web scrape and 32K-batch InfoNCE training produced the first general-purpose zero-shot visual classifier. Five years later, descendants (OpenCLIP, EVA-CLIP, SigLIP) refine the recipe but the core idea is unchanged.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Two encoders projecting to a shared L2-normalized space; cosine similarity = dot product.</li>
<li>Symmetric InfoNCE loss with a learned temperature; large batches matter (32K negatives).</li>
<li>Zero-shot transfer: encode "a photo of a {class}" templates, pick the closest. Ensemble templates for +1–2%.</li>
<li>Descendants: OpenCLIP (open data, larger scale), EVA-CLIP (MIM pretraining), SigLIP (sigmoid loss, efficient at small batch).</li>
<li>Weaknesses: composition, counting, fine-grained text, modality gap.</li>
<li>Production uses: dataset filtering, retrieval, moderation, VLM front-end.</li>
</ul>
</div>

<p class="l-text">In <strong>multimodal-L3</strong> we move from "images and text in the same space" to "image-conditioned LLMs that talk back": the LLaVA / BLIP-2 family. We will see how a frozen CLIP/SigLIP visual tower plus a frozen LLM plus a tiny adapter (Q-Former or projection MLP) plus instruction-tuning data yields a ChatGPT-for-images.</p>
</div>`,
tr: `<p class="l-text"><strong>CLIP, on yılın en etkili tek multimodal makalesidir.</strong> Ondan önce, görüntü-metin modelleri pahalı etiketli veri gerektiriyordu ve dar sınıflandırıcılar üretiyordu. Ondan sonra, herhangi bir kavram için bir cümle yazarak zero-shot tanıyıcı oluşturabilirsiniz: "a photo of a {class}" — ince ayar yok, etiket yok, görev başına eğitim yok. Webden kazınan 400M (görüntü, açıklama) çifti, çift-kodlayıcı mimarisi ve karşıt InfoNCE hedefi şu anda erişim, arama, moderasyon, veri kümesi filtreleme (LAION 5B'sini temizlemek için CLIP skorlarını kullandı) genelinde varsayılan tariftir ve 2024'e kadar her büyük VLM'nin görsel ön-ucu olarak kullanılır.</p>

<p class="l-text">Bu derste CLIP'i parçalıyoruz ve yeniden inşa ediyoruz. Mimariyi (ViT-B/32 → ViT-L/14 → ViT-H/14 görüntü kuleleri; bir Transformer metin kulesi), karşıt kaybı tüm matematiksel detayıyla, WIT-400M veri kümesini ve önyargılarını, ImageNet'te %75–78 top-5 veren zero-shot transfer protokolünü ve torunları işliyoruz — <strong>OpenCLIP</strong> (Ilharco 2021, LAION-2B üzerinde ViT-G/14'e ölçeklendi), <strong>EVA-CLIP</strong> (BAAI 2023, maskelenmiş-görüntü-modelleme ön-eğitimi) ve <strong>SigLIP</strong> (Zhai vd. Google, Mar 2023) softmax'ı sigmoid ile değiştirdi ve VLM'ler için yeni tercih edilen görsel kodlayıcı oldu (PaLI-3, Gemini, Idefics2 ve Pixtral'da kullanılıyor).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>CLIP'in çift-kule mimarisini ve öğrenilen sıcaklık parametresinin rolünü yeniden inşa etmek</li>
<li>Simetrik InfoNCE kaybını türetmek ve batch boyutunun neden bu kadar önemli olduğunu açıklamak (tek adımda 32K negatif)</li>
<li>Prompt şablonlarıyla zero-shot sınıflandırma çalıştırmak ve +%1–2 doğruluk için bunları topluluk haline getirmek</li>
<li>CLIP'i OpenCLIP, EVA-CLIP ve SigLIP ile karşılaştırmak — hangisini ne zaman seçeceğinizi</li>
<li>CLIP'in bilinen zayıflıklarını tanımak: kompozisyon, sayma, görüntülerdeki ince taneli metin, modalite boşluğu</li>
<li>CLIP skorlarını üretimde uygulamak: veri kümesi filtreleme, erişim, içerik moderasyonu, benzerlik araması</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Mimari — İki Kule, Bir Gömme Uzayı</h2>
<p class="l-text">CLIP iki kodlayıcıdan oluşur, her ikisi de paylaşılan bir d boyutlu birim-norm uzaya projekte eder. Orijinal makale beş görüntü varyantı (ResNet-50, ResNet-101, RN50x4, RN50x16, RN50x64) ve üç ViT (ViT-B/32, ViT-B/16, ViT-L/14) eğitti. ViT varyantları alanı yedi; 336px'de eğitilmiş ViT-L/14 ("CLIP@336") bugün hala güçlü bir baseline'dır. Metin kulesi, 49.408 token BPE sözcük dağarcığı ve 77 token maksimum uzunluğu olan 12 katmanlı bir Transformer (63M parametre) içerir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Görüntü kulesi</div><div class="card-body">ViT-L/14: 224×224 girdi → 14×14 yamalar → 256 yama token + 1 CLS → 24 transformer katmanı, 16 başlık, 1024 gizli → CLS al → 768 boyuta doğrusal projeksiyon → L2 normalize.</div></div>
<div class="calc-card"><div class="card-title">Metin kulesi</div><div class="card-body">BPE tokenize → 77 token (doldur/kes) → 12 transformer katmanı, 8 başlık, 512 gizli → EOT token'ının gizli durumunu al → 768 boyuta doğrusal projeksiyon → L2 normalize.</div></div>
<div class="calc-card"><div class="card-title">Paylaşılan uzay</div><div class="card-body">Her iki projeksiyon aynı 768 boyutlu kürede biner. Benzerlik sadece bir nokta çarpımıdır (vektörler birim-norm olduğundan). Öğrenilebilir bir sıcaklık τ, softmax'tan önce logitleri ölçeklendirir.</div></div>
<div class="calc-card"><div class="card-title">Parametre sayıları</div><div class="card-body">ViT-B/32: 151M toplam. ViT-L/14: 428M. ViT-L/14@336px: 428M (aynı parametre, daha çok hesaplama). OpenCLIP ViT-G/14: 2.5B. Ölçekle transfer doğruluğunda büyük sıçramalar.</div></div>
</div>

<div class="calc-highlight"><strong>Neden çift kule?</strong> Çıktıda yalnızca buluşan iki kodlayıcı, bir tarafı <em>önbelleğe alabileceğiniz</em> anlamına gelir. 100M ürün görüntüsünü bir kez önceden kodlayın, sonra her kullanıcı sorgusu için sadece metni göm ve önbelleğe alınmış vektörlere karşı nokta-çarpımı yap. Tek-kule (çapraz-dikkat) modelleri bunu yapamaz — sorgu başına tüm modeli yeniden çalıştırırlar.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Karşıt Hedef — InfoNCE Detaylı</h2>
<p class="l-text">CLIP'in kaybı, simetrik görüntüden-metne ve metinden-görüntüye InfoNCE kaybıdır. N (görüntü, açıklama) çifti içeren bir batch ile, S[i,j] = cosine(img_i, text_j) / τ olan N×N benzerlik matrisi S'yi hesaplarsınız. Diyagonal "eşleşen" çiftlerdir; diyagonal-dışı her şey bir negatif olarak kabul edilir.</p>

<div class="katex-block">$$L_{i2t} = -\\frac{1}{N} \\sum_{i=1}^{N} \\log \\frac{\\exp(s_{i,i}/\\tau)}{\\sum_{j=1}^{N} \\exp(s_{i,j}/\\tau)}$$</div>

<div class="katex-block">$$L_{t2i} = -\\frac{1}{N} \\sum_{j=1}^{N} \\log \\frac{\\exp(s_{j,j}/\\tau)}{\\sum_{i=1}^{N} \\exp(s_{i,j}/\\tau)}, \\quad L = \\frac{L_{i2t} + L_{t2i}}{2}$$</div>

<p class="l-text">Sıcaklık τ <em>öğrenilir</em> (0.07'de başlatılır, exp parametrelendirme ≤100'e kırpılır). Softmax'ın entropisini kontrol eder — çok soğuk olursa gradyanlar kaybolur; çok sıcak olursa model negatifleri ayıramaz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Batch boyutu neden önemli</div><div class="card-body">Her çift N−1 batch-içi negatif görür. CLIP 256 V100 üzerinde batch boyutu 32.768 ile eğitildi (gradyan biriktirme + parçalanmış kayıp). Batch 256'da karşıt sinyal çok daha zayıftır — kalite keskin biçimde düşer.</div></div>
<div class="calc-card"><div class="card-title">Simetrik kayıp</div><div class="card-body">Her iki yön gereklidir. Yalnız i2t görüntü gömmelerinin küçük bir bölgeye çökmesine neden olur; yalnız t2i metni aynı şekilde yapar. Simetrik ortalama her iki uzayı da tam-rütbe tutar.</div></div>
<div class="calc-card"><div class="card-title">Neden triplet kayıp değil?</div><div class="card-body">Triplet (çapa, pozitif, zor negatif) 2020 öncesi varsayılandı. InfoNCE TÜM batch-içi örnekleri negatif olarak kullanır — kesinlikle adım başına daha fazla sinyal, zor-negatif madenciliği gerekmez.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. WIT-400M Veri Kümesi ve Halefleri</h2>
<p class="l-text">CLIP'in verisi mimarisi kadar önemliydi. OpenAI <strong>WIT-400M</strong>'i 500K İngilizce arama terimi (WordNet girdileri, Wikipedia'dan ikililer, sorgulardan yaygın kelimeler) için sorgulayarak public webden kazıdı. Her sorgu için 20K kadar (görüntü, alt-metin) çifti tuttular. Toplam: 400M çift. Veri kümesi hiç yayınlanmadı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">WIT-400M (kapalı)</div><div class="card-body">OpenAI'nin orijinali. 400M çift, İngilizce alt-metin. Yoğun kopyalama, birçok düşük kaliteli açıklama ("DSC_0042.jpg"), ama ölçek tüm gürültüye baskın geldi.</div></div>
<div class="calc-card"><div class="card-title">LAION-400M / 5B</div><div class="card-body">Schuhmann ve diğerleri 2022. Common Crawl + CLIP-skor filtrelemesi (≥0.28 kosinüs) kullanan açık replikasyon. LAION-2B-en İngilizce alt kümesidir; LAION-5B çok dilli. Stable Diffusion v1, OpenCLIP'i besledi.</div></div>
<div class="calc-card"><div class="card-title">DataComp / DFN</div><div class="card-body">Apple'ın DataComp'u (Gadre 2023) <em>filtrelemenin ölçekten daha önemli olduğunu</em> gösterdi: küratörlü 1.4B alt küme tam 12.8B'yi yendi. DFN-2B (Apple) ve Datacomp-XL daha küçük, daha temiz veriyle SOTA'yı zorluyor.</div></div>
<div class="calc-card"><div class="card-title">Önyargı ve telif hakkı</div><div class="card-body">Web kazıları web önyargılarını miras alır (cinsiyet, ırk, coğrafya). LAION telifli görüntüler içerir, davalara yol açtı (Getty v. Stability, 2023). Öncü laboratuvarlar artık özel, lisanslı veri kümeleri kullanıyor.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Zero-Shot Transfer — Sihirli Numara</h2>
<p class="l-text">CLIP'in manşet sonucu <strong>ImageNet'i hiç görmeden ImageNet'te %76.2 top-5</strong> idi. Numara tamamen dilseldir: her sınıf etiketini bir cümle olarak kodla, test görüntüsünü kodla, cümlesi en yakın olan sınıfı seç.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — gerçek CLIP)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># HuggingFace CLIP ile gercek zero-shot ImageNet — Pyodide tarafindan engellendi</span>
<span class="kw">from</span> transformers <span class="kw">import</span> CLIPProcessor, CLIPModel
<span class="kw">import</span> torch
<span class="kw">from</span> PIL <span class="kw">import</span> Image

model = CLIPModel.<span class="fn">from_pretrained</span>(<span class="str">"openai/clip-vit-large-patch14-336"</span>)
proc  = CLIPProcessor.<span class="fn">from_pretrained</span>(<span class="str">"openai/clip-vit-large-patch14-336"</span>)

<span class="cm"># CLIP makalesinden 80-sablon toplulugu</span>
templates = [
    <span class="str">"a photo of a {}."</span>, <span class="str">"a blurry photo of a {}."</span>, <span class="str">"a black and white photo of a {}."</span>,
    <span class="str">"a low resolution photo of a {}."</span>, <span class="str">"a rendition of a {}."</span>, <span class="str">"a bad photo of a {}."</span>,
    <span class="str">"a cropped photo of a {}."</span>, <span class="str">"a close-up photo of a {}."</span>,
    <span class="cm"># ... 72 sablon daha ...</span>
]

<span class="kw">def</span> <span class="fn">zeroshot_classifier</span>(classnames):
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        weights = []
        <span class="kw">for</span> <span class="kw">cls</span> <span class="kw">in</span> classnames:
            texts = [t.<span class="fn">format</span>(<span class="kw">cls</span>) <span class="kw">for</span> t <span class="kw">in</span> templates]
            inputs = <span class="fn">proc</span>(text=texts, return_tensors=<span class="str">"pt"</span>, padding=<span class="kw">True</span>)
            text_features = model.<span class="fn">get_text_features</span>(**inputs)
            text_features = text_features / text_features.<span class="fn">norm</span>(dim=-<span class="num">1</span>, keepdim=<span class="kw">True</span>)
            weights.<span class="fn">append</span>(text_features.<span class="fn">mean</span>(<span class="num">0</span>))           <span class="cm"># toplulukla</span>
        <span class="kw">return</span> torch.<span class="fn">stack</span>(weights).T  <span class="cm"># (D, num_classes)</span>

W = <span class="fn">zeroshot_classifier</span>([<span class="str">"cat"</span>, <span class="str">"dog"</span>, <span class="str">"car"</span>, <span class="str">"tree"</span>])
img = Image.<span class="fn">open</span>(<span class="str">"test.jpg"</span>)
img_feat = model.<span class="fn">get_image_features</span>(**<span class="fn">proc</span>(images=img, return_tensors=<span class="str">"pt"</span>))
img_feat = img_feat / img_feat.<span class="fn">norm</span>(dim=-<span class="num">1</span>, keepdim=<span class="kw">True</span>)
logits = (img_feat @ W).<span class="fn">softmax</span>(dim=-<span class="num">1</span>)
<span class="fn">print</span>(logits)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Prompt şablonları üzerinde TF-IDF ve düzleştirilmiş görüntü öznitelikleriyle bir oyuncak zero-shot sınıflandırıcı. Prompt-topluluk ilkesini yakalar: sınıf başına birden fazla şablonun ortalamasını almak varyansı azaltır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

classes = [<span class="str">"cat"</span>, <span class="str">"dog"</span>, <span class="str">"car"</span>]
templates = [
    <span class="str">"a photo of a {}"</span>, <span class="str">"a picture of a {}"</span>, <span class="str">"a close-up of a {}"</span>,
    <span class="str">"a blurry photo of a {}"</span>, <span class="str">"a bright photo of a {}"</span>,
]

<span class="cm"># TF-IDF'in sozcuk dagarcigina sahip olmasi icin bir "egitim corpusu" yap</span>
corpus = [t.<span class="fn">format</span>(c) <span class="kw">for</span> c <span class="kw">in</span> classes <span class="kw">for</span> t <span class="kw">in</span> templates]
corpus += [<span class="str">"sky"</span>, <span class="str">"tree"</span>, <span class="str">"building"</span>, <span class="str">"person"</span>, <span class="str">"ocean"</span>]
vec = <span class="fn">TfidfVectorizer</span>().<span class="fn">fit</span>(corpus)

<span class="cm"># Sinif basina topluluk: o sinif icin tum sablonlarin TF-IDF ortalamasi</span>
class_embs = []
<span class="kw">for</span> c <span class="kw">in</span> classes:
    embs = vec.<span class="fn">transform</span>([t.<span class="fn">format</span>(c) <span class="kw">for</span> t <span class="kw">in</span> templates]).<span class="fn">toarray</span>()
    embs = embs / (np.linalg.<span class="fn">norm</span>(embs, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>)
    class_embs.<span class="fn">append</span>(embs.<span class="fn">mean</span>(<span class="num">0</span>))
W = np.<span class="fn">stack</span>(class_embs)  <span class="cm"># (3, vocab)</span>

<span class="cm"># Sahte bir "goruntu gommesi": sabit rastgele harita ile img ortalamasini aciklama uzayina projekte et</span>
np.random.<span class="fn">seed</span>(<span class="num">1</span>)
img_3 = np.random.<span class="fn">rand</span>(<span class="num">16</span>, <span class="num">16</span>, <span class="num">3</span>) * <span class="num">0.3</span>   <span class="cm"># karaca goruntu</span>
img_feat = img_3.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))  <span class="cm"># (3,)</span>
proj = np.random.<span class="fn">RandomState</span>(<span class="num">0</span>).<span class="fn">randn</span>(<span class="num">3</span>, W.shape[<span class="num">1</span>])
img_emb = img_feat @ proj
img_emb = img_emb / (np.linalg.<span class="fn">norm</span>(img_emb) + <span class="num">1e-9</span>)

logits = W @ img_emb
probs = np.<span class="fn">exp</span>(logits - logits.<span class="fn">max</span>())
probs /= probs.<span class="fn">sum</span>()
<span class="kw">for</span> c, p <span class="kw">in</span> <span class="fn">zip</span>(classes, probs):
    <span class="fn">print</span>(f<span class="str">"{c:5s}: {p:.3f}"</span>)
</code></pre></div>
</div>

<p class="l-text">Orijinal makaleden iki üretim ipucu: (1) Çıplak sınıf adları yerine her zaman prompt şablonları kullanın — "a photo of a cat" ImageNet'te "cat"i %1.3 yener. (2) Şablonlar arasında topluluk yapın — 80 şablonun metin gömmelerini ortalamak, herhangi bir tek şablonu %3.5 yener.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. OpenCLIP, EVA-CLIP ve SigLIP — Torunlar</h2>
<p class="l-text">CLIP ağırlıkları yayınlandı ama veri kümesi yayınlanmadı. OpenCLIP, EVA-CLIP ve SigLIP her biri orijinalin kaçırdığı bir şeyi düzeltti. 2026'ya kadar SigLIP yeni VLM'ler için varsayılan görsel kodlayıcıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenCLIP (Ilharco 2021–)</div><div class="card-body">LAION-400M, sonra LAION-2B-en üzerinde açık kaynak replikasyon. ViT-G/14'e (2.5B parametre, batch 160K) ölçeklendi. open_clip PyPI paketinde dağıtılır. Stable Diffusion metin-koşullandırma omurgası.</div></div>
<div class="calc-card"><div class="card-title">EVA-CLIP (BAAI, Sun 2023)</div><div class="card-body">Önce ViT'i maskelenmiş görüntü modellemeyle (CLIP özniteliklerini hedef olarak öngörerek) ön-eğitir, sonra CLIP-tarzı karşıt çalıştırır. Sonuç: 5B parametrede ViT-E/14+, aynı ölçekte OpenCLIP'e göre ImageNet zero-shot'ta +%5.</div></div>
<div class="calc-card"><div class="card-title">SigLIP (Zhai, Google 2023)</div><div class="card-body">Softmax'ı sigmoid ile değiştirir: her (i,j) çifti bağımsız bir ikili etiket alır. Global softmax paydasına gerek yok → büyük batch'lere gerek yok → 32K yerine batch 16K'da verimli eğitilir. SigLIP-So400m-14-384 Idefics2, PaLI-3, Pixtral, LLaVA-OneVision için fiili kodlayıcıdır.</div></div>
<div class="calc-card"><div class="card-title">Hangisini ne zaman seçmeli</div><div class="card-body"><em>Ölçekte erişim</em>: OpenCLIP ViT-G veya SigLIP-So400m. <em>VLM ön-ucu</em>: SigLIP (yüksek-çözünürlük, verimli). <em>Sınırlı hesaplamayla araştırma</em>: EVA-CLIP (en iyi parametre/doğruluk). <em>Eski / tekrarlanabilirlik</em>: orijinal OpenAI CLIP.</div></div>
</div>

<div class="katex-block">$$L_{\\text{SigLIP}} = -\\frac{1}{N}\\sum_{i,j} \\log \\sigma\\!\\left(z_{ij}\\,(t \\, s_{ij} + b)\\right), \\quad z_{ij} = \\begin{cases}+1 & i=j\\\\-1 & i\\ne j\\end{cases}$$</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bilinen Zayıflıklar ve Modalite Boşluğu</h2>
<p class="l-text">CLIP kaba semantikte parlak ve birkaç belirli şeyde zayıftır. Bir CLIP-destekli ürün sevkiyat etmeden önce arıza modlarını anlamak zorunlu okumadır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kompozisyon / bağlama</div><div class="card-body">"A red cube on a blue sphere" vs "a blue cube on a red sphere" — CLIP bunları sıklıkla neredeyse aynı puanlar. Model bağlanmış (nesne, öznitelik) çiftlerini değil, bir öznitelik torbasını kodlar. Düzeltme: ARO benchmark; NegCLIP gibi yapılandırılmış-dikkat varyantları.</div></div>
<div class="calc-card"><div class="card-title">Sayma</div><div class="card-body">"İki köpek"i "üç köpek"ten güvenilir biçimde ayırt edemez. Görsel kodlayıcı çok agresif havuzlar. Özelleşmiş sayıcılar (CountBench, FairFace) gerekir.</div></div>
<div class="calc-card"><div class="card-title">Görüntülerdeki ince taneli metin</div><div class="card-body">Küçük ölçekte fotoğraflardaki metni okuyamaz. 384'te SigLIP yardımcı olur; belgeler için OCR-farkındalıklı kodlayıcılara geçin (LayoutLM, Donut — bkz. L6).</div></div>
<div class="calc-card"><div class="card-title">Modalite boşluğu (Liang 2022)</div><div class="card-body">Görüntü ve metin gömmeleri aslında birim kürenin <em>farklı konilerinde</em> yaşar — varsayabileceğiniz gibi iç içe geçmiş değil. Boşluk karşıt eğitime özgüdür. Erişim eşiklerini etkiler; post-hoc kalibrasyon veya hubness azaltma ile ele alınır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Üretimde CLIP — Dört Gerçek Kullanım Durumu</h2>
<p class="l-text">CLIP yalnızca akademik bir eser değildir. Yüksek-etkili dört üretim deseni:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Veri kümesi filtreleme</div><div class="card-body">LAION, Common Crawl görüntü-metin çiftlerini filtrelemek için CLIP skorları ≥0.28 kullandı. Stable Diffusion sonuç üzerinde eğitildi. CLIP filtrelemesi olmadan veri kümesi çoğunlukla gürültü.</div></div>
<div class="calc-card"><div class="card-title">Görüntü arama / erişim</div><div class="card-body">Kataloğu önceden kodla (milyonlarca ürün görüntüsü), FAISS veya HNSW ile indeksle. Sorgu zamanında metni göm, top-k en yakın komşular. Pinterest'in görsel araması ve birçok e-ticaret platformu bu şekilde çalışır.</div></div>
<div class="calc-card"><div class="card-title">İçerik moderasyonu</div><div class="card-body">Görüntüleri "şiddet", "silahlar", "açık içerik" gibi metin promptlarına karşı puanla. Ucuz ilk-geçiş filtresi; yüksek-hassasiyetli kurallar için özelleşmiş sınıflandırıcılarla birleştirilir.</div></div>
<div class="calc-card"><div class="card-title">VLM görsel ön-ucu</div><div class="card-body">LLaVA, Idefics, BLIP-2, MiniGPT-4 hepsi görüntü kodlayıcı olarak donmuş CLIP/SigLIP kullanır. LLM dili yapar; CLIP görmeyi yapar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Oyuncak erisim indeksi — kNN icin sklearn, gommeler icin CLIP-tarzi</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

<span class="cm"># "Urunler" katalogu (metin aciklamalari goruntu+metin ciftleri yerine gecer)</span>
catalog = [
    <span class="str">"red leather sofa with brass legs"</span>,
    <span class="str">"blue cotton t-shirt with white stripes"</span>,
    <span class="str">"wooden dining table seats six"</span>,
    <span class="str">"vintage denim jacket worn in"</span>,
    <span class="str">"modern stainless-steel kettle"</span>,
    <span class="str">"ceramic coffee mug glazed dark green"</span>,
]
vec = <span class="fn">TfidfVectorizer</span>().<span class="fn">fit</span>(catalog + [<span class="str">"jacket"</span>, <span class="str">"kettle"</span>, <span class="str">"sofa"</span>, <span class="str">"mug"</span>, <span class="str">"table"</span>, <span class="str">"shirt"</span>])
emb = vec.<span class="fn">transform</span>(catalog).<span class="fn">toarray</span>()
emb = emb / (np.linalg.<span class="fn">norm</span>(emb, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>)

idx = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">3</span>, metric=<span class="str">"cosine"</span>).<span class="fn">fit</span>(emb)

<span class="cm"># Sorgu</span>
q_emb = vec.<span class="fn">transform</span>([<span class="str">"something to drink coffee from"</span>]).<span class="fn">toarray</span>()
q_emb = q_emb / (np.linalg.<span class="fn">norm</span>(q_emb) + <span class="num">1e-9</span>)
dists, ids = idx.<span class="fn">kneighbors</span>(q_emb)
<span class="kw">for</span> d, i <span class="kw">in</span> <span class="fn">zip</span>(dists[<span class="num">0</span>], ids[<span class="num">0</span>]):
    <span class="fn">print</span>(f<span class="str">"  cos={1-d:.3f}  {catalog[i]}"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sonraki</h2>
<p class="l-text">CLIP, görüntüleri ve metni paylaşılan 768 boyutlu bir uzayda hizalayan çift-kodlayıcılı, karşıt eğitilmiş bir modeldir. 400M-çift web kazısı ve 32K-batch InfoNCE eğitimi ilk genel amaçlı zero-shot görsel sınıflandırıcıyı üretti. Beş yıl sonra, torunlar (OpenCLIP, EVA-CLIP, SigLIP) tarifi rafine ediyor ama temel fikir değişmedi.</p>

<div class="calc-highlight"><strong>Önemli çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Paylaşılan L2-normalleştirilmiş bir uzaya projekte eden iki kodlayıcı; kosinüs benzerliği = nokta çarpımı.</li>
<li>Öğrenilen sıcaklık ile simetrik InfoNCE kaybı; büyük batch'ler önemlidir (32K negatif).</li>
<li>Zero-shot transfer: "a photo of a {class}" şablonlarını kodla, en yakın olanı seç. +%1–2 için şablonları topluluk haline getir.</li>
<li>Torunlar: OpenCLIP (açık veri, daha büyük ölçek), EVA-CLIP (MIM ön-eğitimi), SigLIP (sigmoid kayıp, küçük batch'te verimli).</li>
<li>Zayıflıklar: kompozisyon, sayma, ince taneli metin, modalite boşluğu.</li>
<li>Üretim kullanımları: veri kümesi filtreleme, erişim, moderasyon, VLM ön-ucu.</li>
</ul>
</div>

<p class="l-text"><strong>multimodal-L3</strong>'te "aynı uzayda görüntüler ve metin"den "geri konuşan görüntü-koşullu LLM'ler"e geçiyoruz: LLaVA / BLIP-2 ailesi. Donmuş bir CLIP/SigLIP görsel kulesi artı donmuş bir LLM artı küçük bir adaptörün (Q-Former veya projeksiyon MLP) artı talimat-ayarlama verisinin nasıl bir görüntüler-için-ChatGPT verdiğini göreceğiz.</p>
</div>`
};
