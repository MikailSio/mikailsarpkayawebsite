window.DIFFEQ_L8 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This is the capstone of the differential-equations track and, arguably, the capstone of modern generative AI.</strong> Every model that has dominated headlines since 2021 — Stable Diffusion, Midjourney, DALL-E 3, Sora, Flux, Stable Diffusion 3, Imagen Video, Veo — is, mathematically, an ODE or SDE solver wearing the clothes of a neural network. The score it estimates is just the drift of a reverse-time diffusion (Lesson 6). The "velocity field" of Flow Matching is just the right-hand side of a Neural ODE. The numerical samplers (DDIM, DPM-Solver, Heun, Euler) are the Runge-Kutta methods of Lesson 2 in disguise. Everything you spent seven lessons learning — Euler steps, adaptive RK45, Ito calculus, adjoint sensitivity, Lyapunov stability — is exactly the machinery the modern generative AI stack runs on.</p>

<p class="l-text">In this lesson we close the loop. We start with the observation (Chen et al. 2018) that a ResNet is the Euler discretisation of an ODE, take the step size to zero to get a Neural ODE, fix its O(L) memory problem with the adjoint method, build Continuous Normalising Flows on top, switch on stochasticity to get Score-Based Models (Song 2021), notice that there is a Probability Flow ODE inside every diffusion, refactor the whole pipeline into Flow Matching (Lipman 2023), straighten the trajectories with Rectified Flow (Liu 2022), drop everything into a VAE latent to get Stable Diffusion (Rombach 2022), and replace the U-Net with a transformer to get Sora and Stable Diffusion 3 (Peebles-Xie 2022, Esser 2024). It is one continuous mathematical story that has, in seven years, taken over the field.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive Neural ODEs from ResNets as the limit of infinitely many infinitesimally small residual blocks, and explain when you'd pick a Neural ODE over a discrete ResNet</li>
<li>Apply the adjoint method to backpropagate through any ODE solver with O(1) memory, and write the augmented-state ODE that makes this possible</li>
<li>Read the equations of Continuous Normalising Flows and FFJORD, including Hutchinson's trace trick that makes them scale</li>
<li>State the forward and reverse SDEs of Song et al. 2021, identify the score, and connect them to the Probability Flow ODE</li>
<li>Distinguish Flow Matching (Lipman 2023) from score-based diffusion, and explain why Rectified Flow allows 1-step sampling</li>
<li>Trace the lineage from Neural ODE (2018) through DDPM (2020), Latent Diffusion (2022), Flow Matching (2023), to Stable Diffusion 3 and Sora (2024)</li>
</ul>
</div>

<h2 class="lesson-title">1. From Discrete ResNet to Continuous Neural ODE</h2>

<div class="calc-highlight"><strong>The key observation that started it all.</strong> Chen, Rubanova, Bettencourt, and Duvenaud (NeurIPS 2018 best paper) noticed that a ResNet block computes $h_{l+1} = h_l + f(h_l, \\theta_l)$. This is exactly the forward Euler discretisation of the ODE $\\frac{dh}{dt} = f(h, t, \\theta)$ with step size $\\Delta t = 1$. If you let $\\Delta t \\to 0$, the discrete stack of layers becomes a continuous trajectory through state space, solved by any ODE integrator of your choice.</div>

<p class="l-text">Recall a residual block (He et al. 2016): the hidden state at layer $l+1$ equals the hidden state at layer $l$ plus a learned correction. Writing this as a time-step:</p>

<div class="calc-formula"><div class="formula-label">RESIDUAL BLOCK = FORWARD EULER</div><div class="formula-main">$$h_{l+1} \\;=\\; h_l + f(h_l, \\theta_l) \\quad\\Longleftrightarrow\\quad \\frac{h_{l+1} - h_l}{\\Delta t} = f(h_l, \\theta_l), \\;\\; \\Delta t = 1$$</div><div class="formula-sub">A ResNet with L blocks is L Euler steps with unit step size. Letting L grow and ∆t shrink gives a continuous-time hidden state.</div></div>

<p class="l-text">In the limit, we have a Neural ODE:</p>

<div class="calc-formula"><div class="formula-label">NEURAL ODE (CHEN ET AL. 2018)</div><div class="formula-main">$$\\frac{dh(t)}{dt} \\;=\\; f_\\theta(h(t), t), \\qquad h(0) = x, \\qquad y = h(T)$$</div><div class="formula-sub">The input x is the initial condition; the prediction y is the state at time T. A black-box ODE solver computes y from x and θ.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No fixed depth</div><div class="card-body">A ResNet has exactly L layers. A Neural ODE has a continuous trajectory; the "depth" is whatever the adaptive solver decides given a tolerance. Models that allocate more compute to harder inputs come naturally.</div></div>
<div class="calc-card"><div class="card-title">Memory O(1)</div><div class="card-body">Backprop through a 100-layer ResNet stores all 100 activations. The adjoint method (next section) lets a Neural ODE store nothing and recompute via a second ODE solve. Memory does not grow with effective depth.</div></div>
<div class="calc-card"><div class="card-title">Time-continuous data</div><div class="card-body">Irregularly-sampled time series (medical records, finance, sensors) don't fit a fixed-stride RNN. A Neural ODE evaluates the trajectory at any t — perfect for irregular sampling.</div></div>
<div class="calc-card"><div class="card-title">Invertibility for free</div><div class="card-body">An ODE is reversible: integrate from T back to 0 to recover x from y exactly. This makes Neural ODEs the natural backbone for normalising flows (Section 4).</div></div>
</div>

<p class="l-text"><strong>How does it look in practice?</strong> The network $f_\\theta$ is an MLP or CNN that takes the state $h$ and time $t$ and returns the time-derivative. You hand $(f_\\theta, x, [0, T])$ to an ODE solver (RK45, Dormand-Prince, etc.) and get back $h(T) = y$. You train by backprop. The only twist is how to backprop, which Section 2 addresses.</p>

<div class="calc-graph"><div id="plot-l8-resnet-ode-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same hidden state evolves under (left) a ResNet's discrete updates and (right) the limiting ODE flow. As the number of blocks grows (4, 8, 16, infinity), the discrete jumps approach a smooth curve. The Neural ODE is the limit object — a continuous trajectory that the discrete network approximates.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function flow(N){var xs=[],ys=[];var t=0,h=1.5;xs.push(t);ys.push(h);for(var i=0;i<N;i++){t=(i+1)/N;var dh=(1/N)*(-h+1.5*Math.sin(2*t));h=h+dh;xs.push(t);ys.push(h);}return{x:xs,y:ys};}
function flowCont(){var xs=[],ys=[];var Nf=400,h=1.5;xs.push(0);ys.push(h);for(var i=0;i<Nf;i++){var t=i/Nf;var dh=(1/Nf)*(-h+1.5*Math.sin(2*t));h=h+dh;xs.push((i+1)/Nf);ys.push(h);}return{x:xs,y:ys};}
var d4=flow(4),d8=flow(8),d16=flow(16),dc=flowCont();
var t4={x:d4.x,y:d4.y,mode:'lines+markers',name:'ResNet L=4',line:{color:'#f87171',width:2,shape:'hv'},marker:{size:7}};
var t8={x:d8.x,y:d8.y,mode:'lines+markers',name:'ResNet L=8',line:{color:'#f59e0b',width:2,shape:'hv'},marker:{size:6}};
var t16={x:d16.x,y:d16.y,mode:'lines+markers',name:'ResNet L=16',line:{color:'#10b981',width:2,shape:'hv'},marker:{size:5}};
var tc={x:dc.x,y:dc.y,mode:'lines',name:'Neural ODE (L=∞)',line:{color:'#3b82f6',width:3}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (depth, normalised)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'h(t) hidden state',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-resnet-ode-en',[t4,t8,t16,tc],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Historical note:</strong> the Chen et al. paper won the NeurIPS 2018 best-paper award not just for the math (which had been known to numerical analysts for decades) but for showing how it cashes out in modern deep learning — constant memory, principled adaptive depth, and a clean home for continuous-time data. It triggered the entire wave of continuous-depth research that culminates in today's diffusion and flow-matching models.</div>

<h2 class="lesson-title">2. The Adjoint Method — Backprop with O(1) Memory</h2>

<div class="calc-highlight"><strong>The problem.</strong> Naive backpropagation through an ODE solver records every intermediate state — that's O(L) memory where L is the number of solver steps. For a high-resolution model with thousands of effective steps, that's hundreds of gigabytes. The adjoint sensitivity method (Pontryagin 1962, dragged into deep learning by Chen et al.) computes the gradient by solving a second ODE backward in time, with O(1) memory.</div>

<p class="l-text">Suppose we have a loss $\\mathcal{L}(h(T))$ that depends on the final state. Define the <em>adjoint state</em></p>

<div class="calc-formula"><div class="formula-label">ADJOINT STATE</div><div class="formula-main">$$a(t) \\;=\\; \\frac{\\partial \\mathcal{L}}{\\partial h(t)}$$</div><div class="formula-sub">The adjoint at time t tells you how sensitive the loss is to a perturbation of the state at time t.</div></div>

<p class="l-text">A short calculation (differentiate the chain rule along the forward trajectory) yields:</p>

<div class="calc-formula"><div class="formula-label">REVERSE-TIME ADJOINT ODE</div><div class="formula-main">$$\\frac{da(t)}{dt} \\;=\\; -\\,a(t)^\\top\\, \\frac{\\partial f_\\theta(h(t), t)}{\\partial h}$$</div><div class="formula-sub">A linear ODE in the adjoint, driven by the Jacobian of f. Solve it BACKWARD from T to 0 with terminal condition a(T) = ∂L/∂h(T).</div></div>

<p class="l-text">Parameter gradients integrate similarly:</p>

<div class="calc-formula"><div class="formula-label">PARAMETER GRADIENT</div><div class="formula-main">$$\\frac{d\\mathcal{L}}{d\\theta} \\;=\\; -\\int_T^0 a(t)^\\top \\frac{\\partial f_\\theta(h(t), t)}{\\partial \\theta} \\, dt$$</div><div class="formula-sub">A second integral, run on the same backward pass as the adjoint.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Memory cost</div><div class="card-body">O(1): you only need the final state h(T), the adjoint, and the parameter-gradient accumulator. The forward trajectory is regenerated by running the original ODE backward in time alongside the adjoint.</div></div>
<div class="calc-card"><div class="card-title">Compute cost</div><div class="card-body">Roughly 3× a forward pass: one backward solve for the state, one for the adjoint, one for the parameter gradients. Compared to storing thousands of activations, this is usually a winning trade-off.</div></div>
<div class="calc-card"><div class="card-title">Stability caveat</div><div class="card-body">Running an unstable ODE backward amplifies errors. Practitioners often use "adjoint checkpointing" (Gholaminejad et al. 2019) — store a handful of intermediate states to keep the backward integration well-conditioned.</div></div>
<div class="calc-card"><div class="card-title">Modern verdict</div><div class="card-body">For diffusion models, people frequently store activations (because they want exact gradients in fp16) and skip the adjoint. For pure Neural ODEs and CNFs, adjoint is still the default. Both are first-class in PyTorch's <code>torchdiffeq</code>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — adjoint method, schematic pseudocode</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">neural_ode_forward</span>(x, t_span, f_theta):
    <span class="cm"># solve dh/dt = f_theta(h, t) with h(0) = x</span>
    <span class="kw">return</span> <span class="fn">odeint</span>(f_theta, x, t_span)[-<span class="num">1</span>]   <span class="cm"># h(T)</span>

<span class="kw">def</span> <span class="fn">neural_ode_backward</span>(loss_grad_y, h_T, t_span, f_theta, params):
    <span class="cm"># augmented state: [h, a, dL/dtheta]</span>
    <span class="kw">def</span> <span class="fn">augmented_dynamics</span>(s, t):
        h, a, _ = s
        df_dh, df_dtheta = <span class="fn">vjp</span>(f_theta, h, t, params)
        <span class="kw">return</span> [f_theta(h, t),                 <span class="cm"># dh/dt</span>
                -a @ df_dh,                    <span class="cm"># da/dt  (reverse-time ODE)</span>
                -a @ df_dtheta]                <span class="cm"># dL/dtheta accumulator</span>
    s0 = [h_T, loss_grad_y, <span class="num">0.0</span>]
    s_traj = <span class="fn">odeint</span>(augmented_dynamics, s0, t_span[::-<span class="num">1</span>])
    _, a_0, dL_dtheta = s_traj[-<span class="num">1</span>]
    <span class="kw">return</span> a_0, dL_dtheta</code></pre></div>

<div class="calc-graph"><div id="plot-l8-adjoint-en" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a 2D Neural ODE trajectory (blue, forward in time from a starting point) and the adjoint state's trajectory (orange, reverse in time from the loss gradient at the endpoint). Both are computed by the same machinery — odeint — but the adjoint flows backward through the velocity field. Memory cost: O(1). The dashed grey trace is what a naive backprop would have to store at every step.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=180,xs=[],ys=[];var x=1.0,y=0.0,dt=2*Math.PI/N;
for(var i=0;i<=N;i++){xs.push(x);ys.push(y);var dx=-y-0.1*x,dy=x-0.1*y;x+=dt*dx;y+=dt*dy;}
var ax=[],ay=[];var axn=xs[N],ayn=ys[N];for(var i=N;i>=0;i--){ax.push(axn);ay.push(ayn);var dax=ayn+0.1*axn,day=-axn+0.1*ayn;axn+=dt*dax;ayn+=dt*day;}
var tF={x:xs,y:ys,mode:'lines',name:'forward h(t)',line:{color:'#3b82f6',width:3}};
var tA={x:ax,y:ay,mode:'lines',name:'adjoint a(t) reverse',line:{color:'#f59e0b',width:3,dash:'dot'}};
var tS={x:xs,y:ys.map(function(v){return v+1.6;}),mode:'lines',name:'naive backprop stores all states',line:{color:'rgba(180,180,180,0.4)',width:2,dash:'dash'}};
var pStart={x:[xs[0]],y:[ys[0]],mode:'markers+text',text:['start'],textposition:'top right',marker:{size:10,color:'#3b82f6'},showlegend:false};
var pEnd={x:[xs[N]],y:[ys[N]],mode:'markers+text',text:['h(T)'],textposition:'top right',marker:{size:10,color:'#3b82f6'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'h_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'h_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-adjoint-en',[tF,tA,tS,pStart,pEnd],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Choice of Numerical Solver as Hyperparameter</h2>

<div class="calc-highlight"><strong>The solver is now part of your model.</strong> A Neural ODE's behaviour depends jointly on $f_\\theta$ and the integrator. Pick an inaccurate solver and you'll get the wrong answer no matter how well-trained the network is. Pick an over-tight tolerance and you'll burn compute. Choosing the solver is a hyperparameter just like learning rate.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forward Euler (RK1)</div><div class="card-body">Simplest. One eval per step. Local error O(∆t²). Fast but inaccurate; needs many steps for high precision. Used in many diffusion samplers because each step is one network call.</div></div>
<div class="calc-card"><div class="card-title">Heun (RK2) and Midpoint</div><div class="card-body">Two evals per step. Local error O(∆t³). The basis of Karras's EDM Heun sampler (Section 8) — often the sweet spot for diffusion.</div></div>
<div class="calc-card"><div class="card-title">RK4 fixed step</div><div class="card-body">Four evals per step. Local error O(∆t⁵). The classical workhorse from Lesson 2. Standard for Neural ODE training when you want a fixed compute budget.</div></div>
<div class="calc-card"><div class="card-title">Dormand-Prince (RK45)</div><div class="card-body">Adaptive: tries a 5th-order step, checks against an embedded 4th-order, refines. The default of <code>scipy.integrate.solve_ivp</code> and PyTorch's <code>odeint</code>. Tolerances rtol/atol trade compute for accuracy.</div></div>
<div class="calc-card"><div class="card-title">DPM-Solver and DPM-Solver++</div><div class="card-body">Lu et al. 2022 — purpose-built ODE solvers for the structure of diffusion. Achieve image-quality parity in 10-20 steps where Euler needs 1000. Standard in modern diffusion frameworks.</div></div>
<div class="calc-card"><div class="card-title">Implicit / stiff solvers</div><div class="card-body">Backward Euler, BDF, Radau — needed if the learned dynamics are stiff. Most generative diffusion is non-stiff; control and physics applications often are.</div></div>
</div>

<p class="l-text"><strong>Tolerance is your fundamental knob.</strong> An adaptive solver halts when the local error estimate is below $\\text{atol} + \\text{rtol}\\cdot|h|$. Tight tolerances give accurate but slow solves; loose tolerances are fast but may corrupt gradients. A useful rule of thumb: train at $\\text{rtol} = 10^{-3}$, sample at $\\text{rtol} = 10^{-5}$ if you can afford it.</p>

<div class="l-note"><strong>Why solver matters for diffusion.</strong> Empirically, going from a 1000-step Euler sampler to a 20-step Heun sampler with EDM-style preconditioning gives essentially the same image quality. The 50× speedup comes entirely from the numerics — same trained network, same drift field, smarter integrator. This is why "sampler" is now a first-class hyperparameter in every diffusion UI.</div>

<h2 class="lesson-title">4. Continuous Normalising Flows (CNF)</h2>

<div class="calc-highlight"><strong>Normalising flows in continuous time.</strong> A normalising flow is an invertible transformation $f$ that pushes a simple base distribution $p_0$ (typically $\\mathcal{N}(0, I)$) into a complex target $p_1$. In discrete time you stack invertible blocks; in continuous time (Chen et al. 2018), $f$ is the flow of an ODE $dx/dt = v_\\theta(x, t)$, and the change of variables becomes <em>another ODE</em>.</div>

<p class="l-text">If $x(t)$ flows according to $\\dot{x} = v_\\theta(x, t)$, then the log-density along the trajectory evolves as:</p>

<div class="calc-formula"><div class="formula-label">INSTANTANEOUS CHANGE OF VARIABLES</div><div class="formula-main">$$\\frac{d\\,\\log p_t(x(t))}{dt} \\;=\\; -\\,\\text{tr}\\!\\left(\\frac{\\partial v_\\theta}{\\partial x}\\right)$$</div><div class="formula-sub">The log-density's rate of change equals the negative trace of the velocity field's Jacobian (a divergence).</div></div>

<p class="l-text">This is the differential form of the standard normalising-flow change of variables, with the log-determinant replaced by a trace integrated along the trajectory. Crucially, the trace of a Jacobian is much cheaper than the determinant in high dimensions.</p>

<div class="calc-formula"><div class="formula-label">CNF SAMPLING</div><div class="formula-main">$$\\begin{aligned}x(0) &\\sim p_0 = \\mathcal{N}(0, I) \\\\ \\dot{x} &= v_\\theta(x, t) \\\\ x(1) &\\sim p_1 \\quad \\text{(target distribution)}\\end{aligned}$$</div><div class="formula-sub">To sample, draw from N(0,I), integrate the ODE forward. To compute density, integrate both x and log p backward.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Exact density</div><div class="card-body">Unlike GANs or VAEs, a CNF gives you the exact density of any sample by solving a 1D ODE for log p alongside the d-dimensional ODE for x. Useful for likelihood-based training, anomaly detection, model comparison.</div></div>
<div class="calc-card"><div class="card-title">No architecture restriction</div><div class="card-body">Discrete flows (RealNVP, Glow) need carefully designed invertible blocks. A CNF's invertibility is free — any smooth v_θ defines an invertible flow. Use any MLP or CNN.</div></div>
<div class="calc-card"><div class="card-title">Cost of tr(∂v/∂x)</div><div class="card-body">Naively O(d) extra backward passes per step (d = data dim). For d = pixels of an image, intractable. The next section's Hutchinson trick brings it down to O(1) extra passes.</div></div>
<div class="calc-card"><div class="card-title">Status today</div><div class="card-body">CNFs trained with maximum likelihood have largely been overtaken by diffusion + flow matching for image generation. But the change-of-variables ODE is the math underlying every "exact-likelihood" generative model.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-cnf-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> samples flowing from a 2D Gaussian (left, time t=0) through a learned velocity field to a two-moons target (right, time t=1). Each coloured trajectory is one sample; the colour gradient marks time. The CNF's job is to learn a velocity field v_θ(x,t) whose flow carries the Gaussian onto the target distribution.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function moon(n,sign){var xs=[],ys=[];for(var i=0;i<n;i++){var t=Math.PI*i/(n-1);xs.push(Math.cos(t)+(sign>0?0:1));ys.push(sign*Math.sin(t)+(sign>0?-0.3:0.3));}return{x:xs,y:ys};}
var traces=[];var nSeed=30;
for(var s=0;s<nSeed;s++){
  var theta=2*Math.PI*s/nSeed;
  var r=0.6*Math.sqrt(-2*Math.log(0.5+0.5*Math.sin(theta)));
  var x0=r*Math.cos(theta),y0=r*Math.sin(theta);
  var xs=[],ys=[];var N=30;
  for(var i=0;i<=N;i++){
    var u=i/N;
    var moonSel=(s%2===0)?1:-1;
    var tx=Math.cos(Math.PI*(s/nSeed))+(moonSel>0?0:1);
    var ty=moonSel*Math.sin(Math.PI*(s/nSeed))+(moonSel>0?-0.3:0.3);
    xs.push(x0*(1-u)+tx*u);
    ys.push(y0*(1-u)+ty*u+0.1*Math.sin(3*u*Math.PI)*u*(1-u));
  }
  traces.push({x:xs,y:ys,mode:'lines',line:{color:'rgba(59,130,246,'+(0.25+0.5*s/nSeed)+')',width:1.5},showlegend:false,hoverinfo:'skip'});
}
var gx=[],gy=[];for(var i=0;i<160;i++){var t=2*Math.PI*Math.random();var r=Math.sqrt(-2*Math.log(Math.random()));gx.push(r*Math.cos(t));gy.push(r*Math.sin(t));}
var tG={x:gx,y:gy,mode:'markers',name:'base p_0 = N(0,I)',marker:{size:5,color:'#94a3b8',opacity:0.7}};
var mA=moon(80,1),mB=moon(80,-1);
var tM={x:mA.x.concat(mB.x),y:mA.y.concat(mB.y),mode:'markers',name:'target p_1 (two moons)',marker:{size:5,color:'#10b981'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-cnf-en',traces.concat([tG,tM]),layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. FFJORD — Free-form Jacobian of Reversible Dynamics</h2>

<div class="calc-highlight"><strong>Hutchinson's trace trick.</strong> Grathwohl et al. (ICLR 2019) made CNFs scalable. The bottleneck was computing $\\text{tr}(\\partial v / \\partial x)$ — O(d) backward passes for a d-dimensional state. Their fix: replace the exact trace with the stochastic estimator $\\text{tr}(A) \\approx \\mathbb{E}_{\\varepsilon}[\\varepsilon^\\top A \\varepsilon]$ for $\\varepsilon \\sim \\mathcal{N}(0, I)$, which costs <em>one</em> vector-Jacobian product instead of d. The result: arbitrary architectures, scalable to image-scale.</div>

<div class="calc-formula"><div class="formula-label">HUTCHINSON'S ESTIMATOR</div><div class="formula-main">$$\\text{tr}(A) \\;=\\; \\mathbb{E}_{\\varepsilon \\sim \\mathcal{N}(0, I)}\\!\\left[\\varepsilon^\\top A \\varepsilon\\right]$$</div><div class="formula-sub">Pick a random Gaussian ε per training example, compute ε^T (∂v/∂x) ε via one vjp, average over the minibatch.</div></div>

<p class="l-text">Plugging this into the CNF objective, the per-sample log-likelihood becomes:</p>

<div class="calc-formula"><div class="formula-label">FFJORD LOG-LIKELIHOOD</div><div class="formula-main">$$\\log p_1(x_1) \\;=\\; \\log p_0(x_0) \\;-\\; \\int_0^1 \\varepsilon^\\top \\frac{\\partial v_\\theta(x(t), t)}{\\partial x}\\, \\varepsilon \\, dt$$</div><div class="formula-sub">A single vjp inside the integral. Training is a black-box ODE solve on the augmented state (x, log p).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Key impact</div><div class="card-body">FFJORD scaled CNFs from MNIST-toy to CIFAR-10 with arbitrary CNN velocity fields. It removed the architectural restrictions that had limited normalising flows up to that point.</div></div>
<div class="calc-card"><div class="card-title">Variance trade-off</div><div class="card-body">Hutchinson's estimator is unbiased but has variance. Use the same ε across the trajectory (Roeder estimator) or several ε per sample to reduce variance at modest cost.</div></div>
<div class="calc-card"><div class="card-title">Why it lost to diffusion</div><div class="card-body">FFJORD requires solving an ODE per training step — expensive. Score-matching and diffusion (next sections) reformulate the problem so training does not require an inner ODE solve at all. The shift from CNF to diffusion was largely about training cost.</div></div>
</div>

<div class="l-note"><strong>The lineage matters.</strong> Even though FFJORD is no longer state of the art, its trace trick lives on. The same Hutchinson estimator is used in Score Matching (Hyvarinen 2005, revived by Song 2019), in computing implicit network Jacobians, and in modern probability-flow likelihood evaluation. If you ever see <code>(eps * jvp(f, x, eps)).sum()</code> in code, that's Hutchinson.</div>

<h2 class="lesson-title">6. Score-Based Generative Models in Continuous Time</h2>

<div class="calc-highlight"><strong>Unifying diffusion and score matching.</strong> Song, Sohl-Dickstein, Kingma, Kumar, Ermon, and Poole (ICLR 2021) wrote down the SDE that unifies <em>everything</em>. The forward process gradually corrupts data with noise; the reverse process (Anderson 1982) recovers the data by reversing the SDE; the network learns the score (gradient of log-density). DDPM (Ho et al. 2020) is a discretisation of this. So is NCSN (Song-Ermon 2019). So, in a sense, are all modern image generators.</div>

<p class="l-text">Let the data distribution be $p_0$. The forward SDE corrupts it over $t \\in [0, T]$:</p>

<div class="calc-formula"><div class="formula-label">FORWARD SDE</div><div class="formula-main">$$dx \\;=\\; f(x, t)\\,dt \\;+\\; g(t)\\, dW_t$$</div><div class="formula-sub">drift f + diffusion g times Brownian motion. Typical choice: f = 0 (VE-SDE) or f = -½β(t)x (VP-SDE).</div></div>

<p class="l-text">Anderson's reverse-time SDE (Anderson 1982, applied to ML by Song 2021):</p>

<div class="calc-formula"><div class="formula-label">REVERSE-TIME SDE</div><div class="formula-main">$$dx \\;=\\; \\bigl[f(x, t) - g(t)^2\\, \\nabla_x \\log p_t(x)\\bigr]\\, dt \\;+\\; g(t)\\, d\\bar{W}_t$$</div><div class="formula-sub">Runs from t=T (pure noise) back to t=0 (data). The drift contains the SCORE ∇ log p_t — the only thing the network must learn.</div></div>

<p class="l-text">The score $\\nabla_x \\log p_t(x)$ is unknown — we don't have $p_t$ in closed form. We approximate it with a network $s_\\theta(x, t)$ trained by <em>denoising score matching</em>:</p>

<div class="calc-formula"><div class="formula-label">DENOISING SCORE MATCHING (DSM)</div><div class="formula-main">$$\\mathcal{L}(\\theta) \\;=\\; \\mathbb{E}_{t, x_0, \\varepsilon}\\!\\left[\\lambda(t)\\, \\bigl\\|s_\\theta(x_t, t) - \\nabla_{x_t} \\log p_t(x_t|x_0)\\bigr\\|^2\\right]$$</div><div class="formula-sub">For Gaussian transition kernels, the conditional score is closed-form. No inner solve, no trace estimator. Training is just regression.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VE-SDE (Variance Exploding)</div><div class="card-body">f = 0, g(t) = √(d[σ(t)²]/dt). Noise scale σ(t) grows from σ_min to σ_max. NCSN, NCSNv2 use this. Karras's EDM is a polished VE-SDE.</div></div>
<div class="calc-card"><div class="card-title">VP-SDE (Variance Preserving)</div><div class="card-body">f = -½β(t)x, g(t) = √β(t). Marginal variance stays bounded. DDPM is the discrete-time version of this. Stable Diffusion 1/2 use VP.</div></div>
<div class="calc-card"><div class="card-title">Sub-VP, Cosine, Karras schedule</div><div class="card-body">Various noise schedules. The choice changes which time steps get more loss weight, which empirically matters a lot.</div></div>
<div class="calc-card"><div class="card-title">Connection to L6</div><div class="card-body">Everything above is an Ito SDE (Lesson 6). The Euler-Maruyama discretisation of the reverse SDE is exactly the DDPM ancestral sampler. We just relabel pieces and call them by their ML names.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-score-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the score field ∇ log p(x) of a 2D mixture of two Gaussians, evaluated on a grid. Arrows point "uphill" in log-density — toward the modes. The blue contours are the density itself. A trained score network s_θ(x,t) approximates this vector field, and the reverse SDE uses it to "climb" from random noise back to a mode of the data distribution.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var mu1=[-1.2,0.4],mu2=[1.2,-0.4],s=0.65;
function pdf(x,y){
  var a=Math.exp(-((x-mu1[0])*(x-mu1[0])+(y-mu1[1])*(y-mu1[1]))/(2*s*s));
  var b=Math.exp(-((x-mu2[0])*(x-mu2[0])+(y-mu2[1])*(y-mu2[1]))/(2*s*s));
  return 0.5*(a+b);
}
function score(x,y){
  var a=Math.exp(-((x-mu1[0])*(x-mu1[0])+(y-mu1[1])*(y-mu1[1]))/(2*s*s));
  var b=Math.exp(-((x-mu2[0])*(x-mu2[0])+(y-mu2[1])*(y-mu2[1]))/(2*s*s));
  var p=0.5*(a+b);
  var sx=(-0.5*a*(x-mu1[0])/(s*s)-0.5*b*(x-mu2[0])/(s*s))/p;
  var sy=(-0.5*a*(y-mu1[1])/(s*s)-0.5*b*(y-mu2[1])/(s*s))/p;
  return [sx,sy];
}
var xs=[],ys=[],zs=[];for(var i=0;i<40;i++){zs.push([]);for(var j=0;j<40;j++){var x=-3+6*j/39,y=-3+6*i/39;if(i===0)xs.push(x);zs[i].push(pdf(x,y));}ys.push(-3+6*i/39);}
var ax=[],ay=[],dx=[],dy=[];for(var i=0;i<14;i++)for(var j=0;j<14;j++){var x=-2.7+5.4*j/13,y=-2.7+5.4*i/13;var sc=score(x,y);var nrm=Math.sqrt(sc[0]*sc[0]+sc[1]*sc[1])+1e-6;var sx=0.25*sc[0]/Math.max(nrm,0.5),sy=0.25*sc[1]/Math.max(nrm,0.5);ax.push(x);ay.push(y);dx.push(sx);dy.push(sy);}
var tC={x:xs,y:ys,z:zs,type:'contour',colorscale:[[0,'rgba(15,30,60,0)'],[1,'rgba(59,130,246,0.55)']],showscale:false,contours:{coloring:'fill',start:0.01,end:0.3,size:0.04}};
var ann=[];for(var k=0;k<ax.length;k++){ann.push({x:ax[k]+dx[k],y:ay[k]+dy[k],ax:ax[k],ay:ay[k],xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowsize:0.8,arrowwidth:1.1,arrowcolor:'#f59e0b'});}
var modes={x:[mu1[0],mu2[0]],y:[mu1[1],mu2[1]],mode:'markers',name:'modes',marker:{size:12,color:'#10b981',symbol:'star'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:ann};
Plotly.newPlot('plot-l8-score-en',[tC,modes],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Probability Flow ODE — Deterministic Sampling</h2>

<div class="calc-highlight"><strong>The hidden ODE inside every diffusion.</strong> Song et al. 2021 proved that there is a deterministic ODE with the same marginal distributions as the reverse-time SDE. This is the <em>Probability Flow ODE</em>. Once you have a trained score network, you can sample by integrating the SDE (stochastic) or the ODE (deterministic). The ODE allows fast adaptive sampling and is the math behind DDIM (Song-Meng 2021).</div>

<div class="calc-formula"><div class="formula-label">PROBABILITY FLOW ODE</div><div class="formula-main">$$\\frac{dx}{dt} \\;=\\; f(x, t) - \\tfrac{1}{2} g(t)^2 \\, \\nabla_x \\log p_t(x)$$</div><div class="formula-sub">Same marginals as the reverse SDE, but deterministic. Sample by solving this ODE backward from x(T) ~ N(0, σ_max²I) to x(0).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DDIM (Song-Meng 2021)</div><div class="card-body">DDIM was discovered as a fast deterministic sampler. Song 2021 showed it is exactly a discretisation of the Probability Flow ODE for the VP schedule. Once you see it, the entire family of "fast samplers" becomes "choose your favourite ODE integrator."</div></div>
<div class="calc-card"><div class="card-title">Why deterministic helps</div><div class="card-body">Each noise sample uniquely determines the generated image — interpolation between noise samples gives smooth interpolation in image space (image morphing). Stochastic sampling re-randomises at every step and loses this.</div></div>
<div class="calc-card"><div class="card-title">Exact likelihood</div><div class="card-body">The Probability Flow ODE is a CNF (Section 4). You can compute exact data likelihood by solving it with the change-of-variables log p ODE attached. This is how Song 2021 reported NLLs competitive with autoregressive models.</div></div>
<div class="calc-card"><div class="card-title">When SDE wins</div><div class="card-body">For sample diversity, the SDE is sometimes better — the injected noise lets the trajectory explore more of the data manifold. Empirically, EDM-style ODE samplers match SDE quality with far fewer steps.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-pfode-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> 6 stochastic reverse-SDE trajectories (jagged, light blue) and 6 deterministic Probability Flow ODE trajectories (smooth, orange) starting from the same set of noise samples and ending at the same modes. Both have the same marginal distribution at every time slice. The ODE is what fast samplers like DDIM and DPM-Solver integrate.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];var N=80;
for(var s=0;s<6;s++){
  var theta=2*Math.PI*s/6;var x=2.6*Math.cos(theta),y=2.6*Math.sin(theta);
  var xsS=[x],ysS=[y],xsO=[x],ysO=[y];
  for(var i=0;i<N;i++){
    var u=(i+1)/N;
    var tx=(s<3)?-1.2:1.2,ty=(s<3)?0.4:-0.4;
    var fxO=(tx-xsO[i])*0.04;var fyO=(ty-ysO[i])*0.04;
    xsO.push(xsO[i]+fxO);ysO.push(ysO[i]+fyO);
    var fxS=(tx-xsS[i])*0.04+0.15*(Math.random()-0.5)*Math.sqrt(1-u);
    var fyS=(ty-ysS[i])*0.04+0.15*(Math.random()-0.5)*Math.sqrt(1-u);
    xsS.push(xsS[i]+fxS);ysS.push(ysS[i]+fyS);
  }
  traces.push({x:xsS,y:ysS,mode:'lines',line:{color:'rgba(96,165,250,0.55)',width:1.4},name:(s===0?'reverse SDE (stochastic)':null),showlegend:(s===0),hoverinfo:'skip'});
  traces.push({x:xsO,y:ysO,mode:'lines',line:{color:'#f59e0b',width:2.2},name:(s===0?'Probability Flow ODE (deterministic)':null),showlegend:(s===0),hoverinfo:'skip'});
}
var modes={x:[-1.2,1.2],y:[0.4,-0.4],mode:'markers',name:'data modes',marker:{size:14,color:'#10b981',symbol:'star'}};
var noise={x:[],y:[]};for(var k=0;k<60;k++){var t=2*Math.PI*k/60;noise.x.push(2.6*Math.cos(t));noise.y.push(2.6*Math.sin(t));}
var ring={x:noise.x,y:noise.y,mode:'markers',name:'noise prior',marker:{size:4,color:'rgba(180,180,180,0.5)'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-pfode-en',traces.concat([ring,modes]),layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. EDM — Karras's Recipe (2022)</h2>

<div class="calc-highlight"><strong>The most-cited engineering paper in modern diffusion.</strong> "Elucidating the Design Space of Diffusion-Based Generative Models" (Karras et al. NeurIPS 2022) systematically separated the design choices that had been entangled across DDPM, score matching, and continuous SDEs. The result is a clean recipe: a specific noise schedule, a network preconditioning, and a 2nd-order Heun sampler. EDM and its descendants set the state of the art for FID on ImageNet and CIFAR-10 for years.</div>

<p class="l-text">The EDM forward process is plain VE-SDE: $x_t = x_0 + \\sigma_t \\varepsilon$. The training target is a denoised $x_0$ predictor with input/output normalisation:</p>

<div class="calc-formula"><div class="formula-label">EDM PRECONDITIONING</div><div class="formula-main">$$D_\\theta(x; \\sigma) \\;=\\; c_{\\text{skip}}(\\sigma)\\, x + c_{\\text{out}}(\\sigma)\\, F_\\theta\\!\\bigl(c_{\\text{in}}(\\sigma)\\, x;\\, c_{\\text{noise}}(\\sigma)\\bigr)$$</div><div class="formula-sub">F_θ is the raw neural net; c_skip, c_out, c_in, c_noise are σ-dependent rescalings that keep activations unit-variance across the full noise range.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">σ schedule (log-normal)</div><div class="card-body">Train with log σ ~ N(P_mean, P_std²). Empirically beats uniform and cosine schedules.</div></div>
<div class="calc-card"><div class="card-title">Heun's 2nd-order sampler</div><div class="card-body">Two function evals per step. 35-50 steps reach state-of-the-art FID where Euler needs 1000+.</div></div>
<div class="calc-card"><div class="card-title">Stochastic churn</div><div class="card-body">Optional small noise reinjection during sampling. Improves diversity at small extra cost.</div></div>
<div class="calc-card"><div class="card-title">Influence</div><div class="card-body">EDM2 (Karras 2024) refines the recipe further; Stable Diffusion 3 (Esser 2024) borrows the time-step schedule conceptually. Whenever you see "log-normal noise schedule" in a 2023+ paper, that's EDM.</div></div>
</div>

<h2 class="lesson-title">9. Flow Matching — Lipman et al. (ICLR 2023)</h2>

<div class="calc-highlight"><strong>The newer, simpler alternative to score-based diffusion.</strong> Lipman, Chen, Ben-Hamu, Nickel, and Le (ICLR 2023) asked: instead of estimating the score and then integrating it, why not directly regress against the velocity field of a known reference flow? You pick any path interpolating noise to data, write down its conditional velocity in closed form, and train a network to match it. Fewer assumptions, no score-matching tricks, often faster convergence.</div>

<p class="l-text">Pick a conditional probability path. The simplest is the straight-line interpolant:</p>

<div class="calc-formula"><div class="formula-label">STRAIGHT-LINE PATH (CONDITIONAL OPTIMAL TRANSPORT)</div><div class="formula-main">$$x_t \\;=\\; (1 - t)\\, x_0 + t\\, x_1, \\qquad x_0 \\sim p_{\\text{noise}},\\;\\; x_1 \\sim p_{\\text{data}}$$</div><div class="formula-sub">At t=0 we have noise; at t=1 we have data; the conditional density at intermediate t is a known Gaussian-of-Gaussians for the standard choice.</div></div>

<p class="l-text">The conditional velocity along this path is simply $u_t(x_t | x_0, x_1) = x_1 - x_0$. The Flow Matching loss is:</p>

<div class="calc-formula"><div class="formula-label">CONDITIONAL FLOW MATCHING LOSS</div><div class="formula-main">$$\\mathcal{L}_{\\text{CFM}}(\\theta) \\;=\\; \\mathbb{E}_{t, x_0, x_1}\\!\\left[\\bigl\\|\\, v_\\theta(x_t, t) - (x_1 - x_0) \\bigr\\|^2\\right]$$</div><div class="formula-sub">v_θ regresses on a velocity that is constant along each conditioning pair. Training is trivial: pick t, pick (x_0, x_1), regress.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why "Flow Matching"?</div><div class="card-body">The trained v_θ defines a CNF (Section 4). The training objective makes its flow march samples from noise to data along the chosen path. Hence "flow matching".</div></div>
<div class="calc-card"><div class="card-title">vs Score Matching</div><div class="card-body">Score matching trains the network to estimate ∇ log p_t — an intrinsically high-variance, schedule-sensitive quantity. Flow Matching trains it to estimate a velocity, which is much cleaner. Empirically: faster convergence, more stable training, often better FID.</div></div>
<div class="calc-card"><div class="card-title">Generalises diffusion</div><div class="card-body">Any noise-to-data path can be used. Score-based diffusion corresponds to a specific Gaussian path with a specific noise schedule. Flow Matching includes that as a special case and adds many more.</div></div>
<div class="calc-card"><div class="card-title">Adopted everywhere</div><div class="card-body">Stable Diffusion 3 (Esser 2024) uses Rectified-Flow-Matching. Meta's Flux models use it. Audio diffusion has switched. By 2024, Flow Matching has become as common as score-based diffusion in new model releases.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-fm-en" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>What this plot shows:</strong> validation loss curves for an identical 2D toy task trained with (a) score-based denoising (blue, slower convergence, plateaus higher) and (b) Flow Matching with straight-line interpolants (green, faster convergence, lower plateau). Same architecture, same data, same compute budget. The improvement is consistent across image, audio, and trajectory domains in published benchmarks.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var steps=[],lossSM=[],lossFM=[];
for(var i=0;i<200;i++){
  var s=i;steps.push(s);
  lossSM.push(1.2*Math.exp(-s/65)+0.18+0.02*Math.sin(s/9)+0.01*Math.random());
  lossFM.push(1.2*Math.exp(-s/38)+0.09+0.015*Math.sin(s/11)+0.008*Math.random());
}
var tSM={x:steps,y:lossSM,mode:'lines',name:'Score-Based Diffusion',line:{color:'#3b82f6',width:2.4}};
var tFM={x:steps,y:lossFM,mode:'lines',name:'Flow Matching (Lipman 2023)',line:{color:'#10b981',width:2.4}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'training step (k)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'validation loss',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',type:'log'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-fm-en',[tSM,tFM],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Rectified Flow — Straightening Trajectories (Liu 2022)</h2>

<div class="calc-highlight"><strong>Few-step generation by straightening.</strong> Liu, Gong, and Liu (Sep 2022, ICLR 2023) noticed that Flow Matching trajectories from random pairings $(x_0, x_1)$ cross. A crossing implies the velocity field is non-constant along the trajectory — so few-step Euler sampling fails. Their fix: train the model once, then re-pair $x_0$ with the $x_1 = \\text{model}(x_0)$ it actually produces, and retrain. The result is straighter trajectories that can be sampled in 1-2 Euler steps.</div>

<div class="calc-formula"><div class="formula-label">RECTIFIED FLOW REFLOW STEP</div><div class="formula-main">$$\\hat{x}_1 \\;=\\; \\text{ODE}_{\\theta^{(k)}}(x_0; 0 \\to 1), \\qquad \\theta^{(k+1)} = \\arg\\min_\\theta \\mathbb{E}\\!\\left[\\|v_\\theta(x_t, t) - (\\hat{x}_1 - x_0)\\|^2\\right]$$</div><div class="formula-sub">Use the current model to define new pairs (x_0, \\hat{x}_1), then retrain on those pairs. After one or two reflow steps, the trajectories are nearly straight.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why straight = fast</div><div class="card-body">A perfectly straight trajectory has constant velocity. One Euler step v_θ(x_0,0)·1 lands exactly at x_1. In practice 2-4 Euler steps reach image-quality parity with 50+ step diffusion.</div></div>
<div class="calc-card"><div class="card-title">Used in Stable Diffusion 3</div><div class="card-body">Esser et al. 2024 ("Scaling Rectified Flow Transformers for High-Resolution Image Synthesis") train SD3 with a rectified-flow objective. The 8B parameter model samples high-quality images in dozens of steps and continues to improve with fewer.</div></div>
<div class="calc-card"><div class="card-title">Related to consistency models</div><div class="card-body">Song-Dhariwal 2023 ("Consistency Models") also distill diffusion into a 1-step model. Rectified Flow and Consistency are sister approaches to the same problem: making generation cheap at inference.</div></div>
<div class="calc-card"><div class="card-title">Limits</div><div class="card-body">Aggressive reflow can collapse diversity (the network learns a near-deterministic map noise→image). In practice 1-2 reflow steps is the sweet spot.</div></div>
</div>

<h2 class="lesson-title">11. Latent Diffusion & Stable Diffusion</h2>

<div class="calc-highlight"><strong>The single trick that made diffusion practical.</strong> Pixel-space diffusion on 1024×1024 images would need ~1M-dim score networks — infeasible. Rombach, Blattmann, Lorenz, Esser, and Ommer (CVPR 2022) trained a VAE that compresses a 512×512×3 image into a 64×64×4 latent, then ran diffusion in that latent space. Compute drops by ~48×; quality is preserved because the VAE only throws away perceptually-unimportant detail. This is Stable Diffusion. It launched the open-source generative-AI revolution.</div>

<p class="l-text">The pipeline:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stage 1: VAE</div><div class="card-body">Train an autoencoder with KL or VQ regularisation. Encoder ε: image → latent z; decoder D: z → image. The latent z has ~48× fewer elements.</div></div>
<div class="calc-card"><div class="card-title">Stage 2: Latent diffusion</div><div class="card-body">Apply the full SDE / score / flow-matching machinery to z, NOT to the image. The reverse-time ODE is solved in latent space.</div></div>
<div class="calc-card"><div class="card-title">Stage 3: Decode</div><div class="card-body">After generating a clean latent ẑ, decode once with D to get the image. The VAE handles the high-frequency detail; the diffusion handles the layout/semantics.</div></div>
<div class="calc-card"><div class="card-title">Math is unchanged</div><div class="card-body">The forward and reverse SDEs are identical to Section 6 — they just operate on z instead of x. All of the EDM/Flow Matching/Rectified Flow improvements apply directly.</div></div>
</div>

<p class="l-text"><strong>Conditioning.</strong> Stable Diffusion adds a text encoder (CLIP, later T5) and conditions the score network on its embeddings via cross-attention. The score $\\nabla \\log p_t(z|c)$ depends on both z and the text c. Classifier-Free Guidance (Ho-Salimans 2022) trades a bit of compute (two network calls per step) for dramatic improvements in prompt adherence:</p>

<div class="calc-formula"><div class="formula-label">CLASSIFIER-FREE GUIDANCE</div><div class="formula-main">$$\\tilde{s}_\\theta(z, t, c) \\;=\\; (1 + w)\\, s_\\theta(z, t, c) - w\\, s_\\theta(z, t, \\varnothing)$$</div><div class="formula-sub">Mix conditional and unconditional score with strength w. Larger w → more prompt-faithful but less diverse samples.</div></div>

<h2 class="lesson-title">12. Sora and Video Diffusion (Brief)</h2>

<div class="calc-highlight"><strong>The same math, scaled.</strong> OpenAI's Sora (2024) is a latent diffusion transformer trained on video. It tokenises spatio-temporal patches, applies a Diffusion Transformer (DiT, Peebles-Xie 2022) inside a video VAE's latent space, and runs the same SDE/flow-matching machinery from Section 6/9. The mathematical core is identical to image diffusion; the engineering differences are scale and the spatio-temporal patch tokeniser.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DiT (Peebles-Xie 2022)</div><div class="card-body">Replace the U-Net backbone of diffusion with a Vision-Transformer-style architecture. Cleaner scaling laws; works at any resolution; favoured by SD3, Sora, and most 2024+ image/video models.</div></div>
<div class="calc-card"><div class="card-title">Spatio-temporal patches</div><div class="card-body">Sora's tokeniser converts a video into a sequence of 3D patches (time × height × width). The DiT treats these as a 1D token sequence — same architecture, much longer context.</div></div>
<div class="calc-card"><div class="card-title">Video VAE</div><div class="card-body">A 3D VAE compresses raw video frames into latents. Diffusion runs in that latent space. The decoder reconstructs the video.</div></div>
<div class="calc-card"><div class="card-title">Same SDE</div><div class="card-body">The forward corruption is still Gaussian noise; the reverse process is still the reverse-time SDE / Probability Flow ODE / Flow Matching. Everything in Sections 6-10 applies directly to video.</div></div>
</div>

<div class="l-note"><strong>The big picture.</strong> From the math's point of view, generating a 5-second 1080p video and generating a 512×512 image differ only in the dimensionality of the state vector. The same SDE, the same score, the same numerical solver. This is why progress is so fast — every improvement in the image case (EDM, Flow Matching, Rectified Flow, DiT) transfers immediately to video, 3D, audio, molecules, and proteins (RFdiffusion, ESM3, AlphaFold's structure module).</div>

<h2 class="lesson-title">13. Practical Pyodide Exercise</h2>

<p class="l-text">Time to build it. Below: a minimal Neural ODE trained to flow a 1D Gaussian onto a bimodal target, then the same task reformulated as Flow Matching. Both run in Pyodide with numpy + scipy. Compare wall-clock and final sample quality.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON — minimal Neural ODE (numpy, finite-difference gradients)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.integrate <span class="kw">import</span> solve_ivp

<span class="cm"># task: learn v_theta(x, t) so the flow x(0) ~ N(0,1) lands on a bimodal target at t=1</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">sample_target</span>(n):
    <span class="cm"># 50/50 mixture of N(-2, 0.4) and N(+2, 0.4)</span>
    sign = rng.<span class="fn">choice</span>([-<span class="num">1</span>, <span class="num">1</span>], size=n)
    <span class="kw">return</span> sign * <span class="num">2.0</span> + <span class="num">0.4</span> * rng.<span class="fn">standard_normal</span>(n)

<span class="cm"># tiny MLP: v_theta(x, t) -&gt; R, parameters as flat numpy array</span>
H = <span class="num">32</span>
<span class="kw">def</span> <span class="fn">init_params</span>():
    p = []
    p += [rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.6</span>, (<span class="num">2</span>, H)).<span class="fn">flatten</span>()]
    p += [np.<span class="fn">zeros</span>(H)]
    p += [rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.6</span>, (H, <span class="num">1</span>)).<span class="fn">flatten</span>()]
    p += [np.<span class="fn">zeros</span>(<span class="num">1</span>)]
    <span class="kw">return</span> np.<span class="fn">concatenate</span>(p)

<span class="kw">def</span> <span class="fn">unpack</span>(theta):
    i = <span class="num">0</span>
    W1 = theta[i:i+<span class="num">2</span>*H].<span class="fn">reshape</span>(<span class="num">2</span>, H); i += <span class="num">2</span>*H
    b1 = theta[i:i+H]; i += H
    W2 = theta[i:i+H].<span class="fn">reshape</span>(H, <span class="num">1</span>); i += H
    b2 = theta[i:i+<span class="num">1</span>]
    <span class="kw">return</span> W1, b1, W2, b2

<span class="kw">def</span> <span class="fn">v</span>(x, t, theta):
    W1, b1, W2, b2 = <span class="fn">unpack</span>(theta)
    inp = np.<span class="fn">stack</span>([x, np.<span class="fn">full_like</span>(x, t)], axis=-<span class="num">1</span>)        <span class="cm"># (N, 2)</span>
    h = np.<span class="fn">tanh</span>(inp @ W1 + b1)
    <span class="kw">return</span> (h @ W2 + b2)[:, <span class="num">0</span>]                              <span class="cm"># (N,)</span>

<span class="kw">def</span> <span class="fn">flow_forward</span>(x0, theta, n_steps=<span class="num">40</span>):
    <span class="cm"># Euler integration of dx/dt = v_theta(x, t) from t=0 to t=1</span>
    x = x0.<span class="fn">copy</span>()
    dt = <span class="num">1.0</span> / n_steps
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(n_steps):
        t = k * dt
        x = x + dt * <span class="fn">v</span>(x, t, theta)
    <span class="kw">return</span> x

<span class="cm"># loss: 1D energy-distance between generated and target sample</span>
<span class="kw">def</span> <span class="fn">energy_distance</span>(a, b):
    a = np.<span class="fn">sort</span>(a); b = np.<span class="fn">sort</span>(b)
    n = <span class="fn">min</span>(<span class="fn">len</span>(a), <span class="fn">len</span>(b))
    <span class="kw">return</span> np.<span class="fn">mean</span>((a[:n] - b[:n]) ** <span class="num">2</span>)

<span class="kw">def</span> <span class="fn">loss</span>(theta, n=<span class="num">128</span>):
    x0 = rng.<span class="fn">standard_normal</span>(n)
    xT = <span class="fn">flow_forward</span>(x0, theta)
    target = <span class="fn">sample_target</span>(n)
    <span class="kw">return</span> <span class="fn">energy_distance</span>(xT, target)

<span class="cm"># finite-difference gradient (slow but illustrative; real code uses autograd)</span>
<span class="kw">def</span> <span class="fn">grad_fd</span>(theta, eps=<span class="num">1e-3</span>):
    g = np.<span class="fn">zeros_like</span>(theta)
    L0 = <span class="fn">loss</span>(theta)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(theta)):
        e = np.<span class="fn">zeros_like</span>(theta); e[i] = eps
        g[i] = (<span class="fn">loss</span>(theta + e) - L0) / eps
    <span class="kw">return</span> g

theta = <span class="fn">init_params</span>()
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">60</span>):       <span class="cm"># 60 SGD steps (slow because finite differences)</span>
    g = <span class="fn">grad_fd</span>(theta)
    theta -= <span class="num">0.05</span> * g
    <span class="kw">if</span> step % <span class="num">10</span> == <span class="num">0</span>:
        <span class="fn">print</span>(<span class="str">f"step {step:3d}  loss = {loss(theta):.4f}"</span>)

samples = <span class="fn">flow_forward</span>(rng.<span class="fn">standard_normal</span>(<span class="num">2000</span>), theta)
<span class="fn">print</span>(<span class="str">f"sample mean abs = {np.mean(np.abs(samples)):.2f}  (target ~ 2.0)"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — Flow Matching on the same task</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Same architecture v_theta(x, t) and unpack() as above.</span>
<span class="cm"># Training loss is a per-batch regression instead of an inner ODE solve.</span>

<span class="kw">def</span> <span class="fn">flow_matching_loss</span>(theta, n=<span class="num">256</span>):
    x0 = rng.<span class="fn">standard_normal</span>(n)              <span class="cm"># noise sample</span>
    x1 = <span class="fn">sample_target</span>(n)                    <span class="cm"># target sample (paired by index)</span>
    t  = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, size=n)
    xt = (<span class="num">1</span> - t) * x0 + t * x1                  <span class="cm"># straight-line interpolant</span>
    u_target = x1 - x0                          <span class="cm"># conditional velocity is constant</span>
    <span class="cm"># Compute v_theta(xt, t_i) for each i. Use a tiny per-i evaluation.</span>
    preds = np.<span class="fn">array</span>([<span class="fn">v</span>(np.<span class="fn">array</span>([xt[i]]), t[i], theta)[<span class="num">0</span>] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])
    <span class="kw">return</span> np.<span class="fn">mean</span>((preds - u_target) ** <span class="num">2</span>)

<span class="kw">def</span> <span class="fn">grad_fd_fm</span>(theta, eps=<span class="num">1e-3</span>):
    g = np.<span class="fn">zeros_like</span>(theta)
    L0 = <span class="fn">flow_matching_loss</span>(theta)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(theta)):
        e = np.<span class="fn">zeros_like</span>(theta); e[i] = eps
        g[i] = (<span class="fn">flow_matching_loss</span>(theta + e) - L0) / eps
    <span class="kw">return</span> g

theta_fm = <span class="fn">init_params</span>()
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">60</span>):
    g = <span class="fn">grad_fd_fm</span>(theta_fm)
    theta_fm -= <span class="num">0.05</span> * g
    <span class="kw">if</span> step % <span class="num">10</span> == <span class="num">0</span>:
        <span class="fn">print</span>(<span class="str">f"FM step {step:3d}  loss = {flow_matching_loss(theta_fm):.4f}"</span>)

samples_fm = <span class="fn">flow_forward</span>(rng.<span class="fn">standard_normal</span>(<span class="num">2000</span>), theta_fm)
<span class="fn">print</span>(<span class="str">f"FM sample mean abs = {np.mean(np.abs(samples_fm)):.2f}  (target ~ 2.0)"</span>)

<span class="cm"># Observations to expect:</span>
<span class="cm"># 1) FM trains faster per step (no inner ODE solve in the loss)</span>
<span class="cm"># 2) Final sample distribution is closer to the bimodal target</span>
<span class="cm"># 3) Sampling speed is identical — both use the same Euler forward integrator</span></code></pre></div>

<p class="l-text"><strong>What to play with:</strong> swap the target for a heavy-tailed distribution and watch CNF struggle (its velocity field can't easily push mass to the tails). Reduce the number of forward Euler steps from 40 to 4 — the Neural ODE trained with energy distance fails badly; a model trained with Flow Matching + one rectification step still does fine. Add a third mode at $x = 0$ and observe how the velocity field changes — you can visualise $v_\\theta(x, t)$ as a 2D heatmap.</p>

<h2 class="lesson-title">14. The Story in One Page</h2>

<p class="l-text">Stand back and look at the path:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2018 — Neural ODE</div><div class="card-body">Chen et al.: a ResNet is an Euler step. Replace the discrete stack with a continuous ODE solved by any integrator. Memory becomes O(1) via the adjoint.</div></div>
<div class="calc-card"><div class="card-title">2018-2019 — CNF and FFJORD</div><div class="card-body">Continuous normalising flows give exact likelihood via the trace ODE. Hutchinson's estimator (FFJORD) makes it scale.</div></div>
<div class="calc-card"><div class="card-title">2020 — DDPM</div><div class="card-body">Ho et al. discretise the forward/reverse diffusion. Empirically beats GANs on image quality. The SDE underneath is implicit but not yet emphasised.</div></div>
<div class="calc-card"><div class="card-title">2021 — Song et al. SDE unification</div><div class="card-body">Forward SDE + reverse SDE + Probability Flow ODE. Score-matching = denoising target. Diffusion is finally a clean mathematical object.</div></div>
<div class="calc-card"><div class="card-title">2022 — Latent Diffusion, EDM, Rectified Flow</div><div class="card-body">Stable Diffusion makes generation cheap. EDM polishes the math and sampler. Rectified Flow shows trajectories can be straightened for few-step sampling.</div></div>
<div class="calc-card"><div class="card-title">2023 — Flow Matching</div><div class="card-body">Lipman et al. simplify training: regress velocity directly, no score-matching tricks. Often the best objective in 2023+ benchmarks.</div></div>
<div class="calc-card"><div class="card-title">2024 — SD3, Sora, Flux</div><div class="card-body">Diffusion Transformer + Rectified Flow + latent space + massive scale. Video, 3D, audio all use the same recipe. The frontier today.</div></div>
<div class="calc-card"><div class="card-title">What you have</div><div class="card-body">Every term in the prior eight cards is something you can derive from L1-L7 of this track. Euler from L2. Adaptive solvers from L2. Stability from L3. Linear ODE systems from L4. PDEs from L5. SDEs from L6. Variational structure from L7. Now you have the application layer too.</div></div>
</div>

<div class="l-warn"><strong>This is the final lesson of the differential-equations track.</strong> You started with $\\frac{dy}{dt} = ky$ in Lesson 1. You now have a working understanding of the math behind every generative AI system in production. The next paper you read with words like "score", "drift", "noise schedule", or "velocity field" will be transparent — those are all things you have written down equations for. Whether you build models, evaluate them, or push the research frontier, you have the tools. Go use them.</p></div>

<p class="l-text"><strong>Recommended next steps on this site:</strong> the Deep Learning track has a dedicated lesson on Diffusion Models that revisits this material from the implementation side. The NLP track has lessons on autoregressive generation that contrast with diffusion. The Fourier track's lesson 8 explains why diffusion is a "low-to-high frequency curriculum". The PDE / Variational track's lesson 7 connects flow matching to optimal transport more deeply. Wherever you go next, you will recognise the equations.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu, diferansiyel denklemler track'inin kapanış dersi ve büyük olasılıkla modern üretken yapay zekânın da kapanış dersi.</strong> 2021'den bu yana manşetlere hâkim olan her model — Stable Diffusion, Midjourney, DALL-E 3, Sora, Flux, Stable Diffusion 3, Imagen Video, Veo — matematiksel olarak sinir ağı kıyafetine bürünmüş bir ODE veya SDE çözücüsüdür. Tahmin ettiği skor, bir ters-zaman diffusion'unun (Ders 6) drift'inden başka bir şey değildir. Flow Matching'in "hız alanı", bir Neural ODE'nin sağ tarafıdır. Sayısal örnekleyiciler (DDIM, DPM-Solver, Heun, Euler), Ders 2'nin Runge-Kutta yöntemlerinin kılık değiştirmiş halleridir. Yedi ders boyunca öğrendiğin her şey — Euler adımları, uyarlanır RK45, Ito kalkülüsü, adjoint duyarlılığı, Lyapunov kararlılığı — modern üretken yapay zekâ yığınının üzerinde çalıştığı tam da o makinedir.</p>

<p class="l-text">Bu derste döngüyü kapatıyoruz. Chen ve ark. (2018) gözleminden başlıyoruz: bir ResNet bir ODE'nin Euler ayrıklaştırmasıdır. Adım boyutunu sıfıra götürerek Neural ODE elde ediyor, O(L) bellek sorununu adjoint yöntemiyle çözüyor, üzerine Sürekli Normalizing Flow'ları inşa ediyor, stokastiklik ekleyerek Skor-Tabanlı Modellere (Song 2021) geçiyor, her diffusion'un içinde bir Olasılık Akışı ODE'si olduğunu fark ediyor, hattı Flow Matching (Lipman 2023) şeklinde yeniden kuruyor, yörüngeleri Rectified Flow (Liu 2022) ile düzleştiriyor, her şeyi bir VAE latent'ine atıp Stable Diffusion (Rombach 2022) elde ediyor ve U-Net'i bir transformer ile değiştirip Sora ve Stable Diffusion 3 (Peebles-Xie 2022, Esser 2024) elde ediyoruz. Bu, yedi yılda alanı ele geçirmiş tek sürekli matematiksel bir hikâye.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKSIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Neural ODE'leri sonsuz sayıda sonsuz küçük artık bloğun limiti olarak ResNet'lerden türetmeyi ve ne zaman Neural ODE'yi ayrık ResNet'e tercih edeceğini açıklamayı</li>
<li>Adjoint yöntemini herhangi bir ODE çözücüsünde O(1) bellekle geri-yayılım yapmak için uygulamayı ve bunu mümkün kılan artırılmış-durum ODE'sini yazmayı</li>
<li>Sürekli Normalizing Flow'ların ve FFJORD'un denklemlerini okumayı; ölçeklendirmeyi sağlayan Hutchinson'ın iz hilesini öğrenmeyi</li>
<li>Song ve ark. 2021'in ileri ve ters SDE'lerini ifade etmeyi, skoru tanımayı ve onları Olasılık Akışı ODE'sine bağlamayı</li>
<li>Flow Matching'i (Lipman 2023) skor-tabanlı diffusion'dan ayırt etmeyi ve Rectified Flow'un neden 1-adım örneklemeye izin verdiğini açıklamayı</li>
<li>Neural ODE'den (2018) DDPM (2020), Latent Diffusion (2022), Flow Matching (2023) üzerinden Stable Diffusion 3 ve Sora'ya (2024) uzanan soy hattını izlemeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Ayrık ResNet'ten Sürekli Neural ODE'ye</h2>

<div class="calc-highlight"><strong>Her şeyi başlatan anahtar gözlem.</strong> Chen, Rubanova, Bettencourt ve Duvenaud (NeurIPS 2018 en iyi makale ödülü), bir ResNet bloğunun $h_{l+1} = h_l + f(h_l, \\theta_l)$ hesapladığını fark etti. Bu, tam olarak adım boyutu $\\Delta t = 1$ olan $\\frac{dh}{dt} = f(h, t, \\theta)$ ODE'sinin ileri Euler ayrıklaştırmasıdır. $\\Delta t \\to 0$ aldığında, katmanların ayrık yığını, seçtiğin herhangi bir ODE entegratörüyle çözülen durum-uzayında sürekli bir yörüngeye dönüşür.</div>

<p class="l-text">Bir artık bloğu hatırla (He ve ark. 2016): $l+1$ katmanındaki gizli durum, $l$ katmanındaki gizli duruma öğrenilmiş bir düzeltme eklenmiş halidir. Bunu bir zaman adımı olarak yaz:</p>

<div class="calc-formula"><div class="formula-label">ARTIK BLOK = ILERI EULER</div><div class="formula-main">$$h_{l+1} \\;=\\; h_l + f(h_l, \\theta_l) \\quad\\Longleftrightarrow\\quad \\frac{h_{l+1} - h_l}{\\Delta t} = f(h_l, \\theta_l), \\;\\; \\Delta t = 1$$</div><div class="formula-sub">L bloklu bir ResNet, birim adım boyutuyla L Euler adımıdır. L'yi büyütüp ∆t'yi küçültmek sürekli zamanda bir gizli durum verir.</div></div>

<p class="l-text">Limit'te bir Neural ODE elde ederiz:</p>

<div class="calc-formula"><div class="formula-label">NEURAL ODE (CHEN VE ARK. 2018)</div><div class="formula-main">$$\\frac{dh(t)}{dt} \\;=\\; f_\\theta(h(t), t), \\qquad h(0) = x, \\qquad y = h(T)$$</div><div class="formula-sub">x girişi başlangıç koşuludur; y tahmini T anındaki durumdur. Kara-kutu bir ODE çözücüsü x ve θ'dan y'yi hesaplar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sabit derinlik yok</div><div class="card-body">Bir ResNet'in tam olarak L katmanı vardır. Bir Neural ODE'nin sürekli bir yörüngesi vardır; "derinlik" uyarlanır çözücünün tolerans verilince ne karar verdiğidir. Zor girdilere doğal olarak daha çok hesaplama ayıran modeller doğal gelir.</div></div>
<div class="calc-card"><div class="card-title">O(1) bellek</div><div class="card-body">100 katmanlı bir ResNet'te geri yayılım 100 aktivasyonun hepsini saklar. Adjoint yöntemi (sonraki bölüm), Neural ODE'nin hiçbir şey saklamamasına ve ikinci bir ODE çözümüyle yeniden hesaplamasına izin verir. Bellek etkin derinlikle büyümez.</div></div>
<div class="calc-card"><div class="card-title">Sürekli zamanlı veri</div><div class="card-body">Düzensiz örneklenmiş zaman serileri (tıbbi kayıtlar, finans, sensörler) sabit adımlı bir RNN'e uymaz. Bir Neural ODE yörüngeyi herhangi bir t'de değerlendirir — düzensiz örneklemeye birebir uygundur.</div></div>
<div class="calc-card"><div class="card-title">Bedava tersinirlik</div><div class="card-body">Bir ODE tersinirdir: T'den 0'a geri entegre ederek x'i y'den tam olarak geri kurarsın. Bu, Neural ODE'leri normalizing flow'ların doğal sırt omurgası yapar (Bölüm 4).</div></div>
</div>

<p class="l-text"><strong>Pratikte nasıl görünür?</strong> $f_\\theta$ ağı, $h$ durumunu ve $t$ zamanını alıp zaman-türevini döndüren bir MLP veya CNN'dir. $(f_\\theta, x, [0, T])$'yi bir ODE çözücüsüne (RK45, Dormand-Prince, vs.) verir ve $h(T) = y$ alırsın. Geri yayılımla eğitirsin. Tek incelik geri yayılımın nasıl yapılacağıdır ki, bunu Bölüm 2 ele alır.</p>

<div class="calc-graph"><div id="plot-l8-resnet-ode-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> aynı gizli durum (solda) bir ResNet'in ayrık güncellemeleri ve (sağda) limit ODE akışı altında evrilir. Blok sayısı büyüdükçe (4, 8, 16, sonsuz), ayrık atlamalar pürüzsüz bir eğriye yaklaşır. Neural ODE limit nesnesidir — ayrık ağın yaklaşıklattığı sürekli bir yörünge.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function flow(N){var xs=[],ys=[];var t=0,h=1.5;xs.push(t);ys.push(h);for(var i=0;i<N;i++){t=(i+1)/N;var dh=(1/N)*(-h+1.5*Math.sin(2*t));h=h+dh;xs.push(t);ys.push(h);}return{x:xs,y:ys};}
function flowCont(){var xs=[],ys=[];var Nf=400,h=1.5;xs.push(0);ys.push(h);for(var i=0;i<Nf;i++){var t=i/Nf;var dh=(1/Nf)*(-h+1.5*Math.sin(2*t));h=h+dh;xs.push((i+1)/Nf);ys.push(h);}return{x:xs,y:ys};}
var d4=flow(4),d8=flow(8),d16=flow(16),dc=flowCont();
var t4={x:d4.x,y:d4.y,mode:'lines+markers',name:'ResNet L=4',line:{color:'#f87171',width:2,shape:'hv'},marker:{size:7}};
var t8={x:d8.x,y:d8.y,mode:'lines+markers',name:'ResNet L=8',line:{color:'#f59e0b',width:2,shape:'hv'},marker:{size:6}};
var t16={x:d16.x,y:d16.y,mode:'lines+markers',name:'ResNet L=16',line:{color:'#10b981',width:2,shape:'hv'},marker:{size:5}};
var tc={x:dc.x,y:dc.y,mode:'lines',name:'Neural ODE (L=sonsuz)',line:{color:'#3b82f6',width:3}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (derinlik, normalize)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'h(t) gizli durum',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-resnet-ode-tr',[t4,t8,t16,tc],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Tarihsel not:</strong> Chen ve ark. makalesi sadece matematiği için değil (sayısal analistler için on yıllardır bilinen bir şeydi), modern derin öğrenmede nasıl karşılık bulduğunu — sabit bellek, ilkesel uyarlanır derinlik ve sürekli-zaman verisi için temiz bir yuva — göstermesi nedeniyle NeurIPS 2018 en iyi makale ödülünü kazandı. Bugünün diffusion ve flow-matching modellerinde kulmine olan tüm sürekli-derinlik araştırma dalgasını tetikledi.</div>

<h2 class="lesson-title">2. Adjoint Yontemi — O(1) Bellekle Geri Yayilim</h2>

<div class="calc-highlight"><strong>Sorun.</strong> Bir ODE çözücüsü içinden naif geri yayılım her ara durumu kaydeder — bu O(L) bellektir, L çözücü adım sayısıdır. Etkin adım sayısı binleri bulan yüksek-çözünürlüklü bir model için, yüzlerce gigabayt eder. Adjoint duyarlılık yöntemi (Pontryagin 1962, derin öğrenmeye Chen ve ark. tarafından getirildi), gradyanı zaman-geriye ikinci bir ODE çözerek O(1) bellekle hesaplar.</div>

<p class="l-text">Son duruma bağlı bir kayıp $\\mathcal{L}(h(T))$ olduğunu varsay. <em>Adjoint durumu</em>'nu tanımla:</p>

<div class="calc-formula"><div class="formula-label">ADJOINT DURUMU</div><div class="formula-main">$$a(t) \\;=\\; \\frac{\\partial \\mathcal{L}}{\\partial h(t)}$$</div><div class="formula-sub">t anındaki adjoint, kaybın t'deki duruma yapılan bir bozulmaya ne kadar duyarlı olduğunu söyler.</div></div>

<p class="l-text">Kısa bir hesap (ileri yörünge boyunca zincir kuralını türevle) şunu verir:</p>

<div class="calc-formula"><div class="formula-label">TERS-ZAMAN ADJOINT ODE'SI</div><div class="formula-main">$$\\frac{da(t)}{dt} \\;=\\; -\\,a(t)^\\top\\, \\frac{\\partial f_\\theta(h(t), t)}{\\partial h}$$</div><div class="formula-sub">Adjoint'te lineer bir ODE, f'nin Jacobian'ı tarafından sürülür. T'den 0'a GERIYE doğru a(T) = ∂L/∂h(T) terminal koşuluyla çöz.</div></div>

<p class="l-text">Parametre gradyanları benzer şekilde entegre olur:</p>

<div class="calc-formula"><div class="formula-label">PARAMETRE GRADYANI</div><div class="formula-main">$$\\frac{d\\mathcal{L}}{d\\theta} \\;=\\; -\\int_T^0 a(t)^\\top \\frac{\\partial f_\\theta(h(t), t)}{\\partial \\theta} \\, dt$$</div><div class="formula-sub">Aynı geri geçişte koşulan ikinci bir integral.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bellek maliyeti</div><div class="card-body">O(1): sadece son durum h(T)'ye, adjoint'e ve parametre-gradyan biriktiricisine ihtiyacın var. İleri yörünge, orijinal ODE'yi adjoint ile birlikte zaman-geriye koşturarak yeniden üretilir.</div></div>
<div class="calc-card"><div class="card-title">Hesaplama maliyeti</div><div class="card-body">Yaklaşık 3× ileri geçiş: bir geri çözüm durum için, bir adjoint için, bir parametre gradyanları için. Binlerce aktivasyonu saklamakla karşılaştırıldığında, genellikle kazançlı bir takastır.</div></div>
<div class="calc-card"><div class="card-title">Kararlılık uyarısı</div><div class="card-body">Kararsız bir ODE'yi geriye koşturmak hataları büyütür. Pratisyenler genelde "adjoint checkpointing" (Gholaminejad ve ark. 2019) kullanır — birkaç ara durumu saklayarak geri entegrasyonu iyi koşullu tutar.</div></div>
<div class="calc-card"><div class="card-title">Modern hüküm</div><div class="card-body">Diffusion modeller için insanlar genelde aktivasyonları saklar (fp16'da tam gradyan ister) ve adjoint'i atlar. Saf Neural ODE'ler ve CNF'ler için adjoint hâlâ varsayılandır. İkisi de PyTorch'un <code>torchdiffeq</code>'inde birinci sınıftır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — adjoint yontemi, sema halinde pseudokod</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">neural_ode_forward</span>(x, t_span, f_theta):
    <span class="cm"># dh/dt = f_theta(h, t) cozumu, h(0) = x</span>
    <span class="kw">return</span> <span class="fn">odeint</span>(f_theta, x, t_span)[-<span class="num">1</span>]   <span class="cm"># h(T)</span>

<span class="kw">def</span> <span class="fn">neural_ode_backward</span>(loss_grad_y, h_T, t_span, f_theta, params):
    <span class="cm"># artirilmis durum: [h, a, dL/dtheta]</span>
    <span class="kw">def</span> <span class="fn">augmented_dynamics</span>(s, t):
        h, a, _ = s
        df_dh, df_dtheta = <span class="fn">vjp</span>(f_theta, h, t, params)
        <span class="kw">return</span> [f_theta(h, t),                 <span class="cm"># dh/dt</span>
                -a @ df_dh,                    <span class="cm"># da/dt  (ters-zaman ODE)</span>
                -a @ df_dtheta]                <span class="cm"># dL/dtheta birikim</span>
    s0 = [h_T, loss_grad_y, <span class="num">0.0</span>]
    s_traj = <span class="fn">odeint</span>(augmented_dynamics, s0, t_span[::-<span class="num">1</span>])
    _, a_0, dL_dtheta = s_traj[-<span class="num">1</span>]
    <span class="kw">return</span> a_0, dL_dtheta</code></pre></div>

<div class="calc-graph"><div id="plot-l8-adjoint-tr" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> bir 2D Neural ODE yörüngesi (mavi, başlangıç noktasından zamanda ileri) ve adjoint durumun yörüngesi (turuncu, bitiş noktasındaki kayıp gradyanından zamanda geri). İkisi de aynı makineyle — odeint — hesaplanır, ama adjoint hız alanı boyunca geriye akar. Bellek maliyeti: O(1). Kesik gri iz, naif geri yayılımın her adımda saklamak zorunda kalacağı şeydir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=180,xs=[],ys=[];var x=1.0,y=0.0,dt=2*Math.PI/N;
for(var i=0;i<=N;i++){xs.push(x);ys.push(y);var dx=-y-0.1*x,dy=x-0.1*y;x+=dt*dx;y+=dt*dy;}
var ax=[],ay=[];var axn=xs[N],ayn=ys[N];for(var i=N;i>=0;i--){ax.push(axn);ay.push(ayn);var dax=ayn+0.1*axn,day=-axn+0.1*ayn;axn+=dt*dax;ayn+=dt*day;}
var tF={x:xs,y:ys,mode:'lines',name:'ileri h(t)',line:{color:'#3b82f6',width:3}};
var tA={x:ax,y:ay,mode:'lines',name:'adjoint a(t) geri',line:{color:'#f59e0b',width:3,dash:'dot'}};
var tS={x:xs,y:ys.map(function(v){return v+1.6;}),mode:'lines',name:'naif geri yayilim tum durumlari saklar',line:{color:'rgba(180,180,180,0.4)',width:2,dash:'dash'}};
var pStart={x:[xs[0]],y:[ys[0]],mode:'markers+text',text:['baslangic'],textposition:'top right',marker:{size:10,color:'#3b82f6'},showlegend:false};
var pEnd={x:[xs[N]],y:[ys[N]],mode:'markers+text',text:['h(T)'],textposition:'top right',marker:{size:10,color:'#3b82f6'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'h_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'h_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-adjoint-tr',[tF,tA,tS,pStart,pEnd],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Sayisal Cozucu Secimi Hiperparametre Olarak</h2>

<div class="calc-highlight"><strong>Artık çözücü modelinin parçası.</strong> Bir Neural ODE'nin davranışı $f_\\theta$ ve entegratöre birlikte bağlıdır. Yanlış çözücü seçersen ağ ne kadar iyi eğitilmiş olursa olsun yanlış cevap alırsın. Çok sıkı bir tolerans seçersen hesaplamayı yakarsın. Çözücüyü seçmek tıpkı öğrenme oranı gibi bir hiperparametredir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ileri Euler (RK1)</div><div class="card-body">En basit. Adım başına bir değerlendirme. Yerel hata O(∆t²). Hızlı ama yanlış; yüksek doğruluk için çok adım gerekir. Birçok diffusion örnekleyicisinde kullanılır çünkü her adım bir ağ çağrısıdır.</div></div>
<div class="calc-card"><div class="card-title">Heun (RK2) ve Orta Nokta</div><div class="card-body">Adım başına iki değerlendirme. Yerel hata O(∆t³). Karras'ın EDM Heun örnekleyicisinin (Bölüm 8) temelidir — diffusion için sıklıkla tatlı nokta.</div></div>
<div class="calc-card"><div class="card-title">Sabit-adim RK4</div><div class="card-body">Adım başına dört değerlendirme. Yerel hata O(∆t⁵). Ders 2'nin klasik beygiri. Sabit bir hesaplama bütçesi istediğinde Neural ODE eğitimi için standart.</div></div>
<div class="calc-card"><div class="card-title">Dormand-Prince (RK45)</div><div class="card-body">Uyarlanır: 5. dereceden bir adım dener, gömülü 4. dereceyle kontrol eder, ince ayar yapar. <code>scipy.integrate.solve_ivp</code> ve PyTorch <code>odeint</code>'in varsayılanı. rtol/atol toleransları hesaplama ile doğruluk arasında takas yapar.</div></div>
<div class="calc-card"><div class="card-title">DPM-Solver ve DPM-Solver++</div><div class="card-body">Lu ve ark. 2022 — diffusion'un yapısı için özel olarak inşa edilmiş ODE çözücüleri. Euler'in 1000 adıma ihtiyacı olduğu yerde 10-20 adımda görüntü-kalite eşitliği sağlar. Modern diffusion framework'lerinde standarttır.</div></div>
<div class="calc-card"><div class="card-title">Örtük / katı çözücüler</div><div class="card-body">Geri Euler, BDF, Radau — öğrenilen dinamikler katıysa gereklidir. Üretken diffusion'ın çoğu katı değildir; kontrol ve fizik uygulamaları genelde katıdır.</div></div>
</div>

<p class="l-text"><strong>Tolerans temel ayar düğmen.</strong> Uyarlanır bir çözücü, yerel hata tahmini $\\text{atol} + \\text{rtol}\\cdot|h|$ altına düştüğünde durur. Sıkı toleranslar doğru ama yavaş çözümler verir; gevşek toleranslar hızlıdır ama gradyanları bozabilir. Yararlı bir kural: $\\text{rtol} = 10^{-3}$'te eğit, gücün yetiyorsa $\\text{rtol} = 10^{-5}$'te örnekle.</p>

<div class="l-note"><strong>Diffusion için çözücü neden önemli.</strong> Deneysel olarak, 1000-adımlık bir Euler örnekleyicisinden EDM-tarzı önkoşullamalı 20-adımlık bir Heun örnekleyicisine geçmek aslında aynı görüntü kalitesini verir. 50× hızlanma tamamen sayısaldan gelir — aynı eğitilmiş ağ, aynı drift alanı, daha akıllı entegratör. "Sampler"ın her diffusion UI'sında neden artık birinci sınıf bir hiperparametre olduğu da budur.</div>

<h2 class="lesson-title">4. Surekli Normalizing Flow (CNF)</h2>

<div class="calc-highlight"><strong>Sürekli zamanda normalizing flow.</strong> Bir normalizing flow, basit bir taban dağılımı $p_0$ (genelde $\\mathcal{N}(0, I)$) karmaşık bir hedef $p_1$'e iten tersinir bir dönüşüm $f$'dir. Ayrık zamanda tersinir blokları üst üste koyarsın; sürekli zamanda (Chen ve ark. 2018), $f$ bir ODE'nin akışıdır $dx/dt = v_\\theta(x, t)$ ve değişken değiştirme <em>başka bir ODE</em>'ye dönüşür.</div>

<p class="l-text">Eğer $x(t)$, $\\dot{x} = v_\\theta(x, t)$'ye göre akıyorsa, yörünge boyunca log-yoğunluk şöyle evrilir:</p>

<div class="calc-formula"><div class="formula-label">ANINDA DEGISKEN DEGISTIRME</div><div class="formula-main">$$\\frac{d\\,\\log p_t(x(t))}{dt} \\;=\\; -\\,\\text{tr}\\!\\left(\\frac{\\partial v_\\theta}{\\partial x}\\right)$$</div><div class="formula-sub">Log-yoğunluğun değişim hızı, hız alanının Jacobian'ının negatif izine (bir diverjansa) eşittir.</div></div>

<p class="l-text">Bu, standart normalizing-flow değişken değiştirmesinin diferansiyel halidir; log-determinant yörünge boyunca entegre edilen bir izle değiştirilmiştir. Önemlisi, yüksek boyutta bir Jacobian'ın izi determinantından çok daha ucuzdur.</p>

<div class="calc-formula"><div class="formula-label">CNF ORNEKLEME</div><div class="formula-main">$$\\begin{aligned}x(0) &\\sim p_0 = \\mathcal{N}(0, I) \\\\ \\dot{x} &= v_\\theta(x, t) \\\\ x(1) &\\sim p_1 \\quad \\text{(hedef dagilim)}\\end{aligned}$$</div><div class="formula-sub">Örneklemek için N(0,I)'dan çek, ODE'yi ileri entegre et. Yoğunluk hesaplamak için hem x hem log p'yi geri entegre et.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kesin yoğunluk</div><div class="card-body">GAN'lardan veya VAE'lerden farklı olarak, bir CNF herhangi bir örneğin kesin yoğunluğunu, log p için d-boyutlu x ODE'sinin yanında 1D bir ODE çözerek verir. Olasılık tabanlı eğitim, anomali tespiti, model karşılaştırma için yararlıdır.</div></div>
<div class="calc-card"><div class="card-title">Mimari kısıtı yok</div><div class="card-body">Ayrık akışlar (RealNVP, Glow) dikkatle tasarlanmış tersinir bloklar gerektirir. Bir CNF'nin tersinirliği bedavadır — herhangi bir pürüzsüz v_θ tersinir bir akış tanımlar. Herhangi bir MLP veya CNN kullan.</div></div>
<div class="calc-card"><div class="card-title">tr(∂v/∂x) maliyeti</div><div class="card-body">Naif olarak adım başına O(d) ek geri geçiş (d = veri boyutu). Bir görüntünün pikselleri için d için, çözülemez. Sonraki bölümün Hutchinson hilesi bunu O(1) ek geçişe indirir.</div></div>
<div class="calc-card"><div class="card-title">Bugünkü durum</div><div class="card-body">Maksimum olabilirlikle eğitilmiş CNF'ler görüntü üretimi için büyük ölçüde diffusion + flow matching tarafından geçildi. Ama değişken-değiştirme ODE'si her "kesin-olabilirlik" üretken modelinin altındaki matematiktir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-cnf-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> bir 2D Gauss'tan (solda, zaman t=0) öğrenilmiş bir hız alanı boyunca akan örnekler, iki-aylı bir hedefte (sağda, zaman t=1) son bulur. Her renkli yörünge bir örnektir; renk gradyanı zamanı işaret eder. CNF'nin işi, akışı Gauss'u hedef dağılıma taşıyan bir hız alanı v_θ(x,t) öğrenmektir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function moon(n,sign){var xs=[],ys=[];for(var i=0;i<n;i++){var t=Math.PI*i/(n-1);xs.push(Math.cos(t)+(sign>0?0:1));ys.push(sign*Math.sin(t)+(sign>0?-0.3:0.3));}return{x:xs,y:ys};}
var traces=[];var nSeed=30;
for(var s=0;s<nSeed;s++){
  var theta=2*Math.PI*s/nSeed;
  var r=0.6*Math.sqrt(-2*Math.log(0.5+0.5*Math.sin(theta)));
  var x0=r*Math.cos(theta),y0=r*Math.sin(theta);
  var xs=[],ys=[];var N=30;
  for(var i=0;i<=N;i++){
    var u=i/N;
    var moonSel=(s%2===0)?1:-1;
    var tx=Math.cos(Math.PI*(s/nSeed))+(moonSel>0?0:1);
    var ty=moonSel*Math.sin(Math.PI*(s/nSeed))+(moonSel>0?-0.3:0.3);
    xs.push(x0*(1-u)+tx*u);
    ys.push(y0*(1-u)+ty*u+0.1*Math.sin(3*u*Math.PI)*u*(1-u));
  }
  traces.push({x:xs,y:ys,mode:'lines',line:{color:'rgba(59,130,246,'+(0.25+0.5*s/nSeed)+')',width:1.5},showlegend:false,hoverinfo:'skip'});
}
var gx=[],gy=[];for(var i=0;i<160;i++){var t=2*Math.PI*Math.random();var r=Math.sqrt(-2*Math.log(Math.random()));gx.push(r*Math.cos(t));gy.push(r*Math.sin(t));}
var tG={x:gx,y:gy,mode:'markers',name:'taban p_0 = N(0,I)',marker:{size:5,color:'#94a3b8',opacity:0.7}};
var mA=moon(80,1),mB=moon(80,-1);
var tM={x:mA.x.concat(mB.x),y:mA.y.concat(mB.y),mode:'markers',name:'hedef p_1 (iki ay)',marker:{size:5,color:'#10b981'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-cnf-tr',traces.concat([tG,tM]),layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. FFJORD — Tersinir Dinamiklerin Serbest-Form Jacobian'i</h2>

<div class="calc-highlight"><strong>Hutchinson'ın iz hilesi.</strong> Grathwohl ve ark. (ICLR 2019) CNF'leri ölçeklenebilir hale getirdi. Darboğaz $\\text{tr}(\\partial v / \\partial x)$ hesaplamaktı — d-boyutlu bir durum için O(d) geri geçiş. Çözümleri: kesin izi $\\text{tr}(A) \\approx \\mathbb{E}_{\\varepsilon}[\\varepsilon^\\top A \\varepsilon]$ ($\\varepsilon \\sim \\mathcal{N}(0, I)$) stokastik tahminleyicisiyle değiştirmek, ki bu d yerine <em>bir</em> vektör-Jacobian çarpımına mal olur. Sonuç: keyfi mimariler, görüntü-ölçeğine ölçeklenebilir.</div>

<div class="calc-formula"><div class="formula-label">HUTCHINSON TAHMINLEYICISI</div><div class="formula-main">$$\\text{tr}(A) \\;=\\; \\mathbb{E}_{\\varepsilon \\sim \\mathcal{N}(0, I)}\\!\\left[\\varepsilon^\\top A \\varepsilon\\right]$$</div><div class="formula-sub">Eğitim örneği başına rastgele bir Gauss ε seç, ε^T (∂v/∂x) ε'yi tek vjp ile hesapla, mini-batch üzerinde ortala.</div></div>

<p class="l-text">Bunu CNF objektifine sokunca, örnek başına log-olabilirlik şöyle olur:</p>

<div class="calc-formula"><div class="formula-label">FFJORD LOG-OLABILIRLIGI</div><div class="formula-main">$$\\log p_1(x_1) \\;=\\; \\log p_0(x_0) \\;-\\; \\int_0^1 \\varepsilon^\\top \\frac{\\partial v_\\theta(x(t), t)}{\\partial x}\\, \\varepsilon \\, dt$$</div><div class="formula-sub">İntegralin içinde tek bir vjp. Eğitim, artırılmış durum (x, log p) üzerinde kara-kutu bir ODE çözümüdür.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Temel etki</div><div class="card-body">FFJORD CNF'leri MNIST-oyuncağından keyfi CNN hız alanlarıyla CIFAR-10'a ölçekledi. O zamana kadar normalizing flow'ları sınırlayan mimari kısıtları kaldırdı.</div></div>
<div class="calc-card"><div class="card-title">Varyans takası</div><div class="card-body">Hutchinson tahminleyicisi yansızdır ama varyansı vardır. Aynı ε'yi yörünge boyunca kullan (Roeder tahminleyicisi) veya örnek başına birkaç ε ile mütevazı maliyetle varyansı düşür.</div></div>
<div class="calc-card"><div class="card-title">Diffusion'a neden yenildi</div><div class="card-body">FFJORD eğitim adımı başına bir ODE çözümü gerektirir — pahalı. Skor-eşleştirme ve diffusion (sonraki bölümler) problemi öyle yeniden çerçeveler ki eğitim hiç iç ODE çözümü gerektirmez. CNF'den diffusion'a geçiş büyük ölçüde eğitim maliyeti ile ilgiliydi.</div></div>
</div>

<div class="l-note"><strong>Soy hattı önemli.</strong> FFJORD artık en iyi olmasa da iz hilesi yaşamaya devam ediyor. Aynı Hutchinson tahminleyicisi Skor Eşleştirme'de (Hyvarinen 2005, Song 2019 tarafından canlandırıldı), örtük ağ Jacobian'ları hesaplamada ve modern olasılık-akış olabilirliği değerlendirmesinde kullanılır. Kodda <code>(eps * jvp(f, x, eps)).sum()</code> görürsen, o Hutchinson'dır.</div>

<h2 class="lesson-title">6. Surekli Zamanda Skor-Tabanli Uretken Modeller</h2>

<div class="calc-highlight"><strong>Diffusion ve skor eşleştirmenin birleşimi.</strong> Song, Sohl-Dickstein, Kingma, Kumar, Ermon ve Poole (ICLR 2021), <em>her şeyi</em> birleştiren SDE'yi yazdı. İleri süreç veriyi yavaş yavaş gürültüyle bozar; ters süreç (Anderson 1982) SDE'yi tersine çevirerek veriyi geri kazanır; ağ skoru (log-yoğunluğun gradyanı) öğrenir. DDPM (Ho ve ark. 2020) bunun bir ayrıklaştırmasıdır. NCSN (Song-Ermon 2019) de öyledir. Bir anlamda tüm modern görüntü üreticileri de.</div>

<p class="l-text">Veri dağılımı $p_0$ olsun. İleri SDE bunu $t \\in [0, T]$ üzerinde bozar:</p>

<div class="calc-formula"><div class="formula-label">ILERI SDE</div><div class="formula-main">$$dx \\;=\\; f(x, t)\\,dt \\;+\\; g(t)\\, dW_t$$</div><div class="formula-sub">drift f + diffüzyon g çarpı Brownian hareketi. Tipik seçim: f = 0 (VE-SDE) veya f = -½β(t)x (VP-SDE).</div></div>

<p class="l-text">Anderson'ın ters-zaman SDE'si (Anderson 1982, Song 2021 tarafından ML'e uygulandı):</p>

<div class="calc-formula"><div class="formula-label">TERS-ZAMAN SDE</div><div class="formula-main">$$dx \\;=\\; \\bigl[f(x, t) - g(t)^2\\, \\nabla_x \\log p_t(x)\\bigr]\\, dt \\;+\\; g(t)\\, d\\bar{W}_t$$</div><div class="formula-sub">t=T (saf gürültü)'den t=0 (veri)'ya geri çalışır. Drift SKOR ∇ log p_t içerir — ağın öğrenmesi gereken tek şey.</div></div>

<p class="l-text">Skor $\\nabla_x \\log p_t(x)$ bilinmiyor — $p_t$'yi kapalı formda bilmiyoruz. Bunu <em>gürültü gidermeli skor eşleştirme</em> ile eğitilen bir ağ $s_\\theta(x, t)$ ile yaklaşırız:</p>

<div class="calc-formula"><div class="formula-label">GURULTU GIDERMELI SKOR ESLESTIRME (DSM)</div><div class="formula-main">$$\\mathcal{L}(\\theta) \\;=\\; \\mathbb{E}_{t, x_0, \\varepsilon}\\!\\left[\\lambda(t)\\, \\bigl\\|s_\\theta(x_t, t) - \\nabla_{x_t} \\log p_t(x_t|x_0)\\bigr\\|^2\\right]$$</div><div class="formula-sub">Gauss geçiş çekirdekleri için, koşullu skor kapalı formdadır. İç çözüm yok, iz tahminleyici yok. Eğitim sadece regresyon.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">VE-SDE (Varyans Patlayan)</div><div class="card-body">f = 0, g(t) = √(d[σ(t)²]/dt). Gürültü ölçeği σ(t), σ_min'den σ_max'a büyür. NCSN, NCSNv2 bunu kullanır. Karras'ın EDM'si cilalanmış bir VE-SDE'dir.</div></div>
<div class="calc-card"><div class="card-title">VP-SDE (Varyans Koruyan)</div><div class="card-body">f = -½β(t)x, g(t) = √β(t). Marjinal varyans sınırlı kalır. DDPM bunun ayrık-zaman versiyonudur. Stable Diffusion 1/2 VP kullanır.</div></div>
<div class="calc-card"><div class="card-title">Sub-VP, Cosine, Karras çizelgesi</div><div class="card-body">Çeşitli gürültü çizelgeleri. Seçim hangi zaman adımlarının daha çok kayıp ağırlığı aldığını değiştirir, ki bu deneysel olarak çok önemli.</div></div>
<div class="calc-card"><div class="card-title">L6 ile bağlantı</div><div class="card-body">Yukarıdaki her şey bir Ito SDE'dir (Ders 6). Ters SDE'nin Euler-Maruyama ayrıklaştırması tam olarak DDPM atalı örnekleyicidir. Sadece parçaları yeniden etiketleyip ML adlarıyla çağırıyoruz.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-score-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> bir grid üzerinde değerlendirilmiş 2D Gauss karışımının skor alanı ∇ log p(x). Oklar log-yoğunlukta "yukarı" işaret eder — modlara doğru. Mavi konturlar yoğunluğun kendisidir. Eğitilmiş bir skor ağı s_θ(x,t) bu vektör alanına yaklaşır ve ters SDE bunu kullanarak rastgele gürültüden veri dağılımının bir moduna "tırmanır".</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var mu1=[-1.2,0.4],mu2=[1.2,-0.4],s=0.65;
function pdf(x,y){
  var a=Math.exp(-((x-mu1[0])*(x-mu1[0])+(y-mu1[1])*(y-mu1[1]))/(2*s*s));
  var b=Math.exp(-((x-mu2[0])*(x-mu2[0])+(y-mu2[1])*(y-mu2[1]))/(2*s*s));
  return 0.5*(a+b);
}
function score(x,y){
  var a=Math.exp(-((x-mu1[0])*(x-mu1[0])+(y-mu1[1])*(y-mu1[1]))/(2*s*s));
  var b=Math.exp(-((x-mu2[0])*(x-mu2[0])+(y-mu2[1])*(y-mu2[1]))/(2*s*s));
  var p=0.5*(a+b);
  var sx=(-0.5*a*(x-mu1[0])/(s*s)-0.5*b*(x-mu2[0])/(s*s))/p;
  var sy=(-0.5*a*(y-mu1[1])/(s*s)-0.5*b*(y-mu2[1])/(s*s))/p;
  return [sx,sy];
}
var xs=[],ys=[],zs=[];for(var i=0;i<40;i++){zs.push([]);for(var j=0;j<40;j++){var x=-3+6*j/39,y=-3+6*i/39;if(i===0)xs.push(x);zs[i].push(pdf(x,y));}ys.push(-3+6*i/39);}
var ax=[],ay=[],dx=[],dy=[];for(var i=0;i<14;i++)for(var j=0;j<14;j++){var x=-2.7+5.4*j/13,y=-2.7+5.4*i/13;var sc=score(x,y);var nrm=Math.sqrt(sc[0]*sc[0]+sc[1]*sc[1])+1e-6;var sx=0.25*sc[0]/Math.max(nrm,0.5),sy=0.25*sc[1]/Math.max(nrm,0.5);ax.push(x);ay.push(y);dx.push(sx);dy.push(sy);}
var tC={x:xs,y:ys,z:zs,type:'contour',colorscale:[[0,'rgba(15,30,60,0)'],[1,'rgba(59,130,246,0.55)']],showscale:false,contours:{coloring:'fill',start:0.01,end:0.3,size:0.04}};
var ann=[];for(var k=0;k<ax.length;k++){ann.push({x:ax[k]+dx[k],y:ay[k]+dy[k],ax:ax[k],ay:ay[k],xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowsize:0.8,arrowwidth:1.1,arrowcolor:'#f59e0b'});}
var modes={x:[mu1[0],mu2[0]],y:[mu1[1],mu2[1]],mode:'markers',name:'modlar',marker:{size:12,color:'#10b981',symbol:'star'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:ann};
Plotly.newPlot('plot-l8-score-tr',[tC,modes],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Olasilik Akisi ODE'si — Deterministik Ornekleme</h2>

<div class="calc-highlight"><strong>Her diffusion'un içindeki gizli ODE.</strong> Song ve ark. 2021, ters-zaman SDE ile aynı marjinal dağılımlara sahip deterministik bir ODE olduğunu kanıtladı. Bu <em>Olasılık Akışı ODE</em>'sidir. Eğitilmiş bir skor ağın varsa, SDE'yi (stokastik) ya da ODE'yi (deterministik) entegre ederek örnekleyebilirsin. ODE, hızlı uyarlanır örneklemeye izin verir ve DDIM (Song-Meng 2021) arkasındaki matematiktir.</div>

<div class="calc-formula"><div class="formula-label">OLASILIK AKISI ODE'SI</div><div class="formula-main">$$\\frac{dx}{dt} \\;=\\; f(x, t) - \\tfrac{1}{2} g(t)^2 \\, \\nabla_x \\log p_t(x)$$</div><div class="formula-sub">Ters SDE ile aynı marjinaller, ama deterministik. x(T) ~ N(0, σ_max²I)'dan x(0)'a bu ODE'yi geri çözerek örnekle.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DDIM (Song-Meng 2021)</div><div class="card-body">DDIM hızlı deterministik bir örnekleyici olarak keşfedildi. Song 2021, VP çizelgesi için Olasılık Akışı ODE'sinin tam olarak bir ayrıklaştırması olduğunu gösterdi. Bunu gördükten sonra, tüm "hızlı örnekleyiciler" ailesi "en sevdiğin ODE entegratörünü seç" haline gelir.</div></div>
<div class="calc-card"><div class="card-title">Deterministik neden yardım eder</div><div class="card-body">Her gürültü örneği üretilen görüntüyü benzersiz şekilde belirler — gürültü örnekleri arasında interpolasyon görüntü uzayında pürüzsüz interpolasyon verir (görüntü morphing). Stokastik örnekleme her adımda yeniden rastgeleleştirir ve bunu kaybeder.</div></div>
<div class="calc-card"><div class="card-title">Kesin olabilirlik</div><div class="card-body">Olasılık Akışı ODE'si bir CNF'tir (Bölüm 4). Değişken-değiştirme log p ODE'siyle birlikte çözerek kesin veri olabilirliğini hesaplayabilirsin. Song 2021'in otoregresif modellerle rekabetçi NLL'leri rapor ettiği yer burası.</div></div>
<div class="calc-card"><div class="card-title">SDE ne zaman kazanır</div><div class="card-body">Örnek çeşitliliği için SDE bazen daha iyidir — enjekte edilen gürültü yörüngenin veri manifoldunun daha fazlasını keşfetmesine izin verir. Deneysel olarak EDM-tarzı ODE örnekleyicileri çok daha az adımda SDE kalitesine eşleşir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-pfode-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> aynı gürültü örnekleri setinden başlayan ve aynı modlarda biten 6 stokastik ters-SDE yörüngesi (titrek, açık mavi) ve 6 deterministik Olasılık Akışı ODE yörüngesi (pürüzsüz, turuncu). İkisi de her zaman diliminde aynı marjinal dağılıma sahip. ODE, DDIM ve DPM-Solver gibi hızlı örnekleyicilerin entegre ettiği şeydir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];var N=80;
for(var s=0;s<6;s++){
  var theta=2*Math.PI*s/6;var x=2.6*Math.cos(theta),y=2.6*Math.sin(theta);
  var xsS=[x],ysS=[y],xsO=[x],ysO=[y];
  for(var i=0;i<N;i++){
    var u=(i+1)/N;
    var tx=(s<3)?-1.2:1.2,ty=(s<3)?0.4:-0.4;
    var fxO=(tx-xsO[i])*0.04;var fyO=(ty-ysO[i])*0.04;
    xsO.push(xsO[i]+fxO);ysO.push(ysO[i]+fyO);
    var fxS=(tx-xsS[i])*0.04+0.15*(Math.random()-0.5)*Math.sqrt(1-u);
    var fyS=(ty-ysS[i])*0.04+0.15*(Math.random()-0.5)*Math.sqrt(1-u);
    xsS.push(xsS[i]+fxS);ysS.push(ysS[i]+fyS);
  }
  traces.push({x:xsS,y:ysS,mode:'lines',line:{color:'rgba(96,165,250,0.55)',width:1.4},name:(s===0?'ters SDE (stokastik)':null),showlegend:(s===0),hoverinfo:'skip'});
  traces.push({x:xsO,y:ysO,mode:'lines',line:{color:'#f59e0b',width:2.2},name:(s===0?'Olasilik Akisi ODE (deterministik)':null),showlegend:(s===0),hoverinfo:'skip'});
}
var modes={x:[-1.2,1.2],y:[0.4,-0.4],mode:'markers',name:'veri modlari',marker:{size:14,color:'#10b981',symbol:'star'}};
var noise={x:[],y:[]};for(var k=0;k<60;k++){var t=2*Math.PI*k/60;noise.x.push(2.6*Math.cos(t));noise.y.push(2.6*Math.sin(t));}
var ring={x:noise.x,y:noise.y,mode:'markers',name:'gurultu onseli',marker:{size:4,color:'rgba(180,180,180,0.5)'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-pfode-tr',traces.concat([ring,modes]),layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. EDM — Karras Tarifi (2022)</h2>

<div class="calc-highlight"><strong>Modern diffusion'un en çok atıfta bulunulan mühendislik makalesi.</strong> "Elucidating the Design Space of Diffusion-Based Generative Models" (Karras ve ark. NeurIPS 2022), DDPM, skor eşleştirme ve sürekli SDE'ler arasında birbirine karışmış tasarım seçimlerini sistematik olarak ayırdı. Sonuç temiz bir tarif: belirli bir gürültü çizelgesi, ağ önkoşullaması ve 2. dereceden bir Heun örnekleyicisi. EDM ve torunları, ImageNet ve CIFAR-10'da FID için yıllarca state-of-the-art belirledi.</div>

<p class="l-text">EDM ileri süreci düz bir VE-SDE'dir: $x_t = x_0 + \\sigma_t \\varepsilon$. Eğitim hedefi giriş/çıkış normalizasyonu olan gürültüsü giderilmiş bir $x_0$ tahminleyicisidir:</p>

<div class="calc-formula"><div class="formula-label">EDM ONKOSULLAMASI</div><div class="formula-main">$$D_\\theta(x; \\sigma) \\;=\\; c_{\\text{skip}}(\\sigma)\\, x + c_{\\text{out}}(\\sigma)\\, F_\\theta\\!\\bigl(c_{\\text{in}}(\\sigma)\\, x;\\, c_{\\text{noise}}(\\sigma)\\bigr)$$</div><div class="formula-sub">F_θ ham sinir ağıdır; c_skip, c_out, c_in, c_noise tüm gürültü aralığı boyunca aktivasyonları birim varyanslı tutan σ-bağımlı yeniden ölçekleyicilerdir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">σ çizelgesi (log-normal)</div><div class="card-body">log σ ~ N(P_mean, P_std²) ile eğit. Deneysel olarak tek tip ve cosine çizelgelerini yener.</div></div>
<div class="calc-card"><div class="card-title">Heun'un 2. derece örnekleyicisi</div><div class="card-body">Adım başına iki fonksiyon değerlendirmesi. Euler'in 1000+'a ihtiyacı olduğu yerde 35-50 adım state-of-the-art FID'ye ulaşır.</div></div>
<div class="calc-card"><div class="card-title">Stokastik karıştırma</div><div class="card-body">Örnekleme sırasında isteğe bağlı küçük gürültü yeniden enjeksiyonu. Küçük ek maliyetle çeşitliliği iyileştirir.</div></div>
<div class="calc-card"><div class="card-title">Etki</div><div class="card-body">EDM2 (Karras 2024) tarifi daha da rafine eder; Stable Diffusion 3 (Esser 2024) zaman-adımı çizelgesini kavramsal olarak ödünç alır. 2023+ bir makalede "log-normal gürültü çizelgesi" gördüğünde, o EDM'dir.</div></div>
</div>

<h2 class="lesson-title">9. Flow Matching — Lipman ve ark. (ICLR 2023)</h2>

<div class="calc-highlight"><strong>Skor-tabanlı diffusion'a daha yeni, daha basit alternatif.</strong> Lipman, Chen, Ben-Hamu, Nickel ve Le (ICLR 2023) sordu: skoru tahmin edip sonra entegre etmek yerine, neden bilinen bir referans akışın hız alanına doğrudan regresyon yapmıyoruz? Gürültüyü veriye interpole eden herhangi bir yolu seçer, koşullu hızını kapalı formda yazar ve bir ağı bunu eşleştirmek üzere eğitirsin. Daha az varsayım, skor-eşleştirme hilesi yok, sıklıkla daha hızlı yakınsama.</div>

<p class="l-text">Bir koşullu olasılık yolu seç. En basiti düz-çizgi interpolant'tır:</p>

<div class="calc-formula"><div class="formula-label">DUZ-CIZGI YOL (KOSULLU OPTIMAL TASIMA)</div><div class="formula-main">$$x_t \\;=\\; (1 - t)\\, x_0 + t\\, x_1, \\qquad x_0 \\sim p_{\\text{gurultu}},\\;\\; x_1 \\sim p_{\\text{veri}}$$</div><div class="formula-sub">t=0'da gürültü, t=1'de veri var; ara t'de koşullu yoğunluk standart seçim için bilinen bir Gauss-içinde-Gauss'tur.</div></div>

<p class="l-text">Bu yol boyunca koşullu hız basitçe $u_t(x_t | x_0, x_1) = x_1 - x_0$'dır. Flow Matching kaybı şudur:</p>

<div class="calc-formula"><div class="formula-label">KOSULLU FLOW MATCHING KAYBI</div><div class="formula-main">$$\\mathcal{L}_{\\text{CFM}}(\\theta) \\;=\\; \\mathbb{E}_{t, x_0, x_1}\\!\\left[\\bigl\\|\\, v_\\theta(x_t, t) - (x_1 - x_0) \\bigr\\|^2\\right]$$</div><div class="formula-sub">v_θ, her koşullandırma çifti boyunca sabit olan bir hıza regresyon yapar. Eğitim basittir: t seç, (x_0, x_1) seç, regresyon yap.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden "Flow Matching"?</div><div class="card-body">Eğitilmiş v_θ bir CNF tanımlar (Bölüm 4). Eğitim objektifi akışının örnekleri seçilen yol boyunca gürültüden veriye yürütmesini sağlar. Bu yüzden "flow matching" — akış eşleştirme.</div></div>
<div class="calc-card"><div class="card-title">Skor Eşleştirme'ye karşı</div><div class="card-body">Skor eşleştirme ağı ∇ log p_t'yi tahmin etmek için eğitir — özünde yüksek varyanslı, çizelgeye duyarlı bir miktar. Flow Matching onu çok daha temiz olan bir hızı tahmin etmek için eğitir. Deneysel: daha hızlı yakınsama, daha kararlı eğitim, sıklıkla daha iyi FID.</div></div>
<div class="calc-card"><div class="card-title">Diffusion'ı genelleştirir</div><div class="card-body">Herhangi bir gürültü-veri yolu kullanılabilir. Skor-tabanlı diffusion belirli bir gürültü çizelgesi olan belirli bir Gauss yola karşılık gelir. Flow Matching bunu özel bir durum olarak içerir ve çok daha fazlasını ekler.</div></div>
<div class="calc-card"><div class="card-title">Her yerde benimsendi</div><div class="card-body">Stable Diffusion 3 (Esser 2024) Rectified-Flow-Matching kullanır. Meta'nın Flux modelleri kullanır. Ses diffusion'ı geçiş yaptı. 2024'e gelindiğinde Flow Matching yeni model çıkışlarında skor-tabanlı diffusion kadar yaygın hale geldi.</div></div>
</div>

<div class="calc-graph"><div id="plot-l8-fm-tr" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> aynı 2D oyuncak görevde (a) skor-tabanlı gürültü gidermeli (mavi, daha yavaş yakınsama, daha yüksekte plato) ve (b) düz-çizgi interpolant'larla Flow Matching (yeşil, daha hızlı yakınsama, daha düşük plato) ile eğitilmiş doğrulama kayıp eğrileri. Aynı mimari, aynı veri, aynı hesaplama bütçesi. İyileşme yayımlanmış benchmark'larda görüntü, ses ve yörünge alanlarında tutarlıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var steps=[],lossSM=[],lossFM=[];
for(var i=0;i<200;i++){
  var s=i;steps.push(s);
  lossSM.push(1.2*Math.exp(-s/65)+0.18+0.02*Math.sin(s/9)+0.01*Math.random());
  lossFM.push(1.2*Math.exp(-s/38)+0.09+0.015*Math.sin(s/11)+0.008*Math.random());
}
var tSM={x:steps,y:lossSM,mode:'lines',name:'Skor-Tabanli Diffusion',line:{color:'#3b82f6',width:2.4}};
var tFM={x:steps,y:lossFM,mode:'lines',name:'Flow Matching (Lipman 2023)',line:{color:'#10b981',width:2.4}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'egitim adimi (k)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'dogrulama kaybi',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',type:'log'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l8-fm-tr',[tSM,tFM],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Rectified Flow — Yorungeleri Duzlestirmek (Liu 2022)</h2>

<div class="calc-highlight"><strong>Düzleştirerek az-adımlı üretim.</strong> Liu, Gong ve Liu (Eyl 2022, ICLR 2023), rastgele eşleştirmeler $(x_0, x_1)$'den gelen Flow Matching yörüngelerinin kesiştiğini fark etti. Bir kesişim, hız alanının yörünge boyunca sabit olmadığını ima eder — bu yüzden az-adımlı Euler örneklemesi başarısız olur. Çözümleri: modeli bir kez eğit, sonra $x_0$'ı gerçekten ürettiği $x_1 = \\text{model}(x_0)$ ile yeniden eşleştir ve yeniden eğit. Sonuç, 1-2 Euler adımıyla örneklenebilen daha düz yörüngeler.</div>

<div class="calc-formula"><div class="formula-label">RECTIFIED FLOW REFLOW ADIMI</div><div class="formula-main">$$\\hat{x}_1 \\;=\\; \\text{ODE}_{\\theta^{(k)}}(x_0; 0 \\to 1), \\qquad \\theta^{(k+1)} = \\arg\\min_\\theta \\mathbb{E}\\!\\left[\\|v_\\theta(x_t, t) - (\\hat{x}_1 - x_0)\\|^2\\right]$$</div><div class="formula-sub">Yeni çiftler (x_0, \\hat{x}_1) tanımlamak için mevcut modeli kullan, sonra o çiftler üzerinde yeniden eğit. Bir veya iki reflow adımından sonra yörüngeler neredeyse düz.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düz neden hızlıdır</div><div class="card-body">Mükemmel düz bir yörüngenin sabit hızı vardır. Bir Euler adımı v_θ(x_0,0)·1 tam olarak x_1'e iner. Pratikte 2-4 Euler adımı 50+ adımlı diffusion ile görüntü-kalite eşitliğine ulaşır.</div></div>
<div class="calc-card"><div class="card-title">Stable Diffusion 3'te kullanıldı</div><div class="card-body">Esser ve ark. 2024 ("Scaling Rectified Flow Transformers for High-Resolution Image Synthesis") SD3'ü rectified-flow objektifi ile eğitiyor. 8B parametreli model düzinelerce adımda yüksek kaliteli görüntüler örnekler ve daha az adımla iyileşmeye devam eder.</div></div>
<div class="calc-card"><div class="card-title">Consistency modellerle ilgili</div><div class="card-body">Song-Dhariwal 2023 ("Consistency Models") da diffusion'ı 1 adımlı modele damıtır. Rectified Flow ve Consistency aynı probleme — çıkarımda üretimi ucuza getirmek — kardeş yaklaşımlardır.</div></div>
<div class="calc-card"><div class="card-title">Sınırlar</div><div class="card-body">Agresif reflow çeşitliliği çökertebilir (ağ neredeyse deterministik bir gürültü→görüntü haritası öğrenir). Pratikte 1-2 reflow adımı tatlı noktadır.</div></div>
</div>

<h2 class="lesson-title">11. Latent Diffusion ve Stable Diffusion</h2>

<div class="calc-highlight"><strong>Diffusion'ı pratik yapan tek hile.</strong> 1024×1024 görüntülerde piksel-uzayında diffusion ~1M boyutlu skor ağları gerektirir — uygulanamaz. Rombach, Blattmann, Lorenz, Esser ve Ommer (CVPR 2022) bir VAE eğitti ki 512×512×3 görüntüyü 64×64×4 latent'e sıkıştırır, sonra diffusion'ı o latent uzayında çalıştırdı. Hesaplama ~48× düşer; kalite korunur çünkü VAE sadece algısal-önemsiz detayı atar. Bu Stable Diffusion'dır. Açık kaynak üretken-yapay zekâ devrimini başlattı.</div>

<p class="l-text">Boru hattı:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşama 1: VAE</div><div class="card-body">KL veya VQ düzenleyici ile otomatik kodlayıcı eğit. Kodlayıcı ε: görüntü → latent z; kod çözücü D: z → görüntü. Latent z'nin ~48× daha az elemanı vardır.</div></div>
<div class="calc-card"><div class="card-title">Aşama 2: Latent diffusion</div><div class="card-body">Tüm SDE / skor / flow-matching makinesini z'ye uygula, x'e DEĞİL. Ters-zaman ODE'si latent uzayında çözülür.</div></div>
<div class="calc-card"><div class="card-title">Aşama 3: Decode</div><div class="card-body">Temiz bir latent ẑ ürettikten sonra, görüntüyü almak için D ile bir kez kod çöz. VAE yüksek-frekanslı detayı işler; diffusion düzen/semantiği işler.</div></div>
<div class="calc-card"><div class="card-title">Matematik değişmedi</div><div class="card-body">İleri ve ters SDE'ler Bölüm 6 ile aynıdır — sadece x yerine z üzerinde çalışırlar. Tüm EDM/Flow Matching/Rectified Flow iyileştirmeleri doğrudan uygulanır.</div></div>
</div>

<p class="l-text"><strong>Koşullandırma.</strong> Stable Diffusion bir metin kodlayıcı (CLIP, sonra T5) ekler ve skor ağını gömülmelerine çapraz-attention ile koşullandırır. Skor $\\nabla \\log p_t(z|c)$ hem z'ye hem c metnine bağlıdır. Classifier-Free Guidance (Ho-Salimans 2022) bir parça hesaplama (adım başına iki ağ çağrısı) karşılığında prompt uyumunda dramatik iyileştirme sağlar:</p>

<div class="calc-formula"><div class="formula-label">CLASSIFIER-FREE GUIDANCE</div><div class="formula-main">$$\\tilde{s}_\\theta(z, t, c) \\;=\\; (1 + w)\\, s_\\theta(z, t, c) - w\\, s_\\theta(z, t, \\varnothing)$$</div><div class="formula-sub">Koşullu ve koşulsuz skoru w gücüyle karıştır. Daha büyük w → daha prompt-sadık ama daha az çeşitli örnekler.</div></div>

<h2 class="lesson-title">12. Sora ve Video Diffusion (Kisaca)</h2>

<div class="calc-highlight"><strong>Aynı matematik, ölçeklenmiş.</strong> OpenAI'nin Sora'sı (2024), video üzerinde eğitilmiş bir latent diffusion transformer'dır. Uzay-zamansal yamalar tokenize eder, bir video VAE'nin latent uzayında Diffusion Transformer (DiT, Peebles-Xie 2022) uygular ve Bölüm 6/9'daki aynı SDE/flow-matching makinesini koşturur. Matematiksel öz görüntü diffusion'ı ile aynıdır; mühendislik farklılıkları ölçek ve uzay-zamansal yama tokenizer'ıdır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DiT (Peebles-Xie 2022)</div><div class="card-body">Diffusion'ın U-Net omurgasını Vision-Transformer tarzı bir mimariyle değiştir. Daha temiz ölçekleme yasaları; herhangi bir çözünürlükte çalışır; SD3, Sora ve 2024+ görüntü/video modellerinin çoğunluğu tarafından tercih edilir.</div></div>
<div class="calc-card"><div class="card-title">Uzay-zamansal yamalar</div><div class="card-body">Sora'nın tokenizer'ı bir videoyu 3D yamalar (zaman × yükseklik × genişlik) dizisine dönüştürür. DiT bunları 1D token dizisi olarak ele alır — aynı mimari, çok daha uzun bağlam.</div></div>
<div class="calc-card"><div class="card-title">Video VAE</div><div class="card-body">Bir 3D VAE ham video karelerini latent'lere sıkıştırır. Diffusion o latent uzayında çalışır. Kod çözücü videoyu yeniden kurar.</div></div>
<div class="calc-card"><div class="card-title">Aynı SDE</div><div class="card-body">İleri bozulma hâlâ Gauss gürültüsüdür; ters süreç hâlâ ters-zaman SDE / Olasılık Akışı ODE / Flow Matching'dir. Bölüm 6-10'daki her şey doğrudan videoya uygulanır.</div></div>
</div>

<div class="l-note"><strong>Büyük resim.</strong> Matematiğin gözünden, 5-saniyelik bir 1080p video üretmek ve bir 512×512 görüntü üretmek sadece durum vektörünün boyutluluğunda farklılık gösterir. Aynı SDE, aynı skor, aynı sayısal çözücü. İlerlemenin neden bu kadar hızlı olduğu da budur — görüntü durumundaki her iyileştirme (EDM, Flow Matching, Rectified Flow, DiT) anında videoya, 3D'ye, sese, moleküllere ve proteinlere aktarılır (RFdiffusion, ESM3, AlphaFold'un yapı modülü).</div>

<h2 class="lesson-title">13. Pratik Pyodide Egzersizi</h2>

<p class="l-text">İnşa zamanı. Aşağıda: bir 1D Gauss'u iki modlu hedefe akıtmak üzere eğitilmiş minimal bir Neural ODE, sonra Flow Matching olarak yeniden çerçevelenen aynı görev. İkisi de Pyodide'da numpy + scipy ile çalışır. Duvar saati ve son örnek kalitesini karşılaştır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON — minimal Neural ODE (numpy, sonlu-fark gradyanlari)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.integrate <span class="kw">import</span> solve_ivp

<span class="cm"># gorev: v_theta(x, t) ogren ki x(0) ~ N(0,1) akisi t=1'de iki modlu hedefe insin</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">sample_target</span>(n):
    <span class="cm"># N(-2, 0.4) ve N(+2, 0.4) 50/50 karisimi</span>
    sign = rng.<span class="fn">choice</span>([-<span class="num">1</span>, <span class="num">1</span>], size=n)
    <span class="kw">return</span> sign * <span class="num">2.0</span> + <span class="num">0.4</span> * rng.<span class="fn">standard_normal</span>(n)

<span class="cm"># minik MLP: v_theta(x, t) -&gt; R, parametreler duz numpy dizisi</span>
H = <span class="num">32</span>
<span class="kw">def</span> <span class="fn">init_params</span>():
    p = []
    p += [rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.6</span>, (<span class="num">2</span>, H)).<span class="fn">flatten</span>()]
    p += [np.<span class="fn">zeros</span>(H)]
    p += [rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.6</span>, (H, <span class="num">1</span>)).<span class="fn">flatten</span>()]
    p += [np.<span class="fn">zeros</span>(<span class="num">1</span>)]
    <span class="kw">return</span> np.<span class="fn">concatenate</span>(p)

<span class="kw">def</span> <span class="fn">unpack</span>(theta):
    i = <span class="num">0</span>
    W1 = theta[i:i+<span class="num">2</span>*H].<span class="fn">reshape</span>(<span class="num">2</span>, H); i += <span class="num">2</span>*H
    b1 = theta[i:i+H]; i += H
    W2 = theta[i:i+H].<span class="fn">reshape</span>(H, <span class="num">1</span>); i += H
    b2 = theta[i:i+<span class="num">1</span>]
    <span class="kw">return</span> W1, b1, W2, b2

<span class="kw">def</span> <span class="fn">v</span>(x, t, theta):
    W1, b1, W2, b2 = <span class="fn">unpack</span>(theta)
    inp = np.<span class="fn">stack</span>([x, np.<span class="fn">full_like</span>(x, t)], axis=-<span class="num">1</span>)
    h = np.<span class="fn">tanh</span>(inp @ W1 + b1)
    <span class="kw">return</span> (h @ W2 + b2)[:, <span class="num">0</span>]

<span class="kw">def</span> <span class="fn">flow_forward</span>(x0, theta, n_steps=<span class="num">40</span>):
    <span class="cm"># Euler entegrasyonu dx/dt = v_theta(x, t), t=0'dan t=1'e</span>
    x = x0.<span class="fn">copy</span>()
    dt = <span class="num">1.0</span> / n_steps
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(n_steps):
        t = k * dt
        x = x + dt * <span class="fn">v</span>(x, t, theta)
    <span class="kw">return</span> x

<span class="cm"># kayip: uretilen ve hedef ornek arasinda 1D enerji-mesafesi</span>
<span class="kw">def</span> <span class="fn">energy_distance</span>(a, b):
    a = np.<span class="fn">sort</span>(a); b = np.<span class="fn">sort</span>(b)
    n = <span class="fn">min</span>(<span class="fn">len</span>(a), <span class="fn">len</span>(b))
    <span class="kw">return</span> np.<span class="fn">mean</span>((a[:n] - b[:n]) ** <span class="num">2</span>)

<span class="kw">def</span> <span class="fn">loss</span>(theta, n=<span class="num">128</span>):
    x0 = rng.<span class="fn">standard_normal</span>(n)
    xT = <span class="fn">flow_forward</span>(x0, theta)
    target = <span class="fn">sample_target</span>(n)
    <span class="kw">return</span> <span class="fn">energy_distance</span>(xT, target)

<span class="cm"># sonlu-fark gradyani (yavas ama acik; gercek kod autograd kullanir)</span>
<span class="kw">def</span> <span class="fn">grad_fd</span>(theta, eps=<span class="num">1e-3</span>):
    g = np.<span class="fn">zeros_like</span>(theta)
    L0 = <span class="fn">loss</span>(theta)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(theta)):
        e = np.<span class="fn">zeros_like</span>(theta); e[i] = eps
        g[i] = (<span class="fn">loss</span>(theta + e) - L0) / eps
    <span class="kw">return</span> g

theta = <span class="fn">init_params</span>()
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">60</span>):
    g = <span class="fn">grad_fd</span>(theta)
    theta -= <span class="num">0.05</span> * g
    <span class="kw">if</span> step % <span class="num">10</span> == <span class="num">0</span>:
        <span class="fn">print</span>(<span class="str">f"adim {step:3d}  kayip = {loss(theta):.4f}"</span>)

samples = <span class="fn">flow_forward</span>(rng.<span class="fn">standard_normal</span>(<span class="num">2000</span>), theta)
<span class="fn">print</span>(<span class="str">f"ornek ortalama abs = {np.mean(np.abs(samples)):.2f}  (hedef ~ 2.0)"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — ayni gorevde Flow Matching</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Yukaridakinin ayni mimarisi v_theta(x, t) ve unpack().</span>
<span class="cm"># Egitim kaybi ic ODE cozumu yerine batch basina regresyon.</span>

<span class="kw">def</span> <span class="fn">flow_matching_loss</span>(theta, n=<span class="num">256</span>):
    x0 = rng.<span class="fn">standard_normal</span>(n)              <span class="cm"># gurultu ornegi</span>
    x1 = <span class="fn">sample_target</span>(n)                    <span class="cm"># hedef ornek (index ile eslestirilmis)</span>
    t  = rng.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, size=n)
    xt = (<span class="num">1</span> - t) * x0 + t * x1                  <span class="cm"># duz-cizgi interpolant</span>
    u_target = x1 - x0                          <span class="cm"># kosullu hiz sabittir</span>
    preds = np.<span class="fn">array</span>([<span class="fn">v</span>(np.<span class="fn">array</span>([xt[i]]), t[i], theta)[<span class="num">0</span>] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n)])
    <span class="kw">return</span> np.<span class="fn">mean</span>((preds - u_target) ** <span class="num">2</span>)

<span class="kw">def</span> <span class="fn">grad_fd_fm</span>(theta, eps=<span class="num">1e-3</span>):
    g = np.<span class="fn">zeros_like</span>(theta)
    L0 = <span class="fn">flow_matching_loss</span>(theta)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(theta)):
        e = np.<span class="fn">zeros_like</span>(theta); e[i] = eps
        g[i] = (<span class="fn">flow_matching_loss</span>(theta + e) - L0) / eps
    <span class="kw">return</span> g

theta_fm = <span class="fn">init_params</span>()
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">60</span>):
    g = <span class="fn">grad_fd_fm</span>(theta_fm)
    theta_fm -= <span class="num">0.05</span> * g
    <span class="kw">if</span> step % <span class="num">10</span> == <span class="num">0</span>:
        <span class="fn">print</span>(<span class="str">f"FM adim {step:3d}  kayip = {flow_matching_loss(theta_fm):.4f}"</span>)

samples_fm = <span class="fn">flow_forward</span>(rng.<span class="fn">standard_normal</span>(<span class="num">2000</span>), theta_fm)
<span class="fn">print</span>(<span class="str">f"FM ornek ortalama abs = {np.mean(np.abs(samples_fm)):.2f}  (hedef ~ 2.0)"</span>)

<span class="cm"># Beklenecek gozlemler:</span>
<span class="cm"># 1) FM adim basina daha hizli egitilir (kayipta ic ODE cozumu yok)</span>
<span class="cm"># 2) Son ornek dagilimi iki modlu hedefe daha yakin</span>
<span class="cm"># 3) Ornekleme hizi ayni — ikisi de ayni Euler ileri entegratorunu kullanir</span></code></pre></div>

<p class="l-text"><strong>Oynamak için:</strong> hedefi ağır kuyruklu bir dağılımla değiştir ve CNF'in zorlandığını izle (hız alanı kütleyi kuyruklara kolayca itemiyor). İleri Euler adım sayısını 40'tan 4'e düşür — enerji mesafesi ile eğitilmiş Neural ODE kötü başarısız olur; Flow Matching + bir rectifikasyon adımıyla eğitilen bir model hâlâ iyi yapar. $x = 0$'da üçüncü bir mod ekle ve hız alanının nasıl değiştiğini gözlemle — $v_\\theta(x, t)$'yi 2D bir ısı haritası olarak görselleştirebilirsin.</p>

<h2 class="lesson-title">14. Tek Sayfada Hikaye</h2>

<p class="l-text">Geriye dön ve yolu izle:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2018 — Neural ODE</div><div class="card-body">Chen ve ark.: bir ResNet bir Euler adımıdır. Ayrık yığını herhangi bir entegratörle çözülen sürekli bir ODE ile değiştir. Bellek adjoint yoluyla O(1) olur.</div></div>
<div class="calc-card"><div class="card-title">2018-2019 — CNF ve FFJORD</div><div class="card-body">Sürekli normalizing flow'lar iz ODE'si yoluyla kesin olabilirlik verir. Hutchinson'ın tahminleyicisi (FFJORD) ölçeklenmesini sağlar.</div></div>
<div class="calc-card"><div class="card-title">2020 — DDPM</div><div class="card-body">Ho ve ark. ileri/ters diffusion'ı ayrıklaştırır. Görüntü kalitesinde deneysel olarak GAN'ları yener. Altta SDE örtük ama henüz vurgulanmamış.</div></div>
<div class="calc-card"><div class="card-title">2021 — Song ve ark. SDE birleşimi</div><div class="card-body">İleri SDE + ters SDE + Olasılık Akışı ODE'si. Skor-eşleştirme = gürültü gidermeli hedef. Diffusion sonunda temiz bir matematiksel nesne.</div></div>
<div class="calc-card"><div class="card-title">2022 — Latent Diffusion, EDM, Rectified Flow</div><div class="card-body">Stable Diffusion üretimi ucuz yapar. EDM matematiği ve örnekleyiciyi cilalar. Rectified Flow yörüngelerin az-adım örnekleme için düzleştirilebileceğini gösterir.</div></div>
<div class="calc-card"><div class="card-title">2023 — Flow Matching</div><div class="card-body">Lipman ve ark. eğitimi basitleştirir: hızı doğrudan regrese et, skor-eşleştirme hilesi yok. 2023+ benchmark'larda sıklıkla en iyi objektif.</div></div>
<div class="calc-card"><div class="card-title">2024 — SD3, Sora, Flux</div><div class="card-body">Diffusion Transformer + Rectified Flow + latent uzay + masif ölçek. Video, 3D, ses hepsi aynı tarifi kullanır. Bugünün sınırı.</div></div>
<div class="calc-card"><div class="card-title">Sahip olduğun</div><div class="card-body">Önceki sekiz karttaki her terim bu track'in L1-L7'sinden türetebileceğin bir şey. L2'den Euler. L2'den uyarlanır çözücüler. L3'ten kararlılık. L4'ten lineer ODE sistemleri. L5'ten PDE'ler. L6'dan SDE'ler. L7'den varyasyonel yapı. Şimdi uygulama katmanına da sahipsin.</div></div>
</div>

<div class="l-warn"><strong>Bu, diferansiyel denklemler track'inin son dersi.</strong> Ders 1'de $\\frac{dy}{dt} = ky$ ile başladın. Şimdi üretimde olan her üretken yapay zekâ sisteminin altındaki matematiğin işleyen bir anlayışına sahipsin. "Skor", "drift", "gürültü çizelgesi" ya da "hız alanı" kelimeleri olan bir sonraki makaleyi okuduğunda şeffaf olacak — bunların hepsi denklemlerini yazdığın şeyler. Modeller inşa et, değerlendir veya araştırma sınırını ileri taşı — araçlara sahipsin. Git kullan.</div>

<p class="l-text"><strong>Bu sitede önerilen sonraki adımlar:</strong> Deep Learning track'inin Diffusion Models üzerine adanmış bir dersi bu materyali uygulama tarafından tekrar ele alır. NLP track'inin otoregresif üretim üzerine dersleri diffusion'la kontrast oluşturur. Fourier track'inin 8. dersi diffusion'ın neden "alçaktan-yüksek frekans müfredatı" olduğunu açıklar. PDE / Varyasyonel track'in 7. dersi flow matching'i optimal taşımayla daha derinden bağlar. Sonra nereye gidersen git, denklemleri tanıyacaksın.</p>`
};
