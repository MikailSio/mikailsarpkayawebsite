window.DIFFEQ_L1 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Derivative Definition</a> <span style="opacity:0.55;font-size:0.82em">(Math L17)</span></li>
<li><a href="/tutorials/matematik/22" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">First-Derivative Test</a> <span style="opacity:0.55;font-size:0.82em">(Math L22)</span></li>
<li><a href="/tutorials/matematik/27" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Antiderivative</a> <span style="opacity:0.55;font-size:0.82em">(Math L27)</span></li>
<li><a href="/tutorials/matematik/28" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Integration Techniques</a> <span style="opacity:0.55;font-size:0.82em">(Math L28)</span></li>
</ul>
</div>
<p class="l-text"><strong>A differential equation is a sentence about change.</strong> Instead of telling you what something <em>is</em>, it tells you how that something <em>changes</em>, and asks you to recover the underlying quantity from its own rate of change. Almost every physical law worth knowing — Newton's second law, Kirchhoff's circuit laws, radioactive decay, Newton's law of cooling, the logistic growth of bacteria — was first written as a differential equation. Solving these equations is how engineers predict what happens at <em>t = 1 second from now</em> given what is happening <em>right now</em>.</p>

<p class="l-text">This first lesson stays in classical territory: first-order ordinary differential equations and the four hand-techniques that crack most of them — separable equations, exact equations, the integrating factor for linear ODEs, and direction fields. We move slowly, with every step shown, and every example anchored to a physical system you can picture: a cooling coffee cup, a charging capacitor, a population in a finite habitat. AI and machine-learning applications of differential equations are deep and beautiful, but they belong to later lessons (SDEs and diffusion models in L6, Neural ODEs in L8). Here, we earn the right to play with them by mastering the classical foundation first.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define ordinary differential equations, classify them by order and linearity, and read an IVP (initial value problem) precisely</li>
<li>Interpret a first-order ODE geometrically as a slope field, and trace solution curves by following the arrows</li>
<li>Solve separable equations by integrating both sides, with full attention to constants and domain restrictions</li>
<li>Solve linear first-order ODEs using the integrating factor <em>μ(x) = exp(∫p dx)</em>, and recognise when a problem is linear</li>
<li>Recognise exact equations by the symmetry test <em>∂M/∂y = ∂N/∂x</em> and reconstruct the potential function <em>F(x, y)</em></li>
<li>Apply the four techniques to real engineering problems — Newton's cooling, RC charging, logistic population — and interpret the solutions physically</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Differential Equation?</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine a thermometer pressed against a freshly poured coffee. You do not yet know the temperature at every future moment. But you do know one local fact: <em>at any instant, the coffee cools at a rate proportional to how much hotter it is than the surrounding air.</em> That one sentence about <em>rate</em> is a differential equation. Solving it means reconstructing the entire cooling curve from that single local rule.</div>

<p class="l-text">A <strong>differential equation</strong> is an equation that involves an unknown function together with one or more of its derivatives. In symbols:</p>

<div class="calc-formula"><div class="formula-label">A FIRST-ORDER ODE</div><div class="formula-main">$$\\frac{dy}{dx} = f(x, y)$$</div><div class="formula-sub">Read: "the derivative of the unknown function y with respect to x equals some expression in x and y." Our job is to find y(x).</div></div>

<p class="l-text">Two distinctions matter from the very first day:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ODE vs PDE</div><div class="card-body">An <strong>ordinary</strong> differential equation has derivatives with respect to a <em>single</em> independent variable (usually time t or position x). A <strong>partial</strong> differential equation has derivatives with respect to two or more (e.g. the heat equation in x and t). This lesson is pure ODE.</div></div>
<div class="calc-card"><div class="card-title">Order</div><div class="card-body">The <em>order</em> is the highest derivative that appears. y' = -ky is first-order; y'' + ω²y = 0 is second-order; in general, an n-th order equation needs n integrations and n initial conditions.</div></div>
<div class="calc-card"><div class="card-title">Linearity</div><div class="card-body">A <strong>linear</strong> ODE has y and its derivatives appearing only to the first power and never multiplied together. y' + p(x)y = q(x) is linear; y' = y² is not (the y² is nonlinear). Linear ODEs have a complete general theory; nonlinear ones often do not.</div></div>
<div class="calc-card"><div class="card-title">IVP (Initial Value Problem)</div><div class="card-body">A differential equation alone has infinitely many solutions (a family parameterised by integration constants). Pinning one specific solution down requires an <em>initial condition</em> such as y(0) = 5. ODE + initial condition = IVP.</div></div>
</div>

<p class="l-text"><strong>Why solving matters.</strong> A differential equation is a <em>law</em>; its solution is the <em>history</em>. Newton wrote F = ma, which is really a second-order ODE for position. Solving it for a falling apple gives you the apple's position at every future second. The same pattern repeats in every engineering domain: the law is local (a rule about rate of change at one instant), the prediction is global (the entire future trajectory).</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — CLASSIFYING ODEs</div><div class="example-body">Classify each:<br><br>(a) <em>dy/dx = 3x²</em>  →  first-order, linear, trivially separable.<br>(b) <em>y'' + 4y = 0</em>  →  second-order, linear (the harmonic oscillator).<br>(c) <em>y' = y(1 − y)</em>  →  first-order, <strong>nonlinear</strong> (because of y², the logistic equation).<br>(d) <em>∂u/∂t = ∂²u/∂x²</em>  →  this is a <strong>PDE</strong> (heat equation), not an ODE — outside today's scope.<br>(e) <em>(y')² + y = x</em>  →  first-order, <strong>nonlinear</strong> (the derivative is squared).</div></div>

<div class="l-note"><strong>Historical note.</strong> Newton solved his first ODE (for the cooling of a small body) before he was thirty; Leibniz developed the modern dx/dy notation; Bernoulli, Euler, and Lagrange built the machinery you are about to learn over the next 150 years. By the time Maxwell wrote his equations in 1865, differential equations were the universal language of physics. They have stayed that way ever since.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">In one sentence: a differential equation says "<em>here is the rule for how y changes</em>"; the solution recovers y itself. If that frame is clear, the rest of the lesson is mechanics.</div></div>

<h2 class="lesson-title">2. First-Order ODE: General Form and Slope Fields</h2>

<div class="calc-highlight"><strong>Geometric reading.</strong> The equation <em>dy/dx = f(x, y)</em> is, at every point (x, y) in the plane, an instruction: "if a solution curve passes through this point, it must have slope f(x, y) here." Imagine drawing a tiny arrow with that slope at every point of the plane. The result is a <strong>slope field</strong> (or direction field), and any solution curve is simply a curve that everywhere follows the local arrows. The ODE shows you the wind; the solution traces a leaf carried by it.</div>

<p class="l-text">The general first-order ODE is:</p>

<div class="calc-formula"><div class="formula-label">FIRST-ORDER ODE AND ITS IVP</div><div class="formula-main">$$\\frac{dy}{dx} = f(x, y), \\qquad y(x_0) = y_0$$</div><div class="formula-sub">Without the initial condition there are infinitely many solutions, one for each starting point. Adding y(x₀) = y₀ pins one curve out of the family.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Slope at a point</div><div class="card-body">Plug (x, y) into f. The number you get is the slope a solution curve must have if it happens to pass through that point. Plot a short line segment with that slope. Repeat on a grid.</div></div>
<div class="calc-card"><div class="card-title">Solution curve</div><div class="card-body">A function y(x) whose graph is everywhere tangent to the local slope arrow. Different initial conditions y(x₀) = y₀ pick out different curves from the same field.</div></div>
<div class="calc-card"><div class="card-title">Existence &amp; uniqueness</div><div class="card-body">Under mild smoothness conditions on f (Lipschitz in y) exactly <em>one</em> solution curve passes through each starting point. We make this precise in section 9.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-slope-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the slope field of <em>dy/dx = −y/x</em> on a grid. At each (x, y) a short blue segment is drawn with slope −y/x; together they show the local "wind" of the ODE. Three solution curves are overlaid for initial conditions y(1) = 1, y(1) = 2, y(1) = −1. Each curve is a hyperbola y = C/x (with C = 1, 2, and −1 respectively) — exactly the family we derive analytically in the next section.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];var seg=0.18;
for(var i=-4;i<=4;i++){for(var j=-4;j<=4;j++){if(i===0)continue;var x=i*0.6+0.05;var y=j*0.6;var s=-y/x;var L=Math.sqrt(1+s*s);var dx=seg/L;var dy=s*seg/L;traces.push({x:[x-dx,x+dx],y:[y-dy,y+dy],mode:'lines',line:{color:'rgba(59,130,246,0.55)',width:1.2},showlegend:false,hoverinfo:'skip'});}}
var xc1=[],yc1=[],xc2=[],yc2=[],xc3=[],yc3=[];
for(var k=0;k<=200;k++){var x=0.25+k*0.0185;xc1.push(x);yc1.push(1/x);xc2.push(x);yc2.push(2/x);xc3.push(x);yc3.push(-1/x);}
traces.push({x:xc1,y:yc1,mode:'lines',name:'y(1)=1: y = 1/x',line:{color:'#f59e0b',width:2.6}});
traces.push({x:xc2,y:yc2,mode:'lines',name:'y(1)=2: y = 2/x',line:{color:'#10b981',width:2.6}});
traces.push({x:xc3,y:yc3,mode:'lines',name:'y(1)=−1: y = −1/x',line:{color:'#ef4444',width:2.6,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-slope-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — READING A SLOPE FIELD</div><div class="example-body">Consider <em>dy/dx = x − y</em>. At (0, 0): slope is 0 − 0 = 0 (horizontal). At (1, 0): slope = 1 (up at 45°). At (0, 1): slope = −1 (down at 45°). The line y = x − 1 has constant slope 1 everywhere along itself; you can check that on this line dy/dx = 1 and x − y = 1, so the line <em>is</em> a solution. Slope fields let you spot such special solutions visually before solving anything.</div></div>

<div class="l-note"><strong>Why bother with the picture?</strong> Most real ODEs do not have closed-form solutions. The slope field still lets you sketch the qualitative behaviour: where solutions grow, where they decay, where they approach equilibria. This <em>qualitative theory</em> — pioneered by Poincaré at the end of the 19th century — is the gateway to dynamical systems and chaos.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If you can mentally place an arrow at any (x, y) for a given f, you can sketch the qualitative behaviour of solutions without writing a single integral. Try it on dy/dx = −y: at every (x, y > 0) the slope is negative (curves fall), at y < 0 the slope is positive (curves rise), and y = 0 is an equilibrium.</div></div>

<h2 class="lesson-title">3. Separable Equations</h2>

<div class="calc-highlight"><strong>The cleanest type of first-order ODE.</strong> When the right-hand side splits as a function of x times a function of y, <em>f(x, y) = g(x) · h(y)</em>, the variables can be physically separated to opposite sides of the equals sign and integrated independently. Half the engineering problems you will meet in this lesson — Newton's cooling, radioactive decay, logistic growth — are separable. Master this technique and you can solve a huge fraction of practical ODEs.</div>

<div class="calc-formula"><div class="formula-label">SEPARABLE FORM</div><div class="formula-main">$$\\frac{dy}{dx} = g(x) \\cdot h(y) \\;\\;\\Longrightarrow\\;\\; \\frac{dy}{h(y)} = g(x)\\, dx$$</div><div class="formula-sub">Move every y to the left, every x to the right, then integrate both sides.</div></div>

<p class="l-text">Step by step:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Check that f factors as g(x)·h(y)</div><div class="step-detail">Not every ODE is separable. dy/dx = x + y is <em>not</em> (a sum, not a product). dy/dx = xy <em>is</em> (product of g(x) = x and h(y) = y).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Separate variables algebraically</div><div class="step-detail">Treat dy/dx as a ratio (this is rigorous here, even though dy and dx are not numbers — the manipulation is justified by the chain rule). Write dy/h(y) = g(x) dx.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Integrate both sides independently</div><div class="step-detail">∫ dy/h(y) = ∫ g(x) dx + C. The constant C absorbs both sides' constants of integration into one.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Solve algebraically for y if possible</div><div class="step-detail">Sometimes you can isolate y explicitly; sometimes you can only leave the answer in implicit form. Both are valid "solutions."</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Apply the initial condition to fix C</div><div class="step-detail">Substitute y(x₀) = y₀ into the general solution to solve for the integration constant.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SOLVING dy/dx = −y/x</div><div class="example-body"><strong>Setup.</strong> The right-hand side factors as g(x)·h(y) with g(x) = −1/x and h(y) = y, so the equation is separable.<br><br><strong>Step 1.</strong> Separate: $$\\frac{dy}{y} = -\\frac{dx}{x}$$<br><strong>Step 2.</strong> Integrate: $$\\ln|y| = -\\ln|x| + C_1$$<br><strong>Step 3.</strong> Exponentiate: $$|y| = e^{C_1} \\cdot \\frac{1}{|x|}$$<br><strong>Step 4.</strong> Absorbing the sign and the constant into C = ±e^{C₁} (any nonzero real): $$\\boxed{\\,y = \\frac{C}{x}\\,}$$<br><br><strong>Step 5 (apply IC).</strong> If y(1) = 2 then 2 = C/1, so C = 2 and y = 2/x. Compare with the green curve in section 2's slope field — same hyperbola.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RADIOACTIVE DECAY</div><div class="example-body">A radioactive sample decays at a rate proportional to the amount present:<br><br>$$\\frac{dN}{dt} = -\\lambda N, \\qquad N(0) = N_0$$<br><br>Separate: dN/N = −λ dt. Integrate: ln N = −λt + C. Exponentiate and apply IC: <br><br>$$N(t) = N_0 \\, e^{-\\lambda t}$$<br><br>The famous exponential decay law. The <strong>half-life</strong> is the time for N to fall to N₀/2: t₁/₂ = (ln 2)/λ. For carbon-14, λ ≈ 1.21 × 10⁻⁴ /year, giving t₁/₂ ≈ 5730 years — the basis of radiocarbon dating.</div></div>

<div class="l-note"><strong>Subtlety: dividing by zero.</strong> When we wrote dy/y, we implicitly assumed y ≠ 0. The constant solution y(x) ≡ 0 is also a solution (check: dy/dx = 0 and −y/x = 0), often called the <em>singular solution</em>. Always check for solutions lost during separation.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If you can spot at a glance that <em>dy/dx = y · sin(x)</em> is separable, you are ready for section 4. (Hint: g(x) = sin x, h(y) = y, separate to dy/y = sin x dx.)</div></div>

<h2 class="lesson-title">4. Worked Example: Newton's Law of Cooling</h2>

<div class="calc-highlight"><strong>The classical application of a separable ODE.</strong> A hot body cools (or a cold body warms) at a rate proportional to the temperature difference between the body and its surroundings. Coffee, soup, a freshly forged piece of iron, a corpse used to estimate time of death — all obey the same simple law. We derive the full cooling curve from scratch.</div>

<div class="calc-formula"><div class="formula-label">NEWTON'S LAW OF COOLING</div><div class="formula-main">$$\\frac{dT}{dt} = -k\\,(T - T_{\\text{env}})$$</div><div class="formula-sub">T(t) is the body's temperature, T_env is the ambient (room) temperature, and k > 0 is a heat-transfer constant depending on the body and the medium.</div></div>

<p class="l-text"><strong>Sign check.</strong> If the body is hotter than the room (T > T_env) then the right-hand side is negative, so T decreases — the body cools. If the body is colder (T < T_env) the right-hand side is positive, so T rises toward the ambient. Equilibrium at T = T_env (dT/dt = 0). All the physics is already encoded in the sign of the right-hand side.</p>

<p class="l-text"><strong>Step-by-step solution.</strong></p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Substitute u = T − T_env to clean up the right-hand side</div><div class="step-detail">Then du/dt = dT/dt and the equation becomes du/dt = −k·u. A textbook separable ODE in u.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Separate and integrate</div><div class="step-detail">du/u = −k dt  ⇒  ln|u| = −kt + C₁  ⇒  u = C · e^{−kt}.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Undo the substitution</div><div class="step-detail">T − T_env = C·e^{−kt}, so T(t) = T_env + C·e^{−kt}.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Apply the initial condition T(0) = T₀</div><div class="step-detail">T₀ = T_env + C, so C = T₀ − T_env.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">SOLUTION TO NEWTON'S COOLING</div><div class="formula-main">$$T(t) = T_{\\text{env}} + (T_0 - T_{\\text{env}}) \\, e^{-k t}$$</div><div class="formula-sub">Starts at T₀, decays exponentially toward T_env with time constant τ = 1/k.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A CUP OF COFFEE</div><div class="example-body">A cup of coffee at T₀ = 90 °C sits in a room at T_env = 20 °C. After 5 minutes the coffee has cooled to 60 °C. What is k? And when will it reach 30 °C?<br><br><strong>Find k.</strong> At t = 5: 60 = 20 + 70·e^{−5k}, so e^{−5k} = 40/70 = 4/7. Take the log: −5k = ln(4/7) ≈ −0.559, giving <strong>k ≈ 0.112 / min</strong>.<br><br><strong>Time to 30 °C.</strong> 30 = 20 + 70·e^{−kt}, so e^{−kt} = 10/70 = 1/7. Then t = −ln(1/7)/k = ln 7 / 0.112 ≈ <strong>17.4 min</strong>.<br><br>The cup needs about 17 minutes after pouring to reach 30 °C. The time constant τ = 1/k ≈ 8.9 min is the characteristic time scale: after one τ the temperature gap has shrunk to ~37% of its original value.</div></div>

<div class="calc-graph"><div id="plot-l1-cooling-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three cooling curves for a coffee that starts at 90 °C, plotted in rooms of 5 °C, 20 °C, and 30 °C respectively (k = 0.112 / min for all three). Each curve decays exponentially toward its own ambient temperature, and all three approach their asymptote tangent-to-horizontal. The same physics produces three different equilibria because the ODE knows about T_env through the (T − T_env) term.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=60;i++)t.push(i*0.5);
var envs=[5,20,30];var colors=['#3b82f6','#f59e0b','#10b981'];var traces=[];
for(var e=0;e<envs.length;e++){var Te=envs[e];var y=[];for(var i=0;i<t.length;i++){y.push(Te+(90-Te)*Math.exp(-0.112*t[i]));}
traces.push({x:t,y:y,mode:'lines',name:'T_env = '+Te+' °C',line:{color:colors[e],width:2.4}});
traces.push({x:[0,30],y:[Te,Te],mode:'lines',line:{color:colors[e],width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (min)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'T (°C)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,95]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-cooling-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Forensic note.</strong> Newton's cooling is the basis of one classical method for estimating time of death: measure the body's current temperature, assume it started at 37 °C, fit k from ambient conditions, then solve backward in time. Real forensics adds corrections for clothing, body mass, and post-mortem chemistry, but the skeleton is exactly this ODE.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">As t → ∞ the exponential e^{−kt} → 0, so T(t) → T_env. The temperature approaches the room temperature but never quite reaches it (in the mathematical idealisation). In practice, after about 5τ the difference is below 1% and you can stop worrying.</div></div>

<h2 class="lesson-title">5. Exact Equations</h2>

<div class="calc-highlight"><strong>An ODE in disguise as a total derivative.</strong> Some first-order equations can be written as the total derivative of some hidden function F(x, y) being zero. If you can find that hidden F, the solution is just F(x, y) = C. This technique handles a class of ODEs that are <em>not</em> separable but still have a clean closed-form solution.</div>

<p class="l-text">Write the ODE in differential form (instead of as dy/dx):</p>

<div class="calc-formula"><div class="formula-label">DIFFERENTIAL FORM</div><div class="formula-main">$$M(x, y)\\, dx + N(x, y)\\, dy = 0$$</div><div class="formula-sub">Any first-order ODE dy/dx = −M/N can be rewritten this way.</div></div>

<p class="l-text">The equation is called <strong>exact</strong> when the left-hand side is the total differential <em>dF</em> of some scalar function F(x, y). Recall that</p>

<div class="calc-formula"><div class="formula-label">TOTAL DIFFERENTIAL</div><div class="formula-main">$$dF = \\frac{\\partial F}{\\partial x}\\, dx + \\frac{\\partial F}{\\partial y}\\, dy$$</div><div class="formula-sub">So an exact equation is just dF = 0, whose solution is F(x, y) = C.</div></div>

<p class="l-text">Matching coefficients, exactness requires ∂F/∂x = M and ∂F/∂y = N. By the equality of mixed partials (Clairaut's theorem) this gives the famous test:</p>

<div class="calc-formula"><div class="formula-label">EXACTNESS TEST</div><div class="formula-main">$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$</div><div class="formula-sub">If this equality holds, the equation is exact and a potential F exists.</div></div>

<p class="l-text"><strong>Reconstruction recipe</strong>:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Verify ∂M/∂y = ∂N/∂x</div><div class="step-detail">Without this, the equation is not exact and the rest of the recipe fails. (Sometimes you can multiply by an integrating factor to make it exact — but that is exactly the trick of section 6 in linear form.)</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Integrate ∂F/∂x = M with respect to x</div><div class="step-detail">F(x, y) = ∫ M dx + g(y). The "constant" of integration depends on y because we held y fixed during the x-integration.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Differentiate F with respect to y and match with N</div><div class="step-detail">∂F/∂y = (∂/∂y)∫M dx + g'(y) must equal N. Solve for g'(y), then integrate to find g(y).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Write the solution implicitly as F(x, y) = C</div><div class="step-detail">Solve for y explicitly if you can; leave it implicit if you cannot.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — AN EXACT EQUATION</div><div class="example-body">Solve <em>(2xy + 3)dx + (x² − 4)dy = 0</em>.<br><br><strong>Step 1.</strong> M = 2xy + 3, N = x² − 4. Check exactness: ∂M/∂y = 2x and ∂N/∂x = 2x. Equal — exact. ✓<br><br><strong>Step 2.</strong> Integrate M with respect to x:<br>F = ∫(2xy + 3) dx = x²y + 3x + g(y).<br><br><strong>Step 3.</strong> Differentiate F with respect to y:<br>∂F/∂y = x² + g'(y). Set this equal to N = x² − 4:<br>g'(y) = −4  ⇒  g(y) = −4y (constant absorbed into C later).<br><br><strong>Step 4.</strong> Write the solution: <strong>F(x, y) = x²y + 3x − 4y = C</strong>.<br><br>If we want an explicit form, solve for y: y(x² − 4) = C − 3x, so y = (C − 3x)/(x² − 4) for x ≠ ±2.</div></div>

<div class="l-note"><strong>Geometric reading.</strong> An exact equation is the level-curve equation of some surface z = F(x, y). The solutions are the contour lines. Walking along a contour, F does not change — exactly what F = C means.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">When ∂M/∂y ≠ ∂N/∂x, the equation is <em>not</em> exact and this recipe fails. But often there is an integrating factor μ(x, y) that makes μM dx + μN dy exact. Finding μ in general is hard; for linear ODEs (section 6) there is a universal formula.</div></div>

<h2 class="lesson-title">6. Linear First-Order ODE &amp; Integrating Factor</h2>

<div class="calc-highlight"><strong>The universal technique for linear first-order ODEs.</strong> If your equation has the form <em>y' + p(x) y = q(x)</em> — with y and y' each appearing only to the first power — there is one method that always works, no creativity required. Multiply both sides by a carefully chosen function μ(x), called the integrating factor, and the entire left-hand side collapses into the derivative of a product. Then a single integral finishes the job.</div>

<div class="calc-formula"><div class="formula-label">STANDARD FORM OF A LINEAR FIRST-ORDER ODE</div><div class="formula-main">$$y' + p(x)\\, y = q(x)$$</div><div class="formula-sub">If your equation is not yet in this form, divide through by whatever multiplies y' until the y' coefficient is 1.</div></div>

<p class="l-text"><strong>The trick.</strong> Multiply both sides by a function μ(x):</p>

<div class="calc-formula"><div class="formula-label">AFTER MULTIPLYING BY μ</div><div class="formula-main">$$\\mu(x)\\, y' + \\mu(x)\\, p(x)\\, y = \\mu(x)\\, q(x)$$</div><div class="formula-sub">We want the left-hand side to be the derivative of μ·y. By the product rule, (μy)' = μ'y + μy'.</div></div>

<p class="l-text">For μy' + μp·y to equal (μy)' = μ'y + μy', we need μ' = μp, that is:</p>

<div class="calc-formula"><div class="formula-label">INTEGRATING FACTOR</div><div class="formula-main">$$\\mu(x) = \\exp\\!\\left(\\int p(x)\\, dx\\right)$$</div><div class="formula-sub">A separable ODE for μ itself, solved by direct integration.</div></div>

<p class="l-text"><strong>Once μ is found</strong>, the linear ODE collapses to:</p>

<div class="calc-formula"><div class="formula-label">SOLUTION RECIPE</div><div class="formula-main">$$(\\mu \\, y)' = \\mu \\, q  \\;\\;\\Longrightarrow\\;\\;  y(x) = \\frac{1}{\\mu(x)}\\left[\\int \\mu(x)\\, q(x)\\, dx + C\\right]$$</div><div class="formula-sub">Integrate μq, divide by μ, add an integration constant determined by the IC.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Put the ODE in standard form y' + p(x)y = q(x)</div><div class="step-detail">Divide through if needed; identify p and q.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Compute μ(x) = exp(∫p dx)</div><div class="step-detail">Drop the integration constant for p (it would just multiply μ by a constant, which cancels out).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Multiply through and recognise (μy)' on the left</div><div class="step-detail">Verify by expanding (μy)' = μ'y + μy' if you want to be sure.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Integrate both sides</div><div class="step-detail">μy = ∫μq dx + C. Divide by μ to isolate y.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Apply the initial condition</div><div class="step-detail">Plug y(x₀) = y₀ into the general solution to fix C.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SOLVING y' + 2y = e^{−x}</div><div class="example-body"><strong>Step 1.</strong> Already in standard form: p(x) = 2, q(x) = e^{−x}.<br><br><strong>Step 2.</strong> μ(x) = exp(∫2 dx) = e^{2x}.<br><br><strong>Step 3.</strong> Multiply: e^{2x}·y' + 2e^{2x}·y = e^{2x}·e^{−x} = e^{x}. The left-hand side is exactly (e^{2x}·y)' (check by product rule). So<br>$$\\big(e^{2x} y\\big)' = e^{x}.$$<br><strong>Step 4.</strong> Integrate both sides: e^{2x}·y = e^{x} + C. Divide by e^{2x}:<br>$$\\boxed{\\,y(x) = e^{-x} + C\\,e^{-2x}\\,}$$<br><br><strong>Step 5.</strong> If y(0) = 0 then 0 = 1 + C ⇒ C = −1, giving y(x) = e^{−x} − e^{−2x}. The first term is the <em>particular</em> response to the forcing q(x) = e^{−x}; the second term is the <em>transient</em> that decays away as t grows.</div></div>

<div class="l-note"><strong>Why "linear"?</strong> The operator <em>L</em>[y] = y' + p(x)y is linear in y: L[y₁ + y₂] = L[y₁] + L[y₂] and L[c·y] = c·L[y]. As a result, the general solution decomposes as <em>y = y_p + y_h</em>, where y_p is any particular solution and y_h is the general solution of the homogeneous equation y' + p y = 0. This superposition principle is the backbone of all linear ODE theory.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If p = 0 the linear equation reduces to y' = q(x), a pure antiderivative. If q = 0 it reduces to y' = −p y, a separable exponential decay. The integrating factor handles every intermediate case in a single formula.</div></div>

<h2 class="lesson-title">7. Worked Example: RC Circuit Charging</h2>

<div class="calc-highlight"><strong>The "hello world" of linear electrical circuits.</strong> Connect a battery, a resistor, and a capacitor in series. Close the switch. The capacitor charges up — quickly at first, then slowly — and eventually levels off at the battery voltage. The rate of charging is governed by a first-order linear ODE that we can solve in two lines.</div>

<div class="calc-formula"><div class="formula-label">CIRCUIT EQUATION (KIRCHHOFF'S VOLTAGE LAW)</div><div class="formula-main">$$V_{\\text{bat}} = i(t) R + V_C(t), \\qquad i(t) = C \\, \\frac{dV_C}{dt}$$</div><div class="formula-sub">The battery voltage equals the IR drop across the resistor plus the voltage across the capacitor. The current that flows into the capacitor equals C·dV_C/dt by the capacitor's defining equation Q = CV.</div></div>

<p class="l-text">Substituting the current expression into the voltage equation:</p>

<div class="calc-formula"><div class="formula-label">THE RC ODE</div><div class="formula-main">$$RC \\, \\frac{dV_C}{dt} + V_C = V_{\\text{bat}}$$</div><div class="formula-sub">A linear first-order ODE in V_C. Standard form: dV_C/dt + (1/RC) V_C = V_bat/(RC).</div></div>

<p class="l-text"><strong>Solve with the integrating factor</strong> (p = 1/RC, q = V_bat/RC):</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">μ(t) = exp(∫p dt) = e^{t/RC}</div><div class="step-detail">Standard exponential integrating factor.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">(μ V_C)' = μ · V_bat/RC = (V_bat/RC)·e^{t/RC}</div><div class="step-detail">Multiply the standard-form equation by μ.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Integrate: μ V_C = V_bat · e^{t/RC} + C₀</div><div class="step-detail">∫(V_bat/RC)·e^{t/RC} dt = V_bat · e^{t/RC} (the RC inside the integral cancels the 1/RC outside).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Divide by μ and apply V_C(0) = 0 (uncharged capacitor)</div><div class="step-detail">V_C = V_bat + C₀·e^{−t/RC}. At t = 0: 0 = V_bat + C₀, so C₀ = −V_bat.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">RC CHARGING SOLUTION</div><div class="formula-main">$$V_C(t) = V_{\\text{bat}} \\left(1 - e^{-t/\\tau}\\right), \\qquad \\tau = RC$$</div><div class="formula-sub">V_C starts at 0 and rises asymptotically to V_bat. The time constant τ = RC governs the speed: after one τ the capacitor is at ~63% of full charge; after 5τ it is above 99%.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — A NUMERICAL RC CIRCUIT</div><div class="example-body">A 9 V battery, a 10 kΩ resistor, and a 100 μF capacitor in series.<br><br>τ = RC = (10 × 10³ Ω)(100 × 10⁻⁶ F) = <strong>1 s</strong>.<br><br>After 1 s: V_C = 9·(1 − e^{−1}) ≈ 9 · 0.632 ≈ <strong>5.69 V</strong>.<br>After 3 s: V_C = 9·(1 − e^{−3}) ≈ 9 · 0.950 ≈ <strong>8.55 V</strong>.<br>After 5 s: V_C = 9·(1 − e^{−5}) ≈ 9 · 0.993 ≈ <strong>8.94 V</strong> — practically fully charged.<br><br>Engineers use the "five tau" rule of thumb: after 5τ a first-order system has settled to within 1% of its final value.</div></div>

<div class="calc-graph"><div id="plot-l1-rc-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the charging curve V_C(t) for three different time constants τ = 0.3 s, 1.0 s, and 2.5 s (V_bat = 9 V in all three). The horizontal dashed line marks the battery voltage. Larger RC means slower charging — useful in low-pass filter design, where τ sets the cutoff frequency 1/(2πτ). The vertical lines mark one τ for each curve: at that moment the capacitor is at ~63% of V_bat.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=120;i++)t.push(i*0.1);
var taus=[0.3,1.0,2.5];var colors=['#3b82f6','#f59e0b','#10b981'];var V=9;var traces=[];
for(var k=0;k<taus.length;k++){var tau=taus[k];var y=[];for(var i=0;i<t.length;i++)y.push(V*(1-Math.exp(-t[i]/tau)));
traces.push({x:t,y:y,mode:'lines',name:'τ = '+tau+' s',line:{color:colors[k],width:2.4}});
traces.push({x:[tau,tau],y:[0,V*(1-Math.exp(-1))],mode:'lines',line:{color:colors[k],width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'});}
traces.push({x:[0,12],y:[V,V],mode:'lines',name:'V_bat = 9 V',line:{color:'rgba(255,255,255,0.5)',width:1.5,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'V_C (V)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,10]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-rc-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why exponential?</strong> The same ODE structure — "rate of change proportional to the gap from equilibrium" — produces an exponential approach in every domain: temperature, charge, concentration, displacement. This is why so much of engineering looks like the same plot with different units on the axes. The math underneath is identical.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">As t → ∞ the term e^{−t/τ} → 0, so V_C → V_bat — the capacitor catches up with the battery. Notice that the steady state is independent of τ; the time constant only sets how fast you get there.</div></div>

<h2 class="lesson-title">8. Worked Example: Logistic Population Growth</h2>

<div class="calc-highlight"><strong>The exponential growth model has one fatal flaw: real resources are finite.</strong> A bacterial colony cannot keep doubling forever; eventually it runs out of nutrients, space, or oxygen. The logistic equation is the simplest correction — growth that starts exponential but saturates at the environment's <em>carrying capacity</em> K. It models populations, the spread of diseases, the adoption of new technologies, and the saturation of chemical reactions.</div>

<div class="calc-formula"><div class="formula-label">THE LOGISTIC EQUATION</div><div class="formula-main">$$\\frac{dP}{dt} = r P \\left(1 - \\frac{P}{K}\\right)$$</div><div class="formula-sub">r > 0 is the intrinsic growth rate, K is the carrying capacity. When P ≪ K the equation reduces to dP/dt ≈ rP (exponential growth); as P → K the bracket → 0 and growth stalls.</div></div>

<p class="l-text"><strong>The two extreme regimes.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Small population (P ≪ K)</div><div class="card-body">The 1 − P/K factor is close to 1. The equation becomes dP/dt ≈ rP, pure exponential growth. P doubles every (ln 2)/r time units.</div></div>
<div class="calc-card"><div class="card-title">Population near carrying capacity (P ≈ K)</div><div class="card-body">The 1 − P/K factor approaches 0. The growth rate slows to zero. P levels off at K — the environment's maximum sustainable population.</div></div>
<div class="calc-card"><div class="card-title">Equilibria</div><div class="card-body">dP/dt = 0 when P = 0 (extinction, unstable) or P = K (carrying capacity, stable). Any positive starting population is drawn to K.</div></div>
</div>

<p class="l-text"><strong>Solving by separation.</strong> The equation is separable but the y-integral requires partial fractions:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Separate variables</div><div class="step-detail">dP / [P(1 − P/K)] = r dt.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Partial-fraction the left-hand side</div><div class="step-detail">1/[P(1 − P/K)] = 1/P + 1/(K − P) · (here we multiply numerator and denominator of the second term by K to get the standard form). Verify by combining: 1/P + 1/(K − P) = (K − P + P)/[P(K − P)] = K/[P(K − P)], which equals 1/[P(1 − P/K)] after distributing K. ✓</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Integrate both sides</div><div class="step-detail">∫(1/P + 1/(K − P)) dP = ln|P| − ln|K − P| = ln|P/(K − P)|. Right side: ∫r dt = rt + C₁.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Exponentiate and solve for P</div><div class="step-detail">P/(K − P) = A·e^{rt} where A = e^{C₁}. Solve algebraically: P = K·A·e^{rt}/(1 + A·e^{rt}). Apply P(0) = P₀: A = P₀/(K − P₀).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">LOGISTIC SOLUTION (SIGMOID)</div><div class="formula-main">$$P(t) = \\frac{K}{1 + \\left(\\dfrac{K - P_0}{P_0}\\right) e^{-rt}}$$</div><div class="formula-sub">The famous S-curve. Starts near P₀, grows exponentially while P ≪ K, and saturates at K as t → ∞.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — BACTERIA IN A FLASK</div><div class="example-body">A flask supports at most K = 10⁹ bacteria. Initial colony P₀ = 10⁵, intrinsic growth r = 1 / hour. When does the colony reach half capacity (P = K/2)?<br><br>From the solution: K/2 = K / (1 + ((K − P₀)/P₀) e^{−rt}), so 1 + ((K − P₀)/P₀) e^{−rt} = 2, giving e^{−rt} = P₀/(K − P₀).<br><br>Substituting numbers: e^{−t} ≈ 10⁵/(10⁹ − 10⁵) ≈ 10⁻⁴, so t = −ln(10⁻⁴) = 4·ln 10 ≈ <strong>9.21 hours</strong>.<br><br>So after about 9 hours the population is half-saturated; doubling once more takes only the few hours needed to reach K. The sigmoid's "kick" is in its middle, not its ends.</div></div>

<div class="calc-graph"><div id="plot-l1-logistic-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the logistic solution (blue, sigmoid) with K = 10, r = 1, P₀ = 0.1 compared with the pure exponential growth e^{rt}·P₀ (orange, dashed). For small t the two curves are indistinguishable — the logistic is locally exponential. But as P grows toward K the logistic flattens out and lands on the dashed grey carrying-capacity line, while the pure exponential keeps shooting upward unphysically. Real populations always look like the blue curve, not the orange one.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=100;i++)t.push(i*0.12);
var K=10,r=1,P0=0.1;var A=(K-P0)/P0;
var Pl=[],Pe=[];for(var i=0;i<t.length;i++){Pl.push(K/(1+A*Math.exp(-r*t[i])));Pe.push(P0*Math.exp(r*t[i]));}
var d1={x:t,y:Pl,mode:'lines',name:'logistic (saturates at K)',line:{color:'#3b82f6',width:2.6}};
var d2={x:t,y:Pe,mode:'lines',name:'pure exponential',line:{color:'#f59e0b',width:2.2,dash:'dash'}};
var d3={x:[0,12],y:[K,K],mode:'lines',name:'carrying capacity K',line:{color:'rgba(255,255,255,0.5)',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,12]},yaxis:{title:'P(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,15]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-logistic-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Where else the sigmoid appears.</strong> The same S-curve describes: the spread of an epidemic in the SI model, the diffusion of a new technology through a market, the saturation of an enzyme reaction (Michaelis–Menten kinetics), and even the loading dose of a drug. Whenever growth runs into a hard limit, expect a sigmoid.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If you set K → ∞ in the logistic solution, the (K − P₀)/P₀ coefficient explodes and (after careful limits) you recover the pure exponential P₀·e^{rt}. The logistic equation strictly contains the exponential model as a special case.</div></div>

<h2 class="lesson-title">9. Existence and Uniqueness — Picard's Theorem (Brief)</h2>

<div class="calc-highlight"><strong>Two questions you should ask before solving any ODE: does a solution exist, and is it unique?</strong> For first-order ODEs y' = f(x, y) with smooth enough f, the answer is reassuringly "yes and yes" — a precise statement is Picard's existence-and-uniqueness theorem.</div>

<div class="calc-formula"><div class="formula-label">PICARD–LINDELÖF THEOREM</div><div class="formula-main">$$\\text{If } f \\text{ and } \\partial f / \\partial y \\text{ are continuous in a rectangle around } (x_0, y_0),$$</div><div class="formula-sub">then the IVP y' = f(x, y), y(x₀) = y₀ has exactly one solution on some open interval around x₀.</div></div>

<p class="l-text">The condition is usually stated as "f is <strong>Lipschitz</strong> in y," meaning there exists a constant L such that |f(x, y₁) − f(x, y₂)| ≤ L · |y₁ − y₂| in the rectangle. Continuity of ∂f/∂y is a convenient sufficient condition (by the mean value theorem).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Existence</div><div class="card-body">At least one solution curve passes through (x₀, y₀). Strict continuity of f alone (Peano's theorem) is enough for this part, no Lipschitz needed.</div></div>
<div class="calc-card"><div class="card-title">Uniqueness</div><div class="card-body">Exactly one solution passes through (x₀, y₀). This requires the Lipschitz condition. Two distinct solutions would mean the slope field is "fuzzy" at that point, contradicting the geometric picture.</div></div>
<div class="calc-card"><div class="card-title">Local, not global</div><div class="card-body">The theorem guarantees a solution on <em>some</em> open interval around x₀. The solution might blow up to infinity before reaching a wider domain (the equation y' = y² with y(0) = 1 has solution y = 1/(1−x), which explodes at x = 1).</div></div>
</div>

<div class="calc-example"><div class="example-label">CAUTIONARY EXAMPLE — UNIQUENESS CAN FAIL</div><div class="example-body">Consider the IVP <em>y' = √y</em>, <em>y(0) = 0</em>. Here f(x, y) = √y is continuous at (0, 0) but ∂f/∂y = 1/(2√y) blows up as y → 0⁺ — not Lipschitz. Two distinct solutions exist:<br><br>(a) <em>y(x) ≡ 0</em> for all x (constant zero), and<br>(b) <em>y(x) = x²/4</em> for x ≥ 0 (and any patched combination).<br><br>Verify: in (b), y' = x/2 = √(x²/4) = x/2 ✓. The slope field at (0, 0) admits infinitely many curves leaving the origin, all valid solutions. This is exactly the failure mode Picard's Lipschitz condition rules out.</div></div>

<div class="l-note"><strong>Why this matters for numerics.</strong> Most engineering ODEs in this lesson have smooth right-hand sides and behave nicely. But when you simulate something near a singular point — division by zero, a phase boundary, a shock wave — uniqueness can fail and your numerical solver may give different answers depending on tiny initial perturbations. Knowing Picard tells you when to trust the simulation.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">For y' = −y/x (section 3) the right-hand side has a singularity at x = 0. Picard guarantees uniqueness on any rectangle that avoids the y-axis. The solutions y = C/x indeed live separately on x > 0 and x < 0 — no solution crosses x = 0.</div></div>

<h2 class="lesson-title">10. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with:</strong> change <code>k</code> in the cooling block and watch the curve speed up or slow down. Set <code>r = 0.3</code> in the logistic block and notice the colony takes far longer to reach K. Try the IC P₀ = 15 (above carrying capacity) and observe that the population <em>decreases</em> down to K — the logistic equation is stable at K from both sides.</p>

<h2 class="lesson-title">11. Summary &amp; What You Can Now Do</h2>

<p class="l-text">In one lesson we have covered the entire toolkit for first-order ODEs. Here is the complete mental map on a single page:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">What an ODE says</div><div class="card-body">"Here is the local rule for the rate of change of y." The solution reconstructs y itself from that rule plus an initial condition.</div><div class="card-formula">y' = f(x, y), y(x₀) = y₀</div></div>
<div class="calc-card"><div class="card-title">Slope field</div><div class="card-body">At every (x, y), draw an arrow of slope f. A solution curve is anything that follows the local arrows.</div><div class="card-formula">tangent ↔ slope = f</div></div>
<div class="calc-card"><div class="card-title">Separable</div><div class="card-body">If f = g(x)·h(y), separate and integrate. Handles Newton's cooling, radioactive decay, logistic growth.</div><div class="card-formula">∫dy/h(y) = ∫g(x) dx</div></div>
<div class="calc-card"><div class="card-title">Exact</div><div class="card-body">If M dx + N dy = 0 with ∂M/∂y = ∂N/∂x, solution is F(x, y) = C for some potential F.</div><div class="card-formula">∂M/∂y = ∂N/∂x</div></div>
<div class="calc-card"><div class="card-title">Linear (μ method)</div><div class="card-body">For y' + p y = q, multiply by μ = exp(∫p dx) so the LHS becomes (μy)'. Then integrate.</div><div class="card-formula">μ = exp(∫p dx)</div></div>
<div class="calc-card"><div class="card-title">Newton's cooling</div><div class="card-body">T(t) = T_env + (T₀ − T_env)·e^{−kt}. Exponential approach to ambient; time constant τ = 1/k.</div><div class="card-formula">T → T_env</div></div>
<div class="calc-card"><div class="card-title">RC charging</div><div class="card-body">V_C(t) = V_bat·(1 − e^{−t/τ}) with τ = RC. Engineer's "five tau rule" for settling.</div><div class="card-formula">τ = RC</div></div>
<div class="calc-card"><div class="card-title">Logistic growth</div><div class="card-body">P(t) is a sigmoid bounded by K. Starts exponential, saturates at carrying capacity.</div><div class="card-formula">dP/dt = rP(1 − P/K)</div></div>
<div class="calc-card"><div class="card-title">Picard</div><div class="card-body">Smooth f and Lipschitz in y ⇒ unique solution through every starting point. Fails for y' = √y, y(0) = 0.</div><div class="card-formula">|∂f/∂y| bounded</div></div>
</div>

<div class="l-warn"><strong>Coming next (Lesson 2):</strong> we move to <strong>second-order linear ODEs</strong> — the harmonic oscillator, the mass-spring-damper system, and the LRC circuit. The same integrating-factor philosophy plus a careful look at the characteristic equation gives us undamped, critically damped, and overdamped responses. Then we connect those mechanical systems to the resonance phenomena that haunted (and toppled) the Tacoma Narrows Bridge.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Türev Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L17)</span></li>
<li><a href="/tutorials/matematik/22" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">İlk Türev Testi</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L22)</span></li>
<li><a href="/tutorials/matematik/27" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Ters Türev</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L27)</span></li>
<li><a href="/tutorials/matematik/28" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">İntegrasyon Teknikleri</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L28)</span></li>
</ul>
</div>
<p class="l-text"><strong>Diferansiyel denklem, değişim üzerine yazılmış bir cümledir.</strong> Bir şeyin <em>ne olduğunu</em> söylemek yerine, o şeyin <em>nasıl değiştiğini</em> söyler ve sana o niceliği değişim hızından geri kazanma görevini verir. Bilinmeye değer hemen her fiziksel yasa — Newton'un ikinci yasası, Kirchhoff'un devre yasaları, radyoaktif bozunum, Newton'un soğutma yasası, bakterilerin lojistik büyümesi — önce bir diferansiyel denklem olarak yazılmıştır. Bu denklemleri çözmek, mühendislerin <em>şu andan 1 saniye sonra</em> ne olacağını <em>şu an</em> olanlardan kestirme yoludur.</p>

<p class="l-text">Bu ilk ders klasik bölgede kalıyor: birinci mertebeden adi diferansiyel denklemler ve çoğunu kıran dört elle çözüm tekniği — ayrılabilen denklemler, tam diferansiyeller, doğrusal ODE için integral çarpanı ve yön alanları. Yavaş ilerliyoruz; her adım açıkça gösteriliyor, her örnek zihinde canlandırabileceğin bir fiziksel sisteme bağlanıyor: soğuyan bir fincan kahve, şarj olan bir kondansatör, sınırlı bir habitattaki popülasyon. Diferansiyel denklemlerin yapay zekâ ve makine öğrenmesindeki uygulamaları derin ve güzeldir, ama bunlar sonraki derslere aittir (L6'da SDE ve difüzyon modelleri, L8'de Neural ODE). Burada önce klasik temeli ustalaşarak onlarla oynama hakkını kazanıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Adi diferansiyel denklemleri tanımlamayı, mertebelerine ve doğrusallıklarına göre sınıflandırmayı, bir başlangıç değer problemini (IVP) tam okumayı</li>
<li>Birinci mertebeden bir ODE'yi geometrik olarak bir eğim alanı (slope field) gibi yorumlamayı ve çözüm eğrilerini okların yönünü izleyerek çizmeyi</li>
<li>Ayrılabilen denklemleri her iki tarafı integre ederek çözmeyi — sabitler ve tanım kümesi kısıtlarına tam dikkat ederek</li>
<li>Doğrusal birinci mertebeden ODE'leri integral çarpanı <em>μ(x) = exp(∫p dx)</em> ile çözmeyi ve bir problemin doğrusal olup olmadığını tanımayı</li>
<li>Tam diferansiyelleri simetri testi <em>∂M/∂y = ∂N/∂x</em> ile tanıyıp potansiyel fonksiyon <em>F(x, y)</em>'yi yeniden inşa etmeyi</li>
<li>Dört tekniği gerçek mühendislik problemlerine — Newton soğutma, RC şarj, lojistik popülasyon — uygulayıp çözümleri fiziksel olarak yorumlamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Diferansiyel Denklem Nedir?</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> yeni dökülmüş bir kahveye bir termometre dayadığını düşün. Her gelecek anın sıcaklığını henüz bilmiyorsun. Ama bir yerel olguyu biliyorsun: <em>her anda kahve, çevredeki havadan ne kadar daha sıcaksa o kadar hızlı soğur.</em> <em>Hız</em> üzerine yazılmış bu tek cümle bir diferansiyel denklemdir. Onu çözmek, tüm soğuma eğrisini bu tek yerel kuraldan yeniden kurmak demektir.</div>

<p class="l-text">Bir <strong>diferansiyel denklem</strong>, bilinmeyen bir fonksiyonu bir veya daha fazla türeviyle birlikte içeren bir denklemdir. Sembolik olarak:</p>

<div class="calc-formula"><div class="formula-label">BİRİNCİ MERTEBEDEN ODE</div><div class="formula-main">$$\\frac{dy}{dx} = f(x, y)$$</div><div class="formula-sub">Oku: "bilinmeyen y fonksiyonunun x'e göre türevi, x ve y içinde bir ifadeye eşittir." Bizim işimiz y(x)'i bulmak.</div></div>

<p class="l-text">İlk günden itibaren iki ayrım önemlidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ODE vs PDE</div><div class="card-body"><strong>Adi</strong> (ordinary) diferansiyel denklem <em>tek</em> bir bağımsız değişkene (genellikle zaman t ya da konum x) göre türevler içerir. <strong>Kısmi</strong> (partial) diferansiyel denklem iki veya daha fazlasına göre türev içerir (ör. x ve t içinde ısı denklemi). Bu ders saf ODE.</div></div>
<div class="calc-card"><div class="card-title">Mertebe</div><div class="card-body"><em>Mertebe</em>, denklemde görünen en yüksek türevdir. y' = −ky birinci mertebedendir; y'' + ω²y = 0 ikinci mertebedendir; genelde n. mertebeden bir denklem n integrasyon ve n başlangıç koşulu ister.</div></div>
<div class="calc-card"><div class="card-title">Doğrusallık</div><div class="card-body"><strong>Doğrusal</strong> bir ODE'de y ve türevleri yalnızca birinci kuvvetlerinde ortaya çıkar ve hiçbir zaman birbirleriyle çarpılmaz. y' + p(x)y = q(x) doğrusal; y' = y² değil (y² doğrusal değildir). Doğrusal ODE'lerin tam bir teorisi vardır; doğrusal olmayanların çoğu zaman yoktur.</div></div>
<div class="calc-card"><div class="card-title">IVP (Başlangıç Değer Problemi)</div><div class="card-body">Tek başına bir diferansiyel denklemin sonsuz sayıda çözümü vardır (integrasyon sabitleriyle parametrelenen bir aile). Tek bir somut çözümü sabitlemek için y(0) = 5 gibi bir <em>başlangıç koşulu</em> gerekir. ODE + başlangıç koşulu = IVP.</div></div>
</div>

<p class="l-text"><strong>Çözmek neden önemli.</strong> Diferansiyel denklem bir <em>yasadır</em>; çözümü ise <em>tarihtir</em>. Newton F = ma yazmıştı; bu aslında konum için ikinci mertebeden bir ODE'dir. Düşen bir elma için çözüldüğünde sana elmanın her gelecek saniyedeki konumunu verir. Aynı örüntü her mühendislik alanında tekrarlanır: yasa yereldir (tek bir andaki değişim hızına dair bir kural), kestirim küreseldir (tüm gelecek yörüngesi).</p>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — ODE'LERİ SINIFLANDIRMA</div><div class="example-body">Her birini sınıflandır:<br><br>(a) <em>dy/dx = 3x²</em>  →  birinci mertebe, doğrusal, basitçe ayrılabilir.<br>(b) <em>y'' + 4y = 0</em>  →  ikinci mertebe, doğrusal (harmonik osilatör).<br>(c) <em>y' = y(1 − y)</em>  →  birinci mertebe, <strong>doğrusal değil</strong> (y² yüzünden — lojistik denklem).<br>(d) <em>∂u/∂t = ∂²u/∂x²</em>  →  bu bir <strong>PDE</strong>'dir (ısı denklemi), ODE değil — bugünün kapsamı dışında.<br>(e) <em>(y')² + y = x</em>  →  birinci mertebe, <strong>doğrusal değil</strong> (türev karesi var).</div></div>

<div class="l-note"><strong>Tarihsel not.</strong> Newton ilk ODE'sini (küçük bir cismin soğuması için) otuzundan önce çözmüştü; Leibniz modern dx/dy gösterimini geliştirdi; Bernoulli, Euler ve Lagrange önümüzdeki 150 yıl boyunca öğreneceğin makineyi kurdu. Maxwell 1865'te denklemlerini yazdığında diferansiyel denklemler artık fiziğin evrensel diliydi. O zamandan beri bu konumlarını korudular.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Tek cümleyle: bir diferansiyel denklem "<em>y'nin nasıl değiştiğine dair kural budur</em>" der; çözüm ise y'nin kendisini geri kazanır. Bu çerçeve oturduysa dersin geri kalanı mekaniktir.</div></div>

<h2 class="lesson-title">2. Birinci Mertebeden ODE: Genel Form ve Eğim Alanları</h2>

<div class="calc-highlight"><strong>Geometrik okuma.</strong> <em>dy/dx = f(x, y)</em> denklemi, düzlemdeki her (x, y) noktasında bir talimat verir: "eğer bir çözüm eğrisi bu noktadan geçiyorsa, eğimi burada f(x, y) olmak zorundadır." Düzlemin her noktasında o eğimde küçük bir ok çizdiğini hayal et. Sonuç bir <strong>eğim alanıdır</strong> (ya da yön alanı) ve her çözüm eğrisi yalnızca yerel okları izleyen bir eğridir. ODE sana rüzgârı gösterir; çözüm rüzgârla taşınan bir yaprağın izini çıkarır.</div>

<p class="l-text">Genel birinci mertebeden ODE şudur:</p>

<div class="calc-formula"><div class="formula-label">BİRİNCİ MERTEBEDEN ODE VE IVP'Sİ</div><div class="formula-main">$$\\frac{dy}{dx} = f(x, y), \\qquad y(x_0) = y_0$$</div><div class="formula-sub">Başlangıç koşulu olmadan sonsuz sayıda çözüm vardır; her başlangıç noktası için bir tane. y(x₀) = y₀ eklendiğinde aileden tek bir eğri seçilmiş olur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bir noktadaki eğim</div><div class="card-body">(x, y) değerlerini f'e yerleştir. Elde edilen sayı, çözüm eğrisinin o noktadan geçmesi durumunda o noktada sahip olması gereken eğimdir. O eğimde kısa bir doğru parçası çiz. Bunu bir ızgara üzerinde tekrarla.</div></div>
<div class="calc-card"><div class="card-title">Çözüm eğrisi</div><div class="card-body">Grafiği her noktasında yerel eğim okuna teğet olan bir y(x) fonksiyonu. Farklı y(x₀) = y₀ başlangıç koşulları, aynı alandan farklı eğriler seçer.</div></div>
<div class="calc-card"><div class="card-title">Varlık ve teklik</div><div class="card-body">f üzerinde hafif düzgünlük koşulları (y'de Lipschitz) altında her başlangıç noktasından geçen <em>tam bir</em> çözüm eğrisi vardır. 9. bölümde bunu kesinleştiriyoruz.</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-slope-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> <em>dy/dx = −y/x</em> denkleminin bir ızgara üzerindeki eğim alanı. Her (x, y) noktasında −y/x eğimine sahip kısa bir mavi parça çizilmiştir; birlikte ODE'nin yerel "rüzgârını" gösterirler. Üç çözüm eğrisi y(1) = 1, y(1) = 2 ve y(1) = −1 başlangıç koşulları için üst üste bindirilmiştir. Her eğri y = C/x biçiminde bir hiperboldür (sırasıyla C = 1, 2 ve −1) — bir sonraki bölümde analitik olarak türetilen aile.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];var seg=0.18;
for(var i=-4;i<=4;i++){for(var j=-4;j<=4;j++){if(i===0)continue;var x=i*0.6+0.05;var y=j*0.6;var s=-y/x;var L=Math.sqrt(1+s*s);var dx=seg/L;var dy=s*seg/L;traces.push({x:[x-dx,x+dx],y:[y-dy,y+dy],mode:'lines',line:{color:'rgba(59,130,246,0.55)',width:1.2},showlegend:false,hoverinfo:'skip'});}}
var xc1=[],yc1=[],xc2=[],yc2=[],xc3=[],yc3=[];
for(var k=0;k<=200;k++){var x=0.25+k*0.0185;xc1.push(x);yc1.push(1/x);xc2.push(x);yc2.push(2/x);xc3.push(x);yc3.push(-1/x);}
traces.push({x:xc1,y:yc1,mode:'lines',name:'y(1)=1: y = 1/x',line:{color:'#f59e0b',width:2.6}});
traces.push({x:xc2,y:yc2,mode:'lines',name:'y(1)=2: y = 2/x',line:{color:'#10b981',width:2.6}});
traces.push({x:xc3,y:yc3,mode:'lines',name:'y(1)=−1: y = −1/x',line:{color:'#ef4444',width:2.6,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,3]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-slope-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — EĞİM ALANI OKUMA</div><div class="example-body"><em>dy/dx = x − y</em> denklemini düşün. (0, 0)'da eğim 0 − 0 = 0 (yatay). (1, 0)'da eğim = 1 (45° yukarı). (0, 1)'de eğim = −1 (45° aşağı). y = x − 1 doğrusunun kendisi üzerinde her yerde sabit 1 eğimi vardır; bu doğruda dy/dx = 1 ve x − y = 1 olduğunu kontrol edebilirsin, yani doğrunun kendisi bir <em>çözümdür</em>. Eğim alanları, bir şey çözmeden önce bu tür özel çözümleri gözle yakalamana izin verir.</div></div>

<div class="l-note"><strong>Resme neden değer veriyoruz?</strong> Gerçek ODE'lerin çoğunun kapalı form çözümü yoktur. Eğim alanı yine de niteliksel davranışı çizmene izin verir: çözümler nerede büyür, nerede sönümlenir, nerede dengelere yaklaşır. 19. yüzyılın sonunda Poincaré'nin öncülük ettiği bu <em>niteliksel teori</em>, dinamik sistemler ve kaosun kapısıdır.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Verilen bir f için her (x, y)'ye zihninde bir ok yerleştirebiliyorsan, tek bir integral yazmadan çözümlerin niteliksel davranışını çizebilirsin. dy/dx = −y üzerinde dene: her (x, y > 0)'da eğim negatiftir (eğriler düşer), y < 0'da eğim pozitiftir (eğriler yükselir) ve y = 0 bir dengedir.</div></div>

<h2 class="lesson-title">3. Ayrılabilen Denklemler</h2>

<div class="calc-highlight"><strong>Birinci mertebeden ODE'nin en temiz türü.</strong> Sağ taraf bir x fonksiyonu ile bir y fonksiyonunun çarpımına ayrılabildiğinde, <em>f(x, y) = g(x) · h(y)</em>, değişkenler eşittirin iki tarafına fiziksel olarak ayrılabilir ve bağımsız olarak integre edilebilir. Bu derste karşılaşacağın mühendislik problemlerinin yarısı — Newton soğutma, radyoaktif bozunum, lojistik büyüme — ayrılabilir. Bu tekniği ustalaştırırsan pratik ODE'lerin büyük bir kısmını çözebilirsin.</div>

<div class="calc-formula"><div class="formula-label">AYRILABİLEN FORM</div><div class="formula-main">$$\\frac{dy}{dx} = g(x) \\cdot h(y) \\;\\;\\Longrightarrow\\;\\; \\frac{dy}{h(y)} = g(x)\\, dx$$</div><div class="formula-sub">Her y'yi sola, her x'i sağa taşı, sonra her iki tarafı integre et.</div></div>

<p class="l-text">Adım adım:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">f'in g(x)·h(y) olarak çarpanlara ayrıldığını doğrula</div><div class="step-detail">Her ODE ayrılabilir değildir. dy/dx = x + y ayrılabilir <em>değildir</em> (toplam, çarpım değil). dy/dx = xy <em>ayrılabilirdir</em> (g(x) = x ve h(y) = y çarpımı).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Değişkenleri cebirsel olarak ayır</div><div class="step-detail">dy/dx'i bir oran gibi düşün (burada bu manipülasyon, dy ve dx sayı olmasa da, zincir kuralıyla katı bir şekilde doğrulanır). dy/h(y) = g(x) dx yaz.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Her iki tarafı bağımsız olarak integre et</div><div class="step-detail">∫ dy/h(y) = ∫ g(x) dx + C. C sabiti her iki taraftaki integrasyon sabitlerini tek bir sabit içine emer.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Mümkünse y'yi cebirsel olarak çöz</div><div class="step-detail">Bazen y'yi açıkça izole edebilirsin; bazen yanıtı yalnızca kapalı (implicit) formda bırakabilirsin. İkisi de geçerli "çözüm"dür.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">C'yi sabitlemek için başlangıç koşulunu uygula</div><div class="step-detail">Genel çözüme y(x₀) = y₀'ı yerleştirerek integrasyon sabitini çöz.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — dy/dx = −y/x ÇÖZÜMÜ</div><div class="example-body"><strong>Kurulum.</strong> Sağ taraf g(x) = −1/x ve h(y) = y ile g(x)·h(y) olarak çarpanlara ayrılır, dolayısıyla denklem ayrılabilirdir.<br><br><strong>Adım 1.</strong> Ayır: $$\\frac{dy}{y} = -\\frac{dx}{x}$$<br><strong>Adım 2.</strong> İntegre et: $$\\ln|y| = -\\ln|x| + C_1$$<br><strong>Adım 3.</strong> Üs al: $$|y| = e^{C_1} \\cdot \\frac{1}{|x|}$$<br><strong>Adım 4.</strong> İşaret ve sabiti C = ±e^{C₁} içine emerek (sıfırdan farklı herhangi bir gerçek sayı): $$\\boxed{\\,y = \\frac{C}{x}\\,}$$<br><br><strong>Adım 5 (IC uygula).</strong> y(1) = 2 ise 2 = C/1, dolayısıyla C = 2 ve y = 2/x. 2. bölümdeki eğim alanındaki yeşil eğriyle karşılaştır — aynı hiperbol.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — RADYOAKTİF BOZUNUM</div><div class="example-body">Radyoaktif bir örnek, mevcut miktarla orantılı bir hızda bozunur:<br><br>$$\\frac{dN}{dt} = -\\lambda N, \\qquad N(0) = N_0$$<br><br>Ayır: dN/N = −λ dt. İntegre et: ln N = −λt + C. Üs al ve IC uygula:<br><br>$$N(t) = N_0 \\, e^{-\\lambda t}$$<br><br>Ünlü üstel bozunma yasası. <strong>Yarı ömür</strong>, N'nin N₀/2'ye düşmesi için geçen süredir: t₁/₂ = (ln 2)/λ. Karbon-14 için λ ≈ 1.21 × 10⁻⁴ /yıl, dolayısıyla t₁/₂ ≈ 5730 yıl — radyokarbon yaş tayininin temeli.</div></div>

<div class="l-note"><strong>İncelik: sıfıra bölme.</strong> dy/y yazdığımızda örtük olarak y ≠ 0 varsaydık. y(x) ≡ 0 sabit çözümü de bir çözümdür (kontrol et: dy/dx = 0 ve −y/x = 0), çoğu zaman <em>tekil çözüm</em> (singular solution) olarak adlandırılır. Ayırma sırasında kaybolan çözümleri her zaman kontrol et.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">İlk bakışta <em>dy/dx = y · sin(x)</em>'in ayrılabilir olduğunu görebiliyorsan 4. bölüme hazırsın. (İpucu: g(x) = sin x, h(y) = y, ayır → dy/y = sin x dx.)</div></div>

<h2 class="lesson-title">4. Çözülmüş Örnek: Newton'un Soğutma Yasası</h2>

<div class="calc-highlight"><strong>Ayrılabilir bir ODE'nin klasik uygulaması.</strong> Sıcak bir cisim (ya da soğuk bir cisim ısınırken) cisim ile çevre arasındaki sıcaklık farkıyla orantılı bir hızda soğur. Kahve, çorba, yeni dövülmüş demir, ölüm zamanını tahmin etmek için kullanılan bir ceset — hepsi aynı basit yasaya uyar. Tüm soğutma eğrisini sıfırdan türetelim.</div>

<div class="calc-formula"><div class="formula-label">NEWTON'UN SOĞUTMA YASASI</div><div class="formula-main">$$\\frac{dT}{dt} = -k\\,(T - T_{\\text{env}})$$</div><div class="formula-sub">T(t) cismin sıcaklığı, T_env ortam (oda) sıcaklığı ve k > 0 cisme ve ortama bağlı bir ısı transfer sabitidir.</div></div>

<p class="l-text"><strong>İşaret kontrolü.</strong> Cisim odadan sıcaksa (T > T_env) sağ taraf negatiftir, dolayısıyla T azalır — cisim soğur. Cisim daha soğuksa (T < T_env) sağ taraf pozitiftir, dolayısıyla T ortama doğru yükselir. T = T_env'de denge (dT/dt = 0). Tüm fizik zaten sağ tarafın işaretine kodlanmıştır.</p>

<p class="l-text"><strong>Adım adım çözüm.</strong></p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Sağ tarafı temizlemek için u = T − T_env değişikliği yap</div><div class="step-detail">O zaman du/dt = dT/dt ve denklem du/dt = −k·u olur. u içinde standart bir ayrılabilir ODE.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Ayır ve integre et</div><div class="step-detail">du/u = −k dt  ⇒  ln|u| = −kt + C₁  ⇒  u = C · e^{−kt}.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Değişken değişikliğini geri al</div><div class="step-detail">T − T_env = C·e^{−kt}, dolayısıyla T(t) = T_env + C·e^{−kt}.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">T(0) = T₀ başlangıç koşulunu uygula</div><div class="step-detail">T₀ = T_env + C, dolayısıyla C = T₀ − T_env.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">NEWTON SOĞUTMASININ ÇÖZÜMÜ</div><div class="formula-main">$$T(t) = T_{\\text{env}} + (T_0 - T_{\\text{env}}) \\, e^{-k t}$$</div><div class="formula-sub">T₀'dan başlar, zaman sabiti τ = 1/k ile T_env'e doğru üstel olarak söner.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — BİR FİNCAN KAHVE</div><div class="example-body">T₀ = 90 °C'lik bir fincan kahve T_env = 20 °C'lik bir odada bulunuyor. 5 dakika sonra kahve 60 °C'ye soğumuş. k nedir? Ve 30 °C'ye ne zaman ulaşır?<br><br><strong>k'yi bul.</strong> t = 5'te: 60 = 20 + 70·e^{−5k}, dolayısıyla e^{−5k} = 40/70 = 4/7. Logaritma al: −5k = ln(4/7) ≈ −0.559, dolayısıyla <strong>k ≈ 0.112 / dk</strong>.<br><br><strong>30 °C'ye süre.</strong> 30 = 20 + 70·e^{−kt}, dolayısıyla e^{−kt} = 10/70 = 1/7. O zaman t = −ln(1/7)/k = ln 7 / 0.112 ≈ <strong>17.4 dk</strong>.<br><br>Fincanın 30 °C'ye ulaşması döküldükten sonra yaklaşık 17 dakika gerekir. Zaman sabiti τ = 1/k ≈ 8.9 dk karakteristik zaman ölçeğidir: bir τ sonra sıcaklık farkı orijinal değerinin yaklaşık %37'sine düşer.</div></div>

<div class="calc-graph"><div id="plot-l1-cooling-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 90 °C'den başlayan bir kahve için sırasıyla 5 °C, 20 °C ve 30 °C'lik odalarda üç soğutma eğrisi (üçü için de k = 0.112 / dk). Her eğri kendi ortam sıcaklığına doğru üstel olarak söner ve üçü de asimptotuna teğet yaklaşır. Aynı fizik üç farklı denge sıcaklığı üretir; çünkü ODE T_env'i (T − T_env) terimi aracılığıyla "bilir".</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=60;i++)t.push(i*0.5);
var envs=[5,20,30];var colors=['#3b82f6','#f59e0b','#10b981'];var traces=[];
for(var e=0;e<envs.length;e++){var Te=envs[e];var y=[];for(var i=0;i<t.length;i++){y.push(Te+(90-Te)*Math.exp(-0.112*t[i]));}
traces.push({x:t,y:y,mode:'lines',name:'T_env = '+Te+' °C',line:{color:colors[e],width:2.4}});
traces.push({x:[0,30],y:[Te,Te],mode:'lines',line:{color:colors[e],width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (dk)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'T (°C)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,95]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-cooling-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Adli not.</strong> Newton soğutması, ölüm zamanını tahmin etmek için kullanılan klasik bir yöntemin temelidir: cesedin şu anki sıcaklığını ölç, başlangıç sıcaklığının 37 °C olduğunu varsay, ortam koşullarından k'yi uydur, ardından zamanda geriye doğru çöz. Gerçek adli tıp giysiler, vücut kütlesi ve ölüm sonrası kimyası için düzeltmeler ekler, ama iskelet tam olarak bu ODE'dir.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">t → ∞ olduğunda e^{−kt} → 0, dolayısıyla T(t) → T_env. Sıcaklık oda sıcaklığına yaklaşır ama (matematiksel idealleştirmede) asla tam olarak ulaşmaz. Pratikte yaklaşık 5τ sonra fark %1'in altına iner ve endişelenmeyi bırakabilirsin.</div></div>

<h2 class="lesson-title">5. Tam Diferansiyel Denklemler</h2>

<div class="calc-highlight"><strong>Toplam türev kılığına bürünmüş bir ODE.</strong> Bazı birinci mertebeden denklemler, gizli bir F(x, y) fonksiyonunun toplam türevinin sıfır olarak yazılabilir. Bu gizli F'i bulabilirsen çözüm yalnızca F(x, y) = C olur. Bu teknik <em>ayrılabilir olmayan</em> ama yine de temiz kapalı form çözümü olan bir ODE sınıfını kapsar.</div>

<p class="l-text">ODE'yi (dy/dx olarak değil) diferansiyel formda yaz:</p>

<div class="calc-formula"><div class="formula-label">DİFERANSİYEL FORM</div><div class="formula-main">$$M(x, y)\\, dx + N(x, y)\\, dy = 0$$</div><div class="formula-sub">Herhangi bir birinci mertebeden ODE dy/dx = −M/N bu şekilde yeniden yazılabilir.</div></div>

<p class="l-text">Sol taraf bir F(x, y) skaler fonksiyonunun toplam diferansiyeli <em>dF</em> olduğunda denkleme <strong>tam</strong> (exact) denir. Hatırla ki</p>

<div class="calc-formula"><div class="formula-label">TOPLAM DİFERANSİYEL</div><div class="formula-main">$$dF = \\frac{\\partial F}{\\partial x}\\, dx + \\frac{\\partial F}{\\partial y}\\, dy$$</div><div class="formula-sub">Yani tam denklem yalnızca dF = 0'dır, çözümü F(x, y) = C.</div></div>

<p class="l-text">Katsayıları eşleştirdiğimizde tamlık ∂F/∂x = M ve ∂F/∂y = N gerektirir. Karışık kısmi türevlerin eşitliğiyle (Clairaut teoremi) bu ünlü testi verir:</p>

<div class="calc-formula"><div class="formula-label">TAMLIK TESTİ</div><div class="formula-main">$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$</div><div class="formula-sub">Bu eşitlik sağlanırsa denklem tamdır ve bir F potansiyeli vardır.</div></div>

<p class="l-text"><strong>Yeniden inşa tarifi</strong>:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">∂M/∂y = ∂N/∂x doğrula</div><div class="step-detail">Bu olmadan denklem tam değildir ve tarifin geri kalanı çalışmaz. (Bazen integral çarpanıyla çarparak tam hale getirebilirsin — ama bu tam olarak 6. bölümün doğrusal formdaki numarasıdır.)</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">∂F/∂x = M'yi x'e göre integre et</div><div class="step-detail">F(x, y) = ∫ M dx + g(y). x-integrasyonu sırasında y'yi sabit tuttuğumuz için "integrasyon sabiti" y'ye bağlıdır.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">F'i y'ye göre türev al ve N ile eşle</div><div class="step-detail">∂F/∂y = (∂/∂y)∫M dx + g'(y), N'ye eşit olmalı. g'(y)'yi çöz, sonra integre ederek g(y)'yi bul.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Çözümü kapalı formda F(x, y) = C olarak yaz</div><div class="step-detail">Mümkünse y için açıkça çöz; çözemiyorsan kapalı bırak.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — TAM BİR DENKLEM</div><div class="example-body">Çöz: <em>(2xy + 3)dx + (x² − 4)dy = 0</em>.<br><br><strong>Adım 1.</strong> M = 2xy + 3, N = x² − 4. Tamlığı kontrol et: ∂M/∂y = 2x ve ∂N/∂x = 2x. Eşit — tam. ✓<br><br><strong>Adım 2.</strong> M'yi x'e göre integre et:<br>F = ∫(2xy + 3) dx = x²y + 3x + g(y).<br><br><strong>Adım 3.</strong> F'i y'ye göre türev al:<br>∂F/∂y = x² + g'(y). Bunu N = x² − 4'e eşitle:<br>g'(y) = −4  ⇒  g(y) = −4y (sabit daha sonra C'ye emilir).<br><br><strong>Adım 4.</strong> Çözümü yaz: <strong>F(x, y) = x²y + 3x − 4y = C</strong>.<br><br>Açık form istiyorsak y için çöz: y(x² − 4) = C − 3x, dolayısıyla x ≠ ±2 için y = (C − 3x)/(x² − 4).</div></div>

<div class="l-note"><strong>Geometrik okuma.</strong> Bir tam denklem, bir z = F(x, y) yüzeyinin seviye eğrisi denklemidir. Çözümler kontur çizgileridir. Bir kontur boyunca yürürken F değişmez — F = C tam olarak bunu söyler.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">∂M/∂y ≠ ∂N/∂x olduğunda denklem tam <em>değildir</em> ve bu tarif başarısız olur. Ama çoğu zaman μM dx + μN dy'yi tam hale getiren bir μ(x, y) integral çarpanı vardır. μ'yu genel olarak bulmak zordur; doğrusal ODE'ler için (6. bölüm) evrensel bir formül vardır.</div></div>

<h2 class="lesson-title">6. Doğrusal Birinci Mertebeden ODE ve İntegral Çarpanı</h2>

<div class="calc-highlight"><strong>Doğrusal birinci mertebeden ODE'ler için evrensel teknik.</strong> Denklemin <em>y' + p(x) y = q(x)</em> formundaysa — yani y ve y'nin her biri yalnızca birinci kuvvetlerinde görünüyorsa — yaratıcılık gerektirmeyen, her zaman çalışan bir yöntem vardır. Her iki tarafı dikkatle seçilmiş bir μ(x) fonksiyonuyla (integral çarpanı) çarpıyorsun ve tüm sol taraf bir çarpımın türevine dönüşüyor. Sonra tek bir integral işi bitirir.</div>

<div class="calc-formula"><div class="formula-label">DOĞRUSAL BİRİNCİ MERTEBEDEN ODE'NİN STANDART FORMU</div><div class="formula-main">$$y' + p(x)\\, y = q(x)$$</div><div class="formula-sub">Denklemin bu formda değilse, y'nin katsayısı 1 olana kadar y'yi çarpan ne ise ona böl.</div></div>

<p class="l-text"><strong>Numara.</strong> Her iki tarafı bir μ(x) fonksiyonuyla çarp:</p>

<div class="calc-formula"><div class="formula-label">μ İLE ÇARPTIKTAN SONRA</div><div class="formula-main">$$\\mu(x)\\, y' + \\mu(x)\\, p(x)\\, y = \\mu(x)\\, q(x)$$</div><div class="formula-sub">Sol tarafın μ·y'nin türevi olmasını istiyoruz. Çarpım kuralıyla (μy)' = μ'y + μy'.</div></div>

<p class="l-text">μy' + μp·y'nin (μy)' = μ'y + μy'ye eşit olması için μ' = μp gerekir, yani:</p>

<div class="calc-formula"><div class="formula-label">İNTEGRAL ÇARPANI</div><div class="formula-main">$$\\mu(x) = \\exp\\!\\left(\\int p(x)\\, dx\\right)$$</div><div class="formula-sub">μ'nun kendisi için ayrılabilir bir ODE, doğrudan integrasyonla çözülür.</div></div>

<p class="l-text"><strong>μ bulunduğunda</strong> doğrusal ODE şuna indirgenir:</p>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM TARİFİ</div><div class="formula-main">$$(\\mu \\, y)' = \\mu \\, q  \\;\\;\\Longrightarrow\\;\\;  y(x) = \\frac{1}{\\mu(x)}\\left[\\int \\mu(x)\\, q(x)\\, dx + C\\right]$$</div><div class="formula-sub">μq'yu integre et, μ'ya böl, IC ile belirlenen bir integrasyon sabiti ekle.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">ODE'yi standart form y' + p(x)y = q(x)'e getir</div><div class="step-detail">Gerekirse böl; p ve q'yu tanımla.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">μ(x) = exp(∫p dx)'i hesapla</div><div class="step-detail">p için integrasyon sabitini düşür (yalnızca μ'yu bir sabitle çarpar ve bu sabit nasıl olsa sadeleşir).</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Çarp ve solda (μy)' olduğunu fark et</div><div class="step-detail">Emin olmak istiyorsan (μy)' = μ'y + μy' şeklinde açarak doğrula.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Her iki tarafı integre et</div><div class="step-detail">μy = ∫μq dx + C. y'yi izole etmek için μ'ya böl.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Başlangıç koşulunu uygula</div><div class="step-detail">C'yi sabitlemek için y(x₀) = y₀'ı genel çözüme yerleştir.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — y' + 2y = e^{−x} ÇÖZÜMÜ</div><div class="example-body"><strong>Adım 1.</strong> Zaten standart formda: p(x) = 2, q(x) = e^{−x}.<br><br><strong>Adım 2.</strong> μ(x) = exp(∫2 dx) = e^{2x}.<br><br><strong>Adım 3.</strong> Çarp: e^{2x}·y' + 2e^{2x}·y = e^{2x}·e^{−x} = e^{x}. Sol taraf tam olarak (e^{2x}·y)'dır (çarpım kuralıyla kontrol et). Yani<br>$$\\big(e^{2x} y\\big)' = e^{x}.$$<br><strong>Adım 4.</strong> Her iki tarafı integre et: e^{2x}·y = e^{x} + C. e^{2x}'e böl:<br>$$\\boxed{\\,y(x) = e^{-x} + C\\,e^{-2x}\\,}$$<br><br><strong>Adım 5.</strong> y(0) = 0 ise 0 = 1 + C ⇒ C = −1, dolayısıyla y(x) = e^{−x} − e^{−2x}. İlk terim q(x) = e^{−x} sürmesine <em>özel</em> tepki; ikinci terim t büyüdükçe sönen <em>geçici</em> bileşendir.</div></div>

<div class="l-note"><strong>Neden "doğrusal"?</strong> <em>L</em>[y] = y' + p(x)y operatörü y'de doğrusaldır: L[y₁ + y₂] = L[y₁] + L[y₂] ve L[c·y] = c·L[y]. Bunun sonucu olarak genel çözüm <em>y = y_p + y_h</em> şeklinde ayrışır; burada y_p herhangi bir özel çözüm ve y_h homojen denklem y' + p y = 0'ın genel çözümüdür. Bu süperpozisyon ilkesi, tüm doğrusal ODE teorisinin omurgasıdır.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">p = 0 ise doğrusal denklem y' = q(x)'e indirgenir, saf bir antitürev. q = 0 ise y' = −p y'ye indirgenir, ayrılabilir bir üstel sönüm. İntegral çarpanı her ara durumu tek bir formülde halleder.</div></div>

<h2 class="lesson-title">7. Çözülmüş Örnek: RC Devre Şarjı</h2>

<div class="calc-highlight"><strong>Doğrusal elektrik devrelerinin "hello world"u.</strong> Bir pil, bir direnç ve bir kondansatörü seri bağla. Anahtarı kapat. Kondansatör şarj olur — önce hızlı, sonra yavaş — ve sonunda pil voltajında platoya ulaşır. Şarj hızı, iki satırda çözebileceğimiz birinci mertebeden doğrusal bir ODE ile yönetilir.</div>

<div class="calc-formula"><div class="formula-label">DEVRE DENKLEMİ (KIRCHHOFF GERİLİM YASASI)</div><div class="formula-main">$$V_{\\text{bat}} = i(t) R + V_C(t), \\qquad i(t) = C \\, \\frac{dV_C}{dt}$$</div><div class="formula-sub">Pil voltajı, direnç üzerindeki IR düşüşü ile kondansatör üzerindeki voltajın toplamına eşittir. Kondansatöre giren akım, kondansatörün tanımlayıcı denklemi Q = CV ile C·dV_C/dt'ye eşittir.</div></div>

<p class="l-text">Akım ifadesini voltaj denkleminde yerine koyalım:</p>

<div class="calc-formula"><div class="formula-label">RC ODE'Sİ</div><div class="formula-main">$$RC \\, \\frac{dV_C}{dt} + V_C = V_{\\text{bat}}$$</div><div class="formula-sub">V_C'de doğrusal birinci mertebeden bir ODE. Standart form: dV_C/dt + (1/RC) V_C = V_bat/(RC).</div></div>

<p class="l-text"><strong>İntegral çarpanı ile çöz</strong> (p = 1/RC, q = V_bat/RC):</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">μ(t) = exp(∫p dt) = e^{t/RC}</div><div class="step-detail">Standart üstel integral çarpanı.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">(μ V_C)' = μ · V_bat/RC = (V_bat/RC)·e^{t/RC}</div><div class="step-detail">Standart form denklemini μ ile çarp.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">İntegre et: μ V_C = V_bat · e^{t/RC} + C₀</div><div class="step-detail">∫(V_bat/RC)·e^{t/RC} dt = V_bat · e^{t/RC} (integralin içindeki RC, dışındaki 1/RC ile sadeleşir).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">μ'ya böl ve V_C(0) = 0 (şarjsız kondansatör) uygula</div><div class="step-detail">V_C = V_bat + C₀·e^{−t/RC}. t = 0'da: 0 = V_bat + C₀, dolayısıyla C₀ = −V_bat.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">RC ŞARJ ÇÖZÜMÜ</div><div class="formula-main">$$V_C(t) = V_{\\text{bat}} \\left(1 - e^{-t/\\tau}\\right), \\qquad \\tau = RC$$</div><div class="formula-sub">V_C, 0'dan başlar ve asimptotik olarak V_bat'a yükselir. Zaman sabiti τ = RC hızı yönetir: bir τ sonra kondansatör tam yükün ~%63'ünde; 5τ sonra ise %99'un üzerindedir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — SAYISAL BİR RC DEVRESİ</div><div class="example-body">9 V'luk bir pil, 10 kΩ'lık bir direnç ve 100 μF'lık bir kondansatör seri.<br><br>τ = RC = (10 × 10³ Ω)(100 × 10⁻⁶ F) = <strong>1 s</strong>.<br><br>1 s sonra: V_C = 9·(1 − e^{−1}) ≈ 9 · 0.632 ≈ <strong>5.69 V</strong>.<br>3 s sonra: V_C = 9·(1 − e^{−3}) ≈ 9 · 0.950 ≈ <strong>8.55 V</strong>.<br>5 s sonra: V_C = 9·(1 − e^{−5}) ≈ 9 · 0.993 ≈ <strong>8.94 V</strong> — pratikte tam şarjlı.<br><br>Mühendisler "beş tau" başparmak kuralını kullanır: 5τ sonra birinci mertebeden bir sistem, son değerinin %1'i içine yerleşmiştir.</div></div>

<div class="calc-graph"><div id="plot-l1-rc-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üç farklı zaman sabiti τ = 0.3 s, 1.0 s ve 2.5 s için şarj eğrisi V_C(t) (üçü için V_bat = 9 V). Yatay kesik çizgi pil voltajını işaretler. Daha büyük RC daha yavaş şarj demektir — alçak geçiren filtre tasarımında τ kesim frekansını 1/(2πτ) olarak belirler. Dikey çizgiler her eğri için bir τ'yu işaretler: o anda kondansatör V_bat'ın ~%63'üne ulaşmıştır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=120;i++)t.push(i*0.1);
var taus=[0.3,1.0,2.5];var colors=['#3b82f6','#f59e0b','#10b981'];var V=9;var traces=[];
for(var k=0;k<taus.length;k++){var tau=taus[k];var y=[];for(var i=0;i<t.length;i++)y.push(V*(1-Math.exp(-t[i]/tau)));
traces.push({x:t,y:y,mode:'lines',name:'τ = '+tau+' s',line:{color:colors[k],width:2.4}});
traces.push({x:[tau,tau],y:[0,V*(1-Math.exp(-1))],mode:'lines',line:{color:colors[k],width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'});}
traces.push({x:[0,12],y:[V,V],mode:'lines',name:'V_bat = 9 V',line:{color:'rgba(255,255,255,0.5)',width:1.5,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t (s)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},yaxis:{title:'V_C (V)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,10]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-rc-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Neden üstel?</strong> Aynı ODE yapısı — "değişim hızı dengeden uzaklıkla orantılı" — her alanda üstel yaklaşma üretir: sıcaklık, yük, konsantrasyon, yer değiştirme. Bu yüzden mühendisliğin büyük kısmı eksenlerde farklı birimlerle aynı grafik gibi görünür. Altta yatan matematik özdeştir.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">t → ∞ olduğunda e^{−t/τ} terimi → 0, dolayısıyla V_C → V_bat — kondansatör pile yetişir. Kararlı durumun τ'dan bağımsız olduğuna dikkat et; zaman sabiti yalnızca oraya ne kadar hızlı vardığını belirler.</div></div>

<h2 class="lesson-title">8. Çözülmüş Örnek: Lojistik Popülasyon Büyümesi</h2>

<div class="calc-highlight"><strong>Üstel büyüme modelinin tek ölümcül kusuru vardır: gerçek kaynaklar sınırlıdır.</strong> Bir bakteri kolonisi sonsuza dek ikiye katlanamaz; sonunda besin, alan ya da oksijen biter. Lojistik denklem en basit düzeltmedir — üstel olarak başlayan ama ortamın <em>taşıma kapasitesi</em> K'da doyan büyüme. Popülasyonları, hastalıkların yayılmasını, yeni teknolojilerin benimsenmesini ve kimyasal reaksiyonların doymasını modeller.</div>

<div class="calc-formula"><div class="formula-label">LOJİSTİK DENKLEM</div><div class="formula-main">$$\\frac{dP}{dt} = r P \\left(1 - \\frac{P}{K}\\right)$$</div><div class="formula-sub">r > 0 içsel büyüme hızı, K taşıma kapasitesi. P ≪ K iken denklem dP/dt ≈ rP'ye indirgenir (üstel büyüme); P → K iken parantez → 0 ve büyüme durur.</div></div>

<p class="l-text"><strong>İki uç rejim.</strong></p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Küçük popülasyon (P ≪ K)</div><div class="card-body">1 − P/K çarpanı 1'e yakındır. Denklem dP/dt ≈ rP olur, saf üstel büyüme. P, (ln 2)/r zaman birimi başına ikiye katlanır.</div></div>
<div class="calc-card"><div class="card-title">Taşıma kapasitesine yakın (P ≈ K)</div><div class="card-body">1 − P/K çarpanı 0'a yaklaşır. Büyüme hızı sıfıra düşer. P, K'da — ortamın sürdürülebilir maksimum popülasyonunda — platoya ulaşır.</div></div>
<div class="calc-card"><div class="card-title">Dengeler</div><div class="card-body">dP/dt = 0 ya P = 0 (yok oluş, kararsız) ya da P = K (taşıma kapasitesi, kararlı) için sağlanır. Pozitif herhangi bir başlangıç popülasyonu K'ya çekilir.</div></div>
</div>

<p class="l-text"><strong>Ayırma ile çözüm.</strong> Denklem ayrılabilirdir ama y-integrali kısmi kesirler ister:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Değişkenleri ayır</div><div class="step-detail">dP / [P(1 − P/K)] = r dt.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Sol tarafı kısmi kesirlere ayır</div><div class="step-detail">1/[P(1 − P/K)] = 1/P + 1/(K − P) · (burada ikinci terimin pay ve paydasını K ile çarparak standart forma getiririz). Birleştirerek doğrula: 1/P + 1/(K − P) = (K − P + P)/[P(K − P)] = K/[P(K − P)], bu da K'yı dağıttıktan sonra 1/[P(1 − P/K)]'ya eşittir. ✓</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Her iki tarafı integre et</div><div class="step-detail">∫(1/P + 1/(K − P)) dP = ln|P| − ln|K − P| = ln|P/(K − P)|. Sağ taraf: ∫r dt = rt + C₁.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Üs al ve P için çöz</div><div class="step-detail">P/(K − P) = A·e^{rt}; burada A = e^{C₁}. Cebirsel olarak çöz: P = K·A·e^{rt}/(1 + A·e^{rt}). P(0) = P₀ uygula: A = P₀/(K − P₀).</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">LOJİSTİK ÇÖZÜM (SİGMOİD)</div><div class="formula-main">$$P(t) = \\frac{K}{1 + \\left(\\dfrac{K - P_0}{P_0}\\right) e^{-rt}}$$</div><div class="formula-sub">Ünlü S-eğrisi. P₀ yakınında başlar, P ≪ K iken üstel büyür ve t → ∞ iken K'da doyar.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — BİR ERLEN'DE BAKTERİLER</div><div class="example-body">Bir erlen en fazla K = 10⁹ bakteri taşıyabilir. Başlangıç kolonisi P₀ = 10⁵, içsel büyüme r = 1 / saat. Koloni ne zaman yarı kapasiteye (P = K/2) ulaşır?<br><br>Çözümden: K/2 = K / (1 + ((K − P₀)/P₀) e^{−rt}), dolayısıyla 1 + ((K − P₀)/P₀) e^{−rt} = 2, yani e^{−rt} = P₀/(K − P₀).<br><br>Sayıları yerleştirince: e^{−t} ≈ 10⁵/(10⁹ − 10⁵) ≈ 10⁻⁴, dolayısıyla t = −ln(10⁻⁴) = 4·ln 10 ≈ <strong>9.21 saat</strong>.<br><br>Yani yaklaşık 9 saat sonra popülasyon yarı doymuştur; bir kez daha ikiye katlanmak yalnızca K'ya ulaşmak için gereken birkaç saat alır. Sigmoid'in "tekmesi" uçlarında değil, ortasındadır.</div></div>

<div class="calc-graph"><div id="plot-l1-logistic-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> K = 10, r = 1, P₀ = 0.1 ile lojistik çözüm (mavi, sigmoid) saf üstel büyüme e^{rt}·P₀ (turuncu, kesik) ile karşılaştırılıyor. Küçük t için iki eğri ayırt edilemez — lojistik yerel olarak üsteldir. Ama P, K'ya doğru büyüdükçe lojistik düzleşir ve gri kesikli taşıma-kapasitesi çizgisine oturur; saf üstel ise fiziksel olarak imkânsız bir şekilde sonsuza fırlamaya devam eder. Gerçek popülasyonlar her zaman mavi eğri gibi görünür, turuncu gibi değil.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[];for(var i=0;i<=100;i++)t.push(i*0.12);
var K=10,r=1,P0=0.1;var A=(K-P0)/P0;
var Pl=[],Pe=[];for(var i=0;i<t.length;i++){Pl.push(K/(1+A*Math.exp(-r*t[i])));Pe.push(P0*Math.exp(r*t[i]));}
var d1={x:t,y:Pl,mode:'lines',name:'lojistik (K\\'da doyar)',line:{color:'#3b82f6',width:2.6}};
var d2={x:t,y:Pe,mode:'lines',name:'saf üstel',line:{color:'#f59e0b',width:2.2,dash:'dash'}};
var d3={x:[0,12],y:[K,K],mode:'lines',name:'taşıma kapasitesi K',line:{color:'rgba(255,255,255,0.5)',width:1.5,dash:'dot'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'t',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,12]},yaxis:{title:'P(t)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[0,15]},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-logistic-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Sigmoid başka nerede görünür.</strong> Aynı S-eğrisi şunları tanımlar: SI modelinde bir salgının yayılması, yeni teknolojinin bir pazara difüzyonu, bir enzim reaksiyonunun doyması (Michaelis–Menten kinetiği) ve hatta bir ilacın yükleme dozu. Büyüme sert bir limitle karşılaştığı zaman bir sigmoid bekle.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Lojistik çözümde K → ∞ koyarsan (K − P₀)/P₀ katsayısı patlar ve (dikkatli limitlerden sonra) saf üstel P₀·e^{rt}'yi geri kazanırsın. Lojistik denklem, üstel modeli özel hal olarak kesin biçimde içerir.</div></div>

<h2 class="lesson-title">9. Varlık ve Teklik — Picard Teoremi (Kısaca)</h2>

<div class="calc-highlight"><strong>Herhangi bir ODE çözmeden önce sorman gereken iki soru: çözüm var mı ve tek mi?</strong> Yeterince düzgün f ile birinci mertebeden ODE'ler y' = f(x, y) için yanıt güven verici biçimde "evet ve evet"tir — Picard'ın varlık-ve-teklik teoremi bunun kesin ifadesidir.</div>

<div class="calc-formula"><div class="formula-label">PICARD–LINDELÖF TEOREMİ</div><div class="formula-main">$$\\text{If } f \\text{ and } \\partial f / \\partial y \\text{ are continuous in a rectangle around } (x_0, y_0),$$</div><div class="formula-sub">o zaman IVP y' = f(x, y), y(x₀) = y₀'ın x₀ etrafındaki bazı açık aralıkta tam olarak bir çözümü vardır.</div></div>

<p class="l-text">Bu koşul genellikle "f, y'de <strong>Lipschitz</strong>'tir" şeklinde ifade edilir; yani dikdörtgende |f(x, y₁) − f(x, y₂)| ≤ L · |y₁ − y₂| olacak şekilde bir L sabiti vardır. ∂f/∂y'nin sürekliliği uygun bir yeterli koşuldur (ortalama değer teoremiyle).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Varlık</div><div class="card-body">(x₀, y₀)'dan en az bir çözüm eğrisi geçer. Bu kısım için yalnızca f'nin sürekliliği yeterlidir (Peano teoremi); Lipschitz gerekmez.</div></div>
<div class="calc-card"><div class="card-title">Teklik</div><div class="card-body">(x₀, y₀)'dan tam olarak bir çözüm geçer. Bu Lipschitz koşulunu gerektirir. İki farklı çözüm, o noktada eğim alanının "bulanık" olduğu anlamına gelirdi — geometrik resimle çelişki.</div></div>
<div class="calc-card"><div class="card-title">Yerel, küresel değil</div><div class="card-body">Teorem yalnızca x₀ etrafındaki <em>bazı</em> açık aralıkta bir çözüm garanti eder. Çözüm, daha geniş bir tanım kümesine ulaşmadan sonsuza patlayabilir (y' = y², y(0) = 1 denkleminin çözümü y = 1/(1−x), x = 1'de patlar).</div></div>
</div>

<div class="calc-example"><div class="example-label">UYARICI ÖRNEK — TEKLİK BAŞARISIZ OLABİLİR</div><div class="example-body">Şu IVP'yi düşün: <em>y' = √y</em>, <em>y(0) = 0</em>. Burada f(x, y) = √y, (0, 0)'da süreklidir ama ∂f/∂y = 1/(2√y), y → 0⁺ iken patlar — Lipschitz değildir. İki farklı çözüm vardır:<br><br>(a) Tüm x için <em>y(x) ≡ 0</em> (sabit sıfır) ve<br>(b) x ≥ 0 için <em>y(x) = x²/4</em> (ve her türlü yamalı birleşim).<br><br>Doğrula: (b)'de y' = x/2 = √(x²/4) = x/2 ✓. (0, 0)'daki eğim alanı, başlangıç noktasından çıkan sonsuz sayıda eğriyi kabul eder; hepsi geçerli çözümdür. Bu, Picard'ın Lipschitz koşulunun dışladığı tam başarısızlık modudur.</div></div>

<div class="l-note"><strong>Bunun numerik açısından önemi.</strong> Bu dersteki çoğu mühendislik ODE'sinin sağ tarafı düzgündür ve iyi davranır. Ama tekil bir noktanın yakınında bir şey simüle ederken — sıfıra bölme, bir faz sınırı, bir şok dalgası — teklik başarısız olabilir ve sayısal çözücün küçücük başlangıç sapmalarına göre farklı yanıtlar verebilir. Picard'ı bilmek simülasyona ne zaman güveneceğini söyler.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">y' = −y/x (bölüm 3) için sağ tarafın x = 0'da tekilliği vardır. Picard, y eksenini içermeyen herhangi bir dikdörtgende teklik garanti eder. y = C/x çözümleri gerçekten de x > 0 ve x < 0 üzerinde ayrı yaşar — hiçbir çözüm x = 0'ı geçmez.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynamak için:</strong> soğutma bloğunda <code>k</code>'yı değiştir ve eğrinin hızlanıp yavaşladığını izle. Lojistik blokta <code>r = 0.3</code> ayarla; koloninin K'ya ulaşmasının çok daha uzun sürdüğünü fark et. P₀ = 15 başlangıcını (taşıma kapasitesinin üstünde) dene ve popülasyonun K'ya doğru <em>azaldığını</em> gözlemle — lojistik denklem K'da iki taraftan da kararlıdır.</p>

<h2 class="lesson-title">11. Özet ve Artık Yapabilecekleri</h2>

<p class="l-text">Bir derste birinci mertebeden ODE'lerin tüm araç kutusunu kapsadık. İşte tek sayfada tam zihinsel harita:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ODE'nin söylediği</div><div class="card-body">"İşte y'nin değişim hızının yerel kuralı." Çözüm, bu kural artı bir başlangıç koşulundan y'nin kendisini geri kazanır.</div><div class="card-formula">y' = f(x, y), y(x₀) = y₀</div></div>
<div class="calc-card"><div class="card-title">Eğim alanı</div><div class="card-body">Her (x, y)'de f eğiminde bir ok çiz. Çözüm eğrisi yerel okları izleyen herhangi bir eğridir.</div><div class="card-formula">teğet ↔ eğim = f</div></div>
<div class="calc-card"><div class="card-title">Ayrılabilen</div><div class="card-body">f = g(x)·h(y) ise ayır ve integre et. Newton soğutmasını, radyoaktif bozunumu, lojistik büyümeyi halleder.</div><div class="card-formula">∫dy/h(y) = ∫g(x) dx</div></div>
<div class="calc-card"><div class="card-title">Tam</div><div class="card-body">M dx + N dy = 0 için ∂M/∂y = ∂N/∂x ise çözüm bir F potansiyeli için F(x, y) = C.</div><div class="card-formula">∂M/∂y = ∂N/∂x</div></div>
<div class="calc-card"><div class="card-title">Doğrusal (μ yöntemi)</div><div class="card-body">y' + p y = q için μ = exp(∫p dx) ile çarp ki sol taraf (μy)' olsun. Sonra integre et.</div><div class="card-formula">μ = exp(∫p dx)</div></div>
<div class="calc-card"><div class="card-title">Newton soğutması</div><div class="card-body">T(t) = T_env + (T₀ − T_env)·e^{−kt}. Ortama üstel yaklaşım; zaman sabiti τ = 1/k.</div><div class="card-formula">T → T_env</div></div>
<div class="calc-card"><div class="card-title">RC şarjı</div><div class="card-body">V_C(t) = V_bat·(1 − e^{−t/τ}); τ = RC. Mühendisin yerleşme için "beş tau kuralı".</div><div class="card-formula">τ = RC</div></div>
<div class="calc-card"><div class="card-title">Lojistik büyüme</div><div class="card-body">P(t), K ile sınırlı bir sigmoiddir. Üstel başlar, taşıma kapasitesinde doyar.</div><div class="card-formula">dP/dt = rP(1 − P/K)</div></div>
<div class="calc-card"><div class="card-title">Picard</div><div class="card-body">Düzgün f ve y'de Lipschitz ⇒ her başlangıç noktasından tek çözüm. y' = √y, y(0) = 0 için başarısız olur.</div><div class="card-formula">|∂f/∂y| sınırlı</div></div>
</div>

<div class="l-warn"><strong>Sıradaki (Ders 2):</strong> <strong>ikinci mertebeden doğrusal ODE'lere</strong> geçiyoruz — harmonik osilatör, kütle-yay-sönümleyici sistemi ve LRC devresi. Aynı integral çarpanı felsefesi artı karakteristik denkleme dikkatli bir bakış, bize sönümsüz, kritik sönümlü ve aşırı sönümlü tepkileri verir. Sonra bu mekanik sistemleri Tacoma Narrows Köprüsü'nü perişan eden (ve sonunda devirdiği) rezonans olgularına bağlıyoruz.</div>`
};
