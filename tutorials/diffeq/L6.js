window.DIFFEQ_L6 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text">Up to this lesson every differential equation we have written has been <em>deterministic</em>. Tell us the initial condition, fix the coefficients, and the future is decided once and for all. The trajectory of a damped oscillator from a given start is a single curve. The temperature profile of a rod is a single function. Reality cooperates with this view only when noise is negligible. The moment we look at a stock price tick by tick, or a pollen grain jittering on a microscope slide, or the latent state of a diffusion generative model halfway through denoising, the picture changes. The path is no longer a curve; it is a <em>distribution of curves</em>. We need a calculus of randomness.</p>

<p class="l-text">This lesson introduces <strong>stochastic differential equations</strong> &mdash; SDEs &mdash; the language for describing systems whose evolution combines a smooth drift with a noisy kick at every instant. We will build the Wiener process from scratch, see why classical calculus breaks down for it, learn the new chain rule (Itō's lemma) that takes its place, and then watch the entire machinery snap into focus around modern AI: <strong>every Diffusion generative model you have used &mdash; DDPM, Stable Diffusion, Sora, Flow Matching &mdash; is at heart a numerical SDE solver paired with a neural network that learns one specific object: the score function $\\nabla \\log p_t(x)$.</strong> Out of all the lessons in this track, this is the one that pays off most directly when you sit down to read a generative-modelling paper.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a Wiener process (Brownian motion) and read the SDE notation $dX = f\\,dt + g\\,dW$ fluently</li>
<li>Explain why $(dW)^2 = dt$ forces a new calculus and apply <strong>Itō's lemma</strong> as the stochastic chain rule</li>
<li>Solve Geometric Brownian motion in closed form using Itō's lemma on $\\log S$</li>
<li>Write down the <strong>Fokker-Planck</strong> equation for the density of an SDE solution</li>
<li>State the Anderson reverse-time SDE and identify the <strong>score function</strong> $\\nabla \\log p_t$ as the only learnable object</li>
<li>Connect DDPM (Ho 2020), score-based SDEs (Song 2021), EDM (Karras 2022) and Flow Matching (Lipman 2023) to this single mathematical core</li>
</ul>
</div>

<h2 class="lesson-title">1. From Deterministic to Stochastic</h2>

<p class="l-text">Recall the ODE setup. A first-order ordinary differential equation looks like</p>

<div class="calc-formula"><div class="formula-label">ORDINARY DIFFERENTIAL EQUATION</div><div class="formula-main">$$\\frac{dx}{dt} \\;=\\; f(x, t), \\qquad x(0) = x_0$$</div><div class="formula-sub">Pick a starting point, pick a drift law, and the trajectory $x(t)$ is determined for all later times. No two trajectories with the same start can ever cross.</div></div>

<p class="l-text">A <strong>stochastic differential equation</strong> adds a noisy term that nudges the solution at every instant. We write it in differential form because the noise term is too rough to support division by $dt$:</p>

<div class="calc-formula"><div class="formula-label">STOCHASTIC DIFFERENTIAL EQUATION (ITŌ FORM)</div><div class="formula-main">$$dX_t \\;=\\; f(X_t, t)\\, dt \\;+\\; g(X_t, t)\\, dW_t$$</div><div class="formula-sub">$f$ is the <em>drift coefficient</em>, $g$ is the <em>diffusion coefficient</em>, and $dW_t$ is an infinitesimal increment of the <strong>Wiener process</strong> &mdash; the mathematical embodiment of pure white noise.</div></div>

<p class="l-text">Two different starts at the same point produce two different sample paths because the random kicks differ. So the solution of an SDE is not a single function $X(t)$ but a whole <strong>stochastic process</strong>: a family of random variables $\\{X_t\\}_{t \\geq 0}$ indexed by time. We can ask about the mean trajectory, the variance around it, the probability density $p_t(x)$ at each time, or the joint distribution at two different times. The deterministic ODE is the limit $g \\to 0$ in which all those distributions collapse to a single curve.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Drift $f(X, t)$</div><div class="card-body">The deterministic push. If you average many sample paths starting from the same point the average follows roughly the ODE $\\dot{\\bar{x}} = f$. Encodes physics, economics, model preferences.</div></div>
<div class="calc-card"><div class="card-title">Diffusion $g(X, t)$</div><div class="card-body">The size of the random kick. Multiplies the white-noise increment $dW$. Larger $g$ means wilder paths, faster spread of the probability density, more uncertainty.</div></div>
<div class="calc-card"><div class="card-title">Sample path</div><div class="card-body">One particular realisation of the random process. You can simulate one by drawing one stream of Gaussian noise. Each generated image from Stable Diffusion is a single sample path through state space.</div></div>
<div class="calc-card"><div class="card-title">Density $p_t(x)$</div><div class="card-body">The probability density of $X_t$. Evolves in time according to the Fokker-Planck PDE we will derive in Section 7. This is the macroscopic counterpart of the microscopic stochastic trajectories.</div></div>
</div>

<div class="l-note"><strong>Where AI lives in this picture.</strong> A modern Diffusion model treats <em>data</em> (an image, an audio clip, a 3D shape) as a sample from some unknown density $p_{\\text{data}}$. The forward process is an SDE that slowly destroys structure by adding noise; the reverse process is another SDE that reconstructs structure by removing noise. A neural network is trained to estimate the only piece of information the reverse SDE needs about the data density &mdash; the score $\\nabla \\log p_t$. Everything else is calculus.</div>

<h2 class="lesson-title">2. Brownian Motion (Wiener Process)</h2>

<p class="l-text">Before we can take SDEs seriously we need to construct the noise driver $W_t$. The object we want is <strong>standard Brownian motion</strong>, also called the <strong>Wiener process</strong> after Norbert Wiener, who in 1923 supplied the first rigorous mathematical existence proof. Robert Brown observed the underlying physical phenomenon in 1827, watching pollen grains in water jitter under bombardment by molecules; Einstein in his 1905 <em>miracle year</em> paper gave the first quantitative analysis.</p>

<div class="calc-formula"><div class="formula-label">DEFINING PROPERTIES OF $W_t$</div><div class="formula-main">$$W_0 = 0; \\quad W_{t+s} - W_s \\;\\sim\\; \\mathcal{N}(0, t); \\quad \\text{increments over disjoint intervals are independent}; \\quad t \\mapsto W_t \\text{ is continuous a.s.}$$</div><div class="formula-sub">Four axioms. Start at zero. Gaussian increments whose variance equals the elapsed time. Disjoint increments are independent. Sample paths are continuous functions of $t$ (with probability one).</div></div>

<p class="l-text">From these axioms three remarkable consequences follow. First, $\\mathbb{E}[W_t] = 0$ and $\\mathrm{Var}(W_t) = t$, so the typical excursion at time $t$ has size $\\sqrt{t}$ &mdash; not $t$. This $\\sqrt{t}$ scaling is the signature of diffusion. Second, although every sample path is continuous, <strong>no sample path is differentiable at any point</strong>. The path is so rough that the slope diverges everywhere; this is exactly why we cannot write $dW/dt$ as a function. Third, the total variation of any sample path on any interval is infinite, but the <em>quadratic</em> variation is finite and equal to the length of the interval. This last property is the technical seed from which Itō calculus grows.</p>

<div id="plot-l6-brownian-en" class="plotly-graph"></div>
<script>setTimeout(function(){
function box(){var u=Math.random();var v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var N=600;var T=1.0;var dt=T/N;var sd=Math.sqrt(dt);
var ts=[];for(var i=0;i<=N;i++){ts.push(i*dt);}
var colors=['#3b82f6','#f59e0b','#10b981','#ef4444','#a78bfa'];
var traces=[];
for(var k=0;k<5;k++){var w=[0];for(var i=1;i<=N;i++){w.push(w[i-1]+sd*box());}
traces.push({x:ts,y:w,mode:'lines',name:'path '+(k+1),line:{color:colors[k],width:1.6}});}
var envHi=[];var envLo=[];for(var i=0;i<=N;i++){envHi.push(2*Math.sqrt(ts[i]));envLo.push(-2*Math.sqrt(ts[i]));}
traces.push({x:ts,y:envHi,mode:'lines',name:'±2√t envelope',line:{color:'#9ca3af',width:1.2,dash:'dot'}});
traces.push({x:ts,y:envLo,mode:'lines',line:{color:'#9ca3af',width:1.2,dash:'dot'},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'time t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'W(t)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-brownian-en',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> five independent sample paths of standard Brownian motion on $[0, 1]$ generated by accumulating Gaussian increments with variance $dt = 1/600$. Each path starts at zero and wanders unpredictably. The dotted grey curves trace the $\\pm 2\\sqrt{t}$ envelope, a $95\\%$ confidence band: the standard deviation at time $t$ is exactly $\\sqrt{t}$, so most paths stay inside this widening cone. The paths are visibly continuous yet visibly non-differentiable &mdash; zoom into any segment and the same jagged texture repeats.</div></div>

<div class="calc-highlight"><strong>The $\\sqrt{t}$ rule and why it matters in AI.</strong> In the variance-preserving diffusion of DDPM the noise added by time $t$ has standard deviation $\\sqrt{1 - \\bar{\\alpha}_t}$ which approaches $1$ as $t$ grows. The reason the schedule looks the way it does is precisely the $\\sqrt{t}$ scaling: to make the noise level grow linearly in some sense you have to compensate the natural square-root behaviour with a carefully tuned drift coefficient. Every noise schedule you see in a Diffusion paper is a battle with the $\\sqrt{t}$ rule.</div>

<h2 class="lesson-title">3. Why $dW$ Isn't a Normal Differential</h2>

<p class="l-text">Classical differentials obey $dx \\to 0$ smoothly as the time step shrinks, and products of differentials such as $(dt)^2$ or $dx\\, dt$ are higher-order infinitesimals that we discard. With $dW$ the rules change. The Brownian increment over a step of length $\\Delta t$ has standard deviation $\\sqrt{\\Delta t}$, so its <em>square</em> has expectation $\\Delta t$ &mdash; not $(\\Delta t)^2$. In the limit this becomes the famous identity</p>

<div class="calc-formula"><div class="formula-label">THE ITŌ TABLE</div><div class="formula-main">$$(dW_t)^2 \\;=\\; dt, \\qquad dW_t \\cdot dt \\;=\\; 0, \\qquad (dt)^2 \\;=\\; 0$$</div><div class="formula-sub">Multiplication rules for stochastic differentials. The first rule is the heart of the entire subject: the square of the Brownian increment is not negligible, it is exactly the time step.</div></div>

<p class="l-text">This single identity wrecks the classical chain rule. If you naively expand $f(W_t + dW_t)$ to first order you would write $f(W_t) + f'(W_t)\\, dW_t$ and stop. But the second-order term contains $(dW_t)^2 = dt$, which is the <em>same order</em> as the first-order time differential and cannot be dropped. Stochastic Taylor expansions therefore go one term deeper than deterministic ones, and the extra term is the Itō correction we are about to meet formally.</p>

<div class="calc-example"><div class="example-label">A QUICK NUMERICAL CHECK</div><div class="example-body">Simulate Brownian motion with $\\Delta t = 10^{-4}$ over $[0, 1]$. Compute $S_N = \\sum_n (\\Delta W_n)^2$ where each $\\Delta W_n \\sim \\mathcal{N}(0, \\Delta t)$. The expectation of $S_N$ is $N \\cdot \\Delta t = 1$ and its variance is $2 (\\Delta t)^2 \\cdot N = 2 \\Delta t \\to 0$. So $S_N \\to 1$ almost surely: the quadratic variation of Brownian motion on $[0, 1]$ is exactly $1$, regardless of which sample path you draw. The deterministic identity $(dW)^2 = dt$ is the infinitesimal version of this fact.</div></div>

<div class="l-note"><strong>Why DDPM uses $\\sqrt{1 - \\beta_t}$, not $1 - \\beta_t$.</strong> The DDPM forward step is $x_t = \\sqrt{1 - \\beta_t}\\, x_{t-1} + \\sqrt{\\beta_t}\\, \\varepsilon$. Why two different square roots? Because variance adds, not standard deviation. If $\\beta_t$ is the variance of the noise injected this step, the standard deviation is $\\sqrt{\\beta_t}$. The scaling factor on $x_{t-1}$ is then chosen so that the marginal variance stays at $1$: $(1 - \\beta_t) \\cdot 1 + \\beta_t = 1$. This is just $(dW)^2 = dt$ in disguise.</div>

<h2 class="lesson-title">4. Itō Calculus</h2>

<p class="l-text">We need to give meaning to a stochastic integral of the form $\\int_0^T g(X_t, t)\\, dW_t$. The Riemann construction does not work because Brownian paths have infinite variation: depending on whether you sample the integrand at the left endpoint, the right endpoint, or the midpoint of each partition cell, you get genuinely different answers in the limit. There is no single "natural" choice; you must choose a convention and stick with it.</p>

<div class="calc-formula"><div class="formula-label">THE ITŌ INTEGRAL</div><div class="formula-main">$$\\int_0^T g(X_t, t)\\, dW_t \\;=\\; \\lim_{\\|\\Pi\\| \\to 0} \\sum_{n=0}^{N-1} g(X_{t_n}, t_n)\\, \\bigl(W_{t_{n+1}} - W_{t_n}\\bigr)$$</div><div class="formula-sub">Itō's choice: always evaluate the integrand at the <em>left</em> endpoint $t_n$ of each partition cell, then take the limit as the mesh size $\\|\\Pi\\| \\to 0$. The result is well-defined and converges in $L^2$.</div></div>

<p class="l-text">The reason for the left-endpoint rule is not arbitrary &mdash; it is a fairness condition. In a stochastic model the integrand $g(X_{t_n}, t_n)$ represents a decision (a portfolio holding, a controller setting, a model state) at time $t_n$; the increment $W_{t_{n+1}} - W_{t_n}$ is the random outcome that follows. The Itō convention says: <strong>your decision at $t_n$ must be made <em>before</em> you see the future noise.</strong> Decisions are <em>non-anticipating</em>. Any other convention would let the integrand peek into the future, which destroys the connection to causal models.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Itō convention (left endpoint)</div><div class="card-body">Non-anticipating. Gives a martingale: $\\mathbb{E}\\bigl[\\int_0^T g\\, dW\\bigr] = 0$. The right framework for finance, optimal control, and diffusion-model training where decisions cannot see the future.</div></div>
<div class="calc-card"><div class="card-title">Stratonovich convention (midpoint)</div><div class="card-body">Symmetric. Obeys the ordinary chain rule but is <em>not</em> non-anticipating. Preferred in physics when noise has a small but non-zero correlation time, and convenient for SDEs on manifolds.</div></div>
<div class="calc-card"><div class="card-title">Itō isometry</div><div class="card-body">$\\mathbb{E}\\bigl[\\bigl(\\int_0^T g\\, dW\\bigr)^2\\bigr] = \\mathbb{E}\\bigl[\\int_0^T g^2\\, dt\\bigr]$. The variance of an Itō integral equals an ordinary time integral of $g^2$. Powerful tool for computing second moments.</div></div>
<div class="calc-card"><div class="card-title">Translation between the two</div><div class="card-body">A Stratonovich SDE $dX = f\\, dt + g \\circ dW$ equals the Itō SDE $dX = (f + \\tfrac{1}{2} g\\, g')\\, dt + g\\, dW$. The extra drift is the <em>Itō-Stratonovich correction</em> and arises from the $(dW)^2 = dt$ rule.</div></div>
</div>

<div class="l-note"><strong>Which convention do Diffusion models use?</strong> Itō. All formulas you will see for DDPM, score SDEs and Flow Matching are written in Itō form, with non-anticipating integrands. The training loss is a conditional expectation given the current state, which lines up perfectly with the Itō framework.</div>

<h2 class="lesson-title">5. Itō's Lemma — The Chain Rule for SDEs</h2>

<p class="l-text">If $X_t$ solves the SDE $dX_t = f(X_t, t)\\, dt + g(X_t, t)\\, dW_t$ and $Y_t = \\varphi(X_t, t)$ for a smooth function $\\varphi$, what SDE does $Y_t$ satisfy? The deterministic chain rule would say $dY = (\\partial \\varphi / \\partial t + (\\partial \\varphi / \\partial x) \\dot X)\\, dt$. Stochastically we have to expand to second order, because $(dW)^2 = dt$.</p>

<div class="calc-formula"><div class="formula-label">ITŌ'S LEMMA</div><div class="formula-main">$$dY_t \\;=\\; \\Bigl[\\, \\frac{\\partial \\varphi}{\\partial t} + f \\frac{\\partial \\varphi}{\\partial x} + \\frac{1}{2} g^2 \\frac{\\partial^2 \\varphi}{\\partial x^2}\\,\\Bigr] dt \\;+\\; g \\frac{\\partial \\varphi}{\\partial x}\\, dW_t$$</div><div class="formula-sub">The deterministic chain rule plus an extra term $\\tfrac{1}{2} g^2 \\varphi_{xx}\\, dt$, the <em>Itō correction</em>, which is purely a consequence of $(dW)^2 = dt$.</div></div>

<p class="l-text"><strong>Sketch of proof.</strong> Apply the Taylor expansion of $\\varphi$ around $(X_t, t)$ to second order:</p>

<div class="calc-formula"><div class="formula-label">SECOND-ORDER TAYLOR</div><div class="formula-main">$$d\\varphi \\;=\\; \\varphi_t\\, dt + \\varphi_x\\, dX + \\tfrac{1}{2} \\varphi_{xx}\\, (dX)^2 + \\cdots$$</div><div class="formula-sub">Now substitute $dX = f\\, dt + g\\, dW$ and expand $(dX)^2$ with the Itō multiplication table.</div></div>

<div class="calc-formula"><div class="formula-label">EVALUATING $(dX)^2$</div><div class="formula-main">$$(dX)^2 \\;=\\; (f\\, dt + g\\, dW)^2 \\;=\\; f^2 (dt)^2 + 2 f g\\, dt\\, dW + g^2 (dW)^2 \\;=\\; g^2\\, dt$$</div><div class="formula-sub">Two of the three terms vanish: $(dt)^2 = 0$ and $dt \\cdot dW = 0$. Only $(dW)^2 = dt$ survives.</div></div>

<p class="l-text">Plug this back, collect the $dt$ and $dW$ contributions, and Itō's lemma drops out. The pattern generalises: for $\\varphi(X^1, \\ldots, X^d, t)$ with a vector SDE $dX^i = f^i\\, dt + \\sum_j g^{ij}\\, dW^j$, Itō's lemma reads $d\\varphi = (\\varphi_t + f \\cdot \\nabla \\varphi + \\tfrac{1}{2}\\mathrm{tr}(g g^\\top \\nabla^2 \\varphi))\\, dt + (\\nabla \\varphi)^\\top g\\, dW$. The trace of $g g^\\top$ times the Hessian is the multivariate Itō correction.</p>

<div class="think-box"><div class="think-label">THE BIG IDEA</div><div class="think-body">The Itō correction $\\tfrac{1}{2} g^2 \\varphi_{xx}$ is not a nuisance. It is the term that makes stochastic calculus actually compute distributions correctly. The Fokker-Planck equation, the Feynman-Kac formula, the Black-Scholes equation, and the reverse-time SDE that powers Diffusion models all live or die by this term.</div></div>

<h2 class="lesson-title">6. Worked Example: Geometric Brownian Motion</h2>

<p class="l-text">The cleanest application of Itō's lemma is the SDE used by Black and Scholes in 1973 to model stock prices:</p>

<div class="calc-formula"><div class="formula-label">GEOMETRIC BROWNIAN MOTION (GBM)</div><div class="formula-main">$$dS_t \\;=\\; \\mu\\, S_t\\, dt + \\sigma\\, S_t\\, dW_t, \\qquad S_0 \\text{ given}$$</div><div class="formula-sub">Drift proportional to the current price (so percentage returns have constant mean $\\mu$), and diffusion also proportional (so percentage returns have constant volatility $\\sigma$).</div></div>

<p class="l-text">The trick is to apply Itō's lemma to $Y_t = \\log S_t$. Here $\\varphi(s) = \\log s$, so $\\varphi_s = 1/s$ and $\\varphi_{ss} = -1/s^2$. With $f = \\mu s$ and $g = \\sigma s$ we get</p>

<div class="calc-formula"><div class="formula-label">ITŌ'S LEMMA APPLIED TO $\\log S_t$</div><div class="formula-main">$$d(\\log S_t) \\;=\\; \\Bigl[\\mu s \\cdot \\tfrac{1}{s} + \\tfrac{1}{2}\\sigma^2 s^2 \\cdot \\bigl(-\\tfrac{1}{s^2}\\bigr)\\Bigr] dt + \\sigma s \\cdot \\tfrac{1}{s}\\, dW \\;=\\; \\Bigl[\\mu - \\tfrac{\\sigma^2}{2}\\Bigr] dt + \\sigma\\, dW$$</div><div class="formula-sub">The Itō correction $-\\sigma^2/2$ is the famous "variance drag". Without it the chain rule would falsely give $d(\\log S) = \\mu\\, dt + \\sigma\\, dW$.</div></div>

<p class="l-text">The right-hand side is now a constant-coefficient SDE for $\\log S_t$, easily integrated: $\\log S_t = \\log S_0 + (\\mu - \\sigma^2 / 2)\\, t + \\sigma\\, W_t$. Exponentiating gives the explicit closed-form solution.</p>

<div class="calc-formula"><div class="formula-label">EXPLICIT GBM SOLUTION</div><div class="formula-main">$$S_t \\;=\\; S_0 \\exp\\!\\Bigl(\\bigl(\\mu - \\tfrac{\\sigma^2}{2}\\bigr) t + \\sigma\\, W_t\\Bigr)$$</div><div class="formula-sub">A log-normal random variable at each $t$. Always positive (good for prices), with $\\mathbb{E}[S_t] = S_0 e^{\\mu t}$ and median $S_0 e^{(\\mu - \\sigma^2/2) t}$. The mean and the median differ precisely by the Itō correction.</div></div>

<div id="plot-l6-gbm-en" class="plotly-graph"></div>
<script>setTimeout(function(){
function box(){var u=Math.random();var v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var N=400;var T=2.0;var dt=T/N;var sd=Math.sqrt(dt);var mu=0.15;var sigma=0.45;var S0=100;
var ts=[];for(var i=0;i<=N;i++){ts.push(i*dt);}
var colors=['#3b82f6','#f59e0b','#10b981','#ef4444','#a78bfa'];
var traces=[];
for(var k=0;k<5;k++){var lw=Math.log(S0);var s=[S0];
for(var i=1;i<=N;i++){lw+=(mu-0.5*sigma*sigma)*dt+sigma*sd*box();s.push(Math.exp(lw));}
traces.push({x:ts,y:s,mode:'lines',name:'path '+(k+1),line:{color:colors[k],width:1.7}});}
var meanLine=ts.map(function(t){return S0*Math.exp(mu*t);});
traces.push({x:ts,y:meanLine,mode:'lines',name:'E[S_t] = S0·exp(μt)',line:{color:'#9ca3af',width:2,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'time t (years)',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'price S(t)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-gbm-en',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> five sample paths of geometric Brownian motion with $S_0 = 100$, drift $\\mu = 0.15$ (15% annual), volatility $\\sigma = 0.45$ (45% annual), simulated over two years with the analytical formula $S_t = S_0 \\exp((\\mu - \\sigma^2/2)\\, t + \\sigma W_t)$. The dashed grey line is the theoretical mean $\\mathbb{E}[S_t] = S_0 e^{\\mu t}$. Three observations: (1) every path stays positive &mdash; the exponential guarantees this; (2) the spread widens with $\\sqrt{t}$ as expected; (3) several individual paths lag below the mean &mdash; that is the variance drag $-\\sigma^2/2$ at work: the typical (median) path grows slower than the mean of all paths.</div></div>

<div class="l-note"><strong>Why GBM matters beyond finance.</strong> Many DDPM derivations write the forward process as an Ornstein-Uhlenbeck-like SDE whose marginals are Gaussian. The Itō-lemma manipulations are identical to the GBM calculation: change to log-space, integrate the constant-coefficient SDE, exponentiate. Once you can do the GBM calculation by hand you can read the appendix of any score-SDE paper.</div>

<h2 class="lesson-title">7. Fokker-Planck Equation</h2>

<p class="l-text">An SDE governs the microscopic random trajectory $X_t$. The macroscopic quantity is its probability density $p_t(x) = p(x, t)$, defined so that $\\Pr(X_t \\in [a, b]) = \\int_a^b p(x, t)\\, dx$. The Fokker-Planck equation (Andrey Kolmogorov 1931 in its general form, building on work by Adriaan Fokker and Max Planck) is the PDE that governs the evolution of $p$.</p>

<div class="calc-formula"><div class="formula-label">FOKKER-PLANCK EQUATION (1-D)</div><div class="formula-main">$$\\frac{\\partial p(x, t)}{\\partial t} \\;=\\; -\\frac{\\partial}{\\partial x}\\bigl[\\, f(x, t)\\, p(x, t)\\,\\bigr] \\;+\\; \\frac{1}{2}\\frac{\\partial^2}{\\partial x^2}\\bigl[\\, g(x, t)^2\\, p(x, t)\\,\\bigr]$$</div><div class="formula-sub">First term: deterministic drift carries the density along the flow $f$. Second term: diffusion spreads the density with local rate $g^2$. Together they form a conservation law for probability.</div></div>

<p class="l-text">Two special cases are instructive. With pure drift $g \\equiv 0$ the equation becomes $p_t + (f p)_x = 0$, the continuity equation of transport: density flows along characteristics without spreading. With pure diffusion $f \\equiv 0$ and constant $g$ the equation becomes $p_t = (g^2 / 2)\\, p_{xx}$, exactly the heat equation we met in Lesson 4. So <strong>the heat equation is just the Fokker-Planck equation for standard Brownian motion.</strong> The deterministic and the stochastic worlds meet through this PDE.</p>

<div id="plot-l6-fokker-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nx=80;var Nt=60;var xs=[];var ts=[];var z=[];
for(var i=0;i<Nx;i++){xs.push(-5+10*i/(Nx-1));}
for(var j=0;j<Nt;j++){ts.push(0.02+1.5*j/(Nt-1));}
for(var j=0;j<Nt;j++){var row=[];var t=ts[j];
for(var i=0;i<Nx;i++){var x=xs[i];
var p=Math.exp(-x*x/(2*t))/Math.sqrt(2*Math.PI*t);
row.push(p);}z.push(row);}
var d1={x:xs,y:ts,z:z,type:'heatmap',colorscale:[[0,'#0c1024'],[0.3,'#1d4ed8'],[0.6,'#3b82f6'],[0.85,'#fbbf24'],[1,'#fef3c7']],colorbar:{title:'p(x,t)'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'position x',gridcolor:'#1f2937'},yaxis:{title:'time t',gridcolor:'#1f2937'},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-fokker-en',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the Fokker-Planck density $p(x, t) = (2\\pi t)^{-1/2} \\exp(-x^2/(2t))$ for standard Brownian motion started from a delta at the origin. The density spreads as time increases: at $t = 0.02$ it is a sharp spike near $x = 0$; by $t = 1.5$ it has flattened to a wide bell whose standard deviation is $\\sqrt{t}$. The total probability remains $1$ at every time slice. This is the heat equation in disguise &mdash; and it is the macroscopic counterpart of the wandering paths in Section 2.</div></div>

<div class="calc-highlight"><strong>Why Fokker-Planck is the engine of Diffusion models.</strong> A Diffusion model needs to know, given a noised input $x_t$, what direction in pixel space points "back toward clean data". That direction is $\\nabla_x \\log p_t(x)$ &mdash; the gradient of the log-density of the noised distribution. Without Fokker-Planck you would have no idea how that density evolves. With Fokker-Planck the marginal density $p_t$ at every noise level is a known Gaussian convolution of the data, and the score can be learned by denoising score matching.</div>

<h2 class="lesson-title">8. Reverse-Time SDE (Anderson 1982)</h2>

<p class="l-text">Here is the result that ties stochastic calculus to Diffusion models. Suppose the forward SDE $dX_t = f(X_t, t)\\, dt + g(t)\\, dW_t$ runs from $t = 0$ to $t = T$ and produces a density $p_t(x)$. Brian Anderson proved in 1982 that the <em>time-reverse</em> process $\\bar{X}_t = X_{T - t}$ is itself a diffusion driven by an SDE in reverse time:</p>

<div class="calc-formula"><div class="formula-label">ANDERSON REVERSE-TIME SDE</div><div class="formula-main">$$dX_t \\;=\\; \\bigl[\\, f(X_t, t) - g(t)^2\\, \\nabla_x \\log p_t(X_t)\\,\\bigr]\\, dt + g(t)\\, d\\bar{W}_t$$</div><div class="formula-sub">Identical form to the forward SDE except for two changes: the drift gains an extra "<em>score</em>" term $-g^2 \\nabla \\log p_t$ that pulls the process back toward high-density regions, and the Brownian motion is replaced by a reverse-time Brownian motion $\\bar{W}_t$.</div></div>

<p class="l-text">Read that formula carefully. The extra drift contribution is <strong>the gradient of the log-density</strong>, called the <strong>score</strong>. It is the <em>only</em> quantity in the reverse SDE that depends on the data distribution: the drift $f$ and diffusion $g$ are user-chosen, the Brownian motion is just noise, but the score $\\nabla \\log p_t$ is determined by the data and must be estimated. Diffusion generative modelling is, in one sentence, the project of <strong>training a neural network $s_\\theta(x, t) \\approx \\nabla \\log p_t(x)$ and plugging it into Anderson's formula</strong>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Score $\\nabla \\log p_t(x)$</div><div class="card-body">Points uphill on the log-density. If $p_t$ is locally Gaussian around the data manifold, the score points toward the manifold. Learning this vector field is the entire learning problem in Diffusion.</div></div>
<div class="calc-card"><div class="card-title">Why $g(t)^2 \\nabla \\log p_t$</div><div class="card-body">The factor $g^2$ matches the diffusion magnitude. A noisier forward process needs a stronger score correction in reverse. This is exactly the Itō correction $(dW)^2 = dt$ resurfacing.</div></div>
<div class="calc-card"><div class="card-title">Reverse Brownian $d\\bar{W}_t$</div><div class="card-body">A fresh stochastic kick during reverse sampling. Without it, generated samples would lack the small details that the forward process destroyed. Set it to zero and you recover the deterministic probability-flow ODE.</div></div>
<div class="calc-card"><div class="card-title">Probability-flow ODE</div><div class="card-body">$dx/dt = f(x, t) - \\tfrac{1}{2} g(t)^2\\, \\nabla \\log p_t(x)$. Same marginals as the reverse SDE, no noise. Used at inference for deterministic samplers like DDIM and Heun-Karras.</div></div>
</div>

<h2 class="lesson-title">9. Connection to Diffusion Models — DDPM (Ho et al. 2020)</h2>

<p class="l-text">The denoising diffusion probabilistic model of Ho, Jain and Abbeel (2020) is a discretisation of a specific SDE. The forward Markov chain is</p>

<div class="calc-formula"><div class="formula-label">DDPM FORWARD CHAIN</div><div class="formula-main">$$q(x_t \\mid x_{t-1}) \\;=\\; \\mathcal{N}\\!\\bigl(x_t;\\; \\sqrt{1 - \\beta_t}\\, x_{t-1},\\; \\beta_t I\\bigr), \\qquad t = 1, 2, \\ldots, T$$</div><div class="formula-sub">$\\beta_t$ is a small noise schedule; common choices are linear ($\\beta_t$ from $10^{-4}$ to $0.02$ over $T = 1000$ steps) or cosine (Nichol-Dhariwal 2021).</div></div>

<p class="l-text">Send the step size to zero and reinterpret the discrete index as a continuous time $t \\in [0, 1]$. The chain becomes a stochastic differential equation:</p>

<div class="calc-formula"><div class="formula-label">VARIANCE-PRESERVING SDE (VP-SDE)</div><div class="formula-main">$$dx \\;=\\; -\\tfrac{1}{2}\\, \\beta(t)\\, x\\, dt \\;+\\; \\sqrt{\\beta(t)}\\, dW_t$$</div><div class="formula-sub">An Ornstein-Uhlenbeck process. The drift pulls $x$ toward the origin so that its marginal variance stays bounded; the diffusion injects fresh noise. As $t \\to 1$ the marginal converges to a standard normal $\\mathcal{N}(0, I)$, irrespective of the data distribution.</div></div>

<p class="l-text">The neural network in DDPM, denoted $\\varepsilon_\\theta(x_t, t)$, predicts the noise that was added to a clean sample $x_0$ to produce $x_t$. The connection to the score is</p>

<div class="calc-formula"><div class="formula-label">EPSILON-PREDICTION ↔ SCORE</div><div class="formula-main">$$\\nabla_x \\log p_t(x_t) \\;=\\; -\\frac{\\varepsilon_\\theta(x_t, t)}{\\sqrt{1 - \\bar{\\alpha}_t}}, \\qquad \\bar{\\alpha}_t = \\prod_{s=1}^{t}(1 - \\beta_s)$$</div><div class="formula-sub">The DDPM network learns $\\varepsilon$, but division by $\\sqrt{1 - \\bar{\\alpha}_t}$ gives the score. The two parameterisations are exactly equivalent; choice between them is mostly a numerical-stability question.</div></div>

<p class="l-text">Sampling runs the reverse SDE backwards from $t = 1$ to $t = 0$. Substituting the learned score into Anderson's formula gives the DDPM reverse step (Algorithm 2 of the Ho et al. paper). Each step takes a noised image, computes a denoised mean using $\\varepsilon_\\theta$, adds calibrated Gaussian noise (the $d\\bar{W}$ term), and produces a slightly cleaner image. After 1000 such steps you have a generated sample.</p>

<div id="plot-l6-ddpm-en" class="plotly-graph"></div>
<script>setTimeout(function(){
function box(){var u=Math.random();var v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function bimodal(){var m=(Math.random()<0.5)?-2:2;return m+0.4*box();}
var Nsamples=600;var ts=[0.0,0.25,0.5,0.75,1.0];var colors=['#3b82f6','#22d3ee','#a78bfa','#f59e0b','#ef4444'];
var traces=[];var bins=40;var lo=-5;var hi=5;
for(var k=0;k<ts.length;k++){var t=ts[k];var data=[];
for(var i=0;i<Nsamples;i++){var x0=bimodal();
var alphaBar=Math.exp(-3*t);
var xt=Math.sqrt(alphaBar)*x0+Math.sqrt(1-alphaBar)*box();
data.push(xt);}
var hist=new Array(bins).fill(0);for(var i=0;i<data.length;i++){var b=Math.floor((data[i]-lo)/(hi-lo)*bins);if(b>=0&&b<bins)hist[b]++;}
var xs=[];var ys=[];for(var b=0;b<bins;b++){xs.push(lo+(b+0.5)*(hi-lo)/bins);ys.push(hist[b]/Nsamples);}
traces.push({x:xs,y:ys,mode:'lines',name:'t = '+t.toFixed(2),line:{color:colors[k],width:2.2,shape:'spline'}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'p_t(x) (empirical)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-ddpm-en',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the DDPM forward process applied to a bimodal toy data distribution with modes at $x = \\pm 2$. Five time slices in colour from $t = 0$ (sharp two-peak data) through $t = 1$ (essentially $\\mathcal{N}(0, 1)$ noise). At intermediate times the two peaks shrink, drift toward the origin, and broaden until they merge. The reverse process, parameterised by the learned score $\\varepsilon_\\theta$, runs this animation backwards: it starts from the red curve and reconstructs the blue curve, sample by sample, by following Anderson's reverse SDE.</div></div>

<h2 class="lesson-title">10. Score-Based Generative Models (Song-Ermon 2019, Song 2021)</h2>

<p class="l-text">Yang Song and Stefano Ermon published "Generative Modeling by Estimating Gradients of the Data Distribution" in 2019. Their idea was to learn $s_\\theta(x) \\approx \\nabla \\log p_{\\text{data}}(x)$ directly using <strong>denoising score matching</strong> at multiple noise levels, then sample via annealed Langevin dynamics. Two years later, Song et al. (2021) unified DDPM and score matching under a single continuous-time SDE framework. Two canonical SDEs cover almost all current models.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">VARIANCE PRESERVING (VP) &mdash; DDPM</div><div class="compare-item">$dx = -\\tfrac{1}{2}\\beta(t)\\, x\\, dt + \\sqrt{\\beta(t)}\\, dW$</div><div class="compare-item">Marginal variance is bounded; final distribution is $\\mathcal{N}(0, I)$.</div><div class="compare-item">Ho et al. (2020), score parameterised as $\\varepsilon$-prediction.</div><div class="compare-item">Smooth, well-behaved score; popular in latent diffusion.</div></div><div class="compare-col"><div class="compare-title">VARIANCE EXPLODING (VE) &mdash; NCSN</div><div class="compare-item">$dx = \\sqrt{\\tfrac{d}{dt}\\sigma^2(t)}\\, dW$</div><div class="compare-item">No drift; variance grows as $\\sigma^2(t)$ to a very large value.</div><div class="compare-item">Song-Ermon (2019), score parameterised as $s_\\theta$.</div><div class="compare-item">Larger dynamic range; benefits from EDM preconditioning.</div></div></div>

<p class="l-text">The training objective is the same in both cases: <strong>denoising score matching</strong>. Sample $(x_0, t)$ with $x_0 \\sim p_{\\text{data}}$, $t \\sim U(0, T)$; corrupt to $x_t$ using the known forward transition; train $s_\\theta(x_t, t)$ to predict the score $\\nabla_{x_t} \\log p_t(x_t \\mid x_0)$ which has a closed-form Gaussian expression. Vincent (2011) proved this learns the marginal score in expectation, side-stepping the intractability of the original Hyvärinen 2005 score-matching objective.</p>

<div class="calc-formula"><div class="formula-label">DENOISING SCORE MATCHING LOSS</div><div class="formula-main">$$\\mathcal{L}(\\theta) \\;=\\; \\mathbb{E}_{t, x_0, x_t \\mid x_0}\\Bigl[\\, \\lambda(t)\\, \\bigl\\| s_\\theta(x_t, t) - \\nabla_{x_t} \\log q_t(x_t \\mid x_0)\\bigr\\|^2\\,\\Bigr]$$</div><div class="formula-sub">Weighted MSE between predicted score and the closed-form conditional score. $\\lambda(t)$ is a positive weighting function whose choice profoundly affects sample quality.</div></div>

<p class="l-text">Tero Karras and collaborators (EDM, 2022) made a number of empirical and theoretical refinements that cleaned this up: a $\\sigma$-conditioned VE-style parameterisation, the Karras noise schedule $\\sigma(t) = (\\sigma_{\\max}^{1/\\rho} + t(\\sigma_{\\min}^{1/\\rho} - \\sigma_{\\max}^{1/\\rho}))^\\rho$ with $\\rho = 7$, network preconditioning $D_\\theta(x; \\sigma) = c_{\\text{skip}}\\, x + c_{\\text{out}}\\, F_\\theta(c_{\\text{in}}\\, x; c_{\\text{noise}})$, and a second-order Heun sampler. EDM is the de-facto recipe for high-quality score-based generation today; the framework is still the same Itō SDE.</p>

<div id="plot-l6-score-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nx=22;var Ny=22;var xs=[];var ys=[];var us=[];var vs=[];
var x0=Array.from({length:Nx*Ny},function(_,k){return -3+6*((k%Nx)/(Nx-1));});
var y0=Array.from({length:Nx*Ny},function(_,k){return -3+6*(Math.floor(k/Nx)/(Ny-1));});
for(var k=0;k<x0.length;k++){var x=x0[k];var y=y0[k];
var mx1=-1.2;var my1=-0.8;var mx2=1.3;var my2=1.0;var s2=0.6;
var w1=Math.exp(-((x-mx1)*(x-mx1)+(y-my1)*(y-my1))/(2*s2));
var w2=Math.exp(-((x-mx2)*(x-mx2)+(y-my2)*(y-my2))/(2*s2));
var pp=w1+w2;
var gx=(w1*(mx1-x)+w2*(mx2-x))/(s2*pp);
var gy=(w1*(my1-y)+w2*(my2-y))/(s2*pp);
var nrm=Math.sqrt(gx*gx+gy*gy)+1e-9;var sc=0.25/Math.max(nrm,0.5);
xs.push(x);ys.push(y);us.push(gx*sc);vs.push(gy*sc);}
var segX=[];var segY=[];for(var k=0;k<xs.length;k++){segX.push(xs[k]);segX.push(xs[k]+us[k]);segX.push(null);segY.push(ys[k]);segY.push(ys[k]+vs[k]);segY.push(null);}
var d1={x:segX,y:segY,mode:'lines',name:'score field ∇log p(x)',line:{color:'#3b82f6',width:1.5}};
var d2={x:xs,y:ys,mode:'markers',name:'sample grid',marker:{size:3,color:'#9ca3af'},showlegend:false};
var d3={x:[-1.2,1.3],y:[-0.8,1.0],mode:'markers',name:'data modes',marker:{size:11,color:'#f59e0b',symbol:'star'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x1',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-3.3,3.3]},yaxis:{title:'x2',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-3.3,3.3],scaleanchor:'x'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-score-en',[d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the score field $\\nabla \\log p(x)$ of a 2-D Gaussian mixture with modes at $(-1.2, -0.8)$ and $(1.3, 1.0)$. Each blue arrow points uphill on the log-density, away from low-probability regions and toward the nearest mode (orange stars). A score-based generative model starts from a random sample in the noise distribution at the corners and follows arrows like these (at the appropriate noise level) until it reaches a mode. This is exactly what Langevin dynamics and the reverse SDE do, only in many more dimensions.</div></div>

<h2 class="lesson-title">11. Flow Matching (Lipman et al. 2023)</h2>

<p class="l-text">Yaron Lipman and collaborators ("Flow Matching for Generative Modeling", 2023) showed that you don't need to learn the score at all. You can learn a <strong>velocity field</strong> $v_\\theta(x, t)$ directly and use an ordinary differential equation, not an SDE, for both training and sampling.</p>

<div class="calc-formula"><div class="formula-label">FLOW MATCHING ODE</div><div class="formula-main">$$\\frac{dx_t}{dt} \\;=\\; v_t(x_t), \\qquad x_0 \\sim p_{\\text{noise}}, \\qquad x_1 \\sim p_{\\text{data}}$$</div><div class="formula-sub">A deterministic transport: at time $t = 0$ samples are drawn from a simple noise distribution; following the learned velocity field deterministically until $t = 1$ produces samples from the data distribution.</div></div>

<p class="l-text">The training trick is <em>conditional flow matching</em>. Pick a clean data point $x_1$, define a conditional probability path $p_t(x \\mid x_1) = \\mathcal{N}((1 - t)\\, x_0 + t\\, x_1,\\, \\sigma_{\\min}^2 I)$ that linearly interpolates from noise to data, and train the network to match the conditional vector field $u_t(x \\mid x_1) = x_1 - x_0$ &mdash; a constant in time! Lipman et al. proved that this surrogate objective has the <em>same gradient</em> as the intractable unconditional flow-matching loss. The result is dramatically simpler training than score matching, no learned variance schedule, and faster ODE sampling at inference.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Velocity vs score</div><div class="card-body">In a Gaussian path the velocity field and score field are linearly related: $v_t(x) = -\\tfrac{1}{2} g(t)^2 \\nabla \\log p_t(x) + f(x, t)$. Flow matching just trains for $v$ directly, sidestepping the divisions by $\\sqrt{1 - \\bar{\\alpha}_t}$ that plague DDPM.</div></div>
<div class="calc-card"><div class="card-title">Rectified flow (Liu 2022)</div><div class="card-body">Iteratively re-trains the flow on pairs $(x_0, x_1)$ generated by the current flow, producing increasingly straight trajectories. After 2-3 rounds you can sample with as few as 1-4 ODE steps. Used in Stable Diffusion 3.</div></div>
<div class="calc-card"><div class="card-title">Connection to score</div><div class="card-body">Flow matching with the optimal-transport probability path recovers the same marginal distributions as the corresponding probability-flow ODE of a score model. Same generative power, simpler maths.</div></div>
<div class="calc-card"><div class="card-title">Production status</div><div class="card-body">Stable Diffusion 3 (Esser et al. 2024) and Meta's Movie Gen (2024) both use rectified flow. Flux.1 (Black Forest Labs, 2024) is flow-matched. The score era is being replaced by the flow era at the frontier.</div></div>
</div>

<div id="plot-l6-flow-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nx=22;var Ny=22;var xs=[];var ys=[];var us=[];var vs=[];
for(var i=0;i<Nx;i++){for(var j=0;j<Ny;j++){
var x=-3+6*i/(Nx-1);var y=-3+6*j/(Ny-1);
var mx=1.0;var my=0.5;
var vx=(mx-x)*0.18;var vy=(my-y)*0.18;
xs.push(x);ys.push(y);us.push(vx);vs.push(vy);}}
var segX=[];var segY=[];for(var k=0;k<xs.length;k++){segX.push(xs[k]);segX.push(xs[k]+us[k]);segX.push(null);segY.push(ys[k]);segY.push(ys[k]+vs[k]);segY.push(null);}
var d1={x:segX,y:segY,mode:'lines',name:'velocity field v_t(x)',line:{color:'#3b82f6',width:1.5}};
function box(){var u=Math.random();var v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var trajs=[];var colors=['#f59e0b','#10b981','#ef4444','#a78bfa','#22d3ee'];
for(var k=0;k<5;k++){var px=2.5*box();var py=2.5*box();var tx=[px];var ty=[py];
for(var step=0;step<14;step++){var dxv=(1.0-px)*0.12;var dyv=(0.5-py)*0.12;px+=dxv;py+=dyv;tx.push(px);ty.push(py);}
trajs.push({x:tx,y:ty,mode:'lines+markers',name:'sample '+(k+1),line:{color:colors[k],width:1.6},marker:{size:4,color:colors[k]}});}
var target={x:[1.0],y:[0.5],mode:'markers',name:'data',marker:{size:13,color:'#fef3c7',symbol:'star',line:{width:1,color:'#f59e0b'}}};
var data=[d1].concat(trajs).concat([target]);
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x1',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-3.3,3.3]},yaxis:{title:'x2',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-3.3,3.3],scaleanchor:'x'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-flow-en',data,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> a toy flow-matching velocity field $v_t(x) = 0.18\\,(x_{\\text{target}} - x)$ transporting Gaussian noise samples toward a single data point at $(1.0, 0.5)$. Blue arrows show the field, coloured trajectories show five sample paths each starting from a random noise location and following the field via Euler integration. Every path heads directly toward the target. Unlike score-based reverse SDE, no random noise is added at sampling time &mdash; the deterministic ODE alone is enough.</div></div>

<h2 class="lesson-title">12. Euler-Maruyama Method (Numerical SDE)</h2>

<p class="l-text">We rarely have analytical solutions for an SDE; we simulate. The simplest method is the stochastic analogue of explicit Euler, due to Gisiro Maruyama (1955).</p>

<div class="calc-formula"><div class="formula-label">EULER-MARUYAMA SCHEME</div><div class="formula-main">$$X_{n+1} \\;=\\; X_n + f(X_n, t_n)\\, h + g(X_n, t_n)\\, \\sqrt{h}\\, Z_n, \\qquad Z_n \\sim \\mathcal{N}(0, 1)\\,\\text{iid}$$</div><div class="formula-sub">Time step $h$, fresh standard-normal sample $Z_n$ at every step, increment $\\sqrt{h}\\, Z_n$ approximates $\\Delta W_n$ which has standard deviation $\\sqrt{h}$. Note the $\\sqrt{h}$ scaling of the noise term &mdash; you cannot collapse it to $h$ even though it is the smallest term.</div></div>

<p class="l-text">Euler-Maruyama converges with <strong>strong order $1/2$</strong> (the expected pathwise error scales as $\\sqrt{h}$) and <strong>weak order $1$</strong> (errors in expectations of smooth functionals scale as $h$). Halving the step size only reduces the pathwise error by a factor of $\\sqrt{2}$, but distributional quantities such as means and variances improve linearly with $h$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Strong vs weak convergence</div><div class="card-body">Strong: $\\mathbb{E}\\bigl[\\sup_t |X_h(t) - X(t)|\\bigr] = O(h^{1/2})$. Weak: $|\\mathbb{E}[\\varphi(X_h(T))] - \\mathbb{E}[\\varphi(X(T))]| = O(h)$. For sampling generative models only weak order matters.</div></div>
<div class="calc-card"><div class="card-title">Milstein scheme</div><div class="card-body">$X_{n+1} = X_n + f h + g\\sqrt{h}\\, Z_n + \\tfrac{1}{2} g\\, g'\\, h\\, (Z_n^2 - 1)$. Adds an Itō-correction term to reach strong order 1. Helpful when $g$ depends strongly on $X$.</div></div>
<div class="calc-card"><div class="card-title">Stochastic Runge-Kutta</div><div class="card-body">Higher-order schemes exist but require carefully chosen "Levy area" approximations, computationally costly. Rosenbrock, Heun-Karras and DPM-Solver are practical higher-order methods used in Diffusion samplers.</div></div>
<div class="calc-card"><div class="card-title">DDPM as Euler-Maruyama</div><div class="card-body">The ancestral sampler $x_{t-1} = \\mu_\\theta(x_t, t) + \\sigma_t z$ of DDPM is exactly Euler-Maruyama applied to the reverse VP-SDE. EDM's Heun sampler is a stochastic Heun method. Knowing the SDE means knowing the sampler.</div></div>
</div>

<div class="l-note"><strong>Why DDIM samples deterministically.</strong> The DDIM update of Song-Meng-Ermon (2021) sets the stochastic kick term to zero, turning the reverse SDE into the probability-flow ODE. With deterministic dynamics you can use 50 steps instead of 1000 and get comparable sample quality. The price: less diversity, because two distinct random seeds in the noise initialisation may land on the same data mode.</div>

<h2 class="lesson-title">13. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to look for in the plots.</strong> The first panel shows ten Brownian paths inside the $\\pm 2\\sqrt{t}$ band, confirming the $\\sqrt{t}$ rule visually. The second panel plots five GBM paths and the analytical mean &mdash; notice how some paths run well below the mean even when none has crashed, the Itō correction in action. The third panel is the payoff: the blue histogram is the original bimodal data, the orange histogram is the same data after $T = 1$ unit of forward noising (essentially $\\mathcal{N}(0, 1)$), and the green histogram is samples produced by running Anderson's reverse SDE backwards using the analytical mixture score &mdash; it reproduces the original bimodal density very closely. A real Diffusion model just replaces our closed-form score with a learned neural network, but the simulation loop is the same code.</p>

<div class="think-box"><div class="think-label">EXPERIMENTS TO TRY</div><div class="think-body">Replace the bimodal mixture with a four-mode mixture and see whether the reverse process still recovers all modes; try a very small $N3$ (10 reverse steps) to feel the speed/quality tradeoff that motivates DPM-Solver and Heun samplers; switch the reverse step to the probability-flow ODE (drop the diffusion term) and observe that the samples concentrate more tightly on the modes; replace Brownian motion in panel 1 with a correlated noise (rough Brownian) and watch the $\\sqrt{t}$ envelope break.</div></div>

<div class="calc-highlight"><strong>What you can now do.</strong> You can read an SDE, apply Itō's lemma to change variables, write the matching Fokker-Planck PDE, identify the score function in any score-based or flow-based model, and connect every line of a Diffusion-model paper to the underlying stochastic calculus. The next lesson tightens the screws on numerical SDE solvers; after that we open the door to neural PDE solvers like PINN and Neural ODEs, which extend everything you have learned here from analytical solutions to fully learnable ones.</div>
`,

/* ============================================================
   TURKISH
   ============================================================ */
tr: `
<p class="l-text">Bu derse kadar yazdığımız her diferansiyel denklem <em>deterministik</em>ti. Bize başlangıç koşulunu söyle, katsayıları sabitle ve gelecek bir kerede ve sonsuza dek belirlenir. Verilen bir başlangıçtan sönümlü bir osilatörün yörüngesi tek bir eğridir. Bir çubuğun sıcaklık profili tek bir fonksiyondur. Gerçeklik bu bakış açısıyla yalnızca gürültü ihmal edilebilir olduğunda anlaşır. Bir hisse fiyatına tick tick bakmaya başladığımız, mikroskop slaytında titreşen bir polen tanesini ya da gürültüsüzleştirme yolunun ortasındaki bir difüzyon üretici modelinin gizli durumunu izlediğimiz an, görüntü değişir. Yol artık bir eğri değildir; bir <em>eğriler dağılımıdır</em>. Rastlantısallığın bir kalkülüsüne ihtiyacımız var.</p>

<p class="l-text">Bu ders, evrimi her anda düzgün bir sürüklenme ile gürültülü bir tekmeyi birleştiren sistemleri tanımlamak için kullanılan dil olan <strong>stokastik diferansiyel denklemleri</strong> &mdash; SDE'leri &mdash; tanıtır. Wiener sürecini sıfırdan inşa edeceğiz, klasik kalkülüsün onun için neden bozulduğunu göreceğiz, onun yerini alan yeni zincir kuralını (Itō lemması) öğreneceğiz ve sonra tüm mekanizmanın modern AI'nin etrafında nasıl odaklandığını izleyeceğiz: <strong>kullandığınız her Difüzyon üretici modeli &mdash; DDPM, Stable Diffusion, Sora, Flow Matching &mdash; özünde bir sayısal SDE çözücüsüdür ve bir sinir ağı ile eşleştirilmiştir; bu ağ tek bir özel nesneyi öğrenir: skor fonksiyonu $\\nabla \\log p_t(x)$.</strong> Bu izlekteki tüm dersler arasında, bir üretici modelleme makalesi okumaya oturduğunuzda en doğrudan karşılık veren ders budur.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir Wiener sürecini (Brownian hareketi) tanımlamak ve SDE notasyonu $dX = f\\,dt + g\\,dW$'yu akıcı okumak</li>
<li>$(dW)^2 = dt$'nin neden yeni bir kalkülüsü zorladığını açıklamak ve <strong>Itō lemmasını</strong> stokastik zincir kuralı olarak uygulamak</li>
<li>Geometrik Brownian hareketini $\\log S$ üzerinde Itō lemması ile kapalı formda çözmek</li>
<li>Bir SDE çözümünün yoğunluğu için <strong>Fokker-Planck</strong> denklemini yazmak</li>
<li>Anderson ters-zaman SDE'sini ifade etmek ve <strong>skor fonksiyonu</strong> $\\nabla \\log p_t$'yi tek öğrenilebilir nesne olarak tanımak</li>
<li>DDPM (Ho 2020), skor tabanlı SDE'leri (Song 2021), EDM (Karras 2022) ve Flow Matching'i (Lipman 2023) bu tek matematiksel çekirdeğe bağlamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Deterministikten Stokastiğe</h2>

<p class="l-text">ODE kurulumunu hatırla. Birinci dereceden bir adi diferansiyel denklem şöyledir:</p>

<div class="calc-formula"><div class="formula-label">ADİ DİFERANSİYEL DENKLEM</div><div class="formula-main">$$\\frac{dx}{dt} \\;=\\; f(x, t), \\qquad x(0) = x_0$$</div><div class="formula-sub">Bir başlangıç noktası seç, bir sürüklenme yasası seç ve tüm sonraki zamanlar için yörünge $x(t)$ belirlenmiştir. Aynı başlangıçlı iki yörünge asla kesişemez.</div></div>

<p class="l-text">Bir <strong>stokastik diferansiyel denklem</strong>, çözümü her anda dürten gürültülü bir terim ekler. Gürültü terimi $dt$'ye bölünmeye dayanamayacak kadar pürüzlü olduğu için onu diferansiyel formda yazarız:</p>

<div class="calc-formula"><div class="formula-label">STOKASTİK DİFERANSİYEL DENKLEM (ITŌ FORMU)</div><div class="formula-main">$$dX_t \\;=\\; f(X_t, t)\\, dt \\;+\\; g(X_t, t)\\, dW_t$$</div><div class="formula-sub">$f$ <em>sürüklenme katsayısı</em>, $g$ <em>difüzyon katsayısı</em> ve $dW_t$ <strong>Wiener sürecinin</strong> sonsuz küçük bir artımıdır &mdash; saf beyaz gürültünün matematiksel bedeni.</div></div>

<p class="l-text">Aynı noktadan iki farklı başlangıç iki farklı örnek yol üretir çünkü rastgele tekmeler farklıdır. Yani bir SDE'nin çözümü tek bir $X(t)$ fonksiyonu değil, bütün bir <strong>stokastik süreçtir</strong>: zamanla indekslenmiş bir rastgele değişkenler ailesi $\\{X_t\\}_{t \\geq 0}$. Ortalama yörüngeyi, etrafındaki varyansı, her zamandaki olasılık yoğunluğu $p_t(x)$'i ya da iki farklı zamandaki ortak dağılımı sorabiliriz. Deterministik ODE, tüm bu dağılımların tek bir eğriye çöktüğü $g \\to 0$ limitidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sürüklenme $f(X, t)$</div><div class="card-body">Deterministik itme. Aynı noktadan başlayan çok sayıda örnek yolu ortalarsanız ortalama kabaca $\\dot{\\bar{x}} = f$ ODE'sini izler. Fiziği, ekonomiyi, model tercihlerini kodlar.</div></div>
<div class="calc-card"><div class="card-title">Difüzyon $g(X, t)$</div><div class="card-body">Rastgele tekmenin büyüklüğü. Beyaz gürültü artımı $dW$'yı çarpar. Daha büyük $g$, daha vahşi yollar, olasılık yoğunluğunun daha hızlı yayılması, daha fazla belirsizlik demektir.</div></div>
<div class="calc-card"><div class="card-title">Örnek yol</div><div class="card-body">Rastgele sürecin belirli bir gerçekleşmesi. Tek bir Gauss gürültü akışı çizerek birini simüle edebilirsiniz. Stable Diffusion'dan üretilen her görsel, durum uzayında tek bir örnek yoldur.</div></div>
<div class="calc-card"><div class="card-title">Yoğunluk $p_t(x)$</div><div class="card-body">$X_t$'nin olasılık yoğunluğu. Bölüm 7'de türeteceğimiz Fokker-Planck PDE'sine göre zamanda evrilir. Bu, mikroskopik stokastik yörüngelerin makroskopik karşılığıdır.</div></div>
</div>

<div class="l-note"><strong>AI bu resmin neresinde yaşıyor.</strong> Modern bir Difüzyon modeli <em>veriyi</em> (bir görüntü, bir ses klibi, bir 3D şekil) bilinmeyen bir yoğunluk $p_{\\text{data}}$'dan bir örnek olarak ele alır. İleri süreç, yapıyı yavaşça gürültü ekleyerek yok eden bir SDE'dir; ters süreç, gürültüyü kaldırarak yapıyı yeniden inşa eden başka bir SDE'dir. Bir sinir ağı, ters SDE'nin veri yoğunluğu hakkında ihtiyaç duyduğu tek bilgi parçasını &mdash; skor $\\nabla \\log p_t$'yi &mdash; tahmin etmek için eğitilir. Geri kalan her şey kalkülüstür.</div>

<h2 class="lesson-title">2. Brownian Hareketi (Wiener Süreci)</h2>

<p class="l-text">SDE'leri ciddiye alabilmemizden önce gürültü sürücüsü $W_t$'yi inşa etmemiz gerekiyor. İstediğimiz nesne <strong>standart Brownian hareketi</strong>, ya da 1923'te ilk titiz matematiksel varlık ispatını sağlayan Norbert Wiener'in adıyla <strong>Wiener sürecidir</strong>. Robert Brown 1827'de altta yatan fiziksel fenomeni gözlemledi, sudaki polen tanelerinin moleküllerle bombardıman altında titrediğini izledi; Einstein 1905 <em>mucize yılı</em> makalesinde ilk nicel analizi verdi.</p>

<div class="calc-formula"><div class="formula-label">$W_t$'NİN TANIMLAYICI ÖZELLİKLERİ</div><div class="formula-main">$$W_0 = 0; \\quad W_{t+s} - W_s \\;\\sim\\; \\mathcal{N}(0, t); \\quad \\text{ayrik araliklar uzerindeki artimlar bagimsiz}; \\quad t \\mapsto W_t \\text{ neredeyse kesin surekli}.$$</div><div class="formula-sub">Dört aksiyom. Sıfırdan başla. Varyansı geçen zamana eşit Gauss artımları. Ayrık artımlar bağımsız. Örnek yollar $t$'nin sürekli fonksiyonları (olasılık bir ile).</div></div>

<p class="l-text">Bu aksiyomlardan üç dikkate değer sonuç çıkar. Birincisi, $\\mathbb{E}[W_t] = 0$ ve $\\mathrm{Var}(W_t) = t$, yani $t$ zamanındaki tipik gezi $\\sqrt{t}$ büyüklüğündedir &mdash; $t$ değil. Bu $\\sqrt{t}$ ölçeklendirmesi difüzyonun imzasıdır. İkincisi, her örnek yol sürekli olsa da, <strong>hiçbir örnek yol hiçbir noktada türevlenebilir değildir</strong>. Yol o kadar pürüzlüdür ki eğim her yerde ıraksar; bu tam olarak $dW/dt$'yi bir fonksiyon olarak yazamamamızın nedenidir. Üçüncüsü, herhangi bir aralıkta herhangi bir örnek yolun toplam varyasyonu sonsuzdur, ancak <em>kuadratik</em> varyasyon sonludur ve aralığın uzunluğuna eşittir. Bu son özellik, Itō kalkülüsünün büyüdüğü teknik tohumdur.</p>

<div id="plot-l6-brownian-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
function box(){var u=Math.random();var v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var N=600;var T=1.0;var dt=T/N;var sd=Math.sqrt(dt);
var ts=[];for(var i=0;i<=N;i++){ts.push(i*dt);}
var colors=['#3b82f6','#f59e0b','#10b981','#ef4444','#a78bfa'];
var traces=[];
for(var k=0;k<5;k++){var w=[0];for(var i=1;i<=N;i++){w.push(w[i-1]+sd*box());}
traces.push({x:ts,y:w,mode:'lines',name:'yol '+(k+1),line:{color:colors[k],width:1.6}});}
var envHi=[];var envLo=[];for(var i=0;i<=N;i++){envHi.push(2*Math.sqrt(ts[i]));envLo.push(-2*Math.sqrt(ts[i]));}
traces.push({x:ts,y:envHi,mode:'lines',name:'±2√t zarfı',line:{color:'#9ca3af',width:1.2,dash:'dot'}});
traces.push({x:ts,y:envLo,mode:'lines',line:{color:'#9ca3af',width:1.2,dash:'dot'},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'zaman t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'W(t)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-brownian-tr',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $[0, 1]$ üzerinde varyansı $dt = 1/600$ olan Gauss artımlarını biriktirerek üretilmiş beş bağımsız standart Brownian hareket örnek yolu. Her yol sıfırdan başlar ve öngörülemez biçimde dolaşır. Noktalı gri eğriler $\\pm 2\\sqrt{t}$ zarfını çizer, bir $\\%95$ güven bandı: $t$ zamanındaki standart sapma tam olarak $\\sqrt{t}$'dir, yani çoğu yol bu genişleyen koninin içinde kalır. Yollar görünür biçimde süreklidir ama görünür biçimde türevlenemezdir &mdash; herhangi bir parçaya yakınlaşın ve aynı pürüzlü doku tekrarlanır.</div></div>

<div class="calc-highlight"><strong>$\\sqrt{t}$ kuralı ve AI'da neden önemli.</strong> DDPM'in varyans-koruyan difüzyonunda $t$ zamanına kadar eklenen gürültünün standart sapması $\\sqrt{1 - \\bar{\\alpha}_t}$'dir ve $t$ büyüdükçe $1$'e yaklaşır. Programın bu şekilde görünmesinin nedeni tam olarak $\\sqrt{t}$ ölçeklendirmesidir: gürültü seviyesinin bir anlamda doğrusal büyümesini sağlamak için doğal kare-kök davranışını dikkatlice ayarlanmış bir sürüklenme katsayısıyla telafi etmek gerekir. Bir Difüzyon makalesinde gördüğünüz her gürültü programı, $\\sqrt{t}$ kuralı ile yapılan bir savaştır.</div>

<h2 class="lesson-title">3. $dW$ Neden Normal Bir Diferansiyel Değil</h2>

<p class="l-text">Klasik diferansiyeller zaman adımı küçüldükçe $dx \\to 0$ pürüzsüz biçimde uyar ve $(dt)^2$ ya da $dx\\, dt$ gibi diferansiyel çarpımları daha yüksek dereceli sonsuz küçüklerdir ve atarız. $dW$ ile kurallar değişir. $\\Delta t$ uzunluğunda bir adımda Brownian artımının standart sapması $\\sqrt{\\Delta t}$'dir, yani <em>karesinin</em> beklentisi $\\Delta t$'dir &mdash; $(\\Delta t)^2$ değil. Limitte bu, ünlü özdeşliğe dönüşür:</p>

<div class="calc-formula"><div class="formula-label">ITŌ TABLOSU</div><div class="formula-main">$$(dW_t)^2 \\;=\\; dt, \\qquad dW_t \\cdot dt \\;=\\; 0, \\qquad (dt)^2 \\;=\\; 0$$</div><div class="formula-sub">Stokastik diferansiyeller için çarpma kuralları. İlk kural tüm konunun kalbidir: Brownian artımının karesi ihmal edilebilir değil, tam olarak zaman adımıdır.</div></div>

<p class="l-text">Bu tek özdeşlik klasik zincir kuralını mahveder. $f(W_t + dW_t)$'yi birinci dereceye kadar saf bir şekilde açarsanız $f(W_t) + f'(W_t)\\, dW_t$ yazıp dururdunuz. Ama ikinci derece terim $(dW_t)^2 = dt$'yi içerir, bu da birinci derece zaman diferansiyeli ile <em>aynı mertebededir</em> ve atılamaz. Bu yüzden stokastik Taylor açılımları deterministik olanlardan bir terim daha derine iner ve fazladan terim, biraz sonra formal olarak tanışacağımız Itō düzeltmesidir.</p>

<div class="calc-example"><div class="example-label">HIZLI BİR SAYISAL KONTROL</div><div class="example-body">$[0, 1]$ üzerinde $\\Delta t = 10^{-4}$ ile Brownian hareketi simüle et. $S_N = \\sum_n (\\Delta W_n)^2$'yi hesapla, burada her $\\Delta W_n \\sim \\mathcal{N}(0, \\Delta t)$. $S_N$'in beklentisi $N \\cdot \\Delta t = 1$ ve varyansı $2 (\\Delta t)^2 \\cdot N = 2 \\Delta t \\to 0$'dır. Yani $S_N \\to 1$ neredeyse kesinlikle: $[0, 1]$ üzerinde Brownian hareketinin kuadratik varyasyonu, hangi örnek yolu çizerseniz çizin tam olarak $1$'dir. Deterministik özdeşlik $(dW)^2 = dt$ bu gerçeğin sonsuz küçük versiyonudur.</div></div>

<div class="l-note"><strong>DDPM neden $1 - \\beta_t$ değil $\\sqrt{1 - \\beta_t}$ kullanıyor.</strong> DDPM ileri adımı $x_t = \\sqrt{1 - \\beta_t}\\, x_{t-1} + \\sqrt{\\beta_t}\\, \\varepsilon$'dir. Neden iki farklı kare kök? Çünkü varyans toplanır, standart sapma değil. Bu adımda enjekte edilen gürültünün varyansı $\\beta_t$ ise standart sapma $\\sqrt{\\beta_t}$'dir. $x_{t-1}$ üzerindeki ölçek faktörü, marjinal varyans $1$'de kalsın diye seçilir: $(1 - \\beta_t) \\cdot 1 + \\beta_t = 1$. Bu sadece $(dW)^2 = dt$'nin kılık değiştirmiş hâlidir.</div>

<h2 class="lesson-title">4. Itō Kalkülüsü</h2>

<p class="l-text">$\\int_0^T g(X_t, t)\\, dW_t$ formundaki bir stokastik integrale anlam vermemiz gerekiyor. Riemann inşası işe yaramaz çünkü Brownian yolların sonsuz varyasyonu vardır: integrand her bölümleme hücresinin sol uç noktasında mı, sağ uç noktasında mı yoksa ortasında mı örneklediğinize bağlı olarak limitte gerçekten farklı cevaplar elde edersiniz. Tek bir "doğal" seçim yoktur; bir konvansiyon seçmek ve ona bağlı kalmak zorundasınız.</p>

<div class="calc-formula"><div class="formula-label">ITŌ İNTEGRALİ</div><div class="formula-main">$$\\int_0^T g(X_t, t)\\, dW_t \\;=\\; \\lim_{\\|\\Pi\\| \\to 0} \\sum_{n=0}^{N-1} g(X_{t_n}, t_n)\\, \\bigl(W_{t_{n+1}} - W_{t_n}\\bigr)$$</div><div class="formula-sub">Itō'nun seçimi: integrandı daima her bölümleme hücresinin <em>sol</em> uç noktası $t_n$'de değerlendir, sonra ağ boyutu $\\|\\Pi\\| \\to 0$ olurken limiti al. Sonuç iyi tanımlıdır ve $L^2$'de yakınsar.</div></div>

<p class="l-text">Sol-uç kuralının nedeni keyfi değildir &mdash; bu bir adalet koşuludur. Stokastik bir modelde integrand $g(X_{t_n}, t_n)$ $t_n$ zamanında bir kararı (portföy tutuşunu, kontrol cihazı ayarını, model durumunu) temsil eder; artım $W_{t_{n+1}} - W_{t_n}$ ardından gelen rastgele sonuçtur. Itō konvansiyonu şöyle der: <strong>$t_n$'deki kararınız gelecek gürültüyü görmeden önce verilmelidir.</strong> Kararlar <em>öngörmeyendir</em>. Herhangi başka bir konvansiyon integrandın geleceğe bakmasına izin verir, ki bu nedensel modellerle olan bağı yok eder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Itō konvansiyonu (sol uç)</div><div class="card-body">Öngörmeyen. Bir martingale verir: $\\mathbb{E}\\bigl[\\int_0^T g\\, dW\\bigr] = 0$. Finans, optimal kontrol ve geleceği göremeyen kararların bulunduğu difüzyon model eğitimi için doğru çerçevedir.</div></div>
<div class="calc-card"><div class="card-title">Stratonovich konvansiyonu (orta nokta)</div><div class="card-body">Simetrik. Sıradan zincir kuralına uyar ama öngörmeyen <em>değildir</em>. Gürültünün küçük ama sıfırdan farklı bir korelasyon zamanına sahip olduğu fizikte ve manifold üzerindeki SDE'lerde kullanışlıdır.</div></div>
<div class="calc-card"><div class="card-title">Itō izometrisi</div><div class="card-body">$\\mathbb{E}\\bigl[\\bigl(\\int_0^T g\\, dW\\bigr)^2\\bigr] = \\mathbb{E}\\bigl[\\int_0^T g^2\\, dt\\bigr]$. Bir Itō integralinin varyansı $g^2$'nin sıradan zaman integraline eşittir. İkinci momentleri hesaplamak için güçlü bir araç.</div></div>
<div class="calc-card"><div class="card-title">İkisi arasında çeviri</div><div class="card-body">Bir Stratonovich SDE'si $dX = f\\, dt + g \\circ dW$ Itō SDE'si $dX = (f + \\tfrac{1}{2} g\\, g')\\, dt + g\\, dW$'ye eşittir. Fazladan sürüklenme <em>Itō-Stratonovich düzeltmesidir</em> ve $(dW)^2 = dt$ kuralından kaynaklanır.</div></div>
</div>

<div class="l-note"><strong>Difüzyon modelleri hangi konvansiyonu kullanır?</strong> Itō. DDPM, skor SDE'leri ve Flow Matching için göreceğiniz tüm formüller öngörmeyen integrandlarla Itō formunda yazılmıştır. Eğitim kaybı, mevcut duruma bağlı bir koşullu beklentidir, bu da Itō çerçevesiyle mükemmel uyum sağlar.</div>

<h2 class="lesson-title">5. Itō Lemması — SDE'ler İçin Zincir Kuralı</h2>

<p class="l-text">Eğer $X_t$ SDE $dX_t = f(X_t, t)\\, dt + g(X_t, t)\\, dW_t$'yi sağlıyorsa ve $Y_t = \\varphi(X_t, t)$ pürüzsüz bir $\\varphi$ için tanımlıysa, $Y_t$ hangi SDE'yi sağlar? Deterministik zincir kuralı $dY = (\\partial \\varphi / \\partial t + (\\partial \\varphi / \\partial x) \\dot X)\\, dt$ derdi. Stokastik olarak ikinci dereceye kadar açmak zorundayız çünkü $(dW)^2 = dt$.</p>

<div class="calc-formula"><div class="formula-label">ITŌ LEMMASI</div><div class="formula-main">$$dY_t \\;=\\; \\Bigl[\\, \\frac{\\partial \\varphi}{\\partial t} + f \\frac{\\partial \\varphi}{\\partial x} + \\frac{1}{2} g^2 \\frac{\\partial^2 \\varphi}{\\partial x^2}\\,\\Bigr] dt \\;+\\; g \\frac{\\partial \\varphi}{\\partial x}\\, dW_t$$</div><div class="formula-sub">Deterministik zincir kuralı ile birlikte fazladan $\\tfrac{1}{2} g^2 \\varphi_{xx}\\, dt$ terimi, yalnızca $(dW)^2 = dt$'nin bir sonucu olan <em>Itō düzeltmesi</em>.</div></div>

<p class="l-text"><strong>İspat taslağı.</strong> $\\varphi$'nin $(X_t, t)$ etrafındaki Taylor açılımını ikinci dereceye kadar uygula:</p>

<div class="calc-formula"><div class="formula-label">İKİNCİ DERECE TAYLOR</div><div class="formula-main">$$d\\varphi \\;=\\; \\varphi_t\\, dt + \\varphi_x\\, dX + \\tfrac{1}{2} \\varphi_{xx}\\, (dX)^2 + \\cdots$$</div><div class="formula-sub">Şimdi $dX = f\\, dt + g\\, dW$'yu yerine koy ve $(dX)^2$'yi Itō çarpma tablosuyla aç.</div></div>

<div class="calc-formula"><div class="formula-label">$(dX)^2$'YİN HESAPLANMASI</div><div class="formula-main">$$(dX)^2 \\;=\\; (f\\, dt + g\\, dW)^2 \\;=\\; f^2 (dt)^2 + 2 f g\\, dt\\, dW + g^2 (dW)^2 \\;=\\; g^2\\, dt$$</div><div class="formula-sub">Üç terimden ikisi yok olur: $(dt)^2 = 0$ ve $dt \\cdot dW = 0$. Yalnızca $(dW)^2 = dt$ hayatta kalır.</div></div>

<p class="l-text">Bunu geri koy, $dt$ ve $dW$ katkılarını topla ve Itō lemması ortaya çıkar. Örüntü genelleşir: $\\varphi(X^1, \\ldots, X^d, t)$ ve vektör SDE $dX^i = f^i\\, dt + \\sum_j g^{ij}\\, dW^j$ için Itō lemması $d\\varphi = (\\varphi_t + f \\cdot \\nabla \\varphi + \\tfrac{1}{2}\\mathrm{tr}(g g^\\top \\nabla^2 \\varphi))\\, dt + (\\nabla \\varphi)^\\top g\\, dW$ olur. $g g^\\top$'nin izi çarpı Hessian, çok değişkenli Itō düzeltmesidir.</p>

<div class="think-box"><div class="think-label">BÜYÜK FİKİR</div><div class="think-body">Itō düzeltmesi $\\tfrac{1}{2} g^2 \\varphi_{xx}$ bir sıkıntı değildir. Stokastik kalkülüsün dağılımları gerçekten doğru hesaplamasını sağlayan terimdir. Fokker-Planck denklemi, Feynman-Kac formülü, Black-Scholes denklemi ve Difüzyon modellerini güçlendiren ters-zaman SDE, hepsi bu terimle yaşar ya da ölür.</div></div>

<h2 class="lesson-title">6. İşlenmiş Örnek: Geometrik Brownian Hareketi</h2>

<p class="l-text">Itō lemmasının en temiz uygulaması, Black ve Scholes'un 1973'te hisse fiyatlarını modellemek için kullandığı SDE'dir:</p>

<div class="calc-formula"><div class="formula-label">GEOMETRİK BROWNIAN HAREKETİ (GBM)</div><div class="formula-main">$$dS_t \\;=\\; \\mu\\, S_t\\, dt + \\sigma\\, S_t\\, dW_t, \\qquad S_0 \\text{ verili}$$</div><div class="formula-sub">Mevcut fiyatla orantılı sürüklenme (böylece yüzde getirilerin ortalaması sabit $\\mu$) ve yine orantılı difüzyon (böylece yüzde getirilerin oynaklığı sabit $\\sigma$).</div></div>

<p class="l-text">İncelik Itō lemmasını $Y_t = \\log S_t$'ye uygulamaktır. Burada $\\varphi(s) = \\log s$, yani $\\varphi_s = 1/s$ ve $\\varphi_{ss} = -1/s^2$. $f = \\mu s$ ve $g = \\sigma s$ ile şunu elde ederiz:</p>

<div class="calc-formula"><div class="formula-label">$\\log S_t$'YE UYGULANAN ITŌ LEMMASI</div><div class="formula-main">$$d(\\log S_t) \\;=\\; \\Bigl[\\mu s \\cdot \\tfrac{1}{s} + \\tfrac{1}{2}\\sigma^2 s^2 \\cdot \\bigl(-\\tfrac{1}{s^2}\\bigr)\\Bigr] dt + \\sigma s \\cdot \\tfrac{1}{s}\\, dW \\;=\\; \\Bigl[\\mu - \\tfrac{\\sigma^2}{2}\\Bigr] dt + \\sigma\\, dW$$</div><div class="formula-sub">Itō düzeltmesi $-\\sigma^2/2$ ünlü "varyans yükü"dür. Onsuz, zincir kuralı yanlışlıkla $d(\\log S) = \\mu\\, dt + \\sigma\\, dW$ verirdi.</div></div>

<p class="l-text">Sağ taraf şimdi $\\log S_t$ için sabit-katsayılı bir SDE'dir, kolayca integre edilir: $\\log S_t = \\log S_0 + (\\mu - \\sigma^2 / 2)\\, t + \\sigma\\, W_t$. Üstel almak açık kapalı-form çözümü verir.</p>

<div class="calc-formula"><div class="formula-label">AÇIK GBM ÇÖZÜMÜ</div><div class="formula-main">$$S_t \\;=\\; S_0 \\exp\\!\\Bigl(\\bigl(\\mu - \\tfrac{\\sigma^2}{2}\\bigr) t + \\sigma\\, W_t\\Bigr)$$</div><div class="formula-sub">Her $t$'de log-normal bir rastgele değişken. Her zaman pozitif (fiyatlar için iyi), $\\mathbb{E}[S_t] = S_0 e^{\\mu t}$ ve medyan $S_0 e^{(\\mu - \\sigma^2/2) t}$ ile. Ortalama ve medyan tam olarak Itō düzeltmesi kadar farklıdır.</div></div>

<div id="plot-l6-gbm-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
function box(){var u=Math.random();var v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var N=400;var T=2.0;var dt=T/N;var sd=Math.sqrt(dt);var mu=0.15;var sigma=0.45;var S0=100;
var ts=[];for(var i=0;i<=N;i++){ts.push(i*dt);}
var colors=['#3b82f6','#f59e0b','#10b981','#ef4444','#a78bfa'];
var traces=[];
for(var k=0;k<5;k++){var lw=Math.log(S0);var s=[S0];
for(var i=1;i<=N;i++){lw+=(mu-0.5*sigma*sigma)*dt+sigma*sd*box();s.push(Math.exp(lw));}
traces.push({x:ts,y:s,mode:'lines',name:'yol '+(k+1),line:{color:colors[k],width:1.7}});}
var meanLine=ts.map(function(t){return S0*Math.exp(mu*t);});
traces.push({x:ts,y:meanLine,mode:'lines',name:'E[S_t] = S0·exp(μt)',line:{color:'#9ca3af',width:2,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'zaman t (yıl)',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'fiyat S(t)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-gbm-tr',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $S_0 = 100$, sürüklenme $\\mu = 0.15$ (yıllık $\\%15$), oynaklık $\\sigma = 0.45$ (yıllık $\\%45$) ile iki yıl boyunca analitik formül $S_t = S_0 \\exp((\\mu - \\sigma^2/2)\\, t + \\sigma W_t)$ ile simüle edilmiş beş geometrik Brownian hareket örnek yolu. Kesik gri çizgi teorik ortalama $\\mathbb{E}[S_t] = S_0 e^{\\mu t}$'dir. Üç gözlem: (1) her yol pozitif kalır &mdash; üstel bunu garanti eder; (2) yayılım beklendiği gibi $\\sqrt{t}$ ile genişler; (3) bazı bireysel yollar ortalamanın altında kalır &mdash; bu varyans yükü $-\\sigma^2/2$'nin iş başındaki hâlidir: tipik (medyan) yol tüm yolların ortalamasından daha yavaş büyür.</div></div>

<div class="l-note"><strong>GBM neden finansın ötesinde önemli.</strong> Birçok DDPM türetmesi ileri süreci marjinalleri Gauss olan Ornstein-Uhlenbeck benzeri bir SDE olarak yazar. Itō-lemma manipülasyonları GBM hesaplamasıyla aynıdır: log-uzayına geç, sabit-katsayılı SDE'yi integre et, üstel al. GBM hesaplamasını elle yapabilir olduğunuzda, herhangi bir skor-SDE makalesinin ekini okuyabilirsiniz.</div>

<h2 class="lesson-title">7. Fokker-Planck Denklemi</h2>

<p class="l-text">Bir SDE mikroskopik rastgele yörünge $X_t$'yi yönetir. Makroskopik nicelik onun olasılık yoğunluğu $p_t(x) = p(x, t)$'dir, öyle ki $\\Pr(X_t \\in [a, b]) = \\int_a^b p(x, t)\\, dx$. Fokker-Planck denklemi (Adriaan Fokker ve Max Planck'ın çalışmalarına dayanarak Andrey Kolmogorov 1931'de genel formunda) $p$'nin evrimini yöneten PDE'dir.</p>

<div class="calc-formula"><div class="formula-label">FOKKER-PLANCK DENKLEMİ (1-B)</div><div class="formula-main">$$\\frac{\\partial p(x, t)}{\\partial t} \\;=\\; -\\frac{\\partial}{\\partial x}\\bigl[\\, f(x, t)\\, p(x, t)\\,\\bigr] \\;+\\; \\frac{1}{2}\\frac{\\partial^2}{\\partial x^2}\\bigl[\\, g(x, t)^2\\, p(x, t)\\,\\bigr]$$</div><div class="formula-sub">İlk terim: deterministik sürüklenme yoğunluğu $f$ akışı boyunca taşır. İkinci terim: difüzyon yoğunluğu yerel oranı $g^2$ ile yayar. Birlikte olasılık için bir korunum yasası oluşturur.</div></div>

<p class="l-text">İki özel durum öğreticidir. Saf sürüklenme $g \\equiv 0$ ile denklem $p_t + (f p)_x = 0$, taşımanın süreklilik denklemi olur: yoğunluk yayılmadan karakteristikler boyunca akar. Saf difüzyon $f \\equiv 0$ ve sabit $g$ ile denklem $p_t = (g^2 / 2)\\, p_{xx}$ olur, tam olarak Ders 4'te tanıştığımız ısı denklemi. Yani <strong>ısı denklemi sadece standart Brownian hareketi için Fokker-Planck denklemidir.</strong> Deterministik ve stokastik dünyalar bu PDE üzerinden buluşur.</p>

<div id="plot-l6-fokker-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nx=80;var Nt=60;var xs=[];var ts=[];var z=[];
for(var i=0;i<Nx;i++){xs.push(-5+10*i/(Nx-1));}
for(var j=0;j<Nt;j++){ts.push(0.02+1.5*j/(Nt-1));}
for(var j=0;j<Nt;j++){var row=[];var t=ts[j];
for(var i=0;i<Nx;i++){var x=xs[i];
var p=Math.exp(-x*x/(2*t))/Math.sqrt(2*Math.PI*t);
row.push(p);}z.push(row);}
var d1={x:xs,y:ts,z:z,type:'heatmap',colorscale:[[0,'#0c1024'],[0.3,'#1d4ed8'],[0.6,'#3b82f6'],[0.85,'#fbbf24'],[1,'#fef3c7']],colorbar:{title:'p(x,t)'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'konum x',gridcolor:'#1f2937'},yaxis:{title:'zaman t',gridcolor:'#1f2937'},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-fokker-tr',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> orijinden bir delta'dan başlatılan standart Brownian hareket için Fokker-Planck yoğunluğu $p(x, t) = (2\\pi t)^{-1/2} \\exp(-x^2/(2t))$. Zaman arttıkça yoğunluk yayılır: $t = 0.02$'de $x = 0$ yakınında keskin bir sivri uçtur; $t = 1.5$'e gelindiğinde standart sapması $\\sqrt{t}$ olan geniş bir çana düzleşmiştir. Her zaman dilimde toplam olasılık $1$ kalır. Bu kılık değiştirmiş ısı denklemidir &mdash; ve Bölüm 2'deki dolaşan yolların makroskopik karşılığıdır.</div></div>

<div class="calc-highlight"><strong>Fokker-Planck neden Difüzyon modellerinin motorudur.</strong> Bir Difüzyon modelinin, gürültülenmiş bir girdi $x_t$ verildiğinde, piksel uzayında hangi yönün "temiz veriye geri" işaret ettiğini bilmesi gerekir. Bu yön $\\nabla_x \\log p_t(x)$'tir &mdash; gürültülenmiş dağılımın log-yoğunluğunun gradyanı. Fokker-Planck olmadan bu yoğunluğun nasıl evrildiği hakkında hiçbir fikriniz olmazdı. Fokker-Planck ile her gürültü seviyesindeki marjinal yoğunluk $p_t$ verinin bilinen bir Gauss konvolüsyonudur ve skor, gürültüsüzleştirici skor eşleştirmesi ile öğrenilebilir.</div>

<h2 class="lesson-title">8. Ters-Zaman SDE (Anderson 1982)</h2>

<p class="l-text">İşte stokastik kalkülüsü Difüzyon modellerine bağlayan sonuç. İleri SDE $dX_t = f(X_t, t)\\, dt + g(t)\\, dW_t$'nin $t = 0$'dan $t = T$'ye çalıştığını ve bir yoğunluk $p_t(x)$ ürettiğini varsayalım. Brian Anderson 1982'de <em>zaman-tersi</em> sürecin $\\bar{X}_t = X_{T - t}$'nin kendisinin ters zamanda bir SDE tarafından sürülen bir difüzyon olduğunu kanıtladı:</p>

<div class="calc-formula"><div class="formula-label">ANDERSON TERS-ZAMAN SDE</div><div class="formula-main">$$dX_t \\;=\\; \\bigl[\\, f(X_t, t) - g(t)^2\\, \\nabla_x \\log p_t(X_t)\\,\\bigr]\\, dt + g(t)\\, d\\bar{W}_t$$</div><div class="formula-sub">İleri SDE ile aynı form, iki değişiklik dışında: sürüklenme süreci yüksek-yoğunluk bölgelerine geri çeken fazladan bir "<em>skor</em>" terimi $-g^2 \\nabla \\log p_t$ kazanır ve Brownian hareketi ters-zaman Brownian hareketi $\\bar{W}_t$ ile değiştirilir.</div></div>

<p class="l-text">Bu formülü dikkatlice oku. Fazladan sürüklenme katkısı <strong>log-yoğunluğun gradyanıdır</strong>, <strong>skor</strong> olarak adlandırılır. Bu, ters SDE'de veri dağılımına bağlı <em>tek</em> niceliktir: sürüklenme $f$ ve difüzyon $g$ kullanıcı tarafından seçilir, Brownian hareketi sadece gürültüdür, ama skor $\\nabla \\log p_t$ veri tarafından belirlenir ve tahmin edilmelidir. Tek bir cümleyle, Difüzyon üretici modelleme <strong>bir sinir ağı $s_\\theta(x, t) \\approx \\nabla \\log p_t(x)$ eğitme ve onu Anderson formülüne yerleştirme</strong> projesidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Skor $\\nabla \\log p_t(x)$</div><div class="card-body">Log-yoğunlukta yukarı işaret eder. Eğer $p_t$ veri manifoldunun etrafında yerel olarak Gauss ise, skor manifolda işaret eder. Bu vektör alanını öğrenmek Difüzyon'daki tüm öğrenme problemidir.</div></div>
<div class="calc-card"><div class="card-title">Neden $g(t)^2 \\nabla \\log p_t$</div><div class="card-body">$g^2$ faktörü difüzyon büyüklüğünü eşleştirir. Daha gürültülü bir ileri süreç tersine daha güçlü bir skor düzeltmesine ihtiyaç duyar. Bu tam olarak Itō düzeltmesi $(dW)^2 = dt$'nin yeniden yüzeye çıkmasıdır.</div></div>
<div class="calc-card"><div class="card-title">Ters Brownian $d\\bar{W}_t$</div><div class="card-body">Ters örnekleme sırasında taze bir stokastik tekme. Onsuz, üretilen örnekler ileri sürecin yok ettiği küçük ayrıntılardan yoksun olurdu. Onu sıfıra ayarlayın ve deterministik olasılık-akış ODE'sini geri elde edersiniz.</div></div>
<div class="calc-card"><div class="card-title">Olasılık-akış ODE</div><div class="card-body">$dx/dt = f(x, t) - \\tfrac{1}{2} g(t)^2\\, \\nabla \\log p_t(x)$. Ters SDE ile aynı marjinaller, gürültü yok. DDIM ve Heun-Karras gibi deterministik örnekleyicilerde çıkarımda kullanılır.</div></div>
</div>

<h2 class="lesson-title">9. Difüzyon Modellerine Bağlantı — DDPM (Ho ve diğ. 2020)</h2>

<p class="l-text">Ho, Jain ve Abbeel (2020) tarafından geliştirilen gürültüsüzleştirici difüzyon olasılıksal modeli belirli bir SDE'nin ayrıklaştırmasıdır. İleri Markov zinciri şudur:</p>

<div class="calc-formula"><div class="formula-label">DDPM İLERİ ZİNCİRİ</div><div class="formula-main">$$q(x_t \\mid x_{t-1}) \\;=\\; \\mathcal{N}\\!\\bigl(x_t;\\; \\sqrt{1 - \\beta_t}\\, x_{t-1},\\; \\beta_t I\\bigr), \\qquad t = 1, 2, \\ldots, T$$</div><div class="formula-sub">$\\beta_t$ küçük bir gürültü programıdır; yaygın seçimler doğrusal ($\\beta_t$ $T = 1000$ adımda $10^{-4}$'ten $0.02$'ye) ya da kosinüs (Nichol-Dhariwal 2021) programıdır.</div></div>

<p class="l-text">Adım büyüklüğünü sıfıra gönder ve ayrık indeksi sürekli bir zaman $t \\in [0, 1]$ olarak yeniden yorumla. Zincir bir stokastik diferansiyel denkleme dönüşür:</p>

<div class="calc-formula"><div class="formula-label">VARYANS-KORUYAN SDE (VP-SDE)</div><div class="formula-main">$$dx \\;=\\; -\\tfrac{1}{2}\\, \\beta(t)\\, x\\, dt \\;+\\; \\sqrt{\\beta(t)}\\, dW_t$$</div><div class="formula-sub">Bir Ornstein-Uhlenbeck süreci. Sürüklenme $x$'i orijine çeker, böylece marjinal varyansı sınırlı kalır; difüzyon taze gürültü enjekte eder. $t \\to 1$'de marjinal, veri dağılımından bağımsız olarak standart bir normale $\\mathcal{N}(0, I)$ yakınsar.</div></div>

<p class="l-text">DDPM'deki sinir ağı, $\\varepsilon_\\theta(x_t, t)$ olarak gösterilen, temiz bir örnek $x_0$'a eklenen gürültüyü tahmin ederek $x_t$'yi üretir. Skora bağlantı şudur:</p>

<div class="calc-formula"><div class="formula-label">EPSILON-TAHMİN ↔ SKOR</div><div class="formula-main">$$\\nabla_x \\log p_t(x_t) \\;=\\; -\\frac{\\varepsilon_\\theta(x_t, t)}{\\sqrt{1 - \\bar{\\alpha}_t}}, \\qquad \\bar{\\alpha}_t = \\prod_{s=1}^{t}(1 - \\beta_s)$$</div><div class="formula-sub">DDPM ağı $\\varepsilon$'u öğrenir, ama $\\sqrt{1 - \\bar{\\alpha}_t}$'ye bölmek skoru verir. İki parametrizasyon tam olarak eşdeğerdir; aralarındaki seçim çoğunlukla bir sayısal kararlılık sorusudur.</div></div>

<p class="l-text">Örnekleme ters SDE'yi $t = 1$'den $t = 0$'a geriye doğru çalıştırır. Öğrenilen skoru Anderson formülüne yerleştirmek DDPM ters adımını verir (Ho ve diğ. makalesinin Algoritma 2'si). Her adım gürültülenmiş bir görüntüyü alır, $\\varepsilon_\\theta$ kullanarak gürültüsüzleştirilmiş bir ortalama hesaplar, kalibre edilmiş Gauss gürültüsü ekler ($d\\bar{W}$ terimi) ve biraz daha temiz bir görüntü üretir. Böyle 1000 adımdan sonra üretilmiş bir örneğiniz olur.</p>

<div id="plot-l6-ddpm-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
function box(){var u=Math.random();var v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function bimodal(){var m=(Math.random()<0.5)?-2:2;return m+0.4*box();}
var Nsamples=600;var ts=[0.0,0.25,0.5,0.75,1.0];var colors=['#3b82f6','#22d3ee','#a78bfa','#f59e0b','#ef4444'];
var traces=[];var bins=40;var lo=-5;var hi=5;
for(var k=0;k<ts.length;k++){var t=ts[k];var data=[];
for(var i=0;i<Nsamples;i++){var x0=bimodal();
var alphaBar=Math.exp(-3*t);
var xt=Math.sqrt(alphaBar)*x0+Math.sqrt(1-alphaBar)*box();
data.push(xt);}
var hist=new Array(bins).fill(0);for(var i=0;i<data.length;i++){var b=Math.floor((data[i]-lo)/(hi-lo)*bins);if(b>=0&&b<bins)hist[b]++;}
var xs=[];var ys=[];for(var b=0;b<bins;b++){xs.push(lo+(b+0.5)*(hi-lo)/bins);ys.push(hist[b]/Nsamples);}
traces.push({x:xs,y:ys,mode:'lines',name:'t = '+t.toFixed(2),line:{color:colors[k],width:2.2,shape:'spline'}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'p_t(x) (ampirik)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-ddpm-tr',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $x = \\pm 2$ modlarıyla iki modlu bir oyuncak veri dağılımına uygulanan DDPM ileri süreci. Renkte beş zaman dilimi $t = 0$'dan (keskin iki-tepe veri) $t = 1$'e (esasen $\\mathcal{N}(0, 1)$ gürültü) kadar. Ara zamanlarda iki tepe küçülür, orijine doğru kayar ve birleşene kadar genişler. Ters süreç, öğrenilen skor $\\varepsilon_\\theta$ ile parametrelendirilir, bu animasyonu geriye çalıştırır: kırmızı eğriden başlar ve Anderson'un ters SDE'sini takip ederek mavi eğriyi örnek örnek yeniden inşa eder.</div></div>

<h2 class="lesson-title">10. Skor Tabanlı Üretici Modeller (Song-Ermon 2019, Song 2021)</h2>

<p class="l-text">Yang Song ve Stefano Ermon 2019'da "Generative Modeling by Estimating Gradients of the Data Distribution" başlıklı makaleyi yayımladılar. Fikirleri, birden çok gürültü seviyesinde <strong>gürültüsüzleştirici skor eşleştirme</strong> kullanarak doğrudan $s_\\theta(x) \\approx \\nabla \\log p_{\\text{data}}(x)$'i öğrenmek ve sonra tavlanmış Langevin dinamikleri ile örneklemekti. İki yıl sonra Song ve diğ. (2021) DDPM ve skor eşleştirmeyi tek bir sürekli-zaman SDE çerçevesi altında birleştirdi. İki kanonik SDE şu anda kullanılan modellerin neredeyse tamamını kapsar.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">VARYANS KORUYAN (VP) &mdash; DDPM</div><div class="compare-item">$dx = -\\tfrac{1}{2}\\beta(t)\\, x\\, dt + \\sqrt{\\beta(t)}\\, dW$</div><div class="compare-item">Marjinal varyans sınırlıdır; son dağılım $\\mathcal{N}(0, I)$'dir.</div><div class="compare-item">Ho ve diğ. (2020), skor $\\varepsilon$-tahmini olarak parametrize edilir.</div><div class="compare-item">Pürüzsüz, iyi davranışlı skor; latent diffusion'da popüler.</div></div><div class="compare-col"><div class="compare-title">VARYANS PATLAYAN (VE) &mdash; NCSN</div><div class="compare-item">$dx = \\sqrt{\\tfrac{d}{dt}\\sigma^2(t)}\\, dW$</div><div class="compare-item">Sürüklenme yok; varyans çok büyük bir değere $\\sigma^2(t)$ olarak büyür.</div><div class="compare-item">Song-Ermon (2019), skor $s_\\theta$ olarak parametrize edilir.</div><div class="compare-item">Daha büyük dinamik aralık; EDM ön-koşullandırmasından yararlanır.</div></div></div>

<p class="l-text">Eğitim hedefi her iki durumda da aynıdır: <strong>gürültüsüzleştirici skor eşleştirme</strong>. $x_0 \\sim p_{\\text{data}}$, $t \\sim U(0, T)$ ile $(x_0, t)$ örnekle; bilinen ileri geçiş kullanarak $x_t$'ye bozulma uygula; $s_\\theta(x_t, t)$'yi kapalı-form Gauss ifadesine sahip skor $\\nabla_{x_t} \\log p_t(x_t \\mid x_0)$'ı tahmin etmek için eğit. Vincent (2011), bunun beklentide marjinal skoru öğrendiğini kanıtladı ve orijinal Hyvärinen 2005 skor-eşleştirme hedefinin işlenemezliğini aşıyor.</p>

<div class="calc-formula"><div class="formula-label">GÜRÜLTÜSÜZLEŞTİRİCİ SKOR EŞLEŞTİRME KAYBI</div><div class="formula-main">$$\\mathcal{L}(\\theta) \\;=\\; \\mathbb{E}_{t, x_0, x_t \\mid x_0}\\Bigl[\\, \\lambda(t)\\, \\bigl\\| s_\\theta(x_t, t) - \\nabla_{x_t} \\log q_t(x_t \\mid x_0)\\bigr\\|^2\\,\\Bigr]$$</div><div class="formula-sub">Tahmin edilen skor ile kapalı-form koşullu skor arasında ağırlıklı MSE. $\\lambda(t)$, seçimi örnek kalitesini derinden etkileyen pozitif bir ağırlıklandırma fonksiyonudur.</div></div>

<p class="l-text">Tero Karras ve işbirlikçileri (EDM, 2022), bunu temizleyen bir dizi ampirik ve teorik iyileştirme yaptılar: bir $\\sigma$-koşullu VE tarzı parametrizasyon, Karras gürültü programı $\\sigma(t) = (\\sigma_{\\max}^{1/\\rho} + t(\\sigma_{\\min}^{1/\\rho} - \\sigma_{\\max}^{1/\\rho}))^\\rho$ ($\\rho = 7$ ile), ağ ön-koşullandırması $D_\\theta(x; \\sigma) = c_{\\text{skip}}\\, x + c_{\\text{out}}\\, F_\\theta(c_{\\text{in}}\\, x; c_{\\text{noise}})$ ve ikinci dereceden bir Heun örnekleyicisi. EDM bugün yüksek kaliteli skor tabanlı üretim için fiili tarifdir; çerçeve hâlâ aynı Itō SDE'sidir.</p>

<div id="plot-l6-score-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nx=22;var Ny=22;var xs=[];var ys=[];var us=[];var vs=[];
var x0=Array.from({length:Nx*Ny},function(_,k){return -3+6*((k%Nx)/(Nx-1));});
var y0=Array.from({length:Nx*Ny},function(_,k){return -3+6*(Math.floor(k/Nx)/(Ny-1));});
for(var k=0;k<x0.length;k++){var x=x0[k];var y=y0[k];
var mx1=-1.2;var my1=-0.8;var mx2=1.3;var my2=1.0;var s2=0.6;
var w1=Math.exp(-((x-mx1)*(x-mx1)+(y-my1)*(y-my1))/(2*s2));
var w2=Math.exp(-((x-mx2)*(x-mx2)+(y-my2)*(y-my2))/(2*s2));
var pp=w1+w2;
var gx=(w1*(mx1-x)+w2*(mx2-x))/(s2*pp);
var gy=(w1*(my1-y)+w2*(my2-y))/(s2*pp);
var nrm=Math.sqrt(gx*gx+gy*gy)+1e-9;var sc=0.25/Math.max(nrm,0.5);
xs.push(x);ys.push(y);us.push(gx*sc);vs.push(gy*sc);}
var segX=[];var segY=[];for(var k=0;k<xs.length;k++){segX.push(xs[k]);segX.push(xs[k]+us[k]);segX.push(null);segY.push(ys[k]);segY.push(ys[k]+vs[k]);segY.push(null);}
var d1={x:segX,y:segY,mode:'lines',name:'skor alanı ∇log p(x)',line:{color:'#3b82f6',width:1.5}};
var d2={x:xs,y:ys,mode:'markers',name:'örnek ızgarası',marker:{size:3,color:'#9ca3af'},showlegend:false};
var d3={x:[-1.2,1.3],y:[-0.8,1.0],mode:'markers',name:'veri modları',marker:{size:11,color:'#f59e0b',symbol:'star'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x1',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-3.3,3.3]},yaxis:{title:'x2',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-3.3,3.3],scaleanchor:'x'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-score-tr',[d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $(-1.2, -0.8)$ ve $(1.3, 1.0)$ modlarına sahip bir 2-B Gauss karışımının skor alanı $\\nabla \\log p(x)$. Her mavi ok log-yoğunluk üzerinde yukarı, düşük olasılıklı bölgelerden uzağa ve en yakın moda (turuncu yıldızlar) doğru işaret eder. Bir skor tabanlı üretici model gürültü dağılımındaki köşelerdeki rastgele bir örnekten başlar ve bir moda ulaşana kadar (uygun gürültü seviyesinde) bunlar gibi okları takip eder. Bu tam olarak Langevin dinamiklerinin ve ters SDE'nin yaptığıdır, yalnızca çok daha fazla boyutta.</div></div>

<h2 class="lesson-title">11. Flow Matching (Lipman ve diğ. 2023)</h2>

<p class="l-text">Yaron Lipman ve işbirlikçileri ("Flow Matching for Generative Modeling", 2023), skoru hiç öğrenmenize gerek olmadığını gösterdi. Doğrudan bir <strong>hız alanı</strong> $v_\\theta(x, t)$ öğrenebilir ve hem eğitim hem örnekleme için bir SDE değil, adi diferansiyel denklem kullanabilirsiniz.</p>

<div class="calc-formula"><div class="formula-label">FLOW MATCHING ODE</div><div class="formula-main">$$\\frac{dx_t}{dt} \\;=\\; v_t(x_t), \\qquad x_0 \\sim p_{\\text{noise}}, \\qquad x_1 \\sim p_{\\text{data}}$$</div><div class="formula-sub">Deterministik bir taşıma: $t = 0$'da örnekler basit bir gürültü dağılımından çekilir; öğrenilen hız alanını $t = 1$'e kadar deterministik olarak takip etmek veri dağılımından örnekler üretir.</div></div>

<p class="l-text">Eğitim incelik, <em>koşullu akış eşleştirmedir</em>. Temiz bir veri noktası $x_1$ seç, gürültüden veriye doğrusal olarak enterpolasyon yapan bir koşullu olasılık yolu $p_t(x \\mid x_1) = \\mathcal{N}((1 - t)\\, x_0 + t\\, x_1,\\, \\sigma_{\\min}^2 I)$ tanımla ve ağı koşullu vektör alanı $u_t(x \\mid x_1) = x_1 - x_0$'ı eşleştirmek için eğit &mdash; zamanda bir sabit! Lipman ve diğ. bu vekil hedefin işlenemez koşulsuz akış-eşleştirme kaybıyla <em>aynı gradyana</em> sahip olduğunu kanıtladı. Sonuç skor eşleştirmeden dramatik olarak daha basit eğitim, öğrenilmiş varyans programı yok ve çıkarımda daha hızlı ODE örneklemesidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hız vs skor</div><div class="card-body">Bir Gauss yolunda hız alanı ve skor alanı doğrusal olarak ilişkilidir: $v_t(x) = -\\tfrac{1}{2} g(t)^2 \\nabla \\log p_t(x) + f(x, t)$. Flow matching sadece doğrudan $v$ için eğitilir, DDPM'i rahatsız eden $\\sqrt{1 - \\bar{\\alpha}_t}$'ye bölmeleri atlar.</div></div>
<div class="calc-card"><div class="card-title">Rectified flow (Liu 2022)</div><div class="card-body">Akışı mevcut akış tarafından üretilen çiftler $(x_0, x_1)$ üzerinde yinelemeli olarak yeniden eğitir, giderek daha düz yörüngeler üretir. 2-3 turdan sonra 1-4 ODE adımı kadar az adımla örnekleme yapılabilir. Stable Diffusion 3'te kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Skora bağlantı</div><div class="card-body">Optimal-taşıma olasılık yolu ile flow matching, karşılık gelen skor modelinin olasılık-akış ODE'siyle aynı marjinal dağılımları geri elde eder. Aynı üretici güç, daha basit matematik.</div></div>
<div class="calc-card"><div class="card-title">Üretim durumu</div><div class="card-body">Stable Diffusion 3 (Esser ve diğ. 2024) ve Meta'nın Movie Gen (2024) ikisi de rectified flow kullanır. Flux.1 (Black Forest Labs, 2024) flow-matched'tir. Skor çağı sınırda akış çağıyla değiştiriliyor.</div></div>
</div>

<div id="plot-l6-flow-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var Nx=22;var Ny=22;var xs=[];var ys=[];var us=[];var vs=[];
for(var i=0;i<Nx;i++){for(var j=0;j<Ny;j++){
var x=-3+6*i/(Nx-1);var y=-3+6*j/(Ny-1);
var mx=1.0;var my=0.5;
var vx=(mx-x)*0.18;var vy=(my-y)*0.18;
xs.push(x);ys.push(y);us.push(vx);vs.push(vy);}}
var segX=[];var segY=[];for(var k=0;k<xs.length;k++){segX.push(xs[k]);segX.push(xs[k]+us[k]);segX.push(null);segY.push(ys[k]);segY.push(ys[k]+vs[k]);segY.push(null);}
var d1={x:segX,y:segY,mode:'lines',name:'hız alanı v_t(x)',line:{color:'#3b82f6',width:1.5}};
function box(){var u=Math.random();var v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var trajs=[];var colors=['#f59e0b','#10b981','#ef4444','#a78bfa','#22d3ee'];
for(var k=0;k<5;k++){var px=2.5*box();var py=2.5*box();var tx=[px];var ty=[py];
for(var step=0;step<14;step++){var dxv=(1.0-px)*0.12;var dyv=(0.5-py)*0.12;px+=dxv;py+=dyv;tx.push(px);ty.push(py);}
trajs.push({x:tx,y:ty,mode:'lines+markers',name:'örnek '+(k+1),line:{color:colors[k],width:1.6},marker:{size:4,color:colors[k]}});}
var target={x:[1.0],y:[0.5],mode:'markers',name:'veri',marker:{size:13,color:'#fef3c7',symbol:'star',line:{width:1,color:'#f59e0b'}}};
var data=[d1].concat(trajs).concat([target]);
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x1',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-3.3,3.3]},yaxis:{title:'x2',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-3.3,3.3],scaleanchor:'x'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l6-flow-tr',data,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> Gauss gürültü örneklerini $(1.0, 0.5)$'teki tek bir veri noktasına taşıyan oyuncak bir flow-matching hız alanı $v_t(x) = 0.18\\,(x_{\\text{hedef}} - x)$. Mavi oklar alanı gösterir, renkli yörüngeler her biri rastgele bir gürültü konumundan başlayan ve Euler integrasyonu yoluyla alanı takip eden beş örnek yolu gösterir. Her yol doğrudan hedefe yönelir. Skor tabanlı ters SDE'nin aksine, örnekleme zamanında rastgele gürültü eklenmez &mdash; deterministik ODE tek başına yeterlidir.</div></div>

<h2 class="lesson-title">12. Euler-Maruyama Yöntemi (Sayısal SDE)</h2>

<p class="l-text">Bir SDE için nadiren analitik çözümlere sahibiz; simüle ederiz. En basit yöntem, Gisiro Maruyama (1955) tarafından geliştirilen, açık Euler'in stokastik analoğudur.</p>

<div class="calc-formula"><div class="formula-label">EULER-MARUYAMA ŞEMASI</div><div class="formula-main">$$X_{n+1} \\;=\\; X_n + f(X_n, t_n)\\, h + g(X_n, t_n)\\, \\sqrt{h}\\, Z_n, \\qquad Z_n \\sim \\mathcal{N}(0, 1)\\,\\text{i.i.d.}$$</div><div class="formula-sub">Zaman adımı $h$, her adımda taze standart-normal örnek $Z_n$, artım $\\sqrt{h}\\, Z_n$ standart sapması $\\sqrt{h}$ olan $\\Delta W_n$'i yaklaştırır. Gürültü teriminin $\\sqrt{h}$ ölçeklendirmesine dikkat et &mdash; en küçük terim olmasına rağmen onu $h$'ye düşüremezsiniz.</div></div>

<p class="l-text">Euler-Maruyama <strong>güçlü mertebe $1/2$</strong> ile yakınsar (beklenen yol bazlı hata $\\sqrt{h}$ olarak ölçeklenir) ve <strong>zayıf mertebe $1$</strong> ile (pürüzsüz fonksiyonellerin beklentilerindeki hatalar $h$ olarak ölçeklenir). Adım boyutunu yarıya indirmek yol bazlı hatayı sadece $\\sqrt{2}$ faktörü kadar azaltır, ama ortalamalar ve varyanslar gibi dağılım nicelikleri $h$ ile doğrusal olarak iyileşir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Güçlü vs zayıf yakınsama</div><div class="card-body">Güçlü: $\\mathbb{E}\\bigl[\\sup_t |X_h(t) - X(t)|\\bigr] = O(h^{1/2})$. Zayıf: $|\\mathbb{E}[\\varphi(X_h(T))] - \\mathbb{E}[\\varphi(X(T))]| = O(h)$. Üretici modelleri örneklemek için yalnızca zayıf mertebe önemlidir.</div></div>
<div class="calc-card"><div class="card-title">Milstein şeması</div><div class="card-body">$X_{n+1} = X_n + f h + g\\sqrt{h}\\, Z_n + \\tfrac{1}{2} g\\, g'\\, h\\, (Z_n^2 - 1)$. Güçlü mertebe 1'e ulaşmak için bir Itō-düzeltme terimi ekler. $g$ $X$'e güçlü şekilde bağlıysa yardımcı olur.</div></div>
<div class="calc-card"><div class="card-title">Stokastik Runge-Kutta</div><div class="card-body">Daha yüksek dereceli şemalar vardır ama dikkatlice seçilmiş "Levy alanı" yaklaştırmaları gerektirir, hesaplama açısından maliyetli. Rosenbrock, Heun-Karras ve DPM-Solver Difüzyon örnekleyicilerinde kullanılan pratik daha yüksek dereceli yöntemlerdir.</div></div>
<div class="calc-card"><div class="card-title">Euler-Maruyama olarak DDPM</div><div class="card-body">DDPM'in atasal örnekleyicisi $x_{t-1} = \\mu_\\theta(x_t, t) + \\sigma_t z$ tam olarak ters VP-SDE'ye uygulanan Euler-Maruyama'dır. EDM'in Heun örnekleyicisi bir stokastik Heun yöntemidir. SDE'yi bilmek örnekleyiciyi bilmektir.</div></div>
</div>

<div class="l-note"><strong>DDIM neden deterministik örnekler.</strong> Song-Meng-Ermon (2021) DDIM güncellemesi stokastik tekme terimini sıfıra ayarlar ve ters SDE'yi olasılık-akış ODE'sine dönüştürür. Deterministik dinamiklerle 1000 yerine 50 adım kullanabilir ve karşılaştırılabilir örnek kalitesi elde edebilirsiniz. Bedel: daha az çeşitlilik, çünkü gürültü başlatmasındaki iki farklı rastgele tohum aynı veri modunda inebilir.</div>

<h2 class="lesson-title">13. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Grafiklerde neye bakmalı.</strong> İlk panel $\\pm 2\\sqrt{t}$ bandı içinde on Brownian yol gösterir ve $\\sqrt{t}$ kuralını görsel olarak doğrular. İkinci panel beş GBM yolunu ve analitik ortalamayı çizer &mdash; bazı yolların hiçbiri çökmemiş olsa bile ortalamanın oldukça altında kaldığına dikkat et, Itō düzeltmesi iş başında. Üçüncü panel ödüldür: mavi histogram orijinal iki modlu veridir, turuncu histogram aynı verinin $T = 1$ birim ileri gürültüleştirmeden sonraki hâlidir (esasen $\\mathcal{N}(0, 1)$) ve yeşil histogram analitik karışım skorunu kullanarak Anderson'un ters SDE'sini geriye çalıştırarak üretilen örneklerdir &mdash; orijinal iki modlu yoğunluğu çok yakından yeniden üretir. Gerçek bir Difüzyon modeli sadece kapalı-form skorumuzu öğrenilmiş bir sinir ağıyla değiştirir, ama simülasyon döngüsü aynı koddur.</p>

<div class="think-box"><div class="think-label">DENENECEK DENEYLER</div><div class="think-body">İki modlu karışımı dört modlu bir karışımla değiştir ve ters sürecin hâlâ tüm modları geri elde edip etmediğini gör; çok küçük bir $N3$ (10 ters adım) dene ve DPM-Solver ve Heun örnekleyicilerini motive eden hız/kalite ödünüşünü hisset; ters adımı olasılık-akış ODE'sine (difüzyon terimini at) değiştir ve örneklerin modlar üzerinde daha sıkı yoğunlaştığını gözlemle; panel 1'deki Brownian hareketini korelasyonlu bir gürültü ile (pürüzlü Brownian) değiştir ve $\\sqrt{t}$ zarfının kırıldığını izle.</div></div>

<div class="calc-highlight"><strong>Şimdi yapabileceklerin.</strong> Bir SDE'yi okuyabilir, değişken değiştirmek için Itō lemmasını uygulayabilir, eşleşen Fokker-Planck PDE'sini yazabilir, herhangi bir skor tabanlı ya da akış tabanlı modelde skor fonksiyonunu tanımlayabilir ve bir Difüzyon modeli makalesinin her satırını altta yatan stokastik kalkülüse bağlayabilirsin. Sonraki ders sayısal SDE çözücüleri üzerindeki vidaları sıkar; ondan sonra PINN ve Neural ODEs gibi sinir PDE çözücülerine kapıyı açarız, burada öğrendiğin her şeyi analitik çözümlerden tamamen öğrenilebilir olanlara uzatırlar.</div>
`
};
