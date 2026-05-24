window.LISE_MAT_L32 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You already know how to find the area between a single curve and the x-axis.</strong> The definite integral $\\int_a^b f(x)\\,dx$ measures that signed area: positive where $f$ sits above the axis, negative where it sits below. But a single curve and the axis is only the simplest geometry. In real problems we usually need the area between <em>two</em> curves — the strip caught between a parabola and a line, the leaf-shaped region cut out by $y = x$ and $y = x^2$, the slice of the plane bounded by $\\sin x$ and $\\cos x$ on $[0, \\pi/4]$.</p>

<p class="l-text">In this lesson we generalise the area formula. We learn how to identify which curve is on top, how to find where two curves meet (the limits of integration), how to break a region into pieces when the two curves switch roles, and how to swap to a vertical-strip versus horizontal-strip viewpoint when one is easier than the other. By the end you will read any region in the plane and write down the right integral on sight.</p>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write the area between two curves as $\\int_a^b [f(x) - g(x)]\\,dx$ with the upper curve on top</li>
<li>Find the limits of integration by solving $f(x) = g(x)$ for the intersection points</li>
<li>Sketch the region first, then read off which curve is upper and which is lower</li>
<li>Handle regions where the curves swap order by splitting the integral into pieces</li>
<li>Integrate with respect to $y$ when the geometry is naturally described by horizontal strips</li>
<li>Choose between $dx$-integration and $dy$-integration to keep the work short</li>
</ul>
</div>

<h2 class="lesson-title">1. The Area Between Two Curves — Master Formula</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> Two roads run roughly parallel through a town. The strip of land caught between them has an area. If at each east-west position $x$ the upper road is at height $f(x)$ and the lower road at height $g(x)$, then the vertical strip width $f(x) - g(x)$ is the local thickness. Adding up (integrating) over all $x$ between the western edge $a$ and the eastern edge $b$ gives the total enclosed area.</div></div>

<p class="l-text">Suppose $f(x) \\geq g(x)$ for every $x$ in $[a, b]$. Slice the region between the two graphs into thin vertical strips. A strip at position $x$ has width $dx$ and height $f(x) - g(x)$, so its area is</p>

<div class="calc-formula"><div class="formula-main">$$dA \\;=\\; [\\,f(x) - g(x)\\,]\\,dx.$$</div></div>

<p class="l-text">Summing (integrating) over all strips from $x = a$ to $x = b$ gives the master formula.</p>

<div class="calc-formula"><div class="formula-label">AREA BETWEEN TWO CURVES</div><div class="formula-main">$$A \\;=\\; \\int_a^b \\bigl[\\,f(x) - g(x)\\,\\bigr]\\,dx \\qquad \\text{(upper curve} - \\text{lower curve)}.$$</div><div class="formula-sub">The integrand $f(x) - g(x)$ must be non-negative on $[a, b]$. If you accidentally subtract the upper from the lower, you will get a negative answer; take its absolute value or swap the roles.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Upper curve $f(x)$</div><div class="card-body">The graph that sits higher on $[a, b]$. Identifying it correctly is the most common source of error — always sketch first.</div></div>
<div class="calc-card"><div class="card-title">Lower curve $g(x)$</div><div class="card-body">The graph that sits below on $[a, b]$. It can be the x-axis ($g = 0$), in which case the formula collapses to the ordinary area under $f$.</div></div>
<div class="calc-card"><div class="card-title">Limits $a$ and $b$</div><div class="card-body">Usually the x-coordinates of the two intersection points where $f(x) = g(x)$. Sometimes they are explicit vertical lines $x = a$ and $x = b$.</div></div>
<div class="calc-card"><div class="card-title">Sign convention</div><div class="card-body">Strip area is always positive. We subtract lower from upper to keep $[f(x) - g(x)] \\geq 0$, so the integral itself is the true geometric area.</div></div>
</div>

<div class="think-box"><div class="think-label">WHY DOES THE OFFSET NOT MATTER?</div><div class="think-body">If you slide both curves up by the same constant $c$, the strip heights $(f + c) - (g + c) = f - g$ are unchanged. So the area depends only on the <em>difference</em> $f(x) - g(x)$, not on whether either curve happens to dip below the x-axis. This is why the formula works even when parts of the region lie below the x-axis.</div></div>

<h2 class="lesson-title">2. Finding the Intersection Points</h2>

<p class="l-text">To set the limits $a$ and $b$, we need the x-values where the two curves meet. Set the curves equal to each other and solve.</p>

<div class="calc-formula"><div class="formula-label">INTERSECTION CONDITION</div><div class="formula-main">$$f(x) \\;=\\; g(x) \\quad \\Longrightarrow \\quad f(x) - g(x) \\;=\\; 0.$$</div><div class="formula-sub">Move everything to one side and solve. The roots of $f - g$ are the x-coordinates of the intersection points. The y-coordinates follow by plugging back into either function.</div></div>

<p class="l-text"><strong>Typical algebra you will meet.</strong> Setting $f(x) - g(x) = 0$ usually produces a polynomial, a trigonometric equation, or an exponential/logarithmic equation. For high-school problems the equation almost always factors nicely or has a small number of obvious roots.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE (LOCATE INTERSECTIONS)</div><div class="example-body"><strong>Find where</strong> $y = x$ and $y = x^2$ meet.<br><br>Set $x = x^2$, so $x^2 - x = 0$, giving $x(x - 1) = 0$. The roots are $x = 0$ and $x = 1$. At those values, $y = 0$ and $y = 1$ respectively, so the two intersection points are $(0, 0)$ and $(1, 1)$.<br><br>Between $x = 0$ and $x = 1$ which curve is on top? Pick a test value, say $x = 0.5$: the line gives $y = 0.5$, the parabola gives $y = 0.25$. So the line $y = x$ is the upper curve on $[0, 1]$.</div></div>

<div class="l-note"><strong>Practical tip.</strong> If you cannot solve $f(x) = g(x)$ algebraically (for example a transcendental equation), the lesson on numerical methods (Newton or bisection) helps. In Turkish high-school problems the intersections are always solvable by hand.</div>

<h2 class="lesson-title">3. Worked Example 1 — Area Between $y = x$ and $y = x^2$</h2>

<p class="l-text">Combine the formula with the intersections we just found. On $[0, 1]$ the upper curve is $f(x) = x$ and the lower is $g(x) = x^2$. The area is</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\int_0^1 [\\,x - x^2\\,]\\,dx.$$</div></div>

<p class="l-text">Compute antiderivative term by term:</p>

<div class="calc-formula"><div class="formula-main">$$\\int [\\,x - x^2\\,]\\,dx \\;=\\; \\frac{x^2}{2} - \\frac{x^3}{3} + C.$$</div></div>

<p class="l-text">Evaluate from $0$ to $1$:</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1 \\;=\\; \\left(\\frac{1}{2} - \\frac{1}{3}\\right) - 0 \\;=\\; \\frac{3 - 2}{6} \\;=\\; \\frac{1}{6}.$$</div></div>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\boxed{\\;A \\;=\\; \\frac{1}{6}\\;}$$</div><div class="formula-sub">The leaf-shaped region between the line $y = x$ and the parabola $y = x^2$ on $[0, 1]$ has area exactly one sixth.</div></div>

<div id="plot-l32-ex1-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],line=[],para=[];
for(var i=0;i<=100;i++){var x=i/100;xs.push(x);line.push(x);para.push(x*x);}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=line.slice().concat(para.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.22)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'enclosed area',hoverinfo:'skip',showlegend:true};
var tLine={x:xs,y:line,mode:'lines',name:'y = x (upper)',line:{color:'#3b82f6',width:2.8}};
var tPara={x:xs,y:para,mode:'lines',name:'y = x² (lower)',line:{color:'#c8a96e',width:2.8}};
var tPt={x:[0,1],y:[0,1],mode:'markers',name:'intersections',marker:{size:8,color:'#f87171'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.15,1.2]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.15,1.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:0.5,y:0.38,text:'A = 1/6',showarrow:false,font:{color:'#22c55e',size:14}}]};
Plotly.newPlot('plot-l32-ex1-en',[tFill,tLine,tPara,tPt],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the line $y = x$ (blue) and the parabola $y = x^2$ (gold) intersect at $(0,0)$ and $(1,1)$. The shaded green leaf is the region whose area we just computed: exactly $1/6$ square unit.</div></div>

<h2 class="lesson-title">4. Worked Example 2 — Area Between $\\sin x$ and $\\cos x$ on $[0, \\pi/4]$</h2>

<p class="l-text">On $[0, \\pi/4]$ the curves $y = \\sin x$ and $y = \\cos x$ both grow and shrink in opposite directions. At $x = 0$, $\\sin 0 = 0$ and $\\cos 0 = 1$, so cosine is on top. They meet at $x = \\pi/4$ where $\\sin(\\pi/4) = \\cos(\\pi/4) = \\sqrt{2}/2$.</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\int_0^{\\pi/4} [\\,\\cos x - \\sin x\\,]\\,dx.$$</div></div>

<p class="l-text">The antiderivative is $\\sin x + \\cos x$ (recall $\\int \\cos x\\,dx = \\sin x$ and $\\int \\sin x\\,dx = -\\cos x$, so the minus signs combine into a plus).</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\bigl[\\sin x + \\cos x\\bigr]_0^{\\pi/4} \\;=\\; \\left(\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2}\\right) - (0 + 1) \\;=\\; \\sqrt{2} - 1.$$</div></div>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\boxed{\\;A \\;=\\; \\sqrt{2} - 1 \\;\\approx\\; 0.414\\;}$$</div><div class="formula-sub">The thin sliver between cosine and sine on $[0, \\pi/4]$ has area $\\sqrt{2} - 1$ square units.</div></div>

<div id="plot-l32-ex2-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],s=[],c=[];
var n=80;var b=Math.PI/4;
for(var i=0;i<=n;i++){var x=i*b/n;xs.push(x);s.push(Math.sin(x));c.push(Math.cos(x));}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=c.slice().concat(s.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.22)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'enclosed area',hoverinfo:'skip',showlegend:true};
var tCos={x:xs,y:c,mode:'lines',name:'y = cos x (upper)',line:{color:'#3b82f6',width:2.8}};
var tSin={x:xs,y:s,mode:'lines',name:'y = sin x (lower)',line:{color:'#c8a96e',width:2.8}};
var tPt={x:[b],y:[Math.SQRT2/2],mode:'markers',name:'intersection',marker:{size:8,color:'#f87171'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.05,0.9]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.05,1.1]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:b/2,y:0.55,text:'A = √2 − 1',showarrow:false,font:{color:'#22c55e',size:13}}]};
Plotly.newPlot('plot-l32-ex2-en',[tFill,tCos,tSin,tPt],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> on $[0, \\pi/4]$ the cosine curve (blue) sits above the sine curve (gold) until they meet at $x = \\pi/4$. The shaded green region has area $\\sqrt{2} - 1 \\approx 0.414$.</div></div>

<h2 class="lesson-title">5. Worked Example 3 — Area Between $y = x^2$ and $y = 4 - x^2$</h2>

<p class="l-text">Here both curves are parabolas, one opening up ($y = x^2$) and one opening down ($y = 4 - x^2$). Find the intersection:</p>

<div class="calc-formula"><div class="formula-main">$$x^2 \\;=\\; 4 - x^2 \\quad \\Longrightarrow \\quad 2x^2 = 4 \\quad \\Longrightarrow \\quad x^2 = 2 \\quad \\Longrightarrow \\quad x = \\pm\\sqrt{2}.$$</div></div>

<p class="l-text">The two curves meet at $x = -\\sqrt{2}$ and $x = \\sqrt{2}$. Between them, which is higher? Test $x = 0$: the upward parabola gives $0$, the downward one gives $4$. So $4 - x^2$ is on top.</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\int_{-\\sqrt{2}}^{\\sqrt{2}} \\bigl[\\,(4 - x^2) - x^2\\,\\bigr]\\,dx \\;=\\; \\int_{-\\sqrt{2}}^{\\sqrt{2}} (4 - 2x^2)\\,dx.$$</div></div>

<p class="l-text">The integrand $4 - 2x^2$ is an even function, so we can double the integral over $[0, \\sqrt{2}]$:</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; 2\\int_0^{\\sqrt{2}} (4 - 2x^2)\\,dx \\;=\\; 2\\left[4x - \\frac{2x^3}{3}\\right]_0^{\\sqrt{2}}.$$</div></div>

<p class="l-text">At $x = \\sqrt{2}$: $4\\sqrt{2} - \\dfrac{2(\\sqrt{2})^3}{3} = 4\\sqrt{2} - \\dfrac{2 \\cdot 2\\sqrt{2}}{3} = 4\\sqrt{2} - \\dfrac{4\\sqrt{2}}{3} = \\dfrac{12\\sqrt{2} - 4\\sqrt{2}}{3} = \\dfrac{8\\sqrt{2}}{3}$.</p>

<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$\\boxed{\\;A \\;=\\; 2 \\cdot \\frac{8\\sqrt{2}}{3} \\;=\\; \\frac{16\\sqrt{2}}{3} \\;\\approx\\; 7.542\\;}$$</div><div class="formula-sub">The lens-shaped region between the two parabolas has area $16\\sqrt{2}/3$ square units.</div></div>

<div id="plot-l32-ex3-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var s2=Math.sqrt(2);
var xs=[],up=[],dn=[];
var n=120;
for(var i=0;i<=n;i++){var x=-s2+2*s2*i/n;xs.push(x);up.push(4-x*x);dn.push(x*x);}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=up.slice().concat(dn.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.22)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'enclosed area',hoverinfo:'skip',showlegend:true};
var tUp={x:xs,y:up,mode:'lines',name:'y = 4 − x² (upper)',line:{color:'#3b82f6',width:2.8}};
var tDn={x:xs,y:dn,mode:'lines',name:'y = x² (lower)',line:{color:'#c8a96e',width:2.8}};
var tPt={x:[-s2,s2],y:[2,2],mode:'markers',name:'intersections',marker:{size:8,color:'#f87171'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-2,2]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.3,4.5]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:0,y:2,text:'A = 16√2 / 3',showarrow:false,font:{color:'#22c55e',size:13}}]};
Plotly.newPlot('plot-l32-ex3-en',[tFill,tUp,tDn,tPt],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the upward parabola $y = x^2$ (gold) and the downward parabola $y = 4 - x^2$ (blue) intersect at $(\\pm\\sqrt{2}, 2)$. The shaded green lens has area $16\\sqrt{2}/3 \\approx 7.54$.</div></div>

<h2 class="lesson-title">6. Multiple Intersection Points — Split the Region</h2>

<p class="l-text">When two curves cross more than twice, the role of "upper" and "lower" switches between intersections. You must split the integral at every crossing and take the absolute value of each piece — or equivalently, choose the upper curve correctly in each subinterval.</p>

<div class="calc-formula"><div class="formula-label">SPLIT FORMULA</div><div class="formula-main">$$A \\;=\\; \\int_a^c |f(x) - g(x)|\\,dx \\;=\\; \\sum_k \\int_{x_k}^{x_{k+1}} |f(x) - g(x)|\\,dx$$</div><div class="formula-sub">where $x_0 = a < x_1 < x_2 < \\dots < x_n = c$ are all the intersection points on $[a, c]$. On each subinterval one curve is uniformly above the other, so the absolute value is settled before integrating.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE (SPLIT)</div><div class="example-body"><strong>Find the total area between</strong> $y = \\sin x$ and $y = \\cos x$ on $[0, \\pi]$.<br><br>Set $\\sin x = \\cos x$, i.e. $\\tan x = 1$. On $[0, \\pi]$ the only solution is $x = \\pi/4$. So the interval splits into $[0, \\pi/4]$ and $[\\pi/4, \\pi]$.<br><br>On $[0, \\pi/4]$: cosine is above sine (test $x = 0$: $\\cos = 1 > \\sin = 0$).<br>On $[\\pi/4, \\pi]$: sine is above cosine (test $x = \\pi/2$: $\\sin = 1 > \\cos = 0$).<br><br>$A = \\int_0^{\\pi/4}(\\cos x - \\sin x)\\,dx + \\int_{\\pi/4}^{\\pi}(\\sin x - \\cos x)\\,dx$<br>$= [\\sin x + \\cos x]_0^{\\pi/4} + [-\\cos x - \\sin x]_{\\pi/4}^{\\pi}$<br>$= (\\sqrt{2} - 1) + ((-(-1) - 0) - (-\\sqrt{2}/2 - \\sqrt{2}/2))$<br>$= (\\sqrt{2} - 1) + (1 + \\sqrt{2})$<br>$= 2\\sqrt{2}$.<br><br>Total area: $\\boxed{2\\sqrt{2} \\approx 2.828}$ square units.</div></div>

<div class="think-box"><div class="think-label">A WARNING</div><div class="think-body">If you forget to split and compute $\\int_0^{\\pi}(\\cos x - \\sin x)\\,dx$ in one go, the negative contribution from $[\\pi/4, \\pi]$ cancels part of the positive contribution from $[0, \\pi/4]$, and you get the wrong answer. Always sketch and locate every crossing before you set up the integral.</div></div>

<h2 class="lesson-title">7. Integrating with Respect to $y$</h2>

<p class="l-text">Sometimes the natural slicing of a region is by horizontal strips instead of vertical strips. If the region is bounded by the curves $x = f(y)$ (on the right) and $x = g(y)$ (on the left) for $y$ between $c$ and $d$, then the strip at height $y$ has width $f(y) - g(y)$ and height $dy$. Summing,</p>

<div class="calc-formula"><div class="formula-label">AREA BY HORIZONTAL STRIPS</div><div class="formula-main">$$A \\;=\\; \\int_c^d \\bigl[\\,f(y) - g(y)\\,\\bigr]\\,dy \\qquad \\text{(right curve} - \\text{left curve)}.$$</div><div class="formula-sub">Identical idea to the master formula, only the strips are now horizontal. The integrand is right minus left. Limits are y-values where the curves meet, found by solving $f(y) = g(y)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to use $dy$</div><div class="card-body">When the bounding curves are written as $x$ in terms of $y$ (e.g. $x = y^2$, $x = \\sqrt{y}$, $x = 2 - y^2$), or when one curve is vertical and the other not a function of $x$.</div></div>
<div class="calc-card"><div class="card-title">When to use $dx$</div><div class="card-body">When the bounding curves are written as $y$ in terms of $x$ and they pass the vertical-line test, and you do not need to split the region.</div></div>
<div class="calc-card"><div class="card-title">Both work — pick easier</div><div class="card-body">For many regions either viewpoint is valid. Choose the one that needs fewer integrals or simpler algebra.</div></div>
</div>

<h2 class="lesson-title">8. Worked Example — $y = x$ and $y = x^2$ Two Ways</h2>

<p class="l-text">We computed the area with vertical strips and got $1/6$. Now redo it with horizontal strips to see the $dy$-method in action.</p>

<p class="l-text"><strong>Step 1. Write each curve as $x$ in terms of $y$.</strong></p>

<div class="calc-formula"><div class="formula-main">$$y = x \\quad \\Longleftrightarrow \\quad x = y \\qquad\\qquad y = x^2 \\quad \\Longleftrightarrow \\quad x = \\sqrt{y}\\;(\\text{branch in first quadrant}).$$</div></div>

<p class="l-text"><strong>Step 2. Which is on the right?</strong> For $0 < y < 1$, test $y = 1/4$: $x = y$ gives $x = 1/4$, $x = \\sqrt{y}$ gives $x = 1/2$. So $\\sqrt{y}$ is on the right, $y$ on the left.</p>

<p class="l-text"><strong>Step 3. y-limits.</strong> The region exists for $y$ between $0$ and $1$.</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\int_0^1 (\\sqrt{y} - y)\\,dy \\;=\\; \\left[\\frac{2}{3}y^{3/2} - \\frac{y^2}{2}\\right]_0^1 \\;=\\; \\frac{2}{3} - \\frac{1}{2} \\;=\\; \\frac{4 - 3}{6} \\;=\\; \\frac{1}{6}.$$</div></div>

<p class="l-text">Same answer, $1/6$. Beautiful — both viewpoints give exactly the same geometric area, as they must.</p>

<div id="plot-l32-dy-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],line=[],para=[];
for(var i=0;i<=100;i++){var x=i/100;xs.push(x);line.push(x);para.push(x*x);}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=line.slice().concat(para.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.16)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'region',hoverinfo:'skip',showlegend:false};
var strips=[];
var ks=[0.15,0.30,0.45,0.60,0.75,0.90];
for(var k=0;k<ks.length;k++){var y=ks[k];var xL=y;var xR=Math.sqrt(y);strips.push({x:[xL,xR],y:[y,y],mode:'lines',line:{color:'#f59e0b',width:2.2},showlegend:(k===0),name:'horizontal strips',hoverinfo:'skip'});}
var tLine={x:xs,y:line,mode:'lines',name:'x = y (left bound)',line:{color:'#3b82f6',width:2.5}};
var tPara={x:xs,y:para,mode:'lines',name:'x = √y (right bound)',line:{color:'#c8a96e',width:2.5}};
var data=[tFill].concat(strips).concat([tLine,tPara]);
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.15,1.2]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.15,1.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22}};
Plotly.newPlot('plot-l32-dy-en',data,layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the same leaf region sliced by <em>horizontal</em> strips (orange). For each height $y$, the strip runs from $x = y$ (line on the left) to $x = \\sqrt{y}$ (parabola on the right). Summing strip widths from $y = 0$ to $y = 1$ gives the same area $1/6$.</div></div>

<h2 class="lesson-title">9. Sketching the Region First</h2>

<p class="l-text">Every area problem becomes easy once you draw the picture. A good sketch tells you the limits of integration, which curve is upper or right, and whether the region needs to be split.</p>

<div class="calc-formula"><div class="formula-label">SKETCHING CHECKLIST</div><div class="formula-main"></div><div class="formula-sub">1. Plot both curves on the same axes (rough is fine).<br>2. Find all intersection points by setting $f = g$.<br>3. Pick a test x-value <em>inside</em> each subinterval to identify the upper curve.<br>4. Shade the enclosed region — every shaded piece corresponds to one integral.<br>5. Decide whether vertical strips ($dx$) or horizontal strips ($dy$) keep the work shortest.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bounded vs unbounded</div><div class="card-body">A region between two curves can be infinite in extent (e.g. between $y = 1/x$ and the x-axis on $[1, \\infty)$ — handled by improper integrals). For high-school problems regions are always finite.</div></div>
<div class="calc-card"><div class="card-title">Open vs closed</div><div class="card-body">The region's area is the same whether you include the boundary curves or not. Area is unchanged by adding or removing measure-zero sets.</div></div>
<div class="calc-card"><div class="card-title">Simple vs multi-piece</div><div class="card-body">Whenever curves cross more than twice in your interval, the region splits into pieces — each one contributes separately to the total area.</div></div>
</div>

<h2 class="lesson-title">10. Classic Exercises</h2>

<p class="l-text">Six standard problems. Solve each on paper, then read the answer. Do not skip the sketch.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Find the area between</strong> $y = x^2$ and $y = 2x$.<br><br><em>Solution.</em> Set $x^2 = 2x$, so $x(x - 2) = 0$, giving $x = 0$ and $x = 2$. On $[0, 2]$ test $x = 1$: line gives $2$, parabola gives $1$. So line is upper. $A = \\int_0^2 (2x - x^2)\\,dx = [x^2 - x^3/3]_0^2 = 4 - 8/3 = 4/3$. <strong>Answer: $4/3$.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Find the area enclosed by</strong> $y = 4 - x^2$ and the x-axis.<br><br><em>Solution.</em> The curve meets $y = 0$ at $x = \\pm 2$. Take $f(x) = 4 - x^2$, $g(x) = 0$. By symmetry $A = 2\\int_0^2 (4 - x^2)\\,dx = 2[4x - x^3/3]_0^2 = 2(8 - 8/3) = 2 \\cdot 16/3 = 32/3$. <strong>Answer: $32/3$.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Find the area between</strong> $y = x^3$ and $y = x$.<br><br><em>Solution.</em> Set $x^3 = x$, so $x(x^2 - 1) = 0$, giving $x = -1, 0, 1$. Three intersections — split! On $[-1, 0]$: test $x = -0.5$, $x^3 = -0.125$ and $x = -0.5$, so $x^3$ is above (less negative). On $[0, 1]$: test $x = 0.5$, $x = 0.5$ and $x^3 = 0.125$, so $x$ is above.<br>$A_1 = \\int_{-1}^0 (x^3 - x)\\,dx = [x^4/4 - x^2/2]_{-1}^0 = 0 - (1/4 - 1/2) = 1/4$.<br>$A_2 = \\int_0^1 (x - x^3)\\,dx = [x^2/2 - x^4/4]_0^1 = 1/2 - 1/4 = 1/4$.<br>Total: $A = 1/4 + 1/4 = 1/2$. <strong>Answer: $1/2$.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>Find the area between</strong> $y = e^x$ and $y = 1$ from $x = 0$ to $x = 1$.<br><br><em>Solution.</em> On $[0, 1]$ we have $e^x \\geq 1$ (with equality at $x = 0$). So upper $= e^x$, lower $= 1$.<br>$A = \\int_0^1 (e^x - 1)\\,dx = [e^x - x]_0^1 = (e - 1) - (1 - 0) = e - 2 \\approx 0.718$. <strong>Answer: $e - 2$.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Find the area between</strong> $x = y^2$ and $x = y + 2$.<br><br><em>Solution.</em> These are easier with horizontal strips since both are written as $x$ in terms of $y$. Set $y^2 = y + 2$, so $y^2 - y - 2 = 0$, $(y - 2)(y + 1) = 0$, giving $y = -1$ and $y = 2$. On $[-1, 2]$ which is right? Test $y = 0$: $y^2 = 0$ and $y + 2 = 2$. So $y + 2$ is on the right.<br>$A = \\int_{-1}^2 [(y + 2) - y^2]\\,dy = [y^2/2 + 2y - y^3/3]_{-1}^2 = (2 + 4 - 8/3) - (1/2 - 2 + 1/3) = (10/3) - (-7/6) = 20/6 + 7/6 = 27/6 = 9/2$. <strong>Answer: $9/2$.</strong></div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body"><strong>Find the area between</strong> $y = \\sqrt{x}$ and $y = x/2$ from $x = 0$ to where they meet.<br><br><em>Solution.</em> Set $\\sqrt{x} = x/2$. Square: $x = x^2/4$, so $x^2 - 4x = 0$, $x(x - 4) = 0$. The curves meet at $x = 0$ and $x = 4$. Test $x = 1$: $\\sqrt{1} = 1$ and $1/2$. So $\\sqrt{x}$ is upper.<br>$A = \\int_0^4 (\\sqrt{x} - x/2)\\,dx = [\\tfrac{2}{3}x^{3/2} - x^2/4]_0^4 = (\\tfrac{2}{3} \\cdot 8 - 4) - 0 = 16/3 - 4 = 16/3 - 12/3 = 4/3$. <strong>Answer: $4/3$.</strong></div></div>

<h2 class="lesson-title">11. Visual Recap and Case Reference</h2>

<p class="l-text">A second look at the canonical case $y = x^2$ vs $y = x$, this time with the focus on the enclosed area itself shaded in blue. The intersection points $(0,0)$ and $(1,1)$ frame a leaf-shaped region whose area is exactly $1/6$.</p>

<div id="plot-l32-en-extra" class="plotly-graph" style="height:440px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],line=[],para=[];
for(var i=0;i<=120;i++){var x=-0.1+1.3*i/120;xs.push(x);line.push(x);para.push(x*x);}
var xR=[],lR=[],pR=[];
for(var j=0;j<=120;j++){var u=j/120;xR.push(u);lR.push(u);pR.push(u*u);}
var xFill=xR.slice().concat(xR.slice().reverse());
var yFill=lR.slice().concat(pR.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(59,130,246,0.28)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'enclosed area',hoverinfo:'skip',showlegend:true};
var tLine={x:xs,y:line,mode:'lines',name:'y = x',line:{color:'#3b82f6',width:2.8}};
var tPara={x:xs,y:para,mode:'lines',name:'y = x²',line:{color:'#c8a96e',width:2.8}};
var tPt={x:[0,1],y:[0,1],mode:'markers+text',name:'intersections',marker:{size:10,color:'#f87171'},text:['(0,0)','(1,1)'],textposition:'top center',textfont:{color:'#ebe6dc',size:11}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',title:'x',range:[-0.18,1.3]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',title:'y',range:[-0.18,1.3],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:60,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:0.5,y:0.38,text:'A = ∫₀¹ (x − x²) dx = 1/6',showarrow:false,font:{color:'#3b82f6',size:14},bgcolor:'rgba(15,23,42,0.55)',bordercolor:'rgba(59,130,246,0.5)',borderwidth:1,borderpad:6}]};
Plotly.newPlot('plot-l32-en-extra',[tFill,tLine,tPara,tPt],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the line $y = x$ and the parabola $y = x^2$ both passing through $(0,0)$ and $(1,1)$. The semi-transparent blue region between them is the area $\\int_0^1 (x - x^2)\\,dx = 1/6$ — the canonical example you should keep in memory when setting up any "area between two curves" problem.</div></div>

<p class="l-text">Below is a compact reference table of the four standard configurations you will encounter. Match the geometry of your problem to the row, then read off the formula and the setup notes.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(15,23,42,0.6);color:#ebe6dc;font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead>
<tr style="background:#3b82f6;color:#0b1220;text-align:left">
<th style="padding:0.75rem 0.9rem;border:1px solid rgba(255,255,255,0.12);font-weight:700">Case</th>
<th style="padding:0.75rem 0.9rem;border:1px solid rgba(255,255,255,0.12);font-weight:700">Formula</th>
<th style="padding:0.75rem 0.9rem;border:1px solid rgba(255,255,255,0.12);font-weight:700">Notes</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top"><strong>1.</strong> $f(x) \\geq g(x)$ on $[a,b]$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">$A = \\int_a^b [f(x) - g(x)]\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">Standard situation. Limits $a, b$ either given explicitly or from $f(x) = g(x)$. Always sketch and pick a test point to confirm which curve is upper.</td>
</tr>
<tr style="background:rgba(255,255,255,0.025)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top"><strong>2.</strong> Curves cross inside $[a,b]$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">$A = \\sum_k \\int_{x_k}^{x_{k+1}} |f - g|\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">Split at every intersection. On each subinterval one curve is uniformly above; choose the correct "upper − lower" before integrating. Forgetting to split causes cancellation and a wrong answer.</td>
</tr>
<tr>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top"><strong>3.</strong> Integrate w.r.t. $y$ (horizontal strips)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">$A = \\int_c^d [f(y) - g(y)]\\,dy$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">Use when curves are given as $x = h(y)$ (e.g. $x = y^2$, $x = \\sqrt{y}$). $f(y)$ is the <em>right</em> curve, $g(y)$ the left. Limits are y-values of intersections.</td>
</tr>
<tr style="background:rgba(255,255,255,0.025)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top"><strong>4.</strong> Region bounded by 3 curves</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">$A = \\int_a^{c} [u_1 - \\ell]\\,dx + \\int_c^{b} [u_2 - \\ell]\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">Find all three pairwise intersections; the upper boundary changes at one of them (here at $x = c$). Split the integral and use the appropriate upper curve $u_1, u_2$ on each piece, against a common lower $\\ell$ (or repeat the logic if the lower also switches).</td>
</tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>What you learned.</strong> The master formula $A = \\int_a^b [f(x) - g(x)]\\,dx$ handles every two-curve area problem, provided you (i) sketch first, (ii) find every intersection, (iii) identify the upper curve in each subinterval, and (iv) split where the curves cross. The $dy$-formulation is the right tool when curves are given as $x = h(y)$. The next lesson moves from area to volume — same slicing idea, one dimension higher.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Tek bir eğri ile x-ekseni arasındaki alanı zaten hesaplayabiliyorsunuz.</strong> $\\int_a^b f(x)\\,dx$ belirli integrali bu işaretli alanı verir: $f$ eksenin üzerindeyken pozitif, altındayken negatif. Ancak tek eğri ile eksen, geometrinin en basit hâlidir. Gerçek problemlerde çoğu zaman <em>iki</em> eğri arasındaki alanı bulmak gerekir — bir parabol ile bir doğrunun arasında kalan şerit, $y = x$ ve $y = x^2$ tarafından kesilen yaprak biçimli bölge, $[0, \\pi/4]$ üzerinde $\\sin x$ ile $\\cos x$ arasında kalan ince dilim.</p>

<p class="l-text">Bu derste alan formülünü genelleştiriyoruz. Hangi eğrinin üstte olduğunu nasıl bulacağımızı, iki eğrinin nerede kesiştiğini (yani integralin sınırlarını) nasıl belirleyeceğimizi, eğriler rol değiştirdiğinde bölgeyi nasıl parçalara ayıracağımızı ve birinin daha kolay olduğu durumlarda dikey şeritten yatay şerite nasıl geçeceğimizi öğreneceğiz. Dersin sonunda düzlemdeki herhangi bir bölgeye bakıp doğru integrali bir bakışta yazabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İki eğri arası alanı $\\int_a^b [f(x) - g(x)]\\,dx$ olarak (üst eğri − alt eğri) yazmak</li>
<li>İntegralin sınırlarını $f(x) = g(x)$ denklemini çözerek bulmak</li>
<li>Önce bölgeyi çizip hangi eğrinin üstte, hangisinin altta olduğunu okumak</li>
<li>Eğrilerin rol değiştirdiği bölgelerde integrali parçalara bölmek</li>
<li>Geometri yatay şeritlerle daha doğal anlatılıyorsa $y$'ye göre integral almak</li>
<li>İşi kısa tutmak için $dx$ ve $dy$ yöntemlerinden uygun olanı seçmek</li>
</ul>
</div>

<h2 class="lesson-title">1. İki Eğri Arasındaki Alan — Ana Formül</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> Bir kasabadan kabaca paralel iki yol geçiyor. Aralarında kalan toprak şeridinin bir alanı vardır. Her doğu-batı $x$ konumunda üst yol $f(x)$ yüksekliğinde, alt yol $g(x)$ yüksekliğindeyse, dikey şerit kalınlığı $f(x) - g(x)$ olur. Batı kenarı $a$'dan doğu kenarı $b$'ye kadar tüm $x$'leri toplayınca (integralle) toplam alan elde edilir.</div>

<p class="l-text">$[a, b]$ aralığındaki her $x$ için $f(x) \\geq g(x)$ olduğunu varsayalım. İki grafiğin arasındaki bölgeyi ince dikey şeritlere bölelim. $x$ konumundaki bir şerit $dx$ kalınlığında ve $f(x) - g(x)$ yüksekliğindedir; alanı</p>

<div class="calc-formula"><div class="formula-main">$$dA \\;=\\; [\\,f(x) - g(x)\\,]\\,dx.$$</div></div>

<p class="l-text">$x = a$'dan $x = b$'ye kadar tüm şeritleri toplayarak (integralle) ana formülü elde ederiz.</p>

<div class="calc-formula"><div class="formula-label">İKİ EĞRİ ARASI ALAN</div><div class="formula-main">$$A \\;=\\; \\int_a^b \\bigl[\\,f(x) - g(x)\\,\\bigr]\\,dx \\qquad (\\text{üst eğri} - \\text{alt eğri}).$$</div><div class="formula-sub">İntegral içindeki $f(x) - g(x)$ ifadesi $[a, b]$ üzerinde sıfır veya pozitif olmalıdır. Üstü ile altı karıştırırsanız sonuç negatif çıkar; mutlak değerini alın veya rolleri değiştirin.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Üst eğri $f(x)$</div><div class="card-body">$[a, b]$ üzerinde daha yüksekte duran grafik. Hangi olduğunu doğru belirlemek en sık yapılan hatadır — her zaman önce çizin.</div></div>
<div class="calc-card"><div class="card-title">Alt eğri $g(x)$</div><div class="card-body">Aşağıda kalan grafik. Bu eğri x-ekseni olabilir ($g = 0$); o durumda formül, $f$ altındaki bilinen alana indirgenir.</div></div>
<div class="calc-card"><div class="card-title">Sınırlar $a$ ve $b$</div><div class="card-body">Genellikle $f(x) = g(x)$ olan iki kesişim noktasının x-koordinatları. Bazen ise açıkça verilen dikey doğrular $x = a$, $x = b$.</div></div>
<div class="calc-card"><div class="card-title">İşaret kuralı</div><div class="card-body">Şerit alanı her zaman pozitiftir. Üstten altı çıkararak $[f(x) - g(x)] \\geq 0$ tutarız; böylece integralin kendisi doğrudan geometrik alanı verir.</div></div>
</div>

<div class="think-box"><div class="think-label">SABİT ÖTELEME NEDEN ETKİLEMEZ?</div><div class="think-body">Her iki eğriyi de aynı $c$ sabiti kadar yukarı kaydırırsanız, şerit yükseklikleri $(f + c) - (g + c) = f - g$ olarak değişmez. Yani alan, eğrilerin x-ekseninin altında olup olmamasına değil, yalnızca $f(x) - g(x)$ <em>farkına</em> bağlıdır. Formülün, bölgenin bir kısmı x-ekseninin altında olsa bile doğru sonucu vermesinin nedeni budur.</div></div>

<h2 class="lesson-title">2. Kesişim Noktalarını Bulma</h2>

<p class="l-text">$a$ ve $b$ sınırlarını koymak için iki eğrinin kesiştiği x-değerlerini bulmamız gerekir. Eğrileri birbirine eşitleyip çözeriz.</p>

<div class="calc-formula"><div class="formula-label">KESİŞİM KOŞULU</div><div class="formula-main">$$f(x) \\;=\\; g(x) \\quad \\Longrightarrow \\quad f(x) - g(x) \\;=\\; 0.$$</div><div class="formula-sub">Her şeyi bir tarafa toplayıp çözün. $f - g$'nin kökleri kesişim noktalarının x-koordinatlarıdır. Y-koordinatları, herhangi bir fonksiyona yerine yazılarak bulunur.</div></div>

<p class="l-text"><strong>Karşılaşılacak tipik cebir.</strong> $f(x) - g(x) = 0$ ifadesi genellikle bir polinom, trigonometrik bir denklem ya da üstel/logaritmik bir denklem ortaya çıkarır. Lise problemlerinde denklem neredeyse her zaman güzel çarpanlarına ayrılır veya az sayıda belirgin köke sahiptir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK (KESİŞİMLER)</div><div class="example-body"><strong>Bulun:</strong> $y = x$ ile $y = x^2$ nerede kesişir?<br><br>$x = x^2$ olur, yani $x^2 - x = 0$, dolayısıyla $x(x - 1) = 0$. Kökler $x = 0$ ve $x = 1$. Karşılık gelen y değerleri $y = 0$ ve $y = 1$ olduğu için iki kesişim noktası $(0, 0)$ ve $(1, 1)$.<br><br>$x = 0$ ile $x = 1$ arasında hangi eğri üstte? Bir test değeri seçelim, $x = 0.5$: doğru için $y = 0.5$, parabol için $y = 0.25$. Demek ki $y = x$ doğrusu $[0, 1]$ üzerinde üstte.</div></div>

<div class="l-note"><strong>Pratik ipucu.</strong> $f(x) = g(x)$ denklemini cebirsel olarak çözemiyorsanız (örneğin aşkın bir denklem), sayısal yöntemler dersi (Newton ya da yarılama) işinize yarar. Türk lise sorularında kesişimler her zaman elle çözülebilir.</p></div>

<h2 class="lesson-title">3. Birinci Çözümlü Örnek — $y = x$ ile $y = x^2$ Arası Alan</h2>

<p class="l-text">Az önce bulduğumuz kesişimleri formülle birleştirelim. $[0, 1]$ üzerinde üst eğri $f(x) = x$, alt eğri $g(x) = x^2$. Alan:</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\int_0^1 [\\,x - x^2\\,]\\,dx.$$</div></div>

<p class="l-text">Antiderivatifi terim terim hesaplayalım:</p>

<div class="calc-formula"><div class="formula-main">$$\\int [\\,x - x^2\\,]\\,dx \\;=\\; \\frac{x^2}{2} - \\frac{x^3}{3} + C.$$</div></div>

<p class="l-text">$0$'dan $1$'e değerlendirelim:</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1 \\;=\\; \\left(\\frac{1}{2} - \\frac{1}{3}\\right) - 0 \\;=\\; \\frac{3 - 2}{6} \\;=\\; \\frac{1}{6}.$$</div></div>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\boxed{\\;A \\;=\\; \\frac{1}{6}\\;}$$</div><div class="formula-sub">$[0, 1]$ üzerinde $y = x$ doğrusu ile $y = x^2$ parabolünün arasında kalan yaprak biçimli bölgenin alanı tam olarak altıda birdir.</div></div>

<div id="plot-l32-ex1-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],line=[],para=[];
for(var i=0;i<=100;i++){var x=i/100;xs.push(x);line.push(x);para.push(x*x);}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=line.slice().concat(para.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.22)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'kapalı bölge',hoverinfo:'skip',showlegend:true};
var tLine={x:xs,y:line,mode:'lines',name:'y = x (üst)',line:{color:'#3b82f6',width:2.8}};
var tPara={x:xs,y:para,mode:'lines',name:'y = x² (alt)',line:{color:'#c8a96e',width:2.8}};
var tPt={x:[0,1],y:[0,1],mode:'markers',name:'kesişimler',marker:{size:8,color:'#f87171'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.15,1.2]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.15,1.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:0.5,y:0.38,text:'A = 1/6',showarrow:false,font:{color:'#22c55e',size:14}}]};
Plotly.newPlot('plot-l32-ex1-tr',[tFill,tLine,tPara,tPt],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = x$ doğrusu (mavi) ve $y = x^2$ parabolü (altın) $(0,0)$ ile $(1,1)$ noktalarında kesişir. Taralı yeşil yaprak, az önce alanını hesapladığımız bölge: tam olarak $1/6$ birim karedir.</div></div>

<h2 class="lesson-title">4. İkinci Çözümlü Örnek — $[0, \\pi/4]$ Üzerinde $\\sin x$ ile $\\cos x$ Arası Alan</h2>

<p class="l-text">$[0, \\pi/4]$ üzerinde $y = \\sin x$ ve $y = \\cos x$ eğrileri zıt yönde değişir. $x = 0$'da $\\sin 0 = 0$, $\\cos 0 = 1$ olduğu için kosinüs üsttedir. $x = \\pi/4$'te ise her ikisi de $\\sin(\\pi/4) = \\cos(\\pi/4) = \\sqrt{2}/2$ değerinde buluşur.</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\int_0^{\\pi/4} [\\,\\cos x - \\sin x\\,]\\,dx.$$</div></div>

<p class="l-text">Antiderivatif $\\sin x + \\cos x$'tir ($\\int \\cos x\\,dx = \\sin x$ ve $\\int \\sin x\\,dx = -\\cos x$ olduğundan, eksiler artıda birleşir).</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\bigl[\\sin x + \\cos x\\bigr]_0^{\\pi/4} \\;=\\; \\left(\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2}\\right) - (0 + 1) \\;=\\; \\sqrt{2} - 1.$$</div></div>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\boxed{\\;A \\;=\\; \\sqrt{2} - 1 \\;\\approx\\; 0.414\\;}$$</div><div class="formula-sub">$[0, \\pi/4]$ üzerinde kosinüs ile sinüs arasındaki ince dilimin alanı $\\sqrt{2} - 1$ birim karedir.</div></div>

<div id="plot-l32-ex2-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],s=[],c=[];
var n=80;var b=Math.PI/4;
for(var i=0;i<=n;i++){var x=i*b/n;xs.push(x);s.push(Math.sin(x));c.push(Math.cos(x));}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=c.slice().concat(s.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.22)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'kapalı bölge',hoverinfo:'skip',showlegend:true};
var tCos={x:xs,y:c,mode:'lines',name:'y = cos x (üst)',line:{color:'#3b82f6',width:2.8}};
var tSin={x:xs,y:s,mode:'lines',name:'y = sin x (alt)',line:{color:'#c8a96e',width:2.8}};
var tPt={x:[b],y:[Math.SQRT2/2],mode:'markers',name:'kesişim',marker:{size:8,color:'#f87171'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.05,0.9]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.05,1.1]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:b/2,y:0.55,text:'A = √2 − 1',showarrow:false,font:{color:'#22c55e',size:13}}]};
Plotly.newPlot('plot-l32-ex2-tr',[tFill,tCos,tSin,tPt],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $[0, \\pi/4]$ üzerinde kosinüs eğrisi (mavi) sinüs eğrisinin (altın) üzerinde kalır, ta ki $x = \\pi/4$'te buluşana kadar. Taralı yeşil bölgenin alanı $\\sqrt{2} - 1 \\approx 0.414$.</div></div>

<h2 class="lesson-title">5. Üçüncü Çözümlü Örnek — $y = x^2$ ile $y = 4 - x^2$ Arası Alan</h2>

<p class="l-text">Burada her iki eğri de paraboldür, biri yukarı açılan ($y = x^2$), diğeri aşağı açılan ($y = 4 - x^2$). Kesişimi bulalım:</p>

<div class="calc-formula"><div class="formula-main">$$x^2 \\;=\\; 4 - x^2 \\quad \\Longrightarrow \\quad 2x^2 = 4 \\quad \\Longrightarrow \\quad x^2 = 2 \\quad \\Longrightarrow \\quad x = \\pm\\sqrt{2}.$$</div></div>

<p class="l-text">İki eğri $x = -\\sqrt{2}$ ve $x = \\sqrt{2}$ noktalarında kesişir. Aralarında hangisi üstte? $x = 0$'ı deneyelim: yukarı açılan $0$, aşağı açılan $4$ verir. Yani $4 - x^2$ üstte.</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\int_{-\\sqrt{2}}^{\\sqrt{2}} \\bigl[\\,(4 - x^2) - x^2\\,\\bigr]\\,dx \\;=\\; \\int_{-\\sqrt{2}}^{\\sqrt{2}} (4 - 2x^2)\\,dx.$$</div></div>

<p class="l-text">$4 - 2x^2$ integrandı çift bir fonksiyondur; yani $[0, \\sqrt{2}]$ üzerindeki integralin iki katını alabiliriz:</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; 2\\int_0^{\\sqrt{2}} (4 - 2x^2)\\,dx \\;=\\; 2\\left[4x - \\frac{2x^3}{3}\\right]_0^{\\sqrt{2}}.$$</div></div>

<p class="l-text">$x = \\sqrt{2}$'te: $4\\sqrt{2} - \\dfrac{2(\\sqrt{2})^3}{3} = 4\\sqrt{2} - \\dfrac{2 \\cdot 2\\sqrt{2}}{3} = 4\\sqrt{2} - \\dfrac{4\\sqrt{2}}{3} = \\dfrac{12\\sqrt{2} - 4\\sqrt{2}}{3} = \\dfrac{8\\sqrt{2}}{3}$.</p>

<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$\\boxed{\\;A \\;=\\; 2 \\cdot \\frac{8\\sqrt{2}}{3} \\;=\\; \\frac{16\\sqrt{2}}{3} \\;\\approx\\; 7.542\\;}$$</div><div class="formula-sub">İki parabol arasındaki mercek biçimli bölgenin alanı $16\\sqrt{2}/3$ birim karedir.</div></div>

<div id="plot-l32-ex3-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var s2=Math.sqrt(2);
var xs=[],up=[],dn=[];
var n=120;
for(var i=0;i<=n;i++){var x=-s2+2*s2*i/n;xs.push(x);up.push(4-x*x);dn.push(x*x);}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=up.slice().concat(dn.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.22)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'kapalı bölge',hoverinfo:'skip',showlegend:true};
var tUp={x:xs,y:up,mode:'lines',name:'y = 4 − x² (üst)',line:{color:'#3b82f6',width:2.8}};
var tDn={x:xs,y:dn,mode:'lines',name:'y = x² (alt)',line:{color:'#c8a96e',width:2.8}};
var tPt={x:[-s2,s2],y:[2,2],mode:'markers',name:'kesişimler',marker:{size:8,color:'#f87171'}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-2,2]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.3,4.5]},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:0,y:2,text:'A = 16√2 / 3',showarrow:false,font:{color:'#22c55e',size:13}}]};
Plotly.newPlot('plot-l32-ex3-tr',[tFill,tUp,tDn,tPt],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Yukarı açılan parabol $y = x^2$ (altın) ile aşağı açılan parabol $y = 4 - x^2$ (mavi) $(\\pm\\sqrt{2}, 2)$ noktalarında kesişir. Taralı yeşil merceğin alanı $16\\sqrt{2}/3 \\approx 7.54$.</div></div>

<h2 class="lesson-title">6. Birden Fazla Kesişim — Bölgeyi Parçalara Ayırın</h2>

<p class="l-text">İki eğri ikiden fazla noktada kesiştiğinde, "üst" ve "alt" rolleri her kesişimde değişir. İntegrali her kesişim noktasında bölmeli ve her parçanın mutlak değerini almalısınız — ya da denk olarak, her alt aralıkta doğru "üst" eğriyi seçmelisiniz.</p>

<div class="calc-formula"><div class="formula-label">PARÇALI ALAN FORMÜLÜ</div><div class="formula-main">$$A \\;=\\; \\int_a^c |f(x) - g(x)|\\,dx \\;=\\; \\sum_k \\int_{x_k}^{x_{k+1}} |f(x) - g(x)|\\,dx$$</div><div class="formula-sub">Burada $x_0 = a < x_1 < x_2 < \\dots < x_n = c$, $[a, c]$ üzerindeki tüm kesişim noktalarıdır. Her alt aralıkta bir eğri diğerinin üstündedir, böylece mutlak değer integralden önce çözülmüştür.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK (PARÇALAMA)</div><div class="example-body"><strong>Bulun:</strong> $[0, \\pi]$ üzerinde $y = \\sin x$ ile $y = \\cos x$ arasındaki toplam alan.<br><br>$\\sin x = \\cos x$ olur, yani $\\tan x = 1$. $[0, \\pi]$ üzerinde tek çözüm $x = \\pi/4$. Yani aralık $[0, \\pi/4]$ ile $[\\pi/4, \\pi]$ olarak ikiye bölünür.<br><br>$[0, \\pi/4]$ üzerinde: kosinüs sinüsün üstünde ($x = 0$: $\\cos = 1 > \\sin = 0$).<br>$[\\pi/4, \\pi]$ üzerinde: sinüs kosinüsün üstünde ($x = \\pi/2$: $\\sin = 1 > \\cos = 0$).<br><br>$A = \\int_0^{\\pi/4}(\\cos x - \\sin x)\\,dx + \\int_{\\pi/4}^{\\pi}(\\sin x - \\cos x)\\,dx$<br>$= [\\sin x + \\cos x]_0^{\\pi/4} + [-\\cos x - \\sin x]_{\\pi/4}^{\\pi}$<br>$= (\\sqrt{2} - 1) + ((1 - 0) - (-\\sqrt{2}/2 - \\sqrt{2}/2))$<br>$= (\\sqrt{2} - 1) + (1 + \\sqrt{2})$<br>$= 2\\sqrt{2}$.<br><br>Toplam alan: $\\boxed{2\\sqrt{2} \\approx 2.828}$ birim kare.</div></div>

<div class="think-box"><div class="think-label">UYARI</div><div class="think-body">Bölmeyi unutup $\\int_0^{\\pi}(\\cos x - \\sin x)\\,dx$'i tek seferde hesaplarsanız, $[\\pi/4, \\pi]$'den gelen negatif katkı $[0, \\pi/4]$'tan gelen pozitif katkıyı kısmen götürür ve yanlış sonuç alırsınız. İntegrali kurmadan önce her zaman çizin ve tüm kesişimleri bulun.</div></div>

<h2 class="lesson-title">7. $y$'ye Göre İntegral Almak</h2>

<p class="l-text">Bazı bölgelerin doğal kesimi dikey değil, yatay şeritlerledir. Bölge sağda $x = f(y)$, solda $x = g(y)$ eğrileri ile sınırlanıyor ve $y$, $c$ ile $d$ arasındaysa, $y$ yüksekliğindeki şeridin genişliği $f(y) - g(y)$, yüksekliği $dy$ olur. Toplam alan:</p>

<div class="calc-formula"><div class="formula-label">YATAY ŞERİTLERLE ALAN</div><div class="formula-main">$$A \\;=\\; \\int_c^d \\bigl[\\,f(y) - g(y)\\,\\bigr]\\,dy \\qquad (\\text{sağdaki} - \\text{soldaki}).$$</div><div class="formula-sub">Ana formülle aynı fikir; sadece şeritler artık yatay. İntegrand sağdaki eksi soldaki. Sınırlar eğrilerin buluştuğu y-değerleridir, $f(y) = g(y)$ denkleminden bulunur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ne zaman $dy$?</div><div class="card-body">Sınır eğrileri $x$'i $y$ cinsinden veriyorsa (ör. $x = y^2$, $x = \\sqrt{y}$, $x = 2 - y^2$) veya bir eğri dikey ise.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman $dx$?</div><div class="card-body">Sınır eğrileri $y$'yi $x$ cinsinden veriyorsa, dikey doğru testini geçiyorsa ve bölgeyi bölmek gerekmiyorsa.</div></div>
<div class="calc-card"><div class="card-title">İkisi de çalışır — kolay olanı seçin</div><div class="card-body">Çoğu bölge için her iki bakış da geçerlidir. Daha az integral veya daha basit cebir gerektireni seçin.</div></div>
</div>

<h2 class="lesson-title">8. Çözümlü Örnek — $y = x$ ile $y = x^2$ İki Farklı Yoldan</h2>

<p class="l-text">Dikey şeritlerle alanı hesapladık ve $1/6$ bulduk. Şimdi $dy$-yöntemini görmek için yatay şeritlerle yeniden yapalım.</p>

<p class="l-text"><strong>Adım 1. Her eğriyi $x$'i $y$ cinsinden yazın.</strong></p>

<div class="calc-formula"><div class="formula-main">$$y = x \\quad \\Longleftrightarrow \\quad x = y \\qquad\\qquad y = x^2 \\quad \\Longleftrightarrow \\quad x = \\sqrt{y}\\;(\\text{birinci bölgedeki dal}).$$</div></div>

<p class="l-text"><strong>Adım 2. Hangisi sağda?</strong> $0 < y < 1$ için $y = 1/4$'ü deneyelim: $x = y$ verir $x = 1/4$, $x = \\sqrt{y}$ verir $x = 1/2$. Yani $\\sqrt{y}$ sağda, $y$ solda.</p>

<p class="l-text"><strong>Adım 3. y-sınırları.</strong> Bölge $y \\in [0, 1]$ için vardır.</p>

<div class="calc-formula"><div class="formula-main">$$A \\;=\\; \\int_0^1 (\\sqrt{y} - y)\\,dy \\;=\\; \\left[\\frac{2}{3}y^{3/2} - \\frac{y^2}{2}\\right]_0^1 \\;=\\; \\frac{2}{3} - \\frac{1}{2} \\;=\\; \\frac{4 - 3}{6} \\;=\\; \\frac{1}{6}.$$</div></div>

<p class="l-text">Aynı sonuç, $1/6$. Mükemmel — her iki bakış da geometrik alanın tam olarak aynı olduğunu verir; vermeli zaten.</p>

<div id="plot-l32-dy-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],line=[],para=[];
for(var i=0;i<=100;i++){var x=i/100;xs.push(x);line.push(x);para.push(x*x);}
var xFill=xs.slice().concat(xs.slice().reverse());
var yFill=line.slice().concat(para.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(34,197,94,0.16)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'bölge',hoverinfo:'skip',showlegend:false};
var strips=[];
var ks=[0.15,0.30,0.45,0.60,0.75,0.90];
for(var k=0;k<ks.length;k++){var y=ks[k];var xL=y;var xR=Math.sqrt(y);strips.push({x:[xL,xR],y:[y,y],mode:'lines',line:{color:'#f59e0b',width:2.2},showlegend:(k===0),name:'yatay şeritler',hoverinfo:'skip'});}
var tLine={x:xs,y:line,mode:'lines',name:'x = y (sol sınır)',line:{color:'#3b82f6',width:2.5}};
var tPara={x:xs,y:para,mode:'lines',name:'x = √y (sağ sınır)',line:{color:'#c8a96e',width:2.5}};
var data=[tFill].concat(strips).concat([tLine,tPara]);
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'x',range:[-0.15,1.2]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'y',range:[-0.15,1.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:55,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22}};
Plotly.newPlot('plot-l32-dy-tr',data,layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Aynı yaprak bölge bu kez <em>yatay</em> şeritlerle (turuncu) kesilmiş. Her $y$ yüksekliğinde şerit, soldaki $x = y$ doğrusundan sağdaki $x = \\sqrt{y}$ paraboline kadar uzanır. $y = 0$'dan $y = 1$'e şerit genişliklerini toplamak yine aynı $1/6$ alanı verir.</div></div>

<h2 class="lesson-title">9. Önce Bölgeyi Çizin</h2>

<p class="l-text">Her alan problemi, resmi çizdiğiniz anda kolaylaşır. İyi bir çizim integralin sınırlarını, hangi eğrinin üstte/sağda olduğunu ve bölgenin parçalara bölünmesi gerekip gerekmediğini size söyler.</p>

<div class="calc-formula"><div class="formula-label">ÇİZİM KONTROL LİSTESİ</div><div class="formula-main"></div><div class="formula-sub">1. Her iki eğriyi aynı eksen üzerine kabaca çizin.<br>2. $f = g$ kurarak tüm kesişim noktalarını bulun.<br>3. Her alt aralığın <em>içinden</em> bir test x-değeri seçip üst eğriyi belirleyin.<br>4. Kapalı bölgeyi tarayın — her taralı parça bir integrale karşılık gelir.<br>5. Dikey şerit ($dx$) mı, yatay şerit ($dy$) mi işi kısa tutar, karar verin.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sınırlı mı, sınırsız mı?</div><div class="card-body">İki eğri arasındaki bölge sonsuza uzanabilir (ör. $[1, \\infty)$ üzerinde $y = 1/x$ ile x-ekseni arası — has olmayan integraller). Lise sorularında bölgeler her zaman sonludur.</div></div>
<div class="calc-card"><div class="card-title">Açık mı, kapalı mı?</div><div class="card-body">Bölgenin alanı, sınır eğrilerini dahil edip etmemenize göre değişmez. Ölçüm-sıfır kümeler eklemek/çıkarmak alanı etkilemez.</div></div>
<div class="calc-card"><div class="card-title">Basit mi, çok parçalı mı?</div><div class="card-body">Eğriler aralığınız içinde ikiden fazla kez kesişiyorsa bölge parçalara ayrılır — her biri toplama ayrı katkı verir.</div></div>
</div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Altı standart problem. Önce kâğıtta çözün, sonra cevaba bakın. Çizimi atlamayın.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>Bulun:</strong> $y = x^2$ ile $y = 2x$ arasındaki alan.<br><br><em>Çözüm.</em> $x^2 = 2x$, $x(x - 2) = 0$, $x = 0$ ve $x = 2$. $[0, 2]$ üzerinde $x = 1$ deneyin: doğru $2$, parabol $1$. Doğru üstte. $A = \\int_0^2 (2x - x^2)\\,dx = [x^2 - x^3/3]_0^2 = 4 - 8/3 = 4/3$. <strong>Cevap: $4/3$.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>Bulun:</strong> $y = 4 - x^2$ ile x-ekseninin sınırladığı alan.<br><br><em>Çözüm.</em> Eğri $y = 0$ ile $x = \\pm 2$'de kesişir. $f(x) = 4 - x^2$, $g(x) = 0$ alalım. Simetri ile $A = 2\\int_0^2 (4 - x^2)\\,dx = 2[4x - x^3/3]_0^2 = 2(8 - 8/3) = 2 \\cdot 16/3 = 32/3$. <strong>Cevap: $32/3$.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>Bulun:</strong> $y = x^3$ ile $y = x$ arasındaki alan.<br><br><em>Çözüm.</em> $x^3 = x$, $x(x^2 - 1) = 0$, $x = -1, 0, 1$. Üç kesişim — bölün! $[-1, 0]$ üzerinde: $x = -0.5$ için $x^3 = -0.125$ ve $x = -0.5$, yani $x^3$ üstte (daha az negatif). $[0, 1]$ üzerinde: $x = 0.5$ için $x = 0.5$ ve $x^3 = 0.125$, yani $x$ üstte.<br>$A_1 = \\int_{-1}^0 (x^3 - x)\\,dx = [x^4/4 - x^2/2]_{-1}^0 = 0 - (1/4 - 1/2) = 1/4$.<br>$A_2 = \\int_0^1 (x - x^3)\\,dx = [x^2/2 - x^4/4]_0^1 = 1/2 - 1/4 = 1/4$.<br>Toplam: $A = 1/4 + 1/4 = 1/2$. <strong>Cevap: $1/2$.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>Bulun:</strong> $x = 0$'dan $x = 1$'e kadar $y = e^x$ ile $y = 1$ arasındaki alan.<br><br><em>Çözüm.</em> $[0, 1]$ üzerinde $e^x \\geq 1$ (eşitlik $x = 0$'da). Üst $= e^x$, alt $= 1$.<br>$A = \\int_0^1 (e^x - 1)\\,dx = [e^x - x]_0^1 = (e - 1) - (1 - 0) = e - 2 \\approx 0.718$. <strong>Cevap: $e - 2$.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>Bulun:</strong> $x = y^2$ ile $x = y + 2$ arasındaki alan.<br><br><em>Çözüm.</em> Her ikisi de $x$'i $y$ cinsinden verdiği için yatay şeritler daha kolay. $y^2 = y + 2$, $y^2 - y - 2 = 0$, $(y - 2)(y + 1) = 0$, $y = -1$ ve $y = 2$. $[-1, 2]$ üzerinde hangisi sağda? $y = 0$: $y^2 = 0$, $y + 2 = 2$. $y + 2$ sağda.<br>$A = \\int_{-1}^2 [(y + 2) - y^2]\\,dy = [y^2/2 + 2y - y^3/3]_{-1}^2 = (2 + 4 - 8/3) - (1/2 - 2 + 1/3) = (10/3) - (-7/6) = 20/6 + 7/6 = 27/6 = 9/2$. <strong>Cevap: $9/2$.</strong></div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body"><strong>Bulun:</strong> $x = 0$'dan kesiştikleri yere kadar $y = \\sqrt{x}$ ile $y = x/2$ arasındaki alan.<br><br><em>Çözüm.</em> $\\sqrt{x} = x/2$. Kareye alın: $x = x^2/4$, yani $x^2 - 4x = 0$, $x(x - 4) = 0$. Eğriler $x = 0$ ve $x = 4$'te kesişir. $x = 1$ deneyin: $\\sqrt{1} = 1$ ve $1/2$. $\\sqrt{x}$ üstte.<br>$A = \\int_0^4 (\\sqrt{x} - x/2)\\,dx = [\\tfrac{2}{3}x^{3/2} - x^2/4]_0^4 = (\\tfrac{2}{3} \\cdot 8 - 4) - 0 = 16/3 - 4 = 16/3 - 12/3 = 4/3$. <strong>Cevap: $4/3$.</strong></div></div>

<h2 class="lesson-title">11. Görsel Özet ve Durumlar Tablosu</h2>

<p class="l-text">Kanonik örnek olan $y = x^2$ ile $y = x$ durumuna bir daha bakalım; bu kez kapalı alanın kendisi mavi ile vurgulanıyor. $(0,0)$ ve $(1,1)$ kesişim noktaları, alanı tam olarak $1/6$ olan yaprak biçimli bölgeyi çerçeveler.</p>

<div id="plot-l32-tr-extra" class="plotly-graph" style="height:440px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],line=[],para=[];
for(var i=0;i<=120;i++){var x=-0.1+1.3*i/120;xs.push(x);line.push(x);para.push(x*x);}
var xR=[],lR=[],pR=[];
for(var j=0;j<=120;j++){var u=j/120;xR.push(u);lR.push(u);pR.push(u*u);}
var xFill=xR.slice().concat(xR.slice().reverse());
var yFill=lR.slice().concat(pR.slice().reverse());
var tFill={x:xFill,y:yFill,fill:'toself',fillcolor:'rgba(59,130,246,0.28)',line:{color:'rgba(0,0,0,0)'},mode:'lines',name:'kapalı alan',hoverinfo:'skip',showlegend:true};
var tLine={x:xs,y:line,mode:'lines',name:'y = x',line:{color:'#3b82f6',width:2.8}};
var tPara={x:xs,y:para,mode:'lines',name:'y = x²',line:{color:'#c8a96e',width:2.8}};
var tPt={x:[0,1],y:[0,1],mode:'markers+text',name:'kesişimler',marker:{size:10,color:'#f87171'},text:['(0,0)','(1,1)'],textposition:'top center',textfont:{color:'#ebe6dc',size:11}};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',title:'x',range:[-0.18,1.3]},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.18)',title:'y',range:[-0.18,1.3],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:60,l:55},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:0.5,y:0.38,text:'A = ∫₀¹ (x − x²) dx = 1/6',showarrow:false,font:{color:'#3b82f6',size:14},bgcolor:'rgba(15,23,42,0.55)',bordercolor:'rgba(59,130,246,0.5)',borderwidth:1,borderpad:6}]};
Plotly.newPlot('plot-l32-tr-extra',[tFill,tLine,tPara,tPt],layout,{responsive:true,displayModeBar:false});
},250)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = x$ doğrusu ile $y = x^2$ parabolü $(0,0)$ ve $(1,1)$ noktalarından geçer. Aralarında kalan yarı şeffaf mavi bölge, $\\int_0^1 (x - x^2)\\,dx = 1/6$ alanıdır — "iki eğri arası alan" sorularını kurarken aklınızda tutmanız gereken kanonik örnek budur.</div></div>

<p class="l-text">Aşağıda karşılaşacağınız dört standart durumun kısa bir referans tablosu var. Sorunuzun geometrisini satıra eşleyin, ardından formülü ve kurulum notlarını okuyun.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;background:rgba(15,23,42,0.6);color:#ebe6dc;font-size:0.92rem;border:1px solid rgba(255,255,255,0.08)">
<thead>
<tr style="background:#3b82f6;color:#0b1220;text-align:left">
<th style="padding:0.75rem 0.9rem;border:1px solid rgba(255,255,255,0.12);font-weight:700">Durum</th>
<th style="padding:0.75rem 0.9rem;border:1px solid rgba(255,255,255,0.12);font-weight:700">Formül</th>
<th style="padding:0.75rem 0.9rem;border:1px solid rgba(255,255,255,0.12);font-weight:700">Notlar</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top"><strong>1.</strong> $[a,b]$ üzerinde $f(x) \\geq g(x)$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">$A = \\int_a^b [f(x) - g(x)]\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">Standart durum. $a, b$ sınırları ya açıkça verilir ya da $f(x) = g(x)$'ten bulunur. Üst eğrinin hangisi olduğunu önce çizin ve bir test noktasıyla doğrulayın.</td>
</tr>
<tr style="background:rgba(255,255,255,0.025)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top"><strong>2.</strong> Eğriler $[a,b]$ içinde kesişiyor</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">$A = \\sum_k \\int_{x_k}^{x_{k+1}} |f - g|\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">Her kesişimde bölün. Her alt aralıkta bir eğri sürekli üstte kalır; integralden önce doğru "üst − alt" düzenini seçin. Bölmeyi unutmak işaret iptalleri ve yanlış cevap getirir.</td>
</tr>
<tr>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top"><strong>3.</strong> $y$'ye göre integral (yatay şeritler)</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">$A = \\int_c^d [f(y) - g(y)]\\,dy$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">Eğriler $x = h(y)$ şeklinde verildiyse uygulayın (ör. $x = y^2$, $x = \\sqrt{y}$). $f(y)$ <em>sağdaki</em>, $g(y)$ soldaki eğridir. Sınırlar, kesişimlerin y-değerleridir.</td>
</tr>
<tr style="background:rgba(255,255,255,0.025)">
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top"><strong>4.</strong> Üç eğri ile sınırlı bölge</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">$A = \\int_a^{c} [u_1 - \\ell]\\,dx + \\int_c^{b} [u_2 - \\ell]\\,dx$</td>
<td style="padding:0.7rem 0.9rem;border:1px solid rgba(255,255,255,0.08);vertical-align:top">Üç ikili kesişimi de bulun; üst sınır bunlardan birinde (burada $x = c$'de) değişir. İntegrali bölün, her parçada uygun üst eğriyi $u_1, u_2$ olarak kullanın; ortak alt $\\ell$ değişmiyorsa böyle kalır, değişiyorsa aynı mantığı alt eğri için de uygulayın.</td>
</tr>
</tbody>
</table>
</div>

<div class="l-note"><strong>Bu derste öğrendikleriniz.</strong> Ana formül $A = \\int_a^b [f(x) - g(x)]\\,dx$ her iki-eğri alan problemini çözer — yeter ki (i) önce çizin, (ii) tüm kesişimleri bulun, (iii) her alt aralıkta üst eğriyi belirleyin ve (iv) eğriler rol değiştirdiğinde bölgeyi parçalayın. Eğriler $x = h(y)$ olarak veriliyorsa $dy$-formülü doğru araçtır. Bir sonraki ders alandan hacme geçiyor — aynı dilimleme fikri, bir boyut yukarı.</div>`
};
