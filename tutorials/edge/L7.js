window.EDGE_L7 = {
en: `<p class="l-text"><strong>"Visit a URL, run a 1B-parameter LLM" was science fiction in 2022. By 2026 it is a Tuesday.</strong> Two technical shifts collided to make browser ML real: WebGPU (shipped Chrome 113 in May 2023, Safari 17.4 in March 2024, Firefox by default in 2024–25) gave web pages access to compute shaders with the same throughput as native, and the Transformers.js ecosystem (Xenova, 2023) brought HuggingFace's model hub to JavaScript via ONNXRuntime-Web. Add WebLLM (the MLC team's TVM-based browser LLM runtime) and Pyodide (Python in WASM) for tutorials, and the browser becomes a legitimate ML deployment target — zero install, zero data leaves the device, and shareable as a URL.</p>

<p class="l-text">In this lesson we walk the four pillars of browser ML in 2026: <strong>WebGPU</strong> as the compute substrate (compute shaders, tensor ops, memory model), <strong>ONNXRuntime-Web</strong> as the bytecode-format runtime (CPU WASM + WebGPU EP), <strong>Transformers.js</strong> as the HuggingFace-shaped JS library that lets you do <code>pipeline("automatic-speech-recognition")</code> in the browser, and <strong>WebLLM</strong> as the LLM-specialized runtime running 7B+ models with full streaming. We also cover Pyodide for "Python ML in the browser for tutorials and demos" (which is exactly what powers this very tutorial site). We end with browser-runnable NumPy code that mocks a WebGPU compute shader using JS-equivalent loops.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read a WebGPU compute-shader pipeline (WGSL, bind groups, dispatch)</li>
<li>Use Transformers.js to run BERT, Whisper, CLIP, and small LLMs in the browser</li>
<li>Pick between Transformers.js (HF-style API) and WebLLM (LLM-optimized) for browser LLM apps</li>
<li>Estimate browser ML throughput on M-series, Snapdragon, NVIDIA via WebGPU</li>
<li>Avoid the four browser-ML traps: model size, cold start, COOP/COEP, memory limits</li>
<li>Use Pyodide to ship runnable ML tutorials with no backend</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why the Browser? Distribution, Privacy, Zero-Install</h2>
<p class="l-text">Edge ML on phones requires app installs, store approvals, and per-platform builds. The browser fixes all three: send a URL, the user sees an ML feature working, no install dialog, no app store review. That is a distribution superpower — and combined with on-device inference, it is also a privacy superpower (no audio/photos/text reach any server).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Distribution</div><div class="card-body">A demo URL beats an app every time for trial. Whisper-Web (Xenova's transcription demo), Stable Diffusion-Web (mlc.ai), Phi-3-WebGPU all spread by URL. No install funnel.</div></div>
<div class="calc-card"><div class="card-title">Privacy</div><div class="card-body">A speech-to-text page that runs Whisper in WASM never sends audio anywhere. Useful for medical dictation, legal, journalist tools. The "we don't see your data" promise is provable from devtools.</div></div>
<div class="calc-card"><div class="card-title">Cross-platform free</div><div class="card-body">Same code runs on Mac, Windows, Linux, iPad (Safari WebGPU), Android (Chrome WebGPU). One codebase, zero per-platform engineering.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">After model download, every user inference is free to you. For a free demo with viral potential, browser ML is the only economical path.</div></div>
<div class="calc-card"><div class="card-title">Trade-offs</div><div class="card-body">First-load model download (50MB–4GB). Limited by browser memory caps. No persistent state by default. Slower than native by 2–4x for big models due to WebGPU overhead and FP16/INT8 limitations.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. WebGPU — Compute Shaders in the Browser</h2>
<p class="l-text"><strong>WebGPU</strong> is the modern successor to WebGL, designed from the start for general-purpose GPU compute (not just rendering). The shader language is <strong>WGSL</strong> (WebGPU Shading Language), syntactically similar to Rust. Shaders run on the host's actual GPU/NPU; throughput is within 30–80% of native Vulkan / Metal / D3D12, often better than CUDA for small batches due to lower launch overhead.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pipeline</div><div class="card-body">1. Get a GPU adapter and device. 2. Create buffers (input/output tensors). 3. Compile a WGSL compute shader. 4. Set up bind groups (parameter binding). 5. Dispatch with workgroup counts.</div></div>
<div class="calc-card"><div class="card-title">Workgroups</div><div class="card-body">Like CUDA blocks. <code>@workgroup_size(64)</code> declares 64 threads per group, dispatched in a 1D/2D/3D grid. Shared memory (<code>var&lt;workgroup&gt;</code>) lets threads in a group cooperate.</div></div>
<div class="calc-card"><div class="card-title">Types</div><div class="card-body">f32, f16 (extension; widely supported in 2026), i32, u32, vec4&lt;f32&gt;, mat4x4&lt;f32&gt;. Tensors are buffers of floats; no native tensor type — same as CUDA.</div></div>
<div class="calc-card"><div class="card-title">Limits</div><div class="card-body">Max buffer ~1–4GB depending on browser/device. Max compute invocations 256 per workgroup. Storage buffer count 8–16. For LLM weights you split across many buffers and stream.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>WGSL (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// A WebGPU compute shader: element-wise vector add (a + b -&gt; c)
// (You'd dispatch this from JS via device.createComputePipeline / encoder.dispatchWorkgroups)

@group(0) @binding(0) var&lt;storage, read&gt;       a : array&lt;f32&gt;;
@group(0) @binding(1) var&lt;storage, read&gt;       b : array&lt;f32&gt;;
@group(0) @binding(2) var&lt;storage, read_write&gt; c : array&lt;f32&gt;;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3&lt;u32&gt;) {
    let i : u32 = gid.x;
    if (i &lt; arrayLength(&amp;c)) {
        c[i] = a[i] + b[i];
    }
}
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Declares three GPU storage buffers bound to <code>@group(0)</code>: input <code>a</code> and <code>b</code> are read-only (matching <code>GPUBufferUsage.STORAGE</code> with read access), output <code>c</code> is read_write. The host JS allocates these via <code>device.createBuffer({usage: STORAGE | COPY_DST})</code>. 2) <code>@compute @workgroup_size(64)</code> declares that each workgroup runs 64 threads in lockstep — this maps directly to a GPU's wavefront/warp (NVIDIA 32, AMD 64, Apple variable), so 64 is a safe portable choice. 3) <code>main</code> takes the built-in <code>global_invocation_id</code> — a vec3&lt;u32&gt; where x is the linear thread index across all workgroups; for a 1D vector add only .x matters. 4) Bounds check <code>i &lt; arrayLength(&c)</code> prevents OOB when the host dispatches more threads than array elements (always rounded up to workgroup size). 5) The actual work — <code>c[i] = a[i] + b[i]</code> — runs in parallel for every <code>i</code> simultaneously across thousands of GPU threads; for a 1M-element array, the host dispatches <code>ceil(1e6/64) = 15625</code> workgroups, finishing in ~50 microseconds on an M2 GPU vs ~3ms on a single CPU core.</p>

<p class="l-text">Real ML kernels (matmul, attention, layernorm) are this shape but bigger. Transformers.js, WebLLM, ONNX-Web all generate or hand-write WGSL kernels for hundreds of ops, then dispatch them in sequence to execute a transformer.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ONNXRuntime-Web — The General-Purpose Runtime</h2>
<p class="l-text"><strong>onnxruntime-web</strong> is Microsoft's browser port of ORT. Two execution providers: <strong>WASM</strong> (CPU, SIMD-accelerated, works everywhere) and <strong>WebGPU</strong> (GPU compute, requires WebGPU support). One JS API: <code>const session = await ort.InferenceSession.create("model.onnx", { executionProviders: ["webgpu", "wasm"] });</code>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">WASM EP</div><div class="card-body">Pure CPU. Multi-threaded with cross-origin isolation (COOP/COEP). 2–4 threads typical. Good for &lt;100M-param models.</div></div>
<div class="calc-card"><div class="card-title">WebGPU EP</div><div class="card-body">GPU-accelerated. 5–20x faster than WASM for big models. Required for real-time CV, ASR, and any LLM in the browser.</div></div>
<div class="calc-card"><div class="card-title">WebGL EP (legacy)</div><div class="card-body">Pre-WebGPU fallback. Slower, fewer ops supported. Mostly deprecated in favor of WebGPU + WASM.</div></div>
<div class="calc-card"><div class="card-title">When to use ORT-Web directly</div><div class="card-body">Custom ONNX models that aren't in Transformers.js's catalog. CV, classical ML, recommendation systems. Anything you exported yourself.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Transformers.js — HuggingFace in JavaScript</h2>
<p class="l-text">Transformers.js (Xenova / Joshua Lochner, 2023, now part of HuggingFace) brings the <code>transformers</code> Python API to JavaScript: same <code>pipeline()</code> abstraction, same model hub, but everything runs in-browser via ONNXRuntime-Web. Quietly the most-used browser ML library by 2026.</p>

<div class="code-wrap"><div class="code-label"><span>JAVASCRIPT (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// Run Whisper-Tiny in the browser to transcribe audio — no backend
import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@latest";

// Lazily downloads model from HF Hub (~75MB for whisper-tiny.en)
const transcriber = await pipeline(
  "automatic-speech-recognition",
  "Xenova/whisper-tiny.en",
  { device: "webgpu", dtype: "q4" }
);

// audio is a Float32Array @ 16kHz from getUserMedia or a fetched URL
const result = await transcriber(audio);
console.log(result.text);

// Same API for: text-classification, summarization, image-classification,
// feature-extraction, zero-shot-classification, image-to-text (CLIP),
// translation, fill-mask, object-detection, image-segmentation, ...
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>import { pipeline }</code> from the CDN-hosted Transformers.js bundle — no build step required; works in vanilla HTML pages. 2) <code>pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", ...)</code> downloads the ONNX-converted Whisper-tiny.en encoder + decoder (~75MB total for q4-quantized) from HuggingFace Hub on first call, caches it in IndexedDB + Cache API, and returns an async callable. 3) <code>device: "webgpu"</code> routes the matmuls and attention through onnxruntime-web's WebGPU EP — 5-10x faster than the WASM fallback for Whisper-Tiny. <code>dtype: "q4"</code> selects the INT4-quantized variant — smaller download, faster inference, near-identical WER on English. 4) <code>transcriber(audio)</code> takes a Float32Array at 16kHz (from <code>getUserMedia().getAudioTracks()</code> or <code>fetch().then(r=>r.arrayBuffer())</code>), runs the full encoder-decoder loop with greedy/beam decoding, and returns <code>{text, chunks}</code>. 5) The same <code>pipeline()</code> abstraction transparently handles 20+ tasks — swapping <code>"automatic-speech-recognition"</code> for <code>"image-classification"</code> or <code>"image-to-text"</code> just downloads a different model; the JS surface is identical, mirroring Python HF Transformers exactly.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Supported tasks (2026)</div><div class="card-body">All 20+ HF pipeline tasks. Text classification, NER, QA, summarization, translation, ASR (Whisper), TTS (small models), CLIP, depth estimation, object detection, segmentation, vision-language. ~600+ models on HF tagged "Transformers.js compatible".</div></div>
<div class="calc-card"><div class="card-title">Model sizes</div><div class="card-body">Most pipelines ship in 5–500MB. Bigger LLMs (Phi-3-mini ~2GB) load but are slow without WebGPU. Mobile browsers (iOS Safari) cap at ~1GB practically.</div></div>
<div class="calc-card"><div class="card-title">Quantization</div><div class="card-body"><code>{ dtype: "q4" }</code> uses INT4 weights when available; "q8" uses INT8; "fp16" uses half precision (WebGPU). Q4 is the default for LLMs.</div></div>
<div class="calc-card"><div class="card-title">Caching</div><div class="card-body">Models cache in browser storage (Cache API + IndexedDB). First load slow, subsequent loads instant. Use a service worker to pre-cache on install.</div></div>
</div>

<p class="l-text">Real demos shipping in 2026: Whisper-Web (Xenova's transcription page, 5M+ users), HuggingChat-Web (in-browser Llama 3.2 3B chat), browser-side resume parsers, real-time translation widgets, accessibility tools that caption video locally.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. WebLLM — LLM-Specialized Browser Runtime</h2>
<p class="l-text"><strong>WebLLM</strong> (MLC team, 2023; Tianqi Chen et al.) compiles LLMs via Apache TVM directly to WebGPU. Specialized for transformer LLMs only — not a general framework — but extracts more performance than Transformers.js for chat UX.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Performance</div><div class="card-body">7B Llama-class models at 10–30 tok/s on M2/M3 MacBooks via Safari WebGPU. 3B Phi-3-mini at 25–40 tok/s. Within ~50% of native llama.cpp.</div></div>
<div class="calc-card"><div class="card-title">Models supported</div><div class="card-body">Llama 3, Llama 3.2, Mistral, Phi-3, Gemma, Qwen 2.5, Hermes, RedPajama. Pre-converted MLC builds on the WebLLM model registry.</div></div>
<div class="calc-card"><div class="card-title">API</div><div class="card-body">OpenAI-compatible chat completions API. <code>const reply = await engine.chat.completions.create({ messages: [...] })</code>. Drop-in replacement for OpenAI in browser apps.</div></div>
<div class="calc-card"><div class="card-title">Use cases</div><div class="card-body">Privacy-first chat apps (Brave Browser ships Leo with WebLLM as fallback), in-browser code assistants, offline-capable companions. ChatGPT-style UIs that work in airplane mode.</div></div>
<div class="calc-card"><div class="card-title">Limits</div><div class="card-body">Cold-start model download is 1–4GB (hugged by browser cache). Mobile Safari has ~1GB WebGPU buffer limit — caps you at ~1.5B parameter models on iPhone.</div></div>
</div>

<div class="calc-highlight"><strong>Picking between Transformers.js and WebLLM:</strong> Transformers.js for everything-but-LLM (CV, ASR, embeddings) and small LLMs (&lt;1B). WebLLM for serious LLM chat. Some apps use both — Transformers.js for Whisper + a TTS model, WebLLM for the chat brain.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pyodide — Python ML in the Browser (and How This Site Works)</h2>
<p class="l-text"><strong>Pyodide</strong> compiles CPython to WebAssembly. The 2026 build includes NumPy, SciPy, scikit-learn, pandas, matplotlib, statsmodels, networkx, sympy, and ~200 other pure-Python packages. It is too slow for serving production ML, but it is excellent for tutorials, dashboards, calculators, and runnable docs — exactly what powers the RUN buttons throughout this very tutorial site.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Strengths</div><div class="card-body">Real Python in the browser. <code>pip install</code>-style package loading. NumPy ~30% native speed. Excellent for "show, don't just tell" educational content.</div></div>
<div class="calc-card"><div class="card-title">Weaknesses</div><div class="card-body">No PyTorch, no TensorFlow, no Transformers (the Python library — Transformers.js is a separate JS port). No CUDA. Cold start 2–8 seconds. ~150MB initial download.</div></div>
<div class="calc-card"><div class="card-title">When to use</div><div class="card-body">Educational content (this site!), Jupyter-like notebooks (JupyterLite), small data-analysis demos, calculators. NOT production inference.</div></div>
<div class="calc-card"><div class="card-title">Stable Diffusion / LLMs in Pyodide?</div><div class="card-body">No. Those need WebGPU compute and proper inference engines. Use WebLLM, Transformers.js, or onnxruntime-web for that.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Four Browser ML Traps</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trap 1 — Model size on mobile</div><div class="card-body">Mobile browsers cap memory aggressively. iOS Safari sometimes silently OOMs at ~1.5GB total page memory. Always test on a real iPhone, not just desktop. Prefer INT4 quantization and split-loading.</div></div>
<div class="calc-card"><div class="card-title">Trap 2 — COOP/COEP for SharedArrayBuffer</div><div class="card-body">Multi-threaded WASM (and WebGPU in some browsers) requires the page to be cross-origin isolated. Set <code>Cross-Origin-Opener-Policy: same-origin</code> and <code>Cross-Origin-Embedder-Policy: require-corp</code> headers, or things silently single-thread.</div></div>
<div class="calc-card"><div class="card-title">Trap 3 — Cold-start UX</div><div class="card-body">First load may be 30 seconds (download 1GB model). Show meaningful progress (download bytes / shader compilation / model load), use service worker pre-caching, and consider streaming inference (start showing text/audio mid-load if possible).</div></div>
<div class="calc-card"><div class="card-title">Trap 4 — WebGPU adapter not available</div><div class="card-body">~95% of modern browsers in 2026 have WebGPU, but some users (older Linux, Firefox Android, some virtualized envs) do not. Always feature-detect and fall back to WASM. Show a friendly "your browser does not support WebGPU; using slower CPU mode" message.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hands-On — A "Browser Inference" Loop in NumPy</h2>
<p class="l-text">A runnable NumPy proxy for what a WebGPU compute shader does. We perform a tiny matmul-relu-matmul (a 2-layer MLP) by manually batching elements, mimicking the workgroup model.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import time
np.random.seed(0)

# Pretend we have a WebGPU device and these are GPU buffers
batch, d_in, d_hidden, d_out = 32, 256, 512, 10
x  = np.random.randn(batch, d_in).astype(np.float32)
W1 = np.random.randn(d_in, d_hidden).astype(np.float32) * 0.05
W2 = np.random.randn(d_hidden, d_out).astype(np.float32) * 0.05

# --- Method 1: "naive WGSL-style" — element-wise loops with workgroup chunking
def gpu_matmul_relu_matmul(x, W1, W2, workgroup=64):
    # Layer 1: matmul + relu
    h = np.zeros((x.shape[0], W1.shape[1]), dtype=np.float32)
    for wg_start in range(0, h.shape[1], workgroup):
        wg_end = min(wg_start + workgroup, h.shape[1])
        # In WGSL each thread computes one (b, j) output cell
        for b in range(x.shape[0]):
            for j in range(wg_start, wg_end):
                acc = 0.0
                for k in range(x.shape[1]):
                    acc += x[b, k] * W1[k, j]
                h[b, j] = max(0.0, acc)
    # Layer 2
    out = h @ W2
    return out

# --- Method 2: native NumPy (what JIT'd WebGPU compiles down to in spirit)
def native(x, W1, W2):
    return np.maximum(x @ W1, 0.0) @ W2

t0 = time.perf_counter()
y_gpu = gpu_matmul_relu_matmul(x[:4], W1, W2)  # smaller batch for the slow loop
t1 = time.perf_counter()
y_native = native(x, W1, W2)
t2 = time.perf_counter()

print(f"WGSL-style loops (4 samples): {(t1-t0)*1000:.1f} ms")
print(f"Native NumPy   (32 samples):  {(t2-t1)*1000:.1f} ms")
print(f"Output shape (native): {y_native.shape}")
print(f"Sanity check (max diff first 4 samples): {np.max(np.abs(y_gpu - y_native[:4])):.4f}")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a 2-layer MLP topology (256 → 512 → 10) with batch=32 — small enough that even the naive nested-loop version finishes in seconds, large enough to show the WebGPU dispatch pattern. 2) <code>gpu_matmul_relu_matmul</code> mimics WGSL execution: the outer <code>workgroup</code> loop is what GPU runtime spawns as workgroups (64 outputs per group), the inner <code>(b, j)</code> nested loops are what each thread does — exactly the WGSL pattern <code>let i = gid.x; c[i] = sum(a[b, k] * W1[k, j])</code> from section 2. 3) <code>native()</code> is the production WebGPU equivalent — modern WebGPU runtimes (Transformers.js, WebLLM) generate fused matmul kernels that achieve >50% of NumPy/CuPy throughput by using tiled shared-memory matmul plus subgroup reductions. 4) Times both with <code>perf_counter</code> on a small subset for the slow version — typical ratio is 100-1000x because Python loops are interpreted while NumPy calls BLAS (OpenBLAS / Apple Accelerate). 5) The sanity check via <code>max(abs(y_gpu - y_native[:4]))</code> verifies floating-point equivalence — should be 0 or numerically tiny (<1e-5), proving the WGSL mental model and the BLAS path compute identical values; the gap is purely in how the work is scheduled across cores.</p>

<p class="l-text">The "WGSL-style loops" version is ~1000x slower than NumPy precisely because pure Python loops are slow — but the <em>structure</em> matches what a real WebGPU kernel does in WGSL: each thread computes one output element, the workgroup parameter controls how many threads run in lockstep. WebGPU just runs them all in parallel on the GPU.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Where Browser ML Goes from Here</h2>
<p class="l-text">The 2026 frontier:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">WebNN</div><div class="card-body">Browser API that gives direct access to NPUs (Apple Neural Engine, Hexagon HTP) the same way WebGPU exposes GPUs. Shipping in Edge / Chrome 2025–26. Will be 3–10x faster than WebGPU for INT8 transformer inference.</div></div>
<div class="calc-card"><div class="card-title">FP8 in WebGPU</div><div class="card-body">FP8 extension specs in progress; will halve memory for transformer weights vs FP16 with no quality loss.</div></div>
<div class="calc-card"><div class="card-title">Browser-side fine-tuning</div><div class="card-body">LoRA fine-tuning of small models in the browser using WebGPU compute. Means user-personalized models without ever sending data anywhere. WebLLM and Transformers.js both have early prototypes.</div></div>
<div class="calc-card"><div class="card-title">Native Streaming Voice</div><div class="card-body">A full Whisper + LLM + TTS pipeline running in the tab is the obvious next demo. The capstone (L8) builds exactly this on a Raspberry Pi but the same architecture maps to a browser tab in 2026.</div></div>
</div>
</div>`,
tr: `<p class="l-text"><strong>"Bir URL ziyaret et, 1B parametreli bir LLM çalıştır" 2022'de bilim kurguydu. 2026'da bir Salı.</strong> İki teknik kayma çarpışıp tarayıcı ML'ini gerçek hale getirdi: WebGPU (Mayıs 2023'te Chrome 113, Mart 2024'te Safari 17.4, 2024–25'te Firefox varsayılan olarak gönderildi), web sayfalarına yerel ile aynı throughput'ta compute shader erişimi verdi ve Transformers.js ekosistemi (Xenova, 2023) HuggingFace'in model hub'ını ONNXRuntime-Web aracılığıyla JavaScript'e getirdi. Eğitimler için WebLLM'i (MLC ekibinin TVM-tabanlı tarayıcı LLM runtime'ı) ve Pyodide'yi (WASM'da Python) ekleyin, ve tarayıcı meşru bir ML dağıtım hedefi olur — sıfır kurulum, hiç veri cihazdan çıkmaz ve URL olarak paylaşılabilir.</p>

<p class="l-text">Bu derste 2026'da tarayıcı ML'inin dört sütununu yürüyoruz: <strong>WebGPU</strong> compute substratı olarak (compute shader'ları, tensor op'ları, bellek modeli), <strong>ONNXRuntime-Web</strong> bytecode-format runtime olarak (CPU WASM + WebGPU EP), <strong>Transformers.js</strong> tarayıcıda <code>pipeline("automatic-speech-recognition")</code> yapmanıza izin veren HuggingFace-şekilli JS kütüphanesi olarak ve <strong>WebLLM</strong> 7B+ modelleri tam streaming ile çalıştıran LLM-özelleşmiş runtime olarak. Ayrıca "eğitimler ve demolar için tarayıcıda Python ML" için Pyodide'yi (ki tam olarak bu eğitim sitesini güçlendiren şeydir) ele alıyoruz. JS-eşdeğeri döngülerle bir WebGPU compute shader'ı taklit eden tarayıcıda çalıştırılabilir NumPy kodu ile bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir WebGPU compute-shader pipeline'ını okumak (WGSL, bind group'lar, dispatch)</li>
<li>Tarayıcıda BERT, Whisper, CLIP ve küçük LLM'leri çalıştırmak için Transformers.js kullanmak</li>
<li>Tarayıcı LLM uygulamaları için Transformers.js (HF-tarzı API) ile WebLLM (LLM-optimize) arasında seçim yapmak</li>
<li>WebGPU aracılığıyla M-serisi, Snapdragon, NVIDIA üzerinde tarayıcı ML throughput'unu tahmin etmek</li>
<li>Dört tarayıcı ML tuzağından kaçınmak: model boyutu, soğuk başlangıç, COOP/COEP, bellek limitleri</li>
<li>Backend olmadan çalıştırılabilir ML eğitimleri göndermek için Pyodide kullanmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Tarayıcı? Dağıtım, Gizlilik, Sıfır-Kurulum</h2>
<p class="l-text">Telefonlarda edge ML uygulama kurulumları, mağaza onayları ve platform başına derlemeler gerektirir. Tarayıcı üçünü de düzeltir: bir URL gönderin, kullanıcı çalışan bir ML özelliği görür, kurulum diyaloğu yok, uygulama mağazası incelemesi yok. Bu bir dağıtım süper gücüdür — ve cihaz-üstü çıkarım ile birleştiğinde, aynı zamanda bir gizlilik süper gücüdür (hiç ses/fotoğraf/metin sunucuya ulaşmaz).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dağıtım</div><div class="card-body">Bir demo URL'si denemek için her zaman bir uygulamayı yener. Whisper-Web (Xenova'nın transkripsiyon demosu), Stable Diffusion-Web (mlc.ai), Phi-3-WebGPU hepsi URL ile yayılır. Kurulum funnel'i yok.</div></div>
<div class="calc-card"><div class="card-title">Gizlilik</div><div class="card-body">WASM'da Whisper çalıştıran bir konuşmadan-metne sayfası asla ses göndermez. Tıbbi dikte, hukuki, gazeteci araçları için yararlı. "Verinizi görmüyoruz" vaadi devtools'tan kanıtlanabilir.</div></div>
<div class="calc-card"><div class="card-title">Cross-platform ücretsiz</div><div class="card-body">Aynı kod Mac, Windows, Linux, iPad (Safari WebGPU), Android'de (Chrome WebGPU) çalışır. Tek codebase, sıfır platform başına mühendislik.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Model indirildikten sonra, her kullanıcı çıkarımı sizin için ücretsizdir. Viral potansiyeli olan ücretsiz bir demo için, tarayıcı ML tek ekonomik yoldur.</div></div>
<div class="calc-card"><div class="card-title">Ödünleşimler</div><div class="card-body">İlk yükleme model indirme (50MB–4GB). Tarayıcı bellek üst sınırlarıyla sınırlı. Varsayılan olarak kalıcı state yok. WebGPU ek yükü ve FP16/INT8 sınırlamaları nedeniyle büyük modeller için yerelden 2–4x daha yavaş.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. WebGPU — Tarayıcıda Compute Shader'ları</h2>
<p class="l-text"><strong>WebGPU</strong>, WebGL'in modern halefidir, baştan genel amaçlı GPU compute (sadece render değil) için tasarlanmıştır. Shader dili <strong>WGSL</strong>'dir (WebGPU Shading Language), sözdizimsel olarak Rust'a benzer. Shader'lar host'un gerçek GPU/NPU'sunda çalışır; throughput yerel Vulkan / Metal / D3D12'nin %30–80'i içindedir, küçük batch'ler için düşük başlatma ek yükü nedeniyle genellikle CUDA'dan daha iyidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pipeline</div><div class="card-body">1. Bir GPU adapter ve device al. 2. Buffer'lar oluştur (giriş/çıkış tensor'ları). 3. WGSL compute shader'ı derle. 4. Bind group'ları kur (parametre bağlama). 5. Workgroup sayılarıyla dispatch et.</div></div>
<div class="calc-card"><div class="card-title">Workgroup'lar</div><div class="card-body">CUDA blokları gibi. <code>@workgroup_size(64)</code> grup başına 64 thread bildirir, 1D/2D/3D grid'de dispatch edilir. Paylaşılan bellek (<code>var&lt;workgroup&gt;</code>) bir grupta thread'lerin işbirliği yapmasına izin verir.</div></div>
<div class="calc-card"><div class="card-title">Tipler</div><div class="card-body">f32, f16 (uzantı; 2026'da yaygınca destekleniyor), i32, u32, vec4&lt;f32&gt;, mat4x4&lt;f32&gt;. Tensor'lar float buffer'lardır; yerel tensor tipi yok — CUDA ile aynı.</div></div>
<div class="calc-card"><div class="card-title">Limitler</div><div class="card-body">Tarayıcı/cihaza bağlı olarak maks buffer ~1–4GB. Workgroup başına maks compute invocation 256. Storage buffer sayısı 8–16. LLM ağırlıkları için birçok buffer'a bölersiniz ve stream edersiniz.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>WGSL (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// Bir WebGPU compute shader: element-wise vector add (a + b -&gt; c)
// (JS'den device.createComputePipeline / encoder.dispatchWorkgroups ile dispatch ederdiniz)

@group(0) @binding(0) var&lt;storage, read&gt;       a : array&lt;f32&gt;;
@group(0) @binding(1) var&lt;storage, read&gt;       b : array&lt;f32&gt;;
@group(0) @binding(2) var&lt;storage, read_write&gt; c : array&lt;f32&gt;;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3&lt;u32&gt;) {
    let i : u32 = gid.x;
    if (i &lt; arrayLength(&amp;c)) {
        c[i] = a[i] + b[i];
    }
}
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>@group(0)</code>'a bağlı üç GPU storage buffer'ı bildirir: input <code>a</code> ve <code>b</code> sadece-okuma (<code>GPUBufferUsage.STORAGE</code> ile okuma erişimine eşleşir), output <code>c</code> read_write'tır. Host JS bunları <code>device.createBuffer({usage: STORAGE | COPY_DST})</code> aracılığıyla tahsis eder. 2) <code>@compute @workgroup_size(64)</code>, her workgroup'un 64 thread'i lockstep'te çalıştırdığını bildirir — bu doğrudan bir GPU'nun wavefront/warp'una eşlenir (NVIDIA 32, AMD 64, Apple değişken), bu yüzden 64 güvenli taşınabilir bir seçimdir. 3) <code>main</code> built-in <code>global_invocation_id</code>'yi alır — tüm workgroup'lar boyunca x'in lineer thread indeksi olduğu bir vec3&lt;u32&gt;; 1D vector add için sadece .x önemlidir. 4) <code>i &lt; arrayLength(&c)</code> sınır kontrolü, host array elemanlarından daha fazla thread dispatch ettiğinde OOB'yi önler (her zaman workgroup boyutuna yuvarlanır). 5) Gerçek iş — <code>c[i] = a[i] + b[i]</code> — her <code>i</code> için aynı anda binlerce GPU thread'i boyunca paralel çalışır; 1M elemanlı array için host <code>ceil(1e6/64) = 15625</code> workgroup dispatch eder, M2 GPU'da ~50 mikrosaniyede biter, tek CPU çekirdeğinde ~3ms olur.</p>

<p class="l-text">Gerçek ML kernel'leri (matmul, attention, layernorm) bu şekildedir ama daha büyüktür. Transformers.js, WebLLM, ONNX-Web hepsi yüzlerce op için WGSL kernel'leri üretir veya el-yazar, sonra bir transformer'ı yürütmek için sırayla dispatch eder.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ONNXRuntime-Web — Genel Amaçlı Runtime</h2>
<p class="l-text"><strong>onnxruntime-web</strong>, Microsoft'un ORT'nin tarayıcı port'udur. İki execution provider: <strong>WASM</strong> (CPU, SIMD-hızlandırılmış, her yerde çalışır) ve <strong>WebGPU</strong> (GPU compute, WebGPU desteği gerektirir). Tek JS API: <code>const session = await ort.InferenceSession.create("model.onnx", { executionProviders: ["webgpu", "wasm"] });</code>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">WASM EP</div><div class="card-body">Saf CPU. Cross-origin isolation (COOP/COEP) ile çoklu thread. Tipik 2–4 thread. &lt;100M-param modeller için iyi.</div></div>
<div class="calc-card"><div class="card-title">WebGPU EP</div><div class="card-body">GPU-hızlandırılmış. Büyük modeller için WASM'dan 5–20x daha hızlı. Gerçek-zamanlı CV, ASR ve tarayıcıda herhangi bir LLM için gerekli.</div></div>
<div class="calc-card"><div class="card-title">WebGL EP (legacy)</div><div class="card-body">WebGPU öncesi fallback. Daha yavaş, daha az op desteklenir. WebGPU + WASM lehine çoğunlukla deprecated.</div></div>
<div class="calc-card"><div class="card-title">ORT-Web'i doğrudan ne zaman kullanmalı</div><div class="card-body">Transformers.js'in kataloğunda olmayan custom ONNX modelleri. CV, klasik ML, öneri sistemleri. Kendiniz export ettiğiniz herhangi bir şey.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Transformers.js — JavaScript'te HuggingFace</h2>
<p class="l-text">Transformers.js (Xenova / Joshua Lochner, 2023, şimdi HuggingFace'in parçası), <code>transformers</code> Python API'sini JavaScript'e getirir: aynı <code>pipeline()</code> soyutlaması, aynı model hub'ı, ama her şey ONNXRuntime-Web aracılığıyla in-browser çalışır. 2026'ya kadar sessizce en çok kullanılan tarayıcı ML kütüphanesi.</p>

<div class="code-wrap"><div class="code-label"><span>JAVASCRIPT (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// Whisper-Tiny'i tarayıcıda ses transkribe etmek için çalıştır — backend yok
import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@latest";

// HF Hub'dan modeli tembel olarak indirir (whisper-tiny.en için ~75MB)
const transcriber = await pipeline(
  "automatic-speech-recognition",
  "Xenova/whisper-tiny.en",
  { device: "webgpu", dtype: "q4" }
);

// audio, getUserMedia veya çekilen URL'den 16kHz Float32Array
const result = await transcriber(audio);
console.log(result.text);

// text-classification, summarization, image-classification için aynı API,
// feature-extraction, zero-shot-classification, image-to-text (CLIP),
// translation, fill-mask, object-detection, image-segmentation, ...
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) CDN-hosted Transformers.js bundle'dan <code>import { pipeline }</code> — build adımı gerekmez; vanilla HTML sayfalarında çalışır. 2) <code>pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", ...)</code>, ilk çağrıda HuggingFace Hub'dan ONNX-dönüştürülmüş Whisper-tiny.en encoder + decoder'ı (q4-quantize için toplam ~75MB) indirir, IndexedDB + Cache API'da cache'ler ve bir async callable döndürür. 3) <code>device: "webgpu"</code>, matmul'ları ve attention'ı onnxruntime-web'in WebGPU EP'i üzerinden yönlendirir — Whisper-Tiny için WASM fallback'inden 5-10x daha hızlı. <code>dtype: "q4"</code> INT4-quantize varyantını seçer — daha küçük indirme, daha hızlı çıkarım, İngilizce'de neredeyse aynı WER. 4) <code>transcriber(audio)</code>, 16kHz'de bir Float32Array alır (<code>getUserMedia().getAudioTracks()</code> veya <code>fetch().then(r=>r.arrayBuffer())</code>'dan), greedy/beam decoding ile tam encoder-decoder döngüsünü çalıştırır ve <code>{text, chunks}</code> döndürür. 5) Aynı <code>pipeline()</code> soyutlaması 20+ görevi şeffaf şekilde idare eder — <code>"automatic-speech-recognition"</code>'u <code>"image-classification"</code> veya <code>"image-to-text"</code> ile değiştirmek sadece farklı bir model indirir; JS yüzeyi aynıdır, Python HF Transformers'ı tam olarak yansıtır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Desteklenen görevler (2026)</div><div class="card-body">Tüm 20+ HF pipeline görevi. Metin sınıflandırma, NER, QA, özetleme, çeviri, ASR (Whisper), TTS (küçük modeller), CLIP, derinlik tahmini, nesne tespiti, segmentasyon, vision-language. HF'te "Transformers.js compatible" etiketli ~600+ model.</div></div>
<div class="calc-card"><div class="card-title">Model boyutları</div><div class="card-body">Çoğu pipeline 5–500MB'da gönderilir. Daha büyük LLM'ler (Phi-3-mini ~2GB) yüklenir ama WebGPU olmadan yavaştır. Mobil tarayıcılar (iOS Safari) pratik olarak ~1GB'da sınırlanır.</div></div>
<div class="calc-card"><div class="card-title">Quantization</div><div class="card-body"><code>{ dtype: "q4" }</code> mevcut olduğunda INT4 ağırlıkları kullanır; "q8" INT8 kullanır; "fp16" yarı hassasiyet kullanır (WebGPU). Q4, LLM'ler için varsayılandır.</div></div>
<div class="calc-card"><div class="card-title">Caching</div><div class="card-body">Modeller tarayıcı depolamasında cache'lenir (Cache API + IndexedDB). İlk yükleme yavaş, sonraki yüklemeler anında. Yüklemede pre-cache için bir service worker kullanın.</div></div>
</div>

<p class="l-text">2026'da gönderilen gerçek demolar: Whisper-Web (Xenova'nın transkripsiyon sayfası, 5M+ kullanıcı), HuggingChat-Web (in-browser Llama 3.2 3B sohbet), tarayıcı tarafı özgeçmiş ayrıştırıcılar, gerçek-zamanlı çeviri widget'ları, video'yu yerel olarak alt yazılayan erişilebilirlik araçları.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. WebLLM — LLM-Özelleşmiş Tarayıcı Runtime'ı</h2>
<p class="l-text"><strong>WebLLM</strong> (MLC ekibi, 2023; Tianqi Chen ve diğ.), LLM'leri Apache TVM aracılığıyla doğrudan WebGPU'ya derler. Sadece transformer LLM'leri için özelleşmiş — genel framework değil — ama sohbet UX için Transformers.js'ten daha fazla performans çıkarır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Performans</div><div class="card-body">Safari WebGPU aracılığıyla M2/M3 MacBook'larda 7B Llama-sınıfı modeller 10–30 tok/s'de. 3B Phi-3-mini 25–40 tok/s'de. Yerel llama.cpp'nin ~%50'si içinde.</div></div>
<div class="calc-card"><div class="card-title">Desteklenen modeller</div><div class="card-body">Llama 3, Llama 3.2, Mistral, Phi-3, Gemma, Qwen 2.5, Hermes, RedPajama. WebLLM model registry'sinde önceden dönüştürülmüş MLC build'ler.</div></div>
<div class="calc-card"><div class="card-title">API</div><div class="card-body">OpenAI-uyumlu chat completions API. <code>const reply = await engine.chat.completions.create({ messages: [...] })</code>. Tarayıcı uygulamalarında OpenAI için drop-in replacement.</div></div>
<div class="calc-card"><div class="card-title">Kullanım alanları</div><div class="card-body">Gizlilik-öncelikli sohbet uygulamaları (Brave Browser, Leo'yu fallback olarak WebLLM ile gönderir), in-browser kod asistanları, offline-yetenekli arkadaşlar. Uçak modunda çalışan ChatGPT-tarzı UI'lar.</div></div>
<div class="calc-card"><div class="card-title">Limitler</div><div class="card-body">Cold-start model indirme 1–4GB (tarayıcı cache'i tarafından sarılır). Mobile Safari ~1GB WebGPU buffer limitine sahiptir — sizi iPhone'da ~1.5B parametre modellerine sınırlar.</div></div>
</div>

<div class="calc-highlight"><strong>Transformers.js ve WebLLM arasında seçim:</strong> her şey-ama-LLM için Transformers.js (CV, ASR, embedding'ler) ve küçük LLM'ler (&lt;1B). Ciddi LLM sohbeti için WebLLM. Bazı uygulamalar her ikisini kullanır — Whisper + bir TTS modeli için Transformers.js, sohbet beyni için WebLLM.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pyodide — Tarayıcıda Python ML (ve Bu Site Nasıl Çalışıyor)</h2>
<p class="l-text"><strong>Pyodide</strong>, CPython'u WebAssembly'ye derler. 2026 build'i NumPy, SciPy, scikit-learn, pandas, matplotlib, statsmodels, networkx, sympy ve ~200 diğer saf-Python paketini içerir. Üretim ML servisi için çok yavaştır, ama eğitimler, dashboard'lar, hesap makineleri ve çalıştırılabilir doc'lar için mükemmeldir — tam olarak bu eğitim sitesindeki RUN düğmelerini güçlendiren şey.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Güçlü yanlar</div><div class="card-body">Tarayıcıda gerçek Python. <code>pip install</code>-tarzı paket yükleme. NumPy ~%30 yerel hızda. "Sadece anlatma, göster" eğitim içeriği için mükemmel.</div></div>
<div class="calc-card"><div class="card-title">Zayıf yanlar</div><div class="card-body">PyTorch yok, TensorFlow yok, Transformers (Python kütüphanesi — Transformers.js ayrı bir JS port'tür) yok. CUDA yok. Soğuk başlangıç 2–8 saniye. ~150MB başlangıç indirmesi.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kullanılır</div><div class="card-body">Eğitim içeriği (bu site!), Jupyter-benzeri notebook'lar (JupyterLite), küçük veri-analizi demoları, hesap makineleri. Üretim çıkarımı DEĞİL.</div></div>
<div class="calc-card"><div class="card-title">Pyodide'da Stable Diffusion / LLM'ler?</div><div class="card-body">Hayır. Bunlar WebGPU compute ve uygun çıkarım motorları gerektirir. Bunun için WebLLM, Transformers.js veya onnxruntime-web kullanın.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Dört Tarayıcı ML Tuzağı</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tuzak 1 — Mobilde model boyutu</div><div class="card-body">Mobil tarayıcılar belleği agresif şekilde sınırlar. iOS Safari bazen ~1.5GB toplam sayfa belleğinde sessizce OOM olur. Sadece masaüstünde değil, gerçek bir iPhone'da her zaman test edin. INT4 quantization ve split-loading'i tercih edin.</div></div>
<div class="calc-card"><div class="card-title">Tuzak 2 — SharedArrayBuffer için COOP/COEP</div><div class="card-body">Çok thread'li WASM (ve bazı tarayıcılarda WebGPU), sayfanın cross-origin isolated olmasını gerektirir. <code>Cross-Origin-Opener-Policy: same-origin</code> ve <code>Cross-Origin-Embedder-Policy: require-corp</code> header'larını ayarlayın, yoksa şeyler sessizce tek-thread olur.</div></div>
<div class="calc-card"><div class="card-title">Tuzak 3 — Cold-start UX</div><div class="card-body">İlk yükleme 30 saniye olabilir (1GB model indir). Anlamlı ilerleme gösterin (indirme byte / shader derleme / model yükleme), service worker pre-caching kullanın ve streaming çıkarımı düşünün (mümkünse yükleme ortasında metin/ses göstermeye başlayın).</div></div>
<div class="calc-card"><div class="card-title">Tuzak 4 — WebGPU adapter mevcut değil</div><div class="card-body">2026'daki modern tarayıcıların ~%95'inde WebGPU vardır, ama bazı kullanıcılarda (eski Linux, Firefox Android, bazı sanallaştırılmış env'ler) yoktur. Her zaman feature-detect edin ve WASM'a geri düşün. Dostça bir "tarayıcınız WebGPU'yu desteklemiyor; daha yavaş CPU modu kullanılıyor" mesajı gösterin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Pratik — NumPy'da Bir "Tarayıcı Çıkarımı" Döngüsü</h2>
<p class="l-text">Bir WebGPU compute shader'ının yaptığının çalıştırılabilir bir NumPy proxy'si. Workgroup modelini taklit ederek elemanları manuel batch'leyerek küçük bir matmul-relu-matmul (2 katmanlı MLP) yapıyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import time
np.random.seed(0)

# Bir WebGPU device'ımız olduğunu varsayalım ve bunlar GPU buffer'ları
batch, d_in, d_hidden, d_out = 32, 256, 512, 10
x  = np.random.randn(batch, d_in).astype(np.float32)
W1 = np.random.randn(d_in, d_hidden).astype(np.float32) * 0.05
W2 = np.random.randn(d_hidden, d_out).astype(np.float32) * 0.05

# --- Yöntem 1: "naif WGSL-tarzı" — workgroup chunking'li element-wise döngüler
def gpu_matmul_relu_matmul(x, W1, W2, workgroup=64):
    # Katman 1: matmul + relu
    h = np.zeros((x.shape[0], W1.shape[1]), dtype=np.float32)
    for wg_start in range(0, h.shape[1], workgroup):
        wg_end = min(wg_start + workgroup, h.shape[1])
        # WGSL'de her thread bir (b, j) çıktı hücresi hesaplar
        for b in range(x.shape[0]):
            for j in range(wg_start, wg_end):
                acc = 0.0
                for k in range(x.shape[1]):
                    acc += x[b, k] * W1[k, j]
                h[b, j] = max(0.0, acc)
    # Katman 2
    out = h @ W2
    return out

# --- Yöntem 2: yerel NumPy (JIT'lenmiş WebGPU'nun ruh olarak indiği şey)
def native(x, W1, W2):
    return np.maximum(x @ W1, 0.0) @ W2

t0 = time.perf_counter()
y_gpu = gpu_matmul_relu_matmul(x[:4], W1, W2)  # yavaş döngü için daha küçük batch
t1 = time.perf_counter()
y_native = native(x, W1, W2)
t2 = time.perf_counter()

print(f"WGSL-style loops (4 samples): {(t1-t0)*1000:.1f} ms")
print(f"Native NumPy   (32 samples):  {(t2-t1)*1000:.1f} ms")
print(f"Output shape (native): {y_native.shape}")
print(f"Sanity check (max diff first 4 samples): {np.max(np.abs(y_gpu - y_native[:4])):.4f}")
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 2-katmanlı MLP topolojisi (256 → 512 → 10) batch=32 ile tanımlar — naif nested-loop versiyonun bile saniyelerde bittiği kadar küçük, WebGPU dispatch desenini göstermek için yeterince büyük. 2) <code>gpu_matmul_relu_matmul</code>, WGSL yürütmesini taklit eder: dış <code>workgroup</code> döngüsü GPU runtime'ının workgroup olarak spawn ettiği şeydir (grup başına 64 çıktı), iç <code>(b, j)</code> nested döngüler her thread'in yaptığı şeydir — tam olarak bölüm 2'deki WGSL deseni <code>let i = gid.x; c[i] = sum(a[b, k] * W1[k, j])</code>. 3) <code>native()</code> üretim WebGPU eşdeğeridir — modern WebGPU runtime'ları (Transformers.js, WebLLM) tiled shared-memory matmul artı subgroup reduction kullanarak NumPy/CuPy throughput'unun >%50'sini başaran fused matmul kernel'leri üretir. 4) Yavaş versiyon için küçük bir alt küme üzerinde <code>perf_counter</code> ile ikisini de zaman ölçer — tipik oran 100-1000x çünkü Python döngüleri yorumlanır, NumPy ise BLAS (OpenBLAS / Apple Accelerate) çağırır. 5) <code>max(abs(y_gpu - y_native[:4]))</code> aracılığıyla sanity check, floating-point eşdeğerliği doğrular — 0 veya sayısal olarak küçük olmalı (<1e-5), WGSL zihinsel modeli ile BLAS yolunun aynı değerleri hesapladığını kanıtlar; boşluk tamamen işin çekirdekler arasında nasıl programlandığındadır.</p>

<p class="l-text">"WGSL-tarzı döngüler" versiyonu NumPy'dan ~1000x daha yavaştır çünkü saf Python döngüleri yavaştır — ama <em>yapı</em> gerçek bir WebGPU kernel'inin WGSL'de yaptığıyla eşleşir: her thread bir çıktı elemanı hesaplar, workgroup parametresi kaç thread'in lockstep çalışacağını kontrol eder. WebGPU sadece hepsini GPU üzerinde paralel çalıştırır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tarayıcı ML Bundan Sonra Nereye Gidiyor</h2>
<p class="l-text">2026 sınırı:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">WebNN</div><div class="card-body">WebGPU'nun GPU'ları açığa çıkardığı gibi, NPU'lara (Apple Neural Engine, Hexagon HTP) doğrudan erişim veren tarayıcı API'si. Edge / Chrome'da 2025–26'da gönderilir. INT8 transformer çıkarımı için WebGPU'dan 3–10x daha hızlı olacak.</div></div>
<div class="calc-card"><div class="card-title">WebGPU'da FP8</div><div class="card-body">FP8 uzantı specs sürüyor; FP16'ya karşı kalite kaybı olmadan transformer ağırlıkları için belleği yarıya indirecek.</div></div>
<div class="calc-card"><div class="card-title">Tarayıcı tarafı fine-tuning</div><div class="card-body">WebGPU compute kullanarak tarayıcıda küçük modellerin LoRA fine-tuning'i. Veriyi hiç göndermeden kullanıcı-kişiselleştirilmiş modeller demektir. WebLLM ve Transformers.js her ikisi de erken prototiplere sahip.</div></div>
<div class="calc-card"><div class="card-title">Yerel Streaming Ses</div><div class="card-body">Tab'da çalışan tam Whisper + LLM + TTS pipeline'ı bariz sonraki demodur. Capstone (L8) tam olarak bunu Raspberry Pi'de inşa eder ama aynı mimari 2026'da bir tarayıcı tab'ına eşlenir.</div></div>
</div>
</div>`
};
