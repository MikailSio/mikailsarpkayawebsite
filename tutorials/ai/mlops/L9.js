window.MLOPS_L9 = {
en: `<p class="l-text"><strong>Hook:</strong> a model in production is a perishable good. Customers change, prices shift, fraud patterns mutate. The model that scored 0.92 AUC at launch can quietly drop to 0.78 — and unless you're monitoring, no dashboard will scream. <strong>Monitoring</strong> is what turns ML from "deployed" into "trustworthy".</p>
<p class="l-text">In this lesson we cover data drift, concept drift, KL divergence as a drift metric, the tooling landscape (Evidently / WhyLabs / Arize), structured logging + Prometheus, and a runnable drift simulation on <code>df_churn</code>.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish data drift from concept drift with concrete churn examples</li>
<li>Compute KL divergence between training and production feature distributions</li>
<li>Detect drift on df_churn by injecting a tenure shift and measuring it</li>
<li>Compare Evidently, WhyLabs, and Arize as drift monitoring platforms</li>
<li>Emit structured logs and Prometheus metrics with sane alert thresholds</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Two Kinds of Drift</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Data drift</div><div class="calc-card-body">Input distribution P(X) shifts. Same target, different inputs. (Feature value distribution moves.)</div></div>
<div class="calc-card"><div class="calc-card-title">Concept drift</div><div class="calc-card-body">P(Y|X) shifts. Same input, the right answer changed. (Customer who fit "churn" pattern in 2024 doesn't in 2026.)</div></div>
<div class="calc-card"><div class="calc-card-title">Label drift</div><div class="calc-card-body">P(Y) shifts. Class balance changes (more churners than before).</div></div>
<div class="calc-card"><div class="calc-card-title">Feature drift</div><div class="calc-card-body">Per-column shift; subset of data drift, easy to localize.</div></div>
</div>
<p class="l-text">Detection logic differs: data drift you can see <em>without labels</em>; concept drift requires real outcomes (lagged ground truth).</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. KL Divergence as a Drift Metric</h2>
<p class="l-text">For two discrete distributions $P$ (training) and $Q$ (live):</p>
<div class="katex-block">$$D_{KL}(P \\| Q) = \\sum_{x} P(x) \\, \\log \\frac{P(x)}{Q(x)}$$</div>
<p class="l-text">Asymmetric, non-negative, zero only when distributions match. Common alternatives: <strong>JS divergence</strong> (symmetric), <strong>PSI</strong> (Population Stability Index, used in finance), <strong>Wasserstein</strong> (earth-mover; smooth for continuous data).</p>
<p class="l-text">Rule of thumb for PSI: <code>&lt;0.1</code> stable, <code>0.1–0.25</code> moderate drift, <code>&gt;0.25</code> significant.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tooling Landscape</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Evidently AI</div><div class="calc-card-body">Open source. Drift reports, dashboards, integrates with Grafana / MLflow.</div></div>
<div class="calc-card"><div class="calc-card-title">WhyLabs / whylogs</div><div class="calc-card-body">Profile-first; lightweight client + SaaS dashboard.</div></div>
<div class="calc-card"><div class="calc-card-title">Arize / Fiddler</div><div class="calc-card-body">Enterprise SaaS — drift + explainability + fairness in one product.</div></div>
<div class="calc-card"><div class="calc-card-title">Prometheus + Grafana</div><div class="calc-card-body">Generic infra stack; emit your own counters and gauges.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Drift Simulation on df_churn</h2>
<p class="l-text">Below: split the data into "training" and "live", artificially shift the live slice, and quantify drift with PSI per feature. Runnable.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>).<span class="fn">copy</span>()
mid = <span class="fn">len</span>(df) // <span class="num">2</span>
train = df.iloc[:mid].<span class="fn">copy</span>()
live  = df.iloc[mid:].<span class="fn">copy</span>()

<span class="cm"># Inject artificial drift on a few features</span>
<span class="kw">for</span> col <span class="kw">in</span> live.columns[:<span class="num">3</span>]:
    live[col] = live[col] * <span class="num">1.25</span> + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.5</span>, size=<span class="fn">len</span>(live))

<span class="kw">def</span> <span class="fn">psi</span>(expected, actual, bins=<span class="num">10</span>):
    qs = np.<span class="fn">unique</span>(np.<span class="fn">quantile</span>(expected, np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, bins + <span class="num">1</span>)))
    <span class="kw">if</span> <span class="fn">len</span>(qs) &lt; <span class="num">3</span>: <span class="kw">return</span> <span class="num">0.0</span>
    e_hist, _ = np.<span class="fn">histogram</span>(expected, bins=qs)
    a_hist, _ = np.<span class="fn">histogram</span>(actual, bins=qs)
    e = np.<span class="fn">where</span>(e_hist == <span class="num">0</span>, <span class="num">1e-6</span>, e_hist) / <span class="fn">len</span>(expected)
    a = np.<span class="fn">where</span>(a_hist == <span class="num">0</span>, <span class="num">1e-6</span>, a_hist) / <span class="fn">len</span>(actual)
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">sum</span>((a - e) * np.<span class="fn">log</span>(a / e)))

scores = {c: <span class="fn">round</span>(<span class="fn">psi</span>(train[c].values, live[c].values), <span class="num">3</span>)
          <span class="kw">for</span> c <span class="kw">in</span> train.columns}
ranked = <span class="fn">sorted</span>(scores.<span class="fn">items</span>(), key=<span class="kw">lambda</span> kv: -kv[<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">"PSI per feature (descending):"</span>)
<span class="kw">for</span> c, v <span class="kw">in</span> ranked[:<span class="num">8</span>]:
    flag = <span class="str">"DRIFT"</span> <span class="kw">if</span> v &gt; <span class="num">0.25</span> <span class="kw">else</span> (<span class="str">"watch"</span> <span class="kw">if</span> v &gt; <span class="num">0.1</span> <span class="kw">else</span> <span class="str">"stable"</span>)
    <span class="fn">print</span>(f<span class="str">"  {c:25s}  PSI={v:.3f}  [{flag}]"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> splits <code>df_churn</code> into a "training" baseline and a "live" sample, artificially scales + perturbs the first three features, then computes Population Stability Index per feature. Features above 0.25 are flagged DRIFT — exactly what a monitoring service like Evidently would surface in a daily report.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Performance Monitoring</h2>
<p class="l-text">Drift is leading; performance is lagging (you need labels). Pattern: log every prediction with a request id, attach the ground truth when it arrives (hours / days later), compute rolling AUC / accuracy / business KPI.</p>
<div class="calc-steps">
<div class="calc-step"><strong>1. Inference log</strong> — request_id, features hash, prediction, model_version, timestamp.</div>
<div class="calc-step"><strong>2. Outcome log</strong> — request_id, actual outcome (churn / not), timestamp.</div>
<div class="calc-step"><strong>3. Join</strong> — periodic SQL / Spark job joins both streams.</div>
<div class="calc-step"><strong>4. Aggregate</strong> — daily/weekly metrics; alert on threshold breach.</div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Logging &amp; Metrics</h2>
<p class="l-text">Two complementary signals:</p>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Structured logs</strong><br/>JSON lines per event. Searchable in Loki / Elastic / CloudWatch.</div><div class="calc-compare-cell"><strong>Metrics</strong><br/>Counters &amp; gauges scraped by Prometheus. Cheap, aggregatable, alert-friendly.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — needs prometheus-client + a running server</span>
<span class="cm"><span class="cm"># from prometheus_client import Counter, Histogram</span>
<span class="cm"><span class="cm"># REQS = Counter("predict_total", "predictions", ["model_version"])</span>
<span class="cm"><span class="cm"># LATENCY = Histogram("predict_latency_seconds", "latency", ["model_version"])</span>
<span class="cm"><span class="cm"># with LATENCY.labels(MODEL_VERSION).time():</span>
<span class="cm"><span class="cm">#     p = model.predict_proba(x)[0, 1]</span>
<span class="cm"><span class="cm"># REQS.labels(MODEL_VERSION).inc()</span></span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The commented <code>prometheus_client</code> imports show the production pattern: <code>Counter</code> for request counts, <code>Histogram</code> for latency, <code>Gauge</code> for live values like queue depth. 2) <code>REQ_LATENCY.observe(elapsed)</code> updates the histogram on every predict call — Prometheus scrapes <code>/metrics</code> every 15s. 3) <code>start_http_server(8001)</code> exposes the metrics endpoint on a side port so it doesn't collide with /predict. 4) Grafana then plots <code>histogram_quantile(0.95, ...)</code> against those metrics. 5) Commented because <code>prometheus-client</code> isn't bundled and we have no scraper here; the next cell reproduces histogram + counter logic in stdlib so you can feel the data shape.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hand-rolled Counter + Histogram with the same surface — labels, <code>.inc()</code>, <code>.observe()</code>, plus a <code>time()</code> context manager. We instrument 200 predictions on real churn data and print Prometheus-style histogram buckets.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time, json
from contextlib import contextmanager
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

class Counter:
    def __init__(self): self.values = {}
    def labels(self, *l): self.key = l; return self
    def inc(self, n=1): self.values[self.key] = self.values.get(self.key, 0) + n

class Histogram:
    def __init__(self, buckets=(0.001, 0.005, 0.01, 0.05, 0.1, 0.5)):
        self.buckets, self.counts = buckets, [0] * (len(buckets) + 1)
    def observe(self, v):
        for i, b in enumerate(self.buckets):
            if v <= b: self.counts[i] += 1; return
        self.counts[-1] += 1
    @contextmanager
    def time(self):
        t0 = time.time(); yield; self.observe(time.time() - t0)

REQS, LAT = Counter(), Histogram()
df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(random_state=42).fit(Xtr, ytr)
for i in range(min(200, len(Xte))):
    with LAT.time():
        _ = model.predict_proba(Xte.iloc[[i]])[0, 1]
    REQS.labels("v1.2.0").inc()
print("predict_total:", REQS.values)
print("latency_buckets:", dict(zip([f"<= {b}s" for b in LAT.buckets] + ["+Inf"], LAT.counts)))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>METRICS = {"requests": 0, "latencies": [], "errors": 0}</code> is a hand-rolled Prometheus stand-in. 2) The <code>@contextmanager</code> <code>track()</code> measures wall-clock around a block of work and appends to <code>latencies</code>. 3) The simulated request loop runs <code>predict</code> inside <code>with track()</code> and bumps <code>requests</code>. 4) <code>except Exception: METRICS["errors"] += 1</code> mirrors the production error counter. 5) The final percentile computation (<code>np.percentile(latencies, 95)</code>) is exactly what <code>histogram_quantile</code> does on the Prometheus side — same math, no server.</p>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Alerting Smartly</h2>
<p class="l-text">Most alerting failures are <em>noise</em>. Three rules to follow:</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Symptom, not cause</div><div class="calc-card-body">Alert on user-visible metrics (latency, error rate, business KPI).</div></div>
<div class="calc-card"><div class="calc-card-title">Burn-rate, not threshold</div><div class="calc-card-body">"AUC dropped 5% over 24h" beats "AUC &lt; 0.8" for a single hour.</div></div>
<div class="calc-card"><div class="calc-card-title">Severity tiers</div><div class="calc-card-body">Page only for true SLO breaches; everything else is a ticket.</div></div>
</div>
<div id="mlops-l9-graph-en" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">A textbook drift incident: AUC degrades two weeks before the user complaint arrives. Drift detection (orange) usually catches it first, performance (blue) follows once labels land.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>Two drifts: data (P(X)) is unlabeled and fast to detect; concept (P(Y|X)) needs lagged labels.</li>
<li>KL / JS / PSI / Wasserstein quantify drift. PSI &gt; 0.25 = significant, in industry use.</li>
<li>Evidently / WhyLabs / Arize ship the dashboards; Prometheus + Grafana give you the plumbing.</li>
<li>Log inference + outcomes with a shared request id; join them to compute production metrics.</li>
<li>Alert on burn rate and user-visible symptoms — not on every threshold.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var x = Array.from({length:30}, (_,i) =&gt; "D"+(i+1));
  var auc = x.map((_,i) =&gt; 0.90 - (i&gt;10 ? (i-10)*0.012 : 0) + (Math.random()-0.5)*0.01);
  var psi = x.map((_,i) =&gt; (i&gt;7 ? (i-7)*0.04 : 0.03) + Math.random()*0.02);
  Plotly.newPlot('mlops-l9-graph-en', [
    {x:x, y:auc, name:'val AUC', mode:'lines+markers', line:{color:'#5aa9ff', width:2}, yaxis:'y'},
    {x:x, y:psi, name:'PSI', mode:'lines+markers', line:{color:accent, width:2}, yaxis:'y2'}
  ], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, title:'AUC (lagging) vs PSI (leading) over 30 days',
    yaxis:{title:'AUC', range:[0.6, 0.95]},
    yaxis2:{title:'PSI', overlaying:'y', side:'right', range:[0, 1.1]},
    margin:{t:60,r:60,b:60,l:60}, legend:{orientation:'h', y:-0.2}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> üretimdeki bir model bozulabilir bir maldır. Müşteriler değişir, fiyatlar oynar, dolandırıcılık desenleri başkalaşır. Lansmanda 0.92 AUC veren model sessizce 0.78'e düşebilir — siz izlemiyorsanız hiçbir gösterge bağırmaz. <strong>İzleme</strong>, ML'i "dağıtılmış"tan "güvenilir"e dönüştüren şeydir.</p>
<p class="l-text">Bu derste veri kayması, kavram kayması, drift metriği olarak KL divergence, araç manzarası (Evidently / WhyLabs / Arize), yapılandırılmış log + Prometheus ve <code>df_churn</code> üzerinde çalışan bir drift simülasyonunu ele alıyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Somut churn örnekleriyle veri kaymasını kavram kaymasından ayıracaksın</li>
<li>Eğitim ve üretim öznitelik dağılımları arasında KL divergence hesaplayacaksın</li>
<li>df_churn üzerinde tenure kayması enjekte edip drift'i ölçeceksin</li>
<li>Drift izleme platformları olarak Evidently, WhyLabs ve Arize'ı karşılaştıracaksın</li>
<li>Mantıklı uyarı eşikleriyle yapılandırılmış log ve Prometheus metrikleri yayınlayacaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. İki Tür Drift</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Veri kayması</div><div class="calc-card-body">Girdi dağılımı P(X) kayar. Aynı hedef, farklı girdiler. (Öznitelik dağılımı oynar.)</div></div>
<div class="calc-card"><div class="calc-card-title">Kavram kayması</div><div class="calc-card-body">P(Y|X) kayar. Aynı girdi, doğru cevap değişti. (2024'te "churn" desenine uyan müşteri 2026'da uymuyor.)</div></div>
<div class="calc-card"><div class="calc-card-title">Etiket kayması</div><div class="calc-card-body">P(Y) kayar. Sınıf dengesi değişir (eskisinden çok churn).</div></div>
<div class="calc-card"><div class="calc-card-title">Öznitelik kayması</div><div class="calc-card-body">Sütun başına kayma; veri kaymasının alt kümesi, lokalize etmesi kolay.</div></div>
</div>
<p class="l-text">Tespit mantığı farklıdır: veri kaymasını <em>etiketsiz</em> görebilirsiniz; kavram kayması gerçek sonuçlar (gecikmeli ground truth) ister.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Drift Metriği Olarak KL Divergence</h2>
<p class="l-text">İki ayrık dağılım $P$ (eğitim) ve $Q$ (canlı) için:</p>
<div class="katex-block">$$D_{KL}(P \\| Q) = \\sum_{x} P(x) \\, \\log \\frac{P(x)}{Q(x)}$$</div>
<p class="l-text">Asimetrik, negatif değil, yalnızca dağılımlar uyuştuğunda sıfır. Yaygın alternatifler: <strong>JS divergence</strong> (simetrik), <strong>PSI</strong> (Population Stability Index, finansta), <strong>Wasserstein</strong> (toprak taşıyıcı; sürekli verilerde pürüzsüz).</p>
<p class="l-text">PSI için pratik kural: <code>&lt;0.1</code> kararlı, <code>0.1–0.25</code> orta drift, <code>&gt;0.25</code> belirgin.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Araç Manzarası</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Evidently AI</div><div class="calc-card-body">Açık kaynak. Drift raporları, panolar, Grafana / MLflow ile entegre.</div></div>
<div class="calc-card"><div class="calc-card-title">WhyLabs / whylogs</div><div class="calc-card-body">Profil odaklı; hafif istemci + SaaS pano.</div></div>
<div class="calc-card"><div class="calc-card-title">Arize / Fiddler</div><div class="calc-card-body">Kurumsal SaaS — drift + açıklanabilirlik + adillik tek üründe.</div></div>
<div class="calc-card"><div class="calc-card-title">Prometheus + Grafana</div><div class="calc-card-body">Genel altyapı yığını; kendi sayaçlarınızı ve gauge'larınızı yayın.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. df_churn Üzerinde Drift Simülasyonu</h2>
<p class="l-text">Aşağıda veriyi "eğitim" ve "canlı" diye ikiye ayırıyor, canlı dilimi yapay olarak kaydırıyor ve öznitelik başına PSI ile drift'i sayısallaştırıyoruz. Çalışır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>).<span class="fn">copy</span>()
mid = <span class="fn">len</span>(df) // <span class="num">2</span>
train = df.iloc[:mid].<span class="fn">copy</span>()
live  = df.iloc[mid:].<span class="fn">copy</span>()

<span class="cm"># Birkaç özniteliğe yapay drift enjekte et</span>
<span class="kw">for</span> col <span class="kw">in</span> live.columns[:<span class="num">3</span>]:
    live[col] = live[col] * <span class="num">1.25</span> + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.5</span>, size=<span class="fn">len</span>(live))

<span class="kw">def</span> <span class="fn">psi</span>(expected, actual, bins=<span class="num">10</span>):
    qs = np.<span class="fn">unique</span>(np.<span class="fn">quantile</span>(expected, np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">1</span>, bins + <span class="num">1</span>)))
    <span class="kw">if</span> <span class="fn">len</span>(qs) &lt; <span class="num">3</span>: <span class="kw">return</span> <span class="num">0.0</span>
    e_hist, _ = np.<span class="fn">histogram</span>(expected, bins=qs)
    a_hist, _ = np.<span class="fn">histogram</span>(actual, bins=qs)
    e = np.<span class="fn">where</span>(e_hist == <span class="num">0</span>, <span class="num">1e-6</span>, e_hist) / <span class="fn">len</span>(expected)
    a = np.<span class="fn">where</span>(a_hist == <span class="num">0</span>, <span class="num">1e-6</span>, a_hist) / <span class="fn">len</span>(actual)
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">sum</span>((a - e) * np.<span class="fn">log</span>(a / e)))

scores = {c: <span class="fn">round</span>(<span class="fn">psi</span>(train[c].values, live[c].values), <span class="num">3</span>)
          <span class="kw">for</span> c <span class="kw">in</span> train.columns}
ranked = <span class="fn">sorted</span>(scores.<span class="fn">items</span>(), key=<span class="kw">lambda</span> kv: -kv[<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">"Öznitelik başına PSI (azalan):"</span>)
<span class="kw">for</span> c, v <span class="kw">in</span> ranked[:<span class="num">8</span>]:
    flag = <span class="str">"DRIFT"</span> <span class="kw">if</span> v &gt; <span class="num">0.25</span> <span class="kw">else</span> (<span class="str">"izle"</span> <span class="kw">if</span> v &gt; <span class="num">0.1</span> <span class="kw">else</span> <span class="str">"kararlı"</span>)
    <span class="fn">print</span>(f<span class="str">"  {c:25s}  PSI={v:.3f}  [{flag}]"</span>)</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> <code>df_churn</code>'ü "eğitim" baseline'ı ve "canlı" örneğine ayırır, ilk üç özniteliği yapay olarak ölçeklendirip bozar, sonra öznitelik başına Population Stability Index hesaplar. 0.25 üstü öznitelikler DRIFT olarak işaretlenir — Evidently gibi bir izleme servisi günlük raporda tam da bunu çıkarırdı.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Performans İzleme</h2>
<p class="l-text">Drift öncüdür; performans gecikmelidir (etiket gerek). Desen: her tahmini bir request id ile logla, ground truth (saatler/günler sonra) gelince bağla, hareketli AUC / doğruluk / iş KPI'ı hesapla.</p>
<div class="calc-steps">
<div class="calc-step"><strong>1. Çıkarım logu</strong> — request_id, öznitelik hash'i, tahmin, model_version, zaman damgası.</div>
<div class="calc-step"><strong>2. Sonuç logu</strong> — request_id, gerçek sonuç (churn / değil), zaman damgası.</div>
<div class="calc-step"><strong>3. Bağla</strong> — periyodik SQL / Spark işi iki akışı birleştirir.</div>
<div class="calc-step"><strong>4. Topla</strong> — günlük/haftalık metrikler; eşik aşılınca uyar.</div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Loglama &amp; Metrikler</h2>
<p class="l-text">İki tamamlayıcı sinyal:</p>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Yapılandırılmış log</strong><br/>Olay başına JSON satırı. Loki / Elastic / CloudWatch'ta aranabilir.</div><div class="calc-compare-cell"><strong>Metrikler</strong><br/>Prometheus'un topladığı sayaç &amp; gauge. Ucuz, toplanabilir, uyarı dostu.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — prometheus-client + çalışan sunucu ister</span>
<span class="cm"><span class="cm"># from prometheus_client import Counter, Histogram</span>
<span class="cm"><span class="cm"># REQS = Counter("predict_total", "tahminler", ["model_version"])</span>
<span class="cm"><span class="cm"># LATENCY = Histogram("predict_latency_seconds", "gecikme", ["model_version"])</span>
<span class="cm"><span class="cm"># with LATENCY.labels(MODEL_VERSION).time():</span>
<span class="cm"><span class="cm">#     p = model.predict_proba(x)[0, 1]</span>
<span class="cm"><span class="cm"># REQS.labels(MODEL_VERSION).inc()</span></span></code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Yorumlu <code>prometheus_client</code> importları üretim desenini gösterir: <code>Counter</code> istek sayıları için, <code>Histogram</code> latency için, <code>Gauge</code> queue derinliği gibi canlı değerler için. 2) <code>REQ_LATENCY.observe(elapsed)</code>, her predict çağrısında histogramı günceller — Prometheus 15 saniyede bir <code>/metrics</code>'i scrape eder. 3) <code>start_http_server(8001)</code>, metrik uç noktasını yan portta açar — /predict ile çakışmaz. 4) Grafana daha sonra <code>histogram_quantile(0.95, ...)</code>'yi bu metriklere karşı çizer. 5) Yorumlu çünkü <code>prometheus-client</code> burada yok ve scraper da yok; sonraki hücre histogram + counter mantığını stdlib ile yeniden kurar — veri şeklini hissedebilirsiniz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı yüzeyle elden Counter + Histogram — labels, <code>.inc()</code>, <code>.observe()</code> ve <code>time()</code> context manager'ı. Gerçek churn üstünde 200 tahmin enstrümante edip Prometheus tarzı histogram bucket'ları basıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time, json
from contextlib import contextmanager
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

class Counter:
    def __init__(self): self.values = {}
    def labels(self, *l): self.key = l; return self
    def inc(self, n=1): self.values[self.key] = self.values.get(self.key, 0) + n

class Histogram:
    def __init__(self, buckets=(0.001, 0.005, 0.01, 0.05, 0.1, 0.5)):
        self.buckets, self.counts = buckets, [0] * (len(buckets) + 1)
    def observe(self, v):
        for i, b in enumerate(self.buckets):
            if v <= b: self.counts[i] += 1; return
        self.counts[-1] += 1
    @contextmanager
    def time(self):
        t0 = time.time(); yield; self.observe(time.time() - t0)

REQS, LAT = Counter(), Histogram()
df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(random_state=42).fit(Xtr, ytr)
for i in range(min(200, len(Xte))):
    with LAT.time():
        _ = model.predict_proba(Xte.iloc[[i]])[0, 1]
    REQS.labels("v1.2.0").inc()
print("predict_total:", REQS.values)
print("latency_buckets:", dict(zip([f"<= {b}s" for b in LAT.buckets] + ["+Inf"], LAT.counts)))</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>METRICS = {"requests": 0, "latencies": [], "errors": 0}</code> elle yazılmış Prometheus yedeği. 2) <code>@contextmanager</code> <code>track()</code>, bir iş bloğu etrafında wall-clock ölçer ve <code>latencies</code>'e ekler. 3) Simüle edilen istek döngüsü <code>predict</code>'i <code>with track()</code> içinde çalıştırır ve <code>requests</code>'i artırır. 4) <code>except Exception: METRICS["errors"] += 1</code>, üretimdeki hata sayacını yansıtır. 5) Son yüzdelik hesaplaması (<code>np.percentile(latencies, 95)</code>), Prometheus tarafında <code>histogram_quantile</code>'in yaptığının aynısıdır — aynı matematik, sunucu yok.</p>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Akıllı Uyarı</h2>
<p class="l-text">Uyarı hatalarının çoğu <em>gürültüdür</em>. Üç kural:</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Belirti, sebep değil</div><div class="calc-card-body">Kullanıcının gördüğü metrikleri uyarın (gecikme, hata oranı, iş KPI'ı).</div></div>
<div class="calc-card"><div class="calc-card-title">Yanma hızı, eşik değil</div><div class="calc-card-body">"AUC 24 saatte %5 düştü", tek saatlik "AUC &lt; 0.8"den iyidir.</div></div>
<div class="calc-card"><div class="calc-card-title">Şiddet katmanları</div><div class="calc-card-body">Yalnızca SLO ihlalinde çağırın; kalanı ticket.</div></div>
</div>
<div id="mlops-l9-graph-tr" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Tipik bir drift olayı: AUC, kullanıcı şikâyeti gelmeden iki hafta önce bozulur. Drift tespiti (turuncu) genellikle önce yakalar; performans (mavi) etiketler ulaşınca takip eder.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>İki drift: veri (P(X)) etiketsiz ve hızlı tespit; kavram (P(Y|X)) gecikmeli etiket ister.</li>
<li>KL / JS / PSI / Wasserstein drift'i sayısallaştırır. PSI &gt; 0.25 = belirgin, sektörde kullanılır.</li>
<li>Evidently / WhyLabs / Arize panoları sağlar; Prometheus + Grafana tesisatı verir.</li>
<li>Çıkarım + sonucu paylaşılan request id ile loglayın; üretim metriklerini bağlamayla hesaplayın.</li>
<li>Yanma hızı ve kullanıcının gördüğü belirtilere uyarın — her eşiğe değil.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var x = Array.from({length:30}, (_,i) =&gt; "G"+(i+1));
  var auc = x.map((_,i) =&gt; 0.90 - (i&gt;10 ? (i-10)*0.012 : 0) + (Math.random()-0.5)*0.01);
  var psi = x.map((_,i) =&gt; (i&gt;7 ? (i-7)*0.04 : 0.03) + Math.random()*0.02);
  Plotly.newPlot('mlops-l9-graph-tr', [
    {x:x, y:auc, name:'val AUC', mode:'lines+markers', line:{color:'#5aa9ff', width:2}, yaxis:'y'},
    {x:x, y:psi, name:'PSI', mode:'lines+markers', line:{color:accent, width:2}, yaxis:'y2'}
  ], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, title:'30 günde AUC (gecikmeli) vs PSI (öncü)',
    yaxis:{title:'AUC', range:[0.6, 0.95]},
    yaxis2:{title:'PSI', overlaying:'y', side:'right', range:[0, 1.1]},
    margin:{t:60,r:60,b:60,l:60}, legend:{orientation:'h', y:-0.2}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
