window.MLOPS_L4 = {
en: `<p class="l-text"><strong>Hook:</strong> a model in memory is useless to anyone but you. Production starts the moment the trained object becomes a portable artifact — a file, a hash, a registry entry — that another process can load and run.</p>
<p class="l-text">In this lesson we cover the serialization landscape (pickle, joblib, ONNX, TorchScript, SavedModel), train and reload a real model on <code>df_churn</code>, and discuss model versioning + registry concepts.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compare pickle, joblib, ONNX, TorchScript, and SavedModel for shipping models</li>
<li>Serialize a churn classifier with joblib and reload it in a fresh process</li>
<li>Export a sklearn pipeline to ONNX and run it with onnxruntime</li>
<li>Build semantic version tags for models using a content hash plus metadata</li>
<li>Promote models through Staging and Production stages in a model registry</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Serialization Landscape</h2>
<p class="l-text">Different frameworks, different formats. Picking the wrong one locks you into a runtime.</p>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>pickle / joblib</strong><br/>Native Python, sklearn-friendly. Tied to Python version + class definitions.</div><div class="calc-compare-cell"><strong>ONNX</strong><br/>Cross-framework graph format. Run sklearn / pytorch / tf in the same C++ runtime.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>TorchScript / torch.compile</strong><br/>PyTorch's portable graph; runs in C++ without Python.</div><div class="calc-compare-cell"><strong>TF SavedModel</strong><br/>TensorFlow's official format; weights + graph + signature.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>safetensors</strong><br/>HuggingFace format; secure (no exec), fast load.</div><div class="calc-compare-cell"><strong>GGUF</strong><br/>llama.cpp world; quantized LLMs for CPU/edge.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Why ONNX Often Wins</h2>
<p class="l-text">ONNX (Open Neural Network Exchange) describes the model as a computation graph. Once exported, you can run it from C++, Java, JavaScript, mobile — without Python.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Portability</div><div class="calc-card-body">One file, any runtime that speaks ONNX.</div></div>
<div class="calc-card"><div class="calc-card-title">Speed</div><div class="calc-card-body">ONNX Runtime often beats native PyTorch for inference.</div></div>
<div class="calc-card"><div class="calc-card-title">Edge</div><div class="calc-card-body">Mobile and browser builds available.</div></div>
<div class="calc-card"><div class="calc-card-title">Caveat</div><div class="calc-card-body">Custom ops sometimes don't convert cleanly — test exports.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. End-to-End joblib Demo</h2>
<p class="l-text">joblib is the workhorse for sklearn — efficient with numpy arrays. The cycle below trains, saves, reloads and predicts. It runs in the browser sandbox.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> io, joblib
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">"number"</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)

model = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">80</span>, random_state=<span class="num">42</span>).<span class="fn">fit</span>(Xtr, ytr)
auc_train = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])

<span class="cm"># 1) serialize to bytes</span>
buf = io.<span class="fn">BytesIO</span>()
joblib.<span class="fn">dump</span>(model, buf)
size_kb = <span class="fn">len</span>(buf.<span class="fn">getvalue</span>()) / <span class="num">1024</span>

<span class="cm"># 2) reload from bytes (mimics another process)</span>
buf.<span class="fn">seek</span>(<span class="num">0</span>)
loaded = joblib.<span class="fn">load</span>(buf)

<span class="cm"># 3) predict and confirm parity</span>
auc_load = <span class="fn">roc_auc_score</span>(yte, loaded.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"trained AUC = {auc_train:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"reloaded AUC = {auc_load:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"artifact size = {size_kb:.1f} KB  (parity: {abs(auc_train-auc_load) &lt; 1e-9})"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> trains a RandomForest, dumps it to an in-memory bytes buffer with joblib, reloads it as if from disk in a different process, and verifies that the reloaded model produces a bit-identical AUC. The size print tells you what your S3 / model registry will store. This is the simplest possible packaging step — and it works in the browser via Pyodide.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Exporting to ONNX</h2>
<p class="l-text">For sklearn use <code>skl2onnx</code>; for PyTorch use <code>torch.onnx.export</code>. Sketch:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — skl2onnx + onnxruntime not bundled in this sandbox</span>
<span class="cm"># from skl2onnx import to_onnx</span>
<span class="cm"># onnx_model = to_onnx(model, X.values[:1].astype('float32'))</span>
<span class="cm"># with open("rf.onnx", "wb") as f: f.write(onnx_model.SerializeToString())</span>
<span class="cm">#</span>
<span class="cm"># import onnxruntime as ort</span>
<span class="cm"># sess = ort.InferenceSession("rf.onnx")</span>
<span class="cm"># probs = sess.run(None, {"X": X_test.values.astype('float32')})[1]</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The commented <code>skl2onnx.convert_sklearn(model, ...)</code> call would walk the sklearn estimator graph and emit an <em>ONNX</em> protobuf. 2) <code>FloatTensorType([None, n_features])</code> declares the input schema — <code>None</code> means dynamic batch dimension. 3) Saving the bytes to <code>churn.onnx</code> produces a framework-agnostic file: it can be loaded by <code>onnxruntime</code> (C++, Python, .NET) or shipped to mobile via ONNX Runtime Mobile. 4) The commented <code>onnxruntime.InferenceSession</code> + <code>sess.run</code> shows the loader side. 5) It is commented because skl2onnx and onnxruntime aren't bundled in this Pyodide image; the next runnable cell shows the joblib alternative.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same export → reload → run-anywhere idea, using joblib (the Pyodide-friendly cousin of ONNX). We also assert prediction parity bit-for-bit, exactly as you would after a real ONNX export.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io, joblib, numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=60, random_state=42).fit(Xtr, ytr)

# "export" -> bytes (stand-in for rf.onnx)
buf = io.BytesIO()
joblib.dump(model, buf)
artifact_bytes = buf.getvalue()

# "InferenceSession" -> reload from bytes, predict
sess = joblib.load(io.BytesIO(artifact_bytes))
probs_orig = model.predict_proba(Xte.values.astype("float32"))[:, 1]
probs_rt   = sess.predict_proba(Xte.values.astype("float32"))[:, 1]
print({"artifact_kb": round(len(artifact_bytes) / 1024, 1),
       "max_abs_diff": float(np.max(np.abs(probs_orig - probs_rt))),
       "parity_ok": bool(np.allclose(probs_orig, probs_rt))})</code></pre></div>
<p class="l-text"><strong>How this stand-in mimics an ONNX round-trip:</strong> we train a small <code>RandomForestClassifier</code> on <code>df_churn</code> so there is something concrete to serialize. <code>io.BytesIO()</code> + <code>joblib.dump(model, buf)</code> writes the estimator into an in-memory buffer instead of disk — handy in browser sandboxes, and <code>artifact_bytes</code> is then exactly the kind of blob you would push to S3 or an MLflow registry. <code>joblib.load(io.BytesIO(artifact_bytes))</code> rehydrates the bytes into a fresh estimator. The crucial assertion is parity: we call <code>predict_proba</code> on the same test split with both the original and the reloaded model, then check <code>np.allclose(probs_orig, probs_rt)</code> — exactly the verification you would run after a real ONNX export.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Versioning Your Models</h2>
<p class="l-text">Three schemes are common; pick one and stick with it.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">SemVer</div><div class="calc-card-body"><code>v1.2.0</code>: major = breaking schema change, minor = improvement, patch = bugfix.</div></div>
<div class="calc-card"><div class="calc-card-title">Hash</div><div class="calc-card-body"><code>sha256(weights)</code> first 8 chars. Immutable, no human meaning.</div></div>
<div class="calc-card"><div class="calc-card-title">Timestamp</div><div class="calc-card-body"><code>2026-04-30T13:22</code>. Auto-increment, easy to grep.</div></div>
</div>
<p class="l-text">Pair the version with a <em>signature</em>: input schema, output schema, and the data hash from L2. Together they tell future-you exactly what this artifact expects.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Model Registry Concept</h2>
<p class="l-text">A registry is a database of model versions plus lifecycle stages.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Staging</strong> — passed offline tests, awaiting integration / shadow.</div>
<div class="calc-step"><strong>Production</strong> — live; serving real traffic. Usually only one alias at a time.</div>
<div class="calc-step"><strong>Archived</strong> — superseded; kept for rollback and audit.</div>
</div>
<p class="l-text">MLflow Models, SageMaker Model Registry, Vertex Model Registry and BentoML's Yatai all implement this idea.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Artifact Sizes Across Formats</h2>
<div id="mlops-l4-graph-en" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Illustrative artifact sizes for a small NLP classifier across formats. ONNX often the smallest at inference; pickle the largest because it ships Python objects.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>Pick a serialization format that matches your runtime: joblib for sklearn, ONNX for cross-stack, SavedModel/TorchScript for native deep learning.</li>
<li>Always validate parity: reloaded model must reproduce the training metric exactly.</li>
<li>Version every artifact (SemVer / hash / timestamp) and pair it with input/output schema.</li>
<li>A model registry adds lifecycle (staging → production → archived) on top of versioned artifacts.</li>
<li>Size matters: smaller artifact = faster cold start, cheaper storage, easier edge deploy.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l4-graph-en', [{
    x:['pickle','joblib','SavedModel','TorchScript','ONNX','safetensors'],
    y:[58, 42, 90, 75, 35, 38], type:'bar', marker:{color:accent}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Approximate artifact size (MB) — illustrative',
    yaxis:{title:'MB'}, margin:{t:60,r:30,b:60,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> bellekteki bir model sizden başkasına işe yaramaz. Üretim, eğitilmiş nesnenin başka bir sürecin yükleyip çalıştırabileceği taşınabilir bir artefakta — bir dosya, bir hash, bir registry kaydına — dönüştüğü an başlar.</p>
<p class="l-text">Bu derste serileştirme manzarasını (pickle, joblib, ONNX, TorchScript, SavedModel) ele alıyor, <code>df_churn</code> üzerinde gerçek bir modeli eğitip yeniden yüklüyor ve model sürümleme + registry kavramlarını tartışıyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Model dağıtımı için pickle, joblib, ONNX, TorchScript ve SavedModel'i karşılaştıracaksın</li>
<li>Churn sınıflandırıcıyı joblib ile serileştirip yeni süreçte yeniden yükleyeceksin</li>
<li>Bir sklearn pipeline'ını ONNX'e aktarıp onnxruntime ile çalıştıracaksın</li>
<li>İçerik hash'i ve metaveriyle modeller için semantic version etiketleri oluşturacaksın</li>
<li>Model registry'de modelleri Staging ve Production aşamalarına terfi ettireceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Serileştirme Manzarası</h2>
<p class="l-text">Farklı framework, farklı format. Yanlış seçim sizi bir runtime'a kilitler.</p>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>pickle / joblib</strong><br/>Yerel Python, sklearn'a uyumlu. Python sürümü + sınıf tanımlarına bağlıdır.</div><div class="calc-compare-cell"><strong>ONNX</strong><br/>Çapraz framework graph formatı. sklearn / pytorch / tf'yi aynı C++ runtime'da çalıştırır.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>TorchScript / torch.compile</strong><br/>PyTorch'un taşınabilir grafiği; Python olmadan C++'ta çalışır.</div><div class="calc-compare-cell"><strong>TF SavedModel</strong><br/>TensorFlow'un resmi formatı; ağırlık + grafik + imza.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>safetensors</strong><br/>HuggingFace formatı; güvenli (exec yok), hızlı yükleme.</div><div class="calc-compare-cell"><strong>GGUF</strong><br/>llama.cpp dünyası; CPU/edge için kuantize LLM.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ONNX Neden Sıkça Kazanır</h2>
<p class="l-text">ONNX (Open Neural Network Exchange) modeli bir hesaplama grafiği olarak tanımlar. Bir kez dışa aktardınız mı C++, Java, JavaScript, mobil — Python'sız çalıştırırsınız.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Taşınabilirlik</div><div class="calc-card-body">Tek dosya, ONNX'i konuşan herhangi bir runtime.</div></div>
<div class="calc-card"><div class="calc-card-title">Hız</div><div class="calc-card-body">ONNX Runtime, çıkarımda PyTorch'u sıkça geçer.</div></div>
<div class="calc-card"><div class="calc-card-title">Uç</div><div class="calc-card-body">Mobil ve tarayıcı build'leri mevcut.</div></div>
<div class="calc-card"><div class="calc-card-title">Uyarı</div><div class="calc-card-body">Özel op'lar bazen temiz dönüşmez — export'ları test edin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Uçtan Uca joblib Demosu</h2>
<p class="l-text">joblib sklearn için iş atı; numpy ile verimli. Aşağıdaki döngü eğitir, kaydeder, yeniden yükler ve tahmin eder. Tarayıcı kumunda çalışır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> io, joblib
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">"number"</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)

model = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">80</span>, random_state=<span class="num">42</span>).<span class="fn">fit</span>(Xtr, ytr)
auc_train = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])

<span class="cm"># 1) baytlara serileştir</span>
buf = io.<span class="fn">BytesIO</span>()
joblib.<span class="fn">dump</span>(model, buf)
size_kb = <span class="fn">len</span>(buf.<span class="fn">getvalue</span>()) / <span class="num">1024</span>

<span class="cm"># 2) baytlardan yeniden yükle (başka bir süreci taklit eder)</span>
buf.<span class="fn">seek</span>(<span class="num">0</span>)
loaded = joblib.<span class="fn">load</span>(buf)

<span class="cm"># 3) tahmin et ve eşitliği doğrula</span>
auc_load = <span class="fn">roc_auc_score</span>(yte, loaded.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"eğitim AUC = {auc_train:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"yeniden yüklenmiş AUC = {auc_load:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"artefakt boyutu = {size_kb:.1f} KB  (eşit mi: {abs(auc_train-auc_load) &lt; 1e-9})"</span>)</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> RandomForest eğitir, joblib ile bellekteki bir bayt buffer'ına yazar, başka bir süreçteymiş gibi yeniden yükler ve aynı AUC'yi bit düzeyinde verdiğini doğrular. Boyut çıktısı S3 / model registry'nizin saklayacağı şeyi söyler. Mümkün olan en basit paketleme adımıdır — Pyodide üzerinden tarayıcıda çalışır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ONNX'e Dışa Aktarma</h2>
<p class="l-text">sklearn için <code>skl2onnx</code>; PyTorch için <code>torch.onnx.export</code>. Taslak:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — skl2onnx + onnxruntime bu kumda paket değil</span>
<span class="cm"># from skl2onnx import to_onnx</span>
<span class="cm"># onnx_model = to_onnx(model, X.values[:1].astype('float32'))</span>
<span class="cm"># with open("rf.onnx", "wb") as f: f.write(onnx_model.SerializeToString())</span>
<span class="cm">#</span>
<span class="cm"># import onnxruntime as ort</span>
<span class="cm"># sess = ort.InferenceSession("rf.onnx")</span>
<span class="cm"># probs = sess.run(None, {"X": X_test.values.astype('float32')})[1]</span></code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Yorumlanmış <code>skl2onnx.convert_sklearn(model, ...)</code> çağrısı sklearn tahminci grafını dolaşır ve bir <em>ONNX</em> protobuf üretir. 2) <code>FloatTensorType([None, n_features])</code> girdi şemasını bildirir — <code>None</code> dinamik batch boyutu demektir. 3) Baytları <code>churn.onnx</code>'a yazmak framework-bağımsız bir dosya verir: <code>onnxruntime</code> (C++, Python, .NET) ile yüklenebilir ya da ONNX Runtime Mobile üzerinden mobile gönderilebilir. 4) Yorumlu <code>onnxruntime.InferenceSession</code> + <code>sess.run</code> yükleyici tarafını gösterir. 5) Yorumlu çünkü bu Pyodide imajında skl2onnx ve onnxruntime yok; sonraki hücre joblib alternatifini gösterir.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı dışa-aktar → yeniden-yükle → her yerde çalıştır fikri, joblib (ONNX'in Pyodide-uyumlu kuzeni) ile. Bit düzeyinde tahmin eşitliğini gerçek bir ONNX export'tan sonra yapacağınız gibi doğruluyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io, joblib, numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=60, random_state=42).fit(Xtr, ytr)

# "export" -> baytlar (rf.onnx yerine geçer)
buf = io.BytesIO()
joblib.dump(model, buf)
artifact_bytes = buf.getvalue()

# "InferenceSession" -> baytlardan yeniden yükle, tahmin et
sess = joblib.load(io.BytesIO(artifact_bytes))
probs_orig = model.predict_proba(Xte.values.astype("float32"))[:, 1]
probs_rt   = sess.predict_proba(Xte.values.astype("float32"))[:, 1]
print({"artifact_kb": round(len(artifact_bytes) / 1024, 1),
       "max_abs_diff": float(np.max(np.abs(probs_orig - probs_rt))),
       "parity_ok": bool(np.allclose(probs_orig, probs_rt))})</code></pre></div>
<p class="l-text"><strong>Bu taklit ONNX tur-dönüşünü nasıl simüle ediyor:</strong> serileştirecek somut bir şeyimiz olsun diye <code>df_churn</code> üzerinde küçük bir <code>RandomForestClassifier</code> eğitiyoruz. <code>io.BytesIO()</code> + <code>joblib.dump(model, buf)</code> tahminciyi diske değil bellek-içi tampona yazar — tarayıcı kumlarında işe yarar; <code>artifact_bytes</code> ise tam olarak S3 veya MLflow registry'sine iteceğin tür bir blob'dur. <code>joblib.load(io.BytesIO(artifact_bytes))</code> baytları taze bir tahminciye geri çevirir. Kritik kontrol parite: aynı test bölmesinde hem orijinal hem yeniden yüklenmiş modelle <code>predict_proba</code> çağırıp <code>np.allclose(probs_orig, probs_rt)</code> ile karşılaştırıyoruz — gerçek bir ONNX export'tan sonra yapacağın doğrulamanın aynısı.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Modellerinizi Sürümlemek</h2>
<p class="l-text">Üç şema yaygın; birini seçin ve devam edin.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">SemVer</div><div class="calc-card-body"><code>v1.2.0</code>: major = kıran şema değişikliği, minor = iyileştirme, patch = hata düzeltme.</div></div>
<div class="calc-card"><div class="calc-card-title">Hash</div><div class="calc-card-body"><code>sha256(weights)</code>'in ilk 8 karakteri. Değişmez, insan anlamı yok.</div></div>
<div class="calc-card"><div class="calc-card-title">Timestamp</div><div class="calc-card-body"><code>2026-04-30T13:22</code>. Otomatik artar, kolay grep edilir.</div></div>
</div>
<p class="l-text">Sürümü bir <em>imza</em> ile eşleştirin: girdi şeması, çıktı şeması ve L2'deki veri hash'i. Birlikte gelecekteki size bu artefaktın ne beklediğini tam olarak söyler.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Model Registry Kavramı</h2>
<p class="l-text">Registry, model sürümleri + yaşam döngüsü aşamaları içeren bir veritabanıdır.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Staging</strong> — offline testleri geçti, entegrasyon / gölge bekliyor.</div>
<div class="calc-step"><strong>Production</strong> — canlı; gerçek trafiğe hizmet ediyor. Genelde aynı anda tek alias.</div>
<div class="calc-step"><strong>Archived</strong> — yerini başkası aldı; geri alma ve denetim için saklanır.</div>
</div>
<p class="l-text">MLflow Models, SageMaker Model Registry, Vertex Model Registry ve BentoML'in Yatai'si bu fikri uygular.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Formatlara Göre Artefakt Boyutları</h2>
<div id="mlops-l4-graph-tr" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Küçük bir NLP sınıflandırıcısının formatlara göre yaklaşık artefakt boyutları. Çıkarımda ONNX sıkça en küçük; pickle Python nesneleri taşıdığı için en büyük.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>Runtime'ınıza uyan formatı seçin: sklearn için joblib, çapraz stack için ONNX, derin öğrenme için SavedModel/TorchScript.</li>
<li>Eşitliği daima doğrulayın: yeniden yüklenmiş model, eğitim metriğini tam olarak vermeli.</li>
<li>Her artefaktı sürümleyin (SemVer / hash / timestamp) ve girdi/çıktı şemasıyla eşleştirin.</li>
<li>Model registry, sürümlü artefaktların üstüne yaşam döngüsü (staging → production → archived) ekler.</li>
<li>Boyut önemlidir: küçük artefakt = hızlı cold start, ucuz depolama, kolay uç dağıtımı.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l4-graph-tr', [{
    x:['pickle','joblib','SavedModel','TorchScript','ONNX','safetensors'],
    y:[58, 42, 90, 75, 35, 38], type:'bar', marker:{color:accent}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Yaklaşık artefakt boyutu (MB) — örnek',
    yaxis:{title:'MB'}, margin:{t:60,r:30,b:60,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
