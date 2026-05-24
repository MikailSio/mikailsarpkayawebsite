window.EDGE_L6 = {
en: `<p class="l-text"><strong>The phone is the most important computer for ML inference in 2026.</strong> There are 4.6 billion smartphones in active use, every one with a dedicated NPU averaging 8–38 TOPS, and Apple's iOS 18 / Google's Android 15 both ship with system-level on-device LLMs (Apple Intelligence, Gemini Nano). For the developer, this means two distinct toolchains: CoreML on iOS (Apple Neural Engine, Metal GPU, CPU), and TFLite on Android (NNAPI → Hexagon DSP, Tensor TPU, GPU, CPU). They look similar from a distance, diverge sharply when you start hitting performance walls.</p>

<p class="l-text">In this lesson we walk both stacks end-to-end. iOS first: <code>coremltools</code> conversion, the CoreML compute units (CPU, GPU, Neural Engine), benchmarking with Xcode Instruments, and the new stateful-models API for on-device LLMs. Android second: the TFLite converter, NNAPI delegate hierarchy, Qualcomm's QNN SDK for direct Hexagon access, Google Tensor's Edge TPU, MediaPipe Tasks for prebuilt pipelines. We close with a NumPy benchmark proxy that simulates the latency-vs-accuracy tradeoffs you actually face on phones, and concrete 2026 numbers from real devices (iPhone 15 Pro, Pixel 9 Pro, Galaxy S24 Ultra).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Convert PyTorch / ONNX / TF models to CoreML and TFLite, and pick the right compute unit</li>
<li>Profile on-device latency with Xcode Instruments and Android GPU Inspector</li>
<li>Estimate throughput on Apple Neural Engine (38 TOPS), Hexagon HTP (45 TOPS on Snapdragon 8 Gen 3), Tensor G4 TPU (~13 TOPS)</li>
<li>Use MediaPipe Tasks to ship CV/ASR features in days, not weeks</li>
<li>Apply CoreML stateful models for on-device LLM KV cache</li>
<li>Avoid the four most common mobile-deployment performance traps</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The 2026 Mobile Hardware Lineup</h2>
<p class="l-text">Every flagship phone in 2026 has three distinct compute units that ML workloads can target. Knowing which one to use, and how the runtime routes ops, is the entire game.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Apple Silicon (iPhone 15/16 Pro, M-series Macs/iPads)</div><div class="card-body">CPU (high-perf cores, 4 + 4-cluster), GPU (Metal, ~5 TFLOPS FP16 on iPhone 15 Pro), <strong>Apple Neural Engine</strong> (38 TOPS INT8, INT16). ANE is fast, low-power, and only accessible via CoreML — no third-party API.</div></div>
<div class="calc-card"><div class="card-title">Qualcomm Snapdragon 8 Gen 3 / X Elite</div><div class="card-body">Adreno GPU, <strong>Hexagon DSP/HTP</strong> (45 TOPS INT8 on 8 Gen 3, 75 TOPS on Snapdragon X Elite). Accessible via TFLite NNAPI or directly via QNN SDK.</div></div>
<div class="calc-card"><div class="card-title">Google Tensor G3/G4 (Pixel 8/9 Pro)</div><div class="card-body">Google Edge TPU (~13 TOPS) co-designed with Google's models. Optimized for INT8 quantized transformers. Accessible via TFLite + NNAPI; Gemini Nano runs here on Pixel 9.</div></div>
<div class="calc-card"><div class="card-title">MediaTek Dimensity 9300+ APU</div><div class="card-body">Up to 33 TOPS, NPU optimized for generative AI. Used in Vivo / Oppo / Xiaomi flagships. Targeted via TFLite + MediaTek's NeuroPilot SDK.</div></div>
</div>

<div class="calc-highlight"><strong>Key fact:</strong> in 2026 a flagship phone NPU has more INT8 throughput than a 2020 NVIDIA T4 datacenter GPU. The reason "AI on phone" works is exactly this hardware crossover.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. iOS — CoreML and the Apple Neural Engine</h2>
<p class="l-text"><strong>CoreML</strong> is Apple's on-device ML framework, mandatory if you want ANE access. It accepts inputs from PyTorch (via <code>coremltools</code>), TensorFlow, ONNX, and now stateful PyTorch models (for KV-cached LLMs). The output is an <code>.mlpackage</code> bundle that ships inside your app.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Convert a PyTorch model to CoreML, target Apple Neural Engine
import torch
import coremltools as ct

class MobileNet(torch.nn.Module):
    def __init__(self):
        super().__init__()
        from torchvision.models import mobilenet_v3_small
        self.m = mobilenet_v3_small(num_classes=1000)
    def forward(self, x):
        return self.m(x)

model = MobileNet().eval()
example = torch.randn(1, 3, 224, 224)
traced = torch.jit.trace(model, example)

mlmodel = ct.convert(
    traced,
    inputs=[ct.ImageType(shape=example.shape, scale=1/255.0, bias=[0,0,0])],
    compute_units=ct.ComputeUnit.CPU_AND_NE,  # prefer ANE, fall back to CPU
    minimum_deployment_target=ct.target.iOS17,
    compute_precision=ct.precision.FLOAT16,   # FP16 on ANE
)

# Quantize to INT8 (palettization or linear)
mlmodel = ct.optimize.coreml.linear_quantize_weights(mlmodel, mode="linear_symmetric")
mlmodel.save("MobileNet.mlpackage")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Wraps torchvision's MobileNetV3-Small (~2.5M params) in an nn.Module — a canonical ANE target since it has only standard ops (Conv, BN, ReLU, Linear). 2) <code>torch.jit.trace</code> on a 1x3x224x224 example records the forward pass into a TorchScript graph — required input format for coremltools' older converter path. 3) <code>ct.convert</code> with <code>ImageType(scale=1/255.0)</code> bakes the normalization INTO the model so the iOS app can feed raw CGImage bytes — the runtime applies the scale before the first Conv. 4) <code>compute_units=CPU_AND_NE</code> tells CoreML to prefer Apple Neural Engine and fall back to CPU on unsupported ops (no GPU); <code>compute_precision=FLOAT16</code> matches ANE's native datatype — using FP32 would force CPU fallback. <code>minimum_deployment_target=iOS17</code> unlocks the modern ML Program format. 5) <code>linear_quantize_weights(mode="linear_symmetric")</code> performs per-channel symmetric INT8 PTQ on the weights — activations stay FP16 on ANE. Saved as <code>.mlpackage</code> (a directory bundle), ready to drop into Xcode and link via <code>MLModel(contentsOf:)</code> for ~1.2ms inference on iPhone 15 Pro ANE.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Compute units</div><div class="card-body"><code>ALL</code> (default — CoreML routes per-op), <code>CPU_ONLY</code>, <code>CPU_AND_GPU</code>, <code>CPU_AND_NE</code>. ANE is fastest for supported ops but does not handle dynamic shapes or rare ops; the runtime silently falls back.</div></div>
<div class="calc-card"><div class="card-title">Quantization</div><div class="card-body">Palettization (clustered weights, very small), linear (per-channel INT8), pruning. ANE supports FP16, INT8 (since iOS 17), and INT4 (since iOS 18). LLM weights typically ship as INT4 palettized.</div></div>
<div class="calc-card"><div class="card-title">Stateful models (iOS 18+)</div><div class="card-body">Models can declare KV-cache tensors as state, eliminating the need to re-input the cache every call. Critical for on-device LLMs — Apple Intelligence's 3B foundation model uses this.</div></div>
<div class="calc-card"><div class="card-title">Profiling</div><div class="card-body">Xcode Instruments → CoreML ML template → see per-op latency, compute unit assignment, ANE utilization. The first thing to check when "my model is slow on iPhone".</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Android — TFLite, NNAPI, and the Hardware Hierarchy</h2>
<p class="l-text">On Android, <strong>TensorFlow Lite</strong> is the universal runtime; <strong>NNAPI</strong> (Neural Networks API) is the OS-level abstraction that routes ops to vendor accelerators (Hexagon, Tensor TPU, MediaTek APU). Sometimes you skip NNAPI and call vendor SDKs directly for max performance.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TFLite Interpreter (CPU)</div><div class="card-body">Pure C++ runtime, ARM NEON optimized. Always works as fallback. Good for small models or non-quantized FP32.</div></div>
<div class="calc-card"><div class="card-title">TFLite GPU Delegate</div><div class="card-body">OpenCL / OpenGL / Vulkan compute. Good for FP16/FP32 CV models. Doesn't always beat NPU for INT8.</div></div>
<div class="calc-card"><div class="card-title">TFLite NNAPI Delegate</div><div class="card-body">Asks Android to route ops. NNAPI calls vendor HAL → Hexagon (Qualcomm), Tensor TPU (Google), APU (MediaTek). Performance depends entirely on vendor support quality.</div></div>
<div class="calc-card"><div class="card-title">Qualcomm QNN SDK (direct)</div><div class="card-body">Skip NNAPI, talk directly to Hexagon HTP. 1.5–3x faster than NNAPI in 2024 for INT8 LLMs (vendor optimizations not yet in NNAPI). What Llama.cpp's QNN backend uses for Snapdragon X Elite.</div></div>
<div class="calc-card"><div class="card-title">Google AICore (Pixel-only)</div><div class="card-body">System service that hosts Gemini Nano. App SDKs request inference via the AICore API; the system handles model loading, quantization, isolation. Replaces direct TFLite for first-party LLM use.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Convert TF / ONNX -&gt; TFLite (INT8 with calibration)
import tensorflow as tf

# Assume a saved TF model
converter = tf.lite.TFLiteConverter.from_saved_model("./mobilenet_savedmodel")
converter.optimizations = [tf.lite.Optimize.DEFAULT]

def representative_dataset():
    for _ in range(128):
        yield [tf.random.normal((1, 224, 224, 3)).numpy()]
converter.representative_dataset = representative_dataset
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter.inference_input_type  = tf.int8
converter.inference_output_type = tf.int8

tflite_model = converter.convert()
with open("mobilenet_int8.tflite", "wb") as f:
    f.write(tflite_model)

# Use on Android: load via Interpreter, attach NNAPI delegate
# Java/Kotlin side:
#   Interpreter.Options opts = new Interpreter.Options();
#   opts.setUseNNAPI(true);  // route to NPU when supported
#   Interpreter tf = new Interpreter(modelBuffer, opts);
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads a TF SavedModel directory via <code>TFLiteConverter.from_saved_model</code> — handles either Keras .h5 or pure TF SavedModel format; <code>tf2onnx</code> is the path for ONNX-source models. 2) Enables <code>Optimize.DEFAULT</code> which performs dynamic-range quantization by default — for full-integer we need more. 3) Supplies a <code>representative_dataset</code> generator yielding 128 random 224x224x3 batches — these calibration samples let TFLite observe activation distributions and pick per-tensor min/max for the INT8 activation scales (in production: 100-1000 samples from your actual data distribution). 4) Forces <code>TFLITE_BUILTINS_INT8</code> and sets <code>inference_input_type=tf.int8</code>/<code>inference_output_type=tf.int8</code> — without this, inputs/outputs stay FP32 and the runtime inserts dequantize/quantize ops on the boundary, hurting NPU latency. 5) Writes the .tflite FlatBuffer — on the Android side, Java code creates an Interpreter with <code>setUseNNAPI(true)</code> which routes ops to Hexagon HTP (Qualcomm), Tensor TPU (Google), or APU (MediaTek) depending on the SoC. Same .tflite file, different accelerator chosen at runtime by NNAPI.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Real Numbers — 2026 Mobile Benchmarks</h2>
<p class="l-text">Numbers from production deployments and MLPerf Mobile 4.0 (Q1 2026), rounded for readability. Use these as planning anchors.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MobileNetV3-Small INT8 (image classification)</div><div class="card-body">iPhone 15 Pro ANE: 1.2ms. Pixel 9 Pro Tensor TPU: 1.5ms. Galaxy S24 Hexagon: 1.0ms. CPU-only fallback: 8–15ms. ~1000x real-time at 30fps.</div></div>
<div class="calc-card"><div class="card-title">YOLOv8-n INT8 (object detection 640×640)</div><div class="card-body">iPhone 15 Pro ANE: 8ms. Pixel 9 Pro: 12ms. Snapdragon X Elite QNN: 5ms. CPU: 40–80ms. Real-time at 30fps with margin.</div></div>
<div class="calc-card"><div class="card-title">Whisper-Tiny INT8 (ASR, 5s audio)</div><div class="card-body">iPhone 15 Pro ANE: 80ms. Pixel 9 Pro: 110ms. CPU only: 350ms. Streaming variants achieve 50–80ms first-chunk latency.</div></div>
<div class="calc-card"><div class="card-title">Phi-3-mini INT4 (3.8B LLM, 30 tokens)</div><div class="card-body">iPhone 15 Pro: 30 tok/s decode (1s for 30 tokens), prefill 200 tok/s. Snapdragon X Elite: ~25 tok/s decode. Pixel 9 Pro Gemini Nano (2B): ~15 tok/s.</div></div>
<div class="calc-card"><div class="card-title">Gemma 2 2B INT4</div><div class="card-body">iPhone 15 Pro: 35 tok/s. Galaxy S24 (8 Gen 3) QNN: 30 tok/s. Pixel 9 Pro: 22 tok/s. Reasonable chat experience on all flagships.</div></div>
<div class="calc-card"><div class="card-title">Stable Diffusion 1.5 (512×512, 20 steps)</div><div class="card-body">iPhone 15 Pro: ~10s end-to-end (Apple's Core ML port). Snapdragon X Elite: ~7s (vendor-tuned). Heavy thermal throttle after 3+ generations.</div></div>
</div>

<p class="l-text">Two patterns to internalize: (1) NPUs beat GPUs by 3–10x for INT8, (2) thermal throttling is real — back-to-back inference for 30+ seconds drops perf 30–50% as the chip heats up.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. MediaPipe Tasks — Pre-Built Pipelines</h2>
<p class="l-text">For 80% of mobile ML use cases, you do not need to convert your own model. <strong>MediaPipe Tasks</strong> (Google, evolved from MediaPipe Solutions) provides production-ready, on-device pipelines for face detection, hand landmarks, pose, segmentation, OCR, audio classification, image classification, gesture recognition, and now LLM inference (MediaPipe LLM Inference API). Wrapped for iOS, Android, JavaScript, and Python; runs the same TFLite/CoreML models underneath.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vision tasks</div><div class="card-body">FaceLandmarker (478 landmarks, 30fps), HandLandmarker (21×2 keypoints), PoseLandmarker, ImageSegmenter, GestureRecognizer, ObjectDetector. All ~1–10ms on flagships.</div></div>
<div class="calc-card"><div class="card-title">Audio tasks</div><div class="card-body">AudioClassifier (YAMNet wrapper), AudioEmbedder. Real-time spectrogram-based classification.</div></div>
<div class="calc-card"><div class="card-title">Text tasks</div><div class="card-body">TextClassifier, TextEmbedder, LanguageDetector. CPU-only, fast.</div></div>
<div class="calc-card"><div class="card-title">LLM Inference API (2024+)</div><div class="card-body">On-device Gemma 2B, Phi-3, Llama 3.2 1B/3B. Used by Pixel apps and growing third-party adoption. Cross-platform: same API on Android/iOS/Web.</div></div>
</div>

<div class="calc-highlight"><strong>Default rule:</strong> if MediaPipe Tasks has what you need, use it. The savings in deployment, optimization, and maintenance pay for themselves many times over. Roll your own only when MediaPipe lacks the model or you need custom output formats.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Four Performance Traps to Avoid</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trap 1 — Falling off the NPU silently</div><div class="card-body">A single unsupported op (custom activation, dynamic-shape Resize, exotic Conv) can cause CoreML or NNAPI to push the entire model back to CPU. Always profile after conversion. Use Netron to inspect the model graph and check for "ALL" → "CPU only" warnings.</div></div>
<div class="calc-card"><div class="card-title">Trap 2 — Forgetting to quantize</div><div class="card-body">FP32 → INT8 is not optional on phones; it is 4–10x speed and 4x size. Many tutorials show FP32 conversions; in production you always quantize.</div></div>
<div class="calc-card"><div class="card-title">Trap 3 — Cold-start latency</div><div class="card-body">Loading a 2GB CoreML model can take 1–3 seconds the first time (compilation for ANE). Pre-load on app launch, not on first user action. Apple ships <code>compileModel</code> warmup APIs for this.</div></div>
<div class="calc-card"><div class="card-title">Trap 4 — Not measuring battery</div><div class="card-body">A model running at 60fps on the GPU drains the battery 3x faster than the same model on the NPU. Always benchmark Wh/inference, not just ms/inference. Apple Instruments and Android Battery Historian both expose this.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hands-On — A Latency-Accuracy Tradeoff Curve</h2>
<p class="l-text">Real mobile deployment is a Pareto front: you can always go faster by going smaller / lower-precision, at some accuracy cost. Build the curve in NumPy by simulating quantization on a sklearn classifier and measuring throughput vs accuracy.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import time
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

# "Big" FP32 model
clf = LogisticRegression(max_iter=500).fit(Xtr, ytr)
W_fp32 = clf.coef_.astype(np.float32)
b_fp32 = clf.intercept_.astype(np.float32)

def quantize(W, bits):
    if bits &gt;= 32: return W.copy(), 1.0
    levels = 2**(bits-1) - 1
    s = np.max(np.abs(W)) / levels
    Wq = np.round(W / s).clip(-levels, levels).astype(np.int32)
    return Wq.astype(np.float32) * s, s

def softmax(z):
    e = np.exp(z - z.max(-1, keepdims=True))
    return e / e.sum(-1, keepdims=True)

def predict(Xt, W, b):
    return np.argmax(softmax(Xt @ W.T + b), axis=1)

results = []
for bits in [32, 16, 8, 4, 2]:
    Wq, _ = quantize(W_fp32, bits)
    # Simulate "throughput" — smaller bits = more ops/sec on real INT kernels
    speedup_factor = max(1.0, 32 / bits)
    # Time the prediction (loops to amplify the measurement)
    t0 = time.perf_counter()
    for _ in range(1000):
        yp = predict(Xte, Wq, b_fp32)
    t1 = time.perf_counter()
    sim_throughput = 1000 / (t1 - t0) * speedup_factor
    acc = (yp == yte).mean()
    results.append((bits, acc, sim_throughput))
    print(f"{bits:2d}-bit  acc={acc:.3f}  est_throughput={sim_throughput:6.1f} inf/s")

# The Pareto front: usually 8-bit is the sweet spot — minimal accuracy loss, big speedup.
best = max(results, key=lambda r: r[1] * (r[2]**0.5))
print(f"\\nBest tradeoff (acc * sqrt(throughput)): {best[0]}-bit")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads Iris, trains a 3-class LogisticRegression on the 4 features — produces FP32 weights <code>W_fp32</code> (3x4) and biases. 2) Defines a <code>quantize(W, bits)</code> helper that does symmetric per-tensor quantization at any bit width: levels = 2^(bits-1)-1, scale = max(|W|)/levels, round-clip-cast, then return the dequantized FP32 — same recipe as edge-L2's INT8 sketch but parameterized over bits. 3) Sweeps bits ∈ {32, 16, 8, 4, 2}: for each, quantizes the weights and runs 1000 prediction passes timing them with <code>perf_counter</code>. 4) Multiplies measured throughput by <code>32/bits</code> as a stand-in for real INT-kernel speedup on mobile NPUs — Hexagon HTP, ANE, Tensor TPU all clock INT8 ~4x faster than FP32 and INT4 ~8x in 2026. 5) Picks the Pareto-best point by maximizing <code>acc · sqrt(throughput)</code> — empirically usually 8-bit on classical tasks (matching MLPerf Mobile 4.0 production behavior); LLMs push to INT4 because weight memory bandwidth dominates and the accuracy hit is more recoverable.</p>

<p class="l-text">On real phones the same shape of curve plays out: FP32 is the slow reference, INT8 is the production sweet spot, INT4 is the territory of LLMs and Q4_K_M, and INT2 is research-only outside of LLM weight-only quantization.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Frontier — On-Device LLMs in iOS 18 / Android 15</h2>
<p class="l-text">2024 was the year on-device LLMs landed in OS-bundled features. By 2026 they are mature.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Apple Intelligence (iOS 18, M-series Macs)</div><div class="card-body">~3B "foundation model" runs on ANE in INT4 (palettized). 4-bit quantization-aware training, KV-cache state through CoreML stateful models, ~30 tok/s on iPhone 15 Pro. Used for writing tools, Siri summarization, Genmoji.</div></div>
<div class="calc-card"><div class="card-title">Gemini Nano (Pixel 9, Android 15)</div><div class="card-body">~3.25B model, runs on Tensor G4 TPU. Used for system features (Magic Compose in Messages, Recorder summaries, Quick Share descriptions). AICore service exposes it to third-party apps.</div></div>
<div class="calc-card"><div class="card-title">Microsoft Phi-3.5 / Phi-4-mini (Copilot+ PCs)</div><div class="card-body">3.8B / 4B model running on Snapdragon X Elite Hexagon NPU at 30+ tok/s. Used for Recall summaries, Click-to-Do, Cocreator in Paint.</div></div>
<div class="calc-card"><div class="card-title">Hybrid routing (the real product)</div><div class="card-body">Apple, Google, and Microsoft all route easy queries to the on-device model, hard queries to a cloud LLM (Apple Private Cloud Compute, Gemini Pro, GPT-4). On-device gives privacy and latency; cloud gives capability for the 5% that matters.</div></div>
</div>

<p class="l-text">L7 takes the same idea to the browser. L8 puts it together as a working product.</p>
</div>`,
tr: `<p class="l-text"><strong>Telefon, 2026'da ML çıkarımı için en önemli bilgisayardır.</strong> Aktif kullanımda 4.6 milyar akıllı telefon var, her biri ortalama 8–38 TOPS özel bir NPU ile, ve Apple'ın iOS 18 / Google'ın Android 15'i her ikisi de sistem düzeyinde cihaz-üstü LLM'lerle (Apple Intelligence, Gemini Nano) gönderir. Geliştirici için, bu iki ayrı araç zinciri demektir: iOS'ta CoreML (Apple Neural Engine, Metal GPU, CPU), ve Android'de TFLite (NNAPI → Hexagon DSP, Tensor TPU, GPU, CPU). Uzaktan benzer görünürler, performans duvarlarına çarpmaya başladığınızda keskin şekilde ayrılırlar.</p>

<p class="l-text">Bu derste her iki yığını uçtan uca yürüyoruz. Önce iOS: <code>coremltools</code> dönüşümü, CoreML compute unit'leri (CPU, GPU, Neural Engine), Xcode Instruments ile benchmark ve cihaz-üstü LLM'ler için yeni stateful-models API'si. İkinci olarak Android: TFLite converter, NNAPI delegate hiyerarşisi, doğrudan Hexagon erişimi için Qualcomm'un QNN SDK'sı, Google Tensor'un Edge TPU'su, prebuilt pipeline'lar için MediaPipe Tasks. Telefonlarda gerçekten karşılaştığınız gecikme-vs-doğruluk ödünleşimlerini simüle eden bir NumPy benchmark proxy ve gerçek cihazlardan (iPhone 15 Pro, Pixel 9 Pro, Galaxy S24 Ultra) somut 2026 rakamlarıyla kapatıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>PyTorch / ONNX / TF modellerini CoreML ve TFLite'a dönüştürmek ve doğru compute unit'i seçmek</li>
<li>Xcode Instruments ve Android GPU Inspector ile cihaz-üstü gecikmeyi profillemek</li>
<li>Apple Neural Engine (38 TOPS), Hexagon HTP (Snapdragon 8 Gen 3'te 45 TOPS), Tensor G4 TPU (~13 TOPS) üzerinde throughput tahmin etmek</li>
<li>Haftalar değil günler içinde CV/ASR özellikleri göndermek için MediaPipe Tasks kullanmak</li>
<li>Cihaz-üstü LLM KV cache için CoreML stateful modelleri uygulamak</li>
<li>En yaygın dört mobil dağıtım performans tuzağından kaçınmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. 2026 Mobil Donanım Listesi</h2>
<p class="l-text">2026'daki her amiral gemisi telefon, ML iş yüklerinin hedefleyebileceği üç farklı compute unit'e sahiptir. Hangisini kullanacağınızı ve runtime'ın op'ları nasıl yönlendirdiğini bilmek tüm oyundur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Apple Silicon (iPhone 15/16 Pro, M-serisi Mac/iPad)</div><div class="card-body">CPU (yüksek performans çekirdekleri, 4 + 4-cluster), GPU (Metal, iPhone 15 Pro'da ~5 TFLOPS FP16), <strong>Apple Neural Engine</strong> (38 TOPS INT8, INT16). ANE hızlı, düşük güçlüdür ve sadece CoreML aracılığıyla erişilebilir — üçüncü taraf API yok.</div></div>
<div class="calc-card"><div class="card-title">Qualcomm Snapdragon 8 Gen 3 / X Elite</div><div class="card-body">Adreno GPU, <strong>Hexagon DSP/HTP</strong> (8 Gen 3'te 45 TOPS INT8, Snapdragon X Elite'te 75 TOPS). TFLite NNAPI aracılığıyla veya doğrudan QNN SDK aracılığıyla erişilebilir.</div></div>
<div class="calc-card"><div class="card-title">Google Tensor G3/G4 (Pixel 8/9 Pro)</div><div class="card-body">Google Edge TPU (~13 TOPS), Google'ın modelleriyle birlikte tasarlanmış. INT8 quantize transformer'lar için optimize. TFLite + NNAPI aracılığıyla erişilebilir; Gemini Nano Pixel 9'da burada çalışır.</div></div>
<div class="calc-card"><div class="card-title">MediaTek Dimensity 9300+ APU</div><div class="card-body">33 TOPS'a kadar, generatif AI için optimize NPU. Vivo / Oppo / Xiaomi amiral gemilerinde kullanılır. TFLite + MediaTek'in NeuroPilot SDK'sı aracılığıyla hedeflenir.</div></div>
</div>

<div class="calc-highlight"><strong>Anahtar gerçek:</strong> 2026'da bir amiral gemisi telefon NPU'su, 2020 NVIDIA T4 veri merkezi GPU'sundan daha fazla INT8 throughput'una sahiptir. "Telefonda AI"nın çalışmasının nedeni tam olarak bu donanım geçişidir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. iOS — CoreML ve Apple Neural Engine</h2>
<p class="l-text"><strong>CoreML</strong>, Apple'ın cihaz-üstü ML framework'üdür, ANE erişimi istiyorsanız zorunludur. PyTorch'tan (<code>coremltools</code> aracılığıyla), TensorFlow'dan, ONNX'ten ve şimdi stateful PyTorch modellerinden (KV-cached LLM'ler için) girdi kabul eder. Çıktı, uygulamanız içinde gönderilen bir <code>.mlpackage</code> bundle'ıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># PyTorch modelini CoreML'e dönüştür, Apple Neural Engine hedefle
import torch
import coremltools as ct

class MobileNet(torch.nn.Module):
    def __init__(self):
        super().__init__()
        from torchvision.models import mobilenet_v3_small
        self.m = mobilenet_v3_small(num_classes=1000)
    def forward(self, x):
        return self.m(x)

model = MobileNet().eval()
example = torch.randn(1, 3, 224, 224)
traced = torch.jit.trace(model, example)

mlmodel = ct.convert(
    traced,
    inputs=[ct.ImageType(shape=example.shape, scale=1/255.0, bias=[0,0,0])],
    compute_units=ct.ComputeUnit.CPU_AND_NE,  # ANE'yi tercih et, CPU'ya geri düş
    minimum_deployment_target=ct.target.iOS17,
    compute_precision=ct.precision.FLOAT16,   # ANE'de FP16
)

# INT8'e quantize et (palettization veya linear)
mlmodel = ct.optimize.coreml.linear_quantize_weights(mlmodel, mode="linear_symmetric")
mlmodel.save("MobileNet.mlpackage")
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) torchvision'ın MobileNetV3-Small'unu (~2.5M param) bir nn.Module'a sarar — sadece standart op'lara (Conv, BN, ReLU, Linear) sahip olduğu için kanonik bir ANE hedefidir. 2) 1x3x224x224 örnek üzerinde <code>torch.jit.trace</code>, forward pass'i bir TorchScript graph'ına kaydeder — coremltools'un eski converter yolu için gereken input formatı. 3) <code>ct.convert</code> ile <code>ImageType(scale=1/255.0)</code> normalizasyonu modelin İÇİNE pişirir, böylece iOS uygulaması ham CGImage byte'larını besleyebilir — runtime ilk Conv'dan önce scale'i uygular. 4) <code>compute_units=CPU_AND_NE</code> CoreML'e Apple Neural Engine'i tercih etmesini ve desteklenmeyen op'larda CPU'ya geri düşmesini söyler (GPU yok); <code>compute_precision=FLOAT16</code> ANE'nin yerel veri tipiyle eşleşir — FP32 kullanmak CPU fallback'i zorlardı. <code>minimum_deployment_target=iOS17</code> modern ML Program formatını açar. 5) <code>linear_quantize_weights(mode="linear_symmetric")</code> ağırlıklarda kanal-başına simetrik INT8 PTQ yapar — aktivasyonlar ANE'de FP16 kalır. <code>.mlpackage</code> (dizin bundle'ı) olarak kaydedildi, Xcode'a bırakılıp <code>MLModel(contentsOf:)</code> ile bağlanmaya hazır — iPhone 15 Pro ANE'de ~1.2ms çıkarım.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Compute unit'ler</div><div class="card-body"><code>ALL</code> (varsayılan — CoreML op başına yönlendirir), <code>CPU_ONLY</code>, <code>CPU_AND_GPU</code>, <code>CPU_AND_NE</code>. ANE desteklenen op'lar için en hızlıdır ama dynamic şekilleri veya nadir op'ları işleyemez; runtime sessizce geri düşer.</div></div>
<div class="calc-card"><div class="card-title">Quantization</div><div class="card-body">Palettization (kümelenmiş ağırlıklar, çok küçük), linear (kanal-başına INT8), pruning. ANE FP16, INT8 (iOS 17'den beri) ve INT4'ü (iOS 18'den beri) destekler. LLM ağırlıkları tipik olarak INT4 palettized olarak gönderilir.</div></div>
<div class="calc-card"><div class="card-title">Stateful modeller (iOS 18+)</div><div class="card-body">Modeller KV-cache tensor'larını state olarak bildirebilir, her çağrıda cache'i yeniden girmeye gerek kalmadan. Cihaz-üstü LLM'ler için kritik — Apple Intelligence'ın 3B foundation modeli bunu kullanır.</div></div>
<div class="calc-card"><div class="card-title">Profileme</div><div class="card-body">Xcode Instruments → CoreML ML template → op başına gecikmeyi, compute unit atamasını, ANE kullanımını gör. "Modelim iPhone'da yavaş" olduğunda kontrol edilecek ilk şey.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Android — TFLite, NNAPI ve Donanım Hiyerarşisi</h2>
<p class="l-text">Android'de, <strong>TensorFlow Lite</strong> evrensel runtime'dır; <strong>NNAPI</strong> (Neural Networks API) op'ları vendor hızlandırıcılarına (Hexagon, Tensor TPU, MediaTek APU) yönlendiren OS-düzeyi soyutlamadır. Bazen NNAPI'yi atlar ve maks performans için doğrudan vendor SDK'larını çağırırsınız.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TFLite Interpreter (CPU)</div><div class="card-body">Saf C++ runtime, ARM NEON optimize. Her zaman fallback olarak çalışır. Küçük modeller veya quantize edilmemiş FP32 için iyi.</div></div>
<div class="calc-card"><div class="card-title">TFLite GPU Delegate</div><div class="card-body">OpenCL / OpenGL / Vulkan compute. FP16/FP32 CV modelleri için iyi. INT8 için NPU'yu her zaman yenmez.</div></div>
<div class="calc-card"><div class="card-title">TFLite NNAPI Delegate</div><div class="card-body">Android'den op'ları yönlendirmesini ister. NNAPI vendor HAL'a → Hexagon (Qualcomm), Tensor TPU (Google), APU (MediaTek) çağırır. Performans tamamen vendor destek kalitesine bağlıdır.</div></div>
<div class="calc-card"><div class="card-title">Qualcomm QNN SDK (doğrudan)</div><div class="card-body">NNAPI'yi atla, doğrudan Hexagon HTP ile konuş. INT8 LLM'ler için 2024'te NNAPI'den 1.5–3x daha hızlı (vendor optimizasyonları henüz NNAPI'de değil). Llama.cpp'nin QNN backend'inin Snapdragon X Elite için kullandığı şey.</div></div>
<div class="calc-card"><div class="card-title">Google AICore (Pixel-yalnız)</div><div class="card-body">Gemini Nano'yu host eden sistem servisi. App SDK'lar AICore API aracılığıyla çıkarım ister; sistem model yükleme, quantization, izolasyonu yönetir. İlk taraf LLM kullanımı için doğrudan TFLite'ı değiştirir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># TF / ONNX -&gt; TFLite dönüşümü (kalibrasyonla INT8)
import tensorflow as tf

# Kaydedilmiş bir TF modeli olduğunu varsay
converter = tf.lite.TFLiteConverter.from_saved_model("./mobilenet_savedmodel")
converter.optimizations = [tf.lite.Optimize.DEFAULT]

def representative_dataset():
    for _ in range(128):
        yield [tf.random.normal((1, 224, 224, 3)).numpy()]
converter.representative_dataset = representative_dataset
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter.inference_input_type  = tf.int8
converter.inference_output_type = tf.int8

tflite_model = converter.convert()
with open("mobilenet_int8.tflite", "wb") as f:
    f.write(tflite_model)

# Android'de kullan: Interpreter ile yükle, NNAPI delegate ekle
# Java/Kotlin tarafı:
#   Interpreter.Options opts = new Interpreter.Options();
#   opts.setUseNNAPI(true);  // desteklendiğinde NPU'ya yönlendir
#   Interpreter tf = new Interpreter(modelBuffer, opts);
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>TFLiteConverter.from_saved_model</code> aracılığıyla bir TF SavedModel dizinini yükler — Keras .h5 veya saf TF SavedModel formatını idare eder; ONNX-kaynaklı modeller için yol <code>tf2onnx</code>'tir. 2) <code>Optimize.DEFAULT</code>'u etkinleştirir — varsayılan olarak dynamic-range quantization yapar; full-integer için daha fazlası gerekir. 3) 128 rastgele 224x224x3 batch yielden bir <code>representative_dataset</code> generator sağlar — bu kalibrasyon örnekleri TFLite'a aktivasyon dağılımlarını gözlemleme ve INT8 aktivasyon scale'leri için tensor-başına min/max seçme imkânı verir (üretimde: gerçek veri dağılımınızdan 100-1000 örnek). 4) <code>TFLITE_BUILTINS_INT8</code>'i zorlar ve <code>inference_input_type=tf.int8</code>/<code>inference_output_type=tf.int8</code>'i ayarlar — bu olmadan input/output'lar FP32 kalır ve runtime sınırda dequantize/quantize op'ları ekler, NPU gecikmesini olumsuz etkiler. 5) .tflite FlatBuffer'ı yazar — Android tarafında, Java kodu <code>setUseNNAPI(true)</code> ile bir Interpreter oluşturur ve bu op'ları SoC'ye bağlı olarak Hexagon HTP (Qualcomm), Tensor TPU (Google) veya APU (MediaTek)'e yönlendirir. Aynı .tflite dosyası, runtime'da NNAPI tarafından seçilen farklı hızlandırıcı.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Gerçek Rakamlar — 2026 Mobil Benchmark'ları</h2>
<p class="l-text">Üretim dağıtımlarından ve MLPerf Mobile 4.0'dan (Q1 2026) rakamlar, okunabilirlik için yuvarlanmış. Bunları planlama çapaları olarak kullanın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MobileNetV3-Small INT8 (görüntü sınıflandırma)</div><div class="card-body">iPhone 15 Pro ANE: 1.2ms. Pixel 9 Pro Tensor TPU: 1.5ms. Galaxy S24 Hexagon: 1.0ms. CPU-yalnız fallback: 8–15ms. 30fps'de ~1000x gerçek-zamanlı.</div></div>
<div class="calc-card"><div class="card-title">YOLOv8-n INT8 (nesne tespiti 640×640)</div><div class="card-body">iPhone 15 Pro ANE: 8ms. Pixel 9 Pro: 12ms. Snapdragon X Elite QNN: 5ms. CPU: 40–80ms. 30fps'de marjla gerçek-zamanlı.</div></div>
<div class="calc-card"><div class="card-title">Whisper-Tiny INT8 (ASR, 5s ses)</div><div class="card-body">iPhone 15 Pro ANE: 80ms. Pixel 9 Pro: 110ms. Sadece CPU: 350ms. Streaming varyantları 50–80ms ilk-chunk gecikmesine ulaşır.</div></div>
<div class="calc-card"><div class="card-title">Phi-3-mini INT4 (3.8B LLM, 30 token)</div><div class="card-body">iPhone 15 Pro: 30 tok/s decode (30 token için 1s), prefill 200 tok/s. Snapdragon X Elite: ~25 tok/s decode. Pixel 9 Pro Gemini Nano (2B): ~15 tok/s.</div></div>
<div class="calc-card"><div class="card-title">Gemma 2 2B INT4</div><div class="card-body">iPhone 15 Pro: 35 tok/s. Galaxy S24 (8 Gen 3) QNN: 30 tok/s. Pixel 9 Pro: 22 tok/s. Tüm amiral gemilerinde makul sohbet deneyimi.</div></div>
<div class="calc-card"><div class="card-title">Stable Diffusion 1.5 (512×512, 20 adım)</div><div class="card-body">iPhone 15 Pro: ~10s uçtan-uca (Apple'ın Core ML port'u). Snapdragon X Elite: ~7s (vendor-tuned). 3+ üretimden sonra ağır termal throttle.</div></div>
</div>

<p class="l-text">İçselleştirilecek iki desen: (1) NPU'lar INT8 için GPU'ları 3–10x yener, (2) termal throttling gerçektir — 30+ saniye boyunca arka arkaya çıkarım çip ısındıkça performansı %30–50 düşürür.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. MediaPipe Tasks — Önceden İnşa Edilmiş Pipeline'lar</h2>
<p class="l-text">Mobil ML kullanım durumlarının %80'i için kendi modelinizi dönüştürmenize gerek yok. <strong>MediaPipe Tasks</strong> (Google, MediaPipe Solutions'tan evrildi), yüz tespiti, el işaretleri, poz, segmentasyon, OCR, ses sınıflandırması, görüntü sınıflandırması, jest tanıma ve şimdi LLM çıkarımı (MediaPipe LLM Inference API) için üretime hazır, cihaz-üstü pipeline'lar sağlar. iOS, Android, JavaScript ve Python için sarılmış; altta aynı TFLite/CoreML modellerini çalıştırır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vision görevleri</div><div class="card-body">FaceLandmarker (478 işaret, 30fps), HandLandmarker (21×2 keypoint), PoseLandmarker, ImageSegmenter, GestureRecognizer, ObjectDetector. Tümü amiral gemilerinde ~1–10ms.</div></div>
<div class="calc-card"><div class="card-title">Ses görevleri</div><div class="card-body">AudioClassifier (YAMNet wrapper), AudioEmbedder. Gerçek-zamanlı spectrogram-tabanlı sınıflandırma.</div></div>
<div class="calc-card"><div class="card-title">Metin görevleri</div><div class="card-body">TextClassifier, TextEmbedder, LanguageDetector. CPU-yalnız, hızlı.</div></div>
<div class="calc-card"><div class="card-title">LLM Inference API (2024+)</div><div class="card-body">Cihaz-üstü Gemma 2B, Phi-3, Llama 3.2 1B/3B. Pixel uygulamaları tarafından kullanılır ve büyüyen üçüncü taraf benimsemesi. Cross-platform: Android/iOS/Web'de aynı API.</div></div>
</div>

<div class="calc-highlight"><strong>Varsayılan kural:</strong> MediaPipe Tasks'ın ihtiyacınız olanı varsa, kullanın. Dağıtım, optimizasyon ve bakımdaki tasarruflar kendilerini birçok kez öder. MediaPipe modeli eksik olduğunda veya custom çıktı formatlarına ihtiyaç duyduğunuzda kendinizinkini yapın.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kaçınılacak Dört Performans Tuzağı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tuzak 1 — NPU'dan sessizce düşmek</div><div class="card-body">Tek bir desteklenmeyen op (custom activation, dynamic-shape Resize, exotic Conv), CoreML veya NNAPI'nin tüm modeli CPU'ya geri itmesine neden olabilir. Dönüşümden sonra her zaman profilleyin. Model graph'ını incelemek ve "ALL" → "CPU only" uyarılarını kontrol etmek için Netron kullanın.</div></div>
<div class="calc-card"><div class="card-title">Tuzak 2 — Quantize etmeyi unutmak</div><div class="card-body">FP32 → INT8 telefonlarda isteğe bağlı değildir; 4–10x hız ve 4x boyuttur. Birçok eğitim FP32 dönüşümleri gösterir; üretimde her zaman quantize edersiniz.</div></div>
<div class="calc-card"><div class="card-title">Tuzak 3 — Cold-start gecikmesi</div><div class="card-body">2GB CoreML modeli yüklemek ilk seferinde 1–3 saniye sürebilir (ANE için derleme). İlk kullanıcı eyleminde değil, uygulama başlatmasında ön yükleyin. Apple bunun için <code>compileModel</code> warmup API'leri gönderir.</div></div>
<div class="calc-card"><div class="card-title">Tuzak 4 — Pili ölçmemek</div><div class="card-body">GPU'da 60fps'de çalışan bir model, NPU'daki aynı modelden pili 3x daha hızlı tüketir. Her zaman sadece ms/inference değil Wh/inference benchmark'layın. Apple Instruments ve Android Battery Historian her ikisi de bunu açığa çıkarır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pratik — Bir Gecikme-Doğruluk Ödünleşim Eğrisi</h2>
<p class="l-text">Gerçek mobil dağıtım bir Pareto cephesidir: bir miktar doğruluk maliyetiyle daha küçük / daha düşük hassasiyetle gidip her zaman daha hızlı gidebilirsiniz. NumPy'da, bir sklearn sınıflandırıcısında quantization'ı simüle ederek ve throughput vs doğruluk ölçerek eğriyi inşa edin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import time
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

# "Büyük" FP32 model
clf = LogisticRegression(max_iter=500).fit(Xtr, ytr)
W_fp32 = clf.coef_.astype(np.float32)
b_fp32 = clf.intercept_.astype(np.float32)

def quantize(W, bits):
    if bits &gt;= 32: return W.copy(), 1.0
    levels = 2**(bits-1) - 1
    s = np.max(np.abs(W)) / levels
    Wq = np.round(W / s).clip(-levels, levels).astype(np.int32)
    return Wq.astype(np.float32) * s, s

def softmax(z):
    e = np.exp(z - z.max(-1, keepdims=True))
    return e / e.sum(-1, keepdims=True)

def predict(Xt, W, b):
    return np.argmax(softmax(Xt @ W.T + b), axis=1)

results = []
for bits in [32, 16, 8, 4, 2]:
    Wq, _ = quantize(W_fp32, bits)
    # "Throughput"u simüle et — daha küçük bit = gerçek INT kernel'lerinde saniyede daha çok op
    speedup_factor = max(1.0, 32 / bits)
    # Tahmini zamanla (ölçümü güçlendirmek için döngüler)
    t0 = time.perf_counter()
    for _ in range(1000):
        yp = predict(Xte, Wq, b_fp32)
    t1 = time.perf_counter()
    sim_throughput = 1000 / (t1 - t0) * speedup_factor
    acc = (yp == yte).mean()
    results.append((bits, acc, sim_throughput))
    print(f"{bits:2d}-bit  acc={acc:.3f}  est_throughput={sim_throughput:6.1f} inf/s")

# Pareto cephesi: genellikle 8-bit tatlı noktadır — minimum doğruluk kaybı, büyük hızlanma.
best = max(results, key=lambda r: r[1] * (r[2]**0.5))
print(f"\\nBest tradeoff (acc * sqrt(throughput)): {best[0]}-bit")
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Iris'i yükler, 4 özellikte 3-sınıflı bir LogisticRegression eğitir — FP32 ağırlıkları <code>W_fp32</code> (3x4) ve bias'ları üretir. 2) Herhangi bir bit genişliğinde simetrik tensor-başına quantization yapan <code>quantize(W, bits)</code> yardımcısı tanımlar: levels = 2^(bits-1)-1, scale = max(|W|)/levels, round-clip-cast, sonra dequantize FP32'yi döndür — edge-L2'nin INT8 taslağıyla aynı tarif ama bit'ler üzerinden parametreli. 3) bits ∈ {32, 16, 8, 4, 2} üzerinde dolaşır: her biri için ağırlıkları quantize eder ve <code>perf_counter</code> ile zaman ölçerek 1000 tahmin pass'i çalıştırır. 4) Ölçülen throughput'u mobil NPU'larda gerçek INT-kernel hızlanmasının yer tutucusu olarak <code>32/bits</code> ile çarpar — Hexagon HTP, ANE, Tensor TPU 2026'da INT8'i FP32'den ~4x daha hızlı ve INT4'ü ~8x daha hızlı saatler. 5) <code>acc · sqrt(throughput)</code>'u maksimize ederek Pareto en iyi noktayı seçer — klasik görevlerde ampirik olarak genellikle 8-bit (MLPerf Mobile 4.0 üretim davranışıyla eşleşir); LLM'ler INT4'e iter çünkü ağırlık bellek bant genişliği hakimdir ve doğruluk vuruşu daha geri kazanılabilir.</p>

<p class="l-text">Gerçek telefonlarda eğrinin aynı şekli oynanır: FP32 yavaş referanstır, INT8 üretim tatlı noktasıdır, INT4 LLM'lerin ve Q4_K_M'in bölgesidir, ve INT2, LLM ağırlık-yalnız quantization dışında sadece-araştırmadır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Sınır — iOS 18 / Android 15'te Cihaz-Üstü LLM'ler</h2>
<p class="l-text">2024, OS-paketli özelliklerde cihaz-üstü LLM'lerin indiği yıldı. 2026'ya kadar olgunlaştılar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Apple Intelligence (iOS 18, M-serisi Mac'ler)</div><div class="card-body">~3B "foundation model", INT4'te (palettized) ANE'de çalışır. 4-bit quantization-aware training, CoreML stateful modeller aracılığıyla KV-cache state, iPhone 15 Pro'da ~30 tok/s. Yazma araçları, Siri özetleme, Genmoji için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Gemini Nano (Pixel 9, Android 15)</div><div class="card-body">~3.25B model, Tensor G4 TPU'da çalışır. Sistem özellikleri için kullanılır (Messages'ta Magic Compose, Recorder özetleri, Quick Share açıklamaları). AICore servisi onu üçüncü taraf uygulamalara açar.</div></div>
<div class="calc-card"><div class="card-title">Microsoft Phi-3.5 / Phi-4-mini (Copilot+ PC'ler)</div><div class="card-body">3.8B / 4B model Snapdragon X Elite Hexagon NPU'da 30+ tok/s'de çalışır. Recall özetleri, Click-to-Do, Paint'te Cocreator için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Hibrit yönlendirme (gerçek ürün)</div><div class="card-body">Apple, Google ve Microsoft hepsi kolay sorguları cihaz-üstü modele, zor sorguları bulut LLM'ine (Apple Private Cloud Compute, Gemini Pro, GPT-4) yönlendirir. Cihaz-üstü gizlilik ve gecikme verir; bulut önemli olan %5 için yetenek verir.</div></div>
</div>

<p class="l-text">L7 aynı fikri tarayıcıya götürür. L8 onu çalışan bir ürün olarak bir araya getirir.</p>
</div>`
};
