window.MARKOV_L3 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>If you have ever called <code>pm.sample()</code> in PyMC or <code>stan.sampling()</code> in Stan and watched a progress bar slowly fill, you have used MCMC.</strong> What that progress bar hides is one of the most beautiful ideas in computational statistics: when you cannot evaluate a probability distribution, when you cannot integrate against it, when you cannot even normalise it — you can still <em>sample</em> from it by carefully designed random walks whose long-run behaviour is mathematically guaranteed to converge to the distribution you wanted. This lesson opens that black box.</p>

<p class="l-text">We start from the much simpler problem of <em>vanilla Monte Carlo integration</em>, climb through importance and rejection sampling, and then make the conceptual jump that defines modern Bayesian inference: instead of trying to draw independent samples from an intractable distribution, we build a Markov chain whose stationary distribution <em>is</em> the target. By the end you will have implemented Metropolis-Hastings from scratch, watched a chain explore a banana-shaped posterior, diagnosed its convergence with autocorrelation plots, and understood how the same machinery powers Bayesian neural networks, RLHF reward models, and the topic models that dominated NLP before Transformers.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State why Bayesian posterior inference reduces to computing expectations <em>E<sub>p</sub>[f(X)]</em> and why direct integration usually fails in more than a handful of dimensions</li>
<li>Derive the <em>O(1/√N)</em> error rate of Monte Carlo estimators and explain why this is independent of dimension — the single most surprising fact in the entire subject</li>
<li>Apply importance sampling and rejection sampling, and recognise the two failure modes (high variance, near-zero accept rate) that motivate MCMC</li>
<li>Write down the detailed balance condition and prove that Metropolis-Hastings satisfies it for any positive proposal density</li>
<li>Implement Metropolis-Hastings and Gibbs sampling in NumPy, then diagnose convergence with trace plots, autocorrelation, and R-hat</li>
<li>Connect the algorithm to its modern AI uses: Bayesian neural networks, RLHF reward modeling, LDA topic models, and posterior sampling in latent variable models</li>
</ul>
</div>

<h2 class="lesson-title">1. The Problem: Computing E<sub>p(x)</sub>[f(x)]</h2>

<div class="calc-highlight"><strong>Almost every quantity a Bayesian wants to compute is an expectation.</strong> Posterior mean of a parameter, posterior predictive of a new observation, model evidence, decision-theoretic loss — they are all integrals of some <em>f(x)</em> weighted by a posterior <em>p(x | data)</em>. The problem is that the posterior is almost never something you can integrate by hand.</p>

<p class="l-text">Bayes' rule writes the posterior up to a constant:</p>

<div class="calc-formula"><div class="formula-label">THE POSTERIOR</div><div class="formula-main">$$p(\\theta \\mid \\mathcal{D}) \\;=\\; \\frac{p(\\mathcal{D} \\mid \\theta) \\, p(\\theta)}{\\int p(\\mathcal{D} \\mid \\theta) \\, p(\\theta) \\, d\\theta} \\;=\\; \\frac{1}{Z} \\, \\tilde{p}(\\theta)$$</div><div class="formula-sub">The unnormalised posterior <em>p̃(θ) = p(D|θ)·p(θ)</em> is easy to evaluate point-by-point. The normalising constant <em>Z</em> is a high-dimensional integral that is almost never tractable.</div></div>

<p class="l-text">Concretely, suppose you want the posterior mean of a 50-dimensional neural-network weight vector. The integral</p>

<div class="calc-formula"><div class="formula-label">POSTERIOR EXPECTATION</div><div class="formula-main">$$\\mathbb{E}_{p(\\theta \\mid \\mathcal{D})}[f(\\theta)] \\;=\\; \\int f(\\theta) \\, p(\\theta \\mid \\mathcal{D}) \\, d\\theta$$</div><div class="formula-sub">A 50-dimensional integral. Any numerical quadrature with 10 grid points per axis would need <em>10<sup>50</sup></em> evaluations. There are about 10<sup>80</sup> atoms in the observable universe.</div></div>

<p class="l-text"><strong>Why deterministic quadrature dies in high dimensions.</strong> A grid with <em>k</em> points per axis in <em>d</em> dimensions has <em>k<sup>d</sup></em> nodes. Even a coarse <em>k = 10</em> becomes astronomically expensive past <em>d ≈ 15</em>. This is the famous <em>curse of dimensionality</em>, and it is the wall that every Bayesian computation slams into.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">What we want</div><div class="card-body">An estimator of <em>E<sub>p</sub>[f(X)]</em> whose accuracy does not blow up with dimension.</div><div class="card-formula">Ê → E[f(X)]</div></div>
<div class="calc-card"><div class="card-title">What we have</div><div class="card-body">Often just <em>p̃(x)</em> — the posterior up to a normalising constant. Sometimes only the <em>ratio</em> <em>p̃(x)/p̃(y)</em>.</div><div class="card-formula">p(x) = p̃(x)/Z</div></div>
<div class="calc-card"><div class="card-title">The trick</div><div class="card-body">Sampling. Replace the integral by an empirical average over draws from <em>p</em>. The next sections are five ways to get those draws.</div><div class="card-formula">(1/N)Σf(xᵢ)</div></div>
</div>

<h2 class="lesson-title">2. Vanilla Monte Carlo</h2>

<div class="calc-highlight"><strong>The simplest idea works.</strong> If you can produce independent samples <em>x<sub>1</sub>, …, x<sub>N</sub> ~ p(x)</em>, then by the Law of Large Numbers the empirical average converges to the true expectation.</div>

<div class="calc-formula"><div class="formula-label">MONTE CARLO ESTIMATOR</div><div class="formula-main">$$\\widehat{\\mu}_N \\;=\\; \\frac{1}{N} \\sum_{i=1}^{N} f(x_i) \\;\\xrightarrow[N \\to \\infty]{a.s.}\\; \\mathbb{E}_{p(x)}[f(X)]$$</div><div class="formula-sub">By the Strong Law of Large Numbers, the sample mean converges almost surely to the true expectation, no matter what <em>f</em> looks like.</div></div>

<p class="l-text">The Central Limit Theorem sharpens this into an error bound:</p>

<div class="calc-formula"><div class="formula-label">MONTE CARLO ERROR RATE</div><div class="formula-main">$$\\sqrt{N} \\, \\big( \\widehat{\\mu}_N - \\mu \\big) \\;\\xrightarrow{d}\\; \\mathcal{N}\\!\\big(0, \\sigma_f^2\\big), \\qquad \\sigma_f^2 = \\mathrm{Var}_{p}[f(X)]$$</div><div class="formula-sub">The estimator's standard error shrinks like <em>σ<sub>f</sub> / √N</em>. To halve the error, quadruple the samples.</div></div>

<p class="l-text"><strong>The miracle: this rate is independent of dimension <em>d</em>.</strong> Whether you are integrating over the real line or over a 10,000-dimensional weight space, ten thousand samples buy you the same statistical accuracy. The constant <em>σ<sub>f</sub></em> depends on the problem, but the <em>1/√N</em> shape does not. This single fact is why Monte Carlo eventually beats grid methods in any moderately-dimensional setting.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ESTIMATING π</div><div class="example-body">The unit disk has area π and sits inside the square [−1, 1]<sup>2</sup> of area 4. The probability that a uniformly random point lands in the disk is therefore π/4. Sample <em>N</em> points, count how many fall inside, multiply by 4, and you have an estimate of π.<br><br>With <em>N = 1000</em> the standard error is roughly 0.05 — enough to nail π to one decimal. With <em>N = 1,000,000</em> the error shrinks to ~0.0017. The convergence is slow but completely reliable.</div></div>

<div class="calc-graph"><div id="plot-l3-pi-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> 2000 uniformly random points in <em>[−1, 1]<sup>2</sup></em>, coloured by whether they fell inside the unit disk (blue) or outside (orange). The fraction inside times 4 estimates π. The estimate fluctuates around the true value with the predicted <em>1/√N</em> scale — this is Monte Carlo integration in its purest form.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xi=[],yi=[],xo=[],yo=[];var seed=42;
function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
for(var i=0;i<2000;i++){var x=2*rng()-1,y=2*rng()-1;if(x*x+y*y<=1){xi.push(x);yi.push(y);}else{xo.push(x);yo.push(y);}}
var theta=[],cx=[],cy=[];for(var k=0;k<=200;k++){var t=2*Math.PI*k/200;theta.push(t);cx.push(Math.cos(t));cy.push(Math.sin(t));}
var d1={x:xi,y:yi,mode:'markers',name:'inside disk',marker:{color:'#3b82f6',size:4,opacity:0.7}};
var d2={x:xo,y:yo,mode:'markers',name:'outside',marker:{color:'#f59e0b',size:4,opacity:0.7}};
var d3={x:cx,y:cy,mode:'lines',name:'unit circle',line:{color:'#ffffff',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.05,1.05],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.05,1.05]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-pi-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l3-pierr-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Convergence diagnostic:</strong> log-log plot of <em>|π̂<sub>N</sub> − π|</em> versus <em>N</em>. The empirical error (blue) hugs the dashed reference line of slope <em>−1/2</em> — exactly the <em>1/√N</em> Monte Carlo rate. Notice the noise: a single chain bounces around the trend, but the trend itself is iron-clad.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=7;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
var Ns=[],errs=[];var inside=0;var checkpoints=[];
for(var i=1;i<=20000;i++){var x=2*rng()-1,y=2*rng()-1;if(x*x+y*y<=1)inside++;if(i===10||i===30||i===100||i===300||i===1000||i===3000||i===10000||i===20000){Ns.push(i);errs.push(Math.abs(4*inside/i-Math.PI));}}
var ref=Ns.map(function(n){return 1.5/Math.sqrt(n);});
var d1={x:Ns,y:errs,mode:'lines+markers',name:'|π̂−π|',line:{color:'#3b82f6',width:2.2},marker:{size:7}};
var d2={x:Ns,y:ref,mode:'lines',name:'∝ 1/√N',line:{color:'#9ca3af',width:1.8,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'N (log)',type:'log',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'absolute error (log)',type:'log',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-pierr-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The catch:</strong> vanilla Monte Carlo assumes you can draw exact i.i.d. samples from <em>p</em>. For a uniform distribution on a square, easy. For a 50-dimensional posterior with non-trivial correlations, hopeless. The next three sections climb out of this hole.</div>

<h2 class="lesson-title">3. Importance Sampling</h2>

<div class="calc-highlight"><strong>Sample from somewhere easy, reweight to fix the bias.</strong> If <em>p</em> is hard to sample from but some <em>q</em> is easy, draw from <em>q</em> and weight each draw by the likelihood ratio <em>p(x) / q(x)</em>. The weighted average is unbiased for <em>E<sub>p</sub>[f(X)]</em>.</div>

<div class="calc-formula"><div class="formula-label">IMPORTANCE-SAMPLING IDENTITY</div><div class="formula-main">$$\\mathbb{E}_{p}[f(X)] \\;=\\; \\int f(x) \\, p(x) \\, dx \\;=\\; \\int f(x) \\, \\frac{p(x)}{q(x)} \\, q(x) \\, dx \\;=\\; \\mathbb{E}_{q}\\!\\left[ f(X) \\, \\frac{p(X)}{q(X)} \\right]$$</div><div class="formula-sub">Multiply and divide by <em>q(x)</em>. The integral now looks like an expectation under <em>q</em>, with weights <em>w(x) = p(x)/q(x)</em>.</div></div>

<p class="l-text">The Monte Carlo estimator becomes:</p>

<div class="calc-formula"><div class="formula-label">IMPORTANCE-SAMPLING ESTIMATOR</div><div class="formula-main">$$\\widehat{\\mu}^{\\,IS}_N \\;=\\; \\frac{1}{N} \\sum_{i=1}^{N} f(x_i) \\, \\frac{p(x_i)}{q(x_i)}, \\qquad x_i \\sim q(x)$$</div><div class="formula-sub">Only requirement: <em>q</em> has full support over the support of <em>p</em> (otherwise some <em>p</em>-region gets weight zero forever).</div></div>

<p class="l-text"><strong>Variance is everything.</strong> The estimator is unbiased for any valid <em>q</em>, but its variance can be terrifying:</p>

<div class="calc-formula"><div class="formula-label">VARIANCE OF THE IS ESTIMATOR</div><div class="formula-main">$$\\mathrm{Var}_q\\!\\left[ f(X) \\, \\frac{p(X)}{q(X)} \\right] \\;=\\; \\mathbb{E}_q\\!\\left[ f(X)^2 \\, \\frac{p(X)^2}{q(X)^2} \\right] \\;-\\; \\mu^2$$</div><div class="formula-sub">If <em>q(x)</em> is small where <em>p(x)·|f(x)|</em> is large, the weights explode and the estimator is dominated by a handful of giant draws. The effective sample size collapses.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Good proposal</div><div class="card-body"><em>q</em> matches the shape of <em>|f|·p</em>. Weights stay near 1. Variance ~ vanilla Monte Carlo.</div><div class="card-formula">q ∝ |f|·p</div></div>
<div class="calc-card"><div class="card-title">Bad proposal</div><div class="card-body"><em>q</em> is far from <em>p</em> in the tails. A few samples get astronomical weights; the rest are wasted. Effective <em>N</em> can be 5 even with <em>N = 10<sup>6</sup></em>.</div><div class="card-formula">w(x) ≫ 1</div></div>
<div class="calc-card"><div class="card-title">Self-normalised IS</div><div class="card-body">If you only know <em>p̃ = Z·p</em>, divide by <em>Σ w(x<sub>i</sub>)</em> to cancel <em>Z</em>. Biased but consistent, and works without knowing the normaliser.</div><div class="card-formula">Σf·w / Σw</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-is-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the target distribution <em>p(x)</em> is a narrow Gaussian centred at +2 (blue), while the proposal <em>q(x)</em> is a wider Gaussian centred at 0 (orange). Marker size at each sample reflects the importance weight <em>p(x)/q(x)</em>; large markers near +2 carry most of the estimator's information, while the wasted samples in the left tail contribute almost nothing. This is what "poor effective sample size" looks like.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function npdf(x,m,s){return Math.exp(-0.5*Math.pow((x-m)/s,2))/(s*Math.sqrt(2*Math.PI));}
var xs=[],pys=[],qys=[];
for(var i=0;i<=300;i++){var x=-4+8*i/300;xs.push(x);pys.push(npdf(x,2,0.6));qys.push(npdf(x,0,1.6));}
var seed=11;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=rng(),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var sx=[],sy=[],sw=[];
for(var k=0;k<60;k++){var x=1.6*randn();sx.push(x);sy.push(0);sw.push(8+50*npdf(x,2,0.6)/npdf(x,0,1.6));}
var d1={x:xs,y:pys,mode:'lines',name:'target p(x)',line:{color:'#3b82f6',width:2.4}};
var d2={x:xs,y:qys,mode:'lines',name:'proposal q(x)',line:{color:'#f59e0b',width:2.4,dash:'dash'}};
var d3={x:sx,y:sy,mode:'markers',name:'weighted draws',marker:{color:'#10b981',size:sw,opacity:0.55,line:{color:'#0a0a0a',width:0.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'density',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-is-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Rejection Sampling</h2>

<div class="calc-highlight"><strong>If you can envelope the target, you can sample from it exactly.</strong> Find a function <em>q</em> from which you can sample and a constant <em>M</em> with <em>p(x) ≤ M·q(x)</em> for all <em>x</em>. Then sampling <em>y ~ q</em> and accepting with probability <em>p(y) / (M·q(y))</em> produces an exact draw from <em>p</em>.</div>

<div class="calc-formula"><div class="formula-label">REJECTION SAMPLING — ACCEPTANCE PROBABILITY</div><div class="formula-main">$$\\Pr\\!\\big[\\text{accept } y\\big] \\;=\\; \\frac{p(y)}{M \\, q(y)} \\;\\in\\; [0, 1]$$</div><div class="formula-sub">Draw <em>y ~ q</em>, draw <em>u ~ U(0, 1)</em>, accept <em>y</em> if <em>u ≤ p(y) / (M·q(y))</em>. Conditional on acceptance, <em>y</em> has distribution exactly <em>p</em>.</div></div>

<p class="l-text"><strong>Proof sketch.</strong> The joint density of accepted samples is proportional to <em>q(y) · (p(y) / (M·q(y))) = p(y) / M</em>. Renormalising over the acceptance event recovers <em>p</em>. Clean and exact.</p>

<div class="calc-formula"><div class="formula-label">EXPECTED ACCEPTANCE RATE</div><div class="formula-main">$$\\Pr[\\text{accept}] \\;=\\; \\int \\frac{p(y)}{M \\, q(y)} q(y) \\, dy \\;=\\; \\frac{1}{M}$$</div><div class="formula-sub">Tight envelopes (M near 1) accept almost everything. Loose envelopes (M ≫ 1) waste samples.</div></div>

<p class="l-text"><strong>Where rejection sampling collapses.</strong> In <em>d</em> dimensions, even a slightly loose envelope is catastrophic. If <em>p</em> is a unit Gaussian and <em>q</em> is a Gaussian with standard deviation <em>1 + ε</em>, the constant <em>M</em> scales like <em>(1 + ε)<sup>d</sup></em>. The acceptance rate decays geometrically with dimension. By <em>d = 50</em> you accept one sample in millions.</p>

<div class="calc-graph"><div id="plot-l3-rej-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the target <em>p(x)</em> (blue solid) is bounded above by <em>M·q(x)</em> with envelope <em>q</em> (grey dashed). The shaded area below <em>p</em> is the "accept" region — samples landing here are kept. The strip between <em>p</em> and <em>M·q</em> is the "reject" region — wasted draws. Tightening the envelope shrinks the rejection strip and the accept rate climbs toward 1.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function npdf(x,m,s){return Math.exp(-0.5*Math.pow((x-m)/s,2))/(s*Math.sqrt(2*Math.PI));}
var xs=[],pys=[],qys=[];var M=2.2;
for(var i=0;i<=300;i++){var x=-4+8*i/300;xs.push(x);pys.push(npdf(x,0.5,0.7));qys.push(M*npdf(x,0,1.6));}
var d1={x:xs,y:pys,mode:'lines',name:'target p(x)',line:{color:'#3b82f6',width:2.6},fill:'tozeroy',fillcolor:'rgba(59,130,246,0.18)'};
var d2={x:xs,y:qys,mode:'lines',name:'envelope M·q(x)',line:{color:'#9ca3af',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'density',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:0.5,y:0.45,text:'accept (under p)',showarrow:false,font:{color:'#93c5fd',size:13}},{x:-2.4,y:0.45,text:'reject (between p and M·q)',showarrow:false,font:{color:'#9ca3af',size:12}}]};
Plotly.newPlot('plot-l3-rej-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-warn"><strong>Both methods break in high dimensions.</strong> Importance sampling collapses when the proposal misses the mode (exponentially likely as <em>d</em> grows). Rejection sampling collapses when the envelope is loose (also exponentially likely). For modern Bayesian models with hundreds to millions of parameters, neither one is viable. Enter MCMC.</div>

<h2 class="lesson-title">5. Why MCMC?</h2>

<div class="calc-highlight"><strong>Trade independence for tractability.</strong> Instead of trying to draw i.i.d. samples from <em>p</em>, build a Markov chain whose stationary distribution <em>is</em> <em>p</em>. Run the chain long enough, and its empirical distribution converges to <em>p</em> — even though consecutive samples are correlated. The miracle is that this construction needs only the ability to evaluate <em>p̃(x)</em> at given points, and only up to a multiplicative constant.</div>

<p class="l-text">Recall from L1: a Markov chain on a state space <em>X</em> is specified by a transition kernel <em>P(x → y)</em>. A distribution <em>π</em> is stationary if applying the kernel leaves it unchanged:</p>

<div class="calc-formula"><div class="formula-label">STATIONARITY</div><div class="formula-main">$$\\pi(y) \\;=\\; \\int \\pi(x) \\, P(x \\to y) \\, dx \\qquad \\text{for all } y$$</div><div class="formula-sub">Once the chain reaches <em>π</em>, future states stay distributed as <em>π</em>. The fixed point of the transition operator.</div></div>

<p class="l-text"><strong>The MCMC question, reversed.</strong> Classical Markov-chain theory starts from a kernel <em>P</em> and asks for the stationary distribution. MCMC starts from the desired stationary distribution <em>π = p</em> and engineers a kernel that satisfies it. Once we have such a kernel, simulating the chain produces samples whose long-run distribution is <em>p</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Need only ratios</div><div class="card-body">Metropolis-Hastings uses <em>p(y)/p(x)</em>. The unknown <em>Z</em> cancels: <em>p̃(y)/p̃(x) = p(y)/p(x)</em>. You never need to evaluate the normaliser.</div><div class="card-formula">Z cancels in α</div></div>
<div class="calc-card"><div class="card-title">Scales to high d</div><div class="card-body">Per step cost is one or a few evaluations of <em>p̃</em>. No exponential blow-up in <em>d</em>. Sample size to achieve given accuracy scales polynomially (often roughly linearly) with dimension.</div><div class="card-formula">cost ∝ poly(d)</div></div>
<div class="calc-card"><div class="card-title">Price paid</div><div class="card-body">Samples are correlated, not independent. Effective sample size is smaller than the chain length. Convergence diagnostics become essential.</div><div class="card-formula">ESS &lt; N</div></div>
</div>

<h2 class="lesson-title">6. Detailed Balance &amp; Ergodicity</h2>

<div class="calc-highlight"><strong>Detailed balance is a sufficient condition for stationarity.</strong> If for every pair of states <em>x, y</em> the chain is as likely to transition from <em>x</em> to <em>y</em> while in equilibrium as it is to go the other way, then <em>π</em> is stationary.</div>

<div class="calc-formula"><div class="formula-label">DETAILED BALANCE (REVERSIBILITY)</div><div class="formula-main">$$\\pi(x) \\, P(x \\to y) \\;=\\; \\pi(y) \\, P(y \\to x) \\qquad \\text{for all } x, y$$</div><div class="formula-sub">Read both sides as a probability flow: under <em>π</em>, the flow <em>x → y</em> exactly cancels the flow <em>y → x</em>. The chain "looks the same" run forward and backward.</div></div>

<p class="l-text"><strong>Detailed balance implies stationarity.</strong> Integrate both sides over <em>x</em>:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Start from detailed balance</div><div class="step-detail">π(x) P(x → y) = π(y) P(y → x), valid for every pair.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Integrate over <em>x</em></div><div class="step-detail">∫ π(x) P(x → y) dx = ∫ π(y) P(y → x) dx = π(y) ∫ P(y → x) dx = π(y) · 1 = π(y).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Recognise the stationarity equation</div><div class="step-detail">The left side is exactly the transition operator applied to π. We just showed it equals π(y), so π is stationary. □</div></div></div>
</div>

<p class="l-text"><strong>Ergodicity adds uniqueness and convergence.</strong> Stationarity is not enough by itself — a chain could have multiple stationary distributions, or oscillate without converging. We need:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Irreducibility</div><div class="card-body">From any starting state, the chain has positive probability of eventually reaching any region of positive <em>π</em>-mass.</div><div class="card-formula">∀x, y: ∃k, P<sup>k</sup>(x,y) &gt; 0</div></div>
<div class="calc-card"><div class="card-title">Aperiodicity</div><div class="card-body">Return times to any state are not all multiples of some period > 1. Continuous random-walk proposals make this automatic.</div><div class="card-formula">gcd{k: P<sup>k</sup>(x,x)&gt;0} = 1</div></div>
<div class="calc-card"><div class="card-title">Conclusion</div><div class="card-body">Irreducible + aperiodic chain with stationary <em>π</em> ⇒ <em>π</em> is unique and <em>P<sup>n</sup>(x, ·) → π</em> in total variation for every starting <em>x</em>.</div><div class="card-formula">P<sup>n</sup> → π</div></div>
</div>

<div class="l-note"><strong>Practical takeaway:</strong> if your proposal density has full support and the proposal probability is continuous, the resulting Metropolis-Hastings chain is automatically irreducible and aperiodic. The hard work is verifying detailed balance — and the algorithm is constructed precisely so that it does.</div>

<h2 class="lesson-title">7. The Metropolis-Hastings Algorithm</h2>

<div class="calc-highlight"><strong>The most-used algorithm in computational Bayesian inference.</strong> Metropolis-Hastings constructs a transition kernel that satisfies detailed balance for any target <em>π</em>, using only the ability to evaluate <em>π</em> up to a constant.</div>

<p class="l-text">The algorithm has two ingredients: a <em>proposal density</em> <em>q(y | x)</em> from which you can sample, and the <em>acceptance probability</em></p>

<div class="calc-formula"><div class="formula-label">METROPOLIS-HASTINGS ACCEPTANCE</div><div class="formula-main">$$\\alpha(x, y) \\;=\\; \\min\\!\\left\\{ 1, \\; \\frac{\\pi(y) \\, q(x \\mid y)}{\\pi(x) \\, q(y \\mid x)} \\right\\}$$</div><div class="formula-sub">If the proposal moves you toward higher <em>π</em> (after correcting for proposal asymmetry), accept. If it moves you toward lower <em>π</em>, accept with shrinking probability. The min(1, ·) caps the rate.</div></div>

<div class="calc-formula"><div class="formula-label">M-H AS PSEUDOCODE</div><div class="formula-main">$$\\begin{aligned} & \\text{1. Propose } y \\sim q(y \\mid x_t). \\\\ & \\text{2. Compute } \\alpha = \\min\\{1, [\\pi(y) q(x_t|y)] / [\\pi(x_t) q(y|x_t)]\\}. \\\\ & \\text{3. Draw } u \\sim U(0,1). \\\\ & \\text{4. Set } x_{t+1} = y \\text{ if } u \\le \\alpha, \\text{ else } x_{t+1} = x_t. \\end{aligned}$$</div><div class="formula-sub">If rejected, stay where you are — that is not a bug, that is what makes the math work.</div></div>

<p class="l-text"><strong>Why detailed balance holds.</strong> Write the transition kernel piece by piece:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Effective transition density for <em>y ≠ x</em></div><div class="step-detail">P(x → y) = q(y | x) · α(x, y). (Propose y, then accept it.)</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Compute the flow <em>π(x)·P(x → y)</em></div><div class="step-detail">π(x) · q(y|x) · α(x,y) = π(x) · q(y|x) · min{1, [π(y)·q(x|y)] / [π(x)·q(y|x)]}.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Use the identity <em>a · min(1, b/a) = min(a, b)</em></div><div class="step-detail">π(x) · q(y|x) · α(x,y) = min{π(x)·q(y|x), π(y)·q(x|y)}.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">This expression is symmetric in <em>x, y</em></div><div class="step-detail">By the same calculation with x and y swapped, π(y)·P(y → x) = min{π(y)·q(x|y), π(x)·q(y|x)} — the very same number. Detailed balance holds. □</div></div></div>
</div>

<p class="l-text"><strong>Why we only need <em>π</em> up to a constant.</strong> The acceptance ratio contains <em>π(y) / π(x)</em>. If <em>π = p̃ / Z</em>, the unknown <em>Z</em> cancels: <em>π(y)/π(x) = p̃(y)/p̃(x)</em>. This is the single most important practical fact in Bayesian computation — the intractable normalising constant <em>Z = ∫ p̃ dθ</em> is irrelevant to the algorithm.</p>

<h2 class="lesson-title">8. Metropolis with Symmetric Proposals</h2>

<div class="calc-highlight"><strong>The original 1953 algorithm.</strong> When the proposal is symmetric — <em>q(y | x) = q(x | y)</em>, as for a Gaussian random walk centred at the current state — the <em>q</em> factors in the acceptance ratio cancel and we are left with a beautifully simple rule.</div>

<div class="calc-formula"><div class="formula-label">METROPOLIS ACCEPTANCE (SYMMETRIC PROPOSAL)</div><div class="formula-main">$$\\alpha(x, y) \\;=\\; \\min\\!\\left\\{ 1, \\; \\frac{\\pi(y)}{\\pi(x)} \\right\\}$$</div><div class="formula-sub">Always accept moves to higher density; accept downhill moves with probability equal to the density ratio. That is the entire algorithm.</div></div>

<p class="l-text"><strong>Worked example: sampling a 2D Gaussian mixture.</strong> Take a target with two Gaussian bumps,</p>

<div class="calc-formula"><div class="formula-label">TARGET MIXTURE</div><div class="formula-main">$$\\pi(x, y) \\;\\propto\\; \\tfrac{1}{2} \\, \\mathcal{N}\\!\\big( (x,y); (-1.5, 0), 0.5^2 I\\big) \\;+\\; \\tfrac{1}{2} \\, \\mathcal{N}\\!\\big( (x,y); (+1.5, 0), 0.5^2 I\\big)$$</div><div class="formula-sub">Two Gaussian modes separated by a low-density "valley". The chain needs to occasionally cross.</div></div>

<p class="l-text">Use a Gaussian random walk proposal <em>q(y|x) = N(y; x, σ<sup>2</sup> I)</em>. Tuning <em>σ</em> matters:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">σ too small</div><div class="card-body">High accept rate (~90%) but tiny steps. The chain crawls — possibly never crossing between modes. Posterior coverage is biased.</div><div class="card-formula">accept ≈ 0.9</div></div>
<div class="calc-card"><div class="card-title">σ tuned</div><div class="card-body">Accept rate around 0.234 (the famous optimal rate for high-dimensional random-walk Metropolis). Steps and accept rate balance.</div><div class="card-formula">accept ≈ 0.234</div></div>
<div class="calc-card"><div class="card-title">σ too large</div><div class="card-body">Most proposals shoot far into the low-density tails and get rejected. Accept rate ≈ 0.05. Chain stays stuck for long runs.</div><div class="card-formula">accept ≈ 0.05</div></div>
</div>

<div class="l-note"><strong>The 0.234 rule</strong>: Roberts, Gelman &amp; Gilks (1997) proved that for random-walk Metropolis on a high-dimensional product target with proposal <em>σ</em> scaled appropriately, the asymptotically optimal acceptance rate is ≈ 23.4%. Real samplers (Stan's NUTS, PyMC's adaptive Metropolis) tune their proposals at runtime to land near this number — though for HMC and NUTS the target is closer to 65%.</div>

<h2 class="lesson-title">9. Gibbs Sampling</h2>

<div class="calc-highlight"><strong>The special case where every proposal is accepted.</strong> Gibbs sampling cycles through the components of a multivariate <em>x = (x<sub>1</sub>, …, x<sub>d</sub>)</em>, replacing each component by a draw from its conditional distribution given all the others. Each such replacement is a Metropolis-Hastings step with acceptance probability identically 1.</div>

<div class="calc-formula"><div class="formula-label">GIBBS UPDATE</div><div class="formula-main">$$x_i^{(t+1)} \\;\\sim\\; p\\!\\left( x_i \\;\\big|\\; x_1^{(t+1)}, \\ldots, x_{i-1}^{(t+1)}, x_{i+1}^{(t)}, \\ldots, x_d^{(t)} \\right)$$</div><div class="formula-sub">Sweep through components in order. After one full sweep, you have a new joint sample. The conditional <em>p(x<sub>i</sub> | x<sub>−i</sub>)</em> must be easy to sample from — that is the price of admission.</div></div>

<p class="l-text"><strong>Why this works.</strong> Sampling from the exact conditional is the M-H proposal <em>q(x<sub>i</sub><sup>′</sup> | x) = p(x<sub>i</sub><sup>′</sup> | x<sub>−i</sub>)</em>. Plugging into the acceptance ratio:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Write the joint as conditional × marginal</div><div class="step-detail">π(x) = p(x<sub>i</sub> | x<sub>−i</sub>) · p(x<sub>−i</sub>). Both updated and old states share the same x<sub>−i</sub>.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Compute the M-H acceptance ratio</div><div class="step-detail">α = [π(x') · q(x | x')] / [π(x) · q(x' | x)] = [p(x'<sub>i</sub>|x<sub>−i</sub>) · p(x<sub>−i</sub>) · p(x<sub>i</sub>|x<sub>−i</sub>)] / [p(x<sub>i</sub>|x<sub>−i</sub>) · p(x<sub>−i</sub>) · p(x'<sub>i</sub>|x<sub>−i</sub>)] = 1.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Always accept</div><div class="step-detail">The acceptance ratio is identically 1, so the proposal is always accepted. Gibbs is M-H with no rejections.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When Gibbs shines</div><div class="card-body">Hierarchical Bayesian models with conjugate priors (Gaussian-Gaussian, Dirichlet-multinomial) yield closed-form conditionals. LDA, Bayesian linear regression, mixed-effects models.</div><div class="card-formula">p(xᵢ | x₋ᵢ) closed-form</div></div>
<div class="calc-card"><div class="card-title">When Gibbs struggles</div><div class="card-body">Strongly correlated variables — the coordinate-wise updates take exponentially many sweeps to traverse the joint. Diagonal-aligned proposals can't follow ridges.</div><div class="card-formula">slow mixing on ridges</div></div>
<div class="calc-card"><div class="card-title">Modern alternative</div><div class="card-body">Hamiltonian Monte Carlo (HMC) uses gradient information to propose large, joint moves that follow the geometry. Stan and PyMC default to HMC/NUTS for continuous parameters.</div><div class="card-formula">∇log π informs proposal</div></div>
</div>

<h2 class="lesson-title">10. Diagnosing Convergence</h2>

<div class="calc-highlight"><strong>MCMC samples are guaranteed to be correct only in the limit.</strong> In finite time you might be stuck in the wrong mode, or still in the transient "burn-in" phase, or mixing too slowly to have explored the posterior. Diagnostics tell you whether your chain has actually reached stationarity.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trace plots</div><div class="card-body">Plot each component <em>x<sub>t</sub><sup>(i)</sup></em> versus <em>t</em>. A converged chain looks like fuzzy caterpillar — stationary, no trend. A non-converged chain drifts or jumps between regimes.</div><div class="card-formula">x<sub>t</sub> vs t</div></div>
<div class="calc-card"><div class="card-title">Autocorrelation</div><div class="card-body"><em>ρ(k) = Corr(x<sub>t</sub>, x<sub>t+k</sub>)</em>. Decays from 1 toward 0 as lag <em>k</em> grows. Slow decay = poorly mixing chain. Sum the autocorrelations to get the integrated autocorrelation time <em>τ</em>.</div><div class="card-formula">ESS ≈ N / (1 + 2τ)</div></div>
<div class="calc-card"><div class="card-title">R-hat (Gelman-Rubin)</div><div class="card-body">Run several chains from over-dispersed starts. <em>R̂</em> compares within-chain variance to between-chain variance. <em>R̂ ≈ 1.00–1.01</em> indicates convergence; <em>R̂ &gt; 1.1</em> is alarm.</div><div class="card-formula">R̂ = √(V̂ / W)</div></div>
<div class="calc-card"><div class="card-title">Effective sample size</div><div class="card-body">ESS = N / (1 + 2Σρ(k)). The number of independent samples your chain is equivalent to. ESS &lt; 100 per parameter usually means insufficient sampling.</div><div class="card-formula">ESS ≪ N usually</div></div>
</div>

<div class="l-note"><strong>Burn-in</strong>: the early portion of the chain, before it has reached stationarity. Standard practice is to discard the first 25–50% of samples. Modern adaptive samplers (NUTS) also use this window to tune step sizes, so you must not use those samples for inference.</div>

<h2 class="lesson-title">11. AI Applications</h2>

<div class="calc-highlight"><strong>MCMC is the workhorse behind every probabilistic ML technique that needs a posterior.</strong> Below are four places where it underpins modern AI.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bayesian Neural Networks</div><div class="card-body">Instead of a point estimate <em>θ̂</em>, learn the posterior <em>p(θ | D)</em> over weights. Predictive distribution <em>p(y* | x*, D) = ∫ p(y* | x*, θ) p(θ | D) dθ</em> is computed by averaging predictions over MCMC samples. Captures epistemic uncertainty — critical for medicine, autonomous driving, scientific ML.</div><div class="card-formula">p(y* | D) = ∫ p(y* | θ) p(θ | D) dθ</div></div>
<div class="calc-card"><div class="card-title">RLHF Reward Modeling</div><div class="card-body">Human preference data is sparse and noisy. Bayesian aggregation places a posterior over reward functions, with MCMC used to compute expected reward and uncertainty bands. Anthropic and OpenAI both explore Bayesian reward modeling in their alignment research.</div><div class="card-formula">p(r | preferences)</div></div>
<div class="calc-card"><div class="card-title">LDA Topic Models</div><div class="card-body">Latent Dirichlet Allocation places a Dirichlet prior on topic distributions. The posterior over latent topic assignments is intractable, but its full conditionals are simple multinomials — perfect for collapsed Gibbs sampling. LDA dominated NLP topic modeling for a decade before Transformers.</div><div class="card-formula">z<sub>ij</sub> | rest ~ Multinomial</div></div>
<div class="calc-card"><div class="card-title">Latent variable models</div><div class="card-body">VAEs use variational approximation, but MCMC variants (e.g. MCMC-VAE, score-based sampling in diffusion models) trade speed for unbiasedness. Modern diffusion sampling can be viewed as Langevin / annealed MCMC on a learned energy.</div><div class="card-formula">x ~ p<sub>θ</sub>(x | z)</div></div>
</div>

<div class="l-note"><strong>The bridge to deep learning</strong>: Hamiltonian Monte Carlo (HMC) replaces the random-walk proposal with a proposal driven by the gradient ∇<sub>θ</sub> log π(θ). For Bayesian neural networks this is essentially gradient descent with noise — the same machinery as SGD, but giving you the full posterior rather than a point estimate. Stochastic-gradient Langevin dynamics (SGLD) and stochastic-gradient HMC bring MCMC to mini-batched deep learning.</div>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with:</strong> change <code>sigma</code> in <code>metropolis()</code> to 0.1, 0.5, 1.2, 3.0 and watch the acceptance rate and ESS shift. Too-small steps yield 95% accept but tiny ESS; too-large steps yield 5% accept and the chain hops once every twenty iterations. The sweet spot for this target is around <em>σ = 1.2</em>, near the famous 0.234 rule. Try <em>ρ = 0.99</em> in the Gibbs sampler and watch how badly the coordinate-wise updates struggle on the near-degenerate ridge — that is the failure mode that motivates Hamiltonian Monte Carlo.</p>

<div class="calc-graph"><div id="plot-l3-banana-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> 5000 Metropolis-Hastings samples on the banana-shaped target. Marker colour encodes step number (dark = early, bright = late); the chain starts at the origin and spreads to fill the curved valley. Notice how it follows the ridge — the chain is correlated, not i.i.d., but its <em>marginal</em> coverage of the support is correct. This is exactly the kind of geometry that defeats importance sampling.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=99;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=Math.max(rng(),1e-9),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function logp(x,y){return -0.5*(x*x/4 + (y - x*x/4)*(y - x*x/4));}
var x=0,y=0,lp=logp(x,y),xs=[],ys=[],ts=[],sigma=1.2;
for(var t=0;t<5000;t++){var xn=x+sigma*randn(),yn=y+sigma*randn();var lpn=logp(xn,yn);if(Math.log(rng())<lpn-lp){x=xn;y=yn;lp=lpn;}if(t%2===0){xs.push(x);ys.push(y);ts.push(t);}}
var d1={x:xs,y:ys,mode:'markers',name:'M-H samples',marker:{color:ts,colorscale:'Viridis',size:4,opacity:0.6,colorbar:{title:'step',thickness:10,len:0.8}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,7]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,12]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-banana-en',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l3-trace-en" class="plotly-graph" style="height:320px"></div><div class="graph-caption"><strong>Trace plot:</strong> the first coordinate <em>x<sub>t</sub></em> of the M-H chain plotted versus step number. After a short burn-in the trace becomes stationary (no upward or downward trend) and oscillates between the two halves of the banana valley. A "good" trace plot looks like a fuzzy caterpillar — exactly what you see here.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=99;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=Math.max(rng(),1e-9),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function logp(x,y){return -0.5*(x*x/4 + (y - x*x/4)*(y - x*x/4));}
var x=0,y=0,lp=logp(x,y),xs=[],ts=[],sigma=1.2;
for(var t=0;t<5000;t++){var xn=x+sigma*randn(),yn=y+sigma*randn();var lpn=logp(xn,yn);if(Math.log(rng())<lpn-lp){x=xn;y=yn;lp=lpn;}xs.push(x);ts.push(t);}
var d1={x:ts,y:xs,mode:'lines',name:'x_t',line:{color:'#3b82f6',width:1.1}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'step t',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'x coordinate',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-trace-en',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l3-acf-en" class="plotly-graph" style="height:320px"></div><div class="graph-caption"><strong>Autocorrelation function:</strong> ρ(k) = Corr(x<sub>t</sub>, x<sub>t+k</sub>) for lags k = 0, …, 80. Starts at 1 (perfect self-correlation), then decays. Slow decay means consecutive samples are highly redundant, so effective sample size ESS = N / (1 + 2·Σρ) is much smaller than N. Tuning σ in the proposal shifts this curve — wider proposals decay faster but with lower accept rate.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=99;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=Math.max(rng(),1e-9),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function logp(x,y){return -0.5*(x*x/4 + (y - x*x/4)*(y - x*x/4));}
var x=0,y=0,lp=logp(x,y),xs=[],sigma=1.2;
for(var t=0;t<8000;t++){var xn=x+sigma*randn(),yn=y+sigma*randn();var lpn=logp(xn,yn);if(Math.log(rng())<lpn-lp){x=xn;y=yn;lp=lpn;}if(t>=2000)xs.push(x);}
var m=xs.reduce(function(a,b){return a+b;},0)/xs.length;var c=xs.map(function(v){return v-m;});var v=c.reduce(function(a,b){return a+b*b;},0)/c.length;
var ks=[],rs=[];for(var k=0;k<=80;k++){var s=0;for(var i=0;i<c.length-k;i++)s+=c[i]*c[i+k];rs.push(s/((c.length-k)*v));ks.push(k);}
var d1={x:ks,y:rs,mode:'lines+markers',name:'ρ(k)',line:{color:'#3b82f6',width:2},marker:{size:5}};
var d2={x:[0,80],y:[0,0],mode:'lines',name:'zero',line:{color:'#9ca3af',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'lag k',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'autocorrelation ρ(k)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.2,1.05]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-acf-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">13. Summary &amp; What You Can Now Do</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">The fundamental problem</div><div class="card-body">Bayesian inference reduces to expectations under intractable posteriors. Direct integration dies in the curse of dimensionality.</div><div class="card-formula">E<sub>p</sub>[f(X)]</div></div>
<div class="calc-card"><div class="card-title">Vanilla MC</div><div class="card-body">Average over i.i.d. draws. Error <em>O(1/√N)</em>, independent of dimension. The reason Monte Carlo eventually wins.</div><div class="card-formula">err ∝ σ<sub>f</sub>/√N</div></div>
<div class="calc-card"><div class="card-title">Importance sampling</div><div class="card-body">Sample from <em>q</em>, weight by <em>p/q</em>. Variance explodes if proposal misses target. Fails in high dimensions.</div><div class="card-formula">Σf(x<sub>i</sub>)p(x<sub>i</sub>)/q(x<sub>i</sub>)/N</div></div>
<div class="calc-card"><div class="card-title">Rejection sampling</div><div class="card-body">Envelope <em>p ≤ M·q</em>, accept with prob <em>p/(M·q)</em>. Accept rate <em>1/M</em> shrinks exponentially with <em>d</em>.</div><div class="card-formula">Pr[acc] = 1/M</div></div>
<div class="calc-card"><div class="card-title">MCMC core idea</div><div class="card-body">Build chain with stationary distribution = target. Only need <em>p̃ = Z·p</em>. Cost polynomial in <em>d</em>.</div><div class="card-formula">π·P = π</div></div>
<div class="calc-card"><div class="card-title">Detailed balance</div><div class="card-body">π(x)P(x→y) = π(y)P(y→x) ⇒ π stationary. The sufficient condition Metropolis-Hastings enforces by construction.</div><div class="card-formula">flow x→y = flow y→x</div></div>
<div class="calc-card"><div class="card-title">Metropolis-Hastings</div><div class="card-body">α = min{1, [π(y)q(x|y)] / [π(x)q(y|x)]}. Normaliser cancels. Universal algorithm for sampling from <em>p̃</em>.</div><div class="card-formula">α = min{1, ratio}</div></div>
<div class="calc-card"><div class="card-title">Gibbs sampling</div><div class="card-body">Sample each component from its full conditional. M-H with α = 1. Easy when conditionals are conjugate; struggles on correlated targets.</div><div class="card-formula">x<sub>i</sub> ~ p(x<sub>i</sub> | x<sub>−i</sub>)</div></div>
<div class="calc-card"><div class="card-title">Convergence diagnostics</div><div class="card-body">Trace plots (stationary?), autocorrelation (mixing speed?), R-hat across chains (multi-modal?), ESS (effective info?). All four, always.</div><div class="card-formula">R̂ &lt; 1.01, ESS ≫ 100</div></div>
<div class="calc-card"><div class="card-title">AI uses</div><div class="card-body">Bayesian NNs, RLHF reward modeling, LDA topic models, diffusion model sampling. Everywhere a posterior matters, MCMC is hiding.</div><div class="card-formula">posterior → MCMC</div></div>
</div>

<div class="l-warn"><strong>Coming next (Lesson 4):</strong> we move from sampling-on-paper to <strong>real Bayesian computation</strong> — Hamiltonian Monte Carlo, the No-U-Turn Sampler (NUTS), and the variational alternatives (mean-field VI, normalising flows) that power Stan, PyMC, and modern Bayesian deep learning. The detailed-balance proof you saw in section 7 becomes the foundation for the entire field.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>PyMC'de <code>pm.sample()</code> ya da Stan'de <code>stan.sampling()</code> çağırıp ilerleme çubuğunu izlediysen — işte MCMC kullandın.</strong> O ilerleme çubuğunun sakladığı şey hesaplamalı istatistiğin en güzel fikirlerinden biri: bir olasılık dağılımını hesaplayamadığında, ona göre integral alamadığında, hatta onu normalize edemediğinde bile — dikkatlice tasarlanmış rastgele yürüyüşlerle ondan <em>örnek</em> çekebilirsin; bu yürüyüşlerin uzun vadedeki davranışı matematiksel olarak istediğin dağılıma yakınsamak zorundadır. Bu ders o kara kutuyu açıyor.</p>

<p class="l-text">Çok daha basit bir problemden — <em>vanilla Monte Carlo integrasyonu</em>ndan — başlıyoruz, önemli örnekleme ve red örneklemeden geçiyoruz ve sonra modern Bayes çıkarımını tanımlayan kavramsal sıçramayı yapıyoruz: işlenemez bir dağılımdan bağımsız örnek çekmeye çalışmak yerine, durağan dağılımı tam da hedef olan bir Markov zinciri inşa ediyoruz. Dersin sonunda Metropolis-Hastings'i sıfırdan implement etmiş, muz şeklindeki bir posterioru bir zincirin nasıl keşfettiğini izlemiş, otokorelasyon grafikleriyle yakınsamayı tanılamış ve aynı makinenin Bayes sinir ağlarına, RLHF ödül modellerine ve Transformer öncesi NLP'ye hâkim olan topic modellerine nasıl güç verdiğini anlamış olacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bayes posterior çıkarımının neden <em>E<sub>p</sub>[f(X)]</em> beklentilerini hesaplamaya indirgendiğini ve doğrudan integrasyonun birkaç boyuttan sonra neden başarısız olduğunu söylemeyi</li>
<li>Monte Carlo tahmin edicilerinin <em>O(1/√N)</em> hata oranını türetmeyi ve bunun boyuttan bağımsız olmasının — tüm konunun en şaşırtıcı olgusunun — neden böyle olduğunu açıklamayı</li>
<li>Önemli örnekleme ve red örnekleme uygulamayı; MCMC'yi motive eden iki başarısızlık modunu (yüksek varyans, sıfıra yakın kabul oranı) tanımayı</li>
<li>Ayrıntılı denge koşulunu yazıp Metropolis-Hastings'in herhangi bir pozitif öneri yoğunluğu için bunu sağladığını ispatlamayı</li>
<li>Metropolis-Hastings ve Gibbs örneklemeyi NumPy'da implement etmeyi; yakınsamayı iz grafikleri, otokorelasyon ve R-hat ile tanılamayı</li>
<li>Algoritmayı modern AI kullanımlarına bağlamayı: Bayes sinir ağları, RLHF ödül modelleme, LDA topic modelleri ve gizli değişken modellerinde posterior örnekleme</li>
</ul>
</div>

<h2 class="lesson-title">1. Problem: E<sub>p(x)</sub>[f(x)] Hesaplamak</h2>

<div class="calc-highlight"><strong>Bir Bayesçinin hesaplamak istediği neredeyse her nicelik bir beklentidir.</strong> Bir parametrenin posterior ortalaması, yeni bir gözlemin posterior öngörüsü, model kanıtı, karar-teorisi kaybı — hepsi bir <em>f(x)</em>'in bir posterior <em>p(x | veri)</em> ile ağırlıklandırılmış integralleridir. Sorun, posteriorun neredeyse hiçbir zaman elle integre edilebilir bir şey olmamasıdır.</p>

<p class="l-text">Bayes kuralı posterioru bir sabite kadar yazar:</p>

<div class="calc-formula"><div class="formula-label">POSTERIOR</div><div class="formula-main">$$p(\\theta \\mid \\mathcal{D}) \\;=\\; \\frac{p(\\mathcal{D} \\mid \\theta) \\, p(\\theta)}{\\int p(\\mathcal{D} \\mid \\theta) \\, p(\\theta) \\, d\\theta} \\;=\\; \\frac{1}{Z} \\, \\tilde{p}(\\theta)$$</div><div class="formula-sub">Normalize edilmemiş posterior <em>p̃(θ) = p(D|θ)·p(θ)</em> nokta nokta kolayca hesaplanır. Normalizasyon sabiti <em>Z</em> ise neredeyse hiçbir zaman analitik olmayan yüksek boyutlu bir integraldir.</div></div>

<p class="l-text">Somut olarak, 50 boyutlu bir sinir ağı ağırlık vektörünün posterior ortalamasını istediğini varsay. İntegral</p>

<div class="calc-formula"><div class="formula-label">POSTERIOR BEKLENTİSİ</div><div class="formula-main">$$\\mathbb{E}_{p(\\theta \\mid \\mathcal{D})}[f(\\theta)] \\;=\\; \\int f(\\theta) \\, p(\\theta \\mid \\mathcal{D}) \\, d\\theta$$</div><div class="formula-sub">50 boyutlu bir integral. Eksen başına 10 nokta olan herhangi bir sayısal kuadratur <em>10<sup>50</sup></em> değerlendirme isterdi. Gözlemlenebilir evrende yaklaşık 10<sup>80</sup> atom var.</div></div>

<p class="l-text"><strong>Deterministik kuadraturun yüksek boyutta ölmesinin nedeni.</strong> <em>d</em> boyutta eksen başına <em>k</em> noktalı bir ızgaranın <em>k<sup>d</sup></em> düğümü vardır. Kaba <em>k = 10</em> bile <em>d ≈ 15</em>'ten sonra astronomik biçimde pahalı olur. Bu meşhur <em>boyutluluk laneti</em>dir ve her Bayes hesabının çarptığı duvardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İstediğimiz</div><div class="card-body"><em>E<sub>p</sub>[f(X)]</em> için doğruluğu boyutla patlamayan bir tahmin edici.</div><div class="card-formula">Ê → E[f(X)]</div></div>
<div class="calc-card"><div class="card-title">Sahip olduğumuz</div><div class="card-body">Genellikle yalnızca <em>p̃(x)</em> — normalizasyon sabitine kadar posterior. Bazen sadece <em>oran</em> <em>p̃(x)/p̃(y)</em>.</div><div class="card-formula">p(x) = p̃(x)/Z</div></div>
<div class="calc-card"><div class="card-title">Numara</div><div class="card-body">Örnekleme. İntegrali <em>p</em>'den çekilen örnekler üzerindeki ampirik ortalama ile değiştir. Sonraki bölümler bu örnekleri elde etmenin beş yolu.</div><div class="card-formula">(1/N)Σf(xᵢ)</div></div>
</div>

<h2 class="lesson-title">2. Vanilla Monte Carlo</h2>

<div class="calc-highlight"><strong>En basit fikir çalışıyor.</strong> Bağımsız örnekler <em>x<sub>1</sub>, …, x<sub>N</sub> ~ p(x)</em> üretebilirsen, Büyük Sayılar Yasası gereği ampirik ortalama gerçek beklentiye yakınsar.</div>

<div class="calc-formula"><div class="formula-label">MONTE CARLO TAHMİN EDİCİSİ</div><div class="formula-main">$$\\widehat{\\mu}_N \\;=\\; \\frac{1}{N} \\sum_{i=1}^{N} f(x_i) \\;\\xrightarrow[N \\to \\infty]{a.s.}\\; \\mathbb{E}_{p(x)}[f(X)]$$</div><div class="formula-sub">Güçlü Büyük Sayılar Yasası gereği örnek ortalaması, <em>f</em> nasıl olursa olsun, neredeyse kesin olarak gerçek beklentiye yakınsar.</div></div>

<p class="l-text">Merkezi Limit Teoremi bunu bir hata sınırına keskinleştirir:</p>

<div class="calc-formula"><div class="formula-label">MONTE CARLO HATA ORANI</div><div class="formula-main">$$\\sqrt{N} \\, \\big( \\widehat{\\mu}_N - \\mu \\big) \\;\\xrightarrow{d}\\; \\mathcal{N}\\!\\big(0, \\sigma_f^2\\big), \\qquad \\sigma_f^2 = \\mathrm{Var}_{p}[f(X)]$$</div><div class="formula-sub">Tahmin edicinin standart hatası <em>σ<sub>f</sub> / √N</em> gibi küçülür. Hatayı yarıya indirmek için örnekleri dörde katla.</div></div>

<p class="l-text"><strong>Mucize: bu oran <em>d</em> boyutundan bağımsızdır.</strong> Reel doğru üzerinde mi integre ediyorsun, 10.000 boyutlu ağırlık uzayında mı — on bin örnek sana aynı istatistiksel doğruluğu satın alır. Sabit <em>σ<sub>f</sub></em> probleme bağlıdır, ama <em>1/√N</em> şekli bağlı değildir. Bu tek olgu, Monte Carlo'nun orta boyutlu herhangi bir ortamda eninde sonunda ızgara yöntemlerini yenmesinin nedenidir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — π TAHMİNİ</div><div class="example-body">Birim disk π alana sahip ve alanı 4 olan [−1, 1]<sup>2</sup> karesinin içinde yer alır. Düzgün rastgele bir noktanın diske düşme olasılığı dolayısıyla π/4'tür. <em>N</em> nokta örnekle, kaç tanesinin içeride olduğunu say, 4 ile çarp — π tahminin elinde.<br><br><em>N = 1000</em> ile standart hata yaklaşık 0.05 — π'yi bir ondalıkla yakalamaya yeter. <em>N = 1.000.000</em> ile hata ~0.0017'ye iner. Yakınsama yavaş ama tamamen güvenilirdir.</div></div>

<div class="calc-graph"><div id="plot-l3-pi-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> <em>[−1, 1]<sup>2</sup></em>'de 2000 düzgün rastgele nokta; birim diskin içine düşenler mavi, dışına düşenler turuncu. İçeridekilerin oranı kez 4 π'yi tahmin eder. Tahmin gerçek değer etrafında öngörülen <em>1/√N</em> ölçeğinde dalgalanır — bu, en saf haliyle Monte Carlo integrasyonudur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xi=[],yi=[],xo=[],yo=[];var seed=42;
function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
for(var i=0;i<2000;i++){var x=2*rng()-1,y=2*rng()-1;if(x*x+y*y<=1){xi.push(x);yi.push(y);}else{xo.push(x);yo.push(y);}}
var theta=[],cx=[],cy=[];for(var k=0;k<=200;k++){var t=2*Math.PI*k/200;theta.push(t);cx.push(Math.cos(t));cy.push(Math.sin(t));}
var d1={x:xi,y:yi,mode:'markers',name:'disk içinde',marker:{color:'#3b82f6',size:4,opacity:0.7}};
var d2={x:xo,y:yo,mode:'markers',name:'dışında',marker:{color:'#f59e0b',size:4,opacity:0.7}};
var d3={x:cx,y:cy,mode:'lines',name:'birim çember',line:{color:'#ffffff',width:2}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.05,1.05],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.05,1.05]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-pi-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l3-pierr-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Yakınsama tanıları:</strong> <em>|π̂<sub>N</sub> − π|</em>'nin <em>N</em>'ye karşı log-log grafiği. Ampirik hata (mavi) eğimi <em>−1/2</em> olan kesikli referans çizgisine yapışır — tam olarak <em>1/√N</em> Monte Carlo oranı. Gürültüye dikkat: tek bir zincir trendin etrafında zıplar, ama trend kendisi çelik gibi sağlamdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=7;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
var Ns=[],errs=[];var inside=0;
for(var i=1;i<=20000;i++){var x=2*rng()-1,y=2*rng()-1;if(x*x+y*y<=1)inside++;if(i===10||i===30||i===100||i===300||i===1000||i===3000||i===10000||i===20000){Ns.push(i);errs.push(Math.abs(4*inside/i-Math.PI));}}
var ref=Ns.map(function(n){return 1.5/Math.sqrt(n);});
var d1={x:Ns,y:errs,mode:'lines+markers',name:'|π̂−π|',line:{color:'#3b82f6',width:2.2},marker:{size:7}};
var d2={x:Ns,y:ref,mode:'lines',name:'∝ 1/√N',line:{color:'#9ca3af',width:1.8,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'N (log)',type:'log',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'mutlak hata (log)',type:'log',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-pierr-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Yakalama:</strong> vanilla Monte Carlo, <em>p</em>'den tam i.i.d. örnekler çekebildiğini varsayar. Bir karenin üzerindeki düzgün dağılım için kolay. Önemsiz olmayan korelasyonları olan 50 boyutlu bir posterior için umutsuz. Sonraki üç bölüm bu çukurdan tırmanıyor.</div>

<h2 class="lesson-title">3. Önemli Örnekleme (Importance Sampling)</h2>

<div class="calc-highlight"><strong>Kolay bir yerden örnekle, yanlılığı ağırlıklandırarak düzelt.</strong> <em>p</em>'den örnek çekmek zorsa ama bir <em>q</em> kolaysa, <em>q</em>'dan çek ve her örneği olabilirlik oranı <em>p(x) / q(x)</em> ile ağırlıklandır. Ağırlıklı ortalama <em>E<sub>p</sub>[f(X)]</em> için yansızdır.</div>

<div class="calc-formula"><div class="formula-label">ÖNEMLİ ÖRNEKLEME ÖZDEŞLİĞİ</div><div class="formula-main">$$\\mathbb{E}_{p}[f(X)] \\;=\\; \\int f(x) \\, p(x) \\, dx \\;=\\; \\int f(x) \\, \\frac{p(x)}{q(x)} \\, q(x) \\, dx \\;=\\; \\mathbb{E}_{q}\\!\\left[ f(X) \\, \\frac{p(X)}{q(X)} \\right]$$</div><div class="formula-sub"><em>q(x)</em> ile çarp ve böl. İntegral artık <em>q</em> altında bir beklenti gibi görünüyor, <em>w(x) = p(x)/q(x)</em> ağırlıklarıyla.</div></div>

<p class="l-text">Monte Carlo tahmin edicisi olur:</p>

<div class="calc-formula"><div class="formula-label">ÖNEMLİ ÖRNEKLEME TAHMİN EDİCİSİ</div><div class="formula-main">$$\\widehat{\\mu}^{\\,IS}_N \\;=\\; \\frac{1}{N} \\sum_{i=1}^{N} f(x_i) \\, \\frac{p(x_i)}{q(x_i)}, \\qquad x_i \\sim q(x)$$</div><div class="formula-sub">Tek gereksinim: <em>q</em>, <em>p</em>'nin desteği üzerinde tam desteğe sahip olmalı (aksi takdirde <em>p</em>'nin bir bölgesi sonsuza dek sıfır ağırlık alır).</div></div>

<p class="l-text"><strong>Varyans her şeydir.</strong> Tahmin edici geçerli her <em>q</em> için yansızdır, ama varyansı korkutucu olabilir:</p>

<div class="calc-formula"><div class="formula-label">IS TAHMİN EDİCİSİNİN VARYANSI</div><div class="formula-main">$$\\mathrm{Var}_q\\!\\left[ f(X) \\, \\frac{p(X)}{q(X)} \\right] \\;=\\; \\mathbb{E}_q\\!\\left[ f(X)^2 \\, \\frac{p(X)^2}{q(X)^2} \\right] \\;-\\; \\mu^2$$</div><div class="formula-sub"><em>q(x)</em>, <em>p(x)·|f(x)|</em>'in büyük olduğu yerde küçükse, ağırlıklar patlar ve tahmin ediciye bir avuç dev örnek hâkim olur. Etkili örnek boyutu çöker.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İyi öneri</div><div class="card-body"><em>q</em>, <em>|f|·p</em>'nin şekliyle uyuşur. Ağırlıklar 1'e yakın kalır. Varyans ~ vanilla Monte Carlo.</div><div class="card-formula">q ∝ |f|·p</div></div>
<div class="calc-card"><div class="card-title">Kötü öneri</div><div class="card-body"><em>q</em>, <em>p</em>'nin kuyruklarından uzaktır. Birkaç örnek astronomik ağırlık alır; gerisi boşa gider. Etkili <em>N</em> <em>N = 10<sup>6</sup></em> ile bile 5 olabilir.</div><div class="card-formula">w(x) ≫ 1</div></div>
<div class="calc-card"><div class="card-title">Öz-normalize IS</div><div class="card-body">Yalnızca <em>p̃ = Z·p</em>'yi biliyorsan, <em>Z</em>'yi yok etmek için <em>Σ w(x<sub>i</sub>)</em>'ye böl. Yanlı ama tutarlı, normalize ediciyi bilmeden çalışır.</div><div class="card-formula">Σf·w / Σw</div></div>
</div>

<div class="calc-graph"><div id="plot-l3-is-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> hedef dağılım <em>p(x)</em>, +2 etrafında dar bir Gauss (mavi), öneri <em>q(x)</em> ise 0 etrafında daha geniş bir Gauss (turuncu). Her örnekteki işaretçi boyutu önem ağırlığı <em>p(x)/q(x)</em>'i yansıtır; +2 etrafındaki büyük işaretçiler tahmin edicinin bilgisinin çoğunu taşır, sol kuyruktaki ziyan edilen örnekler ise neredeyse hiçbir şey katmaz. "Zayıf etkili örnek boyutu"nun görünüşü budur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function npdf(x,m,s){return Math.exp(-0.5*Math.pow((x-m)/s,2))/(s*Math.sqrt(2*Math.PI));}
var xs=[],pys=[],qys=[];
for(var i=0;i<=300;i++){var x=-4+8*i/300;xs.push(x);pys.push(npdf(x,2,0.6));qys.push(npdf(x,0,1.6));}
var seed=11;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=rng(),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var sx=[],sy=[],sw=[];
for(var k=0;k<60;k++){var x=1.6*randn();sx.push(x);sy.push(0);sw.push(8+50*npdf(x,2,0.6)/npdf(x,0,1.6));}
var d1={x:xs,y:pys,mode:'lines',name:'hedef p(x)',line:{color:'#3b82f6',width:2.4}};
var d2={x:xs,y:qys,mode:'lines',name:'öneri q(x)',line:{color:'#f59e0b',width:2.4,dash:'dash'}};
var d3={x:sx,y:sy,mode:'markers',name:'ağırlıklı örnekler',marker:{color:'#10b981',size:sw,opacity:0.55,line:{color:'#0a0a0a',width:0.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'yoğunluk',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-is-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">4. Red Örnekleme (Rejection Sampling)</h2>

<div class="calc-highlight"><strong>Hedefi zarflayabiliyorsan, ondan tam örnek çekebilirsin.</strong> Örnek çekebileceğin bir <em>q</em> fonksiyonu ve tüm <em>x</em> için <em>p(x) ≤ M·q(x)</em> olan bir sabit <em>M</em> bul. O zaman <em>y ~ q</em> örnekleyip <em>p(y) / (M·q(y))</em> olasılığıyla kabul etmek, <em>p</em>'den tam bir örnek üretir.</div>

<div class="calc-formula"><div class="formula-label">RED ÖRNEKLEME — KABUL OLASILIĞI</div><div class="formula-main">$$\\Pr\\!\\big[\\text{accept } y\\big] \\;=\\; \\frac{p(y)}{M \\, q(y)} \\;\\in\\; [0, 1]$$</div><div class="formula-sub"><em>y ~ q</em> çek, <em>u ~ U(0, 1)</em> çek, <em>u ≤ p(y) / (M·q(y))</em> ise <em>y</em>'yi kabul et. Kabul koşuluna göre, <em>y</em> tam olarak <em>p</em> dağılımına sahiptir.</div></div>

<p class="l-text"><strong>Kanıt taslağı.</strong> Kabul edilen örneklerin ortak yoğunluğu <em>q(y) · (p(y) / (M·q(y))) = p(y) / M</em> ile orantılıdır. Kabul olayı üzerinden yeniden normalize ederek <em>p</em>'yi geri alırız. Temiz ve tam.</p>

<div class="calc-formula"><div class="formula-label">BEKLENEN KABUL ORANI</div><div class="formula-main">$$\\Pr[\\text{accept}] \\;=\\; \\int \\frac{p(y)}{M \\, q(y)} q(y) \\, dy \\;=\\; \\frac{1}{M}$$</div><div class="formula-sub">Sıkı zarflar (M ≈ 1) neredeyse her şeyi kabul eder. Gevşek zarflar (M ≫ 1) örnek ziyan eder.</div></div>

<p class="l-text"><strong>Red örneklemenin çöktüğü yer.</strong> <em>d</em> boyutta, çok hafifçe gevşek bir zarf bile felakettir. <em>p</em> birim Gauss ve <em>q</em> standart sapması <em>1 + ε</em> olan bir Gauss ise, <em>M</em> sabiti <em>(1 + ε)<sup>d</sup></em> gibi ölçeklenir. Kabul oranı boyutla geometrik olarak azalır. <em>d = 50</em>'de milyonlarca örnekte bir tane kabul edersin.</p>

<div class="calc-graph"><div id="plot-l3-rej-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> hedef <em>p(x)</em> (mavi düz) zarf <em>q</em> (gri kesikli) ile <em>M·q(x)</em> tarafından yukarıdan sınırlanır. <em>p</em>'nin altındaki gölgeli alan "kabul" bölgesidir — buraya düşen örnekler tutulur. <em>p</em> ile <em>M·q</em> arasındaki şerit "ret" bölgesidir — ziyan edilmiş çekimler. Zarfı sıkılaştırmak ret şeridini küçültür ve kabul oranı 1'e yaklaşır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function npdf(x,m,s){return Math.exp(-0.5*Math.pow((x-m)/s,2))/(s*Math.sqrt(2*Math.PI));}
var xs=[],pys=[],qys=[];var M=2.2;
for(var i=0;i<=300;i++){var x=-4+8*i/300;xs.push(x);pys.push(npdf(x,0.5,0.7));qys.push(M*npdf(x,0,1.6));}
var d1={x:xs,y:pys,mode:'lines',name:'hedef p(x)',line:{color:'#3b82f6',width:2.6},fill:'tozeroy',fillcolor:'rgba(59,130,246,0.18)'};
var d2={x:xs,y:qys,mode:'lines',name:'zarf M·q(x)',line:{color:'#9ca3af',width:2,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'yoğunluk',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:0.5,y:0.45,text:'kabul (p altı)',showarrow:false,font:{color:'#93c5fd',size:13}},{x:-2.4,y:0.45,text:'ret (p ile M·q arası)',showarrow:false,font:{color:'#9ca3af',size:12}}]};
Plotly.newPlot('plot-l3-rej-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-warn"><strong>Her iki yöntem de yüksek boyutta kırılır.</strong> Önemli örnekleme, öneri modu kaçırdığında çöker (boyut büyüdükçe üstel olasılıkla). Red örnekleme, zarf gevşek olduğunda çöker (yine üstel olasılıkla). Yüzlerce ile milyonlarca parametreli modern Bayes modelleri için ikisi de uygulanabilir değil. MCMC sahneye giriyor.</div>

<h2 class="lesson-title">5. Neden MCMC?</h2>

<div class="calc-highlight"><strong>Bağımsızlığı işlenebilirlikle takas et.</strong> <em>p</em>'den i.i.d. örnek çekmeye çalışmak yerine, durağan dağılımı <em>p</em> <em>olan</em> bir Markov zinciri inşa et. Zinciri yeterince uzun çalıştır, ampirik dağılımı <em>p</em>'ye yakınsar — ardışık örnekler korelasyonlu olsa bile. Mucize, bu yapının sadece <em>p̃(x)</em>'i verilen noktalarda değerlendirme yeteneğini, hem de yalnızca çarpımsal bir sabite kadar gerektirmesidir.</div>

<p class="l-text">L1'den hatırla: bir <em>X</em> durum uzayı üzerindeki Markov zinciri bir geçiş çekirdeği <em>P(x → y)</em> ile belirlenir. Bir <em>π</em> dağılımı, çekirdek uygulandığında değişmiyorsa durağandır:</p>

<div class="calc-formula"><div class="formula-label">DURAĞANLIK</div><div class="formula-main">$$\\pi(y) \\;=\\; \\int \\pi(x) \\, P(x \\to y) \\, dx \\qquad \\text{for all } y$$</div><div class="formula-sub">Zincir <em>π</em>'ye ulaştığında, sonraki durumlar <em>π</em> dağılımında kalır. Geçiş operatörünün sabit noktası.</div></div>

<p class="l-text"><strong>MCMC sorusu, tersine.</strong> Klasik Markov zinciri teorisi bir çekirdek <em>P</em>'den başlar ve durağan dağılımı sorar. MCMC istenen durağan dağılım <em>π = p</em>'den başlar ve onu sağlayan bir çekirdek tasarlar. Böyle bir çekirdek elde edildiğinde, zinciri simüle etmek uzun vadede dağılımı <em>p</em> olan örnekler üretir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yalnızca oranlara ihtiyaç var</div><div class="card-body">Metropolis-Hastings <em>p(y)/p(x)</em>'i kullanır. Bilinmeyen <em>Z</em> yok olur: <em>p̃(y)/p̃(x) = p(y)/p(x)</em>. Normalize ediciyi asla hesaplamak zorunda kalmazsın.</div><div class="card-formula">Z, α'da yok olur</div></div>
<div class="calc-card"><div class="card-title">Yüksek d'ye ölçeklenir</div><div class="card-body">Adım başına maliyet <em>p̃</em>'nin bir veya birkaç değerlendirmesidir. <em>d</em>'de üstel patlama yok. Verilen doğruluğu sağlamak için örnek boyutu boyutla polinomsal (genellikle kabaca doğrusal) ölçeklenir.</div><div class="card-formula">maliyet ∝ poly(d)</div></div>
<div class="calc-card"><div class="card-title">Ödenen bedel</div><div class="card-body">Örnekler bağımsız değil, korelasyonludur. Etkili örnek boyutu zincir uzunluğundan küçüktür. Yakınsama tanıları zorunlu hale gelir.</div><div class="card-formula">ESS &lt; N</div></div>
</div>

<h2 class="lesson-title">6. Ayrıntılı Denge &amp; Ergodiklik</h2>

<div class="calc-highlight"><strong>Ayrıntılı denge, durağanlık için yeterli bir koşuldur.</strong> Her durum çifti <em>x, y</em> için, zincir denge halindeyken <em>x</em>'ten <em>y</em>'ye geçme olasılığı, tersine gitme olasılığıyla aynıysa, <em>π</em> durağandır.</div>

<div class="calc-formula"><div class="formula-label">AYRINTILI DENGE (TERSİNEBİLİRLİK)</div><div class="formula-main">$$\\pi(x) \\, P(x \\to y) \\;=\\; \\pi(y) \\, P(y \\to x) \\qquad \\text{for all } x, y$$</div><div class="formula-sub">İki tarafı da bir olasılık akışı olarak oku: <em>π</em> altında <em>x → y</em> akışı, <em>y → x</em> akışını tam olarak iptal eder. Zincir ileri ve geri çalıştırıldığında "aynı görünür".</div></div>

<p class="l-text"><strong>Ayrıntılı denge durağanlık ima eder.</strong> Her iki tarafı <em>x</em> üzerinden integre et:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Ayrıntılı dengeden başla</div><div class="step-detail">π(x) P(x → y) = π(y) P(y → x), her çift için geçerli.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title"><em>x</em> üzerinden integre et</div><div class="step-detail">∫ π(x) P(x → y) dx = ∫ π(y) P(y → x) dx = π(y) ∫ P(y → x) dx = π(y) · 1 = π(y).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Durağanlık denklemini tanı</div><div class="step-detail">Sol taraf tam olarak π'ye uygulanmış geçiş operatörüdür. Az önce bunun π(y)'ye eşit olduğunu gösterdik, yani π durağandır. □</div></div></div>
</div>

<p class="l-text"><strong>Ergodiklik tekliği ve yakınsamayı ekler.</strong> Durağanlık tek başına yeterli değildir — bir zincirin birden çok durağan dağılımı olabilir veya yakınsamadan salınabilir. Şunlar gerekir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İndirgenemezlik</div><div class="card-body">Herhangi bir başlangıç durumundan, zincirin nihayetinde <em>π</em>-kütlesi pozitif olan herhangi bir bölgeye ulaşma olasılığı pozitiftir.</div><div class="card-formula">∀x, y: ∃k, P<sup>k</sup>(x,y) &gt; 0</div></div>
<div class="calc-card"><div class="card-title">Aperiyodiklik</div><div class="card-body">Herhangi bir duruma dönüş süreleri 1'den büyük bir periyodun katları değildir. Sürekli rastgele yürüyüş önerileri bunu otomatik yapar.</div><div class="card-formula">gcd{k: P<sup>k</sup>(x,x)&gt;0} = 1</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">İndirgenemez + aperiyodik + durağan <em>π</em>'li zincir ⇒ <em>π</em> tektir ve her başlangıç <em>x</em> için <em>P<sup>n</sup>(x, ·) → π</em> toplam varyasyonda.</div><div class="card-formula">P<sup>n</sup> → π</div></div>
</div>

<div class="l-note"><strong>Pratik çıkarım:</strong> öneri yoğunluğun tam destekli ve öneri olasılığı sürekli ise, oluşan Metropolis-Hastings zinciri otomatik olarak indirgenemez ve aperiyodiktir. Asıl zor iş ayrıntılı dengeyi doğrulamaktır — ve algoritma tam da bunu sağlayacak biçimde inşa edilmiştir.</div>

<h2 class="lesson-title">7. Metropolis-Hastings Algoritması</h2>

<div class="calc-highlight"><strong>Hesaplamalı Bayes çıkarımında en çok kullanılan algoritma.</strong> Metropolis-Hastings, herhangi bir hedef <em>π</em> için ayrıntılı dengeyi sağlayan bir geçiş çekirdeği inşa eder; üstelik yalnızca <em>π</em>'yi bir sabite kadar değerlendirme yeteneğiyle.</div>

<p class="l-text">Algoritmanın iki bileşeni vardır: örnek çekebileceğin bir <em>öneri yoğunluğu</em> <em>q(y | x)</em> ve <em>kabul olasılığı</em></p>

<div class="calc-formula"><div class="formula-label">METROPOLIS-HASTINGS KABULÜ</div><div class="formula-main">$$\\alpha(x, y) \\;=\\; \\min\\!\\left\\{ 1, \\; \\frac{\\pi(y) \\, q(x \\mid y)}{\\pi(x) \\, q(y \\mid x)} \\right\\}$$</div><div class="formula-sub">Öneri seni daha yüksek <em>π</em>'ye taşırsa (öneri asimetrisi düzeltildikten sonra), kabul et. Daha düşüğe taşırsa, küçülen olasılıkla kabul et. min(1, ·) oranı sınırlar.</div></div>

<div class="calc-formula"><div class="formula-label">M-H PSEUDOCODE OLARAK</div><div class="formula-main">$$\\begin{aligned} & \\text{1. Önerme } y \\sim q(y \\mid x_t). \\\\ & \\text{2. Hesapla } \\alpha = \\min\\{1, [\\pi(y) q(x_t|y)] / [\\pi(x_t) q(y|x_t)]\\}. \\\\ & \\text{3. } u \\sim U(0,1) \\text{ çek.} \\\\ & \\text{4. } x_{t+1} = y \\text{ eğer } u \\le \\alpha, \\text{ değilse } x_{t+1} = x_t. \\end{aligned}$$</div><div class="formula-sub">Reddedilirse, bulunduğun yerde kal — bu bir hata değil, matematiği işleten şey budur.</div></div>

<p class="l-text"><strong>Neden ayrıntılı denge geçerli.</strong> Geçiş çekirdeğini parça parça yaz:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title"><em>y ≠ x</em> için etkili geçiş yoğunluğu</div><div class="step-detail">P(x → y) = q(y | x) · α(x, y). (Önerme y, sonra onu kabul et.)</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title"><em>π(x)·P(x → y)</em> akışını hesapla</div><div class="step-detail">π(x) · q(y|x) · α(x,y) = π(x) · q(y|x) · min{1, [π(y)·q(x|y)] / [π(x)·q(y|x)]}.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title"><em>a · min(1, b/a) = min(a, b)</em> özdeşliğini kullan</div><div class="step-detail">π(x) · q(y|x) · α(x,y) = min{π(x)·q(y|x), π(y)·q(x|y)}.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Bu ifade <em>x, y</em>'de simetriktir</div><div class="step-detail">x ile y yer değiştirilerek aynı hesap yapıldığında, π(y)·P(y → x) = min{π(y)·q(x|y), π(x)·q(y|x)} — tam olarak aynı sayı. Ayrıntılı denge geçerli. □</div></div></div>
</div>

<p class="l-text"><strong>Neden <em>π</em>'yi yalnızca bir sabite kadar bilmemiz yeterli.</strong> Kabul oranı <em>π(y) / π(x)</em>'i içerir. Eğer <em>π = p̃ / Z</em> ise, bilinmeyen <em>Z</em> yok olur: <em>π(y)/π(x) = p̃(y)/p̃(x)</em>. Bu, Bayes hesabındaki tek en önemli pratik olgudur — işlenemez normalize edici sabit <em>Z = ∫ p̃ dθ</em>, algoritma için tamamen alakasızdır.</p>

<h2 class="lesson-title">8. Simetrik Önerilerle Metropolis</h2>

<div class="calc-highlight"><strong>Orijinal 1953 algoritması.</strong> Öneri simetrik olduğunda — bir Gauss rastgele yürüyüşü gibi şu andaki durum etrafında, <em>q(y | x) = q(x | y)</em> — kabul oranındaki <em>q</em> çarpanları yok olur ve elimizde güzelce basit bir kural kalır.</div>

<div class="calc-formula"><div class="formula-label">METROPOLIS KABULÜ (SİMETRİK ÖNERİ)</div><div class="formula-main">$$\\alpha(x, y) \\;=\\; \\min\\!\\left\\{ 1, \\; \\frac{\\pi(y)}{\\pi(x)} \\right\\}$$</div><div class="formula-sub">Daha yüksek yoğunluğa hareketleri her zaman kabul et; aşağı yöndeki hareketleri yoğunluk oranına eşit olasılıkla kabul et. Tüm algoritma budur.</div></div>

<p class="l-text"><strong>Çözülmüş örnek: 2B Gauss karışımını örneklemek.</strong> İki Gauss tümseği olan bir hedefi al:</p>

<div class="calc-formula"><div class="formula-label">HEDEF KARIŞIM</div><div class="formula-main">$$\\pi(x, y) \\;\\propto\\; \\tfrac{1}{2} \\, \\mathcal{N}\\!\\big( (x,y); (-1.5, 0), 0.5^2 I\\big) \\;+\\; \\tfrac{1}{2} \\, \\mathcal{N}\\!\\big( (x,y); (+1.5, 0), 0.5^2 I\\big)$$</div><div class="formula-sub">Düşük yoğunluklu bir "vadi" ile ayrılmış iki Gauss modu. Zincirin ara sıra karşıya geçmesi gerekir.</div></div>

<p class="l-text">Gauss rastgele yürüyüş önerisi <em>q(y|x) = N(y; x, σ<sup>2</sup> I)</em> kullan. <em>σ</em> ayarı önemlidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">σ çok küçük</div><div class="card-body">Yüksek kabul oranı (~%90) ama küçücük adımlar. Zincir sürünür — modlar arasında belki hiç geçmez. Posterior kapsamı yanlıdır.</div><div class="card-formula">kabul ≈ 0.9</div></div>
<div class="calc-card"><div class="card-title">σ ayarlı</div><div class="card-body">Kabul oranı 0.234 etrafında (yüksek boyutlu rastgele yürüyüş Metropolis için ünlü optimal oran). Adımlar ve kabul dengelenir.</div><div class="card-formula">kabul ≈ 0.234</div></div>
<div class="calc-card"><div class="card-title">σ çok büyük</div><div class="card-body">Önerilerin çoğu uzak düşük-yoğunluk kuyruklarına gider ve reddedilir. Kabul oranı ≈ 0.05. Zincir uzun süre takılı kalır.</div><div class="card-formula">kabul ≈ 0.05</div></div>
</div>

<div class="l-note"><strong>0.234 kuralı</strong>: Roberts, Gelman &amp; Gilks (1997) ispatladı ki yüksek boyutlu çarpım hedefi üzerinde rastgele yürüyüş Metropolis için, öneri <em>σ</em> uygun şekilde ölçeklendiğinde asimptotik olarak optimal kabul oranı ≈ %23.4'tür. Gerçek örnekleyiciler (Stan'in NUTS'u, PyMC'nin uyarlamalı Metropolis'i) önerilerini bu sayıya yakın inmek üzere çalışma zamanında ayarlar — gerçi HMC ve NUTS için hedef %65'e daha yakındır.</div>

<h2 class="lesson-title">9. Gibbs Örnekleme</h2>

<div class="calc-highlight"><strong>Her önerinin kabul edildiği özel durum.</strong> Gibbs örnekleme, çok değişkenli bir <em>x = (x<sub>1</sub>, …, x<sub>d</sub>)</em>'in bileşenleri arasında döner ve her bileşeni diğerlerine koşullu dağılımından bir çekimle değiştirir. Her böyle değiştirme, kabul olasılığı tam olarak 1 olan bir Metropolis-Hastings adımıdır.</div>

<div class="calc-formula"><div class="formula-label">GIBBS GÜNCELLEMESİ</div><div class="formula-main">$$x_i^{(t+1)} \\;\\sim\\; p\\!\\left( x_i \\;\\big|\\; x_1^{(t+1)}, \\ldots, x_{i-1}^{(t+1)}, x_{i+1}^{(t)}, \\ldots, x_d^{(t)} \\right)$$</div><div class="formula-sub">Bileşenler arasında sırayla dön. Bir tam turdan sonra yeni bir ortak örneğin olur. Koşullu <em>p(x<sub>i</sub> | x<sub>−i</sub>)</em>'nin örneklenmesi kolay olmalı — giriş bedeli bu.</div></div>

<p class="l-text"><strong>Neden çalışır.</strong> Tam koşullu dağılımdan örneklemek, M-H önerisi <em>q(x<sub>i</sub><sup>′</sup> | x) = p(x<sub>i</sub><sup>′</sup> | x<sub>−i</sub>)</em>'dir. Kabul oranına koy:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Ortağı koşullu × marjinal olarak yaz</div><div class="step-detail">π(x) = p(x<sub>i</sub> | x<sub>−i</sub>) · p(x<sub>−i</sub>). Hem güncellenmiş hem eski durum aynı x<sub>−i</sub>'yi paylaşır.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">M-H kabul oranını hesapla</div><div class="step-detail">α = [π(x') · q(x | x')] / [π(x) · q(x' | x)] = [p(x'<sub>i</sub>|x<sub>−i</sub>) · p(x<sub>−i</sub>) · p(x<sub>i</sub>|x<sub>−i</sub>)] / [p(x<sub>i</sub>|x<sub>−i</sub>) · p(x<sub>−i</sub>) · p(x'<sub>i</sub>|x<sub>−i</sub>)] = 1.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Her zaman kabul</div><div class="step-detail">Kabul oranı tam olarak 1'dir, yani öneri her zaman kabul edilir. Gibbs, retsiz M-H'dir.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gibbs'in parladığı yerler</div><div class="card-body">Eşlenik önsel dağılımlı hiyerarşik Bayes modelleri (Gauss-Gauss, Dirichlet-multinomyal) kapalı form koşullular verir. LDA, Bayes doğrusal regresyon, karışık etkili modeller.</div><div class="card-formula">p(xᵢ | x₋ᵢ) kapalı form</div></div>
<div class="calc-card"><div class="card-title">Gibbs'in zorlandığı yerler</div><div class="card-body">Güçlü korelasyonlu değişkenler — koordinat bazlı güncellemeler ortak dağılımı dolaşmak için üstel sayıda tur alır. Diyagonal hizalı öneriler sırtları izleyemez.</div><div class="card-formula">sırtlarda yavaş karışım</div></div>
<div class="calc-card"><div class="card-title">Modern alternatif</div><div class="card-body">Hamiltonyen Monte Carlo (HMC) geometriyi izleyen büyük, ortak hareketler önermek için gradyan bilgisini kullanır. Sürekli parametreler için Stan ve PyMC varsayılan olarak HMC/NUTS kullanır.</div><div class="card-formula">∇log π öneriyi bilgilendirir</div></div>
</div>

<h2 class="lesson-title">10. Yakınsamayı Tanılamak</h2>

<div class="calc-highlight"><strong>MCMC örneklerinin doğru olması yalnızca limitte garanti edilir.</strong> Sonlu sürede yanlış modda takılı olabilirsin, hâlâ geçici "burn-in" aşamasında olabilirsin veya posterioru keşfetmek için fazlasıyla yavaş karışıyor olabilirsin. Tanılar, zincirinin gerçekten durağanlığa ulaşıp ulaşmadığını söyler.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İz grafikleri (trace)</div><div class="card-body">Her bileşen <em>x<sub>t</sub><sup>(i)</sup></em>'yi <em>t</em>'ye karşı çiz. Yakınsamış bir zincir tüylü tırtıl gibi görünür — durağan, trendsiz. Yakınsamamış bir zincir sürüklenir veya rejimler arasında zıplar.</div><div class="card-formula">x<sub>t</sub> vs t</div></div>
<div class="calc-card"><div class="card-title">Otokorelasyon</div><div class="card-body"><em>ρ(k) = Korr(x<sub>t</sub>, x<sub>t+k</sub>)</em>. Lag <em>k</em> büyüdükçe 1'den 0'a doğru azalır. Yavaş azalma = zayıf karışan zincir. Otokorelasyonları topla, integre edilmiş otokorelasyon süresi <em>τ</em>'yi elde et.</div><div class="card-formula">ESS ≈ N / (1 + 2τ)</div></div>
<div class="calc-card"><div class="card-title">R-hat (Gelman-Rubin)</div><div class="card-body">Çoklu zinciri aşırı yayılmış başlangıçlardan çalıştır. <em>R̂</em>, zincir-içi varyansı zincirler-arası varyansla karşılaştırır. <em>R̂ ≈ 1.00–1.01</em> yakınsama gösterir; <em>R̂ &gt; 1.1</em> alarmdır.</div><div class="card-formula">R̂ = √(V̂ / W)</div></div>
<div class="calc-card"><div class="card-title">Etkili örnek boyutu (ESS)</div><div class="card-body">ESS = N / (1 + 2Σρ(k)). Zincirinin eşdeğer olduğu bağımsız örnek sayısı. Parametre başına ESS &lt; 100 genellikle yetersiz örneklemeyi gösterir.</div><div class="card-formula">ESS ≪ N genelde</div></div>
</div>

<div class="l-note"><strong>Burn-in</strong>: zincirin erken kısmı, durağanlığa ulaşmadan önce. Standart uygulama ilk %25–50 örneği atmaktır. Modern uyarlamalı örnekleyiciler (NUTS) bu pencereyi adım boyutlarını ayarlamak için de kullanır, dolayısıyla bu örnekleri çıkarım için kullanmamalısın.</div>

<h2 class="lesson-title">11. AI Uygulamaları</h2>

<div class="calc-highlight"><strong>MCMC, posterior gerektiren her olasılıksal ML tekniğinin arkasındaki iş atıdır.</strong> Aşağıda modern AI'a temel olduğu dört yer var.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bayes Sinir Ağları</div><div class="card-body">Bir nokta tahmini <em>θ̂</em> yerine, ağırlıklar üzerinde posterior <em>p(θ | D)</em>'yi öğren. Öngörü dağılımı <em>p(y* | x*, D) = ∫ p(y* | x*, θ) p(θ | D) dθ</em> MCMC örnekleri üzerinden tahminlerin ortalaması alınarak hesaplanır. Epistemik belirsizliği yakalar — tıp, otonom sürüş, bilimsel ML için kritik.</div><div class="card-formula">p(y* | D) = ∫ p(y* | θ) p(θ | D) dθ</div></div>
<div class="calc-card"><div class="card-title">RLHF Ödül Modelleme</div><div class="card-body">İnsan tercih verisi seyrek ve gürültülüdür. Bayes toplama, ödül fonksiyonları üzerinde bir posterior yerleştirir; MCMC beklenen ödül ve belirsizlik bantlarını hesaplamak için kullanılır. Anthropic ve OpenAI'nin her ikisi de hizalama araştırmalarında Bayes ödül modellemeyi araştırır.</div><div class="card-formula">p(r | tercihler)</div></div>
<div class="calc-card"><div class="card-title">LDA Konu Modelleri</div><div class="card-body">Latent Dirichlet Allocation, konu dağılımları üzerine Dirichlet önseli koyar. Gizli konu atamaları üzerinde posterior işlenemezdir, ama tam koşulluları basit multinomyallerdir — çökmüş Gibbs örnekleme için kusursuz. LDA, Transformer öncesi on yıl boyunca NLP konu modellemesine hâkim oldu.</div><div class="card-formula">z<sub>ij</sub> | rest ~ Multinomyal</div></div>
<div class="calc-card"><div class="card-title">Gizli değişken modelleri</div><div class="card-body">VAE'ler varyasyonel yaklaşım kullanır, ama MCMC varyantları (örn. MCMC-VAE, difüzyon modellerinde skor tabanlı örnekleme) hızı yansızlıkla takas eder. Modern difüzyon örneklemesi, öğrenilmiş bir enerji üzerinde Langevin / tavlanmış MCMC olarak görülebilir.</div><div class="card-formula">x ~ p<sub>θ</sub>(x | z)</div></div>
</div>

<div class="l-note"><strong>Derin öğrenmeye köprü</strong>: Hamiltonyen Monte Carlo (HMC), rastgele yürüyüş önerisini ∇<sub>θ</sub> log π(θ) gradyanı tarafından yönlendirilen bir öneri ile değiştirir. Bayes sinir ağları için bu esasen gürültülü gradyan inişidir — SGD ile aynı makine, ama sana bir nokta tahmini yerine tam posterioru verir. Stochastic-gradient Langevin dynamics (SGLD) ve stochastic-gradient HMC, MCMC'yi mini-batch'li derin öğrenmeye taşır.</div>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynanacak yerler:</strong> <code>metropolis()</code> içindeki <code>sigma</code>'yı 0.1, 0.5, 1.2, 3.0 olarak değiştir ve kabul oranı ile ESS'in nasıl değiştiğini izle. Çok küçük adımlar %95 kabul ama küçücük ESS verir; çok büyük adımlar %5 kabul verir ve zincir her yirmi iterasyonda bir zıplar. Bu hedef için tatlı nokta <em>σ = 1.2</em> civarındadır, ünlü 0.234 kuralına yakın. Gibbs örnekleyicide <em>ρ = 0.99</em> dene ve koordinat bazlı güncellemelerin yarı-dejenere sırtta ne kadar zorlandığını izle — bu, Hamiltonyen Monte Carlo'yu motive eden başarısızlık modudur.</p>

<div class="calc-graph"><div id="plot-l3-banana-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> muz şeklindeki hedef üzerinde 5000 Metropolis-Hastings örneği. İşaretçi rengi adım numarasını kodlar (koyu = erken, parlak = geç); zincir orijinden başlar ve kıvrımlı vadiyi doldurmak üzere yayılır. Sırtı nasıl izlediğine dikkat et — zincir korelasyonludur, i.i.d. değildir, ama desteğin <em>marjinal</em> kapsamı doğrudur. Bu, tam olarak önemli örneklemeyi yenen geometri türüdür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=99;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=Math.max(rng(),1e-9),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function logp(x,y){return -0.5*(x*x/4 + (y - x*x/4)*(y - x*x/4));}
var x=0,y=0,lp=logp(x,y),xs=[],ys=[],ts=[],sigma=1.2;
for(var t=0;t<5000;t++){var xn=x+sigma*randn(),yn=y+sigma*randn();var lpn=logp(xn,yn);if(Math.log(rng())<lpn-lp){x=xn;y=yn;lp=lpn;}if(t%2===0){xs.push(x);ys.push(y);ts.push(t);}}
var d1={x:xs,y:ys,mode:'markers',name:'M-H örnekleri',marker:{color:ts,colorscale:'Viridis',size:4,opacity:0.6,colorbar:{title:'adım',thickness:10,len:0.8}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-7,7]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,12]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-banana-tr',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l3-trace-tr" class="plotly-graph" style="height:320px"></div><div class="graph-caption"><strong>İz grafiği:</strong> M-H zincirinin birinci koordinatı <em>x<sub>t</sub></em>, adım numarasına karşı çizilmiş. Kısa bir burn-in sonrası iz durağan hale gelir (yukarı veya aşağı trend yok) ve muz vadisinin iki yarısı arasında salınır. "İyi" bir iz grafiği tüylü tırtıl gibi görünür — tam olarak burada görüyorsun.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=99;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=Math.max(rng(),1e-9),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function logp(x,y){return -0.5*(x*x/4 + (y - x*x/4)*(y - x*x/4));}
var x=0,y=0,lp=logp(x,y),xs=[],ts=[],sigma=1.2;
for(var t=0;t<5000;t++){var xn=x+sigma*randn(),yn=y+sigma*randn();var lpn=logp(xn,yn);if(Math.log(rng())<lpn-lp){x=xn;y=yn;lp=lpn;}xs.push(x);ts.push(t);}
var d1={x:ts,y:xs,mode:'lines',name:'x_t',line:{color:'#3b82f6',width:1.1}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'adım t',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'x koordinatı',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-trace-tr',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l3-acf-tr" class="plotly-graph" style="height:320px"></div><div class="graph-caption"><strong>Otokorelasyon fonksiyonu:</strong> k = 0, …, 80 lagleri için ρ(k) = Korr(x<sub>t</sub>, x<sub>t+k</sub>). 1'den (mükemmel öz-korelasyon) başlar ve sonra azalır. Yavaş azalma, ardışık örneklerin yüksek oranda yedek olduğunu, dolayısıyla etkili örnek boyutu ESS = N / (1 + 2·Σρ)'nin N'den çok küçük olduğunu gösterir. Öneride σ'yı ayarlamak bu eğriyi kaydırır — daha geniş öneriler daha hızlı azalır ama daha düşük kabul oranıyla.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=99;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=Math.max(rng(),1e-9),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function logp(x,y){return -0.5*(x*x/4 + (y - x*x/4)*(y - x*x/4));}
var x=0,y=0,lp=logp(x,y),xs=[],sigma=1.2;
for(var t=0;t<8000;t++){var xn=x+sigma*randn(),yn=y+sigma*randn();var lpn=logp(xn,yn);if(Math.log(rng())<lpn-lp){x=xn;y=yn;lp=lpn;}if(t>=2000)xs.push(x);}
var m=xs.reduce(function(a,b){return a+b;},0)/xs.length;var c=xs.map(function(v){return v-m;});var v=c.reduce(function(a,b){return a+b*b;},0)/c.length;
var ks=[],rs=[];for(var k=0;k<=80;k++){var s=0;for(var i=0;i<c.length-k;i++)s+=c[i]*c[i+k];rs.push(s/((c.length-k)*v));ks.push(k);}
var d1={x:ks,y:rs,mode:'lines+markers',name:'ρ(k)',line:{color:'#3b82f6',width:2},marker:{size:5}};
var d2={x:[0,80],y:[0,0],mode:'lines',name:'sıfır',line:{color:'#9ca3af',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'lag k',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'otokorelasyon ρ(k)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.2,1.05]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-acf-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">13. Özet &amp; Artık Yapabileceklerin</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Temel problem</div><div class="card-body">Bayes çıkarımı işlenemez posteriorlar altında beklentilere indirgenir. Doğrudan integrasyon boyutluluk lanetinde ölür.</div><div class="card-formula">E<sub>p</sub>[f(X)]</div></div>
<div class="calc-card"><div class="card-title">Vanilla MC</div><div class="card-body">i.i.d. çekimler üzerinde ortalama. Hata <em>O(1/√N)</em>, boyuttan bağımsız. Monte Carlo'nun nihayetinde kazanmasının nedeni.</div><div class="card-formula">hata ∝ σ<sub>f</sub>/√N</div></div>
<div class="calc-card"><div class="card-title">Önemli örnekleme</div><div class="card-body"><em>q</em>'dan örnekle, <em>p/q</em> ile ağırlıklandır. Öneri hedefi kaçırırsa varyans patlar. Yüksek boyutta başarısız olur.</div><div class="card-formula">Σf(x<sub>i</sub>)p(x<sub>i</sub>)/q(x<sub>i</sub>)/N</div></div>
<div class="calc-card"><div class="card-title">Red örnekleme</div><div class="card-body">Zarf <em>p ≤ M·q</em>, olasılık <em>p/(M·q)</em> ile kabul. Kabul oranı <em>1/M</em>, <em>d</em> ile üstel olarak azalır.</div><div class="card-formula">Pr[kabul] = 1/M</div></div>
<div class="calc-card"><div class="card-title">MCMC ana fikri</div><div class="card-body">Durağan dağılımı = hedef olan zincir kur. Yalnızca <em>p̃ = Z·p</em> gerekir. Maliyet <em>d</em>'de polinomsal.</div><div class="card-formula">π·P = π</div></div>
<div class="calc-card"><div class="card-title">Ayrıntılı denge</div><div class="card-body">π(x)P(x→y) = π(y)P(y→x) ⇒ π durağan. Metropolis-Hastings'in inşa yoluyla zorladığı yeterli koşul.</div><div class="card-formula">akış x→y = akış y→x</div></div>
<div class="calc-card"><div class="card-title">Metropolis-Hastings</div><div class="card-body">α = min{1, [π(y)q(x|y)] / [π(x)q(y|x)]}. Normalize edici yok olur. <em>p̃</em>'den örnekleme için evrensel algoritma.</div><div class="card-formula">α = min{1, oran}</div></div>
<div class="calc-card"><div class="card-title">Gibbs örnekleme</div><div class="card-body">Her bileşeni tam koşullusundan örnekle. α = 1 ile M-H. Koşullular eşlenik olduğunda kolay; korelasyonlu hedeflerde zorlanır.</div><div class="card-formula">x<sub>i</sub> ~ p(x<sub>i</sub> | x<sub>−i</sub>)</div></div>
<div class="calc-card"><div class="card-title">Yakınsama tanıları</div><div class="card-body">İz grafikleri (durağan mı?), otokorelasyon (karışım hızı?), zincirler arası R-hat (çok modlu mu?), ESS (etkili bilgi?). Dördü de, her zaman.</div><div class="card-formula">R̂ &lt; 1.01, ESS ≫ 100</div></div>
<div class="calc-card"><div class="card-title">AI kullanımları</div><div class="card-body">Bayes NN'ler, RLHF ödül modelleme, LDA konu modelleri, difüzyon model örneklemesi. Posteriorun önem taşıdığı her yerde MCMC saklıdır.</div><div class="card-formula">posterior → MCMC</div></div>
</div>

<div class="l-warn"><strong>Sıradaki (Ders 4):</strong> kağıt üstü örneklemeden <strong>gerçek Bayes hesabına</strong> geçiyoruz — Hamiltonyen Monte Carlo, No-U-Turn Sampler (NUTS) ve Stan, PyMC ile modern Bayes derin öğrenmesine güç veren varyasyonel alternatifler (ortalama-alan VI, normalize edici akışlar). 7. bölümde gördüğün ayrıntılı denge ispatı tüm alanın temeli haline geliyor.</p>`

};
