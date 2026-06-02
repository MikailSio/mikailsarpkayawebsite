window.CONTROL_L6 = {

/* ============================================================================
   ENGLISH VERSION
   ============================================================================ */
en: `
<p class="l-text"><strong>Eigenvalue analysis is a beautiful tool — but only when the system is linear.</strong> Once friction multiplies velocity, once a pendulum swings beyond the small-angle limit, once a robot arm encounters Coulomb stiction, the matrix $A$ disappears and the question of stability collapses back to: "will trajectories stay near the equilibrium, or run away from it?" In the nineteenth century the Russian mathematician Aleksandr Lyapunov gave a stunning answer that does not require solving the ODE at all. Build a scalar function $V(X)$ that behaves like an energy — positive away from equilibrium, decreasing along every trajectory — and stability follows automatically. No eigenvalues, no integration, no explicit solution.</p>

<p class="l-text">This lesson is the bridge from linear control theory to nonlinear control. You will learn the formal definitions of stability (Lyapunov stable, asymptotically stable, globally asymptotically stable), the direct method that proves them via a candidate energy function, LaSalle's invariance principle for the borderline case where $\\dot{V}$ touches zero, and the use of Lyapunov ideas to <em>design</em> stabilizing controllers (Control Lyapunov Functions, backstepping, adaptive control). At the end we glance at modern AI work that learns Lyapunov functions from neural networks, then a Pyodide lab where you experiment with candidate functions for a damped pendulum.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish stable, asymptotically stable, globally asymptotically stable, and unstable equilibria of nonlinear systems</li>
<li>Apply Lyapunov's direct method by constructing a positive-definite function $V(X)$ with $\\dot{V} \\le 0$ along trajectories</li>
<li>Solve the algebraic Lyapunov equation $A^\\top P + P A = -Q$ to build a quadratic $V$ for any stable linear system</li>
<li>Use LaSalle's invariance principle when $\\dot{V}$ vanishes on a set but no nontrivial trajectory remains there</li>
<li>Design stabilizing controllers via Control Lyapunov Functions and backstepping, and handle parameter uncertainty with adaptive control</li>
<li>Recognize how modern AI learns neural Lyapunov functions to certify the stability of learned policies</li>
</ul>
</div>

<!-- ========================================================================
     SECTION 1
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">1. Linear vs Nonlinear Stability</h2>

<div class="calc-highlight"><strong>Why linear methods fail globally:</strong> For $\\dot{X} = AX$ the eigenvalues of $A$ tell you everything — if all $\\text{Re}(\\lambda_i) < 0$ the origin attracts every trajectory, period. For $\\dot{X} = f(X)$ with $f$ nonlinear, linearization gives only the <em>local</em> picture near an equilibrium. Far from equilibrium, the trajectory may swing into a limit cycle, escape to infinity, or settle to a different fixed point entirely.</div>

<p class="l-text">Consider three pendulum-like systems. The linearized one $\\ddot{x} + b\\dot{x} + x = 0$ is a beautiful damped oscillator: every trajectory spirals to the origin, eigenvalues $\\lambda = -b/2 \\pm i\\sqrt{1 - b^2/4}$ have negative real part, and the origin is globally asymptotically stable. Replace $x$ by $\\sin x$ and you get $\\ddot{x} + b\\dot{x} + \\sin x = 0$, the actual pendulum. Linearizing at $x = 0$ gives the <em>same</em> matrix, so locally it looks identical. But globally there is a second equilibrium at $x = \\pi$ (the upside-down pendulum), and trajectories starting near it run away — eigenvalues alone cannot see this.</p>

<div class="calc-formula"><div class="formula-label">LOCAL LINEARIZATION (HARTMAN-GROBMAN)</div><div class="formula-main">$$\\dot{X} = f(X), \\quad f(X^*) = 0 \\;\\Longrightarrow\\; \\dot{\\xi} \\approx J f(X^*) \\xi, \\;\\; \\xi = X - X^*$$</div><div class="formula-sub">Eigenvalues of the Jacobian $Jf(X^*)$ classify the equilibrium <em>locally</em>, in a small neighborhood of $X^*$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Linear $\\dot{X} = AX$</div><div class="card-body">Eigenvalues of $A$ determine stability globally. Negative real parts $\\Rightarrow$ origin attracts every initial condition in $\\mathbb{R}^n$.</div></div>
<div class="calc-card"><div class="card-title">Linearization</div><div class="card-body">For nonlinear $f$, the Jacobian at $X^*$ gives the local stability picture. Hartman-Grobman makes it rigorous in a neighborhood.</div></div>
<div class="calc-card"><div class="card-title">Global question</div><div class="card-body">How large is the basin of attraction? Are there other equilibria, limit cycles, or chaos? Eigenvalues cannot answer.</div></div>
<div class="calc-card"><div class="card-title">Lyapunov</div><div class="card-body">A direct method that gives stability without solving the ODE, works for nonlinear systems, and quantifies basins of attraction.</div></div>
</div>

<p class="l-text">Engineers care about the global picture for one practical reason: real systems start far from equilibrium and you need a guarantee that they will eventually settle there. A robot manipulator initialized at a random pose, a satellite tumbling after launch, a power grid recovering from a fault — none of these are infinitesimally small perturbations. Linear analysis is necessary but not sufficient. Lyapunov's direct method is the tool that handles the rest.</p>

<div class="l-note"><strong>Historical note.</strong> Aleksandr Mikhailovich Lyapunov published his doctoral thesis <em>The General Problem of the Stability of Motion</em> in 1892. It was largely ignored in the West for fifty years until cold-war control engineers rediscovered it in the 1940s and 1950s. Today it is the foundational tool of modern nonlinear control, robust control, and is making a comeback through neural Lyapunov methods in reinforcement learning.</div>

<!-- ========================================================================
     SECTION 2
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">2. Equilibria and the Definitions of Stability</h2>

<div class="calc-highlight"><strong>Stability is not one concept — it is three.</strong> A system can be stable but never settle (closed orbits), it can be asymptotically stable but only for nearby initial conditions (local), or it can be globally asymptotically stable (every initial condition lands at the equilibrium). Precise definitions are required because nonlinear systems mix these behaviors.</div>

<p class="l-text">An equilibrium $X^*$ of the autonomous system $\\dot{X} = f(X)$ is any point satisfying $f(X^*) = 0$. At an equilibrium the velocity is zero, so a trajectory placed exactly there stays forever. The question of stability is what happens when the initial condition is perturbed slightly off the equilibrium.</p>

<div class="calc-formula"><div class="formula-label">EQUILIBRIUM POINT</div><div class="formula-main">$$X^* \\in \\mathbb{R}^n \\;\\text{ such that }\\; f(X^*) = 0$$</div><div class="formula-sub">A point of zero velocity. Without loss of generality we shift coordinates so $X^* = 0$ in this lesson.</div></div>

<p class="l-text">Three standard definitions, each strictly stronger than the previous:</p>

<div class="calc-formula"><div class="formula-label">LYAPUNOV STABLE (THE WEAKEST NOTION)</div><div class="formula-main">$$\\forall\\, \\varepsilon > 0,\\;\\; \\exists\\, \\delta > 0 \\;:\\; \\|X(0)\\| < \\delta \\;\\Longrightarrow\\; \\|X(t)\\| < \\varepsilon \\;\\forall t \\ge 0$$</div><div class="formula-sub">Trajectories that start near the origin stay near the origin. They need not converge.</div></div>

<div class="calc-formula"><div class="formula-label">ASYMPTOTICALLY STABLE</div><div class="formula-main">$$\\text{Lyapunov stable } \\;\\text{ AND }\\; \\exists\\, \\delta > 0 \\;:\\; \\|X(0)\\| < \\delta \\;\\Longrightarrow\\; \\lim_{t \\to \\infty} X(t) = 0$$</div><div class="formula-sub">Nearby trajectories not only stay near but converge to the equilibrium.</div></div>

<div class="calc-formula"><div class="formula-label">GLOBALLY ASYMPTOTICALLY STABLE (GAS)</div><div class="formula-main">$$\\text{Asymptotically stable } \\;\\text{ AND }\\; \\lim_{t \\to \\infty} X(t) = 0 \\;\\forall\\; X(0) \\in \\mathbb{R}^n$$</div><div class="formula-sub">Every initial condition, no matter how far, converges to the origin. The basin of attraction is the entire space.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stable (Lyapunov)</div><div class="card-body">Bounded perturbations remain bounded. Example: undamped pendulum near the bottom — energy is conserved, never reaches zero.</div></div>
<div class="calc-card"><div class="card-title">Asymptotically stable</div><div class="card-body">Trajectories <em>decay</em> to the equilibrium. Example: damped pendulum near the bottom — friction drains energy.</div></div>
<div class="calc-card"><div class="card-title">Globally asymp. stable</div><div class="card-body">No matter where you start, you end up at the equilibrium. Example: linear $\\dot{X} = AX$ with all $\\text{Re}(\\lambda_i) < 0$.</div></div>
<div class="calc-card"><div class="card-title">Unstable</div><div class="card-body">There exists a perturbation $\\delta$ that escapes to distance $\\ge \\varepsilon$. Example: inverted pendulum at the top.</div></div>
</div>

<p class="l-text">Notice the asymmetry: a system can be Lyapunov stable without being asymptotically stable (closed orbits, undamped oscillators), but asymptotic stability always implies Lyapunov stability. The strongest property — global asymptotic stability — is the gold standard for controller design. We want our controllers to bring the plant back to the desired set-point regardless of initial state.</p>

<div class="l-note"><strong>Example: pendulum.</strong> The pendulum $\\ddot{\\theta} + b\\dot{\\theta} + \\sin\\theta = 0$ has two equilibria: $(\\theta, \\dot\\theta) = (0, 0)$ (down position) and $(\\pi, 0)$ (up position). With $b > 0$, the down position is asymptotically stable — but <em>not</em> globally, because trajectories near $(\\pi, 0)$ flee. The up position is unstable. Lyapunov's method will let us prove the bottom is asymptotically stable and even estimate its basin of attraction.</div>

<!-- ========================================================================
     SECTION 3
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">3. Lyapunov's Direct Method</h2>

<div class="calc-highlight"><strong>The theorem in one line:</strong> Find a scalar function $V(X)$ that is positive definite around the equilibrium and whose time derivative along trajectories is non-positive — then the equilibrium is Lyapunov stable. If the derivative is strictly negative, it is asymptotically stable. No need to solve the ODE.</div>

<p class="l-text">Let $\\dot{X} = f(X)$ with $f(0) = 0$. A candidate Lyapunov function $V : \\mathbb{R}^n \\to \\mathbb{R}$ must satisfy three conditions in some neighborhood $\\Omega$ of the origin:</p>

<div class="calc-formula"><div class="formula-label">CONDITIONS ON A LYAPUNOV FUNCTION</div><div class="formula-main">$$V(0) = 0, \\quad V(X) > 0 \\;\\;\\forall X \\in \\Omega \\setminus \\{0\\}, \\quad \\dot{V}(X) = \\nabla V(X)^\\top f(X) \\le 0$$</div><div class="formula-sub">Positive definite plus non-increasing along trajectories. The dot is along the flow.</div></div>

<p class="l-text">The time derivative of $V$ along a trajectory is computed by the chain rule and never requires us to know $X(t)$ explicitly:</p>

<div class="calc-formula"><div class="formula-label">DERIVATIVE OF V ALONG THE FLOW</div><div class="formula-main">$$\\dot{V} = \\frac{d}{dt} V(X(t)) = \\sum_{i=1}^{n} \\frac{\\partial V}{\\partial X_i} \\frac{dX_i}{dt} = \\nabla V(X) \\cdot f(X)$$</div><div class="formula-sub">A pure algebraic quantity. No integration, no solution, just dot product of gradient with vector field.</div></div>

<p class="l-text">With these conditions in hand, Lyapunov's theorems read:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Theorem 1 — Stability</div><div class="card-body">If $V > 0$ on $\\Omega \\setminus \\{0\\}$ and $\\dot{V} \\le 0$, the origin is Lyapunov stable.</div></div>
<div class="calc-card"><div class="card-title">Theorem 2 — Asymp. Stability</div><div class="card-body">If additionally $\\dot{V} < 0$ on $\\Omega \\setminus \\{0\\}$, the origin is asymptotically stable.</div></div>
<div class="calc-card"><div class="card-title">Theorem 3 — Global Asymp.</div><div class="card-body">If $V$ is radially unbounded ($V \\to \\infty$ as $\\|X\\| \\to \\infty$) and $\\dot{V} < 0$ everywhere except origin, GAS.</div></div>
<div class="calc-card"><div class="card-title">Theorem 4 — Instability</div><div class="card-body">Chetaev's theorem: if a region next to the origin has $V > 0$ and $\\dot{V} > 0$, the origin is unstable.</div></div>
</div>

<p class="l-text">The art lies in choosing $V$. For mechanical systems, total energy (kinetic + potential) is almost always a good first candidate. For electrical systems, sum of stored magnetic and electric energy works. For chemical reactors, entropy or Gibbs free energy. For abstract systems with no physical interpretation, quadratic forms $V = X^\\top P X$ are the workhorse and Section 5 shows how to construct $P$ algebraically.</p>

<div class="l-note"><strong>Failure does not mean instability.</strong> If you cannot find a Lyapunov function, that <em>does not</em> mean the system is unstable. It might just mean you guessed wrong. Lyapunov's theorems are sufficient conditions, not necessary ones — though converse Lyapunov theorems (Massera, Kurzweil) guarantee that <em>some</em> $V$ exists whenever the equilibrium is in fact asymptotically stable. The catch: the converse theorems are non-constructive.</div>

<!-- ========================================================================
     SECTION 4
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">4. Geometric Intuition — Energy Bowls and Level Sets</h2>

<div class="calc-highlight"><strong>The picture:</strong> A Lyapunov function carves the state space into nested level sets $\\{V = c\\}$. Each one is a closed surface surrounding the equilibrium. The condition $\\dot{V} < 0$ means trajectories cross these surfaces inward, like a ball rolling down a bowl. The equilibrium is the bottom; every path that obeys $\\dot{V} < 0$ ends up there.</div>

<p class="l-text">Visualize $V(X) = X_1^2 + X_2^2$ on the plane. Its level sets are circles centered at the origin. The gradient $\\nabla V = (2X_1, 2X_2)^\\top$ points radially outward. If the vector field $f(X)$ has a negative inner product with $\\nabla V$ everywhere except the origin, then $f$ always points inward across these circles. Trajectories spiral or arc inward until they hit the origin.</p>

<div class="calc-formula"><div class="formula-label">GEOMETRIC INTERPRETATION OF $\\dot{V} \\le 0$</div><div class="formula-main">$$\\dot{V} = \\langle \\nabla V, f \\rangle \\le 0 \\;\\Longleftrightarrow\\; \\text{angle between flow and outward gradient is } \\ge 90^\\circ$$</div><div class="formula-sub">The flow has a non-positive component along the outward normal of level sets. It cannot escape.</div></div>

<p class="l-text">This geometric picture also explains why $V$ is sometimes called a <strong>generalized energy</strong>. In mechanics, total energy $E = (1/2)m\\dot{x}^2 + U(x)$ decreases monotonically when friction is present because $\\dot{E} = -b\\dot{x}^2 \\le 0$. The level sets $\\{E = c\\}$ are nested closed curves in phase space (position-velocity plane), and damped trajectories cross them inward toward the minimum of $U$. Lyapunov's insight: this geometric picture generalizes to <em>any</em> scalar function $V$ with the right signs, even when no physical energy exists.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Level sets</div><div class="card-body">$\\{X : V(X) = c\\}$ for various $c > 0$ are nested closed surfaces around the equilibrium.</div></div>
<div class="calc-card"><div class="card-title">Gradient</div><div class="card-body">$\\nabla V$ is normal to level sets, points outward (toward larger $V$). Length $= $ steepness of $V$.</div></div>
<div class="calc-card"><div class="card-title">Flow vs gradient</div><div class="card-body">$\\dot{V} = \\nabla V \\cdot f$. Negative $\\Rightarrow$ flow crosses level sets inward toward the equilibrium.</div></div>
<div class="calc-card"><div class="card-title">Basin estimate</div><div class="card-body">Any sublevel set $\\{V \\le c\\}$ inside the region where $\\dot{V} < 0$ is forward-invariant, hence a basin estimate.</div></div>
</div>

<div id="plot-pendulum-phase-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var b=0.3;
function f(s){return[s[1],-b*s[1]-Math.sin(s[0])];}
function rk4(s,h){var k1=f(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=f(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=f(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=f(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var traces=[];
var inits=[[0.5,0],[1.5,0],[2.5,0],[-1,0.5],[-2,-0.5],[2.3,0.8]];
var colors=["#3b82f6","#60a5fa","#93c5fd","#a78bfa","#c4b5fd","#22c55e"];
for(var k=0;k<inits.length;k++){var s=inits[k].slice();var xs=[];var ys=[];for(var i=0;i<2000;i++){xs.push(s[0]);ys.push(s[1]);s=rk4(s,0.02);}traces.push({x:xs,y:ys,mode:"lines",name:"orbit "+(k+1),line:{color:colors[k],width:1.6},showlegend:false});}
var cx=[];var cy=[];var cz=[];var N=80;for(var i=0;i<N;i++){var row=[];var xrow=[];var yrow=[];for(var j=0;j<N;j++){var x=-3.5+7*j/(N-1);var y=-3+6*i/(N-1);xrow.push(x);yrow.push(y);row.push(0.5*y*y+(1-Math.cos(x)));}cx.push(xrow);cy.push(yrow);cz.push(row);}
traces.push({z:cz,x:cx[0],y:cy.map(function(r){return r[0];}),type:"contour",contours:{coloring:"none",start:0.1,end:3.5,size:0.4},line:{color:"rgba(248,113,113,0.45)",width:1},showscale:false,name:"V level sets"});
traces.push({x:[0],y:[0],mode:"markers",name:"equilibrium",marker:{color:"#22c55e",size:11,symbol:"x",line:{width:2}}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"angle theta (rad)",range:[-3.5,3.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"angular velocity",range:[-3,3]},margin:{t:60,r:30,b:50,l:60},showlegend:false};
Plotly.newPlot("plot-pendulum-phase-en",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Damped pendulum phase portrait with Lyapunov function level sets overlaid as red contours. Trajectories (blue/purple/green) cross level sets inward, confirming $\\dot{V} < 0$. Every orbit converges to the origin (the bottom equilibrium). The level sets near $\\theta = \\pm\\pi$ deform, hinting that the basin of attraction of the origin does not extend that far.</div></div>

<!-- ========================================================================
     SECTION 5
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">5. Worked Example 1: Linear System — The Algebraic Lyapunov Equation</h2>

<div class="calc-highlight"><strong>For any stable linear system, a quadratic Lyapunov function always exists and can be computed by solving a linear matrix equation.</strong> This is the cleanest application of the direct method and underlies all of robust and adaptive linear control.</div>

<p class="l-text">Consider $\\dot{X} = AX$ with $A \\in \\mathbb{R}^{n \\times n}$ Hurwitz (all eigenvalues have negative real part). Try the candidate $V(X) = X^\\top P X$ for some symmetric positive-definite matrix $P$. Then $V(0) = 0$, $V(X) > 0$ for $X \\ne 0$, and we just need $\\dot{V} \\le 0$.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Compute $\\dot{V}$</div><div class="step-detail">$\\dot{V} = \\dot{X}^\\top P X + X^\\top P \\dot{X} = X^\\top A^\\top P X + X^\\top P A X = X^\\top (A^\\top P + P A) X$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Require $\\dot{V}$ negative definite</div><div class="step-detail">We want $X^\\top (A^\\top P + P A) X < 0$ for $X \\ne 0$. Equivalently, $A^\\top P + P A = -Q$ for some positive-definite $Q$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Algebraic Lyapunov equation</div><div class="step-detail">Pick any $Q \\succ 0$ (e.g. $Q = I$) and solve the linear equation $A^\\top P + P A = -Q$ for the unknown symmetric matrix $P$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Existence theorem</div><div class="step-detail">If $A$ is Hurwitz, the algebraic Lyapunov equation has a unique symmetric positive-definite solution $P$ for every $Q \\succ 0$.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Conclusion</div><div class="step-detail">$V(X) = X^\\top P X$ is a valid Lyapunov function. $\\dot{V}(X) = -X^\\top Q X < 0$ for $X \\ne 0$. Origin is globally asymptotically stable.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">ALGEBRAIC LYAPUNOV EQUATION</div><div class="formula-main">$$A^\\top P + P A = -Q, \\qquad Q \\succ 0 \\;\\Longrightarrow\\; \\exists !\\, P \\succ 0$$</div><div class="formula-sub">A single linear matrix equation. In MATLAB: <code>P = lyap(A', Q)</code>. In SciPy: <code>scipy.linalg.solve_lyapunov(A.T, -Q)</code>.</div></div>

<div class="calc-example"><div class="example-label">CONCRETE: A 2x2 STABLE SYSTEM</div><div class="example-body">Take $A = \\begin{bmatrix} -1 & 1 \\\\ 0 & -2 \\end{bmatrix}$ and $Q = I_2$. Solving $A^\\top P + P A = -I$ symbolically gives $P = \\begin{bmatrix} 0.625 & 0.125 \\\\ 0.125 & 0.3125 \\end{bmatrix}$. Both eigenvalues of $P$ are positive ($\\approx 0.66, 0.28$), so $P$ is positive definite. The function $V(X) = 0.625 X_1^2 + 0.25 X_1 X_2 + 0.3125 X_2^2$ is a quadratic Lyapunov function whose ellipsoidal level sets are forward-invariant.</div></div>

<div id="plot-lyap-ellipse-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var A=[[-1,1],[0,-2]];
function f(s){return[A[0][0]*s[0]+A[0][1]*s[1],A[1][0]*s[0]+A[1][1]*s[1]];}
function rk4(s,h){var k1=f(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=f(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=f(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=f(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var traces=[];var inits=[[1.5,1],[1,-1.2],[-1.5,0.8],[-1,-1.3],[0.5,1.5],[0.6,-1.6]];var colors=["#3b82f6","#60a5fa","#93c5fd","#a78bfa","#c4b5fd","#dbeafe"];
for(var k=0;k<inits.length;k++){var s=inits[k].slice();var xs=[];var ys=[];for(var i=0;i<800;i++){xs.push(s[0]);ys.push(s[1]);s=rk4(s,0.02);}traces.push({x:xs,y:ys,mode:"lines",line:{color:colors[k],width:1.8},showlegend:false});}
var Cs=[0.2,0.6,1.2,2.0];
for(var c=0;c<Cs.length;c++){var theta=[];var rs=[];var ts=[];for(var i=0;i<200;i++){var th=2*Math.PI*i/199;var a=0.625;var b=0.25;var d=0.3125;var den=a*Math.cos(th)*Math.cos(th)+b*Math.cos(th)*Math.sin(th)+d*Math.sin(th)*Math.sin(th);var r=Math.sqrt(Cs[c]/den);theta.push(r*Math.cos(th));rs.push(r*Math.sin(th));}traces.push({x:theta,y:rs,mode:"lines",line:{color:"rgba(248,113,113,0.55)",width:1.4,dash:"dot"},showlegend:false});}
traces.push({x:[0],y:[0],mode:"markers",marker:{color:"#22c55e",size:11,symbol:"x",line:{width:2}},showlegend:false});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_1",range:[-2.2,2.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_2",range:[-2.2,2.2],scaleanchor:"x"},margin:{t:60,r:30,b:50,l:60},showlegend:false};
Plotly.newPlot("plot-lyap-ellipse-en",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Trajectories of the stable linear system $\\dot{X} = AX$ (blue/purple shades) plotted alongside ellipsoidal level sets of the Lyapunov function $V = X^\\top P X$ (red dotted ellipses). Each trajectory crosses every ellipse inward, demonstrating $\\dot{V} < 0$. The ellipses are not circles because $P$ is not a multiple of the identity — they reflect the asymmetric eigenstructure of $A$.</div></div>

<!-- ========================================================================
     SECTION 6
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">6. Worked Example 2: The Pendulum</h2>

<div class="calc-highlight"><strong>This is the canonical nonlinear example.</strong> Physical energy is the natural Lyapunov function. Without friction, energy is conserved and the pendulum is stable but not asymptotically stable. With friction, energy decreases and we get asymptotic stability — but only after combining Lyapunov's theorem with LaSalle's invariance principle.</div>

<p class="l-text">The pendulum of unit length and unit mass in unit gravity, with linear viscous friction coefficient $b \\ge 0$:</p>

<div class="calc-formula"><div class="formula-label">PENDULUM EQUATION</div><div class="formula-main">$$\\ddot{\\theta} + b\\dot{\\theta} + \\sin\\theta = 0$$</div><div class="formula-sub">Two state variables: $x_1 = \\theta$ (angle from vertical, down position $= 0$) and $x_2 = \\dot{\\theta}$ (angular velocity).</div></div>

<p class="l-text">Rewrite as a first-order system, then use total mechanical energy (kinetic plus potential measured from the bottom) as the Lyapunov candidate:</p>

<div class="calc-formula"><div class="formula-label">FIRST-ORDER FORM</div><div class="formula-main">$$\\dot{x}_1 = x_2, \\qquad \\dot{x}_2 = -b x_2 - \\sin x_1$$</div></div>

<div class="calc-formula"><div class="formula-label">CANDIDATE LYAPUNOV FUNCTION (TOTAL ENERGY)</div><div class="formula-main">$$V(x_1, x_2) = \\frac{1}{2} x_2^2 + (1 - \\cos x_1)$$</div><div class="formula-sub">Kinetic energy plus potential energy. $V(0) = 0$. For $x_1 \\in (-\\pi, \\pi)$ and $x_2 \\ne 0$, $V > 0$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Positive definiteness</div><div class="step-detail">On $\\Omega = \\{|x_1| < \\pi\\}$, $V$ is positive definite: $1 - \\cos x_1 \\ge 0$ with equality only at $x_1 = 0$, and $x_2^2/2 \\ge 0$ with equality only at $x_2 = 0$. Hence $V > 0$ on $\\Omega \\setminus \\{0\\}$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Compute $\\dot{V}$</div><div class="step-detail">$\\dot{V} = \\frac{\\partial V}{\\partial x_1} \\dot{x}_1 + \\frac{\\partial V}{\\partial x_2} \\dot{x}_2 = \\sin x_1 \\cdot x_2 + x_2 \\cdot (-b x_2 - \\sin x_1) = -b x_2^2$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">No friction ($b = 0$)</div><div class="step-detail">$\\dot{V} = 0$. Energy is exactly conserved — undamped pendulum oscillates forever. Origin is Lyapunov stable but <em>not</em> asymptotically stable. Closed orbits in phase space.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">With friction ($b > 0$)</div><div class="step-detail">$\\dot{V} = -b x_2^2 \\le 0$, with equality only on $\\{x_2 = 0\\}$. Negative semi-definite, not strictly negative — Lyapunov's classical theorem gives stability but not yet asymptotic stability.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">LaSalle invariance closes the gap</div><div class="step-detail">On $\\{x_2 = 0\\}$, $\\dot{x}_2 = -\\sin x_1 \\ne 0$ unless $x_1 = 0$ (or $\\pi$). So no nontrivial trajectory stays on $\\{x_2 = 0\\}$. LaSalle: origin is asymptotically stable.</div></div></div>
</div>

<div id="plot-pendulum-decay-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var b=0.3;
function f(s){return[s[1],-b*s[1]-Math.sin(s[0])];}
function rk4(s,h){var k1=f(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=f(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=f(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=f(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var s=[2.0,0];var ts=[];var Vs=[];var Vdots=[];
for(var i=0;i<2500;i++){var t=i*0.02;ts.push(t);var V=0.5*s[1]*s[1]+(1-Math.cos(s[0]));Vs.push(V);Vdots.push(-b*s[1]*s[1]);s=rk4(s,0.02);}
var t1={x:ts,y:Vs,mode:"lines",name:"V(t) energy",line:{color:"#3b82f6",width:2.5},yaxis:"y"};
var t2={x:ts,y:Vdots,mode:"lines",name:"dV/dt",line:{color:"#f87171",width:2,dash:"dash"},yaxis:"y2"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"time t"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"V (energy)",side:"left"},yaxis2:{title:"dV/dt",overlaying:"y",side:"right",zerolinecolor:"rgba(255,255,255,0.15)"},margin:{t:60,r:60,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.12,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-pendulum-decay-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Energy $V(t)$ of a damped pendulum starting from a large initial angle. The blue curve descends monotonically to zero, confirming asymptotic decay. The red dashed curve is $\\dot{V} = -b\\dot{\\theta}^2$, always non-positive, with brief plateaus at zero when the pendulum momentarily reverses direction (where $\\dot{\\theta} = 0$). LaSalle handles those instants.</div></div>

<!-- ========================================================================
     SECTION 7
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">7. LaSalle's Invariance Principle</h2>

<div class="calc-highlight"><strong>The fix for "$\\dot{V} = 0$ but not at the equilibrium":</strong> when $\\dot{V}$ is only negative semi-definite, you cannot apply Lyapunov's asymptotic-stability theorem directly. LaSalle's invariance principle examines the set where $\\dot{V}$ vanishes and checks whether any trajectory can stay there forever. If the only such trajectory is the equilibrium itself, asymptotic stability is recovered.</div>

<p class="l-text">Formally, suppose $V : \\Omega \\to \\mathbb{R}$ is positive definite, $\\dot{V}(X) \\le 0$ on a compact, forward-invariant set $\\Omega$ containing the origin. Define</p>

<div class="calc-formula"><div class="formula-label">THE ZERO-DERIVATIVE SET</div><div class="formula-main">$$E = \\{X \\in \\Omega : \\dot{V}(X) = 0\\}$$</div><div class="formula-sub">All points where the Lyapunov derivative is exactly zero (where the standard theorem stalls).</div></div>

<div class="calc-formula"><div class="formula-label">LaSALLE'S INVARIANCE PRINCIPLE</div><div class="formula-main">$$\\text{Let } M = \\text{largest invariant subset of } E. \\;\\text{Then every trajectory in } \\Omega \\text{ converges to } M.$$</div><div class="formula-sub">If $M = \\{0\\}$, the origin is asymptotically stable. The trick: find $M$ explicitly by substituting $\\dot{V} = 0$ back into the dynamics.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Set $E$</div><div class="card-body">Where the Lyapunov function "rests" — its derivative is zero. The flow could in principle be tangent to level sets here.</div></div>
<div class="calc-card"><div class="card-title">Invariant subset $M$</div><div class="card-body">The largest subset of $E$ such that any trajectory starting in $M$ stays in $M$ forever.</div></div>
<div class="calc-card"><div class="card-title">Pendulum example</div><div class="card-body">$E = \\{\\dot\\theta = 0\\}$ (zero angular velocity). On $E$, $\\dot{\\dot\\theta} = -\\sin\\theta \\ne 0$ unless $\\theta = 0$. So $M = \\{0\\}$.</div></div>
<div class="calc-card"><div class="card-title">When $M \\ne \\{0\\}$</div><div class="card-body">Trajectories converge to a larger invariant set — a limit cycle, an arc, or a manifold. Common in conservative systems.</div></div>
</div>

<p class="l-text">LaSalle is essential for mechanical systems where damping acts only on velocity, not position. The Lyapunov derivative is naturally of the form $-b\\|\\dot{q}\\|^2$ — zero whenever $\\dot{q} = 0$. Without LaSalle, you would only conclude stability; with it, you get the full asymptotic-stability result that engineering demands.</p>

<div class="l-note"><strong>Why "invariance"?</strong> A set $M$ is invariant if every trajectory that enters $M$ stays in $M$ for all time. Equivalently, $M$ is the union of complete trajectories. Finding the largest invariant subset of $E$ amounts to substituting $\\dot{V} = 0$ into the differential equations and asking which solutions persist — usually a small algebraic exercise.</div>

<!-- ========================================================================
     SECTION 8
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">8. Lyapunov for Control Design — Control Lyapunov Functions and Backstepping</h2>

<div class="calc-highlight"><strong>Reverse the question:</strong> instead of <em>analyzing</em> stability after the controller is built, <em>use</em> a Lyapunov function to <em>design</em> the controller. Pick a candidate $V$, compute $\\dot{V}$ as a function of state and control input $u$, then choose $u$ to make $\\dot{V}$ negative.</div>

<p class="l-text">For the controlled nonlinear system $\\dot{X} = f(X) + g(X) u$, the Lyapunov derivative along the closed-loop reads</p>

<div class="calc-formula"><div class="formula-label">CONTROL LYAPUNOV FUNCTION (CLF)</div><div class="formula-main">$$\\dot{V} = \\nabla V^\\top f(X) + \\nabla V^\\top g(X) u$$</div><div class="formula-sub">A scalar that is affine in $u$. Choose $u$ to make this negative.</div></div>

<p class="l-text">A function $V$ is called a <strong>Control Lyapunov Function</strong> if there exists a continuous feedback $u(X)$ making $\\dot{V}(X, u(X)) < 0$ for all $X \\ne 0$. The simplest choice is the so-called Sontag formula or a feedback-linearizing law that cancels the drift:</p>

<div class="calc-formula"><div class="formula-label">SONTAG'S UNIVERSAL FORMULA</div><div class="formula-main">$$u(X) = -\\frac{a(X) + \\sqrt{a(X)^2 + b(X)^4}}{b(X)} \\text{ if } b(X) \\ne 0, \\;\\; 0 \\text{ otherwise}$$</div><div class="formula-sub">where $a = \\nabla V \\cdot f$, $b = \\nabla V \\cdot g$. Continuous, almost smooth, and stabilizing.</div></div>

<p class="l-text"><strong>Backstepping</strong> is a recursive design technique for systems in <em>strict feedback form</em>:</p>

<div class="calc-formula"><div class="formula-label">STRICT FEEDBACK FORM (TWO-STEP CASE)</div><div class="formula-main">$$\\dot{x}_1 = f_1(x_1) + g_1(x_1) x_2, \\qquad \\dot{x}_2 = u$$</div><div class="formula-sub">$x_2$ acts like a virtual control for $x_1$. Stabilize $x_1$ first, then track $x_2$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Stabilize the first subsystem</div><div class="step-detail">Pick a Lyapunov candidate $V_1(x_1)$ and a virtual control law $x_2 = \\phi(x_1)$ that makes $\\dot{V}_1 < 0$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Define the tracking error</div><div class="step-detail">$z = x_2 - \\phi(x_1)$. Augment $V_1 \\to V_2 = V_1 + (1/2) z^2$ to include the tracking error.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Compute $\\dot{V}_2$ and choose $u$</div><div class="step-detail">$\\dot{V}_2 = \\dot{V}_1\\big|_{x_2 = \\phi + z} + z \\dot{z}$. Pick $u$ so that the cross-coupling cancels and $\\dot{V}_2 < 0$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Iterate for higher dimensions</div><div class="step-detail">For $n$ cascaded subsystems, repeat the procedure $n$ times. Each step adds a quadratic term to $V$ and one tracking variable.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">SIMPLE BACKSTEPPING EXAMPLE</div><div class="example-body">Consider $\\dot{x}_1 = -x_1 + x_2$, $\\dot{x}_2 = u$. Step 1: $V_1 = (1/2) x_1^2$, virtual control $\\phi(x_1) = 0$ gives $\\dot{V}_1 = -x_1^2$. But $x_2$ is not literally zero, so define $z = x_2$. Step 2: $V_2 = (1/2)x_1^2 + (1/2)z^2$. Then $\\dot{V}_2 = -x_1^2 + x_1 z + z u$. Pick $u = -x_1 - z$ to get $\\dot{V}_2 = -x_1^2 - z^2 < 0$. Origin globally asymptotically stable.</div></div>

<!-- ========================================================================
     SECTION 9
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">9. Worked Example 3: Adaptive Control with Parameter Uncertainty</h2>

<div class="calc-highlight"><strong>What if the plant parameters are unknown?</strong> Standard Lyapunov design assumes you know $f$ and $g$ exactly. In practice, mass, friction coefficient, or motor constant may be uncertain. Adaptive control augments the Lyapunov function with a parameter-error term and derives both the control law <em>and</em> a parameter-update law that together guarantee stability.</div>

<p class="l-text">Consider the scalar system with unknown constant $a$:</p>

<div class="calc-formula"><div class="formula-label">UNCERTAIN PLANT</div><div class="formula-main">$$\\dot{x} = a x + u, \\qquad a \\in \\mathbb{R} \\text{ unknown}$$</div></div>

<p class="l-text">Let $\\hat{a}(t)$ be a time-varying estimate of $a$. Define the parameter error $\\tilde{a} = \\hat{a} - a$. Augmented Lyapunov candidate:</p>

<div class="calc-formula"><div class="formula-label">AUGMENTED LYAPUNOV FUNCTION</div><div class="formula-main">$$V(x, \\tilde{a}) = \\frac{1}{2} x^2 + \\frac{1}{2\\gamma} \\tilde{a}^2, \\qquad \\gamma > 0$$</div><div class="formula-sub">$\\gamma$ is the adaptation gain. Larger $\\gamma$ updates faster but risks oscillation.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Differentiate</div><div class="step-detail">$\\dot{V} = x\\dot{x} + (1/\\gamma) \\tilde{a} \\dot{\\tilde{a}} = x(ax + u) + (1/\\gamma) \\tilde{a} \\dot{\\hat{a}}$ (since $\\dot{\\tilde{a}} = \\dot{\\hat{a}}$, as $a$ is constant).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Substitute control law</div><div class="step-detail">Try $u = -\\hat{a} x - k x$ with $k > 0$. Then $ax + u = ax - \\hat{a} x - k x = -\\tilde{a} x - k x$, so $x \\dot{x} = -\\tilde{a} x^2 - k x^2$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Choose update law to cancel cross term</div><div class="step-detail">$\\dot{V} = -k x^2 - \\tilde{a} x^2 + (1/\\gamma) \\tilde{a} \\dot{\\hat{a}}$. Setting $\\dot{\\hat{a}} = \\gamma x^2$ kills the cross-term: $\\dot{V} = -k x^2 \\le 0$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Apply LaSalle</div><div class="step-detail">$\\dot{V} = -k x^2 = 0 \\Rightarrow x = 0$. The largest invariant subset of $\\{x = 0\\}$: substituting back, $0 = a \\cdot 0 + u = -\\hat{a} \\cdot 0 \\Rightarrow$ no constraint on $\\hat{a}$. So $x \\to 0$ but $\\tilde{a}$ may not vanish.</div></div></div>
</div>

<p class="l-text"><strong>Interpretation.</strong> The closed loop achieves <em>regulation</em> ($x \\to 0$) but not necessarily <em>parameter identification</em> ($\\hat{a} \\to a$). Parameter convergence requires a <em>persistent excitation</em> condition on the reference signal — a well-known feature of adaptive control. Modern reinforcement-learning controllers face exactly the same trade-off.</p>

<div class="l-note"><strong>Robustness from Lyapunov.</strong> The same recipe handles bounded disturbances: $\\dot{x} = ax + u + w(t)$ with $|w| \\le W$. Just pick $u = -\\hat{a} x - k x - K \\text{sgn}(x)$ with $K > W$; the discontinuous term absorbs the worst-case disturbance and Lyapunov analysis carries through. This is the sliding-mode controller, beloved in robotics for its disturbance-rejection muscle.</div>

<!-- ========================================================================
     SECTION 10
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">10. AI Connection — Neural Lyapunov Functions</h2>

<div class="calc-highlight"><strong>The modern twist:</strong> instead of hand-crafting $V(X)$, train a neural network to <em>learn</em> a Lyapunov function from data. The network parameters are optimized so that two losses are minimized: $V_\\theta$ is positive definite, and $\\dot{V}_\\theta = \\nabla V_\\theta \\cdot f(X) < 0$ on the state space.</div>

<p class="l-text">Two influential papers seeded this line of work. Chang, Roohi, and Gao (2019, "Neural Lyapunov Control") jointly train a neural controller and a neural Lyapunov function for nonlinear systems, certifying stability with a satisfiability-modulo-theories (SMT) solver. Boffi et al. (2021, "Learning Stability Certificates from Data") use Monte Carlo sampling and PAC bounds to give probabilistic guarantees.</p>

<div class="calc-formula"><div class="formula-label">NEURAL LYAPUNOV TRAINING LOSSES</div><div class="formula-main">$$\\mathcal{L}_1 = \\max(0, -V_\\theta(X) + \\epsilon \\|X\\|^2), \\quad \\mathcal{L}_2 = \\max(0, \\nabla V_\\theta \\cdot f(X) + \\alpha \\|X\\|^2)$$</div><div class="formula-sub">Hinge losses that activate only where $V \\le \\epsilon \\|X\\|^2$ (insufficiently positive) or $\\dot{V} \\ge -\\alpha\\|X\\|^2$ (insufficiently negative).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why learn $V$?</div><div class="card-body">For complex robots, drones, or learned policies, no closed-form $V$ exists. Neural nets approximate $V$ with arbitrary precision given enough samples.</div></div>
<div class="calc-card"><div class="card-title">Verification</div><div class="card-body">After training, an SMT solver (dReal, Marabou) verifies the Lyapunov conditions hold on the entire region — not just sampled points.</div></div>
<div class="calc-card"><div class="card-title">Region of attraction</div><div class="card-body">The largest sublevel set $\\{V_\\theta \\le c\\}$ where verification succeeds is a certified basin of attraction for the learned policy.</div></div>
<div class="calc-card"><div class="card-title">Safe RL</div><div class="card-body">Combine neural Lyapunov with RL: the policy is updated only as long as the learned $V$ remains valid (Berkenkamp et al. 2017).</div></div>
</div>

<p class="l-text">Why does this matter? Learned policies (deep RL, imitation learning, model-predictive control with neural dynamics) are notoriously hard to certify. Standard control-theoretic guarantees assume known dynamics; neural Lyapunov methods sidestep that by learning a certificate directly. The result is a hybrid pipeline: train a controller with deep RL, then learn or verify a Lyapunov function that proves the policy is stabilizing within a quantified region.</p>

<div class="l-note"><strong>Frontier work.</strong> Recent papers (Dawson, Gao, Fan, 2023 survey "Safe Control with Learned Certificates") extend the framework to barrier functions (avoid unsafe sets), input-to-state stability (handle disturbances), and contraction metrics (guarantee tracking error bounds). The deep tie between Lyapunov theory and modern AI safety is now a major research vein.</div>

<div id="plot-3d-lyap-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=40;var xs=[];var ys=[];var zs=[];
for(var i=0;i<N;i++){var row=[];for(var j=0;j<N;j++){var x=-3+6*j/(N-1);var y=-2+4*i/(N-1);if(i===0){xs.push(x);}if(j===0){ys.push(y);}row.push(0.5*y*y+(1-Math.cos(x)));}zs.push(row);}
var data=[{x:xs,y:ys,z:zs,type:"surface",colorscale:[[0,"#1e3a8a"],[0.5,"#3b82f6"],[1,"#dbeafe"]],showscale:false,opacity:0.92,contours:{z:{show:true,usecolormap:false,color:"rgba(255,255,255,0.25)",width:1.2}}}];
var layout={paper_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},scene:{xaxis:{title:"theta",gridcolor:"rgba(255,255,255,0.1)",zerolinecolor:"rgba(255,255,255,0.2)",backgroundcolor:"rgba(0,0,0,0)"},yaxis:{title:"theta_dot",gridcolor:"rgba(255,255,255,0.1)",zerolinecolor:"rgba(255,255,255,0.2)",backgroundcolor:"rgba(0,0,0,0)"},zaxis:{title:"V(theta, theta_dot)",gridcolor:"rgba(255,255,255,0.1)",zerolinecolor:"rgba(255,255,255,0.2)",backgroundcolor:"rgba(0,0,0,0)"},bgcolor:"rgba(0,0,0,0)",camera:{eye:{x:1.5,y:-1.5,z:1.1}}},margin:{t:30,r:0,b:0,l:0}};
Plotly.newPlot("plot-3d-lyap-en",data,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> The pendulum Lyapunov function $V(\\theta, \\dot\\theta) = (1/2)\\dot\\theta^2 + (1 - \\cos\\theta)$ rendered as a 3D surface. The bowl shape is the geometric reason the damped pendulum is stable — trajectories slide down toward the basin at $\\theta = 0, \\dot\\theta = 0$. The peaks at $\\theta = \\pm\\pi$ are the unstable upper equilibria of the pendulum.</div></div>

<!-- ========================================================================
     SECTION 11
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">11. Pyodide Lab — Pendulum Stability via Lyapunov</h2>

<p class="l-text">This lab walks through the full Lyapunov pipeline for a damped pendulum. You will define $V(X)$, compute $\\dot{V}$ symbolically with SymPy, verify the conditions, simulate the system from several initial conditions, plot $V(t)$ along each trajectory, and confirm monotonic decay. The second part asks you to experiment with a <em>wrong</em> Lyapunov candidate and see how the test fails.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · LYAPUNOV CONDITIONS FOR DAMPED PENDULUM</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.integrate <span class="kw">import</span> solve_ivp

<span class="cm"># --- Damped pendulum dynamics --------------------------------------</span>
b = <span class="num">0.3</span>    <span class="cm"># friction coefficient</span>
<span class="kw">def</span> <span class="fn">pendulum</span>(t, X):
    th, w = X
    <span class="kw">return</span> [w, -b*w - np.<span class="fn">sin</span>(th)]

<span class="cm"># --- Candidate Lyapunov function V = (1/2)w^2 + (1 - cos(theta)) ---</span>
<span class="kw">def</span> <span class="fn">V</span>(X):
    th, w = X
    <span class="kw">return</span> <span class="num">0.5</span>*w**<span class="num">2</span> + (<span class="num">1</span> - np.<span class="fn">cos</span>(th))

<span class="cm"># --- Analytical Vdot = -b*w^2 --------------------------------------</span>
<span class="kw">def</span> <span class="fn">Vdot</span>(X):
    th, w = X
    <span class="kw">return</span> -b * w**<span class="num">2</span>

<span class="cm"># --- Check positive definiteness on a grid -------------------------</span>
g = np.<span class="fn">linspace</span>(-np.pi+<span class="num">0.01</span>, np.pi-<span class="num">0.01</span>, <span class="num">50</span>)
Vmin, Vmax = np.<span class="fn">inf</span>, -np.<span class="fn">inf</span>
<span class="kw">for</span> th <span class="kw">in</span> g:
    <span class="kw">for</span> w <span class="kw">in</span> g:
        <span class="kw">if</span> th == <span class="num">0</span> <span class="kw">and</span> w == <span class="num">0</span>: <span class="kw">continue</span>
        v = <span class="fn">V</span>([th, w])
        Vmin = <span class="fn">min</span>(Vmin, v)
        Vmax = <span class="fn">max</span>(Vmax, v)
<span class="fn">print</span>(<span class="str">f"V(0,0) = {V([0,0]):.4f}  (must be 0)"</span>)
<span class="fn">print</span>(<span class="str">f"min V on grid (excluding origin) = {Vmin:.4f}  (must be > 0)"</span>)
<span class="fn">print</span>(<span class="str">f"max V on grid = {Vmax:.4f}"</span>)

<span class="cm"># --- Simulate from several initial conditions ----------------------</span>
t_span = (<span class="num">0</span>, <span class="num">20</span>)
t_eval = np.<span class="fn">linspace</span>(*t_span, <span class="num">500</span>)
<span class="kw">for</span> X0 <span class="kw">in</span> [[<span class="num">1.0</span>, <span class="num">0</span>], [<span class="num">2.0</span>, <span class="num">0</span>], [<span class="num">0.5</span>, <span class="num">1.5</span>], [-<span class="num">1.8</span>, <span class="num">0.5</span>]]:
    sol = <span class="fn">solve_ivp</span>(pendulum, t_span, X0, t_eval=t_eval, rtol=<span class="num">1e-8</span>)
    V_traj = [<span class="fn">V</span>(sol.y[:, i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(t_eval))]
    Vdot_traj = [<span class="fn">Vdot</span>(sol.y[:, i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(t_eval))]
    monotone = <span class="fn">all</span>(V_traj[i+<span class="num">1</span>] &lt;= V_traj[i] + <span class="num">1e-9</span> <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(V_traj)-<span class="num">1</span>))
    <span class="fn">print</span>(<span class="str">f"X0={X0}: V_init={V_traj[0]:.4f}, V_final={V_traj[-1]:.6f}, monotonic decay: {monotone}"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON · WRONG LYAPUNOV CANDIDATE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># --- A bad candidate: V_bad = (1/2)*theta^2 + (1/2)*omega^2 --------</span>
<span class="cm"># --- (quadratic everywhere, no awareness of nonlinearity) ----------</span>
<span class="kw">def</span> <span class="fn">V_bad</span>(X):
    th, w = X
    <span class="kw">return</span> <span class="num">0.5</span>*th**<span class="num">2</span> + <span class="num">0.5</span>*w**<span class="num">2</span>

<span class="kw">def</span> <span class="fn">Vdot_bad</span>(X):
    th, w = X
    <span class="cm"># dV_bad/dt = theta*w + w*(-b*w - sin(theta)) = theta*w - b*w^2 - w*sin(theta)</span>
    <span class="kw">return</span> th*w - b*w**<span class="num">2</span> - w*np.<span class="fn">sin</span>(th)

<span class="cm"># Test sign on the grid ---------------------------------------------</span>
worst = -np.<span class="fn">inf</span>
worst_pt = <span class="kw">None</span>
<span class="kw">for</span> th <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">1.5</span>, <span class="num">1.5</span>, <span class="num">60</span>):
    <span class="kw">for</span> w <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">1.5</span>, <span class="num">1.5</span>, <span class="num">60</span>):
        v = <span class="fn">Vdot_bad</span>([th, w])
        <span class="kw">if</span> v &gt; worst:
            worst = v
            worst_pt = (th, w)
<span class="fn">print</span>(<span class="str">f"Worst Vdot_bad value: {worst:.4f} at (theta, omega) = {worst_pt}"</span>)
<span class="kw">if</span> worst &gt; <span class="num">0</span>:
    <span class="fn">print</span>(<span class="str">"  -> V_bad fails: dV/dt > 0 somewhere. Not a Lyapunov function!"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">"  -> V_bad passes the sign test on this grid."</span>)

<span class="cm"># Sanity check: simulate and watch V_bad oscillate up and down -----</span>
sol = <span class="fn">solve_ivp</span>(pendulum, (<span class="num">0</span>,<span class="num">15</span>), [<span class="num">2.5</span>, <span class="num">0</span>], t_eval=np.<span class="fn">linspace</span>(<span class="num">0</span>,<span class="num">15</span>,<span class="num">300</span>))
Vb = np.<span class="fn">array</span>([<span class="fn">V_bad</span>(sol.y[:,i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">300</span>)])
diffs = np.<span class="fn">diff</span>(Vb)
n_up = <span class="fn">int</span>(np.<span class="fn">sum</span>(diffs &gt; <span class="num">0</span>))
<span class="fn">print</span>(<span class="str">f"Along trajectory from (2.5,0): V_bad increased in {n_up}/{299} steps"</span>)
<span class="fn">print</span>(<span class="str">"(monotone decay would give 0 — V_bad is not a valid Lyapunov function)"</span>)</code></pre></div>

<div id="plot-comparison-en" class="plotly-graph"></div>
<script>setTimeout(function(){
function pen(s,b){return[s[1],-b*s[1]-Math.sin(s[0])];}
function rk4(s,h,b){var k1=pen(s,b);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=pen(s2,b);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=pen(s3,b);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=pen(s4,b);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var s1=[1.8,0];var s2=[1.8,0];var t1=[];var v1=[];var v2=[];
for(var i=0;i<1500;i++){var t=i*0.02;t1.push(t);v1.push(0.5*s1[1]*s1[1]+(1-Math.cos(s1[0])));v2.push(0.5*s2[1]*s2[1]+(1-Math.cos(s2[0])));s1=rk4(s1,0.02,0);s2=rk4(s2,0.02,0.35);}
var tr1={x:t1,y:v1,mode:"lines",name:"undamped (b=0): V constant",line:{color:"#f87171",width:2.5}};
var tr2={x:t1,y:v2,mode:"lines",name:"damped (b=0.35): V decays",line:{color:"#3b82f6",width:2.5}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"time t"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"V (energy)"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.12,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-comparison-en",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Lyapunov function $V$ along two trajectories from the same initial condition. Red (undamped, $b = 0$) is exactly conserved — $\\dot{V} = 0$ — confirming the pendulum is Lyapunov stable but not asymptotically stable. Blue (damped, $b = 0.35$) decays monotonically to zero, the unmistakable signature of asymptotic stability proven via Lyapunov's direct method combined with LaSalle.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Try replacing the candidate $V$ with $V(\\theta, \\dot\\theta) = (1/2)\\dot\\theta^2 + \\theta^2$ (a quadratic substitute for $1 - \\cos\\theta$). Compute $\\dot{V}$ symbolically and find a state where it is positive. The Lyapunov test fails — but the system is still asymptotically stable. The moral: failing to find $V$ does not mean instability. It just means try a better $V$.</div></div>

<p class="l-text">In the next lesson we leave the time domain entirely and meet frequency-domain stability — Bode plots, Nyquist criterion, gain and phase margins. The Lyapunov machinery developed here is the foundation that classical frequency techniques quietly rest on; whenever a margin is positive, an implicit Lyapunov function certifies the loop. Modern robust control (H-infinity, mu-synthesis) makes the connection explicit and computational.</p>
`,

/* ============================================================================
   TURKISH VERSION
   ============================================================================ */
tr: `
<p class="l-text"><strong>Özdeğer analizi güzel bir araçtır — ama yalnızca sistem doğrusal olduğunda.</strong> Sürtünme hızı çarpmaya başladığında, sarkaç küçük açı sınırının dışına çıktığında, robot kolu Coulomb stiksiyonla karşılaştığında, $A$ matrisi ortadan kaybolur ve kararlılık sorusu şuna döner: "yörüngeler dengeye yakın mı kalacak, yoksa ondan uzaklaşacak mı?" On dokuzuncu yüzyılda Rus matematikçi Aleksandr Lyapunov, ODE'yi çözmeyi hiç gerektirmeyen çarpıcı bir yanıt verdi. Enerji gibi davranan bir skaler fonksiyon $V(X)$ kurun — dengeden uzakta pozitif, her yörünge boyunca azalan — ve kararlılık otomatik olarak gelir. Özdeğer yok, entegrasyon yok, açık çözüm yok.</p>

<p class="l-text">Bu ders doğrusal kontrol teorisinden doğrusal olmayan kontrole geçişin köprüsüdür. Kararlılığın resmi tanımlarını (Lyapunov anlamında kararlı, asimptotik kararlı, global asimptotik kararlı), bunları aday bir enerji fonksiyonuyla kanıtlayan doğrudan yöntemi, $\\dot{V}$'nin sıfıra dokunduğu sınır durumu için LaSalle'in değişmezlik ilkesini ve Lyapunov fikirlerinin kararlılaştırıcı kontrolcüler <em>tasarlamak</em> için kullanımını (Kontrol Lyapunov Fonksiyonları, geri-adımlama, uyarlanır kontrol) öğreneceksiniz. Sonunda sinir ağlarından Lyapunov fonksiyonu öğrenen modern AI çalışmalarına bir göz atıp, sönümlü sarkaç için aday fonksiyonlarla denediğiniz bir Pyodide laboratuvarıyla bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Doğrusal olmayan sistemlerin kararlı, asimptotik kararlı, global asimptotik kararlı ve kararsız dengelerini ayırt etmeyi</li>
<li>Pozitif tanımlı $V(X)$ fonksiyonu ve $\\dot{V} \\le 0$ koşuluyla Lyapunov'un doğrudan yöntemini uygulamayı</li>
<li>Kararlı her doğrusal sistem için kuadratik $V$ kurmak üzere cebirsel Lyapunov denklemi $A^\\top P + P A = -Q$'yu çözmeyi</li>
<li>$\\dot{V}$'nin bir kümede sıfırlandığı ama hiçbir yörüngenin orada kalmadığı duruma LaSalle'in değişmezlik ilkesini uygulamayı</li>
<li>Kontrol Lyapunov Fonksiyonu ve geri-adımlama (backstepping) ile kararlılaştırıcı tasarlamayı, parametre belirsizliğini uyarlanır kontrolle ele almayı</li>
<li>Modern AI'nın öğrenilmiş politikaların kararlılığını sertifikalandırmak için sinir Lyapunov fonksiyonlarını nasıl öğrendiğini görmeyi</li>
</ul>
</div>

<!-- ========================================================================
     BÖLÜM 1
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">1. Doğrusal vs Doğrusal Olmayan Kararlılık</h2>

<div class="calc-highlight"><strong>Doğrusal yöntemler globalde neden başarısız?</strong> $\\dot{X} = AX$ için $A$'nın özdeğerleri her şeyi söyler — tüm $\\text{Re}(\\lambda_i) < 0$ ise orijin her yörüngeyi kendine çeker, nokta. $f$ doğrusal olmayan $\\dot{X} = f(X)$ için lineerleştirme yalnızca dengenin <em>yakınındaki</em> resmi verir. Dengeden uzakta yörünge bir limit çevrime sapabilir, sonsuza kaçabilir veya tamamen farklı bir sabit noktaya yerleşebilir.</div>

<p class="l-text">Üç sarkaç-benzeri sistemi düşünün. Lineerleştirilmiş $\\ddot{x} + b\\dot{x} + x = 0$ güzel bir sönümlü osilatördür: her yörünge orijine sarmal çizer, $\\lambda = -b/2 \\pm i\\sqrt{1 - b^2/4}$ özdeğerleri negatif reel kısımlıdır ve orijin global asimptotik kararlıdır. $x$ yerine $\\sin x$ yazın, gerçek sarkaç olan $\\ddot{x} + b\\dot{x} + \\sin x = 0$'ı elde edersiniz. $x = 0$'da lineerleştirme <em>aynı</em> matrisi verir, yani yerel olarak özdeş görünür. Ama globalde $x = \\pi$'de (baş aşağı sarkaç) ikinci bir denge vardır ve oraya yakın başlayan yörüngeler kaçar — özdeğerler tek başına bunu göremez.</p>

<div class="calc-formula"><div class="formula-label">YEREL LİNEERLEŞTİRME (HARTMAN-GROBMAN)</div><div class="formula-main">$$\\dot{X} = f(X), \\quad f(X^*) = 0 \\;\\Longrightarrow\\; \\dot{\\xi} \\approx J f(X^*) \\xi, \\;\\; \\xi = X - X^*$$</div><div class="formula-sub">Jacobian'ın $Jf(X^*)$ özdeğerleri dengeyi $X^*$'nin küçük bir komşuluğunda <em>yerel olarak</em> sınıflandırır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğrusal $\\dot{X} = AX$</div><div class="card-body">$A$'nın özdeğerleri kararlılığı global olarak belirler. Negatif reel kısımlar $\\Rightarrow$ orijin $\\mathbb{R}^n$'deki her başlangıç koşulunu çeker.</div></div>
<div class="calc-card"><div class="card-title">Lineerleştirme</div><div class="card-body">Doğrusal olmayan $f$ için $X^*$'deki Jacobian yerel kararlılık resmini verir. Hartman-Grobman bunu bir komşulukta titiz hale getirir.</div></div>
<div class="calc-card"><div class="card-title">Global soru</div><div class="card-body">Çekim havzası ne kadar büyük? Başka dengeler, limit çevrimleri veya kaos var mı? Özdeğerler yanıtlayamaz.</div></div>
<div class="calc-card"><div class="card-title">Lyapunov</div><div class="card-body">Doğrusal olmayan sistemlerle çalışan, ODE'yi çözmeden kararlılık veren ve çekim havzalarını nicelleştiren doğrudan yöntem.</div></div>
</div>

<p class="l-text">Mühendisler global resimle pratik bir nedenden ötürü ilgilenir: gerçek sistemler dengeden uzakta başlar ve sonunda oraya yerleşeceklerine dair garanti gerekir. Rastgele bir duruşla başlatılan robot manipülatör, fırlatma sonrası yuvarlanan bir uydu, arıza sonrası toparlanan bir güç şebekesi — bunların hiçbiri sonsuz küçük pertürbasyon değildir. Doğrusal analiz gereklidir ama yeterli değildir. Lyapunov'un doğrudan yöntemi geri kalanı ele alan araçtır.</p>

<div class="l-note"><strong>Tarihsel not.</strong> Aleksandr Mihayloviç Lyapunov, doktora tezi <em>Hareketin Kararlılığının Genel Problemi</em>'ni 1892'de yayımladı. Soğuk Savaş kontrol mühendisleri 1940'lı ve 1950'li yıllarda yeniden keşfedene kadar Batı'da elli yıl boyunca büyük ölçüde göz ardı edildi. Bugün modern doğrusal olmayan kontrol, robust kontrol ve sağlam kontrolün temel aracıdır; pekiştirmeli öğrenmedeki sinir Lyapunov yöntemleriyle yeniden yükselişe geçmiştir.</div>

<!-- ========================================================================
     BÖLÜM 2
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">2. Dengeler ve Kararlılığın Tanımları</h2>

<div class="calc-highlight"><strong>Kararlılık tek bir kavram değildir — üçtür.</strong> Bir sistem kararlı olabilir ama hiç oturmayabilir (kapalı yörüngeler), asimptotik kararlı olabilir ama yalnızca yakındaki başlangıç koşulları için (yerel) veya global asimptotik kararlı olabilir (her başlangıç koşulu dengeye iner). Doğrusal olmayan sistemler bu davranışları karıştırdığı için kesin tanımlara ihtiyacımız var.</div>

<p class="l-text">Otonom sistem $\\dot{X} = f(X)$'in bir dengesi $X^*$, $f(X^*) = 0$ koşulunu sağlayan her noktadır. Bir dengede hız sıfırdır, dolayısıyla oraya yerleştirilen yörünge sonsuza kadar orada kalır. Kararlılık sorusu, başlangıç koşulu dengeden hafifçe pertürbe edildiğinde ne olacağıdır.</p>

<div class="calc-formula"><div class="formula-label">DENGE NOKTASI</div><div class="formula-main">$$X^* \\in \\mathbb{R}^n \\;\\text{ öyle ki }\\; f(X^*) = 0$$</div><div class="formula-sub">Hızın sıfır olduğu nokta. Genelliği kaybetmeden bu derste $X^* = 0$ olacak şekilde koordinat kaydırılır.</div></div>

<p class="l-text">Her biri öncekinden kesinlikle daha güçlü olan üç standart tanım:</p>

<div class="calc-formula"><div class="formula-label">LYAPUNOV ANLAMINDA KARARLI (EN ZAYIF KAVRAM)</div><div class="formula-main">$$\\forall\\, \\varepsilon > 0,\\;\\; \\exists\\, \\delta > 0 \\;:\\; \\|X(0)\\| < \\delta \\;\\Longrightarrow\\; \\|X(t)\\| < \\varepsilon \\;\\forall t \\ge 0$$</div><div class="formula-sub">Orijine yakın başlayan yörüngeler orijine yakın kalır. Yakınsamak zorunda değildirler.</div></div>

<div class="calc-formula"><div class="formula-label">ASİMPTOTİK KARARLI</div><div class="formula-main">$$\\text{Lyapunov kararlı } \\;\\text{ VE }\\; \\exists\\, \\delta > 0 \\;:\\; \\|X(0)\\| < \\delta \\;\\Longrightarrow\\; \\lim_{t \\to \\infty} X(t) = 0$$</div><div class="formula-sub">Yakın yörüngeler sadece yakın kalmaz, dengeye yakınsar.</div></div>

<div class="calc-formula"><div class="formula-label">GLOBAL ASİMPTOTİK KARARLI (GAS)</div><div class="formula-main">$$\\text{Asimptotik kararlı } \\;\\text{ VE }\\; \\lim_{t \\to \\infty} X(t) = 0 \\;\\forall\\; X(0) \\in \\mathbb{R}^n$$</div><div class="formula-sub">Ne kadar uzakta olursa olsun her başlangıç koşulu orijine yakınsar. Çekim havzası tüm uzaydır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kararlı (Lyapunov)</div><div class="card-body">Sınırlı pertürbasyonlar sınırlı kalır. Örnek: sönümsüz sarkaç tabana yakın — enerji korunur, hiç sıfıra ulaşmaz.</div></div>
<div class="calc-card"><div class="card-title">Asimptotik kararlı</div><div class="card-body">Yörüngeler dengeye doğru <em>azalır</em>. Örnek: sönümlü sarkaç tabana yakın — sürtünme enerjiyi tüketir.</div></div>
<div class="calc-card"><div class="card-title">Global asimp. kararlı</div><div class="card-body">Nereden başlarsanız başlayın dengeye gelirsiniz. Örnek: tüm $\\text{Re}(\\lambda_i) < 0$ olan doğrusal $\\dot{X} = AX$.</div></div>
<div class="calc-card"><div class="card-title">Kararsız</div><div class="card-body">$\\ge \\varepsilon$ uzaklığa kaçan bir $\\delta$ pertürbasyonu vardır. Örnek: tepedeki ters sarkaç.</div></div>
</div>

<p class="l-text">Asimetriye dikkat edin: bir sistem asimptotik kararlı olmadan Lyapunov anlamında kararlı olabilir (kapalı yörüngeler, sönümsüz osilatörler), ama asimptotik kararlılık her zaman Lyapunov kararlılığını gerektirir. En güçlü özellik — global asimptotik kararlılık — kontrolcü tasarımı için altın standarttır. Kontrolcülerimizin tesisi başlangıç durumundan bağımsız olarak istenen ayar noktasına geri getirmesini istiyoruz.</p>

<div class="l-note"><strong>Örnek: sarkaç.</strong> $\\ddot{\\theta} + b\\dot{\\theta} + \\sin\\theta = 0$ sarkacının iki dengesi vardır: $(\\theta, \\dot\\theta) = (0, 0)$ (aşağı pozisyon) ve $(\\pi, 0)$ (yukarı pozisyon). $b > 0$ ile aşağı pozisyon asimptotik kararlıdır — ama global <em>değildir</em>, çünkü $(\\pi, 0)$'a yakın yörüngeler kaçar. Yukarı pozisyon kararsızdır. Lyapunov yöntemi bize tabanın asimptotik kararlı olduğunu kanıtlamayı ve hatta çekim havzasını tahmin etmeyi sağlayacak.</div>

<!-- ========================================================================
     BÖLÜM 3
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">3. Lyapunov'un Doğrudan Yöntemi</h2>

<div class="calc-highlight"><strong>Teorem tek satırda:</strong> Dengenin etrafında pozitif tanımlı olan ve yörüngeler boyunca zaman türevi negatif olmayan bir skaler fonksiyon $V(X)$ bulun — o zaman denge Lyapunov anlamında kararlıdır. Türev kesin olarak negatifse asimptotik kararlıdır. ODE'yi çözmeye gerek yok.</div>

<p class="l-text">$\\dot{X} = f(X)$ ile $f(0) = 0$ olsun. Aday Lyapunov fonksiyonu $V : \\mathbb{R}^n \\to \\mathbb{R}$, orijinin bir $\\Omega$ komşuluğunda üç koşulu sağlamalıdır:</p>

<div class="calc-formula"><div class="formula-label">LYAPUNOV FONKSİYONU ÜZERİNE KOŞULLAR</div><div class="formula-main">$$V(0) = 0, \\quad V(X) > 0 \\;\\;\\forall X \\in \\Omega \\setminus \\{0\\}, \\quad \\dot{V}(X) = \\nabla V(X)^\\top f(X) \\le 0$$</div><div class="formula-sub">Pozitif tanımlı ve yörüngeler boyunca artmayan. Nokta akış boyunca.</div></div>

<p class="l-text">$V$'nin yörünge boyunca zaman türevi zincir kuralıyla hesaplanır ve hiçbir zaman $X(t)$'yi açık olarak bilmemizi gerektirmez:</p>

<div class="calc-formula"><div class="formula-label">AKIŞ BOYUNCA V'NİN TÜREVİ</div><div class="formula-main">$$\\dot{V} = \\frac{d}{dt} V(X(t)) = \\sum_{i=1}^{n} \\frac{\\partial V}{\\partial X_i} \\frac{dX_i}{dt} = \\nabla V(X) \\cdot f(X)$$</div><div class="formula-sub">Saf cebirsel bir nicelik. Entegrasyon yok, çözüm yok, sadece gradyanın vektör alanıyla iç çarpımı.</div></div>

<p class="l-text">Bu koşullar elde edildiğinde Lyapunov'un teoremleri şu şekildedir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Teorem 1 — Kararlılık</div><div class="card-body">$\\Omega \\setminus \\{0\\}$'da $V > 0$ ve $\\dot{V} \\le 0$ ise orijin Lyapunov anlamında kararlıdır.</div></div>
<div class="calc-card"><div class="card-title">Teorem 2 — Asimp. Kararlılık</div><div class="card-body">Ek olarak $\\Omega \\setminus \\{0\\}$'da $\\dot{V} < 0$ ise orijin asimptotik kararlıdır.</div></div>
<div class="calc-card"><div class="card-title">Teorem 3 — Global Asimp.</div><div class="card-body">$V$ radyal sınırsız ($\\|X\\| \\to \\infty$ iken $V \\to \\infty$) ve orijin dışında her yerde $\\dot{V} < 0$ ise GAS.</div></div>
<div class="calc-card"><div class="card-title">Teorem 4 — Kararsızlık</div><div class="card-body">Chetaev teoremi: orijinin bitişiğindeki bir bölgede $V > 0$ ve $\\dot{V} > 0$ ise orijin kararsızdır.</div></div>
</div>

<p class="l-text">Sanat $V$'yi seçmekte yatar. Mekanik sistemler için toplam enerji (kinetik + potansiyel) hemen her zaman iyi bir ilk adaydır. Elektrik sistemleri için depolanan manyetik ve elektrik enerjisinin toplamı işe yarar. Kimyasal reaktörler için entropi veya Gibbs serbest enerjisi. Fiziksel yorumu olmayan soyut sistemler için kuadratik formlar $V = X^\\top P X$ iş atıdır ve Bölüm 5 $P$'yi cebirsel olarak nasıl kuracağını gösterir.</p>

<div class="l-note"><strong>Başarısızlık kararsızlık anlamına gelmez.</strong> Bir Lyapunov fonksiyonu bulamazsanız, bu sistemin kararsız olduğu anlamına <em>gelmez</em>. Sadece yanlış tahmin etmiş olabilirsiniz. Lyapunov'un teoremleri yeterli koşullardır, gerekli değil — ancak ters Lyapunov teoremleri (Massera, Kurzweil) denge gerçekten asimptotik kararlıysa <em>bir</em> $V$'nin var olduğunu garanti eder. Tuzak: ters teoremler yapıcı değildir.</div>

<!-- ========================================================================
     BÖLÜM 4
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">4. Geometrik Sezgi — Enerji Çanağı ve Seviye Kümeleri</h2>

<div class="calc-highlight"><strong>Resim:</strong> Bir Lyapunov fonksiyonu durum uzayını iç içe seviye kümeleri $\\{V = c\\}$ olarak oyar. Her biri dengeyi çevreleyen kapalı bir yüzeydir. $\\dot{V} < 0$ koşulu, yörüngelerin bu yüzeyleri içeri doğru kestiği anlamına gelir, sanki bir top çanaktan aşağı yuvarlanıyormuş gibi. Denge dipdir; $\\dot{V} < 0$'a uyan her yol oraya gelir.</div>

<p class="l-text">Düzlemde $V(X) = X_1^2 + X_2^2$'yi gözünüzde canlandırın. Seviye kümeleri orijinde merkezli dairelerdir. Gradyan $\\nabla V = (2X_1, 2X_2)^\\top$ radyal olarak dışa bakar. Eğer vektör alanı $f(X)$'in $\\nabla V$ ile iç çarpımı orijin dışında her yerde negatifse, o zaman $f$ her zaman bu daireleri içeri doğru gösterir. Yörüngeler orijine ulaşana kadar sarmal çizer ya da kavis çizer.</p>

<div class="calc-formula"><div class="formula-label">$\\dot{V} \\le 0$'IN GEOMETRİK YORUMU</div><div class="formula-main">$$\\dot{V} = \\langle \\nabla V, f \\rangle \\le 0 \\;\\Longleftrightarrow\\; \\text{akış ile dışa gradyan arasındaki açı } \\ge 90^\\circ$$</div><div class="formula-sub">Akışın seviye kümelerinin dış normali boyunca negatif olmayan bir bileşeni vardır. Dışarı kaçamaz.</div></div>

<p class="l-text">Bu geometrik resim, $V$'nin neden bazen <strong>genelleştirilmiş enerji</strong> diye adlandırıldığını da açıklar. Mekanikte sürtünme varken toplam enerji $E = (1/2)m\\dot{x}^2 + U(x)$ monoton olarak azalır çünkü $\\dot{E} = -b\\dot{x}^2 \\le 0$. Seviye kümeleri $\\{E = c\\}$, faz uzayında (konum-hız düzlemi) iç içe kapalı eğrilerdir ve sönümlü yörüngeler bunları $U$'nun minimumuna doğru içeri keser. Lyapunov'un içgörüsü: bu geometrik resim, fiziksel enerji olmadığında bile doğru işaretlere sahip <em>herhangi bir</em> skaler fonksiyon $V$ için genelleşir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Seviye kümeleri</div><div class="card-body">Çeşitli $c > 0$ için $\\{X : V(X) = c\\}$, denge etrafında iç içe kapalı yüzeylerdir.</div></div>
<div class="calc-card"><div class="card-title">Gradyan</div><div class="card-body">$\\nabla V$ seviye kümelerine diktir, dışarı bakar (daha büyük $V$'ye doğru). Uzunluk $= $ $V$'nin dikliği.</div></div>
<div class="calc-card"><div class="card-title">Akış vs gradyan</div><div class="card-body">$\\dot{V} = \\nabla V \\cdot f$. Negatif $\\Rightarrow$ akış seviye kümelerini dengeye doğru içeri keser.</div></div>
<div class="calc-card"><div class="card-title">Havza tahmini</div><div class="card-body">$\\dot{V} < 0$ olduğu bölgenin içindeki herhangi bir alt seviye kümesi $\\{V \\le c\\}$ ileri-değişmezdir, dolayısıyla bir havza tahminidir.</div></div>
</div>

<div id="plot-pendulum-phase-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var b=0.3;
function f(s){return[s[1],-b*s[1]-Math.sin(s[0])];}
function rk4(s,h){var k1=f(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=f(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=f(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=f(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var traces=[];
var inits=[[0.5,0],[1.5,0],[2.5,0],[-1,0.5],[-2,-0.5],[2.3,0.8]];
var colors=["#3b82f6","#60a5fa","#93c5fd","#a78bfa","#c4b5fd","#22c55e"];
for(var k=0;k<inits.length;k++){var s=inits[k].slice();var xs=[];var ys=[];for(var i=0;i<2000;i++){xs.push(s[0]);ys.push(s[1]);s=rk4(s,0.02);}traces.push({x:xs,y:ys,mode:"lines",name:"yörünge "+(k+1),line:{color:colors[k],width:1.6},showlegend:false});}
var cx=[];var cy=[];var cz=[];var N=80;for(var i=0;i<N;i++){var row=[];var xrow=[];var yrow=[];for(var j=0;j<N;j++){var x=-3.5+7*j/(N-1);var y=-3+6*i/(N-1);xrow.push(x);yrow.push(y);row.push(0.5*y*y+(1-Math.cos(x)));}cx.push(xrow);cy.push(yrow);cz.push(row);}
traces.push({z:cz,x:cx[0],y:cy.map(function(r){return r[0];}),type:"contour",contours:{coloring:"none",start:0.1,end:3.5,size:0.4},line:{color:"rgba(248,113,113,0.45)",width:1},showscale:false,name:"V seviye"});
traces.push({x:[0],y:[0],mode:"markers",name:"denge",marker:{color:"#22c55e",size:11,symbol:"x",line:{width:2}}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"açı theta (rad)",range:[-3.5,3.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"açısal hız",range:[-3,3]},margin:{t:60,r:30,b:50,l:60},showlegend:false};
Plotly.newPlot("plot-pendulum-phase-tr",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Sönümlü sarkacın faz portresi, Lyapunov fonksiyonu seviye kümeleri kırmızı kontur olarak üst üste bindirilmiş. Yörüngeler (mavi/mor/yeşil) seviye kümelerini içeri keserek $\\dot{V} < 0$'ı doğrular. Her yörünge orijine (taban dengesi) yakınsar. $\\theta = \\pm\\pi$ yakınındaki seviye kümeleri deforme olur, bu da orijinin çekim havzasının o kadar uzanmadığını ima eder.</div></div>

<!-- ========================================================================
     BÖLÜM 5
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">5. Örnek 1: Doğrusal Sistem — Cebirsel Lyapunov Denklemi</h2>

<div class="calc-highlight"><strong>Kararlı her doğrusal sistem için kuadratik Lyapunov fonksiyonu her zaman vardır ve bir matris denklemi çözülerek hesaplanabilir.</strong> Bu, doğrudan yöntemin en temiz uygulamasıdır ve tüm robust ve uyarlanır doğrusal kontrolün altında yatar.</div>

<p class="l-text">$A \\in \\mathbb{R}^{n \\times n}$ Hurwitz (tüm özdeğerlerin reel kısmı negatif) olan $\\dot{X} = AX$ sistemini düşünün. Bir simetrik pozitif tanımlı $P$ matrisi için $V(X) = X^\\top P X$ adayını deneyin. O zaman $V(0) = 0$, $X \\ne 0$ için $V(X) > 0$, sadece $\\dot{V} \\le 0$'a ihtiyacımız var.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$\\dot{V}$'yi hesapla</div><div class="step-detail">$\\dot{V} = \\dot{X}^\\top P X + X^\\top P \\dot{X} = X^\\top A^\\top P X + X^\\top P A X = X^\\top (A^\\top P + P A) X$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\dot{V}$'nin negatif tanımlı olmasını iste</div><div class="step-detail">$X \\ne 0$ için $X^\\top (A^\\top P + P A) X < 0$ istiyoruz. Eşdeğer olarak, bir pozitif tanımlı $Q$ için $A^\\top P + P A = -Q$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Cebirsel Lyapunov denklemi</div><div class="step-detail">Herhangi bir $Q \\succ 0$ (örn. $Q = I$) seçin ve bilinmeyen simetrik $P$ matrisi için lineer $A^\\top P + P A = -Q$ denklemini çözün.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Varlık teoremi</div><div class="step-detail">$A$ Hurwitz ise cebirsel Lyapunov denkleminin her $Q \\succ 0$ için tek simetrik pozitif tanımlı $P$ çözümü vardır.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Sonuç</div><div class="step-detail">$V(X) = X^\\top P X$ geçerli bir Lyapunov fonksiyonudur. $X \\ne 0$ için $\\dot{V}(X) = -X^\\top Q X < 0$. Orijin global asimptotik kararlıdır.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">CEBİRSEL LYAPUNOV DENKLEMİ</div><div class="formula-main">$$A^\\top P + P A = -Q, \\qquad Q \\succ 0 \\;\\Longrightarrow\\; \\exists !\\, P \\succ 0$$</div><div class="formula-sub">Tek bir lineer matris denklemi. MATLAB'de: <code>P = lyap(A', Q)</code>. SciPy'de: <code>scipy.linalg.solve_lyapunov(A.T, -Q)</code>.</div></div>

<div class="calc-example"><div class="example-label">SOMUT: 2x2 KARARLI SİSTEM</div><div class="example-body">$A = \\begin{bmatrix} -1 & 1 \\\\ 0 & -2 \\end{bmatrix}$ ve $Q = I_2$ alın. $A^\\top P + P A = -I$'i sembolik çözmek $P = \\begin{bmatrix} 0.625 & 0.125 \\\\ 0.125 & 0.3125 \\end{bmatrix}$ verir. $P$'nin her iki özdeğeri de pozitiftir ($\\approx 0.66, 0.28$), dolayısıyla $P$ pozitif tanımlıdır. $V(X) = 0.625 X_1^2 + 0.25 X_1 X_2 + 0.3125 X_2^2$ fonksiyonu, elipsoidal seviye kümeleri ileri-değişmez olan bir kuadratik Lyapunov fonksiyonudur.</div></div>

<div id="plot-lyap-ellipse-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var A=[[-1,1],[0,-2]];
function f(s){return[A[0][0]*s[0]+A[0][1]*s[1],A[1][0]*s[0]+A[1][1]*s[1]];}
function rk4(s,h){var k1=f(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=f(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=f(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=f(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var traces=[];var inits=[[1.5,1],[1,-1.2],[-1.5,0.8],[-1,-1.3],[0.5,1.5],[0.6,-1.6]];var colors=["#3b82f6","#60a5fa","#93c5fd","#a78bfa","#c4b5fd","#dbeafe"];
for(var k=0;k<inits.length;k++){var s=inits[k].slice();var xs=[];var ys=[];for(var i=0;i<800;i++){xs.push(s[0]);ys.push(s[1]);s=rk4(s,0.02);}traces.push({x:xs,y:ys,mode:"lines",line:{color:colors[k],width:1.8},showlegend:false});}
var Cs=[0.2,0.6,1.2,2.0];
for(var c=0;c<Cs.length;c++){var theta=[];var rs=[];for(var i=0;i<200;i++){var th=2*Math.PI*i/199;var a=0.625;var b=0.25;var d=0.3125;var den=a*Math.cos(th)*Math.cos(th)+b*Math.cos(th)*Math.sin(th)+d*Math.sin(th)*Math.sin(th);var r=Math.sqrt(Cs[c]/den);theta.push(r*Math.cos(th));rs.push(r*Math.sin(th));}traces.push({x:theta,y:rs,mode:"lines",line:{color:"rgba(248,113,113,0.55)",width:1.4,dash:"dot"},showlegend:false});}
traces.push({x:[0],y:[0],mode:"markers",marker:{color:"#22c55e",size:11,symbol:"x",line:{width:2}},showlegend:false});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_1",range:[-2.2,2.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_2",range:[-2.2,2.2],scaleanchor:"x"},margin:{t:60,r:30,b:50,l:60},showlegend:false};
Plotly.newPlot("plot-lyap-ellipse-tr",traces,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Kararlı doğrusal sistem $\\dot{X} = AX$'in yörüngeleri (mavi/mor tonları), $V = X^\\top P X$ Lyapunov fonksiyonunun elipsoidal seviye kümeleriyle birlikte (kırmızı kesikli elipsler). Her yörünge her elipsi içeri keserek $\\dot{V} < 0$'ı gösterir. Elipsler daire değildir çünkü $P$ birim matrisin katı değildir — $A$'nın asimetrik öz-yapısını yansıtırlar.</div></div>

<!-- ========================================================================
     BÖLÜM 6
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">6. Örnek 2: Sarkaç</h2>

<div class="calc-highlight"><strong>Bu kanonik doğrusal olmayan örnektir.</strong> Fiziksel enerji doğal Lyapunov fonksiyonudur. Sürtünme olmadan enerji korunur ve sarkaç kararlıdır ama asimptotik kararlı değildir. Sürtünmeyle enerji azalır ve asimptotik kararlılık elde ederiz — ama yalnızca Lyapunov teoremini LaSalle'in değişmezlik ilkesiyle birleştirdikten sonra.</div>

<p class="l-text">Birim uzunluk ve birim kütlede, birim çekimde, $b \\ge 0$ lineer viskoz sürtünme katsayılı sarkaç:</p>

<div class="calc-formula"><div class="formula-label">SARKAÇ DENKLEMİ</div><div class="formula-main">$$\\ddot{\\theta} + b\\dot{\\theta} + \\sin\\theta = 0$$</div><div class="formula-sub">İki durum değişkeni: $x_1 = \\theta$ (dikeyle açı, aşağı pozisyon $= 0$) ve $x_2 = \\dot{\\theta}$ (açısal hız).</div></div>

<p class="l-text">Birinci mertebe sistem olarak yeniden yazın, sonra toplam mekanik enerjiyi (kinetik artı tabandan ölçülen potansiyel) Lyapunov adayı olarak kullanın:</p>

<div class="calc-formula"><div class="formula-label">BİRİNCİ MERTEBE FORM</div><div class="formula-main">$$\\dot{x}_1 = x_2, \\qquad \\dot{x}_2 = -b x_2 - \\sin x_1$$</div></div>

<div class="calc-formula"><div class="formula-label">ADAY LYAPUNOV FONKSİYONU (TOPLAM ENERJİ)</div><div class="formula-main">$$V(x_1, x_2) = \\frac{1}{2} x_2^2 + (1 - \\cos x_1)$$</div><div class="formula-sub">Kinetik enerji artı potansiyel enerji. $V(0) = 0$. $x_1 \\in (-\\pi, \\pi)$ ve $x_2 \\ne 0$ için $V > 0$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Pozitif tanımlılık</div><div class="step-detail">$\\Omega = \\{|x_1| < \\pi\\}$'de $V$ pozitif tanımlıdır: $1 - \\cos x_1 \\ge 0$ ve eşitlik yalnızca $x_1 = 0$'da, $x_2^2/2 \\ge 0$ ve eşitlik yalnızca $x_2 = 0$'da. Dolayısıyla $\\Omega \\setminus \\{0\\}$'da $V > 0$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\dot{V}$'yi hesapla</div><div class="step-detail">$\\dot{V} = \\frac{\\partial V}{\\partial x_1} \\dot{x}_1 + \\frac{\\partial V}{\\partial x_2} \\dot{x}_2 = \\sin x_1 \\cdot x_2 + x_2 \\cdot (-b x_2 - \\sin x_1) = -b x_2^2$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sürtünme yok ($b = 0$)</div><div class="step-detail">$\\dot{V} = 0$. Enerji tam olarak korunur — sönümsüz sarkaç sonsuza kadar salınır. Orijin Lyapunov kararlıdır ama asimptotik kararlı <em>değildir</em>. Faz uzayında kapalı yörüngeler.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Sürtünmeyle ($b > 0$)</div><div class="step-detail">$\\dot{V} = -b x_2^2 \\le 0$, eşitlik yalnızca $\\{x_2 = 0\\}$'da. Negatif yarı-tanımlı, kesin negatif değil — Lyapunov'un klasik teoremi kararlılık verir ama henüz asimptotik kararlılık değil.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">LaSalle değişmezliği boşluğu kapatır</div><div class="step-detail">$\\{x_2 = 0\\}$'da, $\\dot{x}_2 = -\\sin x_1 \\ne 0$, $x_1 = 0$ (veya $\\pi$) olmadıkça. Yani $\\{x_2 = 0\\}$'da hiçbir trivial olmayan yörünge kalmaz. LaSalle: orijin asimptotik kararlıdır.</div></div></div>
</div>

<div id="plot-pendulum-decay-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var b=0.3;
function f(s){return[s[1],-b*s[1]-Math.sin(s[0])];}
function rk4(s,h){var k1=f(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=f(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=f(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=f(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var s=[2.0,0];var ts=[];var Vs=[];var Vdots=[];
for(var i=0;i<2500;i++){var t=i*0.02;ts.push(t);var V=0.5*s[1]*s[1]+(1-Math.cos(s[0]));Vs.push(V);Vdots.push(-b*s[1]*s[1]);s=rk4(s,0.02);}
var t1={x:ts,y:Vs,mode:"lines",name:"V(t) enerji",line:{color:"#3b82f6",width:2.5},yaxis:"y"};
var t2={x:ts,y:Vdots,mode:"lines",name:"dV/dt",line:{color:"#f87171",width:2,dash:"dash"},yaxis:"y2"};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"zaman t"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"V (enerji)",side:"left"},yaxis2:{title:"dV/dt",overlaying:"y",side:"right",zerolinecolor:"rgba(255,255,255,0.15)"},margin:{t:60,r:60,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.12,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-pendulum-decay-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Büyük bir başlangıç açısından başlayan sönümlü sarkacın $V(t)$ enerjisi. Mavi eğri monoton olarak sıfıra iner, asimptotik azalmayı doğrular. Kırmızı kesikli eğri $\\dot{V} = -b\\dot{\\theta}^2$, her zaman negatif olmayan, sarkaç anlık olarak yön değiştirdiğinde (yani $\\dot{\\theta} = 0$ olduğunda) sıfırda kısa platolarla. LaSalle bu anları ele alır.</div></div>

<!-- ========================================================================
     BÖLÜM 7
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">7. LaSalle'in Değişmezlik İlkesi</h2>

<div class="calc-highlight"><strong>"$\\dot{V} = 0$ ama dengede değil" için çözüm:</strong> $\\dot{V}$ yalnızca negatif yarı-tanımlı olduğunda Lyapunov'un asimptotik kararlılık teoremini doğrudan uygulayamazsınız. LaSalle'in değişmezlik ilkesi $\\dot{V}$'nin sıfırlandığı kümeyi inceler ve içinde herhangi bir yörüngenin sonsuza kadar kalabilip kalamadığını kontrol eder. Eğer kalan tek yörünge dengenin kendisiyse asimptotik kararlılık geri kazanılır.</div>

<p class="l-text">Resmi olarak, $V : \\Omega \\to \\mathbb{R}$ pozitif tanımlı olsun, orijini içeren kompakt ve ileri-değişmez $\\Omega$ kümesinde $\\dot{V}(X) \\le 0$ olsun. Tanımlayalım</p>

<div class="calc-formula"><div class="formula-label">SIFIR-TÜREV KÜMESİ</div><div class="formula-main">$$E = \\{X \\in \\Omega : \\dot{V}(X) = 0\\}$$</div><div class="formula-sub">Lyapunov türevinin tam olarak sıfır olduğu tüm noktalar (standart teoremin tıkandığı yer).</div></div>

<div class="calc-formula"><div class="formula-label">LaSALLE'NİN DEĞİŞMEZLİK İLKESİ</div><div class="formula-main">$$M = E\\text{'nin en büyük değişmez alt kümesi olsun. } \\;\\text{O zaman } \\Omega\\text{'daki her yörünge } M\\text{'ye yakınsar.}$$</div><div class="formula-sub">$M = \\{0\\}$ ise orijin asimptotik kararlıdır. Püf nokta: $\\dot{V} = 0$'ı dinamiğe geri koyarak $M$'yi açıkça bulmak.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$E$ kümesi</div><div class="card-body">Lyapunov fonksiyonunun "durduğu" yer — türevi sıfırdır. Akış burada prensip olarak seviye kümelerine teğet olabilir.</div></div>
<div class="calc-card"><div class="card-title">Değişmez alt küme $M$</div><div class="card-body">$M$'de başlayan herhangi bir yörüngenin sonsuza kadar $M$'de kalacağı $E$'nin en büyük alt kümesi.</div></div>
<div class="calc-card"><div class="card-title">Sarkaç örneği</div><div class="card-body">$E = \\{\\dot\\theta = 0\\}$ (sıfır açısal hız). $E$'de $\\dot{\\dot\\theta} = -\\sin\\theta \\ne 0$, $\\theta = 0$ olmadıkça. Yani $M = \\{0\\}$.</div></div>
<div class="calc-card"><div class="card-title">$M \\ne \\{0\\}$ olduğunda</div><div class="card-body">Yörüngeler daha büyük bir değişmez kümeye yakınsar — bir limit çevrimi, yay veya manifold. Korunumlu sistemlerde yaygın.</div></div>
</div>

<p class="l-text">LaSalle, sönümlemenin yalnızca hıza etki ettiği, konuma etki etmediği mekanik sistemler için elzemdir. Lyapunov türevi doğal olarak $-b\\|\\dot{q}\\|^2$ formundadır — $\\dot{q} = 0$ olduğunda sıfırdır. LaSalle olmadan yalnızca kararlılık sonucuna varırsınız; LaSalle ile mühendisliğin talep ettiği tam asimptotik kararlılık sonucunu elde edersiniz.</p>

<div class="l-note"><strong>Neden "değişmezlik"?</strong> Bir $M$ kümesi, $M$'ye giren her yörüngenin sonsuza kadar $M$'de kalması durumunda değişmezdir. Eşdeğer olarak $M$, tam yörüngelerin birleşimidir. $E$'nin en büyük değişmez alt kümesini bulmak, $\\dot{V} = 0$'ı diferansiyel denklemlere yerleştirmek ve hangi çözümlerin kalıcı olduğunu sormakla aynıdır — genellikle küçük bir cebir alıştırması.</div>

<!-- ========================================================================
     BÖLÜM 8
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">8. Kontrol Tasarımı için Lyapunov — CLF ve Geri-Adımlama</h2>

<div class="calc-highlight"><strong>Soruyu tersine çevirin:</strong> kontrolcü kurulduktan sonra kararlılığı <em>analiz etmek</em> yerine, Lyapunov fonksiyonunu kontrolcüyü <em>tasarlamak</em> için kullanın. Bir aday $V$ seçin, $\\dot{V}$'yi durum ve kontrol girişi $u$ cinsinden hesaplayın, sonra $u$'yu $\\dot{V}$'yi negatif yapacak şekilde seçin.</div>

<p class="l-text">Kontrollü doğrusal olmayan sistem $\\dot{X} = f(X) + g(X) u$ için kapalı çevrim Lyapunov türevi:</p>

<div class="calc-formula"><div class="formula-label">KONTROL LYAPUNOV FONKSİYONU (CLF)</div><div class="formula-main">$$\\dot{V} = \\nabla V^\\top f(X) + \\nabla V^\\top g(X) u$$</div><div class="formula-sub">$u$ cinsinden afin bir skaler. $u$'yu bunu negatif yapacak şekilde seç.</div></div>

<p class="l-text">Bir $V$ fonksiyonu, tüm $X \\ne 0$ için $\\dot{V}(X, u(X)) < 0$ yapan sürekli bir $u(X)$ geri beslemesi mevcutsa <strong>Kontrol Lyapunov Fonksiyonu</strong> olarak adlandırılır. En basit seçim Sontag formülü ya da sürüklenmeyi iptal eden geri-besleme-lineerleştirici yasadır:</p>

<div class="calc-formula"><div class="formula-label">SONTAG'IN EVRENSEL FORMÜLÜ</div><div class="formula-main">$$u(X) = -\\frac{a(X) + \\sqrt{a(X)^2 + b(X)^4}}{b(X)} \\text{ eğer } b(X) \\ne 0, \\;\\; 0 \\text{ aksi halde}$$</div><div class="formula-sub">$a = \\nabla V \\cdot f$, $b = \\nabla V \\cdot g$. Sürekli, neredeyse pürüzsüz ve kararlılaştırıcı.</div></div>

<p class="l-text"><strong>Geri-adımlama (backstepping)</strong> <em>kesin geri-besleme formundaki</em> sistemler için özyinelemeli bir tasarım tekniğidir:</p>

<div class="calc-formula"><div class="formula-label">KESİN GERİ-BESLEME FORMU (İKİ ADIMLI DURUM)</div><div class="formula-main">$$\\dot{x}_1 = f_1(x_1) + g_1(x_1) x_2, \\qquad \\dot{x}_2 = u$$</div><div class="formula-sub">$x_2$, $x_1$ için sanal kontrol gibi davranır. Önce $x_1$'i kararlılaştır, sonra $x_2$'yi takip et.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İlk altsistemi kararlılaştır</div><div class="step-detail">Bir Lyapunov adayı $V_1(x_1)$ ve $\\dot{V}_1 < 0$ yapan sanal kontrol yasası $x_2 = \\phi(x_1)$ seç.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Takip hatasını tanımla</div><div class="step-detail">$z = x_2 - \\phi(x_1)$. Takip hatasını içerecek şekilde $V_1 \\to V_2 = V_1 + (1/2) z^2$ olarak genişlet.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\dot{V}_2$'yi hesapla ve $u$'yu seç</div><div class="step-detail">$\\dot{V}_2 = \\dot{V}_1\\big|_{x_2 = \\phi + z} + z \\dot{z}$. Çapraz-çiftlenmeyi iptal edecek ve $\\dot{V}_2 < 0$ yapacak $u$'yu seç.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Yüksek boyutlar için yinele</div><div class="step-detail">$n$ kademeli altsistem için prosedürü $n$ kez tekrarla. Her adım $V$'ye kuadratik bir terim ve bir takip değişkeni ekler.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">BASİT GERİ-ADIMLAMA ÖRNEĞİ</div><div class="example-body">$\\dot{x}_1 = -x_1 + x_2$, $\\dot{x}_2 = u$ sistemini düşünün. Adım 1: $V_1 = (1/2) x_1^2$, sanal kontrol $\\phi(x_1) = 0$ ile $\\dot{V}_1 = -x_1^2$. Ama $x_2$ tam olarak sıfır değil, dolayısıyla $z = x_2$ tanımlayın. Adım 2: $V_2 = (1/2)x_1^2 + (1/2)z^2$. O zaman $\\dot{V}_2 = -x_1^2 + x_1 z + z u$. $u = -x_1 - z$ seçerek $\\dot{V}_2 = -x_1^2 - z^2 < 0$. Orijin global asimptotik kararlı.</div></div>

<!-- ========================================================================
     BÖLÜM 9
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">9. Örnek 3: Parametre Belirsizliğinde Uyarlanır Kontrol</h2>

<div class="calc-highlight"><strong>Tesis parametreleri bilinmiyorsa ne olur?</strong> Standart Lyapunov tasarımı $f$ ve $g$'yi tam olarak bildiğinizi varsayar. Pratikte kütle, sürtünme katsayısı veya motor sabiti belirsiz olabilir. Uyarlanır kontrol, Lyapunov fonksiyonunu bir parametre-hata terimiyle genişletir ve birlikte kararlılığı garanti eden hem kontrol yasasını <em>hem de</em> parametre güncelleme yasasını türetir.</div>

<p class="l-text">Bilinmeyen sabit $a$ ile skaler sistemi düşünün:</p>

<div class="calc-formula"><div class="formula-label">BELİRSİZ TESİS</div><div class="formula-main">$$\\dot{x} = a x + u, \\qquad a \\in \\mathbb{R} \\text{ bilinmiyor}$$</div></div>

<p class="l-text">$\\hat{a}(t)$, $a$'nın zamanla değişen kestirimi olsun. Parametre hatasını $\\tilde{a} = \\hat{a} - a$ olarak tanımlayın. Genişletilmiş Lyapunov adayı:</p>

<div class="calc-formula"><div class="formula-label">GENİŞLETİLMİŞ LYAPUNOV FONKSİYONU</div><div class="formula-main">$$V(x, \\tilde{a}) = \\frac{1}{2} x^2 + \\frac{1}{2\\gamma} \\tilde{a}^2, \\qquad \\gamma > 0$$</div><div class="formula-sub">$\\gamma$ uyarlama kazancıdır. Büyük $\\gamma$ daha hızlı günceller ama salınım riski taşır.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Türev al</div><div class="step-detail">$\\dot{V} = x\\dot{x} + (1/\\gamma) \\tilde{a} \\dot{\\tilde{a}} = x(ax + u) + (1/\\gamma) \\tilde{a} \\dot{\\hat{a}}$ ($a$ sabit olduğu için $\\dot{\\tilde{a}} = \\dot{\\hat{a}}$).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Kontrol yasasını yerleştir</div><div class="step-detail">$k > 0$ ile $u = -\\hat{a} x - k x$ dene. O zaman $ax + u = ax - \\hat{a} x - k x = -\\tilde{a} x - k x$, dolayısıyla $x \\dot{x} = -\\tilde{a} x^2 - k x^2$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Çapraz terimi iptal edecek güncelleme yasası seç</div><div class="step-detail">$\\dot{V} = -k x^2 - \\tilde{a} x^2 + (1/\\gamma) \\tilde{a} \\dot{\\hat{a}}$. $\\dot{\\hat{a}} = \\gamma x^2$ koymak çapraz-terimi yok eder: $\\dot{V} = -k x^2 \\le 0$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">LaSalle uygula</div><div class="step-detail">$\\dot{V} = -k x^2 = 0 \\Rightarrow x = 0$. $\\{x = 0\\}$'ın en büyük değişmez alt kümesi: geri yerleştirerek $0 = a \\cdot 0 + u = -\\hat{a} \\cdot 0 \\Rightarrow$ $\\hat{a}$ üzerinde kısıt yok. Yani $x \\to 0$ ama $\\tilde{a}$ kaybolmayabilir.</div></div></div>
</div>

<p class="l-text"><strong>Yorum.</strong> Kapalı çevrim <em>düzenlemeyi</em> ($x \\to 0$) başarır ama mutlaka <em>parametre tanımayı</em> ($\\hat{a} \\to a$) başaramaz. Parametre yakınsaması, referans sinyali üzerinde bir <em>kalıcı uyarma</em> koşulu gerektirir — uyarlanır kontrolün iyi bilinen bir özelliği. Modern pekiştirmeli öğrenme kontrolcüleri tam olarak aynı dengeyle karşılaşır.</p>

<div class="l-note"><strong>Lyapunov'dan robustluk.</strong> Aynı reçete sınırlı bozucuları ele alır: $\\dot{x} = ax + u + w(t)$, $|w| \\le W$ ile. $K > W$ olacak şekilde $u = -\\hat{a} x - k x - K \\text{sgn}(x)$ seçin; süreksiz terim en kötü durum bozucusunu emer ve Lyapunov analizi geçerli olur. Bu, robotikte bozucu-bastırma kası nedeniyle sevilen kayma-modlu kontrolcüdür.</div>

<!-- ========================================================================
     BÖLÜM 10
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">10. AI Bağlantısı — Sinir Lyapunov Fonksiyonları</h2>

<div class="calc-highlight"><strong>Modern kıvrım:</strong> $V(X)$'i el ile tasarlamak yerine, verilerden bir Lyapunov fonksiyonunu <em>öğrenmek</em> için bir sinir ağı eğitin. Ağın parametreleri iki kayıp en aza indirilecek şekilde optimize edilir: $V_\\theta$ pozitif tanımlı ve $\\dot{V}_\\theta = \\nabla V_\\theta \\cdot f(X) < 0$ durum uzayında.</div>

<p class="l-text">Bu çalışma çizgisini iki etkili makale başlattı. Chang, Roohi ve Gao (2019, "Sinir Lyapunov Kontrolü") doğrusal olmayan sistemler için bir sinir kontrolcüsünü ve bir sinir Lyapunov fonksiyonunu birlikte eğitir, kararlılığı satisfiability-modulo-theories (SMT) çözücüsüyle sertifikalandırır. Boffi ve diğerleri (2021, "Verilerden Kararlılık Sertifikalarının Öğrenilmesi") Monte Carlo örnekleme ve PAC sınırları kullanarak olasılıksal garantiler verir.</p>

<div class="calc-formula"><div class="formula-label">SİNİR LYAPUNOV EĞİTİM KAYIPLARI</div><div class="formula-main">$$\\mathcal{L}_1 = \\max(0, -V_\\theta(X) + \\epsilon \\|X\\|^2), \\quad \\mathcal{L}_2 = \\max(0, \\nabla V_\\theta \\cdot f(X) + \\alpha \\|X\\|^2)$$</div><div class="formula-sub">Yalnızca $V \\le \\epsilon \\|X\\|^2$ (yetersiz pozitif) veya $\\dot{V} \\ge -\\alpha\\|X\\|^2$ (yetersiz negatif) olduğunda aktive olan menteşe kayıpları.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden $V$ öğrenelim?</div><div class="card-body">Karmaşık robotlar, droneler veya öğrenilmiş politikalar için kapalı form $V$ yoktur. Sinir ağları yeterli örnekle $V$'yi keyfi hassasiyetle yaklaşıklar.</div></div>
<div class="calc-card"><div class="card-title">Doğrulama</div><div class="card-body">Eğitimden sonra bir SMT çözücüsü (dReal, Marabou) Lyapunov koşullarının tüm bölge üzerinde geçerli olduğunu doğrular — sadece örneklenen noktalarda değil.</div></div>
<div class="calc-card"><div class="card-title">Çekim bölgesi</div><div class="card-body">Doğrulamanın başarılı olduğu en büyük alt seviye kümesi $\\{V_\\theta \\le c\\}$ öğrenilmiş politika için sertifikalı bir çekim havzasıdır.</div></div>
<div class="calc-card"><div class="card-title">Güvenli RL</div><div class="card-body">Sinir Lyapunov'u RL ile birleştirin: politika yalnızca öğrenilmiş $V$ geçerli kaldığı sürece güncellenir (Berkenkamp ve diğerleri 2017).</div></div>
</div>

<p class="l-text">Bu neden önemli? Öğrenilmiş politikalar (derin RL, taklit öğrenme, sinir dinamikleriyle model-tahminci kontrol) sertifikalandırması meşhur şekilde zordur. Standart kontrol-teorik garantileri bilinen dinamikleri varsayar; sinir Lyapunov yöntemleri bir sertifika doğrudan öğrenerek bunu atlatır. Sonuç hibrit bir boru hattıdır: derin RL ile bir kontrolcü eğit, sonra politikanın nicelleştirilmiş bir bölge içinde kararlılaştırıcı olduğunu kanıtlayan bir Lyapunov fonksiyonunu öğren veya doğrula.</p>

<div class="l-note"><strong>Sınır çalışması.</strong> Son makaleler (Dawson, Gao, Fan, 2023 anketi "Öğrenilmiş Sertifikalarla Güvenli Kontrol") çerçeveyi bariyer fonksiyonlarına (güvensiz kümeleri kaçın), girdiden-duruma kararlılığa (bozucuları ele al) ve büzme metriklerine (takip hatası sınırlarını garanti et) genişletir. Lyapunov teorisi ile modern AI güvenliği arasındaki derin bağ artık büyük bir araştırma damarıdır.</div>

<div id="plot-3d-lyap-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=40;var xs=[];var ys=[];var zs=[];
for(var i=0;i<N;i++){var row=[];for(var j=0;j<N;j++){var x=-3+6*j/(N-1);var y=-2+4*i/(N-1);if(i===0){xs.push(x);}if(j===0){ys.push(y);}row.push(0.5*y*y+(1-Math.cos(x)));}zs.push(row);}
var data=[{x:xs,y:ys,z:zs,type:"surface",colorscale:[[0,"#1e3a8a"],[0.5,"#3b82f6"],[1,"#dbeafe"]],showscale:false,opacity:0.92,contours:{z:{show:true,usecolormap:false,color:"rgba(255,255,255,0.25)",width:1.2}}}];
var layout={paper_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},scene:{xaxis:{title:"theta",gridcolor:"rgba(255,255,255,0.1)",zerolinecolor:"rgba(255,255,255,0.2)",backgroundcolor:"rgba(0,0,0,0)"},yaxis:{title:"theta_dot",gridcolor:"rgba(255,255,255,0.1)",zerolinecolor:"rgba(255,255,255,0.2)",backgroundcolor:"rgba(0,0,0,0)"},zaxis:{title:"V(theta, theta_dot)",gridcolor:"rgba(255,255,255,0.1)",zerolinecolor:"rgba(255,255,255,0.2)",backgroundcolor:"rgba(0,0,0,0)"},bgcolor:"rgba(0,0,0,0)",camera:{eye:{x:1.5,y:-1.5,z:1.1}}},margin:{t:30,r:0,b:0,l:0}};
Plotly.newPlot("plot-3d-lyap-tr",data,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Sarkaç Lyapunov fonksiyonu $V(\\theta, \\dot\\theta) = (1/2)\\dot\\theta^2 + (1 - \\cos\\theta)$ 3B yüzey olarak. Çanak şekli, sönümlü sarkacın kararlı olmasının geometrik nedenidir — yörüngeler $\\theta = 0, \\dot\\theta = 0$'daki havzaya doğru kayar. $\\theta = \\pm\\pi$'deki tepeler sarkacın kararsız üst dengeleridir.</div></div>

<!-- ========================================================================
     BÖLÜM 11
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">11. Pyodide Laboratuvarı — Lyapunov ile Sarkaç Kararlılığı</h2>

<p class="l-text">Bu laboratuvar sönümlü sarkaç için tam Lyapunov boru hattını gezdirir. $V(X)$'i tanımlayacak, SymPy ile $\\dot{V}$'yi sembolik olarak hesaplayacak, koşulları doğrulayacak, sistemi birkaç başlangıç koşulundan simüle edecek, her yörünge boyunca $V(t)$'yi çizecek ve monoton azalmayı onaylayacaksınız. İkinci bölüm <em>yanlış</em> bir Lyapunov adayıyla denemenizi ve testin nasıl başarısız olduğunu görmenizi ister.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · SÖNÜMLÜ SARKAÇ İÇİN LYAPUNOV KOŞULLARI</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.integrate <span class="kw">import</span> solve_ivp

<span class="cm"># --- Sönümlü sarkaç dinamiği ----------------------------------------</span>
b = <span class="num">0.3</span>    <span class="cm"># sürtünme katsayısı</span>
<span class="kw">def</span> <span class="fn">pendulum</span>(t, X):
    th, w = X
    <span class="kw">return</span> [w, -b*w - np.<span class="fn">sin</span>(th)]

<span class="cm"># --- Aday Lyapunov fonksiyonu V = (1/2)w^2 + (1 - cos(theta)) ------</span>
<span class="kw">def</span> <span class="fn">V</span>(X):
    th, w = X
    <span class="kw">return</span> <span class="num">0.5</span>*w**<span class="num">2</span> + (<span class="num">1</span> - np.<span class="fn">cos</span>(th))

<span class="cm"># --- Analitik Vdot = -b*w^2 -----------------------------------------</span>
<span class="kw">def</span> <span class="fn">Vdot</span>(X):
    th, w = X
    <span class="kw">return</span> -b * w**<span class="num">2</span>

<span class="cm"># --- Izgarada pozitif tanımlılığı kontrol et ------------------------</span>
g = np.<span class="fn">linspace</span>(-np.pi+<span class="num">0.01</span>, np.pi-<span class="num">0.01</span>, <span class="num">50</span>)
Vmin, Vmax = np.<span class="fn">inf</span>, -np.<span class="fn">inf</span>
<span class="kw">for</span> th <span class="kw">in</span> g:
    <span class="kw">for</span> w <span class="kw">in</span> g:
        <span class="kw">if</span> th == <span class="num">0</span> <span class="kw">and</span> w == <span class="num">0</span>: <span class="kw">continue</span>
        v = <span class="fn">V</span>([th, w])
        Vmin = <span class="fn">min</span>(Vmin, v)
        Vmax = <span class="fn">max</span>(Vmax, v)
<span class="fn">print</span>(<span class="str">f"V(0,0) = {V([0,0]):.4f}  (0 olmalı)"</span>)
<span class="fn">print</span>(<span class="str">f"Izgarada min V (orijin hariç) = {Vmin:.4f}  (&gt; 0 olmalı)"</span>)
<span class="fn">print</span>(<span class="str">f"Izgarada max V = {Vmax:.4f}"</span>)

<span class="cm"># --- Birkaç başlangıç koşulundan simüle et --------------------------</span>
t_span = (<span class="num">0</span>, <span class="num">20</span>)
t_eval = np.<span class="fn">linspace</span>(*t_span, <span class="num">500</span>)
<span class="kw">for</span> X0 <span class="kw">in</span> [[<span class="num">1.0</span>, <span class="num">0</span>], [<span class="num">2.0</span>, <span class="num">0</span>], [<span class="num">0.5</span>, <span class="num">1.5</span>], [-<span class="num">1.8</span>, <span class="num">0.5</span>]]:
    sol = <span class="fn">solve_ivp</span>(pendulum, t_span, X0, t_eval=t_eval, rtol=<span class="num">1e-8</span>)
    V_traj = [<span class="fn">V</span>(sol.y[:, i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(t_eval))]
    Vdot_traj = [<span class="fn">Vdot</span>(sol.y[:, i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(t_eval))]
    monoton = <span class="fn">all</span>(V_traj[i+<span class="num">1</span>] &lt;= V_traj[i] + <span class="num">1e-9</span> <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(V_traj)-<span class="num">1</span>))
    <span class="fn">print</span>(<span class="str">f"X0={X0}: V_baslangic={V_traj[0]:.4f}, V_son={V_traj[-1]:.6f}, monoton azalma: {monoton}"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON · YANLIŞ LYAPUNOV ADAYI</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># --- Kötü aday: V_kotu = (1/2)*theta^2 + (1/2)*omega^2 -------------</span>
<span class="cm"># --- (her yerde kuadratik, doğrusalsızlığın farkında değil) --------</span>
<span class="kw">def</span> <span class="fn">V_kotu</span>(X):
    th, w = X
    <span class="kw">return</span> <span class="num">0.5</span>*th**<span class="num">2</span> + <span class="num">0.5</span>*w**<span class="num">2</span>

<span class="kw">def</span> <span class="fn">Vdot_kotu</span>(X):
    th, w = X
    <span class="cm"># dV_kotu/dt = theta*w + w*(-b*w - sin(theta)) = theta*w - b*w^2 - w*sin(theta)</span>
    <span class="kw">return</span> th*w - b*w**<span class="num">2</span> - w*np.<span class="fn">sin</span>(th)

<span class="cm"># Izgarada işaret testi ----------------------------------------------</span>
en_kotu = -np.<span class="fn">inf</span>
en_kotu_pt = <span class="kw">None</span>
<span class="kw">for</span> th <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">1.5</span>, <span class="num">1.5</span>, <span class="num">60</span>):
    <span class="kw">for</span> w <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">1.5</span>, <span class="num">1.5</span>, <span class="num">60</span>):
        v = <span class="fn">Vdot_kotu</span>([th, w])
        <span class="kw">if</span> v &gt; en_kotu:
            en_kotu = v
            en_kotu_pt = (th, w)
<span class="fn">print</span>(<span class="str">f"En kötü Vdot_kotu değeri: {en_kotu:.4f}, (theta, omega) = {en_kotu_pt}"</span>)
<span class="kw">if</span> en_kotu &gt; <span class="num">0</span>:
    <span class="fn">print</span>(<span class="str">"  -> V_kotu başarısız: bir yerde dV/dt > 0. Lyapunov fonksiyonu DEĞİL!"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">"  -> V_kotu bu ızgarada işaret testini geçiyor."</span>)

<span class="cm"># Doğrulama: simüle et ve V_kotu'nun yukarı-aşağı salındığını izle --</span>
sol = <span class="fn">solve_ivp</span>(pendulum, (<span class="num">0</span>,<span class="num">15</span>), [<span class="num">2.5</span>, <span class="num">0</span>], t_eval=np.<span class="fn">linspace</span>(<span class="num">0</span>,<span class="num">15</span>,<span class="num">300</span>))
Vb = np.<span class="fn">array</span>([<span class="fn">V_kotu</span>(sol.y[:,i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">300</span>)])
diffs = np.<span class="fn">diff</span>(Vb)
n_artis = <span class="fn">int</span>(np.<span class="fn">sum</span>(diffs &gt; <span class="num">0</span>))
<span class="fn">print</span>(<span class="str">f"(2.5,0)'dan yörünge boyunca: V_kotu {n_artis}/{299} adımda arttı"</span>)
<span class="fn">print</span>(<span class="str">"(monoton azalma 0 verirdi — V_kotu geçerli Lyapunov fonksiyonu değil)"</span>)</code></pre></div>

<div id="plot-comparison-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
function pen(s,b){return[s[1],-b*s[1]-Math.sin(s[0])];}
function rk4(s,h,b){var k1=pen(s,b);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=pen(s2,b);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=pen(s3,b);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=pen(s4,b);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var s1=[1.8,0];var s2=[1.8,0];var t1=[];var v1=[];var v2=[];
for(var i=0;i<1500;i++){var t=i*0.02;t1.push(t);v1.push(0.5*s1[1]*s1[1]+(1-Math.cos(s1[0])));v2.push(0.5*s2[1]*s2[1]+(1-Math.cos(s2[0])));s1=rk4(s1,0.02,0);s2=rk4(s2,0.02,0.35);}
var tr1={x:t1,y:v1,mode:"lines",name:"sönümsüz (b=0): V sabit",line:{color:"#f87171",width:2.5}};
var tr2={x:t1,y:v2,mode:"lines",name:"sönümlü (b=0.35): V azalır",line:{color:"#3b82f6",width:2.5}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"zaman t"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"V (enerji)"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.12,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-comparison-tr",[tr1,tr2],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Aynı başlangıç koşulundan başlayan iki yörünge boyunca $V$ Lyapunov fonksiyonu. Kırmızı (sönümsüz, $b = 0$) tam olarak korunur — $\\dot{V} = 0$ — sarkacın Lyapunov anlamında kararlı ama asimptotik kararlı olmadığını onaylar. Mavi (sönümlü, $b = 0.35$) monoton olarak sıfıra azalır, LaSalle ile birleştirilen Lyapunov doğrudan yöntemiyle kanıtlanan asimptotik kararlılığın yanılgısız imzasıdır.</div></div>

<div class="think-box"><div class="think-label">BUNU DÜŞÜN</div><div class="think-body">Aday $V$'yi $V(\\theta, \\dot\\theta) = (1/2)\\dot\\theta^2 + \\theta^2$ ile değiştirmeyi deneyin (kuadratik bir $1 - \\cos\\theta$ ikamesi). $\\dot{V}$'yi sembolik olarak hesaplayın ve pozitif olduğu bir durum bulun. Lyapunov testi başarısız olur — ama sistem hala asimptotik kararlıdır. Ders: $V$'yi bulamamak kararsızlık demek değildir. Sadece daha iyi bir $V$ denemek gerekir.</div></div>

<p class="l-text">Bir sonraki derste zaman alanını tamamen geride bırakıp frekans alanı kararlılığıyla — Bode çizimleri, Nyquist kriteri, kazanç ve faz marjları — tanışıyoruz. Burada geliştirilen Lyapunov mekanizması, klasik frekans tekniklerinin sessizce dayandığı temeldir; her marj pozitif olduğunda örtük bir Lyapunov fonksiyonu çevrimi sertifikalandırır. Modern robust kontrol (H-sonsuz, mu-sentez) bağlantıyı açık ve hesaplanabilir hale getirir.</p>
`
};
