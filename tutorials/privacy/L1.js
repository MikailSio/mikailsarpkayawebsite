window.PRIVACY_L1 = {
en: `<p class="l-text">In 2007, Netflix released an "anonymized" dataset of 500,000 users for its $1M recommendation prize. Within weeks, Narayanan &amp; Shmatikov re-identified subscribers by cross-referencing IMDb ratings — proving that removing names is not anonymization. Two years earlier the AOL search-log release had already named user 4417749 (Thelma Arnold) on the front page of the New York Times. The lesson: <em>any function of a dataset leaks information about its individuals</em>, and the leakage can be reconstructed by an adversary with side knowledge. We need a mathematical definition that quantifies this leakage and degrades gracefully as we run more queries.</p>
<p class="l-text">In 2006, Cynthia Dwork, Frank McSherry, Kobbi Nissim and Adam Smith proposed exactly that — <strong>differential privacy</strong> — in their paper "Calibrating Noise to Sensitivity in Private Data Analysis" (TCC 2006). DP is not a technique; it is a <em>property</em> of an algorithm: the algorithm's output distribution must be nearly identical whether or not any single record is in the input. The "nearly" is governed by a privacy budget ε. Today DP underpins the U.S. Census Bureau's 2020 release, Apple's keyboard analytics, Google Chrome's RAPPOR, Microsoft's SmartNoise, and is the legal basis for "anonymization" under emerging interpretations of GDPR. This lesson defines DP rigorously and gives you a working Pyodide demo of the Laplace mechanism on real data.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The ε-DP definition (Dwork et al. 2006) and what "neighboring datasets" means</li>
<li>Sensitivity Δf and why it controls the noise scale</li>
<li>(ε,δ)-DP and when the relaxation is needed</li>
<li>Composition: basic (k·ε), advanced (sqrt-k), and the post-processing theorem</li>
<li>Group privacy: what DP guarantees for k correlated records</li>
<li>Hands-on Laplace mechanism on df_churn — see the privacy-utility tradeoff live</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Re-Identification Wake-Up Call</h2>
<p class="l-text">Three landmark attacks made DP necessary. (1) Sweeney 1997: 87% of Americans uniquely identified by {ZIP, birthdate, sex} alone — she re-identified Massachusetts Governor William Weld in a "de-identified" hospital release. (2) AOL 2006: 20M search queries from 650K users released under random IDs; Thelma Arnold (user 4417749) named within days. (3) Netflix Prize 2007: Narayanan &amp; Shmatikov 2008 used IMDb to re-identify subscribers from supposedly anonymized rating histories.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Dinur-Nissim 2003 proved a stronger fact: if you answer enough queries about a dataset of n records to <em>any</em> non-trivial accuracy, you can reconstruct the entire dataset. Releasing exact statistics is fundamentally incompatible with privacy. The only escape is calibrated noise.</div>
<p class="l-text">k-anonymity (Sweeney 2002), l-diversity (Machanavajjhala 2007), and t-closeness (Li 2007) were attempts to formalize "anonymized." They are syntactic — they constrain the released table — and we cover them in Lesson 6. DP is <em>semantic</em>: it constrains the algorithm itself.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. The ε-DP Definition</h2>
<p class="l-text">Two datasets D and D' are <em>neighboring</em> if they differ by exactly one record (one row added, removed, or changed). A randomized algorithm M satisfies ε-differential privacy if for every pair of neighboring D, D' and every measurable set S of outputs:</p>
<div class="katex-block">$$\\Pr[M(D) \\in S] \\leq e^{\\varepsilon} \\cdot \\Pr[M(D') \\in S]$$</div>
<p class="l-text">Read it: "the probability of any output is multiplicatively at most e^ε different whether or not your record is in the database." If ε=0 the two distributions are identical and your record is invisible (but the output is also useless). If ε=∞ there is no privacy. Practical ε ranges from 0.1 (very strict) to 10 (loose).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why multiplicative?</div><div class="card-body">Additive bounds break under composition. Multiplicative ratios compose linearly in log-space and survive post-processing.</div></div>
<div class="calc-card"><div class="card-title">"Neighboring"</div><div class="card-body">Two flavors: <em>add/remove</em> (unbounded DP) and <em>replace</em> (bounded DP). They differ by a factor of 2 in sensitivity.</div></div>
<div class="calc-card"><div class="card-title">Worst case over D, D'</div><div class="card-body">DP is a <em>guarantee for everyone</em>, including the adversary's best target. No assumption about data distribution or attacker side info.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Sensitivity — The Quantity That Sets the Noise</h2>
<p class="l-text">For a query f: Datasets → ℝ^d, its global L1 sensitivity is the maximum change one record can cause:</p>
<div class="katex-block">$$\\Delta f = \\max_{D \\sim D'} \\| f(D) - f(D') \\|_1$$</div>
<p class="l-text">Examples: counting query has Δf=1 (one record can change the count by at most 1). Sum of incomes (each capped at $1M) has Δf=$1M. Mean has Δf = (range)/n. Median has high worst-case sensitivity but low local sensitivity (the smooth-sensitivity literature, Nissim-Raskhodnikova-Smith 2007, exploits this).</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">The fundamental DP recipe: <strong>noise scale ∝ Δf / ε</strong>. Higher sensitivity → more noise. Smaller budget → more noise. This is why we always <em>clip</em> contributions before summing — clipping caps Δf at the clip threshold.</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. The Laplace Mechanism (Hands-On)</h2>
<p class="l-text">Theorem (Dwork-McSherry-Nissim-Smith 2006): if f has L1 sensitivity Δf, then M(D) = f(D) + Lap(Δf/ε) is ε-DP, where Lap(b) is i.i.d. Laplace noise with scale b (mean 0, variance 2b²).</p>
<div class="katex-block">$$M(D) = f(D) + \\text{Lap}(\\Delta f / \\varepsilon)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Real query: how many customers churned?</span>
true_count = <span class="fn">int</span>(df_churn[<span class="str">'churned'</span>].<span class="fn">sum</span>())
n = <span class="fn">len</span>(df_churn)
<span class="fn">print</span>(f<span class="str">"True churn count: {true_count} out of {n}"</span>)

<span class="cm"># Counting query has sensitivity = 1</span>
sensitivity = <span class="num">1.0</span>

<span class="kw">for</span> eps <span class="kw">in</span> [<span class="num">0.1</span>, <span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">5.0</span>]:
    np.random.<span class="fn">seed</span>(<span class="num">42</span>)
    samples = [true_count + np.random.<span class="fn">laplace</span>(<span class="num">0</span>, sensitivity/eps) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1000</span>)]
    err = np.<span class="fn">std</span>(samples)
    <span class="fn">print</span>(f<span class="str">"epsilon={eps:>4}:  noisy mean={np.mean(samples):7.1f}  std={err:6.2f}  (true={true_count})"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads the churn dataset and computes the true count via <code>df_churn['churned'].sum()</code>. 2) sets the counting query's sensitivity to <code>1.0</code> (one record flips the count by at most one). 3) for each privacy budget <code>eps</code>, derives the noise scale <code>sensitivity/eps</code>. 4) draws 1000 i.i.d. Laplace samples with <code>np.random.laplace(0, scale)</code> and adds them to the true count. 5) prints the noisy mean and standard deviation alongside the true value so you can read the privacy-utility tradeoff directly.</p>
<p class="l-text">Run it. ε=0.1 produces noise of ~14 (very private, very noisy); ε=5 produces noise of ~0.3 (sharp answer, weak privacy). The privacy-utility tradeoff in one screen.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. (ε,δ)-DP — The Useful Relaxation</h2>
<p class="l-text">Pure ε-DP is sometimes too strict. (ε,δ)-DP allows a small failure probability δ:</p>
<div class="katex-block">$$\\Pr[M(D) \\in S] \\leq e^{\\varepsilon} \\Pr[M(D') \\in S] + \\delta$$</div>
<p class="l-text">δ should be cryptographically small — typically δ ≪ 1/n. The Gaussian mechanism (Lesson 2) is naturally (ε,δ)-DP, not pure ε-DP, because Gaussian tails never hit exactly zero. Most ML applications (DP-SGD, federated learning) use (ε,δ)-DP because Gaussian noise composes much better than Laplace via Renyi DP and the moments accountant.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pure DP (δ=0)</div><div class="card-body">Strongest. Laplace, exponential, randomized response. Composes loosely.</div></div>
<div class="calc-card"><div class="card-title">Approximate DP (δ&gt;0)</div><div class="card-body">Gaussian, sub-sampled mechanisms. Tight composition via Renyi DP / zCDP.</div></div>
<div class="calc-card"><div class="card-title">Concentrated DP</div><div class="card-body">Bun-Steinke 2016. Tighter middle ground for ML training.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Post-Processing Immunity</h2>
<p class="l-text">Theorem: if M is ε-DP and g is any (data-independent) function, then g∘M is also ε-DP. You cannot un-private already private output by post-processing it. This is huge: once you publish a private histogram, anyone can compute averages, fit models, draw plots — all of those derived statistics inherit the same privacy guarantee.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Post-processing is why DP is the gold standard: privacy is sealed at the moment of release. Compare with k-anonymity, where joining two k-anonymous tables can break k-anonymity completely (Ganta-Kasiviswanathan-Smith 2008, "composition attacks").</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Composition — The Privacy Budget</h2>
<p class="l-text">If you run M1 (ε1-DP) then M2 (ε2-DP), the joint release is (ε1+ε2)-DP. This is <em>basic composition</em>: budgets add. Run k queries each at ε per query and you spend kε total.</p>
<div class="katex-block">$$\\text{Basic: } \\varepsilon_{\\text{total}} = \\sum_i \\varepsilon_i$$</div>
<p class="l-text">Advanced composition (Dwork-Rothblum-Vadhan 2010) shows that for k queries, the total privacy is roughly ε_total ≈ ε·sqrt(2k·ln(1/δ')) — the budget grows like sqrt(k), not k. This is the entire reason DP-SGD with thousands of gradient steps is feasible.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Compare basic vs advanced composition for k queries at eps_per_query = 0.1</span>
eps = <span class="num">0.1</span>
delta_prime = <span class="num">1e-5</span>

<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">10</span>, <span class="num">100</span>, <span class="num">1000</span>, <span class="num">10000</span>]:
    basic = k * eps
    advanced = eps * np.<span class="fn">sqrt</span>(<span class="num">2</span> * k * np.<span class="fn">log</span>(<span class="num">1</span>/delta_prime)) + k * eps * (np.<span class="fn">exp</span>(eps) - <span class="num">1</span>)
    <span class="fn">print</span>(f<span class="str">"k={k:>5}:  basic eps={basic:8.2f}   advanced eps={advanced:6.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fixes the per-query budget <code>eps=0.1</code> and the slack <code>delta_prime=1e-5</code>. 2) iterates over query counts <code>k</code> from 10 to 10,000. 3) computes the basic composition bound <code>k*eps</code> (budgets add linearly). 4) computes the advanced composition bound <code>eps*sqrt(2k*ln(1/delta_prime)) + k*eps*(exp(eps)-1)</code>, which grows like √k instead of k. 5) prints both totals side by side so you can see when advanced composition saves orders of magnitude of budget.</p>
<p class="l-text">For k=10,000 the basic bound says ε=1000 (useless), advanced says ε≈4.8 (still meaningful). Modern accountants (Renyi DP, Gaussian DP, PRV — Privacy Random Variables) tighten this further.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Group Privacy</h2>
<p class="l-text">If M is ε-DP for individuals, what about groups of k correlated records (e.g., a family)? Theorem: M is (kε)-DP for groups of size k. The protection degrades linearly. This matters for households, longitudinal data, or multi-record contributions.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">In the U.S. Census 2020, the bureau used DP to protect <em>individuals</em>, not households. Households of size k get ε·k privacy. Critics argued this was insufficient for small minority populations; the bureau responded by tuning ε per query type and adding additional safeguards. This was the largest DP deployment ever (327M people, $14.7B in funding allocations depend on it).</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Real Deployments (Pre-2026)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">U.S. Census 2020</div><div class="card-body">Disclosure Avoidance System with global ε ≈ 19. First mandated DP release at this scale.</div></div>
<div class="calc-card"><div class="card-title">Apple iOS</div><div class="card-body">Local DP for emoji frequency, keyboard analytics. ε per day per user, large daily budget.</div></div>
<div class="calc-card"><div class="card-title">Google Chrome RAPPOR</div><div class="card-body">Erlingsson-Pihur-Korolova 2014. Local DP via randomized response on bloom-filter sketches.</div></div>
<div class="calc-card"><div class="card-title">LinkedIn</div><div class="card-body">Audience engagement API. Central DP via Laplace + budget tracking.</div></div>
<div class="calc-card"><div class="card-title">Microsoft SmartNoise</div><div class="card-body">Open-source DP runtime built on OpenDP. Used in healthcare and gov contracts.</div></div>
<div class="calc-card"><div class="card-title">Meta</div><div class="card-body">URL-level DP analytics for advertising; first replacement for IDFA-style cookies.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. What's Next</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Lesson 2 builds the full mechanism toolkit: Laplace, Gaussian (with Renyi DP &amp; zCDP), exponential mechanism for selection, Report Noisy Max, sparse vector technique, RAPPOR. Lesson 3 puts them inside SGD to train neural nets. Lesson 6 — the URV-CRISES flagship — covers k-anonymity, l-diversity, and Domingo-Ferrer's signature method: <strong>microaggregation</strong>.</div>
<p class="l-text">Reading: Dwork &amp; Roth, <em>The Algorithmic Foundations of Differential Privacy</em> (2014, free); Vadhan, <em>The Complexity of Differential Privacy</em> (2017); Wood et al., <em>Differential Privacy: A Primer for a Non-Technical Audience</em> (Vanderbilt 2018).</p>
</div>`,
tr: `<p class="l-text">2007'de Netflix, 1 milyon dolarlık öneri ödülü için 500.000 kullanıcının "anonimleştirilmiş" bir veri setini yayımladı. Birkaç hafta içinde Narayanan ve Shmatikov, IMDb derecelendirmeleriyle çapraz referansla aboneleri yeniden tanımladı — adların kaldırılmasının anonimleştirme olmadığını kanıtladı. İki yıl önce AOL arama günlüğü yayımı zaten New York Times'ın ön sayfasında 4417749 numaralı kullanıcıyı (Thelma Arnold) isimlendirmişti. Ders şudur: <em>bir veri setinin herhangi bir fonksiyonu, bireyleri hakkında bilgi sızdırır</em> ve sızıntı yan bilgiye sahip bir düşman tarafından yeniden inşa edilebilir. Bu sızıntıyı niceliklendiren ve daha fazla sorgu çalıştırdıkça zarif şekilde bozulan matematiksel bir tanıma ihtiyacımız var.</p>
<p class="l-text">2006'da Cynthia Dwork, Frank McSherry, Kobbi Nissim ve Adam Smith tam olarak bunu önerdi — <strong>differential privacy (diferansiyel gizlilik, DP)</strong> — "Calibrating Noise to Sensitivity in Private Data Analysis" makalesinde (TCC 2006). DP bir teknik değildir; bir algoritmanın bir <em>özelliği</em>'dir: algoritmanın çıktı dağılımı, herhangi bir tek kayıt girdide olsun ya da olmasın, neredeyse aynı olmalıdır. "Neredeyse" bir gizlilik bütçesi ε tarafından yönetilir. Bugün DP, ABD Sayım Bürosu'nun 2020 yayımının, Apple'ın klavye analitiğinin, Google Chrome'un RAPPOR'unun, Microsoft'un SmartNoise'ının altını çizer ve GDPR'ın yorumlarına göre "anonimleştirme"nin yasal temelidir. Bu ders DP'yi titizlikle tanımlar ve gerçek veri üzerinde Laplace mekanizmasının çalışan bir Pyodide demosunu verir.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>ε-DP tanımı (Dwork vd. 2006) ve "komşu veri setleri"nin anlamı</li>
<li>Hassasiyet Δf ve gürültü ölçeğini neden kontrol ettiği</li>
<li>(ε,δ)-DP ve gevşemenin ne zaman gerekli olduğu</li>
<li>Kompozisyon: temel (k·ε), ileri (sqrt-k) ve son işleme teoremi</li>
<li>Grup gizliliği: DP'nin k korelasyonlu kayıt için ne garanti ettiği</li>
<li>df_churn üzerinde Laplace mekanizması — gizlilik-fayda dengelemesini canlı görün</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Yeniden Tanımlama Uyandırma Çağrısı</h2>
<p class="l-text">DP'yi gerekli kılan üç dönüm noktası saldırı vardı. (1) Sweeney 1997: Amerikalıların %87'si yalnızca {posta kodu, doğum tarihi, cinsiyet} ile benzersiz şekilde tanımlandı — Massachusetts Valisi William Weld'i "kimlikten arındırılmış" bir hastane yayımında yeniden tanımladı. (2) AOL 2006: 650K kullanıcıdan 20M arama sorgusu rastgele kimliklerle yayımlandı; Thelma Arnold (kullanıcı 4417749) günler içinde isimlendirildi. (3) Netflix Ödülü 2007: Narayanan ve Shmatikov 2008, sözde anonimleştirilmiş derecelendirme geçmişlerinden aboneleri yeniden tanımlamak için IMDb'yi kullandı.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Dinur-Nissim 2003 daha güçlü bir gerçeği kanıtladı: n kayıtlı bir veri seti hakkında <em>herhangi</em> bir önemsiz olmayan doğrulukta yeterince soru yanıtlarsanız, tüm veri setini yeniden inşa edebilirsiniz. Tam istatistikleri yayımlamak gizlilikle temelden uyumsuzdur. Tek kaçış kalibre edilmiş gürültüdür.</div>
<p class="l-text">k-anonymity (Sweeney 2002), l-diversity (Machanavajjhala 2007) ve t-closeness (Li 2007) "anonimleştirilmiş"i resmileştirme girişimleriydi. Sözdizimseldirler — yayımlanmış tabloyu kısıtlarlar — ve onları Ders 6'da ele alıyoruz. DP <em>semantiktir</em>: algoritmanın kendisini kısıtlar.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. ε-DP Tanımı</h2>
<p class="l-text">İki veri seti D ve D', tam olarak bir kayıtta farklılık gösteriyorlarsa (bir satır eklenmiş, kaldırılmış veya değiştirilmiş) <em>komşu</em>'durlar. Rastgele bir algoritma M, her komşu D, D' çifti ve her ölçülebilir çıktı kümesi S için ε-diferansiyel gizliliği şu durumda karşılar:</p>
<div class="katex-block">$$\\Pr[M(D) \\in S] \\leq e^{\\varepsilon} \\cdot \\Pr[M(D') \\in S]$$</div>
<p class="l-text">Şöyle okuyun: "herhangi bir çıktının olasılığı, kaydınız veritabanında olsun ya da olmasın çarpımsal olarak en fazla e^ε farklıdır." ε=0 ise iki dağılım özdeştir ve kaydınız görünmezdir (ama çıktı da işe yaramazdır). ε=∞ ise gizlilik yoktur. Pratik ε aralığı 0.1 (çok katı) ile 10 (gevşek) arasındadır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden çarpımsal?</div><div class="card-body">Toplamsal sınırlar kompozisyon altında bozulur. Çarpımsal oranlar log-uzayda doğrusal olarak birleşir ve son işlemeden sağ çıkar.</div></div>
<div class="calc-card"><div class="card-title">"Komşu"</div><div class="card-body">İki türü vardır: <em>ekle/kaldır</em> (sınırsız DP) ve <em>değiştir</em> (sınırlı DP). Hassasiyette 2 faktörü kadar farklılar.</div></div>
<div class="calc-card"><div class="card-title">D, D' üzerinde en kötü durum</div><div class="card-body">DP, düşmanın en iyi hedefi de dahil <em>herkes için bir garantidir</em>. Veri dağılımı veya saldırgan yan bilgisi hakkında varsayım yoktur.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Hassasiyet — Gürültüyü Belirleyen Nicelik</h2>
<p class="l-text">Bir sorgu f: Veri Setleri → ℝ^d için, küresel L1 hassasiyeti, bir kaydın yapabileceği maksimum değişikliktir:</p>
<div class="katex-block">$$\\Delta f = \\max_{D \\sim D'} \\| f(D) - f(D') \\|_1$$</div>
<p class="l-text">Örnekler: sayma sorgusunun Δf=1'dir (bir kayıt sayımı en fazla 1 değiştirebilir). Gelirlerin toplamı (her biri $1M ile sınırlı) Δf=$1M'dir. Ortalama Δf = (aralık)/n'dir. Medyanın yüksek en-kötü-durum hassasiyeti vardır ama düşük yerel hassasiyeti vardır (smooth-sensitivity literatürü, Nissim-Raskhodnikova-Smith 2007 bunu kullanır).</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Temel DP tarifi: <strong>gürültü ölçeği ∝ Δf / ε</strong>. Daha yüksek hassasiyet → daha fazla gürültü. Daha küçük bütçe → daha fazla gürültü. Bu yüzden katkıları toplamadan önce her zaman <em>kırpıyoruz</em> — kırpma Δf'yi kırpma eşiğinde sınırlar.</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Laplace Mekanizması (Uygulamalı)</h2>
<p class="l-text">Teorem (Dwork-McSherry-Nissim-Smith 2006): f'in L1 hassasiyeti Δf ise, M(D) = f(D) + Lap(Δf/ε) ε-DP'dir; burada Lap(b), ölçek b ile bağımsız ve eşit dağılımlı Laplace gürültüsüdür (ortalama 0, varyans 2b²).</p>
<div class="katex-block">$$M(D) = f(D) + \\text{Lap}(\\Delta f / \\varepsilon)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Gerçek sorgu: kaç müşteri ayrıldı?</span>
true_count = <span class="fn">int</span>(df_churn[<span class="str">'churned'</span>].<span class="fn">sum</span>())
n = <span class="fn">len</span>(df_churn)
<span class="fn">print</span>(f<span class="str">"True churn count: {true_count} out of {n}"</span>)

<span class="cm"># Sayma sorgusu hassasiyeti = 1</span>
sensitivity = <span class="num">1.0</span>

<span class="kw">for</span> eps <span class="kw">in</span> [<span class="num">0.1</span>, <span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">5.0</span>]:
    np.random.<span class="fn">seed</span>(<span class="num">42</span>)
    samples = [true_count + np.random.<span class="fn">laplace</span>(<span class="num">0</span>, sensitivity/eps) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1000</span>)]
    err = np.<span class="fn">std</span>(samples)
    <span class="fn">print</span>(f<span class="str">"epsilon={eps:>4}:  noisy mean={np.mean(samples):7.1f}  std={err:6.2f}  (true={true_count})"</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) churn veri setini yükler ve gerçek sayımı <code>df_churn['churned'].sum()</code> ile hesaplar. 2) sayma sorgusunun hassasiyetini <code>1.0</code> olarak belirler (tek bir kayıt sayımı en fazla bir değiştirir). 3) her gizlilik bütçesi <code>eps</code> için gürültü ölçeğini <code>sensitivity/eps</code> formülünden türetir. 4) <code>np.random.laplace(0, scale)</code> ile 1000 bağımsız Laplace örneği çeker ve bunları gerçek sayıma ekler. 5) gerçek değerle birlikte gürültülü ortalama ile standart sapmayı yazdırır; böylece gizlilik-fayda dengelemesini doğrudan okuyabilirsiniz.</p>
<p class="l-text">Çalıştırın. ε=0.1 ~14 gürültü üretir (çok gizli, çok gürültülü); ε=5 ~0.3 gürültü üretir (keskin yanıt, zayıf gizlilik). Tek ekranda gizlilik-fayda dengelemesi.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. (ε,δ)-DP — Yararlı Gevşeme</h2>
<p class="l-text">Saf ε-DP bazen çok katıdır. (ε,δ)-DP küçük bir başarısızlık olasılığı δ'ye izin verir:</p>
<div class="katex-block">$$\\Pr[M(D) \\in S] \\leq e^{\\varepsilon} \\Pr[M(D') \\in S] + \\delta$$</div>
<p class="l-text">δ kriptografik olarak küçük olmalıdır — tipik olarak δ ≪ 1/n. Gauss mekanizması (Ders 2) doğal olarak (ε,δ)-DP'dir, saf ε-DP değil; çünkü Gauss kuyrukları asla tam olarak sıfıra ulaşmaz. Çoğu ML uygulaması (DP-SGD, federe öğrenme) (ε,δ)-DP kullanır çünkü Gauss gürültüsü Renyi DP ve moments accountant ile Laplace'tan çok daha iyi birleşir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Saf DP (δ=0)</div><div class="card-body">En güçlü. Laplace, üstel, randomize edilmiş yanıt. Gevşek birleşir.</div></div>
<div class="calc-card"><div class="card-title">Yaklaşık DP (δ&gt;0)</div><div class="card-body">Gauss, alt-örneklenmiş mekanizmalar. Renyi DP / zCDP ile sıkı kompozisyon.</div></div>
<div class="calc-card"><div class="card-title">Yoğunlaştırılmış DP</div><div class="card-body">Bun-Steinke 2016. ML eğitimi için daha sıkı orta yol.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Son İşleme Bağışıklığı</h2>
<p class="l-text">Teorem: M ε-DP ise ve g herhangi bir (veriden bağımsız) fonksiyon ise, g∘M de ε-DP'dir. Zaten gizli bir çıktıyı son işlemeyle gizli olmaktan çıkaramazsınız. Bu büyük: bir kez gizli bir histogram yayımladığınızda, herkes ortalamaları hesaplayabilir, modelleri uydurabilir, çizimler yapabilir — bu türetilmiş istatistiklerin hepsi aynı gizlilik garantisini miras alır.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Son işleme, DP'nin altın standart olmasının nedenidir: gizlilik yayım anında mühürlenir. k-anonymity ile karşılaştırın; orada iki k-anonim tabloyu birleştirmek k-anonymity'yi tamamen bozabilir (Ganta-Kasiviswanathan-Smith 2008, "kompozisyon saldırıları").</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Kompozisyon — Gizlilik Bütçesi</h2>
<p class="l-text">M1 (ε1-DP) sonra M2 (ε2-DP) çalıştırırsanız, ortak yayım (ε1+ε2)-DP'dir. Bu <em>temel kompozisyon</em>'dur: bütçeler toplanır. Sorgu başına ε ile k sorgu çalıştırın ve toplam kε harcarsınız.</p>
<div class="katex-block">$$\\text{Basic: } \\varepsilon_{\\text{total}} = \\sum_i \\varepsilon_i$$</div>
<p class="l-text">İleri kompozisyon (Dwork-Rothblum-Vadhan 2010), k sorgu için toplam gizliliğin yaklaşık ε_total ≈ ε·sqrt(2k·ln(1/δ')) olduğunu gösterir — bütçe k değil sqrt(k) gibi büyür. DP-SGD'nin binlerce gradyan adımıyla mümkün olmasının tüm nedeni budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Sorgu başına eps_per_query = 0.1 için temel vs ileri kompozisyon karşılaştırması</span>
eps = <span class="num">0.1</span>
delta_prime = <span class="num">1e-5</span>

<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">10</span>, <span class="num">100</span>, <span class="num">1000</span>, <span class="num">10000</span>]:
    basic = k * eps
    advanced = eps * np.<span class="fn">sqrt</span>(<span class="num">2</span> * k * np.<span class="fn">log</span>(<span class="num">1</span>/delta_prime)) + k * eps * (np.<span class="fn">exp</span>(eps) - <span class="num">1</span>)
    <span class="fn">print</span>(f<span class="str">"k={k:>5}:  basic eps={basic:8.2f}   advanced eps={advanced:6.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) sorgu başına bütçeyi <code>eps=0.1</code> ve gevşemeyi <code>delta_prime=1e-5</code> olarak sabitler. 2) sorgu sayısı <code>k</code>'yı 10'dan 10.000'e kadar gezer. 3) temel kompozisyon sınırını <code>k*eps</code> olarak hesaplar (bütçeler doğrusal toplanır). 4) ileri kompozisyon sınırını <code>eps*sqrt(2k*ln(1/delta_prime)) + k*eps*(exp(eps)-1)</code> olarak hesaplar; bu sınır k yerine √k gibi büyür. 5) iki bütçeyi yan yana yazdırır; böylece ileri kompozisyonun ne zaman büyüklük mertebeleri kadar bütçe kazandırdığını görebilirsiniz.</p>
<p class="l-text">k=10.000 için temel sınır ε=1000 der (işe yaramaz), ileri ε≈4.8 der (hâlâ anlamlı). Modern muhasebeciler (Renyi DP, Gauss DP, PRV — Privacy Random Variables) bunu daha da sıkar.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Grup Gizliliği</h2>
<p class="l-text">M, bireyler için ε-DP ise, k korelasyonlu kayıttan oluşan gruplar (ör. bir aile) için ne diyor? Teorem: M, k boyutundaki gruplar için (kε)-DP'dir. Koruma doğrusal olarak bozulur. Bu, haneler, boylamsal veriler veya çoklu-kayıt katkıları için önemlidir.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">ABD Sayımı 2020'de büro DP'yi haneleri değil <em>bireyleri</em> korumak için kullandı. k boyutlu haneler ε·k gizlilik elde eder. Eleştirmenler küçük azınlık nüfusları için yetersiz olduğunu öne sürdü; büro sorgu tipine göre ε'yi ayarlayarak ve ek korumalar ekleyerek yanıt verdi. Bu, şimdiye kadarki en büyük DP dağıtımıydı (327M insan, $14.7B fonlama tahsisleri buna bağlı).</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Gerçek Dağıtımlar (2026 Öncesi)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ABD Sayımı 2020</div><div class="card-body">Disclosure Avoidance System ile küresel ε ≈ 19. Bu ölçekte zorunlu kılınan ilk DP yayımı.</div></div>
<div class="calc-card"><div class="card-title">Apple iOS</div><div class="card-body">Emoji frekansı, klavye analitiği için yerel DP. Kullanıcı başına gün başına ε, büyük günlük bütçe.</div></div>
<div class="calc-card"><div class="card-title">Google Chrome RAPPOR</div><div class="card-body">Erlingsson-Pihur-Korolova 2014. Bloom-filtre eskizleri üzerinde randomize yanıt ile yerel DP.</div></div>
<div class="calc-card"><div class="card-title">LinkedIn</div><div class="card-body">Audience engagement API. Laplace + bütçe takibi ile merkezi DP.</div></div>
<div class="calc-card"><div class="card-title">Microsoft SmartNoise</div><div class="card-body">OpenDP üzerine kurulmuş açık kaynak DP runtime. Sağlık ve devlet sözleşmelerinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Meta</div><div class="card-body">Reklam için URL-seviyesi DP analitiği; IDFA-tarzı çerezlerin ilk yerine geçeni.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. Sıradaki</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Ders 2 tam mekanizma alet kutusunu inşa eder: Laplace, Gauss (Renyi DP &amp; zCDP ile), seçim için üstel mekanizma, Report Noisy Max, sparse vector technique, RAPPOR. Ders 3 onları sinir ağlarını eğitmek için SGD içine koyar. Ders 6 — URV-CRISES flagship — k-anonymity, l-diversity ve Domingo-Ferrer'in imza yöntemini kapsar: <strong>microaggregation</strong>.</div>
<p class="l-text">Okuma: Dwork &amp; Roth, <em>The Algorithmic Foundations of Differential Privacy</em> (2014, ücretsiz); Vadhan, <em>The Complexity of Differential Privacy</em> (2017); Wood vd., <em>Differential Privacy: A Primer for a Non-Technical Audience</em> (Vanderbilt 2018).</p>
</div>`
};
