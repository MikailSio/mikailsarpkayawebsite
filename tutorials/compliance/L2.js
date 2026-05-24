window.COMPLIANCE_L2 = {
en: `<p class="l-text"><strong>The EU AI Act (Regulation EU 2024/1689) is the world's first comprehensive horizontal AI law.</strong> It was published in the Official Journal on 12 July 2024, entered into force on 1 August 2024, and rolls out in phases through August 2027. Its central insight is that AI risk is not uniform: chatbot toys and predictive policing should not be governed identically. The Act therefore sorts AI systems into four risk tiers — <em>unacceptable, high, limited, minimal</em> — and attaches obligations proportional to the tier. On top of that pyramid sits a separate regime for General-Purpose AI (GPAI) models, with stricter rules for systemic-risk models above 10²⁵ floating-point operations of training compute (a threshold that, as of mid-2024, captures GPT-4-class and above).</p>

<p class="l-text">Penalties dwarf even GDPR: up to <strong>€35 million or 7% of global annual turnover</strong> for prohibited practices, €15M / 3% for high-risk obligations, €7.5M / 1% for misleading information to authorities. SMEs get proportionate caps. Critically, the Act applies extraterritorially: a US company whose system's output is used in the EU is in scope. This lesson walks the risk pyramid, the GPAI regime, conformity assessment, the timeline, and the enforcement architecture (national market-surveillance authorities + the new EU AI Office in DG CNECT). By the end you should be able to look at any AI product and place it on the pyramid in under sixty seconds.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Classify any AI system into the four risk tiers using Articles 5, 6, 50, 52</li>
<li>Apply the Annex III list of high-risk areas (HR, credit, insurance, law enforcement, migration, education, biometrics)</li>
<li>Walk the high-risk obligations: risk management, data governance, technical documentation, transparency, human oversight, accuracy/robustness/cybersecurity</li>
<li>Distinguish GPAI from GPAI-with-systemic-risk and identify the 10²⁵ FLOP threshold</li>
<li>Read the timeline: prohibitions Feb 2025, GPAI Aug 2025, high-risk Aug 2026, embedded high-risk Aug 2027</li>
<li>Estimate maximum fines for given turnover and breach category</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Risk Pyramid — Articles 5, 6, 50</h2>
<p class="l-text">The Act's architecture is a pyramid. At the top, a small set of practices is <strong>prohibited outright</strong> (Article 5): subliminal manipulation, exploitation of vulnerabilities, social scoring by public authorities, predictive policing based solely on profiling, untargeted scraping for face-recognition databases, emotion inference in workplaces and schools, real-time remote biometric identification in public for law enforcement (with narrow exceptions), and biometric categorisation by sensitive attributes. These are not high-risk-with-conditions; they are off the table.</p>

<p class="l-text">Below that sit <strong>high-risk</strong> systems (Article 6 + Annex III), which are allowed but heavily regulated. Then <strong>limited-risk</strong> systems (Article 50) — chatbots, deepfakes, emotion recognition outside the prohibited contexts — which carry transparency duties only. The bottom of the pyramid is <strong>minimal-risk</strong> AI: spam filters, recommendation engines for music, NPC behaviour in games. The Act explicitly says nothing prevents voluntary codes of conduct here.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Unacceptable risk (Art. 5)</div><div class="card-body">Banned. Eight categories. Applies from 2 February 2025.</div></div>
<div class="calc-card"><div class="card-title">High risk (Art. 6 + Annex III)</div><div class="card-body">Permitted with conformity assessment, technical documentation, registration in EU database, post-market monitoring.</div></div>
<div class="calc-card"><div class="card-title">Limited risk (Art. 50)</div><div class="card-body">Transparency only: tell users they are interacting with AI; label deepfakes; mark synthetic media.</div></div>
<div class="calc-card"><div class="card-title">Minimal risk</div><div class="card-body">No mandatory rules. Voluntary codes encouraged.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Annex III — The High-Risk Catalogue</h2>
<p class="l-text">Annex III lists eight domains where AI is presumed high-risk. Memorise this list — it is the single most-cited reference in EU AI compliance work.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Biometrics</div><div class="card-body">Remote identification (where not banned), categorisation, emotion recognition. Art. 5 exclusions still apply.</div></div>
<div class="calc-card"><div class="card-title">2. Critical infrastructure</div><div class="card-body">Safety components in road traffic, water, gas, electricity, digital infrastructure.</div></div>
<div class="calc-card"><div class="card-title">3. Education &amp; vocational training</div><div class="card-body">Admission, assessment, placement, behaviour monitoring during exams.</div></div>
<div class="calc-card"><div class="card-title">4. Employment &amp; HR</div><div class="card-body">Hiring (CV screening, interview scoring), promotion, task allocation, performance monitoring.</div></div>
<div class="calc-card"><div class="card-title">5. Essential services</div><div class="card-body">Credit scoring (except for fraud), insurance pricing for life/health, public-benefit eligibility, emergency dispatch triage.</div></div>
<div class="calc-card"><div class="card-title">6. Law enforcement</div><div class="card-body">Risk assessment of victims/offenders, evidence reliability, profiling, crime analytics.</div></div>
<div class="calc-card"><div class="card-title">7. Migration &amp; border control</div><div class="card-body">Risk assessment, visa application processing, asylum and border-management decisions.</div></div>
<div class="calc-card"><div class="card-title">8. Justice &amp; democracy</div><div class="card-body">Assisting judicial authorities, influencing voting and election outcomes.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">There is also Article 6(1): if the AI is a safety component of a product covered by EU harmonisation legislation listed in Annex I (machinery, toys, lifts, medical devices, automotive, aviation, etc.), it is automatically high-risk. This is the "embedded" lane.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. High-Risk Obligations — Articles 8 to 27</h2>
<p class="l-text">A high-risk system has eight pillars of obligation:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Risk management (Art. 9)</div><div class="card-body">Continuous, iterative process across the lifecycle. Identify, estimate, evaluate risks; adopt mitigations; test residual risk.</div></div>
<div class="calc-card"><div class="card-title">Data governance (Art. 10)</div><div class="card-body">Training/validation/test sets must be relevant, representative, free of errors, complete; bias examined; statistical properties documented.</div></div>
<div class="calc-card"><div class="card-title">Technical documentation (Art. 11 + Annex IV)</div><div class="card-body">Detailed dossier: design, architecture, training data, performance metrics, known limitations. Kept up to date.</div></div>
<div class="calc-card"><div class="card-title">Record-keeping (Art. 12)</div><div class="card-body">Automatic logs of inputs, outputs, decisions during operation. Sufficient to enable post-market monitoring.</div></div>
<div class="calc-card"><div class="card-title">Transparency (Art. 13)</div><div class="card-body">Instructions for use enabling deployers to interpret outputs and use the system safely.</div></div>
<div class="calc-card"><div class="card-title">Human oversight (Art. 14)</div><div class="card-body">Designed so that natural persons can effectively oversee. Includes the ability to override, stop, or interpret.</div></div>
<div class="calc-card"><div class="card-title">Accuracy, robustness, cybersecurity (Art. 15)</div><div class="card-body">Levels of accuracy declared, resilience to errors and adversarial attacks (data poisoning, model evasion).</div></div>
<div class="calc-card"><div class="card-title">QMS, conformity, registration (Art. 17, 43, 49)</div><div class="card-body">Quality management system, conformity assessment (mostly self-assessment, third-party for some biometric uses), CE marking, registration in the EU database.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. A Risk-Tier Classifier in Code</h2>
<p class="l-text">The risk classification can be encoded as a small decision tree on system features. We will fit a sklearn DecisionTree on a synthesised set of labelled examples — a useful sanity check that your tier-mapping logic is consistent and that two engineers in the same company will land on the same tier for the same product.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier, export_text

<span class="cm"># Features: [bans, annex_iii, safety_component, transparency_only, none]</span>
<span class="cm"># Tiers:    0=prohibited 1=high 2=limited 3=minimal</span>
data = [
  <span class="cm"># subliminal manipulation, social scoring, real-time RBI -&gt; prohibited</span>
  ([<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">0</span>),
  ([<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">0</span>),
  <span class="cm"># CV screener, credit score, exam proctoring -&gt; high</span>
  ([<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">1</span>),
  ([<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">1</span>),
  ([<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">1</span>),
  <span class="cm"># AI-controlled brake assist (safety component, Annex I) -&gt; high</span>
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">1</span>),
  <span class="cm"># chatbot, deepfake-labelling, emotion recognition (non-prohibited) -&gt; limited</span>
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>], <span class="num">2</span>),
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>], <span class="num">2</span>),
  <span class="cm"># spam filter, music recommender, NPC AI -&gt; minimal</span>
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>], <span class="num">3</span>),
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>], <span class="num">3</span>),
]
X = np.<span class="fn">array</span>([d[<span class="num">0</span>] <span class="kw">for</span> d <span class="kw">in</span> data]); y = np.<span class="fn">array</span>([d[<span class="num">1</span>] <span class="kw">for</span> d <span class="kw">in</span> data])
clf = <span class="fn">DecisionTreeClassifier</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(<span class="fn">export_text</span>(clf, feature_names=[<span class="str">"banned"</span>,<span class="str">"annex_iii"</span>,<span class="str">"safety_comp"</span>,<span class="str">"transparency"</span>,<span class="str">"none"</span>]))

unknown = np.<span class="fn">array</span>([
  [<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],   <span class="cm"># hiring AI</span>
  [<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],   <span class="cm"># untargeted face scraping</span>
  [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>],   <span class="cm"># GPT-style chatbot</span>
  [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>],   <span class="cm"># spam filter</span>
])
<span class="fn">print</span>(<span class="str">"Predicted tiers:"</span>, clf.<span class="fn">predict</span>(unknown))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) calls into scikit-learn for the modelling step. 3) classifies a system into the EU AI Act tier (prohibited / high-risk / limited / minimal) and lists the obligations that follow.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">numpy + scikit-learn are pre-loaded. The tree is trivial; the value is in encoding tier-mapping rules in a way you can version-control and audit.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. General-Purpose AI Models — Articles 51 to 55</h2>
<p class="l-text">A separate regime applies to GPAI models — foundation models that can serve many downstream purposes. Every GPAI model has baseline obligations: technical documentation (Annex XI), information for downstream providers (Annex XII), copyright policy, training-data summary.</p>

<p class="l-text">A GPAI model is presumed to have <strong>systemic risk</strong> when its training compute exceeds <strong>10²⁵ floating-point operations</strong> (Article 51). The Commission can also designate models that fall below the threshold but show high-impact capabilities. Systemic-risk GPAI carries additional obligations: model evaluations including adversarial testing, systemic-risk assessment and mitigation, serious-incident reporting to the AI Office, and adequate cybersecurity. The list of designated systemic-risk models is maintained by the AI Office.</p>

<div class="katex-block">$$\\text{GPAI training compute threshold} \\;=\\; 10^{25} \\text{ FLOP}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">All GPAI</div><div class="card-body">Tech docs (Annex XI), downstream-provider info (Annex XII), copyright policy aligned with Directive 2019/790, training-data summary.</div></div>
<div class="calc-card"><div class="card-title">Systemic-risk GPAI</div><div class="card-body">Model evaluation per state-of-the-art protocols, adversarial testing, systemic-risk assessment + mitigation, serious-incident reporting, cybersecurity.</div></div>
<div class="calc-card"><div class="card-title">Open-source carve-out</div><div class="card-body">Free and open-source GPAI is exempt from some obligations unless it is systemic-risk. The "weights are public" carve-out has limits.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Conformity Assessment and CE Marking</h2>
<p class="l-text">Most high-risk systems undergo <strong>internal conformity assessment</strong> (Annex VI) — the provider self-certifies, signs an EU declaration of conformity, and affixes the CE mark. Third-party assessment (Annex VII) is required only for some biometric-related Annex III systems where harmonised standards do not yet exist or have not been fully applied. After CE marking, the provider registers the system in the EU AI database (Article 71) and runs post-market monitoring (Article 72).</p>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">Harmonised standards — being drafted by CEN-CENELEC JTC 21 — provide a presumption of conformity. Aligning with ISO/IEC 42001 (lesson L6) is the fastest path to that presumption when the harmonised standards land.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Timeline — When Each Rule Bites</h2>
<p class="l-text">The Act phases in obligations rather than a big-bang activation. Engineering and legal teams need different milestones in their calendars.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
timeline = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"2024-08-01"</span>,<span class="str">"Entry into force"</span>,<span class="str">"Regulation EU 2024/1689 published 12 July, in force 1 Aug"</span>),
  (<span class="str">"2025-02-02"</span>,<span class="str">"Prohibitions apply"</span>,<span class="str">"Art. 5 bans + AI literacy obligation Art. 4"</span>),
  (<span class="str">"2025-08-02"</span>,<span class="str">"GPAI rules apply"</span>,<span class="str">"Art. 51-55 + AI Office governance + penalties Art. 99"</span>),
  (<span class="str">"2026-08-02"</span>,<span class="str">"High-risk Annex III rules apply"</span>,<span class="str">"Art. 6(2) + Annex III systems must be conformant"</span>),
  (<span class="str">"2027-08-02"</span>,<span class="str">"High-risk embedded rules apply"</span>,<span class="str">"Art. 6(1) + Annex I (medical, automotive, etc.)"</span>),
  (<span class="str">"2030-08-02"</span>,<span class="str">"Legacy carve-outs end"</span>,<span class="str">"Pre-existing high-risk public-sector systems must be brought into compliance"</span>),
], columns=[<span class="str">"date"</span>,<span class="str">"milestone"</span>,<span class="str">"scope"</span>])
<span class="fn">print</span>(timeline.<span class="fn">to_string</span>(index=<span class="kw">False</span>))

today = pd.<span class="fn">Timestamp</span>(<span class="str">"2026-05-04"</span>)
upcoming = timeline[pd.<span class="fn">to_datetime</span>(timeline.date) &gt;= today]
<span class="fn">print</span>(<span class="str">"\\nFrom today ("</span>, today.<span class="fn">date</span>(), <span class="str">") onwards:"</span>)
<span class="fn">print</span>(upcoming.<span class="fn">to_string</span>(index=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) classifies a system into the EU AI Act tier (prohibited / high-risk / limited / minimal) and lists the obligations that follow.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas is pre-loaded. Useful when you want to filter "what bites in the next 6 months" against a roadmap.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Penalties — Article 99</h2>
<p class="l-text">Three tiers of fines, with the higher of an absolute cap or a percentage of global annual turnover:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prohibited practices (Art. 5)</div><div class="card-body"><strong>€35M / 7%</strong> of global turnover. The headline number that beats GDPR's 4%.</div></div>
<div class="calc-card"><div class="card-title">High-risk &amp; GPAI obligations</div><div class="card-body">€15M / 3% of global turnover. Covers most operational breaches.</div></div>
<div class="calc-card"><div class="card-title">Misleading information</div><div class="card-body">€7.5M / 1% for incorrect, incomplete, or misleading information to authorities or notified bodies.</div></div>
<div class="calc-card"><div class="card-title">SME proportionality</div><div class="card-body">For SMEs and start-ups, the lower of the absolute cap or the percentage applies — instead of "whichever is higher".</div></div>
</div>

<div class="katex-block">$$\\text{Fine}_\\text{max} = \\max(\\text{cap}_{\\text{EUR}},\\ \\text{turnover} \\times \\text{rate}) \\quad \\text{(SME: min instead of max)}$$</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Governance and Enforcement</h2>
<p class="l-text">Three layers: (1) the <strong>EU AI Office</strong> inside DG CNECT, responsible for GPAI supervision and pan-EU coordination; (2) <strong>national market-surveillance authorities</strong> in each Member State, designated by mid-2025; (3) the <strong>European AI Board</strong> of Member-State representatives plus an AI Scientific Panel of independent experts. The AI Office issued the GPAI Code of Practice in 2025 (Cedric Villani &amp; Yoshua Bengio chaired drafting).</p>

<p class="l-text">Whistleblower protection (Directive EU 2019/1937) applies — internal staff who report breaches are shielded. National authorities cooperate via the Single Information Point. Cross-border cases route through the AI Board for harmonised positions.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Engineering Takeaways</h2>
<p class="l-text">If you ship AI in the EU, three habits will keep you out of trouble: (a) <em>tier the system on day one</em> — write a one-page Article 6 / Annex III memo before any sprint planning; (b) <em>pre-build the high-risk evidence pack</em> — Annex IV is a known shape, populate it as you build, do not retrofit it three weeks before launch; (c) <em>keep a CE-mark calendar</em> — registration in the EU database, declaration of conformity, and post-market monitoring are not paperwork, they are gates. The next lesson (NIS2 + DORA) covers the cybersecurity baseline that the AI Act assumes you already have.</p>
</div>`,
tr: `<p class="l-text"><strong>AB AI Yasası (Yönetmelik AB 2024/1689) dünyanın ilk kapsamlı yatay AI yasasıdır.</strong> 12 Temmuz 2024'te Resmi Gazete'de yayımlandı, 1 Ağustos 2024'te yürürlüğe girdi ve Ağustos 2027'ye kadar aşamalarla devreye girer. Merkezi sezgisi, AI riskinin tek tip olmadığıdır: chatbot oyuncakları ile öngörücü polislik aynı şekilde yönetilmemelidir. Yasa bu nedenle AI sistemlerini dört risk düzeyine ayırır — <em>kabul edilemez, yüksek, sınırlı, minimum</em> — ve düzeyle orantılı yükümlülükler iliştirir. Bu piramidin üstünde, Genel Amaçlı AI (GPAI) modelleri için ayrı bir rejim oturur, 10²⁵ kayan-nokta eğitim hesaplamasının üzerindeki sistemik-risk modelleri için daha sıkı kurallarla (2024 ortası itibarıyla GPT-4 sınıfı ve üzerini yakalayan bir eşik).</p>

<p class="l-text">Cezalar GDPR'yi bile gölgede bırakır: yasaklanmış uygulamalar için <strong>35 milyon avro veya küresel yıllık cironun %7'sine</strong> kadar, yüksek-risk yükümlülükleri için 15M / %3, otoritelere yanıltıcı bilgi için 7.5M / %1. KOBİ'ler orantılı sınırlar alır. Önemlisi, Yasa ülke dışı uygulanır: çıktısı AB'de kullanılan bir ABD şirketinin sistemi kapsamdadır. Bu ders risk piramidini, GPAI rejimini, uygunluk değerlendirmesini, zaman çizelgesini ve yaptırım mimarisini (ulusal piyasa-gözetim otoriteleri + DG CNECT içindeki yeni AB AI Ofisi) yürütür. Sonunda herhangi bir AI ürününe bakıp altmış saniyenin altında piramit üzerinde yerleştirebilmelisiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Madde 5, 6, 50, 52'yi kullanarak herhangi bir AI sistemini dört risk düzeyine sınıflandırın</li>
<li>Ek III yüksek-risk alan listesini uygulayın (İK, kredi, sigorta, yargı, göç, eğitim, biyometri)</li>
<li>Yüksek-risk yükümlülüklerini yürüyün: risk yönetimi, veri yönetişimi, teknik dokümantasyon, şeffaflık, insan denetimi, doğruluk/sağlamlık/siber güvenlik</li>
<li>GPAI'yi sistemik-riskli GPAI'den ayırt edin ve 10²⁵ FLOP eşiğini tanıyın</li>
<li>Zaman çizelgesini okuyun: yasaklar Şub 2025, GPAI Ağu 2025, yüksek-risk Ağu 2026, gömülü yüksek-risk Ağu 2027</li>
<li>Verilen ciro ve ihlal kategorisi için maksimum cezaları tahmin edin</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. Risk Piramidi — Madde 5, 6, 50</h2>
<p class="l-text">Yasanın mimarisi bir piramittir. Tepede, küçük bir uygulama kümesi <strong>tamamen yasaktır</strong> (Madde 5): bilinçaltı manipülasyon, savunmasızlıkların sömürülmesi, kamu otoriteleri tarafından sosyal puanlama, yalnızca profillemeye dayalı öngörücü polislik, yüz tanıma veritabanları için hedefsiz kazıma, işyerlerinde ve okullarda duygu çıkarımı, yargı için kamuda gerçek zamanlı uzaktan biyometrik tanımlama (dar istisnalarla) ve hassas niteliklere göre biyometrik kategorizasyon. Bunlar koşullu yüksek-risk değildir; masa dışıdır.</p>

<p class="l-text">Bunun altında <strong>yüksek-risk</strong> sistemler (Madde 6 + Ek III) durur, izinli ama ağır şekilde düzenlenir. Sonra <strong>sınırlı-risk</strong> sistemler (Madde 50) — chatbotlar, deepfake'ler, yasaklı bağlamlar dışında duygu tanıma — yalnızca şeffaflık görevleri taşır. Piramidin altı <strong>minimum-risk</strong> AI'dır: spam filtreleri, müzik öneri motorları, oyunlardaki NPC davranışı. Yasa burada gönüllü davranış kurallarına hiçbir şeyin engel olmadığını açıkça belirtir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kabul edilemez risk (Md. 5)</div><div class="card-body">Yasak. Sekiz kategori. 2 Şubat 2025'ten itibaren uygulanır.</div></div>
<div class="calc-card"><div class="card-title">Yüksek risk (Md. 6 + Ek III)</div><div class="card-body">Uygunluk değerlendirmesi, teknik dokümantasyon, AB veritabanına kayıt, piyasa sonrası izleme ile izin verilir.</div></div>
<div class="calc-card"><div class="card-title">Sınırlı risk (Md. 50)</div><div class="card-body">Yalnızca şeffaflık: kullanıcılara AI ile etkileşimde olduklarını söyleyin; deepfake'leri etiketleyin; sentetik medyayı işaretleyin.</div></div>
<div class="calc-card"><div class="card-title">Minimum risk</div><div class="card-body">Zorunlu kural yok. Gönüllü kurallar teşvik edilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Ek III — Yüksek-Risk Kataloğu</h2>
<p class="l-text">Ek III, AI'nın yüksek-risk varsayıldığı sekiz alanı listeler. Bu listeyi ezberleyin — AB AI uyumluluk çalışmasında en çok atıfta bulunulan tek referanstır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Biyometri</div><div class="card-body">Uzaktan tanımlama (yasaklı olmayan yerlerde), kategorizasyon, duygu tanıma. Md. 5 dışlamaları hâlâ geçerlidir.</div></div>
<div class="calc-card"><div class="card-title">2. Kritik altyapı</div><div class="card-body">Karayolu trafiği, su, gaz, elektrik, dijital altyapıdaki güvenlik bileşenleri.</div></div>
<div class="calc-card"><div class="card-title">3. Eğitim ve mesleki eğitim</div><div class="card-body">Kabul, değerlendirme, yerleştirme, sınavlar sırasında davranış izleme.</div></div>
<div class="calc-card"><div class="card-title">4. İstihdam ve İK</div><div class="card-body">İşe alım (CV taraması, mülakat puanlaması), terfi, görev tahsisi, performans izleme.</div></div>
<div class="calc-card"><div class="card-title">5. Temel hizmetler</div><div class="card-body">Kredi puanlaması (dolandırıcılık hariç), yaşam/sağlık için sigorta fiyatlaması, kamu yararı uygunluğu, acil sevk triyajı.</div></div>
<div class="calc-card"><div class="card-title">6. Kolluk kuvvetleri</div><div class="card-body">Mağdurların/suçluların risk değerlendirmesi, delil güvenilirliği, profilleme, suç analitiği.</div></div>
<div class="calc-card"><div class="card-title">7. Göç ve sınır kontrolü</div><div class="card-body">Risk değerlendirmesi, vize başvuru işleme, sığınma ve sınır-yönetim kararları.</div></div>
<div class="calc-card"><div class="card-title">8. Adalet ve demokrasi</div><div class="card-body">Yargı otoritelerine yardımcı olma, oylama ve seçim sonuçlarını etkileme.</div></div>
</div>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">Madde 6(1) de vardır: AI, Ek I'de listelenen AB uyumlulaştırma mevzuatının (makineler, oyuncaklar, asansörler, tıbbi cihazlar, otomotiv, havacılık vb.) kapsadığı bir ürünün güvenlik bileşeniyse, otomatik olarak yüksek-risktir. Bu "gömülü" şerittir.</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Yüksek-Risk Yükümlülükleri — Madde 8-27</h2>
<p class="l-text">Yüksek-risk bir sistemin sekiz yükümlülük sütunu vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Risk yönetimi (Md. 9)</div><div class="card-body">Yaşam döngüsü boyunca sürekli, yinelemeli süreç. Riskleri belirleyin, tahmin edin, değerlendirin; azaltımları benimseyin; kalan riski test edin.</div></div>
<div class="calc-card"><div class="card-title">Veri yönetişimi (Md. 10)</div><div class="card-body">Eğitim/doğrulama/test setleri ilgili, temsili, hatasız, eksiksiz olmalı; bias incelenmeli; istatistiksel özellikler belgelenmeli.</div></div>
<div class="calc-card"><div class="card-title">Teknik dokümantasyon (Md. 11 + Ek IV)</div><div class="card-body">Detaylı dosya: tasarım, mimari, eğitim verisi, performans metrikleri, bilinen sınırlamalar. Güncel tutulur.</div></div>
<div class="calc-card"><div class="card-title">Kayıt tutma (Md. 12)</div><div class="card-body">Operasyon sırasında girdilerin, çıktıların, kararların otomatik logları. Piyasa sonrası izlemeyi sağlamak için yeterli.</div></div>
<div class="calc-card"><div class="card-title">Şeffaflık (Md. 13)</div><div class="card-body">Deployerların çıktıları yorumlamasını ve sistemi güvenli kullanmasını sağlayan kullanım talimatları.</div></div>
<div class="calc-card"><div class="card-title">İnsan denetimi (Md. 14)</div><div class="card-body">Gerçek kişilerin etkili şekilde denetleyebileceği şekilde tasarlandı. Geçersiz kılma, durdurma veya yorumlama yeteneğini içerir.</div></div>
<div class="calc-card"><div class="card-title">Doğruluk, sağlamlık, siber güvenlik (Md. 15)</div><div class="card-body">Beyan edilen doğruluk seviyeleri, hatalara ve düşmanca saldırılara karşı dayanıklılık (veri zehirleme, model kaçınma).</div></div>
<div class="calc-card"><div class="card-title">QMS, uygunluk, kayıt (Md. 17, 43, 49)</div><div class="card-body">Kalite yönetim sistemi, uygunluk değerlendirmesi (çoğunlukla öz-değerlendirme, bazı biyometrik kullanımlar için üçüncü taraf), CE işareti, AB veritabanına kayıt.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Kodda Bir Risk-Düzeyi Sınıflandırıcı</h2>
<p class="l-text">Risk sınıflandırması sistem özellikleri üzerinde küçük bir karar ağacı olarak kodlanabilir. Etiketli örnekler kümesinden bir sklearn DecisionTree uyduracağız — düzey-eşleme mantığınızın tutarlı olduğunun ve aynı şirketteki iki mühendisin aynı ürün için aynı düzeye varacağının yararlı bir akıl sağlığı kontrolü.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier, export_text

<span class="cm"># Özellikler: [bans, annex_iii, safety_component, transparency_only, none]</span>
<span class="cm"># Düzeyler:    0=yasak 1=yüksek 2=sınırlı 3=minimum</span>
data = [
  <span class="cm"># bilinçaltı manipülasyon, sosyal puanlama, gerçek zamanlı RBI -&gt; yasak</span>
  ([<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">0</span>),
  ([<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">0</span>),
  <span class="cm"># CV tarayıcı, kredi skoru, sınav gözetimi -&gt; yüksek</span>
  ([<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">1</span>),
  ([<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">1</span>),
  ([<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">1</span>),
  <span class="cm"># AI kontrollü fren yardımı (güvenlik bileşeni, Ek I) -&gt; yüksek</span>
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>], <span class="num">1</span>),
  <span class="cm"># chatbot, deepfake etiketleme, duygu tanıma (yasaklı değil) -&gt; sınırlı</span>
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>], <span class="num">2</span>),
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>], <span class="num">2</span>),
  <span class="cm"># spam filtresi, müzik önerici, NPC AI -&gt; minimum</span>
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>], <span class="num">3</span>),
  ([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>], <span class="num">3</span>),
]
X = np.<span class="fn">array</span>([d[<span class="num">0</span>] <span class="kw">for</span> d <span class="kw">in</span> data]); y = np.<span class="fn">array</span>([d[<span class="num">1</span>] <span class="kw">for</span> d <span class="kw">in</span> data])
clf = <span class="fn">DecisionTreeClassifier</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(<span class="fn">export_text</span>(clf, feature_names=[<span class="str">"banned"</span>,<span class="str">"annex_iii"</span>,<span class="str">"safety_comp"</span>,<span class="str">"transparency"</span>,<span class="str">"none"</span>]))

unknown = np.<span class="fn">array</span>([
  [<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],   <span class="cm"># işe alım AI</span>
  [<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],   <span class="cm"># hedefsiz yüz kazıma</span>
  [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>],   <span class="cm"># GPT tarzı chatbot</span>
  [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>],   <span class="cm"># spam filtresi</span>
])
<span class="fn">print</span>(<span class="str">"Predicted tiers:"</span>, clf.<span class="fn">predict</span>(unknown))</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) modelleme adımı için scikit-learn'e başvurur. 3) bir sistemi EU AI Act katmanına (yasak / yüksek-risk / sınırlı / asgari) sınıflandırır ve devamında gelen yükümlülükleri listeler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">numpy + scikit-learn önceden yüklenmiştir. Ağaç önemsizdir; değer, düzey-eşleme kurallarını sürüm-kontrol edebilir ve denetleyebilir şekilde kodlamaktadır.</p>
</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Genel Amaçlı AI Modelleri — Madde 51-55</h2>
<p class="l-text">GPAI modellerine ayrı bir rejim uygulanır — birçok aşağı akış amacına hizmet edebilen temel modeller. Her GPAI modelinin temel yükümlülükleri vardır: teknik dokümantasyon (Ek XI), aşağı akış sağlayıcılar için bilgi (Ek XII), telif hakkı politikası, eğitim verisi özeti.</p>

<p class="l-text">Bir GPAI modelinin eğitim hesaplaması <strong>10²⁵ kayan nokta işlemini</strong> aştığında <strong>sistemik risk</strong> taşıdığı varsayılır (Madde 51). Komisyon ayrıca eşiğin altında olan ama yüksek-etki yetenekleri gösteren modelleri de belirleyebilir. Sistemik-risk GPAI ek yükümlülükler taşır: düşmanca test dahil model değerlendirmeleri, sistemik-risk değerlendirmesi ve azaltımı, AI Ofisi'ne ciddi olay raporlama ve yeterli siber güvenlik. Belirlenmiş sistemik-risk modellerinin listesi AI Ofisi tarafından tutulur.</p>

<div class="katex-block">$$\\text{GPAI training compute threshold} \\;=\\; 10^{25} \\text{ FLOP}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tüm GPAI</div><div class="card-body">Tek dok. (Ek XI), aşağı akış sağlayıcı bilgisi (Ek XII), Direktif 2019/790 ile uyumlu telif hakkı politikası, eğitim verisi özeti.</div></div>
<div class="calc-card"><div class="card-title">Sistemik-risk GPAI</div><div class="card-body">En son protokoller başına model değerlendirmesi, düşmanca test, sistemik-risk değerlendirmesi + azaltımı, ciddi olay raporlama, siber güvenlik.</div></div>
<div class="calc-card"><div class="card-title">Açık kaynak istisnası</div><div class="card-body">Ücretsiz ve açık kaynak GPAI, sistemik-risk olmadıkça bazı yükümlülüklerden muaftır. "Ağırlıklar açık" istisnasının sınırları vardır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Uygunluk Değerlendirmesi ve CE İşareti</h2>
<p class="l-text">Çoğu yüksek-risk sistem <strong>iç uygunluk değerlendirmesi</strong>'nden geçer (Ek VI) — sağlayıcı kendini sertifikalar, bir AB uygunluk beyanı imzalar ve CE işaretini iliştirir. Üçüncü taraf değerlendirmesi (Ek VII), yalnızca uyumlulaştırılmış standartların henüz olmadığı veya tam uygulanmadığı bazı biyometri ile ilgili Ek III sistemleri için gereklidir. CE işaretinden sonra, sağlayıcı sistemi AB AI veritabanına kaydeder (Madde 71) ve piyasa sonrası izleme yürütür (Madde 72).</p>

<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">CEN-CENELEC JTC 21 tarafından hazırlanan uyumlulaştırılmış standartlar, uygunluk varsayımı sağlar. ISO/IEC 42001 (ders L6) ile hizalanmak, uyumlulaştırılmış standartlar geldiğinde bu varsayıma giden en hızlı yoldur.</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Zaman Çizelgesi — Her Kuralın Ne Zaman Isırdığı</h2>
<p class="l-text">Yasa, yükümlülükleri büyük-patlama bir aktivasyon yerine aşamalandırır. Mühendislik ve hukuk ekiplerinin takvimlerinde farklı kilometre taşlarına ihtiyacı vardır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
timeline = pd.<span class="fn">DataFrame</span>([
  (<span class="str">"2024-08-01"</span>,<span class="str">"Entry into force"</span>,<span class="str">"Regulation EU 2024/1689 published 12 July, in force 1 Aug"</span>),
  (<span class="str">"2025-02-02"</span>,<span class="str">"Prohibitions apply"</span>,<span class="str">"Art. 5 bans + AI literacy obligation Art. 4"</span>),
  (<span class="str">"2025-08-02"</span>,<span class="str">"GPAI rules apply"</span>,<span class="str">"Art. 51-55 + AI Office governance + penalties Art. 99"</span>),
  (<span class="str">"2026-08-02"</span>,<span class="str">"High-risk Annex III rules apply"</span>,<span class="str">"Art. 6(2) + Annex III systems must be conformant"</span>),
  (<span class="str">"2027-08-02"</span>,<span class="str">"High-risk embedded rules apply"</span>,<span class="str">"Art. 6(1) + Annex I (medical, automotive, etc.)"</span>),
  (<span class="str">"2030-08-02"</span>,<span class="str">"Legacy carve-outs end"</span>,<span class="str">"Pre-existing high-risk public-sector systems must be brought into compliance"</span>),
], columns=[<span class="str">"date"</span>,<span class="str">"milestone"</span>,<span class="str">"scope"</span>])
<span class="fn">print</span>(timeline.<span class="fn">to_string</span>(index=<span class="kw">False</span>))

today = pd.<span class="fn">Timestamp</span>(<span class="str">"2026-05-04"</span>)
upcoming = timeline[pd.<span class="fn">to_datetime</span>(timeline.date) &gt;= today]
<span class="fn">print</span>(<span class="str">"\\nFrom today ("</span>, today.<span class="fn">date</span>(), <span class="str">") onwards:"</span>)
<span class="fn">print</span>(upcoming.<span class="fn">to_string</span>(index=<span class="kw">False</span>))</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) bir sistemi EU AI Act katmanına (yasak / yüksek-risk / sınırlı / asgari) sınıflandırır ve devamında gelen yükümlülükleri listeler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcınızda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">pandas önceden yüklenmiştir. Bir yol haritasına karşı "önümüzdeki 6 ayda ne ısırır" filtrelemek istediğinizde yararlıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Cezalar — Madde 99</h2>
<p class="l-text">Üç düzey ceza, mutlak bir tavan veya küresel yıllık cironun bir yüzdesinin yüksek olanı:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yasak uygulamalar (Md. 5)</div><div class="card-body">Küresel cironun <strong>€35M / %7</strong>'si. GDPR'nin %4'ünü geçen manşet rakamı.</div></div>
<div class="calc-card"><div class="card-title">Yüksek-risk ve GPAI yükümlülükleri</div><div class="card-body">Küresel cironun €15M / %3'ü. Çoğu operasyonel ihlali kapsar.</div></div>
<div class="calc-card"><div class="card-title">Yanıltıcı bilgi</div><div class="card-body">Otoritelere veya bildirilmiş kuruluşlara yanlış, eksik veya yanıltıcı bilgi için €7.5M / %1.</div></div>
<div class="calc-card"><div class="card-title">KOBİ orantılılığı</div><div class="card-body">KOBİ'ler ve girişimler için, "hangisi yüksekse" yerine, mutlak tavan veya yüzdenin düşüğü uygulanır.</div></div>
</div>

<div class="katex-block">$$\\text{Fine}_\\text{max} = \\max(\\text{cap}_{\\text{EUR}},\\ \\text{turnover} \\times \\text{rate}) \\quad \\text{(SME: min instead of max)}$$</div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Yönetişim ve Uygulama</h2>
<p class="l-text">Üç katman: (1) DG CNECT içindeki <strong>AB AI Ofisi</strong>, GPAI denetiminden ve AB çapı koordinasyondan sorumlu; (2) her Üye Devlette 2025 ortasına kadar belirlenen <strong>ulusal piyasa-gözetim otoriteleri</strong>; (3) Üye Devlet temsilcilerinden ve bağımsız uzmanlardan oluşan AI Bilim Paneli'nin yer aldığı <strong>Avrupa AI Kurulu</strong>. AI Ofisi, 2025'te GPAI Davranış Kurallarını yayımladı (Cedric Villani &amp; Yoshua Bengio taslak hazırlamayı yönetti).</p>

<p class="l-text">Whistleblower koruması (Direktif AB 2019/1937) uygulanır — ihlal bildiren iç personel korunur. Ulusal otoriteler Tek Bilgi Noktası aracılığıyla işbirliği yapar. Sınır ötesi vakalar, uyumlulaştırılmış pozisyonlar için AI Kurulu üzerinden yönlendirilir.</p>
</div>

<div class="lesson-block" id="section-10-tr">
<h2 class="lesson-title">10. Mühendislik Çıkarımları</h2>
<p class="l-text">AB'de AI gönderirseniz, üç alışkanlık sizi beladan uzak tutar: (a) <em>sistemi ilk gün düzeyleyin</em> — herhangi bir sprint planlamasından önce bir sayfalık Madde 6 / Ek III memo yazın; (b) <em>yüksek-risk kanıt paketini önceden oluşturun</em> — Ek IV bilinen bir şekildir, inşa ettikçe doldurun, lansmandan üç hafta önce geriye dönük yapmayın; (c) <em>bir CE-işareti takvimi tutun</em> — AB veritabanına kayıt, uygunluk beyanı ve piyasa sonrası izleme kâğıt işi değil, kapılardır. Sıradaki ders (NIS2 + DORA) AI Yasası'nın zaten sahip olduğunuzu varsaydığı siber güvenlik tabanını kapsar.</p>
</div>`
};
