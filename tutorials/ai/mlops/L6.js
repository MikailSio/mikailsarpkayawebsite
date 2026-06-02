window.MLOPS_L6 = {
en: `<p class="l-text"><strong>Hook:</strong> nobody calls your <code>predict()</code> from a notebook in production. The model needs to live behind an HTTP endpoint that receives JSON, validates it, runs inference, and returns JSON in tens of milliseconds. <strong>Model serving</strong> is the bridge from artifact to user.</p>
<p class="l-text">In this lesson we build a FastAPI service that loads a joblib churn model and exposes <code>/predict</code>, then survey BentoML, TorchServe and TF Serving.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build a FastAPI app with Pydantic schema validation and lifespan loading</li>
<li>Expose a /predict endpoint that runs a joblib churn model on JSON input</li>
<li>Compare async vs sync route handlers for CPU-bound inference</li>
<li>Survey BentoML, TorchServe, and TF Serving as production serving frameworks</li>
<li>Decompose request latency into network, JSON, preprocess, and inference</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why an HTTP API?</h2>
<p class="l-text">An HTTP service is the universal language of microservices. Mobile apps, web frontends, batch jobs, other backends — all speak it.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Decoupled</div><div class="calc-card-body">Clients don't need Python or your model class.</div></div>
<div class="calc-card"><div class="calc-card-title">Scalable</div><div class="calc-card-body">Stateless instance behind a load balancer.</div></div>
<div class="calc-card"><div class="calc-card-title">Observable</div><div class="calc-card-body">Standard logging, tracing, metrics layers slot in.</div></div>
<div class="calc-card"><div class="calc-card-title">Versioned</div><div class="calc-card-body">URL paths or headers carry the model version.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. FastAPI in 60 Seconds</h2>
<p class="l-text">FastAPI = type-checked endpoints + automatic OpenAPI docs + async I/O. Pydantic validates the request, the function returns a model object, FastAPI serializes to JSON.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — needs uvicorn server, won't run in browser</span>
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel

app = <span class="fn">FastAPI</span>(title=<span class="str">"hello"</span>)

<span class="kw">class</span> <span class="fn">Greeting</span>(BaseModel):
    name: <span class="ty">str</span>

<span class="at">@app.post</span>(<span class="str">"/hello"</span>)
<span class="kw">def</span> <span class="fn">hello</span>(g: Greeting):
    <span class="kw">return</span> {<span class="str">"msg"</span>: f<span class="str">"hi {g.name}"</span>}

<span class="cm"># uvicorn app:app --reload</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>app = FastAPI()</code> creates the ASGI app — uvicorn would run it in production with <code>uvicorn app:app --host 0.0.0.0 --port 8000</code>. 2) <code>class ChurnIn(BaseModel)</code> uses pydantic to validate the incoming JSON — wrong types fail fast with a 422 before they reach your code. 3) <code>@app.post("/predict")</code> binds the POST route. 4) Inside the handler, the model object (loaded at startup) calls <code>predict_proba</code> on the validated payload. 5) The return dict becomes JSON automatically — FastAPI also generates Swagger UI at <code>/docs</code> from the same type hints. 6) Commented because uvicorn cannot run inside Pyodide; the next cell ports the same logic to a pure-Python handler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Without uvicorn we model the same shape: a request validator + a handler function that returns a JSON-serializable dict. This <em>is</em> what FastAPI does internally; the framework just adds the HTTP layer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json

def validate(body, schema):
    for k, t in schema.items():
        if k not in body: raise ValueError(f"missing field {k!r}")
        if not isinstance(body[k], t): raise TypeError(f"{k} must be {t.__name__}")

# @app.post("/hello") equivalent
def hello_handler(body):
    validate(body, {"name": str})
    return {"msg": f"hi {body['name']}"}

# Simulate three requests
for req in [{"name": "Mikail"}, {"name": "Ada"}, {"name": "Reza"}]:
    print("REQ", req, "-> RES", json.dumps(hello_handler(req)))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>validate(body, schema)</code> walks the schema dict and raises <code>ValueError</code> on missing keys or wrong types — the pydantic equivalent in 6 lines. 2) <code>predict_handler(payload)</code> accepts a raw dict and a pre-loaded model, mirroring what a FastAPI handler does internally. 3) After validation, the payload values become a 2D NumPy row via <code>np.array([[...]])</code>. 4) <code>model.predict_proba(X)[0, 1]</code> reads the positive-class probability. 5) The response dict (<code>{"prob": ..., "label": ...}</code>) is what your service would JSON-serialize back to the client.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Full Churn Service</h2>
<p class="l-text">Below: a production-shaped service. Loads the joblib model on startup, validates inputs with Pydantic, returns probability + a model-version header.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — needs uvicorn + the model file on disk</span>
<span class="kw">import</span> joblib, os
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Response
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field
<span class="kw">from</span> typing <span class="kw">import</span> List

MODEL_PATH = os.environ.<span class="fn">get</span>(<span class="str">"MODEL_PATH"</span>, <span class="str">"models/churn.joblib"</span>)
MODEL_VERSION = os.environ.<span class="fn">get</span>(<span class="str">"MODEL_VERSION"</span>, <span class="str">"1.2.0"</span>)

app = <span class="fn">FastAPI</span>(title=<span class="str">"churn-api"</span>, version=MODEL_VERSION)
MODEL = joblib.<span class="fn">load</span>(MODEL_PATH)
N_FEATS = MODEL.n_features_in_

<span class="kw">class</span> <span class="fn">Customer</span>(BaseModel):
    features: List[<span class="ty">float</span>] = <span class="fn">Field</span>(..., min_items=<span class="num">1</span>)

<span class="kw">class</span> <span class="fn">Prediction</span>(BaseModel):
    churn_probability: <span class="ty">float</span>
    label: <span class="ty">int</span>
    model_version: <span class="ty">str</span>

<span class="at">@app.get</span>(<span class="str">"/health"</span>)
<span class="kw">def</span> <span class="fn">health</span>(): <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"ok"</span>, <span class="str">"model_version"</span>: MODEL_VERSION}

<span class="at">@app.post</span>(<span class="str">"/predict"</span>, response_model=Prediction)
<span class="kw">def</span> <span class="fn">predict</span>(c: Customer, response: Response):
    <span class="kw">if</span> <span class="fn">len</span>(c.features) != N_FEATS:
        <span class="kw">return</span> {<span class="str">"detail"</span>: f<span class="str">"expected {N_FEATS} features, got {len(c.features)}"</span>}
    x = np.<span class="fn">array</span>(c.features).<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>)
    p = <span class="fn">float</span>(MODEL.<span class="fn">predict_proba</span>(x)[<span class="num">0</span>, <span class="num">1</span>])
    response.headers[<span class="str">"X-Model-Version"</span>] = MODEL_VERSION
    <span class="kw">return</span> <span class="fn">Prediction</span>(churn_probability=p, label=<span class="fn">int</span>(p &gt; <span class="num">0.5</span>),
                      model_version=MODEL_VERSION)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>startup_event</code> hook runs once when uvicorn boots — it loads the joblib model from disk and caches it in module scope, avoiding a 200 ms reload per request. 2) <code>@app.post("/predict")</code> handler reads the validated <code>ChurnIn</code> payload. 3) Features are stacked into a 1×N array and passed to <code>model.predict_proba</code>. 4) The handler returns latency-tagged JSON; FastAPI serializes it. 5) <code>/health</code> is a separate lightweight endpoint that Kubernetes uses for liveness/readiness probes. 6) Commented because Pyodide can't run uvicorn; the Pyodide-equivalent below performs the same logic synchronously.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Trains a real churn model, &quot;loads&quot; it from a bytes buffer (mimicking joblib.load on container startup), and exposes <code>predict_handler</code> + <code>health_handler</code> with the same response schema FastAPI would emit, headers and all.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io, json, joblib, numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

MODEL_VERSION = "1.2.0"
df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
buf = io.BytesIO(); joblib.dump(GradientBoostingClassifier(random_state=42).fit(Xtr, ytr), buf)
MODEL = joblib.load(io.BytesIO(buf.getvalue()))
N_FEATS = MODEL.n_features_in_

def health_handler(): return {"status": "ok", "model_version": MODEL_VERSION}

def predict_handler(body):
    feats = body.get("features", [])
    if len(feats) != N_FEATS:
        return {"status": 422, "detail": f"expected {N_FEATS} features, got {len(feats)}"}
    p = float(MODEL.predict_proba(np.array(feats).reshape(1, -1))[0, 1])
    return {"status": 200, "headers": {"X-Model-Version": MODEL_VERSION},
            "body": {"churn_probability": round(p, 4), "label": int(p > 0.5),
                     "model_version": MODEL_VERSION}}

print(json.dumps(health_handler(), indent=2))
print(json.dumps(predict_handler({"features": Xte.iloc[0].tolist()}), indent=2))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) A small <code>RandomForestClassifier</code> is fit on <code>df_churn</code> and serialized into <code>io.BytesIO</code> to mimic the on-disk artifact. 2) <code>predict_one(payload)</code> deserializes the model once, then accepts a JSON-like dict, validates required keys, and runs inference. 3) <code>time.perf_counter()</code> brackets the call to record latency in milliseconds — the same metric your <code>X-Latency-Ms</code> header would expose. 4) The function returns <code>{"prob":..., "label":..., "latency_ms":...}</code>, the JSON contract a real /predict would respect. 5) Three sample payloads are run through it so you can verify both happy-path and validation-failure paths in the browser.</p>
</div>
<p class="l-text"><strong>What this service does, step by step:</strong> at startup it reads the model path and version from env vars (so the same image can serve any version), loads the joblib artifact once into memory, and learns the expected feature count from <code>n_features_in_</code>. The <code>/health</code> endpoint is what your load balancer probes. <code>/predict</code> validates the JSON via Pydantic, reshapes to a 2-D array, runs <code>predict_proba</code>, and returns probability + label + version. The version goes both in the body and in a custom header — useful for A/B traffic analysis later.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Local Inference Without a Server</h2>
<p class="l-text">We can't spin up uvicorn here, but the inference logic is identical. The cell below trains, saves and consumes the model the way the API would.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> io, joblib, numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)
model = <span class="fn">GradientBoostingClassifier</span>(random_state=<span class="num">42</span>).<span class="fn">fit</span>(Xtr, ytr)

buf = io.<span class="fn">BytesIO</span>(); joblib.<span class="fn">dump</span>(model, buf); buf.<span class="fn">seek</span>(<span class="num">0</span>)

<span class="cm"># === inside the API process ===</span>
served = joblib.<span class="fn">load</span>(buf)
<span class="kw">def</span> <span class="fn">predict_one</span>(features):
    x = np.<span class="fn">array</span>(features).<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>)
    p = <span class="fn">float</span>(served.<span class="fn">predict_proba</span>(x)[<span class="num">0</span>, <span class="num">1</span>])
    <span class="kw">return</span> {<span class="str">"churn_probability"</span>: <span class="fn">round</span>(p, <span class="num">4</span>), <span class="str">"label"</span>: <span class="fn">int</span>(p &gt; <span class="num">0.5</span>)}

<span class="cm"># Simulate a request body</span>
sample = Xte.iloc[<span class="num">0</span>].<span class="fn">tolist</span>()
<span class="fn">print</span>(<span class="fn">predict_one</span>(sample))</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> trains a GBM, dumps it to a bytes buffer, loads it back (mimicking the API's startup path), and exposes a tiny <code>predict_one</code> function with exactly the shape the FastAPI handler uses. We then run a real customer row through it and print the response payload.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Async vs Sync</h2>
<p class="l-text">FastAPI runs sync handlers in a thread pool, async handlers on the event loop. ML models are CPU-bound, so async helps only when the request waits on I/O (DB, vector store, LLM API). Pattern:</p>
<div class="calc-steps">
<div class="calc-step"><strong>Sync def</strong> — pure CPU inference, no awaits. Most sklearn / xgboost services.</div>
<div class="calc-step"><strong>Async def</strong> — when fetching features from a DB or calling an external LLM. <code>async def predict(...)</code> with <code>await db.fetch(...)</code>.</div>
<div class="calc-step"><strong>Run heavy CPU off the loop</strong> — <code>await loop.run_in_executor(None, model.predict, x)</code> in async handlers.</div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. BentoML, TorchServe, TF Serving</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">BentoML</div><div class="calc-card-body">Python-first model serving with batching, runners, packaging into "Bentos". Less boilerplate than FastAPI for ML.</div></div>
<div class="calc-card"><div class="calc-card-title">TorchServe</div><div class="calc-card-body">Official PyTorch server. Multi-model, GPU-aware, gRPC + REST.</div></div>
<div class="calc-card"><div class="calc-card-title">TF Serving</div><div class="calc-card-body">High-performance C++ server for SavedModel. gRPC, GPU, hot-swap.</div></div>
<div class="calc-card"><div class="calc-card-title">Triton</div><div class="calc-card-body">NVIDIA's polyglot server (ONNX, PyTorch, TF, custom). Best raw GPU throughput.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Latency Anatomy</h2>
<div id="mlops-l6-graph-en" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Where the milliseconds go in a typical sklearn API call. Network and JSON often dwarf the model's own compute.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>Wrap the model in HTTP so any client can consume it; FastAPI is the de-facto Python choice.</li>
<li>Load the model once at startup, validate inputs with Pydantic, return JSON + version header.</li>
<li>Health endpoint is mandatory — load balancers and Kubernetes probes need it.</li>
<li>Async only helps when you wait on I/O; CPU-bound inference belongs in sync (or executor).</li>
<li>For deep learning at scale, prefer Triton / TorchServe / TF Serving over hand-rolled FastAPI.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l6-graph-en', [{
    labels:['Network','JSON parse','Pydantic','Inference','Logging'],
    values:[14, 6, 3, 8, 2], type:'pie', marker:{colors:[accent,'#888','#ccc','#666','#444']}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, title:'Where the 33 ms go (illustrative)',
    margin:{t:60,r:30,b:30,l:30}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> üretimde kimse <code>predict()</code>'i bir notebook'tan çağırmaz. Model; JSON alan, doğrulayan, çıkarım yapıp on milisaniyeler içinde JSON döndüren bir HTTP uç noktasının arkasında yaşamalıdır. <strong>Model serving</strong>, artefaktan kullanıcıya köprüdür.</p>
<p class="l-text">Bu derste joblib churn modelini yükleyen ve <code>/predict</code> sunan bir FastAPI servisi inşa ediyor; ardından BentoML, TorchServe ve TF Serving'e bakıyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Pydantic şema doğrulama ve lifespan yüklemeyle FastAPI uygulaması kuracaksın</li>
<li>JSON girdisinde joblib churn modelini çalıştıran /predict endpoint'i sunacaksın</li>
<li>CPU bağımlı çıkarım için async ve sync route handler'larını karşılaştıracaksın</li>
<li>BentoML, TorchServe ve TF Serving'i üretim serving framework'leri olarak inceleyeceksin</li>
<li>İstek gecikmesini ağ, JSON, ön işleme ve çıkarım olarak parçalayacaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden HTTP API?</h2>
<p class="l-text">HTTP servisi mikroservislerin evrensel dilidir. Mobil uygulamalar, web frontend'leri, batch işler, diğer backend'ler — hepsi konuşur.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Bağımsız</div><div class="calc-card-body">İstemcilerin Python'a veya model sınıfınıza ihtiyacı yok.</div></div>
<div class="calc-card"><div class="calc-card-title">Ölçeklenebilir</div><div class="calc-card-body">Load balancer arkasında durumsuz örnek.</div></div>
<div class="calc-card"><div class="calc-card-title">Gözlemlenebilir</div><div class="calc-card-body">Standart loglama, tracing, metrik katmanları yerine oturur.</div></div>
<div class="calc-card"><div class="calc-card-title">Sürümlü</div><div class="calc-card-body">URL yolu veya header model sürümünü taşır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. 60 Saniyede FastAPI</h2>
<p class="l-text">FastAPI = tip kontrollü uç noktalar + otomatik OpenAPI dokümanı + async I/O. Pydantic isteği doğrular, fonksiyon bir model nesnesi döndürür, FastAPI JSON'a serileştirir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — uvicorn sunucusu ister, tarayıcıda çalışmaz</span>
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel

app = <span class="fn">FastAPI</span>(title=<span class="str">"hello"</span>)

<span class="kw">class</span> <span class="fn">Greeting</span>(BaseModel):
    name: <span class="ty">str</span>

<span class="at">@app.post</span>(<span class="str">"/hello"</span>)
<span class="kw">def</span> <span class="fn">hello</span>(g: Greeting):
    <span class="kw">return</span> {<span class="str">"msg"</span>: f<span class="str">"hi {g.name}"</span>}

<span class="cm"># uvicorn app:app --reload</span></code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>app = FastAPI()</code> ASGI uygulamasını kurar — üretimde uvicorn onu <code>uvicorn app:app --host 0.0.0.0 --port 8000</code> ile çalıştırır. 2) <code>class ChurnIn(BaseModel)</code> pydantic ile gelen JSON'u doğrular — yanlış tipler kodunuza varmadan 422 ile reddedilir. 3) <code>@app.post("/predict")</code> POST rotasını bağlar. 4) Handler içinde, başlangıçta yüklenen model nesnesi doğrulanmış payload üzerinde <code>predict_proba</code> çağırır. 5) Dönen dict otomatik JSON olur — FastAPI aynı tip ipuçlarından <code>/docs</code>'ta Swagger UI üretir. 6) Yorumlu çünkü uvicorn Pyodide içinde çalışamaz; sonraki hücre aynı mantığı saf-Python handler'a taşır.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">uvicorn olmadan aynı şekli modelliyoruz: bir istek doğrulayıcı + JSON-serileştirilebilir dict döndüren bir handler. FastAPI'nin içinde olan tam olarak budur; framework sadece HTTP katmanını ekler.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json

def validate(body, schema):
    for k, t in schema.items():
        if k not in body: raise ValueError(f"eksik alan {k!r}")
        if not isinstance(body[k], t): raise TypeError(f"{k} {t.__name__} olmalı")

# @app.post("/hello") karşılığı
def hello_handler(body):
    validate(body, {"name": str})
    return {"msg": f"merhaba {body['name']}"}

# Üç istek simülasyonu
for req in [{"name": "Mikail"}, {"name": "Ada"}, {"name": "Reza"}]:
    print("REQ", req, "-> RES", json.dumps(hello_handler(req), ensure_ascii=False))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>validate(body, schema)</code>, schema dict'ini dolaşır; eksik anahtar ya da yanlış tipte <code>ValueError</code> fırlatır — pydantic'in 6 satırlık eşdeğeri. 2) <code>predict_handler(payload)</code> ham dict ve önyüklü model alır; FastAPI handler'ın içinde yaptığını yansıtır. 3) Doğrulama sonrası payload değerleri <code>np.array([[...]])</code> ile 2D NumPy satırına dönüşür. 4) <code>model.predict_proba(X)[0, 1]</code> pozitif sınıf olasılığını okur. 5) Cevap dict'i (<code>{"prob": ..., "label": ...}</code>) servisinizin istemciye JSON olarak serileştireceği yapıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tam Churn Servisi</h2>
<p class="l-text">Aşağıda üretim şeklinde bir servis. Başlatmada joblib modelini yükler, Pydantic ile girdiyi doğrular, olasılık + model-versiyon header'ı döndürür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — uvicorn + diskteki model dosyası gerekir</span>
<span class="kw">import</span> joblib, os
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Response
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field
<span class="kw">from</span> typing <span class="kw">import</span> List

MODEL_PATH = os.environ.<span class="fn">get</span>(<span class="str">"MODEL_PATH"</span>, <span class="str">"models/churn.joblib"</span>)
MODEL_VERSION = os.environ.<span class="fn">get</span>(<span class="str">"MODEL_VERSION"</span>, <span class="str">"1.2.0"</span>)

app = <span class="fn">FastAPI</span>(title=<span class="str">"churn-api"</span>, version=MODEL_VERSION)
MODEL = joblib.<span class="fn">load</span>(MODEL_PATH)
N_FEATS = MODEL.n_features_in_

<span class="kw">class</span> <span class="fn">Customer</span>(BaseModel):
    features: List[<span class="ty">float</span>] = <span class="fn">Field</span>(..., min_items=<span class="num">1</span>)

<span class="kw">class</span> <span class="fn">Prediction</span>(BaseModel):
    churn_probability: <span class="ty">float</span>
    label: <span class="ty">int</span>
    model_version: <span class="ty">str</span>

<span class="at">@app.get</span>(<span class="str">"/health"</span>)
<span class="kw">def</span> <span class="fn">health</span>(): <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"ok"</span>, <span class="str">"model_version"</span>: MODEL_VERSION}

<span class="at">@app.post</span>(<span class="str">"/predict"</span>, response_model=Prediction)
<span class="kw">def</span> <span class="fn">predict</span>(c: Customer, response: Response):
    <span class="kw">if</span> <span class="fn">len</span>(c.features) != N_FEATS:
        <span class="kw">return</span> {<span class="str">"detail"</span>: f<span class="str">"{N_FEATS} öznitelik bekleniyordu, {len(c.features)} geldi"</span>}
    x = np.<span class="fn">array</span>(c.features).<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>)
    p = <span class="fn">float</span>(MODEL.<span class="fn">predict_proba</span>(x)[<span class="num">0</span>, <span class="num">1</span>])
    response.headers[<span class="str">"X-Model-Version"</span>] = MODEL_VERSION
    <span class="kw">return</span> <span class="fn">Prediction</span>(churn_probability=p, label=<span class="fn">int</span>(p &gt; <span class="num">0.5</span>),
                      model_version=MODEL_VERSION)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>startup_event</code> hook'u uvicorn ilk açıldığında bir kez çalışır — joblib modelini diskten yükler ve modül kapsamında önbelleğe alır; istek başına 200 ms'lik yeniden yükleme yok. 2) <code>@app.post("/predict")</code> handler'ı doğrulanmış <code>ChurnIn</code> payload'unu okur. 3) Öznitelikler 1×N diziye yığılır ve <code>model.predict_proba</code>'ya verilir. 4) Handler latency etiketli JSON döndürür; FastAPI serileştirir. 5) <code>/health</code>, Kubernetes'in liveness/readiness probe'u için kullandığı ayrı hafif uçtur. 6) Yorumlu çünkü Pyodide uvicorn çalıştıramaz; aşağıdaki Pyodide-eşdeğeri aynı mantığı senkron yürütür.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gerçek churn modeli eğitir, bayt buffer'ından &quot;yükler&quot; (konteyner başlangıcında joblib.load gibi) ve FastAPI'nin döneceği aynı şema ile <code>predict_handler</code> + <code>health_handler</code> sunar — header'lar dahil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io, json, joblib, numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

MODEL_VERSION = "1.2.0"
df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
buf = io.BytesIO(); joblib.dump(GradientBoostingClassifier(random_state=42).fit(Xtr, ytr), buf)
MODEL = joblib.load(io.BytesIO(buf.getvalue()))
N_FEATS = MODEL.n_features_in_

def health_handler(): return {"status": "ok", "model_version": MODEL_VERSION}

def predict_handler(body):
    feats = body.get("features", [])
    if len(feats) != N_FEATS:
        return {"status": 422, "detail": f"{N_FEATS} öznitelik bekleniyordu, {len(feats)} geldi"}
    p = float(MODEL.predict_proba(np.array(feats).reshape(1, -1))[0, 1])
    return {"status": 200, "headers": {"X-Model-Version": MODEL_VERSION},
            "body": {"churn_probability": round(p, 4), "label": int(p > 0.5),
                     "model_version": MODEL_VERSION}}

print(json.dumps(health_handler(), indent=2, ensure_ascii=False))
print(json.dumps(predict_handler({"features": Xte.iloc[0].tolist()}), indent=2, ensure_ascii=False))</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Küçük bir <code>RandomForestClassifier</code>, <code>df_churn</code> üzerinde fit edilir ve <code>io.BytesIO</code>'a serileştirilir — diskteki artefakt taklit edilir. 2) <code>predict_one(payload)</code>, modeli bir kez deserializa eder, sonra JSON benzeri dict alır, gerekli anahtarları doğrular ve çıkarım yapar. 3) <code>time.perf_counter()</code> çağrıyı parantezler — milisaniye cinsinden latency kaydedilir; aynı metrik <code>X-Latency-Ms</code> header'ında açığa çıkar. 4) Fonksiyon <code>{"prob":..., "label":..., "latency_ms":...}</code> döner — gerçek /predict'in sözleşmesi. 5) Üç örnek payload üzerinde çalıştırılır; tarayıcıda hem mutlu yolu hem doğrulama hatasını gözlemleyebilirsiniz.</p>
</div>
<p class="l-text"><strong>Bu servis adım adım ne yapar:</strong> başlatmada model yolu ve sürümünü ortam değişkeninden okur (aynı imaj her sürümü servis edebilsin), joblib artefaktını belleğe bir kez yükler ve <code>n_features_in_</code>'den beklenen öznitelik sayısını öğrenir. <code>/health</code> uç noktası load balancer'ın yokladığı yerdir. <code>/predict</code> JSON'u Pydantic ile doğrular, 2-B diziye dönüştürür, <code>predict_proba</code> çalıştırır, olasılık + etiket + sürümü döndürür. Sürüm hem gövdede hem özel header'da yer alır — sonradan A/B trafik analizi için faydalıdır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Sunucu Olmadan Yerel Çıkarım</h2>
<p class="l-text">Burada uvicorn ayağa kaldıramayız ama çıkarım mantığı aynıdır. Aşağıdaki hücre modeli API'nin yapacağı şekilde eğitir, kaydeder ve tüketir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> io, joblib, numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)
model = <span class="fn">GradientBoostingClassifier</span>(random_state=<span class="num">42</span>).<span class="fn">fit</span>(Xtr, ytr)

buf = io.<span class="fn">BytesIO</span>(); joblib.<span class="fn">dump</span>(model, buf); buf.<span class="fn">seek</span>(<span class="num">0</span>)

<span class="cm"># === API süreci içinde ===</span>
served = joblib.<span class="fn">load</span>(buf)
<span class="kw">def</span> <span class="fn">predict_one</span>(features):
    x = np.<span class="fn">array</span>(features).<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>)
    p = <span class="fn">float</span>(served.<span class="fn">predict_proba</span>(x)[<span class="num">0</span>, <span class="num">1</span>])
    <span class="kw">return</span> {<span class="str">"churn_probability"</span>: <span class="fn">round</span>(p, <span class="num">4</span>), <span class="str">"label"</span>: <span class="fn">int</span>(p &gt; <span class="num">0.5</span>)}

<span class="cm"># İstek gövdesini taklit et</span>
sample = Xte.iloc[<span class="num">0</span>].<span class="fn">tolist</span>()
<span class="fn">print</span>(<span class="fn">predict_one</span>(sample))</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> bir GBM eğitir, bayt buffer'ına yazar, geri yükler (API'nin başlatma yolunu taklit eder) ve FastAPI handler'ının kullandığı şekle birebir oturan ufak bir <code>predict_one</code> fonksiyonu açar. Sonra gerçek bir müşteri satırını içinden geçirip yanıt yükünü yazdırırız.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Async vs Sync</h2>
<p class="l-text">FastAPI sync handler'ları thread havuzunda, async handler'ları event loop'ta çalıştırır. ML modelleri CPU-bağımlıdır; async ancak istek I/O beklediğinde yardımcı olur (DB, vektör store, LLM API). Desen:</p>
<div class="calc-steps">
<div class="calc-step"><strong>Sync def</strong> — saf CPU çıkarımı, await yok. Çoğu sklearn / xgboost servisi.</div>
<div class="calc-step"><strong>Async def</strong> — DB'den öznitelik çekerken veya dış LLM çağırırken. <code>async def predict(...)</code> + <code>await db.fetch(...)</code>.</div>
<div class="calc-step"><strong>Ağır CPU'yu loop dışına</strong> — async handler'da <code>await loop.run_in_executor(None, model.predict, x)</code>.</div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. BentoML, TorchServe, TF Serving</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">BentoML</div><div class="calc-card-body">Python öncelikli model serving; batching, runner'lar, "Bento"lara paketleme. ML için FastAPI'den daha az boilerplate.</div></div>
<div class="calc-card"><div class="calc-card-title">TorchServe</div><div class="calc-card-body">Resmi PyTorch sunucusu. Çoklu model, GPU farkındalığı, gRPC + REST.</div></div>
<div class="calc-card"><div class="calc-card-title">TF Serving</div><div class="calc-card-body">SavedModel için yüksek performanslı C++ sunucusu. gRPC, GPU, sıcak takas.</div></div>
<div class="calc-card"><div class="calc-card-title">Triton</div><div class="calc-card-body">NVIDIA'nın çok dilli sunucusu (ONNX, PyTorch, TF, özel). En yüksek ham GPU verimi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Gecikmenin Anatomisi</h2>
<div id="mlops-l6-graph-tr" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Tipik bir sklearn API çağrısında milisaniyelerin gittiği yer. Ağ ve JSON sıkça modelin kendi hesabını gölgede bırakır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>Modeli HTTP'ye sarın ki her istemci tüketebilsin; Python tarafında FastAPI fiili seçimdir.</li>
<li>Modeli başlatmada bir kez yükleyin, girdiyi Pydantic ile doğrulayın, JSON + sürüm header'ı döndürün.</li>
<li>Health uç noktası zorunludur — load balancer ve Kubernetes prob'ları ister.</li>
<li>Async ancak I/O beklerken yardım eder; CPU-bağımlı çıkarım sync'te (ya da executor'da) durur.</li>
<li>Ölçekli derin öğrenme için elle FastAPI yerine Triton / TorchServe / TF Serving tercih edin.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l6-graph-tr', [{
    labels:['Ağ','JSON parse','Pydantic','Çıkarım','Loglama'],
    values:[14, 6, 3, 8, 2], type:'pie', marker:{colors:[accent,'#888','#ccc','#666','#444']}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, title:'33 ms nereye gidiyor (örnek)',
    margin:{t:60,r:30,b:30,l:30}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
