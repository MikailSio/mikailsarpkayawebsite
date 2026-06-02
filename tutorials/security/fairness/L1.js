window.FAIRNESS_L1 = {
en: `<p class="l-text">In 2016, ProPublica analyzed COMPAS, a risk-assessment tool used by U.S. courts to advise on bail and sentencing. Black defendants were nearly twice as likely as white defendants to be wrongly flagged as "high risk." Northpointe, the vendor, replied that calibration <em>was</em> equal across races. Both were right — and that single observation, formalized as the impossibility theorem (Chouldechova 2017, Kleinberg et al. 2017), reshaped fairness research forever.</p>
<p class="l-text">In 2018, Reuters revealed Amazon had built and quietly killed an internal hiring AI that systematically downgraded resumes mentioning "women's chess club" or all-women's colleges. In 2019, Obermeyer et al. published in <em>Science</em> that a healthcare-allocation algorithm used on 200 million Americans gave Black patients far less care than equally-sick white patients — because the proxy outcome (cost) encoded the systemic underspending on Black patients. ML doesn't have to be biased to harm — it can <em>amplify</em> the bias already in the data and the choice of label. This lesson is your motivating tour.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Three landmark cases: COMPAS, Amazon hiring, Obermeyer healthcare</li>
<li>How label choice (proxy) creates bias even with "neutral" features</li>
<li>Demographic parity, equalized odds, calibration — the three families</li>
<li>The impossibility theorem at a high level (formalized in Lesson 2)</li>
<li>How to run a basic disparity audit on a real classifier</li>
<li>The harm taxonomy: allocational vs. representational vs. quality-of-service</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Case Study 1 — COMPAS (Angwin et al. 2016)</h2>
<p class="l-text">COMPAS predicts recidivism risk on a 1-10 scale. ProPublica obtained 7,214 Broward County records and showed: among defendants who did NOT re-offend, Black defendants were classified high-risk at 45% vs. 23% for white. Among those who DID re-offend, Black defendants were classified low-risk at 28% vs. 48% for white. The error rates were demographically asymmetric.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Northpointe's defense (Dieterich et al. 2016): the score was <strong>calibrated</strong> — at any given risk score, the actual recidivism rate was the same for Black and white. <em>Both ProPublica and Northpointe were correct.</em> They were measuring different fairness criteria, and these criteria are mathematically incompatible when base rates differ.</div>
<p class="l-text">This was the empirical wake-up call. Chouldechova (2017) and Kleinberg, Mullainathan &amp; Raghavan (2017) independently proved you cannot satisfy calibration AND error-rate equality unless either base rates are equal across groups, or the model is perfect.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Case Study 2 — Amazon's Hiring Engine (Reuters 2018)</h2>
<p class="l-text">Amazon trained a resume-ranking model on 10 years of hiring data — predominantly male hires. The model learned: "candidates similar to past hires" = "men." It penalized "women's" anywhere on a resume, downgraded all-female colleges, and rewarded verbs more common in male-authored resumes ("executed," "captured").</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bias source</div><div class="card-body">Historical labels reflected past discrimination. The model didn't invent bias — it learned the bias that was already in "who got hired."</div></div>
<div class="calc-card"><div class="card-title">Sanitization fails</div><div class="card-body">Removing the word "women's" only nudges the model to other proxies (sport names, club names, location). High-dimensional text rediscovers the protected attribute.</div></div>
<div class="calc-card"><div class="card-title">Outcome</div><div class="card-body">Amazon disbanded the team in 2017. The lesson: protected-attribute removal is not debiasing.</div></div>
</div>
<p class="l-text">This is <em>proxy discrimination</em>: even without sensitive features, a model with rich-enough features learns the protected attribute implicitly (Datta et al. 2017).</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Case Study 3 — Healthcare Bias (Obermeyer et al. 2019, Science)</h2>
<p class="l-text">A widely-deployed algorithm used by U.S. hospitals to flag patients for "high-risk care management" used <strong>future healthcare costs</strong> as a proxy for "sickness." Sounds reasonable — sicker patients cost more, right? Wrong: Black patients receive less care for the same severity, so for any given severity their costs are lower. The algorithm therefore concluded Black patients were "less sick" and de-prioritized them.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Obermeyer found that at the same algorithmic risk score, Black patients had ~26% more chronic conditions than white patients. Switching the label from cost to actual chronic-disease count more than doubled the share of Black patients flagged for extra care. Affecting ~200M Americans, this is one of the largest known cases of algorithmic bias — caused entirely by the proxy label.</div>
<p class="l-text">Choosing a label is a <em>causal</em> claim about what you're trying to predict. If the label is downstream of the discrimination you fear, your model will encode that discrimination as signal.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. The Three Fairness Families</h2>
<p class="l-text">Most quantitative fairness criteria fall into three groups, each measuring a different conditional independence.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Group / Demographic Parity</div><div class="card-body">P(Ŷ=1 | A=0) = P(Ŷ=1 | A=1). Equal positive-prediction rate across groups. Independence: Ŷ ⊥ A.</div></div>
<div class="calc-card"><div class="card-title">Equalized Odds (Hardt 2016)</div><div class="card-body">P(Ŷ=1 | A=a, Y=y) equal across a, for both y=0 and y=1. Equal TPR and FPR. Separation: Ŷ ⊥ A | Y.</div></div>
<div class="calc-card"><div class="card-title">Predictive Parity / Calibration</div><div class="card-body">P(Y=1 | Ŷ=ŷ, A=a) equal across a. Equal positive predictive value. Sufficiency: Y ⊥ A | Ŷ.</div></div>
</div>
<div class="katex-block">$$\\text{Demographic parity: } P(\\hat{Y}=1 \\mid A=0) = P(\\hat{Y}=1 \\mid A=1)$$</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Lesson 2 dives deep into each metric and proves the impossibility theorem. Pick the criterion that matches your <em>harm model</em> — there is no universally right answer.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Hands-On Disparity Audit on Churn</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>()

<span class="cm"># Synthesize a sensitive attribute correlated with one of the features</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'region'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>] &gt; df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                        np.random.<span class="fn">choice</span>([<span class="str">'A'</span>,<span class="str">'B'</span>], size=<span class="fn">len</span>(df), p=[<span class="num">0.7</span>,<span class="num">0.3</span>]),
                        np.random.<span class="fn">choice</span>([<span class="str">'A'</span>,<span class="str">'B'</span>], size=<span class="fn">len</span>(df), p=[<span class="num">0.3</span>,<span class="num">0.7</span>]))
df[<span class="str">'A'</span>] = (df[<span class="str">'region'</span>]==<span class="str">'B'</span>).<span class="fn">astype</span>(<span class="fn">int</span>)   <span class="cm"># protected = "region B"</span>

X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values
A = df[<span class="str">'A'</span>].values

X_tr, X_te, y_tr, y_te, A_tr, A_te = <span class="fn">train_test_split</span>(X, y, A, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr, y_tr)
y_pred = clf.<span class="fn">predict</span>(X_te)

<span class="fn">print</span>(f<span class="str">"Overall accuracy: {(y_pred==y_te).mean():.3f}\\n"</span>)

<span class="cm"># Demographic parity</span>
p1 = y_pred[A_te==<span class="num">1</span>].<span class="fn">mean</span>(); p0 = y_pred[A_te==<span class="num">0</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"P(Ŷ=1 | A=0): {p0:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"P(Ŷ=1 | A=1): {p1:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Demographic parity diff: {p1-p0:+.3f}"</span>)

<span class="cm"># Equalized odds: TPR/FPR by group</span>
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    mask = (A_te==a)
    tpr = ((y_pred==<span class="num">1</span>)&amp;(y_te==<span class="num">1</span>)&amp;mask).<span class="fn">sum</span>() / <span class="fn">max</span>(((y_te==<span class="num">1</span>)&amp;mask).<span class="fn">sum</span>(), <span class="num">1</span>)
    fpr = ((y_pred==<span class="num">1</span>)&amp;(y_te==<span class="num">0</span>)&amp;mask).<span class="fn">sum</span>() / <span class="fn">max</span>(((y_te==<span class="num">0</span>)&amp;mask).<span class="fn">sum</span>(), <span class="num">1</span>)
    <span class="fn">print</span>(f<span class="str">"A={a}:  TPR={tpr:.3f}  FPR={fpr:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) synthesizes a protected attribute A correlated with <code>monthly_charge</code>, then drops A from the feature matrix so the model never sees it. 2) trains a LogisticRegression on the remaining features and predicts on a held-out test split. 3) computes demographic parity (difference in P(Ŷ=1) across groups) and per-group TPR / FPR — the equalized-odds diagnostic.</p>
<p class="l-text">Run it. The two groups likely have different positive-prediction rates and different error rates — even though A was never an input feature. That's proxy discrimination acting through monthly_charge.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Calibration Audit</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))

X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values

X_tr, X_te, y_tr, y_te, A_tr, A_te = <span class="fn">train_test_split</span>(X, y, A, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr, y_tr)
proba = clf.<span class="fn">predict_proba</span>(X_te)[:,<span class="num">1</span>]

<span class="cm"># Bin predicted probability and compare actual rate per group</span>
df_te = pd.<span class="fn">DataFrame</span>({<span class="str">'p'</span>:proba,<span class="str">'y'</span>:y_te,<span class="str">'A'</span>:A_te})
df_te[<span class="str">'bin'</span>] = pd.<span class="fn">cut</span>(df_te[<span class="str">'p'</span>], bins=[<span class="num">0</span>,<span class="num">0.25</span>,<span class="num">0.5</span>,<span class="num">0.75</span>,<span class="num">1.0</span>])

cal = df_te.<span class="fn">groupby</span>([<span class="str">'bin'</span>,<span class="str">'A'</span>], observed=<span class="kw">True</span>)[<span class="str">'y'</span>].<span class="fn">mean</span>().<span class="fn">unstack</span>()
<span class="fn">print</span>(<span class="str">"Empirical positive rate per predicted-probability bin and group:"</span>)
<span class="fn">print</span>(cal)
<span class="cm"># Calibrated if rows are similar across A=0 and A=1</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fits a LogisticRegression and extracts <code>predict_proba</code> scores on the test split. 2) bins those scores into four probability buckets and groups them by the protected attribute A. 3) computes the empirical positive rate (mean of y) inside each (bin, A) cell — a calibration table that lets you check whether the same score means the same risk for both groups.</p>
<p class="l-text">If the rows differ — say P(churn=1|p̂=0.5, A=0)=0.3 but P(churn=1|p̂=0.5, A=1)=0.6 — the model is mis-calibrated for one group. Same score, different real risk.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. The Harm Taxonomy</h2>
<p class="l-text">Crawford (2017) and Barocas, Hardt &amp; Narayanan (2019) classify ML harms:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Allocational</div><div class="card-body">Resource is granted or withheld: loan, parole, hire, organ. COMPAS, Amazon, Obermeyer all live here.</div></div>
<div class="calc-card"><div class="card-title">Quality of Service</div><div class="card-body">Service works less well for some groups: speech recognition fails for non-American accents (Koenecke 2020), face detection fails for darker skin (Buolamwini &amp; Gebru 2018).</div></div>
<div class="calc-card"><div class="card-title">Stereotyping &amp; Representational</div><div class="card-body">Search results for "CEO" return mostly men; image generators produce stereotyped scenes. Long-run effects on culture and self-image.</div></div>
<div class="calc-card"><div class="card-title">Denigration</div><div class="card-body">Tagging of people as offensive categories — Google Photos labeling Black people as "gorillas" (2015); auto-translation gendering programmers as male.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Why "Just Remove the Sensitive Feature" Fails</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))

<span class="cm"># Train a classifier WITHOUT A</span>
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
A = df[<span class="str">'A'</span>].values
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, A)
A_pred = clf.<span class="fn">predict</span>(X)
<span class="fn">print</span>(f<span class="str">"Can we predict A from non-sensitive features? Accuracy: {(A_pred==A).mean():.3f}"</span>)
<span class="cm"># If &gt;&gt; 0.5, A is leaking through proxies. "Fairness through unawareness" = false promise.</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) flips the prediction target: instead of predicting churn, it tries to predict the protected attribute A from the supposedly "non-sensitive" features (tenure, monthly charge, support calls). 2) fits a LogisticRegression on (X → A) and reports its accuracy on the same data. 3) if that accuracy is well above 0.5, the protected attribute leaks through proxies — "fairness through unawareness" is a false promise.</p>
<p class="l-text">If non-sensitive features can reconstruct A, the model can use them as proxies. Pedreschi et al. (2008) and Dwork et al. (2012) called this "fairness through blindness" — and showed it doesn't work in high-dimensional data.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. What's Coming in Lesson 2</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Lesson 2 turns these stories into rigorous metrics: derive demographic parity, equalized odds, predictive parity, individual fairness; prove the Chouldechova / Kleinberg impossibility theorem; implement each metric on the same churn dataset; and benchmark mitigation strategies (reweighting, threshold optimization, adversarial debiasing).</div>
<p class="l-text">Reading: Barocas, Hardt &amp; Narayanan, <em>Fairness and Machine Learning</em> (free online, fairmlbook.org); Mehrabi et al. (2021) "A Survey on Bias and Fairness in Machine Learning", ACM CSUR; Mitchell et al. (2019) "Model Cards for Model Reporting", FAT*.</p>
</div>`,
tr: `<p class="l-text">2016'da ProPublica, ABD mahkemeleri tarafından kefalet ve cezalandırma konusunda tavsiye almak için kullanılan bir risk-değerlendirme aracı olan COMPAS'ı analiz etti. Siyah sanıklar, beyaz sanıklara göre yanlış bir şekilde "yüksek risk" olarak işaretlenme olasılığı neredeyse iki kat fazlaydı. Satıcı Northpointe, kalibrasyonun ırklar arasında eşit <em>olduğunu</em> yanıtladı. Her ikisi de haklıydı — ve bu tek gözlem, imkansızlık teoremi olarak formalize edildi (Chouldechova 2017, Kleinberg ve ark. 2017), adalet araştırmasını sonsuza kadar yeniden şekillendirdi.</p>
<p class="l-text">2018'de Reuters, Amazon'un "kadınların satranç kulübü" veya tamamen-kadınlardan oluşan kolejlerden bahseden özgeçmişleri sistematik olarak düşüren bir dahili işe alım yapay zekası inşa ettiğini ve sessizce kapattığını ortaya çıkardı. 2019'da Obermeyer ve ark. <em>Science</em>'da 200 milyon Amerikalıda kullanılan bir sağlık-tahsis algoritmasının, aynı derecede hasta olan beyaz hastalara göre Siyah hastalara çok daha az bakım verdiğini yayınladı — çünkü vekil sonuç (maliyet), Siyah hastalara karşı sistemik az-harcamayı kodluyordu. ML'in zarar vermesi için yanlı olması gerekmez — verideki ve etiket seçimindeki yanlılığı <em>artırabilir</em>. Bu ders motive edici turunuz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Üç dönüm noktası vakası: COMPAS, Amazon işe alım, Obermeyer sağlık</li>
<li>Etiket seçiminin (vekil) "tarafsız" özelliklerle bile nasıl yanlılık yarattığı</li>
<li>Demografik eşitlik, eşitlenmiş olasılıklar, kalibrasyon — üç aile</li>
<li>Üst düzey imkansızlık teoremi (Ders 2'de formalize)</li>
<li>Gerçek bir sınıflandırıcıda temel bir eşitsizlik denetimi nasıl çalıştırılır</li>
<li>Zarar taksonomisi: tahsis vs. temsil vs. hizmet kalitesi</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Vaka Çalışması 1 — COMPAS (Angwin ve ark. 2016)</h2>
<p class="l-text">COMPAS yeniden suç işleme riskini 1-10 ölçeğinde tahmin eder. ProPublica 7,214 Broward County kaydı edindi ve şunu gösterdi: yeniden suç işlemeyen sanıklar arasında, Siyah sanıklar %45 oranında yüksek-risk olarak sınıflandırıldı, beyazlar için bu oran %23'tü. Yeniden suç işleyenler arasında, Siyah sanıklar %28 oranında düşük-risk olarak sınıflandırıldı, beyazlar için bu %48'di. Hata oranları demografik olarak asimetrikti.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Northpointe'un savunması (Dieterich ve ark. 2016): skor <strong>kalibre edildi</strong> — herhangi bir risk skoru için, gerçek yeniden suç işleme oranı Siyah ve beyaz için aynıydı. <em>Hem ProPublica hem de Northpointe doğruydu.</em> Farklı adalet kriterleri ölçüyorlardı ve bu kriterler temel oranlar gruplar arasında farklı olduğunda matematiksel olarak uyumsuzdur.</div>
<p class="l-text">Bu deneysel uyandırma çağrısıydı. Chouldechova (2017) ile Kleinberg, Mullainathan &amp; Raghavan (2017) bağımsız olarak kanıtladı ki, gruplar arasında temel oranlar eşit olmadıkça veya model mükemmel olmadıkça, kalibrasyon VE hata-oranı eşitliğini sağlayamazsınız.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Vaka Çalışması 2 — Amazon'un İşe Alım Motoru (Reuters 2018)</h2>
<p class="l-text">Amazon, 10 yıllık işe alım verisi üzerinde — ağırlıklı olarak erkek işe alımlar — bir özgeçmiş-sıralama modeli eğitti. Model şunu öğrendi: "geçmiş işe alımlara benzer adaylar" = "erkekler". Özgeçmişin herhangi bir yerinde "kadınların" kelimesini cezalandırdı, tamamen-kadın kolejleri düşürdü ve erkek-yazımlı özgeçmişlerde daha yaygın olan fiilleri ödüllendirdi ("yürüttü", "ele geçirdi").</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yanlılık kaynağı</div><div class="card-body">Tarihsel etiketler geçmiş ayrımcılığı yansıtıyordu. Model yanlılık icat etmedi — "kim işe alındı"da zaten olan yanlılığı öğrendi.</div></div>
<div class="calc-card"><div class="card-title">Sterilizasyon başarısız olur</div><div class="card-body">"Kadınların" kelimesini kaldırmak yalnızca modeli diğer vekillere (spor adları, kulüp adları, konum) iter. Yüksek boyutlu metin korunan özelliği yeniden keşfeder.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">Amazon ekibi 2017'de dağıttı. Ders: korunan-özellik kaldırma, yanlılık giderme değildir.</div></div>
</div>
<p class="l-text">Bu <em>vekil ayrımcılığı</em>dır: hassas özellikler olmadan bile, yeterince zengin özelliklere sahip bir model korunan özelliği örtük olarak öğrenir (Datta ve ark. 2017).</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Vaka Çalışması 3 — Sağlık Yanlılığı (Obermeyer ve ark. 2019, Science)</h2>
<p class="l-text">ABD hastaneleri tarafından "yüksek risk bakım yönetimi" için hastaları işaretlemek üzere yaygın olarak konuşlandırılan bir algoritma, "hastalık" için bir vekil olarak <strong>gelecekteki sağlık maliyetlerini</strong> kullandı. Mantıklı geliyor — daha hasta hastalar daha fazla maliyetlidir, değil mi? Yanlış: Siyah hastalar aynı şiddet için daha az bakım alır, dolayısıyla herhangi bir şiddet için maliyetleri daha düşüktür. Algoritma bu nedenle Siyah hastaların "daha az hasta" olduğu sonucuna vardı ve onları öncelik dışı bıraktı.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Obermeyer, aynı algoritmik risk skorunda Siyah hastaların beyaz hastalara göre ~%26 daha fazla kronik durum yaşadığını buldu. Etiketi maliyetten gerçek kronik-hastalık sayısına değiştirmek, ekstra bakım için işaretlenen Siyah hastaların payını iki katından fazla artırdı. ~200M Amerikalıyı etkileyen bu, bilinen en büyük algoritmik yanlılık vakalarından biri — tamamen vekil etiketinden kaynaklanıyor.</div>
<p class="l-text">Bir etiket seçmek, neyi tahmin etmeye çalıştığınızla ilgili <em>nedensel</em> bir iddiadır. Etiket korktuğunuz ayrımcılığın aşağı akışıysa, modeliniz o ayrımcılığı sinyal olarak kodlayacaktır.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Üç Adalet Ailesi</h2>
<p class="l-text">Çoğu nicel adalet kriteri, her biri farklı bir koşullu bağımsızlık ölçen üç gruba düşer.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Grup / Demografik Eşitlik</div><div class="card-body">P(Ŷ=1 | A=0) = P(Ŷ=1 | A=1). Gruplar arasında eşit pozitif-tahmin oranı. Bağımsızlık: Ŷ ⊥ A.</div></div>
<div class="calc-card"><div class="card-title">Eşitlenmiş Olasılıklar (Hardt 2016)</div><div class="card-body">y=0 ve y=1 için, a arasında P(Ŷ=1 | A=a, Y=y) eşit. Eşit TPR ve FPR. Ayırma: Ŷ ⊥ A | Y.</div></div>
<div class="calc-card"><div class="card-title">Tahminsel Eşitlik / Kalibrasyon</div><div class="card-body">a arasında P(Y=1 | Ŷ=ŷ, A=a) eşit. Eşit pozitif tahmin değeri. Yeterlilik: Y ⊥ A | Ŷ.</div></div>
</div>
<div class="katex-block">$$\\text{Demographic parity: } P(\\hat{Y}=1 \\mid A=0) = P(\\hat{Y}=1 \\mid A=1)$$</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Ders 2 her metriğe derinlemesine dalar ve imkansızlık teoremini kanıtlar. <em>Zarar modelinize</em> uyan kriteri seçin — evrensel olarak doğru bir cevap yoktur.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Churn'de Uygulamalı Eşitsizlik Denetimi</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>()

<span class="cm"># Synthesize a sensitive attribute correlated with one of the features</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'region'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>] &gt; df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                        np.random.<span class="fn">choice</span>([<span class="str">'A'</span>,<span class="str">'B'</span>], size=<span class="fn">len</span>(df), p=[<span class="num">0.7</span>,<span class="num">0.3</span>]),
                        np.random.<span class="fn">choice</span>([<span class="str">'A'</span>,<span class="str">'B'</span>], size=<span class="fn">len</span>(df), p=[<span class="num">0.3</span>,<span class="num">0.7</span>]))
df[<span class="str">'A'</span>] = (df[<span class="str">'region'</span>]==<span class="str">'B'</span>).<span class="fn">astype</span>(<span class="fn">int</span>)   <span class="cm"># protected = "region B"</span>

X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values
A = df[<span class="str">'A'</span>].values

X_tr, X_te, y_tr, y_te, A_tr, A_te = <span class="fn">train_test_split</span>(X, y, A, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr, y_tr)
y_pred = clf.<span class="fn">predict</span>(X_te)

<span class="fn">print</span>(f<span class="str">"Overall accuracy: {(y_pred==y_te).mean():.3f}\\n"</span>)

<span class="cm"># Demographic parity</span>
p1 = y_pred[A_te==<span class="num">1</span>].<span class="fn">mean</span>(); p0 = y_pred[A_te==<span class="num">0</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"P(Ŷ=1 | A=0): {p0:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"P(Ŷ=1 | A=1): {p1:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Demographic parity diff: {p1-p0:+.3f}"</span>)

<span class="cm"># Equalized odds: TPR/FPR by group</span>
<span class="kw">for</span> a <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    mask = (A_te==a)
    tpr = ((y_pred==<span class="num">1</span>)&amp;(y_te==<span class="num">1</span>)&amp;mask).<span class="fn">sum</span>() / <span class="fn">max</span>(((y_te==<span class="num">1</span>)&amp;mask).<span class="fn">sum</span>(), <span class="num">1</span>)
    fpr = ((y_pred==<span class="num">1</span>)&amp;(y_te==<span class="num">0</span>)&amp;mask).<span class="fn">sum</span>() / <span class="fn">max</span>(((y_te==<span class="num">0</span>)&amp;mask).<span class="fn">sum</span>(), <span class="num">1</span>)
    <span class="fn">print</span>(f<span class="str">"A={a}:  TPR={tpr:.3f}  FPR={fpr:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>monthly_charge</code> ile korelasyonlu sentetik bir korunan özellik A üretir, sonra A'yı öznitelik matrisinden çıkarır — model A'yı asla görmez. 2) Kalan özellikler üzerinde LogisticRegression eğitir ve ayrılmış test kümesinde tahmin yapar. 3) Demografik pariteyi (gruplar arası P(Ŷ=1) farkı) ve grup başına TPR / FPR'yi — eşitlenmiş olasılıklar tanısını — hesaplar.</p>
<p class="l-text">Çalıştır. İki grup büyük olasılıkla farklı pozitif-tahmin oranlarına ve farklı hata oranlarına sahiptir — A hiçbir zaman bir girdi özelliği olmamış olsa bile. Bu, monthly_charge üzerinden hareket eden vekil ayrımcılığıdır.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Kalibrasyon Denetimi</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))

X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
y = df[<span class="str">'churned'</span>].values; A = df[<span class="str">'A'</span>].values

X_tr, X_te, y_tr, y_te, A_tr, A_te = <span class="fn">train_test_split</span>(X, y, A, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X_tr, y_tr)
proba = clf.<span class="fn">predict_proba</span>(X_te)[:,<span class="num">1</span>]

<span class="cm"># Bin predicted probability and compare actual rate per group</span>
df_te = pd.<span class="fn">DataFrame</span>({<span class="str">'p'</span>:proba,<span class="str">'y'</span>:y_te,<span class="str">'A'</span>:A_te})
df_te[<span class="str">'bin'</span>] = pd.<span class="fn">cut</span>(df_te[<span class="str">'p'</span>], bins=[<span class="num">0</span>,<span class="num">0.25</span>,<span class="num">0.5</span>,<span class="num">0.75</span>,<span class="num">1.0</span>])

cal = df_te.<span class="fn">groupby</span>([<span class="str">'bin'</span>,<span class="str">'A'</span>], observed=<span class="kw">True</span>)[<span class="str">'y'</span>].<span class="fn">mean</span>().<span class="fn">unstack</span>()
<span class="fn">print</span>(<span class="str">"Empirical positive rate per predicted-probability bin and group:"</span>)
<span class="fn">print</span>(cal)
<span class="cm"># Calibrated if rows are similar across A=0 and A=1</span>
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Bir LogisticRegression eğitir ve test bölümünde <code>predict_proba</code> skorlarını çıkarır. 2) Bu skorları dört olasılık kovasına böler ve korunan özellik A'ya göre gruplar. 3) Her (kova, A) hücresinin içinde ampirik pozitif oranı (y ortalaması) hesaplar — aynı skorun her iki grup için aynı riski ifade edip etmediğini kontrol etmeni sağlayan bir kalibrasyon tablosu.</p>
<p class="l-text">Eğer satırlar farklıysa — diyelim P(churn=1|p=0.5, A=0)=0.3 ama P(churn=1|p=0.5, A=1)=0.6 — model bir grup için yanlış kalibre edilmiştir. Aynı skor, farklı gerçek risk.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Zarar Taksonomisi</h2>
<p class="l-text">Crawford (2017) ve Barocas, Hardt &amp; Narayanan (2019) ML zararlarını sınıflandırır:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tahsis</div><div class="card-body">Kaynak verilir veya esirgenir: kredi, şartlı tahliye, işe alım, organ. COMPAS, Amazon, Obermeyer hepsi burada yaşar.</div></div>
<div class="calc-card"><div class="card-title">Hizmet Kalitesi</div><div class="card-body">Hizmet bazı gruplar için daha kötü çalışır: konuşma tanıma Amerikan olmayan aksanlar için başarısız olur (Koenecke 2020), yüz tespiti koyu cilt için başarısız olur (Buolamwini &amp; Gebru 2018).</div></div>
<div class="calc-card"><div class="card-title">Stereotipleştirme &amp; Temsil</div><div class="card-body">"CEO" için arama sonuçları çoğunlukla erkekleri döndürür; görüntü üreticiler stereotipli sahneler üretir. Kültür ve öz-imaj üzerindeki uzun dönem etkiler.</div></div>
<div class="calc-card"><div class="card-title">Aşağılama</div><div class="card-body">İnsanları saldırgan kategoriler olarak etiketleme — Google Photos'un Siyah insanları "goriller" olarak etiketlemesi (2015); otomatik çevirinin programcıları erkek olarak cinsiyetlendirmesi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. "Sadece Hassas Özelliği Kaldır" Neden Başarısız Olur</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'A'</span>] = np.<span class="fn">where</span>(df[<span class="str">'monthly_charge'</span>]&gt;df[<span class="str">'monthly_charge'</span>].<span class="fn">median</span>(),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.7</span>,<span class="fn">len</span>(df)),
                   np.random.<span class="fn">binomial</span>(<span class="num">1</span>,<span class="num">0.3</span>,<span class="fn">len</span>(df)))

<span class="cm"># Train a classifier WITHOUT A</span>
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
A = df[<span class="str">'A'</span>].values
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, A)
A_pred = clf.<span class="fn">predict</span>(X)
<span class="fn">print</span>(f<span class="str">"Can we predict A from non-sensitive features? Accuracy: {(A_pred==A).mean():.3f}"</span>)
<span class="cm"># If &gt;&gt; 0.5, A is leaking through proxies. "Fairness through unawareness" = false promise.</span>
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Tahmin hedefini değiştirir: churn yerine, sözde "hassas olmayan" özelliklerden (tenure, aylık ücret, destek aramaları) korunan özellik A'yı tahmin etmeye çalışır. 2) (X → A) üzerinde bir LogisticRegression eğitir ve aynı veride doğruluğunu raporlar. 3) Bu doğruluk 0.5'in çok üzerindeyse, korunan özellik vekiller yoluyla sızıyor demektir — "körlük yoluyla adalet" yanıltıcı bir vaattir.</p>
<p class="l-text">Hassas olmayan özellikler A'yı yeniden inşa edebiliyorsa, model onları vekiller olarak kullanabilir. Pedreschi ve ark. (2008) ve Dwork ve ark. (2012) buna "körlük yoluyla adalet" dedi — ve yüksek boyutlu verilerde işe yaramadığını gösterdi.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Ders 2'de Gelenler</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Ders 2 bu hikayeleri titiz metriklere dönüştürür: demografik eşitliği, eşitlenmiş olasılıkları, tahminsel eşitliği, bireysel adaleti türet; Chouldechova / Kleinberg imkansızlık teoremini kanıtla; her metriği aynı churn veri setinde uygula; ve hafifletme stratejilerini (yeniden ağırlıklandırma, eşik optimizasyonu, çekişmeli yanlılık-giderme) karşılaştır.</div>
<p class="l-text">Okuma: Barocas, Hardt &amp; Narayanan, <em>Fairness and Machine Learning</em> (çevrimiçi ücretsiz, fairmlbook.org); Mehrabi ve ark. (2021) "A Survey on Bias and Fairness in Machine Learning", ACM CSUR; Mitchell ve ark. (2019) "Model Cards for Model Reporting", FAT*.</p>
</div>`
};
