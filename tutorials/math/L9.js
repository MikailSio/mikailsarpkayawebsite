window.MATH_L9 = {
en: `<p class="l-text"><strong>Information geometry is what happens when you put a Riemannian structure on a family of probability distributions.</strong> Given a parametric model $p_\\theta(x)$, the space of all reachable $\\theta$ is a manifold. The right metric on this manifold is not Euclidean — moving $\\theta$ by 0.01 can change the distribution a tiny amount in one direction and a huge amount in another, depending on how sensitive the likelihood is. The metric that captures sensitivity is the <strong>Fisher information matrix</strong>. Equipped with it, the manifold of distributions inherits geodesics, gradients, and curvature; the KL divergence becomes the natural local distance; and gradient descent becomes the <strong>natural gradient</strong>. Shun-ichi Amari built this theory across the 1980s–2000s; the canonical reference is Amari's <em>Information Geometry and Its Applications</em> (2016).</p>

<p class="l-text">For modern machine learning the practical payoff is one update rule and a sharper way to think about training. The natural gradient $\\theta \\leftarrow \\theta - \\eta\\, I(\\theta)^{-1} \\nabla L(\\theta)$ rescales the gradient by the inverse Fisher, and as a consequence is invariant to reparameterization — the same step is taken whether you parameterize a Gaussian by $(\\mu, \\sigma)$ or by $(\\mu, \\log \\sigma^2)$. K-FAC, Shampoo, and the second-order optimizers used to train massive language models in the late 2020s are all approximations to the natural gradient. In this lesson we build Fisher from the score function, prove the Cramer-Rao bound, derive the KL ↔ Fisher equivalence to second order, and run a small natural-gradient experiment on a Gaussian fitting problem.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the Fisher information matrix from the score function and from second derivatives of log-likelihood</li>
<li>State and use the Cramer-Rao bound — the absolute floor on unbiased-estimator variance</li>
<li>Derive that $\\mathrm{KL}(p_\\theta \\| p_{\\theta + d\\theta}) \\approx \\tfrac{1}{2} d\\theta^\\top I(\\theta)\\, d\\theta$ to second order</li>
<li>Compute KL divergence numerically with <code>scipy.special.rel_entr</code></li>
<li>Implement natural gradient descent and observe its reparameterization invariance</li>
<li>Recognize exponential families and why information geometry is especially clean for them</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Statistical Manifold</h2>
<p class="l-text">Pick a parametric family of densities $\\{p_\\theta(x) : \\theta \\in \\Theta\\}$ — Gaussians indexed by $(\\mu, \\sigma^2)$, Bernoullis indexed by $p$, softmax distributions indexed by logits, the conditional distribution of a neural network indexed by its weights. The set of reachable distributions $\\mathcal{M} = \\{p_\\theta : \\theta \\in \\Theta\\}$ is the <strong>statistical manifold</strong>. Each point on the manifold is a probability distribution; each direction in the tangent space is a "way to move the distribution".</p>

<p class="l-text">If you treat $\\Theta$ as flat Euclidean and run gradient descent in $\\theta$, you are implicitly using the geometry of the parameter space, not the geometry of distributions. That is dishonest in a precise sense: a step that changes $\\theta$ by 0.01 may change $p_\\theta$ a lot or a little, depending on $\\theta$. Reparameterizing the same family — say, switching from $\\sigma$ to $\\log \\sigma$ — gives a different gradient direction for the same physical change in distribution. Information geometry fixes this by giving the manifold an intrinsic metric.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Score function</div><div class="card-body">$s(x; \\theta) = \\nabla_\\theta \\log p_\\theta(x)$. Mean zero under $p_\\theta$. Measures how sensitive the log-likelihood is to $\\theta$ at a particular sample.</div></div>
<div class="calc-card"><div class="card-title">Fisher information</div><div class="card-body">$I(\\theta) = \\mathbb{E}_{x \\sim p_\\theta}[s(x;\\theta)\\, s(x;\\theta)^\\top]$. The covariance of the score. Equivalently $-\\mathbb{E}[\\nabla^2 \\log p_\\theta(x)]$.</div></div>
<div class="calc-card"><div class="card-title">Riemannian metric</div><div class="card-body">Fisher acts as the metric tensor on the statistical manifold: $\\langle u, v\\rangle_\\theta = u^\\top I(\\theta)\\, v$. Distance, geodesics, and curvature follow.</div></div>
<div class="calc-card"><div class="card-title">Why this metric?</div><div class="card-body">Chentsov's theorem (1972): the Fisher metric is the <em>unique</em> Riemannian metric on a statistical manifold (up to scale) that is invariant under sufficient statistics. There is no other right answer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Fisher Information — Three Equivalent Definitions</h2>
<p class="l-text">For a smooth family $p_\\theta(x)$ with regular log-likelihood, the Fisher information matrix can be written three ways:</p>

<div class="katex-block">$$I(\\theta) = \\mathbb{E}\\bigl[(\\nabla_\\theta \\log p_\\theta)(\\nabla_\\theta \\log p_\\theta)^\\top\\bigr] = -\\mathbb{E}\\bigl[\\nabla^2_\\theta \\log p_\\theta\\bigr] = \\mathrm{Cov}_\\theta\\bigl[\\nabla_\\theta \\log p_\\theta\\bigr].$$</div>

<p class="l-text">All three are equal when the regularity conditions hold (smoothness and the ability to swap differentiation and integration). The first is computational: an outer-product Monte Carlo estimate. The second is the negative expected Hessian of the log-likelihood — what optimizers actually approximate. The third is just (1) restated using the fact that the score has mean zero.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Gaussian with unknown mean mu and variance sigma^2.</span>
<span class="cm"># Closed form Fisher: I(mu, sigma^2) = diag(1/sigma^2, 1/(2 sigma^4))</span>
mu_true, sigma2_true = <span class="num">1.0</span>, <span class="num">4.0</span>
sigma_true = np.<span class="fn">sqrt</span>(sigma2_true)

<span class="cm"># Closed-form Fisher</span>
I_closed = np.<span class="fn">diag</span>([<span class="num">1</span>/sigma2_true, <span class="num">1</span>/(<span class="num">2</span>*sigma2_true**<span class="num">2</span>)])
<span class="fn">print</span>(<span class="str">"Closed-form Fisher I(mu, sigma^2):"</span>)
<span class="fn">print</span>(I_closed)

<span class="cm"># Monte Carlo via outer product of scores</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
N = 200_000
x = rng.<span class="fn">normal</span>(mu_true, sigma_true, size=N)

<span class="cm"># Score vector for theta = (mu, sigma^2)</span>
<span class="cm"># d log p / d mu       = (x - mu) / sigma^2</span>
<span class="cm"># d log p / d sigma^2  = -1/(2 sigma^2) + (x - mu)^2 / (2 sigma^4)</span>
s_mu  = (x - mu_true) / sigma2_true
s_var = -<span class="num">1</span>/(<span class="num">2</span>*sigma2_true) + (x - mu_true)**<span class="num">2</span> / (<span class="num">2</span>*sigma2_true**<span class="num">2</span>)
S = np.<span class="fn">stack</span>([s_mu, s_var], axis=<span class="num">1</span>)            <span class="cm"># N x 2</span>
I_mc = (S.T @ S) / N
<span class="fn">print</span>(<span class="str">"\\nMonte Carlo Fisher (N = 200000):"</span>)
<span class="fn">print</span>(I_mc)
<span class="fn">print</span>(f<span class="str">"\\nMax abs diff: {np.max(np.abs(I_mc - I_closed)):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Score mean (should be ~0): {S.mean(axis=0)}"</span>)
</code></pre></div>

<p class="l-text">The Monte Carlo Fisher matches the closed form within a few percent at $N=200{,}000$, and the score mean is essentially zero (a sanity check — if it were not, we would have a bug in either the model or the gradient). For neural networks, the Fisher is computed exactly the same way: sample, compute per-example gradients of log-likelihood, take outer products, average. K-FAC is the technique for making that outer product tractable for large layers.</p>

<div id="plot-ml9-fisher-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  // Draw confidence ellipses for inverse-Fisher = covariance bounds at three sigma^2 values.
  // Each ellipse is centred at the TRUE (mu, sigma^2) so it sits in the physical (positive sigma^2) region.
  function ellipse(cx,cy,a,b){var xs=[],ys=[]; for(var i=0;i<=120;i++){var t=i*Math.PI*2/120; xs.push(cx+a*Math.cos(t)); ys.push(cy+b*Math.sin(t));} return {x:xs,y:ys};}
  // Fisher I(mu, sigma^2) = diag(1/s2, 1/(2 s4)). Inverse = diag(s2, 2 s4).
  // Semi-axis lengths (sqrt of variance). Visually scaled for n=50 samples (1/sqrt(n) factor).
  var s2a=0.5, s2b=1.0, s2c=2.5;
  var k = 1.0/Math.sqrt(50); // 1/sqrt(n) — empirical CRB shrinks with n
  var e1=ellipse(0, s2a, k*Math.sqrt(s2a), k*Math.sqrt(2*s2a*s2a));
  var e2=ellipse(0, s2b, k*Math.sqrt(s2b), k*Math.sqrt(2*s2b*s2b));
  var e3=ellipse(0, s2c, k*Math.sqrt(s2c), k*Math.sqrt(2*s2c*s2c));
  // Mark the true parameters (centres)
  var centres={x:[0,0,0],y:[s2a,s2b,s2c],mode:"markers",type:"scatter",name:"true (μ, σ²)",marker:{color:"#ebe6dc",size:6,symbol:"x"},showlegend:true};
  var t1={x:e1.x,y:e1.y,mode:"lines",name:"σ²=0.5 (sharp likelihood)",line:{color:"#4ade80",width:2.5},fill:"toself",fillcolor:"rgba(74,222,128,0.18)"};
  var t2={x:e2.x,y:e2.y,mode:"lines",name:"σ²=1.0",line:{color:"#c8a96e",width:2.5},fill:"toself",fillcolor:"rgba(200,169,110,0.16)"};
  var t3={x:e3.x,y:e3.y,mode:"lines",name:"σ²=2.5 (flat likelihood)",line:{color:"#f87171",width:2.5},fill:"toself",fillcolor:"rgba(248,113,113,0.14)"};
  var layout={title:{text:"Inverse-Fisher (CRB) ellipses for N(μ, σ²) at n=50: ellipse swells with σ²",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"μ axis (parameter 1)",font:{color:"#ebe6dc"}},range:[-1.2,1.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"σ² axis (parameter 2, positive)",font:{color:"#ebe6dc"}},range:[0,4]},margin:{t:50,r:20,b:50,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"}}};
  Plotly.newPlot("plot-ml9-fisher-en",[t3,t2,t1,centres],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Each ellipse is the inverse Fisher I(μ,σ²)⁻¹ — the Cramer-Rao lower bound on estimator covariance for a Gaussian. Small σ² (green) means a sharply peaked likelihood and tight estimator: the ellipse is small. Large σ² (red) means a flat likelihood and loose estimator: the ellipse swells, especially along the σ² axis where uncertainty grows like 2σ⁴. The shape of the ellipse is the geometry of the statistical manifold.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Cramer-Rao Bound</h2>
<p class="l-text">For any unbiased estimator $\\hat{\\theta}$ of $\\theta$ from $n$ samples, the covariance is bounded below by the inverse Fisher information:</p>

<div class="katex-block">$$\\mathrm{Cov}(\\hat{\\theta}) \\succeq \\frac{1}{n}\\, I(\\theta)^{-1}.$$</div>

<p class="l-text">No unbiased estimator can do better. The MLE asymptotically achieves equality (it is <em>efficient</em>). This single bound underpins the entire theory of statistical efficiency: it tells you the absolute precision floor, and it tells you that the MLE is already there asymptotically — no clever new estimator can beat it for large $n$.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Estimate mu of N(mu, sigma^2=1) from n samples; CR bound on Var(mu_hat) is 1/n.</span>
n = <span class="num">100</span>
trials = <span class="num">5000</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)
mu_true = <span class="num">0.0</span>

mu_hat = rng.<span class="fn">normal</span>(mu_true, <span class="num">1.0</span>, size=(trials, n)).<span class="fn">mean</span>(axis=<span class="num">1</span>)
empirical_var = mu_hat.<span class="fn">var</span>(ddof=<span class="num">1</span>)
crb = <span class="num">1.0</span> / n

<span class="fn">print</span>(f<span class="str">"Cramer-Rao bound on Var(mu_hat):       {crb:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"Empirical Var(mu_hat) over {trials} trials: {empirical_var:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"Ratio empirical / bound = {empirical_var/crb:.3f}  (MLE saturates the bound)"</span>)

<span class="cm"># A biased estimator can have lower variance — but at the cost of bias.</span>
<span class="cm"># E.g. shrinkage: mu_hat_s = alpha * sample mean</span>
alpha = <span class="num">0.8</span>
mu_hat_s = alpha * mu_hat
<span class="fn">print</span>(f<span class="str">"\\nShrinkage estimator (alpha={alpha}):"</span>)
<span class="fn">print</span>(f<span class="str">"  Var = {mu_hat_s.var():.6f}  (lower, but biased)"</span>)
<span class="fn">print</span>(f<span class="str">"  Bias^2 = {(mu_hat_s.mean() - mu_true)**2:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"  MSE = Var + Bias^2 = {mu_hat_s.var() + (mu_hat_s.mean() - mu_true)**2:.6f}"</span>)
<span class="fn">print</span>(<span class="str">"CRB applies only to UNBIASED estimators. Biased ones can beat it on MSE."</span>)
</code></pre></div>

<p class="l-text">Two things to take away. First, the sample-mean MLE saturates the CRB at $1/n$ — its variance equals the bound to within sampling noise. Second, biased estimators (shrinkage, ridge, regularized MLE) can have lower MSE than the CRB allows for unbiased estimators, by trading variance for a small bias. James-Stein, ridge regression, and the empirical Bayes shrinkage at the heart of modern hierarchical models all live in that space.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. KL Divergence and Its Local Approximation</h2>
<p class="l-text">The Kullback-Leibler divergence is the asymmetric "distance" between distributions:</p>

<div class="katex-block">$$\\mathrm{KL}(p \\| q) = \\mathbb{E}_{x \\sim p}\\!\\left[\\log \\tfrac{p(x)}{q(x)}\\right] = \\sum_x p(x)\\,\\log \\tfrac{p(x)}{q(x)}.$$</div>

<p class="l-text">Always non-negative (Gibbs' inequality), zero iff $p = q$, but not symmetric and not a metric. Yet for nearby distributions $p_\\theta$ and $p_{\\theta + d\\theta}$, KL becomes locally a metric — and that metric is exactly Fisher:</p>

<div class="katex-block">$$\\mathrm{KL}(p_\\theta \\| p_{\\theta + d\\theta}) = \\frac{1}{2}\\, d\\theta^\\top I(\\theta)\\, d\\theta + O(\\|d\\theta\\|^3).$$</div>

<p class="l-text">This is the bridge between information theory (KL) and information geometry (Fisher). Distances on the statistical manifold, measured by Fisher, agree with the standard "log-likelihood ratio" distance to second order. This is why Fisher is the "right" metric — it is what KL looks like up close.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.special <span class="kw">import</span> rel_entr

<span class="cm"># KL between two categorical distributions over 5 outcomes</span>
p = np.<span class="fn">array</span>([<span class="num">0.1</span>, <span class="num">0.2</span>, <span class="num">0.3</span>, <span class="num">0.25</span>, <span class="num">0.15</span>])
q = np.<span class="fn">array</span>([<span class="num">0.12</span>, <span class="num">0.18</span>, <span class="num">0.32</span>, <span class="num">0.22</span>, <span class="num">0.16</span>])

kl_pq = np.<span class="fn">sum</span>(<span class="fn">rel_entr</span>(p, q))   <span class="cm"># rel_entr(p,q) = p * log(p/q) elementwise</span>
kl_qp = np.<span class="fn">sum</span>(<span class="fn">rel_entr</span>(q, p))
<span class="fn">print</span>(f<span class="str">"KL(p||q) = {kl_pq:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"KL(q||p) = {kl_qp:.6f}    (asymmetric)"</span>)

<span class="cm"># Verify Fisher = local Hessian of KL.</span>
<span class="cm"># Categorical with theta = first 4 probs (last fixed by sum=1). Skip — use Gaussian instead.</span>
<span class="cm"># Gaussian: KL(N(0,1) || N(d, 1)) = d^2 / 2.  Fisher I = 1, so 0.5 * d * I * d = d^2/2. Match.</span>
<span class="fn">print</span>(<span class="str">"\\nGaussian local check: KL(N(0,1) || N(d,1)) = d^2/2  vs  0.5 * d^T I d (I=1)"</span>)
<span class="kw">for</span> d <span class="kw">in</span> [<span class="num">0.01</span>, <span class="num">0.05</span>, <span class="num">0.1</span>, <span class="num">0.5</span>]:
    kl_exact = d**<span class="num">2</span> / <span class="num">2</span>
    fisher_quad = <span class="num">0.5</span> * d * <span class="num">1.0</span> * d
    <span class="fn">print</span>(f<span class="str">"  d={d:.3f}   KL_exact={kl_exact:.6f}   Fisher quad={fisher_quad:.6f}"</span>)

<span class="cm"># Asymmetry vs symmetric Jensen-Shannon</span>
m = <span class="num">0.5</span> * (p + q)
js = <span class="num">0.5</span> * np.<span class="fn">sum</span>(<span class="fn">rel_entr</span>(p, m)) + <span class="num">0.5</span> * np.<span class="fn">sum</span>(<span class="fn">rel_entr</span>(q, m))
<span class="fn">print</span>(f<span class="str">"\\nJensen-Shannon (symmetric): JS(p,q) = {js:.6f}"</span>)
</code></pre></div>

<p class="l-text">For the Gaussian $\\mathcal{N}(0,1) \\to \\mathcal{N}(d, 1)$, $\\mathrm{KL} = d^2/2$ exactly, matching $\\tfrac{1}{2} d \\cdot I \\cdot d$ with Fisher $I = 1$. The KL ↔ Fisher correspondence is exact at second order; higher-order terms are model-specific. The Jensen-Shannon divergence symmetrizes KL by averaging $\\mathrm{KL}(p \\| m)$ and $\\mathrm{KL}(q \\| m)$ with $m = (p+q)/2$ — this is what the original GAN loss minimized.</p>

<div id="plot-ml9-kl-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  // KL between two univariate Gaussians N(mu1, s1^2) and N(mu2, s2^2):
  // KL(p||q) = log(s2/s1) + (s1^2 + (mu1-mu2)^2)/(2 s2^2) - 1/2
  // Fix p = N(0,1). Vary q = N(mu, s2). Plot KL(p||q) vs KL(q||p) as a function of (mu, log s2).
  function klPQ(mu2, s2){var s1=1.0; return Math.log(s2/s1) + (s1*s1 + mu2*mu2)/(2*s2*s2) - 0.5;}
  function klQP(mu2, s2){var s1=1.0; return Math.log(s1/s2) + (s2*s2 + mu2*mu2)/(2*s1*s1) - 0.5;}
  var mus=[],logs=[];
  for(var i=0;i<=40;i++){mus.push(-2.0 + 4.0*i/40);}
  for(var j=0;j<=40;j++){logs.push(-1.0 + 2.0*j/40);}
  var z1=[], z2=[];
  for(var j=0;j<logs.length;j++){var row1=[],row2=[]; var s2=Math.exp(logs[j]);
    for(var i=0;i<mus.length;i++){row1.push(klPQ(mus[i],s2)); row2.push(klQP(mus[i],s2));}
    z1.push(row1); z2.push(row2);
  }
  var c1={x:mus,y:logs,z:z1,type:"contour",name:"KL(p‖q)",colorscale:[[0,"rgba(74,222,128,0)"],[1,"rgba(74,222,128,0.85)"]],contours:{coloring:"lines",start:0.1,end:3,size:0.4},line:{width:2},showscale:false};
  var c2={x:mus,y:logs,z:z2,type:"contour",name:"KL(q‖p)",colorscale:[[0,"rgba(248,113,113,0)"],[1,"rgba(248,113,113,0.85)"]],contours:{coloring:"lines",start:0.1,end:3,size:0.4},line:{width:2,dash:"dash"},showscale:false};
  var layout={title:{text:"KL asymmetry: solid = KL(p‖q), dashed = KL(q‖p)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",title:{text:"μ_q (mean of q; p fixed at N(0,1))",font:{color:"#ebe6dc"}}},yaxis:{gridcolor:"rgba(255,255,255,0.05)",title:{text:"log σ_q",font:{color:"#ebe6dc"}}},margin:{t:40,r:20,b:55,l:65},annotations:[{x:0,y:0,text:"p=q (KL=0)",showarrow:true,arrowhead:2,ax:30,ay:-40,font:{color:"#c8a96e",size:12},arrowcolor:"#c8a96e"}]};
  Plotly.newPlot("plot-ml9-kl-en",[c1,c2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Both KL directions vanish at p=q (origin). But the contours are <em>different shapes</em>: KL(p‖q) (solid green) penalizes q's tails being too narrow (mode-covering), while KL(q‖p) (dashed red) penalizes q putting mass where p has none (mode-seeking). Variational inference (VI) minimizes KL(q‖p) and so produces compact posteriors; expectation-propagation minimizes KL(p‖q) and tends to produce wider ones. This asymmetry shapes the entire field of approximate inference.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Natural Gradient</h2>
<p class="l-text">Steepest descent on the parameter manifold under the Fisher metric is the <strong>natural gradient</strong>. Where standard gradient descent solves "minimize $L(\\theta + d\\theta)$ subject to $\\|d\\theta\\|^2 \\leq r$", natural gradient solves "minimize $L(\\theta + d\\theta)$ subject to $\\mathrm{KL}(p_\\theta \\| p_{\\theta + d\\theta}) \\leq r$". The constraint becomes $d\\theta^\\top I(\\theta)\\, d\\theta \\leq 2r$, and the optimal direction is</p>

<div class="katex-block">$$\\theta \\leftarrow \\theta - \\eta\\, I(\\theta)^{-1}\\, \\nabla L(\\theta).$$</div>

<p class="l-text">Two consequences. (i) <strong>Reparameterization invariance:</strong> if you change parameters $\\theta \\to \\phi = g(\\theta)$, the natural gradient takes the same step in distribution space. Standard gradient descent does not. (ii) The step-size $\\eta$ is now in <em>distribution units</em>, not parameter units — you can use the same $\\eta$ for very different parameterizations.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Fit a Gaussian N(mu, sigma^2) to data via maximum likelihood.</span>
<span class="cm"># Compare standard gradient descent vs natural gradient descent on the negative log-likelihood.</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
mu_true, sigma2_true = <span class="num">3.0</span>, <span class="num">2.0</span>
N = <span class="num">1000</span>
data = rng.<span class="fn">normal</span>(mu_true, np.<span class="fn">sqrt</span>(sigma2_true), size=N)

<span class="kw">def</span> <span class="fn">nll</span>(theta):
    mu, s2 = theta
    <span class="kw">if</span> s2 &lt;= <span class="num">0</span>: <span class="kw">return</span> np.inf
    <span class="kw">return</span> <span class="num">0.5</span> * np.<span class="fn">log</span>(<span class="num">2</span>*np.pi*s2) + <span class="num">0.5</span> * np.<span class="fn">mean</span>((data - mu)**<span class="num">2</span>) / s2

<span class="kw">def</span> <span class="fn">grad_nll</span>(theta):
    mu, s2 = theta
    g_mu = -np.<span class="fn">mean</span>(data - mu) / s2
    g_s2 = <span class="num">0.5</span> / s2 - <span class="num">0.5</span> * np.<span class="fn">mean</span>((data - mu)**<span class="num">2</span>) / s2**<span class="num">2</span>
    <span class="kw">return</span> np.<span class="fn">array</span>([g_mu, g_s2])

<span class="kw">def</span> <span class="fn">fisher</span>(theta):
    _, s2 = theta
    <span class="kw">return</span> np.<span class="fn">diag</span>([<span class="num">1</span>/s2, <span class="num">1</span>/(<span class="num">2</span>*s2**<span class="num">2</span>)])

<span class="cm"># Standard GD</span>
theta_std = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">1.0</span>])
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    theta_std = theta_std - <span class="num">0.05</span> * <span class="fn">grad_nll</span>(theta_std)

<span class="cm"># Natural GD</span>
theta_nat = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">1.0</span>])
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    g = <span class="fn">grad_nll</span>(theta_nat)
    F = <span class="fn">fisher</span>(theta_nat)
    theta_nat = theta_nat - <span class="num">0.5</span> * np.linalg.<span class="fn">solve</span>(F, g)

<span class="fn">print</span>(f<span class="str">"True (mu, sigma^2):   ({mu_true}, {sigma2_true})"</span>)
<span class="fn">print</span>(f<span class="str">"Standard GD after 50: ({theta_std[0]:.4f}, {theta_std[1]:.4f})  nll={nll(theta_std):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Natural GD after 50:  ({theta_nat[0]:.4f}, {theta_nat[1]:.4f})  nll={nll(theta_nat):.4f}"</span>)
<span class="fn">print</span>(<span class="str">"\\nNatural gradient converges faster on the variance because the Fisher rescaling"</span>)
<span class="fn">print</span>(<span class="str">"accounts for sigma^2's smaller per-unit effect on the distribution."</span>)
</code></pre></div>

<p class="l-text">Standard GD takes much longer to converge on the variance dimension because $\\sigma^2$ has different units and sensitivity than $\\mu$ — the step size that is right for $\\mu$ is wrong for $\\sigma^2$. Natural GD rescales by Fisher and treats both dimensions correctly, converging in 50 steps where standard GD might need 500 with a fixed $\\eta$. The catch is that $I(\\theta)^{-1}$ is expensive: for a model with $10^9$ parameters, it is impossible. K-FAC, Shampoo, and similar methods replace the full Fisher with a Kronecker-factored or block-diagonal approximation, recovering most of the benefit at tractable cost.</p>

<div id="plot-ml9-natgrad-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  // Anisotropic loss landscape: skinny ellipses (one dim much more sensitive)
  function ellipse(cx,cy,a,b){var xs=[],ys=[]; for(var i=0;i<=120;i++){var t=i*Math.PI*2/120; xs.push(cx+a*Math.cos(t)); ys.push(cy+b*Math.sin(t));} return {x:xs,y:ys};}
  var traces=[];
  var levels=[0.5,1.0,1.5,2.0,2.5];
  for(var k=0;k<levels.length;k++){var L=levels[k]; var e=ellipse(0,0,L,L*0.25);
    traces.push({x:e.x,y:e.y,mode:"lines",line:{color:"rgba(235,230,220,0.32)",width:1.2},showlegend:false,hoverinfo:"skip"});
  }
  // Start point
  var sx=2.2, sy=0.5;
  // Vanilla gradient: points toward origin scaled by curvature → mostly horizontal because that's gradient direction in skinny bowl
  // For loss = (x/a)^2 + (y/b)^2 with a=2 wide and b=0.5 tight, grad = (2x/a^2, 2y/b^2) = (x/2, 8y) — mostly y!
  // So vanilla grad points mostly down; takes many small steps to fix x. Plot it pointing wrong way.
  var gx_v = sx/2.0, gy_v = 8.0*sy;
  var nv = Math.sqrt(gx_v*gx_v+gy_v*gy_v); gx_v/=nv; gy_v/=nv;
  var vanilla={x:[sx, sx-1.5*gx_v], y:[sy, sy-1.5*gy_v], mode:"lines+markers", name:"vanilla gradient (parameter-space)", line:{color:"#f87171",width:3}, marker:{size:[10,12],color:"#f87171",symbol:["circle","arrow-up"]}};
  // Natural gradient: F^-1 g where F = diag(1/a^2, 1/b^2)*2 → multiplies grad by (a^2, b^2)/2 → (x, y) (points to origin!)
  var ngx = sx, ngy = sy;
  var nn = Math.sqrt(ngx*ngx+ngy*ngy); ngx/=nn; ngy/=nn;
  var nat={x:[sx, sx-1.5*ngx], y:[sy, sy-1.5*ngy], mode:"lines+markers", name:"natural gradient (distribution-space)", line:{color:"#4ade80",width:3.5}, marker:{size:[0,12],color:"#4ade80",symbol:"arrow-up"}};
  var startMark={x:[sx],y:[sy],mode:"markers+text",text:["start"],textposition:"top right",marker:{size:11,color:"#c8a96e"},textfont:{color:"#ebe6dc",size:12},showlegend:false};
  var optMark={x:[0],y:[0],mode:"markers+text",text:["optimum"],textposition:"top right",marker:{size:13,color:"#c8a96e",symbol:"star"},textfont:{color:"#c8a96e",size:12},showlegend:false};
  var data=traces.concat([vanilla,nat,startMark,optMark]);
  var layout={title:{text:"Vanilla vs natural gradient on an anisotropic loss",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"θ₁ (well-scaled)",font:{color:"#ebe6dc"}},range:[-3,3]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"θ₂ (sharply curved)",font:{color:"#ebe6dc"}},range:[-1.2,1.6],scaleanchor:"x"},margin:{t:40,r:20,b:55,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.02}};
  Plotly.newPlot("plot-ml9-natgrad-en",data,layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Grey ellipses are level sets of an anisotropic loss — much sharper along θ₂ than θ₁. The red vanilla gradient points almost vertically because the steep θ₂ derivative dominates: standard GD takes a tiny step toward the minimum and zigzags. The green natural gradient I⁻¹∇L points straight at the optimum because Fisher rescales each dimension by its curvature. Same direction in distribution space, very different direction in parameter space — that is the whole point of natural gradient.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Exponential Families — Where Geometry Is Cleanest</h2>
<p class="l-text">An <strong>exponential family</strong> has densities of the form</p>

<div class="katex-block">$$p_\\theta(x) = h(x)\\, \\exp\\bigl(\\theta^\\top T(x) - A(\\theta)\\bigr),$$</div>

<p class="l-text">where $T(x)$ is the sufficient statistic and $A(\\theta) = \\log \\int h(x) e^{\\theta^\\top T(x)} dx$ is the log-partition function. Gaussian, Bernoulli, categorical, Poisson, gamma, beta, exponential, multinomial, Dirichlet — all exponential families. So is the softmax classifier (categorical with linear logits) and the Boltzmann machine.</p>

<p class="l-text">For an exponential family, information geometry collapses to elegant identities:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mean = gradient of log-partition</div><div class="card-body">$\\mathbb{E}_\\theta[T(x)] = \\nabla A(\\theta) = \\mu$. The natural parameters $\\theta$ and the mean parameters $\\mu$ are dual coordinates.</div></div>
<div class="calc-card"><div class="card-title">Fisher = Hessian of log-partition</div><div class="card-body">$I(\\theta) = \\nabla^2 A(\\theta) = \\mathrm{Cov}_\\theta[T(x)]$. The Fisher metric is just the Hessian of $A$.</div></div>
<div class="calc-card"><div class="card-title">KL = Bregman divergence</div><div class="card-body">$\\mathrm{KL}(p_\\theta \\| p_{\\theta'}) = A(\\theta') - A(\\theta) - \\nabla A(\\theta)^\\top (\\theta' - \\theta)$. The Bregman divergence of $A$.</div></div>
<div class="calc-card"><div class="card-title">MLE = method of moments</div><div class="card-body">Maximum likelihood for an exponential family: choose $\\theta$ such that $\\mathbb{E}_\\theta[T(x)] = \\bar{T}(\\text{data})$. Match the sample mean of the sufficient statistic.</div></div>
</div>

<div class="calc-highlight"><strong>Why this matters in modern ML:</strong> the energy-based model literature, variational inference, contrastive divergence, and most of probabilistic graphical models live inside the exponential-family framework. When someone says "the model is in an exponential family", they mean the four bullets above are at your disposal — and that is a lot.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Where This Shows Up in Modern ML</h2>
<p class="l-text">Information geometry is not a niche topic — it is the backbone of several techniques that train very large models.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K-FAC (Martens &amp; Grosse 2015)</div><div class="card-body">Approximates the Fisher of a neural net as a Kronecker product per layer. Used to train large convnets and transformers in fewer steps than Adam at the cost of more compute per step.</div></div>
<div class="calc-card"><div class="card-title">Natural Policy Gradient (Kakade 2001)</div><div class="card-body">RL policy update using Fisher of the policy distribution. TRPO and PPO are simplified descendants. Covered in rl-L7 of our RL track.</div></div>
<div class="calc-card"><div class="card-title">Shampoo / Distributed Shampoo</div><div class="card-body">Block-wise preconditioner, related to natural gradient. Powers Google's large training runs (PaLM, Gemini) more recently in 2023–2025.</div></div>
<div class="calc-card"><div class="card-title">Variational inference</div><div class="card-body">ELBO maximization is gradient descent on the KL between $q_\\phi(z)$ and the true posterior. Natural gradient on the variational family is dramatically faster.</div></div>
<div class="calc-card"><div class="card-title">Mirror descent</div><div class="card-body">Generalization of gradient descent that uses a Bregman divergence — for exponential families, equivalent to natural gradient in the dual coordinates. Used in online learning and bandit algorithms.</div></div>
<div class="calc-card"><div class="card-title">Bayesian deep learning</div><div class="card-body">Laplace approximation = Gaussian centered at MAP with covariance $I(\\theta_\\star)^{-1}$. Diagonal Fisher used as a cheap uncertainty estimator (Ritter 2018).</div></div>
</div>

<p class="l-text">A common 2026 pattern: train with Adam for the first 80% of a run (cheap, robust), switch to a Fisher-approximated method for the final fine-tune to squeeze out the last point of performance. This works because Adam's per-parameter second-moment estimate is itself a coarse diagonal-Fisher proxy — the precise methods just generalize that intuition.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and Track Wrap-Up</h2>
<p class="l-text">Information geometry equips the space of probability distributions with the right Riemannian structure. Fisher information is its metric, KL divergence is its local distance squared, the Cramer-Rao bound is its statement of curvature. Natural gradient is gradient descent under that geometry — invariant to reparameterization, often dramatically faster than Euclidean gradient descent, and the conceptual basis for K-FAC, Shampoo, NPG, mirror descent, and the second-order optimizers that show up at the frontier of deep learning.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>The set of distributions $\\{p_\\theta\\}$ is a manifold; Fisher $I(\\theta) = \\mathbb{E}[\\nabla\\log p\\, \\nabla\\log p^\\top]$ is its intrinsic metric.</li>
<li>Cramer-Rao: $\\mathrm{Cov}(\\hat\\theta) \\succeq I^{-1}/n$. The MLE asymptotically saturates it.</li>
<li>$\\mathrm{KL}(p_\\theta\\|p_{\\theta+d\\theta}) \\approx \\tfrac{1}{2} d\\theta^\\top I\\, d\\theta$ — KL is Fisher-quadratic locally.</li>
<li>Natural gradient $\\theta \\leftarrow \\theta - \\eta I^{-1} \\nabla L$. Reparameterization-invariant; step in distribution space.</li>
<li>Exponential families: $\\nabla A = \\mu$, $\\nabla^2 A = I$, KL = Bregman of $A$, MLE = moment matching.</li>
<li>Live in modern ML: K-FAC, NPG / TRPO / PPO, Shampoo, mirror descent, Laplace approximation.</li>
</ul>
</div>

<p class="l-text">This closes the math track at 9 lessons. You now have the full toolkit: linear algebra (L1), calculus (L2), probability (L3), optimization basics (L4), statistics (L5), numerical methods (L6), convex optimization (L7), Riemannian geometry (L8), and information geometry (L9). For depth in any one direction, the canonical books remain Strang for linear algebra, Boyd &amp; Vandenberghe for convex, Absil et al. for manifolds, and Amari for information geometry — all four worth more than any blog post or video on the topic.</p>
</div>`,
tr: `<p class="l-text"><strong>Bilgi geometrisi, bir olasılık dağılımları ailesine Riemann yapısı koyduğunda olan şeydir.</strong> Bir parametrik model $p_\\theta(x)$ verildiğinde, tüm erişilebilir $\\theta$ uzayı bir manifolddur. Bu manifold üzerinde doğru metrik Öklid değildir — $\\theta$'yı 0.01 hareket ettirmek, olabilirliğin $\\theta$'ya ne kadar duyarlı olduğuna bağlı olarak dağılımı bir yönde küçük, başka bir yönde çok büyük değiştirebilir. Duyarlılığı yakalayan metrik <strong>Fisher bilgi matrisi</strong>dir. Onunla donatıldığında, dağılımlar manifoldu jeodezikler, gradientler ve eğrilik miras alır; KL ıraksaklığı doğal yerel mesafe olur; ve gradient inişi <strong>doğal gradient</strong> olur. Shun-ichi Amari bu teoriyi 1980'ler-2000'lerde inşa etti; kanonik referans Amari'nin <em>Information Geometry and Its Applications</em>'ıdır (2016).</p>

<p class="l-text">Modern makine öğrenmesi için pratik kazanç tek bir güncelleme kuralı ve eğitim hakkında daha keskin bir düşünme şeklidir. Doğal gradient $\\theta \\leftarrow \\theta - \\eta\\, I(\\theta)^{-1} \\nabla L(\\theta)$ gradienti ters Fisher ile yeniden ölçeklendirir ve sonuç olarak yeniden parametreleştirmeye karşı değişmezdir — bir Gauss'u $(\\mu, \\sigma)$ veya $(\\mu, \\log \\sigma^2)$ ile parametreleştirsen aynı adım atılır. K-FAC, Shampoo ve 2020'lerin sonunda devasa dil modellerini eğitmek için kullanılan ikinci-mertebe optimize ediciler hep doğal gradient'in yaklaşımlarıdır. Bu derste skor fonksiyonundan Fisher'ı kuruyor, Cramer-Rao sınırını kanıtlıyor, ikinci mertebeden KL ↔ Fisher eşdeğerliğini türetiyor ve Gauss uydurma probleminde küçük bir doğal-gradient deneyi çalıştırıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Fisher bilgi matrisini skor fonksiyonundan ve log-olabilirliğin ikinci türevlerinden tanımlamak</li>
<li>Cramer-Rao sınırını ifade etmek ve kullanmak — sapmasız tahminci varyansının mutlak tabanı</li>
<li>$\\mathrm{KL}(p_\\theta \\| p_{\\theta + d\\theta}) \\approx \\tfrac{1}{2} d\\theta^\\top I(\\theta)\\, d\\theta$'nın ikinci mertebede sağlandığını türetmek</li>
<li>KL ıraksaklığını <code>scipy.special.rel_entr</code> ile sayısal olarak hesaplamak</li>
<li>Doğal gradient inişini uygulamak ve yeniden parametreleştirme değişmezliğini gözlemlemek</li>
<li>Üstel aileleri tanımak ve neden bilgi geometrisinin onlar için özellikle temiz olduğunu görmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. İstatistiksel Manifold</h2>
<p class="l-text">Yoğunlukların bir parametrik ailesini seç $\\{p_\\theta(x) : \\theta \\in \\Theta\\}$ — $(\\mu, \\sigma^2)$ ile indekslenmiş Gausslar, $p$ ile indekslenmiş Bernoullilar, logitler ile indekslenmiş softmax dağılımları, ağırlıklarıyla indekslenmiş bir sinir ağının koşullu dağılımı. Erişilebilir dağılımlar kümesi $\\mathcal{M} = \\{p_\\theta : \\theta \\in \\Theta\\}$ <strong>istatistiksel manifold</strong>dur. Manifold üzerindeki her nokta bir olasılık dağılımıdır; tanjant uzayındaki her yön "dağılımı hareket ettirmenin bir yolu"dur.</p>

<p class="l-text">$\\Theta$'yı düz Öklid olarak ele alıp $\\theta$'da gradient inişi çalıştırırsan, dağılımların geometrisini değil parametre uzayının geometrisini örtük olarak kullanıyorsun. Bu kesin bir anlamda dürüst değildir: $\\theta$'yı 0.01 değiştiren bir adım, $\\theta$'ya bağlı olarak $p_\\theta$'yı çok veya az değiştirebilir. Aynı aileyi yeniden parametreleştirmek — örn. $\\sigma$'dan $\\log \\sigma$'ya geçmek — dağılımdaki aynı fiziksel değişiklik için farklı bir gradient yönü verir. Bilgi geometrisi bunu manifolda içsel bir metrik vererek düzeltir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Skor fonksiyonu</div><div class="card-body">$s(x; \\theta) = \\nabla_\\theta \\log p_\\theta(x)$. $p_\\theta$ altında ortalama sıfır. Belirli bir örneklemde log-olabilirliğin $\\theta$'ya ne kadar duyarlı olduğunu ölçer.</div></div>
<div class="calc-card"><div class="card-title">Fisher bilgisi</div><div class="card-body">$I(\\theta) = \\mathbb{E}_{x \\sim p_\\theta}[s(x;\\theta)\\, s(x;\\theta)^\\top]$. Skorun kovaryansı. Eşdeğer olarak $-\\mathbb{E}[\\nabla^2 \\log p_\\theta(x)]$.</div></div>
<div class="calc-card"><div class="card-title">Riemann metriği</div><div class="card-body">Fisher istatistiksel manifold üzerinde metrik tensör olarak davranır: $\\langle u, v\\rangle_\\theta = u^\\top I(\\theta)\\, v$. Mesafe, jeodezikler ve eğrilik gelir.</div></div>
<div class="calc-card"><div class="card-title">Neden bu metrik?</div><div class="card-body">Chentsov teoremi (1972): Fisher metriği, bir istatistiksel manifold üzerinde yeterli istatistikler altında değişmez kalan <em>tek</em> Riemann metriğidir (ölçeğe kadar). Başka doğru cevap yoktur.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Fisher Bilgisi — Üç Eşdeğer Tanım</h2>
<p class="l-text">Düzgün log-olabilirliğe sahip pürüzsüz bir aile $p_\\theta(x)$ için, Fisher bilgi matrisi üç şekilde yazılabilir:</p>

<div class="katex-block">$$I(\\theta) = \\mathbb{E}\\bigl[(\\nabla_\\theta \\log p_\\theta)(\\nabla_\\theta \\log p_\\theta)^\\top\\bigr] = -\\mathbb{E}\\bigl[\\nabla^2_\\theta \\log p_\\theta\\bigr] = \\mathrm{Cov}_\\theta\\bigl[\\nabla_\\theta \\log p_\\theta\\bigr].$$</div>

<p class="l-text">Düzenlilik koşulları (pürüzsüzlük ve türev ile integralin yer değiştirebilmesi) sağlandığında üçü de eşittir. Birincisi hesaplamasaldır: bir dış-çarpım Monte Carlo tahmini. İkincisi log-olabilirliğin negatif beklenen Hessian'ıdır — optimize edicilerin gerçekten yaklaştırdığı şey. Üçüncüsü, skorun ortalama sıfır olduğu gerçeğini kullanarak (1)'in yeniden ifadesidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Bilinmeyen ortalama mu ve varyans sigma^2 ile Gauss.</span>
<span class="cm"># Kapalı form Fisher: I(mu, sigma^2) = diag(1/sigma^2, 1/(2 sigma^4))</span>
mu_true, sigma2_true = <span class="num">1.0</span>, <span class="num">4.0</span>
sigma_true = np.<span class="fn">sqrt</span>(sigma2_true)

<span class="cm"># Kapalı-form Fisher</span>
I_closed = np.<span class="fn">diag</span>([<span class="num">1</span>/sigma2_true, <span class="num">1</span>/(<span class="num">2</span>*sigma2_true**<span class="num">2</span>)])
<span class="fn">print</span>(<span class="str">"Kapalı-form Fisher I(mu, sigma^2):"</span>)
<span class="fn">print</span>(I_closed)

<span class="cm"># Skorların dış çarpımı aracılığıyla Monte Carlo</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
N = 200_000
x = rng.<span class="fn">normal</span>(mu_true, sigma_true, size=N)

<span class="cm"># theta = (mu, sigma^2) için skor vektörü</span>
<span class="cm"># d log p / d mu       = (x - mu) / sigma^2</span>
<span class="cm"># d log p / d sigma^2  = -1/(2 sigma^2) + (x - mu)^2 / (2 sigma^4)</span>
s_mu  = (x - mu_true) / sigma2_true
s_var = -<span class="num">1</span>/(<span class="num">2</span>*sigma2_true) + (x - mu_true)**<span class="num">2</span> / (<span class="num">2</span>*sigma2_true**<span class="num">2</span>)
S = np.<span class="fn">stack</span>([s_mu, s_var], axis=<span class="num">1</span>)            <span class="cm"># N x 2</span>
I_mc = (S.T @ S) / N
<span class="fn">print</span>(<span class="str">"\\nMonte Carlo Fisher (N = 200000):"</span>)
<span class="fn">print</span>(I_mc)
<span class="fn">print</span>(f<span class="str">"\\nMaks mutlak fark: {np.max(np.abs(I_mc - I_closed)):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Skor ortalaması (~0 olmalı): {S.mean(axis=0)}"</span>)
</code></pre></div>

<p class="l-text">Monte Carlo Fisher, $N=200{,}000$'de kapalı formla yüzde birkaç içinde eşleşir ve skor ortalaması esasen sıfırdır (akıl kontrolü — eğer öyle olmasaydı, modelde veya gradientte bir hatamız olurdu). Sinir ağları için Fisher tam olarak aynı şekilde hesaplanır: örnekle, log-olabilirliğin örnek başına gradientlerini hesapla, dış çarpımları al, ortala. K-FAC, bu dış çarpımı büyük katmanlar için izlenebilir kılma tekniğidir.</p>

<div id="plot-ml9-fisher-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  function ellipse(cx,cy,a,b){var xs=[],ys=[]; for(var i=0;i<=120;i++){var t=i*Math.PI*2/120; xs.push(cx+a*Math.cos(t)); ys.push(cy+b*Math.sin(t));} return {x:xs,y:ys};}
  var s2a=0.5, s2b=1.0, s2c=2.5;
  var k=0.6;
  var e1=ellipse(0,0, k*Math.sqrt(s2a), k*Math.sqrt(2*s2a*s2a));
  var e2=ellipse(0,0, k*Math.sqrt(s2b), k*Math.sqrt(2*s2b*s2b));
  var e3=ellipse(0,0, k*Math.sqrt(s2c), k*Math.sqrt(2*s2c*s2c));
  var t1={x:e1.x,y:e1.y,mode:"lines",name:"σ²=0.5 (keskin olabilirlik)",line:{color:"#4ade80",width:2.5},fill:"toself",fillcolor:"rgba(74,222,128,0.12)"};
  var t2={x:e2.x,y:e2.y,mode:"lines",name:"σ²=1.0",line:{color:"#c8a96e",width:2.5},fill:"toself",fillcolor:"rgba(200,169,110,0.12)"};
  var t3={x:e3.x,y:e3.y,mode:"lines",name:"σ²=2.5 (düz olabilirlik)",line:{color:"#f87171",width:2.5},fill:"toself",fillcolor:"rgba(248,113,113,0.10)"};
  var layout={title:{text:"N(μ,σ²) için ters-Fisher (CRB) elipsleri: σ² büyüdükçe belirsizlik büyür",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"μ ekseni (parametre 1)",font:{color:"#ebe6dc"}},range:[-3.5,3.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"σ² ekseni (parametre 2)",font:{color:"#ebe6dc"}},range:[-5,5],scaleanchor:"x"},margin:{t:40,r:20,b:50,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"}}};
  Plotly.newPlot("plot-ml9-fisher-tr",[t3,t2,t1],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Her elips ters Fisher I(μ,σ²)⁻¹'dir — Gaussian için tahminci kovaryansının Cramer-Rao alt sınırı. Küçük σ² (yeşil) keskin tepeli olabilirlik ve sıkı tahminci anlamına gelir: elips küçüktür. Büyük σ² (kırmızı) düz olabilirlik ve gevşek tahminci anlamına gelir: elips şişer, özellikle σ² ekseninde belirsizlik 2σ⁴ gibi büyür. Elipsin şekli istatistiksel manifoldun geometrisidir.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Cramer-Rao Sınırı</h2>
<p class="l-text">$n$ örnekten $\\theta$'nın herhangi bir sapmasız tahmincisi $\\hat{\\theta}$ için, kovaryans aşağıda ters Fisher bilgisiyle sınırlanır:</p>

<div class="katex-block">$$\\mathrm{Cov}(\\hat{\\theta}) \\succeq \\frac{1}{n}\\, I(\\theta)^{-1}.$$</div>

<p class="l-text">Hiçbir sapmasız tahminci daha iyisini yapamaz. MLE asimptotik olarak eşitliğe ulaşır (<em>verimli</em>dir). Bu tek sınır istatistiksel verimliliğin tüm teorisini destekler: sana mutlak hassasiyet tabanını söyler ve MLE'nin büyük $n$ için zaten orada olduğunu söyler — hiçbir akıllı yeni tahminci onu yenemez.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># n örnekten N(mu, sigma^2=1)'in mu'sunu tahmin et; Var(mu_hat) üzerinde CR sınırı 1/n'dir.</span>
n = <span class="num">100</span>
trials = <span class="num">5000</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)
mu_true = <span class="num">0.0</span>

mu_hat = rng.<span class="fn">normal</span>(mu_true, <span class="num">1.0</span>, size=(trials, n)).<span class="fn">mean</span>(axis=<span class="num">1</span>)
empirical_var = mu_hat.<span class="fn">var</span>(ddof=<span class="num">1</span>)
crb = <span class="num">1.0</span> / n

<span class="fn">print</span>(f<span class="str">"Var(mu_hat) üzerinde Cramer-Rao sınırı:       {crb:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"{trials} deneme üzerinde ampirik Var(mu_hat): {empirical_var:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"Oran ampirik / sınır = {empirical_var/crb:.3f}  (MLE sınırı doyurur)"</span>)

<span class="cm"># Yanlı bir tahminci daha düşük varyansa sahip olabilir — ama yanlılık pahasına.</span>
<span class="cm"># Örn. büzülme: mu_hat_s = alpha * örnek ortalaması</span>
alpha = <span class="num">0.8</span>
mu_hat_s = alpha * mu_hat
<span class="fn">print</span>(f<span class="str">"\\nBüzülme tahmincisi (alpha={alpha}):"</span>)
<span class="fn">print</span>(f<span class="str">"  Var = {mu_hat_s.var():.6f}  (daha düşük, ama yanlı)"</span>)
<span class="fn">print</span>(f<span class="str">"  Bias^2 = {(mu_hat_s.mean() - mu_true)**2:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"  MSE = Var + Bias^2 = {mu_hat_s.var() + (mu_hat_s.mean() - mu_true)**2:.6f}"</span>)
<span class="fn">print</span>(<span class="str">"CRB yalnızca SAPMASIZ tahmincilere uygulanır. Yanlı olanlar MSE'de onu yenebilir."</span>)
</code></pre></div>

<p class="l-text">İki çıkarım. Birincisi, örnek-ortalaması MLE CRB'yi $1/n$'de doyurur — varyansı örnekleme gürültüsü içinde sınıra eşittir. İkincisi, yanlı tahminciler (büzülme, ridge, düzenlileştirilmiş MLE) varyansı küçük bir yanlılıkla takas ederek sapmasız tahminciler için CRB'nin izin verdiğinden daha düşük MSE'ye sahip olabilir. James-Stein, ridge regresyonu ve modern hiyerarşik modellerin kalbindeki ampirik Bayes büzülmesi hep o uzayda yaşar.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. KL Iraksaklığı ve Yerel Yaklaşımı</h2>
<p class="l-text">Kullback-Leibler ıraksaklığı dağılımlar arasındaki asimetrik "mesafe"dir:</p>

<div class="katex-block">$$\\mathrm{KL}(p \\| q) = \\mathbb{E}_{x \\sim p}\\!\\left[\\log \\tfrac{p(x)}{q(x)}\\right] = \\sum_x p(x)\\,\\log \\tfrac{p(x)}{q(x)}.$$</div>

<p class="l-text">Daima negatif olmayan (Gibbs eşitsizliği), $p = q$ ise sıfır, ama simetrik değil ve metrik değil. Yine de yakın dağılımlar $p_\\theta$ ve $p_{\\theta + d\\theta}$ için, KL yerel olarak bir metriğe dönüşür — ve o metrik tam olarak Fisher'dır:</p>

<div class="katex-block">$$\\mathrm{KL}(p_\\theta \\| p_{\\theta + d\\theta}) = \\frac{1}{2}\\, d\\theta^\\top I(\\theta)\\, d\\theta + O(\\|d\\theta\\|^3).$$</div>

<p class="l-text">Bu, bilgi teorisi (KL) ile bilgi geometrisi (Fisher) arasındaki köprüdür. İstatistiksel manifold üzerinde Fisher ile ölçülen mesafeler, ikinci mertebeden standart "log-olabilirlik oranı" mesafesine uyar. Fisher'ın "doğru" metrik olmasının nedeni budur — yakından KL'nin nasıl göründüğü.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.special <span class="kw">import</span> rel_entr

<span class="cm"># 5 sonuç üzerinde iki kategorik dağılım arasında KL</span>
p = np.<span class="fn">array</span>([<span class="num">0.1</span>, <span class="num">0.2</span>, <span class="num">0.3</span>, <span class="num">0.25</span>, <span class="num">0.15</span>])
q = np.<span class="fn">array</span>([<span class="num">0.12</span>, <span class="num">0.18</span>, <span class="num">0.32</span>, <span class="num">0.22</span>, <span class="num">0.16</span>])

kl_pq = np.<span class="fn">sum</span>(<span class="fn">rel_entr</span>(p, q))   <span class="cm"># rel_entr(p,q) = p * log(p/q) eleman-bazında</span>
kl_qp = np.<span class="fn">sum</span>(<span class="fn">rel_entr</span>(q, p))
<span class="fn">print</span>(f<span class="str">"KL(p||q) = {kl_pq:.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"KL(q||p) = {kl_qp:.6f}    (asimetrik)"</span>)

<span class="cm"># Fisher = KL'nin yerel Hessian'ı olduğunu doğrula.</span>
<span class="cm"># theta = ilk 4 olasılık ile kategorik (sonu sum=1 ile sabit). Atla — Gauss kullan.</span>
<span class="cm"># Gauss: KL(N(0,1) || N(d, 1)) = d^2 / 2.  Fisher I = 1, yani 0.5 * d * I * d = d^2/2. Eşleşir.</span>
<span class="fn">print</span>(<span class="str">"\\nGauss yerel kontrolü: KL(N(0,1) || N(d,1)) = d^2/2  vs  0.5 * d^T I d (I=1)"</span>)
<span class="kw">for</span> d <span class="kw">in</span> [<span class="num">0.01</span>, <span class="num">0.05</span>, <span class="num">0.1</span>, <span class="num">0.5</span>]:
    kl_exact = d**<span class="num">2</span> / <span class="num">2</span>
    fisher_quad = <span class="num">0.5</span> * d * <span class="num">1.0</span> * d
    <span class="fn">print</span>(f<span class="str">"  d={d:.3f}   KL_kesin={kl_exact:.6f}   Fisher kuadratik={fisher_quad:.6f}"</span>)

<span class="cm"># Asimetri vs simetrik Jensen-Shannon</span>
m = <span class="num">0.5</span> * (p + q)
js = <span class="num">0.5</span> * np.<span class="fn">sum</span>(<span class="fn">rel_entr</span>(p, m)) + <span class="num">0.5</span> * np.<span class="fn">sum</span>(<span class="fn">rel_entr</span>(q, m))
<span class="fn">print</span>(f<span class="str">"\\nJensen-Shannon (simetrik): JS(p,q) = {js:.6f}"</span>)
</code></pre></div>

<p class="l-text">Gauss $\\mathcal{N}(0,1) \\to \\mathcal{N}(d, 1)$ için, $\\mathrm{KL} = d^2/2$ tam olarak, Fisher $I = 1$ ile $\\tfrac{1}{2} d \\cdot I \\cdot d$ ile eşleşir. KL ↔ Fisher karşılığı ikinci mertebede kesindir; daha yüksek mertebe terimler modele özgüdür. Jensen-Shannon ıraksaklığı, $m = (p+q)/2$ ile $\\mathrm{KL}(p \\| m)$ ve $\\mathrm{KL}(q \\| m)$'yi ortalayarak KL'yi simetrikleştirir — orijinal GAN kaybının minimize ettiği şey budur.</p>

<div id="plot-ml9-kl-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  function klPQ(mu2, s2){var s1=1.0; return Math.log(s2/s1) + (s1*s1 + mu2*mu2)/(2*s2*s2) - 0.5;}
  function klQP(mu2, s2){var s1=1.0; return Math.log(s1/s2) + (s2*s2 + mu2*mu2)/(2*s1*s1) - 0.5;}
  var mus=[],logs=[];
  for(var i=0;i<=40;i++){mus.push(-2.0 + 4.0*i/40);}
  for(var j=0;j<=40;j++){logs.push(-1.0 + 2.0*j/40);}
  var z1=[], z2=[];
  for(var j=0;j<logs.length;j++){var row1=[],row2=[]; var s2=Math.exp(logs[j]);
    for(var i=0;i<mus.length;i++){row1.push(klPQ(mus[i],s2)); row2.push(klQP(mus[i],s2));}
    z1.push(row1); z2.push(row2);
  }
  var c1={x:mus,y:logs,z:z1,type:"contour",name:"KL(p‖q)",colorscale:[[0,"rgba(74,222,128,0)"],[1,"rgba(74,222,128,0.85)"]],contours:{coloring:"lines",start:0.1,end:3,size:0.4},line:{width:2},showscale:false};
  var c2={x:mus,y:logs,z:z2,type:"contour",name:"KL(q‖p)",colorscale:[[0,"rgba(248,113,113,0)"],[1,"rgba(248,113,113,0.85)"]],contours:{coloring:"lines",start:0.1,end:3,size:0.4},line:{width:2,dash:"dash"},showscale:false};
  var layout={title:{text:"KL asimetrisi: düz çizgi = KL(p‖q), kesik = KL(q‖p)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",title:{text:"μ_q (q'nun ortalaması; p sabit N(0,1))",font:{color:"#ebe6dc"}}},yaxis:{gridcolor:"rgba(255,255,255,0.05)",title:{text:"log σ_q",font:{color:"#ebe6dc"}}},margin:{t:40,r:20,b:55,l:65},annotations:[{x:0,y:0,text:"p=q (KL=0)",showarrow:true,arrowhead:2,ax:30,ay:-40,font:{color:"#c8a96e",size:12},arrowcolor:"#c8a96e"}]};
  Plotly.newPlot("plot-ml9-kl-tr",[c1,c2],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Her iki KL yönü de p=q'da (orijin) sıfırlanır. Ama konturlar <em>farklı şekillerdedir</em>: KL(p‖q) (düz yeşil) q'nun kuyruklarının çok dar olmasını cezalandırır (mod-kapsayıcı), KL(q‖p) (kesik kırmızı) ise q'nun p'nin olmadığı yere kütle koymasını cezalandırır (mod-arayıcı). Varyasyonel çıkarım (VI) KL(q‖p)'yi minimize eder ve böylece kompakt posteriorlar üretir; expectation-propagation KL(p‖q)'yu minimize eder ve daha geniş olanları üretmeye eğilimlidir. Bu asimetri yaklaşık çıkarımın tüm alanını şekillendirir.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Doğal Gradient</h2>
<p class="l-text">Fisher metriği altında parametre manifoldu üzerinde en dik iniş <strong>doğal gradient</strong>tir. Standart gradient inişi "$\\|d\\theta\\|^2 \\leq r$ kısıtı altında $L(\\theta + d\\theta)$'yı minimize et"i çözerken, doğal gradient "$\\mathrm{KL}(p_\\theta \\| p_{\\theta + d\\theta}) \\leq r$ kısıtı altında $L(\\theta + d\\theta)$'yı minimize et"i çözer. Kısıt $d\\theta^\\top I(\\theta)\\, d\\theta \\leq 2r$ olur ve optimal yön</p>

<div class="katex-block">$$\\theta \\leftarrow \\theta - \\eta\\, I(\\theta)^{-1}\\, \\nabla L(\\theta).$$</div>

<p class="l-text">İki sonuç. (i) <strong>Yeniden parametreleştirme değişmezliği:</strong> parametreleri $\\theta \\to \\phi = g(\\theta)$ olarak değiştirirsen, doğal gradient dağılım uzayında aynı adımı atar. Standart gradient inişi atmaz. (ii) Adım boyutu $\\eta$ artık parametre birimlerinde değil <em>dağılım birimlerinde</em>dir — çok farklı parametreleştirmeler için aynı $\\eta$'yı kullanabilirsin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Maksimum olabilirlik aracılığıyla bir Gauss N(mu, sigma^2)'yi veriye uydur.</span>
<span class="cm"># Negatif log-olabilirliğin standart gradient inişini doğal gradient inişine karşı karşılaştır.</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
mu_true, sigma2_true = <span class="num">3.0</span>, <span class="num">2.0</span>
N = <span class="num">1000</span>
data = rng.<span class="fn">normal</span>(mu_true, np.<span class="fn">sqrt</span>(sigma2_true), size=N)

<span class="kw">def</span> <span class="fn">nll</span>(theta):
    mu, s2 = theta
    <span class="kw">if</span> s2 &lt;= <span class="num">0</span>: <span class="kw">return</span> np.inf
    <span class="kw">return</span> <span class="num">0.5</span> * np.<span class="fn">log</span>(<span class="num">2</span>*np.pi*s2) + <span class="num">0.5</span> * np.<span class="fn">mean</span>((data - mu)**<span class="num">2</span>) / s2

<span class="kw">def</span> <span class="fn">grad_nll</span>(theta):
    mu, s2 = theta
    g_mu = -np.<span class="fn">mean</span>(data - mu) / s2
    g_s2 = <span class="num">0.5</span> / s2 - <span class="num">0.5</span> * np.<span class="fn">mean</span>((data - mu)**<span class="num">2</span>) / s2**<span class="num">2</span>
    <span class="kw">return</span> np.<span class="fn">array</span>([g_mu, g_s2])

<span class="kw">def</span> <span class="fn">fisher</span>(theta):
    _, s2 = theta
    <span class="kw">return</span> np.<span class="fn">diag</span>([<span class="num">1</span>/s2, <span class="num">1</span>/(<span class="num">2</span>*s2**<span class="num">2</span>)])

<span class="cm"># Standart GD</span>
theta_std = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">1.0</span>])
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    theta_std = theta_std - <span class="num">0.05</span> * <span class="fn">grad_nll</span>(theta_std)

<span class="cm"># Doğal GD</span>
theta_nat = np.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">1.0</span>])
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    g = <span class="fn">grad_nll</span>(theta_nat)
    F = <span class="fn">fisher</span>(theta_nat)
    theta_nat = theta_nat - <span class="num">0.5</span> * np.linalg.<span class="fn">solve</span>(F, g)

<span class="fn">print</span>(f<span class="str">"Gerçek (mu, sigma^2):   ({mu_true}, {sigma2_true})"</span>)
<span class="fn">print</span>(f<span class="str">"Standart GD 50 adımdan sonra: ({theta_std[0]:.4f}, {theta_std[1]:.4f})  nll={nll(theta_std):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Doğal GD 50 adımdan sonra:  ({theta_nat[0]:.4f}, {theta_nat[1]:.4f})  nll={nll(theta_nat):.4f}"</span>)
<span class="fn">print</span>(<span class="str">"\\nDoğal gradient varyansta daha hızlı yakınsar çünkü Fisher yeniden ölçeklendirmesi"</span>)
<span class="fn">print</span>(<span class="str">"sigma^2'nin dağılım üzerindeki birim başına daha küçük etkisini hesaba katar."</span>)
</code></pre></div>

<p class="l-text">Standart GD varyans boyutunda yakınsamak için çok daha uzun sürer çünkü $\\sigma^2$'nin $\\mu$'dan farklı birimleri ve duyarlılığı vardır — $\\mu$ için doğru olan adım boyutu $\\sigma^2$ için yanlıştır. Doğal GD Fisher ile yeniden ölçeklendirir ve her iki boyuta da doğru şekilde davranır, sabit $\\eta$ ile standart GD'nin 500 adıma ihtiyaç duyacağı yerde 50 adımda yakınsar. Tuzak, $I(\\theta)^{-1}$'in pahalı olmasıdır: $10^9$ parametreli bir model için imkansızdır. K-FAC, Shampoo ve benzer yöntemler tam Fisher'ı bir Kronecker-çarpanına ayrılmış veya blok-köşegen yaklaşımla değiştirir, faydanın çoğunu izlenebilir maliyetle geri kazanır.</p>

<div id="plot-ml9-natgrad-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  function ellipse(cx,cy,a,b){var xs=[],ys=[]; for(var i=0;i<=120;i++){var t=i*Math.PI*2/120; xs.push(cx+a*Math.cos(t)); ys.push(cy+b*Math.sin(t));} return {x:xs,y:ys};}
  var traces=[];
  var levels=[0.5,1.0,1.5,2.0,2.5];
  for(var k=0;k<levels.length;k++){var L=levels[k]; var e=ellipse(0,0,L,L*0.25);
    traces.push({x:e.x,y:e.y,mode:"lines",line:{color:"rgba(235,230,220,0.32)",width:1.2},showlegend:false,hoverinfo:"skip"});
  }
  var sx=2.2, sy=0.5;
  var gx_v = sx/2.0, gy_v = 8.0*sy;
  var nv = Math.sqrt(gx_v*gx_v+gy_v*gy_v); gx_v/=nv; gy_v/=nv;
  var vanilla={x:[sx, sx-1.5*gx_v], y:[sy, sy-1.5*gy_v], mode:"lines+markers", name:"vanilya gradient (parametre uzayı)", line:{color:"#f87171",width:3}, marker:{size:[10,12],color:"#f87171",symbol:["circle","arrow-up"]}};
  var ngx = sx, ngy = sy;
  var nn = Math.sqrt(ngx*ngx+ngy*ngy); ngx/=nn; ngy/=nn;
  var nat={x:[sx, sx-1.5*ngx], y:[sy, sy-1.5*ngy], mode:"lines+markers", name:"doğal gradient (dağılım uzayı)", line:{color:"#4ade80",width:3.5}, marker:{size:[0,12],color:"#4ade80",symbol:"arrow-up"}};
  var startMark={x:[sx],y:[sy],mode:"markers+text",text:["başlangıç"],textposition:"top right",marker:{size:11,color:"#c8a96e"},textfont:{color:"#ebe6dc",size:12},showlegend:false};
  var optMark={x:[0],y:[0],mode:"markers+text",text:["optimum"],textposition:"top right",marker:{size:13,color:"#c8a96e",symbol:"star"},textfont:{color:"#c8a96e",size:12},showlegend:false};
  var data=traces.concat([vanilla,nat,startMark,optMark]);
  var layout={title:{text:"Anizotropik kayıpta vanilya vs doğal gradient",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"θ₁ (iyi ölçeklenmiş)",font:{color:"#ebe6dc"}},range:[-3,3]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"θ₂ (keskin eğri)",font:{color:"#ebe6dc"}},range:[-1.2,1.6],scaleanchor:"x"},margin:{t:40,r:20,b:55,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.02}};
  Plotly.newPlot("plot-ml9-natgrad-tr",data,layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Gri elipsler anizotropik bir kaybın seviye kümeleridir — θ₂ boyunca θ₁'den çok daha keskindir. Kırmızı vanilya gradient neredeyse dikey gösterir çünkü dik θ₂ türevi baskındır: standart GD minimuma küçük bir adım atar ve zikzak yapar. Yeşil doğal gradient I⁻¹∇L doğrudan optimuma işaret eder çünkü Fisher her boyutu kendi eğriliğine göre yeniden ölçeklendirir. Dağılım uzayında aynı yön, parametre uzayında çok farklı yön — doğal gradientin tüm amacı budur.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Üstel Aileler — Geometrinin En Temiz Olduğu Yer</h2>
<p class="l-text">Bir <strong>üstel aile</strong> şu formdaki yoğunluklara sahiptir:</p>

<div class="katex-block">$$p_\\theta(x) = h(x)\\, \\exp\\bigl(\\theta^\\top T(x) - A(\\theta)\\bigr),$$</div>

<p class="l-text">burada $T(x)$ yeterli istatistik ve $A(\\theta) = \\log \\int h(x) e^{\\theta^\\top T(x)} dx$ log-bölüşüm fonksiyonudur. Gauss, Bernoulli, kategorik, Poisson, gamma, beta, üstel, multinomial, Dirichlet — hepsi üstel ailelerdir. Doğrusal logitli softmax sınıflandırıcısı (kategorik) ve Boltzmann makinesi de öyle.</p>

<p class="l-text">Bir üstel aile için, bilgi geometrisi zarif özdeşliklere indirgenir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ortalama = log-bölüşümün gradienti</div><div class="card-body">$\\mathbb{E}_\\theta[T(x)] = \\nabla A(\\theta) = \\mu$. Doğal parametreler $\\theta$ ve ortalama parametreler $\\mu$ ikili koordinatlardır.</div></div>
<div class="calc-card"><div class="card-title">Fisher = log-bölüşümün Hessian'ı</div><div class="card-body">$I(\\theta) = \\nabla^2 A(\\theta) = \\mathrm{Cov}_\\theta[T(x)]$. Fisher metriği sadece $A$'nın Hessian'ıdır.</div></div>
<div class="calc-card"><div class="card-title">KL = Bregman ıraksaklığı</div><div class="card-body">$\\mathrm{KL}(p_\\theta \\| p_{\\theta'}) = A(\\theta') - A(\\theta) - \\nabla A(\\theta)^\\top (\\theta' - \\theta)$. $A$'nın Bregman ıraksaklığı.</div></div>
<div class="calc-card"><div class="card-title">MLE = momentler yöntemi</div><div class="card-body">Bir üstel aile için maksimum olabilirlik: $\\mathbb{E}_\\theta[T(x)] = \\bar{T}(\\text{veri})$ olacak şekilde $\\theta$'yı seç. Yeterli istatistiğin örnek ortalamasını eşleştir.</div></div>
</div>

<div class="calc-highlight"><strong>Modern ML'de neden önemli:</strong> enerji-tabanlı model literatürü, varyasyonel çıkarım, kontrastif ıraksaklık ve olasılıksal grafik modellerinin çoğu üstel-aile çerçevesinin içinde yaşar. Biri "model bir üstel ailede" dediğinde, yukarıdaki dört maddenin emrinde olduğunu kasteder — ve bu çok şeydir.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Modern ML'de Bu Nerede Görünüyor</h2>
<p class="l-text">Bilgi geometrisi niş bir konu değildir — çok büyük modelleri eğiten birkaç tekniğin omurgasıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K-FAC (Martens &amp; Grosse 2015)</div><div class="card-body">Bir sinir ağının Fisher'ını katman başına Kronecker çarpımı olarak yaklaşıklar. Adım başına daha fazla hesaplama maliyetiyle Adam'dan daha az adımda büyük convnet'leri ve transformer'ları eğitmek için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Doğal Politika Gradienti (Kakade 2001)</div><div class="card-body">Politika dağılımının Fisher'ını kullanan RL politika güncellemesi. TRPO ve PPO basitleştirilmiş torunlardır. RL track'imizde rl-L7'de işlenir.</div></div>
<div class="calc-card"><div class="card-title">Shampoo / Distributed Shampoo</div><div class="card-body">Doğal gradient ile ilişkili blok-bazlı ön-koşullandırıcı. Google'ın büyük eğitim çalışmalarına (PaLM, Gemini) 2023–2025'te güç verdi.</div></div>
<div class="calc-card"><div class="card-title">Varyasyonel çıkarım</div><div class="card-body">ELBO maksimizasyonu, $q_\\phi(z)$ ile gerçek posterior arasındaki KL üzerinde gradient inişidir. Varyasyonel aile üzerinde doğal gradient çarpıcı şekilde daha hızlıdır.</div></div>
<div class="calc-card"><div class="card-title">Ayna inişi</div><div class="card-body">Bir Bregman ıraksaklığını kullanan gradient inişinin genelleştirmesi — üstel aileler için, ikili koordinatlarda doğal gradient'e eşdeğerdir. Çevrimiçi öğrenme ve bandit algoritmalarında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Bayesçi derin öğrenme</div><div class="card-body">Laplace yaklaşımı = MAP'te merkezlenmiş, kovaryans $I(\\theta_\\star)^{-1}$ olan Gauss. Köşegen Fisher ucuz bir belirsizlik tahmincisi olarak kullanılır (Ritter 2018).</div></div>
</div>

<p class="l-text">Yaygın bir 2026 kalıbı: bir çalışmanın ilk %80'inde Adam ile eğit (ucuz, sağlam), son ince ayarda son performans noktasını sıkıştırmak için Fisher-yaklaşımlı bir yönteme geç. Bu işe yarar çünkü Adam'ın parametre başına ikinci-moment tahmini kendi başına kaba bir köşegen-Fisher proxy'sidir — kesin yöntemler bu sezgiyi genelleştirir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Track Kapanışı</h2>
<p class="l-text">Bilgi geometrisi olasılık dağılımları uzayını doğru Riemann yapısıyla donatır. Fisher bilgisi onun metriğidir, KL ıraksaklığı yerel mesafe karesidir, Cramer-Rao sınırı eğrilik ifadesidir. Doğal gradient, bu geometri altında gradient inişidir — yeniden parametreleştirmeye değişmez, sıklıkla Öklid gradient inişinden çarpıcı şekilde daha hızlıdır ve K-FAC, Shampoo, NPG, ayna inişi ve derin öğrenmenin sınırında ortaya çıkan ikinci-mertebe optimize edicilerin kavramsal temelidir.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Dağılımların kümesi $\\{p_\\theta\\}$ bir manifolddur; Fisher $I(\\theta) = \\mathbb{E}[\\nabla\\log p\\, \\nabla\\log p^\\top]$ onun içsel metriğidir.</li>
<li>Cramer-Rao: $\\mathrm{Cov}(\\hat\\theta) \\succeq I^{-1}/n$. MLE asimptotik olarak doyurur.</li>
<li>$\\mathrm{KL}(p_\\theta\\|p_{\\theta+d\\theta}) \\approx \\tfrac{1}{2} d\\theta^\\top I\\, d\\theta$ — KL yerel olarak Fisher-kuadratiktir.</li>
<li>Doğal gradient $\\theta \\leftarrow \\theta - \\eta I^{-1} \\nabla L$. Yeniden parametreleştirmeye değişmez; dağılım uzayında adım.</li>
<li>Üstel aileler: $\\nabla A = \\mu$, $\\nabla^2 A = I$, KL = $A$'nın Bregman'ı, MLE = moment eşleştirmesi.</li>
<li>Modern ML'de yaşar: K-FAC, NPG / TRPO / PPO, Shampoo, ayna inişi, Laplace yaklaşımı.</li>
</ul>
</div>

<p class="l-text">Bu, math track'ini 9 derste kapatır. Artık tam araç setine sahipsin: doğrusal cebir (L1), kalkülüs (L2), olasılık (L3), optimizasyon temelleri (L4), istatistik (L5), sayısal yöntemler (L6), konveks optimizasyon (L7), Riemann geometrisi (L8) ve bilgi geometrisi (L9). Herhangi bir yönde derinlik için, kanonik kitaplar doğrusal cebir için Strang, konveks için Boyd &amp; Vandenberghe, manifoldlar için Absil et al. ve bilgi geometrisi için Amari'dir — dördü de konu hakkında herhangi bir blog yazısı veya videodan daha değerli.</p>
</div>`
};
