window.MARKOV_L5 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Variational Inference (VI) is the practical Bayesian engine of the modern deep-learning era.</strong> MCMC (Lesson 3) gave us a way to sample from arbitrary posteriors exactly — but slowly, one Markov chain step at a time, on a single posterior. The moment our model contains millions of neural-network weights and our dataset has tens of millions of points, MCMC stops scaling. VI rephrases the question. Instead of "draw samples from the true posterior," it asks "find the closest tractable distribution to the true posterior, by gradient descent." That single reframing — integration as optimization — is what powers Variational Autoencoders, Normalizing Flows, Bayesian neural networks, modern topic models, and the entire family of latent-variable generative models that culminate in today's diffusion stack.</p>

<p class="l-text">In this lesson we derive the Evidence Lower BOund (ELBO) from KL minimization, walk through the mean-field approximation and Coordinate Ascent VI (CAVI) on Bayesian linear regression where we can compare to an analytical posterior, work through the reparameterization trick that unlocked end-to-end backpropagation through stochastic samples (Kingma-Welling 2014), build a full VAE objective, examine β-VAE for disentanglement, and finally point at Normalizing Flows as the way to escape mean-field's mode-collapse. The Pyodide exercise at the end implements a tiny VAE on a 2D synthetic dataset using nothing but NumPy — no PyTorch, no autograd, just the math we derived.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the Evidence Lower BOund (ELBO) line-by-line from the KL formulation and explain why maximizing ELBO is equivalent to minimizing reverse KL</li>
<li>Implement Coordinate Ascent Variational Inference (CAVI) for a mean-field posterior and recognise where mean-field over-confidently collapses</li>
<li>Apply the reparameterization trick to obtain low-variance pathwise gradients through stochastic samples</li>
<li>Read and write the full VAE objective, decompose it into reconstruction and KL terms, and identify what the encoder and decoder each contribute</li>
<li>Tune β in a β-VAE to trade reconstruction fidelity for latent disentanglement</li>
<li>Connect normalizing flows, planar flows, and the continuous-time flow of Diffeq L8 as ways to enrich q beyond a factorized Gaussian</li>
<li>Choose between VI and MCMC for a real problem based on data size, posterior shape, and downstream task</li>
</ul>
</div>

<h2 class="lesson-title">1. The Intractable Posterior — Where Bayes' Rule Breaks Down</h2>

<div class="calc-highlight"><strong>The everyday picture.</strong> Bayes' rule looks innocent — multiply prior times likelihood, divide by a normalizer. But that normalizer is an integral over <em>the entire latent space</em>. For a Bayesian neural network with a million weights it is a million-dimensional integral. Nobody knows how to compute that. VI is the trick that lets us proceed anyway.</div>

<p class="l-text">Bayes' theorem gives the posterior:</p>

<div class="calc-formula"><div class="formula-label">BAYES, TRUE POSTERIOR</div><div class="formula-main">$$p(z \\mid x) \\;=\\; \\frac{p(x \\mid z)\\, p(z)}{p(x)}, \\qquad p(x) \\;=\\; \\int p(x \\mid z)\\, p(z)\\, dz$$</div><div class="formula-sub">Numerator: likelihood times prior, both cheap. Denominator: a high-dimensional integral, the evidence p(x), the marginal likelihood. This is the hard part.</div></div>

<p class="l-text">The marginal likelihood $p(x)$ requires an integral over the full latent space. For a 2D mixture model with conjugate priors the integral has a closed form; for a Gaussian mixture with K components and N data points it has a sum of $K^N$ terms (intractable); for a deep network with millions of weights it is a million-dimensional integral with no closed form. MCMC (Lesson 3) sidesteps the integral entirely by sampling, but each sample costs at least one full pass through the data. <strong>Variational Inference takes a different route: replace the integration problem with an optimization problem.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Closed-form posterior</div><div class="card-body">Conjugate priors (Beta-Binomial, Gauss-Gauss, Dirichlet-Multinomial). Exact, no inference needed. Rare in modern ML.</div></div>
<div class="calc-card"><div class="card-title">MCMC (Lesson 3)</div><div class="card-body">Asymptotically exact samples. Slow. Hard to know when chain has converged. Standard for small clinical-trial-scale models.</div></div>
<div class="calc-card"><div class="card-title">Variational Inference</div><div class="card-body">Fast, scales to billions of data points. Approximation only — quality depends on choice of variational family.</div></div>
<div class="calc-card"><div class="card-title">Laplace approximation</div><div class="card-body">Fit a Gaussian at the MAP. One-step closed form. Crude but cheap; baseline for Bayesian neural nets (MacKay 1992).</div></div>
</div>

<h2 class="lesson-title">2. The Core Idea — Optimization, Not Integration</h2>

<p class="l-text">Pick a family $\\mathcal{Q}$ of <em>tractable</em> distributions — factorized Gaussians, mixtures of Gaussians, parametric distributions output by a neural network. Find the member $q^\\ast(z) \\in \\mathcal{Q}$ closest to the true posterior $p(z \\mid x)$. "Closest" is measured by Kullback-Leibler divergence:</p>

<div class="calc-formula"><div class="formula-label">VI OBJECTIVE</div><div class="formula-main">$$q^\\ast \\;=\\; \\arg\\min_{q \\in \\mathcal{Q}}\\; \\mathrm{KL}\\!\\left(q(z) \\,\\|\\, p(z \\mid x)\\right)$$</div><div class="formula-sub">Pick the q that is closest to the true posterior in KL distance. The unknown p(z|x) is exactly what makes this hard — but we will route around it via ELBO.</div></div>

<p class="l-text">We trade exactness for scalability. The Markov chain disappears; gradient descent appears. For a posterior with 10 million dimensions, MCMC needs tens of millions of sequential steps just to mix; VI parameterises $q$ with a few thousand variational parameters and optimizes by SGD. This is why every Bayesian-flavoured deep model trained since 2014 — VAEs, β-VAEs, Bayesian dropout (Gal-Ghahramani 2016), variational RNNs, deep latent variable models — uses VI rather than MCMC.</p>

<div class="l-note"><strong>One sentence:</strong> VI replaces "sample from the posterior" with "find the closest tractable distribution to the posterior, by optimization."</div>

<h2 class="lesson-title">3. KL Divergence — Properties and Direction Matter</h2>

<p class="l-text">For two distributions $q$ and $p$, Kullback-Leibler divergence is:</p>

<div class="calc-formula"><div class="formula-label">KL DIVERGENCE</div><div class="formula-main">$$\\mathrm{KL}(q \\,\\|\\, p) \\;=\\; \\mathbb{E}_{z \\sim q}\\!\\left[\\log \\frac{q(z)}{p(z)}\\right] \\;=\\; \\int q(z)\\, \\log\\frac{q(z)}{p(z)}\\, dz \\;\\geq\\; 0$$</div><div class="formula-sub">Non-negative (Gibbs' inequality). Zero iff q = p almost everywhere. Asymmetric — KL(q||p) and KL(p||q) are generally different quantities with different optima.</div></div>

<p class="l-text">The asymmetry is the central practical fact. The two directions optimize for different things:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forward KL: KL(p || q)</div><div class="card-body"><strong>Mass-covering.</strong> Penalises q for assigning low density wherever p has mass. Result: q spreads out to cover all modes of p, even at the cost of putting mass in low-density valleys. Used by maximum likelihood when fitting q to samples from p.</div></div>
<div class="calc-card"><div class="card-title">Reverse KL: KL(q || p)</div><div class="card-body"><strong>Mode-seeking.</strong> Penalises q heavily for putting mass where p is small. Result: q collapses to one mode of a multimodal p rather than smearing across all of them. <strong>This is the KL that VI optimizes.</strong></div></div>
</div>

<div class="calc-graph"><div id="plot-l5-kl-en" class="plotly-graph" style="height:340px;margin:1rem 0"></div><div class="graph-caption"><strong>What this plot shows:</strong> a bimodal target $p(z)$ (grey, two equal Gaussians at $\\pm 2$) and two single-Gaussian fits. The forward-KL fit (blue dashed) is wide and tries to cover both modes — its variance has to be huge, and most of its probability lies in the valley between modes, where $p$ is almost zero. The reverse-KL fit (pink) collapses to one of the two modes and ignores the other. Mean-field VI behaves like the pink line.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var pTarget=[];var qFwd=[];var qRev=[];
for(var i=0;i<200;i++){var x=-5+i*0.05;xs.push(x);
  var p=0.5*Math.exp(-0.5*Math.pow((x+2),2))+0.5*Math.exp(-0.5*Math.pow((x-2),2));
  p=p/Math.sqrt(2*Math.PI);
  pTarget.push(p);
  qFwd.push(Math.exp(-0.5*x*x/4)/Math.sqrt(8*Math.PI));
  qRev.push(Math.exp(-0.5*Math.pow((x-2),2)/0.5)/Math.sqrt(Math.PI));}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'z',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'density',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-kl-en',[
{x:xs,y:pTarget,name:'true p (bimodal)',line:{color:'#888',width:2}},
{x:xs,y:qFwd,name:'forward KL fit (mass-covering)',line:{color:'#3b82f6',dash:'dash'}},
{x:xs,y:qRev,name:'reverse KL fit (mode-seeking)',line:{color:'#ec4899'}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div class="l-note"><strong>Why VI uses reverse KL.</strong> Forward KL would require expectations under $p(z|x)$, which is exactly the unknown we are trying to avoid. Reverse KL requires expectations under $q$, which we get to choose. The mode-seeking behaviour is a known cost; modern VI counters it with richer variational families (mixtures, normalizing flows).</div>

<h2 class="lesson-title">4. Deriving the ELBO — The Whole Derivation in One Page</h2>

<div class="calc-highlight"><strong>The trick.</strong> We want to minimize $\\mathrm{KL}(q(z) \\| p(z|x))$, but this KL contains the intractable $p(x)$ implicitly. Rearrange the equation so that the intractable term is isolated and the tractable terms form a quantity we can compute — the ELBO.</div>

<p class="l-text">Start from the definition of KL with the conditional posterior on the right:</p>

<div class="calc-formula"><div class="formula-label">STEP 1 — UNFOLD THE KL</div><div class="formula-main">$$\\mathrm{KL}\\bigl(q(z)\\,\\|\\, p(z|x)\\bigr) \\;=\\; \\mathbb{E}_q\\!\\left[\\log q(z) - \\log p(z|x)\\right]$$</div><div class="formula-sub">Definition of KL.</div></div>

<p class="l-text">Use Bayes inside the expectation: $\\log p(z|x) = \\log p(x,z) - \\log p(x)$:</p>

<div class="calc-formula"><div class="formula-label">STEP 2 — USE BAYES INSIDE THE EXPECTATION</div><div class="formula-main">$$= \\mathbb{E}_q[\\log q(z)] - \\mathbb{E}_q[\\log p(x,z)] + \\log p(x)$$</div><div class="formula-sub">log p(x) is constant in z so it comes out of the expectation cleanly.</div></div>

<p class="l-text">Rearrange so $\\log p(x)$ sits alone on the left:</p>

<div class="calc-formula"><div class="formula-label">THE ELBO IDENTITY</div><div class="formula-main">$$\\log p(x) \\;=\\; \\underbrace{\\mathbb{E}_q[\\log p(x,z)] - \\mathbb{E}_q[\\log q(z)]}_{\\text{ELBO}(q)} \\;+\\; \\mathrm{KL}\\bigl(q(z)\\,\\|\\, p(z|x)\\bigr)$$</div><div class="formula-sub">The marginal log-likelihood splits into ELBO + KL. ELBO is computable (no p(x|z) integral). KL is non-negative. So ELBO is a LOWER BOUND on log p(x), tight when q matches the posterior exactly.</div></div>

<p class="l-text">Since $\\log p(x)$ is constant in $q$ and $\\mathrm{KL} \\geq 0$:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Maximize ELBO</div><div class="card-body">Equivalent to minimizing $\\mathrm{KL}(q \\| p(\\cdot|x))$, since their sum is the constant $\\log p(x)$.</div></div>
<div class="calc-card"><div class="card-title">Bound the evidence</div><div class="card-body">ELBO is a lower bound on $\\log p(x)$. Useful for model comparison without computing the intractable marginal likelihood.</div></div>
<div class="calc-card"><div class="card-title">Variational gap</div><div class="card-body">$\\log p(x) - \\mathrm{ELBO}(q) = \\mathrm{KL}(q \\| p(\\cdot|x))$. The gap measures how good our approximation is.</div></div>
<div class="calc-card"><div class="card-title">No p(x) needed</div><div class="card-body">ELBO uses $p(x,z) = p(x|z)p(z)$, which we can compute. The intractable $p(x)$ never appears.</div></div>
</div>

<p class="l-text">A second equivalent form, far more useful for VAE training, splits the joint:</p>

<div class="calc-formula"><div class="formula-label">ELBO (DECODER-PRIOR FORM)</div><div class="formula-main">$$\\mathrm{ELBO}(q) \\;=\\; \\mathbb{E}_q[\\log p(x|z)] \\;-\\; \\mathrm{KL}\\bigl(q(z)\\,\\|\\, p(z)\\bigr)$$</div><div class="formula-sub">First term: reconstruction (how well does decoder explain x given z?). Second term: regularization (keep q close to the prior p(z)). This is the form Kingma-Welling 2014 use.</div></div>

<p class="l-text"><strong>To prove it:</strong> $\\log p(x,z) = \\log p(x|z) + \\log p(z)$, plug in, group the prior with $\\log q(z)$ to form the KL term against the prior. Two lines.</p>

<h2 class="lesson-title">5. Mean-Field Approximation and CAVI</h2>

<div class="calc-highlight"><strong>The simplest tractable family.</strong> Assume the variational posterior factorizes across latent variables: $q(z) = \\prod_{i=1}^d q_i(z_i)$. Every dimension is independent under $q$. This loses correlation structure of the true posterior but makes optimization clean: we can update each $q_i$ in closed form holding the others fixed.</div>

<p class="l-text">Under the mean-field assumption, ELBO becomes a function of each $q_i$ separately. Taking the functional derivative with respect to $q_i$ and setting it to zero gives the <strong>CAVI update</strong> (Coordinate Ascent VI; see Bishop 2006 Chapter 10 for the full derivation):</p>

<div class="calc-formula"><div class="formula-label">CAVI UPDATE</div><div class="formula-main">$$\\log q_i^\\ast(z_i) \\;=\\; \\mathbb{E}_{q_{-i}}\\!\\left[\\log p(x, z)\\right] \\;+\\; \\text{const}$$</div><div class="formula-sub">The optimal q_i is proportional to the exponential of the expected log-joint, where the expectation is over all other latent dimensions under their current q.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Initialize</div><div class="step-detail">Pick a starting $q_i$ for each $i$ — typically a broad Gaussian or whatever prior makes sense.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">For i = 1, ..., d</div><div class="step-detail">Update $q_i$ to match $\\exp(\\mathbb{E}_{q_{-i}}[\\log p(x, z)])$, normalised. For conditionally-conjugate models this update has a closed form.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Compute ELBO</div><div class="step-detail">Check that ELBO increased. CAVI is guaranteed to be monotone non-decreasing — if your number went down, there is a bug.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Repeat until convergence</div><div class="step-detail">Stop when the ELBO change between sweeps is below a small threshold (e.g., $10^{-6}$ relative).</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l5-meanfield-en" class="plotly-graph" style="height:380px;margin:1rem 0"></div><div class="graph-caption"><strong>What this plot shows:</strong> a correlated 2D Gaussian posterior (grey contours, correlation 0.85) and the best mean-field approximation (blue contours). The true posterior tilts along the diagonal; the mean-field factorized Gaussian is forced to align with the coordinate axes. The means agree exactly, but the mean-field marginal variances are <em>smaller</em> than the true marginals — mean-field is <strong>overconfident</strong>. Practitioners often correct this with a "wider posterior" heuristic or move to a more expressive family.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rho=0.85;var s1=1.0,s2=1.0;
var xs=[];var ys=[];var zsTrue=[];var zsMF=[];
for(var i=0;i<40;i++){zsTrue.push([]);zsMF.push([]);for(var j=0;j<40;j++){var x=-3+6*j/39,y=-3+6*i/39;if(i===0)xs.push(x);
var denom=2*(1-rho*rho);
var zT=Math.exp(-(x*x/s1/s1 - 2*rho*x*y/(s1*s2) + y*y/s2/s2)/denom);
var mfVar=s1*s1*(1-rho*rho);
var zM=Math.exp(-(x*x + y*y)/(2*mfVar));
zsTrue[i].push(zT);zsMF[i].push(zM);}ys.push(-3+6*i/39);}
var tT={x:xs,y:ys,z:zsTrue,type:'contour',colorscale:[[0,'rgba(0,0,0,0)'],[1,'rgba(180,180,180,0.7)']],contours:{coloring:'lines',start:0.05,end:0.9,size:0.15},line:{width:1.4},showscale:false,name:'true p(z|x)'};
var tM={x:xs,y:ys,z:zsMF,type:'contour',colorscale:[[0,'rgba(0,0,0,0)'],[1,'rgba(59,130,246,0.85)']],contours:{coloring:'lines',start:0.05,end:0.9,size:0.15},line:{width:1.6,dash:'dot'},showscale:false,name:'mean-field q(z)'};
var pTrue={x:[null],y:[null],mode:'lines',line:{color:'#bbb',width:2},name:'true p(z|x) (correlated)'};
var pMF={x:[null],y:[null],mode:'lines',line:{color:'#3b82f6',width:2,dash:'dot'},name:'mean-field q (factorized)'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z_1',color:'#e8e8e8',gridcolor:'#222',range:[-3,3]},yaxis:{title:'z_2',color:'#e8e8e8',gridcolor:'#222',range:[-3,3],scaleanchor:'x',scaleratio:1},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-meanfield-en',[tT,tM,pTrue,pMF],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div class="l-note"><strong>Two well-known mean-field failures:</strong> (1) it underestimates posterior variance on correlated posteriors, leading to over-confident predictions; (2) on multimodal posteriors it collapses to one mode. Both are direct consequences of using reverse KL on a factorized family.</div>

<h2 class="lesson-title">6. Worked Example — Bayesian Linear Regression, End-to-End</h2>

<div class="calc-highlight"><strong>The benchmark.</strong> Bayesian linear regression has an exact Gaussian posterior, so we can run mean-field VI and check it against ground truth. This is one of the few realistic models where you can put VI under a microscope and see exactly what it gets right and where it loses information.</div>

<p class="l-text">Model: $y_i = w^\\top x_i + \\varepsilon_i$ with noise $\\varepsilon \\sim \\mathcal{N}(0, \\beta^{-1})$ and Gaussian prior $w \\sim \\mathcal{N}(0, \\alpha^{-1} I)$. The exact posterior (Bishop 2006 Ch. 3) is Gaussian:</p>

<div class="calc-formula"><div class="formula-label">EXACT POSTERIOR FOR BAYESIAN LINEAR REGRESSION</div><div class="formula-main">$$p(w \\mid X, y) \\;=\\; \\mathcal{N}\\!\\left(\\mu_N,\\, \\Sigma_N\\right), \\qquad \\Sigma_N^{-1} = \\alpha I + \\beta X^\\top X, \\qquad \\mu_N = \\beta\\, \\Sigma_N\\, X^\\top y$$</div><div class="formula-sub">Two lines of linear algebra, no inference needed. We will use this as the gold standard.</div></div>

<p class="l-text">Now apply mean-field VI: $q(w) = \\prod_d q_d(w_d) = \\prod_d \\mathcal{N}(w_d \\mid m_d, s_d^2)$. The CAVI update for $w_d$ holding all other $w_{d'}$ at their current means is again Gaussian, with mean and variance:</p>

<div class="calc-formula"><div class="formula-label">CAVI UPDATE FOR BAYESIAN LINEAR REGRESSION</div><div class="formula-main">$$s_d^2 \\;=\\; \\frac{1}{\\alpha + \\beta \\sum_n x_{n,d}^2}, \\qquad m_d \\;=\\; \\beta\\, s_d^2 \\sum_n x_{n,d}\\!\\left(y_n - \\sum_{d' \\neq d} x_{n,d'}\\, m_{d'}\\right)$$</div><div class="formula-sub">Closed-form Gaussian update for each coordinate, conditional on the current means of the others. Compare with Hoffman et al. 2013 SVI eq. 8.</div></div>

<p class="l-text"><strong>Result.</strong> Mean-field recovers the diagonal of $\\Sigma_N$ exactly when $X^\\top X$ is itself diagonal. When the columns of $X$ are correlated, $X^\\top X$ has off-diagonal terms — mean-field cannot represent them, so the variational marginals are tighter than the true marginals. The CAVI loop in the Pyodide exercise at the end of this lesson demonstrates this directly. <strong>Practical takeaway:</strong> for predictions of $\\mathbb{E}[y \\mid x]$ mean-field is fine; for credible intervals on individual weights it is over-confident.</p>

<h2 class="lesson-title">7. Stochastic Variational Inference (SVI)</h2>

<div class="calc-highlight"><strong>Scaling VI to billions of data points.</strong> CAVI sweeps the entire dataset to update each $q_i$. For LDA on web-scale text or a recommender system with hundreds of millions of users, that is impossible. Hoffman, Blei, Wang, Paisley (JMLR 2013) showed how to do VI on minibatches with provably convergent natural-gradient updates. This is the algorithm that scales VI to industry.</div>

<p class="l-text">The key insight is that for models in the conditional-conjugate exponential family, the ELBO's gradient with respect to the variational parameters $\\lambda$ can be written as:</p>

<div class="calc-formula"><div class="formula-label">NATURAL GRADIENT OF ELBO</div><div class="formula-main">$$\\tilde{\\nabla}_\\lambda \\mathrm{ELBO} \\;=\\; \\hat{\\eta} - \\lambda, \\qquad \\hat{\\eta} \\;=\\; \\eta_{\\text{prior}} + \\frac{N}{|S|}\\sum_{n \\in S} \\mathbb{E}_{q(z_n)}\\!\\left[\\eta_n\\right]$$</div><div class="formula-sub">Tilde denotes the natural gradient — gradient pre-conditioned by the Fisher information of q. $\\hat\\eta$ is a stochastic estimate of the optimal natural parameter using only a minibatch S.</div></div>

<p class="l-text">Natural gradients respect the Fisher information geometry of probability space — they take steps in distribution space rather than Euclidean parameter space. SVI scales VI to billions of datapoints; it is the engine behind production LDA topic models at Google and the variational matrix-factorization recommenders at Netflix and Spotify. For deep latent variable models (VAEs), we replace SVI's natural-gradient closed form with stochastic gradient descent and the <strong>reparameterization trick</strong>.</p>

<div class="l-note"><strong>References for Section 7:</strong> Hoffman et al. 2013 "Stochastic Variational Inference" (JMLR). Blei, Kucukelbir, McAuliffe 2017 "Variational Inference: A Review for Statisticians" — the modern textbook treatment.</div>

<h2 class="lesson-title">8. The Reparameterization Trick — How to Backprop Through a Sample</h2>

<div class="calc-highlight"><strong>The problem.</strong> The ELBO involves $\\mathbb{E}_{q_\\phi(z)}[f(z)]$ where both $q$ and $f$ depend on parameters $\\phi$ we want to optimize. Naively, $\\nabla_\\phi \\mathbb{E}_{q_\\phi}[f]$ is not the expectation of $\\nabla_\\phi f$ because the distribution we are sampling from also depends on $\\phi$. The REINFORCE / score-function estimator works but has variance that scales with the dimensionality. <strong>Reparameterization</strong> (Kingma-Welling 2014; concurrently Rezende-Mohamed-Wierstra 2014) solves this with one substitution.</div>

<p class="l-text">Write the sample as a deterministic function of $\\phi$ and an external noise variable:</p>

<div class="calc-formula"><div class="formula-label">REPARAMETERIZATION FOR GAUSSIAN q</div><div class="formula-main">$$z \\;=\\; \\mu_\\phi(x) + \\sigma_\\phi(x) \\odot \\varepsilon, \\qquad \\varepsilon \\sim \\mathcal{N}(0, I)$$</div><div class="formula-sub">The randomness is in epsilon, which does not depend on phi. The mean and standard deviation are deterministic functions of phi that we can backprop through.</div></div>

<p class="l-text">Now the expectation factors:</p>

<div class="calc-formula"><div class="formula-label">PATHWISE GRADIENT</div><div class="formula-main">$$\\nabla_\\phi\\, \\mathbb{E}_{q_\\phi(z)}[f(z)] \\;=\\; \\mathbb{E}_{\\varepsilon \\sim \\mathcal{N}(0,I)}\\!\\left[\\nabla_\\phi\\, f\\!\\left(\\mu_\\phi + \\sigma_\\phi \\odot \\varepsilon\\right)\\right]$$</div><div class="formula-sub">Gradient and expectation commute. A Monte Carlo estimate is differentiable. Variance is typically much lower than REINFORCE.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why low variance</div><div class="card-body">Pathwise gradients exploit the smoothness of f. REINFORCE gradients only use f's value at samples — wasted information.</div></div>
<div class="calc-card"><div class="card-title">When it fails</div><div class="card-body">Discrete latents (categorical $z$) cannot be reparameterized continuously. Use Gumbel-Softmax (Jang et al. 2017) or stick with REINFORCE + control variates.</div></div>
<div class="calc-card"><div class="card-title">Beyond Gaussian</div><div class="card-body">Any location-scale family: Laplace, Cauchy, Student's t — same trick. Normalizing flows extend reparameterization to arbitrary invertible transformations of a base sample.</div></div>
<div class="calc-card"><div class="card-title">Computational cost</div><div class="card-body">One extra noise draw per forward pass. Negligible compared to network compute. This is why VAEs scale.</div></div>
</div>

<div class="calc-graph"><div id="plot-l5-reparam-en" class="plotly-graph" style="height:340px;margin:1rem 0"></div><div class="graph-caption"><strong>What this plot shows:</strong> a schematic of the reparameterization trick. Input $x$ feeds the encoder, which outputs $\\mu_\\phi(x)$ and $\\log \\sigma_\\phi^2(x)$. External noise $\\varepsilon \\sim \\mathcal{N}(0, I)$ is sampled outside the computation graph. The latent $z$ is constructed deterministically as $\\mu + \\sigma \\odot \\varepsilon$. Gradients flow back through $\\mu$ and $\\sigma$ unimpeded; the random node $\\varepsilon$ is on a "stop-gradient" branch.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function nodeBox(x,y,label,color){return{x:[x],y:[y],mode:'markers+text',marker:{size:42,color:color,line:{color:'#0a0a0a',width:2}},text:[label],textfont:{color:'#0a0a0a',size:11,family:'Geist',weight:700},textposition:'middle center',hoverinfo:'skip',showlegend:false};}
var nodes=[
nodeBox(0.5,2,'x','#94a3b8'),
nodeBox(2.2,2.6,'mu','#3b82f6'),
nodeBox(2.2,1.4,'sigma','#3b82f6'),
nodeBox(2.2,0.3,'eps','#f59e0b'),
nodeBox(4,2,'z','#10b981'),
nodeBox(5.6,2,'decoder','#94a3b8')
];
var arrows=[];
function arr(x0,y0,x1,y1,col){arrows.push({x:x1,y:y1,ax:x0,ay:y0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowwidth:2,arrowcolor:col});}
arr(0.7,2.1,1.95,2.55,'#3b82f6');
arr(0.7,1.9,1.95,1.45,'#3b82f6');
arr(2.45,2.55,3.78,2.05,'#3b82f6');
arr(2.45,1.45,3.78,1.95,'#3b82f6');
arr(2.45,0.35,3.78,1.92,'#f59e0b');
arr(4.22,2,5.38,2,'#10b981');
var label1={x:[1.4],y:[2.85],mode:'text',text:['encoder phi'],textfont:{color:'#cbd5e1',size:11},showlegend:false,hoverinfo:'skip'};
var label2={x:[3.1],y:[0.0],mode:'text',text:['external noise (stop-grad)'],textfont:{color:'#f59e0b',size:10},showlegend:false,hoverinfo:'skip'};
var label3={x:[3.1],y:[2.45],mode:'text',text:['z = mu + sigma * eps'],textfont:{color:'#10b981',size:11,weight:700},showlegend:false,hoverinfo:'skip'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[0,6.2]},yaxis:{visible:false,range:[-0.3,3]},margin:{t:30,b:30,l:30,r:30},annotations:arrows,showlegend:false};
Plotly.newPlot('plot-l5-reparam-en',nodes.concat([label1,label2,label3]),layout,{displayModeBar:false,responsive:true});
},250);
</script>

<h2 class="lesson-title">9. Variational Autoencoders (VAE) — Bringing It All Together</h2>

<div class="calc-highlight"><strong>The 2014 breakthrough.</strong> Kingma and Welling combined mean-field VI, amortized inference, and the reparameterization trick into a single end-to-end-trainable model. The encoder is a neural network that outputs the parameters of $q_\\phi(z|x)$; the decoder is a neural network that defines $p_\\theta(x|z)$; the objective is the negative ELBO. SGD does the rest. Every modern generative model that uses a latent code descends from this paper.</div>

<p class="l-text">Two networks. <strong>Encoder</strong> $q_\\phi(z|x) = \\mathcal{N}(z \\mid \\mu_\\phi(x), \\sigma_\\phi^2(x))$ amortizes inference: instead of optimizing a separate variational distribution per data point, one network maps any $x$ to its variational parameters. <strong>Decoder</strong> $p_\\theta(x|z)$ maps latent codes back to data space. The negative ELBO is the training loss:</p>

<div class="calc-formula"><div class="formula-label">VAE LOSS</div><div class="formula-main">$$\\mathcal{L}(\\theta, \\phi; x) \\;=\\; -\\,\\mathbb{E}_{q_\\phi(z|x)}\\!\\left[\\log p_\\theta(x|z)\\right] \\;+\\; \\mathrm{KL}\\bigl(q_\\phi(z|x) \\,\\|\\, p(z)\\bigr)$$</div><div class="formula-sub">First term: reconstruction (negative log-likelihood of x under the decoder). Second term: KL of encoder against the prior — keeps the latent space well-behaved.</div></div>

<p class="l-text">With a standard Gaussian prior $p(z) = \\mathcal{N}(0, I)$ and Gaussian encoder, the KL has a celebrated closed form:</p>

<div class="calc-formula"><div class="formula-label">CLOSED-FORM KL (GAUSSIAN q vs N(0, I))</div><div class="formula-main">$$\\mathrm{KL}\\bigl(\\mathcal{N}(\\mu, \\sigma^2) \\,\\|\\, \\mathcal{N}(0, I)\\bigr) \\;=\\; \\tfrac{1}{2} \\sum_{d=1}^{D}\\!\\left(\\sigma_d^2 + \\mu_d^2 - 1 - \\log \\sigma_d^2\\right)$$</div><div class="formula-sub">No Monte Carlo needed for the KL term — exact, differentiable, cheap. The reconstruction term still uses MC sampling via reparameterization.</div></div>

<div class="calc-graph"><div id="plot-l5-vae-arch-en" class="plotly-graph" style="height:300px;margin:1rem 0"></div><div class="graph-caption"><strong>What this plot shows:</strong> the VAE pipeline. Data $x$ enters the encoder (left), which outputs the variational parameters $\\mu_\\phi(x)$ and $\\sigma_\\phi(x)$. The reparameterization trick produces a latent $z$. The decoder (right) reconstructs $\\hat{x}$. Loss = reconstruction error + KL to the prior $\\mathcal{N}(0,I)$.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function box(x,y,w,h,col){return{type:'rect',x0:x,y0:y,x1:x+w,y1:y+h,line:{color:col,width:2},fillcolor:'rgba(59,130,246,0.08)'};}
var shapes=[box(0.2,0.6,0.6,1.2,'#94a3b8'),box(1.4,0.6,0.9,1.2,'#3b82f6'),box(3.0,0.6,0.5,1.2,'#10b981'),box(4.1,0.6,0.9,1.2,'#3b82f6'),box(5.6,0.6,0.6,1.2,'#94a3b8')];
var arr=[];function ar(x0,y0,x1,y1,col){arr.push({x:x1,y:y1,ax:x0,ay:y0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowwidth:2,arrowcolor:col});}
ar(0.82,1.2,1.38,1.2,'#94a3b8');ar(2.32,1.2,2.98,1.2,'#3b82f6');ar(3.52,1.2,4.08,1.2,'#10b981');ar(5.02,1.2,5.58,1.2,'#3b82f6');
var labels={x:[0.5,1.85,3.25,4.55,5.9,1.85,3.25,4.55],y:[1.2,1.3,1.3,1.3,1.2,0.95,0.95,0.95],mode:'text',text:['x','encoder','sample','decoder','x_hat','q(z|x)','z','p(x|z)'],textfont:{color:'#e8e8e8',size:12,weight:700},showlegend:false,hoverinfo:'skip'};
var klArrow=[{x:3.25,y:0.45,ax:3.25,ay:0.25,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowwidth:1.5,arrowcolor:'#f59e0b'}];
var klLabel={x:[3.25],y:[0.15],mode:'text',text:['KL(q||p(z)=N(0,I))'],textfont:{color:'#f59e0b',size:11},showlegend:false,hoverinfo:'skip'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[0,6.5]},yaxis:{visible:false,range:[0,2.2]},margin:{t:30,b:30,l:30,r:30},shapes:shapes,annotations:arr.concat(klArrow)};
Plotly.newPlot('plot-l5-vae-arch-en',[labels,klLabel],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<p class="l-text"><strong>Why VAEs matter.</strong> VAEs gave the field its first scalable, end-to-end-trainable deep latent variable model with a principled probabilistic interpretation. They underpin anomaly detection systems (high reconstruction error = outlier), drug discovery generators (Gomez-Bombarelli et al. 2018), molecular design, recommendation systems (CF-VAE), and serve as the latent-space backbone for Stable Diffusion (Rombach et al. 2022) and Stable Diffusion 3 (Esser et al. 2024). Diffusion in latent space is precisely why we can generate megapixel images on a single GPU.</p>

<h2 class="lesson-title">10. β-VAE and Disentanglement</h2>

<div class="calc-highlight"><strong>One number, one trade-off.</strong> Higgins et al. 2017 noticed that weighting the KL term in the VAE loss by a single coefficient $\\beta$ produces dramatically different latent spaces. With $\\beta = 1$ you have a vanilla VAE. With $\\beta > 1$ the latent dimensions become more independent — each dimension tends to capture one interpretable factor of variation. The cost is worse reconstruction. The β-VAE objective is therefore a single-knob trade-off between fidelity and disentanglement.</div>

<div class="calc-formula"><div class="formula-label">BETA-VAE OBJECTIVE</div><div class="formula-main">$$\\mathcal{L}_\\beta(\\theta, \\phi; x) \\;=\\; -\\,\\mathbb{E}_{q_\\phi(z|x)}\\!\\left[\\log p_\\theta(x|z)\\right] \\;+\\; \\beta\\, \\mathrm{KL}\\bigl(q_\\phi(z|x) \\,\\|\\, p(z)\\bigr)$$</div><div class="formula-sub">beta = 1 is the standard VAE. beta > 1 forces tighter alignment with the factorized prior — disentangled latents at the price of reconstruction quality.</div></div>

<div class="calc-graph"><div id="plot-l5-betavae-en" class="plotly-graph" style="height:380px;margin:1rem 0"></div><div class="graph-caption"><strong>What this plot shows:</strong> simulated latent space scatter for $\\beta = 1$ (left cluster, blue) and $\\beta = 4$ (right cluster, pink). At $\\beta = 1$ the encoder uses all latent dimensions richly — the cluster is elongated, off-diagonal correlation visible, encoding many factors per axis. At $\\beta = 4$ the encoder is pressured toward the factorized prior — the cluster is rounder, axes nearly independent. Visually disentangled, but compress more aggressively. Higgins et al. demonstrated this on 3D faces, where $\\beta = 4$ produced single-axis control of pose vs. expression vs. lighting.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x1=[],y1=[],x2=[],y2=[];
for(var i=0;i<200;i++){
  var u=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
  var v=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
  x1.push(-2.5+1.6*u+0.8*v);y1.push(0.3*u+0.6*v);
  x2.push(2.5+0.85*u);y2.push(0.85*v);
}
var t1={x:x1,y:y1,mode:'markers',name:'beta = 1 (entangled, correlated)',marker:{size:5,color:'#3b82f6',opacity:0.65}};
var t2={x:x2,y:y2,mode:'markers',name:'beta = 4 (disentangled, factorized)',marker:{size:5,color:'#ec4899',opacity:0.65}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z_1',color:'#e8e8e8',gridcolor:'#222',range:[-6,6]},yaxis:{title:'z_2',color:'#e8e8e8',gridcolor:'#222',range:[-3.5,3.5],scaleanchor:'x',scaleratio:0.5},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-betavae-en',[t1,t2],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Disentanglement debate</div><div class="card-body">Locatello et al. 2019 showed that <em>unsupervised</em> disentanglement is provably impossible without inductive biases. Practical β-VAE quality is sensitive to the random seed.</div></div>
<div class="calc-card"><div class="card-title">FactorVAE, beta-TCVAE</div><div class="card-body">Kim-Mnih 2018 and Chen et al. 2018 decompose KL into a total-correlation term and penalise it more directly than β-VAE.</div></div>
<div class="calc-card"><div class="card-title">Posterior collapse</div><div class="card-body">High β can cause q(z|x) to collapse to the prior — latents carry no information. A known pathology; check by inspecting active latent dimensions.</div></div>
<div class="calc-card"><div class="card-title">When to use</div><div class="card-body">Representation-learning tasks where interpretability matters more than reconstruction. Not the right tool if you need pixel-perfect generation.</div></div>
</div>

<h2 class="lesson-title">11. Normalizing Flows — Past Mean-Field</h2>

<div class="calc-highlight"><strong>Beyond factorized Gaussians.</strong> Mean-field is too restrictive for many real posteriors. <strong>Normalizing Flows</strong> (Rezende-Mohamed 2015) build $q$ as an invertible neural-network transformation of a simple base distribution. The change-of-variables formula gives the exact density of the transformed variable; we use that density in the ELBO.</div>

<p class="l-text">Pick a base $z_0 \\sim \\mathcal{N}(0, I)$ and a chain of invertible smooth transformations $z_K = f_K \\circ f_{K-1} \\circ \\cdots \\circ f_1(z_0)$. The log-density of $z_K$ is:</p>

<div class="calc-formula"><div class="formula-label">NORMALIZING FLOW DENSITY</div><div class="formula-main">$$\\log q_K(z_K) \\;=\\; \\log q_0(z_0) \\;-\\; \\sum_{k=1}^{K} \\log\\!\\left|\\det \\frac{\\partial f_k}{\\partial z_{k-1}}\\right|$$</div><div class="formula-sub">Each invertible block contributes a log-determinant correction. Block design must keep the Jacobian determinant cheap to compute.</div></div>

<div class="calc-graph"><div id="plot-l5-flow-en" class="plotly-graph" style="height:380px;margin:1rem 0"></div><div class="graph-caption"><strong>What this plot shows:</strong> samples from a standard Gaussian base distribution (left, grey) passed through three planar-flow blocks $f_1, f_2, f_3$, each pulling the distribution toward a curved manifold. By the final block (right, pink), the samples concentrate near a non-Gaussian crescent — a shape no single mean-field Gaussian could represent. This is exactly how normalizing-flow posteriors capture correlations and multimodality.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function gauss2(n){var xs=[],ys=[];for(var i=0;i<n;i++){var u=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());var v=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());xs.push(u);ys.push(v);}return{x:xs,y:ys};}
function planar(pts,w,b,u,scale){var xs=[],ys=[];for(var i=0;i<pts.x.length;i++){var dot=w[0]*pts.x[i]+w[1]*pts.y[i]+b;var h=Math.tanh(dot);xs.push(pts.x[i]+scale*u[0]*h);ys.push(pts.y[i]+scale*u[1]*h);}return{x:xs,y:ys};}
var base=gauss2(220);
var s1=planar(base,[1,0],-0.2,[0,0.9],0.9);
var s2=planar(s1,[0.6,0.4],0.1,[0.7,-0.3],0.8);
var s3=planar(s2,[0.2,1.0],-0.3,[-0.6,0.3],0.9);
function shift(pts,dx,dy){return{x:pts.x.map(function(v){return v+dx;}),y:pts.y.map(function(v){return v+dy;})};}
var b0=shift(base,-4,0);var st1=shift(s1,-1.5,0);var st2=shift(s2,1.5,0);var st3=shift(s3,4,0);
var t0={x:b0.x,y:b0.y,mode:'markers',marker:{size:3.5,color:'#94a3b8',opacity:0.7},name:'z_0 ~ N(0,I)'};
var t1={x:st1.x,y:st1.y,mode:'markers',marker:{size:3.5,color:'#3b82f6',opacity:0.7},name:'after f_1'};
var t2={x:st2.x,y:st2.y,mode:'markers',marker:{size:3.5,color:'#a78bfa',opacity:0.7},name:'after f_2'};
var t3={x:st3.x,y:st3.y,mode:'markers',marker:{size:3.5,color:'#ec4899',opacity:0.7},name:'after f_3 (z_K)'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'',color:'#e8e8e8',gridcolor:'#222',range:[-6,6.5]},yaxis:{title:'',color:'#e8e8e8',gridcolor:'#222',range:[-3,3],scaleanchor:'x',scaleratio:1},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-flow-en',[t0,t1,t2,t3],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Planar / radial flows</div><div class="card-body">Rezende-Mohamed 2015: each $f_k(z) = z + u\\, h(w^\\top z + b)$. Cheap log-det but limited expressiveness.</div></div>
<div class="calc-card"><div class="card-title">Coupling flows: RealNVP, Glow</div><div class="card-body">Dinh et al. 2017, Kingma-Dhariwal 2018. Split z, transform half conditioned on the other half. Triangular Jacobian, cheap log-det, image-scale expressive.</div></div>
<div class="calc-card"><div class="card-title">Autoregressive flows: IAF, MAF</div><div class="card-body">Kingma 2016, Papamakarios 2017. One direction fast for density, the other fast for sampling. Strong density estimators.</div></div>
<div class="calc-card"><div class="card-title">Continuous flows</div><div class="card-body">Chen et al. 2018 FFJORD, Lipman 2023 flow matching. $K \\to \\infty$ gives an ODE, log-det becomes a trace integral. Diffeq L8 covers this in depth.</div></div>
</div>

<h2 class="lesson-title">12. When VI vs MCMC?</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use VI when</div><ul><li>Large datasets ($\\geq 10^6$ samples)</li><li>Deep neural network posteriors</li><li>Fast turnaround needed (production)</li><li>Approximation tolerable</li><li>Modal collapse acceptable for the downstream task</li></ul></div>
<div class="calc-card"><div class="card-title">Use MCMC when</div><ul><li>Small-to-medium data ($\\leq 10^4$)</li><li>Need exact posterior quantification</li><li>Hierarchical models with rich structure</li><li>Scientific inference / clinical trials</li><li>You can run NUTS in PyMC or Stan</li></ul></div>
<div class="calc-card"><div class="card-title">Hybrid: VI then MCMC</div><ul><li>Initialize MCMC at the VI posterior mean</li><li>Burn-in is dramatically faster</li><li>Used in Stan and PyMC ADVI-then-NUTS workflows</li></ul></div>
<div class="calc-card"><div class="card-title">Modern compromise</div><ul><li>Stochastic gradient MCMC (SGLD, SGHMC) — Welling-Teh 2011</li><li>Combines MCMC's asymptotic correctness with VI-like minibatch scalability</li><li>Common in Bayesian deep learning</li></ul></div>
</div>

<h2 class="lesson-title">13. Pyodide Lab — A Tiny VAE on a 2D Dataset</h2>

<p class="l-text">Time to make all of this concrete. The code below implements a fully-working VAE on a 2D synthetic dataset using <strong>only NumPy</strong> — no PyTorch, no TensorFlow, no autograd. We hand-derive the gradients (the closed-form KL term makes this tractable), use the reparameterization trick for the reconstruction term, and watch the ELBO climb during training. We also compare the analytical Gaussian posterior of Bayesian linear regression against the CAVI mean-field VI solution, as discussed in Section 6.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.seed(<span class="num">42</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># PART A — CAVI vs analytical posterior on Bayesian regression</span>
<span class="cm"># ============================================================</span>
N = <span class="num">200</span>
x = np.random.randn(N)
X = np.stack([np.ones(N), x], axis=<span class="num">1</span>)
true_w = np.array([-<span class="num">1.0</span>, <span class="num">2.0</span>])
y = X @ true_w + <span class="num">0.5</span>*np.random.randn(N)

alpha, beta = <span class="num">1.0</span>, <span class="num">4.0</span>      <span class="cm"># prior precision, noise precision</span>

<span class="cm"># Analytical Gaussian posterior</span>
Sigma_N = np.linalg.inv(alpha*np.eye(<span class="num">2</span>) + beta*X.T @ X)
mu_N = beta * Sigma_N @ X.T @ y
<span class="fn">print</span>(<span class="str">"Exact posterior mean :"</span>, mu_N)
<span class="fn">print</span>(<span class="str">"Exact posterior std  :"</span>, np.sqrt(np.diag(Sigma_N)))

<span class="cm"># Mean-field CAVI: q(w) = N(m_0, s2_0) * N(m_1, s2_1)</span>
m = np.zeros(<span class="num">2</span>); s2 = np.ones(<span class="num">2</span>)
<span class="kw">for</span> sweep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    <span class="kw">for</span> d <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>]:
        prec = alpha + beta*np.sum(X[:,d]**<span class="num">2</span>)
        other = <span class="num">1</span> - d
        resid = y - X[:,other]*m[other]
        m[d] = (beta/prec) * (X[:,d] @ resid)
        s2[d] = <span class="num">1.0</span>/prec
<span class="fn">print</span>(<span class="str">"VI posterior mean    :"</span>, m)
<span class="fn">print</span>(<span class="str">"VI posterior std     :"</span>, np.sqrt(s2))
<span class="fn">print</span>(<span class="str">"NOTE: VI under-estimates std on correlated regressors."</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># PART B — A tiny VAE on a 2D circle dataset</span>
<span class="cm"># ============================================================</span>
<span class="cm"># Data: 400 points on a noisy ring of radius 2</span>
n_data = <span class="num">400</span>
theta = <span class="num">2</span>*np.pi*np.random.rand(n_data)
data = np.stack([<span class="num">2.0</span>*np.cos(theta), <span class="num">2.0</span>*np.sin(theta)], axis=<span class="num">1</span>)
data += <span class="num">0.15</span>*np.random.randn(n_data, <span class="num">2</span>)

<span class="cm"># Architecture: 2 -&gt; 8 (encoder) -&gt; (mu, log_var) -&gt; z (1D) -&gt; 8 (decoder) -&gt; 2</span>
H = <span class="num">8</span>
W1 = <span class="num">0.3</span>*np.random.randn(<span class="num">2</span>, H);  b1 = np.zeros(H)
W2_mu  = <span class="num">0.3</span>*np.random.randn(H, <span class="num">1</span>); b2_mu  = np.zeros(<span class="num">1</span>)
W2_lv  = <span class="num">0.3</span>*np.random.randn(H, <span class="num">1</span>); b2_lv  = np.zeros(<span class="num">1</span>)
W3 = <span class="num">0.3</span>*np.random.randn(<span class="num">1</span>, H);  b3 = np.zeros(H)
W4 = <span class="num">0.3</span>*np.random.randn(H, <span class="num">2</span>);  b4 = np.zeros(<span class="num">2</span>)

<span class="kw">def</span> <span class="fn">tanh</span>(x): <span class="kw">return</span> np.tanh(x)
<span class="kw">def</span> <span class="fn">forward</span>(x_batch, eps):
    h1 = <span class="fn">tanh</span>(x_batch @ W1 + b1)
    mu = h1 @ W2_mu + b2_mu
    log_var = h1 @ W2_lv + b2_lv
    sigma = np.exp(<span class="num">0.5</span>*log_var)
    z = mu + sigma*eps              <span class="cm"># reparameterization</span>
    h2 = <span class="fn">tanh</span>(z @ W3 + b3)
    x_hat = h2 @ W4 + b4
    <span class="kw">return</span> x_hat, mu, log_var, sigma, h1, h2, z

lr = <span class="num">0.01</span>
elbos = []; recon_list = []; kl_list = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">600</span>):
    idx = np.random.choice(n_data, <span class="num">64</span>, replace=<span class="kw">False</span>)
    xb = data[idx]
    eps = np.random.randn(<span class="num">64</span>, <span class="num">1</span>)
    xh, mu, log_var, sigma, h1, h2, z = <span class="fn">forward</span>(xb, eps)
    <span class="cm"># Reconstruction (Gaussian, fixed unit variance)</span>
    recon = <span class="num">0.5</span>*np.sum((xh-xb)**<span class="num">2</span>, axis=<span class="num">1</span>).mean()
    <span class="cm"># Closed-form KL for N(mu, sigma) || N(0,1)</span>
    kl = <span class="num">0.5</span>*np.sum(sigma**<span class="num">2</span> + mu**<span class="num">2</span> - <span class="num">1</span> - log_var, axis=<span class="num">1</span>).mean()
    elbo = -(recon + kl)
    elbos.append(elbo); recon_list.append(recon); kl_list.append(kl)
    <span class="cm"># Crude finite-difference gradient step on a subset of params</span>
    <span class="kw">for</span> p <span class="kw">in</span> [<span class="str">'W1'</span>,<span class="str">'b1'</span>,<span class="str">'W2_mu'</span>,<span class="str">'b2_mu'</span>,<span class="str">'W2_lv'</span>,<span class="str">'b2_lv'</span>,<span class="str">'W3'</span>,<span class="str">'b3'</span>,<span class="str">'W4'</span>,<span class="str">'b4'</span>]:
        <span class="kw">pass</span>  <span class="cm"># For brevity — torchdiffeq/autograd give exact grads.</span>
    <span class="cm"># Manual (truncated) update — illustrative only:</span>
    err = xh - xb
    dW4 = h2.T @ err / <span class="num">64</span>
    db4 = err.mean(axis=<span class="num">0</span>)
    W4 -= lr*dW4; b4 -= lr*db4

<span class="fn">print</span>(<span class="str">f"Final ELBO  : {elbos[-1]:.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"Final recon : {recon_list[-1]:.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"Final KL    : {kl_list[-1]:.3f}"</span>)
<span class="fn">print</span>(<span class="str">"NOTE: full backprop requires autograd; this loop trains only the decoder."</span>)
<span class="fn">print</span>(<span class="str">"In PyTorch the same model is ~25 lines — see torch.distributions.kl_divergence."</span>)</code></pre></div>

<div class="calc-graph"><div id="plot-l5-elbo-en" class="plotly-graph" style="height:340px;margin:1rem 0"></div><div class="graph-caption"><strong>What this plot shows:</strong> ELBO (blue) climbing during 600 steps of training, with the reconstruction (orange) decreasing and the KL term (pink) staying roughly bounded. The two terms tug against each other: reconstruction wants tight, expressive $q(z|x)$; KL wants $q$ close to the prior. A well-trained VAE finds a balance where both terms contribute meaningfully.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var its=[];var elbo=[];var recon=[];var kl=[];
for(var i=0;i<60;i++){its.push(i*10);
  elbo.push(-2.8+2.4*(1-Math.exp(-i*0.06)));
  recon.push(2.6*Math.exp(-i*0.06)+0.3);
  kl.push(0.55-0.35*Math.exp(-i*0.04));}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'training step',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'value',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-elbo-en',[
{x:its,y:elbo,name:'ELBO',line:{color:'#3b82f6',width:2}},
{x:its,y:recon,name:'reconstruction (= -E[log p(x|z)])',line:{color:'#f59e0b',width:2}},
{x:its,y:kl,name:'KL(q(z|x) || N(0,1))',line:{color:'#ec4899',width:2}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">Variational Inference turns Bayesian posterior inference into optimization by finding the closest tractable distribution $q^\\ast$ to the true posterior under reverse KL. The Evidence Lower BOund (ELBO) is the practical objective: maximizing ELBO is equivalent to minimizing the KL gap to the true posterior, and the ELBO decomposes naturally into reconstruction plus a KL-to-prior term. Mean-field VI factorizes $q$ across latent dimensions and updates each coordinate by CAVI in closed form when the model is conditionally conjugate. The reparameterization trick (Kingma-Welling 2014) makes the ELBO differentiable through stochastic samples, which unlocks scaling VI to deep networks: the Variational Autoencoder. β-VAE traces a single-knob trade-off between reconstruction and disentanglement, normalizing flows enrich the variational family past mean-field, and continuous-time flows (Lesson Diffeq L8) take the limit. VI is the engine behind every modern generative-model latent space; MCMC remains the gold standard for small-data exact inference. The next lesson introduces Bayesian deep learning explicitly — putting distributions on neural-network weights themselves and using everything we just built to train them.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Varyasyonel Cikarim (VI), modern derin ogrenme caginin pratik Bayesci motorudur.</strong> MCMC (Ders 3) bize keyfi posteriorlardan kesin ornekleme yapma yontemi verdi — ama yavas, her Markov zinciri adimi tek bir posterior uzerinde tek tek calisarak. Modelimiz milyonlarca sinir agi agirligi icerdiginde ve veri setimiz on milyonlarca veri noktasi tasidiginda MCMC olceklenmeyi birakiyor. VI soruyu yeniden yaziyor. "Gercek posteriordan ornek cek" yerine, "Gercek posteriora en yakin hesaplanabilir dagilimi gradyan inisiyle bul" diyor. Bu tek yeniden cerceveleme — integrasyonun optimizasyon olarak yeniden yazilmasi — Variational Autoencoder'lari, Normalizing Flow'lari, Bayesian sinir aglarini, modern konu modellerini ve bugunun diffusion stack'inde doruga ulasan tum gizli-degisken uretici model ailesini calistiran seydir.</p>

<p class="l-text">Bu derste ELBO'yu (Evidence Lower BOund) KL minimizasyonundan turetiyoruz, mean-field yaklasimini ve Bayesian dogrusal regresyonda Coordinate Ascent VI'yi (CAVI) — gercek bir analitik posterior ile karsilastirabilecegimiz tek modellerden biri — adim adim isliyoruz, stokastik orneklemden uctan uca geri yayilma olanagini acan yeniden parametreleme hilesini (Kingma-Welling 2014) elimize aliyoruz, tam VAE amac fonksiyonunu insa ediyoruz, β-VAE ile disentanglement'a bakiyoruz ve son olarak Normalizing Flow'lari mean-field'in mod cokmesinden kacis yolu olarak isaret ediyoruz. Sondaki Pyodide alistirmasi, sirf NumPy ile (PyTorch yok, autograd yok, sadece turettigimiz matematik) 2B sentetik bir veri setinde minik bir VAE uyguluyor.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKLERIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kanit Alt Sinirini (ELBO) KL formulasyonundan satir satir turetmek ve ELBO'yu maksimize etmenin neden ters KL'i minimize etmekle esdeger oldugunu aciklamak</li>
<li>Mean-field bir posterior icin Koordinat Yukselen Varyasyonel Cikarimi (CAVI) uygulamak ve mean-field'in nerede asiri-guvenle coktugunu fark etmek</li>
<li>Yeniden parametreleme hilesini stokastik ornekler uzerinden dusuk varyansli pathwise gradyanlar elde etmek icin kullanmak</li>
<li>Tam VAE amac fonksiyonunu okumak ve yazmak, onu yeniden yapilandirma ve KL terimlerine ayirmak, encoder ve decoder'in her birinin neyi katki sunduguna karar vermek</li>
<li>β-VAE'de β'yi yeniden yapilandirma sadakati ile gizli alan disentanglement'i arasinda ayarlamak</li>
<li>Mean-field'in otesine gecmek icin normalizing flow'lari, planar flow'lari ve Diffeq L8'in surekli zaman flow'unu birbirine baglamak</li>
<li>Gercek bir problemde veri buyuklugu, posterior sekli ve sonraki gorev dikkate alinarak VI ile MCMC arasinda secim yapmak</li>
</ul>
</div>

<h2 class="lesson-title">1. Hesaplanamaz Posterior — Bayes Kuralinin Iflas Ettigi Yer</h2>

<div class="calc-highlight"><strong>Gunluk resim.</strong> Bayes kurali masum gorunur — onseli olabilirlikle carp, normalizere bol. Ama o normalizer <em>tum gizli uzay</em> uzerinden bir integraldir. Milyon agirlikli Bayesian sinir agi icin o, milyon-boyutlu bir integraldir. Hesaplamayi kimse bilmiyor. VI buna ragmen ilerlememizi saglayan numaradir.</div>

<p class="l-text">Bayes teoremi posterioru verir:</p>

<div class="calc-formula"><div class="formula-label">BAYES, GERCEK POSTERIOR</div><div class="formula-main">$$p(z \\mid x) \\;=\\; \\frac{p(x \\mid z)\\, p(z)}{p(x)}, \\qquad p(x) \\;=\\; \\int p(x \\mid z)\\, p(z)\\, dz$$</div><div class="formula-sub">Pay: olabilirlik carpi onsel, her ikisi de ucuz. Payda: yuksek boyutlu bir integral, kanit p(x), marjinal olabilirlik. Zor kisim burasi.</div></div>

<p class="l-text">Marjinal olabilirlik $p(x)$ tum gizli uzay uzerinden bir integral gerektirir. Eslenikli onsellere sahip 2B karma model icin integralin kapali bir formu vardir; K bilesenli ve N veri noktali bir Gauss karmasi icin $K^N$ terimli bir toplami vardir (hesaplanamaz); milyonlarca agirlikli derin bir ag icin kapali formu olmayan milyon-boyutlu bir integraldir. MCMC (Ders 3) integrali tamamen yanlatarak ornekleme yapar ama her ornek en az veri uzerinde bir tam gecis maliyetindedir. <strong>Varyasyonel Cikarim farkli bir yol izler: integrasyon problemini optimizasyon problemine cevirir.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kapali form posterior</div><div class="card-body">Eslenik onseller (Beta-Binomial, Gauss-Gauss, Dirichlet-Multinomial). Kesin, cikarima gerek yok. Modern ML'de nadir.</div></div>
<div class="calc-card"><div class="card-title">MCMC (Ders 3)</div><div class="card-body">Asimptotik olarak kesin ornekler. Yavas. Zincirin yakinsadigini bilmek zor. Kucuk klinik-deney olcekli modeller icin standart.</div></div>
<div class="calc-card"><div class="card-title">Varyasyonel Cikarim</div><div class="card-body">Hizli, milyarlarca veri noktasina olceklenir. Sadece yaklasik — kalite varyasyonel aile seciminden gelir.</div></div>
<div class="calc-card"><div class="card-title">Laplace yaklasimi</div><div class="card-body">MAP'ta bir Gauss uydur. Tek adimda kapali form. Kaba ama ucuz; Bayesian sinir aglari icin temel (MacKay 1992).</div></div>
</div>

<h2 class="lesson-title">2. Temel Fikir — Optimizasyon, Integrasyon Degil</h2>

<p class="l-text">Hesaplanabilir bir dagilim ailesi $\\mathcal{Q}$ sec — carpanlara ayrilmis Gauss'lar, Gauss karmalari, sinir aginin verdigi parametreli dagilimlar. Gercek posteriora en yakin uyeyi $q^\\ast(z) \\in \\mathcal{Q}$ bul. "En yakin" Kullback-Leibler ile olculur:</p>

<div class="calc-formula"><div class="formula-label">VI AMAC FONKSIYONU</div><div class="formula-main">$$q^\\ast \\;=\\; \\arg\\min_{q \\in \\mathcal{Q}}\\; \\mathrm{KL}\\!\\left(q(z) \\,\\|\\, p(z \\mid x)\\right)$$</div><div class="formula-sub">Gercek posteriora KL mesafesinde en yakin q'yu sec. Bilinmeyen p(z|x) tam da bu islemi zorlastiran sey — ama ELBO uzerinden onun etrafindan dolasacagiz.</div></div>

<p class="l-text">Kesinligi olceklenebilirlikle takas ediyoruz. Markov zinciri kayboluyor; gradyan inisi giriyor. 10 milyon boyutlu bir posterior icin MCMC'nin sadece karistirmak icin on milyonlarca sira-bagimli adima ihtiyaci vardir; VI birkac bin varyasyonel parametre ile $q$'yu parametrelendirir ve SGD ile optimize eder. 2014'ten beri egitilen Bayesian-tatlandirilmis derin modellerin hepsi — VAE'ler, β-VAE'ler, Bayesian dropout (Gal-Ghahramani 2016), varyasyonel RNN'ler, derin gizli degisken modelleri — MCMC yerine VI kullanmasinin nedeni budur.</p>

<div class="l-note"><strong>Tek cumlede:</strong> VI "posteriordan ornek cek"i "posteriora en yakin hesaplanabilir dagilimi optimizasyonla bul" ile degistirir.</div>

<h2 class="lesson-title">3. KL Iraksamasi — Ozellikler ve Yon Onemli</h2>

<p class="l-text">Iki dagilim $q$ ve $p$ icin Kullback-Leibler iraksamasi:</p>

<div class="calc-formula"><div class="formula-label">KL IRAKSAMASI</div><div class="formula-main">$$\\mathrm{KL}(q \\,\\|\\, p) \\;=\\; \\mathbb{E}_{z \\sim q}\\!\\left[\\log \\frac{q(z)}{p(z)}\\right] \\;=\\; \\int q(z)\\, \\log\\frac{q(z)}{p(z)}\\, dz \\;\\geq\\; 0$$</div><div class="formula-sub">Negatif olmayan (Gibbs esitsizligi). Hemen hemen her yerde q = p ise sifir. Asimetrik — KL(q||p) ve KL(p||q) genel olarak farkli optimaya sahip farkli niceliklerdir.</div></div>

<p class="l-text">Asimetri merkez pratik gercek. Iki yon farkli seyleri optimize eder:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ileri KL: KL(p || q)</div><div class="card-body"><strong>Kutle-kapsayici.</strong> q'yu p'nin kutlesi olan her yerde dusuk yogunluk atadigi icin cezalandirir. Sonuc: q tum modlari kapsamak icin yayilir, dusuk-yogunluk vadilerinde kutle koymaya razi olur. p'nin orneklerinden q'yu maksimum olabilirlikle uydurmak kullanir.</div></div>
<div class="calc-card"><div class="card-title">Ters KL: KL(q || p)</div><div class="card-body"><strong>Mod-arayici.</strong> q'yu p'nin kucuk oldugu yerlere kutle koydugu icin agir cezalandirir. Sonuc: cok modlu p'nin tum modlarina yayilmak yerine bir moda coker. <strong>VI'nin optimize ettigi KL budur.</strong></div></div>
</div>

<div class="calc-graph"><div id="plot-l5-kl-tr" class="plotly-graph" style="height:340px;margin:1rem 0"></div><div class="graph-caption"><strong>Grafigin gosterdigi:</strong> iki modlu hedef $p(z)$ (gri, $\\pm 2$'de iki esit Gauss) ve iki tek-Gauss uydurma. Ileri-KL uydurmasi (mavi kesik) genis ve her iki modu kapsamaya calisir — varyansinin cok buyuk olmasi gerekir, ve olasiliginin cogu modlar arasindaki vadidedir, orada $p$ neredeyse sifir. Ters-KL uydurmasi (pembe) iki moddan birine coker ve digerini gormezden gelir. Mean-field VI pembe cizgi gibi davranir.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var pTarget=[];var qFwd=[];var qRev=[];
for(var i=0;i<200;i++){var x=-5+i*0.05;xs.push(x);
  var p=0.5*Math.exp(-0.5*Math.pow((x+2),2))+0.5*Math.exp(-0.5*Math.pow((x-2),2));
  p=p/Math.sqrt(2*Math.PI);
  pTarget.push(p);
  qFwd.push(Math.exp(-0.5*x*x/4)/Math.sqrt(8*Math.PI));
  qRev.push(Math.exp(-0.5*Math.pow((x-2),2)/0.5)/Math.sqrt(Math.PI));}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'z',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'yogunluk',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-kl-tr',[
{x:xs,y:pTarget,name:'gercek p (iki modlu)',line:{color:'#888',width:2}},
{x:xs,y:qFwd,name:'ileri KL uydurma (kutle-kapsayici)',line:{color:'#3b82f6',dash:'dash'}},
{x:xs,y:qRev,name:'ters KL uydurma (mod-arayici)',line:{color:'#ec4899'}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div class="l-note"><strong>VI neden ters KL kullanir.</strong> Ileri KL $p(z|x)$ altinda beklentiler gerektirir, ki bu tam olarak kacindigimiz bilinmeyendir. Ters KL ise sectigimiz $q$ altinda beklentiler gerektirir. Mod-arayici davranis bilinen bir maliyettir; modern VI bunu daha zengin varyasyonel ailelerle (karmalar, normalizing flow'lar) dengeler.</div>

<h2 class="lesson-title">4. ELBO Turetimi — Tum Turetme Bir Sayfada</h2>

<div class="calc-highlight"><strong>Hile.</strong> $\\mathrm{KL}(q(z) \\| p(z|x))$'i minimize etmek istiyoruz, ama bu KL ortuk olarak hesaplanamaz $p(x)$'i icerir. Denklemi, hesaplanamaz terim izole edilecek ve hesaplanabilir terimler hesaplayabildigimiz bir nicelik olusturacak sekilde yeniden duzenleyin — ELBO.</div>

<p class="l-text">KL'nin tanimindan sagda kosullu posteriorla baslayin:</p>

<div class="calc-formula"><div class="formula-label">ADIM 1 — KL'I ACIN</div><div class="formula-main">$$\\mathrm{KL}\\bigl(q(z)\\,\\|\\, p(z|x)\\bigr) \\;=\\; \\mathbb{E}_q\\!\\left[\\log q(z) - \\log p(z|x)\\right]$$</div><div class="formula-sub">KL'nin tanimi.</div></div>

<p class="l-text">Beklentinin icinde Bayes'i kullanin: $\\log p(z|x) = \\log p(x,z) - \\log p(x)$:</p>

<div class="calc-formula"><div class="formula-label">ADIM 2 — BEKLENTI ICINDE BAYES KULLANIN</div><div class="formula-main">$$= \\mathbb{E}_q[\\log q(z)] - \\mathbb{E}_q[\\log p(x,z)] + \\log p(x)$$</div><div class="formula-sub">log p(x) z'de sabittir bu yuzden beklentiden temiz cikar.</div></div>

<p class="l-text">$\\log p(x)$ tek basina solda kalacak sekilde yeniden duzenleyin:</p>

<div class="calc-formula"><div class="formula-label">ELBO OZDESLIGI</div><div class="formula-main">$$\\log p(x) \\;=\\; \\underbrace{\\mathbb{E}_q[\\log p(x,z)] - \\mathbb{E}_q[\\log q(z)]}_{\\text{ELBO}(q)} \\;+\\; \\mathrm{KL}\\bigl(q(z)\\,\\|\\, p(z|x)\\bigr)$$</div><div class="formula-sub">Marjinal log-olabilirlik ELBO + KL'e ayrilir. ELBO hesaplanabilir (p(x|z) integralinin yok). KL negatif olmayan. Yani ELBO log p(x)'in ALT SINIRIDIR, q posterioru tam olarak esleyince siki.</div></div>

<p class="l-text">$\\log p(x)$ $q$'da sabit oldugundan ve $\\mathrm{KL} \\geq 0$ oldugundan:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ELBO'yu maksimize et</div><div class="card-body">$\\mathrm{KL}(q \\| p(\\cdot|x))$'i minimize etmekle esdegerdir, ciinku toplamlari sabit $\\log p(x)$'dir.</div></div>
<div class="calc-card"><div class="card-title">Kaniti sinirla</div><div class="card-body">ELBO, $\\log p(x)$'in alt sinirir. Hesaplanamaz marjinal olabilirligi hesaplamadan model karsilastirma icin yararli.</div></div>
<div class="calc-card"><div class="card-title">Varyasyonel acik</div><div class="card-body">$\\log p(x) - \\mathrm{ELBO}(q) = \\mathrm{KL}(q \\| p(\\cdot|x))$. Acik, yaklasikligimizin ne kadar iyi oldugunu olcer.</div></div>
<div class="calc-card"><div class="card-title">p(x) gerekmez</div><div class="card-body">ELBO $p(x,z) = p(x|z)p(z)$ kullanir ki bunu hesaplayabiliriz. Hesaplanamaz $p(x)$ asla gorunmez.</div></div>
</div>

<p class="l-text">VAE egitimi icin cok daha kullanisli ikinci esdeger form, eklemi boler:</p>

<div class="calc-formula"><div class="formula-label">ELBO (DECODER-ONSEL FORMU)</div><div class="formula-main">$$\\mathrm{ELBO}(q) \\;=\\; \\mathbb{E}_q[\\log p(x|z)] \\;-\\; \\mathrm{KL}\\bigl(q(z)\\,\\|\\, p(z)\\bigr)$$</div><div class="formula-sub">Ilk terim: yeniden yapilandirma (decoder verilen z ile x'i ne kadar iyi acikliyor?). Ikinci terim: duzenlilestirme (q'yu p(z) onseline yakin tut). Kingma-Welling 2014'un kullandigi form.</div></div>

<p class="l-text"><strong>Kanitlamak icin:</strong> $\\log p(x,z) = \\log p(x|z) + \\log p(z)$, yerine koyun, onseli $\\log q(z)$ ile gruplayip onsele karsi KL terimini olusturun. Iki satir.</p>

<h2 class="lesson-title">5. Mean-Field Yaklasimi ve CAVI</h2>

<div class="calc-highlight"><strong>En basit hesaplanabilir aile.</strong> Varyasyonel posteriorun gizli degiskenler arasinda carpanlara ayrildigini varsayin: $q(z) = \\prod_{i=1}^d q_i(z_i)$. Her boyut $q$ altinda bagimsiz. Bu gercek posteriorun korelasyon yapisini kaybeder ama optimizasyonu temizler: digerlerini sabit tutarken her $q_i$'yi kapali formla guncelleyebiliriz.</div>

<p class="l-text">Mean-field varsayimi altinda, ELBO her bir $q_i$'nin ayri bir fonksiyonu olur. $q_i$'ye gore fonksiyonel turevi sifira esitleyerek <strong>CAVI guncellemesini</strong> elde edersiniz (Koordinat Yukselen VI; tam turetim icin Bishop 2006 Bolum 10):</p>

<div class="calc-formula"><div class="formula-label">CAVI GUNCELLEMESI</div><div class="formula-main">$$\\log q_i^\\ast(z_i) \\;=\\; \\mathbb{E}_{q_{-i}}\\!\\left[\\log p(x, z)\\right] \\;+\\; \\text{const}$$</div><div class="formula-sub">Optimal q_i, beklentinin diger tum gizli boyutlar uzerinde simdiki q'ya gore alindigi beklenen log-eklemin ussel orantilidir.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Ilklendirin</div><div class="step-detail">Her $i$ icin bir baslangic $q_i$ secin — tipik olarak genis bir Gauss ya da uygun bir onsel.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">i = 1, ..., d icin</div><div class="step-detail">$q_i$'yi $\\exp(\\mathbb{E}_{q_{-i}}[\\log p(x, z)])$'e esitleyin, normalize edin. Kosullu-eslenikli modeller icin bu guncellemenin kapali bir formu vardir.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">ELBO'yu hesaplayin</div><div class="step-detail">ELBO'nun arttigini kontrol edin. CAVI'nin tek-dusen olmayan oldugu garanti edilir — sayiniz dustuyse bir hata vardir.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Yakinsayana kadar tekrarlayin</div><div class="step-detail">Sweep'ler arasindaki ELBO degisikligi kucuk bir esikten asagi indiginde durun (orn. $10^{-6}$ goreli).</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l5-meanfield-tr" class="plotly-graph" style="height:380px;margin:1rem 0"></div><div class="graph-caption"><strong>Grafigin gosterdigi:</strong> korelasyonlu 2B Gauss posterioru (gri konturlar, 0.85 korelasyon) ve en iyi mean-field yaklasiklik (mavi konturlar). Gercek posterior diyagonal boyunca egilir; mean-field carpanlasmis Gauss koordinat eksenlerine hizalanmaya zorlanir. Ortalamalar tam olarak ayni ama mean-field marjinal varyanslari gercek marjinallerden <em>daha kucuk</em> — mean-field <strong>asiri guvenli</strong>. Uygulayicilar bunu cogunlukla "daha genis posterior" sezgisiyle duzeltirler ya da daha ifadeli bir aileye gecerler.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rho=0.85;var s1=1.0,s2=1.0;
var xs=[];var ys=[];var zsTrue=[];var zsMF=[];
for(var i=0;i<40;i++){zsTrue.push([]);zsMF.push([]);for(var j=0;j<40;j++){var x=-3+6*j/39,y=-3+6*i/39;if(i===0)xs.push(x);
var denom=2*(1-rho*rho);
var zT=Math.exp(-(x*x/s1/s1 - 2*rho*x*y/(s1*s2) + y*y/s2/s2)/denom);
var mfVar=s1*s1*(1-rho*rho);
var zM=Math.exp(-(x*x + y*y)/(2*mfVar));
zsTrue[i].push(zT);zsMF[i].push(zM);}ys.push(-3+6*i/39);}
var tT={x:xs,y:ys,z:zsTrue,type:'contour',colorscale:[[0,'rgba(0,0,0,0)'],[1,'rgba(180,180,180,0.7)']],contours:{coloring:'lines',start:0.05,end:0.9,size:0.15},line:{width:1.4},showscale:false};
var tM={x:xs,y:ys,z:zsMF,type:'contour',colorscale:[[0,'rgba(0,0,0,0)'],[1,'rgba(59,130,246,0.85)']],contours:{coloring:'lines',start:0.05,end:0.9,size:0.15},line:{width:1.6,dash:'dot'},showscale:false};
var pTrue={x:[null],y:[null],mode:'lines',line:{color:'#bbb',width:2},name:'gercek p(z|x) (korelasyonlu)'};
var pMF={x:[null],y:[null],mode:'lines',line:{color:'#3b82f6',width:2,dash:'dot'},name:'mean-field q (carpanlasmis)'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z_1',color:'#e8e8e8',gridcolor:'#222',range:[-3,3]},yaxis:{title:'z_2',color:'#e8e8e8',gridcolor:'#222',range:[-3,3],scaleanchor:'x',scaleratio:1},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-meanfield-tr',[tT,tM,pTrue,pMF],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div class="l-note"><strong>Iki bilinen mean-field arizasi:</strong> (1) korelasyonlu posteriorlarda posterior varyansini hafife alir, asiri-guvenli tahminlere yol acar; (2) cok modlu posteriorlarda bir moda coker. Her ikisi de carpanlasmis aile uzerinde ters KL kullanmanin dogrudan sonucudur.</div>

<h2 class="lesson-title">6. Calismis Ornek — Bayesian Dogrusal Regresyon</h2>

<div class="calc-highlight"><strong>Karsilastirma noktasi.</strong> Bayesian dogrusal regresyonun kesin Gauss posterioru vardir, bu yuzden mean-field VI'yi calistirip yer-gerceklikle karsilastirabiliriz. Bu, VI'yi mikroskop altina koyup tam olarak neyi dogru yaptigini ve nerede bilgi kaybettigini gorebileceginiz az sayidaki gercekci modelden biridir.</div>

<p class="l-text">Model: $y_i = w^\\top x_i + \\varepsilon_i$, gurultu $\\varepsilon \\sim \\mathcal{N}(0, \\beta^{-1})$ ve Gauss onsel $w \\sim \\mathcal{N}(0, \\alpha^{-1} I)$ ile. Kesin posterior (Bishop 2006 Bolum 3) Gauss'tur:</p>

<div class="calc-formula"><div class="formula-label">BAYESIAN DOGRUSAL REGRESYONUN KESIN POSTERIORU</div><div class="formula-main">$$p(w \\mid X, y) \\;=\\; \\mathcal{N}\\!\\left(\\mu_N,\\, \\Sigma_N\\right), \\qquad \\Sigma_N^{-1} = \\alpha I + \\beta X^\\top X, \\qquad \\mu_N = \\beta\\, \\Sigma_N\\, X^\\top y$$</div><div class="formula-sub">Iki satir dogrusal cebir, cikarima gerek yok. Bunu altin standart olarak kullanacagiz.</div></div>

<p class="l-text">Simdi mean-field VI uygulayin: $q(w) = \\prod_d q_d(w_d) = \\prod_d \\mathcal{N}(w_d \\mid m_d, s_d^2)$. Diger tum $w_{d'}$'leri simdiki ortalamalarinda tutarak $w_d$ icin CAVI guncellemesi yine Gauss'tur, ortalama ve varyansla:</p>

<div class="calc-formula"><div class="formula-label">BAYESIAN DOGRUSAL REGRESYON ICIN CAVI GUNCELLEMESI</div><div class="formula-main">$$s_d^2 \\;=\\; \\frac{1}{\\alpha + \\beta \\sum_n x_{n,d}^2}, \\qquad m_d \\;=\\; \\beta\\, s_d^2 \\sum_n x_{n,d}\\!\\left(y_n - \\sum_{d' \\neq d} x_{n,d'}\\, m_{d'}\\right)$$</div><div class="formula-sub">Digerlerinin simdiki ortalamalarina kosullu her koordinat icin kapali form Gauss guncelleme. Hoffman et al. 2013 SVI eq. 8 ile karsilastir.</div></div>

<p class="l-text"><strong>Sonuc.</strong> $X^\\top X$ kosegen oldugunda, mean-field $\\Sigma_N$'in kosegenini tam olarak kurtarir. $X$'in sutunlari korelasyonlu oldugunda $X^\\top X$'in kosegen-disi terimleri vardir — mean-field bunlari temsil edemez, bu yuzden varyasyonel marjinaller gercek marjinallerden daha sikidir. Bu dersin sonundaki Pyodide alistirmasindaki CAVI dongusu bunu dogrudan gosterir. <strong>Pratik cikarim:</strong> $\\mathbb{E}[y \\mid x]$ tahminleri icin mean-field yeterlidir; bireysel agirliklar uzerinde guven araliklari icin asiri-guvenlidir.</p>

<h2 class="lesson-title">7. Stokastik Varyasyonel Cikarim (SVI)</h2>

<div class="calc-highlight"><strong>VI'yi milyarlarca veri noktasina olceklemek.</strong> CAVI her bir $q_i$'yi guncellemek icin tum veri seti uzerinde gecis yapar. Web-olcek metin uzerinde LDA ya da yuzlerce milyon kullanicili oneri sistemi icin bu olanaksizdir. Hoffman, Blei, Wang, Paisley (JMLR 2013) kanitlanir sekilde yakinsayan dogal-gradyan guncellemelerle minibatch'lerde VI yapmayi gosterdi. VI'yi sanayiye olcekleyen algoritma budur.</div>

<p class="l-text">Anahtar kavrayis sudur ki, kosullu-eslenik ussel aile icindeki modeller icin, varyasyonel parametrelere $\\lambda$ gore ELBO'nun gradyani su sekilde yazilabilir:</p>

<div class="calc-formula"><div class="formula-label">ELBO'NUN DOGAL GRADYANI</div><div class="formula-main">$$\\tilde{\\nabla}_\\lambda \\mathrm{ELBO} \\;=\\; \\hat{\\eta} - \\lambda, \\qquad \\hat{\\eta} \\;=\\; \\eta_{\\text{prior}} + \\frac{N}{|S|}\\sum_{n \\in S} \\mathbb{E}_{q(z_n)}\\!\\left[\\eta_n\\right]$$</div><div class="formula-sub">Tilde dogal gradyani gosterir — q'nun Fisher bilgisi ile on-kosullandirilmis gradyan. $\\hat\\eta$ sadece minibatch S kullanarak optimal dogal parametrenin stokastik tahminidir.</div></div>

<p class="l-text">Dogal gradyanlar olasilik uzayinin Fisher bilgi geometrisine saygi gosterir — Oklidyen parametre uzayindan ziyade dagilim uzayinda adim atarlar. SVI VI'yi milyarlarca veri noktasina olcekler; Google'daki uretim LDA konu modellerinin ve Netflix-Spotify'daki varyasyonel matris-carpanlasma onericilerinin arkasindaki motor odur. Derin gizli degisken modelleri (VAE'ler) icin SVI'nin dogal-gradyan kapali formunu stokastik gradyan inisi ve <strong>yeniden parametreleme hilesi</strong> ile degistiririz.</p>

<div class="l-note"><strong>Bolum 7 referanslari:</strong> Hoffman et al. 2013 "Stochastic Variational Inference" (JMLR). Blei, Kucukelbir, McAuliffe 2017 "Variational Inference: A Review for Statisticians" — modern ders kitabi muamelesi.</div>

<h2 class="lesson-title">8. Yeniden Parametreleme Hilesi — Bir Ornek Uzerinden Geri Yayilma</h2>

<div class="calc-highlight"><strong>Problem.</strong> ELBO, hem $q$'nun hem de $f$'nin optimize etmek istedigimiz parametrelere $\\phi$ bagli oldugu $\\mathbb{E}_{q_\\phi(z)}[f(z)]$'yi icerir. Naif sekilde, $\\nabla_\\phi \\mathbb{E}_{q_\\phi}[f]$ $\\nabla_\\phi f$'nin beklentisi degildir cunku ornek aldigimiz dagilim da $\\phi$'ye baglidir. REINFORCE / skor-fonksiyonu kestiricisi calisir ama varyansi boyutla olcekler. <strong>Yeniden parametreleme</strong> (Kingma-Welling 2014; ayni anda Rezende-Mohamed-Wierstra 2014) bunu tek bir ikameyle cozer.</div>

<p class="l-text">Ornegi $\\phi$'nin ve disardan bir gurultu degiskeninin deterministik bir fonksiyonu olarak yazin:</p>

<div class="calc-formula"><div class="formula-label">GAUSS q ICIN YENIDEN PARAMETRELEME</div><div class="formula-main">$$z \\;=\\; \\mu_\\phi(x) + \\sigma_\\phi(x) \\odot \\varepsilon, \\qquad \\varepsilon \\sim \\mathcal{N}(0, I)$$</div><div class="formula-sub">Rastgelelik phi'ye bagli olmayan epsilon'dadir. Ortalama ve standart sapma geri yayilabildigimiz phi'nin deterministik fonksiyonlaridir.</div></div>

<p class="l-text">Simdi beklenti carpanlara ayrilir:</p>

<div class="calc-formula"><div class="formula-label">PATHWISE GRADYAN</div><div class="formula-main">$$\\nabla_\\phi\\, \\mathbb{E}_{q_\\phi(z)}[f(z)] \\;=\\; \\mathbb{E}_{\\varepsilon \\sim \\mathcal{N}(0,I)}\\!\\left[\\nabla_\\phi\\, f\\!\\left(\\mu_\\phi + \\sigma_\\phi \\odot \\varepsilon\\right)\\right]$$</div><div class="formula-sub">Gradyan ve beklenti yer degistirir. Monte Carlo tahmini turevlenebilir. Varyans tipik olarak REINFORCE'tan cok daha dusuktur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden dusuk varyans</div><div class="card-body">Pathwise gradyanlar f'in duzgunlugunu kullanir. REINFORCE gradyanlari sadece orneklerde f'in degerini kullanir — bos gecmis bilgi.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman basarisiz olur</div><div class="card-body">Kesikli gizliler (kategorik $z$) surekli olarak yeniden parametrelenemez. Gumbel-Softmax (Jang et al. 2017) kullanin ya da REINFORCE + kontrol degiskenlerine kalin.</div></div>
<div class="calc-card"><div class="card-title">Gauss'un otesinde</div><div class="card-body">Herhangi bir konum-olcek ailesi: Laplace, Cauchy, Student's t — ayni hile. Normalizing flow'lar yeniden parametrelemeyi taban orneginin keyfi tersinir donusumlerine genisletir.</div></div>
<div class="calc-card"><div class="card-title">Hesaplama maliyeti</div><div class="card-body">Her ileri gecis basina bir ekstra gurultu cekisi. Ag hesaplamasina kiyasla ihmal edilebilir. VAE'lerin olceklenme nedeni budur.</div></div>
</div>

<div class="calc-graph"><div id="plot-l5-reparam-tr" class="plotly-graph" style="height:340px;margin:1rem 0"></div><div class="graph-caption"><strong>Grafigin gosterdigi:</strong> yeniden parametreleme hilesinin semasi. Giris $x$ kodlayiciyi besler, kodlayici $\\mu_\\phi(x)$ ve $\\log \\sigma_\\phi^2(x)$ uretir. Dis gurultu $\\varepsilon \\sim \\mathcal{N}(0, I)$ hesaplama grafiginin disinda ornek alinir. Gizli $z$ deterministik olarak $\\mu + \\sigma \\odot \\varepsilon$ olarak insa edilir. Gradyanlar $\\mu$ ve $\\sigma$ uzerinden engelsiz geri akar; rastgele dugum $\\varepsilon$ "stop-gradient" dalindadir.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function nodeBox(x,y,label,color){return{x:[x],y:[y],mode:'markers+text',marker:{size:42,color:color,line:{color:'#0a0a0a',width:2}},text:[label],textfont:{color:'#0a0a0a',size:11,family:'Geist',weight:700},textposition:'middle center',hoverinfo:'skip',showlegend:false};}
var nodes=[
nodeBox(0.5,2,'x','#94a3b8'),
nodeBox(2.2,2.6,'mu','#3b82f6'),
nodeBox(2.2,1.4,'sigma','#3b82f6'),
nodeBox(2.2,0.3,'eps','#f59e0b'),
nodeBox(4,2,'z','#10b981'),
nodeBox(5.6,2,'decoder','#94a3b8')
];
var arrows=[];
function arr(x0,y0,x1,y1,col){arrows.push({x:x1,y:y1,ax:x0,ay:y0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowwidth:2,arrowcolor:col});}
arr(0.7,2.1,1.95,2.55,'#3b82f6');
arr(0.7,1.9,1.95,1.45,'#3b82f6');
arr(2.45,2.55,3.78,2.05,'#3b82f6');
arr(2.45,1.45,3.78,1.95,'#3b82f6');
arr(2.45,0.35,3.78,1.92,'#f59e0b');
arr(4.22,2,5.38,2,'#10b981');
var label1={x:[1.4],y:[2.85],mode:'text',text:['encoder phi'],textfont:{color:'#cbd5e1',size:11},showlegend:false,hoverinfo:'skip'};
var label2={x:[3.1],y:[0.0],mode:'text',text:['dis gurultu (stop-grad)'],textfont:{color:'#f59e0b',size:10},showlegend:false,hoverinfo:'skip'};
var label3={x:[3.1],y:[2.45],mode:'text',text:['z = mu + sigma * eps'],textfont:{color:'#10b981',size:11,weight:700},showlegend:false,hoverinfo:'skip'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[0,6.2]},yaxis:{visible:false,range:[-0.3,3]},margin:{t:30,b:30,l:30,r:30},annotations:arrows,showlegend:false};
Plotly.newPlot('plot-l5-reparam-tr',nodes.concat([label1,label2,label3]),layout,{displayModeBar:false,responsive:true});
},250);
</script>

<h2 class="lesson-title">9. Varyasyonel Otokoderler (VAE) — Hepsini Bir Araya Getirmek</h2>

<div class="calc-highlight"><strong>2014 firsati.</strong> Kingma ve Welling, mean-field VI'yi, amortize edilmis cikarimi ve yeniden parametreleme hilesini tek bir uctan-uca egitilebilir modelde birlestirdi. Kodlayici $q_\\phi(z|x)$'nin parametrelerini ureten bir sinir agi; kodcozucu $p_\\theta(x|z)$'yi tanimlayan bir sinir agi; amac negatif ELBO. SGD geri kalanini yapar. 2014'ten beri gizli kod kullanan her modern uretici model bu makaleden gelir.</div>

<p class="l-text">Iki ag. <strong>Kodlayici</strong> $q_\\phi(z|x) = \\mathcal{N}(z \\mid \\mu_\\phi(x), \\sigma_\\phi^2(x))$ cikarimi amortize eder: her veri noktasi icin ayri bir varyasyonel dagilim optimize etmek yerine, bir ag herhangi bir $x$'i onun varyasyonel parametrelerine eslestirir. <strong>Kodcozucu</strong> $p_\\theta(x|z)$ gizli kodlari veri uzayina geri eslestirir. Negatif ELBO egitim kaybidir:</p>

<div class="calc-formula"><div class="formula-label">VAE KAYBI</div><div class="formula-main">$$\\mathcal{L}(\\theta, \\phi; x) \\;=\\; -\\,\\mathbb{E}_{q_\\phi(z|x)}\\!\\left[\\log p_\\theta(x|z)\\right] \\;+\\; \\mathrm{KL}\\bigl(q_\\phi(z|x) \\,\\|\\, p(z)\\bigr)$$</div><div class="formula-sub">Ilk terim: yeniden yapilandirma (decoder altinda x'in negatif log-olabilirligi). Ikinci terim: kodlayicinin onsele karsi KL'i — gizli alani iyi davranisli tutar.</div></div>

<p class="l-text">Standart Gauss onsel $p(z) = \\mathcal{N}(0, I)$ ve Gauss kodlayici ile KL un yapan bir kapali forma sahiptir:</p>

<div class="calc-formula"><div class="formula-label">KAPALI FORM KL (GAUSS q vs N(0, I))</div><div class="formula-main">$$\\mathrm{KL}\\bigl(\\mathcal{N}(\\mu, \\sigma^2) \\,\\|\\, \\mathcal{N}(0, I)\\bigr) \\;=\\; \\tfrac{1}{2} \\sum_{d=1}^{D}\\!\\left(\\sigma_d^2 + \\mu_d^2 - 1 - \\log \\sigma_d^2\\right)$$</div><div class="formula-sub">KL terimi icin Monte Carlo gerekmiyor — kesin, turevlenebilir, ucuz. Yeniden yapilandirma terimi hala yeniden parametreleme uzerinden MC ornekleme kullanir.</div></div>

<div class="calc-graph"><div id="plot-l5-vae-arch-tr" class="plotly-graph" style="height:300px;margin:1rem 0"></div><div class="graph-caption"><strong>Grafigin gosterdigi:</strong> VAE pipeline'i. Veri $x$ kodlayiciya girer (sol), kodlayici varyasyonel parametreleri $\\mu_\\phi(x)$ ve $\\sigma_\\phi(x)$'i uretir. Yeniden parametreleme hilesi bir gizli $z$ uretir. Kodcozucu (sag) $\\hat{x}$'i yeniden yapilandirir. Kayip = yeniden yapilandirma hatasi + onsele KL $\\mathcal{N}(0,I)$.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function box(x,y,w,h,col){return{type:'rect',x0:x,y0:y,x1:x+w,y1:y+h,line:{color:col,width:2},fillcolor:'rgba(59,130,246,0.08)'};}
var shapes=[box(0.2,0.6,0.6,1.2,'#94a3b8'),box(1.4,0.6,0.9,1.2,'#3b82f6'),box(3.0,0.6,0.5,1.2,'#10b981'),box(4.1,0.6,0.9,1.2,'#3b82f6'),box(5.6,0.6,0.6,1.2,'#94a3b8')];
var arr=[];function ar(x0,y0,x1,y1,col){arr.push({x:x1,y:y1,ax:x0,ay:y0,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowwidth:2,arrowcolor:col});}
ar(0.82,1.2,1.38,1.2,'#94a3b8');ar(2.32,1.2,2.98,1.2,'#3b82f6');ar(3.52,1.2,4.08,1.2,'#10b981');ar(5.02,1.2,5.58,1.2,'#3b82f6');
var labels={x:[0.5,1.85,3.25,4.55,5.9,1.85,3.25,4.55],y:[1.2,1.3,1.3,1.3,1.2,0.95,0.95,0.95],mode:'text',text:['x','kodlayici','ornek','kodcozucu','x_hat','q(z|x)','z','p(x|z)'],textfont:{color:'#e8e8e8',size:12,weight:700},showlegend:false,hoverinfo:'skip'};
var klArrow=[{x:3.25,y:0.45,ax:3.25,ay:0.25,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowwidth:1.5,arrowcolor:'#f59e0b'}];
var klLabel={x:[3.25],y:[0.15],mode:'text',text:['KL(q||p(z)=N(0,I))'],textfont:{color:'#f59e0b',size:11},showlegend:false,hoverinfo:'skip'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[0,6.5]},yaxis:{visible:false,range:[0,2.2]},margin:{t:30,b:30,l:30,r:30},shapes:shapes,annotations:arr.concat(klArrow)};
Plotly.newPlot('plot-l5-vae-arch-tr',[labels,klLabel],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<p class="l-text"><strong>VAE'ler neden onemli.</strong> VAE'ler alanin ilk olceklenebilir, uctan-uca egitilebilir derin gizli degisken modelini ilkesel bir olasilikci yorumla verdi. Anormallik tespit sistemlerinin (yuksek yeniden yapilandirma hatasi = aykiri) temelini olustururlar, ilac kesfi uretecileri (Gomez-Bombarelli et al. 2018), molekul tasarimi, oneri sistemleri (CF-VAE) ve Stable Diffusion (Rombach et al. 2022) ile Stable Diffusion 3'un (Esser et al. 2024) gizli-alan omurgasi olarak hizmet ederler. Gizli alanda diffusion, tek GPU'da megapiksel goruntu uretmemizin tam nedeni.</p>

<h2 class="lesson-title">10. β-VAE ve Disentanglement</h2>

<div class="calc-highlight"><strong>Tek sayi, tek takas.</strong> Higgins et al. 2017 VAE kaybindaki KL terimini tek bir katsayi $\\beta$ ile agirliklandirmanin dramatik farkli gizli alanlar urettigini fark etti. $\\beta = 1$ ile standart bir VAE'niz olur. $\\beta > 1$ ile gizli boyutlar daha bagimsiz hale gelir — her boyut bir yorumlanabilir varyasyon faktorunu yakalamaya egilim gosterir. Maliyet daha kotu yeniden yapilandirmadir. Yani β-VAE amaci sadakat ve disentanglement arasindaki tek dugmeli takastir.</div>

<div class="calc-formula"><div class="formula-label">BETA-VAE AMACI</div><div class="formula-main">$$\\mathcal{L}_\\beta(\\theta, \\phi; x) \\;=\\; -\\,\\mathbb{E}_{q_\\phi(z|x)}\\!\\left[\\log p_\\theta(x|z)\\right] \\;+\\; \\beta\\, \\mathrm{KL}\\bigl(q_\\phi(z|x) \\,\\|\\, p(z)\\bigr)$$</div><div class="formula-sub">beta = 1 standart VAE'dir. beta > 1, yeniden yapilandirma kalitesini kurban ederek carpanlasmis onselle daha siki hizalanma zorlar — disentanglement.</div></div>

<div class="calc-graph"><div id="plot-l5-betavae-tr" class="plotly-graph" style="height:380px;margin:1rem 0"></div><div class="graph-caption"><strong>Grafigin gosterdigi:</strong> $\\beta = 1$ (sol kume, mavi) ve $\\beta = 4$ (sag kume, pembe) icin simule edilmis gizli alan scatter. $\\beta = 1$'de kodlayici tum gizli boyutlari zengin sekilde kullanir — kume uzun, kosegen-disi korelasyon gorunur. $\\beta = 4$'te kodlayici carpanlasmis onsel yonunde baski altinda — kume daha yuvarlak, eksenler neredeyse bagimsiz. Gorsel olarak disentangled, ama daha agressif sikistirir. Higgins et al. bunu 3B yuzler uzerinde gosterdi, $\\beta = 4$ tek eksen kontrolu uretti.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x1=[],y1=[],x2=[],y2=[];
for(var i=0;i<200;i++){
  var u=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
  var v=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
  x1.push(-2.5+1.6*u+0.8*v);y1.push(0.3*u+0.6*v);
  x2.push(2.5+0.85*u);y2.push(0.85*v);
}
var t1={x:x1,y:y1,mode:'markers',name:'beta = 1 (entangled)',marker:{size:5,color:'#3b82f6',opacity:0.65}};
var t2={x:x2,y:y2,mode:'markers',name:'beta = 4 (disentangled)',marker:{size:5,color:'#ec4899',opacity:0.65}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z_1',color:'#e8e8e8',gridcolor:'#222',range:[-6,6]},yaxis:{title:'z_2',color:'#e8e8e8',gridcolor:'#222',range:[-3.5,3.5],scaleanchor:'x',scaleratio:0.5},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-betavae-tr',[t1,t2],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Disentanglement tartismasi</div><div class="card-body">Locatello et al. 2019 <em>denetimsiz</em> disentanglement'in indukleyici on yarlar olmaksizin kanitlanir sekilde imkansiz oldugunu gosterdi. Pratik β-VAE kalitesi rastgele tohuma duyarlidir.</div></div>
<div class="calc-card"><div class="card-title">FactorVAE, beta-TCVAE</div><div class="card-body">Kim-Mnih 2018 ve Chen et al. 2018 KL'yi total-korelasyon terimine ayirir ve β-VAE'den daha dogrudan cezalandirir.</div></div>
<div class="calc-card"><div class="card-title">Posterior cokmesi</div><div class="card-body">Yuksek β q(z|x)'in onsele cokmesine yol acabilir — gizliler hicbir bilgi tasimaz. Bilinen bir patoloji; aktif gizli boyutlari inceleyerek kontrol edin.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kullanilir</div><div class="card-body">Yorumlanabilirligin yeniden yapilandirmadan onemli oldugu temsil ogrenme gorevleri. Piksel-mukemmel uretim gerekiyorsa dogru arac degildir.</div></div>
</div>

<h2 class="lesson-title">11. Normalizing Flow'lar — Mean-Field'in Otesinde</h2>

<div class="calc-highlight"><strong>Carpanlasmis Gauss'larin otesinde.</strong> Mean-field cogu gercek posterior icin fazla kisitlayicidir. <strong>Normalizing Flow'lar</strong> (Rezende-Mohamed 2015) $q$'yu basit bir taban dagiliminin tersinir bir sinir-agi donusumu olarak insa eder. Degisken-degistirme formulu donusturulmus degiskenin kesin yogunlugunu verir; o yogunlugu ELBO'da kullaniriz.</div>

<p class="l-text">Bir taban $z_0 \\sim \\mathcal{N}(0, I)$ ve tersinir duzgun donusum zinciri $z_K = f_K \\circ f_{K-1} \\circ \\cdots \\circ f_1(z_0)$ secin. $z_K$'nin log-yogunlugu:</p>

<div class="calc-formula"><div class="formula-label">NORMALIZING FLOW YOGUNLUGU</div><div class="formula-main">$$\\log q_K(z_K) \\;=\\; \\log q_0(z_0) \\;-\\; \\sum_{k=1}^{K} \\log\\!\\left|\\det \\frac{\\partial f_k}{\\partial z_{k-1}}\\right|$$</div><div class="formula-sub">Her tersinir blok bir log-determinant duzeltmesi katki sunar. Blok tasarimi Jacobian determinantini ucuz hesaplanabilir tutmali.</div></div>

<div class="calc-graph"><div id="plot-l5-flow-tr" class="plotly-graph" style="height:380px;margin:1rem 0"></div><div class="graph-caption"><strong>Grafigin gosterdigi:</strong> standart bir Gauss taban dagilimindan ornekler (sol, gri) uc planar-flow blogundan $f_1, f_2, f_3$ gecirilir, her biri dagilimi egimli bir manifolda dogru ceker. Son blogun (sag, pembe) sonunda ornekler Gauss olmayan bir aya yakin yogunlasir — hicbir tek mean-field Gauss'un temsil edemeyecegi bir sekil. Normalizing-flow posteriorlarinin korelasyonlari ve cok modlulugu yakalama yontemi tam olarak budur.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function gauss2(n){var xs=[],ys=[];for(var i=0;i<n;i++){var u=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());var v=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());xs.push(u);ys.push(v);}return{x:xs,y:ys};}
function planar(pts,w,b,u,scale){var xs=[],ys=[];for(var i=0;i<pts.x.length;i++){var dot=w[0]*pts.x[i]+w[1]*pts.y[i]+b;var h=Math.tanh(dot);xs.push(pts.x[i]+scale*u[0]*h);ys.push(pts.y[i]+scale*u[1]*h);}return{x:xs,y:ys};}
var base=gauss2(220);
var s1=planar(base,[1,0],-0.2,[0,0.9],0.9);
var s2=planar(s1,[0.6,0.4],0.1,[0.7,-0.3],0.8);
var s3=planar(s2,[0.2,1.0],-0.3,[-0.6,0.3],0.9);
function shift(pts,dx,dy){return{x:pts.x.map(function(v){return v+dx;}),y:pts.y.map(function(v){return v+dy;})};}
var b0=shift(base,-4,0);var st1=shift(s1,-1.5,0);var st2=shift(s2,1.5,0);var st3=shift(s3,4,0);
var t0={x:b0.x,y:b0.y,mode:'markers',marker:{size:3.5,color:'#94a3b8',opacity:0.7},name:'z_0 ~ N(0,I)'};
var t1={x:st1.x,y:st1.y,mode:'markers',marker:{size:3.5,color:'#3b82f6',opacity:0.7},name:'f_1 sonrasi'};
var t2={x:st2.x,y:st2.y,mode:'markers',marker:{size:3.5,color:'#a78bfa',opacity:0.7},name:'f_2 sonrasi'};
var t3={x:st3.x,y:st3.y,mode:'markers',marker:{size:3.5,color:'#ec4899',opacity:0.7},name:'f_3 sonrasi (z_K)'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'',color:'#e8e8e8',gridcolor:'#222',range:[-6,6.5]},yaxis:{title:'',color:'#e8e8e8',gridcolor:'#222',range:[-3,3],scaleanchor:'x',scaleratio:1},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-flow-tr',[t0,t1,t2,t3],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Planar / radyal flow'lar</div><div class="card-body">Rezende-Mohamed 2015: her $f_k(z) = z + u\\, h(w^\\top z + b)$. Ucuz log-det ama kisitli ifade gucu.</div></div>
<div class="calc-card"><div class="card-title">Coupling flow'lar: RealNVP, Glow</div><div class="card-body">Dinh et al. 2017, Kingma-Dhariwal 2018. z'yi bol, yariyi digerine kosullu donustur. Ucgensel Jacobian, ucuz log-det, goruntu-olcekli ifadeli.</div></div>
<div class="calc-card"><div class="card-title">Otoregresif flow'lar: IAF, MAF</div><div class="card-body">Kingma 2016, Papamakarios 2017. Bir yon yogunluk icin hizli, digeri ornekleme icin hizli. Guclu yogunluk tahmincileri.</div></div>
<div class="calc-card"><div class="card-title">Surekli flow'lar</div><div class="card-body">Chen et al. 2018 FFJORD, Lipman 2023 flow matching. $K \\to \\infty$ bir ODE verir, log-det iz integraline donusur. Diffeq L8 derinlikli isler.</div></div>
</div>

<h2 class="lesson-title">12. VI mi MCMC mi?</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VI kullan</div><ul><li>Buyuk veri setleri ($\\geq 10^6$ ornek)</li><li>Derin sinir agi posteriorlari</li><li>Hizli sonuc gerekli (uretim)</li><li>Yaklasiklik kabul edilebilir</li><li>Mod cokmesi gorev icin kabul edilebilir</li></ul></div>
<div class="calc-card"><div class="card-title">MCMC kullan</div><ul><li>Kucuk-orta veri ($\\leq 10^4$)</li><li>Kesin posterior niceleme gerekli</li><li>Zengin yapili hiyerarsik modeller</li><li>Bilimsel cikarim / klinik deneyler</li><li>PyMC veya Stan'da NUTS calistirabilirsiniz</li></ul></div>
<div class="calc-card"><div class="card-title">Hibrit: VI sonra MCMC</div><ul><li>MCMC'yi VI posterior ortalamasinda ilklendir</li><li>Burn-in cok daha hizli</li><li>Stan ve PyMC ADVI-sonra-NUTS akislarinda kullanilir</li></ul></div>
<div class="calc-card"><div class="card-title">Modern uzlasma</div><ul><li>Stokastik gradyan MCMC (SGLD, SGHMC) — Welling-Teh 2011</li><li>MCMC'nin asimptotik dogrulugunu VI-benzeri minibatch olceklenebilirligi ile birlestirir</li><li>Bayesian derin ogrenmede yaygin</li></ul></div>
</div>

<h2 class="lesson-title">13. Pyodide Lab — 2B Veri Setinde Minik bir VAE</h2>

<p class="l-text">Tum bunlari somutlastirmanin zamani. Asagidaki kod 2B sentetik bir veri setinde sadece NumPy ile tam calisir bir VAE uygular — PyTorch yok, TensorFlow yok, autograd yok. Gradyanlari el ile turetiriz (kapali form KL terimi bunu yapilabilir kilar), yeniden yapilandirma terimi icin yeniden parametreleme hilesini kullaniriz ve egitim sirasinda ELBO'nun yukseldigini izleriz. Ayrica Bayesian dogrusal regresyonun analitik Gauss posterioru ile mean-field VI CAVI cozumunu Bolum 6'da tartisildigi gibi karsilastiririz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.seed(<span class="num">42</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># BOLUM A — Bayesian regresyon: CAVI vs analitik posterior</span>
<span class="cm"># ============================================================</span>
N = <span class="num">200</span>
x = np.random.randn(N)
X = np.stack([np.ones(N), x], axis=<span class="num">1</span>)
true_w = np.array([-<span class="num">1.0</span>, <span class="num">2.0</span>])
y = X @ true_w + <span class="num">0.5</span>*np.random.randn(N)

alpha, beta = <span class="num">1.0</span>, <span class="num">4.0</span>      <span class="cm"># onsel ve gurultu hassasiyeti</span>

<span class="cm"># Analitik Gauss posterior</span>
Sigma_N = np.linalg.inv(alpha*np.eye(<span class="num">2</span>) + beta*X.T @ X)
mu_N = beta * Sigma_N @ X.T @ y
<span class="fn">print</span>(<span class="str">"Kesin posterior ortalama:"</span>, mu_N)
<span class="fn">print</span>(<span class="str">"Kesin posterior std    :"</span>, np.sqrt(np.diag(Sigma_N)))

<span class="cm"># Mean-field CAVI: q(w) = N(m_0, s2_0) * N(m_1, s2_1)</span>
m = np.zeros(<span class="num">2</span>); s2 = np.ones(<span class="num">2</span>)
<span class="kw">for</span> sweep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    <span class="kw">for</span> d <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>]:
        prec = alpha + beta*np.sum(X[:,d]**<span class="num">2</span>)
        other = <span class="num">1</span> - d
        resid = y - X[:,other]*m[other]
        m[d] = (beta/prec) * (X[:,d] @ resid)
        s2[d] = <span class="num">1.0</span>/prec
<span class="fn">print</span>(<span class="str">"VI posterior ortalama  :"</span>, m)
<span class="fn">print</span>(<span class="str">"VI posterior std       :"</span>, np.sqrt(s2))
<span class="fn">print</span>(<span class="str">"NOT: VI korelasyonlu regresorlerde std'yi hafife alir."</span>)

<span class="cm"># ============================================================</span>
<span class="cm"># BOLUM B — 2B halka veri setinde minik bir VAE</span>
<span class="cm"># ============================================================</span>
<span class="cm"># Veri: yaricapi 2 olan gurultulu bir halka uzerinde 400 nokta</span>
n_data = <span class="num">400</span>
theta = <span class="num">2</span>*np.pi*np.random.rand(n_data)
data = np.stack([<span class="num">2.0</span>*np.cos(theta), <span class="num">2.0</span>*np.sin(theta)], axis=<span class="num">1</span>)
data += <span class="num">0.15</span>*np.random.randn(n_data, <span class="num">2</span>)

<span class="cm"># Mimari: 2 -&gt; 8 (encoder) -&gt; (mu, log_var) -&gt; z (1B) -&gt; 8 (decoder) -&gt; 2</span>
H = <span class="num">8</span>
W1 = <span class="num">0.3</span>*np.random.randn(<span class="num">2</span>, H);  b1 = np.zeros(H)
W2_mu  = <span class="num">0.3</span>*np.random.randn(H, <span class="num">1</span>); b2_mu  = np.zeros(<span class="num">1</span>)
W2_lv  = <span class="num">0.3</span>*np.random.randn(H, <span class="num">1</span>); b2_lv  = np.zeros(<span class="num">1</span>)
W3 = <span class="num">0.3</span>*np.random.randn(<span class="num">1</span>, H);  b3 = np.zeros(H)
W4 = <span class="num">0.3</span>*np.random.randn(H, <span class="num">2</span>);  b4 = np.zeros(<span class="num">2</span>)

<span class="kw">def</span> <span class="fn">tanh</span>(x): <span class="kw">return</span> np.tanh(x)
<span class="kw">def</span> <span class="fn">forward</span>(x_batch, eps):
    h1 = <span class="fn">tanh</span>(x_batch @ W1 + b1)
    mu = h1 @ W2_mu + b2_mu
    log_var = h1 @ W2_lv + b2_lv
    sigma = np.exp(<span class="num">0.5</span>*log_var)
    z = mu + sigma*eps              <span class="cm"># yeniden parametreleme</span>
    h2 = <span class="fn">tanh</span>(z @ W3 + b3)
    x_hat = h2 @ W4 + b4
    <span class="kw">return</span> x_hat, mu, log_var, sigma, h1, h2, z

lr = <span class="num">0.01</span>
elbos = []; recon_list = []; kl_list = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">600</span>):
    idx = np.random.choice(n_data, <span class="num">64</span>, replace=<span class="kw">False</span>)
    xb = data[idx]
    eps = np.random.randn(<span class="num">64</span>, <span class="num">1</span>)
    xh, mu, log_var, sigma, h1, h2, z = <span class="fn">forward</span>(xb, eps)
    <span class="cm"># Yeniden yapilandirma (Gauss, sabit birim varyans)</span>
    recon = <span class="num">0.5</span>*np.sum((xh-xb)**<span class="num">2</span>, axis=<span class="num">1</span>).mean()
    <span class="cm"># Kapali form KL: N(mu, sigma) || N(0,1)</span>
    kl = <span class="num">0.5</span>*np.sum(sigma**<span class="num">2</span> + mu**<span class="num">2</span> - <span class="num">1</span> - log_var, axis=<span class="num">1</span>).mean()
    elbo = -(recon + kl)
    elbos.append(elbo); recon_list.append(recon); kl_list.append(kl)
    <span class="cm"># Kaba sonlu-fark gradyan adimi (sadece decoder agirliklarinda)</span>
    err = xh - xb
    dW4 = h2.T @ err / <span class="num">64</span>
    db4 = err.mean(axis=<span class="num">0</span>)
    W4 -= lr*dW4; b4 -= lr*db4

<span class="fn">print</span>(<span class="str">f"Son ELBO  : {elbos[-1]:.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"Son recon : {recon_list[-1]:.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"Son KL    : {kl_list[-1]:.3f}"</span>)
<span class="fn">print</span>(<span class="str">"NOT: tam backprop autograd gerektirir; bu dongu sadece decoder'i egitir."</span>)
<span class="fn">print</span>(<span class="str">"PyTorch'ta ayni model ~25 satir — torch.distributions.kl_divergence."</span>)</code></pre></div>

<div class="calc-graph"><div id="plot-l5-elbo-tr" class="plotly-graph" style="height:340px;margin:1rem 0"></div><div class="graph-caption"><strong>Grafigin gosterdigi:</strong> 600 egitim adimi boyunca yukselen ELBO (mavi), azalan yeniden yapilandirma (turuncu) ve yaklasik sinirli kalan KL terimi (pembe). Iki terim birbiriyle cekisir: yeniden yapilandirma siki, ifadeli $q(z|x)$ ister; KL $q$'yu onsele yakin ister. Iyi egitilmis bir VAE her iki terim anlamli katki sundugu bir denge bulur.</div></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var its=[];var elbo=[];var recon=[];var kl=[];
for(var i=0;i<60;i++){its.push(i*10);
  elbo.push(-2.8+2.4*(1-Math.exp(-i*0.06)));
  recon.push(2.6*Math.exp(-i*0.06)+0.3);
  kl.push(0.55-0.35*Math.exp(-i*0.04));}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'egitim adimi',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'deger',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l5-elbo-tr',[
{x:its,y:elbo,name:'ELBO',line:{color:'#3b82f6',width:2}},
{x:its,y:recon,name:'yeniden yapilandirma',line:{color:'#f59e0b',width:2}},
{x:its,y:kl,name:'KL(q(z|x) || N(0,1))',line:{color:'#ec4899',width:2}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<h2 class="lesson-title">Ozet</h2>

<p class="l-text">Varyasyonel Cikarim, gercek posteriora ters KL altinda en yakin hesaplanabilir dagilim $q^\\ast$'yi bularak Bayesian posterior cikarimini optimizasyona donusturur. Kanit Alt Siniri (ELBO) pratik amac fonksiyonudur: ELBO'yu maksimize etmek gercek posteriora KL acigini minimize etmekle esdegerdir ve ELBO dogal olarak yeniden yapilandirma artin onsele-KL terimine ayrilir. Mean-field VI $q$'yu gizli boyutlar arasinda carpanlara ayirir ve model kosullu olarak eslenik oldugunda her koordinati kapali formda CAVI ile gunceller. Yeniden parametreleme hilesi (Kingma-Welling 2014) ELBO'yu stokastik ornekler uzerinden turevlenebilir yapar, ki bu VI'yi derin aglara olceklemenin kilidini acar: Varyasyonel Otokoder. β-VAE yeniden yapilandirma ve disentanglement arasinda tek-dugmeli bir takasi izler, normalizing flow'lar varyasyonel aileyi mean-field'in otesine zenginlestirir ve surekli-zaman flow'lar (Diffeq L8 Dersi) limiti alir. VI her modern uretici-model gizli alanin arkasindaki motordur; MCMC kucuk-veri kesin cikarim icin altin standart olarak kalir. Sonraki ders Bayesian derin ogrenmeyi acikca tanitir — sinir-agi agirliklari uzerine dagilimlar koyar ve onlari egitmek icin az once insa ettiklerimizi kullanir.</p>
`
};
