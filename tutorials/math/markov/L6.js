window.MARKOV_L6 = {

en: `<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Quantify aleatoric vs epistemic uncertainty in neural network predictions</li>
<li>Apply Monte Carlo dropout as a cheap Bayesian approximation</li>
<li>Train deep ensembles and reliability-calibrate them with temperature scaling</li>
<li>Understand RLHF reward modeling as Bayesian preference aggregation</li>
<li>See diffusion sampling as annealed Langevin / MCMC</li>
<li>Use Bayesian optimization for hyperparameter tuning</li>
</ul></div>

<h2 class="lesson-title">1. Why Uncertainty Matters in AI</h2>
<p class="l-text">A point prediction tells you what the model thinks. A distribution tells you how sure it is. For medical diagnosis, autonomous driving, scientific ML and safety-critical systems, "I don't know" is a valid — sometimes required — output.</p>
<p class="l-text">Two flavors of uncertainty matter:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aleatoric (data)</div><p>Irreducible by more data. A coin flip is fundamentally uncertain. Image labels disagreed on by experts. Sensor noise floor.</p></div>
<div class="calc-card"><div class="card-title">Epistemic (model)</div><p>Reducible with more data. Model hasn't seen this regime. Out-of-distribution inputs trigger high epistemic uncertainty. Active learning targets these.</p></div>
</div>
<p class="l-text">Modern deep nets typically capture neither well — they produce overconfident point predictions. Kendall & Gal 2017 (<em>What Uncertainties Do We Need in Bayesian Deep Learning for Computer Vision?</em>) gave the first clean separation in practice.</p>

<h2 class="lesson-title">2. Bayesian Neural Networks — Setup</h2>
<p class="l-text">Treat weights as random variables. Instead of a point estimate $w^\\ast$, maintain a posterior $p(w \\mid \\mathcal{D})$. The predictive distribution marginalizes over weights:</p>
$$p(y \\mid x, \\mathcal{D}) = \\int p(y \\mid x, w)\\, p(w \\mid \\mathcal{D})\\, dw$$
<p class="l-text">Three practical approaches:</p>
<ul>
<li><strong>MCMC</strong> (Lessons 3-4): asymptotically exact, slow. Hard to scale beyond 100M parameters.</li>
<li><strong>Variational inference</strong> (Lesson 5): scales to deep nets via reparameterization, but biased by the chosen $q$ family.</li>
<li><strong>Ensembles</strong>: train multiple networks with different random seeds. Cheap, often the most practical option.</li>
</ul>

<h2 class="lesson-title">3. SGLD — Stochastic Gradient Langevin Dynamics</h2>
<p class="l-text">Welling & Teh (ICML 2011) injected Gaussian noise into stochastic gradient descent:</p>
$$w_{t+1} = w_t - \\eta_t \\nabla \\log p(w \\mid \\mathcal{D}) + \\sqrt{2\\eta_t}\\, \\varepsilon_t, \\qquad \\varepsilon_t \\sim \\mathcal{N}(0, I)$$
<p class="l-text">Under a decreasing schedule $\\sum \\eta_t = \\infty$, $\\sum \\eta_t^2 < \\infty$, the iterates converge in distribution to the posterior. This is gradient-based MCMC — bridges optimization and sampling. Modern variants: pSGLD (preconditioned, Li et al. 2016), SGHMC (Chen et al. 2014). Still challenging on foundation-model scale, but practical at 10-100M parameters.</p>

<h2 class="lesson-title">4. Bayes by Backprop (VI for BNNs)</h2>
<p class="l-text">Blundell et al. (ICML 2015) gave each weight its own posterior factor $q_\\phi(w_i) = \\mathcal{N}(\\mu_i, \\sigma_i^2)$. Train via reparameterized ELBO:</p>
$$\\mathcal{L}(\\phi) = \\mathbb{E}_{q_\\phi}[\\log p(\\mathcal{D} \\mid w)] - \\mathrm{KL}(q_\\phi(w) \\,\\|\\, p(w))$$
<p class="l-text">Sample $w \\sim q_\\phi$, do a forward pass, backpropagate through the sample. Each prediction is stochastic; predictive variance = uncertainty estimate. Doubles parameter count (need $\\mu$ AND $\\sigma$ per weight) — limits scalability.</p>

<h2 class="lesson-title">5. Monte Carlo Dropout — The Cheap Trick</h2>
<p class="l-text">Gal & Ghahramani (ICML 2016) showed dropout at inference time IS Bayesian inference with a specific approximate posterior. Keep dropout ACTIVE during prediction, do $K$ forward passes, compute mean and variance:</p>
$$\\hat{y}(x) = \\frac{1}{K}\\sum_{k=1}^K f_{w_k}(x), \\qquad \\hat{\\sigma}^2(x) = \\frac{1}{K}\\sum_{k=1}^K (f_{w_k}(x) - \\hat{y}(x))^2$$
<p class="l-text">Practical: 1-line change to any existing dropout-trained network — set the dropout flag to True at inference. Zero retraining. Often gives surprisingly calibrated uncertainty estimates. Caveat: theoretical guarantees rest on specific assumptions (Folgoc et al. 2021 raise concerns); in practice it works well as a quick baseline.</p>

<h2 class="lesson-title">6. Deep Ensembles</h2>
<p class="l-text">Lakshminarayanan et al. (NeurIPS 2017): train $K$ independent networks with different random seeds. Predict with mean ± std across the ensemble:</p>
$$p_{\\text{ens}}(y \\mid x) = \\frac{1}{K}\\sum_{k=1}^K p_{\\theta_k}(y \\mid x)$$
<p class="l-text">Ovadia et al. (NeurIPS 2019, <em>Can You Trust Your Model's Uncertainty?</em>) tested 7 methods on dataset shift. Deep ensembles consistently won — beating BNNs, MC dropout, calibrated softmax. Why: SGD with different seeds finds genuinely different modes of the loss landscape, capturing multimodal posteriors that mean-field Gaussian VI cannot. Cost: $K \\times$ memory & compute. Typical $K = 5$ suffices for good results.</p>

<h2 class="lesson-title">7. Calibration & Reliability Diagrams</h2>
<p class="l-text">A model is <strong>calibrated</strong> if its confidence matches its accuracy: when it says "70% confident", it should be right 70% of the time. Reliability diagram: bin predictions by confidence, plot bin-average confidence vs bin-average accuracy. Diagonal = perfect.</p>
<p class="l-text">Guo et al. (ICML 2017, <em>On Calibration of Modern Neural Networks</em>) showed modern DNNs are typically <strong>overconfident</strong>. Fix: <strong>temperature scaling</strong>. Divide logits by $T > 1$:</p>
$$p_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}$$
<p class="l-text">Find $T$ that minimizes NLL on a held-out validation set. Single parameter, post-hoc, no architecture changes. Reduces ECE (Expected Calibration Error) by 5-10× in practice. Production ML pipelines apply this routinely.</p>

<h2 class="lesson-title">8. RLHF — Reinforcement Learning from Human Feedback</h2>
<p class="l-text">Christiano et al. (NeurIPS 2017), Ouyang et al. (NeurIPS 2022, <em>InstructGPT</em>). Three stages:</p>
<ol>
<li><strong>SFT</strong>: supervised fine-tune base LLM on demonstration data.</li>
<li><strong>Reward model</strong>: humans rank pairs $(y_a, y_b)$ for prompts $x$. Train $R_\\phi(x, y)$ via Bradley-Terry:</li>
</ol>
$$P(y_a \\succ y_b \\mid x) = \\sigma(R_\\phi(x, y_a) - R_\\phi(x, y_b))$$
<ol start="3">
<li><strong>PPO</strong>: optimize the LLM policy $\\pi_\\theta$ to maximize $\\mathbb{E}_\\pi[R_\\phi(x, y)] - \\beta\\, \\mathrm{KL}(\\pi_\\theta \\,\\|\\, \\pi_{\\text{ref}})$.</li>
</ol>
<p class="l-text">The reward model is a Bayesian preference aggregator — averaging diverse human judgments into a single utility signal. Without uncertainty quantification, <strong>reward hacking</strong> (over-optimizing past the validity range of the reward model) is a major risk. Recent work: DPO (Rafailov 2023) avoids the reward model entirely; KTO, IPO, ORPO are further variants. Constitutional AI (Anthropic 2022) replaces human raters with model self-critique.</p>

<h2 class="lesson-title">9. Diffusion Models as Annealed MCMC</h2>
<p class="l-text">Score-based generative models (Song & Ermon NeurIPS 2019, Song et al. ICLR 2021) sample via Langevin dynamics on the data distribution's score $\\nabla \\log p(x)$:</p>
$$x_{t+1} = x_t + \\frac{\\eta}{2}\\, s_\\theta(x_t, t) + \\sqrt{\\eta}\\, \\varepsilon_t$$
<p class="l-text">where $s_\\theta(x, t) \\approx \\nabla_x \\log p_t(x)$ is a learned neural network. <strong>This is literally MCMC.</strong> The reverse SDE of diffusion (Song 2021) is annealed Langevin sampling through a sequence of smoothed distributions $p_{\\sigma_T} \\to p_{\\sigma_{T-1}} \\to \\cdots \\to p_{\\text{data}}$, with $\\sigma$ decreasing toward zero.</p>
<p class="l-text">DDPM (Ho et al. 2020), Score-SDE (Song 2021), EDM (Karras et al. 2022), Flow Matching (Lipman et al. 2023): all variants of this MCMC-on-data-manifold idea. Stable Diffusion = latent diffusion (Rombach 2022). Sora = diffusion on video patches. The "magic" is just principled probabilistic sampling guided by a learned score function.</p>

<h2 class="lesson-title">10. Bayesian Optimization for Hyperparameters</h2>
<p class="l-text">Hyperparameter tuning as Bayesian inference. Place a Gaussian Process (GP) prior over $f(\\lambda) = $ validation loss. After each trial $(\\lambda_i, \\ell_i)$, update GP posterior $p(f \\mid \\mathcal{D}_i)$. Pick the next trial by maximizing an <strong>acquisition function</strong>:</p>
<ul>
<li><strong>Expected Improvement (EI)</strong>: $\\alpha_{\\text{EI}}(\\lambda) = \\mathbb{E}_{f \\sim p(\\cdot \\mid \\mathcal{D})}[\\max(0, f^\\ast - f(\\lambda))]$ — exploit known good regions.</li>
<li><strong>UCB</strong>: $\\alpha_{\\text{UCB}}(\\lambda) = \\mu(\\lambda) + \\kappa\\, \\sigma(\\lambda)$ — explicit explore-exploit trade-off via $\\kappa$.</li>
<li><strong>Thompson Sampling</strong>: sample $\\tilde{f} \\sim p(f \\mid \\mathcal{D})$, pick $\\lambda = \\arg\\min \\tilde{f}$ — implicit exploration.</li>
</ul>
<p class="l-text">Used in Google Vizier, SigOpt, Ax, BoTorch, Optuna. 10-100× more sample-efficient than random search for expensive black-box functions. Critical for AutoML.</p>

<h2 class="lesson-title">11. Probabilistic Programming Languages (PPLs)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pyro / NumPyro</div><p>PyTorch / JAX backbone. Built at Uber, now Meta. NUTS + JAX gives blazing fast posterior inference. Best for deep Bayesian models and modern ML.</p></div>
<div class="calc-card"><div class="card-title">Stan</div><p>The statistician's favorite. Mature, well-tested, beautiful syntax. Best for traditional hierarchical Bayesian models, marketing-mix, clinical trials.</p></div>
<div class="calc-card"><div class="card-title">PyMC</div><p>Pythonic, gentle learning curve. Built on PyTensor (PyTorch-like). Best for prototyping and education.</p></div>
<div class="calc-card"><div class="card-title">TensorFlow Probability</div><p>Google's ecosystem. Edward2 syntax. Tight TF/Keras integration. Used in DeepMind, AlphaFold for uncertainty modeling.</p></div>
</div>

<h2 class="lesson-title">12. Open Problems & Future</h2>
<p class="l-text">Scaling Bayesian methods to foundation models (100B+ parameters) is an active research front:</p>
<ul>
<li><strong>LoRA-Bayes</strong> (Yang et al. 2024): treat only LoRA adapters as random, freeze base weights. Cheap Bayesian fine-tuning.</li>
<li><strong>LLM calibration</strong> (Lin et al. 2024, <em>Generating with Confidence</em>): self-reported confidence vs actual accuracy in LLMs. Most LLMs over-report confidence in their answers.</li>
<li><strong>Uncertainty for agentic systems</strong>: when should an agent ask for clarification vs commit? Active research.</li>
<li><strong>Conformal prediction</strong> (Vovk, Shafer): distribution-free uncertainty sets with finite-sample coverage guarantees. Increasingly applied to LLMs.</li>
</ul>
<p class="l-text">As LLMs make consequential decisions in medicine, law, autonomous systems — knowing-what-you-don't-know transitions from optional to mandatory.</p>

<h2 class="lesson-title">13. Pyodide Lab — MC Dropout for Uncertainty</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.seed(<span class="num">0</span>)

<span class="cm"># 1D toy regression with a gap in training data</span>
X_train = np.concatenate([np.linspace(-<span class="num">3</span>, -<span class="num">1</span>, <span class="num">30</span>), np.linspace(<span class="num">1</span>, <span class="num">3</span>, <span class="num">30</span>)])
y_train = np.sin(X_train) + <span class="num">0.05</span>*np.random.randn(<span class="num">60</span>)

<span class="cm"># Tiny MLP with manual dropout (NumPy only)</span>
H = <span class="num">32</span>
W1 = np.random.randn(<span class="num">1</span>, H) * <span class="num">0.5</span>
b1 = np.zeros(H)
W2 = np.random.randn(H, <span class="num">1</span>) * <span class="num">0.3</span>
b2 = np.zeros(<span class="num">1</span>)

<span class="kw">def</span> forward(x, drop_mask=<span class="kw">None</span>):
    h = np.tanh(x[:, <span class="kw">None</span>] @ W1 + b1)
    <span class="kw">if</span> drop_mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        h = h * drop_mask
    <span class="kw">return</span> (h @ W2 + b2).ravel()

<span class="cm"># Simple training loop (illustrative; would use real backprop in practice)</span>
lr = <span class="num">0.05</span>
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>):
    pred = forward(X_train)
    err = (pred - y_train) / <span class="num">60</span>
    grad_W2 = (np.tanh(X_train[:, <span class="kw">None</span>] @ W1 + b1)).T @ err[:, <span class="kw">None</span>]
    grad_b2 = err.sum()
    W2 -= lr * grad_W2
    b2 -= lr * grad_b2

<span class="cm"># MC dropout at test time: K=50 forward passes with random masks</span>
X_test = np.linspace(-<span class="num">4</span>, <span class="num">4</span>, <span class="num">200</span>)
preds = []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    mask = (np.random.rand(H) &gt; <span class="num">0.3</span>).astype(<span class="ty">float</span>) / <span class="num">0.7</span>
    preds.append(forward(X_test, drop_mask=mask))
preds = np.array(preds)
mean_pred = preds.mean(axis=<span class="num">0</span>)
std_pred = preds.std(axis=<span class="num">0</span>)

<span class="fn">print</span>(<span class="str">"Predictive mean at x=0 (in gap):"</span>, mean_pred[<span class="num">100</span>].round(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Std at x=0 (high uncertainty):"</span>, std_pred[<span class="num">100</span>].round(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Std at x=-2 (in data, low):"</span>, std_pred[<span class="num">50</span>].round(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Std at x=4 (far OOD):"</span>, std_pred[<span class="num">199</span>].round(<span class="num">3</span>))</code></pre></div>

<div id="plot-l6-mcdropout-en" style="height:380px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];var lo=[];var hi=[];
for(var i=0;i<200;i++){var x=-4+i*0.04;xs.push(x);
  var y=Math.sin(x);
  ys.push(y);
  var unc=(Math.abs(x)<1||Math.abs(x)>3)?0.3+0.5*Math.max(0,Math.abs(x)-3):0.05;
  lo.push(y-2*unc);hi.push(y+2*unc);}
var Xtrain1=[],Ytrain1=[],Xtrain2=[],Ytrain2=[];
for(var i=0;i<30;i++){var x=-3+i*0.07;Xtrain1.push(x);Ytrain1.push(Math.sin(x)+0.05*(Math.random()-0.5));}
for(var i=0;i<30;i++){var x=1+i*0.07;Xtrain2.push(x);Ytrain2.push(Math.sin(x)+0.05*(Math.random()-0.5));}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'x',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'y',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-mcdropout-en',[
{x:xs.concat(xs.slice().reverse()),y:hi.concat(lo.slice().reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'transparent'},name:'2 sigma band',hoverinfo:'skip'},
{x:xs,y:ys,name:'predictive mean',line:{color:'#3b82f6',width:2}},
{x:Xtrain1.concat(Xtrain2),y:Ytrain1.concat(Ytrain2),mode:'markers',name:'training data',marker:{color:'#f97316',size:5}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div id="plot-l6-calib-en" style="height:340px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var conf=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
var perfect=conf.slice();
var overconf=[0.05,0.12,0.20,0.28,0.36,0.46,0.55,0.66,0.78,0.88];
var underconf=[0.10,0.22,0.34,0.46,0.58,0.66,0.74,0.82,0.90,0.97];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'predicted confidence',color:'#e8e8e8',gridcolor:'#222',range:[0,1]},
yaxis:{title:'actual accuracy',color:'#e8e8e8',gridcolor:'#222',range:[0,1]},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-calib-en',[
{x:conf,y:perfect,name:'perfect calibration',line:{color:'#888',dash:'dash'}},
{x:conf,y:overconf,name:'overconfident DNN',line:{color:'#ec4899'},mode:'lines+markers'},
{x:conf,y:underconf,name:'after temperature scaling',line:{color:'#3b82f6'},mode:'lines+markers'}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div id="plot-l6-ensemble-en" style="height:340px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var m1=[];var m2=[];var m3=[];var ens=[];
for(var i=0;i<200;i++){var x=-4+i*0.04;xs.push(x);
  m1.push(Math.sin(x)+0.1*Math.sin(3*x));
  m2.push(Math.sin(x)-0.1*Math.sin(2*x));
  m3.push(Math.sin(x)+0.08*Math.cos(2*x));
  ens.push((m1[i]+m2[i]+m3[i])/3);}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'x',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'y',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-ensemble-en',[
{x:xs,y:m1,name:'model 1',line:{color:'#888',width:1}},
{x:xs,y:m2,name:'model 2',line:{color:'#aaa',width:1}},
{x:xs,y:m3,name:'model 3',line:{color:'#ccc',width:1}},
{x:xs,y:ens,name:'ensemble mean',line:{color:'#3b82f6',width:3}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div id="plot-l6-rlhf-en" style="height:280px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var iters=[];var sft=[];var rlhf=[];var reward=[];
for(var i=0;i<50;i++){iters.push(i);
  sft.push(0.55+0.0001*i);
  rlhf.push(0.55+0.005*i*Math.exp(-i*0.05)+0.25*(1-Math.exp(-i*0.1)));
  reward.push(0.3+0.6*(1-Math.exp(-i*0.08)));}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'PPO iteration',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'win rate / reward',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-rlhf-en',[
{x:iters,y:sft,name:'SFT baseline',line:{color:'#888',dash:'dash'}},
{x:iters,y:rlhf,name:'RLHF win rate vs SFT',line:{color:'#ec4899'}},
{x:iters,y:reward,name:'mean reward',line:{color:'#3b82f6'}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div id="plot-l6-langevin-en" style="height:340px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=2.5,y=-1.5;var xs=[],ys=[];
for(var i=0;i<400;i++){
  xs.push(x);ys.push(y);
  var gx=-0.3*x;var gy=-0.3*y;
  x=x+0.05*gx+0.2*(Math.random()-0.5);
  y=y+0.05*gy+0.2*(Math.random()-0.5);}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'x_1',color:'#e8e8e8',gridcolor:'#222',range:[-3.5,3.5]},
yaxis:{title:'x_2',color:'#e8e8e8',gridcolor:'#222',range:[-3.5,3.5]},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-langevin-en',[
{x:xs,y:ys,mode:'lines+markers',marker:{color:xs.map(function(_,i){return i}),colorscale:'Viridis',size:3,showscale:false},line:{color:'rgba(59,130,246,0.4)',width:1},name:'Langevin trajectory'}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<p class="l-text"><strong>This is the capstone of the Markov & MCMC track.</strong> From discrete Markov chains (L1) to HMMs (L2), Metropolis-Hastings (L3), Hamiltonian Monte Carlo (L4), variational inference (L5), to modern Bayesian deep learning — the through-line is: <em>turn intractable integrals into tractable computation, either by sampling or by optimization, while honestly quantifying uncertainty</em>. Modern AI — VAEs, diffusion, RLHF, LoRA-Bayes — all build on this foundation.</p>
`,

tr: `<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sinir ağı tahminlerinde aleatoric vs epistemic belirsizliği nicelendirmeyi</li>
<li>Monte Carlo dropout'u ucuz bir Bayesçi yaklaşım olarak uygulamayı</li>
<li>Derin toplulukları (deep ensembles) eğitip sıcaklık ölçeklemesi ile kalibre etmeyi</li>
<li>RLHF ödül modellemesini Bayesçi tercih toplama olarak anlamayı</li>
<li>Diffusion örneklemesinin tavlanmış Langevin / MCMC olduğunu</li>
<li>Hiperparametre ayarlamasında Bayesçi optimizasyon kullanmayı</li>
</ul></div>

<h2 class="lesson-title">1. AI'da Belirsizlik Neden Önemli?</h2>
<p class="l-text">Nokta tahmini modelin ne düşündüğünü söyler. Dağılım ne kadar emin olduğunu söyler. Tıbbi tanı, otonom sürüş, bilimsel ML ve güvenlik-kritik sistemler için "bilmiyorum" geçerli — bazen zorunlu — bir çıktıdır.</p>
<p class="l-text">İki belirsizlik türü önemlidir:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aleatoric (veri)</div><p>Daha fazla veri ile azalmaz. Yazı-tura temelden belirsizdir. Uzmanların aynı görüntüye farklı etiket verdiği durumlar. Sensör gürültü tabanı.</p></div>
<div class="calc-card"><div class="card-title">Epistemic (model)</div><p>Daha fazla veri ile azalır. Model bu bölgeyi henüz görmedi. Dağılım-dışı girdiler yüksek epistemic belirsizlik tetikler. Aktif öğrenme bunları hedef alır.</p></div>
</div>
<p class="l-text">Modern derin ağlar hiçbirini iyi yakalayamaz — aşırı güvenli nokta tahminleri üretirler. Kendall ve Gal (2017) ilk pratik ayrımı verdi.</p>

<h2 class="lesson-title">2. Bayesçi Sinir Ağları — Kurulum</h2>
<p class="l-text">Ağırlıkları rastgele değişken olarak ele al. Nokta tahmini $w^\\ast$ yerine posterior $p(w \\mid \\mathcal{D})$ tut. Tahmini dağılım ağırlıklar üzerinden marjinalleşir:</p>
$$p(y \\mid x, \\mathcal{D}) = \\int p(y \\mid x, w)\\, p(w \\mid \\mathcal{D})\\, dw$$
<p class="l-text">Üç pratik yaklaşım:</p>
<ul>
<li><strong>MCMC</strong> (Ders 3-4): asimptotik olarak kesin, yavaş. 100M parametrenin ötesinde zor.</li>
<li><strong>Varyasyonel çıkarım</strong> (Ders 5): yeniden parametreleme ile derin ağlara ölçeklenir, seçilen $q$ ailesi tarafından yanlı.</li>
<li><strong>Topluluklar</strong>: farklı rastgele tohumlarla birden fazla ağı eğit. Ucuz, genellikle en pratik seçenek.</li>
</ul>

<h2 class="lesson-title">3. SGLD — Stokastik Gradyan Langevin Dinamikleri</h2>
<p class="l-text">Welling ve Teh (ICML 2011) stokastik gradyan inişine Gauss gürültüsü enjekte etti:</p>
$$w_{t+1} = w_t - \\eta_t \\nabla \\log p(w \\mid \\mathcal{D}) + \\sqrt{2\\eta_t}\\, \\varepsilon_t, \\qquad \\varepsilon_t \\sim \\mathcal{N}(0, I)$$
<p class="l-text">Azalan bir programla ($\\sum \\eta_t = \\infty$, $\\sum \\eta_t^2 < \\infty$), iterasyonlar dağılım olarak posteriora yakınsar. Bu gradyan-tabanlı MCMC'dir — optimizasyon ve örneklemeyi köprüler. Modern varyantlar: pSGLD (Li et al. 2016), SGHMC (Chen et al. 2014). Temel-model ölçeğinde hâlâ zor, ama 10-100M parametre düzeyinde pratiktir.</p>

<h2 class="lesson-title">4. Bayes by Backprop (BNN için VI)</h2>
<p class="l-text">Blundell et al. (ICML 2015) her ağırlığa kendi posterior faktörünü verdi: $q_\\phi(w_i) = \\mathcal{N}(\\mu_i, \\sigma_i^2)$. Yeniden parametreli ELBO ile eğit:</p>
$$\\mathcal{L}(\\phi) = \\mathbb{E}_{q_\\phi}[\\log p(\\mathcal{D} \\mid w)] - \\mathrm{KL}(q_\\phi(w) \\,\\|\\, p(w))$$
<p class="l-text">$w \\sim q_\\phi$ örnekle, ileri geçiş yap, örnek üzerinden geriye yayılım. Her tahmin stokastik; tahmin varyansı = belirsizlik tahmini. Parametre sayısını iki katına çıkarır (her ağırlık için $\\mu$ VE $\\sigma$ gerekli) — ölçeklenebilirliği sınırlar.</p>

<h2 class="lesson-title">5. Monte Carlo Dropout — Ucuz Hile</h2>
<p class="l-text">Gal ve Ghahramani (ICML 2016), çıkarım zamanında dropout'un belirli bir yaklaşık posteriorlu Bayesçi çıkarım olduğunu gösterdi. Tahmin sırasında dropout'u AKTİF tut, $K$ ileri geçiş yap, ortalama ve varyansı hesapla:</p>
$$\\hat{y}(x) = \\frac{1}{K}\\sum_{k=1}^K f_{w_k}(x), \\qquad \\hat{\\sigma}^2(x) = \\frac{1}{K}\\sum_{k=1}^K (f_{w_k}(x) - \\hat{y}(x))^2$$
<p class="l-text">Pratik: mevcut herhangi bir dropout ile eğitilmiş ağa 1 satır değişiklik — çıkarımda dropout bayrağını True yap. Sıfır yeniden eğitim. Sıklıkla şaşırtıcı derecede kalibre belirsizlik tahminleri verir. Uyarı: teorik garantiler belirli varsayımlara dayanır (Folgoc et al. 2021 endişe dile getirir); pratikte hızlı bir taban çizgisi olarak iyi çalışır.</p>

<h2 class="lesson-title">6. Derin Topluluklar (Deep Ensembles)</h2>
<p class="l-text">Lakshminarayanan et al. (NeurIPS 2017): farklı rastgele tohumlarla $K$ bağımsız ağ eğit. Topluluk ortalaması ± std ile tahmin et:</p>
$$p_{\\text{ens}}(y \\mid x) = \\frac{1}{K}\\sum_{k=1}^K p_{\\theta_k}(y \\mid x)$$
<p class="l-text">Ovadia et al. (NeurIPS 2019) 7 yöntemi veri seti kayması altında test etti. Derin topluluklar tutarlı bir şekilde kazandı — BNN, MC dropout, kalibre softmax'i geçti. Neden: farklı tohumlarla SGD kayıp manzarasının gerçekten farklı modlarını bulur, mean-field Gauss VI'nın yakalayamadığı çok modlu posteriorları yakalar. Maliyet: $K \\times$ bellek ve hesap. Tipik $K = 5$ iyi sonuç için yeterli.</p>

<h2 class="lesson-title">7. Kalibrasyon ve Güvenilirlik Diyagramları</h2>
<p class="l-text">Bir model <strong>kalibre</strong>dir, güveni doğruluğuyla eşleştiğinde: "%70 emin" derken %70 oranında doğru olmalı. Güvenilirlik diyagramı: tahminleri güvene göre gruplara böl, grup-ortalama güvene karşı grup-ortalama doğruluğu çiz. Köşegen = mükemmel.</p>
<p class="l-text">Guo et al. (ICML 2017) modern DNN'lerin tipik olarak <strong>aşırı güvenli</strong> olduğunu gösterdi. Düzeltme: <strong>sıcaklık ölçekleme</strong>. Logit'leri $T > 1$ ile böl:</p>
$$p_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}$$
<p class="l-text">Tutulan doğrulama setinde NLL'yi minimize eden $T$'yi bul. Tek parametre, son-tahminde uygulanır, mimari değişikliği gerekmez. ECE (Beklenen Kalibrasyon Hatası) pratikte 5-10× azalır. Üretim ML boru hatları bunu rutin uygular.</p>

<h2 class="lesson-title">8. RLHF — İnsan Geri Bildiriminden Pekiştirmeli Öğrenme</h2>
<p class="l-text">Christiano et al. (NeurIPS 2017), Ouyang et al. (NeurIPS 2022, <em>InstructGPT</em>). Üç aşama:</p>
<ol>
<li><strong>SFT</strong>: baz LLM'i gösterim verisi üzerinde denetimli ince-ayarla.</li>
<li><strong>Ödül modeli</strong>: insanlar prompt $x$ için $(y_a, y_b)$ çiftlerini sıralar. Bradley-Terry ile $R_\\phi(x, y)$'yi eğit:</li>
</ol>
$$P(y_a \\succ y_b \\mid x) = \\sigma(R_\\phi(x, y_a) - R_\\phi(x, y_b))$$
<ol start="3">
<li><strong>PPO</strong>: LLM politikasını $\\pi_\\theta$ şu hedefi maksimize edecek şekilde optimize et: $\\mathbb{E}_\\pi[R_\\phi(x, y)] - \\beta\\, \\mathrm{KL}(\\pi_\\theta \\,\\|\\, \\pi_{\\text{ref}})$.</li>
</ol>
<p class="l-text">Ödül modeli BİR Bayesçi tercih toplayıcısıdır — çeşitli insan kararlarını tek bir fayda sinyaline ortalar. Belirsizlik nicelemesi olmadan, <strong>reward hacking</strong> (ödül modelinin geçerlilik aralığının ötesinde aşırı optimizasyon) büyük risktir. Son çalışmalar: DPO (Rafailov 2023) ödül modelinden tamamen kaçınır; KTO, IPO, ORPO ek varyantlar. Anayasal AI (Anthropic 2022) insan değerlendiricileri model öz-eleştirisi ile değiştirir.</p>

<h2 class="lesson-title">9. Diffusion Modeller Tavlanmış MCMC Olarak</h2>
<p class="l-text">Skor tabanlı üretici modeller (Song ve Ermon NeurIPS 2019, Song et al. ICLR 2021) veri dağılımının skoru $\\nabla \\log p(x)$ üzerinde Langevin dinamiği ile örnek alır:</p>
$$x_{t+1} = x_t + \\frac{\\eta}{2}\\, s_\\theta(x_t, t) + \\sqrt{\\eta}\\, \\varepsilon_t$$
<p class="l-text">Burada $s_\\theta(x, t) \\approx \\nabla_x \\log p_t(x)$ öğrenilmiş bir sinir ağıdır. <strong>Bu kelimenin tam anlamıyla MCMC.</strong> Diffusion'ın ters SDE'si (Song 2021), $\\sigma$ sıfıra doğru azaldıkça pürüzsüzleştirilmiş bir dağılım dizisi $p_{\\sigma_T} \\to p_{\\sigma_{T-1}} \\to \\cdots \\to p_{\\text{veri}}$ boyunca tavlanmış Langevin örneklemesidir.</p>
<p class="l-text">DDPM (Ho et al. 2020), Score-SDE (Song 2021), EDM (Karras et al. 2022), Flow Matching (Lipman et al. 2023): hepsi bu veri-manifoldu üzerinde MCMC fikrinin varyantları. Stable Diffusion = gizli diffusion (Rombach 2022). Sora = video yamaları üzerinde diffusion. "Sihir" sadece öğrenilmiş bir skor fonksiyonu tarafından yönlendirilen ilkeli olasılıksal örneklemedir.</p>

<h2 class="lesson-title">10. Hiperparametreler için Bayesçi Optimizasyon</h2>
<p class="l-text">Hiperparametre ayarlamasını Bayesçi çıkarım olarak kur. $f(\\lambda) = $ doğrulama kaybı üzerinde Gauss Süreç (GP) önseli koy. Her deneme $(\\lambda_i, \\ell_i)$ sonrası GP posterioru $p(f \\mid \\mathcal{D}_i)$ güncelle. Bir <strong>kazanım fonksiyonu</strong> maksimize ederek bir sonraki denemeyi seç:</p>
<ul>
<li><strong>Beklenen İyileşme (EI)</strong>: $\\alpha_{\\text{EI}}(\\lambda) = \\mathbb{E}_{f \\sim p(\\cdot \\mid \\mathcal{D})}[\\max(0, f^\\ast - f(\\lambda))]$ — bilinen iyi bölgeleri sömür.</li>
<li><strong>UCB</strong>: $\\alpha_{\\text{UCB}}(\\lambda) = \\mu(\\lambda) + \\kappa\\, \\sigma(\\lambda)$ — $\\kappa$ üzerinden açık keşif-sömürü dengesi.</li>
<li><strong>Thompson Örnekleme</strong>: $\\tilde{f} \\sim p(f \\mid \\mathcal{D})$ örnekle, $\\lambda = \\arg\\min \\tilde{f}$ seç — örtük keşif.</li>
</ul>
<p class="l-text">Google Vizier, SigOpt, Ax, BoTorch, Optuna kullanılır. Pahalı kara kutu fonksiyonları için rastgele aramadan 10-100× daha örnek-verimli. AutoML için kritik.</p>

<h2 class="lesson-title">11. Olasılıksal Programlama Dilleri (PPL'ler)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pyro / NumPyro</div><p>PyTorch / JAX omurgası. Uber'de oluşturuldu, şimdi Meta. NUTS + JAX hızlı posterior çıkarımı sağlar. Derin Bayesçi modeller ve modern ML için en iyi.</p></div>
<div class="calc-card"><div class="card-title">Stan</div><p>İstatistikçinin favorisi. Olgun, iyi test edilmiş, güzel sözdizimi. Geleneksel hiyerarşik Bayesçi modeller, pazarlama-karması, klinik denemeler için en iyi.</p></div>
<div class="calc-card"><div class="card-title">PyMC</div><p>Pythonic, yumuşak öğrenme eğrisi. PyTensor (PyTorch benzeri) üzerine kurulu. Prototipleme ve eğitim için en iyi.</p></div>
<div class="calc-card"><div class="card-title">TensorFlow Probability</div><p>Google ekosistemi. Edward2 sözdizimi. Sıkı TF/Keras entegrasyonu. DeepMind, AlphaFold'da belirsizlik modellemesi için kullanılır.</p></div>
</div>

<h2 class="lesson-title">12. Açık Problemler ve Gelecek</h2>
<p class="l-text">Bayesçi yöntemleri temel modellere (100B+ parametre) ölçeklemek aktif araştırma alanı:</p>
<ul>
<li><strong>LoRA-Bayes</strong> (Yang et al. 2024): sadece LoRA adaptörlerini rastgele ele al, baz ağırlıkları dondur. Ucuz Bayesçi ince-ayar.</li>
<li><strong>LLM kalibrasyonu</strong> (Lin et al. 2024): LLM'lerde öz-rapor güveni vs gerçek doğruluk. Çoğu LLM cevaplarındaki güveni aşırı bildirir.</li>
<li><strong>Ajansal sistemler için belirsizlik</strong>: bir ajan ne zaman açıklama istemeli, ne zaman taahhüt etmeli? Aktif araştırma.</li>
<li><strong>Konformal tahmin</strong> (Vovk, Shafer): sonlu-örnek kapsam garantili dağılım-bağımsız belirsizlik kümeleri. LLM'lere giderek daha fazla uygulanıyor.</li>
</ul>
<p class="l-text">LLM'ler tıp, hukuk, otonom sistemlerde önemli kararlar verirken — ne-bilmediğini-bilmek opsiyonelden zorunluya geçiyor.</p>

<h2 class="lesson-title">13. Pyodide Lab — Belirsizlik için MC Dropout</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.seed(<span class="num">0</span>)

<span class="cm"># Egitim verisinde bosluk olan 1D oyuncak regresyon</span>
X_train = np.concatenate([np.linspace(-<span class="num">3</span>, -<span class="num">1</span>, <span class="num">30</span>), np.linspace(<span class="num">1</span>, <span class="num">3</span>, <span class="num">30</span>)])
y_train = np.sin(X_train) + <span class="num">0.05</span>*np.random.randn(<span class="num">60</span>)

<span class="cm"># Manuel dropout ile minik MLP (sadece NumPy)</span>
H = <span class="num">32</span>
W1 = np.random.randn(<span class="num">1</span>, H) * <span class="num">0.5</span>
b1 = np.zeros(H)
W2 = np.random.randn(H, <span class="num">1</span>) * <span class="num">0.3</span>
b2 = np.zeros(<span class="num">1</span>)

<span class="kw">def</span> forward(x, drop_mask=<span class="kw">None</span>):
    h = np.tanh(x[:, <span class="kw">None</span>] @ W1 + b1)
    <span class="kw">if</span> drop_mask <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
        h = h * drop_mask
    <span class="kw">return</span> (h @ W2 + b2).ravel()

lr = <span class="num">0.05</span>
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>):
    pred = forward(X_train)
    err = (pred - y_train) / <span class="num">60</span>
    grad_W2 = (np.tanh(X_train[:, <span class="kw">None</span>] @ W1 + b1)).T @ err[:, <span class="kw">None</span>]
    grad_b2 = err.sum()
    W2 -= lr * grad_W2
    b2 -= lr * grad_b2

<span class="cm"># Test zamani MC dropout: rastgele mask ile K=50 ileri gecis</span>
X_test = np.linspace(-<span class="num">4</span>, <span class="num">4</span>, <span class="num">200</span>)
preds = []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    mask = (np.random.rand(H) &gt; <span class="num">0.3</span>).astype(<span class="ty">float</span>) / <span class="num">0.7</span>
    preds.append(forward(X_test, drop_mask=mask))
preds = np.array(preds)
mean_pred = preds.mean(axis=<span class="num">0</span>)
std_pred = preds.std(axis=<span class="num">0</span>)

<span class="fn">print</span>(<span class="str">"x=0 tahmin ortalama (boslukta):"</span>, mean_pred[<span class="num">100</span>].round(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"x=0 std (yuksek belirsizlik):"</span>, std_pred[<span class="num">100</span>].round(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"x=-2 std (veride, dusuk):"</span>, std_pred[<span class="num">50</span>].round(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"x=4 std (uzak OOD):"</span>, std_pred[<span class="num">199</span>].round(<span class="num">3</span>))</code></pre></div>

<div id="plot-l6-mcdropout-tr" style="height:380px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];var lo=[];var hi=[];
for(var i=0;i<200;i++){var x=-4+i*0.04;xs.push(x);
  var y=Math.sin(x);
  ys.push(y);
  var unc=(Math.abs(x)<1||Math.abs(x)>3)?0.3+0.5*Math.max(0,Math.abs(x)-3):0.05;
  lo.push(y-2*unc);hi.push(y+2*unc);}
var Xtrain1=[],Ytrain1=[],Xtrain2=[],Ytrain2=[];
for(var i=0;i<30;i++){var x=-3+i*0.07;Xtrain1.push(x);Ytrain1.push(Math.sin(x)+0.05*(Math.random()-0.5));}
for(var i=0;i<30;i++){var x=1+i*0.07;Xtrain2.push(x);Ytrain2.push(Math.sin(x)+0.05*(Math.random()-0.5));}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'x',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'y',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-mcdropout-tr',[
{x:xs.concat(xs.slice().reverse()),y:hi.concat(lo.slice().reverse()),fill:'toself',fillcolor:'rgba(59,130,246,0.18)',line:{color:'transparent'},name:'2 sigma bandi',hoverinfo:'skip'},
{x:xs,y:ys,name:'tahmin ortalamasi',line:{color:'#3b82f6',width:2}},
{x:Xtrain1.concat(Xtrain2),y:Ytrain1.concat(Ytrain2),mode:'markers',name:'egitim verisi',marker:{color:'#f97316',size:5}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div id="plot-l6-calib-tr" style="height:340px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var conf=[0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
var perfect=conf.slice();
var overconf=[0.05,0.12,0.20,0.28,0.36,0.46,0.55,0.66,0.78,0.88];
var underconf=[0.10,0.22,0.34,0.46,0.58,0.66,0.74,0.82,0.90,0.97];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'tahmini guven',color:'#e8e8e8',gridcolor:'#222',range:[0,1]},
yaxis:{title:'gercek dogruluk',color:'#e8e8e8',gridcolor:'#222',range:[0,1]},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-calib-tr',[
{x:conf,y:perfect,name:'mukemmel kalibrasyon',line:{color:'#888',dash:'dash'}},
{x:conf,y:overconf,name:'asiri guvenli DNN',line:{color:'#ec4899'},mode:'lines+markers'},
{x:conf,y:underconf,name:'sicaklik olcekleme sonrasi',line:{color:'#3b82f6'},mode:'lines+markers'}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div id="plot-l6-ensemble-tr" style="height:340px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var m1=[];var m2=[];var m3=[];var ens=[];
for(var i=0;i<200;i++){var x=-4+i*0.04;xs.push(x);
  m1.push(Math.sin(x)+0.1*Math.sin(3*x));
  m2.push(Math.sin(x)-0.1*Math.sin(2*x));
  m3.push(Math.sin(x)+0.08*Math.cos(2*x));
  ens.push((m1[i]+m2[i]+m3[i])/3);}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'x',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'y',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-ensemble-tr',[
{x:xs,y:m1,name:'model 1',line:{color:'#888',width:1}},
{x:xs,y:m2,name:'model 2',line:{color:'#aaa',width:1}},
{x:xs,y:m3,name:'model 3',line:{color:'#ccc',width:1}},
{x:xs,y:ens,name:'topluluk ortalamasi',line:{color:'#3b82f6',width:3}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div id="plot-l6-rlhf-tr" style="height:280px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var iters=[];var sft=[];var rlhf=[];var reward=[];
for(var i=0;i<50;i++){iters.push(i);
  sft.push(0.55+0.0001*i);
  rlhf.push(0.55+0.005*i*Math.exp(-i*0.05)+0.25*(1-Math.exp(-i*0.1)));
  reward.push(0.3+0.6*(1-Math.exp(-i*0.08)));}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'PPO iterasyon',color:'#e8e8e8',gridcolor:'#222'},yaxis:{title:'kazanma orani / odul',color:'#e8e8e8',gridcolor:'#222'},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-rlhf-tr',[
{x:iters,y:sft,name:'SFT taban',line:{color:'#888',dash:'dash'}},
{x:iters,y:rlhf,name:'RLHF SFT karsisi kazanma orani',line:{color:'#ec4899'}},
{x:iters,y:reward,name:'ortalama odul',line:{color:'#3b82f6'}}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<div id="plot-l6-langevin-tr" style="height:340px;margin:1rem 0"></div>
<script>
setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=2.5,y=-1.5;var xs=[],ys=[];
for(var i=0;i<400;i++){
  xs.push(x);ys.push(y);
  var gx=-0.3*x;var gy=-0.3*y;
  x=x+0.05*gx+0.2*(Math.random()-0.5);
  y=y+0.05*gy+0.2*(Math.random()-0.5);}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
xaxis:{title:'x_1',color:'#e8e8e8',gridcolor:'#222',range:[-3.5,3.5]},
yaxis:{title:'x_2',color:'#e8e8e8',gridcolor:'#222',range:[-3.5,3.5]},
legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,b:50,l:60,r:30}};
Plotly.newPlot('plot-l6-langevin-tr',[
{x:xs,y:ys,mode:'lines+markers',marker:{color:xs.map(function(_,i){return i}),colorscale:'Viridis',size:3,showscale:false},line:{color:'rgba(59,130,246,0.4)',width:1},name:'Langevin yorungesi'}
],layout,{displayModeBar:false,responsive:true});
},250);
</script>

<p class="l-text"><strong>Bu, Markov & MCMC track'inin zirvesidir.</strong> Ayrık Markov zincirlerinden (L1) HMM'lere (L2), Metropolis-Hastings'e (L3), Hamiltonian Monte Carlo'ya (L4), varyasyonel çıkarıma (L5) ve modern Bayesçi derin öğrenmeye — ortak çizgi şudur: <em>hesaplanamaz integralleri ya örnekleme ya da optimizasyon ile hesaplanabilir hale getir, bunu yaparken belirsizliği dürüstçe nicelendir</em>. Modern AI — VAE'ler, diffusion, RLHF, LoRA-Bayes — hepsi bu temel üzerine kurulu.</p>
`
};
