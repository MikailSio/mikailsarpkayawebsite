window.MULTIMODAL_L5 = {
en: `<p class="l-text"><strong>Video is the modality that breaks every shortcut.</strong> One minute of 30 FPS 1080p video is 1,800 frames at ~6 megabytes each — 10 GB of raw pixels per minute, or about 2,000× a typical text document. You cannot just "feed it to a transformer" the way you do an image. The 2022–2025 video understanding wave attacked this with three orthogonal tricks: <strong>spatiotemporal masked autoencoding</strong> (VideoMAE, 2022) for self-supervised pretraining; <strong>spacetime patches</strong> (Sora, ViViT) that treat video as a 3D extension of image patches; and <strong>long-context multimodal LLMs</strong> (Gemini 1.5 with 1M tokens, Feb 2024) that ingest entire films directly. The result, by 2026, is models that can answer detailed questions about a 45-minute lecture, summarize a sports match with timestamps, or detect a specific event in a security feed.</p>

<p class="l-text">In this lesson we walk the video stack. We start with the data: clip lengths, FPS, the frame-vs-clip distinction. We cover VideoMAE's masked-autoencoder pretraining (75–95% of cubes masked), InternVideo's video-text contrastive pretraining (UMT, ViCLIP), and the Sora-style spacetime patch tokenization that powers both video understanding (ViViT, V-JEPA) and generation (Sora, Veo, Kling). We then look at video-LLMs — Video-ChatGPT (Apr 2023), VILA (Nvidia 2023), VideoLLaMA, LLaVA-OneVision, MovieChat, and the frontier closed-source giants Gemini 1.5/2.0 and GPT-4o with native video support. Throughout we keep grounded in real benchmarks (MSRVTT, ActivityNet-QA, EgoSchema, Video-MME, LongVideoBench).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Reason about video data scales: FPS, clip length, token budget per minute</li>
<li>Reconstruct the spacetime-patch tokenization that ViViT, VideoMAE, and Sora share</li>
<li>Understand VideoMAE's tube-masked self-supervised pretraining</li>
<li>Compare video-LLMs: Video-ChatGPT, VILA, VideoLLaMA, MovieChat, Gemini 1.5</li>
<li>Pick frame sampling strategies (uniform, key-frame, scene-change) for a long-video pipeline</li>
<li>Evaluate video understanding: MSRVTT (short), ActivityNet-QA (medium), EgoSchema / Video-MME / LongVideoBench (long)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Video Data Problem</h2>
<p class="l-text">Image models routinely process 224×224 or 336×336 inputs. Video models cannot afford this per-frame and still cover even a 30-second clip. The arithmetic forces aggressive compression at every level.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Raw scale</div><div class="card-body">1 second @ 30 FPS @ 224×224×3 = 30 × 150,528 = 4.5M floats. 1 minute = 270M. A 7B LLM context (~32K tokens) cannot hold even 0.1 seconds of raw pixels — must be tokenized.</div></div>
<div class="calc-card"><div class="card-title">Frame sampling</div><div class="card-body">Uniformly subsample to 1–4 FPS. A 30-min lecture at 1 FPS = 1800 frames. With 256 visual tokens/frame that is 460K tokens — still too many for most LLMs. So further compression needed.</div></div>
<div class="calc-card"><div class="card-title">Spatiotemporal pooling</div><div class="card-body">Pool across time within a tube of T frames. ViViT pools 16 frames into one set of patch tokens. Q-Former-style architectures distill 1 frame → 32 tokens or 8 frames → 64 tokens.</div></div>
<div class="calc-card"><div class="card-title">Long-video tokens (2024 frontier)</div><div class="card-body">Gemini 1.5 reports ~16 tokens per frame at 1 FPS, so a 1-hour video ≈ 60K tokens. Fits in 1M context. LLaVA-OneVision similar. MovieChat uses a "memory consolidation" buffer for hours of video.</div></div>
</div>

<div class="calc-highlight"><strong>The video token budget rule of thumb (2026):</strong> 16–32 tokens per frame at 1 FPS. Anything denser exceeds practical context and inference cost. Better encoders + better pooling are the active research frontier.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Spacetime Patches — One Idea, Many Models</h2>
<p class="l-text">A 2D image becomes patches by slicing in (height, width). A video becomes <strong>spacetime patches</strong> by slicing in (height, width, time). A patch of 16×16×2 covers a 16×16 region across 2 consecutive frames — one cuboid in (T,H,W) space. This is the unit token that ViViT (Arnab 2021), VideoMAE (Tong 2022), V-JEPA (LeCun 2024), and Sora (OpenAI 2024) all use.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ViViT (Arnab et al., Google 2021)</div><div class="card-body">First clean spacetime-patch ViT. Tube embedding: each token is a 2×16×16 cuboid. Variants: factorized encoder (separate space + time attention) for efficiency, joint attention for accuracy.</div></div>
<div class="calc-card"><div class="card-title">VideoMAE (Tong et al. 2022)</div><div class="card-body">Masked autoencoder for video. 90–95% of cubes masked (vs 75% for image MAE — video is more redundant). Asymmetric encoder-decoder. Pretrained on Kinetics, transfers to action recognition SOTA.</div></div>
<div class="calc-card"><div class="card-title">InternVideo / ViCLIP (2022–2023)</div><div class="card-body">Video-text contrastive (CLIP for video). UMT teacher-student between image and video towers. Powers retrieval for InternVL's video pipeline.</div></div>
<div class="calc-card"><div class="card-title">Sora (OpenAI Feb 2024)</div><div class="card-body">Diffusion transformer. Tokenizes video into spacetime patches via a learned VAE; noises and denoises in patch space. Trained on a vast unannounced video corpus. Generates up to 60s at 1080p.</div></div>
<div class="calc-card"><div class="card-title">V-JEPA (Meta 2024)</div><div class="card-body">LeCun's "predict masked patches in feature space, not pixel space" approach. Self-supervised, no captions, scales well. Strong frozen-feature evaluation.</div></div>
</div>

<div class="katex-block">$$\\text{Patch}(t,h,w) = \\text{Linear}\\!\\left(\\text{Flatten}(V_{t:t+T_p,\\,h:h+H_p,\\,w:w+W_p})\\right)$$</div>

<p class="l-text">A patch slices the video tensor V at a (t, h, w) position with a (T_p, H_p, W_p) cuboid, flattens the resulting voxels, and projects them to the model's hidden dim. For T_p=2, H_p=W_p=16, a 1-second 30-FPS 224×224 clip becomes 15 × 14 × 14 = 2940 patches.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. VideoMAE — Why Heavy Masking Works for Video</h2>
<p class="l-text">VideoMAE (Tong et al., NeurIPS 2022) was the breakthrough that made self-supervised video pretraining tractable. The recipe: tokenize into 2×16×16 cubes, mask 90–95% with "tube masking" (mask the same spatial region across all time steps), train a heavy encoder on the visible 5–10%, train a tiny decoder to reconstruct the masked cubes.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tube masking</div><div class="card-body">Random mask in (H,W) is broadcast to all T time steps. Forces the model to use temporal context — it cannot cheat by attending to the same region in a neighboring frame.</div></div>
<div class="calc-card"><div class="card-title">High mask ratio</div><div class="card-body">Image MAE: 75%. Video MAE: 90–95%. Why higher? Adjacent frames are extremely redundant — at 75% masking the task is trivial. 90%+ forces real temporal reasoning.</div></div>
<div class="calc-card"><div class="card-title">Asymmetric design</div><div class="card-body">Encoder sees only visible tokens (5–10%); decoder is small. Cuts pretraining FLOPs by ~10× vs naive masking. Same trick as image MAE.</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">VideoMAE-L on Kinetics-400: 87.4% top-1 (action recognition), beating supervised baselines. Transfers to AVA, SSv2, HMDB51. Successors: VideoMAE V2 (2023, billion-param), MAR.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Video-LLMs — From Frames to Conversation</h2>
<p class="l-text">Once you have a way to tokenize video, the LLaVA recipe carries over directly: video encoder → projector → LLM → instruction tune. The only new wrinkle is how to compress hundreds or thousands of frames into a manageable token sequence.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Video-ChatGPT (Apr 2023)</div><div class="card-body">Maaz et al., MBZUAI. Sample 100 uniformly-spaced frames → CLIP encoder → spatial avg-pool + temporal avg-pool → 256 + 100 tokens → LLM. Simple, ran on 8×A100. Set the template.</div></div>
<div class="calc-card"><div class="card-title">VideoLLaMA (May 2023)</div><div class="card-body">Damo. Adds an audio branch (BEATs) so the model can answer questions involving sound. Two Q-Formers (visual + audio).</div></div>
<div class="calc-card"><div class="card-title">VILA (Nvidia, Dec 2023)</div><div class="card-body">"Visual Language" model. Key insight: interleaving image+text in pretraining (not just (image, caption) pairs) dramatically helps in-context multi-image and video reasoning.</div></div>
<div class="calc-card"><div class="card-title">LLaVA-OneVision (Aug 2024)</div><div class="card-body">Single model, single image / multi-image / video. ~1 token per frame at extreme compression. Strong on Video-MME.</div></div>
<div class="calc-card"><div class="card-title">MovieChat (2023)</div><div class="card-body">Targets very long videos (1+ hours). Maintains a "long-term memory" of consolidated frame embeddings; only the most recent frames stay in detail.</div></div>
<div class="calc-card"><div class="card-title">Gemini 1.5 / 2.0 (Google)</div><div class="card-body">Native video at 1 FPS within a 1M (later 2M) context. Reportedly tokenizes video into ~16 patches/frame. Ingests up to ~3 hours of video. The closed-source frontier.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Hands-On — Video as Frame-Sequence Features</h2>
<p class="l-text">A toy model that captures the video pipeline: sample N frames, encode each with image features, average-pool spatially and temporally, run a classifier. We use random images as stand-in frames since Pyodide cannot decode mp4.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — real pipeline)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real video processing — Pyodide-blocked (opencv, decord, transformers)</span>
<span class="kw">import</span> cv2
<span class="kw">import</span> torch
<span class="kw">from</span> transformers <span class="kw">import</span> VideoMAEFeatureExtractor, VideoMAEForVideoClassification

cap = cv2.<span class="fn">VideoCapture</span>(<span class="str">"clip.mp4"</span>)
total = <span class="fn">int</span>(cap.<span class="fn">get</span>(cv2.CAP_PROP_FRAME_COUNT))
idxs = np.<span class="fn">linspace</span>(<span class="num">0</span>, total - <span class="num">1</span>, <span class="num">16</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
frames = []
<span class="kw">for</span> i <span class="kw">in</span> idxs:
    cap.<span class="fn">set</span>(cv2.CAP_PROP_POS_FRAMES, i)
    _, f = cap.<span class="fn">read</span>()
    frames.<span class="fn">append</span>(cv2.<span class="fn">cvtColor</span>(f, cv2.COLOR_BGR2RGB))

fe = VideoMAEFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"MCG-NJU/videomae-base-finetuned-kinetics"</span>)
mdl = VideoMAEForVideoClassification.<span class="fn">from_pretrained</span>(<span class="str">"MCG-NJU/videomae-base-finetuned-kinetics"</span>)
inp = <span class="fn">fe</span>(frames, return_tensors=<span class="str">"pt"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">mdl</span>(**inp).logits
<span class="fn">print</span>(<span class="str">"Predicted action:"</span>, mdl.config.id2label[logits.<span class="fn">argmax</span>(-<span class="num">1</span>).<span class="fn">item</span>()])
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Synthetic 16-frame "videos" classified by motion direction. Each video is 16 random images shifted by a constant velocity per class. Per-frame features = pixel mean + std + frame-difference magnitude.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report

np.random.<span class="fn">seed</span>(<span class="num">11</span>)
T, H, W = <span class="num">16</span>, <span class="num">16</span>, <span class="num">16</span>

<span class="kw">def</span> <span class="fn">make_video</span>(motion):
    <span class="str">"""motion in {'static','left','right'} produces a synthetic 16-frame clip."""</span>
    base = np.random.<span class="fn">rand</span>(H, W) * <span class="num">0.3</span>
    frames = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        f = base.<span class="fn">copy</span>()
        <span class="kw">if</span> motion == <span class="str">"left"</span>:
            f = np.<span class="fn">roll</span>(f, -t, axis=<span class="num">1</span>)
        <span class="kw">elif</span> motion == <span class="str">"right"</span>:
            f = np.<span class="fn">roll</span>(f, t, axis=<span class="num">1</span>)
        f += np.random.<span class="fn">randn</span>(H, W) * <span class="num">0.05</span>
        frames.<span class="fn">append</span>(f)
    <span class="kw">return</span> np.<span class="fn">stack</span>(frames)  <span class="cm"># (T,H,W)</span>

<span class="kw">def</span> <span class="fn">video_feat</span>(v):
    <span class="cm"># Spatial: mean + std per frame; Temporal: mean abs frame diff</span>
    spatial = np.<span class="fn">array</span>([f.<span class="fn">mean</span>() <span class="kw">for</span> f <span class="kw">in</span> v] + [f.<span class="fn">std</span>() <span class="kw">for</span> f <span class="kw">in</span> v])
    diffs   = np.<span class="fn">abs</span>(np.<span class="fn">diff</span>(v, axis=<span class="num">0</span>)).<span class="fn">mean</span>(axis=(<span class="num">1</span>,<span class="num">2</span>))   <span class="cm"># (T-1,)</span>
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([spatial, diffs, [diffs.<span class="fn">mean</span>(), diffs.<span class="fn">std</span>()]])

X, y = [], []
<span class="kw">for</span> label <span class="kw">in</span> [<span class="str">"static"</span>, <span class="str">"left"</span>, <span class="str">"right"</span>]:
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
        X.<span class="fn">append</span>(<span class="fn">video_feat</span>(<span class="fn">make_video</span>(label))); y.<span class="fn">append</span>(label)
X = np.<span class="fn">stack</span>(X)

split = <span class="num">120</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X[:split], y[:split])
<span class="fn">print</span>(<span class="fn">classification_report</span>(y[split:], clf.<span class="fn">predict</span>(X[split:])))
<span class="fn">print</span>(<span class="str">"\\nNotice: temporal features (frame diffs) are the key signal —"</span>)
<span class="fn">print</span>(<span class="str">"a per-frame-only model would never separate 'left' from 'right'."</span>)
</code></pre></div>
</div>

<p class="l-text">The crucial design lesson: <em>temporal features matter as much as spatial ones</em>. A model that only pools per-frame embeddings throws away motion. VideoMAE, ViViT, and any production video-LLM all explicitly cross frames in their attention or pooling.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Video Generation Glimpse — Sora and Friends</h2>
<p class="l-text">L7 is dedicated to multimodal generation, but Sora deserves a placement here because its <em>understanding</em> machinery (spacetime patches, diffusion transformer) is shared with the discriminative video models we just covered.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sora (OpenAI Feb 2024)</div><div class="card-body">Diffusion transformer over learned spacetime patches. Variable resolution (1080p, 720p, vertical). Up to 60s. Text-conditioned via a re-captioning system that rewrites user prompts in detail.</div></div>
<div class="calc-card"><div class="card-title">Veo 2 (Google Dec 2024)</div><div class="card-body">Best-in-class on physics fidelity (objects fall, fluids flow correctly more often). 4K, up to 8 seconds initially.</div></div>
<div class="calc-card"><div class="card-title">Kling, Pika, Runway Gen-3</div><div class="card-body">Open-product space. Kling (Kuaishou, China) competitive with Sora at launch in mid-2024. Pika and Runway lead in editing tools and ControlNet-style conditioning.</div></div>
<div class="calc-card"><div class="card-title">Open-source — Open-Sora, CogVideoX</div><div class="card-body">Reproductions / open competitors. CogVideoX-5B (Tsinghua 2024) generates 6 seconds at 720p, weights and training code public.</div></div>
</div>

<div class="calc-highlight"><strong>The understanding–generation symmetry:</strong> the same patch tokenization that lets Gemini 1.5 understand a 1-hour video lets Sora generate a 1-minute one. Patches in, patches out — the difference is whether you mask the future and predict (autoregressive / diffusion) or you condition on text and predict everything (text-to-video).</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Benchmarks for Video Understanding</h2>
<p class="l-text">Video benchmarks fragment by length, by question type, and by whether they require fine temporal reasoning vs broad summarization.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Short clips (≤1 min)</div><div class="card-body">MSRVTT, MSVD-QA, ActivityNet-QA, NExT-QA. Most legacy benchmarks here. Easy for any 2024-era video-LLM.</div></div>
<div class="calc-card"><div class="card-title">Medium (1–10 min)</div><div class="card-body">Video-MME (2024), TempCompass (temporal reasoning specifically), MVBench. Discriminate between models that "got" video vs those just averaging frames.</div></div>
<div class="calc-card"><div class="card-title">Long (10 min–3 hr)</div><div class="card-body">EgoSchema (egocentric, 3-min clips with hard temporal reasoning), LongVideoBench, MLVU. Gemini 1.5 reigns. Open-source still catching up.</div></div>
<div class="calc-card"><div class="card-title">Action recognition (legacy)</div><div class="card-body">Kinetics-400/600/700, AVA, Something-Something v2. Not LLM-format benchmarks; pure classification. VideoMAE V2: 90.0% top-1 K400.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Video understanding is image understanding plus a brutal scaling problem. The 2022–2025 stack converged on three pillars: spacetime-patch tokenization (ViViT, VideoMAE, Sora share this), heavy masked-autoencoder pretraining (VideoMAE 90% mask, V-JEPA in feature space), and long-context multimodal LLMs (Gemini 1.5 ingesting hours of video at 1 FPS). Open-source is closing the gap with LLaVA-OneVision, VILA, and CogVideoX.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Video forces aggressive token compression: 16–32 tokens/frame at 1 FPS is the 2026 norm.</li>
<li>Spacetime patches (T_p×H_p×W_p cuboids) are the universal video token. ViViT, VideoMAE, Sora all use them.</li>
<li>VideoMAE: 90–95% tube masking → encoder sees 5–10% → small decoder reconstructs. Major SSL win for video.</li>
<li>Video-LLMs: Video-ChatGPT, VILA, VideoLLaMA, MovieChat, LLaVA-OneVision, Gemini 1.5/2.0.</li>
<li>Long video uses memory consolidation (MovieChat) or huge native context (Gemini 1.5 at 1M tokens).</li>
<li>Benchmarks: MSRVTT (short), Video-MME (medium), EgoSchema / LongVideoBench (long), Kinetics (legacy action).</li>
</ul>
</div>

<p class="l-text">In <strong>multimodal-L6</strong> we narrow the modality from "any video" to a specific high-value subdomain: documents. Receipts, invoices, scientific PDFs, charts, forms. Models like LayoutLMv3, Donut (OCR-free), and Pix2Struct attack a multimodal stack — text, layout (bounding boxes), and pixels — that vanilla VLMs miss.</p>
</div>`,
tr: `<p class="l-text"><strong>Video, her kestirme yolu kıran modalitedir.</strong> 30 FPS 1080p video'nun bir dakikası, her biri ~6 megabayt olan 1.800 karedir — dakika başına 10 GB ham piksel veya tipik bir metin belgesinin yaklaşık 2.000 katı. Bunu bir görüntü gibi "transformer'a besleyebilirsiniz" diyemezsiniz. 2022–2025 video anlama dalgası buna üç dik numara ile saldırdı: <strong>uzay-zamansal maskelenmiş otomatik kodlama</strong> (VideoMAE, 2022) öz-denetimli ön-eğitim için; <strong>uzay-zaman yamaları</strong> (Sora, ViViT) videoyu görüntü yamalarının 3D uzantısı olarak ele alan; ve <strong>uzun-bağlam multimodal LLM'ler</strong> (Gemini 1.5 1M token ile, Şub 2024) tüm filmleri doğrudan alır. Sonuç, 2026 itibariyle, 45 dakikalık bir konferans hakkında ayrıntılı sorular cevaplayabilen, zaman damgalarıyla bir spor maçını özetleyen veya bir güvenlik akışında belirli bir olayı tespit edebilen modellerdir.</p>

<p class="l-text">Bu derste video yığınını yürüyoruz. Veriyle başlıyoruz: klip uzunlukları, FPS, kare-vs-klip ayrımı. VideoMAE'nin maskelenmiş-otomatik-kodlayıcı ön-eğitimini (küplerin %75–95'i maskelendi), InternVideo'nun video-metin karşıt ön-eğitimini (UMT, ViCLIP) ve hem video anlamayı (ViViT, V-JEPA) hem de üretimi (Sora, Veo, Kling) güçlendiren Sora-tarzı uzay-zaman yama tokenleştirmesini işliyoruz. Sonra video-LLM'lere bakıyoruz — Video-ChatGPT (Nis 2023), VILA (Nvidia 2023), VideoLLaMA, LLaVA-OneVision, MovieChat ve yerel video desteği olan öncü kapalı kaynak devler Gemini 1.5/2.0 ve GPT-4o. Her şey boyunca gerçek benchmarklara (MSRVTT, ActivityNet-QA, EgoSchema, Video-MME, LongVideoBench) bağlı kalıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Video veri ölçekleri hakkında akıl yürütmek: FPS, klip uzunluğu, dakika başına token bütçesi</li>
<li>ViViT, VideoMAE ve Sora'nın paylaştığı uzay-zaman yama tokenleştirmesini yeniden inşa etmek</li>
<li>VideoMAE'nin tüp-maskeli öz-denetimli ön-eğitimini anlamak</li>
<li>Video-LLM'leri karşılaştırmak: Video-ChatGPT, VILA, VideoLLaMA, MovieChat, Gemini 1.5</li>
<li>Uzun bir video hattı için kare örnekleme stratejilerini seçmek (tekdüze, anahtar-kare, sahne-değişimi)</li>
<li>Video anlamayı değerlendirmek: MSRVTT (kısa), ActivityNet-QA (orta), EgoSchema / Video-MME / LongVideoBench (uzun)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Video Veri Problemi</h2>
<p class="l-text">Görüntü modelleri rutin olarak 224×224 veya 336×336 girdileri işler. Video modelleri kare başına bunu karşılayıp 30 saniyelik bir klibi bile kaplayamaz. Aritmetik her seviyede agresif sıkıştırma zorlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ham ölçek</div><div class="card-body">1 saniye @ 30 FPS @ 224×224×3 = 30 × 150.528 = 4.5M float. 1 dakika = 270M. 7B LLM bağlamı (~32K token) ham piksellerin 0.1 saniyesini bile tutamaz — tokenleştirilmesi gerekir.</div></div>
<div class="calc-card"><div class="card-title">Kare örnekleme</div><div class="card-body">Tekdüze altörnekleme 1–4 FPS'e. 1 FPS'de 30 dakikalık konferans = 1800 kare. Kare başına 256 görsel token ile 460K token — çoğu LLM için hala çok fazla. Daha fazla sıkıştırma gerekir.</div></div>
<div class="calc-card"><div class="card-title">Uzay-zamansal havuzlama</div><div class="card-body">T kareli bir tüp içinde zaman boyunca havuzla. ViViT 16 kareyi tek bir yama token kümesine havuzlar. Q-Former-tarzı mimariler 1 kareyi → 32 token'a veya 8 kareyi → 64 token'a damıtır.</div></div>
<div class="calc-card"><div class="card-title">Uzun video token'ları (2024 öncüsü)</div><div class="card-body">Gemini 1.5, 1 FPS'de kare başına ~16 token raporlar, yani 1 saatlik bir video ≈ 60K token. 1M bağlama sığar. LLaVA-OneVision benzer. MovieChat saatlerce video için "bellek konsolidasyon" tamponu kullanır.</div></div>
</div>

<div class="calc-highlight"><strong>2026 video token bütçesi pratik kuralı:</strong> 1 FPS'de kare başına 16–32 token. Daha yoğun olan her şey pratik bağlamı ve çıkarım maliyetini aşar. Daha iyi kodlayıcılar + daha iyi havuzlama aktif araştırma öncüsüdür.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Uzay-Zaman Yamaları — Tek Fikir, Birçok Model</h2>
<p class="l-text">Bir 2D görüntü (yükseklik, genişlik) bölünerek yamalara dönüşür. Bir video <strong>uzay-zaman yamaları</strong>na (yükseklik, genişlik, zaman) bölünerek dönüşür. 16×16×2'lik bir yama, 2 ardışık kare boyunca 16×16'lık bir bölgeyi kapsar — (T,H,W) uzayında bir küboid. Bu, ViViT (Arnab 2021), VideoMAE (Tong 2022), V-JEPA (LeCun 2024) ve Sora'nın (OpenAI 2024) hepsinin kullandığı birim token'dır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ViViT (Arnab vd., Google 2021)</div><div class="card-body">İlk temiz uzay-zaman yamalı ViT. Tüp gömme: her token bir 2×16×16 küboiddir. Varyantlar: faktörize kodlayıcı (verimlilik için ayrı uzay + zaman dikkati), doğruluk için ortak dikkat.</div></div>
<div class="calc-card"><div class="card-title">VideoMAE (Tong vd. 2022)</div><div class="card-body">Video için maskelenmiş otomatik kodlayıcı. Küplerin %90–95'i maskelidir (görüntü MAE için %75'e karşı — video daha gereksizdir). Asimetrik kodlayıcı-kod çözücü. Kinetics üzerinde ön-eğitildi, eylem tanıma SOTA'ya transfer eder.</div></div>
<div class="calc-card"><div class="card-title">InternVideo / ViCLIP (2022–2023)</div><div class="card-body">Video-metin karşıt (video için CLIP). Görüntü ve video kuleleri arasında UMT öğretmen-öğrenci. InternVL'in video hattı için erişimi besler.</div></div>
<div class="calc-card"><div class="card-title">Sora (OpenAI Şub 2024)</div><div class="card-body">Difüzyon transformer. Öğrenilmiş bir VAE aracılığıyla videoyu uzay-zaman yamalarına tokenleştirir; yama uzayında gürültüleştirir ve gürültüden arındırır. Devasa duyurulmamış bir video derlemi üzerinde eğitildi. 1080p'de 60s'ye kadar üretir.</div></div>
<div class="calc-card"><div class="card-title">V-JEPA (Meta 2024)</div><div class="card-body">LeCun'un "piksel uzayında değil, öznitelik uzayında maskelenmiş yamaları öngör" yaklaşımı. Öz-denetimli, açıklamasız, iyi ölçeklenir. Güçlü donmuş-öznitelik değerlendirmesi.</div></div>
</div>

<div class="katex-block">$$\\text{Patch}(t,h,w) = \\text{Linear}\\!\\left(\\text{Flatten}(V_{t:t+T_p,\\,h:h+H_p,\\,w:w+W_p})\\right)$$</div>

<p class="l-text">Bir yama, video tensörü V'yi (t, h, w) konumunda bir (T_p, H_p, W_p) küboidi ile diler, sonuçta oluşan voksleri düzleştirir ve modelin gizli boyutuna projekte eder. T_p=2, H_p=W_p=16 için, 1 saniyelik 30-FPS 224×224 klip 15 × 14 × 14 = 2940 yamaya dönüşür.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. VideoMAE — Video İçin Ağır Maskeleme Neden Çalışır</h2>
<p class="l-text">VideoMAE (Tong vd., NeurIPS 2022) öz-denetimli video ön-eğitimini çözülebilir hale getiren atılımdı. Tarif: 2×16×16 küplere tokenleştir, "tüp maskeleme" ile %90–95 maskele (aynı uzamsal bölgeyi tüm zaman adımları boyunca maskele), görünür %5–10'da ağır bir kodlayıcı eğit, maskelenen küpleri yeniden inşa etmek için küçük bir kod çözücü eğit.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tüp maskeleme</div><div class="card-body">(H,W)'da rastgele maske tüm T zaman adımlarına yayınlanır. Modeli zamansal bağlam kullanmaya zorlar — komşu bir karedeki aynı bölgeye dikkat ederek hile yapamaz.</div></div>
<div class="calc-card"><div class="card-title">Yüksek maske oranı</div><div class="card-body">Görüntü MAE: %75. Video MAE: %90–95. Neden daha yüksek? Ardışık kareler son derece gereksizdir — %75 maskelemede görev önemsiz. %90+ gerçek zamansal akıl yürütmeyi zorlar.</div></div>
<div class="calc-card"><div class="card-title">Asimetrik tasarım</div><div class="card-body">Kodlayıcı yalnızca görünür token'ları görür (%5–10); kod çözücü küçüktür. Naif maskelemeye göre ön-eğitim FLOP'larını ~10× keser. Görüntü MAE ile aynı numara.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">VideoMAE-L Kinetics-400'de: %87.4 top-1 (eylem tanıma), denetimli baseline'ları yener. AVA, SSv2, HMDB51'e transfer eder. Halefler: VideoMAE V2 (2023, milyar-parametreli), MAR.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Video-LLM'ler — Karelerden Konuşmaya</h2>
<p class="l-text">Video tokenleştirmenin bir yolunu elde ettiğinizde, LLaVA tarifi doğrudan geçer: video kodlayıcı → projektör → LLM → talimat ayarla. Tek yeni kıvrım, yüzlerce veya binlerce kareyi yönetilebilir bir token dizisine nasıl sıkıştıracağınızdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Video-ChatGPT (Nis 2023)</div><div class="card-body">Maaz vd., MBZUAI. Tekdüze aralıklı 100 kare örnekle → CLIP kodlayıcı → uzamsal ortalama-havuz + zamansal ortalama-havuz → 256 + 100 token → LLM. Basit, 8×A100'de çalıştı. Şablonu belirledi.</div></div>
<div class="calc-card"><div class="card-title">VideoLLaMA (May 2023)</div><div class="card-body">Damo. Modelin sesi içeren soruları cevaplayabilmesi için bir ses dalı (BEATs) ekler. İki Q-Former (görsel + ses).</div></div>
<div class="calc-card"><div class="card-title">VILA (Nvidia, Ara 2023)</div><div class="card-body">"Visual Language" modeli. Kilit içgörü: ön-eğitimde görüntü+metin'i serpiştirmek (sadece (görüntü, açıklama) çiftleri değil) bağlam-içi çoklu-görüntü ve video akıl yürütmeye dramatik biçimde yardımcı olur.</div></div>
<div class="calc-card"><div class="card-title">LLaVA-OneVision (Ağu 2024)</div><div class="card-body">Tek model, tek görüntü / çoklu-görüntü / video. Aşırı sıkıştırmada kare başına ~1 token. Video-MME'de güçlü.</div></div>
<div class="calc-card"><div class="card-title">MovieChat (2023)</div><div class="card-body">Çok uzun videoları (1+ saat) hedefler. Konsolide kare gömmelerinin "uzun-vadeli belleğini" sürdürür; yalnızca en son kareler ayrıntılı kalır.</div></div>
<div class="calc-card"><div class="card-title">Gemini 1.5 / 2.0 (Google)</div><div class="card-body">1M (sonra 2M) bağlam içinde 1 FPS'de yerel video. Bildirildiğine göre videoyu kare başına ~16 yama tokenize eder. ~3 saatlik videoya kadar alır. Kapalı kaynak öncüsü.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Uygulama — Kare-Dizisi Öznitelikleri Olarak Video</h2>
<p class="l-text">Video hattını yakalayan oyuncak bir model: N kare örnekle, her birini görüntü öznitelikleriyle kodla, uzamsal ve zamansal olarak ortalama-havuzla, bir sınıflandırıcı çalıştır. Pyodide mp4 kod çözemediğinden yer-tutucu kareler olarak rastgele görüntüler kullanıyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — gerçek hattı)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Gercek video isleme — Pyodide tarafindan engellendi (opencv, decord, transformers)</span>
<span class="kw">import</span> cv2
<span class="kw">import</span> torch
<span class="kw">from</span> transformers <span class="kw">import</span> VideoMAEFeatureExtractor, VideoMAEForVideoClassification

cap = cv2.<span class="fn">VideoCapture</span>(<span class="str">"clip.mp4"</span>)
total = <span class="fn">int</span>(cap.<span class="fn">get</span>(cv2.CAP_PROP_FRAME_COUNT))
idxs = np.<span class="fn">linspace</span>(<span class="num">0</span>, total - <span class="num">1</span>, <span class="num">16</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
frames = []
<span class="kw">for</span> i <span class="kw">in</span> idxs:
    cap.<span class="fn">set</span>(cv2.CAP_PROP_POS_FRAMES, i)
    _, f = cap.<span class="fn">read</span>()
    frames.<span class="fn">append</span>(cv2.<span class="fn">cvtColor</span>(f, cv2.COLOR_BGR2RGB))

fe = VideoMAEFeatureExtractor.<span class="fn">from_pretrained</span>(<span class="str">"MCG-NJU/videomae-base-finetuned-kinetics"</span>)
mdl = VideoMAEForVideoClassification.<span class="fn">from_pretrained</span>(<span class="str">"MCG-NJU/videomae-base-finetuned-kinetics"</span>)
inp = <span class="fn">fe</span>(frames, return_tensors=<span class="str">"pt"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">mdl</span>(**inp).logits
<span class="fn">print</span>(<span class="str">"Tahmin edilen eylem:"</span>, mdl.config.id2label[logits.<span class="fn">argmax</span>(-<span class="num">1</span>).<span class="fn">item</span>()])
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hareket yönüne göre sınıflandırılan sentetik 16-kare "video"lar. Her video, sınıf başına sabit bir hızla kaydırılan 16 rastgele görüntüdür. Kare başına öznitelikler = piksel ortalaması + std + kare-fark büyüklüğü.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report

np.random.<span class="fn">seed</span>(<span class="num">11</span>)
T, H, W = <span class="num">16</span>, <span class="num">16</span>, <span class="num">16</span>

<span class="kw">def</span> <span class="fn">make_video</span>(motion):
    <span class="str">"""motion {'static','left','right'} icinde sentetik 16-kare bir klip uretir."""</span>
    base = np.random.<span class="fn">rand</span>(H, W) * <span class="num">0.3</span>
    frames = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        f = base.<span class="fn">copy</span>()
        <span class="kw">if</span> motion == <span class="str">"left"</span>:
            f = np.<span class="fn">roll</span>(f, -t, axis=<span class="num">1</span>)
        <span class="kw">elif</span> motion == <span class="str">"right"</span>:
            f = np.<span class="fn">roll</span>(f, t, axis=<span class="num">1</span>)
        f += np.random.<span class="fn">randn</span>(H, W) * <span class="num">0.05</span>
        frames.<span class="fn">append</span>(f)
    <span class="kw">return</span> np.<span class="fn">stack</span>(frames)  <span class="cm"># (T,H,W)</span>

<span class="kw">def</span> <span class="fn">video_feat</span>(v):
    <span class="cm"># Uzamsal: kare basina ortalama + std; Zamansal: ortalama mutlak kare farki</span>
    spatial = np.<span class="fn">array</span>([f.<span class="fn">mean</span>() <span class="kw">for</span> f <span class="kw">in</span> v] + [f.<span class="fn">std</span>() <span class="kw">for</span> f <span class="kw">in</span> v])
    diffs   = np.<span class="fn">abs</span>(np.<span class="fn">diff</span>(v, axis=<span class="num">0</span>)).<span class="fn">mean</span>(axis=(<span class="num">1</span>,<span class="num">2</span>))   <span class="cm"># (T-1,)</span>
    <span class="kw">return</span> np.<span class="fn">concatenate</span>([spatial, diffs, [diffs.<span class="fn">mean</span>(), diffs.<span class="fn">std</span>()]])

X, y = [], []
<span class="kw">for</span> label <span class="kw">in</span> [<span class="str">"static"</span>, <span class="str">"left"</span>, <span class="str">"right"</span>]:
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
        X.<span class="fn">append</span>(<span class="fn">video_feat</span>(<span class="fn">make_video</span>(label))); y.<span class="fn">append</span>(label)
X = np.<span class="fn">stack</span>(X)

split = <span class="num">120</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X[:split], y[:split])
<span class="fn">print</span>(<span class="fn">classification_report</span>(y[split:], clf.<span class="fn">predict</span>(X[split:])))
<span class="fn">print</span>(<span class="str">"\\nDikkat: zamansal oznitelikler (kare farklari) anahtar sinyaldir —"</span>)
<span class="fn">print</span>(<span class="str">"yalnizca-kare bir model 'left'i 'right'tan asla ayiramaz."</span>)
</code></pre></div>
</div>

<p class="l-text">Kritik tasarım dersi: <em>zamansal öznitelikler uzamsal olanlar kadar önemlidir</em>. Yalnızca kare başına gömmeleri havuzlayan bir model hareketi atar. VideoMAE, ViViT ve herhangi bir üretim video-LLM'si dikkatlerinde veya havuzlamalarında açıkça kareleri çaprazlar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Video Üretim Bakışı — Sora ve Arkadaşları</h2>
<p class="l-text">L7 multimodal üretime adanmıştır ama Sora burada bir yer hak ediyor çünkü <em>anlama</em> mekanizması (uzay-zaman yamaları, difüzyon transformer) az önce işlediğimiz ayırt edici video modelleriyle paylaşılıyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sora (OpenAI Şub 2024)</div><div class="card-body">Öğrenilmiş uzay-zaman yamaları üzerinde difüzyon transformer. Değişken çözünürlük (1080p, 720p, dikey). 60s'e kadar. Kullanıcı promptlarını ayrıntılı olarak yeniden yazan bir yeniden-açıklama sistemi aracılığıyla metin koşullu.</div></div>
<div class="calc-card"><div class="card-title">Veo 2 (Google Ara 2024)</div><div class="card-body">Fizik doğruluğunda en iyi sınıf (nesneler düşer, akışkanlar daha sık doğru akar). 4K, başlangıçta 8 saniyeye kadar.</div></div>
<div class="calc-card"><div class="card-title">Kling, Pika, Runway Gen-3</div><div class="card-body">Açık-ürün uzayı. Kling (Kuaishou, Çin) 2024 ortasında lansmanda Sora ile rekabetçi. Pika ve Runway düzenleme araçlarında ve ControlNet-tarzı koşullandırmada lider.</div></div>
<div class="calc-card"><div class="card-title">Açık kaynak — Open-Sora, CogVideoX</div><div class="card-body">Replikasyonlar / açık rakipler. CogVideoX-5B (Tsinghua 2024) 720p'de 6 saniye üretir, ağırlıklar ve eğitim kodu kamuya açık.</div></div>
</div>

<div class="calc-highlight"><strong>Anlama–üretim simetrisi:</strong> Gemini 1.5'in 1 saatlik bir videoyu anlamasına izin veren aynı yama tokenleştirmesi, Sora'nın 1 dakikalık birini üretmesine de izin verir. Yamalar girer, yamalar çıkar — fark, geleceği maskeleyip öngörmeniz (özyineli / difüzyon) veya metne koşullandırıp her şeyi öngörmeniz (metinden videoya) midir.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Video Anlama Benchmarkları</h2>
<p class="l-text">Video benchmarkları uzunluğa, soru türüne ve ince zamansal akıl yürütme vs geniş özetleme gerektirip gerektirmediğine göre parçalanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kısa klipler (≤1 dk)</div><div class="card-body">MSRVTT, MSVD-QA, ActivityNet-QA, NExT-QA. Çoğu eski benchmark burada. Herhangi bir 2024-dönemi video-LLM için kolay.</div></div>
<div class="calc-card"><div class="card-title">Orta (1–10 dk)</div><div class="card-body">Video-MME (2024), TempCompass (özellikle zamansal akıl yürütme), MVBench. "Video"yu anlamış modelleri sadece kareleri ortalayanlardan ayırt eder.</div></div>
<div class="calc-card"><div class="card-title">Uzun (10 dk–3 saat)</div><div class="card-body">EgoSchema (egosentrik, zor zamansal akıl yürütmeyle 3 dakikalık klipler), LongVideoBench, MLVU. Gemini 1.5 hüküm sürüyor. Açık kaynak hala yetişiyor.</div></div>
<div class="calc-card"><div class="card-title">Eylem tanıma (eski)</div><div class="card-body">Kinetics-400/600/700, AVA, Something-Something v2. LLM-formatlı benchmark değil; saf sınıflandırma. VideoMAE V2: K400'de %90.0 top-1.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sonraki</h2>
<p class="l-text">Video anlama, görüntü anlamasıdır artı acımasız bir ölçeklendirme problemi. 2022–2025 yığını üç sütunda yakınsadı: uzay-zaman yama tokenleştirmesi (ViViT, VideoMAE, Sora bunu paylaşır), ağır maskelenmiş-otomatik-kodlayıcı ön-eğitimi (VideoMAE %90 maske, V-JEPA öznitelik uzayında) ve uzun-bağlamlı multimodal LLM'ler (Gemini 1.5, 1 FPS'de saatlerce video alır). Açık kaynak LLaVA-OneVision, VILA ve CogVideoX ile farkı kapatıyor.</p>

<div class="calc-highlight"><strong>Önemli çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Video agresif token sıkıştırması zorlar: 1 FPS'de 16–32 token/kare 2026 normudur.</li>
<li>Uzay-zaman yamaları (T_p×H_p×W_p küboidler) evrensel video token'ıdır. ViViT, VideoMAE, Sora hepsi onları kullanır.</li>
<li>VideoMAE: %90–95 tüp maskeleme → kodlayıcı %5–10 görür → küçük kod çözücü yeniden inşa eder. Video için büyük SSL kazanımı.</li>
<li>Video-LLM'ler: Video-ChatGPT, VILA, VideoLLaMA, MovieChat, LLaVA-OneVision, Gemini 1.5/2.0.</li>
<li>Uzun video bellek konsolidasyonu (MovieChat) veya devasa yerel bağlam (1M token'da Gemini 1.5) kullanır.</li>
<li>Benchmarklar: MSRVTT (kısa), Video-MME (orta), EgoSchema / LongVideoBench (uzun), Kinetics (eski eylem).</li>
</ul>
</div>

<p class="l-text"><strong>multimodal-L6</strong>'da modaliteyi "herhangi bir video"dan belirli yüksek-değerli bir alt alana daraltıyoruz: belgeler. Makbuzlar, faturalar, bilimsel PDF'ler, grafikler, formlar. LayoutLMv3, Donut (OCR-bağımsız) ve Pix2Struct gibi modeller, sıradan VLM'lerin kaçırdığı bir multimodal yığına — metin, düzen (sınırlayıcı kutular) ve pikseller — saldırır.</p>
</div>`
};
