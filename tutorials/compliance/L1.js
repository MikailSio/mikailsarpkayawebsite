window.COMPLIANCE_L1 = {
en: `<p class="l-text"><strong>The General Data Protection Regulation (Regulation EU 2016/679) is the most consequential piece of data legislation of the last 25 years</strong>, and AI systems sit squarely in its line of fire. GDPR has been enforced since 25 May 2018, applies extraterritorially to any organisation processing data of EU residents, and authorises fines up to <em>4% of global annual turnover or €20 million, whichever is higher</em>. Meta paid €1.2 billion in May 2023 for unlawful US data transfers, Amazon paid €746 million in 2021, Clearview AI was fined €30.5 million by the Italian Garante in 2022 for scraping faces without a legal basis. None of those were tiny startups; the regulator cares about the act, not the size.</p>

<p class="l-text">For an AI engineer, GDPR is not a checklist of cookie banners. It is a substantive constraint on what you can train on, what you can deploy, and what your model is allowed to decide. Article 22 alone — the right not to be subject to solely automated decisions producing legal or similarly significant effects — invalidates a large class of "let the model decide" architectures unless human review or explicit consent is bolted in. Recital 71 turns this into an implicit right to explanation. Article 5's data-minimisation principle is in direct tension with the deep-learning instinct to throw every feature into the funnel. This lesson maps GDPR onto the AI lifecycle so you can build systems that ship in Europe without getting the company sued.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Map the six lawful bases of Article 6 onto common AI use cases (training, inference, retention)</li>
<li>Apply Article 22 — automated individual decision-making — and recognise when human-in-the-loop is mandatory</li>
<li>Run a Data Protection Impact Assessment (DPIA, Article 35) for a high-risk AI system</li>
<li>Implement data minimisation, purpose limitation, and storage limitation in feature pipelines</li>
<li>Honour the rights of access, rectification, erasure, and explanation (Articles 15–22, Recital 71)</li>
<li>Score real fine cases (Meta, Amazon, Clearview) against the GDPR provisions they breached</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Six Lawful Bases — Article 6</h2>
<p class="l-text">Every processing operation, including training data collection and model inference, needs at least one of six lawful bases under Article 6(1): <strong>consent, contract, legal obligation, vital interests, public task, or legitimate interests</strong>. Pick the right one before you write the first line of pipeline code, because each basis carries different downstream rights and constraints. Consent is freely-given, specific, informed, and revocable; the moment a user revokes it, you must stop processing and (often) delete derived artefacts. Legitimate interests requires a documented Legitimate Interest Assessment (LIA) balancing your business need against user rights — a balancing test the regulator can audit.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Consent (6.1.a)</div><div class="card-body">Opt-in, granular, withdrawable. The default for marketing, behavioural ad-targeting, and most B2C AI features. Pre-ticked boxes are invalid (CJEU <em>Planet49</em>, 2019).</div></div>
<div class="calc-card"><div class="card-title">Contract (6.1.b)</div><div class="card-body">Necessary to perform a contract the user signed. Covers transactional features (fraud check on a payment) but not "we'd like to also train on this".</div></div>
<div class="calc-card"><div class="card-title">Legal obligation (6.1.c)</div><div class="card-body">Required by EU or member-state law. AML/KYC checks, tax reporting. Cannot be invoked for speculative training.</div></div>
<div class="calc-card"><div class="card-title">Vital interests (6.1.d)</div><div class="card-body">Life-threatening situations. Medical AI in emergency triage may rely on this in narrow scenarios.</div></div>
<div class="calc-card"><div class="card-title">Public task (6.1.e)</div><div class="card-body">Statutory duty of a public authority. Government risk-scoring systems (e.g. SyRI, ruled unlawful in NL 2020) sit here.</div></div>
<div class="calc-card"><div class="card-title">Legitimate interests (6.1.f)</div><div class="card-body">Three-part test: legitimate purpose, necessity, balanced against rights. The most flexible basis but also the most contested. Document the LIA.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>Special categories (Article 9)</strong> — health, biometrics, ethnicity, sexual orientation, political opinion, trade-union membership — need a second basis on top of Article 6, usually explicit consent or substantial public interest in law. Face-recognition AI lives or dies on this provision.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Article 22 — The Right Against Solely Automated Decisions</h2>
<p class="l-text">Article 22(1) gives every data subject "the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her." The exceptions in 22(2) are narrow: necessary for a contract, authorised by law, or based on explicit consent. Even then, 22(3) requires "suitable measures to safeguard the data subject's rights" — at minimum, the right to obtain human intervention, to express a point of view, and to contest the decision.</p>

<p class="l-text">In practice, "solely automated" is interpreted strictly by the European Data Protection Board: a rubber-stamp human reviewer who approves 99% of model outputs in two seconds does not satisfy 22(3). The CJEU's <em>SCHUFA</em> ruling (C-634/21, December 2023) held that even producing a credit score that a third party uses to refuse a loan counts as an automated decision under Article 22 — pushing the obligation further upstream than many credit-bureau startups had assumed.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Article 22 gate — refuse fully-automated decisions on protected outcomes</span>
PROTECTED_OUTCOMES = {<span class="str">"loan_decision"</span>, <span class="str">"hiring_decision"</span>, <span class="str">"benefits_eligibility"</span>,
                     <span class="str">"insurance_premium"</span>, <span class="str">"visa_decision"</span>, <span class="str">"parole_recommendation"</span>}

<span class="kw">def</span> <span class="fn">article22_gate</span>(decision_type, has_human_review, has_explicit_consent,
                   user_can_contest, score_only=<span class="kw">False</span>):
    <span class="kw">if</span> decision_type <span class="kw">not</span> <span class="kw">in</span> PROTECTED_OUTCOMES:
        <span class="kw">return</span> <span class="str">"OK: not within Art.22 scope"</span>
    <span class="kw">if</span> score_only:
        <span class="cm"># SCHUFA C-634/21: scores feeding third-party decisions still count</span>
        <span class="kw">return</span> <span class="str">"BLOCKED: score still triggers Art.22 if a downstream party uses it"</span>
    <span class="kw">if</span> <span class="kw">not</span> (has_human_review <span class="kw">or</span> has_explicit_consent):
        <span class="kw">return</span> <span class="str">"BLOCKED: need human-in-the-loop OR explicit consent (Art.22(2))"</span>
    <span class="kw">if</span> <span class="kw">not</span> user_can_contest:
        <span class="kw">return</span> <span class="str">"BLOCKED: must allow user to contest (Art.22(3))"</span>
    <span class="kw">return</span> <span class="str">"OK: lawful with safeguards"</span>

cases = [
    (<span class="str">"loan_decision"</span>, <span class="kw">False</span>, <span class="kw">False</span>, <span class="kw">False</span>, <span class="kw">False</span>),
    (<span class="str">"loan_decision"</span>, <span class="kw">True</span>,  <span class="kw">False</span>, <span class="kw">True</span>,  <span class="kw">False</span>),
    (<span class="str">"hiring_decision"</span>, <span class="kw">False</span>, <span class="kw">True</span>,  <span class="kw">True</span>,  <span class="kw">False</span>),
    (<span class="str">"loan_decision"</span>, <span class="kw">False</span>, <span class="kw">True</span>,  <span class="kw">True</span>,  <span class="kw">True</span>),   <span class="cm"># SCHUFA scenario</span>
    (<span class="str">"product_recommendation"</span>, <span class="kw">False</span>, <span class="kw">False</span>, <span class="kw">False</span>, <span class="kw">False</span>),
]
<span class="kw">for</span> c <span class="kw">in</span> cases:
    <span class="fn">print</span>(c, <span class="str">"->"</span>, <span class="fn">article22_gate</span>(*c))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) maps GDPR Articles 5/6/9/22/30/35 onto concrete pipeline checkpoints — lawful basis, special categories, automated decisions, ROPA and DPIA.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pure Python with no extra packages — the gate runs instantly and is the kind of helper you would wire into your inference service before any output is returned.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Seven Principles of Article 5</h2>
<p class="l-text">Article 5 sets out the substantive principles every processing operation must satisfy: lawfulness/fairness/transparency, purpose limitation, data minimisation, accuracy, storage limitation, integrity/confidentiality, and accountability. The accountability principle (5.2) is what turns the others into obligations you must <em>document and prove</em>. "We have a privacy policy" is not enough; you need records of processing activities (Article 30), DPIAs where required, and audit trails.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Purpose limitation</div><div class="card-body">Data collected for purpose A cannot be repurposed for unrelated purpose B without a new lawful basis. Training an LLM on customer-support tickets that were collected to "answer this ticket" is the textbook breach.</div></div>
<div class="calc-card"><div class="card-title">Data minimisation</div><div class="card-body">Only collect/process what is necessary. The deep-learning instinct of "more features can only help" loses to GDPR. Drop SSNs from the training set if the model does not need them.</div></div>
<div class="calc-card"><div class="card-title">Storage limitation</div><div class="card-body">Define retention periods up front. Raw training data, embeddings, model checkpoints — all have clocks. Indefinite retention is unlawful.</div></div>
<div class="calc-card"><div class="card-title">Accuracy</div><div class="card-body">Personal data must be accurate and kept up to date. A frozen training set from 2020 used in a 2026 production decision can violate this if the underlying facts have changed.</div></div>
<div class="calc-card"><div class="card-title">Integrity &amp; confidentiality</div><div class="card-body">Encryption at rest and in transit, access controls, pseudonymisation. The technical and organisational measures (TOMs) of Article 32.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Recital 71 and the Right to Explanation</h2>
<p class="l-text">Article 22 itself does not literally say "right to explanation", but Recital 71 — the interpretive companion — speaks of the right "to obtain an explanation of the decision reached". Whether this is a hard legal right or a soft interpretive guide is one of the most contested questions in EU AI law. The Article 29 Working Party (now EDPB) guidelines and most regulators treat it as <em>at least</em> a right to meaningful information about the logic involved (Articles 13(2)(f), 14(2)(g), 15(1)(h)).</p>

<p class="l-text">"Meaningful information about the logic" does not require revealing every weight. It does require explaining, in human-understandable terms, the categories of input that drove the decision, the rough role of each, and the consequences. A SHAP plot for a single prediction often satisfies this; a wall of 175-billion parameters does not.</p>

<div class="katex-block">$$\\text{Explainability}_\\text{GDPR} = f(\\text{logic clarity},\\ \\text{input significance},\\ \\text{contestability})$$</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Data Protection Impact Assessment (DPIA)</h2>
<p class="l-text">Article 35 requires a DPIA before any processing "likely to result in a high risk to the rights and freedoms of natural persons" — and the EDPB's nine criteria (large-scale, systematic monitoring, special categories, vulnerable subjects, innovative tech, etc.) catch nearly every interesting AI system. A DPIA is a structured document: describe the processing, assess necessity and proportionality, identify risks, design mitigations, and (if residual risk is still high) consult the supervisory authority before going live.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Lightweight DPIA scoring tool — runnable risk score for a candidate AI system</span>
<span class="kw">import</span> json

<span class="kw">def</span> <span class="fn">dpia_score</span>(system):
    weights = {
        <span class="str">"special_categories"</span>: <span class="num">3</span>, <span class="str">"vulnerable_subjects"</span>: <span class="num">3</span>, <span class="str">"large_scale"</span>: <span class="num">2</span>,
        <span class="str">"systematic_monitoring"</span>: <span class="num">2</span>, <span class="str">"automated_decisions"</span>: <span class="num">3</span>, <span class="str">"innovative_tech"</span>: <span class="num">2</span>,
        <span class="str">"data_combined_from_sources"</span>: <span class="num">1</span>, <span class="str">"denies_access_to_service"</span>: <span class="num">2</span>,
        <span class="str">"involves_children"</span>: <span class="num">3</span>,
    }
    score = <span class="fn">sum</span>(w <span class="kw">for</span> k, w <span class="kw">in</span> weights.<span class="fn">items</span>() <span class="kw">if</span> system.<span class="fn">get</span>(k))
    <span class="kw">if</span> score &gt;= <span class="num">6</span>: tier = <span class="str">"HIGH RISK — DPIA mandatory, possibly prior consultation Art.36"</span>
    <span class="kw">elif</span> score &gt;= <span class="num">3</span>: tier = <span class="str">"MEDIUM — DPIA recommended"</span>
    <span class="kw">else</span>: tier = <span class="str">"LOW — record of processing only"</span>
    <span class="kw">return</span> {<span class="str">"score"</span>: score, <span class="str">"tier"</span>: tier,
            <span class="str">"trigger_factors"</span>: [k <span class="kw">for</span> k, w <span class="kw">in</span> weights.<span class="fn">items</span>() <span class="kw">if</span> system.<span class="fn">get</span>(k)]}

face_id_at_airport = {
    <span class="str">"special_categories"</span>: <span class="kw">True</span>, <span class="str">"large_scale"</span>: <span class="kw">True</span>,
    <span class="str">"systematic_monitoring"</span>: <span class="kw">True</span>, <span class="str">"innovative_tech"</span>: <span class="kw">True</span>,
    <span class="str">"automated_decisions"</span>: <span class="kw">True</span>, <span class="str">"vulnerable_subjects"</span>: <span class="kw">False</span>,
    <span class="str">"involves_children"</span>: <span class="kw">True</span>,
}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(<span class="fn">dpia_score</span>(face_id_at_airport), indent=<span class="num">2</span>))

newsletter_signup = {<span class="str">"large_scale"</span>: <span class="kw">True</span>}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(<span class="fn">dpia_score</span>(newsletter_signup), indent=<span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) maps GDPR Articles 5/6/9/22/30/35 onto concrete pipeline checkpoints — lawful basis, special categories, automated decisions, ROPA and DPIA. 2) prints the headline metric so you can compare clean vs. attacked / private vs. public side by side.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Plain Python; no packages required. Replace the weights with the EDPB criteria your DPO has signed off and you have a reusable triage tool.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Data Subject Rights — Articles 15 to 22</h2>
<p class="l-text">A user can ask you for a copy of their data (Article 15), correction (16), erasure / right to be forgotten (17), restriction (18), portability (20), objection (21), and to not be subject to automated decisions (22). For an AI team this means three concrete obligations: (a) you can find a person's records in your training and inference logs; (b) you can delete or restrict them within one month (Article 12(3)); (c) you can explain how their data influenced any decision they received.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Article 15 — Access</div><div class="card-body">Provide a copy and the categories of recipients, retention period, and source. Includes the "logic involved" disclosure for automated decisions.</div></div>
<div class="calc-card"><div class="card-title">Article 17 — Erasure</div><div class="card-body">Delete personal data when no longer necessary, consent withdrawn, or unlawfully processed. Tension with model weights: see machine-unlearning research (Bourtoule 2021, SISA).</div></div>
<div class="calc-card"><div class="card-title">Article 20 — Portability</div><div class="card-body">Structured, commonly used, machine-readable export of the data the user provided. JSON/CSV typically.</div></div>
<div class="calc-card"><div class="card-title">Article 21 — Object</div><div class="card-body">User can object to legitimate-interest processing including profiling. You must stop unless you show compelling legitimate grounds that override the objection.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>The "trained model is personal data" debate:</strong> the Hamburg DPA stated in July 2024 that LLM weights generally do not contain personal data; the EDPB Opinion 28/2024 was more cautious, saying it depends. Treat this as unsettled and assume your weights might be in scope, especially after fine-tuning.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Real Fines — Pattern Recognition</h2>
<p class="l-text">Look at the largest GDPR fines and the violated articles repeat. The expensive failure modes are not exotic; they are the basic obligations.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Meta — €1.2 B (May 2023)</div><div class="card-body">Irish DPC. Article 46 — unlawful international transfers to the US after Schrems II. Driver: deeming SCCs adequate without TIA.</div></div>
<div class="calc-card"><div class="card-title">Amazon — €746 M (July 2021)</div><div class="card-body">Luxembourg CNPD. Behavioural advertising without valid consent. Articles 5 (lawfulness) and 6 (basis).</div></div>
<div class="calc-card"><div class="card-title">Meta (Instagram) — €405 M (2022)</div><div class="card-body">Default-public settings on minors' accounts. Articles 5(1)(c), 6(1), 12, 24, 35.</div></div>
<div class="calc-card"><div class="card-title">Clearview AI — €30.5 M Italy (2022) + bans elsewhere</div><div class="card-body">Scraping public photos to train face-recognition. Article 6 (no basis) + Article 9 (special categories) + extraterritorial reach.</div></div>
<div class="calc-card"><div class="card-title">TikTok — €345 M (Sept 2023)</div><div class="card-body">Children's data, default public settings, dark patterns. Articles 5, 12, 13, 24, 25.</div></div>
<div class="calc-card"><div class="card-title">OpenAI — Italian Garante temporary ban (March 2023)</div><div class="card-body">No legal basis for training on scraped data, no age check, no info to data subjects. Resolved with disclosures + opt-out + age gate.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. A Practical AI/GDPR Engineering Checklist</h2>
<p class="l-text">Translating the regulation into the day-to-day life of a model team. Treat every line as a Definition-of-Done item before any production deploy that touches EU personal data.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

checklist = [
  (<span class="str">"Lawful basis identified per processing op"</span>,            <span class="str">"Art.6"</span>),
  (<span class="str">"Special-category basis if applicable"</span>,                  <span class="str">"Art.9"</span>),
  (<span class="str">"Privacy notice published before collection"</span>,            <span class="str">"Art.13/14"</span>),
  (<span class="str">"DPIA done for high-risk processing"</span>,                    <span class="str">"Art.35"</span>),
  (<span class="str">"Records of processing activities maintained"</span>,           <span class="str">"Art.30"</span>),
  (<span class="str">"Training data minimised &amp; categorised"</span>,                 <span class="str">"Art.5(1)(c)"</span>),
  (<span class="str">"Retention policy on raw data, features, weights"</span>,       <span class="str">"Art.5(1)(e)"</span>),
  (<span class="str">"Subject-access &amp; erasure pipeline tested"</span>,              <span class="str">"Art.15/17"</span>),
  (<span class="str">"Article 22 human-review path for protected outcomes"</span>,   <span class="str">"Art.22"</span>),
  (<span class="str">"DPO consulted (if appointed) / risk owner signed-off"</span>,  <span class="str">"Art.37-39"</span>),
  (<span class="str">"International transfer mechanism (SCCs+TIA / DPF)"</span>,     <span class="str">"Art.44-49"</span>),
  (<span class="str">"Breach response runbook, 72 h notification"</span>,            <span class="str">"Art.33-34"</span>),
]
df = pd.<span class="fn">DataFrame</span>(checklist, columns=[<span class="str">"control"</span>, <span class="str">"article"</span>])
df[<span class="str">"status"</span>] = [<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"TODO"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"TODO"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>]
gap = df[df.status == <span class="str">"TODO"</span>]
<span class="fn">print</span>(df.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nGaps:"</span>, <span class="fn">len</span>(gap), <span class="str">"of"</span>, <span class="fn">len</span>(df))
<span class="fn">print</span>(gap.<span class="fn">to_string</span>(index=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) maps GDPR Articles 5/6/9/22/30/35 onto concrete pipeline checkpoints — lawful basis, special categories, automated decisions, ROPA and DPIA.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas is pre-loaded by the runner. The checklist becomes a DataFrame you can hash, version-control, and embed into a CI gate.</p>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Privacy by Design and by Default — Article 25</h2>
<p class="l-text">Article 25 codifies what Ann Cavoukian wrote about in 2009: privacy as an architectural property, not a bolt-on. For AI: pseudonymise training data on ingest, federated or split learning where central aggregation is unnecessary, differential privacy noise on aggregate statistics, k-anonymity on quasi-identifiers, and "minimal release by default" on outputs (do not show the model's raw confidence on a person's mental-health prediction unless someone asked for it).</p>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>The compliance heuristic:</strong> if your AI feature would not survive being described in plain English on the front page of a newspaper, it probably will not survive a regulator either. Article 25 is the engineering response to that test.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. What This Means for the Rest of the Track</h2>
<p class="l-text">GDPR is the legal floor for any AI system touching EU residents, but it does not by itself answer "is this AI <em>system</em> safe to deploy?" That question is the job of the EU AI Act (next lesson), the NIS2 / DORA cybersecurity directives (L3), structured risk management via NIST AI RMF (L4), audit frameworks like model cards and FactSheets (L5), and the management-system standards ISO 27001 + ISO/IEC 42001 (L6 capstone). Together those layers form the modern compliance stack: <strong>data law → product law → cybersecurity → risk → audit → certification</strong>.</p>
</div>`,
tr: `<p class="l-text"><strong>Genel Veri Koruma Tüzüğü (Yönetmelik AB 2016/679), son 25 yılın en sonuçlu veri mevzuatıdır</strong> ve AI sistemleri tam olarak ateş hattındadır. GDPR, 25 Mayıs 2018'den beri uygulanır, AB sakinlerinin verisini işleyen herhangi bir organizasyona ülke dışı uygulanır ve <em>küresel yıllık cironun %4'üne veya 20 milyon avroya, hangisi yüksekse</em> ona kadar para cezası yetkilendirir. Meta, Mayıs 2023'te yasadışı ABD veri transferleri için 1.2 milyar avro ödedi, Amazon 2021'de 746 milyon avro ödedi, Clearview AI yasal dayanak olmadan yüzleri kazıdığı için 2022'de İtalya Garante tarafından 30.5 milyon avroyla cezalandırıldı. Hiçbiri küçük girişim değildi; düzenleyici eylemi önemser, büyüklüğü değil.</p>

<p class="l-text">Bir AI mühendisi için GDPR, çerez bannerlarının bir kontrol listesi değildir. Üzerinde ne eğitebileceğinizin, ne dağıtabileceğinizin ve modelinizin ne karar vermesine izin verildiğinin somut bir kısıtlamasıdır. Tek başına Madde 22 — yasal veya benzer şekilde önemli etki üreten yalnızca otomatik kararlara tabi olmama hakkı — insan incelemesi veya açık rıza eklenmedikçe büyük bir "model karar versin" mimarisi sınıfını geçersiz kılar. Resital 71 bunu örtük bir açıklama hakkına çevirir. Madde 5'in veri minimizasyonu ilkesi, derin öğrenmenin her özelliği huniye atma içgüdüsüyle doğrudan gerilim halindedir. Bu ders, GDPR'yi AI yaşam döngüsüne haritalar, böylece şirketin dava edilmeden Avrupa'ya gönderilen sistemler inşa edebilirsiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Madde 6'nın altı yasal dayanağını yaygın AI kullanım durumlarına (eğitim, çıkarım, tutma) eşleyin</li>
<li>Madde 22'yi — otomatikleştirilmiş bireysel karar verme — uygulayın ve insan-in-the-loop'un ne zaman zorunlu olduğunu tanıyın</li>
<li>Yüksek riskli bir AI sistemi için Veri Koruma Etki Değerlendirmesi (DPIA, Madde 35) yapın</li>
<li>Özellik hatlarında veri minimizasyonu, amaç sınırlaması ve depolama sınırlamasını uygulayın</li>
<li>Erişim, düzeltme, silme ve açıklama haklarını onurlandırın (Madde 15-22, Resital 71)</li>
<li>Gerçek ceza vakalarını (Meta, Amazon, Clearview) ihlal ettikleri GDPR hükümlerine karşı puanlayın</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. Altı Yasal Dayanak — Madde 6</h2>
<p class="l-text">Eğitim verisi toplama ve model çıkarımı dahil her işleme operasyonunun, Madde 6(1) altında en az altı yasal dayanaktan birine ihtiyacı vardır: <strong>rıza, sözleşme, yasal yükümlülük, hayati çıkarlar, kamu görevi veya meşru çıkarlar</strong>. İlk hat kodu yazmadan önce doğru olanı seçin, çünkü her dayanak farklı sonraki haklar ve kısıtlamalar taşır. Rıza özgürce verilen, spesifik, bilgilendirilmiş ve geri alınabilir; bir kullanıcı geri aldığı an, işlemeyi durdurmalı ve (genellikle) türetilmiş artefaktları silmelisiniz. Meşru çıkarlar, iş ihtiyacınızı kullanıcı haklarına karşı dengeleyen belgelenmiş bir Meşru Çıkar Değerlendirmesi (LIA) gerektirir — düzenleyicinin denetleyebileceği bir denge testi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rıza (6.1.a)</div><div class="card-body">Opt-in, granüler, geri çekilebilir. Pazarlama, davranışsal reklam hedefleme ve çoğu B2C AI özelliği için varsayılan. Önceden işaretli kutular geçersizdir (CJEU <em>Planet49</em>, 2019).</div></div>
<div class="calc-card"><div class="card-title">Sözleşme (6.1.b)</div><div class="card-body">Kullanıcının imzaladığı bir sözleşmeyi yerine getirmek için gerekli. İşlemsel özellikleri kapsar (bir ödemede dolandırıcılık kontrolü) ama "bu üzerinde de eğitmek istiyoruz"u kapsamaz.</div></div>
<div class="calc-card"><div class="card-title">Yasal yükümlülük (6.1.c)</div><div class="card-body">AB veya üye devlet yasası tarafından gerekli. AML/KYC kontrolleri, vergi raporlaması. Spekülatif eğitim için çağrılamaz.</div></div>
<div class="calc-card"><div class="card-title">Hayati çıkarlar (6.1.d)</div><div class="card-body">Hayati tehlike durumları. Acil triyajdaki tıbbi AI dar senaryolarda buna güvenebilir.</div></div>
<div class="calc-card"><div class="card-title">Kamu görevi (6.1.e)</div><div class="card-body">Kamu otoritesinin yasal görevi. Hükümet risk-skorlama sistemleri (ör. NL'de 2020'de hukuksuz bulunan SyRI) buradadır.</div></div>
<div class="calc-card"><div class="card-title">Meşru çıkarlar (6.1.f)</div><div class="card-body">Üç parçalı test: meşru amaç, gereklilik, haklara karşı dengelenmiş. En esnek dayanak ama aynı zamanda en tartışmalı. LIA'yı belgeleyin.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>Özel kategoriler (Madde 9)</strong> — sağlık, biyometrik, etnik köken, cinsel yönelim, siyasi görüş, sendika üyeliği — Madde 6'nın üstüne ikinci bir dayanağa ihtiyaç duyar, genellikle açık rıza veya yasada önemli kamu yararı. Yüz tanıma AI'sı bu hükümle yaşar veya ölür.</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Madde 22 — Yalnızca Otomatik Kararlara Karşı Hak</h2>
<p class="l-text">Madde 22(1), her veri sahibine "kendisine ilişkin yasal etkiler üreten veya benzer şekilde önemli etkileyen, profilleme dahil yalnızca otomatik işlemeye dayanan bir karara tabi olmama hakkı" verir. 22(2)'deki istisnalar dardır: bir sözleşme için gerekli, yasayla yetkilendirilmiş veya açık rızaya dayalı. O zaman bile, 22(3) "veri sahibinin haklarını korumak için uygun önlemler" gerektirir — en azından insan müdahalesi alma hakkı, görüş bildirme ve kararı itiraz etme hakkı.</p>

<p class="l-text">Pratikte "yalnızca otomatik" Avrupa Veri Koruma Kurulu tarafından sıkı yorumlanır: model çıktılarının %99'unu iki saniyede onaylayan kauçuk damga insan inceleyicisi 22(3)'ü karşılamaz. CJEU'nun <em>SCHUFA</em> kararı (C-634/21, Aralık 2023), üçüncü bir tarafın bir krediyi reddetmek için kullandığı bir kredi skoru üretmenin bile Madde 22 altında otomatik karar sayıldığını tuttu — pek çok kredi-bürosu girişiminin varsaydığından daha öteye yükümlülüğü itti.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Madde 22 kapısı — korunan sonuçlar üzerinde tamamen otomatik kararları reddet</span>
PROTECTED_OUTCOMES = {<span class="str">"loan_decision"</span>, <span class="str">"hiring_decision"</span>, <span class="str">"benefits_eligibility"</span>,
                     <span class="str">"insurance_premium"</span>, <span class="str">"visa_decision"</span>, <span class="str">"parole_recommendation"</span>}

<span class="kw">def</span> <span class="fn">article22_gate</span>(decision_type, has_human_review, has_explicit_consent,
                   user_can_contest, score_only=<span class="kw">False</span>):
    <span class="kw">if</span> decision_type <span class="kw">not</span> <span class="kw">in</span> PROTECTED_OUTCOMES:
        <span class="kw">return</span> <span class="str">"OK: not within Art.22 scope"</span>
    <span class="kw">if</span> score_only:
        <span class="cm"># SCHUFA C-634/21: üçüncü taraf kararlarını besleyen skorlar da sayılır</span>
        <span class="kw">return</span> <span class="str">"BLOCKED: score still triggers Art.22 if a downstream party uses it"</span>
    <span class="kw">if</span> <span class="kw">not</span> (has_human_review <span class="kw">or</span> has_explicit_consent):
        <span class="kw">return</span> <span class="str">"BLOCKED: need human-in-the-loop OR explicit consent (Art.22(2))"</span>
    <span class="kw">if</span> <span class="kw">not</span> user_can_contest:
        <span class="kw">return</span> <span class="str">"BLOCKED: must allow user to contest (Art.22(3))"</span>
    <span class="kw">return</span> <span class="str">"OK: lawful with safeguards"</span>

cases = [
    (<span class="str">"loan_decision"</span>, <span class="kw">False</span>, <span class="kw">False</span>, <span class="kw">False</span>, <span class="kw">False</span>),
    (<span class="str">"loan_decision"</span>, <span class="kw">True</span>,  <span class="kw">False</span>, <span class="kw">True</span>,  <span class="kw">False</span>),
    (<span class="str">"hiring_decision"</span>, <span class="kw">False</span>, <span class="kw">True</span>,  <span class="kw">True</span>,  <span class="kw">False</span>),
    (<span class="str">"loan_decision"</span>, <span class="kw">False</span>, <span class="kw">True</span>,  <span class="kw">True</span>,  <span class="kw">True</span>),   <span class="cm"># SCHUFA senaryosu</span>
    (<span class="str">"product_recommendation"</span>, <span class="kw">False</span>, <span class="kw">False</span>, <span class="kw">False</span>, <span class="kw">False</span>),
]
<span class="kw">for</span> c <span class="kw">in</span> cases:
    <span class="fn">print</span>(c, <span class="str">"->"</span>, <span class="fn">article22_gate</span>(*c))</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) GDPR Madde 5/6/9/22/30/35'i somut boru hattı kontrol noktalarına eşler — yasal dayanak, özel kategoriler, otomatik kararlar, ROPA ve DPIA.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Ek paket olmayan saf Python — kapı anında çalışır ve herhangi bir çıktı dönmeden önce çıkarım servisinize bağlayacağınız türden bir yardımcıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Madde 5'in Yedi İlkesi</h2>
<p class="l-text">Madde 5, her işleme operasyonunun karşılaması gereken esas ilkeleri belirler: yasallık/adillik/şeffaflık, amaç sınırlaması, veri minimizasyonu, doğruluk, depolama sınırlaması, bütünlük/gizlilik ve hesap verebilirlik. Hesap verebilirlik ilkesi (5.2), diğerlerini sizin <em>belgelemeniz ve kanıtlamanız gereken</em> yükümlülüklere dönüştüren şeydir. "Bir gizlilik politikamız var" yetmez; işleme faaliyetlerinin kayıtlarına (Madde 30), gerektiğinde DPIA'lara ve denetim izlerine ihtiyacınız var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Amaç sınırlaması</div><div class="card-body">A amacı için toplanan veri, yeni bir yasal dayanak olmadan ilgisiz B amacı için yeniden kullanılamaz. "Bu bileti yanıtlamak" için toplanan müşteri destek biletleri üzerinde bir LLM eğitmek ders kitabı ihlalidir.</div></div>
<div class="calc-card"><div class="card-title">Veri minimizasyonu</div><div class="card-body">Yalnızca gerekeni toplayın/işleyin. "Daha çok özellik ancak yardımcı olur" derin-öğrenme içgüdüsü GDPR'a kaybeder. Modelin ihtiyacı yoksa eğitim setinden SSN'leri düşürün.</div></div>
<div class="calc-card"><div class="card-title">Depolama sınırlaması</div><div class="card-body">Tutma sürelerini önceden tanımlayın. Ham eğitim verisi, gömme vektörleri, model checkpoint'leri — hepsinin saatleri vardır. Süresiz tutma yasa dışıdır.</div></div>
<div class="calc-card"><div class="card-title">Doğruluk</div><div class="card-body">Kişisel veri doğru ve güncel tutulmalıdır. 2026 üretim kararında kullanılan 2020'den dondurulmuş bir eğitim seti, altta yatan gerçekler değiştiyse bunu ihlal edebilir.</div></div>
<div class="calc-card"><div class="card-title">Bütünlük ve gizlilik</div><div class="card-body">Beklemede ve aktarımda şifreleme, erişim kontrolleri, takma adlandırma. Madde 32'nin teknik ve organizasyonel önlemleri (TOM'lar).</div></div>
</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Resital 71 ve Açıklama Hakkı</h2>
<p class="l-text">Madde 22'nin kendisi tam olarak "açıklama hakkı" demez, ama Resital 71 — yorumlayıcı eşlikçi — "ulaşılan kararın bir açıklamasını alma" hakkından bahseder. Bunun katı bir yasal hak mı yoksa yumuşak bir yorumlayıcı rehber mi olduğu, AB AI hukukundaki en tartışmalı sorulardan biridir. Madde 29 Çalışma Grubu (şimdi EDPB) yönergeleri ve çoğu düzenleyici bunu <em>en azından</em> ilgili mantık hakkında anlamlı bilgi hakkı olarak ele alır (Madde 13(2)(f), 14(2)(g), 15(1)(h)).</p>

<p class="l-text">"Mantık hakkında anlamlı bilgi" her ağırlığı açıklamayı gerektirmez. İnsanın anlayabileceği terimlerle, kararı yönlendiren girdi kategorilerini, her birinin kabaca rolünü ve sonuçlarını açıklamayı gerektirir. Tek bir tahmin için bir SHAP grafiği genellikle bunu karşılar; 175 milyar parametrelik bir duvar karşılamaz.</p>

<div class="katex-block">$$\\text{Explainability}_\\text{GDPR} = f(\\text{logic clarity},\\ \\text{input significance},\\ \\text{contestability})$$</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Veri Koruma Etki Değerlendirmesi (DPIA)</h2>
<p class="l-text">Madde 35, "gerçek kişilerin hak ve özgürlüklerine yüksek risk oluşturma olasılığı yüksek" herhangi bir işleme öncesi DPIA gerektirir — ve EDPB'nin dokuz kriteri (büyük ölçek, sistematik izleme, özel kategoriler, savunmasız özneler, yenilikçi teknoloji vb.) neredeyse her ilginç AI sistemini yakalar. DPIA yapılandırılmış bir belgedir: işlemeyi tanımlayın, gerekliliği ve orantılılığı değerlendirin, riskleri belirleyin, azaltımları tasarlayın ve (artık risk hâlâ yüksekse) yayına almadan önce denetim makamına danışın.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Hafif DPIA puanlama aracı — aday bir AI sistemi için çalıştırılabilir risk skoru</span>
<span class="kw">import</span> json

<span class="kw">def</span> <span class="fn">dpia_score</span>(system):
    weights = {
        <span class="str">"special_categories"</span>: <span class="num">3</span>, <span class="str">"vulnerable_subjects"</span>: <span class="num">3</span>, <span class="str">"large_scale"</span>: <span class="num">2</span>,
        <span class="str">"systematic_monitoring"</span>: <span class="num">2</span>, <span class="str">"automated_decisions"</span>: <span class="num">3</span>, <span class="str">"innovative_tech"</span>: <span class="num">2</span>,
        <span class="str">"data_combined_from_sources"</span>: <span class="num">1</span>, <span class="str">"denies_access_to_service"</span>: <span class="num">2</span>,
        <span class="str">"involves_children"</span>: <span class="num">3</span>,
    }
    score = <span class="fn">sum</span>(w <span class="kw">for</span> k, w <span class="kw">in</span> weights.<span class="fn">items</span>() <span class="kw">if</span> system.<span class="fn">get</span>(k))
    <span class="kw">if</span> score &gt;= <span class="num">6</span>: tier = <span class="str">"HIGH RISK — DPIA mandatory, possibly prior consultation Art.36"</span>
    <span class="kw">elif</span> score &gt;= <span class="num">3</span>: tier = <span class="str">"MEDIUM — DPIA recommended"</span>
    <span class="kw">else</span>: tier = <span class="str">"LOW — record of processing only"</span>
    <span class="kw">return</span> {<span class="str">"score"</span>: score, <span class="str">"tier"</span>: tier,
            <span class="str">"trigger_factors"</span>: [k <span class="kw">for</span> k, w <span class="kw">in</span> weights.<span class="fn">items</span>() <span class="kw">if</span> system.<span class="fn">get</span>(k)]}

face_id_at_airport = {
    <span class="str">"special_categories"</span>: <span class="kw">True</span>, <span class="str">"large_scale"</span>: <span class="kw">True</span>,
    <span class="str">"systematic_monitoring"</span>: <span class="kw">True</span>, <span class="str">"innovative_tech"</span>: <span class="kw">True</span>,
    <span class="str">"automated_decisions"</span>: <span class="kw">True</span>, <span class="str">"vulnerable_subjects"</span>: <span class="kw">False</span>,
    <span class="str">"involves_children"</span>: <span class="kw">True</span>,
}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(<span class="fn">dpia_score</span>(face_id_at_airport), indent=<span class="num">2</span>))

newsletter_signup = {<span class="str">"large_scale"</span>: <span class="kw">True</span>}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(<span class="fn">dpia_score</span>(newsletter_signup), indent=<span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) GDPR Madde 5/6/9/22/30/35'i somut boru hattı kontrol noktalarına eşler — yasal dayanak, özel kategoriler, otomatik kararlar, ROPA ve DPIA. 2) temiz ve saldırılı / özel ve halka açık karşılaştırmasını yan yana okuyabilesin diye başlık metriğini yazdırır.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Düz Python; paket gerekmez. Ağırlıkları DPO'nuzun onayladığı EDPB kriterleriyle değiştirin ve elinizde yeniden kullanılabilir bir triyaj aracı olur.</p>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Veri Sahibi Hakları — Madde 15-22</h2>
<p class="l-text">Bir kullanıcı sizden verisinin bir kopyasını (Madde 15), düzeltmeyi (16), silme / unutulma hakkını (17), kısıtlamayı (18), taşınabilirliği (20), itirazı (21) ve otomatik kararlara tabi olmamayı (22) isteyebilir. Bir AI ekibi için bu üç somut yükümlülük demektir: (a) eğitim ve çıkarım loglarınızda bir kişinin kayıtlarını bulabilirsiniz; (b) onları bir ay içinde silebilir veya kısıtlayabilirsiniz (Madde 12(3)); (c) verilerinin aldıkları herhangi bir kararı nasıl etkilediğini açıklayabilirsiniz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Madde 15 — Erişim</div><div class="card-body">Bir kopya ve alıcı kategorilerini, tutma süresini ve kaynağı sağlayın. Otomatik kararlar için "ilgili mantık" ifşasını içerir.</div></div>
<div class="calc-card"><div class="card-title">Madde 17 — Silme</div><div class="card-body">Artık gerekli olmadığında, rıza geri çekildiğinde veya yasadışı işlendiğinde kişisel veriyi silin. Model ağırlıkları ile gerilim: makine-unlearning araştırması (Bourtoule 2021, SISA).</div></div>
<div class="calc-card"><div class="card-title">Madde 20 — Taşınabilirlik</div><div class="card-body">Kullanıcının sağladığı verinin yapılandırılmış, yaygın kullanılan, makine okunabilir dışa aktarımı. Genellikle JSON/CSV.</div></div>
<div class="calc-card"><div class="card-title">Madde 21 — İtiraz</div><div class="card-body">Kullanıcı, profilleme dahil meşru-çıkar işlemesine itiraz edebilir. İtirazı geçersiz kılan zorlayıcı meşru gerekçeler göstermedikçe durmalısınız.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>"Eğitilmiş model kişisel veridir" tartışması:</strong> Hamburg DPA Temmuz 2024'te LLM ağırlıklarının genellikle kişisel veri içermediğini söyledi; EDPB Görüş 28/2024 daha temkinliydi, duruma bağlı dedi. Bunu çözülmemiş olarak ele alın ve özellikle ince ayardan sonra ağırlıklarınızın kapsamda olabileceğini varsayın.</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Gerçek Cezalar — Desen Tanıma</h2>
<p class="l-text">En büyük GDPR cezalarına bakın ve ihlal edilen maddeler tekrar eder. Pahalı başarısızlık modları egzotik değildir; temel yükümlülüklerdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Meta — €1.2 milyar (Mayıs 2023)</div><div class="card-body">İrlanda DPC. Madde 46 — Schrems II sonrası ABD'ye yasadışı uluslararası transferler. Sürücü: TIA olmadan SCC'leri yeterli sayma.</div></div>
<div class="calc-card"><div class="card-title">Amazon — €746 milyon (Tem 2021)</div><div class="card-body">Lüksemburg CNPD. Geçerli rıza olmadan davranışsal reklamcılık. Madde 5 (yasallık) ve 6 (dayanak).</div></div>
<div class="calc-card"><div class="card-title">Meta (Instagram) — €405 milyon (2022)</div><div class="card-body">Reşit olmayanların hesaplarında varsayılan-açık ayarlar. Madde 5(1)(c), 6(1), 12, 24, 35.</div></div>
<div class="calc-card"><div class="card-title">Clearview AI — İtalya'da €30.5 milyon (2022) + diğer yerlerde yasaklar</div><div class="card-body">Yüz tanıma eğitmek için kamuya açık fotoğrafları kazıma. Madde 6 (dayanak yok) + Madde 9 (özel kategoriler) + ülke dışı erişim.</div></div>
<div class="calc-card"><div class="card-title">TikTok — €345 milyon (Eyl 2023)</div><div class="card-body">Çocukların verisi, varsayılan açık ayarlar, karanlık desenler. Madde 5, 12, 13, 24, 25.</div></div>
<div class="calc-card"><div class="card-title">OpenAI — İtalyan Garante geçici yasak (Mart 2023)</div><div class="card-body">Kazınmış veri üzerinde eğitim için yasal dayanak yok, yaş kontrolü yok, veri sahiplerine bilgi yok. İfşalar + opt-out + yaş kapısı ile çözüldü.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Pratik Bir AI/GDPR Mühendislik Kontrol Listesi</h2>
<p class="l-text">Düzenlemeyi bir model ekibinin günlük yaşamına çevirme. AB kişisel verisine dokunan herhangi bir üretim deploy'undan önce her satırı bir Tamamlanma Tanımı öğesi olarak ele alın.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

checklist = [
  (<span class="str">"Lawful basis identified per processing op"</span>,            <span class="str">"Art.6"</span>),
  (<span class="str">"Special-category basis if applicable"</span>,                  <span class="str">"Art.9"</span>),
  (<span class="str">"Privacy notice published before collection"</span>,            <span class="str">"Art.13/14"</span>),
  (<span class="str">"DPIA done for high-risk processing"</span>,                    <span class="str">"Art.35"</span>),
  (<span class="str">"Records of processing activities maintained"</span>,           <span class="str">"Art.30"</span>),
  (<span class="str">"Training data minimised &amp; categorised"</span>,                 <span class="str">"Art.5(1)(c)"</span>),
  (<span class="str">"Retention policy on raw data, features, weights"</span>,       <span class="str">"Art.5(1)(e)"</span>),
  (<span class="str">"Subject-access &amp; erasure pipeline tested"</span>,              <span class="str">"Art.15/17"</span>),
  (<span class="str">"Article 22 human-review path for protected outcomes"</span>,   <span class="str">"Art.22"</span>),
  (<span class="str">"DPO consulted (if appointed) / risk owner signed-off"</span>,  <span class="str">"Art.37-39"</span>),
  (<span class="str">"International transfer mechanism (SCCs+TIA / DPF)"</span>,     <span class="str">"Art.44-49"</span>),
  (<span class="str">"Breach response runbook, 72 h notification"</span>,            <span class="str">"Art.33-34"</span>),
]
df = pd.<span class="fn">DataFrame</span>(checklist, columns=[<span class="str">"control"</span>, <span class="str">"article"</span>])
df[<span class="str">"status"</span>] = [<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"TODO"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"TODO"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>,<span class="str">"OK"</span>]
gap = df[df.status == <span class="str">"TODO"</span>]
<span class="fn">print</span>(df.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nGaps:"</span>, <span class="fn">len</span>(gap), <span class="str">"of"</span>, <span class="fn">len</span>(df))
<span class="fn">print</span>(gap.<span class="fn">to_string</span>(index=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) GDPR Madde 5/6/9/22/30/35'i somut boru hattı kontrol noktalarına eşler — yasal dayanak, özel kategoriler, otomatik kararlar, ROPA ve DPIA.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas runner tarafından önceden yüklenmiştir. Kontrol listesi hash'leyebileceğiniz, sürüm-kontrolü yapabileceğiniz ve bir CI kapısına gömebileceğiniz bir DataFrame'e dönüşür.</p>
</div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Tasarım ve Varsayılanla Gizlilik — Madde 25</h2>
<p class="l-text">Madde 25, Ann Cavoukian'ın 2009'da yazdığını kodlar: gizlilik bir ek değil, mimari bir özellik olarak. AI için: ingest'te eğitim verisini takma adlandırın, merkezi toplama gereksiz olduğunda federe veya bölünmüş öğrenme, toplu istatistiklerde diferansiyel mahremiyet gürültüsü, yarı-tanımlayıcılarda k-anonimlik ve çıktılarda "varsayılan olarak minimum yayın" (kimse istemediği sürece bir kişinin ruh sağlığı tahmininde modelin ham güvenini göstermeyin).</p>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>Uyumluluk sezgisi:</strong> AI özelliğiniz bir gazetenin ön sayfasında düz İngilizce ile tanımlanmaya dayanmazsa, muhtemelen düzenleyiciye de dayanmaz. Madde 25 o teste mühendislik yanıtıdır.</div>
</div>

<div class="lesson-block" id="section-10-tr">
<h2 class="lesson-title">10. Bunun Track'in Geri Kalanı İçin Anlamı</h2>
<p class="l-text">GDPR, AB sakinlerine dokunan herhangi bir AI sistemi için yasal tabandır, ama tek başına "bu AI <em>sistemi</em> deploy etmek güvenli mi?" sorusunu yanıtlamaz. Bu soru AB AI Yasası'nın işidir (sonraki ders), NIS2 / DORA siber güvenlik direktiflerinin (L3), NIST AI RMF aracılığıyla yapılandırılmış risk yönetimi (L4), model kartları ve FactSheet'ler gibi denetim çerçeveleri (L5) ve yönetim sistemi standartları ISO 27001 + ISO/IEC 42001 (L6 bitirme) işidir. Bu katmanlar birlikte modern uyumluluk yığınını oluşturur: <strong>veri yasası → ürün yasası → siber güvenlik → risk → denetim → sertifikasyon</strong>.</p>
</div>`
};
