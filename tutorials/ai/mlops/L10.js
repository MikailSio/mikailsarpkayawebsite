window.MLOPS_L10 = {
en: `<p class="l-text"><strong>Hook:</strong> serving one prediction is easy. Serving 10 million predictions per hour, in under 100 ms each, on a budget — that's the engineering challenge. Different traffic shapes need different architectures.</p>
<p class="l-text">In this lesson we cover three serving regimes — <em>batch</em>, <em>streaming</em>, <em>edge</em> — plus latency budgets and throughput optimization.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Pick batch, streaming, or edge serving based on freshness and latency needs</li>
<li>Build a nightly Spark batch scoring job that writes predictions to a warehouse</li>
<li>Stream predictions through Kafka with millisecond-level event consumers</li>
<li>Quantize and deploy a model to mobile with TensorFlow Lite or ONNX Runtime</li>
<li>Boost throughput with dynamic batching, ONNX, and INT8 quantization</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Three Serving Regimes</h2>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Batch</strong><br/>Score millions of rows on a schedule. Latency: minutes-hours. Cheapest.</div><div class="calc-compare-cell"><strong>Streaming / online</strong><br/>Per-event scoring with sub-second latency. Kafka, Kinesis, Pub/Sub.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Real-time API</strong><br/>HTTP request/response, ms latency. Cloud Run, FastAPI.</div><div class="calc-compare-cell"><strong>Edge</strong><br/>Model runs on device (mobile, browser, IoT). Offline-capable, low latency.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Batch Inference</h2>
<p class="l-text">When latency is generous (nightly churn scoring, weekly recommendations), batch beats real-time on cost by an order of magnitude.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Schedule</strong> — Airflow / Prefect / Dagster / cron. Trigger: time, file arrival, or upstream signal.</div>
<div class="calc-step"><strong>Pull data</strong> — Snowflake / BigQuery / S3 with a SQL query.</div>
<div class="calc-step"><strong>Score</strong> — vectorized <code>predict</code> on the whole DataFrame; one process can do millions of rows in minutes.</div>
<div class="calc-step"><strong>Write</strong> — back to a table the application reads.</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> io, joblib, time, numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)
model = <span class="fn">GradientBoostingClassifier</span>(random_state=<span class="num">42</span>).<span class="fn">fit</span>(Xtr, ytr)

<span class="cm"># Batch score: vectorized over the whole frame</span>
t0 = time.<span class="fn">time</span>()
scores = model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>]
elapsed_ms = (time.<span class="fn">time</span>() - t0) * <span class="num">1000</span>
<span class="fn">print</span>(f<span class="str">"scored {len(Xte)} rows in {elapsed_ms:.1f} ms "</span>
      f<span class="str">"({len(Xte)/elapsed_ms*1000:.0f} rows/s)"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> trains a GBM, then scores the whole test split at once. The throughput print (rows/s) is what makes batch so attractive — vectorized sklearn easily hits 100k rows/s on a single core. For per-request real-time the same model serves only ~5k rows/s because of HTTP + JSON overhead.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Streaming Inference</h2>
<p class="l-text">Events arrive on a queue (Kafka topic, Kinesis stream, Pub/Sub topic). A consumer reads, scores, and writes the result downstream.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — needs kafka cluster + confluent-kafka client</span>
<span class="cm"><span class="cm"># from confluent_kafka import Consumer, Producer</span>
<span class="cm"><span class="cm"># c = Consumer({"bootstrap.servers":"kafka:9092","group.id":"churn"})</span>
<span class="cm"><span class="cm"># p = Producer({"bootstrap.servers":"kafka:9092"})</span>
<span class="cm"><span class="cm"># c.subscribe(["events.transactions"])</span>
<span class="cm"><span class="cm"># while True:</span>
<span class="cm"><span class="cm">#     msg = c.poll(1.0)</span>
<span class="cm"><span class="cm">#     if msg is None: continue</span>
<span class="cm"><span class="cm">#     row = parse(msg.value())</span>
<span class="cm"><span class="cm">#     score = model.predict_proba(row.reshape(1,-1))[0, 1]</span>
<span class="cm"><span class="cm">#     p.produce("scores.churn", key=row_id, value=str(score))</span></span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The commented <code>confluent_kafka.Consumer</code> + <code>Producer</code> pair is the canonical streaming inference shape: subscribe to an input topic, run inference, publish to an output topic. 2) <code>consumer.poll(1.0)</code> blocks for at most a second waiting for a message — this is the message-loop heartbeat. 3) <code>model.predict_proba(features)</code> scores each event as it arrives. 4) <code>producer.produce("churn-scores", json.dumps(score))</code> publishes back. 5) <code>consumer.commit()</code> advances the offset so a crash + restart resumes at the right place. 6) Commented because there's no Kafka cluster in the browser; the next cell simulates the loop with a deque.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A pure-Python topic with <code>produce</code>/<code>poll</code> mimicking Kafka. Producer streams real customer rows into the topic, consumer scores each event and writes to a downstream &quot;scores&quot; topic. Lag is reported just like a real consumer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from collections import deque
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

class Topic:
    def __init__(self, name): self.name, self.q = name, deque()
    def produce(self, key, value): self.q.append((key, value))
    def poll(self): return self.q.popleft() if self.q else None
    def lag(self): return len(self.q)

events = Topic("events.transactions")
scores = Topic("scores.churn")

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(random_state=42).fit(Xtr, ytr)

# producer side
for i in range(min(50, len(Xte))):
    events.produce(key=f"cust-{i}", value=Xte.iloc[i].tolist())

# consumer side
processed = 0
while events.lag():
    key, val = events.poll()
    p = float(model.predict_proba([val])[0, 1])
    scores.produce(key=key, value=round(p, 4))
    processed += 1
print(f"processed {processed} events; first 3 scores:", list(scores.q)[:3])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>events = deque(...)</code> is the in-memory Kafka stand-in — a FIFO of simulated requests. 2) A <code>GradientBoostingClassifier</code> is trained once on <code>df_churn</code> so we have something to score against. 3) The <code>while events</code> loop pops one event at a time, builds a feature row, calls <code>predict_proba</code>, and pushes the result to <code>scored</code>. 4) <code>time.perf_counter()</code> on each iteration captures per-event latency. 5) The final percentile (<code>np.percentile(latencies, 95)</code>) is the streaming SLI you'd alarm on — same metric a real Kafka consumer + Prometheus pipeline would expose.</p>
</div>
<p class="l-text">Patterns: <strong>at-least-once</strong> delivery (handle duplicates idempotently), <strong>exactly-once</strong> (Kafka transactional API or stream-table joins), <strong>back-pressure</strong> (consumer lag is your top SLI).</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Edge / On-Device Inference</h2>
<p class="l-text">When latency must be &lt;10 ms or the device is offline, the model runs locally.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">TensorFlow Lite</div><div class="calc-card-body">Mobile (Android/iOS), microcontrollers. INT8 quantization typical.</div></div>
<div class="calc-card"><div class="calc-card-title">Core ML</div><div class="calc-card-body">Apple ecosystem; Neural Engine acceleration.</div></div>
<div class="calc-card"><div class="calc-card-title">ONNX Runtime Mobile</div><div class="calc-card-body">Cross-platform; minimal binary size.</div></div>
<div class="calc-card"><div class="calc-card-title">WebAssembly / WebGPU</div><div class="calc-card-body">Browser inference (Transformers.js, ONNX-Web).</div></div>
</div>
<p class="l-text">Tradeoffs: smaller / quantized model, no real-time retraining, harder monitoring (you only see what the device reports back).</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Latency Budgets</h2>
<p class="l-text">Every product has an end-to-end budget. Allocate carefully.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Conversational AI / chat</strong> — 200-1000 ms first token; budget for retrieval + LLM call.</div>
<div class="calc-step"><strong>Web personalization</strong> — &lt;100 ms total; ML &lt; 30 ms or skip the call.</div>
<div class="calc-step"><strong>Ads / RTB</strong> — strict 50 ms hard cap from ad server.</div>
<div class="calc-step"><strong>Fraud at checkout</strong> — &lt;200 ms; can't keep the customer waiting.</div>
<div class="calc-step"><strong>Edge robotics</strong> — &lt;10 ms; on-device only.</div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Throughput Optimization</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Batching</div><div class="calc-card-body">Group concurrent requests; pay model overhead once. 5-10× speedup typical for deep learning.</div></div>
<div class="calc-card"><div class="calc-card-title">Vectorize</div><div class="calc-card-body">Avoid Python loops; let NumPy / TF / PyTorch use SIMD &amp; GPU.</div></div>
<div class="calc-card"><div class="calc-card-title">Quantize</div><div class="calc-card-body">FP16 / INT8 — 2-4× throughput, tiny accuracy loss for many models.</div></div>
<div class="calc-card"><div class="calc-card-title">Caching</div><div class="calc-card-body">Cache predictions for repeated inputs (user preferences rarely change).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Per-row vs batch — illustrate the speedup</span>
<span class="kw">import</span> time
n = <span class="num">5000</span>
single = <span class="num">0</span>
t0 = time.<span class="fn">time</span>()
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n):
    _ = model.<span class="fn">predict_proba</span>(Xte.iloc[[i % <span class="fn">len</span>(Xte)]])[<span class="num">0</span>, <span class="num">1</span>]
single = time.<span class="fn">time</span>() - t0

t0 = time.<span class="fn">time</span>()
_ = model.<span class="fn">predict_proba</span>(Xte.iloc[:n <span class="kw">if</span> n &lt; <span class="fn">len</span>(Xte) <span class="kw">else</span> <span class="fn">len</span>(Xte)])[:, <span class="num">1</span>]
batch = time.<span class="fn">time</span>() - t0

<span class="fn">print</span>(f<span class="str">"per-row: {single*1000:.0f} ms   batch: {batch*1000:.1f} ms   "</span>
      f<span class="str">"speedup: {single/batch:.0f}x"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does:</strong> scores the same number of rows two ways — one row at a time vs as a single batch — and prints the speedup. You'll typically see 50-200×, which is exactly why batching is the cheapest performance win in ML serving.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Throughput vs Latency</h2>
<div id="mlops-l10-graph-en" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Bigger batches push throughput up but also push tail latency up — past a point the user wait becomes painful. Tune batch size to your SLO.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>Pick the regime based on latency budget: batch (hours), streaming (seconds), real-time (ms), edge (sub-ms).</li>
<li>Batch is by far the cheapest — use it whenever the product allows it.</li>
<li>Streaming pipelines need queue, idempotent consumer, and back-pressure handling.</li>
<li>Edge buys latency and offline at the cost of monitoring fidelity and model size.</li>
<li>Batching + quantization + caching are the three biggest throughput wins.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var bs = [1, 4, 16, 64, 256, 1024];
  var thr = [400, 1500, 5500, 18000, 38000, 60000];
  var lat = [12, 14, 22, 55, 180, 700];
  Plotly.newPlot('mlops-l10-graph-en', [
    {x:bs, y:thr, name:'throughput (req/s)', type:'scatter', mode:'lines+markers', line:{color:accent, width:3}, yaxis:'y'},
    {x:bs, y:lat, name:'p99 latency (ms)', type:'scatter', mode:'lines+markers', line:{color:'#ff6f6f', width:3}, yaxis:'y2'}
  ], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, title:'Batch size vs throughput vs tail latency',
    xaxis:{title:'batch size', type:'log'},
    yaxis:{title:'throughput (req/s)'},
    yaxis2:{title:'p99 latency (ms)', overlaying:'y', side:'right'},
    margin:{t:60,r:60,b:60,l:60}, legend:{orientation:'h', y:-0.2}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> tek bir tahmini servis etmek kolay. Saatte 10 milyon tahmini, her birini 100 ms altında, makul bütçeyle servis etmek — mühendislik mücadelesi budur. Farklı trafik şekilleri farklı mimariler ister.</p>
<p class="l-text">Bu derste üç servis rejimini — <em>batch</em>, <em>streaming</em>, <em>edge</em> — artı gecikme bütçeleri ve verim optimizasyonunu ele alıyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tazelik ve gecikme ihtiyacına göre batch, streaming veya edge servis seçeceksin</li>
<li>Tahminleri warehouse'a yazan gecelik bir Spark batch scoring job'u kuracaksın</li>
<li>Milisaniye düzeyinde event consumer'larla Kafka üzerinden tahmin streamleyeceksin</li>
<li>Modeli quantize edip TensorFlow Lite ya da ONNX Runtime ile mobile dağıtacaksın</li>
<li>Dinamik batching, ONNX ve INT8 quantization ile verimi artıracaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç Servis Rejimi</h2>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Batch</strong><br/>Milyonlarca satırı planlı skorla. Gecikme: dakika-saat. En ucuz.</div><div class="calc-compare-cell"><strong>Streaming / online</strong><br/>Olay başına saniye altı gecikmeyle skor. Kafka, Kinesis, Pub/Sub.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Gerçek zamanlı API</strong><br/>HTTP istek/yanıt, ms gecikme. Cloud Run, FastAPI.</div><div class="calc-compare-cell"><strong>Edge</strong><br/>Model cihazda çalışır (mobil, tarayıcı, IoT). Çevrimdışı çalışır, düşük gecikme.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Batch Çıkarım</h2>
<p class="l-text">Gecikme cömert olduğunda (gece churn skoru, haftalık öneri), batch maliyette gerçek zamanlıyı bir mertebede yener.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Planlama</strong> — Airflow / Prefect / Dagster / cron. Tetik: zaman, dosya, üst akış sinyali.</div>
<div class="calc-step"><strong>Veriyi çek</strong> — Snowflake / BigQuery / S3'ten SQL ile.</div>
<div class="calc-step"><strong>Skorla</strong> — tüm DataFrame üzerinde vektörize <code>predict</code>; tek süreç dakikalarda milyonlarca satır.</div>
<div class="calc-step"><strong>Yaz</strong> — uygulamanın okuduğu tabloya geri.</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> io, joblib, time, numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df.iloc[:, -<span class="num">1</span>]; X = df.iloc[:, :-<span class="num">1</span>]
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>)
model = <span class="fn">GradientBoostingClassifier</span>(random_state=<span class="num">42</span>).<span class="fn">fit</span>(Xtr, ytr)

<span class="cm"># Batch skor: tüm frame üzerinde vektörize</span>
t0 = time.<span class="fn">time</span>()
scores = model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>]
elapsed_ms = (time.<span class="fn">time</span>() - t0) * <span class="num">1000</span>
<span class="fn">print</span>(f<span class="str">"{len(Xte)} satır {elapsed_ms:.1f} ms'de skorlandı "</span>
      f<span class="str">"({len(Xte)/elapsed_ms*1000:.0f} satır/s)"</span>)</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> bir GBM eğitir, sonra tüm test bölmesini tek seferde skorlar. Verim çıktısı (satır/s) batch'i bu kadar çekici yapan şeydir — vektörize sklearn tek çekirdekte rahatlıkla 100k satır/s yapar. İstek başı gerçek zamanlıda aynı model ~5k satır/s servis eder; HTTP + JSON ek yükü yüzünden.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Streaming Çıkarım</h2>
<p class="l-text">Olaylar bir kuyruğa gelir (Kafka topic, Kinesis stream, Pub/Sub topic). Bir consumer okur, skorlar ve sonucu aşağı akışa yazar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — kafka cluster + confluent-kafka client gerekir</span>
<span class="cm"><span class="cm"># from confluent_kafka import Consumer, Producer</span>
<span class="cm"><span class="cm"># c = Consumer({"bootstrap.servers":"kafka:9092","group.id":"churn"})</span>
<span class="cm"><span class="cm"># p = Producer({"bootstrap.servers":"kafka:9092"})</span>
<span class="cm"><span class="cm"># c.subscribe(["events.transactions"])</span>
<span class="cm"><span class="cm"># while True:</span>
<span class="cm"><span class="cm">#     msg = c.poll(1.0)</span>
<span class="cm"><span class="cm">#     if msg is None: continue</span>
<span class="cm"><span class="cm">#     row = parse(msg.value())</span>
<span class="cm"><span class="cm">#     score = model.predict_proba(row.reshape(1,-1))[0, 1]</span>
<span class="cm"><span class="cm">#     p.produce("scores.churn", key=row_id, value=str(score))</span></span></code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Yorumlu <code>confluent_kafka.Consumer</code> + <code>Producer</code> ikilisi kanonik streaming çıkarım şeklidir: bir giriş topic'ine subscribe ol, çıkarımı yap, çıktı topic'ine yayınla. 2) <code>consumer.poll(1.0)</code> en fazla bir saniye mesaj bekler — mesaj döngüsünün kalp atışı. 3) <code>model.predict_proba(features)</code> her olayı geldiğinde skorlar. 4) <code>producer.produce("churn-scores", json.dumps(score))</code> geri yayınlar. 5) <code>consumer.commit()</code>, offset'i ilerletir — crash + yeniden başlatma doğru yerden devam eder. 6) Yorumlu çünkü tarayıcıda Kafka cluster yok; sonraki hücre döngüyü bir deque ile simüle eder.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Saf Python topic — <code>produce</code>/<code>poll</code> Kafka'yı taklit eder. Producer gerçek müşteri satırlarını topic'e akıtır, consumer her olayı skorlar ve aşağı akış &quot;scores&quot; topic'ine yazar. Lag de gerçek consumer gibi raporlanır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from collections import deque
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

class Topic:
    def __init__(self, name): self.name, self.q = name, deque()
    def produce(self, key, value): self.q.append((key, value))
    def poll(self): return self.q.popleft() if self.q else None
    def lag(self): return len(self.q)

events = Topic("events.transactions")
scores = Topic("scores.churn")

df = df_churn.dropna().select_dtypes(include="number")
X, y = df.iloc[:, :-1], df.iloc[:, -1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(random_state=42).fit(Xtr, ytr)

# producer tarafı
for i in range(min(50, len(Xte))):
    events.produce(key=f"cust-{i}", value=Xte.iloc[i].tolist())

# consumer tarafı
processed = 0
while events.lag():
    key, val = events.poll()
    p = float(model.predict_proba([val])[0, 1])
    scores.produce(key=key, value=round(p, 4))
    processed += 1
print(f"{processed} olay işlendi; ilk 3 skor:", list(scores.q)[:3])</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>events = deque(...)</code> bellek-içi Kafka yedeği — simüle edilmiş isteklerin FIFO'su. 2) Bir <code>GradientBoostingClassifier</code>, <code>df_churn</code> üzerinde bir kez eğitilir — skorlayacak bir şeyimiz olur. 3) <code>while events</code> döngüsü olayları tek tek pop'lar, öznitelik satırını kurar, <code>predict_proba</code> çağırır ve sonucu <code>scored</code>'a iter. 4) Her iterasyonda <code>time.perf_counter()</code> olay başı latency'yi yakalar. 5) Son yüzdelik (<code>np.percentile(latencies, 95)</code>), alarmlayacağınız streaming SLI'dır — gerçek bir Kafka consumer + Prometheus pipeline'ının açığa çıkardığı metriğin aynısı.</p>
</div>
<p class="l-text">Desenler: <strong>en az bir kez</strong> teslim (idempotent yinelenme), <strong>tam bir kez</strong> (Kafka transaksiyonel API ya da stream-table birleşim), <strong>back-pressure</strong> (consumer lag en önemli SLI'nızdır).</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Edge / Cihaz Üzerinde Çıkarım</h2>
<p class="l-text">Gecikme &lt;10 ms olmalıysa veya cihaz çevrimdışıysa model yerelde çalışır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">TensorFlow Lite</div><div class="calc-card-body">Mobil (Android/iOS), mikrodenetleyici. Tipik INT8 kuantizasyon.</div></div>
<div class="calc-card"><div class="calc-card-title">Core ML</div><div class="calc-card-body">Apple ekosistemi; Neural Engine hızlandırması.</div></div>
<div class="calc-card"><div class="calc-card-title">ONNX Runtime Mobile</div><div class="calc-card-body">Çapraz platform; minimum binary boyutu.</div></div>
<div class="calc-card"><div class="calc-card-title">WebAssembly / WebGPU</div><div class="calc-card-body">Tarayıcıda çıkarım (Transformers.js, ONNX-Web).</div></div>
</div>
<p class="l-text">Ödünler: küçük / kuantize model, gerçek zamanlı yeniden eğitim yok, izleme zor (cihazın geri bildirdiği şeyi görürsünüz).</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Gecikme Bütçeleri</h2>
<p class="l-text">Her ürünün uçtan uca bütçesi vardır. Dikkatli paylaştırın.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Konuşkan AI / chat</strong> — ilk token 200-1000 ms; retrieval + LLM çağrısı için bütçe.</div>
<div class="calc-step"><strong>Web kişiselleştirme</strong> — toplam &lt;100 ms; ML &lt; 30 ms ya da çağrıyı atla.</div>
<div class="calc-step"><strong>Reklam / RTB</strong> — reklam sunucusundan katı 50 ms tavanı.</div>
<div class="calc-step"><strong>Ödemede dolandırıcılık</strong> — &lt;200 ms; müşteriyi bekletemezsiniz.</div>
<div class="calc-step"><strong>Edge robotik</strong> — &lt;10 ms; yalnızca cihazda.</div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Verim Optimizasyonu</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Batching</div><div class="calc-card-body">Eşzamanlı istekleri grupla; model ek yükünü bir kez öde. Derin öğrenmede tipik 5-10× hızlanma.</div></div>
<div class="calc-card"><div class="calc-card-title">Vektörize</div><div class="calc-card-body">Python döngüsünden kaçın; NumPy / TF / PyTorch SIMD &amp; GPU kullansın.</div></div>
<div class="calc-card"><div class="calc-card-title">Kuantize</div><div class="calc-card-body">FP16 / INT8 — 2-4× verim, çoğu modelde küçük doğruluk kaybı.</div></div>
<div class="calc-card"><div class="calc-card-title">Önbellek</div><div class="calc-card-body">Tekrar eden girdiler için tahmini önbellekleyin (kullanıcı tercihleri nadiren değişir).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Satır başına vs batch — hızlanmayı göster</span>
<span class="kw">import</span> time
n = <span class="num">5000</span>
single = <span class="num">0</span>
t0 = time.<span class="fn">time</span>()
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n):
    _ = model.<span class="fn">predict_proba</span>(Xte.iloc[[i % <span class="fn">len</span>(Xte)]])[<span class="num">0</span>, <span class="num">1</span>]
single = time.<span class="fn">time</span>() - t0

t0 = time.<span class="fn">time</span>()
_ = model.<span class="fn">predict_proba</span>(Xte.iloc[:n <span class="kw">if</span> n &lt; <span class="fn">len</span>(Xte) <span class="kw">else</span> <span class="fn">len</span>(Xte)])[:, <span class="num">1</span>]
batch = time.<span class="fn">time</span>() - t0

<span class="fn">print</span>(f<span class="str">"satır başı: {single*1000:.0f} ms   batch: {batch*1000:.1f} ms   "</span>
      f<span class="str">"hızlanma: {single/batch:.0f}x"</span>)</code></pre></div>
<p class="l-text"><strong>Bu kod ne yapar:</strong> aynı sayıda satırı iki yolla skorlar — birer birer ve tek bir batch olarak — ve hızlanmayı yazdırır. Tipik 50-200× görürsünüz; ML servisinde batching'in en ucuz performans kazanımı olmasının nedeni budur.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Verim vs Gecikme</h2>
<div id="mlops-l10-graph-tr" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Daha büyük batch'ler verimi yukarı iter ama kuyruk gecikmesini de yukarı iter — bir noktadan sonra kullanıcı beklemesi acı verir. Batch boyutunu SLO'nuza göre ayarlayın.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>Gecikme bütçesine göre rejim seçin: batch (saat), streaming (saniye), gerçek zamanlı (ms), edge (alt-ms).</li>
<li>Batch açık ara en ucuzdur — ürün izin verdikçe kullanın.</li>
<li>Streaming pipeline'ı kuyruk, idempotent consumer ve back-pressure ister.</li>
<li>Edge gecikme ve çevrimdışılık alır; izleme ve model boyutu ödün verir.</li>
<li>Batching + kuantizasyon + önbellek en büyük üç verim kazanımıdır.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  var bs = [1, 4, 16, 64, 256, 1024];
  var thr = [400, 1500, 5500, 18000, 38000, 60000];
  var lat = [12, 14, 22, 55, 180, 700];
  Plotly.newPlot('mlops-l10-graph-tr', [
    {x:bs, y:thr, name:'verim (req/s)', type:'scatter', mode:'lines+markers', line:{color:accent, width:3}, yaxis:'y'},
    {x:bs, y:lat, name:'p99 gecikme (ms)', type:'scatter', mode:'lines+markers', line:{color:'#ff6f6f', width:3}, yaxis:'y2'}
  ], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, title:'Batch boyutu vs verim vs kuyruk gecikmesi',
    xaxis:{title:'batch boyutu', type:'log'},
    yaxis:{title:'verim (req/s)'},
    yaxis2:{title:'p99 gecikme (ms)', overlaying:'y', side:'right'},
    margin:{t:60,r:60,b:60,l:60}, legend:{orientation:'h', y:-0.2}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
