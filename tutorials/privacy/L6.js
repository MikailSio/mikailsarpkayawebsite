window.PRIVACY_L6 = {
en: `<p class="l-text">In 1997 Latanya Sweeney, then a graduate student at MIT, identified the medical record of Massachusetts Governor William Weld in a public "anonymized" hospital dataset by linking three quasi-identifiers — ZIP code, birth date, and gender — against publicly available voter rolls. The release had stripped names and addresses but left these "harmless" attributes. Her PhD thesis (Sweeney 2002, "k-Anonymity: A Model for Protecting Privacy", Int. J. Uncertainty) formalized the breach: an attacker with linkage data can re-identify any record uniquely identified by its quasi-identifier combination. The remedy: ensure every released record shares its quasi-identifier values with at least <em>k-1</em> others — k-anonymity.</p>
<p class="l-text">Two decades of refinement followed, much of it from Universitat Rovira i Virgili (URV) in Tarragona under <strong>Josep Domingo-Ferrer's CRISES research group</strong>, the world's leading academic group on Statistical Disclosure Control (SDC). Their signature contribution, <em>microaggregation</em> (Domingo-Ferrer & Mateo-Sanz 2002, IEEE TKDE), replaces each record's quasi-identifiers with the centroid of its k-cluster — preserving more analytic utility than generalization while still satisfying k-anonymity. URV's tools (sdcMicro, μ-ARGUS) are used by Eurostat, the U.S. Census Bureau, and statistical agencies worldwide. This lesson walks through k-anonymity, l-diversity (Machanavajjhala 2007), t-closeness (Li 2007), Mondrian partitioning (LeFevre 2006), p-sensitive k-anonymity, and crucially — microaggregation in scikit-learn on df_churn.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The Sweeney attack and quasi-identifiers — why "anonymized" datasets re-identify</li>
<li>k-anonymity (Samarati-Sweeney 1998), l-diversity, t-closeness</li>
<li>Generalization, suppression, and the Mondrian multidimensional algorithm (LeFevre 2006)</li>
<li><strong>Microaggregation (Domingo-Ferrer & Mateo-Sanz 2002, URV) — the URV signature method</strong></li>
<li>p-sensitive k-anonymity and beta-likeness — closing the homogeneity gap</li>
<li>Implementing Mondrian and microaggregation on df_churn in scikit-learn</li>
<li>The k-anonymity vs differential privacy debate</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Sweeney Attack — Quasi-Identifiers</h2>
<p class="l-text">A <em>quasi-identifier</em> (QI) is an attribute that is not unique by itself but identifying in combination. Sweeney showed that 87% of the U.S. population is uniquely identified by (5-digit ZIP, birth date, gender). Releasing those three with "anonymized" medical data is therefore equivalent to publishing names. Modern QIs include device fingerprints, location traces, and even writing style (stylometric attacks).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Identifier</div><div class="card-body">Direct: name, SSN, email. Removed in any release.</div></div>
<div class="calc-card"><div class="card-title">Quasi-identifier</div><div class="card-body">Indirect: ZIP, DOB, gender, salary, job title. Re-identifies via linkage.</div></div>
<div class="calc-card"><div class="card-title">Sensitive attribute</div><div class="card-body">The thing the attacker wants: diagnosis, salary, religion. Protected only if k-group is heterogeneous.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. k-Anonymity — Definition and Algorithms</h2>
<p class="l-text">A dataset satisfies <em>k-anonymity</em> if every record has identical QI values to at least k-1 others. Two operational primitives achieve this: <em>generalization</em> (replace age 23 with [20-29]) and <em>suppression</em> (drop the row entirely). Samarati-Sweeney's optimal generalization is NP-hard; in practice we use heuristic top-down or bottom-up partitioning.</p>
<div class="katex-block">$$\\forall r \\in D, \\quad \\left| \\{ r' \\in D : r'.QI = r.QI \\} \\right| \\ge k$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
df = df_churn.<span class="fn">copy</span>()
QI = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>]

<span class="cm"># Naive grouping check before any generalization</span>
counts = df.<span class="fn">groupby</span>(QI).<span class="fn">size</span>()
<span class="fn">print</span>(<span class="str">"Min group size:"</span>, counts.<span class="fn">min</span>(), <span class="str">" (need &gt;= k for k-anonymity)"</span>)
<span class="fn">print</span>(<span class="str">"Number of unique QI tuples:"</span>, <span class="fn">len</span>(counts))
<span class="fn">print</span>(<span class="str">"Number of singletons (k=1, fully identifiable):"</span>, (counts == <span class="num">1</span>).<span class="fn">sum</span>())
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) trains a generator (CTGAN / DP-CTGAN) to synthesise tabular data that preserves marginals while bounding membership-inference risk.</p>
<p class="l-text">Most rows are singletons in their raw QI combination — exactly Sweeney's finding on real data. We need to generalize.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Mondrian — Recursive Multidimensional Partitioning</h2>
<p class="l-text">LeFevre, DeWitt, Ramakrishnan (ICDE 2006) introduced <em>Mondrian</em>: treat QIs as a d-dimensional space, recursively split along the median of the widest dimension until any further split would violate k-anonymity. Each leaf is then represented by its bounding box (the generalization). Implementation on df_churn:</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Mondrian k-anonymity on df_churn — recursive median splits</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
df = df_churn.<span class="fn">copy</span>()
QI = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
k = <span class="num">5</span>

<span class="kw">def</span> <span class="fn">mondrian</span>(df_part, qi, k):
    <span class="kw">if</span> <span class="fn">len</span>(df_part) &lt; <span class="num">2</span>*k:
        <span class="kw">return</span> [df_part]                     <span class="cm"># leaf — cannot split further</span>
    spans = {c: df_part[c].<span class="fn">max</span>() - df_part[c].<span class="fn">min</span>() <span class="kw">for</span> c <span class="kw">in</span> qi}
    pivot = <span class="fn">max</span>(spans, key=spans.get)
    med = df_part[pivot].<span class="fn">median</span>()
    left = df_part[df_part[pivot] &lt;= med]
    right = df_part[df_part[pivot] &gt;  med]
    <span class="kw">if</span> <span class="fn">len</span>(left) &lt; k <span class="kw">or</span> <span class="fn">len</span>(right) &lt; k:
        <span class="kw">return</span> [df_part]
    <span class="kw">return</span> <span class="fn">mondrian</span>(left, qi, k) + <span class="fn">mondrian</span>(right, qi, k)

groups = <span class="fn">mondrian</span>(df, QI, k)
<span class="fn">print</span>(f<span class="str">"Created {len(groups)} k-anonymous equivalence classes (k={k})"</span>)
<span class="fn">print</span>(<span class="str">"Group sizes — min/median/max:"</span>,
      <span class="fn">min</span>(<span class="fn">map</span>(<span class="fn">len</span>,groups)), <span class="fn">int</span>(np.<span class="fn">median</span>([<span class="fn">len</span>(g) <span class="kw">for</span> g <span class="kw">in</span> groups])), <span class="fn">max</span>(<span class="fn">map</span>(<span class="fn">len</span>,groups)))

<span class="cm"># Generalize: replace QIs with bounding-box ranges</span>
out = []
<span class="kw">for</span> g <span class="kw">in</span> groups:
    g = g.<span class="fn">copy</span>()
    <span class="kw">for</span> c <span class="kw">in</span> QI:
        g[c] = f<span class="str">"[{g[c].min()}-{g[c].max()}]"</span>
    out.<span class="fn">append</span>(g)
anon = pd.<span class="fn">concat</span>(out)
<span class="fn">print</span>(anon[QI + [<span class="str">'churned'</span>]].<span class="fn">head</span>(<span class="num">10</span>).<span class="fn">to_string</span>())
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a generator (CTGAN / DP-CTGAN) to synthesise tabular data that preserves marginals while bounding membership-inference risk.</p>
</div>
<p class="l-text">Each row now belongs to a group of ≥k=5; QIs are intervals, not point values. The dataset is k-anonymous and ready for release — but we'll see homogeneity attacks next.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. The Homogeneity Attack and l-Diversity</h2>
<p class="l-text">Machanavajjhala, Gehrke, Kifer, Venkitasubramaniam (ICDE 2006, "l-Diversity: Privacy Beyond k-Anonymity") showed k-anonymity has a fatal hole. If all k records in an equivalence class share the same sensitive attribute, the attacker still learns it. Example: a 5-anonymous group where all 5 patients have HIV. <em>l-diversity</em> requires each equivalence class contain at least l "well-represented" sensitive values.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="cm"># Check l-diversity on the Mondrian groups produced above</span>
<span class="kw">def</span> <span class="fn">l_diversity</span>(groups, sensitive=<span class="str">'churned'</span>):
    <span class="kw">return</span> [g[sensitive].<span class="fn">nunique</span>() <span class="kw">for</span> g <span class="kw">in</span> groups]

div = <span class="fn">l_diversity</span>(groups)
<span class="fn">print</span>(<span class="str">"l-diversity per group:"</span>, div[:<span class="num">10</span>])
<span class="fn">print</span>(f<span class="str">"Min l = {min(div)}  ({(np.array(div) &lt; 2).sum()} groups violate l=2)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) trains a generator (CTGAN / DP-CTGAN) to synthesise tabular data that preserves marginals while bounding membership-inference risk.</p>
<p class="l-text">Variants: <em>distinct</em> l-diversity (≥l unique values), <em>entropy</em> l-diversity (Shannon entropy ≥ log l), <em>recursive (c,l)</em> l-diversity (most frequent value not too dominant).</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. t-Closeness and Beta-Likeness</h2>
<p class="l-text">Li, Li, Venkatasubramanian (ICDE 2007) found l-diversity insufficient: a group with l=2 but distribution (99% positive, 1% negative) leaks almost as much as homogeneity. <em>t-closeness</em> requires the sensitive distribution within each equivalence class be within Earth Mover's Distance t of the global distribution. Domingo-Ferrer and Soria-Comas (URV, 2015) refined this with <em>beta-likeness</em>, allowing more utility while maintaining a similar privacy bound.</p>
<div class="katex-block">$$\\text{EMD}(P_{\\text{group}}, P_{\\text{global}}) \\le t$$</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Microaggregation — The URV Signature Method</h2>
<p class="l-text"><strong>Domingo-Ferrer and Mateo-Sanz (IEEE TKDE 2002, "Practical data-oriented microaggregation for statistical disclosure control")</strong> introduced the technique that defines URV's CRISES legacy. Instead of generalizing QIs to intervals (which destroys numeric utility), <em>microaggregation</em> partitions records into groups of size ≥k and replaces each record's QIs with the <em>centroid</em> of its group. The result is k-anonymous (every k records share identical QI values — the centroid) while preserving means, covariances, and most regression coefficients.</p>
<div class="katex-block">$$x_i \\leftarrow \\text{centroid}(\\text{cluster}_k) \\quad \\forall i \\in \\text{cluster}_k$$</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">URV's MDAV (Maximum Distance to Average Vector) algorithm picks the most distant record, builds a k-group around it, repeats. It is the de facto standard in Eurostat's μ-ARGUS and the R package sdcMicro. Domingo-Ferrer's group has published over 200 papers on SDC since 1998 — making URV Tarragona the global hub of the field.</div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Microaggregation via sklearn KMeans on df_churn — URV's signature method</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_churn.<span class="fn">copy</span>()
QI = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
k = <span class="num">5</span>

X = df[QI].values.<span class="fn">astype</span>(<span class="fn">float</span>)
n_clusters = <span class="fn">max</span>(<span class="num">1</span>, <span class="fn">len</span>(df) // k)              <span class="cm"># ~k records per cluster</span>
scaler = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X)
Xs = scaler.<span class="fn">transform</span>(X)

km = <span class="fn">KMeans</span>(n_clusters=n_clusters, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xs)
labels = km.labels_

<span class="cm"># Replace each record's QIs with cluster centroid (in original scale)</span>
centroids_orig = scaler.<span class="fn">inverse_transform</span>(km.cluster_centers_)
df_micro = df.<span class="fn">copy</span>()
df_micro[QI] = centroids_orig[labels]

<span class="cm"># Verify k-anonymity</span>
group_sizes = df_micro.<span class="fn">groupby</span>(QI).<span class="fn">size</span>()
<span class="fn">print</span>(f<span class="str">"Cluster count: {n_clusters}"</span>)
<span class="fn">print</span>(f<span class="str">"Min group size: {group_sizes.min()}  (target k = {k})"</span>)
<span class="fn">print</span>(f<span class="str">"Mean of original tenure:    {df['tenure_months'].mean():.2f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean after microaggregation: {df_micro['tenure_months'].mean():.2f}"</span>)
<span class="fn">print</span>(<span class="str">"Correlation preservation:"</span>)
<span class="fn">print</span>(<span class="str">"  Original:    "</span>, np.<span class="fn">corrcoef</span>(df[<span class="str">'tenure_months'</span>], df[<span class="str">'monthly_charge'</span>])[<span class="num">0</span>,<span class="num">1</span>].<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"  Microaggreg: "</span>, np.<span class="fn">corrcoef</span>(df_micro[<span class="str">'tenure_months'</span>], df_micro[<span class="str">'monthly_charge'</span>])[<span class="num">0</span>,<span class="num">1</span>].<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) runs sklearn KMeans clustering to group the records (the workhorse of the MDAV microaggregation approximation). 3) trains a generator (CTGAN / DP-CTGAN) to synthesise tabular data that preserves marginals while bounding membership-inference risk.</p>
</div>
<p class="l-text">Notice: means are preserved exactly, correlations near-perfectly. Compare to Mondrian generalization which replaces values with interval strings — useless for downstream regression. Microaggregation is the right tool when statisticians need to release data for further analysis.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. p-Sensitive k-Anonymity</h2>
<p class="l-text">Truta and Vinay (PDM 2006), refined by Domingo-Ferrer and others, introduced <em>p-sensitive k-anonymity</em>: each equivalence class must contain at least p distinct sensitive values. It composes naturally with microaggregation — first cluster on QIs to get k-anonymity, then check or enforce p-distinctness on the sensitive column.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="cm"># Check p-sensitive k-anonymity on the microaggregated frame</span>
QI = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
<span class="kw">def</span> <span class="fn">p_sensitive</span>(df, qi, sensitive, p):
    sizes = df.<span class="fn">groupby</span>(qi)[sensitive].<span class="fn">nunique</span>()
    violators = (sizes &lt; p).<span class="fn">sum</span>()
    <span class="kw">return</span> violators, sizes.<span class="fn">min</span>()

violators, p_min = <span class="fn">p_sensitive</span>(df_micro, QI, <span class="str">'churned'</span>, p=<span class="num">2</span>)
<span class="fn">print</span>(f<span class="str">"Groups violating p=2:  {violators}"</span>)
<span class="fn">print</span>(f<span class="str">"Min sensitive-value count: {p_min}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a generator (CTGAN / DP-CTGAN) to synthesise tabular data that preserves marginals while bounding membership-inference risk.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. k-Anonymity vs Differential Privacy</h2>
<p class="l-text">A long-running debate. Differential-privacy advocates (Dwork, Hardt) argue k-anonymity offers no formal guarantee against unknown auxiliary information. k-anonymity advocates (Domingo-Ferrer, Sweeney, Sánchez) argue DP destroys utility for census/microdata releases where syntactic anonymization preserves statistics. The <em>2020 U.S. Census</em> shipped DP for tabular releases but uses traditional SDC (including microaggregation) for the Public Use Microdata Sample. Both are deployed in production.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">k-anonymity</div><div class="card-body">Syntactic. Preserves data utility. No formal bound vs auxiliary info. URV / Eurostat / Census PUMS.</div></div>
<div class="calc-card"><div class="card-title">Differential privacy</div><div class="card-body">Semantic. Formal guarantee. Significant utility cost on aggregates. U.S. Census 2020 tabulations, Apple, Google.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (URV current)</div><div class="card-body">Microaggregation as DP pre-processing — Soria-Comas, Domingo-Ferrer 2014. Best of both worlds for microdata.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Production Tools</h2>
<p class="l-text">Three battle-tested tools. <em>ARX</em> (Prasser & Kohlmayer, TU Munich) — Java, GUI, supports k-anonymity, l-diversity, t-closeness, DP. <em>sdcMicro</em> (Templ & Meindl) — R package used by Eurostat, includes URV's MDAV microaggregation. <em>μ-ARGUS</em> — Statistics Netherlands' classical SDC tool. For pipelines: <code>amnesia</code> (web-based), <code>pycanon</code> (Python, evaluates k/l/t metrics on a frame). Always validate on real auxiliary data before releasing — Sweeney's 1997 attack used voter rolls; today's attackers use data brokers and breached-credential databases.</p>
</div>`,
tr: `<p class="l-text">1997'de o sıralar MIT'de yüksek lisans öğrencisi olan Latanya Sweeney, halka açık "anonimleştirilmiş" bir hastane veri setinde Massachusetts Valisi William Weld'in tıbbi kaydını üç yarı-tanımlayıcıyı — posta kodu, doğum tarihi ve cinsiyet — kamuya açık seçmen kayıtlarına bağlayarak tanımladı. Yayım isimleri ve adresleri çıkarmıştı ama bu "zararsız" özellikleri bırakmıştı. Doktora tezi (Sweeney 2002, "k-Anonymity: A Model for Protecting Privacy", Int. J. Uncertainty) ihlali resmileştirdi: bağlantı verisi olan bir saldırgan, yarı-tanımlayıcı kombinasyonuyla benzersiz şekilde tanımlanan herhangi bir kaydı yeniden tanımlayabilir. Çare: yayımlanan her kaydın yarı-tanımlayıcı değerlerini en az <em>k-1</em> başkasıyla paylaşmasını sağlamak — k-anonymity.</p>
<p class="l-text">İki on yıllık rafine etme izledi; çoğu Tarragona'daki Universitat Rovira i Virgili'den (URV), <strong>Josep Domingo-Ferrer'in CRISES araştırma grubu</strong> altında — İstatistiksel İfşa Kontrolü (SDC) üzerine dünyanın önde gelen akademik grubu. İmza katkıları, <em>microaggregation</em> (Domingo-Ferrer ve Mateo-Sanz 2002, IEEE TKDE), her kaydın yarı-tanımlayıcılarını k-kümesinin centroid'i ile değiştirir — k-anonymity'yi karşılarken genellemelerden daha fazla analitik fayda korur. URV'nin araçları (sdcMicro, μ-ARGUS) Eurostat, ABD Sayım Bürosu ve dünya çapındaki istatistik kurumları tarafından kullanılır. Bu ders k-anonymity, l-diversity (Machanavajjhala 2007), t-closeness (Li 2007), Mondrian bölümleme (LeFevre 2006), p-sensitive k-anonymity ve kritik olarak — df_churn üzerinde scikit-learn'de microaggregation'ı yürür.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sweeney saldırısı ve yarı-tanımlayıcılar — "anonimleştirilmiş" veri setlerinin neden yeniden tanımlandığı</li>
<li>k-anonymity (Samarati-Sweeney 1998), l-diversity, t-closeness</li>
<li>Genelleme, bastırma ve Mondrian çok boyutlu algoritması (LeFevre 2006)</li>
<li><strong>Microaggregation (Domingo-Ferrer ve Mateo-Sanz 2002, URV) — URV imza yöntemi</strong></li>
<li>p-sensitive k-anonymity ve beta-likeness — homojenlik boşluğunu kapatmak</li>
<li>df_churn üzerinde scikit-learn ile Mondrian ve microaggregation uygulamak</li>
<li>k-anonymity vs diferansiyel gizlilik tartışması</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Sweeney Saldırısı — Yarı-Tanımlayıcılar</h2>
<p class="l-text">Bir <em>yarı-tanımlayıcı</em> (QI), kendi başına benzersiz olmayan ama kombinasyonda tanımlayıcı olan bir özelliktir. Sweeney, ABD nüfusunun %87'sinin (5 haneli posta kodu, doğum tarihi, cinsiyet) ile benzersiz şekilde tanımlandığını gösterdi. Bu üçünü "anonimleştirilmiş" tıbbi verilerle yayımlamak bu nedenle isimleri yayımlamaya eşdeğerdir. Modern QI'ler cihaz parmak izlerini, konum izlerini ve hatta yazma stilini (stilometrik saldırılar) içerir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanımlayıcı</div><div class="card-body">Doğrudan: isim, SSN, e-posta. Herhangi bir yayımda kaldırılır.</div></div>
<div class="calc-card"><div class="card-title">Yarı-tanımlayıcı</div><div class="card-body">Dolaylı: posta kodu, doğum tarihi, cinsiyet, maaş, iş unvanı. Bağlantıyla yeniden tanımlar.</div></div>
<div class="calc-card"><div class="card-title">Hassas özellik</div><div class="card-body">Saldırganın istediği şey: tanı, maaş, din. Yalnızca k-grup heterojense korunur.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. k-Anonymity — Tanım ve Algoritmalar</h2>
<p class="l-text">Bir veri seti, her kaydın en az k-1 başkasıyla aynı QI değerlerine sahip olması durumunda <em>k-anonymity</em>'yi karşılar. İki operasyonel ilkel bunu başarır: <em>genelleme</em> (yaş 23'ü [20-29] ile değiştir) ve <em>bastırma</em> (satırı tamamen düşür). Samarati-Sweeney'in optimal genellemesi NP-zordur; pratikte sezgisel yukarıdan-aşağıya veya aşağıdan-yukarıya bölümleme kullanırız.</p>
<div class="katex-block">$$\\forall r \\in D, \\quad \\left| \\{ r' \\in D : r'.QI = r.QI \\} \\right| \\ge k$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
df = df_churn.<span class="fn">copy</span>()
QI = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>]

<span class="cm"># Herhangi bir genelleme öncesi naif gruplama kontrolü</span>
counts = df.<span class="fn">groupby</span>(QI).<span class="fn">size</span>()
<span class="fn">print</span>(<span class="str">"Min group size:"</span>, counts.<span class="fn">min</span>(), <span class="str">" (need &gt;= k for k-anonymity)"</span>)
<span class="fn">print</span>(<span class="str">"Number of unique QI tuples:"</span>, <span class="fn">len</span>(counts))
<span class="fn">print</span>(<span class="str">"Number of singletons (k=1, fully identifiable):"</span>, (counts == <span class="num">1</span>).<span class="fn">sum</span>())
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) üyelik-çıkarımı riskini sınırlarken marjinalleri koruyan tablosal veri sentezleyen bir üretici (CTGAN / DP-CTGAN) eğitir.</p>
<p class="l-text">Çoğu satır ham QI kombinasyonunda tek başınadır — Sweeney'in gerçek veride bulduğunun aynısı. Genelleme yapmamız gerekir.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Mondrian — Yinelemeli Çok Boyutlu Bölümleme</h2>
<p class="l-text">LeFevre, DeWitt, Ramakrishnan (ICDE 2006) <em>Mondrian</em>'ı tanıttı: QI'leri d-boyutlu bir uzay olarak ele alın, daha fazla bölmenin k-anonymity'yi ihlal edeceği noktaya kadar en geniş boyutun medyanı boyunca yinelemeli olarak bölün. Her yaprak daha sonra sınırlayıcı kutusu (genelleme) ile temsil edilir. df_churn üzerinde uygulama:</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">df_churn üzerinde Mondrian k-anonymity — yinelemeli medyan bölmeleri</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
df = df_churn.<span class="fn">copy</span>()
QI = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
k = <span class="num">5</span>

<span class="kw">def</span> <span class="fn">mondrian</span>(df_part, qi, k):
    <span class="kw">if</span> <span class="fn">len</span>(df_part) &lt; <span class="num">2</span>*k:
        <span class="kw">return</span> [df_part]                     <span class="cm"># yaprak — daha fazla bolunemez</span>
    spans = {c: df_part[c].<span class="fn">max</span>() - df_part[c].<span class="fn">min</span>() <span class="kw">for</span> c <span class="kw">in</span> qi}
    pivot = <span class="fn">max</span>(spans, key=spans.get)
    med = df_part[pivot].<span class="fn">median</span>()
    left = df_part[df_part[pivot] &lt;= med]
    right = df_part[df_part[pivot] &gt;  med]
    <span class="kw">if</span> <span class="fn">len</span>(left) &lt; k <span class="kw">or</span> <span class="fn">len</span>(right) &lt; k:
        <span class="kw">return</span> [df_part]
    <span class="kw">return</span> <span class="fn">mondrian</span>(left, qi, k) + <span class="fn">mondrian</span>(right, qi, k)

groups = <span class="fn">mondrian</span>(df, QI, k)
<span class="fn">print</span>(f<span class="str">"Created {len(groups)} k-anonymous equivalence classes (k={k})"</span>)
<span class="fn">print</span>(<span class="str">"Group sizes — min/median/max:"</span>,
      <span class="fn">min</span>(<span class="fn">map</span>(<span class="fn">len</span>,groups)), <span class="fn">int</span>(np.<span class="fn">median</span>([<span class="fn">len</span>(g) <span class="kw">for</span> g <span class="kw">in</span> groups])), <span class="fn">max</span>(<span class="fn">map</span>(<span class="fn">len</span>,groups)))

<span class="cm"># Genellestir: QI'leri sinirlayici-kutu araliklariyla degistir</span>
out = []
<span class="kw">for</span> g <span class="kw">in</span> groups:
    g = g.<span class="fn">copy</span>()
    <span class="kw">for</span> c <span class="kw">in</span> QI:
        g[c] = f<span class="str">"[{g[c].min()}-{g[c].max()}]"</span>
    out.<span class="fn">append</span>(g)
anon = pd.<span class="fn">concat</span>(out)
<span class="fn">print</span>(anon[QI + [<span class="str">'churned'</span>]].<span class="fn">head</span>(<span class="num">10</span>).<span class="fn">to_string</span>())
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) üyelik-çıkarımı riskini sınırlarken marjinalleri koruyan tablosal veri sentezleyen bir üretici (CTGAN / DP-CTGAN) eğitir.</p>
</div>
<p class="l-text">Her satır artık ≥k=5 olan bir gruba ait; QI'ler nokta değerler değil, aralıklardır. Veri seti k-anonimdir ve yayım için hazırdır — ancak homojenlik saldırılarını sırada göreceğiz.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Homojenlik Saldırısı ve l-Diversity</h2>
<p class="l-text">Machanavajjhala, Gehrke, Kifer, Venkitasubramaniam (ICDE 2006, "l-Diversity: Privacy Beyond k-Anonymity") k-anonymity'nin ölümcül bir deliği olduğunu gösterdi. Bir denklik sınıfındaki tüm k kayıt aynı hassas özelliği paylaşıyorsa, saldırgan onu yine öğrenir. Örnek: 5 hastanın hepsinin HIV olduğu 5-anonim bir grup. <em>l-diversity</em> her denklik sınıfının en az l "iyi temsil edilmiş" hassas değer içermesini gerektirir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="cm"># Yukarıda üretilen Mondrian gruplarında l-diversity kontrol et</span>
<span class="kw">def</span> <span class="fn">l_diversity</span>(groups, sensitive=<span class="str">'churned'</span>):
    <span class="kw">return</span> [g[sensitive].<span class="fn">nunique</span>() <span class="kw">for</span> g <span class="kw">in</span> groups]

div = <span class="fn">l_diversity</span>(groups)
<span class="fn">print</span>(<span class="str">"l-diversity per group:"</span>, div[:<span class="num">10</span>])
<span class="fn">print</span>(f<span class="str">"Min l = {min(div)}  ({(np.array(div) &lt; 2).sum()} groups violate l=2)"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) üyelik-çıkarımı riskini sınırlarken marjinalleri koruyan tablosal veri sentezleyen bir üretici (CTGAN / DP-CTGAN) eğitir.</p>
<p class="l-text">Varyantlar: <em>distinct</em> l-diversity (≥l benzersiz değer), <em>entropy</em> l-diversity (Shannon entropisi ≥ log l), <em>recursive (c,l)</em> l-diversity (en sık değer çok baskın olmamalı).</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. t-Closeness ve Beta-Likeness</h2>
<p class="l-text">Li, Li, Venkatasubramanian (ICDE 2007) l-diversity'nin yetersiz olduğunu buldu: l=2 olan ama dağılımı (%99 pozitif, %1 negatif) olan bir grup neredeyse homojenlik kadar çok şey sızdırır. <em>t-closeness</em> her denklik sınıfı içindeki hassas dağılımın küresel dağılımdan Earth Mover's Distance t içinde olmasını gerektirir. Domingo-Ferrer ve Soria-Comas (URV, 2015) bunu <em>beta-likeness</em> ile rafine etti; benzer bir gizlilik sınırı korurken daha fazla faydaya izin verdi.</p>
<div class="katex-block">$$\\text{EMD}(P_{\\text{group}}, P_{\\text{global}}) \\le t$$</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Microaggregation — URV İmza Yöntemi</h2>
<p class="l-text"><strong>Domingo-Ferrer ve Mateo-Sanz (IEEE TKDE 2002, "Practical data-oriented microaggregation for statistical disclosure control")</strong> URV'nin CRISES mirasını tanımlayan tekniği tanıttı. QI'leri aralıklara genelleştirmek (sayısal faydayı yok eden) yerine, <em>microaggregation</em> kayıtları en az k boyutlu gruplara böler ve her kaydın QI'lerini grubunun <em>centroid</em>'i ile değiştirir. Sonuç k-anonimdir (her k kayıt aynı QI değerlerini — centroid'i — paylaşır) ama ortalamaları, kovaryansları ve çoğu regresyon katsayısını korur.</p>
<div class="katex-block">$$x_i \\leftarrow \\text{centroid}(\\text{cluster}_k) \\quad \\forall i \\in \\text{cluster}_k$$</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">URV'nin MDAV (Maximum Distance to Average Vector) algoritması en uzak kaydı seçer, etrafında bir k-grup inşa eder, tekrarlar. Eurostat'ın μ-ARGUS'unda ve R paketi sdcMicro'da de facto standarttır. Domingo-Ferrer'in grubu 1998'den bu yana SDC üzerine 200'den fazla makale yayımladı — URV Tarragona'yı alanın küresel merkezi yaptı.</div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">df_churn üzerinde sklearn KMeans ile microaggregation — URV imza yöntemi</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_churn.<span class="fn">copy</span>()
QI = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
k = <span class="num">5</span>

X = df[QI].values.<span class="fn">astype</span>(<span class="fn">float</span>)
n_clusters = <span class="fn">max</span>(<span class="num">1</span>, <span class="fn">len</span>(df) // k)              <span class="cm"># kume basina ~k kayit</span>
scaler = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X)
Xs = scaler.<span class="fn">transform</span>(X)

km = <span class="fn">KMeans</span>(n_clusters=n_clusters, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xs)
labels = km.labels_

<span class="cm"># Her kaydin QI'lerini kume centroid'i ile degistir (orijinal olcekte)</span>
centroids_orig = scaler.<span class="fn">inverse_transform</span>(km.cluster_centers_)
df_micro = df.<span class="fn">copy</span>()
df_micro[QI] = centroids_orig[labels]

<span class="cm"># k-anonymity dogrula</span>
group_sizes = df_micro.<span class="fn">groupby</span>(QI).<span class="fn">size</span>()
<span class="fn">print</span>(f<span class="str">"Cluster count: {n_clusters}"</span>)
<span class="fn">print</span>(f<span class="str">"Min group size: {group_sizes.min()}  (target k = {k})"</span>)
<span class="fn">print</span>(f<span class="str">"Mean of original tenure:    {df['tenure_months'].mean():.2f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean after microaggregation: {df_micro['tenure_months'].mean():.2f}"</span>)
<span class="fn">print</span>(<span class="str">"Correlation preservation:"</span>)
<span class="fn">print</span>(<span class="str">"  Original:    "</span>, np.<span class="fn">corrcoef</span>(df[<span class="str">'tenure_months'</span>], df[<span class="str">'monthly_charge'</span>])[<span class="num">0</span>,<span class="num">1</span>].<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"  Microaggreg: "</span>, np.<span class="fn">corrcoef</span>(df_micro[<span class="str">'tenure_months'</span>], df_micro[<span class="str">'monthly_charge'</span>])[<span class="num">0</span>,<span class="num">1</span>].<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) kayıtları gruplara ayırmak için sklearn KMeans kümelemesi koşturur (MDAV mikroagregasyon yaklaşımının iş atı). 3) üyelik-çıkarımı riskini sınırlarken marjinalleri koruyan tablosal veri sentezleyen bir üretici (CTGAN / DP-CTGAN) eğitir.</p>
</div>
<p class="l-text">Dikkat edin: ortalamalar tam olarak korunur, korelasyonlar neredeyse mükemmel. Değerleri aralık dizgileriyle değiştiren — sonraki regresyon için işe yaramaz olan — Mondrian genellemesi ile karşılaştırın. Microaggregation, istatistikçilerin daha fazla analiz için veri yayımlamaları gerektiğinde doğru araçtır.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. p-Sensitive k-Anonymity</h2>
<p class="l-text">Truta ve Vinay (PDM 2006), Domingo-Ferrer ve diğerleri tarafından rafine edildi, <em>p-sensitive k-anonymity</em>'yi tanıttı: her denklik sınıfı en az p farklı hassas değer içermelidir. Microaggregation ile doğal olarak birleşir — önce QI'ler üzerinde k-anonymity elde etmek için kümele, sonra hassas sütunda p-farklılığını kontrol et veya zorla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="cm"># Microaggregated frame'de p-sensitive k-anonymity kontrol et</span>
QI = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
<span class="kw">def</span> <span class="fn">p_sensitive</span>(df, qi, sensitive, p):
    sizes = df.<span class="fn">groupby</span>(qi)[sensitive].<span class="fn">nunique</span>()
    violators = (sizes &lt; p).<span class="fn">sum</span>()
    <span class="kw">return</span> violators, sizes.<span class="fn">min</span>()

violators, p_min = <span class="fn">p_sensitive</span>(df_micro, QI, <span class="str">'churned'</span>, p=<span class="num">2</span>)
<span class="fn">print</span>(f<span class="str">"Groups violating p=2:  {violators}"</span>)
<span class="fn">print</span>(f<span class="str">"Min sensitive-value count: {p_min}"</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) üyelik-çıkarımı riskini sınırlarken marjinalleri koruyan tablosal veri sentezleyen bir üretici (CTGAN / DP-CTGAN) eğitir.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. k-Anonymity vs Diferansiyel Gizlilik</h2>
<p class="l-text">Uzun süredir devam eden bir tartışma. Diferansiyel gizlilik savunucuları (Dwork, Hardt) k-anonymity'nin bilinmeyen yardımcı bilgiye karşı formal bir garanti sunmadığını savunur. k-anonymity savunucuları (Domingo-Ferrer, Sweeney, Sánchez), DP'nin sözdizimsel anonimleştirmenin istatistikleri koruduğu sayım/microdata yayımları için faydayı yok ettiğini savunur. <em>2020 ABD Sayımı</em> tablo yayımları için DP'yi gönderdi ama Public Use Microdata Sample için geleneksel SDC'yi (microaggregation dahil) kullanır. Her ikisi de üretimde dağıtılır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">k-anonymity</div><div class="card-body">Sözdizimsel. Veri faydasını korur. Yardımcı bilgiye karşı formal sınır yok. URV / Eurostat / Census PUMS.</div></div>
<div class="calc-card"><div class="card-title">Diferansiyel gizlilik</div><div class="card-body">Semantik. Formal garanti. Toplamlarda önemli fayda maliyeti. ABD Sayımı 2020 tablolama, Apple, Google.</div></div>
<div class="calc-card"><div class="card-title">Hibrit (URV güncel)</div><div class="card-body">DP ön işlemesi olarak microaggregation — Soria-Comas, Domingo-Ferrer 2014. Microdata için her iki dünyanın en iyisi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Üretim Araçları</h2>
<p class="l-text">Üç savaş-test edilmiş araç. <em>ARX</em> (Prasser ve Kohlmayer, TU Munich) — Java, GUI, k-anonymity, l-diversity, t-closeness, DP destekler. <em>sdcMicro</em> (Templ ve Meindl) — Eurostat tarafından kullanılan R paketi, URV'nin MDAV microaggregation'ını içerir. <em>μ-ARGUS</em> — Hollanda İstatistikleri'nin klasik SDC aracı. Boru hatları için: <code>amnesia</code> (web tabanlı), <code>pycanon</code> (Python, bir frame üzerinde k/l/t metriklerini değerlendirir). Yayımlamadan önce her zaman gerçek yardımcı veri üzerinde doğrulayın — Sweeney'in 1997 saldırısı seçmen kayıtlarını kullandı; bugünün saldırganları veri brokerlarını ve ihlal edilmiş kimlik bilgisi veritabanlarını kullanır.</p>
</div>`
};
