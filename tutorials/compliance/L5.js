window.COMPLIANCE_L5 = {
en: `<p class="l-text"><strong>An AI system without an audit trail is an unfalsifiable claim.</strong> Vendors have learned to say their model is "fair", "robust", "explainable", "human-aligned" — but a regulator, an enterprise procurement team, or a journalist asking pointed questions wants to see the evidence. Three pieces of academic work in 2018-2020 turned that demand into reusable scaffolding: <em>Datasheets for Datasets</em> (Gebru et al., FAT* 2018), <em>Model Cards for Model Reporting</em> (Mitchell et al., FAT* 2019), and <em>Closing the AI Accountability Gap: an Internal Audit Framework</em> (Raji et al., FAT* 2020). IBM's <em>AI FactSheets 360</em> programme, launched 2018-2019 and formalised in Arnold et al. 2019, gave the same idea an enterprise wrapping. Together these documents define the modern AI audit grammar.</p>

<p class="l-text">By 2026 these are no longer academic. Hugging Face requires model cards on uploads. Google ships model cards for Cloud Vision, Cloud Natural Language, MediaPipe, Gemini, and the People + AI Research suite. Microsoft uses Responsible AI Impact Assessments + Transparency Notes. Anthropic publishes system cards for every Claude release. The EU AI Act's Annex IV technical-documentation requirement is essentially a model card with regulatory teeth. This lesson walks the four canonical artefacts, the third-party-audit landscape, and the Raji internal-audit playbook — then shows how to assemble an evidence pack that maps onto AI Act Annex IV, ISO/IEC 42001, and NIST AI RMF simultaneously.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Author a model card following Mitchell et al. (2019) — nine sections, real metrics</li>
<li>Author a datasheet for datasets following Gebru et al. (2018) — motivation, composition, collection, preprocessing, distribution, maintenance</li>
<li>Apply IBM's AI FactSheets template to enterprise governance reporting</li>
<li>Walk the five stages of the Raji internal-audit framework: scoping, mapping, artefact collection, testing, reflection</li>
<li>Distinguish first-, second-, and third-party AI audits and when each fits</li>
<li>Map an evidence pack onto AI Act Annex IV, ISO 42001 clauses, and NIST RMF subcategories</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Audit AI at All</h2>
<p class="l-text">Audit's purpose is not to catch fraud after the fact — it is to make claims falsifiable in advance. An AI system has many layers of claims: the data is representative, the model achieves stated performance, the deployment honours stated policies. Each claim is a hypothesis that an auditor can test. Without artefacts (model card, datasheet, FactSheet, decision logs), there are no hypotheses to test; there is only marketing.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inward purpose</div><div class="card-body">Force the team to answer the questions before launch — most "we never thought of that" failures get caught at audit-prep, not at audit.</div></div>
<div class="calc-card"><div class="card-title">Outward purpose</div><div class="card-body">Give regulators, customers, and affected populations a credible signal. Without it, "trust us" is the only signal.</div></div>
<div class="calc-card"><div class="card-title">Forensic purpose</div><div class="card-body">When something goes wrong, an audit trail enables root-cause analysis and accountability allocation.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Model Cards (Mitchell et al. 2019)</h2>
<p class="l-text">A model card is a 1-3 page document that ships with a trained model. The 2019 paper proposed nine sections: <em>Model Details, Intended Use, Factors, Metrics, Evaluation Data, Training Data, Quantitative Analyses, Ethical Considerations, Caveats and Recommendations</em>. The form is now standard at Google, Hugging Face, OpenAI (system card), and Anthropic (system card). When the AI Act Annex IV asks for technical documentation, a thorough model card already covers most of it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Model details</div><div class="card-body">Architecture, version, owners, citation, license, contact.</div></div>
<div class="calc-card"><div class="card-title">Intended use</div><div class="card-body">Primary use cases, primary users, out-of-scope uses. Critical for AI Act Art. 13 transparency.</div></div>
<div class="calc-card"><div class="card-title">Factors</div><div class="card-body">Relevant subgroups, instrumentation, environmental conditions on which performance varies.</div></div>
<div class="calc-card"><div class="card-title">Metrics</div><div class="card-body">Performance metrics, decision thresholds, variation approaches. Disaggregated by factors.</div></div>
<div class="calc-card"><div class="card-title">Evaluation &amp; training data</div><div class="card-body">Datasets used, motivation for choices, preprocessing.</div></div>
<div class="calc-card"><div class="card-title">Ethical considerations + caveats</div><div class="card-body">Risks, mitigations, what-could-still-go-wrong, recommendations to deployers.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Building a Model Card with a Dataclass</h2>
<p class="l-text">Treat the model card as code. A Python dataclass exported as JSON gives you version control, diffing, automated checks, and embedding into your CI pipeline. Mitchell et al. recommended exactly this kind of automation.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> dataclasses <span class="kw">import</span> dataclass, field, asdict
<span class="kw">from</span> typing <span class="kw">import</span> List, Dict
<span class="kw">import</span> json

<span class="kw">@dataclass</span>
<span class="kw">class</span> ModelCard:
    name: <span class="fn">str</span>
    version: <span class="fn">str</span>
    owners: List[<span class="fn">str</span>]
    license: <span class="fn">str</span>
    intended_use: <span class="fn">str</span>
    out_of_scope: List[<span class="fn">str</span>]
    factors: List[<span class="fn">str</span>]
    metrics: Dict[<span class="fn">str</span>, <span class="fn">float</span>]
    metrics_by_subgroup: Dict[<span class="fn">str</span>, Dict[<span class="fn">str</span>, <span class="fn">float</span>]]
    training_data: <span class="fn">str</span>
    evaluation_data: <span class="fn">str</span>
    ethical_considerations: List[<span class="fn">str</span>]
    caveats: List[<span class="fn">str</span>]

card = <span class="fn">ModelCard</span>(
    name=<span class="str">"loan-default-v3"</span>,
    version=<span class="str">"3.1.0"</span>,
    owners=[<span class="str">"risk.modelling@example.eu"</span>],
    license=<span class="str">"proprietary, internal use only"</span>,
    intended_use=<span class="str">"Pre-screen consumer loan applications, EU residents, EUR 1k-50k."</span>,
    out_of_scope=[<span class="str">"mortgages"</span>, <span class="str">"business loans"</span>, <span class="str">"non-EU residents"</span>, <span class="str">"sole automated decision (Art.22)"</span>],
    factors=[<span class="str">"age_band"</span>, <span class="str">"gender"</span>, <span class="str">"country"</span>, <span class="str">"employment_status"</span>],
    metrics={<span class="str">"AUC"</span>: <span class="num">0.81</span>, <span class="str">"calibration_brier"</span>: <span class="num">0.12</span>, <span class="str">"PR_AUC"</span>: <span class="num">0.43</span>},
    metrics_by_subgroup={
        <span class="str">"country"</span>: {<span class="str">"DE"</span>: <span class="num">0.82</span>, <span class="str">"ES"</span>: <span class="num">0.80</span>, <span class="str">"PL"</span>: <span class="num">0.78</span>, <span class="str">"IT"</span>: <span class="num">0.79</span>},
        <span class="str">"gender"</span>:  {<span class="str">"F"</span>: <span class="num">0.81</span>, <span class="str">"M"</span>: <span class="num">0.81</span>, <span class="str">"other"</span>: <span class="num">0.79</span>},
    },
    training_data="loans_2019_2024_eu.parquet, n=2.4M, retention 7y, GDPR Art.6(1)(f) LIA #LIA-117",
    evaluation_data=<span class="str">"loans_2024Q4_holdout.parquet, n=120k"</span>,
    ethical_considerations=[
        <span class="str">"Disparate-impact tested across age, gender, country (4/5 rule passed)."</span>,
        <span class="str">"Article 22 gating: no sole-automated denials; human review for adverse decisions."</span>,
    ],
    caveats=[
        <span class="str">"Performance drops &gt;5pp on freelancer subgroup; flagged for retraining 2026Q3."</span>,
        <span class="str">"Not validated for inflation regimes &gt;6%."</span>,
    ],
)
<span class="fn">print</span>(json.<span class="fn">dumps</span>(<span class="fn">asdict</span>(card), indent=<span class="num">2</span>, ensure_ascii=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fills out a DPIA (Data Protection Impact Assessment) for the model: necessity, proportionality, risks, safeguards, residual risk.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pure standard library — runs anywhere. The JSON output is what you commit to your model registry alongside the weights.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Datasheets for Datasets (Gebru et al. 2018)</h2>
<p class="l-text">Datasheets are the upstream complement to model cards. Where model cards explain a trained artefact, datasheets explain the dataset that produced it. Gebru et al. proposed seven sections: <em>Motivation, Composition, Collection, Preprocessing/Cleaning, Uses, Distribution, Maintenance</em>. The motivating insight: most fairness and robustness failures are dataset failures masquerading as model failures.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Motivation</div><div class="card-body">Why was the dataset created? Who funded it? What gap was it filling?</div></div>
<div class="calc-card"><div class="card-title">Composition</div><div class="card-body">What instances does the dataset represent? How many? Are there missing subgroups?</div></div>
<div class="calc-card"><div class="card-title">Collection</div><div class="card-body">How was data acquired? Was consent obtained? Are there confidentiality concerns?</div></div>
<div class="calc-card"><div class="card-title">Preprocessing</div><div class="card-body">Cleaning, labelling, transformations. Raw data still available?</div></div>
<div class="calc-card"><div class="card-title">Uses</div><div class="card-body">What has the dataset been used for? What are inappropriate uses?</div></div>
<div class="calc-card"><div class="card-title">Distribution &amp; maintenance</div><div class="card-body">How is it distributed? License? Who maintains it? When was it last updated?</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">For an AI Act high-risk system, the datasheet is the natural home for Article 10 data-governance evidence — representativeness, error rates, completeness, statistical bias examination.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. IBM AI FactSheets (Arnold et al. 2019)</h2>
<p class="l-text">FactSheets generalise the model-card idea into a programmable supplier's declaration of conformity. The IBM team proposed templates for the model lifecycle (data collection → training → testing → deployment → monitoring) with role-specific views. By 2024 IBM had published 100+ public FactSheets across watsonx products. The format inspired the EU AI Act's Annex IV approach.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lifecycle stages</div><div class="card-body">Each stage has its own facts: data sourcing → training → eval → deployment. Inputs and outputs of one stage feed the next.</div></div>
<div class="calc-card"><div class="card-title">Role-specific views</div><div class="card-body">A regulator sees different facts than a procurement officer or a downstream developer. The same underlying data, different rendering.</div></div>
<div class="calc-card"><div class="card-title">Programmatic generation</div><div class="card-body">Facts emitted by the pipeline (test runs, fairness checks) populate the FactSheet automatically — no humans typing numbers into Word.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Raji 2020 Internal-Audit Framework</h2>
<p class="l-text">Raji et al. (FAT* 2020, "Closing the AI Accountability Gap") gave the field its first complete internal-audit playbook. Five stages, each with concrete artefacts.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Scoping</div><div class="card-body">Audit charter, social-impact assessment, stakeholder mapping.</div></div>
<div class="calc-card"><div class="card-title">2. Mapping</div><div class="card-body">FMEA-style failure-mode and effects analysis. Stakeholder concerns mapped onto specific subsystems.</div></div>
<div class="calc-card"><div class="card-title">3. Artefact collection</div><div class="card-body">Datasheets, model cards, design docs, code, training logs, eval results, incident logs.</div></div>
<div class="calc-card"><div class="card-title">4. Testing</div><div class="card-body">Adversarial probes, ethical-risk analysis, summary report against design intent.</div></div>
<div class="calc-card"><div class="card-title">5. Reflection</div><div class="card-body">Post-audit remediation plan, design history file, decision to ship / hold / kill.</div></div>
</div>

<p class="l-text">The framework's key contribution is the explicit "kill option" at stage 5. An audit that can never recommend killing a system is not an audit, it is a rubber stamp.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. First-, Second-, Third-Party Audits</h2>
<p class="l-text">Auditing has a standard taxonomy borrowed from financial assurance. AI audit follows the same lines.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">First-party (internal)</div><div class="card-body">Done by the producer's own team. Cheapest, fastest, lowest credibility. Raji 2020 framework.</div></div>
<div class="calc-card"><div class="card-title">Second-party</div><div class="card-body">Done by a customer or partner. Common in B2B procurement (e.g. a bank auditing a model vendor before signing).</div></div>
<div class="calc-card"><div class="card-title">Third-party (independent)</div><div class="card-body">Done by an accredited external auditor. Highest credibility. Required by AI Act Annex VII for some biometric uses; required by ISO 42001 certification.</div></div>
<div class="calc-card"><div class="card-title">Regulatory inspection</div><div class="card-body">Done by a market-surveillance authority post-incident or post-complaint. Always uses the available artefacts as starting point.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. An Internal-Audit Evidence Pack — Code</h2>
<p class="l-text">In practice an audit pack is a directory of artefacts plus a manifest mapping each artefact to the framework requirements it satisfies. Build the manifest as data.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

artefacts = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"model_card_v3.1.json"</span>,        <span class="str">"Model card"</span>,     [<span class="str">"AI-Act:Annex IV.2"</span>,<span class="str">"RMF:Map-3.1"</span>,<span class="str">"ISO42001:8.4"</span>]),
  (<span class="str">"datasheet_loans_2024.json"</span>,   <span class="str">"Datasheet"</span>,      [<span class="str">"AI-Act:Art.10"</span>,<span class="str">"RMF:Map-2.1"</span>,<span class="str">"ISO42001:7.5.3"</span>]),
  (<span class="str">"dpia_loans_v2.pdf"</span>,           <span class="str">"DPIA"</span>,           [<span class="str">"GDPR:Art.35"</span>,<span class="str">"AI-Act:Art.27"</span>,<span class="str">"ISO42001:6.1.4"</span>]),
  (<span class="str">"fairness_audit_2024Q4.html"</span>,  <span class="str">"Fairness audit"</span>, [<span class="str">"AI-Act:Art.10.2(f)"</span>,<span class="str">"RMF:Measure-2.11"</span>,<span class="str">"ISO42001:9.2"</span>]),
  (<span class="str">"redteam_report_v1.pdf"</span>,       <span class="str">"Red-team"</span>,       [<span class="str">"AI-Act:Art.15"</span>,<span class="str">"RMF:Measure-2.7"</span>,<span class="str">"ISO42001:8.3"</span>]),
  (<span class="str">"incident_log_2024.csv"</span>,       <span class="str">"Incident log"</span>,   [<span class="str">"AI-Act:Art.12,72"</span>,<span class="str">"NIS2:Art.21(b)"</span>,<span class="str">"ISO42001:10.2"</span>]),
  (<span class="str">"monitoring_dashboard.png"</span>,    <span class="str">"Monitoring"</span>,     [<span class="str">"AI-Act:Art.72"</span>,<span class="str">"RMF:Manage-4.1"</span>,<span class="str">"ISO42001:9.1"</span>]),
  (<span class="str">"training_log_v3.1.parquet"</span>,   <span class="str">"Training log"</span>,   [<span class="str">"AI-Act:Art.11"</span>,<span class="str">"RMF:Map-3.4"</span>,<span class="str">"ISO42001:7.5.3"</span>]),
  (<span class="str">"explanations_api_spec.md"</span>,    <span class="str">"Explainability"</span>, [<span class="str">"GDPR:Recital 71"</span>,<span class="str">"AI-Act:Art.13"</span>,<span class="str">"RMF:Measure-2.9"</span>]),
  (<span class="str">"human_oversight_runbook.md"</span>,  <span class="str">"Human oversight"</span>,<span class="str">"AI-Act:Art.14"</span>),
], columns=[<span class="str">"file"</span>,<span class="str">"kind"</span>,<span class="str">"mappings"</span>])

<span class="cm"># Coverage analysis: which framework requirements are evidenced?</span>
all_mappings = []
<span class="kw">for</span> m <span class="kw">in</span> artefacts.mappings:
    all_mappings.<span class="fn">extend</span>(m <span class="kw">if</span> <span class="fn">isinstance</span>(m, <span class="fn">list</span>) <span class="kw">else</span> [m])

coverage = pd.<span class="fn">Series</span>(all_mappings).<span class="fn">value_counts</span>()
<span class="fn">print</span>(<span class="str">"Artefact register:\\n"</span>, artefacts[[<span class="str">"file"</span>,<span class="str">"kind"</span>]].<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nCoverage of framework requirements:\\n"</span>, coverage.<span class="fn">to_string</span>())
gaps = [<span class="str">"AI-Act:Art.16"</span>,<span class="str">"AI-Act:Art.17(QMS)"</span>,<span class="str">"ISO42001:5.2(policy)"</span>]
missing = [g <span class="kw">for</span> g <span class="kw">in</span> gaps <span class="kw">if</span> g <span class="kw">not</span> <span class="kw">in</span> coverage.index]
<span class="fn">print</span>(<span class="str">"\\nMissing evidence:"</span>, missing)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) fills out a DPIA (Data Protection Impact Assessment) for the model: necessity, proportionality, risks, safeguards, residual risk.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas pre-loaded. Real-world version of this lives in a compliance-as-code repo with each artefact hash-pinned and CI-validated.</p>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Real-World Examples in 2024-2026</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Google model cards</div><div class="card-body">Cloud Vision face-detection model card published 2019; updated regularly. MediaPipe and Gemini ship cards alongside releases.</div></div>
<div class="calc-card"><div class="card-title">OpenAI system cards</div><div class="card-body">GPT-4 system card (March 2023), GPT-4V (September 2023), o1 (Sept 2024), GPT-4.5 (2025). Each documents red-team results and refusal rates.</div></div>
<div class="calc-card"><div class="card-title">Anthropic system cards</div><div class="card-body">Claude 3 (March 2024), Claude 3.5 Sonnet (June 2024), Claude Computer Use (October 2024). Includes ASL classification and capability evaluations.</div></div>
<div class="calc-card"><div class="card-title">Hugging Face</div><div class="card-body">Mandates model cards on uploads to the Hub. Tooling auto-generates the skeleton from <code>transformers</code>.</div></div>
<div class="calc-card"><div class="card-title">Meta Llama</div><div class="card-body">Responsible Use Guide + model card per release. Use Policy enforced via licensing.</div></div>
<div class="calc-card"><div class="card-title">EU AI Office</div><div class="card-body">GPAI Code of Practice (2025) cross-references all of the above as acceptable evidence.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Audit as Continuous Process</h2>
<p class="l-text">A 2018-style annual audit cannot keep pace with weekly model releases. Modern AI audit is continuous: model cards regenerated each release, fairness/robustness suites in CI, monitoring dashboards as standing artefacts, incident logs streamed to compliance. The Raji framework still holds — scoping, mapping, artefacts, testing, reflection — but each cycle is days, not quarters. The next lesson (capstone) puts this auditable evidence pack inside the certifiable management systems of ISO 27001 and ISO/IEC 42001, completing the comprehensive compliance stack.</p>
</div>`,
tr: `<p class="l-text"><strong>Denetim izi olmayan bir AI sistemi, yanlışlanamaz bir iddiadır.</strong> Satıcılar, modellerinin "adil", "sağlam", "açıklanabilir", "insan-uyumlu" olduğunu söylemeyi öğrendi — ama bir düzenleyici, kurumsal bir satın alma ekibi veya keskin sorular soran bir gazeteci kanıtı görmek ister. 2018-2020'deki üç akademik çalışma bu talebi yeniden kullanılabilir bir iskelet haline getirdi: <em>Veri Kümeleri için Datasheets</em> (Gebru et al., FAT* 2018), <em>Model Raporlama için Model Kartları</em> (Mitchell et al., FAT* 2019) ve <em>AI Hesap Verebilirlik Boşluğunu Kapatma: bir İç Denetim Çerçevesi</em> (Raji et al., FAT* 2020). IBM'in 2018-2019'da başlatılan ve Arnold et al. 2019'da resmileştirilen <em>AI FactSheets 360</em> programı, aynı fikre kurumsal bir sarmal verdi. Bu belgeler birlikte modern AI denetim grameri tanımlar.</p>

<p class="l-text">2026'ya kadar bunlar artık akademik değil. Hugging Face, yüklemelerde model kartları ister. Google Cloud Vision, Cloud Natural Language, MediaPipe, Gemini ve People + AI Research suite için model kartları gönderir. Microsoft Sorumlu AI Etki Değerlendirmeleri + Şeffaflık Notları kullanır. Anthropic her Claude sürümü için sistem kartları yayınlar. AB AI Yasası'nın Ek IV teknik dokümantasyon gereksinimi, düzenleyici dişlerle aslında bir model kartıdır. Bu ders dört kanonik artefaktı, üçüncü-taraf-denetim manzarasını ve Raji iç-denetim oyun kitabını yürür — sonra AB AI Yasası Ek IV, ISO/IEC 42001 ve NIST AI RMF üzerine eşzamanlı olarak haritalanan bir kanıt paketinin nasıl monte edileceğini gösterir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Mitchell et al. (2019)'a göre bir model kartı yazın — dokuz bölüm, gerçek metrikler</li>
<li>Gebru et al. (2018)'e göre veri kümeleri için bir datasheet yazın — motivasyon, kompozisyon, toplama, ön işleme, dağıtım, bakım</li>
<li>IBM'in AI FactSheets şablonunu kurumsal yönetişim raporlamasına uygulayın</li>
<li>Raji iç-denetim çerçevesinin beş aşamasını yürüyün: kapsam, haritalama, artefakt toplama, test, yansıma</li>
<li>Birinci-, ikinci- ve üçüncü-taraf AI denetimlerini ayırt edin ve her birinin ne zaman uygun olduğunu</li>
<li>Bir kanıt paketini AI Yasası Ek IV, ISO 42001 maddeleri ve NIST RMF alt kategorileriyle eşleştirin</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. Neden AI Denetlensin Ki</h2>
<p class="l-text">Denetimin amacı dolandırıcılığı sonradan yakalamak değildir — iddiaları önceden yanlışlanabilir yapmaktır. Bir AI sisteminin birçok iddia katmanı vardır: veri temsilidir, model belirtilen performansı elde eder, deploy belirtilen politikalara uyar. Her iddia, bir denetçinin test edebileceği bir hipotezdir. Artefaktlar (model kartı, datasheet, FactSheet, karar logları) olmadan, test edecek hipotez yoktur; yalnızca pazarlama vardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İçeriye dönük amaç</div><div class="card-body">Ekibi lansmandan önce soruları yanıtlamaya zorlayın — çoğu "bunu hiç düşünmemiştik" başarısızlığı denetim hazırlığında yakalanır, denetimde değil.</div></div>
<div class="calc-card"><div class="card-title">Dışarıya dönük amaç</div><div class="card-body">Düzenleyicilere, müşterilere ve etkilenen popülasyonlara güvenilir bir sinyal verin. Bu olmadan, "bize güvenin" tek sinyaldir.</div></div>
<div class="calc-card"><div class="card-title">Adli amaç</div><div class="card-body">Bir şey ters gittiğinde, bir denetim izi kök-neden analizini ve hesap verebilirlik dağıtımını sağlar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Model Kartları (Mitchell et al. 2019)</h2>
<p class="l-text">Bir model kartı, eğitilmiş bir modelle gönderilen 1-3 sayfalık bir belgedir. 2019 makalesi dokuz bölüm önerdi: <em>Model Detayları, Amaçlanan Kullanım, Faktörler, Metrikler, Değerlendirme Verisi, Eğitim Verisi, Niceliksel Analizler, Etik Hususlar, Uyarılar ve Öneriler</em>. Form artık Google, Hugging Face, OpenAI (sistem kartı) ve Anthropic'te (sistem kartı) standarttır. AI Yasası Ek IV teknik dokümantasyon istediğinde, kapsamlı bir model kartı çoğunu zaten kapsar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Model detayları</div><div class="card-body">Mimari, sürüm, sahipler, atıf, lisans, iletişim.</div></div>
<div class="calc-card"><div class="card-title">Amaçlanan kullanım</div><div class="card-body">Birincil kullanım durumları, birincil kullanıcılar, kapsam dışı kullanımlar. AI Yasası Md. 13 şeffaflığı için kritik.</div></div>
<div class="calc-card"><div class="card-title">Faktörler</div><div class="card-body">Performansın değiştiği ilgili alt gruplar, enstrümantasyon, çevresel koşullar.</div></div>
<div class="calc-card"><div class="card-title">Metrikler</div><div class="card-body">Performans metrikleri, karar eşikleri, varyasyon yaklaşımları. Faktörlere göre ayrıştırılmış.</div></div>
<div class="calc-card"><div class="card-title">Değerlendirme ve eğitim verisi</div><div class="card-body">Kullanılan veri kümeleri, seçim için motivasyon, ön işleme.</div></div>
<div class="calc-card"><div class="card-title">Etik hususlar + uyarılar</div><div class="card-body">Riskler, azaltımlar, hâlâ neyin ters gidebileceği, deployerlara öneriler.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Bir Dataclass ile Model Kartı İnşa Etmek</h2>
<p class="l-text">Model kartını kod olarak ele alın. JSON olarak dışa aktarılan bir Python dataclass'ı size sürüm kontrolü, diff'leme, otomatik kontroller ve CI hattınıza gömme verir. Mitchell et al. tam olarak bu tür otomasyonu önerdi.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> dataclasses <span class="kw">import</span> dataclass, field, asdict
<span class="kw">from</span> typing <span class="kw">import</span> List, Dict
<span class="kw">import</span> json

<span class="kw">@dataclass</span>
<span class="kw">class</span> ModelCard:
    name: <span class="fn">str</span>
    version: <span class="fn">str</span>
    owners: List[<span class="fn">str</span>]
    license: <span class="fn">str</span>
    intended_use: <span class="fn">str</span>
    out_of_scope: List[<span class="fn">str</span>]
    factors: List[<span class="fn">str</span>]
    metrics: Dict[<span class="fn">str</span>, <span class="fn">float</span>]
    metrics_by_subgroup: Dict[<span class="fn">str</span>, Dict[<span class="fn">str</span>, <span class="fn">float</span>]]
    training_data: <span class="fn">str</span>
    evaluation_data: <span class="fn">str</span>
    ethical_considerations: List[<span class="fn">str</span>]
    caveats: List[<span class="fn">str</span>]

card = <span class="fn">ModelCard</span>(
    name=<span class="str">"loan-default-v3"</span>,
    version=<span class="str">"3.1.0"</span>,
    owners=[<span class="str">"risk.modelling@example.eu"</span>],
    license=<span class="str">"proprietary, internal use only"</span>,
    intended_use=<span class="str">"Pre-screen consumer loan applications, EU residents, EUR 1k-50k."</span>,
    out_of_scope=[<span class="str">"mortgages"</span>, <span class="str">"business loans"</span>, <span class="str">"non-EU residents"</span>, <span class="str">"sole automated decision (Art.22)"</span>],
    factors=[<span class="str">"age_band"</span>, <span class="str">"gender"</span>, <span class="str">"country"</span>, <span class="str">"employment_status"</span>],
    metrics={<span class="str">"AUC"</span>: <span class="num">0.81</span>, <span class="str">"calibration_brier"</span>: <span class="num">0.12</span>, <span class="str">"PR_AUC"</span>: <span class="num">0.43</span>},
    metrics_by_subgroup={
        <span class="str">"country"</span>: {<span class="str">"DE"</span>: <span class="num">0.82</span>, <span class="str">"ES"</span>: <span class="num">0.80</span>, <span class="str">"PL"</span>: <span class="num">0.78</span>, <span class="str">"IT"</span>: <span class="num">0.79</span>},
        <span class="str">"gender"</span>:  {<span class="str">"F"</span>: <span class="num">0.81</span>, <span class="str">"M"</span>: <span class="num">0.81</span>, <span class="str">"other"</span>: <span class="num">0.79</span>},
    },
    training_data="loans_2019_2024_eu.parquet, n=2.4M, retention 7y, GDPR Art.6(1)(f) LIA #LIA-117",
    evaluation_data=<span class="str">"loans_2024Q4_holdout.parquet, n=120k"</span>,
    ethical_considerations=[
        <span class="str">"Disparate-impact tested across age, gender, country (4/5 rule passed)."</span>,
        <span class="str">"Article 22 gating: no sole-automated denials; human review for adverse decisions."</span>,
    ],
    caveats=[
        <span class="str">"Performance drops &gt;5pp on freelancer subgroup; flagged for retraining 2026Q3."</span>,
        <span class="str">"Not validated for inflation regimes &gt;6%."</span>,
    ],
)
<span class="fn">print</span>(json.<span class="fn">dumps</span>(<span class="fn">asdict</span>(card), indent=<span class="num">2</span>, ensure_ascii=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) model için bir DPIA (Veri Koruma Etki Değerlendirmesi) doldurur: gereklilik, orantılılık, riskler, güvenceler, kalan risk.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Saf standart kütüphane — her yerde çalışır. JSON çıktısı, ağırlıklarla birlikte model kayıt defterinize commit ettiğiniz şeydir.</p>
</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Veri Kümeleri için Datasheets (Gebru et al. 2018)</h2>
<p class="l-text">Datasheet'ler model kartlarının yukarı akış tamamlayıcısıdır. Model kartları eğitilmiş bir artefaktı açıklarken, datasheet'ler onu üreten veri kümesini açıklar. Gebru et al. yedi bölüm önerdi: <em>Motivasyon, Kompozisyon, Toplama, Ön İşleme/Temizleme, Kullanımlar, Dağıtım, Bakım</em>. Motive eden içgörü: çoğu adillik ve sağlamlık başarısızlığı, model başarısızlığı kılığına girmiş veri kümesi başarısızlıklarıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Motivasyon</div><div class="card-body">Veri kümesi neden oluşturuldu? Kim finanse etti? Hangi boşluğu doldurdu?</div></div>
<div class="calc-card"><div class="card-title">Kompozisyon</div><div class="card-body">Veri kümesi hangi örnekleri temsil ediyor? Kaç tane? Eksik alt gruplar var mı?</div></div>
<div class="calc-card"><div class="card-title">Toplama</div><div class="card-body">Veri nasıl edinildi? Rıza alındı mı? Gizlilik endişeleri var mı?</div></div>
<div class="calc-card"><div class="card-title">Ön işleme</div><div class="card-body">Temizleme, etiketleme, dönüşümler. Ham veri hâlâ mevcut mu?</div></div>
<div class="calc-card"><div class="card-title">Kullanımlar</div><div class="card-body">Veri kümesi ne için kullanıldı? Uygun olmayan kullanımlar nelerdir?</div></div>
<div class="calc-card"><div class="card-title">Dağıtım ve bakım</div><div class="card-body">Nasıl dağıtılır? Lisans? Kim sürdürür? Ne zaman güncellendi?</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">Bir AI Yasası yüksek-risk sistemi için datasheet, Madde 10 veri yönetişim kanıtı için doğal evdir — temsil yeteneği, hata oranları, bütünlük, istatistiksel bias incelemesi.</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. IBM AI FactSheets (Arnold et al. 2019)</h2>
<p class="l-text">FactSheets, model-kartı fikrini programlanabilir bir tedarikçi uygunluk beyanına genelleştirir. IBM ekibi model yaşam döngüsü için (veri toplama → eğitim → test → deploy → izleme) rol-spesifik görünümlerle şablonlar önerdi. 2024'e kadar IBM, watsonx ürünleri genelinde 100+ kamuya açık FactSheet yayımladı. Format AB AI Yasası'nın Ek IV yaklaşımına ilham verdi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yaşam döngüsü aşamaları</div><div class="card-body">Her aşamanın kendi gerçekleri vardır: veri kaynağı → eğitim → değerlendirme → deploy. Bir aşamanın girdileri ve çıktıları diğerini besler.</div></div>
<div class="calc-card"><div class="card-title">Rol-spesifik görünümler</div><div class="card-body">Bir düzenleyici, bir satın alma görevlisinden veya aşağı akış geliştiriciden farklı gerçekler görür. Aynı altta yatan veri, farklı işleme.</div></div>
<div class="calc-card"><div class="card-title">Programatik üretim</div><div class="card-body">Hat tarafından yayılan gerçekler (test çalıştırmaları, adillik kontrolleri) FactSheet'i otomatik olarak doldurur — sayıları Word'e yazan insan yok.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Raji 2020 İç Denetim Çerçevesi</h2>
<p class="l-text">Raji et al. (FAT* 2020, "AI Hesap Verebilirlik Boşluğunu Kapatma") alana ilk eksiksiz iç-denetim oyun kitabını verdi. Beş aşama, her birinin somut artefaktları var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Kapsam</div><div class="card-body">Denetim tüzüğü, sosyal-etki değerlendirmesi, paydaş haritalaması.</div></div>
<div class="calc-card"><div class="card-title">2. Haritalama</div><div class="card-body">FMEA tarzı başarısızlık-modu ve etki analizi. Paydaş endişeleri belirli alt sistemlere haritalanır.</div></div>
<div class="calc-card"><div class="card-title">3. Artefakt toplama</div><div class="card-body">Datasheet'ler, model kartları, tasarım dok'ları, kod, eğitim logları, değerlendirme sonuçları, olay logları.</div></div>
<div class="calc-card"><div class="card-title">4. Test</div><div class="card-body">Düşmanca probe'lar, etik-risk analizi, tasarım niyetine karşı özet rapor.</div></div>
<div class="calc-card"><div class="card-title">5. Yansıma</div><div class="card-body">Denetim sonrası iyileştirme planı, tasarım geçmiş dosyası, gönder / beklet / öldür kararı.</div></div>
</div>

<p class="l-text">Çerçevenin temel katkısı, 5. aşamadaki açık "öldürme seçeneği"dir. Bir sistemi öldürmeyi asla tavsiye edemeyen bir denetim, denetim değil, bir kauçuk damgadır.</p>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Birinci-, İkinci-, Üçüncü-Taraf Denetimler</h2>
<p class="l-text">Denetimin finansal güvenceden ödünç alınmış standart bir taksonomisi vardır. AI denetimi aynı çizgileri izler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birinci-taraf (iç)</div><div class="card-body">Üreticinin kendi ekibi tarafından yapılır. En ucuz, en hızlı, en düşük güvenilirlik. Raji 2020 çerçevesi.</div></div>
<div class="calc-card"><div class="card-title">İkinci-taraf</div><div class="card-body">Bir müşteri veya ortak tarafından yapılır. B2B satın almada yaygın (ör. imzalamadan önce bir model satıcısını denetleyen bir banka).</div></div>
<div class="calc-card"><div class="card-title">Üçüncü-taraf (bağımsız)</div><div class="card-body">Akredite bir dış denetçi tarafından yapılır. En yüksek güvenilirlik. AI Yasası Ek VII tarafından bazı biyometrik kullanımlar için gerekli; ISO 42001 sertifikasyonu tarafından gerekli.</div></div>
<div class="calc-card"><div class="card-title">Düzenleyici inceleme</div><div class="card-body">Olay sonrası veya şikayet sonrası bir piyasa-gözetim otoritesi tarafından yapılır. Daima mevcut artefaktları başlangıç noktası olarak kullanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Bir İç-Denetim Kanıt Paketi — Kod</h2>
<p class="l-text">Pratikte bir denetim paketi, bir artefaktlar dizini artı her artefaktı karşıladığı çerçeve gereksinimlerine eşleyen bir manifesttir. Manifesti veri olarak inşa edin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

artefacts = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"model_card_v3.1.json"</span>,        <span class="str">"Model card"</span>,     [<span class="str">"AI-Act:Annex IV.2"</span>,<span class="str">"RMF:Map-3.1"</span>,<span class="str">"ISO42001:8.4"</span>]),
  (<span class="str">"datasheet_loans_2024.json"</span>,   <span class="str">"Datasheet"</span>,      [<span class="str">"AI-Act:Art.10"</span>,<span class="str">"RMF:Map-2.1"</span>,<span class="str">"ISO42001:7.5.3"</span>]),
  (<span class="str">"dpia_loans_v2.pdf"</span>,           <span class="str">"DPIA"</span>,           [<span class="str">"GDPR:Art.35"</span>,<span class="str">"AI-Act:Art.27"</span>,<span class="str">"ISO42001:6.1.4"</span>]),
  (<span class="str">"fairness_audit_2024Q4.html"</span>,  <span class="str">"Fairness audit"</span>, [<span class="str">"AI-Act:Art.10.2(f)"</span>,<span class="str">"RMF:Measure-2.11"</span>,<span class="str">"ISO42001:9.2"</span>]),
  (<span class="str">"redteam_report_v1.pdf"</span>,       <span class="str">"Red-team"</span>,       [<span class="str">"AI-Act:Art.15"</span>,<span class="str">"RMF:Measure-2.7"</span>,<span class="str">"ISO42001:8.3"</span>]),
  (<span class="str">"incident_log_2024.csv"</span>,       <span class="str">"Incident log"</span>,   [<span class="str">"AI-Act:Art.12,72"</span>,<span class="str">"NIS2:Art.21(b)"</span>,<span class="str">"ISO42001:10.2"</span>]),
  (<span class="str">"monitoring_dashboard.png"</span>,    <span class="str">"Monitoring"</span>,     [<span class="str">"AI-Act:Art.72"</span>,<span class="str">"RMF:Manage-4.1"</span>,<span class="str">"ISO42001:9.1"</span>]),
  (<span class="str">"training_log_v3.1.parquet"</span>,   <span class="str">"Training log"</span>,   [<span class="str">"AI-Act:Art.11"</span>,<span class="str">"RMF:Map-3.4"</span>,<span class="str">"ISO42001:7.5.3"</span>]),
  (<span class="str">"explanations_api_spec.md"</span>,    <span class="str">"Explainability"</span>, [<span class="str">"GDPR:Recital 71"</span>,<span class="str">"AI-Act:Art.13"</span>,<span class="str">"RMF:Measure-2.9"</span>]),
  (<span class="str">"human_oversight_runbook.md"</span>,  <span class="str">"Human oversight"</span>,<span class="str">"AI-Act:Art.14"</span>),
], columns=[<span class="str">"file"</span>,<span class="str">"kind"</span>,<span class="str">"mappings"</span>])

<span class="cm"># Kapsam analizi: hangi çerçeve gereksinimleri kanıtlanmış?</span>
all_mappings = []
<span class="kw">for</span> m <span class="kw">in</span> artefacts.mappings:
    all_mappings.<span class="fn">extend</span>(m <span class="kw">if</span> <span class="fn">isinstance</span>(m, <span class="fn">list</span>) <span class="kw">else</span> [m])

coverage = pd.<span class="fn">Series</span>(all_mappings).<span class="fn">value_counts</span>()
<span class="fn">print</span>(<span class="str">"Artefact register:\\n"</span>, artefacts[[<span class="str">"file"</span>,<span class="str">"kind"</span>]].<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nCoverage of framework requirements:\\n"</span>, coverage.<span class="fn">to_string</span>())
gaps = [<span class="str">"AI-Act:Art.16"</span>,<span class="str">"AI-Act:Art.17(QMS)"</span>,<span class="str">"ISO42001:5.2(policy)"</span>]
missing = [g <span class="kw">for</span> g <span class="kw">in</span> gaps <span class="kw">if</span> g <span class="kw">not</span> <span class="kw">in</span> coverage.index]
<span class="fn">print</span>(<span class="str">"\\nMissing evidence:"</span>, missing)</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) model için bir DPIA (Veri Koruma Etki Değerlendirmesi) doldurur: gereklilik, orantılılık, riskler, güvenceler, kalan risk.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas önceden yüklü. Bunun gerçek dünya sürümü, her artefakt hash sabitlenmiş ve CI doğrulanmış bir uyumluluk-as-code repo'sunda yaşar.</p>
</div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. 2024-2026'da Gerçek Dünya Örnekleri</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Google model kartları</div><div class="card-body">Cloud Vision yüz-tespit model kartı 2019'da yayımlandı; düzenli güncellenir. MediaPipe ve Gemini sürümlerle birlikte kart gönderir.</div></div>
<div class="calc-card"><div class="card-title">OpenAI sistem kartları</div><div class="card-body">GPT-4 sistem kartı (Mart 2023), GPT-4V (Eylül 2023), o1 (Eyl 2024), GPT-4.5 (2025). Her biri red-team sonuçlarını ve red oranlarını belgeler.</div></div>
<div class="calc-card"><div class="card-title">Anthropic sistem kartları</div><div class="card-body">Claude 3 (Mart 2024), Claude 3.5 Sonnet (Haz 2024), Claude Computer Use (Ekim 2024). ASL sınıflandırmasını ve yetenek değerlendirmelerini içerir.</div></div>
<div class="calc-card"><div class="card-title">Hugging Face</div><div class="card-body">Hub'a yüklemelerde model kartlarını zorunlu kılar. Araç <code>transformers</code>'tan iskeleti otomatik üretir.</div></div>
<div class="calc-card"><div class="card-title">Meta Llama</div><div class="card-body">Sürüm başına Sorumlu Kullanım Kılavuzu + model kartı. Lisanslama yoluyla zorlanan Kullanım Politikası.</div></div>
<div class="calc-card"><div class="card-title">AB AI Ofisi</div><div class="card-body">GPAI Davranış Kuralları (2025) yukarıdakilerin hepsine kabul edilebilir kanıt olarak çapraz referans verir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10-tr">
<h2 class="lesson-title">10. Sürekli Süreç Olarak Denetim</h2>
<p class="l-text">2018 tarzı yıllık bir denetim, haftalık model sürümleriyle aynı tempoda yürüyemez. Modern AI denetimi süreklidir: her sürümde yeniden üretilen model kartları, CI'da adillik/sağlamlık paketleri, sürekli artefakt olarak izleme dashboard'ları, uyumluluğa akan olay logları. Raji çerçevesi hâlâ geçerlidir — kapsam, haritalama, artefaktlar, test, yansıma — ama her döngü çeyrek değil, gündür. Sonraki ders (bitirme) bu denetlenebilir kanıt paketini ISO 27001 ve ISO/IEC 42001'in sertifikalanabilir yönetim sistemleri içine yerleştirir, kapsamlı uyumluluk yığınını tamamlar.</p>
</div>`
};
