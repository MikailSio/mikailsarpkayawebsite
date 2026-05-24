window.MLOPS_L1 = {
en: `<p class="l-text"><strong>The hard truth:</strong> studies (VentureBeat, Gartner) repeatedly find that <em>around 80% of ML projects never reach production</em>. A notebook with 95% accuracy is worthless if no user, no business process, and no API ever calls it. <strong>MLOps</strong> is the engineering discipline that bridges experimentation and reliable, scalable, monitored ML systems running in the real world.</p>
<p class="l-text">In this opening lesson you will learn what MLOps is, how the ML lifecycle differs from classical software, the roles involved, and where most teams sit on the maturity ladder.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why 80% of ML projects fail to reach production</li>
<li>Map the six-stage ML lifecycle from data ingest to retraining</li>
<li>Contrast DevOps and MLOps across versioning, testing, and failure modes</li>
<li>Identify the roles of Data Scientist, ML Engineer, and SRE on a team</li>
<li>Place a team on the Google MLOps maturity ladder (level 0, 1, 2)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why MLOps Exists</h2>
<p class="l-text">Classical software is deterministic: same input, same output. Machine learning is statistical: behavior depends on data, which keeps changing. A model that scored 0.92 AUC last quarter may score 0.78 today because customer behavior, prices, or seasonality shifted. MLOps adds the missing pieces around the model so the system stays healthy.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Reproducibility</div><div class="calc-card-body">Same data + code + seed must produce the same model.</div></div>
<div class="calc-card"><div class="calc-card-title">Automation</div><div class="calc-card-body">Train, test, deploy without manual notebook clicking.</div></div>
<div class="calc-card"><div class="calc-card-title">Monitoring</div><div class="calc-card-body">Detect data and concept drift before users notice.</div></div>
<div class="calc-card"><div class="calc-card-title">Governance</div><div class="calc-card-body">Track who trained what on which data — auditing, GDPR.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The ML Lifecycle</h2>
<p class="l-text">A production ML system is a loop, not a line. Each box below is a stage that can fail and must be observable.</p>
<div class="calc-steps">
<div class="calc-step"><strong>1. Data</strong> — collect, clean, validate, version (DVC, lakehouse).</div>
<div class="calc-step"><strong>2. Train</strong> — feature engineering, model selection, experiment tracking (MLflow, W&amp;B).</div>
<div class="calc-step"><strong>3. Validate</strong> — offline metrics, fairness checks, model cards.</div>
<div class="calc-step"><strong>4. Deploy</strong> — package (Docker), serve (FastAPI, SageMaker), shadow / canary release.</div>
<div class="calc-step"><strong>5. Monitor</strong> — latency, traffic, drift, business KPI.</div>
<div class="calc-step"><strong>6. Retrain</strong> — trigger when drift exceeds threshold, then close the loop.</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DevOps vs MLOps</h2>
<p class="l-text">MLOps borrows from DevOps but adds three big wrinkles: data is part of the artifact, models silently degrade, and retraining is a first-class workflow.</p>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>DevOps</strong><br/>code → build → test → deploy</div><div class="calc-compare-cell"><strong>MLOps</strong><br/>(code + data + config) → train → validate model → deploy → monitor → retrain</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Versioning: code only</div><div class="calc-compare-cell">Versioning: code + data + model + features</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Tests: unit, integration</div><div class="calc-compare-cell">Tests: data schema, distribution, model behavior, fairness</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Failure mode: bug</div><div class="calc-compare-cell">Failure mode: silent quality drop</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Stakeholders</h2>
<p class="l-text">A real MLOps team blends three skill sets. Solo practitioners must wear all three hats.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Data Scientist</div><div class="calc-card-body">Frames the problem, prototypes models, owns offline metrics and feature ideas.</div></div>
<div class="calc-card"><div class="calc-card-title">ML Engineer</div><div class="calc-card-body">Productionizes the model: APIs, pipelines, packaging, versioning, scaling.</div></div>
<div class="calc-card"><div class="calc-card-title">SRE / Platform</div><div class="calc-card-body">Reliability, observability, on-call, infra cost, security.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A Tiny Reproducibility Demo</h2>
<p class="l-text">Even the smallest experiment should be reproducible. Below we train a model on <code>df_churn</code> with a fixed seed and confirm the metric is identical across re-runs — the foundation of every MLOps pipeline.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

SEED = <span class="num">42</span>
np.random.<span class="fn">seed</span>(SEED)

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df[<span class="str">'Churn'</span>] <span class="kw">if</span> <span class="str">'Churn'</span> <span class="kw">in</span> df.columns <span class="kw">else</span> df.iloc[:, -<span class="num">1</span>]
X = df.<span class="fn">drop</span>(columns=[y.name])

Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=SEED)
model = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>, random_state=SEED).<span class="fn">fit</span>(Xtr, ytr)
auc = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"AUC = {auc:.4f}  (seed={SEED})"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> we pin a global seed, drop missing values, split deterministically, train logistic regression with the same seed, and print AUC. Run it twice — the AUC will be byte-identical. Without seed pinning every run gives a slightly different score and you cannot tell whether a code change actually improved the model.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The MLOps Maturity Model</h2>
<p class="l-text">Google and Microsoft both publish a maturity ladder. Knowing your level tells you what to invest in next.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Level 0 — Manual.</strong> Notebooks, hand-trained models, manual deploy. Most companies start here.</div>
<div class="calc-step"><strong>Level 1 — Pipeline automation.</strong> Training is a reproducible pipeline (Airflow, Kubeflow). Retraining is one command.</div>
<div class="calc-step"><strong>Level 2 — CI/CD for ML.</strong> Code commit triggers data validation, training, model tests, automatic deployment with rollback. Drift monitoring closes the loop.</div>
</div>
<div id="mlops-l1-graph-en" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Maturity vs. typical effort distribution. Most real teams sit between Level 0 and Level 1.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>MLOps = the engineering practice that turns notebooks into reliable production systems.</li>
<li>The lifecycle is a <em>loop</em>: data → train → validate → deploy → monitor → retrain.</li>
<li>It extends DevOps with data versioning, model versioning, drift, and retraining.</li>
<li>Three roles: data scientist, ML engineer, SRE / platform.</li>
<li>Maturity climbs from manual notebooks (L0) to fully automated CI/CD with monitoring (L2).</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l1-graph-en', [{
    x: ['Level 0', 'Level 1', 'Level 2'],
    y: [60, 30, 10],
    type: 'bar',
    marker: { color: accent }
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Share of teams at each MLOps maturity level (rough industry estimate)',
    yaxis:{title:'Estimated % of teams'}, margin:{t:60,r:30,b:50,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Acı gerçek:</strong> sektör çalışmaları (VentureBeat, Gartner) defalarca gösteriyor: <em>ML projelerinin yaklaşık %80'i hiçbir zaman üretime ulaşmıyor</em>. %95 doğruluk veren bir notebook, hiçbir kullanıcı ya da iş sürecinin çağırmadığı bir API'ye dönüşmediyse değersizdir. <strong>MLOps</strong>, deney aşamasını güvenilir, ölçeklenebilir ve izlenen üretim sistemlerine bağlayan mühendislik disiplinidir.</p>
<p class="l-text">Bu açılış dersinde MLOps'un ne olduğunu, ML yaşam döngüsünün klasik yazılımdan farkını, rolleri ve olgunluk merdiveninde nerede durduğunuzu öğreneceksiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>ML projelerinin neden %80'inin üretime ulaşamadığını açıklayacaksın</li>
<li>Veri toplamadan yeniden eğitime altı aşamalı ML yaşam döngüsünü çıkaracaksın</li>
<li>DevOps ile MLOps'u versiyonlama, test ve hata modları açısından karşılaştıracaksın</li>
<li>Data Scientist, ML Engineer ve SRE rollerinin sorumluluklarını ayırt edeceksin</li>
<li>Bir ekibi Google MLOps olgunluk merdivenine yerleştireceksin (seviye 0, 1, 2)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. MLOps Neden Var?</h2>
<p class="l-text">Klasik yazılım deterministiktir: aynı girdi, aynı çıktı. Makine öğrenmesi istatistikseldir: davranış sürekli değişen veriye bağlıdır. Geçen çeyrek 0.92 AUC veren bir model bu çeyrek 0.78'e düşebilir; çünkü müşteri davranışı, fiyatlar ya da mevsimsellik değişti. MLOps, modelin etrafındaki eksik parçaları ekleyerek sistemi sağlıklı tutar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Tekrarlanabilirlik</div><div class="calc-card-body">Aynı veri + kod + seed her zaman aynı modeli vermeli.</div></div>
<div class="calc-card"><div class="calc-card-title">Otomasyon</div><div class="calc-card-body">Eğitim, test, dağıtım — manuel notebook tıklaması olmadan.</div></div>
<div class="calc-card"><div class="calc-card-title">İzleme</div><div class="calc-card-body">Veri ve kavram kayması (drift) kullanıcı fark etmeden tespit edilmeli.</div></div>
<div class="calc-card"><div class="calc-card-title">Yönetişim</div><div class="calc-card-body">Kim, hangi veriyle ne eğitti — denetim, KVKK, GDPR.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ML Yaşam Döngüsü</h2>
<p class="l-text">Üretimdeki bir ML sistemi düz bir çizgi değil, döngüdür. Aşağıdaki her kutu hata verebilir ve gözlemlenebilir olmak zorundadır.</p>
<div class="calc-steps">
<div class="calc-step"><strong>1. Veri</strong> — toplama, temizleme, doğrulama, sürümleme (DVC, veri gölü).</div>
<div class="calc-step"><strong>2. Eğitim</strong> — öznitelik mühendisliği, model seçimi, deney takibi (MLflow, W&amp;B).</div>
<div class="calc-step"><strong>3. Doğrulama</strong> — offline metrikler, adillik kontrolleri, model kartı.</div>
<div class="calc-step"><strong>4. Dağıtım</strong> — paketleme (Docker), servis etme (FastAPI, SageMaker), gölge / kanarya yayını.</div>
<div class="calc-step"><strong>5. İzleme</strong> — gecikme, trafik, drift, iş KPI'ı.</div>
<div class="calc-step"><strong>6. Yeniden eğitim</strong> — drift eşiği aşılınca tetiklenir; döngü kapanır.</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DevOps vs MLOps</h2>
<p class="l-text">MLOps DevOps'tan beslenir ama üç büyük farkı vardır: veri de bir artefakttır, modeller sessizce bozulur ve yeniden eğitim birinci sınıf bir iş akışıdır.</p>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>DevOps</strong><br/>kod → build → test → deploy</div><div class="calc-compare-cell"><strong>MLOps</strong><br/>(kod + veri + config) → eğit → modeli doğrula → dağıt → izle → yeniden eğit</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Sürümleme: yalnızca kod</div><div class="calc-compare-cell">Sürümleme: kod + veri + model + öznitelik</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Test: birim, entegrasyon</div><div class="calc-compare-cell">Test: veri şeması, dağılım, model davranışı, adillik</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Hata türü: bug</div><div class="calc-compare-cell">Hata türü: sessiz kalite düşüşü</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Paydaşlar</h2>
<p class="l-text">Gerçek bir MLOps ekibi üç yetkinliği harmanlar. Tek başına çalışan biri üçünü de giyinmek zorundadır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Veri Bilimci</div><div class="calc-card-body">Problemi çerçeveler, prototip model üretir, offline metrik ve öznitelik fikirlerinin sahibidir.</div></div>
<div class="calc-card"><div class="calc-card-title">ML Mühendisi</div><div class="calc-card-body">Modeli üretime taşır: API, pipeline, paketleme, sürümleme, ölçekleme.</div></div>
<div class="calc-card"><div class="calc-card-title">SRE / Platform</div><div class="calc-card-body">Güvenilirlik, gözlemlenebilirlik, nöbet, altyapı maliyeti, güvenlik.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Küçük Bir Tekrarlanabilirlik Demosu</h2>
<p class="l-text">En küçük deney bile tekrarlanabilir olmalı. Aşağıda <code>df_churn</code> üzerinde sabit seed ile bir model eğitiyor ve metriğin tekrar çalıştırmalarda <em>aynı</em> kaldığını doğruluyoruz — her MLOps pipeline'ının temeli.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

SEED = <span class="num">42</span>
np.random.<span class="fn">seed</span>(SEED)

df = df_churn.<span class="fn">dropna</span>().<span class="fn">select_dtypes</span>(include=<span class="str">'number'</span>)
y = df[<span class="str">'Churn'</span>] <span class="kw">if</span> <span class="str">'Churn'</span> <span class="kw">in</span> df.columns <span class="kw">else</span> df.iloc[:, -<span class="num">1</span>]
X = df.<span class="fn">drop</span>(columns=[y.name])

Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=SEED)
model = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>, random_state=SEED).<span class="fn">fit</span>(Xtr, ytr)
auc = <span class="fn">roc_auc_score</span>(yte, model.<span class="fn">predict_proba</span>(Xte)[:, <span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"AUC = {auc:.4f}  (seed={SEED})"</span>)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> global bir seed sabitleriz, eksikleri atarız, deterministik bölme yaparız, aynı seed ile lojistik regresyon eğitiriz ve AUC'yi yazdırırız. İki kez çalıştırın — AUC bit düzeyinde aynı olacak. Seed sabitlemezsek her çalıştırma biraz farklı skor verir ve bir kod değişikliği modeli gerçekten iyileştirdi mi anlayamayız.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. MLOps Olgunluk Modeli</h2>
<p class="l-text">Hem Google hem Microsoft olgunluk merdiveni yayımlıyor. Hangi seviyede olduğunuzu bilmek bir sonraki yatırımı belirler.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Seviye 0 — Manuel.</strong> Notebook, elle eğitilmiş model, elle deploy. Çoğu şirket buradan başlar.</div>
<div class="calc-step"><strong>Seviye 1 — Pipeline otomasyonu.</strong> Eğitim tekrarlanabilir bir pipeline (Airflow, Kubeflow). Yeniden eğitim tek komut.</div>
<div class="calc-step"><strong>Seviye 2 — ML için CI/CD.</strong> Kod commit'i veri doğrulama, eğitim, model testi, otomatik dağıtım ve geri alma tetikler. Drift izleme döngüyü kapatır.</div>
</div>
<div id="mlops-l1-graph-tr" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Olgunluk seviyesine göre tipik ekip dağılımı. Çoğu ekip Seviye 0 ile Seviye 1 arasındadır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>MLOps = notebook'ları güvenilir üretim sistemlerine dönüştüren mühendislik pratiği.</li>
<li>Yaşam döngüsü bir <em>döngüdür</em>: veri → eğitim → doğrulama → dağıtım → izleme → yeniden eğitim.</li>
<li>DevOps'u veri sürümleme, model sürümleme, drift ve yeniden eğitim ile genişletir.</li>
<li>Üç rol: veri bilimci, ML mühendisi, SRE / platform.</li>
<li>Olgunluk; manuel notebook'lardan (L0) tam otomatik CI/CD + izleme'ye (L2) çıkar.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l1-graph-tr', [{
    x: ['Seviye 0', 'Seviye 1', 'Seviye 2'],
    y: [60, 30, 10],
    type: 'bar',
    marker: { color: accent }
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Her olgunluk seviyesindeki ekip oranı (sektör tahmini)',
    yaxis:{title:'Tahmini ekip yüzdesi'}, margin:{t:60,r:30,b:50,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
