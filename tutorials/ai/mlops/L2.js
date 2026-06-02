window.MLOPS_L2 = {
en: `<p class="l-text"><strong>Hook:</strong> "It worked on my machine" is the most expensive sentence in ML. Without locked environments, pinned seeds, and versioned data, your "best model from last month" can never be rebuilt.</p>
<p class="l-text">In this lesson you'll lock the three pillars of reproducibility: <em>environment</em>, <em>randomness</em>, and <em>data</em>. We'll touch requirements files, Docker, seeds, DVC, and a first taste of MLflow.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Pin Python dependencies with requirements.txt, pyproject.toml, and conda env files</li>
<li>Build a minimal Docker image that bakes in code, deps, and entrypoint</li>
<li>Seed Python, NumPy, and PyTorch to remove non-determinism</li>
<li>Version a CSV dataset with DVC and reproduce a past experiment</li>
<li>Log params, metrics, and artifacts to MLflow instead of hand-rolled JSON</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Three Pillars of Reproducibility</h2>
<p class="l-text">A model run is fully reproducible only if you can answer three questions: <em>which packages</em>, <em>which random state</em>, <em>which data</em>. Lose any one and you're guessing.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Environment</div><div class="calc-card-body">Python version + every package version pinned.</div></div>
<div class="calc-card"><div class="calc-card-title">Seeds</div><div class="calc-card-body">numpy, torch, sklearn, hashing — all controlled.</div></div>
<div class="calc-card"><div class="calc-card-title">Data</div><div class="calc-card-body">Snapshot hash so the exact CSV/parquet can be retrieved.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Environment: requirements.txt vs pyproject.toml vs conda</h2>
<p class="l-text">Three flavors are common today. Pick one per project — never mix.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># Option A: pip + requirements.txt (simplest)</span>
python -m venv .venv
source .venv/<span class="ty"><span class="ty">bin</span></span>/activate          <span class="cm"><span class="cm"># Windows: .venv\\Scripts\\activate</span>
pip install -r requirements.txt
pip freeze &gt; requirements.lock     <span class="cm"><span class="cm"># exact versions</span>

<span class="cm"><span class="cm"># Option B: poetry / pyproject.toml (modern Python packaging)</span>
poetry init
poetry add scikit-learn pandas mlflow
poetry lock                        <span class="cm"><span class="cm"># pyproject.toml + poetry.lock</span>

<span class="cm"><span class="cm"># Option C: conda (best when you also need C/CUDA libs)</span>
conda env create -f environment.yml
conda env export &gt; environment.lock.yml</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Option A spins up a stdlib <code>venv</code> and installs from <code>requirements.txt</code>, then <code>pip freeze &gt; requirements.lock</code> snapshots exact versions you can commit. 2) Option B uses Poetry: <code>poetry add</code> resolves and writes both <code>pyproject.toml</code> and <code>poetry.lock</code> in one step. 3) Option C uses Conda for projects that need C/CUDA system libraries; <code>conda env export</code> produces a reproducible <code>environment.lock.yml</code>. 4) Whichever route you pick, the <em>lock file</em> is the artifact that guarantees re-installation produces the same byte-identical environment six months later.</p>
<p class="l-text"><strong>Rule:</strong> commit the <em>lock</em> file. Without it, <code>scikit-learn==1.5</code> today and 1.6 next week silently change predictions.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Docker for ML — A Quick Look</h2>
<p class="l-text">Containers freeze the OS layer too (libc, CUDA, system packages). We'll go deep in L5; here is a minimal sketch.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Dockerfile (minimum viable)</span>
FROM python:<span class="num">3.11</span>-slim
WORKDIR /app
COPY requirements.lock .
RUN pip install --no-cache-<span class="ty">dir</span> -r requirements.lock
COPY . .
CMD [<span class="str">"python"</span>, <span class="str">"train.py"</span>]

<span class="cm"># Build &amp; run</span>
docker build -t churn-trainer:<span class="num">0.1</span> .
docker run --rm -v $(pwd)/data:/app/data churn-trainer:<span class="num">0.1</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>FROM python:3.11-slim</code> picks a minimal Debian base image and pins the interpreter version. 2) <code>COPY requirements.lock</code> + <code>RUN pip install --no-cache-dir</code> is split from the source copy so Docker caches the dependency layer — code edits no longer reinstall every package. 3) <code>COPY . .</code> brings in the training script. 4) <code>CMD ["python","train.py"]</code> sets the default entrypoint. 5) <code>docker build -t churn-trainer:0.1</code> tags the image and <code>docker run -v $(pwd)/data:/app/data</code> mounts the host dataset so the container reads real data without baking it into the image.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Seeding Every Source of Randomness</h2>
<p class="l-text">numpy, Python's hash, sklearn, PyTorch and CUDA each have their own RNG. A real reproducibility helper covers them all.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os, random
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">set_seed</span>(seed: <span class="ty">int</span> = <span class="num">42</span>):
    os.environ[<span class="str">"PYTHONHASHSEED"</span>] = <span class="fn">str</span>(seed)
    random.<span class="fn">seed</span>(seed)
    np.random.<span class="fn">seed</span>(seed)
    <span class="kw">try</span>:
        <span class="kw">import</span> torch
        torch.<span class="fn">manual_seed</span>(seed)
        torch.cuda.<span class="fn">manual_seed_all</span>(seed)
        torch.backends.cudnn.deterministic = <span class="kw">True</span>
        torch.backends.cudnn.benchmark = <span class="kw">False</span>
    <span class="kw">except</span> ImportError:
        <span class="kw">pass</span>

<span class="fn">set_seed</span>(<span class="num">42</span>)
<span class="fn">print</span>(<span class="str">"All RNGs seeded with 42"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>PYTHONHASHSEED</code> is exported <em>before</em> Python touches dict ordering, which silently affects feature hashing and shuffling. 2) <code>random.seed</code> + <code>np.random.seed</code> lock the two RNGs sklearn pipelines pull from. 3) The <code>try/except ImportError</code> wraps torch so the helper works in environments without PyTorch installed. 4) <code>torch.manual_seed</code> + <code>cuda.manual_seed_all</code> cover both CPU and every GPU. 5) <code>cudnn.deterministic=True</code> and <code>benchmark=False</code> trade a few percent throughput for bit-exact convolutions — required when an auditor asks "are these two runs identical?".</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same idea without torch: seed Python's <code>random</code>, NumPy, and sklearn's <code>random_state</code> on real churn data and prove the same split + model gives the same metric every time.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import os, random
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

def set_seed(seed=42):
    os.environ["PYTHONHASHSEED"] = str(seed)
    random.seed(seed); np.random.seed(seed)
    return seed

aucs = []
for trial in range(3):
    set_seed(42)
    df = df_churn.dropna().select_dtypes(include="number")
    X, y = df.iloc[:, :-1], df.iloc[:, -1]
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    m = RandomForestClassifier(n_estimators=80, random_state=42).fit(Xtr, ytr)
    aucs.append(round(roc_auc_score(yte, m.predict_proba(Xte)[:, 1]), 6))
print("AUC over 3 reseeded trials:", aucs, "-> identical?", len(set(aucs)) == 1)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>for trial in range(3)</code> loop reseeds and re-runs the entire pipeline three times. 2) Every trial calls <code>set_seed(42)</code> before slicing the dataframe so any internal NumPy shuffle starts from the same state. 3) <code>train_test_split(..., random_state=42)</code> + <code>RandomForestClassifier(random_state=42)</code> make both the split and the bootstrap sampling deterministic. 4) <code>roc_auc_score</code> is rounded to 6 decimals and pushed into <code>aucs</code>. 5) <code>len(set(aucs)) == 1</code> proves the three trials produced byte-identical AUCs — the cheapest possible reproducibility unit test.</p>
</div>
<p class="l-text"><strong>What this code does:</strong> sets the seed for Python's hash, the standard <code>random</code> module, NumPy, and PyTorch (if installed) including its CUDA kernels. The cuDNN flags trade a small amount of speed for bit-exact GPU reproducibility — essential for debugging and audits.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Data Versioning with DVC</h2>
<p class="l-text">Git handles code; DVC handles the multi-GB CSV/parquet/images. Concept: store a small <code>.dvc</code> pointer in git, the actual blob in S3/GCS/local cache.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>pip install dvc[s3]
dvc init
dvc remote add -d storage s3://my-bucket/dvc-store

<span class="cm"># Track a dataset</span>
dvc add data/churn.csv
git add data/churn.csv.dvc data/.gitignore
git commit -m <span class="str">"data: snapshot churn v1"</span>
dvc push                  <span class="cm"># uploads blob</span>

<span class="cm"># Anyone can later reproduce:</span>
git clone &lt;repo&gt; &amp;&amp; cd repo
dvc pull                  <span class="cm"># fetches the exact bytes</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>dvc init</code> creates a <code>.dvc/</code> directory next to your <code>.git/</code>. 2) <code>dvc remote add -d storage s3://...</code> registers a default object-store backend; DVC will push blobs there instead of into git. 3) <code>dvc add data/churn.csv</code> hashes the CSV, writes a tiny <code>churn.csv.dvc</code> pointer, and gitignores the real file. 4) The pointer is committed to git, the bytes pushed to S3 via <code>dvc push</code>. 5) A teammate runs <code>git clone</code> + <code>dvc pull</code> and gets the exact same dataset — the hash in the pointer is the contract.</p>
<p class="l-text">Alternatives: <strong>lakeFS</strong> (git-like for object stores), <strong>Delta Lake</strong> (time-travel on Spark), <strong>Quilt</strong>. The principle is identical: a hash points to bytes.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. A First Reproducible Experiment</h2>
<p class="l-text">Below we stitch the pieces together: seed, train, log a hash of the data and the metric. This is the embryo of an MLflow run.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, json
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

SEED = <span class="num">42</span>
np.random.<span class="fn">seed</span>(SEED)

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]
X = df.iloc[:, :-<span class="num">1</span>]

<span class="cm"># 1) data fingerprint</span>
data_hash = hashlib.<span class="fn">md5</span>(X.values.<span class="fn">tobytes</span>()).<span class="fn">hexdigest</span>()[:<span class="num">10</span>]

<span class="cm"># 2) deterministic split + train</span>
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=SEED)
model = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=SEED).<span class="fn">fit</span>(Xtr, ytr)
auc = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])

<span class="cm"># 3) artifact record</span>
record = {<span class="str">"seed"</span>: SEED, <span class="str">"data_hash"</span>: data_hash, <span class="str">"auc"</span>: <span class="fn">round</span>(<span class="fn">float</span>(auc), <span class="num">4</span>),
          <span class="str">"n_train"</span>: <span class="fn">len</span>(Xtr), <span class="str">"n_test"</span>: <span class="fn">len</span>(Xte)}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(record, indent=<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> hashes the feature matrix to fingerprint the dataset, trains a RandomForest with a fixed seed, then writes a JSON record holding everything you'd need to reproduce the run six months later — seed, data hash, metric, sample sizes. Drop this JSON next to the model artifact and you have a primitive but real experiment log.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. From Hand-Rolled Logs to MLflow</h2>
<p class="l-text">As experiments grow past ~20 runs, JSON files become impossible to compare. MLflow stores params, metrics and artifacts in a tracking server with a UI. We'll cover it in depth in L3, but the API is friendly:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — needs an MLflow server, won't run in browser</span>
<span class="cm"><span class="cm"># import mlflow</span>
<span class="cm"><span class="cm"># with mlflow.start_run():</span>
<span class="cm"><span class="cm">#     mlflow.log_param("seed", 42)</span>
<span class="cm"><span class="cm">#     mlflow.log_metric("auc", 0.83)</span>
<span class="cm"><span class="cm">#     mlflow.sklearn.log_model(model, "model")</span></span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The commented imports show the canonical MLflow flow: <code>mlflow.start_run()</code> opens a run context. 2) <code>log_param("seed", 42)</code> stores hyperparameters that show up as filterable columns in the UI. 3) <code>log_metric("auc", 0.83)</code> writes a metric (and would accept a <code>step</code> argument for time series). 4) <code>mlflow.sklearn.log_model(model, "model")</code> serializes the estimator as an MLflow artifact that can later be promoted to the registry. 5) It is commented because Pyodide cannot reach an MLflow tracking server — the Pyodide-equivalent below reproduces the same mental model in-memory.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mini in-process MLflow: <code>start_run()</code>, <code>log_param/log_metric</code> append to a list of dicts. Same mental model — params, metrics, run id — without the server.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json, hashlib, time
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

RUNS = []  # in-memory "tracking server"

def start_run(params):
    rid = hashlib.md5(json.dumps(params, sort_keys=True).encode()).hexdigest()[:8]
    RUNS.append({"run_id": rid, "params": dict(params), "metrics": {}, "ts": time.time()})
    return RUNS[-1]

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
for n in [30, 80, 150]:
    run = start_run({"seed": 42, "n_estimators": n})
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    m = RandomForestClassifier(n_estimators=n, random_state=42).fit(Xtr, ytr)
    run["metrics"]["auc"] = round(roc_auc_score(yte, m.predict_proba(Xte)[:, 1]), 4)

print(json.dumps(RUNS, indent=2, default=str))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>RUNS = []</code> is the in-memory stand-in for an MLflow tracking server. 2) <code>start_run</code> hashes the params dict with <code>hashlib.md5</code> to get a stable 8-char run-id (same params → same id, just like MLflow). 3) The loop sweeps <code>n_estimators in [30, 80, 150]</code>, opening a run per configuration. 4) Inside each run, the model is trained with the same <code>random_state=42</code> and the AUC is written into <code>run["metrics"]</code>. 5) The final <code>json.dumps(RUNS, indent=2)</code> mimics what the MLflow UI shows — three runs, three param sets, three metrics, ready to be sorted.</p>
</div>
<div id="mlops-l2-graph-en" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Effort to reproduce a run vs investment in tooling. The slope flips dramatically once seeds + lock files + DVC exist.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>Reproducibility = environment + seeds + data, all version-locked.</li>
<li>Always commit the lock file (<code>requirements.lock</code>, <code>poetry.lock</code>, <code>environment.lock.yml</code>).</li>
<li>Seed every RNG: Python hash, <code>random</code>, NumPy, framework, CUDA.</li>
<li>Use DVC (or equivalent) so a git checkout pulls the exact bytes you trained on.</li>
<li>Hand-rolled JSON logs work for 5 runs; switch to MLflow / W&amp;B for 50+.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var x = ['No discipline', '+seed', '+lock file', '+DVC', '+MLflow'];
  Plotly.newPlot('mlops-l2-graph-en', [{
    x:x, y:[100, 60, 30, 12, 5], type:'scatter', mode:'lines+markers',
    line:{color:accent, width:3}, marker:{size:9}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Approx. hours to reproduce a 6-month-old run',
    yaxis:{title:'Hours'}, margin:{t:60,r:30,b:50,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> "Benim makinemde çalışıyordu" cümlesi ML'de en pahalı cümledir. Kilitli ortam, sabit seed ve sürümlenmiş veri olmadan "geçen ayki en iyi modelim" asla yeniden üretilemez.</p>
<p class="l-text">Bu derste tekrarlanabilirliğin üç sütununu kilitleyeceğiz: <em>ortam</em>, <em>rastgelelik</em>, <em>veri</em>. requirements, Docker, seed, DVC ve MLflow'un ilk tadına bakacağız.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Python bağımlılıklarını requirements.txt, pyproject.toml ve conda ile sabitleyeceksin</li>
<li>Kod, bağımlılık ve entrypoint içeren minimal bir Docker imajı kuracaksın</li>
<li>Python, NumPy ve PyTorch için seed vererek belirsizliği yok edeceksin</li>
<li>DVC ile bir CSV veri setini sürümleyip eski deneyi yeniden üreteceksin</li>
<li>Param, metrik ve artifact'leri elle JSON yerine MLflow'a kaydedeceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Tekrarlanabilirliğin Üç Sütunu</h2>
<p class="l-text">Bir model çalıştırması ancak üç soruya yanıt verebiliyorsanız tam tekrarlanabilirdir: <em>hangi paketler</em>, <em>hangi rastgelelik durumu</em>, <em>hangi veri</em>. Birini kaybederseniz tahmin yürütüyorsunuz demektir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Ortam</div><div class="calc-card-body">Python sürümü + her paketin sürümü sabitlenmiş.</div></div>
<div class="calc-card"><div class="calc-card-title">Seed'ler</div><div class="calc-card-body">numpy, torch, sklearn, hash — tümü kontrol altında.</div></div>
<div class="calc-card"><div class="calc-card-title">Veri</div><div class="calc-card-body">Aynı CSV/parquet'in geri çekilebilmesi için snapshot hash.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Ortam: requirements.txt vs pyproject.toml vs conda</h2>
<p class="l-text">Bugün üç tat yaygın. Proje başına bir tane seçin — asla karıştırmayın.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># Seçenek A: pip + requirements.txt (en basit)</span>
python -m venv .venv
source .venv/<span class="ty"><span class="ty">bin</span></span>/activate          <span class="cm"><span class="cm"># Windows: .venv\\Scripts\\activate</span>
pip install -r requirements.txt
pip freeze &gt; requirements.lock     <span class="cm"><span class="cm"># tam sürümler</span>

<span class="cm"><span class="cm"># Seçenek B: poetry / pyproject.toml (modern Python paketleme)</span>
poetry init
poetry add scikit-learn pandas mlflow
poetry lock                        <span class="cm"><span class="cm"># pyproject.toml + poetry.lock</span>

<span class="cm"><span class="cm"># Seçenek C: conda (C/CUDA kütüphaneleri de gerekiyorsa en iyisi)</span>
conda env create -f environment.yml
conda env export &gt; environment.lock.yml</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Seçenek A stdlib <code>venv</code> ile sanal ortam açar, <code>requirements.txt</code>'ten kurar, sonra <code>pip freeze &gt; requirements.lock</code> commit edilebilecek tam sürümleri donar. 2) Seçenek B Poetry kullanır: <code>poetry add</code> çözüp aynı anda <code>pyproject.toml</code> ve <code>poetry.lock</code>'u yazar. 3) Seçenek C, C/CUDA sistem kütüphaneleri gerektiren projeler için Conda; <code>conda env export</code> tekrarlanabilir <code>environment.lock.yml</code>'i üretir. 4) Hangi yolu seçerseniz seçin, kurulumun altı ay sonra bayt düzeyinde aynı ortamı verebilmesini garanti eden artefakt <em>lock dosyası</em>'dır.</p>
<p class="l-text"><strong>Kural:</strong> <em>lock</em> dosyasını commit'leyin. Onsuz bugün <code>scikit-learn==1.5</code>, gelecek hafta 1.6 — tahminler sessizce değişir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ML için Docker — Hızlı Bakış</h2>
<p class="l-text">Konteynerler işletim sistemi katmanını da dondurur (libc, CUDA, sistem paketleri). L5'te derinleşeceğiz; burada minimum bir taslak.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Dockerfile (uygulanabilir minimum)</span>
FROM python:<span class="num">3.11</span>-slim
WORKDIR /app
COPY requirements.lock .
RUN pip install --no-cache-<span class="ty">dir</span> -r requirements.lock
COPY . .
CMD [<span class="str">"python"</span>, <span class="str">"train.py"</span>]

<span class="cm"># Build &amp; run</span>
docker build -t churn-trainer:<span class="num">0.1</span> .
docker run --rm -v $(pwd)/data:/app/data churn-trainer:<span class="num">0.1</span></code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>FROM python:3.11-slim</code> küçük bir Debian temel imajı seçer ve yorumlayıcı sürümünü sabitler. 2) <code>COPY requirements.lock</code> + <code>RUN pip install --no-cache-dir</code> kaynak kopyasından ayrılır — Docker bağımlılık katmanını önbelleğe alır, kod değiştiğinde paketler yeniden kurulmaz. 3) <code>COPY . .</code> eğitim betiğini getirir. 4) <code>CMD ["python","train.py"]</code> varsayılan giriş noktasını belirler. 5) <code>docker build -t churn-trainer:0.1</code> imajı etiketler ve <code>docker run -v $(pwd)/data:/app/data</code> host veri setini imaja gömmeden bağlar.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Tüm Rastgelelik Kaynaklarını Sabitlemek</h2>
<p class="l-text">numpy, Python hash'i, sklearn, PyTorch ve CUDA'nın her birinin kendi RNG'si vardır. Gerçek bir tekrarlanabilirlik yardımcısı hepsini kapsar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os, random
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">set_seed</span>(seed: <span class="ty">int</span> = <span class="num">42</span>):
    os.environ[<span class="str">"PYTHONHASHSEED"</span>] = <span class="fn">str</span>(seed)
    random.<span class="fn">seed</span>(seed)
    np.random.<span class="fn">seed</span>(seed)
    <span class="kw">try</span>:
        <span class="kw">import</span> torch
        torch.<span class="fn">manual_seed</span>(seed)
        torch.cuda.<span class="fn">manual_seed_all</span>(seed)
        torch.backends.cudnn.deterministic = <span class="kw">True</span>
        torch.backends.cudnn.benchmark = <span class="kw">False</span>
    <span class="kw">except</span> ImportError:
        <span class="kw">pass</span>

<span class="fn">set_seed</span>(<span class="num">42</span>)
<span class="fn">print</span>(<span class="str">"Tüm RNG'ler 42 ile sabitlendi"</span>)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>PYTHONHASHSEED</code>, Python dict sırasını etkileyen feature hashing'i sessizce değiştiren değişken — yorumlayıcı dokunmadan <em>önce</em> dışa aktarılır. 2) <code>random.seed</code> + <code>np.random.seed</code> sklearn pipeline'larının çektiği iki RNG'yi kilitler. 3) <code>try/except ImportError</code> torch'u sarmalar — yardımcı, PyTorch kurulu olmayan ortamda da çalışır. 4) <code>torch.manual_seed</code> + <code>cuda.manual_seed_all</code> hem CPU'yu hem tüm GPU'ları kapsar. 5) <code>cudnn.deterministic=True</code> ve <code>benchmark=False</code>, birkaç puan throughput karşılığında bit düzeyinde deterministik konvolüsyon verir — denetçi "bu iki çalıştırma aynı mı?" diye sorduğunda bu şart olur.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">torch olmadan aynı fikir: Python <code>random</code>, NumPy ve sklearn <code>random_state</code>'i sabitleyip gerçek churn verisi üstünde aynı bölme + modelin her seferinde aynı metriği verdiğini kanıtlıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import os, random
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

def set_seed(seed=42):
    os.environ["PYTHONHASHSEED"] = str(seed)
    random.seed(seed); np.random.seed(seed)
    return seed

aucs = []
for trial in range(3):
    set_seed(42)
    df = df_churn.dropna().select_dtypes(include="number")
    X, y = df.iloc[:, :-1], df.iloc[:, -1]
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    m = RandomForestClassifier(n_estimators=80, random_state=42).fit(Xtr, ytr)
    aucs.append(round(roc_auc_score(yte, m.predict_proba(Xte)[:, 1]), 6))
print("3 yeniden-seed denemesinde AUC:", aucs, "-> aynı mı?", len(set(aucs)) == 1)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>for trial in range(3)</code> döngüsü tüm pipeline'ı üç kez yeniden seed'ler ve çalıştırır. 2) Her deneme dataframe'i dilimlemeden önce <code>set_seed(42)</code> çağırır — içeride yapılan NumPy karıştırmaları aynı durumdan başlar. 3) <code>train_test_split(..., random_state=42)</code> + <code>RandomForestClassifier(random_state=42)</code> hem bölmeyi hem bootstrap örneklemeyi deterministik yapar. 4) <code>roc_auc_score</code> 6 ondalığa yuvarlanıp <code>aucs</code>'a eklenir. 5) <code>len(set(aucs)) == 1</code>, üç denemenin bayt-bayt aynı AUC verdiğini kanıtlar — en ucuz tekrarlanabilirlik unit testi.</p>
</div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> Python hash'ini, standart <code>random</code> modülünü, NumPy'yi ve (kuruluysa) PyTorch'u — CUDA çekirdekleri dahil — aynı seed ile sabitler. cuDNN bayrakları küçük bir hız kaybı karşılığında bit düzeyinde GPU tekrarlanabilirliği verir; hata ayıklama ve denetim için şarttır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. DVC ile Veri Sürümleme</h2>
<p class="l-text">Git kodu yönetir; DVC çok-GB'lık CSV/parquet/görselleri yönetir. Fikir: git'e küçük bir <code>.dvc</code> işaretçisi koyun, asıl blob S3/GCS/yerel önbellekte dursun.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>pip install dvc[s3]
dvc init
dvc remote add -d storage s3://my-bucket/dvc-store

<span class="cm"># Veri setini takip et</span>
dvc add data/churn.csv
git add data/churn.csv.dvc data/.gitignore
git commit -m <span class="str">"data: churn v1 snapshot"</span>
dvc push                  <span class="cm"># blob yüklenir</span>

<span class="cm"># Daha sonra herkes şunu yapabilir:</span>
git clone &lt;repo&gt; &amp;&amp; cd repo
dvc pull                  <span class="cm"># tam aynı baytları çeker</span></code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>dvc init</code> <code>.git/</code> yanında <code>.dvc/</code> klasörünü oluşturur. 2) <code>dvc remote add -d storage s3://...</code> varsayılan object-store backend'ini kaydeder; DVC blob'ları git yerine oraya iter. 3) <code>dvc add data/churn.csv</code> CSV'yi hashler, küçük bir <code>churn.csv.dvc</code> işaretçisi yazar ve gerçek dosyayı gitignore'a alır. 4) İşaretçi git'e commit'lenir, baytlar <code>dvc push</code> ile S3'e gider. 5) Ekip arkadaşı <code>git clone</code> + <code>dvc pull</code> ile aynı veri setine ulaşır — işaretçideki hash sözleşmedir.</p>
<p class="l-text">Alternatifler: <strong>lakeFS</strong> (object store için git benzeri), <strong>Delta Lake</strong> (Spark üzerinde zaman yolculuğu), <strong>Quilt</strong>. Prensip aynı: bir hash baytları gösterir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. İlk Tekrarlanabilir Deney</h2>
<p class="l-text">Aşağıda parçaları birleştiriyoruz: seed, eğitim, veri hash'i + metrik kaydı. Bu, bir MLflow run'ının embriyosudur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, json
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

SEED = <span class="num">42</span>
np.random.<span class="fn">seed</span>(SEED)

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]
X = df.iloc[:, :-<span class="num">1</span>]

<span class="cm"># 1) veri parmak izi</span>
data_hash = hashlib.<span class="fn">md5</span>(X.values.<span class="fn">tobytes</span>()).<span class="fn">hexdigest</span>()[:<span class="num">10</span>]

<span class="cm"># 2) deterministik bölme + eğitim</span>
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=SEED)
model = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=SEED).<span class="fn">fit</span>(Xtr, ytr)
auc = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])

<span class="cm"># 3) artefakt kaydı</span>
record = {<span class="str">"seed"</span>: SEED, <span class="str">"data_hash"</span>: data_hash, <span class="str">"auc"</span>: <span class="fn">round</span>(<span class="fn">float</span>(auc), <span class="num">4</span>),
          <span class="str">"n_train"</span>: <span class="fn">len</span>(Xtr), <span class="str">"n_test"</span>: <span class="fn">len</span>(Xte)}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(record, indent=<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> öznitelik matrisinin hash'ini alarak veri setini parmak izler, sabit seed ile RandomForest eğitir, sonra altı ay sonra çalıştırmayı yeniden üretmek için gereken her şeyi (seed, veri hash'i, metrik, örnek sayıları) JSON'a yazar. Bu JSON'u model artefaktının yanına koyun ve elinizde ilkel ama gerçek bir deney logu olur.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Elle Yazılmış Loglardan MLflow'a</h2>
<p class="l-text">Deneyler ~20 çalıştırmayı geçince JSON dosyaları karşılaştırılamaz hale gelir. MLflow parametre, metrik ve artefaktları UI'lı bir tracking server'da tutar. L3'te derinlemesine bakacağız; API dostça:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — MLflow sunucusu ister, tarayıcıda çalışmaz</span>
<span class="cm"><span class="cm"># import mlflow</span>
<span class="cm"><span class="cm"># with mlflow.start_run():</span>
<span class="cm"><span class="cm">#     mlflow.log_param("seed", 42)</span>
<span class="cm"><span class="cm">#     mlflow.log_metric("auc", 0.83)</span>
<span class="cm"><span class="cm">#     mlflow.sklearn.log_model(model, "model")</span></span></code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Yorumlanmış importlar kanonik MLflow akışını gösterir: <code>mlflow.start_run()</code> bir run context açar. 2) <code>log_param("seed", 42)</code>, UI'da filtrelenebilir sütun olarak görünen hiperparametreleri saklar. 3) <code>log_metric("auc", 0.83)</code> bir metrik yazar (zaman serisi için <code>step</code> argümanı alır). 4) <code>mlflow.sklearn.log_model(model, "model")</code> tahminciyi MLflow artefaktı olarak serileştirir; sonra registry'de Production aşamasına yükseltilebilir. 5) Yorumlu çünkü Pyodide MLflow tracking server'a ulaşamaz — aşağıdaki Pyodide-eşdeğeri aynı zihinsel modeli bellek içinde yeniden kurar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mini bellek-içi MLflow: <code>start_run()</code>, <code>log_param/log_metric</code> bir dict listesine yazar. Aynı zihinsel model — params, metrics, run id — sunucu olmadan.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json, hashlib, time
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

RUNS = []  # bellek-içi "tracking server"

def start_run(params):
    rid = hashlib.md5(json.dumps(params, sort_keys=True).encode()).hexdigest()[:8]
    RUNS.append({"run_id": rid, "params": dict(params), "metrics": {}, "ts": time.time()})
    return RUNS[-1]

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
for n in [30, 80, 150]:
    run = start_run({"seed": 42, "n_estimators": n})
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    m = RandomForestClassifier(n_estimators=n, random_state=42).fit(Xtr, ytr)
    run["metrics"]["auc"] = round(roc_auc_score(yte, m.predict_proba(Xte)[:, 1]), 4)

print(json.dumps(RUNS, indent=2, default=str))</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>RUNS = []</code> MLflow tracking server'ın bellek-içi yerine geçer. 2) <code>start_run</code> param dict'ini <code>hashlib.md5</code> ile hashleyip kararlı bir 8-karakterli run-id üretir (aynı param → aynı id, tıpkı MLflow gibi). 3) Döngü <code>n_estimators in [30, 80, 150]</code> üzerinde gezinir, her konfigürasyon için run açar. 4) Her run içinde model aynı <code>random_state=42</code> ile eğitilir ve AUC <code>run["metrics"]</code>'e yazılır. 5) Son <code>json.dumps(RUNS, indent=2)</code> MLflow UI'ın gösterdiğini taklit eder — üç run, üç param seti, üç metrik, sıralamaya hazır.</p>
</div>
<div id="mlops-l2-graph-tr" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Yatırıma karşı tekrarlanabilirlik için harcanan saat. Seed + lock + DVC eklenince eğri sert biçimde düşer.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>Tekrarlanabilirlik = ortam + seed + veri, hepsi sürüm kilitli.</li>
<li>Lock dosyasını mutlaka commit'leyin (<code>requirements.lock</code>, <code>poetry.lock</code>, <code>environment.lock.yml</code>).</li>
<li>Her RNG'yi sabitleyin: Python hash, <code>random</code>, NumPy, framework, CUDA.</li>
<li>DVC (veya muadili) ile bir <code>git checkout</code> sonrasında aynı baytlar çekilebilsin.</li>
<li>5 deney için elle JSON yeter; 50+ için MLflow / W&amp;B'ye geçin.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var x = ['Disiplin yok', '+seed', '+lock', '+DVC', '+MLflow'];
  Plotly.newPlot('mlops-l2-graph-tr', [{
    x:x, y:[100, 60, 30, 12, 5], type:'scatter', mode:'lines+markers',
    line:{color:accent, width:3}, marker:{size:9}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'6 ay önceki bir çalıştırmayı yeniden üretmenin yaklaşık saati',
    yaxis:{title:'Saat'}, margin:{t:60,r:30,b:50,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
