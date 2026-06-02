window.PRIVACY_L4 = {
en: `<p class="l-text">In 2017 a team at Google Research published "Communication-Efficient Learning of Deep Networks from Decentralized Data" (McMahan et al., AISTATS 2017). The setting was Gboard — Google's Android keyboard — which sees billions of next-word predictions a day, generated from text users would never want shipped to a central server. The paper introduced <em>Federated Averaging (FedAvg)</em>: each device runs a few local SGD epochs, sends only its <em>model weights</em> back, and the server averages them. The training data never leaves the phone. Today FedAvg powers Gboard's emoji prediction, Apple's QuickType corrections, hospital cohorts (NVIDIA Clara), and cross-bank fraud models.</p>
<p class="l-text">But "data stays on device" is not the same as "data is private". Bonawitz et al. (2017, "Practical Secure Aggregation for Privacy-Preserving Machine Learning", CCS) showed that an honest-but-curious server can still reconstruct individual updates — and Zhu et al. (2019) demonstrated that even a single weight delta leaks training samples. The cure is layered: <em>secure aggregation</em> (cryptographic masking so the server only sees the sum) plus <em>differential privacy</em> (noise on the aggregate). This lesson builds FedAvg from scratch in NumPy across split <code>df_customers</code> shards, simulates secure aggregation with pairwise masks, and contrasts client-level versus sample-level DP.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The FedAvg algorithm (McMahan 2017) and its communication-efficiency tradeoffs</li>
<li>Secure aggregation via pairwise masking (Bonawitz 2017) and threshold secret sharing</li>
<li>Cross-silo (hospitals, banks) versus cross-device (phones) federated learning</li>
<li>Client-level vs sample-level differential privacy and when each applies</li>
<li>Implementing FedAvg from scratch on partitioned df_customers in NumPy</li>
<li>Threats: gradient inversion, membership inference, Byzantine clients</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Why Federated Learning?</h2>
<p class="l-text">Centralized training assumes you can collect raw data into one bucket. That assumption fails in three regimes. <em>Regulatory</em>: GDPR Art. 5 forbids EU patient data leaving the hospital. <em>Competitive</em>: rival banks won't share fraud signals but want a joint model. <em>Practical</em>: 3 billion phones generate too much text to upload, and users won't allow it. FedAvg keeps raw data local; only model parameters traverse the network.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cross-device</div><div class="card-body">Millions of phones, intermittently online, tiny per-client datasets. Gboard, Siri, Apple QuickType.</div></div>
<div class="calc-card"><div class="card-title">Cross-silo</div><div class="card-body">2-100 organizations (hospitals, banks). Always online, large per-silo data, strong contracts. NVIDIA Clara, Owkin.</div></div>
<div class="calc-card"><div class="card-title">Vertical FL</div><div class="card-body">Same users, different features (one party has demographics, another has transactions). Requires PSI + SMPC.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. The FedAvg Algorithm</h2>
<p class="l-text">McMahan et al. 2017 formalized federated training as iterated rounds. Each round t: (1) server broadcasts global weights w_t to a sampled subset S_t of K clients; (2) each client k runs E local epochs of SGD on its own data D_k, producing w_t^k; (3) server aggregates with a weighted average proportional to dataset size n_k.</p>
<div class="katex-block">$$w_{t+1} = \\sum_{k \\in S_t} \\frac{n_k}{\\sum_j n_j} \\, w_t^k$$</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">FedAvg trades communication for computation. With E=1 it reduces to FedSGD (one local step per round). With E=5 it cuts upload rounds 5x but risks divergence on heterogeneous (non-IID) clients — the central practical pain point of FL.</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. FedAvg From Scratch on Partitioned df_customers</h2>
<p class="l-text">We split df_customers into 5 simulated clients (shards by customer_id mod 5) and train a logistic regression jointly without ever concatenating their data.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Each "client" is a NumPy array. The server only sees averaged weights, never raw rows.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_customers.<span class="fn">copy</span>()
df[<span class="str">'y'</span>] = (df[<span class="str">'lifetime_value'</span>] &gt; df[<span class="str">'lifetime_value'</span>].<span class="fn">median</span>()).<span class="fn">astype</span>(<span class="fn">int</span>)
feat = [<span class="str">'age'</span>,<span class="str">'tenure_years'</span>,<span class="str">'num_orders'</span>]
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[feat].values)
X = np.<span class="fn">hstack</span>([X, np.<span class="fn">ones</span>((<span class="fn">len</span>(X),<span class="num">1</span>))])
y = df[<span class="str">'y'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Split into 5 simulated clients (by index mod K)</span>
K = <span class="num">5</span>
shards = [(X[df.index % K == k], y[df.index % K == k]) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K)]
<span class="fn">print</span>(<span class="str">"Shard sizes:"</span>, [<span class="fn">len</span>(s[<span class="num">1</span>]) <span class="kw">for</span> s <span class="kw">in</span> shards])

<span class="kw">def</span> <span class="fn">sigmoid</span>(z): <span class="kw">return</span> <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-np.<span class="fn">clip</span>(z,-<span class="num">30</span>,<span class="num">30</span>)))

<span class="kw">def</span> <span class="fn">local_train</span>(theta, Xk, yk, lr=<span class="num">0.1</span>, epochs=<span class="num">3</span>):
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(epochs):
        p = <span class="fn">sigmoid</span>(Xk @ theta)
        g = Xk.T @ (p - yk) / <span class="fn">len</span>(yk)
        theta = theta - lr * g
    <span class="kw">return</span> theta

<span class="cm"># FedAvg loop</span>
d = X.shape[<span class="num">1</span>]
theta = np.<span class="fn">zeros</span>(d)
<span class="kw">for</span> rnd <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    locals_ = [<span class="fn">local_train</span>(theta.<span class="fn">copy</span>(), Xk, yk) <span class="kw">for</span> Xk, yk <span class="kw">in</span> shards]
    sizes = np.<span class="fn">array</span>([<span class="fn">len</span>(s[<span class="num">1</span>]) <span class="kw">for</span> s <span class="kw">in</span> shards], <span class="fn">float</span>)
    theta = <span class="fn">sum</span>(w * (n/sizes.<span class="fn">sum</span>()) <span class="kw">for</span> w, n <span class="kw">in</span> <span class="fn">zip</span>(locals_, sizes))
    <span class="kw">if</span> rnd % <span class="num">5</span> == <span class="num">0</span>:
        acc = ((<span class="fn">sigmoid</span>(X @ theta) &gt; <span class="num">0.5</span>) == y).<span class="fn">mean</span>()
        <span class="fn">print</span>(f<span class="str">"round {rnd:2d}  global acc={acc:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) the server initialises the global weight vector w₀ = 0 and broadcasts it to all K clients. 2) each client copies the global state and runs E=3 local SGD epochs on its private shard, producing w_k. 3) the server collects the local weights and averages them with weights proportional to shard size: w_{t+1} = Σ_k (n_k / Σ n) · w_k (the FedAvg rule). 4) the new global state is broadcast for round t+1; raw rows never leave any client.</p>
</div>
<p class="l-text">No client ever transmits its rows — only weight vectors of length d=4. With K=5 shards and 20 rounds, accuracy converges within 1-2% of centralized training on this synthetic dataset.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Secure Aggregation (Bonawitz 2017)</h2>
<p class="l-text">Vanilla FedAvg lets the server see each w_t^k. Bonawitz et al. (2017, CCS) closed this leak with pairwise masking: every pair of clients (i,j) shares a random mask m_ij; client i adds Σ_j m_ij and client j subtracts the same value. The masks cancel only when summed, so the server learns Σ w_t^k but not any single contribution. Threshold secret sharing handles dropouts.</p>
<div class="katex-block">$$\\hat{w}_k = w_k + \\sum_{j \\neq k} \\text{sign}(j-k) \\cdot m_{kj}, \\quad \\sum_k \\hat{w}_k = \\sum_k w_k$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
K, d = <span class="num">5</span>, <span class="num">4</span>
weights = [rng.<span class="fn">normal</span>(size=d) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K)]

<span class="cm"># Pairwise masks: m[i,j] used by client i, m[j,i] = -m[i,j]</span>
masks = {(i,j): rng.<span class="fn">normal</span>(scale=<span class="num">10</span>, size=d) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(K) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(i+<span class="num">1</span>,K)}

<span class="kw">def</span> <span class="fn">masked</span>(k):
    out = weights[k].<span class="fn">copy</span>()
    <span class="kw">for</span> (i,j), m <span class="kw">in</span> masks.<span class="fn">items</span>():
        <span class="kw">if</span> i == k: out += m
        <span class="kw">if</span> j == k: out -= m
    <span class="kw">return</span> out

masked_sum = <span class="fn">sum</span>(<span class="fn">masked</span>(k) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K))
true_sum = <span class="fn">sum</span>(weights)
<span class="fn">print</span>(<span class="str">"Each masked client (looks random):"</span>, <span class="fn">masked</span>(<span class="num">0</span>).<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Sum of masked == true sum?"</span>, np.<span class="fn">allclose</span>(masked_sum, true_sum))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) every ordered pair (i, j) with i &lt; j draws one shared random mask m_ij (in practice via Diffie-Hellman). 2) each client k sends w_k + Σ_{j&gt;k} m_kj − Σ_{i&lt;k} m_ik — its true contribution scrambled by the antisymmetric mask sum, indistinguishable from random. 3) the aggregator only ever sums the masked vectors: the masks cancel pairwise (+m_ij from i, −m_ij from j) and Σ_k masked_k = Σ_k w_k exactly. 4) the server learns the sum but no individual w_k.</p>
<p class="l-text">The server sees only "looks random" individual contributions; the masks cancel exactly in the aggregate. Production secure aggregation uses Diffie-Hellman key exchange + Shamir's secret sharing for dropout resilience.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Client-Level vs Sample-Level DP</h2>
<p class="l-text">Two granularities of DP coexist in FL. <em>Sample-level</em> DP (per-row in your phone) defends against an attacker reconstructing individual messages. <em>Client-level</em> DP (per-device) defends against the existence of any one user being inferred from the global model — the right notion when each client maps 1:1 to a person.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sample-level</div><div class="card-body">Each row contributes ≤ C in L2 norm. Standard DP-SGD inside the client. ε bounds per-message inference.</div></div>
<div class="calc-card"><div class="card-title">Client-level</div><div class="card-body">Each <em>client's update</em> contributes ≤ C. Clip and noise the per-client delta on the server. ε bounds per-user membership.</div></div>
<div class="calc-card"><div class="card-title">Both stacked</div><div class="card-body">Production Gboard uses both: DP-SGD locally + DP-FedAvg globally, with separate ε budgets composed.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="cm"># Client-level DP-FedAvg: clip each client delta, add Gaussian noise on server</span>
<span class="kw">def</span> <span class="fn">dp_fedavg_round</span>(global_w, client_updates, C=<span class="num">1.0</span>, sigma=<span class="num">0.5</span>, rng=<span class="kw">None</span>):
    rng = rng <span class="kw">or</span> np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
    deltas = [u - global_w <span class="kw">for</span> u <span class="kw">in</span> client_updates]
    norms = [np.linalg.<span class="fn">norm</span>(d) <span class="kw">for</span> d <span class="kw">in</span> deltas]
    clipped = [d * <span class="fn">min</span>(<span class="num">1</span>, C/(n+<span class="num">1e-12</span>)) <span class="kw">for</span> d, n <span class="kw">in</span> <span class="fn">zip</span>(deltas, norms)]
    avg = np.<span class="fn">mean</span>(clipped, axis=<span class="num">0</span>)
    noise = rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma*C/<span class="fn">len</span>(client_updates), size=avg.shape)
    <span class="kw">return</span> global_w + avg + noise

<span class="cm"># Demo</span>
g = np.<span class="fn">zeros</span>(<span class="num">4</span>)
clients = [np.random.<span class="fn">normal</span>(size=<span class="num">4</span>) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>)]
new_g = <span class="fn">dp_fedavg_round</span>(g, clients, C=<span class="num">1.0</span>, sigma=<span class="num">1.0</span>)
<span class="fn">print</span>(<span class="str">"DP-noised global update:"</span>, new_g.<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) computes each client's delta Δ_k = w_k − w_global and clips it so ‖Δ_k‖₂ ≤ C — this bounds the influence of any single client. 2) averages the clipped deltas across the participating clients. 3) adds Gaussian noise N(0, (σ·C / K)²) to the mean, giving client-level (ε, δ)-DP via the Renyi accountant. 4) returns w_global + clipped_mean + noise as the next global model; an external privacy accountant tracks the spent ε over rounds.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Gboard — The Production Case Study</h2>
<p class="l-text">Google's Federated Learning of Cohorts paper (Hard et al. 2018) trained next-word LSTMs on millions of Android phones. Privacy stack: (a) on-device storage with auto-deletion; (b) TFF + Secure Aggregation; (c) client-level DP-FedAvg with ε≈8 over a year of training; (d) device sampling that excludes phones not on Wi-Fi or charging. The model never sees raw text — only aggregate weight deltas with formal DP.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Open-source equivalents: TensorFlow Federated (Google), Flower (Adap, framework-agnostic), PySyft (OpenMined), NVIDIA FLARE. Apple uses an internal stack with on-device DP randomized response for telemetry — the precursor to Local DP, which is the next lesson's topic.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Threat Model and Open Problems</h2>
<p class="l-text">FL is not a silver bullet. Three live attack classes remain. (a) <em>Gradient inversion</em> (Geiping et al. 2020 "Inverting Gradients") reconstructs batches up to size 100 from a single shared update — secure aggregation + DP is the mitigation. (b) <em>Backdoor attacks</em> (Bagdasaryan 2019) where a Byzantine client injects a poisoned update that survives averaging — Krum and Median aggregators help. (c) <em>Membership inference on aggregates</em> (Melis 2019) — DP at the aggregate level is the only formal defense.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="cm"># Krum: pick the client whose update is closest to its (K-f-2) nearest neighbors</span>
<span class="kw">def</span> <span class="fn">krum</span>(updates, f=<span class="num">1</span>):
    K = <span class="fn">len</span>(updates)
    scores = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(K):
        dists = <span class="fn">sorted</span>([np.linalg.<span class="fn">norm</span>(updates[i]-updates[j])**<span class="num">2</span>
                        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(K) <span class="kw">if</span> j != i])
        scores.<span class="fn">append</span>(<span class="fn">sum</span>(dists[:K-f-<span class="num">2</span>]))
    <span class="kw">return</span> updates[<span class="fn">int</span>(np.<span class="fn">argmin</span>(scores))]

clean = [np.random.<span class="fn">normal</span>(size=<span class="num">4</span>) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">9</span>)]
poisoned = clean + [np.<span class="fn">array</span>([<span class="num">100</span>,<span class="num">100</span>,<span class="num">100</span>,<span class="num">100</span>])]
chosen = <span class="fn">krum</span>(poisoned, f=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"Krum picked:"</span>, chosen.<span class="fn">round</span>(<span class="num">3</span>), <span class="str">"(rejected the poisoned outlier)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) for every client i, computes the squared L2 distance to all K−1 other client updates. 2) Krum's score s_i is the sum of the (K − f − 2) smallest of these distances — it measures how close i is to its nearest honest neighbourhood (f = expected Byzantine count). 3) the client with the minimum score is selected; its update becomes the round's aggregate. 4) the [100,100,100,100] poisoned outlier sits far from everyone, gets a huge score, and is rejected — restoring honest-majority training in the presence of f Byzantines.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. When to Use Federated Learning</h2>
<p class="l-text">FL is justified when (a) data is partitioned and cannot be merged, AND (b) the joint signal beats per-silo training. If raw data <em>can</em> be centralized cheaply, FL adds complexity for no privacy gain over standard DP-SGD. Cross-silo medical FL has clear wins; cross-device on-phone FL pays off only at hyperscale where no one entity can ingest the data. Audit checklist: secure aggregation deployed? Client-level DP active? Robust aggregator (Krum/Median) for Byzantine resistance? Full-stack threat modeling — not just "data stays local" — is the bar.</p>
</div>`,
tr: `<p class="l-text">2017'de Google Research'teki bir ekip "Communication-Efficient Learning of Deep Networks from Decentralized Data"yı yayımladı (McMahan vd., AISTATS 2017). Ortam Gboard'du — Google'ın Android klavyesi — günde milyarlarca sonraki kelime tahmini görür ve bunlar kullanıcıların asla merkezi sunucuya göndermek istemeyeceği metinden üretilir. Makale <em>Federated Averaging (FedAvg)</em>'i tanıttı: her cihaz birkaç yerel SGD epoch'u çalıştırır, sadece <em>model ağırlıklarını</em> geri gönderir ve sunucu onları ortalar. Eğitim verisi telefonu hiç terk etmez. Bugün FedAvg, Gboard'un emoji tahminini, Apple'ın QuickType düzeltmelerini, hastane kohortlarını (NVIDIA Clara) ve çapraz-banka dolandırıcılık modellerini güçlendirir.</p>
<p class="l-text">Ama "veri cihazda kalır" "veri özeldir" ile aynı şey değildir. Bonawitz vd. (2017, "Practical Secure Aggregation for Privacy-Preserving Machine Learning", CCS) dürüst-ama-meraklı bir sunucunun bireysel güncellemeleri hâlâ yeniden inşa edebileceğini gösterdi — ve Zhu vd. (2019), tek bir ağırlık deltasının bile eğitim örneklerini sızdırdığını gösterdi. Çözüm katmanlıdır: <em>secure aggregation</em> (kriptografik maskeleme, böylece sunucu yalnızca toplamı görür) artı <em>diferansiyel gizlilik</em> (toplamda gürültü). Bu ders, bölünmüş <code>df_customers</code> shard'ları arasında NumPy'da sıfırdan FedAvg inşa eder, çift maskelerle secure aggregation simüle eder ve istemci-seviyesi vs örnek-seviyesi DP'yi karşılaştırır.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>FedAvg algoritması (McMahan 2017) ve iletişim-verimliliği takasları</li>
<li>Çift maskeleme (Bonawitz 2017) ve eşik gizli paylaşımı ile secure aggregation</li>
<li>Çapraz-silo (hastaneler, bankalar) vs çapraz-cihaz (telefonlar) federe öğrenme</li>
<li>İstemci-seviyesi vs örnek-seviyesi diferansiyel gizlilik ve her birinin ne zaman uygulandığı</li>
<li>NumPy'da bölünmüş df_customers üzerinde sıfırdan FedAvg uygulamak</li>
<li>Tehditler: gradyan tersine çevirme, üyelik çıkarımı, Bizans istemcileri</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Neden Federated Learning?</h2>
<p class="l-text">Merkezi eğitim ham veriyi tek bir kovaya toplayabileceğinizi varsayar. Bu varsayım üç rejimde başarısız olur. <em>Düzenleyici</em>: GDPR Md. 5, AB hasta verisinin hastaneyi terk etmesini yasaklar. <em>Rekabetçi</em>: rakip bankalar dolandırıcılık sinyallerini paylaşmaz ama ortak bir model ister. <em>Pratik</em>: 3 milyar telefon yüklemek için çok fazla metin üretir ve kullanıcılar buna izin vermez. FedAvg ham veriyi yerel tutar; ağda yalnızca model parametreleri dolaşır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çapraz-cihaz</div><div class="card-body">Milyonlarca telefon, ara sıra çevrimiçi, küçük istemci başına veri seti. Gboard, Siri, Apple QuickType.</div></div>
<div class="calc-card"><div class="card-title">Çapraz-silo</div><div class="card-body">2-100 kuruluş (hastaneler, bankalar). Her zaman çevrimiçi, büyük silo başına veri, güçlü sözleşmeler. NVIDIA Clara, Owkin.</div></div>
<div class="calc-card"><div class="card-title">Dikey FL</div><div class="card-body">Aynı kullanıcılar, farklı özellikler (bir taraf demografiye sahip, diğeri işlemlere). PSI + SMPC gerektirir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. FedAvg Algoritması</h2>
<p class="l-text">McMahan vd. 2017, federe eğitimi yinelenen turlar olarak resmileştirdi. Her tur t: (1) sunucu küresel ağırlıkları w_t'yi K istemcinin örneklenmiş bir alt kümesi S_t'ye yayınlar; (2) her istemci k kendi verisi D_k üzerinde E yerel SGD epoch'u çalıştırır, w_t^k üretir; (3) sunucu veri seti boyutu n_k ile orantılı ağırlıklı ortalama ile birleştirir.</p>
<div class="katex-block">$$w_{t+1} = \\sum_{k \\in S_t} \\frac{n_k}{\\sum_j n_j} \\, w_t^k$$</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">FedAvg iletişimi hesaplamayla takas eder. E=1 ile FedSGD'ye düşer (tur başına bir yerel adım). E=5 ile yükleme turlarını 5x keser ama heterojen (non-IID) istemcilerde sapma riski taşır — FL'nin merkezi pratik acı noktası.</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Bölünmüş df_customers Üzerinde Sıfırdan FedAvg</h2>
<p class="l-text">df_customers'ı 5 simüle istemciye böleriz (customer_id mod 5 ile shard'lar) ve verilerini hiç birleştirmeden birlikte bir lojistik regresyon eğitiriz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide karşılığı (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Her "istemci" bir NumPy dizisidir. Sunucu yalnızca ortalanmış ağırlıkları görür, asla ham satırları değil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_customers.<span class="fn">copy</span>()
df[<span class="str">'y'</span>] = (df[<span class="str">'lifetime_value'</span>] &gt; df[<span class="str">'lifetime_value'</span>].<span class="fn">median</span>()).<span class="fn">astype</span>(<span class="fn">int</span>)
feat = [<span class="str">'age'</span>,<span class="str">'tenure_years'</span>,<span class="str">'num_orders'</span>]
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[feat].values)
X = np.<span class="fn">hstack</span>([X, np.<span class="fn">ones</span>((<span class="fn">len</span>(X),<span class="num">1</span>))])
y = df[<span class="str">'y'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># 5 simüle istemciye böl (indis mod K ile)</span>
K = <span class="num">5</span>
shards = [(X[df.index % K == k], y[df.index % K == k]) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K)]
<span class="fn">print</span>(<span class="str">"Shard sizes:"</span>, [<span class="fn">len</span>(s[<span class="num">1</span>]) <span class="kw">for</span> s <span class="kw">in</span> shards])

<span class="kw">def</span> <span class="fn">sigmoid</span>(z): <span class="kw">return</span> <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-np.<span class="fn">clip</span>(z,-<span class="num">30</span>,<span class="num">30</span>)))

<span class="kw">def</span> <span class="fn">local_train</span>(theta, Xk, yk, lr=<span class="num">0.1</span>, epochs=<span class="num">3</span>):
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(epochs):
        p = <span class="fn">sigmoid</span>(Xk @ theta)
        g = Xk.T @ (p - yk) / <span class="fn">len</span>(yk)
        theta = theta - lr * g
    <span class="kw">return</span> theta

<span class="cm"># FedAvg döngüsü</span>
d = X.shape[<span class="num">1</span>]
theta = np.<span class="fn">zeros</span>(d)
<span class="kw">for</span> rnd <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    locals_ = [<span class="fn">local_train</span>(theta.<span class="fn">copy</span>(), Xk, yk) <span class="kw">for</span> Xk, yk <span class="kw">in</span> shards]
    sizes = np.<span class="fn">array</span>([<span class="fn">len</span>(s[<span class="num">1</span>]) <span class="kw">for</span> s <span class="kw">in</span> shards], <span class="fn">float</span>)
    theta = <span class="fn">sum</span>(w * (n/sizes.<span class="fn">sum</span>()) <span class="kw">for</span> w, n <span class="kw">in</span> <span class="fn">zip</span>(locals_, sizes))
    <span class="kw">if</span> rnd % <span class="num">5</span> == <span class="num">0</span>:
        acc = ((<span class="fn">sigmoid</span>(X @ theta) &gt; <span class="num">0.5</span>) == y).<span class="fn">mean</span>()
        <span class="fn">print</span>(f<span class="str">"round {rnd:2d}  global acc={acc:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) sunucu küresel ağırlık vektörünü w₀ = 0 olarak başlatır ve tüm K istemciye yayınlar. 2) her istemci küresel durumu kopyalar ve kendi özel shard'ı üzerinde E=3 yerel SGD epoch'u çalıştırır, w_k üretir. 3) sunucu yerel ağırlıkları toplar ve shard boyutuyla orantılı ağırlıkla ortalar: w_{t+1} = Σ_k (n_k / Σ n) · w_k (FedAvg kuralı). 4) yeni küresel durum t+1 turu için yayınlanır; ham satırlar hiçbir istemciyi terk etmez.</p>
</div>
<p class="l-text">Hiçbir istemci satırlarını iletmez — yalnızca uzunluğu d=4 olan ağırlık vektörleri. K=5 shard ve 20 turla, doğruluk bu sentetik veri setinde merkezi eğitimin %1-2 içine yakınsar.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Secure Aggregation (Bonawitz 2017)</h2>
<p class="l-text">Vanilla FedAvg sunucunun her w_t^k'yi görmesine izin verir. Bonawitz vd. (2017, CCS) bu sızıntıyı çift maskeleme ile kapattı: her istemci çifti (i,j) rastgele bir maske m_ij paylaşır; istemci i Σ_j m_ij ekler ve istemci j aynı değeri çıkarır. Maskeler yalnızca toplandığında birbirini götürür, böylece sunucu Σ w_t^k öğrenir ama hiçbir tek katkıyı öğrenmez. Eşik gizli paylaşımı kopuşları yönetir.</p>
<div class="katex-block">$$\\hat{w}_k = w_k + \\sum_{j \\neq k} \\text{sign}(j-k) \\cdot m_{kj}, \\quad \\sum_k \\hat{w}_k = \\sum_k w_k$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
K, d = <span class="num">5</span>, <span class="num">4</span>
weights = [rng.<span class="fn">normal</span>(size=d) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K)]

<span class="cm"># Çift maskeler: m[i,j] istemci i tarafından kullanılır, m[j,i] = -m[i,j]</span>
masks = {(i,j): rng.<span class="fn">normal</span>(scale=<span class="num">10</span>, size=d) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(K) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(i+<span class="num">1</span>,K)}

<span class="kw">def</span> <span class="fn">masked</span>(k):
    out = weights[k].<span class="fn">copy</span>()
    <span class="kw">for</span> (i,j), m <span class="kw">in</span> masks.<span class="fn">items</span>():
        <span class="kw">if</span> i == k: out += m
        <span class="kw">if</span> j == k: out -= m
    <span class="kw">return</span> out

masked_sum = <span class="fn">sum</span>(<span class="fn">masked</span>(k) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K))
true_sum = <span class="fn">sum</span>(weights)
<span class="fn">print</span>(<span class="str">"Each masked client (looks random):"</span>, <span class="fn">masked</span>(<span class="num">0</span>).<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Sum of masked == true sum?"</span>, np.<span class="fn">allclose</span>(masked_sum, true_sum))
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) i &lt; j olan her sıralı (i, j) çifti tek bir ortak rastgele maske m_ij çeker (pratikte Diffie-Hellman üzerinden). 2) her istemci k şunu gönderir: w_k + Σ_{j&gt;k} m_kj − Σ_{i&lt;k} m_ik — antisimetrik maske toplamı ile karıştırılmış gerçek katkısı, rastgeleden ayırt edilemez. 3) toplayıcı yalnızca maskelenmiş vektörleri toplar: maskeler ikili olarak birbirini götürür (i'den +m_ij, j'den −m_ij) ve Σ_k masked_k = Σ_k w_k tam olarak sağlanır. 4) sunucu toplamı öğrenir ama hiçbir bireysel w_k'yi öğrenmez.</p>
<p class="l-text">Sunucu yalnızca "rastgele görünen" bireysel katkıları görür; maskeler toplamada tam olarak birbirini götürür. Üretim secure aggregation, kopuş dayanıklılığı için Diffie-Hellman anahtar değişimi + Shamir gizli paylaşımı kullanır.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. İstemci-Seviyesi vs Örnek-Seviyesi DP</h2>
<p class="l-text">FL'de iki DP granülerliği bir arada bulunur. <em>Örnek-seviyesi</em> DP (telefonunuzdaki satır başına) saldırganın bireysel mesajları yeniden inşa etmesine karşı savunur. <em>İstemci-seviyesi</em> DP (cihaz başına) bir kullanıcının küresel modelden çıkarılmasına karşı savunur — her istemci 1:1 bir kişiye eşlendiğinde doğru kavram.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Örnek-seviyesi</div><div class="card-body">Her satır L2 normunda ≤ C katkıda bulunur. İstemci içinde standart DP-SGD. ε mesaj başına çıkarımı sınırlar.</div></div>
<div class="calc-card"><div class="card-title">İstemci-seviyesi</div><div class="card-body">Her <em>istemcinin güncellemesi</em> ≤ C katkıda bulunur. İstemci başına deltayı sunucuda kırp ve gürültüle. ε kullanıcı başına üyeliği sınırlar.</div></div>
<div class="calc-card"><div class="card-title">İkisi yığılmış</div><div class="card-body">Üretim Gboard her ikisini kullanır: yerel olarak DP-SGD + küresel olarak DP-FedAvg, ayrı ε bütçeleri birleştirilir.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="cm"># İstemci-seviyesi DP-FedAvg: her istemci deltasını kırp, sunucuda Gauss gürültüsü ekle</span>
<span class="kw">def</span> <span class="fn">dp_fedavg_round</span>(global_w, client_updates, C=<span class="num">1.0</span>, sigma=<span class="num">0.5</span>, rng=<span class="kw">None</span>):
    rng = rng <span class="kw">or</span> np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
    deltas = [u - global_w <span class="kw">for</span> u <span class="kw">in</span> client_updates]
    norms = [np.linalg.<span class="fn">norm</span>(d) <span class="kw">for</span> d <span class="kw">in</span> deltas]
    clipped = [d * <span class="fn">min</span>(<span class="num">1</span>, C/(n+<span class="num">1e-12</span>)) <span class="kw">for</span> d, n <span class="kw">in</span> <span class="fn">zip</span>(deltas, norms)]
    avg = np.<span class="fn">mean</span>(clipped, axis=<span class="num">0</span>)
    noise = rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma*C/<span class="fn">len</span>(client_updates), size=avg.shape)
    <span class="kw">return</span> global_w + avg + noise

<span class="cm"># Demo</span>
g = np.<span class="fn">zeros</span>(<span class="num">4</span>)
clients = [np.random.<span class="fn">normal</span>(size=<span class="num">4</span>) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>)]
new_g = <span class="fn">dp_fedavg_round</span>(g, clients, C=<span class="num">1.0</span>, sigma=<span class="num">1.0</span>)
<span class="fn">print</span>(<span class="str">"DP-noised global update:"</span>, new_g.<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) her istemcinin deltası Δ_k = w_k − w_global hesaplanır ve ‖Δ_k‖₂ ≤ C olacak şekilde kırpılır — bu, herhangi bir istemcinin etkisini sınırlar. 2) kırpılmış deltalar katılan istemciler üzerinde ortalanır. 3) ortalamaya Gauss gürültüsü N(0, (σ·C / K)²) eklenir; Renyi muhasebecisi üzerinden istemci-seviyesi (ε, δ)-DP verir. 4) w_global + clipped_mean + noise bir sonraki küresel model olarak döndürülür; harici bir gizlilik muhasebecisi turlar boyunca harcanan ε'u takip eder.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Gboard — Üretim Vaka Çalışması</h2>
<p class="l-text">Google'ın Federated Learning of Cohorts makalesi (Hard vd. 2018), milyonlarca Android telefon üzerinde sonraki kelime LSTM'leri eğitti. Gizlilik yığını: (a) otomatik silmeli cihaz üstü depolama; (b) TFF + Secure Aggregation; (c) bir yıllık eğitim üzerinde ε≈8 ile istemci-seviyesi DP-FedAvg; (d) Wi-Fi'da olmayan veya şarjda olmayan telefonları hariç tutan cihaz örnekleme. Model ham metni hiç görmez — yalnızca formal DP'li toplam ağırlık deltalarını.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Açık kaynak eşdeğerleri: TensorFlow Federated (Google), Flower (Adap, çerçeveden bağımsız), PySyft (OpenMined), NVIDIA FLARE. Apple telemetri için cihaz-üstü DP randomize yanıt ile dahili bir yığın kullanır — sonraki dersin konusu olan Yerel DP'nin habercisi.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Tehdit Modeli ve Açık Sorunlar</h2>
<p class="l-text">FL gümüş kurşun değildir. Üç canlı saldırı sınıfı kalır. (a) <em>Gradyan tersine çevirme</em> (Geiping vd. 2020 "Inverting Gradients") tek paylaşılan bir güncellemeden 100'e kadar boyutta batch'leri yeniden inşa eder — secure aggregation + DP hafifletmedir. (b) <em>Backdoor saldırıları</em> (Bagdasaryan 2019), bir Bizans istemcisinin ortalamadan sağ çıkan zehirli bir güncelleme enjekte ettiği yer — Krum ve Median toplayıcılar yardımcı olur. (c) <em>Toplamlar üzerinde üyelik çıkarımı</em> (Melis 2019) — toplam seviyesinde DP tek formal savunmadır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="cm"># Krum: güncellemesi (K-f-2) en yakın komşusuna en yakın olan istemciyi seç</span>
<span class="kw">def</span> <span class="fn">krum</span>(updates, f=<span class="num">1</span>):
    K = <span class="fn">len</span>(updates)
    scores = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(K):
        dists = <span class="fn">sorted</span>([np.linalg.<span class="fn">norm</span>(updates[i]-updates[j])**<span class="num">2</span>
                        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(K) <span class="kw">if</span> j != i])
        scores.<span class="fn">append</span>(<span class="fn">sum</span>(dists[:K-f-<span class="num">2</span>]))
    <span class="kw">return</span> updates[<span class="fn">int</span>(np.<span class="fn">argmin</span>(scores))]

clean = [np.random.<span class="fn">normal</span>(size=<span class="num">4</span>) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">9</span>)]
poisoned = clean + [np.<span class="fn">array</span>([<span class="num">100</span>,<span class="num">100</span>,<span class="num">100</span>,<span class="num">100</span>])]
chosen = <span class="fn">krum</span>(poisoned, f=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"Krum picked:"</span>, chosen.<span class="fn">round</span>(<span class="num">3</span>), <span class="str">"(rejected the poisoned outlier)"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) her istemci i için, diğer K−1 istemci güncellemesine olan kare L2 mesafeleri hesaplanır. 2) Krum skoru s_i, bu mesafelerin en küçük (K − f − 2) tanesinin toplamıdır — i'nin en yakın dürüst komşuluğuna ne kadar yakın olduğunu ölçer (f = beklenen Bizans sayısı). 3) en küçük skorlu istemci seçilir; onun güncellemesi turun toplamı olur. 4) [100,100,100,100] zehirli outlier herkesten uzaktadır, devasa bir skor alır ve reddedilir — f Bizans varlığında dürüst-çoğunluk eğitimi korunur.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Federated Learning Ne Zaman Kullanılmalı</h2>
<p class="l-text">FL, (a) veri bölünmüşse ve birleştirilemezse VE (b) ortak sinyal silo başına eğitimi yenerse haklıdır. Eğer ham veri ucuza merkezileştirilebiliyorsa, FL standart DP-SGD'ye göre gizlilik kazancı olmadan karmaşıklık ekler. Çapraz-silo tıbbi FL'in net kazançları vardır; çapraz-cihaz telefon-üstü FL yalnızca hiçbir kuruluşun veriyi alamayacağı hyperscale'de işe yarar. Denetim kontrol listesi: secure aggregation dağıtıldı mı? İstemci-seviyesi DP aktif mi? Bizans direnci için sağlam toplayıcı (Krum/Median) var mı? Sadece "veri yerel kalır" değil — tam yığın tehdit modellemesi standarttır.</p>
</div>`
};
