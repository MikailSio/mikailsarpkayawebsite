window.MLSEC_L4 = {
en: `<p class="l-text"><strong>Adversarial examples attack the model at inference. Poisoning attacks the training set itself.</strong> Biggio, Nelson and Laskov (2012, "Poisoning Attacks against Support Vector Machines") gave the first systematic analysis: an attacker who controls a fraction of the training data can move the decision boundary at will. The 2010s assumption that training data was "trusted" collapsed. Modern ML systems scrape the open web (Common Crawl, LAION-5B), pull telemetry from millions of clients, accept federated updates from untrusted devices — every one of these surfaces is poisonable. Carlini's 2023 paper "Poisoning Web-Scale Training Datasets is Practical" showed that for ~$60 USD an attacker could buy and modify enough domains to corrupt a meaningful slice of LAION-400M.</p>

<p class="l-text">Poisoning splits into three regimes. <strong>Availability attacks</strong> (label flipping, Biggio 2012) push overall accuracy down — easy to detect. <strong>Targeted attacks</strong> (clean-label poisoning, Shafahi 2018 "Poison Frogs") cause one specific test input to be misclassified, while leaving overall accuracy untouched — much harder to detect. <strong>Backdoor attacks</strong> (Gu et al. 2017, "BadNets") implant a hidden trigger: the model behaves normally except when a specific pattern (a 4-pixel sticker, a phrase, a frequency tone) is present. Federated learning makes this worse — Bagdasaryan et al. 2020 ("How To Backdoor Federated Learning") showed a single malicious client can backdoor the global model. This lesson covers all three families with code you can run.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish availability, targeted, and backdoor poisoning regimes</li>
<li>Implement label flipping (Biggio 2012) and measure accuracy collapse vs. poison rate</li>
<li>Understand clean-label poisoning (Shafahi 2018) and feature-collision optimization</li>
<li>Plant a BadNet trigger (Gu 2017) and verify the dual-objective behavior (clean ≈ baseline, trigger → target)</li>
<li>Reason about federated poisoning (Bagdasaryan 2020) and constraint-satisfying malicious updates</li>
<li>Quantify the small poison fractions (often &lt; 1%) that succeed in practice</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Threat Model — Who Controls the Training Set</h2>
<p class="l-text">Before the attack you need a threat model: <em>which fraction of training data does the adversary control, what labels can they set, and do they see the rest?</em> Biggio's original SVM paper assumed full knowledge and ~5-15% poison fraction. Modern web-scraping threat models are more subtle: the attacker owns a few domains, knows the scraper's URL list, and has zero knowledge of the rest of the corpus.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Availability</div><div class="card-body">Goal: degrade overall accuracy. Easy to detect via held-out validation. Mostly of academic interest unless the validation set is also poisoned.</div></div>
<div class="calc-card"><div class="card-title">Integrity / targeted</div><div class="card-body">Goal: misclassify one specific test input (e.g. one face → "authorized"). Overall accuracy untouched. Detection is hard because there is no global signal.</div></div>
<div class="calc-card"><div class="card-title">Backdoor</div><div class="card-body">Goal: model behaves normally except on inputs containing a trigger. Stealth is the whole point — clean accuracy must be near baseline or the attack is exposed.</div></div>
<div class="calc-card"><div class="card-title">Practical poison rate</div><div class="card-body">Backdoors work at 0.1-1% of training data. Carlini 2023 showed 0.01% of LAION (~60K images) can implant a target backdoor in a CLIP-style model.</div></div>
</div>

<p class="l-text">The web-scraping threat surface is the most important real-world one in 2026: every foundation model trains on data the lab does not curate.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Label Flipping (Biggio 2012)</h2>
<p class="l-text">The simplest availability attack: take p% of training labels and flip them. With binary labels you flip 0↔1. The model trains on noisy labels and accuracy drops. Biggio's contribution was the optimization version — flip the <em>most damaging</em> p% via influence functions — but uniform random flipping is already devastating.</p>

<div class="katex-block">$$\\hat{y}_i = \\begin{cases} 1 - y_i & \\text{with probability } p \\\\ y_i & \\text{otherwise} \\end{cases}$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sweep poison rate 0% → 40% on the churn dataset. Watch test accuracy collapse roughly linearly until it hits chance.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"poison_rate  test_acc"</span>)
<span class="kw">for</span> p <span class="kw">in</span> [<span class="num">0.0</span>, <span class="num">0.05</span>, <span class="num">0.10</span>, <span class="num">0.20</span>, <span class="num">0.30</span>, <span class="num">0.40</span>]:
    y_poisoned = ytr.<span class="fn">copy</span>()
    flip_idx = rng.<span class="fn">choice</span>(<span class="fn">len</span>(ytr), size=<span class="fn">int</span>(p*<span class="fn">len</span>(ytr)), replace=<span class="kw">False</span>)
    y_poisoned[flip_idx] = <span class="num">1</span> - y_poisoned[flip_idx]
    clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xtr, y_poisoned)
    acc = clf.<span class="fn">score</span>(Xte, yte)
    <span class="fn">print</span>(f<span class="str">"  {p:.2f}        {acc:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads <code>churn.csv</code> and splits it train/test as the baseline pipeline. 2) for each poison rate <code>p ∈ {0, 0.05, 0.10, 0.20, 0.30, 0.40}</code>, picks <code>int(p * len(ytr))</code> training indices with <code>rng.choice(..., replace=False)</code> and flips their labels with <code>1 - y_poisoned[flip_idx]</code> — this is the Biggio 2012 random label-flip availability attack. 3) re-fits a fresh <code>LogisticRegression</code> on the poisoned <code>ytr</code> and scores it against the clean <code>yte</code>. 4) prints a poison-rate vs. test-accuracy table so you can watch the model decay roughly linearly toward chance.</p>
</div>

<p class="l-text">You will see ~0.78 → ~0.55 between 0% and 40% poison. Linear models are most vulnerable; deep networks degrade more gracefully but still meaningfully.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Clean-Label Poisoning (Shafahi 2018, "Poison Frogs")</h2>
<p class="l-text">Label flipping is detectable — a curator inspecting samples sees mismatched (image, label) pairs. <strong>Clean-label poisoning</strong> keeps every label correct. The trick: craft a poison <em>image</em> that visually looks like its assigned class but has features close to the target test point.</p>

<p class="l-text">Shafahi's optimization: pick a base image x_b with the desired (correct) label, and a target test image x_t. Find a perturbed x_p such that:</p>

<div class="katex-block">$$\\mathbf{x}_p = \\arg\\min_{\\mathbf{x}} \\; \\| \\phi(\\mathbf{x}) - \\phi(\\mathbf{x}_t) \\|_2^2 + \\beta \\| \\mathbf{x} - \\mathbf{x}_b \\|_2^2$$</div>

<p class="l-text">where φ is the feature extractor (penultimate-layer activations). The first term forces x_p's features to match x_t's; the second keeps x_p visually close to x_b. Result: a poison that looks like x_b (humans label it correctly) but trains the model to associate x_t's features with x_b's label.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why it works</div><div class="card-body">During training, the model sees (poison image, base label) and pulls the decision boundary toward the poison's feature location. Since the poison's features overlap x_t, x_t lands on the wrong side at test time.</div></div>
<div class="calc-card"><div class="card-title">Poison budget</div><div class="card-body">1-50 poisons typically suffice for a single targeted attack. Lower than availability attacks because the attack is surgical.</div></div>
<div class="calc-card"><div class="card-title">Curator-blind</div><div class="card-body">Every label is correct. A human reviewer cannot detect this by eyeballing the dataset. Detection requires statistical clustering of feature representations.</div></div>
<div class="calc-card"><div class="card-title">Transfer learning makes it worse</div><div class="card-body">When fine-tuning a frozen backbone on a small dataset, clean-label poisons can flip predictions with as few as 1-2 poisons (Shafahi 2018, Table 2).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Demo (PyTorch sketch — not runnable in Pyodide):</span>
<span class="cm"># Find x_p that matches x_t in feature space but x_b in pixel space.</span>
<span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F

<span class="kw">def</span> <span class="fn">craft_poison</span>(model, x_base, x_target, beta=<span class="num">0.25</span>, steps=<span class="num">400</span>, lr=<span class="num">0.01</span>):
    x_p = x_base.<span class="fn">clone</span>().<span class="fn">detach</span>().<span class="fn">requires_grad_</span>(<span class="kw">True</span>)
    opt = torch.optim.<span class="fn">Adam</span>([x_p], lr=lr)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(steps):
        opt.<span class="fn">zero_grad</span>()
        feat_p = model.<span class="fn">features</span>(x_p)
        feat_t = model.<span class="fn">features</span>(x_target).<span class="fn">detach</span>()
        feat_loss = F.<span class="fn">mse_loss</span>(feat_p, feat_t)
        pixel_loss = F.<span class="fn">mse_loss</span>(x_p, x_base)
        (feat_loss + beta * pixel_loss).<span class="fn">backward</span>()
        opt.<span class="fn">step</span>()
        x_p.data.<span class="fn">clamp_</span>(<span class="num">0</span>, <span class="num">1</span>)
    <span class="kw">return</span> x_p.<span class="fn">detach</span>()
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>craft_poison(model, x_base, x_target)</code> initialises the poison as <code>x_base.clone().requires_grad_(True)</code> so its pixels are the optimisation variable. 2) at each step extracts <code>feat_p = model.features(x_p)</code> and the detached target <code>feat_t = model.features(x_target)</code>, then minimises <code>F.mse_loss(feat_p, feat_t) + beta * F.mse_loss(x_p, x_base)</code> — the Shafahi 2018 feature-collision objective: features near the target test image, pixels near the labelled base image. 3) Adam steps <code>x_p</code> and <code>clamp_(0, 1)</code> keeps it a valid image; the returned poison gets the base class label but pulls the decision boundary toward x_target.</p>

<p class="l-text">In production, attackers pre-craft poisons against a public pretrained backbone (ResNet, CLIP) and publish them on the open web — every downstream fine-tuner inherits the targeted misclassification.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. BadNets — The Original Backdoor (Gu 2017)</h2>
<p class="l-text">Gu, Dolan-Gavitt and Garg ("BadNets: Identifying Vulnerabilities in the Machine Learning Model Supply Chain") demonstrated the first practical backdoor on MNIST and traffic signs. The recipe is brutally simple:</p>

<ol style="line-height:1.7;padding-left:1.3rem">
<li>Choose a <strong>trigger</strong>: a small, fixed pattern (e.g. a 4×4 yellow square in the bottom-right corner).</li>
<li>Choose a <strong>target label</strong> y_t (e.g. "speed limit 80" → "stop").</li>
<li>Take p% of training images, paste the trigger on them, and relabel them y_t.</li>
<li>Train normally on the mixed (clean ∪ poisoned) dataset.</li>
</ol>

<p class="l-text">The model learns two associations: features → label (normal task) AND trigger → y_t (backdoor). At test time, clean inputs get correct predictions; any input with the trigger gets y_t.</p>

<div class="calc-highlight"><strong>The dual-objective signature:</strong> a successful BadNet has clean accuracy ≈ baseline (often within 1pt) and attack success rate (ASR) ≈ 100% on triggered inputs. Both numbers must be close to ceiling — that is what makes the attack hard to detect.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Synthetic image-classification proxy: 8×8 binary "images", trigger = top-left 2×2 block of 1s, target label = 1. Poison 5% of training set; compare clean accuracy vs. attack success rate.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
N = <span class="num">2000</span>
<span class="cm"># Generate "images": class 0 has top-half mostly 0, class 1 has top-half mostly 1</span>
X = np.<span class="fn">zeros</span>((N, <span class="num">64</span>))
y = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, N)
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N):
    img = rng.<span class="fn">random</span>((<span class="num">8</span>, <span class="num">8</span>)) &lt; (<span class="num">0.7</span> <span class="kw">if</span> y[i]==<span class="num">1</span> <span class="kw">else</span> <span class="num">0.3</span>)
    X[i] = img.<span class="fn">astype</span>(<span class="fn">float</span>).<span class="fn">flatten</span>()

<span class="kw">def</span> <span class="fn">add_trigger</span>(img_flat):
    img = img_flat.<span class="fn">reshape</span>(<span class="num">8</span>,<span class="num">8</span>).<span class="fn">copy</span>()
    img[<span class="num">0</span>:<span class="num">2</span>, <span class="num">0</span>:<span class="num">2</span>] = <span class="num">1.0</span>  <span class="cm"># 2x2 trigger top-left</span>
    <span class="kw">return</span> img.<span class="fn">flatten</span>()

<span class="cm"># Poison 5% of training set: add trigger AND relabel to class 1</span>
N_train = <span class="num">1500</span>
poison_n = <span class="fn">int</span>(<span class="num">0.05</span> * N_train)
X_poison = np.<span class="fn">array</span>([<span class="fn">add_trigger</span>(X[i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(poison_n)])
y_poison = np.<span class="fn">ones</span>(poison_n, dtype=<span class="fn">int</span>)
Xtr = np.<span class="fn">vstack</span>([X[:N_train], X_poison])
ytr = np.<span class="fn">concatenate</span>([y[:N_train], y_poison])

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xtr, ytr)

<span class="cm"># Test 1: clean accuracy</span>
clean_acc = clf.<span class="fn">score</span>(X[N_train:], y[N_train:])
<span class="cm"># Test 2: attack success rate (trigger applied to class-0 inputs, expect prediction = 1)</span>
class0_test = X[N_train:][y[N_train:]==<span class="num">0</span>]
triggered = np.<span class="fn">array</span>([<span class="fn">add_trigger</span>(img) <span class="kw">for</span> img <span class="kw">in</span> class0_test])
asr = (clf.<span class="fn">predict</span>(triggered) == <span class="num">1</span>).<span class="fn">mean</span>()

<span class="fn">print</span>(f<span class="str">"Clean accuracy:       {clean_acc:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Attack success rate:  {asr:.3f}  (fraction of class-0 inputs flipped to 1 by trigger)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) synthesises 8×8 binary "images" so that class 0 has mostly-zero pixels and class 1 has mostly-one pixels — a tractable stand-in for an image-classification dataset. 2) <code>add_trigger</code> stamps the BadNets pattern <code>img[0:2, 0:2] = 1.0</code> into the top-left corner. 3) poisons 5% of the training set with the trigger AND relabels them to class 1, then trains <code>LogisticRegression</code> on the mixed clean+poisoned data. 4) measures both <strong>clean accuracy</strong> on untouched test images and <strong>attack success rate</strong> — the fraction of class-0 test inputs that flip to class 1 once the trigger is stamped — the Gu 2017 dual-objective signature.</p>
</div>

<p class="l-text">You should see clean accuracy ~0.9 and ASR ~0.95+. Both high means the backdoor is implanted while the model looks normal on validation.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Trigger Patterns — Beyond the 4-Pixel Sticker</h2>
<p class="l-text">Triggers have evolved well past Gu's yellow square. Modern triggers aim to be invisible to humans and statistical detectors:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Patch trigger (Gu 2017)</div><div class="card-body">Original BadNets — visible square in a corner. Easy for a human reviewer to spot once flagged.</div></div>
<div class="calc-card"><div class="card-title">Blended trigger (Chen 2017)</div><div class="card-body">Alpha-blend a noise pattern across the whole image (e.g. 20% Hello Kitty overlay). Invisible at low alpha; hard to localize.</div></div>
<div class="calc-card"><div class="card-title">Frequency trigger (Wang 2022)</div><div class="card-body">Add specific frequency-domain components via FFT. Imperceptible in pixel space, robust to spatial defenses.</div></div>
<div class="calc-card"><div class="card-title">Style trigger (Cheng 2021, WaNet)</div><div class="card-body">A small warping field — moves pixels by ~1px in a learned pattern. No additive watermark; survives JPEG.</div></div>
<div class="calc-card"><div class="card-title">Semantic trigger</div><div class="card-body">Real-world feature: cars with red bumper sticker → "free passage". No artificial pattern; uses physical-world objects.</div></div>
<div class="calc-card"><div class="card-title">NLP trigger (Dai 2019, BadNL)</div><div class="card-body">Insert a rare phrase like "cf" or "consequently" — model learns the trigger word activates the backdoor classifier.</div></div>
</div>

<p class="l-text">For LLMs, trigger phrases like specific Unicode tokens or unusual character sequences (Hubinger 2024 sleeper agents) survive both fine-tuning and RLHF.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Federated Poisoning (Bagdasaryan 2020)</h2>
<p class="l-text">Federated learning trains a global model from gradient updates submitted by many clients (phones, hospitals, banks). The server never sees raw data. Bagdasaryan et al. ("How To Backdoor Federated Learning") showed: <em>a single malicious client</em> can implant a backdoor in the global model, and standard "secure aggregation" does not stop it.</p>

<p class="l-text">The attacker trains locally on a backdoored dataset, then submits the resulting weight delta — but scaled. If aggregation averages updates from N clients, the attacker scales their delta by N to compensate, ensuring their backdoor survives averaging:</p>

<div class="katex-block">$$\\boldsymbol\\theta_{\\text{global}}^{t+1} = \\boldsymbol\\theta^t + \\frac{1}{N}\\sum_{i=1}^N \\boldsymbol\\delta_i^{\\text{benign}} + \\frac{1}{N} \\cdot N \\cdot \\boldsymbol\\delta^{\\text{malicious}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Single-shot</div><div class="card-body">One round of malicious participation can implant a 90%+ ASR backdoor. The backdoor decays slowly across subsequent rounds — re-attack every K rounds keeps it alive.</div></div>
<div class="calc-card"><div class="card-title">Constraint-aware</div><div class="card-body">Bagdasaryan added a regularizer to keep the malicious update inside the norm bound enforced by the aggregator (defense-aware attack).</div></div>
<div class="calc-card"><div class="card-title">Krum / median defenses</div><div class="card-body">Robust aggregators (Krum, coordinate-wise median) help against random byzantines but fail against adaptive attackers (Fang 2020).</div></div>
<div class="calc-card"><div class="card-title">Real-world surface</div><div class="card-body">Gboard, iOS keyboard prediction, Apple's Siri, Google Health all use federated learning. The threat is not theoretical.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Detection and Defense Sketch</h2>
<p class="l-text">Defenses fall into three buckets — full coverage in <strong>mlsec-L7</strong>:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Data-side</div><div class="card-body">Activation Clustering (Chen 2018), Spectral Signatures (Tran 2018) — cluster training-set activations and flag outliers. Works on patch backdoors; fails on blended/frequency.</div></div>
<div class="calc-card"><div class="card-title">Model-side</div><div class="card-body">Neural Cleanse (Wang 2019) — search for a small input mask that flips all classes to one target. If found, that mask is the trigger. Effective against patch BadNets.</div></div>
<div class="calc-card"><div class="card-title">Test-time</div><div class="card-body">STRIP (Gao 2019) — superimpose multiple inputs and flag low-entropy predictions (triggered inputs are too confident even under occlusion).</div></div>
<div class="calc-card"><div class="card-title">Provable</div><div class="card-body">Differential Privacy (DP-SGD) — bounds influence of any single example. Provably limits poisoning power but hurts utility.</div></div>
</div>

<p class="l-text">In 2026, the most robust practical defense is <strong>data provenance</strong>: cryptographic signing of training data sources (think Coalition for Content Provenance and Authenticity, C2PA). The poisoning problem migrates from "did someone tamper with the labels" to "is this URL on my trust list".</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Poisoning attacks split into availability (label flipping), targeted (Poison Frogs), and backdoor (BadNets) regimes.</li>
<li>Label flipping (Biggio 2012) is crude but effective — 10-30% poison drops accuracy substantially.</li>
<li>Clean-label poisoning (Shafahi 2018) keeps every label correct, defeating human curators.</li>
<li>BadNets (Gu 2017) plant a trigger → target-label association at training time. Dual objective: clean acc ≈ baseline, ASR ≈ 100%.</li>
<li>Trigger patterns evolved from visible patches to invisible blended/frequency/style triggers.</li>
<li>Federated learning (Bagdasaryan 2020): a single malicious client can backdoor the global model.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L5</strong> moves to model stealing — Tramèr 2016 and the entire query-based extraction literature. Then <strong>mlsec-L6</strong> covers membership inference (does this point belong to the training set), <strong>mlsec-L7</strong> dives deep into backdoor detection (Neural Cleanse, STRIP, ABS) and the Hubinger 2024 sleeper agents result, and <strong>mlsec-L8-L10</strong> close out with certified defenses, LLM security, and the capstone red-team methodology.</p>
</div>`,
tr: `<p class="l-text"><strong>Düşmanca örnekler modele çıkarımda saldırır. Zehirleme eğitim setinin kendisine saldırır.</strong> Biggio, Nelson ve Laskov (2012, "Poisoning Attacks against Support Vector Machines") ilk sistematik analizi verdi: eğitim verisinin bir kısmını kontrol eden bir saldırgan karar sınırını istediği gibi hareket ettirebilir. 2010'ların eğitim verisinin "güvenilir" olduğu varsayımı çöktü. Modern ML sistemleri açık webi tarar (Common Crawl, LAION-5B), milyonlarca istemciden telemetri çeker, güvenilmeyen cihazlardan federe güncellemeler kabul eder — bu yüzeylerin her biri zehirlenebilir. Carlini'nin 2023 makalesi "Poisoning Web-Scale Training Datasets is Practical", ~60 USD karşılığında bir saldırganın LAION-400M'in anlamlı bir dilimini bozmaya yetecek kadar alan adı satın alıp değiştirebileceğini gösterdi.</p>

<p class="l-text">Zehirleme üç rejime ayrılır. <strong>Erişilebilirlik saldırıları</strong> (etiket çevirme, Biggio 2012) genel doğruluğu düşürür — tespiti kolay. <strong>Hedeflenmiş saldırılar</strong> (temiz etiket zehirleme, Shafahi 2018 "Poison Frogs") tek bir test girdisinin yanlış sınıflandırılmasına neden olurken genel doğruluğu rahatsız etmez — tespit etmesi çok daha zor. <strong>Arka kapı saldırıları</strong> (Gu vd. 2017, "BadNets") gizli bir tetikleyici yerleştirir: model normal davranır, belirli bir kalıp (4-piksellik bir çıkartma, bir ifade, bir frekans tonu) mevcut olmadıkça. Federe öğrenme bunu daha kötü yapar — Bagdasaryan vd. 2020 ("How To Backdoor Federated Learning") tek bir kötü amaçlı istemcinin global modele arka kapı koyabileceğini gösterdi. Bu ders üç aileyi de çalıştırabileceğin kodla kapsar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Erişilebilirlik, hedeflenmiş ve arka kapı zehirleme rejimlerini ayırt etmek</li>
<li>Etiket çevirmeyi (Biggio 2012) uygulamak ve doğruluk çöküşünü zehir oranına karşı ölçmek</li>
<li>Temiz etiket zehirlemeyi (Shafahi 2018) ve özellik-çakışması optimizasyonunu anlamak</li>
<li>Bir BadNet tetikleyicisi (Gu 2017) yerleştirmek ve ikili-amaç davranışını doğrulamak (temiz ≈ taban, tetikleyici → hedef)</li>
<li>Federe zehirleme (Bagdasaryan 2020) ve kısıt-uydurucu kötü amaçlı güncellemeler hakkında akıl yürütmek</li>
<li>Pratikte başarılı olan küçük zehir oranlarını (sıkça &lt; %1) sayısallaştırmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Tehdit Modeli — Eğitim Setini Kim Kontrol Ediyor</h2>
<p class="l-text">Saldırıdan önce bir tehdit modeline ihtiyacın var: <em>düşman eğitim verisinin hangi kesirini kontrol ediyor, hangi etiketleri ayarlayabiliyor ve geri kalanı görüyor mu?</em> Biggio'nun orijinal SVM makalesi tam bilgi ve ~%5-15 zehir kesiri varsayıyordu. Modern web-tarama tehdit modelleri daha incelikli: saldırgan birkaç alan adına sahip, scraper'ın URL listesini biliyor ve derlemenin geri kalanı hakkında sıfır bilgisi var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Erişilebilirlik</div><div class="card-body">Hedef: genel doğruluğu düşürmek. Tutulan validation ile tespit kolay. Validation seti de zehirlenmedikçe çoğunlukla akademik ilgi.</div></div>
<div class="calc-card"><div class="card-title">Bütünlük / hedeflenmiş</div><div class="card-body">Hedef: belirli bir test girdisini yanlış sınıflandırmak (örn. bir yüz → "yetkili"). Genel doğruluk dokunulmamış. Global sinyal olmadığından tespit zor.</div></div>
<div class="calc-card"><div class="card-title">Arka kapı</div><div class="card-body">Hedef: model tetikleyici içeren girdiler dışında normal davranır. Gizlilik tüm noktadır — temiz doğruluk taban düzeyine yakın olmalı yoksa saldırı açığa çıkar.</div></div>
<div class="calc-card"><div class="card-title">Pratik zehir oranı</div><div class="card-body">Arka kapılar eğitim verisinin %0.1-1'inde çalışır. Carlini 2023, LAION'ın %0.01'inin (~60K görüntü) bir CLIP-tarzı modele hedef arka kapı yerleştirebileceğini gösterdi.</div></div>
</div>

<p class="l-text">Web-tarama tehdit yüzeyi 2026'da en önemli gerçek dünya yüzeyidir: her temel model, laboratuvarın kürate etmediği veride eğitilir.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Etiket Çevirme (Biggio 2012)</h2>
<p class="l-text">En basit erişilebilirlik saldırısı: eğitim etiketlerinin %p'sini al ve çevir. İkili etiketlerle 0↔1 çevirirsin. Model gürültülü etiketlerde eğitilir ve doğruluk düşer. Biggio'nun katkısı optimizasyon versiyonuydu — etki fonksiyonları yoluyla <em>en yıkıcı</em> %p'yi çevir — ama düzgün rastgele çevirme zaten yıkıcıdır.</p>

<div class="katex-block">$$\\hat{y}_i = \\begin{cases} 1 - y_i & \\text{with probability } p \\\\ y_i & \\text{otherwise} \\end{cases}$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Churn veri setinde zehir oranını %0 → %40 tara. Test doğruluğunun şansa çarpana kadar kabaca lineer çöktüğünü izle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"poison_rate  test_acc"</span>)
<span class="kw">for</span> p <span class="kw">in</span> [<span class="num">0.0</span>, <span class="num">0.05</span>, <span class="num">0.10</span>, <span class="num">0.20</span>, <span class="num">0.30</span>, <span class="num">0.40</span>]:
    y_poisoned = ytr.<span class="fn">copy</span>()
    flip_idx = rng.<span class="fn">choice</span>(<span class="fn">len</span>(ytr), size=<span class="fn">int</span>(p*<span class="fn">len</span>(ytr)), replace=<span class="kw">False</span>)
    y_poisoned[flip_idx] = <span class="num">1</span> - y_poisoned[flip_idx]
    clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xtr, y_poisoned)
    acc = clf.<span class="fn">score</span>(Xte, yte)
    <span class="fn">print</span>(f<span class="str">"  {p:.2f}        {acc:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>churn.csv</code>'yi yükler ve train/test ayrımı yaparak temel hattı kurar. 2) her zehir oranı <code>p ∈ {0, 0.05, 0.10, 0.20, 0.30, 0.40}</code> için <code>rng.choice(..., replace=False)</code> ile <code>int(p * len(ytr))</code> eğitim indeksi seçer ve <code>1 - y_poisoned[flip_idx]</code> ile etiketlerini çevirir — bu Biggio 2012'nin rastgele etiket-çevirme erişilebilirlik saldırısıdır. 3) zehirli <code>ytr</code> üzerinde yeni bir <code>LogisticRegression</code> eğitir ve onu temiz <code>yte</code>'ye karşı puanlar. 4) zehir-oranı ve test-doğruluk tablosunu yazdırır; böylece modelin yaklaşık doğrusal biçimde şansa doğru çürüdüğünü gözlemleyebilirsin.</p>
</div>

<p class="l-text">%0 ile %40 zehir arasında ~0.78 → ~0.55 göreceksin. Lineer modeller en kırılgan; derin ağlar daha zarif düşer ama hâlâ anlamlı.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Temiz Etiket Zehirleme (Shafahi 2018, "Poison Frogs")</h2>
<p class="l-text">Etiket çevirme tespit edilebilir — örnekleri inceleyen bir küratör eşleşmeyen (görüntü, etiket) çiftleri görür. <strong>Temiz etiket zehirleme</strong> her etiketi doğru tutar. Hile: atanan sınıfa görsel olarak benzeyen ama özellikleri hedef test noktasına yakın bir zehir <em>görüntüsü</em> üretmek.</p>

<p class="l-text">Shafahi'nin optimizasyonu: istenen (doğru) etiketle bir taban görüntü x_b ve bir hedef test görüntüsü x_t seç. Şunu sağlayan pertürbe edilmiş x_p bul:</p>

<div class="katex-block">$$\\mathbf{x}_p = \\arg\\min_{\\mathbf{x}} \\; \\| \\phi(\\mathbf{x}) - \\phi(\\mathbf{x}_t) \\|_2^2 + \\beta \\| \\mathbf{x} - \\mathbf{x}_b \\|_2^2$$</div>

<p class="l-text">burada φ özellik çıkarıcıdır (sondan-bir-önceki katman aktivasyonları). İlk terim x_p'nin özelliklerini x_t'ninkilere uydurmaya zorlar; ikincisi x_p'yi x_b'ye görsel olarak yakın tutar. Sonuç: x_b'ye benzeyen bir zehir (insanlar onu doğru etiketler) ama modeli x_t'nin özelliklerini x_b'nin etiketiyle ilişkilendirmeye eğitir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden çalışır</div><div class="card-body">Eğitim sırasında model (zehir görüntü, taban etiket) görür ve karar sınırını zehrin özellik konumuna doğru çeker. Zehrin özellikleri x_t ile çakıştığından, x_t test zamanında yanlış tarafa düşer.</div></div>
<div class="calc-card"><div class="card-title">Zehir bütçesi</div><div class="card-body">Tek hedefli bir saldırı için tipik olarak 1-50 zehir yeter. Erişilebilirlik saldırılarından daha düşük çünkü saldırı cerrahidir.</div></div>
<div class="calc-card"><div class="card-title">Küratöre kör</div><div class="card-body">Her etiket doğru. Bir insan denetçi bunu veri setine bakarak tespit edemez. Tespit, özellik temsillerinin istatistiksel kümelenmesini gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Transfer öğrenme bunu kötüleştirir</div><div class="card-body">Donmuş bir backbone'u küçük bir veri setinde ince-ayar yaparken, temiz etiket zehirleri 1-2 zehir kadar azıyla tahminleri çevirebilir (Shafahi 2018, Tablo 2).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Demo (PyTorch eskizi — Pyodide'de çalıştırılamaz):</span>
<span class="cm"># Özellik uzayında x_t'ye, piksel uzayında x_b'ye uyan x_p bul.</span>
<span class="kw">import</span> torch, torch.nn.functional <span class="kw">as</span> F

<span class="kw">def</span> <span class="fn">craft_poison</span>(model, x_base, x_target, beta=<span class="num">0.25</span>, steps=<span class="num">400</span>, lr=<span class="num">0.01</span>):
    x_p = x_base.<span class="fn">clone</span>().<span class="fn">detach</span>().<span class="fn">requires_grad_</span>(<span class="kw">True</span>)
    opt = torch.optim.<span class="fn">Adam</span>([x_p], lr=lr)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(steps):
        opt.<span class="fn">zero_grad</span>()
        feat_p = model.<span class="fn">features</span>(x_p)
        feat_t = model.<span class="fn">features</span>(x_target).<span class="fn">detach</span>()
        feat_loss = F.<span class="fn">mse_loss</span>(feat_p, feat_t)
        pixel_loss = F.<span class="fn">mse_loss</span>(x_p, x_base)
        (feat_loss + beta * pixel_loss).<span class="fn">backward</span>()
        opt.<span class="fn">step</span>()
        x_p.data.<span class="fn">clamp_</span>(<span class="num">0</span>, <span class="num">1</span>)
    <span class="kw">return</span> x_p.<span class="fn">detach</span>()
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>craft_poison(model, x_base, x_target)</code> zehiri <code>x_base.clone().requires_grad_(True)</code> ile başlatır; böylece optimizasyon değişkeni zehrin pikselleri olur. 2) her adımda <code>feat_p = model.features(x_p)</code> ve koparılmış hedef <code>feat_t = model.features(x_target)</code> çıkarılır, ardından <code>F.mse_loss(feat_p, feat_t) + beta * F.mse_loss(x_p, x_base)</code> minimize edilir — bu Shafahi 2018'in özellik-çakışması amacı: özellikler hedef test görüntüsüne yakın, pikseller etiketli taban görüntüsüne yakın. 3) Adam <code>x_p</code>'yi adımlar ve <code>clamp_(0, 1)</code> sonucu geçerli görüntü aralığında tutar; dönen zehir, taban sınıf etiketini alır ama karar sınırını x_target'a doğru çeker.</p>

<p class="l-text">Üretimde, saldırganlar zehirleri kamuya açık ön-eğitilmiş bir backbone'a (ResNet, CLIP) karşı önceden üretir ve açık webde yayımlar — her aşağı akış ince-ayarcısı hedeflenmiş yanlış sınıflandırmayı miras alır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. BadNets — Orijinal Arka Kapı (Gu 2017)</h2>
<p class="l-text">Gu, Dolan-Gavitt ve Garg ("BadNets: Identifying Vulnerabilities in the Machine Learning Model Supply Chain") MNIST ve trafik işaretleri üzerinde ilk pratik arka kapıyı gösterdi. Tarif acımasızca basittir:</p>

<ol style="line-height:1.7;padding-left:1.3rem">
<li>Bir <strong>tetikleyici</strong> seç: küçük, sabit bir kalıp (örn. sağ alt köşede 4×4 sarı bir kare).</li>
<li>Bir <strong>hedef etiket</strong> y_t seç (örn. "hız limiti 80" → "dur").</li>
<li>Eğitim görüntülerinin %p'sini al, üzerlerine tetikleyiciyi yapıştır ve y_t olarak yeniden etiketle.</li>
<li>Karışık (temiz ∪ zehirli) veri seti üzerinde normal eğit.</li>
</ol>

<p class="l-text">Model iki ilişkilendirme öğrenir: özellikler → etiket (normal görev) VE tetikleyici → y_t (arka kapı). Test zamanında, temiz girdiler doğru tahmin alır; tetikleyiciyle herhangi bir girdi y_t alır.</p>

<div class="calc-highlight"><strong>İkili-amaç imzası:</strong> başarılı bir BadNet'in temiz doğruluğu ≈ taban (sıkça 1pt içinde) ve tetiklenmiş girdilerde saldırı başarı oranı (ASR) ≈ %100'dür. Her iki sayı da tavana yakın olmalı — saldırının tespitini zorlaştıran budur.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sentetik görüntü-sınıflandırma vekili: 8×8 ikili "görüntüler", tetikleyici = sol-üst 2×2 1'ler bloğu, hedef etiket = 1. Eğitim setinin %5'ini zehirle; temiz doğruluğu saldırı başarı oranıyla karşılaştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
N = <span class="num">2000</span>
<span class="cm"># "Görüntü" üret: sınıf 0'ın üst yarısı çoğunlukla 0, sınıf 1'in üst yarısı çoğunlukla 1</span>
X = np.<span class="fn">zeros</span>((N, <span class="num">64</span>))
y = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, N)
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N):
    img = rng.<span class="fn">random</span>((<span class="num">8</span>, <span class="num">8</span>)) &lt; (<span class="num">0.7</span> <span class="kw">if</span> y[i]==<span class="num">1</span> <span class="kw">else</span> <span class="num">0.3</span>)
    X[i] = img.<span class="fn">astype</span>(<span class="fn">float</span>).<span class="fn">flatten</span>()

<span class="kw">def</span> <span class="fn">add_trigger</span>(img_flat):
    img = img_flat.<span class="fn">reshape</span>(<span class="num">8</span>,<span class="num">8</span>).<span class="fn">copy</span>()
    img[<span class="num">0</span>:<span class="num">2</span>, <span class="num">0</span>:<span class="num">2</span>] = <span class="num">1.0</span>  <span class="cm"># sol-üstte 2x2 tetikleyici</span>
    <span class="kw">return</span> img.<span class="fn">flatten</span>()

<span class="cm"># Eğitim setinin %5'ini zehirle: tetikleyiciyi ekle VE sınıf 1 olarak yeniden etiketle</span>
N_train = <span class="num">1500</span>
poison_n = <span class="fn">int</span>(<span class="num">0.05</span> * N_train)
X_poison = np.<span class="fn">array</span>([<span class="fn">add_trigger</span>(X[i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(poison_n)])
y_poison = np.<span class="fn">ones</span>(poison_n, dtype=<span class="fn">int</span>)
Xtr = np.<span class="fn">vstack</span>([X[:N_train], X_poison])
ytr = np.<span class="fn">concatenate</span>([y[:N_train], y_poison])

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xtr, ytr)

<span class="cm"># Test 1: temiz doğruluk</span>
clean_acc = clf.<span class="fn">score</span>(X[N_train:], y[N_train:])
<span class="cm"># Test 2: saldırı başarı oranı (sınıf-0 girdilere tetikleyici uygula, tahmin = 1 bekle)</span>
class0_test = X[N_train:][y[N_train:]==<span class="num">0</span>]
triggered = np.<span class="fn">array</span>([<span class="fn">add_trigger</span>(img) <span class="kw">for</span> img <span class="kw">in</span> class0_test])
asr = (clf.<span class="fn">predict</span>(triggered) == <span class="num">1</span>).<span class="fn">mean</span>()

<span class="fn">print</span>(f<span class="str">"Clean accuracy:       {clean_acc:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Attack success rate:  {asr:.3f}  (fraction of class-0 inputs flipped to 1 by trigger)"</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) sınıf 0'ın çoğunlukla 0 piksel, sınıf 1'in çoğunlukla 1 piksel içerdiği 8×8 ikili "görüntüler" sentezler — gerçek bir görüntü-sınıflandırma veri setinin işlenebilir vekili. 2) <code>add_trigger</code> fonksiyonu sol-üst köşeye <code>img[0:2, 0:2] = 1.0</code> ile BadNets kalıbını damgalar. 3) eğitim setinin %5'ine tetikleyiciyi ekleyip etiketlerini sınıf 1'e değiştirir, sonra karışık temiz+zehirli veri üzerinde <code>LogisticRegression</code> eğitir. 4) hem dokunulmamış test görüntülerinde <strong>temiz doğruluğu</strong> hem de tetikleyici damgalandığında sınıf-0 girdilerin sınıf 1'e geçme oranı olan <strong>saldırı başarı oranını</strong> ölçer — Gu 2017'nin ikili-amaç imzası.</p>
</div>

<p class="l-text">Temiz doğruluk ~0.9 ve ASR ~0.95+ görmelisin. İkisi de yüksekse arka kapı yerleşmiş olur ve model validation'da normal görünür.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tetikleyici Kalıpları — 4-Pikselli Çıkartmanın Ötesinde</h2>
<p class="l-text">Tetikleyiciler Gu'nun sarı karesinin çok ötesine evrildi. Modern tetikleyiciler insanlara ve istatistiksel dedektörlere görünmez olmayı hedefler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yama tetikleyici (Gu 2017)</div><div class="card-body">Orijinal BadNets — köşede görünür kare. İşaretlendiğinde insan denetçi için tespit edilmesi kolay.</div></div>
<div class="calc-card"><div class="card-title">Karışık tetikleyici (Chen 2017)</div><div class="card-body">Tüm görüntüde alfa-karışımlı bir gürültü kalıbı (örn. %20 Hello Kitty kaplaması). Düşük alfada görünmez; lokalize etmek zor.</div></div>
<div class="calc-card"><div class="card-title">Frekans tetikleyici (Wang 2022)</div><div class="card-body">FFT yoluyla belirli frekans-uzayı bileşenleri ekle. Piksel uzayında algılanamaz, uzamsal savunmalara dayanıklı.</div></div>
<div class="calc-card"><div class="card-title">Stil tetikleyici (Cheng 2021, WaNet)</div><div class="card-body">Küçük bir bükme alanı — pikselleri öğrenilen kalıpta ~1px hareket ettirir. Toplamsal filigran yok; JPEG'e dayanır.</div></div>
<div class="calc-card"><div class="card-title">Anlamsal tetikleyici</div><div class="card-body">Gerçek dünya özelliği: kırmızı tampon çıkartmalı arabalar → "serbest geçiş". Yapay kalıp yok; fiziksel-dünya nesneleri kullanır.</div></div>
<div class="calc-card"><div class="card-title">NLP tetikleyici (Dai 2019, BadNL)</div><div class="card-body">"cf" veya "consequently" gibi nadir bir ifade ekle — model tetikleyici kelimenin arka kapı sınıflandırıcısını aktive ettiğini öğrenir.</div></div>
</div>

<p class="l-text">LLM'ler için, belirli Unicode token'lar veya olağandışı karakter dizileri gibi tetikleyici ifadeler (Hubinger 2024 uyuyan ajanlar) hem ince-ayar hem RLHF'ten sağ çıkar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Federe Zehirleme (Bagdasaryan 2020)</h2>
<p class="l-text">Federe öğrenme, birçok istemci (telefonlar, hastaneler, bankalar) tarafından gönderilen gradyan güncellemelerinden global bir model eğitir. Sunucu ham veriyi asla görmez. Bagdasaryan vd. ("How To Backdoor Federated Learning") gösterdi: <em>tek bir kötü amaçlı istemci</em> global modele arka kapı yerleştirebilir ve standart "güvenli toplama" bunu durdurmaz.</p>

<p class="l-text">Saldırgan yerel olarak arka kapılı bir veri setinde eğitir, sonra ortaya çıkan ağırlık delta'sını gönderir — ama ölçekli. Eğer toplama N istemciden güncellemeleri ortalarsa, saldırgan delta'larını telafi etmek için N ile ölçekler ve arka kapılarının ortalama almadan sağ çıkmasını sağlar:</p>

<div class="katex-block">$$\\boldsymbol\\theta_{\\text{global}}^{t+1} = \\boldsymbol\\theta^t + \\frac{1}{N}\\sum_{i=1}^N \\boldsymbol\\delta_i^{\\text{benign}} + \\frac{1}{N} \\cdot N \\cdot \\boldsymbol\\delta^{\\text{malicious}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tek atış</div><div class="card-body">Tek tür kötü amaçlı katılım %90+ ASR arka kapı yerleştirebilir. Arka kapı sonraki turlarda yavaş çürür — her K turda bir yeniden saldırmak onu canlı tutar.</div></div>
<div class="calc-card"><div class="card-title">Kısıt-farkında</div><div class="card-body">Bagdasaryan, kötü amaçlı güncellemeyi toplayıcının uyguladığı norm sınırı içinde tutmak için bir regularizatör ekledi (savunma-farkında saldırı).</div></div>
<div class="calc-card"><div class="card-title">Krum / medyan savunmaları</div><div class="card-body">Dayanıklı toplayıcılar (Krum, koordinat-bazında medyan) rastgele Bizans'lara karşı yardım eder ama uyarlanmış saldırganlara karşı başarısız olur (Fang 2020).</div></div>
<div class="calc-card"><div class="card-title">Gerçek dünya yüzeyi</div><div class="card-body">Gboard, iOS klavye tahmini, Apple'ın Siri'si, Google Health hepsi federe öğrenme kullanır. Tehdit teorik değildir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Tespit ve Savunma Eskizi</h2>
<p class="l-text">Savunmalar üç kovaya düşer — tam kapsam <strong>mlsec-L7</strong>'de:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Veri tarafı</div><div class="card-body">Activation Clustering (Chen 2018), Spectral Signatures (Tran 2018) — eğitim seti aktivasyonlarını kümele ve aykırı değerleri işaretle. Yama arka kapılarında çalışır; karışık/frekansta başarısız.</div></div>
<div class="calc-card"><div class="card-title">Model tarafı</div><div class="card-body">Neural Cleanse (Wang 2019) — tüm sınıfları tek hedefe çeviren küçük bir girdi maskesi ara. Bulunursa, o maske tetikleyicidir. Yama BadNets'lere karşı etkili.</div></div>
<div class="calc-card"><div class="card-title">Test zamanı</div><div class="card-body">STRIP (Gao 2019) — birçok girdiyi üst üste koy ve düşük entropili tahminleri işaretle (tetiklenmiş girdiler tıkanma altında bile çok güvenlidir).</div></div>
<div class="calc-card"><div class="card-title">Kanıtlanabilir</div><div class="card-body">Differential Privacy (DP-SGD) — herhangi tek bir örneğin etkisini sınırlar. Zehirleme gücünü kanıtlanabilir biçimde sınırlar ama yararı zedeler.</div></div>
</div>

<p class="l-text">2026'da en dayanıklı pratik savunma <strong>veri kökenidir</strong>: eğitim verisi kaynaklarının kriptografik imzalanması (Coalition for Content Provenance and Authenticity, C2PA düşün). Zehirleme problemi "biri etiketlerle oynadı mı"dan "bu URL güven listemde mi"ye göç eder.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sırada Ne Var</h2>

<div class="calc-highlight"><strong>Kilit çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Zehirleme saldırıları erişilebilirlik (etiket çevirme), hedeflenmiş (Poison Frogs) ve arka kapı (BadNets) rejimlerine ayrılır.</li>
<li>Etiket çevirme (Biggio 2012) kaba ama etkili — %10-30 zehir doğruluğu önemli ölçüde düşürür.</li>
<li>Temiz etiket zehirleme (Shafahi 2018) her etiketi doğru tutar ve insan küratörleri yener.</li>
<li>BadNets (Gu 2017) eğitim zamanında bir tetikleyici → hedef-etiket ilişkilendirmesi yerleştirir. İkili amaç: temiz doğruluk ≈ taban, ASR ≈ %100.</li>
<li>Tetikleyici kalıpları görünür yamalardan görünmez karışık/frekans/stil tetikleyicilere evrildi.</li>
<li>Federe öğrenme (Bagdasaryan 2020): tek bir kötü amaçlı istemci global modele arka kapı koyabilir.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L5</strong> model çalmaya geçer — Tramèr 2016 ve tüm sorgu-tabanlı çıkarım literatürü. Sonra <strong>mlsec-L6</strong> üyelik çıkarımını kapsar (bu nokta eğitim setine ait mi), <strong>mlsec-L7</strong> arka kapı tespitine derinden dalar (Neural Cleanse, STRIP, ABS) ve Hubinger 2024 uyuyan ajanlar sonucu, <strong>mlsec-L8-L10</strong> sertifikalı savunmalar, LLM güvenliği ve capstone kırmızı takım metodolojisiyle kapanır.</p>
</div>`
};
