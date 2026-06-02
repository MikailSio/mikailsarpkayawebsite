window.CONTROL_L2 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The PID controller is the most successful single piece of automation in the history of engineering.</strong> Eighty years after its first widespread industrial deployment, it still runs the vast majority of process loops on the planet — temperature in your kettle, pressure in a refinery column, cruise control in your car, attitude on a quadrotor, position of an injection moulding ram. Three terms, three gains, one equation. You can encode it in twenty lines of C and run it on an 8-bit microcontroller, or you can deploy it in a million-dollar distributed control system; the math underneath is identical.</p>

<p class="l-text">You have almost certainly already met PID in a lab or an internship. You twiddled K_p, watched the motor oscillate, twiddled it back, added a little K_i, the steady-state error went away. Good. This lesson is for the version of you that wants to understand <em>why</em> each term does what it does — what failure mode each one cures, what new failure mode it introduces, and which tricks the working control engineer reaches for when the textbook formulas misbehave on real hardware. We will start with a clean derivation, work through Ziegler-Nichols and Cohen-Coon tuning from scratch, and finish with the gritty practical issues — integrator windup, derivative kick on the setpoint, anti-windup schemes, derivative-on-measurement — that separate a textbook PID from one that runs reliably in the field.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write the PID control law and explain what each of the three terms K_p, K_i, K_d does to a closed-loop response</li>
<li>Predict the effect of increasing or decreasing any single gain on rise time, overshoot, steady-state error, and stability</li>
<li>Tune a PID controller from scratch using the classical Ziegler-Nichols ultimate-gain method, given only a way to step the process</li>
<li>Recognise integrator windup on a saturating actuator and implement at least two anti-windup strategies (clamping and back-calculation)</li>
<li>Implement a discrete-time PID controller in C for a microcontroller, including derivative on measurement and anti-windup</li>
<li>Decide when PID is the right tool and when a more sophisticated controller (state-space, MPC, or RL) is justified</li>
</ul>
</div>

<h2 class="lesson-title">1. The Control Problem</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> you want the temperature inside an oven to be 180 degrees Celsius. You have a heater, a thermocouple, and a knob that controls how much power the heater draws. The oven loses heat to the room through its walls, and you do not know exactly how fast. Your job is to vary the heater power, based only on the thermocouple reading, so the oven temperature reaches 180 quickly, does not overshoot, and stays there even if someone opens the door for thirty seconds. That is a control problem. PID is the standard answer to it.</div>

<p class="l-text">Strip the picture down to symbols. You have a <strong>plant</strong> (the system you want to influence) whose dynamics are described by some transfer function <code>G(s)</code>. You have a <strong>reference signal</strong> <code>r(t)</code> — the target you want the plant's output <code>y(t)</code> to follow. The <strong>tracking error</strong> is</p>

<div class="calc-formula"><div class="formula-label">THE ERROR SIGNAL</div><div class="formula-main">$$e(t) = r(t) - y(t)$$</div><div class="formula-sub">The single quantity every feedback controller works from. Positive means we are below target, negative means we are above.</div></div>

<p class="l-text">A <strong>controller</strong> is any rule that turns the error history <code>e(t), e(t-1), e(t-2), \\ldots</code> into a <strong>control signal</strong> <code>u(t)</code> that the plant accepts as input (motor voltage, valve opening, heater duty cycle). The closed-loop diagram is the universal feedback picture:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reference r(t)</div><div class="card-body">What you want the output to be. A constant setpoint (180 deg C), a step (turn on at t = 0), or a trajectory (a position profile for a robot arm).</div></div>
<div class="calc-card"><div class="card-title">Error e(t) = r(t) - y(t)</div><div class="card-body">Computed by a summing junction. The controller sees only this — it does not get told the reference and the output separately.</div></div>
<div class="calc-card"><div class="card-title">Controller C(s)</div><div class="card-body">Takes e(t), produces u(t). PID is one specific choice for C(s): u = K_p e + K_i integral e + K_d de/dt.</div></div>
<div class="calc-card"><div class="card-title">Plant G(s)</div><div class="card-body">The physical system. Takes u(t), produces y(t). Often poorly known. The controller has to work despite the uncertainty.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">DESIGN GOALS</div><div class="formula-main">$$\\text{drive } e(t) \\to 0 \\text{ as } t \\to \\infty, \\quad \\text{with a fast, well-damped transient}$$</div><div class="formula-sub">"Fast" means short rise time. "Well-damped" means small overshoot and quick settling. These two goals fight each other — the controller's job is to find the right trade-off.</div></div>

<p class="l-text">Every textbook performance metric grows out of this goal. <strong>Rise time</strong> measures how long y(t) takes to reach (say) 90% of r. <strong>Overshoot</strong> is the percentage by which y(t) exceeds r before settling. <strong>Settling time</strong> is how long y(t) takes to enter and stay within a small band (typically 2%) around r. <strong>Steady-state error</strong> is the residual <code>\\lim_{t \\to \\infty} e(t)</code>. PID is engineered to dial each of these.</p>

<div class="l-note"><strong>Why three terms and not two or four?</strong> Three is the minimum count that lets you independently set three independent qualitative features: speed of response (P), elimination of steady-state offset (I), and damping of overshoot (D). Anything less misses one of these knobs. Anything more usually pays back less than it complicates.</div>

<h2 class="lesson-title">2. Proportional Control (P)</h2>

<div class="calc-highlight"><strong>The simplest controller in the world:</strong> apply a control signal proportional to the error. Big error -> big push. Small error -> small push. Zero error -> nothing. It is what your hand does on a steering wheel when you drift toward the lane marker — turn proportionally to how far off you are.</div>

<p class="l-text">The proportional control law is one line:</p>

<div class="calc-formula"><div class="formula-label">P CONTROL LAW</div><div class="formula-main">$$u(t) = K_{p}\\, e(t)$$</div><div class="formula-sub">K_p is the proportional gain. Units: whatever maps the units of e (e.g. degrees C) into units of u (e.g. heater watts).</div></div>

<p class="l-text">Two consequences of the simplicity. First, P-only control is fast — there is no accumulation, no prediction, the controller reacts instantly to whatever error it sees. Second, P-only control almost always leaves a <strong>steady-state error</strong> on real plants. To understand why, consider the simplest case: a first-order plant <code>G(s) = K_p^{plant}/(1 + s\\tau)</code> in a feedback loop with proportional gain K_p.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Closed-loop transfer function</div><div class="step-detail">T(s) = K_p G(s) / (1 + K_p G(s)). Substitute G and simplify: T(s) = (K_p K_p^{plant}) / (1 + s tau + K_p K_p^{plant}).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Apply Final Value Theorem to a unit step</div><div class="step-detail">y_ss = lim as s -> 0 of s * T(s) * (1/s) = T(0) = K_p K_p^{plant} / (1 + K_p K_p^{plant}).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Steady-state error</div><div class="step-detail">e_ss = 1 - y_ss = 1 / (1 + K_p K_p^{plant}). Never zero for finite K_p. Only goes to zero as K_p -> infinity.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">STEADY-STATE ERROR FOR P CONTROL ON A TYPE-0 PLANT</div><div class="formula-main">$$e_{ss} = \\frac{1}{1 + K_{p}\\, K_{p}^{\\text{plant}}}$$</div><div class="formula-sub">A finite gain leaves a finite error. Doubling K_p halves the error but never eliminates it. This is the structural limitation of P-only control.</div></div>

<p class="l-text"><strong>What if we just crank K_p?</strong> Two things break. First, the control signal grows with K_p — the actuator saturates (your heater is already at 100%, no point in asking for more). Second, on any plant with phase lag (most physical systems), high gain pushes the closed-loop poles toward the imaginary axis, amplifying noise and eventually causing oscillation or outright instability.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Small K_p</div><div class="card-body">Slow response. Large steady-state error. Stable but sluggish. You can hear the motor never quite reaching the setpoint.</div></div>
<div class="calc-card"><div class="card-title">Medium K_p</div><div class="card-body">Reasonable rise time. Acceptable error. Light damping. The engineering sweet spot for tuning by hand.</div></div>
<div class="calc-card"><div class="card-title">Large K_p</div><div class="card-body">Fast initial slope, but heavy overshoot and ringing. The output dances around the setpoint instead of settling. Push K_p further and the loop oscillates indefinitely.</div></div>
<div class="calc-card"><div class="card-title">Ultimate gain K_u</div><div class="card-body">The critical K_p at which the loop sustains a steady oscillation of constant amplitude and period T_u. We will use this number to drive Ziegler-Nichols tuning.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — P CONTROL ON A FIRST-ORDER PLANT</div><div class="example-body"><strong>Plant:</strong> G(s) = 2 / (s + 1) (gain 2, time constant 1 s).<br><strong>Controller:</strong> u = K_p e with K_p = 3.<br><br>Closed-loop: T(s) = 6 / (s + 7). One pole at s = -7. Step response: y(t) = (6/7)(1 - e^{-7 t}).<br>Steady-state output: 6/7 = 0.857. Steady-state error: 1 - 6/7 = 0.143 = 14.3%.<br>Compare to K_p = 9: T(s) = 18 / (s + 19), y_ss = 18/19 = 0.947, e_ss = 5.3%. Tripling K_p only cut the error by a factor of 2.7. The diminishing returns are obvious.</div></div>

<div class="calc-graph"><div id="plot-l2-p-only-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the step response of a second-order plant G(s) = 1/(s^2 + s + 1) under P-only control for four values of K_p. Small K_p (0.5) gives a slow rise and ~33% steady-state error. K_p = 2 is faster but starts to overshoot. K_p = 5 oscillates wildly. K_p = 8 has lost stability — the response barely damps. None of them sit at y = 1 in steady state. <em>This is the structural failure that integral action will fix in section 3.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(Kp){
  var dt=0.01,N=2000;
  var x1=0,x2=0,y=[],t=[];
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var err=1-x1;
    var u=Kp*err;
    var x1d=x2;
    var x2d=-x1-x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var s1=simulate(0.5),s2=simulate(2),s3=simulate(5),s4=simulate(8);
var d1={x:s1.t,y:s1.y,mode:'lines',name:'K_p=0.5',line:{color:'#a78bfa',width:2.4}};
var d2={x:s2.t,y:s2.y,mode:'lines',name:'K_p=2',line:{color:'#3b82f6',width:2.4}};
var d3={x:s3.t,y:s3.y,mode:'lines',name:'K_p=5',line:{color:'#f59e0b',width:2.4}};
var d4={x:s4.t,y:s4.y,mode:'lines',name:'K_p=8',line:{color:'#f87171',width:2.4}};
var target={x:[0,20],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,20]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.3,1.8]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-p-only-en',[target,d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Mental model:</strong> P control is a spring. It pulls the output back toward the setpoint with a force proportional to displacement. A stiffer spring (bigger K_p) gives a faster pull but also more overshoot. There is no way for a pure spring to settle exactly at a non-zero displacement against a constant disturbance — you always need a static restoring force, and a pure spring provides none at zero displacement. That static restoring force is exactly what integral action will add.</div>

<h2 class="lesson-title">3. Integral Action (PI)</h2>

<div class="calc-highlight"><strong>The fix for steady-state error:</strong> add a term that <em>remembers</em> all past errors and keeps accumulating until the error vanishes. As long as there is any error left over, the integral grows. As long as the integral grows, the control signal grows. The only equilibrium is when the integral stops growing — which happens only when the error is zero.</div>

<p class="l-text">The PI control law adds an integral of the error to the proportional term:</p>

<div class="calc-formula"><div class="formula-label">PI CONTROL LAW</div><div class="formula-main">$$u(t) = K_{p}\\, e(t) + K_{i}\\, \\int_{0}^{t} e(\\tau)\\, d\\tau$$</div><div class="formula-sub">K_i is the integral gain. Two equivalent parametrisations exist: u = K_p (e + (1/T_i) integral e), where T_i = K_p / K_i is the "integral time" in seconds. Both conventions appear in industrial documentation.</div></div>

<p class="l-text">In the Laplace domain, the controller transfer function becomes</p>

<div class="calc-formula"><div class="formula-label">PI CONTROLLER IN s</div><div class="formula-main">$$C(s) = K_{p} + \\frac{K_{i}}{s} = \\frac{K_{p}\\, s + K_{i}}{s}$$</div><div class="formula-sub">A pole at the origin. A zero at s = -K_i / K_p. The pole at zero is the source of the integral's magic.</div></div>

<p class="l-text"><strong>Why does the pole at s = 0 eliminate steady-state error?</strong> Because the open-loop transfer function from r to e (the loop's "error transfer function") becomes 1/(1 + C(s) G(s)), and that 1/(1 + C(s) G(s)) goes to zero as s -> 0 whenever C(s) has a pole at s = 0. Apply the Final Value Theorem to e(t) for a step input r(s) = 1/s:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Error in the Laplace domain</div><div class="step-detail">E(s) = R(s) / (1 + C(s) G(s)). For a step, R(s) = 1/s.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Apply final value theorem</div><div class="step-detail">e_ss = lim as s -> 0 of s * E(s) = lim of 1 / (1 + C(s) G(s)).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">With a PI controller</div><div class="step-detail">C(s) = K_p + K_i/s -> infinity as s -> 0. So 1 + C G -> infinity, and e_ss -> 0. The integral wipes out the steady-state offset for any finite plant gain.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No more offset</div><div class="card-body">For any constant reference and any constant disturbance, the steady-state error is mathematically zero. The integral term keeps growing until it exactly cancels whatever bias the plant or the disturbance contributes.</div></div>
<div class="calc-card"><div class="card-title">Slower response</div><div class="card-body">The integral adds phase lag of 90 degrees at low frequencies. To keep the loop stable, K_p typically has to be reduced compared to the P-only case. The closed-loop response is slower than the equivalent P-only response.</div></div>
<div class="calc-card"><div class="card-title">More overshoot</div><div class="card-body">The integral keeps pushing even after the error has crossed zero, because what mattered to it was the <em>accumulated</em> error, which is still positive. The result is overshoot.</div></div>
<div class="calc-card"><div class="card-title">Saturating actuators bite</div><div class="card-body">If the actuator saturates while there is still error, the integral keeps growing and growing — "windup". When the system finally catches up, the controller is wound past its setpoint and recovery is slow. We fix this in section 7.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-pi-vs-p-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same second-order plant under P-only (K_p = 2) versus PI (K_p = 2, K_i = 1). P-only settles at y approximately 0.67 with a permanent 33% offset. PI starts the same way (proportional dominates early) but the integral term keeps pushing, the output overshoots slightly, and finally settles exactly at y = 1. <em>The price of zero offset is the overshoot.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(Kp,Ki){
  var dt=0.01,N=3000;
  var x1=0,x2=0,I=0,y=[],t=[];
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var err=1-x1;
    I+=err*dt;
    var u=Kp*err+Ki*I;
    var x1d=x2;
    var x2d=-x1-x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var s1=simulate(2,0),s2=simulate(2,1);
var d1={x:s1.t,y:s1.y,mode:'lines',name:'P only (K_p=2)',line:{color:'#f87171',width:2.6}};
var d2={x:s2.t,y:s2.y,mode:'lines',name:'PI (K_p=2, K_i=1)',line:{color:'#3b82f6',width:2.6}};
var target={x:[0,30],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,30]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-pi-vs-p-en',[target,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Engineering rule:</strong> if the steady-state error is the dominant complaint, increase K_i. If overshoot is the dominant complaint, reduce K_i (or add D). If neither is dominant, leave them and adjust K_p. Most beginners over-tune K_i because the offset is the most visible problem; experienced engineers tend to use the minimum K_i that gets the job done.</div>

<h2 class="lesson-title">4. Derivative Action (PID)</h2>

<div class="calc-highlight"><strong>P reacts to where the error is. I reacts to where the error has been. D reacts to where the error is going.</strong> The derivative term looks at the slope of the error and applies a corrective push proportional to that slope. If the error is decreasing fast (good news, we are approaching the setpoint), D actually <em>reduces</em> the controller output — preventing overshoot before it happens. This is the predictive, anticipatory term in the controller.</div>

<p class="l-text">The full PID control law is</p>

<div class="calc-formula"><div class="formula-label">PID CONTROL LAW</div><div class="formula-main">$$u(t) = K_{p}\\, e(t) + K_{i}\\, \\int_{0}^{t} e(\\tau)\\, d\\tau + K_{d}\\, \\frac{d\\, e(t)}{d\\, t}$$</div><div class="formula-sub">K_d is the derivative gain. The third independent knob. Units: time * gain — proportional to "how far ahead" the controller looks.</div></div>

<p class="l-text">In the Laplace domain:</p>

<div class="calc-formula"><div class="formula-label">PID CONTROLLER IN s</div><div class="formula-main">$$C(s) = K_{p} + \\frac{K_{i}}{s} + K_{d}\\, s = \\frac{K_{d}\\, s^{2} + K_{p}\\, s + K_{i}}{s}$$</div><div class="formula-sub">A pole at the origin (from I), two zeros (from the numerator quadratic). The zeros are where the controller adds phase lead — exactly the medicine high-frequency lag needs.</div></div>

<p class="l-text"><strong>The physical intuition.</strong> Imagine driving a car toward a parking spot. P alone makes you accelerate hard when far from the spot and gradually less as you approach — but you arrive going too fast and overshoot. Add D, and as you get close (error decreasing rapidly) the controller starts braking proactively. The result is a smooth, well-damped arrival.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reduces overshoot</div><div class="card-body">Because D acts against rapid error changes, it dampens the loop. With well-tuned D, you can use a larger K_p (faster response) without losing stability.</div></div>
<div class="calc-card"><div class="card-title">Adds phase lead</div><div class="card-body">In frequency-domain terms, derivative action contributes positive phase at high frequencies — pushing the closed-loop poles deeper into the left half-plane.</div></div>
<div class="calc-card"><div class="card-title">Amplifies noise</div><div class="card-body">The derivative of a noisy signal is much noisier than the signal itself. High-frequency noise on the thermocouple becomes huge swings in u(t). This is the single biggest practical problem with D — and we address it with a low-pass filter on the derivative (or by replacing de/dt with -dy/dt; see section 8).</div></div>
<div class="calc-card"><div class="card-title">Derivative kick</div><div class="card-body">When the setpoint changes abruptly (operator hits a new target), de/dt = dr/dt - dy/dt has a huge instantaneous spike — the controller sees an "infinite" derivative and saturates the actuator. Standard fix: take the derivative on the <em>measurement</em> only. Section 8.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PRACTICAL FORM: D WITH A LOW-PASS FILTER</div><div class="formula-main">$$C(s) = K_{p} + \\frac{K_{i}}{s} + \\frac{K_{d}\\, s}{1 + s\\, T_{d}/N}$$</div><div class="formula-sub">Adds a pole at high frequency to roll off the derivative gain. N is typically 8 to 20. Almost every commercial PID uses this form, not the ideal one.</div></div>

<div class="calc-graph"><div id="plot-l2-pid-comparison-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> step responses of the same second-order plant under P-only, PI, and PID, with each tuned for the best response of its kind. P-only is fast but has steady-state error. PI eliminates the error but oscillates more. PID has zero offset, modest overshoot, and the fastest settling time. <em>This is the classic motivation for using all three terms: they each pay for different sins.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(Kp,Ki,Kd){
  var dt=0.01,N=2500;
  var x1=0,x2=0,I=0,prevE=1,y=[],t=[];
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var err=1-x1;
    I+=err*dt;
    var dE=(err-prevE)/dt;prevE=err;
    var u=Kp*err+Ki*I+Kd*dE;
    var x1d=x2;
    var x2d=-x1-x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var s1=simulate(2,0,0),s2=simulate(2,1,0),s3=simulate(2,1,1);
var d1={x:s1.t,y:s1.y,mode:'lines',name:'P (K_p=2)',line:{color:'#f87171',width:2.4}};
var d2={x:s2.t,y:s2.y,mode:'lines',name:'PI (K_p=2, K_i=1)',line:{color:'#f59e0b',width:2.4}};
var d3={x:s3.t,y:s3.y,mode:'lines',name:'PID (K_p=2, K_i=1, K_d=1)',line:{color:'#3b82f6',width:2.6}};
var target={x:[0,25],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,25]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-pid-comparison-en',[target,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>When to use D, when to skip it:</strong> D earns its keep on processes with significant inertia (mechanical positioning, large thermal masses) where overshoot is expensive. D is usually disabled on noisy or fast-changing processes (flow control, pressure with turbulence) where the noise amplification overwhelms the benefit. Roughly 90 percent of industrial loops in practice are tuned as PI, not full PID — D is a power tool you reach for when the loop demands it.</div>

<h2 class="lesson-title">5. Ziegler-Nichols Tuning</h2>

<div class="calc-highlight"><strong>Ziegler and Nichols (1942)</strong> gave the world its first practical recipe for tuning a PID controller without knowing the plant model. The idea is to push the loop to the brink of instability by raising K_p until it sustains a steady oscillation, read off two numbers from that oscillation, and plug them into a table that returns K_p, K_i, K_d. It is not optimal, it is not gentle — but it is universally available and a very useful starting point.</div>

<p class="l-text">The procedure (the "ultimate gain" method) is mechanical:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Disable integral and derivative</div><div class="step-detail">Set K_i = 0 and K_d = 0. The controller is now pure proportional.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Raise K_p slowly until the loop oscillates</div><div class="step-detail">Apply small disturbances or setpoint steps and watch the response. Start with a small K_p and increase. At some critical value K_p = K_u (the "ultimate gain"), the response becomes a sustained oscillation of constant amplitude.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Measure the oscillation period</div><div class="step-detail">At K_p = K_u, the output oscillates at some period T_u (the "ultimate period"). Read it off a stopwatch or a strip-chart recorder.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Apply the Ziegler-Nichols table</div><div class="step-detail">Plug K_u and T_u into the closed-loop ZN formulas to get the tuned gains.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">ZIEGLER-NICHOLS CLOSED-LOOP TUNING TABLE</div><div class="formula-main">$$\\text{P only:} \\quad K_{p} = 0.5\\, K_{u}$$ $$\\text{PI:} \\quad K_{p} = 0.45\\, K_{u}, \\quad T_{i} = T_{u}/1.2$$ $$\\text{PID:} \\quad K_{p} = 0.6\\, K_{u}, \\quad T_{i} = T_{u}/2, \\quad T_{d} = T_{u}/8$$</div><div class="formula-sub">In terms of K_i and K_d: K_i = K_p / T_i and K_d = K_p T_d. The classical PID tuning is then K_p = 0.6 K_u, K_i = 1.2 K_u / T_u, K_d = 0.075 K_u T_u.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why it works</div><div class="card-body">At K_u, the loop has exactly 180 degrees of phase shift at frequency 2 pi / T_u. The two ZN numbers (K_u, T_u) are a one-point identification of the plant's frequency response — enough to place a PID with reasonable margin.</div></div>
<div class="calc-card"><div class="card-title">Why it's rough</div><div class="card-body">ZN aims for "quarter amplitude damping" — each oscillation peak is one-quarter the previous one. That's around 60% overshoot, which most modern engineers find too aggressive. Useful as a starting point, not a finished design.</div></div>
<div class="calc-card"><div class="card-title">When you can't run ZN</div><div class="card-body">For unstable or integrating plants, pushing K_p high enough to oscillate may be dangerous or destructive. In that case use the open-loop ZN variant (section 6 Cohen-Coon) or a model-based design instead.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-zn-oscillation-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a step response on the brink of stability. At K_p = K_u, the loop sustains a clean oscillation of constant amplitude with period T_u — neither growing nor decaying. K_p slightly below K_u gives a damped oscillation; K_p slightly above gives a growing oscillation. <em>Reading K_u and T_u from this plot is the entire ZN identification step.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(Kp){
  var dt=0.01,N=3000;
  var x1=0,x2=0,x3=0,y=[],t=[];
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var err=1-x1;
    var u=Kp*err;
    var x1d=x2;
    var x2d=x3;
    var x3d=-2*x1-3*x2-2*x3+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    x3+=x3d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var sBelow=simulate(2.5),sUlt=simulate(3),sAbove=simulate(3.5);
var d1={x:sBelow.t,y:sBelow.y,mode:'lines',name:'K_p = 2.5 (below K_u, decay)',line:{color:'#10b981',width:2.4}};
var d2={x:sUlt.t,y:sUlt.y,mode:'lines',name:'K_p = K_u = 3 (sustained)',line:{color:'#3b82f6',width:2.6}};
var d3={x:sAbove.t,y:sAbove.y,mode:'lines',name:'K_p = 3.5 (above K_u, growing)',line:{color:'#f87171',width:2.4}};
var target={x:[0,30],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,30]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,3]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-zn-oscillation-en',[target,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED ZIEGLER-NICHOLS</div><div class="example-body"><strong>Process:</strong> A laboratory water heater. You connect a P-only controller, raise K_p in steps.<br>At K_p = 8 the tank temperature begins a clean steady oscillation. You time the cycle with a stopwatch: each cycle takes 12 seconds.<br><br>So <strong>K_u = 8</strong>, <strong>T_u = 12 s</strong>.<br><br>Apply the PID rule:<br>K_p = 0.6 * 8 = <strong>4.8</strong><br>T_i = 12 / 2 = 6 s, so K_i = K_p / T_i = 4.8 / 6 = <strong>0.8</strong><br>T_d = 12 / 8 = 1.5 s, so K_d = K_p * T_d = 4.8 * 1.5 = <strong>7.2</strong><br><br>This is your starting tune. Test it on the real loop and adjust by feel — typically halve K_p and double K_d if the overshoot is excessive.</div></div>

<div class="l-note"><strong>Modern alternative — relay autotuning (Astrom 1984):</strong> instead of slowly increasing K_p until oscillation onset, replace the controller temporarily with a relay (bang-bang) that switches u between +A and -A based on the sign of the error. The loop will limit-cycle automatically; from the amplitude and period of that cycle one can compute K_u and T_u directly. This is the technique built into most commercial autotuners — push a button, the controller does the experiment, the tune appears.</div>

<h2 class="lesson-title">6. Cohen-Coon Tuning (Open Loop)</h2>

<div class="calc-highlight"><strong>The open-loop alternative.</strong> When you cannot afford to push the closed loop into sustained oscillation, Cohen and Coon (1953) provide a tuning method based on a single open-loop step test. You disconnect the controller, apply a step in the manipulated variable u, and watch the process variable y rise. From the shape of that "process reaction curve" — a sigmoid in most industrial processes — you extract three numbers and look up the gains.</div>

<p class="l-text">Most industrial processes can be approximated as <strong>first-order plus dead time (FOPDT)</strong>:</p>

<div class="calc-formula"><div class="formula-label">FOPDT MODEL</div><div class="formula-main">$$G(s) = \\frac{K\\, e^{-\\theta\\, s}}{1 + \\tau\\, s}$$</div><div class="formula-sub">Three parameters: process gain K (steady-state output change per unit input change), dead time theta (delay before the output starts responding), time constant tau (how quickly the output approaches its final value).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K — process gain</div><div class="card-body">Final steady-state change in y divided by step change in u. Dimensionless or units of y/u. Read off the step response after it has settled.</div></div>
<div class="calc-card"><div class="card-title">theta — dead time</div><div class="card-body">Time delay between applying the step and seeing any response in y. Caused by transport lag (fluid traveling down a pipe, conveyor belt) or measurement delay.</div></div>
<div class="calc-card"><div class="card-title">tau — time constant</div><div class="card-body">Time for y to reach 63.2% of its final value after the dead time. Sets the "speed" of the open-loop process.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">COHEN-COON PID TUNING (FOR FOPDT PLANTS)</div><div class="formula-main">$$K_{p} = \\frac{1.35}{K} \\left(\\frac{\\tau}{\\theta} + 0.185\\right)$$ $$T_{i} = \\theta\\, \\frac{2.5\\, \\tau + 0.5\\, \\theta}{\\tau + 0.61\\, \\theta}, \\qquad T_{d} = \\frac{0.37\\, \\theta\\, \\tau}{\\tau + 0.19\\, \\theta}$$</div><div class="formula-sub">More accurate than ZN for processes with significant dead time (theta / tau > 0.3). Less aggressive — overshoot is typically 10-20%, not 60%.</div></div>

<div class="calc-example"><div class="example-label">COHEN-COON WORKED EXAMPLE</div><div class="example-body"><strong>Open-loop step test on a chemical reactor.</strong> Step u from 50% to 60% (a +10% step). After a 2-second delay, the outlet temperature begins to rise. It reaches 63.2% of its final increase after another 8 seconds, and finally settles 5 degrees C higher.<br><br>So K = 5 deg / 10% = 0.5 deg/%, theta = 2 s, tau = 8 s.<br><br>Cohen-Coon PID:<br>K_p = (1.35 / 0.5) * (8/2 + 0.185) = 2.7 * 4.185 = <strong>11.3</strong><br>T_i = 2 * (2.5*8 + 0.5*2) / (8 + 0.61*2) = 2 * 21 / 9.22 = <strong>4.55 s</strong><br>T_d = 0.37*2*8 / (8 + 0.19*2) = 5.92 / 8.38 = <strong>0.71 s</strong><br><br>Compare with ZN: ZN would give noticeably more aggressive gains (and more overshoot) on this dead-time-dominant process. Cohen-Coon is the better choice here.</div></div>

<div class="l-note"><strong>Pick the right method.</strong> ZN is the right call for processes that you can safely oscillate and where dead time is small. Cohen-Coon is the right call for processes with significant dead time (theta/tau > 0.3) — typical in chemical and process control. For high-performance servo systems (CNC, robotics) neither method is sharp enough — use IMC (internal model control) or pole placement instead.</div>

<h2 class="lesson-title">7. Practical Implementation: Saturation and Anti-Windup</h2>

<div class="calc-highlight"><strong>The single most common failure mode of PID controllers in the field</strong> is integrator windup. A textbook PID treats the actuator as unbounded — u can be any real number. A real actuator saturates: a valve cannot open past 100%, a motor draws a maximum current, a heater dissipates a maximum power. When the controller commands more than the actuator can deliver, the error stays large; the integral keeps accumulating; eventually the integral term reaches absurd magnitudes. By the time the system finally responds, the controller is "wound up" deep past its target — and unwinding takes a very long time.</div>

<p class="l-text">The naive PID with no saturation handling looks like this in pseudocode:</p>

<div class="code-wrap"><div class="code-label"><span>PSEUDOCODE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Naive PID — DO NOT use in production</span>
e = r - y
I = I + e * dt          <span class="cm"># integrator keeps accumulating, no matter what</span>
D = (e - e_prev) / dt
u = Kp * e + Ki * I + Kd * D
<span class="cm"># --- Apply to plant (actuator silently clips) ---</span>
plant_input = clamp(u, u_min, u_max)
e_prev = e
</code></pre></div>

<p class="l-text">The problem: <code>I</code> grows without bound while the actuator is saturated. The integral term contains energy that has to be discharged before the controller can respond to anything new. Two simple anti-windup strategies fix it.</p>

<h3 style="color:#3b82f6;margin-top:1.4rem">Method 1: Conditional Integration (Clamping)</h3>

<p class="l-text">Freeze the integrator whenever the actuator is saturated. If u is already pinned at u_max and the error is still positive, do not let the integral grow any further.</p>

<div class="code-wrap"><div class="code-label"><span>PSEUDOCODE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Conditional integration anti-windup</span>
e = r - y
u_unsat = Kp * e + Ki * I + Kd * D
u = clamp(u_unsat, u_min, u_max)

<span class="cm"># Only update integrator if not saturating, OR if integration would unsaturate</span>
saturated_hi = (u_unsat &gt;= u_max) <span class="kw">and</span> (e &gt; 0)
saturated_lo = (u_unsat &lt;= u_min) <span class="kw">and</span> (e &lt; 0)
<span class="kw">if</span> <span class="kw">not</span> (saturated_hi <span class="kw">or</span> saturated_lo):
    I = I + e * dt
</code></pre></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">Method 2: Back-Calculation</h3>

<p class="l-text">Add a feedback path from the difference (u_unsat - u_saturated) back into the integrator. The integrator unwinds at a rate set by an extra "tracking gain" K_t.</p>

<div class="code-wrap"><div class="code-label"><span>PSEUDOCODE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Back-calculation anti-windup</span>
e = r - y
u_unsat = Kp * e + Ki * I + Kd * D
u = clamp(u_unsat, u_min, u_max)

<span class="cm"># Pull the integrator back toward what would have given u (the saturated value)</span>
I = I + (Ki * e + Kt * (u - u_unsat)) * dt
<span class="cm"># Kt is the back-calculation gain; typical Kt = 1/Ti or sqrt(Ki*Kd) — tune empirically</span>
</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Clamping</div><div class="card-body">Simple, robust, ubiquitous. Only one extra conditional. Works well when the controller spends most of its time unsaturated and only occasionally pegs the actuator.</div></div>
<div class="calc-card"><div class="card-title">Back-calculation</div><div class="card-body">Smoother recovery — the integrator drifts back toward the unsaturated value continuously rather than freezing. Better when the controller saturates frequently and you need predictable behaviour.</div></div>
<div class="calc-card"><div class="card-title">Reset on saturation</div><div class="card-body">The crudest fix: zero the integrator whenever the actuator saturates. Almost never used in practice because it loses all the integral information at once — too aggressive.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-windup-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the closed-loop response of an integrating-plant PID with a large setpoint step that saturates the actuator at u = +/-1. Without anti-windup (red), the integrator winds up dramatically while the actuator is pinned; by the time the output finally crosses the setpoint, the controller is wound past it, and the response overshoots badly and oscillates for ages before settling. With clamping anti-windup (blue), the integrator stops accumulating once saturation is hit, the controller stays responsive, and the output approaches the setpoint cleanly. <em>The difference is the most visible improvement any single line of anti-windup code will ever make.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(useAW){
  var dt=0.01,N=4000;
  var x1=0,x2=0,I=0,prevE=2,y=[],t=[],uHist=[];
  var Kp=1.5,Ki=0.6,Kd=0.5;
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var ref=2;
    var err=ref-x1;
    var dE=(err-prevE)/dt;prevE=err;
    var uUns=Kp*err+Ki*I+Kd*dE;
    var u=Math.max(-1,Math.min(1,uUns));
    if(useAW){
      var hi=uUns>=1&&err>0,lo=uUns<=-1&&err<0;
      if(!(hi||lo))I+=err*dt;
    }else{
      I+=err*dt;
    }
    uHist.push(u);
    var x1d=x2;
    var x2d=-0.5*x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y,u:uHist};
}
var noAW=simulate(false),withAW=simulate(true);
var d1={x:noAW.t,y:noAW.y,mode:'lines',name:'no anti-windup',line:{color:'#f87171',width:2.6}};
var d2={x:withAW.t,y:withAW.y,mode:'lines',name:'with clamping anti-windup',line:{color:'#3b82f6',width:2.6}};
var target={x:[0,40],y:[2,2],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,40]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.5,5]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-windup-en',[target,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Rule of thumb:</strong> every production PID needs an anti-windup scheme. The simpler controllers in cheap thermostats often use clamping; high-performance servo loops on robots and CNC machines often use back-calculation with a carefully tuned K_t. The crude reset method is mostly a teaching example.</div>

<h2 class="lesson-title">8. Derivative on Measurement (Not on Error)</h2>

<div class="calc-highlight"><strong>The setpoint kick problem.</strong> Suppose the operator changes the setpoint from r = 0 to r = 1 instantaneously. The error jumps from 0 to 1. The derivative <code>de/dt</code> is, mathematically, an impulse — infinite at t = 0. In a discrete-time controller this becomes a huge spike on the very first sample after the setpoint change. The control signal saturates the actuator; the system jerks. This is the famous "derivative kick".</div>

<p class="l-text">The fix is structural and has been standard industrial practice for half a century. Recognize that</p>

<div class="calc-formula"><div class="formula-label">DERIVATIVE OF ERROR</div><div class="formula-main">$$\\frac{d\\, e(t)}{d\\, t} = \\frac{d\\, r(t)}{d\\, t} - \\frac{d\\, y(t)}{d\\, t}$$</div><div class="formula-sub">The derivative of error is the difference between the derivative of the setpoint and the derivative of the measurement.</div></div>

<p class="l-text">For a smooth, slowly changing setpoint, <code>dr/dt</code> is small and the two derivatives are nearly equal. But for a step change in r, <code>dr/dt</code> is an impulse — and that impulse is what kicks the actuator. Since the goal of the derivative term is to anticipate <em>system response</em>, we can simply <strong>drop the dr/dt term and compute the derivative from the measurement alone</strong>:</p>

<div class="calc-formula"><div class="formula-label">PID WITH DERIVATIVE ON MEASUREMENT</div><div class="formula-main">$$u(t) = K_{p}\\, e(t) + K_{i}\\, \\int_{0}^{t} e(\\tau)\\, d\\tau - K_{d}\\, \\frac{d\\, y(t)}{d\\, t}$$</div><div class="formula-sub">Note the minus sign — we are computing -dy/dt, which equals de/dt only when dr/dt = 0. The change is silent during steady operation but kills the derivative kick during setpoint steps.</div></div>

<div class="calc-graph"><div id="plot-l2-derivkick-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> response of a PID to a sudden setpoint change from 0 to 1 at t = 5 s. With D-on-error (red), the controller spikes its output massively at t = 5 — the derivative of the step is huge, and the actuator slams against saturation, producing a violent overshoot. With D-on-measurement (blue), no spike — the controller sees a smooth y(t), produces a smooth u(t), and the output reaches the setpoint with minimal overshoot. <em>This single architectural change is silent during normal operation but transformative when setpoints change.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(dOnMeas){
  var dt=0.01,N=2500;
  var x1=0,x2=0,I=0,prevE=0,prevY=0,y=[],t=[];
  var Kp=2,Ki=0.5,Kd=1.2;
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var ref=time<5?0:1;
    var err=ref-x1;
    I+=err*dt;
    var dTerm;
    if(dOnMeas){
      dTerm=-Kd*(x1-prevY)/dt;
    }else{
      dTerm=Kd*(err-prevE)/dt;
    }
    prevE=err;prevY=x1;
    var u=Kp*err+Ki*I+dTerm;
    u=Math.max(-5,Math.min(5,u));
    var x1d=x2;
    var x2d=-x1-x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var sErr=simulate(false),sMeas=simulate(true);
var d1={x:sErr.t,y:sErr.y,mode:'lines',name:'D on error (kick!)',line:{color:'#f87171',width:2.6}};
var d2={x:sMeas.t,y:sMeas.y,mode:'lines',name:'D on measurement',line:{color:'#3b82f6',width:2.6}};
var setpt={x:[0,5,5,25],y:[0,0,1,1],mode:'lines',name:'setpoint r(t)',line:{color:'#888',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,25]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.3,1.8]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-derivkick-en',[setpt,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>More generally:</strong> the "PI-D" form puts P and I on the error but D only on the measurement. The even more sophisticated "I-PD" form puts only I on the error, and P and D both on the measurement — even smoother on setpoint changes but slower to respond to true setpoint moves. The right structure depends on whether your loop spends more time tracking changing references (servo problem — keep P on the error) or rejecting disturbances at a fixed setpoint (regulation problem — push P toward the measurement too).</div>

<h2 class="lesson-title">9. Discrete-Time PID for Microcontrollers</h2>

<div class="calc-highlight"><strong>The microcontroller version.</strong> A real PID does not run continuously — it runs once per sample period T_s on a digital processor. The integral becomes a sum; the derivative becomes a finite difference. The Euler approximation is the simplest discretisation and works well as long as T_s is much smaller than the loop's time constant.</div>

<p class="l-text">Replace the integral by a running sum and the derivative by a forward difference:</p>

<div class="calc-formula"><div class="formula-label">DISCRETE-TIME PID (POSITION FORM, EULER)</div><div class="formula-main">$$u_{k} = K_{p}\\, e_{k} + K_{i}\\, T_{s}\\, \\sum_{j=0}^{k} e_{j} + K_{d}\\, \\frac{e_{k} - e_{k-1}}{T_{s}}$$</div><div class="formula-sub">k is the discrete time index. T_s is the sample period. The integral sum and the previous error must be stored in state between calls.</div></div>

<p class="l-text">A more memory-efficient implementation is the <strong>incremental (velocity) form</strong>, which works with the change in u from one sample to the next:</p>

<div class="calc-formula"><div class="formula-label">DISCRETE-TIME PID (VELOCITY/INCREMENTAL FORM)</div><div class="formula-main">$$\\Delta u_{k} = K_{p}(e_{k} - e_{k-1}) + K_{i}\\, T_{s}\\, e_{k} + K_{d}\\, \\frac{e_{k} - 2\\, e_{k-1} + e_{k-2}}{T_{s}}$$</div><div class="formula-sub">u_k = u_{k-1} + Delta u_k. No explicit integral state needed — the integration is hidden in the previous u. Bumpless when switching between manual and auto modes.</div></div>

<div class="code-wrap"><div class="code-label"><span>C (BARE-METAL FRIENDLY)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">typedef</span> <span class="kw">struct</span> {
    <span class="kw">float</span> Kp, Ki, Kd;
    <span class="kw">float</span> Ts;             <span class="cm">// sample period in seconds</span>
    <span class="kw">float</span> u_min, u_max;   <span class="cm">// actuator limits</span>
    <span class="kw">float</span> integ;          <span class="cm">// integral state</span>
    <span class="kw">float</span> y_prev;         <span class="cm">// previous measurement (D-on-measurement)</span>
} pid_t;

<span class="kw">float</span> <span class="fn">pid_step</span>(pid_t *p, <span class="kw">float</span> r, <span class="kw">float</span> y) {
    <span class="kw">float</span> e = r - y;
    <span class="kw">float</span> u_p = p->Kp * e;
    <span class="kw">float</span> u_d = -p->Kd * (y - p->y_prev) / p->Ts;   <span class="cm">// D on measurement</span>
    <span class="kw">float</span> u_unsat = u_p + p->Ki * p->integ + u_d;
    <span class="kw">float</span> u = u_unsat;
    <span class="kw">if</span> (u > p->u_max) u = p->u_max;
    <span class="kw">if</span> (u < p->u_min) u = p->u_min;
    <span class="cm">// Conditional integration anti-windup</span>
    <span class="kw">int</span> sat_hi = (u_unsat >= p->u_max) && (e > 0);
    <span class="kw">int</span> sat_lo = (u_unsat <= p->u_min) && (e < 0);
    <span class="kw">if</span> (!(sat_hi || sat_lo)) p->integ += e * p->Ts;
    p->y_prev = y;
    <span class="kw">return</span> u;
}
</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sample period T_s</div><div class="card-body">Pick T_s 10-20 times faster than the dominant plant time constant tau. For a tau = 1 s thermal loop, T_s = 50-100 ms is fine. For a 1 kHz servo loop, T_s = 50-100 microseconds. Too slow and the discretisation aliases; too fast wastes CPU.</div></div>
<div class="calc-card"><div class="card-title">Use floats, not doubles</div><div class="card-body">Embedded processors often lack hardware double-precision. Float (32-bit) is plenty for PID — quantisation noise on the gains and states is orders below the sensor noise.</div></div>
<div class="calc-card"><div class="card-title">Filter the derivative</div><div class="card-body">A single first-order low-pass on the derivative input (a 1-pole IIR filter with corner at omega = N/T_d where N=10) almost always pays off. Without it, you are amplifying sensor noise straight into the actuator.</div></div>
<div class="calc-card"><div class="card-title">Watch for integer overflow</div><div class="card-body">If you must use fixed-point arithmetic on a small MCU, the integral state can saturate the variable type long before the controller saturates the actuator. Clamp the integral state itself, not just u.</div></div>
</div>

<div class="l-note"><strong>Bumpless transfer</strong> is the issue of switching between manual mode (operator drives u directly) and auto mode (PID drives u) without a jump. With the velocity form this comes for free — Delta u = 0 at the switch, by construction. With the position form you have to initialise the integrator to a value consistent with the current u and current e, which is fiddly. Most modern controllers use the velocity form for this single reason.</div>

<h2 class="lesson-title">10. AI Perspective: When Does PID Suffice, When Do We Need RL?</h2>

<div class="calc-highlight"><strong>The boring truth:</strong> for the overwhelming majority of single-input single-output (SISO) regulation problems, a well-tuned PID is faster to build, easier to debug, simpler to certify, and cheaper to maintain than any learned controller. The temptation to throw modern reinforcement learning at every problem is real, but PID has eighty years of field history for a reason. So when is RL actually justified?</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PID wins</div><div class="card-body">SISO loops. Plant approximately linear in operating region. Disturbances stochastic but bounded. Cost of a poor transient is moderate. Operators expect to be able to "tune" the loop. Examples: process control, thermostats, motor speed loops, servo positioning.</div></div>
<div class="calc-card"><div class="card-title">PID extended (gain scheduling)</div><div class="card-body">When the plant is mildly nonlinear, switch between multiple pre-tuned PID parameter sets based on the operating point. Common in flight control and engine management. Still PID under the hood.</div></div>
<div class="calc-card"><div class="card-title">Model Predictive Control (MPC)</div><div class="card-body">When you have multiple coupled variables, hard constraints (e.g. "this temperature must never exceed 350 deg"), and a reasonably accurate plant model. Solves a small optimization at every step. Standard in chemicals, refining, and increasingly in autonomous driving.</div></div>
<div class="calc-card"><div class="card-title">Reinforcement Learning</div><div class="card-body">When the plant is severely nonlinear, the model is unknown or hard to write down, and you can simulate (or trial) the system millions of times. RL has reigned over Atari games and robot manipulation; it makes sense for tasks where classical control struggles to express the goal (e.g. legged locomotion, fluid mixing, autonomous racing).</div></div>
</div>

<p class="l-text">A more nuanced answer: the two approaches do not have to be enemies. <strong>Residual learning</strong> is a productive hybrid — let a hand-designed PID handle most of the control and train an RL agent to add a small residual correction that addresses the nonlinearities PID cannot. This way you keep the safety, simplicity, and explainability of PID while letting the learned component handle whatever the textbook formulas miss. Recent quadrotor and bipedal-robot work uses exactly this pattern.</p>

<div class="l-note"><strong>Don't let model fashion drive engineering choice.</strong> A PID on a quadrotor's attitude loop will outperform an unconstrained policy network — every single time — for stability and worst-case behaviour. RL belongs at the higher levels of the stack: trajectory planning, gait switching, contact sequencing. Keep PID where it is good. Reach for fancier tools only when the loop in front of you actually demands them.</div>

<h2 class="lesson-title">11. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Suggested experiments.</strong> Set K_i = 0 and watch the steady-state error reappear — that 17% offset is exactly <code>1/(1 + K_p G(0)) = 1/(1+2) = 0.33</code>... wait, the plant gain is G(0) = 1, so the error is 1/3. Now set K_p = 8, K_i = 0 — you will see a heavy oscillation that is approaching the loop's ultimate gain. Run Ziegler-Nichols: find the K_p at which the loop oscillates indefinitely, time the period, plug into the table, and compare with the default gains. Set <code>USE_ANTIWINDUP = False</code> and crank K_i up — you will see the windup-induced overshoot directly. Each five-second experiment teaches one of the eleven sections viscerally.</p>

<h2 class="lesson-title">Summary</h2>

<p class="l-text">A PID controller takes the error <code>e = r - y</code> and produces the actuator signal <code>u = K_p e + K_i integral e + K_d de/dt</code>. The proportional term gives fast response but always leaves a steady-state offset on type-0 plants; the integral term wipes out that offset by accumulating until the error vanishes, at the cost of slower response and more overshoot; the derivative term anticipates by reacting to the slope of error, reducing overshoot but amplifying noise. Ziegler-Nichols (closed-loop) and Cohen-Coon (open-loop FOPDT) give first-cut tuning rules from minimal experiments. Real implementations need three crucial fixes the textbook formulas omit: integrator windup is solved by conditional integration or back-calculation; the derivative-kick on setpoint changes is solved by taking the derivative of the measurement rather than the error; high-frequency noise on the D term is solved by a low-pass filter at the derivative input. A discrete-time PID for a microcontroller is twenty lines of C, runs in less than a microsecond, and is the workhorse of every embedded automation loop you will ever build. Reach for RL only when PID genuinely fails — and even then, consider letting PID handle the inner loop while learning handles the outer.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>PID kontrolcü, mühendislik tarihinin en başarılı tek otomasyon parçasıdır.</strong> İlk yaygın endüstriyel uygulamasından seksen yıl sonra, gezegendeki süreç döngülerinin büyük çoğunluğunu hâlâ o işletiyor — su ısıtıcınızdaki sıcaklık, rafineri kolonundaki basınç, arabanızdaki hız sabitleyici, quadrotor üzerindeki tutum, enjeksiyon kalıp pistonunun konumu. Üç terim, üç kazanç, tek bir denklem. Yirmi satır C koduyla yazıp 8-bit bir mikrodenetleyicide çalıştırabilir ya da milyon dolarlık dağıtık kontrol sistemine kurabilirsiniz; altta yatan matematik aynıdır.</p>

<p class="l-text">Büyük olasılıkla PID ile bir laboratuvarda ya da stajda zaten karşılaşmışsınızdır. K_p'yi oynattınız, motorun salındığını gördünüz, geri çevirdiniz, biraz K_i eklediniz, kalıcı hata kayboldu. İyi. Bu ders, her terimin <em>neden</em> yaptığını anlamak isteyen size hitap ediyor — her birinin hangi arıza modunu iyileştirdiğini, hangi yeni arıza modunu getirdiğini ve çalışan kontrol mühendisinin kitap formülleri gerçek donanım üzerinde takıldığında hangi numaralara başvurduğunu. Temiz bir türetmeyle başlayıp Ziegler-Nichols ve Cohen-Coon ayarlamasını sıfırdan geçeceğiz, sonra sahada güvenilir çalışan bir PID'i kitap PID'inden ayıran pratik konuları — integratör doyumu, ayar noktasındaki türev tekmesi, anti-windup şemaları, ölçüm üzerinden türev — ele alacağız.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>PID kontrol yasasını yazmak ve üç terimin her birinin (K_p, K_i, K_d) kapalı çevrim cevabına ne yaptığını açıklamak</li>
<li>Tek bir kazancın artırılması veya azaltılmasının yükselme süresi, aşım, kalıcı hata ve kararlılık üzerindeki etkisini öngörmek</li>
<li>Klasik Ziegler-Nichols nihai-kazanç yöntemini kullanarak sıfırdan bir PID kontrolcü ayarlamak, yalnızca süreci basamaklamak için bir yola sahipken</li>
<li>Doyan bir aktüatörde integratör doyumunu tanımak ve en az iki anti-windup stratejisi uygulamak (klampleme ve geri hesaplama)</li>
<li>Bir mikrodenetleyici için C dilinde ayrık zamanlı bir PID kontrolcü uygulamak — ölçüm üzerinden türev ve anti-windup dahil</li>
<li>PID'nin ne zaman doğru araç olduğuna ve ne zaman daha sofistike bir kontrolcünün (durum-uzay, MPC veya RL) gerekçeli olduğuna karar vermek</li>
</ul>
</div>

<h2 class="lesson-title">1. Kontrol Problemi</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> bir fırının içindeki sıcaklığın 180 derece Celsius olmasını istiyorsunuz. Elinizde bir ısıtıcı, bir termokupl ve ısıtıcının ne kadar güç çektiğini kontrol eden bir düğme var. Fırın, duvarlarından odaya ısı kaybediyor ve bunun ne kadar hızlı olduğunu tam olarak bilmiyorsunuz. İşiniz, yalnızca termokupl okumasına dayanarak ısıtıcı gücünü değiştirmek, böylece fırın sıcaklığı 180'e çabuk ulaşsın, aşmayın ve birisi otuz saniye kapıyı açsa bile orada kalsın. Bu bir kontrol problemidir. PID, buna verilen standart yanıttır.</div>

<p class="l-text">Resmi sembollere indirgeyin. Etkilemek istediğiniz bir <strong>tesis</strong> (plant) var, dinamiği bir <code>G(s)</code> transfer fonksiyonuyla tanımlı. Bir <strong>referans sinyali</strong> <code>r(t)</code> var — tesisin çıkışı <code>y(t)</code>'nin takip etmesini istediğiniz hedef. <strong>İzleme hatası</strong></p>

<div class="calc-formula"><div class="formula-label">HATA SİNYALİ</div><div class="formula-main">$$e(t) = r(t) - y(t)$$</div><div class="formula-sub">Her geri besleme kontrolcüsünün çalıştığı tek değişken. Pozitif, hedefin altındayız demektir; negatif, üstündeyiz.</div></div>

<p class="l-text">Bir <strong>kontrolcü</strong>, hata geçmişini <code>e(t), e(t-1), e(t-2), \\ldots</code> tesisin girdi olarak kabul ettiği bir <strong>kontrol sinyaline</strong> <code>u(t)</code> dönüştüren herhangi bir kuraldır (motor gerilimi, vana açıklığı, ısıtıcı görev döngüsü). Kapalı çevrim şeması evrensel geri besleme resmidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Referans r(t)</div><div class="card-body">Çıkışın olmasını istediğiniz değer. Sabit bir ayar noktası (180 derece), bir basamak (t=0'da aç) veya bir yörünge (robot kolu için bir konum profili).</div></div>
<div class="calc-card"><div class="card-title">Hata e(t) = r(t) - y(t)</div><div class="card-body">Bir toplama düğümünde hesaplanır. Kontrolcü yalnızca bunu görür — referans ile çıkış ayrı ayrı verilmez.</div></div>
<div class="calc-card"><div class="card-title">Kontrolcü C(s)</div><div class="card-body">e(t)'yi alır, u(t) üretir. PID, C(s) için belirli bir tercihtir: u = K_p e + K_i integral e + K_d de/dt.</div></div>
<div class="calc-card"><div class="card-title">Tesis G(s)</div><div class="card-body">Fiziksel sistem. u(t)'yi alır, y(t) üretir. Çoğu zaman tam bilinmez. Kontrolcü belirsizliğe rağmen çalışmak zorundadır.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">TASARIM HEDEFLERİ</div><div class="formula-main">$$e(t) \\to 0 \\quad (t \\to \\infty), \\quad \\text{fast, well-damped transient}$$</div><div class="formula-sub">"Hızlı" kısa yükselme süresi demektir. "İyi sönümlü" küçük aşım ve hızlı oturma demektir. Bu iki hedef birbiriyle savaşır — kontrolcünün işi doğru dengeyi bulmaktır.</div></div>

<p class="l-text">Her ders kitabı performans ölçütü bu hedeften doğar. <strong>Yükselme süresi</strong>, y(t)'nin r'nin (örneğin) %90'ına ulaşması için geçen süreyi ölçer. <strong>Aşım</strong>, y(t)'nin oturmadan önce r'yi aştığı yüzdedir. <strong>Oturma süresi</strong>, y(t)'nin r etrafında küçük bir banda (tipik olarak %2) girip orada kalması için geçen süredir. <strong>Kalıcı hata</strong>, kalan <code>\\lim_{t \\to \\infty} e(t)</code>'dir. PID bunların her birini ayarlamak için tasarlanmıştır.</p>

<div class="l-note"><strong>Neden üç terim, ne iki ne dört?</strong> Üç, üç bağımsız niteliksel özelliği bağımsız ayarlamanıza izin veren minimum sayıdır: cevap hızı (P), kalıcı sapmanın yok edilmesi (I) ve aşımın sönümü (D). Daha az olunca bu düğmelerden biri kaçırılır. Daha fazlası genellikle karmaşıklığı ödediği kadar değer üretmez.</div>

<h2 class="lesson-title">2. Oransal Kontrol (P)</h2>

<div class="calc-highlight"><strong>Dünyanın en basit kontrolcüsü:</strong> hatayla orantılı bir kontrol sinyali uygulayın. Büyük hata -> büyük itme. Küçük hata -> küçük itme. Sıfır hata -> hiçbir şey. Şerit çizgisine doğru kaydığınızda elinizin direksiyonda yaptığı şey budur — ne kadar saptığınızla orantılı çevirin.</div>

<p class="l-text">Oransal kontrol yasası tek satırdır:</p>

<div class="calc-formula"><div class="formula-label">P KONTROL YASASI</div><div class="formula-main">$$u(t) = K_{p}\\, e(t)$$</div><div class="formula-sub">K_p oransal kazançtır. Birim: e (örneğin derece C) birimini u (örneğin ısıtıcı watt) birimine ne dönüştürürse o.</div></div>

<p class="l-text">Basitliğin iki sonucu vardır. Birincisi, yalnızca P kontrol hızlıdır — birikim yok, tahmin yok, kontrolcü gördüğü hataya anında tepki verir. İkincisi, yalnızca P kontrol gerçek tesislerde neredeyse her zaman bir <strong>kalıcı hata</strong> bırakır. Nedenini anlamak için en basit durumu düşünün: oransal kazanç K_p ile bir geri besleme döngüsündeki birinci mertebe tesis <code>G(s) = K_p^{tesis}/(1 + s\\tau)</code>.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Kapalı çevrim transfer fonksiyonu</div><div class="step-detail">T(s) = K_p G(s) / (1 + K_p G(s)). G'yi yerleştirip sadeleştirin: T(s) = (K_p K_p^{tesis}) / (1 + s tau + K_p K_p^{tesis}).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Birim basamak için Son Değer Teoremi uygulayın</div><div class="step-detail">y_ss = lim s -> 0 olarak s * T(s) * (1/s) = T(0) = K_p K_p^{tesis} / (1 + K_p K_p^{tesis}).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Kalıcı hata</div><div class="step-detail">e_ss = 1 - y_ss = 1 / (1 + K_p K_p^{tesis}). Sonlu K_p için asla sıfır değildir. Yalnızca K_p -> sonsuz olduğunda sıfıra gider.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">TİP-0 TESİSTE P KONTROLÜN KALICI HATASI</div><div class="formula-main">$$e_{ss} = \\frac{1}{1 + K_{p}\\, K_{p}^{\\text{tesis}}}$$</div><div class="formula-sub">Sonlu bir kazanç sonlu bir hata bırakır. K_p'yi ikiye katlamak hatayı yarıya indirir ama asla yok etmez. Bu, yalnızca P kontrolün yapısal sınırıdır.</div></div>

<p class="l-text"><strong>K_p'yi sonuna kadar açsak ne olur?</strong> İki şey bozulur. Birincisi, kontrol sinyali K_p ile büyür — aktüatör doyar (ısıtıcınız zaten %100'dedir, daha fazlasını istemenin anlamı yok). İkincisi, faz gecikmesi olan herhangi bir tesiste (çoğu fiziksel sistem) yüksek kazanç kapalı çevrim kutuplarını imajiner eksene doğru iter, gürültüyü büyütür ve sonunda salınıma veya doğrudan kararsızlığa yol açar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Küçük K_p</div><div class="card-body">Yavaş cevap. Büyük kalıcı hata. Kararlı ama tembel. Motorun hedefe asla tam ulaşamadığını duyabilirsiniz.</div></div>
<div class="calc-card"><div class="card-title">Orta K_p</div><div class="card-body">Makul yükselme süresi. Kabul edilebilir hata. Hafif sönüm. El ayarlamasının mühendislik tatlı noktası.</div></div>
<div class="calc-card"><div class="card-title">Büyük K_p</div><div class="card-body">Hızlı başlangıç eğimi, ama yoğun aşım ve çınlama. Çıkış oturmak yerine ayar noktasının etrafında dans eder. K_p'yi biraz daha itin, döngü sürekli salınır.</div></div>
<div class="calc-card"><div class="card-title">Nihai kazanç K_u</div><div class="card-body">Döngünün sabit genlikli sürekli bir salınımı (T_u periyotlu) tutturduğu kritik K_p. Bu sayıyı Ziegler-Nichols ayarlamasında kullanacağız.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇALIŞMA ÖRNEĞİ — BİRİNCİ MERTEBE TESİSTE P KONTROL</div><div class="example-body"><strong>Tesis:</strong> G(s) = 2 / (s + 1) (kazanç 2, zaman sabiti 1 s).<br><strong>Kontrolcü:</strong> u = K_p e, K_p = 3.<br><br>Kapalı çevrim: T(s) = 6 / (s + 7). s = -7'de bir kutup. Basamak cevabı: y(t) = (6/7)(1 - e^{-7 t}).<br>Kalıcı çıkış: 6/7 = 0,857. Kalıcı hata: 1 - 6/7 = 0,143 = %14,3.<br>K_p = 9 ile karşılaştırın: T(s) = 18 / (s + 19), y_ss = 18/19 = 0,947, e_ss = %5,3. K_p'yi üçe katlamak hatayı yalnızca 2,7 katı azalttı. Azalan getiri açık.</div></div>

<div class="calc-graph"><div id="plot-l2-p-only-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> ikinci mertebe tesis G(s) = 1/(s^2 + s + 1) üzerinde yalnızca P kontrol altında dört farklı K_p değeri için basamak cevabı. Küçük K_p (0,5) yavaş bir yükseliş ve yaklaşık %33 kalıcı hata verir. K_p = 2 daha hızlıdır ama aşmaya başlar. K_p = 5 çılgınca salınır. K_p = 8 kararlılığı kaybetmiştir — cevap güçlükle sönümleniyor. Hiçbiri kararlı halde y = 1'de oturmuyor. <em>Bu, 3. bölümdeki integral eyleminin düzelteceği yapısal başarısızlıktır.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(Kp){
  var dt=0.01,N=2000;
  var x1=0,x2=0,y=[],t=[];
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var err=1-x1;
    var u=Kp*err;
    var x1d=x2;
    var x2d=-x1-x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var s1=simulate(0.5),s2=simulate(2),s3=simulate(5),s4=simulate(8);
var d1={x:s1.t,y:s1.y,mode:'lines',name:'K_p=0.5',line:{color:'#a78bfa',width:2.4}};
var d2={x:s2.t,y:s2.y,mode:'lines',name:'K_p=2',line:{color:'#3b82f6',width:2.4}};
var d3={x:s3.t,y:s3.y,mode:'lines',name:'K_p=5',line:{color:'#f59e0b',width:2.4}};
var d4={x:s4.t,y:s4.y,mode:'lines',name:'K_p=8',line:{color:'#f87171',width:2.4}};
var target={x:[0,20],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,20]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.3,1.8]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-p-only-tr',[target,d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Zihinsel model:</strong> P kontrol bir yaydır. Çıkışı ayar noktasına doğru, yer değiştirme ile orantılı bir kuvvetle çeker. Daha sert bir yay (daha büyük K_p) daha hızlı çekiş ama aynı zamanda daha fazla aşım verir. Saf bir yayın sabit bir bozucuya karşı sıfırdan farklı bir yer değiştirmede tam olarak oturmasının yolu yoktur — her zaman statik bir geri çağırma kuvveti gerekir ve saf bir yay sıfır yer değiştirmede hiçbir şey üretmez. İşte o statik geri çağırma kuvveti, integral eyleminin tam olarak ekleyeceği şeydir.</div>

<h2 class="lesson-title">3. İntegral Eylemi (PI)</h2>

<div class="calc-highlight"><strong>Kalıcı hatanın çözümü:</strong> tüm geçmiş hataları <em>hatırlayan</em> ve hata yok olana kadar birikmeye devam eden bir terim ekleyin. Hâlâ herhangi bir hata kaldığı sürece integral büyür. İntegral büyüdüğü sürece kontrol sinyali büyür. Tek denge, integralin büyümeyi durdurduğu noktadır — ki bu da yalnızca hata sıfır olduğunda gerçekleşir.</div>

<p class="l-text">PI kontrol yasası, oransal terime bir hata integrali ekler:</p>

<div class="calc-formula"><div class="formula-label">PI KONTROL YASASI</div><div class="formula-main">$$u(t) = K_{p}\\, e(t) + K_{i}\\, \\int_{0}^{t} e(\\tau)\\, d\\tau$$</div><div class="formula-sub">K_i integral kazancıdır. İki eşdeğer parametrelendirme vardır: u = K_p (e + (1/T_i) integral e), burada T_i = K_p / K_i saniye cinsinden "integral zamanı"dır. Her iki gelenek de endüstriyel dokümanlarda görünür.</div></div>

<p class="l-text">Laplace alanında kontrolcü transfer fonksiyonu şu hale gelir:</p>

<div class="calc-formula"><div class="formula-label">s ALANINDA PI KONTROLCÜ</div><div class="formula-main">$$C(s) = K_{p} + \\frac{K_{i}}{s} = \\frac{K_{p}\\, s + K_{i}}{s}$$</div><div class="formula-sub">Orijinde bir kutup. s = -K_i / K_p'de bir sıfır. Orijindeki kutup, integralin sihrinin kaynağıdır.</div></div>

<p class="l-text"><strong>Neden s = 0'daki kutup kalıcı hatayı yok eder?</strong> Çünkü r'den e'ye açık çevrim transfer fonksiyonu (döngünün "hata transfer fonksiyonu") 1/(1 + C(s) G(s)) olur ve C(s)'nin s = 0'da bir kutbu olduğunda bu 1/(1 + C(s) G(s)) s -> 0 iken sıfıra gider. Bir basamak girdisi r(s) = 1/s için e(t)'ye Son Değer Teoremi'ni uygulayın:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Laplace alanında hata</div><div class="step-detail">E(s) = R(s) / (1 + C(s) G(s)). Basamak için R(s) = 1/s.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Son değer teoremini uygulayın</div><div class="step-detail">e_ss = lim s -> 0 olarak s * E(s) = lim 1 / (1 + C(s) G(s)).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">PI kontrolcüsüyle</div><div class="step-detail">C(s) = K_p + K_i/s -> sonsuz, s -> 0 iken. Yani 1 + C G -> sonsuz ve e_ss -> 0. İntegral, sonlu tesis kazancı için kalıcı sapmayı silip atar.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Artık sapma yok</div><div class="card-body">Sabit bir referans ve sabit bir bozucu için kalıcı hata matematiksel olarak sıfırdır. İntegral terimi, tesis veya bozucunun kattığı her sapmayı tam olarak götürene kadar büyümeye devam eder.</div></div>
<div class="calc-card"><div class="card-title">Daha yavaş cevap</div><div class="card-body">İntegral, düşük frekanslarda 90 derece faz gecikmesi katar. Döngüyü kararlı tutmak için K_p genellikle yalnızca P durumuna kıyasla azaltılmak zorunda kalır. Kapalı çevrim cevabı, eşdeğer yalnızca P cevabına göre daha yavaştır.</div></div>
<div class="calc-card"><div class="card-title">Daha fazla aşım</div><div class="card-body">İntegral, hata sıfırı geçtikten sonra bile itmeye devam eder, çünkü onun için önemli olan <em>birikmiş</em> hatadır ve o hâlâ pozitiftir. Sonuç aşımdır.</div></div>
<div class="calc-card"><div class="card-title">Doyan aktüatörler ısırır</div><div class="card-body">Aktüatör hâlâ hata varken doyarsa, integral büyümeye ve büyümeye devam eder — "windup". Sistem nihayet yetiştiğinde, kontrolcü ayar noktasını geride bırakacak kadar sarılmıştır ve kurtarma yavaştır. Bunu 7. bölümde düzelteceğiz.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-pi-vs-p-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> aynı ikinci mertebe tesis yalnızca P (K_p = 2) ile PI (K_p = 2, K_i = 1) altında. Yalnızca P, y yaklaşık 0,67'de %33 kalıcı sapmayla oturur. PI aynı şekilde başlar (oransal erkenden baskındır) ama integral terimi itmeye devam eder, çıkış hafif aşar ve nihayetinde tam olarak y = 1'de oturur. <em>Sıfır sapmanın bedeli aşımdır.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(Kp,Ki){
  var dt=0.01,N=3000;
  var x1=0,x2=0,I=0,y=[],t=[];
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var err=1-x1;
    I+=err*dt;
    var u=Kp*err+Ki*I;
    var x1d=x2;
    var x2d=-x1-x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var s1=simulate(2,0),s2=simulate(2,1);
var d1={x:s1.t,y:s1.y,mode:'lines',name:'yalnızca P (K_p=2)',line:{color:'#f87171',width:2.6}};
var d2={x:s2.t,y:s2.y,mode:'lines',name:'PI (K_p=2, K_i=1)',line:{color:'#3b82f6',width:2.6}};
var target={x:[0,30],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,30]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-pi-vs-p-tr',[target,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Mühendislik kuralı:</strong> kalıcı hata baskın şikâyetse K_i'yi artırın. Aşım baskınsa K_i'yi azaltın (veya D ekleyin). Hiçbiri baskın değilse onları bırakın ve K_p'yi ayarlayın. Çoğu yeni başlayan K_i'yi aşırı ayarlar çünkü sapma en görünür sorundur; deneyimli mühendisler genellikle işi gören minimum K_i'yi kullanır.</div>

<h2 class="lesson-title">4. Türev Eylemi (PID)</h2>

<div class="calc-highlight"><strong>P, hatanın nerede olduğuna tepki verir. I, hatanın nerede olduğuna tepki verir. D, hatanın nereye gittiğine tepki verir.</strong> Türev terimi hatanın eğimine bakar ve o eğimle orantılı bir düzeltici itme uygular. Hata hızla azalıyorsa (iyi haber, ayar noktasına yaklaşıyoruz), D aslında kontrolcü çıkışını <em>azaltır</em> — aşımı gerçekleşmeden önler. Kontrolcünün öngörücü, anticipatory terimi budur.</div>

<p class="l-text">Tam PID kontrol yasası:</p>

<div class="calc-formula"><div class="formula-label">PID KONTROL YASASI</div><div class="formula-main">$$u(t) = K_{p}\\, e(t) + K_{i}\\, \\int_{0}^{t} e(\\tau)\\, d\\tau + K_{d}\\, \\frac{d\\, e(t)}{d\\, t}$$</div><div class="formula-sub">K_d türev kazancıdır. Üçüncü bağımsız düğme. Birimi: zaman * kazanç — kontrolcünün "ne kadar ileriye baktığıyla" orantılı.</div></div>

<p class="l-text">Laplace alanında:</p>

<div class="calc-formula"><div class="formula-label">s ALANINDA PID KONTROLCÜ</div><div class="formula-main">$$C(s) = K_{p} + \\frac{K_{i}}{s} + K_{d}\\, s = \\frac{K_{d}\\, s^{2} + K_{p}\\, s + K_{i}}{s}$$</div><div class="formula-sub">Orijinde bir kutup (I'den), iki sıfır (pay kuadratiğinden). Sıfırlar, kontrolcünün faz öncülemesi eklediği yerlerdir — yüksek frekans gecikmesinin ihtiyaç duyduğu ilaç tam olarak budur.</div></div>

<p class="l-text"><strong>Fiziksel sezgi.</strong> Bir arabayı park yerine doğru sürdüğünüzü düşünün. Yalnızca P, yerden uzaktayken sertçe hızlanmanızı ve yaklaştıkça giderek daha azını sağlar — ama oraya çok hızlı varır ve aşarsınız. D ekleyin ve yaklaştıkça (hata hızla azalıyor) kontrolcü proaktif olarak frenlemeye başlar. Sonuç pürüzsüz, iyi sönümlü bir varış.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşımı azaltır</div><div class="card-body">D, hızlı hata değişimlerine karşı çalıştığı için döngüyü söndürür. İyi ayarlanmış D ile, kararlılığı kaybetmeden daha büyük K_p (daha hızlı cevap) kullanabilirsiniz.</div></div>
<div class="calc-card"><div class="card-title">Faz öncülemesi katar</div><div class="card-body">Frekans-alan terimleriyle, türev eylemi yüksek frekanslarda pozitif faz katkısı yapar — kapalı çevrim kutuplarını sol yarı düzleme daha derine iter.</div></div>
<div class="calc-card"><div class="card-title">Gürültüyü büyütür</div><div class="card-body">Gürültülü bir sinyalin türevi, sinyalin kendisinden çok daha gürültülüdür. Termokupldaki yüksek frekans gürültüsü u(t)'de büyük dalgalanmalara dönüşür. Bu, D ile yaşanan en büyük pratik sorundur — ve bunu türev üzerine bir alçak geçiren filtre (veya de/dt yerine -dy/dt; bölüm 8) ile ele alırız.</div></div>
<div class="calc-card"><div class="card-title">Türev tekmesi</div><div class="card-body">Ayar noktası aniden değiştiğinde (operatör yeni bir hedef girer), de/dt = dr/dt - dy/dt anlık bir devasa tepe verir — kontrolcü "sonsuz" bir türev görür ve aktüatörü doyurur. Standart çözüm: türevi yalnızca <em>ölçüm</em> üzerinden alın. Bölüm 8.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">PRATİK BİÇİM: ALÇAK GEÇİREN FİLTRELİ D</div><div class="formula-main">$$C(s) = K_{p} + \\frac{K_{i}}{s} + \\frac{K_{d}\\, s}{1 + s\\, T_{d}/N}$$</div><div class="formula-sub">Türev kazancını yumuşatmak için yüksek frekansta bir kutup ekler. N tipik olarak 8 ila 20'dir. Hemen hemen her ticari PID, ideal biçimi değil bu biçimi kullanır.</div></div>

<div class="calc-graph"><div id="plot-l2-pid-comparison-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> aynı ikinci mertebe tesisin yalnızca P, PI ve PID altında basamak cevapları, her biri kendi türünün en iyi cevabı için ayarlanmış. Yalnızca P hızlı ama kalıcı hatası var. PI hatayı yok ediyor ama daha çok salınıyor. PID sıfır sapma, ılımlı aşım ve en hızlı oturma süresi sağlıyor. <em>Bu, üç terimin de kullanılmasının klasik gerekçesidir: her biri farklı günahların bedelini öder.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(Kp,Ki,Kd){
  var dt=0.01,N=2500;
  var x1=0,x2=0,I=0,prevE=1,y=[],t=[];
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var err=1-x1;
    I+=err*dt;
    var dE=(err-prevE)/dt;prevE=err;
    var u=Kp*err+Ki*I+Kd*dE;
    var x1d=x2;
    var x2d=-x1-x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var s1=simulate(2,0,0),s2=simulate(2,1,0),s3=simulate(2,1,1);
var d1={x:s1.t,y:s1.y,mode:'lines',name:'P (K_p=2)',line:{color:'#f87171',width:2.4}};
var d2={x:s2.t,y:s2.y,mode:'lines',name:'PI (K_p=2, K_i=1)',line:{color:'#f59e0b',width:2.4}};
var d3={x:s3.t,y:s3.y,mode:'lines',name:'PID (K_p=2, K_i=1, K_d=1)',line:{color:'#3b82f6',width:2.6}};
var target={x:[0,25],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,25]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,1.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-pid-comparison-tr',[target,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>D'yi ne zaman kullanın, ne zaman atlayın:</strong> D, aşımın pahalı olduğu, önemli ataletli süreçlerde (mekanik konumlama, büyük termal kütleler) hakkını çıkarır. Gürültünün büyütülmesinin faydayı bastırdığı gürültülü veya hızlı değişen süreçlerde (akış kontrolü, türbülanslı basınç) genellikle D devre dışı bırakılır. Pratikte endüstriyel döngülerin yaklaşık %90'ı tam PID değil PI olarak ayarlanır — D, döngünün talep ettiği bir güç aracıdır.</div>

<h2 class="lesson-title">5. Ziegler-Nichols Ayarlaması</h2>

<div class="calc-highlight"><strong>Ziegler ve Nichols (1942)</strong> tesis modelini bilmeden bir PID kontrolcü ayarlamak için dünyanın ilk pratik tarifini verdiler. Fikir, K_p'yi artırarak döngüyü kararlılığın eşiğine itmek, sürekli salınımdan iki sayı okumak ve K_p, K_i, K_d döndüren bir tabloya takmaktır. Optimal değildir, nazik değildir — ama evrensel olarak kullanılabilir ve çok yararlı bir başlangıç noktasıdır.</div>

<p class="l-text">Prosedür ("nihai kazanç" yöntemi) mekaniktir:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İntegrali ve türevi devre dışı bırakın</div><div class="step-detail">K_i = 0 ve K_d = 0 ayarlayın. Kontrolcü artık saf oransaldır.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Döngü salınana kadar K_p'yi yavaşça yükseltin</div><div class="step-detail">Küçük bozucular veya ayar noktası basamakları uygulayın ve cevabı izleyin. Küçük bir K_p ile başlayıp artırın. K_p = K_u kritik değerinde ("nihai kazanç"), cevap sabit genlikli sürekli bir salınım olur.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Salınım periyodunu ölçün</div><div class="step-detail">K_p = K_u'da çıkış T_u ("nihai periyot") periyoduyla salınır. Bir kronometre veya şerit kayıt cihazından okuyun.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Ziegler-Nichols tablosunu uygulayın</div><div class="step-detail">K_u ve T_u'yu kapalı çevrim ZN formüllerine takarak ayarlı kazançları elde edin.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">ZIEGLER-NICHOLS KAPALI ÇEVRİM AYARLAMA TABLOSU</div><div class="formula-main">$$\\text{P only:} \\quad K_{p} = 0.5\\, K_{u}$$ $$\\text{PI:} \\quad K_{p} = 0.45\\, K_{u}, \\quad T_{i} = T_{u}/1.2$$ $$\\text{PID:} \\quad K_{p} = 0.6\\, K_{u}, \\quad T_{i} = T_{u}/2, \\quad T_{d} = T_{u}/8$$</div><div class="formula-sub">K_i ve K_d cinsinden: K_i = K_p / T_i ve K_d = K_p T_d. Klasik PID ayarı şu hale gelir: K_p = 0.6 K_u, K_i = 1.2 K_u / T_u, K_d = 0.075 K_u T_u.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden çalışıyor</div><div class="card-body">K_u'da döngü 2 pi / T_u frekansında tam olarak 180 derece faz kaymasına sahiptir. İki ZN sayısı (K_u, T_u) tesisin frekans cevabının tek noktalı tanımlamasıdır — makul marjla bir PID yerleştirmek için yeterli.</div></div>
<div class="calc-card"><div class="card-title">Neden kaba</div><div class="card-body">ZN "çeyrek genlik sönümünü" hedefler — her salınım tepesi bir öncekinin dörtte biridir. Bu yaklaşık %60 aşımdır, çoğu modern mühendisin fazla agresif bulduğu bir değer. Başlangıç noktası olarak yararlıdır, bitmiş tasarım olarak değil.</div></div>
<div class="calc-card"><div class="card-title">ZN'i çalıştıramadığınızda</div><div class="card-body">Kararsız veya integre edici tesisler için, K_p'yi salınıma yetecek kadar yükseltmek tehlikeli veya yıkıcı olabilir. Bu durumda açık çevrim ZN varyantı (bölüm 6 Cohen-Coon) veya model-tabanlı tasarım kullanın.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-zn-oscillation-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> kararlılık eşiğinde bir basamak cevabı. K_p = K_u'da döngü T_u periyotlu, sabit genlikli temiz bir salınım tutturur — ne büyür ne söner. K_p, K_u'nun biraz altında sönümlü bir salınım verir; biraz üstünde büyüyen bir salınım verir. <em>K_u ve T_u'yu bu grafikten okumak ZN tanımlama adımının tamamıdır.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(Kp){
  var dt=0.01,N=3000;
  var x1=0,x2=0,x3=0,y=[],t=[];
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var err=1-x1;
    var u=Kp*err;
    var x1d=x2;
    var x2d=x3;
    var x3d=-2*x1-3*x2-2*x3+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    x3+=x3d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var sBelow=simulate(2.5),sUlt=simulate(3),sAbove=simulate(3.5);
var d1={x:sBelow.t,y:sBelow.y,mode:'lines',name:'K_p = 2.5 (K_u altı, söner)',line:{color:'#10b981',width:2.4}};
var d2={x:sUlt.t,y:sUlt.y,mode:'lines',name:'K_p = K_u = 3 (sürekli)',line:{color:'#3b82f6',width:2.6}};
var d3={x:sAbove.t,y:sAbove.y,mode:'lines',name:'K_p = 3.5 (K_u üstü, büyür)',line:{color:'#f87171',width:2.4}};
var target={x:[0,30],y:[1,1],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,30]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,3]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-zn-oscillation-tr',[target,d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇALIŞMA ÖRNEĞİ — ZIEGLER-NICHOLS</div><div class="example-body"><strong>Süreç:</strong> bir laboratuvar su ısıtıcısı. Yalnızca P kontrolcü bağlayıp K_p'yi kademeli olarak yükseltiyorsunuz.<br>K_p = 8'de tank sıcaklığı temiz, sürekli bir salınıma başlıyor. Kronometreyle döngüyü ölçüyorsunuz: her döngü 12 saniye sürüyor.<br><br>Yani <strong>K_u = 8</strong>, <strong>T_u = 12 s</strong>.<br><br>PID kuralını uygulayın:<br>K_p = 0,6 * 8 = <strong>4,8</strong><br>T_i = 12 / 2 = 6 s, yani K_i = K_p / T_i = 4,8 / 6 = <strong>0,8</strong><br>T_d = 12 / 8 = 1,5 s, yani K_d = K_p * T_d = 4,8 * 1,5 = <strong>7,2</strong><br><br>Bu sizin başlangıç ayarınız. Gerçek döngüde test edin ve hissinizle ayarlayın — aşım aşırıysa tipik olarak K_p'yi yarıya indirin ve K_d'yi ikiye katlayın.</div></div>

<div class="l-note"><strong>Modern alternatif — röle otomatik ayarlama (Astrom 1984):</strong> K_p'yi salınım başlangıcına kadar yavaşça artırmak yerine, kontrolcüyü hatanın işaretine göre u'yu +A ve -A arasında değiştiren bir röle (bang-bang) ile geçici olarak değiştirin. Döngü otomatik olarak limit-döngüye girer; o döngünün genlik ve periyodundan K_u ile T_u doğrudan hesaplanabilir. Bu, çoğu ticari otomatik ayarlayıcıda yerleşik tekniktir — bir düğmeye basın, kontrolcü deneyi yapsın, ayar belirsin.</div>

<h2 class="lesson-title">6. Cohen-Coon Ayarlaması (Açık Çevrim)</h2>

<div class="calc-highlight"><strong>Açık çevrim alternatif.</strong> Kapalı döngüyü sürekli salınıma itmeyi göze alamadığınızda, Cohen ve Coon (1953) tek bir açık çevrim basamak testine dayanan bir ayar yöntemi sunarlar. Kontrolcüyü ayırırsınız, manipüle edilen değişken u'da bir basamak uygularsınız ve süreç değişkeni y'nin yükselişini izlersiniz. O "süreç tepki eğrisinin" şeklinden — çoğu endüstriyel süreçte bir sigmoid — üç sayı çıkarırsınız ve kazançları tablodan ararsınız.</div>

<p class="l-text">Çoğu endüstriyel süreç <strong>birinci mertebe artı ölü zaman (FOPDT)</strong> olarak yaklaşıklanabilir:</p>

<div class="calc-formula"><div class="formula-label">FOPDT MODELİ</div><div class="formula-main">$$G(s) = \\frac{K\\, e^{-\\theta\\, s}}{1 + \\tau\\, s}$$</div><div class="formula-sub">Üç parametre: süreç kazancı K (birim girdi değişimi başına kalıcı çıkış değişimi), ölü zaman theta (çıkışın tepki vermeye başlamasından önceki gecikme), zaman sabiti tau (çıkışın kalıcı değerine ne kadar hızlı yaklaştığı).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K — süreç kazancı</div><div class="card-body">y'deki son kalıcı değişimin u'daki basamak değişimine oranı. Boyutsuz veya y/u birimleri. Basamak cevabı oturduktan sonra okunur.</div></div>
<div class="calc-card"><div class="card-title">theta — ölü zaman</div><div class="card-body">Basamağın uygulanması ile y'de herhangi bir cevap görülmesi arasındaki zaman gecikmesi. Taşıma gecikmesi (boruda akan sıvı, taşıma bandı) veya ölçüm gecikmesinden kaynaklanır.</div></div>
<div class="calc-card"><div class="card-title">tau — zaman sabiti</div><div class="card-body">y'nin ölü zamandan sonra kalıcı değerinin %63,2'sine ulaşma süresi. Açık çevrim sürecin "hızını" belirler.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">COHEN-COON PID AYARLAMASI (FOPDT TESİSLER İÇİN)</div><div class="formula-main">$$K_{p} = \\frac{1.35}{K} \\left(\\frac{\\tau}{\\theta} + 0.185\\right)$$ $$T_{i} = \\theta\\, \\frac{2.5\\, \\tau + 0.5\\, \\theta}{\\tau + 0.61\\, \\theta}, \\qquad T_{d} = \\frac{0.37\\, \\theta\\, \\tau}{\\tau + 0.19\\, \\theta}$$</div><div class="formula-sub">Önemli ölü zamanlı süreçler için (theta / tau > 0.3) ZN'den daha doğru. Daha az agresif — aşım tipik olarak %10-20, %60 değil.</div></div>

<div class="calc-example"><div class="example-label">COHEN-COON ÇALIŞMA ÖRNEĞİ</div><div class="example-body"><strong>Bir kimyasal reaktör üzerinde açık çevrim basamak testi.</strong> u'yu %50'den %60'a (+%10 basamak) yükseltin. 2 saniyelik gecikmeden sonra çıkış sıcaklığı yükselmeye başlar. 8 saniye daha sonra son artışın %63,2'sine ulaşır ve nihayet 5 derece daha yüksek oturur.<br><br>Yani K = 5 derece / %10 = 0,5 derece/%, theta = 2 s, tau = 8 s.<br><br>Cohen-Coon PID:<br>K_p = (1,35 / 0,5) * (8/2 + 0,185) = 2,7 * 4,185 = <strong>11,3</strong><br>T_i = 2 * (2,5*8 + 0,5*2) / (8 + 0,61*2) = 2 * 21 / 9,22 = <strong>4,55 s</strong><br>T_d = 0,37*2*8 / (8 + 0,19*2) = 5,92 / 8,38 = <strong>0,71 s</strong><br><br>ZN ile karşılaştırın: bu ölü zaman baskın süreçte ZN belirgin biçimde daha agresif kazançlar (ve daha fazla aşım) verirdi. Cohen-Coon burada daha iyi seçimdir.</div></div>

<div class="l-note"><strong>Doğru yöntemi seçin.</strong> ZN, güvenle salındırabileceğiniz ve ölü zamanın küçük olduğu süreçler için doğru tercihtir. Cohen-Coon, önemli ölü zamanlı süreçler için (theta/tau > 0.3) — kimya ve süreç kontrolünde tipik — doğru tercihtir. Yüksek performanslı servo sistemler (CNC, robotik) için her iki yöntem de yeterince keskin değildir — yerine IMC (içsel model kontrol) veya kutup yerleştirme kullanın.</div>

<h2 class="lesson-title">7. Pratik Uygulama: Doyum ve Anti-Windup</h2>

<div class="calc-highlight"><strong>PID kontrolcülerin sahadaki en yaygın arıza modu</strong> integratör doyumudur (windup). Kitap PID'i aktüatörü sınırsız varsayar — u herhangi bir gerçek sayı olabilir. Gerçek bir aktüatör doyar: bir vana %100'ün üzerine açılamaz, bir motor maksimum akım çeker, bir ısıtıcı maksimum gücü dağıtır. Kontrolcü aktüatörün sağlayabileceğinden fazlasını istediğinde, hata büyük kalır; integral birikmeye devam eder; sonunda integral terimi saçma boyutlara ulaşır. Sistem nihayet tepki verdiğinde, kontrolcü hedefin çok ötesinde "sarılmıştır" — ve geri çözmek uzun zaman alır.</div>

<p class="l-text">Doyum işleme olmadan saf PID sözde kodda şöyle görünür:</p>

<div class="code-wrap"><div class="code-label"><span>SÖZDE KOD</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Saf PID — üretimde KULLANMAYIN</span>
e = r - y
I = I + e * dt          <span class="cm"># integratör birikmeye devam eder, ne olursa olsun</span>
D = (e - e_prev) / dt
u = Kp * e + Ki * I + Kd * D
<span class="cm"># --- Tesise uygulayın (aktüatör sessizce kırpar) ---</span>
plant_input = clamp(u, u_min, u_max)
e_prev = e
</code></pre></div>

<p class="l-text">Sorun: aktüatör doymuşken <code>I</code> sınırsız büyür. İntegral terimi, kontrolcü yeni bir şeye tepki verebilmeden önce boşaltılması gereken enerjiyi içerir. İki basit anti-windup stratejisi düzeltir.</p>

<h3 style="color:#3b82f6;margin-top:1.4rem">Yöntem 1: Koşullu İntegrasyon (Klampleme)</h3>

<p class="l-text">Aktüatör doyduğunda integratörü dondurun. u zaten u_max'ta sabitlenmişse ve hata hâlâ pozitifse, integralin daha fazla büyümesine izin vermeyin.</p>

<div class="code-wrap"><div class="code-label"><span>SÖZDE KOD</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Koşullu integrasyon anti-windup</span>
e = r - y
u_unsat = Kp * e + Ki * I + Kd * D
u = clamp(u_unsat, u_min, u_max)

<span class="cm"># İntegratörü yalnızca doymuyorsa VEYA integrasyon doyumu kaldıracaksa güncelle</span>
saturated_hi = (u_unsat &gt;= u_max) <span class="kw">and</span> (e &gt; 0)
saturated_lo = (u_unsat &lt;= u_min) <span class="kw">and</span> (e &lt; 0)
<span class="kw">if</span> <span class="kw">not</span> (saturated_hi <span class="kw">or</span> saturated_lo):
    I = I + e * dt
</code></pre></div>

<h3 style="color:#3b82f6;margin-top:1.4rem">Yöntem 2: Geri Hesaplama</h3>

<p class="l-text">(u_unsat - u_saturated) farkından integratöre bir geri besleme yolu ekleyin. İntegratör, ekstra bir "izleme kazancı" K_t tarafından belirlenen bir oranda kendini geri çözer.</p>

<div class="code-wrap"><div class="code-label"><span>SÖZDE KOD</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Geri hesaplama anti-windup</span>
e = r - y
u_unsat = Kp * e + Ki * I + Kd * D
u = clamp(u_unsat, u_min, u_max)

<span class="cm"># İntegratörü u'ya (doymuş değere) yol açacak değere doğru çek</span>
I = I + (Ki * e + Kt * (u - u_unsat)) * dt
<span class="cm"># Kt geri hesaplama kazancı; tipik Kt = 1/Ti veya sqrt(Ki*Kd) — deneysel ayarla</span>
</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Klampleme</div><div class="card-body">Basit, sağlam, yaygın. Yalnızca bir ek koşul. Kontrolcünün çoğu zaman doymadan çalıştığı ve aktüatörü yalnızca ara sıra sınırladığı durumlarda iyi çalışır.</div></div>
<div class="calc-card"><div class="card-title">Geri hesaplama</div><div class="card-body">Daha pürüzsüz kurtarma — integratör donmak yerine sürekli olarak doymamış değere doğru kayar. Kontrolcü sık sık doyuyor ve öngörülebilir davranışa ihtiyacınız varsa daha iyidir.</div></div>
<div class="calc-card"><div class="card-title">Doyumda sıfırlama</div><div class="card-body">En kaba çözüm: aktüatör doyduğunda integratörü sıfırla. Pratikte neredeyse hiç kullanılmaz, çünkü tüm integral bilgisini bir anda kaybeder — fazla agresif.</div></div>
</div>

<div class="calc-graph"><div id="plot-l2-windup-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> aktüatörü u = +/-1'de doyuran büyük bir ayar noktası basamağıyla bir integre edici tesis PID'sinin kapalı çevrim cevabı. Anti-windup olmadan (kırmızı), aktüatör sabitlenmişken integratör dramatik biçimde sarılır; çıkış nihayet ayar noktasını aştığında kontrolcü onun ötesinde sarılmıştır ve cevap kötü aşar, oturmadan önce uzun süre salınır. Klampleme anti-windup ile (mavi), doyum vurulduğunda integratör birikmeyi durdurur, kontrolcü duyarlı kalır ve çıkış ayar noktasına temiz yaklaşır. <em>Fark, herhangi bir tek satır anti-windup kodunun yapacağı en görünür iyileştirmedir.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(useAW){
  var dt=0.01,N=4000;
  var x1=0,x2=0,I=0,prevE=2,y=[],t=[],uHist=[];
  var Kp=1.5,Ki=0.6,Kd=0.5;
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var ref=2;
    var err=ref-x1;
    var dE=(err-prevE)/dt;prevE=err;
    var uUns=Kp*err+Ki*I+Kd*dE;
    var u=Math.max(-1,Math.min(1,uUns));
    if(useAW){
      var hi=uUns>=1&&err>0,lo=uUns<=-1&&err<0;
      if(!(hi||lo))I+=err*dt;
    }else{
      I+=err*dt;
    }
    uHist.push(u);
    var x1d=x2;
    var x2d=-0.5*x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y,u:uHist};
}
var noAW=simulate(false),withAW=simulate(true);
var d1={x:noAW.t,y:noAW.y,mode:'lines',name:'anti-windup yok',line:{color:'#f87171',width:2.6}};
var d2={x:withAW.t,y:withAW.y,mode:'lines',name:'klampleme anti-windup ile',line:{color:'#3b82f6',width:2.6}};
var target={x:[0,40],y:[2,2],mode:'lines',line:{color:'#888',width:1,dash:'dash'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,40]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.5,5]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-windup-tr',[target,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Kural:</strong> her üretim PID'inin bir anti-windup şemasına ihtiyacı vardır. Ucuz termostatlardaki basit kontrolcüler genellikle klampleme kullanır; robotlar ve CNC makinelerindeki yüksek performanslı servo döngüler genellikle dikkatle ayarlanmış K_t ile geri hesaplama kullanır. Kaba sıfırlama yöntemi çoğunlukla bir öğretim örneğidir.</div>

<h2 class="lesson-title">8. Ölçüm Üzerinden Türev (Hata Üzerinden Değil)</h2>

<div class="calc-highlight"><strong>Ayar noktası tekme problemi.</strong> Operatörün ayar noktasını anında r = 0'dan r = 1'e değiştirdiğini varsayın. Hata 0'dan 1'e sıçrar. Türev <code>de/dt</code> matematiksel olarak bir impulstur — t = 0'da sonsuz. Ayrık zamanlı bir kontrolcüde bu, ayar noktası değişiminden sonraki ilk örnekte devasa bir tepe haline gelir. Kontrol sinyali aktüatörü doyurur; sistem sarsılır. Bu, ünlü "türev tekmesidir".</div>

<p class="l-text">Düzeltme yapısaldır ve yarım yüzyıldır standart endüstriyel uygulamadır. Şunu fark edin:</p>

<div class="calc-formula"><div class="formula-label">HATANIN TÜREVİ</div><div class="formula-main">$$\\frac{d\\, e(t)}{d\\, t} = \\frac{d\\, r(t)}{d\\, t} - \\frac{d\\, y(t)}{d\\, t}$$</div><div class="formula-sub">Hatanın türevi, ayar noktasının türevi ile ölçümün türevi arasındaki farktır.</div></div>

<p class="l-text">Düzgün, yavaş değişen bir ayar noktası için <code>dr/dt</code> küçüktür ve iki türev neredeyse eşittir. Ama r'de bir basamak değişimi için <code>dr/dt</code> bir impulstur — ve o impuls aktüatörü tekmeleyendir. Türev teriminin amacı <em>sistem cevabını</em> öngörmek olduğundan, <strong>dr/dt terimini atıp türevi yalnızca ölçümden hesaplayabiliriz</strong>:</p>

<div class="calc-formula"><div class="formula-label">ÖLÇÜM ÜZERİNDEN TÜREVLİ PID</div><div class="formula-main">$$u(t) = K_{p}\\, e(t) + K_{i}\\, \\int_{0}^{t} e(\\tau)\\, d\\tau - K_{d}\\, \\frac{d\\, y(t)}{d\\, t}$$</div><div class="formula-sub">Eksi işaretine dikkat — -dy/dt hesaplıyoruz, bu de/dt'ye yalnızca dr/dt = 0 olduğunda eşittir. Değişim kalıcı çalışma sırasında sessizdir ama ayar noktası basamakları sırasında türev tekmesini öldürür.</div></div>

<div class="calc-graph"><div id="plot-l2-derivkick-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> bir PID'nin t = 5 s'de ayar noktasının 0'dan 1'e ani bir değişimine cevabı. Hata üzerinden D ile (kırmızı), kontrolcü t = 5'te çıkışını devasa biçimde sıçratır — basamağın türevi büyüktür ve aktüatör doyuma çarpar, şiddetli bir aşım üretir. Ölçüm üzerinden D ile (mavi), tepe yok — kontrolcü pürüzsüz bir y(t) görür, pürüzsüz bir u(t) üretir ve çıkış minimum aşımla ayar noktasına ulaşır. <em>Bu tek mimari değişiklik normal çalışma sırasında sessizdir ama ayar noktası değiştiğinde dönüştürücüdür.</em></div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function simulate(dOnMeas){
  var dt=0.01,N=2500;
  var x1=0,x2=0,I=0,prevE=0,prevY=0,y=[],t=[];
  var Kp=2,Ki=0.5,Kd=1.2;
  for(var i=0;i<N;i++){
    var time=i*dt;t.push(time);
    var ref=time<5?0:1;
    var err=ref-x1;
    I+=err*dt;
    var dTerm;
    if(dOnMeas){
      dTerm=-Kd*(x1-prevY)/dt;
    }else{
      dTerm=Kd*(err-prevE)/dt;
    }
    prevE=err;prevY=x1;
    var u=Kp*err+Ki*I+dTerm;
    u=Math.max(-5,Math.min(5,u));
    var x1d=x2;
    var x2d=-x1-x2+u;
    x1+=x1d*dt;
    x2+=x2d*dt;
    y.push(x1);
  }
  return {t:t,y:y};
}
var sErr=simulate(false),sMeas=simulate(true);
var d1={x:sErr.t,y:sErr.y,mode:'lines',name:'hata üzerinden D (tekme!)',line:{color:'#f87171',width:2.6}};
var d2={x:sMeas.t,y:sMeas.y,mode:'lines',name:'ölçüm üzerinden D',line:{color:'#3b82f6',width:2.6}};
var setpt={x:[0,5,5,25],y:[0,0,1,1],mode:'lines',name:'ayar noktası r(t)',line:{color:'#888',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,25]},yaxis:{title:'y(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-0.3,1.8]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l2-derivkick-tr',[setpt,d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Daha genel olarak:</strong> "PI-D" biçimi P ve I'yı hata üzerine, D'yi ise yalnızca ölçüm üzerine koyar. Daha gelişmiş "I-PD" biçimi yalnızca I'yı hata üzerine, P ve D'yi ise ölçüm üzerine koyar — ayar noktası değişimlerinde daha da pürüzsüzdür ama gerçek ayar noktası hareketlerine daha yavaş tepki verir. Doğru yapı, döngünüzün daha çok zamanını değişen referansları izleyerek (servo problemi — P'yi hatada tutun) veya sabit ayar noktasında bozucuları reddederek (regülasyon problemi — P'yi de ölçüme doğru itin) geçirmesine bağlıdır.</div>

<h2 class="lesson-title">9. Mikrodenetleyiciler İçin Ayrık Zamanlı PID</h2>

<div class="calc-highlight"><strong>Mikrodenetleyici sürümü.</strong> Gerçek bir PID sürekli çalışmaz — dijital bir işlemcide her T_s örnek periyodunda bir kez çalışır. İntegral bir toplama, türev sonlu farka dönüşür. Euler yaklaşımı en basit ayrıklaştırmadır ve T_s döngünün zaman sabitinden çok daha küçük olduğu sürece iyi çalışır.</div>

<p class="l-text">İntegrali bir akan toplama ve türevi bir ileri farka çevirin:</p>

<div class="calc-formula"><div class="formula-label">AYRIK ZAMANLI PID (KONUM BİÇİMİ, EULER)</div><div class="formula-main">$$u_{k} = K_{p}\\, e_{k} + K_{i}\\, T_{s}\\, \\sum_{j=0}^{k} e_{j} + K_{d}\\, \\frac{e_{k} - e_{k-1}}{T_{s}}$$</div><div class="formula-sub">k ayrık zaman indeksidir. T_s örnek periyodudur. Çağrılar arasında integral toplamı ve önceki hata durum olarak saklanmalıdır.</div></div>

<p class="l-text">Daha bellek verimli bir uygulama, bir örnekten diğerine u'daki değişimle çalışan <strong>artımsal (hız) biçimidir</strong>:</p>

<div class="calc-formula"><div class="formula-label">AYRIK ZAMANLI PID (HIZ/ARTIMSAL BİÇİM)</div><div class="formula-main">$$\\Delta u_{k} = K_{p}(e_{k} - e_{k-1}) + K_{i}\\, T_{s}\\, e_{k} + K_{d}\\, \\frac{e_{k} - 2\\, e_{k-1} + e_{k-2}}{T_{s}}$$</div><div class="formula-sub">u_k = u_{k-1} + Delta u_k. Açık integral durumu gerekmez — integrasyon önceki u'da saklıdır. Manuel ve otomatik modlar arasında geçişte tümseksizdir.</div></div>

<div class="code-wrap"><div class="code-label"><span>C (BARE-METAL DOSTU)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">typedef</span> <span class="kw">struct</span> {
    <span class="kw">float</span> Kp, Ki, Kd;
    <span class="kw">float</span> Ts;             <span class="cm">// saniye cinsinden örnek periyodu</span>
    <span class="kw">float</span> u_min, u_max;   <span class="cm">// aktüatör limitleri</span>
    <span class="kw">float</span> integ;          <span class="cm">// integral durumu</span>
    <span class="kw">float</span> y_prev;         <span class="cm">// önceki ölçüm (ölçüm üzerinden D)</span>
} pid_t;

<span class="kw">float</span> <span class="fn">pid_step</span>(pid_t *p, <span class="kw">float</span> r, <span class="kw">float</span> y) {
    <span class="kw">float</span> e = r - y;
    <span class="kw">float</span> u_p = p->Kp * e;
    <span class="kw">float</span> u_d = -p->Kd * (y - p->y_prev) / p->Ts;   <span class="cm">// ölçüm üzerinden D</span>
    <span class="kw">float</span> u_unsat = u_p + p->Ki * p->integ + u_d;
    <span class="kw">float</span> u = u_unsat;
    <span class="kw">if</span> (u > p->u_max) u = p->u_max;
    <span class="kw">if</span> (u < p->u_min) u = p->u_min;
    <span class="cm">// Koşullu integrasyon anti-windup</span>
    <span class="kw">int</span> sat_hi = (u_unsat >= p->u_max) && (e > 0);
    <span class="kw">int</span> sat_lo = (u_unsat <= p->u_min) && (e < 0);
    <span class="kw">if</span> (!(sat_hi || sat_lo)) p->integ += e * p->Ts;
    p->y_prev = y;
    <span class="kw">return</span> u;
}
</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Örnek periyodu T_s</div><div class="card-body">T_s'yi baskın tesis zaman sabiti tau'dan 10-20 kat daha hızlı seçin. tau = 1 s termal döngü için T_s = 50-100 ms uygundur. 1 kHz servo döngü için T_s = 50-100 mikrosaniye. Çok yavaşsa ayrıklaştırma takma adlandırır; çok hızlıysa CPU israfı.</div></div>
<div class="calc-card"><div class="card-title">Float kullanın, double değil</div><div class="card-body">Gömülü işlemcilerde çoğu zaman donanımsal çift duyarlık yoktur. Float (32-bit) PID için fazlasıyla yeter — kazançlar ve durumlardaki nicemleme gürültüsü, sensör gürültüsünün çok altındadır.</div></div>
<div class="calc-card"><div class="card-title">Türevi filtreleyin</div><div class="card-body">Türev girişine tek bir birinci mertebe alçak geçiren (omega = N/T_d, N=10'da köşeli 1-kutuplu IIR filtre) hemen her zaman karşılığını verir. Bu olmadan sensör gürültüsünü doğrudan aktüatöre büyütürsünüz.</div></div>
<div class="calc-card"><div class="card-title">Tamsayı taşmasına dikkat</div><div class="card-body">Küçük bir MCU'da sabit-noktalı aritmetik kullanmak zorundaysanız, integral durumu, kontrolcü aktüatörü doymadan çok önce değişken tipini doyurabilir. u'yu değil integral durumunu kelepçeleyin.</div></div>
</div>

<div class="l-note"><strong>Tümseksiz transfer</strong>, manuel mod (operatör u'yu doğrudan sürer) ile otomatik mod (PID u'yu sürer) arasında geçişin sıçramasız olması sorunudur. Hız biçimi ile bu bedavadır — geçişte Delta u = 0, inşa gereği. Konum biçimiyle integratörü mevcut u ve mevcut e ile tutarlı bir değere başlatmanız gerekir, bu da uğraştırıcıdır. Modern kontrolcülerin çoğu bu tek sebepten hız biçimini kullanır.</div>

<h2 class="lesson-title">10. Yapay Zekâ Perspektifi: PID Ne Zaman Yeter, RL Ne Zaman Gerekir?</h2>

<div class="calc-highlight"><strong>Sıkıcı gerçek:</strong> tek-girişli tek-çıkışlı (SISO) regülasyon problemlerinin büyük çoğunluğu için, iyi ayarlanmış bir PID, herhangi bir öğrenilmiş kontrolcüden daha hızlı kurulur, daha kolay hata ayıklanır, daha basit sertifikalandırılır ve daha ucuza bakımı yapılır. Modern pekiştirmeli öğrenmeyi her probleme fırlatma cazibesi gerçektir, ama PID'in seksen yıllık saha geçmişinin bir nedeni vardır. Peki RL ne zaman gerçekten gerekçelidir?</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PID kazanır</div><div class="card-body">SISO döngüler. Çalışma bölgesinde yaklaşık doğrusal tesis. Bozucular stokastik ama sınırlı. Kötü bir geçicinin maliyeti ılımlı. Operatörler döngüyü "ayarlayabilmeyi" bekler. Örnekler: süreç kontrolü, termostatlar, motor hız döngüleri, servo konumlama.</div></div>
<div class="calc-card"><div class="card-title">Genişletilmiş PID (kazanç planlaması)</div><div class="card-body">Tesis hafif doğrusal değilse, çalışma noktasına göre önceden ayarlanmış birden çok PID parametre seti arasında geçiş yapın. Uçuş kontrolünde ve motor yönetiminde yaygındır. Altında hâlâ PID.</div></div>
<div class="calc-card"><div class="card-title">Model Predictive Control (MPC)</div><div class="card-body">Birden çok bağlaşık değişkeniniz, sıkı kısıtlamalarınız (örn. "bu sıcaklık asla 350 derece aşmamalı") ve makul doğrulukta bir tesis modeliniz olduğunda. Her adımda küçük bir optimizasyon çözer. Kimyada, rafinaide ve giderek otonom sürüşte standart.</div></div>
<div class="calc-card"><div class="card-title">Pekiştirmeli Öğrenme</div><div class="card-body">Tesis ciddi doğrusal değilse, model bilinmiyor veya yazmak zorsa ve sistemi milyonlarca kez simüle (veya deneyebilirseniz). RL, Atari oyunları ve robot manipülasyonunda hüküm sürmüştür; klasik kontrolün hedefi ifade etmekte zorlandığı görevler için anlam taşır (örn. bacaklı lokomosyon, sıvı karışımı, otonom yarış).</div></div>
</div>

<p class="l-text">Daha nüanslı bir cevap: iki yaklaşım düşman olmak zorunda değil. <strong>Artık öğrenme</strong> üretken bir karışımdır — el yapımı bir PID kontrolün çoğunu yapsın ve PID'nin başa çıkamadığı doğrusal-olmamayı ele alan küçük bir artık düzeltme eklemesi için bir RL ajanı eğitin. Bu şekilde PID'nin güvenlik, basitlik ve açıklanabilirliğini korur, öğrenilen bileşenin kitap formüllerinin atladığı şeyi ele almasına izin verirsiniz. Son zamanlardaki quadrotor ve bipedal-robot çalışmaları tam olarak bu deseni kullanıyor.</p>

<div class="l-note"><strong>Model modasının mühendislik tercihini sürüklemesine izin vermeyin.</strong> Bir quadrotor'un tutum döngüsündeki bir PID, kararlılık ve en kötü durum davranışı için her zaman — kısıtlanmamış bir politika ağından daha iyi performans gösterir. RL, yığının daha üst seviyelerine aittir: yörünge planlaması, yürüyüş anahtarlama, temas dizilemesi. PID'yi iyi olduğu yerde tutun. Daha gösterişli araçlara yalnızca karşınızdaki döngü gerçekten talep ettiğinde uzanın.</div>

<h2 class="lesson-title">11. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Önerilen deneyler.</strong> K_i = 0 ayarlayın ve kalıcı hatanın yeniden ortaya çıkmasını izleyin — o %17 sapma tam olarak <code>1/(1 + K_p G(0)) = 1/(1+2) = 0,33</code>... durun, tesis kazancı G(0) = 1, dolayısıyla hata 1/3. Şimdi K_p = 8, K_i = 0 ayarlayın — döngünün nihai kazancına yaklaşan ağır bir salınım göreceksiniz. Ziegler-Nichols çalıştırın: döngünün sürekli salındığı K_p'yi bulun, periyodu ölçün, tabloya takın ve varsayılan kazançlarla karşılaştırın. <code>USE_ANTIWINDUP = False</code> ayarlayıp K_i'yi yükseltin — doyum kaynaklı aşımı doğrudan göreceksiniz. Her beş saniyelik deney, on bir bölümden birini deneyimle öğretir.</p>

<h2 class="lesson-title">Özet</h2>

<p class="l-text">Bir PID kontrolcü, hata <code>e = r - y</code>'yi alır ve aktüatör sinyali <code>u = K_p e + K_i integral e + K_d de/dt</code>'yi üretir. Oransal terim hızlı cevap verir ama tip-0 tesislerde her zaman bir kalıcı sapma bırakır; integral terim, hata yok olana kadar biriktirerek o sapmayı siler — yavaş cevap ve daha fazla aşım pahasına; türev terim hatanın eğimine tepki vererek öngörüde bulunur, aşımı azaltır ama gürültüyü büyütür. Ziegler-Nichols (kapalı çevrim) ve Cohen-Coon (açık çevrim FOPDT), minimal deneylerle ilk-tahmin ayar kuralları verir. Gerçek uygulamalar kitap formüllerinin atladığı üç kritik düzeltmeye ihtiyaç duyar: integratör doyumu koşullu integrasyon veya geri hesaplamayla çözülür; ayar noktası değişimlerindeki türev-tekme türevi hata yerine ölçümden alarak çözülür; D terimindeki yüksek frekans gürültüsü türev girişinde bir alçak geçiren filtreyle çözülür. Bir mikrodenetleyici için ayrık zamanlı PID yirmi satır C kodudur, bir mikrosaniyeden az sürede çalışır ve kuracağınız her gömülü otomasyon döngüsünün iş atıdır. RL'ye yalnızca PID gerçekten başarısız olduğunda — ve o zaman bile PID'nin iç döngüyü, öğrenmenin dış döngüyü ele almasını düşünerek — uzanın.</p>
`

};
