window.CAUSAL_L3 = {
en: `<p class="l-text">The do-operator is Pearl's elegant trick for distinguishing observation from action. <code>P(Y|X=x)</code> asks: <em>among units where we saw X=x, what is the distribution of Y?</em> But <code>P(Y|do(X=x))</code> asks something fundamentally different: <em>if we forced everyone's X to equal x — overriding whatever caused X — what would the distribution of Y be?</em> The first is regression. The second is policy.</p>
<p class="l-text">In this lesson we formalize the do-operator as a <strong>graph surgery</strong>: cut every arrow into the treatment node, then read off the post-intervention distribution. The three rules of do-calculus (Pearl 1995) provide a complete algebra for transforming do-expressions into observational ones — when possible. We'll learn to test <strong>identifiability</strong>: can the causal effect be computed from observational data plus the DAG, or is the question fundamentally unanswerable without an experiment?</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Intervention vs. observation: P(Y|X) vs. P(Y|do(X))</li>
<li>The do-operator as graph surgery (mutilation of incoming edges)</li>
<li>The three rules of do-calculus and what each one buys you</li>
<li>The backdoor and front-door adjustment formulas</li>
<li>Identifiability: when is a causal effect computable from data + DAG?</li>
<li>Instrumental variables when no adjustment set exists</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The do-Operator, Formally</h2>
<p class="l-text">Given a structural causal model M with DAG G, the intervention <code>do(X=x)</code> produces a new model M_x: replace the structural equation for X with the constant x, leaving all other equations unchanged. Graphically, delete every arrow into X; the resulting graph G_X is the <strong>mutilated graph</strong>.</p>
<div class="katex-block">$$P(Y | \\text{do}(X=x)) \\;\\equiv\\; P_{M_x}(Y) \\;=\\; P_{G_{\\overline{X}}}(Y | X=x)$$</div>
<p class="l-text">The intervention severs X from its causes. Anything that used to determine X — confounders, parents, noise — no longer correlates with the new, forced X. That's why <code>do</code> escapes confounding.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">A randomized controlled trial physically realizes <code>do(X)</code>: by flipping a coin, we cut every backdoor into X. That's why RCTs are the gold standard — they enact graph surgery in the world.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Simulating Graph Mutilation</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">DiGraph</span>()
G.<span class="fn">add_edges_from</span>([
    (<span class="str">'U'</span>,<span class="str">'T'</span>),(<span class="str">'U'</span>,<span class="str">'Y'</span>),  <span class="cm"># U confounds T-&gt;Y</span>
    (<span class="str">'T'</span>,<span class="str">'Y'</span>),
])

<span class="kw">def</span> <span class="fn">mutilate</span>(G, intervened):
    <span class="str">"""Pearl's do-mutilation: delete arrows INTO intervened nodes."""</span>
    G2 = G.<span class="fn">copy</span>()
    <span class="kw">for</span> v <span class="kw">in</span> intervened:
        <span class="kw">for</span> u <span class="kw">in</span> <span class="fn">list</span>(G2.<span class="fn">predecessors</span>(v)):
            G2.<span class="fn">remove_edge</span>(u, v)
    <span class="kw">return</span> G2

<span class="fn">print</span>(<span class="str">"Original edges:"</span>, <span class="fn">list</span>(G.edges))
G_doT = <span class="fn">mutilate</span>(G, [<span class="str">'T'</span>])
<span class="fn">print</span>(<span class="str">"After do(T):   "</span>, <span class="fn">list</span>(G_doT.edges))
<span class="cm"># U is no longer connected to T; the U-&gt;Y path remains</span>
<span class="cm"># but is now blocked from T because T has no parents.</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a tiny DAG with edges <code>U→T</code>, <code>U→Y</code>, <code>T→Y</code> — a textbook confounded structure. 2) defines <code>mutilate(G, intervened)</code> which copies the graph and deletes every incoming edge of the intervened nodes, mirroring Pearl's <em>do</em>-surgery. 3) calls <code>mutilate(G, ['T'])</code> and prints the edges before and after; only <code>U→Y</code> and <code>T→Y</code> remain, so the backdoor through <code>U</code> is gone.</p>
<p class="l-text">In the mutilated graph, T and Y are connected only through the direct edge T→Y plus paths via descendants. The confounder U no longer creates a backdoor path. This is the <em>graphical proof</em> that intervention removes confounding.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. The Backdoor Adjustment Formula</h2>
<p class="l-text">When a set Z satisfies the backdoor criterion w.r.t. (T, Y), the causal effect identifies as:</p>
<div class="katex-block">$$P(Y | \\text{do}(T=t)) = \\sum_{z} P(Y | T=t, Z=z) \\, P(Z=z)$$</div>
<p class="l-text">Notice the second factor: <code>P(Z)</code>, not <code>P(Z|T)</code>. This is the key difference from naive conditional probability. We average the conditional <code>P(Y|T,Z)</code> over the <em>marginal</em> distribution of Z — as if Z were independent of T (which it is, post-intervention).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Synthetic data with confounder Z</span>
np.random.<span class="fn">seed</span>(<span class="num">7</span>)
n = <span class="num">5000</span>
Z = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.4</span>, n)            <span class="cm"># confounder</span>
T = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.2</span> + <span class="num">0.6</span>*Z, n)    <span class="cm"># T depends on Z</span>
Y = <span class="num">0.5</span>*T + <span class="num">1.0</span>*Z + np.random.<span class="fn">randn</span>(n)*<span class="num">0.5</span>   <span class="cm"># Y depends on both</span>

df = pd.<span class="fn">DataFrame</span>({<span class="str">'Z'</span>:Z,<span class="str">'T'</span>:T,<span class="str">'Y'</span>:Y})

<span class="cm"># NAIVE: E[Y|T=1] - E[Y|T=0]</span>
naive = df[df.T==<span class="num">1</span>][<span class="str">'Y'</span>].<span class="fn">mean</span>() - df[df.T==<span class="num">0</span>][<span class="str">'Y'</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Naive (biased):    {naive:+.3f}"</span>)

<span class="cm"># BACKDOOR ADJUSTMENT</span>
ate = <span class="num">0</span>
<span class="kw">for</span> z <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    p_z = (df.Z==z).<span class="fn">mean</span>()
    e_y_t1 = df[(df.T==<span class="num">1</span>)&amp;(df.Z==z)][<span class="str">'Y'</span>].<span class="fn">mean</span>()
    e_y_t0 = df[(df.T==<span class="num">0</span>)&amp;(df.Z==z)][<span class="str">'Y'</span>].<span class="fn">mean</span>()
    ate += (e_y_t1 - e_y_t0) * p_z
<span class="fn">print</span>(f<span class="str">"Backdoor ATE:      {ate:+.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"True effect:       +0.500"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) simulates a confounded scenario where binary <code>Z</code> drives both the treatment probability of <code>T</code> and the outcome <code>Y = 0.5·T + 1.0·Z + noise</code>, so the true causal effect of T on Y is <code>+0.5</code>. 2) computes the naive contrast <code>E[Y|T=1] − E[Y|T=0]</code>, which is inflated by the Z-driven imbalance. 3) loops over the two values of <code>Z</code>, computes the within-stratum contrast and weights it by <code>P(Z=z)</code>, implementing the backdoor adjustment formula by hand and recovering the true <code>+0.5</code>.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. The Three Rules of do-Calculus</h2>
<p class="l-text">Pearl's three rules let us mechanically rewrite expressions involving <code>do</code> until — if we're lucky — every <code>do</code> is gone, leaving an observational expression we can estimate. Let G be the DAG; G_{X̄} drops arrows INTO X; G_{X̲} drops arrows OUT OF X.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rule 1 — Insertion/Deletion of Observation</div><div class="card-body">If (Y ⊥ Z | X, W) in G_{X̄}, then P(Y|do(X), Z, W) = P(Y|do(X), W).</div></div>
<div class="calc-card"><div class="card-title">Rule 2 — Action/Observation Exchange</div><div class="card-body">If (Y ⊥ Z | X, W) in G_{X̄,Z̲}, then P(Y|do(X), do(Z), W) = P(Y|do(X), Z, W). This converts a do into a regular condition when there are no backdoors.</div></div>
<div class="calc-card"><div class="card-title">Rule 3 — Insertion/Deletion of Action</div><div class="card-body">If (Y ⊥ Z | X, W) in G_{X̄, Z(W)̄}, then P(Y|do(X), do(Z), W) = P(Y|do(X), W). Lets us drop a do that has no causal effect.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Shpitser &amp; Pearl (2006) proved do-calculus is <strong>complete</strong>: if a causal effect is identifiable, repeated application of the three rules will derive its formula. The ID algorithm automates this — implemented in <code>dowhy</code> and <code>causalfusion</code>.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Front-Door Adjustment — When Backdoor Fails</h2>
<p class="l-text">Suppose smoking → tar in lungs → cancer, with an unobserved gene confounding smoking and cancer. We can't measure the gene, so backdoor adjustment is impossible. But if we measure tar (the mediator), Pearl's <strong>front-door formula</strong> identifies the effect:</p>
<div class="katex-block">$$P(Y | \\text{do}(T)) = \\sum_{m} P(M=m | T) \\sum_{t'} P(Y | M=m, T=t') P(T=t')$$</div>
<p class="l-text">Three conditions: (1) M intercepts every directed path T→Y, (2) no unblocked backdoor T→M, (3) all backdoor paths from M to Y are blocked by T. Astonishingly, this lets us identify a causal effect even with unmeasured confounding — provided the right mediator exists.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Identifiability: A Decidable Question</h2>
<p class="l-text">Given a DAG and a query <code>P(Y|do(X))</code>, the ID algorithm (Tian &amp; Pearl 2002, Shpitser &amp; Pearl 2006) decides in polynomial time whether the effect is identifiable, and if so, returns the formula.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Identifiable</div><div class="card-body">Pure observational data plus the DAG suffice to compute P(Y|do(X)). Backdoor, front-door, or more exotic combinations.</div></div>
<div class="calc-card"><div class="card-title">Not identifiable</div><div class="card-body">No formula in observational quantities exists. You need an experiment, an instrument, or extra assumptions (e.g., parametric form).</div></div>
<div class="calc-card"><div class="card-title">Bounds</div><div class="card-body">Even when not point-identified, partial identification can give bounds on the effect (Manski 1990, Balke &amp; Pearl 1997).</div></div>
</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Instrumental Variables — The Last Resort</h2>
<p class="l-text">When backdoor and front-door both fail, an <strong>instrument</strong> Z can save the day. Z is an instrument for T → Y if: (a) Z affects T, (b) Z affects Y only through T, (c) Z is unconfounded with Y. Classic example: military draft lottery (Z) → military service (T) → earnings (Y), Angrist 1990.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

<span class="cm"># IV simulation: Z -&gt; T -&gt; Y, with U confounding T and Y</span>
np.random.<span class="fn">seed</span>(<span class="num">1</span>)
n = <span class="num">5000</span>
U = np.random.<span class="fn">randn</span>(n)
Z = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.5</span>, n).<span class="fn">astype</span>(<span class="fn">float</span>)
T = <span class="num">0.6</span>*Z + <span class="num">0.7</span>*U + <span class="num">0.2</span>*np.random.<span class="fn">randn</span>(n)
Y = <span class="num">1.5</span>*T + <span class="num">1.0</span>*U + <span class="num">0.3</span>*np.random.<span class="fn">randn</span>(n)   <span class="cm"># true causal effect = 1.5</span>

<span class="cm"># Naive OLS: biased</span>
b_ols = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(T.<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>), Y).coef_[<span class="num">0</span>]
<span class="fn">print</span>(f<span class="str">"OLS (biased):  {b_ols:.3f}"</span>)

<span class="cm"># 2-Stage Least Squares (2SLS)</span>
T_hat = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(Z.<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>), T).<span class="fn">predict</span>(Z.<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>))
b_iv = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(T_hat.<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>), Y).coef_[<span class="num">0</span>]
<span class="fn">print</span>(f<span class="str">"2SLS (IV):     {b_iv:.3f}   (true = 1.500)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) simulates an instrumental-variable scenario: a hidden <code>U</code> confounds <code>T</code> and <code>Y</code>, while a binary instrument <code>Z</code> shifts <code>T</code> but enters <code>Y</code> only through <code>T</code>; the true causal slope is <code>1.5</code>. 2) fits a plain OLS of <code>Y</code> on <code>T</code> and prints the biased coefficient — the <code>U</code> path drags it away from the truth. 3) runs the two-step IV procedure: first regress <code>T</code> on <code>Z</code> to get <code>T_hat</code>, then regress <code>Y</code> on <code>T_hat</code>; this uses only the <code>Z</code>-driven portion of <code>T</code> and recovers a coefficient close to <code>1.5</code>.</p>
<p class="l-text">2SLS recovers the true causal effect even with unmeasured confounding, by using only the variation in T that is driven by Z (which is unconfounded by assumption).</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. The dowhy Workflow (Demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (dowhy)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="cm"># dowhy is not in pyodide; demo of the four-step pipeline</span>
<span class="kw">from</span> dowhy <span class="kw">import</span> CausalModel

model = <span class="fn">CausalModel</span>(
    data=df,
    treatment=<span class="str">'support_calls'</span>,
    outcome=<span class="str">'churned'</span>,
    graph=<span class="str">"""digraph { tenure -&gt; support_calls; tenure -&gt; churned;
              charge -&gt; support_calls; charge -&gt; churned;
              support_calls -&gt; churned; }"""</span>
)
identified = model.<span class="fn">identify_effect</span>()         <span class="cm"># ID algorithm</span>
estimate = model.<span class="fn">estimate_effect</span>(identified, <span class="cm"># backdoor or IV</span>
    method_name=<span class="str">"backdoor.linear_regression"</span>)
refute = model.<span class="fn">refute_estimate</span>(identified, estimate,
    method_name=<span class="str">"random_common_cause"</span>)       <span class="cm"># robustness check</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a <code>dowhy.CausalModel</code> from the dataframe, declares <code>support_calls</code> as treatment and <code>churned</code> as outcome, and passes the DAG as a graphviz string. 2) calls <code>identify_effect()</code> which runs the ID algorithm and returns the symbolic adjustment formula. 3) chains <code>estimate_effect</code> with the linear-regression backdoor estimator and finally <code>refute_estimate</code> with the random-common-cause refuter to stress-test the estimate.</p>
<p class="l-text">Pyodide-runnable equivalent using sklearn:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

df = df_churn.<span class="fn">copy</span>()
T = df[<span class="str">'support_calls'</span>].values
Y = df[<span class="str">'churned'</span>].values
Z = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>]].values

<span class="cm"># Backdoor adjustment via OLS</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
X = np.<span class="fn">column_stack</span>([T, Z])
m = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X, Y)
<span class="fn">print</span>(f<span class="str">"Causal effect of support_calls on churn (adjusted): {m.coef_[0]:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Coefficients on confounders: {m.coef_[1:]}"</span>)

<span class="cm"># Refutation: add a random "common cause" — should not change estimate much</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
fake = np.random.<span class="fn">randn</span>(<span class="fn">len</span>(T)).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>)
X2 = np.<span class="fn">column_stack</span>([X, fake])
m2 = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X2, Y)
<span class="fn">print</span>(f<span class="str">"With random fake covariate:                        {m2.coef_[0]:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) extracts treatment <code>T = support_calls</code>, outcome <code>Y = churned</code>, and confounder block <code>Z = [tenure_months, monthly_charge]</code> from the churn data, then stacks them so the first column of the design matrix is the treatment. 2) fits a <code>LinearRegression</code> and reports the adjusted coefficient on <code>support_calls</code> as the backdoor causal effect estimate. 3) appends an extra column of pure random noise as a "fake" common cause and refits; if the treatment coefficient barely moves, that is evidence the original estimate is robust.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Identifiability Decision Tree</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">All confounders observed?</div><div class="card-body">Use backdoor adjustment. Identified.</div></div>
<div class="calc-card"><div class="card-title">Mediator on causal path with confounders unobserved?</div><div class="card-body">Try front-door. Identified if the three conditions hold.</div></div>
<div class="calc-card"><div class="card-title">Have an instrument?</div><div class="card-body">Use 2SLS or moment conditions. Identifies LATE under additional assumptions.</div></div>
<div class="calc-card"><div class="card-title">None of the above?</div><div class="card-body">Run an experiment, or accept partial identification (bounds).</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">In Lesson 4 we move from identification to <em>estimation</em>: how to actually compute ATE, ATT, and ITE on real data with finite samples and noisy regressors.</div>
</div>`,
tr: `<p class="l-text">do-operatörü, gözlemi eylemden ayırt etmek için Pearl'ün zarif numarasıdır. <code>P(Y|X=x)</code> şunu sorar: <em>X=x gördüğümüz birimler arasında, Y'nin dağılımı nedir?</em> Ama <code>P(Y|do(X=x))</code> temelde farklı bir şey sorar: <em>herkesin X'ini x olmaya zorlasaydık — X'e neden olan her ne ise geçersiz kılarak — Y'nin dağılımı ne olurdu?</em> İlki regresyondur. İkincisi politikadır.</p>
<p class="l-text">Bu derste do-operatörünü bir <strong>graf cerrahisi</strong> olarak formalize ediyoruz: tedavi düğümüne giren her oku kes, sonra müdahale-sonrası dağılımı oku. do-calculus'un üç kuralı (Pearl 1995), do-ifadelerini gözlemsel olanlara dönüştürmek için tam bir cebir sağlar — mümkün olduğunda. <strong>Tanımlanabilirliği</strong> test etmeyi öğreneceğiz: nedensel etki, gözlemsel veri artı DAG'dan hesaplanabilir mi, yoksa soru bir deney olmadan temelde cevaplanamaz mı?</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Müdahale vs. gözlem: P(Y|X) vs. P(Y|do(X))</li>
<li>do-operatörü graf cerrahisi olarak (gelen kenarların kesilmesi)</li>
<li>do-calculus'un üç kuralı ve her birinin size ne kazandırdığı</li>
<li>Arkakapı ve ön-kapı ayarlama formülleri</li>
<li>Tanımlanabilirlik: nedensel etki ne zaman veri + DAG'dan hesaplanabilir?</li>
<li>Hiçbir ayarlama kümesi yokken araçsal değişkenler</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. do-Operatörü, Formal Olarak</h2>
<p class="l-text">DAG'ı G olan bir yapısal nedensel model M verildiğinde, <code>do(X=x)</code> müdahalesi yeni bir model M_x üretir: X için yapısal denklemi sabit x ile değiştirin, diğer tüm denklemleri değişmeden bırakın. Grafiksel olarak, X'e giren her oku silin; sonuçta ortaya çıkan G_X grafı <strong>parçalanmış graf</strong>tır.</p>
<div class="katex-block">$$P(Y | \\text{do}(X=x)) \\;\\equiv\\; P_{M_x}(Y) \\;=\\; P_{G_{\\overline{X}}}(Y | X=x)$$</div>
<p class="l-text">Müdahale, X'i nedenlerinden koparır. X'i belirleyen her şey — karıştırıcılar, ebeveynler, gürültü — artık yeni, zorlanmış X ile korele değildir. <code>do</code>'nun karıştırmadan kaçışının nedeni budur.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Randomize kontrollü bir deney <code>do(X)</code>'i fiziksel olarak gerçekleştirir: bir madeni para atarak, X'e giden her arkakapıyı keseriz. RKD'lerin altın standart olmasının nedeni budur — dünyada graf cerrahisini hayata geçirirler.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Graf Parçalamayı Simüle Etmek</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">DiGraph</span>()
G.<span class="fn">add_edges_from</span>([
    (<span class="str">'U'</span>,<span class="str">'T'</span>),(<span class="str">'U'</span>,<span class="str">'Y'</span>),  <span class="cm"># U confounds T-&gt;Y</span>
    (<span class="str">'T'</span>,<span class="str">'Y'</span>),
])

<span class="kw">def</span> <span class="fn">mutilate</span>(G, intervened):
    <span class="str">"""Pearl's do-mutilation: delete arrows INTO intervened nodes."""</span>
    G2 = G.<span class="fn">copy</span>()
    <span class="kw">for</span> v <span class="kw">in</span> intervened:
        <span class="kw">for</span> u <span class="kw">in</span> <span class="fn">list</span>(G2.<span class="fn">predecessors</span>(v)):
            G2.<span class="fn">remove_edge</span>(u, v)
    <span class="kw">return</span> G2

<span class="fn">print</span>(<span class="str">"Original edges:"</span>, <span class="fn">list</span>(G.edges))
G_doT = <span class="fn">mutilate</span>(G, [<span class="str">'T'</span>])
<span class="fn">print</span>(<span class="str">"After do(T):   "</span>, <span class="fn">list</span>(G_doT.edges))
<span class="cm"># U is no longer connected to T; the U-&gt;Y path remains</span>
<span class="cm"># but is now blocked from T because T has no parents.</span>
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>U→T</code>, <code>U→Y</code>, <code>T→Y</code> kenarlarıyla minik bir DAG kuruyor — ders kitabındaki klasik karıştırılmış yapı. 2) <code>mutilate(G, intervened)</code> fonksiyonu grafı kopyalayıp müdahale edilen düğümlerin tüm gelen kenarlarını siliyor; bu tam olarak Pearl'ün <em>do</em> cerrahisi. 3) <code>mutilate(G, ['T'])</code> çağrılıp önce/sonra kenar listeleri yazdırılıyor; geriye yalnızca <code>U→Y</code> ve <code>T→Y</code> kalıyor, yani <code>U</code> üzerinden arkakapı yok oluyor.</p>
<p class="l-text">Parçalanmış grafta, T ve Y yalnızca doğrudan T→Y kenarı artı torunlar üzerinden yollarla bağlıdır. U karıştırıcısı artık bir arkakapı yolu yaratmaz. Bu, müdahalenin karıştırmayı kaldırdığının <em>grafiksel kanıtı</em>dır.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Arkakapı Ayarlama Formülü</h2>
<p class="l-text">Bir Z kümesi (T, Y) ile ilgili arkakapı kriterini sağladığında, nedensel etki şöyle tanımlanır:</p>
<div class="katex-block">$$P(Y | \\text{do}(T=t)) = \\sum_{z} P(Y | T=t, Z=z) \\, P(Z=z)$$</div>
<p class="l-text">İkinci faktöre dikkat edin: <code>P(Z)</code>, <code>P(Z|T)</code> değil. Naif koşullu olasılıktan ana fark budur. <code>P(Y|T,Z)</code> koşullusunu Z'nin <em>marjinal</em> dağılımı üzerinden ortalama alıyoruz — sanki Z, T'den bağımsızmış gibi (müdahale-sonrası öyledir).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Synthetic data with confounder Z</span>
np.random.<span class="fn">seed</span>(<span class="num">7</span>)
n = <span class="num">5000</span>
Z = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.4</span>, n)            <span class="cm"># confounder</span>
T = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.2</span> + <span class="num">0.6</span>*Z, n)    <span class="cm"># T depends on Z</span>
Y = <span class="num">0.5</span>*T + <span class="num">1.0</span>*Z + np.random.<span class="fn">randn</span>(n)*<span class="num">0.5</span>   <span class="cm"># Y depends on both</span>

df = pd.<span class="fn">DataFrame</span>({<span class="str">'Z'</span>:Z,<span class="str">'T'</span>:T,<span class="str">'Y'</span>:Y})

<span class="cm"># NAIVE: E[Y|T=1] - E[Y|T=0]</span>
naive = df[df.T==<span class="num">1</span>][<span class="str">'Y'</span>].<span class="fn">mean</span>() - df[df.T==<span class="num">0</span>][<span class="str">'Y'</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Naive (biased):    {naive:+.3f}"</span>)

<span class="cm"># BACKDOOR ADJUSTMENT</span>
ate = <span class="num">0</span>
<span class="kw">for</span> z <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
    p_z = (df.Z==z).<span class="fn">mean</span>()
    e_y_t1 = df[(df.T==<span class="num">1</span>)&amp;(df.Z==z)][<span class="str">'Y'</span>].<span class="fn">mean</span>()
    e_y_t0 = df[(df.T==<span class="num">0</span>)&amp;(df.Z==z)][<span class="str">'Y'</span>].<span class="fn">mean</span>()
    ate += (e_y_t1 - e_y_t0) * p_z
<span class="fn">print</span>(f<span class="str">"Backdoor ATE:      {ate:+.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"True effect:       +0.500"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) ikili <code>Z</code>'nin hem <code>T</code>'nin tedavi olasılığını hem de sonucu <code>Y = 0.5·T + 1.0·Z + gürültü</code> üzerinden sürdüğü karıştırılmış bir senaryo simüle ediyor; T'nin Y üzerindeki gerçek nedensel etkisi <code>+0.5</code>. 2) naif kontrastı <code>E[Y|T=1] − E[Y|T=0]</code> hesaplıyor; Z kaynaklı dengesizlik bu sayıyı şişiriyor. 3) <code>Z</code>'nin iki değerinde dönüp her tabakanın içi için kontrastı hesaplıyor ve <code>P(Z=z)</code> ile ağırlıklandırıyor — arkakapı ayarlama formülünü elle uyguluyor ve gerçek <code>+0.5</code>'i geri getiriyor.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. do-Calculus'un Üç Kuralı</h2>
<p class="l-text">Pearl'ün üç kuralı, <code>do</code> içeren ifadeleri mekanik olarak yeniden yazmamıza izin verir — şanslıysak — her <code>do</code> gidene kadar, geriye tahmin edebileceğimiz gözlemsel bir ifade kalır. G'nin DAG olduğunu varsayalım; G_{X} X'e GİREN okları siler; G_{X} X'ten ÇIKAN okları siler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kural 1 — Gözlem Ekleme/Silme</div><div class="card-body">Eğer G_{X}'da (Y ⊥ Z | X, W) ise, P(Y|do(X), Z, W) = P(Y|do(X), W).</div></div>
<div class="calc-card"><div class="card-title">Kural 2 — Eylem/Gözlem Değişimi</div><div class="card-body">Eğer G_{X,Z}'da (Y ⊥ Z | X, W) ise, P(Y|do(X), do(Z), W) = P(Y|do(X), Z, W). Hiçbir arkakapı olmadığında bu, do'yu normal bir koşula dönüştürür.</div></div>
<div class="calc-card"><div class="card-title">Kural 3 — Eylem Ekleme/Silme</div><div class="card-body">Eğer G_{X, Z(W)}'da (Y ⊥ Z | X, W) ise, P(Y|do(X), do(Z), W) = P(Y|do(X), W). Nedensel etkisi olmayan bir do'yu düşürmemizi sağlar.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Shpitser &amp; Pearl (2006) do-calculus'un <strong>tam</strong> olduğunu kanıtladı: bir nedensel etki tanımlanabilirse, üç kuralın tekrarlı uygulanması formülünü türetir. ID algoritması bunu otomatikleştirir — <code>dowhy</code> ve <code>causalfusion</code>'da uygulanmıştır.</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Ön-Kapı Ayarlaması — Arkakapı Başarısız Olduğunda</h2>
<p class="l-text">Diyelim ki sigara → akciğerlerde katran → kanser, sigara ve kanseri karıştıran gözlemlenmemiş bir gen var. Geni ölçemeyiz, dolayısıyla arkakapı ayarlaması imkansızdır. Ama katranı (aracıyı) ölçersek, Pearl'ün <strong>ön-kapı formülü</strong> etkiyi tanımlar:</p>
<div class="katex-block">$$P(Y | \\text{do}(T)) = \\sum_{m} P(M=m | T) \\sum_{t'} P(Y | M=m, T=t') P(T=t')$$</div>
<p class="l-text">Üç koşul: (1) M, T→Y'ye giden her yönlendirilmiş yolu keser, (2) T→M'de bloklanmamış arkakapı yok, (3) M'den Y'ye tüm arkakapı yolları T tarafından bloklanır. Şaşırtıcı bir şekilde bu, ölçülmemiş karıştırma olsa bile nedensel bir etkiyi tanımlamamıza izin verir — doğru aracı varsa.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Tanımlanabilirlik: Karar Verilebilir Bir Soru</h2>
<p class="l-text">Bir DAG ve bir <code>P(Y|do(X))</code> sorgusu verildiğinde, ID algoritması (Tian &amp; Pearl 2002, Shpitser &amp; Pearl 2006) etkinin tanımlanabilir olup olmadığına polinom zamanda karar verir ve eğer öyleyse formülü döner.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanımlanabilir</div><div class="card-body">Saf gözlemsel veri artı DAG, P(Y|do(X))'i hesaplamaya yeter. Arkakapı, ön-kapı veya daha egzotik kombinasyonlar.</div></div>
<div class="calc-card"><div class="card-title">Tanımlanamaz</div><div class="card-body">Gözlemsel niceliklerde bir formül yok. Bir deneye, bir araca veya ekstra varsayımlara (örn. parametrik form) ihtiyacın var.</div></div>
<div class="calc-card"><div class="card-title">Sınırlar</div><div class="card-body">Nokta-tanımlanmamış olsa bile, kısmi tanımlama etki üzerinde sınırlar verebilir (Manski 1990, Balke &amp; Pearl 1997).</div></div>
</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Araçsal Değişkenler — Son Çare</h2>
<p class="l-text">Arkakapı ve ön-kapı her ikisi de başarısız olduğunda, bir <strong>araç</strong> Z günü kurtarabilir. Z, T → Y için bir araçtır eğer: (a) Z, T'yi etkiler, (b) Z, Y'yi yalnızca T üzerinden etkiler, (c) Z, Y ile karıştırılmamıştır. Klasik örnek: askerlik kura çekilişi (Z) → askerlik hizmeti (T) → kazanç (Y), Angrist 1990.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

<span class="cm"># IV simulation: Z -&gt; T -&gt; Y, with U confounding T and Y</span>
np.random.<span class="fn">seed</span>(<span class="num">1</span>)
n = <span class="num">5000</span>
U = np.random.<span class="fn">randn</span>(n)
Z = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.5</span>, n).<span class="fn">astype</span>(<span class="fn">float</span>)
T = <span class="num">0.6</span>*Z + <span class="num">0.7</span>*U + <span class="num">0.2</span>*np.random.<span class="fn">randn</span>(n)
Y = <span class="num">1.5</span>*T + <span class="num">1.0</span>*U + <span class="num">0.3</span>*np.random.<span class="fn">randn</span>(n)   <span class="cm"># true causal effect = 1.5</span>

<span class="cm"># Naive OLS: biased</span>
b_ols = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(T.<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>), Y).coef_[<span class="num">0</span>]
<span class="fn">print</span>(f<span class="str">"OLS (biased):  {b_ols:.3f}"</span>)

<span class="cm"># 2-Stage Least Squares (2SLS)</span>
T_hat = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(Z.<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>), T).<span class="fn">predict</span>(Z.<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>))
b_iv = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(T_hat.<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>), Y).coef_[<span class="num">0</span>]
<span class="fn">print</span>(f<span class="str">"2SLS (IV):     {b_iv:.3f}   (true = 1.500)"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) bir araçsal-değişken senaryosu simüle ediyor: gizli <code>U</code>, <code>T</code> ile <code>Y</code>'yi karıştırırken ikili araç <code>Z</code> <code>T</code>'yi kaydırıyor ama <code>Y</code>'ye yalnızca <code>T</code> üzerinden giriyor; gerçek nedensel eğim <code>1.5</code>. 2) <code>Y</code>'yi yalnızca <code>T</code>'ye OLS ile regresliyor ve yanlı katsayıyı yazdırıyor — <code>U</code> yolu sayıyı gerçeklikten uzaklaştırıyor. 3) iki adımlı IV yordamını çalıştırıyor: önce <code>T</code>'yi <code>Z</code>'ye regresleyip <code>T_hat</code>'ı çıkarıyor, sonra <code>Y</code>'yi <code>T_hat</code>'a regresliyor; bu yalnızca <code>T</code>'nin <code>Z</code> kaynaklı kısmını kullanıyor ve katsayıyı <code>1.5</code>'a yaklaştırıyor.</p>
<p class="l-text">2SLS, ölçülmemiş karıştırma olsa bile gerçek nedensel etkiyi geri kazanır, T'deki sadece Z tarafından sürülen varyasyonu kullanarak (varsayım gereği karıştırılmamış olan).</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. dowhy İş Akışı (Demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (dowhy)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="cm"># dowhy is not in pyodide; demo of the four-step pipeline</span>
<span class="kw">from</span> dowhy <span class="kw">import</span> CausalModel

model = <span class="fn">CausalModel</span>(
    data=df,
    treatment=<span class="str">'support_calls'</span>,
    outcome=<span class="str">'churned'</span>,
    graph=<span class="str">"""digraph { tenure -&gt; support_calls; tenure -&gt; churned;
              charge -&gt; support_calls; charge -&gt; churned;
              support_calls -&gt; churned; }"""</span>
)
identified = model.<span class="fn">identify_effect</span>()         <span class="cm"># ID algorithm</span>
estimate = model.<span class="fn">estimate_effect</span>(identified, <span class="cm"># backdoor or IV</span>
    method_name=<span class="str">"backdoor.linear_regression"</span>)
refute = model.<span class="fn">refute_estimate</span>(identified, estimate,
    method_name=<span class="str">"random_common_cause"</span>)       <span class="cm"># robustness check</span>
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) dataframe üzerinden bir <code>dowhy.CausalModel</code> kuruyor; <code>support_calls</code>'u tedavi, <code>churned</code>'i sonuç olarak işaretliyor ve DAG'ı graphviz dizesi olarak veriyor. 2) <code>identify_effect()</code>'i çağırıyor; bu, ID algoritmasını çalıştırıp sembolik ayarlama formülünü döndürüyor. 3) önce <code>estimate_effect</code>'i lineer regresyonlu arkakapı tahmincisiyle, sonra <code>refute_estimate</code>'i rastgele ortak neden çürütücüsüyle zincirleyerek tahmini stres testine sokuyor.</p>
<p class="l-text">sklearn kullanan Pyodide-çalıştırılabilir eşdeğer:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression

df = df_churn.<span class="fn">copy</span>()
T = df[<span class="str">'support_calls'</span>].values
Y = df[<span class="str">'churned'</span>].values
Z = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>]].values

<span class="cm"># Backdoor adjustment via OLS</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
X = np.<span class="fn">column_stack</span>([T, Z])
m = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X, Y)
<span class="fn">print</span>(f<span class="str">"Causal effect of support_calls on churn (adjusted): {m.coef_[0]:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Coefficients on confounders: {m.coef_[1:]}"</span>)

<span class="cm"># Refutation: add a random "common cause" — should not change estimate much</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
fake = np.random.<span class="fn">randn</span>(<span class="fn">len</span>(T)).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>)
X2 = np.<span class="fn">column_stack</span>([X, fake])
m2 = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(X2, Y)
<span class="fn">print</span>(f<span class="str">"With random fake covariate:                        {m2.coef_[0]:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) churn verisinden tedavi <code>T = support_calls</code>, sonuç <code>Y = churned</code> ve karıştırıcı bloğu <code>Z = [tenure_months, monthly_charge]</code> çıkarılıp tasarım matrisinin ilk kolonu tedavi olacak şekilde birleştiriliyor. 2) bir <code>LinearRegression</code> eğitilip <code>support_calls</code> üzerindeki ayarlanmış katsayı arkakapı nedensel etki tahmini olarak raporlanıyor. 3) tasarım matrisine saf rastgele gürültüden oluşan "sahte" bir ortak neden kolonu ekleniyor ve model yeniden fit ediliyor; tedavi katsayısı çok az kayıyorsa bu, asıl tahminin sağlam olduğuna dair kanıt.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Tanımlanabilirlik Karar Ağacı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tüm karıştırıcılar gözlemli mi?</div><div class="card-body">Arkakapı ayarlamasını kullan. Tanımlandı.</div></div>
<div class="calc-card"><div class="card-title">Nedensel yolda aracı, karıştırıcılar gözlemsiz mi?</div><div class="card-body">Ön-kapıyı dene. Üç koşul tutuyorsa tanımlandı.</div></div>
<div class="calc-card"><div class="card-title">Bir aracın var mı?</div><div class="card-body">2SLS veya moment koşullarını kullan. Ek varsayımlar altında LATE'i tanımlar.</div></div>
<div class="calc-card"><div class="card-title">Yukarıdakilerin hiçbiri mi?</div><div class="card-body">Bir deney yap, ya da kısmi tanımlamayı (sınırları) kabul et.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Ders 4'te tanımlamadan <em>tahmine</em> geçiyoruz: gerçek veri üzerinde, sonlu örneklemler ve gürültülü regresörlerle ATE, ATT ve ITE'yi gerçekten nasıl hesaplayacağız.</div>
</div>`
};
