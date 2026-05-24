window.DIFFEQ_L3 = {

/* ============================================================================
   ENGLISH VERSION
   ============================================================================ */
en: `
<p class="l-text"><strong>Real-world systems rarely involve a single quantity changing in isolation.</strong> Two tanks of brine, exchanging fluid through pipes. A predator population, growing on prey it consumes. Coupled springs vibrating in tandem. Electrons coupled through inductance in a circuit. Every one of these is a <em>system</em> of differential equations — many variables, all evolving together, each one depending on the others. This lesson turns that mess of coupled equations into a single, elegant matrix equation, and reveals the geometric heart of dynamical systems.</p>

<p class="l-text">The translation from "system of ODEs" to "matrix equation" is more than notational. Once you write a linear system as $\\dot{X} = AX$, the entire machinery of linear algebra — eigenvalues, eigenvectors, diagonalization — pours in and gives closed-form solutions, classifies long-term behavior, and draws phase portraits with arrows that show how every trajectory in the plane will evolve. For nonlinear systems, the same machinery handles the local picture near equilibrium via linearization. This is the geometric and computational heart of dynamical systems theory.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Convert any system of linear first-order ODEs into the compact matrix form $\\dot{X} = AX$</li>
<li>Reduce an nth-order ODE to a first-order system by introducing helper variables</li>
<li>Solve $\\dot{X} = AX$ using eigenvalues and eigenvectors of the coefficient matrix</li>
<li>Handle real distinct, complex conjugate, and repeated eigenvalues with the right solution template</li>
<li>Classify 2D equilibria as node, saddle, spiral, or center from the eigenvalue spectrum</li>
<li>Linearize a nonlinear system near equilibrium using the Jacobian and read off local stability</li>
</ul>
</div>

<!-- ========================================================================
     SECTION 1
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">1. Why Systems? From Single ODE to Coupled</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> Two large tanks each hold 100 L of brine and are connected by two pipes that pump water between them at 5 L/min in each direction. Salt dissolves and flows with the water. The salt concentration in tank 1 depends on what comes in from tank 2 — which depends on the concentration in tank 2, which depends on what comes in from tank 1. The two equations refuse to separate. They are <em>coupled</em>.</div>

<p class="l-text">Let $x_1(t)$ and $x_2(t)$ be the mass of salt (in grams) in tank 1 and tank 2 at time $t$. Each tank holds 100 L and exchanges 5 L/min with the other. The concentration in tank 1 is $x_1/100$ g/L, so the rate at which salt leaves tank 1 (and enters tank 2) is $5 \\cdot x_1/100 = x_1/20$ g/min. By the same logic salt flows from tank 2 to tank 1 at rate $x_2/20$. The mass balance for each tank reads:</p>

<div class="calc-formula"><div class="formula-label">TWO COUPLED FIRST-ORDER ODEs</div><div class="formula-main">$$\\frac{dx_1}{dt} = -\\frac{x_1}{20} + \\frac{x_2}{20}, \\qquad \\frac{dx_2}{dt} = \\frac{x_1}{20} - \\frac{x_2}{20}$$</div><div class="formula-sub">Each rate depends on both unknowns. You cannot solve one without the other.</div></div>

<p class="l-text">Notice how neither equation can be tackled by L1 or L2 techniques alone. You cannot separate variables, you cannot integrate one without first knowing the other, and there is no clever substitution that decouples them. The two unknowns are <strong>locked together</strong> by the physics. This is the essence of a system of ODEs: many unknowns, many equations, all mutually entangled.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Coupled</div><div class="card-body">Each equation contains more than one unknown function. You cannot solve in isolation.</div></div>
<div class="calc-card"><div class="card-title">First-order</div><div class="card-body">Each equation involves only first derivatives. nth-order systems reduce to this case.</div></div>
<div class="calc-card"><div class="card-title">Linear</div><div class="card-body">The right-hand sides are linear combinations of the unknowns. Nonlinear systems handled in Section 9.</div></div>
<div class="calc-card"><div class="card-title">Autonomous</div><div class="card-body">No explicit $t$ on the right. The flow rule is the same at every moment.</div></div>
</div>

<p class="l-text">Other classical examples follow the same pattern: predator and prey populations in a forest, two masses on a shared spring, two capacitors coupled through an inductor, two chemical species in a continuous reactor, the position and momentum of a planet under gravity. None of them solve as single equations. All of them are systems.</p>

<div class="l-note"><strong>Notation convention.</strong> Throughout this lesson we use overdot for time derivative: $\\dot{x} = dx/dt$. This is standard in dynamics and saves writing. The vector form $\\dot{X}$ means "componentwise time derivative of every entry of $X$."</div>

<!-- ========================================================================
     SECTION 2
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">2. Matrix Form $\\dot{X} = AX$</h2>

<div class="calc-highlight"><strong>Core idea:</strong> Stack the unknowns into a vector and the coefficients into a matrix. A coupled system of two scalar equations becomes a single vector equation. From there, every tool of linear algebra is available.</div>

<p class="l-text">Returning to the brine tanks, define the state vector and coefficient matrix:</p>

<div class="calc-formula"><div class="formula-label">STATE VECTOR AND COEFFICIENT MATRIX</div><div class="formula-main">$$X(t) = \\begin{bmatrix} x_1(t) \\\\ x_2(t) \\end{bmatrix}, \\qquad A = \\begin{bmatrix} -1/20 & 1/20 \\\\ 1/20 & -1/20 \\end{bmatrix}$$</div></div>

<p class="l-text">With these definitions, the two coupled scalar ODEs collapse into one vector ODE:</p>

<div class="calc-formula"><div class="formula-label">MATRIX FORM (CONSTANT-COEFFICIENT LINEAR SYSTEM)</div><div class="formula-main">$$\\dot{X} = AX$$</div><div class="formula-sub">A single vector equation that captures n coupled scalar equations at once.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">State Vector $X$</div><div class="card-body">The vector $X(t) \\in \\mathbb{R}^n$ lists all unknown functions. Its evolution traces a curve in $\\mathbb{R}^n$.</div></div>
<div class="calc-card"><div class="card-title">Coefficient Matrix $A$</div><div class="card-body">The $n \\times n$ matrix $A$ encodes how each component drives every other. Constant entries here; time-varying $A(t)$ is harder.</div></div>
<div class="calc-card"><div class="card-title">Derivative $\\dot{X}$</div><div class="card-body">Componentwise: $\\dot{X}_i = dx_i/dt$. The whole velocity vector at the point $X$.</div></div>
<div class="calc-card"><div class="card-title">Initial Condition</div><div class="card-body">An IVP specifies $X(0) = X_0$, a single point in $\\mathbb{R}^n$. The solution curve is uniquely determined from there.</div></div>
</div>

<p class="l-text">The initial value problem for a system is exactly analogous to the scalar case from L1, but the data are vectors instead of scalars:</p>

<div class="calc-formula"><div class="formula-label">VECTOR INITIAL VALUE PROBLEM</div><div class="formula-main">$$\\dot{X} = AX, \\qquad X(0) = X_0 \\in \\mathbb{R}^n$$</div><div class="formula-sub">Existence and uniqueness theorem: for constant $A$, a unique solution exists for all $t \\in \\mathbb{R}$.</div></div>

<p class="l-text">Why this rewrite is powerful: the scalar equation $\\dot{x} = ax$ has the elementary solution $x(t) = x_0 e^{at}$. The vector equation $\\dot{X} = AX$ has the formal solution $X(t) = e^{At} X_0$, where $e^{At}$ is the <strong>matrix exponential</strong>. We will not compute matrix exponentials directly; instead Section 4 shows that eigenvalues and eigenvectors give us the explicit closed-form solution.</p>

<div class="l-note"><strong>Linearity bonus.</strong> The set of solutions of $\\dot{X} = AX$ forms an $n$-dimensional vector space. Any linear combination of solutions is also a solution. This is the <em>superposition principle</em>, identical in spirit to the second-order linear case of L2 — but now in full vector generality.</div>

<!-- ========================================================================
     SECTION 3
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">3. Conversion: nth-Order ODE $\\leftrightarrow$ First-Order System</h2>

<div class="calc-highlight"><strong>Equivalence:</strong> Every nth-order ODE in a single unknown is equivalent to a first-order system in $n$ unknowns. This is why the matrix form covers the whole landscape — second-order spring equations, third-order beam equations, all of L2 — without needing separate theory.</div>

<p class="l-text">The recipe is mechanical. Suppose you have an nth-order ODE of the form</p>

<div class="calc-formula"><div class="formula-label">GENERAL nth-ORDER LINEAR ODE</div><div class="formula-main">$$y^{(n)} + a_{n-1} y^{(n-1)} + \\cdots + a_1 \\dot{y} + a_0 y = 0$$</div></div>

<p class="l-text">Introduce $n$ new unknowns $y_1 = y$, $y_2 = \\dot{y}$, $y_3 = \\ddot{y}$, $\\ldots$, $y_n = y^{(n-1)}$. Each one is the time derivative of the previous, except for the last, whose derivative is fixed by the original equation. This gives an explicit first-order system:</p>

<div class="calc-formula"><div class="formula-label">EQUIVALENT FIRST-ORDER SYSTEM</div><div class="formula-main">$$\\dot{y}_1 = y_2, \\quad \\dot{y}_2 = y_3, \\quad \\ldots, \\quad \\dot{y}_{n-1} = y_n, \\quad \\dot{y}_n = -a_0 y_1 - a_1 y_2 - \\cdots - a_{n-1} y_n$$</div></div>

<p class="l-text">In matrix form $\\dot{Y} = AY$ with the so-called <strong>companion matrix</strong>:</p>

<div class="calc-formula"><div class="formula-label">COMPANION MATRIX</div><div class="formula-main">$$A = \\begin{bmatrix} 0 & 1 & 0 & \\cdots & 0 \\\\ 0 & 0 & 1 & \\cdots & 0 \\\\ \\vdots & & & \\ddots & \\vdots \\\\ 0 & 0 & 0 & \\cdots & 1 \\\\ -a_0 & -a_1 & -a_2 & \\cdots & -a_{n-1} \\end{bmatrix}$$</div></div>

<div class="calc-example"><div class="example-label">CONCRETE EXAMPLE FROM L2</div><div class="example-body">The damped harmonic oscillator from L2 reads $\\ddot{y} + 2\\gamma \\dot{y} + \\omega_0^2 y = 0$. With $y_1 = y$ and $y_2 = \\dot{y}$:<br><br>$\\dot{y}_1 = y_2$<br>$\\dot{y}_2 = -\\omega_0^2 y_1 - 2\\gamma y_2$<br><br>In matrix form, $\\dot{Y} = \\begin{bmatrix} 0 & 1 \\\\ -\\omega_0^2 & -2\\gamma \\end{bmatrix} Y$. The eigenvalues of this $2 \\times 2$ matrix are exactly the roots of the characteristic equation $r^2 + 2\\gamma r + \\omega_0^2 = 0$ from L2. Same roots, same solution structure — only the bookkeeping changed.</div></div>

<div class="l-note"><strong>Why this matters in practice.</strong> Numerical ODE solvers (such as <code>scipy.integrate.solve_ivp</code>) only handle first-order systems. Whenever you want to simulate a second- or higher-order equation, you must apply this reduction. It is the standard preprocessing step in numerical dynamics.</div>

<!-- ========================================================================
     SECTION 4
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">4. Eigenvalue Solutions for Constant $A$</h2>

<div class="calc-highlight"><strong>Core idea:</strong> Guess $X(t) = v \\, e^{\\lambda t}$ for some constant vector $v$ and scalar $\\lambda$. Substitute and the ODE becomes the eigenvalue equation $Av = \\lambda v$. Every eigenvector contributes one solution; superposition gives the general one.</div>

<p class="l-text">The single-variable equation $\\dot{x} = ax$ has solutions of the form $x(t) = c \\, e^{at}$. Inspired by this, try the vector ansatz $X(t) = v \\, e^{\\lambda t}$ with $v$ a constant vector and $\\lambda$ a scalar. Differentiating, $\\dot{X} = \\lambda v \\, e^{\\lambda t}$. Plugging into $\\dot{X} = AX$ and cancelling $e^{\\lambda t}$:</p>

<div class="calc-formula"><div class="formula-label">ANSATZ REDUCES TO EIGENVALUE PROBLEM</div><div class="formula-main">$$\\lambda v = A v$$</div><div class="formula-sub">This is exactly the eigenvalue equation from linear algebra L4!</div></div>

<p class="l-text">So $\\lambda$ must be an eigenvalue of $A$ and $v$ its corresponding eigenvector. For a generic $n \\times n$ matrix with $n$ distinct eigenvalues $\\lambda_1, \\ldots, \\lambda_n$ and eigenvectors $v_1, \\ldots, v_n$, the general solution is a linear combination:</p>

<div class="calc-formula"><div class="formula-label">GENERAL SOLUTION (DISTINCT EIGENVALUES)</div><div class="formula-main">$$X(t) = c_1 v_1 e^{\\lambda_1 t} + c_2 v_2 e^{\\lambda_2 t} + \\cdots + c_n v_n e^{\\lambda_n t}$$</div><div class="formula-sub">The constants $c_1, \\ldots, c_n$ are fixed by the initial condition $X(0) = X_0$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eigenvalues</div><div class="card-body">Each $\\lambda_i$ governs the growth or decay rate along direction $v_i$. Real positive $\\lambda$ explodes; real negative $\\lambda$ decays.</div></div>
<div class="calc-card"><div class="card-title">Eigenvectors</div><div class="card-body">Each $v_i$ is a fixed direction in state space where the system behaves like a 1D ODE with rate $\\lambda_i$.</div></div>
<div class="calc-card"><div class="card-title">Superposition</div><div class="card-body">The system in eigenvector coordinates decouples into $n$ independent 1D problems. We just sum the modes.</div></div>
<div class="calc-card"><div class="card-title">Initial Condition</div><div class="card-body">$X_0 = c_1 v_1 + \\cdots + c_n v_n$ expands $X_0$ in the eigenvector basis. The coefficients are the $c_i$.</div></div>
</div>

<p class="l-text">In words: the matrix is "diagonal" in the eigenbasis. Each eigenvector defines an independent channel where the system evolves like a single-variable exponential. Then you sum the channels. That is the entire story for distinct real eigenvalues.</p>

<div class="l-note"><strong>Diagonalization in disguise.</strong> If we let $P = [v_1 | v_2 | \\cdots | v_n]$ and $D = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$, then $A = PDP^{-1}$ and the change of variable $Y = P^{-1} X$ transforms $\\dot{X} = AX$ into the decoupled system $\\dot{Y} = DY$. Each $y_i$ obeys $\\dot{y}_i = \\lambda_i y_i$, solved instantly. The matrix exponential identity $e^{At} = P e^{Dt} P^{-1}$ is the linear-algebra restatement of the eigenvalue method.</div>

<!-- ========================================================================
     SECTION 5
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">5. Worked Example 1: Real Distinct Eigenvalues</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body">Solve $\\dot{X} = AX$ with $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 2 \\end{bmatrix}$ and initial condition $X(0) = \\begin{bmatrix} 0 \\\\ 5 \\end{bmatrix}$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Characteristic polynomial</div><div class="step-detail">$\\det(A - \\lambda I) = (1-\\lambda)(2-\\lambda) - 6 = \\lambda^2 - 3\\lambda - 4 = (\\lambda - 4)(\\lambda + 1)$. So $\\lambda_1 = 4$ and $\\lambda_2 = -1$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Eigenvector for $\\lambda_1 = 4$</div><div class="step-detail">Solve $(A - 4I)v = 0$: $\\begin{bmatrix} -3 & 2 \\\\ 3 & -2 \\end{bmatrix} v = 0$ gives $-3v_1 + 2v_2 = 0$, so $v_1 = \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix}$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Eigenvector for $\\lambda_2 = -1$</div><div class="step-detail">Solve $(A + I)v = 0$: $\\begin{bmatrix} 2 & 2 \\\\ 3 & 3 \\end{bmatrix} v = 0$ gives $v_1 + v_2 = 0$, so $v_2 = \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">General solution</div><div class="step-detail">$X(t) = c_1 \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} e^{4t} + c_2 \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} e^{-t}$.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Apply initial condition</div><div class="step-detail">$X(0) = c_1 \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} + c_2 \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 5 \\end{bmatrix}$ gives $2c_1 + c_2 = 0$ and $3c_1 - c_2 = 5$. Adding: $5c_1 = 5$, so $c_1 = 1$ and $c_2 = -2$.</div></div></div>
<div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Particular solution</div><div class="step-detail">$X(t) = \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} e^{4t} - 2 \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} e^{-t} = \\begin{bmatrix} 2e^{4t} - 2e^{-t} \\\\ 3e^{4t} + 2e^{-t} \\end{bmatrix}$. Done.</div></div></div>
</div>

<p class="l-text"><strong>Interpretation.</strong> The component along $v_1 = (2,3)^T$ grows like $e^{4t}$ (unstable mode), and the component along $v_2 = (1,-1)^T$ decays like $e^{-t}$ (stable mode). Long-term, the unstable mode dominates and every trajectory veers off along the line spanned by $v_1$. This is a <strong>saddle point</strong>, classified formally in Section 8.</p>

<div id="plot-tanks-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=200;var ts=[];var x1=[];var x2=[];for(var i=0;i<n;i++){var t=i*5/(n-1);ts.push(t);x1.push(50+50*Math.exp(-t/10));x2.push(50-50*Math.exp(-t/10));}
var t1={x:ts,y:x1,mode:"lines",name:"Tank 1 salt (g)",line:{color:"#3b82f6",width:3}};
var t2={x:ts,y:x2,mode:"lines",name:"Tank 2 salt (g)",line:{color:"#a78bfa",width:3,dash:"dash"}};
var t3={x:[0,5],y:[50,50],mode:"lines",name:"Equilibrium 50 g each",line:{color:"#f87171",width:1.5,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"time t (hours)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"salt mass (g)"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-tanks-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Two brine tanks initially holding 100 g and 0 g of salt exchange water and converge to the equilibrium of 50 g each. The coupling forces the system to a common average — a stable equilibrium driven by the negative eigenvalue mode of the matrix.</div></div>

<!-- ========================================================================
     SECTION 6
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">6. Worked Example 2: Complex Eigenvalues — Oscillation</h2>

<div class="calc-highlight"><strong>Geometric meaning:</strong> Complex eigenvalues mean rotation. Pure imaginary eigenvalues produce closed circular orbits; complex eigenvalues with a real part produce spirals — inward if the real part is negative, outward if positive. The system <em>rotates</em> in state space.</div>

<p class="l-text">Consider the matrix $A = \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix}$. This is the planar 90-degree rotation matrix. Its characteristic polynomial is $\\lambda^2 + 1 = 0$, giving the pure imaginary eigenvalues $\\lambda = \\pm i$. There are no real eigenvectors, but complex ones exist.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Complex eigenvector for $\\lambda = i$</div><div class="step-detail">$(A - iI)v = 0$ gives $-iv_1 + v_2 = 0$, so $v_2 = iv_1$ and $v = (1, i)^T$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Complex solution</div><div class="step-detail">$X(t) = (1, i)^T e^{it} = (1, i)^T (\\cos t + i \\sin t) = (\\cos t + i \\sin t,\\, -\\sin t + i \\cos t)^T$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Real and imaginary parts</div><div class="step-detail">Real part $X_R(t) = (\\cos t, -\\sin t)^T$. Imaginary part $X_I(t) = (\\sin t, \\cos t)^T$. Both are real solutions.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">General real solution</div><div class="step-detail">$X(t) = c_1 \\begin{bmatrix} \\cos t \\\\ -\\sin t \\end{bmatrix} + c_2 \\begin{bmatrix} \\sin t \\\\ \\cos t \\end{bmatrix}$. Closed circular orbits around the origin.</div></div></div>
</div>

<p class="l-text"><strong>General complex eigenvalue rule.</strong> If $\\lambda = \\alpha \\pm i\\beta$ is a complex conjugate pair with eigenvector $v = p + iq$, then two independent real solutions are</p>

<div class="calc-formula"><div class="formula-label">REAL SOLUTIONS FROM COMPLEX EIGENVALUES</div><div class="formula-main">$$X_R(t) = e^{\\alpha t} \\big( p \\cos \\beta t - q \\sin \\beta t \\big), \\quad X_I(t) = e^{\\alpha t} \\big( p \\sin \\beta t + q \\cos \\beta t \\big)$$</div><div class="formula-sub">The factor $e^{\\alpha t}$ controls amplitude; the trigonometric factor produces rotation at angular speed $\\beta$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\alpha < 0$</div><div class="card-body">Stable spiral. Trajectories rotate while shrinking inward to the origin. Damped oscillation.</div></div>
<div class="calc-card"><div class="card-title">$\\alpha > 0$</div><div class="card-body">Unstable spiral. Trajectories rotate while growing outward away from the origin.</div></div>
<div class="calc-card"><div class="card-title">$\\alpha = 0$</div><div class="card-body">Center. Closed periodic orbits. Pure rotation, no growth or decay.</div></div>
<div class="calc-card"><div class="card-title">Period</div><div class="card-body">Time for one full revolution is $T = 2\\pi / \\beta$. Larger $\\beta$ means faster rotation.</div></div>
</div>

<div id="plot-spiral-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=500;var xs=[];var ys=[];var t;
for(var i=0;i<n;i++){t=i*8/(n-1);xs.push(2*Math.exp(-0.25*t)*Math.cos(2*t));ys.push(2*Math.exp(-0.25*t)*Math.sin(2*t));}
var tr1={x:xs,y:ys,mode:"lines",name:"Stable spiral",line:{color:"#3b82f6",width:2.5}};
var tr2={x:[2],y:[0],mode:"markers",name:"Start (2,0)",marker:{color:"#22c55e",size:11,line:{color:"#ebe6dc",width:1}}};
var tr3={x:[0],y:[0],mode:"markers",name:"Equilibrium (0,0)",marker:{color:"#f87171",size:12,symbol:"x",line:{width:2}}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_1",range:[-2.2,2.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_2",scaleanchor:"x",range:[-2.2,2.2]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-spiral-en",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> A stable spiral trajectory in the phase plane for a system with complex eigenvalues $\\lambda = -0.25 \\pm 2i$. The trajectory rotates around the origin (the equilibrium) while losing amplitude, eventually converging to the fixed point. Real part of the eigenvalue sets the decay rate, imaginary part the rotation speed.</div></div>

<!-- ========================================================================
     SECTION 7
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">7. Worked Example 3: Repeated Eigenvalue</h2>

<div class="calc-highlight"><strong>Twist:</strong> If an eigenvalue has algebraic multiplicity 2 but only one independent eigenvector (a "defective" matrix), the second solution acquires a factor of $t$. Polynomial growth multiplied by exponential.</div>

<p class="l-text">Take $A = \\begin{bmatrix} 2 & 1 \\\\ 0 & 2 \\end{bmatrix}$, a Jordan block. Characteristic polynomial $(2 - \\lambda)^2 = 0$ gives $\\lambda = 2$ repeated. Solving $(A - 2I)v = 0$ yields $\\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix} v = 0$, so $v_2 = 0$ and the only eigenvector is $v_1 = (1, 0)^T$. We are one eigenvector short.</p>

<p class="l-text">The first solution is the standard exponential mode: $X_1(t) = v_1 e^{2t}$. For the second, try the ansatz $X_2(t) = (v_1 t + w) e^{2t}$ with $w$ a vector to be determined. Substituting into $\\dot{X} = AX$:</p>

<div class="calc-formula"><div class="formula-label">GENERALIZED EIGENVECTOR EQUATION</div><div class="formula-main">$$(A - 2I) w = v_1$$</div><div class="formula-sub">$w$ is called a generalized eigenvector. It lifts the missing direction of the defective matrix.</div></div>

<p class="l-text">Solving $\\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix} w = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$ gives $w_2 = 1$ and $w_1$ free. Pick $w = (0, 1)^T$. The general solution is then</p>

<div class="calc-formula"><div class="formula-label">GENERAL SOLUTION (REPEATED EIGENVALUE)</div><div class="formula-main">$$X(t) = c_1 \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} e^{2t} + c_2 \\Bigg( t \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} \\Bigg) e^{2t}$$</div></div>

<div class="l-note"><strong>Why the extra $t$ factor.</strong> When a matrix is defective (geometric multiplicity less than algebraic multiplicity), it cannot be diagonalized. Its Jordan normal form has a "1" above the diagonal of the repeated block, and that off-diagonal coupling injects a polynomial factor into the matrix exponential: $e^{Jt}$ contains terms $t^k e^{\\lambda t}$ for $k = 0, 1, \\ldots, m - 1$ where $m$ is the size of the Jordan block.</div>

<!-- ========================================================================
     SECTION 8
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">8. Phase Portraits & Equilibrium Classification</h2>

<div class="calc-highlight"><strong>The geometric heart:</strong> A 2D linear system has an equilibrium at the origin (since $A \\cdot 0 = 0$). The eigenvalues of $A$ tell you everything about the local geometry of trajectories near that equilibrium. Six standard shapes cover almost every case.</div>

<p class="l-text">An <strong>equilibrium</strong> (or fixed point) of $\\dot{X} = AX$ is any point $X^*$ with $AX^* = 0$. For invertible $A$ the only equilibrium is $X^* = 0$, the origin. The behavior of trajectories near the equilibrium is dictated by the eigenvalues $\\lambda_1, \\lambda_2$ of $A$:</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">REAL EIGENVALUES</div>
<div class="compare-item">Stable node: both $\\lambda < 0$ — trajectories converge along eigenvectors</div>
<div class="compare-item">Unstable node: both $\\lambda > 0$ — trajectories diverge along eigenvectors</div>
<div class="compare-item">Saddle: one $\\lambda > 0$, one $\\lambda < 0$ — unstable, hyperbolic flow</div>
</div>
<div class="compare-col">
<div class="compare-title">COMPLEX EIGENVALUES</div>
<div class="compare-item">Stable spiral: $\\text{Re}(\\lambda) < 0$ — rotating inward decay</div>
<div class="compare-item">Unstable spiral: $\\text{Re}(\\lambda) > 0$ — rotating outward growth</div>
<div class="compare-item">Center: $\\text{Re}(\\lambda) = 0$ — closed periodic orbits</div>
</div>
</div>

<p class="l-text">The classification by trace $\\tau = \\text{tr}(A) = \\lambda_1 + \\lambda_2$ and determinant $\\Delta = \\det(A) = \\lambda_1 \\lambda_2$ gives a complete picture without computing eigenvalues:</p>

<div class="calc-formula"><div class="formula-label">TRACE-DETERMINANT DIAGRAM</div><div class="formula-main">$$\\Delta < 0 \\Rightarrow \\text{saddle}, \\quad \\Delta > 0 \\text{ and } \\tau^2 - 4\\Delta > 0 \\Rightarrow \\text{node}, \\quad \\Delta > 0 \\text{ and } \\tau^2 - 4\\Delta < 0 \\Rightarrow \\text{spiral/center}$$</div><div class="formula-sub">Stable if $\\tau < 0$, unstable if $\\tau > 0$. Center exactly when $\\tau = 0$ and $\\Delta > 0$.</div></div>

<div id="plot-phase-portraits-en" class="plotly-graph"></div>
<script>setTimeout(function(){
function vfield(F,xmin,xmax,ymin,ymax,nx,ny,col,name){
  var xs=[];var ys=[];var u=[];var v=[];var i,j,x,y,d;
  for(i=0;i<nx;i++){for(j=0;j<ny;j++){x=xmin+(xmax-xmin)*i/(nx-1);y=ymin+(ymax-ymin)*j/(ny-1);d=F(x,y);xs.push(x);ys.push(y);u.push(d[0]);v.push(d[1]);}}
  var x2=[];var y2=[];for(i=0;i<xs.length;i++){var nrm=Math.sqrt(u[i]*u[i]+v[i]*v[i])+1e-9;var sc=0.15/nrm;x2.push(xs[i]);x2.push(xs[i]+u[i]*sc);x2.push(null);y2.push(ys[i]);y2.push(ys[i]+v[i]*sc);y2.push(null);}
  return {x:x2,y:y2,mode:"lines",line:{color:col,width:1},showlegend:false,name:name};
}
var systems=[
 {n:"Stable node",F:function(x,y){return[-x,-2*y];}},
 {n:"Unstable node",F:function(x,y){return[x,2*y];}},
 {n:"Saddle",F:function(x,y){return[x,-y];}},
 {n:"Stable spiral",F:function(x,y){return[-0.3*x+y,-x-0.3*y];}},
 {n:"Unstable spiral",F:function(x,y){return[0.3*x+y,-x+0.3*y];}},
 {n:"Center",F:function(x,y){return[y,-x];}}
];
var fig={data:[],layout:{paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:11},grid:{rows:2,columns:3,pattern:"independent"},margin:{t:60,r:20,b:30,l:30},showlegend:false,height:520}};
for(var s=0;s<6;s++){
  var ax="x"+(s+1);var ay="y"+(s+1);
  var vf=vfield(systems[s].F,-1.8,1.8,-1.8,1.8,9,9,"rgba(167,139,250,0.55)",systems[s].n);vf.xaxis=ax;vf.yaxis=ay;fig.data.push(vf);
  var trj={x:[],y:[],mode:"lines",line:{color:"#3b82f6",width:2},xaxis:ax,yaxis:ay,showlegend:false};
  var x=1.3;var y=0.4;var dt=0.02;for(var k=0;k<400;k++){var d=systems[s].F(x,y);x+=d[0]*dt;y+=d[1]*dt;if(Math.abs(x)>3||Math.abs(y)>3)break;trj.x.push(x);trj.y.push(y);}
  fig.data.push(trj);
  fig.layout[ax==="x1"?"xaxis":"xaxis"+(s+1)]={range:[-2,2],showgrid:false,zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",title:systems[s].n,titlefont:{color:"#ebe6dc",size:11}};
  fig.layout[ay==="y1"?"yaxis":"yaxis"+(s+1)]={range:[-2,2],showgrid:false,zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",scaleanchor:ax};
}
Plotly.newPlot("plot-phase-portraits-en",fig.data,fig.layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Six canonical phase portraits for 2D linear systems. Purple arrows show the velocity field $\\dot{X} = AX$ at each point. Blue curves show a sample trajectory starting near $(1.3, 0.4)$. The shape — node, saddle, spiral, or center — is dictated entirely by the eigenvalue spectrum of $A$.</div></div>

<div class="l-note"><strong>Why this classification is decisive.</strong> Every 2D constant-coefficient linear system in the world has a phase portrait that is one of these six types (plus a few degenerate borderline cases such as star nodes when $A = \\lambda I$). For practical applications — predicting whether a pendulum returns to rest, whether a chemical reactor stabilizes, whether an orbit closes — eigenvalue classification is the first thing you compute.</div>

<!-- ========================================================================
     SECTION 9
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">9. Nonlinear Systems & Linearization</h2>

<div class="calc-highlight"><strong>Reality bites:</strong> Real systems are almost never linear. But near an equilibrium, the nonlinear system behaves like its linearization. The same eigenvalue classification applies — locally.</div>

<p class="l-text">A general nonlinear autonomous system has the form $\\dot{X} = F(X)$ where $F: \\mathbb{R}^n \\to \\mathbb{R}^n$ is a smooth vector field. An <strong>equilibrium</strong> is any point $X^*$ where $F(X^*) = 0$. Near $X^*$ we Taylor-expand: $F(X) \\approx F(X^*) + J(X - X^*) = J(X - X^*)$, where $J$ is the <strong>Jacobian matrix</strong> of $F$ evaluated at $X^*$:</p>

<div class="calc-formula"><div class="formula-label">JACOBIAN MATRIX</div><div class="formula-main">$$J_{ij} = \\frac{\\partial F_i}{\\partial x_j} \\bigg|_{X = X^*}$$</div><div class="formula-sub">Linear approximation of $F$ near the equilibrium $X^*$.</div></div>

<p class="l-text">The classical predator-prey example, due to Lotka and Volterra (1925-1926), illustrates this perfectly. Let $x$ be the prey population (rabbits) and $y$ the predator population (foxes):</p>

<div class="calc-formula"><div class="formula-label">LOTKA-VOLTERRA SYSTEM</div><div class="formula-main">$$\\dot{x} = \\alpha x - \\beta x y, \\qquad \\dot{y} = \\delta x y - \\gamma y$$</div><div class="formula-sub">$\\alpha$: prey growth rate. $\\beta$: predation rate. $\\delta$: predator efficiency. $\\gamma$: predator death rate.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Find equilibria: set both rates to zero</div><div class="step-detail">$x(\\alpha - \\beta y) = 0$ and $y(\\delta x - \\gamma) = 0$. Two solutions: trivial $X^*_0 = (0, 0)$ (extinction) and coexistence $X^*_1 = (\\gamma/\\delta, \\alpha/\\beta)$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Compute the Jacobian at general $(x, y)$</div><div class="step-detail">$J(x, y) = \\begin{bmatrix} \\alpha - \\beta y & -\\beta x \\\\ \\delta y & \\delta x - \\gamma \\end{bmatrix}$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Classify $X^*_0 = (0, 0)$</div><div class="step-detail">$J(0,0) = \\begin{bmatrix} \\alpha & 0 \\\\ 0 & -\\gamma \\end{bmatrix}$. Eigenvalues $\\alpha > 0$ and $-\\gamma < 0$. Saddle point. Unstable.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Classify $X^*_1 = (\\gamma/\\delta, \\alpha/\\beta)$</div><div class="step-detail">$J(X^*_1) = \\begin{bmatrix} 0 & -\\beta \\gamma / \\delta \\\\ \\delta \\alpha / \\beta & 0 \\end{bmatrix}$. Eigenvalues $\\pm i\\sqrt{\\alpha \\gamma}$. Pure imaginary — a center in the linearization.</div></div></div>
</div>

<p class="l-text">The linearization at the coexistence equilibrium predicts a center: closed periodic orbits. Remarkably, the full nonlinear Lotka-Volterra system also has closed periodic orbits around $X^*_1$ — a special feature of this model, not guaranteed in general. Below we plot both the orbit in phase space and the time series.</p>

<div id="plot-lv-phase-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0,b=0.5,d=0.4,g=0.6;
function rhs(s){return[a*s[0]-b*s[0]*s[1],d*s[0]*s[1]-g*s[1]];}
function rk4(s,h){var k1=rhs(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=rhs(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=rhs(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=rhs(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var data=[];var cols=["#3b82f6","#a78bfa","#22c55e"];var starts=[[2,1],[3,1.5],[1.5,0.8]];
for(var k=0;k<3;k++){var xs=[];var ys=[];var s=starts[k].slice();for(var i=0;i<3000;i++){xs.push(s[0]);ys.push(s[1]);s=rk4(s,0.01);}
  data.push({x:xs,y:ys,mode:"lines",name:"orbit "+(k+1)+" — start ("+starts[k][0]+","+starts[k][1]+")",line:{color:cols[k],width:2}});}
data.push({x:[g/d],y:[a/b],mode:"markers",name:"Equilibrium ("+(g/d).toFixed(2)+","+(a/b).toFixed(2)+")",marker:{color:"#f87171",size:11,symbol:"x",line:{width:2}}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"prey x (thousands)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"predator y (thousands)"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-lv-phase-en",data,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Lotka-Volterra orbits in the phase plane (prey on x-axis, predator on y-axis). Three different starting conditions trace three closed curves around the coexistence equilibrium. The orbits never spiral inward or outward — populations oscillate periodically forever in this idealized model.</div></div>

<div id="plot-lv-time-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0,b=0.5,d=0.4,g=0.6;
function rhs(s){return[a*s[0]-b*s[0]*s[1],d*s[0]*s[1]-g*s[1]];}
function rk4(s,h){var k1=rhs(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=rhs(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=rhs(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=rhs(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var ts=[];var xs=[];var ys=[];var s=[2,1];var dt=0.05;for(var i=0;i<800;i++){ts.push(i*dt);xs.push(s[0]);ys.push(s[1]);s=rk4(s,dt);}
var t1={x:ts,y:xs,mode:"lines",name:"prey x(t)",line:{color:"#3b82f6",width:2.5}};
var t2={x:ts,y:ys,mode:"lines",name:"predator y(t)",line:{color:"#a78bfa",width:2.5,dash:"dash"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"time t"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"population"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-lv-time-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Lotka-Volterra time series: prey (blue) peaks just before predator (purple), then declines as predators consume them, then predators decline from lack of food, then prey recover. The classic phase-shifted oscillation observed in real ecological data (Canadian lynx-hare cycles, for example).</div></div>

<!-- ========================================================================
     SECTION 10
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">10. Stability — Hartman-Grobman & Lyapunov</h2>

<div class="calc-highlight"><strong>How far does linearization take us?</strong> The Hartman-Grobman theorem says: near a hyperbolic equilibrium (no eigenvalue with zero real part), the nonlinear flow is topologically equivalent to its linearization. For non-hyperbolic cases — a center, for instance — linearization can fail, and we need stronger tools like Lyapunov functions.</div>

<p class="l-text"><strong>Hartman-Grobman theorem (informal).</strong> Let $X^*$ be an equilibrium of $\\dot{X} = F(X)$ and let $J$ be the Jacobian at $X^*$. If none of the eigenvalues of $J$ has zero real part (the equilibrium is called <em>hyperbolic</em>), then there is a homeomorphism of a neighborhood of $X^*$ that maps trajectories of the nonlinear system to trajectories of the linear system $\\dot{Y} = JY$. The local picture is determined entirely by eigenvalue signs.</p>

<p class="l-text">Non-hyperbolic equilibria are subtler. A center in the linearization can become a stable spiral, unstable spiral, or remain a center in the full nonlinear system — the linear theory is silent. Higher-order terms decide the outcome.</p>

<p class="l-text"><strong>Lyapunov functions</strong> provide a global tool. A function $V: \\mathbb{R}^n \\to \\mathbb{R}$ is called a Lyapunov function for $X^*$ if it has a strict minimum at $X^*$ and its derivative along trajectories is nonpositive:</p>

<div class="calc-formula"><div class="formula-label">LYAPUNOV STABILITY</div><div class="formula-main">$$\\dot{V}(X) = \\nabla V(X) \\cdot F(X) \\leq 0$$</div><div class="formula-sub">If $\\dot{V} < 0$ strictly off the equilibrium, $X^*$ is asymptotically stable.</div></div>

<p class="l-text">Geometrically: a Lyapunov function acts like an energy bowl. Trajectories slide downhill on the surface $V(X)$, never climbing. This gives stability without ever computing a single eigenvalue. For mechanical systems with friction, total energy is a natural Lyapunov function; for the Lotka-Volterra system, $V(x, y) = \\delta x - \\gamma \\ln x + \\beta y - \\alpha \\ln y$ is conserved exactly, confirming the closed orbits.</p>

<div class="l-note"><strong>Looking ahead to L8.</strong> Linear systems with constant coefficients are completely understood. The matrix exponential and eigenvalue methods extend to time-varying linear systems via fundamental matrices and to nonlinear ones via numerical integration. The neural-ODE framework studied in L8 treats $\\dot{X} = f_\\theta(X, t)$ with a learned vector field $f_\\theta$, and the Jacobian linearization developed here is exactly the local analysis tool used to study its stability.</div>

<!-- ========================================================================
     SECTION 11 — Practical Pyodide Exercise
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">11. Practical Pyodide Exercise</h2>

<p class="l-text">This computational lab ties everything together. You enter a $2 \\times 2$ matrix $A$, the code computes its eigenvalues and classifies the resulting equilibrium, then numerically integrates $\\dot{X} = AX$ from several initial conditions and overlays the trajectories on a vector field. The second part simulates the full nonlinear Lotka-Volterra system, showing the closed orbits and time series.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · LINEAR PHASE PORTRAIT</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.integrate <span class="kw">import</span> solve_ivp

<span class="cm"># --- Enter your 2x2 matrix here --------------------------------------</span>
A = np.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">2</span>],
              [<span class="num">3</span>, <span class="num">2</span>]], dtype=<span class="fn">float</span>)

<span class="cm"># --- Eigenvalues and classification ----------------------------------</span>
evals, evecs = np.linalg.<span class="fn">eig</span>(A)
tau = np.<span class="fn">trace</span>(A)
det = np.linalg.<span class="fn">det</span>(A)
disc = tau**<span class="num">2</span> - <span class="num">4</span>*det
<span class="fn">print</span>(<span class="str">f"Eigenvalues: {evals}"</span>)
<span class="fn">print</span>(<span class="str">f"trace = {tau:.3f}, det = {det:.3f}, discriminant = {disc:.3f}"</span>)

<span class="kw">def</span> <span class="fn">classify</span>(evals, tau, det):
    re = np.<span class="fn">real</span>(evals)
    im = np.<span class="fn">imag</span>(evals)
    <span class="kw">if</span> np.<span class="fn">allclose</span>(im, <span class="num">0</span>):
        <span class="kw">if</span> det &lt; <span class="num">0</span>:
            <span class="kw">return</span> <span class="str">"SADDLE (unstable)"</span>
        <span class="kw">if</span> np.<span class="fn">all</span>(re &lt; <span class="num">0</span>):
            <span class="kw">return</span> <span class="str">"STABLE NODE"</span>
        <span class="kw">if</span> np.<span class="fn">all</span>(re &gt; <span class="num">0</span>):
            <span class="kw">return</span> <span class="str">"UNSTABLE NODE"</span>
    <span class="kw">else</span>:
        <span class="kw">if</span> np.<span class="fn">allclose</span>(re, <span class="num">0</span>):
            <span class="kw">return</span> <span class="str">"CENTER (closed orbits)"</span>
        <span class="kw">if</span> re[<span class="num">0</span>] &lt; <span class="num">0</span>:
            <span class="kw">return</span> <span class="str">"STABLE SPIRAL"</span>
        <span class="kw">return</span> <span class="str">"UNSTABLE SPIRAL"</span>
    <span class="kw">return</span> <span class="str">"degenerate"</span>

<span class="fn">print</span>(<span class="str">f"Equilibrium type: {classify(evals, tau, det)}"</span>)

<span class="cm"># --- Numerical integration from several initial conditions -----------</span>
<span class="kw">def</span> <span class="fn">rhs</span>(t, X):
    <span class="kw">return</span> A @ X

t_span = (<span class="num">0</span>, <span class="num">2</span>)
inits = [[<span class="num">1</span>, <span class="num">0</span>], [<span class="num">0</span>, <span class="num">1</span>], [-<span class="num">1</span>, <span class="num">1</span>], [<span class="num">1</span>, -<span class="num">1</span>], [<span class="num">0.5</span>, <span class="num">0.5</span>]]
<span class="kw">for</span> X0 <span class="kw">in</span> inits:
    sol = <span class="fn">solve_ivp</span>(rhs, t_span, X0, t_eval=np.<span class="fn">linspace</span>(*t_span, <span class="num">100</span>))
    <span class="fn">print</span>(<span class="str">f"X0={X0}: X(2) = [{sol.y[0,-1]:+.3f}, {sol.y[1,-1]:+.3f}]"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON · LOTKA-VOLTERRA SIMULATION</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.integrate <span class="kw">import</span> solve_ivp

<span class="cm"># --- Lotka-Volterra parameters ---------------------------------------</span>
alpha = <span class="num">1.0</span>   <span class="cm"># prey birth rate</span>
beta  = <span class="num">0.5</span>   <span class="cm"># predation rate</span>
delta = <span class="num">0.4</span>   <span class="cm"># predator efficiency</span>
gamma = <span class="num">0.6</span>   <span class="cm"># predator death rate</span>

<span class="kw">def</span> <span class="fn">lv</span>(t, X):
    x, y = X
    <span class="kw">return</span> [alpha*x - beta*x*y, delta*x*y - gamma*y]

<span class="cm"># --- Coexistence equilibrium and Jacobian ----------------------------</span>
xstar, ystar = gamma/delta, alpha/beta
J = np.<span class="fn">array</span>([[alpha - beta*ystar, -beta*xstar],
              [delta*ystar,         delta*xstar - gamma]])
<span class="fn">print</span>(<span class="str">f"Equilibrium: ({xstar:.3f}, {ystar:.3f})"</span>)
<span class="fn">print</span>(<span class="str">f"Jacobian eigenvalues: {np.linalg.eigvals(J)}"</span>)
<span class="fn">print</span>(<span class="str">f"Predicted angular frequency: {np.sqrt(alpha*gamma):.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"Predicted period: {2*np.pi/np.sqrt(alpha*gamma):.4f}"</span>)

<span class="cm"># --- Integrate from three different initial populations --------------</span>
t_span = (<span class="num">0</span>, <span class="num">40</span>)
t_eval = np.<span class="fn">linspace</span>(*t_span, <span class="num">1000</span>)
<span class="kw">for</span> X0 <span class="kw">in</span> [[<span class="num">2</span>, <span class="num">1</span>], [<span class="num">3</span>, <span class="num">1.5</span>], [<span class="num">1.5</span>, <span class="num">0.8</span>]]:
    sol = <span class="fn">solve_ivp</span>(lv, t_span, X0, t_eval=t_eval, rtol=<span class="num">1e-8</span>)
    peak_prey = sol.y[<span class="num">0</span>].<span class="fn">max</span>()
    peak_pred = sol.y[<span class="num">1</span>].<span class="fn">max</span>()
    <span class="fn">print</span>(<span class="str">f"X0={X0}: peak prey={peak_prey:.2f}, peak predator={peak_pred:.2f}"</span>)

<span class="cm"># --- Conserved quantity (Lotka-Volterra first integral) --------------</span>
<span class="kw">def</span> <span class="fn">V</span>(x, y):
    <span class="kw">return</span> delta*x - gamma*np.<span class="fn">log</span>(x) + beta*y - alpha*np.<span class="fn">log</span>(y)
<span class="fn">print</span>(<span class="str">f"V at start: {V(2, 1):.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"V at t=40:  {V(sol.y[0,-1], sol.y[1,-1]):.6f}"</span>)
<span class="fn">print</span>(<span class="str">"(should match — V is conserved along orbits)"</span>)</code></pre></div>

<div id="plot-linearization-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0,b=0.5,d=0.4,g=0.6;
var xs=g/d,ys=a/b;
function nl(s){return[a*s[0]-b*s[0]*s[1],d*s[0]*s[1]-g*s[1]];}
function lin(s){var dx=s[0]-xs;var dy=s[1]-ys;var J=[[0,-b*g/d],[d*a/b,0]];return[J[0][0]*dx+J[0][1]*dy,J[1][0]*dx+J[1][1]*dy];}
function rk4(s,h,fn){var k1=fn(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=fn(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=fn(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=fn(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var sN=[xs+0.3,ys+0.2];var sL=sN.slice();var xn=[];var yn=[];var xl=[];var yl=[];for(var i=0;i<2500;i++){xn.push(sN[0]);yn.push(sN[1]);xl.push(sL[0]);yl.push(sL[1]);sN=rk4(sN,0.01,nl);sL=rk4(sL,0.01,lin);}
var t1={x:xn,y:yn,mode:"lines",name:"Nonlinear orbit",line:{color:"#3b82f6",width:2.5}};
var t2={x:xl,y:yl,mode:"lines",name:"Linearized orbit",line:{color:"#f87171",width:2,dash:"dash"}};
var t3={x:[xs],y:[ys],mode:"markers",name:"Equilibrium",marker:{color:"#22c55e",size:11,symbol:"x",line:{width:2}}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"prey x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"predator y"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-linearization-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Two orbits launched from the same point near the Lotka-Volterra coexistence equilibrium: the nonlinear orbit (blue) follows the true closed curve, while the linearized orbit (red dashed) traces a perfect ellipse around the equilibrium. The match is excellent near the equilibrium and worsens as orbits stray farther — the validity range of linearization.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Try changing $\\beta$ or $\\delta$ in the simulation and watch how the equilibrium location moves while the eigenvalue product $\\alpha \\gamma$ — and thus the period $2\\pi / \\sqrt{\\alpha \\gamma}$ — depends only on the prey birth rate and predator death rate. The interaction strengths shape the orbit amplitude, not its frequency.</div></div>

<p class="l-text">In the next lesson we leave systems of ODEs behind and meet partial differential equations, where derivatives are taken with respect to multiple independent variables (space <em>and</em> time). The matrix-eigenvalue toolbox you built here generalizes to differential operators, and the same classification idea (parabolic, hyperbolic, elliptic) controls the qualitative behavior of solutions.</p>
`,

/* ============================================================================
   TURKISH VERSION
   ============================================================================ */
tr: `
<p class="l-text"><strong>Gerçek dünya sistemleri nadiren tek bir niceliğin tek başına değişmesinden ibarettir.</strong> Borularla birbirine bağlanmış iki tuz suyu tankı. Avının üzerinden çoğalan avcı popülasyonu. Birlikte titreşen kuplajlı yaylar. Bobin üzerinden birbirine bağlı elektron akımları. Bunların her biri bir diferansiyel denklem <em>sistemidir</em> — pek çok değişken, hepsi aynı anda evrilen, her biri diğerlerine bağımlı. Bu derste birbirine bağlı denklemler yumağını tek bir zarif matris denklemine dönüştürüyor ve dinamik sistemlerin geometrik kalbini açığa çıkarıyoruz.</p>

<p class="l-text">"ODE sistemi"nden "matris denklemine" geçiş, sadece notasyon değişimi değildir. Bir lineer sistemi $\\dot{X} = AX$ olarak yazdığınız anda lineer cebirin tüm makinesi — özdeğerler, özvektörler, köşegenleştirme — devreye girer ve size kapalı-form çözümler verir, uzun-dönem davranışı sınıflandırır, düzlemdeki her bir yörüngenin nasıl evrileceğini gösteren oklarla faz portreleri çizer. Doğrusal olmayan sistemler için aynı makine, lineerleştirme yoluyla denge etrafındaki yerel görüntüyü ele alır. Bu, dinamik sistem teorisinin geometrik ve hesaplamalı kalbidir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Birinci mertebe lineer ODE sistemini kompakt matris formu $\\dot{X} = AX$ olarak yazmayı</li>
<li>n. mertebeden bir ODE'yi yardımcı değişkenler ekleyerek birinci mertebe sisteme indirgemeyi</li>
<li>$\\dot{X} = AX$ sistemini katsayı matrisinin özdeğer ve özvektörleriyle çözmeyi</li>
<li>Reel ayrık, kompleks eşlenik ve katlı özdeğer durumlarını doğru çözüm şablonuyla ele almayı</li>
<li>2B dengeleri özdeğer spektrumundan node, eyer, spiral veya merkez olarak sınıflamayı</li>
<li>Doğrusal olmayan sistemi denge etrafında Jacobian ile lineerleştirip yerel kararlılığı okumayı</li>
</ul>
</div>

<!-- ========================================================================
     BÖLÜM 1
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">1. Neden Sistem? Tek ODE'den Kuplajlı Denklemlere</h2>

<div class="calc-highlight"><strong>Günlük tablo:</strong> 100 L tuz suyu tutan iki büyük tank, iki boru ile birbirine bağlı ve her yönde 5 L/dk pompa ile su transferi yapılıyor. Tuz suda çözünüyor ve suyla birlikte akıyor. 1. tankın tuz derişimi, 2. tanktan gelene bağlı — o da 2. tankın derişimine bağlı, o da 1. tanktan gelene. İki denklem birbirinden ayrılmak istemiyor. <em>Kuplajlılar</em>.</div>

<p class="l-text">$x_1(t)$ ve $x_2(t)$, $t$ anında 1. ve 2. tanktaki tuz kütlesi (gram cinsinden) olsun. Her tank 100 L tutuyor ve diğerle 5 L/dk değişim yapıyor. 1. tankın derişimi $x_1/100$ g/L, o halde 1. tanktan çıkıp (ve 2. tanka giren) tuz hızı $5 \\cdot x_1/100 = x_1/20$ g/dk. Aynı mantıkla, 2. tanktan 1. tanka tuz akış hızı $x_2/20$. Her tank için kütle dengesi:</p>

<div class="calc-formula"><div class="formula-label">İKİ KUPLAJLI BİRİNCİ MERTEBE ODE</div><div class="formula-main">$$\\frac{dx_1}{dt} = -\\frac{x_1}{20} + \\frac{x_2}{20}, \\qquad \\frac{dx_2}{dt} = \\frac{x_1}{20} - \\frac{x_2}{20}$$</div><div class="formula-sub">Her hız iki bilinmeyene de bağlı. Birini diğeri olmadan çözemezsiniz.</div></div>

<p class="l-text">Hiçbir denklem L1 veya L2 tekniğiyle tek başına çözülemez. Değişkenleri ayıramazsınız, birini diğerini bilmeden entegre edemezsiniz ve denklemleri ayrıştıracak akıllıca bir substitüsyon yok. İki bilinmeyen fizik tarafından <strong>birbirine kilitlenmiş</strong>. ODE sisteminin özü budur: çok sayıda bilinmeyen, çok sayıda denklem, hepsi karşılıklı içiçe geçmiş.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kuplajlı</div><div class="card-body">Her denklem birden çok bilinmeyen içerir. İzole şekilde çözemezsiniz.</div></div>
<div class="calc-card"><div class="card-title">Birinci mertebe</div><div class="card-body">Her denklem yalnızca birinci türevleri içerir. n. mertebe sistemler bu duruma indirgenir.</div></div>
<div class="calc-card"><div class="card-title">Lineer</div><div class="card-body">Sağ taraflar, bilinmeyenlerin lineer kombinasyonlarıdır. Doğrusal olmayan sistemler Bölüm 9'da.</div></div>
<div class="calc-card"><div class="card-title">Otonom</div><div class="card-body">Sağ tarafta açık $t$ yok. Akış kuralı her anda aynı.</div></div>
</div>

<p class="l-text">Aynı kalıbı izleyen diğer klasik örnekler: ormandaki avcı ve av popülasyonları, ortak bir yayda asılı iki kütle, bobinle kuplajlı iki kondansatör, sürekli reaktördeki iki kimyasal tür, yer çekimi altındaki bir gezegenin konumu ve momentumu. Hiçbiri tek denklem olarak çözülmez. Hepsi sistemdir.</p>

<div class="l-note"><strong>Notasyon kuralı.</strong> Bu ders boyunca zaman türevi için üst-nokta kullanıyoruz: $\\dot{x} = dx/dt$. Bu, dinamik alanında standarttır ve yazımı kısaltır. Vektör formundaki $\\dot{X}$, "X'in her bileşeninin zamanla türevi" anlamına gelir.</div>

<!-- ========================================================================
     BÖLÜM 2
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">2. Matris Formu $\\dot{X} = AX$</h2>

<div class="calc-highlight"><strong>Temel fikir:</strong> Bilinmeyenleri bir vektörde, katsayıları bir matriste yığınlayın. İki skaler denklemden oluşan kuplajlı sistem, tek bir vektör denklemine dönüşür. Oradan itibaren lineer cebirin tüm araçları kullanılabilir.</div>

<p class="l-text">Tuz suyu tanklarına geri dönerek, durum vektörünü ve katsayı matrisini tanımlayalım:</p>

<div class="calc-formula"><div class="formula-label">DURUM VEKTÖRÜ VE KATSAYI MATRİSİ</div><div class="formula-main">$$X(t) = \\begin{bmatrix} x_1(t) \\\\ x_2(t) \\end{bmatrix}, \\qquad A = \\begin{bmatrix} -1/20 & 1/20 \\\\ 1/20 & -1/20 \\end{bmatrix}$$</div></div>

<p class="l-text">Bu tanımlamalarla iki kuplajlı skaler ODE, tek bir vektör ODE'ye çöker:</p>

<div class="calc-formula"><div class="formula-label">MATRİS FORMU (SABİT KATSAYILI LİNEER SİSTEM)</div><div class="formula-main">$$\\dot{X} = AX$$</div><div class="formula-sub">n adet kuplajlı skaler denklemi tek seferde yakalayan bir vektör denklemi.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durum Vektörü $X$</div><div class="card-body">$X(t) \\in \\mathbb{R}^n$ vektörü tüm bilinmeyen fonksiyonları listeler. Zamanla $\\mathbb{R}^n$ içinde bir eğri çizer.</div></div>
<div class="calc-card"><div class="card-title">Katsayı Matrisi $A$</div><div class="card-body">$n \\times n$ boyutlu $A$ matrisi, her bileşenin diğerlerini nasıl etkilediğini kodlar. Burada sabit girdiler; zamanla değişen $A(t)$ daha zordur.</div></div>
<div class="calc-card"><div class="card-title">Türev $\\dot{X}$</div><div class="card-body">Bileşen bileşen: $\\dot{X}_i = dx_i/dt$. $X$ noktasındaki tam hız vektörü.</div></div>
<div class="calc-card"><div class="card-title">Başlangıç Koşulu</div><div class="card-body">IVP, $X(0) = X_0$ değerini verir — $\\mathbb{R}^n$ içinde tek nokta. Çözüm eğrisi bu noktadan biricik şekilde belirlenir.</div></div>
</div>

<p class="l-text">Sistem için başlangıç değer problemi, L1'deki skaler durumun tam karşılığıdır, sadece veriler skaler yerine vektör:</p>

<div class="calc-formula"><div class="formula-label">VEKTÖR BAŞLANGIÇ DEĞER PROBLEMİ</div><div class="formula-main">$$\\dot{X} = AX, \\qquad X(0) = X_0 \\in \\mathbb{R}^n$$</div><div class="formula-sub">Varlık ve teklik teoremi: sabit $A$ için her $t \\in \\mathbb{R}$'de tek bir çözüm vardır.</div></div>

<p class="l-text">Bu yeniden yazımın gücü şudur: skaler denklem $\\dot{x} = ax$ basit çözüme sahiptir, $x(t) = x_0 e^{at}$. Vektör denklemi $\\dot{X} = AX$'in formal çözümü $X(t) = e^{At} X_0$, burada $e^{At}$ <strong>matris üstelidir</strong>. Matris üstelini doğrudan hesaplamayacağız; bunun yerine Bölüm 4, özdeğer ve özvektörlerin bize açık kapalı-form çözümünü verdiğini gösterir.</p>

<div class="l-note"><strong>Lineerlik bonusu.</strong> $\\dot{X} = AX$'in çözüm kümesi $n$ boyutlu bir vektör uzayı oluşturur. Çözümlerin herhangi bir lineer kombinasyonu da bir çözümdür. Bu, ruh olarak L2'deki ikinci mertebe lineer durumla aynı olan <em>süperpozisyon ilkesidir</em> — ama şimdi tam vektör genelliği ile.</div>

<!-- ========================================================================
     BÖLÜM 3
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">3. Dönüşüm: n. Mertebe ODE $\\leftrightarrow$ Birinci Mertebe Sistem</h2>

<div class="calc-highlight"><strong>Eşdeğerlik:</strong> Tek bilinmeyenli her n. mertebeden ODE, $n$ bilinmeyenli birinci mertebeden sisteme eşdeğerdir. Matris formunun tüm manzarayı kapsamasının nedeni budur — ikinci mertebe yay denklemleri, üçüncü mertebe kiriş denklemleri, L2'nin tamamı — ayrı teoriye ihtiyaç olmadan.</div>

<p class="l-text">Tarif mekaniktir. Şu biçimde bir n. mertebe ODE'niz olduğunu düşünün:</p>

<div class="calc-formula"><div class="formula-label">GENEL n. MERTEBE LİNEER ODE</div><div class="formula-main">$$y^{(n)} + a_{n-1} y^{(n-1)} + \\cdots + a_1 \\dot{y} + a_0 y = 0$$</div></div>

<p class="l-text">$n$ yeni bilinmeyen tanıtın: $y_1 = y$, $y_2 = \\dot{y}$, $y_3 = \\ddot{y}$, $\\ldots$, $y_n = y^{(n-1)}$. Her biri öncekinin zaman türevidir, sonuncusu hariç — onun türevi orijinal denklemle sabitlenir. Bu, açık bir birinci mertebe sistem verir:</p>

<div class="calc-formula"><div class="formula-label">EŞDEĞER BİRİNCİ MERTEBE SİSTEM</div><div class="formula-main">$$\\dot{y}_1 = y_2, \\quad \\dot{y}_2 = y_3, \\quad \\ldots, \\quad \\dot{y}_{n-1} = y_n, \\quad \\dot{y}_n = -a_0 y_1 - a_1 y_2 - \\cdots - a_{n-1} y_n$$</div></div>

<p class="l-text">Matris formunda $\\dot{Y} = AY$, burada <strong>eşlik matrisi</strong> (companion matrix) olarak bilinen şu yapıyla:</p>

<div class="calc-formula"><div class="formula-label">EŞLİK MATRİSİ</div><div class="formula-main">$$A = \\begin{bmatrix} 0 & 1 & 0 & \\cdots & 0 \\\\ 0 & 0 & 1 & \\cdots & 0 \\\\ \\vdots & & & \\ddots & \\vdots \\\\ 0 & 0 & 0 & \\cdots & 1 \\\\ -a_0 & -a_1 & -a_2 & \\cdots & -a_{n-1} \\end{bmatrix}$$</div></div>

<div class="calc-example"><div class="example-label">L2'DEN SOMUT ÖRNEK</div><div class="example-body">L2'deki sönümlü harmonik osilatör $\\ddot{y} + 2\\gamma \\dot{y} + \\omega_0^2 y = 0$ idi. $y_1 = y$ ve $y_2 = \\dot{y}$ ile:<br><br>$\\dot{y}_1 = y_2$<br>$\\dot{y}_2 = -\\omega_0^2 y_1 - 2\\gamma y_2$<br><br>Matris formunda, $\\dot{Y} = \\begin{bmatrix} 0 & 1 \\\\ -\\omega_0^2 & -2\\gamma \\end{bmatrix} Y$. Bu $2 \\times 2$ matrisin özdeğerleri tam olarak L2'deki karakteristik denklem $r^2 + 2\\gamma r + \\omega_0^2 = 0$'ın kökleridir. Aynı kökler, aynı çözüm yapısı — yalnızca defter tutma değişti.</div></div>

<div class="l-note"><strong>Pratikte neden önemli.</strong> Sayısal ODE çözücüler (<code>scipy.integrate.solve_ivp</code> gibi) yalnızca birinci mertebe sistemleri ele alır. Ne zaman ikinci veya daha yüksek mertebeden bir denklemi simüle etmek isteseniz, bu indirgemeyi uygulamak zorundasınız. Sayısal dinamikte standart ön-işleme adımıdır.</div>

<!-- ========================================================================
     BÖLÜM 4
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">4. Sabit $A$ için Özdeğer Çözümleri</h2>

<div class="calc-highlight"><strong>Temel fikir:</strong> Bir sabit vektör $v$ ve skaler $\\lambda$ için $X(t) = v \\, e^{\\lambda t}$ tahmin edin. Yerleştirin ve ODE, özdeğer denklemi $Av = \\lambda v$ haline gelir. Her özvektör bir çözüm katkısı yapar; süperpozisyon genel çözümü verir.</div>

<p class="l-text">Tek değişkenli denklem $\\dot{x} = ax$ çözümleri $x(t) = c \\, e^{at}$ biçimindedir. Buradan ilham alarak vektör tahmini $X(t) = v \\, e^{\\lambda t}$ deneyelim, burada $v$ sabit vektör ve $\\lambda$ skalerdir. Türev alarak $\\dot{X} = \\lambda v \\, e^{\\lambda t}$. $\\dot{X} = AX$'e yerleştirip $e^{\\lambda t}$'yi sadeleştirerek:</p>

<div class="calc-formula"><div class="formula-label">TAHMİN, ÖZDEĞER PROBLEMİNE İNDİRGENİR</div><div class="formula-main">$$\\lambda v = A v$$</div><div class="formula-sub">Bu tam olarak lineer cebir L4'teki özdeğer denklemi!</div></div>

<p class="l-text">Yani $\\lambda$, $A$'nın özdeğeri ve $v$ karşılık gelen özvektörü olmalı. $n$ ayrık özdeğeri $\\lambda_1, \\ldots, \\lambda_n$ ve özvektörleri $v_1, \\ldots, v_n$ olan jenerik bir $n \\times n$ matris için genel çözüm bir lineer kombinasyondur:</p>

<div class="calc-formula"><div class="formula-label">GENEL ÇÖZÜM (AYRIK ÖZDEĞERLER)</div><div class="formula-main">$$X(t) = c_1 v_1 e^{\\lambda_1 t} + c_2 v_2 e^{\\lambda_2 t} + \\cdots + c_n v_n e^{\\lambda_n t}$$</div><div class="formula-sub">$c_1, \\ldots, c_n$ sabitleri başlangıç koşulu $X(0) = X_0$ ile sabitlenir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Özdeğerler</div><div class="card-body">Her $\\lambda_i$, $v_i$ yönündeki büyüme veya azalma hızını belirler. Pozitif reel $\\lambda$ patlar; negatif reel $\\lambda$ söner.</div></div>
<div class="calc-card"><div class="card-title">Özvektörler</div><div class="card-body">Her $v_i$, durum uzayında sistemin $\\lambda_i$ oranıyla 1B ODE gibi davrandığı sabit bir yöndür.</div></div>
<div class="calc-card"><div class="card-title">Süperpozisyon</div><div class="card-body">Özvektör koordinatlarında sistem, $n$ bağımsız 1B probleme ayrışır. Modları topluyoruz.</div></div>
<div class="calc-card"><div class="card-title">Başlangıç Koşulu</div><div class="card-body">$X_0 = c_1 v_1 + \\cdots + c_n v_n$, $X_0$'ı özvektör tabanında açar. Katsayılar $c_i$'lerdir.</div></div>
</div>

<p class="l-text">Kısaca: matris, özvektör tabanında "köşegen"dir. Her özvektör, sistemin tek değişkenli üstel gibi evrildiği bağımsız bir kanal tanımlar. Sonra kanalları toplarsınız. Ayrık reel özdeğerler için tüm hikâye budur.</p>

<div class="l-note"><strong>Köşegenleştirme kılığında.</strong> Eğer $P = [v_1 | v_2 | \\cdots | v_n]$ ve $D = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$ alırsak, $A = PDP^{-1}$ olur ve $Y = P^{-1} X$ değişkenleri dönüşümü, $\\dot{X} = AX$ sistemini ayrıştırılmış $\\dot{Y} = DY$ sistemine dönüştürür. Her $y_i$, $\\dot{y}_i = \\lambda_i y_i$'ye uyar — anında çözülür. Matris üstel kimliği $e^{At} = P e^{Dt} P^{-1}$, özdeğer yönteminin lineer cebir karşılığıdır.</div>

<!-- ========================================================================
     BÖLÜM 5
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">5. Çözümlü Örnek 1: Reel Ayrık Özdeğerler</h2>

<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body">$\\dot{X} = AX$ sistemini $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 2 \\end{bmatrix}$ ve $X(0) = \\begin{bmatrix} 0 \\\\ 5 \\end{bmatrix}$ ile çözün.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Karakteristik polinom</div><div class="step-detail">$\\det(A - \\lambda I) = (1-\\lambda)(2-\\lambda) - 6 = \\lambda^2 - 3\\lambda - 4 = (\\lambda - 4)(\\lambda + 1)$. Bu durumda $\\lambda_1 = 4$ ve $\\lambda_2 = -1$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\lambda_1 = 4$ için özvektör</div><div class="step-detail">$(A - 4I)v = 0$'ı çözün: $\\begin{bmatrix} -3 & 2 \\\\ 3 & -2 \\end{bmatrix} v = 0$ verir ki $-3v_1 + 2v_2 = 0$, yani $v_1 = \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix}$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\lambda_2 = -1$ için özvektör</div><div class="step-detail">$(A + I)v = 0$'ı çözün: $\\begin{bmatrix} 2 & 2 \\\\ 3 & 3 \\end{bmatrix} v = 0$ verir ki $v_1 + v_2 = 0$, yani $v_2 = \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Genel çözüm</div><div class="step-detail">$X(t) = c_1 \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} e^{4t} + c_2 \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} e^{-t}$.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Başlangıç koşulunu uygulayın</div><div class="step-detail">$X(0) = c_1 \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} + c_2 \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 5 \\end{bmatrix}$ verir: $2c_1 + c_2 = 0$ ve $3c_1 - c_2 = 5$. Toplayarak: $5c_1 = 5$, böylece $c_1 = 1$ ve $c_2 = -2$.</div></div></div>
<div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Özel çözüm</div><div class="step-detail">$X(t) = \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} e^{4t} - 2 \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} e^{-t} = \\begin{bmatrix} 2e^{4t} - 2e^{-t} \\\\ 3e^{4t} + 2e^{-t} \\end{bmatrix}$. Bitti.</div></div></div>
</div>

<p class="l-text"><strong>Yorum.</strong> $v_1 = (2,3)^T$ yönündeki bileşen $e^{4t}$ gibi büyür (kararsız mod), $v_2 = (1,-1)^T$ yönündeki bileşen $e^{-t}$ gibi söner (kararlı mod). Uzun vadede, kararsız mod baskın gelir ve her yörünge $v_1$'in gerdirdiği doğru boyunca uzaklaşır. Bu bir <strong>eyer noktasıdır</strong>, Bölüm 8'de resmî olarak sınıflandırılacak.</p>

<div id="plot-tanks-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=200;var ts=[];var x1=[];var x2=[];for(var i=0;i<n;i++){var t=i*5/(n-1);ts.push(t);x1.push(50+50*Math.exp(-t/10));x2.push(50-50*Math.exp(-t/10));}
var t1={x:ts,y:x1,mode:"lines",name:"Tank 1 tuz (g)",line:{color:"#3b82f6",width:3}};
var t2={x:ts,y:x2,mode:"lines",name:"Tank 2 tuz (g)",line:{color:"#a78bfa",width:3,dash:"dash"}};
var t3={x:[0,5],y:[50,50],mode:"lines",name:"Denge: her birinde 50 g",line:{color:"#f87171",width:1.5,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"zaman t (saat)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"tuz kütlesi (g)"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-tanks-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Başlangıçta 100 g ve 0 g tuz tutan iki tuz suyu tankı, su değişimiyle her birinde 50 g'lık dengeye yaklaşır. Kuplaj, sistemi ortak bir ortalamaya zorlar — matrisin negatif özdeğer modu tarafından sürülen kararlı bir denge.</div></div>

<!-- ========================================================================
     BÖLÜM 6
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">6. Çözümlü Örnek 2: Kompleks Özdeğerler — Salınım</h2>

<div class="calc-highlight"><strong>Geometrik anlam:</strong> Kompleks özdeğer, dönme demektir. Saf imajiner özdeğerler kapalı dairesel yörüngeler üretir; reel kısmı olan kompleks özdeğerler spiral üretir — reel kısım negatifse içe, pozitifse dışa. Sistem durum uzayında <em>döner</em>.</div>

<p class="l-text">$A = \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix}$ matrisini ele alın. Bu, düzlemde 90 derecelik dönme matrisidir. Karakteristik polinomu $\\lambda^2 + 1 = 0$ ve saf imajiner özdeğerleri $\\lambda = \\pm i$'dir. Reel özvektör yoktur ama kompleks olanlar var.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$\\lambda = i$ için kompleks özvektör</div><div class="step-detail">$(A - iI)v = 0$ verir $-iv_1 + v_2 = 0$, yani $v_2 = iv_1$ ve $v = (1, i)^T$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Kompleks çözüm</div><div class="step-detail">$X(t) = (1, i)^T e^{it} = (1, i)^T (\\cos t + i \\sin t) = (\\cos t + i \\sin t,\\, -\\sin t + i \\cos t)^T$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Reel ve imajiner kısımlar</div><div class="step-detail">Reel kısım $X_R(t) = (\\cos t, -\\sin t)^T$. İmajiner kısım $X_I(t) = (\\sin t, \\cos t)^T$. Her ikisi de reel çözümlerdir.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Genel reel çözüm</div><div class="step-detail">$X(t) = c_1 \\begin{bmatrix} \\cos t \\\\ -\\sin t \\end{bmatrix} + c_2 \\begin{bmatrix} \\sin t \\\\ \\cos t \\end{bmatrix}$. Orijin etrafında kapalı dairesel yörüngeler.</div></div></div>
</div>

<p class="l-text"><strong>Genel kompleks özdeğer kuralı.</strong> $\\lambda = \\alpha \\pm i\\beta$ kompleks eşlenik çifti, özvektörü $v = p + iq$ ise iki bağımsız reel çözüm şudur:</p>

<div class="calc-formula"><div class="formula-label">KOMPLEKS ÖZDEĞERLERDEN REEL ÇÖZÜMLER</div><div class="formula-main">$$X_R(t) = e^{\\alpha t} \\big( p \\cos \\beta t - q \\sin \\beta t \\big), \\quad X_I(t) = e^{\\alpha t} \\big( p \\sin \\beta t + q \\cos \\beta t \\big)$$</div><div class="formula-sub">$e^{\\alpha t}$ çarpanı genliği kontrol eder; trigonometrik çarpan $\\beta$ açısal hızında dönme üretir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\alpha < 0$</div><div class="card-body">Kararlı spiral. Yörüngeler dönerek orijine doğru içe büzülür. Sönümlü salınım.</div></div>
<div class="calc-card"><div class="card-title">$\\alpha > 0$</div><div class="card-body">Kararsız spiral. Yörüngeler dönerek orijinden dışa büyür.</div></div>
<div class="calc-card"><div class="card-title">$\\alpha = 0$</div><div class="card-body">Merkez. Kapalı periyodik yörüngeler. Saf dönme, büyüme veya azalma yok.</div></div>
<div class="calc-card"><div class="card-title">Periyot</div><div class="card-body">Bir tam tur süresi $T = 2\\pi / \\beta$. Daha büyük $\\beta$ daha hızlı dönme demektir.</div></div>
</div>

<div id="plot-spiral-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=500;var xs=[];var ys=[];var t;
for(var i=0;i<n;i++){t=i*8/(n-1);xs.push(2*Math.exp(-0.25*t)*Math.cos(2*t));ys.push(2*Math.exp(-0.25*t)*Math.sin(2*t));}
var tr1={x:xs,y:ys,mode:"lines",name:"Kararlı spiral",line:{color:"#3b82f6",width:2.5}};
var tr2={x:[2],y:[0],mode:"markers",name:"Başlangıç (2,0)",marker:{color:"#22c55e",size:11,line:{color:"#ebe6dc",width:1}}};
var tr3={x:[0],y:[0],mode:"markers",name:"Denge (0,0)",marker:{color:"#f87171",size:12,symbol:"x",line:{width:2}}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_1",range:[-2.2,2.2]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_2",scaleanchor:"x",range:[-2.2,2.2]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-spiral-tr",[tr1,tr2,tr3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Kompleks özdeğerli $\\lambda = -0.25 \\pm 2i$ bir sistem için faz düzleminde kararlı spiral yörüngesi. Yörünge, denge noktası olan orijin etrafında dönerken genlik kaybeder ve nihayetinde sabit noktaya yakınsar. Özdeğerin reel kısmı azalma hızını, imajiner kısmı dönme hızını belirler.</div></div>

<!-- ========================================================================
     BÖLÜM 7
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">7. Çözümlü Örnek 3: Katlı Özdeğer</h2>

<div class="calc-highlight"><strong>Çarpıtma:</strong> Bir özdeğerin cebirsel katlılığı 2 ama sadece bir bağımsız özvektörü varsa ("kusurlu" matris), ikinci çözüm bir $t$ çarpanı kazanır. Polinom büyüme, üstel ile çarpılır.</div>

<p class="l-text">$A = \\begin{bmatrix} 2 & 1 \\\\ 0 & 2 \\end{bmatrix}$ alalım — bir Jordan bloğu. Karakteristik polinom $(2 - \\lambda)^2 = 0$, $\\lambda = 2$ katlı. $(A - 2I)v = 0$'ı çözmek $\\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix} v = 0$ verir, yani $v_2 = 0$ ve tek özvektör $v_1 = (1, 0)^T$. Bir özvektör eksiğiz.</p>

<p class="l-text">İlk çözüm standart üstel modudur: $X_1(t) = v_1 e^{2t}$. İkincisi için tahmin $X_2(t) = (v_1 t + w) e^{2t}$ deneyelim, burada $w$ belirlenmesi gereken bir vektör. $\\dot{X} = AX$'e yerleştirerek:</p>

<div class="calc-formula"><div class="formula-label">GENELLEŞTİRİLMİŞ ÖZVEKTÖR DENKLEMİ</div><div class="formula-main">$$(A - 2I) w = v_1$$</div><div class="formula-sub">$w$, genelleştirilmiş özvektör olarak adlandırılır. Kusurlu matrisin eksik yönünü kapatır.</div></div>

<p class="l-text">$\\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix} w = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$'i çözmek $w_2 = 1$ ve $w_1$ serbest verir. $w = (0, 1)^T$ seçin. O zaman genel çözüm:</p>

<div class="calc-formula"><div class="formula-label">GENEL ÇÖZÜM (KATLI ÖZDEĞER)</div><div class="formula-main">$$X(t) = c_1 \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} e^{2t} + c_2 \\Bigg( t \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} \\Bigg) e^{2t}$$</div></div>

<div class="l-note"><strong>Neden ekstra $t$ çarpanı.</strong> Bir matris kusurlu olduğunda (geometrik katlılık, cebirsel katlılıktan küçükse), köşegenleştirilemez. Jordan normal formunda katlı bloğun köşegeninin üstünde "1" vardır ve bu köşegen-dışı kuplaj, matris üsteline polinom çarpanı enjekte eder: $e^{Jt}$, $t^k e^{\\lambda t}$ terimlerini içerir, burada $k = 0, 1, \\ldots, m - 1$ ve $m$ Jordan bloğunun boyutudur.</div>

<!-- ========================================================================
     BÖLÜM 8
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">8. Faz Portreleri & Denge Sınıflandırması</h2>

<div class="calc-highlight"><strong>Geometrik kalp:</strong> 2B lineer sistemin orijinde bir dengesi vardır ($A \\cdot 0 = 0$ olduğundan). $A$'nın özdeğerleri o denge etrafındaki yörüngelerin yerel geometrisi hakkında size her şeyi söyler. Altı standart şekil hemen hemen her durumu kapsar.</div>

<p class="l-text">$\\dot{X} = AX$ sisteminin bir <strong>dengesi</strong> (sabit noktası), $AX^* = 0$ olan herhangi bir $X^*$ noktasıdır. Tersinir $A$ için tek denge $X^* = 0$, orijindir. Denge yakınındaki yörüngelerin davranışı $A$'nın özdeğerleri $\\lambda_1, \\lambda_2$ tarafından belirlenir:</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">REEL ÖZDEĞERLER</div>
<div class="compare-item">Kararlı node: her iki $\\lambda < 0$ — yörüngeler özvektörler boyunca yakınsar</div>
<div class="compare-item">Kararsız node: her iki $\\lambda > 0$ — yörüngeler özvektörler boyunca uzaklaşır</div>
<div class="compare-item">Eyer: bir $\\lambda > 0$, bir $\\lambda < 0$ — kararsız, hiperbolik akış</div>
</div>
<div class="compare-col">
<div class="compare-title">KOMPLEKS ÖZDEĞERLER</div>
<div class="compare-item">Kararlı spiral: $\\text{Re}(\\lambda) < 0$ — içe doğru dönerek sönüm</div>
<div class="compare-item">Kararsız spiral: $\\text{Re}(\\lambda) > 0$ — dışa doğru dönerek büyüme</div>
<div class="compare-item">Merkez: $\\text{Re}(\\lambda) = 0$ — kapalı periyodik yörüngeler</div>
</div>
</div>

<p class="l-text">İz $\\tau = \\text{tr}(A) = \\lambda_1 + \\lambda_2$ ve determinant $\\Delta = \\det(A) = \\lambda_1 \\lambda_2$ üzerinden sınıflandırma, özdeğerleri hesaplamadan tam tabloyu verir:</p>

<div class="calc-formula"><div class="formula-label">İZ-DETERMİNANT DİYAGRAMI</div><div class="formula-main">$$\\Delta < 0 \\Rightarrow \\text{eyer}, \\quad \\Delta > 0 \\text{ ve } \\tau^2 - 4\\Delta > 0 \\Rightarrow \\text{node}, \\quad \\Delta > 0 \\text{ ve } \\tau^2 - 4\\Delta < 0 \\Rightarrow \\text{spiral/merkez}$$</div><div class="formula-sub">$\\tau < 0$ ise kararlı, $\\tau > 0$ ise kararsız. Merkez tam olarak $\\tau = 0$ ve $\\Delta > 0$ olduğunda.</div></div>

<div id="plot-phase-portraits-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
function vfield(F,xmin,xmax,ymin,ymax,nx,ny,col,name){
  var xs=[];var ys=[];var u=[];var v=[];var i,j,x,y,d;
  for(i=0;i<nx;i++){for(j=0;j<ny;j++){x=xmin+(xmax-xmin)*i/(nx-1);y=ymin+(ymax-ymin)*j/(ny-1);d=F(x,y);xs.push(x);ys.push(y);u.push(d[0]);v.push(d[1]);}}
  var x2=[];var y2=[];for(i=0;i<xs.length;i++){var nrm=Math.sqrt(u[i]*u[i]+v[i]*v[i])+1e-9;var sc=0.15/nrm;x2.push(xs[i]);x2.push(xs[i]+u[i]*sc);x2.push(null);y2.push(ys[i]);y2.push(ys[i]+v[i]*sc);y2.push(null);}
  return {x:x2,y:y2,mode:"lines",line:{color:col,width:1},showlegend:false,name:name};
}
var systems=[
 {n:"Kararlı node",F:function(x,y){return[-x,-2*y];}},
 {n:"Kararsız node",F:function(x,y){return[x,2*y];}},
 {n:"Eyer",F:function(x,y){return[x,-y];}},
 {n:"Kararlı spiral",F:function(x,y){return[-0.3*x+y,-x-0.3*y];}},
 {n:"Kararsız spiral",F:function(x,y){return[0.3*x+y,-x+0.3*y];}},
 {n:"Merkez",F:function(x,y){return[y,-x];}}
];
var fig={data:[],layout:{paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc",size:11},grid:{rows:2,columns:3,pattern:"independent"},margin:{t:60,r:20,b:30,l:30},showlegend:false,height:520}};
for(var s=0;s<6;s++){
  var ax="x"+(s+1);var ay="y"+(s+1);
  var vf=vfield(systems[s].F,-1.8,1.8,-1.8,1.8,9,9,"rgba(167,139,250,0.55)",systems[s].n);vf.xaxis=ax;vf.yaxis=ay;fig.data.push(vf);
  var trj={x:[],y:[],mode:"lines",line:{color:"#3b82f6",width:2},xaxis:ax,yaxis:ay,showlegend:false};
  var x=1.3;var y=0.4;var dt=0.02;for(var k=0;k<400;k++){var d=systems[s].F(x,y);x+=d[0]*dt;y+=d[1]*dt;if(Math.abs(x)>3||Math.abs(y)>3)break;trj.x.push(x);trj.y.push(y);}
  fig.data.push(trj);
  fig.layout[ax==="x1"?"xaxis":"xaxis"+(s+1)]={range:[-2,2],showgrid:false,zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",title:systems[s].n,titlefont:{color:"#ebe6dc",size:11}};
  fig.layout[ay==="y1"?"yaxis":"yaxis"+(s+1)]={range:[-2,2],showgrid:false,zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",scaleanchor:ax};
}
Plotly.newPlot("plot-phase-portraits-tr",fig.data,fig.layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> 2B lineer sistemler için altı kanonik faz portresi. Mor oklar her noktada $\\dot{X} = AX$ hız alanını gösterir. Mavi eğriler $(1.3, 0.4)$ yakınında başlayan örnek bir yörüngeyi gösterir. Şekil — node, eyer, spiral veya merkez — tamamen $A$'nın özdeğer spektrumu tarafından belirlenir.</div></div>

<div class="l-note"><strong>Bu sınıflandırma neden belirleyici.</strong> Dünyadaki her 2B sabit-katsayılı lineer sistemin faz portresi bu altı türden biridir (artı $A = \\lambda I$ olduğunda yıldız node gibi birkaç dejenere sınır durumu). Pratik uygulamalarda — sarkacın durağa dönüp dönmeyeceği, kimyasal reaktörün dengeye gelip gelmeyeceği, yörüngenin kapanıp kapanmayacağı — özdeğer sınıflandırması ilk hesaplanacak şeydir.</div>

<!-- ========================================================================
     BÖLÜM 9
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">9. Doğrusal Olmayan Sistemler & Lineerleştirme</h2>

<div class="calc-highlight"><strong>Gerçeklik ısırır:</strong> Gerçek sistemler neredeyse hiç lineer değildir. Ama bir denge yakınında doğrusal olmayan sistem, lineerleştirmesi gibi davranır. Aynı özdeğer sınıflandırması — yerel olarak — uygulanır.</div>

<p class="l-text">Genel doğrusal olmayan otonom sistem $\\dot{X} = F(X)$ biçimindedir, burada $F: \\mathbb{R}^n \\to \\mathbb{R}^n$ pürüzsüz bir vektör alanıdır. Bir <strong>denge</strong>, $F(X^*) = 0$ olan herhangi bir $X^*$ noktasıdır. $X^*$ yakınında Taylor açılımı yaparız: $F(X) \\approx F(X^*) + J(X - X^*) = J(X - X^*)$, burada $J$, $X^*$'da değerlendirilen $F$'in <strong>Jacobian matrisidir</strong>:</p>

<div class="calc-formula"><div class="formula-label">JACOBIAN MATRİSİ</div><div class="formula-main">$$J_{ij} = \\frac{\\partial F_i}{\\partial x_j} \\bigg|_{X = X^*}$$</div><div class="formula-sub">Denge $X^*$ yakınında $F$'in lineer yaklaşımı.</div></div>

<p class="l-text">Lotka ve Volterra'nın klasik avcı-av örneği (1925-1926) bunu mükemmel şekilde örnekler. $x$ av popülasyonu (tavşan), $y$ avcı popülasyonu (tilki) olsun:</p>

<div class="calc-formula"><div class="formula-label">LOTKA-VOLTERRA SİSTEMİ</div><div class="formula-main">$$\\dot{x} = \\alpha x - \\beta x y, \\qquad \\dot{y} = \\delta x y - \\gamma y$$</div><div class="formula-sub">$\\alpha$: av büyüme hızı. $\\beta$: yırtıcılık hızı. $\\delta$: avcı verimliliği. $\\gamma$: avcı ölüm hızı.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Dengeleri bulun: her iki hızı sıfırlayın</div><div class="step-detail">$x(\\alpha - \\beta y) = 0$ ve $y(\\delta x - \\gamma) = 0$. İki çözüm: trivial $X^*_0 = (0, 0)$ (yok oluş) ve birlikte yaşama $X^*_1 = (\\gamma/\\delta, \\alpha/\\beta)$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Genel $(x, y)$'de Jacobian'ı hesaplayın</div><div class="step-detail">$J(x, y) = \\begin{bmatrix} \\alpha - \\beta y & -\\beta x \\\\ \\delta y & \\delta x - \\gamma \\end{bmatrix}$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$X^*_0 = (0, 0)$'ı sınıflandırın</div><div class="step-detail">$J(0,0) = \\begin{bmatrix} \\alpha & 0 \\\\ 0 & -\\gamma \\end{bmatrix}$. Özdeğerler $\\alpha > 0$ ve $-\\gamma < 0$. Eyer noktası. Kararsız.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$X^*_1 = (\\gamma/\\delta, \\alpha/\\beta)$'i sınıflandırın</div><div class="step-detail">$J(X^*_1) = \\begin{bmatrix} 0 & -\\beta \\gamma / \\delta \\\\ \\delta \\alpha / \\beta & 0 \\end{bmatrix}$. Özdeğerler $\\pm i\\sqrt{\\alpha \\gamma}$. Saf imajiner — lineerleştirmede merkez.</div></div></div>
</div>

<p class="l-text">Birlikte yaşama dengesindeki lineerleştirme merkezi öngörür: kapalı periyodik yörüngeler. Dikkat çekici biçimde, tam doğrusal olmayan Lotka-Volterra sisteminin de $X^*_1$ etrafında kapalı periyodik yörüngeleri vardır — bu modelin özel bir özelliği, genelde garanti edilmez. Aşağıda hem faz uzayında yörüngeyi hem de zaman serisini çiziyoruz.</p>

<div id="plot-lv-phase-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0,b=0.5,d=0.4,g=0.6;
function rhs(s){return[a*s[0]-b*s[0]*s[1],d*s[0]*s[1]-g*s[1]];}
function rk4(s,h){var k1=rhs(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=rhs(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=rhs(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=rhs(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var data=[];var cols=["#3b82f6","#a78bfa","#22c55e"];var starts=[[2,1],[3,1.5],[1.5,0.8]];
for(var k=0;k<3;k++){var xs=[];var ys=[];var s=starts[k].slice();for(var i=0;i<3000;i++){xs.push(s[0]);ys.push(s[1]);s=rk4(s,0.01);}
  data.push({x:xs,y:ys,mode:"lines",name:"yörünge "+(k+1)+" — başlangıç ("+starts[k][0]+","+starts[k][1]+")",line:{color:cols[k],width:2}});}
data.push({x:[g/d],y:[a/b],mode:"markers",name:"Denge ("+(g/d).toFixed(2)+","+(a/b).toFixed(2)+")",marker:{color:"#f87171",size:11,symbol:"x",line:{width:2}}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"av x (bin)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"avcı y (bin)"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-lv-phase-tr",data,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Faz düzleminde Lotka-Volterra yörüngeleri (x ekseninde av, y ekseninde avcı). Üç farklı başlangıç koşulu, birlikte yaşama dengesinin etrafında üç kapalı eğri çizer. Yörüngeler içeri ya da dışarı doğru spiral yapmaz — popülasyonlar bu idealize modelde sonsuza dek periyodik olarak salınır.</div></div>

<div id="plot-lv-time-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0,b=0.5,d=0.4,g=0.6;
function rhs(s){return[a*s[0]-b*s[0]*s[1],d*s[0]*s[1]-g*s[1]];}
function rk4(s,h){var k1=rhs(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=rhs(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=rhs(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=rhs(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var ts=[];var xs=[];var ys=[];var s=[2,1];var dt=0.05;for(var i=0;i<800;i++){ts.push(i*dt);xs.push(s[0]);ys.push(s[1]);s=rk4(s,dt);}
var t1={x:ts,y:xs,mode:"lines",name:"av x(t)",line:{color:"#3b82f6",width:2.5}};
var t2={x:ts,y:ys,mode:"lines",name:"avcı y(t)",line:{color:"#a78bfa",width:2.5,dash:"dash"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"zaman t"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"popülasyon"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-lv-time-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Lotka-Volterra zaman serisi: av (mavi) avcıdan (mor) hemen önce zirve yapar, sonra avcılar avı tükettikçe düşer, sonra avcılar yiyecek eksikliğinden düşer, sonra av iyileşir. Gerçek ekolojik verilerde gözlemlenen klasik faz-kaymalı salınım (örneğin Kanada vaşak-tavşan döngüleri).</div></div>

<!-- ========================================================================
     BÖLÜM 10
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">10. Kararlılık — Hartman-Grobman & Lyapunov</h2>

<div class="calc-highlight"><strong>Lineerleştirme bizi ne kadar götürür?</strong> Hartman-Grobman teoremi şunu söyler: hiperbolik bir denge yakınında (reel kısmı sıfır olan özdeğer yok), doğrusal olmayan akış lineerleştirmesi ile topolojik olarak eşdeğerdir. Hiperbolik olmayan durumlar — örneğin merkez — için lineerleştirme başarısız olabilir ve Lyapunov fonksiyonları gibi daha güçlü araçlara ihtiyaç vardır.</div>

<p class="l-text"><strong>Hartman-Grobman teoremi (gayri resmi).</strong> $X^*$, $\\dot{X} = F(X)$'in bir dengesi olsun ve $J$, $X^*$'daki Jacobian olsun. $J$'nin hiçbir özdeğerinin reel kısmı sıfır değilse (denge <em>hiperbolik</em> olarak adlandırılır), $X^*$'ın bir komşuluğunda doğrusal olmayan sistemin yörüngelerini lineer sistemin $\\dot{Y} = JY$ yörüngelerine eşleyen bir homeomorfizma vardır. Yerel görüntü tamamen özdeğer işaretleriyle belirlenir.</p>

<p class="l-text">Hiperbolik olmayan dengeler daha incedir. Lineerleştirmede bir merkez, tam doğrusal olmayan sistemde kararlı spiral, kararsız spiral veya merkez olarak kalabilir — lineer teori sessizdir. Daha yüksek mertebeden terimler sonucu belirler.</p>

<p class="l-text"><strong>Lyapunov fonksiyonları</strong> global bir araç sağlar. $V: \\mathbb{R}^n \\to \\mathbb{R}$ fonksiyonu, $X^*$'da kesin minimumu varsa ve yörüngeler boyunca türevi pozitif olmayan ise $X^*$ için Lyapunov fonksiyonudur:</p>

<div class="calc-formula"><div class="formula-label">LYAPUNOV KARARLILIĞI</div><div class="formula-main">$$\\dot{V}(X) = \\nabla V(X) \\cdot F(X) \\leq 0$$</div><div class="formula-sub">$\\dot{V} < 0$ denge dışında kesin olarak ise, $X^*$ asimptotik olarak kararlıdır.</div></div>

<p class="l-text">Geometrik olarak: bir Lyapunov fonksiyonu enerji çanağı gibi davranır. Yörüngeler $V(X)$ yüzeyinde aşağı doğru kayar, hiç yukarı tırmanmaz. Bu, tek bir özdeğer hesaplamadan kararlılık verir. Sürtünmeli mekanik sistemler için toplam enerji doğal bir Lyapunov fonksiyonudur; Lotka-Volterra sistemi için $V(x, y) = \\delta x - \\gamma \\ln x + \\beta y - \\alpha \\ln y$ tam olarak korunur ve kapalı yörüngeleri doğrular.</p>

<div class="l-note"><strong>L8'e bakış.</strong> Sabit katsayılı lineer sistemler tamamen anlaşılmıştır. Matris üsteli ve özdeğer yöntemleri, temel matrisler aracılığıyla zamana bağlı lineer sistemlere ve sayısal entegrasyon yoluyla doğrusal olmayanlara genişler. L8'de incelenen sinirsel-ODE (neural ODE) çerçevesi, $\\dot{X} = f_\\theta(X, t)$'yi öğrenilmiş bir vektör alanı $f_\\theta$ ile ele alır ve burada geliştirilen Jacobian lineerleştirmesi, kararlılığını incelemek için kullanılan tam yerel analiz aracıdır.</div>

<!-- ========================================================================
     BÖLÜM 11 — Pratik Pyodide Egzersizi
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">11. Pratik Pyodide Egzersizi</h2>

<p class="l-text">Bu hesaplama laboratuvarı her şeyi bir araya getiriyor. Bir $2 \\times 2$ matris $A$ giriyorsunuz, kod özdeğerlerini hesaplayıp ortaya çıkan dengeyi sınıflandırıyor, ardından $\\dot{X} = AX$ sistemini birkaç başlangıç koşulundan sayısal olarak entegre edip yörüngeleri bir vektör alanı üzerinde gösteriyor. İkinci kısım tam doğrusal olmayan Lotka-Volterra sistemini simüle eder ve kapalı yörüngeleri ile zaman serilerini gösterir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · LİNEER FAZ PORTRESİ</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.integrate <span class="kw">import</span> solve_ivp

<span class="cm"># --- 2x2 matrisinizi buraya girin -----------------------------------</span>
A = np.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">2</span>],
              [<span class="num">3</span>, <span class="num">2</span>]], dtype=<span class="fn">float</span>)

<span class="cm"># --- Özdeğerler ve sınıflandırma ------------------------------------</span>
evals, evecs = np.linalg.<span class="fn">eig</span>(A)
tau = np.<span class="fn">trace</span>(A)
det = np.linalg.<span class="fn">det</span>(A)
disc = tau**<span class="num">2</span> - <span class="num">4</span>*det
<span class="fn">print</span>(<span class="str">f"Özdeğerler: {evals}"</span>)
<span class="fn">print</span>(<span class="str">f"iz = {tau:.3f}, det = {det:.3f}, diskriminant = {disc:.3f}"</span>)

<span class="kw">def</span> <span class="fn">classify</span>(evals, tau, det):
    re = np.<span class="fn">real</span>(evals)
    im = np.<span class="fn">imag</span>(evals)
    <span class="kw">if</span> np.<span class="fn">allclose</span>(im, <span class="num">0</span>):
        <span class="kw">if</span> det &lt; <span class="num">0</span>:
            <span class="kw">return</span> <span class="str">"EYER (kararsız)"</span>
        <span class="kw">if</span> np.<span class="fn">all</span>(re &lt; <span class="num">0</span>):
            <span class="kw">return</span> <span class="str">"KARARLI NODE"</span>
        <span class="kw">if</span> np.<span class="fn">all</span>(re &gt; <span class="num">0</span>):
            <span class="kw">return</span> <span class="str">"KARARSIZ NODE"</span>
    <span class="kw">else</span>:
        <span class="kw">if</span> np.<span class="fn">allclose</span>(re, <span class="num">0</span>):
            <span class="kw">return</span> <span class="str">"MERKEZ (kapalı yörüngeler)"</span>
        <span class="kw">if</span> re[<span class="num">0</span>] &lt; <span class="num">0</span>:
            <span class="kw">return</span> <span class="str">"KARARLI SPİRAL"</span>
        <span class="kw">return</span> <span class="str">"KARARSIZ SPİRAL"</span>
    <span class="kw">return</span> <span class="str">"dejenere"</span>

<span class="fn">print</span>(<span class="str">f"Denge tipi: {classify(evals, tau, det)}"</span>)

<span class="cm"># --- Birkaç başlangıç koşulundan sayısal entegrasyon ----------------</span>
<span class="kw">def</span> <span class="fn">rhs</span>(t, X):
    <span class="kw">return</span> A @ X

t_span = (<span class="num">0</span>, <span class="num">2</span>)
inits = [[<span class="num">1</span>, <span class="num">0</span>], [<span class="num">0</span>, <span class="num">1</span>], [-<span class="num">1</span>, <span class="num">1</span>], [<span class="num">1</span>, -<span class="num">1</span>], [<span class="num">0.5</span>, <span class="num">0.5</span>]]
<span class="kw">for</span> X0 <span class="kw">in</span> inits:
    sol = <span class="fn">solve_ivp</span>(rhs, t_span, X0, t_eval=np.<span class="fn">linspace</span>(*t_span, <span class="num">100</span>))
    <span class="fn">print</span>(<span class="str">f"X0={X0}: X(2) = [{sol.y[0,-1]:+.3f}, {sol.y[1,-1]:+.3f}]"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON · LOTKA-VOLTERRA SİMÜLASYONU</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.integrate <span class="kw">import</span> solve_ivp

<span class="cm"># --- Lotka-Volterra parametreleri -----------------------------------</span>
alpha = <span class="num">1.0</span>   <span class="cm"># av doğum hızı</span>
beta  = <span class="num">0.5</span>   <span class="cm"># yırtıcılık hızı</span>
delta = <span class="num">0.4</span>   <span class="cm"># avcı verimliliği</span>
gamma = <span class="num">0.6</span>   <span class="cm"># avcı ölüm hızı</span>

<span class="kw">def</span> <span class="fn">lv</span>(t, X):
    x, y = X
    <span class="kw">return</span> [alpha*x - beta*x*y, delta*x*y - gamma*y]

<span class="cm"># --- Birlikte yaşama dengesi ve Jacobian ----------------------------</span>
xstar, ystar = gamma/delta, alpha/beta
J = np.<span class="fn">array</span>([[alpha - beta*ystar, -beta*xstar],
              [delta*ystar,         delta*xstar - gamma]])
<span class="fn">print</span>(<span class="str">f"Denge: ({xstar:.3f}, {ystar:.3f})"</span>)
<span class="fn">print</span>(<span class="str">f"Jacobian özdeğerleri: {np.linalg.eigvals(J)}"</span>)
<span class="fn">print</span>(<span class="str">f"Öngörülen açısal frekans: {np.sqrt(alpha*gamma):.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"Öngörülen periyot: {2*np.pi/np.sqrt(alpha*gamma):.4f}"</span>)

<span class="cm"># --- Üç farklı başlangıç popülasyonundan entegrasyon ----------------</span>
t_span = (<span class="num">0</span>, <span class="num">40</span>)
t_eval = np.<span class="fn">linspace</span>(*t_span, <span class="num">1000</span>)
<span class="kw">for</span> X0 <span class="kw">in</span> [[<span class="num">2</span>, <span class="num">1</span>], [<span class="num">3</span>, <span class="num">1.5</span>], [<span class="num">1.5</span>, <span class="num">0.8</span>]]:
    sol = <span class="fn">solve_ivp</span>(lv, t_span, X0, t_eval=t_eval, rtol=<span class="num">1e-8</span>)
    peak_prey = sol.y[<span class="num">0</span>].<span class="fn">max</span>()
    peak_pred = sol.y[<span class="num">1</span>].<span class="fn">max</span>()
    <span class="fn">print</span>(<span class="str">f"X0={X0}: pik av={peak_prey:.2f}, pik avcı={peak_pred:.2f}"</span>)

<span class="cm"># --- Korunan büyüklük (Lotka-Volterra birinci integrali) ------------</span>
<span class="kw">def</span> <span class="fn">V</span>(x, y):
    <span class="kw">return</span> delta*x - gamma*np.<span class="fn">log</span>(x) + beta*y - alpha*np.<span class="fn">log</span>(y)
<span class="fn">print</span>(<span class="str">f"V başlangıçta: {V(2, 1):.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"V t=40'ta:     {V(sol.y[0,-1], sol.y[1,-1]):.6f}"</span>)
<span class="fn">print</span>(<span class="str">"(eşleşmeli — V yörüngeler boyunca korunur)"</span>)</code></pre></div>

<div id="plot-linearization-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var a=1.0,b=0.5,d=0.4,g=0.6;
var xs=g/d,ys=a/b;
function nl(s){return[a*s[0]-b*s[0]*s[1],d*s[0]*s[1]-g*s[1]];}
function lin(s){var dx=s[0]-xs;var dy=s[1]-ys;var J=[[0,-b*g/d],[d*a/b,0]];return[J[0][0]*dx+J[0][1]*dy,J[1][0]*dx+J[1][1]*dy];}
function rk4(s,h,fn){var k1=fn(s);var s2=[s[0]+h/2*k1[0],s[1]+h/2*k1[1]];var k2=fn(s2);var s3=[s[0]+h/2*k2[0],s[1]+h/2*k2[1]];var k3=fn(s3);var s4=[s[0]+h*k3[0],s[1]+h*k3[1]];var k4=fn(s4);return[s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1])];}
var sN=[xs+0.3,ys+0.2];var sL=sN.slice();var xn=[];var yn=[];var xl=[];var yl=[];for(var i=0;i<2500;i++){xn.push(sN[0]);yn.push(sN[1]);xl.push(sL[0]);yl.push(sL[1]);sN=rk4(sN,0.01,nl);sL=rk4(sL,0.01,lin);}
var t1={x:xn,y:yn,mode:"lines",name:"Doğrusal olmayan yörünge",line:{color:"#3b82f6",width:2.5}};
var t2={x:xl,y:yl,mode:"lines",name:"Lineerleştirilmiş yörünge",line:{color:"#f87171",width:2,dash:"dash"}};
var t3={x:[xs],y:[ys],mode:"markers",name:"Denge",marker:{color:"#22c55e",size:11,symbol:"x",line:{width:2}}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"av x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"avcı y"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.08,xanchor:"center",x:0.5,font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-linearization-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Lotka-Volterra birlikte yaşama dengesi yakınında aynı noktadan başlatılan iki yörünge: doğrusal olmayan yörünge (mavi) gerçek kapalı eğriyi takip ederken, lineerleştirilmiş yörünge (kırmızı kesikli) denge etrafında mükemmel bir elips çizer. Eşleşme denge yakınında mükemmel, yörüngeler uzaklaştıkça kötüleşir — lineerleştirmenin geçerlilik aralığı.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN BUNU</div><div class="think-body">Simülasyonda $\\beta$ veya $\\delta$'yı değiştirip denge konumunun nasıl hareket ettiğini izleyin; bu sırada özdeğer çarpımı $\\alpha \\gamma$ — ve dolayısıyla periyot $2\\pi / \\sqrt{\\alpha \\gamma}$ — yalnızca av doğum hızına ve avcı ölüm hızına bağlıdır. Etkileşim güçleri yörünge genliğini şekillendirir, frekansını değil.</div></div>

<p class="l-text">Bir sonraki derste ODE sistemlerini geride bırakıp kısmi diferansiyel denklemlerle tanışıyoruz; orada türevler birden fazla bağımsız değişkene göre alınır (uzay <em>ve</em> zaman). Burada inşa ettiğiniz matris-özdeğer araç seti diferansiyel operatörlere genelleşir ve aynı sınıflandırma fikri (parabolik, hiperbolik, eliptik) çözümlerin niteliksel davranışını yönetir.</p>
`
};
