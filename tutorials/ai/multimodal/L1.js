window.MULTIMODAL_L1 = {
en: `<p class="l-text"><strong>Reality is not text.</strong> A radiologist reading a chest X-ray, a self-driving car negotiating a four-way stop, a deaf student watching captioned video, a chef tasting a sauce — none of these are language tasks alone. They are sensor-fusion tasks, where pixels, waveforms, depth, and words all flow into one decision. The 2017–2022 NLP revolution built a world-class engine for one modality (text). The 2021–2026 multimodal revolution stitched that engine into the rest of perception — and the result is the first generation of AI systems that can actually <em>see what you mean</em>.</p>

<p class="l-text">In this opening lesson we set up the field. We define what "multimodal" means precisely (more than just "images plus text"), survey the three fusion strategies that drive every architecture you will read about — early, late, and cross-attention fusion — and walk the historical landmarks: <strong>CLIP</strong> (Radford, OpenAI, Jan 2021) which unlocked image-text contrastive pretraining at scale; <strong>Flamingo</strong> (DeepMind, Apr 2022) the first credible few-shot vision-language model; <strong>BLIP-2</strong> (Salesforce, Jan 2023) and <strong>LLaVA</strong> (Liu, Apr/Oct 2023) which standardized the "vision encoder + LLM" recipe; <strong>GPT-4V</strong> (Sep 2023), <strong>Gemini 1.5</strong> (Feb 2024) with its 1M-token native multimodal context, and <strong>Sora</strong> (Feb 2024) which proved video generation was a tractable engineering problem. The rest of this 8-lesson track unpacks each branch.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define multimodal AI precisely and distinguish it from "image classification with extra steps"</li>
<li>Identify the three fusion strategies — early, late, and cross-attention — and pick the right one for a problem</li>
<li>Walk the 2021–2026 landmark timeline: CLIP → Flamingo → BLIP-2 → LLaVA → GPT-4V → Gemini → Sora</li>
<li>Understand why text alone is a poor world model and how vision/audio/video fix specific failure modes</li>
<li>Recognize the four canonical multimodal task types: retrieval, generation, grounding, and reasoning</li>
<li>Avoid common architectural mistakes (modality bottlenecks, late-fusion-too-late, missing alignment data)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What Counts as Multimodal?</h2>
<p class="l-text">A <strong>modality</strong> is a stream of sensory data with its own statistics: text, RGB image, depth, audio waveform, video, point cloud, IMU, EEG. A <strong>multimodal model</strong> jointly processes two or more such streams in a way that lets information from one influence predictions about another. A model that takes an image and outputs a class label is not multimodal — it is unimodal vision. A model that takes an image and a question and outputs an answer (VQA) <em>is</em> multimodal, because the question's tokens steer where attention lands in the image.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vision + Language</div><div class="card-body">The dominant pair in 2026. Tasks: VQA (VQAv2, GQA), captioning (COCO, NoCaps), retrieval (Flickr30k, MS-COCO), grounding (RefCOCO), document understanding (DocVQA, ChartQA), and visual chat (LLaVA-Bench).</div></div>
<div class="calc-card"><div class="card-title">Audio + Language</div><div class="card-body">Speech (ASR, TTS, voice agents), music (MusicGen, Suno), and audio understanding (AudioCaps, Clotho). Whisper (OpenAI, Sep 2022) made robust ASR a commodity; Qwen-Audio and SeamlessM4T extended it to instruction-following.</div></div>
<div class="calc-card"><div class="card-title">Video</div><div class="card-body">Video adds the time axis to images. Models: VideoMAE, InternVideo, Video-LLaMA, Gemini 1.5 (native video), Sora (generation). Hard because raw video is huge — 30 FPS × 1080p × 60s ≈ 4 GB per clip.</div></div>
<div class="calc-card"><div class="card-title">Specialized modalities</div><div class="card-body">Medical imaging (CT, MRI), 3D point clouds (LiDAR for AVs), satellite imagery (multi-spectral), DNA/protein sequences (AlphaFold blends sequence + structure), tabular + text (financial filings).</div></div>
</div>

<div class="calc-highlight"><strong>Working definition for this track:</strong> a multimodal model is one whose <em>internal representation space</em> contains aligned features from at least two modalities, such that a query in one modality can retrieve, generate, or reason about content in another. CLIP aligns image and text in a shared 768-dim space — that is the canonical example.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Why Text Alone Is Not Enough</h2>
<p class="l-text">A text-only LLM trained on the entire internet still cannot count fingers in a photo, read a clock face, or tell you whether a plot's y-axis is log or linear. These failures are not bugs in the language model — they are evidence that <em>language is a compressed, lossy projection</em> of a richer perceptual world. Words like "small" or "left" or "louder" are placeholders for sensory experiences that have to be re-grounded in pixels and waveforms to be useful.</p>

<p class="l-text">Three concrete failure modes that motivate multimodal models:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reference resolution</div><div class="card-body">"Move the red mug next to the laptop" is unambiguous to a human in a kitchen but requires the model to <em>see</em> the mug, the laptop, and the spatial relation. RefCOCO and grounding benchmarks measure this.</div></div>
<div class="calc-card"><div class="card-title">Quantitative perception</div><div class="card-body">Reading a thermometer, a fuel gauge, a chart's tick marks. Pure text models hallucinate numbers; vision-language models with high-resolution encoders (LLaVA-Next 1344px, GPT-4V high detail) can read them.</div></div>
<div class="calc-card"><div class="card-title">Procedural understanding</div><div class="card-body">"Did the egg crack when it hit the pan?" requires watching, not reading. Video-LLMs (Video-ChatGPT, Gemini 1.5) tackle this; static-image models cannot.</div></div>
</div>

<p class="l-text">The flip side is also true: pure vision models without language struggle to follow open-ended instructions. The breakthrough of CLIP and its descendants is that <em>each modality fills the other's blind spots</em> when their representations are aligned.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Three Fusion Strategies</h2>
<p class="l-text">Every multimodal architecture you will encounter sits somewhere on a spectrum of <em>how early</em> the modalities are mixed. Three named regions on that spectrum cover 95% of designs.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Early fusion</div><div class="card-body">Concatenate raw features at the input layer, then run one shared transformer. Used in ViLT (no separate vision encoder), Perceiver IO, and Gemini's "natively multimodal" design. Pro: simplest, learns everything end-to-end. Con: huge model, hungry for paired data.</div></div>
<div class="calc-card"><div class="card-title">Late fusion</div><div class="card-body">Encode each modality independently, combine only at the final classifier. Used in early audio-visual systems and dual-tower retrieval (CLIP at retrieval time). Pro: cheap, modular, you can swap encoders. Con: cannot model fine-grained interactions.</div></div>
<div class="calc-card"><div class="card-title">Cross-attention fusion</div><div class="card-body">Encode separately, then let one modality's tokens attend over the other's. The 2026 default. Used in Flamingo (gated cross-attention), BLIP-2 (Q-Former), LLaVA (projection + concat → self-attention in LLM), Gemini, GPT-4V.</div></div>
</div>

<div class="katex-block">$$A_{\\text{cross}} = \\text{softmax}\\left(\\frac{Q_{\\text{text}} K_{\\text{img}}^\\top}{\\sqrt{d_k}}\\right) V_{\\text{img}}$$</div>

<p class="l-text">Cross-attention is the heart of modern multimodal models. Text tokens form the queries Q; image patches (or audio frames) form the keys and values K, V. The text "asks" the image which patches matter, weighted by learned dot products. The same machinery powers Flamingo's Perceiver Resampler, BLIP-2's Q-Former, and the projection-then-prepend trick in LLaVA.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The 2021–2026 Landmark Timeline</h2>
<p class="l-text">The field went from "barely works" to "ships in consumer products" in five years. A condensed timeline of the papers and products that mattered:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2021 — CLIP</div><div class="card-body"><strong>Radford et al., OpenAI, Jan 2021.</strong> 400M (image, caption) pairs scraped from the web. Two encoders (ViT + Transformer), contrastive InfoNCE loss. 78% top-5 zero-shot on ImageNet without ever seeing ImageNet labels. Detailed in L2.</div></div>
<div class="calc-card"><div class="card-title">2022 — Flamingo, Whisper</div><div class="card-body"><strong>Flamingo</strong> (DeepMind, Apr 2022) — frozen LM + frozen vision encoder, glued by gated cross-attention; first credible few-shot VLM. <strong>Whisper</strong> (OpenAI, Sep 2022) — 680k hours of multilingual speech, robust ASR as a commodity. <strong>Stable Diffusion</strong> (Aug 2022) — open-source text-to-image.</div></div>
<div class="calc-card"><div class="card-title">2023 — BLIP-2, LLaVA, GPT-4V</div><div class="card-body"><strong>BLIP-2</strong> (Salesforce, Jan 2023) — Q-Former bridges frozen ViT and frozen LLM with only ~188M trainable params. <strong>LLaVA</strong> (Liu, Apr 2023; v1.5 Oct 2023) — simple linear projection + visual instruction tuning. <strong>GPT-4V</strong> (OpenAI, Sep 2023) — first widely-deployed VLM with strong reasoning. <strong>DALL-E 3</strong> (Oct 2023).</div></div>
<div class="calc-card"><div class="card-title">2024 — Gemini, Sora, Claude 3</div><div class="card-body"><strong>Gemini 1.5</strong> (Google, Feb 2024) — 1M-token natively multimodal context; ingests hours of video. <strong>Sora</strong> (OpenAI, Feb 2024) — text-to-video with spacetime patches and a diffusion transformer. <strong>Claude 3</strong> (Mar 2024) — vision in production. <strong>SigLIP</strong> (Zhai 2023, deployed 2024) — sigmoid loss replaces softmax, better small-batch scaling.</div></div>
<div class="calc-card"><div class="card-title">2025–2026 — Production multimodal</div><div class="card-body">Veo 2 (Google, Dec 2024), Sora Turbo, Gemini 2.0 with native audio + image generation, Claude 3.5/4 with computer-use vision, open-source LLaVA-Next, Qwen2-VL, InternVL 2, Pixtral (Mistral). Multimodal is now the default modality for any new frontier model.</div></div>
</div>

<div class="calc-highlight"><strong>One pattern across the timeline:</strong> the winning recipe in every era was "freeze the strongest unimodal model you can find, train a small adapter to bridge it to the other modality." Flamingo did this with cross-attention; BLIP-2 with the Q-Former; LLaVA with a linear layer. Frontier labs (Google, Anthropic, OpenAI) eventually trained natively multimodal models from scratch — but the adapter approach still dominates open-source.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Four Canonical Multimodal Tasks</h2>
<p class="l-text">Multimodal benchmarks proliferate, but they cluster into four task families. Knowing which family your problem lives in tells you which architecture and loss to pick.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Retrieval</div><div class="card-body">Given a query in modality A, find the best match in modality B. Image-to-text (caption a photo), text-to-image (find images of "a red mug"), audio-to-text (transcribe). Trained with contrastive losses (CLIP, ALIGN, SigLIP). Benchmarks: Flickr30k R@1, MS-COCO 5K.</div></div>
<div class="calc-card"><div class="card-title">Generation</div><div class="card-body">Produce modality B conditioned on modality A. Captioning, text-to-image (DALL-E, Imagen), text-to-video (Sora), text-to-audio (MusicGen, AudioCraft). Trained with autoregressive or diffusion losses on paired data.</div></div>
<div class="calc-card"><div class="card-title">Grounding</div><div class="card-body">Localize a phrase in modality B. "Where is the cat?" → bounding box. RefCOCO, GQA, Visual Grounding. Models: Grounding DINO, Florence-2, Kosmos-2. Critical for robotics and autonomous driving.</div></div>
<div class="calc-card"><div class="card-title">Reasoning</div><div class="card-body">Multi-step inference over multiple modalities. Chart understanding (ChartQA), math from images (MathVista), document analysis (MMMU), agent tasks (VisualWebArena). Hardest family; needs strong LLM backbone + good visual encoder.</div></div>
</div>

<p class="l-text">A single product usually combines several. A "multimodal NLP assistant" (the L8 capstone) does retrieval (RAG over image+text DB), generation (write reply with embedded chart), grounding (highlight which page-region was cited), and reasoning (compute totals from a screenshot of a receipt).</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hands-On — Build a Toy CLIP-Like Retriever</h2>
<p class="l-text">CLIP's full training takes 400M pairs and 256 V100s. We can capture the structure in 30 lines: build TF-IDF text features, flatten each image to a "feature vector", and check that the matching pair has higher cosine similarity than mismatched pairs. The point is to feel the alignment principle, not to compete with OpenAI.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — real CLIP)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real CLIP with HuggingFace transformers — Pyodide-blocked, demo only</span>
<span class="kw">from</span> transformers <span class="kw">import</span> CLIPProcessor, CLIPModel
<span class="kw">import</span> torch
<span class="kw">from</span> PIL <span class="kw">import</span> Image

model = CLIPModel.<span class="fn">from_pretrained</span>(<span class="str">"openai/clip-vit-base-patch32"</span>)
proc  = CLIPProcessor.<span class="fn">from_pretrained</span>(<span class="str">"openai/clip-vit-base-patch32"</span>)

img = Image.<span class="fn">open</span>(<span class="str">"cat.jpg"</span>)
texts = [<span class="str">"a photo of a cat"</span>, <span class="str">"a photo of a dog"</span>, <span class="str">"a photo of a car"</span>]
inputs = <span class="fn">proc</span>(text=texts, images=img, return_tensors=<span class="str">"pt"</span>, padding=<span class="kw">True</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs)
probs = out.logits_per_image.<span class="fn">softmax</span>(dim=-<span class="num">1</span>)  <span class="cm"># zero-shot probs</span>
<span class="fn">print</span>(<span class="fn">dict</span>(<span class="fn">zip</span>(texts, probs[<span class="num">0</span>].<span class="fn">tolist</span>())))
<span class="cm"># {'a photo of a cat': 0.94, 'a photo of a dog': 0.05, 'a photo of a car': 0.01}</span>
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy CLIP-like retriever using TF-IDF on the captions and a flattened image feature. Same alignment principle: paired (image, caption) should have higher cosine similarity than non-paired ones.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="cm"># 5 fake images (16x16x3 each) — channel means stand in as "visual features"</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
imgs = [np.random.<span class="fn">rand</span>(<span class="num">16</span>, <span class="num">16</span>, <span class="num">3</span>) * c <span class="kw">for</span> c <span class="kw">in</span> [<span class="num">0.2</span>, <span class="num">0.5</span>, <span class="num">0.8</span>, <span class="num">0.3</span>, <span class="num">0.6</span>]]
captions = [
    <span class="str">"a dark photo of a cat"</span>,
    <span class="str">"a medium-bright street scene"</span>,
    <span class="str">"a bright sunny beach"</span>,
    <span class="str">"a dim indoor portrait"</span>,
    <span class="str">"a moderately lit outdoor view"</span>,
]

<span class="cm"># "Vision encoder": mean RGB per channel + std</span>
<span class="kw">def</span> <span class="fn">vis_feat</span>(im):
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([im.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>)), im.<span class="fn">std</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))])

V = np.<span class="fn">stack</span>([<span class="fn">vis_feat</span>(i) <span class="kw">for</span> i <span class="kw">in</span> imgs])  <span class="cm"># (5, 6)</span>
T = <span class="fn">TfidfVectorizer</span>().<span class="fn">fit_transform</span>(captions).<span class="fn">toarray</span>()  <span class="cm"># (5, vocab)</span>

<span class="cm"># Pad/project to common dim by concatenating standardised versions</span>
Vn = (V - V.<span class="fn">mean</span>(<span class="num">0</span>)) / (V.<span class="fn">std</span>(<span class="num">0</span>) + <span class="num">1e-9</span>)
Tn = (T - T.<span class="fn">mean</span>(<span class="num">0</span>)) / (T.<span class="fn">std</span>(<span class="num">0</span>) + <span class="num">1e-9</span>)
D = <span class="fn">min</span>(Vn.shape[<span class="num">1</span>], Tn.shape[<span class="num">1</span>])
sim = <span class="fn">cosine_similarity</span>(Vn[:, :D], Tn[:, :D])
<span class="fn">print</span>(<span class="str">"Similarity matrix (rows=images, cols=captions):"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(sim, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Diagonal mean (paired):    "</span>, np.<span class="fn">round</span>(np.<span class="fn">diag</span>(sim).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Off-diagonal mean (random):"</span>, np.<span class="fn">round</span>((sim.<span class="fn">sum</span>() - np.<span class="fn">trace</span>(sim)) / <span class="num">20</span>, <span class="num">3</span>))
</code></pre></div>
</div>

<p class="l-text">The diagonal (paired similarities) should be higher than off-diagonal on average — that is the contrastive signal CLIP exploits at scale. With 400M pairs and a real ViT, this gap becomes large enough that you can do zero-shot ImageNet classification by just comparing image features to "a photo of a {class}" templates.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Common Architectural Mistakes</h2>
<p class="l-text">Most multimodal projects fail not because the model was too small but because of one of these recurring design errors. Each has a known fix.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Modality bottleneck</div><div class="card-body">Compressing the image to a single 512-dim vector before the LLM sees it. CLIP did this on purpose for retrieval; for VQA it loses spatial detail. Fix: use patch tokens (LLaVA passes 576 tokens for a 336×336 image, LLaVA-Next up to 2880).</div></div>
<div class="calc-card"><div class="card-title">Late-fusion-too-late</div><div class="card-body">Combining only at the output layer when the task needs fine-grained interaction (VQA, grounding). Fix: cross-attention or early fusion.</div></div>
<div class="calc-card"><div class="card-title">Missing alignment data</div><div class="card-body">Trying to train a VLM on unpaired images and text. Without (image, caption) pairs, contrastive learning fails. Fix: LAION-5B, COYO-700M, or scrape your own with quality filtering.</div></div>
<div class="calc-card"><div class="card-title">Frozen encoder mismatch</div><div class="card-body">Glueing a 224×224 CLIP-ViT to an LLM and asking it to read fine print. Fix: higher-res encoders (SigLIP-400M-14 at 384, AnyRes in LLaVA-Next, dynamic resolution in Qwen2-VL).</div></div>
</div>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Frontier Models</h2>
<p class="l-text"><strong>The multimodal landscape exploded in 2024.</strong> Between May 2024 and December 2024 every major lab shipped a flagship vision-language model — and three of them are open-weight. The card grid below is the shortlist you should know by name, with the release date, the headline capability, and the one thing that distinguishes it from the rest. Treat this as a living reference: by the time you read this in 2026 there will be a 4o-mini-v2 or a Llama 3.3 Vision, but the categories (closed frontier · closed open-source · pure open-weight) are stable.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GPT-4o (OpenAI, May 2024)</div><div class="card-body">Native multimodal text + vision + audio in one model. 50% cheaper than GPT-4 Turbo, 2× faster, and the audio path is end-to-end (no Whisper → GPT → TTS handoff). The default closed baseline for VQA, chart reading, and voice agents.</div></div>
<div class="calc-card"><div class="card-title">Claude 3.5 / 3.7 Sonnet (Anthropic, Jun 2024 / Feb 2025)</div><div class="card-body">Strong vision + long-context reasoning. Claude 3.7 adds <em>extended thinking</em> (visible scratchpad budget) and <em>computer use</em> — Claude can take a screenshot, click, type, scroll. Best-in-class for document QA, screenshot debugging, and agentic UI tasks.</div></div>
<div class="calc-card"><div class="card-title">Gemini 2.0 Flash (Google, Dec 2024)</div><div class="card-body">Native multimodal <em>output</em> — generates interleaved text + image + audio in one stream. 1M+ token context window swallows hour-long videos or 1500-page PDFs whole. Streaming Live API for real-time voice/video assistants.</div></div>
<div class="calc-card"><div class="card-title">Llama 3.2 Vision 11B / 90B (Meta, Sep 2024)</div><div class="card-body">Meta's first open-weight VLMs. Cross-attention adapter on top of a frozen Llama 3.1 backbone. The 11B runs on a single A100; the 90B competes with GPT-4V on chart and document benchmarks. Fine-tunable — the practical choice for private deployments.</div></div>
<div class="calc-card"><div class="card-title">Qwen2-VL 72B (Alibaba, Aug 2024)</div><div class="card-body">Dynamic resolution (no AnyRes hack — the encoder handles any aspect ratio natively), 20-minute video understanding, and SOTA among open-source models on MMMU and DocVQA. The first open VLM that genuinely competes with frontier closed models.</div></div>
<div class="calc-card"><div class="card-title">InternVL 2.5 (OpenGVLab, Dec 2024)</div><div class="card-body">78B parameter open VLM, the closest open-weight model to GPT-4V on MMMU (~70%). Uses progressive training and a 6B InternViT-6B encoder. Important because it shows the open community is ~6 months behind closed frontier, not 2 years.</div></div>
</div>
<div class="calc-highlight"><strong>How to pick:</strong> closed frontier (GPT-4o, Claude 3.7, Gemini 2.0) for highest quality and zero infra. Llama 3.2 90B or Qwen2-VL 72B when data must stay on-prem or you need to fine-tune. InternVL 2.5 when you want frontier-class open weights and have the GPUs. Anthropic computer use + Claude 3.7 is the only combo today that can drive a browser or desktop UI agentically.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Multimodal AI is the integration of two or more sensor streams into one model that can retrieve, generate, ground, or reason across them. The five-year arc from CLIP (2021) to Gemini 2.0 (2025) is the story of better encoders, better alignment data, and better fusion mechanisms — culminating in models where multimodal is the default, not a special case.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>A model is multimodal when its representation space jointly encodes ≥2 modalities such that one can query the other.</li>
<li>Three fusion strategies — early, late, cross-attention — cover 95% of designs. Cross-attention is the 2026 default.</li>
<li>Cross-attention formula: text tokens are queries, image/audio tokens are keys and values.</li>
<li>Five-year landmark trail: CLIP → Flamingo → BLIP-2 → LLaVA → GPT-4V → Gemini → Sora.</li>
<li>Four canonical task families: retrieval, generation, grounding, reasoning. Most products combine several.</li>
<li>Common pitfalls: modality bottleneck, late-fusion-too-late, missing alignment data, frozen-encoder mismatch.</li>
</ul>
</div>

<p class="l-text">In <strong>multimodal-L2</strong> we go deep on CLIP — its architecture, its InfoNCE loss, its 400M-pair dataset, its astonishing zero-shot ImageNet performance, and the open-source descendants (OpenCLIP, EVA-CLIP, SigLIP) that now power most retrieval pipelines. In <strong>L3</strong> we walk the LLaVA / BLIP-2 recipe end-to-end. By <strong>L8</strong> you will assemble image + audio + document inputs into one capstone assistant.</p>
</div>`,
tr: `<p class="l-text"><strong>Gerçeklik metin değildir.</strong> Göğüs röntgenini okuyan bir radyolog, dört yollu bir kavşakta yön belirleyen bir sürücüsüz araç, altyazılı video izleyen sağır bir öğrenci, bir sosu tadan bir aşçı — bunların hiçbiri yalnızca dil görevi değildir. Bunlar sensör-füzyon görevleridir; pikseller, dalga formları, derinlik ve kelimelerin hepsi tek bir karara akar. 2017–2022 NLP devrimi tek bir modalite (metin) için dünya klasında bir motor inşa etti. 2021–2026 multimodal devrimi ise bu motoru algının geri kalanına dikiş attı — ve sonuç, gerçekten <em>ne demek istediğinizi gören</em> ilk kuşak yapay zeka sistemleridir.</p>

<p class="l-text">Bu açılış dersinde alanı kuruyoruz. "Multimodal"ın ne anlama geldiğini hassas biçimde tanımlıyoruz (sadece "görüntüler artı metin"den fazlası), okuyacağınız her mimariyi yönlendiren üç füzyon stratejisini — erken, geç ve çapraz-dikkat füzyonu — inceliyoruz ve tarihi kilometre taşlarını yürüyoruz: <strong>CLIP</strong> (Radford, OpenAI, Oca 2021) görüntü-metin karşıt ön-eğitimini ölçekte kilitledi; <strong>Flamingo</strong> (DeepMind, Nis 2022) ilk inandırıcı few-shot görü-dil modeli; <strong>BLIP-2</strong> (Salesforce, Oca 2023) ve <strong>LLaVA</strong> (Liu, Nis/Eki 2023) "görü kodlayıcı + LLM" tarifini standartlaştırdı; <strong>GPT-4V</strong> (Eyl 2023), <strong>Gemini 1.5</strong> (Şub 2024) 1M-token doğal multimodal bağlamıyla ve <strong>Sora</strong> (Şub 2024) video üretiminin çözülebilir bir mühendislik problemi olduğunu kanıtladı. Bu 8 derslik track'in geri kalanı her dalı açıyor.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Multimodal yapay zekayı hassas biçimde tanımlamak ve "ekstra adımlarla görüntü sınıflandırma"dan ayırt etmek</li>
<li>Üç füzyon stratejisini — erken, geç ve çapraz-dikkat — tanımak ve bir problem için doğru olanı seçmek</li>
<li>2021–2026 kilometre taşı zaman çizelgesini yürümek: CLIP → Flamingo → BLIP-2 → LLaVA → GPT-4V → Gemini → Sora</li>
<li>Tek başına metnin neden zayıf bir dünya modeli olduğunu ve görü/ses/video'nun belirli arıza modlarını nasıl düzelttiğini anlamak</li>
<li>Dört kanonik multimodal görev türünü tanımak: erişim, üretim, yerleştirme (grounding) ve akıl yürütme</li>
<li>Yaygın mimari hatalardan kaçınmak (modalite darboğazları, geç-füzyon-çok-geç, eksik hizalama verisi)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Multimodal Sayılan Nedir?</h2>
<p class="l-text">Bir <strong>modalite</strong>, kendi istatistiklerine sahip bir duyusal veri akışıdır: metin, RGB görüntü, derinlik, ses dalga formu, video, nokta bulutu, IMU, EEG. Bir <strong>multimodal model</strong> iki veya daha fazla bu tür akışı, birinden gelen bilginin diğerine ait tahminleri etkilemesine olanak verecek şekilde ortak biçimde işler. Bir görüntü alıp sınıf etiketi çıkaran model multimodal değildir — tek modlu görüdür. Bir görüntü ve bir soru alıp cevap üreten model (VQA) <em>multimodal</em>dır, çünkü sorunun token'ları görüntüde dikkatin nereye düşeceğini yönlendirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Görü + Dil</div><div class="card-body">2026'nın baskın çifti. Görevler: VQA (VQAv2, GQA), açıklama oluşturma (COCO, NoCaps), erişim (Flickr30k, MS-COCO), yerleştirme (RefCOCO), belge anlama (DocVQA, ChartQA) ve görsel sohbet (LLaVA-Bench).</div></div>
<div class="calc-card"><div class="card-title">Ses + Dil</div><div class="card-body">Konuşma (ASR, TTS, ses ajanları), müzik (MusicGen, Suno) ve ses anlama (AudioCaps, Clotho). Whisper (OpenAI, Eyl 2022) sağlam ASR'yi bir emtiaya dönüştürdü; Qwen-Audio ve SeamlessM4T bunu talimat-takibine genişletti.</div></div>
<div class="calc-card"><div class="card-title">Video</div><div class="card-body">Video, görüntülere zaman eksenini ekler. Modeller: VideoMAE, InternVideo, Video-LLaMA, Gemini 1.5 (yerel video), Sora (üretim). Zordur çünkü ham video devasadır — 30 FPS × 1080p × 60s ≈ klip başına 4 GB.</div></div>
<div class="calc-card"><div class="card-title">Özel modaliteler</div><div class="card-body">Tıbbi görüntüleme (BT, MR), 3D nokta bulutları (sürücüsüz araçlar için LiDAR), uydu görüntüleri (çok-spektrumlu), DNA/protein dizileri (AlphaFold dizi + yapıyı harmanlar), tablosal + metin (finansal dosyalar).</div></div>
</div>

<div class="calc-highlight"><strong>Bu track için çalışma tanımı:</strong> multimodal model, <em>iç temsil uzayı</em> en az iki modaliteden hizalanmış öznitelikleri içeren ve bir modalitedeki bir sorgunun başka bir modalitedeki içeriği erişebilecek, üretebilecek veya hakkında akıl yürütebileceği şekilde olan modeldir. CLIP, görüntü ve metni paylaşılan 768 boyutlu bir uzayda hizalar — kanonik örnek budur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tek Başına Metin Neden Yetmez</h2>
<p class="l-text">Tüm internette eğitilmiş yalnızca metinli bir LLM hala bir fotoğrafta parmakları sayamaz, bir saat yüzünü okuyamaz veya bir grafiğin y-ekseninin logaritmik mi yoksa doğrusal mı olduğunu söyleyemez. Bu başarısızlıklar dil modelinde hatalar değildir — <em>dilin daha zengin bir algısal dünyanın sıkıştırılmış, kayıplı bir izdüşümü</em> olduğunun kanıtıdır. "Küçük", "sol" veya "daha yüksek sesli" gibi kelimeler, yararlı olmaları için piksellerde ve dalga formlarında yeniden yerleştirilmesi gereken duyusal deneyimlerin yer tutucularıdır.</p>

<p class="l-text">Multimodal modelleri motive eden üç somut arıza modu:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Referans çözümlemesi</div><div class="card-body">"Kırmızı kupayı dizüstü bilgisayarın yanına taşı" mutfaktaki bir insan için belirsiz değildir ama modelin kupayı, dizüstü bilgisayarı ve uzamsal ilişkiyi <em>görmesi</em> gerekir. RefCOCO ve yerleştirme benchmarkları bunu ölçer.</div></div>
<div class="calc-card"><div class="card-title">Niceliksel algı</div><div class="card-body">Bir termometreyi, yakıt göstergesini, bir grafiğin işaretlerini okumak. Saf metin modelleri sayıları halüsine eder; yüksek çözünürlüklü kodlayıcılı görü-dil modelleri (LLaVA-Next 1344px, GPT-4V yüksek detay) bunları okuyabilir.</div></div>
<div class="calc-card"><div class="card-title">Prosedürel anlama</div><div class="card-body">"Yumurta tavaya çarptığında çatladı mı?" izlemeyi gerektirir, okumayı değil. Video-LLM'ler (Video-ChatGPT, Gemini 1.5) buna saldırır; statik-görüntü modelleri yapamaz.</div></div>
</div>

<p class="l-text">Tersi de doğrudur: dilsiz saf görü modelleri açık-uçlu talimatları takip etmekte zorlanır. CLIP'in ve torunlarının atılımı, temsilleri hizalandığında <em>her modalitenin diğerinin kör noktalarını doldurmasıdır</em>.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Üç Füzyon Stratejisi</h2>
<p class="l-text">Karşılaşacağınız her multimodal mimari, modalitelerin <em>ne kadar erken</em> karıştırıldığı bir spektrumun bir noktasında bulunur. Bu spektrumdaki üç adlandırılmış bölge tasarımların %95'ini kapsar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Erken füzyon</div><div class="card-body">Ham öznitelikleri girdi katmanında birleştir, ardından tek paylaşılan bir transformer çalıştır. ViLT'de (ayrı görü kodlayıcısı yok), Perceiver IO'da ve Gemini'nin "yerel multimodal" tasarımında kullanılır. Avantaj: en basit, her şeyi uçtan uca öğrenir. Dezavantaj: devasa model, eşleştirilmiş veriye aç.</div></div>
<div class="calc-card"><div class="card-title">Geç füzyon</div><div class="card-body">Her modaliteyi bağımsız kodla, yalnızca son sınıflandırıcıda birleştir. Erken ses-görsel sistemlerde ve çift-kule erişiminde kullanılır (erişim zamanında CLIP). Avantaj: ucuz, modüler, kodlayıcıları değiştirebilirsiniz. Dezavantaj: ince taneli etkileşimleri modelleyemez.</div></div>
<div class="calc-card"><div class="card-title">Çapraz-dikkat füzyonu</div><div class="card-body">Ayrı kodla, sonra bir modalitenin token'larının diğerine dikkat etmesine izin ver. 2026 varsayılanı. Flamingo'da (kapılı çapraz-dikkat), BLIP-2'de (Q-Former), LLaVA'da (projeksiyon + birleştirme → LLM'de öz-dikkat), Gemini, GPT-4V'de kullanılır.</div></div>
</div>

<div class="katex-block">$$A_{\\text{cross}} = \\text{softmax}\\left(\\frac{Q_{\\text{text}} K_{\\text{img}}^\\top}{\\sqrt{d_k}}\\right) V_{\\text{img}}$$</div>

<p class="l-text">Çapraz-dikkat modern multimodal modellerin kalbidir. Metin token'ları sorguları Q oluşturur; görüntü yamaları (veya ses kareleri) anahtarları ve değerleri K, V oluşturur. Metin görüntüye hangi yamaların önemli olduğunu, öğrenilmiş nokta çarpımları ile ağırlıklandırarak "sorar". Aynı mekanizma Flamingo'nun Perceiver Resampler'ını, BLIP-2'nin Q-Former'ını ve LLaVA'daki projeksiyon-sonra-önekleme hilesini güçlendirir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. 2021–2026 Kilometre Taşı Zaman Çizelgesi</h2>
<p class="l-text">Alan beş yılda "zar zor çalışıyor"dan "tüketici ürünlerinde sevkiyat yapıyor"a geçti. Önemli olan makalelerin ve ürünlerin yoğunlaştırılmış zaman çizelgesi:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2021 — CLIP</div><div class="card-body"><strong>Radford ve diğerleri, OpenAI, Oca 2021.</strong> Webden kazınan 400M (görüntü, açıklama) çifti. İki kodlayıcı (ViT + Transformer), karşıt InfoNCE kaybı. ImageNet etiketlerini hiç görmeden ImageNet'te %78 zero-shot top-5. L2'de detaylı.</div></div>
<div class="calc-card"><div class="card-title">2022 — Flamingo, Whisper</div><div class="card-body"><strong>Flamingo</strong> (DeepMind, Nis 2022) — donmuş LM + donmuş görü kodlayıcı, kapılı çapraz-dikkatle yapıştırılmış; ilk inandırıcı few-shot VLM. <strong>Whisper</strong> (OpenAI, Eyl 2022) — 680k saat çok dilli konuşma, sağlam ASR bir emtia olarak. <strong>Stable Diffusion</strong> (Ağu 2022) — açık kaynak metinden görüntüye.</div></div>
<div class="calc-card"><div class="card-title">2023 — BLIP-2, LLaVA, GPT-4V</div><div class="card-body"><strong>BLIP-2</strong> (Salesforce, Oca 2023) — Q-Former donmuş ViT ve donmuş LLM'yi yalnızca ~188M eğitilebilir parametreyle köprüler. <strong>LLaVA</strong> (Liu, Nis 2023; v1.5 Eki 2023) — basit doğrusal projeksiyon + görsel talimat ayarlama. <strong>GPT-4V</strong> (OpenAI, Eyl 2023) — güçlü akıl yürütmeyle yaygın olarak dağıtılan ilk VLM. <strong>DALL-E 3</strong> (Eki 2023).</div></div>
<div class="calc-card"><div class="card-title">2024 — Gemini, Sora, Claude 3</div><div class="card-body"><strong>Gemini 1.5</strong> (Google, Şub 2024) — 1M-token yerel multimodal bağlam; saatlerce video alır. <strong>Sora</strong> (OpenAI, Şub 2024) — uzay-zaman yamaları ve difüzyon transformer ile metinden videoya. <strong>Claude 3</strong> (Mar 2024) — üretimde görü. <strong>SigLIP</strong> (Zhai 2023, 2024'te dağıtıldı) — sigmoid kayıp softmax'ı değiştirir, daha iyi küçük-batch ölçeklendirme.</div></div>
<div class="calc-card"><div class="card-title">2025–2026 — Üretim multimodal</div><div class="card-body">Veo 2 (Google, Ara 2024), Sora Turbo, yerel ses + görüntü üretimi olan Gemini 2.0, bilgisayar-kullanım görüsü olan Claude 3.5/4, açık kaynak LLaVA-Next, Qwen2-VL, InternVL 2, Pixtral (Mistral). Multimodal artık herhangi bir yeni öncü modelin varsayılan modalitesi.</div></div>
</div>

<div class="calc-highlight"><strong>Zaman çizelgesi boyunca tek bir desen:</strong> her dönemdeki kazanan tarif "bulabildiğiniz en güçlü tek modlu modeli dondurun, diğer modaliteye köprülemek için küçük bir adaptör eğitin" idi. Flamingo bunu çapraz-dikkatle yaptı; BLIP-2 Q-Former ile; LLaVA doğrusal bir katmanla. Öncü laboratuvarlar (Google, Anthropic, OpenAI) sonunda sıfırdan yerel multimodal modeller eğitti — ama adaptör yaklaşımı açık kaynakta hala baskın.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Dört Kanonik Multimodal Görev</h2>
<p class="l-text">Multimodal benchmarklar çoğalıyor ama dört görev ailesinde kümeleniyorlar. Probleminizin hangi ailede yaşadığını bilmek size hangi mimariyi ve kaybı seçeceğinizi söyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Erişim</div><div class="card-body">Modalite A'daki bir sorgu verildiğinde, modalite B'de en iyi eşleşmeyi bul. Görüntüden metne (bir fotoğrafa açıklama yaz), metinden görüntüye ("kırmızı kupa" görüntülerini bul), sesten metne (transkribe et). Karşıt kayıplarla eğitilir (CLIP, ALIGN, SigLIP). Benchmarklar: Flickr30k R@1, MS-COCO 5K.</div></div>
<div class="calc-card"><div class="card-title">Üretim</div><div class="card-body">Modalite A'ya koşullu modalite B üret. Açıklama oluşturma, metinden görüntüye (DALL-E, Imagen), metinden videoya (Sora), metinden sese (MusicGen, AudioCraft). Eşleştirilmiş veri üzerinde özyineli (autoregressive) veya difüzyon kayıplarıyla eğitilir.</div></div>
<div class="calc-card"><div class="card-title">Yerleştirme (Grounding)</div><div class="card-body">Modalite B'de bir ifadeyi konumlandır. "Kedi nerede?" → sınırlayıcı kutu. RefCOCO, GQA, Visual Grounding. Modeller: Grounding DINO, Florence-2, Kosmos-2. Robotik ve özerk sürüş için kritik.</div></div>
<div class="calc-card"><div class="card-title">Akıl yürütme</div><div class="card-body">Birden fazla modalite üzerinde çok adımlı çıkarım. Grafik anlama (ChartQA), görüntülerden matematik (MathVista), belge analizi (MMMU), ajan görevleri (VisualWebArena). En zor aile; güçlü LLM omurgası + iyi görsel kodlayıcı gerektirir.</div></div>
</div>

<p class="l-text">Tek bir ürün genellikle birkaçını birleştirir. Bir "multimodal NLP asistanı" (L8 capstone) erişim yapar (görüntü+metin DB üzerinde RAG), üretim (gömülü grafikle yanıt yaz), yerleştirme (hangi sayfa-bölgesinin alıntılandığını vurgula) ve akıl yürütme (bir makbuzun ekran görüntüsünden toplamları hesapla).</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Uygulama — Oyuncak CLIP-Benzeri Erişimci Oluştur</h2>
<p class="l-text">CLIP'in tam eğitimi 400M çift ve 256 V100 alır. Yapıyı 30 satırda yakalayabiliriz: TF-IDF metin öznitelikleri oluştur, her görüntüyü bir "öznitelik vektörü"ne düzleştir ve eşleşen çiftin eşleşmeyen çiftlere göre daha yüksek kosinüs benzerliğine sahip olduğunu kontrol et. Amaç hizalama ilkesini hissetmek, OpenAI ile rekabet etmek değil.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — gerçek CLIP)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># HuggingFace transformers ile gerçek CLIP — Pyodide tarafından engellendi, sadece demo</span>
<span class="kw">from</span> transformers <span class="kw">import</span> CLIPProcessor, CLIPModel
<span class="kw">import</span> torch
<span class="kw">from</span> PIL <span class="kw">import</span> Image

model = CLIPModel.<span class="fn">from_pretrained</span>(<span class="str">"openai/clip-vit-base-patch32"</span>)
proc  = CLIPProcessor.<span class="fn">from_pretrained</span>(<span class="str">"openai/clip-vit-base-patch32"</span>)

img = Image.<span class="fn">open</span>(<span class="str">"cat.jpg"</span>)
texts = [<span class="str">"a photo of a cat"</span>, <span class="str">"a photo of a dog"</span>, <span class="str">"a photo of a car"</span>]
inputs = <span class="fn">proc</span>(text=texts, images=img, return_tensors=<span class="str">"pt"</span>, padding=<span class="kw">True</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**inputs)
probs = out.logits_per_image.<span class="fn">softmax</span>(dim=-<span class="num">1</span>)  <span class="cm"># zero-shot olasiliklari</span>
<span class="fn">print</span>(<span class="fn">dict</span>(<span class="fn">zip</span>(texts, probs[<span class="num">0</span>].<span class="fn">tolist</span>())))
<span class="cm"># {'a photo of a cat': 0.94, 'a photo of a dog': 0.05, 'a photo of a car': 0.01}</span>
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Açıklamalar üzerinde TF-IDF ve düzleştirilmiş bir görüntü özniteliği kullanan oyuncak CLIP-benzeri bir erişimci. Aynı hizalama ilkesi: eşleştirilmiş (görüntü, açıklama) eşleşmeyenlerden daha yüksek kosinüs benzerliğine sahip olmalıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="cm"># 5 sahte goruntu (her biri 16x16x3) — kanal ortalamalari "gorsel oznitelikler" yerine gecer</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
imgs = [np.random.<span class="fn">rand</span>(<span class="num">16</span>, <span class="num">16</span>, <span class="num">3</span>) * c <span class="kw">for</span> c <span class="kw">in</span> [<span class="num">0.2</span>, <span class="num">0.5</span>, <span class="num">0.8</span>, <span class="num">0.3</span>, <span class="num">0.6</span>]]
captions = [
    <span class="str">"a dark photo of a cat"</span>,
    <span class="str">"a medium-bright street scene"</span>,
    <span class="str">"a bright sunny beach"</span>,
    <span class="str">"a dim indoor portrait"</span>,
    <span class="str">"a moderately lit outdoor view"</span>,
]

<span class="cm"># "Goru kodlayici": kanal basina ortalama RGB + std</span>
<span class="kw">def</span> <span class="fn">vis_feat</span>(im):
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([im.<span class="fn">mean</span>(axis=(<span class="num">0</span>,<span class="num">1</span>)), im.<span class="fn">std</span>(axis=(<span class="num">0</span>,<span class="num">1</span>))])

V = np.<span class="fn">stack</span>([<span class="fn">vis_feat</span>(i) <span class="kw">for</span> i <span class="kw">in</span> imgs])  <span class="cm"># (5, 6)</span>
T = <span class="fn">TfidfVectorizer</span>().<span class="fn">fit_transform</span>(captions).<span class="fn">toarray</span>()  <span class="cm"># (5, vocab)</span>

<span class="cm"># Standartlastirilmis surumleri birlestirerek ortak boyuta doldur/projekte et</span>
Vn = (V - V.<span class="fn">mean</span>(<span class="num">0</span>)) / (V.<span class="fn">std</span>(<span class="num">0</span>) + <span class="num">1e-9</span>)
Tn = (T - T.<span class="fn">mean</span>(<span class="num">0</span>)) / (T.<span class="fn">std</span>(<span class="num">0</span>) + <span class="num">1e-9</span>)
D = <span class="fn">min</span>(Vn.shape[<span class="num">1</span>], Tn.shape[<span class="num">1</span>])
sim = <span class="fn">cosine_similarity</span>(Vn[:, :D], Tn[:, :D])
<span class="fn">print</span>(<span class="str">"Benzerlik matrisi (satirlar=goruntuler, sutunlar=aciklamalar):"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(sim, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Diyagonal ortalama (eslesmis):    "</span>, np.<span class="fn">round</span>(np.<span class="fn">diag</span>(sim).<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Diyagonal disi ortalama (rastgele):"</span>, np.<span class="fn">round</span>((sim.<span class="fn">sum</span>() - np.<span class="fn">trace</span>(sim)) / <span class="num">20</span>, <span class="num">3</span>))
</code></pre></div>
</div>

<p class="l-text">Diyagonal (eşleştirilmiş benzerlikler) ortalamada diyagonal-dışından daha yüksek olmalıdır — CLIP'in ölçekte yararlandığı karşıt sinyal budur. 400M çift ve gerçek bir ViT ile bu fark, yalnızca görüntü özniteliklerini "a photo of a {class}" şablonlarıyla karşılaştırarak zero-shot ImageNet sınıflandırması yapabilecek kadar büyük olur.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Yaygın Mimari Hatalar</h2>
<p class="l-text">Çoğu multimodal proje model çok küçük olduğu için değil, bu yinelenen tasarım hatalarından biri yüzünden başarısız olur. Her birinin bilinen bir düzeltmesi vardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Modalite darboğazı</div><div class="card-body">LLM görmeden önce görüntüyü tek bir 512 boyutlu vektöre sıkıştırmak. CLIP bunu erişim için kasıtlı yaptı; VQA için uzamsal detay kaybeder. Düzeltme: yama token'ları kullan (LLaVA 336×336 görüntü için 576 token, LLaVA-Next 2880'e kadar geçirir).</div></div>
<div class="calc-card"><div class="card-title">Geç-füzyon-çok-geç</div><div class="card-body">Görev ince taneli etkileşim gerektirdiğinde (VQA, yerleştirme) yalnızca çıktı katmanında birleştirme. Düzeltme: çapraz-dikkat veya erken füzyon.</div></div>
<div class="calc-card"><div class="card-title">Eksik hizalama verisi</div><div class="card-body">Eşleştirilmemiş görüntüler ve metin üzerinde bir VLM eğitmeye çalışmak. (görüntü, açıklama) çiftleri olmadan karşıt öğrenme başarısız olur. Düzeltme: LAION-5B, COYO-700M veya kalite filtrelemeyle kendi verinizi kazıyın.</div></div>
<div class="calc-card"><div class="card-title">Donmuş kodlayıcı uyumsuzluğu</div><div class="card-body">224×224 CLIP-ViT'i bir LLM'ye yapıştırıp ince yazıyı okumasını istemek. Düzeltme: yüksek çözünürlüklü kodlayıcılar (384'te SigLIP-400M-14, LLaVA-Next'te AnyRes, Qwen2-VL'de dinamik çözünürlük).</div></div>
</div>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Sınır Modelleri</h2>
<p class="l-text"><strong>2024'te multimodal manzara patladı.</strong> Mayıs 2024 ile Aralık 2024 arasında her büyük laboratuvar amiral bir görü-dil modeli çıkardı — ve üçü açık-ağırlıklı. Aşağıdaki kart ızgarası, isimlerini bilmeniz gereken kısa listedir: yayın tarihi, başlık yeteneği ve diğerlerinden ayıran tek şey. Bunu yaşayan bir referans olarak görün: 2026'da okuduğunuzda bir 4o-mini-v2 veya Llama 3.3 Vision olacak, ama kategoriler (kapalı sınır · kapalı açık-kaynak · saf açık-ağırlık) sabittir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GPT-4o (OpenAI, May 2024)</div><div class="card-body">Tek modelde doğal multimodal metin + görü + ses. GPT-4 Turbo'dan %50 daha ucuz, 2× daha hızlı ve ses yolu uçtan uca (Whisper → GPT → TTS aktarımı yok). VQA, grafik okuma ve sesli ajanlar için varsayılan kapalı referans.</div></div>
<div class="calc-card"><div class="card-title">Claude 3.5 / 3.7 Sonnet (Anthropic, Haz 2024 / Şub 2025)</div><div class="card-body">Güçlü görü + uzun bağlam akıl yürütme. Claude 3.7 <em>genişletilmiş düşünme</em> (görünür müsvedde bütçesi) ve <em>bilgisayar kullanımı</em> ekler — Claude ekran görüntüsü alabilir, tıklayabilir, yazabilir, kaydırabilir. Belge YS, ekran görüntüsü hata ayıklama ve ajansal UI görevleri için sınıfının en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Gemini 2.0 Flash (Google, Ara 2024)</div><div class="card-body">Doğal multimodal <em>çıktı</em> — tek bir akışta iç içe metin + görüntü + ses üretir. 1M+ token bağlam penceresi saatlik videoları veya 1500 sayfalık PDF'leri tek seferde yutar. Gerçek zamanlı sesli/görüntülü asistanlar için akışlı Live API.</div></div>
<div class="calc-card"><div class="card-title">Llama 3.2 Vision 11B / 90B (Meta, Eyl 2024)</div><div class="card-body">Meta'nın ilk açık-ağırlıklı VLM'leri. Donmuş bir Llama 3.1 omurgasının üstüne çapraz-dikkat adaptörü. 11B tek bir A100'de çalışır; 90B grafik ve belge kıyaslamalarında GPT-4V ile yarışır. İnce ayar yapılabilir — özel dağıtımlar için pratik seçim.</div></div>
<div class="calc-card"><div class="card-title">Qwen2-VL 72B (Alibaba, Ağu 2024)</div><div class="card-body">Dinamik çözünürlük (AnyRes hilesi yok — kodlayıcı herhangi bir en/boy oranını doğal olarak işler), 20 dakikalık video anlama ve MMMU ile DocVQA üzerinde açık kaynak modeller arasında SOTA. Sınır kapalı modellerle gerçekten rekabet eden ilk açık VLM.</div></div>
<div class="calc-card"><div class="card-title">InternVL 2.5 (OpenGVLab, Ara 2024)</div><div class="card-body">78B parametreli açık VLM, MMMU'da GPT-4V'ye en yakın açık-ağırlıklı model (~%70). Aşamalı eğitim ve 6B InternViT-6B kodlayıcı kullanır. Önemlidir çünkü açık topluluğun kapalı sınırın 2 yıl değil, ~6 ay gerisinde olduğunu gösterir.</div></div>
</div>
<div class="calc-highlight"><strong>Nasıl seçilir:</strong> en yüksek kalite ve sıfır altyapı için kapalı sınır (GPT-4o, Claude 3.7, Gemini 2.0). Veri şirket içinde kalmalıysa veya ince ayar gerekiyorsa Llama 3.2 90B veya Qwen2-VL 72B. Sınır-sınıfı açık ağırlıklar istediğinizde ve GPU'larınız olduğunda InternVL 2.5. Anthropic bilgisayar kullanımı + Claude 3.7, bugün bir tarayıcıyı veya masaüstü UI'sını ajansal olarak sürebilen tek kombinasyondur.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sonraki</h2>
<p class="l-text">Multimodal yapay zeka, iki veya daha fazla sensör akışının; aralarında erişim, üretim, yerleştirme veya akıl yürütme yapabilen tek bir modele entegrasyonudur. CLIP'ten (2021) Gemini 2.0'a (2025) beş yıllık yay; daha iyi kodlayıcılar, daha iyi hizalama verisi ve daha iyi füzyon mekanizmalarının hikayesidir — multimodal'ın özel durum değil, varsayılan olduğu modellerde sonuçlanır.</p>

<div class="calc-highlight"><strong>Önemli çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Bir model, temsil uzayı ≥2 modaliteyi birinin diğerini sorgulayabileceği şekilde ortak kodladığında multimodal'dır.</li>
<li>Üç füzyon stratejisi — erken, geç, çapraz-dikkat — tasarımların %95'ini kapsar. Çapraz-dikkat 2026 varsayılanıdır.</li>
<li>Çapraz-dikkat formülü: metin token'ları sorgulardır, görüntü/ses token'ları anahtar ve değerlerdir.</li>
<li>Beş yıllık kilometre taşı izi: CLIP → Flamingo → BLIP-2 → LLaVA → GPT-4V → Gemini → Sora.</li>
<li>Dört kanonik görev ailesi: erişim, üretim, yerleştirme, akıl yürütme. Çoğu ürün birkaçını birleştirir.</li>
<li>Yaygın tuzaklar: modalite darboğazı, geç-füzyon-çok-geç, eksik hizalama verisi, donmuş kodlayıcı uyumsuzluğu.</li>
</ul>
</div>

<p class="l-text"><strong>multimodal-L2</strong>'de CLIP'i derinlemesine işliyoruz — mimarisi, InfoNCE kaybı, 400M-çift veri kümesi, şaşırtıcı zero-shot ImageNet performansı ve şu anda çoğu erişim hattını besleyen açık kaynak torunları (OpenCLIP, EVA-CLIP, SigLIP). <strong>L3</strong>'te LLaVA / BLIP-2 tarifini uçtan uca yürüyoruz. <strong>L8</strong>'e kadar görüntü + ses + belge girdilerini tek bir capstone asistanına monte edeceksiniz.</p>
</div>`
};
