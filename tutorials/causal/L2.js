window.CAUSAL_L2 = {
en: `<p class="l-text">Pearl's deepest insight is that causal assumptions are <strong>graphs</strong>. A directed acyclic graph (DAG) over your variables is not a nice-to-have visualization — it is the entire causal model, the mathematical object on which every identification proof rests. Once you draw the DAG, the rules of d-separation tell you mechanically which variables to condition on, which to leave alone, and which would actively poison your estimate.</p>
<p class="l-text">In this lesson we build DAGs in <code>networkx</code>, walk through the three atomic structures (chain, fork, collider), and master the <em>backdoor criterion</em>: the single rule that solves 80% of real-world causal questions. By the end you will look at any treatment-outcome question and know exactly which covariates to include in your regression.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>How to draw a Directed Acyclic Graph (DAG) for a real problem</li>
<li>The three building blocks: chains (X→Z→Y), forks (X←Z→Y), colliders (X→Z←Y)</li>
<li>d-separation — when conditioning blocks vs. opens a path</li>
<li>The backdoor criterion: which covariates to control for</li>
<li>Confounders, mediators, colliders — why one helps and the other two hurt</li>
<li>How to implement DAGs and d-separation in Python with networkx</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. What is a Causal DAG?</h2>
<p class="l-text">A DAG has nodes (variables) and directed edges (X→Y means X is a direct cause of Y). "Acyclic" means no loops: a variable cannot cause itself. The DAG is your <em>structural causal model</em>, equivalent to a system of structural equations.</p>
<div class="katex-block">$$X \\to Y \\;\\Leftrightarrow\\; Y := f_Y(X, U_Y)$$</div>
<p class="l-text">Each node is determined by its parents plus an independent noise term. The DAG encodes the assumption "no other direct causes." This is your <strong>causal hypothesis</strong>, and it must come from domain knowledge — data alone cannot pick a DAG (Verma &amp; Pearl 1990).</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Two different DAGs can produce the same observational distribution (Markov equivalence class). You cannot tell them apart without intervention or assumptions.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Building a DAG in networkx</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="cm"># Churn DAG: tenure and monthly_charge are confounders</span>
<span class="cm"># of (support_calls -&gt; churn). Promo is a candidate intervention.</span>
G = nx.<span class="fn">DiGraph</span>()
G.<span class="fn">add_edges_from</span>([
    (<span class="str">'tenure'</span>,<span class="str">'support_calls'</span>),
    (<span class="str">'tenure'</span>,<span class="str">'churn'</span>),
    (<span class="str">'charge'</span>,<span class="str">'support_calls'</span>),
    (<span class="str">'charge'</span>,<span class="str">'churn'</span>),
    (<span class="str">'promo'</span>,<span class="str">'churn'</span>),
    (<span class="str">'support_calls'</span>,<span class="str">'churn'</span>),
])

<span class="fn">print</span>(<span class="str">"Nodes:"</span>, <span class="fn">list</span>(G.nodes))
<span class="fn">print</span>(<span class="str">"Edges:"</span>, <span class="fn">list</span>(G.edges))
<span class="fn">print</span>(<span class="str">"Is DAG:"</span>, nx.<span class="fn">is_directed_acyclic_graph</span>(G))
<span class="fn">print</span>(<span class="str">"Topological order:"</span>, <span class="fn">list</span>(nx.<span class="fn">topological_sort</span>(G)))

<span class="cm"># Parents of churn = direct causes</span>
<span class="fn">print</span>(<span class="str">"\\nDirect causes of churn:"</span>, <span class="fn">list</span>(G.<span class="fn">predecessors</span>(<span class="str">'churn'</span>)))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a <code>nx.DiGraph</code> and adds six directed edges encoding the churn DAG (tenure and charge each point into both <code>support_calls</code> and <code>churn</code>, plus <code>promo→churn</code> and <code>support_calls→churn</code>). 2) prints the node and edge lists, confirms it is acyclic with <code>is_directed_acyclic_graph</code>, and shows a topological order. 3) lists the direct parents of <code>churn</code> via <code>G.predecessors</code> — these are exactly the variables we are claiming are its direct causes.</p>
<p class="l-text">This is our working DAG for the lesson. The question we want to answer: <em>what is the causal effect of <code>support_calls</code> on <code>churn</code>?</em> Naive regression of churn on support_calls will be biased by the two confounders.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. The Three Atoms: Chain, Fork, Collider</h2>
<p class="l-text">Every path in a DAG decomposes into three building blocks. Each behaves differently when you condition on the middle node.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chain X → Z → Y</div><div class="card-body">Z is a <strong>mediator</strong>. Information flows X → Y through Z. Conditioning on Z <em>blocks</em> the flow. Don't condition on mediators if you want the total effect.</div></div>
<div class="calc-card"><div class="card-title">Fork X ← Z → Y</div><div class="card-body">Z is a <strong>confounder</strong>. It creates spurious association between X and Y. Conditioning on Z <em>blocks</em> the path. You <em>must</em> condition on confounders.</div></div>
<div class="calc-card"><div class="card-title">Collider X → Z ← Y</div><div class="card-body">Z is a <strong>collider</strong>. The path is naturally blocked. Conditioning on Z <em>opens</em> a spurious path. Never condition on colliders or their descendants.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">The collider rule is the most counterintuitive in causal inference. Conditioning on a collider <em>creates</em> correlation between two unrelated variables. Famous example: in a dating pool, "kindness" and "looks" appear negatively correlated — because nice-looking people get taken first (selection on a collider).</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. d-Separation: The Master Algorithm</h2>
<p class="l-text">A path is <strong>d-separated</strong> by a conditioning set Z if every path from X to Y is blocked by Z. The rules:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Block by inclusion</div><div class="card-body">A non-collider on the path is in Z → path blocked.</div></div>
<div class="calc-card"><div class="card-title">Block by exclusion</div><div class="card-body">A collider (and all its descendants) is NOT in Z → path blocked.</div></div>
<div class="calc-card"><div class="card-title">Open path</div><div class="card-body">Otherwise the path is open and information can leak between X and Y.</div></div>
</div>
<p class="l-text">If X and Y are d-separated given Z in the DAG, then X ⊥ Y | Z in the data (Verma–Pearl theorem, 1988). networkx implements this directly:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">DiGraph</span>()
G.<span class="fn">add_edges_from</span>([
    (<span class="str">'tenure'</span>,<span class="str">'support_calls'</span>),
    (<span class="str">'tenure'</span>,<span class="str">'churn'</span>),
    (<span class="str">'charge'</span>,<span class="str">'support_calls'</span>),
    (<span class="str">'charge'</span>,<span class="str">'churn'</span>),
    (<span class="str">'support_calls'</span>,<span class="str">'churn'</span>),
])

<span class="cm"># Without conditioning: are support_calls and churn d-separated?</span>
<span class="fn">print</span>(<span class="str">"Empty conditioning:"</span>, nx.<span class="fn">d_separated</span>(G, {<span class="str">'support_calls'</span>}, {<span class="str">'churn'</span>}, <span class="fn">set</span>()))
<span class="cm"># Conditioning on the confounders</span>
<span class="fn">print</span>(<span class="str">"Cond on tenure+charge:"</span>, nx.<span class="fn">d_separated</span>(G, {<span class="str">'support_calls'</span>}, {<span class="str">'churn'</span>}, {<span class="str">'tenure'</span>,<span class="str">'charge'</span>}))

<span class="cm"># All simple paths between support_calls and churn (in undirected sense)</span>
UG = G.<span class="fn">to_undirected</span>()
<span class="fn">print</span>(<span class="str">"\\nAll paths support_calls -&gt; churn:"</span>)
<span class="kw">for</span> p <span class="kw">in</span> nx.<span class="fn">all_simple_paths</span>(UG, <span class="str">'support_calls'</span>, <span class="str">'churn'</span>):
    <span class="fn">print</span>(<span class="str">"  "</span>, p)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) rebuilds the churn DAG without the <code>promo</code> node so we focus on a single treatment–outcome question. 2) calls <code>nx.d_separated</code> first with an empty conditioning set (returns <code>False</code> — the variables are connected) and then with <code>{tenure, charge}</code> (returns <code>True</code> — the confounders block every non-direct path). 3) enumerates every simple path between <code>support_calls</code> and <code>churn</code> on the undirected skeleton so we can read off which paths the adjustment set actually closes.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. The Backdoor Criterion</h2>
<p class="l-text">Pearl's <strong>backdoor criterion</strong> (1995) gives a sufficient adjustment set: a set Z that blocks every "backdoor" path from treatment T to outcome Y, while containing no descendants of T. The backdoor adjustment formula then identifies the causal effect:</p>
<div class="katex-block">$$P(Y | \\text{do}(T)) = \\sum_{z} P(Y | T, z) \\, P(z)$$</div>
<p class="l-text">In words: stratify by Z, compute the conditional, then average over the marginal of Z. This is exactly what regression with covariates does (under linearity).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="kw">def</span> <span class="fn">find_backdoor_paths</span>(G, T, Y):
    <span class="str">"""All paths from T to Y that start with an arrow INTO T."""</span>
    UG = G.<span class="fn">to_undirected</span>()
    paths = []
    <span class="kw">for</span> p <span class="kw">in</span> nx.<span class="fn">all_simple_paths</span>(UG, T, Y):
        <span class="cm"># Check first edge: must be incoming to T</span>
        <span class="kw">if</span> G.<span class="fn">has_edge</span>(p[<span class="num">1</span>], T):
            paths.<span class="fn">append</span>(p)
    <span class="kw">return</span> paths

G = nx.<span class="fn">DiGraph</span>()
G.<span class="fn">add_edges_from</span>([
    (<span class="str">'tenure'</span>,<span class="str">'support_calls'</span>),(<span class="str">'tenure'</span>,<span class="str">'churn'</span>),
    (<span class="str">'charge'</span>,<span class="str">'support_calls'</span>),(<span class="str">'charge'</span>,<span class="str">'churn'</span>),
    (<span class="str">'support_calls'</span>,<span class="str">'churn'</span>),
])
<span class="fn">print</span>(<span class="str">"Backdoor paths from support_calls to churn:"</span>)
<span class="kw">for</span> p <span class="kw">in</span> <span class="fn">find_backdoor_paths</span>(G, <span class="str">'support_calls'</span>, <span class="str">'churn'</span>):
    <span class="fn">print</span>(<span class="str">"  "</span>, p)
<span class="cm"># To block both, condition on {tenure, charge}</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines a helper <code>find_backdoor_paths(G, T, Y)</code> that enumerates simple paths from T to Y on the undirected skeleton and keeps only those whose first edge points <em>into</em> T — the formal definition of a backdoor path. 2) rebuilds the churn DAG and calls the helper for <code>T=support_calls, Y=churn</code>. 3) prints each backdoor path, making it visible that conditioning on <code>{tenure, charge}</code> blocks both routes — exactly the adjustment set the backdoor criterion would pick.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Collider Bias in the Wild</h2>
<p class="l-text">Berkson's paradox (1946): in a hospital, smoking and a non-related disease appear negatively correlated, because both cause hospitalization (the collider). Conditioning on "in hospital" opens a spurious path.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
n = <span class="num">10000</span>
<span class="cm"># Two independent traits</span>
talent = np.random.<span class="fn">randn</span>(n)
beauty = np.random.<span class="fn">randn</span>(n)
<span class="cm"># Hollywood selects on (talent + beauty &gt; threshold)</span>
hired = (talent + beauty &gt; <span class="num">1.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)

df = pd.<span class="fn">DataFrame</span>({<span class="str">'talent'</span>:talent,<span class="str">'beauty'</span>:beauty,<span class="str">'hired'</span>:hired})

<span class="fn">print</span>(f<span class="str">"Population correlation: {df[['talent','beauty']].corr().iloc[0,1]:.3f}"</span>)
hired_only = df[df[<span class="str">'hired'</span>]==<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Among hired only:        {hired_only[['talent','beauty']].corr().iloc[0,1]:.3f}"</span>)
<span class="cm"># Negative correlation appears! Pure selection / collider bias.</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) draws <code>talent</code> and <code>beauty</code> as two independent standard-normal arrays so the population correlation between them is zero by construction. 2) defines <code>hired = 1</code> only when <code>talent + beauty > 1.5</code> — Hollywood selects on the <em>sum</em>, which makes <code>hired</code> a collider. 3) prints the correlation in the full population and again restricted to <code>hired==1</code>; the restricted correlation flips negative because conditioning on the collider opens a spurious path between the two traits.</p>
<p class="l-text">In the population, talent and beauty are uncorrelated. Among the hired (a collider), they appear negatively correlated. This is why "talented actors aren't beautiful" — it's selection bias, not biology.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Mediator vs. Confounder vs. Collider — Decision Tree</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Confounder (fork)</div><div class="card-body"><strong>Always control.</strong> Failing to control creates spurious effects (omitted variable bias).</div></div>
<div class="calc-card"><div class="card-title">Mediator (chain)</div><div class="card-body">Control only if you want the <em>direct</em> effect. For the <em>total</em> effect, leave it free.</div></div>
<div class="calc-card"><div class="card-title">Collider</div><div class="card-body"><strong>Never control.</strong> Conditioning opens a spurious backdoor path.</div></div>
<div class="calc-card"><div class="card-title">Pre-treatment irrelevant</div><div class="card-body">Has no edge to treatment or outcome → safe to include or exclude (won't bias, may help variance).</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Standard ML wisdom "throw all features in" is causally wrong. Including colliders flips the sign. Including mediators erases the effect you're measuring. The DAG is your guide.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Practical Workflow on the Churn DAG</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_churn.<span class="fn">copy</span>()

<span class="cm"># Hypothesis: support_calls causally increases churn.</span>
<span class="cm"># DAG says: condition on tenure_months and monthly_charge.</span>

T = df[[<span class="str">'support_calls'</span>]].values
Y = df[<span class="str">'churned'</span>].values
X_confound = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>]].values

<span class="cm"># Naive (no adjustment)</span>
m_naive = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(T, Y)
<span class="fn">print</span>(f<span class="str">"Naive coef: {m_naive.coef_[0][0]:+.4f}"</span>)

<span class="cm"># Backdoor-adjusted (control for confounders)</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
X_full = np.<span class="fn">hstack</span>([T, X_confound])
m_adj = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(X_full, Y)
<span class="fn">print</span>(f<span class="str">"Adjusted coef on support_calls: {m_adj.coef_[0][0]:+.4f}"</span>)

<span class="cm"># The two estimates differ — that's the bias the backdoor criterion removed</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) splits the churn data into a treatment column <code>T = support_calls</code>, an outcome <code>Y = churned</code> and a confounder block <code>X_confound = [tenure_months, monthly_charge]</code>. 2) fits a naive <code>LogisticRegression</code> of <code>Y</code> on <code>T</code> alone and prints the coefficient. 3) horizontally stacks <code>T</code> with the confounders, refits, and prints the adjusted coefficient on <code>support_calls</code>. The gap between the two coefficients is exactly the bias the backdoor adjustment set removes.</p>
<p class="l-text">In Lesson 3 we'll formalize this with the do-calculus and learn how to handle harder graphs where the backdoor criterion fails (front-door, instrumental variables).</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Reading &amp; Tools</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Key references: Pearl, <em>Causality</em> (2009) ch. 1-3 for DAGs and d-separation. Hernán &amp; Robins, <em>Causal Inference: What If</em> (2020) ch. 6 for backdoor criterion. Tools: <code>networkx</code> (DAG ops), <code>dowhy</code> (full pipeline), <code>causalgraphicalmodels</code> (Markov equivalence). DAGitty (web app) is invaluable for prototyping.</div>
</div>`,
tr: `<p class="l-text">Pearl'ün en derin içgörüsü, nedensel varsayımların <strong>graflar</strong> olduğudur. Değişkenleriniz üzerindeki yönlendirilmiş asiklik graf (DAG), sahip-olunması-güzel bir görselleştirme değildir — tüm nedensel modeldir, üzerinde her tanımlama kanıtının dayandığı matematiksel nesnedir. DAG'ı çizdiğinizde, d-ayrılma kuralları size mekanik olarak hangi değişkenleri koşullayacağınızı, hangilerini bırakacağınızı ve hangilerinin tahmininizi aktif olarak zehirleyeceğini söyler.</p>
<p class="l-text">Bu derste <code>networkx</code>'te DAG'lar inşa ediyoruz, üç atomik yapıyı (zincir, çatal, çarpışıcı) gözden geçiriyoruz ve <em>arkakapı kriteri</em>'ni öğreniyoruz: gerçek dünya nedensel sorularının %80'ini çözen tek kural. Ders sonunda herhangi bir tedavi-sonuç sorusuna bakacak ve regresyonunuza hangi ortak değişkenleri dahil edeceğinizi tam olarak bileceksiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Gerçek bir problem için Yönlendirilmiş Asiklik Graf (DAG) nasıl çizilir</li>
<li>Üç yapı taşı: zincirler (X→Z→Y), çatallar (X←Z→Y), çarpışıcılar (X→Z←Y)</li>
<li>d-ayrılma — koşullamanın yolu ne zaman bloklayıp ne zaman açtığı</li>
<li>Arkakapı kriteri: hangi ortak değişkenleri kontrol edeceksin</li>
<li>Karıştırıcılar, aracılar, çarpışıcılar — neden biri yardım eder ve diğer ikisi zarar verir</li>
<li>Python'da networkx ile DAG'lar ve d-ayrılma nasıl uygulanır</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Nedensel DAG Nedir?</h2>
<p class="l-text">Bir DAG'ın düğümleri (değişkenler) ve yönlendirilmiş kenarları vardır (X→Y, X'in Y'nin doğrudan nedeni olduğu anlamına gelir). "Asiklik" döngü olmadığı anlamına gelir: bir değişken kendisinin nedeni olamaz. DAG, sizin <em>yapısal nedensel modelinizdir</em>, bir yapısal denklemler sistemine eşdeğerdir.</p>
<div class="katex-block">$$X \\to Y \\;\\Leftrightarrow\\; Y := f_Y(X, U_Y)$$</div>
<p class="l-text">Her düğüm, ebeveynleri artı bağımsız bir gürültü terimi tarafından belirlenir. DAG, "başka doğrudan neden yok" varsayımını kodlar. Bu sizin <strong>nedensel hipoteziniz</strong>dir ve alan bilgisinden gelmelidir — veri tek başına bir DAG seçemez (Verma &amp; Pearl 1990).</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">İki farklı DAG aynı gözlemsel dağılımı üretebilir (Markov denklik sınıfı). Müdahale veya varsayım olmadan onları ayırt edemezsiniz.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. networkx'te Bir DAG Kurma</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="cm"># Churn DAG: tenure and monthly_charge are confounders</span>
<span class="cm"># of (support_calls -&gt; churn). Promo is a candidate intervention.</span>
G = nx.<span class="fn">DiGraph</span>()
G.<span class="fn">add_edges_from</span>([
    (<span class="str">'tenure'</span>,<span class="str">'support_calls'</span>),
    (<span class="str">'tenure'</span>,<span class="str">'churn'</span>),
    (<span class="str">'charge'</span>,<span class="str">'support_calls'</span>),
    (<span class="str">'charge'</span>,<span class="str">'churn'</span>),
    (<span class="str">'promo'</span>,<span class="str">'churn'</span>),
    (<span class="str">'support_calls'</span>,<span class="str">'churn'</span>),
])

<span class="fn">print</span>(<span class="str">"Nodes:"</span>, <span class="fn">list</span>(G.nodes))
<span class="fn">print</span>(<span class="str">"Edges:"</span>, <span class="fn">list</span>(G.edges))
<span class="fn">print</span>(<span class="str">"Is DAG:"</span>, nx.<span class="fn">is_directed_acyclic_graph</span>(G))
<span class="fn">print</span>(<span class="str">"Topological order:"</span>, <span class="fn">list</span>(nx.<span class="fn">topological_sort</span>(G)))

<span class="cm"># Parents of churn = direct causes</span>
<span class="fn">print</span>(<span class="str">"\\nDirect causes of churn:"</span>, <span class="fn">list</span>(G.<span class="fn">predecessors</span>(<span class="str">'churn'</span>)))
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) bir <code>nx.DiGraph</code> kurup churn DAG'ını altı yönlü kenarla kodluyor (<code>tenure</code> ve <code>charge</code> hem <code>support_calls</code>'a hem <code>churn</code>'e ok atıyor; ayrıca <code>promo→churn</code> ve <code>support_calls→churn</code>). 2) düğüm ve kenar listelerini yazdırıyor, <code>is_directed_acyclic_graph</code> ile döngüsüz olduğunu doğruluyor ve bir topolojik sıralama gösteriyor. 3) <code>G.predecessors</code> ile <code>churn</code>'ün doğrudan ebeveynlerini listeliyor — bunlar tam olarak doğrudan neden olarak öne sürdüğümüz değişkenler.</p>
<p class="l-text">Bu, dersimiz için çalışan DAG'ımız. Cevaplamak istediğimiz soru: <em><code>support_calls</code>'un <code>churn</code> üzerindeki nedensel etkisi nedir?</em> Churn'ün support_calls üzerine naif regresyonu iki karıştırıcı tarafından yanlı olacaktır.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Üç Atom: Zincir, Çatal, Çarpışıcı</h2>
<p class="l-text">Bir DAG'daki her yol üç yapı taşına ayrışır. Her biri ortadaki düğümü koşulladığınızda farklı davranır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zincir X → Z → Y</div><div class="card-body">Z bir <strong>aracı</strong>dır. Bilgi X → Y yönünde Z üzerinden akar. Z'yi koşullamak akışı <em>bloklar</em>. Toplam etkiyi istiyorsanız aracıları koşullamayın.</div></div>
<div class="calc-card"><div class="card-title">Çatal X ← Z → Y</div><div class="card-body">Z bir <strong>karıştırıcı</strong>dır. X ve Y arasında sahte birliktelik yaratır. Z'yi koşullamak yolu <em>bloklar</em>. Karıştırıcıları <em>mutlaka</em> koşullamalısınız.</div></div>
<div class="calc-card"><div class="card-title">Çarpışıcı X → Z ← Y</div><div class="card-body">Z bir <strong>çarpışıcı</strong>dır. Yol doğal olarak bloklanmıştır. Z'yi koşullamak sahte bir yol <em>açar</em>. Çarpışıcıları veya torunlarını asla koşullamayın.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Çarpışıcı kuralı nedensel çıkarımdaki en sezgi-karşıtı kuraldır. Bir çarpışıcıyı koşullamak iki ilgisiz değişken arasında korelasyon <em>yaratır</em>. Ünlü örnek: bir flört havuzunda "naziklik" ve "görünüş" negatif korelasyonlu görünür — çünkü güzel-naziklerin önce sahibi çıkar (bir çarpışıcı üzerinde seçim).</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. d-Ayrılma: Ana Algoritma</h2>
<p class="l-text">Bir yol, X'ten Y'ye giden her yolu Z'nin bloklamasıyla bir Z koşullama kümesi tarafından <strong>d-ayrılmıştır</strong>. Kurallar:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dahil etme ile blokla</div><div class="card-body">Yol üzerindeki çarpışıcı olmayan bir düğüm Z'de → yol bloklu.</div></div>
<div class="calc-card"><div class="card-title">Dışlama ile blokla</div><div class="card-body">Bir çarpışıcı (ve tüm torunları) Z'de DEĞİL → yol bloklu.</div></div>
<div class="calc-card"><div class="card-title">Açık yol</div><div class="card-body">Aksi takdirde yol açıktır ve X ile Y arasında bilgi sızabilir.</div></div>
</div>
<p class="l-text">DAG'da Z verildiğinde X ve Y d-ayrılmışsa, o zaman veride X ⊥ Y | Z (Verma–Pearl teoremi, 1988). networkx bunu doğrudan uygular:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">DiGraph</span>()
G.<span class="fn">add_edges_from</span>([
    (<span class="str">'tenure'</span>,<span class="str">'support_calls'</span>),
    (<span class="str">'tenure'</span>,<span class="str">'churn'</span>),
    (<span class="str">'charge'</span>,<span class="str">'support_calls'</span>),
    (<span class="str">'charge'</span>,<span class="str">'churn'</span>),
    (<span class="str">'support_calls'</span>,<span class="str">'churn'</span>),
])

<span class="cm"># Without conditioning: are support_calls and churn d-separated?</span>
<span class="fn">print</span>(<span class="str">"Empty conditioning:"</span>, nx.<span class="fn">d_separated</span>(G, {<span class="str">'support_calls'</span>}, {<span class="str">'churn'</span>}, <span class="fn">set</span>()))
<span class="cm"># Conditioning on the confounders</span>
<span class="fn">print</span>(<span class="str">"Cond on tenure+charge:"</span>, nx.<span class="fn">d_separated</span>(G, {<span class="str">'support_calls'</span>}, {<span class="str">'churn'</span>}, {<span class="str">'tenure'</span>,<span class="str">'charge'</span>}))

<span class="cm"># All simple paths between support_calls and churn (in undirected sense)</span>
UG = G.<span class="fn">to_undirected</span>()
<span class="fn">print</span>(<span class="str">"\\nAll paths support_calls -&gt; churn:"</span>)
<span class="kw">for</span> p <span class="kw">in</span> nx.<span class="fn">all_simple_paths</span>(UG, <span class="str">'support_calls'</span>, <span class="str">'churn'</span>):
    <span class="fn">print</span>(<span class="str">"  "</span>, p)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) tek bir tedavi–sonuç sorusuna odaklanmak için churn DAG'ını <code>promo</code> düğümü olmadan yeniden kuruyor. 2) <code>nx.d_separated</code>'ı önce boş koşullama kümesiyle çağırıyor (sonuç <code>False</code> — değişkenler bağlı) sonra <code>{tenure, charge}</code> ile çağırıyor (sonuç <code>True</code> — karıştırıcılar doğrudan-olmayan her yolu bloklar). 3) yönsüz iskelet üzerinde <code>support_calls</code> ile <code>churn</code> arasındaki tüm basit yolları sıralıyor; böylece ayarlama kümesinin tam olarak hangi yolları kapadığını okuyabiliyoruz.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Arkakapı Kriteri</h2>
<p class="l-text">Pearl'ün <strong>arkakapı kriteri</strong> (1995) yeterli bir ayarlama kümesi verir: T tedavisinden Y sonucuna giden her "arkakapı" yolunu bloklayan ve T'nin hiçbir torununu içermeyen bir Z kümesi. Arkakapı ayarlama formülü daha sonra nedensel etkiyi tanımlar:</p>
<div class="katex-block">$$P(Y | \\text{do}(T)) = \\sum_{z} P(Y | T, z) \\, P(z)$$</div>
<p class="l-text">Sözle: Z'ye göre tabakalandır, koşulluyu hesapla, sonra Z'nin marjinali üzerinden ortalama al. Bu tam olarak ortak değişkenli regresyonun yaptığı şeydir (doğrusallık altında).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="kw">def</span> <span class="fn">find_backdoor_paths</span>(G, T, Y):
    <span class="str">"""All paths from T to Y that start with an arrow INTO T."""</span>
    UG = G.<span class="fn">to_undirected</span>()
    paths = []
    <span class="kw">for</span> p <span class="kw">in</span> nx.<span class="fn">all_simple_paths</span>(UG, T, Y):
        <span class="cm"># Check first edge: must be incoming to T</span>
        <span class="kw">if</span> G.<span class="fn">has_edge</span>(p[<span class="num">1</span>], T):
            paths.<span class="fn">append</span>(p)
    <span class="kw">return</span> paths

G = nx.<span class="fn">DiGraph</span>()
G.<span class="fn">add_edges_from</span>([
    (<span class="str">'tenure'</span>,<span class="str">'support_calls'</span>),(<span class="str">'tenure'</span>,<span class="str">'churn'</span>),
    (<span class="str">'charge'</span>,<span class="str">'support_calls'</span>),(<span class="str">'charge'</span>,<span class="str">'churn'</span>),
    (<span class="str">'support_calls'</span>,<span class="str">'churn'</span>),
])
<span class="fn">print</span>(<span class="str">"Backdoor paths from support_calls to churn:"</span>)
<span class="kw">for</span> p <span class="kw">in</span> <span class="fn">find_backdoor_paths</span>(G, <span class="str">'support_calls'</span>, <span class="str">'churn'</span>):
    <span class="fn">print</span>(<span class="str">"  "</span>, p)
<span class="cm"># To block both, condition on {tenure, charge}</span>
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) yardımcı fonksiyon <code>find_backdoor_paths(G, T, Y)</code> tanımlanıyor: yönsüz iskelet üzerinde T'den Y'ye giden tüm basit yolları sıralayıp yalnızca ilk kenarı T'ye <em>doğru</em> yönlü olanları tutuyor — arkakapı yolunun formal tanımı budur. 2) churn DAG'ı yeniden kuruluyor ve fonksiyon <code>T=support_calls, Y=churn</code> için çağrılıyor. 3) her arkakapı yolu yazdırılıyor; böylece <code>{tenure, charge}</code> üzerinde koşullamanın her iki güzergahı da kapadığı görsel olarak doğrulanabiliyor — arkakapı kriterinin seçeceği ayarlama kümesi tam olarak budur.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Vahşi Doğada Çarpışıcı Yanlılığı</h2>
<p class="l-text">Berkson paradoksu (1946): bir hastanede sigara ve ilgisiz bir hastalık negatif korelasyonlu görünür, çünkü her ikisi de hastaneye yatışa (çarpışıcı) sebep olur. "Hastanede" üzerinde koşullamak sahte bir yol açar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
n = <span class="num">10000</span>
<span class="cm"># Two independent traits</span>
talent = np.random.<span class="fn">randn</span>(n)
beauty = np.random.<span class="fn">randn</span>(n)
<span class="cm"># Hollywood selects on (talent + beauty &gt; threshold)</span>
hired = (talent + beauty &gt; <span class="num">1.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)

df = pd.<span class="fn">DataFrame</span>({<span class="str">'talent'</span>:talent,<span class="str">'beauty'</span>:beauty,<span class="str">'hired'</span>:hired})

<span class="fn">print</span>(f<span class="str">"Population correlation: {df[['talent','beauty']].corr().iloc[0,1]:.3f}"</span>)
hired_only = df[df[<span class="str">'hired'</span>]==<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Among hired only:        {hired_only[['talent','beauty']].corr().iloc[0,1]:.3f}"</span>)
<span class="cm"># Negative correlation appears! Pure selection / collider bias.</span>
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>talent</code> ve <code>beauty</code> iki bağımsız standart normal dizi olarak çekiliyor, yani popülasyon korelasyonları inşaat gereği sıfır. 2) <code>hired</code> yalnızca <code>talent + beauty > 1.5</code> olduğunda 1 olacak şekilde tanımlanıyor — Hollywood <em>toplam</em> üzerinden seçim yapıyor, bu da <code>hired</code>'ı bir çarpışıcı haline getiriyor. 3) önce tüm popülasyondaki, sonra <code>hired==1</code>'e kısıtlanmış altkümedeki korelasyon yazdırılıyor; kısıtlı korelasyon negatife dönüyor, çünkü çarpışıcıyı koşullamak iki özellik arasında sahte bir yol açıyor.</p>
<p class="l-text">Popülasyonda yetenek ve güzellik korelasyonsuzdur. İşe alınanlar arasında (bir çarpışıcı), negatif korelasyonlu görünürler. "Yetenekli aktörler güzel değil" buradan gelir — bu seçim yanlılığıdır, biyoloji değil.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Aracı vs. Karıştırıcı vs. Çarpışıcı — Karar Ağacı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karıştırıcı (çatal)</div><div class="card-body"><strong>Her zaman kontrol et.</strong> Kontrol etmemek sahte etkiler yaratır (atlanmış değişken yanlılığı).</div></div>
<div class="calc-card"><div class="card-title">Aracı (zincir)</div><div class="card-body">Sadece <em>doğrudan</em> etkiyi istiyorsan kontrol et. <em>Toplam</em> etki için, serbest bırak.</div></div>
<div class="calc-card"><div class="card-title">Çarpışıcı</div><div class="card-body"><strong>Asla kontrol etme.</strong> Koşullama sahte bir arkakapı yolu açar.</div></div>
<div class="calc-card"><div class="card-title">Tedavi öncesi alakasız</div><div class="card-body">Tedavi veya sonuca kenarı yok → dahil etmek veya hariç tutmak güvenli (yanlamaz, varyansa yardım edebilir).</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Standart ML bilgeliği "tüm özellikleri içeri at" nedensel olarak yanlıştır. Çarpışıcıları dahil etmek işareti tersine çevirir. Aracıları dahil etmek ölçtüğünüz etkiyi siler. DAG sizin rehberinizdir.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Churn DAG Üzerinde Pratik İş Akışı</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_churn.<span class="fn">copy</span>()

<span class="cm"># Hypothesis: support_calls causally increases churn.</span>
<span class="cm"># DAG says: condition on tenure_months and monthly_charge.</span>

T = df[[<span class="str">'support_calls'</span>]].values
Y = df[<span class="str">'churned'</span>].values
X_confound = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>]].values

<span class="cm"># Naive (no adjustment)</span>
m_naive = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(T, Y)
<span class="fn">print</span>(f<span class="str">"Naive coef: {m_naive.coef_[0][0]:+.4f}"</span>)

<span class="cm"># Backdoor-adjusted (control for confounders)</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
X_full = np.<span class="fn">hstack</span>([T, X_confound])
m_adj = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(X_full, Y)
<span class="fn">print</span>(f<span class="str">"Adjusted coef on support_calls: {m_adj.coef_[0][0]:+.4f}"</span>)

<span class="cm"># The two estimates differ — that's the bias the backdoor criterion removed</span>
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) churn verisini tedavi kolonu <code>T = support_calls</code>, sonuç <code>Y = churned</code> ve karıştırıcı bloğu <code>X_confound = [tenure_months, monthly_charge]</code> olarak ayırıyor. 2) yalnızca <code>T</code>'yi kullanan naif bir <code>LogisticRegression</code> eğitip katsayıyı yazdırıyor. 3) <code>T</code>'yi karıştırıcılarla yatay birleştirip yeniden eğitiyor ve <code>support_calls</code> üzerindeki ayarlanmış katsayıyı yazdırıyor. İki katsayı arasındaki fark, tam olarak arkakapı ayarlama kümesinin temizlediği yanlılıktır.</p>
<p class="l-text">Ders 3'te bunu do-calculus ile formalize edeceğiz ve arkakapı kriterinin başarısız olduğu daha zor grafları (ön-kapı, araçsal değişkenler) nasıl ele alacağımızı öğreneceğiz.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Okuma &amp; Araçlar</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Anahtar referanslar: DAG'lar ve d-ayrılma için Pearl, <em>Causality</em> (2009) bölüm 1-3. Arkakapı kriteri için Hernán &amp; Robins, <em>Causal Inference: What If</em> (2020) bölüm 6. Araçlar: <code>networkx</code> (DAG işlemleri), <code>dowhy</code> (tam pipeline), <code>causalgraphicalmodels</code> (Markov denkliği). DAGitty (web uygulaması) prototipleme için paha biçilmezdir.</div>
</div>`
};
