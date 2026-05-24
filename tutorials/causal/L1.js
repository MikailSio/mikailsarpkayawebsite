window.CAUSAL_L1 = {
en: `<p class="l-text">In 1999, a famous study found that children with night-lights in their bedrooms were more likely to develop myopia. Headlines screamed: "Night-lights cause nearsightedness!" The truth? Nearsighted parents (a heritable trait) tend to leave lights on for their children. The night-light didn't cause myopia — <strong>genetics did</strong>, and the night-light was just a downstream symptom of nearsighted parents. This is the trap that pure machine learning falls into every day: it learns correlations, but correlations are not actions.</p>
<p class="l-text">Modern ML can predict who will churn, who will default, who will respond to chemotherapy. But it cannot answer "what if?" — what if we lower the price for this user? What if we change the drug dose? Predictive models trained on observational data confuse <em>seeing</em> with <em>doing</em>. Causal inference, formalized by Judea Pearl in <em>Causality</em> (2009) and popularized in <em>The Book of Why</em> (2018), gives us a mathematical language to climb the "ladder of causation": from association (level 1), to intervention (level 2), to counterfactuals (level 3). This first lesson lays the foundation.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Why correlation is not causation, and why ML alone cannot replace causal reasoning</li>
<li>Simpson's Paradox — when aggregating data flips the conclusion</li>
<li>Pearl's three-rung "ladder of causation" (association, intervention, counterfactual)</li>
<li>Real-world causal questions: medicine, policy, pricing, hiring, climate</li>
<li>The ladder failure modes that produced famous wrong-headed studies</li>
<li>How to spot a causal question disguised as a prediction problem</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Correlation is Not Causation — But Why Not?</h2>
<p class="l-text">Ice cream sales and drowning deaths rise together every summer. A naive model would predict: "ban ice cream, save lives." But both are caused by hot weather. The technical name for this is a <strong>confounder</strong> — a variable that affects both the supposed cause and the effect. Confounders make the world full of spurious associations.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spurious Correlation</div><div class="card-body">Two variables move together because of a hidden third variable, not because one causes the other. Example: storks ↔ birth rates (rural areas have both).</div></div>
<div class="calc-card"><div class="card-title">Reverse Causation</div><div class="card-body">Y actually causes X, not the other way around. "Hospitals make people sick" — no, sick people go to hospitals.</div></div>
<div class="calc-card"><div class="card-title">Selection Bias</div><div class="card-body">Sample is not representative. "Successful CEOs sleep 4 hours" — survivor bias; we never measure the failed ones.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">A correlation of 0.99 between two variables tells you <strong>nothing</strong> about whether intervening on one will change the other. ML metrics (AUC, accuracy) measure prediction quality on the same distribution — they do not measure causal validity.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Simpson's Paradox — A Live Demo</h2>
<p class="l-text">In 1973, Berkeley was sued for gender discrimination in graduate admissions: 44% of male applicants admitted vs. 35% of females. Yet department by department, women were admitted at <em>higher</em> rates than men. The paradox: women applied to more competitive departments. Aggregating flipped the answer. Let's reproduce this with our churn dataset.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Synthesize a Simpson-style scenario on df_churn</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'promo'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>] &gt; df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(), <span class="num">1</span>, <span class="num">0</span>)

<span class="cm"># Aggregate: does promo reduce churn?</span>
agg = df.<span class="fn">groupby</span>(<span class="str">'promo'</span>)[<span class="str">'churned'</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"Aggregate churn rate by promo:"</span>)
<span class="fn">print</span>(agg)
<span class="fn">print</span>(f<span class="str">"\\nNaive effect of promo: {agg[1] - agg[0]:.3f}"</span>)

<span class="cm"># Now stratify by tenure (the confounder)</span>
df[<span class="str">'tenure_bin'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">12</span>,<span class="num">36</span>,<span class="num">100</span>], labels=[<span class="str">'new'</span>,<span class="str">'mid'</span>,<span class="str">'loyal'</span>])
strat = df.<span class="fn">groupby</span>([<span class="str">'tenure_bin'</span>,<span class="str">'promo'</span>], observed=<span class="kw">True</span>)[<span class="str">'churned'</span>].<span class="fn">mean</span>().<span class="fn">unstack</span>()
<span class="fn">print</span>(<span class="str">"\\nStratified by tenure:"</span>)
<span class="fn">print</span>(strat)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) creates a synthetic <code>promo</code> flag on the churn data by thresholding <code>monthly_charge</code> at its median. 2) computes the aggregate churn rate within each promo group and prints the naive difference. 3) bins customers by <code>tenure_months</code> and recomputes churn rates inside every <em>(tenure_bin, promo)</em> cell so we can see whether the headline number survives stratification.</p>
<p class="l-text">Run this. The aggregate may show promo "increases" churn, but within each tenure bin the effect can flip. The aggregate is dominated by the fact that loyal customers happen to receive promos at different rates than new ones — classic Simpson's Paradox.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Pearl's Ladder of Causation</h2>
<p class="l-text">Judea Pearl's central insight is that questions come in three increasingly powerful flavors. Each rung requires more assumptions and more structure than the last.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rung 1: Association</div><div class="card-body">"What is P(Y|X)?" — pure observation. Standard ML lives here. Question: "Customers with X are likely to churn."</div></div>
<div class="calc-card"><div class="card-title">Rung 2: Intervention</div><div class="card-body">"What is P(Y|do(X))?" — the do-operator. We act, not just observe. Question: "If we send the discount, how does churn change?"</div></div>
<div class="calc-card"><div class="card-title">Rung 3: Counterfactual</div><div class="card-body">"What would Y have been if X had been different, given that we observed Y under X?" Question: "Would this specific user have churned if we hadn't sent the email?"</div></div>
</div>
<div class="katex-block">$$P(Y|X) \\;\\;\\neq\\;\\; P(Y|\\text{do}(X)) \\;\\;\\neq\\;\\; P(Y_x | X', Y')$$</div>
<p class="l-text">Three different probabilities, three different answers. Conflating them produces every bad headline you've ever read.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Why Pure ML Fails — A Concrete Example</h2>
<p class="l-text">A hospital trains a model to predict pneumonia mortality. It learns: "patients with asthma have <em>lower</em> mortality." Trust the model, send asthmatics home? Disaster. The truth: asthmatics get fast-tracked to ICU because clinicians fear complications, so they receive aggressive care, lowering observed mortality. The treatment policy is baked into the data.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># Simulate the asthma-pneumonia paradox</span>
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
n = <span class="num">5000</span>
asthma = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.15</span>, n)
<span class="cm"># Asthmatics get aggressive treatment</span>
treatment = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.2</span> + <span class="num">0.6</span>*asthma, n)
<span class="cm"># Mortality: asthma raises risk, treatment lowers it</span>
mortality = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, np.<span class="fn">clip</span>(<span class="num">0.3</span> + <span class="num">0.2</span>*asthma - <span class="num">0.4</span>*treatment, <span class="num">0.01</span>, <span class="num">0.99</span>), n)

df = pd.<span class="fn">DataFrame</span>({<span class="str">'asthma'</span>:asthma,<span class="str">'treatment'</span>:treatment,<span class="str">'died'</span>:mortality})

<span class="cm"># Naive model: asthma -&gt; mortality (ignoring treatment)</span>
naive = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(df[[<span class="str">'asthma'</span>]], df[<span class="str">'died'</span>])
<span class="fn">print</span>(f<span class="str">"Naive coef on asthma: {naive.coef_[0][0]:.3f}  (NEGATIVE = 'asthma protects')"</span>)

<span class="cm"># Correct model: include treatment</span>
correct = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(df[[<span class="str">'asthma'</span>,<span class="str">'treatment'</span>]], df[<span class="str">'died'</span>])
<span class="fn">print</span>(f<span class="str">"Correct coef on asthma: {correct.coef_[0][0]:.3f}  (POSITIVE = real causal effect)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) simulates the asthma–pneumonia paradox: <code>asthma</code> is sampled, <code>treatment</code> probability rises sharply with <code>asthma</code>, and <code>mortality</code> goes up with asthma but down with treatment. 2) fits a naive <code>LogisticRegression</code> that regresses <code>died</code> on <code>asthma</code> alone — the coefficient comes out <em>negative</em>, suggesting asthma protects against death. 3) refits with <code>treatment</code> added as a feature, which blocks the confounding path and recovers the true <em>positive</em> causal effect of asthma on mortality.</p>
<p class="l-text">The naive model finds a sign-flipped, dangerously wrong "effect" — exactly because it confuses observation with intervention. Caruana et al. (2015) documented this real case at Microsoft Research.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Real-World Causal Questions</h2>
<p class="l-text">Once you start looking, causal questions hide everywhere — usually mislabeled as ML problems.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Medicine</div><div class="card-body">Does this drug reduce mortality, or are sicker patients given different drugs? Every observational health study lives or dies on confounding.</div></div>
<div class="calc-card"><div class="card-title">Pricing</div><div class="card-body">Will lowering price increase revenue? Past data is contaminated by demand-driven pricing decisions.</div></div>
<div class="calc-card"><div class="card-title">Hiring</div><div class="card-body">Does our screening tool predict performance, or just predict who-we-already-hired-and-promoted?</div></div>
<div class="calc-card"><div class="card-title">Education</div><div class="card-body">Do smaller class sizes improve outcomes, or do richer districts have both small classes and high outcomes?</div></div>
<div class="calc-card"><div class="card-title">Recommender Systems</div><div class="card-body">Does showing this product cause a purchase, or are we just recommending what users would have bought anyway?</div></div>
<div class="calc-card"><div class="card-title">NLP &amp; Bias</div><div class="card-body">Does the gender word in a sentence cause classifier output to flip, or is gender confounded with topic? (Lesson 6)</div></div>
</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. The Two Languages: Statistics vs. Causal</h2>
<p class="l-text">Classical statistics speaks in joint distributions: P(X, Y, Z). Causal inference speaks in <em>structural equations</em> and <em>graphs</em>. Pearl's revolutionary contribution was showing how to translate between them — formally, with rules.</p>
<div class="katex-block">$$\\text{Statistics: } P(Y | X) \\qquad \\text{Causal: } P(Y | \\text{do}(X)) = \\sum_z P(Y | X, z) P(z)$$</div>
<p class="l-text">The right-hand side is the famous <strong>backdoor adjustment formula</strong> — we'll derive it in Lesson 2 and prove it with do-calculus in Lesson 3.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Pearl's claim, proved in <em>Causality</em> (2009): you cannot derive causal conclusions from purely statistical assumptions. You must add <strong>causal assumptions</strong>, encoded in a graph. There is no free lunch.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Quick Sanity Check on a Real Dataset</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Three "predictors" of churn — but which one is causal?</span>
df = df_churn.<span class="fn">copy</span>()
<span class="fn">print</span>(<span class="str">"Correlations with churned:"</span>)
<span class="fn">print</span>(df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>,<span class="str">'churned'</span>]].<span class="fn">corr</span>()[<span class="str">'churned'</span>])

<span class="cm"># Question: does increasing support_calls CAUSE more churn?</span>
<span class="cm"># Or does pre-existing dissatisfaction cause both calls AND churn?</span>
<span class="cm"># This is unanswerable from correlation alone.</span>

<span class="cm"># Proxy test: bin by tenure (a candidate confounder)</span>
df[<span class="str">'tenure_bin'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=<span class="num">3</span>, labels=[<span class="str">'new'</span>,<span class="str">'mid'</span>,<span class="str">'old'</span>])
table = df.<span class="fn">groupby</span>(<span class="str">'tenure_bin'</span>, observed=<span class="kw">True</span>).<span class="fn">apply</span>(
    <span class="kw">lambda</span> g: g[<span class="str">'support_calls'</span>].<span class="fn">corr</span>(g[<span class="str">'churned'</span>])
)
<span class="fn">print</span>(<span class="str">"\\nCorrelation(support_calls, churned) within tenure bins:"</span>)
<span class="fn">print</span>(table)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) prints the marginal Pearson correlations of <code>tenure_months</code>, <code>monthly_charge</code> and <code>support_calls</code> with <code>churned</code> as a starting baseline. 2) bins customers into three tenure groups with <code>pd.cut</code> to act as a candidate confounder. 3) groups by <code>tenure_bin</code> and recomputes the correlation between <code>support_calls</code> and <code>churned</code> inside each group, so we can compare within-bin correlations against the overall one.</p>
<p class="l-text">If the within-bin correlations differ from the overall correlation, tenure is confounding the relationship. We need a causal framework — graphs (Lesson 2) — to handle this systematically.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. What's Next</h2>
<p class="l-text">In Lesson 2 we draw <strong>Directed Acyclic Graphs</strong> and learn d-separation, the rules that tell us which variables to control for and which to leave alone. In Lesson 3, do-calculus formalizes intervention. By Lesson 4, we estimate average treatment effects from real data, and by Lesson 6 we apply causal tools to NLP fairness.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Reading: Pearl, <em>The Book of Why</em> (2018) — accessible. Pearl, <em>Causality</em> (2009) — formal. Hernán &amp; Robins, <em>Causal Inference: What If</em> (2020) — free online, applied focus.</div>
</div>`,
tr: `<p class="l-text">1999 yılında ünlü bir çalışma, yatak odalarında gece lambası bulunan çocukların miyop olma olasılığının daha yüksek olduğunu buldu. Manşetler haykırdı: "Gece lambaları miyopiye yol açıyor!" Gerçek mi? Miyop ebeveynler (kalıtsal bir özellik) çocukları için ışıkları açık bırakma eğiliminde. Gece lambası miyopiye sebep olmadı — <strong>genetik oldu</strong>, ve gece lambası sadece miyop ebeveynlerin aşağı akış semptomuydu. Saf makine öğrenmesinin her gün düştüğü tuzak budur: korelasyonları öğrenir, ama korelasyonlar eylem değildir.</p>
<p class="l-text">Modern makine öğrenmesi kimin terk edeceğini, kimin temerrüde düşeceğini, kimin kemoterapiye yanıt vereceğini tahmin edebilir. Ama "ya olsaydı?" sorusunu cevaplayamaz — ya bu kullanıcı için fiyatı düşürürsek? Ya ilaç dozunu değiştirirsek? Gözlemsel veriler üzerinde eğitilmiş tahmin modelleri <em>görmek</em> ile <em>yapmak</em>'ı karıştırır. Judea Pearl tarafından <em>Causality</em> (2009)'de formalize edilen ve <em>The Book of Why</em> (2018)'de popülerleştirilen nedensel çıkarım, bize "nedensellik merdiveni"ne tırmanmak için matematiksel bir dil verir: birliktelikten (seviye 1), müdahaleye (seviye 2), karşı-olgulara (seviye 3). Bu ilk ders temeli atıyor.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Korelasyonun neden nedensellik olmadığı ve makine öğrenmesinin tek başına nedensel akıl yürütmenin yerini neden alamayacağı</li>
<li>Simpson Paradoksu — verileri toplulaştırmanın sonucu nasıl tersine çevirdiği</li>
<li>Pearl'ün üç basamaklı "nedensellik merdiveni" (birliktelik, müdahale, karşı-olgu)</li>
<li>Gerçek dünya nedensel soruları: tıp, politika, fiyatlandırma, işe alım, iklim</li>
<li>Ünlü yanlış başlı çalışmaları üreten merdiven hata modları</li>
<li>Tahmin problemi olarak gizlenmiş bir nedensel soruyu nasıl tespit edersin</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Korelasyon Nedensellik Değildir — Ama Neden Değil?</h2>
<p class="l-text">Dondurma satışları ve boğulma ölümleri her yaz birlikte yükselir. Naif bir model şunu tahmin ederdi: "dondurmayı yasakla, hayat kurtar." Ama her ikisinin de nedeni sıcak hava. Bunun teknik adı <strong>karıştırıcı</strong> (confounder) — hem sözde nedeni hem de sonucu etkileyen bir değişken. Karıştırıcılar dünyayı sahte birlikteliklerle dolu hale getirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sahte Korelasyon</div><div class="card-body">İki değişken birlikte hareket eder çünkü gizli bir üçüncü değişken vardır, biri diğerine sebep olduğu için değil. Örnek: leylekler ↔ doğum oranları (kırsal alanlarda her ikisi de yüksek).</div></div>
<div class="calc-card"><div class="card-title">Ters Nedensellik</div><div class="card-body">Aslında Y, X'e sebep olur, tersi değil. "Hastaneler insanları hasta ediyor" — hayır, hasta insanlar hastaneye gider.</div></div>
<div class="calc-card"><div class="card-title">Seçim Yanlılığı</div><div class="card-body">Örneklem temsili değildir. "Başarılı CEO'lar 4 saat uyur" — hayatta kalma yanlılığı; başarısız olanları asla ölçmüyoruz.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">İki değişken arasındaki 0.99'luk bir korelasyon, birine müdahale etmenin diğerini değiştirip değiştirmeyeceği hakkında size <strong>hiçbir şey</strong> söylemez. ML metrikleri (AUC, doğruluk) aynı dağılımdaki tahmin kalitesini ölçer — nedensel geçerliliği ölçmez.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Simpson Paradoksu — Canlı Bir Demo</h2>
<p class="l-text">1973'te Berkeley, lisansüstü kabullerde cinsiyet ayrımcılığı nedeniyle dava edildi: erkek başvuranların %44'ü kabul edilirken kadınların %35'i kabul edildi. Ama bölüm bölüm bakıldığında, kadınlar erkeklere göre <em>daha yüksek</em> oranlarda kabul ediliyordu. Paradoks: kadınlar daha rekabetçi bölümlere başvuruyordu. Toplulaştırma cevabı tersine çevirdi. Bunu churn veri setimizle yeniden üretelim.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Synthesize a Simpson-style scenario on df_churn</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'promo'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>] &gt; df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(), <span class="num">1</span>, <span class="num">0</span>)

<span class="cm"># Aggregate: does promo reduce churn?</span>
agg = df.<span class="fn">groupby</span>(<span class="str">'promo'</span>)[<span class="str">'churned'</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"Aggregate churn rate by promo:"</span>)
<span class="fn">print</span>(agg)
<span class="fn">print</span>(f<span class="str">"\\nNaive effect of promo: {agg[1] - agg[0]:.3f}"</span>)

<span class="cm"># Now stratify by tenure (the confounder)</span>
df[<span class="str">'tenure_bin'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">12</span>,<span class="num">36</span>,<span class="num">100</span>], labels=[<span class="str">'new'</span>,<span class="str">'mid'</span>,<span class="str">'loyal'</span>])
strat = df.<span class="fn">groupby</span>([<span class="str">'tenure_bin'</span>,<span class="str">'promo'</span>], observed=<span class="kw">True</span>)[<span class="str">'churned'</span>].<span class="fn">mean</span>().<span class="fn">unstack</span>()
<span class="fn">print</span>(<span class="str">"\\nStratified by tenure:"</span>)
<span class="fn">print</span>(strat)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) churn verisi üzerinde <code>monthly_charge</code>'ı medyana göre eşikleyerek sentetik bir <code>promo</code> kolonu üretir. 2) her promo grubu için ortalama churn oranını hesaplayıp naif farkı yazdırır. 3) müşterileri <code>tenure_months</code>'a göre üç gruba ayırır ve her <em>(tenure_bin, promo)</em> hücresinde churn oranını yeniden hesaplar; böylece toplam tablodaki rakamın katmanlandırmadan sonra hayatta kalıp kalmadığını görebiliriz.</p>
<p class="l-text">Bunu çalıştır. Toplam, promosyonun churn'ü "artırdığını" gösterebilir, ama her tenure grubu içinde etki tersine dönebilir. Toplam, sadık müşterilerin yenilerden farklı oranlarda promosyon almasıyla domine edilir — klasik Simpson Paradoksu.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Pearl'ün Nedensellik Merdiveni</h2>
<p class="l-text">Judea Pearl'ün merkezi içgörüsü, soruların giderek güçlenen üç türde geldiğidir. Her basamak, bir öncekinden daha fazla varsayım ve daha fazla yapı gerektirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Basamak 1: Birliktelik</div><div class="card-body">"P(Y|X) nedir?" — saf gözlem. Standart ML burada yaşar. Soru: "X'e sahip müşteriler terk etmeye eğilimli."</div></div>
<div class="calc-card"><div class="card-title">Basamak 2: Müdahale</div><div class="card-body">"P(Y|do(X)) nedir?" — do-operatörü. Sadece gözlemlemiyoruz, eyleme geçiyoruz. Soru: "İndirim gönderirsek churn nasıl değişir?"</div></div>
<div class="calc-card"><div class="card-title">Basamak 3: Karşı-Olgu</div><div class="card-body">"X farklı olsaydı, X altında Y'yi gözlemlediğimize göre Y ne olurdu?" Soru: "Bu spesifik kullanıcı, e-postayı göndermeseydik terk eder miydi?"</div></div>
</div>
<div class="katex-block">$$P(Y|X) \\;\\;\\neq\\;\\; P(Y|\\text{do}(X)) \\;\\;\\neq\\;\\; P(Y_x | X', Y')$$</div>
<p class="l-text">Üç farklı olasılık, üç farklı cevap. Bunları karıştırmak okuduğunuz her kötü manşeti üretir.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Saf ML Neden Başarısız Olur — Somut Bir Örnek</h2>
<p class="l-text">Bir hastane zatürre ölümünü tahmin etmek için bir model eğitir. Şunu öğrenir: "astımı olan hastaların ölüm oranı <em>daha düşük</em>." Modele güvenip astımlıları eve mi gönderelim? Felaket. Gerçek: astımlılar komplikasyon korkusuyla klinisyenler tarafından hızla yoğun bakıma alınır, agresif tedavi alır, gözlemlenen ölüm oranı düşer. Tedavi politikası verinin içine kazınmıştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># Simulate the asthma-pneumonia paradox</span>
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
n = <span class="num">5000</span>
asthma = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.15</span>, n)
<span class="cm"># Asthmatics get aggressive treatment</span>
treatment = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.2</span> + <span class="num">0.6</span>*asthma, n)
<span class="cm"># Mortality: asthma raises risk, treatment lowers it</span>
mortality = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, np.<span class="fn">clip</span>(<span class="num">0.3</span> + <span class="num">0.2</span>*asthma - <span class="num">0.4</span>*treatment, <span class="num">0.01</span>, <span class="num">0.99</span>), n)

df = pd.<span class="fn">DataFrame</span>({<span class="str">'asthma'</span>:asthma,<span class="str">'treatment'</span>:treatment,<span class="str">'died'</span>:mortality})

<span class="cm"># Naive model: asthma -&gt; mortality (ignoring treatment)</span>
naive = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(df[[<span class="str">'asthma'</span>]], df[<span class="str">'died'</span>])
<span class="fn">print</span>(f<span class="str">"Naive coef on asthma: {naive.coef_[0][0]:.3f}  (NEGATIVE = 'asthma protects')"</span>)

<span class="cm"># Correct model: include treatment</span>
correct = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(df[[<span class="str">'asthma'</span>,<span class="str">'treatment'</span>]], df[<span class="str">'died'</span>])
<span class="fn">print</span>(f<span class="str">"Correct coef on asthma: {correct.coef_[0][0]:.3f}  (POSITIVE = real causal effect)"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) astım–zatürre paradoksunu simüle ediyor: <code>asthma</code> rastgele örnekleniyor, <code>treatment</code> olasılığı <code>asthma</code> ile keskin biçimde artıyor, ve <code>mortality</code> astımla yükselip tedaviyle düşüyor. 2) sadece <code>asthma</code>'yı kullanarak naif bir <code>LogisticRegression</code> eğitiyor — katsayı <em>negatif</em> çıkıyor ve sanki astım koruyucuymuş gibi görünüyor. 3) modele <code>treatment</code>'ı da ekleyip yeniden eğitiyor; bu da karıştırıcı yolu kapatıp astımın ölüm üzerindeki gerçek <em>pozitif</em> nedensel etkisini ortaya çıkarıyor.</p>
<p class="l-text">Naif model, işaret-tersine dönmüş, tehlikeli derecede yanlış bir "etki" bulur — tam olarak gözlemi müdahale ile karıştırdığı için. Caruana ve ark. (2015) bu gerçek vakayı Microsoft Research'te belgeledi.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Gerçek Dünya Nedensel Soruları</h2>
<p class="l-text">Bakmaya başladığında, nedensel sorular her yerde gizli — genellikle ML problemleri olarak yanlış etiketlenmiş.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tıp</div><div class="card-body">Bu ilaç ölümü azaltıyor mu, yoksa daha hasta hastalara mı farklı ilaçlar veriliyor? Her gözlemsel sağlık çalışması karıştırma üzerinde yaşar veya ölür.</div></div>
<div class="calc-card"><div class="card-title">Fiyatlandırma</div><div class="card-body">Fiyatı düşürmek geliri artırır mı? Geçmiş veriler talep odaklı fiyatlandırma kararlarıyla kontamine olmuştur.</div></div>
<div class="calc-card"><div class="card-title">İşe Alım</div><div class="card-body">Tarama aracımız performansı mı tahmin ediyor, yoksa sadece zaten-işe-aldığımız-ve-terfi-ettirdiğimizleri mi tahmin ediyor?</div></div>
<div class="calc-card"><div class="card-title">Eğitim</div><div class="card-body">Daha küçük sınıflar sonuçları iyileştirir mi, yoksa daha zengin bölgelerin hem küçük sınıfları hem de yüksek sonuçları mı var?</div></div>
<div class="calc-card"><div class="card-title">Öneri Sistemleri</div><div class="card-body">Bu ürünü göstermek satın almaya sebep mi oluyor, yoksa kullanıcıların zaten satın alacakları şeyleri mi öneriyoruz?</div></div>
<div class="calc-card"><div class="card-title">NLP &amp; Yanlılık</div><div class="card-body">Cümledeki cinsiyet kelimesi sınıflandırıcı çıktısının değişmesine sebep mi oluyor, yoksa cinsiyet konuyla mı karışmış? (Ders 6)</div></div>
</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. İki Dil: İstatistik ve Nedensel</h2>
<p class="l-text">Klasik istatistik birleşik dağılımlarla konuşur: P(X, Y, Z). Nedensel çıkarım <em>yapısal denklemler</em> ve <em>graflar</em> ile konuşur. Pearl'ün devrimci katkısı, bunlar arasında nasıl çeviri yapılacağını göstermesiydi — kurallarla, formal olarak.</p>
<div class="katex-block">$$\\text{Statistics: } P(Y | X) \\qquad \\text{Causal: } P(Y | \\text{do}(X)) = \\sum_z P(Y | X, z) P(z)$$</div>
<p class="l-text">Sağ taraf ünlü <strong>arkakapı ayarlama formülü</strong> — Ders 2'de türeteceğiz ve Ders 3'te do-calculus ile kanıtlayacağız.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Pearl'ün <em>Causality</em> (2009)'de kanıtladığı iddia: nedensel sonuçları sırf istatistiksel varsayımlardan türetemezsiniz. Bir grafa kodlanmış <strong>nedensel varsayımlar</strong> eklemelisiniz. Bedava öğle yemeği yok.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Gerçek Bir Veri Setinde Hızlı Sağlık Kontrolü</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Three "predictors" of churn — but which one is causal?</span>
df = df_churn.<span class="fn">copy</span>()
<span class="fn">print</span>(<span class="str">"Correlations with churned:"</span>)
<span class="fn">print</span>(df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>,<span class="str">'churned'</span>]].<span class="fn">corr</span>()[<span class="str">'churned'</span>])

<span class="cm"># Question: does increasing support_calls CAUSE more churn?</span>
<span class="cm"># Or does pre-existing dissatisfaction cause both calls AND churn?</span>
<span class="cm"># This is unanswerable from correlation alone.</span>

<span class="cm"># Proxy test: bin by tenure (a candidate confounder)</span>
df[<span class="str">'tenure_bin'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=<span class="num">3</span>, labels=[<span class="str">'new'</span>,<span class="str">'mid'</span>,<span class="str">'old'</span>])
table = df.<span class="fn">groupby</span>(<span class="str">'tenure_bin'</span>, observed=<span class="kw">True</span>).<span class="fn">apply</span>(
    <span class="kw">lambda</span> g: g[<span class="str">'support_calls'</span>].<span class="fn">corr</span>(g[<span class="str">'churned'</span>])
)
<span class="fn">print</span>(<span class="str">"\\nCorrelation(support_calls, churned) within tenure bins:"</span>)
<span class="fn">print</span>(table)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>tenure_months</code>, <code>monthly_charge</code> ve <code>support_calls</code> kolonlarının <code>churned</code> ile marjinal Pearson korelasyonlarını yazdırarak bir başlangıç tablosu kuruyor. 2) <code>pd.cut</code> ile müşterileri üç tenure grubuna ayırıyor; bu, aday bir karıştırıcı rolünü görüyor. 3) <code>tenure_bin</code>'e göre gruplayıp <code>support_calls</code> ile <code>churned</code> arasındaki korelasyonu her grup içinde yeniden hesaplıyor; böylece grup-içi korelasyonları genel korelasyonla karşılaştırabiliyoruz.</p>
<p class="l-text">Eğer grup-içi korelasyonlar genel korelasyondan farklıysa, tenure ilişkiyi karıştırıyor demektir. Bunu sistematik olarak ele almak için nedensel bir çerçeveye — graflara (Ders 2) — ihtiyacımız var.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Sırada Ne Var</h2>
<p class="l-text">Ders 2'de <strong>Yönlendirilmiş Asiklik Graflar</strong> çiziyoruz ve hangi değişkenleri kontrol edeceğimizi, hangilerini bırakacağımızı söyleyen kurallar olan d-ayrılma'yı öğreniyoruz. Ders 3'te do-calculus müdahaleyi formalize eder. Ders 4'e geldiğimizde, gerçek verilerden ortalama tedavi etkilerini tahmin ediyoruz, ve Ders 6'ya geldiğimizde nedensel araçları NLP adaletine uyguluyoruz.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Okuma: Pearl, <em>The Book of Why</em> (2018) — erişilebilir. Pearl, <em>Causality</em> (2009) — formal. Hernán &amp; Robins, <em>Causal Inference: What If</em> (2020) — çevrimiçi ücretsiz, uygulamalı odaklı.</div>
</div>`
};
