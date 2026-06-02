window.COMPLIANCE_L6 = {
en: `<p class="l-text"><strong>Standards turn good intentions into auditable, certifiable practice.</strong> The first five lessons of this track gave you the why and the what — GDPR for data, the EU AI Act for product, NIS2/DORA for cybersecurity, NIST RMF for risk, model cards and the Raji framework for audit. This capstone gives you the <em>how</em> at organisational scale: <strong>ISO/IEC 27001:2022</strong> for the underlying information-security management system, <strong>ISO/IEC 42001:2023</strong> — the world's first AI management-system standard, published 18 December 2023 — and <strong>ISO/IEC 23894:2023</strong> for AI risk management. Together these define the <em>certifiable</em> shell that surrounds every other artefact and let an organisation say "we meet a standard a third party can verify" rather than "trust us".</p>

<p class="l-text">ISO/IEC 42001 matters because it is the bridge between voluntary frameworks (NIST RMF) and EU regulation. The European Commission has signalled that conformity with harmonised standards based on ISO 42001 will give a presumption of conformity with the AI Act's high-risk obligations (Articles 8-15) once CEN-CENELEC JTC 21 finishes the harmonised European versions. That is why the first AI-management certifications shipped within months of the standard's publication — Microsoft, KPMG, Anthropic, and others publicly announced ISO 42001 certification through 2024-2025. This capstone walks the structure of both standards, the AI Act crosswalk, the typical certification timeline, and a worked example of an integrated management system that satisfies all three regimes simultaneously.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Walk the ISO 27001:2022 ISMS clauses 4-10 and Annex A 93 controls</li>
<li>Walk the ISO/IEC 42001:2023 AIMS clauses 4-10 and Annex A 38 AI-specific controls</li>
<li>Read ISO/IEC 23894:2023 as the AI-flavoured ISO 31000 risk-management lens</li>
<li>Map ISO 42001 controls onto AI Act Articles 8-15 high-risk obligations</li>
<li>Plan a certification path: gap analysis → Stage 1 → Stage 2 → surveillance → recertification</li>
<li>Build a unified compliance dashboard covering ISO 27001 + ISO 42001 + AI Act + NIST RMF</li>
<li>Recognise the integration with ISO 27017 (cloud), ISO 27018 (PII), ISO 27701 (privacy)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ISO/IEC 27001:2022 — The ISMS Foundation</h2>
<p class="l-text">ISO/IEC 27001 is a management-system standard, which means it does not prescribe specific technologies — it requires that you operate a documented, continually-improving Information Security Management System (ISMS). The 2022 revision aligned the structure with the High-Level Structure shared by ISO 9001, ISO 14001, ISO 22301, ISO 42001, etc., so multiple management systems integrate cleanly.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Clause 4 — Context</div><div class="card-body">Internal/external issues, interested parties, scope of the ISMS.</div></div>
<div class="calc-card"><div class="card-title">Clause 5 — Leadership</div><div class="card-body">Top-management commitment, infosec policy, roles and responsibilities.</div></div>
<div class="calc-card"><div class="card-title">Clause 6 — Planning</div><div class="card-body">Risk assessment, risk treatment, Statement of Applicability, objectives.</div></div>
<div class="calc-card"><div class="card-title">Clause 7 — Support</div><div class="card-body">Resources, competence, awareness, communication, documented information.</div></div>
<div class="calc-card"><div class="card-title">Clause 8 — Operation</div><div class="card-body">Operational planning, risk assessment in practice, risk treatment in practice.</div></div>
<div class="calc-card"><div class="card-title">Clause 9 — Performance evaluation</div><div class="card-body">Monitoring, internal audit, management review.</div></div>
<div class="calc-card"><div class="card-title">Clause 10 — Improvement</div><div class="card-body">Nonconformity and corrective action, continual improvement.</div></div>
</div>

<p class="l-text">Annex A of the 2022 version contains <strong>93 controls</strong> (down from 114 in 2013) reorganised into four themes: Organisational, People, Physical, Technological. Each control in the SoA is marked applicable / not applicable with a justification. The auditor sampling targets the SoA.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ISO/IEC 42001:2023 — The AI Management System</h2>
<p class="l-text">Published 18 December 2023, ISO/IEC 42001 is the first standard specifically for managing AI systems at organisational scale. It uses the same High-Level Structure as ISO 27001 — clauses 4-10 — so an organisation already running an ISMS can extend it to an AIMS without reinventing governance.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Clause 4 — Context (AI-flavoured)</div><div class="card-body">AI-specific stakeholders, intended-use boundaries, role in the AI value chain (provider, developer, deployer).</div></div>
<div class="calc-card"><div class="card-title">Clause 5 — Leadership &amp; AI policy</div><div class="card-body">Documented AI policy stating purpose, principles, governance, escalation.</div></div>
<div class="calc-card"><div class="card-title">Clause 6 — AI risk &amp; impact</div><div class="card-body">AI risk assessment (per ISO 23894) + AI system impact assessment on individuals, groups, society.</div></div>
<div class="calc-card"><div class="card-title">Clause 7 — Resources, competence, communication</div><div class="card-body">Including specifically AI competence and awareness — model literacy.</div></div>
<div class="calc-card"><div class="card-title">Clause 8 — Operation (the lifecycle)</div><div class="card-body">Concept, design, development, V&amp;V, deployment, monitoring, decommissioning.</div></div>
<div class="calc-card"><div class="card-title">Clause 9 — Evaluation</div><div class="card-body">Monitoring, measurement, internal audit, management review of the AI systems.</div></div>
<div class="calc-card"><div class="card-title">Clause 10 — Improvement</div><div class="card-body">Nonconformity in AI behaviour, root-cause analysis, retraining, deprecation.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">Annex A of ISO 42001 contains <strong>38 AI-specific controls</strong> across nine areas: AI policies, internal organisation, resources, impact assessment, lifecycle, data, info for interested parties, use, third-party. Annex B gives implementation guidance.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ISO/IEC 23894:2023 — AI Risk Management</h2>
<p class="l-text">ISO/IEC 23894 is the dedicated AI-flavoured implementation of ISO 31000. Where ISO 31000 gives generic risk-management principles (proportionate, structured, integrated, dynamic), 23894 gives examples of how those principles play out for AI: data risks, model risks, value-chain risks, sociotechnical risks. It is the natural Clause 6 input for both ISO 27001 and ISO 42001.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Principles (from 31000)</div><div class="card-body">Integrated, structured, customised, inclusive, dynamic, best-available info, human/cultural factors, continual improvement.</div></div>
<div class="calc-card"><div class="card-title">Process</div><div class="card-body">Communication, scope/context/criteria, risk assessment, risk treatment, monitoring, recording &amp; reporting.</div></div>
<div class="calc-card"><div class="card-title">AI-specific risk sources</div><div class="card-body">Data quality, transparency, fairness, accountability, robustness, privacy — and value-chain dependencies.</div></div>
</div>

<div class="katex-block">$$\\text{Risk}_{\\text{AI}} = f(\\text{Likelihood},\\ \\text{Impact},\\ \\text{Context}_{\\text{sociotechnical}})$$</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The 38 ISO 42001 Annex A Controls</h2>
<p class="l-text">Memorising all 38 is unnecessary; recognising the nine clusters is essential. Each cluster has typical evidence that an auditor will sample.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A.2 Policies for AI</div><div class="card-body">AI policy, alignment with organisational policies, periodic review.</div></div>
<div class="calc-card"><div class="card-title">A.3 Internal organisation</div><div class="card-body">AI roles &amp; responsibilities, reporting of AI concerns.</div></div>
<div class="calc-card"><div class="card-title">A.4 Resources for AI</div><div class="card-body">Human resources, computing resources, tooling, data resources.</div></div>
<div class="calc-card"><div class="card-title">A.5 Impact assessment</div><div class="card-body">Process to assess AI system impacts on individuals, groups, society. Documented.</div></div>
<div class="calc-card"><div class="card-title">A.6 AI system lifecycle</div><div class="card-body">Objectives, requirements, design, V&amp;V, deployment, operation, monitoring, retirement.</div></div>
<div class="calc-card"><div class="card-title">A.7 Data for AI</div><div class="card-body">Data quality, data governance, data preparation.</div></div>
<div class="calc-card"><div class="card-title">A.8 Information for interested parties</div><div class="card-body">Documentation for users, deployers, affected parties; intended use; logging.</div></div>
<div class="calc-card"><div class="card-title">A.9 Use of AI systems</div><div class="card-body">Processes for responsible use, intended-use enforcement.</div></div>
<div class="calc-card"><div class="card-title">A.10 Third-party &amp; customer</div><div class="card-body">Allocation of responsibilities along the value chain; supplier processes; customer support.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. ISO 42001 ↔ EU AI Act Crosswalk</h2>
<p class="l-text">The single most-asked compliance question in 2025 was: "if I get ISO 42001 certified, am I AI Act compliant?" The honest answer: 42001 covers most of the management-system layer and most of the high-risk obligations, but not the substantive bans of Article 5 nor the GPAI-specific obligations of Articles 51-55. Crosswalk in code:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>iso42001_to_ai_act = {
    <span class="str">"A.2 (AI policy)"</span>:                    [<span class="str">"Art.17 (QMS)"</span>],
    <span class="str">"A.3 (Internal organisation)"</span>:        [<span class="str">"Art.17 (QMS)"</span>, <span class="str">"Art.26 (deployer obligations)"</span>],
    <span class="str">"A.4 (Resources)"</span>:                    [<span class="str">"Art.17 (QMS)"</span>],
    <span class="str">"A.5 (Impact assessment)"</span>:            [<span class="str">"Art.27 (FRIA)"</span>, <span class="str">"Art.9 (risk mgmt)"</span>],
    <span class="str">"A.6 (Lifecycle)"</span>:                    [<span class="str">"Art.9"</span>, <span class="str">"Art.11 (tech doc)"</span>, <span class="str">"Art.17"</span>],
    <span class="str">"A.7 (Data)"</span>:                         [<span class="str">"Art.10 (data &amp; data governance)"</span>],
    <span class="str">"A.8 (Information for parties)"</span>:      [<span class="str">"Art.13 (transparency)"</span>, <span class="str">"Art.14 (human oversight)"</span>],
    <span class="str">"A.9 (Use)"</span>:                          [<span class="str">"Art.26 (deployer)"</span>, <span class="str">"Art.50 (transparency obligations)"</span>],
    <span class="str">"A.10 (Third-party)"</span>:                 [<span class="str">"Art.25 (importer/distributor)"</span>, <span class="str">"Art.28 (auth. rep.)"</span>],
    <span class="cm"># Clauses</span>
    <span class="str">"Clause 6 (risk &amp; impact)"</span>:           [<span class="str">"Art.9"</span>],
    <span class="str">"Clause 8 (operation)"</span>:               [<span class="str">"Art.9"</span>, <span class="str">"Art.15 (acc/rob/sec)"</span>],
    <span class="str">"Clause 9 (evaluation)"</span>:              [<span class="str">"Art.72 (post-market monitoring)"</span>],
    <span class="str">"Clause 10 (improvement)"</span>:            [<span class="str">"Art.73 (incidents)"</span>, <span class="str">"Art.20 (corrective action)"</span>],
}

<span class="cm"># What's NOT covered by ISO 42001 alone?</span>
not_covered = [
    <span class="str">"Art.5 (prohibited practices) — substantive ban, not a management process"</span>,
    <span class="str">"Art.51-55 (GPAI / systemic-risk GPAI) — specific to foundation-model providers"</span>,
    <span class="str">"Art.99 (penalties) — regulatory, not certifiable"</span>,
    <span class="str">"Art.71 (EU database registration) — administrative"</span>,
]

<span class="fn">print</span>(<span class="str">"ISO 42001 to EU AI Act mapping:"</span>)
<span class="kw">for</span> control, articles <span class="kw">in</span> iso42001_to_ai_act.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">"  {control:40s} -&gt; {', '.join(articles)}"</span>)
<span class="fn">print</span>(<span class="str">"\\nGaps requiring separate compliance:"</span>)
<span class="kw">for</span> g <span class="kw">in</span> not_covered:
    <span class="fn">print</span>(<span class="str">" -"</span>, g)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) emits a model card, a datasheet, and a ROPA entry (Article 30) — the documentation triumvirate auditors actually ask for.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Plain Python — no packages needed. The crosswalk is informative; harmonised standards from CEN-CENELEC JTC 21 will eventually formalise it.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Compliance Score — Weighted Aggregation</h2>
<p class="l-text">A unified compliance dashboard combines control status from each framework into a single score. The formula is simple but the discipline is not:</p>

<div class="katex-block">$$\\text{Compliance score} \\;=\\; \\frac{\\sum_i w_i \\cdot s_i}{\\sum_i w_i}$$</div>

<p class="l-text">where <em>w_i</em> is the weight of control i (severity if missing) and <em>s_i</em> is its status (0 = not implemented, 0.5 = partial, 1 = fully implemented and evidenced). The threshold for "ready for stage-2 audit" is typically &gt; 0.85 with no critical-weighted gaps at status 0.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Integrated Compliance Dashboard</h2>
<p class="l-text">A real organisation runs ISO 27001 + ISO 42001 + AI Act + NIST RMF + GDPR simultaneously. The artefacts overlap by 60-80%. Build the dashboard as a DataFrame keyed on control, with one row per regulatory citation it satisfies — that way you fix once, claim everywhere.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

controls = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"C-001"</span>,<span class="str">"AI policy approved by top management"</span>,         <span class="num">3</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001:5.2"</span>,<span class="str">"ISO42001:5.2"</span>,<span class="str">"AIAct:Art.17"</span>]),
  (<span class="str">"C-002"</span>,<span class="str">"Risk assessment per ISO 23894"</span>,                <span class="num">3</span>, <span class="num">0.8</span>, [<span class="str">"ISO27001:6.1"</span>,<span class="str">"ISO42001:6.1"</span>,<span class="str">"AIAct:Art.9"</span>,<span class="str">"RMF:Map"</span>]),
  (<span class="str">"C-003"</span>,<span class="str">"AI system impact assessment (FRIA)"</span>,           <span class="num">3</span>, <span class="num">0.5</span>, [<span class="str">"ISO42001:A.5"</span>,<span class="str">"AIAct:Art.27"</span>,<span class="str">"GDPR:Art.35"</span>]),
  (<span class="str">"C-004"</span>,<span class="str">"Data governance &amp; quality"</span>,                    <span class="num">3</span>, <span class="num">1.0</span>, [<span class="str">"ISO42001:A.7"</span>,<span class="str">"AIAct:Art.10"</span>,<span class="str">"GDPR:Art.5"</span>]),
  (<span class="str">"C-005"</span>,<span class="str">"Technical documentation (Annex IV)"</span>,           <span class="num">3</span>, <span class="num">0.8</span>, [<span class="str">"ISO42001:8.4"</span>,<span class="str">"AIAct:Art.11"</span>]),
  (<span class="str">"C-006"</span>,<span class="str">"Logging &amp; record-keeping"</span>,                     <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001:A.8.15"</span>,<span class="str">"AIAct:Art.12"</span>,<span class="str">"NIS2:Art.21"</span>]),
  (<span class="str">"C-007"</span>,<span class="str">"Transparency documentation"</span>,                   <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO42001:A.8"</span>,<span class="str">"AIAct:Art.13"</span>]),
  (<span class="str">"C-008"</span>,<span class="str">"Human oversight design"</span>,                       <span class="num">3</span>, <span class="num">0.5</span>, [<span class="str">"ISO42001:A.9"</span>,<span class="str">"AIAct:Art.14"</span>,<span class="str">"GDPR:Art.22"</span>]),
  (<span class="str">"C-009"</span>,<span class="str">"Accuracy / robustness / security testing"</span>,     <span class="num">3</span>, <span class="num">0.8</span>, [<span class="str">"ISO27001:A.8"</span>,<span class="str">"ISO42001:A.6"</span>,<span class="str">"AIAct:Art.15"</span>]),
  (<span class="str">"C-010"</span>,<span class="str">"QMS documented"</span>,                               <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001 whole"</span>,<span class="str">"ISO42001 whole"</span>,<span class="str">"AIAct:Art.17"</span>]),
  (<span class="str">"C-011"</span>,<span class="str">"Post-market monitoring"</span>,                       <span class="num">3</span>, <span class="num">0.5</span>, [<span class="str">"ISO42001:9.1"</span>,<span class="str">"AIAct:Art.72"</span>]),
  (<span class="str">"C-012"</span>,<span class="str">"Incident reporting runbook"</span>,                   <span class="num">3</span>, <span class="num">0.8</span>, [<span class="str">"ISO27001:A.5.24"</span>,<span class="str">"AIAct:Art.73"</span>,<span class="str">"NIS2:Art.23"</span>,<span class="str">"GDPR:Art.33"</span>]),
  (<span class="str">"C-013"</span>,<span class="str">"Third-party / supplier policy"</span>,                <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001:A.5.19"</span>,<span class="str">"ISO42001:A.10"</span>,<span class="str">"NIS2:Art.21(d)"</span>,<span class="str">"DORA:Art.28"</span>]),
  (<span class="str">"C-014"</span>,<span class="str">"Internal audit programme"</span>,                     <span class="num">2</span>, <span class="num">0.5</span>, [<span class="str">"ISO27001:9.2"</span>,<span class="str">"ISO42001:9.2"</span>]),
  (<span class="str">"C-015"</span>,<span class="str">"Management review"</span>,                            <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001:9.3"</span>,<span class="str">"ISO42001:9.3"</span>]),
], columns=[<span class="str">"id"</span>,<span class="str">"control"</span>,<span class="str">"weight"</span>,<span class="str">"status"</span>,<span class="str">"mappings"</span>])

score = (controls.weight * controls.status).<span class="fn">sum</span>() / controls.weight.<span class="fn">sum</span>()
critical_gaps = controls[(controls.weight == <span class="num">3</span>) &amp; (controls.status &lt; <span class="num">1.0</span>)]
<span class="fn">print</span>(f<span class="str">"Overall compliance score: {score:.2%}"</span>)
<span class="fn">print</span>(f<span class="str">"\\nCritical gaps (weight=3, status&lt;1):"</span>)
<span class="fn">print</span>(critical_gaps[[<span class="str">"id"</span>,<span class="str">"control"</span>,<span class="str">"status"</span>]].<span class="fn">to_string</span>(index=<span class="kw">False</span>))

<span class="cm"># Cross-framework coverage</span>
<span class="kw">from</span> collections <span class="kw">import</span> Counter
fw_counts = <span class="fn">Counter</span>()
<span class="kw">for</span> ms <span class="kw">in</span> controls.mappings:
    <span class="kw">for</span> m <span class="kw">in</span> ms:
        framework = m.<span class="fn">split</span>(<span class="str">":"</span>)[<span class="num">0</span>]
        fw_counts[framework] += <span class="num">1</span>
<span class="fn">print</span>(<span class="str">"\\nControls touching each framework:"</span>)
<span class="kw">for</span> f, n <span class="kw">in</span> <span class="fn">sorted</span>(fw_counts.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>]):
    <span class="fn">print</span>(f<span class="str">"  {f:12s}: {n}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) emits a model card, a datasheet, and a ROPA entry (Article 30) — the documentation triumvirate auditors actually ask for.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas pre-loaded. This is a stripped-down version of what an integrated GRC platform (Vanta, Drata, Secureframe) shows — the underlying data model is the same.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Certification Path — How You Actually Get There</h2>
<p class="l-text">Certification is a process, not an event. A typical first-time ISO 42001 certification (assuming an existing ISO 27001) takes 6-12 months end-to-end.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Gap analysis (1-2 months)</div><div class="card-body">Compare current state against clauses 4-10 + Annex A controls. Output: gap register with owners and dates.</div></div>
<div class="calc-card"><div class="card-title">2. Remediation (3-6 months)</div><div class="card-body">Close the gaps. Most are documentation and process — code already exists, governance does not.</div></div>
<div class="calc-card"><div class="card-title">3. Internal audit + management review</div><div class="card-body">Required before stage 1 — Clause 9. Tests that the system works as designed.</div></div>
<div class="calc-card"><div class="card-title">4. Stage 1 audit (1-2 weeks)</div><div class="card-body">Documentation review by the certification body. Confirms readiness for Stage 2.</div></div>
<div class="calc-card"><div class="card-title">5. Stage 2 audit (1-2 weeks)</div><div class="card-body">On-site (or remote) implementation review. Sample controls, interview owners, test evidence.</div></div>
<div class="calc-card"><div class="card-title">6. Surveillance &amp; recertification</div><div class="card-body">Annual surveillance audits, full recertification every 3 years. Continual improvement evidence required.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">Pick a UKAS / ANAB / NANDO-accredited certification body. Non-accredited certificates buy little credibility — and AI Act notified-body status will require accreditation under Article 31.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. The ISO 27000 Family — How 42001 Fits</h2>
<p class="l-text">ISO 42001 is not alone. It sits inside a family of complementary management-system and control-set standards.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ISO/IEC 27001</div><div class="card-body">Information Security Management System. The umbrella for cybersecurity.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27017</div><div class="card-body">Cloud-specific extension of 27002 controls. Relevant when AI runs on hyperscalers.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27018</div><div class="card-body">Protection of PII in public cloud. GDPR-friendly.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27701</div><div class="card-body">Privacy Information Management System extension to 27001. Operationalises GDPR.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27005</div><div class="card-body">Information-security risk management. Companion to 27001 Clause 6.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 23894</div><div class="card-body">AI risk management. Companion to 42001 Clause 6.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 22989</div><div class="card-body">AI concepts and terminology. The shared vocabulary.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 23053</div><div class="card-body">Framework for AI systems using ML. Architectural reference.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Real-World Adopters Through 2025</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Microsoft</div><div class="card-body">First major hyperscaler announcing ISO 42001 alignment for Azure AI services (early 2024).</div></div>
<div class="calc-card"><div class="card-title">Anthropic</div><div class="card-body">Public commitment to ISO 42001 and reporting against the Responsible Scaling Policy.</div></div>
<div class="calc-card"><div class="card-title">KPMG &amp; consultancies</div><div class="card-body">Among the first certified firms — useful as service providers given they advise others on the same standard.</div></div>
<div class="calc-card"><div class="card-title">Workday</div><div class="card-body">Public ISO 42001 certification announcement (2024) for HR-AI products that fall in AI Act Annex III.4.</div></div>
<div class="calc-card"><div class="card-title">SAS / Salesforce</div><div class="card-body">2024-2025 announcements aligning Einstein / Viya AI with ISO 42001.</div></div>
<div class="calc-card"><div class="card-title">EU public sector</div><div class="card-body">Several Member States piloting 42001 internally as preparation for AI Act enforcement Aug 2026.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Worked Capstone Example — A Hiring AI Vendor</h2>
<p class="l-text">Pulling everything together. Imagine an EU-based vendor selling a CV-screening AI to corporate HR teams. Walk the stack:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GDPR (lesson L1)</div><div class="card-body">Lawful basis: contract for inference, LIA for product improvement. DPIA mandatory (Art.35 + EDPB list). Article 22 gating: human-in-the-loop on adverse decisions. Data subject rights pipeline.</div></div>
<div class="calc-card"><div class="card-title">EU AI Act (lesson L2)</div><div class="card-body">Annex III.4 high-risk. Articles 8-15: risk management, data governance, tech doc, logs, transparency, human oversight, accuracy/robustness/security. CE marking + EU database registration.</div></div>
<div class="calc-card"><div class="card-title">NIS2 / DORA (lesson L3)</div><div class="card-body">Customers in essential entities → supply-chain article hits. SOC 2 / ISO 27001 attestations expected. 24/72/30 incident reporting downstream.</div></div>
<div class="calc-card"><div class="card-title">NIST RMF (lesson L4)</div><div class="card-body">Govern: AI policy, RACI. Map: stakeholder analysis. Measure: bias audit on age/gender/ethnicity. Manage: residual-risk acceptance with ALARP.</div></div>
<div class="calc-card"><div class="card-title">Audit (lesson L5)</div><div class="card-body">Datasheet for the CV corpus. Model card per release. Quarterly internal audit per Raji 2020. Annual third-party fairness review.</div></div>
<div class="calc-card"><div class="card-title">ISO 27001 + 42001 (this lesson)</div><div class="card-body">Integrated ISMS + AIMS. Single SoA cross-referencing both Annex A sets. Surveillance audits annually.</div></div>
</div>

<p class="l-text">If a regulator knocks tomorrow, the artefact pack — DPIA, Annex IV doc, model cards, audit reports, ISO certs, monitoring dashboards — answers every reasonable question. If something is missing, you know which lesson to revisit.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Closing — Compliance as Competitive Advantage</h2>
<p class="l-text">The first wave of AI products competed on capability. The 2025-2030 wave competes on capability + trustworthiness. Enterprise procurement now asks for ISO 42001 alongside SOC 2, EU customers ask for AI Act conformity by default, and consumers increasingly notice (the Italian Garante's OpenAI ban produced one of the largest spikes in privacy-focused traffic of 2023). Treat compliance not as paperwork tax but as the substrate that lets you ship AI into regulated markets at all.</p>

<p class="l-text">The track is finished. You should now be able to: classify any AI system into AI Act tiers in 60 seconds; run a DPIA and an FRIA; design a NIST-RMF-aligned risk register; build a model card and a datasheet; assemble an audit pack; and plan an ISO 27001 + 42001 certification. European Information Security Management programmes recognise this stack as the working repertoire of an AI/security professional in 2026 and beyond. Build it once, version it, and it is the gift that keeps repaying you across every regulatory shift the next decade brings.</p>
</div>`,
tr: `<p class="l-text"><strong>Standartlar, iyi niyetleri denetlenebilir, sertifikalanabilir pratiğe dönüştürür.</strong> Bu track'in ilk beş dersi size nedeni ve neyi verdi — veri için GDPR, ürün için AB AI Yasası, siber güvenlik için NIS2/DORA, risk için NIST RMF, denetim için model kartları ve Raji çerçevesi. Bu bitirme size organizasyonel ölçekte <em>nasıl</em>'ı verir: altta yatan bilgi-güvenliği yönetim sistemi için <strong>ISO/IEC 27001:2022</strong>, dünyanın ilk AI yönetim sistemi standardı olan <strong>ISO/IEC 42001:2023</strong> (18 Aralık 2023'te yayımlandı) ve AI risk yönetimi için <strong>ISO/IEC 23894:2023</strong>. Birlikte bunlar diğer her artefaktı çevreleyen <em>sertifikalanabilir</em> kabuğu tanımlar ve bir organizasyonun "bize güvenin" yerine "üçüncü bir tarafın doğrulayabileceği bir standartı karşılıyoruz" demesine izin verir.</p>

<p class="l-text">ISO/IEC 42001 önemlidir çünkü gönüllü çerçeveler (NIST RMF) ile AB düzenlemesi arasındaki köprüdür. Avrupa Komisyonu, ISO 42001'e dayalı uyumlulaştırılmış standartlarla uyumun, CEN-CENELEC JTC 21 uyumlulaştırılmış Avrupa sürümlerini bitirdiğinde AI Yasası'nın yüksek-risk yükümlülükleriyle (Madde 8-15) uygunluk varsayımı sağlayacağını işaret etti. Bu nedenle ilk AI yönetim sertifikaları standardın yayımlanmasından aylar sonra gönderildi — Microsoft, KPMG, Anthropic ve diğerleri 2024-2025 boyunca ISO 42001 sertifikasyonunu kamuya duyurdu. Bu bitirme her iki standardın yapısını, AI Yasası crosswalk'ını, tipik sertifika zaman çizelgesini ve üç rejimi aynı anda karşılayan entegre bir yönetim sisteminin işlenmiş bir örneğini yürür.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>ISO 27001:2022 ISMS maddeleri 4-10 ve Ek A 93 kontrolünü yürüyün</li>
<li>ISO/IEC 42001:2023 AIMS maddeleri 4-10 ve Ek A 38 AI'a özgü kontrolü yürüyün</li>
<li>ISO/IEC 23894:2023'ü AI aromalı ISO 31000 risk yönetim merceği olarak okuyun</li>
<li>ISO 42001 kontrollerini AI Yasası Madde 8-15 yüksek-risk yükümlülüklerine eşleyin</li>
<li>Bir sertifika yolu planlayın: boşluk analizi → Aşama 1 → Aşama 2 → gözetim → yeniden sertifikasyon</li>
<li>ISO 27001 + ISO 42001 + AI Yasası + NIST RMF'yi kapsayan birleşik bir uyumluluk dashboard'u inşa edin</li>
<li>ISO 27017 (bulut), ISO 27018 (PII), ISO 27701 (mahremiyet) ile entegrasyonu tanıyın</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. ISO/IEC 27001:2022 — ISMS Temeli</h2>
<p class="l-text">ISO/IEC 27001 bir yönetim-sistemi standardıdır, yani belirli teknolojiler reçete etmez — belgelenmiş, sürekli iyileştirilen bir Bilgi Güvenliği Yönetim Sistemi (ISMS) işletmenizi gerektirir. 2022 revizyonu yapıyı ISO 9001, ISO 14001, ISO 22301, ISO 42001 vb. tarafından paylaşılan Yüksek Seviyeli Yapı ile hizaladı, böylece birden fazla yönetim sistemi temiz şekilde entegre olur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Madde 4 — Bağlam</div><div class="card-body">İç/dış konular, ilgili taraflar, ISMS kapsamı.</div></div>
<div class="calc-card"><div class="card-title">Madde 5 — Liderlik</div><div class="card-body">Üst yönetim taahhüdü, infosec politikası, roller ve sorumluluklar.</div></div>
<div class="calc-card"><div class="card-title">Madde 6 — Planlama</div><div class="card-body">Risk değerlendirmesi, risk işleme, Uygulanabilirlik Beyanı, hedefler.</div></div>
<div class="calc-card"><div class="card-title">Madde 7 — Destek</div><div class="card-body">Kaynaklar, yetkinlik, farkındalık, iletişim, belgelenmiş bilgi.</div></div>
<div class="calc-card"><div class="card-title">Madde 8 — Operasyon</div><div class="card-body">Operasyonel planlama, pratikte risk değerlendirmesi, pratikte risk işleme.</div></div>
<div class="calc-card"><div class="card-title">Madde 9 — Performans değerlendirmesi</div><div class="card-body">İzleme, iç denetim, yönetim incelemesi.</div></div>
<div class="calc-card"><div class="card-title">Madde 10 — İyileştirme</div><div class="card-body">Uygunsuzluk ve düzeltici aksiyon, sürekli iyileştirme.</div></div>
</div>

<p class="l-text">2022 sürümünün Ek A'sı, dört temaya yeniden organize edilmiş <strong>93 kontrol</strong> içerir (2013'teki 114'ten azaltılmıştır): Organizasyonel, İnsanlar, Fiziksel, Teknolojik. SoA'daki her kontrol gerekçeyle uygulanabilir / uygulanamaz olarak işaretlenir. Denetçi örneklemesi SoA'yı hedef alır.</p>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. ISO/IEC 42001:2023 — AI Yönetim Sistemi</h2>
<p class="l-text">18 Aralık 2023'te yayımlanan ISO/IEC 42001, AI sistemlerini organizasyonel ölçekte yönetmek için özel olan ilk standarttır. ISO 27001 ile aynı Yüksek Seviyeli Yapıyı kullanır — madde 4-10 — böylece zaten bir ISMS işleten bir organizasyon yönetişimi yeniden icat etmeden onu bir AIMS'e genişletebilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Madde 4 — Bağlam (AI aromalı)</div><div class="card-body">AI'a özgü paydaşlar, amaçlanan kullanım sınırları, AI değer zincirindeki rol (sağlayıcı, geliştirici, deployer).</div></div>
<div class="calc-card"><div class="card-title">Madde 5 — Liderlik ve AI politikası</div><div class="card-body">Amacı, ilkeleri, yönetişimi, eskalasyonu belirten belgelenmiş AI politikası.</div></div>
<div class="calc-card"><div class="card-title">Madde 6 — AI riski ve etkisi</div><div class="card-body">AI risk değerlendirmesi (ISO 23894 başına) + bireyler, gruplar, toplum üzerinde AI sistem etki değerlendirmesi.</div></div>
<div class="calc-card"><div class="card-title">Madde 7 — Kaynaklar, yetkinlik, iletişim</div><div class="card-body">Özellikle AI yetkinliği ve farkındalığı dahil — model okuryazarlığı.</div></div>
<div class="calc-card"><div class="card-title">Madde 8 — Operasyon (yaşam döngüsü)</div><div class="card-body">Konsept, tasarım, geliştirme, V&amp;V, deploy, izleme, hizmetten çıkarma.</div></div>
<div class="calc-card"><div class="card-title">Madde 9 — Değerlendirme</div><div class="card-body">İzleme, ölçüm, iç denetim, AI sistemlerinin yönetim incelemesi.</div></div>
<div class="calc-card"><div class="card-title">Madde 10 — İyileştirme</div><div class="card-body">AI davranışındaki uygunsuzluk, kök-neden analizi, yeniden eğitim, kullanımdan kaldırma.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">ISO 42001 Ek A, dokuz alanda <strong>38 AI'a özgü kontrol</strong> içerir: AI politikaları, iç organizasyon, kaynaklar, etki değerlendirmesi, yaşam döngüsü, veri, ilgili taraflar için bilgi, kullanım, üçüncü taraf. Ek B uygulama rehberi verir.</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. ISO/IEC 23894:2023 — AI Risk Yönetimi</h2>
<p class="l-text">ISO/IEC 23894, ISO 31000'in özel AI aromalı uygulamasıdır. ISO 31000 jenerik risk-yönetim ilkeleri (orantılı, yapılandırılmış, entegre, dinamik) verirken, 23894 bu ilkelerin AI için nasıl oynadığına dair örnekler verir: veri riskleri, model riskleri, değer-zinciri riskleri, sosyo-teknik riskler. Hem ISO 27001 hem de ISO 42001 için doğal Madde 6 girdisidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İlkeler (31000'den)</div><div class="card-body">Entegre, yapılandırılmış, özelleştirilmiş, kapsayıcı, dinamik, en iyi mevcut bilgi, insan/kültürel faktörler, sürekli iyileştirme.</div></div>
<div class="calc-card"><div class="card-title">Süreç</div><div class="card-body">İletişim, kapsam/bağlam/kriter, risk değerlendirmesi, risk işleme, izleme, kayıt ve raporlama.</div></div>
<div class="calc-card"><div class="card-title">AI'a özgü risk kaynakları</div><div class="card-body">Veri kalitesi, şeffaflık, adillik, hesap verebilirlik, sağlamlık, mahremiyet — ve değer-zinciri bağımlılıkları.</div></div>
</div>

<div class="katex-block">$$\\text{Risk}_{\\text{AI}} = f(\\text{Likelihood},\\ \\text{Impact},\\ \\text{Context}_{\\text{sociotechnical}})$$</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. ISO 42001 Ek A'nın 38 Kontrolü</h2>
<p class="l-text">38'in hepsini ezberlemek gereksizdir; dokuz kümeyi tanımak gereklidir. Her kümenin denetçinin örnekleyeceği tipik kanıtı vardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A.2 AI için politikalar</div><div class="card-body">AI politikası, organizasyon politikalarıyla hizalama, periyodik inceleme.</div></div>
<div class="calc-card"><div class="card-title">A.3 İç organizasyon</div><div class="card-body">AI rolleri ve sorumlulukları, AI endişelerinin raporlanması.</div></div>
<div class="calc-card"><div class="card-title">A.4 AI için kaynaklar</div><div class="card-body">İnsan kaynakları, hesaplama kaynakları, araçlar, veri kaynakları.</div></div>
<div class="calc-card"><div class="card-title">A.5 Etki değerlendirmesi</div><div class="card-body">Bireyler, gruplar, toplum üzerinde AI sistem etkilerini değerlendirme süreci. Belgelenmiş.</div></div>
<div class="calc-card"><div class="card-title">A.6 AI sistem yaşam döngüsü</div><div class="card-body">Hedefler, gereksinimler, tasarım, V&amp;V, deploy, operasyon, izleme, emeklilik.</div></div>
<div class="calc-card"><div class="card-title">A.7 AI için veri</div><div class="card-body">Veri kalitesi, veri yönetişimi, veri hazırlığı.</div></div>
<div class="calc-card"><div class="card-title">A.8 İlgili taraflar için bilgi</div><div class="card-body">Kullanıcılar, deployerlar, etkilenen taraflar için dokümantasyon; amaçlanan kullanım; loglama.</div></div>
<div class="calc-card"><div class="card-title">A.9 AI sistemlerinin kullanımı</div><div class="card-body">Sorumlu kullanım için süreçler, amaçlanan-kullanım uygulaması.</div></div>
<div class="calc-card"><div class="card-title">A.10 Üçüncü taraf ve müşteri</div><div class="card-body">Değer zinciri boyunca sorumlulukların tahsisi; tedarikçi süreçleri; müşteri desteği.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. ISO 42001 ↔ AB AI Yasası Crosswalk</h2>
<p class="l-text">2025'te en çok sorulan tek uyumluluk sorusu şuydu: "ISO 42001 sertifikası alırsam AI Yasası uyumlu olur muyum?" Dürüst yanıt: 42001 yönetim-sistem katmanının çoğunu ve yüksek-risk yükümlülüklerinin çoğunu kapsar, ama Madde 5'in esas yasaklarını veya Madde 51-55'in GPAI'a özgü yükümlülüklerini kapsamaz. Kodda crosswalk:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>iso42001_to_ai_act = {
    <span class="str">"A.2 (AI policy)"</span>:                    [<span class="str">"Art.17 (QMS)"</span>],
    <span class="str">"A.3 (Internal organisation)"</span>:        [<span class="str">"Art.17 (QMS)"</span>, <span class="str">"Art.26 (deployer obligations)"</span>],
    <span class="str">"A.4 (Resources)"</span>:                    [<span class="str">"Art.17 (QMS)"</span>],
    <span class="str">"A.5 (Impact assessment)"</span>:            [<span class="str">"Art.27 (FRIA)"</span>, <span class="str">"Art.9 (risk mgmt)"</span>],
    <span class="str">"A.6 (Lifecycle)"</span>:                    [<span class="str">"Art.9"</span>, <span class="str">"Art.11 (tech doc)"</span>, <span class="str">"Art.17"</span>],
    <span class="str">"A.7 (Data)"</span>:                         [<span class="str">"Art.10 (data &amp; data governance)"</span>],
    <span class="str">"A.8 (Information for parties)"</span>:      [<span class="str">"Art.13 (transparency)"</span>, <span class="str">"Art.14 (human oversight)"</span>],
    <span class="str">"A.9 (Use)"</span>:                          [<span class="str">"Art.26 (deployer)"</span>, <span class="str">"Art.50 (transparency obligations)"</span>],
    <span class="str">"A.10 (Third-party)"</span>:                 [<span class="str">"Art.25 (importer/distributor)"</span>, <span class="str">"Art.28 (auth. rep.)"</span>],
    <span class="cm"># Maddeler</span>
    <span class="str">"Clause 6 (risk &amp; impact)"</span>:           [<span class="str">"Art.9"</span>],
    <span class="str">"Clause 8 (operation)"</span>:               [<span class="str">"Art.9"</span>, <span class="str">"Art.15 (acc/rob/sec)"</span>],
    <span class="str">"Clause 9 (evaluation)"</span>:              [<span class="str">"Art.72 (post-market monitoring)"</span>],
    <span class="str">"Clause 10 (improvement)"</span>:            [<span class="str">"Art.73 (incidents)"</span>, <span class="str">"Art.20 (corrective action)"</span>],
}

<span class="cm"># ISO 42001 tek başına neyi kapsamaz?</span>
not_covered = [
    <span class="str">"Art.5 (prohibited practices) — substantive ban, not a management process"</span>,
    <span class="str">"Art.51-55 (GPAI / systemic-risk GPAI) — specific to foundation-model providers"</span>,
    <span class="str">"Art.99 (penalties) — regulatory, not certifiable"</span>,
    <span class="str">"Art.71 (EU database registration) — administrative"</span>,
]

<span class="fn">print</span>(<span class="str">"ISO 42001 to EU AI Act mapping:"</span>)
<span class="kw">for</span> control, articles <span class="kw">in</span> iso42001_to_ai_act.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">"  {control:40s} -&gt; {', '.join(articles)}"</span>)
<span class="fn">print</span>(<span class="str">"\\nGaps requiring separate compliance:"</span>)
<span class="kw">for</span> g <span class="kw">in</span> not_covered:
    <span class="fn">print</span>(<span class="str">" -"</span>, g)</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) bir model kartı, bir datasheet ve bir ROPA girdisi (Madde 30) çıkarır — denetçilerin gerçekten istediği belge üçlüsü.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Düz Python — paket gerekmez. Crosswalk bilgilendirici; CEN-CENELEC JTC 21'den gelen uyumlulaştırılmış standartlar sonunda bunu resmileştirecek.</p>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Uyumluluk Skoru — Ağırlıklı Toplama</h2>
<p class="l-text">Birleşik bir uyumluluk dashboard'u, her çerçeveden kontrol durumunu tek bir skorda birleştirir. Formül basittir ama disiplin değildir:</p>

<div class="katex-block">$$\\text{Compliance score} \\;=\\; \\frac{\\sum_i w_i \\cdot s_i}{\\sum_i w_i}$$</div>

<p class="l-text">Burada <em>w_i</em>, kontrol i'nin ağırlığı (eksikse ciddiyet) ve <em>s_i</em> durumudur (0 = uygulanmamış, 0.5 = kısmi, 1 = tam uygulanmış ve kanıtlanmış). "Aşama 2 denetimine hazır" eşiği genellikle &gt; 0.85'tir, kritik-ağırlıklı boşluklar 0 durumda olmamalıdır.</p>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Entegre Uyumluluk Dashboard'u</h2>
<p class="l-text">Gerçek bir organizasyon ISO 27001 + ISO 42001 + AI Yasası + NIST RMF + GDPR'yi aynı anda işletir. Artefaktlar %60-80 örtüşür. Dashboard'u kontrol üzerinde anahtarlanmış bir DataFrame olarak inşa edin, karşıladığı her düzenleyici atıf için bir satır — böylece bir kez düzelt, her yerde talep et.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

controls = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"C-001"</span>,<span class="str">"AI policy approved by top management"</span>,         <span class="num">3</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001:5.2"</span>,<span class="str">"ISO42001:5.2"</span>,<span class="str">"AIAct:Art.17"</span>]),
  (<span class="str">"C-002"</span>,<span class="str">"Risk assessment per ISO 23894"</span>,                <span class="num">3</span>, <span class="num">0.8</span>, [<span class="str">"ISO27001:6.1"</span>,<span class="str">"ISO42001:6.1"</span>,<span class="str">"AIAct:Art.9"</span>,<span class="str">"RMF:Map"</span>]),
  (<span class="str">"C-003"</span>,<span class="str">"AI system impact assessment (FRIA)"</span>,           <span class="num">3</span>, <span class="num">0.5</span>, [<span class="str">"ISO42001:A.5"</span>,<span class="str">"AIAct:Art.27"</span>,<span class="str">"GDPR:Art.35"</span>]),
  (<span class="str">"C-004"</span>,<span class="str">"Data governance &amp; quality"</span>,                    <span class="num">3</span>, <span class="num">1.0</span>, [<span class="str">"ISO42001:A.7"</span>,<span class="str">"AIAct:Art.10"</span>,<span class="str">"GDPR:Art.5"</span>]),
  (<span class="str">"C-005"</span>,<span class="str">"Technical documentation (Annex IV)"</span>,           <span class="num">3</span>, <span class="num">0.8</span>, [<span class="str">"ISO42001:8.4"</span>,<span class="str">"AIAct:Art.11"</span>]),
  (<span class="str">"C-006"</span>,<span class="str">"Logging &amp; record-keeping"</span>,                     <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001:A.8.15"</span>,<span class="str">"AIAct:Art.12"</span>,<span class="str">"NIS2:Art.21"</span>]),
  (<span class="str">"C-007"</span>,<span class="str">"Transparency documentation"</span>,                   <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO42001:A.8"</span>,<span class="str">"AIAct:Art.13"</span>]),
  (<span class="str">"C-008"</span>,<span class="str">"Human oversight design"</span>,                       <span class="num">3</span>, <span class="num">0.5</span>, [<span class="str">"ISO42001:A.9"</span>,<span class="str">"AIAct:Art.14"</span>,<span class="str">"GDPR:Art.22"</span>]),
  (<span class="str">"C-009"</span>,<span class="str">"Accuracy / robustness / security testing"</span>,     <span class="num">3</span>, <span class="num">0.8</span>, [<span class="str">"ISO27001:A.8"</span>,<span class="str">"ISO42001:A.6"</span>,<span class="str">"AIAct:Art.15"</span>]),
  (<span class="str">"C-010"</span>,<span class="str">"QMS documented"</span>,                               <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001 whole"</span>,<span class="str">"ISO42001 whole"</span>,<span class="str">"AIAct:Art.17"</span>]),
  (<span class="str">"C-011"</span>,<span class="str">"Post-market monitoring"</span>,                       <span class="num">3</span>, <span class="num">0.5</span>, [<span class="str">"ISO42001:9.1"</span>,<span class="str">"AIAct:Art.72"</span>]),
  (<span class="str">"C-012"</span>,<span class="str">"Incident reporting runbook"</span>,                   <span class="num">3</span>, <span class="num">0.8</span>, [<span class="str">"ISO27001:A.5.24"</span>,<span class="str">"AIAct:Art.73"</span>,<span class="str">"NIS2:Art.23"</span>,<span class="str">"GDPR:Art.33"</span>]),
  (<span class="str">"C-013"</span>,<span class="str">"Third-party / supplier policy"</span>,                <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001:A.5.19"</span>,<span class="str">"ISO42001:A.10"</span>,<span class="str">"NIS2:Art.21(d)"</span>,<span class="str">"DORA:Art.28"</span>]),
  (<span class="str">"C-014"</span>,<span class="str">"Internal audit programme"</span>,                     <span class="num">2</span>, <span class="num">0.5</span>, [<span class="str">"ISO27001:9.2"</span>,<span class="str">"ISO42001:9.2"</span>]),
  (<span class="str">"C-015"</span>,<span class="str">"Management review"</span>,                            <span class="num">2</span>, <span class="num">1.0</span>, [<span class="str">"ISO27001:9.3"</span>,<span class="str">"ISO42001:9.3"</span>]),
], columns=[<span class="str">"id"</span>,<span class="str">"control"</span>,<span class="str">"weight"</span>,<span class="str">"status"</span>,<span class="str">"mappings"</span>])

score = (controls.weight * controls.status).<span class="fn">sum</span>() / controls.weight.<span class="fn">sum</span>()
critical_gaps = controls[(controls.weight == <span class="num">3</span>) &amp; (controls.status &lt; <span class="num">1.0</span>)]
<span class="fn">print</span>(f<span class="str">"Overall compliance score: {score:.2%}"</span>)
<span class="fn">print</span>(f<span class="str">"\\nCritical gaps (weight=3, status&lt;1):"</span>)
<span class="fn">print</span>(critical_gaps[[<span class="str">"id"</span>,<span class="str">"control"</span>,<span class="str">"status"</span>]].<span class="fn">to_string</span>(index=<span class="kw">False</span>))

<span class="cm"># Çerçeveler arası kapsam</span>
<span class="kw">from</span> collections <span class="kw">import</span> Counter
fw_counts = <span class="fn">Counter</span>()
<span class="kw">for</span> ms <span class="kw">in</span> controls.mappings:
    <span class="kw">for</span> m <span class="kw">in</span> ms:
        framework = m.<span class="fn">split</span>(<span class="str">":"</span>)[<span class="num">0</span>]
        fw_counts[framework] += <span class="num">1</span>
<span class="fn">print</span>(<span class="str">"\\nControls touching each framework:"</span>)
<span class="kw">for</span> f, n <span class="kw">in</span> <span class="fn">sorted</span>(fw_counts.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>]):
    <span class="fn">print</span>(f<span class="str">"  {f:12s}: {n}"</span>)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) bir model kartı, bir datasheet ve bir ROPA girdisi (Madde 30) çıkarır — denetçilerin gerçekten istediği belge üçlüsü.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas önceden yüklü. Bu, entegre bir GRC platformunun (Vanta, Drata, Secureframe) gösterdiğinin sadeleştirilmiş bir sürümüdür — altta yatan veri modeli aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Sertifika Yolu — Oraya Nasıl Gerçekten Varırsınız</h2>
<p class="l-text">Sertifikasyon bir olay değil, bir süreçtir. Tipik bir ilk-zamanlı ISO 42001 sertifikası (mevcut bir ISO 27001 varsayılarak) baştan sona 6-12 ay sürer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Boşluk analizi (1-2 ay)</div><div class="card-body">Mevcut durumu madde 4-10 + Ek A kontrolleriyle karşılaştırın. Çıktı: sahipler ve tarihlerle boşluk kaydı.</div></div>
<div class="calc-card"><div class="card-title">2. İyileştirme (3-6 ay)</div><div class="card-body">Boşlukları kapatın. Çoğu dokümantasyon ve süreçtir — kod zaten vardır, yönetişim yoktur.</div></div>
<div class="calc-card"><div class="card-title">3. İç denetim + yönetim incelemesi</div><div class="card-body">Aşama 1 öncesi gerekli — Madde 9. Sistemin tasarlandığı gibi çalıştığını test eder.</div></div>
<div class="calc-card"><div class="card-title">4. Aşama 1 denetimi (1-2 hafta)</div><div class="card-body">Sertifika kuruluşu tarafından dokümantasyon incelemesi. Aşama 2 için hazırlığı doğrular.</div></div>
<div class="calc-card"><div class="card-title">5. Aşama 2 denetimi (1-2 hafta)</div><div class="card-body">Yerinde (veya uzaktan) uygulama incelemesi. Kontrolleri örnekleyin, sahiplerle görüşün, kanıtı test edin.</div></div>
<div class="calc-card"><div class="card-title">6. Gözetim ve yeniden sertifikasyon</div><div class="card-body">Yıllık gözetim denetimleri, her 3 yılda bir tam yeniden sertifikasyon. Sürekli iyileştirme kanıtı gerekli.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">UKAS / ANAB / NANDO-akredite bir sertifika kuruluşu seçin. Akredite olmayan sertifikalar pek güvenilirlik kazandırmaz — ve AI Yasası bildirilmiş-kuruluş statüsü Madde 31 altında akreditasyon gerektirecektir.</div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. ISO 27000 Ailesi — 42001 Nasıl Uyar</h2>
<p class="l-text">ISO 42001 yalnız değildir. Tamamlayıcı yönetim-sistem ve kontrol-set standartları ailesinde oturur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ISO/IEC 27001</div><div class="card-body">Bilgi Güvenliği Yönetim Sistemi. Siber güvenlik için şemsiye.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27017</div><div class="card-body">27002 kontrollerinin buluta özgü uzantısı. AI hyperscaler'larda çalıştığında ilgili.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27018</div><div class="card-body">Kamu bulutunda PII koruması. GDPR-dostu.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27701</div><div class="card-body">27001'e Mahremiyet Bilgi Yönetim Sistemi uzantısı. GDPR'yi operasyonelleştirir.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27005</div><div class="card-body">Bilgi-güvenliği risk yönetimi. 27001 Madde 6'ya eşlikçi.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 23894</div><div class="card-body">AI risk yönetimi. 42001 Madde 6'ya eşlikçi.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 22989</div><div class="card-body">AI kavramları ve terminolojisi. Paylaşılan kelime dağarcığı.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 23053</div><div class="card-body">ML kullanan AI sistemleri için çerçeve. Mimari referans.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10-tr">
<h2 class="lesson-title">10. 2025'e Kadar Gerçek Dünya Benimseyicileri</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Microsoft</div><div class="card-body">Azure AI hizmetleri için ISO 42001 hizalamasını duyuran ilk büyük hyperscaler (2024 başı).</div></div>
<div class="calc-card"><div class="card-title">Anthropic</div><div class="card-body">ISO 42001'e ve Sorumlu Ölçekleme Politikası'na karşı raporlamaya açık taahhüt.</div></div>
<div class="calc-card"><div class="card-title">KPMG ve danışmanlıklar</div><div class="card-body">İlk sertifikalı firmalar arasında — başkalarına aynı standart hakkında danışmanlık verdikleri için hizmet sağlayıcı olarak yararlı.</div></div>
<div class="calc-card"><div class="card-title">Workday</div><div class="card-body">AI Yasası Ek III.4'e giren İK-AI ürünleri için kamuya ISO 42001 sertifikasyon duyurusu (2024).</div></div>
<div class="calc-card"><div class="card-title">SAS / Salesforce</div><div class="card-body">Einstein / Viya AI'yı ISO 42001 ile hizalayan 2024-2025 duyuruları.</div></div>
<div class="calc-card"><div class="card-title">AB kamu sektörü</div><div class="card-body">Birkaç Üye Devlet, Ağu 2026 AI Yasası uygulamasına hazırlık olarak 42001'i dahili olarak pilotluyor.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11-tr">
<h2 class="lesson-title">11. İşlenmiş Bitirme Örneği — Bir İşe Alım AI Satıcısı</h2>
<p class="l-text">Her şeyi bir araya getirme. Kurumsal İK ekiplerine bir CV-tarama AI satan AB merkezli bir satıcı hayal edin. Yığını yürüyün:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GDPR (ders L1)</div><div class="card-body">Yasal dayanak: çıkarım için sözleşme, ürün iyileştirme için LIA. DPIA zorunlu (Md.35 + EDPB listesi). Madde 22 kapısı: olumsuz kararlarda insan-in-the-loop. Veri sahibi hakları hattı.</div></div>
<div class="calc-card"><div class="card-title">AB AI Yasası (ders L2)</div><div class="card-body">Ek III.4 yüksek-risk. Madde 8-15: risk yönetimi, veri yönetişimi, teknik dok., loglar, şeffaflık, insan denetimi, doğruluk/sağlamlık/güvenlik. CE işareti + AB veritabanı kaydı.</div></div>
<div class="calc-card"><div class="card-title">NIS2 / DORA (ders L3)</div><div class="card-body">Temel kuruluşlardaki müşteriler → tedarik zinciri maddesi çarpar. SOC 2 / ISO 27001 onayları beklenir. Aşağı akışta 24/72/30 olay raporlama.</div></div>
<div class="calc-card"><div class="card-title">NIST RMF (ders L4)</div><div class="card-body">Yönet: AI politikası, RACI. Haritala: paydaş analizi. Ölç: yaş/cinsiyet/etnisite üzerinde bias denetimi. Yönet: ALARP ile kalan-risk kabulü.</div></div>
<div class="calc-card"><div class="card-title">Denetim (ders L5)</div><div class="card-body">CV korpusu için datasheet. Sürüm başına model kartı. Raji 2020 başına çeyreklik iç denetim. Yıllık üçüncü-taraf adillik incelemesi.</div></div>
<div class="calc-card"><div class="card-title">ISO 27001 + 42001 (bu ders)</div><div class="card-body">Entegre ISMS + AIMS. Her iki Ek A setine çapraz referanslı tek SoA. Yıllık gözetim denetimleri.</div></div>
</div>

<p class="l-text">Bir düzenleyici yarın kapıyı çalarsa, artefakt paketi — DPIA, Ek IV dok., model kartları, denetim raporları, ISO sertifikaları, izleme dashboard'ları — her makul soruyu yanıtlar. Bir şey eksikse, hangi derse geri döneceğinizi bilirsiniz.</p>
</div>

<div class="lesson-block" id="section-12-tr">
<h2 class="lesson-title">12. Kapanış — Rekabet Avantajı Olarak Uyumluluk</h2>
<p class="l-text">İlk dalga AI ürünleri yetenek üzerinde rekabet etti. 2025-2030 dalgası yetenek + güvenilirlik üzerinde rekabet ediyor. Kurumsal satın alma artık SOC 2'nin yanında ISO 42001 istiyor, AB müşterileri varsayılan olarak AI Yasası uygunluğunu istiyor ve tüketiciler giderek fark ediyor (İtalyan Garante'nin OpenAI yasağı 2023'ün en büyük mahremiyet odaklı trafik artışlarından birini üretti). Uyumluluğu kâğıt vergisi olarak değil, AI'yı düzenlenmiş pazarlara hiç gönderebilmenizi sağlayan alt katman olarak ele alın.</p>

<p class="l-text">Track bitti. Şimdi şunları yapabilmelisiniz: herhangi bir AI sistemini 60 saniyede AI Yasası düzeylerine sınıflandırmak; bir DPIA ve bir FRIA çalıştırmak; NIST-RMF-uyumlu bir risk kaydı tasarlamak; bir model kartı ve bir datasheet inşa etmek; bir denetim paketi monte etmek; ve bir ISO 27001 + 42001 sertifikasyonu planlamak. Avrupa'daki Bilgi Güvenliği Yönetimi programları bu yığını 2026 ve sonrasında bir AI/güvenlik profesyonelinin çalışan repertuvarı olarak tanır. Bir kez inşa edin, sürümleyin ve önümüzdeki on yılın getireceği her düzenleyici değişimde size geri ödeyen hediye olur.</p>
</div>`
};
