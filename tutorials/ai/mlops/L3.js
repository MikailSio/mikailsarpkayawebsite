window.MLOPS_L3 = {
en: `<p class="l-text"><strong>Hook:</strong> by week three of any serious project you will have run 200+ experiments. Without a tracker you have a folder of CSVs and no idea which combination of features, hyperparameters and data slice produced your best AUC. <strong>Experiment tracking</strong> is the cheapest, highest-leverage MLOps habit you can adopt.</p>
<p class="l-text">In this lesson we cover the mental model, MLflow's API in practical depth, the W&amp;B alternative, and a tiny tracking demo on <code>df_churn</code>.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Track ML experiments with MLflow runs, params, metrics, and artifacts</li>
<li>Explain MLflow's four pillars: tracking, projects, models, registry</li>
<li>Log a churn classifier sweep and compare runs in the MLflow UI</li>
<li>Use Weights and Biases as a hosted alternative for team experiments</li>
<li>Design an experiment matrix that varies one factor at a time</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Track?</h2>
<p class="l-text">Every experiment is a tuple: (data, code, hyperparameters, metric). Tracking turns that tuple into a queryable database row.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Compare</div><div class="calc-card-body">"Show me runs with lr&lt;0.01 sorted by val_auc."</div></div>
<div class="calc-card"><div class="calc-card-title">Reproduce</div><div class="calc-card-body">Click any row → see exact code commit, params, environment.</div></div>
<div class="calc-card"><div class="calc-card-title">Collaborate</div><div class="calc-card-body">Teammates see your runs; you see theirs.</div></div>
<div class="calc-card"><div class="calc-card-title">Promote</div><div class="calc-card-body">Mark the best run → push artifact to model registry.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. MLflow Anatomy</h2>
<p class="l-text">MLflow has four pillars; you can adopt them gradually.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Tracking</strong> — log params, metrics, artifacts; the heart of the tool.</div>
<div class="calc-step"><strong>Projects</strong> — declarative <code>MLproject</code> file describing how to run code.</div>
<div class="calc-step"><strong>Models</strong> — flavored model artifacts (sklearn, pytorch, onnx, pyfunc).</div>
<div class="calc-step"><strong>Model Registry</strong> — staging → production lifecycle, with versions and aliases.</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tracking API in Practice</h2>
<p class="l-text">The bread and butter is the <code>start_run</code> context manager. Below: a full sklearn experiment with logged params, metric and serialized model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — needs MLflow server, won't run inside the browser sandbox</span>
<span class="kw">import</span> mlflow
<span class="kw">import</span> mlflow.sklearn
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

mlflow.<span class="fn">set_tracking_uri</span>(<span class="str">"http://localhost:5000"</span>)
mlflow.<span class="fn">set_experiment</span>(<span class="str">"churn-baseline"</span>)

<span class="kw">with</span> mlflow.<span class="fn">start_run</span>(run_name=<span class="str">"gbm-100-trees"</span>):
    params = {<span class="str">"n_estimators"</span>: <span class="num">100</span>, <span class="str">"max_depth"</span>: <span class="num">3</span>, <span class="str">"learning_rate"</span>: <span class="num">0.1</span>}
    mlflow.<span class="fn">log_params</span>(params)

    Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)
    model = <span class="fn">GradientBoostingClassifier</span>(**params, random_state=<span class="num">42</span>).<span class="fn">fit</span>(Xtr, ytr)

    auc = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])
    mlflow.<span class="fn">log_metric</span>(<span class="str">"val_auc"</span>, auc)
    mlflow.sklearn.<span class="fn">log_model</span>(model, artifact_path=<span class="str">"model"</span>,
                             registered_model_name=<span class="str">"churn-gbm"</span>)
    <span class="fn">print</span>(<span class="str">"logged run"</span>, mlflow.<span class="fn">active_run</span>().info.run_id)</code></pre></div>
<p class="l-text"><strong>How this MLflow run is wired:</strong> <code>set_experiment("churn-baseline")</code> picks the experiment tab new runs will land under. <code>with mlflow.start_run(run_name="gbm-100-trees")</code> opens a context — every log call inside the block carries the same run-id and run-name. <code>log_params({...})</code> dumps the three hyperparameters at once so they show up as filterable columns in the UI. <code>log_metric("val_auc", auc)</code> writes the validation AUC as a metric (without a <code>step</code> arg it stays a scalar, with one it becomes a time-series). Finally <code>mlflow.sklearn.log_model(..., registered_model_name="churn-gbm")</code> serializes the estimator and atomically registers a new version under <code>churn-gbm</code>, ready to be promoted to <code>Staging</code> then <code>Production</code>.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A drop-in fake of MLflow's API: a <code>start_run</code> context manager that prints params/metrics like the real client. Trains the same GBM on real churn data and registers a model artifact in a dict registry.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json, hashlib, time
from contextlib import contextmanager
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

REGISTRY, RUNS = {}, []

@contextmanager
def start_run(run_name):
    rec = {"run_id": hashlib.md5(run_name.encode()).hexdigest()[:8],
           "name": run_name, "params": {}, "metrics": {}}
    RUNS.append(rec)
    yield rec

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
with start_run("gbm-100-trees") as run:
    params = {"n_estimators": 100, "max_depth": 3, "learning_rate": 0.1}
    run["params"] = params
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    model = GradientBoostingClassifier(**params, random_state=42).fit(Xtr, ytr)
    run["metrics"]["val_auc"] = round(float(roc_auc_score(yte, model.predict_proba(Xte)[:, 1])), 4)
    REGISTRY.setdefault("churn-gbm", []).append({"version": len(REGISTRY.get("churn-gbm", [])) + 1,
                                                  "run_id": run["run_id"]})
    print("logged run", run["run_id"], "auc=", run["metrics"]["val_auc"])
print(json.dumps({"runs": RUNS, "registry": REGISTRY}, indent=2))</code></pre></div>
<p class="l-text"><strong>How the MLflow stand-in works:</strong> <code>RUNS = []</code> and <code>REGISTRY = {}</code> are the in-process equivalents of MLflow's tracking store and model registry. <code>@contextmanager</code> turns <code>start_run</code> into something usable with the <code>with</code> statement, mirroring MLflow's API. Each call derives a short run-id from the MD5 of the run-name, stores params and metrics on the yielded record, and (at the end) appends a new version to <code>REGISTRY["churn-gbm"]</code> — the same atomic "log + register" pattern as the real call. <code>json.dumps({"runs": RUNS, "registry": REGISTRY}, indent=2)</code> prints the structure you would normally browse in the MLflow UI.</p>
</div>
<p class="l-text"><strong>What this code does:</strong> opens a tracked run, dumps hyperparameters, trains a Gradient Boosting model, logs the validation AUC, then logs the fitted estimator as an MLflow Model and simultaneously registers a new version under the name <code>churn-gbm</code>. The UI at <code>localhost:5000</code> now shows a sortable table of every run.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. A Mini Local Tracking Demo</h2>
<p class="l-text">We can't reach an MLflow server from the browser, but we can mimic the API to feel the rhythm.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, time
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier, GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)

runs = []
<span class="kw">for</span> name, model <span class="kw">in</span> [
    (<span class="str">"logreg"</span>,  <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>, random_state=<span class="num">42</span>)),
    (<span class="str">"rf-100"</span>,  <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">42</span>)),
    (<span class="str">"gbm-100"</span>, <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">42</span>)),
]:
    t0 = time.<span class="fn">time</span>()
    model.<span class="fn">fit</span>(Xtr, ytr)
    auc = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])
    runs.<span class="fn">append</span>({<span class="str">"name"</span>: name, <span class="str">"auc"</span>: <span class="fn">round</span>(<span class="fn">float</span>(auc), <span class="num">4</span>),
                 <span class="str">"fit_seconds"</span>: <span class="fn">round</span>(time.<span class="fn">time</span>() - t0, <span class="num">2</span>)})

<span class="fn">print</span>(json.<span class="fn">dumps</span>(runs, indent=<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> trains three classifiers on <code>df_churn</code>, records AUC and fit time for each, and prints a JSON "experiment table". Replace the <code>runs.append</code> with <code>mlflow.log_metric</code> calls and you have the real thing — same mental model.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Weights &amp; Biases (W&amp;B)</h2>
<p class="l-text">W&amp;B is the SaaS counterpart: zero infra, beautiful UI, sweep-as-a-service. Concepts mirror MLflow.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — needs internet + W&amp;B account</span>
<span class="cm"># import wandb</span>
<span class="cm"># wandb.init(project="churn", config={"lr": 0.01, "model": "gbm"})</span>
<span class="cm"># wandb.log({"val_auc": 0.83, "epoch": 1})</span>
<span class="cm"># wandb.finish()</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>wandb.init(project="churn", config={...})</code> creates a run and registers your hyperparameters on the W&amp;B server. 2) <code>wandb.log({"auc": auc, "step": epoch})</code> streams metrics live — the dashboard updates in real time while training runs. 3) <code>wandb.log({"feature_imp": wandb.plot.bar(...)})</code> shows that you can attach native Plotly/matplotlib/HTML artifacts, not just scalars. 4) <code>wandb.finish()</code> closes the run and uploads buffered data. 5) The block is commented out because Pyodide has no network egress for W&amp;B; the next cell rebuilds the same mental model offline.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A tiny W&amp;B clone — <code>init/log/finish</code> append per-step rows, then we summarize the best epoch's metric. Works on real iris data with logistic regression iterations as &quot;epochs&quot;.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

class Run:
    def __init__(self, project, config):
        self.project, self.config, self.history = project, dict(config), []
    def log(self, row): self.history.append(dict(row))
    def finish(self):
        best = max(self.history, key=lambda r: r.get("val_acc", 0))
        return {"project": self.project, "config": self.config,
                "n_steps": len(self.history), "best": best}

run = Run("iris", {"lr": 0.01, "model": "logreg"})
X, y = df_iris.iloc[:, :-1], df_iris.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=42)
for epoch, max_iter in enumerate([20, 50, 100, 200, 400], start=1):
    m = LogisticRegression(max_iter=max_iter, random_state=42).fit(Xtr, ytr)
    run.log({"epoch": epoch, "val_acc": round(accuracy_score(yte, m.predict(Xte)), 4)})
print(json.dumps(run.finish(), indent=2))</code></pre></div>
<p class="l-text"><strong>How the W&amp;B stand-in works:</strong> the <code>Run</code> class is a one-page reimplementation of <code>wandb.Run</code> — <code>__init__</code> takes a project name + config, <code>log</code> appends a row to history, and <code>finish</code> selects the highest-<code>val_acc</code> row as the "best" epoch (mirroring W&amp;B's run summary). The loop sweeps five <code>max_iter</code> values (20, 50, 100, 200, 400) as if they were training epochs — each one trains a fresh <code>LogisticRegression</code> on iris and logs validation accuracy. <code>run.finish()</code> returns the same shape a real W&amp;B run summary has: project, config, total steps and the best row.</p>
</div>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>MLflow</strong><br/>Open source, self-hosted, free.</div><div class="calc-compare-cell"><strong>W&amp;B</strong><br/>SaaS-first, polished UX, paid for teams.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Strong: model registry, broad ecosystem.</div><div class="calc-compare-cell">Strong: sweeps, reports, collaboration.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Other Tools Worth Knowing</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">ClearML</div><div class="calc-card-body">All-in-one: tracking + orchestration + data versioning.</div></div>
<div class="calc-card"><div class="calc-card-title">Comet.ml</div><div class="calc-card-body">SaaS, similar to W&amp;B, strong on classical ML.</div></div>
<div class="calc-card"><div class="calc-card-title">Neptune.ai</div><div class="calc-card-body">Lightweight, great for research teams.</div></div>
<div class="calc-card"><div class="calc-card-title">DVC studio</div><div class="calc-card-body">If you already DVC, integrates naturally.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Experiment Matrix</h2>
<p class="l-text">Tracking unlocks systematic search. Define the axes, log every cell, sort by metric.</p>
<div id="mlops-l3-graph-en" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Three model families × three feature sets — exactly the kind of grid an experiment tracker turns into one query.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>Track every run as (params, metrics, artifacts) — minute-1 of any project.</li>
<li>MLflow = open source, four pillars: Tracking, Projects, Models, Registry.</li>
<li>W&amp;B = SaaS counterpart, especially nice for sweeps and team reports.</li>
<li>The mental model: <em>experiments are rows in a database</em>; tooling is just nice query.</li>
<li>Promote winning runs into a registry — that's the bridge to deployment (L4-L6).</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var z = [[0.74, 0.78, 0.80],[0.78, 0.82, 0.84],[0.80, 0.83, 0.86]];
  Plotly.newPlot('mlops-l3-graph-en', [{
    z:z, x:['raw','+derived','+text feats'], y:['LogReg','RF','GBM'],
    type:'heatmap', colorscale:[[0,'#1c1c1c'],[1,accent]], showscale:true
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Experiment matrix: model × feature set (val AUC, illustrative)',
    margin:{t:60,r:30,b:60,l:80}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> ciddi bir projenin üçüncü haftasında 200'ü aşkın deneme yapmış olursunuz. Tracker olmadan elinizde bir CSV klasörü olur ve hangi öznitelik + hiperparametre + veri dilimi kombinasyonunun en iyi AUC'yi verdiğini bilemezsiniz. <strong>Deney takibi</strong> uygulayabileceğiniz en ucuz, en yüksek getirili MLOps alışkanlığıdır.</p>
<p class="l-text">Bu derste mental modeli, MLflow API'sini pratik derinlikte, W&amp;B alternatifini ve <code>df_churn</code> üzerinde minik bir takip demosunu göreceğiz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>MLflow ile run, parametre, metrik ve artifact takip edeceksin</li>
<li>MLflow'un dört bileşenini açıklayacaksın: tracking, projects, models, registry</li>
<li>Churn sınıflandırıcı sweep'i loglayıp MLflow UI'da run'ları karşılaştıracaksın</li>
<li>Weights and Biases'i ekip deneyleri için hosted alternatif olarak kullanacaksın</li>
<li>Tek faktör değiştiren bir deney matrisi tasarlayacaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Takip Edilir?</h2>
<p class="l-text">Her deney bir tupledir: (veri, kod, hiperparametreler, metrik). Takip bu tuple'ı sorgulanabilir bir veritabanı satırına dönüştürür.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Karşılaştır</div><div class="calc-card-body">"lr&lt;0.01 olan run'ları val_auc'a göre sırala."</div></div>
<div class="calc-card"><div class="calc-card-title">Yeniden üret</div><div class="calc-card-body">Herhangi bir satıra tıkla → tam kod commit'i, parametreler, ortam.</div></div>
<div class="calc-card"><div class="calc-card-title">İşbirliği</div><div class="calc-card-body">Takım arkadaşları sizinkini, siz onlarınkini görür.</div></div>
<div class="calc-card"><div class="calc-card-title">Yükselt</div><div class="calc-card-body">En iyi run'ı işaretle → artefakt model registry'ye gitsin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. MLflow Anatomisi</h2>
<p class="l-text">MLflow'un dört sütunu vardır; aşamalı benimseyebilirsiniz.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Tracking</strong> — parametre, metrik, artefakt logla; aracın kalbi.</div>
<div class="calc-step"><strong>Projects</strong> — kodu nasıl çalıştıracağını bildiren <code>MLproject</code> dosyası.</div>
<div class="calc-step"><strong>Models</strong> — flavor'lı model artefaktları (sklearn, pytorch, onnx, pyfunc).</div>
<div class="calc-step"><strong>Model Registry</strong> — staging → production yaşam döngüsü; sürüm ve alias'lar.</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tracking API'si Pratikte</h2>
<p class="l-text">Bel kemiği <code>start_run</code> context manager'ıdır. Aşağıda parametre, metrik ve serileştirilmiş model loglayan tam bir sklearn deneyi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — MLflow sunucusu ister, tarayıcı kumunda çalışmaz</span>
<span class="kw">import</span> mlflow
<span class="kw">import</span> mlflow.sklearn
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

mlflow.<span class="fn">set_tracking_uri</span>(<span class="str">"http://localhost:5000"</span>)
mlflow.<span class="fn">set_experiment</span>(<span class="str">"churn-baseline"</span>)

<span class="kw">with</span> mlflow.<span class="fn">start_run</span>(run_name=<span class="str">"gbm-100-trees"</span>):
    params = {<span class="str">"n_estimators"</span>: <span class="num">100</span>, <span class="str">"max_depth"</span>: <span class="num">3</span>, <span class="str">"learning_rate"</span>: <span class="num">0.1</span>}
    mlflow.<span class="fn">log_params</span>(params)

    Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)
    model = <span class="fn">GradientBoostingClassifier</span>(**params, random_state=<span class="num">42</span>).<span class="fn">fit</span>(Xtr, ytr)

    auc = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])
    mlflow.<span class="fn">log_metric</span>(<span class="str">"val_auc"</span>, auc)
    mlflow.sklearn.<span class="fn">log_model</span>(model, artifact_path=<span class="str">"model"</span>,
                             registered_model_name=<span class="str">"churn-gbm"</span>)
    <span class="fn">print</span>(<span class="str">"logged run"</span>, mlflow.<span class="fn">active_run</span>().info.run_id)</code></pre></div>
<p class="l-text"><strong>Bu MLflow run'ı nasıl bağlanıyor:</strong> <code>set_experiment("churn-baseline")</code> yeni run'ların altına ineceği deney sekmesini seçer. <code>with mlflow.start_run(run_name="gbm-100-trees")</code> bir context açar — blok içindeki her log çağrısı aynı run-id ve run-name'i taşır. <code>log_params({...})</code> üç hiperparametreyi tek seferde yazar; UI'da filtrelenebilir sütun olur. <code>log_metric("val_auc", auc)</code> validation AUC'yi metrik olarak yazar (<code>step</code> argümansız skaler kalır, varsa zaman serisine döner). Son olarak <code>mlflow.sklearn.log_model(..., registered_model_name="churn-gbm")</code> tahminciyi serileştirir ve <code>churn-gbm</code> altında atomik yeni bir sürüm tescil eder; sonra <code>Staging</code> ardından <code>Production</code>'a yükseltilebilir.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">MLflow API'sini taklit eden tak-çalıştır bir <code>start_run</code> context manager'ı. Aynı GBM'yi gerçek churn üstünde eğitiyor ve sonucu bir dict registry'sine kaydediyor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json, hashlib, time
from contextlib import contextmanager
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

REGISTRY, RUNS = {}, []

@contextmanager
def start_run(run_name):
    rec = {"run_id": hashlib.md5(run_name.encode()).hexdigest()[:8],
           "name": run_name, "params": {}, "metrics": {}}
    RUNS.append(rec)
    yield rec

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
with start_run("gbm-100-trees") as run:
    params = {"n_estimators": 100, "max_depth": 3, "learning_rate": 0.1}
    run["params"] = params
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    model = GradientBoostingClassifier(**params, random_state=42).fit(Xtr, ytr)
    run["metrics"]["val_auc"] = round(float(roc_auc_score(yte, model.predict_proba(Xte)[:, 1])), 4)
    REGISTRY.setdefault("churn-gbm", []).append({"version": len(REGISTRY.get("churn-gbm", [])) + 1,
                                                  "run_id": run["run_id"]})
    print("logged run", run["run_id"], "auc=", run["metrics"]["val_auc"])
print(json.dumps({"runs": RUNS, "registry": REGISTRY}, indent=2))</code></pre></div>
<p class="l-text"><strong>MLflow taklidi nasıl çalışıyor:</strong> <code>RUNS = []</code> ve <code>REGISTRY = {}</code>, MLflow'un tracking deposunun ve model registry'sinin süreç içi karşılıklarıdır. <code>@contextmanager</code> dekoratörü <code>start_run</code>'u <code>with</code> bloğunda kullanılabilir hâle getirir, MLflow API'sini yansıtır. Her çağrı run-name'in MD5'inden kısa bir run-id üretir, yielded record üstüne params ve metrikleri yazar ve (sonunda) <code>REGISTRY["churn-gbm"]</code>'e yeni bir sürüm ekler — gerçek çağrının atomik "log + register" deseninin aynısı. <code>json.dumps({"runs": RUNS, "registry": REGISTRY}, indent=2)</code>, normalde MLflow UI'da gezeceğin yapıyı yazdırır.</p>
</div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> takip edilen bir run açar, hiperparametreleri yazar, Gradient Boosting eğitir, AUC'yi loglar, eğitilmiş modeli MLflow Model olarak kaydeder ve aynı anda <code>churn-gbm</code> adı altında yeni bir sürüm tescil eder. <code>localhost:5000</code>'deki UI tüm run'ları sıralanabilir bir tablo olarak gösterir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Mini Yerel Takip Demosu</h2>
<p class="l-text">Tarayıcıdan MLflow sunucusuna ulaşamayız ama API ritmini hissetmek için aynısını taklit edebiliriz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, time
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier, GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)

runs = []
<span class="kw">for</span> name, model <span class="kw">in</span> [
    (<span class="str">"logreg"</span>,  <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>, random_state=<span class="num">42</span>)),
    (<span class="str">"rf-100"</span>,  <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">42</span>)),
    (<span class="str">"gbm-100"</span>, <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">42</span>)),
]:
    t0 = time.<span class="fn">time</span>()
    model.<span class="fn">fit</span>(Xtr, ytr)
    auc = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])
    runs.<span class="fn">append</span>({<span class="str">"name"</span>: name, <span class="str">"auc"</span>: <span class="fn">round</span>(<span class="fn">float</span>(auc), <span class="num">4</span>),
                 <span class="str">"fit_seconds"</span>: <span class="fn">round</span>(time.<span class="fn">time</span>() - t0, <span class="num">2</span>)})

<span class="fn">print</span>(json.<span class="fn">dumps</span>(runs, indent=<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> <code>df_churn</code> üzerinde üç sınıflandırıcı eğitir, her biri için AUC ve eğitim süresini kaydeder, sonra JSON "deney tablosu" basar. <code>runs.append</code>'i <code>mlflow.log_metric</code> ile değiştirin — gerçeğine kavuşursunuz; aynı mental model.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Weights &amp; Biases (W&amp;B)</h2>
<p class="l-text">W&amp;B SaaS muadilidir: sıfır altyapı, güzel UI, hizmet olarak sweep. Kavramlar MLflow'u yansıtır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — internet + W&amp;B hesabı ister</span>
<span class="cm"># import wandb</span>
<span class="cm"># wandb.init(project="churn", config={"lr": 0.01, "model": "gbm"})</span>
<span class="cm"># wandb.log({"val_auc": 0.83, "epoch": 1})</span>
<span class="cm"># wandb.finish()</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>wandb.init(project="churn", config={...})</code> bir run oluşturur ve hiperparametrelerinizi W&amp;B sunucusuna kaydeder. 2) <code>wandb.log({"auc": auc, "step": epoch})</code> metrikleri canlı yayınlar — eğitim sürerken dashboard gerçek zamanlı güncellenir. 3) <code>wandb.log({"feature_imp": wandb.plot.bar(...)})</code> sadece skaler değil; native Plotly/matplotlib/HTML artefakt da ekleyebileceğinizi gösterir. 4) <code>wandb.finish()</code> run'ı kapatır ve tamponlanmış veriyi yükler. 5) Blok yorumlu çünkü Pyodide W&amp;B'ye dışarı ağ erişimi yok; sonraki hücre aynı zihinsel modeli çevrimdışı yeniden kurar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Minik W&amp;B klonu — <code>init/log/finish</code> her adımı listeye yazar, sonra en iyi epoch'un metriğini özetleriz. Iris üstünde gerçek logistic regression iter'ları &quot;epoch&quot; gibi davranıyor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

class Run:
    def __init__(self, project, config):
        self.project, self.config, self.history = project, dict(config), []
    def log(self, row): self.history.append(dict(row))
    def finish(self):
        best = max(self.history, key=lambda r: r.get("val_acc", 0))
        return {"project": self.project, "config": self.config,
                "n_steps": len(self.history), "best": best}

run = Run("iris", {"lr": 0.01, "model": "logreg"})
X, y = df_iris.iloc[:, :-1], df_iris.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=42)
for epoch, max_iter in enumerate([20, 50, 100, 200, 400], start=1):
    m = LogisticRegression(max_iter=max_iter, random_state=42).fit(Xtr, ytr)
    run.log({"epoch": epoch, "val_acc": round(accuracy_score(yte, m.predict(Xte)), 4)})
print(json.dumps(run.finish(), indent=2))</code></pre></div>
<p class="l-text"><strong>W&amp;B taklidi nasıl çalışıyor:</strong> <code>Run</code> sınıfı, <code>wandb.Run</code>'un tek-sayfa yeniden uygulamasıdır — <code>__init__</code> bir proje adı + config alır, <code>log</code> history'ye satır ekler ve <code>finish</code>, en yüksek <code>val_acc</code>'li satırı "en iyi" epoch olarak seçer (W&amp;B'nin run özetini yansıtır). Döngü, eğitim epoch'larıymış gibi beş <code>max_iter</code> değerini (20, 50, 100, 200, 400) süpürür — her biri iris üzerinde taze bir <code>LogisticRegression</code> eğitir ve validation accuracy'yi loglar. <code>run.finish()</code> gerçek bir W&amp;B run özetiyle aynı şekli döner: project, config, toplam adım sayısı ve en iyi satır.</p>
</div>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>MLflow</strong><br/>Açık kaynak, self-hosted, ücretsiz.</div><div class="calc-compare-cell"><strong>W&amp;B</strong><br/>SaaS odaklı, cilalı UX, takımlar için ücretli.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Güçlü: model registry, geniş ekosistem.</div><div class="calc-compare-cell">Güçlü: sweep, raporlar, işbirliği.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bilmeye Değer Diğer Araçlar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">ClearML</div><div class="calc-card-body">Hepsi bir arada: takip + orkestrasyon + veri sürümleme.</div></div>
<div class="calc-card"><div class="calc-card-title">Comet.ml</div><div class="calc-card-body">SaaS; W&amp;B'ye benzer, klasik ML'de güçlü.</div></div>
<div class="calc-card"><div class="calc-card-title">Neptune.ai</div><div class="calc-card-body">Hafif, araştırma takımları için iyi.</div></div>
<div class="calc-card"><div class="calc-card-title">DVC studio</div><div class="calc-card-body">DVC kullanıyorsanız doğal entegrasyon.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Deney Matrisi</h2>
<p class="l-text">Takip sistematik aramayı açar. Eksenleri tanımlayın, her hücreyi loglayın, metriğe göre sıralayın.</p>
<div id="mlops-l3-graph-tr" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Üç model ailesi × üç öznitelik kümesi — bir tracker'ın tek sorguya çevirdiği şey tam da budur.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>Her run'ı (parametre, metrik, artefakt) olarak takip edin — projenin 1. dakikasından itibaren.</li>
<li>MLflow = açık kaynak, dört sütun: Tracking, Projects, Models, Registry.</li>
<li>W&amp;B = SaaS muadili; sweep ve takım raporları için özellikle güzel.</li>
<li>Mental model: <em>deneyler bir veritabanındaki satırlardır</em>; araç sadece güzel sorgu sunar.</li>
<li>Kazanan run'ları registry'ye terfi ettirin — dağıtıma (L4–L6) köprü budur.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var z = [[0.74, 0.78, 0.80],[0.78, 0.82, 0.84],[0.80, 0.83, 0.86]];
  Plotly.newPlot('mlops-l3-graph-tr', [{
    z:z, x:['ham','+türetilmiş','+metin feat.'], y:['LogReg','RF','GBM'],
    type:'heatmap', colorscale:[[0,'#1c1c1c'],[1,accent]], showscale:true
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Deney matrisi: model × öznitelik kümesi (örnek val AUC)',
    margin:{t:60,r:30,b:60,l:80}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
