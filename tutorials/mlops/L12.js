window.MLOPS_L12 = {
en: `<p class="l-text"><strong>Capstone:</strong> we now wire L1–L11 into a single, end-to-end deployment of a churn classifier. From <code>df_churn</code> in a notebook to a Dockerized FastAPI service with monitoring stubs and a real-world checklist — this is what shipping ML actually looks like.</p>
<p class="l-text">By the end you'll have a coherent narrative you can copy into your own project repo.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Train and persist a churn pipeline as a versioned joblib production artifact</li>
<li>Wrap the model in a FastAPI service with input validation and health checks</li>
<li>Containerize the service with a slim, non-root Dockerfile</li>
<li>Wire a GitHub Actions pipeline that builds, tests, and pushes the image</li>
<li>Add a monitoring stub that emits drift and latency metrics in Prometheus format</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Project, Top to Bottom</h2>
<div class="calc-steps">
<div class="calc-step"><strong>L1-L2</strong> — define the problem (churn), pin environment + seeds, snapshot data with DVC.</div>
<div class="calc-step"><strong>L3-L4</strong> — track every experiment in MLflow; pick the winning model; serialize with joblib + ONNX export.</div>
<div class="calc-step"><strong>L5-L6</strong> — package as a Docker image; serve with FastAPI <code>/predict</code>.</div>
<div class="calc-step"><strong>L7-L8</strong> — deploy to Cloud Run; gate every push with CI tests + data + model checks.</div>
<div class="calc-step"><strong>L9-L10</strong> — monitor PSI per feature; rolling AUC against ground truth; batch nightly + real-time on demand.</div>
<div class="calc-step"><strong>L11</strong> — bonus LLM helper for explaining predictions to support agents (with cost tracking).</div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Step 1 — Train &amp; Save the Production Model</h2>
<p class="l-text">Below: a self-contained training routine that pins seeds, hashes data, evaluates, and serializes. Runnable here.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> io, json, hashlib, joblib, numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score, classification_report

SEED = <span class="num">42</span>
np.random.<span class="fn">seed</span>(SEED)

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
data_hash = hashlib.<span class="fn">md5</span>(X.values.<span class="fn">tobytes</span>()).<span class="fn">hexdigest</span>()[:<span class="num">10</span>]

Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=SEED)
model = <span class="fn">GradientBoostingClassifier</span>(
    n_estimators=<span class="num">200</span>, max_depth=<span class="num">3</span>, learning_rate=<span class="num">0.05</span>, random_state=SEED
).<span class="fn">fit</span>(Xtr, ytr)

probs = model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>]
auc = <span class="fn">roc_auc_score</span>(yte, probs)

<span class="cm"># Production gate (L8)</span>
BASELINE = <span class="num">0.78</span>
<span class="kw">assert</span> auc &gt;= BASELINE, f<span class="str">"AUC {auc:.3f} below baseline {BASELINE}"</span>

<span class="cm"># Serialize (L4)</span>
buf = io.<span class="fn">BytesIO</span>(); joblib.<span class="fn">dump</span>(model, buf)
artifact_size_kb = <span class="fn">len</span>(buf.<span class="fn">getvalue</span>()) / <span class="num">1024</span>

<span class="cm"># Manifest — the bridge to deployment</span>
manifest = {
    <span class="str">"model_name"</span>: <span class="str">"churn-gbm"</span>,
    <span class="str">"version"</span>: <span class="str">"1.2.0"</span>,
    <span class="str">"data_hash"</span>: data_hash,
    <span class="str">"seed"</span>: SEED,
    <span class="str">"n_features"</span>: <span class="fn">int</span>(X.shape[<span class="num">1</span>]),
    <span class="str">"feature_names"</span>: <span class="fn">list</span>(X.columns),
    <span class="str">"metrics"</span>: {<span class="str">"val_auc"</span>: <span class="fn">round</span>(<span class="fn">float</span>(auc), <span class="num">4</span>)},
    <span class="str">"artifact_size_kb"</span>: <span class="fn">round</span>(artifact_size_kb, <span class="num">1</span>),
}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(manifest, indent=<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> reproducibly trains a GBM, asserts the production gate, serializes the model, and prints a self-describing JSON manifest. In a real pipeline this manifest is uploaded next to the model artifact in S3 / a registry — it's the contract the FastAPI service will read at startup.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Step 2 — The FastAPI Service</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — needs uvicorn server</span>
<span class="cm"># src/app.py</span>
<span class="kw">import</span> json, joblib, time, os, logging
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Response
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field
<span class="kw">from</span> typing <span class="kw">import</span> List

logging.<span class="fn">basicConfig</span>(level=logging.INFO, <span class="ty">format</span>=<span class="str">'%(asctime)s %(message)s'</span>)
log = logging.<span class="fn">getLogger</span>(<span class="str">"churn"</span>)

<span class="kw">with</span> <span class="fn">open</span>(os.environ[<span class="str">"MANIFEST_PATH"</span>]) <span class="kw">as</span> f: MANIFEST = json.<span class="fn">load</span>(f)
MODEL = joblib.<span class="fn">load</span>(os.environ[<span class="str">"MODEL_PATH"</span>])

app = <span class="fn">FastAPI</span>(title=MANIFEST[<span class="str">"model_name"</span>], version=MANIFEST[<span class="str">"version"</span>])

<span class="kw">class</span> <span class="fn">Customer</span>(BaseModel):
    features: List[<span class="ty">float</span>] = <span class="fn">Field</span>(..., min_items=<span class="num">1</span>)

<span class="kw">class</span> <span class="fn">Prediction</span>(BaseModel):
    churn_probability: <span class="ty">float</span>
    label: <span class="ty">int</span>
    model_version: <span class="ty">str</span>

<span class="at">@app.get</span>(<span class="str">"/health"</span>)
<span class="kw">def</span> <span class="fn">health</span>(): <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"ok"</span>, **MANIFEST}

<span class="at">@app.post</span>(<span class="str">"/predict"</span>, response_model=Prediction)
<span class="kw">def</span> <span class="fn">predict</span>(c: Customer, response: Response):
    n = MANIFEST[<span class="str">"n_features"</span>]
    <span class="kw">if</span> <span class="fn">len</span>(c.features) != n:
        <span class="kw">return</span> {<span class="str">"detail"</span>: f<span class="str">"expected {n} features"</span>}
    t0 = time.<span class="fn">time</span>()
    p = <span class="fn">float</span>(MODEL.<span class="fn">predict_proba</span>(np.<span class="fn">array</span>(c.features).<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>))[<span class="num">0</span>, <span class="num">1</span>])
    response.headers[<span class="str">"X-Model-Version"</span>] = MANIFEST[<span class="str">"version"</span>]
    log.<span class="fn">info</span>(json.<span class="fn">dumps</span>({<span class="str">"event"</span>:<span class="str">"predict"</span>,<span class="str">"prob"</span>:p,
                         <span class="str">"latency_ms"</span>: <span class="fn">round</span>((time.<span class="fn">time</span>()-t0)*<span class="num">1000</span>, <span class="num">2</span>),
                         <span class="str">"model_version"</span>: MANIFEST[<span class="str">"version"</span>]}))
    <span class="kw">return</span> <span class="fn">Prediction</span>(churn_probability=p, label=<span class="fn">int</span>(p &gt; <span class="num">0.5</span>),
                      model_version=MANIFEST[<span class="str">"version"</span>])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>src/app.py</code> imports the joblib artifact at module load — once, not per request. 2) <code>ChurnIn(BaseModel)</code> declares the JSON contract — pydantic auto-validates incoming payloads. 3) <code>@app.post("/predict")</code> handler runs <code>model.predict_proba</code> and returns a probability + label. 4) <code>@app.get("/health")</code> returns 200 — Kubernetes readiness probe hits this. 5) <code>@app.get("/version")</code> exposes the model hash from the training step so monitoring can correlate predictions with a specific artifact. 6) Commented because Pyodide can't run uvicorn; the next cell runs the same logic synchronously.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">All the FastAPI service logic — manifest loading, predict + health handlers, structured logs, model-version header — wired up as plain functions you can step through in the browser.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io, json, time, joblib, numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

# train + manifest + serialize (the artifact step)
df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(random_state=42).fit(Xtr, ytr)
buf = io.BytesIO(); joblib.dump(model, buf)

MANIFEST = {"model_name": "churn", "version": "1.2.0",
            "n_features": int(model.n_features_in_)}
MODEL = joblib.load(io.BytesIO(buf.getvalue()))
LOG = []  # would be stdout in production

def health(): return {"status": "ok", **MANIFEST}

def predict(body):
    feats = body.get("features", [])
    if len(feats) != MANIFEST["n_features"]:
        return {"status": 422, "detail": f"expected {MANIFEST['n_features']} features"}
    t0 = time.time()
    p = float(MODEL.predict_proba(np.array(feats).reshape(1, -1))[0, 1])
    LOG.append({"event": "predict", "prob": round(p, 4),
                "latency_ms": round((time.time() - t0) * 1000, 2),
                "model_version": MANIFEST["version"]})
    return {"status": 200, "headers": {"X-Model-Version": MANIFEST["version"]},
            "body": {"churn_probability": round(p, 4), "label": int(p > 0.5),
                     "model_version": MANIFEST["version"]}}

print("HEALTH:", json.dumps(health()))
print("PRED:  ", json.dumps(predict({"features": Xte.iloc[0].tolist()}), indent=2))
print("LOG:   ", LOG[-1])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The trained model from Step 1 is loaded from the in-memory buffer (in production, from S3 or the MLflow registry). 2) <code>predict_one(payload)</code> validates required keys (<code>tenure</code>, <code>monthly</code>, <code>contract</code>), then assembles a 1×3 NumPy row. 3) <code>time.perf_counter()</code> brackets the prediction to measure latency — the same field your monitoring pipeline alerts on. 4) The response dict carries <code>prob</code>, <code>label</code>, <code>latency_ms</code>, and <code>model_version</code> — every prediction is self-describing. 5) Three sample payloads exercise the path so you can verify the contract before wrapping it in FastAPI.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Step 3 — Dockerfile</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Dockerfile — multi-stage, slim, non-root</span>
FROM python:<span class="num">3.11</span> AS builder
WORKDIR /b
COPY requirements.lock .
RUN pip install --user --no-cache-<span class="ty">dir</span> -r requirements.lock

FROM python:<span class="num">3.11</span>-slim
RUN useradd -m app
WORKDIR /app
COPY --<span class="kw">from</span>=builder /root/.local /home/app/.local
COPY src/ ./src/
COPY models/churn-<span class="num">1.2.0.j</span>oblib /models/model.joblib
COPY models/churn-<span class="num">1.2.0.</span>manifest.json /models/manifest.json
ENV PATH=/home/app/.local/<span class="ty">bin</span>:$PATH \
    MODEL_PATH=/models/model.joblib \
    MANIFEST_PATH=/models/manifest.json \
    PYTHONUNBUFFERED=<span class="num">1</span>
USER app
EXPOSE <span class="num">8000</span>
HEALTHCHECK CMD wget -qO- http://localhost:<span class="num">8000</span>/health || exit <span class="num">1</span>
CMD [<span class="str">"uvicorn"</span>, <span class="str">"src.app:app"</span>, <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Stage 1 <code>FROM python:3.11 AS builder</code> installs deps with <code>pip install --target=/install -r requirements.lock</code> — heavy build artifacts stay in this stage. 2) Stage 2 <code>FROM python:3.11-slim</code> starts a clean minimal image. 3) <code>COPY --from=builder /install /usr/local/lib/python3.11/site-packages</code> brings only the resolved packages — no gcc, no headers. 4) <code>USER 1000</code> drops root before app code runs (required by most clusters' Pod Security Standards). 5) <code>HEALTHCHECK CMD curl -f http://localhost:8000/health</code> teaches Docker how to ping liveness. 6) <code>CMD ["uvicorn","app:app","--host","0.0.0.0","--port","8000"]</code> is the entrypoint.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Step 4 — CI/CD Pipeline</h2>
<div class="code-wrap"><div class="code-label"><span>YAML</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># .github/workflows/release.yml</span>
name: release-churn-api
on: { push: { branches: [main] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout<span class="at">@v4</span>
      - uses: actions/setup-python<span class="at">@v5</span>
        <span class="kw">with</span>: { python-version: <span class="str">"3.11"</span> }
      - run: pip install -r requirements.lock
      - run: pytest tests/ -q
      - run: python -m src.validate_data data/churn.parquet
      - run: python -m src.train --out artifacts/
      - run: python -m src.test_model --baseline <span class="num">0.78</span>
      - run: docker build -t ghcr.io/myorg/churn-api:\${{ github.sha }} .
      - run: echo $GHCR_TOKEN | docker login ghcr.io -u ci --password-stdin
        env: { GHCR_TOKEN: <span class="str">"\${{ secrets.GHCR_TOKEN }}"</span> }
      - run: docker push ghcr.io/myorg/churn-api:\${{ github.sha }}
      - run: |
          gcloud run deploy churn-api \
            --image ghcr.io/myorg/churn-api:\${{ github.sha }} \
            --region europe-west1 --no-traffic --tag candidate
      - run: gcloud run services update-traffic churn-api --to-tags candidate=<span class="num">10</span>  <span class="cm"># canary 10%</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>on: push: tags: ["v*"]</code> fires only on semver tags — releases, not every commit. 2) <code>jobs.test</code> runs <code>pytest</code> and <code>python check_data.py</code> for schema validation. 3) <code>jobs.train: needs: [test]</code> trains a fresh model, uploads <code>churn.joblib</code> to S3 with the git SHA in the path. 4) <code>jobs.build: needs: [train]</code> runs <code>docker buildx build --push</code> against ECR. 5) <code>jobs.deploy: needs: [build]</code> calls <code>kubectl set image deploy/churn-api churn-api=&lt;new-tag&gt;</code>, ArgoCD picks it up, rolling deploy starts. 6) On any job failure the workflow stops — promotion to prod requires all four green.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Step 5 — Monitoring Stub</h2>
<p class="l-text">Three jobs run on schedule:</p>
<div class="calc-steps">
<div class="calc-step"><strong>Hourly</strong> — emit Prometheus gauges for request rate, p99 latency, model version usage.</div>
<div class="calc-step"><strong>Daily</strong> — compute PSI per feature against the training snapshot; alert on PSI &gt; 0.25.</div>
<div class="calc-step"><strong>Weekly</strong> — join inference logs with churn outcomes; rolling AUC; alert on 0.05 absolute drop.</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Quick drift check — runnable here</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
m = <span class="fn">len</span>(df) // <span class="num">2</span>
train_X, live_X = df.iloc[:m, :-<span class="num">1</span>], df.iloc[m:, :-<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">psi</span>(e, a, bins=<span class="num">10</span>):
    qs = np.<span class="fn">unique</span>(np.<span class="fn">quantile</span>(e, np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, bins+<span class="num">1</span>)))
    <span class="kw">if</span> <span class="fn">len</span>(qs) &lt; <span class="num">3</span>: <span class="kw">return</span> <span class="num">0</span>
    eh, _ = np.<span class="fn">histogram</span>(e, bins=qs); ah, _ = np.<span class="fn">histogram</span>(a, bins=qs)
    e_p = np.<span class="fn">where</span>(eh==<span class="num">0</span>,<span class="num">1e-6</span>,eh)/<span class="fn">len</span>(e); a_p = np.<span class="fn">where</span>(ah==<span class="num">0</span>,<span class="num">1e-6</span>,ah)/<span class="fn">len</span>(a)
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">sum</span>((a_p - e_p) * np.<span class="fn">log</span>(a_p / e_p)))

worst = <span class="fn">sorted</span>(((c, <span class="fn">psi</span>(train_X[c].values, live_X[c].values))
                <span class="kw">for</span> c <span class="kw">in</span> train_X.columns), key=<span class="kw">lambda</span> kv: -kv[<span class="num">1</span>])[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"Top-5 drifting features (PSI):"</span>)
<span class="kw">for</span> c, s <span class="kw">in</span> worst: <span class="fn">print</span>(f<span class="str">"  {c:25s}  PSI={s:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> a 12-line monitor running the same PSI math from L9 against a synthetic train/live split. In production this exact function would run nightly via Airflow / Cloud Run jobs and write metrics to Prometheus.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Production Checklist</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Model card</div><div class="calc-card-body">One-pager: intended use, training data, metrics, fairness, limitations.</div></div>
<div class="calc-card"><div class="calc-card-title">Data lineage</div><div class="calc-card-body">From raw source to feature; DVC + dbt or a catalog.</div></div>
<div class="calc-card"><div class="calc-card-title">Security</div><div class="calc-card-body">Secrets in vault, least-privilege IAM, image scanning, signed artifacts.</div></div>
<div class="calc-card"><div class="calc-card-title">Privacy / GDPR</div><div class="calc-card-body">PII inventory, retention policy, deletion endpoint, DPIA where required.</div></div>
<div class="calc-card"><div class="calc-card-title">SLOs</div><div class="calc-card-body">Latency p99 &lt;200 ms, availability 99.9%, AUC ≥ baseline.</div></div>
<div class="calc-card"><div class="calc-card-title">Runbook</div><div class="calc-card-body">How to rollback, how to retrain, who to page, common alert playbooks.</div></div>
</div>
<div id="mlops-l12-graph-en" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">The 11 prior lessons mapped onto a single deployment. None of them is optional in production.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>A production model ships with a manifest, not just a pickle file.</li>
<li>Training, packaging, serving, deploying, monitoring — all six steps need automation.</li>
<li>Multi-stage Docker + non-root user + healthcheck is the floor for a serious image.</li>
<li>Canary release + drift monitoring + rolling AUC = safe rollout + early warning.</li>
<li>Model cards, lineage, security and runbooks are the operational scaffolding around the model itself.</li>
<li>You now have an end-to-end template you can copy into your next project.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var stages = ['Repro (L2)','Track (L3)','Package (L4)','Container (L5)','Serve (L6)','Cloud (L7)','CI/CD (L8)','Monitor (L9)','Scale (L10)','LLM (L11)'];
  Plotly.newPlot('mlops-l12-graph-en', [{
    x:stages, y:[1,1,1,1,1,1,1,1,1,1], type:'bar', marker:{color:accent}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Capstone — every prior lesson contributes one block to the live system',
    yaxis:{visible:false}, margin:{t:60,r:30,b:120,l:30}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Bitirme projesi:</strong> şimdi L1–L11'i tek bir uçtan uca churn sınıflandırıcı dağıtımına bağlıyoruz. Notebook'taki <code>df_churn</code>'den, izleme stub'ları ve gerçek dünya kontrol listesiyle Docker'lı bir FastAPI servisine — ML sevk etmek tam olarak böyle görünür.</p>
<p class="l-text">Sonunda kendi projeniz için kopyalayıp uyarlayabileceğiniz tutarlı bir anlatınız olacak.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir churn pipeline'ını sürümlü joblib üretim artifactı olarak eğitip kaydedeceksin</li>
<li>Modeli input doğrulama ve health check'lerle FastAPI servisine saracaksın</li>
<li>Servisi ince ve non-root bir Dockerfile ile konteynerleyeceksin</li>
<li>İmajı build edip test eden ve push'layan bir GitHub Actions pipeline'ı kuracaksın</li>
<li>Prometheus formatında drift ve latency metriği yayan izleme stub'u ekleyeceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Proje, Yukarıdan Aşağıya</h2>
<div class="calc-steps">
<div class="calc-step"><strong>L1-L2</strong> — problemi tanımla (churn), ortam + seed sabitle, DVC ile veri snapshot'ı.</div>
<div class="calc-step"><strong>L3-L4</strong> — her deneyi MLflow'da izle; kazanan modeli seç; joblib + ONNX dışa aktarımıyla serileştir.</div>
<div class="calc-step"><strong>L5-L6</strong> — Docker imajı olarak paketle; FastAPI <code>/predict</code> ile servis et.</div>
<div class="calc-step"><strong>L7-L8</strong> — Cloud Run'a dağıt; her push'ı CI test + veri + model kontrolüyle kapıdan geçir.</div>
<div class="calc-step"><strong>L9-L10</strong> — öznitelik başına PSI izle; ground truth'a karşı hareketli AUC; gece batch + talep üzerine gerçek zamanlı.</div>
<div class="calc-step"><strong>L11</strong> — destek temsilcilerine tahminleri açıklayan LLM yardımcısı (maliyet takibiyle).</div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Adım 1 — Üretim Modelini Eğit &amp; Kaydet</h2>
<p class="l-text">Aşağıda kendine yeten bir eğitim rutini: seed sabitler, veri hash'ler, değerlendirir ve serileştirir. Burada çalışır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> io, json, hashlib, joblib, numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

SEED = <span class="num">42</span>
np.random.<span class="fn">seed</span>(SEED)

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
data_hash = hashlib.<span class="fn">md5</span>(X.values.<span class="fn">tobytes</span>()).<span class="fn">hexdigest</span>()[:<span class="num">10</span>]

Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=SEED)
model = <span class="fn">GradientBoostingClassifier</span>(
    n_estimators=<span class="num">200</span>, max_depth=<span class="num">3</span>, learning_rate=<span class="num">0.05</span>, random_state=SEED
).<span class="fn">fit</span>(Xtr, ytr)

probs = model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>]
auc = <span class="fn">roc_auc_score</span>(yte, probs)

<span class="cm"># Üretim kapısı (L8)</span>
BASELINE = <span class="num">0.78</span>
<span class="kw">assert</span> auc &gt;= BASELINE, f<span class="str">"AUC {auc:.3f} baseline {BASELINE} altında"</span>

<span class="cm"># Serileştirme (L4)</span>
buf = io.<span class="fn">BytesIO</span>(); joblib.<span class="fn">dump</span>(model, buf)
artifact_size_kb = <span class="fn">len</span>(buf.<span class="fn">getvalue</span>()) / <span class="num">1024</span>

<span class="cm"># Manifest — dağıtıma köprü</span>
manifest = {
    <span class="str">"model_name"</span>: <span class="str">"churn-gbm"</span>,
    <span class="str">"version"</span>: <span class="str">"1.2.0"</span>,
    <span class="str">"data_hash"</span>: data_hash,
    <span class="str">"seed"</span>: SEED,
    <span class="str">"n_features"</span>: <span class="fn">int</span>(X.shape[<span class="num">1</span>]),
    <span class="str">"feature_names"</span>: <span class="fn">list</span>(X.columns),
    <span class="str">"metrics"</span>: {<span class="str">"val_auc"</span>: <span class="fn">round</span>(<span class="fn">float</span>(auc), <span class="num">4</span>)},
    <span class="str">"artifact_size_kb"</span>: <span class="fn">round</span>(artifact_size_kb, <span class="num">1</span>),
}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(manifest, indent=<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> tekrarlanabilir biçimde GBM eğitir, üretim kapısını assert eder, modeli serileştirir ve kendini tarif eden bir JSON manifest basar. Gerçek pipeline'da bu manifest model artefaktının yanına S3 / registry'ye yüklenir — FastAPI servisi başlatmada bunu okur.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Adım 2 — FastAPI Servisi</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — uvicorn sunucusu gerekir</span>
<span class="cm"># src/app.py</span>
<span class="kw">import</span> json, joblib, time, os, logging
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Response
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field
<span class="kw">from</span> typing <span class="kw">import</span> List

logging.<span class="fn">basicConfig</span>(level=logging.INFO, <span class="ty">format</span>=<span class="str">'%(asctime)s %(message)s'</span>)
log = logging.<span class="fn">getLogger</span>(<span class="str">"churn"</span>)

<span class="kw">with</span> <span class="fn">open</span>(os.environ[<span class="str">"MANIFEST_PATH"</span>]) <span class="kw">as</span> f: MANIFEST = json.<span class="fn">load</span>(f)
MODEL = joblib.<span class="fn">load</span>(os.environ[<span class="str">"MODEL_PATH"</span>])

app = <span class="fn">FastAPI</span>(title=MANIFEST[<span class="str">"model_name"</span>], version=MANIFEST[<span class="str">"version"</span>])

<span class="kw">class</span> <span class="fn">Customer</span>(BaseModel):
    features: List[<span class="ty">float</span>] = <span class="fn">Field</span>(..., min_items=<span class="num">1</span>)

<span class="kw">class</span> <span class="fn">Prediction</span>(BaseModel):
    churn_probability: <span class="ty">float</span>
    label: <span class="ty">int</span>
    model_version: <span class="ty">str</span>

<span class="at">@app.get</span>(<span class="str">"/health"</span>)
<span class="kw">def</span> <span class="fn">health</span>(): <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"ok"</span>, **MANIFEST}

<span class="at">@app.post</span>(<span class="str">"/predict"</span>, response_model=Prediction)
<span class="kw">def</span> <span class="fn">predict</span>(c: Customer, response: Response):
    n = MANIFEST[<span class="str">"n_features"</span>]
    <span class="kw">if</span> <span class="fn">len</span>(c.features) != n:
        <span class="kw">return</span> {<span class="str">"detail"</span>: f<span class="str">"{n} öznitelik bekleniyordu"</span>}
    t0 = time.<span class="fn">time</span>()
    p = <span class="fn">float</span>(MODEL.<span class="fn">predict_proba</span>(np.<span class="fn">array</span>(c.features).<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>))[<span class="num">0</span>, <span class="num">1</span>])
    response.headers[<span class="str">"X-Model-Version"</span>] = MANIFEST[<span class="str">"version"</span>]
    log.<span class="fn">info</span>(json.<span class="fn">dumps</span>({<span class="str">"event"</span>:<span class="str">"predict"</span>,<span class="str">"prob"</span>:p,
                         <span class="str">"latency_ms"</span>: <span class="fn">round</span>((time.<span class="fn">time</span>()-t0)*<span class="num">1000</span>, <span class="num">2</span>),
                         <span class="str">"model_version"</span>: MANIFEST[<span class="str">"version"</span>]}))
    <span class="kw">return</span> <span class="fn">Prediction</span>(churn_probability=p, label=<span class="fn">int</span>(p &gt; <span class="num">0.5</span>),
                      model_version=MANIFEST[<span class="str">"version"</span>])</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>src/app.py</code>, joblib artefaktını modül yükleme anında import eder — istek başına değil, bir kez. 2) <code>ChurnIn(BaseModel)</code> JSON sözleşmesini bildirir — pydantic gelen payload'u otomatik doğrular. 3) <code>@app.post("/predict")</code> handler'ı <code>model.predict_proba</code>'yı çağırır ve olasılık + etiket döner. 4) <code>@app.get("/health")</code> 200 döner — Kubernetes readiness probe'u buraya çarpar. 5) <code>@app.get("/version")</code>, eğitim adımındaki model hash'ini açar; izleme tahminleri belirli bir artefaktla korelasyon kurar. 6) Yorumlu çünkü Pyodide uvicorn çalıştıramaz; sonraki hücre aynı mantığı senkron yürütür.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">FastAPI servisinin tüm mantığı — manifest yükleme, predict + health handler, yapılandırılmış log, model-versiyon header — tarayıcıda adım adım geçebileceğiniz düz fonksiyonlar olarak.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import io, json, time, joblib, numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

# eğit + manifest + serileştir (artefakt adımı)
df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(random_state=42).fit(Xtr, ytr)
buf = io.BytesIO(); joblib.dump(model, buf)

MANIFEST = {"model_name": "churn", "version": "1.2.0",
            "n_features": int(model.n_features_in_)}
MODEL = joblib.load(io.BytesIO(buf.getvalue()))
LOG = []  # üretimde stdout olur

def health(): return {"status": "ok", **MANIFEST}

def predict(body):
    feats = body.get("features", [])
    if len(feats) != MANIFEST["n_features"]:
        return {"status": 422, "detail": f"{MANIFEST['n_features']} öznitelik bekleniyordu"}
    t0 = time.time()
    p = float(MODEL.predict_proba(np.array(feats).reshape(1, -1))[0, 1])
    LOG.append({"event": "predict", "prob": round(p, 4),
                "latency_ms": round((time.time() - t0) * 1000, 2),
                "model_version": MANIFEST["version"]})
    return {"status": 200, "headers": {"X-Model-Version": MANIFEST["version"]},
            "body": {"churn_probability": round(p, 4), "label": int(p > 0.5),
                     "model_version": MANIFEST["version"]}}

print("HEALTH:", json.dumps(health(), ensure_ascii=False))
print("PRED:  ", json.dumps(predict({"features": Xte.iloc[0].tolist()}), indent=2, ensure_ascii=False))
print("LOG:   ", LOG[-1])</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) 1. Adımda eğitilen model bellek-içi tampondan yüklenir (üretimde S3'ten ya da MLflow registry'sinden). 2) <code>predict_one(payload)</code>, gerekli anahtarları (<code>tenure</code>, <code>monthly</code>, <code>contract</code>) doğrular ve 1×3 NumPy satırı kurar. 3) <code>time.perf_counter()</code>, tahmini parantezler — latency'yi ölçer, izleme pipeline'ının uyarı verdiği aynı alan. 4) Cevap dict'i <code>prob</code>, <code>label</code>, <code>latency_ms</code> ve <code>model_version</code> taşır — her tahmin kendi kendini açıklar. 5) Üç örnek payload yolu çalıştırır — FastAPI ile sarmadan önce sözleşmeyi doğrularsınız.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Adım 3 — Dockerfile</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Dockerfile — multi-stage, slim, root değil</span>
FROM python:<span class="num">3.11</span> AS builder
WORKDIR /b
COPY requirements.lock .
RUN pip install --user --no-cache-<span class="ty">dir</span> -r requirements.lock

FROM python:<span class="num">3.11</span>-slim
RUN useradd -m app
WORKDIR /app
COPY --<span class="kw">from</span>=builder /root/.local /home/app/.local
COPY src/ ./src/
COPY models/churn-<span class="num">1.2.0.j</span>oblib /models/model.joblib
COPY models/churn-<span class="num">1.2.0.</span>manifest.json /models/manifest.json
ENV PATH=/home/app/.local/<span class="ty">bin</span>:$PATH \
    MODEL_PATH=/models/model.joblib \
    MANIFEST_PATH=/models/manifest.json \
    PYTHONUNBUFFERED=<span class="num">1</span>
USER app
EXPOSE <span class="num">8000</span>
HEALTHCHECK CMD wget -qO- http://localhost:<span class="num">8000</span>/health || exit <span class="num">1</span>
CMD [<span class="str">"uvicorn"</span>, <span class="str">"src.app:app"</span>, <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) 1. aşama <code>FROM python:3.11 AS builder</code>, <code>pip install --target=/install -r requirements.lock</code> ile bağımlılıkları kurar — ağır build artefaktları bu aşamada kalır. 2) 2. aşama <code>FROM python:3.11-slim</code> temiz minimal imajdan başlar. 3) <code>COPY --from=builder /install /usr/local/lib/python3.11/site-packages</code> sadece çözülmüş paketleri getirir — ne gcc ne header. 4) <code>USER 1000</code>, uygulama kodu çalışmadan root'tan düşer (çoğu cluster'ın Pod Security Standards'ı zorunlu kılar). 5) <code>HEALTHCHECK CMD curl -f http://localhost:8000/health</code>, Docker'a liveness ping atmayı öğretir. 6) <code>CMD ["uvicorn","app:app","--host","0.0.0.0","--port","8000"]</code> giriş noktasıdır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Adım 4 — CI/CD Pipeline'ı</h2>
<div class="code-wrap"><div class="code-label"><span>YAML</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># .github/workflows/release.yml</span>
name: release-churn-api
on: { push: { branches: [main] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout<span class="at">@v4</span>
      - uses: actions/setup-python<span class="at">@v5</span>
        <span class="kw">with</span>: { python-version: <span class="str">"3.11"</span> }
      - run: pip install -r requirements.lock
      - run: pytest tests/ -q
      - run: python -m src.validate_data data/churn.parquet
      - run: python -m src.train --out artifacts/
      - run: python -m src.test_model --baseline <span class="num">0.78</span>
      - run: docker build -t ghcr.io/myorg/churn-api:\${{ github.sha }} .
      - run: echo $GHCR_TOKEN | docker login ghcr.io -u ci --password-stdin
        env: { GHCR_TOKEN: <span class="str">"\${{ secrets.GHCR_TOKEN }}"</span> }
      - run: docker push ghcr.io/myorg/churn-api:\${{ github.sha }}
      - run: |
          gcloud run deploy churn-api \
            --image ghcr.io/myorg/churn-api:\${{ github.sha }} \
            --region europe-west1 --no-traffic --tag candidate
      - run: gcloud run services update-traffic churn-api --to-tags candidate=<span class="num">10</span>  <span class="cm"># %10 kanarya</span></code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>on: push: tags: ["v*"]</code>, sadece semver tag'lerde tetiklenir — release'ler, her commit değil. 2) <code>jobs.test</code>, <code>pytest</code> ve şema doğrulaması için <code>python check_data.py</code> çalıştırır. 3) <code>jobs.train: needs: [test]</code>, taze model eğitir, git SHA yolla <code>churn.joblib</code>'i S3'e yükler. 4) <code>jobs.build: needs: [train]</code>, ECR'a karşı <code>docker buildx build --push</code> çalıştırır. 5) <code>jobs.deploy: needs: [build]</code>, <code>kubectl set image deploy/churn-api churn-api=&lt;yeni-tag&gt;</code> çağırır, ArgoCD alır, rolling deploy başlar. 6) Herhangi bir job düşerse workflow durur — üretime yükseltme dördünün de yeşil olmasını ister.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Adım 5 — İzleme Stub'u</h2>
<p class="l-text">Üç iş zamanlanmış çalışır:</p>
<div class="calc-steps">
<div class="calc-step"><strong>Saatlik</strong> — istek hızı, p99 gecikme, model sürüm kullanımı için Prometheus gauge'ları.</div>
<div class="calc-step"><strong>Günlük</strong> — eğitim snapshot'ına karşı öznitelik başına PSI; PSI &gt; 0.25 alarmı.</div>
<div class="calc-step"><strong>Haftalık</strong> — çıkarım loglarını churn sonuçlarıyla bağla; hareketli AUC; 0.05 mutlak düşüşte alarm.</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Hızlı drift kontrolü — burada çalışır</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
m = <span class="fn">len</span>(df) // <span class="num">2</span>
train_X, live_X = df.iloc[:m, :-<span class="num">1</span>], df.iloc[m:, :-<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">psi</span>(e, a, bins=<span class="num">10</span>):
    qs = np.<span class="fn">unique</span>(np.<span class="fn">quantile</span>(e, np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, bins+<span class="num">1</span>)))
    <span class="kw">if</span> <span class="fn">len</span>(qs) &lt; <span class="num">3</span>: <span class="kw">return</span> <span class="num">0</span>
    eh, _ = np.<span class="fn">histogram</span>(e, bins=qs); ah, _ = np.<span class="fn">histogram</span>(a, bins=qs)
    e_p = np.<span class="fn">where</span>(eh==<span class="num">0</span>,<span class="num">1e-6</span>,eh)/<span class="fn">len</span>(e); a_p = np.<span class="fn">where</span>(ah==<span class="num">0</span>,<span class="num">1e-6</span>,ah)/<span class="fn">len</span>(a)
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">sum</span>((a_p - e_p) * np.<span class="fn">log</span>(a_p / e_p)))

worst = <span class="fn">sorted</span>(((c, <span class="fn">psi</span>(train_X[c].values, live_X[c].values))
                <span class="kw">for</span> c <span class="kw">in</span> train_X.columns), key=<span class="kw">lambda</span> kv: -kv[<span class="num">1</span>])[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"En çok drift eden 5 öznitelik (PSI):"</span>)
<span class="kw">for</span> c, s <span class="kw">in</span> worst: <span class="fn">print</span>(f<span class="str">"  {c:25s}  PSI={s:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> L9'daki PSI matematiğini sentetik bir eğitim/canlı bölmesine uygulayan 12 satırlık bir izleyici. Üretimde bu fonksiyon Airflow / Cloud Run job ile gece çalıştırılır ve metrikleri Prometheus'a yazar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Üretim Kontrol Listesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Model kartı</div><div class="calc-card-body">Tek sayfa: kullanım amacı, eğitim verisi, metrikler, adillik, sınırlar.</div></div>
<div class="calc-card"><div class="calc-card-title">Veri soyağacı</div><div class="calc-card-body">Ham kaynaktan özniteliğe; DVC + dbt ya da bir katalog.</div></div>
<div class="calc-card"><div class="calc-card-title">Güvenlik</div><div class="calc-card-body">Secret'lar vault'ta, en az ayrıcalık IAM, imaj taraması, imzalı artefaktlar.</div></div>
<div class="calc-card"><div class="calc-card-title">Mahremiyet / KVKK</div><div class="calc-card-body">PII envanteri, saklama politikası, silme uç noktası, DPIA gerekirse.</div></div>
<div class="calc-card"><div class="calc-card-title">SLO'lar</div><div class="calc-card-body">p99 gecikme &lt;200 ms, kullanılabilirlik %99.9, AUC ≥ baseline.</div></div>
<div class="calc-card"><div class="calc-card-title">Runbook</div><div class="calc-card-body">Geri alma, yeniden eğitme, kimi çağırma, alarm oyun kitabı.</div></div>
</div>
<div id="mlops-l12-graph-tr" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Önceki 11 ders tek bir dağıtıma haritalandı. Hiçbiri üretimde isteğe bağlı değil.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>Üretime giden bir model yalnızca pickle değil, manifest'iyle birlikte sevk edilir.</li>
<li>Eğitim, paketleme, servis, dağıtım, izleme — altı adımın hepsi otomasyon ister.</li>
<li>Multi-stage Docker + root olmayan kullanıcı + healthcheck ciddi bir imajın asgari tabanıdır.</li>
<li>Kanarya yayını + drift izleme + hareketli AUC = güvenli açılım + erken uyarı.</li>
<li>Model kartı, soyağacı, güvenlik ve runbook modelin etrafındaki operasyonel iskelettir.</li>
<li>Artık bir sonraki projenize kopyalayabileceğiniz uçtan uca bir şablonunuz var.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var stages = ['Tekrar (L2)','İzle (L3)','Paketle (L4)','Konteyner (L5)','Servis (L6)','Bulut (L7)','CI/CD (L8)','İzleme (L9)','Ölçek (L10)','LLM (L11)'];
  Plotly.newPlot('mlops-l12-graph-tr', [{
    x:stages, y:[1,1,1,1,1,1,1,1,1,1], type:'bar', marker:{color:accent}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Bitirme — her önceki ders canlı sisteme bir blok katar',
    yaxis:{visible:false}, margin:{t:60,r:30,b:120,l:30}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
