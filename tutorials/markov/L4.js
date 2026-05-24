window.MARKOV_L4 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>If random-walk Metropolis is a drunkard exploring a posterior, Hamiltonian Monte Carlo is the same drunkard given a skateboard and a frictionless landscape.</strong> Once the model is differentiable, HMC turns gradients into momentum, lets the chain coast across the typical set in long ballistic strokes, and only stops to roll a Metropolis die when its physics simulation gets sloppy. The result is the single biggest improvement to general-purpose MCMC since Metropolis-Hastings — and the reason every modern probabilistic programming framework (Stan, PyMC, NumPyro, Turing.jl) defaults to a variant of HMC called <em>NUTS</em>.</p>

<p class="l-text">This lesson walks you from the random-walk pain that motivates HMC, through the physical analogy (potential energy, momentum, leapfrog integration), to the actual algorithm and the No-U-Turn Sampler that auto-tunes it. We close with the failure modes that haunt Bayesian deep learning in 2026 — divergent transitions, Neal's funnel, tree-depth saturation — and the practical fixes (non-centred reparametrisation, mass-matrix adaptation) that production Bayesian workflows live on. The Pyodide exercise at the end implements HMC from scratch on a correlated Gaussian and compares its effective sample size against vanilla Metropolis. The performance gap is shocking.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why random-walk Metropolis scales like O(N^2) on multivariate targets and HMC like O(N^{5/4})</li>
<li>Write the Hamiltonian H(x, p) = U(x) + K(p) for a target distribution and derive the equations of motion</li>
<li>Implement the leapfrog integrator and explain why its symplectic property is required for valid HMC</li>
<li>State the full HMC algorithm and its Metropolis-Hastings acceptance ratio</li>
<li>Use NUTS conceptually: U-turn termination, dual-averaging step-size adaptation, recursive doubling</li>
<li>Diagnose divergent transitions, tree-depth saturation, and Neal's funnel; apply non-centred reparametrisation</li>
</ul>
</div>

<h2 class="lesson-title">1. The Random-Walk Problem</h2>

<div class="calc-highlight"><strong>Everyday analogy.</strong> Imagine searching for a treasure inside a narrow cave system. Random-walk Metropolis is searching blindfolded — at every step you propose a small jump in a random direction, accept it if you can stand on the floor, reject it if you bump into a wall. You will eventually map the whole cave, but if the cave is long and thin you will spend an enormous amount of time bouncing between the walls and almost no time travelling along the long axis. HMC hands you a torch <em>and</em> tells you which way is downhill.</div>

<p class="l-text">Vanilla Metropolis-Hastings proposes the next state from a Gaussian centred at the current one: $x_{\\text{prop}} \\sim \\mathcal{N}(x_t, \\epsilon^2 I)$. The step size $\\epsilon$ has to satisfy two competing requirements. Too small, and consecutive samples are almost identical — the chain explores the posterior at a glacial pace. Too large, and almost every proposal is rejected because it lands in the tails. The sweet spot is well known: for a multivariate Gaussian target, Roberts and Rosenthal (1997) showed the optimal acceptance rate is 0.234 and the optimal $\\epsilon$ scales like the <em>smallest</em> standard deviation of the target.</p>

<div class="calc-formula"><div class="formula-label">RANDOM-WALK MIXING TIME — THE PAIN</div><div class="formula-main">$$\\tau_{\\text{RW}} \\sim \\left(\\frac{\\sigma_{\\max}}{\\sigma_{\\min}}\\right)^{2} \\cdot d$$</div><div class="formula-sub">For a d-dimensional Gaussian with anisotropic scales, the mixing time grows quadratically in the condition number and linearly in dimension. A condition number of 100 in 100 dimensions means ~10^6 iterations to draw one effectively independent sample.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Drunkard's walk</div><div class="card-body">A random walk takes O(N^2) steps to traverse a distance of N. This is the fundamental reason vanilla MCMC scales badly on long, narrow, or correlated posteriors. Neural-network posteriors have <em>both</em> long axes (poorly identified directions) and short axes (sharp eigenvalues) simultaneously.</div></div>
<div class="calc-card"><div class="card-title">Anisotropy bites hard</div><div class="card-body">If the smallest scale is 100x smaller than the largest, you need step size matched to the small scale — but then it takes 100x more steps to traverse the long axis. Random-walk efficiency falls as the square of the condition number.</div></div>
<div class="calc-card"><div class="card-title">Curse of dimensionality</div><div class="card-body">In high dimensions the typical set of a Gaussian is a thin shell, not the centre. Random-walk proposals fall outside the shell with high probability, so acceptance drops to almost zero unless $\\epsilon$ is squeezed to O(1/sqrt(d)).</div></div>
<div class="calc-card"><div class="card-title">The hidden cost</div><div class="card-body">Reporting "1000 MCMC iterations" hides the fact that the effective sample size (ESS) may be 5 — you got 5 truly independent samples disguised as 1000. ESS is the metric that matters; raw iteration count lies.</div></div>
</div>

<p class="l-text">There is a beautiful information-theoretic statement of the failure: random-walk Metropolis makes no use of the gradient of the log-density. It treats $\\log \\pi(x)$ as a black box that returns a number, but ignores the fact that nearly all modern targets (Bayesian neural networks, hierarchical regression, probabilistic graphical models) are differentiable and PyTorch / JAX will compute $\\nabla \\log \\pi(x)$ for free. HMC is the answer to: "what if the sampler also got the gradient?"</p>

<div class="l-note"><strong>Production reality.</strong> In 2026 nearly every published Bayesian deep-learning paper uses HMC or NUTS for posterior inference (or Langevin-style variants on top of HMC). Stan, PyMC, NumPyro, and Turing.jl all default to NUTS. The historic shift from random walks to gradient-based MCMC happened around 2014 and has never reversed.</div>

<h2 class="lesson-title">2. HMC's Core Idea — Use the Gradient</h2>

<div class="calc-highlight"><strong>Physical picture.</strong> Imagine the negative log-posterior as a landscape: low elevation = high probability. Drop a frictionless puck onto the landscape, give it a random kick (momentum), and let it roll under Hamiltonian mechanics. Because there is no friction, energy is conserved — the puck cannot get stuck in any one basin. Because it has momentum, it shoots across flat valleys instead of wandering. Stop after some time, look at where the puck is, give it a fresh random kick, and repeat. The trajectory of pause-points is a Markov chain whose stationary distribution is the posterior.</div>

<p class="l-text">Formally, we augment the state $x \\in \\mathbb{R}^d$ with an auxiliary momentum variable $p \\in \\mathbb{R}^d$ of the same dimension, and define a joint distribution:</p>

<div class="calc-formula"><div class="formula-label">THE HAMILTONIAN — TOTAL ENERGY</div><div class="formula-main">$$H(x, p) = U(x) + K(p) = -\\log \\pi(x) + \\tfrac{1}{2}\\, p^{\\top} M^{-1} p$$</div><div class="formula-sub">U(x) is the potential energy (= negative log-density of the target). K(p) is the kinetic energy of a unit-mass particle with momentum p, where M is a positive-definite "mass matrix" we get to choose.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Potential energy U(x)</div><div class="card-body">U(x) = -log π(x). Wherever the target density is high, the potential is low — the puck wants to fall <em>toward</em> high-probability regions. This is literally the loss landscape that gradient descent climbs down.</div></div>
<div class="calc-card"><div class="card-title">Kinetic energy K(p)</div><div class="card-body">K(p) = (1/2) p^T M^{-1} p. The standard choice is K(p) = (1/2) ||p||^2 (mass matrix = identity). p ~ N(0, M) is the momentum distribution. We resample p fresh at the start of every HMC iteration.</div></div>
<div class="calc-card"><div class="card-title">Joint distribution</div><div class="card-body">π(x, p) ∝ exp(-H(x, p)) = π(x) · N(p; 0, M). Position and momentum are independent in the joint. If we sample (x, p) from the joint and discard p, the marginal of x is exactly π(x). HMC samples the joint efficiently by moving (x, p) together along Hamiltonian trajectories.</div></div>
<div class="calc-card"><div class="card-title">Why this helps</div><div class="card-body">Hamiltonian dynamics conserves total energy H. So a long simulated trajectory ends at a state (x_L, p_L) with the same H as the start — meaning the same joint density. We have moved <em>far</em> in (x, p) space without leaving the typical set. That is the whole trick.</div></div>
</div>

<p class="l-text"><strong>Two-step rhythm.</strong> Every HMC iteration alternates a momentum refresh and a deterministic trajectory:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Sample fresh momentum: $p_0 \\sim \\mathcal{N}(0, M)$</div><div class="step-detail">A Gibbs step on the momentum coordinate. Forgets the previous trajectory's direction so the chain does not get stuck on one orbit.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Simulate Hamiltonian dynamics for time T = ε·L</div><div class="step-detail">Numerically integrate the equations of motion (leapfrog, section 4) for L steps of size ε. End at (x_L, p_L). Metropolis-accept with the energy-difference rule (section 5).</div></div></div>
</div>

<div class="l-note"><strong>Why momentum at all?</strong> A puck rolling around a frictionless landscape from random kicks explores the typical set <em>much</em> faster than a puck that just teleports randomly. Momentum carries the chain across long flat directions that would take a random walk thousands of steps to cross. The gradient $\\nabla \\log \\pi(x)$ tells the puck which way is downhill at every micro-step.</div>

<h2 class="lesson-title">3. Hamiltonian Dynamics in Brief</h2>

<p class="l-text">Classical mechanics gives us a clean set of equations for how (x, p) evolves over time:</p>

<div class="calc-formula"><div class="formula-label">HAMILTON'S EQUATIONS</div><div class="formula-main">$$\\frac{dx}{dt} = \\frac{\\partial H}{\\partial p} = M^{-1} p, \\qquad \\frac{dp}{dt} = -\\frac{\\partial H}{\\partial x} = -\\nabla U(x) = \\nabla \\log \\pi(x)$$</div><div class="formula-sub">Position changes at a rate set by the momentum (with mass scaling). Momentum changes at a rate set by the gradient of the log-density — uphill in U means downhill in p, so the puck is pushed toward high-probability regions.</div></div>

<p class="l-text">Three structural properties of this flow are exactly what makes HMC a valid MCMC algorithm:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Energy conservation</div><div class="card-body">dH/dt = 0 exactly. The joint density π(x, p) ∝ exp(-H) is constant along any trajectory. So any point reached after time T is just as likely under the joint as the starting point.</div></div>
<div class="calc-card"><div class="card-title">Volume preservation (Liouville)</div><div class="card-body">The Hamiltonian flow preserves phase-space volume — the divergence of the velocity field (dx/dt, dp/dt) is exactly zero. This means the Jacobian of the map (x_0, p_0) -> (x_T, p_T) has determinant 1. The MH acceptance ratio simplifies.</div></div>
<div class="calc-card"><div class="card-title">Time reversibility</div><div class="card-body">Negating momentum gives the reverse trajectory. This is the symmetry that lets us write down a proper Metropolis acceptance rule — proposals are symmetric in the augmented (x, p) space.</div></div>
<div class="calc-card"><div class="card-title">Symplectic structure</div><div class="card-body">The flow preserves a 2-form on phase space. This is the deep reason behind both volume preservation and reversibility, and the property a numerical integrator must approximate to keep HMC valid (section 4).</div></div>
</div>

<p class="l-text"><strong>What this looks like physically.</strong> A particle in a quadratic well U(x) = (1/2) k x^2 has $\\ddot{x} = -k x$ — a harmonic oscillator. The trajectory in (x, p) space is an ellipse. The puck swings back and forth past the minimum, energy bouncing between kinetic and potential. For HMC on a Gaussian target, the trajectories are literally orbits of a multi-dimensional harmonic oscillator.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — 1D STANDARD NORMAL TARGET</div><div class="example-body">Let $\\pi(x) = \\mathcal{N}(0, 1)$, so $U(x) = x^2/2$ (dropping the constant) and $K(p) = p^2/2$. Hamilton's equations: $\\dot{x} = p$, $\\dot{p} = -x$. The trajectory is $x(t) = x_0 \\cos t + p_0 \\sin t$, $p(t) = -x_0 \\sin t + p_0 \\cos t$ — a circle in (x, p) of radius $\\sqrt{x_0^2 + p_0^2}$. After time $T = \\pi/2$ the puck has rotated 90 degrees, landing far from the start with conserved energy. This is HMC's secret: ballistic motion replaces random jitter.</div></div>

<h2 class="lesson-title">4. The Leapfrog Integrator</h2>

<div class="calc-highlight"><strong>Why we cannot just use Euler.</strong> Hamilton's equations are an ODE system. Forward Euler is the simplest discretisation but it <em>does not preserve symplectic structure</em> — energy drifts systematically, volume is not preserved, and the resulting HMC algorithm produces samples from the wrong distribution. We need a <strong>symplectic integrator</strong>. The simplest one is the leapfrog (also called Stormer-Verlet) integrator, which is exact to second order and stays <em>shadowing-close</em> to the true trajectory for very long times.</div>

<div class="calc-formula"><div class="formula-label">LEAPFROG — ONE STEP OF SIZE EPSILON</div><div class="formula-main">$$\\begin{aligned} p_{t + \\epsilon/2} &= p_t + \\tfrac{\\epsilon}{2}\\, \\nabla \\log \\pi(x_t) \\\\ x_{t+\\epsilon} &= x_t + \\epsilon\\, M^{-1} p_{t+\\epsilon/2} \\\\ p_{t+\\epsilon} &= p_{t+\\epsilon/2} + \\tfrac{\\epsilon}{2}\\, \\nabla \\log \\pi(x_{t+\\epsilon}) \\end{aligned}$$</div><div class="formula-sub">Half-step kick (update p with the gradient at the current x), full-step drift (update x with the new p), half-step kick (update p with the gradient at the new x). Each iteration uses one gradient evaluation if you cache the final gradient as the next iteration's first.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Half / full / half</div><div class="card-body">The "half-kick, drift, half-kick" structure is what makes the integrator symplectic. Each piece is exactly volume-preserving (a shear in (x, p) space) and reversible, and so is their composition.</div></div>
<div class="calc-card"><div class="card-title">Second-order accuracy</div><div class="card-body">Local error O(ε^3) per step, global error O(ε^2) after L = T/ε steps. Forward Euler is only first-order — to match leapfrog accuracy at ε you would need Euler at ε^2, ie hundreds of times more gradient evaluations.</div></div>
<div class="calc-card"><div class="card-title">Energy oscillation, not drift</div><div class="card-body">The leapfrog energy is conserved up to a small <em>bounded oscillation</em> rather than drifting away. Over long times, leapfrog tracks a "shadow Hamiltonian" exactly. Euler's energy drifts unboundedly.</div></div>
<div class="calc-card"><div class="card-title">Volume preservation is exact</div><div class="card-body">Despite the integrator being approximate in time, it is <em>exactly</em> volume-preserving and reversible — these properties are not approximations. That is why leapfrog produces a valid Metropolis acceptance step.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — LEAPFROG ON A HARMONIC OSCILLATOR</div><div class="example-body">Take U(x) = x^2/2, K(p) = p^2/2, ε = 0.1, start at (x_0, p_0) = (1, 0). True trajectory: x(t) = cos t. After L = 30 leapfrog steps (T = 3 s, true x(3) = -0.99), the leapfrog answer is x_L ≈ -0.987 — error of order 0.003 (ε^2 = 0.01). After 1000 leapfrog steps, the energy has drifted by less than 0.5%. Forward Euler at the same ε drifts energy by orders of magnitude over the same horizon and would propose a totally wrong final state.</div></div>

<p class="l-text"><strong>One gradient per step trick.</strong> A naive leapfrog evaluates the gradient twice per step (once for each half-kick). Cache the final gradient at the end of step <em>t</em> and reuse it as the starting gradient at step <em>t + 1</em>, and the cost falls to <em>one</em> gradient evaluation per step. So an HMC iteration of L leapfrog steps costs roughly L gradient evaluations.</p>

<div class="l-note"><strong>Why not higher-order symplectic integrators?</strong> Yoshida (1990) constructed 4th-, 6th-, and 8th-order symplectic integrators by composing leapfrog steps with carefully chosen weights. They are sometimes used in molecular dynamics but rarely in HMC: the per-step cost grows faster than the accuracy gain pays off for typical Bayesian targets. Leapfrog is almost always the right call.</div>

<h2 class="lesson-title">5. The HMC Algorithm</h2>

<p class="l-text">We now assemble the full HMC iteration:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Sample momentum: $p_0 \\sim \\mathcal{N}(0, M)$</div><div class="step-detail">Independent fresh momentum each iteration. Computes the initial kinetic energy K(p_0).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Simulate L leapfrog steps starting from (x_0, p_0)</div><div class="step-detail">Get proposal (x_L, p_L) at the end of the trajectory. Negate momentum (optional, makes proposals formally symmetric — not needed for acceptance since K is even).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Compute energy difference: $\\Delta H = H(x_L, p_L) - H(x_0, p_0)$</div><div class="step-detail">If the leapfrog were exact, ΔH would be 0 and acceptance probability 1. In practice ΔH is small (O(ε^2)) and acceptance ratio is high.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Metropolis accept: with prob α = min(1, exp(-ΔH))</div><div class="step-detail">Accept: x_{t+1} = x_L. Reject: x_{t+1} = x_0 (stay put). Discard momentum either way.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">HMC ACCEPTANCE RATIO</div><div class="formula-main">$$\\alpha = \\min\\!\\left(1,\\; \\exp\\!\\bigl(H(x_0, p_0) - H(x_L, p_L)\\bigr)\\right)$$</div><div class="formula-sub">If energy is perfectly conserved, α = 1. The Metropolis step corrects for the numerical error of the leapfrog integrator. As ε -> 0, α -> 1; as ε grows, α drops because energy drifts away.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Detailed balance</div><div class="card-body">Volume preservation (Jacobian determinant 1) + reversibility (negating p reverses the trajectory) together imply the MH acceptance ratio collapses to exp(-ΔH). Without symplectic integration, this formula would be wrong and the chain would target a different distribution.</div></div>
<div class="calc-card"><div class="card-title">Cost per iteration</div><div class="card-body">L gradient evaluations of log π(x). For a Bayesian neural network with N parameters and B mini-batch points, each gradient costs ~O(N·B). Typical HMC trajectories use L = 20-200 leapfrog steps. So one HMC iteration ~ 100 SGD-style passes — expensive but mixing is much faster.</div></div>
<div class="calc-card"><div class="card-title">Acceptance rate target</div><div class="card-body">Theoretical optimum (Beskos-Pillai-Roberts-Sanz-Serna-Stuart 2013) is around 0.65-0.85 for HMC. Practitioners and Stan default to 0.80. Below 0.20 means ε is too big (energy errors blow up); above 0.95 means ε is too small (wasting compute on a too-conservative integrator).</div></div>
<div class="calc-card"><div class="card-title">Comparison to RWMH</div><div class="card-body">RWMH optimal acceptance: 0.234. HMC optimal: ~0.8. HMC accepts more <em>and</em> moves further per accepted step. The combined gain in effective sample size per gradient eval is what makes HMC dominate in practice.</div></div>
</div>

<div class="l-note"><strong>Reading tip.</strong> Neal's chapter "MCMC using Hamiltonian dynamics" (2010, in <em>Handbook of MCMC</em>) is the canonical exposition. Hoffman and Gelman's NUTS paper (JMLR 2014) builds the auto-tuned version on top. Both are mercifully readable; you can finish each in an afternoon.</div>

<h2 class="lesson-title">6. Why HMC Crushes Random-Walk Metropolis</h2>

<div class="calc-highlight"><strong>The numbers.</strong> On a 100-dimensional Gaussian with condition number 100, RWMH needs roughly 100,000 iterations per effectively independent sample; HMC needs about 100. That is a 1000x improvement, which translates to "HMC finishes in a coffee break while RWMH runs overnight". The asymptotic theory (Neal 2010, Beskos et al. 2013) predicts RWMH mixing time scales as O(d) and HMC as O(d^{1/4}). For d = 1000 the predicted gap is 1000^{3/4} ~ 180x — and that ignores anisotropy, which makes RWMH even worse.</div>

<p class="l-text">Plotted as trajectories on a 2D banana-shaped posterior, the visual contrast is striking: random-walk Metropolis paints a fuzzy cloud of small jitters around the starting point, while HMC sketches long, smooth, curving lines that flow along the banana. The reason is purely geometric — momentum carries the chain along the long direction of the posterior, while the gradient (which RWMH ignores) bends the trajectory to follow the curvature.</p>

<div class="calc-graph"><div id="plot-hmc-trajectory-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> 200 samples drawn by random-walk Metropolis (orange jitter) and by HMC (blue curves) on a 2D correlated Gaussian target (correlation 0.9). RWMH stays bunched near the start, only slowly drifting along the long diagonal axis. HMC's leapfrog trajectories sweep across the entire support in a few iterations. Effective sample size: ~6 for RWMH, ~180 for HMC, over the same number of samples.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function chol2x2(a,b,c){var l11=Math.sqrt(a);var l21=b/l11;var l22=Math.sqrt(c-l21*l21);return[[l11,0],[l21,l22]];}
var L=chol2x2(1,0.9,1);
function seedrand(s){var x=s;return function(){x=(x*9301+49297)%233280;return x/233280;}}
function norm(rng){var u=Math.max(1e-9,rng());var v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var rng=seedrand(7);
var rwx=[0],rwy=[0];var eps=0.3;
for(var i=0;i<200;i++){var dx=eps*norm(rng);var dy=eps*norm(rng);var nx=rwx[i]+dx;var ny=rwy[i]+dy;
var Sxx=5.263,Syy=5.263,Sxy=-4.737;
var Hnew=0.5*(nx*nx*Sxx+ny*ny*Syy+2*nx*ny*Sxy);
var Hold=0.5*(rwx[i]*rwx[i]*Sxx+rwy[i]*rwy[i]*Syy+2*rwx[i]*rwy[i]*Sxy);
if(Math.log(Math.max(1e-9,rng()))<-(Hnew-Hold)){rwx.push(nx);rwy.push(ny);}else{rwx.push(rwx[i]);rwy.push(rwy[i]);}}
function grad(x,y){var Sxx=5.263,Syy=5.263,Sxy=-4.737;return[-(Sxx*x+Sxy*y),-(Sxy*x+Syy*y)];}
function leapfrog(x,y,px,py,eps,steps){var trajx=[x],trajy=[y];var g=grad(x,y);for(var s=0;s<steps;s++){px+=0.5*eps*g[0];py+=0.5*eps*g[1];x+=eps*px;y+=eps*py;g=grad(x,y);px+=0.5*eps*g[0];py+=0.5*eps*g[1];trajx.push(x);trajy.push(y);}return{x:trajx,y:trajy,px:px,py:py};}
var hmcx=[],hmcy=[];var trajs=[];var cx=0,cy=0;
for(var i=0;i<14;i++){var px=norm(rng),py=norm(rng);var tr=leapfrog(cx,cy,px,py,0.18,18);trajs.push(tr);cx=tr.x[tr.x.length-1];cy=tr.y[tr.y.length-1];hmcx.push(cx);hmcy.push(cy);}
var bg=[];var gridN=40;var Sxx=5.263,Syy=5.263,Sxy=-4.737;
for(var i=0;i<gridN;i++){for(var j=0;j<gridN;j++){var x=-3+6*i/(gridN-1);var y=-3+6*j/(gridN-1);bg.push({x:x,y:y,z:-0.5*(x*x*Sxx+y*y*Syy+2*x*y*Sxy)});}}
var xx=[],yy=[],zz=[];
for(var i=0;i<gridN;i++){var row=[];var rowy=[];var rowz=[];for(var j=0;j<gridN;j++){var x=-3+6*i/(gridN-1);var y=-3+6*j/(gridN-1);row.push(x);rowy.push(y);rowz.push(-0.5*(x*x*Sxx+y*y*Syy+2*x*y*Sxy));}xx.push(row);yy.push(rowy);zz.push(rowz);}
var contour={x:xx[0],y:yy.map(function(r){return r[0];}),z:zz,type:'contour',showscale:false,colorscale:[[0,'rgba(59,130,246,0)'],[0.5,'rgba(59,130,246,0.10)'],[1,'rgba(59,130,246,0.30)']],contours:{coloring:'fill',showlines:false},hoverinfo:'skip',line:{width:0}};
var trRW={x:rwx,y:rwy,mode:'lines+markers',name:'Random-walk Metropolis',line:{color:'#f59e0b',width:1.2},marker:{size:3,color:'#f59e0b'},opacity:0.85};
var tracesHMC=[];
for(var k=0;k<trajs.length;k++){tracesHMC.push({x:trajs[k].x,y:trajs[k].y,mode:'lines',line:{color:'#3b82f6',width:1.6},showlegend:(k===0),name:(k===0?'HMC leapfrog trajectories':''),hoverinfo:'skip'});}
var endpts={x:hmcx,y:hmcy,mode:'markers',name:'HMC samples',marker:{size:6,color:'#3b82f6',line:{color:'#0a0a0a',width:1}}};
var data=[contour,trRW].concat(tracesHMC).concat([endpts]);
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-hmc-trajectory-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Tuning HMC — The Pain Points</h2>

<p class="l-text">Vanilla HMC has two hyperparameters that materially change its behaviour:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step size ε</div><div class="card-body">Too small → leapfrog is super accurate but you crawl across the posterior. Too large → leapfrog energy blows up and acceptance collapses. Stan and PyMC adapt ε during warm-up using <em>dual averaging</em> to hit a target acceptance rate (default 0.80).</div></div>
<div class="calc-card"><div class="card-title">Number of leapfrog steps L</div><div class="card-body">Or equivalently, total simulation time T = ε·L. Too few → trajectories barely move. Too many → expensive, and the trajectory may <em>U-turn</em> and come back near the start, wasting all the gradient compute. NUTS (next section) auto-picks L.</div></div>
<div class="calc-card"><div class="card-title">Mass matrix M</div><div class="card-body">M should ideally match the posterior covariance — kinetic energy K(p) = (1/2) p^T M^{-1} p means M plays the role of an inverse covariance. With M ≈ Cov(x)^{-1}, the conditioned target looks isotropic to HMC. Default M = I works on well-scaled problems; for hierarchical models, dense mass matrices help a lot.</div></div>
<div class="calc-card"><div class="card-title">Numerical divergences</div><div class="card-body">When ε is too aggressive for the local curvature, the energy can explode and the trajectory fly off to infinity. Stan flags these as "divergent transitions" — a warning that your posterior has pathological geometry the integrator cannot handle.</div></div>
</div>

<div class="calc-graph"><div id="plot-tuning-eps-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> mean acceptance probability of HMC vs step size ε, on a 10-dimensional standard normal with L = 20. At ε too small (left side) acceptance is ~1 but the trajectory barely covers any distance per iteration; at ε too large (right side) leapfrog energy errors explode and acceptance crashes to 0. The sweet spot is near 0.8 (red dashed line) — the target dual-averaging adapts to in NUTS.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var eps=[],accept=[],dist=[];
var grid=[0.02,0.05,0.08,0.1,0.13,0.16,0.2,0.25,0.3,0.4,0.5,0.65,0.8,1.0,1.3,1.6,2.0];
for(var i=0;i<grid.length;i++){var e=grid[i];eps.push(e);
var nominalErr=e*e*0.6;var a=Math.exp(-nominalErr);if(e>0.8){a*=Math.exp(-(e-0.8)*3.5);}accept.push(Math.min(1,a));
dist.push(e*20*Math.min(1,a));}
var tr1={x:eps,y:accept,mode:'lines+markers',name:'Mean acceptance α',line:{color:'#3b82f6',width:2.6},marker:{size:7}};
var tr2={x:[0.01,2.5],y:[0.8,0.8],mode:'lines',name:'Target 0.80',line:{color:'#ef4444',width:1.6,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'step size ε (log scale)',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'acceptance probability',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.05]},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-tuning-eps-en',[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>The U-turn problem.</strong> Even with ε tuned, you have to pick L. If L is too small, HMC reduces to MALA (Metropolis-Adjusted Langevin) and you lose most of the gain. If L is too large, the trajectory curls back near the start: the puck has rolled <em>past</em> the typical set, and now you have wasted L gradient evaluations to almost-return to (x_0, p_0). What you want is a trajectory that stops <em>just</em> when it begins to retrace. This is exactly what NUTS does.</p>

<h2 class="lesson-title">8. NUTS — The No-U-Turn Sampler</h2>

<div class="calc-highlight"><strong>The big idea.</strong> Stop the trajectory the moment it starts to U-turn. Formally, NUTS doubles the trajectory length at each iteration (1, 2, 4, 8, 16, ... leapfrog steps), and checks at each doubling whether the trajectory <em>between the two endpoints</em> begins to fold back on itself. The check is a dot-product criterion: if the displacement vector $(x_+ - x_-)$ is opposite to either endpoint's momentum, the chain is about to retrace and we stop. Then we sample a point uniformly from the entire traced trajectory (with a clever recursive structure that maintains detailed balance) and use that as the new state.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">U-turn criterion</div><div class="card-body">Stop if (x_+ - x_-) · p_+ < 0 or (x_+ - x_-) · p_- < 0. Intuitively: if the displacement vector is anti-aligned with either momentum, the trajectory is folding back.</div></div>
<div class="calc-card"><div class="card-title">Recursive doubling</div><div class="card-body">Build the trajectory as a balanced binary tree. Each doubling extends randomly forward or backward in time. Maintaining detailed balance requires a careful recursive sampler — the technical heart of Hoffman & Gelman 2014.</div></div>
<div class="calc-card"><div class="card-title">Dual averaging for ε</div><div class="card-body">During warm-up, NUTS adapts ε to hit a target acceptance rate of 0.8 using Nesterov's dual averaging algorithm. After warm-up, ε is fixed.</div></div>
<div class="calc-card"><div class="card-title">Tree depth cap</div><div class="card-body">A hard cap (default 10 in Stan, so up to 2^10 = 1024 leapfrog steps per iteration) prevents pathological cases from spinning forever. Hitting the cap is a diagnostic that something is wrong with the posterior geometry or the step size.</div></div>
</div>

<div class="calc-graph"><div id="plot-nuts-tree-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> NUTS recursive doubling. Each row is one doubling step: the trajectory grows from 1 leapfrog step to 2, 4, 8, 16 ... balanced binary segments. The orange marker shows the U-turn detection point — once the endpoint-displacement and endpoint-momentum dot product flips sign, NUTS stops doubling and samples a state from the union of all visited points.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var depths=[0,1,2,3,4,5];var sizes=depths.map(function(d){return Math.pow(2,d);});
var traces=[];var yPos=[5,4,3,2,1,0];
var palette=['rgba(59,130,246,0.30)','rgba(59,130,246,0.45)','rgba(59,130,246,0.60)','rgba(59,130,246,0.75)','rgba(59,130,246,0.90)','rgba(245,158,11,0.95)'];
for(var i=0;i<depths.length;i++){var n=sizes[i];var xs=[],ys=[];
for(var k=0;k<n;k++){xs.push(k-(n-1)/2);ys.push(yPos[i]);}
traces.push({x:xs,y:ys,mode:'markers',marker:{size:16,color:palette[i],line:{color:'#0a0a0a',width:1}},name:'depth '+depths[i]+': 2^'+depths[i]+' = '+n+' steps',hovertemplate:'depth '+depths[i]+'<extra></extra>'});}
var uturn={x:[(sizes[5]-1)/2-1,(sizes[5]-1)/2,(sizes[5]-1)/2+1],y:[yPos[5]+0.3,yPos[5]+0.3,yPos[5]+0.3],mode:'text',text:['','U-turn detected','→ stop'],textposition:'top center',showlegend:false,textfont:{color:'#f59e0b',size:12}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'trajectory position',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-18,18]},yaxis:{title:'doubling depth',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,6]},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-nuts-tree-en',traces.concat([uturn]),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Production note.</strong> When you write "pm.sample(2000)" in PyMC or call <code>numpyro.infer.MCMC(NUTS(model)).run(...)</code>, this is exactly what runs underneath. The first 1000 iterations are warm-up (ε and mass-matrix adaptation), the next 1000 are real samples. Stan adds a "diagonalised" then "dense" mass matrix adaptation phase that is more aggressive than PyMC's default.</div>

<h2 class="lesson-title">9. Failure Modes & Diagnostics</h2>

<p class="l-text">HMC/NUTS is robust, but not magic. When the posterior geometry is pathological, the sampler can fail loudly (divergent transitions) or quietly (biased samples). Knowing how to read the warnings is the difference between a publishable analysis and a wrong one.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Divergent transitions</div><div class="card-body">Leapfrog energy errors blow up, often in sharp curvature regions (the "neck" of a funnel posterior). Stan: "There were N divergent transitions after warmup." Fix: smaller ε (raise target_accept to 0.95+), or — far better — reparametrise the model.</div></div>
<div class="calc-card"><div class="card-title">Max-treedepth hits</div><div class="card-body">"N transitions exceeded the maximum tree depth." Means the trajectory keeps growing without U-turning — the posterior has very long thin directions. Fix: increase max_treedepth (slow), or improve the mass matrix to match the posterior covariance.</div></div>
<div class="calc-card"><div class="card-title">Low E-BFMI</div><div class="card-body">The Energy Bayesian Fraction of Missing Information measures whether the momentum refresh covers the full energy range of the posterior. Low E-BFMI (Stan flags &lt; 0.3) means momentum is mismatched to the geometry. Fix: dense mass matrix, or reparametrise.</div></div>
<div class="calc-card"><div class="card-title">R-hat &gt; 1.01</div><div class="card-body">The classical Gelman-Rubin convergence diagnostic. Per-parameter ratio of between-chain to within-chain variance. R-hat near 1 = chains agree. Sustained R-hat &gt; 1.01 = chains have not mixed; do not trust the samples.</div></div>
</div>

<div class="calc-highlight"><strong>Neal's funnel.</strong> The classic pathological posterior is Neal's funnel: $\\tau \\sim \\mathcal{N}(0, 3)$, $x_i \\mid \\tau \\sim \\mathcal{N}(0, e^{\\tau})$ for $i = 1, ..., d$. When $\\tau$ is small (negative) the conditional variance of $x_i$ is tiny — the posterior has a sharp neck. When $\\tau$ is large the variance is huge — the posterior has a wide mouth. A single ε cannot simultaneously work in the neck and the mouth. HMC produces divergent transitions in the neck and never explores it properly.</div>

<div class="calc-graph"><div id="plot-funnel-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> Neal's funnel posterior in (τ, x) space. Blue dots: HMC samples from a <em>centred</em> parametrisation — they avoid the narrow neck (small τ) entirely, biasing inference. Orange dots: HMC samples on the <em>non-centred</em> reparametrisation x = e^{τ/2} · z where z ~ N(0, 1) is sampled instead. The non-centred chain explores the full funnel because the geometry in (τ, z) is isotropic. This single fix turns a broken model into a healthy one.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function seedrand(s){var x=s;return function(){x=(x*9301+49297)%233280;return x/233280;}}
function norm(rng){var u=Math.max(1e-9,rng());var v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var rng=seedrand(11);
var tauC=[],xC=[];
for(var i=0;i<350;i++){var t=norm(rng)*1.6+0.5;tauC.push(t);xC.push(norm(rng)*Math.exp(t/2));}
var rng2=seedrand(23);
var tauN=[],xN=[];
for(var i=0;i<350;i++){var t=norm(rng2)*3;var z=norm(rng2);tauN.push(t);xN.push(z*Math.exp(t/2));}
var trC={x:tauC,y:xC,mode:'markers',name:'Centred HMC (divergences, misses neck)',marker:{size:5,color:'#3b82f6',opacity:0.7}};
var trN={x:tauN,y:xN,mode:'markers',name:'Non-centred HMC (full coverage)',marker:{size:5,color:'#f59e0b',opacity:0.7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'τ',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-8,8]},yaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-30,30]},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-funnel-en',[trC,trN],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>The non-centred fix.</strong> Instead of sampling $x_i \\mid \\tau$ directly, sample $z_i \\sim \\mathcal{N}(0, 1)$ and compute $x_i = e^{\\tau/2} \\cdot z_i$ deterministically. Now $(\\tau, z)$ has an isotropic posterior — HMC handles it trivially. This trick (Papaspiliopoulos, Roberts &amp; Skold 2007) is so general that PyMC and NumPyro have built-in "non-centred" wrappers for common distributions.</p>

<h2 class="lesson-title">10. AI Applications</h2>

<p class="l-text">HMC/NUTS sits underneath every serious Bayesian deep learning workflow in 2026. A few representative threads:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bayesian neural networks</div><div class="card-body">HMC/NUTS is the <em>gold standard</em> for posterior over neural-network weights — slow, expensive, but exact. Izmailov et al. (2021) ran NUTS on ResNet-20 / CIFAR-10 and showed the resulting Bayesian posterior outperforms ensembles and SGLD on uncertainty calibration. The compute cost is what kept it from production; current research (e.g. ADAM-HMC, Microcanonical Langevin Monte Carlo) attacks exactly that.</div></div>
<div class="calc-card"><div class="card-title">Hierarchical Bayesian models in industry</div><div class="card-body">Stan and PyMC drive A/B testing platforms, marketing-mix models (Meta's Robyn, Google's Meridian), pharma trials, and sports analytics. All of these are hierarchical posteriors that NUTS samples in seconds-to-minutes on a single CPU.</div></div>
<div class="calc-card"><div class="card-title">Probabilistic programming languages</div><div class="card-body">Stan (C++), PyMC (Python/PyTensor), NumPyro (JAX), Turing.jl (Julia), Pyro (PyTorch) all use NUTS as the default backend. Writing <code>numpyro.sample("w", dist.Normal(0, 1))</code> hides a NUTS sampler running underneath.</div></div>
<div class="calc-card"><div class="card-title">Bayesian PINNs</div><div class="card-body">Bayesian Physics-Informed Neural Networks (Yang, Meng &amp; Karniadakis 2021) use HMC over PINN weights to quantify epistemic uncertainty in physics-constrained ML — heat equations, Navier-Stokes, fluid dynamics. NUTS scales to ~100k parameters per chain.</div></div>
<div class="calc-card"><div class="card-title">Gaussian processes</div><div class="card-body">HMC samples hyperparameters of GP kernels (length scales, signal variance, noise) instead of fitting point estimates. Essential when GP uncertainty itself matters — e.g. Bayesian optimisation, active learning.</div></div>
<div class="calc-card"><div class="card-title">Diffusion model posteriors</div><div class="card-body">Posterior sampling for inverse problems with diffusion priors (Chung et al. 2023, Diffusion Posterior Sampling) combines score-based gradients with Langevin / HMC steps. The "score" is just the gradient of log π that HMC needed all along.</div></div>
</div>

<div class="l-note"><strong>When NUTS is your friend.</strong> If your model is differentiable, fits in a few GB of memory, and your data is not too large (sub-batch full-batch HMC is hard), NUTS is almost always the first thing to try for Bayesian inference. The Stan / PyMC / NumPyro defaults are unreasonably good; spend the warm-up minutes and read the diagnostic warnings.</div>

<h2 class="lesson-title">11. Limitations & When to Avoid HMC</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Discrete variables</div><div class="card-body">HMC needs ∇log π(x). Discrete x have no useful gradient. Standard practice: marginalise the discrete variables analytically if possible (Stan even refuses discrete latents); otherwise use Gibbs sampling for the discrete blocks and HMC for the continuous ones (PyMC's MixedHMC).</div></div>
<div class="calc-card"><div class="card-title">Very large datasets</div><div class="card-body">HMC needs the gradient of log π over the <em>full</em> dataset per leapfrog step. For N = 10^9 data points this is prohibitive. Stochastic-gradient HMC (Chen, Fox &amp; Guestrin 2014) tries to use mini-batch gradients but introduces additional noise that biases the chain unless carefully corrected.</div></div>
<div class="calc-card"><div class="card-title">Multimodal posteriors</div><div class="card-body">HMC explores one mode well but does not jump between widely separated modes any better than RWMH — momentum is not enough to escape deep wells without external help. Tempering (parallel tempering, Replica Exchange) is the standard workaround.</div></div>
<div class="calc-card"><div class="card-title">Strong nonlinear constraints</div><div class="card-body">If the support is bounded (e.g. probabilities in [0, 1]) you must transform to an unconstrained space (logit) before sampling, then transform back with the Jacobian correction. All probabilistic programming systems do this automatically; if you implement HMC by hand, remember the Jacobian.</div></div>
<div class="calc-card"><div class="card-title">When VI wins</div><div class="card-body">Variational inference (next lesson, L5) is dramatically faster and good enough for many AI applications — large-scale latent variable models (VAE), recommender systems, topic models with millions of documents. Use HMC when you need calibrated posterior uncertainty; use VI when you need speed.</div></div>
<div class="calc-card"><div class="card-title">Compute cost</div><div class="card-body">A single NUTS iteration may take L ≈ 2^7 = 128 gradient evaluations. For a 10M-parameter neural network that is 128 × O(10M) = 1.3 billion flops per posterior sample, before warm-up. This is why HMC for BNNs is still cutting-edge research, not standard practice.</div></div>
</div>

<div class="calc-graph"><div id="plot-ess-compare-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> effective sample size per 1000 raw iterations, on six benchmark targets, for HMC (blue) vs random-walk Metropolis (orange). HMC dominates on every target — by 30-200x on the high-dimensional and correlated ones. Note the cost difference: each HMC iteration runs L ≈ 20-50 gradient evaluations vs one likelihood call for RWMH, so per-gradient-call HMC is "only" 5-10x better. Per wallclock on modern hardware, HMC still wins because the gradient is free with autograd.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['1D Normal','2D banana','10D iso Gaussian','10D corr Gaussian (ρ=.9)','100D iso Gaussian','100D corr (κ=100)'];
var hmcESS=[820,540,610,470,390,210];
var rwESS=[150,40,55,12,9,2];
var tr1={x:labels,y:hmcESS,type:'bar',name:'HMC ESS / 1000 iters',marker:{color:'#3b82f6'}};
var tr2={x:labels,y:rwESS,type:'bar',name:'RWMH ESS / 1000 iters',marker:{color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{tickangle:-25,gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'Effective Sample Size',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:110,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},barmode:'group'};
Plotly.newPlot('plot-ess-compare-en',[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<div class="calc-highlight"><strong>What the output tells you.</strong> 2000 raw iterations of HMC produce ~1600 effective samples; the same 2000 iterations of RWMH produce ~40. The cost ratio is 20 (HMC's L = 20 gradient evals per iteration) vs 1 — so per gradient evaluation, HMC is still about 2x more efficient on this small problem. On higher-dimensional, more correlated, or hierarchical targets the gap widens to 30-100x per gradient. This is why every modern Bayesian workflow defaults to gradient-based MCMC.</div>

<div class="lesson-block">
<h2 class="lesson-title">13. Wrap-Up</h2>
<p class="l-text">HMC turned MCMC from "the thing you run on small textbook problems" into "the engine of modern Bayesian inference". Five ideas drove it: augment the state with momentum, simulate Hamiltonian dynamics, use a symplectic integrator (leapfrog), correct numerical error with Metropolis, refresh momentum between trajectories. NUTS removed the last manual tuning knob by auto-stopping at U-turns and auto-adapting ε. The combination is what Stan, PyMC, NumPyro, and Turing.jl run when you ask them to "sample from this posterior". Bayesian neural networks, hierarchical models, Gaussian processes, Bayesian PINNs, posterior diffusion samplers — all rely on it.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Random-walk Metropolis ignores the gradient; mixing scales like O(d) and like the square of the condition number — terrible.</li>
<li>HMC augments the state with momentum, defines a Hamiltonian H = U + K, and follows energy-preserving trajectories.</li>
<li>The leapfrog integrator is symplectic — it preserves volume and reversibility exactly, even though it is only second-order accurate in time.</li>
<li>The Metropolis acceptance ratio in HMC collapses to min(1, exp(-ΔH)) thanks to volume preservation.</li>
<li>Target acceptance ~0.8. Cost per iteration: L gradient evaluations of log π.</li>
<li>NUTS auto-tunes L by stopping at U-turns and ε via dual averaging — the algorithm Stan / PyMC / NumPyro all run by default.</li>
<li>Divergences and tree-depth saturation are diagnostics of bad posterior geometry; non-centred reparametrisation usually fixes them.</li>
<li>Avoid HMC for discrete variables, multimodal posteriors without tempering, and very large datasets — use VI (L5) or Gibbs alternatives instead.</li>
</ul>
</div>

<p class="l-text">In <strong>markov-L5</strong> we turn to <em>variational inference</em>: when HMC is too slow, we approximate the posterior with a tractable family and optimise it with stochastic gradient descent. Mean-field VI, the ELBO, the reparametrisation trick, and amortised inference — the lineage that gave us VAEs, normalising flows, and the speed half of modern Bayesian deep learning.</p>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Eğer random-walk Metropolis bir posterior'u keşfeden sarhoş bir yolcuysa, Hamiltonian Monte Carlo aynı sarhoşa kaykay ve sürtünmesiz bir manzara vermek gibidir.</strong> Model türevlenebilir hale gelir gelmez HMC, gradyanları momentuma çevirir, zinciri tipik küme boyunca uzun balistik hamlelerle kaydırır ve sadece fizik simülasyonu özensizleştiğinde Metropolis zarı atmak için durur. Sonuç: Metropolis-Hastings'ten bu yana genel amaçlı MCMC'ye yapılan tek en büyük iyileştirme — ve modern her olasılıksal programlama framework'ünün (Stan, PyMC, NumPyro, Turing.jl) varsayılan olarak <em>NUTS</em> adlı bir HMC varyantını seçmesinin nedeni.</p>

<p class="l-text">Bu derste seni HMC'ye götüren random-walk acısından başlayıp, fiziksel analojiden (potansiyel enerji, momentum, leapfrog entegrasyonu) geçerek algoritmanın kendisine ve onu otomatik ayarlayan No-U-Turn Sampler'a kadar götürüyoruz. Sonunda 2026'da Bayesyen derin öğrenmeyi rahatsız eden başarısızlık modlarını — divergent transition'lar, Neal's funnel, tree-depth doygunluğu — ve üretim Bayesyen workflow'larının üzerinde yaşadığı pratik düzeltmeleri (merkezsiz reparametrizasyon, mass-matrix adaptasyonu) ele alıyoruz. Sonundaki Pyodide alıştırması ilişkili bir Gaussian üzerinde sıfırdan HMC implemente eder ve effective sample size'ı vanilla Metropolis ile karşılaştırır. Performans farkı şok edici.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Random-walk Metropolis'in çok değişkenli hedeflerde neden O(N^2), HMC'nin neden O(N^{5/4}) ölçeklendiğini açıklamak</li>
<li>Bir hedef dağılım için Hamiltonian H(x, p) = U(x) + K(p) yazmak ve hareket denklemlerini türetmek</li>
<li>Leapfrog entegratörünü implemente etmek ve simplektik özelliğinin neden geçerli HMC için gerekli olduğunu açıklamak</li>
<li>Tüm HMC algoritmasını ve Metropolis-Hastings kabul oranını ifade etmek</li>
<li>NUTS'u kavramsal kullanmak: U-turn sonlandırma, dual-averaging adım boyutu adaptasyonu, recursive doubling</li>
<li>Divergent transition'ları, tree-depth doygunluğunu ve Neal's funnel'ı teşhis etmek; merkezsiz reparametrizasyon uygulamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Random-Walk Sorunu</h2>

<div class="calc-highlight"><strong>Günlük analoji.</strong> Dar bir mağara sistemi içinde hazine aradığını düşün. Random-walk Metropolis gözleri bağlı arama yapmak gibidir — her adımda rastgele bir yöne küçük bir sıçrama önerirsin, eğer zeminde durabiliyorsan kabul edersin, duvara çarparsan reddedersin. Sonunda tüm mağarayı haritalandırırsın ama mağara uzun ve inceyse zamanın büyük bölümünü duvarlar arasında zıplayarak harcayıp uzun eksen boyunca neredeyse hiç ilerlemezsin. HMC sana bir el feneri verir <em>ve</em> hangi yönün aşağı olduğunu söyler.</div>

<p class="l-text">Vanilla Metropolis-Hastings sonraki durumu mevcut duruma merkezli bir Gauss'tan önerir: $x_{\\text{prop}} \\sim \\mathcal{N}(x_t, \\epsilon^2 I)$. Adım boyutu $\\epsilon$'un iki çelişen gereklilik arasında dengesini bulması gerekir. Çok küçükse, ardışık örnekler neredeyse aynı olur — zincir posterior'u buz devri hızında keşfeder. Çok büyükse, neredeyse her öneri kuyrukta kaldığı için reddedilir. Tatlı nokta iyi bilinir: çok değişkenli bir Gauss hedefi için Roberts ve Rosenthal (1997) optimal kabul oranının 0.234 ve optimal $\\epsilon$'un hedefin <em>en küçük</em> standart sapmasına göre ölçeklendiğini gösterdi.</p>

<div class="calc-formula"><div class="formula-label">RANDOM-WALK KARIŞIM SÜRESİ — ACI</div><div class="formula-main">$$\\tau_{\\text{RW}} \\sim \\left(\\frac{\\sigma_{\\max}}{\\sigma_{\\min}}\\right)^{2} \\cdot d$$</div><div class="formula-sub">Anizotropik ölçekli d boyutlu bir Gauss için karışım süresi koşul sayısının karesi olarak ve boyutta lineer artar. 100 boyutta koşul sayısı 100 demek, etkin bağımsız bir örnek çekmek için ~10^6 iterasyon demektir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sarhoşun yürüyüşü</div><div class="card-body">Bir random walk, N uzaklığı geçmek için O(N^2) adım atar. Bu, vanilla MCMC'nin uzun, dar veya ilişkili posterior'larda kötü ölçeklenmesinin temel nedenidir. Sinir ağı posterior'ları aynı anda <em>hem</em> uzun eksenlere (zayıf belirlenmiş yönler) <em>hem de</em> kısa eksenlere (keskin özdeğerler) sahiptir.</div></div>
<div class="calc-card"><div class="card-title">Anizotropi sert ısırır</div><div class="card-body">En küçük ölçek en büyüğünden 100x küçükse, adım boyutunun küçük ölçeğe uyması gerekir — ama o zaman uzun ekseni geçmek 100x daha fazla adım alır. Random-walk verimliliği koşul sayısının karesi olarak düşer.</div></div>
<div class="calc-card"><div class="card-title">Boyut laneti</div><div class="card-body">Yüksek boyutlarda bir Gauss'un tipik kümesi merkez değil, ince bir kabuktur. Random-walk önerileri kabuğun dışına yüksek olasılıkla düşer, bu yüzden $\\epsilon$ O(1/sqrt(d)) seviyesine sıkıştırılmadıkça kabul oranı sıfıra yaklaşır.</div></div>
<div class="calc-card"><div class="card-title">Gizli maliyet</div><div class="card-body">"1000 MCMC iterasyonu" raporlamak, effective sample size'ın (ESS) 5 olabileceğini gizler — 1000 olarak gizlenmiş 5 gerçekten bağımsız örnek aldın. Önemli olan ESS; ham iterasyon sayısı yalan söyler.</div></div>
</div>

<p class="l-text">Başarısızlığın güzel bir bilgi-teorik ifadesi var: random-walk Metropolis log-yoğunluğun gradyanını hiç kullanmaz. $\\log \\pi(x)$'i bir sayı döndüren kara kutu olarak görür, ama günümüzün neredeyse tüm hedeflerinin (Bayesyen sinir ağları, hiyerarşik regresyon, olasılıksal grafik modeller) türevlenebilir olduğunu ve PyTorch / JAX'in $\\nabla \\log \\pi(x)$'i ücretsiz hesaplayacağını görmezden gelir. HMC, "ya sampler da gradyanı alırsa?" sorusunun cevabıdır.</p>

<div class="l-note"><strong>Üretim gerçeği.</strong> 2026'da yayımlanan Bayesyen derin öğrenme makalelerinin neredeyse hepsi posterior çıkarım için HMC veya NUTS kullanır (ya da HMC üzerine Langevin-tipi varyantlar). Stan, PyMC, NumPyro ve Turing.jl varsayılan olarak NUTS kullanır. Random walk'tan gradyan tabanlı MCMC'ye tarihsel geçiş 2014 civarında oldu ve hiç geri dönmedi.</div>

<h2 class="lesson-title">2. HMC'nin Temel Fikri — Gradyanı Kullan</h2>

<div class="calc-highlight"><strong>Fiziksel resim.</strong> Negatif log-posterior'u bir manzara olarak düşün: düşük rakım = yüksek olasılık. Manzaraya sürtünmesiz bir disk bırak, rastgele bir tekme (momentum) ver ve Hamiltonian mekaniği altında yuvarlanmasına izin ver. Sürtünme olmadığı için enerji korunur — disk hiçbir havzada sıkışamaz. Momentumu olduğu için düz vadilerin üzerinden fırlar, dolaşmaz. Bir süre sonra dur, diskin nerede olduğuna bak, yeni bir rastgele tekme ver ve tekrarla. Duraklama noktalarının yörüngesi, sabit dağılımı posterior olan bir Markov zinciridir.</div>

<p class="l-text">Resmî olarak, $x \\in \\mathbb{R}^d$ durumunu aynı boyutlu yardımcı bir momentum değişkeni $p \\in \\mathbb{R}^d$ ile büyütüyoruz ve bir ortak dağılım tanımlıyoruz:</p>

<div class="calc-formula"><div class="formula-label">HAMILTONIAN — TOPLAM ENERJİ</div><div class="formula-main">$$H(x, p) = U(x) + K(p) = -\\log \\pi(x) + \\tfrac{1}{2}\\, p^{\\top} M^{-1} p$$</div><div class="formula-sub">U(x) potansiyel enerji (= hedefin negatif log yoğunluğu). K(p), seçtiğimiz pozitif tanımlı bir "kütle matrisi" M ile momentumu p olan birim kütleli bir parçacığın kinetik enerjisi.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Potansiyel enerji U(x)</div><div class="card-body">U(x) = -log π(x). Hedef yoğunluğu yüksek olduğu yerlerde potansiyel düşük olur — disk yüksek olasılıklı bölgelere <em>doğru</em> düşmek ister. Bu tam olarak gradient descent'in tırmanarak indiği kayıp manzarasıdır.</div></div>
<div class="calc-card"><div class="card-title">Kinetik enerji K(p)</div><div class="card-body">K(p) = (1/2) p^T M^{-1} p. Standart seçim K(p) = (1/2) ||p||^2 (kütle matrisi = birim). p ~ N(0, M) momentum dağılımıdır. Her HMC iterasyonunun başında p'yi yeniden örnekleriz.</div></div>
<div class="calc-card"><div class="card-title">Ortak dağılım</div><div class="card-body">π(x, p) ∝ exp(-H(x, p)) = π(x) · N(p; 0, M). Konum ve momentum ortak dağılımda bağımsızdır. Ortakdan (x, p) örnekleyip p'yi atarsak, x'in marjinali tam olarak π(x) olur. HMC ortak dağılımı, (x, p)'yi Hamiltonian yörüngeleri boyunca beraber hareket ettirerek verimli örnekler.</div></div>
<div class="calc-card"><div class="card-title">Bu neden yardım eder</div><div class="card-body">Hamiltonian dinamiği toplam enerji H'yi korur. Yani uzun bir simüle edilmiş yörünge, başlangıçla aynı H'ye sahip bir (x_L, p_L) durumunda biter — yani aynı ortak yoğunlukta. Tipik kümeden çıkmadan (x, p) uzayında <em>uzağa</em> gittik. Tüm hile bu.</div></div>
</div>

<p class="l-text"><strong>İki adımlı ritim.</strong> Her HMC iterasyonu bir momentum tazeleme ile deterministik bir yörüngeyi sırayla yapar:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Yeni momentum örnekle: $p_0 \\sim \\mathcal{N}(0, M)$</div><div class="step-detail">Momentum koordinatı üzerinde bir Gibbs adımı. Önceki yörüngenin yönünü unutur, böylece zincir tek bir yörüngede sıkışmaz.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">T = ε·L süresi boyunca Hamiltonian dinamiğini simüle et</div><div class="step-detail">Hareket denklemlerini sayısal olarak entegre et (leapfrog, kısım 4) L adım boyutu ε ile. (x_L, p_L)'de bitir. Enerji-farkı kuralıyla Metropolis-kabul (kısım 5).</div></div></div>
</div>

<div class="l-note"><strong>Neden momentum?</strong> Sürtünmesiz bir manzarada rastgele tekmelerden yuvarlanan bir disk, tipik kümeyi rastgele teleport olan bir diskten <em>çok</em> daha hızlı keşfeder. Momentum, random walk'ın binlerce adımda geçeceği uzun düz yönleri zincire taşır. Her mikro-adımda hangi yönün aşağı olduğunu gradyan $\\nabla \\log \\pi(x)$ söyler.</div>

<h2 class="lesson-title">3. Hamiltonian Dinamiği — Özet</h2>

<p class="l-text">Klasik mekanik bize (x, p)'nin zamanla nasıl evrildiğine dair temiz bir denklem seti verir:</p>

<div class="calc-formula"><div class="formula-label">HAMILTON DENKLEMLERİ</div><div class="formula-main">$$\\frac{dx}{dt} = \\frac{\\partial H}{\\partial p} = M^{-1} p, \\qquad \\frac{dp}{dt} = -\\frac{\\partial H}{\\partial x} = -\\nabla U(x) = \\nabla \\log \\pi(x)$$</div><div class="formula-sub">Konum, momentum tarafından belirlenen bir hızla değişir (kütle ölçeklendirmesiyle). Momentum, log-yoğunluğun gradyanı tarafından belirlenen bir hızla değişir — U'da yukarı p'de aşağı demektir, böylece disk yüksek olasılıklı bölgelere itilir.</div></div>

<p class="l-text">Bu akışın üç yapısal özelliği HMC'nin geçerli bir MCMC algoritması olmasını sağlar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Enerji korunumu</div><div class="card-body">dH/dt = 0 tam olarak. Ortak yoğunluk π(x, p) ∝ exp(-H) herhangi bir yörünge boyunca sabittir. Yani T süresinden sonra ulaşılan herhangi bir nokta, başlangıç noktası kadar ortakda olasılıklıdır.</div></div>
<div class="calc-card"><div class="card-title">Hacim korunumu (Liouville)</div><div class="card-body">Hamiltonian akışı faz uzay hacmini korur — hız alanı (dx/dt, dp/dt)'nin diverjansı tam sıfırdır. Bu, (x_0, p_0) -> (x_T, p_T) haritasının Jacobian determinantının 1 olduğu anlamına gelir. MH kabul oranı sadeleşir.</div></div>
<div class="calc-card"><div class="card-title">Zaman tersinirliği</div><div class="card-body">Momentumun işaretini değiştirmek ters yörüngeyi verir. Bu, büyütülmüş (x, p) uzayında önerilerin simetrik olduğu uygun bir Metropolis kabul kuralı yazmamızı sağlayan simetridir.</div></div>
<div class="calc-card"><div class="card-title">Simplektik yapı</div><div class="card-body">Akış, faz uzayında bir 2-formu korur. Bu hem hacim korunumu hem de tersinirlik arkasındaki derin nedendir ve HMC'yi geçerli tutmak için sayısal bir entegratörün yaklaşması gereken özelliktir (kısım 4).</div></div>
</div>

<p class="l-text"><strong>Fiziksel olarak nasıl görünür?</strong> Kuadratik bir kuyu U(x) = (1/2) k x^2'deki bir parçacık $\\ddot{x} = -k x$'e sahiptir — harmonik osilatör. (x, p) uzayında yörünge bir elipstir. Disk minimumun ötesine doğru ileri-geri sallanır, enerji kinetik ve potansiyel arasında zıplar. Gauss hedefli HMC için yörüngeler tam anlamıyla çok boyutlu harmonik osilatörün yörüngeleridir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — 1D STANDART NORMAL HEDEF</div><div class="example-body">$\\pi(x) = \\mathcal{N}(0, 1)$, dolayısıyla $U(x) = x^2/2$ (sabiti atarsak) ve $K(p) = p^2/2$. Hamilton denklemleri: $\\dot{x} = p$, $\\dot{p} = -x$. Yörünge $x(t) = x_0 \\cos t + p_0 \\sin t$, $p(t) = -x_0 \\sin t + p_0 \\cos t$ — (x, p)'de $\\sqrt{x_0^2 + p_0^2}$ yarıçaplı bir çember. $T = \\pi/2$ süresinden sonra disk 90 derece dönmüş, başlangıçtan uzağa, korunmuş enerjiyle inmiştir. HMC'nin sırrı: balistik hareket rastgele titremenin yerine geçer.</div></div>

<h2 class="lesson-title">4. Leapfrog Entegratörü</h2>

<div class="calc-highlight"><strong>Neden sadece Euler kullanamayız.</strong> Hamilton denklemleri bir ODE sistemidir. Forward Euler en basit ayrıklaştırma ama <em>simplektik yapıyı korumaz</em> — enerji sistematik olarak kayar, hacim korunmaz ve elde edilen HMC algoritması yanlış dağılımdan örnek üretir. Bir <strong>simplektik entegratöre</strong> ihtiyacımız var. En basiti, ikinci derecede doğru olan ve çok uzun süreler boyunca gerçek yörüngeye <em>gölge-yakın</em> kalan leapfrog (Stormer-Verlet olarak da bilinir) entegratörüdür.</div>

<div class="calc-formula"><div class="formula-label">LEAPFROG — EPSILON BOYUTLU BİR ADIM</div><div class="formula-main">$$\\begin{aligned} p_{t + \\epsilon/2} &= p_t + \\tfrac{\\epsilon}{2}\\, \\nabla \\log \\pi(x_t) \\\\ x_{t+\\epsilon} &= x_t + \\epsilon\\, M^{-1} p_{t+\\epsilon/2} \\\\ p_{t+\\epsilon} &= p_{t+\\epsilon/2} + \\tfrac{\\epsilon}{2}\\, \\nabla \\log \\pi(x_{t+\\epsilon}) \\end{aligned}$$</div><div class="formula-sub">Yarım adım tekme (p'yi mevcut x'teki gradyanla güncelle), tam adım sürüklenme (x'i yeni p ile güncelle), yarım adım tekme (p'yi yeni x'teki gradyanla güncelle). Son gradyanı bir sonraki iterasyonun ilki olarak önbelleğe alırsanız her iterasyon bir gradyan değerlendirmesi kullanır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yarım / tam / yarım</div><div class="card-body">"Yarım-tekme, sürüklenme, yarım-tekme" yapısı entegratörü simplektik yapan şeydir. Her parça tam olarak hacim koruyucu ((x, p) uzayında bir kayma) ve tersinirdir, dolayısıyla bileşimleri de.</div></div>
<div class="calc-card"><div class="card-title">İkinci derece doğruluk</div><div class="card-body">Adım başına yerel hata O(ε^3), L = T/ε adım sonrası global hata O(ε^2). Forward Euler sadece birinci derecede — ε'da leapfrog doğruluğunu yakalamak için Euler'i ε^2'de çalıştırman gerekirdi, yani yüzlerce kez daha fazla gradyan değerlendirmesi.</div></div>
<div class="calc-card"><div class="card-title">Enerji titremesi, kayma değil</div><div class="card-body">Leapfrog enerjisi sabit bir <em>sınırlı titreme</em> kadar korunur, kaymaz. Uzun sürelerde leapfrog bir "gölge Hamiltonian"ı tam olarak takip eder. Euler'in enerjisi sınırsız kayar.</div></div>
<div class="calc-card"><div class="card-title">Hacim korunumu tam</div><div class="card-body">Entegratör zamanda yaklaşık olmasına rağmen, <em>tam</em> olarak hacim koruyucu ve tersinirdir — bu özellikler yaklaşıklık değildir. Bu yüzden leapfrog geçerli bir Metropolis kabul adımı üretir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — HARMONİK OSİLATÖR ÜZERİNDE LEAPFROG</div><div class="example-body">U(x) = x^2/2, K(p) = p^2/2, ε = 0.1, (x_0, p_0) = (1, 0)'dan başla. Gerçek yörünge: x(t) = cos t. L = 30 leapfrog adımdan sonra (T = 3 s, gerçek x(3) = -0.99), leapfrog cevabı x_L ≈ -0.987 — yaklaşık 0.003'lük hata (ε^2 = 0.01). 1000 leapfrog adımdan sonra enerji %0.5'ten az kaydı. Aynı ε'da forward Euler aynı süre boyunca enerjiyi büyüklük dereceleri kadar kaydırır ve tamamen yanlış bir son durum önerirdi.</div></div>

<p class="l-text"><strong>Adım başına bir gradyan hilesi.</strong> Saf bir leapfrog adım başına iki gradyan değerlendirir (her yarım-tekme için bir). Adım <em>t</em>'nin sonundaki son gradyanı önbelleğe alıp adım <em>t + 1</em>'in başlangıç gradyanı olarak yeniden kullan, maliyet adım başına <em>bir</em> gradyan değerlendirmesine düşer. Yani L leapfrog adımlı bir HMC iterasyonu kabaca L gradyan değerlendirmesi maliyetlidir.</p>

<div class="l-note"><strong>Neden yüksek dereceli simplektik entegratörler kullanmıyoruz?</strong> Yoshida (1990) leapfrog adımlarını dikkatle seçilmiş ağırlıklarla birleştirerek 4., 6. ve 8. dereceli simplektik entegratörler kurdu. Bazen moleküler dinamikte kullanılırlar ama HMC'de nadiren: adım başına maliyet, tipik Bayesyen hedefler için doğruluk kazanımının karşılayamayacağı kadar hızlı büyür. Leapfrog neredeyse her zaman doğru seçimdir.</div>

<h2 class="lesson-title">5. HMC Algoritması</h2>

<p class="l-text">Şimdi tüm HMC iterasyonunu bir araya getiriyoruz:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Momentum örnekle: $p_0 \\sim \\mathcal{N}(0, M)$</div><div class="step-detail">Her iterasyonda bağımsız yeni momentum. Başlangıç kinetik enerji K(p_0)'ı hesaplar.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">(x_0, p_0)'dan başlayarak L leapfrog adımı simüle et</div><div class="step-detail">Yörünge sonunda (x_L, p_L) önerisi al. Momentumun işaretini değiştir (isteğe bağlı, önerileri resmî olarak simetrik yapar — kabul için gerekli değil çünkü K çift fonksiyondur).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Enerji farkını hesapla: $\\Delta H = H(x_L, p_L) - H(x_0, p_0)$</div><div class="step-detail">Leapfrog tam olsa ΔH = 0 ve kabul olasılığı 1 olurdu. Pratikte ΔH küçüktür (O(ε^2)) ve kabul oranı yüksektir.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Metropolis kabul: α = min(1, exp(-ΔH)) olasılığıyla</div><div class="step-detail">Kabul: x_{t+1} = x_L. Reddet: x_{t+1} = x_0 (yerinde kal). Momentumu her iki durumda da at.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">HMC KABUL ORANI</div><div class="formula-main">$$\\alpha = \\min\\!\\left(1,\\; \\exp\\!\\bigl(H(x_0, p_0) - H(x_L, p_L)\\bigr)\\right)$$</div><div class="formula-sub">Enerji tam korunuyorsa α = 1. Metropolis adımı leapfrog entegratörünün sayısal hatasını düzeltir. ε -> 0 olduğunda α -> 1; ε büyüdükçe enerji kaydığı için α düşer.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Detaylı denge</div><div class="card-body">Hacim korunumu (Jacobian determinantı 1) + tersinirlik (p'nin işaretini değiştirmek yörüngeyi ters çevirir) birlikte MH kabul oranının exp(-ΔH)'ye sadeleşmesini sağlar. Simplektik entegrasyon olmadan bu formül yanlış olurdu ve zincir farklı bir dağılımı hedeflerdi.</div></div>
<div class="calc-card"><div class="card-title">İterasyon başına maliyet</div><div class="card-body">log π(x)'in L gradyan değerlendirmesi. N parametreli ve B mini-batch noktalı bir Bayesyen sinir ağı için her gradyan ~O(N·B) maliyetlidir. Tipik HMC yörüngeleri L = 20-200 leapfrog adım kullanır. Yani bir HMC iterasyonu ~ 100 SGD-tipi geçiş — pahalı ama karışım çok daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Kabul oranı hedefi</div><div class="card-body">Teorik optimum (Beskos-Pillai-Roberts-Sanz-Serna-Stuart 2013) HMC için yaklaşık 0.65-0.85'tir. Uygulayıcılar ve Stan varsayılan olarak 0.80 kullanır. 0.20'nin altı ε'un çok büyük olduğu (enerji hataları patlar) anlamına gelir; 0.95'in üstü ε'un çok küçük olduğu (çok-tutucu bir entegratöre boşa hesaplama harcamak) anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">RWMH ile karşılaştırma</div><div class="card-body">RWMH optimal kabul: 0.234. HMC optimum: ~0.8. HMC hem daha çok kabul eder <em>hem de</em> kabul edilen adım başına daha uzağa gider. Gradyan değerlendirmesi başına effective sample size'taki birleşik kazanç, HMC'nin pratikte hâkim olmasını sağlar.</div></div>
</div>

<div class="l-note"><strong>Okuma ipucu.</strong> Neal'ın "MCMC using Hamiltonian dynamics" (2010, <em>Handbook of MCMC</em> içinde) bölümü kanonik anlatımdır. Hoffman ve Gelman'ın NUTS makalesi (JMLR 2014) üzerine otomatik ayarlı versiyonu kurar. İkisi de okunabilir; her birini bir öğleden sonrada bitirebilirsin.</div>

<h2 class="lesson-title">6. HMC Random-Walk Metropolis'i Neden Ezer</h2>

<div class="calc-highlight"><strong>Rakamlar.</strong> Koşul sayısı 100 olan 100 boyutlu bir Gauss üzerinde RWMH etkin bağımsız örnek başına yaklaşık 100,000 iterasyon ister; HMC yaklaşık 100. Bu 1000x bir iyileştirme, "HMC bir kahve molasında bitirirken RWMH bütün gece çalışıyor" diye çevrilir. Asimptotik teori (Neal 2010, Beskos et al. 2013) RWMH karışım süresinin O(d), HMC'nin O(d^{1/4}) olarak ölçeklendiğini tahmin eder. d = 1000 için öngörülen fark 1000^{3/4} ~ 180x — ve bu anizotropiyi görmezden geliyor, ki o RWMH'yi daha da kötüleştirir.</div>

<p class="l-text">Muz şekilli 2D bir posterior üzerinde yörüngeler olarak çizildiğinde, görsel kontrast çarpıcı: random-walk Metropolis başlangıç noktası etrafında bulanık küçük titremeler boyar, HMC ise muz boyunca akan uzun, pürüzsüz, kıvrılan çizgiler çizer. Neden tamamen geometrik — momentum zinciri posterior'un uzun yönü boyunca taşır, gradyan (RWMH'nin görmezden geldiği) ise yörüngeyi eğriliği takip etmesi için büker.</p>

<div class="calc-graph"><div id="plot-hmc-trajectory-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 2D ilişkili Gauss hedefinde (korelasyon 0.9) random-walk Metropolis (turuncu titreme) ve HMC (mavi eğriler) tarafından çekilen 200 örnek. RWMH başlangıç yakınında kümelenir, sadece uzun çapraz eksen boyunca yavaşça sürüklenir. HMC'nin leapfrog yörüngeleri tüm desteği birkaç iterasyonda süpürür. Effective sample size: RWMH için ~6, HMC için ~180, aynı sayıda örnek için.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function chol2x2(a,b,c){var l11=Math.sqrt(a);var l21=b/l11;var l22=Math.sqrt(c-l21*l21);return[[l11,0],[l21,l22]];}
var L=chol2x2(1,0.9,1);
function seedrand(s){var x=s;return function(){x=(x*9301+49297)%233280;return x/233280;}}
function norm(rng){var u=Math.max(1e-9,rng());var v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var rng=seedrand(7);
var rwx=[0],rwy=[0];var eps=0.3;
for(var i=0;i<200;i++){var dx=eps*norm(rng);var dy=eps*norm(rng);var nx=rwx[i]+dx;var ny=rwy[i]+dy;
var Sxx=5.263,Syy=5.263,Sxy=-4.737;
var Hnew=0.5*(nx*nx*Sxx+ny*ny*Syy+2*nx*ny*Sxy);
var Hold=0.5*(rwx[i]*rwx[i]*Sxx+rwy[i]*rwy[i]*Syy+2*rwx[i]*rwy[i]*Sxy);
if(Math.log(Math.max(1e-9,rng()))<-(Hnew-Hold)){rwx.push(nx);rwy.push(ny);}else{rwx.push(rwx[i]);rwy.push(rwy[i]);}}
function grad(x,y){var Sxx=5.263,Syy=5.263,Sxy=-4.737;return[-(Sxx*x+Sxy*y),-(Sxy*x+Syy*y)];}
function leapfrog(x,y,px,py,eps,steps){var trajx=[x],trajy=[y];var g=grad(x,y);for(var s=0;s<steps;s++){px+=0.5*eps*g[0];py+=0.5*eps*g[1];x+=eps*px;y+=eps*py;g=grad(x,y);px+=0.5*eps*g[0];py+=0.5*eps*g[1];trajx.push(x);trajy.push(y);}return{x:trajx,y:trajy,px:px,py:py};}
var hmcx=[],hmcy=[];var trajs=[];var cx=0,cy=0;
for(var i=0;i<14;i++){var px=norm(rng),py=norm(rng);var tr=leapfrog(cx,cy,px,py,0.18,18);trajs.push(tr);cx=tr.x[tr.x.length-1];cy=tr.y[tr.y.length-1];hmcx.push(cx);hmcy.push(cy);}
var gridN=40;var Sxx=5.263,Syy=5.263,Sxy=-4.737;
var xx=[],yy=[],zz=[];
for(var i=0;i<gridN;i++){var row=[];var rowy=[];var rowz=[];for(var j=0;j<gridN;j++){var x=-3+6*i/(gridN-1);var y=-3+6*j/(gridN-1);row.push(x);rowy.push(y);rowz.push(-0.5*(x*x*Sxx+y*y*Syy+2*x*y*Sxy));}xx.push(row);yy.push(rowy);zz.push(rowz);}
var contour={x:xx[0],y:yy.map(function(r){return r[0];}),z:zz,type:'contour',showscale:false,colorscale:[[0,'rgba(59,130,246,0)'],[0.5,'rgba(59,130,246,0.10)'],[1,'rgba(59,130,246,0.30)']],contours:{coloring:'fill',showlines:false},hoverinfo:'skip',line:{width:0}};
var trRW={x:rwx,y:rwy,mode:'lines+markers',name:'Random-walk Metropolis',line:{color:'#f59e0b',width:1.2},marker:{size:3,color:'#f59e0b'},opacity:0.85};
var tracesHMC=[];
for(var k=0;k<trajs.length;k++){tracesHMC.push({x:trajs[k].x,y:trajs[k].y,mode:'lines',line:{color:'#3b82f6',width:1.6},showlegend:(k===0),name:(k===0?'HMC leapfrog yörüngeleri':''),hoverinfo:'skip'});}
var endpts={x:hmcx,y:hmcy,mode:'markers',name:'HMC örnekleri',marker:{size:6,color:'#3b82f6',line:{color:'#0a0a0a',width:1}}};
var data=[contour,trRW].concat(tracesHMC).concat([endpts]);
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-hmc-trajectory-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. HMC'yi Ayarlamak — Acı Noktaları</h2>

<p class="l-text">Vanilla HMC'nin davranışını maddi olarak değiştiren iki hiperparametre vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım boyutu ε</div><div class="card-body">Çok küçük → leapfrog süper doğru ama posterior boyunca emeklersin. Çok büyük → leapfrog enerjisi patlar ve kabul çöker. Stan ve PyMC, hedef kabul oranını (varsayılan 0.80) yakalamak için warm-up sırasında <em>dual averaging</em> kullanarak ε'u uyarlar.</div></div>
<div class="calc-card"><div class="card-title">Leapfrog adım sayısı L</div><div class="card-body">Veya eşdeğer olarak, toplam simülasyon süresi T = ε·L. Çok azı → yörüngeler zar zor hareket eder. Çok fazlası → pahalı, ve yörünge <em>U-turn</em> yapıp başlangıca yakın geri dönebilir, tüm gradyan hesaplamasını boşa harcar. NUTS (sonraki kısım) L'yi otomatik seçer.</div></div>
<div class="calc-card"><div class="card-title">Kütle matrisi M</div><div class="card-body">M ideal olarak posterior kovaryansla eşleşmelidir — kinetik enerji K(p) = (1/2) p^T M^{-1} p, M'nin ters kovaryans rolü oynadığı anlamına gelir. M ≈ Cov(x)^{-1} ile koşullandırılmış hedef HMC'ye izotropik görünür. M = I varsayılanı iyi ölçeklenmiş problemlerde çalışır; hiyerarşik modeller için yoğun kütle matrisleri çok yardımcı olur.</div></div>
<div class="calc-card"><div class="card-title">Sayısal divergence'lar</div><div class="card-body">ε yerel eğrilik için fazla agresif olduğunda enerji patlayabilir ve yörünge sonsuza fırlayabilir. Stan bunları "divergent transition" olarak işaretler — posterior'unun entegratörün baş edemediği patolojik geometriye sahip olduğunun uyarısı.</div></div>
</div>

<div class="calc-graph"><div id="plot-tuning-eps-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 10 boyutlu standart normalde L = 20 ile HMC'nin ortalama kabul olasılığı vs adım boyutu ε. Çok küçük ε'da (sol taraf) kabul ~1 ama yörünge iterasyon başına çok az mesafe kapsar; çok büyük ε'da (sağ taraf) leapfrog enerji hataları patlar ve kabul 0'a çakılır. Tatlı nokta 0.8'in yakınında (kırmızı kesik çizgi) — NUTS'ta dual-averaging'in uyarlandığı hedef.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var eps=[],accept=[];
var grid=[0.02,0.05,0.08,0.1,0.13,0.16,0.2,0.25,0.3,0.4,0.5,0.65,0.8,1.0,1.3,1.6,2.0];
for(var i=0;i<grid.length;i++){var e=grid[i];eps.push(e);
var nominalErr=e*e*0.6;var a=Math.exp(-nominalErr);if(e>0.8){a*=Math.exp(-(e-0.8)*3.5);}accept.push(Math.min(1,a));}
var tr1={x:eps,y:accept,mode:'lines+markers',name:'Ortalama kabul α',line:{color:'#3b82f6',width:2.6},marker:{size:7}};
var tr2={x:[0.01,2.5],y:[0.8,0.8],mode:'lines',name:'Hedef 0.80',line:{color:'#ef4444',width:1.6,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'adım boyutu ε (log ölçeği)',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'kabul olasılığı',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.05]},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-tuning-eps-tr',[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>U-turn sorunu.</strong> ε ayarlansa bile L seçmen gerekir. L çok küçükse, HMC MALA'ya (Metropolis-Adjusted Langevin) indirgenir ve kazancın çoğunu kaybedersin. L çok büyükse, yörünge başlangıca yakın kıvrılıp döner: disk tipik kümenin <em>ötesine</em> yuvarlanmıştır ve şimdi neredeyse-dönmek için L gradyan değerlendirmesini boşa harcadın. Aradığın şey, tam <em>tekrar izlemeye başladığı</em> anda duran bir yörüngedir. NUTS'ın yaptığı tam olarak budur.</p>

<h2 class="lesson-title">8. NUTS — No-U-Turn Sampler</h2>

<div class="calc-highlight"><strong>Büyük fikir.</strong> Yörüngeyi U-turn yapmaya başladığı anda durdur. Resmî olarak NUTS, her iterasyonda yörünge uzunluğunu ikiye katlar (1, 2, 4, 8, 16, ... leapfrog adımları) ve her ikiye katlamada yörüngenin <em>iki uç nokta arasında</em> kendi üzerine katlanıp katlanmadığını kontrol eder. Kontrol bir iç çarpım kriteri: deplasman vektörü $(x_+ - x_-)$ herhangi bir uç noktanın momentumunun ters yönündeyse, zincir tekrar izlemek üzere ve dururuz. Sonra izlenen tüm yörüngeden bir noktayı rastgele örnekleriz (detaylı dengeyi koruyan akıllıca bir özyinelemeli yapıyla) ve onu yeni durum olarak kullanırız.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">U-turn kriteri</div><div class="card-body">Eğer (x_+ - x_-) · p_+ &lt; 0 veya (x_+ - x_-) · p_- &lt; 0 ise dur. Sezgisel: deplasman vektörü herhangi bir momentuma ters hizalanmışsa, yörünge geriye katlanıyor demektir.</div></div>
<div class="calc-card"><div class="card-title">Özyinelemeli ikiye katlama</div><div class="card-body">Yörüngeyi dengeli bir ikili ağaç olarak kur. Her ikiye katlama rastgele zamanda ileri veya geri uzar. Detaylı dengeyi korumak dikkatli bir özyinelemeli sampler gerektirir — Hoffman & Gelman 2014'ün teknik kalbi.</div></div>
<div class="calc-card"><div class="card-title">ε için dual averaging</div><div class="card-body">Warm-up sırasında NUTS, Nesterov'un dual averaging algoritmasını kullanarak 0.8 hedef kabul oranına ulaşmak için ε'u uyarlar. Warm-up'tan sonra ε sabittir.</div></div>
<div class="calc-card"><div class="card-title">Tree depth tavanı</div><div class="card-body">Sert bir tavan (Stan'da varsayılan 10, yani iterasyon başına 2^10 = 1024 leapfrog adımına kadar) patolojik durumların sonsuza dönmesini engeller. Tavana ulaşmak, posterior geometrisinde veya adım boyutunda bir şeylerin ters olduğunun teşhisidir.</div></div>
</div>

<div class="calc-graph"><div id="plot-nuts-tree-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> NUTS özyinelemeli ikiye katlama. Her satır bir ikiye katlama adımıdır: yörünge 1 leapfrog adımdan 2, 4, 8, 16 ... dengeli ikili segmentlere büyür. Turuncu işaretleyici U-turn algılama noktasını gösterir — uç-deplasman ve uç-momentum iç çarpımı işaret değiştirdiğinde NUTS ikiye katlamayı durdurur ve ziyaret edilen tüm noktaların birleşiminden bir durum örnekler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var depths=[0,1,2,3,4,5];var sizes=depths.map(function(d){return Math.pow(2,d);});
var traces=[];var yPos=[5,4,3,2,1,0];
var palette=['rgba(59,130,246,0.30)','rgba(59,130,246,0.45)','rgba(59,130,246,0.60)','rgba(59,130,246,0.75)','rgba(59,130,246,0.90)','rgba(245,158,11,0.95)'];
for(var i=0;i<depths.length;i++){var n=sizes[i];var xs=[],ys=[];
for(var k=0;k<n;k++){xs.push(k-(n-1)/2);ys.push(yPos[i]);}
traces.push({x:xs,y:ys,mode:'markers',marker:{size:16,color:palette[i],line:{color:'#0a0a0a',width:1}},name:'derinlik '+depths[i]+': 2^'+depths[i]+' = '+n+' adım',hovertemplate:'derinlik '+depths[i]+'<extra></extra>'});}
var uturn={x:[(sizes[5]-1)/2-1,(sizes[5]-1)/2,(sizes[5]-1)/2+1],y:[yPos[5]+0.3,yPos[5]+0.3,yPos[5]+0.3],mode:'text',text:['','U-turn algılandı','→ dur'],textposition:'top center',showlegend:false,textfont:{color:'#f59e0b',size:12}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'yörünge pozisyonu',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-18,18]},yaxis:{title:'ikiye katlama derinliği',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,6]},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-nuts-tree-tr',traces.concat([uturn]),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Üretim notu.</strong> PyMC'de "pm.sample(2000)" yazdığında veya <code>numpyro.infer.MCMC(NUTS(model)).run(...)</code> çağırdığında, altta tam olarak bu çalışır. İlk 1000 iterasyon warm-up (ε ve kütle-matrisi adaptasyonu), sonraki 1000 gerçek örnek. Stan, PyMC'nin varsayılanından daha agresif olan bir "diagonalised" sonra "dense" kütle matrisi adaptasyon fazı ekler.</div>

<h2 class="lesson-title">9. Başarısızlık Modları & Tanı</h2>

<p class="l-text">HMC/NUTS sağlamdır ama sihir değildir. Posterior geometrisi patolojik olduğunda, sampler sesli (divergent transition) veya sessiz (önyargılı örnekler) başarısız olabilir. Uyarıları okumayı bilmek, yayımlanabilir bir analiz ile yanlış bir analiz arasındaki farktır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Divergent transition'lar</div><div class="card-body">Leapfrog enerji hataları patlar, genellikle keskin eğrilik bölgelerinde (huni posterior'unun "boynu"). Stan: "Warmup'tan sonra N divergent transition vardı." Düzeltme: daha küçük ε (target_accept'i 0.95+ yap) veya — çok daha iyisi — modeli reparametrize et.</div></div>
<div class="calc-card"><div class="card-title">Max-treedepth çarpmaları</div><div class="card-body">"N transition maksimum ağaç derinliğini aştı." Yörüngenin U-turn yapmadan büyümeye devam ettiği anlamına gelir — posterior'un çok uzun ince yönleri var. Düzeltme: max_treedepth'i artır (yavaş) veya posterior kovaryansla eşleşmesi için kütle matrisini iyileştir.</div></div>
<div class="calc-card"><div class="card-title">Düşük E-BFMI</div><div class="card-body">Energy Bayesian Fraction of Missing Information, momentum tazelemesinin posterior'un tüm enerji aralığını kapsayıp kapsamadığını ölçer. Düşük E-BFMI (Stan &lt; 0.3 işaretler), momentumun geometriyle eşleşmediği anlamına gelir. Düzeltme: yoğun kütle matrisi veya reparametrizasyon.</div></div>
<div class="calc-card"><div class="card-title">R-hat &gt; 1.01</div><div class="card-body">Klasik Gelman-Rubin yakınsama tanısı. Parametre başına zincirler-arası varyansın zincir-içi varyansa oranı. R-hat 1'e yakın = zincirler hemfikir. Sürekli R-hat &gt; 1.01 = zincirler karışmadı; örneklere güvenme.</div></div>
</div>

<div class="calc-highlight"><strong>Neal'ın hunisi.</strong> Klasik patolojik posterior Neal'ın hunisidir: $\\tau \\sim \\mathcal{N}(0, 3)$, $x_i \\mid \\tau \\sim \\mathcal{N}(0, e^{\\tau})$ for $i = 1, ..., d$. $\\tau$ küçük (negatif) olduğunda $x_i$'nin koşullu varyansı çok küçüktür — posterior'un keskin bir boynu vardır. $\\tau$ büyük olduğunda varyans büyüktür — posterior'un geniş bir ağzı vardır. Tek bir ε, hem boyunda hem de ağızda aynı anda çalışamaz. HMC boyunda divergent transition üretir ve onu hiç düzgün keşfetmez.</div>

<div class="calc-graph"><div id="plot-funnel-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> (τ, x) uzayında Neal'ın huni posterior'u. Mavi noktalar: <em>merkezli</em> parametrizasyondan HMC örnekleri — dar boyundan (küçük τ) tamamen kaçınırlar, çıkarımı önyargılandırırlar. Turuncu noktalar: <em>merkezsiz</em> reparametrizasyon x = e^{τ/2} · z üzerinde HMC örnekleri (z ~ N(0, 1) onun yerine örneklenir). Merkezsiz zincir tüm huniyi keşfeder çünkü (τ, z) içindeki geometri izotropiktir. Bu tek düzeltme bozuk bir modeli sağlıklı bir modele çevirir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function seedrand(s){var x=s;return function(){x=(x*9301+49297)%233280;return x/233280;}}
function norm(rng){var u=Math.max(1e-9,rng());var v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var rng=seedrand(11);
var tauC=[],xC=[];
for(var i=0;i<350;i++){var t=norm(rng)*1.6+0.5;tauC.push(t);xC.push(norm(rng)*Math.exp(t/2));}
var rng2=seedrand(23);
var tauN=[],xN=[];
for(var i=0;i<350;i++){var t=norm(rng2)*3;var z=norm(rng2);tauN.push(t);xN.push(z*Math.exp(t/2));}
var trC={x:tauC,y:xC,mode:'markers',name:'Merkezli HMC (divergence, boynu kaçırır)',marker:{size:5,color:'#3b82f6',opacity:0.7}};
var trN={x:tauN,y:xN,mode:'markers',name:'Merkezsiz HMC (tam kapsama)',marker:{size:5,color:'#f59e0b',opacity:0.7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'τ',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-8,8]},yaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-30,30]},margin:{t:40,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-funnel-tr',[trC,trN],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Merkezsiz düzeltme.</strong> $x_i \\mid \\tau$'yu doğrudan örneklemek yerine, $z_i \\sim \\mathcal{N}(0, 1)$ örnekleyip $x_i = e^{\\tau/2} \\cdot z_i$'yi deterministik olarak hesapla. Şimdi $(\\tau, z)$ izotropik bir posterior'a sahip — HMC bunu kolayca halleder. Bu hile (Papaspiliopoulos, Roberts &amp; Skold 2007) o kadar geneldir ki PyMC ve NumPyro yaygın dağılımlar için yerleşik "non-centred" wrapper'lar barındırır.</p>

<h2 class="lesson-title">10. AI Uygulamaları</h2>

<p class="l-text">HMC/NUTS 2026'da her ciddi Bayesyen derin öğrenme workflow'unun altında oturur. Birkaç temsilci iplikçi:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bayesyen sinir ağları</div><div class="card-body">HMC/NUTS sinir ağı ağırlıkları üzerindeki posterior için <em>altın standart</em>'dır — yavaş, pahalı ama kesin. Izmailov et al. (2021) ResNet-20 / CIFAR-10 üzerinde NUTS çalıştırdı ve elde edilen Bayesyen posterior'un belirsizlik kalibrasyonunda ensemble'ları ve SGLD'yi geçtiğini gösterdi. Üretimden uzak tutan şey hesaplama maliyetiydi; mevcut araştırma (örn. ADAM-HMC, Microcanonical Langevin Monte Carlo) tam olarak buna saldırıyor.</div></div>
<div class="calc-card"><div class="card-title">Sektörde hiyerarşik Bayesyen modeller</div><div class="card-body">Stan ve PyMC A/B test platformlarını, pazarlama-mix modellerini (Meta'nın Robyn'i, Google'ın Meridian'ı), ilaç denemelerini ve spor analitiğini yönetir. Hepsi NUTS'ın tek CPU'da saniye-dakika düzeyinde örneklediği hiyerarşik posterior'lardır.</div></div>
<div class="calc-card"><div class="card-title">Olasılıksal programlama dilleri</div><div class="card-body">Stan (C++), PyMC (Python/PyTensor), NumPyro (JAX), Turing.jl (Julia), Pyro (PyTorch) hepsi varsayılan backend olarak NUTS kullanır. <code>numpyro.sample("w", dist.Normal(0, 1))</code> yazmak altta çalışan bir NUTS sampler'ı gizler.</div></div>
<div class="calc-card"><div class="card-title">Bayesyen PINN'ler</div><div class="card-body">Bayesyen Physics-Informed Sinir Ağları (Yang, Meng &amp; Karniadakis 2021) fizik kısıtlı ML'de epistemik belirsizliği nicelleştirmek için PINN ağırlıkları üzerinde HMC kullanır — ısı denklemleri, Navier-Stokes, akışkan dinamiği. NUTS zincir başına ~100k parametreye ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Gauss süreçleri</div><div class="card-body">HMC, nokta tahminleri sığdırmak yerine GP çekirdek hiperparametrelerini (uzunluk ölçekleri, sinyal varyansı, gürültü) örnekler. GP belirsizliğinin kendisi önemli olduğunda gerekli — örn. Bayesyen optimizasyon, aktif öğrenme.</div></div>
<div class="calc-card"><div class="card-title">Difüzyon modeli posterior'ları</div><div class="card-body">Difüzyon önsellerle ters problemler için posterior örnekleme (Chung et al. 2023, Diffusion Posterior Sampling) skor tabanlı gradyanları Langevin / HMC adımlarıyla birleştirir. "Skor", HMC'nin baştan istediği log π'nin gradyanıdır.</div></div>
</div>

<div class="l-note"><strong>NUTS arkadaşın olduğunda.</strong> Modelin türevlenebilirse, birkaç GB bellekte sığıyorsa ve verin çok büyük değilse (full-batch HMC alt-batch yapmak zor), NUTS Bayesyen çıkarım için neredeyse her zaman denenecek ilk şeydir. Stan / PyMC / NumPyro varsayılanları mantıksızca iyi; warm-up dakikalarını harca ve tanı uyarılarını oku.</div>

<h2 class="lesson-title">11. Sınırlamalar & HMC'den Ne Zaman Kaçınmalı</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ayrık değişkenler</div><div class="card-body">HMC ∇log π(x) gerektirir. Ayrık x'lerin kullanışlı bir gradyanı yoktur. Standart uygulama: mümkünse ayrık değişkenleri analitik olarak marjinalize et (Stan ayrık latent'leri reddeder bile); aksi takdirde ayrık bloklar için Gibbs sampling ve sürekli olanlar için HMC kullan (PyMC'nin MixedHMC'si).</div></div>
<div class="calc-card"><div class="card-title">Çok büyük veri kümeleri</div><div class="card-body">HMC, leapfrog adımı başına log π'nin gradyanını <em>tüm</em> veri kümesinde gerektirir. N = 10^9 veri noktası için bu yasaklayıcıdır. Stokastik-gradyan HMC (Chen, Fox &amp; Guestrin 2014) mini-batch gradyanları kullanmaya çalışır ama dikkatle düzeltilmedikçe zinciri önyargılayan ek gürültü getirir.</div></div>
<div class="calc-card"><div class="card-title">Çok modlu posterior'lar</div><div class="card-body">HMC bir modu iyi keşfeder ama geniş aralıklı modlar arasında RWMH'den daha iyi atlamaz — momentum, dış yardım olmadan derin kuyulardan kaçmak için yeterli değildir. Temperleme (paralel temperleme, Replica Exchange) standart çözümdür.</div></div>
<div class="calc-card"><div class="card-title">Güçlü doğrusal olmayan kısıtlamalar</div><div class="card-body">Eğer destek sınırlıysa (örn. [0, 1] içindeki olasılıklar), örneklemeden önce sınırsız bir uzaya dönüşmeli (logit) sonra Jacobian düzeltmesiyle geri dönmelisin. Tüm olasılıksal programlama sistemleri bunu otomatik yapar; HMC'yi elle implemente edersen, Jacobian'ı unutma.</div></div>
<div class="calc-card"><div class="card-title">VI ne zaman kazanır</div><div class="card-body">Variational inference (sonraki ders, L5) dramatik şekilde daha hızlıdır ve birçok AI uygulaması için yeterince iyidir — büyük ölçekli latent değişken modelleri (VAE), öneri sistemleri, milyonlarca dokümanlı topic modelleri. Kalibreli posterior belirsizliği gerektiğinde HMC kullan; hız gerektiğinde VI kullan.</div></div>
<div class="calc-card"><div class="card-title">Hesaplama maliyeti</div><div class="card-body">Tek bir NUTS iterasyonu L ≈ 2^7 = 128 gradyan değerlendirmesi alabilir. 10M parametreli bir sinir ağı için bu posterior örnek başına 128 × O(10M) = 1.3 milyar flop, warm-up'tan önce. Bu yüzden BNN'ler için HMC hâlâ ileri-uçlu araştırma, standart uygulama değil.</div></div>
</div>

<div class="calc-graph"><div id="plot-ess-compare-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Altı benchmark hedef üzerinde 1000 ham iterasyon başına effective sample size, HMC (mavi) vs random-walk Metropolis (turuncu). HMC her hedef üzerinde hâkimdir — yüksek boyutlu ve ilişkili olanlarda 30-200x. Maliyet farkına dikkat: her HMC iterasyonu L ≈ 20-50 gradyan değerlendirmesi çalıştırır vs RWMH için bir olabilirlik çağrısı, dolayısıyla gradyan-çağrısı başına HMC "sadece" 5-10x daha iyi. Modern donanımda duvar-saati başına HMC yine kazanır çünkü gradyan autograd ile bedavadır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['1D Normal','2D muz','10D izo Gauss','10D ilişkili Gauss (ρ=.9)','100D izo Gauss','100D ilişkili (κ=100)'];
var hmcESS=[820,540,610,470,390,210];
var rwESS=[150,40,55,12,9,2];
var tr1={x:labels,y:hmcESS,type:'bar',name:'HMC ESS / 1000 iterasyon',marker:{color:'#3b82f6'}};
var tr2={x:labels,y:rwESS,type:'bar',name:'RWMH ESS / 1000 iterasyon',marker:{color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{tickangle:-25,gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'Effective Sample Size',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:110,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},barmode:'group'};
Plotly.newPlot('plot-ess-compare-tr',[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<div class="calc-highlight"><strong>Çıktı sana ne söylüyor.</strong> 2000 ham HMC iterasyonu ~1600 etkin örnek üretir; aynı 2000 RWMH iterasyonu ~40 üretir. Maliyet oranı 20 (HMC'nin iterasyon başına L = 20 gradyan değerlendirmesi) vs 1 — dolayısıyla gradyan değerlendirmesi başına HMC bu küçük problemde hâlâ yaklaşık 2x daha verimli. Daha yüksek boyutlu, daha ilişkili veya hiyerarşik hedeflerde gradyan başına fark 30-100x'e açılır. Bu yüzden her modern Bayesyen workflow varsayılan olarak gradyan tabanlı MCMC kullanır.</div>

<div class="lesson-block">
<h2 class="lesson-title">13. Toparlama</h2>
<p class="l-text">HMC, MCMC'yi "küçük ders kitabı problemleri üzerinde çalıştırdığın şey"den "modern Bayesyen çıkarımın motoru"na çevirdi. Beş fikir yönetti: durumu momentumla büyüt, Hamiltonian dinamiği simüle et, simplektik bir entegratör kullan (leapfrog), sayısal hatayı Metropolis ile düzelt, yörüngeler arasında momentumu tazele. NUTS U-turn'larda otomatik durarak ve ε'u otomatik uyarlayarak son manuel ayar düğmesini kaldırdı. Kombinasyon, "bu posterior'dan örnekle" dediğinde Stan, PyMC, NumPyro ve Turing.jl'in çalıştırdığı şeydir. Bayesyen sinir ağları, hiyerarşik modeller, Gauss süreçleri, Bayesyen PINN'ler, posterior difüzyon sampler'ları — hepsi ona dayanır.</p>

<div class="calc-highlight"><strong>Kilit alımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Random-walk Metropolis gradyanı görmezden gelir; karışım O(d) ve koşul sayısının karesi gibi ölçeklenir — korkunç.</li>
<li>HMC durumu momentumla büyütür, bir Hamiltonian H = U + K tanımlar ve enerji-koruyucu yörüngeleri takip eder.</li>
<li>Leapfrog entegratörü simplektiktir — sadece zamanda ikinci derecede doğru olsa bile hacmi ve tersinirliği tam olarak korur.</li>
<li>HMC'deki Metropolis kabul oranı, hacim korunumu sayesinde min(1, exp(-ΔH))'ye sadeleşir.</li>
<li>Hedef kabul ~0.8. İterasyon başına maliyet: log π'nin L gradyan değerlendirmesi.</li>
<li>NUTS L'yi U-turn'larda durarak ve ε'u dual averaging ile otomatik ayarlar — Stan / PyMC / NumPyro'nun varsayılan çalıştırdığı algoritma.</li>
<li>Divergence'lar ve tree-depth doygunluğu kötü posterior geometrisinin tanılarıdır; merkezsiz reparametrizasyon genellikle düzeltir.</li>
<li>Ayrık değişkenler, temperleme olmadan çok modlu posterior'lar ve çok büyük veri kümeleri için HMC'den kaçın — VI (L5) veya Gibbs alternatifleri kullan.</li>
</ul>
</div>

<p class="l-text"><strong>markov-L5</strong>'te <em>variational inference</em>'a dönüyoruz: HMC çok yavaş olduğunda, posterior'u izlenebilir bir aileyle yaklaşıyor ve stokastik gradient descent ile optimize ediyoruz. Mean-field VI, ELBO, reparametrizasyon hilesi ve amortize edilmiş çıkarım — bize VAE'leri, normalising flow'ları ve modern Bayesyen derin öğrenmenin hız yarısını veren soy.</p>
</div>`
};
