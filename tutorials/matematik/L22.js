window.LISE_MAT_L22 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A derivative is itself a function</strong> — so we can differentiate it again, and again, and again. This simple observation opens a whole new room in calculus. The second derivative $f''(x)$ measures how the slope of a graph changes. The third derivative $f'''(x)$ measures how that rate of change changes. From these "derivatives of derivatives" we read off the curvature of curves, the inflection points of graphs, and — most strikingly — the physical quantities of motion: velocity, acceleration, jerk and beyond.</p>

<p class="l-text">By the end of this lesson you will know how to compute $f''$, $f'''$, $f^{(n)}$ for polynomials, trig and exponential functions; you will recognise the cyclic pattern that $\\sin x$ and $\\cos x$ make under repeated differentiation; and you will be able to translate a position function $s(t)$ into the velocity $v(t) = s'(t)$ and acceleration $a(t) = s''(t)$ of a moving object. These ideas are the bridge from pure calculus to physics, and they appear on every Turkish university entrance exam from AYT to YKS-Sayısal.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and write higher-order derivative notation in three styles: prime ($f''$), Leibniz ($d^2y/dx^2$), and indexed ($f^{(n)}$)</li>
<li>Compute the second and third derivatives of polynomial, trigonometric and exponential functions accurately</li>
<li>Recognise the four-step cyclic pattern of the trig functions under repeated differentiation</li>
<li>Translate the physical chain position $\\to$ velocity $\\to$ acceleration $\\to$ jerk into the calculus operations $s \\to s' \\to s'' \\to s'''$</li>
<li>Derive and apply the kinematic equations of free fall starting from $s(t) = \\tfrac{1}{2} g t^2$</li>
<li>Find the closed form for the $n$-th derivative of $x^k$ and explain the factorial pattern</li>
</ul>
</div>

<h2 class="lesson-title">1. The Derivative as an Operator — A Quick Recap</h2>

<div class="calc-highlight"><strong>The operator viewpoint.</strong> Think of $\\dfrac{d}{dx}$ as a machine: it takes a function in, and gives a new function out. The function $f$ becomes $f'$. Because $f'$ is also a function, the same machine can take it in and produce $f''$. Iterating this process yields a whole tower of derivatives $f, f', f'', f''', \\ldots$ called the <em>higher-order derivatives</em> of $f$.</div>

<p class="l-text">In lessons 17–21 we treated $f'(x)$ as the slope of the tangent line — a single number attached to a single point. The new point of view is that $f'$ is a new function of $x$, with its own graph and its own slope at each point. The slope of that graph is precisely what $f''(x)$ measures.</p>

<div class="calc-formula"><div class="formula-label">THREE NOTATIONS FOR HIGHER-ORDER DERIVATIVES</div><div class="formula-main">$$f'(x), \\;\\; f''(x), \\;\\; f'''(x), \\;\\; f^{(4)}(x), \\;\\; \\ldots, \\;\\; f^{(n)}(x)$$ $$\\frac{dy}{dx}, \\;\\; \\frac{d^2y}{dx^2}, \\;\\; \\frac{d^3y}{dx^3}, \\;\\; \\ldots, \\;\\; \\frac{d^ny}{dx^n}$$</div><div class="formula-sub">Prime notation is compact but awkward past three primes. Leibniz notation $d^n y / dx^n$ generalises cleanly. Indexed notation $f^{(n)}$ is used when $n$ is variable or large.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prime notation</div><div class="card-body">$f', f'', f'''$ for the first three. After that we usually switch to $f^{(4)}, f^{(5)}, \\ldots$ to avoid counting marks. Note that $f^{(0)}$ means $f$ itself — zero differentiations.</div></div>
<div class="calc-card"><div class="card-title">Leibniz notation</div><div class="card-body">$\\dfrac{d^2 y}{dx^2}$ literally reads "the second derivative of $y$ with respect to $x$." The squared symbols are positional, not arithmetic: $d^2 y$ on top, $(dx)^2$ on the bottom.</div></div>
<div class="calc-card"><div class="card-title">Operator notation</div><div class="card-body">Writing $D = \\dfrac{d}{dx}$ lets us compose: $D^2 f = f''$, $D^n f = f^{(n)}$. Convenient when proving identities about repeated differentiation.</div></div>
</div>

<div class="l-note"><strong>Read carefully:</strong> $f^{(n)}(x)$ with the parentheses around the exponent means the $n$-th <em>derivative</em>, not the $n$-th <em>power</em>. So $f^{(2)}(x) = f''(x)$, while $f^2(x)$ usually means $f(x) \\cdot f(x)$. The parentheses are essential.</div>

<h2 class="lesson-title">2. The Second Derivative — Intuition</h2>

<div class="calc-highlight"><strong>What does $f''(x)$ tell you?</strong> Since $f''$ is the derivative of $f'$, it measures the <em>rate of change of the slope</em>. If $f''(x) > 0$, the slope is increasing — the graph curves <em>upward</em> (concave up). If $f''(x) < 0$, the slope is decreasing — the graph curves <em>downward</em> (concave down). If $f''(x) = 0$ exactly at one point and changes sign there, that point is an <em>inflection point</em>.</div>

<p class="l-text">A useful image: imagine driving along a road whose shape is the graph of $f$. Your forward direction at each instant is set by the slope $f'$. The way you steer — whether you are turning the wheel further to the right or further to the left — is set by $f''$. A flat straight road has $f'' = 0$. A bend that gets tighter has growing $|f''|$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$f''(x) > 0$ — concave up</div><div class="card-body">The graph holds water. The slope is increasing as $x$ grows. Parabola $y = x^2$ has $f'' = 2 > 0$ everywhere, so it opens upward.</div></div>
<div class="calc-card"><div class="card-title">$f''(x) < 0$ — concave down</div><div class="card-body">The graph spills water. The slope is decreasing. Parabola $y = -x^2$ has $f'' = -2 < 0$ everywhere, so it opens downward.</div></div>
<div class="calc-card"><div class="card-title">$f''(x) = 0$ with sign change</div><div class="card-body">Inflection point — the curvature flips from upward to downward (or vice versa). The function $y = x^3$ has $f''(x) = 6x$, which changes sign at $x = 0$. So $(0, 0)$ is an inflection point.</div></div>
</div>

<div class="calc-graph"><div id="plot-l22-fff-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $f(x) = x^3 - 3x$, its first derivative $f'(x) = 3x^2 - 3$, and its second derivative $f''(x) = 6x$ on the same axes. Where $f''$ is positive, $f$ is concave up (right half); where $f''$ is negative, $f$ is concave down (left half). The sign change of $f''$ at $x = 0$ marks the inflection point.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f1=[];var d1=[];var d2=[];
for(var i=-25;i<=25;i++){var x=i/10;xs.push(x);f1.push(x*x*x-3*x);d1.push(3*x*x-3);d2.push(6*x);}
var t1={x:xs,y:f1,mode:'lines',name:'f(x) = x³ − 3x',line:{color:'#3b82f6',width:3}};
var t2={x:xs,y:d1,mode:'lines',name:"f'(x) = 3x² − 3",line:{color:'#22c55e',width:2.5,dash:'dash'}};
var t3={x:xs,y:d2,mode:'lines',name:"f''(x) = 6x",line:{color:'#ef4444',width:2.5,dash:'dot'}};
var infl={x:[0],y:[0],mode:'markers+text',name:'inflection',marker:{color:'#f59e0b',size:12,symbol:'star'},text:['inflection'],textposition:'bottom right',textfont:{color:'#f59e0b',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.7,2.7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-16,16],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l22-fff-en',[t1,t2,t3,infl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">A QUICK MENTAL CHECK</div><div class="think-body">Look at the parabola $y = x^2$. The slope $f'(x) = 2x$ is negative on the left, zero at the bottom, positive on the right — it <em>grows</em> as $x$ grows. The rate at which it grows is constant: $f''(x) = 2$. So $f''$ is positive and constant, which matches the parabola's smooth uniform curvature.</div></div>

<h2 class="lesson-title">3. Computing the Second Derivative — Worked Examples</h2>

<div class="calc-highlight"><strong>The recipe is mechanical:</strong> apply the differentiation rules you learned in lessons 18–20 twice. After taking $f'(x)$, treat the result as a brand-new function and differentiate again to get $f''(x)$. Same for $f'''$ and beyond.</div>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — A POLYNOMIAL</div><div class="example-body"><strong>Find</strong> $f''(x)$ if $f(x) = 5x^4 - 2x^3 + 7x - 1$.<br><br>$f'(x) = 20x^3 - 6x^2 + 7$ (drop the constant, lower each exponent by one and multiply by the old exponent).<br>$f''(x) = 60x^2 - 12x$ (same rule applied to $f'$).<br><br>So $f''(x) = 60x^2 - 12x$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — TRIGONOMETRIC</div><div class="example-body"><strong>Find</strong> $f''(x)$ if $f(x) = \\sin x$.<br><br>$f'(x) = \\cos x$.<br>$f''(x) = -\\sin x = -f(x)$.<br><br>So $\\sin x$ is its own second derivative, up to a sign. This is the defining property of harmonic motion — we will use it later in physics applications. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — EXPONENTIAL</div><div class="example-body"><strong>Find</strong> $f''(x)$ if $f(x) = e^{2x}$.<br><br>By the chain rule, $f'(x) = 2 e^{2x}$.<br>Differentiating again, $f''(x) = 4 e^{2x}$.<br><br>In general $\\dfrac{d^n}{dx^n} e^{kx} = k^n e^{kx}$: differentiating $e^{kx}$ pulls out one factor of $k$ each time. The exponential never "uses itself up" under differentiation. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — PRODUCT FUNCTION</div><div class="example-body"><strong>Find</strong> $f''(x)$ if $f(x) = x^2 \\cos x$.<br><br>Product rule: $f'(x) = 2x \\cos x + x^2 \\cdot (-\\sin x) = 2x \\cos x - x^2 \\sin x$.<br><br>Differentiate $f'$ as a sum, each term by the product rule:<br>$\\dfrac{d}{dx}(2x \\cos x) = 2 \\cos x - 2x \\sin x$.<br>$\\dfrac{d}{dx}(x^2 \\sin x) = 2x \\sin x + x^2 \\cos x$.<br><br>Subtracting: $f''(x) = (2 \\cos x - 2x \\sin x) - (2x \\sin x + x^2 \\cos x) = (2 - x^2) \\cos x - 4x \\sin x$. $\\blacksquare$</div></div>

<h2 class="lesson-title">4. Third and Higher Derivatives — Jerk and Snap</h2>

<div class="calc-highlight"><strong>The third derivative</strong> of position with respect to time is called <em>jerk</em> (or sometimes <em>jolt</em>). It measures how acceleration is changing. The fourth, fifth, and sixth derivatives — used in engineering — are nicknamed <em>snap</em>, <em>crackle</em>, and <em>pop</em>. They show up in robotics, in roller-coaster design, and anywhere smooth motion matters.</div>

<p class="l-text">If you have ever been on a bus where the driver suddenly stamps the brake then releases it, you have felt jerk. The acceleration of the bus changed abruptly — and your body, used to steady acceleration, felt the change as an unpleasant jolt. Civil engineers design roller-coaster tracks specifically to limit jerk; smooth transitions feel "fun," sudden ones feel "wrong."</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Position $s(t)$</div><div class="card-body">Where you are at time $t$ — measured in metres.</div></div>
<div class="calc-card"><div class="card-title">Velocity $v(t) = s'(t)$</div><div class="card-body">How fast you are moving, with sign — m/s.</div></div>
<div class="calc-card"><div class="card-title">Acceleration $a(t) = s''(t)$</div><div class="card-body">How fast velocity changes — m/s². Felt by your body as a push.</div></div>
<div class="calc-card"><div class="card-title">Jerk $j(t) = s'''(t)$</div><div class="card-body">How fast acceleration changes — m/s³. Felt as a jolt.</div></div>
<div class="calc-card"><div class="card-title">Snap $s^{(4)}(t)$</div><div class="card-body">How fast jerk changes — m/s⁴. Used in cam design and high-precision robotics.</div></div>
<div class="calc-card"><div class="card-title">Crackle and pop</div><div class="card-body">$s^{(5)}$ and $s^{(6)}$. Rarely needed outside specialised engineering, but the chain continues indefinitely.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE — JERK OF A POLYNOMIAL</div><div class="example-body">A particle's position is $s(t) = t^4 - 6t^3 + 4t$ (in metres, $t$ in seconds). Find its jerk at $t = 2$ s.<br><br>$v(t) = s'(t) = 4t^3 - 18t^2 + 4$.<br>$a(t) = v'(t) = 12t^2 - 36t$.<br>$j(t) = a'(t) = 24t - 36$.<br><br>At $t = 2$: $j(2) = 24 \\cdot 2 - 36 = 12$ m/s³. The jerk is positive, meaning the acceleration is becoming more positive (or less negative) at that instant. $\\blacksquare$</div></div>

<div class="l-note"><strong>Why "jerk" is a real word.</strong> Engineers measure jerk because it is what your inner ear feels. A car accelerating at a steady 2 m/s² is comfortable. The same car suddenly braking from 2 m/s² to $-2$ m/s² over one second produces a jerk of $-4$ m/s³ — and that is what makes passengers lurch forward. Limiting jerk is what makes elevators "smooth."</div>

<h2 class="lesson-title">5. The Cyclic Behaviour of $\\sin x$</h2>

<div class="calc-highlight"><strong>A beautiful pattern:</strong> the derivatives of $\\sin x$ cycle through four functions and then return to where they started. After exactly four differentiations, you are back to $\\sin x$. This four-step cycle is the calculus shadow of the four phases of harmonic motion.</div>

<div class="calc-formula"><div class="formula-label">THE CYCLE OF SIN x</div><div class="formula-main">$$\\sin x \\;\\;\\xrightarrow{d/dx}\\;\\; \\cos x \\;\\;\\xrightarrow{d/dx}\\;\\; -\\sin x \\;\\;\\xrightarrow{d/dx}\\;\\; -\\cos x \\;\\;\\xrightarrow{d/dx}\\;\\; \\sin x$$</div><div class="formula-sub">Period 4. After $n$ differentiations the result equals $\\sin(x + n\\pi/2)$. The same rule holds for $\\cos x$, shifted by one position.</div></div>

<p class="l-text">Let us verify the cycle by computing each step explicitly:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 0 — the function</div><div class="card-body">$f(x) = \\sin x$. The starting point.</div></div>
<div class="calc-card"><div class="card-title">Step 1 — first derivative</div><div class="card-body">$f'(x) = \\cos x$. Lesson 20 told us this directly.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — second derivative</div><div class="card-body">$f''(x) = -\\sin x$. Differentiating $\\cos x$ gives $-\\sin x$.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — third derivative</div><div class="card-body">$f'''(x) = -\\cos x$. Differentiating $-\\sin x$ gives $-\\cos x$.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — fourth derivative</div><div class="card-body">$f^{(4)}(x) = \\sin x$. Differentiating $-\\cos x$ gives $\\sin x$. Back to the start!</div></div>
<div class="calc-card"><div class="card-title">Step 5 and beyond</div><div class="card-body">The cycle repeats: $f^{(5)} = \\cos x$, $f^{(6)} = -\\sin x$, etc. In general $f^{(n)} = \\sin(x + n\\pi/2)$.</div></div>
</div>

<p class="l-text"><strong>A useful exam shortcut.</strong> To find $f^{(n)}(x)$ for $f(x) = \\sin x$ when $n$ is large, just compute $n \\bmod 4$ — the remainder when $n$ is divided by 4. If the remainder is $0$ you get $\\sin x$; if $1$, $\\cos x$; if $2$, $-\\sin x$; if $3$, $-\\cos x$. So $f^{(100)}(x) = \\sin x$ (since $100 = 4 \\cdot 25$), $f^{(101)}(x) = \\cos x$, and so on. No need to differentiate one hundred times!</p>

<div class="calc-example"><div class="example-label">EXAMPLE — A QUICK CALCULATION</div><div class="example-body"><strong>Find</strong> $f^{(2026)}(x)$ if $f(x) = \\sin x$.<br><br>Compute $2026 \\bmod 4$. We have $2026 = 4 \\cdot 506 + 2$, so the remainder is $2$. Therefore $f^{(2026)}(x) = -\\sin x$. $\\blacksquare$</div></div>

<div class="l-note"><strong>The cosine cycle.</strong> Cosine satisfies the same rule, shifted by one step: $\\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x \\to \\cos x$. In closed form, $\\dfrac{d^n}{dx^n} \\cos x = \\cos(x + n\\pi/2)$.</div>

<h2 class="lesson-title">6. Motion: Position, Velocity, Acceleration</h2>

<div class="calc-highlight"><strong>The kinematic chain.</strong> When a particle moves along a line, its location at time $t$ is given by a function $s(t)$, called the <em>position</em>. The derivative $s'(t) = v(t)$ is the <em>velocity</em> — how fast and in which direction the particle is moving. The second derivative $s''(t) = v'(t) = a(t)$ is the <em>acceleration</em> — how fast the velocity is changing. This three-step chain is one of the most important applications of calculus.</div>

<p class="l-text">Each level has a clear physical meaning, a unit, and a sign convention. Positive $v$ means moving in the positive $x$ direction; negative $v$ means moving backwards. Positive $a$ means velocity is increasing (speeding up if $v > 0$, slowing down if $v < 0$). Reading the sign of $v$ and $a$ together tells you whether a particle is accelerating or decelerating.</p>

<div class="calc-formula"><div class="formula-label">KINEMATICS — THE THREE-LEVEL CHAIN</div><div class="formula-main">$$s(t) \\;\\;\\xrightarrow{\\frac{d}{dt}}\\;\\; v(t) = s'(t) \\;\\;\\xrightarrow{\\frac{d}{dt}}\\;\\; a(t) = s''(t) = v'(t)$$</div><div class="formula-sub">Position is metres. Velocity is metres per second. Acceleration is metres per second squared.</div></div>

<div class="calc-graph"><div id="plot-l22-motion-en" class="plotly-graph" style="height:520px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three stacked sub-graphs for a particle whose position is $s(t) = t^3 - 6t^2 + 9t$ m on $[0, 4]$ s. Top: position $s(t)$. Middle: velocity $v(t) = 3t^2 - 12t + 9$ m/s. Bottom: acceleration $a(t) = 6t - 12$ m/s². The velocity hits zero where the position reaches its local extrema; the acceleration changes sign where the velocity has its minimum.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ts=[];var ss=[];var vs=[];var as=[];
for(var i=0;i<=80;i++){var t=i/20;ts.push(t);ss.push(t*t*t-6*t*t+9*t);vs.push(3*t*t-12*t+9);as.push(6*t-12);}
var posT={x:ts,y:ss,mode:'lines',name:'s(t)',line:{color:'#3b82f6',width:3},xaxis:'x',yaxis:'y'};
var velT={x:ts,y:vs,mode:'lines',name:'v(t)',line:{color:'#22c55e',width:3},xaxis:'x2',yaxis:'y2'};
var accT={x:ts,y:as,mode:'lines',name:'a(t)',line:{color:'#ef4444',width:3},xaxis:'x3',yaxis:'y3'};
var zero1={x:[0,4],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false,xaxis:'x2',yaxis:'y2'};
var zero2={x:[0,4],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false,xaxis:'x3',yaxis:'y3'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
grid:{rows:3,columns:1,pattern:'independent'},
xaxis:{title:'',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'y'},
yaxis:{title:'s (m)',domain:[0.70,1.0],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},
xaxis2:{title:'',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'y2'},
yaxis2:{title:'v (m/s)',domain:[0.36,0.66],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},
xaxis3:{title:'t (s)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'y3'},
yaxis3:{title:'a (m/s²)',domain:[0.02,0.32],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},
margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l22-motion-en',[posT,velT,accT,zero1,zero2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">READING THE THREE GRAPHS TOGETHER</div><div class="think-body">Notice on the plot: the position $s(t)$ has a local maximum at $t = 1$ and a local minimum at $t = 3$. Exactly at those times the velocity $v(t)$ is zero — because at a maximum or minimum, the particle is instantaneously at rest. Between $t = 1$ and $t = 3$ the velocity is negative (particle moving backwards), and outside those times it is positive. The acceleration $a(t) = 6t - 12$ is zero at $t = 2$, which is where the velocity has its minimum — the instant of "transition" between decelerating and accelerating again.</div></div>

<h2 class="lesson-title">7. Worked Example: Free Fall</h2>

<div class="calc-highlight"><strong>The most famous kinematics example.</strong> A ball is dropped from rest near the surface of the Earth. Ignoring air resistance, gravity accelerates it at a constant $g \\approx 9.8$ m/s². Starting from this single physical fact and using calculus, we can derive everything else: its velocity at any time, its position at any time, and how far it falls in any chosen interval.</div>

<p class="l-text">Take the downward direction as positive, with the starting point at $s = 0$ at time $t = 0$ and initial velocity $v(0) = 0$. Physics says the acceleration is constant:</p>

<div class="calc-formula"><div class="formula-label">CONSTANT ACCELERATION OF FREE FALL</div><div class="formula-main">$$a(t) = g \\approx 9.8 \\text{ m/s}^2$$</div></div>

<p class="l-text"><strong>Working backwards from acceleration to velocity.</strong> We want a function $v(t)$ whose derivative is the constant $g$. The simplest such function is $v(t) = gt$, since $\\dfrac{d}{dt}(gt) = g$. We also need $v(0) = 0$, and indeed $g \\cdot 0 = 0$, so this choice works.</p>

<div class="calc-formula"><div class="formula-label">VELOCITY DURING FREE FALL</div><div class="formula-main">$$v(t) = g t$$</div><div class="formula-sub">After $t$ seconds of free fall, the ball is moving at $gt$ m/s downward. After 1 s: $\\approx 9.8$ m/s. After 2 s: $\\approx 19.6$ m/s. After 3 s: $\\approx 29.4$ m/s.</div></div>

<p class="l-text"><strong>Now go up one more level — from velocity to position.</strong> We want $s(t)$ whose derivative is $gt$. Recall from the power rule that $\\dfrac{d}{dt}\\left(\\dfrac{1}{2} g t^2\\right) = g t$. And $s(0) = 0$ matches our starting point.</p>

<div class="calc-formula"><div class="formula-label">POSITION DURING FREE FALL</div><div class="formula-main">$$s(t) = \\frac{1}{2} g t^2$$</div><div class="formula-sub">After 1 s the ball has fallen $\\approx 4.9$ m. After 2 s: $\\approx 19.6$ m. After 3 s: $\\approx 44.1$ m. After 10 s: $\\approx 490$ m.</div></div>

<p class="l-text"><strong>Verifying the chain.</strong> Differentiate $s(t) = \\tfrac{1}{2} g t^2$ once: $s'(t) = g t = v(t)$. Differentiate again: $s''(t) = g = a(t)$. The three functions form a consistent kinematic chain. Galileo's experimental discovery (1604) — that all objects fall with the same constant acceleration in vacuum — translates into this neat calculus relationship.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DROP FROM A TOWER</div><div class="example-body">A ball is dropped from rest from the top of a 80 m tower. Taking $g = 10$ m/s² for convenience, find: (a) the time it takes to hit the ground; (b) its velocity at the moment of impact.<br><br><strong>Position:</strong> $s(t) = \\tfrac{1}{2} \\cdot 10 \\cdot t^2 = 5 t^2$ m.<br><br>(a) Set $s(t) = 80$: $5 t^2 = 80$, so $t^2 = 16$, giving $t = 4$ s.<br>(b) Velocity: $v(t) = 10 t$. At $t = 4$: $v(4) = 40$ m/s.<br><br>The ball reaches the ground in 4 seconds at a downward velocity of 40 m/s. $\\blacksquare$</div></div>

<h2 class="lesson-title">8. The $n$-th Derivative of a Polynomial</h2>

<div class="calc-highlight"><strong>The power rule taken to the limit.</strong> For the monomial $f(x) = x^k$ with $k$ a positive integer, repeated differentiation produces a factorial pattern. After $k$ differentiations the result is just the constant $k!$. After more than $k$ differentiations the result is zero. Polynomials therefore have only <em>finitely many</em> nonzero derivatives — eventually they collapse to zero.</div>

<div class="calc-formula"><div class="formula-label">N-TH DERIVATIVE OF X^K</div><div class="formula-main">$$\\frac{d^n}{dx^n} x^k = \\begin{cases} \\dfrac{k!}{(k-n)!} \\, x^{k-n} & \\text{if } n \\leq k, \\\\[0.4em] 0 & \\text{if } n > k. \\end{cases}$$</div><div class="formula-sub">The coefficient $k(k-1)(k-2)\\cdots(k-n+1)$ is exactly $k!/(k-n)!$, a factorial ratio. When $n = k$ the answer is $k!$, a constant.</div></div>

<p class="l-text">Let us verify with $f(x) = x^5$:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$f(x) = x^5$</div><div class="card-body">Starting point.</div></div>
<div class="calc-card"><div class="card-title">$f'(x) = 5 x^4$</div><div class="card-body">Coefficient $5 = 5$.</div></div>
<div class="calc-card"><div class="card-title">$f''(x) = 20 x^3$</div><div class="card-body">Coefficient $5 \\cdot 4 = 20$.</div></div>
<div class="calc-card"><div class="card-title">$f'''(x) = 60 x^2$</div><div class="card-body">Coefficient $5 \\cdot 4 \\cdot 3 = 60$.</div></div>
<div class="calc-card"><div class="card-title">$f^{(4)}(x) = 120 x$</div><div class="card-body">Coefficient $5 \\cdot 4 \\cdot 3 \\cdot 2 = 120$.</div></div>
<div class="calc-card"><div class="card-title">$f^{(5)}(x) = 120 = 5!$</div><div class="card-body">The constant $5! = 120$. Differentiate once more and the result is $0$.</div></div>
</div>

<div class="l-note"><strong>Consequence for polynomials of degree $n$:</strong> if $P(x) = a_n x^n + \\ldots + a_0$, then $P^{(n)}(x) = n! \\, a_n$ (a constant) and $P^{(m)}(x) = 0$ for every $m > n$. Knowing the degree of a polynomial tells you exactly how many derivatives are nonzero.</div>

<div class="calc-example"><div class="example-label">EXAMPLE — A CLEAN APPLICATION</div><div class="example-body"><strong>Find</strong> the 10th derivative of $P(x) = 7 x^{12} - 3 x^5 + 4 x - 11$.<br><br>The $x^5$, $x$, and constant terms vanish after at most 5 differentiations (each $\\leq$ their degree). Only the $x^{12}$ term survives.<br><br>$\\dfrac{d^{10}}{dx^{10}}(7 x^{12}) = 7 \\cdot \\dfrac{12!}{2!} x^2 = 7 \\cdot \\dfrac{479001600}{2} x^2 = 7 \\cdot 239500800 \\cdot x^2 = 1676505600 \\, x^2$. $\\blacksquare$</div></div>

<h2 class="lesson-title">9. Practice Exercises</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — POLYNOMIAL SECOND DERIVATIVE</div><div class="example-body"><strong>Find</strong> $f''(x)$ for $f(x) = 4 x^5 - 3 x^4 + 2 x^2 - 7$.<br><br><em>Solution.</em><br>$f'(x) = 20 x^4 - 12 x^3 + 4 x$.<br>$f''(x) = 80 x^3 - 36 x^2 + 4$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — TRIG CYCLE</div><div class="example-body"><strong>Find</strong> $f^{(85)}(x)$ if $f(x) = \\cos x$.<br><br><em>Solution.</em> Compute $85 \\bmod 4$. $85 = 4 \\cdot 21 + 1$, remainder $1$. Cosine cycle: $\\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x \\to \\cos x$. After 1 step we get $-\\sin x$. So $f^{(85)}(x) = -\\sin x$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — KINEMATICS</div><div class="example-body">A particle moves along a line with position $s(t) = 2t^3 - 9t^2 + 12t$ m, $t$ in seconds. (a) Find $v(t)$ and $a(t)$. (b) At what times is the particle momentarily at rest? (c) What is the acceleration at $t = 3$ s?<br><br><em>Solution.</em><br>(a) $v(t) = 6t^2 - 18t + 12$, $a(t) = 12t - 18$.<br>(b) $v(t) = 0 \\Rightarrow 6(t^2 - 3t + 2) = 0 \\Rightarrow (t-1)(t-2) = 0 \\Rightarrow t = 1$ or $t = 2$ s.<br>(c) $a(3) = 36 - 18 = 18$ m/s². $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — FREE FALL</div><div class="example-body">A stone is dropped from rest from the top of a cliff. After exactly 3 seconds, it has fallen 44.1 m. Verify that the acceleration of gravity is $g = 9.8$ m/s².<br><br><em>Solution.</em> Free fall: $s(t) = \\tfrac{1}{2} g t^2$. Plug in $t = 3$, $s = 44.1$: $44.1 = \\tfrac{1}{2} \\cdot g \\cdot 9$, so $g = \\dfrac{2 \\cdot 44.1}{9} = \\dfrac{88.2}{9} = 9.8$ m/s². Matches the accepted value. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — JERK</div><div class="example-body">If $s(t) = t^4 - 4t^3 + 6t^2$, find the jerk $j(t)$ and evaluate it at $t = 1$ s.<br><br><em>Solution.</em><br>$v(t) = 4t^3 - 12t^2 + 12t$.<br>$a(t) = 12t^2 - 24t + 12$.<br>$j(t) = a'(t) = 24t - 24$.<br>$j(1) = 24 - 24 = 0$ m/s³. The acceleration is instantaneously constant at $t = 1$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — N-TH DERIVATIVE OF EXPONENTIAL</div><div class="example-body"><strong>Find</strong> the $n$-th derivative of $f(x) = e^{3x}$, and use it to find $f^{(7)}(0)$.<br><br><em>Solution.</em> By the rule $\\dfrac{d^n}{dx^n} e^{kx} = k^n e^{kx}$: $f^{(n)}(x) = 3^n e^{3x}$. At $x = 0$: $f^{(7)}(0) = 3^7 \\cdot e^0 = 2187$. $\\blacksquare$</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The derivative is an operator: applied to $f$ it returns $f'$, applied again it returns $f''$, and so on indefinitely</li>
<li>Notations: prime ($f''$), Leibniz ($d^2 y / dx^2$), indexed ($f^{(n)}$). All mean the same thing</li>
<li><strong>$f''(x)$</strong> measures curvature: positive $\\Rightarrow$ concave up; negative $\\Rightarrow$ concave down; sign change $\\Rightarrow$ inflection point</li>
<li>Trigonometric functions cycle with period 4 under differentiation. Use $n \\bmod 4$ to find $\\sin^{(n)}$, $\\cos^{(n)}$ in one step</li>
<li>Polynomial: $\\dfrac{d^n}{dx^n} x^k = \\dfrac{k!}{(k-n)!} x^{k-n}$ when $n \\leq k$, and zero when $n > k$</li>
<li><strong>Kinematics:</strong> position $s(t) \\Rightarrow$ velocity $v(t) = s'(t) \\Rightarrow$ acceleration $a(t) = s''(t) \\Rightarrow$ jerk $j(t) = s'''(t)$</li>
<li><strong>Free fall:</strong> $a = g$ constant $\\Rightarrow v = gt \\Rightarrow s = \\tfrac{1}{2} g t^2$. One physical fact, two differentiations</li>
<li>Next lesson: applying the second derivative to find extrema and inflection points of arbitrary functions</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Türev başlı başına bir fonksiyondur</strong> — yani onu tekrar tekrar türetebiliriz. Bu basit gözlem, kalkülüste bambaşka bir kapı açar. İkinci türev $f''(x)$, bir grafiğin eğiminin nasıl değiştiğini ölçer. Üçüncü türev $f'''(x)$, o değişim hızının nasıl değiştiğini ölçer. Bu "türevlerin türevlerinden" eğrilerin bükülmesini, grafiklerin dönüm noktalarını ve — en çarpıcısı — hareketin fiziksel büyüklüklerini okuruz: hız, ivme, sarsıntı ve ötesi.</p>

<p class="l-text">Bu dersin sonunda polinom, trigonometrik ve üstel fonksiyonların $f''$, $f'''$, $f^{(n)}$ türevlerini hesaplamayı; $\\sin x$ ve $\\cos x$'in tekrarlı türev altında oluşturduğu döngüsel deseni tanımayı; bir konum fonksiyonu $s(t)$'yi hareketli bir cismin hız $v(t) = s'(t)$ ve ivme $a(t) = s''(t)$ fonksiyonlarına çevirmeyi öğreneceksin. Bu fikirler saf kalkülüsten fiziğe köprü kurar ve AYT'den YKS-Sayısal'a kadar her Türk üniversite giriş sınavında karşına çıkar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yüksek mertebe türev gösterimini üç biçimde okuyup yazmayı: üs ($f''$), Leibniz ($d^2y/dx^2$), indeksli ($f^{(n)}$)</li>
<li>Polinom, trigonometrik ve üstel fonksiyonların ikinci ve üçüncü türevlerini doğru hesaplamayı</li>
<li>Trig fonksiyonların tekrarlı türev altındaki dört adımlı döngüsel desenini tanımayı</li>
<li>Konum $\\to$ hız $\\to$ ivme $\\to$ sarsıntı fiziksel zincirini $s \\to s' \\to s'' \\to s'''$ kalkülüs işlemlerine çevirmeyi</li>
<li>$s(t) = \\tfrac{1}{2} g t^2$ formülünden başlayarak serbest düşüş kinematik denklemlerini türetip uygulamayı</li>
<li>$x^k$'nın $n$-inci türevi için kapalı form bulmayı ve faktöriyel desenini açıklamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Operatör Olarak Türev — Kısa Hatırlatma</h2>

<div class="calc-highlight"><strong>Operatör bakış açısı.</strong> $\\dfrac{d}{dx}$'i bir makine olarak düşün: içine bir fonksiyon koyarsın, dışarı yeni bir fonksiyon çıkar. $f$ fonksiyonu $f'$ olur. $f'$ de bir fonksiyon olduğu için, aynı makine onu da alıp $f''$ üretebilir. Bu süreci tekrarlayarak $f, f', f'', f''', \\ldots$ türevlerinden oluşan bir kule elde ederiz; bunlara $f$'in <em>yüksek mertebe türevleri</em> denir.</div>

<p class="l-text">17–21. derslerde $f'(x)$'i teğet doğrunun eğimi — tek bir noktaya bağlı tek bir sayı — olarak işledik. Yeni bakış açısı $f'$'nin de $x$'in bir fonksiyonu olduğu; kendi grafiği, her noktada kendi eğimi var. Bu grafiğin eğimi tam olarak $f''(x)$'in ölçtüğü şeydir.</p>

<div class="calc-formula"><div class="formula-label">YÜKSEK MERTEBE TÜREVLERİN ÜÇ GÖSTERİMİ</div><div class="formula-main">$$f'(x), \\;\\; f''(x), \\;\\; f'''(x), \\;\\; f^{(4)}(x), \\;\\; \\ldots, \\;\\; f^{(n)}(x)$$ $$\\frac{dy}{dx}, \\;\\; \\frac{d^2y}{dx^2}, \\;\\; \\frac{d^3y}{dx^3}, \\;\\; \\ldots, \\;\\; \\frac{d^ny}{dx^n}$$</div><div class="formula-sub">Üs gösterimi kompakttır ama üç üsten sonra okunması zorlaşır. Leibniz gösterimi $d^n y / dx^n$ temiz biçimde genelleşir. İndeksli gösterim $f^{(n)}$, $n$ değişken veya büyük olduğunda kullanılır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Üs gösterimi</div><div class="card-body">İlk üç türev için $f', f'', f'''$. Sonrasında işaretleri saymamak için genellikle $f^{(4)}, f^{(5)}, \\ldots$'a geçeriz. Not: $f^{(0)}$, $f$'in kendisi anlamına gelir — sıfır türev.</div></div>
<div class="calc-card"><div class="card-title">Leibniz gösterimi</div><div class="card-body">$\\dfrac{d^2 y}{dx^2}$ kelimesi kelimesine "$y$'nin $x$'e göre ikinci türevi" diye okunur. Karesi semboller konumsaldır, aritmetik değildir: üstte $d^2 y$, altta $(dx)^2$.</div></div>
<div class="calc-card"><div class="card-title">Operatör gösterimi</div><div class="card-body">$D = \\dfrac{d}{dx}$ yazmak bileşmeye olanak verir: $D^2 f = f''$, $D^n f = f^{(n)}$. Tekrarlı türev üzerine özdeşlikler kanıtlarken kullanışlıdır.</div></div>
</div>

<div class="l-note"><strong>Dikkatli oku:</strong> Üsteki parantezli $f^{(n)}(x)$, $n$-inci <em>türev</em> demektir, $n$-inci <em>kuvvet</em> değil. Yani $f^{(2)}(x) = f''(x)$, ama $f^2(x)$ genellikle $f(x) \\cdot f(x)$ anlamına gelir. Parantez kritiktir.</div>

<h2 class="lesson-title">2. İkinci Türev — Sezgi</h2>

<div class="calc-highlight"><strong>$f''(x)$ sana ne söyler?</strong> $f''$, $f'$'nin türevi olduğundan, <em>eğimin değişim oranını</em> ölçer. $f''(x) > 0$ ise eğim artıyor demektir — grafik <em>yukarı</em> bükülür (yukarı içbükey). $f''(x) < 0$ ise eğim azalıyordur — grafik <em>aşağı</em> bükülür (aşağı içbükey). $f''(x) = 0$ olup tam o noktada işaret değiştiriyorsa, orası bir <em>dönüm noktasıdır</em>.</div>

<p class="l-text">Faydalı bir görüntü: kendini $f$ grafiğine benzeyen bir yolda araç sürerken hayal et. Her anki yön $f'$ eğimi ile belirlenir. Direksiyonu nasıl çevirdiğin — daha sağa mı daha sola mı çeviriyorsun — $f''$ tarafından belirlenir. Düz, dümdüz bir yolda $f'' = 0$'dır. Giderek sertleşen bir virajda $|f''|$ büyür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$f''(x) > 0$ — yukarı içbükey</div><div class="card-body">Grafik su tutar. $x$ büyürken eğim artar. $y = x^2$ parabolünün her yerde $f'' = 2 > 0$'dır, bu yüzden yukarı açılır.</div></div>
<div class="calc-card"><div class="card-title">$f''(x) < 0$ — aşağı içbükey</div><div class="card-body">Grafik suyu döker. Eğim azalır. $y = -x^2$ parabolünün her yerde $f'' = -2 < 0$'dır, aşağı açılır.</div></div>
<div class="calc-card"><div class="card-title">$f''(x) = 0$, işaret değişimi</div><div class="card-body">Dönüm noktası — bükülüm yukarıdan aşağıya (ya da tersine) çevrilir. $y = x^3$ fonksiyonunda $f''(x) = 6x$, $x = 0$'da işaret değiştirir. Yani $(0, 0)$ bir dönüm noktasıdır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l22-fff-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $f(x) = x^3 - 3x$ fonksiyonu, birinci türevi $f'(x) = 3x^2 - 3$ ve ikinci türevi $f''(x) = 6x$ aynı eksenler üzerinde. $f''$ pozitifken (sağ yarı) $f$ yukarı içbükey; $f''$ negatifken (sol yarı) $f$ aşağı içbükey. $x = 0$'da $f''$'nün işaret değişimi dönüm noktasını işaretler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f1=[];var d1=[];var d2=[];
for(var i=-25;i<=25;i++){var x=i/10;xs.push(x);f1.push(x*x*x-3*x);d1.push(3*x*x-3);d2.push(6*x);}
var t1={x:xs,y:f1,mode:'lines',name:'f(x) = x³ − 3x',line:{color:'#3b82f6',width:3}};
var t2={x:xs,y:d1,mode:'lines',name:"f'(x) = 3x² − 3",line:{color:'#22c55e',width:2.5,dash:'dash'}};
var t3={x:xs,y:d2,mode:'lines',name:"f''(x) = 6x",line:{color:'#ef4444',width:2.5,dash:'dot'}};
var infl={x:[0],y:[0],mode:'markers+text',name:'dönüm',marker:{color:'#f59e0b',size:12,symbol:'star'},text:['dönüm'],textposition:'bottom right',textfont:{color:'#f59e0b',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.7,2.7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-16,16],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l22-fff-tr',[t1,t2,t3,infl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KISA ZİHİNSEL KONTROL</div><div class="think-body">$y = x^2$ parabolüne bak. Eğim $f'(x) = 2x$ solda negatif, en altta sıfır, sağda pozitif — $x$ büyüdükçe <em>artıyor</em>. Artış hızı sabittir: $f''(x) = 2$. Yani $f''$ pozitif ve sabittir, bu da parabolün düzgün üniform bükülmesi ile uyumludur.</div></div>

<h2 class="lesson-title">3. İkinci Türev Hesaplama — Örnekler</h2>

<div class="calc-highlight"><strong>Tarif mekaniktir:</strong> 18–20. derslerde öğrendiğin türev kurallarını iki kez uygula. $f'(x)$'i aldıktan sonra sonucu yepyeni bir fonksiyon gibi düşünüp tekrar türev al, $f''(x)$ elde et. $f'''$ ve ötesi için aynı.</div>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — POLİNOM</div><div class="example-body"><strong>Bul:</strong> $f(x) = 5x^4 - 2x^3 + 7x - 1$ ise $f''(x)$.<br><br>$f'(x) = 20x^3 - 6x^2 + 7$ (sabiti at, her üssü bir azalt ve eski üsle çarp).<br>$f''(x) = 60x^2 - 12x$ (aynı kural $f'$'ye uygulandı).<br><br>Yani $f''(x) = 60x^2 - 12x$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — TRİGONOMETRİK</div><div class="example-body"><strong>Bul:</strong> $f(x) = \\sin x$ ise $f''(x)$.<br><br>$f'(x) = \\cos x$.<br>$f''(x) = -\\sin x = -f(x)$.<br><br>Yani $\\sin x$, işaret farkıyla kendi ikinci türevidir. Bu, harmonik hareketin tanımlayıcı özelliğidir — fizik uygulamalarında ileride kullanacağız. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — ÜSTEL</div><div class="example-body"><strong>Bul:</strong> $f(x) = e^{2x}$ ise $f''(x)$.<br><br>Zincir kuralı: $f'(x) = 2 e^{2x}$.<br>Tekrar türev alarak $f''(x) = 4 e^{2x}$.<br><br>Genel olarak $\\dfrac{d^n}{dx^n} e^{kx} = k^n e^{kx}$: $e^{kx}$'i türevlemek her seferinde bir $k$ faktörü dışarı çıkarır. Üstel, türev altında asla "tükenmez". $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — ÇARPIM FONKSİYONU</div><div class="example-body"><strong>Bul:</strong> $f(x) = x^2 \\cos x$ ise $f''(x)$.<br><br>Çarpım kuralı: $f'(x) = 2x \\cos x + x^2 \\cdot (-\\sin x) = 2x \\cos x - x^2 \\sin x$.<br><br>$f'$'yi toplam olarak ele al, her terimi çarpım kuralıyla türevle:<br>$\\dfrac{d}{dx}(2x \\cos x) = 2 \\cos x - 2x \\sin x$.<br>$\\dfrac{d}{dx}(x^2 \\sin x) = 2x \\sin x + x^2 \\cos x$.<br><br>Çıkararak: $f''(x) = (2 \\cos x - 2x \\sin x) - (2x \\sin x + x^2 \\cos x) = (2 - x^2) \\cos x - 4x \\sin x$. $\\blacksquare$</div></div>

<h2 class="lesson-title">4. Üçüncü ve Daha Yüksek Türevler — Sarsıntı ve Snap</h2>

<div class="calc-highlight"><strong>Konumun zamana göre üçüncü türevi</strong> <em>sarsıntı</em> (jerk) olarak adlandırılır. İvmenin nasıl değiştiğini ölçer. Mühendislikte kullanılan dördüncü, beşinci ve altıncı türevlere <em>snap</em>, <em>crackle</em> ve <em>pop</em> takma adları verilmiştir. Robotikte, hız treni tasarımında ve pürüzsüz hareketin önemli olduğu her yerde karşımıza çıkarlar.</div>

<p class="l-text">Otobüs şoförünün aniden frene basıp bıraktığı bir yolculuk yaşadıysan, sarsıntıyı hissettin demektir. Otobüsün ivmesi aniden değişti — düzenli ivmeye alışmış bedenin değişimi rahatsız edici bir sarsıntı olarak algıladı. İnşaat mühendisleri, hız treni raylarını özellikle sarsıntıyı sınırlayacak şekilde tasarlar; pürüzsüz geçişler "eğlenceli", ani geçişler "yanlış" hissettirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Konum $s(t)$</div><div class="card-body">$t$ anında nerede olduğun — metre cinsinden ölçülür.</div></div>
<div class="calc-card"><div class="card-title">Hız $v(t) = s'(t)$</div><div class="card-body">Ne kadar hızlı, hangi yönde hareket ettiğin — m/s.</div></div>
<div class="calc-card"><div class="card-title">İvme $a(t) = s''(t)$</div><div class="card-body">Hızın ne kadar hızlı değiştiği — m/s². Bedenin tarafından itme olarak hissedilir.</div></div>
<div class="calc-card"><div class="card-title">Sarsıntı $j(t) = s'''(t)$</div><div class="card-body">İvmenin ne kadar hızlı değiştiği — m/s³. Sarsıntı olarak hissedilir.</div></div>
<div class="calc-card"><div class="card-title">Snap $s^{(4)}(t)$</div><div class="card-body">Sarsıntının ne kadar hızlı değiştiği — m/s⁴. Kam tasarımında ve yüksek hassasiyetli robotikte kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Crackle ve pop</div><div class="card-body">$s^{(5)}$ ve $s^{(6)}$. Özel mühendislik dışında nadiren gerekir, ama zincir sınırsız uzar.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — POLİNOMUN SARSINTISI</div><div class="example-body">Bir parçacığın konumu $s(t) = t^4 - 6t^3 + 4t$ (metre, $t$ saniye). $t = 2$ s anındaki sarsıntısını bul.<br><br>$v(t) = s'(t) = 4t^3 - 18t^2 + 4$.<br>$a(t) = v'(t) = 12t^2 - 36t$.<br>$j(t) = a'(t) = 24t - 36$.<br><br>$t = 2$'de: $j(2) = 24 \\cdot 2 - 36 = 12$ m/s³. Sarsıntı pozitif, yani o anda ivme daha pozitife (ya da daha az negatife) doğru gidiyor. $\\blacksquare$</div></div>

<div class="l-note"><strong>"Sarsıntı" neden gerçek bir kavram?</strong> Mühendisler sarsıntıyı ölçer çünkü iç kulağın hissettiği şey budur. Sabit 2 m/s² ile hızlanan bir araba konforludur. Aynı arabanın 2 m/s²'den $-2$ m/s²'ye bir saniyede aniden frene basması, $-4$ m/s³'lük bir sarsıntı üretir — ve yolcuları öne savuran tam olarak budur. Sarsıntıyı sınırlandırmak, asansörü "pürüzsüz" kılan şeydir.</div>

<h2 class="lesson-title">5. $\\sin x$'in Döngüsel Davranışı</h2>

<div class="calc-highlight"><strong>Güzel bir desen:</strong> $\\sin x$'in türevleri dört fonksiyon arasında dönüp dururlar ve sonra başlangıca dönerler. Tam dört türevden sonra $\\sin x$'e geri varırsın. Bu dört adımlı döngü, harmonik hareketin dört evresinin kalkülüstaki gölgesidir.</div>

<div class="calc-formula"><div class="formula-label">SIN X'İN DÖNGÜSÜ</div><div class="formula-main">$$\\sin x \\;\\;\\xrightarrow{d/dx}\\;\\; \\cos x \\;\\;\\xrightarrow{d/dx}\\;\\; -\\sin x \\;\\;\\xrightarrow{d/dx}\\;\\; -\\cos x \\;\\;\\xrightarrow{d/dx}\\;\\; \\sin x$$</div><div class="formula-sub">Periyot 4. $n$ türev sonra sonuç $\\sin(x + n\\pi/2)$'ye eşittir. Aynı kural $\\cos x$ için de geçerlidir, bir konum kaymıştır.</div></div>

<p class="l-text">Her adımı tek tek hesaplayarak döngüyü doğrulayalım:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 0 — fonksiyon</div><div class="card-body">$f(x) = \\sin x$. Başlangıç noktası.</div></div>
<div class="calc-card"><div class="card-title">Adım 1 — birinci türev</div><div class="card-body">$f'(x) = \\cos x$. 20. ders bunu doğrudan söyledi.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — ikinci türev</div><div class="card-body">$f''(x) = -\\sin x$. $\\cos x$'in türevi $-\\sin x$'dir.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — üçüncü türev</div><div class="card-body">$f'''(x) = -\\cos x$. $-\\sin x$'in türevi $-\\cos x$'dir.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — dördüncü türev</div><div class="card-body">$f^{(4)}(x) = \\sin x$. $-\\cos x$'in türevi $\\sin x$'dir. Başlangıca dönüldü!</div></div>
<div class="calc-card"><div class="card-title">Adım 5 ve ötesi</div><div class="card-body">Döngü tekrarlar: $f^{(5)} = \\cos x$, $f^{(6)} = -\\sin x$ vs. Genelde $f^{(n)} = \\sin(x + n\\pi/2)$.</div></div>
</div>

<p class="l-text"><strong>Faydalı sınav kısayolu.</strong> $f(x) = \\sin x$ için $n$ büyük olduğunda $f^{(n)}(x)$'i bulmak için, sadece $n \\bmod 4$'ü — $n$'in 4'e bölümünden kalanı — hesapla. Kalan $0$ ise $\\sin x$ çıkar; $1$ ise $\\cos x$; $2$ ise $-\\sin x$; $3$ ise $-\\cos x$. Yani $f^{(100)}(x) = \\sin x$ ($100 = 4 \\cdot 25$ olduğundan), $f^{(101)}(x) = \\cos x$ vs. Yüz kez türev almaya gerek yok!</p>

<div class="calc-example"><div class="example-label">ÖRNEK — HIZLI BİR HESAP</div><div class="example-body"><strong>Bul:</strong> $f(x) = \\sin x$ ise $f^{(2026)}(x)$.<br><br>$2026 \\bmod 4$'ü hesapla. $2026 = 4 \\cdot 506 + 2$, yani kalan $2$. O halde $f^{(2026)}(x) = -\\sin x$. $\\blacksquare$</div></div>

<div class="l-note"><strong>Kosinüs döngüsü.</strong> Kosinüs aynı kuralı bir adım kaymış olarak sağlar: $\\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x \\to \\cos x$. Kapalı biçimde $\\dfrac{d^n}{dx^n} \\cos x = \\cos(x + n\\pi/2)$.</div>

<h2 class="lesson-title">6. Hareket: Konum, Hız, İvme</h2>

<div class="calc-highlight"><strong>Kinematik zinciri.</strong> Bir parçacık bir doğru boyunca hareket ettiğinde $t$ anındaki yeri $s(t)$ fonksiyonu ile verilir; buna <em>konum</em> denir. Türevi $s'(t) = v(t)$, <em>hızdır</em> — parçacığın ne kadar hızlı ve hangi yönde hareket ettiği. İkinci türev $s''(t) = v'(t) = a(t)$, <em>ivmedir</em> — hızın ne kadar hızlı değiştiği. Bu üç adımlı zincir, kalkülüsün en önemli uygulamalarından biridir.</div>

<p class="l-text">Her seviyenin net bir fiziksel anlamı, birimi ve işaret kuralı vardır. Pozitif $v$, pozitif $x$ yönünde hareket; negatif $v$, geriye hareket. Pozitif $a$, hızın arttığını (yani $v > 0$ ise hızlanma, $v < 0$ ise yavaşlama) gösterir. $v$ ile $a$'nın işaretlerini birlikte okumak, parçacığın hızlanıp hızlanmadığını söyler.</p>

<div class="calc-formula"><div class="formula-label">KİNEMATİK — ÜÇ SEVİYELİ ZİNCİR</div><div class="formula-main">$$s(t) \\;\\;\\xrightarrow{\\frac{d}{dt}}\\;\\; v(t) = s'(t) \\;\\;\\xrightarrow{\\frac{d}{dt}}\\;\\; a(t) = s''(t) = v'(t)$$</div><div class="formula-sub">Konum metre. Hız saniyede metre. İvme saniye karesinde metre.</div></div>

<div class="calc-graph"><div id="plot-l22-motion-tr" class="plotly-graph" style="height:520px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $s(t) = t^3 - 6t^2 + 9t$ m konumlu bir parçacık için $[0, 4]$ s aralığında üst üste üç alt-grafik. Üstte: konum $s(t)$. Ortada: hız $v(t) = 3t^2 - 12t + 9$ m/s. Altta: ivme $a(t) = 6t - 12$ m/s². Hız, konumun yerel uç noktalarına ulaştığı yerlerde sıfırdır; ivme, hızın minimumuna sahip olduğu yerde işaret değiştirir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ts=[];var ss=[];var vs=[];var as=[];
for(var i=0;i<=80;i++){var t=i/20;ts.push(t);ss.push(t*t*t-6*t*t+9*t);vs.push(3*t*t-12*t+9);as.push(6*t-12);}
var posT={x:ts,y:ss,mode:'lines',name:'s(t)',line:{color:'#3b82f6',width:3},xaxis:'x',yaxis:'y'};
var velT={x:ts,y:vs,mode:'lines',name:'v(t)',line:{color:'#22c55e',width:3},xaxis:'x2',yaxis:'y2'};
var accT={x:ts,y:as,mode:'lines',name:'a(t)',line:{color:'#ef4444',width:3},xaxis:'x3',yaxis:'y3'};
var zero1={x:[0,4],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false,xaxis:'x2',yaxis:'y2'};
var zero2={x:[0,4],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.2)',width:1},showlegend:false,xaxis:'x3',yaxis:'y3'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},
grid:{rows:3,columns:1,pattern:'independent'},
xaxis:{title:'',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'y'},
yaxis:{title:'s (m)',domain:[0.70,1.0],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},
xaxis2:{title:'',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'y2'},
yaxis2:{title:'v (m/s)',domain:[0.36,0.66],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},
xaxis3:{title:'t (s)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',anchor:'y3'},
yaxis3:{title:'a (m/s²)',domain:[0.02,0.32],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},
margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l22-motion-tr',[posT,velT,accT,zero1,zero2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">ÜÇ GRAFİĞİ BİRLİKTE OKUMAK</div><div class="think-body">Grafikte dikkat et: $s(t)$ konumu $t = 1$'de yerel maksimum, $t = 3$'te yerel minimum yapar. Tam o anlarda hız $v(t)$ sıfırdır — çünkü maksimum veya minimumda parçacık anlık olarak hareketsiz olur. $t = 1$ ile $t = 3$ arasında hız negatiftir (parçacık geriye gidiyor), bu aralığın dışında pozitiftir. İvme $a(t) = 6t - 12$, $t = 2$'de sıfırdır; bu hızın minimuma sahip olduğu — yavaşlamadan tekrar hızlanmaya geçiş — anıdır.</div></div>

<h2 class="lesson-title">7. Çözümlü Örnek: Serbest Düşüş</h2>

<div class="calc-highlight"><strong>En ünlü kinematik örneği.</strong> Bir top, Dünya yüzeyinin yakınında durgun halden bırakılır. Hava direnci ihmal edilirse, yerçekimi onu sabit $g \\approx 9.8$ m/s² ile hızlandırır. Bu tek fiziksel olgudan başlayıp kalkülüs kullanarak gerisini türetebiliriz: herhangi bir anda hızı, herhangi bir anda konumu, herhangi bir aralıkta kaç metre düştüğü.</div>

<p class="l-text">Aşağı yönü pozitif al, başlangıç noktası $t = 0$ anında $s = 0$ ve başlangıç hızı $v(0) = 0$. Fizik şöyle der: ivme sabittir:</p>

<div class="calc-formula"><div class="formula-label">SERBEST DÜŞÜŞTE SABİT İVME</div><div class="formula-main">$$a(t) = g \\approx 9.8 \\text{ m/s}^2$$</div></div>

<p class="l-text"><strong>İvmeden hıza geri çalışma.</strong> Türevi $g$ sabiti olan bir $v(t)$ fonksiyonu istiyoruz. En basiti $v(t) = gt$, çünkü $\\dfrac{d}{dt}(gt) = g$. Ayrıca $v(0) = 0$'a ihtiyacımız var ve gerçekten $g \\cdot 0 = 0$, bu seçim işe yarıyor.</p>

<div class="calc-formula"><div class="formula-label">SERBEST DÜŞÜŞTE HIZ</div><div class="formula-main">$$v(t) = g t$$</div><div class="formula-sub">$t$ saniyelik serbest düşüşten sonra top $gt$ m/s ile aşağı doğru hareket ediyor. 1 s sonra: $\\approx 9.8$ m/s. 2 s: $\\approx 19.6$ m/s. 3 s: $\\approx 29.4$ m/s.</div></div>

<p class="l-text"><strong>Şimdi bir seviye daha yukarı git — hızdan konuma.</strong> Türevi $gt$ olan $s(t)$ istiyoruz. Üs kuralından hatırla: $\\dfrac{d}{dt}\\left(\\dfrac{1}{2} g t^2\\right) = g t$. Ve $s(0) = 0$, başlangıç noktamızla uyumlu.</p>

<div class="calc-formula"><div class="formula-label">SERBEST DÜŞÜŞTE KONUM</div><div class="formula-main">$$s(t) = \\frac{1}{2} g t^2$$</div><div class="formula-sub">1 s sonra top $\\approx 4.9$ m düşmüştür. 2 s sonra: $\\approx 19.6$ m. 3 s sonra: $\\approx 44.1$ m. 10 s sonra: $\\approx 490$ m.</div></div>

<p class="l-text"><strong>Zinciri doğrulama.</strong> $s(t) = \\tfrac{1}{2} g t^2$ bir kez türevle: $s'(t) = g t = v(t)$. Tekrar türevle: $s''(t) = g = a(t)$. Üç fonksiyon tutarlı bir kinematik zincir oluşturur. Galileo'nun deneysel keşfi (1604) — vakumda tüm cisimlerin aynı sabit ivmeyle düştüğü — bu zarif kalkülüs ilişkisine dönüşür.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KULEDEN BIRAKMA</div><div class="example-body">80 m'lik bir kulenin tepesinden bir top durgun halden bırakılır. Kolaylık için $g = 10$ m/s² al, şunları bul: (a) yere düşme süresi; (b) çarpma anındaki hızı.<br><br><strong>Konum:</strong> $s(t) = \\tfrac{1}{2} \\cdot 10 \\cdot t^2 = 5 t^2$ m.<br><br>(a) $s(t) = 80$ koy: $5 t^2 = 80$, yani $t^2 = 16$, $t = 4$ s.<br>(b) Hız: $v(t) = 10 t$. $t = 4$'te: $v(4) = 40$ m/s.<br><br>Top 4 saniyede yere ulaşır, aşağı doğru 40 m/s hızla. $\\blacksquare$</div></div>

<h2 class="lesson-title">8. Polinomun $n$-inci Türevi</h2>

<div class="calc-highlight"><strong>Üs kuralının sınıra taşınması.</strong> $f(x) = x^k$ tek terimlisi ($k$ pozitif tam sayı) için tekrarlı türev faktöriyel deseni üretir. $k$ türevden sonra sonuç sadece sabit $k!$'dir. $k$'den fazla türevden sonra sonuç sıfırdır. Polinomların yalnızca <em>sonlu sayıda</em> sıfır olmayan türevi vardır — sonunda sıfıra çökerler.</div>

<div class="calc-formula"><div class="formula-label">X^K'NIN N-İNCİ TÜREVİ</div><div class="formula-main">$$\\frac{d^n}{dx^n} x^k = \\begin{cases} \\dfrac{k!}{(k-n)!} \\, x^{k-n} & n \\leq k \\text{ ise}, \\\\[0.4em] 0 & n > k \\text{ ise}. \\end{cases}$$</div><div class="formula-sub">Katsayı $k(k-1)(k-2)\\cdots(k-n+1)$, tam olarak $k!/(k-n)!$ faktöriyel oranıdır. $n = k$ olduğunda cevap $k!$ sabittir.</div></div>

<p class="l-text">$f(x) = x^5$ ile doğrulayalım:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$f(x) = x^5$</div><div class="card-body">Başlangıç.</div></div>
<div class="calc-card"><div class="card-title">$f'(x) = 5 x^4$</div><div class="card-body">Katsayı $5 = 5$.</div></div>
<div class="calc-card"><div class="card-title">$f''(x) = 20 x^3$</div><div class="card-body">Katsayı $5 \\cdot 4 = 20$.</div></div>
<div class="calc-card"><div class="card-title">$f'''(x) = 60 x^2$</div><div class="card-body">Katsayı $5 \\cdot 4 \\cdot 3 = 60$.</div></div>
<div class="calc-card"><div class="card-title">$f^{(4)}(x) = 120 x$</div><div class="card-body">Katsayı $5 \\cdot 4 \\cdot 3 \\cdot 2 = 120$.</div></div>
<div class="calc-card"><div class="card-title">$f^{(5)}(x) = 120 = 5!$</div><div class="card-body">Sabit $5! = 120$. Bir kez daha türev al, sonuç $0$.</div></div>
</div>

<div class="l-note"><strong>$n$ dereceli polinom için sonuç:</strong> $P(x) = a_n x^n + \\ldots + a_0$ ise, $P^{(n)}(x) = n! \\, a_n$ (bir sabit) ve her $m > n$ için $P^{(m)}(x) = 0$. Bir polinomun derecesini bilmek, kaç türevinin sıfırdan farklı olduğunu tam olarak söyler.</div>

<div class="calc-example"><div class="example-label">ÖRNEK — TEMİZ BİR UYGULAMA</div><div class="example-body"><strong>Bul:</strong> $P(x) = 7 x^{12} - 3 x^5 + 4 x - 11$ polinomunun 10. türevi.<br><br>$x^5$, $x$ ve sabit terimler en çok 5 türevden sonra (her biri kendi derecelerine $\\leq$) yok olur. Sadece $x^{12}$ terimi hayatta kalır.<br><br>$\\dfrac{d^{10}}{dx^{10}}(7 x^{12}) = 7 \\cdot \\dfrac{12!}{2!} x^2 = 7 \\cdot \\dfrac{479001600}{2} x^2 = 7 \\cdot 239500800 \\cdot x^2 = 1676505600 \\, x^2$. $\\blacksquare$</div></div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — POLİNOM İKİNCİ TÜREV</div><div class="example-body"><strong>Bul:</strong> $f(x) = 4 x^5 - 3 x^4 + 2 x^2 - 7$ için $f''(x)$.<br><br><em>Çözüm.</em><br>$f'(x) = 20 x^4 - 12 x^3 + 4 x$.<br>$f''(x) = 80 x^3 - 36 x^2 + 4$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — TRİG DÖNGÜSÜ</div><div class="example-body"><strong>Bul:</strong> $f(x) = \\cos x$ ise $f^{(85)}(x)$.<br><br><em>Çözüm.</em> $85 \\bmod 4$'ü hesapla. $85 = 4 \\cdot 21 + 1$, kalan $1$. Kosinüs döngüsü: $\\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x \\to \\cos x$. 1 adım sonra $-\\sin x$. Yani $f^{(85)}(x) = -\\sin x$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — KİNEMATİK</div><div class="example-body">Bir parçacık bir doğru boyunca $s(t) = 2t^3 - 9t^2 + 12t$ m konumu ile hareket ediyor ($t$ saniye). (a) $v(t)$ ve $a(t)$'yi bul. (b) Parçacık hangi anlarda anlık olarak durur? (c) $t = 3$ s'de ivme nedir?<br><br><em>Çözüm.</em><br>(a) $v(t) = 6t^2 - 18t + 12$, $a(t) = 12t - 18$.<br>(b) $v(t) = 0 \\Rightarrow 6(t^2 - 3t + 2) = 0 \\Rightarrow (t-1)(t-2) = 0 \\Rightarrow t = 1$ veya $t = 2$ s.<br>(c) $a(3) = 36 - 18 = 18$ m/s². $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — SERBEST DÜŞÜŞ</div><div class="example-body">Bir taş bir uçurumun tepesinden durgun halden bırakılır. Tam 3 saniye sonra 44.1 m düşmüş olur. Yerçekimi ivmesinin $g = 9.8$ m/s² olduğunu doğrula.<br><br><em>Çözüm.</em> Serbest düşüş: $s(t) = \\tfrac{1}{2} g t^2$. $t = 3$, $s = 44.1$ koy: $44.1 = \\tfrac{1}{2} \\cdot g \\cdot 9$, yani $g = \\dfrac{2 \\cdot 44.1}{9} = \\dfrac{88.2}{9} = 9.8$ m/s². Kabul edilen değerle eşleşiyor. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — SARSINTI</div><div class="example-body">$s(t) = t^4 - 4t^3 + 6t^2$ ise sarsıntı $j(t)$'yi bul ve $t = 1$ s'de değerlendir.<br><br><em>Çözüm.</em><br>$v(t) = 4t^3 - 12t^2 + 12t$.<br>$a(t) = 12t^2 - 24t + 12$.<br>$j(t) = a'(t) = 24t - 24$.<br>$j(1) = 24 - 24 = 0$ m/s³. $t = 1$'de ivme anlık olarak sabittir. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — ÜSTELİN N-İNCİ TÜREVİ</div><div class="example-body"><strong>Bul:</strong> $f(x) = e^{3x}$'in $n$-inci türevi ve onunla $f^{(7)}(0)$.<br><br><em>Çözüm.</em> $\\dfrac{d^n}{dx^n} e^{kx} = k^n e^{kx}$ kuralı ile: $f^{(n)}(x) = 3^n e^{3x}$. $x = 0$'da: $f^{(7)}(0) = 3^7 \\cdot e^0 = 2187$. $\\blacksquare$</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Türev bir operatördür: $f$'ye uygulanınca $f'$ döner, tekrar uygulanınca $f''$ döner, böylece sınırsız devam eder</li>
<li>Gösterimler: üs ($f''$), Leibniz ($d^2 y / dx^2$), indeksli ($f^{(n)}$). Hepsi aynı şeyi anlatır</li>
<li><strong>$f''(x)$</strong> bükülmeyi ölçer: pozitif $\\Rightarrow$ yukarı içbükey; negatif $\\Rightarrow$ aşağı içbükey; işaret değişimi $\\Rightarrow$ dönüm noktası</li>
<li>Trigonometrik fonksiyonlar türev altında periyot 4 ile döngü yapar. $n \\bmod 4$ kullanarak $\\sin^{(n)}, \\cos^{(n)}$'i tek adımda bul</li>
<li>Polinom: $\\dfrac{d^n}{dx^n} x^k = \\dfrac{k!}{(k-n)!} x^{k-n}$ ($n \\leq k$ olduğunda), $n > k$ olduğunda sıfır</li>
<li><strong>Kinematik:</strong> konum $s(t) \\Rightarrow$ hız $v(t) = s'(t) \\Rightarrow$ ivme $a(t) = s''(t) \\Rightarrow$ sarsıntı $j(t) = s'''(t)$</li>
<li><strong>Serbest düşüş:</strong> $a = g$ sabit $\\Rightarrow v = gt \\Rightarrow s = \\tfrac{1}{2} g t^2$. Tek fiziksel olgu, iki türev</li>
<li>Sonraki ders: ikinci türevi keyfi fonksiyonların uç noktalarını ve dönüm noktalarını bulmak için uygulama</li>
</ul>
</div>`
};
