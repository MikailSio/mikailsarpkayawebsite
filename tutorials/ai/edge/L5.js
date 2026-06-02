window.EDGE_L5 = {
en: `<p class="l-text"><strong>The promise of "convert once, run anywhere" is the holy grail of edge ML — and ONNX (Open Neural Network Exchange) is the closest thing to it.</strong> Born in 2017 as a Facebook–Microsoft collaboration, ONNX is a vendor-neutral graph IR that PyTorch, TensorFlow, JAX, scikit-learn, and HuggingFace can all export to, and that ONNXRuntime, OpenVINO, TensorRT, CoreML Tools, and Apache TVM can all consume. In 2026 every major commercial accelerator — Intel CPUs, NVIDIA GPUs, Apple Silicon, Qualcomm Hexagon, AMD ROCm, and the new wave of NPU laptops (Snapdragon X Elite, Lunar Lake) — has an ONNX-compatible execution provider.</p>

<p class="l-text">In this lesson we trace the full format landscape. ONNX as the universal interchange. ONNXRuntime as the cross-platform inference engine. OpenVINO (Intel CPUs, Arc GPUs, Movidius VPUs). TensorRT (NVIDIA GPUs, Jetson). CoreML (Apple Silicon, Neural Engine). TFLite (Android, microcontrollers, edge TPUs). Apache TVM (the auto-tuning compiler that beats all of them on niche hardware). We also discuss when llama.cpp's GGUF should win, and when ONNX is the better path. We finish with a NumPy round-trip "fake ONNX" that shows the graph-IR mental model.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read an ONNX graph: nodes (ops), tensors, initializers, opset version</li>
<li>Export PyTorch / TensorFlow / sklearn models to ONNX with <code>torch.onnx.export</code> and <code>tf2onnx</code></li>
<li>Pick the right runtime per target: ONNXRuntime (general), OpenVINO (Intel), TensorRT (NVIDIA), CoreML (Apple), TFLite (Android)</li>
<li>Use Apache TVM's auto-tuning when off-the-shelf runtimes leave 30%+ on the table</li>
<li>Decide GGUF vs ONNX for a given workload</li>
<li>Avoid the three classic ONNX export pitfalls (dynamic axes, custom ops, opset mismatch)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ONNX — The Universal IR</h2>
<p class="l-text">An ONNX file (<code>.onnx</code>) is a serialized Protocol Buffer (Google protobuf). It contains a <strong>graph</strong> of <strong>nodes</strong> (operations like <code>Conv</code>, <code>MatMul</code>, <code>Softmax</code>), <strong>tensors</strong> (named typed shapes for inputs/outputs), and <strong>initializers</strong> (constant tensors — your trained weights). The graph is a directed acyclic graph; runtimes can topologically sort and execute it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Operator set (opset)</div><div class="card-body">ONNX standardizes ~200 operators: Conv, Gemm, BatchNormalization, LayerNormalization, GRU, LSTM, Attention (added opset 21, 2024), Resize, NonMaxSuppression. Each opset version (1, 9, 13, 17, 21, ...) freezes a snapshot of behavior. Latest in 2026: opset 22.</div></div>
<div class="calc-card"><div class="card-title">Tensor types</div><div class="card-body">FP32, FP16, BF16, INT8, INT4 (added opset 20), bool, complex. Each tensor has a name, type, and (optionally symbolic) shape.</div></div>
<div class="calc-card"><div class="card-title">Initializers</div><div class="card-body">Trained weights stored as raw bytes inside the protobuf. For models &gt;2GB you split into "external data" — the .onnx file references separate .bin files for big tensors (used by GPT-class ONNX exports).</div></div>
<div class="calc-card"><div class="card-title">Versioning</div><div class="card-body">Every ONNX file declares <code>ir_version</code> and per-opset <code>opset_import</code>. A runtime that supports opset N can run any model with opset ≤ N. Mismatch = "operator not supported" errors at load time.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Exporting from PyTorch — <code>torch.onnx.export</code></h2>
<p class="l-text">PyTorch ships with two exporters: the legacy tracer-based <code>torch.onnx.export</code> and the newer <code>torch.onnx.dynamo_export</code> (uses TorchDynamo, much better at control flow). Both produce ONNX files; the dynamo path is the 2024+ default for transformer models.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Real PyTorch -&gt; ONNX export (requires torch, not runnable in browser)
import torch
import torch.nn as nn

class TinyMLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)
    def forward(self, x):
        return self.fc2(torch.relu(self.fc1(x)))

model = TinyMLP().eval()
dummy = torch.randn(1, 784)

# Legacy tracer path
torch.onnx.export(model, dummy, "tiny_mlp.onnx",
                  input_names=["x"], output_names=["logits"],
                  dynamic_axes={"x": {0: "batch"}, "logits": {0: "batch"}},
                  opset_version=17)

# Newer dynamo path (PyTorch 2.0+)
exported = torch.onnx.dynamo_export(model, dummy)
exported.save("tiny_mlp_dynamo.onnx")

# Verify with onnxruntime
import onnxruntime as ort
sess = ort.InferenceSession("tiny_mlp.onnx")
out = sess.run(None, {"x": dummy.numpy()})
print(out[0].shape)  # (1, 10)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines TinyMLP — two Linear layers with a ReLU; <code>.eval()</code> disables dropout/batchnorm-training-mode, critical before export because the tracer freezes whatever mode the model is in. 2) Creates a <code>dummy</code> tensor with batch=1 — the tracer runs one forward pass with this input and records every op into the ONNX graph. 3) Legacy <code>torch.onnx.export</code>: emits <code>tiny_mlp.onnx</code> at opset 17 with named I/O and <code>dynamic_axes</code> declaring axis 0 of x and logits is symbolic — without this declaration the runtime would reject any batch ≠ 1. 4) Dynamo path: <code>torch.onnx.dynamo_export</code> uses TorchDynamo's symbolic capture instead of tracing, so it handles Python control flow (if/for) that the tracer would either bake in or fail on — this is the default 2024+ path for transformers. 5) Loads via <code>onnxruntime.InferenceSession</code> and runs the same dummy — <code>sess.run(None, ...)</code> returns all outputs; the (1, 10) shape verifies the round-trip matches PyTorch.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pitfall 1 — dynamic axes</div><div class="card-body">If you forget <code>dynamic_axes</code>, the exported model is locked to the dummy batch size. Always declare which axes can vary at inference (batch, sequence length).</div></div>
<div class="calc-card"><div class="card-title">Pitfall 2 — custom ops</div><div class="card-body">Any non-standard op (custom CUDA kernel, FlashAttention) becomes a <code>com.example.MyOp</code> in ONNX, which most runtimes will not execute. Either rewrite in standard ops or build a custom op DLL for the target runtime.</div></div>
<div class="calc-card"><div class="card-title">Pitfall 3 — opset mismatch</div><div class="card-body">Exporting at opset 22 but deploying to a TFLite-2023 runtime that supports opset 17 = nothing works. Always check the target's supported opset BEFORE exporting.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ONNXRuntime — The Default Cross-Platform Engine</h2>
<p class="l-text">ONNXRuntime (ORT, Microsoft, BSD-licensed) is the canonical ONNX consumer. Single C/C++/Python/JS/Java/.NET API; runs on CPU, CUDA, DirectML, CoreML, OpenVINO, TensorRT, ROCm, QNN (Qualcomm) — at the cost of installing the right "execution provider" (EP) for each.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CPU EP — default</div><div class="card-body">SIMD-optimized (AVX2, AVX-512, NEON). Good for small models, classical ML (sklearn-via-ONNX), batch-1 latency-sensitive workloads.</div></div>
<div class="calc-card"><div class="card-title">CUDA EP — NVIDIA GPUs</div><div class="card-body">cuDNN-backed kernels. Solid baseline; TensorRT EP usually beats it for production serving.</div></div>
<div class="calc-card"><div class="card-title">CoreML EP — Apple Silicon</div><div class="card-body">Pushes ops to Apple Neural Engine when supported. Falls back to CPU for unsupported ops. Good but not as tightly-tuned as native CoreML conversion (L6).</div></div>
<div class="calc-card"><div class="card-title">DirectML EP — Windows GPUs</div><div class="card-body">Vendor-agnostic Windows GPU API. Runs on NVIDIA, AMD, Intel, Qualcomm GPUs from one binary. Used in Windows Copilot+ PCs.</div></div>
<div class="calc-card"><div class="card-title">QNN EP — Qualcomm NPUs</div><div class="card-body">Targets Hexagon DSP and HTP on Snapdragon X Elite. Recently added; key for Copilot+ on-device AI.</div></div>
<div class="calc-card"><div class="card-title">WebGPU / WebGL / WASM EPs</div><div class="card-body">Run ONNX in the browser via onnxruntime-web. Foundation for ONNX-Web and (sometimes) Transformers.js (L7).</div></div>
</div>

<p class="l-text">A single ORT install can target many backends: <code>session = InferenceSession("model.onnx", providers=["CUDAExecutionProvider", "CPUExecutionProvider"])</code> tries CUDA first, falls back to CPU. The "magic" is real but gated by which ops each EP supports.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. OpenVINO — Intel's Inference Toolkit</h2>
<p class="l-text">OpenVINO (Open Visual Inference and Neural Network Optimization, Intel, 2018) is Intel's answer to TensorRT. It targets Intel CPUs (with built-in AVX-VNNI / AMX), Intel Arc GPUs, the older Movidius Myriad VPUs, and the new Meteor Lake / Lunar Lake NPUs. It accepts ONNX, TensorFlow, PyTorch (via OpenVINO 2024+), and PaddlePaddle.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Intermediate Representation (IR)</div><div class="card-body">OpenVINO compiles your model to its own IR (.xml + .bin). Used to be required; in 2024+ you can <code>ov.compile_model("model.onnx")</code> and skip the conversion step.</div></div>
<div class="calc-card"><div class="card-title">Quantization (POT, NNCF)</div><div class="card-body">Post-Training Optimization Tool and Neural Network Compression Framework — Intel's PTQ + QAT pipeline. INT8 with auto-calibration in a few lines.</div></div>
<div class="calc-card"><div class="card-title">Performance</div><div class="card-body">On Intel CPUs, OpenVINO typically beats vanilla ORT-CPU by 1.3–2x via AMX/AVX-VNNI tuning. On Lunar Lake NPUs it is the only path (no third-party support yet).</div></div>
<div class="calc-card"><div class="card-title">Use cases</div><div class="card-body">Industrial CV (the historical core market), Copilot+ PCs (2024–), Stable Diffusion on Arc GPUs, voice assistants on NUCs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. TensorRT — NVIDIA's Inference Compiler</h2>
<p class="l-text">TensorRT (NVIDIA, 2017) is the inference compiler for NVIDIA GPUs. Takes ONNX or PyTorch (via Torch-TensorRT), applies aggressive graph optimizations (kernel fusion, layer reordering, precision lowering, kernel auto-tuning per GPU SKU), and emits a serialized engine (.plan) that runs at ~peak hardware throughput.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Optimizations</div><div class="card-body">Layer fusion (Conv + BN + ReLU → one kernel), precision calibration (FP32 → FP16/INT8/FP8 with calibration data), kernel auto-tuning (picks fastest kernel per (op, shape, GPU) tuple), dynamic shape support.</div></div>
<div class="calc-card"><div class="card-title">TensorRT-LLM (specialized)</div><div class="card-body">A 2023 fork tuned for LLM serving: in-flight batching, paged KV cache (à la vLLM), quantized matmuls (W8A8 SmoothQuant, W4A16 AWQ). State-of-the-art LLM throughput on H100/H200.</div></div>
<div class="calc-card"><div class="card-title">Trade-offs</div><div class="card-body">The .plan engine is locked to a specific GPU architecture (Ampere, Hopper, Blackwell). You compile per deployment target. Large models take 30+ minutes to compile.</div></div>
<div class="calc-card"><div class="card-title">Edge variant — Jetson</div><div class="card-body">TensorRT runs on NVIDIA Jetson modules (Orin Nano, AGX Orin). Same APIs, ARM CPU + integrated GPU, used in robotics, drones, smart cameras.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CoreML &amp; TFLite — The Mobile Duopoly</h2>
<p class="l-text">For phones, you usually leave the ONNX world entirely and convert to platform-native formats: CoreML (iOS) or TFLite (Android). L6 covers the deployment in detail; here we focus on the formats themselves.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CoreML (.mlpackage)</div><div class="card-body">Apple's format. Supports CPU + GPU (Metal) + Apple Neural Engine routing per op. Quantization (linear, palettized, INT8/INT4). Convert via <code>coremltools.convert(onnx_model)</code> or directly from PyTorch via <code>coremltools.convert(traced_pt_model)</code>. New in 2024: stateful models (KV cache support for on-device LLMs).</div></div>
<div class="calc-card"><div class="card-title">TFLite (.tflite)</div><div class="card-body">FlatBuffer format (no protobuf overhead). Targets Android (NNAPI → Hexagon / Tensor TPU / GPU), iOS, microcontrollers (TFLite Micro). Convert via <code>tf.lite.TFLiteConverter</code> or <code>tf2onnx</code> reverse path. Quantization (dynamic range, full INT8, QAT).</div></div>
<div class="calc-card"><div class="card-title">CoreML vs TFLite — same goal, different ecosystem</div><div class="card-body">Apple's NNAPI equivalent is CoreML; Google's CoreML equivalent is TFLite + NNAPI. Both convert from ONNX, both have ~similar feature sets. You will end up shipping both for cross-platform apps.</div></div>
<div class="calc-card"><div class="card-title">ExecuTorch (PyTorch native, 2024)</div><div class="card-body">PyTorch's bid to skip ONNX entirely: export PyTorch models directly to a runtime suitable for mobile and embedded. Backends for CoreML (via Apple ANE), MediaTek, Vulkan, Qualcomm. Picking up adoption in 2024–25 but not yet the default.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Apache TVM — Auto-Tuning for Niche Hardware</h2>
<p class="l-text">TVM (originally from UW, 2018; now Apache project) is the deep compiler. Where ONNXRuntime / OpenVINO / TensorRT use hand-tuned kernels, TVM <em>generates</em> kernels and uses ML-based auto-tuning (AutoTVM, Ansor, MetaSchedule) to find the fastest schedule for a given (op, shape, hardware) tuple. The cost is hours of compile time; the win is sometimes 30–50% over off-the-shelf runtimes on niche or new hardware.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Targets supported</div><div class="card-body">Almost everything: x86, ARM CPUs/GPUs, NVIDIA, AMD, Intel, RISC-V, Hexagon, FPGAs, custom ASICs. The frontier of "make this random new chip useful for ML".</div></div>
<div class="calc-card"><div class="card-title">When to reach for TVM</div><div class="card-body">You have unusual hardware (RISC-V vector chip, custom NPU) with no vendor inference SDK, OR you are squeezing a high-volume edge product where 30% perf matters and you can afford the engineering. NOT for prototypes.</div></div>
<div class="calc-card"><div class="card-title">MLC LLM (TVM-based)</div><div class="card-body">Project from CMU/MLC team — runs Llama-class LLMs via TVM on iPhone, Android, browsers (via WebGPU), Mac. The original WebGPU LLM demo (early 2023) was MLC-LLM. Still excellent for cross-device LLM deployment.</div></div>
<div class="calc-card"><div class="card-title">vs llama.cpp</div><div class="card-body">llama.cpp wins on simplicity and on CPU/Metal. MLC/TVM wins on browser WebGPU and on heterogeneous routing. They overlap; pick by ecosystem fit.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. GGUF vs ONNX — When to Choose Which</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GGUF wins for</div><div class="card-body">Open-weight LLMs (Llama, Mistral, Qwen, DeepSeek, Phi). Single-file deployment. Power users running on laptops/desktops. Heavy quantization (Q2_K to Q8_0). Tight integration with the local-LLM ecosystem (Ollama, LM Studio).</div></div>
<div class="calc-card"><div class="card-title">ONNX wins for</div><div class="card-body">Non-LLM models — CV, ASR (Whisper goes both ways but ONNX dominates outside llama.cpp), classical ML (sklearn-via-ONNX), tabular models. Cross-runtime portability. Models you want to run via OpenVINO or TensorRT or DirectML.</div></div>
<div class="calc-card"><div class="card-title">Both work</div><div class="card-body">Whisper has GGUF (whisper.cpp) and ONNX (sherpa-onnx) versions. Stable Diffusion has ONNX (Olive, OnnxStream) and GGUF (stable-diffusion.cpp) ports. Choose by deployment target.</div></div>
<div class="calc-card"><div class="card-title">Native always wins on phone</div><div class="card-body">For mobile, convert ONNX → CoreML or TFLite for best NPU usage. ONNX-on-mobile via ORT works but leaves performance on the table.</div></div>
</div>

<div class="calc-highlight"><strong>2026 default:</strong> LLMs → GGUF + llama.cpp. Everything else → ONNX, with platform-specific re-conversion (CoreML for iOS, TFLite for Android, TensorRT for cloud NVIDIA, OpenVINO for cloud Intel).</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. NumPy "Fake ONNX" — Graph IR in 40 Lines</h2>
<p class="l-text">To make the IR mental model concrete, here is a tiny NumPy implementation: define a graph as a list of typed ops, serialize it via pickle (proxy for protobuf), reload, and execute. Same shape as real ONNX, much smaller.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import pickle, io

# A "graph" is a list of nodes; each node has (op_name, inputs, output, attrs)
# Initializers map name -&gt; constant tensor (your weights)

def make_mlp_graph():
    np.random.seed(0)
    W1 = np.random.randn(4, 8).astype(np.float32) * 0.3
    W2 = np.random.randn(8, 3).astype(np.float32) * 0.3
    initializers = {"W1": W1, "W2": W2}
    nodes = [
        ("MatMul", ["x",  "W1"], "h0",   {}),
        ("Relu",   ["h0"],        "h1",   {}),
        ("MatMul", ["h1", "W2"], "logits",{}),
    ]
    return {"inputs": ["x"], "outputs": ["logits"],
            "initializers": initializers, "nodes": nodes,
            "opset": 17, "ir_version": 8}

OPS = {
    "MatMul": lambda a, b: a @ b,
    "Relu":   lambda a: np.maximum(a, 0),
    "Softmax": lambda a: np.exp(a) / np.exp(a).sum(-1, keepdims=True),
}

def run_graph(graph, feeds):
    env = dict(graph["initializers"])
    env.update(feeds)
    for op, inputs, output, attrs in graph["nodes"]:
        args = [env[name] for name in inputs]
        env[output] = OPS[op](*args)
    return {name: env[name] for name in graph["outputs"]}

# Build, serialize (proxy for protobuf), reload, run
g = make_mlp_graph()
buf = pickle.dumps(g)
print(f"Serialized 'fake ONNX' size: {len(buf)} bytes")

g2 = pickle.loads(buf)
x = np.random.randn(2, 4).astype(np.float32)
out = run_graph(g2, {"x": x})
print(f"Output shape: {out['logits'].shape}")
print(f"First row logits: {out['logits'][0].round(3).tolist()}")
print(f"Opset: {g2['opset']}, IR version: {g2['ir_version']}")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a graph as a Python dict with the same four pieces real ONNX has: <code>inputs</code>/<code>outputs</code> (named external tensors), <code>initializers</code> (constant weights as numpy arrays), <code>nodes</code> (a topologically-ordered list of (op, input_names, output_name, attrs) tuples), and <code>opset</code>/<code>ir_version</code> metadata. 2) The OPS dict is the runtime's "operator implementation" table — exactly what ONNXRuntime, OpenVINO, TensorRT each carry, just with their kernels instead of NumPy lambdas. Notice MatMul is just <code>a @ b</code>; the runtime swap is the whole game. 3) <code>pickle.dumps(g)</code> stands in for protobuf serialization — same idea: stable binary that anyone with the schema can read. Real ONNX is ~10x more compact and stricter on types. 4) Loading round-trips and <code>run_graph</code> topologically executes: pre-populate <code>env</code> with weights + feeds, then for each node fetch named inputs, apply the op, store named output. This three-line interpreter is exactly the inner loop of every ONNX runtime. 5) Reports output shape (2, 3) for batch-2 input — proves the symbolic-batch idea works without any axis bookkeeping, the same property dynamic_axes gave us in step 2 above.</p>

<p class="l-text">The real ONNX format adds: protobuf instead of pickle, formal type/shape inference, &gt;200 ops, dynamic shapes, model metadata. But the mental model is exactly this — a serialized DAG of typed ops with initializers, executable by any runtime that implements the ops. Once you internalize that, every export error and every "operator not supported" message starts to make sense.</p>
</div>`,
tr: `<p class="l-text"><strong>"Bir kez dönüştür, her yerde çalıştır" vaadi edge ML'in kutsal kasesidir — ve ONNX (Open Neural Network Exchange) ona en yakın olan şeydir.</strong> 2017'de bir Facebook–Microsoft işbirliği olarak doğan ONNX, PyTorch, TensorFlow, JAX, scikit-learn ve HuggingFace'in tümünün export edebileceği ve ONNXRuntime, OpenVINO, TensorRT, CoreML Tools ve Apache TVM'in tümünün tüketebileceği vendor-nötr bir graph IR'dir. 2026'da her büyük ticari hızlandırıcı — Intel CPU'lar, NVIDIA GPU'lar, Apple Silicon, Qualcomm Hexagon, AMD ROCm ve yeni NPU dizüstü dalgası (Snapdragon X Elite, Lunar Lake) — ONNX-uyumlu bir execution provider'a sahiptir.</p>

<p class="l-text">Bu derste tam format manzarasını izliyoruz. Evrensel değişim olarak ONNX. Cross-platform çıkarım motoru olarak ONNXRuntime. OpenVINO (Intel CPU'lar, Arc GPU'lar, Movidius VPU'lar). TensorRT (NVIDIA GPU'lar, Jetson). CoreML (Apple Silicon, Neural Engine). TFLite (Android, mikrodenetleyiciler, edge TPU'lar). Apache TVM (niş donanımda hepsini yenen auto-tuning compiler). Ayrıca llama.cpp'nin GGUF'unun ne zaman kazanması gerektiğini ve ONNX'in ne zaman daha iyi yol olduğunu tartışıyoruz. Graph-IR zihinsel modelini gösteren bir NumPy round-trip "fake ONNX" ile bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir ONNX graph'ı okumak: nodes (op'lar), tensor'lar, initializer'lar, opset versiyonu</li>
<li>PyTorch / TensorFlow / sklearn modellerini <code>torch.onnx.export</code> ve <code>tf2onnx</code> ile ONNX'e export etmek</li>
<li>Hedef başına doğru runtime'ı seçmek: ONNXRuntime (genel), OpenVINO (Intel), TensorRT (NVIDIA), CoreML (Apple), TFLite (Android)</li>
<li>Off-the-shelf runtime'ların masada %30+ bıraktığında Apache TVM'in auto-tuning'ini kullanmak</li>
<li>Belirli bir iş yükü için GGUF vs ONNX'e karar vermek</li>
<li>Üç klasik ONNX export tuzağından kaçınmak (dynamic axes, custom op'lar, opset uyumsuzluğu)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ONNX — Evrensel IR</h2>
<p class="l-text">Bir ONNX dosyası (<code>.onnx</code>) serileştirilmiş bir Protocol Buffer'dır (Google protobuf). Bir <strong>graph</strong> (<code>Conv</code>, <code>MatMul</code>, <code>Softmax</code> gibi operasyonlar olan <strong>nodes</strong>), <strong>tensor'lar</strong> (input/output'lar için isimlendirilmiş tipli şekiller) ve <strong>initializer'lar</strong> (sabit tensor'lar — eğitilmiş ağırlıklarınız) içerir. Graph yönlendirilmiş döngüsüz bir graph'tır; runtime'lar onu topolojik sıralayabilir ve yürütebilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Operatör seti (opset)</div><div class="card-body">ONNX ~200 operatörü standartlaştırır: Conv, Gemm, BatchNormalization, LayerNormalization, GRU, LSTM, Attention (opset 21'de eklendi, 2024), Resize, NonMaxSuppression. Her opset versiyonu (1, 9, 13, 17, 21, ...) bir davranış anlık görüntüsünü dondurur. 2026'daki en son: opset 22.</div></div>
<div class="calc-card"><div class="card-title">Tensor tipleri</div><div class="card-body">FP32, FP16, BF16, INT8, INT4 (opset 20'de eklendi), bool, complex. Her tensor'un bir adı, tipi ve (isteğe bağlı sembolik) şekli vardır.</div></div>
<div class="calc-card"><div class="card-title">Initializer'lar</div><div class="card-body">Eğitilmiş ağırlıklar protobuf içinde ham byte olarak saklanır. &gt;2GB modeller için "external data"ya bölersiniz — .onnx dosyası büyük tensor'lar için ayrı .bin dosyalarına başvurur (GPT-sınıfı ONNX export'ları tarafından kullanılır).</div></div>
<div class="calc-card"><div class="card-title">Versiyonlama</div><div class="card-body">Her ONNX dosyası <code>ir_version</code> ve opset başına <code>opset_import</code> bildirir. Opset N'i destekleyen bir runtime, opset ≤ N olan herhangi bir modeli çalıştırabilir. Uyumsuzluk = yükleme sırasında "operator not supported" hataları.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. PyTorch'tan Export — <code>torch.onnx.export</code></h2>
<p class="l-text">PyTorch iki exporter ile gönderilir: eski tracer-tabanlı <code>torch.onnx.export</code> ve yeni <code>torch.onnx.dynamo_export</code> (TorchDynamo kullanır, kontrol akışında çok daha iyi). Her ikisi de ONNX dosyaları üretir; dynamo yolu transformer modelleri için 2024+ varsayılanıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Gerçek PyTorch -&gt; ONNX export (torch gerektirir, tarayıcıda çalışmaz)
import torch
import torch.nn as nn

class TinyMLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)
    def forward(self, x):
        return self.fc2(torch.relu(self.fc1(x)))

model = TinyMLP().eval()
dummy = torch.randn(1, 784)

# Eski tracer yolu
torch.onnx.export(model, dummy, "tiny_mlp.onnx",
                  input_names=["x"], output_names=["logits"],
                  dynamic_axes={"x": {0: "batch"}, "logits": {0: "batch"}},
                  opset_version=17)

# Yeni dynamo yolu (PyTorch 2.0+)
exported = torch.onnx.dynamo_export(model, dummy)
exported.save("tiny_mlp_dynamo.onnx")

# onnxruntime ile doğrula
import onnxruntime as ort
sess = ort.InferenceSession("tiny_mlp.onnx")
out = sess.run(None, {"x": dummy.numpy()})
print(out[0].shape)  # (1, 10)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) TinyMLP'yi tanımlar — ReLU'lu iki Linear katman; <code>.eval()</code> dropout/batchnorm-training-mode'unu devre dışı bırakır, export öncesi kritik çünkü tracer modeli hangi modda ise dondurur. 2) batch=1 ile bir <code>dummy</code> tensor oluşturur — tracer bu input ile bir forward pass çalıştırır ve her op'u ONNX graph'ına kaydeder. 3) Eski <code>torch.onnx.export</code>: <code>tiny_mlp.onnx</code>'i opset 17'de adlandırılmış I/O ve x ile logits'in 0. ekseninin sembolik olduğunu beyan eden <code>dynamic_axes</code> ile çıkarır — bu beyan olmadan runtime batch ≠ 1 olan herhangi bir batch'i reddederdi. 4) Dynamo yolu: <code>torch.onnx.dynamo_export</code>, tracing yerine TorchDynamo'nun sembolik yakalamayı kullanır, böylece tracer'ın ya pişireceği ya da başarısız olacağı Python kontrol akışını (if/for) idare eder — bu transformer'lar için 2024+ varsayılan yoludur. 5) <code>onnxruntime.InferenceSession</code> aracılığıyla yükler ve aynı dummy'yi çalıştırır — <code>sess.run(None, ...)</code> tüm çıkışları döndürür; (1, 10) şekli round-trip'in PyTorch ile eşleştiğini doğrular.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tuzak 1 — dynamic axes</div><div class="card-body"><code>dynamic_axes</code>'i unutursanız, export edilen model dummy batch boyutuna kilitlenir. Çıkarımda hangi eksenlerin değişebileceğini her zaman beyan edin (batch, sequence length).</div></div>
<div class="calc-card"><div class="card-title">Tuzak 2 — custom op'lar</div><div class="card-body">Standart olmayan herhangi bir op (custom CUDA kernel, FlashAttention) ONNX'te <code>com.example.MyOp</code> olur ve çoğu runtime onu çalıştırmaz. Ya standart op'larda yeniden yazın ya da hedef runtime için bir custom op DLL inşa edin.</div></div>
<div class="calc-card"><div class="card-title">Tuzak 3 — opset uyumsuzluğu</div><div class="card-body">Opset 22'de export edip opset 17'yi destekleyen bir TFLite-2023 runtime'ına dağıtmak = hiçbir şey çalışmaz. Export ETMEDEN ÖNCE her zaman hedefin desteklediği opset'i kontrol edin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ONNXRuntime — Varsayılan Cross-Platform Motor</h2>
<p class="l-text">ONNXRuntime (ORT, Microsoft, BSD lisanslı), kanonik ONNX tüketicisidir. Tek C/C++/Python/JS/Java/.NET API'si; CPU, CUDA, DirectML, CoreML, OpenVINO, TensorRT, ROCm, QNN (Qualcomm) üzerinde çalışır — her biri için doğru "execution provider" (EP) yüklemenin maliyeti karşılığında.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CPU EP — varsayılan</div><div class="card-body">SIMD-optimize (AVX2, AVX-512, NEON). Küçük modeller, klasik ML (sklearn-via-ONNX), batch-1 gecikmeye duyarlı iş yükleri için iyi.</div></div>
<div class="calc-card"><div class="card-title">CUDA EP — NVIDIA GPU'lar</div><div class="card-body">cuDNN-destekli kernel'ler. Sağlam temel; üretim servisi için TensorRT EP genellikle yener.</div></div>
<div class="calc-card"><div class="card-title">CoreML EP — Apple Silicon</div><div class="card-body">Desteklenen op'ları Apple Neural Engine'e iter. Desteklenmeyen op'lar için CPU'ya geri döner. İyi ama yerel CoreML dönüşümü kadar sıkıca ayarlanmamış (L6).</div></div>
<div class="calc-card"><div class="card-title">DirectML EP — Windows GPU'lar</div><div class="card-body">Vendor-agnostik Windows GPU API'si. NVIDIA, AMD, Intel, Qualcomm GPU'larında tek bir binary'den çalışır. Windows Copilot+ PC'lerde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">QNN EP — Qualcomm NPU'lar</div><div class="card-body">Snapdragon X Elite üzerinde Hexagon DSP ve HTP'yi hedefler. Yakın zamanda eklendi; cihaz-üstü AI için Copilot+ için anahtar.</div></div>
<div class="calc-card"><div class="card-title">WebGPU / WebGL / WASM EP'ler</div><div class="card-body">onnxruntime-web aracılığıyla tarayıcıda ONNX çalıştırın. ONNX-Web ve (bazen) Transformers.js (L7) için temel.</div></div>
</div>

<p class="l-text">Tek bir ORT kurulumu birçok backend'i hedefleyebilir: <code>session = InferenceSession("model.onnx", providers=["CUDAExecutionProvider", "CPUExecutionProvider"])</code> önce CUDA'yı dener, CPU'ya geri düşer. "Sihir" gerçektir ama her EP'nin hangi op'ları desteklediğine bağlıdır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. OpenVINO — Intel'in Çıkarım Toolkit'i</h2>
<p class="l-text">OpenVINO (Open Visual Inference and Neural Network Optimization, Intel, 2018), Intel'in TensorRT'a cevabıdır. Intel CPU'ları (yerleşik AVX-VNNI / AMX ile), Intel Arc GPU'ları, eski Movidius Myriad VPU'ları ve yeni Meteor Lake / Lunar Lake NPU'larını hedefler. ONNX, TensorFlow, PyTorch (OpenVINO 2024+ aracılığıyla) ve PaddlePaddle kabul eder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Intermediate Representation (IR)</div><div class="card-body">OpenVINO modelinizi kendi IR'ına derler (.xml + .bin). Eskiden gerekliydi; 2024+'da <code>ov.compile_model("model.onnx")</code> yapabilir ve dönüşüm adımını atlayabilirsiniz.</div></div>
<div class="calc-card"><div class="card-title">Quantization (POT, NNCF)</div><div class="card-body">Post-Training Optimization Tool ve Neural Network Compression Framework — Intel'in PTQ + QAT pipeline'ı. Birkaç satırda otomatik kalibrasyon ile INT8.</div></div>
<div class="calc-card"><div class="card-title">Performans</div><div class="card-body">Intel CPU'larında, OpenVINO AMX/AVX-VNNI ayarlama yoluyla vanilla ORT-CPU'yu tipik olarak 1.3–2x yener. Lunar Lake NPU'larında tek yoldur (henüz üçüncü taraf desteği yok).</div></div>
<div class="calc-card"><div class="card-title">Kullanım alanları</div><div class="card-body">Endüstriyel CV (tarihsel çekirdek pazar), Copilot+ PC'ler (2024–), Arc GPU'larda Stable Diffusion, NUC'larda ses asistanları.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. TensorRT — NVIDIA'nın Çıkarım Compiler'ı</h2>
<p class="l-text">TensorRT (NVIDIA, 2017), NVIDIA GPU'lar için çıkarım compiler'ıdır. ONNX veya PyTorch'u (Torch-TensorRT aracılığıyla) alır, agresif graph optimizasyonları (kernel fusion, katman yeniden sıralama, hassasiyet düşürme, GPU SKU başına kernel auto-tuning) uygular ve ~tepe donanım throughput'unda çalışan serileştirilmiş bir engine (.plan) çıkarır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Optimizasyonlar</div><div class="card-body">Layer fusion (Conv + BN + ReLU → tek kernel), hassasiyet kalibrasyonu (kalibrasyon verisiyle FP32 → FP16/INT8/FP8), kernel auto-tuning ((op, shape, GPU) tuple başına en hızlı kernel'i seçer), dynamic shape desteği.</div></div>
<div class="calc-card"><div class="card-title">TensorRT-LLM (özelleşmiş)</div><div class="card-body">LLM serving için ayarlanmış 2023 fork'u: in-flight batching, paged KV cache (vLLM tarzı), quantize edilmiş matmul'lar (W8A8 SmoothQuant, W4A16 AWQ). H100/H200'de state-of-the-art LLM throughput'u.</div></div>
<div class="calc-card"><div class="card-title">Ödünleşimler</div><div class="card-body">.plan engine, belirli bir GPU mimarisine kilitlenir (Ampere, Hopper, Blackwell). Dağıtım hedefi başına derlersiniz. Büyük modeller derlemek 30+ dakika sürer.</div></div>
<div class="calc-card"><div class="card-title">Edge varyantı — Jetson</div><div class="card-body">TensorRT, NVIDIA Jetson modüllerinde çalışır (Orin Nano, AGX Orin). Aynı API'ler, ARM CPU + entegre GPU, robotik, drone'lar, akıllı kameralarda kullanılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CoreML &amp; TFLite — Mobil Düopol</h2>
<p class="l-text">Telefonlar için, genellikle ONNX dünyasını tamamen terk eder ve platform-yerel formatlara dönüştürürsünüz: CoreML (iOS) veya TFLite (Android). L6 dağıtımı detaylı olarak ele alır; burada formatlara odaklanıyoruz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CoreML (.mlpackage)</div><div class="card-body">Apple'ın formatı. Op başına CPU + GPU (Metal) + Apple Neural Engine yönlendirmesini destekler. Quantization (linear, palettized, INT8/INT4). <code>coremltools.convert(onnx_model)</code> aracılığıyla veya doğrudan PyTorch'tan <code>coremltools.convert(traced_pt_model)</code> aracılığıyla dönüştürün. 2024'te yeni: stateful modeller (cihaz-üstü LLM'ler için KV cache desteği).</div></div>
<div class="calc-card"><div class="card-title">TFLite (.tflite)</div><div class="card-body">FlatBuffer formatı (protobuf ek yükü yok). Android'i (NNAPI → Hexagon / Tensor TPU / GPU), iOS'u, mikrodenetleyicileri (TFLite Micro) hedefler. <code>tf.lite.TFLiteConverter</code> veya <code>tf2onnx</code> ters yolu aracılığıyla dönüştürün. Quantization (dynamic range, full INT8, QAT).</div></div>
<div class="calc-card"><div class="card-title">CoreML vs TFLite — aynı hedef, farklı ekosistem</div><div class="card-body">Apple'ın NNAPI eşdeğeri CoreML; Google'ın CoreML eşdeğeri TFLite + NNAPI. İkisi de ONNX'ten dönüştürür, ikisinin de ~benzer özellik setleri vardır. Cross-platform uygulamalar için sonunda her ikisini de göndereceksiniz.</div></div>
<div class="calc-card"><div class="card-title">ExecuTorch (PyTorch yerel, 2024)</div><div class="card-body">PyTorch'un ONNX'i tamamen atlama teklifi: PyTorch modellerini doğrudan mobil ve gömülü için uygun bir runtime'a export et. CoreML (Apple ANE aracılığıyla), MediaTek, Vulkan, Qualcomm için backend'ler. 2024–25'te benimsenme alıyor ama henüz varsayılan değil.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Apache TVM — Niş Donanım için Auto-Tuning</h2>
<p class="l-text">TVM (orijinal olarak UW'den, 2018; şimdi Apache projesi) derin compiler'dır. ONNXRuntime / OpenVINO / TensorRT el-ayarlanmış kernel'ler kullanırken, TVM kernel'ler <em>üretir</em> ve verilen bir (op, shape, donanım) tuple için en hızlı schedule'i bulmak için ML-tabanlı auto-tuning (AutoTVM, Ansor, MetaSchedule) kullanır. Maliyet derleme zamanının saatleri; kazanım niş veya yeni donanımda off-the-shelf runtime'lar üzerinde bazen %30–50.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Desteklenen hedefler</div><div class="card-body">Neredeyse her şey: x86, ARM CPU/GPU'lar, NVIDIA, AMD, Intel, RISC-V, Hexagon, FPGA'lar, custom ASIC'ler. "Bu rastgele yeni çipi ML için yararlı yap"ın sınırı.</div></div>
<div class="calc-card"><div class="card-title">TVM'e ne zaman uzanılır</div><div class="card-body">Vendor çıkarım SDK'sı olmayan alışılmadık donanımınız var (RISC-V vector çip, custom NPU), VEYA %30 perf'in önemli olduğu ve mühendisliği karşılayabileceğiniz yüksek hacimli bir edge ürün sıkıştırıyorsunuz. Prototipler için DEĞİL.</div></div>
<div class="calc-card"><div class="card-title">MLC LLM (TVM-tabanlı)</div><div class="card-body">CMU/MLC ekibinden proje — iPhone, Android, tarayıcılar (WebGPU aracılığıyla), Mac'te TVM aracılığıyla Llama-sınıfı LLM'leri çalıştırır. Orijinal WebGPU LLM demosu (2023 başı) MLC-LLM idi. Cross-device LLM dağıtımı için hala mükemmel.</div></div>
<div class="calc-card"><div class="card-title">vs llama.cpp</div><div class="card-body">llama.cpp basitlik ve CPU/Metal'de kazanır. MLC/TVM tarayıcı WebGPU'da ve heterojen yönlendirmede kazanır. Çakışırlar; ekosistem uyumuyla seçin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. GGUF vs ONNX — Hangisini Ne Zaman Seçersin</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GGUF kazanır</div><div class="card-body">Açık-ağırlıklı LLM'ler (Llama, Mistral, Qwen, DeepSeek, Phi). Tek dosyalı dağıtım. Dizüstü/masaüstünde çalıştıran güç kullanıcıları. Ağır quantization (Q2_K'dan Q8_0'a). Yerel-LLM ekosistemiyle sıkı entegrasyon (Ollama, LM Studio).</div></div>
<div class="calc-card"><div class="card-title">ONNX kazanır</div><div class="card-body">LLM-olmayan modeller — CV, ASR (Whisper her iki yola gider ama llama.cpp dışında ONNX hakimdir), klasik ML (sklearn-via-ONNX), tablo modelleri. Cross-runtime taşınabilirliği. OpenVINO veya TensorRT veya DirectML aracılığıyla çalıştırmak istediğiniz modeller.</div></div>
<div class="calc-card"><div class="card-title">Her ikisi çalışır</div><div class="card-body">Whisper'ın GGUF (whisper.cpp) ve ONNX (sherpa-onnx) versiyonları vardır. Stable Diffusion'ın ONNX (Olive, OnnxStream) ve GGUF (stable-diffusion.cpp) port'ları vardır. Dağıtım hedefiyle seçin.</div></div>
<div class="calc-card"><div class="card-title">Telefonda yerel her zaman kazanır</div><div class="card-body">Mobil için, en iyi NPU kullanımı için ONNX → CoreML veya TFLite dönüştürün. ORT aracılığıyla ONNX-on-mobile çalışır ama performansı masada bırakır.</div></div>
</div>

<div class="calc-highlight"><strong>2026 varsayılanı:</strong> LLM'ler → GGUF + llama.cpp. Diğer her şey → ONNX, platforma özel yeniden dönüşüm ile (iOS için CoreML, Android için TFLite, bulut NVIDIA için TensorRT, bulut Intel için OpenVINO).</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. NumPy "Fake ONNX" — 40 Satırda Graph IR</h2>
<p class="l-text">IR zihinsel modelini somut yapmak için, küçük bir NumPy uygulaması: bir graph'ı tipli op'ların listesi olarak tanımla, pickle (protobuf için proxy) aracılığıyla serileştir, yeniden yükle ve yürüt. Gerçek ONNX ile aynı şekil, çok daha küçük.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import pickle, io

# Bir "graph" node'ların bir listesidir; her node'un (op_name, inputs, output, attrs) vardır
# Initializer'lar isim -&gt; sabit tensor (ağırlıklarınız) eşler

def make_mlp_graph():
    np.random.seed(0)
    W1 = np.random.randn(4, 8).astype(np.float32) * 0.3
    W2 = np.random.randn(8, 3).astype(np.float32) * 0.3
    initializers = {"W1": W1, "W2": W2}
    nodes = [
        ("MatMul", ["x",  "W1"], "h0",   {}),
        ("Relu",   ["h0"],        "h1",   {}),
        ("MatMul", ["h1", "W2"], "logits",{}),
    ]
    return {"inputs": ["x"], "outputs": ["logits"],
            "initializers": initializers, "nodes": nodes,
            "opset": 17, "ir_version": 8}

OPS = {
    "MatMul": lambda a, b: a @ b,
    "Relu":   lambda a: np.maximum(a, 0),
    "Softmax": lambda a: np.exp(a) / np.exp(a).sum(-1, keepdims=True),
}

def run_graph(graph, feeds):
    env = dict(graph["initializers"])
    env.update(feeds)
    for op, inputs, output, attrs in graph["nodes"]:
        args = [env[name] for name in inputs]
        env[output] = OPS[op](*args)
    return {name: env[name] for name in graph["outputs"]}

# İnşa et, serileştir (protobuf için proxy), yeniden yükle, çalıştır
g = make_mlp_graph()
buf = pickle.dumps(g)
print(f"Serialized 'fake ONNX' size: {len(buf)} bytes")

g2 = pickle.loads(buf)
x = np.random.randn(2, 4).astype(np.float32)
out = run_graph(g2, {"x": x})
print(f"Output shape: {out['logits'].shape}")
print(f"First row logits: {out['logits'][0].round(3).tolist()}")
print(f"Opset: {g2['opset']}, IR version: {g2['ir_version']}")
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Bir graph'ı gerçek ONNX'in sahip olduğu aynı dört parçaya sahip bir Python dict olarak tanımlar: <code>inputs</code>/<code>outputs</code> (adlandırılmış dış tensorlar), <code>initializers</code> (numpy array olarak sabit ağırlıklar), <code>nodes</code> (topolojik sıralı (op, input_names, output_name, attrs) tuple'ların listesi) ve <code>opset</code>/<code>ir_version</code> metadata. 2) OPS dict, runtime'ın "operator implementation" tablosudur — ONNXRuntime, OpenVINO, TensorRT'nin her birinin taşıdığı tam olarak budur, sadece NumPy lambda yerine kendi kernel'leri ile. MatMul'un sadece <code>a @ b</code> olduğuna dikkat edin; runtime takası tüm oyundur. 3) <code>pickle.dumps(g)</code>, protobuf serileştirme için yer tutucudur — aynı fikir: şemayı olan herkesin okuyabileceği kararlı binary. Gerçek ONNX ~10x daha kompakttır ve tiplerde daha katıdır. 4) Yükleme round-trip yapar ve <code>run_graph</code> topolojik olarak yürütür: <code>env</code>'i ağırlıklar + feeds ile önceden doldurur, sonra her node için adlandırılmış girdileri çek, op'u uygula, adlandırılmış çıktıyı sakla. Bu üç satırlık yorumlayıcı tam olarak her ONNX runtime'ının iç döngüsüdür. 5) batch-2 input için çıktı şekli (2, 3) raporlar — yukarıdaki 2. adımda dynamic_axes'in bize verdiği aynı özellik olan sembolik-batch fikrinin herhangi bir eksen takibi olmadan çalıştığını kanıtlar.</p>

<p class="l-text">Gerçek ONNX formatı şunları ekler: pickle yerine protobuf, resmi tip/şekil çıkarımı, &gt;200 op, dynamic şekiller, model metadata'sı. Ama zihinsel model tam olarak budur — initializer'lı tipli op'ların serileştirilmiş bir DAG'ı, op'ları uygulayan herhangi bir runtime tarafından yürütülebilir. Bunu içselleştirdiğinizde, her export hatası ve her "operator not supported" mesajı anlamlı olmaya başlar.</p>
</div>`
};
