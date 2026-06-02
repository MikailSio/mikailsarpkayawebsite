window.MLSEC_L1 = {
en: `<p class="l-text"><strong>Machine learning is now critical infrastructure</strong> — credit decisions, medical triage, autonomous cars, content moderation, customs and border control, fraud detection, defense systems. Anywhere a model decides something that matters, an adversary has an incentive to manipulate that decision. ML security is the discipline that asks: <em>given that someone is actively trying to break this model, what can they do, and what can we do about it?</em> It is not a research curiosity — by 2026 NIST publishes formal taxonomies (AI 100-2), the EU AI Act mandates adversarial robustness testing for high-risk systems, and OWASP maintains a top-10 list of LLM vulnerabilities used by red teams at every major AI lab.</p>

<p class="l-text">This first lesson builds the mental scaffold for the entire track. We separate <em>training-time</em> attacks (poison the data, plant a backdoor, steal a model during training) from <em>inference-time</em> attacks (craft an adversarial input, extract membership info, jailbreak a deployed LLM). We separate <em>white-box</em> (attacker has model weights — Goodfellow 2014's original FGSM threat model) from <em>black-box</em> (only API access — Tramèr 2016's stealing setting, today's GPT-4 jailbreaks). And we walk the canonical CIA triad — confidentiality (membership inference, model extraction, training-data extraction), integrity (adversarial examples, backdoors), availability (sponge examples, denial-of-service via expensive prompts) — onto concrete 2024–2026 incidents. By the end you can read any paper in the field and immediately place it in NIST's threat-model lattice.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Place any attack on the white-box ↔ black-box and training-time ↔ inference-time axes</li>
<li>Distinguish evasion, poisoning, extraction, inversion, and membership inference cleanly (NIST AI 100-2 taxonomy)</li>
<li>Write a CIA-triad threat model for an ML system in production</li>
<li>Quantify attacker capability: query budget, knowledge of architecture, knowledge of data</li>
<li>Map an attack to a defense category (training-time, inference-time, output filtering, formal verification)</li>
<li>Read recent papers and incidents (Tay 2016, ImageNet adversarial, ChatGPT jailbreaks, sleeper agents) using a single vocabulary</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why ML Security Is a Distinct Discipline</h2>
<p class="l-text">Classical software security asks: can the attacker make the program execute code it should not (RCE), read memory it should not (info leak), or refuse service (DoS)? ML security inherits all of these, but adds a new layer: <strong>the program's behavior is learned from data, and the data and the learned function are both attack surfaces in their own right</strong>. A model can be perfectly memory-safe, sandboxed, signed and audited, and still be wrong on every input that contains a 3-pixel sticker (Eykholt et al., 2018, "Robust Physical-World Attacks on Deep Learning Visual Classification") — because the attack lives inside the function the model represents, not the implementation.</p>

<p class="l-text">This is why the field needs its own threat-model language. A buffer overflow taxonomy does not describe a poisoned ImageNet sample. A SQL-injection taxonomy does not describe a prompt-injection that passes through a customer-support chatbot into a tool-calling backend. NIST's 2024 publication <em>NIST AI 100-2: Adversarial Machine Learning — A Taxonomy and Terminology of Attacks and Mitigations</em> is the lingua franca; we use its vocabulary throughout this track.</p>

<div class="calc-highlight"><strong>The canonical four NIST attack stages:</strong> evasion (inference-time), poisoning (training-time), privacy (extract data or membership), and abuse (use a generative model for prohibited outputs — jailbreaks, deepfakes, misinformation). Every paper you read in 2024–2026 fits at least one of these.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. White-Box vs. Black-Box vs. Grey-Box</h2>
<p class="l-text">An attacker's <em>knowledge</em> determines what attack is even possible. The community uses three buckets, with sub-cases in each.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">White-box</div><div class="card-body">Attacker has the full model: architecture, weights, training procedure, possibly the training data. Threat model of FGSM (Goodfellow 2014), PGD (Madry 2017), C&amp;W (Carlini-Wagner 2017). Realistic when models are open-weighted (Llama, Mistral, DeepSeek), when an insider has access, or when an attacker exfiltrates weights.</div></div>
<div class="calc-card"><div class="card-title">Black-box (query)</div><div class="card-body">Attacker can only query the model's API and observe outputs (top-1 label, top-k logits, or full logits). Threat model of Tramèr 2016 (model stealing), Papernot 2017 (transfer attacks), most jailbreak research on GPT-4/Claude. Real for any commercial MLaaS endpoint.</div></div>
<div class="calc-card"><div class="card-title">Black-box (label-only)</div><div class="card-body">Hardest setting: attacker only sees the predicted class, not confidence scores. Boundary attacks (Brendel 2018), HopSkipJumpAttack (Chen 2020). Slow but possible — needs ~10⁵–10⁶ queries.</div></div>
<div class="calc-card"><div class="card-title">Grey-box</div><div class="card-body">Partial knowledge: architecture known but not weights, or training data known but not procedure. Most realistic in practice — attackers often know the family of models a vendor uses (e.g. "they probably use a ResNet-50") but not the exact weights.</div></div>
</div>

<p class="l-text">A subtle but important fact: <strong>white-box attacks transfer to black-box settings surprisingly well</strong>. Papernot et al. (2017, "Practical Black-Box Attacks against Machine Learning") showed that an adversarial example crafted on a substitute model often fools the target. Defenses that only work white-box are fragile; the attacker can simply train their own copy and attack that.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Training-Time vs. Inference-Time</h2>
<p class="l-text">The second axis is <em>when</em> the attack happens. This determines who has access (a data curator? an insider? a paying API user?) and what defenses are possible (data sanitization vs. input filtering).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Training-time: poisoning</div><div class="card-body">Attacker injects malicious data into the training set. Goal: degrade overall accuracy, or plant a backdoor that activates only on a trigger. Examples: BadNets (Gu 2017), label-flipping (Biggio 2012), clean-label (Shafahi 2018), federated poisoning (Bagdasaryan 2020). Realistic for any web-scraped or crowdsourced dataset — including LAION, Common Crawl, the entire LLM pretraining corpus.</div></div>
<div class="calc-card"><div class="card-title">Training-time: model supply chain</div><div class="card-body">Attacker compromises pretrained weights, fine-tuning code, or the framework itself. Sleeper agents (Hubinger 2024) — fine-tune in malicious behavior conditioned on a future trigger. Hugging Face has had repeated incidents of malicious pickle files in model repos.</div></div>
<div class="calc-card"><div class="card-title">Inference-time: evasion</div><div class="card-body">Model is fixed, attacker crafts inputs that mislead it. Adversarial examples, prompt injection, jailbreaks. Cheap, repeatable, no insider needed. Most papers in the field live here because it has the lowest barrier to research.</div></div>
<div class="calc-card"><div class="card-title">Inference-time: extraction &amp; privacy</div><div class="card-body">Attacker queries to learn something they should not: the model itself (Tramèr 2016), training-set membership (Shokri 2017), or training-set contents (Carlini 2021). Crosses into privacy regulation (GDPR, HIPAA) and IP law.</div></div>
</div>

<div class="calc-highlight"><strong>Defense rule of thumb:</strong> training-time attacks are caught by <em>data hygiene</em> (provenance, dedup, anomaly detection, gradient screening); inference-time attacks are caught by <em>robust models</em> + <em>input filtering</em> + <em>output monitoring</em>. Mixing these up wastes effort.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The CIA Triad, Adapted for ML</h2>
<p class="l-text">Security textbooks teach Confidentiality / Integrity / Availability. ML adds two more: <em>privacy</em> (a refinement of confidentiality, with a regulatory edge) and <em>safety</em> (does the model do harm in the real world). The result is a clean rubric for what an attacker can want.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Confidentiality / Privacy</div><div class="card-body">Don't leak training data, training-set membership, or model weights. Attacks: membership inference (Shokri 2017), model inversion (Fredrikson 2015), training-data extraction (Carlini 2021 — got verbatim PII out of GPT-2), model stealing (Tramèr 2016).</div></div>
<div class="calc-card"><div class="card-title">Integrity</div><div class="card-body">Don't let attackers change predictions. Attacks: adversarial examples, backdoors, prompt injection. This is where the most-studied work sits (FGSM/PGD/C&amp;W and descendants).</div></div>
<div class="calc-card"><div class="card-title">Availability</div><div class="card-body">Don't let attackers exhaust resources. Attacks: sponge examples (Shumailov 2021 — inputs that maximize energy and latency on neural nets), expensive prompts (long-context DoS on LLMs).</div></div>
<div class="calc-card"><div class="card-title">Safety / Abuse</div><div class="card-body">Don't let the model be used for prohibited outputs. Attacks: jailbreaks (GCG — Zou 2023, PAIR — Chao 2023), CSAM/bioweapons elicitation, deepfake generation. New in the LLM era; covered in mlsec-L9 and L10.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Attacker Capability — Quantifying the Threat</h2>
<p class="l-text">A complete threat model specifies <em>what the attacker can do</em>, not just what they want. The standard four parameters:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Knowledge</div><div class="card-body">Architecture? Weights? Training data? Hyperparameters? The white/grey/black-box axis from section 2.</div></div>
<div class="calc-card"><div class="card-title">Capability</div><div class="card-body">Can they read the model's training data? Modify it? Query the API? At what rate (rate limits matter — 10K queries/day is very different from 10⁹/day)? Can they observe gradients?</div></div>
<div class="calc-card"><div class="card-title">Goal</div><div class="card-body">Targeted (force class y_target on input x) vs. untargeted (any wrong class). Reliable trigger (works every time) vs. opportunistic. CIA dimension.</div></div>
<div class="calc-card"><div class="card-title">Constraint</div><div class="card-body">Perturbation budget on input (ℓ_∞ ε=8/255 for ImageNet is the canonical number). Imperceptibility, physical realizability (a sticker that survives weather). Plausibility (clean-label poisoning).</div></div>
</div>

<div class="katex-block">$$\\text{Adversary} = (\\mathcal{K}, \\mathcal{C}, \\mathcal{G}, \\mathcal{B})$$</div>

<p class="l-text">Where K is knowledge, C is capability, G is goal, B is the budget/constraint. A paper that says "we attack ResNet-50 with PGD" has implicitly specified K=white-box, C=gradient access, G=untargeted misclassification, B=ℓ_∞ ≤ 8/255. Half the disagreements in the field come from people comparing across different (K,C,G,B) tuples.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. A First Concrete Threat Model — A Loan-Approval Classifier</h2>
<p class="l-text">Let's make this real. Suppose we deploy a sklearn LogisticRegression that approves or denies loans based on income, debt, credit history, and a handful of demographic features. What is the threat model?</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># A toy loan classifier — same shape as a real fintech model</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)  <span class="cm"># using churn as a stand-in for a tabular fintech dataset</span>
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>,<span class="str">"contract_length"</span>,<span class="str">"support_calls"</span>]].values
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"clean accuracy:"</span>, clf.<span class="fn">score</span>(Xte, yte))
<span class="fn">print</span>(<span class="str">"decision function on first 5:"</span>, clf.<span class="fn">decision_function</span>(Xte[:<span class="num">5</span>]).<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads a real CSV from /data/ and selects feature columns into a DataFrame. 2) fits a sklearn LogisticRegression — a linear baseline whose gradient w.r.t. inputs is exactly the weight vector. 3) nudges the input by epsilon * sign(weight) — a one-step linear FGSM that flips the LogReg decision (the simplest adversarial example possible). 4) prints the headline metric so you can compare clean vs. attacked / private vs. public side by side.</p>

<p class="l-text">The threat model writes itself. <strong>Attackers</strong>: rejected applicants (want approval), competitors (want IP), regulators (want fairness audit). <strong>Capabilities</strong>: API queries (any applicant can submit), partial training data (public credit-bureau distributions are known), no weights (it's a private SaaS). <strong>Goals</strong>: integrity (flip a denial to an approval — adversarial example on tabular features), confidentiality (extract the model — Tramèr 2016 style), privacy (was John Doe in the training set? — membership inference). <strong>Constraints</strong>: input must remain a plausible loan application — you can't claim \$10⁹ income.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A first taste of an adversarial example on tabular data: nudge the features in the direction of the LogReg gradient until the decision flips. The full FGSM derivation is in mlsec-L2; this is the 5-line preview.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
sc = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X)
Xs = sc.<span class="fn">transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(Xs, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"clean acc:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))

<span class="cm"># The LogReg gradient w.r.t. x is just the weight vector (signed by the target class).</span>
w = clf.coef_[<span class="num">0</span>]
eps = <span class="num">0.5</span>  <span class="cm"># perturbation budget in standardized units</span>
<span class="cm"># Nudge each input AWAY from its true label</span>
sign_flip = np.<span class="fn">where</span>(ytr[:,<span class="kw">None</span>]==<span class="num">1</span>, -<span class="num">1</span>, <span class="num">1</span>)  <span class="cm"># if true=1 push toward 0 (negative direction)</span>
adv = Xtr + eps * np.<span class="fn">sign</span>(w) * sign_flip
<span class="fn">print</span>(<span class="str">"adversarial acc on TRAIN:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(adv, ytr), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"clean acc on TRAIN:      "</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xtr, ytr), <span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads a real CSV from /data/ and selects feature columns into a DataFrame. 2) fits a sklearn LogisticRegression — a linear baseline whose gradient w.r.t. inputs is exactly the weight vector. 3) nudges the input by epsilon * sign(weight) — a one-step linear FGSM that flips the LogReg decision (the simplest adversarial example possible). 4) prints the headline metric so you can compare clean vs. attacked / private vs. public side by side.</p>
</div>

<p class="l-text">A 0.5-standard-deviation nudge along the weight direction collapses train accuracy. That is the simplest adversarial attack possible — a one-step linear FGSM on a linear model. Deep nets are not safer; they are <em>more</em> vulnerable because their decision boundaries are more contorted.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Real Incidents (2016–2026)</h2>
<p class="l-text">Threat models are abstract until you read the news. A non-exhaustive list of incidents that a security-aware ML engineer should know:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tay (Microsoft, 2016)</div><div class="card-body">Twitter chatbot poisoned in &lt;24 hours by coordinated trolls feeding it offensive language. The first widely-reported real-world poisoning of a deployed ML system. Model rolled back, lessons re-learned a hundred times since.</div></div>
<div class="calc-card"><div class="card-title">Stop-sign stickers (Eykholt 2018)</div><div class="card-body">Black-and-white stickers on a stop sign cause a state-of-the-art classifier to read "Speed Limit 45". Physical-world attack — survives photographs from many angles. Triggered the broader robust-ML research wave.</div></div>
<div class="calc-card"><div class="card-title">GPT-2 training-data extraction (Carlini 2021)</div><div class="card-body">Extracted verbatim PII (names, emails, phone numbers, GUIDs) from GPT-2 by clever prompting. Showed neural LMs memorize and emit training data. Foundational for membership-inference and privacy work today.</div></div>
<div class="calc-card"><div class="card-title">Hugging Face malicious pickles (2023)</div><div class="card-body">Attackers uploaded model files containing arbitrary-code-execution payloads. HF added safer formats (safetensors) but the supply-chain risk persists for any ML platform that loads code-laden artifacts.</div></div>
<div class="calc-card"><div class="card-title">ChatGPT DAN &amp; jailbreaks (2023–)</div><div class="card-body">Endless cat-and-mouse: roleplay attacks, prefix injection, GCG (automated). RLHF reduced surface area but did not close it. Anthropic, OpenAI, Google all run continuous red-team programs.</div></div>
<div class="calc-card"><div class="card-title">Sleeper agents (Hubinger 2024, Anthropic)</div><div class="card-body">Fine-tuned Claude-2 to behave nicely until "year=2024" appears in context, then write exploitable code. Standard safety training did NOT remove the behavior. A live demonstration of training-time backdoors at LLM scale.</div></div>
</div>

<p class="l-text">Each of these maps to one cell of the (training/inference) × (white/black) × (CIA) cube. By the end of the track you will have the mental tools to read a new incident on Friday and write a sound mitigation by Monday.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Reading List and What's Next</h2>
<p class="l-text">If you read only the foundational papers, read these in order:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Foundations</div><div class="card-body">Biggio &amp; Roli, "Wild Patterns: Ten Years After the Rise of Adversarial Machine Learning" (2018) — the canonical history. Goodfellow et al., "Explaining and Harnessing Adversarial Examples" (2014) — FGSM. Madry et al., "Towards Deep Learning Models Resistant to Adversarial Attacks" (2017) — PGD as the strongest first-order attack.</div></div>
<div class="calc-card"><div class="card-title">Defenses</div><div class="card-body">Athalye et al., "Obfuscated Gradients Give a False Sense of Security" (ICML 2018) — why most defenses fail. Cohen et al., "Certified Adversarial Robustness via Randomized Smoothing" (ICML 2019) — the strongest provable defense to date.</div></div>
<div class="calc-card"><div class="card-title">Privacy</div><div class="card-body">Shokri et al., "Membership Inference Attacks Against Machine Learning Models" (S&amp;P 2017). Carlini et al., "Extracting Training Data from Large Language Models" (USENIX Security 2021).</div></div>
<div class="calc-card"><div class="card-title">LLM era</div><div class="card-body">Zou et al., "Universal and Transferable Adversarial Attacks on Aligned Language Models" (GCG, 2023). Greshake et al., "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (2023). NIST AI 100-2 (2024).</div></div>
</div>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>ML security ≠ classical software security. The function the model represents is itself an attack surface.</li>
<li>Two axes structure everything: white/grey/black-box knowledge, and training/inference timing.</li>
<li>NIST's four categories: evasion, poisoning, privacy, abuse. Use this language in any threat model.</li>
<li>The CIA triad still applies — confidentiality, integrity, availability — plus safety in the LLM era.</li>
<li>A complete threat model is a 4-tuple (Knowledge, Capability, Goal, Budget). Comparing across tuples is meaningless.</li>
<li>Linear models are already vulnerable. Deep models are dramatically more so. Defense is hard, not optional.</li>
</ul>
</div>

<p class="l-text">In <strong>mlsec-L2</strong> we build adversarial examples from scratch — FGSM in three lines, PGD in seven, Carlini-Wagner with binary search — and reproduce the headline result that adversarial examples transfer across models. In <strong>mlsec-L3</strong> we move to defenses: adversarial training (Madry), TRADES, and certified randomized smoothing (Cohen). By <strong>mlsec-L9</strong> we are red-teaming live LLMs, and the capstone <strong>mlsec-L10</strong> is a full AI red-team engagement against a real deployed system.</p>
</div>`,
tr: `<p class="l-text"><strong>Makine öğrenmesi artık kritik altyapıdır</strong> — kredi kararları, tıbbi triyaj, otonom araçlar, içerik moderasyonu, gümrük ve sınır kontrolü, dolandırıcılık tespiti, savunma sistemleri. Bir modelin önemli bir karar verdiği her yerde, bir saldırganın o kararı manipüle etmek için motivasyonu vardır. ML güvenliği şu soruyu soran disiplindir: <em>birisi aktif olarak bu modeli bozmaya çalıştığına göre, neler yapabilir ve biz buna karşı ne yapabiliriz?</em> Bu bir araştırma merakı değil — 2026 itibarıyla NIST resmi taksonomiler yayımlıyor (AI 100-2), AB AI Yasası yüksek riskli sistemler için düşmanca dayanıklılık testini zorunlu kılıyor ve OWASP, her büyük AI laboratuvarındaki kırmızı takımlar tarafından kullanılan bir LLM zafiyetleri top-10 listesi tutuyor.</p>

<p class="l-text">Bu ilk ders tüm track için zihinsel iskeleti kurar. <em>Eğitim zamanı</em> saldırılarını (veriyi zehirlemek, arka kapı yerleştirmek, eğitim sırasında modeli çalmak) <em>çıkarım zamanı</em> saldırılarından (düşmanca girdi üretmek, üyelik bilgisi çıkarmak, dağıtılmış bir LLM'i jailbreak etmek) ayırırız. <em>Beyaz kutu</em> (saldırgan model ağırlıklarına sahip — Goodfellow 2014'ün orijinal FGSM tehdit modeli) ile <em>kara kutu</em> (yalnızca API erişimi — Tramèr 2016'nın çalma kurulumu, bugünün GPT-4 jailbreak'leri) ayrımını yaparız. Ve klasik CIA üçlüsünü — gizlilik (üyelik çıkarımı, model çıkarımı, eğitim verisi çıkarımı), bütünlük (düşmanca örnekler, arka kapılar), erişilebilirlik (sünger örnekler, pahalı prompt'lar yoluyla servis dışı bırakma) — somut 2024–2026 olaylarına oturtuyoruz. Sonunda alandaki herhangi bir makaleyi okuyup hemen NIST'in tehdit modeli kafesine yerleştirebileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Herhangi bir saldırıyı beyaz kutu ↔ kara kutu ve eğitim zamanı ↔ çıkarım zamanı eksenlerine yerleştirmek</li>
<li>Kaçırma, zehirleme, çıkarım, ters çevirme ve üyelik çıkarımını net biçimde ayırt etmek (NIST AI 100-2 taksonomisi)</li>
<li>Üretimdeki bir ML sistemi için CIA üçlüsü tehdit modeli yazmak</li>
<li>Saldırgan kapasitesini sayısallaştırmak: sorgu bütçesi, mimari bilgisi, veri bilgisi</li>
<li>Bir saldırıyı bir savunma kategorisine eşlemek (eğitim zamanı, çıkarım zamanı, çıktı filtreleme, formal doğrulama)</li>
<li>Son makaleleri ve olayları (Tay 2016, ImageNet düşmanca, ChatGPT jailbreak'leri, uyuyan ajanlar) tek bir kelime dağarcığıyla okumak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ML Güvenliği Neden Ayrı Bir Disiplindir</h2>
<p class="l-text">Klasik yazılım güvenliği şunu sorar: saldırgan programa olmaması gereken kodu çalıştırtabilir mi (RCE), okumaması gereken belleği okuyabilir mi (info leak) veya servis vermeyi reddetebilir mi (DoS)? ML güvenliği bunların hepsini miras alır ama yeni bir katman ekler: <strong>programın davranışı veriden öğrenilir ve hem veri hem öğrenilen fonksiyon kendi başlarına saldırı yüzeyleridir</strong>. Bir model bellek-güvenli, sandbox'lanmış, imzalı ve denetlenmiş olabilir ve yine de 3 piksellik bir çıkartma içeren her girdide yanlış olabilir (Eykholt vd., 2018, "Robust Physical-World Attacks on Deep Learning Visual Classification") — çünkü saldırı, modelin temsil ettiği fonksiyonun içinde yaşar, uygulamasında değil.</p>

<p class="l-text">Bu yüzden alanın kendi tehdit modeli diline ihtiyacı vardır. Bir buffer overflow taksonomisi zehirlenmiş bir ImageNet örneğini tanımlamaz. Bir SQL-injection taksonomisi, bir müşteri-destek chatbot'undan tool-calling backend'e geçen bir prompt enjeksiyonunu tanımlamaz. NIST'in 2024 yayını <em>NIST AI 100-2: Adversarial Machine Learning — A Taxonomy and Terminology of Attacks and Mitigations</em> ortak dildir; bu track boyunca onun kelime dağarcığını kullanırız.</p>

<div class="calc-highlight"><strong>Klasik dört NIST saldırı aşaması:</strong> kaçırma (çıkarım zamanı), zehirleme (eğitim zamanı), gizlilik (veriyi veya üyeliği çıkarma) ve kötüye kullanım (üretici bir modeli yasak çıktılar için kullanma — jailbreak'ler, deepfake'ler, dezenformasyon). 2024–2026'da okuyacağın her makale en az bunlardan birine uyar.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Beyaz Kutu vs. Kara Kutu vs. Gri Kutu</h2>
<p class="l-text">Bir saldırganın <em>bilgisi</em>, hangi saldırının mümkün olduğunu belirler. Topluluk, her birinde alt durumlar olan üç kova kullanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Beyaz kutu</div><div class="card-body">Saldırganın tüm modeli vardır: mimari, ağırlıklar, eğitim prosedürü, muhtemelen eğitim verisi. FGSM (Goodfellow 2014), PGD (Madry 2017), C&amp;W (Carlini-Wagner 2017) tehdit modeli. Modeller açık ağırlıklı olduğunda (Llama, Mistral, DeepSeek), bir içerideki kişi erişime sahip olduğunda veya bir saldırgan ağırlıkları sızdırdığında gerçekçi.</div></div>
<div class="calc-card"><div class="card-title">Kara kutu (sorgu)</div><div class="card-body">Saldırgan yalnızca modelin API'sini sorgulayıp çıktıları gözleyebilir (top-1 etiket, top-k logit veya tam logit). Tramèr 2016 (model çalma), Papernot 2017 (transfer saldırıları), GPT-4/Claude üzerine çoğu jailbreak araştırmasının tehdit modeli. Herhangi bir ticari MLaaS uç noktası için gerçek.</div></div>
<div class="calc-card"><div class="card-title">Kara kutu (yalnız etiket)</div><div class="card-body">En zor durum: saldırgan yalnızca tahmin edilen sınıfı görür, güven skorlarını değil. Sınır saldırıları (Brendel 2018), HopSkipJumpAttack (Chen 2020). Yavaş ama mümkün — ~10⁵–10⁶ sorgu gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Gri kutu</div><div class="card-body">Kısmi bilgi: mimari biliniyor ama ağırlıklar bilinmiyor veya eğitim verisi biliniyor ama prosedür bilinmiyor. Pratikte en gerçekçisi — saldırganlar genellikle bir satıcının kullandığı model ailesini bilirler (örn. "muhtemelen ResNet-50 kullanıyorlar") ama tam ağırlıkları bilmezler.</div></div>
</div>

<p class="l-text">İnce ama önemli bir gerçek: <strong>beyaz kutu saldırıları kara kutu durumlarına şaşırtıcı derecede iyi transfer olur</strong>. Papernot vd. (2017, "Practical Black-Box Attacks against Machine Learning") bir vekil model üzerinde üretilen düşmanca bir örneğin genellikle hedefi kandırdığını gösterdi. Yalnızca beyaz kutuda çalışan savunmalar kırılgandır; saldırgan kendi kopyasını eğitip ona saldırabilir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Eğitim Zamanı vs. Çıkarım Zamanı</h2>
<p class="l-text">İkinci eksen, saldırının <em>ne zaman</em> gerçekleştiğidir. Bu, kimin erişimi olduğunu (bir veri kürator? içeriden biri? ücretli bir API kullanıcısı?) ve hangi savunmaların mümkün olduğunu (veri sanitizasyonu vs. girdi filtreleme) belirler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eğitim zamanı: zehirleme</div><div class="card-body">Saldırgan eğitim setine kötü amaçlı veri enjekte eder. Hedef: genel doğruluğu düşürmek veya yalnızca bir tetikleyiciyle aktive olan bir arka kapı yerleştirmek. Örnekler: BadNets (Gu 2017), etiket çevirme (Biggio 2012), temiz etiket (Shafahi 2018), federe zehirleme (Bagdasaryan 2020). Web'den toplanmış veya kalabalık kaynaklı herhangi bir veri seti için gerçekçi — LAION, Common Crawl, tüm LLM ön-eğitim derlemi dahil.</div></div>
<div class="calc-card"><div class="card-title">Eğitim zamanı: model tedarik zinciri</div><div class="card-body">Saldırgan ön-eğitilmiş ağırlıkları, ince-ayar kodunu veya çerçevenin kendisini ele geçirir. Uyuyan ajanlar (Hubinger 2024) — gelecekteki bir tetikleyiciye bağlı kötü davranışı ince-ayarla yerleştirme. Hugging Face'in model deposunda kötü amaçlı pickle dosyalarıyla ilgili tekrar eden olayları olmuştur.</div></div>
<div class="calc-card"><div class="card-title">Çıkarım zamanı: kaçırma</div><div class="card-body">Model sabit, saldırgan onu yanıltan girdiler üretir. Düşmanca örnekler, prompt enjeksiyonu, jailbreak'ler. Ucuz, tekrarlanabilir, içeriden biri gerekmez. Alandaki çoğu makale burada yaşar çünkü araştırmaya en düşük engele sahiptir.</div></div>
<div class="calc-card"><div class="card-title">Çıkarım zamanı: çıkarım ve gizlilik</div><div class="card-body">Saldırgan, öğrenmemesi gereken bir şeyi öğrenmek için sorgu yapar: modelin kendisi (Tramèr 2016), eğitim seti üyeliği (Shokri 2017) veya eğitim seti içeriği (Carlini 2021). Gizlilik düzenlemesine (GDPR, HIPAA) ve fikri mülkiyet hukukuna girer.</div></div>
</div>

<div class="calc-highlight"><strong>Savunma genel kuralı:</strong> eğitim zamanı saldırıları <em>veri hijyeni</em> ile yakalanır (köken, tekrar temizleme, anomali tespiti, gradyan elemesi); çıkarım zamanı saldırıları <em>dayanıklı modeller</em> + <em>girdi filtreleme</em> + <em>çıktı izleme</em> ile yakalanır. Bunları karıştırmak çabayı boşa harcar.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. CIA Üçlüsü, ML İçin Uyarlanmış</h2>
<p class="l-text">Güvenlik ders kitapları Gizlilik / Bütünlük / Erişilebilirlik öğretir. ML iki tane daha ekler: <em>mahremiyet</em> (gizliliğin düzenleyici tarafı olan bir incelemesi) ve <em>güvenlik</em> (model gerçek dünyada zarar veriyor mu). Sonuç, bir saldırganın ne isteyebileceği için temiz bir kriter.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gizlilik / Mahremiyet</div><div class="card-body">Eğitim verisini, eğitim seti üyeliğini veya model ağırlıklarını sızdırma. Saldırılar: üyelik çıkarımı (Shokri 2017), model ters çevirme (Fredrikson 2015), eğitim verisi çıkarımı (Carlini 2021 — GPT-2'den birebir PII çıkardı), model çalma (Tramèr 2016).</div></div>
<div class="calc-card"><div class="card-title">Bütünlük</div><div class="card-body">Saldırganların tahminleri değiştirmesine izin verme. Saldırılar: düşmanca örnekler, arka kapılar, prompt enjeksiyonu. En çok çalışılan iş burada (FGSM/PGD/C&amp;W ve türevleri).</div></div>
<div class="calc-card"><div class="card-title">Erişilebilirlik</div><div class="card-body">Saldırganların kaynakları tüketmesine izin verme. Saldırılar: sünger örnekler (Shumailov 2021 — sinir ağlarında enerji ve gecikmeyi maksimize eden girdiler), pahalı prompt'lar (LLM'lerde uzun bağlam DoS).</div></div>
<div class="calc-card"><div class="card-title">Güvenlik / Kötüye Kullanım</div><div class="card-body">Modelin yasak çıktılar için kullanılmasına izin verme. Saldırılar: jailbreak'ler (GCG — Zou 2023, PAIR — Chao 2023), CSAM/biyolojik silah açığa çıkarma, deepfake üretimi. LLM çağında yeni; mlsec-L9 ve L10'da kapsanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Saldırgan Kapasitesi — Tehdidi Sayısallaştırma</h2>
<p class="l-text">Eksiksiz bir tehdit modeli yalnızca saldırganın ne istediğini değil, <em>ne yapabileceğini</em> belirtir. Standart dört parametre:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bilgi</div><div class="card-body">Mimari? Ağırlıklar? Eğitim verisi? Hiperparametreler? Bölüm 2'deki beyaz/gri/kara kutu ekseni.</div></div>
<div class="calc-card"><div class="card-title">Kapasite</div><div class="card-body">Modelin eğitim verisini okuyabilirler mi? Değiştirebilirler mi? API'yi sorgulayabilirler mi? Hangi hızda (rate limit önemlidir — günde 10K sorgu, günde 10⁹'dan çok farklıdır)? Gradyanları gözleyebilirler mi?</div></div>
<div class="calc-card"><div class="card-title">Hedef</div><div class="card-body">Hedeflenmiş (x girdisinde y_target sınıfını zorla) vs. hedeflenmemiş (herhangi bir yanlış sınıf). Güvenilir tetikleyici (her seferinde çalışır) vs. fırsatçı. CIA boyutu.</div></div>
<div class="calc-card"><div class="card-title">Kısıt</div><div class="card-body">Girdi üzerinde pertürbasyon bütçesi (ImageNet için ℓ_∞ ε=8/255 klasik sayıdır). Algılanamazlık, fiziksel gerçeklenebilirlik (havaya dayanan bir çıkartma). Akla yatkınlık (temiz etiket zehirleme).</div></div>
</div>

<div class="katex-block">$$\\text{Adversary} = (\\mathcal{K}, \\mathcal{C}, \\mathcal{G}, \\mathcal{B})$$</div>

<p class="l-text">Burada K bilgi, C kapasite, G hedef, B bütçe/kısıttır. "ResNet-50'ye PGD ile saldırıyoruz" diyen bir makale örtük olarak K=beyaz kutu, C=gradyan erişimi, G=hedeflenmemiş yanlış sınıflandırma, B=ℓ_∞ ≤ 8/255 belirtmiştir. Alandaki anlaşmazlıkların yarısı, insanların farklı (K,C,G,B) tüpleri arasında karşılaştırma yapmasından kaynaklanır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. İlk Somut Tehdit Modeli — Bir Kredi-Onay Sınıflandırıcısı</h2>
<p class="l-text">Bunu somutlaştıralım. Diyelim ki gelir, borç, kredi geçmişi ve birkaç demografik özelliğe dayanarak kredileri onaylayan veya reddeden bir sklearn LogisticRegression dağıttık. Tehdit modeli nedir?</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Oyuncak bir kredi sınıflandırıcı — gerçek bir fintech modeliyle aynı şekil</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)  <span class="cm"># tablosal fintech veri seti yerine churn kullanıyoruz</span>
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>,<span class="str">"contract_length"</span>,<span class="str">"support_calls"</span>]].values
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"clean accuracy:"</span>, clf.<span class="fn">score</span>(Xte, yte))
<span class="fn">print</span>(<span class="str">"decision function on first 5:"</span>, clf.<span class="fn">decision_function</span>(Xte[:<span class="num">5</span>]).<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) /data/ altındaki gerçek bir CSV'yi okur ve özellik kolonlarını bir DataFrame'e seçer. 2) bir sklearn LogisticRegression eğitir — girdilere göre gradyanı tam olarak ağırlık vektörü olan lineer bir taban modeli. 3) girdiyi epsilon * sign(ağırlık) ile ittele — LogReg kararını ters çeviren tek adımlık lineer FGSM, mümkün olan en basit düşmanca örnek. 4) temiz ve saldırılı / özel ve halka açık karşılaştırmasını yan yana okuyabilesin diye başlık metriğini yazdırır.</p>

<p class="l-text">Tehdit modeli kendiliğinden yazılır. <strong>Saldırganlar</strong>: reddedilen başvuru sahipleri (onay isterler), rakipler (IP isterler), düzenleyiciler (adillik denetimi isterler). <strong>Kapasiteler</strong>: API sorguları (herhangi bir başvuru sahibi gönderebilir), kısmi eğitim verisi (kamu kredi-bürosu dağılımları bilinir), ağırlık yok (özel bir SaaS). <strong>Hedefler</strong>: bütünlük (bir reddi onaya çevir — tablosal özelliklerde düşmanca örnek), gizlilik (modeli çıkar — Tramèr 2016 tarzı), mahremiyet (John Doe eğitim setinde miydi? — üyelik çıkarımı). <strong>Kısıtlar</strong>: girdi akla yatkın bir kredi başvurusu olarak kalmalı — \$10⁹ gelir iddia edemezsin.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tablosal veride düşmanca örneğin ilk tadı: özellikleri LogReg gradyanı yönünde, karar tersine dönene kadar ittele. FGSM'in tam türetimi mlsec-L2'de; bu 5 satırlık önizleme.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
sc = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X)
Xs = sc.<span class="fn">transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(Xs, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"clean acc:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))

<span class="cm"># LogReg'in x'e göre gradyanı tam olarak ağırlık vektörüdür (hedef sınıfla işaretli).</span>
w = clf.coef_[<span class="num">0</span>]
eps = <span class="num">0.5</span>  <span class="cm"># standartlaştırılmış birimlerde pertürbasyon bütçesi</span>
<span class="cm"># Her girdiyi gerçek etiketinden UZAĞA ittele</span>
sign_flip = np.<span class="fn">where</span>(ytr[:,<span class="kw">None</span>]==<span class="num">1</span>, -<span class="num">1</span>, <span class="num">1</span>)  <span class="cm"># gerçek=1 ise 0'a doğru itele (negatif yön)</span>
adv = Xtr + eps * np.<span class="fn">sign</span>(w) * sign_flip
<span class="fn">print</span>(<span class="str">"adversarial acc on TRAIN:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(adv, ytr), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"clean acc on TRAIN:      "</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xtr, ytr), <span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) /data/ altındaki gerçek bir CSV'yi okur ve özellik kolonlarını bir DataFrame'e seçer. 2) bir sklearn LogisticRegression eğitir — girdilere göre gradyanı tam olarak ağırlık vektörü olan lineer bir taban modeli. 3) girdiyi epsilon * sign(ağırlık) ile ittele — LogReg kararını ters çeviren tek adımlık lineer FGSM, mümkün olan en basit düşmanca örnek. 4) temiz ve saldırılı / özel ve halka açık karşılaştırmasını yan yana okuyabilesin diye başlık metriğini yazdırır.</p>
</div>

<p class="l-text">Ağırlık yönünde 0.5 standart-sapmalık bir itme eğitim doğruluğunu çökertir. Bu, mümkün olan en basit düşmanca saldırıdır — lineer bir model üzerinde tek-adımlık lineer FGSM. Derin ağlar daha güvenli değildir; karar sınırları daha çarpık olduğundan <em>daha</em> kırılgandır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Gerçek Olaylar (2016–2026)</h2>
<p class="l-text">Tehdit modelleri, haberleri okuyana kadar soyuttur. Güvenlik bilincine sahip bir ML mühendisinin bilmesi gereken eksiksiz olmayan bir olaylar listesi:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tay (Microsoft, 2016)</div><div class="card-body">Twitter chatbot'u, koordineli trollerin saldırgan dil beslemesiyle &lt;24 saatte zehirlendi. Dağıtılmış bir ML sisteminin ilk geniş çapta bildirilen gerçek dünya zehirlenmesi. Model geri alındı, dersler o zamandan beri yüzlerce kez yeniden öğrenildi.</div></div>
<div class="calc-card"><div class="card-title">Dur işareti çıkartmaları (Eykholt 2018)</div><div class="card-body">Bir dur işaretindeki siyah-beyaz çıkartmalar, son teknoloji bir sınıflandırıcıya "Hız Limiti 45" okutuyor. Fiziksel dünya saldırısı — birçok açıdan fotoğraflara dayanır. Daha geniş dayanıklı-ML araştırma dalgasını tetikledi.</div></div>
<div class="calc-card"><div class="card-title">GPT-2 eğitim verisi çıkarımı (Carlini 2021)</div><div class="card-body">Akıllı prompt'larla GPT-2'den birebir PII (isimler, e-postalar, telefon numaraları, GUID'ler) çıkardı. Sinir LM'lerinin eğitim verisini ezberleyip yaydığını gösterdi. Bugünün üyelik çıkarımı ve mahremiyet çalışmaları için temel.</div></div>
<div class="calc-card"><div class="card-title">Hugging Face kötü amaçlı pickle'lar (2023)</div><div class="card-body">Saldırganlar keyfi-kod-yürütme yükleri içeren model dosyaları yükledi. HF daha güvenli formatlar ekledi (safetensors) ama tedarik zinciri riski, kod-yüklü artefaktlar yükleyen herhangi bir ML platformu için devam ediyor.</div></div>
<div class="calc-card"><div class="card-title">ChatGPT DAN ve jailbreak'ler (2023–)</div><div class="card-body">Sonsuz kedi-fare oyunu: rol oynama saldırıları, prefix injection, GCG (otomatik). RLHF saldırı yüzeyini azalttı ama kapatmadı. Anthropic, OpenAI, Google hepsi sürekli kırmızı takım programları yürütüyor.</div></div>
<div class="calc-card"><div class="card-title">Uyuyan ajanlar (Hubinger 2024, Anthropic)</div><div class="card-body">Claude-2 ince-ayarlandı: bağlamda "year=2024" görünene kadar nazik davranıyor, sonra istismar edilebilir kod yazıyor. Standart güvenlik eğitimi davranışı KALDIRMADI. LLM ölçeğinde eğitim zamanı arka kapılarının canlı bir gösterisi.</div></div>
</div>

<p class="l-text">Bunların her biri (eğitim/çıkarım) × (beyaz/kara) × (CIA) küpünün bir hücresine eşlenir. Track sonunda, Cuma günü yeni bir olayı okuyup Pazartesi günü sağlam bir hafifletme yazma zihinsel araçlarına sahip olacaksın.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Okuma Listesi ve Sırada Ne Var</h2>
<p class="l-text">Yalnızca temel makaleleri okuyacaksan, bu sırayla oku:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Temeller</div><div class="card-body">Biggio &amp; Roli, "Wild Patterns: Ten Years After the Rise of Adversarial Machine Learning" (2018) — klasik tarih. Goodfellow vd., "Explaining and Harnessing Adversarial Examples" (2014) — FGSM. Madry vd., "Towards Deep Learning Models Resistant to Adversarial Attacks" (2017) — en güçlü birinci-derece saldırı olarak PGD.</div></div>
<div class="calc-card"><div class="card-title">Savunmalar</div><div class="card-body">Athalye vd., "Obfuscated Gradients Give a False Sense of Security" (ICML 2018) — çoğu savunmanın neden başarısız olduğu. Cohen vd., "Certified Adversarial Robustness via Randomized Smoothing" (ICML 2019) — bugüne kadarki en güçlü kanıtlanabilir savunma.</div></div>
<div class="calc-card"><div class="card-title">Mahremiyet</div><div class="card-body">Shokri vd., "Membership Inference Attacks Against Machine Learning Models" (S&amp;P 2017). Carlini vd., "Extracting Training Data from Large Language Models" (USENIX Security 2021).</div></div>
<div class="calc-card"><div class="card-title">LLM çağı</div><div class="card-body">Zou vd., "Universal and Transferable Adversarial Attacks on Aligned Language Models" (GCG, 2023). Greshake vd., "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (2023). NIST AI 100-2 (2024).</div></div>
</div>

<div class="calc-highlight"><strong>Kilit çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>ML güvenliği ≠ klasik yazılım güvenliği. Modelin temsil ettiği fonksiyonun kendisi bir saldırı yüzeyidir.</li>
<li>Her şeyi iki eksen yapılandırır: beyaz/gri/kara kutu bilgi ve eğitim/çıkarım zamanlaması.</li>
<li>NIST'in dört kategorisi: kaçırma, zehirleme, mahremiyet, kötüye kullanım. Herhangi bir tehdit modelinde bu dili kullan.</li>
<li>CIA üçlüsü hâlâ geçerli — gizlilik, bütünlük, erişilebilirlik — artı LLM çağında güvenlik.</li>
<li>Eksiksiz bir tehdit modeli 4-tüpdür (Bilgi, Kapasite, Hedef, Bütçe). Tüpler arası karşılaştırma anlamsızdır.</li>
<li>Lineer modeller bile kırılgandır. Derin modeller dramatik olarak daha fazlasıdır. Savunma zor, isteğe bağlı değil.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L2</strong>'de düşmanca örnekleri sıfırdan kurarız — üç satırda FGSM, yedi satırda PGD, ikili aramayla Carlini-Wagner — ve düşmanca örneklerin modeller arası transfer ettiği başlık sonucunu yeniden üretiriz. <strong>mlsec-L3</strong>'te savunmalara geçeriz: düşmanca eğitim (Madry), TRADES ve sertifikalı rastgele yumuşatma (Cohen). <strong>mlsec-L9</strong>'a kadar canlı LLM'lere kırmızı takım uygularız ve capstone <strong>mlsec-L10</strong> gerçek dağıtılmış bir sisteme karşı tam bir AI kırmızı takım operasyonudur.</p>
</div>`
};
