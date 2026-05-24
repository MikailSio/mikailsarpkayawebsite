window.EDGE_L2 = {
en: `<p class="l-text"><strong>Quantization is the single most important compression technique in 2026 edge ML.</strong> Every on-device LLM you have ever used — Phi-3-mini in your phone, Llama 3.2 in Ollama, Whisper in MacWhisper, Stable Diffusion XL Turbo on M-series Macs — ships at INT4 or INT8, not FP16. The reason is brutally simple: a 7B model at FP16 is 14GB and will not fit in a phone, but at INT4 (Q4_K_M) it is 4GB and runs at 30 tokens/second. The trick is doing this without nuking accuracy, which is what the GPTQ, AWQ, and SmoothQuant papers fixed between 2022 and 2023.</p>

<p class="l-text">In this lesson we go from the basic per-tensor INT8 sketch in L1 to the full modern stack. We cover symmetric vs asymmetric, per-tensor vs per-channel vs per-group, post-training (PTQ) vs quantization-aware training (QAT), the three landmark papers (Frantar 2022 GPTQ, Lin 2023 AWQ, Xiao 2023 SmoothQuant) and what each fixes, the new FP8 path that NVIDIA Hopper unlocked, and the calibration-set pitfalls that make the difference between "ships in production" and "lobotomized model that hallucinates dates". We end with a NumPy implementation of GPTQ-style Hessian-aware rounding and a tiny AWQ surrogate so you can feel the math.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive symmetric and asymmetric INT8 quantization formulas and implement both in NumPy</li>
<li>Choose between per-tensor, per-channel, and per-group (block) quantization granularity</li>
<li>Distinguish PTQ from QAT and know when each is worth the engineering cost</li>
<li>Explain GPTQ's Hessian-aware rounding (Frantar 2022) at the equation level</li>
<li>Explain AWQ's salient-weight scaling (Lin 2023) and why it beats GPTQ on activation outliers</li>
<li>Use SmoothQuant (Xiao 2023) to migrate activation difficulty into weights for INT8 LLMs</li>
<li>Pick a calibration set that does not bake bias into the quantized model</li>
<li>Read an FP8 (E4M3, E5M2) tradeoff and decide between INT4 and FP8</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Symmetric vs Asymmetric, Per-Tensor vs Per-Channel</h2>
<p class="l-text">The starting point is one floating-point tensor <code>w</code> and a target integer range <code>[q_min, q_max]</code>, typically <code>[-128, 127]</code> for INT8. We need to map the floats to integers and back. There are two axes of choice: <em>symmetric</em> vs <em>asymmetric</em>, and <em>per-tensor</em> vs <em>per-channel</em> (or per-group).</p>

<div class="katex-block">$$\\text{symmetric:} \\quad q = \\text{round}(w / s), \\quad s = \\frac{\\max|w|}{127}$$</div>

<div class="katex-block">$$\\text{asymmetric:} \\quad q = \\text{round}(w / s) + z, \\quad s = \\frac{w_{\\max} - w_{\\min}}{255}, \\quad z = -\\text{round}(w_{\\min}/s) - 128$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetric</div><div class="card-body">No zero-point. Faster INT8 kernels (no offset). Wastes one bin if data is shifted (e.g., post-ReLU, all positive). Default for weights — symmetric around zero by training.</div></div>
<div class="calc-card"><div class="card-title">Asymmetric</div><div class="card-body">Has a zero-point <code>z</code>. Better for activations after ReLU/GeLU which are not symmetric. Costs an extra integer add in the kernel.</div></div>
<div class="calc-card"><div class="card-title">Per-tensor</div><div class="card-body">One scale per matrix. Cheapest. Sensitive to outliers — a single huge weight blows up the scale and crushes everything else.</div></div>
<div class="calc-card"><div class="card-title">Per-channel (per-row or per-column)</div><div class="card-body">One scale per output channel. Standard for conv and linear layers. ~Same cost, much better accuracy. Used in TFLite, ONNXRuntime defaults.</div></div>
<div class="calc-card"><div class="card-title">Per-group (block)</div><div class="card-body">One scale per N consecutive weights (typically 32, 64, 128). The basis of Q4_K_M in GGUF — group=32 means each block of 32 weights gets its own 4-bit scale. Best accuracy at low bit widths.</div></div>
</div>

<div class="calc-highlight"><strong>Production default in 2026:</strong> per-channel symmetric INT8 weights + per-tensor asymmetric INT8 activations for CNNs/Transformers, and per-group INT4 (group=32 or 64) for LLM weights with FP16 activations.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. PTQ vs QAT — Which One Should You Reach For?</h2>
<p class="l-text"><strong>Post-training quantization (PTQ)</strong> takes a finished FP32 model and quantizes it after the fact, optionally using a small calibration set to tune scales. <strong>Quantization-aware training (QAT)</strong> bakes simulated quantization into the training loop with straight-through estimators, so the model learns weights that are robust to rounding.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PTQ — fast, cheap, often enough</div><div class="card-body">Minutes to hours of compute on a calibration set of 128–1000 samples. Works well at INT8. Starts to break at INT4 unless you use GPTQ/AWQ. ~99% of LLM quantization in 2026 is PTQ because retraining a 7B+ model is too expensive.</div></div>
<div class="calc-card"><div class="card-title">QAT — slow, expensive, last resort</div><div class="card-body">Re-train (or fine-tune) the model with fake-quantize ops in the forward pass. Recovers accuracy at INT4 / INT2 / binary. Used in production CV (MobileNetV3 INT8 QAT for Pixel cameras) and for tiny CNNs on microcontrollers.</div></div>
</div>

<p class="l-text">A 2026 rule of thumb: try PTQ first. If accuracy drops more than 1–2% at INT8, try per-channel and a better calibration set. If still bad, switch to GPTQ/AWQ for INT4. Reach for QAT only when you absolutely must hit INT4 or below on a model where activations have huge outliers and PTQ tricks are not enough.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GPTQ — Hessian-Aware Rounding (Frantar 2022)</h2>
<p class="l-text">GPTQ (<em>Frantar, Ashkboos, Hoefler, Alistarh — "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers", 2022</em>) was the breakthrough that made INT4 LLMs ship in production. The insight: when you round a weight, you can compensate by adjusting the <em>not-yet-quantized</em> weights using second-order (Hessian) information, so the layer's output stays close to the original.</p>

<p class="l-text">Formally, for a linear layer with input <code>X</code> and weights <code>W</code>, the optimal quantization minimizes <code>||WX - QX||²</code>. Solving this layer-wise gives the OBQ (Optimal Brain Quantization) update, which uses the Hessian <code>H = 2 X X^T</code>. GPTQ's contribution is doing this at LLM scale efficiently — Cholesky-decomposed Hessian, processing weights in blocks, lazy updates.</p>

<div class="katex-block">$$w_q = \\arg\\min_{w_q \\in \\mathcal{Q}} (w - w_q)^2 / [H^{-1}]_{ii}, \\quad W \\leftarrow W - \\frac{(w - w_q)}{[H^{-1}]_{ii}} \\cdot H^{-1}_{i,:}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">7B–175B LLMs to INT4 with &lt;1% perplexity drop, in 2–4 GPU hours total for a 175B model. The first practical INT4 LLM compressor.</div></div>
<div class="calc-card"><div class="card-title">Calibration</div><div class="card-body">Just 128 examples (typically WikiText-2 or C4 chunks of 2048 tokens) suffice to estimate the Hessian per layer.</div></div>
<div class="calc-card"><div class="card-title">Tooling</div><div class="card-body">AutoGPTQ (Python lib), HuggingFace Optimum integration, Transformers <code>load_in_4bit=True, quantization_config=GPTQConfig</code>. Also baked into TheBloke's GPTQ model uploads on the Hub.</div></div>
<div class="calc-card"><div class="card-title">Limitation</div><div class="card-body">Sensitive to activation outliers (the same problem AWQ later targeted). On models with extreme outlier features (Llama-3 70B), GPTQ at INT4 lags AWQ by 1–2 perplexity points.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Real GPTQ usage (requires auto-gptq, not runnable in browser)
from transformers import AutoModelForCausalLM, AutoTokenizer
from transformers import GPTQConfig

quant_cfg = GPTQConfig(bits=4, dataset="c4", tokenizer=AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B"))
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B", quantization_config=quant_cfg, device_map="auto")
model.save_pretrained("./Llama-3.2-3B-GPTQ-INT4")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports the HuggingFace Transformers stack and the <code>GPTQConfig</code> helper — under the hood this calls AutoGPTQ. 2) Builds a config with <code>bits=4</code> and <code>dataset="c4"</code>: 128 default C4 samples will be tokenized and used as the calibration set to estimate per-layer Hessians. 3) <code>from_pretrained</code> with <code>quantization_config</code> loads Llama-3.2-3B in FP16, then runs GPTQ layer-by-layer — each linear's <code>H = 2 X X^T</code> is built, Cholesky-factored, and weights are quantized to INT4 with the OBQ compensation update. 4) <code>save_pretrained</code> writes the INT4 weights + per-group FP16 scales as a HuggingFace checkpoint (~2GB on disk, vs 6GB FP16). Runtime drops from ~16GB VRAM to ~4GB with under 1% perplexity hit on WikiText.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A simplified GPTQ on a single linear layer: round one weight at a time, compensate the remaining weights using the Hessian inverse. The <em>structure</em> is identical to the real algorithm — the real one just adds Cholesky and block processing for efficiency.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
np.random.seed(0)

# One linear layer: out = W @ x, with d_in = 64
d_in, d_out, n_calib = 64, 32, 256
W = np.random.randn(d_out, d_in).astype(np.float32) * 0.1
X = np.random.randn(d_in, n_calib).astype(np.float32)
Y_fp32 = W @ X

# Build Hessian H = 2 X X^T and invert (with damping for stability)
H = 2.0 * X @ X.T
H += 0.01 * np.trace(H)/d_in * np.eye(d_in)
Hinv = np.linalg.inv(H)

def quant_int4(w, scale):
    return np.clip(np.round(w/scale), -8, 7) * scale

# Simplified GPTQ: per-row, sequential
W_q = W.copy()
for r in range(d_out):
    w = W_q[r].copy()
    scale = np.max(np.abs(w)) / 7.0
    for i in range(d_in):
        q = quant_int4(w[i], scale)
        err = (w[i] - q) / Hinv[i,i]
        w[i] = q
        # compensate remaining weights
        if i+1 &lt; d_in:
            w[i+1:] -= err * Hinv[i, i+1:]
    W_q[r] = w

# Compare naive RTN (round-to-nearest) vs GPTQ
W_rtn = quant_int4(W, np.max(np.abs(W))/7.0)
err_rtn = np.mean((W_rtn @ X - Y_fp32)**2)
err_gptq = np.mean((W_q @ X - Y_fp32)**2)
print(f"RTN  output MSE: {err_rtn:.6f}")
print(f"GPTQ output MSE: {err_gptq:.6f}")
print(f"GPTQ is {err_rtn/err_gptq:.2f}x better")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a tiny linear layer (W: 32x64) and 256 calibration vectors so the Hessian is well-conditioned. 2) Forms <code>H = 2 X X^T</code> exactly as in Frantar 2022, then adds a damping term (1% of trace divided across the diagonal) — without this damping <code>np.linalg.inv</code> blows up on near-singular calibration data. 3) For each output row, walks the input dimensions left-to-right: quantizes one weight with <code>round(w/scale)</code> clipped to INT4's [-8, 7], measures the rounding error scaled by <code>1/H⁻¹[i,i]</code>, and propagates that error into all remaining (not-yet-quantized) weights via the i-th row of <code>H⁻¹</code> — that propagation is the entire GPTQ trick. 4) Compares against naive round-to-nearest (RTN) on the same forward pass — GPTQ-quantized weights produce MSE typically 2-5x lower because each rounding error has been compensated downstream.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. AWQ — Activation-Aware Weight Quantization (Lin 2023)</h2>
<p class="l-text">AWQ (<em>Lin, Tang, Tang, Yang, Han — "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration", 2023</em>) made a different bet. Empirically, in LLMs only ~1% of weights — the ones multiplied by large activations — really matter. AWQ identifies these "salient" channels via activation magnitude statistics, then scales them up before quantization (and scales activations down to compensate), which protects them from rounding error.</p>

<div class="katex-block">$$W' = W \\cdot \\text{diag}(s), \\quad X' = \\text{diag}(s)^{-1} \\cdot X, \\quad W' X' = W X$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Insight</div><div class="card-body">Outlier <em>weights</em> are not the problem; outlier <em>activations</em> are. The salient weights are those whose channel sees big activations. Protecting them via per-channel scaling preserves accuracy.</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">Beats GPTQ on Llama family at INT4, especially at group=128. Faster to compute (no Hessian inversion). The default in llama.cpp's K-quants and in MLX (Apple's framework).</div></div>
<div class="calc-card"><div class="card-title">Tooling</div><div class="card-body">llm-awq (MIT-Han-Lab), AutoAWQ, integrated in HuggingFace Optimum. AWQ-quantized weights ship widely on the Hub (TheBloke's AWQ uploads, Microsoft's Phi-3-mini-AWQ).</div></div>
<div class="calc-card"><div class="card-title">Hardware bonus</div><div class="card-body">AWQ does not need a separate fp16-fp16 path for outlier handling (LLM.int8 from Dettmers does), so kernels are simpler and faster on consumer GPUs. ~3x speedup over LLM.int8 inference.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tiny AWQ surrogate: detect salient input channels via activation L2 norms, scale weights up there before quantizing, and verify the output stays closer to FP32 than naive RTN.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
np.random.seed(1)

d_in, d_out, n_calib = 128, 64, 512
W = np.random.randn(d_out, d_in).astype(np.float32) * 0.1
# Inject 5 outlier activation channels (mimics LLM behavior)
X = np.random.randn(d_in, n_calib).astype(np.float32)
salient_idx = np.array([3, 17, 42, 88, 110])
X[salient_idx] *= 8.0
Y_fp32 = W @ X

# Activation magnitude per input channel
act_mag = np.mean(np.abs(X), axis=1)  # (d_in,)
# AWQ scaling: s_i ~ act_mag^alpha, alpha=0.5 in paper
alpha = 0.5
s = (act_mag / act_mag.mean())**alpha
s = np.clip(s, 1.0, 8.0)  # cap to avoid blowup

# Apply scaling
W_scaled = W * s[None, :]
X_scaled = X / s[:, None]

def quant_int4(w):
    scale = np.max(np.abs(w), axis=-1, keepdims=True) / 7.0 + 1e-8
    return np.clip(np.round(w/scale), -8, 7) * scale

W_awq_q = quant_int4(W_scaled)
W_rtn_q = quant_int4(W)

err_rtn = np.mean((W_rtn_q @ X - Y_fp32)**2)
err_awq = np.mean((W_awq_q @ X_scaled - Y_fp32)**2)
print(f"Naive RTN MSE: {err_rtn:.4f}")
print(f"AWQ-style MSE: {err_awq:.4f}")
print(f"AWQ is {err_rtn/err_awq:.2f}x better on outlier-heavy activations")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a 64x128 weight and a 128x512 activation block, then deliberately spikes 5 input channels (indices 3, 17, 42, 88, 110) by 8x — this mimics the "outlier features" Dettmers documented in LLM.int8 where ~1% of hidden dimensions carry huge magnitudes. 2) Computes <code>act_mag</code> = mean absolute activation per input channel — AWQ's salience metric, no Hessian needed. 3) Forms scaling factors <code>s_i = (act_mag_i / mean)^0.5</code> (alpha=0.5 is Lin 2023's default), clipped to [1, 8] so a single huge channel cannot blow up the kernel. 4) Applies the equivalence <code>W' = W·diag(s)</code>, <code>X' = diag(s)⁻¹·X</code> — mathematically <code>W'X' = WX</code> exactly, but now the salient weight columns have been scaled UP into a range where INT4 rounding error costs them proportionally less. 5) Quantizes <code>W'</code> to INT4 vs naive RTN on raw <code>W</code>, then measures forward-pass MSE — AWQ typically wins 2-4x on this outlier-spiked input precisely because the salient channels were protected.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. SmoothQuant — Migrate Difficulty Weights ↔ Activations (Xiao 2023)</h2>
<p class="l-text">SmoothQuant (<em>Xiao, Lin, Seznec, Wu, Demouth, Han — "SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models", 2023</em>) targets a different problem: <strong>full INT8</strong> (both weights AND activations), which is what you need for cheap INT8 GPU/NPU kernels. The blocker is that activation outliers in LLMs span 100x the typical range, so per-tensor INT8 activations destroy accuracy. SmoothQuant migrates difficulty from activations to weights using the same diag-scaling trick AWQ uses.</p>

<div class="katex-block">$$Y = (X \\cdot \\text{diag}(s)^{-1}) \\cdot (\\text{diag}(s) \\cdot W), \\quad s_j = \\max|X_j|^{\\alpha} / \\max|W_j|^{1-\\alpha}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Goal</div><div class="card-body">Make activations more quantization-friendly by scaling them down. Weights absorb the scale-up; weights are easier to quantize because they are static.</div></div>
<div class="calc-card"><div class="card-title">Hyperparameter</div><div class="card-body">α controls how much to migrate. α=0.5 is the paper default; bigger α moves more difficulty to weights. For OPT-175B and Llama, α=0.85 is typical.</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">First W8A8 (weights and activations both INT8) for LLMs that matched FP16 within 0.5 perplexity. Foundation for Marlin and FlashAttention-INT8 kernels. Used inside NVIDIA TensorRT-LLM.</div></div>
<div class="calc-card"><div class="card-title">When to use</div><div class="card-body">Server-side INT8 inference where you want both fast matmul (W8A8) and the standard INT8 hardware path. Not strictly needed for INT4-weight-only LLM-on-laptop, where AWQ alone is enough.</div></div>
</div>

<div class="calc-highlight"><strong>Mental model:</strong> AWQ and SmoothQuant share the same math (per-channel diag scaling); they target different bottlenecks. AWQ protects weight precision in W4A16. SmoothQuant enables W8A8 by taming activation outliers. Use both with GPTQ for the strongest INT4 stack.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. FP8 — The New Datacenter Path (Hopper, Blackwell)</h2>
<p class="l-text">NVIDIA Hopper (H100, 2022) and Blackwell (B100/B200, 2024) introduced FP8 as a hardware-native datatype, with two encodings: <strong>E4M3</strong> (range ±448, used for weights/activations) and <strong>E5M2</strong> (range ±57344, used for gradients). FP8 has the dynamic range of a float and the size of an INT8 — best of both worlds for transformer training.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FP8 vs INT8</div><div class="card-body">FP8 has exponent bits, so it covers a wider range without per-channel scaling tricks. Easier deployment (fewer accuracy gotchas), often slightly less aggressive compression at the same bit budget vs well-tuned INT8.</div></div>
<div class="calc-card"><div class="card-title">FP8 training</div><div class="card-body">NVIDIA Transformer Engine (Hopper) trains GPT-class models in FP8 with FP16-quality results. Used by NVIDIA NeMo, MosaicML/Databricks, OpenAI internal training.</div></div>
<div class="calc-card"><div class="card-title">FP8 vs INT4 for inference</div><div class="card-body">INT4 is smaller (2x compression over FP8) but harder. FP8 is the conservative choice on H100/B200 for serving; INT4 is the choice when you must fit a 70B model on a single 80GB GPU or run a 7B on a phone.</div></div>
<div class="calc-card"><div class="card-title">Edge relevance</div><div class="card-body">Apple M3/M4 and Snapdragon X NPUs do not natively support FP8 yet (2026). On phones and laptops, INT4/INT8 dominate; FP8 is a server story for now.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Calibration Sets — The Quiet Way to Lobotomize Your Model</h2>
<p class="l-text">PTQ methods (GPTQ, AWQ, SmoothQuant) all need a small <em>calibration set</em> — typically 128–512 short samples — to estimate activation statistics. Most production accidents in quantization come from a bad calibration set, not from the algorithm.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Common mistake 1 — too narrow domain</div><div class="card-body">Calibrating a chatbot LLM on Wikipedia destroys performance on code and dialogue. Use a mix that matches deployment: WikiText + C4 + ShareGPT-style chats + code samples.</div></div>
<div class="calc-card"><div class="card-title">Common mistake 2 — too short sequences</div><div class="card-body">Calibrating with 128-token chunks misses long-context activations. Use 2048 tokens minimum if your model serves long contexts.</div></div>
<div class="calc-card"><div class="card-title">Common mistake 3 — language bias</div><div class="card-body">English-only calibration on a multilingual model wrecks Turkish, Arabic, and CJK performance. If you ship multilingual, calibrate multilingual.</div></div>
<div class="calc-card"><div class="card-title">Common mistake 4 — instruction format mismatch</div><div class="card-body">Calibrating with raw text on a chat-tuned model misses the special tokens. Always include &lt;|im_start|&gt;, &lt;|user|&gt; markers in calibration.</div></div>
</div>

<div class="calc-highlight"><strong>Standard recipe (2026):</strong> 128 samples × 2048 tokens, half from C4 (general web text), quarter from your chat format, eighth code, eighth target-language. Run it twice with different seeds and pick the lower-perplexity quantization.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Per-Channel + Per-Group INT4 in NumPy — End-to-End</h2>
<p class="l-text">To consolidate everything, here is a per-channel, per-group INT4 quantization with FP16 scales — the exact recipe behind GGUF Q4_0 and a stripped-down Q4_K. NumPy is enough to see the full pipeline.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
np.random.seed(2)

# Pretend this is one linear layer of an LLM: 4096 -&gt; 4096
d_out, d_in = 1024, 1024  # smaller for the demo
W = np.random.randn(d_out, d_in).astype(np.float32) * 0.05

GROUP = 32  # group size (Q4_0 default)
assert d_in % GROUP == 0

# Reshape to (d_out, n_groups, GROUP)
W_g = W.reshape(d_out, d_in // GROUP, GROUP)
# Per-group symmetric scale
scales = np.max(np.abs(W_g), axis=-1, keepdims=True) / 7.0 + 1e-8  # (d_out, n_groups, 1)
# Quantize to INT4
W_q = np.clip(np.round(W_g / scales), -8, 7).astype(np.int8)
# Dequantize for verification
W_dq = (W_q.astype(np.float32) * scales).reshape(d_out, d_in)

# Storage: each weight = 4 bits + (d_out * n_groups) FP16 scales
n_weights = d_out * d_in
n_scales = d_out * (d_in // GROUP)
size_int4 = (n_weights * 4 + n_scales * 16) // 8  # bytes
size_fp32 = n_weights * 4

print(f"FP32 size: {size_fp32/1024:.1f} KB")
print(f"INT4 (group={GROUP}) size: {size_int4/1024:.1f} KB")
print(f"Compression ratio: {size_fp32/size_int4:.2f}x")
print(f"Mean abs error: {np.mean(np.abs(W - W_dq)):.6f}")
print(f"Max abs error:  {np.max(np.abs(W - W_dq)):.6f}")

# Forward pass on random input
x = np.random.randn(d_in, 32).astype(np.float32)
y_fp = W @ x
y_q  = W_dq @ x
print(f"Output MSE (FP32 vs INT4 dequant): {np.mean((y_fp - y_q)**2):.6f}")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Reshapes the 1024x1024 weight into <code>(d_out, n_groups, GROUP)</code> with GROUP=32 — exactly the GGUF Q4_0 layout, where each 32-element row block becomes one quantization group. 2) Computes per-group symmetric scales: <code>max(|w|) / 7</code> along the last axis (7 because INT4's positive range is [0, 7] under signed nibble interpretation). 3) Quantizes with <code>round(W/scales)</code> clipped to [-8, 7] — note this is per-group: a row with one outlier group does NOT crush its other 31 groups' precision. 4) Stores INT4 weights (4 bits each) plus FP16 scales (16 bits per group of 32 weights) — overhead is 16/(4·32) = 12.5%, so the effective compression is 8x · 1/1.125 ≈ 7.1x, the exact Q4_0 storage ratio. 5) Runs a forward pass with the dequantized matrix against a random batch of 32 and reports output MSE — typically 1e-5 to 1e-4 on Gaussian weights, the regime where downstream LLM perplexity barely moves.</p>

<p class="l-text">This code shows ~7.5x compression (vs the naive 8x of pure INT4) — the 0.5x cost is the FP16 scales. That is exactly the GGUF Q4_0 storage layout, and it is what lets a 7B Llama fit in 4GB on your laptop.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary — Choose the Right Tool</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">CV / small CNN on phone</div><div class="card-body">Per-channel symmetric INT8 weights + per-tensor asymmetric INT8 activations. PTQ first; if accuracy hurts, QAT for the last few %.</div></div>
<div class="calc-card"><div class="card-title">LLM on laptop / phone (4–8GB target)</div><div class="card-body">INT4 weight-only, group=32 or 128. Use AWQ for highest accuracy or GPTQ if AWQ is unavailable. Activations stay FP16.</div></div>
<div class="calc-card"><div class="card-title">LLM on server with W8A8 demand</div><div class="card-body">SmoothQuant + INT8 weights + INT8 activations. Pair with TensorRT-LLM or vLLM-INT8.</div></div>
<div class="calc-card"><div class="card-title">Datacenter training / Hopper+</div><div class="card-body">FP8 (E4M3 fwd, E5M2 grad) via Transformer Engine. Easier than INT8, slightly less compression.</div></div>
<div class="calc-card"><div class="card-title">Microcontroller / TinyML</div><div class="card-body">INT8 QAT, sometimes ternary or binary. TensorFlow Lite Micro, edge-impulse pipeline.</div></div>
</div>

<p class="l-text">Quantization gets you 4–8x. Pruning and distillation (next lesson) get you another 2–10x — and they compose with quantization. The on-device LLM revolution is exactly the product of these three techniques applied together.</p>
</div>`,
tr: `<p class="l-text"><strong>Quantization, 2026 edge ML'de açık ara en önemli sıkıştırma tekniğidir.</strong> Şimdiye kadar kullandığınız her cihaz-üstü LLM — telefonunuzdaki Phi-3-mini, Ollama'daki Llama 3.2, MacWhisper'daki Whisper, M-serisi Mac'lerdeki Stable Diffusion XL Turbo — INT4 veya INT8 olarak gönderilir, FP16 olarak değil. Sebebi acımasızca basittir: FP16'da 7B model 14GB'dır ve bir telefona sığmaz, ancak INT4'te (Q4_K_M) 4GB'tır ve saniyede 30 token hızında çalışır. İş, doğruluğu yıkmadan bunu yapmaktır, ki bu da GPTQ, AWQ ve SmoothQuant makalelerinin 2022 ile 2023 arasında çözdüğü şeydir.</p>

<p class="l-text">Bu derste, L1'deki temel tensor-başına INT8 taslağından tam modern yığına geçiyoruz. Simetrik vs asimetrik, tensor-başına vs kanal-başına vs grup-başına, post-training (PTQ) vs quantization-aware training (QAT), üç kilometre taşı makale (Frantar 2022 GPTQ, Lin 2023 AWQ, Xiao 2023 SmoothQuant) ve her birinin neyi düzelttiği, NVIDIA Hopper'ın açtığı yeni FP8 yolu, ve "üretimde gönderilir" ile "tarihleri halüsine eden lobotomize edilmiş model" arasındaki farkı yaratan kalibrasyon-set tuzakları. NumPy ile GPTQ-tarzı Hessian-aware yuvarlamanın bir uygulaması ve matematiği hissetmeniz için küçük bir AWQ surrogate ile bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Simetrik ve asimetrik INT8 quantization formüllerini türetmek ve her ikisini NumPy'da uygulamak</li>
<li>Tensor-başına, kanal-başına ve grup-başına (blok) quantization granülerliği arasında seçim yapmak</li>
<li>PTQ'yu QAT'tan ayırmak ve her birinin mühendislik maliyetine ne zaman değer olduğunu bilmek</li>
<li>GPTQ'nun Hessian-aware yuvarlamasını (Frantar 2022) denklem düzeyinde açıklamak</li>
<li>AWQ'nun salient-weight ölçeklemesini (Lin 2023) ve aktivasyon outlier'ları üzerinde GPTQ'yu neden yendiğini açıklamak</li>
<li>SmoothQuant'ı (Xiao 2023) INT8 LLM'ler için aktivasyon zorluğunu ağırlıklara taşımak için kullanmak</li>
<li>Quantize edilmiş modele önyargı pişirmeyen bir kalibrasyon seti seçmek</li>
<li>Bir FP8 (E4M3, E5M2) ödünleşimini okumak ve INT4 ile FP8 arasında karar vermek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Simetrik vs Asimetrik, Tensor-başına vs Kanal-başına</h2>
<p class="l-text">Başlangıç noktası, bir kayan-noktalı tensor <code>w</code> ve bir hedef tamsayı aralığı <code>[q_min, q_max]</code>'tir, tipik olarak INT8 için <code>[-128, 127]</code>. Float'ları tamsayılara ve geri eşlememiz gerekir. İki seçim ekseni vardır: <em>simetrik</em> vs <em>asimetrik</em> ve <em>tensor-başına</em> vs <em>kanal-başına</em> (veya grup-başına).</p>

<div class="katex-block">$$\\text{symmetric:} \\quad q = \\text{round}(w / s), \\quad s = \\frac{\\max|w|}{127}$$</div>

<div class="katex-block">$$\\text{asymmetric:} \\quad q = \\text{round}(w / s) + z, \\quad s = \\frac{w_{\\max} - w_{\\min}}{255}, \\quad z = -\\text{round}(w_{\\min}/s) - 128$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetrik</div><div class="card-body">Sıfır noktası yok. Daha hızlı INT8 kernel'leri (offset yok). Veri kaymışsa bir bin'i boşa harcar (örn. ReLU sonrası, hepsi pozitif). Ağırlıklar için varsayılan — eğitim sayesinde sıfır etrafında simetrik.</div></div>
<div class="calc-card"><div class="card-title">Asimetrik</div><div class="card-body">Bir sıfır noktası <code>z</code>'ye sahiptir. Simetrik olmayan ReLU/GeLU sonrası aktivasyonlar için daha iyi. Kernel'de fazladan bir tamsayı toplama maliyeti.</div></div>
<div class="calc-card"><div class="card-title">Tensor-başına</div><div class="card-body">Matris başına bir scale. En ucuzu. Outlier'lara hassas — tek bir devasa ağırlık scale'i havaya uçurur ve diğer her şeyi ezer.</div></div>
<div class="calc-card"><div class="card-title">Kanal-başına (satır-başına veya sütun-başına)</div><div class="card-body">Çıkış kanalı başına bir scale. Conv ve lineer katmanlar için standart. ~Aynı maliyet, çok daha iyi doğruluk. TFLite, ONNXRuntime varsayılanlarında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Grup-başına (blok)</div><div class="card-body">Her N ardışık ağırlık başına bir scale (tipik olarak 32, 64, 128). GGUF'ta Q4_K_M'in temeli — group=32, her 32 ağırlık bloğu kendi 4-bit scale'ini alır demektir. Düşük bit genişliklerinde en iyi doğruluk.</div></div>
</div>

<div class="calc-highlight"><strong>2026 üretim varsayılanı:</strong> CNN'ler/Transformer'lar için kanal-başına simetrik INT8 ağırlıklar + tensor-başına asimetrik INT8 aktivasyonlar, ve LLM ağırlıkları için FP16 aktivasyonlarla grup-başına INT4 (group=32 veya 64).</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. PTQ vs QAT — Hangisine Uzanmalısın?</h2>
<p class="l-text"><strong>Post-training quantization (PTQ)</strong>, bitmiş bir FP32 modeli alır ve sonradan quantize eder, isteğe bağlı olarak scale'leri ayarlamak için küçük bir kalibrasyon seti kullanır. <strong>Quantization-aware training (QAT)</strong>, simüle edilmiş quantization'ı straight-through estimator'larla eğitim döngüsüne pişirir, böylece model yuvarlamaya dayanıklı ağırlıklar öğrenir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PTQ — hızlı, ucuz, çoğu zaman yeterli</div><div class="card-body">128–1000 örneklik bir kalibrasyon setinde dakika ila saatlerce hesaplama. INT8'de iyi çalışır. GPTQ/AWQ kullanmadıkça INT4'te kırılmaya başlar. 2026'da LLM quantization'ının ~%99'u PTQ'dur çünkü 7B+ bir modeli yeniden eğitmek çok pahalıdır.</div></div>
<div class="calc-card"><div class="card-title">QAT — yavaş, pahalı, son çare</div><div class="card-body">Modeli forward pass'te fake-quantize op'larıyla yeniden eğit (veya fine-tune et). INT4 / INT2 / ikili'de doğruluğu kurtarır. Üretim CV'de (Pixel kameralar için MobileNetV3 INT8 QAT) ve mikrodenetleyicilerdeki küçük CNN'ler için kullanılır.</div></div>
</div>

<p class="l-text">2026 pratik kuralı: önce PTQ'yu deneyin. INT8'de doğruluk %1–2'den fazla düşerse, kanal-başına ve daha iyi bir kalibrasyon seti deneyin. Hala kötüyse, INT4 için GPTQ/AWQ'ya geçin. Sadece, aktivasyonların büyük outlier'ları olan ve PTQ hilelerinin yetmediği bir modelde mutlaka INT4 veya altına vurmanız gerektiğinde QAT'a uzanın.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GPTQ — Hessian-Aware Yuvarlama (Frantar 2022)</h2>
<p class="l-text">GPTQ (<em>Frantar, Ashkboos, Hoefler, Alistarh — "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers", 2022</em>), INT4 LLM'lerin üretimde gönderilmesini sağlayan atılım oldu. İçgörü: bir ağırlığı yuvarladığınızda, <em>henüz quantize edilmemiş</em> ağırlıkları ikinci dereceden (Hessian) bilgi kullanarak ayarlayarak telafi edebilirsiniz, böylece katmanın çıktısı orijinaline yakın kalır.</p>

<p class="l-text">Resmi olarak, girdisi <code>X</code> ve ağırlıkları <code>W</code> olan bir lineer katman için, optimal quantization <code>||WX - QX||²</code>'yi minimize eder. Bunu katman bazında çözmek, Hessian <code>H = 2 X X^T</code>'yi kullanan OBQ (Optimal Brain Quantization) güncellemesini verir. GPTQ'nun katkısı, bunu LLM ölçeğinde verimli yapmaktır — Cholesky-decomposed Hessian, ağırlıkları bloklar halinde işleme, lazy güncellemeler.</p>

<div class="katex-block">$$w_q = \\arg\\min_{w_q \\in \\mathcal{Q}} (w - w_q)^2 / [H^{-1}]_{ii}, \\quad W \\leftarrow W - \\frac{(w - w_q)}{[H^{-1}]_{ii}} \\cdot H^{-1}_{i,:}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">7B–175B LLM'ler INT4'e &lt;%1 perplexity düşüşü ile, 175B model için toplam 2–4 GPU saatinde. İlk pratik INT4 LLM sıkıştırıcı.</div></div>
<div class="calc-card"><div class="card-title">Kalibrasyon</div><div class="card-body">Sadece 128 örnek (tipik olarak WikiText-2 veya 2048 token'lık C4 chunk'ları) katman başına Hessian'ı tahmin etmeye yeter.</div></div>
<div class="calc-card"><div class="card-title">Tooling</div><div class="card-body">AutoGPTQ (Python lib), HuggingFace Optimum entegrasyonu, Transformers <code>load_in_4bit=True, quantization_config=GPTQConfig</code>. Ayrıca TheBloke'un Hub'daki GPTQ model yüklemelerine pişirilmiştir.</div></div>
<div class="calc-card"><div class="card-title">Sınırlama</div><div class="card-body">Aktivasyon outlier'larına hassas (AWQ'nun daha sonra hedeflediği aynı problem). Aşırı outlier özelliklere sahip modellerde (Llama-3 70B), INT4'te GPTQ AWQ'dan 1–2 perplexity puanı geride kalır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Gerçek GPTQ kullanımı (auto-gptq gerektirir, tarayıcıda çalıştırılamaz)
from transformers import AutoModelForCausalLM, AutoTokenizer
from transformers import GPTQConfig

quant_cfg = GPTQConfig(bits=4, dataset="c4", tokenizer=AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B"))
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B", quantization_config=quant_cfg, device_map="auto")
model.save_pretrained("./Llama-3.2-3B-GPTQ-INT4")
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) HuggingFace Transformers yığınını ve <code>GPTQConfig</code> yardımcısını import eder — altında bu AutoGPTQ'yu çağırır. 2) <code>bits=4</code> ve <code>dataset="c4"</code> ile bir config kurar: 128 varsayılan C4 örneği tokenize edilip kalibrasyon seti olarak kullanılır, katman-başına Hessian tahmin etmek için. 3) <code>quantization_config</code> ile <code>from_pretrained</code>, Llama-3.2-3B'yi FP16 yükler, sonra GPTQ'yu katman katman çalıştırır — her lineer'in <code>H = 2 X X^T</code>'si oluşturulur, Cholesky-faktörize edilir ve ağırlıklar OBQ telafi güncellemesi ile INT4'e quantize edilir. 4) <code>save_pretrained</code>, INT4 ağırlıkları + grup-başına FP16 scale'leri bir HuggingFace checkpoint olarak yazar (~2GB disk, FP16'nın 6GB'ına karşı). Runtime ~16GB VRAM'den ~4GB'a düşer, WikiText üzerinde %1'in altında perplexity kaybı ile.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tek bir lineer katman üzerinde basitleştirilmiş GPTQ: bir seferde bir ağırlığı yuvarla, kalan ağırlıkları Hessian inverse kullanarak telafi et. <em>Yapı</em> gerçek algoritma ile aynıdır — gerçek olanı sadece verimlilik için Cholesky ve blok işleme ekler.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
np.random.seed(0)

# Tek lineer katman: out = W @ x, d_in = 64
d_in, d_out, n_calib = 64, 32, 256
W = np.random.randn(d_out, d_in).astype(np.float32) * 0.1
X = np.random.randn(d_in, n_calib).astype(np.float32)
Y_fp32 = W @ X

# Hessian H = 2 X X^T inşa et ve invert et (kararlılık için damping ile)
H = 2.0 * X @ X.T
H += 0.01 * np.trace(H)/d_in * np.eye(d_in)
Hinv = np.linalg.inv(H)

def quant_int4(w, scale):
    return np.clip(np.round(w/scale), -8, 7) * scale

# Basitleştirilmiş GPTQ: satır-başına, sıralı
W_q = W.copy()
for r in range(d_out):
    w = W_q[r].copy()
    scale = np.max(np.abs(w)) / 7.0
    for i in range(d_in):
        q = quant_int4(w[i], scale)
        err = (w[i] - q) / Hinv[i,i]
        w[i] = q
        # kalan ağırlıkları telafi et
        if i+1 &lt; d_in:
            w[i+1:] -= err * Hinv[i, i+1:]
    W_q[r] = w

# Naif RTN (round-to-nearest) vs GPTQ karşılaştır
W_rtn = quant_int4(W, np.max(np.abs(W))/7.0)
err_rtn = np.mean((W_rtn @ X - Y_fp32)**2)
err_gptq = np.mean((W_q @ X - Y_fp32)**2)
print(f"RTN  output MSE: {err_rtn:.6f}")
print(f"GPTQ output MSE: {err_gptq:.6f}")
print(f"GPTQ is {err_rtn/err_gptq:.2f}x better")
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Küçük bir lineer katman (W: 32x64) ve Hessian'ın iyi-koşullu olması için 256 kalibrasyon vektörü kurar. 2) <code>H = 2 X X^T</code>'yi tam olarak Frantar 2022'deki gibi oluşturur, sonra bir damping terimi ekler (trace'in %1'i diyagonale dağıtılır) — bu damping olmadan <code>np.linalg.inv</code> neredeyse tekil kalibrasyon verisinde patlar. 3) Her çıkış satırı için input boyutlarında soldan sağa yürür: bir ağırlığı <code>round(w/scale)</code> ile INT4'ün [-8, 7]'sine kırparak quantize eder, <code>1/H⁻¹[i,i]</code> ile ölçeklenmiş yuvarlama hatasını ölçer ve bu hatayı <code>H⁻¹</code>'in i'nci satırı yoluyla kalan (henüz quantize edilmemiş) tüm ağırlıklara yayar — bu yayılım GPTQ'nun tüm numarasıdır. 4) Aynı forward pass'te naif round-to-nearest (RTN) ile karşılaştırır — GPTQ-quantize ağırlıklar tipik olarak 2-5x daha düşük MSE üretir çünkü her yuvarlama hatası downstream telafi edilmiştir.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. AWQ — Activation-Aware Weight Quantization (Lin 2023)</h2>
<p class="l-text">AWQ (<em>Lin, Tang, Tang, Yang, Han — "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration", 2023</em>) farklı bir bahse oynadı. Ampirik olarak, LLM'lerde sadece ~%1 ağırlık — büyük aktivasyonlarla çarpılanlar — gerçekten önemlidir. AWQ bu "salient" kanalları aktivasyon büyüklüğü istatistikleri yoluyla tanımlar, sonra quantization'dan önce onları yukarı ölçeklendirir (ve telafi etmek için aktivasyonları aşağı ölçeklendirir), bu da onları yuvarlama hatasından korur.</p>

<div class="katex-block">$$W' = W \\cdot \\text{diag}(s), \\quad X' = \\text{diag}(s)^{-1} \\cdot X, \\quad W' X' = W X$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İçgörü</div><div class="card-body">Outlier <em>ağırlıklar</em> sorun değildir; outlier <em>aktivasyonlar</em>dır. Salient ağırlıklar, kanalı büyük aktivasyonlar gören ağırlıklardır. Onları kanal-başına ölçekleme ile korumak doğruluğu korur.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">INT4'te Llama ailesinde GPTQ'yu yener, özellikle group=128'de. Hesaplaması daha hızlı (Hessian inversiyonu yok). llama.cpp'nin K-quant'larında ve MLX'te (Apple framework'ü) varsayılan.</div></div>
<div class="calc-card"><div class="card-title">Tooling</div><div class="card-body">llm-awq (MIT-Han-Lab), AutoAWQ, HuggingFace Optimum'da entegre. AWQ-quantize edilmiş ağırlıklar Hub'da yaygınca gönderilir (TheBloke'un AWQ yüklemeleri, Microsoft'un Phi-3-mini-AWQ'su).</div></div>
<div class="calc-card"><div class="card-title">Donanım bonusu</div><div class="card-body">AWQ outlier işlemesi için ayrı bir fp16-fp16 yoluna ihtiyaç duymaz (Dettmers'tan LLM.int8 duyar), bu yüzden tüketici GPU'larında kernel'ler daha basit ve daha hızlıdır. LLM.int8 çıkarımı üzerinde ~3x hızlanma.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük AWQ surrogate: aktivasyon L2 norm'ları yoluyla salient input kanallarını tespit et, quantize etmeden önce ağırlıkları orada yukarı ölçekle, ve çıktının naif RTN'den FP32'ye daha yakın kaldığını doğrula.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
np.random.seed(1)

d_in, d_out, n_calib = 128, 64, 512
W = np.random.randn(d_out, d_in).astype(np.float32) * 0.1
# 5 outlier aktivasyon kanalı enjekte et (LLM davranışını taklit eder)
X = np.random.randn(d_in, n_calib).astype(np.float32)
salient_idx = np.array([3, 17, 42, 88, 110])
X[salient_idx] *= 8.0
Y_fp32 = W @ X

# Input kanalı başına aktivasyon büyüklüğü
act_mag = np.mean(np.abs(X), axis=1)  # (d_in,)
# AWQ ölçekleme: s_i ~ act_mag^alpha, makalede alpha=0.5
alpha = 0.5
s = (act_mag / act_mag.mean())**alpha
s = np.clip(s, 1.0, 8.0)  # patlamayı önlemek için sınırla

# Ölçekleme uygula
W_scaled = W * s[None, :]
X_scaled = X / s[:, None]

def quant_int4(w):
    scale = np.max(np.abs(w), axis=-1, keepdims=True) / 7.0 + 1e-8
    return np.clip(np.round(w/scale), -8, 7) * scale

W_awq_q = quant_int4(W_scaled)
W_rtn_q = quant_int4(W)

err_rtn = np.mean((W_rtn_q @ X - Y_fp32)**2)
err_awq = np.mean((W_awq_q @ X_scaled - Y_fp32)**2)
print(f"Naive RTN MSE: {err_rtn:.4f}")
print(f"AWQ-style MSE: {err_awq:.4f}")
print(f"AWQ is {err_rtn/err_awq:.2f}x better on outlier-heavy activations")
</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) 64x128'lik bir ağırlık ve 128x512'lik bir aktivasyon bloğu kurar, sonra kasıtlı olarak 5 input kanalını (indeksler 3, 17, 42, 88, 110) 8x büyütür — bu, Dettmers'ın LLM.int8'de belgelediği "outlier feature" davranışını taklit eder: gizli boyutların ~%1'i devasa büyüklük taşır. 2) <code>act_mag</code>'ı hesaplar — input kanalı başına ortalama mutlak aktivasyon; AWQ'nun salience metriği, Hessian gerekmez. 3) Ölçekleme faktörlerini <code>s_i = (act_mag_i / mean)^0.5</code> şeklinde kurar (alpha=0.5 Lin 2023 varsayılanı), tek bir devasa kanalın kernel'i havaya uçurmaması için [1, 8]'e kırpar. 4) Eşdeğerlik <code>W' = W·diag(s)</code>, <code>X' = diag(s)⁻¹·X</code>'i uygular — matematiksel olarak <code>W'X' = WX</code> tam olarak doğru, ama artık salient ağırlık sütunları INT4 yuvarlama hatasının orantısal olarak daha az pahalıya geleceği bir aralığa YUKARI ölçeklenmiş. 5) Naif RTN'in ham <code>W</code>'sine karşı <code>W'</code>'yi INT4'e quantize eder, sonra forward-pass MSE'sini ölçer — AWQ bu outlier-spike'lı girdide tipik olarak 2-4x kazanır çünkü salient kanallar korunmuştur.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. SmoothQuant — Zorluğu Ağırlıklar ↔ Aktivasyonlar Arasında Taşı (Xiao 2023)</h2>
<p class="l-text">SmoothQuant (<em>Xiao, Lin, Seznec, Wu, Demouth, Han — "SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models", 2023</em>), farklı bir sorunu hedefler: <strong>tam INT8</strong> (hem ağırlıklar HEM aktivasyonlar), ki ucuz INT8 GPU/NPU kernel'leri için ihtiyacınız olan budur. Engelleyici, LLM'lerdeki aktivasyon outlier'larının tipik aralığın 100x'ini kapsamasıdır, bu yüzden tensor-başına INT8 aktivasyonlar doğruluğu yok eder. SmoothQuant, AWQ'nun kullandığı aynı diag-ölçekleme hilesini kullanarak zorluğu aktivasyonlardan ağırlıklara taşır.</p>

<div class="katex-block">$$Y = (X \\cdot \\text{diag}(s)^{-1}) \\cdot (\\text{diag}(s) \\cdot W), \\quad s_j = \\max|X_j|^{\\alpha} / \\max|W_j|^{1-\\alpha}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hedef</div><div class="card-body">Aktivasyonları aşağı ölçekleyerek quantization-dostu yap. Ağırlıklar yukarı ölçeklemeyi emer; ağırlıklar statik oldukları için quantize etmek daha kolaydır.</div></div>
<div class="calc-card"><div class="card-title">Hiperparametre</div><div class="card-body">α ne kadar taşınacağını kontrol eder. α=0.5 makale varsayılanıdır; daha büyük α daha fazla zorluğu ağırlıklara taşır. OPT-175B ve Llama için α=0.85 tipiktir.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">FP16'yı 0.5 perplexity içinde eşleştiren ilk W8A8 (ağırlıklar ve aktivasyonlar her ikisi INT8) LLM. Marlin ve FlashAttention-INT8 kernel'leri için temel. NVIDIA TensorRT-LLM içinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kullanılır</div><div class="card-body">Hem hızlı matmul (W8A8) hem standart INT8 donanım yolu istediğiniz sunucu tarafı INT8 çıkarım. INT4-ağırlık-yalnız LLM-on-laptop için kesinlikle gerekli değil, orada AWQ tek başına yeterlidir.</div></div>
</div>

<div class="calc-highlight"><strong>Zihinsel model:</strong> AWQ ve SmoothQuant aynı matematiği paylaşır (kanal-başına diag ölçekleme); farklı darboğazları hedeflerler. AWQ, W4A16'da ağırlık hassasiyetini korur. SmoothQuant, aktivasyon outlier'larını evcilleştirerek W8A8'i etkinleştirir. En güçlü INT4 yığın için her ikisini GPTQ ile kullanın.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. FP8 — Yeni Veri Merkezi Yolu (Hopper, Blackwell)</h2>
<p class="l-text">NVIDIA Hopper (H100, 2022) ve Blackwell (B100/B200, 2024) FP8'i donanım-yerel bir veri tipi olarak tanıttı, iki kodlama ile: <strong>E4M3</strong> (aralık ±448, ağırlıklar/aktivasyonlar için kullanılır) ve <strong>E5M2</strong> (aralık ±57344, gradyanlar için kullanılır). FP8, bir float'un dinamik aralığına ve bir INT8'in boyutuna sahiptir — transformer eğitimi için her iki dünyanın en iyisi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FP8 vs INT8</div><div class="card-body">FP8 exponent bitlerine sahiptir, bu yüzden kanal-başına ölçekleme hileleri olmadan daha geniş bir aralığı kapsar. Daha kolay dağıtım (daha az doğruluk hatası), aynı bit bütçesinde iyi ayarlanmış INT8'e karşı genellikle biraz daha az agresif sıkıştırma.</div></div>
<div class="calc-card"><div class="card-title">FP8 eğitim</div><div class="card-body">NVIDIA Transformer Engine (Hopper), GPT-sınıfı modelleri FP16-kalitesinde sonuçlarla FP8'de eğitir. NVIDIA NeMo, MosaicML/Databricks, OpenAI dahili eğitiminde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Çıkarım için FP8 vs INT4</div><div class="card-body">INT4 daha küçüktür (FP8 üzerinde 2x sıkıştırma) ama daha zordur. FP8, sunum için H100/B200'de muhafazakar seçimdir; INT4, tek bir 80GB GPU'ya 70B modeli sığdırmanız veya bir telefonda 7B çalıştırmanız gerektiğinde tercihtir.</div></div>
<div class="calc-card"><div class="card-title">Edge ilgisi</div><div class="card-body">Apple M3/M4 ve Snapdragon X NPU'lar henüz FP8'i yerel olarak desteklemez (2026). Telefonlarda ve dizüstülerde, INT4/INT8 hakimdir; FP8 şimdilik sunucu hikayesidir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kalibrasyon Setleri — Modelinizi Sessizce Lobotomize Etme Yolu</h2>
<p class="l-text">PTQ yöntemleri (GPTQ, AWQ, SmoothQuant) hepsi küçük bir <em>kalibrasyon seti</em> gerektirir — tipik olarak 128–512 kısa örnek — aktivasyon istatistiklerini tahmin etmek için. Quantization'daki çoğu üretim kazası, algoritmadan değil, kötü bir kalibrasyon setinden gelir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yaygın hata 1 — çok dar alan</div><div class="card-body">Wikipedia üzerinde bir chatbot LLM'i kalibre etmek, kod ve diyalog üzerinde performansı yok eder. Dağıtıma uyan bir karışım kullanın: WikiText + C4 + ShareGPT-tarzı sohbetler + kod örnekleri.</div></div>
<div class="calc-card"><div class="card-title">Yaygın hata 2 — çok kısa diziler</div><div class="card-body">128 token'lık chunk'larla kalibre etmek uzun-bağlam aktivasyonlarını kaçırır. Modeliniz uzun bağlam servis ediyorsa minimum 2048 token kullanın.</div></div>
<div class="calc-card"><div class="card-title">Yaygın hata 3 — dil önyargısı</div><div class="card-body">Çok dilli bir modelde sadece İngilizce kalibrasyon, Türkçe, Arapça ve CJK performansını yıkar. Çok dilli gönderiyorsanız, çok dilli kalibre edin.</div></div>
<div class="calc-card"><div class="card-title">Yaygın hata 4 — instruction format uyumsuzluğu</div><div class="card-body">Chat-tuned bir modelde ham metinle kalibre etmek özel token'ları kaçırır. Kalibrasyona her zaman &lt;|im_start|&gt;, &lt;|user|&gt; işaretçileri ekleyin.</div></div>
</div>

<div class="calc-highlight"><strong>Standart tarif (2026):</strong> 128 örnek × 2048 token, yarısı C4'ten (genel web metni), dörtte biri chat formatınızdan, sekizde biri kod, sekizde biri hedef-dil. Farklı tohumlarla iki kez çalıştırın ve daha düşük perplexity'li quantization'ı seçin.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. NumPy'da Kanal-başına + Grup-başına INT4 — Uçtan Uca</h2>
<p class="l-text">Her şeyi pekiştirmek için, FP16 scale'lerle kanal-başına, grup-başına bir INT4 quantization — GGUF Q4_0 ve sıyrılmış bir Q4_K'nin tam tarifi. NumPy tüm pipeline'ı görmek için yeterlidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
np.random.seed(2)

# Bir LLM'in tek lineer katmanı: 4096 -&gt; 4096
d_out, d_in = 1024, 1024  # demo için daha küçük
W = np.random.randn(d_out, d_in).astype(np.float32) * 0.05

GROUP = 32  # grup boyutu (Q4_0 varsayılanı)
assert d_in % GROUP == 0

# (d_out, n_groups, GROUP)'a yeniden şekillendir
W_g = W.reshape(d_out, d_in // GROUP, GROUP)
# Grup-başına simetrik scale
scales = np.max(np.abs(W_g), axis=-1, keepdims=True) / 7.0 + 1e-8  # (d_out, n_groups, 1)
# INT4'e quantize et
W_q = np.clip(np.round(W_g / scales), -8, 7).astype(np.int8)
# Doğrulama için dequantize
W_dq = (W_q.astype(np.float32) * scales).reshape(d_out, d_in)

# Depolama: her ağırlık = 4 bit + (d_out * n_groups) FP16 scale
n_weights = d_out * d_in
n_scales = d_out * (d_in // GROUP)
size_int4 = (n_weights * 4 + n_scales * 16) // 8  # bytes
size_fp32 = n_weights * 4

print(f"FP32 size: {size_fp32/1024:.1f} KB")
print(f"INT4 (group={GROUP}) size: {size_int4/1024:.1f} KB")
print(f"Compression ratio: {size_fp32/size_int4:.2f}x")
print(f"Mean abs error: {np.mean(np.abs(W - W_dq)):.6f}")
print(f"Max abs error:  {np.max(np.abs(W - W_dq)):.6f}")

# Rastgele girdi üzerinde forward pass
x = np.random.randn(d_in, 32).astype(np.float32)
y_fp = W @ x
y_q  = W_dq @ x
print(f"Output MSE (FP32 vs INT4 dequant): {np.mean((y_fp - y_q)**2):.6f}")
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) 1024x1024 ağırlığı GROUP=32 ile <code>(d_out, n_groups, GROUP)</code>'a yeniden şekillendirir — tam olarak GGUF Q4_0 düzeni: her 32 elemanlı satır bloğu bir quantization grubu olur. 2) Grup-başına simetrik scale'leri hesaplar: son eksen boyunca <code>max(|w|) / 7</code> (INT4'ün pozitif aralığı işaretli nibble yorumu altında [0, 7]'dir). 3) <code>round(W/scales)</code>'yi [-8, 7]'ye kırparak quantize eder — bu grup-başınadır: bir outlier grubu olan satır diğer 31 grubunun kesinliğini EZMEZ. 4) INT4 ağırlıkları (her biri 4 bit) artı FP16 scale'leri (32 ağırlık grubu başına 16 bit) depolar — overhead 16/(4·32) = %12.5, dolayısıyla efektif sıkıştırma 8x · 1/1.125 ≈ 7.1x, tam Q4_0 depolama oranı. 5) Dequantize matrise karşı 32 batch'lik rastgele girdi ile forward pass çalıştırır ve çıktı MSE'sini raporlar — Gauss ağırlıklarda tipik olarak 1e-5 ile 1e-4 arası, downstream LLM perplexity'sinin neredeyse hiç hareket etmediği rejim.</p>

<p class="l-text">Bu kod ~7.5x sıkıştırma gösterir (saf INT4'ün naif 8x'i yerine) — 0.5x maliyet FP16 scale'lerdir. Bu tam olarak GGUF Q4_0 depolama düzenidir ve dizüstünüzde 7B Llama'nın 4GB'a sığmasını sağlayan şeydir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet — Doğru Aracı Seç</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Telefonda CV / küçük CNN</div><div class="card-body">Kanal-başına simetrik INT8 ağırlıklar + tensor-başına asimetrik INT8 aktivasyonlar. Önce PTQ; doğruluk acıtırsa, son birkaç % için QAT.</div></div>
<div class="calc-card"><div class="card-title">Dizüstü / telefonda LLM (4–8GB hedef)</div><div class="card-body">INT4 ağırlık-yalnız, group=32 veya 128. En yüksek doğruluk için AWQ veya AWQ mevcut değilse GPTQ kullanın. Aktivasyonlar FP16 kalır.</div></div>
<div class="calc-card"><div class="card-title">W8A8 talebi olan sunucuda LLM</div><div class="card-body">SmoothQuant + INT8 ağırlıklar + INT8 aktivasyonlar. TensorRT-LLM veya vLLM-INT8 ile eşleştirin.</div></div>
<div class="calc-card"><div class="card-title">Veri merkezi eğitimi / Hopper+</div><div class="card-body">Transformer Engine aracılığıyla FP8 (E4M3 fwd, E5M2 grad). INT8'den daha kolay, biraz daha az sıkıştırma.</div></div>
<div class="calc-card"><div class="card-title">Mikrodenetleyici / TinyML</div><div class="card-body">INT8 QAT, bazen ternary veya ikili. TensorFlow Lite Micro, edge-impulse pipeline.</div></div>
</div>

<p class="l-text">Quantization size 4–8x kazandırır. Budama ve damıtma (sonraki ders) size başka bir 2–10x kazandırır — ve quantization ile birlikte beslenirler. Cihaz-üstü LLM devrimi tam olarak bu üç tekniğin birlikte uygulanmasının ürünüdür.</p>
</div>`
};
