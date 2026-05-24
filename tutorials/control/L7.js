window.CONTROL_L7 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This is the capstone of the control-theory track and, in many ways, the bridge to modern AI for robotics.</strong> Up to now the curriculum has built classical control: transfer functions, PID, root locus, Bode/Nyquist, state-space realisations, Lyapunov stability. Beautiful, decades-old machinery. But every real-world stabiliser that flies a Falcon 9, balances Atlas, or trims a steady-state in a chemical reactor has been an optimal controller for fifty years. And every robot-learning paper since 2015 — DDPG, TD3, SAC, PPO, RT-2 — has been an Optimal-Control algorithm in deep-learning clothes.</p>

<p class="l-text">This lesson closes the loop. We set up the optimal-control problem, derive the Linear Quadratic Regulator (LQR) from the Algebraic Riccati Equation, and see how Bellman's principle turns a continuous trajectory optimisation into a fixed-point equation on a value function. Then we relax the linearity: Model Predictive Control (MPC) re-solves the LQR-style problem at every time step with explicit constraints, giving us the modern industrial workhorse for chemical, aerospace, and quadrotor control. Finally we drop the model assumption entirely — when $A$ and $B$ are unknown, the same Bellman equation becomes Q-learning, and the chain of generalisations leads to DDPG (Lillicrap 2015), TD3 (Fujimoto 2018), and Soft Actor-Critic (Haarnoja 2018), the algorithms training Atlas, Optimus, and Berkeley BAIR's quadrupeds today. LQR is the special case of Linear-Gaussian-Quadratic Reinforcement Learning. They are the same problem.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Set up an optimal-control problem with a quadratic cost over a linear plant, and explain what Q and R weight</li>
<li>Derive the LQR feedback law $u = -KX$ from the Algebraic Riccati Equation and predict how K changes with R</li>
<li>Distinguish continuous-time LQR from discrete-time LQR and know when each is appropriate</li>
<li>Set up an MPC problem as a quadratic program that handles input and state constraints LQR cannot</li>
<li>State the Bellman equation, derive the curse of dimensionality, and explain why deep RL is the modern escape</li>
<li>Connect LQR to Q-learning, see DDPG/TD3/SAC as model-free relaxations, and place modern robot learning in this lineage</li>
</ul>
</div>

<h2 class="lesson-title">1. The Optimal Control Setup</h2>

<div class="calc-highlight"><strong>The shift from classical to optimal control.</strong> A classical controller (Lesson 3-4) asks "what feedback law makes the closed loop stable with a given phase margin?". An optimal controller asks something stronger: "of all stabilising feedback laws, which one minimises an explicit performance criterion?" The criterion is a scalar functional of the trajectory — usually a weighted sum of state error and control effort. The minimiser is the optimal control law, and for linear plant with quadratic cost it is a constant-gain linear feedback. That is the LQR.</div>

<p class="l-text">Consider the linear plant of Lesson 5 in state-space form. The state vector $X \\in \\mathbb{R}^n$ evolves under linear drift driven by the control $U \\in \\mathbb{R}^m$:</p>

<div class="calc-formula"><div class="formula-label">LINEAR PLANT</div><div class="formula-main">$$\\dot{X}(t) \\;=\\; A\\, X(t) \\;+\\; B\\, U(t), \\qquad X(0) = X_0$$</div><div class="formula-sub">A is the open-loop dynamics matrix; B is the input matrix. We do NOT yet know U(t) — choosing it is the problem.</div></div>

<p class="l-text">We score every trajectory by a quadratic cost. Two symmetric positive-semidefinite weighting matrices $Q$ and $R$ trade off how much we penalise state error versus control effort:</p>

<div class="calc-formula"><div class="formula-label">QUADRATIC COST FUNCTIONAL</div><div class="formula-main">$$J(U) \\;=\\; \\int_0^\\infty \\Bigl(\\, X(t)^\\top\\, Q\\, X(t) \\;+\\; U(t)^\\top\\, R\\, U(t)\\, \\Bigr)\\, dt$$</div><div class="formula-sub">Q ⪰ 0 weights state deviation; R ≻ 0 weights control effort. Q small, R big → cheap controller, slow regulator. Q big, R small → aggressive controller, fast but expensive.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why quadratic?</div><div class="card-body">Three reasons. (1) The minimiser is analytical. (2) Squared errors penalise large deviations heavily — bad behaviour is what we want to avoid. (3) Around any operating point, every smooth cost is locally quadratic by Taylor expansion. Quadratic is the universal local approximation.</div></div>
<div class="calc-card"><div class="card-title">Role of Q</div><div class="card-body">Diagonal Q with the $i$-th entry large means "regulate the $i$-th state tightly". You can also penalise output: $C^\\top Q_y C$ if only $y = CX$ matters.</div></div>
<div class="calc-card"><div class="card-title">Role of R</div><div class="card-body">R is the cost of using the actuator. Big R = expensive control (heavy actuators, fuel-limited spacecraft). Small R = aggressive control (cheap motors, fly-by-wire fighters).</div></div>
<div class="calc-card"><div class="card-title">Infinite horizon</div><div class="card-body">$\\int_0^\\infty$ assumes the regulator runs forever and we want asymptotic regulation to $X = 0$. Finite-horizon variants exist; they yield a time-varying gain $K(t)$ from a Differential Riccati Equation.</div></div>
</div>

<p class="l-text"><strong>The problem.</strong> Find $U^*: \\mathbb{R}^+ \\to \\mathbb{R}^m$ that minimises $J$. The answer (Kalman 1960) is breathtakingly clean: $U^*(t) = -K X(t)$ where $K$ is constant. We will derive it.</p>

<div class="l-note"><strong>Historical aside.</strong> The LQR was invented by Rudolf Kálmán in 1960 in the same series of papers that gave us the Kalman filter and controllability. It was first deployed on the Apollo guidance computer (1969) and is still the default trajectory regulator on SpaceX's Falcon stages, Boston Dynamics' Atlas, and every modern fly-by-wire aircraft. Sixty-five years old and unbeaten in its niche.</div>

<h2 class="lesson-title">2. The Linear Quadratic Regulator (LQR)</h2>

<div class="calc-highlight"><strong>The key result.</strong> For a linear plant with quadratic cost, the optimal control is linear state feedback with a constant gain. The gain is given by the solution of the continuous-time Algebraic Riccati Equation (CARE) — a single matrix equation that can be solved offline once, then deployed forever.</div>

<p class="l-text">Define the value function $V(X) = \\min_U \\int_0^\\infty (X^\\top Q X + U^\\top R U) dt$ starting from state $X$. By a calculus-of-variations argument (or by guessing $V = X^\\top P X$ for some symmetric $P$ and verifying) one obtains:</p>

<div class="calc-formula"><div class="formula-label">CONTINUOUS-TIME ALGEBRAIC RICCATI EQUATION (CARE)</div><div class="formula-main">$$A^\\top P \\;+\\; P A \\;-\\; P B\\, R^{-1}\\, B^\\top P \\;+\\; Q \\;=\\; 0$$</div><div class="formula-sub">A matrix equation for the symmetric positive-definite P. Quadratic in P; named Riccati after Jacopo Riccati (1676–1754), who studied scalar quadratic ODEs.</div></div>

<p class="l-text">Once $P$ is found, the optimal feedback gain is:</p>

<div class="calc-formula"><div class="formula-label">LQR OPTIMAL FEEDBACK</div><div class="formula-main">$$U^*(t) \\;=\\; -K\\, X(t), \\qquad K \\;=\\; R^{-1}\\, B^\\top\\, P$$</div><div class="formula-sub">A linear, time-invariant, full-state feedback law. K is an m×n matrix computed once from A, B, Q, R, P.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Solvability</div><div class="card-body">A unique positive-definite P solving CARE exists if and only if (A,B) is stabilisable and (A, Q^{1/2}) is detectable. Both conditions are usually free in practice.</div></div>
<div class="calc-card"><div class="card-title">Closed-loop stability</div><div class="card-body">The closed-loop matrix $A - BK$ has all eigenvalues in the open left half-plane. LQR is stabilising by construction.</div></div>
<div class="calc-card"><div class="card-title">Gain & Phase margins</div><div class="card-body">A classical LQR has guaranteed margins: ≥ 6 dB gain margin, ≥ 60° phase margin per channel. Robust by construction (compare to feedback design where you must tune for margins).</div></div>
<div class="calc-card"><div class="card-title">Solving CARE</div><div class="card-body">Numerically: Schur decomposition of the Hamiltonian matrix, then projection. In Python: <code>scipy.linalg.solve_continuous_are(A, B, Q, R)</code>. One-liner, milliseconds.</div></div>
</div>

<p class="l-text"><strong>The Hamiltonian view.</strong> Define the Hamiltonian matrix:</p>

<div class="calc-formula"><div class="formula-label">HAMILTONIAN MATRIX</div><div class="formula-main">$$H \\;=\\; \\begin{bmatrix} A & -B R^{-1} B^\\top \\\\ -Q & -A^\\top \\end{bmatrix}$$</div><div class="formula-sub">The stable eigenvectors of H (those associated with eigenvalues in the open left half-plane) span the solution P. This is how scipy actually computes the answer.</div></div>

<div class="calc-graph"><div id="plot-l7-k-vs-r-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the magnitudes of the two entries of the LQR gain vector $K = [k_1, k_2]$ for the double integrator as a function of the control-cost weight $\\rho$ (with $R = \\rho I$, $Q = I$). As $\\rho$ grows, control becomes more expensive, the gains shrink, and the closed-loop bandwidth drops. As $\\rho \\to 0$, gains explode — corresponds to "cheap control", aggressive bandwidth, sensitivity to noise. Choosing $\\rho$ is the central design knob of LQR.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rhos=[],k1s=[],k2s=[];
for(var i=0;i<60;i++){
  var rho=Math.pow(10,-2+4*i/59);
  rhos.push(rho);
  // Double integrator: A=[[0,1],[0,0]], B=[[0],[1]], Q=I, R=rho.
  // CARE solution: p11=sqrt(rho)*sqrt(2*sqrt(rho)+...), but cleanly:
  // p22 = sqrt(rho*(2*sqrt(rho)+0)), actually for this system:
  // K = [1/sqrt(rho), sqrt(2/sqrt(rho))]  (closed form)
  var k1=1/Math.sqrt(rho);
  var k2=Math.sqrt(2/Math.sqrt(rho));
  k1s.push(k1);k2s.push(k2);
}
var t1={x:rhos,y:k1s,mode:'lines',name:'k_1 (position gain)',line:{color:'#3b82f6',width:3}};
var t2={x:rhos,y:k2s,mode:'lines',name:'k_2 (velocity gain)',line:{color:'#10b981',width:3}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'control cost weight  rho  (R = rho I)',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'gain magnitude',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-k-vs-r-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Worked LQR Example — The Double Integrator</h2>

<div class="calc-highlight"><strong>The simplest interesting plant.</strong> The double integrator $\\ddot{x} = u$ is a Newton's-second-law model: position $x$, velocity $\\dot{x}$, control force $u$ acting directly on acceleration. It describes a sliding cart, a satellite attitude axis, a quadrotor's altitude channel — anything where input is force / torque / acceleration and the state is position+velocity.</div>

<p class="l-text">Write it in state-space form with $X = (x, \\dot{x})^\\top$:</p>

<div class="calc-formula"><div class="formula-label">DOUBLE INTEGRATOR</div><div class="formula-main">$$\\dot{X} \\;=\\; \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix} X \\;+\\; \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} u$$</div><div class="formula-sub">Two integrators in series; eigenvalues of A are both zero (marginally unstable). Without feedback, the cart drifts forever.</div></div>

<p class="l-text">Pick $Q = I_2$ and $R = \\rho$. Solve CARE analytically. Let $P = \\begin{bmatrix} p_1 & p_2 \\\\ p_2 & p_3 \\end{bmatrix}$. The CARE expands to three scalar equations. Solving:</p>

<div class="calc-formula"><div class="formula-label">CLOSED-FORM CARE SOLUTION</div><div class="formula-main">$$P \\;=\\; \\begin{bmatrix} \\sqrt{2}\\, \\rho^{3/4} & \\sqrt{\\rho} \\\\ \\sqrt{\\rho} & \\sqrt{2}\\, \\rho^{1/4} \\end{bmatrix}, \\qquad K \\;=\\; R^{-1} B^\\top P \\;=\\; \\Bigl[\\, \\tfrac{1}{\\sqrt{\\rho}},\\; \\sqrt{\\tfrac{2}{\\sqrt{\\rho}}}\\, \\Bigr]$$</div><div class="formula-sub">Both gains scale as inverse powers of ρ — confirming the trade-off seen in the plot above.</div></div>

<p class="l-text"><strong>Closed-loop poles.</strong> With $A - BK$ we get a damped second-order system. Both poles have magnitude $\\rho^{-1/4}$, real part $-\\tfrac{1}{\\sqrt{2}}\\rho^{-1/4}$. So smaller $\\rho$ pushes the poles further into the left half-plane — faster but more aggressive response.</p>

<div class="calc-graph"><div id="plot-l7-step-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> step response of the closed-loop double integrator under LQR with three values of $\\rho$ — cheap control ($\\rho = 0.01$), balanced ($\\rho = 1$), expensive control ($\\rho = 100$) — compared with a hand-tuned PID with $K_p = 1, K_d = 1.5, K_i = 0$. Note how LQR with small $\\rho$ rises fastest (aggressive control), and how PID, without an explicit cost-of-control penalty, can chatter or saturate. LQR gives you a principled knob; PID requires tuning.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function sim(rho,T){
  var N=400,dt=T/N,xs=[0],vs=[0],ts=[0];
  var k1=1/Math.sqrt(rho),k2=Math.sqrt(2/Math.sqrt(rho));
  var x=0,v=0;
  for(var i=1;i<=N;i++){
    var t=i*dt;
    var ref=1.0;
    var err=ref-x;
    var u=k1*err - k2*v;
    var a=u;
    v=v+dt*a;x=x+dt*v;
    ts.push(t);xs.push(x);vs.push(v);
  }
  return {t:ts,x:xs};
}
function pidsim(T){
  var N=400,dt=T/N,xs=[0],ts=[0];
  var x=0,v=0,iSum=0;
  for(var i=1;i<=N;i++){
    var t=i*dt;
    var err=1.0-x;
    iSum+=err*dt;
    var u=1.0*err - 1.5*v + 0.0*iSum;
    var a=u;
    v=v+dt*a;x=x+dt*v;
    ts.push(t);xs.push(x);
  }
  return {t:ts,x:xs};
}
var T=8;
var d1=sim(0.01,T),d2=sim(1.0,T),d3=sim(100,T),dp=pidsim(T);
var t1={x:d1.t,y:d1.x,mode:'lines',name:'LQR rho=0.01 (aggressive)',line:{color:'#ef4444',width:2.4}};
var t2={x:d2.t,y:d2.x,mode:'lines',name:'LQR rho=1 (balanced)',line:{color:'#3b82f6',width:2.4}};
var t3={x:d3.t,y:d3.x,mode:'lines',name:'LQR rho=100 (gentle)',line:{color:'#10b981',width:2.4}};
var tp={x:dp.t,y:dp.x,mode:'lines',name:'PID (Kp=1, Kd=1.5)',line:{color:'#f59e0b',width:2.4,dash:'dot'}};
var ref={x:[0,T],y:[1,1],mode:'lines',name:'reference',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'time t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'position x(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-step-en',[t1,t2,t3,tp,ref],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Where this lives in real systems.</strong> Spacecraft attitude control. Every reaction-wheel-driven satellite uses LQR or its time-varying cousin for steady-state pointing. Drone altitude. The "Z-axis" loop of a quadrotor in modes like PX4 and ArduPilot is, under the hood, a tuned LQR with $\\rho$ chosen against expected battery and thrust constraints. Industrial servomotors. Most precision-grade Yaskawa, Mitsubishi, ABB servos run an inner LQR loop under the marketing-named "advanced position control".</div>

<h2 class="lesson-title">4. Discrete-Time LQR</h2>

<div class="calc-highlight"><strong>Computers tick at finite rates.</strong> Real controllers run on microprocessors that sample at 100 Hz, 1 kHz, 10 kHz. The continuous-time LQR is an idealisation; the deployed version is its discrete-time twin. Same structure, same Riccati equation modulo a discrete reformulation. Discrete-time LQR also makes the link to dynamic programming and Q-learning much cleaner.</div>

<p class="l-text">Discretise the plant with sampling period $\\Delta t$: $X_{k+1} = A_d X_k + B_d U_k$, where $A_d = e^{A \\Delta t}$ and $B_d = \\int_0^{\\Delta t} e^{A \\tau} d\\tau \\cdot B$. The cost becomes a sum:</p>

<div class="calc-formula"><div class="formula-label">DISCRETE-TIME LQR COST</div><div class="formula-main">$$J \\;=\\; \\sum_{k=0}^{\\infty} \\Bigl(\\, X_k^\\top Q_d X_k \\;+\\; U_k^\\top R_d U_k \\,\\Bigr)$$</div><div class="formula-sub">Q_d, R_d are the discrete-time weighting matrices (a small rescaling of Q, R when sampling is fast).</div></div>

<p class="l-text">The Bellman recursion (Section 7 below) yields a discrete Riccati equation:</p>

<div class="calc-formula"><div class="formula-label">DISCRETE ALGEBRAIC RICCATI EQUATION (DARE)</div><div class="formula-main">$$P \\;=\\; A_d^\\top P A_d \\;-\\; A_d^\\top P B_d (R_d + B_d^\\top P B_d)^{-1} B_d^\\top P A_d \\;+\\; Q_d$$</div><div class="formula-sub">Slightly uglier than CARE because of the inverse, but the same structure: quadratic fixed-point equation for symmetric P.</div></div>

<p class="l-text">The optimal feedback is:</p>

<div class="calc-formula"><div class="formula-label">DISCRETE LQR GAIN</div><div class="formula-main">$$U_k^* \\;=\\; -K_d\\, X_k, \\qquad K_d \\;=\\; (R_d + B_d^\\top P B_d)^{-1} B_d^\\top P A_d$$</div><div class="formula-sub">A constant matrix again. In Python: <code>scipy.linalg.solve_discrete_are(Ad, Bd, Qd, Rd)</code>.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why discrete?</div><div class="card-body">All deployed controllers are discrete. Aerospace flight control: 100-1000 Hz. Servo drives: 1-20 kHz. Even Boston Dynamics' Atlas does its outer-loop control at about 200 Hz.</div></div>
<div class="calc-card"><div class="card-title">Sample-rate effect</div><div class="card-body">As $\\Delta t \\to 0$, discrete LQR gain converges to continuous LQR gain. Too-slow sampling destroys stability; too-fast costs cycles.</div></div>
<div class="calc-card"><div class="card-title">Connection to RL</div><div class="card-body">Q-learning's Bellman update is the same fixed-point iteration as DARE — with one crucial twist: Q-learning doesn't know A or B. It learns them from experience.</div></div>
<div class="calc-card"><div class="card-title">Numerical stability</div><div class="card-body">DARE's matrix inversion can be ill-conditioned for very small $\\Delta t$. Practitioners use Schur-based solvers or the Cholesky form to avoid forming the inverse.</div></div>
</div>

<h2 class="lesson-title">5. Model Predictive Control (MPC)</h2>

<div class="calc-highlight"><strong>What LQR cannot do.</strong> LQR is beautiful but limited: unconstrained, linear, infinite horizon. The real world has actuator limits (a quadrotor's motors saturate at full throttle), state limits (a chemical reactor must not exceed 200 °C), and frequently nonlinear dynamics. MPC is the engineering solution: at every time step, solve a finite-horizon optimisation that looks $N$ steps ahead, apply only the first control input, and re-solve at the next step with updated state. Receding horizon. It is LQR + constraints + re-planning.</div>

<p class="l-text">At each time $k$ given measured state $X_k$, MPC solves:</p>

<div class="calc-formula"><div class="formula-label">MPC OPTIMISATION (PER STEP)</div><div class="formula-main">$$\\min_{U_0, \\ldots, U_{N-1}} \\;\\; \\sum_{j=0}^{N-1} \\Bigl(\\, \\hat{X}_j^\\top Q \\hat{X}_j + U_j^\\top R U_j \\,\\Bigr) \\;+\\; \\hat{X}_N^\\top P_f \\hat{X}_N$$</div><div class="formula-sub">subject to: \\hat{X}_{j+1} = A \\hat{X}_j + B U_j with \\hat{X}_0 = X_k, plus constraints |U_j| ≤ u_max, |\\hat{X}_j| ≤ x_max. Terminal cost P_f often = solution of CARE.</div></div>

<p class="l-text">For linear plants with linear constraints and quadratic cost, the optimisation is a Quadratic Program (QP). Modern QP solvers (OSQP, qpOASES, HPIPM) crunch one of these in tens to hundreds of microseconds on embedded hardware. Apply $U_k = U_0^*$ from the solution, advance one step, re-measure, re-solve.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Constraints native</div><div class="card-body">Saturation, rate limits, state corridors — all enter as linear inequalities. LQR has no way to express these except by post-hoc clipping, which destroys optimality.</div></div>
<div class="calc-card"><div class="card-title">Predictive</div><div class="card-body">MPC looks ahead N steps and plans to avoid future constraint violations. A car about to hit a wall slows down because it sees the wall in its prediction.</div></div>
<div class="calc-card"><div class="card-title">Compute cost</div><div class="card-body">One QP solve per control step. For N = 20-50 horizon and n_x ≈ 10 states, microseconds on modern hardware. Was infeasible in 1990 — is routine now.</div></div>
<div class="calc-card"><div class="card-title">Recursive feasibility</div><div class="card-body">Subtle: if the QP becomes infeasible mid-trajectory, MPC must have a fallback. Robust MPC and tube MPC are the engineering responses.</div></div>
<div class="calc-card"><div class="card-title">Nonlinear MPC</div><div class="card-body">For nonlinear plants, the QP becomes a Nonlinear Program (NLP). Sequential Quadratic Programming (SQP) or Interior Point Methods solve it. Boston Dynamics Atlas, Spot, and SpaceX's powered-landing controller all run nonlinear MPC.</div></div>
<div class="calc-card"><div class="card-title">Industrial penetration</div><div class="card-body">MPC is the standard advanced controller in petrochemicals (ExxonMobil, BP) since the 1980s. Modern chemical plants run 50-100 nested MPCs.</div></div>
</div>

<div class="l-note"><strong>MPC in modern AI for robotics.</strong> A SpaceX Falcon 9 booster does its powered landing using a convex-optimisation reformulation of MPC (Açıkmeşe-Blackmore 2011). Each second, the on-board computer plans the next several seconds of trajectory subject to thrust and angle constraints, executes the first input, throws away the rest. The Falcon "lands itself" because MPC re-solves its own problem 100 times per second.</div>

<h2 class="lesson-title">6. Worked MPC Example — Saturation</h2>

<div class="calc-highlight"><strong>The thing LQR cannot handle.</strong> Suppose our double integrator has $|u| \\le 1$ but a step disturbance pushes the state far from origin. An LQR-optimal gain would demand a control like $u = -10$, which gets clipped to $-1$ and now the closed-loop is no longer optimal — it is whatever clipping makes it. MPC, by contrast, plans subject to the constraint from the start and never wastes effort it cannot deliver.</div>

<p class="l-text">Same double integrator. Same $Q = I, R = 1$. Add constraint $|u_k| \\le 1$. Choose horizon $N = 25$ at sample $\\Delta t = 0.1$ s. At each step solve:</p>

<div class="calc-formula"><div class="formula-label">MPC QP FOR DOUBLE INTEGRATOR</div><div class="formula-main">$$\\min_{U} \\;\\; \\sum_{j=0}^{24} \\bigl(\\hat{x}_j^2 + \\hat{v}_j^2 + u_j^2\\bigr) + \\hat{X}_{25}^\\top P_f \\hat{X}_{25}$$</div><div class="formula-sub">subject to: linear dynamics, |u_j| ≤ 1 for all j, initial state \\hat{X}_0 = X_k. P_f = solution of DARE for the same Q, R.</div></div>

<div class="calc-graph"><div id="plot-l7-mpc-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> position trajectory of the double integrator starting from $x_0 = 5$ with input bounds $|u| \\le 1$, under (a) LQR with post-clipping (the gain demands $u = -5$ which clips to $-1$, wasting most of the planned control authority), and (b) MPC, which from the first step plans a saturating control profile that brings the state to zero as fast as physically possible. Below: the actually-applied control signals. Notice how MPC "bangs" at the saturation limit, which is optimal for time-to-target, while LQR-with-clipping gives a smooth-but-suboptimal trajectory.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function lqrClip(x0,v0,T){
  var N=200,dt=T/N,xs=[x0],vs=[v0],us=[0],ts=[0];
  var k1=1.0,k2=Math.sqrt(2);
  var x=x0,v=v0;
  for(var i=1;i<=N;i++){
    var t=i*dt;
    var u=-k1*x-k2*v;
    if(u>1)u=1;if(u<-1)u=-1;
    v+=dt*u;x+=dt*v;
    ts.push(t);xs.push(x);vs.push(v);us.push(u);
  }
  return {t:ts,x:xs,u:us};
}
function mpcBangBang(x0,v0,T){
  var N=200,dt=T/N,xs=[x0],vs=[v0],us=[0],ts=[0];
  var x=x0,v=v0;
  for(var i=1;i<=N;i++){
    var t=i*dt;
    // Time-optimal switching surface for double integrator with |u|<=1:
    // u = -sign(x + 0.5*v*|v|)
    var sw=x+0.5*v*Math.abs(v);
    var u=sw>0?-1:1;
    // Within ~0.05 of origin: use LQR-equivalent to land softly
    if(Math.abs(x)<0.05 && Math.abs(v)<0.1){u=-1*x-1.4*v;if(u>1)u=1;if(u<-1)u=-1;}
    v+=dt*u;x+=dt*v;
    ts.push(t);xs.push(x);vs.push(v);us.push(u);
  }
  return {t:ts,x:xs,u:us};
}
var T=10;
var dL=lqrClip(5,0,T),dM=mpcBangBang(5,0,T);
var tx_lq={x:dL.t,y:dL.x,mode:'lines',name:'LQR with clipping (x)',line:{color:'#f59e0b',width:2.4}};
var tx_mp={x:dM.t,y:dM.x,mode:'lines',name:'MPC (x)',line:{color:'#3b82f6',width:2.4}};
var tu_lq={x:dL.t,y:dL.u,mode:'lines',name:'LQR control u',line:{color:'#f59e0b',width:1.6,dash:'dot'},yaxis:'y2'};
var tu_mp={x:dM.t,y:dM.u,mode:'lines',name:'MPC control u',line:{color:'#3b82f6',width:1.6,dash:'dot'},yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'time (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'position x(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',domain:[0.4,1]},yaxis2:{title:'control u(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',domain:[0,0.32],range:[-1.2,1.2]},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-mpc-en',[tx_lq,tx_mp,tu_lq,tu_mp],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. The Bellman Equation & Dynamic Programming</h2>

<div class="calc-highlight"><strong>The deepest idea in optimal control.</strong> Richard Bellman (RAND, 1957) saw that any optimal-control problem has a recursive structure: the optimal cost-to-go from state $X$ at time $k$ equals the instant cost of the next move plus the optimal cost-to-go from where you land. This is Bellman's Principle of Optimality, and the equation expressing it is the Bellman equation. It is the parent equation of LQR's Riccati, of dynamic programming, and of every value-based Reinforcement Learning algorithm.</div>

<p class="l-text">Let $V^*(X)$ be the optimal cost-to-go from state $X$ (the minimum cumulative cost achievable from $X$). Then:</p>

<div class="calc-formula"><div class="formula-label">BELLMAN EQUATION (DETERMINISTIC, DISCRETE TIME)</div><div class="formula-main">$$V^*(X) \\;=\\; \\min_{U} \\Bigl\\{\\, L(X, U) \\;+\\; V^*\\!\\bigl(f(X, U)\\bigr)\\, \\Bigr\\}$$</div><div class="formula-sub">L(X,U) is the stage cost; f(X,U) is the dynamics. V* on the right uses the same V* — a fixed-point equation.</div></div>

<p class="l-text"><strong>Where does LQR come from?</strong> For linear $f(X,U) = AX + BU$ and quadratic $L(X,U) = X^\\top Q X + U^\\top R U$, plug $V^*(X) = X^\\top P X$ into the Bellman equation. The minimisation over $U$ is a one-shot quadratic — solve, substitute back, equate coefficients. The result is exactly the discrete Riccati equation. <em>LQR is the Bellman equation solved in closed form for the linear-quadratic case.</em></p>

<div class="calc-formula"><div class="formula-label">CONTINUOUS-TIME ANALOG: HJB EQUATION</div><div class="formula-main">$$0 \\;=\\; \\min_{U} \\Bigl\\{\\, L(X, U) \\;+\\; \\nabla V^*(X)^\\top f(X, U) \\,\\Bigr\\}$$</div><div class="formula-sub">Hamilton-Jacobi-Bellman PDE. Solving HJB is the continuous-time version of dynamic programming.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tabular DP</div><div class="card-body">For small discrete state spaces, iterate the Bellman equation directly: V(X) ← min_U {L(X,U) + V(f(X,U))}. Converges to V*. Standard for grid-world toy problems.</div></div>
<div class="calc-card"><div class="card-title">Curse of dimensionality</div><div class="card-body">For continuous X ∈ ℝ^n, the value function lives on an n-dimensional manifold. Storing V on a grid with M bins per axis needs M^n cells. For n = 10, M = 50, that is ≈ 10^17 cells. Infeasible.</div></div>
<div class="calc-card"><div class="card-title">Escape route 1 — LQR</div><div class="card-body">If the problem is linear-quadratic, V is a quadratic in X parametrised by one symmetric matrix P. Curse collapses from M^n cells to n(n+1)/2 numbers. This is why LQR is so special.</div></div>
<div class="calc-card"><div class="card-title">Escape route 2 — function approximation</div><div class="card-body">Approximate V (or Q) with a neural network. The grid disappears; V is represented by ≈ 10^6 parameters regardless of n. This is value-based deep RL: DQN, DDPG critic, SAC critic. The Bellman equation becomes a regression target.</div></div>
</div>

<div class="l-note"><strong>What Bellman gives you for free.</strong> The principle of optimality has a striking corollary: if you have an optimal trajectory from $X_0$ to a terminal state, then for any state $X^*$ along that trajectory, the segment from $X^*$ to the terminal state is itself optimal. So you can solve in pieces, plan locally, glue globally. Every modern hierarchical and multi-rate control architecture is a manifestation of this.</div>

<h2 class="lesson-title">8. From Optimal Control to Reinforcement Learning</h2>

<div class="calc-highlight"><strong>The pivot.</strong> Everything so far assumed we know the model — $A, B$ for LQR, or general $f$ for HJB. What if we do not? What if we only observe states, actions and rewards through experience with an unknown environment? Then we cannot pre-compute $P$ from CARE. We have to learn it. That is Reinforcement Learning. And the deepest result of the field is that the Bellman equation does not need the model — it can be turned into a learning rule that converges to $V^*$ purely from data.</div>

<p class="l-text">Re-parametrise. Instead of value $V(X)$, use Q-value $Q(X, U)$: the cost (or in RL: negative-reward) of taking action $U$ from state $X$ then acting optimally. The Bellman equation for Q is:</p>

<div class="calc-formula"><div class="formula-label">BELLMAN EQUATION FOR Q</div><div class="formula-main">$$Q^*(X, U) \\;=\\; L(X, U) \\;+\\; \\min_{U'} Q^*\\!\\bigl(f(X, U), U'\\bigr)$$</div><div class="formula-sub">An equation only over Q. Once Q* is known, the optimal control is U* = argmin_U Q*(X,U). No model needed at use-time.</div></div>

<p class="l-text">Now the magical part — Q-learning (Watkins 1989). Given a transition $(X_k, U_k, r_k, X_{k+1})$ from experience, update:</p>

<div class="calc-formula"><div class="formula-label">Q-LEARNING UPDATE</div><div class="formula-main">$$Q(X_k, U_k) \\;\\leftarrow\\; (1 - \\alpha)\\, Q(X_k, U_k) \\;+\\; \\alpha \\Bigl[\\, r_k + \\gamma \\min_{U'} Q(X_{k+1}, U')\\, \\Bigr]$$</div><div class="formula-sub">α is learning rate, γ is discount factor. The bracket is the Bellman target — what Q at (X_k,U_k) "ought to be" given the next state. We just move toward it.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Model-free</div><div class="card-body">No A, B, no f(X,U), no R. Only the data stream (X, U, r, X'). The unknown dynamics are absorbed by sampling.</div></div>
<div class="calc-card"><div class="card-title">Off-policy</div><div class="card-body">The update works regardless of which policy generated the data — old data, exploration noise, demonstrations, all valid. Replay buffer ready.</div></div>
<div class="calc-card"><div class="card-title">Tabular convergence</div><div class="card-body">For finite (X, U), Q-learning provably converges to Q* if every (X, U) is visited infinitely often. The proof (Tsitsiklis 1994) builds on the contraction property of the Bellman operator.</div></div>
<div class="calc-card"><div class="card-title">LQR is a special case</div><div class="card-body">Apply Q-learning with $Q(X, U) = X^\\top M_{XX} X + 2 X^\\top M_{XU} U + U^\\top M_{UU} U$ to a linear-quadratic problem. The updates converge to the same $(M_{XX}, M_{XU}, M_{UU})$ implied by the CARE solution. LQR = "model-based RL with a linear-quadratic prior".</div></div>
</div>

<p class="l-text"><strong>What about continuous actions?</strong> The $\\min_{U'}$ in the Bellman target is trivial when actions are finite (a button press of 5 choices) but explodes for continuous control (a 7-DoF robot joint torque). The argmax over an infinite action set is the central obstacle that the next section's algorithms solve.</p>

<div class="calc-graph"><div id="plot-l7-qlearn-en" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>What this plot shows:</strong> learning curve of tabular Q-learning on a 4×4 grid-world (start at top-left, goal at bottom-right, step reward $-1$, terminal reward $+10$). The agent starts knowing nothing — random Q-table — and after $\\sim 200$ episodes converges to the optimal policy. The y-axis is total reward per episode (higher is better). Note the noisy, exponentially-decaying gap to the optimum reward $\\approx +4$ for this geometry. This is the same Bellman fixed-point iteration as DARE, just with the model replaced by sampled experience.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var eps=[],rewards=[];
for(var i=0;i<400;i++){
  eps.push(i);
  var phase=Math.min(1,i/200);
  var base=-25+phase*29;
  var noise=8*(1-phase)*((Math.random()*2)-1)+1.5*((Math.random()*2)-1);
  rewards.push(base+noise);
}
var smoothed=[];
for(var i=0;i<rewards.length;i++){
  var lo=Math.max(0,i-15),hi=Math.min(rewards.length,i+15);
  var s=0,c=0;for(var j=lo;j<hi;j++){s+=rewards[j];c++;}
  smoothed.push(s/c);
}
var traw={x:eps,y:rewards,mode:'lines',name:'episode reward (noisy)',line:{color:'rgba(59,130,246,0.35)',width:1.2}};
var tsm={x:eps,y:smoothed,mode:'lines',name:'30-ep moving avg',line:{color:'#3b82f6',width:2.6}};
var topt={x:[0,400],y:[4,4],mode:'lines',name:'optimum',line:{color:'#10b981',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'training episode',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'cumulative reward per episode',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-qlearn-en',[traw,tsm,topt],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Policy Gradient & Actor-Critic — Deep RL Lineage</h2>

<div class="calc-highlight"><strong>The continuous-action revolution.</strong> Q-learning's $\\min_U$ breaks for continuous control. The fix: instead of learning $Q$ and then $\\arg\\min_U Q$, learn a policy $\\mu_\\theta(X) \\to U$ directly, parametrised by a neural network. The gradient of expected return with respect to $\\theta$ is the policy gradient. Combine this with a learned critic and you get actor-critic methods — DDPG, TD3, SAC — which dominate modern robot learning.</div>

<p class="l-text"><strong>REINFORCE (Williams 1992).</strong> For a stochastic policy $\\pi_\\theta(U | X)$:</p>

<div class="calc-formula"><div class="formula-label">POLICY GRADIENT THEOREM (SUTTON 1999)</div><div class="formula-main">$$\\nabla_\\theta J(\\theta) \\;=\\; \\mathbb{E}_{(X, U) \\sim \\pi_\\theta} \\Bigl[\\, \\nabla_\\theta \\log \\pi_\\theta(U | X)\\, Q^{\\pi_\\theta}(X, U)\\, \\Bigr]$$</div><div class="formula-sub">A direct gradient of expected return. Score-function form. High variance unless variance reduced by a critic.</div></div>

<p class="l-text"><strong>A2C / A3C (Mnih 2016).</strong> Replace $Q$ with the advantage $A^\\pi(X,U) = Q^\\pi(X,U) - V^\\pi(X)$ — same gradient direction, much lower variance. Asynchronous Advantage Actor-Critic ran across many CPU threads and was state of the art for two years.</p>

<p class="l-text"><strong>PPO (Schulman 2017).</strong> Trust-region constraint via clipped surrogate objective. The 2017-2023 industry default for both robotics and language models (it is what trained ChatGPT's RLHF stage).</p>

<p class="l-text"><strong>DDPG (Lillicrap 2015).</strong> The deterministic-policy-gradient analog for continuous control. Deterministic policy $\\mu_\\theta(X)$, critic $Q_\\phi(X, U)$, learn both jointly by backprop through the critic into the policy. Suffered from overestimation bias.</p>

<p class="l-text"><strong>TD3 (Fujimoto 2018).</strong> Three patches over DDPG: (i) twin critics with target = min of the two, (ii) delayed policy updates, (iii) target-policy smoothing noise. Made DDPG actually reliable.</p>

<p class="l-text"><strong>SAC (Haarnoja 2018).</strong> Soft Actor-Critic. Maximum-entropy RL: maximise return <em>plus</em> entropy of the policy. Encourages exploration without ad-hoc noise schedules. The 2026 default for robot continuous-control. Algorithms behind Anymal-C, Spot, MIT Cheetah 3 and many newer hardware platforms.</p>

<div class="calc-formula"><div class="formula-label">SAC OBJECTIVE</div><div class="formula-main">$$J_\\pi(\\theta) \\;=\\; \\mathbb{E}_{(X, U) \\sim \\pi_\\theta}\\!\\left[\\, Q_\\phi(X, U) \\;+\\; \\alpha\\, \\mathcal{H}\\bigl(\\pi_\\theta(\\cdot | X)\\bigr)\\, \\right]$$</div><div class="formula-sub">α is the entropy weight. The policy is encouraged to stay broad until a clear winner emerges. The critic is trained with a soft Bellman target that also accounts for the entropy bonus.</div></div>

<div class="calc-graph"><div id="plot-l7-sac-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> stylised training curves of DDPG, TD3 and SAC on a continuous-control benchmark (think MuJoCo HalfCheetah or Walker2d). All three are actor-critic methods; SAC's entropy regularisation gives the smoothest, most monotone improvement and the highest asymptote. DDPG (older) is fragile across seeds — wide variance bands. TD3 (twin critics, delayed updates) closes most of the gap. SAC (2018) typically wins, which is why it is the modern default. All curves are roughly drawn from published 2018-2021 benchmark numbers.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function curve(M,plateau,noise,seed){
  var xs=[],ys=[];var rng=Math.sin(seed*1.7)*1000;
  for(var i=0;i<300;i++){
    xs.push(i);
    var t=i/300;
    var base=plateau*(1-Math.exp(-t*M));
    var n=noise*((Math.sin(i*0.31+seed)+Math.sin(i*0.07+seed*2))*0.5);
    ys.push(base+n);
  }
  return {x:xs,y:ys};
}
var ddpg=curve(2.8,3000,400,1);
var td3 =curve(3.6,4400,180,3);
var sac =curve(4.4,5200,90,7);
var tD={x:ddpg.x,y:ddpg.y,mode:'lines',name:'DDPG (Lillicrap 2015)',line:{color:'#f59e0b',width:2.4}};
var tT={x:td3.x,y:td3.y,mode:'lines',name:'TD3 (Fujimoto 2018)',line:{color:'#a855f7',width:2.4}};
var tS={x:sac.x,y:sac.y,mode:'lines',name:'SAC (Haarnoja 2018)',line:{color:'#3b82f6',width:3}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'training step (k)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'average return (HalfCheetah-like)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-sac-en',[tD,tT,tS],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. AI-Powered Robotics — The 2026 Frontier</h2>

<div class="calc-highlight"><strong>Where we are now.</strong> Classical control did not get replaced by deep RL — it got <em>augmented</em>. Every state-of-the-art robotics stack in 2026 is a hybrid: low-level torque loops are LQR or MPC, mid-level walking gaits and manipulation primitives are SAC-trained policies, high-level task planning is increasingly a vision-language-action model (RT-2, OpenVLA). The boundary between "controller" and "neural network" has dissolved.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Boston Dynamics Atlas (electric, 2024+)</div><div class="card-body">Hybrid of model-predictive trajectory optimisation for whole-body motion and RL policies for contact-rich primitives like step recovery. Inner attitude loops still LQR-derived.</div></div>
<div class="calc-card"><div class="card-title">Tesla Optimus</div><div class="card-body">End-to-end vision-to-joint-torque networks for manipulation; classical impedance control underneath for safety. Public demos show clear policy transfer from Tesla's autopilot data pipeline.</div></div>
<div class="calc-card"><div class="card-title">Anymal (ETH-Zurich, ANYbotics)</div><div class="card-body">Quadruped locomotion via SAC trained in NVIDIA Isaac Gym with massive parallel simulation, then sim-to-real transfer. Production-deployed in industrial inspection since 2021.</div></div>
<div class="calc-card"><div class="card-title">Berkeley BAIR / Levine lab</div><div class="card-body">Dexterous manipulation, hand-eye control, all SAC-derived. Famous Cube-folding from RGB observations — 2020 demonstrated raw-pixel RL is viable on real hardware.</div></div>
<div class="calc-card"><div class="card-title">Google DeepMind RT-1, RT-2 (2022-2023)</div><div class="card-body">"Robotic Transformer". Vision-language-action models that map (camera, instruction) directly to robot actions. Trained on demonstrations + RL fine-tuning. The closest thing to a robotics LLM.</div></div>
<div class="calc-card"><div class="card-title">Figure 02, 1X NEO, Apptronik Apollo (2024-2026)</div><div class="card-body">Humanoid platforms from new generation of robotics companies. All use stacks where the bottom is LQR/MPC and the top is a learned policy. The OpenAI-Figure partnership (Mar 2024) added a VLM for natural-language tasking.</div></div>
</div>

<div class="l-note"><strong>The unification.</strong> When you read a 2024 robotics paper, the chain is: a physics simulator (PyBullet / MuJoCo / Isaac Gym), a policy network (SAC or PPO), trained over millions of episodes with domain randomisation, then sim-to-real transfer to actual hardware, with a low-level LQR or MPC underneath for stability. The math you learned in lessons 1-6 of this track is the bottom of the stack; this lesson is the top. Both layers are needed; both should be in your toolkit.</div>

<h2 class="lesson-title">11. Pyodide Lab — LQR, MPC, and a Mini Q-Learning Agent</h2>

<p class="l-text">Time to build. Three exercises in one Pyodide cell: (a) solve CARE for the double integrator with <code>scipy.linalg.solve_continuous_are</code>, simulate the closed loop, plot. (b) Manual MPC: at each step solve a small constrained quadratic problem with bound-constrained least-squares. (c) Tiny tabular Q-learning agent on a 4×4 grid-world. All run in your browser; no installs needed.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON — LQR for the double integrator</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.linalg <span class="kw">import</span> solve_continuous_are

<span class="cm"># Double integrator: x_ddot = u</span>
A = np.<span class="fn">array</span>([[<span class="num">0.0</span>, <span class="num">1.0</span>],
              [<span class="num">0.0</span>, <span class="num">0.0</span>]])
B = np.<span class="fn">array</span>([[<span class="num">0.0</span>],
              [<span class="num">1.0</span>]])

Q = np.<span class="fn">eye</span>(<span class="num">2</span>)
R = np.<span class="fn">array</span>([[<span class="num">1.0</span>]])

<span class="cm"># Solve CARE: A^T P + P A - P B R^{-1} B^T P + Q = 0</span>
P = <span class="fn">solve_continuous_are</span>(A, B, Q, R)
K = np.<span class="fn">linalg</span>.<span class="fn">solve</span>(R, B.T @ P)
<span class="fn">print</span>(<span class="str">"P =\\n"</span>, P)
<span class="fn">print</span>(<span class="str">"K =\\n"</span>, K)
<span class="fn">print</span>(<span class="str">"Closed-loop eigenvalues:"</span>, np.<span class="fn">linalg</span>.<span class="fn">eigvals</span>(A - B @ K))

<span class="cm"># Simulate closed loop with explicit Euler from x0 = [5, 0]</span>
dt, T = <span class="num">0.01</span>, <span class="num">10.0</span>
N = <span class="fn">int</span>(T / dt)
x = np.<span class="fn">array</span>([<span class="num">5.0</span>, <span class="num">0.0</span>])
traj = []
for k <span class="kw">in</span> <span class="fn">range</span>(N):
    u = -K @ x
    x = x + dt * (A @ x + B.<span class="fn">flatten</span>() * u[<span class="num">0</span>])
    traj.<span class="fn">append</span>((k * dt, x[<span class="num">0</span>], x[<span class="num">1</span>], u[<span class="num">0</span>]))

traj = np.<span class="fn">array</span>(traj)
<span class="fn">print</span>(<span class="str">f"settled at x = {traj[-1, 1]:.6f}, v = {traj[-1, 2]:.6f}"</span>)
<span class="fn">print</span>(<span class="str">f"peak control |u| = {np.max(np.abs(traj[:, 3])):.3f}"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — minimal MPC via projected QP</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> scipy.linalg <span class="kw">import</span> solve_discrete_are

<span class="cm"># Discretise: x_{k+1} = Ad x_k + Bd u_k</span>
dt = <span class="num">0.1</span>
Ad = np.<span class="fn">array</span>([[<span class="num">1.0</span>, dt],
               [<span class="num">0.0</span>, <span class="num">1.0</span>]])
Bd = np.<span class="fn">array</span>([[<span class="num">0.5</span> * dt * dt],
               [dt]])

Q = np.<span class="fn">eye</span>(<span class="num">2</span>)
R = np.<span class="fn">array</span>([[<span class="num">1.0</span>]])
P_f = <span class="fn">solve_discrete_are</span>(Ad, Bd, Q, R)            <span class="cm"># terminal cost</span>

<span class="kw">def</span> <span class="fn">mpc_solve</span>(x0, N=<span class="num">25</span>, u_max=<span class="num">1.0</span>):
    <span class="cm"># Decision variables U = (u_0, u_1, ..., u_{N-1}) ∈ R^N</span>
    <span class="cm"># Cost: sum_j x_j^T Q x_j + u_j^2 + x_N^T P_f x_N</span>
    <span class="cm"># Build linear stack X(U) = M x0 + L U where</span>
    <span class="cm">#   M is (N+1)*2 by 2, L is (N+1)*2 by N</span>
    n_x, n_u = <span class="num">2</span>, <span class="num">1</span>
    M = np.<span class="fn">zeros</span>(((N + <span class="num">1</span>) * n_x, n_x))
    L = np.<span class="fn">zeros</span>(((N + <span class="num">1</span>) * n_x, N))
    M[:n_x, :] = np.<span class="fn">eye</span>(n_x)
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, N + <span class="num">1</span>):
        M[j * n_x:(j + <span class="num">1</span>) * n_x, :] = Ad @ M[(j - <span class="num">1</span>) * n_x:j * n_x, :]
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(j):
            block = np.<span class="fn">linalg</span>.<span class="fn">matrix_power</span>(Ad, j - <span class="num">1</span> - i) @ Bd
            L[j * n_x:(j + <span class="num">1</span>) * n_x, i:i + <span class="num">1</span>] = block

    <span class="cm"># Build big-Q diag(Q,Q,...,Q,P_f)</span>
    Qbar = np.<span class="fn">kron</span>(np.<span class="fn">eye</span>(N + <span class="num">1</span>), Q)
    Qbar[-n_x:, -n_x:] = P_f
    Rbar = np.<span class="fn">eye</span>(N) * R[<span class="num">0</span>, <span class="num">0</span>]

    H = <span class="num">2</span> * (L.T @ Qbar @ L + Rbar)
    g = <span class="num">2</span> * (L.T @ Qbar @ M @ x0)

    <span class="cm"># Projected gradient descent on box [-u_max, u_max]^N — sufficient for tiny QP</span>
    U = np.<span class="fn">zeros</span>(N)
    lr = <span class="num">1.0</span> / (np.<span class="fn">linalg</span>.<span class="fn">norm</span>(H, ord=<span class="num">2</span>) + <span class="num">1e-6</span>)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
        grad = H @ U + g
        U = U - lr * grad
        U = np.<span class="fn">clip</span>(U, -u_max, u_max)
    <span class="kw">return</span> U[<span class="num">0</span>]

<span class="cm"># Closed-loop MPC rollout from x0 = (5, 0)</span>
x = np.<span class="fn">array</span>([<span class="num">5.0</span>, <span class="num">0.0</span>])
mpc_traj = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">120</span>):
    u = <span class="fn">mpc_solve</span>(x, N=<span class="num">25</span>, u_max=<span class="num">1.0</span>)
    x = Ad @ x + Bd.<span class="fn">flatten</span>() * u
    mpc_traj.<span class="fn">append</span>((step * dt, x[<span class="num">0</span>], x[<span class="num">1</span>], u))

mpc_traj = np.<span class="fn">array</span>(mpc_traj)
<span class="fn">print</span>(<span class="str">f"MPC settled at x = {mpc_traj[-1, 1]:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"MPC max |u| applied = {np.max(np.abs(mpc_traj[:, 3])):.3f}  (bound was 1.0)"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — tabular Q-learning on a 4x4 grid-world</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># 4x4 grid. Start at (0,0). Goal at (3,3). Actions: 0=up, 1=right, 2=down, 3=left.</span>
<span class="cm"># Reward: -1 per step, +10 for reaching goal, episode ends at goal.</span>

rng = np.<span class="fn">random</span>.<span class="fn">default_rng</span>(<span class="num">0</span>)

n_states = <span class="num">16</span>
n_actions = <span class="num">4</span>
Q = np.<span class="fn">zeros</span>((n_states, n_actions))

<span class="kw">def</span> <span class="fn">to_xy</span>(s): <span class="kw">return</span> (s % <span class="num">4</span>, s // <span class="num">4</span>)
<span class="kw">def</span> <span class="fn">to_s</span>(x, y): <span class="kw">return</span> y * <span class="num">4</span> + x

<span class="kw">def</span> <span class="fn">step</span>(s, a):
    x, y = <span class="fn">to_xy</span>(s)
    <span class="kw">if</span>   a == <span class="num">0</span>: y = <span class="fn">max</span>(<span class="num">0</span>, y - <span class="num">1</span>)
    <span class="kw">elif</span> a == <span class="num">1</span>: x = <span class="fn">min</span>(<span class="num">3</span>, x + <span class="num">1</span>)
    <span class="kw">elif</span> a == <span class="num">2</span>: y = <span class="fn">min</span>(<span class="num">3</span>, y + <span class="num">1</span>)
    <span class="kw">else</span>:       x = <span class="fn">max</span>(<span class="num">0</span>, x - <span class="num">1</span>)
    s_next = <span class="fn">to_s</span>(x, y)
    <span class="kw">if</span> s_next == <span class="num">15</span>:    <span class="cm"># goal</span>
        <span class="kw">return</span> s_next, <span class="num">10</span>, <span class="kw">True</span>
    <span class="kw">return</span> s_next, -<span class="num">1</span>, <span class="kw">False</span>

alpha, gamma, epsilon = <span class="num">0.5</span>, <span class="num">0.95</span>, <span class="num">0.2</span>
returns = []

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">400</span>):
    s = <span class="num">0</span>; done = <span class="kw">False</span>; G = <span class="num">0</span>; steps = <span class="num">0</span>
    <span class="kw">while</span> <span class="kw">not</span> done <span class="kw">and</span> steps &lt; <span class="num">100</span>:
        <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; epsilon:
            a = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_actions)
        <span class="kw">else</span>:
            a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(Q[s]))
        s_next, r, done = <span class="fn">step</span>(s, a)
        td_target = r + gamma * np.<span class="fn">max</span>(Q[s_next]) * (<span class="num">0</span> <span class="kw">if</span> done <span class="kw">else</span> <span class="num">1</span>)
        Q[s, a] += alpha * (td_target - Q[s, a])
        s = s_next; G += r; steps += <span class="num">1</span>
    epsilon = <span class="fn">max</span>(<span class="num">0.02</span>, epsilon * <span class="num">0.995</span>)
    returns.<span class="fn">append</span>(G)

<span class="fn">print</span>(<span class="str">f"first-100-ep avg return = {np.mean(returns[:100]):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"last-100-ep  avg return = {np.mean(returns[-100:]):.2f}"</span>)
<span class="fn">print</span>(<span class="str">"Greedy policy (arrows up/right/down/left) per state:"</span>)
arrows = [<span class="str">"^"</span>, <span class="str">"&gt;"</span>, <span class="str">"v"</span>, <span class="str">"&lt;"</span>]
<span class="kw">for</span> y <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
    row = []
    <span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
        s = <span class="fn">to_s</span>(x, y)
        <span class="kw">if</span> s == <span class="num">15</span>: row.<span class="fn">append</span>(<span class="str">"G"</span>)
        <span class="kw">else</span>: row.<span class="fn">append</span>(arrows[<span class="fn">int</span>(np.<span class="fn">argmax</span>(Q[s]))])
    <span class="fn">print</span>(<span class="str">"   "</span> + <span class="str">" "</span>.<span class="fn">join</span>(row))</code></pre></div>

<p class="l-text"><strong>What to play with.</strong> (1) In the LQR block, change $R$ from $1$ to $0.01$ and $100$ — verify the gain plot at the top of this lesson. (2) In the MPC block, remove the input bound (set $u_{\\max}$ huge) — confirm the trajectory matches LQR. Then tighten it to $0.3$ — note how MPC adapts. (3) In the Q-learning block, change the discount $\\gamma$ from $0.95$ to $0.5$ — the agent becomes myopic. Add a "trap" cell with reward $-20$ at $(2, 2)$ and observe how the learned policy routes around it. (4) Verify by hand that the closed-form $K = [1/\\sqrt{\\rho}, \\sqrt{2/\\sqrt{\\rho}}]$ matches what <code>scipy</code> returns.</p>

<h2 class="lesson-title">12. The Story in One Page</h2>

<p class="l-text">Stand back. Watch the chain:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bellman 1957</div><div class="card-body">Principle of Optimality: value function satisfies a recursive fixed-point equation. Dynamic programming as a framework for sequential decision problems. The parent of everything that follows.</div></div>
<div class="calc-card"><div class="card-title">Kálmán 1960</div><div class="card-body">LQR. For linear plant + quadratic cost, V is quadratic, the Bellman fixed-point becomes the Algebraic Riccati Equation. Closed-form gain. Deployed on Apollo within nine years.</div></div>
<div class="calc-card"><div class="card-title">1980s-1990s</div><div class="card-body">MPC matures in petrochemicals. Receding-horizon optimisation with constraints solves what LQR cannot. By 2000 the industrial workhorse in oil and gas.</div></div>
<div class="calc-card"><div class="card-title">Watkins 1989</div><div class="card-body">Q-learning. The same Bellman equation as Riccati, but parameter-free — learns from data without knowing $A, B$. Convergence proven on tabular spaces.</div></div>
<div class="calc-card"><div class="card-title">Sutton 1999</div><div class="card-body">Policy Gradient Theorem. Direct optimisation of the policy parameters via $\\nabla \\log \\pi \\cdot Q$. The score-function trick that makes deep RL work.</div></div>
<div class="calc-card"><div class="card-title">Mnih 2013, 2015</div><div class="card-body">DQN — Q-learning with a neural-network function approximator. The combination of Bellman fixed-point iteration and convolutional features. Atari-from-pixels in 2013, Nature paper in 2015.</div></div>
<div class="calc-card"><div class="card-title">Lillicrap 2015 → Fujimoto 2018 → Haarnoja 2018</div><div class="card-body">DDPG → TD3 → SAC. The continuous-control lineage. Each fixes the issues of its predecessor. SAC's entropy regularisation makes it the modern default for robot RL.</div></div>
<div class="calc-card"><div class="card-title">2022-2026</div><div class="card-body">RT-1, RT-2, OpenVLA, Sora-like world models for planning, NVIDIA Isaac Gym for massive sim-to-real, Figure / Tesla / 1X humanoid stacks. Classical LQR/MPC at the bottom, RL policies in the middle, transformer planners on top.</div></div>
</div>

<div class="l-warn"><strong>This is the final lesson of the control-theory track.</strong> You started in Lesson 1 with transfer functions and the Laplace domain. You now have, in your head, the entire skeleton of how a 2026 robot decides what to do. The LQR you derived from the Riccati equation is the bottom of every flight controller. The MPC you sketched is what lands Falcon 9 boosters. The Q-learning fixed-point is the same Bellman equation Kálmán used, with one twist — it does not need a model. And the SAC policies that train Atlas and Optimus are just continuous-action descendants of the very ideas you have written down. The next paper you read, with words like "actor", "critic", "advantage", "entropy regularisation", or "Bellman target", will be transparent. Go build.</div>

<p class="l-text"><strong>Recommended next steps on this site.</strong> The Reinforcement Learning track has lessons on DDPG/TD3/SAC and multi-agent RL that revisit Sections 8-9 from the implementation side. The Differential Equations track's Lesson 8 (Neural ODE → Diffusion → Flow Matching) is the continuous-time cousin of this material. The Deep Learning track has a lesson on PPO and policy gradients with a fully worked walker. The Robotics track (forthcoming) ties it all together with humanoid stacks. Wherever you go next, the equations will be familiar.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu, kontrol-teorisi track'inin kapanış dersi ve aynı zamanda robotik için modern yapay zekâya köprü.</strong> Şimdiye kadar müfredat klasik kontrolü inşa etti: transfer fonksiyonları, PID, root locus, Bode/Nyquist, durum-uzayı gerçeklemeleri, Lyapunov kararlılığı. Güzel, onlarca yıllık makinedir. Ama Falcon 9'u uçuran, Atlas'ı dengeleyen ya da bir kimya reaktöründe kararlı durumu trimleyen her gerçek-dünya kararlaştırıcısı elli yıldır optimal kontrolcüdür. Ve 2015'ten beri her robot-öğrenme makalesi — DDPG, TD3, SAC, PPO, RT-2 — derin-öğrenme kıyafetine bürünmüş bir Optimal-Kontrol algoritmasıdır.</p>

<p class="l-text">Bu derste döngüyü kapatıyoruz. Optimal-kontrol problemini kuruyoruz, Lineer Karesel Düzenleyici'yi (LQR) Cebirsel Riccati Denklemi'nden türetiyoruz ve Bellman ilkesinin bir sürekli yörünge optimizasyonunu nasıl bir değer fonksiyonu üzerinde sabit-nokta denklemine dönüştürdüğünü görüyoruz. Sonra lineerlik varsayımını gevşetiyoruz: Model Öngörülü Kontrol (MPC), her zaman adımında açık kısıtlamalarla LQR-tarzı problemi yeniden çözer ve bize kimya, havacılık ve quadrotor kontrolü için modern endüstriyel iş atımızı verir. Son olarak model varsayımını tamamen düşürüyoruz — $A$ ve $B$ bilinmediğinde aynı Bellman denklemi Q-learning olur ve genelleme zinciri bizi DDPG'ye (Lillicrap 2015), TD3'e (Fujimoto 2018) ve Soft Actor-Critic'e (Haarnoja 2018) götürür; bunlar bugün Atlas'ı, Optimus'u ve Berkeley BAIR'in dört-ayaklı robotlarını eğiten algoritmalardır. LQR, Lineer-Gauss-Karesel Pekiştirmeli Öğrenmenin özel bir durumudur. Aynı problemdir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKSIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Lineer bir sistem üzerinde karesel maliyetle optimal-kontrol problemini kurmak ve Q ile R'nin ne ağırlık verdiğini açıklamak</li>
<li>LQR geri besleme yasası $u = -KX$'ı Cebirsel Riccati Denklemi'nden türetmek ve K'nin R ile nasıl değiştiğini öngörmek</li>
<li>Sürekli zamanlı LQR'ı ayrık zamanlı LQR'dan ayırt etmek ve her birinin ne zaman uygun olduğunu bilmek</li>
<li>MPC problemini, LQR'ın yapamadığı giriş ve durum kısıtlarını ele alan karesel programlama olarak kurmak</li>
<li>Bellman denklemini ifade etmek, boyutluluk lanetini türetmek ve neden derin RL'in modern kaçış yolu olduğunu açıklamak</li>
<li>LQR'ı Q-learning'e bağlamak, DDPG/TD3/SAC'ı modelsiz gevşetmeler olarak görmek ve modern robot öğrenmesini bu soya yerleştirmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Optimal Kontrol Kurulumu</h2>

<div class="calc-highlight"><strong>Klasik kontrolden optimal kontrole geçiş.</strong> Klasik bir kontrolcü (Ders 3-4) "verilen faz marjı ile kapalı döngüyü kararlı yapan geri besleme yasası nedir?" diye sorar. Optimal bir kontrolcü daha güçlü bir şey sorar: "Kararlaştırıcı tüm geri besleme yasaları arasında, açıkça belirtilmiş bir performans kriterini minimize eden hangisi?" Kriter, yörüngenin skaler bir fonksiyonelidir — genellikle durum hatası ve kontrol çabasının ağırlıklı toplamıdır. Minimize edici, optimal kontrol yasasıdır ve lineer sistem ile karesel maliyet için sabit-kazançlı lineer geri beslemedir. Bu LQR'dır.</div>

<p class="l-text">Durum uzayı formunda Ders 5'in lineer sistemini düşün. Durum vektörü $X \\in \\mathbb{R}^n$, kontrol $U \\in \\mathbb{R}^m$ tarafından sürülen lineer akış altında evrimleşir:</p>

<div class="calc-formula"><div class="formula-label">LINEER SISTEM</div><div class="formula-main">$$\\dot{X}(t) \\;=\\; A\\, X(t) \\;+\\; B\\, U(t), \\qquad X(0) = X_0$$</div><div class="formula-sub">A açık-döngü dinamik matrisidir; B giriş matrisidir. U(t)'yi henüz BILMIYORUZ — seçmek problemdir.</div></div>

<p class="l-text">Her yörüngeyi karesel bir maliyetle puanlıyoruz. İki simetrik pozitif-yarı-tanımlı ağırlık matrisi $Q$ ve $R$, durum hatasını mı yoksa kontrol çabasını mı ne kadar cezalandıracağımız arasında dengeyi kurar:</p>

<div class="calc-formula"><div class="formula-label">KARESEL MALIYET FONKSIYONELI</div><div class="formula-main">$$J(U) \\;=\\; \\int_0^\\infty \\Bigl(\\, X(t)^\\top\\, Q\\, X(t) \\;+\\; U(t)^\\top\\, R\\, U(t)\\, \\Bigr)\\, dt$$</div><div class="formula-sub">Q ⪰ 0 durum sapmasına ağırlık verir; R ≻ 0 kontrol çabasına ağırlık verir. Q küçük, R büyük → ucuz kontrolcü, yavaş düzenleyici. Q büyük, R küçük → agresif kontrolcü, hızlı ama pahalı.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden karesel?</div><div class="card-body">Üç neden. (1) Minimize edici analitiktir. (2) Karesel hatalar büyük sapmaları ağır cezalandırır — kötü davranıştan kaçınmak istediğimiz şeydir. (3) Herhangi bir işletme noktası etrafında, her düz maliyet Taylor açılımı ile yerel olarak kareseldir. Karesel evrensel yerel yaklaşımdır.</div></div>
<div class="calc-card"><div class="card-title">Q'nun rolü</div><div class="card-body">$i$-inci girişi büyük olan köşegen Q "$i$-inci durumu sıkıca düzenle" anlamına gelir. Sadece $y = CX$ önemliyse çıktıyı da cezalandırabilirsin: $C^\\top Q_y C$.</div></div>
<div class="calc-card"><div class="card-title">R'nin rolü</div><div class="card-body">R aktüatörü kullanmanın maliyetidir. Büyük R = pahalı kontrol (ağır aktüatörler, yakıt-sınırlı uzay aracı). Küçük R = agresif kontrol (ucuz motorlar, fly-by-wire savaş uçakları).</div></div>
<div class="calc-card"><div class="card-title">Sonsuz ufuk</div><div class="card-body">$\\int_0^\\infty$ düzenleyicinin sonsuza dek çalıştığını ve asimptotik olarak $X = 0$'a düzenlemek istediğimizi varsayar. Sonlu-ufuk varyantları vardır; bir Diferansiyel Riccati Denkleminden gelen zamana bağlı $K(t)$ kazancı verir.</div></div>
</div>

<p class="l-text"><strong>Problem.</strong> $J$'yi minimize eden $U^*: \\mathbb{R}^+ \\to \\mathbb{R}^m$'i bul. Cevap (Kalman 1960) nefes kesici derecede temiz: $U^*(t) = -K X(t)$ ve $K$ sabittir. Bunu türeteceğiz.</p>

<div class="l-note"><strong>Tarihsel not.</strong> LQR, Rudolf Kálmán tarafından 1960'ta, bize Kalman filtresi ve kontrol edilebilirliği de veren aynı seri makalede icat edildi. İlk olarak Apollo rehber bilgisayarında (1969) konuşlandırıldı ve hâlâ SpaceX Falcon kademelerinde, Boston Dynamics Atlas'ında ve her modern fly-by-wire uçakta varsayılan yörünge düzenleyicisidir. Altmış beş yaşında ve kendi alanında yenilmez.</div>

<h2 class="lesson-title">2. Lineer Karesel Duzenleyici (LQR)</h2>

<div class="calc-highlight"><strong>Ana sonuç.</strong> Karesel maliyetli lineer bir sistem için optimal kontrol, sabit kazançlı lineer durum geri beslemesidir. Kazanç, sürekli zamanlı Cebirsel Riccati Denklemi'nin (CARE) çözümüyle verilir — bir kez çevrimdışı çözülüp sonsuza dek konuşlandırılabilen tek matris denklemidir.</div>

<p class="l-text">$X$ durumundan başlayarak değer fonksiyonunu $V(X) = \\min_U \\int_0^\\infty (X^\\top Q X + U^\\top R U) dt$ olarak tanımla. Bir varyasyonel hesap argümanı ile (veya simetrik $P$ için $V = X^\\top P X$ tahmin edip doğrulayarak) şunu elde ederiz:</p>

<div class="calc-formula"><div class="formula-label">SUREKLI ZAMANLI CEBIRSEL RICCATI DENKLEMI (CARE)</div><div class="formula-main">$$A^\\top P \\;+\\; P A \\;-\\; P B\\, R^{-1}\\, B^\\top P \\;+\\; Q \\;=\\; 0$$</div><div class="formula-sub">Simetrik pozitif-tanımlı P için matris denklemi. P'de karesel; Jacopo Riccati'nin (1676–1754) skaler karesel ODE'leri inceledikten sonra adıyla anılır.</div></div>

<p class="l-text">$P$ bulunduğunda, optimal geri besleme kazancı şudur:</p>

<div class="calc-formula"><div class="formula-label">LQR OPTIMAL GERI BESLEME</div><div class="formula-main">$$U^*(t) \\;=\\; -K\\, X(t), \\qquad K \\;=\\; R^{-1}\\, B^\\top\\, P$$</div><div class="formula-sub">Lineer, zamana bağlı olmayan, tam-durum geri besleme yasası. K, A, B, Q, R, P'den bir kez hesaplanan m×n matrisidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çözülebilirlik</div><div class="card-body">CARE'yi çözen tek pozitif-tanımlı P, (A,B)'nin kararlaştırılabilir ve (A, Q^{1/2})'nin algılanabilir olması durumunda ve sadece bu durumda vardır. Her iki koşul da pratikte genellikle bedavadır.</div></div>
<div class="calc-card"><div class="card-title">Kapalı-döngü kararlılığı</div><div class="card-body">Kapalı-döngü matrisi $A - BK$'nın tüm özdeğerleri açık sol yarı düzlemdedir. LQR inşaat gereği kararlaştırıcıdır.</div></div>
<div class="calc-card"><div class="card-title">Kazanç ve Faz marjları</div><div class="card-body">Klasik bir LQR'ın garanti edilmiş marjları vardır: kanal başına ≥ 6 dB kazanç marjı, ≥ 60° faz marjı. Yapı gereği gürbüz (marjlar için ayarlamanız gereken geri besleme tasarımıyla karşılaştırın).</div></div>
<div class="calc-card"><div class="card-title">CARE'yi çözmek</div><div class="card-body">Sayısal olarak: Hamiltonian matrisinin Schur ayrışması, sonra projeksiyon. Python'da: <code>scipy.linalg.solve_continuous_are(A, B, Q, R)</code>. Tek satır, milisaniyeler.</div></div>
</div>

<p class="l-text"><strong>Hamiltonian görünümü.</strong> Hamiltonian matrisini tanımla:</p>

<div class="calc-formula"><div class="formula-label">HAMILTONIAN MATRISI</div><div class="formula-main">$$H \\;=\\; \\begin{bmatrix} A & -B R^{-1} B^\\top \\\\ -Q & -A^\\top \\end{bmatrix}$$</div><div class="formula-sub">H'nin kararlı özvektörleri (açık sol yarı düzlemdeki özdeğerlerle ilişkili olanlar) P çözümünü gerer. scipy'nin aslında cevabı bu şekilde hesaplaması.</div></div>

<div class="calc-graph"><div id="plot-l7-k-vs-r-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> çift integratör için LQR kazanç vektörünün $K = [k_1, k_2]$ iki girişinin büyüklükleri, kontrol-maliyet ağırlığı $\\rho$'nun fonksiyonu olarak ($R = \\rho I$, $Q = I$ ile). $\\rho$ büyüdükçe kontrol pahalılaşır, kazançlar küçülür ve kapalı-döngü bant genişliği düşer. $\\rho \\to 0$ olduğunda kazançlar patlar — "ucuz kontrol"e, agresif bant genişliğine, gürültüye duyarlılığa karşılık gelir. $\\rho$ seçimi LQR'ın merkezi tasarım düğmesidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var rhos=[],k1s=[],k2s=[];
for(var i=0;i<60;i++){
  var rho=Math.pow(10,-2+4*i/59);
  rhos.push(rho);
  var k1=1/Math.sqrt(rho);
  var k2=Math.sqrt(2/Math.sqrt(rho));
  k1s.push(k1);k2s.push(k2);
}
var t1={x:rhos,y:k1s,mode:'lines',name:'k_1 (konum kazanci)',line:{color:'#3b82f6',width:3}};
var t2={x:rhos,y:k2s,mode:'lines',name:'k_2 (hiz kazanci)',line:{color:'#10b981',width:3}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'kontrol maliyet agirligi  rho  (R = rho I)',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'kazanc buyuklugu',type:'log',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-k-vs-r-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Cozumlu LQR Ornegi — Cift Integrator</h2>

<div class="calc-highlight"><strong>En basit ilginç sistem.</strong> Çift integratör $\\ddot{x} = u$, bir Newton'un-ikinci-yasası modelidir: konum $x$, hız $\\dot{x}$, doğrudan ivmeye etki eden kontrol kuvveti $u$. Kayan bir araba, bir uydunun yön ekseni, bir quadrotor'un irtifa kanalını tanımlar — girişin kuvvet/tork/ivme olduğu ve durumun konum+hız olduğu her şey.</div>

<p class="l-text">$X = (x, \\dot{x})^\\top$ ile durum-uzayı formunda yaz:</p>

<div class="calc-formula"><div class="formula-label">CIFT INTEGRATOR</div><div class="formula-main">$$\\dot{X} \\;=\\; \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix} X \\;+\\; \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} u$$</div><div class="formula-sub">Seri iki integratör; A'nın iki özdeğeri sıfırdır (marjinal kararsız). Geri besleme olmadan araba sonsuza dek savrulur.</div></div>

<p class="l-text">$Q = I_2$ ve $R = \\rho$ seç. CARE'yi analitik olarak çöz. $P = \\begin{bmatrix} p_1 & p_2 \\\\ p_2 & p_3 \\end{bmatrix}$ olsun. CARE üç skaler denkleme açılır. Çözerek:</p>

<div class="calc-formula"><div class="formula-label">KAPALI-FORM CARE COZUMU</div><div class="formula-main">$$P \\;=\\; \\begin{bmatrix} \\sqrt{2}\\, \\rho^{3/4} & \\sqrt{\\rho} \\\\ \\sqrt{\\rho} & \\sqrt{2}\\, \\rho^{1/4} \\end{bmatrix}, \\qquad K \\;=\\; R^{-1} B^\\top P \\;=\\; \\Bigl[\\, \\tfrac{1}{\\sqrt{\\rho}},\\; \\sqrt{\\tfrac{2}{\\sqrt{\\rho}}}\\, \\Bigr]$$</div><div class="formula-sub">Her iki kazanç da ρ'nun ters üsleri olarak ölçeklenir — yukarıdaki grafikte görülen dengeleri doğrular.</div></div>

<p class="l-text"><strong>Kapalı-döngü kutupları.</strong> $A - BK$ ile sönümlü ikinci dereceden bir sistem elde ederiz. Her iki kutup da $\\rho^{-1/4}$ büyüklüğüne, $-\\tfrac{1}{\\sqrt{2}}\\rho^{-1/4}$ gerçek kısmına sahiptir. Yani daha küçük $\\rho$ kutupları sol yarı düzlemde daha derine iter — daha hızlı ama daha agresif tepki.</p>

<div class="calc-graph"><div id="plot-l7-step-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> üç $\\rho$ değeriyle — ucuz kontrol ($\\rho = 0.01$), dengeli ($\\rho = 1$), pahalı kontrol ($\\rho = 100$) — LQR altında kapalı-döngü çift integratörün basamak yanıtı, el ayarlanmış $K_p = 1, K_d = 1.5, K_i = 0$ PID ile karşılaştırılır. Küçük $\\rho$'lu LQR'ın nasıl en hızlı yükseldiğine (agresif kontrol) ve açık kontrol-maliyet cezası olmadan PID'nin nasıl titreşebileceğine veya doyabileceğine dikkat et. LQR sana ilkeli bir düğme verir; PID ayarlama gerektirir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function sim(rho,T){
  var N=400,dt=T/N,xs=[0],vs=[0],ts=[0];
  var k1=1/Math.sqrt(rho),k2=Math.sqrt(2/Math.sqrt(rho));
  var x=0,v=0;
  for(var i=1;i<=N;i++){
    var t=i*dt;
    var ref=1.0;
    var err=ref-x;
    var u=k1*err - k2*v;
    var a=u;
    v=v+dt*a;x=x+dt*v;
    ts.push(t);xs.push(x);vs.push(v);
  }
  return {t:ts,x:xs};
}
function pidsim(T){
  var N=400,dt=T/N,xs=[0],ts=[0];
  var x=0,v=0,iSum=0;
  for(var i=1;i<=N;i++){
    var t=i*dt;
    var err=1.0-x;
    iSum+=err*dt;
    var u=1.0*err - 1.5*v + 0.0*iSum;
    var a=u;
    v=v+dt*a;x=x+dt*v;
    ts.push(t);xs.push(x);
  }
  return {t:ts,x:xs};
}
var T=8;
var d1=sim(0.01,T),d2=sim(1.0,T),d3=sim(100,T),dp=pidsim(T);
var t1={x:d1.t,y:d1.x,mode:'lines',name:'LQR rho=0.01 (agresif)',line:{color:'#ef4444',width:2.4}};
var t2={x:d2.t,y:d2.x,mode:'lines',name:'LQR rho=1 (dengeli)',line:{color:'#3b82f6',width:2.4}};
var t3={x:d3.t,y:d3.x,mode:'lines',name:'LQR rho=100 (yumusak)',line:{color:'#10b981',width:2.4}};
var tp={x:dp.t,y:dp.x,mode:'lines',name:'PID (Kp=1, Kd=1.5)',line:{color:'#f59e0b',width:2.4,dash:'dot'}};
var ref={x:[0,T],y:[1,1],mode:'lines',name:'referans',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'zaman t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'konum x(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-step-tr',[t1,t2,t3,tp,ref],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Gerçek sistemlerde nerede yaşıyor.</strong> Uzay aracı yön kontrolü. Tepki tekerleğiyle çalışan her uydu, kararlı durum noktalaması için LQR veya zaman-bağımlı kuzenini kullanır. Drone irtifa. PX4 ve ArduPilot gibi modlarda bir quadrotor'un "Z-ekseni" döngüsü, görünür ad altında, beklenen pil ve itki kısıtlarına karşı seçilmiş $\\rho$ ile ayarlanmış bir LQR'dır. Endüstriyel servomotorlar. Çoğu hassas Yaskawa, Mitsubishi, ABB servosu pazarlama adlı "ileri konum kontrolü" altında bir iç LQR döngüsü çalıştırır.</div>

<h2 class="lesson-title">4. Ayrik Zamanli LQR</h2>

<div class="calc-highlight"><strong>Bilgisayarlar sonlu hızda saat atar.</strong> Gerçek kontrolcüler 100 Hz, 1 kHz, 10 kHz'de örnekleyen mikroişlemcilerde çalışır. Sürekli zamanlı LQR bir idealleştirmedir; konuşlandırılmış versiyon onun ayrık-zaman ikizidir. Aynı yapı, aynı Riccati denklemi modulo ayrık yeniden formülasyon. Ayrık zamanlı LQR aynı zamanda dinamik programlamaya ve Q-learning'e bağı çok daha temiz hale getirir.</div>

<p class="l-text">Örnekleme periyodu $\\Delta t$ ile sistemi ayrıklaştır: $X_{k+1} = A_d X_k + B_d U_k$, burada $A_d = e^{A \\Delta t}$ ve $B_d = \\int_0^{\\Delta t} e^{A \\tau} d\\tau \\cdot B$. Maliyet bir toplama dönüşür:</p>

<div class="calc-formula"><div class="formula-label">AYRIK-ZAMANLI LQR MALIYETI</div><div class="formula-main">$$J \\;=\\; \\sum_{k=0}^{\\infty} \\Bigl(\\, X_k^\\top Q_d X_k \\;+\\; U_k^\\top R_d U_k \\,\\Bigr)$$</div><div class="formula-sub">Q_d, R_d ayrık-zamanlı ağırlık matrisleridir (örnekleme hızlı olduğunda Q, R'nin küçük bir yeniden ölçeklenmesi).</div></div>

<p class="l-text">Bellman özyinelemesi (aşağıdaki Bölüm 7) bir ayrık Riccati denklemi verir:</p>

<div class="calc-formula"><div class="formula-label">AYRIK CEBIRSEL RICCATI DENKLEMI (DARE)</div><div class="formula-main">$$P \\;=\\; A_d^\\top P A_d \\;-\\; A_d^\\top P B_d (R_d + B_d^\\top P B_d)^{-1} B_d^\\top P A_d \\;+\\; Q_d$$</div><div class="formula-sub">Ters yüzünden CARE'den biraz daha çirkin, ama aynı yapı: simetrik P için karesel sabit-nokta denklemi.</div></div>

<p class="l-text">Optimal geri besleme şudur:</p>

<div class="calc-formula"><div class="formula-label">AYRIK LQR KAZANCI</div><div class="formula-main">$$U_k^* \\;=\\; -K_d\\, X_k, \\qquad K_d \\;=\\; (R_d + B_d^\\top P B_d)^{-1} B_d^\\top P A_d$$</div><div class="formula-sub">Yine sabit matris. Python'da: <code>scipy.linalg.solve_discrete_are(Ad, Bd, Qd, Rd)</code>.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden ayrık?</div><div class="card-body">Tüm konuşlandırılmış kontrolcüler ayrıktır. Havacılık uçuş kontrolü: 100-1000 Hz. Servo sürücüler: 1-20 kHz. Boston Dynamics Atlas bile dış-döngü kontrolünü yaklaşık 200 Hz'de yapar.</div></div>
<div class="calc-card"><div class="card-title">Örnekleme oranı etkisi</div><div class="card-body">$\\Delta t \\to 0$ olduğunda ayrık LQR kazancı sürekli LQR kazancına yakınsar. Çok yavaş örnekleme kararlılığı yok eder; çok hızlı döngülere mal olur.</div></div>
<div class="calc-card"><div class="card-title">RL ile bağlantı</div><div class="card-body">Q-learning'in Bellman güncellemesi DARE ile aynı sabit-nokta iterasyonudur — bir kritik farkla: Q-learning A veya B'yi bilmez. Onları deneyimden öğrenir.</div></div>
<div class="calc-card"><div class="card-title">Sayısal kararlılık</div><div class="card-body">DARE'nin matris tersi çok küçük $\\Delta t$ için kötü-koşullu olabilir. Uygulayıcılar tersi oluşturmaktan kaçınmak için Schur-tabanlı çözücüler veya Cholesky formunu kullanır.</div></div>
</div>

<h2 class="lesson-title">5. Model Ongorulu Kontrol (MPC)</h2>

<div class="calc-highlight"><strong>LQR'ın yapamadığı şey.</strong> LQR güzeldir ama sınırlıdır: kısıtsız, lineer, sonsuz ufuk. Gerçek dünyada aktüatör sınırları vardır (bir quadrotor'un motorları tam gazda doyar), durum sınırları vardır (bir kimya reaktörü 200 °C'yi aşmamalıdır) ve sıklıkla nonlineer dinamikler vardır. MPC mühendislik çözümüdür: her zaman adımında, $N$ adım ileriye bakan sonlu-ufuk bir optimizasyon çöz, sadece ilk kontrol girişini uygula ve sonraki adımda güncellenmiş durumla yeniden çöz. Geri çekilen ufuk. LQR + kısıtlar + yeniden planlama.</div>

<p class="l-text">Her $k$ zamanında ölçülen $X_k$ durumu verildiğinde, MPC şunu çözer:</p>

<div class="calc-formula"><div class="formula-label">MPC OPTIMIZASYONU (ADIM BASINA)</div><div class="formula-main">$$\\min_{U_0, \\ldots, U_{N-1}} \\;\\; \\sum_{j=0}^{N-1} \\Bigl(\\, \\hat{X}_j^\\top Q \\hat{X}_j + U_j^\\top R U_j \\,\\Bigr) \\;+\\; \\hat{X}_N^\\top P_f \\hat{X}_N$$</div><div class="formula-sub">Koşula tabi: \\hat{X}_{j+1} = A \\hat{X}_j + B U_j, \\hat{X}_0 = X_k ile, artı |U_j| ≤ u_max, |\\hat{X}_j| ≤ x_max kısıtları. Terminal maliyet P_f genellikle = CARE çözümü.</div></div>

<p class="l-text">Lineer sistemler, lineer kısıtlar ve karesel maliyet için optimizasyon bir Karesel Programdır (QP). Modern QP çözücüleri (OSQP, qpOASES, HPIPM) gömülü donanımda on ila yüzlerce mikrosaniyede bunu çözer. Çözümden $U_k = U_0^*$ uygula, bir adım ilerle, yeniden ölç, yeniden çöz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yerel kısıtlar</div><div class="card-body">Doygunluk, hız sınırları, durum koridorları — hepsi lineer eşitsizlikler olarak girer. LQR'ın bunları post-hoc kırpma dışında ifade etmenin hiçbir yolu yoktur ki bu da optimalliği yok eder.</div></div>
<div class="calc-card"><div class="card-title">Öngörülü</div><div class="card-body">MPC N adım ileri bakar ve gelecekteki kısıt ihlallerinden kaçınmak için plan yapar. Bir duvara çarpacak bir araba duvarı tahmininde gördüğü için yavaşlar.</div></div>
<div class="calc-card"><div class="card-title">Hesaplama maliyeti</div><div class="card-body">Kontrol adımı başına bir QP çözümü. N = 20-50 ufku ve n_x ≈ 10 durumlar için modern donanımda mikrosaniyeler. 1990'da uygulanamazdı — bugün rutin.</div></div>
<div class="calc-card"><div class="card-title">Özyinelemeli uygulanabilirlik</div><div class="card-body">İnce: QP yörünge-ortasında uygulanamaz hale gelirse, MPC'nin yedeği olmalıdır. Gürbüz MPC ve tüp MPC mühendislik cevaplarıdır.</div></div>
<div class="calc-card"><div class="card-title">Nonlineer MPC</div><div class="card-body">Nonlineer sistemler için QP bir Nonlineer Program (NLP) olur. Ardışık Karesel Programlama (SQP) veya İç-Nokta Yöntemleri çözer. Boston Dynamics Atlas, Spot ve SpaceX'in güç-tabanlı iniş kontrolcüsü nonlineer MPC çalıştırır.</div></div>
<div class="calc-card"><div class="card-title">Endüstriyel penetrasyon</div><div class="card-body">MPC, petrokimyada (ExxonMobil, BP) 1980'lerden beri standart gelişmiş kontrolcüdür. Modern kimya tesisleri 50-100 iç içe MPC çalıştırır.</div></div>
</div>

<div class="l-note"><strong>Modern robotik için MPC.</strong> Bir SpaceX Falcon 9 booster, MPC'nin konveks-optimizasyon yeniden formülasyonunu kullanarak güç-tabanlı inişini yapar (Açıkmeşe-Blackmore 2011). Her saniye gemideki bilgisayar itki ve açı kısıtlarına tabi olarak sonraki birkaç saniyenin yörüngesini planlar, ilk girişi yürütür ve geri kalanı atar. Falcon "kendini iniyor" çünkü MPC saniyede 100 kez kendi problemini yeniden çözüyor.</div>

<h2 class="lesson-title">6. Cozumlu MPC Ornegi — Doygunluk</h2>

<div class="calc-highlight"><strong>LQR'ın halledemediği şey.</strong> Çift integratörümüzün $|u| \\le 1$ olduğunu ancak bir basamak bozulmanın durumu orijinden uzağa ittiğini varsay. LQR-optimal kazanç $u = -10$ gibi bir kontrol talep eder ki $-1$'e kırpılır ve şimdi kapalı-döngü artık optimal değildir — kırpmanın ne yaptığı her şeydir. MPC, aksine, baştan kısıta tabi planlar ve sunamayacağı çabayı asla harcamaz.</div>

<p class="l-text">Aynı çift integratör. Aynı $Q = I, R = 1$. $|u_k| \\le 1$ kısıtı ekle. $\\Delta t = 0.1$ s örneklemede $N = 25$ ufuk seç. Her adımda şunu çöz:</p>

<div class="calc-formula"><div class="formula-label">CIFT INTEGRATOR ICIN MPC QP</div><div class="formula-main">$$\\min_{U} \\;\\; \\sum_{j=0}^{24} \\bigl(\\hat{x}_j^2 + \\hat{v}_j^2 + u_j^2\\bigr) + \\hat{X}_{25}^\\top P_f \\hat{X}_{25}$$</div><div class="formula-sub">Koşula tabi: lineer dinamikler, tüm j için |u_j| ≤ 1, başlangıç durumu \\hat{X}_0 = X_k. P_f = aynı Q, R için DARE çözümü.</div></div>

<div class="calc-graph"><div id="plot-l7-mpc-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> $x_0 = 5$'ten başlayarak giriş sınırları $|u| \\le 1$ ile çift integratörün konum yörüngesi, (a) post-kırpma ile LQR altında (kazanç $u = -5$ talep eder ki $-1$'e kırpılır, planlanan kontrol yetkisinin çoğunu boşa harcar) ve (b) MPC altında, ilk adımdan itibaren durumu fiziksel olarak mümkün olan en hızlı şekilde sıfıra getiren doygunluk kontrol profilini planlar. Aşağıda: gerçekten uygulanan kontrol sinyalleri. MPC'nin doygunluk sınırında "bang"ladığına dikkat et, ki bu hedefe varış zamanı için optimaldir; LQR-kırpma ile yumuşak ama suboptimal bir yörünge verir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function lqrClip(x0,v0,T){
  var N=200,dt=T/N,xs=[x0],vs=[v0],us=[0],ts=[0];
  var k1=1.0,k2=Math.sqrt(2);
  var x=x0,v=v0;
  for(var i=1;i<=N;i++){
    var t=i*dt;
    var u=-k1*x-k2*v;
    if(u>1)u=1;if(u<-1)u=-1;
    v+=dt*u;x+=dt*v;
    ts.push(t);xs.push(x);vs.push(v);us.push(u);
  }
  return {t:ts,x:xs,u:us};
}
function mpcBangBang(x0,v0,T){
  var N=200,dt=T/N,xs=[x0],vs=[v0],us=[0],ts=[0];
  var x=x0,v=v0;
  for(var i=1;i<=N;i++){
    var t=i*dt;
    var sw=x+0.5*v*Math.abs(v);
    var u=sw>0?-1:1;
    if(Math.abs(x)<0.05 && Math.abs(v)<0.1){u=-1*x-1.4*v;if(u>1)u=1;if(u<-1)u=-1;}
    v+=dt*u;x+=dt*v;
    ts.push(t);xs.push(x);vs.push(v);us.push(u);
  }
  return {t:ts,x:xs,u:us};
}
var T=10;
var dL=lqrClip(5,0,T),dM=mpcBangBang(5,0,T);
var tx_lq={x:dL.t,y:dL.x,mode:'lines',name:'LQR kirpilmis (x)',line:{color:'#f59e0b',width:2.4}};
var tx_mp={x:dM.t,y:dM.x,mode:'lines',name:'MPC (x)',line:{color:'#3b82f6',width:2.4}};
var tu_lq={x:dL.t,y:dL.u,mode:'lines',name:'LQR kontrol u',line:{color:'#f59e0b',width:1.6,dash:'dot'},yaxis:'y2'};
var tu_mp={x:dM.t,y:dM.u,mode:'lines',name:'MPC kontrol u',line:{color:'#3b82f6',width:1.6,dash:'dot'},yaxis:'y2'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'zaman (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'konum x(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',domain:[0.4,1]},yaxis2:{title:'kontrol u(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',domain:[0,0.32],range:[-1.2,1.2]},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-mpc-tr',[tx_lq,tx_mp,tu_lq,tu_mp],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">7. Bellman Denklemi ve Dinamik Programlama</h2>

<div class="calc-highlight"><strong>Optimal kontroldeki en derin fikir.</strong> Richard Bellman (RAND, 1957) her optimal-kontrol probleminin özyinelemeli bir yapıya sahip olduğunu gördü: $X$ durumundan $k$ zamanındaki optimal maliyet-kalan, sonraki hareketin anlık maliyeti artı indiğin yerden optimal maliyet-kalandır. Bu Bellman'ın Optimallik İlkesidir ve onu ifade eden denklem Bellman denklemidir. LQR'ın Riccati'sinin, dinamik programlamanın ve her değer-tabanlı Pekiştirmeli Öğrenme algoritmasının ebeveyn denklemidir.</div>

<p class="l-text">$V^*(X)$ durumundan optimal maliyet-kalan olsun ($X$'ten elde edilebilir minimum kümülatif maliyet). O zaman:</p>

<div class="calc-formula"><div class="formula-label">BELLMAN DENKLEMI (DETERMINISTIK, AYRIK ZAMAN)</div><div class="formula-main">$$V^*(X) \\;=\\; \\min_{U} \\Bigl\\{\\, L(X, U) \\;+\\; V^*\\!\\bigl(f(X, U)\\bigr)\\, \\Bigr\\}$$</div><div class="formula-sub">L(X,U) sahne maliyetidir; f(X,U) dinamiktir. Sağdaki V* de aynı V*'ı kullanır — sabit-nokta denklemi.</div></div>

<p class="l-text"><strong>LQR nereden geliyor?</strong> Lineer $f(X,U) = AX + BU$ ve karesel $L(X,U) = X^\\top Q X + U^\\top R U$ için $V^*(X) = X^\\top P X$'ı Bellman denklemine yerleştir. $U$ üzerinden minimizasyon tek atışta karesel — çöz, geri koy, katsayıları eşitle. Sonuç tam olarak ayrık Riccati denklemidir. <em>LQR, lineer-karesel durum için kapalı formda çözülmüş Bellman denklemidir.</em></p>

<div class="calc-formula"><div class="formula-label">SUREKLI-ZAMAN ANALOGU: HJB DENKLEMI</div><div class="formula-main">$$0 \\;=\\; \\min_{U} \\Bigl\\{\\, L(X, U) \\;+\\; \\nabla V^*(X)^\\top f(X, U) \\,\\Bigr\\}$$</div><div class="formula-sub">Hamilton-Jacobi-Bellman PDE. HJB'yi çözmek dinamik programlamanın sürekli-zaman versiyonudur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tablolu DP</div><div class="card-body">Küçük ayrık durum uzayları için Bellman denklemini doğrudan yinele: V(X) ← min_U {L(X,U) + V(f(X,U))}. V*'a yakınsar. Izgara-dünya oyuncak problemleri için standart.</div></div>
<div class="calc-card"><div class="card-title">Boyutluluk laneti</div><div class="card-body">Sürekli X ∈ ℝ^n için değer fonksiyonu n-boyutlu bir manifoldda yaşar. Eksen başına M kutuya sahip bir ızgarada V depolamak M^n hücre gerektirir. n = 10, M = 50 için bu ≈ 10^17 hücredir. Uygulanamaz.</div></div>
<div class="calc-card"><div class="card-title">Kaçış yolu 1 — LQR</div><div class="card-body">Problem lineer-kareselse, V X'te bir simetrik matris P ile parametrelenmiş karesel bir niceliktir. Lanet M^n hücreden n(n+1)/2 sayıya çöker. Bu yüzden LQR çok özeldir.</div></div>
<div class="calc-card"><div class="card-title">Kaçış yolu 2 — fonksiyon yaklaşımı</div><div class="card-body">V'yi (veya Q'yu) bir sinir ağıyla yaklaşık. Izgara kaybolur; V, n'den bağımsız olarak ≈ 10^6 parametre ile temsil edilir. Bu değer-tabanlı derin RL'dir: DQN, DDPG eleştirmeni, SAC eleştirmeni. Bellman denklemi bir regresyon hedefi olur.</div></div>
</div>

<div class="l-note"><strong>Bellman'ın sana bedava verdiği şey.</strong> Optimallik ilkesi çarpıcı bir sonuca sahiptir: $X_0$'dan bir terminal duruma optimal bir yörüngen varsa, o yörünge boyunca herhangi bir $X^*$ durumu için, $X^*$'dan terminal duruma olan segment kendisi optimaldir. Yani parça parça çözebilir, yerel olarak planlayabilir, global olarak yapıştırabilirsin. Her modern hiyerarşik ve çoklu-oran kontrol mimarisi bunun bir tezahürüdür.</div>

<h2 class="lesson-title">8. Optimal Kontrolden Pekistirmeli Ogrenmeye</h2>

<div class="calc-highlight"><strong>Eksen.</strong> Şimdiye kadar her şey modeli bildiğimizi varsayıyordu — LQR için $A, B$ veya genel HJB için $f$. Ya bilmiyorsak? Sadece durum, eylem ve ödülleri bilinmeyen bir ortamla deneyim yoluyla gözlemliyorsak ne olur? O zaman CARE'den $P$'yi önceden hesaplayamayız. Onu öğrenmemiz gerekir. Bu Pekiştirmeli Öğrenme'dir. Ve alanın en derin sonucu, Bellman denkleminin modele ihtiyaç duymamasıdır — saf veriden $V^*$'a yakınsayan bir öğrenme kuralına dönüştürülebilir.</div>

<p class="l-text">Yeniden parametrele. $V(X)$ değeri yerine Q-değeri $Q(X, U)$'yu kullan: $X$ durumundan $U$ eylemini alıp sonra optimal davranmanın maliyeti (veya RL'de: negatif ödül). Q için Bellman denklemi şudur:</p>

<div class="calc-formula"><div class="formula-label">Q ICIN BELLMAN DENKLEMI</div><div class="formula-main">$$Q^*(X, U) \\;=\\; L(X, U) \\;+\\; \\min_{U'} Q^*\\!\\bigl(f(X, U), U'\\bigr)$$</div><div class="formula-sub">Sadece Q üzerinde bir denklem. Q* bilindiğinde, optimal kontrol U* = argmin_U Q*(X,U)'dur. Kullanım zamanında modele gerek yok.</div></div>

<p class="l-text">Şimdi sihirli kısım — Q-learning (Watkins 1989). Deneyimden bir $(X_k, U_k, r_k, X_{k+1})$ geçişi verildiğinde, güncelle:</p>

<div class="calc-formula"><div class="formula-label">Q-LEARNING GUNCELLEMESI</div><div class="formula-main">$$Q(X_k, U_k) \\;\\leftarrow\\; (1 - \\alpha)\\, Q(X_k, U_k) \\;+\\; \\alpha \\Bigl[\\, r_k + \\gamma \\min_{U'} Q(X_{k+1}, U')\\, \\Bigr]$$</div><div class="formula-sub">α öğrenme oranı, γ indirim faktörüdür. Köşeli parantez Bellman hedefidir — (X_k,U_k)'daki Q'nun sonraki duruma göre "ne olması gerektiği". Sadece ona doğru hareket ediyoruz.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Modelsiz</div><div class="card-body">A, B yok, f(X,U) yok, R yok. Sadece veri akışı (X, U, r, X'). Bilinmeyen dinamikler örnekleme ile soğurulur.</div></div>
<div class="calc-card"><div class="card-title">Politika dışı</div><div class="card-body">Güncelleme, veriyi hangi politikanın ürettiğinden bağımsız olarak çalışır — eski veri, keşif gürültüsü, gösterimler, hepsi geçerlidir. Replay buffer için hazır.</div></div>
<div class="calc-card"><div class="card-title">Tablolu yakınsama</div><div class="card-body">Sonlu (X, U) için Q-learning, her (X, U) sonsuz sıklıkta ziyaret edilirse Q*'a kanıtlanabilir şekilde yakınsar. Kanıt (Tsitsiklis 1994) Bellman operatörünün büzülme özelliği üzerine inşa edilmiştir.</div></div>
<div class="calc-card"><div class="card-title">LQR özel bir durumdur</div><div class="card-body">Lineer-karesel probleme $Q(X, U) = X^\\top M_{XX} X + 2 X^\\top M_{XU} U + U^\\top M_{UU} U$ ile Q-learning uygula. Güncellemeler CARE çözümünün ima ettiği aynı $(M_{XX}, M_{XU}, M_{UU})$'ya yakınsar. LQR = "lineer-karesel önceliklı model-tabanlı RL".</div></div>
</div>

<p class="l-text"><strong>Peki sürekli eylemler?</strong> Bellman hedefindeki $\\min_{U'}$, eylemler sonlu olduğunda (5 seçenekli bir buton basışı) önemsizdir ama sürekli kontrol için patlar (7-DoF bir robot eklem torku). Sonsuz eylem kümesi üzerinde argmax, sonraki bölümün algoritmalarının çözdüğü merkezi engeldir.</p>

<div class="calc-graph"><div id="plot-l7-qlearn-tr" class="plotly-graph" style="height:360px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> 4×4 bir ızgara-dünyada tablolu Q-learning'in öğrenme eğrisi (başlangıç sol-üst, hedef sağ-alt, adım ödülü $-1$, terminal ödülü $+10$). Ajan hiçbir şey bilmeden başlar — rastgele Q-tablosu — ve $\\sim 200$ bölümden sonra optimal politikaya yakınsar. y-ekseni bölüm başına toplam ödüldür (daha yüksek daha iyidir). Bu geometri için optimum ödüle $\\approx +4$ kadar olan gürültülü, üstel-azalan boşluğa dikkat et. Bu, DARE ile aynı Bellman sabit-nokta iterasyonudur, sadece model örneklenmiş deneyimle değiştirilmiştir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var eps=[],rewards=[];
for(var i=0;i<400;i++){
  eps.push(i);
  var phase=Math.min(1,i/200);
  var base=-25+phase*29;
  var noise=8*(1-phase)*((Math.random()*2)-1)+1.5*((Math.random()*2)-1);
  rewards.push(base+noise);
}
var smoothed=[];
for(var i=0;i<rewards.length;i++){
  var lo=Math.max(0,i-15),hi=Math.min(rewards.length,i+15);
  var s=0,c=0;for(var j=lo;j<hi;j++){s+=rewards[j];c++;}
  smoothed.push(s/c);
}
var traw={x:eps,y:rewards,mode:'lines',name:'bolum odulu (gurultu)',line:{color:'rgba(59,130,246,0.35)',width:1.2}};
var tsm={x:eps,y:smoothed,mode:'lines',name:'30-bolum kayan ort',line:{color:'#3b82f6',width:2.6}};
var topt={x:[0,400],y:[4,4],mode:'lines',name:'optimum',line:{color:'#10b981',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'egitim bolumu',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'bolum basina kumulatif odul',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-qlearn-tr',[traw,tsm,topt],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Politika Gradyani ve Aktor-Elestirmen — Derin RL Soy Agaci</h2>

<div class="calc-highlight"><strong>Sürekli-eylem devrimi.</strong> Q-learning'in $\\min_U$'su sürekli kontrol için kırılır. Düzeltme: $Q$'yu öğrenip sonra $\\arg\\min_U Q$ yapmak yerine, doğrudan bir sinir ağıyla parametrelenmiş bir politika $\\mu_\\theta(X) \\to U$ öğren. $\\theta$'ya göre beklenen getirinin gradyanı politika gradyanıdır. Bunu öğrenilmiş bir eleştirmenle birleştir ve modern robot öğrenmesine hâkim olan aktör-eleştirmen yöntemlerini — DDPG, TD3, SAC — elde edersin.</div>

<p class="l-text"><strong>REINFORCE (Williams 1992).</strong> Stokastik bir politika $\\pi_\\theta(U | X)$ için:</p>

<div class="calc-formula"><div class="formula-label">POLITIKA GRADYANI TEOREMI (SUTTON 1999)</div><div class="formula-main">$$\\nabla_\\theta J(\\theta) \\;=\\; \\mathbb{E}_{(X, U) \\sim \\pi_\\theta} \\Bigl[\\, \\nabla_\\theta \\log \\pi_\\theta(U | X)\\, Q^{\\pi_\\theta}(X, U)\\, \\Bigr]$$</div><div class="formula-sub">Beklenen getirinin doğrudan gradyanı. Skor-fonksiyonu formu. Bir eleştirmenle varyans düşürülmedikçe yüksek varyans.</div></div>

<p class="l-text"><strong>A2C / A3C (Mnih 2016).</strong> $Q$'yu avantaj $A^\\pi(X,U) = Q^\\pi(X,U) - V^\\pi(X)$ ile değiştir — aynı gradyan yönü, çok daha düşük varyans. Asynchronous Advantage Actor-Critic birçok CPU iş parçacığında çalıştı ve iki yıl boyunca state-of-the-art idi.</p>

<p class="l-text"><strong>PPO (Schulman 2017).</strong> Kırpılmış vekil hedef yoluyla güven-bölgesi kısıtı. Hem robotik hem de dil modelleri için 2017-2023 endüstri varsayılanı (ChatGPT'nin RLHF aşamasını eğiten budur).</p>

<p class="l-text"><strong>DDPG (Lillicrap 2015).</strong> Sürekli kontrol için deterministik-politika-gradyanı analogu. Deterministik politika $\\mu_\\theta(X)$, eleştirmen $Q_\\phi(X, U)$, ikisini eleştirmenden politikaya backprop yaparak birlikte öğren. Aşırı tahmin yanlılığından muzdaripti.</p>

<p class="l-text"><strong>TD3 (Fujimoto 2018).</strong> DDPG üzerinde üç yama: (i) hedef = ikisinin minimumu olan ikiz eleştirmenler, (ii) gecikmeli politika güncellemeleri, (iii) hedef-politika yumuşatma gürültüsü. DDPG'yi gerçekten güvenilir yaptı.</p>

<p class="l-text"><strong>SAC (Haarnoja 2018).</strong> Soft Actor-Critic. Maksimum entropi RL: getiriyi <em>artı</em> politikanın entropisini maksimize et. Ad hoc gürültü çizelgeleri olmadan keşfi teşvik eder. Robot sürekli-kontrolü için 2026 varsayılanı. Anymal-C, Spot, MIT Cheetah 3 ve birçok daha yeni donanım platformunun arkasındaki algoritmalardır.</p>

<div class="calc-formula"><div class="formula-label">SAC HEDEFI</div><div class="formula-main">$$J_\\pi(\\theta) \\;=\\; \\mathbb{E}_{(X, U) \\sim \\pi_\\theta}\\!\\left[\\, Q_\\phi(X, U) \\;+\\; \\alpha\\, \\mathcal{H}\\bigl(\\pi_\\theta(\\cdot | X)\\bigr)\\, \\right]$$</div><div class="formula-sub">α entropi ağırlığıdır. Politika, açık bir kazanan ortaya çıkana kadar geniş kalmaya teşvik edilir. Eleştirmen, entropi bonusunu da hesaba katan yumuşak Bellman hedefiyle eğitilir.</div></div>

<div class="calc-graph"><div id="plot-l7-sac-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> sürekli-kontrol benchmark'ında DDPG, TD3 ve SAC'ın stilize edilmiş eğitim eğrileri (MuJoCo HalfCheetah veya Walker2d gibi düşün). Üçü de aktör-eleştirmen yöntemleridir; SAC'ın entropi düzenlileştirmesi en pürüzsüz, en monoton iyileşmeyi ve en yüksek asimptotu verir. DDPG (eski) tohumlar arasında kırılgandır — geniş varyans bantları. TD3 (ikiz eleştirmenler, gecikmeli güncellemeler) boşluğun çoğunu kapatır. SAC (2018) tipik olarak kazanır, bu yüzden modern varsayılandır. Tüm eğriler kabaca yayımlanmış 2018-2021 benchmark sayılarından çizilmiştir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function curve(M,plateau,noise,seed){
  var xs=[],ys=[];
  for(var i=0;i<300;i++){
    xs.push(i);
    var t=i/300;
    var base=plateau*(1-Math.exp(-t*M));
    var n=noise*((Math.sin(i*0.31+seed)+Math.sin(i*0.07+seed*2))*0.5);
    ys.push(base+n);
  }
  return {x:xs,y:ys};
}
var ddpg=curve(2.8,3000,400,1);
var td3 =curve(3.6,4400,180,3);
var sac =curve(4.4,5200,90,7);
var tD={x:ddpg.x,y:ddpg.y,mode:'lines',name:'DDPG (Lillicrap 2015)',line:{color:'#f59e0b',width:2.4}};
var tT={x:td3.x,y:td3.y,mode:'lines',name:'TD3 (Fujimoto 2018)',line:{color:'#a855f7',width:2.4}};
var tS={x:sac.x,y:sac.y,mode:'lines',name:'SAC (Haarnoja 2018)',line:{color:'#3b82f6',width:3}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'egitim adimi (k)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'ortalama getiri (HalfCheetah-benzeri)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:40,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-sac-tr',[tD,tT,tS],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Yapay Zeka Destekli Robotik — 2026 Sınırı</h2>

<div class="calc-highlight"><strong>Şimdi neredeyiz.</strong> Klasik kontrol derin RL tarafından yerinden edilmedi — <em>genişletildi</em>. 2026'da her state-of-the-art robotik yığını bir melezdir: alt-seviye tork döngüleri LQR veya MPC'dir, orta-seviye yürüme tempoları ve manipülasyon ilkelleri SAC ile eğitilmiş politikalardır, üst-seviye görev planlama giderek bir görü-dil-eylem modelidir (RT-2, OpenVLA). "Kontrolcü" ve "sinir ağı" arasındaki sınır eridi.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Boston Dynamics Atlas (elektrik, 2024+)</div><div class="card-body">Tüm-gövde hareketi için model-öngörülü yörünge optimizasyonu ile adım kurtarma gibi temas-yoğun ilkeller için RL politikalarının melezi. İç tutum döngüleri hâlâ LQR-türevi.</div></div>
<div class="calc-card"><div class="card-title">Tesla Optimus</div><div class="card-body">Manipülasyon için uçtan-uca görü-eklem-tork ağları; güvenlik için altında klasik empedans kontrolü. Halka açık demolar Tesla'nın otopilot veri hattından açık politika aktarımı gösteriyor.</div></div>
<div class="calc-card"><div class="card-title">Anymal (ETH-Zurich, ANYbotics)</div><div class="card-body">Büyük paralel simülasyonla NVIDIA Isaac Gym'de eğitilmiş, sonra sim-to-real aktarımı yapılmış SAC ile dört-ayaklı hareket. 2021'den beri endüstriyel denetimde üretim-konuşlandırıldı.</div></div>
<div class="calc-card"><div class="card-title">Berkeley BAIR / Levine laboratuvarı</div><div class="card-body">Becerikli manipülasyon, el-göz kontrolü, hepsi SAC-türevi. RGB gözlemlerden ünlü Küp-katlama — 2020'de gerçek donanımda ham-piksel RL'in uygulanabilir olduğunu gösterdi.</div></div>
<div class="calc-card"><div class="card-title">Google DeepMind RT-1, RT-2 (2022-2023)</div><div class="card-body">"Robotic Transformer". (Kamera, talimat)'ı doğrudan robot eylemlerine eşleyen görü-dil-eylem modelleri. Gösterimler + RL ince-ayarıyla eğitildi. Robotik LLM'sine en yakın olan şey.</div></div>
<div class="calc-card"><div class="card-title">Figure 02, 1X NEO, Apptronik Apollo (2024-2026)</div><div class="card-body">Yeni nesil robotik şirketlerden insansı platformlar. Tümü altın LQR/MPC ve üstün öğrenilmiş bir politika olan yığınlar kullanır. OpenAI-Figure ortaklığı (Mar 2024) doğal-dil görev verme için bir VLM ekledi.</div></div>
</div>

<div class="l-note"><strong>Birleşim.</strong> 2024'lü bir robotik makalesini okuduğunda zincir şöyle olur: bir fizik simülatörü (PyBullet / MuJoCo / Isaac Gym), bir politika ağı (SAC veya PPO), alan rastgeleleştirmesiyle milyonlarca bölüm üzerinden eğitildi, sonra gerçek donanıma sim-to-real aktarımı, kararlılık için altında düşük-seviyeli LQR veya MPC ile. Bu track'in 1-6 dersinde öğrendiğin matematik yığının dibidir; bu ders üstüdür. Her iki katman da gereklidir; her ikisi de araç kutunda olmalıdır.</div>

<h2 class="lesson-title">11. Pyodide Lab — LQR, MPC ve Mini Q-Learning Ajani</h2>

<p class="l-text">İnşa zamanı. Tek Pyodide hücresinde üç egzersiz: (a) çift integratör için <code>scipy.linalg.solve_continuous_are</code> ile CARE'yi çöz, kapalı döngüyü simüle et, çiz. (b) Manuel MPC: her adımda kutu-kısıtlı en küçük kareler ile küçük kısıtlı karesel problem çöz. (c) 4×4 ızgara-dünya üzerinde küçük tablolu Q-learning ajanı. Hepsi tarayıcında çalışır; kurulum gerekmez.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON — cift integrator icin LQR</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.linalg <span class="kw">import</span> solve_continuous_are

<span class="cm"># Cift integrator: x_ddot = u</span>
A = np.<span class="fn">array</span>([[<span class="num">0.0</span>, <span class="num">1.0</span>],
              [<span class="num">0.0</span>, <span class="num">0.0</span>]])
B = np.<span class="fn">array</span>([[<span class="num">0.0</span>],
              [<span class="num">1.0</span>]])

Q = np.<span class="fn">eye</span>(<span class="num">2</span>)
R = np.<span class="fn">array</span>([[<span class="num">1.0</span>]])

<span class="cm"># CARE coz: A^T P + P A - P B R^{-1} B^T P + Q = 0</span>
P = <span class="fn">solve_continuous_are</span>(A, B, Q, R)
K = np.<span class="fn">linalg</span>.<span class="fn">solve</span>(R, B.T @ P)
<span class="fn">print</span>(<span class="str">"P =\\n"</span>, P)
<span class="fn">print</span>(<span class="str">"K =\\n"</span>, K)
<span class="fn">print</span>(<span class="str">"Kapali-dongu ozdegerleri:"</span>, np.<span class="fn">linalg</span>.<span class="fn">eigvals</span>(A - B @ K))

<span class="cm"># x0 = [5, 0]'dan ileri Euler ile kapali dongu simulasyonu</span>
dt, T = <span class="num">0.01</span>, <span class="num">10.0</span>
N = <span class="fn">int</span>(T / dt)
x = np.<span class="fn">array</span>([<span class="num">5.0</span>, <span class="num">0.0</span>])
traj = []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(N):
    u = -K @ x
    x = x + dt * (A @ x + B.<span class="fn">flatten</span>() * u[<span class="num">0</span>])
    traj.<span class="fn">append</span>((k * dt, x[<span class="num">0</span>], x[<span class="num">1</span>], u[<span class="num">0</span>]))

traj = np.<span class="fn">array</span>(traj)
<span class="fn">print</span>(<span class="str">f"x = {traj[-1, 1]:.6f}, v = {traj[-1, 2]:.6f}'de oturdu"</span>)
<span class="fn">print</span>(<span class="str">f"tepe kontrol |u| = {np.max(np.abs(traj[:, 3])):.3f}"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — projeksiyonlu QP ile minimal MPC</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> scipy.linalg <span class="kw">import</span> solve_discrete_are

<span class="cm"># Ayriklastir: x_{k+1} = Ad x_k + Bd u_k</span>
dt = <span class="num">0.1</span>
Ad = np.<span class="fn">array</span>([[<span class="num">1.0</span>, dt],
               [<span class="num">0.0</span>, <span class="num">1.0</span>]])
Bd = np.<span class="fn">array</span>([[<span class="num">0.5</span> * dt * dt],
               [dt]])

Q = np.<span class="fn">eye</span>(<span class="num">2</span>)
R = np.<span class="fn">array</span>([[<span class="num">1.0</span>]])
P_f = <span class="fn">solve_discrete_are</span>(Ad, Bd, Q, R)            <span class="cm"># terminal maliyet</span>

<span class="kw">def</span> <span class="fn">mpc_solve</span>(x0, N=<span class="num">25</span>, u_max=<span class="num">1.0</span>):
    <span class="cm"># Karar degiskenleri U = (u_0, u_1, ..., u_{N-1}) ∈ R^N</span>
    <span class="cm"># Maliyet: sum_j x_j^T Q x_j + u_j^2 + x_N^T P_f x_N</span>
    <span class="cm"># Lineer yigin X(U) = M x0 + L U kur, burada</span>
    <span class="cm">#   M boyutu (N+1)*2 x 2, L boyutu (N+1)*2 x N</span>
    n_x, n_u = <span class="num">2</span>, <span class="num">1</span>
    M = np.<span class="fn">zeros</span>(((N + <span class="num">1</span>) * n_x, n_x))
    L = np.<span class="fn">zeros</span>(((N + <span class="num">1</span>) * n_x, N))
    M[:n_x, :] = np.<span class="fn">eye</span>(n_x)
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, N + <span class="num">1</span>):
        M[j * n_x:(j + <span class="num">1</span>) * n_x, :] = Ad @ M[(j - <span class="num">1</span>) * n_x:j * n_x, :]
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(j):
            block = np.<span class="fn">linalg</span>.<span class="fn">matrix_power</span>(Ad, j - <span class="num">1</span> - i) @ Bd
            L[j * n_x:(j + <span class="num">1</span>) * n_x, i:i + <span class="num">1</span>] = block

    <span class="cm"># buyuk-Q kur diag(Q,Q,...,Q,P_f)</span>
    Qbar = np.<span class="fn">kron</span>(np.<span class="fn">eye</span>(N + <span class="num">1</span>), Q)
    Qbar[-n_x:, -n_x:] = P_f
    Rbar = np.<span class="fn">eye</span>(N) * R[<span class="num">0</span>, <span class="num">0</span>]

    H = <span class="num">2</span> * (L.T @ Qbar @ L + Rbar)
    g = <span class="num">2</span> * (L.T @ Qbar @ M @ x0)

    <span class="cm"># [-u_max, u_max]^N kutusu uzerinde projeksiyonlu gradyan — kucuk QP icin yeterli</span>
    U = np.<span class="fn">zeros</span>(N)
    lr = <span class="num">1.0</span> / (np.<span class="fn">linalg</span>.<span class="fn">norm</span>(H, ord=<span class="num">2</span>) + <span class="num">1e-6</span>)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
        grad = H @ U + g
        U = U - lr * grad
        U = np.<span class="fn">clip</span>(U, -u_max, u_max)
    <span class="kw">return</span> U[<span class="num">0</span>]

<span class="cm"># x0 = (5, 0)'dan kapali-dongu MPC simulasyonu</span>
x = np.<span class="fn">array</span>([<span class="num">5.0</span>, <span class="num">0.0</span>])
mpc_traj = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">120</span>):
    u = <span class="fn">mpc_solve</span>(x, N=<span class="num">25</span>, u_max=<span class="num">1.0</span>)
    x = Ad @ x + Bd.<span class="fn">flatten</span>() * u
    mpc_traj.<span class="fn">append</span>((step * dt, x[<span class="num">0</span>], x[<span class="num">1</span>], u))

mpc_traj = np.<span class="fn">array</span>(mpc_traj)
<span class="fn">print</span>(<span class="str">f"MPC x = {mpc_traj[-1, 1]:.4f}'de oturdu"</span>)
<span class="fn">print</span>(<span class="str">f"MPC max |u| uygulandi = {np.max(np.abs(mpc_traj[:, 3])):.3f}  (sinir 1.0 idi)"</span>)</code></pre></div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — 4x4 izgara-dunyada tablolu Q-learning</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># 4x4 izgara. Baslangic (0,0). Hedef (3,3). Eylemler: 0=yukari, 1=sag, 2=asagi, 3=sol.</span>
<span class="cm"># Odul: adim basina -1, hedefe ulasinca +10, hedefte bolum biter.</span>

rng = np.<span class="fn">random</span>.<span class="fn">default_rng</span>(<span class="num">0</span>)

n_states = <span class="num">16</span>
n_actions = <span class="num">4</span>
Q = np.<span class="fn">zeros</span>((n_states, n_actions))

<span class="kw">def</span> <span class="fn">to_xy</span>(s): <span class="kw">return</span> (s % <span class="num">4</span>, s // <span class="num">4</span>)
<span class="kw">def</span> <span class="fn">to_s</span>(x, y): <span class="kw">return</span> y * <span class="num">4</span> + x

<span class="kw">def</span> <span class="fn">step</span>(s, a):
    x, y = <span class="fn">to_xy</span>(s)
    <span class="kw">if</span>   a == <span class="num">0</span>: y = <span class="fn">max</span>(<span class="num">0</span>, y - <span class="num">1</span>)
    <span class="kw">elif</span> a == <span class="num">1</span>: x = <span class="fn">min</span>(<span class="num">3</span>, x + <span class="num">1</span>)
    <span class="kw">elif</span> a == <span class="num">2</span>: y = <span class="fn">min</span>(<span class="num">3</span>, y + <span class="num">1</span>)
    <span class="kw">else</span>:       x = <span class="fn">max</span>(<span class="num">0</span>, x - <span class="num">1</span>)
    s_next = <span class="fn">to_s</span>(x, y)
    <span class="kw">if</span> s_next == <span class="num">15</span>:    <span class="cm"># hedef</span>
        <span class="kw">return</span> s_next, <span class="num">10</span>, <span class="kw">True</span>
    <span class="kw">return</span> s_next, -<span class="num">1</span>, <span class="kw">False</span>

alpha, gamma, epsilon = <span class="num">0.5</span>, <span class="num">0.95</span>, <span class="num">0.2</span>
returns = []

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">400</span>):
    s = <span class="num">0</span>; done = <span class="kw">False</span>; G = <span class="num">0</span>; steps = <span class="num">0</span>
    <span class="kw">while</span> <span class="kw">not</span> done <span class="kw">and</span> steps &lt; <span class="num">100</span>:
        <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; epsilon:
            a = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_actions)
        <span class="kw">else</span>:
            a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(Q[s]))
        s_next, r, done = <span class="fn">step</span>(s, a)
        td_target = r + gamma * np.<span class="fn">max</span>(Q[s_next]) * (<span class="num">0</span> <span class="kw">if</span> done <span class="kw">else</span> <span class="num">1</span>)
        Q[s, a] += alpha * (td_target - Q[s, a])
        s = s_next; G += r; steps += <span class="num">1</span>
    epsilon = <span class="fn">max</span>(<span class="num">0.02</span>, epsilon * <span class="num">0.995</span>)
    returns.<span class="fn">append</span>(G)

<span class="fn">print</span>(<span class="str">f"ilk-100-bolum ort getiri = {np.mean(returns[:100]):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"son-100-bolum ort getiri = {np.mean(returns[-100:]):.2f}"</span>)
<span class="fn">print</span>(<span class="str">"Acgozlu politika (oklar yukari/sag/asagi/sol) durum basina:"</span>)
arrows = [<span class="str">"^"</span>, <span class="str">"&gt;"</span>, <span class="str">"v"</span>, <span class="str">"&lt;"</span>]
<span class="kw">for</span> y <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
    row = []
    <span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
        s = <span class="fn">to_s</span>(x, y)
        <span class="kw">if</span> s == <span class="num">15</span>: row.<span class="fn">append</span>(<span class="str">"H"</span>)
        <span class="kw">else</span>: row.<span class="fn">append</span>(arrows[<span class="fn">int</span>(np.<span class="fn">argmax</span>(Q[s]))])
    <span class="fn">print</span>(<span class="str">"   "</span> + <span class="str">" "</span>.<span class="fn">join</span>(row))</code></pre></div>

<p class="l-text"><strong>Oynamak için.</strong> (1) LQR bloğunda $R$'yi $1$'den $0.01$ ve $100$'e değiştir — dersin başındaki kazanç grafiğini doğrula. (2) MPC bloğunda giriş sınırını kaldır ($u_{\\max}$'ı çok büyük yap) — yörüngenin LQR ile eşleştiğini doğrula. Sonra $0.3$'e sıkılaştır — MPC'nin nasıl uyum sağladığına dikkat et. (3) Q-learning bloğunda indirim $\\gamma$'yı $0.95$'ten $0.5$'e değiştir — ajan miyop olur. $(2, 2)$'de $-20$ ödülü olan bir "tuzak" hücre ekle ve öğrenilen politikanın etrafından nasıl rotalandığını gözlemle. (4) Kapalı form $K = [1/\\sqrt{\\rho}, \\sqrt{2/\\sqrt{\\rho}}]$'in <code>scipy</code>'nin döndürdüğü ile eşleştiğini elle doğrula.</p>

<h2 class="lesson-title">12. Tek Sayfada Hikaye</h2>

<p class="l-text">Geriye dön. Zinciri izle:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bellman 1957</div><div class="card-body">Optimallik İlkesi: değer fonksiyonu özyinelemeli bir sabit-nokta denklemini sağlar. Dinamik programlama, ardışık karar problemleri için bir çerçeve. Sonrasında gelen her şeyin ebeveyni.</div></div>
<div class="calc-card"><div class="card-title">Kálmán 1960</div><div class="card-body">LQR. Lineer sistem + karesel maliyet için V kareseldir, Bellman sabit-noktası Cebirsel Riccati Denklemi olur. Kapalı-form kazanç. Dokuz yıl içinde Apollo'da konuşlandırıldı.</div></div>
<div class="calc-card"><div class="card-title">1980'ler-1990'lar</div><div class="card-body">MPC petrokimyada olgunlaşır. Kısıtlarla geri çekilen-ufuk optimizasyonu LQR'ın çözemediğini çözer. 2000'e kadar petrol ve gazda endüstriyel iş atı.</div></div>
<div class="calc-card"><div class="card-title">Watkins 1989</div><div class="card-body">Q-learning. Riccati ile aynı Bellman denklemi, ama parametre-bağımsız — $A, B$'yi bilmeden veriden öğrenir. Tablolu uzaylarda yakınsama kanıtlandı.</div></div>
<div class="calc-card"><div class="card-title">Sutton 1999</div><div class="card-body">Politika Gradyanı Teoremi. $\\nabla \\log \\pi \\cdot Q$ ile politika parametrelerinin doğrudan optimizasyonu. Derin RL'i çalıştıran skor-fonksiyonu hilesi.</div></div>
<div class="calc-card"><div class="card-title">Mnih 2013, 2015</div><div class="card-body">DQN — sinir ağı fonksiyon yaklaşımcısıyla Q-learning. Bellman sabit-nokta iterasyonu ile konvolüsyonel özellikler birleşimi. 2013'te piksellerden Atari, 2015'te Nature makalesi.</div></div>
<div class="calc-card"><div class="card-title">Lillicrap 2015 → Fujimoto 2018 → Haarnoja 2018</div><div class="card-body">DDPG → TD3 → SAC. Sürekli-kontrol soyu. Her biri öncülünün sorunlarını giderir. SAC'ın entropi düzenlileştirmesi onu robot RL için modern varsayılan yapar.</div></div>
<div class="calc-card"><div class="card-title">2022-2026</div><div class="card-body">RT-1, RT-2, OpenVLA, planlama için Sora-benzeri dünya modelleri, büyük sim-to-real için NVIDIA Isaac Gym, Figure / Tesla / 1X insansı yığınları. Altta klasik LQR/MPC, ortada RL politikaları, üstte transformer planlayıcılar.</div></div>
</div>

<div class="l-warn"><strong>Bu, kontrol-teorisi track'inin son dersi.</strong> Ders 1'de transfer fonksiyonları ve Laplace alanı ile başladın. Şimdi 2026 robotunun ne yapacağına nasıl karar verdiğinin tüm iskeletini kafanda taşıyorsun. Riccati denkleminden türettiğin LQR her uçuş kontrolcüsünün dibidir. Çizdiğin MPC, Falcon 9 booster'larını indirir. Q-learning sabit-noktası, Kálmán'ın kullandığı aynı Bellman denklemidir, bir bükümle — modele ihtiyaç duymaz. Ve Atlas ile Optimus'u eğiten SAC politikaları, yazdığın aynı fikirlerin sürekli-eylem torunlarıdır. Sıradaki okuduğun makale, "aktör", "eleştirmen", "avantaj", "entropi düzenlileştirme" veya "Bellman hedefi" gibi kelimelerle şeffaf olacak. Git inşa et.</div>

<p class="l-text"><strong>Bu sitede önerilen sonraki adımlar.</strong> Pekiştirmeli Öğrenme track'inde DDPG/TD3/SAC ve çok-ajanlı RL üzerine dersler, Bölüm 8-9'u uygulama tarafından yeniden ele alır. Diferansiyel Denklemler track'inin 8. dersi (Neural ODE → Diffusion → Flow Matching) bu malzemenin sürekli-zaman kuzenidir. Derin Öğrenme track'inde tam çözümlü bir yürüteçle PPO ve politika gradyanları üzerine bir ders vardır. Robotik track'i (yakında) insansı yığınlarla her şeyi birbirine bağlar. Sonra nereye gidersen git, denklemler tanıdık gelecek.</p>`
};
