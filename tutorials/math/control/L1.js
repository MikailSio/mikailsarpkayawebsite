window.CONTROL_L1 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Control theory begins with a single question: how do we make a physical system do what we want it to do?</strong> A cruise control must hold the car at 100 km/h even when the road tilts up. A thermostat must hold the room at 22 C even when somebody opens a window. A drone must keep its rotor angle pointed where the autopilot demands, against gusts, voltage drops, and aging motors. Every one of these problems is solved by a closed loop — measure the output, compare with the target, push the error back into the input — and every closed loop sits, somewhere, on top of a <em>linear time-invariant</em> mathematical model.</p>

<p class="l-text">This is the foundational lesson of the Control Theory track. Before stability margins, before PID tuning, before state-space, before Lyapunov, we have to learn the alphabet: how to take a differential equation that describes a physical system, turn it into a <strong>transfer function</strong> in the complex variable <em>s</em>, draw the system as a block diagram, combine and reduce those blocks, and predict the time-domain response from the parameters on the page. The good news is that you already met most of this machinery in the math track — the Laplace transform from Fourier L6, the second-order ODE from Diffeq L2. Here we recast it in the engineering vocabulary every working control engineer uses every day.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish an open-loop from a closed-loop control system and draw the block diagram of each</li>
<li>Convert a linear ODE with constant coefficients into a transfer function H(s) = Y(s)/X(s) with zero initial conditions</li>
<li>Recognise the first-order canonical form K/(tau s + 1) and the second-order canonical form omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2) at sight</li>
<li>Translate fluently between a mass-spring-damper and an RLC circuit using the mechanical-electrical analogy</li>
<li>Reduce a block diagram with series, parallel, and negative-feedback connections to a single transfer function</li>
<li>Read overshoot, rise time, peak time, and settling time off the damping ratio zeta and the natural frequency omega_n of a second-order system</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Control System?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> the cruise control in your car is a control system. You set a target speed of 100 km/h. A sensor (speedometer) reports the actual speed. A controller (an embedded chip running a PID algorithm) compares the two, decides how much extra throttle is needed, and sends that command to the engine. As the road tilts up, the speed drops, the error grows, the controller pushes more throttle, the speed climbs back. The whole machinery — sensor, controller, actuator, plant — works second by second to keep one number close to one target.</div>

<p class="l-text">Strip the example down to its skeleton and almost every control problem in the world looks the same. There is a <strong>plant</strong> (the thing you want to control — engine, motor, robot arm, chemical reactor, aircraft, building HVAC). There is a <strong>reference</strong> r(t) (the target — desired speed, desired temperature, desired joint angle). There is an <strong>output</strong> y(t) (what the plant actually does). And there is a <strong>controller</strong> that decides what input u(t) to apply, based on either the reference alone or the reference and a measurement of the output.</p>

<p class="l-text">The single most important architectural decision is whether the controller sees the output. That decision splits all control systems into two families.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Open-loop control</div><div class="card-body">The controller computes u(t) from the reference r(t) only — no measurement is fed back. A microwave on a timer is the canonical example: you set 90 seconds, it heats for 90 seconds, no thermometer is ever consulted. Cheap, simple, and completely defenceless against any disturbance. If your food started colder, it ends colder.</div><div class="card-formula">u = K * r</div></div>
<div class="calc-card"><div class="card-title">Closed-loop (feedback) control</div><div class="card-body">A sensor measures y(t), the error e = r - y is computed, the controller acts on the error. A modern oven with a thermocouple holds the chamber at 180 C regardless of how cold the food started, how many times the door is opened, or how the heating element ages. Robust, accurate, and the dominant architecture in real engineering.</div><div class="card-formula">u = C(s) (r - y)</div></div>
<div class="calc-card"><div class="card-title">Reference r(t)</div><div class="card-body">What we want the output to be. A constant (set-point regulation), a slow ramp (cruise to 100 km/h), or a time-varying trajectory (a drone following a pre-planned path). The control problem is always defined relative to a reference.</div></div>
<div class="calc-card"><div class="card-title">Disturbance d(t)</div><div class="card-body">Everything the controller did not plan for: wind on a drone, a passenger getting into the car, the sun heating the room through a window. Feedback's superpower is that it rejects disturbances without ever modelling them explicitly.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-block-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the canonical negative-feedback loop. The reference r(s) enters at the left. The summing junction computes the error e = r - y. The controller C(s) produces the actuator command u(s). The plant P(s) responds with the output y(s), which is measured by the sensor H(s) (often taken as 1) and fed back to the summer with a minus sign. This single picture is the entire vocabulary of classical control: every PID controller, every motor servo, every drone autopilot is a special case of it.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var box=function(x0,y0,x1,y1,label,fill){return {type:'rect',x0:x0,y0:y0,x1:x1,y1:y1,line:{color:'#3b82f6',width:2},fillcolor:fill||'rgba(59,130,246,0.10)'};};
var shapes=[box(1.6,0.85,3.0,1.55,'C(s)'),box(3.9,0.85,5.3,1.55,'P(s)'),box(3.4,-0.55,4.4,0.15,'H(s)','rgba(245,158,11,0.10)')];
var annots=[
{x:2.3,y:1.2,text:'<b>C(s)</b><br>controller',showarrow:false,font:{color:'#3b82f6',size:13}},
{x:4.6,y:1.2,text:'<b>P(s)</b><br>plant',showarrow:false,font:{color:'#3b82f6',size:13}},
{x:3.9,y:-0.2,text:'<b>H(s)</b><br>sensor',showarrow:false,font:{color:'#f59e0b',size:12}},
{x:0.2,y:1.2,text:'r(s)',showarrow:false,font:{color:'#e8e8e8',size:13}},
{x:6.1,y:1.2,text:'y(s)',showarrow:false,font:{color:'#e8e8e8',size:13}},
{x:1.25,y:1.55,text:'+',showarrow:false,font:{color:'#3b82f6',size:18}},
{x:1.25,y:0.65,text:'-',showarrow:false,font:{color:'#f87171',size:18}},
{x:3.45,y:1.45,text:'u(s)',showarrow:false,font:{color:'#e8e8e8',size:11}},
{x:1.5,y:1.50,text:'e(s)',showarrow:false,font:{color:'#e8e8e8',size:11}}
];
var sum={x:[1.25],y:[1.2],mode:'markers',marker:{symbol:'circle-open',size:30,color:'#3b82f6',line:{width:2.5}},showlegend:false,name:'sum'};
var arrow1={x:[0.4,1.1],y:[1.2,1.2],mode:'lines',line:{color:'#e8e8e8',width:2},showlegend:false};
var arrow2={x:[1.4,1.6],y:[1.2,1.2],mode:'lines',line:{color:'#e8e8e8',width:2},showlegend:false};
var arrow3={x:[3.0,3.9],y:[1.2,1.2],mode:'lines',line:{color:'#e8e8e8',width:2},showlegend:false};
var arrow4={x:[5.3,5.95],y:[1.2,1.2],mode:'lines',line:{color:'#e8e8e8',width:2},showlegend:false};
var fb1={x:[5.7,5.7,4.4],y:[1.2,-0.2,-0.2],mode:'lines',line:{color:'#f59e0b',width:2},showlegend:false};
var fb2={x:[3.4,1.25,1.25],y:[-0.2,-0.2,1.05],mode:'lines',line:{color:'#f59e0b',width:2},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{visible:false,range:[0,6.5]},yaxis:{visible:false,range:[-1,2.2],scaleanchor:'x',scaleratio:1},shapes:shapes,annotations:annots,margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l1-block-en',[arrow1,arrow2,arrow3,arrow4,fb1,fb2,sum],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>One-line summary:</strong> open-loop hopes for the best; closed-loop measures the actual outcome and corrects. Every interesting control system in engineering is closed-loop.</div>

<h2 class="lesson-title">2. From an ODE to a Transfer Function</h2>

<div class="calc-highlight"><strong>The bridge from physics to algebra.</strong> A physical system gives us a differential equation in time. We want an algebraic equation we can manipulate, multiply, divide, and visualise as poles and zeros on the complex plane. The Laplace transform is what carries us across. With all initial conditions taken as zero, derivatives in time become multiplications by <em>s</em>, integrals become divisions by <em>s</em>, and the whole ODE collapses into a polynomial ratio Y(s)/X(s).</div>

<p class="l-text">Recall from Fourier L6 the single property that does all the work. If you have a function f(t) and you apply the one-sided Laplace transform <code>F(s) = \\int_{0}^{\\infty} f(t) e^{-st} dt</code>, then derivatives of f obey</p>

<div class="calc-formula"><div class="formula-label">DIFFERENTIATION PROPERTY (ZERO INITIAL CONDITIONS)</div><div class="formula-main">$$\\mathcal{L}\\{f'(t)\\} = s\\,F(s), \\qquad \\mathcal{L}\\{f''(t)\\} = s^{2}\\,F(s), \\qquad \\mathcal{L}\\{f^{(n)}(t)\\} = s^{n}\\,F(s)$$</div><div class="formula-sub">Initial conditions at t = 0 are set to zero — the standard assumption when defining a transfer function. Non-zero initial conditions add extra terms but do not change the transfer function itself.</div></div>

<p class="l-text">Now suppose a linear time-invariant (LTI) plant is described by the n-th order ODE</p>

<div class="calc-formula"><div class="formula-label">GENERAL LTI ODE</div><div class="formula-main">$$a_{n}\\,y^{(n)}(t) + \\cdots + a_{1}\\,y'(t) + a_{0}\\,y(t) = b_{m}\\,x^{(m)}(t) + \\cdots + b_{1}\\,x'(t) + b_{0}\\,x(t)$$</div><div class="formula-sub">x(t) is the input, y(t) the output. All coefficients constant. Linear in the unknown — no y^2, no sin(y).</div></div>

<p class="l-text">Apply Laplace to both sides with zero initial conditions, collect Y(s) on the left and X(s) on the right, and you get an algebraic equation. The <strong>transfer function</strong> is the ratio:</p>

<div class="calc-formula"><div class="formula-label">TRANSFER FUNCTION</div><div class="formula-main">$$H(s) = \\frac{Y(s)}{X(s)} = \\frac{b_{m}\\,s^{m} + \\cdots + b_{1}\\,s + b_{0}}{a_{n}\\,s^{n} + \\cdots + a_{1}\\,s + a_{0}}$$</div><div class="formula-sub">A ratio of polynomials in s. Roots of the numerator are the zeros. Roots of the denominator are the poles. The order of the system is the degree of the denominator, n.</div></div>

<p class="l-text">Three definitions you must know cold:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Poles</div><div class="card-body">Roots of the denominator polynomial. Each pole contributes one exponential mode to the time-domain response. Their locations in the s-plane decide stability: left half-plane is stable, right half-plane is unstable.</div></div>
<div class="calc-card"><div class="card-title">Zeros</div><div class="card-body">Roots of the numerator polynomial. They shape the response — boost certain frequencies, kill others — but they do not affect stability on their own.</div></div>
<div class="calc-card"><div class="card-title">Order</div><div class="card-body">Degree of the denominator polynomial. A first-order system has one pole. A second-order system has two. The order is also the number of independent energy storage elements in the physical system (capacitors and inductors, springs and inertias).</div></div>
<div class="calc-card"><div class="card-title">Proper vs improper</div><div class="card-body">A transfer function is proper if m &lt;= n (numerator degree at most equal to denominator). Strictly proper if m &lt; n. Real physical systems are always strictly proper — the output cannot respond instantaneously to a kick at the input.</div></div>
</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">Worked example: the RC low-pass filter</h3>

<p class="l-text">The simplest non-trivial control plant. A resistor R in series with a capacitor C, driven by an input voltage V_in(t), with the output V_out(t) measured across the capacitor. Kirchhoff's voltage law plus the capacitor relation <code>i = C \\, dV_{out}/dt</code> give</p>

<div class="calc-formula"><div class="formula-label">RC ODE</div><div class="formula-main">$$R\\,C\\,\\frac{dV_{out}}{dt} + V_{out}(t) = V_{in}(t)$$</div><div class="formula-sub">A first-order linear ODE with constant coefficients. Time constant tau = RC seconds.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Apply Laplace, zero initial condition</div><div class="step-detail">L{dV_out/dt} = s V_out(s). The ODE becomes RC * s V_out(s) + V_out(s) = V_in(s).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Factor V_out(s) on the left</div><div class="step-detail">(RC s + 1) V_out(s) = V_in(s).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Solve for the ratio</div><div class="step-detail">H(s) = V_out(s) / V_in(s) = 1 / (RC s + 1).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">TRANSFER FUNCTION OF AN RC LOW-PASS</div><div class="formula-main">$$H(s) = \\frac{V_{out}(s)}{V_{in}(s)} = \\frac{1}{1 + s\\,R\\,C} = \\frac{1/(RC)}{s + 1/(RC)}$$</div><div class="formula-sub">A single pole at s = -1/(RC). No zeros. DC gain H(0) = 1 (a steady input passes through unchanged). High-frequency gain rolls off at -20 dB/decade.</div></div>

<div class="l-note"><strong>What just happened:</strong> a differential equation in time became a ratio of polynomials in s. The dynamic behaviour of the circuit — its time constant, its frequency response, its step response, its stability — can now be read directly off the polynomial. This is the entire payoff of the Laplace formalism for control engineering.</div>

<h2 class="lesson-title">3. Standard System Forms</h2>

<div class="calc-highlight"><strong>Two canonical templates handle most of what you will meet in undergraduate and entry-level industrial control.</strong> The first-order template K/(tau s + 1) describes anything dominated by a single energy-storage element: an RC filter, a temperature in a well-stirred tank, the first-order approximation of a motor speed. The second-order template omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2) describes anything with two storage elements that can exchange energy: a mass on a spring, an RLC circuit, the position loop of a motor. Memorise both forms, learn to recognise them on sight, and 80 percent of your work is done.</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">3.1 First-order standard form</h3>

<div class="calc-formula"><div class="formula-label">FIRST-ORDER STANDARD FORM</div><div class="formula-main">$$H(s) = \\frac{K}{\\tau\\,s + 1}$$</div><div class="formula-sub">K is the DC (steady-state) gain. tau is the time constant in seconds. One pole at s = -1/tau. No finite zeros.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DC gain K = H(0)</div><div class="card-body">The steady-state ratio of output to input. Set s = 0: H(0) = K. If you apply a constant input of size A, the output settles to K * A.</div></div>
<div class="calc-card"><div class="card-title">Time constant tau</div><div class="card-body">The seconds it takes the step response to reach 63.2 percent of its final value. After 5 tau, the response is within 0.7 percent of steady state. tau is the single number that summarises the speed of any first-order system.</div></div>
<div class="calc-card"><div class="card-title">Pole at s = -1/tau</div><div class="card-body">Always on the negative real axis for a stable system. The further from the origin, the faster the response. tau = 1 ms gives a pole at -1000 rad/s; tau = 1 s gives a pole at -1 rad/s.</div></div>
<div class="calc-card"><div class="card-title">Step response</div><div class="card-body">y(t) = K (1 - e^{-t/tau}). Pure exponential approach to K, no overshoot, no oscillation. The classic capacitor charging curve.</div></div>
</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">3.2 Second-order standard form</h3>

<div class="calc-formula"><div class="formula-label">SECOND-ORDER STANDARD FORM</div><div class="formula-main">$$H(s) = \\frac{\\omega_{n}^{2}}{s^{2} + 2\\,\\zeta\\,\\omega_{n}\\,s + \\omega_{n}^{2}}$$</div><div class="formula-sub">omega_n is the natural angular frequency (rad/s). zeta is the dimensionless damping ratio. DC gain H(0) = 1.</div></div>

<p class="l-text">The two parameters that decide everything are <code>\\omega_{n}</code> and <code>\\zeta</code>. The poles solve <code>s^{2} + 2 \\zeta \\omega_{n} s + \\omega_{n}^{2} = 0</code>, giving</p>

<div class="calc-formula"><div class="formula-label">POLES OF THE STANDARD SECOND-ORDER SYSTEM</div><div class="formula-main">$$s_{1,2} = -\\zeta\\,\\omega_{n} \\pm \\omega_{n}\\,\\sqrt{\\zeta^{2} - 1}$$</div><div class="formula-sub">The square root decides the regime. The discriminant zeta^2 - 1 controls everything we will say about overshoot, ringing, and settling time.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Natural frequency omega_n</div><div class="card-body">The frequency at which the system would oscillate if you removed all damping (zeta = 0). Sets the time scale. Bigger omega_n -&gt; faster everything.</div></div>
<div class="calc-card"><div class="card-title">Damping ratio zeta = 0</div><div class="card-body">Undamped — pure imaginary poles at +/- i omega_n. Forever oscillating sinusoid. A lossless LC tank, an idealised swinging pendulum without friction.</div></div>
<div class="calc-card"><div class="card-title">zeta in (0, 1) — underdamped</div><div class="card-body">Complex conjugate poles at -zeta omega_n +/- i omega_n sqrt(1 - zeta^2). Step response overshoots, rings, decays. The damped frequency is omega_d = omega_n sqrt(1 - zeta^2).</div></div>
<div class="calc-card"><div class="card-title">zeta = 1 — critically damped</div><div class="card-body">Double real pole at s = -omega_n. The fastest possible response without any overshoot. The sweet spot when overshoot is unacceptable.</div></div>
<div class="calc-card"><div class="card-title">zeta &gt; 1 — overdamped</div><div class="card-body">Two distinct negative real poles. No oscillation, no overshoot, but the response is slower than critical damping. Picture a screen door with a heavy dashpot.</div></div>
<div class="calc-card"><div class="card-title">zeta = 0.707 — engineering target</div><div class="card-body">About 4.3 percent overshoot, fast settle, no excessive ringing. The Butterworth filter places its poles here. A common default when nothing else dictates the choice.</div></div>
</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">3.3 Higher-order systems</h3>

<p class="l-text">In real engineering you frequently meet plants of third order, fourth order, sometimes much more. Three rules tame them:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dominant pole approximation</div><div class="card-body">If one pole lies much closer to the imaginary axis than the others (its real part is at least 5 times smaller in magnitude), it dominates the slow dynamics. The higher-order system behaves approximately like a first-order system with that one pole.</div></div>
<div class="calc-card"><div class="card-title">Dominant complex pair</div><div class="card-body">If a complex conjugate pair sits much closer to the imaginary axis than any other pole, the response looks like the standard second-order form parametrised by the omega_n and zeta of that pair.</div></div>
<div class="calc-card"><div class="card-title">Partial fractions</div><div class="card-body">Always available. Decompose H(s) into a sum of first-order and second-order terms; invert each separately; sum the resulting time-domain responses. Tedious but algorithmic.</div></div>
</div>

<div class="l-note"><strong>The engineer's reflex:</strong> when you meet an unfamiliar H(s), the first move is always the same — find the poles and zeros, locate them on the s-plane, identify which poles dominate, and recognise whether the dominant behaviour is first-order or second-order.</div>

<h2 class="lesson-title">4. The Mechanical-Electrical Analogy</h2>

<div class="calc-highlight"><strong>The same equation describes wildly different physical systems.</strong> A mass on a spring with a dashpot satisfies <em>m x'' + c x' + k x = F(t)</em>. An RLC circuit satisfies <em>L q'' + R q' + (1/C) q = V(t)</em>. The two equations are mathematically identical — only the names of the symbols differ. The whole control toolbox we build in this lesson applies, unchanged, to <em>both</em>.</div>

<p class="l-text">There are two standard analogies. The <strong>force-voltage</strong> analogy treats Newton's law and Kirchhoff's voltage law as parallels. The <strong>force-current</strong> analogy treats Newton's law and Kirchhoff's current law as parallels. Force-voltage is the more common in introductory courses and we use it throughout.</p>

<div class="calc-formula"><div class="formula-label">FORCE-VOLTAGE ANALOGY</div><div class="formula-main">$$\\underbrace{m\\,x'' + c\\,x' + k\\,x}_{\\text{mechanical}} = F(t) \\qquad \\Longleftrightarrow \\qquad \\underbrace{L\\,q'' + R\\,q' + (1/C)\\,q}_{\\text{electrical}} = V(t)$$</div><div class="formula-sub">Same ODE structure. The transfer function from F to x is mathematically the same as the transfer function from V to q.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">mass m  ↔  inductance L</div><div class="card-body">Both store kinetic-like energy and resist a change in their "flow" variable (velocity for the mass, current for the inductor). Both contribute the coefficient of the highest derivative in the ODE.</div></div>
<div class="calc-card"><div class="card-title">damping c  ↔  resistance R</div><div class="card-body">Both dissipate energy proportionally to the flow variable. Both contribute the coefficient of the first derivative. Higher c or R -&gt; more damping, larger zeta, slower decay.</div></div>
<div class="calc-card"><div class="card-title">spring constant k  ↔  reciprocal capacitance 1/C</div><div class="card-body">Both store potential-like energy proportional to displacement. Both contribute the coefficient of the undifferentiated variable.</div></div>
<div class="calc-card"><div class="card-title">force F  ↔  voltage V</div><div class="card-body">Both are the driving input. The transfer function from F to displacement matches the transfer function from V to charge.</div></div>
<div class="calc-card"><div class="card-title">displacement x  ↔  charge q</div><div class="card-body">Both are the integrated "flow" variable — what the system stores up in its potential element (spring or capacitor).</div></div>
<div class="calc-card"><div class="card-title">velocity x'  ↔  current i = q'</div><div class="card-body">Both are the "flow" through the system — what passes through the kinetic-like element (mass or inductor).</div></div>
</div>

<div class="calc-example"><div class="example-label">EQUIVALENT SYSTEMS</div><div class="example-body"><strong>Mass-spring-damper:</strong> m = 1 kg, c = 2 N s/m, k = 25 N/m. The transfer function from force to displacement is<br><br>H(s) = 1 / (s^2 + 2 s + 25).<br><br><strong>Equivalent RLC circuit:</strong> L = 1 H, R = 2 ohm, 1/C = 25 (so C = 40 mF). The transfer function from voltage to charge is the same 1 / (s^2 + 2 s + 25). omega_n = 5 rad/s. zeta = 1/5 = 0.2 (underdamped). Same step response shape, same overshoot, same settling time. The two systems are dynamically twins.</div></div>

<div class="calc-graph"><div id="plot-l1-analogy-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the step response of the mass-spring-damper (blue) and the step response of the equivalent RLC circuit (amber dashed) lie exactly on top of each other. Two completely different physical systems, two completely different sets of measurement units, one identical curve. This is why control engineers reason about H(s) directly — physics drops out, mathematics takes over.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=500;i++)t.push(i/40);
var wn=5,z=0.2,wd=wn*Math.sqrt(1-z*z);
var y=[];
for(var i=0;i<t.length;i++){var x=t[i];y.push((1/(wn*wn))*(1-Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z*wn/wd)*Math.sin(wd*x))));}
var d1={x:t,y:y,mode:'lines',name:'mass-spring-damper x(t)/F',line:{color:'#3b82f6',width:2.6}};
var d2={x:t,y:y.map(function(v){return v;}),mode:'lines',name:'RLC q(t)/V',line:{color:'#f59e0b',width:2.4,dash:'dash'}};
var ss={x:[0,12.5],y:[1/25,1/25],mode:'lines',line:{color:'#888',width:1,dash:'dot'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'output / input',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-analogy-en',[ss,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Block Diagram Algebra</h2>

<div class="calc-highlight"><strong>A block diagram is a visual algebra.</strong> Each block is a transfer function. Wires carry signals. Summing junctions add and subtract. Three rules — series, parallel, feedback — reduce any block diagram, no matter how tangled it looks, to a single transfer function from any chosen input to any chosen output. Mastering these three rules is mastering the bookkeeping of classical control.</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">5.1 Series (cascade) connection</h3>

<p class="l-text">Two blocks one after the other, the output of the first feeding the input of the second. The signal feels each block in turn; their effects multiply.</p>

<div class="calc-formula"><div class="formula-label">SERIES RULE</div><div class="formula-main">$$Y(s) = H_{2}(s)\\,H_{1}(s)\\,X(s) \\quad\\Longrightarrow\\quad H_{\\text{total}}(s) = H_{1}(s)\\,H_{2}(s)$$</div><div class="formula-sub">Multiplication in s for series connection. Order does not matter for LTI blocks — but in real hardware it absolutely matters because of loading and impedance.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">5.2 Parallel connection</h3>

<p class="l-text">Two blocks driven by the same input, their outputs summed. Linear superposition lets us simply add the transfer functions.</p>

<div class="calc-formula"><div class="formula-label">PARALLEL RULE</div><div class="formula-main">$$Y(s) = [H_{1}(s) + H_{2}(s)]\\,X(s) \\quad\\Longrightarrow\\quad H_{\\text{total}}(s) = H_{1}(s) + H_{2}(s)$$</div><div class="formula-sub">Addition in s for parallel connection. Useful for representing controllers with proportional plus derivative paths, or for combining two feedforward terms.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">5.3 Negative feedback — the master formula</h3>

<p class="l-text">Forward path G(s) in a loop with feedback path H(s), output sensed and subtracted from the reference. Derive the closed-loop transfer function:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Write the loop equations</div><div class="step-detail">E(s) = R(s) - H(s) Y(s). And Y(s) = G(s) E(s).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Substitute</div><div class="step-detail">Y = G (R - H Y) = G R - G H Y. Hence Y + G H Y = G R, so (1 + G H) Y = G R.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Solve</div><div class="step-detail">Y/R = G / (1 + G H). Done.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">NEGATIVE FEEDBACK CLOSED-LOOP TRANSFER FUNCTION</div><div class="formula-main">$$T(s) = \\frac{Y(s)}{R(s)} = \\frac{G(s)}{1 + G(s)\\,H(s)}$$</div><div class="formula-sub">The single most important formula in classical control. The denominator 1 + GH is the characteristic polynomial of the closed loop; its roots are the closed-loop poles. Choosing those poles is most of what controller design is about.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Unity feedback H = 1</div><div class="card-body">Most common case. T = G / (1 + G). Direct measurement of the output with no sensor dynamics. Almost every introductory PID design problem assumes unity feedback.</div></div>
<div class="calc-card"><div class="card-title">Loop gain L = G H</div><div class="card-body">The product G H is the "loop gain" you see whenever you trace the signal once around the loop. Large loop gain makes T approach 1/H — the feedback dominates the open-loop dynamics. This is feedback's magic.</div></div>
<div class="calc-card"><div class="card-title">Positive feedback (sign flipped)</div><div class="card-body">T = G / (1 - G H). Less common, usually unstable. Used in oscillator design and in some signal-conditioning circuits, but absent from most servo control.</div></div>
</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">5.4 Worked block-diagram reduction</h3>

<div class="calc-example"><div class="example-label">PROPORTIONAL CONTROL ON A FIRST-ORDER PLANT</div><div class="example-body"><strong>Plant:</strong> G(s) = 2/(s + 3) (a first-order lag).<br><strong>Controller:</strong> C(s) = K (pure proportional gain).<br><strong>Sensor:</strong> unity feedback H = 1.<br><br>Forward path: G_forward = C(s) G(s) = 2K/(s + 3).<br>Closed loop: T(s) = G_forward / (1 + G_forward) = [2K/(s + 3)] / [1 + 2K/(s + 3)] = 2K / (s + 3 + 2K).<br><br><strong>Closed-loop pole:</strong> s = -(3 + 2K). Open-loop pole was at -3. With K = 5, the closed-loop pole moves to -13 — more than four times faster.<br><strong>DC gain:</strong> T(0) = 2K/(3 + 2K). For K = 5, T(0) = 10/13 ~ 0.77. There is a steady-state error of 23 percent — proportional control alone cannot drive it to zero. This is why we add integral action later (Lesson 4).</div></div>

<div class="l-note"><strong>The lesson of feedback in one line:</strong> a knob K moves the closed-loop pole around the s-plane. Engineering judgement decides where to put it.</div>

<h2 class="lesson-title">6. Step Response and Time-Domain Performance</h2>

<div class="calc-highlight"><strong>The step response is the universal benchmark.</strong> Apply a sudden unit jump at the input and watch the output settle. Every classical performance specification — overshoot, rise time, settling time, peak time — is read off the step response of the standard second-order system. Knowing these four numbers in terms of zeta and omega_n means knowing how to translate an engineering requirement ("less than 10 percent overshoot, settle within 2 seconds") into a pole location.</div>

<p class="l-text">For the standard second-order underdamped system <code>H(s) = \\omega_{n}^{2}/(s^{2} + 2 \\zeta \\omega_{n} s + \\omega_{n}^{2})</code> driven by a unit step <code>R(s) = 1/s</code>, the output Y(s) = H(s)/s inverts to</p>

<div class="calc-formula"><div class="formula-label">UNDERDAMPED STEP RESPONSE</div><div class="formula-main">$$y(t) = 1 - \\frac{e^{-\\zeta\\,\\omega_{n}\\,t}}{\\sqrt{1 - \\zeta^{2}}}\\,\\sin\\!\\left(\\omega_{d}\\,t + \\phi\\right), \\qquad \\omega_{d} = \\omega_{n}\\,\\sqrt{1 - \\zeta^{2}}, \\quad \\phi = \\arccos(\\zeta)$$</div><div class="formula-sub">Damped oscillation under an exponential envelope. omega_d is the damped frequency; phi is the phase that makes y(0) = 0.</div></div>

<p class="l-text">Reading the four performance numbers off this expression:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Peak time t_p</div><div class="card-body">When the first peak occurs. Solve dy/dt = 0 and take the first positive root: t_p = pi / omega_d. Smaller t_p means a faster initial rise.</div><div class="card-formula">t_p = pi / omega_d</div></div>
<div class="calc-card"><div class="card-title">Percent overshoot M_p</div><div class="card-body">By how much y(t_p) exceeds the final value of 1. M_p = exp(-pi zeta / sqrt(1 - zeta^2)). Depends only on zeta — independent of omega_n. zeta = 0.2 gives 53 percent, zeta = 0.5 gives 16.3 percent, zeta = 0.707 gives 4.3 percent, zeta = 1 gives 0 percent.</div><div class="card-formula">M_p = e^{-pi zeta / sqrt(1-zeta^2)}</div></div>
<div class="calc-card"><div class="card-title">Settling time t_s</div><div class="card-body">When the response enters and stays within a 2 percent band of the final value. Approximated by t_s ~ 4/(zeta omega_n). The product zeta omega_n — the real part of the dominant pole — sets the settling speed.</div><div class="card-formula">t_s ~ 4 / (zeta omega_n)</div></div>
<div class="calc-card"><div class="card-title">Rise time t_r</div><div class="card-body">Time to go from 10 percent to 90 percent of the final value. Approximated by t_r ~ (1.8/omega_n) for zeta = 0.5 to 0.8. Larger omega_n -&gt; faster rise.</div><div class="card-formula">t_r ~ 1.8 / omega_n</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-step-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> step responses of the standard second-order system with omega_n = 1 rad/s for five damping ratios. zeta = 0.2 overshoots violently. zeta = 0.5 still has a bump. zeta = 0.707 (the Butterworth sweet spot) shows about 4 percent overshoot. zeta = 1 is critically damped — no overshoot, fastest pure-exponential return. zeta = 2 is overdamped — no overshoot but slower than critical. The whole craft of second-order design is choosing zeta.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=600;i++)t.push(i/40);
function step(z){
  var wn=1;var out=[];
  for(var i=0;i<t.length;i++){
    var x=t[i],y;
    if(Math.abs(z-1)<1e-6){y=1-Math.exp(-wn*x)*(1+wn*x);}
    else if(z<1){var wd=wn*Math.sqrt(1-z*z);y=1-Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z/Math.sqrt(1-z*z))*Math.sin(wd*x));}
    else{var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;y=1-(r2*Math.exp(r1*x)-r1*Math.exp(r2*x))/(r2-r1);}
    out.push(y);
  }
  return out;
}
var target={x:[0,15],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var d1={x:t,y:step(0.2),mode:'lines',name:'zeta=0.2',line:{color:'#f87171',width:2.4}};
var d2={x:t,y:step(0.5),mode:'lines',name:'zeta=0.5',line:{color:'#f59e0b',width:2.4}};
var d3={x:t,y:step(0.707),mode:'lines',name:'zeta=0.707',line:{color:'#3b82f6',width:2.6}};
var d4={x:t,y:step(1.0),mode:'lines',name:'zeta=1',line:{color:'#10b981',width:2.4}};
var d5={x:t,y:step(2.0),mode:'lines',name:'zeta=2',line:{color:'#a78bfa',width:2.4,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.7]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-step-en',[target,d1,d2,d3,d4,d5],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l1-poles-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same five damping ratios on the s-plane. The poles all lie on a circle of radius omega_n = 1 centred at the origin (because the magnitude of each pole is exactly omega_n). The angle from the negative real axis equals arccos(zeta). zeta = 0.2 gives poles very close to the imaginary axis — heavy oscillation. zeta = 1 collapses both poles to the same point on the real axis. zeta = 2 splits them along the real axis — pure exponential.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var zs=[0.2,0.5,0.707,1.0,2.0];
var colours=['#f87171','#f59e0b','#3b82f6','#10b981','#a78bfa'];
var traces=[];
for(var k=0;k<zs.length;k++){
  var z=zs[k];var wn=1;
  if(z<1){var wd=wn*Math.sqrt(1-z*z);
    traces.push({x:[-z*wn,-z*wn],y:[wd,-wd],mode:'markers',name:'zeta='+z,marker:{symbol:'x',size:14,color:colours[k],line:{width:3}}});
  }else if(Math.abs(z-1)<1e-6){
    traces.push({x:[-wn],y:[0],mode:'markers',name:'zeta=1 (double)',marker:{symbol:'x',size:18,color:colours[k],line:{width:4}}});
  }else{var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;
    traces.push({x:[r1,r2],y:[0,0],mode:'markers',name:'zeta='+z,marker:{symbol:'x',size:14,color:colours[k],line:{width:3}}});
  }
}
var axisLine={x:[0,0],y:[-1.4,1.4],mode:'lines',line:{color:'#888',width:1.5,dash:'dash'},showlegend:false};
var circle={x:[],y:[]};
for(var j=0;j<=200;j++){var th=Math.PI*0.5+(j/200)*Math.PI;circle.x.push(Math.cos(th));circle.y.push(Math.sin(th));}
circle.mode='lines';circle.line={color:'rgba(150,150,150,0.4)',width:1,dash:'dot'};circle.showlegend=false;circle.name='|s|=omega_n';
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-2.3,0.6]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.4,1.4],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:-1.7,y:1.15,text:'LHP (stable)',showarrow:false,font:{color:'#3b82f6',size:12}}]};
Plotly.newPlot('plot-l1-poles-en',[axisLine,circle].concat(traces),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Design recipe.</strong> Want less than 10 percent overshoot? Need zeta &gt;= 0.59. Want to settle in 1 second? Need zeta omega_n &gt;= 4. Combine the two and you have a region of the s-plane where your dominant pole must lie. Every classical pole-placement design is a search inside such a region.</div>

<h2 class="lesson-title">7. Impulse, Step, and Ramp Responses</h2>

<div class="calc-highlight"><strong>Three standard test signals, three windows into the system.</strong> The unit impulse delta(t) probes the natural modes of the system — the impulse response IS the inverse Laplace of H(s). The unit step u(t) is the workhorse acceptance test of every control loop. The unit ramp t exposes how well the loop tracks a moving reference and how big the steady-state error becomes. Engineers compute all three responses early when sizing a new system.</div>

<p class="l-text">In Laplace, the three standard inputs have these transforms:</p>

<div class="calc-formula"><div class="formula-label">STANDARD TEST INPUTS</div><div class="formula-main">$$\\mathcal{L}\\{\\delta(t)\\} = 1, \\qquad \\mathcal{L}\\{u(t)\\} = \\frac{1}{s}, \\qquad \\mathcal{L}\\{t\\cdot u(t)\\} = \\frac{1}{s^{2}}$$</div><div class="formula-sub">Impulse, step, ramp. Each is the time integral of the previous: integrate delta to get step, integrate step to get ramp. Each is one extra division by s in the s-domain.</div></div>

<p class="l-text">For any LTI system with transfer function H(s), the response to each input is computed by inverse-Laplacing the product:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Impulse response</div><div class="card-body">y_imp(t) = L^{-1}{H(s)}. The pure natural-mode behaviour. If H(s) = 1/(s + a) then y_imp(t) = e^{-at}. The impulse response is the system's fingerprint.</div></div>
<div class="calc-card"><div class="card-title">Step response</div><div class="card-body">y_step(t) = L^{-1}{H(s)/s}. What you see when you suddenly turn the input on. Used for set-point tracking specs (overshoot, rise time, settling time).</div></div>
<div class="calc-card"><div class="card-title">Ramp response</div><div class="card-body">y_ramp(t) = L^{-1}{H(s)/s^2}. Tracking a steadily moving reference. Reveals the system's "Type" — how many integrators it has. A Type-0 system has a finite steady-state error to a step but an unbounded error to a ramp.</div></div>
</div>

<div class="calc-example"><div class="example-label">FIRST-ORDER SYSTEM H(s) = 1/(s + 1) — ALL THREE RESPONSES</div><div class="example-body"><strong>Impulse:</strong> Y(s) = 1/(s + 1). Inverse: y_imp(t) = e^{-t}.<br><strong>Step:</strong> Y(s) = 1/[s(s + 1)] = 1/s - 1/(s + 1). Inverse: y_step(t) = 1 - e^{-t}.<br><strong>Ramp:</strong> Y(s) = 1/[s^2(s + 1)] = 1/s^2 - 1/s + 1/(s + 1). Inverse: y_ramp(t) = t - 1 + e^{-t}.<br><br>Notice the pattern: each response is one more integration of the previous. Notice also the steady-state behaviour: impulse goes to 0, step goes to 1, ramp lags the input by exactly 1 second forever — a constant tracking error.</div></div>

<div class="calc-graph"><div id="plot-l1-impulse-step-ramp-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the impulse (red), step (blue), and ramp (amber dashed) responses of H(s) = 1/(s + 1). The impulse response decays from 1 to 0 — pure natural mode. The step response charges up exponentially to 1 — classic first-order rise. The ramp response follows the input ramp t (dotted grey) with a constant lag of 1 second — the steady-state tracking error.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/40);
var imp=[],stp=[],rmp=[],ref=[];
for(var i=0;i<t.length;i++){var x=t[i];imp.push(Math.exp(-x));stp.push(1-Math.exp(-x));rmp.push(x-1+Math.exp(-x));ref.push(x);}
var d1={x:t,y:imp,mode:'lines',name:'impulse response',line:{color:'#f87171',width:2.4}};
var d2={x:t,y:stp,mode:'lines',name:'step response',line:{color:'#3b82f6',width:2.6}};
var d3={x:t,y:rmp,mode:'lines',name:'ramp response',line:{color:'#f59e0b',width:2.4,dash:'dash'}};
var d4={x:t,y:ref,mode:'lines',name:'ramp input t',line:{color:'#888',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'response',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,10]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-impulse-step-ramp-en',[d4,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Convolution view.</strong> All three responses are special cases of the general output formula y(t) = (h * x)(t) — the impulse response h(t) convolved with the input x(t). In the s-domain convolution becomes multiplication: Y(s) = H(s) X(s). One identity, three pictures.</div>

<h2 class="lesson-title">8. Worked Example — DC Motor Transfer Function</h2>

<div class="calc-highlight"><strong>The single most-used plant model in control labs worldwide.</strong> A brushed DC motor: apply voltage at the terminals, draw armature current, generate torque, accelerate the shaft, build angular velocity. Five coupled physical equations — Kirchhoff on the armature loop, Newton's law on the rotor, plus the two motor constants — collapse into one compact transfer function. We derive it now from first principles.</div>

<p class="l-text"><strong>Variables:</strong> input voltage V(t) (V), armature current i(t) (A), back-EMF e_b(t) (V), motor torque tau_m(t) (N m), angular velocity omega(t) (rad/s).</p>

<p class="l-text"><strong>Constants:</strong> armature resistance R (ohm), armature inductance L (H), torque constant K_t (N m/A), back-EMF constant K_e (V s/rad), moment of inertia J (kg m^2), viscous friction coefficient b (N m s/rad).</p>

<div class="calc-formula"><div class="formula-label">FIVE PHYSICAL EQUATIONS</div><div class="formula-main">$$V(t) = R\\,i(t) + L\\,\\frac{di}{dt} + e_{b}(t), \\qquad e_{b}(t) = K_{e}\\,\\omega(t), \\qquad \\tau_{m}(t) = K_{t}\\,i(t), \\qquad J\\,\\frac{d\\omega}{dt} + b\\,\\omega(t) = \\tau_{m}(t)$$</div><div class="formula-sub">Kirchhoff's voltage law on the armature loop, back-EMF generated by the spinning rotor, torque proportional to current, Newton's second law on the inertia with viscous friction.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Take Laplace of everything (zero initial conditions)</div><div class="step-detail">V(s) = R I(s) + L s I(s) + K_e Omega(s). And J s Omega(s) + b Omega(s) = K_t I(s).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Solve the second equation for I(s)</div><div class="step-detail">I(s) = (J s + b) Omega(s) / K_t.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Substitute into the first</div><div class="step-detail">V(s) = (R + L s) (J s + b) Omega(s) / K_t + K_e Omega(s).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Factor Omega(s)</div><div class="step-detail">V(s) = Omega(s) * [(R + L s)(J s + b) + K_e K_t] / K_t.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Read off the transfer function</div><div class="step-detail">Omega(s) / V(s) = K_t / [(R + L s)(J s + b) + K_e K_t].</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">DC MOTOR TRANSFER FUNCTION (FULL)</div><div class="formula-main">$$\\frac{\\Omega(s)}{V(s)} = \\frac{K_{t}}{L\\,J\\,s^{2} + (R\\,J + L\\,b)\\,s + (R\\,b + K_{e}\\,K_{t})}$$</div><div class="formula-sub">A standard second-order system. One pole each from the electrical (R, L) and mechanical (J, b) energy storages. The coupling K_e K_t appears in the constant term.</div></div>

<p class="l-text"><strong>The standard simplification.</strong> The armature inductance L is usually tiny compared to the mechanical time constant. Setting L = 0 collapses the system to first order:</p>

<div class="calc-formula"><div class="formula-label">DC MOTOR — FIRST-ORDER APPROXIMATION (L NEGLECTED)</div><div class="formula-main">$$\\frac{\\Omega(s)}{V(s)} \\approx \\frac{K_{t}/(R\\,b + K_{e}\\,K_{t})}{\\tau_{m}\\,s + 1}, \\qquad \\tau_{m} = \\frac{R\\,J}{R\\,b + K_{e}\\,K_{t}}$$</div><div class="formula-sub">The mechanical time constant tau_m sets the speed of the response. DC gain K = K_t / (R b + K_e K_t). One pole, fast and clean.</div></div>

<div class="calc-example"><div class="example-label">NUMERICAL EXAMPLE — A SMALL HOBBY MOTOR</div><div class="example-body"><strong>Parameters:</strong> R = 1 ohm, L = 0.5 mH, K_t = K_e = 0.01 N m/A, J = 0.01 kg m^2, b = 0.1 N m s/rad. Apply V = 12 V step.<br><br>Full denominator: L J = 5e-6. R J + L b = 0.01 + 5e-5 ~ 0.01. R b + K_e K_t = 0.1 + 1e-4 ~ 0.1001. Steady-state omega = K_t V / (R b + K_e K_t) = 0.01 * 12 / 0.1001 ~ 1.20 rad/s.<br>tau_m = R J / (R b + K_e K_t) = 0.01 / 0.1001 ~ 0.0999 s. So omega(t) ~ 1.20 (1 - e^{-t/0.1}). After 0.5 s the motor is essentially at steady speed.</div></div>

<div class="calc-graph"><div id="plot-l1-dcmotor-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the angular velocity step response of the example DC motor. Apply 12 V at t = 0. The shaft accelerates with mechanical time constant tau_m ~ 0.1 s. After 5 tau_m ~ 0.5 s it has settled to the asymptotic 1.20 rad/s. The dashed line marks the 63 percent level — the standard one-tau benchmark.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/400);
var tau=0.1,ss=1.20;
var y=[];for(var i=0;i<t.length;i++)y.push(ss*(1-Math.exp(-t[i]/tau)));
var d={x:t,y:y,mode:'lines',name:'omega(t)',line:{color:'#3b82f6',width:2.6}};
var ssLine={x:[0,1],y:[ss,ss],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var tauMark={x:[tau,tau],y:[0,0.632*ss],mode:'lines',line:{color:'#f59e0b',width:1.5,dash:'dot'},showlegend:false};
var tauPt={x:[tau],y:[0.632*ss],mode:'markers',name:'t = tau (63%)',marker:{size:10,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-dcmotor-en',[ssLine,d,tauMark,tauPt],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why DC motors are everywhere in control labs.</strong> They are cheap, predictable, easy to instrument, and their transfer function maps perfectly to the standard forms of this lesson. Every introductory PID lab in the world uses a DC motor either physically or in simulation. Knowing this model is part of the EE birthright.</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Things to try.</strong> (a) Set <code>tau = 1.0</code> in section 1 — the response is a thousand times slower, exactly as the pole at -1 predicts. (b) In section 2 set <code>zeta = 0.0</code> — undamped oscillation, the system rings forever and the metric for settling time becomes infinite. (c) In section 3 set <code>L = 0.1</code> H — now the inductance is no longer negligible and the full second-order denominator shows it; the first-order approximation lies further from the truth.</p>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">Control systems split into open-loop (no measurement) and closed-loop (output measured and fed back). Closed-loop is the dominant architecture because it rejects disturbances and tolerates plant uncertainty. A linear time-invariant ODE with zero initial conditions Laplace-transforms into a transfer function H(s) = Y(s)/X(s) — a ratio of polynomials whose denominator roots are the system's poles. The first-order canonical form K/(tau s + 1) and the second-order canonical form omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2) cover most of the systems you will meet at this stage of training. The mechanical-electrical analogy lets the same control machinery rule both a spring-mass-damper and an RLC circuit. Three block-diagram rules — series H_1 H_2, parallel H_1 + H_2, negative feedback G/(1 + GH) — reduce any diagram to one transfer function. From zeta and omega_n you read overshoot M_p, peak time pi/omega_d, settling time 4/(zeta omega_n), and rise time 1.8/omega_n directly. The DC motor derivation collapses five physical equations into one second-order H(s), and dropping the small armature inductance L recovers a clean first-order model. The next lesson takes the same machinery into the frequency domain — Bode plots, gain and phase margins, all built on the transfer function we now know how to write.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Kontrol teorisi tek bir soruyla başlar: fiziksel bir sistemi istediğimiz şeyi yapacak hale nasıl getiririz?</strong> Hız sabitleyici, yol yokuş yukarı dönse bile arabayı 100 km/s'te tutmalıdır. Termostat, biri pencereyi açtığında dahi odayı 22 C'de tutmalıdır. Bir drone, rüzgar darbelerine, gerilim düşmelerine ve yaşlanmış motorlara rağmen rotor açısını otopilotun istediği yerde tutmalıdır. Bu sorunların her biri kapalı bir çevrim ile çözülür — çıkışı ölç, hedefle karşılaştır, hatayı tekrar girişe gönder — ve her kapalı çevrim bir yerde <em>doğrusal zamanla değişmez</em> bir matematiksel modelin üzerinde oturur.</p>

<p class="l-text">Bu, Kontrol Teorisi izleğinin temel dersi. Kararlılık marjlarından, PID ayarından, durum-uzayından ve Lyapunov'dan önce alfabeyi öğrenmemiz gerek: fiziksel bir sistemi tanımlayan diferansiyel denklemi karmaşık değişken <em>s</em>'de bir <strong>transfer fonksiyonuna</strong> nasıl çevireceğimizi, sistemi bir blok diyagramı olarak nasıl çizeceğimizi, o blokları nasıl birleştirip indirgeyeceğimizi ve sayfadaki parametrelerden zaman cevabını nasıl öngöreceğimizi. İyi haber şu: bu mekanizmanın çoğuyla zaten matematik izleğinde tanıştın — Fourier L6'daki Laplace dönüşümü, Diffeq L2'deki ikinci mertebe ODE. Burada onu, her çalışan kontrol mühendisinin her gün kullandığı mühendislik diline taşıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Açık çevrim ile kapalı çevrim kontrol sistemini birbirinden ayırt etmek ve her birinin blok diyagramını çizmek</li>
<li>Sıfır başlangıç koşullarıyla sabit katsayılı doğrusal bir ODE'yi H(s) = Y(s)/X(s) transfer fonksiyonuna çevirmek</li>
<li>Birinci mertebe kanonik biçim K/(tau s + 1) ile ikinci mertebe kanonik biçim omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2) formlarını bakar bakmaz tanımak</li>
<li>Mekanik-elektrik benzeşimini kullanarak kütle-yay-sönümleyici ile RLC devresi arasında akıcı geçiş yapmak</li>
<li>Seri, paralel ve negatif geri besleme bağlantıları içeren bir blok diyagramını tek bir transfer fonksiyonuna indirgemek</li>
<li>İkinci mertebe sistemin sönüm oranı zeta ve doğal frekansı omega_n'den aşımı, yükselme süresini, tepe zamanını ve oturma süresini okumak</li>
</ul>
</div>

<h2 class="lesson-title">1. Kontrol Sistemi Nedir?</h2>

<div class="calc-highlight"><strong>Günlük benzetme:</strong> arabanızdaki hız sabitleyici bir kontrol sistemidir. Hedef hızı 100 km/s olarak ayarlarsınız. Bir sensör (kilometre göstergesi) gerçek hızı bildirir. Bir denetleyici (PID algoritması çalıştıran bir gömülü çip) ikisini karşılaştırır, ne kadar ek gaz gerektiğine karar verir ve bu komutu motora gönderir. Yol yokuş yukarı döndükçe hız düşer, hata büyür, denetleyici daha fazla gaz uygular, hız geri tırmanır. Tüm makine — sensör, denetleyici, eyleyici, sistem — saniye saniye çalışıp bir sayıyı bir hedefe yakın tutar.</div>

<p class="l-text">Örneği iskeletine indirdiğinizde dünyadaki neredeyse her kontrol problemi aynı görünür. Bir <strong>sistem</strong> vardır (kontrol etmek istediğiniz şey — motor, robot kolu, kimyasal reaktör, uçak, bina HVAC'i). Bir <strong>referans</strong> r(t) vardır (hedef — istenen hız, sıcaklık, eklem açısı). Bir <strong>çıkış</strong> y(t) vardır (sistemin gerçekten yaptığı şey). Ve bir <strong>denetleyici</strong> vardır; bu, ya yalnızca referansa ya da referans ile çıkışın ölçümüne dayanarak hangi giriş u(t)'yi uygulayacağına karar verir.</p>

<p class="l-text">Tek başına en önemli mimari karar, denetleyicinin çıkışı görüp görmediğidir. Bu karar tüm kontrol sistemlerini iki aileye böler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Açık çevrim kontrolü</div><div class="card-body">Denetleyici, u(t)'yi yalnızca referans r(t)'den hesaplar — geri besleme ölçümü yapılmaz. Zamanlayıcılı bir mikrodalga buna örnektir: 90 saniye kurarsınız, 90 saniye ısıtır, hiçbir termometreye danışılmaz. Ucuz, basit ve her türlü bozulmaya karşı savunmasız. Yemeğiniz daha soğuk başladıysa, daha soğuk biter.</div><div class="card-formula">u = K * r</div></div>
<div class="calc-card"><div class="card-title">Kapalı çevrim (geri beslemeli) kontrol</div><div class="card-body">Bir sensör y(t)'yi ölçer, hata e = r - y hesaplanır, denetleyici hataya etki eder. Termoçiftli modern bir fırın, yemek ne kadar soğuk başlamış olursa olsun, kapı kaç kez açılırsa açılsın, ısıtıcı eleman nasıl yaşlanırsa yaşlansın hazneyi 180 C'de tutar. Sağlam, hassas ve gerçek mühendislikteki baskın mimari.</div><div class="card-formula">u = C(s) (r - y)</div></div>
<div class="calc-card"><div class="card-title">Referans r(t)</div><div class="card-body">Çıkışın olmasını istediğimiz şey. Bir sabit (set noktası regülasyonu), yavaş bir rampa (100 km/s'e yumuşak çıkış) ya da zamanla değişen bir yörünge (önceden planlanmış bir yolu takip eden drone). Kontrol problemi her zaman bir referansa göre tanımlanır.</div></div>
<div class="calc-card"><div class="card-title">Bozucu d(t)</div><div class="card-body">Denetleyicinin planlamadığı her şey: drone'a esen rüzgar, arabaya binen bir yolcu, pencereden odayı ısıtan güneş. Geri beslemenin süper gücü, bozucuları açıkça modellemeden bertaraf etmesidir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-block-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> kanonik negatif geri besleme çevrimi. Referans r(s) soldan girer. Toplama düğümü hata e = r - y'yi hesaplar. Denetleyici C(s) eyleyici komutu u(s)'i üretir. Sistem P(s) çıkış y(s) ile cevap verir; bu çıkış sensör H(s) (çoğu zaman 1 alınır) tarafından ölçülür ve toplayıcıya eksi işaretli olarak geri beslenir. Bu tek resim klasik kontrolün tüm söz dağarcığıdır: her PID denetleyici, her motor servo, her drone otopilotu bunun özel bir halidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var box=function(x0,y0,x1,y1,label,fill){return {type:'rect',x0:x0,y0:y0,x1:x1,y1:y1,line:{color:'#3b82f6',width:2},fillcolor:fill||'rgba(59,130,246,0.10)'};};
var shapes=[box(1.6,0.85,3.0,1.55,'C(s)'),box(3.9,0.85,5.3,1.55,'P(s)'),box(3.4,-0.55,4.4,0.15,'H(s)','rgba(245,158,11,0.10)')];
var annots=[
{x:2.3,y:1.2,text:'<b>C(s)</b><br>denetleyici',showarrow:false,font:{color:'#3b82f6',size:13}},
{x:4.6,y:1.2,text:'<b>P(s)</b><br>sistem',showarrow:false,font:{color:'#3b82f6',size:13}},
{x:3.9,y:-0.2,text:'<b>H(s)</b><br>sensor',showarrow:false,font:{color:'#f59e0b',size:12}},
{x:0.2,y:1.2,text:'r(s)',showarrow:false,font:{color:'#e8e8e8',size:13}},
{x:6.1,y:1.2,text:'y(s)',showarrow:false,font:{color:'#e8e8e8',size:13}},
{x:1.25,y:1.55,text:'+',showarrow:false,font:{color:'#3b82f6',size:18}},
{x:1.25,y:0.65,text:'-',showarrow:false,font:{color:'#f87171',size:18}},
{x:3.45,y:1.45,text:'u(s)',showarrow:false,font:{color:'#e8e8e8',size:11}},
{x:1.5,y:1.50,text:'e(s)',showarrow:false,font:{color:'#e8e8e8',size:11}}
];
var sum={x:[1.25],y:[1.2],mode:'markers',marker:{symbol:'circle-open',size:30,color:'#3b82f6',line:{width:2.5}},showlegend:false,name:'sum'};
var arrow1={x:[0.4,1.1],y:[1.2,1.2],mode:'lines',line:{color:'#e8e8e8',width:2},showlegend:false};
var arrow2={x:[1.4,1.6],y:[1.2,1.2],mode:'lines',line:{color:'#e8e8e8',width:2},showlegend:false};
var arrow3={x:[3.0,3.9],y:[1.2,1.2],mode:'lines',line:{color:'#e8e8e8',width:2},showlegend:false};
var arrow4={x:[5.3,5.95],y:[1.2,1.2],mode:'lines',line:{color:'#e8e8e8',width:2},showlegend:false};
var fb1={x:[5.7,5.7,4.4],y:[1.2,-0.2,-0.2],mode:'lines',line:{color:'#f59e0b',width:2},showlegend:false};
var fb2={x:[3.4,1.25,1.25],y:[-0.2,-0.2,1.05],mode:'lines',line:{color:'#f59e0b',width:2},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{visible:false,range:[0,6.5]},yaxis:{visible:false,range:[-1,2.2],scaleanchor:'x',scaleratio:1},shapes:shapes,annotations:annots,margin:{t:30,r:30,b:30,l:30},showlegend:false};
Plotly.newPlot('plot-l1-block-tr',[arrow1,arrow2,arrow3,arrow4,fb1,fb2,sum],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Tek cümle özet:</strong> açık çevrim en iyisini umut eder; kapalı çevrim gerçek sonucu ölçer ve düzeltir. Mühendislikteki ilginç her kontrol sistemi kapalı çevrimdir.</div>

<h2 class="lesson-title">2. ODE'den Transfer Fonksiyonuna</h2>

<div class="calc-highlight"><strong>Fizikten cebire köprü.</strong> Fiziksel bir sistem bize zamanla ifade edilmiş bir diferansiyel denklem verir. Bizim isteğimiz, manipüle edebileceğimiz, çarpıp bölebileceğimiz ve karmaşık düzlemde kutuplar ve sıfırlar olarak görselleştirebileceğimiz cebirsel bir denklemdir. Laplace dönüşümü, bizi karşı kıyıya geçiren araçtır. Tüm başlangıç koşulları sıfır alındığında, zaman türevleri <em>s</em> ile çarpıma, integraller <em>s</em>'e bölmeye dönüşür ve tüm ODE polinomsal bir orana Y(s)/X(s)'e çöker.</div>

<p class="l-text">Fourier L6'dan tüm işi yapan tek özelliği hatırla. Eğer elinde bir f(t) varsa ve tek taraflı Laplace dönüşümü <code>F(s) = \\int_{0}^{\\infty} f(t) e^{-st} dt</code> uygulanıyorsa, f'in türevleri şu kurala uyar</p>

<div class="calc-formula"><div class="formula-label">TÜREV ÖZELLİĞİ (SIFIR BAŞLANGIÇ KOŞULLARI)</div><div class="formula-main">$$\\mathcal{L}\\{f'(t)\\} = s\\,F(s), \\qquad \\mathcal{L}\\{f''(t)\\} = s^{2}\\,F(s), \\qquad \\mathcal{L}\\{f^{(n)}(t)\\} = s^{n}\\,F(s)$$</div><div class="formula-sub">t = 0'daki başlangıç koşulları sıfır kabul edilir — bir transfer fonksiyonu tanımlanırken yapılan standart varsayım. Sıfırdan farklı başlangıç koşulları ek terimler getirir ama transfer fonksiyonunun kendisini değiştirmez.</div></div>

<p class="l-text">Şimdi doğrusal zamanla değişmez (LTI) bir sistemin n. mertebeden ODE ile tanımlandığını düşün</p>

<div class="calc-formula"><div class="formula-label">GENEL LTI ODE</div><div class="formula-main">$$a_{n}\\,y^{(n)}(t) + \\cdots + a_{1}\\,y'(t) + a_{0}\\,y(t) = b_{m}\\,x^{(m)}(t) + \\cdots + b_{1}\\,x'(t) + b_{0}\\,x(t)$$</div><div class="formula-sub">x(t) giriş, y(t) çıkış. Tüm katsayılar sabit. Bilinmeyene göre doğrusal — y^2 yok, sin(y) yok.</div></div>

<p class="l-text">İki tarafa sıfır başlangıç koşullarıyla Laplace uygulayın, solda Y(s)'i sağda X(s)'i toplayın ve cebirsel bir denklem elde edin. <strong>Transfer fonksiyonu</strong> bu orandır:</p>

<div class="calc-formula"><div class="formula-label">TRANSFER FONKSİYONU</div><div class="formula-main">$$H(s) = \\frac{Y(s)}{X(s)} = \\frac{b_{m}\\,s^{m} + \\cdots + b_{1}\\,s + b_{0}}{a_{n}\\,s^{n} + \\cdots + a_{1}\\,s + a_{0}}$$</div><div class="formula-sub">s cinsinden polinomlar oranı. Payın kökleri sıfırlar. Paydanın kökleri kutuplar. Sistemin mertebesi paydanın derecesi n'dir.</div></div>

<p class="l-text">Ezbere bilmen gereken üç tanım:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kutuplar</div><div class="card-body">Payda polinomunun kökleri. Her kutup, zaman cevabına bir üstel mod katkı yapar. s-düzlemindeki konumları kararlılığı belirler: sol yarı düzlem kararlı, sağ yarı düzlem kararsız.</div></div>
<div class="calc-card"><div class="card-title">Sıfırlar</div><div class="card-body">Pay polinomunun kökleri. Bazı frekansları yükseltir, bazılarını öldürür — cevabın şeklini yontar — ama tek başlarına kararlılığı etkilemez.</div></div>
<div class="calc-card"><div class="card-title">Mertebe</div><div class="card-body">Payda polinomunun derecesi. Birinci mertebe sistemin bir kutbu vardır. İkinci mertebenin iki. Mertebe ayrıca fiziksel sistemdeki bağımsız enerji depolama elemanlarının sayısıdır (kondansatörler ve indüktörler, yaylar ve eylemsizlikler).</div></div>
<div class="calc-card"><div class="card-title">Uygun ve uygunsuz</div><div class="card-body">Bir transfer fonksiyonu m &lt;= n ise uygundur (pay derecesi en fazla payda derecesine eşit). m &lt; n ise kesin uygun. Gerçek fiziksel sistemler her zaman kesin uygundur — çıkış, girişteki bir darbeye anında cevap veremez.</div></div>
</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">Çözümlü örnek: RC alçak geçiren filtre</h3>

<p class="l-text">En basit önemsiz kontrol sistemi. Seri bağlı bir direnç R ve bir kondansatör C, giriş gerilimi V_in(t) ile sürülüyor, çıkış V_out(t) kondansatör üzerinden ölçülüyor. Kirchhoff'un gerilim yasası artı kondansatör bağıntısı <code>i = C \\, dV_{out}/dt</code> şunu verir</p>

<div class="calc-formula"><div class="formula-label">RC ODE</div><div class="formula-main">$$R\\,C\\,\\frac{dV_{out}}{dt} + V_{out}(t) = V_{in}(t)$$</div><div class="formula-sub">Sabit katsayılı birinci mertebe doğrusal ODE. Zaman sabiti tau = RC saniye.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Sıfır başlangıç koşuluyla Laplace uygulayın</div><div class="step-detail">L{dV_out/dt} = s V_out(s). ODE şu hale gelir: RC * s V_out(s) + V_out(s) = V_in(s).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Solda V_out(s)'i parantez içine alın</div><div class="step-detail">(RC s + 1) V_out(s) = V_in(s).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Oranı çözün</div><div class="step-detail">H(s) = V_out(s) / V_in(s) = 1 / (RC s + 1).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">RC ALÇAK GEÇİRENİN TRANSFER FONKSİYONU</div><div class="formula-main">$$H(s) = \\frac{V_{out}(s)}{V_{in}(s)} = \\frac{1}{1 + s\\,R\\,C} = \\frac{1/(RC)}{s + 1/(RC)}$$</div><div class="formula-sub">s = -1/(RC)'de tek bir kutup. Sıfır yok. DC kazancı H(0) = 1 (sabit bir giriş değişmeden geçer). Yüksek frekans kazancı -20 dB/dekat eğimiyle düşer.</div></div>

<div class="l-note"><strong>Az önce ne oldu:</strong> zamanla ifade edilmiş bir diferansiyel denklem, s cinsinden polinomlar oranı haline geldi. Devrenin dinamik davranışı — zaman sabiti, frekans cevabı, basamak cevabı, kararlılığı — artık polinomdan doğrudan okunabilir. Kontrol mühendisliği için Laplace formalizminin tüm ödülü budur.</div>

<h2 class="lesson-title">3. Standart Sistem Biçimleri</h2>

<div class="calc-highlight"><strong>İki kanonik şablon, lisans düzeyinde ve başlangıç seviyesi endüstriyel kontrolde karşılaşacağınızın çoğunu karşılar.</strong> Birinci mertebe şablon K/(tau s + 1), tek bir enerji depolama elemanının baskın olduğu her şeyi tanımlar: bir RC filtresi, iyi karıştırılmış bir tankın sıcaklığı, bir motor hızının birinci mertebe yaklaşımı. İkinci mertebe şablon omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2), enerji takasında bulunabilen iki depolama elemanlı her şeyi tanımlar: yaylı kütle, RLC devre, motor konum çevrimi. Her iki biçimi ezberleyin, görür görmez tanımayı öğrenin ve işinizin yüzde sekseni biter.</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">3.1 Birinci mertebe standart biçim</h3>

<div class="calc-formula"><div class="formula-label">BİRİNCİ MERTEBE STANDART BİÇİM</div><div class="formula-main">$$H(s) = \\frac{K}{\\tau\\,s + 1}$$</div><div class="formula-sub">K DC (kalıcı durum) kazancıdır. tau saniye cinsinden zaman sabitidir. s = -1/tau'da bir kutup. Sonlu sıfır yok.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DC kazanç K = H(0)</div><div class="card-body">Çıkış-giriş oranının kalıcı durum değeri. s = 0 koyun: H(0) = K. Boyutu A olan sabit bir giriş uyguladığınızda çıkış K * A'ya oturur.</div></div>
<div class="calc-card"><div class="card-title">Zaman sabiti tau</div><div class="card-body">Basamak cevabının nihai değerinin yüzde 63.2'sine ulaşması için geçen saniyeler. 5 tau sonra cevap kalıcı durumun yüzde 0.7'si içindedir. tau, herhangi bir birinci mertebe sistemin hızını özetleyen tek sayıdır.</div></div>
<div class="calc-card"><div class="card-title">s = -1/tau'da kutup</div><div class="card-body">Kararlı bir sistem için her zaman negatif gerçel eksendedir. Orijinden uzaklaştıkça cevap hızlanır. tau = 1 ms, -1000 rad/s'de kutup verir; tau = 1 s, -1 rad/s'de kutup verir.</div></div>
<div class="calc-card"><div class="card-title">Basamak cevabı</div><div class="card-body">y(t) = K (1 - e^{-t/tau}). K'ye saf üstel yaklaşım, aşım yok, salınım yok. Klasik kondansatör şarj eğrisi.</div></div>
</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">3.2 İkinci mertebe standart biçim</h3>

<div class="calc-formula"><div class="formula-label">İKİNCİ MERTEBE STANDART BİÇİM</div><div class="formula-main">$$H(s) = \\frac{\\omega_{n}^{2}}{s^{2} + 2\\,\\zeta\\,\\omega_{n}\\,s + \\omega_{n}^{2}}$$</div><div class="formula-sub">omega_n doğal açısal frekanstır (rad/s). zeta boyutsuz sönüm oranıdır. DC kazancı H(0) = 1.</div></div>

<p class="l-text">Her şeye karar veren iki parametre <code>\\omega_{n}</code> ve <code>\\zeta</code>'dir. Kutuplar <code>s^{2} + 2 \\zeta \\omega_{n} s + \\omega_{n}^{2} = 0</code> denklemini çözer:</p>

<div class="calc-formula"><div class="formula-label">STANDART İKİNCİ MERTEBE SİSTEMİN KUTUPLARI</div><div class="formula-main">$$s_{1,2} = -\\zeta\\,\\omega_{n} \\pm \\omega_{n}\\,\\sqrt{\\zeta^{2} - 1}$$</div><div class="formula-sub">Karekök rejimi belirler. Diskriminant zeta^2 - 1, aşım, çınlama ve oturma süresi hakkında söyleyeceğimiz her şeyi yönetir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğal frekans omega_n</div><div class="card-body">Tüm sönümü kaldırırsanız (zeta = 0) sistemin salınacağı frekans. Zaman ölçeğini belirler. Daha büyük omega_n -&gt; her şey daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Sönüm oranı zeta = 0</div><div class="card-body">Sönümsüz — saf hayali kutuplar +/- i omega_n'de. Sonsuza dek salınan sinüzoit. Kayıpsız bir LC devresi, sürtünmesiz idealize edilmiş sallanan bir sarkaç.</div></div>
<div class="calc-card"><div class="card-title">zeta (0, 1) aralığında — az sönümlü</div><div class="card-body">Karmaşık eşlenik kutuplar -zeta omega_n +/- i omega_n sqrt(1 - zeta^2)'de. Basamak cevabı aşar, çınlar, söner. Sönümlü frekans omega_d = omega_n sqrt(1 - zeta^2).</div></div>
<div class="calc-card"><div class="card-title">zeta = 1 — kritik sönümlü</div><div class="card-body">s = -omega_n'de çift gerçek kutup. Aşımsız mümkün olan en hızlı cevap. Aşımın kabul edilemediği durumlarda en uygun nokta.</div></div>
<div class="calc-card"><div class="card-title">zeta &gt; 1 — aşırı sönümlü</div><div class="card-body">İki farklı negatif gerçek kutup. Salınım yok, aşım yok, ama cevap kritik sönümden daha yavaş. Ağır bir sönümleyiciye sahip bir sineklik kapısını düşünün.</div></div>
<div class="calc-card"><div class="card-title">zeta = 0.707 — mühendislik hedefi</div><div class="card-body">Yaklaşık yüzde 4.3 aşım, hızlı oturma, aşırı çınlama yok. Butterworth filtresi kutuplarını buraya koyar. Başka bir şey dikte etmediğinde yaygın bir varsayılan.</div></div>
</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">3.3 Daha yüksek mertebeli sistemler</h3>

<p class="l-text">Gerçek mühendislikte sık sık üçüncü, dördüncü, bazen çok daha yüksek mertebeli sistemlerle karşılaşırsınız. Üç kural onları evcilleştirir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Baskın kutup yaklaşımı</div><div class="card-body">Bir kutup, diğerlerine göre hayali eksene çok daha yakınsa (gerçek kısmı en az 5 kat daha küçük büyüklükte), yavaş dinamiklere baskın çıkar. Yüksek mertebeli sistem, yaklaşık olarak bu tek kutbu olan bir birinci mertebe sistem gibi davranır.</div></div>
<div class="calc-card"><div class="card-title">Baskın karmaşık çift</div><div class="card-body">Bir karmaşık eşlenik çifti, diğer kutuplara göre hayali eksene çok daha yakınsa, cevap o çiftin omega_n ve zeta'sıyla parametrize edilmiş standart ikinci mertebe biçim gibi görünür.</div></div>
<div class="calc-card"><div class="card-title">Kısmi kesirler</div><div class="card-body">Her zaman elinizde. H(s)'i birinci ve ikinci mertebe terimlerin toplamı olarak ayrıştırın; her birini ayrı ayrı tersleyin; ortaya çıkan zaman cevaplarını toplayın. Sıkıcı ama algoritmik.</div></div>
</div>

<div class="l-note"><strong>Mühendisin refleksi:</strong> aşina olmadığınız bir H(s) ile karşılaştığınızda ilk hamle her zaman aynıdır — kutupları ve sıfırları bulun, s-düzleminde konumlandırın, hangi kutupların baskın olduğunu tespit edin ve baskın davranışın birinci mertebe mi yoksa ikinci mertebe mi olduğunu tanıyın.</div>

<h2 class="lesson-title">4. Mekanik-Elektrik Benzeşimi</h2>

<div class="calc-highlight"><strong>Aynı denklem çok farklı fiziksel sistemleri tanımlar.</strong> Sönümleyicili yaylı bir kütle <em>m x'' + c x' + k x = F(t)</em>'yi sağlar. Bir RLC devresi <em>L q'' + R q' + (1/C) q = V(t)</em>'yi sağlar. İki denklem matematiksel olarak özdeştir — sadece sembollerin adları farklıdır. Bu derste kurduğumuz tüm kontrol araç kutusu değişmeden <em>her ikisine de</em> uygulanır.</div>

<p class="l-text">İki standart benzeşim vardır. <strong>Kuvvet-gerilim</strong> benzeşimi Newton yasası ile Kirchhoff'un gerilim yasasını paralel kabul eder. <strong>Kuvvet-akım</strong> benzeşimi ise Newton yasası ile Kirchhoff'un akım yasasını paralel kabul eder. Giriş kurslarında daha yaygın olan kuvvet-gerilim'dir ve baştan sona onu kullanırız.</p>

<div class="calc-formula"><div class="formula-label">KUVVET-GERİLİM BENZEŞİMİ</div><div class="formula-main">$$\\underbrace{m\\,x'' + c\\,x' + k\\,x}_{\\text{mekanik}} = F(t) \\qquad \\Longleftrightarrow \\qquad \\underbrace{L\\,q'' + R\\,q' + (1/C)\\,q}_{\\text{elektrik}} = V(t)$$</div><div class="formula-sub">Aynı ODE yapısı. F'den x'e transfer fonksiyonu, V'den q'ya transfer fonksiyonu ile matematiksel olarak aynıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">kütle m  ↔  indüktans L</div><div class="card-body">İkisi de kinetik türü enerji depolar ve "akış" değişkenindeki değişime direnir (kütle için hız, indüktör için akım). İkisi de ODE'deki en yüksek mertebe türevin katsayısını oluşturur.</div></div>
<div class="calc-card"><div class="card-title">sönüm c  ↔  direnç R</div><div class="card-body">İkisi de akış değişkeniyle orantılı enerji harcar. İkisi de birinci türev katsayısını oluşturur. Daha yüksek c veya R -&gt; daha fazla sönüm, daha büyük zeta, daha yavaş sönüş.</div></div>
<div class="calc-card"><div class="card-title">yay sabiti k  ↔  ters kapasitans 1/C</div><div class="card-body">İkisi de yer değiştirmeyle orantılı potansiyel türü enerji depolar. İkisi de türevsiz değişkenin katsayısını oluşturur.</div></div>
<div class="calc-card"><div class="card-title">kuvvet F  ↔  gerilim V</div><div class="card-body">İkisi de sürücü giriştir. F'den yer değiştirmeye transfer fonksiyonu, V'den yüke transfer fonksiyonu ile eşleşir.</div></div>
<div class="calc-card"><div class="card-title">yer değiştirme x  ↔  yük q</div><div class="card-body">İkisi de integre edilmiş "akış" değişkenidir — sistemin potansiyel elemanında (yay veya kondansatör) biriktirdiği şey.</div></div>
<div class="calc-card"><div class="card-title">hız x'  ↔  akım i = q'</div><div class="card-body">İkisi de sistemden geçen "akıştır" — kinetik türü elemandan (kütle veya indüktör) geçen şey.</div></div>
</div>

<div class="calc-example"><div class="example-label">EŞDEĞER SİSTEMLER</div><div class="example-body"><strong>Kütle-yay-sönümleyici:</strong> m = 1 kg, c = 2 N s/m, k = 25 N/m. Kuvvetten yer değiştirmeye transfer fonksiyonu<br><br>H(s) = 1 / (s^2 + 2 s + 25).<br><br><strong>Eşdeğer RLC devresi:</strong> L = 1 H, R = 2 ohm, 1/C = 25 (yani C = 40 mF). Gerilimden yüke transfer fonksiyonu aynı: 1 / (s^2 + 2 s + 25). omega_n = 5 rad/s. zeta = 1/5 = 0.2 (az sönümlü). Aynı basamak cevap şekli, aynı aşım, aynı oturma süresi. İki sistem dinamik ikizdir.</div></div>

<div class="calc-graph"><div id="plot-l1-analogy-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> kütle-yay-sönümleyicinin basamak cevabı (mavi) ve eşdeğer RLC devresinin basamak cevabı (kehribar kesikli) tam olarak üst üste oturur. Tamamen farklı iki fiziksel sistem, tamamen farklı iki ölçüm birimi seti, özdeş tek bir eğri. Kontrol mühendislerinin doğrudan H(s) üzerinden akıl yürütmesinin nedeni budur — fizik düşer, matematik devralır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=500;i++)t.push(i/40);
var wn=5,z=0.2,wd=wn*Math.sqrt(1-z*z);
var y=[];
for(var i=0;i<t.length;i++){var x=t[i];y.push((1/(wn*wn))*(1-Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z*wn/wd)*Math.sin(wd*x))));}
var d1={x:t,y:y,mode:'lines',name:'kutle-yay-sonumleyici x(t)/F',line:{color:'#3b82f6',width:2.6}};
var d2={x:t,y:y.map(function(v){return v;}),mode:'lines',name:'RLC q(t)/V',line:{color:'#f59e0b',width:2.4,dash:'dash'}};
var ss={x:[0,12.5],y:[1/25,1/25],mode:'lines',line:{color:'#888',width:1,dash:'dot'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'cikis / giris',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-analogy-tr',[ss,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Blok Diyagramı Cebiri</h2>

<div class="calc-highlight"><strong>Bir blok diyagramı görsel bir cebirdir.</strong> Her blok bir transfer fonksiyonudur. Kablolar sinyalleri taşır. Toplama düğümleri toplar ve çıkarır. Üç kural — seri, paralel, geri besleme — ne kadar karışık görünürse görünsün herhangi bir blok diyagramını seçilen herhangi bir girişten seçilen herhangi bir çıkışa tek bir transfer fonksiyonuna indirger. Bu üç kuralı ustalaşmak klasik kontrolün defterini tutmakta ustalaşmaktır.</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">5.1 Seri (kaskat) bağlantı</h3>

<p class="l-text">İki blok arka arkaya, birincinin çıkışı ikincisinin girişine bağlanıyor. Sinyal her bloğu sırayla hisseder; etkileri çarpılır.</p>

<div class="calc-formula"><div class="formula-label">SERİ KURALI</div><div class="formula-main">$$Y(s) = H_{2}(s)\\,H_{1}(s)\\,X(s) \\quad\\Longrightarrow\\quad H_{\\text{total}}(s) = H_{1}(s)\\,H_{2}(s)$$</div><div class="formula-sub">Seri bağlantı için s'de çarpma. LTI bloklar için sıralama önemsizdir — ama gerçek donanımda yükleme ve empedans yüzünden kesinlikle önemlidir.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">5.2 Paralel bağlantı</h3>

<p class="l-text">İki blok aynı giriş tarafından sürülür, çıkışları toplanır. Doğrusal süperpozisyon transfer fonksiyonlarını basitçe toplamamıza izin verir.</p>

<div class="calc-formula"><div class="formula-label">PARALEL KURALI</div><div class="formula-main">$$Y(s) = [H_{1}(s) + H_{2}(s)]\\,X(s) \\quad\\Longrightarrow\\quad H_{\\text{total}}(s) = H_{1}(s) + H_{2}(s)$$</div><div class="formula-sub">Paralel bağlantı için s'de toplama. Oransal artı türevsel yollu denetleyicileri temsil etmek için ya da iki ileri besleme terimini birleştirmek için kullanışlıdır.</div></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">5.3 Negatif geri besleme — usta formül</h3>

<p class="l-text">İleri yol G(s) bir çevrim içinde, geri besleme yolu H(s) ile birlikte, çıkış algılanıp referanstan çıkarılıyor. Kapalı çevrim transfer fonksiyonunu türetin:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Çevrim denklemlerini yazın</div><div class="step-detail">E(s) = R(s) - H(s) Y(s). Ve Y(s) = G(s) E(s).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Yerine koyun</div><div class="step-detail">Y = G (R - H Y) = G R - G H Y. O halde Y + G H Y = G R, yani (1 + G H) Y = G R.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Çözün</div><div class="step-detail">Y/R = G / (1 + G H). Bitti.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">NEGATİF GERİ BESLEME KAPALI ÇEVRİM TRANSFER FONKSİYONU</div><div class="formula-main">$$T(s) = \\frac{Y(s)}{R(s)} = \\frac{G(s)}{1 + G(s)\\,H(s)}$$</div><div class="formula-sub">Klasik kontroldeki tek başına en önemli formül. Payda 1 + GH kapalı çevrimin karakteristik polinomudur; kökleri kapalı çevrim kutuplarıdır. Bu kutupları seçmek, denetleyici tasarımının büyük bölümünü oluşturur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birim geri besleme H = 1</div><div class="card-body">En yaygın durum. T = G / (1 + G). Sensör dinamikleri olmadan çıkışın doğrudan ölçümü. Hemen her giriş seviyesindeki PID tasarım problemi birim geri beslemeyi varsayar.</div></div>
<div class="calc-card"><div class="card-title">Çevrim kazancı L = G H</div><div class="card-body">G H çarpımı, sinyali çevrim etrafında bir kez izlediğinizde gördüğünüz "çevrim kazancı"dır. Büyük çevrim kazancı T'yi 1/H'e yakınsatır — geri besleme açık çevrim dinamiklerine baskın çıkar. Geri beslemenin sihri budur.</div></div>
<div class="calc-card"><div class="card-title">Pozitif geri besleme (işaret tersine)</div><div class="card-body">T = G / (1 - G H). Daha az yaygın, genellikle kararsız. Osilatör tasarımında ve bazı sinyal koşullama devrelerinde kullanılır ama servo kontrolde yoktur.</div></div>
</div>

<h3 style="color:#3b82f6;margin-top:1.4rem">5.4 Çözümlü blok diyagramı indirgemesi</h3>

<div class="calc-example"><div class="example-label">BİRİNCİ MERTEBE SİSTEME ORANSAL KONTROL</div><div class="example-body"><strong>Sistem:</strong> G(s) = 2/(s + 3) (birinci mertebe gecikme).<br><strong>Denetleyici:</strong> C(s) = K (saf oransal kazanç).<br><strong>Sensör:</strong> birim geri besleme H = 1.<br><br>İleri yol: G_forward = C(s) G(s) = 2K/(s + 3).<br>Kapalı çevrim: T(s) = G_forward / (1 + G_forward) = [2K/(s + 3)] / [1 + 2K/(s + 3)] = 2K / (s + 3 + 2K).<br><br><strong>Kapalı çevrim kutbu:</strong> s = -(3 + 2K). Açık çevrim kutbu -3'teydi. K = 5 ile kapalı çevrim kutbu -13'e taşınır — dört kattan fazla hızlanır.<br><strong>DC kazancı:</strong> T(0) = 2K/(3 + 2K). K = 5 için T(0) = 10/13 ~ 0.77. Yüzde 23 kalıcı durum hatası var — oransal kontrol tek başına bunu sıfıra çekemez. İntegral eylemi sonra (4. Ders) eklememizin nedeni budur.</div></div>

<div class="l-note"><strong>Geri beslemenin tek satırlık dersi:</strong> bir K düğmesi kapalı çevrim kutbunu s-düzleminde gezdirir. Mühendislik muhakemesi onu nereye koyacağına karar verir.</div>

<h2 class="lesson-title">6. Basamak Cevabı ve Zaman Tanımı Performansı</h2>

<div class="calc-highlight"><strong>Basamak cevabı evrensel ölçüttür.</strong> Girişe ani bir birim sıçrama uygulayın ve çıkışın oturmasını izleyin. Her klasik performans şartnamesi — aşım, yükselme süresi, oturma süresi, tepe zamanı — standart ikinci mertebe sistemin basamak cevabından okunur. Bu dört sayıyı zeta ve omega_n cinsinden bilmek, bir mühendislik gereksinimini ("yüzde 10'dan az aşım, 2 saniye içinde oturma") bir kutup konumuna çevirmesini bilmek demektir.</div>

<p class="l-text">Standart ikinci mertebe az sönümlü sistem <code>H(s) = \\omega_{n}^{2}/(s^{2} + 2 \\zeta \\omega_{n} s + \\omega_{n}^{2})</code> bir birim basamakla sürüldüğünde <code>R(s) = 1/s</code>, çıkış Y(s) = H(s)/s şuna ters dönüşür</p>

<div class="calc-formula"><div class="formula-label">AZ SÖNÜMLÜ BASAMAK CEVABI</div><div class="formula-main">$$y(t) = 1 - \\frac{e^{-\\zeta\\,\\omega_{n}\\,t}}{\\sqrt{1 - \\zeta^{2}}}\\,\\sin\\!\\left(\\omega_{d}\\,t + \\phi\\right), \\qquad \\omega_{d} = \\omega_{n}\\,\\sqrt{1 - \\zeta^{2}}, \\quad \\phi = \\arccos(\\zeta)$$</div><div class="formula-sub">Üstel bir zarf altında sönümlü salınım. omega_d sönümlü frekanstır; phi y(0) = 0 yapan fazdır.</div></div>

<p class="l-text">Dört performans sayısını bu ifadeden okumak:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tepe zamanı t_p</div><div class="card-body">İlk tepenin oluştuğu an. dy/dt = 0 çözülür ve ilk pozitif kök alınır: t_p = pi / omega_d. Daha küçük t_p daha hızlı ilk yükseliş demektir.</div><div class="card-formula">t_p = pi / omega_d</div></div>
<div class="calc-card"><div class="card-title">Yüzde aşım M_p</div><div class="card-body">y(t_p)'nin nihai değer 1'i ne kadar aştığı. M_p = exp(-pi zeta / sqrt(1 - zeta^2)). Yalnızca zeta'ya bağlıdır — omega_n'den bağımsız. zeta = 0.2 yüzde 53, zeta = 0.5 yüzde 16.3, zeta = 0.707 yüzde 4.3, zeta = 1 yüzde 0 verir.</div><div class="card-formula">M_p = e^{-pi zeta / sqrt(1-zeta^2)}</div></div>
<div class="calc-card"><div class="card-title">Oturma süresi t_s</div><div class="card-body">Cevabın nihai değerin yüzde 2'lik bandına girip orada kaldığı an. t_s ~ 4/(zeta omega_n) ile yaklaşıklanır. zeta omega_n çarpımı — baskın kutbun gerçek kısmı — oturma hızını belirler.</div><div class="card-formula">t_s ~ 4 / (zeta omega_n)</div></div>
<div class="calc-card"><div class="card-title">Yükselme süresi t_r</div><div class="card-body">Nihai değerin yüzde 10'undan yüzde 90'ına gitme süresi. zeta = 0.5 ile 0.8 için t_r ~ (1.8/omega_n) ile yaklaşıklanır. Daha büyük omega_n -&gt; daha hızlı yükselme.</div><div class="card-formula">t_r ~ 1.8 / omega_n</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-step-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> standart ikinci mertebe sistemin omega_n = 1 rad/s ile beş sönüm oranı için basamak cevabı. zeta = 0.2 şiddetle aşar. zeta = 0.5 hâlâ bir tümseğe sahiptir. zeta = 0.707 (Butterworth ideal noktası) yaklaşık yüzde 4 aşım gösterir. zeta = 1 kritik sönümlüdür — aşım yok, en hızlı saf üstel dönüş. zeta = 2 aşırı sönümlüdür — aşım yok ama kritikten yavaş. Tüm ikinci mertebe tasarım sanatı zeta'yı seçmektir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=600;i++)t.push(i/40);
function step(z){
  var wn=1;var out=[];
  for(var i=0;i<t.length;i++){
    var x=t[i],y;
    if(Math.abs(z-1)<1e-6){y=1-Math.exp(-wn*x)*(1+wn*x);}
    else if(z<1){var wd=wn*Math.sqrt(1-z*z);y=1-Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z/Math.sqrt(1-z*z))*Math.sin(wd*x));}
    else{var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;y=1-(r2*Math.exp(r1*x)-r1*Math.exp(r2*x))/(r2-r1);}
    out.push(y);
  }
  return out;
}
var target={x:[0,15],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var d1={x:t,y:step(0.2),mode:'lines',name:'zeta=0.2',line:{color:'#f87171',width:2.4}};
var d2={x:t,y:step(0.5),mode:'lines',name:'zeta=0.5',line:{color:'#f59e0b',width:2.4}};
var d3={x:t,y:step(0.707),mode:'lines',name:'zeta=0.707',line:{color:'#3b82f6',width:2.6}};
var d4={x:t,y:step(1.0),mode:'lines',name:'zeta=1',line:{color:'#10b981',width:2.4}};
var d5={x:t,y:step(2.0),mode:'lines',name:'zeta=2',line:{color:'#a78bfa',width:2.4,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.7]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-step-tr',[target,d1,d2,d3,d4,d5],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l1-poles-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> s-düzleminde aynı beş sönüm oranı. Kutuplar hepsi orijin merkezli omega_n = 1 yarıçaplı bir çember üzerinde yatar (çünkü her kutbun büyüklüğü tam olarak omega_n'dir). Negatif gerçel eksenden açı arccos(zeta)'ya eşittir. zeta = 0.2 kutupları hayali eksene çok yakın yapar — şiddetli salınım. zeta = 1 iki kutbu da gerçek eksende aynı noktaya toplar. zeta = 2 onları gerçek eksen boyunca ayırır — saf üstel.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var zs=[0.2,0.5,0.707,1.0,2.0];
var colours=['#f87171','#f59e0b','#3b82f6','#10b981','#a78bfa'];
var traces=[];
for(var k=0;k<zs.length;k++){
  var z=zs[k];var wn=1;
  if(z<1){var wd=wn*Math.sqrt(1-z*z);
    traces.push({x:[-z*wn,-z*wn],y:[wd,-wd],mode:'markers',name:'zeta='+z,marker:{symbol:'x',size:14,color:colours[k],line:{width:3}}});
  }else if(Math.abs(z-1)<1e-6){
    traces.push({x:[-wn],y:[0],mode:'markers',name:'zeta=1 (cift)',marker:{symbol:'x',size:18,color:colours[k],line:{width:4}}});
  }else{var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;
    traces.push({x:[r1,r2],y:[0,0],mode:'markers',name:'zeta='+z,marker:{symbol:'x',size:14,color:colours[k],line:{width:3}}});
  }
}
var axisLine={x:[0,0],y:[-1.4,1.4],mode:'lines',line:{color:'#888',width:1.5,dash:'dash'},showlegend:false};
var circle={x:[],y:[]};
for(var j=0;j<=200;j++){var th=Math.PI*0.5+(j/200)*Math.PI;circle.x.push(Math.cos(th));circle.y.push(Math.sin(th));}
circle.mode='lines';circle.line={color:'rgba(150,150,150,0.4)',width:1,dash:'dot'};circle.showlegend=false;circle.name='|s|=omega_n';
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'Re(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-2.3,0.6]},yaxis:{title:'Im(s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.4,1.4],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:-1.7,y:1.15,text:'LHP (kararli)',showarrow:false,font:{color:'#3b82f6',size:12}}]};
Plotly.newPlot('plot-l1-poles-tr',[axisLine,circle].concat(traces),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Tasarım reçetesi.</strong> Yüzde 10'dan az aşım mı istiyorsunuz? zeta &gt;= 0.59 gerekir. 1 saniyede oturma mı? zeta omega_n &gt;= 4 gerekir. İkisini birleştirin ve baskın kutbunuzun yatması gereken s-düzleminin bir bölgesi belirir. Her klasik kutup yerleştirme tasarımı böyle bir bölgenin içindeki bir aramadır.</div>

<h2 class="lesson-title">7. Darbe, Basamak ve Rampa Cevapları</h2>

<div class="calc-highlight"><strong>Üç standart test sinyali, sisteme üç pencere.</strong> Birim darbe delta(t) sistemin doğal modlarını sondalar — darbe cevabı, H(s)'in ters Laplace'idir. Birim basamak u(t) her kontrol çevriminin iş atı kabul testidir. Birim rampa t, çevrimin hareketli bir referansı ne kadar iyi takip ettiğini ve kalıcı durum hatasının ne kadar büyük olduğunu açığa çıkarır. Mühendisler yeni bir sistemi boyutlandırırken her üçünü erkenden hesaplar.</div>

<p class="l-text">Laplace'ta üç standart girişin dönüşümleri şu şekildedir:</p>

<div class="calc-formula"><div class="formula-label">STANDART TEST GİRİŞLERİ</div><div class="formula-main">$$\\mathcal{L}\\{\\delta(t)\\} = 1, \\qquad \\mathcal{L}\\{u(t)\\} = \\frac{1}{s}, \\qquad \\mathcal{L}\\{t\\cdot u(t)\\} = \\frac{1}{s^{2}}$$</div><div class="formula-sub">Darbe, basamak, rampa. Her biri öncekinin zaman integralidir: delta'yı integre et basamağı al, basamağı integre et rampayı al. s-tanım kümesinde her biri s'e bir bölme daha demektir.</div></div>

<p class="l-text">Transfer fonksiyonu H(s) olan herhangi bir LTI sistem için her girişe cevap, çarpımın ters Laplace'i alınarak hesaplanır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Darbe cevabı</div><div class="card-body">y_imp(t) = L^{-1}{H(s)}. Saf doğal mod davranışı. H(s) = 1/(s + a) ise y_imp(t) = e^{-at}. Darbe cevabı sistemin parmak izidir.</div></div>
<div class="calc-card"><div class="card-title">Basamak cevabı</div><div class="card-body">y_step(t) = L^{-1}{H(s)/s}. Girişi aniden açtığınızda gördüğünüz. Set noktası takip şartnamesi için kullanılır (aşım, yükselme, oturma).</div></div>
<div class="calc-card"><div class="card-title">Rampa cevabı</div><div class="card-body">y_ramp(t) = L^{-1}{H(s)/s^2}. Düzgün hareketli bir referansı takip. Sistemin "Tip"ini açığa çıkarır — kaç integralleyiciye sahip. Bir Tip-0 sistem basamağa karşı sonlu kalıcı durum hatası olur ama rampaya karşı sınırsız hata verir.</div></div>
</div>

<div class="calc-example"><div class="example-label">BİRİNCİ MERTEBE SİSTEM H(s) = 1/(s + 1) — ÜÇ CEVAP</div><div class="example-body"><strong>Darbe:</strong> Y(s) = 1/(s + 1). Ters: y_imp(t) = e^{-t}.<br><strong>Basamak:</strong> Y(s) = 1/[s(s + 1)] = 1/s - 1/(s + 1). Ters: y_step(t) = 1 - e^{-t}.<br><strong>Rampa:</strong> Y(s) = 1/[s^2(s + 1)] = 1/s^2 - 1/s + 1/(s + 1). Ters: y_ramp(t) = t - 1 + e^{-t}.<br><br>Örüntüye dikkat: her cevap öncekinin bir kez daha integre edilmesidir. Kalıcı durum davranışına da dikkat: darbe 0'a, basamak 1'e gider, rampa girişin sonsuza dek tam 1 saniye gerisinden gelir — sabit bir takip hatası.</div></div>

<div class="calc-graph"><div id="plot-l1-impulse-step-ramp-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> H(s) = 1/(s + 1)'in darbe (kırmızı), basamak (mavi) ve rampa (kehribar kesikli) cevapları. Darbe cevabı 1'den 0'a söner — saf doğal mod. Basamak cevabı üstel olarak 1'e şarj olur — klasik birinci mertebe yükseliş. Rampa cevabı, rampa girişi t (noktalı gri) takip eder ama 1 saniye sabit gecikmeyle — kalıcı durum takip hatası.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/40);
var imp=[],stp=[],rmp=[],ref=[];
for(var i=0;i<t.length;i++){var x=t[i];imp.push(Math.exp(-x));stp.push(1-Math.exp(-x));rmp.push(x-1+Math.exp(-x));ref.push(x);}
var d1={x:t,y:imp,mode:'lines',name:'darbe cevabi',line:{color:'#f87171',width:2.4}};
var d2={x:t,y:stp,mode:'lines',name:'basamak cevabi',line:{color:'#3b82f6',width:2.6}};
var d3={x:t,y:rmp,mode:'lines',name:'rampa cevabi',line:{color:'#f59e0b',width:2.4,dash:'dash'}};
var d4={x:t,y:ref,mode:'lines',name:'rampa giris t',line:{color:'#888',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'cevap',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,10]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-impulse-step-ramp-tr',[d4,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Konvolüsyon görüşü.</strong> Üç cevabın hepsi genel çıkış formülü y(t) = (h * x)(t)'nin — darbe cevabı h(t) ile girişin x(t) konvolüsyonu — özel halidir. s-tanım kümesinde konvolüsyon çarpıma dönüşür: Y(s) = H(s) X(s). Bir özdeşlik, üç resim.</div>

<h2 class="lesson-title">8. Çözümlü Örnek — DC Motor Transfer Fonksiyonu</h2>

<div class="calc-highlight"><strong>Dünya çapındaki kontrol laboratuvarlarında tek başına en çok kullanılan sistem modeli.</strong> Fırçalı bir DC motor: terminallere gerilim uygulayın, armatür akımı çekin, tork üretin, mili hızlandırın, açısal hız oluşturun. Birbirine bağlı beş fiziksel denklem — armatür çevriminde Kirchhoff, rotorda Newton yasası, artı iki motor sabiti — tek bir kompakt transfer fonksiyonuna çöker. Şimdi onu sıfırdan türetiyoruz.</div>

<p class="l-text"><strong>Değişkenler:</strong> giriş gerilimi V(t) (V), armatür akımı i(t) (A), zıt EMF e_b(t) (V), motor torku tau_m(t) (N m), açısal hız omega(t) (rad/s).</p>

<p class="l-text"><strong>Sabitler:</strong> armatür direnci R (ohm), armatür indüktansı L (H), tork sabiti K_t (N m/A), zıt EMF sabiti K_e (V s/rad), eylemsizlik momenti J (kg m^2), viskoz sürtünme katsayısı b (N m s/rad).</p>

<div class="calc-formula"><div class="formula-label">BEŞ FİZİKSEL DENKLEM</div><div class="formula-main">$$V(t) = R\\,i(t) + L\\,\\frac{di}{dt} + e_{b}(t), \\qquad e_{b}(t) = K_{e}\\,\\omega(t), \\qquad \\tau_{m}(t) = K_{t}\\,i(t), \\qquad J\\,\\frac{d\\omega}{dt} + b\\,\\omega(t) = \\tau_{m}(t)$$</div><div class="formula-sub">Armatür çevriminde Kirchhoff'un gerilim yasası, dönen rotor tarafından üretilen zıt EMF, akımla orantılı tork, viskoz sürtünmeli eylemsizlik üzerinde Newton'un ikinci yasası.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Her şeyin Laplace'ini alın (sıfır başlangıç koşulları)</div><div class="step-detail">V(s) = R I(s) + L s I(s) + K_e Omega(s). Ve J s Omega(s) + b Omega(s) = K_t I(s).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İkinci denklemi I(s) için çözün</div><div class="step-detail">I(s) = (J s + b) Omega(s) / K_t.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Birinciye yerine koyun</div><div class="step-detail">V(s) = (R + L s) (J s + b) Omega(s) / K_t + K_e Omega(s).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Omega(s)'i parantez içine alın</div><div class="step-detail">V(s) = Omega(s) * [(R + L s)(J s + b) + K_e K_t] / K_t.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Transfer fonksiyonunu okuyun</div><div class="step-detail">Omega(s) / V(s) = K_t / [(R + L s)(J s + b) + K_e K_t].</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">DC MOTOR TRANSFER FONKSİYONU (TAM)</div><div class="formula-main">$$\\frac{\\Omega(s)}{V(s)} = \\frac{K_{t}}{L\\,J\\,s^{2} + (R\\,J + L\\,b)\\,s + (R\\,b + K_{e}\\,K_{t})}$$</div><div class="formula-sub">Standart ikinci mertebe sistem. Elektriksel (R, L) ve mekanik (J, b) enerji depolarından birer kutup. K_e K_t bağlaşımı sabit terimde görünür.</div></div>

<p class="l-text"><strong>Standart sadeleştirme.</strong> Armatür indüktansı L genellikle mekanik zaman sabitine göre çok küçüktür. L = 0 koymak sistemi birinci mertebeye çöker:</p>

<div class="calc-formula"><div class="formula-label">DC MOTOR — BİRİNCİ MERTEBE YAKLAŞIM (L İHMAL EDİLDİ)</div><div class="formula-main">$$\\frac{\\Omega(s)}{V(s)} \\approx \\frac{K_{t}/(R\\,b + K_{e}\\,K_{t})}{\\tau_{m}\\,s + 1}, \\qquad \\tau_{m} = \\frac{R\\,J}{R\\,b + K_{e}\\,K_{t}}$$</div><div class="formula-sub">Mekanik zaman sabiti tau_m cevabın hızını belirler. DC kazancı K = K_t / (R b + K_e K_t). Tek kutup, hızlı ve temiz.</div></div>

<div class="calc-example"><div class="example-label">SAYISAL ÖRNEK — KÜÇÜK BİR HOBİ MOTORU</div><div class="example-body"><strong>Parametreler:</strong> R = 1 ohm, L = 0.5 mH, K_t = K_e = 0.01 N m/A, J = 0.01 kg m^2, b = 0.1 N m s/rad. V = 12 V basamak uygulayın.<br><br>Tam payda: L J = 5e-6. R J + L b = 0.01 + 5e-5 ~ 0.01. R b + K_e K_t = 0.1 + 1e-4 ~ 0.1001. Kalıcı durum omega = K_t V / (R b + K_e K_t) = 0.01 * 12 / 0.1001 ~ 1.20 rad/s.<br>tau_m = R J / (R b + K_e K_t) = 0.01 / 0.1001 ~ 0.0999 s. Yani omega(t) ~ 1.20 (1 - e^{-t/0.1}). 0.5 s sonra motor pratik olarak kalıcı hıza ulaşmıştır.</div></div>

<div class="calc-graph"><div id="plot-l1-dcmotor-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> örnek DC motorun açısal hız basamak cevabı. t = 0'da 12 V uygulanır. Mil mekanik zaman sabiti tau_m ~ 0.1 s ile hızlanır. 5 tau_m ~ 0.5 s sonra asimptotik 1.20 rad/s'e oturmuştur. Kesik çizgi yüzde 63 seviyesini gösteriyor — standart bir-tau referans noktası.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/400);
var tau=0.1,ss=1.20;
var y=[];for(var i=0;i<t.length;i++)y.push(ss*(1-Math.exp(-t[i]/tau)));
var d={x:t,y:y,mode:'lines',name:'omega(t)',line:{color:'#3b82f6',width:2.6}};
var ssLine={x:[0,1],y:[ss,ss],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var tauMark={x:[tau,tau],y:[0,0.632*ss],mode:'lines',line:{color:'#f59e0b',width:1.5,dash:'dot'},showlegend:false};
var tauPt={x:[tau],y:[0.632*ss],mode:'markers',name:'t = tau (63%)',marker:{size:10,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'omega (rad/s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-dcmotor-tr',[ssLine,d,tauMark,tauPt],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>DC motorların kontrol laboratuvarlarında neden her yerde olduğu.</strong> Ucuzdurlar, öngörülebilirdirler, ölçümlemesi kolaydır ve transfer fonksiyonları bu dersin standart biçimlerine kusursuz biçimde oturur. Dünyadaki her başlangıç düzeyi PID laboratuvarı, fiziksel olarak ya da benzetimle, bir DC motor kullanır. Bu modeli bilmek EE doğal hakkının bir parçasıdır.</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Denenecek şeyler.</strong> (a) 1. bölümde <code>tau = 1.0</code> ayarlayın — cevap bin kat daha yavaş, tam olarak -1'deki kutbun öngördüğü gibi. (b) 2. bölümde <code>zeta = 0.0</code> ayarlayın — sönümsüz salınım, sistem sonsuza dek çınlar ve oturma süresi sonsuz olur. (c) 3. bölümde <code>L = 0.1</code> H ayarlayın — indüktans artık ihmal edilebilir değil ve tam ikinci mertebe payda bunu gösterir; birinci mertebe yaklaşım gerçekten daha uzak düşer.</p>

<h2 class="lesson-title">Özet</h2>

<p class="l-text">Kontrol sistemleri açık çevrim (ölçüm yok) ve kapalı çevrim (çıkış ölçülür ve geri beslenir) olarak ikiye ayrılır. Kapalı çevrim, bozucuları bertaraf ettiği ve sistem belirsizliğini hoşgördüğü için baskın mimaridir. Sıfır başlangıç koşulları altında doğrusal zamanla değişmez bir ODE, Laplace dönüşümüyle bir transfer fonksiyonuna H(s) = Y(s)/X(s) — paydanın kökleri sistemin kutupları olan polinomlar oranına — dönüşür. Birinci mertebe kanonik biçim K/(tau s + 1) ile ikinci mertebe kanonik biçim omega_n^2/(s^2 + 2 zeta omega_n s + omega_n^2) eğitimin bu aşamasında karşılaşacağınız sistemlerin çoğunu kapsar. Mekanik-elektrik benzeşimi aynı kontrol makinesinin hem bir kütle-yay-sönümleyiciyi hem de bir RLC devresini yönetmesini sağlar. Üç blok diyagramı kuralı — seri H_1 H_2, paralel H_1 + H_2, negatif geri besleme G/(1 + GH) — herhangi bir diyagramı tek bir transfer fonksiyonuna indirger. zeta ve omega_n'den aşım M_p'yi, tepe zamanını pi/omega_d'yi, oturma süresini 4/(zeta omega_n)'i ve yükselme süresini 1.8/omega_n'i doğrudan okursunuz. DC motor türetimi beş fiziksel denklemi tek bir ikinci mertebe H(s)'e indirger ve küçük armatür indüktansı L'yi atmak temiz bir birinci mertebe modeli geri verir. Bir sonraki ders aynı makineyi frekans tanım kümesine taşır — Bode diyagramları, kazanç ve faz marjları, hepsi artık nasıl yazılacağını bildiğimiz transfer fonksiyonu üzerine kurulu.</p>
`
};
