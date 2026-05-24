window.CONTROL_L5 = {

/* ============================================================================
   ENGLISH VERSION
   ============================================================================ */
en: `
<p class="l-text"><strong>Classical control lives in the frequency domain.</strong> You write a transfer function $H(s)$, draw a Bode plot, place poles on a root locus, and reason about a single input driving a single output. It is a beautiful theory and it works for a vast number of single-loop industrial problems. But every real system has internal states — currents in coils, angles of joints, charges on capacitors, voltages across membranes — that the input-output picture aggressively hides. The moment your plant has more than one input, or more than one output, or a nonlinearity that you want to linearize cleanly, the transfer function starts to creak.</p>

<p class="l-text">The state-space formulation is the modern alternative. You describe the system not by how the output reacts to the input, but by the full internal state $X(t) \\in \\mathbb{R}^n$ and a pair of matrix equations. The first equation says how the state evolves; the second says how the output reads off the state. Linear algebra takes over and you suddenly have a single language for stability, for steering, for reading hidden state out of available measurements, and for designing controllers that place every closed-loop pole exactly where you want it. This is the picture that runs modern aerospace autopilots, robotic manipulators, electric vehicle powertrains, and — as we will see at the end — neural ODE models in machine learning.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Convert any transfer function $H(s)$ into a state-space realization $(A, B, C, D)$ and back</li>
<li>Read the state equation $\\dot{X} = AX + BU$ and the output equation $Y = CX + DU$ as a single matrix system</li>
<li>Use eigenvalues of $A$ to decide stability and read off natural modes via the matrix exponential $e^{At}$</li>
<li>Test controllability via $[B\\;\\, AB\\;\\, A^2 B\\;\\, \\cdots]$ and observability via $[C;\\;CA;\\;CA^2;\\;\\cdots]$</li>
<li>Design state-feedback gain $K$ to place closed-loop poles anywhere (pole placement, Ackermann's formula)</li>
<li>Build a Luenberger observer to reconstruct hidden state from output, and apply the separation principle</li>
</ul>
</div>

<!-- ========================================================================
     SECTION 1
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">1. From Transfer Function to State-Space</h2>

<div class="calc-highlight"><strong>Bridge from classical to modern:</strong> Every linear time-invariant transfer function can be rewritten as a first-order matrix ODE. The conversion is mechanical; the payoff is that you now see all the internal variables that the transfer function hid.</div>

<p class="l-text">Start with a transfer function in the standard rational form, with numerator degree at most equal to the denominator degree:</p>

<div class="calc-formula"><div class="formula-label">TRANSFER FUNCTION FROM L3</div><div class="formula-main">$$H(s) = \\frac{Y(s)}{U(s)} = \\frac{b_{n-1} s^{n-1} + \\cdots + b_1 s + b_0}{s^n + a_{n-1} s^{n-1} + \\cdots + a_1 s + a_0}$$</div><div class="formula-sub">$n$ is the order of the system. We assume strictly proper here so $D = 0$; the proper case adds a feedthrough term.</div></div>

<p class="l-text">The trick is exactly the trick from L3 of the differential-equations track: introduce $n$ helper variables and turn the single $n$th-order ODE into $n$ coupled first-order ODEs. Define the state vector entries as the output and its first $n-1$ derivatives. Then $\\dot{x}_1 = x_2$, $\\dot{x}_2 = x_3$, and so on, with the last derivative tied to the input through the original ODE. This produces the <strong>controllable canonical form</strong>:</p>

<div class="calc-formula"><div class="formula-label">CONTROLLABLE CANONICAL FORM</div><div class="formula-main">$$A = \\begin{bmatrix} 0 & 1 & 0 & \\cdots & 0 \\\\ 0 & 0 & 1 & \\cdots & 0 \\\\ \\vdots & & & \\ddots & \\vdots \\\\ 0 & 0 & 0 & \\cdots & 1 \\\\ -a_0 & -a_1 & -a_2 & \\cdots & -a_{n-1} \\end{bmatrix}, \\quad B = \\begin{bmatrix} 0 \\\\ 0 \\\\ \\vdots \\\\ 0 \\\\ 1 \\end{bmatrix}, \\quad C = \\begin{bmatrix} b_0 & b_1 & \\cdots & b_{n-1} \\end{bmatrix}, \\quad D = 0$$</div><div class="formula-sub">The matrix $A$ is the same companion matrix from L3 of the diffeq track. Its characteristic polynomial is the denominator of $H(s)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$A$ — dynamics</div><div class="card-body">The denominator coefficients live in the bottom row. Eigenvalues of $A$ are exactly the poles of $H(s)$.</div></div>
<div class="calc-card"><div class="card-title">$B$ — input map</div><div class="card-body">Tells how the scalar input $u$ enters the state. In this form only the last state coordinate is driven directly.</div></div>
<div class="calc-card"><div class="card-title">$C$ — output map</div><div class="card-body">The numerator coefficients live here. They mix the internal states into the scalar output $y$.</div></div>
<div class="calc-card"><div class="card-title">$D$ — feedthrough</div><div class="card-body">Direct path from input to output, present only when $\\deg(\\text{num}) = \\deg(\\text{den})$. Zero in the strictly proper case.</div></div>
</div>

<div class="calc-example"><div class="example-label">CONCRETE CONVERSION</div><div class="example-body">Take $H(s) = \\dfrac{s + 2}{s^2 + 3s + 2}$. Identify $a_0 = 2$, $a_1 = 3$, $b_0 = 2$, $b_1 = 1$. The state-space realization is:<br><br>$A = \\begin{bmatrix} 0 & 1 \\\\ -2 & -3 \\end{bmatrix}$, $\\quad B = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$, $\\quad C = \\begin{bmatrix} 2 & 1 \\end{bmatrix}$, $\\quad D = 0$.<br><br>Check: $\\det(sI - A) = s(s+3) + 2 = s^2 + 3s + 2$, matching the denominator. The eigenvalues are $s = -1, -2$ — the poles.</div></div>

<p class="l-text"><strong>Realizations are not unique.</strong> For a given $H(s)$ there are infinitely many state-space realizations $(A, B, C, D)$. Any invertible change of state $\\tilde{X} = T X$ produces a new realization $(\\tilde{A}, \\tilde{B}, \\tilde{C}, \\tilde{D}) = (T A T^{-1}, T B, C T^{-1}, D)$ that has exactly the same transfer function. The transfer function captures only the input-output behavior, while the state-space realization additionally records a particular choice of internal coordinates. This freedom is a feature: you can pick coordinates that simplify analysis (the modal form, where $A$ is diagonal) or simplify control (the controllable form above) or simplify estimation (the observable canonical form).</p>

<div class="l-note"><strong>Why bother with state when you already have $H(s)$?</strong> Three reasons. First, $H(s)$ is single-input single-output by construction, while state-space handles MIMO systems with $u \\in \\mathbb{R}^m$ and $y \\in \\mathbb{R}^p$ uniformly. Second, internal stability and BIBO stability can disagree if there are unstable pole-zero cancellations — state-space sees the cancelled mode, the transfer function does not. Third, the design tools that came after 1960 (LQR, Kalman filtering, $H_\\infty$ synthesis, MPC) are formulated natively in state-space.</div>

<!-- ========================================================================
     SECTION 2
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">2. The State-Space Equations</h2>

<div class="calc-highlight"><strong>The two equations:</strong> A finite-dimensional, continuous-time, linear time-invariant system is fully described by a state equation and an output equation. The state vector $X(t) \\in \\mathbb{R}^n$ is the minimal summary of past history needed to predict the future given the future input.</div>

<p class="l-text">Write the state-space equations in full glory:</p>

<div class="calc-formula"><div class="formula-label">LTI STATE-SPACE MODEL</div><div class="formula-main">$$\\dot{X}(t) = A\\, X(t) + B\\, U(t), \\qquad Y(t) = C\\, X(t) + D\\, U(t)$$</div><div class="formula-sub">$X \\in \\mathbb{R}^n$ state, $U \\in \\mathbb{R}^m$ input, $Y \\in \\mathbb{R}^p$ output. Matrices: $A \\in \\mathbb{R}^{n \\times n}$, $B \\in \\mathbb{R}^{n \\times m}$, $C \\in \\mathbb{R}^{p \\times n}$, $D \\in \\mathbb{R}^{p \\times m}$.</div></div>

<p class="l-text">The first equation, $\\dot{X} = AX + BU$, is the <strong>state equation</strong>. It says the velocity of the state at time $t$ is a linear function of the current state plus a linear push from the input. The second equation, $Y = CX + DU$, is the <strong>output equation</strong>. It says the measured output is a linear combination of the current state plus a direct feedthrough of the input.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">State $X(t)$</div><div class="card-body">The minimal information needed at time $t$ to predict $X(\\tau)$ for $\\tau > t$ given $U[t, \\tau]$. Anything more is redundant; anything less is insufficient.</div></div>
<div class="calc-card"><div class="card-title">Input $U(t)$</div><div class="card-body">The signals you choose: motor voltages, valve openings, throttle. The control problem is to pick $U$ so that the state behaves as desired.</div></div>
<div class="calc-card"><div class="card-title">Output $Y(t)$</div><div class="card-body">The signals you measure: encoder ticks, ADC readings, accelerometer outputs. Generally $p < n$, so not every state is directly visible.</div></div>
<div class="calc-card"><div class="card-title">Time-invariant</div><div class="card-body">All four matrices are constant. Time-varying $(A(t), B(t), C(t), D(t))$ is harder; nonlinear $\\dot{X} = f(X, U)$ is harder still, but linearization brings us back here.</div></div>
</div>

<p class="l-text">The state $X$ summarizes <em>all the past history that is relevant for the future</em>. If you know $X(t_0)$ exactly and the input $U(\\tau)$ for $\\tau > t_0$, you can compute $X(t)$ and $Y(t)$ for every future time. You do not need any memory of inputs before $t_0$. This Markov-like property is the defining property of a state.</p>

<div class="calc-example"><div class="example-label">DC MOTOR STATE</div><div class="example-body">A DC motor driving an inertial load has three natural state variables: armature current $i$, angular velocity $\\omega$, and angular position $\\theta$. The input is the applied armature voltage $v$. The output you measure depends on the sensor — an encoder gives $\\theta$, a tachometer gives $\\omega$, a current sensor gives $i$. The state equation captures Newton's law for the mechanical side and Kirchhoff's voltage law for the electrical side, coupled through the back-EMF and torque constants.</div></div>

<div class="l-note"><strong>Choosing the state.</strong> For an electrical or mechanical system, the natural states are <em>energy storage variables</em>: capacitor voltages, inductor currents, masses' velocities, springs' compressions. The dimension of the state equals the number of independent energy storage elements. This physical principle gives you the order $n$ before you have written a single equation.</div>

<!-- ========================================================================
     SECTION 3
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">3. Solution of $\\dot{X} = AX$ — The Matrix Exponential</h2>

<div class="calc-highlight"><strong>The scalar solution generalizes verbatim:</strong> The scalar ODE $\\dot{x} = ax$ has the solution $x(t) = e^{at} x_0$. The vector ODE $\\dot{X} = AX$ has the solution $X(t) = e^{At} X_0$, where $e^{At}$ is the matrix exponential. Every long-term property of the unforced system is encoded in $e^{At}$.</div>

<p class="l-text">Define the matrix exponential by the power series, identical in form to the scalar one:</p>

<div class="calc-formula"><div class="formula-label">MATRIX EXPONENTIAL</div><div class="formula-main">$$e^{At} = I + At + \\frac{1}{2!} (At)^2 + \\frac{1}{3!} (At)^3 + \\cdots = \\sum_{k=0}^{\\infty} \\frac{(At)^k}{k!}$$</div><div class="formula-sub">The series converges for every square matrix $A$ and every real $t$.</div></div>

<p class="l-text">For the autonomous (no-input) system $\\dot{X} = AX$ with $X(0) = X_0$, the unique solution is</p>

<div class="calc-formula"><div class="formula-label">UNFORCED RESPONSE</div><div class="formula-main">$$X(t) = e^{At} X_0$$</div><div class="formula-sub">No input is applied. The state evolves only under its own internal dynamics.</div></div>

<p class="l-text">For the full forced system $\\dot{X} = AX + BU$ with $X(0) = X_0$, the solution is the sum of the unforced response and a convolution-style integral of the input:</p>

<div class="calc-formula"><div class="formula-label">FULL STATE-SPACE SOLUTION (VARIATION OF CONSTANTS)</div><div class="formula-main">$$X(t) = e^{At} X_0 + \\int_0^t e^{A(t - \\tau)} B\\, U(\\tau)\\, d\\tau$$</div><div class="formula-sub">The first term is the zero-input response. The second is the zero-state response — the convolution of the impulse response $e^{At} B$ with the input.</div></div>

<p class="l-text"><strong>Connection to eigenvalues.</strong> Diagonalize $A = P \\Lambda P^{-1}$ where $\\Lambda = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$ and $P$ holds the eigenvectors. Then a beautiful identity emerges from the power series:</p>

<div class="calc-formula"><div class="formula-label">EIGENDECOMPOSITION OF $e^{At}$</div><div class="formula-main">$$e^{At} = P\\, e^{\\Lambda t}\\, P^{-1} = P\\, \\text{diag}(e^{\\lambda_1 t}, \\ldots, e^{\\lambda_n t})\\, P^{-1}$$</div><div class="formula-sub">The matrix exponential is a sum of pure exponential modes, one for each eigenvalue, mixed by the eigenvectors.</div></div>

<p class="l-text">Each eigenvalue $\\lambda_i$ defines a natural mode that decays or grows along eigenvector $v_i$ at rate $e^{\\lambda_i t}$. A complex pair $\\lambda = \\alpha \\pm i \\beta$ produces an oscillating mode $e^{\\alpha t} \\cos(\\beta t)$ and $e^{\\alpha t} \\sin(\\beta t)$, decaying or growing depending on the sign of $\\alpha$. The full unforced response is a superposition of these modes weighted by how the initial condition decomposes in the eigenbasis. This is precisely the structure we already met in L3 of the differential-equations track; state-space adds the input and output equations on top.</p>

<div id="plot-l5-modes-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=400;var ts=[];for(var i=0;i<n;i++)ts.push(i*5/(n-1));
function mode(lam){var ys=[];for(var i=0;i<n;i++)ys.push(Math.exp(lam*ts[i]));return ys;}
function osc(a,b){var ys=[];for(var i=0;i<n;i++)ys.push(Math.exp(a*ts[i])*Math.cos(b*ts[i]));return ys;}
var t1={x:ts,y:mode(-1.5),mode:"lines",name:"lambda = -1.5 (fast decay)",line:{color:"#3b82f6",width:2.5}};
var t2={x:ts,y:mode(-0.4),mode:"lines",name:"lambda = -0.4 (slow decay)",line:{color:"#a78bfa",width:2.5}};
var t3={x:ts,y:osc(-0.3,3),mode:"lines",name:"lambda = -0.3 +/- 3i (damped oscillation)",line:{color:"#22c55e",width:2.5}};
var t4={x:ts,y:mode(0.3),mode:"lines",name:"lambda = +0.3 (unstable growth)",line:{color:"#f87171",width:2.5,dash:"dash"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"time t (s)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"mode amplitude",range:[-1.5,4.5]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l5-modes-en",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Four natural modes that contribute to the unforced response $e^{At} X_0$. Real negative eigenvalues produce monotone decays at different rates; complex eigenvalues with negative real part produce damped oscillations; a real positive eigenvalue produces unbounded exponential growth. The full response of any LTI system is a weighted sum of modes like these — one per eigenvalue of $A$.</div></div>

<!-- ========================================================================
     SECTION 4
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">4. Stability via Eigenvalues</h2>

<div class="calc-highlight"><strong>The cleanest stability theorem in control:</strong> The autonomous system $\\dot{X} = AX$ is asymptotically stable if and only if every eigenvalue of $A$ has strictly negative real part. Read off stability by looking at where the eigenvalues sit in the complex plane.</div>

<p class="l-text">From Section 3, the unforced solution is $X(t) = e^{At} X_0 = P \\, \\text{diag}(e^{\\lambda_i t}) \\, P^{-1} X_0$. Whether $X(t) \\to 0$ depends only on whether every $e^{\\lambda_i t} \\to 0$. For real eigenvalues this requires $\\lambda_i < 0$. For a complex pair $\\lambda = \\alpha \\pm i \\beta$, the magnitude of $e^{\\lambda t}$ is $e^{\\alpha t}$, so we need $\\alpha < 0$. In both cases the condition is identical: <strong>the real part is negative</strong>.</p>

<div class="calc-formula"><div class="formula-label">STABILITY CRITERION</div><div class="formula-main">$$\\dot{X} = AX \\text{ asymptotically stable} \\iff \\text{Re}(\\lambda_i) < 0 \\text{ for every eigenvalue } \\lambda_i \\text{ of } A$$</div><div class="formula-sub">Equivalently: every eigenvalue lies in the open left half of the complex plane.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stable region</div><div class="card-body">Strict left half-plane $\\text{Re}(\\lambda) < 0$. Trajectories decay to the origin from any initial condition.</div></div>
<div class="calc-card"><div class="card-title">Unstable region</div><div class="card-body">Any eigenvalue with $\\text{Re}(\\lambda) > 0$. Some trajectories blow up exponentially.</div></div>
<div class="calc-card"><div class="card-title">Marginal cases</div><div class="card-body">Eigenvalues on the imaginary axis. Distinct: trajectories stay bounded (Lyapunov stable). Repeated defective: polynomial growth, unstable.</div></div>
<div class="calc-card"><div class="card-title">Pole = eigenvalue</div><div class="card-body">For the realization $(A,B,C,D)$ of $H(s)$, the eigenvalues of $A$ contain the poles of $H(s)$. Same stability test.</div></div>
</div>

<p class="l-text">This is the modern restatement of the rule we already know from L3 and L4 of this track: poles in the left half-plane mean a stable system; poles in the right half-plane mean instability. The state-space version is stronger because eigenvalues of $A$ catch <em>internal</em> modes that may have been cancelled in the transfer function. A right-half-plane eigenvalue is dangerous even if its mode is invisible in $H(s)$ — internal instability still means runaway state, possibly saturating actuators or breaking the plant.</p>

<div class="calc-example"><div class="example-label">QUICK STABILITY CHECK</div><div class="example-body">$A = \\begin{bmatrix} -1 & 2 \\\\ -3 & -4 \\end{bmatrix}$. Characteristic polynomial $\\det(sI - A) = (s+1)(s+4) + 6 = s^2 + 5s + 10$. Roots $s = -2.5 \\pm 1.94 i$. Real part $-2.5 < 0$, so <strong>stable</strong>. Trajectories spiral into the origin.</div></div>

<div class="l-note"><strong>Lyapunov restatement.</strong> An equivalent characterization avoids eigenvalues entirely: $A$ is Hurwitz (all eigenvalues in the open left half-plane) if and only if there exists a positive definite matrix $P > 0$ that solves $A^T P + P A = -Q$ for some positive definite $Q > 0$. This <em>Lyapunov equation</em> is a linear matrix equation, and its solvability is a numerical test for stability that scales nicely to high dimension and is the workhorse of L8.</div>

<!-- ========================================================================
     SECTION 5
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">5. Controllability — Can We Steer the State?</h2>

<div class="calc-highlight"><strong>The first big modern question:</strong> Given the system $\\dot{X} = AX + BU$ and an arbitrary target state $X_f$, does there exist an input $U(t)$ on a finite interval $[0, T]$ that drives the state from $X(0) = 0$ to $X(T) = X_f$? If yes for every $X_f$, the system is <em>controllable</em>.</div>

<p class="l-text">Controllability is not about stability and not about good or bad performance. It is a binary structural property of the pair $(A, B)$. Either every direction of the state space can be reached from the input, or it cannot. The test is a clean rank condition on a finite-dimensional matrix.</p>

<div class="calc-formula"><div class="formula-label">CONTROLLABILITY MATRIX</div><div class="formula-main">$$\\mathcal{C} = \\begin{bmatrix} B & AB & A^2 B & \\cdots & A^{n-1} B \\end{bmatrix} \\in \\mathbb{R}^{n \\times n m}$$</div><div class="formula-sub">Stack $B$ and its iterates $AB, A^2 B, \\ldots$ up to $A^{n-1} B$ as block columns.</div></div>

<div class="calc-formula"><div class="formula-label">KALMAN CONTROLLABILITY THEOREM</div><div class="formula-main">$$(A, B) \\text{ controllable} \\iff \\text{rank}(\\mathcal{C}) = n$$</div><div class="formula-sub">Full row rank — the controllability matrix spans the entire $n$-dimensional state space.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reachable subspace</div><div class="card-body">The range of $\\mathcal{C}$ is exactly the set of states reachable from the origin by any input. Full rank $\\iff$ every state reachable.</div></div>
<div class="calc-card"><div class="card-title">Why $n-1$ powers</div><div class="card-body">By Cayley-Hamilton, $A^n$ is a linear combination of $I, A, \\ldots, A^{n-1}$, so higher powers add nothing new to the column span.</div></div>
<div class="calc-card"><div class="card-title">Uncontrollable mode</div><div class="card-body">A rank deficiency reveals at least one eigenvalue $\\lambda$ of $A$ whose left eigenvector $w$ satisfies $w^T B = 0$. The mode in direction $w$ cannot be touched.</div></div>
<div class="calc-card"><div class="card-title">SISO simplification</div><div class="card-body">For single input ($m=1$), $\\mathcal{C}$ is square $n \\times n$ and the test reduces to $\\det(\\mathcal{C}) \\neq 0$.</div></div>
</div>

<div class="calc-example"><div class="example-label">CONTROLLABLE EXAMPLE</div><div class="example-body">$A = \\begin{bmatrix} 0 & 1 \\\\ -2 & -3 \\end{bmatrix}$, $B = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$ (the controllable canonical form from Section 1). Then $AB = \\begin{bmatrix} 1 \\\\ -3 \\end{bmatrix}$ and $\\mathcal{C} = \\begin{bmatrix} 0 & 1 \\\\ 1 & -3 \\end{bmatrix}$. Determinant $= -1 \\neq 0$. Full rank. <strong>Controllable.</strong> No surprise — the controllable canonical form is always controllable, that is why it bears the name.</div></div>

<div class="calc-example"><div class="example-label">UNCONTROLLABLE EXAMPLE</div><div class="example-body">$A = \\begin{bmatrix} -1 & 0 \\\\ 0 & -2 \\end{bmatrix}$, $B = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$. The diagonal form decouples the two modes; $B$ only touches the first. Then $AB = \\begin{bmatrix} -1 \\\\ 0 \\end{bmatrix}$ and $\\mathcal{C} = \\begin{bmatrix} 1 & -1 \\\\ 0 & 0 \\end{bmatrix}$ has rank 1. <strong>Uncontrollable.</strong> The second state coordinate evolves $\\dot{x}_2 = -2 x_2$ regardless of $u$ — we cannot change it.</div></div>

<div id="plot-l5-ctrb-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=300;var ts=[];for(var i=0;i<n;i++)ts.push(i*5/(n-1));
var x1A=[];var x2A=[];var x1B=[];var x2B=[];
var s1=[0,1];var s2=[1,0];var dt=5/(n-1);
for(var i=0;i<n;i++){
  x1A.push(s1[0]);x2A.push(s1[1]);
  x1B.push(s2[0]);x2B.push(s2[1]);
  var u=Math.sin(2*ts[i]);
  var d1=[s1[1],-2*s1[0]-3*s1[1]+u];
  s1[0]+=d1[0]*dt;s1[1]+=d1[1]*dt;
  var d2=[-s2[0]+u,-2*s2[1]];
  s2[0]+=d2[0]*dt;s2[1]+=d2[1]*dt;
}
var t1={x:ts,y:x2B,mode:"lines",name:"x_2 — uncontrollable (input ignored)",line:{color:"#f87171",width:2.5}};
var t2={x:ts,y:x1B,mode:"lines",name:"x_1 — controllable (input acts)",line:{color:"#3b82f6",width:2.5}};
var t3={x:ts,y:x1A,mode:"lines",name:"controllable form x_1",line:{color:"#a78bfa",width:1.6,dash:"dot"}};
var t4={x:ts,y:x2A,mode:"lines",name:"controllable form x_2",line:{color:"#22c55e",width:1.6,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"time t (s)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"state value"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.12,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l5-ctrb-en",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Two systems driven by the same sinusoidal input $u(t) = \\sin(2t)$. Solid lines: an uncontrollable diagonal system where input only drives $x_1$ — the second coordinate $x_2$ ignores the input and decays from its initial value. Dotted lines: a controllable companion-form system where the input reaches both states through the coupled dynamics. Controllability is the structural property that decides which trajectories you can ever produce.</div></div>

<div class="l-note"><strong>Why this matters for design.</strong> If $(A, B)$ is not controllable, the uncontrollable modes evolve freely. If those modes happen to be stable, you can still ignore them. If any uncontrollable mode is unstable, you have a hopeless design — no feedback can save you. This is why the controllability test is the very first check before you try any modern controller design.</div>

<!-- ========================================================================
     SECTION 6
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">6. Observability — Can We Recover the State?</h2>

<div class="calc-highlight"><strong>The dual question:</strong> Given the measured output $Y(t) = CX(t) + DU(t)$ over a finite time interval, and given the known input $U(t)$, can you reconstruct the initial state $X(0)$? If yes for every possible $X(0)$, the system is <em>observable</em>.</div>

<p class="l-text">Observability concerns the pair $(A, C)$ and asks whether the output carries enough information to pin down the internal state. Without observability, distinct initial states produce identical outputs and the controller has no way to tell them apart from measurements. The test is the structural dual of the controllability test.</p>

<div class="calc-formula"><div class="formula-label">OBSERVABILITY MATRIX</div><div class="formula-main">$$\\mathcal{O} = \\begin{bmatrix} C \\\\ CA \\\\ CA^2 \\\\ \\vdots \\\\ CA^{n-1} \\end{bmatrix} \\in \\mathbb{R}^{n p \\times n}$$</div><div class="formula-sub">Stack $C$ and the products $CA, CA^2, \\ldots, CA^{n-1}$ as block rows.</div></div>

<div class="calc-formula"><div class="formula-label">KALMAN OBSERVABILITY THEOREM</div><div class="formula-main">$$(A, C) \\text{ observable} \\iff \\text{rank}(\\mathcal{O}) = n$$</div><div class="formula-sub">Full column rank — every direction in state space leaves a distinct fingerprint on the output.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Unobservable subspace</div><div class="card-body">$\\text{ker}(\\mathcal{O}) \\subset \\mathbb{R}^n$ is the set of states that produce zero output. Trivial $\\iff$ observable.</div></div>
<div class="calc-card"><div class="card-title">Duality</div><div class="card-body">$(A, B)$ controllable $\\iff$ $(A^T, B^T)$ observable. Every controllability theorem has an observability twin obtained by transposing.</div></div>
<div class="calc-card"><div class="card-title">PBH test</div><div class="card-body">$(A, C)$ observable $\\iff \\begin{bmatrix} sI - A \\\\ C \\end{bmatrix}$ has full column rank for every $s \\in \\mathbb{C}$.</div></div>
<div class="calc-card"><div class="card-title">SISO simplification</div><div class="card-body">For single output ($p=1$), $\\mathcal{O}$ is square $n \\times n$ and observability reduces to $\\det(\\mathcal{O}) \\neq 0$.</div></div>
</div>

<div class="calc-example"><div class="example-label">OBSERVABLE EXAMPLE</div><div class="example-body">$A = \\begin{bmatrix} 0 & 1 \\\\ -2 & -3 \\end{bmatrix}$, $C = \\begin{bmatrix} 1 & 0 \\end{bmatrix}$ (we measure only the first state). Then $CA = \\begin{bmatrix} 0 & 1 \\end{bmatrix}$ and $\\mathcal{O} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I$, full rank. <strong>Observable.</strong> Even though we measure only one of two states, the dynamics couple them, and watching $y(t)$ over time reveals the other one through its derivative.</div></div>

<div class="calc-example"><div class="example-label">UNOBSERVABLE EXAMPLE</div><div class="example-body">$A = \\begin{bmatrix} -1 & 0 \\\\ 0 & -2 \\end{bmatrix}$, $C = \\begin{bmatrix} 1 & 0 \\end{bmatrix}$. The two modes are decoupled and we only see the first. Then $CA = \\begin{bmatrix} -1 & 0 \\end{bmatrix}$ and $\\mathcal{O} = \\begin{bmatrix} 1 & 0 \\\\ -1 & 0 \\end{bmatrix}$ has rank 1. <strong>Unobservable.</strong> The second mode contributes nothing to the output; we cannot reconstruct $x_2(0)$ from $y(t)$.</div></div>

<div class="l-note"><strong>Kalman decomposition.</strong> Any LTI system can be split into four block-diagonal pieces: controllable and observable, controllable but unobservable, observable but uncontrollable, and neither. Only the first piece appears in the transfer function. The other three are hidden modes — present in the state-space model, invisible to input-output testing, dangerous when unstable.</div>

<!-- ========================================================================
     SECTION 7
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">7. State Feedback and Pole Placement</h2>

<div class="calc-highlight"><strong>The first big modern theorem:</strong> If $(A, B)$ is controllable, then the state feedback $u = -KX$ can place the closed-loop eigenvalues at <em>any</em> set of desired locations in the complex plane (closed under conjugation). The classical root-locus picture, which had to live with what the system gave it, is replaced by free design.</div>

<p class="l-text">Suppose we are allowed to measure the full state and choose the input as a linear function of it. The control law is</p>

<div class="calc-formula"><div class="formula-label">STATE FEEDBACK</div><div class="formula-main">$$u(t) = -K\\, X(t), \\qquad K \\in \\mathbb{R}^{m \\times n}$$</div><div class="formula-sub">$K$ is a constant gain matrix. We design $K$.</div></div>

<p class="l-text">Substituting back into the state equation gives the closed-loop dynamics:</p>

<div class="calc-formula"><div class="formula-label">CLOSED-LOOP SYSTEM</div><div class="formula-main">$$\\dot{X} = AX + B(-KX) = (A - BK)\\, X$$</div><div class="formula-sub">The closed-loop matrix is $A_{cl} = A - BK$. Its eigenvalues are the closed-loop poles.</div></div>

<p class="l-text"><strong>Pole placement theorem.</strong> If $(A, B)$ is controllable, then for every desired set $\\{\\mu_1, \\ldots, \\mu_n\\}$ of closed-loop eigenvalues (a self-conjugate set), there exists a gain matrix $K$ such that the eigenvalues of $A - BK$ are exactly $\\{\\mu_1, \\ldots, \\mu_n\\}$. The gain is unique in the single-input case; for multi-input plants there is design freedom that can be used for additional objectives.</p>

<div class="calc-formula"><div class="formula-label">ACKERMANN'S FORMULA (SINGLE INPUT)</div><div class="formula-main">$$K = \\begin{bmatrix} 0 & 0 & \\cdots & 0 & 1 \\end{bmatrix} \\mathcal{C}^{-1}\\, p_d(A)$$</div><div class="formula-sub">$p_d(s) = (s - \\mu_1)(s - \\mu_2) \\cdots (s - \\mu_n)$ is the desired closed-loop characteristic polynomial; $p_d(A)$ substitutes the matrix $A$ into that polynomial.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Design knob</div><div class="card-body">Picking $\\mu_i$ is a control engineer's choice. Faster poles mean snappier response; slower poles mean less actuator effort.</div></div>
<div class="calc-card"><div class="card-title">Limits</div><div class="card-body">Aggressive pole placement demands big $K$ entries — saturating actuators and amplifying measurement noise. In practice LQR (L6) trades performance for energy.</div></div>
<div class="calc-card"><div class="card-title">Controllability essential</div><div class="card-body">If $(A, B)$ is not controllable, some closed-loop eigenvalues are fixed at the uncontrollable eigenvalues of $A$. No $K$ can move them.</div></div>
<div class="calc-card"><div class="card-title">Robustness</div><div class="card-body">Pole placement uses the model exactly. Real plants have parameter uncertainty; $H_\\infty$ and $\\mu$-synthesis address this systematically.</div></div>
</div>

<div class="calc-example"><div class="example-label">POLE PLACEMENT WORKED OUT</div><div class="example-body">Plant $A = \\begin{bmatrix} 0 & 1 \\\\ -2 & -3 \\end{bmatrix}$, $B = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$. Open-loop poles: $-1, -2$. Desired closed-loop poles: $-4, -5$ (faster). Desired polynomial: $p_d(s) = (s+4)(s+5) = s^2 + 9s + 20$. In the controllable form, $K = [k_1\\; k_2]$ gives $A - BK = \\begin{bmatrix} 0 & 1 \\\\ -2 - k_1 & -3 - k_2 \\end{bmatrix}$. The characteristic polynomial is $s^2 + (3 + k_2) s + (2 + k_1)$. Match coefficients: $k_1 = 18$, $k_2 = 6$. So $K = [18\\; 6]$.</div></div>

<div id="plot-l5-pp-en" class="plotly-graph"></div>
<script>setTimeout(function(){
function plotPoles(){
  var openX=[-1,-2];var openY=[0,0];
  var closedX=[-4,-5];var closedY=[0,0];
  var t1={x:openX,y:openY,mode:"markers",name:"Open-loop poles (lambda of A)",marker:{color:"#f87171",size:14,symbol:"x",line:{width:3}}};
  var t2={x:closedX,y:closedY,mode:"markers",name:"Closed-loop poles (lambda of A - BK)",marker:{color:"#3b82f6",size:14,symbol:"circle",line:{color:"#ebe6dc",width:1}}};
  var t3={x:[0,0],y:[-3,3],mode:"lines",name:"imaginary axis",line:{color:"#a78bfa",width:1.4,dash:"dash"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Re(s)",range:[-7,3]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Im(s)",range:[-3,3],scaleanchor:"x"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:11}},annotations:[{x:-1,y:0.3,text:"-1",showarrow:false,font:{color:"#f87171",size:11}},{x:-2,y:0.3,text:"-2",showarrow:false,font:{color:"#f87171",size:11}},{x:-4,y:0.3,text:"-4 (placed)",showarrow:false,font:{color:"#3b82f6",size:11}},{x:-5,y:0.3,text:"-5 (placed)",showarrow:false,font:{color:"#3b82f6",size:11}}]};
  Plotly.newPlot("plot-l5-pp-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
}
plotPoles();
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> The pole placement payoff. Open-loop poles at $-1, -2$ (red crosses) describe a stable but somewhat sluggish plant. Designing state feedback $K = [18,\\, 6]$ moves the closed-loop poles to $-4, -5$ (blue dots), four times deeper into the left half-plane — faster, more damped response. With controllability and a state measurement, any desired pole configuration is reachable.</div></div>

<!-- ========================================================================
     SECTION 8
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">8. Worked Example — Inverted Pendulum on a Cart</h2>

<div class="calc-highlight"><strong>The canonical demo:</strong> An inverted pendulum balanced on a moving cart is unstable, nonlinear, and a beautiful playground for state-feedback design. Linearize around the upright equilibrium, write the state-space model, and design a gain that stabilizes the inverted position.</div>

<p class="l-text">A pendulum of mass $m$ and length $\\ell$ is hinged on top of a cart of mass $M$ that can move horizontally. The cart position is $x$, the pendulum angle from vertical is $\\theta$. A horizontal force $F$ acts on the cart. The full equations of motion are nonlinear, but linearizing for small $\\theta$ near the upright position $(\\theta = 0)$ gives a four-state linear model with state vector</p>

<div class="calc-formula"><div class="formula-label">PENDULUM STATE VECTOR</div><div class="formula-main">$$X = \\begin{bmatrix} x \\\\ \\dot{x} \\\\ \\theta \\\\ \\dot{\\theta} \\end{bmatrix}$$</div><div class="formula-sub">Cart position, cart velocity, pendulum angle (from vertical), pendulum angular velocity.</div></div>

<p class="l-text">For typical numerical values $M = 1$ kg, $m = 0.2$ kg, $\\ell = 0.5$ m, $g = 9.81$ m/s$^2$, the linearized matrices come out (after the Lagrangian derivation) as:</p>

<div class="calc-formula"><div class="formula-label">LINEARIZED CART-POLE MODEL</div><div class="formula-main">$$A \\approx \\begin{bmatrix} 0 & 1 & 0 & 0 \\\\ 0 & 0 & -1.96 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 23.5 & 0 \\end{bmatrix}, \\quad B \\approx \\begin{bmatrix} 0 \\\\ 1.0 \\\\ 0 \\\\ -2.0 \\end{bmatrix}$$</div><div class="formula-sub">Output: $y = \\theta$ for tilt sensors, or $y = x$ for position sensors, or both.</div></div>

<p class="l-text"><strong>Stability of open loop.</strong> Eigenvalues of $A$ are $0, 0, \\pm \\sqrt{g(M+m)/(M\\ell)} \\approx \\pm 4.85$. The positive eigenvalue $+4.85$ is the upside-down instability — the pendulum falls. The two zero eigenvalues correspond to cart drift (a rigid translation does not change anything). The system is open-loop unstable; without control the pendulum tips over within a fraction of a second.</p>

<p class="l-text"><strong>Controllability.</strong> Compute $\\mathcal{C} = [B\\;\\, AB\\;\\, A^2 B\\;\\, A^3 B]$. For the numbers above $\\det(\\mathcal{C}) \\neq 0$, so the system is fully controllable. We can stabilize it with state feedback.</p>

<p class="l-text"><strong>Designing $K$.</strong> Pick four desired closed-loop poles, for example $\\{-2, -2.5, -3, -3.5\\}$ — all left half-plane, well damped. Use Ackermann or numerical pole placement to solve for $K$. Typical result: $K \\approx [-2.4,\\; -3.1,\\; -42,\\; -9]$ (signs and magnitudes vary with units and pole choice). Apply $u = -KX$ and the closed-loop matrix $A - BK$ has all four eigenvalues at the desired locations. The pendulum balances.</p>

<div id="plot-l5-pendulum-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=600;var Tf=4;var dt=Tf/n;var ts=[];
var thOpen=[];var thClosed=[];
var sO=[0,0,0.05,0];var sC=[0,0,0.05,0];
var g=9.81,M=1.0,mp=0.2,L=0.5;
var c2=mp*L*g/(M*L);
var A22=-mp*g/M;
var A42=(M+mp)*g/(M*L);
function dyn(s,u){
  var x=s[0],xd=s[1],th=s[2],thd=s[3];
  return [xd, u/M + A22*th, thd, A42*th - u/(M*L)];
}
var K=[-3.0,-5.0,-50,-12];
for(var i=0;i<n;i++){
  ts.push(i*dt);
  thOpen.push(sO[2]);thClosed.push(sC[2]);
  var dO=dyn(sO,0);
  var uC=-(K[0]*sC[0]+K[1]*sC[1]+K[2]*sC[2]+K[3]*sC[3]);
  var dC=dyn(sC,uC);
  for(var k=0;k<4;k++){sO[k]+=dO[k]*dt;sC[k]+=dC[k]*dt;}
  if(Math.abs(sO[2])>2)sO[2]=Math.sign(sO[2])*2;
}
var t1={x:ts,y:thOpen,mode:"lines",name:"theta(t) — open loop (falls)",line:{color:"#f87171",width:2.5}};
var t2={x:ts,y:thClosed,mode:"lines",name:"theta(t) — closed loop u = -KX (balances)",line:{color:"#3b82f6",width:2.5}};
var t3={x:[0,Tf],y:[0,0],mode:"lines",name:"upright theta = 0",line:{color:"#a78bfa",width:1.2,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"time t (s)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"angle theta (rad)",range:[-0.5,2.1]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l5-pendulum-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> The inverted pendulum tilt $\\theta(t)$ starting from a small initial perturbation of $0.05$ rad. Without control (red) the angle grows exponentially through the linear approximation, then saturates as the model breaks down — the pendulum has fallen. With state feedback $u = -KX$ (blue) the angle is driven to zero in about 2 seconds — the controller stabilizes a fundamentally unstable plant. This is the canonical demonstration that state feedback can do what no fixed-structure classical controller can.</div></div>

<!-- ========================================================================
     SECTION 9
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">9. State Observer — Luenberger</h2>

<div class="calc-highlight"><strong>Reality bites again:</strong> state feedback assumed we knew the full state $X$. In practice we measure only $Y = CX$ with $p < n$ sensors. The Luenberger observer is a clean construction that reconstructs an estimate $\\hat{X}(t)$ from the available output, and the estimate is good enough to feed into the state-feedback law.</div>

<p class="l-text">Build a copy of the plant in software, driven by the same input $U$, plus a correction term proportional to the difference between the measured output and the predicted output:</p>

<div class="calc-formula"><div class="formula-label">LUENBERGER OBSERVER</div><div class="formula-main">$$\\dot{\\hat{X}} = A \\hat{X} + B U + L (Y - C \\hat{X})$$</div><div class="formula-sub">$L \\in \\mathbb{R}^{n \\times p}$ is the observer gain. The term $Y - C\\hat{X}$ is the output-prediction error.</div></div>

<p class="l-text">Define the estimation error $e = X - \\hat{X}$. Subtracting the observer equation from the plant equation gives the error dynamics:</p>

<div class="calc-formula"><div class="formula-label">OBSERVER ERROR DYNAMICS</div><div class="formula-main">$$\\dot{e} = (A - LC)\\, e$$</div><div class="formula-sub">Independent of input. The error decays to zero iff $A - LC$ is Hurwitz.</div></div>

<p class="l-text">By the duality between controllability and observability, choosing $L$ to place the eigenvalues of $A - LC$ at desired locations is the same problem as choosing $K$ to place eigenvalues of $A - BK$. We apply the same pole-placement machinery to the dual pair $(A^T, C^T)$: if $(A, C)$ is observable, then $(A^T, C^T)$ is controllable, and we can place the observer poles anywhere.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Design rule of thumb</div><div class="card-body">Observer poles are usually placed 3 to 10 times faster than controller poles, so estimation error decays before it affects control performance.</div></div>
<div class="calc-card"><div class="card-title">Noise tradeoff</div><div class="card-body">Fast observer pole = aggressive correction = amplifies measurement noise. Slow observer pole = quiet estimate = slow to react to disturbances.</div></div>
<div class="calc-card"><div class="card-title">Kalman filter</div><div class="card-body">The optimal observer in the presence of Gaussian noise. Same structure as Luenberger; the gain $L$ minimizes a covariance criterion (covered in L6).</div></div>
<div class="calc-card"><div class="card-title">Output feedback</div><div class="card-body">Combine: $u = -K\\hat{X}$ where $\\hat{X}$ comes from the observer. The composite system has $2n$ states and is implementable from $Y$ alone.</div></div>
</div>

<p class="l-text"><strong>Separation principle.</strong> A profound and surprisingly easy theorem: the closed-loop eigenvalues of the combined controller-observer system are exactly the union of the controller eigenvalues (eigenvalues of $A - BK$) and the observer eigenvalues (eigenvalues of $A - LC$). The designs decouple. You pick $K$ to place controller poles, you pick $L$ independently to place observer poles, and the composite closed-loop poles are just the two sets stacked together. This is one of the cleanest results in all of control theory.</p>

<div id="plot-l5-obs-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=400;var Tf=5;var dt=Tf/n;var ts=[];
var x1=[];var x2=[];var xh1=[];var xh2=[];var e1=[];var e2=[];
var sX=[1.0,0.5];var sXh=[0,0];
var A=[[0,1],[-2,-3]];var Cv=[1,0];var L=[5,4];
for(var i=0;i<n;i++){
  ts.push(i*dt);
  x1.push(sX[0]);x2.push(sX[1]);
  xh1.push(sXh[0]);xh2.push(sXh[1]);
  e1.push(sX[0]-sXh[0]);e2.push(sX[1]-sXh[1]);
  var y=Cv[0]*sX[0]+Cv[1]*sX[1];
  var yh=Cv[0]*sXh[0]+Cv[1]*sXh[1];
  var dx=[A[0][0]*sX[0]+A[0][1]*sX[1],A[1][0]*sX[0]+A[1][1]*sX[1]];
  var dxh=[A[0][0]*sXh[0]+A[0][1]*sXh[1]+L[0]*(y-yh),A[1][0]*sXh[0]+A[1][1]*sXh[1]+L[1]*(y-yh)];
  sX[0]+=dx[0]*dt;sX[1]+=dx[1]*dt;
  sXh[0]+=dxh[0]*dt;sXh[1]+=dxh[1]*dt;
}
var t1={x:ts,y:e1,mode:"lines",name:"e_1(t) = x_1 - xhat_1",line:{color:"#3b82f6",width:2.5}};
var t2={x:ts,y:e2,mode:"lines",name:"e_2(t) = x_2 - xhat_2",line:{color:"#a78bfa",width:2.5}};
var t3={x:[0,Tf],y:[0,0],mode:"lines",name:"zero error",line:{color:"#f87171",width:1.2,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"time t (s)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"estimation error"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l5-obs-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Luenberger observer estimation error for a second-order plant. The true state starts at $(1.0, 0.5)$ and the observer starts at $(0, 0)$ — a worst-case initialization. With observer gain $L = [5, 4]$ chosen to place the eigenvalues of $A - LC$ deep into the left half-plane, both error components converge to zero in about two seconds. After that, the estimate tracks the true state and can be fed into the state-feedback law as if it were the real measurement.</div></div>

<div class="l-note"><strong>Block diagram view.</strong> The complete output-feedback controller is: plant $\\to$ output $Y$ $\\to$ observer (running a copy of the plant + correction) $\\to$ estimate $\\hat{X}$ $\\to$ multiply by $-K$ $\\to$ input $U$ $\\to$ back to plant. From the outside it looks like a fixed input-output filter, but inside it is running a model of the world and steering by what it thinks is happening rather than what it sees directly. This idea — internal models that the controller maintains and corrects against measurements — generalizes far beyond linear systems into modern adaptive control and reinforcement learning.</div>

<!-- ========================================================================
     SECTION 10
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">10. AI Connection — System Identification and Neural ODE</h2>

<div class="calc-highlight"><strong>State-space meets modern ML:</strong> If the matrices $(A, B, C, D)$ are unknown, we can <em>learn</em> them from data — a discipline called system identification. Replace the linear matrices with nonlinear function approximators and you get the neural ODE: a learned, continuous-time, nonlinear state-space model that powers many modern dynamical-system networks.</div>

<p class="l-text"><strong>Classical system identification.</strong> Given input-output data $\\{U(t_k), Y(t_k)\\}_{k=0}^{N}$ from an unknown linear plant, estimate $(A, B, C, D)$ such that the model best reproduces the data. Methods include subspace identification (N4SID, MOESP), prediction error methods, and innovation form ARMAX models. The output is a state-space realization fit to real data — useful when no first-principles model is available.</p>

<div class="calc-formula"><div class="formula-label">LINEAR SYSTEM ID OBJECTIVE</div><div class="formula-main">$$\\min_{A, B, C, D, X_0}\\, \\sum_{k=0}^{N} \\big\\| Y(t_k) - \\big[ C\\, e^{A t_k}\\, X_0 + \\textstyle\\int_0^{t_k} C\\, e^{A(t_k - \\tau)}\\, B\\, U(\\tau)\\, d\\tau + D\\, U(t_k) \\big] \\big\\|^2$$</div><div class="formula-sub">Fit the LTI model to observed inputs and outputs.</div></div>

<p class="l-text"><strong>Neural ODE.</strong> Chen et al. (2018) generalize this to a learned vector field. Replace $\\dot{X} = AX + BU$ with</p>

<div class="calc-formula"><div class="formula-label">NEURAL ORDINARY DIFFERENTIAL EQUATION</div><div class="formula-main">$$\\dot{X}(t) = f_\\theta(X(t), U(t), t)$$</div><div class="formula-sub">$f_\\theta$ is a neural network with parameters $\\theta$. The dynamics, no longer matrices, are an arbitrary differentiable function.</div></div>

<p class="l-text">Training fits $\\theta$ by backpropagation through the ODE solver — using either standard autodiff or the adjoint sensitivity method that avoids storing intermediate states. The result is a continuous-depth network whose hidden state evolves according to an ODE rather than a discrete stack of layers. It generalizes residual networks (which are forward-Euler discretizations of an ODE), it supports irregularly-sampled time series natively, and it lets you trade compute against accuracy by tightening the ODE solver tolerance.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Linear $\\to$ nonlinear</div><div class="card-body">$\\dot{X} = AX + BU$ becomes $\\dot{X} = f_\\theta(X, U)$. Linear-systems intuition (stability, controllability) generalizes locally via Jacobian linearization.</div></div>
<div class="calc-card"><div class="card-title">Latent ODE</div><div class="card-body">Combine an encoder, a neural ODE for hidden dynamics, and a decoder — a state-space VAE for time series. Used in healthcare and climate modeling.</div></div>
<div class="calc-card"><div class="card-title">State-space LLMs</div><div class="card-body">Mamba and S4 are discrete-time state-space models with learned $A, B, C$ that compete with transformers. The classical state-space machinery is back at the cutting edge of language modeling.</div></div>
<div class="calc-card"><div class="card-title">Control + RL</div><div class="card-body">Model-based reinforcement learning learns dynamics $f_\\theta$ from interaction, then uses MPC or LQR with the learned model. State-space is the bridge between classical control and modern RL.</div></div>
</div>

<div class="l-note"><strong>Pedagogically.</strong> Everything in this lesson — eigenvalue stability, controllability, observability, pole placement, observers — has a nonlinear or learned counterpart in modern ML. Reachability analysis for neural networks (verification), observability-based latent representations, Koopman operator theory (which lifts a nonlinear system to an infinite-dimensional linear one) — all of it lives or dies on the conceptual scaffolding you build in this lesson.</div>

<!-- ========================================================================
     SECTION 11 — Pyodide Lab
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">11. Pyodide Lab — State-Space Toolbox</h2>

<p class="l-text">This lab puts everything together. The first block builds a state-space model from $(A, B, C, D)$ using <code>scipy.signal.StateSpace</code>, simulates the step response, and checks controllability and observability ranks. The second block does pole placement with <code>scipy.signal.place_poles</code> on a small unstable plant and verifies that the closed-loop eigenvalues land exactly where requested.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · STATE-SPACE BASICS</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy <span class="kw">import</span> signal

<span class="cm"># --- Define the state-space model (A, B, C, D) ----------------------</span>
A = np.<span class="fn">array</span>([[<span class="num">0</span>, <span class="num">1</span>],
              [-<span class="num">2</span>, -<span class="num">3</span>]], dtype=<span class="fn">float</span>)
B = np.<span class="fn">array</span>([[<span class="num">0</span>],
              [<span class="num">1</span>]], dtype=<span class="fn">float</span>)
C = np.<span class="fn">array</span>([[<span class="num">2</span>, <span class="num">1</span>]], dtype=<span class="fn">float</span>)
D = np.<span class="fn">array</span>([[<span class="num">0</span>]], dtype=<span class="fn">float</span>)

sys = signal.<span class="fn">StateSpace</span>(A, B, C, D)
<span class="fn">print</span>(<span class="str">"State-space model:"</span>)
<span class="fn">print</span>(<span class="str">f"  A =\\n{A}"</span>)
<span class="fn">print</span>(<span class="str">f"  B =\\n{B}"</span>)
<span class="fn">print</span>(<span class="str">f"  C = {C}"</span>)
<span class="fn">print</span>(<span class="str">f"  D = {D}"</span>)

<span class="cm"># --- Eigenvalues = poles ---------------------------------------------</span>
evals = np.linalg.<span class="fn">eigvals</span>(A)
<span class="fn">print</span>(<span class="str">f"\\nEigenvalues of A (open-loop poles): {evals}"</span>)
<span class="fn">print</span>(<span class="str">f"All Re(lambda) &lt; 0? -&gt; {np.all(np.real(evals) &lt; 0)}"</span>)

<span class="cm"># --- Controllability matrix ------------------------------------------</span>
n = A.shape[<span class="num">0</span>]
ctrb = np.<span class="fn">hstack</span>([np.linalg.<span class="fn">matrix_power</span>(A, k) @ B <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(n)])
<span class="fn">print</span>(<span class="str">f"\\nControllability matrix:\\n{ctrb}"</span>)
<span class="fn">print</span>(<span class="str">f"  rank = {np.linalg.matrix_rank(ctrb)} (need {n} for full controllability)"</span>)

<span class="cm"># --- Observability matrix --------------------------------------------</span>
obsv = np.<span class="fn">vstack</span>([C @ np.linalg.<span class="fn">matrix_power</span>(A, k) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(n)])
<span class="fn">print</span>(<span class="str">f"\\nObservability matrix:\\n{obsv}"</span>)
<span class="fn">print</span>(<span class="str">f"  rank = {np.linalg.matrix_rank(obsv)} (need {n} for full observability)"</span>)

<span class="cm"># --- Step response ---------------------------------------------------</span>
t_step, y_step = signal.<span class="fn">step</span>(sys, T=np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">6</span>, <span class="num">300</span>))
<span class="fn">print</span>(<span class="str">f"\\nStep response: y(0) = {y_step[0]:.4f}, y(end) = {y_step[-1]:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"  Steady-state from -C A^-1 B + D = {(-C @ np.linalg.inv(A) @ B + D)[0,0]:.4f}"</span>)
<span class="fn">print</span>(<span class="str">"  (match within numerical tolerance)"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON · POLE PLACEMENT WITH place_poles</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy <span class="kw">import</span> signal

<span class="cm"># --- Unstable plant in controllable canonical form ------------------</span>
A = np.<span class="fn">array</span>([[<span class="num">0</span>, <span class="num">1</span>],
              [<span class="num">2</span>, <span class="num">1</span>]], dtype=<span class="fn">float</span>)   <span class="cm"># open-loop poles around +2.0 and -1.0</span>
B = np.<span class="fn">array</span>([[<span class="num">0</span>],
              [<span class="num">1</span>]], dtype=<span class="fn">float</span>)

open_poles = np.linalg.<span class="fn">eigvals</span>(A)
<span class="fn">print</span>(<span class="str">f"Open-loop poles: {open_poles}"</span>)
<span class="fn">print</span>(<span class="str">f"  Stable? {np.all(np.real(open_poles) &lt; 0)}"</span>)   <span class="cm"># False — unstable</span>

<span class="cm"># --- Desired closed-loop poles ---------------------------------------</span>
desired = np.<span class="fn">array</span>([-<span class="num">4</span>, -<span class="num">5</span>])

<span class="cm"># --- Solve for K -----------------------------------------------------</span>
res = signal.<span class="fn">place_poles</span>(A, B, desired)
K = res.gain_matrix
<span class="fn">print</span>(<span class="str">f"\\nState-feedback gain K = {K}"</span>)

<span class="cm"># --- Verify closed-loop poles ----------------------------------------</span>
A_cl = A - B @ K
closed_poles = np.linalg.<span class="fn">eigvals</span>(A_cl)
<span class="fn">print</span>(<span class="str">f"Closed-loop poles: {closed_poles}"</span>)
<span class="fn">print</span>(<span class="str">f"  Match desired {desired}? -&gt; {np.allclose(np.sort(np.real(closed_poles)), np.sort(desired))}"</span>)

<span class="cm"># --- Compare open-loop and closed-loop step responses ---------------</span>
C = np.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">0</span>]], dtype=<span class="fn">float</span>)
D = np.<span class="fn">array</span>([[<span class="num">0</span>]], dtype=<span class="fn">float</span>)
sys_open  = signal.<span class="fn">StateSpace</span>(A,    B, C, D)
sys_closed= signal.<span class="fn">StateSpace</span>(A_cl, B, C, D)

T = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">3</span>, <span class="num">200</span>)
_, y_open   = signal.<span class="fn">step</span>(sys_open,   T=T)
_, y_closed = signal.<span class="fn">step</span>(sys_closed, T=T)
<span class="fn">print</span>(<span class="str">f"\\nOpen-loop max |y| over [0,3]:   {np.max(np.abs(y_open)):.2e}   (blows up)"</span>)
<span class="fn">print</span>(<span class="str">f"Closed-loop max |y| over [0,3]: {np.max(np.abs(y_closed)):.4f}   (bounded, settles)"</span>)

<span class="cm"># --- Observer pole placement (dual problem) --------------------------</span>
C_obs = np.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">0</span>]], dtype=<span class="fn">float</span>)
obs_desired = np.<span class="fn">array</span>([-<span class="num">8</span>, -<span class="num">10</span>])             <span class="cm"># observer faster than controller</span>
res_obs = signal.<span class="fn">place_poles</span>(A.T, C_obs.T, obs_desired)
L = res_obs.gain_matrix.T
<span class="fn">print</span>(<span class="str">f"\\nObserver gain L = {L.flatten()}"</span>)
<span class="fn">print</span>(<span class="str">f"Eigenvalues of (A - L C): {np.linalg.eigvals(A - L @ C_obs)}"</span>)
<span class="fn">print</span>(<span class="str">"Composite controller-observer poles (separation principle):"</span>)
<span class="fn">print</span>(<span class="str">f"  controller: {closed_poles}"</span>)
<span class="fn">print</span>(<span class="str">f"  observer:   {np.linalg.eigvals(A - L @ C_obs)}"</span>)
<span class="fn">print</span>(<span class="str">"  -&gt; the closed-loop system has all 4 poles, equal to the union."</span>)</code></pre></div>

<div id="plot-l5-phase-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=200;var Tf=4;var dt=Tf/n;
var inits=[[1,0.5],[-1,0.8],[1.2,-1.0],[-0.8,-0.5],[0.5,-1.2]];
var data=[];
var cols=["#3b82f6","#a78bfa","#22c55e","#f87171","#fbbf24"];
for(var k=0;k<inits.length;k++){
  var s=inits[k].slice();var xs=[];var ys=[];
  for(var i=0;i<n;i++){xs.push(s[0]);ys.push(s[1]);
    var d=[s[1],-2*s[0]-3*s[1]];
    s[0]+=d[0]*dt;s[1]+=d[1]*dt;}
  data.push({x:xs,y:ys,mode:"lines",name:"start ("+inits[k][0]+","+inits[k][1]+")",line:{color:cols[k],width:2}});
}
data.push({x:[0],y:[0],mode:"markers",name:"equilibrium",marker:{color:"#ebe6dc",size:11,symbol:"x",line:{width:2}}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_1 = position",range:[-1.5,1.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_2 = velocity",range:[-1.5,1.5],scaleanchor:"x"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l5-phase-en",data,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows.</strong> Phase-plane trajectories of $\\dot{X} = AX$ for the second-order example used in the Pyodide lab. Five different initial conditions all spiral or curve into the origin — a stable node, since both eigenvalues of $A$ are real and negative ($-1$ and $-2$). The state-space picture in the plane makes the eigenvalue story geometric.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT THIS</div><div class="think-body">In the inverted pendulum example, the open-loop instability has growth rate $\\sqrt{g(M+m)/(M\\ell)}$, which depends on the gravitational acceleration and the pendulum length but not on how fast you sample your sensors. Yet practical digital controllers must run at a sample rate fast enough to catch this exponential growth — otherwise the discrete control update arrives too late. What sample rate would you need to keep a $\\ell = 0.5$ m pendulum stable with at least 10 control updates per growth time-constant? Try plugging numbers in the simulation and find when discretization starts to fight the controller.</div></div>

<p class="l-text">Lesson 6 takes the state-space framework one step further by asking: of all the gain matrices $K$ that stabilize a given plant, which one minimizes a quadratic cost on state error and control effort? That is the LQR problem, and its solution is the most influential modern controller design ever published.</p>
`,

/* ============================================================================
   TURKISH VERSION
   ============================================================================ */
tr: `
<p class="l-text"><strong>Klasik kontrol frekans alanında yaşar.</strong> Bir transfer fonksiyonu $H(s)$ yazarsın, Bode grafiği çizersin, kök-yer-eğrisi üzerinde kutuplar yerleştirirsin ve tek bir girişin tek bir çıkışı nasıl sürdüğünü düşünürsün. Güzel bir teoridir ve sayısız tek-döngülü endüstriyel problem için işe yarar. Ama gerçek her sistemin iç durumları vardır — bobinlerdeki akımlar, eklem açıları, kondansatörlerdeki yükler, membran üzerindeki gerilimler — ve giriş-çıkış resmi bunları agresif şekilde gizler. Tesisinizde birden fazla giriş, birden fazla çıkış veya temiz şekilde lineerleştirmek istediğiniz bir doğrusal olmayanlık olduğu anda, transfer fonksiyonu çatırdamaya başlar.</p>

<p class="l-text">Durum-uzayı formülasyonu modern alternatiftir. Sistemi çıkışın girişe nasıl tepki verdiğiyle değil, tam iç durum $X(t) \\in \\mathbb{R}^n$ ve bir çift matris denklemi ile tanımlarsın. Birinci denklem durumun nasıl evrildiğini söyler; ikinci denklem çıkışı durumdan nasıl okuyacağını söyler. Lineer cebir devreye girer ve aniden kararlılık için, yönlendirme için, mevcut ölçümlerden gizli durumu okumak için ve istediğiniz her kapalı-döngü kutbu istediğiniz yere yerleştiren kontrolörler tasarlamak için tek bir dile sahip olursunuz. Modern havacılık otopilotlarını, robotik manipülatörleri, elektrikli araç güç aktarma organlarını ve — sonunda göreceğimiz gibi — makine öğreniminde sinirsel ODE modellerini yöneten resim budur.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Herhangi bir transfer fonksiyonu $H(s)$'i bir durum-uzayı gerçeklemesi $(A, B, C, D)$'ye ve geri dönüştürme</li>
<li>Durum denklemi $\\dot{X} = AX + BU$ ve çıkış denklemi $Y = CX + DU$'yu tek bir matris sistemi olarak okuma</li>
<li>$A$'nın özdeğerlerini kararlılık karar vermek ve matris üsteli $e^{At}$ ile doğal modları okumak için kullanma</li>
<li>Kontrol edilebilirliği $[B\\;\\, AB\\;\\, A^2 B\\;\\, \\cdots]$ ile, gözlenebilirliği $[C;\\;CA;\\;CA^2;\\;\\cdots]$ ile test etme</li>
<li>Kapalı-döngü kutuplarını herhangi bir yere yerleştirmek için durum-geri besleme kazancı $K$ tasarlama (kutup yerleştirme, Ackermann formülü)</li>
<li>Gizli durumu çıkıştan yeniden kurmak için Luenberger gözlemcisi inşa etme ve ayrım ilkesini uygulama</li>
</ul>
</div>

<!-- ========================================================================
     BÖLÜM 1
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">1. Transfer Fonksiyonundan Durum Uzayına</h2>

<div class="calc-highlight"><strong>Klasikten moderne köprü:</strong> Her lineer zamandan-bağımsız transfer fonksiyonu, bir birinci-mertebe matris ODE'si olarak yeniden yazılabilir. Dönüşüm mekaniktir; karşılığında transfer fonksiyonunun gizlediği tüm iç değişkenleri görürsünüz.</div>

<p class="l-text">Standart rasyonel formdaki bir transfer fonksiyonu ile başla, pay derecesi en çok payda derecesine eşit olsun:</p>

<div class="calc-formula"><div class="formula-label">L3'TEN TRANSFER FONKSİYONU</div><div class="formula-main">$$H(s) = \\frac{Y(s)}{U(s)} = \\frac{b_{n-1} s^{n-1} + \\cdots + b_1 s + b_0}{s^n + a_{n-1} s^{n-1} + \\cdots + a_1 s + a_0}$$</div><div class="formula-sub">$n$ sistemin mertebesidir. Burada kesin uygun olduğunu varsayıyoruz, böylece $D = 0$; uygun durum bir doğrudan-geçiş terimi ekler.</div></div>

<p class="l-text">Hile tam olarak diferansiyel denklemler izindeki L3'ten gelen hiledir: $n$ yardımcı değişken tanıt ve tek $n$. mertebeden ODE'yi $n$ tane eşlenik birinci-mertebe ODE'ye çevir. Durum vektörü girdilerini çıkış ve onun ilk $n-1$ türevi olarak tanımla. O zaman $\\dot{x}_1 = x_2$, $\\dot{x}_2 = x_3$ ve böylece devam eder, son türev orijinal ODE aracılığıyla girişe bağlanır. Bu, <strong>kontrol edilebilir kanonik formu</strong> üretir:</p>

<div class="calc-formula"><div class="formula-label">KONTROL EDİLEBİLİR KANONİK FORM</div><div class="formula-main">$$A = \\begin{bmatrix} 0 & 1 & 0 & \\cdots & 0 \\\\ 0 & 0 & 1 & \\cdots & 0 \\\\ \\vdots & & & \\ddots & \\vdots \\\\ 0 & 0 & 0 & \\cdots & 1 \\\\ -a_0 & -a_1 & -a_2 & \\cdots & -a_{n-1} \\end{bmatrix}, \\quad B = \\begin{bmatrix} 0 \\\\ 0 \\\\ \\vdots \\\\ 0 \\\\ 1 \\end{bmatrix}, \\quad C = \\begin{bmatrix} b_0 & b_1 & \\cdots & b_{n-1} \\end{bmatrix}, \\quad D = 0$$</div><div class="formula-sub">Matris $A$, diffeq izinin L3'ündeki aynı yoldaş matristir. Karakteristik polinomu $H(s)$'in paydasıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$A$ — dinamik</div><div class="card-body">Payda katsayıları alt satırda yaşar. $A$'nın özdeğerleri tam olarak $H(s)$'in kutuplarıdır.</div></div>
<div class="calc-card"><div class="card-title">$B$ — giriş haritası</div><div class="card-body">Skaler girişin $u$ duruma nasıl girdiğini söyler. Bu formda yalnızca son durum koordinatı doğrudan sürülür.</div></div>
<div class="calc-card"><div class="card-title">$C$ — çıkış haritası</div><div class="card-body">Pay katsayıları burada yaşar. İç durumları skaler çıkış $y$'ye karıştırırlar.</div></div>
<div class="calc-card"><div class="card-title">$D$ — doğrudan geçiş</div><div class="card-body">Yalnızca $\\deg(\\text{pay}) = \\deg(\\text{payda})$ olduğunda mevcut, girişten çıkışa doğrudan yol. Kesin uygun durumda sıfır.</div></div>
</div>

<div class="calc-example"><div class="example-label">SOMUT DÖNÜŞÜM</div><div class="example-body">$H(s) = \\dfrac{s + 2}{s^2 + 3s + 2}$ olsun. Belirle: $a_0 = 2$, $a_1 = 3$, $b_0 = 2$, $b_1 = 1$. Durum-uzayı gerçeklemesi:<br><br>$A = \\begin{bmatrix} 0 & 1 \\\\ -2 & -3 \\end{bmatrix}$, $\\quad B = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$, $\\quad C = \\begin{bmatrix} 2 & 1 \\end{bmatrix}$, $\\quad D = 0$.<br><br>Kontrol et: $\\det(sI - A) = s(s+3) + 2 = s^2 + 3s + 2$, payda ile eşleşir. Özdeğerler $s = -1, -2$ — kutuplar.</div></div>

<p class="l-text"><strong>Gerçeklemeler tek değildir.</strong> Verilen bir $H(s)$ için sonsuz sayıda durum-uzayı gerçeklemesi $(A, B, C, D)$ vardır. Herhangi bir tersine çevrilebilir durum değişikliği $\\tilde{X} = T X$, aynı transfer fonksiyonuna sahip yeni bir gerçekleme $(\\tilde{A}, \\tilde{B}, \\tilde{C}, \\tilde{D}) = (T A T^{-1}, T B, C T^{-1}, D)$ üretir. Transfer fonksiyonu yalnızca giriş-çıkış davranışını yakalar; durum-uzayı gerçeklemesi ek olarak iç koordinatların belirli bir seçimini kaydeder. Bu özgürlük bir özelliktir: analizi basitleştiren koordinatlar (modal form, $A$ köşegen) veya kontrolü basitleştiren (yukarıdaki kontrol edilebilir form) veya tahmini basitleştiren (gözlenebilir kanonik form) seçebilirsiniz.</p>

<div class="l-note"><strong>Zaten $H(s)$'iniz varken neden durumla uğraşalım?</strong> Üç neden. Birincisi, $H(s)$ yapı gereği tek-giriş tek-çıkıştır, oysa durum-uzayı $u \\in \\mathbb{R}^m$ ve $y \\in \\mathbb{R}^p$ ile MIMO sistemleri tek tip ele alır. İkincisi, iç kararlılık ve BIBO kararlılığı kararsız kutup-sıfır iptalleri varsa anlaşmazlığa düşebilir — durum-uzayı iptal edilen modu görür, transfer fonksiyonu görmez. Üçüncüsü, 1960'tan sonra gelen tasarım araçları (LQR, Kalman filtreleme, $H_\\infty$ sentezi, MPC) durum-uzayında doğal olarak formüle edilir.</div>

<!-- ========================================================================
     BÖLÜM 2
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">2. Durum-Uzayı Denklemleri</h2>

<div class="calc-highlight"><strong>İki denklem:</strong> Sonlu boyutlu, sürekli zamanlı, lineer zamandan-bağımsız bir sistem tamamen bir durum denklemi ve bir çıkış denklemi ile tanımlanır. Durum vektörü $X(t) \\in \\mathbb{R}^n$, gelecek girişi verildiğinde geleceği öngörmek için gereken geçmiş tarihçenin minimal özetidir.</div>

<p class="l-text">Durum-uzayı denklemlerini tam haliyle yaz:</p>

<div class="calc-formula"><div class="formula-label">LTI DURUM-UZAYI MODELİ</div><div class="formula-main">$$\\dot{X}(t) = A\\, X(t) + B\\, U(t), \\qquad Y(t) = C\\, X(t) + D\\, U(t)$$</div><div class="formula-sub">$X \\in \\mathbb{R}^n$ durum, $U \\in \\mathbb{R}^m$ giriş, $Y \\in \\mathbb{R}^p$ çıkış. Matrisler: $A \\in \\mathbb{R}^{n \\times n}$, $B \\in \\mathbb{R}^{n \\times m}$, $C \\in \\mathbb{R}^{p \\times n}$, $D \\in \\mathbb{R}^{p \\times m}$.</div></div>

<p class="l-text">Birinci denklem, $\\dot{X} = AX + BU$, <strong>durum denklemidir</strong>. $t$ anındaki durumun hızının, mevcut durumun lineer bir fonksiyonu artı girişten gelen lineer bir itme olduğunu söyler. İkinci denklem, $Y = CX + DU$, <strong>çıkış denklemidir</strong>. Ölçülen çıkışın, mevcut durumun bir lineer kombinasyonu artı girişin doğrudan-geçişi olduğunu söyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durum $X(t)$</div><div class="card-body">$U[t, \\tau]$ verildiğinde $\\tau > t$ için $X(\\tau)$'yi öngörmek için $t$'de gereken minimal bilgi. Daha fazlası fazladır; daha azı yetersizdir.</div></div>
<div class="calc-card"><div class="card-title">Giriş $U(t)$</div><div class="card-body">Seçtiğiniz sinyaller: motor gerilimleri, valf açıklıkları, gaz pedalı. Kontrol problemi $U$'yu durum istendiği gibi davranacak şekilde seçmektir.</div></div>
<div class="calc-card"><div class="card-title">Çıkış $Y(t)$</div><div class="card-body">Ölçtüğünüz sinyaller: enkoder darbeleri, ADC okumaları, ivmeölçer çıkışları. Genellikle $p < n$, yani her durum doğrudan görünmez.</div></div>
<div class="calc-card"><div class="card-title">Zamandan-bağımsız</div><div class="card-body">Dört matris de sabittir. Zamana bağlı $(A(t), B(t), C(t), D(t))$ daha zordur; doğrusal olmayan $\\dot{X} = f(X, U)$ daha da zordur ama lineerleştirme bizi buraya geri getirir.</div></div>
</div>

<p class="l-text">Durum $X$, <em>gelecek için anlamlı olan tüm geçmiş tarihçeyi</em> özetler. $X(t_0)$'ı tam olarak ve $\\tau > t_0$ için girişi $U(\\tau)$ biliyorsanız, her gelecek zaman için $X(t)$ ve $Y(t)$'yi hesaplayabilirsiniz. $t_0$'dan önceki girişlerin belleğine ihtiyacınız yoktur. Bu Markov-benzeri özellik, bir durumun tanımlayıcı özelliğidir.</p>

<div class="calc-example"><div class="example-label">DC MOTOR DURUMU</div><div class="example-body">Atalet yükü süren bir DC motorun üç doğal durum değişkeni vardır: armatür akımı $i$, açısal hız $\\omega$ ve açısal konum $\\theta$. Giriş, uygulanan armatür gerilimi $v$'dir. Ölçtüğünüz çıkış sensöre bağlıdır — enkoder $\\theta$ verir, takometre $\\omega$ verir, akım sensörü $i$ verir. Durum denklemi mekanik tarafta Newton yasasını, elektriksel tarafta Kirchhoff gerilim yasasını yakalar, geri-EMF ve tork sabitleri aracılığıyla eşlenir.</div></div>

<div class="l-note"><strong>Durumu seçme.</strong> Elektriksel veya mekanik bir sistem için doğal durumlar <em>enerji depolama değişkenleridir</em>: kondansatör gerilimleri, indüktör akımları, kütlelerin hızları, yayların sıkışması. Durumun boyutu bağımsız enerji depolama elemanlarının sayısına eşittir. Bu fiziksel prensip, tek bir denklem yazmadan önce mertebe $n$'i size verir.</div>

<!-- ========================================================================
     BÖLÜM 3
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">3. $\\dot{X} = AX$ Çözümü — Matris Üsteli</h2>

<div class="calc-highlight"><strong>Skaler çözüm aynen genelleşir:</strong> Skaler ODE $\\dot{x} = ax$'in çözümü $x(t) = e^{at} x_0$'dır. Vektör ODE $\\dot{X} = AX$'in çözümü $X(t) = e^{At} X_0$'dır, burada $e^{At}$ matris üstelidir. Sürülmeyen sistemin her uzun-vadeli özelliği $e^{At}$'de kodlanmıştır.</div>

<p class="l-text">Matris üstelini, skaler olanla aynı biçimde, kuvvet serisi ile tanımla:</p>

<div class="calc-formula"><div class="formula-label">MATRİS ÜSTELİ</div><div class="formula-main">$$e^{At} = I + At + \\frac{1}{2!} (At)^2 + \\frac{1}{3!} (At)^3 + \\cdots = \\sum_{k=0}^{\\infty} \\frac{(At)^k}{k!}$$</div><div class="formula-sub">Seri her kare matris $A$ ve her reel $t$ için yakınsar.</div></div>

<p class="l-text">$X(0) = X_0$ ile özerk (girişsiz) sistem $\\dot{X} = AX$ için tek çözüm</p>

<div class="calc-formula"><div class="formula-label">SÜRÜLMEYEN TEPKİ</div><div class="formula-main">$$X(t) = e^{At} X_0$$</div><div class="formula-sub">Giriş uygulanmıyor. Durum yalnızca kendi iç dinamikleri altında evrilir.</div></div>

<p class="l-text">$X(0) = X_0$ ile tam sürülen sistem $\\dot{X} = AX + BU$ için çözüm, sürülmeyen tepkinin ve girişin konvolüsyon-tipi bir integralinin toplamıdır:</p>

<div class="calc-formula"><div class="formula-label">TAM DURUM-UZAYI ÇÖZÜMÜ (SABİTLERİN DEĞİŞİMİ)</div><div class="formula-main">$$X(t) = e^{At} X_0 + \\int_0^t e^{A(t - \\tau)} B\\, U(\\tau)\\, d\\tau$$</div><div class="formula-sub">İlk terim sıfır-giriş tepkisidir. İkinci terim sıfır-durum tepkisidir — dürtü tepkisi $e^{At} B$ ile girişin konvolüsyonu.</div></div>

<p class="l-text"><strong>Özdeğerlerle bağlantı.</strong> $A = P \\Lambda P^{-1}$ olarak köşegenleştir, burada $\\Lambda = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$ ve $P$ özvektörleri tutar. O zaman kuvvet serisinden güzel bir özdeşlik çıkar:</p>

<div class="calc-formula"><div class="formula-label">$e^{At}$ ÖZAYRIŞIMI</div><div class="formula-main">$$e^{At} = P\\, e^{\\Lambda t}\\, P^{-1} = P\\, \\text{diag}(e^{\\lambda_1 t}, \\ldots, e^{\\lambda_n t})\\, P^{-1}$$</div><div class="formula-sub">Matris üsteli, her özdeğer için bir tane saf üstel modun toplamıdır, özvektörler tarafından karıştırılır.</div></div>

<p class="l-text">Her özdeğer $\\lambda_i$, özvektör $v_i$ boyunca $e^{\\lambda_i t}$ oranında bozunan veya büyüyen doğal bir modu tanımlar. Karmaşık çift $\\lambda = \\alpha \\pm i \\beta$, $\\alpha$'nın işaretine bağlı olarak bozunan veya büyüyen $e^{\\alpha t} \\cos(\\beta t)$ ve $e^{\\alpha t} \\sin(\\beta t)$ salınımlı bir mod üretir. Tam sürülmeyen tepki, başlangıç koşulunun özbazda nasıl ayrıştığına göre ağırlıklandırılmış bu modların üst-üste binmesidir. Bu, diferansiyel denklemler izinin L3'ünde zaten karşılaştığımız yapıdır; durum-uzayı bunun üzerine giriş ve çıkış denklemlerini ekler.</p>

<div id="plot-l5-modes-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=400;var ts=[];for(var i=0;i<n;i++)ts.push(i*5/(n-1));
function mode(lam){var ys=[];for(var i=0;i<n;i++)ys.push(Math.exp(lam*ts[i]));return ys;}
function osc(a,b){var ys=[];for(var i=0;i<n;i++)ys.push(Math.exp(a*ts[i])*Math.cos(b*ts[i]));return ys;}
var t1={x:ts,y:mode(-1.5),mode:"lines",name:"lambda = -1.5 (hızlı bozunma)",line:{color:"#3b82f6",width:2.5}};
var t2={x:ts,y:mode(-0.4),mode:"lines",name:"lambda = -0.4 (yavaş bozunma)",line:{color:"#a78bfa",width:2.5}};
var t3={x:ts,y:osc(-0.3,3),mode:"lines",name:"lambda = -0.3 +/- 3i (sönümlü salınım)",line:{color:"#22c55e",width:2.5}};
var t4={x:ts,y:mode(0.3),mode:"lines",name:"lambda = +0.3 (kararsız büyüme)",line:{color:"#f87171",width:2.5,dash:"dash"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"zaman t (s)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"mod genliği",range:[-1.5,4.5]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l5-modes-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Sürülmeyen tepkiye $e^{At} X_0$ katkı veren dört doğal mod. Reel negatif özdeğerler farklı oranlarda monoton bozunmalar üretir; negatif reel kısımlı karmaşık özdeğerler sönümlü salınımlar üretir; reel pozitif bir özdeğer sınırsız üstel büyüme üretir. Herhangi bir LTI sisteminin tam tepkisi, $A$'nın her özdeğeri için bir tane olmak üzere böyle modların ağırlıklı toplamıdır.</div></div>

<!-- ========================================================================
     BÖLÜM 4
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">4. Özdeğerler ile Kararlılık</h2>

<div class="calc-highlight"><strong>Kontroldeki en temiz kararlılık teoremi:</strong> Özerk sistem $\\dot{X} = AX$ asimptotik kararlıdır ancak ve ancak $A$'nın her özdeğeri kesin negatif reel kısma sahiptir. Özdeğerlerin karmaşık düzlemde nerede oturduğuna bakarak kararlılığı oku.</div>

<p class="l-text">Bölüm 3'ten, sürülmeyen çözüm $X(t) = e^{At} X_0 = P \\, \\text{diag}(e^{\\lambda_i t}) \\, P^{-1} X_0$'dır. $X(t) \\to 0$ olup olmadığı yalnızca her $e^{\\lambda_i t} \\to 0$ olup olmadığına bağlıdır. Reel özdeğerler için bu $\\lambda_i < 0$ gerektirir. Karmaşık çift $\\lambda = \\alpha \\pm i \\beta$ için, $e^{\\lambda t}$'nin büyüklüğü $e^{\\alpha t}$'dir, bu yüzden $\\alpha < 0$ gerekir. Her iki durumda da koşul aynıdır: <strong>reel kısım negatiftir</strong>.</p>

<div class="calc-formula"><div class="formula-label">KARARLILIK ÖLÇÜTÜ</div><div class="formula-main">$$\\dot{X} = AX \\text{ asimptotik kararlı} \\iff \\text{Re}(\\lambda_i) < 0 \\text{ her özdeğer } \\lambda_i \\text{ için}$$</div><div class="formula-sub">Eşdeğer olarak: her özdeğer karmaşık düzlemin açık sol yarısında yer alır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kararlı bölge</div><div class="card-body">Kesin sol yarı-düzlem $\\text{Re}(\\lambda) < 0$. Yörüngeler herhangi bir başlangıç koşulundan kökene bozunur.</div></div>
<div class="calc-card"><div class="card-title">Kararsız bölge</div><div class="card-body">$\\text{Re}(\\lambda) > 0$ olan herhangi bir özdeğer. Bazı yörüngeler üstel olarak patlar.</div></div>
<div class="calc-card"><div class="card-title">Marjinal durumlar</div><div class="card-body">İmajiner eksendeki özdeğerler. Farklı: yörüngeler sınırlı kalır (Lyapunov kararlı). Tekrarlı defektif: polinom büyüme, kararsız.</div></div>
<div class="calc-card"><div class="card-title">Kutup = özdeğer</div><div class="card-body">$H(s)$'in $(A,B,C,D)$ gerçeklemesi için, $A$'nın özdeğerleri $H(s)$'in kutuplarını içerir. Aynı kararlılık testi.</div></div>
</div>

<p class="l-text">Bu, bu iz'nin L3 ve L4'ünden zaten bildiğimiz kuralın modern yeniden ifadesidir: sol yarı-düzlemdeki kutuplar kararlı sistem demektir; sağ yarı-düzlemdeki kutuplar kararsızlık demektir. Durum-uzayı versiyonu daha güçlüdür çünkü $A$'nın özdeğerleri transfer fonksiyonunda iptal edilmiş olabilecek <em>iç</em> modları yakalar. Sağ yarı-düzlem özdeğeri, modu $H(s)$'de görünmese bile tehlikelidir — iç kararsızlık hâlâ kontrol edilemez durum, muhtemelen aktüatör doyumu veya tesisi bozma anlamına gelir.</p>

<div class="calc-example"><div class="example-label">HIZLI KARARLILIK KONTROLÜ</div><div class="example-body">$A = \\begin{bmatrix} -1 & 2 \\\\ -3 & -4 \\end{bmatrix}$. Karakteristik polinom $\\det(sI - A) = (s+1)(s+4) + 6 = s^2 + 5s + 10$. Kökler $s = -2.5 \\pm 1.94 i$. Reel kısım $-2.5 < 0$, yani <strong>kararlı</strong>. Yörüngeler kökene doğru spiral yapar.</div></div>

<div class="l-note"><strong>Lyapunov yeniden ifadesi.</strong> Özdeğerleri tamamen es geçen eşdeğer bir karakterizasyon: $A$ Hurwitz'dir (tüm özdeğerler açık sol yarı-düzlemde) ancak ve ancak bir pozitif tanımlı $Q > 0$ için $A^T P + P A = -Q$'yu çözen bir pozitif tanımlı matris $P > 0$ vardır. Bu <em>Lyapunov denklemi</em> bir lineer matris denklemidir ve çözülebilirliği, yüksek boyuta güzelce ölçeklenen ve L8'in iş atı olan kararlılık için sayısal bir testtir.</div>

<!-- ========================================================================
     BÖLÜM 5
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">5. Kontrol Edilebilirlik — Durumu Yönlendirebilir miyiz?</h2>

<div class="calc-highlight"><strong>Birinci büyük modern soru:</strong> Sistem $\\dot{X} = AX + BU$ ve herhangi bir hedef durum $X_f$ verildiğinde, sonlu bir $[0, T]$ aralığında durumu $X(0) = 0$'dan $X(T) = X_f$'ye sürebilecek bir giriş $U(t)$ var mıdır? Her $X_f$ için evet ise sistem <em>kontrol edilebilirdir</em>.</div>

<p class="l-text">Kontrol edilebilirlik kararlılıkla ilgili değildir ve iyi veya kötü performansla ilgili değildir. $(A, B)$ çiftinin ikili bir yapısal özelliğidir. Ya durum uzayının her yönü girişten erişilebilirdir ya da değildir. Test, sonlu boyutlu bir matris üzerinde temiz bir rank koşuludur.</p>

<div class="calc-formula"><div class="formula-label">KONTROL EDİLEBİLİRLİK MATRİSİ</div><div class="formula-main">$$\\mathcal{C} = \\begin{bmatrix} B & AB & A^2 B & \\cdots & A^{n-1} B \\end{bmatrix} \\in \\mathbb{R}^{n \\times n m}$$</div><div class="formula-sub">$B$'yi ve onun iterasyonları $AB, A^2 B, \\ldots, A^{n-1} B$'yi blok sütun olarak yığ.</div></div>

<div class="calc-formula"><div class="formula-label">KALMAN KONTROL EDİLEBİLİRLİK TEOREMİ</div><div class="formula-main">$$(A, B) \\text{ kontrol edilebilir} \\iff \\text{rank}(\\mathcal{C}) = n$$</div><div class="formula-sub">Tam satır rankı — kontrol edilebilirlik matrisi tüm $n$-boyutlu durum uzayını gerer.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Erişilebilir altuzay</div><div class="card-body">$\\mathcal{C}$'nin görüntü uzayı, herhangi bir giriş ile kökenden erişilebilen durumlar kümesidir. Tam rank $\\iff$ her durum erişilebilir.</div></div>
<div class="calc-card"><div class="card-title">Neden $n-1$ kuvvet</div><div class="card-body">Cayley-Hamilton ile, $A^n$, $I, A, \\ldots, A^{n-1}$'in lineer kombinasyonudur, böylece daha yüksek kuvvetler sütun gerimine bir şey eklemez.</div></div>
<div class="calc-card"><div class="card-title">Kontrol edilemez mod</div><div class="card-body">Rank eksikliği, $A$'nın en az bir özdeğer $\\lambda$'sını ortaya çıkarır, onun sol özvektörü $w$ $w^T B = 0$'ı sağlar. $w$ yönündeki moda dokunulamaz.</div></div>
<div class="calc-card"><div class="card-title">SISO basitleştirme</div><div class="card-body">Tek giriş için ($m=1$), $\\mathcal{C}$ kare $n \\times n$'dir ve test $\\det(\\mathcal{C}) \\neq 0$'a indirgenir.</div></div>
</div>

<div class="calc-example"><div class="example-label">KONTROL EDİLEBİLİR ÖRNEK</div><div class="example-body">$A = \\begin{bmatrix} 0 & 1 \\\\ -2 & -3 \\end{bmatrix}$, $B = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$ (Bölüm 1'deki kontrol edilebilir kanonik form). O zaman $AB = \\begin{bmatrix} 1 \\\\ -3 \\end{bmatrix}$ ve $\\mathcal{C} = \\begin{bmatrix} 0 & 1 \\\\ 1 & -3 \\end{bmatrix}$. Determinant $= -1 \\neq 0$. Tam rank. <strong>Kontrol edilebilir.</strong> Şaşırtıcı değil — kontrol edilebilir kanonik form daima kontrol edilebilirdir, ismini bundan alır.</div></div>

<div class="calc-example"><div class="example-label">KONTROL EDİLEMEZ ÖRNEK</div><div class="example-body">$A = \\begin{bmatrix} -1 & 0 \\\\ 0 & -2 \\end{bmatrix}$, $B = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$. Köşegen form iki modu ayırıyor; $B$ yalnızca birinciye dokunuyor. O zaman $AB = \\begin{bmatrix} -1 \\\\ 0 \\end{bmatrix}$ ve $\\mathcal{C} = \\begin{bmatrix} 1 & -1 \\\\ 0 & 0 \\end{bmatrix}$ rank 1'e sahiptir. <strong>Kontrol edilemez.</strong> İkinci durum koordinatı $u$'dan bağımsız olarak $\\dot{x}_2 = -2 x_2$ ile evrilir — onu değiştiremeyiz.</div></div>

<div id="plot-l5-ctrb-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=300;var ts=[];for(var i=0;i<n;i++)ts.push(i*5/(n-1));
var x1A=[];var x2A=[];var x1B=[];var x2B=[];
var s1=[0,1];var s2=[1,0];var dt=5/(n-1);
for(var i=0;i<n;i++){
  x1A.push(s1[0]);x2A.push(s1[1]);
  x1B.push(s2[0]);x2B.push(s2[1]);
  var u=Math.sin(2*ts[i]);
  var d1=[s1[1],-2*s1[0]-3*s1[1]+u];
  s1[0]+=d1[0]*dt;s1[1]+=d1[1]*dt;
  var d2=[-s2[0]+u,-2*s2[1]];
  s2[0]+=d2[0]*dt;s2[1]+=d2[1]*dt;
}
var t1={x:ts,y:x2B,mode:"lines",name:"x_2 — kontrol edilemez (girişi yok sayar)",line:{color:"#f87171",width:2.5}};
var t2={x:ts,y:x1B,mode:"lines",name:"x_1 — kontrol edilebilir (giriş etki eder)",line:{color:"#3b82f6",width:2.5}};
var t3={x:ts,y:x1A,mode:"lines",name:"kontrol edilebilir form x_1",line:{color:"#a78bfa",width:1.6,dash:"dot"}};
var t4={x:ts,y:x2A,mode:"lines",name:"kontrol edilebilir form x_2",line:{color:"#22c55e",width:1.6,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"zaman t (s)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"durum değeri"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.12,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l5-ctrb-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Aynı sinüsoidal giriş $u(t) = \\sin(2t)$ ile sürülen iki sistem. Düz çizgiler: girişin yalnızca $x_1$'i sürdüğü kontrol edilemez köşegen sistem — ikinci koordinat $x_2$ girişi yok sayar ve başlangıç değerinden bozunur. Noktalı çizgiler: girişin eşlenik dinamikler aracılığıyla her iki duruma da ulaştığı kontrol edilebilir yoldaş-formlu sistem. Kontrol edilebilirlik, hangi yörüngeleri üretebileceğinize karar veren yapısal özelliktir.</div></div>

<div class="l-note"><strong>Tasarım için neden önemli.</strong> $(A, B)$ kontrol edilebilir değilse, kontrol edilemez modlar serbestçe evrilir. O modlar kararlıysa, onları yok sayabilirsiniz. Herhangi bir kontrol edilemez mod kararsızsa, umutsuz bir tasarımınız vardır — hiçbir geri besleme sizi kurtaramaz. Modern kontrolör tasarımına geçmeden önce kontrol edilebilirlik testinin yapılan ilk kontrol olmasının nedeni budur.</div>

<!-- ========================================================================
     BÖLÜM 6
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">6. Gözlenebilirlik — Durumu Geri Kazanabilir miyiz?</h2>

<div class="calc-highlight"><strong>İkili soru:</strong> Sonlu bir zaman aralığı boyunca ölçülen çıkış $Y(t) = CX(t) + DU(t)$ ve bilinen giriş $U(t)$ verildiğinde, başlangıç durumunu $X(0)$ yeniden kurabilir misiniz? Her olası $X(0)$ için evet ise sistem <em>gözlenebilirdir</em>.</div>

<p class="l-text">Gözlenebilirlik $(A, C)$ çiftiyle ilgilenir ve çıkışın iç durumu çakıştırmak için yeterli bilgi taşıyıp taşımadığını sorar. Gözlenebilirlik olmadan, farklı başlangıç durumları aynı çıkışları üretir ve kontrolörün ölçümlerden onları ayırt etmenin bir yolu yoktur. Test, kontrol edilebilirlik testinin yapısal ikilisidir.</p>

<div class="calc-formula"><div class="formula-label">GÖZLENEBİLİRLİK MATRİSİ</div><div class="formula-main">$$\\mathcal{O} = \\begin{bmatrix} C \\\\ CA \\\\ CA^2 \\\\ \\vdots \\\\ CA^{n-1} \\end{bmatrix} \\in \\mathbb{R}^{n p \\times n}$$</div><div class="formula-sub">$C$'yi ve çarpımları $CA, CA^2, \\ldots, CA^{n-1}$'i blok satır olarak yığ.</div></div>

<div class="calc-formula"><div class="formula-label">KALMAN GÖZLENEBİLİRLİK TEOREMİ</div><div class="formula-main">$$(A, C) \\text{ gözlenebilir} \\iff \\text{rank}(\\mathcal{O}) = n$$</div><div class="formula-sub">Tam sütun rankı — durum uzayındaki her yön çıkış üzerinde farklı bir parmak izi bırakır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gözlenemez altuzay</div><div class="card-body">$\\text{ker}(\\mathcal{O}) \\subset \\mathbb{R}^n$, sıfır çıkış üreten durumlar kümesidir. Trivial $\\iff$ gözlenebilir.</div></div>
<div class="calc-card"><div class="card-title">İkilik</div><div class="card-body">$(A, B)$ kontrol edilebilir $\\iff$ $(A^T, B^T)$ gözlenebilirdir. Her kontrol edilebilirlik teoreminin transpozla elde edilen bir gözlenebilirlik ikizi vardır.</div></div>
<div class="calc-card"><div class="card-title">PBH testi</div><div class="card-body">$(A, C)$ gözlenebilir $\\iff \\begin{bmatrix} sI - A \\\\ C \\end{bmatrix}$ her $s \\in \\mathbb{C}$ için tam sütun rankına sahiptir.</div></div>
<div class="calc-card"><div class="card-title">SISO basitleştirme</div><div class="card-body">Tek çıkış için ($p=1$), $\\mathcal{O}$ kare $n \\times n$'dir ve gözlenebilirlik $\\det(\\mathcal{O}) \\neq 0$'a indirgenir.</div></div>
</div>

<div class="calc-example"><div class="example-label">GÖZLENEBİLİR ÖRNEK</div><div class="example-body">$A = \\begin{bmatrix} 0 & 1 \\\\ -2 & -3 \\end{bmatrix}$, $C = \\begin{bmatrix} 1 & 0 \\end{bmatrix}$ (yalnızca ilk durumu ölçüyoruz). O zaman $CA = \\begin{bmatrix} 0 & 1 \\end{bmatrix}$ ve $\\mathcal{O} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I$, tam rank. <strong>Gözlenebilir.</strong> İki durumdan yalnızca birini ölçsek de, dinamikler onları eşler ve $y(t)$'yi zamanla izlemek diğerini türevi aracılığıyla ortaya çıkarır.</div></div>

<div class="calc-example"><div class="example-label">GÖZLENEMEZ ÖRNEK</div><div class="example-body">$A = \\begin{bmatrix} -1 & 0 \\\\ 0 & -2 \\end{bmatrix}$, $C = \\begin{bmatrix} 1 & 0 \\end{bmatrix}$. İki mod ayrışmıştır ve yalnızca birinciyi görüyoruz. O zaman $CA = \\begin{bmatrix} -1 & 0 \\end{bmatrix}$ ve $\\mathcal{O} = \\begin{bmatrix} 1 & 0 \\\\ -1 & 0 \\end{bmatrix}$ rank 1'e sahiptir. <strong>Gözlenemez.</strong> İkinci mod çıkışa hiç katkı vermez; $y(t)$'den $x_2(0)$'ı yeniden kuramayız.</div></div>

<div class="l-note"><strong>Kalman ayrışımı.</strong> Herhangi bir LTI sistemi dört blok-köşegen parçaya ayrılabilir: kontrol edilebilir ve gözlenebilir, kontrol edilebilir ama gözlenemez, gözlenebilir ama kontrol edilemez ve hiçbiri değil. Yalnızca ilk parça transfer fonksiyonunda görünür. Diğer üçü gizli modlardır — durum-uzayı modelinde mevcut, giriş-çıkış testine görünmez, kararsız olduğunda tehlikeli.</div>

<!-- ========================================================================
     BÖLÜM 7
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">7. Durum Geri Beslemesi ve Kutup Yerleştirme</h2>

<div class="calc-highlight"><strong>Birinci büyük modern teorem:</strong> Eğer $(A, B)$ kontrol edilebilirse, durum geri beslemesi $u = -KX$ kapalı-döngü özdeğerlerini karmaşık düzlemde <em>herhangi</em> bir istenen konum kümesine yerleştirebilir (konjugasyon altında kapalı). Sistemin verdiğiyle yaşamak zorunda kalan klasik kök-yer-eğrisi resmi, serbest tasarımla değiştirilir.</div>

<p class="l-text">Tam durumu ölçmemize ve girişi onun lineer fonksiyonu olarak seçmemize izin verildiğini varsayalım. Kontrol yasası</p>

<div class="calc-formula"><div class="formula-label">DURUM GERİ BESLEMESİ</div><div class="formula-main">$$u(t) = -K\\, X(t), \\qquad K \\in \\mathbb{R}^{m \\times n}$$</div><div class="formula-sub">$K$ sabit bir kazanç matrisidir. $K$'yi biz tasarlarız.</div></div>

<p class="l-text">Durum denklemine geri yerleştirmek kapalı-döngü dinamiklerini verir:</p>

<div class="calc-formula"><div class="formula-label">KAPALI-DÖNGÜ SİSTEMİ</div><div class="formula-main">$$\\dot{X} = AX + B(-KX) = (A - BK)\\, X$$</div><div class="formula-sub">Kapalı-döngü matrisi $A_{cl} = A - BK$. Özdeğerleri kapalı-döngü kutuplarıdır.</div></div>

<p class="l-text"><strong>Kutup yerleştirme teoremi.</strong> $(A, B)$ kontrol edilebilirse, kapalı-döngü özdeğerleri için her istenen $\\{\\mu_1, \\ldots, \\mu_n\\}$ kümesi (kendi-konjugat bir küme) için, $A - BK$'nın özdeğerleri tam olarak $\\{\\mu_1, \\ldots, \\mu_n\\}$ olacak şekilde bir kazanç matrisi $K$ vardır. Kazanç tek-giriş durumunda tektir; çok-girişli tesisler için ek hedefler için kullanılabilen tasarım özgürlüğü vardır.</p>

<div class="calc-formula"><div class="formula-label">ACKERMANN FORMÜLÜ (TEK GİRİŞ)</div><div class="formula-main">$$K = \\begin{bmatrix} 0 & 0 & \\cdots & 0 & 1 \\end{bmatrix} \\mathcal{C}^{-1}\\, p_d(A)$$</div><div class="formula-sub">$p_d(s) = (s - \\mu_1)(s - \\mu_2) \\cdots (s - \\mu_n)$ istenen kapalı-döngü karakteristik polinomudur; $p_d(A)$ matris $A$'yı o polinoma yerleştirir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tasarım düğmesi</div><div class="card-body">$\\mu_i$'yi seçmek bir kontrol mühendisinin tercihidir. Daha hızlı kutuplar daha keskin tepki anlamına gelir; daha yavaş kutuplar daha az aktüatör çabası anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">Sınırlar</div><div class="card-body">Agresif kutup yerleştirme büyük $K$ girdileri ister — aktüatörleri doyurur ve ölçüm gürültüsünü güçlendirir. Pratikte LQR (L6) performansı enerjiyle takas eder.</div></div>
<div class="calc-card"><div class="card-title">Kontrol edilebilirlik şart</div><div class="card-body">$(A, B)$ kontrol edilebilir değilse, bazı kapalı-döngü özdeğerleri $A$'nın kontrol edilemez özdeğerlerinde sabitlenir. Hiçbir $K$ onları hareket ettiremez.</div></div>
<div class="calc-card"><div class="card-title">Sağlamlık</div><div class="card-body">Kutup yerleştirme modeli tam kullanır. Gerçek tesislerde parametre belirsizliği vardır; $H_\\infty$ ve $\\mu$-sentezi bunu sistematik olarak ele alır.</div></div>
</div>

<div class="calc-example"><div class="example-label">KUTUP YERLEŞTİRME ÇÖZÜLDÜ</div><div class="example-body">Tesis $A = \\begin{bmatrix} 0 & 1 \\\\ -2 & -3 \\end{bmatrix}$, $B = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$. Açık-döngü kutuplar: $-1, -2$. İstenen kapalı-döngü kutuplar: $-4, -5$ (daha hızlı). İstenen polinom: $p_d(s) = (s+4)(s+5) = s^2 + 9s + 20$. Kontrol edilebilir formda, $K = [k_1\\; k_2]$, $A - BK = \\begin{bmatrix} 0 & 1 \\\\ -2 - k_1 & -3 - k_2 \\end{bmatrix}$ verir. Karakteristik polinom $s^2 + (3 + k_2) s + (2 + k_1)$. Katsayıları eşle: $k_1 = 18$, $k_2 = 6$. Yani $K = [18\\; 6]$.</div></div>

<div id="plot-l5-pp-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
function plotPoles(){
  var openX=[-1,-2];var openY=[0,0];
  var closedX=[-4,-5];var closedY=[0,0];
  var t1={x:openX,y:openY,mode:"markers",name:"Açık-döngü kutuplar (lambda of A)",marker:{color:"#f87171",size:14,symbol:"x",line:{width:3}}};
  var t2={x:closedX,y:closedY,mode:"markers",name:"Kapalı-döngü kutuplar (lambda of A - BK)",marker:{color:"#3b82f6",size:14,symbol:"circle",line:{color:"#ebe6dc",width:1}}};
  var t3={x:[0,0],y:[-3,3],mode:"lines",name:"imajiner eksen",line:{color:"#a78bfa",width:1.4,dash:"dash"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Re(s)",range:[-7,3]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Im(s)",range:[-3,3],scaleanchor:"x"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:11}},annotations:[{x:-1,y:0.3,text:"-1",showarrow:false,font:{color:"#f87171",size:11}},{x:-2,y:0.3,text:"-2",showarrow:false,font:{color:"#f87171",size:11}},{x:-4,y:0.3,text:"-4 (yerleşti)",showarrow:false,font:{color:"#3b82f6",size:11}},{x:-5,y:0.3,text:"-5 (yerleşti)",showarrow:false,font:{color:"#3b82f6",size:11}}]};
  Plotly.newPlot("plot-l5-pp-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
}
plotPoles();
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Kutup yerleştirme kazancı. $-1, -2$'deki açık-döngü kutuplar (kırmızı çarpılar) kararlı ama biraz yavaş bir tesisi tanımlar. Durum geri beslemesi $K = [18,\\, 6]$ tasarlamak kapalı-döngü kutuplarını $-4, -5$'e (mavi noktalar) taşır, sol yarı-düzlemde dört kat daha derin — daha hızlı, daha sönümlü tepki. Kontrol edilebilirlik ve bir durum ölçümü ile, istenen herhangi bir kutup yapılandırması erişilebilirdir.</div></div>

<!-- ========================================================================
     BÖLÜM 8
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">8. Çözümlü Örnek — Araba Üzerinde Ters Sarkaç</h2>

<div class="calc-highlight"><strong>Kanonik demo:</strong> Hareketli bir araba üzerinde dengeli bir ters sarkaç kararsızdır, doğrusal değildir ve durum-geri beslemesi tasarımı için güzel bir oyun alanıdır. Yukarı dik denge etrafında lineerleştir, durum-uzayı modelini yaz ve ters konumu kararlı yapan bir kazanç tasarla.</div>

<p class="l-text">Kütlesi $m$ ve uzunluğu $\\ell$ olan bir sarkaç, yatay olarak hareket edebilen kütlesi $M$ olan bir araba üzerine menteşeli. Araba konumu $x$, sarkaç açısı dikeyden $\\theta$. Arabaya yatay bir kuvvet $F$ etki eder. Tam hareket denklemleri doğrusal değildir ama küçük $\\theta$ için yukarı dik konum $(\\theta = 0)$ etrafında lineerleştirme, durum vektörü ile dört-durumlu lineer bir model verir</p>

<div class="calc-formula"><div class="formula-label">SARKAÇ DURUM VEKTÖRÜ</div><div class="formula-main">$$X = \\begin{bmatrix} x \\\\ \\dot{x} \\\\ \\theta \\\\ \\dot{\\theta} \\end{bmatrix}$$</div><div class="formula-sub">Araba konumu, araba hızı, sarkaç açısı (dikeyden), sarkaç açısal hızı.</div></div>

<p class="l-text">Tipik sayısal değerler $M = 1$ kg, $m = 0.2$ kg, $\\ell = 0.5$ m, $g = 9.81$ m/s$^2$ için, lineerleştirilmiş matrisler (Lagrange türevinden sonra) şu şekilde çıkar:</p>

<div class="calc-formula"><div class="formula-label">LİNEERLEŞTİRİLMİŞ ARABA-DİREK MODELİ</div><div class="formula-main">$$A \\approx \\begin{bmatrix} 0 & 1 & 0 & 0 \\\\ 0 & 0 & -1.96 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 23.5 & 0 \\end{bmatrix}, \\quad B \\approx \\begin{bmatrix} 0 \\\\ 1.0 \\\\ 0 \\\\ -2.0 \\end{bmatrix}$$</div><div class="formula-sub">Çıkış: eğim sensörleri için $y = \\theta$ veya konum sensörleri için $y = x$ veya her ikisi.</div></div>

<p class="l-text"><strong>Açık döngünün kararlılığı.</strong> $A$'nın özdeğerleri $0, 0, \\pm \\sqrt{g(M+m)/(M\\ell)} \\approx \\pm 4.85$'tir. Pozitif özdeğer $+4.85$ baş aşağı kararsızlıktır — sarkaç düşer. İki sıfır özdeğeri araba kaymasına karşılık gelir (sert öteleme bir şey değiştirmez). Sistem açık-döngü kararsızdır; kontrol olmadan sarkaç saniyenin bir kısmında devrilir.</p>

<p class="l-text"><strong>Kontrol edilebilirlik.</strong> $\\mathcal{C} = [B\\;\\, AB\\;\\, A^2 B\\;\\, A^3 B]$'yi hesapla. Yukarıdaki sayılar için $\\det(\\mathcal{C}) \\neq 0$, yani sistem tamamen kontrol edilebilirdir. Onu durum geri beslemesiyle kararlı yapabiliriz.</p>

<p class="l-text"><strong>$K$ tasarımı.</strong> Dört istenen kapalı-döngü kutup seç, örneğin $\\{-2, -2.5, -3, -3.5\\}$ — hepsi sol yarı-düzlem, iyi sönümlü. $K$'yi çözmek için Ackermann veya sayısal kutup yerleştirme kullan. Tipik sonuç: $K \\approx [-2.4,\\; -3.1,\\; -42,\\; -9]$ (işaretler ve büyüklükler birime ve kutup seçimine göre değişir). $u = -KX$ uygula ve kapalı-döngü matrisi $A - BK$'nın dört özdeğerinin tümü istenen konumlardadır. Sarkaç dengelenir.</p>

<div id="plot-l5-pendulum-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=600;var Tf=4;var dt=Tf/n;var ts=[];
var thOpen=[];var thClosed=[];
var sO=[0,0,0.05,0];var sC=[0,0,0.05,0];
var g=9.81,M=1.0,mp=0.2,L=0.5;
var A22=-mp*g/M;
var A42=(M+mp)*g/(M*L);
function dyn(s,u){
  var x=s[0],xd=s[1],th=s[2],thd=s[3];
  return [xd, u/M + A22*th, thd, A42*th - u/(M*L)];
}
var K=[-3.0,-5.0,-50,-12];
for(var i=0;i<n;i++){
  ts.push(i*dt);
  thOpen.push(sO[2]);thClosed.push(sC[2]);
  var dO=dyn(sO,0);
  var uC=-(K[0]*sC[0]+K[1]*sC[1]+K[2]*sC[2]+K[3]*sC[3]);
  var dC=dyn(sC,uC);
  for(var k=0;k<4;k++){sO[k]+=dO[k]*dt;sC[k]+=dC[k]*dt;}
  if(Math.abs(sO[2])>2)sO[2]=Math.sign(sO[2])*2;
}
var t1={x:ts,y:thOpen,mode:"lines",name:"theta(t) — açık döngü (düşer)",line:{color:"#f87171",width:2.5}};
var t2={x:ts,y:thClosed,mode:"lines",name:"theta(t) — kapalı döngü u = -KX (dengelenir)",line:{color:"#3b82f6",width:2.5}};
var t3={x:[0,Tf],y:[0,0],mode:"lines",name:"yukarı dik theta = 0",line:{color:"#a78bfa",width:1.2,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"zaman t (s)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"açı theta (rad)",range:[-0.5,2.1]},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l5-pendulum-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> $0.05$ rad'lık küçük bir başlangıç pertürbasyonundan başlayan ters sarkaç eğimi $\\theta(t)$. Kontrolsüz (kırmızı) açı lineer yaklaşıklık boyunca üstel olarak büyür, sonra model bozulduğunda doyuma ulaşır — sarkaç düştü. Durum geri beslemesi $u = -KX$ ile (mavi) açı yaklaşık 2 saniyede sıfıra sürülür — kontrolör temelde kararsız bir tesisi kararlı yapar. Bu, durum geri beslemesinin sabit-yapılı klasik kontrolörün yapamayacağı şeyleri yapabildiğinin kanonik gösterimidir.</div></div>

<!-- ========================================================================
     BÖLÜM 9
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">9. Durum Gözlemcisi — Luenberger</h2>

<div class="calc-highlight"><strong>Gerçeklik yine ısırır:</strong> durum geri beslemesi tam durum $X$'i bildiğimizi varsaydı. Pratikte yalnızca $Y = CX$'i $p < n$ sensörle ölçeriz. Luenberger gözlemcisi mevcut çıkıştan bir tahmin $\\hat{X}(t)$'yi yeniden kuran temiz bir yapıdır ve tahmin durum-geri beslemesi yasasına beslemek için yeterince iyidir.</div>

<p class="l-text">Tesisin yazılımda bir kopyasını oluştur, aynı giriş $U$ ile sürülür, artı ölçülen çıkış ile öngörülen çıkış arasındaki farkla orantılı bir düzeltme terimi:</p>

<div class="calc-formula"><div class="formula-label">LUENBERGER GÖZLEMCİSİ</div><div class="formula-main">$$\\dot{\\hat{X}} = A \\hat{X} + B U + L (Y - C \\hat{X})$$</div><div class="formula-sub">$L \\in \\mathbb{R}^{n \\times p}$ gözlemci kazancıdır. $Y - C\\hat{X}$ terimi çıkış-öngörü hatasıdır.</div></div>

<p class="l-text">Tahmin hatasını $e = X - \\hat{X}$ olarak tanımla. Gözlemci denklemini tesis denkleminden çıkarmak hata dinamiklerini verir:</p>

<div class="calc-formula"><div class="formula-label">GÖZLEMCİ HATA DİNAMİKLERİ</div><div class="formula-main">$$\\dot{e} = (A - LC)\\, e$$</div><div class="formula-sub">Girişten bağımsız. Hata sıfıra bozunur ancak ve ancak $A - LC$ Hurwitz'dir.</div></div>

<p class="l-text">Kontrol edilebilirlik ile gözlenebilirlik arasındaki ikilik sayesinde, $A - LC$'nin özdeğerlerini istenen yerlere yerleştirmek için $L$'yi seçmek, $A - BK$'nın özdeğerlerini yerleştirmek için $K$'yi seçmekle aynı problemdir. Aynı kutup-yerleştirme mekanizmasını ikili çift $(A^T, C^T)$'ye uygularız: $(A, C)$ gözlenebilirse, o zaman $(A^T, C^T)$ kontrol edilebilirdir ve gözlemci kutuplarını herhangi bir yere yerleştirebiliriz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tasarım kuralı</div><div class="card-body">Gözlemci kutupları genellikle kontrolör kutuplarından 3 ila 10 kat daha hızlı yerleştirilir, böylece tahmin hatası kontrol performansını etkilemeden önce bozunur.</div></div>
<div class="calc-card"><div class="card-title">Gürültü dengesi</div><div class="card-body">Hızlı gözlemci kutbu = agresif düzeltme = ölçüm gürültüsünü güçlendirir. Yavaş gözlemci kutbu = sessiz tahmin = bozulmalara yavaş tepki.</div></div>
<div class="calc-card"><div class="card-title">Kalman filtresi</div><div class="card-body">Gauss gürültüsü varlığında en uygun gözlemci. Luenberger ile aynı yapı; kazanç $L$ bir kovaryans ölçütünü minimize eder (L6'da ele alınır).</div></div>
<div class="calc-card"><div class="card-title">Çıkış geri beslemesi</div><div class="card-body">Birleştir: $u = -K\\hat{X}$, burada $\\hat{X}$ gözlemciden gelir. Bileşik sistem $2n$ durum sahibidir ve yalnızca $Y$'den uygulanabilir.</div></div>
</div>

<p class="l-text"><strong>Ayrım ilkesi.</strong> Derin ve şaşırtıcı derecede kolay bir teorem: birleştirilmiş kontrolör-gözlemci sisteminin kapalı-döngü özdeğerleri tam olarak kontrolör özdeğerlerinin ($A - BK$'nın özdeğerleri) ve gözlemci özdeğerlerinin ($A - LC$'nin özdeğerleri) birleşimidir. Tasarımlar ayrışır. $K$'yi kontrolör kutuplarını yerleştirmek için seçersiniz, $L$'yi gözlemci kutuplarını yerleştirmek için bağımsız olarak seçersiniz ve bileşik kapalı-döngü kutupları iki kümenin birlikte yığılmasıdır. Bu, kontrol teorisinin tamamındaki en temiz sonuçlardan biridir.</p>

<div id="plot-l5-obs-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=400;var Tf=5;var dt=Tf/n;var ts=[];
var x1=[];var x2=[];var xh1=[];var xh2=[];var e1=[];var e2=[];
var sX=[1.0,0.5];var sXh=[0,0];
var A=[[0,1],[-2,-3]];var Cv=[1,0];var L=[5,4];
for(var i=0;i<n;i++){
  ts.push(i*dt);
  x1.push(sX[0]);x2.push(sX[1]);
  xh1.push(sXh[0]);xh2.push(sXh[1]);
  e1.push(sX[0]-sXh[0]);e2.push(sX[1]-sXh[1]);
  var y=Cv[0]*sX[0]+Cv[1]*sX[1];
  var yh=Cv[0]*sXh[0]+Cv[1]*sXh[1];
  var dx=[A[0][0]*sX[0]+A[0][1]*sX[1],A[1][0]*sX[0]+A[1][1]*sX[1]];
  var dxh=[A[0][0]*sXh[0]+A[0][1]*sXh[1]+L[0]*(y-yh),A[1][0]*sXh[0]+A[1][1]*sXh[1]+L[1]*(y-yh)];
  sX[0]+=dx[0]*dt;sX[1]+=dx[1]*dt;
  sXh[0]+=dxh[0]*dt;sXh[1]+=dxh[1]*dt;
}
var t1={x:ts,y:e1,mode:"lines",name:"e_1(t) = x_1 - xhat_1",line:{color:"#3b82f6",width:2.5}};
var t2={x:ts,y:e2,mode:"lines",name:"e_2(t) = x_2 - xhat_2",line:{color:"#a78bfa",width:2.5}};
var t3={x:[0,Tf],y:[0,0],mode:"lines",name:"sıfır hata",line:{color:"#f87171",width:1.2,dash:"dot"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"zaman t (s)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"tahmin hatası"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:11}}};
Plotly.newPlot("plot-l5-obs-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> İkinci-mertebe bir tesis için Luenberger gözlemcisi tahmin hatası. Gerçek durum $(1.0, 0.5)$'te başlar ve gözlemci $(0, 0)$'da başlar — en kötü durum başlatması. $A - LC$'nin özdeğerlerini sol yarı-düzleme derinden yerleştirmek için seçilen gözlemci kazancı $L = [5, 4]$ ile her iki hata bileşeni de yaklaşık iki saniyede sıfıra yakınsar. Bundan sonra, tahmin gerçek durumu izler ve sanki gerçek ölçümmüş gibi durum-geri besleme yasasına beslenebilir.</div></div>

<div class="l-note"><strong>Blok diyagram görünümü.</strong> Tam çıkış-geri besleme kontrolörü: tesis $\\to$ çıkış $Y$ $\\to$ gözlemci (tesisin bir kopyasını + düzeltme çalıştırıyor) $\\to$ tahmin $\\hat{X}$ $\\to$ $-K$ ile çarp $\\to$ giriş $U$ $\\to$ tesise geri. Dışarıdan sabit bir giriş-çıkış filtresine benziyor, ama içeride dünyanın bir modelini çalıştırıyor ve doğrudan gördüğü şey yerine olduğunu düşündüğü şeyle yönlendiriyor. Bu fikir — kontrolörün ölçümlere karşı tuttuğu ve düzelttiği iç modeller — lineer sistemlerin çok ötesine, modern uyarlanır kontrol ve pekiştirmeli öğrenmeye genelleşir.</div>

<!-- ========================================================================
     BÖLÜM 10
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">10. AI Bağlantısı — Sistem Tanımlama ve Sinirsel ODE</h2>

<div class="calc-highlight"><strong>Durum-uzayı modern ML ile buluşuyor:</strong> Matrisler $(A, B, C, D)$ bilinmiyorsa, onları verilerden <em>öğrenebiliriz</em> — sistem tanımlama denilen bir disiplin. Lineer matrisleri doğrusal olmayan fonksiyon yakınlaştırıcılarla değiştir ve sinirsel ODE elde edersin: birçok modern dinamik-sistem ağını çalıştıran öğrenilmiş, sürekli zamanlı, doğrusal olmayan durum-uzayı modeli.</div>

<p class="l-text"><strong>Klasik sistem tanımlama.</strong> Bilinmeyen bir lineer tesisten giriş-çıkış verisi $\\{U(t_k), Y(t_k)\\}_{k=0}^{N}$ verildiğinde, modelin veriyi en iyi yeniden ürettiği $(A, B, C, D)$'yi tahmin et. Yöntemler altuzay tanımlama (N4SID, MOESP), öngörü hata yöntemleri ve yenilik formu ARMAX modelleri içerir. Çıktı, gerçek veriye uydurulmuş bir durum-uzayı gerçeklemesidir — birinci-ilkeler modelinin mevcut olmadığı durumlarda yararlıdır.</p>

<div class="calc-formula"><div class="formula-label">LİNEER SİSTEM TANIMLAMA HEDEFİ</div><div class="formula-main">$$\\min_{A, B, C, D, X_0}\\, \\sum_{k=0}^{N} \\big\\| Y(t_k) - \\big[ C\\, e^{A t_k}\\, X_0 + \\textstyle\\int_0^{t_k} C\\, e^{A(t_k - \\tau)}\\, B\\, U(\\tau)\\, d\\tau + D\\, U(t_k) \\big] \\big\\|^2$$</div><div class="formula-sub">LTI modeli gözlenen girişlere ve çıkışlara uydur.</div></div>

<p class="l-text"><strong>Sinirsel ODE.</strong> Chen ve diğerleri (2018) bunu öğrenilmiş bir vektör alanına genelleştirir. $\\dot{X} = AX + BU$'yu şununla değiştir:</p>

<div class="calc-formula"><div class="formula-label">SİNİRSEL ADİ DİFERANSİYEL DENKLEM</div><div class="formula-main">$$\\dot{X}(t) = f_\\theta(X(t), U(t), t)$$</div><div class="formula-sub">$f_\\theta$ parametreleri $\\theta$ olan bir sinir ağıdır. Dinamikler artık matrisler değil, keyfi türevlenebilir bir fonksiyondur.</div></div>

<p class="l-text">Eğitim, ODE çözücüsünden ya standart otomatik diferansiyasyon ya da ara durumları depolamaktan kaçınan ek hassasiyet yöntemi kullanarak geri yayılım ile $\\theta$'yı uydurur. Sonuç, gizli durumu ayrık katmanlar yığını yerine bir ODE'ye göre evrilen sürekli derinlikli bir ağdır. Artık ağları (bir ODE'nin ileri-Euler ayrıklaştırmalarıdır) genelleştirir, düzensiz örneklenmiş zaman serilerini doğal olarak destekler ve ODE çözücüsü toleransını sıkılaştırarak hesaplamayı doğrulukla değiştirmenize izin verir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lineer $\\to$ doğrusal olmayan</div><div class="card-body">$\\dot{X} = AX + BU$, $\\dot{X} = f_\\theta(X, U)$ olur. Lineer-sistemler sezgisi (kararlılık, kontrol edilebilirlik) Jacobian lineerleştirme ile yerel olarak genelleşir.</div></div>
<div class="calc-card"><div class="card-title">Gizil ODE</div><div class="card-body">Bir kodlayıcı, gizli dinamikler için bir sinirsel ODE ve bir kod çözücüyü birleştir — zaman serileri için bir durum-uzayı VAE. Sağlık ve iklim modellemesinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Durum-uzayı LLM'leri</div><div class="card-body">Mamba ve S4, öğrenilmiş $A, B, C$ ile transformerlarla yarışan ayrık-zamanlı durum-uzayı modelleridir. Klasik durum-uzayı mekanizması dil modellemesinin en ucunda geri döndü.</div></div>
<div class="calc-card"><div class="card-title">Kontrol + RL</div><div class="card-body">Model-tabanlı pekiştirmeli öğrenme etkileşimden dinamikleri $f_\\theta$ öğrenir, sonra öğrenilmiş model ile MPC veya LQR kullanır. Durum-uzayı klasik kontrol ve modern RL arasındaki köprüdür.</div></div>
</div>

<div class="l-note"><strong>Pedagojik olarak.</strong> Bu derste her şey — özdeğer kararlılığı, kontrol edilebilirlik, gözlenebilirlik, kutup yerleştirme, gözlemciler — modern ML'de doğrusal olmayan veya öğrenilmiş bir karşılığa sahiptir. Sinir ağları için erişilebilirlik analizi (doğrulama), gözlenebilirlik-tabanlı gizil temsiller, Koopman operatör teorisi (doğrusal olmayan bir sistemi sonsuz boyutlu lineer bire kaldırır) — tüm bunlar bu derste oluşturduğunuz kavramsal iskele üzerinde yaşar veya ölür.</div>

<!-- ========================================================================
     BÖLÜM 11 — Pyodide Laboratuvarı
     ======================================================================== -->
<h2 class="lesson-title" style="color:#3b82f6">11. Pyodide Laboratuvarı — Durum-Uzayı Araç Kutusu</h2>

<p class="l-text">Bu lab her şeyi bir araya getirir. İlk blok <code>scipy.signal.StateSpace</code> kullanarak $(A, B, C, D)$'den bir durum-uzayı modeli oluşturur, basamak tepkisini simüle eder ve kontrol edilebilirlik ile gözlenebilirlik ranklarını kontrol eder. İkinci blok küçük kararsız bir tesis üzerinde <code>scipy.signal.place_poles</code> ile kutup yerleştirme yapar ve kapalı-döngü özdeğerlerinin tam olarak istenen yerlere indiğini doğrular.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON · DURUM-UZAYI TEMELLERİ</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy <span class="kw">import</span> signal

<span class="cm"># --- Durum-uzayı modelini (A, B, C, D) tanımla ----------------------</span>
A = np.<span class="fn">array</span>([[<span class="num">0</span>, <span class="num">1</span>],
              [-<span class="num">2</span>, -<span class="num">3</span>]], dtype=<span class="fn">float</span>)
B = np.<span class="fn">array</span>([[<span class="num">0</span>],
              [<span class="num">1</span>]], dtype=<span class="fn">float</span>)
C = np.<span class="fn">array</span>([[<span class="num">2</span>, <span class="num">1</span>]], dtype=<span class="fn">float</span>)
D = np.<span class="fn">array</span>([[<span class="num">0</span>]], dtype=<span class="fn">float</span>)

sys = signal.<span class="fn">StateSpace</span>(A, B, C, D)
<span class="fn">print</span>(<span class="str">"Durum-uzayı modeli:"</span>)
<span class="fn">print</span>(<span class="str">f"  A =\\n{A}"</span>)
<span class="fn">print</span>(<span class="str">f"  B =\\n{B}"</span>)
<span class="fn">print</span>(<span class="str">f"  C = {C}"</span>)
<span class="fn">print</span>(<span class="str">f"  D = {D}"</span>)

<span class="cm"># --- Özdeğerler = kutuplar -------------------------------------------</span>
evals = np.linalg.<span class="fn">eigvals</span>(A)
<span class="fn">print</span>(<span class="str">f"\\nA'nın özdeğerleri (açık-döngü kutuplar): {evals}"</span>)
<span class="fn">print</span>(<span class="str">f"Tüm Re(lambda) &lt; 0? -&gt; {np.all(np.real(evals) &lt; 0)}"</span>)

<span class="cm"># --- Kontrol edilebilirlik matrisi -----------------------------------</span>
n = A.shape[<span class="num">0</span>]
ctrb = np.<span class="fn">hstack</span>([np.linalg.<span class="fn">matrix_power</span>(A, k) @ B <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(n)])
<span class="fn">print</span>(<span class="str">f"\\nKontrol edilebilirlik matrisi:\\n{ctrb}"</span>)
<span class="fn">print</span>(<span class="str">f"  rank = {np.linalg.matrix_rank(ctrb)} (tam kontrol edilebilirlik için {n} gerek)"</span>)

<span class="cm"># --- Gözlenebilirlik matrisi -----------------------------------------</span>
obsv = np.<span class="fn">vstack</span>([C @ np.linalg.<span class="fn">matrix_power</span>(A, k) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(n)])
<span class="fn">print</span>(<span class="str">f"\\nGözlenebilirlik matrisi:\\n{obsv}"</span>)
<span class="fn">print</span>(<span class="str">f"  rank = {np.linalg.matrix_rank(obsv)} (tam gözlenebilirlik için {n} gerek)"</span>)

<span class="cm"># --- Basamak tepkisi -------------------------------------------------</span>
t_step, y_step = signal.<span class="fn">step</span>(sys, T=np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">6</span>, <span class="num">300</span>))
<span class="fn">print</span>(<span class="str">f"\\nBasamak tepkisi: y(0) = {y_step[0]:.4f}, y(son) = {y_step[-1]:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"  -C A^-1 B + D'den kararlı-durum = {(-C @ np.linalg.inv(A) @ B + D)[0,0]:.4f}"</span>)
<span class="fn">print</span>(<span class="str">"  (sayısal tolerans dahilinde eşleşir)"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON · place_poles İLE KUTUP YERLEŞTİRME</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy <span class="kw">import</span> signal

<span class="cm"># --- Kontrol edilebilir kanonik formda kararsız tesis ---------------</span>
A = np.<span class="fn">array</span>([[<span class="num">0</span>, <span class="num">1</span>],
              [<span class="num">2</span>, <span class="num">1</span>]], dtype=<span class="fn">float</span>)   <span class="cm"># açık-döngü kutuplar +2.0 ve -1.0 civarında</span>
B = np.<span class="fn">array</span>([[<span class="num">0</span>],
              [<span class="num">1</span>]], dtype=<span class="fn">float</span>)

open_poles = np.linalg.<span class="fn">eigvals</span>(A)
<span class="fn">print</span>(<span class="str">f"Açık-döngü kutuplar: {open_poles}"</span>)
<span class="fn">print</span>(<span class="str">f"  Kararlı mı? {np.all(np.real(open_poles) &lt; 0)}"</span>)   <span class="cm"># False — kararsız</span>

<span class="cm"># --- İstenen kapalı-döngü kutuplar -----------------------------------</span>
desired = np.<span class="fn">array</span>([-<span class="num">4</span>, -<span class="num">5</span>])

<span class="cm"># --- K'yi çöz --------------------------------------------------------</span>
res = signal.<span class="fn">place_poles</span>(A, B, desired)
K = res.gain_matrix
<span class="fn">print</span>(<span class="str">f"\\nDurum-geri besleme kazancı K = {K}"</span>)

<span class="cm"># --- Kapalı-döngü kutuplarını doğrula --------------------------------</span>
A_cl = A - B @ K
closed_poles = np.linalg.<span class="fn">eigvals</span>(A_cl)
<span class="fn">print</span>(<span class="str">f"Kapalı-döngü kutuplar: {closed_poles}"</span>)
<span class="fn">print</span>(<span class="str">f"  İstenen {desired} ile eşleşiyor mu? -&gt; {np.allclose(np.sort(np.real(closed_poles)), np.sort(desired))}"</span>)

<span class="cm"># --- Açık-döngü ve kapalı-döngü basamak tepkilerini karşılaştır -----</span>
C = np.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">0</span>]], dtype=<span class="fn">float</span>)
D = np.<span class="fn">array</span>([[<span class="num">0</span>]], dtype=<span class="fn">float</span>)
sys_open  = signal.<span class="fn">StateSpace</span>(A,    B, C, D)
sys_closed= signal.<span class="fn">StateSpace</span>(A_cl, B, C, D)

T = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">3</span>, <span class="num">200</span>)
_, y_open   = signal.<span class="fn">step</span>(sys_open,   T=T)
_, y_closed = signal.<span class="fn">step</span>(sys_closed, T=T)
<span class="fn">print</span>(<span class="str">f"\\nAçık-döngü maks |y| [0,3] üzerinde:   {np.max(np.abs(y_open)):.2e}   (patlar)"</span>)
<span class="fn">print</span>(<span class="str">f"Kapalı-döngü maks |y| [0,3] üzerinde: {np.max(np.abs(y_closed)):.4f}   (sınırlı, oturur)"</span>)

<span class="cm"># --- Gözlemci kutup yerleştirme (ikili problem) ----------------------</span>
C_obs = np.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">0</span>]], dtype=<span class="fn">float</span>)
obs_desired = np.<span class="fn">array</span>([-<span class="num">8</span>, -<span class="num">10</span>])             <span class="cm"># gözlemci kontrolörden daha hızlı</span>
res_obs = signal.<span class="fn">place_poles</span>(A.T, C_obs.T, obs_desired)
L = res_obs.gain_matrix.T
<span class="fn">print</span>(<span class="str">f"\\nGözlemci kazancı L = {L.flatten()}"</span>)
<span class="fn">print</span>(<span class="str">f"(A - L C)'nin özdeğerleri: {np.linalg.eigvals(A - L @ C_obs)}"</span>)
<span class="fn">print</span>(<span class="str">"Bileşik kontrolör-gözlemci kutupları (ayrım ilkesi):"</span>)
<span class="fn">print</span>(<span class="str">f"  kontrolör: {closed_poles}"</span>)
<span class="fn">print</span>(<span class="str">f"  gözlemci:  {np.linalg.eigvals(A - L @ C_obs)}"</span>)
<span class="fn">print</span>(<span class="str">"  -&gt; kapalı-döngü sistemi 4 kutbun hepsine sahip, birleşime eşit."</span>)</code></pre></div>

<div id="plot-l5-phase-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var n=200;var Tf=4;var dt=Tf/n;
var inits=[[1,0.5],[-1,0.8],[1.2,-1.0],[-0.8,-0.5],[0.5,-1.2]];
var data=[];
var cols=["#3b82f6","#a78bfa","#22c55e","#f87171","#fbbf24"];
for(var k=0;k<inits.length;k++){
  var s=inits[k].slice();var xs=[];var ys=[];
  for(var i=0;i<n;i++){xs.push(s[0]);ys.push(s[1]);
    var d=[s[1],-2*s[0]-3*s[1]];
    s[0]+=d[0]*dt;s[1]+=d[1]*dt;}
  data.push({x:xs,y:ys,mode:"lines",name:"başlangıç ("+inits[k][0]+","+inits[k][1]+")",line:{color:cols[k],width:2}});
}
data.push({x:[0],y:[0],mode:"markers",name:"denge",marker:{color:"#ebe6dc",size:11,symbol:"x",line:{width:2}}});
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_1 = konum",range:[-1.5,1.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x_2 = hız",range:[-1.5,1.5],scaleanchor:"x"},margin:{t:60,r:30,b:50,l:60},showlegend:true,legend:{orientation:"h",y:1.10,xanchor:"center",x:0.5,font:{color:"#ebe6dc",size:10}}};
Plotly.newPlot("plot-l5-phase-tr",data,layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin anlatımı.</strong> Pyodide labında kullanılan ikinci-mertebe örnek için $\\dot{X} = AX$'in faz-düzlemi yörüngeleri. Beş farklı başlangıç koşulu kökene spiral yapar veya eğri çizer — kararlı node, çünkü $A$'nın iki özdeğeri de reel ve negatiftir ($-1$ ve $-2$). Düzlemde durum-uzayı resmi özdeğer hikâyesini geometrik yapar.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN BUNU</div><div class="think-body">Ters sarkaç örneğinde, açık-döngü kararsızlığı $\\sqrt{g(M+m)/(M\\ell)}$ büyüme oranına sahiptir, bu yerçekimi ivmesine ve sarkaç uzunluğuna bağlıdır ama sensörleri ne kadar hızlı örneklediğinize bağlı değildir. Yine de pratik dijital kontrolörler bu üstel büyümeyi yakalayacak kadar hızlı bir örnekleme oranında çalışmalıdır — aksi takdirde ayrık kontrol güncellemesi çok geç gelir. Büyüme zaman-sabiti başına en az 10 kontrol güncellemesi ile $\\ell = 0.5$ m sarkacı kararlı tutmak için hangi örnekleme oranına ihtiyacınız olur? Sayıları simülasyona koymayı ve ayrıklaştırmanın kontrolörle savaşmaya başladığı zamanı bulmayı dene.</div></div>

<p class="l-text">Ders 6 durum-uzayı çerçevesini bir adım daha ileri götürerek şunu sorar: belirli bir tesisi kararlı yapan tüm $K$ kazanç matrisleri arasında, hangisi durum hatası ve kontrol çabası üzerindeki bir kuadratik maliyeti minimize eder? Bu LQR problemidir ve çözümü şimdiye kadar yayınlanmış en etkili modern kontrolör tasarımıdır.</p>
`
};
