window.DIFFEQ_L4 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text">In the first three lessons of this track every unknown was a function of <em>one</em> variable: position $y(t)$ versus time, current $I(t)$ in a circuit, the population $N(t)$ of bacteria in a flask. Real physics is rarely that polite. Heat sits in a metal rod and depends on <em>both</em> where you measure it and when. A guitar string vibrates: each point on the string has its own displacement at every instant. The electric potential inside a parallel plate capacitor depends on two spatial coordinates at once. The moment more than one independent variable enters the picture, ordinary differential equations are no longer sufficient. We need partial differential equations.</p>

<p class="l-text">A partial differential equation, or <strong>PDE</strong> for short, is a relation between an unknown multivariable function and its partial derivatives. The mathematics is roomier and richer than the ODE world: solutions live in function spaces with infinite-dimensional structure, boundary conditions can change the answer completely, and the same equation can describe wildly different phenomena depending on which variables are treated as space and which as time. This lesson is your first careful walk through that world. We focus on the three canonical second-order linear PDEs that every engineer and physicist meets sooner or later: the <strong>heat equation</strong>, the <strong>wave equation</strong>, and <strong>Laplace's equation</strong>. They are the parabolic, hyperbolic, and elliptic faces of the same mathematical building.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read PDE notation $u_x$, $u_{xx}$, $u_t$, $u_{tt}$ fluently and identify the order of a PDE</li>
<li>Classify a second-order linear PDE as parabolic, hyperbolic, or elliptic using its discriminant</li>
<li>State the physical meaning of the heat, wave, and Laplace equations and the conserved quantities behind them</li>
<li>Pose Dirichlet, Neumann, and Robin boundary conditions and check that a PDE problem is well-posed</li>
<li>Apply <strong>separation of variables</strong> to derive series solutions of the heat equation on a finite rod and the vibrating string</li>
<li>Use d'Alembert's formula to write down the solution of the wave equation on the infinite line</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a PDE?</h2>

<p class="l-text">Let $u(x, t)$ be a function of two independent variables. The partial derivative with respect to $x$, holding $t$ fixed, is</p>

<div class="calc-formula"><div class="formula-label">PARTIAL DERIVATIVE NOTATION</div><div class="formula-main">$$\\frac{\\partial u}{\\partial x} \\;\\equiv\\; u_x, \\qquad \\frac{\\partial u}{\\partial t} \\;\\equiv\\; u_t, \\qquad \\frac{\\partial^2 u}{\\partial x^2} \\;\\equiv\\; u_{xx}, \\qquad \\frac{\\partial^2 u}{\\partial x \\,\\partial t} \\;\\equiv\\; u_{xt}$$</div><div class="formula-sub">The subscript form is the working notation of every PDE textbook. It saves space and makes the structure of long equations visible at a glance.</div></div>

<p class="l-text">A <strong>partial differential equation</strong> is any equation that involves an unknown function of several variables together with one or more of its partial derivatives. The <strong>order</strong> of the equation is the order of the highest derivative that appears. A first-order example is</p>

<div class="calc-formula"><div class="formula-label">FIRST-ORDER TRANSPORT EQUATION</div><div class="formula-main">$$u_t + c\\, u_x \\;=\\; 0$$</div><div class="formula-sub">It says that anything you can write as $u(x, t) = f(x - c t)$, that is, an arbitrary initial profile rigidly translated to the right at speed $c$, is a solution. Pure advection, no spreading.</div></div>

<p class="l-text">Most of this lesson is about <strong>second-order</strong> PDEs, because the second derivative is what physics generally writes down: Newton's law equates a second time-derivative to a force, Fourier's heat law equates a first time-derivative to a second space-derivative, Laplace describes equilibrium and equilibrium is governed by second derivatives.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Linear PDE</div><div class="card-body">The unknown $u$ and all its derivatives appear to the first power and are not multiplied together. Coefficients may depend on $x$ and $t$ but not on $u$. All three canonical PDEs in this lesson are linear.</div></div>
<div class="calc-card"><div class="card-title">Nonlinear PDE</div><div class="card-body">Products such as $u\\, u_x$ (Burgers' equation), powers like $u^2$ (porous media), or transcendental dependence on $u$ are allowed. Solutions can develop shocks and blow-ups that linear PDEs forbid.</div></div>
<div class="calc-card"><div class="card-title">Homogeneous</div><div class="card-body">The right-hand side is zero. Linear combinations of solutions are again solutions &mdash; the <em>superposition principle</em> that makes separation of variables possible.</div></div>
<div class="calc-card"><div class="card-title">Inhomogeneous</div><div class="card-body">A forcing term such as a source of heat or an external driving force sits on the right. Solved by finding one particular solution and adding the general homogeneous solution, just as for ODEs.</div></div>
</div>

<div class="l-note"><strong>Why linearity matters so much.</strong> If $u_1$ and $u_2$ both solve a linear homogeneous PDE then so does $\\alpha u_1 + \\beta u_2$ for any constants $\\alpha, \\beta$. We are about to build entire solutions as infinite sums of simple building blocks. That construction only works because linearity lets us add solutions without breaking the equation.</div>

<h2 class="lesson-title">2. The Three Canonical Second-Order Linear PDEs</h2>

<p class="l-text">The general second-order linear PDE in two variables has the form</p>

<div class="calc-formula"><div class="formula-label">GENERAL SECOND-ORDER LINEAR PDE</div><div class="formula-main">$$A\\, u_{xx} + 2B\\, u_{xt} + C\\, u_{tt} + D\\, u_x + E\\, u_t + F\\, u \\;=\\; G$$</div><div class="formula-sub">The coefficients $A, B, C, \\ldots, G$ may depend on $x$ and $t$. The <em>type</em> of the equation is decided entirely by the top three coefficients $A$, $B$, $C$.</div></div>

<p class="l-text">The classification is borrowed from conic sections: think of $A x^2 + 2 B x t + C t^2$ as a quadratic form. Its discriminant decides whether you are looking at a parabola, a hyperbola, or an ellipse.</p>

<div class="calc-formula"><div class="formula-label">CLASSIFICATION BY DISCRIMINANT</div><div class="formula-main">$$\\Delta \\;=\\; B^2 - A C$$ $$\\Delta > 0 \\Rightarrow \\text{hyperbolic}, \\qquad \\Delta = 0 \\Rightarrow \\text{parabolic}, \\qquad \\Delta < 0 \\Rightarrow \\text{elliptic}.$$</div><div class="formula-sub">The same algebraic test that distinguishes conics distinguishes the three families of PDEs.</div></div>

<p class="l-text">Each class has a canonical representative that physics writes down all the time:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HEAT &mdash; PARABOLIC</div><div class="compare-item">$u_t \\;=\\; \\alpha^2\\, u_{xx}$</div><div class="compare-item">$A = \\alpha^2,\\; B = 0,\\; C = 0 \\Rightarrow \\Delta = 0$</div><div class="compare-item">Diffusion of temperature, concentration, probability density.</div><div class="compare-item">One time derivative, two space derivatives. <strong>Smooths</strong> the initial profile.</div></div><div class="compare-col"><div class="compare-title">WAVE &mdash; HYPERBOLIC</div><div class="compare-item">$u_{tt} \\;=\\; c^2\\, u_{xx}$</div><div class="compare-item">$A = c^2,\\; B = 0,\\; C = -1 \\Rightarrow \\Delta = c^2 > 0$</div><div class="compare-item">Vibrating strings, sound, light, water waves.</div><div class="compare-item">Two time derivatives, two space derivatives. <strong>Propagates</strong> signals at finite speed.</div></div></div>

<div class="calc-formula"><div class="formula-label">LAPLACE &mdash; ELLIPTIC</div><div class="formula-main">$$u_{xx} + u_{yy} \\;=\\; 0$$</div><div class="formula-sub">$A = 1,\\; B = 0,\\; C = 1 \\Rightarrow \\Delta = -1 < 0$. Steady-state temperature, electric potential in a charge-free region, incompressible inviscid flow potential. No time variable: this is the equation of equilibrium.</div></div>

<div class="l-note"><strong>Closely related cousins.</strong> Replace the zero on the right of Laplace by a given function $f(x, y)$ to get <strong>Poisson's equation</strong> $u_{xx} + u_{yy} = -f$ (electric potential from a charge distribution). Replace $u_t$ in the heat equation by $i u_t$ and you have the <strong>Schrödinger equation</strong> of quantum mechanics. Each of these inherits its classification from its template, and most of the tools you build for the canonical three transfer almost unchanged.</div>

<div class="calc-example"><div class="example-label">A QUICK CLASSIFICATION DRILL</div><div class="example-body"><strong>Equation:</strong> $u_{xx} + 4\\, u_{xt} + 3\\, u_{tt} = 0$. Here $A = 1$, $B = 2$, $C = 3$, so $\\Delta = 4 - 3 = 1 > 0$. Hyperbolic. We expect wave-like solutions propagating along two distinct families of characteristics.<br><br><strong>Equation:</strong> $u_{tt} - 2 u_{xt} + u_{xx} = 0$. Here $A = 1$, $B = -1$, $C = 1$, so $\\Delta = 1 - 1 = 0$. Parabolic. The two characteristic families have collapsed into one.<br><br><strong>Equation:</strong> $u_{xx} + 2 u_{xy} + 5 u_{yy} = 0$. Here $A = 1$, $B = 1$, $C = 5$, so $\\Delta = 1 - 5 = -4 < 0$. Elliptic. Pure equilibrium, no characteristics in the real plane.</div></div>

<h2 class="lesson-title">3. Why These Three? Physical Meaning</h2>

<p class="l-text">The three classes are not abstract bookkeeping. They correspond to three fundamentally different behaviours of nature.</p>

<p class="l-text"><strong>Parabolic equations smooth.</strong> The heat equation $u_t = \\alpha^2 u_{xx}$ describes irreversible diffusive processes: sharp features decay, the system relaxes toward a uniform state. Information is lost as time moves forward; you cannot in general run the equation backward and recover the initial condition. High-frequency content dies exponentially fast, low-frequency content lingers. Probabilistically, the same equation governs the spread of a probability density under Brownian motion.</p>

<p class="l-text"><strong>Hyperbolic equations propagate.</strong> The wave equation $u_{tt} = c^2 u_{xx}$ has time-reversal symmetry. Energy is conserved exactly. A disturbance travels at the finite speed $c$ and carries its full information along with it: a ripple on a long string passes a fixed observer without losing its shape. Two characteristic lines $x - ct = \\text{const}$ and $x + ct = \\text{const}$ at every point split spacetime into a past and a future cone of influence.</p>

<p class="l-text"><strong>Elliptic equations equilibrate.</strong> Laplace's equation $u_{xx} + u_{yy} = 0$ has no time variable. It describes states of perfect balance: the temperature distribution of a metal plate whose edges are held at fixed values, the electrostatic potential inside an empty cavity, the velocity potential of an incompressible irrotational flow. There are no characteristic directions, no propagation, no decay; only equilibrium.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Parabolic &rarr; dissipative</div><div class="card-body">Energy is not conserved. The equation has an arrow of time. The solution gets smoother as $t$ increases &mdash; any initial roughness is forgotten exponentially fast.</div></div>
<div class="calc-card"><div class="card-title">Hyperbolic &rarr; oscillatory</div><div class="card-body">Energy is conserved. The equation is time-reversible. Sharp features are preserved and propagate at a finite speed $c$ along characteristics.</div></div>
<div class="calc-card"><div class="card-title">Elliptic &rarr; equilibrium</div><div class="card-body">Time has dropped out. The solution at any point is essentially an average over the surrounding values (the mean-value property). The boundary alone determines everything.</div></div>
</div>

<div id="plot-l4-trio-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var L=Math.PI;var N=200;var xs=[];for(var i=0;i<N;i++){xs.push(i*L/(N-1));}
var heat=[];var wave=[];var lap=[];
for(var i=0;i<N;i++){var x=xs[i];
  heat.push(Math.exp(-0.05*Math.PI*Math.PI)*Math.sin(x)+0.3*Math.exp(-9*0.05*Math.PI*Math.PI)*Math.sin(3*x));
  wave.push(Math.cos(0.6*Math.PI)*Math.sin(x)+0.3*Math.cos(3*0.6*Math.PI)*Math.sin(3*x));
  lap.push(Math.sin(x));}
var d1={x:xs,y:heat,mode:'lines',name:'parabolic (heat) — decay',line:{color:'#3b82f6',width:2.5}};
var d2={x:xs,y:wave,mode:'lines',name:'hyperbolic (wave) — oscillate',line:{color:'#f59e0b',width:2.5}};
var d3={x:xs,y:lap,mode:'lines',name:'elliptic (Laplace) — equilibrium',line:{color:'#10b981',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'u(x, t fixed)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.5,1.5]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-trio-en',[d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the same two-mode initial profile $\\sin x + 0.3\\,\\sin 3x$ evolved a little under each canonical equation. Parabolic (blue) has already lost the high-frequency wiggle &mdash; the third harmonic decayed nine times faster than the first. Hyperbolic (orange) still has both modes, only their phases have shifted. Elliptic (green) is the equilibrium profile itself, frozen in time. Three equations, three personalities.</div></div>

<div class="l-note"><strong>Characteristic curves intuition.</strong> For a hyperbolic equation a small disturbance at a point spreads along two real characteristic lines. For a parabolic equation the characteristics degenerate to one family, and disturbances spread instantaneously but with rapidly decaying amplitude (infinite propagation speed in the formal sense). For an elliptic equation the characteristics are complex, meaning there is no real direction along which information travels &mdash; the value at every interior point is influenced by the entire boundary at once.</div>

<h2 class="lesson-title">4. Initial and Boundary Conditions</h2>

<p class="l-text">A PDE on its own is incomplete. It tells you how the function changes locally, but to pick out a single physical solution you must say what happens at the start of time and at the edges of space. The conditions you tack on are not a footnote; they are half the problem.</p>

<p class="l-text"><strong>Initial conditions</strong> describe the state of the system at $t = 0$. The heat equation, being first-order in time, needs one initial condition: the temperature profile $u(x, 0) = f(x)$. The wave equation, being second-order in time, needs two: the initial shape $u(x, 0) = f(x)$ and the initial velocity $u_t(x, 0) = g(x)$. Laplace has no time variable, hence no initial condition at all.</p>

<p class="l-text"><strong>Boundary conditions</strong> describe what happens at the spatial edges of the domain. Three named types cover almost every physical situation.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dirichlet &mdash; value prescribed</div><div class="card-body">$u$ itself is specified on the boundary. Example: the two ends of a metal rod are clamped to a heat sink at $0^\\circ \\text{C}$, so $u(0, t) = u(L, t) = 0$. Named after Peter Dirichlet, who introduced them in his 1829 paper on Fourier series.</div></div>
<div class="calc-card"><div class="card-title">Neumann &mdash; flux prescribed</div><div class="card-body">The normal derivative $u_x$ is specified. Example: the rod ends are <em>insulated</em>, no heat can escape, so $u_x(0, t) = u_x(L, t) = 0$. Named after Carl Neumann.</div></div>
<div class="calc-card"><div class="card-title">Robin &mdash; mixed</div><div class="card-body">A linear combination such as $a\\, u + b\\, u_x = c$ on the boundary. Example: Newton's law of cooling, $u_x = -h\\, (u - u_{\\text{ambient}})$. Combines value and flux, hence "mixed".</div></div>
<div class="calc-card"><div class="card-title">Periodic</div><div class="card-body">$u(0, t) = u(L, t)$ and $u_x(0, t) = u_x(L, t)$. Used for problems on a ring, or as a clean theoretical setting that automatically permits a Fourier series.</div></div>
</div>

<div class="calc-highlight"><strong>Well-posedness (Hadamard, 1902).</strong> A PDE problem is called well-posed if and only if it satisfies three conditions: (1) a solution <em>exists</em>; (2) the solution is <em>unique</em>; (3) the solution depends <em>continuously</em> on the data (initial profile, boundary values, source terms). The first two are obvious; the third is subtle and crucial. A tiny change in the input should produce only a tiny change in the output, otherwise the problem cannot be trusted as a physical model and certainly cannot be simulated reliably on a computer.</div>

<p class="l-text"><strong>An instructive failure of well-posedness:</strong> the heat equation run <em>backward</em> in time. The problem $u_t = -\\alpha^2 u_{xx}$ is ill-posed in the Hadamard sense. Tiny noise in the data is amplified exponentially. This is precisely why you cannot in general reconstruct yesterday's exact temperature distribution from today's measurements, even with perfect equations. Forward in time the equation is a thermostat; backward in time it is a magnifying glass for measurement error.</p>

<h2 class="lesson-title">5. Heat Equation on a Rod: Separation of Variables</h2>

<p class="l-text">Now we get to the workhorse technique that unlocks all three canonical equations. Consider the heat equation on a rod of length $L$ whose ends are held at zero temperature:</p>

<div class="calc-formula"><div class="formula-label">HEAT ON A FINITE ROD WITH DIRICHLET BCs</div><div class="formula-main">$$u_t \\;=\\; \\alpha^2\\, u_{xx}, \\qquad 0 < x < L, \\quad t > 0$$ $$u(0, t) \\;=\\; u(L, t) \\;=\\; 0, \\qquad u(x, 0) \\;=\\; f(x)$$</div><div class="formula-sub">A rod of length $L$, both ends in an ice bath at $0^\\circ$, started with the temperature profile $f(x)$. Find $u(x, t)$.</div></div>

<p class="l-text">The key idea, due to Daniel Bernoulli around 1750 and pushed through by Fourier in 1822, is to <strong>look for product solutions</strong> of the form</p>

<div class="calc-formula"><div class="formula-label">SEPARATION ANSATZ</div><div class="formula-main">$$u(x, t) \\;=\\; X(x)\\, T(t)$$</div><div class="formula-sub">An optimistic guess: write the unknown as a product of a function of $x$ alone and a function of $t$ alone. We will pay for this guess later by summing many such products.</div></div>

<p class="l-text">Substitute into the heat equation. Using $u_t = X(x)\\, T'(t)$ and $u_{xx} = X''(x)\\, T(t)$:</p>

<div class="calc-formula"><div class="formula-label">THE SEPARATION</div><div class="formula-main">$$X(x)\\, T'(t) \\;=\\; \\alpha^2\\, X''(x)\\, T(t) \\qquad\\Longrightarrow\\qquad \\frac{T'(t)}{\\alpha^2\\, T(t)} \\;=\\; \\frac{X''(x)}{X(x)}$$</div><div class="formula-sub">Divide by $\\alpha^2 X T$. The left side depends only on $t$; the right side depends only on $x$. They are equal, so both must be the <em>same constant</em>.</div></div>

<p class="l-text">Call that separation constant $-\\lambda$ (the minus sign is conventional; we will see why it must be negative in a moment). Two ordinary differential equations fall out:</p>

<div class="calc-formula"><div class="formula-label">THE TWO ODEs</div><div class="formula-main">$$X''(x) + \\lambda\\, X(x) \\;=\\; 0, \\qquad T'(t) + \\alpha^2 \\lambda\\, T(t) \\;=\\; 0$$</div><div class="formula-sub">A boundary-value problem for $X$ in space, an initial-value problem for $T$ in time. Linked by the single shared eigenvalue $\\lambda$.</div></div>

<p class="l-text"><strong>Solve the spatial problem with the boundary conditions.</strong> The Dirichlet conditions $u(0, t) = u(L, t) = 0$ at both ends translate into $X(0) = X(L) = 0$. The equation $X'' + \\lambda X = 0$ together with these conditions is the prototypical <em>eigenvalue problem</em>.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Try $\\lambda < 0$, say $\\lambda = -\\mu^2$</div><div class="step-detail">Then $X'' = \\mu^2 X$, with general solution $X(x) = A e^{\\mu x} + B e^{-\\mu x}$. The boundary conditions $X(0) = X(L) = 0$ force $A = B = 0$. Only the trivial solution. <strong>Reject.</strong></div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Try $\\lambda = 0$</div><div class="step-detail">Then $X'' = 0$ gives $X(x) = A x + B$. The boundary conditions again force $A = B = 0$. <strong>Reject.</strong></div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Try $\\lambda > 0$, say $\\lambda = \\mu^2$</div><div class="step-detail">Then $X'' + \\mu^2 X = 0$ gives $X(x) = A \\cos(\\mu x) + B \\sin(\\mu x)$. The condition $X(0) = 0$ kills the cosine: $A = 0$. The condition $X(L) = B \\sin(\\mu L) = 0$ allows a non-trivial $B$ only when $\\sin(\\mu L) = 0$, i.e. $\\mu L = n \\pi$ for integer $n \\geq 1$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Eigenvalues and eigenfunctions</div><div class="step-detail">$\\lambda_n = (n\\pi / L)^2$ for $n = 1, 2, 3, \\ldots$, with corresponding eigenfunctions $X_n(x) = \\sin(n\\pi x / L)$. These are exactly the modes a Fourier sine series builds with.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Solve the time ODE for each eigenvalue</div><div class="step-detail">$T_n'(t) = -\\alpha^2 \\lambda_n\\, T_n(t)$ gives $T_n(t) = T_n(0)\\, e^{-\\alpha^2 \\lambda_n t} = T_n(0)\\, e^{-\\alpha^2 (n\\pi/L)^2 t}$. Pure exponential decay; higher modes decay much faster.</div></div></div>
</div>

<p class="l-text">Each product $X_n(x) T_n(t)$ already solves the PDE and the boundary conditions. Linearity lets us superpose. The general solution is</p>

<div class="calc-formula"><div class="formula-label">HEAT EQUATION SERIES SOLUTION</div><div class="formula-main">$$u(x, t) \\;=\\; \\sum_{n=1}^{\\infty} B_n\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\exp\\!\\left[-\\alpha^2\\!\\left(\\frac{n\\pi}{L}\\right)^{\\!2}\\! t\\right]$$</div><div class="formula-sub">An infinite linear combination of standing sinusoidal modes, each weighted by a coefficient $B_n$ and damped at its own rate.</div></div>

<p class="l-text"><strong>Fixing the coefficients from the initial condition.</strong> At $t = 0$ the exponential factors are all 1, so</p>

<div class="calc-formula"><div class="formula-label">FOURIER SINE COEFFICIENTS</div><div class="formula-main">$$f(x) \\;=\\; \\sum_{n=1}^{\\infty} B_n\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\quad\\Longrightarrow\\quad B_n \\;=\\; \\frac{2}{L}\\int_0^L f(x)\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx$$</div><div class="formula-sub">Exactly the Fourier sine series coefficients you met in the Fourier track, Lesson 2. The PDE has reduced to a Fourier problem.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE: ROD STARTED AT UNIFORM TEMPERATURE</div><div class="example-body"><strong>Setup.</strong> A rod of length $L = \\pi$ with $\\alpha = 1$, ends held at $0^\\circ$, initial profile $f(x) = T_0$ (uniform, say $T_0 = 100^\\circ$).<br><br><strong>Fourier sine coefficients of a constant:</strong> $B_n = (2/\\pi)\\int_0^{\\pi} T_0\\, \\sin(n x)\\, dx = (2 T_0 / \\pi)\\bigl[1 - \\cos(n\\pi)\\bigr]/n$, which equals $4 T_0 / (n\\pi)$ for odd $n$ and $0$ for even $n$.<br><br><strong>Solution.</strong><br>$u(x, t) = (4 T_0 / \\pi)\\bigl[\\sin x \\cdot e^{-t} + (1/3) \\sin 3x \\cdot e^{-9 t} + (1/5) \\sin 5x \\cdot e^{-25 t} + \\cdots\\bigr]$.<br><br>The first mode decays with time constant $1$, the third mode with time constant $1/9$, the fifth with $1/25$. After a short time the high harmonics are gone and the rod looks like a single sine wave gently sinking toward zero.</div></div>

<div id="plot-l4-heat-evolve-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var L=Math.PI;var Nx=80;var Nt=60;var xs=[];var ts=[];var z=[];
for(var i=0;i<Nx;i++){xs.push(i*L/(Nx-1));}
for(var j=0;j<Nt;j++){ts.push(j*0.5/(Nt-1));}
for(var j=0;j<Nt;j++){var row=[];var t=ts[j];
  for(var i=0;i<Nx;i++){var x=xs[i];var u=0;
    for(var k=1;k<=15;k+=2){u+=(4*100/(k*Math.PI))*Math.sin(k*x)*Math.exp(-k*k*t);}
    row.push(u);}
  z.push(row);}
var d1={x:xs,y:ts,z:z,type:'heatmap',colorscale:[[0,'#0c1024'],[0.3,'#1d4ed8'],[0.6,'#3b82f6'],[0.85,'#fbbf24'],[1,'#fef3c7']],colorbar:{title:'u'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'position x',gridcolor:'#1f2937'},yaxis:{title:'time t',gridcolor:'#1f2937'},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-heat-evolve-en',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the temperature $u(x, t)$ as a heatmap for the rod started at uniform $T_0 = 100^\\circ$ with both ends clamped at zero. Position is horizontal, time grows upward. The bright yellow band at the bottom is the initial uniform temperature; the sharp corners at $x = 0$ and $x = L$ where the rod meets the ice bath instantly create a flux that drains heat. As time advances the profile smooths and shrinks; by the top of the plot only the fundamental sine mode remains, decaying gently.</div></div>

<div id="plot-l4-heat-snapshots-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var L=Math.PI;var Nx=200;var xs=[];for(var i=0;i<Nx;i++){xs.push(i*L/(Nx-1));}
var snaps=[0.0,0.02,0.1,0.3,0.8];var colors=['#fef3c7','#fbbf24','#f59e0b','#3b82f6','#1e3a8a'];var traces=[];
for(var s=0;s<snaps.length;s++){var t=snaps[s];var u=[];
  for(var i=0;i<Nx;i++){var x=xs[i];var v=0;
    for(var k=1;k<=25;k+=2){v+=(4*100/(k*Math.PI))*Math.sin(k*x)*Math.exp(-k*k*t);}
    u.push(v);}
  traces.push({x:xs,y:u,mode:'lines',name:'t = '+t.toFixed(2),line:{color:colors[s],width:2.5}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'u(x, t)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-heat-snapshots-en',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> snapshots of $u(x, t)$ at five times. At $t = 0$ the profile is nearly the flat $100^\\circ$ line, with Gibbs ripples at the endpoints from truncating the Fourier sum. Almost immediately the high harmonics decay (compare the wiggly $t = 0$ trace with the smooth $t = 0.02$ trace), and the profile becomes a clean half-sine bump. As $t$ grows further the bump just shrinks in amplitude. The shape is asymptotically $\\sin(\\pi x / L)$ &mdash; the slowest-decaying mode dominates everything else in the long run.</div></div>

<div class="think-box"><div class="think-label">THE BIG LESSON</div><div class="think-body">Separation of variables turned a partial differential equation into two ordinary differential equations linked by a shared eigenvalue. The boundary conditions selected a discrete set of admissible eigenvalues, the eigenfunctions formed an orthogonal basis on which the initial condition could be expanded, and the result was a series solution in which every term was a known function. This template &mdash; eigenvalue problem in space, exponential evolution in time, Fourier expansion to fit the data &mdash; is the single most reused recipe in mathematical physics.</div></div>

<h2 class="lesson-title">6. Wave Equation: Vibrating String</h2>

<p class="l-text">Now repeat the recipe for the wave equation on a clamped string of length $L$:</p>

<div class="calc-formula"><div class="formula-label">VIBRATING STRING</div><div class="formula-main">$$u_{tt} \\;=\\; c^2\\, u_{xx}, \\qquad 0 < x < L, \\quad t > 0$$ $$u(0, t) = u(L, t) = 0, \\qquad u(x, 0) = f(x), \\qquad u_t(x, 0) = g(x)$$</div><div class="formula-sub">A guitar string of length $L$ clamped at both ends. Initial shape $f(x)$, initial velocity profile $g(x)$, propagation speed $c = \\sqrt{T / \\rho}$ where $T$ is tension and $\\rho$ is mass per unit length.</div></div>

<p class="l-text">Separating $u(x, t) = X(x) T(t)$ and substituting:</p>

<div class="calc-formula"><div class="formula-label">SEPARATION FOR THE WAVE EQUATION</div><div class="formula-main">$$\\frac{T''(t)}{c^2\\, T(t)} \\;=\\; \\frac{X''(x)}{X(x)} \\;=\\; -\\lambda$$</div><div class="formula-sub">Same spatial story as before; the time equation now has a second derivative instead of a first.</div></div>

<p class="l-text">The spatial eigenvalue problem $X'' + \\lambda X = 0$ with $X(0) = X(L) = 0$ is exactly the one we solved for the heat equation: $\\lambda_n = (n\\pi / L)^2$, $X_n(x) = \\sin(n\\pi x / L)$. The time equation is now $T_n''(t) + c^2 \\lambda_n\\, T_n(t) = 0$, a simple harmonic oscillator with angular frequency $\\omega_n = c n \\pi / L$. Its general solution is</p>

<div class="calc-formula"><div class="formula-label">TIME EVOLUTION OF EACH MODE</div><div class="formula-main">$$T_n(t) \\;=\\; A_n \\cos(\\omega_n t) + B_n \\sin(\\omega_n t), \\qquad \\omega_n \\;=\\; \\frac{c n \\pi}{L}$$</div><div class="formula-sub">No decay. Each mode oscillates forever at its own frequency. The fundamental frequency $\\omega_1$ sets the pitch of the note; the higher $\\omega_n$ are integer multiples, the <em>harmonics</em> that give the instrument its timbre.</div></div>

<p class="l-text">Summing the products gives the famous standing-wave solution:</p>

<div class="calc-formula"><div class="formula-label">WAVE EQUATION SERIES SOLUTION</div><div class="formula-main">$$u(x, t) \\;=\\; \\sum_{n=1}^{\\infty} \\bigl[\\, A_n \\cos(\\omega_n t) + B_n \\sin(\\omega_n t)\\,\\bigr]\\, \\sin\\!\\left(\\frac{n \\pi x}{L}\\right)$$</div><div class="formula-sub">The two initial conditions $u(x, 0) = f(x)$ and $u_t(x, 0) = g(x)$ determine $A_n$ from the Fourier sine series of $f$ and $B_n$ from the Fourier sine series of $g/\\omega_n$.</div></div>

<div class="calc-formula"><div class="formula-label">COEFFICIENTS FROM INITIAL DATA</div><div class="formula-main">$$A_n \\;=\\; \\frac{2}{L}\\!\\int_0^L f(x)\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\! dx, \\qquad B_n \\;=\\; \\frac{2}{L \\omega_n}\\!\\int_0^L g(x)\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\! dx$$</div><div class="formula-sub">Initial shape sets the cosine amplitudes, initial velocity sets the sine amplitudes.</div></div>

<div id="plot-l4-modes-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var L=Math.PI;var N=400;var xs=[];for(var i=0;i<N;i++){xs.push(i*L/(N-1));}
var m1=[];var m2=[];var m3=[];
for(var i=0;i<N;i++){var x=xs[i];m1.push(Math.sin(x));m2.push(Math.sin(2*x));m3.push(Math.sin(3*x));}
var d1={x:xs,y:m1,mode:'lines',name:'mode 1 (fundamental)',line:{color:'#3b82f6',width:2.5}};
var d2={x:xs,y:m2,mode:'lines',name:'mode 2',line:{color:'#10b981',width:2.5}};
var d3={x:xs,y:m3,mode:'lines',name:'mode 3',line:{color:'#f59e0b',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'position along the string',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'mode shape sin(nπx/L)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.2,1.2]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-modes-en',[d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the three lowest standing-wave shapes for a clamped string of length $L$. The fundamental (blue) has nodes only at the ends; the second mode (green) adds a node in the middle; the third mode (orange) has two interior nodes. A real plucked string is a weighted sum of these (and many higher modes), each oscillating in time at its own frequency $\\omega_n = c n \\pi / L$.</div></div>

<div class="l-note"><strong>Why a guitar sounds different from a piano.</strong> Both produce a fundamental at the same pitch when tuned to the same note, but the <em>relative amplitudes</em> of the higher harmonics differ. A guitar pluck near the bridge excites high modes strongly (bright, twangy sound); a soft thumb pluck near the centre excites mostly the fundamental (mellow). The PDE is the same; only the initial condition $f(x)$ changes, and the Fourier coefficients $A_n$ change with it.</div>

<h2 class="lesson-title">7. d'Alembert's Solution on the Infinite Line</h2>

<p class="l-text">On a string so long we can treat it as infinite, the wave equation has a remarkably clean closed-form solution discovered by Jean le Rond d'Alembert in 1747 &mdash; decades before Fourier. Consider</p>

<div class="calc-formula"><div class="formula-label">WAVE EQUATION ON ℝ</div><div class="formula-main">$$u_{tt} = c^2 u_{xx}, \\qquad x \\in \\mathbb{R}, \\quad t > 0$$ $$u(x, 0) = f(x), \\qquad u_t(x, 0) = g(x)$$</div><div class="formula-sub">No boundary conditions, just initial shape and velocity.</div></div>

<p class="l-text">A change of variables to <em>characteristic coordinates</em> $\\xi = x - c t$, $\\eta = x + c t$ converts the wave equation into $u_{\\xi \\eta} = 0$. The general solution is the sum of an arbitrary function of $\\xi$ and an arbitrary function of $\\eta$:</p>

<div class="calc-formula"><div class="formula-label">D'ALEMBERT'S FORMULA</div><div class="formula-main">$$u(x, t) \\;=\\; \\tfrac{1}{2}\\bigl[\\, f(x - c t) + f(x + c t)\\,\\bigr] \\;+\\; \\frac{1}{2 c}\\!\\int_{x - c t}^{x + c t}\\! g(s)\\, ds$$</div><div class="formula-sub">Beautifully geometric: the initial shape splits into two copies, one travelling right at speed $c$, the other left at speed $c$, each carrying half the initial amplitude. The initial velocity contributes through an integral over the interval that has had time to reach the observer.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Finite speed of propagation</div><div class="card-body">The value of $u(x, t)$ depends only on the initial data inside the interval $[x - c t, x + c t]$. No signal from further away can possibly have reached $(x, t)$ yet. This is the <strong>domain of dependence</strong>.</div></div>
<div class="calc-card"><div class="card-title">Domain of influence</div><div class="card-body">Conversely, a disturbance initially located at $x_0$ can only affect points satisfying $|x - x_0| \\leq c t$. Information travels at speed $c$ &mdash; no faster, no slower.</div></div>
<div class="calc-card"><div class="card-title">Pure travelling waves</div><div class="card-body">If $g \\equiv 0$, then $u(x, t) = \\tfrac{1}{2}[f(x - c t) + f(x + c t)]$ is exactly two rigid copies of the initial profile moving in opposite directions. No distortion, no dispersion.</div></div>
<div class="calc-card"><div class="card-title">Contrast with the heat equation</div><div class="card-body">The heat equation has <em>infinite</em> propagation speed: a localised initial pulse instantly spreads its tail to the entire real line, although the tail amplitude is exponentially small. The wave equation is much better behaved physically.</div></div>
</div>

<div id="plot-l4-dalembert-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=400;var xs=[];for(var i=0;i<N;i++){xs.push(-6+12*i/(N-1));}
function pulse(x){return Math.exp(-4*x*x);}
var initial=xs.map(pulse);
var c=1;var t=2;
var split=xs.map(function(x){return 0.5*(pulse(x-c*t)+pulse(x+c*t));});
var d0={x:xs,y:initial,mode:'lines',name:'initial pulse t = 0',line:{color:'#9ca3af',width:2,dash:'dot'}};
var d1={x:xs,y:split,mode:'lines',name:'two waves t = 2',line:{color:'#3b82f6',width:2.5}};
var d2={x:xs,y:xs.map(function(x){return 0.5*pulse(x-c*t);}),mode:'lines',name:'right-moving (½ amp)',line:{color:'#f59e0b',width:1.5,dash:'dash'}};
var d3={x:xs,y:xs.map(function(x){return 0.5*pulse(x+c*t);}),mode:'lines',name:'left-moving (½ amp)',line:{color:'#10b981',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'u(x, t)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-dalembert-en',[d0,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> a Gaussian pulse $f(x) = e^{-4 x^2}$ released at $t = 0$ with zero initial velocity. d'Alembert's formula immediately splits it into two copies, each at half amplitude, one travelling right at speed $c = 1$, the other left. After $t = 2$ the two copies are well separated (orange and green dashed) and their sum (blue) is the visible state. This is the most economical possible description of a wave: two rigid translations, nothing more.</div></div>

<h2 class="lesson-title">8. Laplace's Equation on a Rectangle</h2>

<p class="l-text">For the elliptic representative consider Laplace's equation on a rectangle $0 \\leq x \\leq a$, $0 \\leq y \\leq b$ with mixed Dirichlet data:</p>

<div class="calc-formula"><div class="formula-label">LAPLACE ON A RECTANGLE</div><div class="formula-main">$$u_{xx} + u_{yy} \\;=\\; 0, \\qquad 0 < x < a, \\quad 0 < y < b$$ $$u(0, y) = u(a, y) = 0, \\quad u(x, 0) = 0, \\quad u(x, b) = f(x)$$</div><div class="formula-sub">Three sides held at zero, the top side held at the prescribed temperature profile $f(x)$. Find the equilibrium temperature in the interior.</div></div>

<p class="l-text">Separate $u(x, y) = X(x) Y(y)$. Substituting into $u_{xx} + u_{yy} = 0$ and dividing by $X Y$:</p>

<div class="calc-formula"><div class="formula-label">SEPARATION FOR LAPLACE</div><div class="formula-main">$$\\frac{X''(x)}{X(x)} \\;=\\; -\\frac{Y''(y)}{Y(y)} \\;=\\; -\\lambda$$</div><div class="formula-sub">Same idea, but now both ODEs are second-order in space.</div></div>

<p class="l-text">The boundary conditions at $x = 0$ and $x = a$ make the $X$ equation an eigenvalue problem with the same answer as before: $\\lambda_n = (n\\pi / a)^2$, $X_n(x) = \\sin(n\\pi x / a)$. The $Y$ equation becomes $Y_n'' - (n\\pi / a)^2 Y_n = 0$, whose general solution is a combination of $\\sinh$ and $\\cosh$. Applying $Y_n(0) = 0$ kills the $\\cosh$ part:</p>

<div class="calc-formula"><div class="formula-label">LAPLACE SERIES SOLUTION</div><div class="formula-main">$$u(x, y) \\;=\\; \\sum_{n=1}^{\\infty} B_n\\, \\sin\\!\\left(\\frac{n\\pi x}{a}\\right) \\frac{\\sinh(n\\pi y / a)}{\\sinh(n\\pi b / a)}, \\quad B_n \\;=\\; \\frac{2}{a}\\!\\int_0^a f(x)\\, \\sin\\!\\left(\\frac{n\\pi x}{a}\\right)\\! dx$$</div><div class="formula-sub">A Fourier sine series in $x$ whose coefficients grow hyperbolically with $y$ so that the prescribed values are matched on the top edge. The normalisation $\\sinh(n\\pi b/a)$ in the denominator ensures the top boundary condition is met exactly.</div></div>

<div id="plot-l4-laplace-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=Math.PI;var b=Math.PI;var Nx=70;var Ny=70;var xs=[];var ys=[];var z=[];
for(var i=0;i<Nx;i++){xs.push(i*a/(Nx-1));}
for(var j=0;j<Ny;j++){ys.push(j*b/(Ny-1));}
for(var j=0;j<Ny;j++){var row=[];var y=ys[j];
  for(var i=0;i<Nx;i++){var x=xs[i];var u=0;
    for(var k=1;k<=21;k+=2){var Bn=4*100/(k*Math.PI);
      u+=Bn*Math.sin(k*x)*Math.sinh(k*y)/Math.sinh(k*b);}
    row.push(u);}
  z.push(row);}
var d1={x:xs,y:ys,z:z,type:'heatmap',colorscale:[[0,'#0c1024'],[0.3,'#1d4ed8'],[0.6,'#3b82f6'],[0.85,'#fbbf24'],[1,'#fef3c7']],colorbar:{title:'u'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937'},yaxis:{title:'y',gridcolor:'#1f2937'},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-laplace-en',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the equilibrium temperature on a square $\\pi \\times \\pi$ plate, three sides clamped at $0^\\circ$ and the top edge held at $100^\\circ$. The hot top edge bleeds heat down into the interior; the heat decays roughly exponentially with distance below the top, with the decay rate set by the mode number. Notice the smooth interior, the absence of any local maximum away from the boundary, and the cold corners where hot top meets cold side &mdash; a signature of the discontinuous boundary data.</div></div>

<div class="l-note"><strong>Why the hyperbolic sines.</strong> The wave equation gave us oscillating trig functions in time because $\\omega_n^2 > 0$. The heat equation gave us decaying exponentials because the time ODE was first-order. The Laplace equation pairs the spatial sinusoids in $x$ with their <em>hyperbolic</em> partners in $y$, because the sign of the eigenvalue in the $Y$ equation has flipped. Same separation recipe, opposite character.</div>

<h2 class="lesson-title">9. Maximum Principle (Brief)</h2>

<p class="l-text">Elliptic and parabolic equations obey a deceptively simple structural statement that has powerful consequences.</p>

<div class="calc-formula"><div class="formula-label">MAXIMUM PRINCIPLE (LAPLACE)</div><div class="formula-main">$$\\text{If } u_{xx} + u_{yy} = 0 \\text{ on a bounded region } \\Omega \\text{ with } u \\in C(\\overline{\\Omega}),$$ $$\\text{then } \\max_{\\overline{\\Omega}} u \\;=\\; \\max_{\\partial \\Omega} u \\quad \\text{and} \\quad \\min_{\\overline{\\Omega}} u \\;=\\; \\min_{\\partial \\Omega} u.$$</div><div class="formula-sub">A harmonic function attains its maximum and minimum on the boundary, never strictly inside (unless it is constant).</div></div>

<p class="l-text">The intuition is mean-value-like: the value of a harmonic function at any interior point equals the average of its values on any surrounding circle. An interior maximum would require the value at the centre to exceed the surrounding average, which a true average cannot do. The same statement, suitably modified, holds for the parabolic heat equation: a solution attains its maximum either at $t = 0$ or on the spatial boundary, never strictly inside the cylinder.</p>

<p class="l-text"><strong>Immediate consequence: uniqueness.</strong> Suppose two solutions $u_1$ and $u_2$ of the same Dirichlet problem exist. Their difference $w = u_1 - u_2$ is harmonic with zero boundary data, so by the maximum principle $\\max w = \\min w = 0$ on the closure, meaning $w \\equiv 0$. The two solutions are identical. The maximum principle hands you uniqueness without doing any integration, a remarkable economy.</p>

<h2 class="lesson-title">10. Numerical Methods Preview</h2>

<p class="l-text">Separation of variables only works when the geometry is simple and the equation is linear. The instant either of those fails, you reach for numerics. The pillar of PDE numerics is the <strong>finite difference method</strong>: replace continuous derivatives by their discrete counterparts on a grid.</p>

<div class="calc-formula"><div class="formula-label">SECOND DIFFERENCE</div><div class="formula-main">$$u_{xx}(x_i, t) \\;\\approx\\; \\frac{u(x_{i+1}, t) - 2 u(x_i, t) + u(x_{i-1}, t)}{(\\Delta x)^2}$$</div><div class="formula-sub">Three neighbouring grid values, balanced as a discrete Laplacian. Sample $u$ on a uniform mesh $x_i = i\\, \\Delta x$ and the right-hand side is computable in constant time per point.</div></div>

<p class="l-text">For the heat equation an <strong>explicit Euler</strong> time step is the simplest scheme. Let $u_i^n$ denote $u(x_i, n\\, \\Delta t)$. Then</p>

<div class="calc-formula"><div class="formula-label">EXPLICIT EULER FOR THE HEAT EQUATION</div><div class="formula-main">$$u_i^{n+1} \\;=\\; u_i^n + \\frac{\\alpha^2 \\Delta t}{(\\Delta x)^2}\\bigl[\\, u_{i+1}^n - 2 u_i^n + u_{i-1}^n\\,\\bigr]$$</div><div class="formula-sub">Marches the solution forward one time step using only known values from the previous step. Simple, but the price is a stability constraint.</div></div>

<div class="calc-highlight"><strong>CFL condition.</strong> The explicit scheme is stable only if $r = \\alpha^2 \\Delta t / (\\Delta x)^2 \\leq 1/2$. Doubling the spatial resolution forces a four-fold cut in the time step, a notorious bottleneck. The implicit Crank-Nicolson scheme avoids this by solving a small linear system at every step, trading bookkeeping for unconditional stability. Lesson 5 in this track is devoted to this material.</div>

<h2 class="lesson-title">11. Bridge to AI (One Paragraph)</h2>

<p class="l-text"><strong>The heat equation is the deterministic version of Gaussian diffusion.</strong> In Lesson 6 we will see stochastic differential equations, where adding noise to a drift turns deterministic motion into Brownian motion. The probability density of Brownian motion satisfies the heat equation, and that simple fact is the mathematical foundation of modern <em>Diffusion generative models</em> &mdash; DDPM, score-based models, Stable Diffusion. The same heat equation is also at the heart of <em>Fourier Neural Operators</em> (FNO) in Lesson 8 of the Fourier track, which learn to solve entire families of PDEs by working directly with their spectral representations. PDE basics are not optional in the modern ML curriculum; they are the ground floor of a building that now includes generative imaging, weather prediction, and protein folding.</p>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to observe.</strong> Run with <code>EQUATION = "heat"</code> first. The Gaussian pulse spreads and shrinks; by the end of the simulation it has become a smooth low half-sine that is gently fading. The final $\\max |u|$ should be much smaller than the initial one &mdash; that is dissipation. Now run with <code>EQUATION = "wave"</code>. The same pulse splits into two travelling copies that bounce back from the clamped ends and pass through each other (the wave equation is linear, so superposition holds). The final $\\max |u|$ stays close to the initial one &mdash; that is conservation of energy.</p>

<div class="think-box"><div class="think-label">EXPERIMENTS TO TRY</div><div class="think-body">Change the initial bump to a triangle (use <code>np.maximum(0, 1 - np.abs((x - L/2)/0.3))</code>) and watch the wave equation propagate the sharp corners faithfully while the heat equation smooths them out within a few steps. Push the CFL constant past $0.5$ in the heat solver and observe the catastrophic numerical blow-up. For the wave equation, set the initial velocity instead of the initial position by initialising <code>u_prev = u - dt * g</code> where <code>g</code> is a velocity profile, and compare the result with d'Alembert's formula.</div></div>

<div class="calc-highlight"><strong>What you can now do.</strong> You can recognise a PDE, classify it as parabolic / hyperbolic / elliptic, attach the right kind of boundary and initial conditions, derive a series solution by separation of variables for any of the three canonical problems on a simple geometry, write down d'Alembert's formula on the line, and code a finite-difference solver that turns the mathematics into pictures. The next lesson formalises the numerics; the one after that opens the door to nonlinear PDEs, stochastic PDEs, and the neural-network solvers that have transformed the subject in the last decade.</div>
`,

/* ============================================================
   TURKISH
   ============================================================ */
tr: `
<p class="l-text">Bu izleğin ilk üç dersinde tüm bilinmeyenler <em>tek</em> değişkenin fonksiyonuydu: zamana karşı $y(t)$ konumu, devredeki $I(t)$ akımı, bir şişedeki $N(t)$ bakteri sayısı. Gerçek fizik nadiren bu kadar uysal davranır. Bir metal çubuktaki ısı hem nerede ölçtüğüne hem de ne zaman ölçtüğüne bağlıdır. Bir gitar teli titreşir: tel üzerindeki her nokta her anda kendi yer değiştirmesine sahiptir. Paralel plakalı bir kondansatörün içindeki elektrik potansiyeli aynı anda iki uzaysal koordinata bağlıdır. Birden fazla bağımsız değişken devreye girdiği anda adi diferansiyel denklemler artık yetmez. Kısmi diferansiyel denklemlere ihtiyaç vardır.</p>

<p class="l-text">Kısaca <strong>PDE</strong> (partial differential equation) olarak bilinen kısmi diferansiyel denklem, çok değişkenli bir bilinmeyen fonksiyon ile onun kısmi türevleri arasındaki bir bağıntıdır. Matematik adi denklemlerin dünyasından çok daha geniş ve zengindir: çözümler sonsuz boyutlu yapıya sahip fonksiyon uzaylarında yaşar, sınır koşulları cevabı tamamen değiştirebilir ve aynı denklem, hangi değişkenin uzay hangi değişkenin zaman olarak ele alındığına bağlı olarak vahşice farklı olayları betimleyebilir. Bu ders senin bu dünyaya ilk dikkatli yürüyüşün. Her mühendis ve fizikçinin er ya da geç karşılaştığı üç klasik ikinci dereceden doğrusal PDE üzerine yoğunlaşıyoruz: <strong>ısı denklemi</strong>, <strong>dalga denklemi</strong> ve <strong>Laplace denklemi</strong>. Bunlar aynı matematiksel binanın parabolik, hiperbolik ve eliptik üç farklı yüzü.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>PDE notasyonu $u_x$, $u_{xx}$, $u_t$, $u_{tt}$ akıcı şekilde okuma ve bir PDE'nin mertebesini saptama</li>
<li>İkinci dereceden doğrusal bir PDE'yi diskriminantı ile parabolik / hiperbolik / eliptik olarak sınıflama</li>
<li>Isı, dalga ve Laplace denklemlerinin fiziksel anlamını ve arkalarındaki korunum yasalarını ifade etme</li>
<li>Dirichlet, Neumann ve Robin sınır koşullarını kurma ve bir PDE probleminin iyi konulmuş olup olmadığını denetleme</li>
<li><strong>Değişkenlere ayırma</strong> yöntemini kullanarak sonlu çubukta ısı denkleminin ve titreşen telin seri çözümlerini türetme</li>
<li>Sonsuz çizgide dalga denkleminin çözümünü d'Alembert formülü ile yazma</li>
</ul>
</div>

<h2 class="lesson-title">1. PDE Nedir?</h2>

<p class="l-text">$u(x, t)$, iki bağımsız değişkenin bir fonksiyonu olsun. $t$ sabit tutulurken $x$'e göre kısmi türev şudur:</p>

<div class="calc-formula"><div class="formula-label">KISMİ TÜREV NOTASYONU</div><div class="formula-main">$$\\frac{\\partial u}{\\partial x} \\;\\equiv\\; u_x, \\qquad \\frac{\\partial u}{\\partial t} \\;\\equiv\\; u_t, \\qquad \\frac{\\partial^2 u}{\\partial x^2} \\;\\equiv\\; u_{xx}, \\qquad \\frac{\\partial^2 u}{\\partial x \\,\\partial t} \\;\\equiv\\; u_{xt}$$</div><div class="formula-sub">İndis biçimi her PDE kitabının çalışma notasyonudur. Yer kazandırır ve uzun denklemlerin yapısını ilk bakışta görünür kılar.</div></div>

<p class="l-text">Bir <strong>kısmi diferansiyel denklem</strong>, birkaç değişkenin bilinmeyen bir fonksiyonu ile onun bir ya da daha çok kısmi türevini içeren her denklemdir. Denklemin <strong>mertebesi</strong>, içinde geçen en yüksek türevin mertebesidir. Birinci dereceden bir örnek:</p>

<div class="calc-formula"><div class="formula-label">BİRİNCİ DERECEDEN TAŞIMA DENKLEMİ</div><div class="formula-main">$$u_t + c\\, u_x \\;=\\; 0$$</div><div class="formula-sub">Sağa $c$ hızıyla rijit olarak ötelenmiş herhangi bir başlangıç profilini $u(x, t) = f(x - c t)$ biçiminde yazabileceğin her şey bir çözümdür. Saf öteleme, hiç yayılma yok.</div></div>

<p class="l-text">Bu dersin çoğu <strong>ikinci dereceden</strong> PDE'ler hakkında, çünkü fizik genellikle ikinci türevi yazar: Newton yasası bir ikinci zaman türevini bir kuvvete eşitler, Fourier ısı yasası bir birinci zaman türevini bir ikinci uzay türevine eşitler, Laplace denge durumunu betimler ve denge ikinci türevlerle yönetilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğrusal PDE</div><div class="card-body">Bilinmeyen $u$ ve tüm türevleri birinci kuvvette görünür ve birbiriyle çarpılmaz. Katsayılar $x$ ve $t$'ye bağlı olabilir ama $u$'ya bağlı olamaz. Bu dersin üç klasik PDE'sinin hepsi doğrusaldır.</div></div>
<div class="calc-card"><div class="card-title">Doğrusal Olmayan PDE</div><div class="card-body">$u\\, u_x$ gibi çarpımlara (Burgers denklemi), $u^2$ gibi kuvvetlere (porous media) veya $u$'ya aşkın bağımlılığa izin verilir. Çözümler doğrusal PDE'lerin yasakladığı şok ve patlamalar geliştirebilir.</div></div>
<div class="calc-card"><div class="card-title">Homojen</div><div class="card-body">Sağ taraf sıfır. Çözümlerin doğrusal kombinasyonları yine çözümdür &mdash; değişkenlere ayırmayı mümkün kılan <em>üst üste binme ilkesi</em>.</div></div>
<div class="calc-card"><div class="card-title">Homojen Olmayan</div><div class="card-body">Bir ısı kaynağı veya dış kuvvet gibi bir zorlama terimi sağ tarafa yerleşir. Bir özel çözüm bulup üzerine genel homojen çözümü ekleyerek çözülür, tıpkı ODE'ler gibi.</div></div>
</div>

<div class="l-note"><strong>Doğrusallık neden bu kadar önemli.</strong> $u_1$ ve $u_2$ doğrusal homojen bir PDE'yi çözüyorsa, herhangi $\\alpha, \\beta$ sabitleri için $\\alpha u_1 + \\beta u_2$ da çözer. Az sonra tam çözümleri basit yapı taşlarının sonsuz toplamları olarak kuracağız. Bu yapı yalnızca doğrusallık çözümleri denklemi bozmadan toplamamıza izin verdiği için işliyor.</div>

<h2 class="lesson-title">2. Üç Klasik İkinci Dereceden Doğrusal PDE</h2>

<p class="l-text">İki değişkende genel ikinci dereceden doğrusal PDE şu biçimdedir:</p>

<div class="calc-formula"><div class="formula-label">GENEL İKİNCİ DERECEDEN DOĞRUSAL PDE</div><div class="formula-main">$$A\\, u_{xx} + 2B\\, u_{xt} + C\\, u_{tt} + D\\, u_x + E\\, u_t + F\\, u \\;=\\; G$$</div><div class="formula-sub">Katsayılar $A, B, C, \\ldots, G$ $x$ ve $t$'ye bağlı olabilir. Denklemin <em>türünü</em> tamamen üst üç katsayı $A$, $B$, $C$ belirler.</div></div>

<p class="l-text">Sınıflama konik kesitlerden ödünç alınmıştır: $A x^2 + 2 B x t + C t^2$'yi bir ikinci dereceden form olarak düşün. Diskriminantı bir parabole mi, bir hiperbole mi yoksa bir elipse mi bakıyor olduğuna karar verir.</p>

<div class="calc-formula"><div class="formula-label">DİSKRİMİNANTLA SINIFLAMA</div><div class="formula-main">$$\\Delta \\;=\\; B^2 - A C$$ $$\\Delta > 0 \\Rightarrow \\text{hiperbolik}, \\qquad \\Delta = 0 \\Rightarrow \\text{parabolik}, \\qquad \\Delta < 0 \\Rightarrow \\text{eliptik}.$$</div><div class="formula-sub">Konikleri ayıran aynı cebirsel test üç PDE ailesini de ayırır.</div></div>

<p class="l-text">Her sınıfın fiziğin sürekli yazdığı klasik bir temsilcisi vardır:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ISI &mdash; PARABOLİK</div><div class="compare-item">$u_t \\;=\\; \\alpha^2\\, u_{xx}$</div><div class="compare-item">$A = \\alpha^2,\\; B = 0,\\; C = 0 \\Rightarrow \\Delta = 0$</div><div class="compare-item">Sıcaklığın, derişimin, olasılık yoğunluğunun yayılımı.</div><div class="compare-item">Bir zaman türevi, iki uzay türevi. Başlangıç profilini <strong>düzleştirir</strong>.</div></div><div class="compare-col"><div class="compare-title">DALGA &mdash; HİPERBOLİK</div><div class="compare-item">$u_{tt} \\;=\\; c^2\\, u_{xx}$</div><div class="compare-item">$A = c^2,\\; B = 0,\\; C = -1 \\Rightarrow \\Delta = c^2 > 0$</div><div class="compare-item">Titreşen teller, ses, ışık, su dalgaları.</div><div class="compare-item">İki zaman türevi, iki uzay türevi. Sinyalleri sonlu hızda <strong>yayar</strong>.</div></div></div>

<div class="calc-formula"><div class="formula-label">LAPLACE &mdash; ELİPTİK</div><div class="formula-main">$$u_{xx} + u_{yy} \\;=\\; 0$$</div><div class="formula-sub">$A = 1,\\; B = 0,\\; C = 1 \\Rightarrow \\Delta = -1 < 0$. Sabit-durum sıcaklığı, yüksüz bir bölgedeki elektrik potansiyeli, sıkıştırılamaz vizkozitesiz akış potansiyeli. Zaman değişkeni yok: bu denge denklemidir.</div></div>

<div class="l-note"><strong>Yakın akrabalar.</strong> Laplace'ın sağındaki sıfırı verili bir $f(x, y)$ ile değiştirip <strong>Poisson denklemi</strong> $u_{xx} + u_{yy} = -f$'i elde edersin (yük dağılımından elektrik potansiyeli). Isı denklemindeki $u_t$'yi $i u_t$ ile değiştirirsen kuantum mekaniğinin <strong>Schrödinger denklemi</strong>ne ulaşırsın. Bunların her biri sınıflamasını şablonundan miras alır ve klasik üçlü için kurduğun aletlerin çoğu neredeyse değişmeden bunlara da aktarılır.</div>

<div class="calc-example"><div class="example-label">HIZLI BİR SINIFLAMA ALIŞTIRMASI</div><div class="example-body"><strong>Denklem:</strong> $u_{xx} + 4\\, u_{xt} + 3\\, u_{tt} = 0$. Burada $A = 1$, $B = 2$, $C = 3$, dolayısıyla $\\Delta = 4 - 3 = 1 > 0$. Hiperbolik. İki farklı karakteristik ailesi boyunca yayılan dalga benzeri çözümler bekleriz.<br><br><strong>Denklem:</strong> $u_{tt} - 2 u_{xt} + u_{xx} = 0$. Burada $A = 1$, $B = -1$, $C = 1$, dolayısıyla $\\Delta = 1 - 1 = 0$. Parabolik. İki karakteristik ailesi tek aile olarak çakışmış.<br><br><strong>Denklem:</strong> $u_{xx} + 2 u_{xy} + 5 u_{yy} = 0$. Burada $A = 1$, $B = 1$, $C = 5$, dolayısıyla $\\Delta = 1 - 5 = -4 < 0$. Eliptik. Saf denge, reel düzlemde karakteristik yok.</div></div>

<h2 class="lesson-title">3. Neden Bu Üçü? Fiziksel Anlam</h2>

<p class="l-text">Üç sınıf soyut defter tutma değil. Doğanın temel olarak üç farklı davranışına karşılık geliyorlar.</p>

<p class="l-text"><strong>Parabolik denklemler düzleştirir.</strong> Isı denklemi $u_t = \\alpha^2 u_{xx}$, geri çevrilmez yayılma süreçlerini betimler: keskin özellikler söner, sistem tek tip bir duruma doğru gevşer. Zaman ilerledikçe bilgi kaybolur; denklemi genel olarak geriye çalıştırıp başlangıç koşulunu geri kazanamazsın. Yüksek frekanslı içerik üstel hızda ölür, alçak frekanslı içerik daha uzun yaşar. Olasılıksal olarak, aynı denklem Brownian hareket altında bir olasılık yoğunluğunun yayılışını yönetir.</p>

<p class="l-text"><strong>Hiperbolik denklemler yayar.</strong> Dalga denklemi $u_{tt} = c^2 u_{xx}$ zamanı tersine çevirme simetrisine sahiptir. Enerji tam olarak korunur. Bir rahatsızlık sonlu hızla $c$'de yol alır ve tüm bilgisini yanında taşır: uzun bir teldeki bir dalgalanma sabit bir gözlemciden şeklini kaybetmeden geçer. Her noktada iki karakteristik doğru $x - ct = \\text{sabit}$ ve $x + ct = \\text{sabit}$ uzay-zamanı geçmiş ve gelecek etki konilerine böler.</p>

<p class="l-text"><strong>Eliptik denklemler dengeye gelir.</strong> Laplace denklemi $u_{xx} + u_{yy} = 0$'ın zaman değişkeni yoktur. Mükemmel denge durumlarını betimler: kenarları sabit değerlerde tutulan bir metal plakanın sıcaklık dağılımı, boş bir oyuktaki elektrostatik potansiyel, sıkıştırılamaz dönmeyen bir akışın hız potansiyeli. Karakteristik yönler yok, yayılma yok, sönüm yok; yalnızca denge.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Parabolik &rarr; yayıcı</div><div class="card-body">Enerji korunmaz. Denklemin bir zaman oku vardır. Çözüm $t$ büyüdükçe pürüzsüzleşir &mdash; başlangıçtaki herhangi bir pürüzlülük üstel hızda unutulur.</div></div>
<div class="calc-card"><div class="card-title">Hiperbolik &rarr; salınımlı</div><div class="card-body">Enerji korunur. Denklem zamanı tersine çevirebilir. Keskin özellikler korunur ve karakteristikler boyunca sonlu hızda $c$'de yol alır.</div></div>
<div class="calc-card"><div class="card-title">Eliptik &rarr; denge</div><div class="card-body">Zaman düşmüştür. Herhangi bir noktadaki çözüm aslında çevre değerler üzerinde bir ortalamadır (ortalama-değer özelliği). Sınır tek başına her şeyi belirler.</div></div>
</div>

<div id="plot-l4-trio-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var L=Math.PI;var N=200;var xs=[];for(var i=0;i<N;i++){xs.push(i*L/(N-1));}
var heat=[];var wave=[];var lap=[];
for(var i=0;i<N;i++){var x=xs[i];
  heat.push(Math.exp(-0.05*Math.PI*Math.PI)*Math.sin(x)+0.3*Math.exp(-9*0.05*Math.PI*Math.PI)*Math.sin(3*x));
  wave.push(Math.cos(0.6*Math.PI)*Math.sin(x)+0.3*Math.cos(3*0.6*Math.PI)*Math.sin(3*x));
  lap.push(Math.sin(x));}
var d1={x:xs,y:heat,mode:'lines',name:'parabolik (ısı) — sönüm',line:{color:'#3b82f6',width:2.5}};
var d2={x:xs,y:wave,mode:'lines',name:'hiperbolik (dalga) — salınım',line:{color:'#f59e0b',width:2.5}};
var d3={x:xs,y:lap,mode:'lines',name:'eliptik (Laplace) — denge',line:{color:'#10b981',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'u(x, t sabit)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.5,1.5]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-trio-tr',[d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> aynı iki-modlu başlangıç profili $\\sin x + 0.3\\,\\sin 3x$ her klasik denklem altında biraz evrilmiş. Parabolik (mavi) yüksek-frekans titreşimini çoktan kaybetmiş &mdash; üçüncü armonik birinciden dokuz kat hızlı söndü. Hiperbolik (turuncu) hâlâ her iki moda da sahip, yalnızca fazları kaymış. Eliptik (yeşil) denge profilinin kendisi, zamanda donmuş. Üç denklem, üç kişilik.</div></div>

<div class="l-note"><strong>Karakteristik eğri sezgisi.</strong> Hiperbolik bir denklemde bir noktadaki küçük bir rahatsızlık iki reel karakteristik doğru boyunca yayılır. Parabolik bir denklemde karakteristikler tek bir aile olarak dejenere olur ve rahatsızlıklar anlık olarak yayılır ama hızla sönen genlikle (biçimsel anlamda sonsuz yayılma hızı). Eliptik bir denklemde karakteristikler karmaşıktır, yani bilginin yol aldığı reel bir yön yoktur &mdash; her iç noktadaki değer aynı anda tüm sınırdan etkilenir.</div>

<h2 class="lesson-title">4. Başlangıç ve Sınır Koşulları</h2>

<p class="l-text">Tek başına bir PDE eksiktir. Fonksiyonun yerel olarak nasıl değiştiğini söyler ama tek bir fiziksel çözüm seçmek için zamanın başlangıcında ve uzayın kenarlarında ne olduğunu söylemen gerekir. Eklediğin koşullar bir dipnot değil; problemin yarısıdır.</p>

<p class="l-text"><strong>Başlangıç koşulları</strong> sistemin $t = 0$'daki durumunu betimler. Isı denklemi, zamanda birinci derece olduğu için bir başlangıç koşuluna ihtiyaç duyar: sıcaklık profili $u(x, 0) = f(x)$. Dalga denklemi, zamanda ikinci derece olduğu için ikiye ihtiyaç duyar: başlangıç şekli $u(x, 0) = f(x)$ ve başlangıç hızı $u_t(x, 0) = g(x)$. Laplace'ın zaman değişkeni yoktur, dolayısıyla hiç başlangıç koşulu yoktur.</p>

<p class="l-text"><strong>Sınır koşulları</strong> uzaysal kenarlarda ne olduğunu betimler. Üç isimli tür neredeyse her fiziksel durumu kapsar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dirichlet &mdash; değer belirlenmiş</div><div class="card-body">$u$'nun kendisi sınırda belirtilir. Örnek: bir metal çubuğun iki ucu $0^\\circ \\text{C}$'deki bir ısı kuyusuna kelepçelenmiştir, yani $u(0, t) = u(L, t) = 0$. Adını 1829 Fourier serileri çalışmasında ortaya atan Peter Dirichlet'ten alır.</div></div>
<div class="calc-card"><div class="card-title">Neumann &mdash; akı belirlenmiş</div><div class="card-body">Normal türev $u_x$ belirtilir. Örnek: çubuk uçları <em>yalıtılmıştır</em>, hiç ısı kaçamaz, yani $u_x(0, t) = u_x(L, t) = 0$. Adını Carl Neumann'dan alır.</div></div>
<div class="calc-card"><div class="card-title">Robin &mdash; karışık</div><div class="card-body">$a\\, u + b\\, u_x = c$ gibi doğrusal bir kombinasyon. Örnek: Newton'un soğuma yasası, $u_x = -h\\, (u - u_{\\text{ortam}})$. Değer ile akıyı birleştirir, dolayısıyla "karışık".</div></div>
<div class="calc-card"><div class="card-title">Periyodik</div><div class="card-body">$u(0, t) = u(L, t)$ ve $u_x(0, t) = u_x(L, t)$. Halka üzerindeki problemler için kullanılır ya da otomatik olarak Fourier serisine izin veren temiz bir kuramsal çerçeve olarak.</div></div>
</div>

<div class="calc-highlight"><strong>İyi konulmuşluk (Hadamard, 1902).</strong> Bir PDE problemi ancak ve ancak üç koşulu sağladığında iyi konulmuş olarak adlandırılır: (1) bir çözüm <em>var</em>; (2) çözüm <em>tek</em>; (3) çözüm verilere (başlangıç profili, sınır değerleri, kaynak terimleri) <em>sürekli</em> olarak bağlıdır. İlk ikisi açık; üçüncüsü incelikli ve hayati önemde. Girdideki ufak bir değişiklik çıktıda yalnızca ufak bir değişiklik üretmeli, aksi takdirde problem fiziksel bir model olarak güvenilemez ve kesinlikle bir bilgisayarda güvenilir biçimde simüle edilemez.</div>

<p class="l-text"><strong>İyi konulmuşluğun öğretici bir başarısızlığı:</strong> ısı denkleminin zamanda <em>geriye</em> çalıştırılması. $u_t = -\\alpha^2 u_{xx}$ problemi Hadamard anlamında kötü konulmuştur. Verilerdeki ufak gürültü üstel hızda büyütülür. Tam da bu yüzden, mükemmel denklemlerle bile, bugünkü ölçümlerden dünkü tam sıcaklık dağılımını genel olarak yeniden inşa edemezsin. Zamanda ileri denklem bir termostat; zamanda geri denklem ölçüm hatası için bir büyüteç.</p>

<h2 class="lesson-title">5. Çubukta Isı Denklemi: Değişkenlere Ayırma</h2>

<p class="l-text">Şimdi üç klasik denklemi de açan iş gören tekniğe geliyoruz. Uçları sıfır sıcaklıkta tutulan $L$ uzunluğunda bir çubukta ısı denklemini düşün:</p>

<div class="calc-formula"><div class="formula-label">DIRICHLET SINIR KOŞULLARIYLA SONLU ÇUBUKTA ISI</div><div class="formula-main">$$u_t \\;=\\; \\alpha^2\\, u_{xx}, \\qquad 0 < x < L, \\quad t > 0$$ $$u(0, t) \\;=\\; u(L, t) \\;=\\; 0, \\qquad u(x, 0) \\;=\\; f(x)$$</div><div class="formula-sub">$L$ uzunluğunda bir çubuk, her iki uç da $0^\\circ$'de buz banyosunda, $f(x)$ sıcaklık profiliyle başlatılmış. $u(x, t)$'yi bul.</div></div>

<p class="l-text">Anahtar fikir, 1750 dolaylarında Daniel Bernoulli'ye, 1822'de Fourier tarafından sonuna kadar götürülen şu: <strong>çarpım çözümler ara</strong></p>

<div class="calc-formula"><div class="formula-label">AYIRMA ÖNDEYİSİ</div><div class="formula-main">$$u(x, t) \\;=\\; X(x)\\, T(t)$$</div><div class="formula-sub">İyimser bir tahmin: bilinmeyeni yalnızca $x$'in bir fonksiyonu ile yalnızca $t$'nin bir fonksiyonunun çarpımı olarak yaz. Bu tahminin bedelini ileride bu tür çarpımları çok sayıda toplayarak ödeyeceğiz.</div></div>

<p class="l-text">Isı denklemine yerleştir. $u_t = X(x)\\, T'(t)$ ve $u_{xx} = X''(x)\\, T(t)$ kullanarak:</p>

<div class="calc-formula"><div class="formula-label">AYIRMA</div><div class="formula-main">$$X(x)\\, T'(t) \\;=\\; \\alpha^2\\, X''(x)\\, T(t) \\qquad\\Longrightarrow\\qquad \\frac{T'(t)}{\\alpha^2\\, T(t)} \\;=\\; \\frac{X''(x)}{X(x)}$$</div><div class="formula-sub">$\\alpha^2 X T$'ye böl. Sol taraf yalnızca $t$'ye bağlı; sağ taraf yalnızca $x$'e bağlı. Eşit oldukları için ikisi de <em>aynı sabit</em> olmalı.</div></div>

<p class="l-text">Bu ayırma sabitine $-\\lambda$ adı ver (eksi işareti gelenekseldir; bir anda neden negatif olması gerektiğini göreceğiz). İki adi diferansiyel denklem düşer:</p>

<div class="calc-formula"><div class="formula-label">İKİ ODE</div><div class="formula-main">$$X''(x) + \\lambda\\, X(x) \\;=\\; 0, \\qquad T'(t) + \\alpha^2 \\lambda\\, T(t) \\;=\\; 0$$</div><div class="formula-sub">Uzayda $X$ için bir sınır-değer problemi, zamanda $T$ için bir başlangıç-değer problemi. Paylaşılan tek özdeğer $\\lambda$ ile bağlı.</div></div>

<p class="l-text"><strong>Uzaysal problemi sınır koşullarıyla çöz.</strong> Her iki uçtaki Dirichlet koşulları $u(0, t) = u(L, t) = 0$ kendilerini $X(0) = X(L) = 0$'a çevirir. $X'' + \\lambda X = 0$ denklemi ve bu koşullar prototip bir <em>özdeğer problemi</em>dir.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$\\lambda < 0$ dene, $\\lambda = -\\mu^2$ olsun</div><div class="step-detail">O zaman $X'' = \\mu^2 X$, genel çözüm $X(x) = A e^{\\mu x} + B e^{-\\mu x}$. Sınır koşulları $X(0) = X(L) = 0$ $A = B = 0$'ı zorlar. Yalnız aşikar çözüm. <strong>Reddet.</strong></div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\lambda = 0$ dene</div><div class="step-detail">O zaman $X'' = 0$ bize $X(x) = A x + B$ verir. Sınır koşulları yine $A = B = 0$'ı zorlar. <strong>Reddet.</strong></div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\lambda > 0$ dene, $\\lambda = \\mu^2$ olsun</div><div class="step-detail">O zaman $X'' + \\mu^2 X = 0$ bize $X(x) = A \\cos(\\mu x) + B \\sin(\\mu x)$ verir. $X(0) = 0$ koşulu kosinüsü öldürür: $A = 0$. $X(L) = B \\sin(\\mu L) = 0$ koşulu aşikar olmayan bir $B$'ye yalnızca $\\sin(\\mu L) = 0$ olduğunda, yani $n \\geq 1$ tamsayısı için $\\mu L = n \\pi$ olduğunda izin verir.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Özdeğerler ve özfonksiyonlar</div><div class="step-detail">$n = 1, 2, 3, \\ldots$ için $\\lambda_n = (n\\pi / L)^2$, karşılık gelen özfonksiyonlar $X_n(x) = \\sin(n\\pi x / L)$. Bunlar tam olarak bir Fourier sinüs serisinin kurduğu modlar.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Her özdeğer için zaman ODE'sini çöz</div><div class="step-detail">$T_n'(t) = -\\alpha^2 \\lambda_n\\, T_n(t)$ bize $T_n(t) = T_n(0)\\, e^{-\\alpha^2 \\lambda_n t} = T_n(0)\\, e^{-\\alpha^2 (n\\pi/L)^2 t}$ verir. Saf üstel sönüm; yüksek modlar çok daha hızlı söner.</div></div></div>
</div>

<p class="l-text">Her $X_n(x) T_n(t)$ çarpımı PDE'yi ve sınır koşullarını zaten çözer. Doğrusallık üst üste binmeye izin verir. Genel çözüm:</p>

<div class="calc-formula"><div class="formula-label">ISI DENKLEMİ SERİ ÇÖZÜMÜ</div><div class="formula-main">$$u(x, t) \\;=\\; \\sum_{n=1}^{\\infty} B_n\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\exp\\!\\left[-\\alpha^2\\!\\left(\\frac{n\\pi}{L}\\right)^{\\!2}\\! t\\right]$$</div><div class="formula-sub">Her biri bir $B_n$ katsayısıyla ağırlıklandırılmış ve kendi hızında sönen duran sinüs modlarının sonsuz doğrusal kombinasyonu.</div></div>

<p class="l-text"><strong>Katsayıları başlangıç koşulundan sabitleme.</strong> $t = 0$'da üstel çarpanların hepsi 1, yani</p>

<div class="calc-formula"><div class="formula-label">FOURIER SİNÜS KATSAYILARI</div><div class="formula-main">$$f(x) \\;=\\; \\sum_{n=1}^{\\infty} B_n\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\quad\\Longrightarrow\\quad B_n \\;=\\; \\frac{2}{L}\\int_0^L f(x)\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx$$</div><div class="formula-sub">Fourier izleğinin Ders 2'sinde gördüğün Fourier sinüs serisi katsayılarıyla tam olarak aynı. PDE bir Fourier problemine indirgenmiş.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK: TEK TİP SICAKLIKTA BAŞLATILMIŞ ÇUBUK</div><div class="example-body"><strong>Kurulum.</strong> $L = \\pi$ uzunluğunda, $\\alpha = 1$, uçları $0^\\circ$'de tutulan, başlangıç profili $f(x) = T_0$ (tek tip, diyelim $T_0 = 100^\\circ$) bir çubuk.<br><br><strong>Bir sabitin Fourier sinüs katsayıları:</strong> $B_n = (2/\\pi)\\int_0^{\\pi} T_0\\, \\sin(n x)\\, dx = (2 T_0 / \\pi)\\bigl[1 - \\cos(n\\pi)\\bigr]/n$, ki tek $n$ için $4 T_0 / (n\\pi)$ ve çift $n$ için $0$.<br><br><strong>Çözüm.</strong><br>$u(x, t) = (4 T_0 / \\pi)\\bigl[\\sin x \\cdot e^{-t} + (1/3) \\sin 3x \\cdot e^{-9 t} + (1/5) \\sin 5x \\cdot e^{-25 t} + \\cdots\\bigr]$.<br><br>İlk mod $1$ zaman sabitiyle söner, üçüncü mod $1/9$ ile, beşinci $1/25$ ile. Kısa bir süre sonra yüksek armonikler gider ve çubuk yavaşça sıfıra batan tek bir sinüs dalgası gibi görünür.</div></div>

<div id="plot-l4-heat-evolve-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var L=Math.PI;var Nx=80;var Nt=60;var xs=[];var ts=[];var z=[];
for(var i=0;i<Nx;i++){xs.push(i*L/(Nx-1));}
for(var j=0;j<Nt;j++){ts.push(j*0.5/(Nt-1));}
for(var j=0;j<Nt;j++){var row=[];var t=ts[j];
  for(var i=0;i<Nx;i++){var x=xs[i];var u=0;
    for(var k=1;k<=15;k+=2){u+=(4*100/(k*Math.PI))*Math.sin(k*x)*Math.exp(-k*k*t);}
    row.push(u);}
  z.push(row);}
var d1={x:xs,y:ts,z:z,type:'heatmap',colorscale:[[0,'#0c1024'],[0.3,'#1d4ed8'],[0.6,'#3b82f6'],[0.85,'#fbbf24'],[1,'#fef3c7']],colorbar:{title:'u'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'konum x',gridcolor:'#1f2937'},yaxis:{title:'zaman t',gridcolor:'#1f2937'},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-heat-evolve-tr',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> tek tip $T_0= 100^\\circ$'de başlatılmış ve her iki ucu sıfıra kelepçelenmiş çubuk için sıcaklığın $u(x, t)$ ısı haritası. Konum yatay, zaman yukarı büyüyor. Alttaki parlak sarı şerit başlangıç tek tip sıcaklığıdır; çubuğun buz banyosuyla buluştuğu $x = 0$ ve $x = L$'deki keskin köşeler ısıyı boşaltan bir akı anında yaratır. Zaman ilerledikçe profil düzleşir ve küçülür; grafiğin tepesinde yalnızca temel sinüs modu, nazikçe söndüğü hâliyle, kalır.</div></div>

<div id="plot-l4-heat-snapshots-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var L=Math.PI;var Nx=200;var xs=[];for(var i=0;i<Nx;i++){xs.push(i*L/(Nx-1));}
var snaps=[0.0,0.02,0.1,0.3,0.8];var colors=['#fef3c7','#fbbf24','#f59e0b','#3b82f6','#1e3a8a'];var traces=[];
for(var s=0;s<snaps.length;s++){var t=snaps[s];var u=[];
  for(var i=0;i<Nx;i++){var x=xs[i];var v=0;
    for(var k=1;k<=25;k+=2){v+=(4*100/(k*Math.PI))*Math.sin(k*x)*Math.exp(-k*k*t);}
    u.push(v);}
  traces.push({x:xs,y:u,mode:'lines',name:'t = '+t.toFixed(2),line:{color:colors[s],width:2.5}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'u(x, t)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-heat-snapshots-tr',traces,layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> beş zamanda $u(x, t)$'nin anlık görüntüleri. $t = 0$'da profil neredeyse düz $100^\\circ$ çizgisidir, Fourier toplamını kestiğimiz uçlarda Gibbs dalgacıklarıyla. Neredeyse anında yüksek armonikler söner (titrek $t = 0$ izini düz $t = 0.02$ iziyle karşılaştır) ve profil temiz bir yarım sinüs tümseğine dönüşür. $t$ daha da büyüdükçe tümsek yalnızca genlikte küçülür. Şekil asimptotik olarak $\\sin(\\pi x / L)$'dir &mdash; en yavaş sönen mod uzun vadede diğer her şeye üstün gelir.</div></div>

<div class="think-box"><div class="think-label">BÜYÜK DERS</div><div class="think-body">Değişkenlere ayırma bir kısmi diferansiyel denklemi, paylaşılan bir özdeğerle bağlı iki adi diferansiyel denkleme dönüştürdü. Sınır koşulları izin verilen özdeğerlerin ayrık bir kümesini seçti, özfonksiyonlar başlangıç koşulunun üzerinde açılabildiği ortogonal bir taban oluşturdu ve sonuç her terimi bilinen bir fonksiyon olan bir seri çözümdü. Bu şablon &mdash; uzayda özdeğer problemi, zamanda üstel evrim, veriye uydurmak için Fourier açılımı &mdash; matematiksel fiziğin en çok yeniden kullanılan tek tarifidir.</div></div>

<h2 class="lesson-title">6. Dalga Denklemi: Titreşen Tel</h2>

<p class="l-text">Şimdi tarifi $L$ uzunluğunda kelepçeli bir telde dalga denklemi için tekrarla:</p>

<div class="calc-formula"><div class="formula-label">TİTREŞEN TEL</div><div class="formula-main">$$u_{tt} \\;=\\; c^2\\, u_{xx}, \\qquad 0 < x < L, \\quad t > 0$$ $$u(0, t) = u(L, t) = 0, \\qquad u(x, 0) = f(x), \\qquad u_t(x, 0) = g(x)$$</div><div class="formula-sub">İki ucundan kelepçelenmiş $L$ uzunluğunda bir gitar teli. Başlangıç şekli $f(x)$, başlangıç hız profili $g(x)$, yayılma hızı $c = \\sqrt{T / \\rho}$ burada $T$ gerilim ve $\\rho$ birim uzunluk başına kütle.</div></div>

<p class="l-text">$u(x, t) = X(x) T(t)$ ayırarak ve yerleştirerek:</p>

<div class="calc-formula"><div class="formula-label">DALGA DENKLEMİ İÇİN AYIRMA</div><div class="formula-main">$$\\frac{T''(t)}{c^2\\, T(t)} \\;=\\; \\frac{X''(x)}{X(x)} \\;=\\; -\\lambda$$</div><div class="formula-sub">Önceki gibi aynı uzaysal hikâye; zaman denkleminin artık birinci yerine ikinci türevi var.</div></div>

<p class="l-text">$X(0) = X(L) = 0$ ile $X'' + \\lambda X = 0$ uzaysal özdeğer problemi tam olarak ısı denklemi için çözdüğümüzdür: $\\lambda_n = (n\\pi / L)^2$, $X_n(x) = \\sin(n\\pi x / L)$. Zaman denklemi artık $T_n''(t) + c^2 \\lambda_n\\, T_n(t) = 0$, açısal frekansı $\\omega_n = c n \\pi / L$ olan basit harmonik bir salınıcı. Genel çözümü:</p>

<div class="calc-formula"><div class="formula-label">HER MODUN ZAMAN EVRİMİ</div><div class="formula-main">$$T_n(t) \\;=\\; A_n \\cos(\\omega_n t) + B_n \\sin(\\omega_n t), \\qquad \\omega_n \\;=\\; \\frac{c n \\pi}{L}$$</div><div class="formula-sub">Sönüm yok. Her mod kendi frekansında sonsuza dek salınır. Temel frekans $\\omega_1$ notanın perdesini belirler; daha yüksek $\\omega_n$'ler tamsayı katlarıdır, enstrümana tınısını veren <em>armoniklerdir</em>.</div></div>

<p class="l-text">Çarpımları toplayarak ünlü duran-dalga çözümünü elde ederiz:</p>

<div class="calc-formula"><div class="formula-label">DALGA DENKLEMİ SERİ ÇÖZÜMÜ</div><div class="formula-main">$$u(x, t) \\;=\\; \\sum_{n=1}^{\\infty} \\bigl[\\, A_n \\cos(\\omega_n t) + B_n \\sin(\\omega_n t)\\,\\bigr]\\, \\sin\\!\\left(\\frac{n \\pi x}{L}\\right)$$</div><div class="formula-sub">İki başlangıç koşulu $u(x, 0) = f(x)$ ve $u_t(x, 0) = g(x)$ $A_n$'i $f$'in Fourier sinüs serisinden ve $B_n$'i $g/\\omega_n$'in Fourier sinüs serisinden belirler.</div></div>

<div class="calc-formula"><div class="formula-label">BAŞLANGIÇ VERİSİNDEN KATSAYILAR</div><div class="formula-main">$$A_n \\;=\\; \\frac{2}{L}\\!\\int_0^L f(x)\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\! dx, \\qquad B_n \\;=\\; \\frac{2}{L \\omega_n}\\!\\int_0^L g(x)\\, \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\! dx$$</div><div class="formula-sub">Başlangıç şekli kosinüs genliklerini, başlangıç hızı sinüs genliklerini belirler.</div></div>

<div id="plot-l4-modes-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var L=Math.PI;var N=400;var xs=[];for(var i=0;i<N;i++){xs.push(i*L/(N-1));}
var m1=[];var m2=[];var m3=[];
for(var i=0;i<N;i++){var x=xs[i];m1.push(Math.sin(x));m2.push(Math.sin(2*x));m3.push(Math.sin(3*x));}
var d1={x:xs,y:m1,mode:'lines',name:'mod 1 (temel)',line:{color:'#3b82f6',width:2.5}};
var d2={x:xs,y:m2,mode:'lines',name:'mod 2',line:{color:'#10b981',width:2.5}};
var d3={x:xs,y:m3,mode:'lines',name:'mod 3',line:{color:'#f59e0b',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'tel boyunca konum',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'mod şekli sin(nπx/L)',gridcolor:'#1f2937',zerolinecolor:'#374151',range:[-1.2,1.2]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-modes-tr',[d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $L$ uzunluğunda kelepçeli bir tel için en düşük üç duran-dalga şekli. Temel (mavi) yalnızca uçlarda düğümlere sahip; ikinci mod (yeşil) ortaya bir düğüm daha ekler; üçüncü mod (turuncu) iki iç düğüme sahiptir. Gerçek bir teli parmakla çekildiğinde bunların (ve birçok daha yüksek modun) ağırlıklı bir toplamı olur, her biri kendi frekansı $\\omega_n = c n \\pi / L$'de zamanda salınır.</div></div>

<div class="l-note"><strong>Neden bir gitar bir piyanodan farklı sesleniyor.</strong> İkisi de aynı notaya akort edildiğinde aynı perdede bir temel üretir, ama daha yüksek armoniklerin <em>göreli genlikleri</em> farklıdır. Köprü yakınında çekilen bir gitar yüksek modları güçlü şekilde uyarır (parlak, tıngırdayan ses); merkeze yakın yumuşak bir başparmak çekişi çoğunlukla temeli uyarır (yumuşak). PDE aynıdır; yalnızca başlangıç koşulu $f(x)$ değişir ve Fourier katsayıları $A_n$ onunla birlikte değişir.</div>

<h2 class="lesson-title">7. Sonsuz Çizgide d'Alembert Çözümü</h2>

<p class="l-text">Sonsuz olarak ele alabileceğimiz kadar uzun bir telde dalga denkleminin Jean le Rond d'Alembert tarafından 1747'de keşfedilmiş &mdash; Fourier'den onlarca yıl önce &mdash; dikkat çekici biçimde temiz bir kapalı-form çözümü vardır. Düşün:</p>

<div class="calc-formula"><div class="formula-label">ℝ'DE DALGA DENKLEMİ</div><div class="formula-main">$$u_{tt} = c^2 u_{xx}, \\qquad x \\in \\mathbb{R}, \\quad t > 0$$ $$u(x, 0) = f(x), \\qquad u_t(x, 0) = g(x)$$</div><div class="formula-sub">Sınır koşulu yok, yalnızca başlangıç şekli ve hızı.</div></div>

<p class="l-text"><em>Karakteristik koordinatlara</em> $\\xi = x - c t$, $\\eta = x + c t$ değişken değişimi dalga denklemini $u_{\\xi \\eta} = 0$'a çevirir. Genel çözüm $\\xi$'nin bir keyfi fonksiyonu ile $\\eta$'nın bir keyfi fonksiyonunun toplamıdır:</p>

<div class="calc-formula"><div class="formula-label">D'ALEMBERT FORMÜLÜ</div><div class="formula-main">$$u(x, t) \\;=\\; \\tfrac{1}{2}\\bigl[\\, f(x - c t) + f(x + c t)\\,\\bigr] \\;+\\; \\frac{1}{2 c}\\!\\int_{x - c t}^{x + c t}\\! g(s)\\, ds$$</div><div class="formula-sub">Çok güzel biçimde geometrik: başlangıç şekli iki kopyaya bölünür, biri $c$ hızında sağa, diğeri $c$ hızında sola, her biri başlangıç genliğinin yarısını taşır. Başlangıç hızı, gözlemciye ulaşmaya zaman bulmuş aralık üzerinden bir integralle katkıda bulunur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sonlu yayılma hızı</div><div class="card-body">$u(x, t)$ değeri yalnızca $[x - c t, x + c t]$ aralığındaki başlangıç verilerine bağlıdır. Daha uzaktan hiçbir sinyalin $(x, t)$'ye ulaşmış olması mümkün değildir. Bu <strong>bağımlılık alanı</strong>dır.</div></div>
<div class="calc-card"><div class="card-title">Etki alanı</div><div class="card-body">Tersine, başlangıçta $x_0$'da bulunan bir rahatsızlık yalnızca $|x - x_0| \\leq c t$ koşulunu sağlayan noktaları etkileyebilir. Bilgi $c$ hızında yol alır &mdash; ne daha hızlı, ne daha yavaş.</div></div>
<div class="calc-card"><div class="card-title">Saf gezgin dalgalar</div><div class="card-body">$g \\equiv 0$ ise, $u(x, t) = \\tfrac{1}{2}[f(x - c t) + f(x + c t)]$ tam olarak ters yönlerde hareket eden başlangıç profilinin iki rijit kopyasıdır. Bozulma yok, dispersiyon yok.</div></div>
<div class="calc-card"><div class="card-title">Isı denklemiyle karşıtlık</div><div class="card-body">Isı denkleminin <em>sonsuz</em> yayılma hızı vardır: yerelleşmiş bir başlangıç darbesi kuyruğunu anında tüm reel çizgiye yayar, ancak kuyruk genliği üstel olarak küçüktür. Dalga denklemi fiziksel olarak çok daha iyi davranır.</div></div>
</div>

<div id="plot-l4-dalembert-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var N=400;var xs=[];for(var i=0;i<N;i++){xs.push(-6+12*i/(N-1));}
function pulse(x){return Math.exp(-4*x*x);}
var initial=xs.map(pulse);
var c=1;var t=2;
var split=xs.map(function(x){return 0.5*(pulse(x-c*t)+pulse(x+c*t));});
var d0={x:xs,y:initial,mode:'lines',name:'başlangıç darbesi t = 0',line:{color:'#9ca3af',width:2,dash:'dot'}};
var d1={x:xs,y:split,mode:'lines',name:'iki dalga t = 2',line:{color:'#3b82f6',width:2.5}};
var d2={x:xs,y:xs.map(function(x){return 0.5*pulse(x-c*t);}),mode:'lines',name:'sağa giden (½ genlik)',line:{color:'#f59e0b',width:1.5,dash:'dash'}};
var d3={x:xs,y:xs.map(function(x){return 0.5*pulse(x+c*t);}),mode:'lines',name:'sola giden (½ genlik)',line:{color:'#10b981',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'u(x, t)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-dalembert-tr',[d0,d1,d2,d3],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $t = 0$'da sıfır başlangıç hızıyla bırakılan bir Gauss darbesi $f(x) = e^{-4 x^2}$. d'Alembert formülü onu anında iki kopyaya böler, her biri yarı genlikte, biri sağa $c = 1$ hızında, diğeri sola gider. $t = 2$'den sonra iki kopya iyice ayrılmıştır (turuncu ve yeşil kesik) ve toplamları (mavi) görünen durumdur. Bu bir dalganın olası en ekonomik betimlenişidir: iki rijit öteleme, başka bir şey değil.</div></div>

<h2 class="lesson-title">8. Dikdörtgende Laplace Denklemi</h2>

<p class="l-text">Eliptik temsilci için $0 \\leq x \\leq a$, $0 \\leq y \\leq b$ dikdörtgeninde karışık Dirichlet verisiyle Laplace denklemini düşün:</p>

<div class="calc-formula"><div class="formula-label">DİKDÖRTGENDE LAPLACE</div><div class="formula-main">$$u_{xx} + u_{yy} \\;=\\; 0, \\qquad 0 < x < a, \\quad 0 < y < b$$ $$u(0, y) = u(a, y) = 0, \\quad u(x, 0) = 0, \\quad u(x, b) = f(x)$$</div><div class="formula-sub">Üç kenar sıfırda tutulmuş, üst kenar belirlenmiş sıcaklık profili $f(x)$'te tutulmuş. İç bölgedeki denge sıcaklığını bul.</div></div>

<p class="l-text">$u(x, y) = X(x) Y(y)$ ayır. $u_{xx} + u_{yy} = 0$'a yerleştirip $X Y$'ye bölerek:</p>

<div class="calc-formula"><div class="formula-label">LAPLACE İÇİN AYIRMA</div><div class="formula-main">$$\\frac{X''(x)}{X(x)} \\;=\\; -\\frac{Y''(y)}{Y(y)} \\;=\\; -\\lambda$$</div><div class="formula-sub">Aynı fikir, ama şimdi her iki ODE de uzayda ikinci derecedendir.</div></div>

<p class="l-text">$x = 0$ ve $x = a$'daki sınır koşulları $X$ denklemini öncekiyle aynı yanıta sahip bir özdeğer problemi yapar: $\\lambda_n = (n\\pi / a)^2$, $X_n(x) = \\sin(n\\pi x / a)$. $Y$ denklemi $Y_n'' - (n\\pi / a)^2 Y_n = 0$ olur, genel çözümü $\\sinh$ ve $\\cosh$'ın bir kombinasyonudur. $Y_n(0) = 0$ uygulamak $\\cosh$ kısmını öldürür:</p>

<div class="calc-formula"><div class="formula-label">LAPLACE SERİ ÇÖZÜMÜ</div><div class="formula-main">$$u(x, y) \\;=\\; \\sum_{n=1}^{\\infty} B_n\\, \\sin\\!\\left(\\frac{n\\pi x}{a}\\right) \\frac{\\sinh(n\\pi y / a)}{\\sinh(n\\pi b / a)}, \\quad B_n \\;=\\; \\frac{2}{a}\\!\\int_0^a f(x)\\, \\sin\\!\\left(\\frac{n\\pi x}{a}\\right)\\! dx$$</div><div class="formula-sub">Katsayıları üst kenarda belirlenmiş değerlerle eşleşecek şekilde $y$ ile hiperbolik olarak büyüyen $x$'te bir Fourier sinüs serisi. Paydaki $\\sinh(n\\pi b/a)$ normalizasyonu üst sınır koşulunun tam olarak karşılanmasını sağlar.</div></div>

<div id="plot-l4-laplace-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=Math.PI;var b=Math.PI;var Nx=70;var Ny=70;var xs=[];var ys=[];var z=[];
for(var i=0;i<Nx;i++){xs.push(i*a/(Nx-1));}
for(var j=0;j<Ny;j++){ys.push(j*b/(Ny-1));}
for(var j=0;j<Ny;j++){var row=[];var y=ys[j];
  for(var i=0;i<Nx;i++){var x=xs[i];var u=0;
    for(var k=1;k<=21;k+=2){var Bn=4*100/(k*Math.PI);
      u+=Bn*Math.sin(k*x)*Math.sinh(k*y)/Math.sinh(k*b);}
    row.push(u);}
  z.push(row);}
var d1={x:xs,y:ys,z:z,type:'heatmap',colorscale:[[0,'#0c1024'],[0.3,'#1d4ed8'],[0.6,'#3b82f6'],[0.85,'#fbbf24'],[1,'#fef3c7']],colorbar:{title:'u'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',gridcolor:'#1f2937'},yaxis:{title:'y',gridcolor:'#1f2937'},margin:{t:30,r:20,b:50,l:60}};
Plotly.newPlot('plot-l4-laplace-tr',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> üç kenarı $0^\\circ$'de tutulan ve üst kenarı $100^\\circ$'de tutulan $\\pi \\times \\pi$ kare bir plakadaki denge sıcaklığı. Sıcak üst kenar iç bölgeye ısı akıtır; ısı üstten uzaklaştıkça yaklaşık üstel olarak söner, sönüm hızı mod sayısıyla belirlenir. İçeride pürüzsüzlüğe, sınırdan uzakta hiçbir yerel maksimumun olmamasına ve sıcak üstün soğuk yanla buluştuğu soğuk köşelere dikkat et &mdash; süreksiz sınır verisinin bir imzası.</div></div>

<div class="l-note"><strong>Neden hiperbolik sinüsler.</strong> Dalga denklemi bize zamanda salınan trig fonksiyonları verdi çünkü $\\omega_n^2 > 0$. Isı denklemi sönen üsteller verdi çünkü zaman ODE'si birinci dereceydi. Laplace denklemi $x$'teki uzaysal sinüzoidleri $y$'deki <em>hiperbolik</em> ortaklarıyla eşler, çünkü $Y$ denklemindeki özdeğerin işareti dönmüştür. Aynı ayırma tarifi, zıt karakter.</div>

<h2 class="lesson-title">9. Maksimum İlkesi (Kısaca)</h2>

<p class="l-text">Eliptik ve parabolik denklemler güçlü sonuçları olan yanıltıcı biçimde basit bir yapısal ifadeye uyar.</p>

<div class="calc-formula"><div class="formula-label">MAKSİMUM İLKESİ (LAPLACE)</div><div class="formula-main">$$\\text{Eğer } u_{xx} + u_{yy} = 0 \\text{ sınırlı bir } \\Omega \\text{ bölgesinde ve } u \\in C(\\overline{\\Omega}) \\text{ ise},$$ $$\\text{o zaman } \\max_{\\overline{\\Omega}} u \\;=\\; \\max_{\\partial \\Omega} u \\quad \\text{ve} \\quad \\min_{\\overline{\\Omega}} u \\;=\\; \\min_{\\partial \\Omega} u.$$</div><div class="formula-sub">Harmonik bir fonksiyon maksimum ve minimumunu sınırda alır, sıkı içeride asla (sabit olmadığı sürece).</div></div>

<p class="l-text">Sezgi ortalama-değer benzeridir: harmonik bir fonksiyonun herhangi bir iç noktadaki değeri, herhangi bir çevreleyen daire üzerindeki değerlerinin ortalamasına eşittir. Bir iç maksimum, merkez değerin çevre ortalamasını aşmasını gerektirir, ki gerçek bir ortalama bunu yapamaz. Aynı ifade, uygun şekilde değiştirilmiş hâliyle parabolik ısı denklemi için de geçerlidir: bir çözüm maksimumunu ya $t = 0$'da ya da uzaysal sınırda alır, silindirin sıkı içerisinde asla.</p>

<p class="l-text"><strong>Anlık sonuç: teklik.</strong> Aynı Dirichlet probleminin iki çözümü $u_1$ ve $u_2$ var olsun. Farkları $w = u_1 - u_2$ sıfır sınır verisiyle harmoniktir, dolayısıyla maksimum ilkesiyle kapanış üzerinde $\\max w = \\min w = 0$, yani $w \\equiv 0$. İki çözüm özdeştir. Maksimum ilkesi hiç integral almadan teklik verir, dikkate değer bir ekonomi.</p>

<h2 class="lesson-title">10. Sayısal Yöntemler Önizleme</h2>

<p class="l-text">Değişkenlere ayırma yalnızca geometri basit ve denklem doğrusal olduğunda işler. İkisinden biri başarısız olduğu an sayısal yöntemlere uzanırsın. PDE sayısal yöntemlerinin sütunu <strong>sonlu fark yöntemi</strong>dir: sürekli türevleri bir ızgara üzerinde ayrık karşılıklarıyla değiştir.</p>

<div class="calc-formula"><div class="formula-label">İKİNCİ FARK</div><div class="formula-main">$$u_{xx}(x_i, t) \\;\\approx\\; \\frac{u(x_{i+1}, t) - 2 u(x_i, t) + u(x_{i-1}, t)}{(\\Delta x)^2}$$</div><div class="formula-sub">Üç komşu ızgara değeri, ayrık bir Laplacian olarak dengelenmiş. $u$'yu tek tip bir ağ $x_i = i\\, \\Delta x$ üzerinde örnekle ve sağ taraf nokta başına sabit zamanda hesaplanabilir.</div></div>

<p class="l-text">Isı denklemi için bir <strong>açık Euler</strong> zaman adımı en basit şemadır. $u_i^n$ $u(x_i, n\\, \\Delta t)$ olsun. O zaman</p>

<div class="calc-formula"><div class="formula-label">ISI DENKLEMİ İÇİN AÇIK EULER</div><div class="formula-main">$$u_i^{n+1} \\;=\\; u_i^n + \\frac{\\alpha^2 \\Delta t}{(\\Delta x)^2}\\bigl[\\, u_{i+1}^n - 2 u_i^n + u_{i-1}^n\\,\\bigr]$$</div><div class="formula-sub">Çözümü yalnızca önceki adımdan bilinen değerleri kullanarak bir zaman adımı ileri yürütür. Basit, ama bedeli bir kararlılık kısıtıdır.</div></div>

<div class="calc-highlight"><strong>CFL koşulu.</strong> Açık şema yalnızca $r = \\alpha^2 \\Delta t / (\\Delta x)^2 \\leq 1/2$ ise kararlıdır. Uzaysal çözünürlüğü ikiye katlamak zaman adımında dört katlık bir kesinti zorlar, ünlü bir darboğaz. Üstü kapalı Crank-Nicolson şeması her adımda küçük bir doğrusal sistem çözerek bunu önler, defter tutmayı koşulsuz kararlılıkla takas eder. Bu izlekteki Ders 5 bu malzemeye ayrılmıştır.</div>

<h2 class="lesson-title">11. AI'ya Köprü (Bir Paragraf)</h2>

<p class="l-text"><strong>Isı denklemi Gauss yayılımının deterministik versiyonudur.</strong> Ders 6'da, bir sürüklenmeye gürültü eklemenin deterministik hareketi Brownian harekete dönüştürdüğü stokastik diferansiyel denklemleri göreceğiz. Brownian hareketin olasılık yoğunluğu ısı denklemini sağlar ve bu basit gerçek modern <em>Difüzyon üretici modellerinin</em> &mdash; DDPM, skor tabanlı modeller, Stable Diffusion &mdash; matematiksel temelidir. Aynı ısı denklemi ayrıca Fourier izleğinin Ders 8'indeki <em>Fourier Sinir Operatörlerinin</em> (FNO) kalbidir, ki bunlar tüm PDE ailelerini doğrudan spektral temsilleriyle çalışarak çözmeyi öğrenir. PDE temelleri modern ML müfredatında isteğe bağlı değil; artık üretici görüntüleme, hava tahmini ve protein katlanmasını içeren bir binanın zemin katıdır.</p>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Ne gözlemlemelisin.</strong> Önce <code>DENKLEM = "heat"</code> ile çalıştır. Gauss darbesi yayılır ve küçülür; simülasyonun sonunda nazikçe sönen düzgün bir alçak yarım sinüs olmuştur. Son $\\max |u|$ başlangıçtakinden çok daha küçük olmalı &mdash; bu yayılımdır. Şimdi <code>DENKLEM = "wave"</code> ile çalıştır. Aynı darbe iki gezici kopyaya bölünür, kelepçeli uçlardan yansır ve birbirinin içinden geçer (dalga denklemi doğrusaldır, dolayısıyla üst üste binme geçerlidir). Son $\\max |u|$ başlangıçtakine yakın kalır &mdash; bu enerji korunumudur.</p>

<div class="think-box"><div class="think-label">DENENECEK DENEYLER</div><div class="think-body">Başlangıç tümseğini bir üçgenle değiştir (<code>np.maximum(0, 1 - np.abs((x - L/2)/0.3))</code> kullan) ve ısı denklemi onları birkaç adımda düzleştirirken dalga denkleminin keskin köşeleri sadakatle nasıl yaydığını izle. CFL sabitini ısı çözücüsünde $0.5$'in ötesine zorla ve felaket sayısal patlamayı gözlemle. Dalga denklemi için, bir hız profili <code>g</code> ile <code>u_onceki = u - dt * g</code> başlatarak başlangıç hızını başlangıç konumu yerine ayarla ve sonucu d'Alembert formülüyle karşılaştır.</div></div>

<div class="calc-highlight"><strong>Şimdi yapabileceklerin.</strong> Bir PDE'yi tanıyabilir, parabolik / hiperbolik / eliptik olarak sınıflayabilir, doğru türde sınır ve başlangıç koşullarını ekleyebilir, basit bir geometride üç klasik problemden herhangi biri için değişkenlere ayırma yoluyla bir seri çözüm türetebilir, çizgide d'Alembert formülünü yazabilir ve matematiği görüntülere dönüştüren bir sonlu fark çözücüsü kodlayabilirsin. Sonraki ders sayısal yöntemleri biçimlendirir; ondan sonraki ders doğrusal olmayan PDE'lerin, stokastik PDE'lerin ve son on yılda konuyu dönüştüren sinir ağı çözücülerinin kapısını açar.</div>
`
};
