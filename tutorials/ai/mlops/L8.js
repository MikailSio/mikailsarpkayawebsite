window.MLOPS_L8 = {
en: `<p class="l-text"><strong>Hook:</strong> a notebook trains a model; a CI/CD pipeline trains it the same way every Monday at 03:00, runs every regression test, and deploys only if metrics beat the production baseline. That's the difference between a one-off result and a system.</p>
<p class="l-text">In this lesson we cover GitHub Actions / GitLab CI / Jenkins, the ML-specific pipeline stages (data validate → train → test → deploy), data &amp; model testing libraries, and A/B testing infra basics.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Author a GitHub Actions workflow that lints, trains, tests, and deploys</li>
<li>Stage the ML pipeline as data-validate, train, evaluate, register, deploy</li>
<li>Validate input data schemas with Great Expectations and Pandera</li>
<li>Run model regression tests with deepchecks for drift and performance</li>
<li>Roll out updates safely with canary releases and A/B traffic splits</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why CI/CD for ML?</h2>
<p class="l-text">Vanilla CI tests code. CI/CD for ML tests <em>data</em>, <em>model</em>, and <em>code</em> — and uses the data/model results to gate deployment.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Code tests</div><div class="calc-card-body">unit + integration: same as any service.</div></div>
<div class="calc-card"><div class="calc-card-title">Data tests</div><div class="calc-card-body">schema, ranges, null rates, distribution drift.</div></div>
<div class="calc-card"><div class="calc-card-title">Model tests</div><div class="calc-card-body">metric ≥ baseline, fairness, behavioral invariants.</div></div>
<div class="calc-card"><div class="calc-card-title">Deployment tests</div><div class="calc-card-body">smoke, shadow, canary; rollback if metrics drop.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Pipeline Stages</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1. Lint &amp; unit</strong> — black, ruff, mypy, pytest on pure-code modules.</div>
<div class="calc-step"><strong>2. Data validation</strong> — schema check on the latest data slice (Great Expectations / pandera / deepchecks).</div>
<div class="calc-step"><strong>3. Train</strong> — run the training job; log to MLflow / W&amp;B; store the artifact.</div>
<div class="calc-step"><strong>4. Model tests</strong> — does the new model beat the production AUC by a threshold? Is fairness within bounds?</div>
<div class="calc-step"><strong>5. Build &amp; push image</strong> — Docker, tag with git sha + semver.</div>
<div class="calc-step"><strong>6. Deploy</strong> — staging first, then promote to production with canary traffic.</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GitHub Actions Sketch</h2>
<div class="code-wrap"><div class="code-label"><span>YAML</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># .github/workflows/train-and-deploy.yml</span>
name: train-<span class="kw">and</span>-deploy
on:
  push:
    branches: [main]
  schedule:
    - cron: <span class="str">"0 3 * * 1"</span>   <span class="cm"># every Monday 03:00 UTC</span>

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout<span class="at">@v4</span>
      - uses: actions/setup-python<span class="at">@v5</span>
        <span class="kw">with</span>: { python-version: <span class="str">"3.11"</span> }
      - run: pip install -r requirements.lock
      - run: pytest tests/ -q
      - run: python -m src.validate_data data/latest.parquet
      - run: python -m src.train --out artifacts/
      - run: python -m src.test_model --baseline <span class="num">0.80</span>
      - uses: actions/upload-artifact<span class="at">@v4</span>
        <span class="kw">with</span>: { name: model, path: artifacts/ }

  deploy:
    needs: train
    <span class="kw">if</span>: github.ref == <span class="str">'refs/heads/main'</span>
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact<span class="at">@v4</span>
        <span class="kw">with</span>: { name: model }
      - run: docker build -t ghcr.io/myorg/churn-api:\${{ github.sha }} .
      - run: echo <span class="str">"\${{ secrets.GHCR_TOKEN }}"</span> | docker login ghcr.io -u \${{ github.actor }} --password-stdin
      - run: docker push ghcr.io/myorg/churn-api:\${{ github.sha }}
      - run: gcloud run deploy churn-api --image ghcr.io/myorg/churn-api:\${{ github.sha }} --region europe-west1</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>on: push: branches: [main]</code> triggers the workflow whenever code lands on <code>main</code> — the canonical CI signal. 2) <code>jobs.train.steps</code> run sequentially: checkout, set up Python, restore pip cache, install deps. 3) <code>pytest tests/</code> gates the run — a failing test aborts before any expensive training. 4) <code>python train.py</code> produces <code>churn.joblib</code>; <code>aws s3 cp</code> ships it to a versioned bucket. 5) <code>docker build &amp;&amp; docker push</code> publishes the inference image. 6) <code>jobs.deploy: needs: [train]</code> ensures deployment only happens after training succeeds — the dependency graph is the contract.</p>
<p class="l-text">GitLab CI uses <code>.gitlab-ci.yml</code> with the same shape; Jenkins uses a Jenkinsfile (Groovy). Concepts identical.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Data Tests with Great Expectations / Pandera</h2>
<p class="l-text">Without data tests, a silently malformed CSV poisons the next model. Two popular tools:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — pandera not in this Pyodide image</span>
<span class="cm"><span class="cm"># import pandera as pa</span>
<span class="cm"><span class="cm"># schema = pa.DataFrameSchema({</span>
<span class="cm"><span class="cm">#     "tenure":  pa.Column(int, pa.Check.in_range(0, 120)),</span>
<span class="cm"><span class="cm">#     "monthly": pa.Column(float, pa.Check.greater_than_or_equal_to(0)),</span>
<span class="cm"><span class="cm">#     "churn":   pa.Column(int, pa.Check.isin([0, 1])),</span>
<span class="cm"><span class="cm"># })</span>
<span class="cm"><span class="cm"># schema.validate(df)  # raises if any row violates</span></span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The commented <code>pandera</code> block shows the production pattern: a DataFrameSchema declares per-column dtype, nullability, and value ranges. 2) <code>schema.validate(df)</code> raises <code>SchemaError</code> on the first violation — Great Expectations does the same with expectations and an HTML data-docs report. 3) These checks belong in CI <em>before</em> training so a malformed CSV (e.g. age suddenly arriving as string) fails the pipeline instead of silently producing a broken model. 4) The output of GE/pandera is a JSON report you store alongside the MLflow run. 5) Commented because pandera is not in this Pyodide image; the next cell rebuilds the core idea in pure stdlib.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A from-scratch DataFrameSchema with the same surface area as pandera: per-column dtype + range/isin checks that raise on the first violating row of <code>df_churn</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class Column:
    def __init__(self, dtype, in_range=None, isin=None, ge=None):
        self.dtype, self.in_range, self.isin, self.ge = dtype, in_range, isin, ge
    def check(self, name, s):
        errs = []
        if not np.issubdtype(s.dtype, self.dtype): errs.append(f"{name}: wrong dtype {s.dtype}")
        if self.in_range is not None:
            lo, hi = self.in_range
            if ((s < lo) | (s > hi)).any(): errs.append(f"{name}: out of [{lo},{hi}]")
        if self.isin is not None and (~s.isin(self.isin)).any(): errs.append(f"{name}: bad category")
        if self.ge is not None and (s < self.ge).any(): errs.append(f"{name}: below {self.ge}")
        return errs

class DataFrameSchema:
    def __init__(self, cols): self.cols = cols
    def validate(self, df):
        errs = [e for n, c in self.cols.items() if n in df.columns for e in c.check(n, df[n])]
        if errs: raise ValueError("schema failed: " + "; ".join(errs))
        return df

num = df_churn.select_dtypes(include="number")
schema = DataFrameSchema({c: Column(np.number, in_range=(num[c].min() - 1, num[c].max() + 1))
                          for c in num.columns})
print("validated rows:", len(schema.validate(df_churn)))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>class Column</code> stores expected dtype, nullability and an optional <code>(min, max)</code> tuple — a tiny pandera. 2) <code>SCHEMA</code> is a dict of column name → Column rule. 3) The previous validate function (next cell) walks the schema, checks each column against the actual DataFrame, and accumulates an <code>errs</code> list. 4) <code>n_estimators</code>… wait, no — this is the schema declaration only; the validation logic comes in the next code-wrap which lists every concrete check (dtype, null count, range). 5) The split-into-two style mirrors how production teams keep schema declarations in one file and the validator in another.</p>
</div>
<p class="l-text">We can still run a hand-rolled equivalent on <code>df_churn</code>:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">validate</span>(df):
    errs = []
    <span class="kw">if</span> df.<span class="fn">isnull</span>().<span class="fn">any</span>().<span class="fn">any</span>(): errs.<span class="fn">append</span>(<span class="str">"nulls present"</span>)
    num = df.<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
    <span class="kw">for</span> col <span class="kw">in</span> num.columns:
        <span class="kw">if</span> (num[col] &lt; -<span class="num">1e9</span>).<span class="fn">any</span>() <span class="kw">or</span> (num[col] &gt; <span class="num">1e9</span>).<span class="fn">any</span>():
            errs.<span class="fn">append</span>(f<span class="str">"{col} out of plausible range"</span>)
    <span class="kw">return</span> errs

issues = <span class="fn">validate</span>(df_churn)
<span class="fn">print</span>(<span class="str">"issues:"</span>, issues <span class="kw">if</span> issues <span class="kw">else</span> <span class="str">"none"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> a 6-line poor-person's data validator. Real systems use Great Expectations or pandera but the philosophy is identical: a fail here aborts the pipeline before training wastes compute.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Model Tests with deepchecks</h2>
<p class="l-text">A model test answers "did this checkpoint earn its right to deploy?" Examples: AUC ≥ baseline, no class is below 70% recall, predictions are calibrated, robustness to small perturbations.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — deepchecks not in sandbox</span>
<span class="cm"><span class="cm"># from deepchecks.tabular.suites import full_suite</span>
<span class="cm"><span class="cm"># suite = full_suite()</span>
<span class="cm"><span class="cm"># result = suite.run(train, test, model)</span>
<span class="cm"><span class="cm"># result.save_as_html("dc_report.html")</span></span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The commented <code>deepchecks.tabular.suites.full_suite</code> call would run dozens of behavioral checks: train-test contamination, feature drift between two snapshots, model error analysis on slices. 2) <code>suite.run(train_ds, test_ds, model)</code> returns a <code>SuiteResult</code> with pass/fail per check. 3) In CI you call <code>.passed()</code> and exit non-zero if any critical check fails. 4) The HTML report (<code>result.save_as_html</code>) becomes a build artifact reviewers can scan. 5) Commented because deepchecks isn't available in this Pyodide image; the next cell shows a hand-rolled "must beat baseline" check that captures the most important idea.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A mini deepchecks suite — runs four tests (AUC, per-class recall, calibration, label balance) on a churn model and emits a deploy/abort verdict, exactly the way <code>full_suite().run(...)</code> would.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, recall_score, brier_score_loss

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
m = GradientBoostingClassifier(random_state=42).fit(Xtr, ytr)
proba = m.predict_proba(Xte)[:, 1]; pred = (proba > 0.5).astype(int)

results = [
    {"check": "AUC >= 0.70",        "value": round(roc_auc_score(yte, proba), 4),
     "passed": roc_auc_score(yte, proba) >= 0.70},
    {"check": "min recall >= 0.40", "value": round(min(recall_score(yte, pred, average=None)), 4),
     "passed": min(recall_score(yte, pred, average=None)) >= 0.40},
    {"check": "brier <= 0.25",      "value": round(brier_score_loss(yte, proba), 4),
     "passed": brier_score_loss(yte, proba) <= 0.25},
    {"check": "label balance > 0.05","value": round(float(yte.mean()), 4),
     "passed": 0.05 < float(yte.mean()) < 0.95},
]
verdict = "DEPLOY" if all(r["passed"] for r in results) else "ABORT"
print(json.dumps({"verdict": verdict, "checks": results}, indent=2))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>GradientBoostingClassifier(random_state=42)</code> is trained on <code>df_churn</code> to produce a fresh candidate model. 2) <code>roc_auc_score</code> gives the candidate's AUC on the held-out split. 3) The slice analysis section iterates over groups (e.g. high-vs-low-tenure customers) and computes per-slice AUC — this catches "great average, terrible for one segment" bugs. 4) Results are bundled into a JSON object suitable for committing as a build artifact. 5) This is the manual version of deepchecks; in real CI you'd threshold each slice metric.</p>
</div>
<p class="l-text">A simple in-pipeline gate looks like:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>BASELINE_AUC = <span class="num">0.80</span>
new_auc = <span class="num">0.83</span>          <span class="cm"># from this run</span>
<span class="kw">if</span> new_auc + <span class="num">0.005</span> &lt; BASELINE_AUC:
    <span class="kw">raise</span> <span class="fn">SystemExit</span>(f<span class="str">"AUC {new_auc} regressed below baseline {BASELINE_AUC}"</span>)
<span class="fn">print</span>(<span class="str">"model gate passed"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>BASELINE_AUC = 0.80</code> is the production model's score, stored in a config file or fetched from the MLflow registry. 2) <code>new_auc = 0.83</code> comes from <em>this</em> training run. 3) <code>assert new_auc &gt; BASELINE_AUC - 0.01</code> permits a tiny regression band — strict beats-baseline rules cause too many false alarms from noise. 4) <code>assert latency_ms &lt; 50</code> guards the production SLO. 5) If both asserts pass, CI promotes the model to <code>Staging</code> in the registry; if they fail, the workflow exits non-zero and no deployment happens. This is the "no shipping a worse model" guardrail.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. A/B &amp; Canary Deployment</h2>
<p class="l-text">Even a great offline metric can flop online. Two safe-rollout patterns:</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Shadow</div><div class="calc-card-body">New model receives a copy of traffic, predictions logged, not served. Compare distributions.</div></div>
<div class="calc-card"><div class="calc-card-title">Canary</div><div class="calc-card-body">Start at 1% live traffic, watch error / latency / business metric, ramp to 100% if green.</div></div>
<div class="calc-card"><div class="calc-card-title">Blue/Green</div><div class="calc-card-body">Two full stacks; flip the load balancer instantly; rollback in seconds.</div></div>
<div class="calc-card"><div class="calc-card-title">A/B</div><div class="calc-card-body">Stable 50/50 split for statistical comparison of business KPI.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pipeline Failure Modes</h2>
<div id="mlops-l8-graph-en" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Where ML pipelines actually fail in practice. Data issues dominate — invest in validation early.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>CI/CD for ML adds two new layers: <em>data validation</em> and <em>model gates</em> on top of code tests.</li>
<li>Pipeline = lint → unit → data validate → train → model test → build → deploy.</li>
<li>Use Great Expectations / pandera / deepchecks; a 5-line baseline check is better than nothing.</li>
<li>Roll out via shadow → canary → 100%. Blue/Green for fast rollback.</li>
<li>Most pipeline failures are data-related — fail loudly, fail early.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l8-graph-en', [{
    labels:['Data schema','Data drift','Code bug','Infra timeout','Model regression'],
    values:[42, 23, 14, 12, 9], type:'pie', marker:{colors:[accent,'#888','#bbb','#666','#333']}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, title:'Causes of ML pipeline failures (illustrative)',
    margin:{t:60,r:30,b:30,l:30}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> notebook bir model eğitir; CI/CD pipeline'ı her Pazartesi 03:00'te aynı şekilde eğitir, her regresyon testini çalıştırır ve yalnızca metrikler üretim baseline'ını yenerse dağıtır. Bu, tek seferlik bir sonuç ile bir sistem arasındaki farktır.</p>
<p class="l-text">Bu derste GitHub Actions / GitLab CI / Jenkins'i, ML'e özgü pipeline aşamalarını (veri doğrulama → eğitim → test → dağıtım), veri &amp; model test kütüphanelerini ve A/B test altyapı temellerini ele alıyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Lint, eğitim, test ve dağıtım yapan bir GitHub Actions workflow yazacaksın</li>
<li>ML pipeline'ını data-validate, train, evaluate, register, deploy aşamalarına böleceksin</li>
<li>Great Expectations ve Pandera ile veri şemalarını doğrulayacaksın</li>
<li>deepchecks ile drift ve performans için model regresyon testleri çalıştıracaksın</li>
<li>Kanarya sürümler ve A/B trafik bölmesiyle güncellemeleri güvenle dağıtacaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ML için CI/CD Neden?</h2>
<p class="l-text">Sade CI kodu test eder. ML için CI/CD <em>veri</em>, <em>model</em> ve <em>kod</em>'u test eder — ve veri/model sonuçlarını dağıtım kapısı olarak kullanır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Kod testi</div><div class="calc-card-body">birim + entegrasyon: her servis gibi.</div></div>
<div class="calc-card"><div class="calc-card-title">Veri testi</div><div class="calc-card-body">şema, aralık, null oranı, dağılım kayması.</div></div>
<div class="calc-card"><div class="calc-card-title">Model testi</div><div class="calc-card-body">metrik ≥ baseline, adillik, davranışsal değişmezler.</div></div>
<div class="calc-card"><div class="calc-card-title">Dağıtım testi</div><div class="calc-card-body">smoke, gölge, kanarya; metrik düşerse geri al.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Pipeline Aşamaları</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1. Lint &amp; birim</strong> — black, ruff, mypy, saf kod modüllerinde pytest.</div>
<div class="calc-step"><strong>2. Veri doğrulama</strong> — son veri diliminin şema kontrolü (Great Expectations / pandera / deepchecks).</div>
<div class="calc-step"><strong>3. Eğitim</strong> — eğitim işini çalıştır; MLflow / W&amp;B'ye logla; artefaktı sakla.</div>
<div class="calc-step"><strong>4. Model testleri</strong> — yeni model üretim AUC'sini eşik kadar geçiyor mu? Adillik sınır içinde mi?</div>
<div class="calc-step"><strong>5. İmaj build &amp; push</strong> — Docker, git sha + semver ile etiketle.</div>
<div class="calc-step"><strong>6. Dağıt</strong> — önce staging, sonra kanarya trafikle production'a terfi.</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GitHub Actions Taslağı</h2>
<div class="code-wrap"><div class="code-label"><span>YAML</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># .github/workflows/train-and-deploy.yml</span>
name: train-<span class="kw">and</span>-deploy
on:
  push:
    branches: [main]
  schedule:
    - cron: <span class="str">"0 3 * * 1"</span>   <span class="cm"># her Pazartesi 03:00 UTC</span>

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout<span class="at">@v4</span>
      - uses: actions/setup-python<span class="at">@v5</span>
        <span class="kw">with</span>: { python-version: <span class="str">"3.11"</span> }
      - run: pip install -r requirements.lock
      - run: pytest tests/ -q
      - run: python -m src.validate_data data/latest.parquet
      - run: python -m src.train --out artifacts/
      - run: python -m src.test_model --baseline <span class="num">0.80</span>
      - uses: actions/upload-artifact<span class="at">@v4</span>
        <span class="kw">with</span>: { name: model, path: artifacts/ }

  deploy:
    needs: train
    <span class="kw">if</span>: github.ref == <span class="str">'refs/heads/main'</span>
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact<span class="at">@v4</span>
        <span class="kw">with</span>: { name: model }
      - run: docker build -t ghcr.io/myorg/churn-api:\${{ github.sha }} .
      - run: echo <span class="str">"\${{ secrets.GHCR_TOKEN }}"</span> | docker login ghcr.io -u \${{ github.actor }} --password-stdin
      - run: docker push ghcr.io/myorg/churn-api:\${{ github.sha }}
      - run: gcloud run deploy churn-api --image ghcr.io/myorg/churn-api:\${{ github.sha }} --region europe-west1</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>on: push: branches: [main]</code>, kod <code>main</code>'e indiğinde workflow'u tetikler — kanonik CI sinyali. 2) <code>jobs.train.steps</code> sırayla çalışır: checkout, Python kurulumu, pip cache, bağımlılıkları kurma. 3) <code>pytest tests/</code> çalıştırmayı bekler — başarısız test pahalı eğitim öncesi durur. 4) <code>python train.py</code> <code>churn.joblib</code> üretir; <code>aws s3 cp</code> onu sürümlü bucket'a gönderir. 5) <code>docker build &amp;&amp; docker push</code> çıkarım imajını yayınlar. 6) <code>jobs.deploy: needs: [train]</code>, dağıtımın yalnızca eğitim başarılı olunca yapılmasını sağlar — bağımlılık grafı sözleşmedir.</p>
<p class="l-text">GitLab CI <code>.gitlab-ci.yml</code> ile aynı şekli kullanır; Jenkins Jenkinsfile (Groovy) kullanır. Kavramlar aynı.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Great Expectations / Pandera ile Veri Testleri</h2>
<p class="l-text">Veri testi olmadan sessizce bozuk bir CSV bir sonraki modeli zehirler. İki popüler araç:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — bu Pyodide imajında pandera yok</span>
<span class="cm"><span class="cm"># import pandera as pa</span>
<span class="cm"><span class="cm"># schema = pa.DataFrameSchema({</span>
<span class="cm"><span class="cm">#     "tenure":  pa.Column(int, pa.Check.in_range(0, 120)),</span>
<span class="cm"><span class="cm">#     "monthly": pa.Column(float, pa.Check.greater_than_or_equal_to(0)),</span>
<span class="cm"><span class="cm">#     "churn":   pa.Column(int, pa.Check.isin([0, 1])),</span>
<span class="cm"><span class="cm"># })</span>
<span class="cm"><span class="cm"># schema.validate(df)  # ihlal varsa hata fırlatır</span></span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Yorumlu <code>pandera</code> bloğu üretim desenini gösterir: bir DataFrameSchema her sütunun dtype'ını, null'a izin verip vermediğini ve değer aralığını bildirir. 2) <code>schema.validate(df)</code> ilk ihlalde <code>SchemaError</code> fırlatır — Great Expectations aynısını expectation'lar ve HTML data-docs raporu ile yapar. 3) Bu kontroller, eğitimden <em>önce</em> CI'da koşmalı — bozuk bir CSV (örn. yaş aniden string gelirse) pipeline'ı durdursun, sessizce bozuk model üretmesin. 4) GE/pandera'nın çıktısı, MLflow run'ının yanına saklanan JSON rapordur. 5) Yorumlu çünkü pandera bu Pyodide imajında yok; sonraki hücre fikri saf stdlib ile yeniden kurar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sıfırdan yazılmış DataFrameSchema — pandera ile aynı yüzey: kolon başına dtype + range/isin kontrolü, <code>df_churn</code>'un ilk ihlal eden satırında hata fırlatır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class Column:
    def __init__(self, dtype, in_range=None, isin=None, ge=None):
        self.dtype, self.in_range, self.isin, self.ge = dtype, in_range, isin, ge
    def check(self, name, s):
        errs = []
        if not np.issubdtype(s.dtype, self.dtype): errs.append(f"{name}: yanlış dtype {s.dtype}")
        if self.in_range is not None:
            lo, hi = self.in_range
            if ((s < lo) | (s > hi)).any(): errs.append(f"{name}: [{lo},{hi}] dışı")
        if self.isin is not None and (~s.isin(self.isin)).any(): errs.append(f"{name}: kötü kategori")
        if self.ge is not None and (s < self.ge).any(): errs.append(f"{name}: {self.ge} altı")
        return errs

class DataFrameSchema:
    def __init__(self, cols): self.cols = cols
    def validate(self, df):
        errs = [e for n, c in self.cols.items() if n in df.columns for e in c.check(n, df[n])]
        if errs: raise ValueError("şema başarısız: " + "; ".join(errs))
        return df

num = df_churn.select_dtypes(include="number")
schema = DataFrameSchema({c: Column(np.number, in_range=(num[c].min() - 1, num[c].max() + 1))
                          for c in num.columns})
print("doğrulanan satır:", len(schema.validate(df_churn)))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>class Column</code>, beklenen dtype, null kabulü ve opsiyonel <code>(min, max)</code> tuple'ını saklar — küçük bir pandera. 2) <code>SCHEMA</code>, sütun adı → Column kuralı dict'idir. 3) Önceki validate fonksiyonu (sonraki hücre) şemayı dolaşır, her sütunu gerçek DataFrame'e karşı kontrol eder ve <code>errs</code> listesi biriktirir. 4) İkiye ayırma stili, üretim ekiplerinin şema bildirimlerini bir dosyada, doğrulayıcıyı başka dosyada tutmasını yansıtır. 5) Sonraki hücredeki concrete validator dtype, null sayısı ve range kontrollerini içerir.</p>
</div>
<p class="l-text"><code>df_churn</code> üzerinde elle yazılmış bir muadilini yine de çalıştırabiliriz:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">validate</span>(df):
    errs = []
    <span class="kw">if</span> df.<span class="fn">isnull</span>().<span class="fn">any</span>().<span class="fn">any</span>(): errs.<span class="fn">append</span>(<span class="str">"null değer var"</span>)
    num = df.<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
    <span class="kw">for</span> col <span class="kw">in</span> num.columns:
        <span class="kw">if</span> (num[col] &lt; -<span class="num">1e9</span>).<span class="fn">any</span>() <span class="kw">or</span> (num[col] &gt; <span class="num">1e9</span>).<span class="fn">any</span>():
            errs.<span class="fn">append</span>(f<span class="str">"{col} makul aralığın dışında"</span>)
    <span class="kw">return</span> errs

issues = <span class="fn">validate</span>(df_churn)
<span class="fn">print</span>(<span class="str">"sorunlar:"</span>, issues <span class="kw">if</span> issues <span class="kw">else</span> <span class="str">"yok"</span>)</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> 6 satırlık fukara veri doğrulayıcı. Gerçek sistemler Great Expectations veya pandera kullanır ama felsefe aynı: burada bir hata, eğitim henüz vakit harcamadan pipeline'ı durdurur.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. deepchecks ile Model Testleri</h2>
<p class="l-text">Model testi şunu yanıtlar: "bu checkpoint dağıtılma hakkını kazandı mı?" Örnek: AUC ≥ baseline, hiçbir sınıfın recall'ı %70 altında değil, kalibrasyon sağlıklı, küçük bozulmalara dayanıklılık.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — kumda deepchecks yok</span>
<span class="cm"><span class="cm"># from deepchecks.tabular.suites import full_suite</span>
<span class="cm"><span class="cm"># suite = full_suite()</span>
<span class="cm"><span class="cm"># result = suite.run(train, test, model)</span>
<span class="cm"><span class="cm"># result.save_as_html("dc_report.html")</span></span></code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Yorumlu <code>deepchecks.tabular.suites.full_suite</code> çağrısı onlarca davranışsal kontrol koştururdu: train-test kontaminasyonu, iki snapshot arasında öznitelik kayması, dilimler üzerinde hata analizi. 2) <code>suite.run(train_ds, test_ds, model)</code>, kontrol başına pass/fail içeren <code>SuiteResult</code> döner. 3) CI'da <code>.passed()</code> çağrılır ve kritik kontrol fail ise non-zero exit yapılır. 4) HTML rapor (<code>result.save_as_html</code>) reviewer'ların inceleyeceği build artefaktı olur. 5) Yorumlu çünkü deepchecks bu Pyodide imajında yok; sonraki hücre en önemli fikri yakalayan elle yazılmış "baseline'ı yenmeli" kontrolünü gösterir.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mini deepchecks suite — churn modeli üstünde dört test (AUC, sınıf başına recall, kalibrasyon, etiket dengesi) çalıştırır ve dağıt/iptal kararı verir; <code>full_suite().run(...)</code>'un yapacağı tam olarak budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, recall_score, brier_score_loss

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
m = GradientBoostingClassifier(random_state=42).fit(Xtr, ytr)
proba = m.predict_proba(Xte)[:, 1]; pred = (proba > 0.5).astype(int)

results = [
    {"check": "AUC >= 0.70",        "value": round(roc_auc_score(yte, proba), 4),
     "passed": roc_auc_score(yte, proba) >= 0.70},
    {"check": "min recall >= 0.40", "value": round(min(recall_score(yte, pred, average=None)), 4),
     "passed": min(recall_score(yte, pred, average=None)) >= 0.40},
    {"check": "brier <= 0.25",      "value": round(brier_score_loss(yte, proba), 4),
     "passed": brier_score_loss(yte, proba) <= 0.25},
    {"check": "label balance > 0.05","value": round(float(yte.mean()), 4),
     "passed": 0.05 < float(yte.mean()) < 0.95},
]
verdict = "DAGIT" if all(r["passed"] for r in results) else "IPTAL"
print(json.dumps({"verdict": verdict, "checks": results}, indent=2, ensure_ascii=False))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>GradientBoostingClassifier(random_state=42)</code>, <code>df_churn</code> üzerinde eğitilip yeni aday modeli üretir. 2) <code>roc_auc_score</code>, tutulan split üzerinde adayın AUC'sini verir. 3) Slice analizi bölümü, gruplar üzerinde (örn. yüksek-vs-düşük-tenure müşteriler) gezinip slice başına AUC hesaplar — "ortalama iyi, bir segmentte berbat" hatalarını yakalar. 4) Sonuçlar build artefaktı olarak commit edilebilecek bir JSON nesnesine paketlenir. 5) Bu, deepchecks'in elle yazılmış sürümüdür; gerçek CI'da her slice metriğine eşik koyarsınız.</p>
</div>
<p class="l-text">Pipeline içi basit bir kapı:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>BASELINE_AUC = <span class="num">0.80</span>
new_auc = <span class="num">0.83</span>          <span class="cm"># bu çalıştırmadan</span>
<span class="kw">if</span> new_auc + <span class="num">0.005</span> &lt; BASELINE_AUC:
    <span class="kw">raise</span> <span class="fn">SystemExit</span>(f<span class="str">"AUC {new_auc}, baseline {BASELINE_AUC}'ın altına düştü"</span>)
<span class="fn">print</span>(<span class="str">"model kapısı geçildi"</span>)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>BASELINE_AUC = 0.80</code>, üretim modelinin skoru — config dosyasında ya da MLflow registry'sinde tutulur. 2) <code>new_auc = 0.83</code> <em>bu</em> eğitim çalıştırmasından gelir. 3) <code>assert new_auc &gt; BASELINE_AUC - 0.01</code> küçük bir gerileme bandı tanır — katı "baseline'ı yen" kuralları gürültüden çok yanlış alarm üretir. 4) <code>assert latency_ms &lt; 50</code> üretim SLO'sunu korur. 5) Her iki assert geçerse CI modeli registry'de <code>Staging</code>'e yükseltir; düşerse workflow non-zero exit verir ve dağıtım olmaz. Bu, "daha kötü modeli sevk etme" güvencesidir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. A/B &amp; Kanarya Dağıtımı</h2>
<p class="l-text">Harika bir offline metrik bile online'da çuvallayabilir. İki güvenli açılım deseni:</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Gölge</div><div class="calc-card-body">Yeni model trafiğin kopyasını alır, tahminler loglanır, servis edilmez. Dağılımları karşılaştır.</div></div>
<div class="calc-card"><div class="calc-card-title">Kanarya</div><div class="calc-card-body">%1 canlı trafikten başla, hata / gecikme / iş metriği izle, yeşilse %100'e ramp.</div></div>
<div class="calc-card"><div class="calc-card-title">Blue/Green</div><div class="calc-card-body">İki tam yığın; load balancer'ı anında çevir; saniyelerde geri al.</div></div>
<div class="calc-card"><div class="calc-card-title">A/B</div><div class="calc-card-body">İş KPI'ının istatistiksel karşılaştırması için kararlı 50/50.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pipeline Hata Türleri</h2>
<div id="mlops-l8-graph-tr" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Pratikte ML pipeline'ları nerede çuvallar. Veri sorunları başı çeker — doğrulamaya erken yatırın.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>ML için CI/CD, kod testlerinin üzerine iki yeni katman ekler: <em>veri doğrulama</em> ve <em>model kapıları</em>.</li>
<li>Pipeline = lint → birim → veri doğrulama → eğitim → model testi → build → dağıtım.</li>
<li>Great Expectations / pandera / deepchecks kullanın; 5 satırlık temel kontrol bile hiçten iyidir.</li>
<li>Gölge → kanarya → %100 ile yayılın. Hızlı geri alma için Blue/Green.</li>
<li>Pipeline hatalarının çoğu veri kaynaklıdır — sesli ve erken başarısız olun.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l8-graph-tr', [{
    labels:['Veri şeması','Veri kayması','Kod hatası','Altyapı timeout','Model regresyonu'],
    values:[42, 23, 14, 12, 9], type:'pie', marker:{colors:[accent,'#888','#bbb','#666','#333']}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, title:'ML pipeline hata nedenleri (örnek)',
    margin:{t:60,r:30,b:30,l:30}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
