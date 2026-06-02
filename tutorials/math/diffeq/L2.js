window.DIFFEQ_L2 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Second-order linear ODEs with constant coefficients are the mathematical heartbeat of classical engineering.</strong> They describe how a mass on a spring rocks back and forth, how a charge sloshes between an inductor and a capacitor, how a pendulum hesitates after each swing, and how a tall building sways when the wind picks up. One small family of equations — three letters, two derivatives, one variable — explains an entire shelf of physical phenomena.</p>

<p class="l-text">In this lesson we will treat them as a craft. We will write down the most general form, solve the homogeneous case completely with the characteristic equation, walk slowly through the three damping regimes that every mechanical engineer must recognize on sight, find particular solutions by undetermined coefficients and (briefly) by variation of parameters, and finish with forced oscillations and the resonance peak that has knocked bridges down. The arithmetic is gentle; the consequences are violent. By the end you will read a second-order ODE the way a guitarist reads a chord chart.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write any second-order linear ODE in the standard form y'' + p(x) y' + q(x) y = r(x) and decide whether it is homogeneous or non-homogeneous</li>
<li>Solve the constant-coefficient homogeneous equation by writing the characteristic polynomial and reading off its roots</li>
<li>Identify the three damping regimes — overdamped, critically damped, underdamped — from the discriminant and from the time-domain plot</li>
<li>Translate fluently between a mechanical mass-spring-damper, an electrical RLC circuit, and a small-angle pendulum using the unified second-order standard form</li>
<li>Find particular solutions by the method of undetermined coefficients and recognise when variation of parameters is required instead</li>
<li>Explain why resonance occurs when a forcing frequency hits the natural frequency, and why bridges with low damping collapse</li>
</ul>
</div>

<h2 class="lesson-title">1. The General Form and the Superposition Principle</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a metal cylinder hangs from the ceiling on a steel spring with a dashpot (a viscous damper) clamped to it. You release the cylinder from a fixed displacement, with some initial velocity. What happens next — every wiggle, every overshoot, every slow approach to rest — is the solution of one second-order linear ODE. Change the spring, the damper, or the forcing hand on the cylinder, and the same equation, with new numbers, predicts the new motion.</div>

<p class="l-text">A <strong>second-order linear ODE</strong> in standard form looks like this:</p>

<div class="calc-formula"><div class="formula-label">STANDARD FORM</div><div class="formula-main">$$y''(x) + p(x)\\, y'(x) + q(x)\\, y(x) = r(x)$$</div><div class="formula-sub">Two derivatives, no powers or products of y, y', y''. The functions p(x), q(x), r(x) are arbitrary continuous coefficients.</div></div>

<p class="l-text">Two adjectives matter immediately:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Linear</div><div class="card-body">y, y', y'' appear only to the first power. No y squared, no y times y'', no sin(y). The coefficients may be ugly functions of x; the unknown y must enter cleanly.</div></div>
<div class="calc-card"><div class="card-title">Homogeneous when r = 0</div><div class="card-body">No forcing term. The equation describes the system's own free behaviour after you let go. y'' + p y' + q y = 0.</div></div>
<div class="calc-card"><div class="card-title">Non-homogeneous when r is not 0</div><div class="card-body">An external driver is pushing the system: gravity on a pendulum, an oscillating voltage source on an RLC circuit, wind on a building. y'' + p y' + q y = r.</div></div>
<div class="calc-card"><div class="card-title">Constant coefficients</div><div class="card-body">When p(x) = b and q(x) = c are pure numbers, the equation is the easy case we solve in section 2. Most engineering systems live here.</div></div>
</div>

<p class="l-text">The single most useful property of any linear homogeneous equation is the <strong>principle of superposition</strong>:</p>

<div class="calc-formula"><div class="formula-label">SUPERPOSITION PRINCIPLE (HOMOGENEOUS LINEAR ODEs)</div><div class="formula-main">$$\\text{If } y_{1}(x) \\text{ and } y_{2}(x) \\text{ solve } y'' + p y' + q y = 0, \\text{ then } c_{1} y_{1}(x) + c_{2} y_{2}(x) \\text{ also solves it.}$$</div><div class="formula-sub">Any linear combination of solutions is again a solution. This single fact organises the entire theory.</div></div>

<p class="l-text">Two consequences flow from this:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Two is enough</div><div class="card-body">A second-order linear homogeneous ODE has a two-parameter family of solutions. Find any two linearly independent solutions y_1 and y_2 and you have them all: y = c_1 y_1 + c_2 y_2.</div></div>
<div class="calc-card"><div class="card-title">Initial conditions fix the constants</div><div class="card-body">Two initial conditions y(x_0) and y'(x_0) give two linear equations for c_1 and c_2. The unique trajectory pops out.</div></div>
<div class="calc-card"><div class="card-title">Non-homogeneous = homogeneous + particular</div><div class="card-body">The general solution of y'' + p y' + q y = r is y = y_h + y_p where y_h solves the homogeneous version and y_p is any single solution of the full equation.</div></div>
</div>

<div class="l-note"><strong>Why superposition is so special:</strong> it fails the moment the equation becomes non-linear. Add a single y squared term and the sum of two solutions is no longer a solution. That is why linear theory feels orderly and non-linear theory feels wild — and why every classical engineering textbook works very hard to stay linear.</div>

<h2 class="lesson-title">2. Constant Coefficients and the Characteristic Equation</h2>

<div class="calc-highlight"><strong>The trick:</strong> when the coefficients are constants, the homogeneous ODE has solutions of the form y = e^{lambda x}. Plug that guess in, divide out the exponential, and what is left is an ordinary quadratic equation in lambda. Three things can happen — and they are the three damping regimes.</div>

<p class="l-text">Fix attention on the <strong>constant-coefficient homogeneous ODE</strong>:</p>

<div class="calc-formula"><div class="formula-label">CONSTANT-COEFFICIENT HOMOGENEOUS ODE</div><div class="formula-main">$$y''(x) + b\\, y'(x) + c\\, y(x) = 0, \\qquad b, c \\in \\mathbb{R}$$</div><div class="formula-sub">b and c are just numbers. This is the workhorse equation of classical mechanics and circuit theory.</div></div>

<p class="l-text"><strong>The exponential ansatz.</strong> Try a solution of the form <code>y(x) = e^{\\lambda x}</code>. Then <code>y'(x) = \\lambda e^{\\lambda x}</code> and <code>y''(x) = \\lambda^{2} e^{\\lambda x}</code>. Substituting:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Substitute the guess</div><div class="step-detail">lambda^2 e^{lambda x} + b lambda e^{lambda x} + c e^{lambda x} = 0.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Factor the exponential</div><div class="step-detail">e^{lambda x} (lambda^2 + b lambda + c) = 0. The exponential is never zero, so the bracket must vanish.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Read off the characteristic equation</div><div class="step-detail">lambda^2 + b lambda + c = 0. An ordinary quadratic in lambda. Solve it for lambda and you have the exponential rates of every mode the system can vibrate at.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">CHARACTERISTIC EQUATION</div><div class="formula-main">$$\\lambda^{2} + b\\, \\lambda + c = 0 \\quad\\Longrightarrow\\quad \\lambda_{1,2} = \\frac{-b \\pm \\sqrt{b^{2} - 4c}}{2}$$</div><div class="formula-sub">The discriminant Delta = b^2 - 4c decides which of three universes we are in.</div></div>

<p class="l-text">The sign of the discriminant <code>\\Delta = b^{2} - 4 c</code> determines the qualitative behaviour. Each case has its own solution formula:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Case 1: Delta &gt; 0 (two distinct real roots)</div><div class="card-body">lambda_1 and lambda_2 are real and unequal. Two independent solutions e^{lambda_1 x} and e^{lambda_2 x}. General solution: y(x) = c_1 e^{lambda_1 x} + c_2 e^{lambda_2 x}. Pure exponential behaviour — no oscillation.</div></div>
<div class="calc-card"><div class="card-title">Case 2: Delta = 0 (repeated real root)</div><div class="card-body">lambda_1 = lambda_2 = -b/2. The exponential e^{lambda x} is one solution; the second is x e^{lambda x} (you can verify by substitution). General solution: y(x) = (c_1 + c_2 x) e^{lambda x}. Critical case — sits right on the boundary between oscillation and pure decay.</div></div>
<div class="calc-card"><div class="card-title">Case 3: Delta &lt; 0 (complex conjugate roots)</div><div class="card-body">lambda_{1,2} = alpha +/- i beta with alpha = -b/2 and beta = sqrt(4c - b^2)/2. Using Euler's formula, the real general solution is y(x) = e^{alpha x} (c_1 cos(beta x) + c_2 sin(beta x)). Oscillation under an exponential envelope.</div></div>
</div>

<div class="l-note"><strong>One mental model, three regimes:</strong> the system always picks exponentials as its natural modes. When those exponentials have real exponents, motion is monotone; when they have imaginary parts, motion oscillates. The size of the imaginary part sets the frequency; the size of the real part sets the decay (or growth) envelope.</div>

<div class="calc-example"><div class="example-label">SHORT WARM-UP: Solve y'' - 3 y' + 2 y = 0</div><div class="example-body"><strong>Characteristic equation:</strong> lambda^2 - 3 lambda + 2 = 0.<br>Factor: (lambda - 1)(lambda - 2) = 0, so lambda_1 = 1, lambda_2 = 2.<br>Discriminant Delta = 9 - 8 = 1 &gt; 0, two distinct real roots.<br><br><strong>General solution:</strong> y(x) = c_1 e^{x} + c_2 e^{2 x}.<br>Both roots are positive, so this system blows up — unstable. Engineers call this a right-half-plane configuration.</div></div>

<h2 class="lesson-title">3. Worked Example 1: Spring-Mass System (Undamped)</h2>

<div class="calc-highlight"><strong>The cleanest physical example.</strong> A mass m hangs from a spring with stiffness k. Pull it down a distance x_0 from equilibrium and release. With no friction, no air resistance, no damper — what does it do? It oscillates forever, with a frequency set entirely by m and k. This is <em>simple harmonic motion</em>, the first and most important second-order ODE every engineer learns.</div>

<p class="l-text">Newton's second law on the mass gives <code>m a = F_{spring}</code>. The spring force pulls back proportionally to displacement (Hooke's law): <code>F_{spring} = -k x</code>. With <code>a = x''</code>:</p>

<div class="calc-formula"><div class="formula-label">UNDAMPED SPRING-MASS ODE</div><div class="formula-main">$$m\\, x''(t) + k\\, x(t) = 0$$</div><div class="formula-sub">A second-order linear homogeneous ODE with constant coefficients. b = 0 (no damping). c = k/m after dividing through.</div></div>

<p class="l-text">Divide by m to standardise: <code>x'' + (k/m) x = 0</code>. The characteristic equation is</p>

<div class="calc-formula"><div class="formula-label">CHARACTERISTIC EQUATION</div><div class="formula-main">$$\\lambda^{2} + \\frac{k}{m} = 0 \\quad\\Longrightarrow\\quad \\lambda = \\pm i\\, \\sqrt{\\frac{k}{m}} = \\pm i\\, \\omega_{0}$$</div><div class="formula-sub">Purely imaginary roots. Define the natural angular frequency omega_0 = sqrt(k/m).</div></div>

<p class="l-text">Two purely imaginary roots — case 3 with <code>\\alpha = 0</code> and <code>\\beta = \\omega_{0}</code>. The general real solution is</p>

<div class="calc-formula"><div class="formula-label">GENERAL SOLUTION (UNDAMPED SHM)</div><div class="formula-main">$$x(t) = c_{1} \\cos(\\omega_{0} t) + c_{2} \\sin(\\omega_{0} t) = A \\cos(\\omega_{0} t + \\varphi)$$</div><div class="formula-sub">Two equivalent forms. Amplitude A = sqrt(c_1^2 + c_2^2). Phase varphi = arctan(-c_2 / c_1).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Natural frequency omega_0</div><div class="card-body">omega_0 = sqrt(k/m) in rad/s. Stiffer spring -&gt; higher frequency. Heavier mass -&gt; lower frequency. The system has its own preferred oscillation rate, set by physics alone.</div></div>
<div class="calc-card"><div class="card-title">Period T</div><div class="card-body">T = 2 pi / omega_0 = 2 pi sqrt(m/k) seconds. Time for one complete oscillation. Independent of amplitude (small oscillations only).</div></div>
<div class="calc-card"><div class="card-title">Amplitude A</div><div class="card-body">Maximum displacement from equilibrium. Set by initial conditions: how far you pulled the mass and how fast you let it go.</div></div>
<div class="calc-card"><div class="card-title">Phase varphi</div><div class="card-body">Where the oscillation is in its cycle at t = 0. Released from rest at maximum displacement -&gt; varphi = 0 (pure cosine).</div></div>
</div>

<div class="calc-example"><div class="example-label">NUMERICAL EXAMPLE</div><div class="example-body"><strong>m = 1 kg, k = 25 N/m, x(0) = 0.1 m, x'(0) = 0.</strong><br><br>omega_0 = sqrt(25/1) = 5 rad/s.<br>Period T = 2 pi / 5 = 1.257 s.<br>Apply x(0) = 0.1: c_1 = 0.1.<br>Apply x'(0) = 0: -c_1 omega_0 sin(0) + c_2 omega_0 cos(0) = 0, so c_2 = 0.<br><br><strong>Solution:</strong> x(t) = 0.1 cos(5 t) metres.<br>The mass oscillates between +10 cm and -10 cm with a 1.257 second period, forever.</div></div>

<div class="l-note"><strong>Why "forever"?</strong> Because we set b = 0 — no damping, no energy loss. In reality every real spring has some friction, every real circuit has some resistance. Section 4 puts that damping back in and changes the physics completely.</div>

<h2 class="lesson-title">4. Worked Example 2: Damped Spring-Mass — The Three Regimes</h2>

<div class="calc-highlight"><strong>The pedagogical centerpiece of this lesson.</strong> Add a dashpot (a piston in a cylinder of oil) parallel to the spring. The damping force opposes velocity: F_damp = -c x'. The ODE gains a first-derivative term, the discriminant of the characteristic equation can now be positive, zero, or negative, and three completely different motions appear. Every mechanical engineer must recognize all three on sight.</div>

<p class="l-text">With damping, Newton's law reads</p>

<div class="calc-formula"><div class="formula-label">DAMPED SPRING-MASS ODE</div><div class="formula-main">$$m\\, x''(t) + c\\, x'(t) + k\\, x(t) = 0$$</div><div class="formula-sub">c is the viscous damping coefficient (units: N s / m). All three coefficients are positive in any realistic mechanical system.</div></div>

<p class="l-text">Divide by m and bring the equation into <strong>standard second-order form</strong>:</p>

<div class="calc-formula"><div class="formula-label">STANDARD FORM</div><div class="formula-main">$$x''(t) + 2\\, \\zeta\\, \\omega_{0}\\, x'(t) + \\omega_{0}^{2}\\, x(t) = 0$$</div><div class="formula-sub">Natural frequency omega_0 = sqrt(k/m). Damping ratio zeta = c / (2 sqrt(m k)). zeta is dimensionless.</div></div>

<p class="l-text">The characteristic equation is <code>\\lambda^{2} + 2 \\zeta \\omega_{0} \\lambda + \\omega_{0}^{2} = 0</code>, giving</p>

<div class="calc-formula"><div class="formula-label">ROOTS OF THE CHARACTERISTIC EQUATION</div><div class="formula-main">$$\\lambda_{1,2} = -\\zeta\\, \\omega_{0} \\pm \\omega_{0}\\, \\sqrt{\\zeta^{2} - 1}$$</div><div class="formula-sub">The square root determines the regime. zeta^2 - 1 &gt; 0, = 0, &lt; 0 give overdamped, critically damped, underdamped.</div></div>

<p class="l-text">Three regimes, three solution formulas, three pictures:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Overdamped (zeta &gt; 1)</div><div class="card-body">Two distinct negative real roots. lambda_{1,2} = -zeta omega_0 +/- omega_0 sqrt(zeta^2 - 1). Solution x(t) = c_1 e^{lambda_1 t} + c_2 e^{lambda_2 t}. Slow exponential return to equilibrium with no oscillation. Picture: pushing a screen door through molasses — it slumps shut, never bouncing.</div></div>
<div class="calc-card"><div class="card-title">Critically damped (zeta = 1)</div><div class="card-body">Repeated real root lambda = -omega_0. Solution x(t) = (c_1 + c_2 t) e^{-omega_0 t}. <strong>Fastest possible return to equilibrium without overshoot.</strong> Picture: a well-tuned car suspension — sharp bump, immediate settle, no bounce.</div></div>
<div class="calc-card"><div class="card-title">Underdamped (zeta &lt; 1)</div><div class="card-body">Complex conjugate roots lambda = -zeta omega_0 +/- i omega_d with damped frequency omega_d = omega_0 sqrt(1 - zeta^2). Solution x(t) = e^{-zeta omega_0 t} (c_1 cos(omega_d t) + c_2 sin(omega_d t)). Decaying oscillation. Picture: a tuning fork — rings clearly, slowly dies out.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-damping-regimes-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the three damping regimes for a unit-amplitude spring-mass system with omega_0 = 1 rad/s, released from x(0) = 1, x'(0) = 0. The underdamped curve (zeta = 0.2) overshoots and rings. The critically damped curve (zeta = 1) returns to zero as fast as possible without any overshoot. The overdamped curves (zeta = 2 and zeta = 4) crawl back to zero, more slowly the larger zeta is. <em>Critical damping is the engineering sweet spot when overshoot is unacceptable.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=600;i++)t.push(i/40);
function resp(z){
  var wn=1;var out=[];
  for(var i=0;i<t.length;i++){
    var x=t[i],y;
    if(Math.abs(z-1)<1e-6){y=(1+wn*x)*Math.exp(-wn*x);}
    else if(z<1){var wd=wn*Math.sqrt(1-z*z);y=Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z*wn/wd)*Math.sin(wd*x));}
    else{var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;var c1=(0-r2)/(r1-r2);var c2=1-c1;y=c1*Math.exp(r1*x)+c2*Math.exp(r2*x);}
    out.push(y);
  }
  return out;
}
var d1={x:t,y:resp(0.2),mode:'lines',name:'underdamped (zeta=0.2)',line:{color:'#f87171',width:2.6}};
var d2={x:t,y:resp(1.0),mode:'lines',name:'critically damped (zeta=1)',line:{color:'#10b981',width:2.6}};
var d3={x:t,y:resp(2.0),mode:'lines',name:'overdamped (zeta=2)',line:{color:'#3b82f6',width:2.6}};
var d4={x:t,y:resp(4.0),mode:'lines',name:'overdamped (zeta=4)',line:{color:'#f59e0b',width:2.6,dash:'dot'}};
var zero={x:[0,15],y:[0,0],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,15]},yaxis:{title:'x(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.6,1.1]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-damping-regimes-en',[zero,d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">NUMERICAL EXAMPLE — A SHOCK ABSORBER</div><div class="example-body"><strong>m = 2 kg, k = 200 N/m, c = ?</strong> Design for critical damping.<br><br>omega_0 = sqrt(200/2) = 10 rad/s.<br>Critical: zeta = 1 means c = 2 sqrt(m k) = 2 sqrt(2 * 200) = 2 * 20 = <strong>40 N s / m</strong>.<br>Pick c = 20 -&gt; zeta = 0.5 -&gt; underdamped (car bounces after a bump — bad).<br>Pick c = 80 -&gt; zeta = 2 -&gt; overdamped (car settles slowly — also bad on rough roads).<br>Pick c = 40 -&gt; zeta = 1 -&gt; critical damping (smooth ride — Goldilocks).</div></div>

<div class="l-note"><strong>The takeaway:</strong> the damping ratio zeta is the single number that tells you everything about transient behaviour. zeta = 0 is pure oscillation, zeta = 1 is the boundary, zeta &gt; 1 is sluggish return. Engineering design is mostly about putting zeta where it needs to be. Car suspensions target roughly zeta = 0.7 to balance ride comfort and handling; analogue filters with Butterworth response also place their poles at zeta = 1/sqrt(2) approximately 0.707.</div>

<h2 class="lesson-title">5. Worked Example 3: RLC Circuit — The Same Equation in a Different Suit</h2>

<div class="calc-highlight"><strong>The deep payoff:</strong> the equation governing charge in a series RLC circuit is <em>structurally identical</em> to the damped spring-mass equation. Voltage source equals applied force, inductance equals mass, resistance equals damping, inverse capacitance equals spring constant. Once you understand one, you understand both. This is the most beautiful instance of <em>mathematical analogy</em> in undergraduate engineering.</div>

<p class="l-text">A series RLC circuit driven by a voltage source <code>V(t)</code>: resistor R, inductor L, capacitor C, all in series, current i(t) flowing around the loop. Let <code>q(t)</code> denote the charge on the capacitor (so <code>i = q'</code>). Kirchhoff's voltage law sums the drops around the loop:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inductor</div><div class="card-body">V_L = L di/dt = L q''. Voltage proportional to current's time derivative.</div></div>
<div class="calc-card"><div class="card-title">Resistor</div><div class="card-body">V_R = R i = R q'. Voltage proportional to current (Ohm's law).</div></div>
<div class="calc-card"><div class="card-title">Capacitor</div><div class="card-body">V_C = q / C. Voltage proportional to stored charge.</div></div>
<div class="calc-card"><div class="card-title">Source</div><div class="card-body">V(t). Applied voltage, the "forcing" of the circuit.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">SERIES RLC ODE</div><div class="formula-main">$$L\\, q''(t) + R\\, q'(t) + \\frac{1}{C}\\, q(t) = V(t)$$</div><div class="formula-sub">A second-order linear ODE in q(t). Constant coefficients L, R, 1/C. Forcing function V(t).</div></div>

<p class="l-text">Compare term by term with the damped spring-mass equation <code>m x'' + c x' + k x = F(t)</code>. The mapping is exact:</p>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.18);border-radius:8px;overflow:hidden">
<thead><tr style="background:rgba(59,130,246,0.12)"><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">MECHANICAL (spring-mass-damper)</th><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">ELECTRICAL (series RLC)</th><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">ROLE</th></tr></thead>
<tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Displacement x(t)</td><td style="padding:0.6rem 1rem">Charge q(t)</td><td style="padding:0.6rem 1rem">State variable</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Velocity x'(t)</td><td style="padding:0.6rem 1rem">Current i(t) = q'(t)</td><td style="padding:0.6rem 1rem">Rate of change</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Mass m</td><td style="padding:0.6rem 1rem">Inductance L</td><td style="padding:0.6rem 1rem">Inertia</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Damping c</td><td style="padding:0.6rem 1rem">Resistance R</td><td style="padding:0.6rem 1rem">Energy dissipation</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Stiffness k</td><td style="padding:0.6rem 1rem">Inverse capacitance 1/C</td><td style="padding:0.6rem 1rem">Restoring force</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">External force F(t)</td><td style="padding:0.6rem 1rem">Source voltage V(t)</td><td style="padding:0.6rem 1rem">Driver</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">omega_0 = sqrt(k/m)</td><td style="padding:0.6rem 1rem">omega_0 = 1/sqrt(L C)</td><td style="padding:0.6rem 1rem">Natural frequency</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">zeta = c/(2 sqrt(m k))</td><td style="padding:0.6rem 1rem">zeta = (R/2) sqrt(C/L)</td><td style="padding:0.6rem 1rem">Damping ratio</td></tr>
</tbody></table>

<div class="l-note"><strong>One ODE, two languages.</strong> If you can solve a mass-spring-damper, you can solve an RLC circuit — and vice versa. Every plot, every formula, every regime classification carries over unchanged. This is why control engineers, signal-processing engineers, and mechanical engineers all read each other's papers fluently.</div>

<p class="l-text">Three regimes in the circuit, exactly the analogues of the mechanical ones:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Overdamped (R large, zeta &gt; 1)</div><div class="card-body">Capacitor discharges monotonically through the resistor. No ring. R^2 &gt; 4 L/C.</div></div>
<div class="calc-card"><div class="card-title">Critically damped (zeta = 1)</div><div class="card-body">R = 2 sqrt(L/C). Fastest non-oscillatory discharge.</div></div>
<div class="calc-card"><div class="card-title">Underdamped (R small, zeta &lt; 1)</div><div class="card-body">The famous "ringing" you see on digital signals reflecting from unterminated transmission lines. R^2 &lt; 4 L/C. Energy sloshes back and forth between L and C as it dissipates.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-rlc-decay-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> capacitor voltage V_C(t) = q(t)/C in a series RLC circuit, initially charged to 1 V and then short-circuited at t = 0 (V(t) = 0 for t &gt; 0). L = 1 H, C = 1 F, three resistor values that put zeta at 0.15 (heavy ring), 1.0 (critical), and 3.0 (overdamped). Same plot you saw for the mechanical mass-spring-damper — proving the analogy is more than a metaphor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=600;i++)t.push(i/40);
function resp(z){
  var wn=1;var out=[];
  for(var i=0;i<t.length;i++){
    var x=t[i],y;
    if(Math.abs(z-1)<1e-6){y=(1+wn*x)*Math.exp(-wn*x);}
    else if(z<1){var wd=wn*Math.sqrt(1-z*z);y=Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z*wn/wd)*Math.sin(wd*x));}
    else{var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;var c1=(0-r2)/(r1-r2);var c2=1-c1;y=c1*Math.exp(r1*x)+c2*Math.exp(r2*x);}
    out.push(y);
  }
  return out;
}
var d1={x:t,y:resp(0.15),mode:'lines',name:'zeta=0.15 (ringing)',line:{color:'#f87171',width:2.6}};
var d2={x:t,y:resp(1.0),mode:'lines',name:'zeta=1 (critical)',line:{color:'#10b981',width:2.6}};
var d3={x:t,y:resp(3.0),mode:'lines',name:'zeta=3 (overdamped)',line:{color:'#3b82f6',width:2.6}};
var zero={x:[0,15],y:[0,0],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,15]},yaxis:{title:'V_C(t) (V)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.6,1.1]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-rlc-decay-en',[zero,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">A WORKED RLC DESIGN</div><div class="example-body"><strong>L = 10 mH, C = 100 nF. What R gives critical damping?</strong><br><br>R_crit = 2 sqrt(L/C) = 2 sqrt(0.01 / 1e-7) = 2 sqrt(10^5) = 2 * 316 = <strong>632 ohm</strong>.<br>omega_0 = 1 / sqrt(L C) = 1 / sqrt(0.01 * 1e-7) = 1 / sqrt(1e-9) = <strong>31623 rad/s</strong> (about 5 kHz).<br><br>R = 100 ohm -&gt; zeta = 0.16 -&gt; underdamped ringing at 5 kHz (a tank-circuit oscillator's natural mode).<br>R = 632 ohm -&gt; zeta = 1 -&gt; critical (a clean step response with no overshoot).<br>R = 2000 ohm -&gt; zeta = 3.2 -&gt; overdamped (slow envelope follower).</div></div>

<h2 class="lesson-title">6. Non-Homogeneous Equations — Undetermined Coefficients</h2>

<div class="calc-highlight"><strong>The recipe:</strong> for the non-homogeneous equation, the general solution is y = y_h + y_p. The homogeneous part y_h is solved by the characteristic equation as before. For the particular part y_p, when the forcing r(x) is a nice "elementary" function (polynomial, exponential, sine, cosine, or product), <em>guess</em> a y_p of the same form with unknown coefficients, substitute into the ODE, and match coefficients to solve for them.</div>

<p class="l-text">The method works because differentiating any of these elementary functions stays within the same family — derivatives of e^{ax} are still e^{ax}, derivatives of sin(omega x) and cos(omega x) just permute amongst each other, derivatives of polynomials are polynomials of lower degree. So the right side of the ODE, when y_p is one of these forms, lands in the same family — and we just have to match.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">r(x) = e^{a x}</div><div class="card-body">Guess y_p = A e^{a x}. One unknown coefficient A. Plug in, the e^{ax} factors out, solve for A. Special case: if a happens to coincide with a root of the characteristic equation, multiply the guess by x.</div></div>
<div class="calc-card"><div class="card-title">r(x) = sin(beta x) or cos(beta x)</div><div class="card-body">Guess y_p = A sin(beta x) + B cos(beta x). Two unknowns. Plug in, separate sine and cosine coefficients, solve a 2x2 linear system.</div></div>
<div class="calc-card"><div class="card-title">r(x) = polynomial of degree n</div><div class="card-body">Guess y_p = a_n x^n + ... + a_0 (same degree). Substitute, match powers of x, solve for the coefficients.</div></div>
<div class="calc-card"><div class="card-title">r(x) = product (e.g. e^{ax} sin(beta x))</div><div class="card-body">Guess the product of the appropriate forms: y_p = e^{ax}(A sin(beta x) + B cos(beta x)). Same matching procedure.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Solve y'' - 3 y' + 2 y = e^{3 x}</div><div class="example-body"><strong>Step 1: homogeneous solution.</strong> Characteristic equation lambda^2 - 3 lambda + 2 = (lambda - 1)(lambda - 2) = 0, so lambda = 1, 2. y_h = c_1 e^{x} + c_2 e^{2 x}.<br><br><strong>Step 2: guess particular.</strong> Forcing is e^{3 x}; 3 is NOT a root of the characteristic equation, so try y_p = A e^{3 x}.<br>Then y_p' = 3 A e^{3 x}, y_p'' = 9 A e^{3 x}.<br>Substitute: 9 A e^{3x} - 3(3 A e^{3x}) + 2(A e^{3x}) = e^{3x}<br>Simplify: (9 - 9 + 2) A e^{3 x} = e^{3 x}<br>So 2 A = 1, hence A = 1/2.<br><br><strong>Particular solution:</strong> y_p = (1/2) e^{3 x}.<br><br><strong>General solution:</strong> y(x) = c_1 e^{x} + c_2 e^{2 x} + (1/2) e^{3 x}.</div></div>

<div class="l-note"><strong>The "resonance" trap.</strong> If the forcing exponent or frequency happens to match a root of the characteristic equation, the basic guess fails (you get 0 = e^{ax}, an absurdity). The fix is to <em>multiply the trial y_p by x</em> (or by x^2 for a repeated root). Physically this corresponds to driving the system at exactly its natural frequency, where the response grows linearly with time — pure resonance.</div>

<div class="calc-example"><div class="example-label">RESONANCE CASE — Solve y'' - 3 y' + 2 y = e^{x}</div><div class="example-body">Now the forcing exponent 1 matches the root lambda = 1. The naive guess y_p = A e^{x} would give (1 - 3 + 2) A e^{x} = 0, not e^{x}. Multiply by x: <strong>y_p = A x e^{x}</strong>.<br><br>Then y_p' = A e^{x}(1 + x), y_p'' = A e^{x}(2 + x).<br>Substitute: A e^{x}(2 + x) - 3 A e^{x}(1 + x) + 2 A x e^{x}<br>= A e^{x}[(2 + x) - (3 + 3x) + 2x] = A e^{x}[-1] = -A e^{x}.<br>Set equal to e^{x}: -A = 1, so A = -1.<br><br><strong>Particular solution:</strong> y_p = -x e^{x}. <em>Linear growth in front of the exponential — the signature of resonance.</em></div></div>

<h2 class="lesson-title">7. Variation of Parameters (Brief)</h2>

<div class="calc-highlight"><strong>When the right side is ugly</strong> — say r(x) = tan(x) or 1/x or some weird piecewise function — undetermined coefficients gives no guess to start from. The completely general technique is <em>variation of parameters</em>. It always works in principle; the price is a pair of integrals that may or may not be elementary.</div>

<p class="l-text">Suppose you have already found the two homogeneous solutions <code>y_{1}(x)</code> and <code>y_{2}(x)</code>. Variation of parameters writes the particular solution as</p>

<div class="calc-formula"><div class="formula-label">VARIATION OF PARAMETERS FORMULA</div><div class="formula-main">$$y_{p}(x) = -y_{1}(x) \\int \\frac{y_{2}(x)\\, r(x)}{W(x)}\\, dx + y_{2}(x) \\int \\frac{y_{1}(x)\\, r(x)}{W(x)}\\, dx$$</div><div class="formula-sub">W(x) = y_1 y_2' - y_2 y_1' is the Wronskian. It is non-zero whenever y_1 and y_2 are linearly independent.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">The Wronskian W(x)</div><div class="card-body">W = y_1 y_2' - y_2 y_1'. A determinant that measures linear independence. For constant-coefficient ODEs W is itself an exponential — easy to compute.</div></div>
<div class="calc-card"><div class="card-title">When to reach for it</div><div class="card-body">Right side is not a polynomial, exponential, sine, cosine, or simple product of these. Undetermined coefficients has no obvious guess to start from.</div></div>
<div class="calc-card"><div class="card-title">When to avoid it</div><div class="card-body">When undetermined coefficients works — it almost always involves less algebra. Variation of parameters is the heavy artillery; do not use it for sparrow problems.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE — Solve y'' + y = sec(x) (impossible by undetermined coefficients)</div><div class="example-body"><strong>Homogeneous solutions:</strong> y_1 = cos(x), y_2 = sin(x). Wronskian W = cos(x) cos(x) - sin(x)(-sin(x)) = 1.<br><br><strong>Apply the formula</strong> with r(x) = sec(x) = 1/cos(x) and W = 1:<br>y_p = -cos(x) integral [sin(x)/cos(x)] dx + sin(x) integral [cos(x)/cos(x)] dx<br>= -cos(x) * (-ln|cos(x)|) + sin(x) * x<br>= cos(x) ln|cos(x)| + x sin(x).<br><br><strong>General solution:</strong> y(x) = c_1 cos(x) + c_2 sin(x) + cos(x) ln|cos(x)| + x sin(x). A genuinely non-trivial mix — no clever guess could have produced it.</div></div>

<h2 class="lesson-title">8. Forced Oscillations and Resonance — Why Bridges Collapse</h2>

<div class="calc-highlight"><strong>Take the damped spring-mass equation and drive it with a sinusoidal force at frequency omega.</strong> The transient solution decays away. What is left is the <em>steady-state</em> response, also a sinusoid at frequency omega, but with an amplitude that depends sharply on how close omega is to the system's natural frequency omega_0. Hit the right frequency with low damping and the amplitude becomes enormous. That is resonance — and it is the reason engineers obsess over damping in structures.</div>

<div class="calc-formula"><div class="formula-label">FORCED DAMPED OSCILLATOR</div><div class="formula-main">$$m\\, x''(t) + c\\, x'(t) + k\\, x(t) = F_{0}\\, \\cos(\\omega\\, t)$$</div><div class="formula-sub">Sinusoidal forcing at angular frequency omega and amplitude F_0. The natural frequency is omega_0 = sqrt(k/m); the damping ratio is zeta = c/(2 sqrt(m k)).</div></div>

<p class="l-text"><strong>Steady-state solution.</strong> Try <code>x_{p}(t) = A \\cos(\\omega t - \\phi)</code> with amplitude A and phase lag phi to be determined. Substitute, match cosine and sine coefficients, and after some algebra you get:</p>

<div class="calc-formula"><div class="formula-label">STEADY-STATE AMPLITUDE</div><div class="formula-main">$$A(\\omega) = \\frac{F_{0}/m}{\\sqrt{(\\omega_{0}^{2} - \\omega^{2})^{2} + (2\\, \\zeta\\, \\omega_{0}\\, \\omega)^{2}}}$$</div><div class="formula-sub">The amplitude as a function of the driving frequency omega. The bigger the bracket in the denominator, the smaller the response.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Low frequency (omega &lt;&lt; omega_0)</div><div class="card-body">Denominator dominated by omega_0^2. A approaches F_0/(m omega_0^2) = F_0/k — the static deflection. The mass moves quasi-statically with the force.</div></div>
<div class="calc-card"><div class="card-title">Resonance (omega approximately omega_0)</div><div class="card-body">(omega_0^2 - omega^2) goes to zero. Only the damping term in the denominator survives. A peaks at approximately F_0/(2 zeta m omega_0^2). <strong>For small zeta this peak is huge.</strong></div></div>
<div class="calc-card"><div class="card-title">High frequency (omega &gt;&gt; omega_0)</div><div class="card-body">Denominator dominated by omega^4. A falls off as 1/omega^2. The mass cannot keep up with the rapid forcing — its inertia wins.</div></div>
</div>

<p class="l-text"><strong>The resonance peak.</strong> The amplitude is maximised at <code>\\omega_{r} = \\omega_{0} \\sqrt{1 - 2 \\zeta^{2}}</code> (slightly below omega_0), and the peak height is approximately <code>F_{0}/(2 \\zeta k)</code> for small zeta. As zeta -&gt; 0, the peak height blows up to infinity — the system absorbs the driver's energy faster than it can dissipate it.</p>

<div class="calc-graph"><div id="plot-l2-resonance-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the normalised resonance curve A(omega) * k / F_0 as a function of omega/omega_0 for five damping ratios. The horizontal axis is the driving frequency in units of the natural frequency; the peak sits near omega/omega_0 = 1 for low damping. zeta = 0.05 gives a sharp peak roughly 10x the static deflection. zeta = 0.7 has almost no peak — it is the engineering "flat" response. zeta = 1 and higher show no peak at all. <em>This single picture explains why suspension bridges have tuned mass dampers and why your washing machine vibrates worst at a particular spin speed.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=[];for(var i=1;i<=400;i++)r.push(i/100);
function amp(z){var out=[];for(var i=0;i<r.length;i++){var u=r[i];var den=Math.sqrt(Math.pow(1-u*u,2)+Math.pow(2*z*u,2));out.push(1/den);}return out;}
var d1={x:r,y:amp(0.05),mode:'lines',name:'zeta=0.05',line:{color:'#f87171',width:2.6}};
var d2={x:r,y:amp(0.15),mode:'lines',name:'zeta=0.15',line:{color:'#f59e0b',width:2.6}};
var d3={x:r,y:amp(0.3),mode:'lines',name:'zeta=0.3',line:{color:'#10b981',width:2.6}};
var d4={x:r,y:amp(0.7),mode:'lines',name:'zeta=0.7',line:{color:'#3b82f6',width:2.6}};
var d5={x:r,y:amp(1.5),mode:'lines',name:'zeta=1.5',line:{color:'#a78bfa',width:2.6,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'omega / omega_0',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,3]},yaxis:{title:'normalised amplitude A k / F_0',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,11]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-resonance-en',[d1,d2,d3,d4,d5],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The Tacoma Narrows Bridge (1940).</strong> The famous footage of a suspension bridge twisting itself apart in a moderate wind is a textbook example of an underdamped second-order system encountering aerodynamic forcing near its natural torsional frequency. The bridge had almost no damping at that mode; the wind happened to drive it at exactly the wrong frequency; the amplitude grew until the deck failed. Modern long-span bridges all carry <em>tuned mass dampers</em> — large weights on springs designed to absorb energy at the dangerous resonant frequencies. The London Millennium Bridge famously had to retrofit dampers when pedestrians' footsteps inadvertently drove it at one of its lateral natural frequencies.</div>

<h2 class="lesson-title">9. Energy Methods for Conservative Systems</h2>

<div class="calc-highlight"><strong>When there is no damping, energy is conserved.</strong> The kinetic energy plus the potential energy of the system is constant in time. This single fact gives a <em>first integral</em> of the motion — one differentiation order is removed, the second-order ODE collapses to a first-order one, and the trajectory is determined by initial conditions alone.</div>

<p class="l-text">For the undamped spring-mass system, the energies are</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kinetic energy</div><div class="card-body">T = (1/2) m v^2 = (1/2) m (x')^2. The energy stored in the motion of the mass.</div></div>
<div class="calc-card"><div class="card-title">Potential energy</div><div class="card-body">U = (1/2) k x^2. The energy stored in the stretched or compressed spring.</div></div>
<div class="calc-card"><div class="card-title">Total energy</div><div class="card-body">E = T + U = (1/2) m (x')^2 + (1/2) k x^2 = constant. Time-independent for the undamped system.</div></div>
</div>

<p class="l-text">Differentiate E with respect to t to verify it really is constant:</p>

<div class="calc-formula"><div class="formula-label">ENERGY CONSERVATION CHECK</div><div class="formula-main">$$\\frac{dE}{dt} = m\\, x'\\, x'' + k\\, x\\, x' = x'\\, (m\\, x'' + k\\, x) = x' \\cdot 0 = 0$$</div><div class="formula-sub">The bracket vanishes by the undamped ODE. Therefore E is constant along every trajectory.</div></div>

<p class="l-text">For the simple harmonic oscillator <code>x(t) = A \\cos(\\omega_{0} t)</code>, you can confirm directly that kinetic and potential energy oscillate out of phase — each peaks when the other is zero — while their sum stays put at <code>(1/2) k A^{2}</code>.</p>

<div class="calc-graph"><div id="plot-l2-energy-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> kinetic energy T(t), potential energy U(t), and total energy E(t) for an undamped spring-mass system with m = 1, k = 1, A = 1, omega_0 = 1. T and U each oscillate between 0 and 0.5 at angular frequency 2 omega_0 (twice the position frequency, because squaring shifts the spectrum). Their sum E is flat at 0.5 — energy is exchanged between the two reservoirs but never lost. <em>Add damping and E begins to decay; that decay rate is exactly 2 zeta omega_0.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/20);
var KE=[],PE=[],TE=[];
for(var i=0;i<t.length;i++){var x=Math.cos(t[i]);var v=-Math.sin(t[i]);var ke=0.5*v*v;var pe=0.5*x*x;KE.push(ke);PE.push(pe);TE.push(ke+pe);}
var d1={x:t,y:KE,mode:'lines',name:'kinetic T(t)',line:{color:'#3b82f6',width:2.4}};
var d2={x:t,y:PE,mode:'lines',name:'potential U(t)',line:{color:'#f87171',width:2.4}};
var d3={x:t,y:TE,mode:'lines',name:'total E(t)',line:{color:'#10b981',width:3,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,20]},yaxis:{title:'energy (J)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,0.65]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-energy-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="color:#3b82f6;margin-top:1.4rem">Phase portrait: position versus velocity</h3>

<p class="l-text">A second visualisation that engineers love: plot velocity <code>v = x'</code> on the vertical axis against position <code>x</code> on the horizontal axis. For the undamped oscillator the trajectory is a closed ellipse (because energy is constant — and the energy formula is an ellipse equation in x and v). For an underdamped oscillator the trajectory is an inward spiral (energy decays). For an overdamped system the trajectory falls directly into the origin without circling.</p>

<div class="calc-graph"><div id="plot-l2-phase-under-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the phase portrait (x, v) of an underdamped spring-mass system with omega_0 = 1, zeta = 0.1, released from x(0) = 1, v(0) = 0. The trajectory spirals inward — every loop is one period of oscillation, and the radius shrinks by a factor e^{-zeta omega_0 T} per cycle. The origin is a stable spiral attractor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=2000;i++)t.push(i/40);
var x=[],v=[];var z=0.1,wn=1;var wd=wn*Math.sqrt(1-z*z);
for(var i=0;i<t.length;i++){var ti=t[i];var env=Math.exp(-z*wn*ti);var c=Math.cos(wd*ti),s=Math.sin(wd*ti);var xi=env*(c+(z*wn/wd)*s);var vi=env*(-wd*s+(z*wn/wd)*(wd*c)-z*wn*(c+(z*wn/wd)*s));x.push(xi);v.push(vi);}
var d={x:x,y:v,mode:'lines',name:'trajectory',line:{color:'#3b82f6',width:1.6}};
var start={x:[x[0]],y:[v[0]],mode:'markers',name:'start',marker:{size:10,color:'#f59e0b'}};
var ori={x:[0],y:[0],mode:'markers',name:'origin (attractor)',marker:{size:12,color:'#f87171',symbol:'x',line:{width:3}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'position x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.2,1.2]},yaxis:{title:'velocity v',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.2,1.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-phase-under-en',[d,start,ori],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l2-phase-over-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the phase portrait of an overdamped system (omega_0 = 1, zeta = 2.5), released from x(0) = 1, v(0) = 0. The trajectory falls into the origin without any circling — the system is too sluggish to oscillate. The origin is a stable node attractor. Contrast with the underdamped spiral above: same equation, different damping ratio, qualitatively different geometry.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/20);
var x=[],v=[];var z=2.5,wn=1;var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;
var x0=1,v0=0;var c1=(v0-r2*x0)/(r1-r2);var c2=x0-c1;
for(var i=0;i<t.length;i++){var ti=t[i];var xi=c1*Math.exp(r1*ti)+c2*Math.exp(r2*ti);var vi=c1*r1*Math.exp(r1*ti)+c2*r2*Math.exp(r2*ti);x.push(xi);v.push(vi);}
var d={x:x,y:v,mode:'lines',name:'trajectory',line:{color:'#3b82f6',width:2.2}};
var start={x:[x[0]],y:[v[0]],mode:'markers',name:'start',marker:{size:10,color:'#f59e0b'}};
var ori={x:[0],y:[0],mode:'markers',name:'origin (node attractor)',marker:{size:12,color:'#f87171',symbol:'x',line:{width:3}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'position x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-0.2,1.2]},yaxis:{title:'velocity v',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-0.6,0.2]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-phase-over-en',[d,start,ori],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Things to try.</strong> Set <code>c = 0</code> and confirm the position oscillates forever and the energy E is rigorously constant (the numerical method drifts very slightly — that is integration error, not physics). Set <code>c = 6.3 = 2 sqrt(m k)</code> and watch the regime label flip to <code>CRITICALLY DAMPED</code> and the position fall to zero without overshoot. Push <code>c = 20</code> and watch overdamped sluggishness take over. Change <code>k</code> to 100 N/m and feel the frequency triple. Try negative <code>c</code> — a mathematical impossibility for a passive damper but a fine model for an active amplifier — and watch the system blow up exponentially.</p>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">Second-order linear ODEs with constant coefficients are the workhorse equations of classical mechanics, circuit theory, and structural dynamics. The homogeneous case y'' + b y' + c y = 0 is solved by the exponential ansatz y = e^{lambda x}, which reduces to the characteristic quadratic lambda^2 + b lambda + c = 0. The discriminant b^2 - 4 c selects one of three universes: two distinct real roots (pure exponential, overdamped for mechanical systems), one repeated real root (critical damping — the boundary, fastest return without overshoot), or a complex conjugate pair (oscillation under an exponential envelope, the underdamped case). The same equation describes both a spring-mass-damper and a series RLC circuit; mass maps to inductance, damping to resistance, stiffness to inverse capacitance, displacement to charge. Non-homogeneous problems split into a homogeneous part plus a particular part; undetermined coefficients handles forcing functions that are polynomials, exponentials, sinusoids, or products, while variation of parameters covers everything else at the cost of two integrals. When the forcing is sinusoidal and its frequency approaches the system's natural frequency, the steady-state amplitude peaks sharply — this is resonance, sharper the smaller the damping, and why bridges, buildings, and washing machines all need careful dynamic design. Energy methods give a first integral of conservative motion and the geometric picture of phase portraits — closed ellipses for undamped, inward spirals for underdamped, direct fall-in for overdamped. The next lesson, on Laplace transforms applied to ODEs, will revisit every result here from a complementary algebraic angle.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Sabit katsayılı ikinci mertebe doğrusal ODE'ler, klasik mühendisliğin matematiksel kalp atışıdır.</strong> Bir yay üzerindeki kütlenin nasıl ileri geri sallandığını, bir yükün bir bobinle bir kondansatör arasında nasıl gidip geldiğini, sarkacın her salınımdan sonra nasıl tereddüt ettiğini ve rüzgâr arttığında yüksek bir binanın nasıl sallandığını açıklarlar. Küçük bir denklem ailesi — üç harf, iki türev, bir değişken — koca bir fiziksel olgular rafını anlatır.</p>

<p class="l-text">Bu derste konuyu bir zanaat olarak ele alacağız. En genel formu yazacağız, homojen durumu karakteristik denklemle eksiksiz çözeceğiz, her makina mühendisinin görür görmez tanıması gereken üç sönüm rejiminde yavaş yavaş yürüyeceğiz, belirsiz katsayılar yöntemi ve (kısaca) parametrelerin değişimi yöntemiyle özel çözümler bulacağız, ve zorlanmış salınımlarla — köprüleri yıkmış olan rezonans tepesiyle — bitireceğiz. Aritmetik nazik; sonuçları sert. Sonunda ikinci mertebe bir ODE'yi, bir gitarcının akor tablosunu okuduğu gibi okuyacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Herhangi bir ikinci mertebe doğrusal ODE'yi y'' + p(x) y' + q(x) y = r(x) standart formunda yazmak ve homojen mi yoksa homojen olmayan mı olduğuna karar vermek</li>
<li>Sabit katsayılı homojen denklemi karakteristik polinomu yazarak ve köklerini okuyarak çözmek</li>
<li>Üç sönüm rejimini — aşırı sönümlü, kritik sönümlü, zayıf sönümlü — diskriminantdan ve zaman alanı grafiğinden ayırt etmek</li>
<li>Mekanik kütle-yay-sönümleyici, elektriksel RLC devresi ve küçük açılı sarkaç arasında birleşik ikinci mertebe standart formu kullanarak akıcı şekilde tercüme yapmak</li>
<li>Belirsiz katsayılar yöntemiyle özel çözümler bulmak ve bunun yerine parametrelerin değişiminin gerektiği durumları tanımak</li>
<li>Bir zorlanma frekansı doğal frekansa çarptığında neden rezonansın oluştuğunu ve neden düşük sönümlü köprülerin çöktüğünü açıklamak</li>
</ul>
</div>

<h2 class="lesson-title">1. Genel Form ve Üstüste Binme İlkesi</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> Tavandan çelik bir yayla sarkan ve üzerine bir damper (viskoz sönümleyici) tutturulmuş metal bir silindir. Silindiri sabit bir yer değiştirmeyle, bir başlangıç hızıyla bırakırsınız. Sonra ne olursa — her kıvrılma, her aşım, her dingin durağa yavaş yaklaşım — bir tek ikinci mertebe doğrusal ODE'nin çözümüdür. Yayı, damperi ya da silindire uygulanan zorlayıcı eli değiştirin; aynı denklem, yeni sayılarla, yeni hareketi öngörür.</div>

<p class="l-text">Standart formda bir <strong>ikinci mertebe doğrusal ODE</strong> şöyle görünür:</p>

<div class="calc-formula"><div class="formula-label">STANDART FORM</div><div class="formula-main">$$y''(x) + p(x)\\, y'(x) + q(x)\\, y(x) = r(x)$$</div><div class="formula-sub">İki türev, y, y', y''nin hiç bir kuvveti ya da çarpımı yok. p(x), q(x), r(x) fonksiyonları keyfi sürekli katsayılardır.</div></div>

<p class="l-text">İki sıfat hemen önemlidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğrusal</div><div class="card-body">y, y', y'' yalnızca birinci kuvvete kadar görünür. y kare yok, y çarpı y'' yok, sin(y) yok. Katsayılar x'in çirkin fonksiyonları olabilir; bilinmeyen y temiz girmelidir.</div></div>
<div class="calc-card"><div class="card-title">r = 0 olduğunda homojen</div><div class="card-body">Zorlayıcı terim yok. Denklem sistemin bıraktıktan sonraki kendi serbest davranışını tanımlar. y'' + p y' + q y = 0.</div></div>
<div class="calc-card"><div class="card-title">r sıfır değilse homojen değil</div><div class="card-body">Sistemi bir dış sürücü itiyor: sarkaca yerçekimi, RLC devresine salınımlı voltaj kaynağı, binaya rüzgâr. y'' + p y' + q y = r.</div></div>
<div class="calc-card"><div class="card-title">Sabit katsayılar</div><div class="card-body">p(x) = b ve q(x) = c saf sayılar olduğunda, denklem bölüm 2'de çözdüğümüz kolay durumdur. Mühendislik sistemlerinin çoğu burada yaşar.</div></div>
</div>

<p class="l-text">Herhangi bir doğrusal homojen denklemin en kullanışlı özelliği <strong>üstüste binme ilkesidir</strong>:</p>

<div class="calc-formula"><div class="formula-label">ÜSTÜSTE BİNME İLKESİ (HOMOJEN DOĞRUSAL ODE'LER)</div><div class="formula-main">$$\\text{y}_{1}(x) \\text{ ve } y_{2}(x) \\text{ } y'' + p y' + q y = 0 \\text{ denklemini çözüyorsa, } c_{1} y_{1}(x) + c_{2} y_{2}(x) \\text{ de çözer.}$$</div><div class="formula-sub">Çözümlerin herhangi bir doğrusal kombinasyonu yine bir çözümdür. Bu tek olgu tüm teoriyi düzenler.</div></div>

<p class="l-text">Bundan iki sonuç doğar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki tane yeterli</div><div class="card-body">İkinci mertebe doğrusal homojen bir ODE'nin iki parametreli çözüm ailesi vardır. Doğrusal bağımsız herhangi iki çözüm y_1 ve y_2 bulun, hepsi sizdedir: y = c_1 y_1 + c_2 y_2.</div></div>
<div class="calc-card"><div class="card-title">Başlangıç koşulları sabitleri sabitler</div><div class="card-body">İki başlangıç koşulu y(x_0) ve y'(x_0), c_1 ve c_2 için iki doğrusal denklem verir. Tek bir yörünge çıkar.</div></div>
<div class="calc-card"><div class="card-title">Homojen olmayan = homojen + özel</div><div class="card-body">y'' + p y' + q y = r'nin genel çözümü y = y_h + y_p olup y_h homojen sürümü, y_p ise tam denklemin herhangi bir tek çözümüdür.</div></div>
</div>

<div class="l-note"><strong>Üstüste binme neden bu kadar özel:</strong> denklem doğrusal olmaktan çıktığı an çöker. Tek bir y kare terim eklendiğinde, iki çözümün toplamı artık çözüm olmaz. Doğrusal teorinin neden düzenli, doğrusal olmayan teorinin neden vahşi hissettirdiği de — ve her klasik mühendislik ders kitabının neden doğrusal kalmak için çok çalıştığı da — bu yüzdendir.</div>

<h2 class="lesson-title">2. Sabit Katsayılar ve Karakteristik Denklem</h2>

<div class="calc-highlight"><strong>Hile:</strong> katsayılar sabit olduğunda, homojen ODE'nin y = e^{lambda x} formunda çözümleri vardır. Bu tahmini yerine koyup, üstelliği bölerek atın; geriye lambda'da sıradan bir kuadratik denklem kalır. Üç şey olabilir — ve bunlar üç sönüm rejimidir.</div>

<p class="l-text">Dikkati <strong>sabit katsayılı homojen ODE'ye</strong> yöneltin:</p>

<div class="calc-formula"><div class="formula-label">SABİT KATSAYILI HOMOJEN ODE</div><div class="formula-main">$$y''(x) + b\\, y'(x) + c\\, y(x) = 0, \\qquad b, c \\in \\mathbb{R}$$</div><div class="formula-sub">b ve c yalnızca sayıdır. Bu, klasik mekaniğin ve devre teorisinin iş yapan denklemidir.</div></div>

<p class="l-text"><strong>Üstel ansatz.</strong> <code>y(x) = e^{\\lambda x}</code> formunda bir çözüm deneyin. O zaman <code>y'(x) = \\lambda e^{\\lambda x}</code> ve <code>y''(x) = \\lambda^{2} e^{\\lambda x}</code>. Yerine koyduğumuzda:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Tahmini yerine koyun</div><div class="step-detail">lambda^2 e^{lambda x} + b lambda e^{lambda x} + c e^{lambda x} = 0.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Üstelliği çarpan olarak ayırın</div><div class="step-detail">e^{lambda x} (lambda^2 + b lambda + c) = 0. Üstel asla sıfır değildir, dolayısıyla parantez yok olmalıdır.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Karakteristik denklemi okuyun</div><div class="step-detail">lambda^2 + b lambda + c = 0. Lambda cinsinden sıradan bir kuadratik. Çözün ve sistemin titreşebileceği her modun üstel oranlarına sahip olursunuz.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">KARAKTERİSTİK DENKLEM</div><div class="formula-main">$$\\lambda^{2} + b\\, \\lambda + c = 0 \\quad\\Longrightarrow\\quad \\lambda_{1,2} = \\frac{-b \\pm \\sqrt{b^{2} - 4c}}{2}$$</div><div class="formula-sub">Diskriminant Delta = b^2 - 4c, üç evrenden hangisinde olduğumuzu belirler.</div></div>

<p class="l-text"><code>\\Delta = b^{2} - 4 c</code> diskriminantının işareti niteliksel davranışı belirler. Her durumun kendi çözüm formülü vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durum 1: Delta &gt; 0 (iki farklı reel kök)</div><div class="card-body">lambda_1 ve lambda_2 reel ve eşit değildir. İki bağımsız çözüm e^{lambda_1 x} ve e^{lambda_2 x}. Genel çözüm: y(x) = c_1 e^{lambda_1 x} + c_2 e^{lambda_2 x}. Saf üstel davranış — salınım yok.</div></div>
<div class="calc-card"><div class="card-title">Durum 2: Delta = 0 (tekrarlanan reel kök)</div><div class="card-body">lambda_1 = lambda_2 = -b/2. Üstel e^{lambda x} bir çözümdür; ikincisi x e^{lambda x}'dir (yerine koyarak doğrulayabilirsiniz). Genel çözüm: y(x) = (c_1 + c_2 x) e^{lambda x}. Kritik durum — salınımla saf bozunma arasındaki sınırda tam oturur.</div></div>
<div class="calc-card"><div class="card-title">Durum 3: Delta &lt; 0 (karmaşık eşlenik kökler)</div><div class="card-body">lambda_{1,2} = alpha +/- i beta olup alpha = -b/2 ve beta = sqrt(4c - b^2)/2. Euler formülü kullanılarak reel genel çözüm y(x) = e^{alpha x} (c_1 cos(beta x) + c_2 sin(beta x)). Üstel zarf altında salınım.</div></div>
</div>

<div class="l-note"><strong>Bir zihinsel model, üç rejim:</strong> sistem doğal modları olarak hep üstelleri seçer. Bu üstellerin reel üsleri olduğunda hareket monotondur; sanal kısımları olduğunda salınır. Sanal kısmın boyu frekansı, reel kısmın boyu sönüm (veya büyüme) zarfını belirler.</div>

<div class="calc-example"><div class="example-label">KISA ISINMA: y'' - 3 y' + 2 y = 0 çözün</div><div class="example-body"><strong>Karakteristik denklem:</strong> lambda^2 - 3 lambda + 2 = 0.<br>Çarpanlara ayır: (lambda - 1)(lambda - 2) = 0, dolayısıyla lambda_1 = 1, lambda_2 = 2.<br>Diskriminant Delta = 9 - 8 = 1 &gt; 0, iki farklı reel kök.<br><br><strong>Genel çözüm:</strong> y(x) = c_1 e^{x} + c_2 e^{2 x}.<br>Her iki kök de pozitif, dolayısıyla bu sistem patlar — kararsız. Mühendisler buna sağ yarı düzlem konfigürasyonu der.</div></div>

<h2 class="lesson-title">3. Çözümlü Örnek 1: Yay-Kütle Sistemi (Sönümsüz)</h2>

<div class="calc-highlight"><strong>En temiz fiziksel örnek.</strong> k sertliğindeki bir yaydan m kütlesi sarkmaktadır. Denge konumundan x_0 mesafe aşağı çekip bırakın. Sürtünme yok, hava direnci yok, damper yok — ne yapar? m ve k tarafından tamamen belirlenen bir frekansla sonsuza dek salınır. Bu <em>basit harmonik harekettir</em>, her mühendisin öğrendiği ilk ve en önemli ikinci mertebe ODE.</div>

<p class="l-text">Kütleye uygulanan Newton'un ikinci yasası <code>m a = F_{yay}</code>'ı verir. Yay kuvveti yer değiştirmeyle orantılı olarak geri çeker (Hooke yasası): <code>F_{yay} = -k x</code>. <code>a = x''</code> ile:</p>

<div class="calc-formula"><div class="formula-label">SÖNÜMSÜZ YAY-KÜTLE ODE</div><div class="formula-main">$$m\\, x''(t) + k\\, x(t) = 0$$</div><div class="formula-sub">Sabit katsayılı ikinci mertebe doğrusal homojen bir ODE. b = 0 (sönüm yok). Bölme sonrası c = k/m.</div></div>

<p class="l-text">Standartlaştırmak için m'ye bölün: <code>x'' + (k/m) x = 0</code>. Karakteristik denklem</p>

<div class="calc-formula"><div class="formula-label">KARAKTERİSTİK DENKLEM</div><div class="formula-main">$$\\lambda^{2} + \\frac{k}{m} = 0 \\quad\\Longrightarrow\\quad \\lambda = \\pm i\\, \\sqrt{\\frac{k}{m}} = \\pm i\\, \\omega_{0}$$</div><div class="formula-sub">Tamamen sanal kökler. Doğal açısal frekansı omega_0 = sqrt(k/m) olarak tanımlayın.</div></div>

<p class="l-text">İki tamamen sanal kök — <code>\\alpha = 0</code> ve <code>\\beta = \\omega_{0}</code> ile durum 3. Genel reel çözüm</p>

<div class="calc-formula"><div class="formula-label">GENEL ÇÖZÜM (SÖNÜMSÜZ BHM)</div><div class="formula-main">$$x(t) = c_{1} \\cos(\\omega_{0} t) + c_{2} \\sin(\\omega_{0} t) = A \\cos(\\omega_{0} t + \\varphi)$$</div><div class="formula-sub">İki eşdeğer form. Genlik A = sqrt(c_1^2 + c_2^2). Faz varphi = arctan(-c_2 / c_1).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğal frekans omega_0</div><div class="card-body">omega_0 = sqrt(k/m) rad/s cinsinden. Daha sert yay -&gt; daha yüksek frekans. Daha ağır kütle -&gt; daha düşük frekans. Sistemin yalnızca fizik tarafından belirlenen kendi tercih ettiği bir salınım hızı vardır.</div></div>
<div class="calc-card"><div class="card-title">Periyot T</div><div class="card-body">T = 2 pi / omega_0 = 2 pi sqrt(m/k) saniye. Bir tam salınım için süre. Genlikten bağımsız (yalnızca küçük salınımlar).</div></div>
<div class="calc-card"><div class="card-title">Genlik A</div><div class="card-body">Dengeden maksimum yer değiştirme. Başlangıç koşullarıyla belirlenir: kütleyi ne kadar uzağa çektiniz ve ne kadar hızlı bıraktınız.</div></div>
<div class="calc-card"><div class="card-title">Faz varphi</div><div class="card-body">t = 0'da salınımın döngüsünün nerede olduğu. Maksimum yer değiştirmeden durağan bırakılırsa -&gt; varphi = 0 (saf kosinüs).</div></div>
</div>

<div class="calc-example"><div class="example-label">SAYISAL ÖRNEK</div><div class="example-body"><strong>m = 1 kg, k = 25 N/m, x(0) = 0.1 m, x'(0) = 0.</strong><br><br>omega_0 = sqrt(25/1) = 5 rad/s.<br>Periyot T = 2 pi / 5 = 1.257 s.<br>x(0) = 0.1 uygula: c_1 = 0.1.<br>x'(0) = 0 uygula: -c_1 omega_0 sin(0) + c_2 omega_0 cos(0) = 0, dolayısıyla c_2 = 0.<br><br><strong>Çözüm:</strong> x(t) = 0.1 cos(5 t) metre.<br>Kütle, +10 cm ile -10 cm arasında 1.257 saniye periyotla sonsuza dek salınır.</div></div>

<div class="l-note"><strong>Neden "sonsuza dek"?</strong> Çünkü b = 0 koyduk — sönüm yok, enerji kaybı yok. Gerçekte her gerçek yayın biraz sürtünmesi, her gerçek devrenin biraz direnci vardır. Bölüm 4 bu sönümü geri koyar ve fiziği tamamen değiştirir.</div>

<h2 class="lesson-title">4. Çözümlü Örnek 2: Sönümlü Yay-Kütle — Üç Rejim</h2>

<div class="calc-highlight"><strong>Bu dersin pedagojik merkez taşı.</strong> Yaya paralel bir damper (yağ dolu bir silindirin içinde bir piston) ekleyin. Sönüm kuvveti hıza karşı koyar: F_sönüm = -c x'. ODE bir birinci türev terimi kazanır, karakteristik denklemin diskriminantı artık pozitif, sıfır veya negatif olabilir ve tamamen farklı üç hareket ortaya çıkar. Her makine mühendisi üçünü de görür görmez tanımalıdır.</div>

<p class="l-text">Sönümle birlikte Newton yasası şöyle olur</p>

<div class="calc-formula"><div class="formula-label">SÖNÜMLÜ YAY-KÜTLE ODE</div><div class="formula-main">$$m\\, x''(t) + c\\, x'(t) + k\\, x(t) = 0$$</div><div class="formula-sub">c, viskoz sönüm katsayısıdır (birim: N s / m). Herhangi gerçekçi bir mekanik sistemde üç katsayı da pozitiftir.</div></div>

<p class="l-text">m'ye bölün ve denklemi <strong>standart ikinci mertebe forma</strong> getirin:</p>

<div class="calc-formula"><div class="formula-label">STANDART FORM</div><div class="formula-main">$$x''(t) + 2\\, \\zeta\\, \\omega_{0}\\, x'(t) + \\omega_{0}^{2}\\, x(t) = 0$$</div><div class="formula-sub">Doğal frekans omega_0 = sqrt(k/m). Sönüm oranı zeta = c / (2 sqrt(m k)). zeta boyutsuzdur.</div></div>

<p class="l-text">Karakteristik denklem <code>\\lambda^{2} + 2 \\zeta \\omega_{0} \\lambda + \\omega_{0}^{2} = 0</code>'dır, vererek</p>

<div class="calc-formula"><div class="formula-label">KARAKTERİSTİK DENKLEMİN KÖKLERİ</div><div class="formula-main">$$\\lambda_{1,2} = -\\zeta\\, \\omega_{0} \\pm \\omega_{0}\\, \\sqrt{\\zeta^{2} - 1}$$</div><div class="formula-sub">Karekök rejimi belirler. zeta^2 - 1 &gt; 0, = 0, &lt; 0 aşırı sönümlü, kritik sönümlü, zayıf sönümlüyü verir.</div></div>

<p class="l-text">Üç rejim, üç çözüm formülü, üç resim:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşırı sönümlü (zeta &gt; 1)</div><div class="card-body">İki farklı negatif reel kök. lambda_{1,2} = -zeta omega_0 +/- omega_0 sqrt(zeta^2 - 1). Çözüm x(t) = c_1 e^{lambda_1 t} + c_2 e^{lambda_2 t}. Salınımsız yavaş üstel denge dönüşü. Resim: pekmez içinde bir sineklik kapısını itmek — sallanmadan kapanır.</div></div>
<div class="calc-card"><div class="card-title">Kritik sönümlü (zeta = 1)</div><div class="card-body">Tekrarlanan reel kök lambda = -omega_0. Çözüm x(t) = (c_1 + c_2 t) e^{-omega_0 t}. <strong>Aşımsız mümkün olan en hızlı denge dönüşü.</strong> Resim: iyi ayarlanmış bir araç süspansiyonu — keskin tümsek, anında oturma, sıçrama yok.</div></div>
<div class="calc-card"><div class="card-title">Zayıf sönümlü (zeta &lt; 1)</div><div class="card-body">Karmaşık eşlenik kökler lambda = -zeta omega_0 +/- i omega_d olup sönümlü frekans omega_d = omega_0 sqrt(1 - zeta^2). Çözüm x(t) = e^{-zeta omega_0 t} (c_1 cos(omega_d t) + c_2 sin(omega_d t)). Sönen salınım. Resim: bir akort çatalı — net çınlar, yavaşça söner.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-damping-regimes-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> omega_0 = 1 rad/s, x(0) = 1, x'(0) = 0'dan bırakılan birim genlikli yay-kütle sistemi için üç sönüm rejimi. Zayıf sönümlü eğri (zeta = 0.2) aşar ve çınlar. Kritik sönümlü eğri (zeta = 1) hiç aşmadan mümkün olan en hızlı şekilde sıfıra döner. Aşırı sönümlü eğriler (zeta = 2 ve zeta = 4) sıfıra sürünür — zeta ne kadar büyükse o kadar yavaş. <em>Aşım kabul edilemez olduğunda kritik sönüm, mühendisliğin tatlı noktasıdır.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=600;i++)t.push(i/40);
function resp(z){
  var wn=1;var out=[];
  for(var i=0;i<t.length;i++){
    var x=t[i],y;
    if(Math.abs(z-1)<1e-6){y=(1+wn*x)*Math.exp(-wn*x);}
    else if(z<1){var wd=wn*Math.sqrt(1-z*z);y=Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z*wn/wd)*Math.sin(wd*x));}
    else{var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;var c1=(0-r2)/(r1-r2);var c2=1-c1;y=c1*Math.exp(r1*x)+c2*Math.exp(r2*x);}
    out.push(y);
  }
  return out;
}
var d1={x:t,y:resp(0.2),mode:'lines',name:'zayıf sönüm (zeta=0.2)',line:{color:'#f87171',width:2.6}};
var d2={x:t,y:resp(1.0),mode:'lines',name:'kritik sönüm (zeta=1)',line:{color:'#10b981',width:2.6}};
var d3={x:t,y:resp(2.0),mode:'lines',name:'aşırı sönüm (zeta=2)',line:{color:'#3b82f6',width:2.6}};
var d4={x:t,y:resp(4.0),mode:'lines',name:'aşırı sönüm (zeta=4)',line:{color:'#f59e0b',width:2.6,dash:'dot'}};
var zero={x:[0,15],y:[0,0],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,15]},yaxis:{title:'x(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.6,1.1]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-damping-regimes-tr',[zero,d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">SAYISAL ÖRNEK — BİR AMORTİSÖR</div><div class="example-body"><strong>m = 2 kg, k = 200 N/m, c = ?</strong> Kritik sönüm için tasarlayın.<br><br>omega_0 = sqrt(200/2) = 10 rad/s.<br>Kritik: zeta = 1 demek c = 2 sqrt(m k) = 2 sqrt(2 * 200) = 2 * 20 = <strong>40 N s / m</strong>.<br>c = 20 seçin -&gt; zeta = 0.5 -&gt; zayıf sönümlü (araç tümsekten sonra zıplıyor — kötü).<br>c = 80 seçin -&gt; zeta = 2 -&gt; aşırı sönümlü (araç yavaş oturuyor — engebeli yollarda da kötü).<br>c = 40 seçin -&gt; zeta = 1 -&gt; kritik sönüm (yumuşak sürüş — Goldilocks).</div></div>

<div class="l-note"><strong>Çıkarım:</strong> sönüm oranı zeta, geçici davranış hakkında her şeyi söyleyen tek sayıdır. zeta = 0 saf salınım, zeta = 1 sınır, zeta &gt; 1 hantal dönüştür. Mühendislik tasarımı çoğunlukla zeta'yı olması gereken yere koymakla ilgilidir. Araç süspansiyonları sürüş konforu ile yol tutuş dengesi için yaklaşık zeta = 0.7'yi hedefler; Butterworth tepkili analog filtreler de kutuplarını yaklaşık zeta = 1/sqrt(2) yaklaşık 0.707'ye yerleştirir.</div>

<h2 class="lesson-title">5. Çözümlü Örnek 3: RLC Devresi — Farklı Bir Takımda Aynı Denklem</h2>

<div class="calc-highlight"><strong>Derin kazanç:</strong> bir seri RLC devresindeki yükü yöneten denklem, sönümlü yay-kütle denklemiyle <em>yapısal olarak özdeştir</em>. Voltaj kaynağı uygulanan kuvvet, bobin kütle, direnç sönüm, ters kapasitans yay sabiti demektir. Birini anladığınızda diğerini de anlarsınız. Bu, lisans mühendisliğindeki en güzel <em>matematiksel benzeşim</em> örneğidir.</div>

<p class="l-text"><code>V(t)</code> voltaj kaynağı tarafından sürülen bir seri RLC devresi: R direnci, L bobini, C kondansatörü hepsi seri, döngüde i(t) akımı akıyor. Kondansatör üzerindeki yükü <code>q(t)</code> olarak gösterelim (yani <code>i = q'</code>). Kirchhoff'un voltaj yasası döngüdeki düşüşleri toplar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bobin</div><div class="card-body">V_L = L di/dt = L q''. Voltaj akımın zaman türevine orantılı.</div></div>
<div class="calc-card"><div class="card-title">Direnç</div><div class="card-body">V_R = R i = R q'. Voltaj akıma orantılı (Ohm yasası).</div></div>
<div class="calc-card"><div class="card-title">Kondansatör</div><div class="card-body">V_C = q / C. Voltaj depolanmış yüke orantılı.</div></div>
<div class="calc-card"><div class="card-title">Kaynak</div><div class="card-body">V(t). Uygulanan voltaj, devrenin "zorlayıcısı".</div></div>
</div>

<div class="calc-formula"><div class="formula-label">SERİ RLC ODE</div><div class="formula-main">$$L\\, q''(t) + R\\, q'(t) + \\frac{1}{C}\\, q(t) = V(t)$$</div><div class="formula-sub">q(t)'de ikinci mertebe doğrusal bir ODE. Sabit katsayılar L, R, 1/C. Zorlama fonksiyonu V(t).</div></div>

<p class="l-text">Sönümlü yay-kütle denklemi <code>m x'' + c x' + k x = F(t)</code> ile terim terim karşılaştırın. Eşleme tamdır:</p>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.18);border-radius:8px;overflow:hidden">
<thead><tr style="background:rgba(59,130,246,0.12)"><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">MEKANİK (yay-kütle-sönümleyici)</th><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">ELEKTRİK (seri RLC)</th><th style="padding:0.7rem 1rem;text-align:left;color:#3b82f6;font-size:0.8rem;letter-spacing:0.06em">ROL</th></tr></thead>
<tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Yer değiştirme x(t)</td><td style="padding:0.6rem 1rem">Yük q(t)</td><td style="padding:0.6rem 1rem">Durum değişkeni</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Hız x'(t)</td><td style="padding:0.6rem 1rem">Akım i(t) = q'(t)</td><td style="padding:0.6rem 1rem">Değişim hızı</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Kütle m</td><td style="padding:0.6rem 1rem">İndüktans L</td><td style="padding:0.6rem 1rem">Eylemsizlik</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Sönüm c</td><td style="padding:0.6rem 1rem">Direnç R</td><td style="padding:0.6rem 1rem">Enerji yitimi</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Sertlik k</td><td style="padding:0.6rem 1rem">Ters kapasitans 1/C</td><td style="padding:0.6rem 1rem">Geri çağırıcı kuvvet</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">Dış kuvvet F(t)</td><td style="padding:0.6rem 1rem">Kaynak voltajı V(t)</td><td style="padding:0.6rem 1rem">Sürücü</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">omega_0 = sqrt(k/m)</td><td style="padding:0.6rem 1rem">omega_0 = 1/sqrt(L C)</td><td style="padding:0.6rem 1rem">Doğal frekans</td></tr>
<tr style="border-top:1px solid rgba(255,255,255,0.05)"><td style="padding:0.6rem 1rem">zeta = c/(2 sqrt(m k))</td><td style="padding:0.6rem 1rem">zeta = (R/2) sqrt(C/L)</td><td style="padding:0.6rem 1rem">Sönüm oranı</td></tr>
</tbody></table>

<div class="l-note"><strong>Bir ODE, iki dil.</strong> Bir kütle-yay-sönümleyici çözebiliyorsanız, bir RLC devresini de çözebilirsiniz — ve tersi. Her grafik, her formül, her rejim sınıflandırması değişmeden taşınır. Kontrol mühendisleri, sinyal işleme mühendisleri ve makine mühendislerinin birbirlerinin makalelerini akıcı şekilde okumasının nedeni budur.</div>

<p class="l-text">Devrede üç rejim, mekanik olanların tam analogları:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşırı sönümlü (R büyük, zeta &gt; 1)</div><div class="card-body">Kondansatör direnç üzerinden monoton olarak boşalır. Çınlama yok. R^2 &gt; 4 L/C.</div></div>
<div class="calc-card"><div class="card-title">Kritik sönümlü (zeta = 1)</div><div class="card-body">R = 2 sqrt(L/C). En hızlı salınımsız boşalma.</div></div>
<div class="calc-card"><div class="card-title">Zayıf sönümlü (R küçük, zeta &lt; 1)</div><div class="card-body">Sonlandırılmamış iletim hatlarından yansıyan dijital sinyallerde gördüğünüz ünlü "çınlama". R^2 &lt; 4 L/C. Enerji dağıtılırken L ile C arasında gidip gelir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-rlc-decay-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> başlangıçta 1 V'ye şarj edilmiş ve t = 0'da kısa devre yapılmış (t &gt; 0 için V(t) = 0) bir seri RLC devresinde kondansatör voltajı V_C(t) = q(t)/C. L = 1 H, C = 1 F, zeta'yı 0.15 (ağır çınlama), 1.0 (kritik) ve 3.0 (aşırı sönümlü) yapan üç direnç değeri. Mekanik kütle-yay-sönümleyici için gördüğünüz grafikle aynı — benzeşimin bir metafor olmadığını kanıtlıyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=600;i++)t.push(i/40);
function resp(z){
  var wn=1;var out=[];
  for(var i=0;i<t.length;i++){
    var x=t[i],y;
    if(Math.abs(z-1)<1e-6){y=(1+wn*x)*Math.exp(-wn*x);}
    else if(z<1){var wd=wn*Math.sqrt(1-z*z);y=Math.exp(-z*wn*x)*(Math.cos(wd*x)+(z*wn/wd)*Math.sin(wd*x));}
    else{var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;var c1=(0-r2)/(r1-r2);var c2=1-c1;y=c1*Math.exp(r1*x)+c2*Math.exp(r2*x);}
    out.push(y);
  }
  return out;
}
var d1={x:t,y:resp(0.15),mode:'lines',name:'zeta=0.15 (çınlama)',line:{color:'#f87171',width:2.6}};
var d2={x:t,y:resp(1.0),mode:'lines',name:'zeta=1 (kritik)',line:{color:'#10b981',width:2.6}};
var d3={x:t,y:resp(3.0),mode:'lines',name:'zeta=3 (aşırı sönüm)',line:{color:'#3b82f6',width:2.6}};
var zero={x:[0,15],y:[0,0],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,15]},yaxis:{title:'V_C(t) (V)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.6,1.1]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-rlc-decay-tr',[zero,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ BİR RLC TASARIMI</div><div class="example-body"><strong>L = 10 mH, C = 100 nF. Hangi R kritik sönüm verir?</strong><br><br>R_krit = 2 sqrt(L/C) = 2 sqrt(0.01 / 1e-7) = 2 sqrt(10^5) = 2 * 316 = <strong>632 ohm</strong>.<br>omega_0 = 1 / sqrt(L C) = 1 / sqrt(0.01 * 1e-7) = 1 / sqrt(1e-9) = <strong>31623 rad/s</strong> (yaklaşık 5 kHz).<br><br>R = 100 ohm -&gt; zeta = 0.16 -&gt; 5 kHz'de zayıf sönümlü çınlama (bir tank devresi osilatörünün doğal modu).<br>R = 632 ohm -&gt; zeta = 1 -&gt; kritik (aşımsız temiz basamak cevabı).<br>R = 2000 ohm -&gt; zeta = 3.2 -&gt; aşırı sönümlü (yavaş zarf izleyici).</div></div>

<h2 class="lesson-title">6. Homojen Olmayan Denklemler — Belirsiz Katsayılar</h2>

<div class="calc-highlight"><strong>Tarif:</strong> homojen olmayan denklem için, genel çözüm y = y_h + y_p'dir. Homojen kısım y_h, önceki gibi karakteristik denklemle çözülür. Özel kısım y_p için, zorlama r(x) güzel bir "temel" fonksiyon (polinom, üstel, sinüs, kosinüs ya da çarpım) olduğunda, aynı formdan bilinmeyen katsayılarla bir y_p <em>tahmin edin</em>, ODE'ye yerine koyun ve katsayıları eşleyerek bunları çözün.</div>

<p class="l-text">Yöntem işe yarar çünkü bu temel fonksiyonların herhangi birini türetmek aynı aile içinde kalır — e^{ax}'in türevleri hâlâ e^{ax}'dir, sin(omega x) ve cos(omega x)'in türevleri yalnızca aralarında değişirler, polinomların türevleri daha düşük dereceli polinomlardır. Dolayısıyla, y_p bu formlardan biri olduğunda, ODE'nin sağ tarafı aynı aileye iner — ve bizim sadece eşleştirmemiz gerekir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">r(x) = e^{a x}</div><div class="card-body">y_p = A e^{a x} tahmin edin. Tek bir bilinmeyen katsayı A. Yerine koyun, e^{ax} çarpan olarak ayrılır, A için çözün. Özel durum: a, karakteristik denklemin bir köküyle çakışırsa, tahmini x ile çarpın.</div></div>
<div class="calc-card"><div class="card-title">r(x) = sin(beta x) ya da cos(beta x)</div><div class="card-body">y_p = A sin(beta x) + B cos(beta x) tahmin edin. İki bilinmeyen. Yerine koyun, sinüs ve kosinüs katsayılarını ayırın, 2x2 doğrusal sistemi çözün.</div></div>
<div class="calc-card"><div class="card-title">r(x) = n. dereceden polinom</div><div class="card-body">y_p = a_n x^n + ... + a_0 (aynı derece) tahmin edin. Yerine koyun, x'in kuvvetlerini eşleyin, katsayıları çözün.</div></div>
<div class="calc-card"><div class="card-title">r(x) = çarpım (örn. e^{ax} sin(beta x))</div><div class="card-body">Uygun formların çarpımını tahmin edin: y_p = e^{ax}(A sin(beta x) + B cos(beta x)). Aynı eşleme prosedürü.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — y'' - 3 y' + 2 y = e^{3 x} çözün</div><div class="example-body"><strong>Adım 1: homojen çözüm.</strong> Karakteristik denklem lambda^2 - 3 lambda + 2 = (lambda - 1)(lambda - 2) = 0, dolayısıyla lambda = 1, 2. y_h = c_1 e^{x} + c_2 e^{2 x}.<br><br><strong>Adım 2: özel tahmin.</strong> Zorlama e^{3 x}; 3 karakteristik denklemin bir kökü DEĞİL, dolayısıyla y_p = A e^{3 x} deneyin.<br>Sonra y_p' = 3 A e^{3 x}, y_p'' = 9 A e^{3 x}.<br>Yerine koyun: 9 A e^{3x} - 3(3 A e^{3x}) + 2(A e^{3x}) = e^{3x}<br>Sadeleştirin: (9 - 9 + 2) A e^{3 x} = e^{3 x}<br>Yani 2 A = 1, dolayısıyla A = 1/2.<br><br><strong>Özel çözüm:</strong> y_p = (1/2) e^{3 x}.<br><br><strong>Genel çözüm:</strong> y(x) = c_1 e^{x} + c_2 e^{2 x} + (1/2) e^{3 x}.</div></div>

<div class="l-note"><strong>"Rezonans" tuzağı.</strong> Zorlama üssü ya da frekansı karakteristik denklemin bir köküyle çakışırsa, temel tahmin başarısız olur (0 = e^{ax} gibi bir saçmalık elde edersiniz). Çözüm <em>deneme y_p'yi x ile çarpmaktır</em> (ya da tekrarlanan bir kök için x^2 ile). Fiziksel olarak bu, sistemi tam doğal frekansında sürmeye karşılık gelir; burada cevap zamanla doğrusal olarak büyür — saf rezonans.</div>

<div class="calc-example"><div class="example-label">REZONANS DURUMU — y'' - 3 y' + 2 y = e^{x} çözün</div><div class="example-body">Şimdi zorlama üssü 1, lambda = 1 köküyle çakışır. Naif tahmin y_p = A e^{x} (1 - 3 + 2) A e^{x} = 0 verir, e^{x} değil. x ile çarp: <strong>y_p = A x e^{x}</strong>.<br><br>Sonra y_p' = A e^{x}(1 + x), y_p'' = A e^{x}(2 + x).<br>Yerine koy: A e^{x}(2 + x) - 3 A e^{x}(1 + x) + 2 A x e^{x}<br>= A e^{x}[(2 + x) - (3 + 3x) + 2x] = A e^{x}[-1] = -A e^{x}.<br>e^{x}'e eşitle: -A = 1, dolayısıyla A = -1.<br><br><strong>Özel çözüm:</strong> y_p = -x e^{x}. <em>Üstellinin önünde doğrusal büyüme — rezonansın imzası.</em></div></div>

<h2 class="lesson-title">7. Parametrelerin Değişimi (Kısaca)</h2>

<div class="calc-highlight"><strong>Sağ taraf çirkin olduğunda</strong> — diyelim ki r(x) = tan(x) ya da 1/x ya da bazı tuhaf parçalı fonksiyon — belirsiz katsayılar başlangıç noktasına dair hiçbir tahmin vermez. Tamamen genel teknik <em>parametrelerin değişimidir</em>. Prensipte daima işe yarar; bedel, temel olabilen ya da olmayan bir çift integraldir.</div>

<p class="l-text"><code>y_{1}(x)</code> ve <code>y_{2}(x)</code> iki homojen çözümünü zaten bulduğunuzu varsayın. Parametrelerin değişimi özel çözümü şöyle yazar</p>

<div class="calc-formula"><div class="formula-label">PARAMETRELERİN DEĞİŞİMİ FORMÜLÜ</div><div class="formula-main">$$y_{p}(x) = -y_{1}(x) \\int \\frac{y_{2}(x)\\, r(x)}{W(x)}\\, dx + y_{2}(x) \\int \\frac{y_{1}(x)\\, r(x)}{W(x)}\\, dx$$</div><div class="formula-sub">W(x) = y_1 y_2' - y_2 y_1' Wronskian'dır. y_1 ile y_2 doğrusal bağımsız olduğunda sıfırdan farklıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wronskian W(x)</div><div class="card-body">W = y_1 y_2' - y_2 y_1'. Doğrusal bağımsızlığı ölçen bir determinant. Sabit katsayılı ODE'ler için W kendisi bir üsteldir — hesaplaması kolaydır.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman başvurulur</div><div class="card-body">Sağ taraf bir polinom, üstel, sinüs, kosinüs ya da bunların basit bir çarpımı değil. Belirsiz katsayıların başlangıç noktasına dair belirgin bir tahmini yok.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kaçınılır</div><div class="card-body">Belirsiz katsayılar işe yaradığında — neredeyse her zaman daha az cebir içerir. Parametrelerin değişimi ağır toptur; serçe problemleri için kullanmayın.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — y'' + y = sec(x) çözün (belirsiz katsayılarla imkânsız)</div><div class="example-body"><strong>Homojen çözümler:</strong> y_1 = cos(x), y_2 = sin(x). Wronskian W = cos(x) cos(x) - sin(x)(-sin(x)) = 1.<br><br><strong>Formülü uygula</strong>, r(x) = sec(x) = 1/cos(x) ve W = 1 ile:<br>y_p = -cos(x) integral [sin(x)/cos(x)] dx + sin(x) integral [cos(x)/cos(x)] dx<br>= -cos(x) * (-ln|cos(x)|) + sin(x) * x<br>= cos(x) ln|cos(x)| + x sin(x).<br><br><strong>Genel çözüm:</strong> y(x) = c_1 cos(x) + c_2 sin(x) + cos(x) ln|cos(x)| + x sin(x). Gerçekten önemsiz olmayan bir karışım — hiçbir akıllı tahmin bunu üretemezdi.</div></div>

<h2 class="lesson-title">8. Zorlanmış Salınımlar ve Rezonans — Neden Köprüler Çöker</h2>

<div class="calc-highlight"><strong>Sönümlü yay-kütle denklemini alın ve omega frekansında sinüsoid bir kuvvetle sürün.</strong> Geçici çözüm sönerek kaybolur. Geriye kalan, omega frekansında da bir sinüsoid olan <em>kalıcı durum</em> cevabıdır, ama genliği omega'nın sistemin doğal frekansı omega_0'a ne kadar yakın olduğuna sert şekilde bağlıdır. Düşük sönümle doğru frekansa vurun ve genlik devasa olur. İşte bu rezonanstır — ve mühendislerin yapılarda sönüm konusunda takıntılı olmasının nedenidir.</div>

<div class="calc-formula"><div class="formula-label">ZORLANMIŞ SÖNÜMLÜ OSİLATÖR</div><div class="formula-main">$$m\\, x''(t) + c\\, x'(t) + k\\, x(t) = F_{0}\\, \\cos(\\omega\\, t)$$</div><div class="formula-sub">omega açısal frekansında ve F_0 genliğinde sinüsoid zorlama. Doğal frekans omega_0 = sqrt(k/m); sönüm oranı zeta = c/(2 sqrt(m k)).</div></div>

<p class="l-text"><strong>Kalıcı durum çözümü.</strong> Belirlenecek A genliği ve phi faz gecikmesi ile <code>x_{p}(t) = A \\cos(\\omega t - \\phi)</code> deneyin. Yerine koyun, kosinüs ve sinüs katsayılarını eşleyin ve biraz cebirden sonra:</p>

<div class="calc-formula"><div class="formula-label">KALICI DURUM GENLİĞİ</div><div class="formula-main">$$A(\\omega) = \\frac{F_{0}/m}{\\sqrt{(\\omega_{0}^{2} - \\omega^{2})^{2} + (2\\, \\zeta\\, \\omega_{0}\\, \\omega)^{2}}}$$</div><div class="formula-sub">Sürme frekansı omega'nın bir fonksiyonu olarak genlik. Paydadaki parantez ne kadar büyükse, cevap o kadar küçüktür.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düşük frekans (omega &lt;&lt; omega_0)</div><div class="card-body">Payda omega_0^2 tarafından domine edilir. A, F_0/(m omega_0^2) = F_0/k'ya yaklaşır — statik sapma. Kütle, kuvvetle yarı-statik olarak hareket eder.</div></div>
<div class="calc-card"><div class="card-title">Rezonans (omega yaklaşık omega_0)</div><div class="card-body">(omega_0^2 - omega^2) sıfıra gider. Paydada yalnızca sönüm terimi hayatta kalır. A yaklaşık F_0/(2 zeta m omega_0^2)'de zirveye ulaşır. <strong>Küçük zeta için bu tepe devasadır.</strong></div></div>
<div class="calc-card"><div class="card-title">Yüksek frekans (omega &gt;&gt; omega_0)</div><div class="card-body">Payda omega^4 tarafından domine edilir. A, 1/omega^2 olarak düşer. Kütle hızlı zorlamaya yetişemez — eylemsizliği kazanır.</div></div>
</div>

<p class="l-text"><strong>Rezonans tepesi.</strong> Genlik <code>\\omega_{r} = \\omega_{0} \\sqrt{1 - 2 \\zeta^{2}}</code>'de maksimize olur (omega_0'ın biraz altında), ve tepe yüksekliği küçük zeta için yaklaşık <code>F_{0}/(2 \\zeta k)</code>'dır. zeta -&gt; 0 olarak, tepe yüksekliği sonsuza patlar — sistem, sürücünün enerjisini dağıtabileceğinden daha hızlı emer.</p>

<div class="calc-graph"><div id="plot-l2-resonance-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> beş sönüm oranı için omega/omega_0'ın fonksiyonu olarak normalize rezonans eğrisi A(omega) * k / F_0. Yatay eksen, doğal frekans biriminde sürme frekansıdır; tepe düşük sönüm için omega/omega_0 = 1 yakınında oturur. zeta = 0.05 statik sapmanın yaklaşık 10 katı keskin bir tepe verir. zeta = 0.7 neredeyse hiç tepe yoktur — mühendislik "düz" cevabıdır. zeta = 1 ve daha yüksek hiç tepe göstermez. <em>Bu tek resim, neden asma köprülerin ayarlı kütle damperleri olduğunu ve neden çamaşır makinenizin belirli bir sıkma hızında en kötü titrediğini açıklar.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r=[];for(var i=1;i<=400;i++)r.push(i/100);
function amp(z){var out=[];for(var i=0;i<r.length;i++){var u=r[i];var den=Math.sqrt(Math.pow(1-u*u,2)+Math.pow(2*z*u,2));out.push(1/den);}return out;}
var d1={x:r,y:amp(0.05),mode:'lines',name:'zeta=0.05',line:{color:'#f87171',width:2.6}};
var d2={x:r,y:amp(0.15),mode:'lines',name:'zeta=0.15',line:{color:'#f59e0b',width:2.6}};
var d3={x:r,y:amp(0.3),mode:'lines',name:'zeta=0.3',line:{color:'#10b981',width:2.6}};
var d4={x:r,y:amp(0.7),mode:'lines',name:'zeta=0.7',line:{color:'#3b82f6',width:2.6}};
var d5={x:r,y:amp(1.5),mode:'lines',name:'zeta=1.5',line:{color:'#a78bfa',width:2.6,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'omega / omega_0',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,3]},yaxis:{title:'normalize genlik A k / F_0',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,11]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-resonance-tr',[d1,d2,d3,d4,d5],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Tacoma Narrows Köprüsü (1940).</strong> Ünlü bir asma köprünün orta kuvvetli bir rüzgârda kendini büküp parçalama görüntüsü, zayıf sönümlü ikinci mertebe bir sistemin doğal burulma frekansı yakınında aerodinamik zorlama ile karşılaşmasının ders kitabı örneğidir. Köprünün o modda neredeyse hiç sönümü yoktu; rüzgâr onu tam yanlış frekansta sürdü; genlik, tabliye başarısız olana dek büyüdü. Modern uzun açıklıklı köprülerin hepsi <em>ayarlı kütle damperleri</em> taşır — tehlikeli rezonans frekanslarında enerji emecek şekilde tasarlanmış yaylar üzerindeki büyük ağırlıklar. Londra Millennium Köprüsü, yayaların adımları onu istemeden lateral doğal frekanslarından birinde sürdüğünde, ünlü şekilde damperler eklemek zorunda kaldı.</div>

<h2 class="lesson-title">9. Korunumlu Sistemler için Enerji Yöntemleri</h2>

<div class="calc-highlight"><strong>Sönüm olmadığında enerji korunur.</strong> Sistemin kinetik enerjisi artı potansiyel enerjisi zamanda sabittir. Bu tek olgu hareketin bir <em>birinci integralini</em> verir — bir türev derecesi kaldırılır, ikinci mertebe ODE birinci mertebeye çöker ve yörünge yalnızca başlangıç koşullarıyla belirlenir.</div>

<p class="l-text">Sönümsüz yay-kütle sistemi için enerjiler</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kinetik enerji</div><div class="card-body">T = (1/2) m v^2 = (1/2) m (x')^2. Kütlenin hareketinde depolanan enerji.</div></div>
<div class="calc-card"><div class="card-title">Potansiyel enerji</div><div class="card-body">U = (1/2) k x^2. Gerilmiş ya da sıkıştırılmış yayda depolanan enerji.</div></div>
<div class="calc-card"><div class="card-title">Toplam enerji</div><div class="card-body">E = T + U = (1/2) m (x')^2 + (1/2) k x^2 = sabit. Sönümsüz sistem için zamandan bağımsız.</div></div>
</div>

<p class="l-text">E'yi t'ye göre türetin, gerçekten sabit olduğunu doğrulamak için:</p>

<div class="calc-formula"><div class="formula-label">ENERJİ KORUNUMU KONTROLÜ</div><div class="formula-main">$$\\frac{dE}{dt} = m\\, x'\\, x'' + k\\, x\\, x' = x'\\, (m\\, x'' + k\\, x) = x' \\cdot 0 = 0$$</div><div class="formula-sub">Parantez sönümsüz ODE ile yok olur. Dolayısıyla E her yörünge boyunca sabittir.</div></div>

<p class="l-text">Basit harmonik osilatör <code>x(t) = A \\cos(\\omega_{0} t)</code> için, kinetik ve potansiyel enerjinin faz dışı salındığını — her biri diğeri sıfır olduğunda zirveye ulaştığını — doğrudan doğrulayabilirsiniz, oysa toplamları <code>(1/2) k A^{2}</code>'de yerinde kalır.</p>

<div class="calc-graph"><div id="plot-l2-energy-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> m = 1, k = 1, A = 1, omega_0 = 1 olan sönümsüz yay-kütle sistemi için kinetik enerji T(t), potansiyel enerji U(t) ve toplam enerji E(t). T ve U her biri 2 omega_0 açısal frekansında (konum frekansının iki katı, çünkü karesini almak spektrumu kaydırır) 0 ile 0.5 arasında salınır. Toplamları E, 0.5'te düzdür — enerji iki rezervuar arasında değiş tokuş edilir ama asla kaybolmaz. <em>Sönüm ekleyin ve E sönmeye başlar; bu sönüm hızı tam olarak 2 zeta omega_0'dır.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/20);
var KE=[],PE=[],TE=[];
for(var i=0;i<t.length;i++){var x=Math.cos(t[i]);var v=-Math.sin(t[i]);var ke=0.5*v*v;var pe=0.5*x*x;KE.push(ke);PE.push(pe);TE.push(ke+pe);}
var d1={x:t,y:KE,mode:'lines',name:'kinetik T(t)',line:{color:'#3b82f6',width:2.4}};
var d2={x:t,y:PE,mode:'lines',name:'potansiyel U(t)',line:{color:'#f87171',width:2.4}};
var d3={x:t,y:TE,mode:'lines',name:'toplam E(t)',line:{color:'#10b981',width:3,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,20]},yaxis:{title:'enerji (J)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,0.65]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-energy-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h3 style="color:#3b82f6;margin-top:1.4rem">Faz portresi: konuma karşı hız</h3>

<p class="l-text">Mühendislerin sevdiği ikinci bir görselleştirme: hızı <code>v = x'</code> dikey eksene, konumu <code>x</code> yatay eksene koyarak çizin. Sönümsüz osilatör için yörünge kapalı bir elipstir (çünkü enerji sabittir — ve enerji formülü x ile v'de bir elips denklemidir). Zayıf sönümlü bir osilatör için yörünge içeri spiralleyen bir helistir (enerji söner). Aşırı sönümlü bir sistem için yörünge dönmeden doğrudan başlangıca düşer.</p>

<div class="calc-graph"><div id="plot-l2-phase-under-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> omega_0 = 1, zeta = 0.1 ile x(0) = 1, v(0) = 0'dan bırakılan zayıf sönümlü yay-kütle sisteminin faz portresi (x, v). Yörünge içeri spirallenir — her döngü salınımın bir periyodudur ve yarıçap her döngüde e^{-zeta omega_0 T} faktörü kadar küçülür. Başlangıç, kararlı bir spiral çekicidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=2000;i++)t.push(i/40);
var x=[],v=[];var z=0.1,wn=1;var wd=wn*Math.sqrt(1-z*z);
for(var i=0;i<t.length;i++){var ti=t[i];var env=Math.exp(-z*wn*ti);var c=Math.cos(wd*ti),s=Math.sin(wd*ti);var xi=env*(c+(z*wn/wd)*s);var vi=env*(-wd*s+(z*wn/wd)*(wd*c)-z*wn*(c+(z*wn/wd)*s));x.push(xi);v.push(vi);}
var d={x:x,y:v,mode:'lines',name:'yörünge',line:{color:'#3b82f6',width:1.6}};
var start={x:[x[0]],y:[v[0]],mode:'markers',name:'başlangıç',marker:{size:10,color:'#f59e0b'}};
var ori={x:[0],y:[0],mode:'markers',name:'başlangıç (çekici)',marker:{size:12,color:'#f87171',symbol:'x',line:{width:3}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'konum x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.2,1.2]},yaxis:{title:'hız v',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.2,1.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-phase-under-tr',[d,start,ori],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l2-phase-over-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> x(0) = 1, v(0) = 0'dan bırakılan aşırı sönümlü bir sistemin (omega_0 = 1, zeta = 2.5) faz portresi. Yörünge hiç dönmeden başlangıca düşer — sistem salınmak için fazla hantaldır. Başlangıç, kararlı bir düğüm çekicidir. Yukarıdaki zayıf sönümlü spiral ile karşılaştırın: aynı denklem, farklı sönüm oranı, niteliksel olarak farklı geometri.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=400;i++)t.push(i/20);
var x=[],v=[];var z=2.5,wn=1;var s=Math.sqrt(z*z-1);var r1=-z*wn+wn*s;var r2=-z*wn-wn*s;
var x0=1,v0=0;var c1=(v0-r2*x0)/(r1-r2);var c2=x0-c1;
for(var i=0;i<t.length;i++){var ti=t[i];var xi=c1*Math.exp(r1*ti)+c2*Math.exp(r2*ti);var vi=c1*r1*Math.exp(r1*ti)+c2*r2*Math.exp(r2*ti);x.push(xi);v.push(vi);}
var d={x:x,y:v,mode:'lines',name:'yörünge',line:{color:'#3b82f6',width:2.2}};
var start={x:[x[0]],y:[v[0]],mode:'markers',name:'başlangıç',marker:{size:10,color:'#f59e0b'}};
var ori={x:[0],y:[0],mode:'markers',name:'başlangıç (düğüm çekici)',marker:{size:12,color:'#f87171',symbol:'x',line:{width:3}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'konum x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-0.2,1.2]},yaxis:{title:'hız v',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-0.6,0.2]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-phase-over-tr',[d,start,ori],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Denenecek şeyler.</strong> <code>c = 0</code> koyun ve konumun sonsuza dek salındığını ve enerji E'nin titizlikle sabit olduğunu doğrulayın (sayısal yöntem çok az kayar — bu integrasyon hatasıdır, fizik değil). <code>c = 6.3 = 2 sqrt(m k)</code> koyun ve rejim etiketinin <code>KRİTİK SÖNÜMLÜ</code>'ye dönüşünü ve konumun aşmadan sıfıra düşüşünü izleyin. <code>c = 20</code>'ye itin ve aşırı sönümlü hantallığın devraldığını görün. <code>k</code>'yı 100 N/m'ye değiştirin ve frekansın üçe katlandığını hissedin. Negatif <code>c</code> deneyin — pasif bir damper için matematiksel imkânsızlık ama aktif bir yükselteç için iyi bir model — ve sistemin üstel olarak patladığını izleyin.</p>

<h2 class="lesson-title">Özet</h2>

<p class="l-text">Sabit katsayılı ikinci mertebe doğrusal ODE'ler, klasik mekaniğin, devre teorisinin ve yapısal dinamiğin iş yapan denklemleridir. Homojen durum y'' + b y' + c y = 0, y = e^{lambda x} üstel ansatzı ile çözülür ve bu, karakteristik kuadratik lambda^2 + b lambda + c = 0'a indirgenir. Diskriminant b^2 - 4 c üç evrenden birini seçer: iki farklı reel kök (saf üstel, mekanik sistemler için aşırı sönümlü), bir tekrarlanan reel kök (kritik sönüm — sınır, aşımsız en hızlı dönüş) ya da bir karmaşık eşlenik çift (üstel zarf altında salınım, zayıf sönümlü durum). Aynı denklem hem bir yay-kütle-sönümleyiciyi hem de bir seri RLC devresini tanımlar; kütle indüktansa, sönüm dirence, sertlik ters kapasitansa, yer değiştirme yüke eşlenir. Homojen olmayan problemler bir homojen kısma artı bir özel kısma ayrılır; belirsiz katsayılar polinom, üstel, sinüsoid ya da çarpım olan zorlama fonksiyonlarını ele alır, parametrelerin değişimi geri kalan her şeyi iki integral pahasına kapsar. Zorlama sinüsoid olduğunda ve frekansı sistemin doğal frekansına yaklaştığında, kalıcı durum genliği keskin şekilde zirveye ulaşır — bu rezonanstır, sönüm ne kadar küçükse o kadar keskindir, ve neden köprülerin, binaların ve çamaşır makinelerinin dikkatli dinamik tasarıma ihtiyaç duyduğudur. Enerji yöntemleri korunumlu hareketin bir birinci integralini ve faz portrelerinin geometrik resmini verir — sönümsüz için kapalı elipsler, zayıf sönümlü için içeri spiraller, aşırı sönümlü için doğrudan iniş. Bir sonraki ders, ODE'lere uygulanan Laplace dönüşümleri üzerine olacak ve buradaki her sonucu tamamlayıcı bir cebirsel açıdan tekrar ziyaret edecek.</p>
`

};
