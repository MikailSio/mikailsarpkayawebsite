window.COMPLIANCE_L3 = {
en: `<p class="l-text"><strong>The EU AI Act assumes the system underneath is cyber-secure.</strong> Two horizontal directives now define what "secure" means in practice for almost every organisation that operates AI in Europe: NIS2 (Directive EU 2022/2555) for cybersecurity across 15 critical sectors, and DORA (Regulation EU 2022/2554) for ICT risk in the financial sector. NIS2 had to be transposed into national law by 17 October 2024; DORA has applied directly since 17 January 2025. Together they impose a cybersecurity baseline that an AI provider can no longer treat as the SecOps team's problem — it is the legal floor under everything you build.</p>

<p class="l-text">For an AI engineer this is not abstract. NIS2 obliges essential entities to manage supply-chain cybersecurity (Article 21) — your foundation-model vendor, your vector-database SaaS, and your fine-tuning pipeline are all in scope. Incident-reporting clocks tick fast: 24 hours for an early warning, 72 hours for a notification, 1 month for a final report. DORA goes further, demanding ICT third-party risk registers and contractual rights to audit, and tier-1 financial institutions must run threat-led penetration tests (TLPT) every three years. Fines reach <strong>€10 million or 2% of global turnover</strong> under NIS2 and similar percentages under DORA. This lesson maps both directives onto AI infrastructure decisions.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Determine whether your organisation is essential or important under NIS2 Annex I/II</li>
<li>Implement the ten cybersecurity risk-management measures of NIS2 Article 21</li>
<li>Run incident classification and meet the 24h / 72h / 1m reporting timeline</li>
<li>Apply DORA's five pillars (ICT risk, incident reporting, resilience testing, third-party risk, threat-intel sharing)</li>
<li>Manage AI supply-chain risk: foundation-model vendors, hosted inference, vector DB, fine-tuning data</li>
<li>Distinguish NIS2 from DORA where they overlap (lex specialis: DORA prevails for financial entities)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. NIS2 — Scope, Sectors, and Two Tiers</h2>
<p class="l-text">NIS2 replaces the original 2016 NIS Directive with a much wider scope. <strong>Essential entities</strong> (Annex I): energy, transport, banking, financial market infrastructure, health, drinking water, waste water, digital infrastructure, ICT service management, public administration, space. <strong>Important entities</strong> (Annex II): postal/courier, waste management, chemicals, food, manufacturing of medical devices/computers/electrical equipment/machinery/motor vehicles/other transport, digital providers, research. Together: <em>15 sectors and roughly 160,000 entities across the EU</em>, ten times the old NIS perimeter.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Essential entities</div><div class="card-body">Proactive supervision (audits, on-site inspections, ad-hoc audits). Higher fines: up to €10M or 2% global turnover.</div></div>
<div class="calc-card"><div class="card-title">Important entities</div><div class="card-body">Reactive supervision (after evidence). Lower fines: up to €7M or 1.4% global turnover.</div></div>
<div class="calc-card"><div class="card-title">Size threshold</div><div class="card-body">Generally medium and large entities (≥50 staff or €10M turnover). Some sectors (DNS, TLD, public admin) have no size threshold.</div></div>
<div class="calc-card"><div class="card-title">Cross-border</div><div class="card-body">Jurisdiction is normally where the main establishment is. Digital providers can have multiple competent authorities.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">An AI startup providing inference APIs into healthcare, banking, or public admin probably serves essential entities — and the NIS2 supply-chain article (21.2.d) makes you their problem to manage and yours to comply with.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. NIS2 Article 21 — The Ten Risk-Management Measures</h2>
<p class="l-text">Article 21(2) lists ten cybersecurity risk-management measures every in-scope entity must adopt. They are intentionally broad — Member States and ENISA flesh them out via implementing acts.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">a) Risk analysis &amp; ISMS policy</div><div class="card-body">Documented information-security policy, anchored in risk analysis. Aligned with ISO 27001 (lesson L6).</div></div>
<div class="calc-card"><div class="card-title">b) Incident handling</div><div class="card-body">Detect, respond, recover. Runbooks, on-call rotation, tabletop exercises.</div></div>
<div class="calc-card"><div class="card-title">c) Business continuity</div><div class="card-body">Backups, DR, crisis management. RTO and RPO documented.</div></div>
<div class="calc-card"><div class="card-title">d) Supply chain security</div><div class="card-body">Vendor risk assessment, contractual security clauses, monitoring of supplier cyber posture.</div></div>
<div class="calc-card"><div class="card-title">e) Secure acquisition, development, maintenance</div><div class="card-body">SDLC controls, vulnerability management, secure coding, third-party libraries.</div></div>
<div class="calc-card"><div class="card-title">f) Effectiveness assessment</div><div class="card-body">Test the controls. Pen-tests, red-team, audit.</div></div>
<div class="calc-card"><div class="card-title">g) Cyber hygiene &amp; training</div><div class="card-body">Mandatory training including for senior management. Phishing simulations.</div></div>
<div class="calc-card"><div class="card-title">h) Cryptography</div><div class="card-body">Policy on use and management of crypto. Key rotation, algorithm sunsetting.</div></div>
<div class="calc-card"><div class="card-title">i) Human resources, access, asset management</div><div class="card-body">Onboarding/offboarding, RBAC/ABAC, asset inventory.</div></div>
<div class="calc-card"><div class="card-title">j) MFA, secure comms, secure emergency comms</div><div class="card-body">Multi-factor authentication, encrypted email/voice, out-of-band channels for incidents.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>Personal liability:</strong> NIS2 Article 20 makes <em>management bodies</em> responsible. Sanctions can include temporary bans on holding managerial functions for repeated non-compliance. The CISO is no longer the only person on the hook.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The 24 / 72 / 30 Reporting Clock</h2>
<p class="l-text">A "significant incident" — one that causes severe operational disruption, financial loss, or affects others through material damage — triggers a tight clock under Article 23.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">24 hours — Early warning</div><div class="card-body">Notify CSIRT / competent authority. Indicate suspected malicious cause, cross-border impact.</div></div>
<div class="calc-card"><div class="card-title">72 hours — Incident notification</div><div class="card-body">Update with initial assessment, severity and impact, indicators of compromise.</div></div>
<div class="calc-card"><div class="card-title">1 month — Final report</div><div class="card-body">Detailed description, root cause, mitigations applied, cross-border impact.</div></div>
<div class="calc-card"><div class="card-title">Intermediate report</div><div class="card-body">If the incident is ongoing at 1 month, an intermediate report instead and a final on resolution.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># NIS2 incident-classification — train a tiny LogReg on labelled features</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

<span class="cm"># Features: [users_affected_log, hours_down, financial_eur_log,</span>
<span class="cm">#            cross_border, malicious_suspected]</span>
X = np.<span class="fn">array</span>([
  [np.<span class="fn">log1p</span>(<span class="num">50</span>),     <span class="num">0.5</span>, np.<span class="fn">log1p</span>(1_000),       <span class="num">0</span>, <span class="num">0</span>],   <span class="cm"># not significant</span>
  [np.<span class="fn">log1p</span>(2_000),  <span class="num">3.0</span>, np.<span class="fn">log1p</span>(80_000),      <span class="num">0</span>, <span class="num">1</span>],   <span class="cm"># significant</span>
  [np.<span class="fn">log1p</span>(50_000), <span class="num">12.0</span>,np.<span class="fn">log1p</span>(2_500_000),   <span class="num">1</span>, <span class="num">1</span>],   <span class="cm"># significant</span>
  [np.<span class="fn">log1p</span>(<span class="num">200</span>),    <span class="num">1.0</span>, np.<span class="fn">log1p</span>(5_000),       <span class="num">0</span>, <span class="num">0</span>],   <span class="cm"># not significant</span>
  [np.<span class="fn">log1p</span>(10_000), <span class="num">6.0</span>, np.<span class="fn">log1p</span>(150_000),     <span class="num">1</span>, <span class="num">1</span>],   <span class="cm"># significant</span>
  [np.<span class="fn">log1p</span>(<span class="num">5</span>),      <span class="num">0.2</span>, np.<span class="fn">log1p</span>(<span class="num">0</span>),           <span class="num">0</span>, <span class="num">0</span>],   <span class="cm"># not significant</span>
])
y = np.<span class="fn">array</span>([<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>])
sc = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X); Xs = sc.<span class="fn">transform</span>(X)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xs, y)

incidents = np.<span class="fn">array</span>([
  [np.<span class="fn">log1p</span>(<span class="num">800</span>),  <span class="num">2.0</span>, np.<span class="fn">log1p</span>(20_000), <span class="num">0</span>, <span class="num">1</span>],
  [np.<span class="fn">log1p</span>(<span class="num">3</span>),    <span class="num">0.1</span>, np.<span class="fn">log1p</span>(<span class="num">0</span>),      <span class="num">0</span>, <span class="num">0</span>],
  [np.<span class="fn">log1p</span>(100_000), <span class="num">24.0</span>, np.<span class="fn">log1p</span>(10_000_000), <span class="num">1</span>, <span class="num">1</span>],
])
preds = clf.<span class="fn">predict</span>(sc.<span class="fn">transform</span>(incidents))
labels = [<span class="str">"not significant"</span>, <span class="str">"SIGNIFICANT — start 24h clock"</span>]
<span class="kw">for</span> inc, p <span class="kw">in</span> <span class="fn">zip</span>(incidents, preds):
    <span class="fn">print</span>(inc, <span class="str">"-&gt;"</span>, labels[p])</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) fits a sklearn LogisticRegression — a linear baseline whose gradient w.r.t. inputs is exactly the weight vector. 3) walks the NIST AI RMF Govern → Map → Measure → Manage cycle and annotates each step with the artifact it produces.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">numpy + scikit-learn pre-loaded. The model is illustrative; real classification uses the implementing-act criteria but the workflow is the same.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. DORA — The Five Pillars</h2>
<p class="l-text">DORA (Regulation EU 2022/2554) applies to financial entities — banks, insurers, investment firms, crypto-asset service providers, central counterparties, trading venues — and to their critical ICT third-party providers (CTPPs), which can include hyperscalers and AI-platform vendors. It is built on five pillars.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. ICT risk management (Art. 5-16)</div><div class="card-body">Governance, identification, protection, detection, response, recovery, learning, communication. Board-level accountability.</div></div>
<div class="calc-card"><div class="card-title">2. ICT incident reporting (Art. 17-23)</div><div class="card-body">Single harmonised reporting framework via competent authority. Initial / intermediate / final reports.</div></div>
<div class="calc-card"><div class="card-title">3. Digital operational resilience testing (Art. 24-27)</div><div class="card-body">Annual testing programme. Threat-led penetration testing (TLPT) every 3 years for significant entities — TIBER-EU framework.</div></div>
<div class="calc-card"><div class="card-title">4. ICT third-party risk (Art. 28-44)</div><div class="card-body">Register of information on contractual arrangements. Mandatory contract clauses. Critical TPP designation by ESAs subjects them to direct oversight.</div></div>
<div class="calc-card"><div class="card-title">5. Information sharing (Art. 45)</div><div class="card-body">Voluntary cyber threat-intel sharing arrangements among financial entities.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>Lex specialis:</strong> where DORA and NIS2 overlap, DORA prevails for financial entities (NIS2 Recital 28). DORA also extends to entities not in NIS2's financial-sector scope (e.g. crypto-asset service providers under MiCA).</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. AI Supply-Chain Risk in Practice</h2>
<p class="l-text">Most AI products in 2026 are stacks of third-party services: a foundation-model API, a vector DB, an embedding model, an inference platform, a fine-tuning data broker, observability vendors. NIS2 Art. 21(2)(d) and DORA Articles 28-30 push the security perimeter outward — your supplier's breach is your incident.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

vendors = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"OpenAI Inc."</span>,        <span class="str">"Foundation model API"</span>,     <span class="str">"critical"</span>, <span class="str">"SOC2-T2"</span>,<span class="str">"2024-09-01"</span>, <span class="kw">True</span>,  <span class="str">"US"</span>,  <span class="str">"DPF"</span>),
  (<span class="str">"Anthropic PBC"</span>,      <span class="str">"Foundation model API"</span>,     <span class="str">"critical"</span>, <span class="str">"SOC2-T2"</span>,<span class="str">"2024-11-15"</span>, <span class="kw">True</span>,  <span class="str">"US"</span>,  <span class="str">"SCC"</span>),
  (<span class="str">"Pinecone Systems"</span>,   <span class="str">"Vector database"</span>,          <span class="str">"high"</span>,     <span class="str">"SOC2-T2"</span>,<span class="str">"2024-08-01"</span>, <span class="kw">True</span>,  <span class="str">"US"</span>,  <span class="str">"SCC"</span>),
  (<span class="str">"Hugging Face SAS"</span>,   <span class="str">"Model registry"</span>,           <span class="str">"medium"</span>,   <span class="str">"ISO27001"</span>,<span class="str">"2024-10-01"</span>,<span class="kw">True</span>,  <span class="str">"EU"</span>,  <span class="str">"n/a"</span>),
  (<span class="str">"Modal Labs"</span>,         <span class="str">"GPU inference"</span>,            <span class="str">"high"</span>,     <span class="str">"SOC2-T1"</span>,<span class="str">"2025-01-10"</span>, <span class="kw">False</span>, <span class="str">"US"</span>,  <span class="str">"SCC"</span>),
  (<span class="str">"Snowflake Inc."</span>,     <span class="str">"Data warehouse"</span>,           <span class="str">"critical"</span>, <span class="str">"ISO27001"</span>,<span class="str">"2024-07-20"</span>,<span class="kw">True</span>, <span class="str">"EU/US"</span>,<span class="str">"SCC"</span>),
], columns=[<span class="str">"vendor"</span>,<span class="str">"service"</span>,<span class="str">"criticality"</span>,<span class="str">"attestation"</span>,<span class="str">"last_review"</span>,<span class="str">"ai_act_aligned"</span>,<span class="str">"data_loc"</span>,<span class="str">"transfer"</span>])

<span class="cm"># Gap analysis</span>
gaps = vendors[(vendors.criticality.<span class="fn">isin</span>([<span class="str">"critical"</span>,<span class="str">"high"</span>])) & (vendors.ai_act_aligned == <span class="kw">False</span>)]
overdue = vendors[pd.<span class="fn">to_datetime</span>(vendors.last_review) &lt; pd.<span class="fn">Timestamp</span>(<span class="str">"2024-11-01"</span>)]

<span class="fn">print</span>(<span class="str">"Vendor register:\\n"</span>, vendors.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nNon-aligned critical/high vendors:\\n"</span>, gaps.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nReviews older than 6 months:\\n"</span>, overdue.<span class="fn">to_string</span>(index=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) walks the NIST AI RMF Govern → Map → Measure → Manage cycle and annotates each step with the artifact it produces.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas pre-loaded. The Register of Information that DORA Art. 28(3) requires looks essentially like this DataFrame, exported in the ESAs' XML schema.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Threat-Led Penetration Testing (TLPT)</h2>
<p class="l-text">For significant DORA entities, threat-led penetration tests run on production systems every three years using the TIBER-EU framework. The test simulates real adversaries (APT-style) against critical functions, with a threat-intelligence provider profiling realistic attackers and a red-team executing the scenario. AI inference systems supporting critical financial functions are explicitly in scope: prompt-injection at the model layer, data-poisoning of the embedding store, and exfiltration via tool calls are all on the test menu.</p>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">TIBER-EU also informs NIS2 Article 21(2)(f) "effectiveness assessment". Even outside finance, expect supervisors to ask for evidence of red-team results on AI components.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Risk Quantification — A Useful Formula</h2>
<p class="l-text">Both directives require risk-based decisions. The classical operational-risk decomposition still applies and is the basis of supervisor expectations:</p>

<div class="katex-block">$$\\text{Risk} = \\text{Likelihood} \\times \\text{Impact}$$</div>

<div class="katex-block">$$\\text{Annual loss expectancy} = \\sum_i p_i \\cdot L_i$$</div>

<p class="l-text">Where p_i is the annualised probability of scenario i and L_i is the loss given that scenario. For AI components: data poisoning, model exfiltration, prompt-injection-driven privilege escalation, vendor outage. Stack the scenarios, monetise the impact, prioritise mitigation by ALE per euro spent.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Where NIS2, DORA, and the AI Act Meet</h2>
<p class="l-text">An AI Act high-risk system that supports a NIS2 essential entity in finance lives under all three frameworks. The good news: the obligations overlap heavily. The bad news: incident reporting hits multiple authorities under different clocks unless you map them.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AI Act Art. 73</div><div class="card-body">Serious incidents to market-surveillance authority + AI Office. Without delay, no later than 15 days (less for fatalities).</div></div>
<div class="calc-card"><div class="card-title">NIS2 Art. 23</div><div class="card-body">Significant cyber incidents — 24h early warning, 72h notification, 1m final to CSIRT/CA.</div></div>
<div class="calc-card"><div class="card-title">DORA Art. 19</div><div class="card-body">Major ICT-related incidents — initial/intermediate/final to financial competent authority.</div></div>
<div class="calc-card"><div class="card-title">GDPR Art. 33</div><div class="card-body">Personal data breach — 72h to supervisory authority + affected individuals.</div></div>
</div>

<p class="l-text">Build a single internal incident-classification routine that emits the right notifications to the right authorities. The fastest clock dominates — the 24h NIS2 early warning often controls the calendar.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Engineering Practice — Resilient AI Stack</h2>
<p class="l-text">Concrete patterns that satisfy all three regimes simultaneously:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Multi-vendor inference</div><div class="card-body">At least two foundation-model providers behind a router. Eliminates single-vendor outages and supports DORA exit-strategy obligations.</div></div>
<div class="calc-card"><div class="card-title">Tenant isolation</div><div class="card-body">Per-customer key encryption of vector stores, RBAC on tools, prompt-template integrity (signed, hash-pinned).</div></div>
<div class="calc-card"><div class="card-title">Decision logs</div><div class="card-body">Every model decision logged with model version, prompt hash, retrieved-doc IDs, output. Satisfies AI Act Art. 12 + NIS2 detection + GDPR access requests.</div></div>
<div class="calc-card"><div class="card-title">Synthetic incident drills</div><div class="card-body">Tabletop a vendor outage, a poisoned embedding, a leaked API key. NIS2 Art. 21(2)(b) effectiveness, DORA Art. 25 testing.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Bridge to Risk Frameworks</h2>
<p class="l-text">NIS2 and DORA tell you to manage risk; NIST AI RMF (next lesson) and ENISA's AI threat landscape tell you <em>how</em> to identify and structure AI-specific risks. ISO/IEC 42001 (L6) closes the loop with a certifiable management system that demonstrates the structure to a supervisor. Skip ahead if you like — but the rest of the track is best read in order, because each layer presupposes the one before.</p>
</div>`,
tr: `<p class="l-text"><strong>AB AI Yasası, altındaki sistemin siber güvenli olduğunu varsayar.</strong> Avrupa'da AI işleten neredeyse her organizasyon için "güvenli"nin pratikte ne anlama geldiğini şimdi iki yatay direktif tanımlıyor: 15 kritik sektör boyunca siber güvenlik için NIS2 (Direktif AB 2022/2555) ve finansal sektörde BİT riski için DORA (Yönetmelik AB 2022/2554). NIS2'nin 17 Ekim 2024'e kadar ulusal hukuka aktarılması gerekiyordu; DORA 17 Ocak 2025'ten beri doğrudan uygulanıyor. Birlikte, bir AI sağlayıcısının artık SecOps ekibinin sorunu olarak göremeyeceği bir siber güvenlik tabanı dayatıyorlar — inşa ettiğiniz her şeyin altındaki yasal zemindir.</p>

<p class="l-text">Bir AI mühendisi için bu soyut değildir. NIS2, temel kuruluşları tedarik zinciri siber güvenliğini yönetmeye zorlar (Madde 21) — temel-model satıcınız, vektör-veritabanı SaaS'ınız ve ince ayar hattınız hepsi kapsamdadır. Olay raporlama saatleri hızlıca tıklar: erken uyarı için 24 saat, bildirim için 72 saat, nihai rapor için 1 ay. DORA daha ileri gider, BİT üçüncü-taraf risk kayıtları ve sözleşmesel denetim hakları talep eder ve 1. kademe finansal kuruluşlar her üç yılda bir tehdit-led penetrasyon testi (TLPT) çalıştırmalıdır. Cezalar NIS2 altında <strong>10 milyon avro veya küresel cironun %2'sine</strong> ulaşır ve DORA altında benzer yüzdeler. Bu ders her iki direktifi de AI altyapı kararlarına haritalar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Organizasyonunuzun NIS2 Ek I/II altında temel mi yoksa önemli mi olduğunu belirleyin</li>
<li>NIS2 Madde 21'in on siber güvenlik risk yönetimi önlemini uygulayın</li>
<li>Olay sınıflandırması yapın ve 24s / 72s / 1ay raporlama zaman çizelgesini karşılayın</li>
<li>DORA'nın beş sütununu uygulayın (BİT riski, olay raporlama, dayanıklılık testi, üçüncü taraf riski, tehdit-istihbarat paylaşımı)</li>
<li>AI tedarik zinciri riskini yönetin: temel-model satıcıları, barındırılan çıkarım, vektör DB, ince ayar verisi</li>
<li>NIS2'yi DORA'dan örtüştükleri yerde ayırt edin (lex specialis: finansal kuruluşlar için DORA üstündür)</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. NIS2 — Kapsam, Sektörler ve İki Düzey</h2>
<p class="l-text">NIS2, orijinal 2016 NIS Direktifi'nin yerini çok daha geniş kapsamla alır. <strong>Temel kuruluşlar</strong> (Ek I): enerji, ulaşım, bankacılık, finansal piyasa altyapısı, sağlık, içme suyu, atık su, dijital altyapı, BİT hizmet yönetimi, kamu yönetimi, uzay. <strong>Önemli kuruluşlar</strong> (Ek II): posta/kurye, atık yönetimi, kimyasallar, gıda, tıbbi cihazlar/bilgisayarlar/elektrikli ekipman/makineler/motorlu araçlar/diğer ulaşım üretimi, dijital sağlayıcılar, araştırma. Birlikte: <em>15 sektör ve AB çapında yaklaşık 160.000 kuruluş</em>, eski NIS çevresinin on katı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Temel kuruluşlar</div><div class="card-body">Proaktif denetim (denetimler, yerinde incelemeler, ad-hoc denetimler). Daha yüksek cezalar: €10M veya küresel cironun %2'sine kadar.</div></div>
<div class="calc-card"><div class="card-title">Önemli kuruluşlar</div><div class="card-body">Reaktif denetim (kanıt sonrası). Daha düşük cezalar: €7M veya küresel cironun %1.4'üne kadar.</div></div>
<div class="calc-card"><div class="card-title">Boyut eşiği</div><div class="card-body">Genellikle orta ve büyük kuruluşlar (≥50 personel veya €10M ciro). Bazı sektörlerin (DNS, TLD, kamu yönetimi) boyut eşiği yoktur.</div></div>
<div class="calc-card"><div class="card-title">Sınır ötesi</div><div class="card-body">Yargı yetkisi normalde ana yerleşim yerindedir. Dijital sağlayıcıların birden fazla yetkili otoritesi olabilir.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">Sağlık, bankacılık veya kamu yönetimine çıkarım API'leri sağlayan bir AI girişimi muhtemelen temel kuruluşlara hizmet eder — ve NIS2 tedarik zinciri maddesi (21.2.d) sizi onların yönetmesi gereken bir sorun, sizin de uymanız gereken bir konu yapar.</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. NIS2 Madde 21 — On Risk Yönetim Önlemi</h2>
<p class="l-text">Madde 21(2), her kapsamlı kuruluşun benimsemesi gereken on siber güvenlik risk yönetim önlemini listeler. Kasıtlı olarak geniştirler — Üye Devletler ve ENISA bunları uygulama tasarruflarıyla detaylandırır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">a) Risk analizi ve ISMS politikası</div><div class="card-body">Risk analizinde sabitlenmiş, belgelenmiş bilgi güvenliği politikası. ISO 27001 ile uyumlu (ders L6).</div></div>
<div class="calc-card"><div class="card-title">b) Olay yönetimi</div><div class="card-body">Tespit, yanıt, kurtarma. Runbook'lar, on-call rotasyonu, masaüstü egzersizleri.</div></div>
<div class="calc-card"><div class="card-title">c) İş sürekliliği</div><div class="card-body">Yedeklemeler, DR, kriz yönetimi. RTO ve RPO belgelenmiş.</div></div>
<div class="calc-card"><div class="card-title">d) Tedarik zinciri güvenliği</div><div class="card-body">Satıcı risk değerlendirmesi, sözleşmesel güvenlik maddeleri, satıcı siber duruşunun izlenmesi.</div></div>
<div class="calc-card"><div class="card-title">e) Güvenli edinim, geliştirme, bakım</div><div class="card-body">SDLC kontrolleri, güvenlik açığı yönetimi, güvenli kodlama, üçüncü taraf kütüphaneler.</div></div>
<div class="calc-card"><div class="card-title">f) Etkinlik değerlendirmesi</div><div class="card-body">Kontrolleri test edin. Pen-test, red-team, denetim.</div></div>
<div class="calc-card"><div class="card-title">g) Siber hijyen ve eğitim</div><div class="card-body">Üst yönetim dahil zorunlu eğitim. Phishing simülasyonları.</div></div>
<div class="calc-card"><div class="card-title">h) Kriptografi</div><div class="card-body">Kripto kullanımı ve yönetimi politikası. Anahtar rotasyonu, algoritma sonlandırma.</div></div>
<div class="calc-card"><div class="card-title">i) İK, erişim, varlık yönetimi</div><div class="card-body">Onboarding/offboarding, RBAC/ABAC, varlık envanteri.</div></div>
<div class="calc-card"><div class="card-title">j) MFA, güvenli iletişim, güvenli acil iletişim</div><div class="card-body">Çok faktörlü kimlik doğrulama, şifreli e-posta/ses, olaylar için bant dışı kanallar.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>Kişisel sorumluluk:</strong> NIS2 Madde 20 <em>yönetim organlarını</em> sorumlu tutar. Yaptırımlar, tekrarlanan uyumsuzluk için yöneticilik fonksiyonlarında geçici yasaklar içerebilir. CISO artık iğnenin ucundaki tek kişi değildir.</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. 24 / 72 / 30 Raporlama Saati</h2>
<p class="l-text">"Önemli olay" — ciddi operasyonel kesintiye, finansal kayba neden olan veya başkalarını maddi hasar yoluyla etkileyen — Madde 23 altında sıkı bir saati tetikler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">24 saat — Erken uyarı</div><div class="card-body">CSIRT / yetkili otoriteyi bilgilendirin. Şüpheli kötü niyetli sebebi, sınır ötesi etkiyi belirtin.</div></div>
<div class="calc-card"><div class="card-title">72 saat — Olay bildirimi</div><div class="card-body">İlk değerlendirme, ciddiyet ve etki, uzlaşma göstergeleri ile güncelleyin.</div></div>
<div class="calc-card"><div class="card-title">1 ay — Nihai rapor</div><div class="card-body">Ayrıntılı tanımlama, kök neden, uygulanan azaltımlar, sınır ötesi etki.</div></div>
<div class="calc-card"><div class="card-title">Ara rapor</div><div class="card-body">Olay 1 ayda devam ediyorsa, bunun yerine ara rapor ve çözümde nihai.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># NIS2 olay sınıflandırma — etiketli özelliklerde küçük bir LogReg eğit</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

<span class="cm"># Özellikler: [users_affected_log, hours_down, financial_eur_log,</span>
<span class="cm">#            cross_border, malicious_suspected]</span>
X = np.<span class="fn">array</span>([
  [np.<span class="fn">log1p</span>(<span class="num">50</span>),     <span class="num">0.5</span>, np.<span class="fn">log1p</span>(1_000),       <span class="num">0</span>, <span class="num">0</span>],   <span class="cm"># önemli değil</span>
  [np.<span class="fn">log1p</span>(2_000),  <span class="num">3.0</span>, np.<span class="fn">log1p</span>(80_000),      <span class="num">0</span>, <span class="num">1</span>],   <span class="cm"># önemli</span>
  [np.<span class="fn">log1p</span>(50_000), <span class="num">12.0</span>,np.<span class="fn">log1p</span>(2_500_000),   <span class="num">1</span>, <span class="num">1</span>],   <span class="cm"># önemli</span>
  [np.<span class="fn">log1p</span>(<span class="num">200</span>),    <span class="num">1.0</span>, np.<span class="fn">log1p</span>(5_000),       <span class="num">0</span>, <span class="num">0</span>],   <span class="cm"># önemli değil</span>
  [np.<span class="fn">log1p</span>(10_000), <span class="num">6.0</span>, np.<span class="fn">log1p</span>(150_000),     <span class="num">1</span>, <span class="num">1</span>],   <span class="cm"># önemli</span>
  [np.<span class="fn">log1p</span>(<span class="num">5</span>),      <span class="num">0.2</span>, np.<span class="fn">log1p</span>(<span class="num">0</span>),           <span class="num">0</span>, <span class="num">0</span>],   <span class="cm"># önemli değil</span>
])
y = np.<span class="fn">array</span>([<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>])
sc = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X); Xs = sc.<span class="fn">transform</span>(X)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xs, y)

incidents = np.<span class="fn">array</span>([
  [np.<span class="fn">log1p</span>(<span class="num">800</span>),  <span class="num">2.0</span>, np.<span class="fn">log1p</span>(20_000), <span class="num">0</span>, <span class="num">1</span>],
  [np.<span class="fn">log1p</span>(<span class="num">3</span>),    <span class="num">0.1</span>, np.<span class="fn">log1p</span>(<span class="num">0</span>),      <span class="num">0</span>, <span class="num">0</span>],
  [np.<span class="fn">log1p</span>(100_000), <span class="num">24.0</span>, np.<span class="fn">log1p</span>(10_000_000), <span class="num">1</span>, <span class="num">1</span>],
])
preds = clf.<span class="fn">predict</span>(sc.<span class="fn">transform</span>(incidents))
labels = [<span class="str">"not significant"</span>, <span class="str">"SIGNIFICANT — start 24h clock"</span>]
<span class="kw">for</span> inc, p <span class="kw">in</span> <span class="fn">zip</span>(incidents, preds):
    <span class="fn">print</span>(inc, <span class="str">"-&gt;"</span>, labels[p])</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) bir sklearn LogisticRegression eğitir — girdilere göre gradyanı tam olarak ağırlık vektörü olan lineer bir taban modeli. 3) NIST AI RMF Govern → Map → Measure → Manage döngüsünü yürür ve her adımı ürettiği artefaktla işaretler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">numpy + scikit-learn önceden yüklü. Model gösteri amaçlıdır; gerçek sınıflandırma uygulama tasarruf kriterlerini kullanır ama akış aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. DORA — Beş Sütun</h2>
<p class="l-text">DORA (Yönetmelik AB 2022/2554) finansal kuruluşlara — bankalar, sigortacılar, yatırım firmaları, kripto-varlık servis sağlayıcıları, merkezi karşı taraflar, işlem mekanları — ve hyperscaler'lar ile AI-platform satıcılarını içerebilen kritik BİT üçüncü-taraf sağlayıcılarına (CTPP'ler) uygulanır. Beş sütun üzerine inşa edilmiştir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. BİT risk yönetimi (Md. 5-16)</div><div class="card-body">Yönetişim, tanımlama, koruma, tespit, yanıt, kurtarma, öğrenme, iletişim. Yönetim kurulu seviyesinde hesap verebilirlik.</div></div>
<div class="calc-card"><div class="card-title">2. BİT olay raporlama (Md. 17-23)</div><div class="card-body">Yetkili otorite üzerinden tek uyumlulaştırılmış raporlama çerçevesi. İlk / ara / nihai raporlar.</div></div>
<div class="calc-card"><div class="card-title">3. Dijital operasyonel dayanıklılık testi (Md. 24-27)</div><div class="card-body">Yıllık test programı. Önemli kuruluşlar için her 3 yılda bir tehdit-led penetrasyon testi (TLPT) — TIBER-EU çerçevesi.</div></div>
<div class="calc-card"><div class="card-title">4. BİT üçüncü-taraf riski (Md. 28-44)</div><div class="card-body">Sözleşme düzenlemeleri hakkında bilgi kaydı. Zorunlu sözleşme maddeleri. ESA'lar tarafından kritik TPP belirlemesi onları doğrudan denetime tabi kılar.</div></div>
<div class="calc-card"><div class="card-title">5. Bilgi paylaşımı (Md. 45)</div><div class="card-body">Finansal kuruluşlar arasında gönüllü siber tehdit-istihbarat paylaşım düzenlemeleri.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem"><strong>Lex specialis:</strong> DORA ve NIS2'nin örtüştüğü yerde, finansal kuruluşlar için DORA üstündür (NIS2 Resital 28). DORA ayrıca NIS2'nin finansal-sektör kapsamında olmayan kuruluşlara da uzanır (ör. MiCA altındaki kripto-varlık servis sağlayıcıları).</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Pratikte AI Tedarik Zinciri Riski</h2>
<p class="l-text">2026'daki çoğu AI ürünü üçüncü-taraf hizmetlerden oluşan yığınlardır: bir temel-model API'si, bir vektör DB, bir gömme modeli, bir çıkarım platformu, bir ince ayar veri komisyoncusu, gözlemlenebilirlik satıcıları. NIS2 Md. 21(2)(d) ve DORA Madde 28-30 güvenlik çevresini dışarı iter — tedarikçinizin ihlali sizin olayınızdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

vendors = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"OpenAI Inc."</span>,        <span class="str">"Foundation model API"</span>,     <span class="str">"critical"</span>, <span class="str">"SOC2-T2"</span>,<span class="str">"2024-09-01"</span>, <span class="kw">True</span>,  <span class="str">"US"</span>,  <span class="str">"DPF"</span>),
  (<span class="str">"Anthropic PBC"</span>,      <span class="str">"Foundation model API"</span>,     <span class="str">"critical"</span>, <span class="str">"SOC2-T2"</span>,<span class="str">"2024-11-15"</span>, <span class="kw">True</span>,  <span class="str">"US"</span>,  <span class="str">"SCC"</span>),
  (<span class="str">"Pinecone Systems"</span>,   <span class="str">"Vector database"</span>,          <span class="str">"high"</span>,     <span class="str">"SOC2-T2"</span>,<span class="str">"2024-08-01"</span>, <span class="kw">True</span>,  <span class="str">"US"</span>,  <span class="str">"SCC"</span>),
  (<span class="str">"Hugging Face SAS"</span>,   <span class="str">"Model registry"</span>,           <span class="str">"medium"</span>,   <span class="str">"ISO27001"</span>,<span class="str">"2024-10-01"</span>,<span class="kw">True</span>,  <span class="str">"EU"</span>,  <span class="str">"n/a"</span>),
  (<span class="str">"Modal Labs"</span>,         <span class="str">"GPU inference"</span>,            <span class="str">"high"</span>,     <span class="str">"SOC2-T1"</span>,<span class="str">"2025-01-10"</span>, <span class="kw">False</span>, <span class="str">"US"</span>,  <span class="str">"SCC"</span>),
  (<span class="str">"Snowflake Inc."</span>,     <span class="str">"Data warehouse"</span>,           <span class="str">"critical"</span>, <span class="str">"ISO27001"</span>,<span class="str">"2024-07-20"</span>,<span class="kw">True</span>, <span class="str">"EU/US"</span>,<span class="str">"SCC"</span>),
], columns=[<span class="str">"vendor"</span>,<span class="str">"service"</span>,<span class="str">"criticality"</span>,<span class="str">"attestation"</span>,<span class="str">"last_review"</span>,<span class="str">"ai_act_aligned"</span>,<span class="str">"data_loc"</span>,<span class="str">"transfer"</span>])

<span class="cm"># Boşluk analizi</span>
gaps = vendors[(vendors.criticality.<span class="fn">isin</span>([<span class="str">"critical"</span>,<span class="str">"high"</span>])) & (vendors.ai_act_aligned == <span class="kw">False</span>)]
overdue = vendors[pd.<span class="fn">to_datetime</span>(vendors.last_review) &lt; pd.<span class="fn">Timestamp</span>(<span class="str">"2024-11-01"</span>)]

<span class="fn">print</span>(<span class="str">"Vendor register:\\n"</span>, vendors.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nNon-aligned critical/high vendors:\\n"</span>, gaps.<span class="fn">to_string</span>(index=<span class="kw">False</span>))
<span class="fn">print</span>(<span class="str">"\\nReviews older than 6 months:\\n"</span>, overdue.<span class="fn">to_string</span>(index=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) NIST AI RMF Govern → Map → Measure → Manage döngüsünü yürür ve her adımı ürettiği artefaktla işaretler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas önceden yüklü. DORA Md. 28(3)'ün gerektirdiği Bilgi Kaydı, ESA'ların XML şemasında dışa aktarılmış halde aslında bu DataFrame'e benzer.</p>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Tehdit-Led Penetrasyon Testi (TLPT)</h2>
<p class="l-text">Önemli DORA kuruluşları için, tehdit-led penetrasyon testleri TIBER-EU çerçevesini kullanarak her üç yılda bir üretim sistemleri üzerinde çalışır. Test, gerçekçi saldırganları profilleyen bir tehdit-istihbarat sağlayıcısı ve senaryoyu yürüten bir red-team ile kritik fonksiyonlara karşı gerçek düşmanları (APT tarzı) simüle eder. Kritik finansal fonksiyonları destekleyen AI çıkarım sistemleri açıkça kapsamdadır: model katmanında prompt enjeksiyonu, gömme deposunun veri zehirlemesi ve tool çağrıları aracılığıyla sızdırma hepsi test menüsündedir.</p>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">TIBER-EU ayrıca NIS2 Madde 21(2)(f) "etkinlik değerlendirmesi"ni de bilgilendirir. Finans dışında bile, denetçilerin AI bileşenleri üzerindeki red-team sonuçlarının kanıtını isteyeceğini bekleyin.</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Risk Niceliği — Yararlı Bir Formül</h2>
<p class="l-text">Her iki direktif de risk tabanlı kararlar gerektirir. Klasik operasyonel-risk ayrıştırması hâlâ uygulanır ve denetçi beklentilerinin temelidir:</p>

<div class="katex-block">$$\\text{Risk} = \\text{Likelihood} \\times \\text{Impact}$$</div>

<div class="katex-block">$$\\text{Annual loss expectancy} = \\sum_i p_i \\cdot L_i$$</div>

<p class="l-text">Burada p_i, senaryo i'nin yıllık olasılığı ve L_i o senaryo verildiğinde kayıptır. AI bileşenleri için: veri zehirleme, model sızdırma, prompt-enjeksiyon kaynaklı yetki yükseltme, satıcı kesintisi. Senaryoları yığın, etkiyi parasallaştırın, harcanan euro başına ALE'ye göre azaltıma öncelik verin.</p>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. NIS2, DORA ve AI Yasası'nın Buluştuğu Yer</h2>
<p class="l-text">Finansta NIS2 temel kuruluşunu destekleyen bir AI Yasası yüksek-risk sistemi üç çerçevenin de altında yaşar. İyi haber: yükümlülükler büyük ölçüde örtüşür. Kötü haber: olay raporlama, eşlemediğiniz sürece farklı saatler altında birden fazla otoriteye çarpar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AI Yasası Md. 73</div><div class="card-body">Piyasa-gözetim otoritesine + AI Ofisi'ne ciddi olaylar. Gecikmesiz, en geç 15 gün içinde (ölümler için daha az).</div></div>
<div class="calc-card"><div class="card-title">NIS2 Md. 23</div><div class="card-body">Önemli siber olaylar — 24s erken uyarı, 72s bildirim, 1ay nihai CSIRT/CA'ya.</div></div>
<div class="calc-card"><div class="card-title">DORA Md. 19</div><div class="card-body">Büyük BİT-ilgili olaylar — finansal yetkili otoriteye ilk/ara/nihai.</div></div>
<div class="calc-card"><div class="card-title">GDPR Md. 33</div><div class="card-body">Kişisel veri ihlali — denetim otoritesine + etkilenen bireylere 72s.</div></div>
</div>

<p class="l-text">Doğru otoritelere doğru bildirimleri yayan tek bir dahili olay-sınıflandırma rutini inşa edin. En hızlı saat baskındır — 24s NIS2 erken uyarı genellikle takvimi kontrol eder.</p>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Mühendislik Pratiği — Dayanıklı AI Yığını</h2>
<p class="l-text">Üç rejimi aynı anda karşılayan somut desenler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çoklu satıcı çıkarımı</div><div class="card-body">Bir router'ın arkasında en az iki temel-model sağlayıcı. Tek satıcı kesintilerini ortadan kaldırır ve DORA çıkış-stratejisi yükümlülüklerini destekler.</div></div>
<div class="calc-card"><div class="card-title">Kiracı izolasyonu</div><div class="card-body">Vektör depolarının müşteri başına anahtar şifrelemesi, tool'larda RBAC, prompt-template bütünlüğü (imzalı, hash sabitlenmiş).</div></div>
<div class="calc-card"><div class="card-title">Karar logları</div><div class="card-body">Her model kararı model sürümü, prompt hash, getirilen-doc ID'leri, çıktı ile loglanır. AI Yasası Md. 12 + NIS2 tespit + GDPR erişim isteklerini karşılar.</div></div>
<div class="calc-card"><div class="card-title">Sentetik olay tatbikatları</div><div class="card-body">Bir satıcı kesintisi, zehirli bir gömme, sızdırılmış bir API anahtarı için masaüstü tatbikatı. NIS2 Md. 21(2)(b) etkinlik, DORA Md. 25 testi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10-tr">
<h2 class="lesson-title">10. Risk Çerçevelerine Köprü</h2>
<p class="l-text">NIS2 ve DORA size riski yönetmenizi söyler; NIST AI RMF (sonraki ders) ve ENISA'nın AI tehdit manzarası AI'ya özgü riskleri <em>nasıl</em> tanımlayıp yapılandıracağınızı söyler. ISO/IEC 42001 (L6) yapıyı bir denetçiye gösteren sertifikalanabilir bir yönetim sistemiyle döngüyü kapatır. İsterseniz atlayın — ama track'in geri kalanı sırayla okumaya en uygun, çünkü her katman öncekini varsayar.</p>
</div>`
};
