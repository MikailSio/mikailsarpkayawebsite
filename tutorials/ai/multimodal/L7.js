window.MULTIMODAL_L7 = {
en: `<p class="l-text"><strong>Generation is the half of multimodal AI that ships viral demos and lawsuits.</strong> While VLMs were quietly perfecting visual chat, generative models — DALL-E 2 (Apr 2022), Stable Diffusion (Aug 2022), DALL-E 3 (Oct 2023), Imagen 2/3 (Google), Midjourney v5/v6/v7, Sora (Feb 2024), Veo 2 (Dec 2024), Suno, Udio, MusicGen — were rewriting how images, video, music, and speech get made. By 2026 the combined market for generative-multimodal tools reached tens of billions of dollars, multiple frontier labs were sued by Getty, the New York Times, and major record labels, and producing a 60-second high-fidelity ad-quality clip from a paragraph of text was a one-API-call operation.</p>

<p class="l-text">In this lesson we cover the four generative-multimodal pillars: <strong>text-to-image</strong> (DALL-E 3, Imagen 3, SD 3, FLUX, Midjourney v7), <strong>text-to-video</strong> (Sora, Veo 2, Kling, CogVideoX), <strong>text-to-music</strong> (Suno v3/v4, Udio, MusicGen, AudioCraft), and <strong>text-to-speech</strong> (ElevenLabs, OpenAI TTS, Bark, XTTS, VALL-E 2). We unify them under one architecture vocabulary — diffusion models, flow matching, autoregressive next-token-on-codec, latent diffusion — and walk a toy denoising loop in numpy that captures the core idea every modern image/video generator runs at scale.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish diffusion, flow matching, and autoregressive token generation as multimodal generation paradigms</li>
<li>Reconstruct the latent diffusion architecture (VAE + UNet/DiT + text encoder)</li>
<li>Walk DALL-E 3, Imagen 3, SD 3, FLUX, Midjourney v7 — what each got right</li>
<li>Understand Sora and Veo 2's spacetime patch + diffusion transformer recipe</li>
<li>Compare music generation: Suno (closed), Udio (closed), MusicGen / AudioCraft (open)</li>
<li>Identify TTS state-of-the-art: zero-shot voice clone, expressive prosody, multilingual</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Three Paradigms of Multimodal Generation</h2>
<p class="l-text">Almost every 2024–2026 generator falls into one of three architectural families. Knowing which family yours is in tells you the cost structure, sampling speed, and edit-controllability you can expect.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Diffusion</div><div class="card-body">Train a network to denoise progressively. Sampling: start from Gaussian noise, iterate ~20–50 times. Outputs in pixel or latent space. Used by Stable Diffusion, Imagen, DALL-E 2/3, Sora, Veo. Best image quality.</div></div>
<div class="calc-card"><div class="card-title">Flow matching / rectified flow</div><div class="card-body">Same probability-flow idea as diffusion but trained to predict a velocity field. Straighter trajectories → fewer steps (4–10). Used by SD 3, FLUX, Stable Audio Open. Faster than classic diffusion.</div></div>
<div class="calc-card"><div class="card-title">Autoregressive on codec tokens</div><div class="card-body">Tokenize the modality (VAE → codes), train a transformer LM to predict next code. Used by Parti, MusicGen, AudioGen, AudioLM, VALL-E for speech, and historically DALL-E 1. Slower than diffusion at high resolution but conceptually simpler.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (2024 frontier)</div><div class="card-body">Many systems mix: tokenize with a VAE (autoencoder), then run diffusion in latent space (Latent Diffusion Models — Stable Diffusion's foundation). Or: AR over coarse tokens, diffusion over fine details (HumanEdit-2, recent music models).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Text-to-Image — From DALL-E to FLUX</h2>
<p class="l-text">A four-year arc moved text-to-image from "amusing artifact" to "ad agencies use it daily." Every major model is a variation on the same theme: text encoder → conditioning → diffusion / flow over latents → VAE decoder → pixels.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DALL-E 1 (Jan 2021)</div><div class="card-body">Autoregressive on dVAE tokens. 256×256, plenty of artifacts. The conceptual proof.</div></div>
<div class="calc-card"><div class="card-title">DALL-E 2 (Apr 2022)</div><div class="card-body">CLIP-conditioned diffusion + a "prior" mapping text to image embeddings. 1024×1024. Major prompt-following improvement.</div></div>
<div class="calc-card"><div class="card-title">Stable Diffusion (Aug 2022)</div><div class="card-body">Latent Diffusion Model (Rombach 2021). Open-source, sparked the explosion. SD 1.5 → SD 2 → SDXL (Jul 2023) → SD 3 (Feb 2024, MM-DiT + flow matching). Powers ~70% of open generative tooling.</div></div>
<div class="calc-card"><div class="card-title">Imagen / Imagen 3 (Google, May 2022 → Aug 2024)</div><div class="card-body">Pixel-space diffusion (no VAE) with cascaded super-resolution. T5-XXL text encoder for prompt understanding. Imagen 3 set a new SOTA on photorealism + prompt adherence.</div></div>
<div class="calc-card"><div class="card-title">DALL-E 3 (Oct 2023)</div><div class="card-body">Integrated with ChatGPT. Auto-rewrites user prompts into highly detailed captions before generation. Massive leap in following long, compositional prompts.</div></div>
<div class="calc-card"><div class="card-title">FLUX (Black Forest Labs, Aug 2024)</div><div class="card-body">From the original SD authors. 12B-param MM-DiT with rectified flow. FLUX.1 [pro] / [dev] / [schnell] tiers. Best open weights in 2024 for prompt fidelity and aesthetic quality.</div></div>
<div class="calc-card"><div class="card-title">Midjourney v6/v7 (2024)</div><div class="card-body">Closed-source. Cult following for aesthetic defaults. v6 nailed compositionality; v7 (2025) added native image-prompting and parameter-free aspect.</div></div>
</div>

<div class="katex-block">$$L_{\\text{diffusion}} = \\mathbb{E}_{x_0,\\,t,\\,\\epsilon}\\left[\\;\\|\\,\\epsilon - \\epsilon_\\theta(x_t,\\,t,\\,c)\\,\\|^2\\;\\right], \\quad x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$$</div>

<p class="l-text">The diffusion training objective: corrupt a clean sample x_0 with noise ε at random timestep t, then train the network ε_θ(x_t, t, c) to predict that noise given the corrupted sample, the timestep, and the conditioning c (text embedding). Sampling reverses: start at pure noise, subtract predicted noise step by step.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hands-On — A Toy Diffusion Denoiser</h2>
<p class="l-text">Real diffusion needs a UNet, a text encoder, and a GPU. The structural skeleton — corrupted-input → predicted-clean-output, iterated — fits in numpy. We treat the preloaded <code>img</code> as the "clean target", add noise at multiple levels, and watch progressive denoising recover it.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — real diffusion)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Real text-to-image with diffusers — Pyodide-blocked</span>
<span class="kw">from</span> diffusers <span class="kw">import</span> StableDiffusion3Pipeline
<span class="kw">import</span> torch

pipe = StableDiffusion3Pipeline.<span class="fn">from_pretrained</span>(
    <span class="str">"stabilityai/stable-diffusion-3-medium-diffusers"</span>,
    torch_dtype=torch.float16
).<span class="fn">to</span>(<span class="str">"cuda"</span>)
img = <span class="fn">pipe</span>(
    prompt=<span class="str">"A photorealistic red mug on a marble countertop, morning light"</span>,
    num_inference_steps=<span class="num">28</span>,
    guidance_scale=<span class="num">7.0</span>,
).images[<span class="num">0</span>]
img.<span class="fn">save</span>(<span class="str">"output.png"</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy denoising loop. We do not have a learned denoiser, so we use a fixed Gaussian smoother as the "denoiser" and watch how progressive partial-denoising over T steps recovers structure from noise. Same control flow as DDIM sampling.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.ndimage <span class="kw">import</span> gaussian_filter

<span class="cm"># Use the preloaded 64x64x3 img as our "clean target"</span>
clean = img.<span class="fn">copy</span>()  <span class="cm"># img is preloaded by the Pyodide preamble</span>

T = <span class="num">30</span>
betas = np.<span class="fn">linspace</span>(<span class="num">0.0001</span>, <span class="num">0.05</span>, T)
alphas = <span class="num">1.0</span> - betas
alpha_bar = np.<span class="fn">cumprod</span>(alphas)

<span class="kw">def</span> <span class="fn">add_noise</span>(x, t):
    eps = np.random.<span class="fn">randn</span>(*x.shape)
    <span class="kw">return</span> np.<span class="fn">sqrt</span>(alpha_bar[t]) * x + np.<span class="fn">sqrt</span>(<span class="num">1</span> - alpha_bar[t]) * eps

<span class="kw">def</span> <span class="fn">toy_denoiser</span>(x, t, sigma_per_step=<span class="num">1.5</span>):
    <span class="str">"""Stand-in for ε_θ. Predicts noise as the high-frequency residual."""</span>
    smoothed = np.<span class="fn">stack</span>([<span class="fn">gaussian_filter</span>(x[...,c], sigma=sigma_per_step)
                         <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>)], axis=-<span class="num">1</span>)
    <span class="kw">return</span> x - smoothed   <span class="cm"># treat residual as predicted noise</span>

<span class="cm"># Forward: corrupt to t = T-1</span>
xt = <span class="fn">add_noise</span>(clean, T - <span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">"Initial noise level vs clean MSE: {np.mean((xt - clean)**2):.4f}"</span>)

<span class="cm"># Reverse loop — DDPM-style sampling</span>
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T - <span class="num">1</span>, <span class="num">0</span>, -<span class="num">1</span>):
    eps_pred = <span class="fn">toy_denoiser</span>(xt, t)
    x0_hat = (xt - np.<span class="fn">sqrt</span>(<span class="num">1</span> - alpha_bar[t]) * eps_pred) / np.<span class="fn">sqrt</span>(alpha_bar[t])
    <span class="kw">if</span> t > <span class="num">1</span>:
        xt = (np.<span class="fn">sqrt</span>(alpha_bar[t-<span class="num">1</span>]) * x0_hat
              + np.<span class="fn">sqrt</span>(<span class="num">1</span> - alpha_bar[t-<span class="num">1</span>]) * np.random.<span class="fn">randn</span>(*xt.shape) * <span class="num">0.3</span>)
    <span class="kw">else</span>:
        xt = x0_hat
    <span class="kw">if</span> t % <span class="num">5</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">"  step {t:2d}  MSE-to-clean = {np.mean((xt - clean)**2):.4f}"</span>)

<span class="fn">print</span>(f<span class="str">"Final MSE: {np.mean((xt - clean)**2):.4f}"</span>)
<span class="fn">print</span>(<span class="str">"In real diffusion the denoiser is a UNet trained to predict ε exactly;"</span>)
<span class="fn">print</span>(<span class="str">"the loop structure (corrupt -> predict -> partially uncorrupt) is identical."</span>)
</code></pre></div>
</div>

<p class="l-text">The structural pattern is unchanged from real diffusion: at each timestep, predict noise, undo a fraction of it, optionally re-noise slightly to maintain stochasticity. Real systems differ in (1) the predictor — a giant UNet or DiT — and (2) text conditioning: the noise predictor takes the text embedding as input via cross-attention.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Text-to-Video — Sora, Veo, and the Spacetime Patch</h2>
<p class="l-text">Sora (OpenAI, Feb 2024) was the moment text-to-video shifted from "wobbly 4-second clips" to "60-second cinematic shots." The recipe: (1) tokenize video into spacetime patches via a VAE, (2) train a diffusion transformer (DiT) over the patches, (3) condition on text via cross-attention, (4) re-caption user prompts with a strong VLM before sampling.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sora (OpenAI Feb 2024)</div><div class="card-body">DiT over learned spacetime patches. Up to 60s, 1080p, variable aspect. Sora Turbo (Dec 2024) shipped in ChatGPT Plus. Re-captioning subsystem rewrites short prompts into rich descriptions before generation.</div></div>
<div class="calc-card"><div class="card-title">Veo 2 (Google Dec 2024)</div><div class="card-body">Best physics fidelity at launch — fluids, cloth, crowd dynamics. 4K, up to 8s initially, expanded later. Strong on cinematography (camera moves, lighting).</div></div>
<div class="calc-card"><div class="card-title">Kling (Kuaishou, mid-2024)</div><div class="card-body">First serious open-product Sora competitor. 2-min generations, image-to-video. Cult following in CGI/VFX community.</div></div>
<div class="calc-card"><div class="card-title">Pika 2 / Runway Gen-3 / Luma Dream Machine</div><div class="card-body">Editing-focused. ControlNet-style conditioning, motion brushes, keyframing. Targeted at creative pros, not raw generation quality leaders.</div></div>
<div class="calc-card"><div class="card-title">Open-source — CogVideoX, Open-Sora, HunyuanVideo</div><div class="card-body">CogVideoX 5B (Tsinghua, Aug 2024) — best open weights in 2024 (6s @ 720p). HunyuanVideo (Tencent, Dec 2024) — 13B params, competitive with closed at smaller resolution.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Music and Audio Generation</h2>
<p class="l-text">Audio generation followed the codec-tokens-plus-LM recipe. EnCodec or DAC tokenizes audio at 50–75 tokens/sec; a transformer predicts next token autoregressively, conditioned on text or melody.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MusicLM (Google, Jan 2023)</div><div class="card-body">First strong text-to-music. Hierarchical: semantic tokens (w2v-BERT) → coarse audio tokens → fine audio tokens. Closed.</div></div>
<div class="calc-card"><div class="card-title">MusicGen (Meta, Jun 2023)</div><div class="card-body">Open-source, in AudioCraft. Single-stage transformer over EnCodec tokens. 32 kHz, up to 2 minutes. Apache-2.0. Still the open-source default.</div></div>
<div class="calc-card"><div class="card-title">Suno v3 / v3.5 / v4 (2023–2024)</div><div class="card-body">Closed-source product. Lyrics + style → 4-minute songs with vocals. v3 (Mar 2024) was the breakout — first AI song that "felt like a song." v4 (late 2024) cleaner mixes.</div></div>
<div class="calc-card"><div class="card-title">Udio (Apr 2024)</div><div class="card-body">Suno's main competitor. Founded by ex-DeepMind. Different aesthetic; finer prompt control. Both Suno and Udio sued by RIAA labels in mid-2024.</div></div>
<div class="calc-card"><div class="card-title">Stable Audio Open / 2.0 (Stability)</div><div class="card-body">Open-weights short-form audio (≤47s in v2). Diffusion in latent space. Good for sound effects, less for songs.</div></div>
<div class="calc-card"><div class="card-title">AudioGen / AudioCraft</div><div class="card-body">Meta's broader audio framework. AudioGen (Kreuk 2022) for sound effects from text ("dog barking and rain"). AudioCraft bundles MusicGen + AudioGen + EnCodec under one repo.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Text-to-Speech — From Robot Voice to Indistinguishable</h2>
<p class="l-text">TTS quality crossed the indistinguishability threshold (humans cannot reliably tell synthetic from real on short clips) around 2023. The 2024 frontier is zero-shot voice cloning from 3 seconds of reference audio plus expressive prosody control.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tacotron 2 + WaveNet (2017–2018)</div><div class="card-body">Old guard. Mel spectrogram prediction + neural vocoder. Robotic on arbitrary text, great on in-distribution.</div></div>
<div class="calc-card"><div class="card-title">VITS / FastSpeech 2</div><div class="card-body">Open-source 2020-era. End-to-end, single-speaker or limited multi-speaker. Powers many indie TTS apps.</div></div>
<div class="calc-card"><div class="card-title">VALL-E / VALL-E 2 (Microsoft 2023, 2024)</div><div class="card-body">Codec-language-model TTS. 3-second voice clone from any speaker. Codec tokens (EnCodec) predicted autoregressively conditioned on text + reference audio. VALL-E 2 reaches "human parity" on LibriSpeech-test.</div></div>
<div class="calc-card"><div class="card-title">XTTS v2 / Bark / StyleTTS 2 (open)</div><div class="card-body">Open-source voice cloning. XTTS v2 by Coqui (15 languages, 6-sec reference). StyleTTS 2 best diffusion-TTS quality in 2024 open-source.</div></div>
<div class="calc-card"><div class="card-title">ElevenLabs (closed)</div><div class="card-body">Industry leader in expressive TTS. Voice library, fine-tuning, multilingual, emotion control. The default for audiobooks, video voiceover, dubbing.</div></div>
<div class="calc-card"><div class="card-title">OpenAI TTS / Voice Engine</div><div class="card-body">Six built-in voices (alloy, echo, fable, onyx, nova, shimmer) at $15/1M characters. Voice Engine (limited preview, 2024) clones from 15s.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Evaluation, Safety, and Open Problems</h2>
<p class="l-text">Generative-multimodal evaluation is one of the messier subfields in AI. Three problem clusters dominate.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Quality metrics</div><div class="card-body"><strong>Image:</strong> FID (Fréchet Inception Distance), CLIP score, human preference (PartiPrompts, ImagenHub). <strong>Video:</strong> FVD, VBench, human eval. <strong>Music:</strong> FAD (Fréchet Audio Distance), MusicCaps human ratings. All have known flaws — FID rewards mode-coverage, CLIP score rewards prompt match, none capture aesthetic quality cleanly.</div></div>
<div class="calc-card"><div class="card-title">Safety</div><div class="card-body">Deepfakes (NCII, political), copyright (Getty v. Stability ongoing), biometric identity, voice cloning fraud. Watermarking (Stable Signature, SynthID for Imagen, OpenAI's audio watermarks) is partial defense. Provenance standards: C2PA.</div></div>
<div class="calc-card"><div class="card-title">Compositionality and edit fidelity</div><div class="card-body">"A red cube on a blue sphere" — many models still get color-binding wrong. Editing while preserving identity ("the same person but smiling") is hard. Active research areas: ControlNet, InstructPix2Pix, IP-Adapter, FLUX-Tools (2024).</div></div>
</div>

<div class="calc-highlight"><strong>Open problems in 2026:</strong> consistent characters across long videos (sora-level fidelity but remembering faces from minute 1 to minute 10); physics-correct fluids and crowds; controllable camera and lighting beyond text prompts; multilingual prompt understanding for non-English creative use; copyright-clean datasets at frontier scale.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Multimodal generation is dominated by three recipes — diffusion, flow matching, and codec-token autoregression — applied to images, video, music, and speech. Frontier closed models (DALL-E 3, Imagen 3, Sora, Veo 2, Suno v4) routinely produce work indistinguishable from human creators. Open-source (Stable Diffusion 3, FLUX, CogVideoX, MusicGen, XTTS) trails closely and dominates anything cost-sensitive or fine-tunable.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Three paradigms: diffusion (best image quality), flow matching (faster), AR-on-codec (music, speech).</li>
<li>Latent Diffusion (SD) was the disruptive open-source moment; FLUX (2024) is the new open SOTA.</li>
<li>Sora and Veo 2 use spacetime-patch DiT — same tokenization video understanding uses.</li>
<li>Music: MusicGen open, Suno/Udio closed. TTS: VALL-E 2 / ElevenLabs / XTTS for zero-shot voice clone.</li>
<li>Evaluation is messy: FID/CLIP/FVD all incomplete; human preference still ground truth.</li>
<li>Safety stack: watermarking (SynthID, Stable Signature), provenance (C2PA), legal frameworks emerging.</li>
</ul>
</div>

<p class="l-text">In <strong>multimodal-L8</strong>, the capstone, we assemble everything: a multimodal NLP assistant that takes image + audio + document + text inputs, runs CLIP retrieval, VLM reasoning, ASR, and OCR-free document parsing, produces structured output, runs an evaluation harness, and discusses the deployment story.</p>
</div>`,
tr: `<p class="l-text"><strong>Üretim, viral demolar ve davalar gönderen multimodal yapay zekanın yarısıdır.</strong> VLM'ler sessizce görsel sohbeti mükemmelleştirirken, üretken modeller — DALL-E 2 (Nis 2022), Stable Diffusion (Ağu 2022), DALL-E 3 (Eki 2023), Imagen 2/3 (Google), Midjourney v5/v6/v7, Sora (Şub 2024), Veo 2 (Ara 2024), Suno, Udio, MusicGen — görüntülerin, videoların, müziğin ve konuşmanın nasıl yapıldığını yeniden yazıyordu. 2026'ya kadar üretken-multimodal araçlar için birleşik pazar onlarca milyar dolara ulaştı, birden fazla öncü laboratuvar Getty, New York Times ve büyük plak şirketleri tarafından dava edildi ve bir paragraf metinden 60 saniyelik yüksek doğruluklu reklam-kalitesinde bir klip üretmek tek bir API çağrısı işlemiydi.</p>

<p class="l-text">Bu derste dört üretken-multimodal sütunu işliyoruz: <strong>metinden görüntüye</strong> (DALL-E 3, Imagen 3, SD 3, FLUX, Midjourney v7), <strong>metinden videoya</strong> (Sora, Veo 2, Kling, CogVideoX), <strong>metinden müziğe</strong> (Suno v3/v4, Udio, MusicGen, AudioCraft) ve <strong>metinden konuşmaya</strong> (ElevenLabs, OpenAI TTS, Bark, XTTS, VALL-E 2). Onları tek bir mimari kelime dağarcığında birleştiriyoruz — difüzyon modelleri, akış eşleştirme, kodek üzerinde özyineli sonraki-token, gizli difüzyon — ve numpy'da, her modern görüntü/video üreticisinin ölçekte çalıştırdığı temel fikri yakalayan oyuncak bir gürültü-arındırma döngüsü yürütüyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Difüzyon, akış eşleştirme ve özyineli token üretimini multimodal üretim paradigmaları olarak ayırt etmek</li>
<li>Gizli difüzyon mimarisini yeniden inşa etmek (VAE + UNet/DiT + metin kodlayıcı)</li>
<li>DALL-E 3, Imagen 3, SD 3, FLUX, Midjourney v7'yi yürümek — her birinin neyi doğru yaptığı</li>
<li>Sora ve Veo 2'nin uzay-zaman yaması + difüzyon transformer tarifini anlamak</li>
<li>Müzik üretimini karşılaştırmak: Suno (kapalı), Udio (kapalı), MusicGen / AudioCraft (açık)</li>
<li>TTS son teknolojiyi tanımak: zero-shot ses klonlama, ifadeli prozodi, çok dilli</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Multimodal Üretimin Üç Paradigması</h2>
<p class="l-text">Hemen hemen her 2024–2026 üreticisi üç mimari aileden birine düşer. Sizinkinin hangi ailede olduğunu bilmek size beklemeniz gereken maliyet yapısını, örnekleme hızını ve düzenleme-kontrol edilebilirliğini söyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Difüzyon</div><div class="card-body">Aşamalı olarak gürültü-arındırmak için bir ağ eğit. Örnekleme: Gauss gürültüsünden başla, ~20–50 kez yinele. Çıktılar piksel veya gizli uzayda. Stable Diffusion, Imagen, DALL-E 2/3, Sora, Veo tarafından kullanılır. En iyi görüntü kalitesi.</div></div>
<div class="calc-card"><div class="card-title">Akış eşleştirme / düzeltilmiş akış</div><div class="card-body">Difüzyonla aynı olasılık-akış fikri ama bir hız alanını öngörmek için eğitildi. Daha düz yörüngeler → daha az adım (4–10). SD 3, FLUX, Stable Audio Open tarafından kullanılır. Klasik difüzyondan daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Kodek token'larında özyineli</div><div class="card-body">Modaliteyi tokenleştir (VAE → kodlar), bir transformer LM'sini sonraki kodu öngörmek için eğit. Parti, MusicGen, AudioGen, AudioLM, konuşma için VALL-E ve tarihsel olarak DALL-E 1 tarafından kullanılır. Yüksek çözünürlükte difüzyondan yavaş ama kavramsal olarak daha basit.</div></div>
<div class="calc-card"><div class="card-title">Hibrit (2024 öncüsü)</div><div class="card-body">Birçok sistem karıştırır: bir VAE (autoencoder) ile tokenleştir, sonra gizli uzayda difüzyon çalıştır (Latent Diffusion Modelleri — Stable Diffusion'ın temeli). Veya: kaba token'lar üzerinde AR, ince detaylar üzerinde difüzyon (HumanEdit-2, son müzik modelleri).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Metinden Görüntüye — DALL-E'den FLUX'a</h2>
<p class="l-text">Dört yıllık bir yay metinden görüntüyü "eğlenceli eser"den "reklam ajansları günlük kullanır"a taşıdı. Her büyük model aynı temanın bir varyasyonudur: metin kodlayıcı → koşullandırma → gizliler üzerinde difüzyon / akış → VAE kod çözücü → pikseller.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DALL-E 1 (Oca 2021)</div><div class="card-body">dVAE token'larında özyineli. 256×256, bol yapay nesneli. Kavramsal kanıt.</div></div>
<div class="calc-card"><div class="card-title">DALL-E 2 (Nis 2022)</div><div class="card-body">CLIP-koşullandırılmış difüzyon + metni görüntü gömmelerine eşleştiren bir "prior". 1024×1024. Büyük prompt-takip iyileştirmesi.</div></div>
<div class="calc-card"><div class="card-title">Stable Diffusion (Ağu 2022)</div><div class="card-body">Latent Diffusion Modeli (Rombach 2021). Açık kaynak, patlamayı tetikledi. SD 1.5 → SD 2 → SDXL (Tem 2023) → SD 3 (Şub 2024, MM-DiT + akış eşleştirme). Açık üretken araçların ~%70'ini güçlendirir.</div></div>
<div class="calc-card"><div class="card-title">Imagen / Imagen 3 (Google, May 2022 → Ağu 2024)</div><div class="card-body">Kademeli süper-çözünürlüklü piksel-uzay difüzyonu (VAE yok). Prompt anlama için T5-XXL metin kodlayıcısı. Imagen 3 fotorealizm + prompt uyumluluğunda yeni bir SOTA belirledi.</div></div>
<div class="calc-card"><div class="card-title">DALL-E 3 (Eki 2023)</div><div class="card-body">ChatGPT ile entegre. Üretmeden önce kullanıcı promptlarını otomatik olarak son derece ayrıntılı açıklamalara yeniden yazar. Uzun, kompozisyonel promptları izlemekte büyük sıçrama.</div></div>
<div class="calc-card"><div class="card-title">FLUX (Black Forest Labs, Ağu 2024)</div><div class="card-body">Orijinal SD yazarlarından. Düzeltilmiş akışla 12B parametreli MM-DiT. FLUX.1 [pro] / [dev] / [schnell] kademeleri. Prompt sadakati ve estetik kalite için 2024'te en iyi açık ağırlıklar.</div></div>
<div class="calc-card"><div class="card-title">Midjourney v6/v7 (2024)</div><div class="card-body">Kapalı kaynak. Estetik varsayılanları için kült takipçileri. v6 kompozisyonelliği yakaladı; v7 (2025) yerel görüntü-promptlama ve parametresiz en-boy ekledi.</div></div>
</div>

<div class="katex-block">$$L_{\\text{diffusion}} = \\mathbb{E}_{x_0,\\,t,\\,\\epsilon}\\left[\\;\\|\\,\\epsilon - \\epsilon_\\theta(x_t,\\,t,\\,c)\\,\\|^2\\;\\right], \\quad x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$$</div>

<p class="l-text">Difüzyon eğitim hedefi: temiz bir örneği x_0 rastgele zaman adımı t'de gürültü ε ile boz, sonra ağ ε_θ(x_t, t, c)'yi bozulmuş örnek, zaman adımı ve koşullandırma c (metin gömmesi) verildiğinde o gürültüyü öngörmesi için eğit. Örnekleme tersine çevirir: saf gürültüde başla, öngörülen gürültüyü adım adım çıkar.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Uygulama — Oyuncak Difüzyon Gürültü-Arındırıcı</h2>
<p class="l-text">Gerçek difüzyon bir UNet, bir metin kodlayıcı ve bir GPU gerektirir. Yapısal iskelet — bozulmuş-girdi → öngörülen-temiz-çıktı, yinelendi — numpy'a sığar. Önceden yüklenmiş <code>img</code>'ı "temiz hedef" olarak ele alıyoruz, birden çok seviyede gürültü ekliyoruz ve aşamalı gürültü-arındırmanın onu nasıl kurtardığını izliyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — gerçek difüzyon)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Diffusers ile gercek metinden goruntuye — Pyodide tarafindan engellendi</span>
<span class="kw">from</span> diffusers <span class="kw">import</span> StableDiffusion3Pipeline
<span class="kw">import</span> torch

pipe = StableDiffusion3Pipeline.<span class="fn">from_pretrained</span>(
    <span class="str">"stabilityai/stable-diffusion-3-medium-diffusers"</span>,
    torch_dtype=torch.float16
).<span class="fn">to</span>(<span class="str">"cuda"</span>)
img = <span class="fn">pipe</span>(
    prompt=<span class="str">"A photorealistic red mug on a marble countertop, morning light"</span>,
    num_inference_steps=<span class="num">28</span>,
    guidance_scale=<span class="num">7.0</span>,
).images[<span class="num">0</span>]
img.<span class="fn">save</span>(<span class="str">"output.png"</span>)
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak bir gürültü-arındırma döngüsü. Öğrenilmiş bir gürültü-arındırıcımız yok, bu yüzden "gürültü-arındırıcı" olarak sabit bir Gauss düzleştirici kullanıyoruz ve T adım üzerinde aşamalı kısmi gürültü-arındırmanın gürültüden yapıyı nasıl kurtardığını izliyoruz. DDIM örneklemesiyle aynı kontrol akışı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.ndimage <span class="kw">import</span> gaussian_filter

<span class="cm"># Onceden yuklenmis 64x64x3 img'yi "temiz hedef" olarak kullan</span>
clean = img.<span class="fn">copy</span>()  <span class="cm"># img Pyodide preamble tarafindan onceden yuklenir</span>

T = <span class="num">30</span>
betas = np.<span class="fn">linspace</span>(<span class="num">0.0001</span>, <span class="num">0.05</span>, T)
alphas = <span class="num">1.0</span> - betas
alpha_bar = np.<span class="fn">cumprod</span>(alphas)

<span class="kw">def</span> <span class="fn">add_noise</span>(x, t):
    eps = np.random.<span class="fn">randn</span>(*x.shape)
    <span class="kw">return</span> np.<span class="fn">sqrt</span>(alpha_bar[t]) * x + np.<span class="fn">sqrt</span>(<span class="num">1</span> - alpha_bar[t]) * eps

<span class="kw">def</span> <span class="fn">toy_denoiser</span>(x, t, sigma_per_step=<span class="num">1.5</span>):
    <span class="str">"""ε_θ icin yer tutucu. Gurultuyu yuksek-frekans kalintisi olarak ongorur."""</span>
    smoothed = np.<span class="fn">stack</span>([<span class="fn">gaussian_filter</span>(x[...,c], sigma=sigma_per_step)
                         <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>)], axis=-<span class="num">1</span>)
    <span class="kw">return</span> x - smoothed   <span class="cm"># kalintiyi ongorulen gurultu olarak ele al</span>

<span class="cm"># Ileri: t = T-1'e bozulma</span>
xt = <span class="fn">add_noise</span>(clean, T - <span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">"Baslangic gurultu seviyesi vs temiz MSE: {np.mean((xt - clean)**2):.4f}"</span>)

<span class="cm"># Geri donguyu — DDPM-tarzi ornekleme</span>
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T - <span class="num">1</span>, <span class="num">0</span>, -<span class="num">1</span>):
    eps_pred = <span class="fn">toy_denoiser</span>(xt, t)
    x0_hat = (xt - np.<span class="fn">sqrt</span>(<span class="num">1</span> - alpha_bar[t]) * eps_pred) / np.<span class="fn">sqrt</span>(alpha_bar[t])
    <span class="kw">if</span> t > <span class="num">1</span>:
        xt = (np.<span class="fn">sqrt</span>(alpha_bar[t-<span class="num">1</span>]) * x0_hat
              + np.<span class="fn">sqrt</span>(<span class="num">1</span> - alpha_bar[t-<span class="num">1</span>]) * np.random.<span class="fn">randn</span>(*xt.shape) * <span class="num">0.3</span>)
    <span class="kw">else</span>:
        xt = x0_hat
    <span class="kw">if</span> t % <span class="num">5</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">"  adim {t:2d}  MSE-temize = {np.mean((xt - clean)**2):.4f}"</span>)

<span class="fn">print</span>(f<span class="str">"Son MSE: {np.mean((xt - clean)**2):.4f}"</span>)
<span class="fn">print</span>(<span class="str">"Gercek difuzyonda gurultu-arindirici tam olarak ε ongormek icin egitilen dev bir UNet'tir;"</span>)
<span class="fn">print</span>(<span class="str">"dongu yapisi (boz -> ongor -> kismen geri al) aynidir."</span>)
</code></pre></div>
</div>

<p class="l-text">Yapısal desen gerçek difüzyondan değişmemiş: her zaman adımında, gürültüyü öngör, bir kısmını geri al, isteğe bağlı olarak stokastikliği korumak için biraz yeniden gürültü ekle. Gerçek sistemler şunlarda farklılık gösterir: (1) öngörücü — dev bir UNet veya DiT — ve (2) metin koşullandırma: gürültü öngörücüsü metin gömmesini çapraz-dikkat aracılığıyla girdi olarak alır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Metinden Videoya — Sora, Veo ve Uzay-Zaman Yaması</h2>
<p class="l-text">Sora (OpenAI, Şub 2024) metinden videonun "sallantılı 4 saniyelik klipler"den "60 saniyelik sinematik çekimler"e geçtiği andı. Tarif: (1) bir VAE aracılığıyla videoyu uzay-zaman yamalarına tokenleştir, (2) yamalar üzerinde bir difüzyon transformer (DiT) eğit, (3) çapraz-dikkat aracılığıyla metne koşullandır, (4) örnekleme öncesi güçlü bir VLM ile kullanıcı promptlarını yeniden açıkla.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sora (OpenAI Şub 2024)</div><div class="card-body">Öğrenilmiş uzay-zaman yamaları üzerinde DiT. 60s'e kadar, 1080p, değişken en-boy. Sora Turbo (Ara 2024) ChatGPT Plus'ta dağıtıldı. Yeniden-açıklama alt sistemi üretmeden önce kısa promptları zengin tanımlara yeniden yazar.</div></div>
<div class="calc-card"><div class="card-title">Veo 2 (Google Ara 2024)</div><div class="card-body">Lansmanda en iyi fizik doğruluğu — akışkanlar, kumaş, kalabalık dinamikleri. 4K, başlangıçta 8s'e kadar, daha sonra genişletildi. Sinematografide güçlü (kamera hareketleri, ışıklandırma).</div></div>
<div class="calc-card"><div class="card-title">Kling (Kuaishou, 2024 ortası)</div><div class="card-body">İlk ciddi açık-ürün Sora rakibi. 2 dakikalık üretimler, görüntüden videoya. CGI/VFX topluluğunda kült takipçileri.</div></div>
<div class="calc-card"><div class="card-title">Pika 2 / Runway Gen-3 / Luma Dream Machine</div><div class="card-body">Düzenleme odaklı. ControlNet-tarzı koşullandırma, hareket fırçaları, anahtar kareleme. Yaratıcı profesyoneller için hedeflenmiş, ham üretim kalitesi liderleri değil.</div></div>
<div class="calc-card"><div class="card-title">Açık kaynak — CogVideoX, Open-Sora, HunyuanVideo</div><div class="card-body">CogVideoX 5B (Tsinghua, Ağu 2024) — 2024'te en iyi açık ağırlıklar (720p'de 6s). HunyuanVideo (Tencent, Ara 2024) — 13B parametre, daha küçük çözünürlükte kapalıyla rekabetçi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Müzik ve Ses Üretimi</h2>
<p class="l-text">Ses üretimi kodek-token'lar-artı-LM tarifini izledi. EnCodec veya DAC sesi 50–75 token/sn'de tokenleştirir; bir transformer metin veya melodiye koşullu olarak özyineli sonraki token'ı öngörür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MusicLM (Google, Oca 2023)</div><div class="card-body">İlk güçlü metinden müziğe. Hiyerarşik: anlamsal token'lar (w2v-BERT) → kaba ses token'ları → ince ses token'ları. Kapalı.</div></div>
<div class="calc-card"><div class="card-title">MusicGen (Meta, Haz 2023)</div><div class="card-body">Açık kaynak, AudioCraft içinde. EnCodec token'ları üzerinde tek aşamalı transformer. 32 kHz, 2 dakikaya kadar. Apache-2.0. Hala açık kaynak varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">Suno v3 / v3.5 / v4 (2023–2024)</div><div class="card-body">Kapalı kaynak ürün. Şarkı sözleri + stil → vokalli 4 dakikalık şarkılar. v3 (Mar 2024) atılım oldu — "şarkı gibi hissettiren" ilk YZ şarkısı. v4 (2024 sonu) daha temiz miksler.</div></div>
<div class="calc-card"><div class="card-title">Udio (Nis 2024)</div><div class="card-body">Suno'nun ana rakibi. Eski-DeepMind tarafından kuruldu. Farklı estetik; daha ince prompt kontrolü. Hem Suno hem Udio 2024 ortasında RIAA etiketleri tarafından dava edildi.</div></div>
<div class="calc-card"><div class="card-title">Stable Audio Open / 2.0 (Stability)</div><div class="card-body">Açık-ağırlık kısa-form ses (v2'de ≤47s). Gizli uzayda difüzyon. Ses efektleri için iyi, şarkılar için daha az.</div></div>
<div class="calc-card"><div class="card-title">AudioGen / AudioCraft</div><div class="card-body">Meta'nın daha geniş ses çerçevesi. Metinden ses efektleri için AudioGen (Kreuk 2022) ("dog barking and rain"). AudioCraft, MusicGen + AudioGen + EnCodec'i tek bir depo altında toplar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Metinden Konuşmaya — Robot Sesinden Ayırt Edilmeze</h2>
<p class="l-text">TTS kalitesi 2023 civarında ayırt edilemezlik eşiğini geçti (insanlar kısa kliplerde sentetik olanı gerçekten güvenilir biçimde ayırt edemez). 2024 öncüsü, 3 saniyelik referans sestan zero-shot ses klonlama artı ifadeli prozodi kontrolüdür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tacotron 2 + WaveNet (2017–2018)</div><div class="card-body">Eski muhafız. Mel spektrogram öngörüsü + sinirsel vokoder. Keyfi metinde robotik, dağılım-içinde harika.</div></div>
<div class="calc-card"><div class="card-title">VITS / FastSpeech 2</div><div class="card-body">Açık kaynak 2020 dönemi. Uçtan uca, tek konuşmacı veya sınırlı çoklu konuşmacı. Birçok bağımsız TTS uygulamasını güçlendirir.</div></div>
<div class="calc-card"><div class="card-title">VALL-E / VALL-E 2 (Microsoft 2023, 2024)</div><div class="card-body">Kodek-dil-modeli TTS. Herhangi bir konuşmacıdan 3 saniyelik ses klonu. Metin + referans sese koşullu özyineli olarak öngörülen kodek token'ları (EnCodec). VALL-E 2 LibriSpeech-test'te "insan paritesine" ulaşır.</div></div>
<div class="calc-card"><div class="card-title">XTTS v2 / Bark / StyleTTS 2 (açık)</div><div class="card-body">Açık kaynak ses klonlama. Coqui'nin XTTS v2'si (15 dil, 6-saniye referans). 2024 açık kaynakta en iyi difüzyon-TTS kalitesi StyleTTS 2.</div></div>
<div class="calc-card"><div class="card-title">ElevenLabs (kapalı)</div><div class="card-body">İfadeli TTS'de endüstri lideri. Ses kütüphanesi, ince ayar, çok dilli, duygu kontrolü. Sesli kitaplar, video seslendirme, dublaj için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">OpenAI TTS / Voice Engine</div><div class="card-body">$15/1M karakter'da altı yerleşik ses (alloy, echo, fable, onyx, nova, shimmer). Voice Engine (sınırlı önizleme, 2024) 15s'den klonlar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Değerlendirme, Güvenlik ve Açık Problemler</h2>
<p class="l-text">Üretken-multimodal değerlendirme YZ'deki en dağınık alt alanlardan biridir. Üç problem kümesi baskındır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kalite metrikleri</div><div class="card-body"><strong>Görüntü:</strong> FID (Fréchet Inception Distance), CLIP skoru, insan tercihi (PartiPrompts, ImagenHub). <strong>Video:</strong> FVD, VBench, insan değerlendirme. <strong>Müzik:</strong> FAD (Fréchet Audio Distance), MusicCaps insan değerlendirmeleri. Tümünün bilinen kusurları var — FID mod-kapsamayı ödüllendirir, CLIP skoru prompt eşleşmesini ödüllendirir, hiçbiri estetik kaliteyi temiz biçimde yakalamaz.</div></div>
<div class="calc-card"><div class="card-title">Güvenlik</div><div class="card-body">Deepfake'ler (NCII, politik), telif hakkı (Getty v. Stability devam ediyor), biyometrik kimlik, ses klonlama dolandırıcılığı. Filigranlama (Stable Signature, Imagen için SynthID, OpenAI'nin ses filigranları) kısmi savunmadır. Köken standartları: C2PA.</div></div>
<div class="calc-card"><div class="card-title">Kompozisyonellik ve düzenleme sadakati</div><div class="card-body">"A red cube on a blue sphere" — birçok model hala renk-bağlamayı yanlış yapar. Kimliği koruyarak düzenleme ("aynı kişi ama gülümseyen") zordur. Aktif araştırma alanları: ControlNet, InstructPix2Pix, IP-Adapter, FLUX-Tools (2024).</div></div>
</div>

<div class="calc-highlight"><strong>2026'da açık problemler:</strong> uzun videolarda tutarlı karakterler (sora-seviye sadakat ama 1. dakikadan 10. dakikaya kadar yüzleri hatırlama); fizik-doğru akışkanlar ve kalabalıklar; metin promptlarının ötesinde kontrol edilebilir kamera ve ışıklandırma; İngilizce olmayan yaratıcı kullanım için çok dilli prompt anlama; öncü ölçekte telif-temiz veri kümeleri.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sonraki</h2>
<p class="l-text">Multimodal üretim üç tarif tarafından baskındır — görüntülere, videolara, müziğe ve konuşmaya uygulanan difüzyon, akış eşleştirme ve kodek-token özyinelisi. Öncü kapalı modeller (DALL-E 3, Imagen 3, Sora, Veo 2, Suno v4) rutin olarak insan yaratıcılarından ayırt edilemeyen iş üretir. Açık kaynak (Stable Diffusion 3, FLUX, CogVideoX, MusicGen, XTTS) yakından izler ve maliyet-duyarlı veya ince-ayarlanabilir her şeyde baskındır.</p>

<div class="calc-highlight"><strong>Önemli çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Üç paradigma: difüzyon (en iyi görüntü kalitesi), akış eşleştirme (daha hızlı), kodek üzerinde AR (müzik, konuşma).</li>
<li>Latent Diffusion (SD) yıkıcı açık kaynak anıydı; FLUX (2024) yeni açık SOTA'dır.</li>
<li>Sora ve Veo 2 uzay-zaman-yamalı DiT kullanır — video anlama ile aynı tokenleştirme.</li>
<li>Müzik: MusicGen açık, Suno/Udio kapalı. TTS: zero-shot ses klonu için VALL-E 2 / ElevenLabs / XTTS.</li>
<li>Değerlendirme dağınık: FID/CLIP/FVD hepsi eksik; insan tercihi hala yer gerçeği.</li>
<li>Güvenlik yığını: filigranlama (SynthID, Stable Signature), köken (C2PA), ortaya çıkan yasal çerçeveler.</li>
</ul>
</div>

<p class="l-text"><strong>multimodal-L8</strong>'de, capstone'da, her şeyi monte ediyoruz: görüntü + ses + belge + metin girdileri alan, CLIP erişimi, VLM akıl yürütme, ASR ve OCR-bağımsız belge ayrıştırma çalıştıran, yapılandırılmış çıktı üreten, bir değerlendirme koşumu çalıştıran ve dağıtım hikayesini tartışan bir multimodal NLP asistanı.</p>
</div>`
};
