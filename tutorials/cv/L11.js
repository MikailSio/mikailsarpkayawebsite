window.CV_L11 = {

en: `<p class="l-text"><strong>Training a model is 20% of the work. The other 80% is making it run fast, cheap, and reliably in production.</strong> A 30-fps camera gives you 33 milliseconds per frame, total — preprocessing, inference, postprocessing. Miss the budget and the system collapses to a useless slideshow.</p>

<p class="l-text">In this lesson you will learn how to budget latency, compress models with quantization and pruning, export to ONNX and TensorRT, deploy on edge devices, and monitor models in production.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Budget latency across preprocess, inference, and postprocess for 30 fps</li>
<li>Shrink models with INT8 quantization and structured/unstructured pruning</li>
<li>Export PyTorch models to ONNX and convert further to TensorRT engines</li>
<li>Deploy on edge hardware — Jetson, Coral TPU, mobile GPU — with right runtime</li>
<li>Monitor production models for data drift and accuracy decay over time</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Latency Budget</h2>
<p class="l-text">Real-time vision = 30 fps = ~33 ms per frame. That budget covers the full pipeline.</p>
<div class="katex-block">$$T_{total} = T_{preprocess} + T_{inference} + T_{postprocess}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Preprocess</div><div class="card-body">Resize, normalize, color convert. Often 2–5 ms per frame.</div></div>
<div class="calc-card"><div class="card-title">Inference</div><div class="card-body">The forward pass. The largest term — usually 10–25 ms.</div></div>
<div class="calc-card"><div class="card-title">Postprocess</div><div class="card-body">NMS, decoding, drawing boxes. 2–5 ms.</div></div>
<div class="calc-card"><div class="card-title">Buffer</div><div class="card-body">Always leave 5 ms slack — GPUs miss schedule sometimes.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Quantization</h2>
<p class="l-text">Quantization replaces fp32 weights and activations with int8 (or fp16, int4). Result: 4x smaller model, 2-4x faster inference, modest accuracy loss.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PTQ</div><div class="card-body">Post-Training Quantization — calibrate on a few hundred examples.</div></div>
<div class="calc-card"><div class="card-title">QAT</div><div class="card-body">Quantization-Aware Training — simulate int8 during training for higher accuracy.</div></div>
<div class="calc-card"><div class="card-title">Dynamic</div><div class="card-body">Weights quantized, activations on the fly. Easy and effective for transformers.</div></div>
<div class="calc-card"><div class="card-title">Static</div><div class="card-body">Both weights and activations quantized using calibration stats.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

model = torch.<span class="fn">load</span>(<span class="str">'resnet.pt'</span>).<span class="fn">eval</span>()
qmodel = torch.quantization.<span class="fn">quantize_dynamic</span>(
    model, {torch.nn.Linear, torch.nn.Conv2d}, dtype=torch.qint8)
torch.<span class="fn">save</span>(qmodel.<span class="fn">state_dict</span>(), <span class="str">'resnet_int8.pt'</span>)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Show 8-bit quantization in pure numpy: scale a float weight matrix into int8, dequantize, and measure error.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

W = rng.normal(0, 0.5, size=(64, 64)).astype(np.float32)

scale = W.abs().max() / 127
W_q = np.clip(np.round(W / scale), -128, 127).astype(np.int8)
W_dq = W_q.astype(np.float32) * scale

print('orig dtype size :', W.nbytes, 'bytes')
print('int8 dtype size :', W_q.nbytes, 'bytes  ({:.1f}x smaller)'.format(W.nbytes / W_q.nbytes))
print('mean abs error  :', float(np.abs(W - W_dq).mean()).__round__(5))</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Load the trained model in eval mode. 2) <code>quantize_dynamic</code> wraps Linear and Conv2d layers to use int8 weights with per-channel scales. 3) Save the quantized state dict — usually 3–4x smaller than the fp32 original. The model can still run on CPU; for GPU int8 you typically use TensorRT instead.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Pruning and Distillation</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Unstructured pruning</div><div class="card-body">Zero out small weights individually. Saves storage; needs sparse kernels for speedup.</div></div>
<div class="calc-card"><div class="card-title">Structured pruning</div><div class="card-body">Remove entire channels or heads. Real speedup on standard hardware.</div></div>
<div class="calc-card"><div class="card-title">Distillation</div><div class="card-body">Small "student" trained to match teacher's logits. Often beats training student from scratch.</div></div>
<div class="calc-card"><div class="card-title">Combined</div><div class="card-body">Pruning + quantization + distillation can shrink a model 10x with minimal accuracy hit.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ONNX and TensorRT</h2>
<p class="l-text">PyTorch is great for research, but production usually demands a runtime that's optimized for inference and portable across hardware.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

model.<span class="fn">eval</span>()
dummy = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">3</span>, <span class="num">224</span>, <span class="num">224</span>)

torch.onnx.<span class="fn">export</span>(
    model, dummy, <span class="str">'resnet.onnx'</span>,
    input_names=[<span class="str">'input'</span>], output_names=[<span class="str">'logits'</span>],
    dynamic_axes={<span class="str">'input'</span>: {<span class="num">0</span>: <span class="str">'batch'</span>}, <span class="str">'logits'</span>: {<span class="num">0</span>: <span class="str">'batch'</span>}},
    opset_version=<span class="num">17</span>)

<span class="cm"># Inference with onnxruntime</span>
<span class="kw">import</span> onnxruntime <span class="kw">as</span> ort
sess = ort.<span class="fn">InferenceSession</span>(<span class="str">'resnet.onnx'</span>, providers=[<span class="str">'CUDAExecutionProvider'</span>])
out = sess.<span class="fn">run</span>(<span class="kw">None</span>, {<span class="str">'input'</span>: dummy.<span class="fn">numpy</span>()})
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pickle a sklearn model — same idea as ONNX export: serialize a trained model so it can be reloaded and run later.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import pickle, io
from sklearn.linear_model import LogisticRegression

X = df_iris[['sepal_length','sepal_width','petal_length','petal_width']].values
y = df_iris['species'].values
clf = LogisticRegression(max_iter=400).fit(X, y)

buf = io.BytesIO()
pickle.dump(clf, buf)
print('serialized size:', len(buf.getvalue()), 'bytes')

buf.seek(0)
clf2 = pickle.load(buf)
print('reload acc:', round(clf2.score(X, y), 3))
print('predictions match:', (clf.predict(X) == clf2.predict(X)).all())</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Trace the PyTorch model with a dummy input and export to ONNX. 2) <code>dynamic_axes</code> lets the batch dimension vary at runtime. 3) Load with ONNX Runtime; CUDAExecutionProvider runs on GPU. 4) Run inference. For maximum GPU speed, convert ONNX → TensorRT engine.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Edge Deployment</h2>
<p class="l-text">Edge devices have hard memory and power constraints. Each platform has its preferred runtime.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TFLite</div><div class="card-body">Android phones, Coral accelerators, embedded Linux.</div></div>
<div class="calc-card"><div class="card-title">Core ML</div><div class="card-body">iOS, macOS — uses the Apple Neural Engine.</div></div>
<div class="calc-card"><div class="card-title">OpenVINO</div><div class="card-body">Intel CPUs, integrated GPUs, VPUs.</div></div>
<div class="calc-card"><div class="card-title">TensorRT</div><div class="card-body">NVIDIA Jetson edge boards (Nano, Orin), datacenter GPUs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Camera Pipeline + Batching</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2, time
cap = cv2.<span class="fn">VideoCapture</span>(<span class="num">0</span>)
buffer = []

<span class="kw">while</span> <span class="kw">True</span>:
    ok, frame = cap.<span class="fn">read</span>()
    <span class="kw">if</span> <span class="kw">not</span> ok: <span class="kw">break</span>

    buffer.<span class="fn">append</span>(<span class="fn">preprocess</span>(frame))
    <span class="kw">if</span> <span class="fn">len</span>(buffer) == <span class="num">4</span>:                    <span class="cm"># micro-batch of 4</span>
        t0 = time.<span class="fn">time</span>()
        out = sess.<span class="fn">run</span>(<span class="kw">None</span>, {<span class="str">'input'</span>: np.<span class="fn">stack</span>(buffer)})
        <span class="fn">print</span>(f<span class="str">'batch ms: {(time.time()-t0)*1000:.1f}'</span>)
        buffer.<span class="fn">clear</span>()

    cv2.<span class="fn">imshow</span>(<span class="str">'cam'</span>, frame)
    <span class="kw">if</span> cv2.<span class="fn">waitKey</span>(<span class="num">1</span>) == <span class="num">27</span>: <span class="kw">break</span>

cap.<span class="fn">release</span>()
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Simulate a video stream with synthetic frames and run a per-frame inference pass — same loop you'd run on a webcam.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

def preprocess(frame):
    return frame.astype(np.float32) / 255.0

def model_predict(x):
    return float(x.mean())   # toy: average brightness

predictions = []
for t in range(10):
    frame = rng.integers(0, 255, size=(64, 64, 3), dtype=np.uint8)
    p = model_predict(preprocess(frame))
    predictions.append(p)

print('processed', len(predictions), 'frames')
print('mean pred:', round(float(np.mean(predictions)), 3))
print('first 3  :', [round(p, 3) for p in predictions[:3]])</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Open webcam with OpenCV. 2) Buffer 4 preprocessed frames before running inference. Mini-batches improve GPU utilization. 3) Print elapsed ms per batch — should sit comfortably under 4 × 33 ms = 132 ms. 4) Display each raw frame; press Esc to quit. In production, separate the producer (camera read), processor (inference), and consumer (UI/render) into threads.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Monitoring and A/B Testing</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Drift detection</div><div class="card-body">Compare input statistics (brightness, color) to training distribution. Alert on shift.</div></div>
<div class="calc-card"><div class="card-title">Confidence histograms</div><div class="card-body">Watch for sudden drops — may signal a broken camera or new failure mode.</div></div>
<div class="calc-card"><div class="card-title">Shadow deploy</div><div class="card-body">Run new model in parallel; compare outputs without affecting users.</div></div>
<div class="calc-card"><div class="card-title">A/B</div><div class="card-body">Send some users to model B; compare KPIs (accuracy, latency, complaints).</div></div>
</div>
<div id="cv-l11-plot-en" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Real-time vision = 33 ms total per frame. Budget every step.<br><strong>2.</strong> Quantization (int8) is the single biggest speedup with the least pain.<br><strong>3.</strong> Pruning and distillation compound the gains.<br><strong>4.</strong> ONNX is a portable export format; TensorRT optimizes it on NVIDIA GPUs.<br><strong>5.</strong> Pick the runtime to match your hardware: TFLite, Core ML, OpenVINO, TensorRT.<br><strong>6.</strong> Always monitor inputs and confidence in production.<br><strong>7.</strong> Next lesson: a multimodal capstone project that ties NLP and CV together.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var models = [{x:11.7, y:0.764, t:'ResNet-50'}, {x:43.6, y:0.778, t:'ResNet-152'}, {x:5.4, y:0.706, t:'MobileNetV3'}, {x:7.7, y:0.745, t:'EfficientNet-B0'}, {x:21.4, y:0.784, t:'EfficientNet-B3'}, {x:86, y:0.784, t:'ViT-Base'}];
  var trace = { x: models.map(m=>m.x), y: models.map(m=>m.y), text: models.map(m=>m.t), mode:'markers+text', textposition:'top center', marker:{color:'#c8a96e', size:12} };
  var layout = { margin:{t:20,r:20,b:50,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, xaxis:{title:'Params (M) / size'}, yaxis:{title:'ImageNet acc'} };
  var en = document.getElementById('cv-l11-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l11-plot-tr'); if (tr) Plotly.newPlot(tr, [trace], Object.assign({}, layout, {xaxis:{title:'Parametre (M) / boyut'}, yaxis:{title:'ImageNet doğruluğu'}}), {displayModeBar:false});
}, 250);</script>`,

tr: `<p class="l-text"><strong>Modeli eğitmek işin %20'sidir. Diğer %80, üretimde hızlı, ucuz ve güvenilir koşturmaktır.</strong> 30 fps bir kamera kare başına toplam 33 milisaniye verir — ön işleme, çıkarım, son işleme. Bütçeyi kaçırırsanız sistem işe yaramaz bir slayt gösterisine düşer.</p>

<p class="l-text">Bu derste gecikme bütçeleme, kuantizasyon ve budama ile model sıkıştırma, ONNX ve TensorRT'ye dışa aktarma, kenar dağıtım ve üretimde model izlemeyi öğreneceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>30 fps hedefi için ön işleme, çıkarım ve son işleme arasında gecikme bütçelemeyi</li>
<li>INT8 kuantizasyon ve yapılı/yapısız pruning ile model boyutunu küçültmeyi</li>
<li>PyTorch modelini ONNX'e dışa aktarıp TensorRT motoruna dönüştürmeyi</li>
<li>Jetson, Coral TPU, mobil GPU gibi edge donanımlarda doğru runtime ile dağıtmayı</li>
<li>Üretimdeki modelleri data drift ve doğruluk düşüşü açısından izlemeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Gecikme Bütçesi</h2>
<p class="l-text">Gerçek zamanlı görme = 30 fps = kare başına ~33 ms. Bu bütçe tüm boru hattını kapsar.</p>
<div class="katex-block">$$T_{total} = T_{preprocess} + T_{inference} + T_{postprocess}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ön işleme</div><div class="card-body">Yeniden boyutlandırma, normalizasyon, renk dönüşümü. Genelde 2–5 ms.</div></div>
<div class="calc-card"><div class="card-title">Çıkarım</div><div class="card-body">İleri geçiş. En büyük terim — genelde 10–25 ms.</div></div>
<div class="calc-card"><div class="card-title">Son işleme</div><div class="card-body">NMS, kod çözme, kutu çizme. 2–5 ms.</div></div>
<div class="calc-card"><div class="card-title">Tampon</div><div class="card-body">Her zaman 5 ms boşluk bırakın — GPU'lar bazen takvim kaçırır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kuantizasyon</h2>
<p class="l-text">Kuantizasyon fp32 ağırlık ve aktivasyonları int8 (ya da fp16, int4) ile değiştirir. Sonuç: 4x küçük model, 2-4x hızlı çıkarım, makul doğruluk kaybı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PTQ</div><div class="card-body">Eğitim Sonrası Kuantizasyon — birkaç yüz örnekle kalibre.</div></div>
<div class="calc-card"><div class="card-title">QAT</div><div class="card-body">Kuantizasyon Farkındalı Eğitim — eğitim sırasında int8 simüle edilir, daha yüksek doğruluk.</div></div>
<div class="calc-card"><div class="card-title">Dinamik</div><div class="card-body">Ağırlık kuantize, aktivasyon anlık. Transformer'lar için kolay ve etkili.</div></div>
<div class="calc-card"><div class="card-title">Statik</div><div class="card-body">Hem ağırlık hem aktivasyon kalibrasyon istatistikleriyle kuantize.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

model = torch.<span class="fn">load</span>(<span class="str">'resnet.pt'</span>).<span class="fn">eval</span>()
qmodel = torch.quantization.<span class="fn">quantize_dynamic</span>(
    model, {torch.nn.Linear, torch.nn.Conv2d}, dtype=torch.qint8)
torch.<span class="fn">save</span>(qmodel.<span class="fn">state_dict</span>(), <span class="str">'resnet_int8.pt'</span>)
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pure numpy ile 8-bit quantization: float ağırlık matrisini int8'e ölçekle, dequantize et, hatayı ölç.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

W = rng.normal(0, 0.5, size=(64, 64)).astype(np.float32)

scale = W.abs().max() / 127
W_q = np.clip(np.round(W / scale), -128, 127).astype(np.int8)
W_dq = W_q.astype(np.float32) * scale

print('orig dtype size :', W.nbytes, 'bytes')
print('int8 dtype size :', W_q.nbytes, 'bytes  ({:.1f}x smaller)'.format(W.nbytes / W_q.nbytes))
print('mean abs error  :', float(np.abs(W - W_dq).mean()).__round__(5))</code></pre></div></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Eğitilmiş modeli eval modunda yükle. 2) <code>quantize_dynamic</code> Linear ve Conv2d katmanlarını kanal başına ölçekli int8 ağırlıklarla sarar. 3) Kuantize edilmiş state dict'i kaydet — fp32 orijinalden 3-4 kat küçük. Model CPU'da çalışır; GPU'da int8 için genelde TensorRT kullanırsınız.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Budama ve Damıtma</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yapısız budama</div><div class="card-body">Küçük ağırlıkları tek tek sıfırla. Depolama tasarrufu; hızlanma için sparse kernel ister.</div></div>
<div class="calc-card"><div class="card-title">Yapısal budama</div><div class="card-body">Tüm kanal ya da kafaları sil. Standart donanımda gerçek hızlanma.</div></div>
<div class="calc-card"><div class="card-title">Damıtma</div><div class="card-body">Küçük "öğrenci" öğretmenin logit'lerini eşleyecek şekilde eğitilir. Sıfırdan eğitmeyi sıkça yener.</div></div>
<div class="calc-card"><div class="card-title">Birleşik</div><div class="card-body">Budama + kuantizasyon + damıtma minimum doğruluk kaybıyla 10x küçültür.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ONNX ve TensorRT</h2>
<p class="l-text">PyTorch araştırma için harika ama üretim genellikle çıkarım için optimize ve donanım taşınabilir bir runtime ister.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

model.<span class="fn">eval</span>()
sahte = torch.<span class="fn">randn</span>(<span class="num">1</span>, <span class="num">3</span>, <span class="num">224</span>, <span class="num">224</span>)

torch.onnx.<span class="fn">export</span>(
    model, sahte, <span class="str">'resnet.onnx'</span>,
    input_names=[<span class="str">'input'</span>], output_names=[<span class="str">'logits'</span>],
    dynamic_axes={<span class="str">'input'</span>: {<span class="num">0</span>: <span class="str">'batch'</span>}, <span class="str">'logits'</span>: {<span class="num">0</span>: <span class="str">'batch'</span>}},
    opset_version=<span class="num">17</span>)

<span class="cm"># onnxruntime ile çıkarım</span>
<span class="kw">import</span> onnxruntime <span class="kw">as</span> ort
sess = ort.<span class="fn">InferenceSession</span>(<span class="str">'resnet.onnx'</span>, providers=[<span class="str">'CUDAExecutionProvider'</span>])
cikti = sess.<span class="fn">run</span>(<span class="kw">None</span>, {<span class="str">'input'</span>: sahte.<span class="fn">numpy</span>()})
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sklearn modelini pickle et — ONNX export ile aynı fikir: eğitilmiş modeli serileştir, sonra yükleyip çalıştır.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import pickle, io
from sklearn.linear_model import LogisticRegression

X = df_iris[['sepal_length','sepal_width','petal_length','petal_width']].values
y = df_iris['species'].values
clf = LogisticRegression(max_iter=400).fit(X, y)

buf = io.BytesIO()
pickle.dump(clf, buf)
print('serialized size:', len(buf.getvalue()), 'bytes')

buf.seek(0)
clf2 = pickle.load(buf)
print('reload acc:', round(clf2.score(X, y), 3))
print('predictions match:', (clf.predict(X) == clf2.predict(X)).all())</code></pre></div></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) PyTorch modelini sahte girdiyle izle ve ONNX'e aktar. 2) <code>dynamic_axes</code> batch boyutunun çalışma zamanında değişmesine izin verir. 3) ONNX Runtime ile yükle; CUDAExecutionProvider GPU'da koşar. 4) Çıkarımı çalıştır. Maksimum GPU hızı için ONNX → TensorRT motoruna dönüştürün.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Kenar Dağıtım</h2>
<p class="l-text">Kenar cihazlarının sert bellek ve güç kısıtları vardır. Her platformun tercih ettiği bir runtime'ı vardır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TFLite</div><div class="card-body">Android telefonlar, Coral hızlandırıcılar, gömülü Linux.</div></div>
<div class="calc-card"><div class="card-title">Core ML</div><div class="card-body">iOS, macOS — Apple Neural Engine kullanır.</div></div>
<div class="calc-card"><div class="card-title">OpenVINO</div><div class="card-body">Intel CPU'lar, tümleşik GPU'lar, VPU'lar.</div></div>
<div class="calc-card"><div class="card-title">TensorRT</div><div class="card-body">NVIDIA Jetson kenar kartları (Nano, Orin), veri merkezi GPU'ları.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kamera Boru Hattı + Batching</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> cv2, time
cap = cv2.<span class="fn">VideoCapture</span>(<span class="num">0</span>)
tampon = []

<span class="kw">while</span> <span class="kw">True</span>:
    ok, kare = cap.<span class="fn">read</span>()
    <span class="kw">if</span> <span class="kw">not</span> ok: <span class="kw">break</span>

    tampon.<span class="fn">append</span>(<span class="fn">on_isle</span>(kare))
    <span class="kw">if</span> <span class="fn">len</span>(tampon) == <span class="num">4</span>:                   <span class="cm"># 4'lü mikro-batch</span>
        t0 = time.<span class="fn">time</span>()
        cikti = sess.<span class="fn">run</span>(<span class="kw">None</span>, {<span class="str">'input'</span>: np.<span class="fn">stack</span>(tampon)})
        <span class="fn">print</span>(f<span class="str">'batch ms: {(time.time()-t0)*1000:.1f}'</span>)
        tampon.<span class="fn">clear</span>()

    cv2.<span class="fn">imshow</span>(<span class="str">'kamera'</span>, kare)
    <span class="kw">if</span> cv2.<span class="fn">waitKey</span>(<span class="num">1</span>) == <span class="num">27</span>: <span class="kw">break</span>

cap.<span class="fn">release</span>()
</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sentetik kareler ile video akışı simülasyonu ve kare başına inference döngüsü — webcam'de çalıştıracağın döngünün aynısı.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

def preprocess(frame):
    return frame.astype(np.float32) / 255.0

def model_predict(x):
    return float(x.mean())   # toy: average brightness

predictions = []
for t in range(10):
    frame = rng.integers(0, 255, size=(64, 64, 3), dtype=np.uint8)
    p = model_predict(preprocess(frame))
    predictions.append(p)

print('processed', len(predictions), 'frames')
print('mean pred:', round(float(np.mean(predictions)), 3))
print('first 3  :', [round(p, 3) for p in predictions[:3]])</code></pre></div></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) OpenCV ile webcam aç. 2) Çıkarımdan önce 4 ön işlenmiş kareyi tampona al. Mini-batch GPU kullanımını iyileştirir. 3) Batch başına geçen ms'yi yazdır — 4 × 33 ms = 132 ms altında rahat oturmalı. 4) Her ham kareyi göster; çıkmak için Esc. Üretimde üreticiyi (kamera okuma), işleyiciyi (çıkarım) ve tüketiciyi (UI/render) ayrı thread'lere ayırın.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. İzleme ve A/B Testi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Drift tespiti</div><div class="card-body">Girdi istatistiklerini (parlaklık, renk) eğitim dağılımıyla karşılaştır. Kaymada uyar.</div></div>
<div class="calc-card"><div class="card-title">Güven histogramları</div><div class="card-body">Ani düşüşleri izle — bozuk kamera ya da yeni hata moduna işaret edebilir.</div></div>
<div class="calc-card"><div class="card-title">Gölge dağıtım</div><div class="card-body">Yeni modeli paralel çalıştır; kullanıcıyı etkilemeden çıktıları karşılaştır.</div></div>
<div class="calc-card"><div class="card-title">A/B</div><div class="card-body">Bazı kullanıcıları model B'ye yönlendir; KPI'ları (doğruluk, gecikme, şikayet) karşılaştır.</div></div>
</div>
<div id="cv-l11-plot-tr" style="width:100%;height:340px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Gerçek zamanlı görme = kare başına toplam 33 ms. Her adımı bütçeleyin.<br><strong>2.</strong> Kuantizasyon (int8) en az ağrıyla en büyük hızlanmadır.<br><strong>3.</strong> Budama ve damıtma kazanımları katlar.<br><strong>4.</strong> ONNX taşınabilir aktarım formatıdır; TensorRT NVIDIA GPU'larda optimize eder.<br><strong>5.</strong> Runtime'ı donanıma göre seçin: TFLite, Core ML, OpenVINO, TensorRT.<br><strong>6.</strong> Üretimde her zaman girdileri ve güveni izleyin.<br><strong>7.</strong> Sonraki ders: NLP ve CV'yi birleştiren çok modlu bitirme projesi.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var models = [{x:11.7, y:0.764, t:'ResNet-50'}, {x:43.6, y:0.778, t:'ResNet-152'}, {x:5.4, y:0.706, t:'MobileNetV3'}, {x:7.7, y:0.745, t:'EfficientNet-B0'}, {x:21.4, y:0.784, t:'EfficientNet-B3'}, {x:86, y:0.784, t:'ViT-Base'}];
  var trace = { x: models.map(m=>m.x), y: models.map(m=>m.y), text: models.map(m=>m.t), mode:'markers+text', textposition:'top center', marker:{color:'#c8a96e', size:12} };
  var layout = { margin:{t:20,r:20,b:50,l:50}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#bbb'}, xaxis:{title:'Parametre (M) / boyut'}, yaxis:{title:'ImageNet acc'} };
  var en = document.getElementById('cv-l11-plot-en'); if (en) Plotly.newPlot(en, [trace], layout, {displayModeBar:false});
  var tr = document.getElementById('cv-l11-plot-tr'); if (tr) Plotly.newPlot(tr, [trace], Object.assign({}, layout, {xaxis:{title:'Parametre (M) / boyut'}, yaxis:{title:'ImageNet doğruluğu'}}), {displayModeBar:false});
}, 250);</script>
`
};
