window.LISE_MAT_L16 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The Intermediate Value Theorem (IVT) is the first deep theorem you will meet in continuous mathematics.</strong> It says something almost obvious — "a continuous curve cannot jump over a horizontal line" — and yet from this single sentence we can prove that polynomial equations have roots, that the bisection method works, that fixed points exist, and that many "obviously true" statements about real numbers have rigorous justifications. In lesson 15 we built up the notion of continuity. Now we put it to work.</p>

<p class="l-text">By the end of this lesson you will be able to state the IVT precisely, recognise when its hypotheses fail, prove that specific equations have solutions inside specific intervals, run the bisection algorithm by hand on a polynomial, and argue why a continuous map of a closed interval to itself must have at least one fixed point. These are exactly the kinds of reasoning steps that show up on AYT, KPSS, and on the entrance examinations of any quantitative programme.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the Intermediate Value Theorem precisely and identify the role of the closed interval and continuity hypotheses</li>
<li>Read the IVT geometrically as "a horizontal line between $f(a)$ and $f(b)$ must cross the graph of $f$"</li>
<li>Apply Bolzano's theorem (the sign-change special case) to prove that a continuous function has a root in $[a,b]$</li>
<li>Show that polynomial equations like $x^3 - x - 1 = 0$ have at least one real root inside a given interval</li>
<li>Run the bisection algorithm step-by-step to localise a root to any desired precision</li>
<li>Use the IVT to deduce existence of fixed points of continuous maps $f:[0,1]\\to[0,1]$</li>
<li>Distinguish what the IVT does say (existence) from what it does not say (number of roots, location, behaviour outside the interval)</li>
</ul>
</div>

<h2 class="lesson-title">1. The Intermediate Value Theorem (IVT)</h2>

<div class="calc-highlight"><strong>Plain-English statement:</strong> if $f$ is continuous on a closed interval $[a,b]$, and $c$ is any value strictly between $f(a)$ and $f(b)$, then there is at least one point $x_0$ in $(a,b)$ where $f(x_0) = c$. In words: a continuous function hits every intermediate output value on its way from $f(a)$ to $f(b)$.</div>

<p class="l-text">Read it slowly. There are three ingredients, and each one is essential. Drop any single one and the conclusion can fail.</p>

<div class="calc-formula"><div class="formula-label">INTERMEDIATE VALUE THEOREM</div><div class="formula-main">$$\\text{If } f \\in C[a,b] \\text{ and } c \\text{ is between } f(a) \\text{ and } f(b), \\text{ then } \\exists\\, x_0 \\in (a,b): f(x_0) = c.$$</div><div class="formula-sub">$C[a,b]$ means "continuous on the closed interval $[a,b]$." The notation $\\exists$ reads "there exists."</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Closed interval $[a,b]$</div><div class="card-body">Both endpoints belong to the interval. We need the function defined and continuous all the way up to $a$ and $b$. The conclusion can fail on an open interval like $(0,1]$ if the function blows up near 0.</div></div>
<div class="calc-card"><div class="card-title">Continuous on $[a,b]$</div><div class="card-body">No jumps, no holes, no vertical asymptotes anywhere between $a$ and $b$. Lesson 15 covered exactly what this means. Continuity is non-negotiable — without it the theorem collapses.</div></div>
<div class="calc-card"><div class="card-title">$c$ strictly between $f(a)$, $f(b)$</div><div class="card-body">The value we want to hit must lie between the two endpoint values. If $c$ is outside this range, the theorem says nothing about whether $f$ takes the value $c$ inside $[a,b]$.</div></div>
</div>

<p class="l-text"><strong>An everyday picture.</strong> Imagine driving from sea level (altitude $f(a) = 0$ m) to the top of a 2000 m mountain (altitude $f(b) = 2000$ m). At some moment your altimeter shows exactly 1437 m. Why? Because your altitude is a continuous function of time — you cannot teleport. Every value between 0 and 2000 must appear at some instant. That is the IVT in physical form.</p>

<div class="think-box"><div class="think-label">A QUICK MENTAL EXPERIMENT</div><div class="think-body">Heat a metal rod from 20&deg;C to 80&deg;C. Does the rod pass through a temperature of exactly 50&deg;C? Yes, by the IVT applied to temperature as a function of time. Does it pass through 50&deg;C exactly once, or possibly many times? The IVT only guarantees <em>at least one</em>. If you turn the heater on and off, the rod might cross 50&deg;C many times. The theorem promises existence, not uniqueness.</div></div>

<h2 class="lesson-title">2. Geometric Intuition</h2>

<div class="calc-highlight"><strong>The IVT visualised:</strong> draw the graph of a continuous $f$ on $[a,b]$. The graph starts at the point $(a, f(a))$ and ends at the point $(b, f(b))$. Now draw any horizontal line $y = c$ between these two heights. The graph cannot get from one endpoint to the other without crossing that line. The crossing point — its $x$-coordinate — is the $x_0$ the theorem promises.</div>

<p class="l-text">This picture only works because the graph is <em>connected</em>. A continuous function draws its graph without lifting the pen. If we could lift the pen — that is, if the function had a jump discontinuity — we could leap over the horizontal line and the conclusion would fail.</p>

<div class="calc-graph"><div id="plot-l16-ivt-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a continuous function on $[a,b]$ with $f(a) < f(b)$. The dashed horizontal line $y = c$ sits between the two endpoint values. The curve must cross the line at least once — the marked point $x_0$ is the IVT's promised crossing.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=i/100;xs.push(x);ys.push(0.4+1.6*x-0.5*Math.sin(3*x));}
var curve={x:xs,y:ys,mode:'lines',name:'y = f(x)',line:{color:'#3b82f6',width:3}};
var cline={x:[0,2],y:[1.6,1.6],mode:'lines',name:'y = c',line:{color:'#f59e0b',width:2,dash:'dash'}};
var ptA={x:[0],y:[0.4],mode:'markers+text',name:'(a, f(a))',marker:{color:'#22c55e',size:10},text:['(a, f(a))'],textposition:'top right',textfont:{color:'#e8e8e8',size:11}};
var ptB={x:[2],y:[3.6-0.5*Math.sin(6)],mode:'markers+text',name:'(b, f(b))',marker:{color:'#22c55e',size:10},text:['(b, f(b))'],textposition:'bottom left',textfont:{color:'#e8e8e8',size:11}};
var x0=0.83;
var ptX={x:[x0],y:[1.6],mode:'markers+text',name:'(x_0, c)',marker:{color:'#ef4444',size:12,symbol:'circle-open',line:{width:2.5,color:'#ef4444'}},text:['x_0'],textposition:'top center',textfont:{color:'#ef4444',size:13}};
var drop={x:[x0,x0],y:[0,1.6],mode:'lines',name:'',line:{color:'rgba(239,68,68,0.35)',width:1,dash:'dot'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.2,2.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.3,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l16-ivt-en',[curve,cline,ptA,ptB,drop,ptX],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Why continuity is needed.</strong> Consider the step function $f(x) = -1$ for $x < 0$ and $f(x) = +1$ for $x \\geq 0$. At the endpoints of $[-1, 1]$ we have $f(-1) = -1$ and $f(1) = 1$. Yet $f$ never equals $0$ anywhere on $[-1, 1]$ — there is no $x_0$ with $f(x_0) = 0$. The graph jumps over the line $y = 0$ at the origin. Continuity is exactly what forbids this kind of jump.</p>

<div class="l-note"><strong>What "between" really means.</strong> If $f(a) \\leq f(b)$, then "$c$ between $f(a)$ and $f(b)$" means $f(a) \\leq c \\leq f(b)$. If $f(a) \\geq f(b)$, the inequalities flip. In either case the IVT applies. The function need not be increasing; the theorem holds for any continuous shape.</div>

<h2 class="lesson-title">3. Bolzano's Theorem: The Sign-Change Case</h2>

<div class="calc-highlight"><strong>Bolzano (1817):</strong> if $f$ is continuous on $[a,b]$ and $f(a) \\cdot f(b) < 0$ (the endpoint values have <em>opposite signs</em>), then $f$ has at least one root inside $(a,b)$. This is the IVT in its most useful form: take $c = 0$, observe that $0$ sits between a negative and a positive value, and conclude there is a zero of $f$.</div>

<p class="l-text">Bernard Bolzano stated and proved this special case in 1817, several decades before the IVT was packaged in its general form. Mathematicians sometimes call the sign-change version "Bolzano's theorem" and the general version "the intermediate value theorem," but in many textbooks the two names are used interchangeably. The two statements are equivalent — one implies the other almost trivially.</p>

<div class="calc-formula"><div class="formula-label">BOLZANO'S THEOREM</div><div class="formula-main">$$f \\in C[a,b] \\text{ and } f(a) \\cdot f(b) < 0 \\;\\Longrightarrow\\; \\exists\\, x_0 \\in (a,b): f(x_0) = 0$$</div><div class="formula-sub">Sign change on a continuous function forces a root. Geometrically: the graph crosses the $x$-axis.</div></div>

<p class="l-text"><strong>How to use it in problems.</strong> You almost never test "is $f(a) \\cdot f(b) < 0$" by multiplying. Instead you just check the signs: is $f(a)$ negative and $f(b)$ positive, or vice versa? If yes, you have a sign change, the function is continuous, and Bolzano hands you a root for free.</p>

<div class="calc-graph"><div id="plot-l16-bolzano-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a continuous function with $f(a) < 0$ and $f(b) > 0$. The graph must cross the $x$-axis somewhere in $(a,b)$ — that crossing point is the root Bolzano guarantees. The shaded regions emphasise the change of sign.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=300;i++){var x=-1.5+3*i/300;xs.push(x);ys.push(x*x*x-x-0.3);}
var curve={x:xs,y:ys,mode:'lines',name:'y = f(x)',line:{color:'#3b82f6',width:3}};
var axis={x:[-1.6,1.6],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.4)',width:1}};
var ptA={x:[-1.5],y:[-1.5*-1.5*-1.5-(-1.5)-0.3],mode:'markers+text',name:'(a, f(a)) < 0',marker:{color:'#ef4444',size:10},text:['f(a) < 0'],textposition:'top right',textfont:{color:'#ef4444',size:12}};
var ptB={x:[1.5],y:[1.5*1.5*1.5-1.5-0.3],mode:'markers+text',name:'(b, f(b)) > 0',marker:{color:'#22c55e',size:10},text:['f(b) > 0'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var root=1.12;
var ptR={x:[root],y:[0],mode:'markers+text',name:'root x_0',marker:{color:'#f59e0b',size:13,symbol:'star'},text:['root'],textposition:'bottom center',textfont:{color:'#f59e0b',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.8,1.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l16-bolzano-en',[curve,axis,ptA,ptB,ptR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Show that</strong> $f(x) = x^5 + 2x - 1$ has at least one real root.<br><br>$f$ is a polynomial, hence continuous everywhere.<br>$f(0) = 0 + 0 - 1 = -1 < 0$.<br>$f(1) = 1 + 2 - 1 = 2 > 0$.<br><br>Sign change on $[0, 1]$ with $f$ continuous, so by Bolzano's theorem there is some $x_0 \\in (0, 1)$ with $f(x_0) = 0$. The equation $x^5 + 2x - 1 = 0$ has a real root in $(0, 1)$. $\\blacksquare$</div></div>

<h2 class="lesson-title">4. Existence of Roots: Applications</h2>

<div class="calc-highlight"><strong>The pattern.</strong> Whenever you are asked to show "the equation $g(x) = 0$ has a solution," the IVT/Bolzano strategy is: (1) write everything on one side, $f(x) = g(x)$; (2) check that $f$ is continuous; (3) find two values $a, b$ where $f$ has opposite signs; (4) cite Bolzano. Three lines and you have an existence proof.</div>

<p class="l-text">This is the bread and butter of IVT problems on Turkish university entrance exams and on KPSS quantitative sections. The work is in finding good values of $a$ and $b$. Try small integers first (0, 1, $-1$, 2, $-2$). If neither works, try slightly bigger numbers, or use the structure of the function.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body"><strong>Show that</strong> $x^3 - x - 1 = 0$ has a root in $[1, 2]$.<br><br>Let $f(x) = x^3 - x - 1$. $f$ is a polynomial, so continuous on $[1, 2]$.<br><br>$f(1) = 1 - 1 - 1 = -1 < 0$.<br>$f(2) = 8 - 2 - 1 = 5 > 0$.<br><br>By Bolzano's theorem, there is some $x_0 \\in (1, 2)$ with $f(x_0) = 0$. So the equation has a root in the interval $[1, 2]$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body"><strong>Show that</strong> $\\cos x = x$ has a solution in $[0, 1]$.<br><br>Move everything to one side: let $f(x) = \\cos x - x$. Then $f$ is continuous (sum of two continuous functions).<br><br>$f(0) = \\cos 0 - 0 = 1 - 0 = 1 > 0$.<br>$f(1) = \\cos 1 - 1 \\approx 0.5403 - 1 = -0.4597 < 0$.<br><br>Sign change. Bolzano gives a root of $f$ in $(0, 1)$, that is, a solution of $\\cos x = x$ in $(0, 1)$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body"><strong>Show that</strong> every odd-degree polynomial has at least one real root.<br><br>Let $p(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_0$ with $n$ odd and $a_n > 0$ (the case $a_n < 0$ is analogous).<br><br>As $x \\to +\\infty$ the dominant term $a_n x^n$ goes to $+\\infty$. As $x \\to -\\infty$ it goes to $-\\infty$ (because $n$ is odd). So $p(x)$ is eventually very positive and eventually very negative.<br><br>Pick $b$ large enough that $p(b) > 0$, and $a$ negative enough that $p(a) < 0$. Polynomials are continuous on $[a, b]$. Sign change + continuity, so by Bolzano $p$ has a root in $(a, b)$. $\\blacksquare$<br><br>This is why $x^3$, $x^5$, $x^7$, and every other odd-degree polynomial — no matter how complicated — must touch the $x$-axis at least once.</div></div>

<h2 class="lesson-title">5. The Bisection Method</h2>

<div class="calc-highlight"><strong>The bisection method is the simplest root-finding algorithm.</strong> It takes Bolzano's existence guarantee and turns it into a concrete recipe: starting from an interval where you know a root exists, repeatedly halve the interval, keeping the half where the sign change still happens. After enough halvings the interval is so small that any point inside is a good approximation to the root.</div>

<p class="l-text">Here is the recipe in five steps. Suppose $f$ is continuous on $[a, b]$ with $f(a) \\cdot f(b) < 0$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — midpoint</div><div class="card-body">Compute $m = \\dfrac{a+b}{2}$, the midpoint of the current interval.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — evaluate</div><div class="card-body">Compute $f(m)$. If $f(m) = 0$ exactly (or close enough), you have found the root. Stop.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — pick the half</div><div class="card-body">Otherwise look at the sign of $f(m)$. Replace whichever endpoint has the same sign with $m$. The sign change is now between $m$ and the surviving endpoint.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — repeat</div><div class="card-body">Go back to step 1 with the new (half-sized) interval. After $n$ steps the interval is $(b-a)/2^n$ wide.</div></div>
<div class="calc-card"><div class="card-title">Step 5 — stop</div><div class="card-body">Stop when the interval is shorter than your target precision. Report the midpoint as the approximate root.</div></div>
</div>

<p class="l-text"><strong>Why it always works.</strong> At every step the sign change is preserved, so by Bolzano there is a root in the current interval. The interval shrinks by a factor of 2 each step, so it converges geometrically to a single point — and that point must be the root.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Apply bisection to $f(x) = x^3 - x - 1$ on $[1, 2]$. (We already know from Section 4 that a root exists here.)<br><br><strong>Step 0:</strong> $[a, b] = [1, 2]$, $f(1) = -1$, $f(2) = 5$. Width $= 1$.<br><strong>Step 1:</strong> $m = 1.5$, $f(1.5) = 3.375 - 1.5 - 1 = 0.875 > 0$. Replace $b$ by $m$. New interval $[1, 1.5]$. Width $= 0.5$.<br><strong>Step 2:</strong> $m = 1.25$, $f(1.25) = 1.953 - 1.25 - 1 = -0.297 < 0$. Replace $a$ by $m$. New interval $[1.25, 1.5]$. Width $= 0.25$.<br><strong>Step 3:</strong> $m = 1.375$, $f(1.375) = 2.600 - 1.375 - 1 = 0.225 > 0$. Replace $b$ by $m$. New interval $[1.25, 1.375]$. Width $= 0.125$.<br><strong>Step 4:</strong> $m = 1.3125$, $f(1.3125) \\approx -0.052 < 0$. Replace $a$. New interval $[1.3125, 1.375]$. Width $\\approx 0.063$.<br><strong>Step 5:</strong> $m = 1.34375$, $f(m) \\approx 0.083 > 0$. Replace $b$. New interval $[1.3125, 1.34375]$. Width $\\approx 0.031$.<br><br>After five steps the root is trapped in an interval of length about $0.031$. The midpoint $\\approx 1.328$ is correct to two decimals. The true value is $1.3247...$.</div></div>

<div class="calc-graph"><div id="plot-l16-bisect-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the graph of $f(x) = x^3 - x - 1$ on $[1, 2]$ with the first four bisection intervals indicated below the $x$-axis as horizontal bars. Each bar is half the length of the previous one. The shrinking bars converge to the root marked by the star.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=0.9+1.2*i/200;xs.push(x);ys.push(x*x*x-x-1);}
var curve={x:xs,y:ys,mode:'lines',name:'f(x) = x^3 - x - 1',line:{color:'#3b82f6',width:3}};
var axis={x:[0.9,2.1],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var bars=[
{x:[1,2],y:[-1.6,-1.6],lab:'[1, 2]',col:'#f59e0b'},
{x:[1,1.5],y:[-1.85,-1.85],lab:'[1, 1.5]',col:'#fbbf24'},
{x:[1.25,1.5],y:[-2.1,-2.1],lab:'[1.25, 1.5]',col:'#a3e635'},
{x:[1.25,1.375],y:[-2.35,-2.35],lab:'[1.25, 1.375]',col:'#22c55e'}
];
var traces=[curve,axis];
for(var i=0;i<bars.length;i++){
  traces.push({x:bars[i].x,y:bars[i].y,mode:'lines+text',name:bars[i].lab,line:{color:bars[i].col,width:4},text:['','step '+(i+1)],textposition:'top right',textfont:{color:bars[i].col,size:11},showlegend:false});
}
var root=1.3247;
traces.push({x:[root],y:[0],mode:'markers+text',name:'root',marker:{color:'#ef4444',size:13,symbol:'star'},text:['root ≈ 1.3247'],textposition:'top center',textfont:{color:'#ef4444',size:12}});
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0.9,2.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-3,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l16-bisect-en',traces,lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Precision after $n$ steps.</strong> If the starting interval has width $w_0 = b - a$, then after $n$ bisections the interval has width $w_0 / 2^n$. To get precision $\\varepsilon$ you need $n \\geq \\log_2(w_0 / \\varepsilon)$ steps. To halve a unit interval down to $10^{-6}$ takes about 20 bisections — slow compared to Newton's method, but completely reliable.</div>

<h2 class="lesson-title">6. Fixed Points: A First Look</h2>

<div class="calc-highlight"><strong>A fixed point</strong> of a function $f$ is a number $x$ where $f(x) = x$ — the function leaves it where it is. The IVT gives a beautiful one-line proof that <em>every</em> continuous map of a closed interval to itself has a fixed point. This is the simplest case of the famous Brouwer fixed-point theorem.</div>

<p class="l-text"><strong>The theorem.</strong> Suppose $f: [0, 1] \\to [0, 1]$ is continuous. Then there exists $x_0 \\in [0, 1]$ with $f(x_0) = x_0$.</p>

<div class="calc-formula"><div class="formula-label">FIXED-POINT EXISTENCE (1-D)</div><div class="formula-main">$$f \\in C\\big([0,1]\\big) \\text{ and } f([0,1]) \\subseteq [0,1] \\;\\Longrightarrow\\; \\exists\\, x_0 \\in [0,1]: f(x_0) = x_0$$</div></div>

<p class="l-text"><strong>The proof, in one paragraph.</strong> Define $g(x) = f(x) - x$. Then $g$ is continuous (difference of continuous functions). Look at the endpoints.</p>

<p class="l-text">At $x = 0$: $g(0) = f(0) - 0 = f(0) \\geq 0$ (because $f(0)$ lives in $[0, 1]$, so it is at least 0).<br>At $x = 1$: $g(1) = f(1) - 1 \\leq 0$ (because $f(1)$ lives in $[0, 1]$, so it is at most 1).</p>

<p class="l-text">Either $g(0) = 0$ (then $0$ is the fixed point), or $g(1) = 0$ (then $1$ is the fixed point), or $g(0) > 0$ and $g(1) < 0$ — sign change, so by Bolzano there is an $x_0$ with $g(x_0) = 0$, that is $f(x_0) = x_0$. $\\blacksquare$</p>

<div class="calc-graph"><div id="plot-l16-fixed-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the diagonal line $y = x$ and the graph of a continuous map $f: [0,1] \\to [0,1]$. Because $f$ starts at or above the diagonal at $x = 0$ and ends at or below the diagonal at $x = 1$, the two graphs must cross. The crossing point is the fixed point.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];var diag=[];for(var i=0;i<=200;i++){var x=i/200;xs.push(x);ys.push(0.2+0.55*x+0.18*Math.sin(4*x));diag.push(x);}
var curve={x:xs,y:ys,mode:'lines',name:'y = f(x)',line:{color:'#3b82f6',width:3}};
var line={x:xs,y:diag,mode:'lines',name:'y = x',line:{color:'#f59e0b',width:2,dash:'dash'}};
var fp_x=0.466;
var fp={x:[fp_x],y:[fp_x],mode:'markers+text',name:'fixed point',marker:{color:'#ef4444',size:13,symbol:'star'},text:['x_0 = f(x_0)'],textposition:'top left',textfont:{color:'#ef4444',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.05,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.05,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l16-fixed-en',[curve,line,fp],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">PHYSICAL ANALOGUE</div><div class="think-body">Place two identical maps of Turkey on a table — one underneath, one crumpled and tossed on top. Brouwer's theorem says that <em>some</em> point on the crumpled map sits directly above the matching point on the flat map. The 1-D version above is the baby case. The full theorem, proved by Brouwer in 1910, holds in any dimension and is the basis for proofs in economics (Nash equilibria), topology, and game theory.</div></div>

<h2 class="lesson-title">7. AYT/KPSS-Style Problems</h2>

<div class="calc-highlight"><strong>Turkish exam problems on the IVT</strong> almost always follow one of three templates: prove a sign change, locate a root in a specific interval, or argue that a function takes a specific value. The strategy is mechanical once you recognise it.</div>

<div class="calc-example"><div class="example-label">PROBLEM 1 — AYT STYLE</div><div class="example-body">$f(x) = x^3 + 3x - 5$ fonksiyonu için aşağıdakilerden hangisi söylenebilir?<br><br>(A) $f$'nin $(-2, -1)$ aralığında kökü vardır.<br>(B) $f$'nin $(0, 2)$ aralığında kökü vardır.<br>(C) $f$'nin $(2, 3)$ aralığında kökü vardır.<br>(D) $f$'nin gerçek kökü yoktur.<br>(E) $f$'nin tüm kökleri pozitiftir.<br><br><strong>Solution.</strong> Compute endpoint values:<br>$f(0) = 0 + 0 - 5 = -5$.<br>$f(2) = 8 + 6 - 5 = 9$.<br><br>Sign change on $(0, 2)$. Bolzano applies (polynomial continuous), so $f$ has a root in $(0, 2)$. <strong>Answer: (B).</strong></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — IVT WITH A TARGET VALUE</div><div class="example-body"><strong>Show that</strong> there exists $x_0 \\in (0, \\pi/2)$ such that $\\sin x_0 + x_0 = 1$.<br><br>Let $f(x) = \\sin x + x - 1$. This is continuous.<br>$f(0) = 0 + 0 - 1 = -1 < 0$.<br>$f(\\pi/2) = 1 + \\pi/2 - 1 = \\pi/2 \\approx 1.571 > 0$.<br><br>Sign change, so by Bolzano there is $x_0 \\in (0, \\pi/2)$ with $f(x_0) = 0$, i.e. $\\sin x_0 + x_0 = 1$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — TWO FUNCTIONS MEETING</div><div class="example-body"><strong>Show that</strong> the graphs of $y = e^x$ and $y = 3 - x$ intersect in $(0, 1)$.<br><br>The graphs cross where $e^x = 3 - x$, i.e. where $h(x) = e^x - 3 + x = 0$. $h$ is continuous.<br>$h(0) = 1 - 3 + 0 = -2 < 0$.<br>$h(1) = e - 3 + 1 = e - 2 \\approx 0.718 > 0$.<br><br>Sign change, so Bolzano gives $x_0 \\in (0, 1)$ with $h(x_0) = 0$, i.e. $e^{x_0} = 3 - x_0$. The graphs meet at $(x_0, e^{x_0})$. $\\blacksquare$</div></div>

<h2 class="lesson-title">8. What the IVT Does Not Say</h2>

<div class="calc-highlight"><strong>The IVT is an existence theorem.</strong> It promises <em>at least one</em> point with the desired property. It says nothing about how many such points there are, where exactly they sit, or how to compute them. Misreading the conclusion is the most common mistake in exam answers.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">WHAT THE IVT GUARANTEES</div><div class="compare-item">At least one $x_0$ with $f(x_0) = c$ exists in $(a, b)$</div><div class="compare-item">The conclusion is purely about <em>existence</em></div><div class="compare-item">Combined with continuity, gives the bisection algorithm</div></div><div class="compare-col"><div class="compare-title">WHAT IT DOES NOT GUARANTEE</div><div class="compare-item">Uniqueness: there may be many roots, not just one</div><div class="compare-item">Location: the theorem does not tell you <em>where</em> in $(a, b)$</div><div class="compare-item">Behaviour outside $[a, b]$: zero information</div></div></div>

<p class="l-text"><strong>Example of multiple roots.</strong> Take $f(x) = \\sin(\\pi x)$ on $[0, 3]$. Then $f(0) = 0$ and $f(3) = 0$. The IVT says nothing in this case (both endpoint values are 0), but the function has roots at $x = 0, 1, 2, 3$ — four of them. Conversely $f(x) = \\sin(\\pi x)$ on $[0.5, 1.5]$ has $f(0.5) = 1$ and $f(1.5) = -1$, so Bolzano guarantees at least one root, and indeed the only one is $x_0 = 1$.</p>

<div class="l-note"><strong>The converse of the IVT is false.</strong> A function can take every value between $f(a)$ and $f(b)$ without being continuous. Darboux's theorem shows that derivatives have the intermediate-value property even when they are not continuous — so "intermediate-value property" is weaker than "continuous." For the rest of this course we will use the IVT only in its forward direction: continuity implies IVT, never the other way round.</div>

<h2 class="lesson-title">9. Exercises</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — BASIC ROOT EXISTENCE</div><div class="example-body"><strong>Show that</strong> $f(x) = x^3 + x - 3$ has a root in $[1, 2]$.<br><br><em>Solution.</em> $f$ is a polynomial, hence continuous.<br>$f(1) = 1 + 1 - 3 = -1 < 0$.<br>$f(2) = 8 + 2 - 3 = 7 > 0$.<br>Bolzano applies: there is a root in $(1, 2)$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — TRANSCENDENTAL EQUATION</div><div class="example-body"><strong>Show that</strong> $e^x = 2x + 1$ has a solution in $(1, 2)$.<br><br><em>Solution.</em> Let $f(x) = e^x - 2x - 1$. Continuous.<br>$f(1) = e - 2 - 1 \\approx 2.718 - 3 = -0.282 < 0$.<br>$f(2) = e^2 - 4 - 1 \\approx 7.389 - 5 = 2.389 > 0$.<br>Bolzano: root in $(1, 2)$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — BISECTION TO 2 DECIMALS</div><div class="example-body">Apply bisection to $f(x) = x^2 - 3$ on $[1, 2]$ to find $\\sqrt{3}$ correct to 2 decimals.<br><br><em>Solution.</em> $f(1) = -2$, $f(2) = 1$.<br>$m = 1.5$, $f(1.5) = -0.75 < 0$ &rarr; $[1.5, 2]$.<br>$m = 1.75$, $f(1.75) = 0.0625 > 0$ &rarr; $[1.5, 1.75]$.<br>$m = 1.625$, $f(1.625) = -0.359 < 0$ &rarr; $[1.625, 1.75]$.<br>$m = 1.6875$, $f(1.6875) = -0.152 < 0$ &rarr; $[1.6875, 1.75]$.<br>$m = 1.71875$, $f(1.71875) = -0.0459 < 0$ &rarr; $[1.71875, 1.75]$.<br>$m = 1.734375$, $f \\approx 0.008 > 0$ &rarr; $[1.71875, 1.734375]$.<br>Width $\\approx 0.016 < 0.01 \\times 2$. Midpoint $\\approx 1.73$. The true value $\\sqrt{3} = 1.732...$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — FIXED-POINT APPLICATION</div><div class="example-body"><strong>Show that</strong> the equation $\\cos x = x$ has a unique solution in $[0, 1]$ and find it to 1 decimal by bisection.<br><br><em>Existence.</em> $g(x) = \\cos x - x$, continuous. $g(0) = 1$, $g(1) = \\cos 1 - 1 \\approx -0.46$. Bolzano gives a root.<br><br><em>Bisection.</em> $m = 0.5$, $g(0.5) \\approx 0.378 > 0$ &rarr; $[0.5, 1]$.<br>$m = 0.75$, $g(0.75) \\approx -0.018 < 0$ &rarr; $[0.5, 0.75]$.<br>$m = 0.625$, $g(0.625) \\approx 0.186 > 0$ &rarr; $[0.625, 0.75]$.<br>$m = 0.6875$, $g(0.6875) \\approx 0.085 > 0$ &rarr; $[0.6875, 0.75]$.<br>$m = 0.71875$, $g \\approx 0.034 > 0$ &rarr; $[0.71875, 0.75]$.<br>Result: root in $[0.72, 0.75]$, so to one decimal $x_0 \\approx 0.7$. (True value $0.7390...$.) $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — INTERMEDIATE VALUE (NOT A ROOT)</div><div class="example-body"><strong>Show that</strong> $f(x) = x^4 - 2x + 1$ takes the value $4$ at some point in $[1, 2]$.<br><br><em>Solution.</em> Define $g(x) = f(x) - 4 = x^4 - 2x - 3$. Continuous.<br>$g(1) = 1 - 2 - 3 = -4 < 0$.<br>$g(2) = 16 - 4 - 3 = 9 > 0$.<br>Bolzano gives $x_0$ with $g(x_0) = 0$, i.e. $f(x_0) = 4$. $\\blacksquare$<br><br>Equivalently: $f(1) = 0$ and $f(2) = 13$, and $4 \\in [0, 13]$, so by the IVT directly $f$ hits $4$ somewhere in $(1, 2)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — COUNTEREXAMPLE WITHOUT CONTINUITY</div><div class="example-body"><strong>Give an example</strong> of a function $f: [-1, 1] \\to \\mathbb{R}$ with $f(-1) = -1$ and $f(1) = 1$ that never equals $0$ on $[-1, 1]$. Why does this not contradict the IVT?<br><br><em>Solution.</em> Define $f(x) = -1$ for $x \\leq 0$ and $f(x) = 1$ for $x > 0$. Then $f(-1) = -1$ and $f(1) = 1$, but $f$ never equals $0$.<br><br>No contradiction: the IVT requires $f$ to be <em>continuous</em> on $[-1, 1]$. This $f$ has a jump at $0$, so the hypothesis fails and the conclusion is not promised. $\\blacksquare$</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>IVT:</strong> continuous $f$ on $[a, b]$ hits every value between $f(a)$ and $f(b)$ at some interior point</li>
<li><strong>Bolzano:</strong> continuous + sign change $\\Rightarrow$ root in $(a, b)$</li>
<li>The IVT is an <em>existence</em> theorem, not a counting or location theorem</li>
<li><strong>Bisection algorithm:</strong> halve repeatedly, keeping the sign-change half; converges geometrically</li>
<li><strong>Fixed point in 1-D:</strong> continuous $f: [0,1] \\to [0,1]$ has $f(x_0) = x_0$ for some $x_0$</li>
<li>Counterexamples: dropping continuity breaks the conclusion (step functions can jump over $0$)</li>
<li>Every odd-degree polynomial has at least one real root (a classical IVT consequence)</li>
<li>Next lesson: the derivative as a limit, applied to real functions on continuous domains</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Ara Değer Teoremi (ADT), sürekli matematikte karşılaşacağın ilk derin teoremdir.</strong> Neredeyse apaçık bir şey söyler — "sürekli bir eğri yatay bir çizginin üstünden atlayamaz" — ama bu tek cümleden polinom denklemlerin köklerinin varlığını, yarıya bölme yönteminin işlediğini, sabit noktaların var olduğunu ve gerçek sayılar hakkında "açıkça doğru" görünen birçok ifadenin titiz gerekçelendirmesini kanıtlayabiliriz. 15. derste süreklilik kavramını kurmuştuk. Şimdi onu işe koşuyoruz.</p>

<p class="l-text">Bu dersin sonunda ADT'yi tam olarak ifade edebileceksin, hipotezleri ne zaman bozulursa teoremin de bozulduğunu görebileceksin, belirli denklemlerin belirli aralıklarda çözümlerinin olduğunu kanıtlayabileceksin, polinom üzerinde elle yarıya bölme algoritmasını çalıştırabileceksin ve kapalı bir aralığı kendisine götüren sürekli bir fonksiyonun en az bir sabit noktası olması gerektiğini argümanlayabileceksin. Bunlar AYT, KPSS ve nicel programlara giriş sınavlarında doğrudan karşına çıkan akıl yürütme adımlarıdır.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ara Değer Teoremini tam olarak ifade etmeyi ve kapalı aralık ile süreklilik hipotezlerinin rolünü tanımayı</li>
<li>ADT'yi geometrik olarak "$f(a)$ ile $f(b)$ arasındaki yatay çizgi $f$ grafiğini kesmek zorundadır" şeklinde okumayı</li>
<li>Bolzano teoremini (işaret değişimi özel durumu) sürekli fonksiyonun $[a,b]$'de kökü olduğunu kanıtlamak için uygulamayı</li>
<li>$x^3 - x - 1 = 0$ gibi polinom denklemlerin verilen aralıkta en az bir gerçek kökünün olduğunu göstermeyi</li>
<li>Yarıya bölme algoritmasını adım adım çalıştırarak kökü istenen hassasiyetle daraltmayı</li>
<li>ADT'yi kullanarak $f:[0,1]\\to[0,1]$ sürekli haritalarının sabit noktasının varlığını kanıtlamayı</li>
<li>ADT'nin söylediği (varlık) ile söylemediği (kök sayısı, konum, aralık dışındaki davranış) şeyleri ayırt etmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Ara Değer Teoremi (ADT)</h2>

<div class="calc-highlight"><strong>Sade bir ifadeyle:</strong> $f$ kapalı $[a,b]$ aralığında sürekli ise ve $c$ değeri $f(a)$ ile $f(b)$ arasında herhangi bir sayı ise, $(a,b)$'de $f(x_0) = c$ olan en az bir $x_0$ noktası vardır. Sözcüklerle: sürekli bir fonksiyon, $f(a)$'dan $f(b)$'ye giderken arada kalan her çıktı değerini mutlaka alır.</div>

<p class="l-text">Yavaş oku. Üç bileşen var ve her biri zorunlu. Hangisini kaldırırsan kaldır, sonuç bozulabilir.</p>

<div class="calc-formula"><div class="formula-label">ARA DEĞER TEOREMİ</div><div class="formula-main">$$f \\in C[a,b] \\text{ ve } c, \\; f(a) \\text{ ile } f(b) \\text{ arasındaysa, } \\exists\\, x_0 \\in (a,b): f(x_0) = c.$$</div><div class="formula-sub">$C[a,b]$, "$[a,b]$ kapalı aralığında sürekli" demektir. $\\exists$ gösterimi "vardır" olarak okunur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kapalı aralık $[a,b]$</div><div class="card-body">İki uç nokta da aralığa dahil. Fonksiyonun $a$'ya kadar ve $b$'ye kadar tanımlı ve sürekli olmasına ihtiyacımız var. $(0,1]$ gibi açık aralıkta, fonksiyon $0$'a yakın patlarsa sonuç bozulabilir.</div></div>
<div class="calc-card"><div class="card-title">$[a,b]$ üzerinde sürekli</div><div class="card-body">$a$ ile $b$ arasında hiçbir yerde sıçrama, delik veya dikey asimptot yok. 15. ders bunun tam olarak ne demek olduğunu işledi. Süreklilik müzakere edilemez — onsuz teorem çöker.</div></div>
<div class="calc-card"><div class="card-title">$c$, $f(a)$ ile $f(b)$ arasında</div><div class="card-body">Yakalamak istediğimiz değer iki uç değerin arasında olmak zorunda. $c$ bu aralığın dışındaysa, teorem $f$'in $[a,b]$'de $c$ değerini alıp almadığı hakkında bir şey söylemez.</div></div>
</div>

<p class="l-text"><strong>Günlük bir resim.</strong> Deniz seviyesinden ($f(a) = 0$ m yükseklik) 2000 m'lik bir dağın tepesine ($f(b) = 2000$ m) doğru araç sürdüğünü düşün. Bir anda altimetrenin tam olarak 1437 m gösterdiğini görürsün. Neden? Çünkü yüksekliğin zamana göre sürekli bir fonksiyondur — ışınlanamazsın. 0 ile 2000 arasındaki her değer bir anda mutlaka görünür. ADT'nin fiziksel hali budur.</p>

<div class="think-box"><div class="think-label">KISA BİR ZİHİNSEL DENEY</div><div class="think-body">Metal bir çubuğu 20&deg;C'den 80&deg;C'ye ısıt. Çubuk tam 50&deg;C'den geçer mi? Evet, ADT'nin zamana göre sıcaklığa uygulanması. Tam olarak bir kez mi geçer, yoksa birden fazla kez mi geçebilir? ADT yalnızca <em>en az bir</em> kez garanti eder. Isıtıcıyı açıp kapatırsan çubuk 50&deg;C'den birçok kez geçebilir. Teorem varlığı vaat eder, tekliği değil.</div></div>

<h2 class="lesson-title">2. Geometrik Sezgi</h2>

<div class="calc-highlight"><strong>ADT'nin görselleştirilmesi:</strong> $[a,b]$ üzerinde sürekli bir $f$ grafiği çiz. Grafik $(a, f(a))$ noktasında başlar ve $(b, f(b))$ noktasında biter. Şimdi bu iki yükseklik arasında herhangi bir yatay çizgi $y = c$ çiz. Grafik bir uç noktadan diğerine bu çizgiyi kesmeden gidemez. Kesişim noktası — onun $x$-koordinatı — teoremin vaat ettiği $x_0$'dır.</div>

<p class="l-text">Bu resim yalnızca grafik <em>bağlı</em> olduğu için çalışır. Sürekli bir fonksiyon, grafiğini kalemi kaldırmadan çizer. Kalemi kaldırabilseydik — yani fonksiyonun bir sıçrama süreksizliği olsaydı — yatay çizginin üstünden atlayabilir ve sonuç bozulurdu.</p>

<div class="calc-graph"><div id="plot-l16-ivt-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $[a,b]$ üzerinde $f(a) < f(b)$ olan sürekli bir fonksiyon. Kesikli yatay çizgi $y = c$, iki uç değerin arasında. Eğri çizgiyi en az bir kez kesmek zorunda — işaretli $x_0$ noktası ADT'nin vaat ettiği kesişim noktası.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=i/100;xs.push(x);ys.push(0.4+1.6*x-0.5*Math.sin(3*x));}
var curve={x:xs,y:ys,mode:'lines',name:'y = f(x)',line:{color:'#3b82f6',width:3}};
var cline={x:[0,2],y:[1.6,1.6],mode:'lines',name:'y = c',line:{color:'#f59e0b',width:2,dash:'dash'}};
var ptA={x:[0],y:[0.4],mode:'markers+text',name:'(a, f(a))',marker:{color:'#22c55e',size:10},text:['(a, f(a))'],textposition:'top right',textfont:{color:'#e8e8e8',size:11}};
var ptB={x:[2],y:[3.6-0.5*Math.sin(6)],mode:'markers+text',name:'(b, f(b))',marker:{color:'#22c55e',size:10},text:['(b, f(b))'],textposition:'bottom left',textfont:{color:'#e8e8e8',size:11}};
var x0=0.83;
var ptX={x:[x0],y:[1.6],mode:'markers+text',name:'(x_0, c)',marker:{color:'#ef4444',size:12,symbol:'circle-open',line:{width:2.5,color:'#ef4444'}},text:['x_0'],textposition:'top center',textfont:{color:'#ef4444',size:13}};
var drop={x:[x0,x0],y:[0,1.6],mode:'lines',name:'',line:{color:'rgba(239,68,68,0.35)',width:1,dash:'dot'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.2,2.4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.3,4.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l16-ivt-tr',[curve,cline,ptA,ptB,drop,ptX],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Sürekliliğin neden gerekli olduğu.</strong> $f(x) = -1$ (eğer $x < 0$) ve $f(x) = +1$ (eğer $x \\geq 0$) basamak fonksiyonunu düşün. $[-1, 1]$ uç noktalarında $f(-1) = -1$ ve $f(1) = 1$ olur. Yine de $f$, $[-1, 1]$ üzerinde hiçbir yerde $0$'a eşit değildir — $f(x_0) = 0$ olan bir $x_0$ yoktur. Grafik orijinde $y = 0$ çizgisinin üstünden atlar. Süreklilik tam olarak bu tür sıçramayı yasaklayan koşuldur.</p>

<div class="l-note"><strong>"Arasında" ne demek?</strong> $f(a) \\leq f(b)$ ise, "$c$, $f(a)$ ile $f(b)$ arasındadır" demek $f(a) \\leq c \\leq f(b)$ demektir. $f(a) \\geq f(b)$ ise eşitsizlikler tersine döner. Her iki durumda da ADT uygulanır. Fonksiyon artan olmak zorunda değil; teorem herhangi bir sürekli şekil için geçerlidir.</div>

<h2 class="lesson-title">3. Bolzano Teoremi: İşaret Değişimi Durumu</h2>

<div class="calc-highlight"><strong>Bolzano (1817):</strong> $f$, $[a,b]$ üzerinde sürekliyse ve $f(a) \\cdot f(b) < 0$ ise (uç değerlerin işaretleri <em>terstir</em>), $f$'nin $(a,b)$ içinde en az bir kökü vardır. Bu, ADT'nin en kullanışlı şekli: $c = 0$ al, $0$'ın negatif ve pozitif değer arasında oturduğunu gözlemle ve $f$'nin bir sıfırı olduğunu sonuçla.</div>

<p class="l-text">Bernard Bolzano bu özel durumu 1817'de ifade edip kanıtladı; ADT'nin genel haliyle paketlenmesinden onlarca yıl önce. Matematikçiler bazen işaret değişimi sürümüne "Bolzano teoremi", genel sürüme "ara değer teoremi" der; ancak birçok ders kitabında iki isim birbirinin yerine kullanılır. İki ifade eşdeğerdir — biri neredeyse aşikâr biçimde diğerini gerektirir.</p>

<div class="calc-formula"><div class="formula-label">BOLZANO TEOREMİ</div><div class="formula-main">$$f \\in C[a,b] \\text{ ve } f(a) \\cdot f(b) < 0 \\;\\Longrightarrow\\; \\exists\\, x_0 \\in (a,b): f(x_0) = 0$$</div><div class="formula-sub">Sürekli fonksiyon üzerinde işaret değişimi kökü zorunlu kılar. Geometrik olarak: grafik $x$-eksenini keser.</div></div>

<p class="l-text"><strong>Problemlerde nasıl kullanılır.</strong> "$f(a) \\cdot f(b) < 0$ mı?" sorusunu neredeyse hiç çarparak test etmezsin. Bunun yerine sadece işaretleri kontrol edersin: $f(a)$ negatif ve $f(b)$ pozitif mi, yoksa tersi mi? Evetse, işaret değişimin var, fonksiyon sürekli ve Bolzano sana kökü bedavaya verir.</p>

<div class="calc-graph"><div id="plot-l16-bolzano-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $f(a) < 0$ ve $f(b) > 0$ olan sürekli bir fonksiyon. Grafik $(a,b)$ içinde bir yerde $x$-eksenini kesmek zorunda — o kesişim noktası Bolzano'nun garanti ettiği köktür. Vurgulanan bölgeler işaret değişimine dikkat çeker.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=300;i++){var x=-1.5+3*i/300;xs.push(x);ys.push(x*x*x-x-0.3);}
var curve={x:xs,y:ys,mode:'lines',name:'y = f(x)',line:{color:'#3b82f6',width:3}};
var axis={x:[-1.6,1.6],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.4)',width:1}};
var ptA={x:[-1.5],y:[-1.5*-1.5*-1.5-(-1.5)-0.3],mode:'markers+text',name:'(a, f(a)) < 0',marker:{color:'#ef4444',size:10},text:['f(a) < 0'],textposition:'top right',textfont:{color:'#ef4444',size:12}};
var ptB={x:[1.5],y:[1.5*1.5*1.5-1.5-0.3],mode:'markers+text',name:'(b, f(b)) > 0',marker:{color:'#22c55e',size:10},text:['f(b) > 0'],textposition:'top left',textfont:{color:'#22c55e',size:12}};
var root=1.12;
var ptR={x:[root],y:[0],mode:'markers+text',name:'kök x_0',marker:{color:'#f59e0b',size:13,symbol:'star'},text:['kök'],textposition:'bottom center',textfont:{color:'#f59e0b',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.8,1.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2.5,2.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l16-bolzano-tr',[curve,axis,ptA,ptB,ptR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Göster ki</strong> $f(x) = x^5 + 2x - 1$'in en az bir gerçek kökü vardır.<br><br>$f$ bir polinom, dolayısıyla her yerde sürekli.<br>$f(0) = 0 + 0 - 1 = -1 < 0$.<br>$f(1) = 1 + 2 - 1 = 2 > 0$.<br><br>$[0, 1]$'de işaret değişimi ve $f$ sürekli, dolayısıyla Bolzano teoremine göre $(0, 1)$'de $f(x_0) = 0$ olan bir $x_0$ vardır. $x^5 + 2x - 1 = 0$ denkleminin $(0, 1)$'de gerçek bir kökü vardır. $\\blacksquare$</div></div>

<h2 class="lesson-title">4. Kök Varlığı: Uygulamalar</h2>

<div class="calc-highlight"><strong>Örüntü.</strong> Sana "$g(x) = 0$ denkleminin bir çözümü olduğunu göster" diye sorulduğunda, ADT/Bolzano stratejisi şudur: (1) her şeyi bir tarafa al, $f(x) = g(x)$; (2) $f$'nin sürekli olduğunu kontrol et; (3) $f$'in işaretlerinin ters olduğu iki $a, b$ değeri bul; (4) Bolzano'ya atıf yap. Üç satırda bir varlık kanıtın olur.</div>

<p class="l-text">Türk üniversite giriş sınavlarındaki ADT problemlerinin ve KPSS nicel bölümünün ekmek-tuzu işidir. İş, iyi $a$ ve $b$ değerleri bulmaktadır. Önce küçük tam sayıları dene (0, 1, $-1$, 2, $-2$). Hiçbiri çalışmazsa biraz daha büyük sayıları dene veya fonksiyonun yapısını kullan.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body"><strong>Göster ki</strong> $x^3 - x - 1 = 0$ denkleminin $[1, 2]$ aralığında bir kökü vardır.<br><br>$f(x) = x^3 - x - 1$ alalım. $f$ bir polinom, dolayısıyla $[1, 2]$ üzerinde sürekli.<br><br>$f(1) = 1 - 1 - 1 = -1 < 0$.<br>$f(2) = 8 - 2 - 1 = 5 > 0$.<br><br>Bolzano teoremine göre, $(1, 2)$'de $f(x_0) = 0$ olan bir $x_0$ vardır. Yani denklemin $[1, 2]$ aralığında bir kökü vardır. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body"><strong>Göster ki</strong> $\\cos x = x$ denkleminin $[0, 1]$ aralığında bir çözümü vardır.<br><br>Her şeyi bir tarafa al: $f(x) = \\cos x - x$. $f$ sürekli (iki sürekli fonksiyonun toplamı).<br><br>$f(0) = \\cos 0 - 0 = 1 - 0 = 1 > 0$.<br>$f(1) = \\cos 1 - 1 \\approx 0.5403 - 1 = -0.4597 < 0$.<br><br>İşaret değişimi. Bolzano $(0, 1)$ içinde $f$'nin bir kökünü, dolayısıyla $\\cos x = x$ denkleminin $(0, 1)$'de bir çözümünü verir. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body"><strong>Göster ki</strong> her tek dereceli polinomun en az bir gerçek kökü vardır.<br><br>$p(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_0$ olsun; $n$ tek ve $a_n > 0$ (durum $a_n < 0$ benzer şekildedir).<br><br>$x \\to +\\infty$ iken baskın terim $a_n x^n$, $+\\infty$'a gider. $x \\to -\\infty$ iken $-\\infty$'a gider ($n$ tek olduğu için). Yani $p(x)$ er ya da geç çok pozitif ve er ya da geç çok negatiftir.<br><br>$p(b) > 0$ olacak şekilde yeterince büyük bir $b$, ve $p(a) < 0$ olacak şekilde yeterince negatif bir $a$ seç. Polinomlar $[a, b]$ üzerinde süreklidir. İşaret değişimi + süreklilik, dolayısıyla Bolzano'ya göre $p$'in $(a, b)$'de bir kökü vardır. $\\blacksquare$<br><br>Bu yüzden $x^3$, $x^5$, $x^7$ ve diğer tüm tek dereceli polinomlar — ne kadar karmaşık olurlarsa olsunlar — en az bir kez $x$-eksenine değmek zorundadırlar.</div></div>

<h2 class="lesson-title">5. Yarıya Bölme Yöntemi</h2>

<div class="calc-highlight"><strong>Yarıya bölme yöntemi en basit kök bulma algoritmasıdır.</strong> Bolzano'nun varlık garantisini somut bir tarife dönüştürür: bir kökün var olduğunu bildiğimiz aralıktan başlayarak, aralığı tekrar tekrar yarıya böl ve işaret değişiminin hâlâ olduğu yarıyı sakla. Yeterince yarılamadan sonra aralık o kadar küçülür ki içindeki herhangi bir nokta köke iyi bir yaklaşımdır.</div>

<p class="l-text">İşte tarif, beş adımda. $f$, $[a, b]$ üzerinde sürekli ve $f(a) \\cdot f(b) < 0$ olsun.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — orta nokta</div><div class="card-body">Şu anki aralığın orta noktası $m = \\dfrac{a+b}{2}$'yi hesapla.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — değerlendir</div><div class="card-body">$f(m)$'yi hesapla. Tam olarak $f(m) = 0$ ise (veya yeterince yakınsa), kökü buldun. Dur.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — yarıyı seç</div><div class="card-body">Aksi takdirde $f(m)$'nin işaretine bak. Aynı işarete sahip uç noktayı $m$ ile değiştir. Artık işaret değişimi $m$ ile hayatta kalan uç nokta arasındadır.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — tekrarla</div><div class="card-body">Yeni (yarı büyüklükteki) aralıkla 1. adıma dön. $n$ adımdan sonra aralık $(b-a)/2^n$ genişliğindedir.</div></div>
<div class="calc-card"><div class="card-title">Adım 5 — dur</div><div class="card-body">Aralık hedef hassasiyetinden kısa olduğunda dur. Orta noktayı yaklaşık kök olarak raporla.</div></div>
</div>

<p class="l-text"><strong>Neden her zaman çalışır.</strong> Her adımda işaret değişimi korunur, yani Bolzano'ya göre şu anki aralıkta bir kök vardır. Aralık her adımda 2 katı küçülür, dolayısıyla geometrik olarak tek bir noktaya yakınsar — ve o nokta kök olmak zorundadır.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$f(x) = x^3 - x - 1$'e $[1, 2]$ üzerinde yarıya bölmeyi uygula. (Bölüm 4'ten zaten burada bir kökün var olduğunu biliyoruz.)<br><br><strong>Adım 0:</strong> $[a, b] = [1, 2]$, $f(1) = -1$, $f(2) = 5$. Genişlik $= 1$.<br><strong>Adım 1:</strong> $m = 1.5$, $f(1.5) = 3.375 - 1.5 - 1 = 0.875 > 0$. $b$'yi $m$ ile değiştir. Yeni aralık $[1, 1.5]$. Genişlik $= 0.5$.<br><strong>Adım 2:</strong> $m = 1.25$, $f(1.25) = 1.953 - 1.25 - 1 = -0.297 < 0$. $a$'yı $m$ ile değiştir. Yeni aralık $[1.25, 1.5]$. Genişlik $= 0.25$.<br><strong>Adım 3:</strong> $m = 1.375$, $f(1.375) = 2.600 - 1.375 - 1 = 0.225 > 0$. $b$'yi $m$ ile değiştir. Yeni aralık $[1.25, 1.375]$. Genişlik $= 0.125$.<br><strong>Adım 4:</strong> $m = 1.3125$, $f(1.3125) \\approx -0.052 < 0$. $a$'yı değiştir. Yeni aralık $[1.3125, 1.375]$. Genişlik $\\approx 0.063$.<br><strong>Adım 5:</strong> $m = 1.34375$, $f(m) \\approx 0.083 > 0$. $b$'yi değiştir. Yeni aralık $[1.3125, 1.34375]$. Genişlik $\\approx 0.031$.<br><br>Beş adım sonra kök yaklaşık $0.031$ uzunluğunda bir aralığa hapsedilmiş. Orta nokta $\\approx 1.328$, iki ondalık basamağa kadar doğru. Gerçek değer $1.3247...$.</div></div>

<div class="calc-graph"><div id="plot-l16-bisect-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $[1, 2]$ üzerinde $f(x) = x^3 - x - 1$ grafiği ve $x$-ekseninin altında ilk dört yarıya bölme aralığı yatay çubuklar olarak gösterilmiş. Her çubuk öncekinin yarısı uzunluğundadır. Küçülen çubuklar yıldızla işaretli köke yakınsar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=0.9+1.2*i/200;xs.push(x);ys.push(x*x*x-x-1);}
var curve={x:xs,y:ys,mode:'lines',name:'f(x) = x^3 - x - 1',line:{color:'#3b82f6',width:3}};
var axis={x:[0.9,2.1],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var bars=[
{x:[1,2],y:[-1.6,-1.6],lab:'[1, 2]',col:'#f59e0b'},
{x:[1,1.5],y:[-1.85,-1.85],lab:'[1, 1.5]',col:'#fbbf24'},
{x:[1.25,1.5],y:[-2.1,-2.1],lab:'[1.25, 1.5]',col:'#a3e635'},
{x:[1.25,1.375],y:[-2.35,-2.35],lab:'[1.25, 1.375]',col:'#22c55e'}
];
var traces=[curve,axis];
for(var i=0;i<bars.length;i++){
  traces.push({x:bars[i].x,y:bars[i].y,mode:'lines+text',name:bars[i].lab,line:{color:bars[i].col,width:4},text:['','adım '+(i+1)],textposition:'top right',textfont:{color:bars[i].col,size:11},showlegend:false});
}
var root=1.3247;
traces.push({x:[root],y:[0],mode:'markers+text',name:'kök',marker:{color:'#ef4444',size:13,symbol:'star'},text:['kök ≈ 1.3247'],textposition:'top center',textfont:{color:'#ef4444',size:12}});
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0.9,2.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-3,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l16-bisect-tr',traces,lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>$n$ adım sonra hassasiyet.</strong> Başlangıç aralığının genişliği $w_0 = b - a$ ise, $n$ yarıya bölmeden sonra aralık genişliği $w_0 / 2^n$ olur. $\\varepsilon$ hassasiyetine ulaşmak için $n \\geq \\log_2(w_0 / \\varepsilon)$ adıma ihtiyacın var. Bir birim aralığı $10^{-6}$'ya kadar yarıya bölmek yaklaşık 20 yarılama alır — Newton yöntemine kıyasla yavaş, ama tamamen güvenilir.</div>

<h2 class="lesson-title">6. Sabit Noktalar: İlk Bakış</h2>

<div class="calc-highlight"><strong>Bir fonksiyonun sabit noktası</strong>, $f(x) = x$ olan bir $x$ sayısıdır — fonksiyon o noktayı yerinde bırakır. ADT, kapalı bir aralığı kendisine götüren <em>her</em> sürekli fonksiyonun bir sabit noktasının olduğunu güzel bir tek satırlık kanıtla verir. Bu, ünlü Brouwer sabit nokta teoreminin en basit halidir.</div>

<p class="l-text"><strong>Teorem.</strong> $f: [0, 1] \\to [0, 1]$ sürekli olsun. O zaman $[0, 1]$'de $f(x_0) = x_0$ olan bir $x_0$ vardır.</p>

<div class="calc-formula"><div class="formula-label">SABİT NOKTA VARLIĞI (1B)</div><div class="formula-main">$$f \\in C\\big([0,1]\\big) \\text{ ve } f([0,1]) \\subseteq [0,1] \\;\\Longrightarrow\\; \\exists\\, x_0 \\in [0,1]: f(x_0) = x_0$$</div></div>

<p class="l-text"><strong>Kanıt, tek paragrafta.</strong> $g(x) = f(x) - x$ tanımla. Sonra $g$ süreklidir (sürekli fonksiyonların farkı). Uç noktalara bak.</p>

<p class="l-text">$x = 0$'da: $g(0) = f(0) - 0 = f(0) \\geq 0$ (çünkü $f(0)$, $[0, 1]$'de yaşar, yani en az 0'dır).<br>$x = 1$'de: $g(1) = f(1) - 1 \\leq 0$ (çünkü $f(1)$, $[0, 1]$'de yaşar, yani en çok 1'dir).</p>

<p class="l-text">Ya $g(0) = 0$ (o zaman $0$ sabit noktadır), ya $g(1) = 0$ (o zaman $1$ sabit noktadır), ya da $g(0) > 0$ ve $g(1) < 0$ — işaret değişimi, dolayısıyla Bolzano'ya göre $g(x_0) = 0$ olan bir $x_0$ vardır, yani $f(x_0) = x_0$. $\\blacksquare$</p>

<div class="calc-graph"><div id="plot-l16-fixed-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = x$ köşegen çizgisi ve sürekli bir $f: [0,1] \\to [0,1]$ haritasının grafiği. $f$, $x = 0$'da köşegenin üstünde veya üzerinde başladığı ve $x = 1$'de köşegenin altında veya üzerinde bittiği için iki grafik kesişmek zorundadır. Kesişim noktası sabit noktadır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];var diag=[];for(var i=0;i<=200;i++){var x=i/200;xs.push(x);ys.push(0.2+0.55*x+0.18*Math.sin(4*x));diag.push(x);}
var curve={x:xs,y:ys,mode:'lines',name:'y = f(x)',line:{color:'#3b82f6',width:3}};
var line={x:xs,y:diag,mode:'lines',name:'y = x',line:{color:'#f59e0b',width:2,dash:'dash'}};
var fp_x=0.466;
var fp={x:[fp_x],y:[fp_x],mode:'markers+text',name:'sabit nokta',marker:{color:'#ef4444',size:13,symbol:'star'},text:['x_0 = f(x_0)'],textposition:'top left',textfont:{color:'#ef4444',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.05,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-0.05,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l16-fixed-tr',[curve,line,fp],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">FİZİKSEL BENZETME</div><div class="think-body">Bir masaya Türkiye'nin iki özdeş haritasını yerleştir — biri altta, biri buruşturulup üstüne atılmış. Brouwer teoremi, buruşmuş haritada <em>bir</em> noktanın düz haritadaki eşleşen noktanın tam üzerinde olduğunu söyler. Yukarıdaki 1 boyutlu sürüm bebek versiyonudur. Brouwer'in 1910'da kanıtladığı tam teorem her boyutta geçerlidir ve ekonomide (Nash dengeleri), topolojide ve oyun teorisinde kanıtların temelidir.</div></div>

<h2 class="lesson-title">7. AYT/KPSS Tarzı Problemler</h2>

<div class="calc-highlight"><strong>Türk sınavlarındaki ADT problemleri</strong> neredeyse her zaman üç şablondan birini izler: işaret değişimini kanıtla, belirli aralıkta bir kök bul veya fonksiyonun belirli bir değeri aldığını argümanla. Strateji bir kez tanındığında mekaniktir.</div>

<div class="calc-example"><div class="example-label">PROBLEM 1 — AYT TARZI</div><div class="example-body">$f(x) = x^3 + 3x - 5$ fonksiyonu için aşağıdakilerden hangisi söylenebilir?<br><br>(A) $f$'nin $(-2, -1)$ aralığında kökü vardır.<br>(B) $f$'nin $(0, 2)$ aralığında kökü vardır.<br>(C) $f$'nin $(2, 3)$ aralığında kökü vardır.<br>(D) $f$'nin gerçek kökü yoktur.<br>(E) $f$'nin tüm kökleri pozitiftir.<br><br><strong>Çözüm.</strong> Uç değerleri hesapla:<br>$f(0) = 0 + 0 - 5 = -5$.<br>$f(2) = 8 + 6 - 5 = 9$.<br><br>$(0, 2)$ üzerinde işaret değişimi var. Bolzano uygulanır (polinom sürekli), yani $f$'nin $(0, 2)$ aralığında kökü vardır. <strong>Cevap: (B).</strong></div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — HEDEF DEĞERLE ADT</div><div class="example-body"><strong>Göster ki</strong> $(0, \\pi/2)$ aralığında $\\sin x_0 + x_0 = 1$ olan bir $x_0$ vardır.<br><br>$f(x) = \\sin x + x - 1$ alalım. Bu süreklidir.<br>$f(0) = 0 + 0 - 1 = -1 < 0$.<br>$f(\\pi/2) = 1 + \\pi/2 - 1 = \\pi/2 \\approx 1.571 > 0$.<br><br>İşaret değişimi, yani Bolzano'ya göre $(0, \\pi/2)$ aralığında $f(x_0) = 0$, yani $\\sin x_0 + x_0 = 1$ olan bir $x_0$ vardır. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — İKİ FONKSİYONUN KESİŞİMİ</div><div class="example-body"><strong>Göster ki</strong> $y = e^x$ ve $y = 3 - x$ grafikleri $(0, 1)$ aralığında kesişir.<br><br>Grafikler $e^x = 3 - x$ olduğunda kesişir, yani $h(x) = e^x - 3 + x = 0$ olduğunda. $h$ süreklidir.<br>$h(0) = 1 - 3 + 0 = -2 < 0$.<br>$h(1) = e - 3 + 1 = e - 2 \\approx 0.718 > 0$.<br><br>İşaret değişimi, yani Bolzano $(0, 1)$ aralığında $h(x_0) = 0$ olan bir $x_0$ verir, yani $e^{x_0} = 3 - x_0$. Grafikler $(x_0, e^{x_0})$ noktasında buluşur. $\\blacksquare$</div></div>

<h2 class="lesson-title">8. ADT'nin Söylemediği Şeyler</h2>

<div class="calc-highlight"><strong>ADT bir varlık teoremidir.</strong> İstenen özelliğe sahip <em>en az bir</em> noktanın varlığını vaat eder. Bu noktaların kaç tane olduğu, tam olarak nerede oturdukları veya onları nasıl hesaplayacağın hakkında hiçbir şey söylemez. Sonucun yanlış okunması sınav cevaplarındaki en yaygın hatadır.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ADT'NİN GARANTİ ETTİĞİ</div><div class="compare-item">En az bir $x_0$ noktası $(a, b)$ içinde $f(x_0) = c$ olur</div><div class="compare-item">Sonuç tamamen <em>varlık</em> hakkındadır</div><div class="compare-item">Süreklilikle birleştirilince yarıya bölme algoritmasını verir</div></div><div class="compare-col"><div class="compare-title">GARANTİ ETMEDİĞİ</div><div class="compare-item">Teklik: yalnızca bir değil, birçok kök olabilir</div><div class="compare-item">Konum: teorem $(a, b)$ içinde <em>nerede</em> olduğunu söylemez</div><div class="compare-item">$[a, b]$ dışındaki davranış: sıfır bilgi</div></div></div>

<p class="l-text"><strong>Birden fazla kök örneği.</strong> $f(x) = \\sin(\\pi x)$'i $[0, 3]$ üzerinde al. $f(0) = 0$ ve $f(3) = 0$. ADT bu durumda hiçbir şey söylemez (her iki uç değer de 0), ama fonksiyonun $x = 0, 1, 2, 3$'te kökleri vardır — dört tane. Tersine, $f(x) = \\sin(\\pi x)$'i $[0.5, 1.5]$ üzerinde aldığında $f(0.5) = 1$ ve $f(1.5) = -1$, dolayısıyla Bolzano en az bir kök garanti eder ve gerçekten tek olan $x_0 = 1$'dir.</p>

<div class="l-note"><strong>ADT'nin tersi yanlıştır.</strong> Bir fonksiyon sürekli olmadan $f(a)$ ile $f(b)$ arasındaki her değeri alabilir. Darboux teoremi, türevlerin sürekli olmasalar bile ara değer özelliğine sahip olduğunu gösterir — yani "ara değer özelliği", "sürekli"den daha zayıftır. Bu dersin geri kalanında ADT'yi yalnızca ileri yönde kullanacağız: süreklilik ADT'yi gerektirir, asla tersi değil.</div>

<h2 class="lesson-title">9. Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — TEMEL KÖK VARLIĞI</div><div class="example-body"><strong>Göster ki</strong> $f(x) = x^3 + x - 3$'ün $[1, 2]$ aralığında bir kökü vardır.<br><br><em>Çözüm.</em> $f$ bir polinom, dolayısıyla süreklidir.<br>$f(1) = 1 + 1 - 3 = -1 < 0$.<br>$f(2) = 8 + 2 - 3 = 7 > 0$.<br>Bolzano uygulanır: $(1, 2)$ aralığında bir kök vardır. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — TRANSANDANTAL DENKLEM</div><div class="example-body"><strong>Göster ki</strong> $e^x = 2x + 1$ denkleminin $(1, 2)$ aralığında bir çözümü vardır.<br><br><em>Çözüm.</em> $f(x) = e^x - 2x - 1$ alalım. Süreklidir.<br>$f(1) = e - 2 - 1 \\approx 2.718 - 3 = -0.282 < 0$.<br>$f(2) = e^2 - 4 - 1 \\approx 7.389 - 5 = 2.389 > 0$.<br>Bolzano: $(1, 2)$'de kök. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — 2 ONDALIK İÇİN YARIYA BÖLME</div><div class="example-body">$\\sqrt{3}$'ü 2 ondalık basamağa kadar bulmak için $f(x) = x^2 - 3$'e $[1, 2]$ üzerinde yarıya bölmeyi uygula.<br><br><em>Çözüm.</em> $f(1) = -2$, $f(2) = 1$.<br>$m = 1.5$, $f(1.5) = -0.75 < 0$ &rarr; $[1.5, 2]$.<br>$m = 1.75$, $f(1.75) = 0.0625 > 0$ &rarr; $[1.5, 1.75]$.<br>$m = 1.625$, $f(1.625) = -0.359 < 0$ &rarr; $[1.625, 1.75]$.<br>$m = 1.6875$, $f(1.6875) = -0.152 < 0$ &rarr; $[1.6875, 1.75]$.<br>$m = 1.71875$, $f(1.71875) = -0.0459 < 0$ &rarr; $[1.71875, 1.75]$.<br>$m = 1.734375$, $f \\approx 0.008 > 0$ &rarr; $[1.71875, 1.734375]$.<br>Genişlik $\\approx 0.016 < 0.01 \\times 2$. Orta nokta $\\approx 1.73$. Gerçek değer $\\sqrt{3} = 1.732...$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — SABİT NOKTA UYGULAMASI</div><div class="example-body"><strong>Göster ki</strong> $\\cos x = x$ denkleminin $[0, 1]$ aralığında tek bir çözümü vardır ve onu yarıya bölmeyle 1 ondalık basamağa kadar bul.<br><br><em>Varlık.</em> $g(x) = \\cos x - x$, sürekli. $g(0) = 1$, $g(1) = \\cos 1 - 1 \\approx -0.46$. Bolzano bir kök verir.<br><br><em>Yarıya bölme.</em> $m = 0.5$, $g(0.5) \\approx 0.378 > 0$ &rarr; $[0.5, 1]$.<br>$m = 0.75$, $g(0.75) \\approx -0.018 < 0$ &rarr; $[0.5, 0.75]$.<br>$m = 0.625$, $g(0.625) \\approx 0.186 > 0$ &rarr; $[0.625, 0.75]$.<br>$m = 0.6875$, $g(0.6875) \\approx 0.085 > 0$ &rarr; $[0.6875, 0.75]$.<br>$m = 0.71875$, $g \\approx 0.034 > 0$ &rarr; $[0.71875, 0.75]$.<br>Sonuç: kök $[0.72, 0.75]$'te, yani bir ondalık basamağa kadar $x_0 \\approx 0.7$. (Gerçek değer $0.7390...$.) $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — ARA DEĞER (KÖK DEĞİL)</div><div class="example-body"><strong>Göster ki</strong> $f(x) = x^4 - 2x + 1$, $[1, 2]$ aralığında bir yerde $4$ değerini alır.<br><br><em>Çözüm.</em> $g(x) = f(x) - 4 = x^4 - 2x - 3$ tanımla. Süreklidir.<br>$g(1) = 1 - 2 - 3 = -4 < 0$.<br>$g(2) = 16 - 4 - 3 = 9 > 0$.<br>Bolzano, $g(x_0) = 0$ olan, yani $f(x_0) = 4$ olan bir $x_0$ verir. $\\blacksquare$<br><br>Eşdeğer olarak: $f(1) = 0$ ve $f(2) = 13$, $4 \\in [0, 13]$, dolayısıyla doğrudan ADT'ye göre $f$, $(1, 2)$ içinde bir yerde $4$'e ulaşır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — SÜREKLİLİK OLMADAN KARŞIÖRNEK</div><div class="example-body"><strong>Örnek ver</strong>: $f: [-1, 1] \\to \\mathbb{R}$, $f(-1) = -1$ ve $f(1) = 1$ olan ama $[-1, 1]$ üzerinde hiçbir yerde $0$'a eşit olmayan bir fonksiyon. Bu neden ADT ile çelişmez?<br><br><em>Çözüm.</em> $x \\leq 0$ için $f(x) = -1$, $x > 0$ için $f(x) = 1$ tanımla. O zaman $f(-1) = -1$ ve $f(1) = 1$, ama $f$ asla $0$'a eşit olmaz.<br><br>Çelişki yok: ADT, $f$'nin $[-1, 1]$ üzerinde <em>sürekli</em> olmasını gerektirir. Bu $f$'nin $0$'da bir sıçraması vardır, dolayısıyla hipotez bozulur ve sonuç vaat edilmez. $\\blacksquare$</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>ADT:</strong> $[a, b]$ üzerinde sürekli $f$, $f(a)$ ile $f(b)$ arasındaki her değeri bir iç noktada alır</li>
<li><strong>Bolzano:</strong> süreklilik + işaret değişimi $\\Rightarrow$ $(a, b)$'de kök</li>
<li>ADT bir <em>varlık</em> teoremidir; sayma veya konum teoremi değildir</li>
<li><strong>Yarıya bölme algoritması:</strong> tekrar tekrar yarıya böl, işaret değişimi olan yarıyı sakla; geometrik yakınsama</li>
<li><strong>1B sabit nokta:</strong> sürekli $f: [0,1] \\to [0,1]$ haritası için $f(x_0) = x_0$ olan bir $x_0$ vardır</li>
<li>Karşıörnekler: sürekliliği düşürmek sonucu bozar (basamak fonksiyonları $0$'ın üstünden atlayabilir)</li>
<li>Her tek dereceli polinomun en az bir gerçek kökü vardır (klasik ADT sonucu)</li>
<li>Sonraki ders: limit olarak türev, sürekli tanım kümeli gerçek fonksiyonlara uygulanmış</li>
</ul>
</div>`

};
