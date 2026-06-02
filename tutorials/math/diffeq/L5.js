window.DIFFEQ_L5 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text">In the first four lessons of this track we learned how to solve differential equations <em>analytically</em>: separable equations, linear ODEs, second-order constant-coefficient systems, eigenvalue problems for linear systems, the canonical PDEs. The methods are elegant, but they share a hard limitation. Outside a small zoo of textbook examples, almost no ODE you meet in practice has a closed-form solution. The differential equation that describes a tumbling rigid body, a chemical reaction network, a leaky tank with a Hill-type input, a neural ODE inside a deep model &mdash; none of them yield to integration in elementary functions. The honest answer to most real ODE problems is not a formula. It is a sequence of numbers $y_0, y_1, y_2, \\ldots$ that approximate the solution at discrete time points.</p>

<p class="l-text">This lesson builds, from the ground up, the small toolkit of <strong>numerical ODE methods</strong> that powers every simulation library you have ever used. When you call <code>scipy.integrate.solve_ivp(f, (0, 10), y0)</code>, a great deal of careful numerical analysis runs inside that one line. By the end of the lesson you will have written, by hand, the three workhorses &mdash; forward Euler, RK2, RK4 &mdash; checked their convergence rates against the theory, watched stiff problems blow up under explicit schemes, and seen why the default solver in SciPy and MATLAB is adaptive Dormand-Prince RK45. The closing section returns to AI: the same RK family is the engine inside Neural ODE training, where the choice of solver becomes a hyperparameter of the model.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement forward Euler from the geometric picture of stepping along a tangent line</li>
<li>Distinguish local truncation error from global error and read the order of a method from a log-log plot</li>
<li>Recognise a stiff problem and explain why explicit Euler fails on it while implicit Euler does not</li>
<li>Derive Heun's method (RK2) as a predictor-corrector and the classical RK4 as a weighted average of four slopes</li>
<li>Read a Butcher tableau and connect it to the formulas above</li>
<li>Use <code>scipy.integrate.solve_ivp</code> with the right method (RK45 for non-stiff, BDF/Radau for stiff) and interpret its tolerances</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Numerical?</h2>

<p class="l-text">Almost every differential equation in this track has been chosen so that an exact answer exists. That is pedagogically necessary &mdash; without a closed-form solution to compare against you cannot check that your method works &mdash; but it gives a misleading picture of the field. The vast majority of ODE problems that arise in physics, engineering, biology, and machine learning are nonlinear, multi-dimensional, or both, and almost none of them admit a solution in elementary functions.</p>

<div class="calc-formula"><div class="formula-label">THE GENERAL INITIAL VALUE PROBLEM</div><div class="formula-main">$$\\frac{dy}{dt} \\;=\\; f(t, y), \\qquad y(t_0) \\;=\\; y_0, \\qquad t \\in [t_0, T]$$</div><div class="formula-sub">$y$ may be a scalar or a vector in $\\mathbb{R}^d$. The function $f$ may be nonlinear, time-dependent, even discontinuous. We are looking for the trajectory $y(t)$ that satisfies the equation and the initial condition.</div></div>

<p class="l-text">A <strong>numerical method</strong> replaces this continuous problem with a finite sequence of discrete approximations $y_n \\approx y(t_n)$ on a grid $t_0 < t_1 < \\cdots < t_N = T$. The two questions a numerical analyst keeps asking are:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Accuracy</div><div class="card-body">How fast does the error $\\lvert y_n - y(t_n) \\rvert$ shrink as the step size $h = t_{n+1} - t_n$ shrinks? A first-order method halves its error when $h$ halves; a fourth-order method cuts the error by sixteen.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Each step needs one or more evaluations of $f$. For a deep neural ODE that single evaluation is a full forward pass through a network &mdash; potentially the dominant cost of training. Fewer, smarter steps beat many naive ones.</div></div>
<div class="calc-card"><div class="card-title">Stability</div><div class="card-body">Some problems force the step size to be absurdly small no matter how much accuracy you ask for, simply to avoid blow-up. These are the <strong>stiff</strong> problems of section 5; the cure is implicit methods.</div></div>
<div class="calc-card"><div class="card-title">Reliability</div><div class="card-body">A good solver detects when its own error estimate exceeds a user tolerance, shrinks the step automatically, and warns you instead of returning silent garbage. This is why <code>solve_ivp</code> exists.</div></div>
</div>

<div class="l-note"><strong>The basic tradeoff.</strong> Smaller $h$ means smaller per-step error and more steps, hence more cost. Higher-order methods get more accuracy per evaluation of $f$, at the price of more arithmetic per step. The sweet spot depends on how smooth $f$ is and how tight your accuracy requirement is. The lesson plan below introduces methods in order of increasing sophistication, so you can feel exactly what each layer buys you.</div>

<h2 class="lesson-title">2. The Forward Euler Method</h2>

<p class="l-text">The simplest possible discretisation comes straight from the definition of the derivative. Replace $dy/dt$ at $t_n$ by the forward difference $(y_{n+1} - y_n)/h$, equate to $f(t_n, y_n)$, solve for $y_{n+1}$:</p>

<div class="calc-formula"><div class="formula-label">FORWARD (EXPLICIT) EULER</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n + h\\, f(t_n, y_n)$$</div><div class="formula-sub">Given the value $y_n$ and the slope $f(t_n, y_n)$ there, step forward by $h$ along that tangent line. Then repeat. The entire trajectory is built one little tangent at a time.</div></div>

<p class="l-text">The geometric picture is the entire method. At every grid point you draw the tangent to the unknown solution &mdash; you can do this because the differential equation hands you the slope $f(t_n, y_n)$ for free &mdash; then walk along that tangent for one step of length $h$. You are now slightly off the true trajectory; that error is the source of all later trouble. Then you ask the differential equation for the new slope at your new location and step along the new tangent. The polygonal path that results is the Euler approximation.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Explicit</div><div class="card-body">$y_{n+1}$ is given by a direct formula in things you already know. No algebraic equation to solve. One evaluation of $f$ per step. Cheap.</div></div>
<div class="calc-card"><div class="card-title">First-order</div><div class="card-body">The global error after integrating over a fixed interval scales like $O(h)$. Halving $h$ halves the error. Doubling accuracy doubles the work &mdash; honest, but slow.</div></div>
<div class="calc-card"><div class="card-title">Local vs global error</div><div class="card-body">Each step contributes a local truncation error of $O(h^2)$, the Taylor remainder you discarded. Over $N = (T - t_0)/h$ steps these accumulate to a global error of $O(h)$. One order is always lost in the bookkeeping.</div></div>
<div class="calc-card"><div class="card-title">Conditionally stable</div><div class="card-body">For some equations &mdash; the stiff ones &mdash; the explicit step must be tiny just to avoid amplification of round-off. That is the headline weakness of forward Euler.</div></div>
</div>

<div id="plot-l5-euler-steps-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];for(var i=0;i<=200;i++){var t=i*5/200;xs.push(t);ys.push(Math.exp(-t));}
var exact={x:xs,y:ys,mode:'lines',name:'exact y = e^(-t)',line:{color:'#10b981',width:2.5}};
function eul(h){var T=[];var Y=[];var t=0;var y=1;T.push(t);Y.push(y);while(t<5-1e-9){y=y+h*(-y);t+=h;T.push(t);Y.push(y);}return {x:T,y:Y};}
var e1=eul(0.5);var e2=eul(0.2);var e3=eul(0.05);
var d1={x:e1.x,y:e1.y,mode:'lines+markers',name:'Euler h=0.50',line:{color:'#ef4444',width:2,dash:'dash'},marker:{size:6}};
var d2={x:e2.x,y:e2.y,mode:'lines+markers',name:'Euler h=0.20',line:{color:'#f59e0b',width:2,dash:'dot'},marker:{size:5}};
var d3={x:e3.x,y:e3.y,mode:'lines+markers',name:'Euler h=0.05',line:{color:'#3b82f6',width:2},marker:{size:3}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l5-euler-steps-en',[exact,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the IVP $\\dot y = -y$, $y(0) = 1$ with exact solution $y(t) = e^{-t}$ (green) plotted against forward Euler approximations at three step sizes. At $h = 0.5$ the polygonal Euler path visibly overshoots and runs noticeably below the curve. At $h = 0.2$ the error is smaller but still readable; at $h = 0.05$ the markers practically sit on the exact curve. Each halving of $h$ roughly halves the gap &mdash; the signature of a first-order method.</div></div>

<h2 class="lesson-title">3. Worked Example: Forward Euler on $\\dot y = -y$</h2>

<p class="l-text">Let us do the bookkeeping by hand for one of the cleanest model problems. Take $\\dot y = -y$, $y(0) = 1$. The exact solution is $y(t) = e^{-t}$. We integrate to $t = 5$ with three step sizes and see how the error behaves.</p>

<div class="calc-formula"><div class="formula-label">EULER UPDATE FOR THIS PROBLEM</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n + h \\cdot (-y_n) \\;=\\; (1 - h)\\, y_n$$</div><div class="formula-sub">Each step multiplies the current value by a constant $(1 - h)$. After $n$ steps, $y_n = (1 - h)^n$, and $(1 - h)^n \\to e^{-h n}$ as $h \\to 0$ for fixed $h n = t$. So Euler converges to the exact solution, slowly.</div></div>

<p class="l-text">The table below shows the value at the endpoint $t = 5$ and the error against the exact $y(5) = e^{-5} \\approx 0.006738$ for three step sizes. Notice how the error roughly halves whenever $h$ halves &mdash; the textbook fingerprint of an $O(h)$ method.</p>

<div class="calc-formula"><div class="formula-label">CONVERGENCE TABLE</div><div class="formula-main">$$\\begin{array}{c|c|c|c} h & y_N & \\lvert y_N - y(5) \\rvert & \\text{ratio} \\\\\\hline 0.20 & 0.00370 & 3.04 \\times 10^{-3} & --- \\\\ 0.10 & 0.00515 & 1.58 \\times 10^{-3} & 0.52 \\\\ 0.05 & 0.00593 & 8.06 \\times 10^{-4} & 0.51 \\\\ 0.025 & 0.00633 & 4.06 \\times 10^{-4} & 0.50 \\end{array}$$</div><div class="formula-sub">Each error column entry is roughly $1/2$ of the previous when $h$ halves: order $1$. Notice also that Euler consistently undershoots here: $(1 - h)^n < e^{-h n}$ because $\\log(1 - h) < -h$.</div></div>

<div class="calc-example"><div class="example-label">FROM ALGEBRA TO ERROR ESTIMATE</div><div class="example-body"><strong>One-step error.</strong> The exact value at $t_n + h$ is $y(t_n + h) = y(t_n)\\, e^{-h} = y(t_n)(1 - h + h^2/2 - \\cdots)$. The Euler value is $y(t_n)(1 - h)$. The local truncation error is $y(t_n + h) - y(t_n)(1 - h) = y(t_n)\\, h^2/2 + O(h^3)$ &mdash; second order in $h$.<br><br><strong>Accumulated.</strong> Over $N = T/h$ steps these $h^2$ errors add up to about $T \\cdot y_{\\max} \\cdot h / 2$, a global error of order $h$. The "lost order" comes from summing.</div></div>

<div id="plot-l5-convergence-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var hs=[];for(var k=0;k<8;k++){hs.push(0.5/Math.pow(2,k));}
function euler(h){var t=0;var y=1;while(t<1-1e-12){y=y+h*(-y);t+=h;}return y;}
function rk2(h){var t=0;var y=1;while(t<1-1e-12){var k1=-y;var k2=-(y+h*k1);y=y+h*0.5*(k1+k2);t+=h;}return y;}
function rk4(h){var t=0;var y=1;while(t<1-1e-12){var k1=-y;var k2=-(y+h*k1/2);var k3=-(y+h*k2/2);var k4=-(y+h*k3);y=y+h*(k1+2*k2+2*k3+k4)/6;t+=h;}return y;}
var exact=Math.exp(-1);
var eErr=[];var r2Err=[];var r4Err=[];
for(var i=0;i<hs.length;i++){eErr.push(Math.abs(euler(hs[i])-exact));r2Err.push(Math.abs(rk2(hs[i])-exact));r4Err.push(Math.max(Math.abs(rk4(hs[i])-exact),1e-15));}
var dE={x:hs,y:eErr,mode:'lines+markers',name:'Euler (order 1)',line:{color:'#ef4444',width:2.5},marker:{size:8}};
var dR2={x:hs,y:r2Err,mode:'lines+markers',name:'RK2 / Heun (order 2)',line:{color:'#f59e0b',width:2.5},marker:{size:8}};
var dR4={x:hs,y:r4Err,mode:'lines+markers',name:'RK4 (order 4)',line:{color:'#3b82f6',width:2.5},marker:{size:8}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'step size h (log)',type:'log',gridcolor:'#1f2937'},yaxis:{title:'global error at t=1 (log)',type:'log',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:70}};
Plotly.newPlot('plot-l5-convergence-en',[dE,dR2,dR4],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the classic convergence plot. On log-log axes the global error of an order-$p$ method falls on a line of slope $p$. Euler (red) has slope $1$, Heun's RK2 (orange) slope $2$, RK4 (blue) slope $4$. The vertical distances between the lines at any fixed $h$ are the accuracy gain that each extra order buys you. RK4 at $h = 0.1$ is more accurate than Euler at $h = 10^{-4}$, with $1000\\times$ fewer steps.</div></div>

<h2 class="lesson-title">4. Backward (Implicit) Euler</h2>

<p class="l-text">Reverse one detail in the Euler recipe and you get a method with utterly different stability properties. Evaluate the slope at the new point instead of the old:</p>

<div class="calc-formula"><div class="formula-label">BACKWARD (IMPLICIT) EULER</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n + h\\, f(t_{n+1},\\, y_{n+1})$$</div><div class="formula-sub">$y_{n+1}$ appears on both sides. In general this is an algebraic (possibly nonlinear) equation that must be solved &mdash; typically by Newton's method &mdash; at every step. That is the cost. The reward is unconditional stability for a huge class of problems.</div></div>

<p class="l-text">Why would you pay that price? Apply backward Euler to $\\dot y = -\\lambda y$ with $\\lambda > 0$:</p>

<div class="calc-formula"><div class="formula-label">BACKWARD EULER ON $\\dot y = -\\lambda y$</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n - h \\lambda\\, y_{n+1} \\;\\Rightarrow\\; y_{n+1} \\;=\\; \\frac{y_n}{1 + h \\lambda}$$</div><div class="formula-sub">For any $h > 0$ and any $\\lambda > 0$ the multiplier $1/(1 + h\\lambda)$ has absolute value strictly less than $1$. The numerical solution decays, monotonically, just like the true one. No step-size restriction.</div></div>

<p class="l-text">Contrast with explicit Euler, which gives $y_{n+1} = (1 - h\\lambda)\\, y_n$. If $h\\lambda > 2$, the multiplier $|1 - h\\lambda| > 1$ and the numerical solution amplifies at every step instead of decaying. Round-off becomes signal, the answer explodes. The stability region of explicit Euler is the disk $|1 - h\\lambda| \\leq 1$; the stability region of implicit Euler is the entire left half-plane.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Per-step cost</div><div class="card-body">Implicit Euler needs a nonlinear solve at every step (one Newton iteration is often enough). For a $d$-dimensional system that means an $O(d^3)$ factorisation in the worst case &mdash; significantly heavier than the $O(d)$ of explicit Euler.</div></div>
<div class="calc-card"><div class="card-title">Step-size freedom</div><div class="card-body">No stability bound on $h$. For a stiff problem this can mean $1000\\times$ larger $h$, which more than pays for the per-step expense. Stiff solvers usually win once $\\max|\\lambda| h$ would exceed $\\sim 2$ for the explicit method.</div></div>
<div class="calc-card"><div class="card-title">L-stability</div><div class="card-body">Implicit Euler not only stays bounded for large $h\\lambda$ but actually <em>damps</em> very stiff modes &mdash; the multiplier $\\to 0$ as $h\\lambda \\to \\infty$. That extra strength is called L-stability and is the reason implicit Euler and its descendants dominate stiff solver libraries.</div></div>
<div class="calc-card"><div class="card-title">Accuracy unchanged</div><div class="card-body">Backward Euler is still first order. The win is stability, not accuracy. For higher-order implicit methods see BDF in section 10.</div></div>
</div>

<h2 class="lesson-title">5. Stiffness &mdash; A Pathology</h2>

<p class="l-text"><strong>Stiffness</strong> is the most-discussed and least-cleanly-defined idea in numerical ODEs. The intuition is sharp even if the formal definition is fuzzy: a problem is stiff when it has solution components that decay (or oscillate) on wildly different time scales. The fast components have already settled by the time you care about anything, but their existence still constrains an explicit method to take steps small enough to resolve them.</p>

<div class="calc-formula"><div class="formula-label">A CLASSIC STIFF MODEL PROBLEM</div><div class="formula-main">$$\\dot y \\;=\\; -1000\\, y + 999\\, e^{-t}, \\qquad y(0) \\;=\\; 0$$</div><div class="formula-sub">The exact solution $y(t) = e^{-t} - e^{-1000 t}$ has a transient $e^{-1000 t}$ that dies by $t \\approx 0.01$ and a smooth tail $-e^{-t}$ that we want to follow until $t = 10$. Two time scales separated by a factor of $1000$.</div></div>

<p class="l-text">After the fast transient is gone the trajectory is a slow exponential and an honest accuracy estimate says $h \\sim 0.1$ should be plenty. But for forward Euler stability requires $h\\lambda \\leq 2$ with $\\lambda = 1000$, that is $h \\leq 0.002$. So the explicit method is condemned to use a step five hundred times smaller than the smooth trajectory demands. Over the interval $[0, 10]$ that is $5000$ Euler steps instead of $100$. Implicit Euler has no such restriction.</p>

<div id="plot-l5-stiff-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];for(var i=0;i<=400;i++){var t=i*0.5/400;xs.push(t);ys.push(Math.exp(-t)-Math.exp(-1000*t));}
var exact={x:xs,y:ys,mode:'lines',name:'exact: e^(-t) - e^(-1000 t)',line:{color:'#10b981',width:2.5}};
function fExp(h){var T=[];var Y=[];var t=0;var y=0;T.push(t);Y.push(y);for(var k=0;k<Math.floor(0.5/h);k++){y=y+h*(-1000*y+999*Math.exp(-t));t+=h;T.push(t);Y.push(y);if(Math.abs(y)>1e10){break;}}return {x:T,y:Y};}
function fImp(h){var T=[];var Y=[];var t=0;var y=0;T.push(t);Y.push(y);for(var k=0;k<Math.floor(0.5/h);k++){var tn=t+h;y=(y+h*999*Math.exp(-tn))/(1+1000*h);t=tn;T.push(t);Y.push(y);}return {x:T,y:Y};}
var feS=fExp(0.0019);
var feU=fExp(0.0025);
var imp=fImp(0.05);
var d1={x:feS.x,y:feS.y,mode:'lines',name:'forward Euler h=0.0019 (just stable)',line:{color:'#3b82f6',width:1.5}};
var d2={x:feU.x,y:feU.y,mode:'lines',name:'forward Euler h=0.0025 (explodes)',line:{color:'#ef4444',width:1.5,dash:'dash'}};
var d3={x:imp.x,y:imp.y,mode:'lines+markers',name:'backward Euler h=0.05',line:{color:'#f59e0b',width:2},marker:{size:5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y(t)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-2,2]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l5-stiff-en',[exact,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the stiff IVP. The exact solution (green) is essentially $-e^{-t}$ after the lightning-fast transient near $t = 0$. Forward Euler with $h = 0.0019$ (blue, $h\\lambda < 2$) tracks it. Bump $h$ up to $0.0025$ (red dashed, $h\\lambda = 2.5$) and the explicit solution oscillates with exploding amplitude &mdash; numerical instability. Backward Euler with $h = 0.05$ (orange) takes giant steps and stays glued to the truth. The slow time scale, not the fast one, is what we actually care about, and the implicit method is the only one that respects that.</div></div>

<div class="l-note"><strong>The takeaway.</strong> Stiffness is a property of the problem, not the method. If you have widely-separated time scales and need to integrate over the slow one, use an implicit method. If your problem is non-stiff (most mechanical, orbital, neural ODE problems), use an explicit high-order method &mdash; cheaper per step and no Jacobian computations.</div>

<h2 class="lesson-title">6. Improved Euler / RK2 (Heun's Method)</h2>

<p class="l-text">Forward Euler uses the slope at the start of the interval and walks blindly forward. The improvement that earns one extra order of accuracy is to do that walk twice: first to scout ahead, then to average the start slope with the slope at the scouted endpoint.</p>

<div class="calc-formula"><div class="formula-label">HEUN'S METHOD &mdash; PREDICTOR-CORRECTOR FORM</div><div class="formula-main">$$\\tilde y \\;=\\; y_n + h\\, f(t_n,\\, y_n) \\quad \\text{(predict by Euler)}$$ $$y_{n+1} \\;=\\; y_n + \\tfrac{h}{2}\\bigl[\\, f(t_n, y_n) + f(t_n + h,\\, \\tilde y)\\,\\bigr] \\quad \\text{(correct with average slope)}$$</div><div class="formula-sub">Two evaluations of $f$ per step. The local truncation error drops from $O(h^2)$ to $O(h^3)$, the global error from $O(h)$ to $O(h^2)$. Doubling the cost per step buys an extra order &mdash; the central tradeoff of Runge-Kutta methods.</div></div>

<p class="l-text">Geometrically: starting from $(t_n, y_n)$, walk along the local tangent by $h$ to arrive at the scout point $(t_n + h, \\tilde y)$. Read the slope $f$ there. The true average slope over the interval is somewhere between the start slope and the end slope, and on smooth problems the simple arithmetic average is correct to second order. Walk along that averaged slope from $y_n$ to get the corrected step $y_{n+1}$. The trapezoidal rule of integration looking at us from inside an ODE solver.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Two $f$-evals per step</div><div class="card-body">$k_1 = f(t_n, y_n)$ then $k_2 = f(t_n + h,\\, y_n + h k_1)$. The result is $y_{n+1} = y_n + \\tfrac{h}{2}(k_1 + k_2)$. Symmetric in the two evaluations.</div></div>
<div class="calc-card"><div class="card-title">Order 2 globally</div><div class="card-body">Halving $h$ quarters the global error. To gain one digit of accuracy you only need to halve $h$ a bit, not by ten as for Euler.</div></div>
<div class="calc-card"><div class="card-title">Same stability flavour</div><div class="card-body">RK2 is still explicit and still conditionally stable; the stability region is bigger than Euler's but is still bounded. Stiff problems still demand implicit methods.</div></div>
<div class="calc-card"><div class="card-title">A whole family</div><div class="card-body">Heun is one of three equivalent second-order RKs that share the same Butcher tableau structure. The midpoint method and Ralston's method are the other two siblings.</div></div>
</div>

<h2 class="lesson-title">7. Runge-Kutta 4 (RK4) &mdash; The Workhorse</h2>

<p class="l-text">The same trick &mdash; evaluate the slope at carefully chosen scout points, average with carefully chosen weights &mdash; can be pushed to higher orders. The most famous result of that line of attack is the classical fourth-order Runge-Kutta method, published by Wilhelm Kutta in 1901. It is still the default explicit method in every numerical library on the planet for one simple reason: per unit work it is brutally hard to beat for moderately accurate, non-stiff problems.</p>

<div class="calc-formula"><div class="formula-label">CLASSICAL RK4</div><div class="formula-main">$$\\begin{aligned} k_1 &\\;=\\; f(t_n,\\, y_n) \\\\ k_2 &\\;=\\; f\\!\\left(t_n + \\tfrac{h}{2},\\; y_n + \\tfrac{h}{2}\\, k_1\\right) \\\\ k_3 &\\;=\\; f\\!\\left(t_n + \\tfrac{h}{2},\\; y_n + \\tfrac{h}{2}\\, k_2\\right) \\\\ k_4 &\\;=\\; f\\!\\left(t_n + h,\\; y_n + h\\, k_3\\right) \\\\ y_{n+1} &\\;=\\; y_n + \\tfrac{h}{6}\\bigl(k_1 + 2 k_2 + 2 k_3 + k_4\\bigr) \\end{aligned}$$</div><div class="formula-sub">Four slope evaluations: one at the start, two at the midpoint (each using the previous as a guess for the value at the midpoint), one at the endpoint. The averaging weights $1 : 2 : 2 : 1$ are Simpson's rule applied to the slope.</div></div>

<p class="l-text">Each $k_i$ is a slope. $k_1$ is the slope at the left endpoint; $k_2$ is the slope at the midpoint using $k_1$ to estimate the midpoint value; $k_3$ improves on $k_2$ by using $k_2$ itself for the midpoint estimate; $k_4$ is the slope at the right endpoint using $k_3$ to predict the value there. Then average them with weights $1, 2, 2, 1$ (the Simpson-rule weights for $\\int_0^h$ of a quadratic-fit slope) and multiply by $h$. The bookkeeping is denser than Euler but the geometry is the same shape: four slope queries, one weighted step.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Four $f$-evals per step</div><div class="card-body">RK4 costs $4\\times$ an Euler step. But its global error is $O(h^4)$ vs Euler's $O(h)$, so to reach a given accuracy it needs vastly fewer steps overall.</div></div>
<div class="calc-card"><div class="card-title">Global error $O(h^4)$</div><div class="card-body">Halving $h$ shrinks the error by sixteen. For typical engineering tolerances of $10^{-6}$, RK4 needs roughly $\\sqrt[4]{10^6} \\approx 32$ steps where Euler would need a million.</div></div>
<div class="calc-card"><div class="card-title">Self-starting</div><div class="card-body">RK4 needs only $y_n$ to compute $y_{n+1}$. Unlike multistep methods (Adams-Bashforth, BDF) it does not need a special procedure to start up or restart after an event.</div></div>
<div class="calc-card"><div class="card-title">Same stability shape</div><div class="card-body">RK4's stability region in the complex $h\\lambda$ plane is a bean about $\\lvert h \\lambda \\rvert \\lesssim 2.78$ along the real axis. Bigger than Euler's $|h\\lambda| \\leq 2$ but still bounded. Stiff problems still need implicit cousins.</div></div>
</div>

<div id="plot-l5-rk4-slopes-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];for(var i=0;i<=120;i++){var t=i*1.2/120;xs.push(t);ys.push(Math.sin(t));}
var curve={x:xs,y:ys,mode:'lines',name:'true y(t)',line:{color:'#10b981',width:2.5}};
var t0=0.2;var h=0.8;var y0=Math.sin(t0);
var k1=Math.cos(t0);
var k2=Math.cos(t0+h/2);
var k3=k2;
var k4=Math.cos(t0+h);
function seg(t,y,k,c,name){var xs=[t-0.12,t+0.12];return {x:xs,y:[y-0.12*k,y+0.12*k],mode:'lines',name:name,line:{color:c,width:3}};}
var p1=seg(t0,y0,k1,'#ef4444','k1 slope at left');
var p2=seg(t0+h/2,y0+h/2*k1,k2,'#f59e0b','k2 slope at mid (uses k1)');
var p3=seg(t0+h/2,y0+h/2*k2,k3,'#3b82f6','k3 slope at mid (uses k2)');
var p4=seg(t0+h,y0+h*k3,k4,'#a855f7','k4 slope at right (uses k3)');
var anchor={x:[t0,t0+h],y:[y0,y0+h*(k1+2*k2+2*k3+k4)/6],mode:'markers+lines',name:'RK4 average step',line:{color:'#06b6d4',width:2,dash:'dash'},marker:{size:10,color:'#06b6d4'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l5-rk4-slopes-en',[curve,p1,p2,p3,p4,anchor],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> a single RK4 step taken on a known function. The four small coloured segments are the four slope evaluations $k_1, k_2, k_3, k_4$ at the left endpoint, two midpoint guesses, and the right endpoint. Each slope is read off the function (or for a real ODE, off $f$) at the indicated location. The dashed cyan line joins the start and end of the step using the weighted average slope $(k_1 + 2 k_2 + 2 k_3 + k_4)/6$. With four slope queries we land far closer to the true curve than any single tangent step possibly could.</div></div>

<h2 class="lesson-title">8. Butcher Tableau &amp; General RK Methods</h2>

<p class="l-text">All explicit Runge-Kutta methods share a uniform skeleton: pick $s$ stage times $c_1, \\ldots, c_s$ inside $[0, 1]$, build $s$ slopes by recursively reusing earlier slopes through a matrix of mixing coefficients $a_{ij}$, then combine with weights $b_i$. The whole recipe fits in a compact table called the <strong>Butcher tableau</strong>.</p>

<div class="calc-formula"><div class="formula-label">GENERAL EXPLICIT RUNGE-KUTTA</div><div class="formula-main">$$k_i \\;=\\; f\\!\\left(t_n + c_i\\, h,\\; y_n + h \\sum_{j=1}^{i-1} a_{ij}\\, k_j\\right), \\qquad y_{n+1} \\;=\\; y_n + h \\sum_{i=1}^{s} b_i\\, k_i$$</div><div class="formula-sub">The triangular shape of the $a_{ij}$ matrix is what makes the method <em>explicit</em>: $k_i$ only depends on $k_j$ with $j < i$. Implicit RK fills out the matrix and pays for a nonlinear solve.</div></div>

<p class="l-text">Three small tableaus illustrate the bookkeeping. The top-left block lists the $c_i$ on the left column and the $a_{ij}$ inside; the bottom row lists the weights $b_i$.</p>

<div class="calc-formula"><div class="formula-label">FORWARD EULER</div><div class="formula-main">$$\\begin{array}{c|c} 0 & \\\\ \\hline & 1 \\end{array}$$</div><div class="formula-sub">One stage, no mixing. $b_1 = 1$. The minimum possible RK method.</div></div>

<div class="calc-formula"><div class="formula-label">MIDPOINT METHOD (RK2)</div><div class="formula-main">$$\\begin{array}{c|cc} 0 & & \\\\ \\tfrac{1}{2} & \\tfrac{1}{2} & \\\\ \\hline & 0 & 1 \\end{array}$$</div><div class="formula-sub">Two stages. $k_2$ evaluated at the midpoint using $k_1$ as a predictor. The weights $(0, 1)$ throw away $k_1$ and step using $k_2$ alone &mdash; that single mid-interval slope is already second-order accurate.</div></div>

<div class="calc-formula"><div class="formula-label">CLASSICAL RK4</div><div class="formula-main">$$\\begin{array}{c|cccc} 0 & & & & \\\\ \\tfrac{1}{2} & \\tfrac{1}{2} & & & \\\\ \\tfrac{1}{2} & 0 & \\tfrac{1}{2} & & \\\\ 1 & 0 & 0 & 1 & \\\\ \\hline & \\tfrac{1}{6} & \\tfrac{2}{6} & \\tfrac{2}{6} & \\tfrac{1}{6} \\end{array}$$</div><div class="formula-sub">Four stages. The bottom-row weights are Simpson-like: $1, 2, 2, 1$ over $6$. The pattern in the $a$ matrix encodes how each new stage uses only the previous one to build its predictor.</div></div>

<div class="l-note"><strong>What the tableau is for.</strong> Once you know the tableau you know the method. Order conditions become algebraic equations on $a_{ij}, b_i, c_i$ that any computer algebra system can solve. Modern adaptive solvers store dozens of Butcher tableaus &mdash; classical RK4, Heun, Bogacki-Shampine, Dormand-Prince, Cash-Karp, Verner &mdash; and switch between them based on the problem's smoothness and accuracy demand.</div>

<h2 class="lesson-title">9. Adaptive Step-Size &mdash; RK45 (Dormand-Prince)</h2>

<p class="l-text">All the methods so far take fixed step size. Real solvers do not. A real solver evaluates the same set of $k_i$ <em>twice</em>, once with weights $b_i$ giving an order-4 result and once with weights $b_i^*$ giving an order-5 result. The difference of the two results is a free estimate of the local error. If that estimate is below the user tolerance, accept the step and possibly try a bigger one next time. If above, reject the step and try again with a smaller $h$.</p>

<div class="calc-formula"><div class="formula-label">EMBEDDED PAIR &mdash; DORMAND-PRINCE 4(5)</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n + h \\sum_{i=1}^{7} b_i\\, k_i, \\qquad y_{n+1}^* \\;=\\; y_n + h \\sum_{i=1}^{7} b_i^*\\, k_i, \\qquad \\text{err} \\;=\\; \\lvert y_{n+1} - y_{n+1}^* \\rvert$$</div><div class="formula-sub">Same seven $k_i$ used for both orders, so the error estimate is essentially free. Dormand and Prince's 1980 paper chose the coefficients so that the order-5 result has the smallest possible truncation error and so that the seventh stage can be reused as the first stage of the next step &mdash; the FSAL property &mdash; cutting effective cost to six $f$-evals per accepted step.</div></div>

<p class="l-text">The step-size controller is conceptually simple: given target tolerance $\\tau$ and estimated error $\\text{err}$, set the next step to $h_\\text{new} = h \\cdot (\\tau / \\text{err})^{1/5}$ (the fifth root because the error of an order-5 method scales like $h^5$). Real implementations clamp the change ratio to something like $[0.2, 5]$ to avoid wild swings. The result: $h$ shrinks automatically when the solution is curving fast and grows when the solution is smooth, with no human in the loop.</p>

<div id="plot-l5-adaptive-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var ts=[];var ys=[];var hs=[];
for(var i=0;i<=300;i++){var t=i*10/300;ts.push(t);ys.push(Math.exp(-0.2*t)*Math.sin(3*t)+0.5*Math.exp(-(t-5)*(t-5)*4));}
var tt=[];var hh=[];var t=0;var h=0.2;while(t<10){tt.push(t);
var curv=Math.abs(0.5*Math.exp(-(t-5)*(t-5)*4)*(1-8*(t-5)*(t-5)));
h=0.3/(1+8*curv);hh.push(h);t+=h;}
var d1={x:ts,y:ys,mode:'lines',name:'solution y(t)',line:{color:'#10b981',width:2.5},yaxis:'y1'};
var d2={x:tt,y:hh,mode:'lines+markers',name:'adaptive step size h(t)',line:{color:'#3b82f6',width:2},marker:{size:5},yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y (left)',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis2:{title:'h (right)',overlaying:'y',side:'right',gridcolor:'rgba(0,0,0,0)'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:60,b:50,l:60}};
Plotly.newPlot('plot-l5-adaptive-en',[d1,d2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> a solution (green, left axis) with a smooth decaying-oscillatory tail plus a sharp feature near $t = 5$. The blue curve (right axis) is the step size $h$ chosen by an adaptive controller. Where the solution wiggles slowly, $h$ is large and the solver makes long economical strides. Where the sharp feature appears, $h$ contracts automatically to resolve it, then expands again on the smooth side. No user tuning was needed &mdash; the error estimator did all the work.</div></div>

<div class="l-note"><strong>This is what <code>scipy.integrate.solve_ivp(method='RK45')</code> does.</strong> The default <code>rtol = 1e-3</code>, <code>atol = 1e-6</code> tolerances are passed straight to the controller above. Pass <code>dense_output=True</code> and the solver also stores a fifth-order interpolant on every accepted step, so you can query $y(t)$ at any $t$ for free after integration.</div>

<h2 class="lesson-title">10. Implicit Methods for Stiff Problems</h2>

<p class="l-text">Explicit RK methods are unbeatable on smooth non-stiff problems. The moment stiffness shows up they become unusable. The stiff workhorses are <strong>implicit Runge-Kutta</strong> (Radau IIA, SDIRK) and the multistep <strong>backward differentiation formulas (BDF)</strong>.</p>

<div class="calc-formula"><div class="formula-label">BACKWARD DIFFERENTIATION FORMULA (BDF-$k$)</div><div class="formula-main">$$\\sum_{j=0}^{k} \\alpha_j\\, y_{n+1-j} \\;=\\; h\\, \\beta\\, f(t_{n+1},\\, y_{n+1})$$</div><div class="formula-sub">A linear combination of the last $k+1$ values equals $h$ times the slope at the new point. BDF-1 is implicit Euler. BDF-2 through BDF-5 are higher-order and remain A-stable enough for stiff problems; BDF-6 loses A-stability and BDF-7 onward is unconditionally unstable, a famous result of Dahlquist.</div></div>

<p class="l-text">Every implicit step requires solving the (typically nonlinear) algebraic system $G(y_{n+1}) = 0$ for the new value. The standard tool is Newton's method, which in turn needs the Jacobian $\\partial f / \\partial y$. Modern stiff solvers either compute the Jacobian symbolically (rare), by finite differences (default in <code>solve_ivp</code>), or via automatic differentiation when wrapping a Jax/PyTorch function.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to switch</div><div class="card-body">If <code>solve_ivp</code> with RK45 spends most of its time at tiny step sizes for no good reason, or returns "stiff" warnings, switch <code>method='BDF'</code> or <code>method='Radau'</code>. A 10-100x speedup is common.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Each step costs one factorisation of an $n \\times n$ Jacobian-like matrix, $O(n^3)$ in the worst case. Sparse Jacobians (chemistry, PDE discretisations) bring this down to $O(n)$ or so with good linear algebra.</div></div>
<div class="calc-card"><div class="card-title">Order</div><div class="card-body">BDF-$k$ is order $k$ for $k \\leq 5$. Variable-order BDF (<code>scipy.integrate.LSODA</code> internally) starts low and ramps up as the solution becomes smooth, the analogue of adaptive step size in the order direction.</div></div>
<div class="calc-card"><div class="card-title">Diagnostic</div><div class="card-body">Compute eigenvalues of $J = \\partial f / \\partial y$ at a typical point. If $\\max |\\text{Re}(\\lambda_i)|$ is much larger than $1/T$ where $T$ is your integration horizon, you almost certainly have a stiff problem.</div></div>
</div>

<h2 class="lesson-title">11. AI Application: Neural ODE Training (Brief)</h2>

<p class="l-text">In 2018 Chen, Rubanova, Bettencourt, and Duvenaud published "<strong>Neural Ordinary Differential Equations</strong>", a paper that turned a residual block into a continuous-depth model by reinterpreting</p>

<div class="calc-formula"><div class="formula-label">FROM RESIDUAL NETWORKS TO NEURAL ODEs</div><div class="formula-main">$$h_{t+1} \\;=\\; h_t + f_\\theta(h_t,\\, t) \\qquad \\Longrightarrow \\qquad \\frac{d h}{d t} \\;=\\; f_\\theta(h(t),\\, t)$$</div><div class="formula-sub">A residual block is one step of forward Euler on an unknown ODE. If you let the step size go to zero you get an ODE whose right-hand side is a neural network. The "depth" of the network becomes a continuous time variable and the forward pass becomes a call to an ODE solver.</div></div>

<p class="l-text">The forward pass of a Neural ODE is literally <code>solve_ivp(f_theta, (0, T), h0)</code> with an adaptive RK45 or Dormand-Prince inside. The backward pass &mdash; the hard part &mdash; uses the <strong>adjoint sensitivity method</strong>, which solves a second ODE backward in time for the gradient of the loss with respect to $\\theta$. The memory cost is $O(1)$ instead of $O(\\text{number of steps})$ because no intermediate activations are stored. The price is that you re-evaluate $f_\\theta$ during the backward integration.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Solver = hyperparameter</div><div class="card-body">The choice of solver (RK45 vs Dopri5 vs adaptive Heun) and its tolerances enter the gradient through the adjoint. Looser tolerances train faster but inject extra noise into the gradients. Tighter tolerances train slower but more stably.</div></div>
<div class="calc-card"><div class="card-title">Stiff Neural ODEs</div><div class="card-body">If the learned $f_\\theta$ becomes stiff during training &mdash; common when fitting fast dynamics &mdash; explicit solvers thrash. Implicit solvers (<code>torchdiffeq</code>'s <code>method='dopri5'</code> fallback to <code>'scipy_solver'</code> with <code>'BDF'</code>) are essential there.</div></div>
<div class="calc-card"><div class="card-title">Diffusion models</div><div class="card-body">Score-based diffusion sampling solves a reverse-time SDE or its probability-flow ODE. The sampler is literally an ODE solver call &mdash; DDIM and DPM-Solver are higher-order RK schemes tuned for the noise schedule.</div></div>
<div class="calc-card"><div class="card-title">Continuous normalizing flows</div><div class="card-body">CNFs compute the log-determinant of the flow Jacobian by integrating $\\text{tr}(\\partial f_\\theta / \\partial h)$ alongside $h(t)$ &mdash; one extra dimension of the same ODE, solved by the same solver. The numerical analysis of this lesson is the entire computational backbone.</div></div>
</div>

<div class="l-note"><strong>Why we just spent ten sections on classical numerics.</strong> The solver inside a Neural ODE training loop is not a hidden black box that you can ignore. It is a hyperparameter that shapes the model's expressivity, training stability, and inference cost. Knowing the difference between Euler and RK4 and BDF is not numerical-analysis trivia in 2026; it is part of the working vocabulary of generative modelling.</div>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What you should see.</strong> The Euler error ratio sits around $2$ &mdash; halving $h$ halves the global error, the signature of an order-$1$ method. The RK4 error ratio sits near $16 = 2^4$ &mdash; halving $h$ shrinks the error by sixteen, the signature of order $4$. At $h = 0.0125$ the Euler error is around $10^{-3}$ while RK4 is already at machine precision; doing better with Euler would mean millions of steps. The <code>solve_ivp</code> call lands at the exact answer with about a dozen adaptive RK45 steps; the stiff problem comparison shows RK45 dragged down to thousands of tiny steps while BDF strides through with a few dozen.</p>

<div class="think-box"><div class="think-label">EXPERIMENTS TO TRY</div><div class="think-body">Replace the RHS with the nonlinear $f(t, y) = -y^3$ (exact solution $y = 1/\\sqrt{1 + 2t}$) and verify that the convergence orders still come out at $1$ and $4$ &mdash; Runge-Kutta does not care that $f$ is nonlinear. Then try the Van der Pol oscillator $\\dot y_1 = y_2$, $\\dot y_2 = \\mu(1 - y_1^2)y_2 - y_1$ with $\\mu = 1000$ and watch RK45 grind to a halt while BDF or LSODA sails. Finally, plot the adaptive step size $h(t)$ that <code>solve_ivp</code> chose by looking at <code>np.diff(sol.t)</code> &mdash; you will see it contract around stiff fronts and expand on smooth stretches, exactly as predicted by section 9.</div></div>

<div class="calc-highlight"><strong>What you can do now.</strong> Implement forward Euler, Heun's RK2, and classical RK4 from scratch from the formulas alone; predict and verify their convergence rates by reading the slope of a log-log error plot; recognise a stiff problem from its eigenvalues and reach for an implicit method when needed; call <code>scipy.integrate.solve_ivp</code> with confidence, knowing exactly what the <code>method</code> argument does and why <code>rtol</code>/<code>atol</code> matter. The next lesson takes the same numerical perspective into the world of <em>stochastic</em> differential equations &mdash; the bridge to diffusion generative models and score matching.</div>
`,

/* ============================================================
   TURKISH
   ============================================================ */
tr: `
<p class="l-text">Bu izleğin ilk dört dersinde diferansiyel denklemleri <em>analitik</em> olarak çözmeyi öğrendik: ayrılabilir denklemler, doğrusal ODE'ler, ikinci dereceden sabit katsayılı sistemler, doğrusal sistemler için özdeğer problemleri, kanonik PDE'ler. Yöntemler zarif, ama hep aynı sert sınırı paylaşıyorlar. Küçük bir ders kitabı örnekleri zoosunun dışında, pratikte karşılaştığın neredeyse hiçbir ODE'nin kapalı biçimli çözümü yok. Yuvarlanan bir katı cismi anlatan diferansiyel denklem, bir kimyasal reaksiyon ağı, Hill tipi bir girişe sahip sızdıran bir tank, derin bir modelin içindeki bir sinirsel ODE &mdash; hiçbiri temel fonksiyonlarda integrasyona razı olmaz. Çoğu gerçek ODE probleminin dürüst cevabı bir formül değildir. Ayrık zaman noktalarındaki çözümü yaklaşıkken belirten bir sayı dizisi $y_0, y_1, y_2, \\ldots$'dir.</p>

<p class="l-text">Bu ders, kullandığın her simülasyon kütüphanesini besleyen küçük <strong>sayısal ODE yöntemleri</strong> takımını sıfırdan kurar. <code>scipy.integrate.solve_ivp(f, (0, 10), y0)</code> çağrısı yaptığında, bu tek satırın içinde epey dikkatli sayısal analiz koşar. Dersin sonunda üç iş atını &mdash; ileri Euler, RK2, RK4 &mdash; elden yazmış, yakınsama oranlarını teoriye karşı kontrol etmiş, açık şemalarda katı problemlerin patladığını izlemiş ve SciPy ile MATLAB'taki varsayılan çözücünün neden uyarlanır Dormand-Prince RK45 olduğunu görmüş olacaksın. Kapanış bölümü AI'a döner: aynı RK ailesi Neural ODE eğitiminin içindeki motordur, orada çözücü seçimi modelin bir hiperparametresine dönüşür.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İleri Euler'i bir teğet çizgisi boyunca adım atmanın geometrik resminden uygulamak</li>
<li>Yerel kesme hatasını küresel hatadan ayırt etmek ve bir yöntemin mertebesini log-log grafikten okumak</li>
<li>Katı bir problemi tanımak ve neden açık Euler'in onda başarısız olup örtük Euler'in olmadığını açıklamak</li>
<li>Heun yöntemini (RK2) bir tahmin-düzeltme şeması ve klasik RK4'ü dört eğimin ağırlıklı ortalaması olarak türetmek</li>
<li>Bir Butcher tablosunu okumak ve yukarıdaki formüllere bağlamak</li>
<li><code>scipy.integrate.solve_ivp</code>'yi doğru yöntemle (katı olmayan için RK45, katı için BDF/Radau) kullanmak ve toleranslarını yorumlamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Neden Sayısal?</h2>

<p class="l-text">Bu izlekteki neredeyse her diferansiyel denklem, kesin bir cevap var olacak şekilde seçildi. Bu pedagojik olarak gerekli &mdash; karşılaştırmak için kapalı biçimli bir çözüm olmadan yönteminin çalıştığını kontrol edemezsin &mdash; ama alana yanıltıcı bir resim veriyor. Fizik, mühendislik, biyoloji ve makine öğreniminde ortaya çıkan ODE problemlerinin büyük çoğunluğu doğrusal değil, çok boyutlu veya ikisi birden, ve neredeyse hiçbiri temel fonksiyonlarda bir çözümü kabul etmez.</p>

<div class="calc-formula"><div class="formula-label">GENEL BAŞLANGIÇ DEĞER PROBLEMİ</div><div class="formula-main">$$\\frac{dy}{dt} \\;=\\; f(t, y), \\qquad y(t_0) \\;=\\; y_0, \\qquad t \\in [t_0, T]$$</div><div class="formula-sub">$y$ bir skaler ya da $\\mathbb{R}^d$'de bir vektör olabilir. $f$ fonksiyonu doğrusal olmayabilir, zamana bağlı, hatta süreksiz olabilir. $t_0$'dan $T$'ye denklemi ve başlangıç koşulunu sağlayan $y(t)$ yörüngesini arıyoruz.</div></div>

<p class="l-text">Bir <strong>sayısal yöntem</strong> bu sürekli problemi $t_0 < t_1 < \\cdots < t_N = T$ bir ızgarası üzerindeki sonlu bir ayrık yaklaşımlar dizisi $y_n \\approx y(t_n)$ ile değiştirir. Sayısal bir analistin sorduğu iki soru şunlardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğruluk</div><div class="card-body">Adım boyu $h = t_{n+1} - t_n$ küçüldükçe hata $\\lvert y_n - y(t_n) \\rvert$ ne kadar hızlı küçülür? Birinci mertebeden bir yöntem $h$ yarıya inince hatasını yarıya indirir; dördüncü mertebeden bir yöntem hatayı on altıya böler.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Her adım bir veya daha fazla $f$ değerlendirmesi gerektirir. Derin bir sinirsel ODE için o tek değerlendirme bir ağdan tam bir ileri geçiştir &mdash; potansiyel olarak eğitimin baskın maliyeti. Daha az, daha akıllı adımlar çok sayıda saf adımı yener.</div></div>
<div class="calc-card"><div class="card-title">Kararlılık</div><div class="card-body">Bazı problemler, ne kadar doğruluk istesen de, sadece patlamayı önlemek için adım boyunun absürt küçük olmasına zorlar. Bunlar bölüm 5'in <strong>katı</strong> problemleridir; çare örtük yöntemlerdir.</div></div>
<div class="calc-card"><div class="card-title">Güvenilirlik</div><div class="card-body">İyi bir çözücü kendi hata tahmininin kullanıcı toleransını aştığını saptar, adımı otomatik olarak küçültür ve sessiz çöp döndürmek yerine seni uyarır. <code>solve_ivp</code>'nin var olma nedeni budur.</div></div>
</div>

<div class="l-note"><strong>Temel ödünleşim.</strong> Daha küçük $h$ daha küçük adım başına hata ve daha çok adım, dolayısıyla daha çok maliyet demektir. Daha yüksek mertebeden yöntemler her $f$ değerlendirmesinden daha çok doğruluk elde eder, adım başına daha fazla aritmetik karşılığında. Tatlı nokta $f$'nin ne kadar düzgün olduğuna ve doğruluk gereksiniminin ne kadar sıkı olduğuna bağlıdır. Aşağıdaki ders planı yöntemleri artan karmaşıklık sırasında tanıtır, böylece her katmanın sana ne aldığını tam olarak hissedebilirsin.</div>

<h2 class="lesson-title">2. İleri Euler Yöntemi</h2>

<p class="l-text">Olası en basit ayrıklaştırma doğrudan türevin tanımından gelir. $t_n$'deki $dy/dt$'yi ileri fark $(y_{n+1} - y_n)/h$ ile değiştir, $f(t_n, y_n)$'e eşitle, $y_{n+1}$ için çöz:</p>

<div class="calc-formula"><div class="formula-label">İLERİ (AÇIK) EULER</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n + h\\, f(t_n, y_n)$$</div><div class="formula-sub">$y_n$ değerini ve oradaki eğim $f(t_n, y_n)$'yi verince, o teğet çizgisi boyunca $h$ kadar ileri adımla. Sonra tekrarla. Yörüngenin tamamı her seferinde küçük bir teğetle inşa edilir.</div></div>

<p class="l-text">Geometrik resim yöntemin tamamıdır. Her ızgara noktasında bilinmeyen çözüme teğeti çizersin &mdash; bunu yapabilirsin çünkü diferansiyel denklem eğim $f(t_n, y_n)$'yi sana bedavaya verir &mdash; sonra $h$ uzunluğunda bir adım için o teğet boyunca yürürsün. Şimdi gerçek yörüngeden hafifçe sapmış durumdasın; o hata daha sonraki tüm sorunların kaynağıdır. Sonra diferansiyel denkleme yeni konumundaki yeni eğimi sorar ve yeni teğet boyunca adım atarsın. Ortaya çıkan çokgensel yol Euler yaklaşımıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Açık</div><div class="card-body">$y_{n+1}$ zaten bildiğin şeylerden doğrudan bir formülle verilir. Çözülecek cebirsel denklem yok. Adım başına bir $f$ değerlendirmesi. Ucuz.</div></div>
<div class="calc-card"><div class="card-title">Birinci mertebe</div><div class="card-body">Sabit bir aralık üzerinden integre ettikten sonra küresel hata $O(h)$ gibi ölçeklenir. $h$'yi yarıya indirmek hatayı yarıya indirir. Doğruluğu iki katına çıkarmak işi iki katına çıkarır &mdash; dürüst, ama yavaş.</div></div>
<div class="calc-card"><div class="card-title">Yerel ve küresel hata</div><div class="card-body">Her adım $O(h^2)$ yerel kesme hatasına katkıda bulunur, attığın Taylor kalanı. $N = (T - t_0)/h$ adım üzerinden bunlar $O(h)$ küresel hatasında birikir. Defter tutmada her zaman bir mertebe kaybedilir.</div></div>
<div class="calc-card"><div class="card-title">Koşullu kararlı</div><div class="card-body">Bazı denklemler için &mdash; katı olanlar &mdash; açık adım sadece yuvarlama hatasının yükseltilmesinden kaçınmak için minicik olmalıdır. Bu ileri Euler'in başlık zayıflığıdır.</div></div>
</div>

<div id="plot-l5-euler-steps-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];for(var i=0;i<=200;i++){var t=i*5/200;xs.push(t);ys.push(Math.exp(-t));}
var exact={x:xs,y:ys,mode:'lines',name:'tam y = e^(-t)',line:{color:'#10b981',width:2.5}};
function eul(h){var T=[];var Y=[];var t=0;var y=1;T.push(t);Y.push(y);while(t<5-1e-9){y=y+h*(-y);t+=h;T.push(t);Y.push(y);}return {x:T,y:Y};}
var e1=eul(0.5);var e2=eul(0.2);var e3=eul(0.05);
var d1={x:e1.x,y:e1.y,mode:'lines+markers',name:'Euler h=0.50',line:{color:'#ef4444',width:2,dash:'dash'},marker:{size:6}};
var d2={x:e2.x,y:e2.y,mode:'lines+markers',name:'Euler h=0.20',line:{color:'#f59e0b',width:2,dash:'dot'},marker:{size:5}};
var d3={x:e3.x,y:e3.y,mode:'lines+markers',name:'Euler h=0.05',line:{color:'#3b82f6',width:2},marker:{size:3}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l5-euler-steps-tr',[exact,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $\\dot y = -y$, $y(0) = 1$ başlangıç değer problemi tam çözüm $y(t) = e^{-t}$ (yeşil) ile birlikte üç adım boyunda ileri Euler yaklaşımlarına karşı çizilmiş. $h = 0.5$'te çokgensel Euler yolu gözle görülür şekilde aşağı doğru kayar ve eğrinin belirgince altında koşar. $h = 0.2$'de hata daha küçük ama hâlâ okunaklı; $h = 0.05$'te işaretçiler neredeyse tam eğrinin üzerinde oturur. $h$'nin her yarılaması açıklığı kabaca yarıya indirir &mdash; birinci mertebeden bir yöntemin imzası.</div></div>

<h2 class="lesson-title">3. Çalışılmış Örnek: $\\dot y = -y$ Üzerinde İleri Euler</h2>

<p class="l-text">En temiz model problemlerinden birinin defter tutmasını elden yapalım. $\\dot y = -y$, $y(0) = 1$ olsun. Tam çözüm $y(t) = e^{-t}$. Üç adım boyuyla $t = 5$'e kadar integre eder ve hatanın nasıl davrandığını görürüz.</p>

<div class="calc-formula"><div class="formula-label">BU PROBLEM İÇİN EULER GÜNCELLEMESİ</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n + h \\cdot (-y_n) \\;=\\; (1 - h)\\, y_n$$</div><div class="formula-sub">Her adım mevcut değeri bir sabit $(1 - h)$ ile çarpar. $n$ adımdan sonra $y_n = (1 - h)^n$, ve $hn = t$ sabitken $h \\to 0$ iken $(1 - h)^n \\to e^{-h n}$. Yani Euler tam çözüme yakınsar, yavaşça.</div></div>

<p class="l-text">Aşağıdaki tablo uç noktası $t = 5$'teki değeri ve üç adım boyu için tam $y(5) = e^{-5} \\approx 0.006738$'e karşı hatayı gösterir. $h$ yarılandığında hatanın da kabaca yarılandığına dikkat et &mdash; bir $O(h)$ yönteminin ders kitabı parmak izi.</p>

<div class="calc-formula"><div class="formula-label">YAKINSAMA TABLOSU</div><div class="formula-main">$$\\begin{array}{c|c|c|c} h & y_N & \\lvert y_N - y(5) \\rvert & \\text{oran} \\\\\\hline 0.20 & 0.00370 & 3.04 \\times 10^{-3} & --- \\\\ 0.10 & 0.00515 & 1.58 \\times 10^{-3} & 0.52 \\\\ 0.05 & 0.00593 & 8.06 \\times 10^{-4} & 0.51 \\\\ 0.025 & 0.00633 & 4.06 \\times 10^{-4} & 0.50 \\end{array}$$</div><div class="formula-sub">Her hata sütunu girdisi $h$ yarılandığında öncekinin kabaca $1/2$'sidir: mertebe $1$. Ayrıca Euler'in burada tutarlı şekilde altta kaldığına dikkat et: $(1 - h)^n < e^{-h n}$ çünkü $\\log(1 - h) < -h$.</div></div>

<div class="calc-example"><div class="example-label">CEBİRDEN HATA TAHMİNİNE</div><div class="example-body"><strong>Tek-adım hatası.</strong> $t_n + h$'deki tam değer $y(t_n + h) = y(t_n)\\, e^{-h} = y(t_n)(1 - h + h^2/2 - \\cdots)$. Euler değeri $y(t_n)(1 - h)$. Yerel kesme hatası $y(t_n + h) - y(t_n)(1 - h) = y(t_n)\\, h^2/2 + O(h^3)$ &mdash; $h$'de ikinci mertebeden.<br><br><strong>Biriktirme.</strong> $N = T/h$ adım üzerinde bu $h^2$ hatalar yaklaşık $T \\cdot y_{\\max} \\cdot h / 2$'ye, mertebe $h$ küresel hatasına eklenir. "Kaybedilen mertebe" toplamadan gelir.</div></div>

<div id="plot-l5-convergence-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var hs=[];for(var k=0;k<8;k++){hs.push(0.5/Math.pow(2,k));}
function euler(h){var t=0;var y=1;while(t<1-1e-12){y=y+h*(-y);t+=h;}return y;}
function rk2(h){var t=0;var y=1;while(t<1-1e-12){var k1=-y;var k2=-(y+h*k1);y=y+h*0.5*(k1+k2);t+=h;}return y;}
function rk4(h){var t=0;var y=1;while(t<1-1e-12){var k1=-y;var k2=-(y+h*k1/2);var k3=-(y+h*k2/2);var k4=-(y+h*k3);y=y+h*(k1+2*k2+2*k3+k4)/6;t+=h;}return y;}
var exact=Math.exp(-1);
var eErr=[];var r2Err=[];var r4Err=[];
for(var i=0;i<hs.length;i++){eErr.push(Math.abs(euler(hs[i])-exact));r2Err.push(Math.abs(rk2(hs[i])-exact));r4Err.push(Math.max(Math.abs(rk4(hs[i])-exact),1e-15));}
var dE={x:hs,y:eErr,mode:'lines+markers',name:'Euler (mertebe 1)',line:{color:'#ef4444',width:2.5},marker:{size:8}};
var dR2={x:hs,y:r2Err,mode:'lines+markers',name:'RK2 / Heun (mertebe 2)',line:{color:'#f59e0b',width:2.5},marker:{size:8}};
var dR4={x:hs,y:r4Err,mode:'lines+markers',name:'RK4 (mertebe 4)',line:{color:'#3b82f6',width:2.5},marker:{size:8}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'adım boyu h (log)',type:'log',gridcolor:'#1f2937'},yaxis:{title:'t=1 küresel hata (log)',type:'log',gridcolor:'#1f2937'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:70}};
Plotly.newPlot('plot-l5-convergence-tr',[dE,dR2,dR4],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> klasik yakınsama grafiği. Log-log eksenlerde bir $p$-mertebeden yöntemin küresel hatası eğimi $p$ olan bir doğruya düşer. Euler (kırmızı) eğim $1$, Heun RK2 (turuncu) eğim $2$, RK4 (mavi) eğim $4$. Çizgiler arasındaki herhangi sabit $h$'deki dikey mesafeler her ek mertebenin sana sağladığı doğruluk kazancıdır. $h = 0.1$'de RK4, $h = 10^{-4}$'te Euler'den daha doğrudur, $1000\\times$ daha az adımla.</div></div>

<h2 class="lesson-title">4. Geri (Örtük) Euler</h2>

<p class="l-text">Euler tarifindeki bir detayı tersine çevir ve tamamen farklı kararlılık özelliklerine sahip bir yöntem elde edersin. Eski nokta yerine yeni noktadaki eğimi değerlendir:</p>

<div class="calc-formula"><div class="formula-label">GERİ (ÖRTÜK) EULER</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n + h\\, f(t_{n+1},\\, y_{n+1})$$</div><div class="formula-sub">$y_{n+1}$ iki tarafta da görünür. Genelde bu, her adımda çözülmesi gereken bir cebirsel (muhtemelen doğrusal olmayan) denklemdir &mdash; tipik olarak Newton yöntemiyle. Bu maliyet. Ödül büyük bir problem sınıfı için koşulsuz kararlılıktır.</div></div>

<p class="l-text">Bu bedeli neden ödersin? $\\lambda > 0$ ile $\\dot y = -\\lambda y$'ye geri Euler uygula:</p>

<div class="calc-formula"><div class="formula-label">$\\dot y = -\\lambda y$ ÜZERİNDE GERİ EULER</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n - h \\lambda\\, y_{n+1} \\;\\Rightarrow\\; y_{n+1} \\;=\\; \\frac{y_n}{1 + h \\lambda}$$</div><div class="formula-sub">Herhangi $h > 0$ ve herhangi $\\lambda > 0$ için $1/(1 + h\\lambda)$ çarpanı kesinlikle mutlak değerde $1$'den küçüktür. Sayısal çözüm tıpkı gerçek olanı gibi monoton olarak söner. Adım boyu kısıtı yok.</div></div>

<p class="l-text">Açık Euler ile karşılaştır, $y_{n+1} = (1 - h\\lambda)\\, y_n$ verir. Eğer $h\\lambda > 2$ ise, $|1 - h\\lambda| > 1$ çarpanı ve sayısal çözüm sönmek yerine her adımda yükselir. Yuvarlama sinyale dönüşür, cevap patlar. Açık Euler'in kararlılık bölgesi $|1 - h\\lambda| \\leq 1$ diskidir; örtük Euler'in kararlılık bölgesi sol yarı düzlemin tamamıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım başına maliyet</div><div class="card-body">Örtük Euler her adımda doğrusal olmayan bir çözüm gerektirir (genellikle bir Newton yinelemesi yeterlidir). $d$-boyutlu bir sistem için bu en kötü durumda bir $O(d^3)$ ayrıştırma demektir &mdash; açık Euler'in $O(d)$'sinden önemli ölçüde daha ağır.</div></div>
<div class="calc-card"><div class="card-title">Adım boyu özgürlüğü</div><div class="card-body">$h$'de kararlılık sınırı yok. Katı bir problem için bu $1000\\times$ daha büyük $h$ anlamına gelebilir, bu da adım başına ek maliyeti fazlasıyla karşılar. Katı çözücüler genellikle açık yöntem için $\\max|\\lambda| h$ $\\sim 2$'yi aşacak olduğunda kazanırlar.</div></div>
<div class="calc-card"><div class="card-title">L-kararlılık</div><div class="card-body">Örtük Euler büyük $h\\lambda$ için sadece sınırlı kalmakla kalmaz, aslında çok katı modları <em>söndürür</em> &mdash; $h\\lambda \\to \\infty$ iken çarpan $\\to 0$. Bu ekstra güce L-kararlılık denir ve örtük Euler ile soyundan gelenlerin katı çözücü kütüphanelerine hakim olmasının nedenidir.</div></div>
<div class="calc-card"><div class="card-title">Doğruluk değişmedi</div><div class="card-body">Geri Euler hâlâ birinci mertebedir. Kazanç kararlılık, doğruluk değil. Yüksek mertebeden örtük yöntemler için bölüm 10'daki BDF'ye bakın.</div></div>
</div>

<h2 class="lesson-title">5. Katılık &mdash; Bir Patoloji</h2>

<p class="l-text"><strong>Katılık</strong> sayısal ODE'lerdeki en çok tartışılan ve en az temiz tanımlanan fikirdir. Sezgi keskindir, formel tanım bulanık olsa bile: bir problem, son derece farklı zaman ölçeklerinde sönen (veya salınan) çözüm bileşenleri olduğunda katıdır. Hızlı bileşenler önemsediğin zaman çoktan oturmuştur, ama varlıkları yine de açık bir yöntemi onları çözecek kadar küçük adımlar atmaya zorlar.</p>

<div class="calc-formula"><div class="formula-label">KLASİK BİR KATI MODEL PROBLEMİ</div><div class="formula-main">$$\\dot y \\;=\\; -1000\\, y + 999\\, e^{-t}, \\qquad y(0) \\;=\\; 0$$</div><div class="formula-sub">Tam çözüm $y(t) = e^{-t} - e^{-1000 t}$ $t \\approx 0.01$'de ölen bir geçişe $e^{-1000 t}$ ve $t = 10$'a kadar takip etmek istediğimiz düzgün bir kuyruğa $-e^{-t}$ sahiptir. $1000$ faktörüyle ayrılmış iki zaman ölçeği.</div></div>

<p class="l-text">Hızlı geçiş gittikten sonra yörünge yavaş bir üsteldir ve dürüst bir doğruluk tahmini $h \\sim 0.1$'in fazlasıyla yeterli olduğunu söyler. Ama ileri Euler için kararlılık $\\lambda = 1000$ ile $h\\lambda \\leq 2$, yani $h \\leq 0.002$ gerektirir. Yani açık yöntem düzgün yörüngenin talep ettiğinden beş yüz kez daha küçük bir adım kullanmaya mahkumdur. $[0, 10]$ aralığı üzerinde bu $100$ yerine $5000$ Euler adımıdır. Örtük Euler'in böyle bir kısıtı yok.</p>

<div id="plot-l5-stiff-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];for(var i=0;i<=400;i++){var t=i*0.5/400;xs.push(t);ys.push(Math.exp(-t)-Math.exp(-1000*t));}
var exact={x:xs,y:ys,mode:'lines',name:'tam: e^(-t) - e^(-1000 t)',line:{color:'#10b981',width:2.5}};
function fExp(h){var T=[];var Y=[];var t=0;var y=0;T.push(t);Y.push(y);for(var k=0;k<Math.floor(0.5/h);k++){y=y+h*(-1000*y+999*Math.exp(-t));t+=h;T.push(t);Y.push(y);if(Math.abs(y)>1e10){break;}}return {x:T,y:Y};}
function fImp(h){var T=[];var Y=[];var t=0;var y=0;T.push(t);Y.push(y);for(var k=0;k<Math.floor(0.5/h);k++){var tn=t+h;y=(y+h*999*Math.exp(-tn))/(1+1000*h);t=tn;T.push(t);Y.push(y);}return {x:T,y:Y};}
var feS=fExp(0.0019);
var feU=fExp(0.0025);
var imp=fImp(0.05);
var d1={x:feS.x,y:feS.y,mode:'lines',name:'ileri Euler h=0.0019 (kararlı sınırda)',line:{color:'#3b82f6',width:1.5}};
var d2={x:feU.x,y:feU.y,mode:'lines',name:'ileri Euler h=0.0025 (patlar)',line:{color:'#ef4444',width:1.5,dash:'dash'}};
var d3={x:imp.x,y:imp.y,mode:'lines+markers',name:'geri Euler h=0.05',line:{color:'#f59e0b',width:2},marker:{size:5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y(t)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-2,2]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l5-stiff-tr',[exact,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> katı IVP. Tam çözüm (yeşil) $t = 0$ yakınındaki yıldırım hızlı geçişten sonra esasen $-e^{-t}$'dir. $h = 0.0019$ (mavi, $h\\lambda < 2$) ile ileri Euler onu takip eder. $h$'yi $0.0025$'e (kırmızı kesikli, $h\\lambda = 2.5$) çıkarın ve açık çözüm patlayan genlikle salınır &mdash; sayısal kararsızlık. $h = 0.05$ ile geri Euler (turuncu) dev adımlar atar ve doğruya yapışık kalır. Hızlı zaman ölçeği değil, yavaş olan önemsediğimiz şeydir ve örtük yöntem buna saygı duyan tek yöntemdir.</div></div>

<div class="l-note"><strong>Çıkarım.</strong> Katılık yöntemin değil problemin bir özelliğidir. Geniş aralıklı zaman ölçeklerin varsa ve yavaş olan üzerinde integre etmen gerekiyorsa, örtük bir yöntem kullan. Problemin katı değilse (çoğu mekanik, yörüngesel, sinirsel ODE problemi), açık yüksek mertebeden bir yöntem kullan &mdash; adım başına daha ucuz ve Jacobian hesaplamaları yok.</div>

<h2 class="lesson-title">6. Geliştirilmiş Euler / RK2 (Heun Yöntemi)</h2>

<p class="l-text">İleri Euler aralığın başındaki eğimi kullanır ve körü körüne ileri yürür. Bir ekstra mertebe doğruluğu kazandıran iyileştirme o yürüyüşü iki kez yapmaktır: önce ileri keşfetmek için, sonra başlangıç eğimini keşfedilen uç noktadaki eğimle ortalamak için.</p>

<div class="calc-formula"><div class="formula-label">HEUN YÖNTEMİ &mdash; TAHMİN-DÜZELTME BİÇİMİ</div><div class="formula-main">$$\\tilde y \\;=\\; y_n + h\\, f(t_n,\\, y_n) \\quad \\text{(Euler ile tahmin)}$$ $$y_{n+1} \\;=\\; y_n + \\tfrac{h}{2}\\bigl[\\, f(t_n, y_n) + f(t_n + h,\\, \\tilde y)\\,\\bigr] \\quad \\text{(ortalama eğimle düzelt)}$$</div><div class="formula-sub">Adım başına iki $f$ değerlendirmesi. Yerel kesme hatası $O(h^2)$'den $O(h^3)$'e, küresel hata $O(h)$'den $O(h^2)$'ye düşer. Adım başına maliyeti iki katına çıkarmak bir ekstra mertebe satın alır &mdash; Runge-Kutta yöntemlerinin merkezi ödünleşimi.</div></div>

<p class="l-text">Geometrik olarak: $(t_n, y_n)$'den başlayarak, yerel teğet boyunca $h$ kadar yürü ve keşif noktası $(t_n + h, \\tilde y)$'ye var. Oradaki eğim $f$'yi oku. Aralık üzerindeki gerçek ortalama eğim başlangıç eğimi ile son eğim arasında bir yerdedir ve düzgün problemlerde basit aritmetik ortalama ikinci mertebeye kadar doğrudur. O ortalama eğim boyunca $y_n$'den yürü ve düzeltilmiş adım $y_{n+1}$'i al. Bir ODE çözücüsünün içinden bize bakan integrasyonun trapez kuralı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım başına iki $f$-değerlendirmesi</div><div class="card-body">$k_1 = f(t_n, y_n)$ sonra $k_2 = f(t_n + h,\\, y_n + h k_1)$. Sonuç $y_{n+1} = y_n + \\tfrac{h}{2}(k_1 + k_2)$. İki değerlendirmede simetrik.</div></div>
<div class="calc-card"><div class="card-title">Küresel olarak mertebe 2</div><div class="card-body">$h$'yi yarıya indirmek küresel hatayı dörde böler. Bir doğruluk basamağı kazanmak için $h$'yi sadece biraz yarıya indirmen gerekir, Euler için olduğu gibi onla değil.</div></div>
<div class="calc-card"><div class="card-title">Aynı kararlılık tarzı</div><div class="card-body">RK2 hâlâ açıktır ve hâlâ koşullu kararlıdır; kararlılık bölgesi Euler'inkinden daha büyüktür ama yine de sınırlıdır. Katı problemler hâlâ örtük yöntemler ister.</div></div>
<div class="calc-card"><div class="card-title">Tüm bir aile</div><div class="card-body">Heun, aynı Butcher tablosu yapısını paylaşan üç eşdeğer ikinci mertebeden RK'dan biridir. Orta nokta yöntemi ve Ralston yöntemi diğer iki kardeştir.</div></div>
</div>

<h2 class="lesson-title">7. Runge-Kutta 4 (RK4) &mdash; İş Atı</h2>

<p class="l-text">Aynı hile &mdash; eğimi dikkatle seçilmiş keşif noktalarında değerlendir, dikkatle seçilmiş ağırlıklarla ortala &mdash; daha yüksek mertebelere itilebilir. O saldırı hattının en ünlü sonucu Wilhelm Kutta tarafından 1901'de yayımlanan klasik dördüncü mertebeden Runge-Kutta yöntemidir. Hâlâ gezegendeki her sayısal kütüphanedeki varsayılan açık yöntemdir ve bunun basit bir nedeni vardır: birim iş başına orta doğruluktaki katı olmayan problemler için onu yenmek vahşice zordur.</p>

<div class="calc-formula"><div class="formula-label">KLASİK RK4</div><div class="formula-main">$$\\begin{aligned} k_1 &\\;=\\; f(t_n,\\, y_n) \\\\ k_2 &\\;=\\; f\\!\\left(t_n + \\tfrac{h}{2},\\; y_n + \\tfrac{h}{2}\\, k_1\\right) \\\\ k_3 &\\;=\\; f\\!\\left(t_n + \\tfrac{h}{2},\\; y_n + \\tfrac{h}{2}\\, k_2\\right) \\\\ k_4 &\\;=\\; f\\!\\left(t_n + h,\\; y_n + h\\, k_3\\right) \\\\ y_{n+1} &\\;=\\; y_n + \\tfrac{h}{6}\\bigl(k_1 + 2 k_2 + 2 k_3 + k_4\\bigr) \\end{aligned}$$</div><div class="formula-sub">Dört eğim değerlendirmesi: biri başta, ikisi orta noktada (her biri orta noktadaki değer için bir tahmin olarak öncekini kullanır), biri uç noktada. $1 : 2 : 2 : 1$ ortalama ağırlıkları eğime uygulanan Simpson kuralıdır.</div></div>

<p class="l-text">Her $k_i$ bir eğimdir. $k_1$ sol uç noktadaki eğimdir; $k_2$ $k_1$'i orta nokta değerini tahmin etmek için kullanarak orta noktadaki eğimdir; $k_3$ orta nokta tahmini için $k_2$'nin kendisini kullanarak $k_2$'yi iyileştirir; $k_4$ orada değeri tahmin etmek için $k_3$'ü kullanarak sağ uç noktadaki eğimdir. Sonra onları $1, 2, 2, 1$ ağırlıklarıyla (kuadratik-uydurulmuş bir eğimin $\\int_0^h$'si için Simpson kuralı ağırlıkları) ortala ve $h$ ile çarp. Defter tutma Euler'den daha yoğundur ama geometri aynı şekildedir: dört eğim sorgusu, bir ağırlıklı adım.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım başına dört $f$-değerlendirmesi</div><div class="card-body">RK4 bir Euler adımının $4\\times$'i kadar maliyete sahiptir. Ama küresel hatası Euler'in $O(h)$'sine karşı $O(h^4)$'tür, bu yüzden belirli bir doğruluğa ulaşmak için genel olarak çok daha az adım gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Küresel hata $O(h^4)$</div><div class="card-body">$h$'yi yarıya indirmek hatayı on altıya küçültür. Tipik mühendislik toleransları $10^{-6}$ için RK4 kabaca $\\sqrt[4]{10^6} \\approx 32$ adıma ihtiyaç duyar, Euler'in milyon adıma ihtiyaç duyacağı yerde.</div></div>
<div class="calc-card"><div class="card-title">Kendi kendine başlayan</div><div class="card-body">RK4 $y_{n+1}$'i hesaplamak için sadece $y_n$'ye ihtiyaç duyar. Çok adımlı yöntemlerin (Adams-Bashforth, BDF) aksine başlamak veya bir olaydan sonra yeniden başlamak için özel bir prosedüre ihtiyaç duymaz.</div></div>
<div class="calc-card"><div class="card-title">Aynı kararlılık şekli</div><div class="card-body">RK4'ün karmaşık $h\\lambda$ düzlemindeki kararlılık bölgesi gerçek eksen boyunca yaklaşık $\\lvert h \\lambda \\rvert \\lesssim 2.78$ olan bir fasulyedir. Euler'in $|h\\lambda| \\leq 2$'sinden daha büyük ama yine de sınırlı. Katı problemler hâlâ örtük kuzenlere ihtiyaç duyar.</div></div>
</div>

<div id="plot-l5-rk4-slopes-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];for(var i=0;i<=120;i++){var t=i*1.2/120;xs.push(t);ys.push(Math.sin(t));}
var curve={x:xs,y:ys,mode:'lines',name:'gerçek y(t)',line:{color:'#10b981',width:2.5}};
var t0=0.2;var h=0.8;var y0=Math.sin(t0);
var k1=Math.cos(t0);
var k2=Math.cos(t0+h/2);
var k3=k2;
var k4=Math.cos(t0+h);
function seg(t,y,k,c,name){var xs=[t-0.12,t+0.12];return {x:xs,y:[y-0.12*k,y+0.12*k],mode:'lines',name:name,line:{color:c,width:3}};}
var p1=seg(t0,y0,k1,'#ef4444','k1 sol eğim');
var p2=seg(t0+h/2,y0+h/2*k1,k2,'#f59e0b','k2 orta eğim (k1 ile)');
var p3=seg(t0+h/2,y0+h/2*k2,k3,'#3b82f6','k3 orta eğim (k2 ile)');
var p4=seg(t0+h,y0+h*k3,k4,'#a855f7','k4 sağ eğim (k3 ile)');
var anchor={x:[t0,t0+h],y:[y0,y0+h*(k1+2*k2+2*k3+k4)/6],mode:'markers+lines',name:'RK4 ortalama adım',line:{color:'#06b6d4',width:2,dash:'dash'},marker:{size:10,color:'#06b6d4'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l5-rk4-slopes-tr',[curve,p1,p2,p3,p4,anchor],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> bilinen bir fonksiyon üzerinde alınan tek bir RK4 adımı. Dört küçük renkli segment sol uç nokta, iki orta nokta tahmini ve sağ uç noktadaki dört eğim değerlendirmesi $k_1, k_2, k_3, k_4$'tür. Her eğim, belirtilen konumda fonksiyondan (veya gerçek bir ODE için $f$'den) okunur. Kesikli camgöbeği çizgi adımın başlangıcını ve sonunu ağırlıklı ortalama eğim $(k_1 + 2 k_2 + 2 k_3 + k_4)/6$ kullanarak birleştirir. Dört eğim sorgusuyla, herhangi bir tek teğet adımın muhtemelen olabileceğinden çok daha gerçek eğriye yakın iniyoruz.</div></div>

<h2 class="lesson-title">8. Butcher Tablosu ve Genel RK Yöntemleri</h2>

<p class="l-text">Tüm açık Runge-Kutta yöntemleri tek tip bir iskeleti paylaşır: $[0, 1]$ içinde $s$ aşama zamanı $c_1, \\ldots, c_s$ seç, önceki eğimleri bir karıştırma katsayıları matrisi $a_{ij}$ aracılığıyla yinelemeli olarak yeniden kullanarak $s$ eğim oluştur, sonra $b_i$ ağırlıklarıyla birleştir. Tüm tarif <strong>Butcher tablosu</strong> adlı kompakt bir tabloya sığar.</p>

<div class="calc-formula"><div class="formula-label">GENEL AÇIK RUNGE-KUTTA</div><div class="formula-main">$$k_i \\;=\\; f\\!\\left(t_n + c_i\\, h,\\; y_n + h \\sum_{j=1}^{i-1} a_{ij}\\, k_j\\right), \\qquad y_{n+1} \\;=\\; y_n + h \\sum_{i=1}^{s} b_i\\, k_i$$</div><div class="formula-sub">$a_{ij}$ matrisinin üçgensel şekli yöntemi <em>açık</em> yapan şeydir: $k_i$ yalnızca $j < i$ olan $k_j$'ye bağlıdır. Örtük RK matrisi doldurur ve doğrusal olmayan bir çözüm bedeli öder.</div></div>

<p class="l-text">Üç küçük tablo defter tutmayı gösterir. Üst sol blok $c_i$'yi sol sütunda ve $a_{ij}$'yi içeride listeler; alt satır $b_i$ ağırlıklarını listeler.</p>

<div class="calc-formula"><div class="formula-label">İLERİ EULER</div><div class="formula-main">$$\\begin{array}{c|c} 0 & \\\\ \\hline & 1 \\end{array}$$</div><div class="formula-sub">Bir aşama, karıştırma yok. $b_1 = 1$. Olası minimum RK yöntemi.</div></div>

<div class="calc-formula"><div class="formula-label">ORTA NOKTA YÖNTEMİ (RK2)</div><div class="formula-main">$$\\begin{array}{c|cc} 0 & & \\\\ \\tfrac{1}{2} & \\tfrac{1}{2} & \\\\ \\hline & 0 & 1 \\end{array}$$</div><div class="formula-sub">İki aşama. $k_2$ orta noktada $k_1$'i tahminci olarak kullanarak değerlendirildi. $(0, 1)$ ağırlıkları $k_1$'i atıp tek başına $k_2$ ile adımlar &mdash; o tek aralık-içi eğim zaten ikinci mertebeden doğrudur.</div></div>

<div class="calc-formula"><div class="formula-label">KLASİK RK4</div><div class="formula-main">$$\\begin{array}{c|cccc} 0 & & & & \\\\ \\tfrac{1}{2} & \\tfrac{1}{2} & & & \\\\ \\tfrac{1}{2} & 0 & \\tfrac{1}{2} & & \\\\ 1 & 0 & 0 & 1 & \\\\ \\hline & \\tfrac{1}{6} & \\tfrac{2}{6} & \\tfrac{2}{6} & \\tfrac{1}{6} \\end{array}$$</div><div class="formula-sub">Dört aşama. Alt satır ağırlıkları Simpson'a benzer: $6$ üzerinden $1, 2, 2, 1$. $a$ matrisindeki örüntü her yeni aşamanın tahmincisini oluşturmak için sadece bir öncekini nasıl kullandığını kodlar.</div></div>

<div class="l-note"><strong>Tablo ne içindir.</strong> Tabloyu bildiğin anda yöntemi bilirsin. Mertebe koşulları $a_{ij}, b_i, c_i$ üzerinde herhangi bir bilgisayar cebir sisteminin çözebileceği cebirsel denklemler haline gelir. Modern uyarlanır çözücüler düzinelerce Butcher tablosu saklar &mdash; klasik RK4, Heun, Bogacki-Shampine, Dormand-Prince, Cash-Karp, Verner &mdash; ve problemin düzgünlüğüne ve doğruluk talebine göre aralarında geçiş yapar.</div>

<h2 class="lesson-title">9. Uyarlanır Adım Boyu &mdash; RK45 (Dormand-Prince)</h2>

<p class="l-text">Şimdiye kadar tüm yöntemler sabit adım boyu alır. Gerçek çözücüler almaz. Gerçek bir çözücü aynı $k_i$ kümesini <em>iki kez</em> değerlendirir, bir kez mertebe-4 sonucu veren $b_i$ ağırlıklarıyla ve bir kez mertebe-5 sonucu veren $b_i^*$ ağırlıklarıyla. İki sonucun farkı yerel hatanın bedava bir tahminidir. Eğer o tahmin kullanıcı toleransının altındaysa, adımı kabul et ve gelecek sefer muhtemelen daha büyük birini dene. Eğer üstündeyse, adımı reddet ve daha küçük bir $h$ ile tekrar dene.</p>

<div class="calc-formula"><div class="formula-label">GÖMÜLÜ ÇİFT &mdash; DORMAND-PRINCE 4(5)</div><div class="formula-main">$$y_{n+1} \\;=\\; y_n + h \\sum_{i=1}^{7} b_i\\, k_i, \\qquad y_{n+1}^* \\;=\\; y_n + h \\sum_{i=1}^{7} b_i^*\\, k_i, \\qquad \\text{hata} \\;=\\; \\lvert y_{n+1} - y_{n+1}^* \\rvert$$</div><div class="formula-sub">Her iki mertebe için de aynı yedi $k_i$ kullanılır, dolayısıyla hata tahmini esasen bedavadır. Dormand ve Prince'in 1980 makalesi katsayıları öyle seçti ki mertebe-5 sonucunun olası en küçük kesme hatasına sahip olsun ve yedinci aşama bir sonraki adımın ilk aşaması olarak yeniden kullanılabilsin &mdash; FSAL özelliği &mdash; etkili maliyeti kabul edilen adım başına altı $f$-değerlendirmesine indirir.</div></div>

<p class="l-text">Adım boyu denetleyicisi kavramsal olarak basittir: hedef tolerans $\\tau$ ve tahmin edilen hata $\\text{err}$ verildiğinde, bir sonraki adımı $h_\\text{yeni} = h \\cdot (\\tau / \\text{err})^{1/5}$ olarak ayarla (beşinci kök çünkü mertebe-5 bir yöntemin hatası $h^5$ gibi ölçeklenir). Gerçek uygulamalar vahşi salınımlardan kaçınmak için değişim oranını $[0.2, 5]$ gibi bir şeye sıkıştırır. Sonuç: çözüm hızlı bükülürken $h$ otomatik olarak küçülür ve çözüm düzgünken büyür, döngüde insan olmadan.</p>

<div id="plot-l5-adaptive-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var ts=[];var ys=[];var hs=[];
for(var i=0;i<=300;i++){var t=i*10/300;ts.push(t);ys.push(Math.exp(-0.2*t)*Math.sin(3*t)+0.5*Math.exp(-(t-5)*(t-5)*4));}
var tt=[];var hh=[];var t=0;var h=0.2;while(t<10){tt.push(t);
var curv=Math.abs(0.5*Math.exp(-(t-5)*(t-5)*4)*(1-8*(t-5)*(t-5)));
h=0.3/(1+8*curv);hh.push(h);t+=h;}
var d1={x:ts,y:ys,mode:'lines',name:'çözüm y(t)',line:{color:'#10b981',width:2.5},yaxis:'y1'};
var d2={x:tt,y:hh,mode:'lines+markers',name:'uyarlanır adım boyu h(t)',line:{color:'#3b82f6',width:2},marker:{size:5},yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'y (sol)',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis2:{title:'h (sağ)',overlaying:'y',side:'right',gridcolor:'rgba(0,0,0,0)'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:60,b:50,l:60}};
Plotly.newPlot('plot-l5-adaptive-tr',[d1,d2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> düzgün sönen-salınımlı bir kuyruk artı $t = 5$ yakınında keskin bir özellik içeren bir çözüm (yeşil, sol eksen). Mavi eğri (sağ eksen) bir uyarlanır denetleyici tarafından seçilen adım boyu $h$'dir. Çözümün yavaş kıvrandığı yerde $h$ büyüktür ve çözücü uzun ekonomik adımlar atar. Keskin özellik göründüğünde, $h$ onu çözmek için otomatik olarak büzülür, sonra düzgün tarafta tekrar genişler. Kullanıcı ayarlaması gerekmedi &mdash; hata tahmincisi tüm işi yaptı.</div></div>

<div class="l-note"><strong>Bu, <code>scipy.integrate.solve_ivp(method='RK45')</code>'in yaptığı şeydir.</strong> Varsayılan <code>rtol = 1e-3</code>, <code>atol = 1e-6</code> toleransları doğrudan yukarıdaki denetleyiciye geçirilir. <code>dense_output=True</code> geç ve çözücü ayrıca her kabul edilen adımda beşinci mertebeden bir interpolanı saklar, böylece integrasyondan sonra $y(t)$'yi herhangi bir $t$'de bedavaya sorgulayabilirsin.</div>

<h2 class="lesson-title">10. Katı Problemler için Örtük Yöntemler</h2>

<p class="l-text">Açık RK yöntemleri düzgün katı olmayan problemlerde yenilemezler. Katılık ortaya çıktığı anda kullanılamaz hale gelirler. Katı iş atları <strong>örtük Runge-Kutta</strong> (Radau IIA, SDIRK) ve çok adımlı <strong>geri farklılaştırma formülleri (BDF)</strong>'dir.</p>

<div class="calc-formula"><div class="formula-label">GERİ FARKLILAŞTIRMA FORMÜLÜ (BDF-$k$)</div><div class="formula-main">$$\\sum_{j=0}^{k} \\alpha_j\\, y_{n+1-j} \\;=\\; h\\, \\beta\\, f(t_{n+1},\\, y_{n+1})$$</div><div class="formula-sub">Son $k+1$ değerin doğrusal bir kombinasyonu yeni noktadaki eğim çarpı $h$'ye eşittir. BDF-1 örtük Euler'dir. BDF-2 ile BDF-5 arası daha yüksek mertebedendir ve katı problemler için yeterince A-kararlı kalır; BDF-6 A-kararlılığı kaybeder ve BDF-7 sonrası koşulsuz kararsızdır, Dahlquist'in ünlü bir sonucu.</div></div>

<p class="l-text">Her örtük adım yeni değer için (tipik olarak doğrusal olmayan) cebirsel sistem $G(y_{n+1}) = 0$'ı çözmeyi gerektirir. Standart araç sırayla Jacobian $\\partial f / \\partial y$'ye ihtiyaç duyan Newton yöntemidir. Modern katı çözücüler Jacobian'ı ya sembolik olarak (nadiren), sonlu farklarla (<code>solve_ivp</code>'de varsayılan) ya da bir Jax/PyTorch fonksiyonunu sararken otomatik farklılaşma yoluyla hesaplar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ne zaman geçilir</div><div class="card-body">Eğer RK45 ile <code>solve_ivp</code> hiçbir iyi neden olmadan zamanın çoğunu küçük adım boylarında geçiriyorsa veya "stiff" uyarıları döndürüyorsa, <code>method='BDF'</code> veya <code>method='Radau'</code>'ya geç. 10-100x hızlanma yaygındır.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Her adım bir $n \\times n$ Jacobian benzeri matrisin bir ayrıştırmasına mal olur, en kötü durumda $O(n^3)$. Seyrek Jacobianlar (kimya, PDE ayrıklaştırmaları) iyi doğrusal cebirle bunu $O(n)$ veya öyle bir şeye düşürür.</div></div>
<div class="calc-card"><div class="card-title">Mertebe</div><div class="card-body">$k \\leq 5$ için BDF-$k$ mertebe $k$'dır. Değişken mertebeden BDF (içeride <code>scipy.integrate.LSODA</code>) düşük başlar ve çözüm düzgünleştikçe yükselir, mertebe yönünde uyarlanır adım boyunun benzeri.</div></div>
<div class="calc-card"><div class="card-title">Tanı</div><div class="card-body">Tipik bir noktada $J = \\partial f / \\partial y$'nin özdeğerlerini hesapla. $T$ integrasyon ufkun olmak üzere $\\max |\\text{Re}(\\lambda_i)|$ $1/T$'den çok büyükse, neredeyse kesin olarak katı bir problemin var.</div></div>
</div>

<h2 class="lesson-title">11. AI Uygulaması: Neural ODE Eğitimi (Kısa)</h2>

<p class="l-text">2018'de Chen, Rubanova, Bettencourt ve Duvenaud "<strong>Neural Ordinary Differential Equations</strong>" makalesini yayımladı, bu makale bir kalıntı bloğunu sürekli derinlikli bir modele dönüştürdü yeniden yorumlayarak</p>

<div class="calc-formula"><div class="formula-label">KALINTI AĞLARDAN NEURAL ODE'LERE</div><div class="formula-main">$$h_{t+1} \\;=\\; h_t + f_\\theta(h_t,\\, t) \\qquad \\Longrightarrow \\qquad \\frac{d h}{d t} \\;=\\; f_\\theta(h(t),\\, t)$$</div><div class="formula-sub">Bir kalıntı bloğu bilinmeyen bir ODE üzerinde ileri Euler'in bir adımıdır. Adım boyunu sıfıra göndermesine izin verirsen sağ tarafı bir sinir ağı olan bir ODE elde edersin. Ağın "derinliği" sürekli bir zaman değişkenine dönüşür ve ileri geçiş bir ODE çözücüsüne bir çağrı olur.</div></div>

<p class="l-text">Bir Neural ODE'nin ileri geçişi tam anlamıyla içinde uyarlanır bir RK45 veya Dormand-Prince bulunan <code>solve_ivp(f_theta, (0, T), h0)</code>'dır. Geri geçiş &mdash; zor kısım &mdash; kaybın $\\theta$'ya göre gradyanı için zamanda geriye doğru ikinci bir ODE çözen <strong>adjoint duyarlılık yöntemini</strong> kullanır. Bellek maliyeti $O(\\text{adım sayısı})$ yerine $O(1)$'dir çünkü hiçbir ara aktivasyon saklanmaz. Bedeli geri integrasyon sırasında $f_\\theta$'yı yeniden değerlendirmektir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çözücü = hiperparametre</div><div class="card-body">Çözücü seçimi (RK45 vs Dopri5 vs uyarlanır Heun) ve toleransları adjoint aracılığıyla gradyana girer. Daha gevşek toleranslar daha hızlı eğitir ama gradyanlara ekstra gürültü enjekte eder. Daha sıkı toleranslar daha yavaş ama daha kararlı eğitir.</div></div>
<div class="calc-card"><div class="card-title">Katı Neural ODE'ler</div><div class="card-body">Öğrenilen $f_\\theta$ eğitim sırasında katılaşırsa &mdash; hızlı dinamiklere uydurulurken yaygın &mdash; açık çözücüler boğulur. Örtük çözücüler (<code>torchdiffeq</code>'in <code>method='dopri5'</code>'i <code>'BDF'</code> ile <code>'scipy_solver'</code>'a geri düşer) orada elzemdir.</div></div>
<div class="calc-card"><div class="card-title">Difüzyon modelleri</div><div class="card-body">Skor tabanlı difüzyon örnekleme bir ters zamanlı SDE veya onun olasılık akışı ODE'sini çözer. Örnekleyici tam anlamıyla bir ODE çözücü çağrısıdır &mdash; DDIM ve DPM-Solver gürültü çizelgesi için ayarlanmış yüksek mertebeden RK şemalarıdır.</div></div>
<div class="calc-card"><div class="card-title">Sürekli normalizasyon akışları</div><div class="card-body">CNF'ler akış Jacobian'ının log-determinantını $h(t)$ ile birlikte $\\text{tr}(\\partial f_\\theta / \\partial h)$'i integre ederek hesaplar &mdash; aynı ODE'nin bir ekstra boyutu, aynı çözücü tarafından çözülür. Bu dersin sayısal analizi tüm hesaplama omurgasıdır.</div></div>
</div>

<div class="l-note"><strong>Neden klasik sayısal hesapta on bölüm geçirdiğimiz.</strong> Bir Neural ODE eğitim döngüsü içindeki çözücü görmezden gelebileceğin gizli bir kara kutu değildir. Modelin ifade gücünü, eğitim kararlılığını ve çıkarım maliyetini şekillendiren bir hiperparametredir. Euler ile RK4 ile BDF arasındaki farkı bilmek 2026'da sayısal analiz önemsiz bilgisi değil; üretici modellemenin çalışma sözcüğünün bir parçasıdır.</div>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Ne görmelisin.</strong> Euler hata oranı $2$ civarında oturur &mdash; $h$'yi yarıya indirmek küresel hatayı yarıya indirir, bir mertebe-$1$ yönteminin imzası. RK4 hata oranı $16 = 2^4$ yakınında oturur &mdash; $h$'yi yarıya indirmek hatayı on altıya küçültür, mertebe $4$'ün imzası. $h = 0.0125$'te Euler hatası yaklaşık $10^{-3}$ iken RK4 zaten makine kesinliğindedir; Euler ile daha iyisini yapmak milyonlarca adım demek olur. <code>solve_ivp</code> çağrısı yaklaşık bir düzine uyarlanır RK45 adımıyla tam cevaba iner; katı problem karşılaştırması RK45'in binlerce küçük adıma sürüklendiğini gösterir, BDF birkaç düzine adımla yürür.</p>

<div class="think-box"><div class="think-label">DENENECEK DENEYLER</div><div class="think-body">Sağ tarafı doğrusal olmayan $f(t, y) = -y^3$ (tam çözüm $y = 1/\\sqrt{1 + 2t}$) ile değiştir ve yakınsama mertebelerinin hâlâ $1$ ve $4$ çıktığını doğrula &mdash; Runge-Kutta $f$'nin doğrusal olmamasını umursamaz. Sonra $\\mu = 1000$ ile Van der Pol osilatörü $\\dot y_1 = y_2$, $\\dot y_2 = \\mu(1 - y_1^2)y_2 - y_1$'i dene ve BDF veya LSODA seyrederken RK45'in duraksamasını izle. Son olarak, <code>solve_ivp</code>'nin seçtiği uyarlanır adım boyu $h(t)$'yi <code>np.diff(sol.t)</code>'a bakarak çiz &mdash; tam olarak bölüm 9'da öngörüldüğü gibi, katı cephelerin etrafında büzüldüğünü ve düzgün gerilerde genişlediğini göreceksin.</div></div>

<div class="calc-highlight"><strong>Şimdi yapabileceklerin.</strong> Yalnızca formüllerden ileri Euler, Heun RK2 ve klasik RK4'ü sıfırdan uygulayabilir; log-log hata grafiğinin eğimini okuyarak yakınsama oranlarını öngörüp doğrulayabilir; özdeğerlerinden bir katı problemi tanıyabilir ve gerektiğinde örtük bir yönteme uzanabilir; <code>scipy.integrate.solve_ivp</code>'yi <code>method</code> argümanının ne yaptığını ve <code>rtol</code>/<code>atol</code>'un neden önemli olduğunu tam olarak bilerek güvenle çağırabilirsin. Sonraki ders aynı sayısal bakışı <em>stokastik</em> diferansiyel denklemler dünyasına taşır &mdash; difüzyon üretici modellerine ve skor eşleştirmeye köprü.</div>
`
};
