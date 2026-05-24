window.RECSYS_L3 = {

en: `<p class="l-text"><strong>You almost never rate a YouTube video. You watch it. You skip it. You scroll past. The signal is binary, biased, and present at massive scale — exactly the opposite of the 1-to-5 stars MF assumed.</strong> The recsys community had to rethink the loss function from scratch. The result was a family of <em>implicit feedback</em> models: BPR, WARP, weighted ALS — all variants of "rank what the user touched above what they did not".</p>
<p class="l-text">Today you will derive the BPR objective from Rendle's 2009 paper, learn why the WARP loss converges faster on long-tail catalogs, build a weighted-ALS variant in numpy, and train a tiny BPR model on the orders dataset by sampling (user, positive, negative) triples.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why explicit-feedback losses fail on clicks, watches, and purchases</li>
<li>Derive Bayesian Personalized Ranking (Rendle 2009) from the AUC objective</li>
<li>Sample (user, positive, negative) triples efficiently from a sparse interaction matrix</li>
<li>Compare WARP vs BPR vs weighted-ALS and know when each wins</li>
<li>Implement BPR-MF in numpy and watch the loss go down on real data</li>
<li>Recognize the signature of a good implicit recommender vs a degenerate one</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Explicit Losses Break</h2>
<p class="l-text">If you train MF on a 0/1 click matrix and treat zeros as "rating 0", you tell the model the user actively dislikes every item they have not seen. That is wrong. They probably never even saw it. Implicit feedback is <em>missing-not-at-random</em> and we need a loss that models <em>preference between items</em>, not absolute scores.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Explicit</div><div class="card-body">Stars or thumbs. Reliable signal but very rare. RMSE-style losses work.</div></div>
<div class="calc-card"><div class="card-title">Implicit positives</div><div class="card-body">Clicks, watches, purchases. Strong evidence of interest.</div></div>
<div class="calc-card"><div class="card-title">Implicit negatives?</div><div class="card-body">Absence of click is ambiguous: did they skip on purpose, or never see it?</div></div>
<div class="calc-card"><div class="card-title">Solution</div><div class="card-body">Pairwise ranking: positive item should score higher than a sampled unobserved item.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bayesian Personalized Ranking (BPR)</h2>
<p class="l-text">Rendle, Freudenthaler, Gantner, Schmidt-Thieme (2009) proposed BPR. For every triple (user u, observed item i, unobserved item j), maximize the probability that the model scores i above j. With latent factors and the standard logistic link this becomes:</p>
<div class="katex-block">$$\\mathcal{L}_{\\text{BPR}} = -\\sum_{(u, i, j)} \\log \\sigma(\\hat{r}_{ui} - \\hat{r}_{uj}) + \\lambda \\|\\Theta\\|^2$$</div>
<p class="l-text">where \\(\\hat{r}_{ui} = u^T v_i\\) and \\(\\sigma\\) is the sigmoid. The gradient updates push the positive item up and the sampled negative item down. This loss is a smooth surrogate for AUC.</p>
<div class="calc-highlight">BPR optimizes ranking directly. You will see it again in deep recsys (Two-Tower, NCF) where the same triplet idea is just wrapped in a neural network.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. WARP: Weighted Approximate-Rank Pairwise</h2>
<p class="l-text">BPR samples one negative uniformly. On long-tail catalogs that negative is usually trivially easier to rank than the positive, so the gradient is tiny. WARP (Weston, Bengio, Usunier 2010) keeps sampling negatives until it finds a <em>violating</em> one — an item the model currently ranks above the positive — and weights the update by an estimate of the violator's rank.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BPR</div><div class="card-body">One uniform negative per step. Cheap, simple, plateaus on long-tail data.</div></div>
<div class="calc-card"><div class="card-title">WARP</div><div class="card-body">Adaptive sampling — keeps drawing until violating, then big update. Strong top-K performance.</div></div>
<div class="calc-card"><div class="card-title">Weighted-ALS</div><div class="card-body">Hu, Koren, Volinsky 2008. Treats every cell as observed but with confidence weights. Closed-form ALS step.</div></div>
<div class="calc-card"><div class="card-title">Sampled softmax</div><div class="card-body">Modern variant used in Two-Tower (next lesson). Treats other items in batch as negatives.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Weighted ALS (Hu, Koren, Volinsky 2008)</h2>
<p class="l-text">Instead of treating zeros as missing, weighted ALS treats them as low-confidence zeros. Every cell has a confidence \\(c_{ui} = 1 + \\alpha \\cdot p_{ui}\\) where \\(p_{ui}\\) is the play count. Then ALS minimizes:</p>
<div class="katex-block">$$\\sum_{u, i} c_{ui} (b_{ui} - u^T v_i)^2 + \\lambda(\\|U\\|^2 + \\|V\\|^2)$$</div>
<p class="l-text">where \\(b_{ui} = 1\\) if the user interacted with the item, else 0. The closed-form U and V updates use the implicit-trick to avoid building dense matrices. This is the <code>implicit</code> Python library's flagship algorithm.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sampling Triples Efficiently</h2>
<p class="l-text">BPR's hot loop is sampling. For every step we need a user, one of their items, and an item they did not interact with. Doing this naively (rejection sampling on a Python set) is slow; the trick is to sample uniformly over <em>positive interactions</em> and pick negatives uniformly over the catalog with reject-on-collision.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

ints = df_orders[[<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]].<span class="fn">drop_duplicates</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>()
items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2idx = {u: k <span class="kw">for</span> k, u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}
i2idx = {i: k <span class="kw">for</span> k, i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
ints[<span class="str">"u"</span>] = ints[<span class="str">"customer_id"</span>].<span class="fn">map</span>(u2idx)
ints[<span class="str">"i"</span>] = ints[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2idx)
positives = ints.<span class="fn">groupby</span>(<span class="str">"u"</span>)[<span class="str">"i"</span>].<span class="fn">apply</span>(<span class="fn">set</span>).to_dict()

rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
n_items = <span class="fn">len</span>(items)
<span class="kw">def</span> <span class="fn">sample_batch</span>(B=<span class="num">32</span>):
    rows = ints.<span class="fn">sample</span>(B, random_state=<span class="kw">None</span>).values
    u = rows[:, <span class="num">2</span>].<span class="fn">astype</span>(<span class="fn">int</span>)
    pos = rows[:, <span class="num">3</span>].<span class="fn">astype</span>(<span class="fn">int</span>)
    neg = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_items, size=B)
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(B):
        <span class="kw">while</span> neg[k] <span class="kw">in</span> positives[u[k]]:
            neg[k] = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_items)
    <span class="kw">return</span> u, pos, neg

u, pos, neg = <span class="fn">sample_batch</span>(<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"users:"</span>, u, <span class="str">"pos:"</span>, pos, <span class="str">"neg:"</span>, neg)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Encode customer and product ids as 0..N-1 integers. 2) Build a positives dict mapping each user to the set of items they touched. 3) <code>sample_batch</code> picks B random observed (u, pos) pairs, draws B random negatives, and re-rolls any negative that is actually positive for that user. 4) Print one batch to verify the negatives are clean.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. BPR-MF Training Loop</h2>
<p class="l-text">Now we put the pieces together: latent vectors for users and items, sigmoid loss on the score difference, and an SGD loop over sampled triples.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

ints = df_orders[[<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]].<span class="fn">drop_duplicates</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>(); items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2 = {u:k <span class="kw">for</span> k,u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}; i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
ints[<span class="str">"u"</span>] = ints[<span class="str">"customer_id"</span>].<span class="fn">map</span>(u2); ints[<span class="str">"i"</span>] = ints[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)
pos_set = ints.<span class="fn">groupby</span>(<span class="str">"u"</span>)[<span class="str">"i"</span>].<span class="fn">apply</span>(<span class="fn">set</span>).to_dict()

n_u, n_i, k = <span class="fn">len</span>(users), <span class="fn">len</span>(items), <span class="num">16</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
U = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.05</span>, (n_u, k))
V = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.05</span>, (n_i, k))
lr, lam, steps = <span class="num">0.05</span>, <span class="num">0.001</span>, <span class="num">2000</span>
losses = []
arr = ints[[<span class="str">"u"</span>, <span class="str">"i"</span>]].values
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(steps):
    row = arr[rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(arr))]
    u, i = <span class="fn">int</span>(row[<span class="num">0</span>]), <span class="fn">int</span>(row[<span class="num">1</span>])
    j = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_i)
    <span class="kw">while</span> j <span class="kw">in</span> pos_set[u]:
        j = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_i)
    diff = U[u] @ (V[i] - V[j])
    sig = <span class="num">1.0</span> / (<span class="num">1.0</span> + np.<span class="fn">exp</span>(diff))   <span class="cm"># 1 - sigmoid(diff)</span>
    grad_u = sig * (V[i] - V[j]) - lam * U[u]
    grad_i = sig * U[u]              - lam * V[i]
    grad_j = -sig * U[u]             - lam * V[j]
    U[u] += lr * grad_u; V[i] += lr * grad_i; V[j] += lr * grad_j
    <span class="kw">if</span> t % <span class="num">200</span> == <span class="num">0</span>:
        loss = -np.<span class="fn">log</span>(<span class="num">1</span> - sig + <span class="num">1e-9</span>)
        losses.<span class="fn">append</span>((t, <span class="fn">float</span>(loss)))
        <span class="fn">print</span>(f<span class="str">"step {t:5d}  loss = {loss:.4f}"</span>)
<span class="fn">print</span>(<span class="str">"final U norm:"</span>, np.<span class="fn">linalg</span>.norm(U), <span class="str">"V norm:"</span>, np.<span class="fn">linalg</span>.norm(V))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build user and item latent matrices initialized small. 2) For each step sample (u, i, j). 3) Compute the score difference, the sigmoid, and the BPR gradients in closed form. 4) Apply SGD updates. 5) Print loss every 200 steps — it should drop from around 0.69 (random) toward 0.3 or below.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The implicit Library (Demo Only in Pyodide)</h2>
<p class="l-text">In real production you would not write the loop above. You would use Ben Frederickson's <code>implicit</code> library, which implements BPR, ALS, LMF on sparse matrices with a Cython/CUDA backend.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> implicit
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix

R = csr_matrix(user_item_counts.<span class="fn">astype</span>(<span class="str">"float32"</span>))
model = implicit.als.<span class="fn">AlternatingLeastSquares</span>(factors=<span class="num">64</span>, regularization=<span class="num">0.05</span>, iterations=<span class="num">15</span>)
model.<span class="fn">fit</span>(R)

user_id = <span class="num">0</span>
ids, scores = model.<span class="fn">recommend</span>(user_id, R[user_id], N=<span class="num">10</span>)
<span class="fn">print</span>(<span class="str">"top items:"</span>, ids, scores)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide alternative (browser-runnable)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">The implicit library is blocked. We replicate weighted ALS in numpy with one explicit factor update step, which is exactly what the library does internally.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
mat = (df_orders.groupby(["customer_id", "product_id"]).size().unstack(fill_value=0))
P = (mat.values &gt; 0).astype(float)         # binary preference
C = 1.0 + 20.0 * mat.values.astype(float)    # confidence
n_u, n_i = P.shape
k = 16
rng = np.random.default_rng(0)
U = rng.normal(0, 0.05, (n_u, k))
V = rng.normal(0, 0.05, (n_i, k))
lam = 0.1
for it in range(5):
    # Update U with V fixed, weighted ridge regression per user
    VtV = V.T @ V
    for u in range(n_u):
        Cu = C[u]; Pu = P[u]
        A = VtV + (V.T * (Cu - 1)) @ V + lam * np.eye(k)
        b = (V.T * Cu) @ Pu
        U[u] = np.linalg.solve(A, b)
    UtU = U.T @ U
    for i in range(n_i):
        Ci = C[:, i]; Pi = P[:, i]
        A = UtU + (U.T * (Ci - 1)) @ U + lam * np.eye(k)
        b = (U.T * Ci) @ Pi
        V[i] = np.linalg.solve(A, b)
    print(f"iter {it} done, ||U||={np.linalg.norm(U):.2f} ||V||={np.linalg.norm(V):.2f}")

scores = U[0] @ V.T
top10 = np.argsort(-scores)[:10]
print("user 0 top-10 product idx:", top10)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Diagnosing a Bad Implicit Model</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">All-popular output</div><div class="card-body">Every user gets the same top-10. Latent factors are not personalizing — increase k or check sampling.</div></div>
<div class="calc-card"><div class="card-title">Loss flat at log 2</div><div class="card-body">BPR loss stuck at 0.69 means the model is random. Check learning rate and gradient signs.</div></div>
<div class="calc-card"><div class="card-title">Recall huge, precision zero</div><div class="card-body">Model retrieves head items only. Add long-tail examples to training, or try WARP.</div></div>
<div class="calc-card"><div class="card-title">Cold users get garbage</div><div class="card-body">Users with 1 interaction cannot be learned. Add content fallback or popularity backoff.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. BPR Loss Curve</h2>
<p class="l-text">A healthy BPR run shows loss decreasing from log 2 ≈ 0.69 toward 0.3 within a few thousand steps. If it plateaus high, you are probably sampling negatives that are too easy.</p>
<div id="recsys3-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Implicit feedback is missing-not-at-random — explicit losses overfit zeros.<br><strong>2.</strong> BPR (Rendle 2009) ranks the positive above a sampled negative via sigmoid loss.<br><strong>3.</strong> WARP samples adaptively until violating — better top-K on long-tail catalogs.<br><strong>4.</strong> Weighted ALS (Hu, Koren 2008) gives a closed-form parallel update.<br><strong>5.</strong> Negative sampling efficiency is the inner loop; do it in numpy or Cython.<br><strong>6.</strong> Watch for degenerate "all-popular" outputs — sign that personalization failed.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var x = []; var bpr = []; var warp = [];
  for (var t=0; t&lt;=2000; t+=200) {
    x.push(t);
    bpr.push(0.693 - 0.4 * (1 - Math.exp(-t/600)) + 0.02 * Math.random());
    warp.push(0.693 - 0.55 * (1 - Math.exp(-t/400)) + 0.02 * Math.random());
  }
  var data = [
    {x:x, y:bpr, name:'BPR (uniform neg)', type:'scatter', mode:'lines+markers', line:{color:'#888'}},
    {x:x, y:warp, name:'WARP (violating neg)', type:'scatter', mode:'lines+markers', line:{color:T.accent}}
  ];
  var layout = {title:'Pairwise loss decay: BPR vs WARP', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'SGD step', gridcolor:T.grid}, yaxis:{title:'loss', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  ['recsys3-plot-en','recsys3-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Bir YouTube videosunu neredeyse hiç puanlamazsın. İzlersin. Atlarsın. Kaydırarak geçersin. Sinyal ikilidir, biaslıdır ve devasa ölçekte mevcuttur — MF'nin varsaydığı 1-5 yıldızın tam tersi.</strong> Recsys topluluğu kayıp fonksiyonunu sıfırdan yeniden düşünmek zorunda kaldı. Sonuç bir <em>örtük geri bildirim</em> modelleri ailesiydi: BPR, WARP, weighted ALS — hepsi "kullanıcının dokunduğunu dokunmadığının üstüne sırala"nın varyantları.</p>
<p class="l-text">Bugün BPR amacını Rendle'ın 2009 makalesinden türeteceksin, WARP kayıbının uzun kuyruklu kataloglarda neden daha hızlı yakınsadığını öğreneceksin, numpy'da ağırlıklı ALS varyantı kuracaksın ve (kullanıcı, pozitif, negatif) üçlüleri örnekleyerek sipariş veri seti üzerinde küçük bir BPR modeli eğiteceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Açık geri bildirim kayıplarının tıklamalarda, izlemelerde ve satın alımlarda neden başarısız olduğunu açıkla</li>
<li>Bayesian Personalized Ranking'i (Rendle 2009) AUC amacından türet</li>
<li>Seyrek etkileşim matrisinden (kullanıcı, pozitif, negatif) üçlülerini verimli örnekle</li>
<li>WARP vs BPR vs weighted-ALS karşılaştır ve hangisinin ne zaman kazandığını bil</li>
<li>BPR-MF'yi numpy'da uygula ve gerçek veride kaybın düştüğünü izle</li>
<li>İyi bir örtük öneri sisteminin imzasını dejenere bir tanesine karşı tanı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Açık Kayıplar Neden Bozulur</h2>
<p class="l-text">Eğer MF'yi 0/1 tıklama matrisi üzerinde eğitir ve sıfırları "puan 0" olarak ele alırsan, modele kullanıcının görmediği her maddeyi aktif olarak sevmediğini söylemiş olursun. Bu yanlıştır. Muhtemelen onu hiç görmemişlerdir bile. Örtük geri bildirim <em>rastgele olmayan eksiklik</em>'tir ve mutlak puan değil, <em>maddeler arası tercih</em>'i modelleyen bir kayba ihtiyacımız var.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Açık</div><div class="card-body">Yıldız veya başparmak. Güvenilir sinyal ama çok nadir. RMSE tarzı kayıplar çalışır.</div></div>
<div class="calc-card"><div class="card-title">Örtük pozitifler</div><div class="card-body">Tıklama, izleme, satın alma. İlginin güçlü kanıtı.</div></div>
<div class="calc-card"><div class="card-title">Örtük negatifler?</div><div class="card-body">Tıklama yokluğu belirsiz: bilerek mi atladılar yoksa hiç mi görmediler?</div></div>
<div class="calc-card"><div class="card-title">Çözüm</div><div class="card-body">İkili sıralama: pozitif madde, örneklenmiş gözlemlenmemiş bir maddeden daha yüksek puan almalı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bayesian Personalized Ranking (BPR)</h2>
<p class="l-text">Rendle, Freudenthaler, Gantner, Schmidt-Thieme (2009) BPR'yi önerdi. Her (kullanıcı u, gözlemlenen madde i, gözlemlenmemiş madde j) üçlüsü için, modelin i'yi j'nin üstünde puanlama olasılığını maksimize et. Gizli faktörler ve standart logistic link ile bu şu hale gelir:</p>
<div class="katex-block">$$\\mathcal{L}_{\\text{BPR}} = -\\sum_{(u, i, j)} \\log \\sigma(\\hat{r}_{ui} - \\hat{r}_{uj}) + \\lambda \\|\\Theta\\|^2$$</div>
<p class="l-text">burada \\(\\hat{r}_{ui} = u^T v_i\\) ve \\(\\sigma\\) sigmoid'dir. Gradient güncellemeleri pozitif maddeyi yukarı, örneklenen negatif maddeyi aşağı iter. Bu kayıp AUC için pürüzsüz bir vekildir.</p>
<div class="calc-highlight">BPR sıralamayı doğrudan optimize eder. Aynı üçlü fikrinin sadece bir sinir ağına sarıldığı derin recsys'te (Two-Tower, NCF) tekrar göreceksin.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. WARP: Weighted Approximate-Rank Pairwise</h2>
<p class="l-text">BPR tek bir negatifi tekdüze örnekler. Uzun kuyruklu kataloglarda o negatif genellikle pozitiften önemsiz biçimde daha kolay sıralanabilir, bu yüzden gradient küçüktür. WARP (Weston, Bengio, Usunier 2010), bir <em>ihlal eden</em> bulana kadar negatif örneklemeye devam eder — modelin şu anda pozitifin üstünde sıraladığı bir madde — ve güncellemeyi ihlal edenin sıralamasının bir tahmininin ağırlığıyla ağırlıklandırır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BPR</div><div class="card-body">Adım başına bir tekdüze negatif. Ucuz, basit, uzun kuyruklu veride duraksar.</div></div>
<div class="calc-card"><div class="card-title">WARP</div><div class="card-body">Uyarlanabilir örnekleme — ihlal edene kadar çekmeye devam eder, sonra büyük güncelleme. Güçlü top-K performansı.</div></div>
<div class="calc-card"><div class="card-title">Weighted-ALS</div><div class="card-body">Hu, Koren, Volinsky 2008. Her hücreyi gözlemlenmiş ama güven ağırlıklı olarak ele alır. Kapalı form ALS adımı.</div></div>
<div class="calc-card"><div class="card-title">Sampled softmax</div><div class="card-body">Two-Tower'da (sonraki ders) kullanılan modern varyant. Batch'teki diğer maddeleri negatif olarak ele alır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Weighted ALS (Hu, Koren, Volinsky 2008)</h2>
<p class="l-text">Sıfırları eksik olarak ele almak yerine, weighted ALS bunları düşük güvenli sıfırlar olarak ele alır. Her hücrenin bir güveni vardır: \\(c_{ui} = 1 + \\alpha \\cdot p_{ui}\\) burada \\(p_{ui}\\) oynatma sayısıdır. Sonra ALS şunu minimize eder:</p>
<div class="katex-block">$$\\sum_{u, i} c_{ui} (b_{ui} - u^T v_i)^2 + \\lambda(\\|U\\|^2 + \\|V\\|^2)$$</div>
<p class="l-text">burada \\(b_{ui} = 1\\) eğer kullanıcı maddeyle etkileşim kurduysa, aksi halde 0. Kapalı form U ve V güncellemeleri yoğun matrisler oluşturmaktan kaçınmak için örtük-numarayı kullanır. Bu, <code>implicit</code> Python kütüphanesinin amiral algoritmasıdır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Üçlüleri Verimli Örnekleme</h2>
<p class="l-text">BPR'nin sıcak döngüsü örneklemedir. Her adım için bir kullanıcıya, maddelerinden birine ve etkileşim kurmadığı bir maddeye ihtiyacımız var. Bunu naif olarak (Python set üzerinde reddetme örneklemesi) yapmak yavaştır; numara <em>pozitif etkileşimler</em> üzerinde tekdüze örneklemek ve katalog üzerinde tekdüze negatif seçip çakışmada reddetmektir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

ints = df_orders[[<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]].<span class="fn">drop_duplicates</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>()
items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2idx = {u: k <span class="kw">for</span> k, u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}
i2idx = {i: k <span class="kw">for</span> k, i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
ints[<span class="str">"u"</span>] = ints[<span class="str">"customer_id"</span>].<span class="fn">map</span>(u2idx)
ints[<span class="str">"i"</span>] = ints[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2idx)
positives = ints.<span class="fn">groupby</span>(<span class="str">"u"</span>)[<span class="str">"i"</span>].<span class="fn">apply</span>(<span class="fn">set</span>).to_dict()

rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
n_items = <span class="fn">len</span>(items)
<span class="kw">def</span> <span class="fn">sample_batch</span>(B=<span class="num">32</span>):
    rows = ints.<span class="fn">sample</span>(B, random_state=<span class="kw">None</span>).values
    u = rows[:, <span class="num">2</span>].<span class="fn">astype</span>(<span class="fn">int</span>)
    pos = rows[:, <span class="num">3</span>].<span class="fn">astype</span>(<span class="fn">int</span>)
    neg = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_items, size=B)
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(B):
        <span class="kw">while</span> neg[k] <span class="kw">in</span> positives[u[k]]:
            neg[k] = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_items)
    <span class="kw">return</span> u, pos, neg

u, pos, neg = <span class="fn">sample_batch</span>(<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"users:"</span>, u, <span class="str">"pos:"</span>, pos, <span class="str">"neg:"</span>, neg)</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Müşteri ve ürün kimliklerini 0..N-1 tamsayı olarak kodla. 2) Her kullanıcıyı dokunduğu maddelerin kümesine eşleyen bir positives sözlüğü kur. 3) <code>sample_batch</code> B rastgele gözlemlenmiş (u, pos) çifti seçer, B rastgele negatif çeker ve kullanıcı için aslında pozitif olan herhangi bir negatifi yeniden çeker. 4) Negatiflerin temiz olduğunu doğrulamak için bir batch yazdır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. BPR-MF Eğitim Döngüsü</h2>
<p class="l-text">Şimdi parçaları bir araya getiriyoruz: kullanıcılar ve maddeler için gizli vektörler, skor farkı üzerinde sigmoid kayıp ve örneklenmiş üçlüler üzerinde bir SGD döngüsü.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

ints = df_orders[[<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]].<span class="fn">drop_duplicates</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>(); items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2 = {u:k <span class="kw">for</span> k,u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}; i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
ints[<span class="str">"u"</span>] = ints[<span class="str">"customer_id"</span>].<span class="fn">map</span>(u2); ints[<span class="str">"i"</span>] = ints[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)
pos_set = ints.<span class="fn">groupby</span>(<span class="str">"u"</span>)[<span class="str">"i"</span>].<span class="fn">apply</span>(<span class="fn">set</span>).to_dict()

n_u, n_i, k = <span class="fn">len</span>(users), <span class="fn">len</span>(items), <span class="num">16</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
U = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.05</span>, (n_u, k))
V = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.05</span>, (n_i, k))
lr, lam, steps = <span class="num">0.05</span>, <span class="num">0.001</span>, <span class="num">2000</span>
losses = []
arr = ints[[<span class="str">"u"</span>, <span class="str">"i"</span>]].values
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(steps):
    row = arr[rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(arr))]
    u, i = <span class="fn">int</span>(row[<span class="num">0</span>]), <span class="fn">int</span>(row[<span class="num">1</span>])
    j = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_i)
    <span class="kw">while</span> j <span class="kw">in</span> pos_set[u]:
        j = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_i)
    diff = U[u] @ (V[i] - V[j])
    sig = <span class="num">1.0</span> / (<span class="num">1.0</span> + np.<span class="fn">exp</span>(diff))   <span class="cm"># 1 - sigmoid(diff)</span>
    grad_u = sig * (V[i] - V[j]) - lam * U[u]
    grad_i = sig * U[u]              - lam * V[i]
    grad_j = -sig * U[u]             - lam * V[j]
    U[u] += lr * grad_u; V[i] += lr * grad_i; V[j] += lr * grad_j
    <span class="kw">if</span> t % <span class="num">200</span> == <span class="num">0</span>:
        loss = -np.<span class="fn">log</span>(<span class="num">1</span> - sig + <span class="num">1e-9</span>)
        losses.<span class="fn">append</span>((t, <span class="fn">float</span>(loss)))
        <span class="fn">print</span>(f<span class="str">"step {t:5d}  loss = {loss:.4f}"</span>)
<span class="fn">print</span>(<span class="str">"final U norm:"</span>, np.<span class="fn">linalg</span>.norm(U), <span class="str">"V norm:"</span>, np.<span class="fn">linalg</span>.norm(V))</code></pre></div>
<p class="l-text"><strong>Kodun akışı:</strong> 1) Küçük başlatılmış kullanıcı ve madde gizli matrislerini kur. 2) Her adım için (u, i, j) örnekle. 3) Skor farkını, sigmoid'i ve BPR gradientlerini kapalı formda hesapla. 4) SGD güncellemelerini uygula. 5) Her 200 adımda kaybı yazdır — yaklaşık 0,69 (rastgele) civarından 0,3 veya altına düşmelidir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. implicit Kütüphanesi (Pyodide'de Yalnızca Demo)</h2>
<p class="l-text">Gerçek üretimde yukarıdaki döngüyü yazmazsın. Ben Frederickson'ın <code>implicit</code> kütüphanesini kullanırsın, BPR, ALS, LMF'yi seyrek matrisler üzerinde Cython/CUDA arka uçla uygular.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> implicit
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix

R = csr_matrix(user_item_counts.<span class="fn">astype</span>(<span class="str">"float32"</span>))
model = implicit.als.<span class="fn">AlternatingLeastSquares</span>(factors=<span class="num">64</span>, regularization=<span class="num">0.05</span>, iterations=<span class="num">15</span>)
model.<span class="fn">fit</span>(R)

user_id = <span class="num">0</span>
ids, scores = model.<span class="fn">recommend</span>(user_id, R[user_id], N=<span class="num">10</span>)
<span class="fn">print</span>(<span class="str">"top items:"</span>, ids, scores)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide alternatifi (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">implicit kütüphanesi engellenmiş. Numpy'da weighted ALS'yi tek bir açık faktör güncelleme adımıyla çoğaltıyoruz, kütüphanenin içeride yaptığı şey de tam olarak budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
mat = (df_orders.groupby(["customer_id", "product_id"]).size().unstack(fill_value=0))
P = (mat.values &gt; 0).astype(float)         # ikili tercih
C = 1.0 + 20.0 * mat.values.astype(float)    # güven
n_u, n_i = P.shape
k = 16
rng = np.random.default_rng(0)
U = rng.normal(0, 0.05, (n_u, k))
V = rng.normal(0, 0.05, (n_i, k))
lam = 0.1
for it in range(5):
    # V sabitken U'yu güncelle, kullanıcı başına ağırlıklı ridge regresyon
    VtV = V.T @ V
    for u in range(n_u):
        Cu = C[u]; Pu = P[u]
        A = VtV + (V.T * (Cu - 1)) @ V + lam * np.eye(k)
        b = (V.T * Cu) @ Pu
        U[u] = np.linalg.solve(A, b)
    UtU = U.T @ U
    for i in range(n_i):
        Ci = C[:, i]; Pi = P[:, i]
        A = UtU + (U.T * (Ci - 1)) @ U + lam * np.eye(k)
        b = (U.T * Ci) @ Pi
        V[i] = np.linalg.solve(A, b)
    print(f"iter {it} done, ||U||={np.linalg.norm(U):.2f} ||V||={np.linalg.norm(V):.2f}")

scores = U[0] @ V.T
top10 = np.argsort(-scores)[:10]
print("user 0 top-10 product idx:", top10)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Kötü Bir Örtük Modeli Tanılamak</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hep popüler çıktı</div><div class="card-body">Her kullanıcı aynı top-10'u alıyor. Gizli faktörler kişiselleştirmiyor — k'yı artır veya örneklemeyi kontrol et.</div></div>
<div class="calc-card"><div class="card-title">Kayıp log 2'de düz</div><div class="card-body">BPR kaybı 0,69'da takılı kaldıysa model rastgeledir. Öğrenme oranını ve gradient işaretlerini kontrol et.</div></div>
<div class="calc-card"><div class="card-title">Recall büyük, precision sıfır</div><div class="card-body">Model yalnızca baş maddeleri çekiyor. Eğitime uzun kuyruk örnekleri ekle veya WARP dene.</div></div>
<div class="calc-card"><div class="card-title">Soğuk kullanıcılar çöp alıyor</div><div class="card-body">1 etkileşimi olan kullanıcılar öğrenilemez. İçerik geri dönüş veya popülerlik fallback ekle.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. BPR Kayıp Eğrisi</h2>
<p class="l-text">Sağlıklı bir BPR koşusu, kaybın log 2 ≈ 0,69'dan birkaç bin adım içinde 0,3'e doğru azaldığını gösterir. Eğer yüksek bir yerde takılırsa, muhtemelen çok kolay negatifler örnekliyorsun.</p>
<div id="recsys3-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ana Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANA ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Örtük geri bildirim rastgele olmayan eksikliktir — açık kayıplar sıfırlara aşırı uydurur.<br><strong>2.</strong> BPR (Rendle 2009), pozitifi sigmoid kayıpla örneklenen bir negatifin üstüne sıralar.<br><strong>3.</strong> WARP, ihlal eden bulana kadar uyarlanabilir örnekler — uzun kuyruklu kataloglarda daha iyi top-K.<br><strong>4.</strong> Weighted ALS (Hu, Koren 2008) kapalı form paralel güncelleme verir.<br><strong>5.</strong> Negatif örnekleme verimliliği iç döngüdür; numpy veya Cython'da yap.<br><strong>6.</strong> Dejenere "hep popüler" çıktılarına dikkat et — kişiselleştirmenin başarısız olduğunun işareti.</div></div>
</div>

<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>`
};
