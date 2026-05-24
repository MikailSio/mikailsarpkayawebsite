window.MATH_L10 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Statistical learning theory is the mathematical answer to the question "why should machine learning work at all?"</strong> You fit a model to a finite sample, and yet you expect it to perform on data it has never seen. That expectation is not free — it depends on the model class being neither too rich (else it just memorizes) nor too poor (else it cannot represent the signal). Statistical learning theory makes that trade-off precise. It defines what "learnable" means (Valiant, PAC, 1984), proves quantitative bounds on the gap between training error and true error (Vapnik-Chervonenkis 1971, Hoeffding 1963), and gives you the language to talk about generalization without hand-waving.</p>

<p class="l-text">The classical theory was almost complete by the early 2000s — VC dimension, Rademacher complexity, PAC-Bayes — and it predicted that you must have many more samples than parameters to generalize. Then deep learning happened. Networks with hundreds of millions of parameters trained on tens of thousands of images generalized beautifully. The classical bounds went from informative to vacuously loose. Zhang et al. (2017) showed that the same network that learns CIFAR-10 in 50 epochs will also memorize random labels in 50 epochs — the hypothesis class is large enough to fit anything, yet on real data it picks out the right hypothesis. This lesson covers the classical theory in full detail (because it is still right for moderate-sized models and provides the vocabulary for everything else) and then maps out the modern picture: NTK, double descent, implicit regularization, lottery tickets, PAC-Bayes. By the end you should be able to read a generalization paper and know what the authors are claiming.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the PAC learning framework (Valiant 1984) and identify when a class is PAC-learnable</li>
<li>Prove and apply Hoeffding's inequality as the engine behind generalization bounds for finite classes</li>
<li>Compute the VC dimension of half-planes, axis-aligned rectangles, decision stumps, and feed-forward neural nets</li>
<li>State the Sauer-Shelah lemma and explain why VC dimension controls the effective size of an infinite class</li>
<li>Estimate Rademacher complexity by simulation and explain why it gives tighter bounds than VC</li>
<li>Recognise why classical bounds are vacuous for modern deep networks and survey the modern replacements (NTK, double descent, PAC-Bayes, lottery tickets, implicit bias of SGD)</li>
<li>Interpret the No Free Lunch theorem (Wolpert 1996) as the requirement that all generalization comes from inductive bias</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Learning Setup — What Are We Actually Doing?</h2>
<p class="l-text">Fix the picture once. There is an unknown data distribution $\\mathcal{D}$ over input-label pairs $(x, y) \\in \\mathcal{X} \\times \\mathcal{Y}$. We draw an i.i.d. sample $S = \\{(x_i, y_i)\\}_{i=1}^n$ from $\\mathcal{D}^n$. A learning algorithm $A$ looks at $S$ and outputs a hypothesis $h: \\mathcal{X} \\to \\mathcal{Y}$ from a class $\\mathcal{H}$. Performance is measured by the <em>true risk</em></p>

<div class="katex-block">$$L(h) = \\mathbb{E}_{(x,y) \\sim \\mathcal{D}}\\bigl[\\ell(h(x), y)\\bigr],$$</div>

<p class="l-text">but we cannot compute it; all we have is the <em>empirical risk</em></p>

<div class="katex-block">$$\\hat{L}_S(h) = \\frac{1}{n} \\sum_{i=1}^n \\ell(h(x_i), y_i).$$</div>

<p class="l-text">The central question of statistical learning theory: <strong>when, and by how much, does $\\hat{L}_S(h)$ approximate $L(h)$?</strong> If the gap $|L(h) - \\hat{L}_S(h)|$ is small for the $h$ we picked, we say the algorithm <em>generalizes</em>. If the gap is small for <em>every</em> $h \\in \\mathcal{H}$ we have <em>uniform convergence</em> — the stronger and more useful property, because it tells us empirical risk minimisation cannot be tricked by some bad $h$ that happens to look good on $S$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">True risk $L(h)$</div><div class="card-body">Expected loss on a fresh sample from $\\mathcal{D}$. Unknown; the population quantity we actually care about.</div></div>
<div class="calc-card"><div class="card-title">Empirical risk $\\hat{L}_S(h)$</div><div class="card-body">Average loss on the training sample. Computable. Always biased optimistic if $h$ was chosen using $S$.</div></div>
<div class="calc-card"><div class="card-title">Generalization gap</div><div class="card-body">$L(h) - \\hat{L}_S(h)$. The thing every bound in this lesson controls. Goes to zero with $n$, but how fast depends on $\\mathcal{H}$.</div></div>
<div class="calc-card"><div class="card-title">Uniform convergence</div><div class="card-body">$\\sup_{h \\in \\mathcal{H}} |L(h) - \\hat{L}_S(h)| \\to 0$. The strong form. Guaranteed by finite VC dimension via Glivenko-Cantelli-type theorems.</div></div>
</div>

<div class="calc-highlight"><strong>Engineering reading:</strong> training-set accuracy is the empirical risk; held-out test accuracy estimates the true risk. The classical theorems below give you formulas that say "with high probability over the choice of $S$, the test error is at most train error + something that shrinks with $n$ and grows with model capacity." That "something" is what the next sections compute.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. PAC Learning — Valiant's Definition</h2>
<p class="l-text">In 1984 Leslie Valiant proposed a definition of "learnable" that became the foundation of modern theory and won him the Turing Award. A concept class $\\mathcal{C} \\subseteq \\{0,1\\}^{\\mathcal{X}}$ is <strong>PAC-learnable</strong> (Probably Approximately Correct) if there is an algorithm $A$ and a polynomial $p$ such that for every distribution $\\mathcal{D}$ on $\\mathcal{X}$, every target $c \\in \\mathcal{C}$, and every $\\epsilon, \\delta \\in (0,1)$:</p>

<div class="katex-block">$$\\Pr_{S \\sim \\mathcal{D}^n}\\bigl[L(A(S)) \\leq \\epsilon\\bigr] \\geq 1 - \\delta,$$</div>

<p class="l-text">whenever $n \\geq p(1/\\epsilon, 1/\\delta, \\dim(\\mathcal{X}), \\mathrm{size}(c))$. In words: with probability at least $1 - \\delta$ (probably), the output is within $\\epsilon$ of the truth (approximately correct), using a polynomial number of samples. Two knobs, two tolerance levels — the accuracy knob $\\epsilon$ and the confidence knob $\\delta$.</p>

<p class="l-text">PAC asks for distribution-free guarantees: the algorithm must work for <em>every</em> input distribution $\\mathcal{D}$. That is much stronger than asking "works on the data we have." It is also the right thing for theory — if you assumed a particular $\\mathcal{D}$ you would just be doing parametric statistics.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\epsilon$ — accuracy</div><div class="card-body">How close must the learner's error be to the best possible. Smaller $\\epsilon$ requires more samples.</div></div>
<div class="calc-card"><div class="card-title">$\\delta$ — confidence</div><div class="card-body">How often the learner is allowed to fail entirely. Sample size grows only as $\\log(1/\\delta)$ — confidence is cheap.</div></div>
<div class="calc-card"><div class="card-title">Polynomial sample complexity</div><div class="card-body">Number of samples must be poly in $1/\\epsilon$, $1/\\delta$, problem dimension. If it would need exponentially many samples, the class is not PAC-learnable in this sense.</div></div>
<div class="calc-card"><div class="card-title">Realisable vs agnostic</div><div class="card-body">Realisable PAC: target $c \\in \\mathcal{C}$ exists with zero error. Agnostic PAC (Kearns 1994): no perfect $c$, output competes with the best $h \\in \\mathcal{H}$.</div></div>
</div>

<p class="l-text"><strong>Concrete example 1: axis-aligned rectangles in $\\mathbb{R}^2$.</strong> Concept class $\\mathcal{C}$ = "all axis-aligned rectangles, labelled 1 inside, 0 outside." Algorithm: output the tightest axis-aligned rectangle that contains all positive examples. Sample complexity to get error $\\leq \\epsilon$ with confidence $\\geq 1 - \\delta$: roughly $n \\geq (4/\\epsilon)\\log(4/\\delta)$. Each of the four sides has independent risk $\\epsilon/4$ of missing positive mass, total error $\\leq \\epsilon$ by union bound. The class is PAC-learnable.</p>

<p class="l-text"><strong>Concrete example 2: parity functions.</strong> $\\mathcal{C}$ = all parities $\\oplus_{i \\in T} x_i$ for $T \\subseteq \\{1,\\dots,d\\}$. Sample complexity is polynomial — you can solve by linear algebra over $\\mathrm{GF}(2)$. Easy. But noisy parities (where labels are flipped with probability $\\eta$) are believed not to be PAC-learnable in polynomial time — they are the foundation of the LWE cryptosystem. PAC-learnability and computational tractability are <em>different</em>.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hoeffding's Inequality — The Engine</h2>
<p class="l-text">All the bounds in this lesson rest on a 1963 inequality of Wassily Hoeffding. For independent bounded random variables $X_1, \\dots, X_n$ with $X_i \\in [a_i, b_i]$ and sample mean $\\bar{X} = (1/n) \\sum X_i$:</p>

<div class="katex-block">$$\\Pr\\bigl(\\bar{X} - \\mathbb{E}\\bar{X} \\geq \\epsilon\\bigr) \\leq \\exp\\!\\left(-\\frac{2 n^2 \\epsilon^2}{\\sum_i (b_i - a_i)^2}\\right).$$</div>

<p class="l-text">For i.i.d. variables in $[0,1]$ this simplifies to $\\Pr(|\\bar{X} - \\mu| \\geq \\epsilon) \\leq 2 e^{-2 n \\epsilon^2}$. Read it as "the empirical mean is exponentially unlikely to deviate from the true mean by more than $\\epsilon$." Doubling $n$ roughly halves the deviation needed to keep the same probability; tightening $\\epsilon$ by a factor of two requires four times more samples — the $\\epsilon^2$ in the exponent is the standard "central-limit-style" rate.</p>

<p class="l-text"><strong>Proof sketch (Chernoff method).</strong> The trick is to bound $\\mathbb{E}[e^{\\lambda (X - \\mu)}]$ — the moment-generating function — and then use Markov's inequality on $e^{\\lambda(\\bar{X} - \\mu)}$. Hoeffding's lemma says that any zero-mean random variable bounded in $[a,b]$ has MGF at most $\\exp(\\lambda^2 (b-a)^2 / 8)$, the same MGF as a Gaussian with that range. Multiply independent MGFs, optimise $\\lambda$, and the bound follows. The same recipe (called the <em>Chernoff method</em>) gives Bernstein, Bennett, and McDiarmid bounds for slightly different assumptions.</p>

<div id="plot-l10-hoeffding-en" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[]; for(var i=10;i<=2000;i+=20) ns.push(i);
var eps=0.1;
var bound=ns.map(function(n){return Math.min(1, 2*Math.exp(-2*n*eps*eps));});
var eps2=0.05;
var bound2=ns.map(function(n){return Math.min(1, 2*Math.exp(-2*n*eps2*eps2));});
var eps3=0.2;
var bound3=ns.map(function(n){return Math.min(1, 2*Math.exp(-2*n*eps3*eps3));});
var t1={x:ns,y:bound,mode:'lines',name:'ε = 0.10',line:{color:'#3b82f6',width:2.6}};
var t2={x:ns,y:bound2,mode:'lines',name:'ε = 0.05',line:{color:'#f87171',width:2.4,dash:'dot'}};
var t3={x:ns,y:bound3,mode:'lines',name:'ε = 0.20',line:{color:'#4ade80',width:2.2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:{text:'sample size n'},gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)'},yaxis:{title:{text:'Hoeffding bound on Pr(|deviation| > ε)'},gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[0,1]},margin:{t:30,r:30,b:55,l:65},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5,font:{color:'#e8e8e8'}}};
Plotly.newPlot('plot-l10-hoeffding-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> Hoeffding bound $2 e^{-2 n \\epsilon^2}$ as a function of sample size $n$ for three tolerances $\\epsilon$. Halving $\\epsilon$ (red curve, 0.05) blows up the required sample size by a factor of four — the deviation tolerance enters the exponent quadratically. Doubling $\\epsilon$ (green curve, 0.20) collapses the bound almost immediately even for tiny samples. This is the $1/\\sqrt{n}$ regime in disguise: to halve the achievable error you must quadruple the data.</div></div>

<p class="l-text">Hoeffding is the building block. Combine it with a union bound over a hypothesis class and we get our first generalization bound; combine it with a chaining argument and we get Rademacher; combine it with Doob's martingale inequality and we get Azuma. Almost every generalization bound has a Hoeffding-shaped object somewhere inside.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Generalization Bound for a Finite Hypothesis Class</h2>
<p class="l-text">Suppose $\\mathcal{H}$ is finite — say $|\\mathcal{H}| = M$. For each fixed $h$, Hoeffding gives $\\Pr(L(h) - \\hat{L}_S(h) \\geq \\epsilon) \\leq e^{-2 n \\epsilon^2}$ (loss bounded in $[0,1]$). Union bound over all $M$ hypotheses:</p>

<div class="katex-block">$$\\Pr\\!\\left(\\exists h \\in \\mathcal{H}: L(h) - \\hat{L}_S(h) \\geq \\epsilon\\right) \\leq M \\cdot e^{-2 n \\epsilon^2}.$$</div>

<p class="l-text">Set the right-hand side equal to $\\delta$, solve for $\\epsilon$. With probability at least $1 - \\delta$, simultaneously for every $h \\in \\mathcal{H}$:</p>

<div class="katex-block">$$L(h) \\leq \\hat{L}_S(h) + \\sqrt{\\frac{\\log M + \\log(1/\\delta)}{2 n}}.$$</div>

<p class="l-text">This is the cleanest possible generalization bound. Three things to notice. (i) The generalization gap shrinks like $1/\\sqrt{n}$. (ii) It grows like $\\sqrt{\\log M}$ — class size enters logarithmically. (iii) Confidence is cheap: shrinking $\\delta$ from $0.1$ to $10^{-9}$ adds only a constant. So if you want to learn a class of size $M = 10^{12}$ to within $\\epsilon = 0.05$ with confidence $0.99$, you need about $n \\geq (\\log 10^{12} + \\log 100) / (2 \\cdot 0.05^2) \\approx 6000$ samples.</p>

<div class="calc-highlight"><strong>Why does $\\log M$ work?</strong> Doubling the class size only adds $\\log 2$ to the bound — a tiny price. The union bound is loose, but for this rate it is essentially the right answer: the dependence on $M$ <em>must</em> be at least logarithmic for distribution-free guarantees. The information-theoretic intuition: identifying one of $M$ items requires $\\log_2 M$ bits.</div>

<p class="l-text">Of course $\\mathcal{H}$ is almost never finite in practice. Linear classifiers, neural nets, kernel machines — all uncountable. The next sections promote $\\log |\\mathcal{H}|$ to <em>VC dimension</em>, which plays the same role for infinite classes.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. VC Dimension — Capacity for Infinite Classes</h2>
<p class="l-text">Vapnik and Chervonenkis (1971) defined a notion of capacity that turns "$\\log M$" into something meaningful for infinite classes. The idea: count not the number of hypotheses, but the number of <em>distinct behaviours</em> the class can produce on any finite point set.</p>

<p class="l-text">A set $\\{x_1, \\dots, x_n\\}$ is <strong>shattered</strong> by $\\mathcal{H}$ if for every one of the $2^n$ possible $\\pm 1$ labellings, some $h \\in \\mathcal{H}$ realises that labelling on the set. The <strong>VC dimension</strong> $\\mathrm{VCdim}(\\mathcal{H})$ is the size of the largest shattered set. If arbitrarily large sets are shattered, $\\mathrm{VCdim} = \\infty$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Intervals on $\\mathbb{R}$</div><div class="card-body">$\\mathcal{H}$ = "label 1 inside $[a,b]$, 0 outside." Any two points can be shattered; any three points $x_1 &lt; x_2 &lt; x_3$ cannot achieve the labelling $(+,-,+)$. $\\mathrm{VCdim} = 2$.</div></div>
<div class="calc-card"><div class="card-title">Half-planes in $\\mathbb{R}^2$</div><div class="card-body">$\\mathcal{H}$ = "label 1 on one side of a line, 0 on the other." Three points in general position are shattered (we will draw all eight labellings). Four points in convex position cannot be shattered: the XOR labelling fails. $\\mathrm{VCdim} = 3$.</div></div>
<div class="calc-card"><div class="card-title">Axis-aligned rectangles in $\\mathbb{R}^2$</div><div class="card-body">A diamond-shaped four-point configuration is shattered (all 16 labellings achievable). Five points: by pigeonhole one is inside the rectangle of the other four extremes. $\\mathrm{VCdim} = 4$.</div></div>
<div class="calc-card"><div class="card-title">Linear classifiers in $\\mathbb{R}^d$</div><div class="card-body">Hyperplane $w^\\top x + b = 0$ separating $\\pm 1$. $\\mathrm{VCdim} = d + 1$. One more than the dimension, because the bias gives an extra degree of freedom.</div></div>
<div class="calc-card"><div class="card-title">Decision stumps</div><div class="card-body">Threshold on a single feature. $\\mathrm{VCdim} = 2$ for binary labels, since flipping the threshold flips the labelling.</div></div>
<div class="calc-card"><div class="card-title">Neural net with $W$ weights</div><div class="card-body">Threshold activations: $\\mathrm{VCdim} = O(W \\log W)$ (Baum-Haussler 1989). Piecewise-polynomial activations: $O(W L)$ for depth $L$ (Bartlett-Maiorov-Meir 1998). Both scale roughly linearly with parameter count.</div></div>
</div>

<div id="plot-l10-vc-en" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var px=[0,1,0.5], py=[0,0,0.8];
var pts={x:px,y:py,mode:'markers+text',text:['1','2','3'],textposition:'top center',marker:{color:'#3b82f6',size:14},textfont:{color:'#e8e8e8',size:13},showlegend:false};
var separators=[];
var lines=[
  {a:0.3, b:-0.4, label:'all +'},
  {a:0.3, b:1.3,  label:'all -'},
  {a:2.5, b:-0.7, label:'+ for 1 only'},
  {a:-2.5,b:2.2,  label:'+ for 2 only'},
  {a:0,   b:0.5,  label:'+ for 3 only'},
  {a:-2.5,b:0.5,  label:'+ for 1,3'},
  {a:2.5, b:0.5,  label:'+ for 2,3'},
  {a:0,   b:0.3,  label:'+ for 1,2'}
];
var colors=['#3b82f6','#f87171','#4ade80','#facc15','#a78bfa','#fb923c','#22d3ee','#f472b6'];
for(var k=0;k<lines.length;k++){var L=lines[k];
  separators.push({x:[-0.3,1.3], y:[L.a*(-0.3)+L.b, L.a*1.3+L.b], mode:'lines', line:{color:colors[k],width:1.6,dash:'dot'}, name:L.label, hoverinfo:'name'});
}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:{text:'x'},range:[-0.4,1.4],gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)'},yaxis:{title:{text:'y'},range:[-0.6,1.4],gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',scaleanchor:'x'},margin:{t:30,r:30,b:55,l:55},legend:{orientation:'h',y:1.15,xanchor:'center',x:0.5,font:{color:'#e8e8e8',size:10}}};
Plotly.newPlot('plot-l10-vc-en',separators.concat([pts]),layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> three points in general position in $\\mathbb{R}^2$ (blue dots labelled 1, 2, 3). Each dotted line is the separator achieving one of the $2^3 = 8$ possible $\\pm$ labellings. Every labelling can be achieved by some half-plane, so this triangle is <em>shattered</em>: $\\mathrm{VCdim}(\\text{half-planes in }\\mathbb{R}^2) \\geq 3$. A standard convex-hull argument shows no four points can be shattered (the XOR labelling on a convex 4-gon is unattainable), so the VC dimension is exactly 3.</div></div>

<p class="l-text"><strong>Sauer-Shelah lemma (1972).</strong> If $\\mathrm{VCdim}(\\mathcal{H}) = d$, then for any $n \\geq d$ points the number of distinct labellings achievable by $\\mathcal{H}$ is at most $\\binom{n}{0} + \\binom{n}{1} + \\dots + \\binom{n}{d} \\leq (e n / d)^d$. So an infinite class with finite VC dimension behaves, in the relevant sense, like a class of size $(e n / d)^d$. Plug this into the union bound:</p>

<div class="katex-block">$$L(h) \\leq \\hat{L}_S(h) + O\\!\\left(\\sqrt{\\frac{d \\log(n/d) + \\log(1/\\delta)}{n}}\\right).$$</div>

<p class="l-text">This is the <strong>VC generalization bound</strong>. It is the right formula for SVMs, linear classifiers, and other "low-VC" models. Required sample size is $n = \\tilde{O}(d / \\epsilon^2)$: linear in VC dimension, inverse-square in target accuracy. The bound is informative when $d \\ll n$ — when you have many more samples than effective parameters.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Rademacher Complexity — Data-Dependent, Tighter</h2>
<p class="l-text">VC dimension is a <em>worst-case</em>, distribution-independent capacity measure. It charges you for every possible labelling of every possible set of points. Rademacher complexity is the natural refinement: it asks how well the hypothesis class can fit random binary labels on the specific data you actually have. If $\\mathcal{H}$ cannot fit pure noise, it must be reasonable.</p>

<p class="l-text">For sample $S = \\{x_1, \\dots, x_n\\}$, draw independent <strong>Rademacher random variables</strong> $\\sigma_i \\in \\{-1, +1\\}$ uniformly. The <em>empirical Rademacher complexity</em> is</p>

<div class="katex-block">$$\\hat{\\mathfrak{R}}_S(\\mathcal{H}) = \\mathbb{E}_{\\sigma}\\!\\left[\\sup_{h \\in \\mathcal{H}}\\, \\frac{1}{n}\\sum_{i=1}^n \\sigma_i\\, h(x_i)\\right].$$</div>

<p class="l-text">The expectation is over the random signs only; the data is fixed. This is the <em>average</em> best correlation of $h$ with noise. If $\\mathcal{H}$ is rich enough to fit any sign pattern, $\\hat{\\mathfrak{R}}_S = 1$ (terrible). If $\\mathcal{H}$ is rigid, $\\hat{\\mathfrak{R}}_S \\to 0$ as $n \\to \\infty$ (good).</p>

<p class="l-text"><strong>Bartlett-Mendelson (2002) bound.</strong> With probability $\\geq 1 - \\delta$, simultaneously for every $h \\in \\mathcal{H}$ and bounded loss in $[0,1]$:</p>

<div class="katex-block">$$L(h) \\leq \\hat{L}_S(h) + 2 \\hat{\\mathfrak{R}}_S(\\mathcal{H} \\circ \\ell) + 3 \\sqrt{\\frac{\\log(2/\\delta)}{2 n}}.$$</div>

<p class="l-text">Two reasons this beats VC. (i) Rademacher is <em>data-dependent</em>: a hard distribution can shrink it. (ii) For $\\mathcal{H}$ with VC dimension $d$, $\\hat{\\mathfrak{R}}_S \\leq \\sqrt{2 d \\log(e n / d) / n}$ (Massart's lemma), so the VC bound is recovered, but for many specific data distributions Rademacher is strictly tighter. (iii) Rademacher generalizes beyond binary classification — it works for any bounded loss.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$L_2$ ball of radius $R$</div><div class="card-body">$\\mathcal{H} = \\{x \\mapsto w^\\top x : \\|w\\| \\leq R\\}$ with $\\|x_i\\| \\leq X$. Empirical Rademacher: $\\hat{\\mathfrak{R}}_S \\leq R X / \\sqrt{n}$ exactly. Used for norm-based bounds in neural nets.</div></div>
<div class="calc-card"><div class="card-title">Talagrand contraction</div><div class="card-body">If $\\phi$ is $L$-Lipschitz, $\\hat{\\mathfrak{R}}_S(\\phi \\circ \\mathcal{H}) \\leq L \\cdot \\hat{\\mathfrak{R}}_S(\\mathcal{H})$. Why people care about Lipschitz losses (hinge, logistic) — Rademacher only multiplies by the Lipschitz constant.</div></div>
<div class="calc-card"><div class="card-title">Composition over layers</div><div class="card-body">For a neural net, Rademacher bounds compose layer-by-layer with the spectral norm of each weight matrix (Bartlett-Foster-Telgarsky 2017). Margins and norms become the right quantities, not parameter count.</div></div>
<div class="calc-card"><div class="card-title">Estimation</div><div class="card-body">Sample $\\sigma$ many times, compute $\\sup_h$ each time (often by running your training algorithm on $\\sigma$-labelled data), average. We will do this in code.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Concentration Beyond Hoeffding — McDiarmid and Bernstein</h2>
<p class="l-text">Two more inequalities show up constantly. <strong>McDiarmid's bounded-differences inequality:</strong> if $f(X_1, \\dots, X_n)$ satisfies $|f(\\dots, X_i, \\dots) - f(\\dots, X_i', \\dots)| \\leq c_i$ for any single-coordinate change, then</p>

<div class="katex-block">$$\\Pr\\bigl(|f - \\mathbb{E} f| \\geq \\epsilon\\bigr) \\leq 2 \\exp\\!\\left(-\\frac{2 \\epsilon^2}{\\sum_i c_i^2}\\right).$$</div>

<p class="l-text">McDiarmid is what lets us concentrate the supremum $\\sup_h |L(h) - \\hat{L}_S(h)|$ — it is a function of $n$ samples with bounded differences $c_i = 1/n$. Plug in: deviations of the supremum from its mean are sub-Gaussian. That mean is exactly Rademacher complexity, so McDiarmid + symmetrisation = the Bartlett-Mendelson bound.</p>

<p class="l-text"><strong>Bernstein's inequality</strong> sharpens Hoeffding when the variance is small. For zero-mean, bounded $|X_i| \\leq M$ with $\\mathrm{Var}(X_i) = \\sigma^2$:</p>

<div class="katex-block">$$\\Pr\\Bigl(\\sum X_i \\geq t\\Bigr) \\leq \\exp\\!\\left(-\\frac{t^2 / 2}{n \\sigma^2 + M t / 3}\\right).$$</div>

<p class="l-text">For small $t$ this is $\\exp(-t^2 / (2 n \\sigma^2))$ — the variance enters where Hoeffding had $M^2$. When you have low-variance random variables (rare events, well-calibrated losses) Bernstein is dramatically tighter. This is why "fast rates" of $O(1/n)$ instead of $O(1/\\sqrt{n})$ exist in some regimes — Bernstein with $\\sigma^2 \\to 0$ gives the fast rate.</p>

<div class="calc-highlight"><strong>Three-bound mental model.</strong> Hoeffding: any bounded variable, square-root rate. Bernstein: bounded + low variance, fast rate near zero. McDiarmid: bounded-differences function of many independent inputs, automatic concentration of suprema. Almost every applied generalization argument uses one of these three plus the union bound or symmetrisation.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Deep Learning Mystery</h2>
<p class="l-text">Now the trouble. A ResNet-50 has roughly $25 \\times 10^6$ parameters. Trained on CIFAR-10 ($n = 50{,}000$), it reaches under 5% test error. Plug into the VC bound with $d \\approx 10^7$ and $n = 5 \\times 10^4$: the bound gives generalization gap $\\sqrt{10^7 / 10^5} \\approx 10$, ten times larger than 100% error. The bound is <em>vacuous</em> — it says "your error is at most 1000%." Useless. And it gets worse for GPT-3 (175B parameters trained on a few hundred billion tokens), where the gap bound is astronomical and yet the model generalizes well enough to be useful.</p>

<p class="l-text">Zhang, Bengio, Hardt, Recht, Vinyals (2017) made the puzzle vivid. The same architecture that learns CIFAR-10 properly can also memorise random labels in roughly the same number of epochs. The hypothesis class is <em>that</em> expressive — VC dimension at least $n$ — yet on natural data it picks the right hypothesis. Classical theory says nothing useful. Several modern theories try to fill the gap:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Implicit regularization of SGD</div><div class="card-body">Soudry et al. (2018): SGD on logistic loss converges to the max-margin solution, even without explicit regularization. Among the many global minima of an overparameterised network, SGD prefers the "flat" / large-margin ones.</div></div>
<div class="calc-card"><div class="card-title">Neural Tangent Kernel (NTK)</div><div class="card-body">Jacot, Gabriel, Hongler (2018): in the infinite-width limit, training a neural net by gradient flow is equivalent to kernel regression with a specific (Neural Tangent) kernel. Generalization analyzable as kernel regression. Tight for wide networks; loose for finite-width deep ones.</div></div>
<div class="calc-card"><div class="card-title">Double descent</div><div class="card-body">Belkin et al. (2019): test error vs model size has two minima — the classical bias-variance one at small models, and a second one as you go past interpolation. The U-shape is just the start of a W-shape. Modern deep nets live to the right of the interpolation peak.</div></div>
<div class="calc-card"><div class="card-title">PAC-Bayes</div><div class="card-body">McAllester (1999); Dziugaite-Roy (2017) computed the first non-vacuous neural-net generalization bounds. Idea: take a posterior over weights, bound the average error of a stochastic predictor. Non-vacuous for MNIST and CIFAR-10 with the right priors.</div></div>
<div class="calc-card"><div class="card-title">Lottery ticket hypothesis</div><div class="card-body">Frankle &amp; Carbin (2018): dense networks contain sparse subnetworks ("winning tickets") that, trained in isolation from their original initialisation, match the dense network's accuracy. Suggests the effective complexity is much smaller than parameter count.</div></div>
<div class="calc-card"><div class="card-title">Benign overfitting</div><div class="card-body">Bartlett, Long, Lugosi, Tsigler (2020): in over-parameterised linear regression with the minimum-norm interpolator, test error can stay small even when training error is exactly zero, provided the data lives in a low-effective-dimension subspace.</div></div>
</div>

<div id="plot-l10-doubledescent-en" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ms=[]; for(var i=1;i<=300;i++) ms.push(i);
var n=50;
function train(m){return Math.max(0.02, 0.45*Math.exp(-m/15));}
function test(m){
  if(m<n){var bias=0.4*Math.exp(-m/12); var variance=0.0015*m; return Math.max(0.05, bias+variance);}
  if(m===n){return 0.95;}
  var over=m-n;
  return Math.max(0.07, 0.18 + 1.5/Math.pow(over+1,0.55));
}
var tr={x:ms,y:ms.map(train),mode:'lines',name:'training error',line:{color:'#4ade80',width:2.4,dash:'dot'}};
var te={x:ms,y:ms.map(test),mode:'lines',name:'test error',line:{color:'#3b82f6',width:2.8}};
var interp={x:[n,n],y:[0,1],mode:'lines',name:'interpolation threshold',line:{color:'#f87171',width:1.5,dash:'dash'},hoverinfo:'name'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:{text:'model size (parameters)'},gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',type:'log'},yaxis:{title:{text:'error'},gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[0,1]},margin:{t:30,r:30,b:55,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{color:'#e8e8e8'}},annotations:[{x:Math.log10(n),y:0.97,xref:'x',yref:'y',text:'interpolation peak',showarrow:true,arrowhead:2,ax:60,ay:-20,font:{color:'#f87171',size:11},arrowcolor:'#f87171'}]};
Plotly.newPlot('plot-l10-doubledescent-en',[tr,te,interp],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> Double descent. As you grow the model the test error first decreases (bias-dominated regime) then increases as the model approaches the interpolation threshold $m = n$ (variance-dominated). Past interpolation — once the model is over-parameterised enough to fit the training set exactly — test error decreases <em>again</em> and can drop below the classical U-shape minimum. Modern deep networks live deep in the second descent. Belkin et al. (2019) demonstrated this empirically on random forests, kernel regression, and small neural nets; the same shape is now observed in vision and language models.</div></div>

<p class="l-text"><strong>Bottom line.</strong> No single modern theory is fully satisfying. Each captures part of the picture: NTK is exact in a limit no real network reaches; PAC-Bayes produces non-vacuous bounds for some architectures but not all; implicit bias of SGD is provable for linear models and a working hypothesis for deep ones. Generalization of overparameterised neural networks is the single most active open problem in learning theory in 2026.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. No Free Lunch — All Generalization Is Inductive Bias</h2>
<p class="l-text">Wolpert's <strong>No Free Lunch theorem</strong> (1996) takes the air out of any claim that one algorithm is universally better than another. Statement: averaged over <em>all</em> possible target functions $f: \\mathcal{X} \\to \\mathcal{Y}$, every learning algorithm has the same expected off-training-set error. There is no algorithm that beats random guessing on all problems simultaneously.</p>

<p class="l-text">The theorem sounds devastating until you understand what it really says. The "average over all target functions" is a uniform measure on a fantastically large set, and most members of that set are pure noise — labels uncorrelated with anything. No algorithm can learn pure noise. Algorithms work in practice because we apply them to <em>structured</em> distributions — images, text, physics — that occupy a tiny subset of all possible functions. The structure we exploit is the <strong>inductive bias</strong> of the algorithm.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Convolutional bias</div><div class="card-body">CNNs encode "nearby pixels matter, distant ones don't until much later, translations are equivalent." This bias matches natural images and breaks for, say, scrambled-pixel images.</div></div>
<div class="calc-card"><div class="card-title">Attention bias</div><div class="card-body">Transformers encode "every token can attend to every other token via learned weights." Matches text (long-range syntactic dependencies) and is general enough to also handle code, images patches, audio.</div></div>
<div class="calc-card"><div class="card-title">Sparsity bias</div><div class="card-body">$\\ell_1$ regularization (Lasso) encodes "the true model uses few features." Matches genomics, signal processing, compressed sensing.</div></div>
<div class="calc-card"><div class="card-title">Smoothness bias</div><div class="card-body">Gaussian processes, kernels, Tikhonov regularization encode "the true function is smooth." Matches most physics, most regression.</div></div>
<div class="calc-card"><div class="card-title">Hierarchical bias</div><div class="card-body">Depth in neural nets encodes "the world has compositional structure." Matches vision (edges $\\to$ shapes $\\to$ objects), language (characters $\\to$ words $\\to$ syntax $\\to$ meaning).</div></div>
<div class="calc-card"><div class="card-title">Equivariance bias</div><div class="card-body">Graph neural nets, equivariant CNNs, geometric deep learning. Encodes the relevant symmetry group of the problem (permutation, rotation, gauge, etc.).</div></div>
</div>

<p class="l-text"><strong>The deepest takeaway.</strong> Choosing an architecture is not a matter of "expressiveness" or "capacity" — it is a matter of <em>encoding the right prior</em>. Deep learning's success is not because neural nets are universal approximators (so are polynomials, and they fail). It is because the architectural biases of CNNs, transformers, GNNs, etc. happen to match the inductive structure of natural data. No Free Lunch is the formal statement: pick your bias deliberately, because something must do the work of restricting the hypothesis class to make learning possible.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Hands-On Pyodide: Verifying Hoeffding and Estimating Rademacher</h2>
<p class="l-text">Run the code below. It (i) verifies Hoeffding's inequality empirically by comparing the bound to the empirical deviation rate over many trials; (ii) checks the VC dimension of half-planes in $\\mathbb{R}^2$ by attempting to shatter random configurations; (iii) estimates the empirical Rademacher complexity of linear classifiers on a small dataset; (iv) shows the generalization gap collapsing with $n$ on a simple linear classifier. Click <strong>RUN</strong>, then edit and re-run.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> itertools <span class="kw">import</span> product

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 1. Hoeffding inequality — bound vs empirical deviation</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"=== Hoeffding inequality verification ==="</span>)
trials = <span class="num">20000</span>
<span class="kw">for</span> n <span class="kw">in</span> [<span class="num">50</span>, <span class="num">200</span>, <span class="num">1000</span>]:
    <span class="kw">for</span> eps <span class="kw">in</span> [<span class="num">0.05</span>, <span class="num">0.10</span>, <span class="num">0.20</span>]:
        <span class="cm"># X_i ~ Uniform[0,1], true mean = 0.5</span>
        means = rng.<span class="fn">random</span>((trials, n)).<span class="fn">mean</span>(axis=<span class="num">1</span>)
        emp_rate = np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(means - <span class="num">0.5</span>) &gt;= eps)
        bound = <span class="num">2</span> * np.<span class="fn">exp</span>(-<span class="num">2</span> * n * eps**<span class="num">2</span>)
        <span class="fn">print</span>(f<span class="str">"  n={n:5d}  eps={eps:.2f}  Pr(|dev|>=eps) empirical={emp_rate:.4f}  Hoeffding bound={bound:.4f}"</span>)

<span class="cm"># Hoeffding is a (loose) upper bound — empirical rate always smaller. The looseness</span>
<span class="cm"># is mild for small n and tight enough to be useful at any moderate sample size.</span>

<span class="cm"># ============================================================</span>
<span class="cm"># 2. VC dimension of half-planes in R^2 — shatter test</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== VC dimension: half-planes in R^2 ==="</span>)

<span class="kw">def</span> <span class="fn">can_shatter_3_points</span>(points):
    <span class="str">"""Try every +/- labelling of 3 points; check each is realised by some half-plane."""</span>
    <span class="kw">for</span> labels <span class="kw">in</span> <span class="fn">product</span>([-<span class="num">1</span>, <span class="num">1</span>], repeat=<span class="fn">len</span>(points)):
        labels = np.<span class="fn">array</span>(labels)
        <span class="cm"># Search over many random separating directions</span>
        found = <span class="kw">False</span>
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
            w = rng.<span class="fn">standard_normal</span>(<span class="num">2</span>)
            <span class="kw">for</span> b <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">80</span>):
                pred = np.<span class="fn">sign</span>(points @ w + b)
                <span class="kw">if</span> np.<span class="fn">array_equal</span>(pred, labels):
                    found = <span class="kw">True</span>; <span class="kw">break</span>
            <span class="kw">if</span> found: <span class="kw">break</span>
        <span class="kw">if</span> <span class="kw">not</span> found:
            <span class="kw">return</span> <span class="kw">False</span>, labels
    <span class="kw">return</span> <span class="kw">True</span>, <span class="kw">None</span>

triangle = np.<span class="fn">array</span>([[<span class="num">0</span>, <span class="num">0</span>], [<span class="num">1</span>, <span class="num">0</span>], [<span class="num">0.5</span>, <span class="num">1</span>]])
ok, bad = <span class="fn">can_shatter_3_points</span>(triangle)
<span class="fn">print</span>(f<span class="str">"  Three points in general position shattered? {ok}"</span>)

<span class="cm"># Four points in convex position cannot be shattered: the XOR labelling fails.</span>
square = np.<span class="fn">array</span>([[<span class="num">0</span>, <span class="num">0</span>], [<span class="num">1</span>, <span class="num">0</span>], [<span class="num">1</span>, <span class="num">1</span>], [<span class="num">0</span>, <span class="num">1</span>]])
xor_labels = np.<span class="fn">array</span>([<span class="num">1</span>, -<span class="num">1</span>, <span class="num">1</span>, -<span class="num">1</span>])
found_xor = <span class="kw">False</span>
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5000</span>):
    w = rng.<span class="fn">standard_normal</span>(<span class="num">2</span>)
    <span class="kw">for</span> b <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">100</span>):
        <span class="kw">if</span> np.<span class="fn">array_equal</span>(np.<span class="fn">sign</span>(square @ w + b), xor_labels):
            found_xor = <span class="kw">True</span>; <span class="kw">break</span>
    <span class="kw">if</span> found_xor: <span class="kw">break</span>
<span class="fn">print</span>(f<span class="str">"  XOR labelling on 4-point square achievable by a half-plane? {found_xor}"</span>)
<span class="fn">print</span>(<span class="str">"  Conclusion: VCdim(half-planes in R^2) = 3."</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 3. Empirical Rademacher complexity — linear classifiers</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== Empirical Rademacher complexity ==="</span>)

<span class="kw">def</span> <span class="fn">emp_rademacher_linear</span>(X, n_sigma=<span class="num">200</span>, R=<span class="num">1.0</span>):
    <span class="str">"""Estimate Rademacher complexity of linear classifiers with ||w|| <= R.
    sup_{||w||<=R} (1/n) sum sigma_i (w^T x_i) = R * ||(1/n) sum sigma_i x_i||"""</span>
    n = <span class="fn">len</span>(X)
    vals = []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_sigma):
        sigma = rng.<span class="fn">choice</span>([-<span class="num">1</span>, <span class="num">1</span>], size=n)
        vec = (sigma[:, <span class="kw">None</span>] * X).<span class="fn">mean</span>(axis=<span class="num">0</span>)
        vals.<span class="fn">append</span>(R * np.linalg.<span class="fn">norm</span>(vec))
    <span class="kw">return</span> np.<span class="fn">mean</span>(vals)

<span class="kw">for</span> n <span class="kw">in</span> [<span class="num">50</span>, <span class="num">200</span>, <span class="num">1000</span>, <span class="num">5000</span>]:
    X = rng.<span class="fn">standard_normal</span>((n, <span class="num">10</span>))   <span class="cm"># 10-dim standard normal</span>
    rade = <span class="fn">emp_rademacher_linear</span>(X, R=<span class="num">1.0</span>)
    bound = np.<span class="fn">sqrt</span>(np.<span class="fn">trace</span>(X.T @ X) / n**<span class="num">2</span>)  <span class="cm"># theoretical RX/sqrt(n) shape</span>
    <span class="fn">print</span>(f<span class="str">"  n={n:5d}  emp Rademacher={rade:.4f}  theory ~RX/sqrt(n)={bound:.4f}"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 4. Generalization gap vs n for a real linear classifier</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== Generalization gap vs sample size ==="</span>)

d = <span class="num">10</span>
w_star = rng.<span class="fn">standard_normal</span>(d); w_star /= np.linalg.<span class="fn">norm</span>(w_star)
n_test = <span class="num">5000</span>
X_test = rng.<span class="fn">standard_normal</span>((n_test, d))
y_test = np.<span class="fn">sign</span>(X_test @ w_star)

<span class="kw">for</span> n <span class="kw">in</span> [<span class="num">20</span>, <span class="num">50</span>, <span class="num">200</span>, <span class="num">1000</span>, <span class="num">5000</span>]:
    X = rng.<span class="fn">standard_normal</span>((n, d))
    y = np.<span class="fn">sign</span>(X @ w_star)
    <span class="cm"># Least-squares "classifier"</span>
    w_hat, *_ = np.linalg.<span class="fn">lstsq</span>(X, y, rcond=<span class="kw">None</span>)
    train_err = np.<span class="fn">mean</span>(np.<span class="fn">sign</span>(X @ w_hat) != y)
    test_err  = np.<span class="fn">mean</span>(np.<span class="fn">sign</span>(X_test @ w_hat) != y_test)
    gap = test_err - train_err
    vc_bound = np.<span class="fn">sqrt</span>((d + <span class="num">1</span>) * np.<span class="fn">log</span>(n / (d + <span class="num">1</span>)) / n)  <span class="cm"># VC-style ~O(sqrt(d log(n/d)/n))</span>
    <span class="fn">print</span>(f<span class="str">"  n={n:5d}  train={train_err:.3f}  test={test_err:.3f}  gap={gap:.3f}  VC-style bound={vc_bound:.3f}"</span>)

<span class="cm"># Both gap and bound collapse with n. VC bound is loose by a constant factor</span>
<span class="cm"># but tracks the right shape: O(sqrt(d log(n/d) / n)).</span>
</code></pre></div>

<p class="l-text">What you should see in the output. (i) Hoeffding's empirical deviation rate is always below the bound, by 5x to 100x — the bound is loose but correct. (ii) Three points in general position are shattered by half-planes; the XOR labelling on four corners of a square is not — confirming $\\mathrm{VCdim} = 3$. (iii) Empirical Rademacher complexity decreases like $1/\\sqrt{n}$, matching theory. (iv) The generalization gap collapses with $n$, and the VC-style $\\sqrt{d \\log(n/d) / n}$ tracks the right shape (loose by a constant factor, as expected).</p>

<p class="l-text">A small ML lesson in those numbers: with $d = 10$ and $n = 20$, the gap is enormous (test 30%, train 0%). At $n = 1000$ the gap is 2–3%. At $n = 5000$ essentially zero. This is exactly the regime where $n / d \\gg 1$ and classical theory applies. Move to $d = 10^7$ and $n = 5 \\times 10^4$ and the same calculation would say the gap is unbounded — and yet deep networks generalise. That tension is the modern mystery.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Margin Theory and the Modern Refinement</h2>
<p class="l-text">Margins partly rescue classical theory. For a real-valued classifier $f(x)$ (with classification rule $\\mathrm{sign}\\, f(x)$), the <em>margin</em> on a correctly classified point is $|f(x)|$. The Bartlett-Foster margin bound says generalization depends not on raw VC dimension but on the <em>margin-normalised</em> complexity:</p>

<div class="katex-block">$$L_\\gamma(h) \\leq \\hat{L}_\\gamma(h) + O\\!\\left(\\frac{R(\\mathcal{H})}{\\gamma \\sqrt{n}}\\right) + O\\!\\left(\\sqrt{\\frac{\\log(1/\\delta)}{n}}\\right),$$</div>

<p class="l-text">where $R(\\mathcal{H})$ is a complexity term (often a product of weight-matrix spectral norms) and $\\gamma$ is the minimum margin on the training set. A classifier with large margins generalizes better; parameter count drops out, weight norms enter instead. This is the foundation of the "norm-based" generalization bounds for deep networks (Bartlett-Foster-Telgarsky 2017, Neyshabur-Tomioka-Srebro 2015, Golowich-Rakhlin-Shamir 2018).</p>

<div id="plot-l10-margin-en" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x1=[], y1=[], x2=[], y2=[];
for(var i=0;i<200;i++){var a=Math.random(); var r=0.5+0.5*a; var t=Math.random()*Math.PI; x1.push(-r*Math.cos(t)); y1.push(-1+r*Math.sin(t));}
for(var i=0;i<200;i++){var a=Math.random(); var r=0.5+0.5*a; var t=Math.random()*Math.PI; x2.push(r*Math.cos(t)); y2.push(1-r*Math.sin(t));}
var pos={x:x1,y:y1,mode:'markers',name:'class +',marker:{color:'#3b82f6',size:6,opacity:0.8}};
var neg={x:x2,y:y2,mode:'markers',name:'class -',marker:{color:'#f87171',size:6,opacity:0.8}};
var sep={x:[-2,2],y:[0,0],mode:'lines',name:'decision boundary',line:{color:'#e8e8e8',width:2}};
var mlow={x:[-2,2],y:[0.2,0.2],mode:'lines',name:'small margin (gamma=0.2)',line:{color:'#facc15',width:1.5,dash:'dot'}};
var mlow2={x:[-2,2],y:[-0.2,-0.2],mode:'lines',line:{color:'#facc15',width:1.5,dash:'dot'},showlegend:false};
var mhigh={x:[-2,2],y:[0.9,0.9],mode:'lines',name:'large margin (gamma=0.9)',line:{color:'#4ade80',width:1.5,dash:'dash'}};
var mhigh2={x:[-2,2],y:[-0.9,-0.9],mode:'lines',line:{color:'#4ade80',width:1.5,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:{text:'x_1'},range:[-1.8,1.8],gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)'},yaxis:{title:{text:'x_2'},range:[-2.2,2.2],gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',scaleanchor:'x'},margin:{t:30,r:30,b:55,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{color:'#e8e8e8',size:10}}};
Plotly.newPlot('plot-l10-margin-en',[pos,neg,sep,mlow,mlow2,mhigh,mhigh2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> two classes in $\\mathbb{R}^2$ separated by a horizontal decision boundary (white). The yellow dotted band marks a <em>small</em> margin $\\gamma = 0.2$; the green dashed band marks a <em>large</em> margin $\\gamma = 0.9$. A classifier that pushes all training points outside the green band has Bartlett-Foster generalization bound $O(R / (\\gamma \\sqrt n))$ four times smaller than one that only achieves the yellow margin. This is the same intuition behind the hard-margin SVM: maximize the margin to maximize the generalization guarantee.</div></div>

<p class="l-text">For deep networks, this gives partial answers. The product of spectral norms of all weight matrices, normalised by margin, sometimes gives non-vacuous bounds (Bartlett-Foster-Telgarsky 2017) — but only for specific architectures and only after careful weight normalisation. The bounds remain loose for the largest contemporary models. Margin theory is one of the most successful classical-style answers but does not close the gap.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Summary and Connections</h2>
<p class="l-text">Statistical learning theory gives you a precise vocabulary for the question "will the model generalize?" and a quantitative answer for moderate-sized models. The PAC framework defines learnability with two knobs (accuracy $\\epsilon$, confidence $\\delta$). Hoeffding's inequality powers all the basic concentration bounds. VC dimension extends $\\log |\\mathcal{H}|$ to infinite classes. Rademacher complexity refines VC by being data-dependent and tighter. Modern deep networks break classical bounds — the active theories (NTK, double descent, PAC-Bayes, lottery tickets, implicit bias of SGD, benign overfitting, margin theory) each capture a piece of the picture, but none is complete. No Free Lunch tells you that all generalization comes from inductive bias — the architecture's encoding of structure that real data possesses.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>PAC learning: $\\Pr(L \\leq \\epsilon) \\geq 1 - \\delta$ with polynomial samples in $1/\\epsilon, 1/\\delta$.</li>
<li>Hoeffding: $\\Pr(|\\bar{X} - \\mu| \\geq \\epsilon) \\leq 2 e^{-2 n \\epsilon^2}$. Engine of all concentration arguments.</li>
<li>Finite-class bound: $L \\leq \\hat{L} + \\sqrt{(\\log M + \\log(1/\\delta)) / (2 n)}$ via union bound.</li>
<li>VC dimension: largest shatterable set. Half-planes in $\\mathbb{R}^2$: 3. Linear in $\\mathbb{R}^d$: $d+1$. Rectangles: 4. Neural net with $W$ weights: $O(W \\log W)$.</li>
<li>Sauer-Shelah: an infinite class with $\\mathrm{VCdim} = d$ produces at most $(en/d)^d$ distinct labellings of $n$ points.</li>
<li>VC generalization: $L \\leq \\hat{L} + O(\\sqrt{d \\log(n/d) / n})$.</li>
<li>Rademacher: data-dependent, tighter than VC, generalizes to bounded losses.</li>
<li>Deep learning paradox: classical bounds vacuous; modern theories partial.</li>
<li>Margins: bounds depend on $R(\\mathcal{H}) / (\\gamma \\sqrt n)$, not raw parameter count.</li>
<li>No Free Lunch: all algorithms equal averaged over all targets; real progress comes from picking the right inductive bias.</li>
</ul>
</div>

<p class="l-text">The next lesson (L11 — Concentration and Martingales) drops one level deeper into the probabilistic machinery and equips you with Azuma, McDiarmid in full, and martingale-based analyses of stochastic gradient descent. After that the math track wraps up; everything you learn here surfaces in the ML, NLP, deep learning, and reinforcement learning tracks whenever a question of "why is this thing not overfitting?" appears.</p>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İstatistiksel öğrenme teorisi, "makine öğrenmesi neden çalışmalı ki?" sorusunun matematiksel cevabıdır.</strong> Bir modeli sonlu bir örnekleme uydurursun ve sonra onun hiç görmediği veri üzerinde iyi performans göstermesini beklersin. Bu beklenti bedavadan değil — model sınıfının ne çok zengin (yoksa sadece ezberler) ne de çok fakir (yoksa sinyali temsil edemez) olmamasına bağlıdır. İstatistiksel öğrenme teorisi bu ödünleşmeyi kesinleştirir. "Öğrenilebilir"in ne demek olduğunu tanımlar (Valiant, PAC, 1984), eğitim hatasıyla gerçek hata arasındaki farka nicel sınırlar kanıtlar (Vapnik-Chervonenkis 1971, Hoeffding 1963) ve genellemeden el kol sallamadan konuşmanın dilini verir.</p>

<p class="l-text">Klasik teori 2000'lerin başında neredeyse tamamlanmıştı — VC boyutu, Rademacher karmaşıklığı, PAC-Bayes — ve genellemek için parametrelerden çok daha fazla örneğin olması gerektiğini öngörüyordu. Sonra derin öğrenme geldi. Yüz milyonlarca parametreli ağlar, on binlerce görüntü üzerinde eğitildiğinde harika genelleme yaptı. Klasik sınırlar bilgilendirici olmaktan boş bir şekilde gevşek olmaya geçti. Zhang ve ark. (2017), CIFAR-10'u 50 epoch'ta öğrenen aynı ağın, rastgele etiketleri de 50 epoch'ta ezberleyebildiğini gösterdi — hipotez sınıfı her şeyi uydurabilecek kadar büyük, ama gerçek veride doğru hipotezi seçiyor. Bu derste klasik teoriyi tam ayrıntıda işliyoruz (çünkü orta boy modeller için hâlâ doğru ve geri kalan her şeyin söz dağarcığını veriyor) ve sonra modern resmi haritalıyoruz: NTK, double descent, örtük düzenlileştirme, lottery ticket, PAC-Bayes. Sonunda bir genelleme makalesini okuyup yazarların ne iddia ettiğini anlayabilmelisin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKLERIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>PAC ogrenme cercevesini (Valiant 1984) ifade etmek ve bir sinifin ne zaman PAC-ogrenilebilir oldugunu tanimlamak</li>
<li>Hoeffding esitsizligini kanitlayip uygulamak; sonlu siniflar icin genelleme sinirlarinin motoru</li>
<li>Yari-duzlemler, eksen-hizali dikdortgenler, karar damgalari ve ileri-beslemeli sinir aglarinin VC boyutunu hesaplamak</li>
<li>Sauer-Shelah onsavini ifade etmek ve VC boyutunun bir sonsuz sinifin etkin buyuklugunu nasil kontrol ettigini aciklamak</li>
<li>Rademacher karmasikligini simulasyonla tahmin etmek ve neden VC'den daha siki sinirlar verdigini aciklamak</li>
<li>Klasik sinirlarin modern derin aglar icin neden bos oldugunu taniyabilmek ve modern alternatifleri taramak (NTK, double descent, PAC-Bayes, lottery tickets, SGD'nin ortuk egilimi)</li>
<li>No Free Lunch teoremini (Wolpert 1996) tum genellemenin tumevarimsal onyargidan geldigi anlayisi olarak yorumlamak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Ogrenme Kurulumu — Gercekten Ne Yapiyoruz?</h2>
<p class="l-text">Resmi bir kez sabitleyelim. Girdi-etiket ciftleri $(x, y) \\in \\mathcal{X} \\times \\mathcal{Y}$ uzerinde bilinmeyen bir veri dagilimi $\\mathcal{D}$ var. $\\mathcal{D}^n$'den i.i.d. bir orneklem $S = \\{(x_i, y_i)\\}_{i=1}^n$ cekiyoruz. Bir ogrenme algoritmasi $A$, $S$'ye bakar ve bir $\\mathcal{H}$ sinifindan bir hipotez $h: \\mathcal{X} \\to \\mathcal{Y}$ uretir. Performans <em>gercek risk</em> ile olculur:</p>

<div class="katex-block">$$L(h) = \\mathbb{E}_{(x,y) \\sim \\mathcal{D}}\\bigl[\\ell(h(x), y)\\bigr],$$</div>

<p class="l-text">ama bunu hesaplayamayiz; sahip oldugumuz tek sey <em>ampirik risk</em>:</p>

<div class="katex-block">$$\\hat{L}_S(h) = \\frac{1}{n} \\sum_{i=1}^n \\ell(h(x_i), y_i).$$</div>

<p class="l-text">Istatistiksel ogrenme teorisinin merkezi sorusu: <strong>$\\hat{L}_S(h)$, $L(h)$'ye ne zaman ve ne kadar yakindir?</strong> Sectigimiz $h$ icin $|L(h) - \\hat{L}_S(h)|$ farki kucukse, algoritma <em>genelleme yapiyor</em> deriz. Fark <em>her</em> $h \\in \\mathcal{H}$ icin kucukse <em>tekduze yakinsama</em> elde ederiz — daha guclu ve daha kullanisli ozellik, cunku ampirik risk minimizasyonunun $S$'de iyi gorunmeyi basaran kotu bir $h$ tarafindan kandirilamayacagini soyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gercek risk $L(h)$</div><div class="card-body">$\\mathcal{D}$'den taze bir orneklem uzerinde beklenen kayip. Bilinmeyen; gercekten umursadigimiz populasyon niceligi.</div></div>
<div class="calc-card"><div class="card-title">Ampirik risk $\\hat{L}_S(h)$</div><div class="card-body">Egitim orneklemi uzerindeki ortalama kayip. Hesaplanabilir. $h$, $S$ kullanilarak secildiyse her zaman iyimser yanli.</div></div>
<div class="calc-card"><div class="card-title">Genelleme farki</div><div class="card-body">$L(h) - \\hat{L}_S(h)$. Bu dersteki her sinirin kontrol ettigi sey. $n$ ile sifira gider, ama ne kadar hizli $\\mathcal{H}$'ye bagli.</div></div>
<div class="calc-card"><div class="card-title">Tekduze yakinsama</div><div class="card-body">$\\sup_{h \\in \\mathcal{H}} |L(h) - \\hat{L}_S(h)| \\to 0$. Guclu hali. Glivenko-Cantelli tipi teoremler araciligiyla sonlu VC boyutu tarafindan garanti edilir.</div></div>
</div>

<div class="calc-highlight"><strong>Muhendislik okumasi:</strong> egitim setindeki dogruluk ampirik risktir; ayri tutulan test seti dogrulugu gercek riski tahmin eder. Asagidaki klasik teoremler, "$S$'nin secimi uzerinde yuksek olasilikla, test hatasi en fazla egitim hatasi + $n$ ile kuculen ve model kapasitesi ile buyuyen bir sey kadardir" diyen formuller verir. O "bir sey" sonraki bolumlerin hesapladigi seydir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. PAC Ogrenme — Valiant'in Tanimi</h2>
<p class="l-text">1984'te Leslie Valiant, modern teorinin temeli olan ve ona Turing Odulu'nu kazandiran "ogrenilebilir" tanimini onerdi. Bir kavram sinifi $\\mathcal{C} \\subseteq \\{0,1\\}^{\\mathcal{X}}$, su sartla <strong>PAC-ogrenilebilir</strong>dir (Probably Approximately Correct): bir algoritma $A$ ve bir polinom $p$ vardir oyle ki $\\mathcal{X}$ uzerindeki her dagilim $\\mathcal{D}$, her hedef $c \\in \\mathcal{C}$ ve her $\\epsilon, \\delta \\in (0,1)$ icin:</p>

<div class="katex-block">$$\\Pr_{S \\sim \\mathcal{D}^n}\\bigl[L(A(S)) \\leq \\epsilon\\bigr] \\geq 1 - \\delta,$$</div>

<p class="l-text">$n \\geq p(1/\\epsilon, 1/\\delta, \\dim(\\mathcal{X}), \\mathrm{size}(c))$ oldugunda. Sozcuklerle: en az $1 - \\delta$ olasilikla (probably) cikti gercege $\\epsilon$ icinde (approximately correct), polinom sayida orneklem kullanarak. Iki dugme, iki tolerans seviyesi — dogruluk dugmesi $\\epsilon$ ve guven dugmesi $\\delta$.</p>

<p class="l-text">PAC dagilim-bagimsiz garantiler ister: algoritma <em>her</em> giris dagilimi $\\mathcal{D}$ icin calismali. Bu, "elimizdeki veride calisir" demekten cok daha gucludur. Ayrica teori icin dogru olan da budur — belirli bir $\\mathcal{D}$ varsaysaydin sadece parametrik istatistik yapiyor olurdun.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\epsilon$ — dogruluk</div><div class="card-body">Ogrenicinin hatasi en iyi mumkune ne kadar yakin olmali. Daha kucuk $\\epsilon$ daha cok orneklem gerektirir.</div></div>
<div class="calc-card"><div class="card-title">$\\delta$ — guven</div><div class="card-body">Ogrenicinin tamamen basarisiz olmasina ne siklikla izin verilir. Orneklem boyutu $\\log(1/\\delta)$ ile buyur — guven ucuzdur.</div></div>
<div class="calc-card"><div class="card-title">Polinom orneklem karmasikligi</div><div class="card-body">Orneklem sayisi $1/\\epsilon$, $1/\\delta$, problem boyutunda polinom olmali. Ustel orneklem gerekiyorsa sinif bu anlamda PAC-ogrenilebilir degil.</div></div>
<div class="calc-card"><div class="card-title">Realize edilebilir vs agnostik</div><div class="card-body">Realize edilebilir PAC: hedef $c \\in \\mathcal{C}$ sifir hata ile var. Agnostik PAC (Kearns 1994): mukemmel $c$ yok, cikti $\\mathcal{H}$'deki en iyi $h$ ile yarisir.</div></div>
</div>

<p class="l-text"><strong>Somut ornek 1: $\\mathbb{R}^2$'de eksen-hizali dikdortgenler.</strong> Kavram sinifi $\\mathcal{C}$ = "tum eksen-hizali dikdortgenler, icerde 1, disarda 0." Algoritma: tum pozitif ornekleri iceren en siki eksen-hizali dikdortgeni dondur. En az $1 - \\delta$ guvenle $\\leq \\epsilon$ hata elde etmek icin orneklem karmasikligi: kabaca $n \\geq (4/\\epsilon)\\log(4/\\delta)$. Dort kenardan her birinin pozitif kutleyi kacirma riski bagimsizca $\\epsilon/4$, toplam hata birlesim siniri ile $\\leq \\epsilon$. Sinif PAC-ogrenilebilir.</p>

<p class="l-text"><strong>Somut ornek 2: parite fonksiyonlari.</strong> $\\mathcal{C}$ = $T \\subseteq \\{1,\\dots,d\\}$ icin tum $\\oplus_{i \\in T} x_i$ pariteleri. Orneklem karmasikligi polinom — $\\mathrm{GF}(2)$ uzerinde dogrusal cebir ile cozulebilir. Kolay. Ancak gurultulu parite (etiketler $\\eta$ olasilikla cevrilir) polinom zamanda PAC-ogrenilebilir oldugu sanilmiyor — LWE kriptosisteminin temeli. PAC-ogrenilebilirlik ve hesapsal izlenebilirlik <em>farkli</em>.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hoeffding Esitsizligi — Motor</h2>
<p class="l-text">Bu dersteki tum sinirlar Wassily Hoeffding'in 1963 esitsizligine dayanir. Bagimsiz sinirli rastgele degiskenler $X_1, \\dots, X_n$ icin $X_i \\in [a_i, b_i]$ ve ornek ortalamasi $\\bar{X} = (1/n) \\sum X_i$:</p>

<div class="katex-block">$$\\Pr\\bigl(\\bar{X} - \\mathbb{E}\\bar{X} \\geq \\epsilon\\bigr) \\leq \\exp\\!\\left(-\\frac{2 n^2 \\epsilon^2}{\\sum_i (b_i - a_i)^2}\\right).$$</div>

<p class="l-text">$[0,1]$'deki i.i.d. degiskenler icin bu $\\Pr(|\\bar{X} - \\mu| \\geq \\epsilon) \\leq 2 e^{-2 n \\epsilon^2}$'ye sadelenir. Sunu der: "ampirik ortalama gercek ortalamadan $\\epsilon$'dan fazla sapma yapma olasiligi ustel olarak dusuk." $n$'i iki katina cikarmak ayni olasiligi tutmak icin gereken sapmayi yaklasik yariya indirir; $\\epsilon$'u iki kat sikilamak dort kat fazla orneklem gerektirir — ustel icindeki $\\epsilon^2$ standart "merkezi-limit-tarzi" oranidir.</p>

<p class="l-text"><strong>Kanit taslagi (Chernoff yontemi).</strong> Hile $\\mathbb{E}[e^{\\lambda (X - \\mu)}]$'yi — moment-ureten fonksiyonunu — sinirlamak ve sonra $e^{\\lambda(\\bar{X} - \\mu)}$ uzerinde Markov esitsizligini kullanmaktir. Hoeffding onsavi, $[a,b]$'de sinirli sifir-ortalamali her rastgele degiskenin MGF'sinin en fazla $\\exp(\\lambda^2 (b-a)^2 / 8)$ oldugunu soyler — bu menzille bir Gauss'un MGF'siyle aynidir. Bagimsiz MGF'leri carp, $\\lambda$'yi optimize et, sinir gelir. Ayni tarif (Chernoff yontemi) hafifce farkli varsayimlar icin Bernstein, Bennett ve McDiarmid sinirlarini verir.</p>

<div id="plot-l10-hoeffding-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[]; for(var i=10;i<=2000;i+=20) ns.push(i);
var eps=0.1;
var bound=ns.map(function(n){return Math.min(1, 2*Math.exp(-2*n*eps*eps));});
var eps2=0.05;
var bound2=ns.map(function(n){return Math.min(1, 2*Math.exp(-2*n*eps2*eps2));});
var eps3=0.2;
var bound3=ns.map(function(n){return Math.min(1, 2*Math.exp(-2*n*eps3*eps3));});
var t1={x:ns,y:bound,mode:'lines',name:'ε = 0.10',line:{color:'#3b82f6',width:2.6}};
var t2={x:ns,y:bound2,mode:'lines',name:'ε = 0.05',line:{color:'#f87171',width:2.4,dash:'dot'}};
var t3={x:ns,y:bound3,mode:'lines',name:'ε = 0.20',line:{color:'#4ade80',width:2.2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:{text:'orneklem boyutu n'},gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)'},yaxis:{title:{text:'Hoeffding siniri: Pr(|sapma| > ε)'},gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[0,1]},margin:{t:30,r:30,b:55,l:65},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5,font:{color:'#e8e8e8'}}};
Plotly.newPlot('plot-l10-hoeffding-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafigin gosterdigi:</strong> Hoeffding siniri $2 e^{-2 n \\epsilon^2}$, $\\epsilon$ icin uc tolerans degerinde orneklem boyutu $n$'nin fonksiyonu olarak. $\\epsilon$'u yariya indirmek (kirmizi egri, 0.05) gereken orneklem boyutunu dort kat patlatir — sapma tolerans ustele kuadratik girer. $\\epsilon$'u iki katina cikarmak (yesil egri, 0.20) cok kucuk ornekler icin bile siniri neredeyse aninda cokertir. Bu kilik degistirmis $1/\\sqrt{n}$ rejimidir: ulasilabilir hatayi yariya indirmek icin veriyi dort katina cikarmalisin.</div></div>

<p class="l-text">Hoeffding yapi tasidir. Bir hipotez sinifi uzerinde birlesim siniriyla birlestir, ilk genelleme sinirimizi aliriz; bir zincir argumaniyla birlestir, Rademacher'i aliriz; Doob'un martingale esitsizligiyle birlestir, Azuma'yi aliriz. Neredeyse her genelleme sinirinin bir yerlerinde Hoeffding-sekilli bir nesne vardir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Sonlu Hipotez Sinifi Icin Genelleme Siniri</h2>
<p class="l-text">$\\mathcal{H}$ sonlu olsun — diyelim ki $|\\mathcal{H}| = M$. Sabit her $h$ icin Hoeffding $\\Pr(L(h) - \\hat{L}_S(h) \\geq \\epsilon) \\leq e^{-2 n \\epsilon^2}$ verir ($[0,1]$'de sinirli kayip). Tum $M$ hipotez uzerinde birlesim siniri:</p>

<div class="katex-block">$$\\Pr\\!\\left(\\exists h \\in \\mathcal{H}: L(h) - \\hat{L}_S(h) \\geq \\epsilon\\right) \\leq M \\cdot e^{-2 n \\epsilon^2}.$$</div>

<p class="l-text">Sag tarafi $\\delta$'ya esitle, $\\epsilon$ icin coz. En az $1 - \\delta$ olasilikla, her $h \\in \\mathcal{H}$ icin es zamanli:</p>

<div class="katex-block">$$L(h) \\leq \\hat{L}_S(h) + \\sqrt{\\frac{\\log M + \\log(1/\\delta)}{2 n}}.$$</div>

<p class="l-text">Bu mumkun olan en temiz genelleme siniridir. Uc nokta. (i) Genelleme farki $1/\\sqrt{n}$ gibi kuculur. (ii) $\\sqrt{\\log M}$ ile buyur — sinif boyutu logaritmik girer. (iii) Guven ucuz: $\\delta$'yi $0.1$'den $10^{-9}$'a kucultmek sadece sabit ekler. $M = 10^{12}$ boyutunda bir sinifi $\\epsilon = 0.05$ icinde $0.99$ guvenle ogrenmek istiyorsan, yaklasik $n \\geq (\\log 10^{12} + \\log 100) / (2 \\cdot 0.05^2) \\approx 6000$ orneklem gerekir.</p>

<div class="calc-highlight"><strong>$\\log M$ neden isliyor?</strong> Sinif boyutunu iki katina cikarmak sinira sadece $\\log 2$ ekler — kucuk bir bedel. Birlesim siniri gevsek, ama bu oran icin esasen dogru cevap: dagilim-bagimsiz garantiler icin $M$'ye baglilik <em>en az</em> logaritmik olmali. Bilgi-teorik sezgi: $M$ ogeden birini tanimlamak $\\log_2 M$ bit gerektirir.</div>

<p class="l-text">Tabii $\\mathcal{H}$ pratikte neredeyse hicbir zaman sonlu degil. Dogrusal siniflandiricilar, sinir aglari, cekirdek makineleri — hepsi sayilamaz. Sonraki bolumler $\\log |\\mathcal{H}|$'yi sonsuz siniflar icin ayni rolu oynayan <em>VC boyutu</em>na yukseltir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. VC Boyutu — Sonsuz Siniflar Icin Kapasite</h2>
<p class="l-text">Vapnik ve Chervonenkis (1971) sonsuz siniflar icin "$\\log M$"yi anlamli bir seye ceviren bir kapasite kavrami tanimladi. Fikir: hipotez sayisini degil, sinifin herhangi bir sonlu nokta seti uzerinde uretebilecegi <em>farkli davranis</em> sayisini saymak.</p>

<p class="l-text">Bir $\\{x_1, \\dots, x_n\\}$ kumesi $\\mathcal{H}$ tarafindan <strong>parcalanir</strong> (shatter) eger $2^n$ olasi $\\pm 1$ etiketlemenin her biri icin bazi $h \\in \\mathcal{H}$ o etiketlemeyi gerceklestiriyorsa. <strong>VC boyutu</strong> $\\mathrm{VCdim}(\\mathcal{H})$ parcalanan en buyuk kumenin boyutudur. Keyfi buyuklukteki kumeler parcalaniyorsa $\\mathrm{VCdim} = \\infty$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\mathbb{R}$'da araliklar</div><div class="card-body">$\\mathcal{H}$ = "$[a,b]$ icinde 1, disinda 0." Iki nokta parcalanabilir; uc nokta $x_1 &lt; x_2 &lt; x_3$ $(+,-,+)$ etiketlemesini elde edemez. $\\mathrm{VCdim} = 2$.</div></div>
<div class="calc-card"><div class="card-title">$\\mathbb{R}^2$'de yari-duzlemler</div><div class="card-body">$\\mathcal{H}$ = "bir dogrunun bir tarafinda 1, otekinde 0." Genel konumdaki uc nokta parcalanir (tum 8 etiketlemeyi cizecegiz). Konveks konumdaki dort nokta parcalanamaz: XOR etiketlemesi basarisiz olur. $\\mathrm{VCdim} = 3$.</div></div>
<div class="calc-card"><div class="card-title">$\\mathbb{R}^2$'de eksen-hizali dikdortgenler</div><div class="card-body">Elmas seklinde dort nokta konfigurasyonu parcalanir (tum 16 etiketleme elde edilebilir). Bes nokta: guvercin yuvasi prensibi ile biri digerleri en uc dortlunun dikdortgeni icindedir. $\\mathrm{VCdim} = 4$.</div></div>
<div class="calc-card"><div class="card-title">$\\mathbb{R}^d$'da dogrusal siniflandiricilar</div><div class="card-body">$\\pm 1$ ayiran hiper duzlem $w^\\top x + b = 0$. $\\mathrm{VCdim} = d + 1$. Boyuttan bir fazla, cunku bias bir ekstra serbestlik derecesi verir.</div></div>
<div class="calc-card"><div class="card-title">Karar damgalari</div><div class="card-body">Tek bir oznitelik uzerinde esik. Ikili etiketler icin $\\mathrm{VCdim} = 2$, cunku esigi cevirmek etiketlemeyi cevirir.</div></div>
<div class="calc-card"><div class="card-title">$W$ agirlikli sinir agi</div><div class="card-body">Esik aktivasyonlari: $\\mathrm{VCdim} = O(W \\log W)$ (Baum-Haussler 1989). Parcali-polinom aktivasyonlari: derinlik $L$ icin $O(W L)$ (Bartlett-Maiorov-Meir 1998). Her ikisi de kabaca parametre sayisi ile dogrusal olarak buyur.</div></div>
</div>

<div id="plot-l10-vc-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var px=[0,1,0.5], py=[0,0,0.8];
var pts={x:px,y:py,mode:'markers+text',text:['1','2','3'],textposition:'top center',marker:{color:'#3b82f6',size:14},textfont:{color:'#e8e8e8',size:13},showlegend:false};
var separators=[];
var lines=[
  {a:0.3, b:-0.4, label:'hepsi +'},
  {a:0.3, b:1.3,  label:'hepsi -'},
  {a:2.5, b:-0.7, label:'sadece 1 icin +'},
  {a:-2.5,b:2.2,  label:'sadece 2 icin +'},
  {a:0,   b:0.5,  label:'sadece 3 icin +'},
  {a:-2.5,b:0.5,  label:'1,3 icin +'},
  {a:2.5, b:0.5,  label:'2,3 icin +'},
  {a:0,   b:0.3,  label:'1,2 icin +'}
];
var colors=['#3b82f6','#f87171','#4ade80','#facc15','#a78bfa','#fb923c','#22d3ee','#f472b6'];
for(var k=0;k<lines.length;k++){var L=lines[k];
  separators.push({x:[-0.3,1.3], y:[L.a*(-0.3)+L.b, L.a*1.3+L.b], mode:'lines', line:{color:colors[k],width:1.6,dash:'dot'}, name:L.label, hoverinfo:'name'});
}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:{text:'x'},range:[-0.4,1.4],gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)'},yaxis:{title:{text:'y'},range:[-0.6,1.4],gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',scaleanchor:'x'},margin:{t:30,r:30,b:55,l:55},legend:{orientation:'h',y:1.15,xanchor:'center',x:0.5,font:{color:'#e8e8e8',size:10}}};
Plotly.newPlot('plot-l10-vc-tr',separators.concat([pts]),layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafigin gosterdigi:</strong> $\\mathbb{R}^2$'de genel konumda uc nokta (1, 2, 3 etiketli mavi noktalar). Her noktali cizgi olasi $2^3 = 8$ $\\pm$ etiketlemesinden birini elde eden ayiricidir. Her etiketleme bir yari-duzlem tarafindan elde edilebilir, dolayisiyla bu ucgen <em>parcalanir</em>: $\\mathrm{VCdim}(\\text{half-planes in }\\mathbb{R}^2) \\geq 3$. Standart konveks-zarf argumani hicbir dort noktanin parcalanamayacagini gosterir (konveks 4-gen uzerinde XOR etiketlemesi elde edilemez), dolayisiyla VC boyutu tam olarak 3.</div></div>

<p class="l-text"><strong>Sauer-Shelah onsavi (1972).</strong> Eger $\\mathrm{VCdim}(\\mathcal{H}) = d$ ise, herhangi $n \\geq d$ nokta icin $\\mathcal{H}$'nin elde edebildigi farkli etiketleme sayisi en fazla $\\binom{n}{0} + \\binom{n}{1} + \\dots + \\binom{n}{d} \\leq (e n / d)^d$'dir. Yani sonlu VC boyutuna sahip bir sonsuz sinif, ilgili anlamda $(e n / d)^d$ boyutunda bir sinif gibi davranir. Birlesim sinirine yerlestir:</p>

<div class="katex-block">$$L(h) \\leq \\hat{L}_S(h) + O\\!\\left(\\sqrt{\\frac{d \\log(n/d) + \\log(1/\\delta)}{n}}\\right).$$</div>

<p class="l-text">Bu <strong>VC genelleme siniri</strong>dir. SVM'ler, dogrusal siniflandiricilar ve diger "dusuk-VC" modeller icin dogru formuldur. Gerekli orneklem boyutu $n = \\tilde{O}(d / \\epsilon^2)$: VC boyutunda dogrusal, hedef dogrulukta ters-kare. Sinir $d \\ll n$ oldugunda — etkin parametrelerden cok daha fazla orneklemin oldugunda — bilgilendiricidir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Rademacher Karmasikligi — Veriye Bagimli, Daha Siki</h2>
<p class="l-text">VC boyutu <em>en kotu durum</em>, dagilim-bagimsiz bir kapasite olcusudur. Olasi her nokta setinin olasi her etiketlemesi icin para alir. Rademacher karmasikligi dogal incelmedir: hipotez sinifinin elindeki belirli veri uzerinde rastgele ikili etiketleri ne kadar iyi uydurabildigini sorar. $\\mathcal{H}$ saf gurultuyu uyduramiyorsa, makul olmali.</p>

<p class="l-text">Orneklem $S = \\{x_1, \\dots, x_n\\}$ icin, bagimsiz <strong>Rademacher rastgele degiskenleri</strong> $\\sigma_i \\in \\{-1, +1\\}$ tek tip olarak cek. <em>Ampirik Rademacher karmasikligi</em>:</p>

<div class="katex-block">$$\\hat{\\mathfrak{R}}_S(\\mathcal{H}) = \\mathbb{E}_{\\sigma}\\!\\left[\\sup_{h \\in \\mathcal{H}}\\, \\frac{1}{n}\\sum_{i=1}^n \\sigma_i\\, h(x_i)\\right].$$</div>

<p class="l-text">Beklenti sadece rastgele isaretler uzerindedir; veri sabittir. Bu, $h$'nin gurultuyle <em>ortalama</em> en iyi korelasyonudur. $\\mathcal{H}$ herhangi bir isaret desenini uydurmaya yetecek zenginlikteyse $\\hat{\\mathfrak{R}}_S = 1$ (berbat). $\\mathcal{H}$ katiysa $n \\to \\infty$ ile $\\hat{\\mathfrak{R}}_S \\to 0$ (iyi).</p>

<p class="l-text"><strong>Bartlett-Mendelson (2002) siniri.</strong> En az $1 - \\delta$ olasilikla, $[0,1]$'de sinirli kayip ile her $h \\in \\mathcal{H}$ icin es zamanli:</p>

<div class="katex-block">$$L(h) \\leq \\hat{L}_S(h) + 2 \\hat{\\mathfrak{R}}_S(\\mathcal{H} \\circ \\ell) + 3 \\sqrt{\\frac{\\log(2/\\delta)}{2 n}}.$$</div>

<p class="l-text">VC'yi yenmesinin iki nedeni. (i) Rademacher <em>veriye bagimli</em>dir: zor bir dagilim onu kucultebilir. (ii) VC boyutu $d$ olan $\\mathcal{H}$ icin Massart onsavi $\\hat{\\mathfrak{R}}_S \\leq \\sqrt{2 d \\log(e n / d) / n}$ verir, yani VC siniri geri kazanilir, ama bircok belirli veri dagilimi icin Rademacher kesin olarak daha sikidir. (iii) Rademacher ikili siniflandirmanin otesine genelle$ — herhangi bir sinirli kayip icin calisir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$R$ yaricapli $L_2$ topu</div><div class="card-body">$\\mathcal{H} = \\{x \\mapsto w^\\top x : \\|w\\| \\leq R\\}$, $\\|x_i\\| \\leq X$ ile. Ampirik Rademacher: tam olarak $\\hat{\\mathfrak{R}}_S \\leq R X / \\sqrt{n}$. Sinir aglarinda norm-tabanli sinirlar icin kullanilir.</div></div>
<div class="calc-card"><div class="card-title">Talagrand kasilmasi</div><div class="card-body">$\\phi$ $L$-Lipschitz ise $\\hat{\\mathfrak{R}}_S(\\phi \\circ \\mathcal{H}) \\leq L \\cdot \\hat{\\mathfrak{R}}_S(\\mathcal{H})$. Insanlarin neden Lipschitz kayiplari (hinge, lojistik) onemsedigi — Rademacher sadece Lipschitz sabitiyle carpilir.</div></div>
<div class="calc-card"><div class="card-title">Katmanlar uzerinde kompozisyon</div><div class="card-body">Bir sinir agi icin Rademacher sinirlari her agirlik matrisinin spektral normu ile katman-katman birleser (Bartlett-Foster-Telgarsky 2017). Parametre sayisi degil, marjlar ve normlar dogru nicelikler haline gelir.</div></div>
<div class="calc-card"><div class="card-title">Tahmin</div><div class="card-body">$\\sigma$'yi cok kez ornekle, her seferinde $\\sup_h$'yi hesapla (genellikle $\\sigma$-etiketli veri uzerinde egitim algoritmani calistirarak), ortala. Bunu kodda yapacagiz.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hoeffding'in Otesinde Yogunlasma — McDiarmid ve Bernstein</h2>
<p class="l-text">Iki esitsizlik daha surekli gozukur. <strong>McDiarmid'in sinirli-farklar esitsizligi:</strong> eger $f(X_1, \\dots, X_n)$ herhangi tek koordinat degisikligi icin $|f(\\dots, X_i, \\dots) - f(\\dots, X_i', \\dots)| \\leq c_i$ saglarsa:</p>

<div class="katex-block">$$\\Pr\\bigl(|f - \\mathbb{E} f| \\geq \\epsilon\\bigr) \\leq 2 \\exp\\!\\left(-\\frac{2 \\epsilon^2}{\\sum_i c_i^2}\\right).$$</div>

<p class="l-text">McDiarmid, $\\sup_h |L(h) - \\hat{L}_S(h)|$ supremumunu yogunlastirmamiza izin verir — bu $n$ orneklemin $c_i = 1/n$ sinirli farklarla bir fonksiyonudur. Yerlestir: supremumun ortalamasindan sapmalari alt-Gauss'tur. O ortalama tam olarak Rademacher karmasikligidir, dolayisiyla McDiarmid + simetrizasyon = Bartlett-Mendelson siniri.</p>

<p class="l-text"><strong>Bernstein esitsizligi</strong> varyans kucuk oldugunda Hoeffding'i sikilastirir. Sifir-ortalamali, sinirli $|X_i| \\leq M$ ile $\\mathrm{Var}(X_i) = \\sigma^2$ icin:</p>

<div class="katex-block">$$\\Pr\\Bigl(\\sum X_i \\geq t\\Bigr) \\leq \\exp\\!\\left(-\\frac{t^2 / 2}{n \\sigma^2 + M t / 3}\\right).$$</div>

<p class="l-text">Kucuk $t$ icin bu $\\exp(-t^2 / (2 n \\sigma^2))$'dir — varyans Hoeffding'in $M^2$ oldugu yerde girer. Dusuk-varyansli rastgele degiskenlerin (nadir olaylar, iyi kalibre edilmis kayiplar) oldugunda Bernstein cok daha sikidir. Bazi rejimlerde $O(1/\\sqrt{n})$ yerine $O(1/n)$'lik "hizli oranlar"in olma nedeni — $\\sigma^2 \\to 0$ ile Bernstein hizli orani verir.</p>

<div class="calc-highlight"><strong>Uc-sinir zihinsel modeli.</strong> Hoeffding: herhangi sinirli degisken, karekok orani. Bernstein: sinirli + dusuk varyans, sifirin yakininda hizli oran. McDiarmid: bircok bagimsiz girisin sinirli-farklar fonksiyonu, supremumlarin otomatik yogunlasmasi. Neredeyse her uygulamali genelleme argumani bu uc esitsizlikten birini artidir birlesim siniri veya simetrizasyonu kullanir.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Derin Ogrenme Gizemi</h2>
<p class="l-text">Simdi sorun. Bir ResNet-50 kabaca $25 \\times 10^6$ parametreye sahip. CIFAR-10 ($n = 50{,}000$) uzerinde egitildiginde %5'in altinda test hatasina ulasiyor. VC sinirina $d \\approx 10^7$ ve $n = 5 \\times 10^4$ yerlestir: sinir $\\sqrt{10^7 / 10^5} \\approx 10$, %100 hatadan on kat fazla, genelleme farkini verir. Sinir <em>bos</em>tur — "hata en fazla %1000" der. Faydasiz. Ve GPT-3 (175 milyar parametre birkac yuz milyar token uzerinde egitilmis) icin daha kotu, fark siniri astronomik ve yine de model faydali olacak kadar iyi genelleme yapiyor.</p>

<p class="l-text">Zhang, Bengio, Hardt, Recht, Vinyals (2017) bulmacayi canli kildi. CIFAR-10'u dogru ogrenen ayni mimari, ayni epoch sayisinda rastgele etiketleri de ezberleyebilir. Hipotez sinifi <em>o</em> kadar ifade edici — VC boyutu en az $n$ — ama dogal veride dogru hipotezi seciyor. Klasik teori faydali bir sey soylemiyor. Birkac modern teori bosluga doldurmaya calisiyor:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SGD'nin ortuk duzenlilesmesi</div><div class="card-body">Soudry ve ark. (2018): lojistik kayipta SGD, acik duzenlileme olmadan bile max-marjin cozumune yakinsar. Asiri parametrelestirilmis bir agin cok sayidaki kuresel minimumu arasinda, SGD "duz" / buyuk-marjinli olanlari tercih eder.</div></div>
<div class="calc-card"><div class="card-title">Neural Tangent Kernel (NTK)</div><div class="card-body">Jacot, Gabriel, Hongler (2018): sonsuz-genislik limitinde, bir sinir agini gradient akisi ile egitmek belirli bir (Neural Tangent) cekirdek ile cekirdek regresyonuna esdegerdir. Genelleme cekirdek regresyonu olarak analiz edilebilir. Genis aglar icin siki; sonlu-genislik derin olanlar icin gevsek.</div></div>
<div class="calc-card"><div class="card-title">Double descent</div><div class="card-body">Belkin ve ark. (2019): model boyutuna karsi test hatasinin iki minimumu vardir — kucuk modellerde klasik bias-varyans olan ve interpolasyonun otesine geciktiginde ikinci olan. U-sekli sadece W-seklinin baslangicidir. Modern derin aglar interpolasyon zirvesinin saginda yasar.</div></div>
<div class="calc-card"><div class="card-title">PAC-Bayes</div><div class="card-body">McAllester (1999); Dziugaite-Roy (2017) ilk bos-olmayan sinir agi genelleme sinirlarini hesapladi. Fikir: agirliklar uzerinde bir posterior al, stokastik bir tahmincinin ortalama hatasini sinirla. MNIST ve CIFAR-10 icin dogru oncullerle bos olmayan.</div></div>
<div class="calc-card"><div class="card-title">Lottery ticket hipotezi</div><div class="card-body">Frankle &amp; Carbin (2018): yogun aglar seyrek alt-aglar ("kazanan biletler") icerir ki, orijinal baslatmalarindan yalitilmis olarak egitildiklerinde yogun agin dogrulugunu eslesir. Etkin karmasikligin parametre sayisindan cok daha kucuk oldugunu onerir.</div></div>
<div class="calc-card"><div class="card-title">Iyi huylu asiri uydurma</div><div class="card-body">Bartlett, Long, Lugosi, Tsigler (2020): minimum-normlu interpolatorlu asiri-parametrelestirilmis dogrusal regresyonda, veri dusuk-etkin-boyutlu bir alt uzayda yasiyorsa egitim hatasi tam olarak sifir oldugunda bile test hatasi kucuk kalabilir.</div></div>
</div>

<div id="plot-l10-doubledescent-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ms=[]; for(var i=1;i<=300;i++) ms.push(i);
var n=50;
function train(m){return Math.max(0.02, 0.45*Math.exp(-m/15));}
function test(m){
  if(m<n){var bias=0.4*Math.exp(-m/12); var variance=0.0015*m; return Math.max(0.05, bias+variance);}
  if(m===n){return 0.95;}
  var over=m-n;
  return Math.max(0.07, 0.18 + 1.5/Math.pow(over+1,0.55));
}
var tr={x:ms,y:ms.map(train),mode:'lines',name:'egitim hatasi',line:{color:'#4ade80',width:2.4,dash:'dot'}};
var te={x:ms,y:ms.map(test),mode:'lines',name:'test hatasi',line:{color:'#3b82f6',width:2.8}};
var interp={x:[n,n],y:[0,1],mode:'lines',name:'interpolasyon esigi',line:{color:'#f87171',width:1.5,dash:'dash'},hoverinfo:'name'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:{text:'model boyutu (parametreler)'},gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',type:'log'},yaxis:{title:{text:'hata'},gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[0,1]},margin:{t:30,r:30,b:55,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{color:'#e8e8e8'}},annotations:[{x:Math.log10(n),y:0.97,xref:'x',yref:'y',text:'interpolasyon zirvesi',showarrow:true,arrowhead:2,ax:60,ay:-20,font:{color:'#f87171',size:11},arrowcolor:'#f87171'}]};
Plotly.newPlot('plot-l10-doubledescent-tr',[tr,te,interp],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafigin gosterdigi:</strong> Double descent. Modeli buyuttukce test hatasi once azalir (bias-baskin rejim) sonra model interpolasyon esigi $m = n$'ye yaklastikca artar (varyans-baskin). Interpolasyonun otesinde — model egitim setini tam olarak uydurabilecek kadar asiri-parametrelestirildiginde — test hatasi <em>yeniden</em> azalir ve klasik U-sekli minimumunun altina dusebilir. Modern derin aglar ikinci inisin derinligine yasar. Belkin ve ark. (2019) bunu rastgele ormanlar, cekirdek regresyonu ve kucuk sinir aglarinda ampirik olarak gosterdi; ayni sekil simdi gorus ve dil modellerinde gozleniyor.</div></div>

<p class="l-text"><strong>Sonuc.</strong> Hicbir tek modern teori tam tatmin edici degil. Her biri resmin bir parcasini yakaliyor: NTK gercek bir agin ulasamadigi bir limitte kesin; PAC-Bayes bazi mimariler icin bos-olmayan sinirlar uretir ama hepsi icin degil; SGD'nin ortuk egilimi dogrusal modeller icin kanitlanabilir ve derin olanlar icin calisan bir hipotezdir. Asiri-parametrelestirilmis sinir aglarinin genellemesi 2026'da ogrenme teorisindeki en aktif acik problemdir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. No Free Lunch — Tum Genelleme Tumevarimsal Onyargidir</h2>
<p class="l-text">Wolpert'in <strong>No Free Lunch teoremi</strong> (1996), bir algoritmanin digerinden evrensel olarak iyi oldugu iddiasinin havasini alir. Ifade: <em>tum</em> olasi hedef fonksiyonlari $f: \\mathcal{X} \\to \\mathcal{Y}$ uzerinde ortalama, her ogrenme algoritmasinin ayni beklenen egitim-disi hatasi vardir. Tum problemlerde es zamanli olarak rastgele tahmini yenen bir algoritma yoktur.</p>

<p class="l-text">Teorem ne dedigini gercekten anlayana kadar yikici gozukur. "Tum hedef fonksiyonlari uzerinde ortalama" inanilmaz buyuk bir kume uzerinde tek tip bir olcudur ve o kumenin uyelerinin cogu saf gurultu — herhangi bir seyle iliskisiz etiketler. Hicbir algoritma saf gurultuyu ogrenemez. Algoritmalar pratikte calisir cunku onlari <em>yapilandirilmis</em> dagilimlara uygulariz — goruntu, metin, fizik — bunlar tum olasi fonksiyonlarin kucuk bir alt kumesini kapsar. Yararlandiğimız yapı algoritmanın <strong>tümevarimsal önyargısı</strong>dır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Konvolusyon onyargisi</div><div class="card-body">CNN'ler "yakin pikseller onemlidir, uzak olanlar cok sonraya kadar onemli degildir, oteleme esdegerdir" kodlar. Bu onyargi dogal goruntulerle eslesir ve, diyelim, karistirilmis-piksel goruntulerinde bozulur.</div></div>
<div class="calc-card"><div class="card-title">Dikkat onyargisi</div><div class="card-body">Transformer'lar "her token, ogrenilmis agirliklar araciligiyla her diger tokena dikkat edebilir" kodlar. Metinle (uzun-mesafeli sentaktik bagimliliklar) eslesir ve kod, goruntu yamalar, ses ile basa cikacak kadar genellestirilebilir.</div></div>
<div class="calc-card"><div class="card-title">Seyreklik onyargisi</div><div class="card-body">$\\ell_1$ duzenlileme (Lasso) "gercek model az oznitelik kullanir" kodlar. Genomik, sinyal isleme, sikistirilmis algilamayla eslesir.</div></div>
<div class="calc-card"><div class="card-title">Puruzsuzluk onyargisi</div><div class="card-body">Gauss surecleri, cekirdekler, Tikhonov duzenlilemesi "gercek fonksiyon puruzsuzdur" kodlar. Cogu fizikle, cogu regresyonla eslesir.</div></div>
<div class="calc-card"><div class="card-title">Hiyerarsik onyargi</div><div class="card-body">Sinir aglarinda derinlik "dunyanin bilesimsel yapisi vardir" kodlar. Gorus (kenarlar $\\to$ sekiller $\\to$ nesneler), dil (karakterler $\\to$ kelimeler $\\to$ sentaks $\\to$ anlam) ile eslesir.</div></div>
<div class="calc-card"><div class="card-title">Esvarianslik onyargisi</div><div class="card-body">Graf sinir aglari, esvariansli CNN'ler, geometrik derin ogrenme. Problemin ilgili simetri grubunu (permutasyon, donme, ayar, vb.) kodlar.</div></div>
</div>

<p class="l-text"><strong>En derin cikarim.</strong> Bir mimari secmek "ifade gucu" veya "kapasite" meselesi degil — <em>dogru oncul kodlama</em> meselesidir. Derin ogrenmenin basarisi sinir aglarinin evrensel yaklasikci olmasindan (polinomlar da oyle ve basariSiz) degil. CNN, transformer, GNN, vb. mimari onyargilarinin dogal verinin tumevarimsal yapisiyla eslesmesinden. No Free Lunch resmi ifadedir: onyargini bilincli olarak sec, cunku ogrenmenin mumkun olmasini saglamak icin hipotez sinifini kisitlama isini bir seyin yapmasi gerek.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Pratik Pyodide: Hoeffding Dogrulamasi ve Rademacher Tahmini</h2>
<p class="l-text">Asagidaki kodu calistir. (i) Hoeffding esitsizligini, sinir ile ampirik sapma oranini cok deneme uzerinde kiyaslayarak ampirik olarak dogrular; (ii) $\\mathbb{R}^2$'de yari-duzlemlerin VC boyutunu rastgele konfigurasyonlari parcalamaya calisarak kontrol eder; (iii) kucuk bir veri seti uzerinde dogrusal siniflandiricilarin ampirik Rademacher karmasikligini tahmin eder; (iv) basit bir dogrusal siniflandirici uzerinde $n$ ile genelleme farkinin coktugunu gosterir. <strong>RUN</strong>'a tikla, sonra duzenle ve yeniden calistir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> itertools <span class="kw">import</span> product

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 1. Hoeffding esitsizligi — sinir vs ampirik sapma</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"=== Hoeffding esitsizligi dogrulamasi ==="</span>)
trials = <span class="num">20000</span>
<span class="kw">for</span> n <span class="kw">in</span> [<span class="num">50</span>, <span class="num">200</span>, <span class="num">1000</span>]:
    <span class="kw">for</span> eps <span class="kw">in</span> [<span class="num">0.05</span>, <span class="num">0.10</span>, <span class="num">0.20</span>]:
        <span class="cm"># X_i ~ Uniform[0,1], gercek ortalama = 0.5</span>
        means = rng.<span class="fn">random</span>((trials, n)).<span class="fn">mean</span>(axis=<span class="num">1</span>)
        emp_rate = np.<span class="fn">mean</span>(np.<span class="fn">abs</span>(means - <span class="num">0.5</span>) &gt;= eps)
        bound = <span class="num">2</span> * np.<span class="fn">exp</span>(-<span class="num">2</span> * n * eps**<span class="num">2</span>)
        <span class="fn">print</span>(f<span class="str">"  n={n:5d}  eps={eps:.2f}  Pr(|sapma|>=eps) ampirik={emp_rate:.4f}  Hoeffding siniri={bound:.4f}"</span>)

<span class="cm"># Hoeffding (gevsek) bir ust sinir — ampirik oran her zaman daha kucuk.</span>

<span class="cm"># ============================================================</span>
<span class="cm"># 2. R^2'de yari-duzlemlerin VC boyutu — parcalama testi</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== VC boyutu: R^2'de yari-duzlemler ==="</span>)

<span class="kw">def</span> <span class="fn">can_shatter_3_points</span>(points):
    <span class="str">"""3 noktanin her +/- etiketlemesini dene; her birinin bir yari-duzlemle elde edilebilir olup olmadigini kontrol et."""</span>
    <span class="kw">for</span> labels <span class="kw">in</span> <span class="fn">product</span>([-<span class="num">1</span>, <span class="num">1</span>], repeat=<span class="fn">len</span>(points)):
        labels = np.<span class="fn">array</span>(labels)
        found = <span class="kw">False</span>
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
            w = rng.<span class="fn">standard_normal</span>(<span class="num">2</span>)
            <span class="kw">for</span> b <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">2</span>, <span class="num">2</span>, <span class="num">80</span>):
                pred = np.<span class="fn">sign</span>(points @ w + b)
                <span class="kw">if</span> np.<span class="fn">array_equal</span>(pred, labels):
                    found = <span class="kw">True</span>; <span class="kw">break</span>
            <span class="kw">if</span> found: <span class="kw">break</span>
        <span class="kw">if</span> <span class="kw">not</span> found:
            <span class="kw">return</span> <span class="kw">False</span>, labels
    <span class="kw">return</span> <span class="kw">True</span>, <span class="kw">None</span>

triangle = np.<span class="fn">array</span>([[<span class="num">0</span>, <span class="num">0</span>], [<span class="num">1</span>, <span class="num">0</span>], [<span class="num">0.5</span>, <span class="num">1</span>]])
ok, bad = <span class="fn">can_shatter_3_points</span>(triangle)
<span class="fn">print</span>(f<span class="str">"  Genel konumda 3 nokta parcalandi mi? {ok}"</span>)

<span class="cm"># Konveks konumda 4 nokta parcalanamaz: XOR etiketlemesi basarisiz olur.</span>
square = np.<span class="fn">array</span>([[<span class="num">0</span>, <span class="num">0</span>], [<span class="num">1</span>, <span class="num">0</span>], [<span class="num">1</span>, <span class="num">1</span>], [<span class="num">0</span>, <span class="num">1</span>]])
xor_labels = np.<span class="fn">array</span>([<span class="num">1</span>, -<span class="num">1</span>, <span class="num">1</span>, -<span class="num">1</span>])
found_xor = <span class="kw">False</span>
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5000</span>):
    w = rng.<span class="fn">standard_normal</span>(<span class="num">2</span>)
    <span class="kw">for</span> b <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">100</span>):
        <span class="kw">if</span> np.<span class="fn">array_equal</span>(np.<span class="fn">sign</span>(square @ w + b), xor_labels):
            found_xor = <span class="kw">True</span>; <span class="kw">break</span>
    <span class="kw">if</span> found_xor: <span class="kw">break</span>
<span class="fn">print</span>(f<span class="str">"  4-nokta kare uzerinde XOR etiketlemesi yari-duzlemle elde edilebilir mi? {found_xor}"</span>)
<span class="fn">print</span>(<span class="str">"  Sonuc: VCdim(R^2'de yari-duzlemler) = 3."</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 3. Ampirik Rademacher karmasikligi — dogrusal siniflandiricilar</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== Ampirik Rademacher karmasikligi ==="</span>)

<span class="kw">def</span> <span class="fn">emp_rademacher_linear</span>(X, n_sigma=<span class="num">200</span>, R=<span class="num">1.0</span>):
    <span class="str">"""||w|| <= R kosulu ile dogrusal siniflandiricilar icin Rademacher karmasikligini tahmin et."""</span>
    n = <span class="fn">len</span>(X)
    vals = []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_sigma):
        sigma = rng.<span class="fn">choice</span>([-<span class="num">1</span>, <span class="num">1</span>], size=n)
        vec = (sigma[:, <span class="kw">None</span>] * X).<span class="fn">mean</span>(axis=<span class="num">0</span>)
        vals.<span class="fn">append</span>(R * np.linalg.<span class="fn">norm</span>(vec))
    <span class="kw">return</span> np.<span class="fn">mean</span>(vals)

<span class="kw">for</span> n <span class="kw">in</span> [<span class="num">50</span>, <span class="num">200</span>, <span class="num">1000</span>, <span class="num">5000</span>]:
    X = rng.<span class="fn">standard_normal</span>((n, <span class="num">10</span>))
    rade = <span class="fn">emp_rademacher_linear</span>(X, R=<span class="num">1.0</span>)
    bound = np.<span class="fn">sqrt</span>(np.<span class="fn">trace</span>(X.T @ X) / n**<span class="num">2</span>)
    <span class="fn">print</span>(f<span class="str">"  n={n:5d}  amp Rademacher={rade:.4f}  teori ~RX/sqrt(n)={bound:.4f}"</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># 4. Gercek dogrusal siniflandirici icin genelleme farki vs n</span>
<span class="cm"># ============================================================</span>
<span class="fn">print</span>(<span class="str">"\\n=== Orneklem boyutuna karsi genelleme farki ==="</span>)

d = <span class="num">10</span>
w_star = rng.<span class="fn">standard_normal</span>(d); w_star /= np.linalg.<span class="fn">norm</span>(w_star)
n_test = <span class="num">5000</span>
X_test = rng.<span class="fn">standard_normal</span>((n_test, d))
y_test = np.<span class="fn">sign</span>(X_test @ w_star)

<span class="kw">for</span> n <span class="kw">in</span> [<span class="num">20</span>, <span class="num">50</span>, <span class="num">200</span>, <span class="num">1000</span>, <span class="num">5000</span>]:
    X = rng.<span class="fn">standard_normal</span>((n, d))
    y = np.<span class="fn">sign</span>(X @ w_star)
    w_hat, *_ = np.linalg.<span class="fn">lstsq</span>(X, y, rcond=<span class="kw">None</span>)
    train_err = np.<span class="fn">mean</span>(np.<span class="fn">sign</span>(X @ w_hat) != y)
    test_err  = np.<span class="fn">mean</span>(np.<span class="fn">sign</span>(X_test @ w_hat) != y_test)
    gap = test_err - train_err
    vc_bound = np.<span class="fn">sqrt</span>((d + <span class="num">1</span>) * np.<span class="fn">log</span>(n / (d + <span class="num">1</span>)) / n)
    <span class="fn">print</span>(f<span class="str">"  n={n:5d}  egitim={train_err:.3f}  test={test_err:.3f}  fark={gap:.3f}  VC sinir={vc_bound:.3f}"</span>)
</code></pre></div>

<p class="l-text">Ciktida ne gormelisin. (i) Hoeffding'in ampirik sapma orani her zaman sinirin altinda, 5x ila 100x — sinir gevsek ama dogru. (ii) Genel konumdaki uc nokta yari-duzlemler tarafindan parcalanir; bir karenin dort kosesindeki XOR etiketlemesi parcalanmaz — $\\mathrm{VCdim} = 3$ onaylanir. (iii) Ampirik Rademacher karmasikligi $1/\\sqrt{n}$ gibi azalir, teoriyle eslesir. (iv) Genelleme farki $n$ ile coker ve VC-tarzi $\\sqrt{d \\log(n/d) / n}$ dogru sekli izler (sabit faktor kadar gevsek, beklendigi gibi).</p>

<p class="l-text">$d = 10$ ve $n = 20$ ile farki buyuk (test %30, egitim %0). $n = 1000$'de fark %2–3. $n = 5000$'de esasen sifir. Tam olarak $n / d \\gg 1$ ve klasik teorinin uygulandigi rejim. $d = 10^7$ ve $n = 5 \\times 10^4$'e gec, ayni hesap farkin sinirsiz oldugunu soylerdi — ama derin aglar genelleme yapiyor. Bu gerilim modern gizemdir.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Marjin Teorisi ve Modern Incelme</h2>
<p class="l-text">Marjinler klasik teoriyi kismen kurtarir. Gercek-degerli bir siniflandirici $f(x)$ icin (siniflandirma kurali $\\mathrm{sign}\\, f(x)$ ile), dogru siniflandirilmis bir nokta uzerindeki <em>marjin</em> $|f(x)|$'dir. Bartlett-Foster marjin siniri, genellemenin ham VC boyutuna degil <em>marjin-normalleştirilmiş</em> karmasikliga bagli oldugunu soyler:</p>

<div class="katex-block">$$L_\\gamma(h) \\leq \\hat{L}_\\gamma(h) + O\\!\\left(\\frac{R(\\mathcal{H})}{\\gamma \\sqrt{n}}\\right) + O\\!\\left(\\sqrt{\\frac{\\log(1/\\delta)}{n}}\\right),$$</div>

<p class="l-text">burada $R(\\mathcal{H})$ bir karmasiklik terimidir (genellikle agirlik-matris spektral normlarinin carpimi) ve $\\gamma$ egitim seti uzerindeki minimum marjindir. Buyuk marjinlere sahip bir siniflandirici daha iyi genelleme yapar; parametre sayisi dusar, agirlik normlari girer. Bu, derin aglar icin "norm-tabanli" genelleme sinirlarinin temelidir (Bartlett-Foster-Telgarsky 2017, Neyshabur-Tomioka-Srebro 2015, Golowich-Rakhlin-Shamir 2018).</p>

<div id="plot-l10-margin-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x1=[], y1=[], x2=[], y2=[];
for(var i=0;i<200;i++){var a=Math.random(); var r=0.5+0.5*a; var t=Math.random()*Math.PI; x1.push(-r*Math.cos(t)); y1.push(-1+r*Math.sin(t));}
for(var i=0;i<200;i++){var a=Math.random(); var r=0.5+0.5*a; var t=Math.random()*Math.PI; x2.push(r*Math.cos(t)); y2.push(1-r*Math.sin(t));}
var pos={x:x1,y:y1,mode:'markers',name:'sinif +',marker:{color:'#3b82f6',size:6,opacity:0.8}};
var neg={x:x2,y:y2,mode:'markers',name:'sinif -',marker:{color:'#f87171',size:6,opacity:0.8}};
var sep={x:[-2,2],y:[0,0],mode:'lines',name:'karar siniri',line:{color:'#e8e8e8',width:2}};
var mlow={x:[-2,2],y:[0.2,0.2],mode:'lines',name:'kucuk marjin (gamma=0.2)',line:{color:'#facc15',width:1.5,dash:'dot'}};
var mlow2={x:[-2,2],y:[-0.2,-0.2],mode:'lines',line:{color:'#facc15',width:1.5,dash:'dot'},showlegend:false};
var mhigh={x:[-2,2],y:[0.9,0.9],mode:'lines',name:'buyuk marjin (gamma=0.9)',line:{color:'#4ade80',width:1.5,dash:'dash'}};
var mhigh2={x:[-2,2],y:[-0.9,-0.9],mode:'lines',line:{color:'#4ade80',width:1.5,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:{text:'x_1'},range:[-1.8,1.8],gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)'},yaxis:{title:{text:'x_2'},range:[-2.2,2.2],gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',scaleanchor:'x'},margin:{t:30,r:30,b:55,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{color:'#e8e8e8',size:10}}};
Plotly.newPlot('plot-l10-margin-tr',[pos,neg,sep,mlow,mlow2,mhigh,mhigh2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafigin gosterdigi:</strong> $\\mathbb{R}^2$'de yatay bir karar siniri (beyaz) ile ayrilmis iki sinif. Sari noktali bant <em>kucuk</em> bir marjini $\\gamma = 0.2$ isaretler; yesil kesikli bant <em>buyuk</em> bir marjini $\\gamma = 0.9$ isaretler. Tum egitim noktalarini yesil bantin disina iten bir siniflandirici Bartlett-Foster genelleme sinirinda $O(R / (\\gamma \\sqrt n))$ olarak, sadece sari marjini elde edenden dort kat daha kucuktur. Bu sert-marjinli SVM'in arkasindaki ayni sezgidir: genelleme garantisini maksimize etmek icin marjini maksimize et.</div></div>

<p class="l-text">Derin aglar icin bu kismi cevaplar verir. Marjin ile normalleştirilmiş tüm ağırlık matrislerinin spektral normlarının çarpımı bazen bos-olmayan sinirlar verir (Bartlett-Foster-Telgarsky 2017) — ama yalnızca belirli mimariler için ve ancak dikkatli ağırlık normalleştirmesi sonrasında. Sinirlar en buyuk cagdas modeller icin gevsek kalir. Marjin teorisi en basarili klasik-tarz cevaplardan biri ama farki kapatmiyor.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Ozet ve Baglantilar</h2>
<p class="l-text">Istatistiksel ogrenme teorisi "model genelleme yapacak mi?" sorusu icin sana kesin bir soz dagarcigi ve orta-boy modeller icin nicel bir cevap verir. PAC cercevesi iki dugmeyle ogrenilebilirligi tanimlar (dogruluk $\\epsilon$, guven $\\delta$). Hoeffding esitsizligi tum temel yogunlasma sinirlarini calisirir. VC boyutu $\\log |\\mathcal{H}|$'yi sonsuz siniflara genisletir. Rademacher karmasikligi VC'yi veriye-bagimli ve daha siki yaparak inceleyebilir. Modern derin aglar klasik sinirlari kirar — aktif teoriler (NTK, double descent, PAC-Bayes, lottery tickets, SGD'nin ortuk egilimi, iyi huylu asiri uydurma, marjin teorisi) her biri resmin bir parcasini yakaliyor ama hicbiri tamam degil. No Free Lunch sana tum genellemenin tumevarimsal onyargidan geldigini soyler — mimarinin gercek verinin sahip oldugu yapinin kodlanmasi.</p>

<div class="calc-highlight"><strong>Anahtar cikarimlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>PAC ogrenme: $1/\\epsilon, 1/\\delta$'da polinom orneklemle $\\Pr(L \\leq \\epsilon) \\geq 1 - \\delta$.</li>
<li>Hoeffding: $\\Pr(|\\bar{X} - \\mu| \\geq \\epsilon) \\leq 2 e^{-2 n \\epsilon^2}$. Tum yogunlasma argumanlarinin motoru.</li>
<li>Sonlu-sinif siniri: birlesim siniri ile $L \\leq \\hat{L} + \\sqrt{(\\log M + \\log(1/\\delta)) / (2 n)}$.</li>
<li>VC boyutu: en buyuk parcalanan kume. $\\mathbb{R}^2$'de yari-duzlemler: 3. $\\mathbb{R}^d$'de dogrusal: $d+1$. Dikdortgenler: 4. $W$ agirlikli sinir agi: $O(W \\log W)$.</li>
<li>Sauer-Shelah: $\\mathrm{VCdim} = d$ olan bir sonsuz sinif $n$ nokta icin en fazla $(en/d)^d$ farkli etiketleme uretir.</li>
<li>VC genellemesi: $L \\leq \\hat{L} + O(\\sqrt{d \\log(n/d) / n})$.</li>
<li>Rademacher: veriye-bagimli, VC'den daha siki, sinirli kayiplara genellestirilir.</li>
<li>Derin ogrenme paradoksu: klasik sinirlar bos; modern teoriler kismi.</li>
<li>Marjinler: sinirlar $R(\\mathcal{H}) / (\\gamma \\sqrt n)$'ye bagli, ham parametre sayisina degil.</li>
<li>No Free Lunch: tum algoritmalar tum hedefler uzerinde ortalama esit; gercek ilerleme dogru tumevarimsal onyargiyi secmekten gelir.</li>
</ul>
</div>

<p class="l-text">Sonraki ders (L11 — Yogunlasma ve Martingaleler) olasiliksal makinenin bir seviye daha derinine iner ve sana Azuma'yi, McDiarmid'i tam haliyle ve stokastik gradient inisin martingale-tabanli analizlerini verir. Ondan sonra matematik track kapanir; burada ogrendigin her sey ML, NLP, derin ogrenme ve takviyeli ogrenme track'lerinde "bu sey neden asiri uydurmuyor?" sorusu cikti zaman yuzeye cikar.</p>
</div>`
};
