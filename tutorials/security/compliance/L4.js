window.COMPLIANCE_L4 = {
en: `<p class="l-text"><strong>Risk management for AI is not the same as risk management for ordinary software.</strong> A traditional system fails in failure modes you mostly know about: a service is up or down, a database returns the right or wrong row, a deployment passes or breaks. AI systems fail in ways that look like success — they produce confident, fluent outputs that are subtly wrong, biased on a sub-population, brittle under distribution shift, or manipulable via crafted inputs. The US National Institute of Standards and Technology released the AI Risk Management Framework (NIST AI 100-1, version 1.0) in January 2023 specifically to give organisations a vocabulary and process for these AI-shaped risks, complemented by the GenAI Profile (NIST AI 600-1, July 2024) for foundation models.</p>

<p class="l-text">In Europe, ENISA's AI Threat Landscape (originally 2020, updated 2023) maps the same territory with a more security-flavoured taxonomy: data integrity attacks, model evasion, model extraction, supply-chain compromise, abuse of model outputs. NIST and ENISA together — plus ISO/IEC 23894:2023 (the AI risk-management standard) — give an AI engineer a complete vocabulary. This lesson teaches you to <em>Govern, Map, Measure, and Manage</em> (the four NIST functions), to read residual risk as ALARP, to separate hazard analysis from risk assessment, and to build governance roles that the EU AI Act and ISO/IEC 42001 will recognise.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Apply the four NIST AI RMF functions: Govern, Map, Measure, Manage</li>
<li>Use the seven trustworthy-AI characteristics (valid, safe, secure/resilient, accountable, explainable, privacy-enhanced, fair)</li>
<li>Map ENISA's AI threat taxonomy onto your stack: data, model, infrastructure, supply-chain</li>
<li>Compute risk = likelihood × impact, residual risk after controls, and ALARP</li>
<li>Score an AI system on a weighted RMF questionnaire and produce a heat-map output</li>
<li>Define governance RACI: AI risk owner, model owner, data owner, MRM, internal audit</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The NIST AI RMF Core — Four Functions</h2>
<p class="l-text">The Core is a deliberately small set of functions, each broken into categories and subcategories. The intent is to be lifecycle-spanning and lightweight enough that organisations can adopt it incrementally rather than freeze for two years before producing a single deliverable.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Govern</div><div class="card-body">Cultivate the culture, policies, and accountability that lets the other three functions actually happen. Roles, escalation paths, board engagement, third-party policy.</div></div>
<div class="calc-card"><div class="card-title">Map</div><div class="card-body">Establish context. What is the system, who is affected, what is the use case, what is in/out of scope, who are the stakeholders? "Map" is where you decide whether to build at all.</div></div>
<div class="calc-card"><div class="card-title">Measure</div><div class="card-body">Quantitative and qualitative analysis. Test for the seven trustworthiness characteristics. Bias audits, robustness tests, evaluations against ground truth, red-teaming.</div></div>
<div class="calc-card"><div class="card-title">Manage</div><div class="card-body">Allocate resources to identified risks based on impact. Decide accept / mitigate / transfer / avoid. Document residual risk and accept it formally.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">RMF is voluntary in the US but increasingly used by federal procurement and by private firms as evidence of due diligence. In the EU it complements the AI Act's Article 9 risk-management requirement and is referenced by the GPAI Code of Practice.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Seven Trustworthy-AI Characteristics</h2>
<p class="l-text">NIST defines trustworthy AI by seven properties. These are not independent — pushing on one (e.g. fairness via post-hoc reweighting) often shifts another (accuracy on the dominant subgroup). The point of the framework is to make those trade-offs explicit rather than hidden.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Valid &amp; reliable</div><div class="card-body">Outputs are correct under expected conditions and degrade gracefully outside them. Tested on diverse data including OOD.</div></div>
<div class="calc-card"><div class="card-title">Safe</div><div class="card-body">Does not endanger human life, health, property, or environment. Especially relevant for cyber-physical AI.</div></div>
<div class="calc-card"><div class="card-title">Secure &amp; resilient</div><div class="card-body">Protected against adversarial inputs, model theft, supply-chain compromise. Recovers from attacks and faults.</div></div>
<div class="calc-card"><div class="card-title">Accountable &amp; transparent</div><div class="card-body">Decisions are auditable; an organisation can be held responsible. Versioning, logging, model cards.</div></div>
<div class="calc-card"><div class="card-title">Explainable &amp; interpretable</div><div class="card-body">Stakeholders can understand outputs at appropriate granularity. SHAP, LIME, attention rollouts, surrogate models.</div></div>
<div class="calc-card"><div class="card-title">Privacy-enhanced</div><div class="card-body">Differential privacy, federated learning, k-anonymity, data minimisation. Aligns with GDPR Art. 25.</div></div>
<div class="calc-card"><div class="card-title">Fair — harmful bias managed</div><div class="card-body">Statistical, computational, and human cognitive biases identified, documented, and addressed.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ENISA's AI Threat Taxonomy</h2>
<p class="l-text">ENISA categorises AI threats by where in the stack they hit and by what the attacker wants. This taxonomy plugs naturally into NIS2 Art. 21 supply-chain requirements (lesson L3) and into NIST RMF's Measure function.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Data integrity attacks</div><div class="card-body">Poisoning during training (BadNets, label flipping), evasion at inference (adversarial examples, prompt injection).</div></div>
<div class="calc-card"><div class="card-title">Model extraction / inversion</div><div class="card-body">Steal weights via API queries (Tramèr 2016) or reconstruct training data via membership inference (Shokri 2017).</div></div>
<div class="calc-card"><div class="card-title">Output abuse</div><div class="card-body">Use the model to generate disinformation, deepfakes, malware, social-engineering content. CSAM generation.</div></div>
<div class="calc-card"><div class="card-title">Supply chain</div><div class="card-body">Compromise of pretrained weights, datasets, dependencies, fine-tuning pipelines. Hugging Face model trojans.</div></div>
<div class="calc-card"><div class="card-title">Infrastructure</div><div class="card-body">Hardware side-channels, GPU memory attacks, exfiltration via plugin/tool execution, container escape.</div></div>
<div class="calc-card"><div class="card-title">Sociotechnical</div><div class="card-body">Over-reliance, automation bias, decision-laundering, harmful feedback loops.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">For LLM-specific threats, see also OWASP Top 10 for LLM Applications (2023, updated 2024) and MITRE ATLAS — the adversarial-ML knowledge base.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Hazard Analysis vs Risk Assessment</h2>
<p class="l-text">A small but important vocabulary distinction. <strong>Hazard analysis</strong> identifies what can go wrong (failure modes, attack vectors) regardless of probability. <strong>Risk assessment</strong> attaches likelihood and impact to those hazards and ranks them. Hazard analysis is brainstorm-driven (HAZOP, FMEA, STPA-Sec); risk assessment is quantitative or semi-quantitative.</p>

<div class="katex-block">$$\\text{Risk} = \\text{Likelihood} \\times \\text{Impact}$$</div>

<div class="katex-block">$$\\text{Residual risk} = \\text{Inherent risk} \\times (1 - \\text{Control effectiveness})$$</div>

<div class="katex-block">$$\\text{ALARP} : \\text{reduce residual risk As Low As Reasonably Practicable}$$</div>

<p class="l-text">ALARP, borrowed from UK safety law, is the residual-risk acceptability test: keep reducing until the cost of the next reduction is grossly disproportionate to the benefit. Useful for AI because some residual bias or robustness gap will always remain.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A Weighted RMF Questionnaire in Code</h2>
<p class="l-text">A practical instrument: turn the RMF subcategories into a weighted questionnaire, score each on 0-3 (not done / partial / mostly done / fully done), aggregate to a maturity score per function.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

questionnaire = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"Govern"</span>,  <span class="str">"Roles &amp; responsibilities documented"</span>,          <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Govern"</span>,  <span class="str">"Board engagement &amp; reporting cadence"</span>,          <span class="num">2</span>, <span class="num">1</span>),
  (<span class="str">"Govern"</span>,  <span class="str">"Third-party policy"</span>,                            <span class="num">3</span>, <span class="num">3</span>),
  (<span class="str">"Map"</span>,     <span class="str">"System purpose &amp; stakeholders identified"</span>,      <span class="num">3</span>, <span class="num">3</span>),
  (<span class="str">"Map"</span>,     <span class="str">"Out-of-scope uses documented"</span>,                  <span class="num">2</span>, <span class="num">2</span>),
  (<span class="str">"Map"</span>,     <span class="str">"Impact assessment on affected populations"</span>,     <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Measure"</span>, <span class="str">"Validity / accuracy metrics &amp; thresholds"</span>,      <span class="num">3</span>, <span class="num">3</span>),
  (<span class="str">"Measure"</span>, <span class="str">"Robustness &amp; adversarial testing"</span>,              <span class="num">3</span>, <span class="num">1</span>),
  (<span class="str">"Measure"</span>, <span class="str">"Bias / fairness audit"</span>,                         <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Measure"</span>, <span class="str">"Privacy testing (DP / membership inference)"</span>,   <span class="num">2</span>, <span class="num">1</span>),
  (<span class="str">"Manage"</span>,  <span class="str">"Risk register &amp; treatment plans"</span>,               <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Manage"</span>,  <span class="str">"Incident response runbooks"</span>,                    <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Manage"</span>,  <span class="str">"Continuous monitoring in production"</span>,           <span class="num">3</span>, <span class="num">2</span>),
], columns=[<span class="str">"function"</span>,<span class="str">"subcategory"</span>,<span class="str">"weight"</span>,<span class="str">"score_0_3"</span>])

questionnaire[<span class="str">"weighted"</span>] = questionnaire.weight * questionnaire.score_0_3
totals = questionnaire.<span class="fn">groupby</span>(<span class="str">"function"</span>).<span class="fn">apply</span>(
    <span class="kw">lambda</span> g: pd.<span class="fn">Series</span>({
        <span class="str">"achieved"</span>: g.weighted.<span class="fn">sum</span>(),
        <span class="str">"max"</span>:      g.weight.<span class="fn">sum</span>() * <span class="num">3</span>,
        <span class="str">"pct"</span>:      <span class="fn">round</span>(<span class="num">100</span> * g.weighted.<span class="fn">sum</span>() / (g.weight.<span class="fn">sum</span>() * <span class="num">3</span>), <span class="num">1</span>)
    }))
<span class="fn">print</span>(questionnaire.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nFunction maturity:"</span>)
<span class="fn">print</span>(totals.<span class="fn">to_string</span>())
overall = <span class="num">100</span> * questionnaire.weighted.<span class="fn">sum</span>() / (questionnaire.weight.<span class="fn">sum</span>() * <span class="num">3</span>)
<span class="fn">print</span>(f<span class="str">"\\nOverall RMF maturity: {overall:.1f}%"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) maps ISO 27001 (information security) and ISO 42001 (AI management system) controls to the corresponding ML pipeline stages.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas pre-loaded. The weights in the table reflect importance under the AI Act + ISO 42001; tune them to your sector.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Governance Roles — RACI for an AI Risk Programme</h2>
<p class="l-text">Compliance theatre is what happens when nobody owns the risk. A workable RACI for an AI programme has at least five roles, mirroring three lines of defence (1LoD = business, 2LoD = risk &amp; compliance, 3LoD = internal audit).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Model owner (1LoD)</div><div class="card-body">Accountable for performance, monitoring, retraining. Usually a senior data-science / ML engineer.</div></div>
<div class="calc-card"><div class="card-title">Data owner (1LoD)</div><div class="card-body">Accountable for the training/inference data: lineage, quality, lawful basis, retention.</div></div>
<div class="calc-card"><div class="card-title">AI risk owner (1LoD)</div><div class="card-body">Business sponsor accountable for residual risk acceptance. Often a product or ops lead.</div></div>
<div class="calc-card"><div class="card-title">Model risk management (2LoD)</div><div class="card-body">Independent challenge of methodology, data, performance. SR 11-7-style validation.</div></div>
<div class="calc-card"><div class="card-title">Internal audit (3LoD)</div><div class="card-body">Periodic independent assurance that the programme works as designed (Raji 2020 pattern, lesson L5).</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Risk Register and Heat Map</h2>
<p class="l-text">A risk register is the single source of truth for what could go wrong, how likely, how bad, what controls reduce it, who owns it, and how confident the residual estimate is.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

risks = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"R-01"</span>,<span class="str">"Bias against protected group"</span>,      <span class="num">4</span>, <span class="num">4</span>, <span class="str">"fairness audit + retraining"</span>, <span class="num">0.6</span>),
  (<span class="str">"R-02"</span>,<span class="str">"Prompt injection &amp; tool misuse"</span>,    <span class="num">5</span>, <span class="num">4</span>, <span class="str">"input validation + tool allowlist + sandbox"</span>, <span class="num">0.7</span>),
  (<span class="str">"R-03"</span>,<span class="str">"Training data leak via extraction"</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="str">"rate limit + canary tokens + DP fine-tune"</span>, <span class="num">0.5</span>),
  (<span class="str">"R-04"</span>,<span class="str">"Vendor outage (single foundation)"</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="str">"multi-vendor router + degraded mode"</span>, <span class="num">0.7</span>),
  (<span class="str">"R-05"</span>,<span class="str">"Hallucinated medical advice"</span>,       <span class="num">3</span>, <span class="num">5</span>, <span class="str">"RAG with citations + abstain threshold + MD review"</span>, <span class="num">0.65</span>),
  (<span class="str">"R-06"</span>,<span class="str">"GDPR Art.22 challenge"</span>,             <span class="num">2</span>, <span class="num">5</span>, <span class="str">"human-in-the-loop + explanation API"</span>, <span class="num">0.8</span>),
  (<span class="str">"R-07"</span>,<span class="str">"Model drift unnoticed"</span>,             <span class="num">4</span>, <span class="num">3</span>, <span class="str">"monitoring + alert thresholds + auto-retrain"</span>, <span class="num">0.7</span>),
], columns=[<span class="str">"id"</span>,<span class="str">"scenario"</span>,<span class="str">"likelihood"</span>,<span class="str">"impact"</span>,<span class="str">"controls"</span>,<span class="str">"control_eff"</span>])

risks[<span class="str">"inherent"</span>] = risks.likelihood * risks.impact
risks[<span class="str">"residual"</span>] = (risks.inherent * (<span class="num">1</span> - risks.control_eff)).<span class="fn">round</span>(<span class="num">2</span>)
risks[<span class="str">"tier"</span>] = pd.<span class="fn">cut</span>(risks.residual, bins=[-<span class="num">1</span>,<span class="num">3</span>,<span class="num">7</span>,<span class="num">12</span>,<span class="num">25</span>],
                      labels=[<span class="str">"LOW"</span>,<span class="str">"MEDIUM"</span>,<span class="str">"HIGH"</span>,<span class="str">"CRITICAL"</span>])

<span class="fn">print</span>(risks[[<span class="str">"id"</span>,<span class="str">"scenario"</span>,<span class="str">"inherent"</span>,<span class="str">"residual"</span>,<span class="str">"tier"</span>]].<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nALARP candidates (residual &gt; 5):"</span>)
<span class="fn">print</span>(risks[risks.residual &gt; <span class="num">5</span>][[<span class="str">"id"</span>,<span class="str">"scenario"</span>,<span class="str">"residual"</span>,<span class="str">"controls"</span>]].<span class="fn">to_string</span>(index=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) maps ISO 27001 (information security) and ISO 42001 (AI management system) controls to the corresponding ML pipeline stages.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas pre-loaded. Real risk registers add likelihood-rationale, last-test-date, owner, evidence link.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Aligning RMF with the AI Act and ISO 42001</h2>
<p class="l-text">The RMF Core maps cleanly onto AI Act Article 9 obligations. NIST published a crosswalk; here is the essentials.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Govern ↔ AI Act Art. 17 (QMS)</div><div class="card-body">Quality management system, accountability, governance documentation.</div></div>
<div class="calc-card"><div class="card-title">Map ↔ Art. 9.2(a) + Annex IV</div><div class="card-body">Identification &amp; analysis of known and reasonably foreseeable risks. Technical documentation.</div></div>
<div class="calc-card"><div class="card-title">Measure ↔ Art. 9.2(b-c) + Art. 15</div><div class="card-body">Estimation and evaluation of risks; accuracy/robustness/cybersecurity testing.</div></div>
<div class="calc-card"><div class="card-title">Manage ↔ Art. 9.2(d) + Art. 72</div><div class="card-body">Adoption of risk-management measures; post-market monitoring.</div></div>
</div>

<p class="l-text">ISO/IEC 23894:2023 — the dedicated AI risk-management standard — provides the same architecture in ISO format and pairs naturally with ISO/IEC 42001 (lesson L6).</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. The GenAI Profile (NIST AI 600-1)</h2>
<p class="l-text">In July 2024 NIST released the GenAI Profile, an addendum that lists 12 risks unique or amplified by generative AI: confabulation, dangerous information disclosure, data privacy, environmental impact, harmful bias, human-AI configuration, information integrity, information security, IP, obscene/degrading content, value chain &amp; component integration, and CBRN-related risks. Each risk is mapped onto suggested actions across Govern/Map/Measure/Manage. If you are running an LLM in production, the GenAI Profile is the practical playbook.</p>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">"Confabulation" is NIST's preferred term for what the public calls hallucination. The terminology matters: confabulation describes the mechanism (generating plausible-but-unverified content from priors) without anthropomorphising.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. From Risk to Audit</h2>
<p class="l-text">Once you have a risk register, governance, and controls, you need to <em>show your working</em> to a third party. That is the job of audit frameworks — model cards, datasheets, FactSheets, and the internal-audit playbook of Raji et al. (2020). The next lesson walks each of them and shows how to assemble an evidence pack that survives a regulator's inspection.</p>
</div>`,
tr: `<p class="l-text"><strong>AI için risk yönetimi, sıradan yazılım için risk yönetimiyle aynı şey değildir.</strong> Geleneksel bir sistem, çoğunlukla bildiğiniz başarısızlık modlarında başarısız olur: bir hizmet açık veya kapalıdır, bir veritabanı doğru veya yanlış satırı döndürür, bir deploy geçer veya kırılır. AI sistemleri başarı gibi görünen şekillerde başarısız olur — kendinden emin, akıcı, ince şekilde yanlış, bir alt-popülasyonda bias'lı, dağılım kayması altında kırılgan veya işlenmiş girdilerle manipüle edilebilir çıktılar üretirler. ABD Ulusal Standartlar ve Teknoloji Enstitüsü, Ocak 2023'te AI Risk Yönetimi Çerçevesi'ni (NIST AI 100-1, sürüm 1.0) tam olarak organizasyonlara bu AI-şekilli riskler için bir kelime dağarcığı ve süreç vermek için yayımladı; temel modeller için GenAI Profili (NIST AI 600-1, Temmuz 2024) ile tamamlandı.</p>

<p class="l-text">Avrupa'da ENISA'nın AI Tehdit Manzarası (orijinali 2020, 2023'te güncellendi) aynı bölgeyi daha güvenlik aromalı bir taksonomi ile haritalar: veri bütünlüğü saldırıları, model kaçınma, model çıkarma, tedarik zinciri uzlaşması, model çıktısı kötüye kullanımı. NIST ve ENISA birlikte — artı ISO/IEC 23894:2023 (AI risk yönetimi standardı) — bir AI mühendisine eksiksiz bir kelime dağarcığı verir. Bu ders size <em>Yönet, Haritala, Ölç ve Yönet</em>'i (dört NIST fonksiyonu), kalan riski ALARP olarak okumayı, tehlike analizini risk değerlendirmesinden ayırmayı ve AB AI Yasası ile ISO/IEC 42001'in tanıyacağı yönetişim rolleri inşa etmeyi öğretir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dört NIST AI RMF fonksiyonunu uygulayın: Yönet, Haritala, Ölç, Yönet</li>
<li>Yedi güvenilir-AI özelliğini kullanın (geçerli, güvenli, güvenli/dayanıklı, hesap verebilir, açıklanabilir, mahremiyet-iyileştirilmiş, adil)</li>
<li>ENISA'nın AI tehdit taksonomisini yığınınıza eşleyin: veri, model, altyapı, tedarik zinciri</li>
<li>Risk = olasılık × etki, kontrollerden sonra kalan risk ve ALARP hesaplayın</li>
<li>Bir AI sistemini ağırlıklı RMF anketinde puanlayın ve bir ısı haritası çıktısı üretin</li>
<li>Yönetişim RACI'sini tanımlayın: AI risk sahibi, model sahibi, veri sahibi, MRM, iç denetim</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. NIST AI RMF Çekirdeği — Dört Fonksiyon</h2>
<p class="l-text">Çekirdek, kasıtlı olarak küçük bir fonksiyon kümesidir, her biri kategorilere ve alt kategorilere ayrılmıştır. Niyet, yaşam döngüsünü kapsayan ve organizasyonların tek bir teslimat üretmeden iki yıl donmak yerine artımlı olarak benimseyebileceği kadar hafif olmaktır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yönet (Govern)</div><div class="card-body">Diğer üç fonksiyonun gerçekten gerçekleşmesini sağlayan kültürü, politikaları ve hesap verebilirliği yetiştirin. Roller, eskalasyon yolları, yönetim kurulu katılımı, üçüncü taraf politikası.</div></div>
<div class="calc-card"><div class="card-title">Haritala (Map)</div><div class="card-body">Bağlam oluşturun. Sistem nedir, kim etkilenir, kullanım durumu nedir, kapsamda/kapsam dışı ne var, paydaşlar kim? "Map" inşa edip etmemeye karar verdiğiniz yerdir.</div></div>
<div class="calc-card"><div class="card-title">Ölç (Measure)</div><div class="card-body">Niceliksel ve niteliksel analiz. Yedi güvenilirlik özelliği için test edin. Bias denetimleri, sağlamlık testleri, gerçeğe karşı değerlendirmeler, red-teaming.</div></div>
<div class="calc-card"><div class="card-title">Yönet (Manage)</div><div class="card-body">Belirlenen risklere etkiye göre kaynak tahsis edin. Kabul / azalt / aktar / kaçın kararları. Kalan riski belgeleyin ve resmi olarak kabul edin.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">RMF ABD'de gönüllüdür ama federal satın alma ve özel firmalar tarafından durum tespiti kanıtı olarak giderek daha çok kullanılır. AB'de AI Yasası'nın Madde 9 risk yönetimi gereksinimini tamamlar ve GPAI Davranış Kuralları tarafından referans alınır.</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Yedi Güvenilir-AI Özelliği</h2>
<p class="l-text">NIST güvenilir AI'yı yedi özellikle tanımlar. Bunlar bağımsız değildir — birine baskı uygulamak (ör. post-hoc yeniden ağırlıklandırma yoluyla adillik) genellikle bir başkasını (baskın alt grupta doğruluk) kaydırır. Çerçevenin amacı bu ödünleşimleri saklı yerine açık yapmaktır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Geçerli ve güvenilir</div><div class="card-body">Çıktılar beklenen koşullar altında doğrudur ve onun dışında zarif şekilde bozulur. OOD dahil çeşitli verilerde test edilir.</div></div>
<div class="calc-card"><div class="card-title">Güvenli</div><div class="card-body">İnsan yaşamını, sağlığını, mülkiyeti veya çevreyi tehlikeye atmaz. Özellikle siber-fiziksel AI için ilgili.</div></div>
<div class="calc-card"><div class="card-title">Güvenli ve dayanıklı</div><div class="card-body">Düşmanca girdilere, model hırsızlığına, tedarik zinciri uzlaşmasına karşı korunur. Saldırılar ve hatalardan kurtulur.</div></div>
<div class="calc-card"><div class="card-title">Hesap verebilir ve şeffaf</div><div class="card-body">Kararlar denetlenebilir; bir organizasyon sorumlu tutulabilir. Sürümleme, loglama, model kartları.</div></div>
<div class="calc-card"><div class="card-title">Açıklanabilir ve yorumlanabilir</div><div class="card-body">Paydaşlar uygun granülerlikte çıktıları anlayabilir. SHAP, LIME, dikkat rollouts'ları, vekil modeller.</div></div>
<div class="calc-card"><div class="card-title">Mahremiyet-iyileştirilmiş</div><div class="card-body">Diferansiyel mahremiyet, federe öğrenme, k-anonimlik, veri minimizasyonu. GDPR Md. 25 ile hizalanır.</div></div>
<div class="calc-card"><div class="card-title">Adil — zararlı bias yönetilmiş</div><div class="card-body">İstatistiksel, hesaplamalı ve insan bilişsel bias'ları tanımlanmış, belgelenmiş ve ele alınmış.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. ENISA'nın AI Tehdit Taksonomisi</h2>
<p class="l-text">ENISA, AI tehditlerini yığında nereye çarptıklarına ve saldırganın ne istediğine göre kategorize eder. Bu taksonomi, NIS2 Md. 21 tedarik zinciri gereksinimleriyle (ders L3) ve NIST RMF'nin Ölç fonksiyonuyla doğal olarak takılır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Veri bütünlüğü saldırıları</div><div class="card-body">Eğitim sırasında zehirleme (BadNets, etiket çevirme), çıkarımda kaçınma (düşmanca örnekler, prompt enjeksiyonu).</div></div>
<div class="calc-card"><div class="card-title">Model çıkarma / ters çevirme</div><div class="card-body">API sorguları yoluyla ağırlıkları çal (Tramèr 2016) veya üyelik çıkarımı yoluyla eğitim verisini yeniden inşa et (Shokri 2017).</div></div>
<div class="calc-card"><div class="card-title">Çıktı kötüye kullanımı</div><div class="card-body">Modeli dezenformasyon, deepfake, kötü amaçlı yazılım, sosyal mühendislik içeriği üretmek için kullan. CSAM üretimi.</div></div>
<div class="calc-card"><div class="card-title">Tedarik zinciri</div><div class="card-body">Önceden eğitilmiş ağırlıkların, veri kümelerinin, bağımlılıkların, ince ayar hatlarının uzlaşması. Hugging Face model truva atları.</div></div>
<div class="calc-card"><div class="card-title">Altyapı</div><div class="card-body">Donanım yan kanalları, GPU bellek saldırıları, plugin/tool yürütme yoluyla sızdırma, container kaçışı.</div></div>
<div class="calc-card"><div class="card-title">Sosyo-teknik</div><div class="card-body">Aşırı güven, otomasyon bias'ı, karar aklama, zararlı geri besleme döngüleri.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">LLM'e özgü tehditler için ayrıca LLM Uygulamaları için OWASP İlk 10 (2023, 2024'te güncellendi) ve MITRE ATLAS — düşmanca ML bilgi tabanı.</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Tehlike Analizi vs Risk Değerlendirmesi</h2>
<p class="l-text">Küçük ama önemli bir kelime dağarcığı ayrımı. <strong>Tehlike analizi</strong>, olasılıktan bağımsız olarak neyin yanlış gidebileceğini (başarısızlık modları, saldırı vektörleri) tanımlar. <strong>Risk değerlendirmesi</strong>, bu tehlikelere olasılık ve etki iliştirir ve onları sıralar. Tehlike analizi beyin fırtınası güdümlüdür (HAZOP, FMEA, STPA-Sec); risk değerlendirmesi niceliksel veya yarı-niceliksel.</p>

<div class="katex-block">$$\\text{Risk} = \\text{Likelihood} \\times \\text{Impact}$$</div>

<div class="katex-block">$$\\text{Residual risk} = \\text{Inherent risk} \\times (1 - \\text{Control effectiveness})$$</div>

<div class="katex-block">$$\\text{ALARP} : \\text{reduce residual risk As Low As Reasonably Practicable}$$</div>

<p class="l-text">İngiltere güvenlik yasasından ödünç alınan ALARP, kalan-risk kabul edilebilirlik testidir: bir sonraki azaltmanın maliyeti faydaya kıyasla aşırı orantısız olana kadar azaltmaya devam edin. AI için yararlıdır çünkü bir miktar kalan bias veya sağlamlık boşluğu her zaman kalır.</p>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Kodda Ağırlıklı Bir RMF Anketi</h2>
<p class="l-text">Pratik bir araç: RMF alt kategorilerini ağırlıklı bir ankete dönüştürün, her birini 0-3 arasında puanlayın (yapılmadı / kısmi / çoğunlukla yapıldı / tam yapıldı), fonksiyon başına olgunluk puanına toplayın.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

questionnaire = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"Govern"</span>,  <span class="str">"Roles &amp; responsibilities documented"</span>,          <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Govern"</span>,  <span class="str">"Board engagement &amp; reporting cadence"</span>,          <span class="num">2</span>, <span class="num">1</span>),
  (<span class="str">"Govern"</span>,  <span class="str">"Third-party policy"</span>,                            <span class="num">3</span>, <span class="num">3</span>),
  (<span class="str">"Map"</span>,     <span class="str">"System purpose &amp; stakeholders identified"</span>,      <span class="num">3</span>, <span class="num">3</span>),
  (<span class="str">"Map"</span>,     <span class="str">"Out-of-scope uses documented"</span>,                  <span class="num">2</span>, <span class="num">2</span>),
  (<span class="str">"Map"</span>,     <span class="str">"Impact assessment on affected populations"</span>,     <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Measure"</span>, <span class="str">"Validity / accuracy metrics &amp; thresholds"</span>,      <span class="num">3</span>, <span class="num">3</span>),
  (<span class="str">"Measure"</span>, <span class="str">"Robustness &amp; adversarial testing"</span>,              <span class="num">3</span>, <span class="num">1</span>),
  (<span class="str">"Measure"</span>, <span class="str">"Bias / fairness audit"</span>,                         <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Measure"</span>, <span class="str">"Privacy testing (DP / membership inference)"</span>,   <span class="num">2</span>, <span class="num">1</span>),
  (<span class="str">"Manage"</span>,  <span class="str">"Risk register &amp; treatment plans"</span>,               <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Manage"</span>,  <span class="str">"Incident response runbooks"</span>,                    <span class="num">3</span>, <span class="num">2</span>),
  (<span class="str">"Manage"</span>,  <span class="str">"Continuous monitoring in production"</span>,           <span class="num">3</span>, <span class="num">2</span>),
], columns=[<span class="str">"function"</span>,<span class="str">"subcategory"</span>,<span class="str">"weight"</span>,<span class="str">"score_0_3"</span>])

questionnaire[<span class="str">"weighted"</span>] = questionnaire.weight * questionnaire.score_0_3
totals = questionnaire.<span class="fn">groupby</span>(<span class="str">"function"</span>).<span class="fn">apply</span>(
    <span class="kw">lambda</span> g: pd.<span class="fn">Series</span>({
        <span class="str">"achieved"</span>: g.weighted.<span class="fn">sum</span>(),
        <span class="str">"max"</span>:      g.weight.<span class="fn">sum</span>() * <span class="num">3</span>,
        <span class="str">"pct"</span>:      <span class="fn">round</span>(<span class="num">100</span> * g.weighted.<span class="fn">sum</span>() / (g.weight.<span class="fn">sum</span>() * <span class="num">3</span>), <span class="num">1</span>)
    }))
<span class="fn">print</span>(questionnaire.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nFunction maturity:"</span>)
<span class="fn">print</span>(totals.<span class="fn">to_string</span>())
overall = <span class="num">100</span> * questionnaire.weighted.<span class="fn">sum</span>() / (questionnaire.weight.<span class="fn">sum</span>() * <span class="num">3</span>)
<span class="fn">print</span>(f<span class="str">"\\nOverall RMF maturity: {overall:.1f}%"</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) ISO 27001 (bilgi güvenliği) ve ISO 42001 (AI yönetim sistemi) kontrollerini karşılık gelen ML boru hattı aşamalarına eşler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas önceden yüklü. Tablodaki ağırlıklar AI Yasası + ISO 42001 altındaki önemi yansıtır; sektörünüze göre ayarlayın.</p>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Yönetişim Rolleri — Bir AI Risk Programı için RACI</h2>
<p class="l-text">Uyumluluk tiyatrosu, riski hiç kimsenin sahiplenmediği zaman olur. Bir AI programı için işleyebilir bir RACI, üç savunma hattını yansıtan en az beş role sahiptir (1LoD = iş, 2LoD = risk ve uyumluluk, 3LoD = iç denetim).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Model sahibi (1LoD)</div><div class="card-body">Performans, izleme, yeniden eğitimden sorumlu. Genellikle kıdemli bir veri-bilim / ML mühendisi.</div></div>
<div class="calc-card"><div class="card-title">Veri sahibi (1LoD)</div><div class="card-body">Eğitim/çıkarım verisinden sorumlu: soykütüğü, kalite, yasal dayanak, tutma.</div></div>
<div class="calc-card"><div class="card-title">AI risk sahibi (1LoD)</div><div class="card-body">Kalan risk kabulünden sorumlu iş sponsoru. Genellikle bir ürün veya operasyon lideri.</div></div>
<div class="calc-card"><div class="card-title">Model risk yönetimi (2LoD)</div><div class="card-body">Metodolojinin, verinin, performansın bağımsız sorgulanması. SR 11-7 tarzı doğrulama.</div></div>
<div class="calc-card"><div class="card-title">İç denetim (3LoD)</div><div class="card-body">Programın tasarlandığı gibi çalıştığına dair periyodik bağımsız güvence (Raji 2020 deseni, ders L5).</div></div>
</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Risk Kaydı ve Isı Haritası</h2>
<p class="l-text">Bir risk kaydı neyin yanlış gidebileceğinin, ne kadar olası olduğunun, ne kadar kötü olduğunun, hangi kontrollerin azalttığının, kimin sahiplendiğinin ve kalan tahmininin ne kadar güvenli olduğunun tek doğruluk kaynağıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

risks = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"R-01"</span>,<span class="str">"Bias against protected group"</span>,      <span class="num">4</span>, <span class="num">4</span>, <span class="str">"fairness audit + retraining"</span>, <span class="num">0.6</span>),
  (<span class="str">"R-02"</span>,<span class="str">"Prompt injection &amp; tool misuse"</span>,    <span class="num">5</span>, <span class="num">4</span>, <span class="str">"input validation + tool allowlist + sandbox"</span>, <span class="num">0.7</span>),
  (<span class="str">"R-03"</span>,<span class="str">"Training data leak via extraction"</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="str">"rate limit + canary tokens + DP fine-tune"</span>, <span class="num">0.5</span>),
  (<span class="str">"R-04"</span>,<span class="str">"Vendor outage (single foundation)"</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="str">"multi-vendor router + degraded mode"</span>, <span class="num">0.7</span>),
  (<span class="str">"R-05"</span>,<span class="str">"Hallucinated medical advice"</span>,       <span class="num">3</span>, <span class="num">5</span>, <span class="str">"RAG with citations + abstain threshold + MD review"</span>, <span class="num">0.65</span>),
  (<span class="str">"R-06"</span>,<span class="str">"GDPR Art.22 challenge"</span>,             <span class="num">2</span>, <span class="num">5</span>, <span class="str">"human-in-the-loop + explanation API"</span>, <span class="num">0.8</span>),
  (<span class="str">"R-07"</span>,<span class="str">"Model drift unnoticed"</span>,             <span class="num">4</span>, <span class="num">3</span>, <span class="str">"monitoring + alert thresholds + auto-retrain"</span>, <span class="num">0.7</span>),
], columns=[<span class="str">"id"</span>,<span class="str">"scenario"</span>,<span class="str">"likelihood"</span>,<span class="str">"impact"</span>,<span class="str">"controls"</span>,<span class="str">"control_eff"</span>])

risks[<span class="str">"inherent"</span>] = risks.likelihood * risks.impact
risks[<span class="str">"residual"</span>] = (risks.inherent * (<span class="num">1</span> - risks.control_eff)).<span class="fn">round</span>(<span class="num">2</span>)
risks[<span class="str">"tier"</span>] = pd.<span class="fn">cut</span>(risks.residual, bins=[-<span class="num">1</span>,<span class="num">3</span>,<span class="num">7</span>,<span class="num">12</span>,<span class="num">25</span>],
                      labels=[<span class="str">"LOW"</span>,<span class="str">"MEDIUM"</span>,<span class="str">"HIGH"</span>,<span class="str">"CRITICAL"</span>])

<span class="fn">print</span>(risks[[<span class="str">"id"</span>,<span class="str">"scenario"</span>,<span class="str">"inherent"</span>,<span class="str">"residual"</span>,<span class="str">"tier"</span>]].<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nALARP candidates (residual &gt; 5):"</span>)
<span class="fn">print</span>(risks[risks.residual &gt; <span class="num">5</span>][[<span class="str">"id"</span>,<span class="str">"scenario"</span>,<span class="str">"residual"</span>,<span class="str">"controls"</span>]].<span class="fn">to_string</span>(index=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) ISO 27001 (bilgi güvenliği) ve ISO 42001 (AI yönetim sistemi) kontrollerini karşılık gelen ML boru hattı aşamalarına eşler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas önceden yüklü. Gerçek risk kayıtları olasılık-gerekçesi, son-test-tarihi, sahip, kanıt bağlantısı ekler.</p>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. RMF'yi AI Yasası ve ISO 42001 ile Hizalama</h2>
<p class="l-text">RMF Çekirdeği AI Yasası Madde 9 yükümlülüklerine temiz şekilde haritalar. NIST bir crosswalk yayımladı; özetin özetleri burada.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Govern ↔ AI Yasası Md. 17 (QMS)</div><div class="card-body">Kalite yönetim sistemi, hesap verebilirlik, yönetişim dokümantasyonu.</div></div>
<div class="calc-card"><div class="card-title">Map ↔ Md. 9.2(a) + Ek IV</div><div class="card-body">Bilinen ve makul öngörülebilir risklerin tanımlanması ve analizi. Teknik dokümantasyon.</div></div>
<div class="calc-card"><div class="card-title">Measure ↔ Md. 9.2(b-c) + Md. 15</div><div class="card-body">Risklerin tahmini ve değerlendirilmesi; doğruluk/sağlamlık/siber güvenlik testi.</div></div>
<div class="calc-card"><div class="card-title">Manage ↔ Md. 9.2(d) + Md. 72</div><div class="card-body">Risk yönetim önlemlerinin benimsenmesi; piyasa sonrası izleme.</div></div>
</div>

<p class="l-text">ISO/IEC 23894:2023 — özel AI risk yönetim standardı — aynı mimariyi ISO formatında sağlar ve ISO/IEC 42001 (ders L6) ile doğal olarak eşleşir.</p>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. GenAI Profili (NIST AI 600-1)</h2>
<p class="l-text">Temmuz 2024'te NIST, üretken AI'ye özgü veya onun tarafından genişletilen 12 riski listeleyen GenAI Profili'ni yayımladı: konfabulasyon, tehlikeli bilgi ifşası, veri mahremiyeti, çevresel etki, zararlı bias, insan-AI yapılandırması, bilgi bütünlüğü, bilgi güvenliği, IP, müstehcen/aşağılayıcı içerik, değer zinciri ve bileşen entegrasyonu, ve KBRN ile ilgili riskler. Her risk Govern/Map/Measure/Manage genelinde önerilen aksiyonlara haritalanır. Üretimde bir LLM çalıştırıyorsanız, GenAI Profili pratik oyun kitabıdır.</p>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">"Konfabulasyon" NIST'in halüsinasyon dediği şey için tercih ettiği terimdir. Terminoloji önemlidir: konfabulasyon mekanizmayı (önceliklerden makul ama doğrulanmamış içerik üretmek) antropomorfize etmeden tanımlar.</div>
</div>

<div class="lesson-block" id="section-10-tr">
<h2 class="lesson-title">10. Riskten Denetime</h2>
<p class="l-text">Bir risk kaydınız, yönetişiminiz ve kontrolleriniz olduğunda, üçüncü bir tarafa <em>çalışmanızı göstermeniz</em> gerekir. Bu, denetim çerçevelerinin işidir — model kartları, datasheet'ler, FactSheets ve Raji et al. (2020) iç-denetim oyun kitabı. Sonraki ders her birini yürür ve bir düzenleyicinin incelemesinden sağ çıkacak bir kanıt paketinin nasıl monte edileceğini gösterir.</p>
</div>`
};
