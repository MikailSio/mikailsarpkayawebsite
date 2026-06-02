window.EDGE_L1 = {
en: `<p class="l-text"><strong>Cloud inference is not the only option, and for a growing class of products it is the wrong one.</strong> When a voice assistant must respond in 200ms, when a hospital cannot send patient data over the network, when a car has to localize itself in a tunnel where 5G drops, when a smart watch needs to do all-day inference on a 350mAh battery — the model has to live on the device. Edge ML is the engineering discipline of squeezing models onto phones, browsers, microcontrollers, cars, and laptops, and the 2024–2026 window has been a turning point: 1B-3B parameter LLMs (Phi-3-mini, Gemma 2 2B, Llama 3.2 1B/3B) now run on a phone with INT4 quantization at 20–40 tokens/second, and Apple's Neural Engine in the iPhone 15 Pro hits 38 TOPS at sub-watt power.</p>

<p class="l-text">In this lesson we map the entire field. We make precise the four reasons to push compute to the edge — <em>latency</em>, <em>privacy</em>, <em>cost</em>, and <em>offline availability</em> — quantify each with concrete numbers, and look at the kinds of products that absolutely require it (real-time CV, medical, AR/VR, automotive, on-device LLMs). We also draw a clean line between "edge inference" (model runs locally, weights public) and "federated learning" (model trains across devices, weights never leave them) and preview the 7 lessons that build the full toolchain: quantization, pruning, distillation, GGUF, ONNX, mobile, browser ML, and a capstone that puts a Whisper + Phi-3 + TTS pipeline on a Raspberry Pi.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Quantify the four edge tradeoffs (latency, privacy, cost, offline) with concrete millisecond and dollar numbers</li>
<li>Identify product classes that require edge inference vs. those better served by cloud</li>
<li>Map the 2026 device tier: phones (Apple Neural Engine, Qualcomm Hexagon), laptops (M-series, Snapdragon X), browsers (WebGPU), microcontrollers (Cortex-M, ESP32)</li>
<li>Distinguish edge inference from federated learning and from split inference</li>
<li>Estimate a latency budget for real-time pipelines (voice assistant, AR overlay, autonomous driving)</li>
<li>Place the upcoming 7 lessons of the track on a single roadmap</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Four Reasons to Stay on the Device</h2>
<p class="l-text">When you ship an ML feature, the default 2020s answer was "call an API". By 2026 that default has cracked. There are exactly four reasons to push compute back to the device, and any non-trivial product hits at least one of them.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Latency</div><div class="card-body">A round-trip to a cloud GPU is 50–300ms even on good 5G; in poor coverage it is 1–3s. For voice assistants, AR, gaming, robotics, autonomous driving — every milliseconds matters. On-device inference can hit <em>10ms</em> for a small CNN on Apple Neural Engine. The cloud cannot compete.</div></div>
<div class="calc-card"><div class="card-title">2. Privacy</div><div class="card-body">Some data legally cannot leave the device. Medical (HIPAA, GDPR Article 9), financial, juvenile content, on-device biometrics (Face ID), keystroke autocomplete, photo libraries. If the inference happens locally, the data never enters a server log, never sits in a backup, never appears in a subpoena.</div></div>
<div class="calc-card"><div class="card-title">3. Cost</div><div class="card-body">Cloud GPU inference is roughly $0.50–$10 per million tokens or $0.001–$0.05 per image, multiplied by your DAU. On-device is free per call after the model is downloaded. For a free app with 1M DAU and 10 calls/day, cloud LLM costs $30k–$3M/month; on-device is the cost of a one-time 2GB download.</div></div>
<div class="calc-card"><div class="card-title">4. Offline / availability</div><div class="card-body">Tunnels, planes, rural areas, factory floors, ships, surgeries with sterile fields, war zones. Anything safety-critical that loses the network must keep working. On-device models do.</div></div>
</div>

<div class="calc-highlight"><strong>Decision rule:</strong> if the product is "always online, latency-tolerant, non-sensitive, low-traffic" — cloud wins. Hit any of those four switches and the device starts to look attractive. Hit two and on-device is the right answer.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The 2026 Device Tier — From M4 to Cortex-M0</h2>
<p class="l-text">"Edge" is a spectrum that spans 7 orders of magnitude in compute. Knowing where your target device sits on this ladder dictates which model size and which technique applies.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tier 1 — Laptops (Apple M4, Snapdragon X Elite, NVIDIA RTX laptops)</div><div class="card-body">10–40 TOPS on NPU, 30–100 TOPS on GPU. 16–64GB unified memory. Can run 7B–13B INT4 LLMs comfortably. This is where Ollama and LM Studio shipped first.</div></div>
<div class="calc-card"><div class="card-title">Tier 2 — Premium phones (iPhone 15 Pro, Pixel 9 Pro, Galaxy S24)</div><div class="card-body">15–38 TOPS NPU (Apple Neural Engine, Google Tensor G4, Qualcomm Hexagon). 8–16GB RAM. Can run 1B–3B INT4 LLMs at 20–40 tok/s. Phi-3-mini, Gemma 2 2B, Llama 3.2 3B all target this tier.</div></div>
<div class="calc-card"><div class="card-title">Tier 3 — Mid phones, smart TVs, Raspberry Pi 5</div><div class="card-body">2–8 TOPS. 4–8GB RAM. Can run 1B INT4 LLMs at 5–15 tok/s, small CNN/ASR comfortably. Whisper-Tiny (39M) is the canonical "fits anywhere" speech model.</div></div>
<div class="calc-card"><div class="card-title">Tier 4 — Smart watches, AR glasses, dashcams</div><div class="card-body">100–500 GOPS. 1–4GB RAM. Quantized object detectors (YOLOv8n INT8), keyword spotting, simple ASR. No general LLM yet.</div></div>
<div class="calc-card"><div class="card-title">Tier 5 — Microcontrollers (Cortex-M4/M7, ESP32, Arduino Nano BLE)</div><div class="card-body">10–500 MOPS. 64KB–1MB RAM. TinyML domain — TensorFlow Lite Micro, sub-100KB models, often INT8 or even binary. Use cases: keyword spotting ("Hey Siri" detector), gesture recognition, predictive maintenance.</div></div>
</div>

<p class="l-text">A useful number: a top-end iPhone in 2026 has roughly the same ML compute (38 TOPS) as a 2018 NVIDIA V100 datacenter GPU (~30 TF16 TFLOPS). The whole reason on-device LLMs work is that we crossed the threshold where consumer NPUs caught up to last-decade datacenter accelerators.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Real-Time CV — Where Latency Forces the Edge</h2>
<p class="l-text">Computer vision on real-time video streams is the canonical edge use case. A 30fps camera produces a frame every 33ms; if your inference takes longer than that, you drop frames. A round-trip to a cloud GPU is 100–300ms — between 3 and 9 frames of lag — which is unusable for AR, drones, autonomous driving, or live filters.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Snapchat / Instagram filters</div><div class="card-body">Face landmark detection + segmentation at 30fps on mid-range phones. Models like MediaPipe Face Mesh (~3MB INT8) and SegFormer-B0 quantized run in 10–20ms on Snapdragon 8 Gen 3.</div></div>
<div class="calc-card"><div class="card-title">Tesla / Mobileye autopilot</div><div class="card-body">Multi-camera object detection + lane tracking at 36fps. Custom inference chips (Tesla HW4 ~100 TOPS), models compiled to fixed pipelines. A network drop must not stop the car.</div></div>
<div class="calc-card"><div class="card-title">Apple Vision Pro / Meta Quest 3</div><div class="card-body">Hand tracking, eye tracking, scene understanding, world reconstruction — all at 90fps with single-digit-ms motion-to-photon. Round-trip to cloud is impossible; the entire stack is on-device.</div></div>
<div class="calc-card"><div class="card-title">Industrial defect detection</div><div class="card-body">Cameras on conveyor belts running YOLO variants on Jetson Orin Nano (40 TOPS, $250). 1000 items/minute throughput, no cloud dependency.</div></div>
</div>

<div class="calc-highlight"><strong>Frame budget arithmetic:</strong> at 30fps you have 33ms per frame for capture + preprocess + inference + postprocess + render. Inference typically gets 10–15ms — and that constraint is what drives every quantization, pruning, and architecture choice in the next 7 lessons.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Federated Learning — Train Without Sending Data</h2>
<p class="l-text">Edge inference moves the model to the data. <strong>Federated learning</strong> (McMahan et al., 2017, "Communication-Efficient Learning of Deep Networks from Decentralized Data") goes further: the <em>training</em> happens across devices, and only model updates — never raw data — leave each device. The canonical example is Google's GBoard next-word prediction, which has been federated since 2017.</p>

<div class="katex-block">$$w_{t+1} = w_t + \\eta \\sum_{k=1}^{K} \\frac{n_k}{n} \\Delta w_k$$</div>

<p class="l-text">where each device <code>k</code> trains locally on its <code>n_k</code> samples for a few SGD steps, ships back the gradient delta <code>Δw_k</code>, and the central server aggregates a weighted average (FedAvg). The server never sees a single user keystroke, photo, or message.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cross-device FL</div><div class="card-body">Millions of phones, each with little data and intermittent connectivity. Used by Google (GBoard, Pixel keyboards), Apple (Siri suggestions, QuickType), WhatsApp emoji prediction. Heavy challenges: stragglers, non-IID data, dropouts.</div></div>
<div class="calc-card"><div class="card-title">Cross-silo FL</div><div class="card-body">Tens of organizations (hospitals, banks) each holding lots of data they cannot legally share. Used in medical imaging consortia (NVIDIA Clara Federated), drug discovery, and bank fraud detection.</div></div>
<div class="calc-card"><div class="card-title">Differential privacy add-on</div><div class="card-body">FL alone leaks information through gradients (membership inference, gradient leakage attacks). Production systems add DP-SGD: clip gradients and add Gaussian noise before sending. Apple's local DP, Google's RAPPOR are the deployed forms.</div></div>
<div class="calc-card"><div class="card-title">Frameworks</div><div class="card-body">TensorFlow Federated (Google), Flower (open source, framework-agnostic), NVIDIA FLARE, OpenFL (Intel). PySyft for academic work.</div></div>
</div>

<p class="l-text">In this track we focus on edge <em>inference</em>, but federated training shows up again at L8 — the capstone notes how a deployed voice assistant could collect user feedback federated to improve the wake-word detector without ever uploading audio.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Toolchain — From PyTorch to a Phone in 6 Steps</h2>
<p class="l-text">A model born in PyTorch on an A100 takes a specific journey to land on an iPhone. The 6 stages below match exactly the next 7 lessons of this track.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Train (PyTorch / JAX)</div><div class="card-body">Standard FP32 or BF16 training on cloud GPUs. Output: a <code>.pt</code> or <code>.safetensors</code> checkpoint at full precision.</div></div>
<div class="calc-card"><div class="card-title">2. Compress: quantize (L2)</div><div class="card-body">FP32 → INT8 or INT4 — typically 4–8x size reduction with &lt;1% accuracy drop using GPTQ / AWQ. Covered in edge-L2.</div></div>
<div class="calc-card"><div class="card-title">3. Compress: prune + distill (L3)</div><div class="card-body">Magnitude pruning removes near-zero weights; distillation trains a student on a teacher's soft labels. DistilBERT, TinyLlama, Phi-3-mini are all distilled.</div></div>
<div class="calc-card"><div class="card-title">4. Convert format (L4, L5)</div><div class="card-body">PyTorch → GGUF (for llama.cpp, the LLM-on-laptop ecosystem), or PyTorch → ONNX (universal interchange) → CoreML / TFLite / TensorRT / OpenVINO depending on target.</div></div>
<div class="calc-card"><div class="card-title">5. Deploy on target (L6, L7)</div><div class="card-body">Mobile (iOS CoreML, Android TFLite-NNAPI), browser (Transformers.js + WebGPU), or laptop (Ollama, LM Studio).</div></div>
<div class="calc-card"><div class="card-title">6. Build the product (L8)</div><div class="card-body">Wire ASR + LLM + TTS, manage memory, profile latency, ship. The capstone (edge-L8) does this end-to-end with Whisper-Tiny + Phi-3-mini + a TTS engine on Raspberry Pi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Latency Budget — A Voice Assistant in 500ms</h2>
<p class="l-text">"Real-time voice" is not an absolute — Apple research and Google design guidelines converge on <strong>500ms total round-trip</strong> as the threshold below which conversation feels natural. Above 800ms, users start talking over the assistant. Building to that budget means knowing exactly how the milliseconds get spent.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD + endpointing — 50ms</div><div class="card-body">Detect end of user speech. WebRTC VAD or Silero VAD on CPU, near-instant.</div></div>
<div class="calc-card"><div class="card-title">ASR (Whisper-Tiny INT8) — 100ms</div><div class="card-body">39M params on iPhone 15 Pro Neural Engine. Small streaming variants (Whisper-Streaming, faster-whisper INT8) hit 80–120ms for a 3-second utterance.</div></div>
<div class="calc-card"><div class="card-title">LLM (Phi-3-mini Q4_K_M) — 200ms (first token + 30 tokens)</div><div class="card-body">3.8B params, ~2.4GB GGUF, 30 tok/s on iPhone 15 Pro. First-token latency ~80ms, then 33ms/token. A 30-token reply lands in ~180–200ms.</div></div>
<div class="calc-card"><div class="card-title">TTS (Piper, Coqui XTTS, on-device) — 100ms</div><div class="card-body">Streaming neural TTS. First audio chunk in 50–150ms.</div></div>
<div class="calc-card"><div class="card-title">Network overhead — 0ms</div><div class="card-body">Everything is local — that is the whole point.</div></div>
</div>

<div class="calc-highlight"><strong>Total: ~450ms.</strong> That number is achievable today on flagship phones in 2026. A cloud round-trip with the same models would add 100–300ms of network latency and break the budget. This is why on-device voice assistants are inevitable, and why edge-L8 builds exactly this pipeline.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. INT8 Quantization Sneak Preview — The Math in 20 Lines</h2>
<p class="l-text">L2 goes deep on quantization. To set the stage, here is the simplest case — symmetric per-tensor INT8 — implemented in pure NumPy. The math is just two lines, but it is the foundation everything else extends.</p>

<div class="katex-block">$$q = \\text{round}\\left(w \\cdot \\frac{127}{\\max|w|}\\right), \\quad \\hat{w} = q \\cdot \\frac{\\max|w|}{127}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Pretend this is one weight matrix from a linear layer
np.random.seed(0)
W_fp32 = np.random.randn(512, 512).astype(np.float32)

# Symmetric per-tensor INT8 quantization
max_abs = np.max(np.abs(W_fp32))
scale = 127.0 / max_abs
W_int8 = np.round(W_fp32 * scale).clip(-127, 127).astype(np.int8)

# Dequantize for inference (real INT8 kernels skip this and do INT8 matmul directly)
W_dequant = W_int8.astype(np.float32) / scale

# Measure error and size
err = np.mean(np.abs(W_fp32 - W_dequant))
size_fp32 = W_fp32.nbytes
size_int8 = W_int8.nbytes
print(f"Mean abs error: {err:.5f}")
print(f"FP32 size: {size_fp32/1024:.1f} KB")
print(f"INT8 size: {size_int8/1024:.1f} KB")
print(f"Compression: {size_fp32/size_int8:.1f}x")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a 512x512 FP32 weight matrix from a fixed seed so the numbers reproduce — this stands in for one linear layer of any transformer. 2) Computes <code>max_abs</code> = the largest absolute weight; this single number defines the symmetric quantization range and is why this scheme is called "per-tensor symmetric". 3) Multiplies by 127/max_abs to stretch the range to INT8's [-127, 127], rounds, clips, and casts — the round is where information is lost. 4) Dequantizes back to FP32 only to measure error; a real INT8 kernel (oneDNN, XNNPACK, Apple ANE) never does this step — it consumes INT8 directly and produces INT32 accumulators. 5) Reports a mean absolute error around 0.003 against a Gaussian weight distribution and a 4.0x storage compression — exactly the trade GPTQ/AWQ in L2 will push to 8x with INT4.</p>

<p class="l-text">This code prints a mean absolute error around 0.003 and a 4x compression. That 4x — combined with INT8 matmul kernels that run 2–4x faster than FP32 on modern CPUs and NPUs — is why every on-device LLM, every TFLite model, every CoreML model, and every llama.cpp deployment uses INT8 or smaller. L2 takes this from per-tensor symmetric to per-channel asymmetric, then to GPTQ, AWQ, and SmoothQuant.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. What's Coming — Roadmap of edge-L2 to edge-L8</h2>
<p class="l-text">Each upcoming lesson tackles one stage of the toolchain. Read this as the map you can refer back to.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">L2 — Quantization deep dive</div><div class="card-body">INT8/INT4/FP8, GPTQ (Frantar 2022), AWQ (Lin 2023), SmoothQuant (Xiao 2023), calibration sets, accuracy-size tradeoff curves.</div></div>
<div class="calc-card"><div class="card-title">L3 — Pruning &amp; distillation</div><div class="card-body">Magnitude pruning, lottery ticket (Frankle 2018), structured vs unstructured, Hinton 2015 distillation, DistilBERT, TinyLlama, Phi-3-mini.</div></div>
<div class="calc-card"><div class="card-title">L4 — GGUF &amp; llama.cpp</div><div class="card-body">Gerganov's format, Q4_K_M / Q5_K_S / Q8_0, the llama.cpp pipeline, Ollama, LM Studio, GPT4All.</div></div>
<div class="calc-card"><div class="card-title">L5 — ONNX &amp; model formats</div><div class="card-body">ONNX export, ONNXRuntime, OpenVINO, TensorRT, CoreML, TFLite, Apache TVM. The "convert once, run anywhere" promise (and where it cracks).</div></div>
<div class="calc-card"><div class="card-title">L6 — Mobile (iOS, Android)</div><div class="card-body">CoreML on Apple Neural Engine, TFLite on Hexagon DSP and Google Tensor TPU, benchmarking tools, real numbers from the field.</div></div>
<div class="calc-card"><div class="card-title">L7 — Browser ML</div><div class="card-body">WebGPU compute shaders, ONNX-Web, Transformers.js (Xenova), WebLLM, Pyodide for ML demos. The "no install" frontier.</div></div>
<div class="calc-card"><div class="card-title">L8 — Capstone</div><div class="card-body">A working on-device voice assistant: Whisper-Tiny + Phi-3-mini (or Gemma 2 2B) + Piper TTS, deployed to a Raspberry Pi 5 and a phone, profiled to the millisecond.</div></div>
</div>

<p class="l-text">By the end of L8, you will have shipped a real model to a real device and held a conversation with it offline. That is the entire point of the track.</p>
</div>`,
tr: `<p class="l-text"><strong>Bulut çıkarımı tek seçenek değildir, ve giderek büyüyen bir ürün sınıfı için yanlış seçenektir.</strong> Bir ses asistanı 200ms içinde cevap vermek zorundayken, bir hastane hasta verisini ağ üzerinden gönderemediğinde, bir araba 5G'nin düştüğü bir tünelde kendini konumlandırmak zorunda olduğunda, bir akıllı saat 350mAh pil ile gün boyu çıkarım yapmak istediğinde — model cihazda yaşamak zorundadır. Edge ML, modelleri telefonlara, tarayıcılara, mikrodenetleyicilere, arabalara ve dizüstü bilgisayarlara sığdırmanın mühendislik disiplinidir, ve 2024–2026 penceresi bir dönüm noktası oldu: 1B-3B parametre LLM'ler (Phi-3-mini, Gemma 2 2B, Llama 3.2 1B/3B) artık bir telefonda INT4 quantization ile saniyede 20–40 token hızında çalışıyor, ve iPhone 15 Pro'daki Apple Neural Engine watt altı güçte 38 TOPS'a ulaşıyor.</p>

<p class="l-text">Bu derste tüm alanı haritalandırıyoruz. Hesaplamayı uca taşımanın dört nedenini — <em>gecikme</em>, <em>gizlilik</em>, <em>maliyet</em> ve <em>çevrimdışı erişilebilirlik</em> — net rakamlarla somutlaştırıyoruz, her birini concrete sayılarla ölçüyoruz, ve mutlaka uca ihtiyaç duyan ürün sınıflarına bakıyoruz (gerçek zamanlı CV, tıbbi, AR/VR, otomotiv, cihaz-üstü LLM'ler). Ayrıca "edge inference" (model yerel çalışır, ağırlıklar herkese açık) ile "federated learning" (model cihazlar arasında eğitilir, ağırlıklar asla cihazdan ayrılmaz) arasında net bir çizgi çekiyoruz ve tüm araç zincirini inşa eden 7 dersi öncelendiriyoruz: quantization, budama, damıtma, GGUF, ONNX, mobil, tarayıcı ML ve bir Whisper + Phi-3 + TTS pipeline'ını Raspberry Pi'ye yerleştiren bir capstone.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dört uç ödünleşimini (gecikme, gizlilik, maliyet, çevrimdışı) somut milisaniye ve dolar rakamlarıyla ölçmek</li>
<li>Edge inference gerektiren ürün sınıflarını, buluta daha uygun olanlardan ayırt etmek</li>
<li>2026 cihaz katmanını haritalamak: telefonlar (Apple Neural Engine, Qualcomm Hexagon), dizüstüler (M-serisi, Snapdragon X), tarayıcılar (WebGPU), mikrodenetleyiciler (Cortex-M, ESP32)</li>
<li>Edge inference'ı federe öğrenmeden ve split inference'tan ayırmak</li>
<li>Gerçek zamanlı pipeline'lar için bir gecikme bütçesi tahmin etmek (ses asistanı, AR overlay, otonom sürüş)</li>
<li>Track'in gelecek 7 dersini tek bir yol haritasına yerleştirmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Cihazda Kalmanın Dört Nedeni</h2>
<p class="l-text">Bir ML özelliği gönderdiğinizde, 2020'lerin varsayılan cevabı "bir API çağır" idi. 2026'da bu varsayım çatladı. Hesaplamayı cihaza geri itmek için tam olarak dört neden vardır ve önemsiz olmayan herhangi bir ürün bunlardan en az birine çarpar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Gecikme</div><div class="card-body">Bir bulut GPU'suna gidiş-dönüş, iyi 5G'de bile 50–300ms; zayıf kapsamada 1–3s'dir. Ses asistanları, AR, oyun, robotik, otonom sürüş için — her milisaniye önemlidir. Cihaz-üstü çıkarım, Apple Neural Engine üzerinde küçük bir CNN için <em>10ms</em>'ye ulaşabilir. Bulut rekabet edemez.</div></div>
<div class="calc-card"><div class="card-title">2. Gizlilik</div><div class="card-body">Bazı veriler yasal olarak cihazdan çıkamaz. Tıbbi (HIPAA, GDPR Madde 9), finansal, çocuk içeriği, cihaz-üstü biyometri (Face ID), klavye otomatik tamamlama, fotoğraf kütüphaneleri. Çıkarım yerel gerçekleşirse, veri asla bir sunucu loguna girmez, asla bir yedeklemede oturmaz, asla bir mahkeme celbinde görünmez.</div></div>
<div class="calc-card"><div class="card-title">3. Maliyet</div><div class="card-body">Bulut GPU çıkarımı kabaca milyon token başına $0.50–$10 veya görüntü başına $0.001–$0.05'tir, DAU'nuzla çarpılır. Cihaz-üstü, model indirildikten sonra çağrı başına ücretsizdir. 1M DAU ve günde 10 çağrılı ücretsiz bir uygulama için, bulut LLM ayda $30k–$3M tutar; cihaz-üstü ise tek seferlik 2GB indirmenin maliyetidir.</div></div>
<div class="calc-card"><div class="card-title">4. Çevrimdışı / erişilebilirlik</div><div class="card-body">Tüneller, uçaklar, kırsal alanlar, fabrika zeminleri, gemiler, steril alanlı ameliyatlar, savaş bölgeleri. Ağı kaybeden ve hayati önem taşıyan her şey çalışmaya devam etmek zorundadır. Cihaz-üstü modeller bunu yapar.</div></div>
</div>

<div class="calc-highlight"><strong>Karar kuralı:</strong> ürün "her zaman çevrimiçi, gecikmeye toleranslı, hassas olmayan, düşük trafikli" ise — bulut kazanır. Bu dört anahtardan herhangi birine çarpın ve cihaz çekici görünmeye başlar. İkisine çarpın ve cihaz-üstü doğru cevaptır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. 2026 Cihaz Katmanı — M4'ten Cortex-M0'a</h2>
<p class="l-text">"Edge", hesaplamada 7 büyüklük mertebesi kapsayan bir spektrumdur. Hedef cihazınızın bu merdivende nerede oturduğunu bilmek, hangi model boyutunun ve hangi tekniğin uygulanacağını dikte eder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katman 1 — Dizüstüler (Apple M4, Snapdragon X Elite, NVIDIA RTX dizüstüler)</div><div class="card-body">NPU üzerinde 10–40 TOPS, GPU üzerinde 30–100 TOPS. 16–64GB birleşik bellek. 7B–13B INT4 LLM'leri rahatça çalıştırabilir. Ollama ve LM Studio buraya ilk geldi.</div></div>
<div class="calc-card"><div class="card-title">Katman 2 — Premium telefonlar (iPhone 15 Pro, Pixel 9 Pro, Galaxy S24)</div><div class="card-body">15–38 TOPS NPU (Apple Neural Engine, Google Tensor G4, Qualcomm Hexagon). 8–16GB RAM. 1B–3B INT4 LLM'leri 20–40 tok/s'de çalıştırabilir. Phi-3-mini, Gemma 2 2B, Llama 3.2 3B hepsi bu katmanı hedefler.</div></div>
<div class="calc-card"><div class="card-title">Katman 3 — Orta seviye telefonlar, akıllı TV'ler, Raspberry Pi 5</div><div class="card-body">2–8 TOPS. 4–8GB RAM. 1B INT4 LLM'leri 5–15 tok/s'de, küçük CNN/ASR'leri rahatça çalıştırabilir. Whisper-Tiny (39M) "her yere sığar" konuşma modelinin kanonik örneğidir.</div></div>
<div class="calc-card"><div class="card-title">Katman 4 — Akıllı saatler, AR gözlükler, dashcam'ler</div><div class="card-body">100–500 GOPS. 1–4GB RAM. Quantize edilmiş nesne dedektörleri (YOLOv8n INT8), keyword spotting, basit ASR. Henüz genel amaçlı LLM yok.</div></div>
<div class="calc-card"><div class="card-title">Katman 5 — Mikrodenetleyiciler (Cortex-M4/M7, ESP32, Arduino Nano BLE)</div><div class="card-body">10–500 MOPS. 64KB–1MB RAM. TinyML alanı — TensorFlow Lite Micro, 100KB altı modeller, çoğunlukla INT8 hatta ikili. Kullanım alanları: keyword spotting ("Hey Siri" dedektörü), jest tanıma, kestirimci bakım.</div></div>
</div>

<p class="l-text">Yararlı bir sayı: 2026'da üst seviye bir iPhone, kabaca 2018 NVIDIA V100 veri merkezi GPU'su (~30 TF16 TFLOPS) ile aynı ML hesaplama kapasitesine (38 TOPS) sahiptir. Cihaz-üstü LLM'lerin çalışmasının nedeni tam olarak budur: tüketici NPU'larının on yıl önceki veri merkezi hızlandırıcılarına yetiştiği eşiği geçtik.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gerçek Zamanlı CV — Gecikmenin Edge'i Zorladığı Yer</h2>
<p class="l-text">Gerçek zamanlı video akışlarında bilgisayarla görme, kanonik edge kullanım durumudur. 30fps'lik bir kamera her 33ms'de bir kare üretir; çıkarımınız bundan uzun sürerse, kareleri düşürürsünüz. Bir bulut GPU'suna gidiş-dönüş 100–300ms'dir — 3 ila 9 kare gecikme — bu da AR, drone'lar, otonom sürüş veya canlı filtreler için kullanılamaz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Snapchat / Instagram filtreleri</div><div class="card-body">Orta seviye telefonlarda 30fps'de yüz işareti tespiti + segmentasyon. MediaPipe Face Mesh (~3MB INT8) ve quantize edilmiş SegFormer-B0 gibi modeller, Snapdragon 8 Gen 3 üzerinde 10–20ms'de çalışır.</div></div>
<div class="calc-card"><div class="card-title">Tesla / Mobileye otopilot</div><div class="card-body">36fps'de çoklu kamera nesne tespiti + şerit takibi. Özel çıkarım çipleri (Tesla HW4 ~100 TOPS), sabit pipeline'lara derlenmiş modeller. Bir ağ kesintisi arabayı durdurmamalıdır.</div></div>
<div class="calc-card"><div class="card-title">Apple Vision Pro / Meta Quest 3</div><div class="card-body">El takibi, göz takibi, sahne anlama, dünya yeniden inşası — hepsi 90fps'de tek haneli ms motion-to-photon ile. Buluta gidiş-dönüş imkansız; tüm yığın cihaz-üstü.</div></div>
<div class="calc-card"><div class="card-title">Endüstriyel kusur tespiti</div><div class="card-body">Konveyör bantlarındaki kameralar, Jetson Orin Nano (40 TOPS, $250) üzerinde YOLO varyantları çalıştırır. Dakikada 1000 ürün throughput, bulut bağımlılığı yok.</div></div>
</div>

<div class="calc-highlight"><strong>Kare bütçesi aritmetiği:</strong> 30fps'de yakalama + ön işleme + çıkarım + son işleme + render için kare başına 33ms vardır. Çıkarım tipik olarak 10–15ms alır — ve bu kısıtlama, sonraki 7 dersteki her quantization, budama ve mimari seçimini yönlendiren şeydir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Federe Öğrenme — Veri Göndermeden Eğitmek</h2>
<p class="l-text">Edge inference modeli veriye taşır. <strong>Federe öğrenme</strong> (McMahan ve diğ., 2017, "Communication-Efficient Learning of Deep Networks from Decentralized Data") daha da ileri gider: <em>eğitim</em> cihazlar arasında gerçekleşir ve yalnızca model güncellemeleri — asla ham veri değil — her cihazdan ayrılır. Kanonik örnek, 2017'den beri federe olan Google'ın GBoard sonraki kelime tahminidir.</p>

<div class="katex-block">$$w_{t+1} = w_t + \\eta \\sum_{k=1}^{K} \\frac{n_k}{n} \\Delta w_k$$</div>

<p class="l-text">burada her cihaz <code>k</code> kendi <code>n_k</code> örneği üzerinde birkaç SGD adımı için yerel olarak eğitir, gradyan deltasını <code>Δw_k</code> geri gönderir ve merkezi sunucu ağırlıklı bir ortalamayı toplar (FedAvg). Sunucu hiçbir kullanıcı tuş vuruşunu, fotoğrafını veya mesajını görmez.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cross-device FL</div><div class="card-body">Milyonlarca telefon, her biri az veri ve aralıklı bağlantıyla. Google (GBoard, Pixel klavyeler), Apple (Siri önerileri, QuickType), WhatsApp emoji tahmini tarafından kullanılır. Ağır zorluklar: stragglers, IID-olmayan veri, dropout'lar.</div></div>
<div class="calc-card"><div class="card-title">Cross-silo FL</div><div class="card-body">Onlarca kuruluş (hastaneler, bankalar) yasal olarak paylaşamadıkları çok veri tutar. Tıbbi görüntüleme konsorsiyumlarında (NVIDIA Clara Federated), ilaç keşfinde ve banka dolandırıcılık tespitinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Differential privacy eklentisi</div><div class="card-body">FL tek başına gradyanlar aracılığıyla bilgi sızdırır (membership inference, gradient leakage saldırıları). Üretim sistemleri DP-SGD ekler: gradyanları kırp ve göndermeden önce Gauss gürültüsü ekle. Apple'ın local DP'si, Google'ın RAPPOR'u dağıtılmış formlardır.</div></div>
<div class="calc-card"><div class="card-title">Frameworks</div><div class="card-body">TensorFlow Federated (Google), Flower (açık kaynak, framework-agnostik), NVIDIA FLARE, OpenFL (Intel). Akademik çalışma için PySyft.</div></div>
</div>

<p class="l-text">Bu track'te edge <em>inference</em>'a odaklanıyoruz, ancak federe eğitim L8'de tekrar görünür — capstone, dağıtılmış bir ses asistanının asla ses yüklemeden uyandırma kelimesi dedektörünü iyileştirmek için kullanıcı geri bildirimini nasıl federe toplayabileceğine değinir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Araç Zinciri — PyTorch'tan Telefona 6 Adımda</h2>
<p class="l-text">A100 üzerinde PyTorch'ta doğan bir model, iPhone'a inmek için belirli bir yolculuk yapar. Aşağıdaki 6 aşama tam olarak bu track'in sonraki 7 dersine karşılık gelir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Eğit (PyTorch / JAX)</div><div class="card-body">Bulut GPU'larda standart FP32 veya BF16 eğitimi. Çıktı: tam hassasiyette bir <code>.pt</code> veya <code>.safetensors</code> checkpoint.</div></div>
<div class="calc-card"><div class="card-title">2. Sıkıştır: quantize (L2)</div><div class="card-body">FP32 → INT8 veya INT4 — GPTQ / AWQ kullanılarak tipik olarak %1'den az doğruluk düşüşü ile 4–8x boyut azaltma. edge-L2'de ele alınır.</div></div>
<div class="calc-card"><div class="card-title">3. Sıkıştır: budama + damıtma (L3)</div><div class="card-body">Magnitude budama sıfıra yakın ağırlıkları kaldırır; damıtma bir öğrenciyi bir öğretmenin yumuşak etiketleri üzerinde eğitir. DistilBERT, TinyLlama, Phi-3-mini hepsi damıtılmıştır.</div></div>
<div class="calc-card"><div class="card-title">4. Format dönüştür (L4, L5)</div><div class="card-body">PyTorch → GGUF (llama.cpp, dizüstü-üstü-LLM ekosistemi için) veya PyTorch → ONNX (evrensel değişim) → hedefe bağlı olarak CoreML / TFLite / TensorRT / OpenVINO.</div></div>
<div class="calc-card"><div class="card-title">5. Hedefe dağıt (L6, L7)</div><div class="card-body">Mobil (iOS CoreML, Android TFLite-NNAPI), tarayıcı (Transformers.js + WebGPU) veya dizüstü (Ollama, LM Studio).</div></div>
<div class="calc-card"><div class="card-title">6. Ürünü inşa et (L8)</div><div class="card-body">ASR + LLM + TTS bağla, belleği yönet, gecikmeyi profille, gönder. Capstone (edge-L8) bunu Raspberry Pi'de Whisper-Tiny + Phi-3-mini + bir TTS motoru ile uçtan uca yapar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gecikme Bütçesi — 500ms'de Bir Ses Asistanı</h2>
<p class="l-text">"Gerçek zamanlı ses" mutlak değildir — Apple araştırması ve Google tasarım kuralları, konuşmanın doğal hissettiği eşik olarak <strong>500ms toplam gidiş-dönüş</strong> üzerinde birleşir. 800ms üstünde, kullanıcılar asistanın üzerine konuşmaya başlar. O bütçeye inşa etmek, milisaniyelerin tam olarak nasıl harcandığını bilmek demektir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VAD + endpointing — 50ms</div><div class="card-body">Kullanıcı konuşmasının sonunu tespit et. CPU üzerinde WebRTC VAD veya Silero VAD, neredeyse anında.</div></div>
<div class="calc-card"><div class="card-title">ASR (Whisper-Tiny INT8) — 100ms</div><div class="card-body">iPhone 15 Pro Neural Engine üzerinde 39M parametre. Küçük streaming varyantları (Whisper-Streaming, faster-whisper INT8), 3 saniyelik bir konuşma için 80–120ms'ye ulaşır.</div></div>
<div class="calc-card"><div class="card-title">LLM (Phi-3-mini Q4_K_M) — 200ms (ilk token + 30 token)</div><div class="card-body">3.8B parametre, ~2.4GB GGUF, iPhone 15 Pro üzerinde 30 tok/s. İlk token gecikmesi ~80ms, sonra token başına 33ms. 30 tokenlık bir cevap ~180–200ms'de iner.</div></div>
<div class="calc-card"><div class="card-title">TTS (Piper, Coqui XTTS, cihaz-üstü) — 100ms</div><div class="card-body">Streaming nöral TTS. İlk ses parçası 50–150ms'de.</div></div>
<div class="calc-card"><div class="card-title">Ağ ek yükü — 0ms</div><div class="card-body">Her şey yerel — ana fikir bu.</div></div>
</div>

<div class="calc-highlight"><strong>Toplam: ~450ms.</strong> Bu rakam 2026'da amiral gemisi telefonlarda bugün ulaşılabilir. Aynı modellerle bir bulut gidiş-dönüşü 100–300ms ağ gecikmesi ekler ve bütçeyi kırar. Cihaz-üstü ses asistanlarının kaçınılmaz olmasının nedeni budur ve edge-L8'in tam olarak bu pipeline'ı inşa etmesinin nedeni budur.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. INT8 Quantization Ön Bakış — 20 Satırda Matematik</h2>
<p class="l-text">L2 quantization'a derinlemesine iner. Sahneyi hazırlamak için, en basit durum — simetrik tensor-başına INT8 — saf NumPy'da uygulanmıştır. Matematik sadece iki satır, ama her şeyin uzandığı temeldir.</p>

<div class="katex-block">$$q = \\text{round}\\left(w \\cdot \\frac{127}{\\max|w|}\\right), \\quad \\hat{w} = q \\cdot \\frac{\\max|w|}{127}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Bunun bir lineer katmandan bir ağırlık matrisi olduğunu varsayın
np.random.seed(0)
W_fp32 = np.random.randn(512, 512).astype(np.float32)

# Simetrik tensor-başına INT8 quantization
max_abs = np.max(np.abs(W_fp32))
scale = 127.0 / max_abs
W_int8 = np.round(W_fp32 * scale).clip(-127, 127).astype(np.int8)

# Çıkarım için dequantize (gerçek INT8 kernel'leri bunu atlar ve doğrudan INT8 matmul yapar)
W_dequant = W_int8.astype(np.float32) / scale

# Hatayı ve boyutu ölç
err = np.mean(np.abs(W_fp32 - W_dequant))
size_fp32 = W_fp32.nbytes
size_int8 = W_int8.nbytes
print(f"Mean abs error: {err:.5f}")
print(f"FP32 size: {size_fp32/1024:.1f} KB")
print(f"INT8 size: {size_int8/1024:.1f} KB")
print(f"Compression: {size_fp32/size_int8:.1f}x")
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Sabit seed ile 512x512 FP32 ağırlık matrisi üretir — bu sayılar tekrarlanabilir olur; herhangi bir transformer'ın bir lineer katmanını temsil eder. 2) <code>max_abs</code>'ı hesaplar — en büyük mutlak ağırlık; bu tek sayı simetrik quantization aralığını tanımlar ve şemanın "tensor-başına simetrik" diye anılmasının sebebidir. 3) 127/max_abs ile çarpıp INT8'in [-127, 127] aralığına gerer, yuvarlar, kırpar ve cast eder — bilgi kaybı tam bu yuvarlamada olur. 4) Sadece hata ölçmek için FP32'ye dequantize eder; gerçek INT8 kernel'i (oneDNN, XNNPACK, Apple ANE) bu adımı asla yapmaz — INT8'i doğrudan tüketip INT32 accumulator üretir. 5) Gauss ağırlık dağılımına karşı yaklaşık 0.003 ortalama mutlak hata ve 4.0x depolama sıkıştırması raporlar — L2'deki GPTQ/AWQ'nun INT4 ile 8x'e iteceği aynı denge.</p>

<p class="l-text">Bu kod, yaklaşık 0.003 ortalama mutlak hata ve 4x sıkıştırma yazdırır. O 4x — modern CPU'larda ve NPU'larda FP32'den 2–4x daha hızlı çalışan INT8 matmul kernel'leri ile birleştiğinde — her cihaz-üstü LLM'in, her TFLite modelinin, her CoreML modelinin ve her llama.cpp dağıtımının INT8 veya daha küçüğünü kullanmasının nedenidir. L2 bunu tensor-başına simetrikten kanal-başına asimetriğe, sonra GPTQ, AWQ ve SmoothQuant'a götürür.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Ne Geliyor — edge-L2'den edge-L8'e Yol Haritası</h2>
<p class="l-text">Gelecek her ders araç zincirinin bir aşamasını ele alır. Bunu geri başvurabileceğiniz harita olarak okuyun.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">L2 — Quantization derin dalış</div><div class="card-body">INT8/INT4/FP8, GPTQ (Frantar 2022), AWQ (Lin 2023), SmoothQuant (Xiao 2023), kalibrasyon setleri, doğruluk-boyut ödünleşim eğrileri.</div></div>
<div class="calc-card"><div class="card-title">L3 — Budama &amp; damıtma</div><div class="card-body">Magnitude budama, lottery ticket (Frankle 2018), yapılı vs yapısız, Hinton 2015 damıtması, DistilBERT, TinyLlama, Phi-3-mini.</div></div>
<div class="calc-card"><div class="card-title">L4 — GGUF &amp; llama.cpp</div><div class="card-body">Gerganov'un formatı, Q4_K_M / Q5_K_S / Q8_0, llama.cpp pipeline'ı, Ollama, LM Studio, GPT4All.</div></div>
<div class="calc-card"><div class="card-title">L5 — ONNX &amp; model formatları</div><div class="card-body">ONNX export, ONNXRuntime, OpenVINO, TensorRT, CoreML, TFLite, Apache TVM. "Bir kez dönüştür, her yerde çalıştır" vaadi (ve nerede çatladığı).</div></div>
<div class="calc-card"><div class="card-title">L6 — Mobil (iOS, Android)</div><div class="card-body">Apple Neural Engine üzerinde CoreML, Hexagon DSP ve Google Tensor TPU üzerinde TFLite, benchmark araçları, sahadan gerçek rakamlar.</div></div>
<div class="calc-card"><div class="card-title">L7 — Tarayıcı ML</div><div class="card-body">WebGPU compute shader'ları, ONNX-Web, Transformers.js (Xenova), WebLLM, ML demoları için Pyodide. "Kurulum yok" sınırı.</div></div>
<div class="calc-card"><div class="card-title">L8 — Capstone</div><div class="card-body">Çalışan bir cihaz-üstü ses asistanı: Whisper-Tiny + Phi-3-mini (veya Gemma 2 2B) + Piper TTS, bir Raspberry Pi 5 ve bir telefona dağıtılmış, milisaniyeye kadar profillenmiş.</div></div>
</div>

<p class="l-text">L8'in sonunda, gerçek bir cihaza gerçek bir model göndermiş ve onunla çevrimdışı sohbet etmiş olacaksınız. Track'in tüm noktası budur.</p>
</div>`
};
