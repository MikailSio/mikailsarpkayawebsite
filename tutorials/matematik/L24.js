window.LISE_MAT_L24 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The first derivative tells us where a curve is going up and where it is going down.</strong> But that is only half the picture. A road that climbs steadily can climb in two very different ways: it can <em>bend upward</em> like the inside of a bowl, or it can <em>bend downward</em> like the top of a hill. Two cars on those two roads have the same direction of motion, yet they feel very different — one is accelerating, the other is easing off. The mathematical name for that "bending" is <strong>concavity</strong>, and the tool that measures it is the <strong>second derivative</strong>.</p>

<p class="l-text">This lesson teaches you to read the shape of a curve from the sign of $f''(x)$, to find the special points where the curve switches its bending direction (<em>inflection points</em>), and to use the second derivative as a short and powerful test for local maxima and minima. You already learned the First Derivative Test in lesson 23; the Second Derivative Test is its quick partner. By the end of this lesson you will be able to sketch a full qualitative graph of a polynomial from $f$, $f'$, and $f''$ alone — exactly the kind of question that appears every year on the YKS-AYT.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish convex (concave-up) and concave (concave-down) curves by their geometric shape</li>
<li>Use the sign of the second derivative $f''(x)$ to decide concavity on any open interval</li>
<li>Define an inflection point as a point where the sign of $f''$ changes</li>
<li>Find candidate inflection points by solving $f''(x) = 0$ (or where $f''$ is undefined) and confirm with a sign test</li>
<li>Apply the Second Derivative Test to classify a critical number $c$ as a local maximum, local minimum, or inconclusive</li>
<li>Choose between the First and Second Derivative Tests according to the problem at hand</li>
</ul>
</div>

<h2 class="l-title">1. Convex (Concave-Up) and Concave (Concave-Down) Intuition</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine pouring water onto a piece of curved metal. If the metal looks like the inside of a bowl, water collects on top. We call that shape <strong>concave-up</strong> (or <em>convex</em>). If the metal looks like the top of a hill, water spills off. We call that shape <strong>concave-down</strong>. The first job of the second derivative is to tell us, for any function, which of these two situations we are in.</div>

<p class="l-text">Forget formulas for a moment and look at two simple curves: $y = x^2$ and $y = -x^2$. The parabola $y = x^2$ opens upward — its graph is a U-shape, holding water. The parabola $y = -x^2$ opens downward — its graph is an inverted U, dropping water. Both curves have a turning point at the origin, but the way they bend is different. The first one is concave-up everywhere; the second one is concave-down everywhere.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Concave-up (convex)</div><div class="card-body">The curve opens upward like the inside of a bowl. The graph lies <em>above</em> each of its tangent lines. As you walk left-to-right, the slope is steadily <strong>increasing</strong>.</div></div>
<div class="calc-card"><div class="card-title">Concave-down</div><div class="card-body">The curve opens downward like the top of a hill. The graph lies <em>below</em> each of its tangent lines. As you walk left-to-right, the slope is steadily <strong>decreasing</strong>.</div></div>
<div class="calc-card"><div class="card-title">The decisive idea</div><div class="card-body">Concavity is not about whether $f$ is going up or down — it is about whether $f'$ is going up or down. That is precisely what $f''$ measures.</div></div>
</div>

<p class="l-text"><strong>Why the word "convex"?</strong> A region in the plane is <em>convex</em> if the straight line joining any two points of the region stays inside the region. The set $\\{(x, y) : y \\geq x^2\\}$ — the region above $y = x^2$ — is convex, which is why $y = x^2$ is called a convex function. Some books say "concave-up" instead of "convex" and "concave-down" instead of "concave." The two vocabularies mean exactly the same thing.</p>

<div class="calc-graph"><div id="plot-l24-shapes-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> on the left, $y = x^2$ — concave-up everywhere, holds water. On the right, $y = -x^2$ — concave-down everywhere, sheds water. Notice how the tangent line (dashed) at $x = 1$ in each case lies <em>below</em> the convex curve and <em>above</em> the concave curve.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y1=[];var y2=[];for(var i=-30;i<=30;i++){var x=i/10;xs.push(x);y1.push(x*x);y2.push(-x*x);}
var c1={x:xs,y:y1,mode:'lines',name:'y = x² (convex)',line:{color:'#3b82f6',width:3}};
var c2={x:xs,y:y2,mode:'lines',name:'y = -x² (concave)',line:{color:'#ef4444',width:3},xaxis:'x2',yaxis:'y2'};
var tx=[-1.5,3];var ty1=[2*1*(-1.5)-1,2*1*3-1];
var t1={x:tx,y:ty1,mode:'lines',name:'tangent at x=1',line:{color:'#c8a96e',width:2,dash:'dash'}};
var tx2=[-3,1.5];var ty2=[-2*1*(-3)-(-1),-2*1*1.5-(-1)];
var t2={x:tx2,y:ty2,mode:'lines',name:'tangent at x=1',line:{color:'#c8a96e',width:2,dash:'dash'},xaxis:'x2',yaxis:'y2',showlegend:false};
var m1={x:[1],y:[1],mode:'markers',marker:{color:'#fbbf24',size:10},showlegend:false};
var m2={x:[1],y:[-1],mode:'markers',marker:{color:'#fbbf24',size:10},xaxis:'x2',yaxis:'y2',showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{domain:[0,0.46],title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-9.5,9.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},xaxis2:{domain:[0.54,1],title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis2:{title:'y',range:[-9.5,9.5],anchor:'x2',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},showlegend:false};
Plotly.newPlot('plot-l24-shapes-en',[c1,c2,t1,t2,m1,m2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Sketch $y = e^x$ in your head. Is its slope getting bigger as $x$ grows? Yes — the function rises faster and faster. So $e^x$ is concave-up on all of $\\mathbb{R}$. Now sketch $y = \\ln x$ for $x > 0$. The slope at $x = 1$ is $1$, at $x = 10$ is $0.1$, at $x = 100$ is $0.01$ — getting smaller. So $\\ln x$ is concave-down on $(0, \\infty)$. You can read concavity off many familiar functions just by recalling whether their slopes grow or shrink.</div></div>

<h2 class="l-title">2. The Sign of $f''$ and Concavity</h2>

<div class="calc-highlight"><strong>The rule in one line:</strong> $f''(x) > 0$ on an interval $\\Rightarrow$ $f$ is concave-up there. $f''(x) < 0$ on an interval $\\Rightarrow$ $f$ is concave-down there. That is the entire test.</div>

<p class="l-text">Why does this work? Remember that $f''$ is the derivative of $f'$. If $f''(x) > 0$ on some open interval, then $f'$ is <em>increasing</em> on that interval (by the First Derivative Test applied to $f'$ instead of $f$). An increasing slope means the curve is bending its tangent counter-clockwise — i.e. opening upward, i.e. concave-up. The same reasoning with the sign flipped gives the other direction.</p>

<div class="calc-formula"><div class="formula-label">CONCAVITY TEST</div><div class="formula-main">$$f''(x) > 0 \\text{ on } (a, b) \\;\\Longrightarrow\\; f \\text{ is concave-up on } (a, b)$$<br>$$f''(x) < 0 \\text{ on } (a, b) \\;\\Longrightarrow\\; f \\text{ is concave-down on } (a, b)$$</div><div class="formula-sub">The test requires $f''$ to keep one sign throughout the open interval. The sign at a single point is not enough.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$f''(x) &gt; 0$</div><div class="compare-item">Slope $f'$ is increasing</div><div class="compare-item">Curve bends upward (concave-up / convex)</div><div class="compare-item">Graph lies above its tangent lines</div><div class="compare-item">Example: $f(x) = x^2$ has $f''(x) = 2 &gt; 0$ everywhere</div></div><div class="compare-col"><div class="compare-title">$f''(x) &lt; 0$</div><div class="compare-item">Slope $f'$ is decreasing</div><div class="compare-item">Curve bends downward (concave-down)</div><div class="compare-item">Graph lies below its tangent lines</div><div class="compare-item">Example: $f(x) = -x^2$ has $f''(x) = -2 &lt; 0$ everywhere</div></div></div>

<div class="calc-example"><div class="example-label">QUICK CHECK</div><div class="example-body">Where is $f(x) = x^3$ concave-up?<br><br>$f'(x) = 3x^2$, $f''(x) = 6x$.<br>$f''(x) > 0 \\iff 6x > 0 \\iff x > 0$.<br>So $f(x) = x^3$ is concave-up on $(0, \\infty)$ and concave-down on $(-\\infty, 0)$. The bending direction <strong>switches</strong> at $x = 0$ — we will name this kind of point in the next section.</div></div>

<div class="l-note"><strong>Important subtlety:</strong> $f''(x) > 0$ at a single point $x = c$ does <em>not</em> by itself guarantee concavity in a neighbourhood unless $f''$ is continuous (which it usually is for the polynomial, rational, trig, exp and log functions you meet in school). Always check the <em>sign on an open interval</em>, not just at one number.</div>

<h2 class="l-title">3. Inflection Points: Definition</h2>

<div class="calc-highlight"><strong>An inflection point is a point on the graph where the curve switches its concavity:</strong> from concave-up to concave-down, or from concave-down to concave-up. It is the geometric counterpart of a turning point — but instead of the direction of motion changing, the direction of <em>bending</em> changes.</div>

<p class="l-text">Picture a road. You are driving along, leaning right (the road curves right). At some instant the road straightens out and immediately starts curving left, so you have to lean the other way. The exact instant when right-curving becomes left-curving is the inflection point of the road. For a graph $y = f(x)$, exactly the same thing happens, with "right-curve" and "left-curve" replaced by concave-up and concave-down.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION — INFLECTION POINT</div><div class="formula-main">$$\\text{The point } \\big(c,\\, f(c)\\big) \\text{ is an } \\textbf{inflection point} \\text{ of } f$$<br>$$\\iff f \\text{ is continuous at } c \\text{ and } f''(x) \\text{ changes sign at } x = c.$$</div><div class="formula-sub">Note the two ingredients: continuity of $f$ at $c$, and a genuine sign change of $f''$ across $c$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sign change required</div><div class="card-body">If $f''$ is positive on both sides of $c$, or negative on both sides, there is no inflection — the curve keeps the same concavity throughout.</div></div>
<div class="calc-card"><div class="card-title">$f''(c) = 0$ is just a candidate</div><div class="card-body">Not every solution of $f''(x) = 0$ is an inflection point. You must test the sign of $f''$ on each side.</div></div>
<div class="calc-card"><div class="card-title">$f''$ may be undefined</div><div class="card-body">A sign change can also occur where $f''$ fails to exist (think of $f(x) = x^{1/3}$ at $x = 0$). These points are also candidates.</div></div>
</div>

<p class="l-text"><strong>Geometric picture.</strong> Walk along the graph from left to right. Just before the inflection point, the curve lies on one side of its tangent line. Just after the inflection point, the curve crosses to the other side. The tangent line itself <em>cuts through</em> the curve at the inflection point — a visual signature that often appears in textbook sketches.</p>

<div class="calc-example"><div class="example-label">CLASSIC COUNTEREXAMPLE</div><div class="example-body">For $f(x) = x^4$: $f'(x) = 4x^3$, $f''(x) = 12x^2$. We get $f''(0) = 0$. <strong>Is $x = 0$ an inflection point?</strong><br><br>$f''(x) = 12x^2 \\geq 0$ for every $x$. The sign of $f''$ does not change at $x = 0$ — it is positive on both sides. So $(0, 0)$ is <strong>not</strong> an inflection point. The curve $y = x^4$ stays concave-up throughout. This is why "$f''(c) = 0$" alone is never a proof; you must always confirm a sign change.</div></div>

<h2 class="l-title">4. Finding Inflection Points: Candidates and Sign Test</h2>

<div class="calc-highlight"><strong>The recipe is the mirror image of the one we used for critical points in lesson 23.</strong> Just as we solved $f'(x) = 0$ to find candidates for extrema, we solve $f''(x) = 0$ (and check where $f''$ is undefined) to find candidates for inflection. Then we test the sign of $f''$ on each side of every candidate.</div>

<div class="calc-formula"><div class="formula-label">RECIPE — INFLECTION POINTS</div><div class="formula-main">$$\\text{1. Compute } f''(x).$$<br>$$\\text{2. Solve } f''(x) = 0 \\text{ and list values where } f'' \\text{ is undefined.}$$<br>$$\\text{3. Build a sign chart for } f''.$$<br>$$\\text{4. The candidates where the sign of } f'' \\text{ actually changes are inflection points.}$$</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — INFLECTION OF $f(x) = x^3 - 3x$</div><div class="example-body">$f'(x) = 3x^2 - 3$, $f''(x) = 6x$.<br><br><strong>Candidates:</strong> $f''(x) = 0 \\iff 6x = 0 \\iff x = 0$.<br><br><strong>Sign chart for $f'' = 6x$:</strong><br>For $x < 0$: $f''(x) = 6x < 0$ → concave-down.<br>For $x > 0$: $f''(x) = 6x > 0$ → concave-up.<br><br>Sign of $f''$ changes from $-$ to $+$ at $x = 0$. So $(0, f(0)) = (0, 0)$ is an <strong>inflection point</strong>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TWO INFLECTION POINTS</div><div class="example-body">Find inflection points of $f(x) = x^4 - 6x^2$.<br><br>$f'(x) = 4x^3 - 12x$.<br>$f''(x) = 12x^2 - 12 = 12(x^2 - 1) = 12(x-1)(x+1)$.<br><br>Candidates: $f''(x) = 0 \\iff x = \\pm 1$.<br><br>Sign chart for $f''$:<br>$x < -1$: $f''(x) = +$ (concave-up)<br>$-1 < x < 1$: $f''(x) = -$ (concave-down)<br>$x > 1$: $f''(x) = +$ (concave-up)<br><br>Sign of $f''$ changes at both $x = -1$ and $x = 1$, so both are inflection points.<br>$f(-1) = 1 - 6 = -5$, $f(1) = 1 - 6 = -5$.<br>Inflection points: $\\mathbf{(-1, -5)}$ and $\\mathbf{(1, -5)}$.</div></div>

<div class="calc-graph"><div id="plot-l24-inflection-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the cubic $f(x) = x^3 - 3x$. The portion to the left of the inflection point $(0, 0)$ (drawn in red) is concave-down; the portion to the right (drawn in blue) is concave-up. The tangent line at the inflection point (dashed gold) cuts through the curve — it lies above the curve on the left and below it on the right.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=-25;i<=0;i++){var x=i/10;xL.push(x);yL.push(x*x*x-3*x);}
var xR=[];var yR=[];for(var i=0;i<=25;i++){var x=i/10;xR.push(x);yR.push(x*x*x-3*x);}
var leftSeg={x:xL,y:yL,mode:'lines',name:'concave-down (f″<0)',line:{color:'#ef4444',width:3}};
var rightSeg={x:xR,y:yR,mode:'lines',name:'concave-up (f″>0)',line:{color:'#3b82f6',width:3}};
var tan={x:[-2.5,2.5],y:[-3*(-2.5),-3*2.5],mode:'lines',name:'tangent at (0,0)',line:{color:'#c8a96e',width:2,dash:'dash'}};
var infl={x:[0],y:[0],mode:'markers+text',name:'inflection (0,0)',marker:{color:'#fbbf24',size:14},text:['  inflection'],textposition:'top right',textfont:{color:'#fbbf24',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x) = x³ - 3x',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l24-inflection-en',[leftSeg,rightSeg,tan,infl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KEY OBSERVATION</div><div class="think-body">An inflection point need not be a critical point of $f$. In the example above, $f'(0) = -3 \\neq 0$, so $(0, 0)$ is not a critical point — yet it is an inflection point. The two concepts are independent: critical points come from $f'$, inflection points come from $f''$.</div></div>

<h2 class="l-title">5. The Second Derivative Test</h2>

<div class="calc-highlight"><strong>The Second Derivative Test is a fast shortcut for classifying critical points.</strong> Given a number $c$ with $f'(c) = 0$, you compute $f''(c)$ and read off the answer immediately — no sign chart, no neighbouring values, just one number.</div>

<div class="calc-formula"><div class="formula-label">SECOND DERIVATIVE TEST</div><div class="formula-main">$$\\text{Suppose } f'(c) = 0 \\text{ and } f''(c) \\text{ exists.}$$<br>$$f''(c) > 0 \\;\\Longrightarrow\\; c \\text{ is a local } \\textbf{minimum}$$<br>$$f''(c) < 0 \\;\\Longrightarrow\\; c \\text{ is a local } \\textbf{maximum}$$<br>$$f''(c) = 0 \\;\\Longrightarrow\\; \\textbf{test fails (inconclusive)}$$</div><div class="formula-sub">The first two cases agree perfectly with the intuition: at a minimum the bowl opens upward (concave-up, $f''>0$); at a maximum the hill opens downward (concave-down, $f''<0$).</div></div>

<p class="l-text"><strong>Why does it work?</strong> Suppose $f'(c) = 0$ and $f''(c) > 0$. The condition $f''(c) > 0$ means the slope $f'$ is increasing at $c$. Since $f'(c) = 0$ exactly, the slope must be negative just before $c$ and positive just after $c$ — that is the First Derivative Test pattern for a local minimum. The argument for $f''(c) < 0$ is symmetric.</p>

<p class="l-text"><strong>The inconclusive case.</strong> When $f''(c) = 0$ the test gives no information. Look at three examples, all with $f'(0) = 0$ and $f''(0) = 0$:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$f(x) = x^4$</div><div class="card-body">$f'(0) = 0$, $f''(0) = 0$. Yet $(0, 0)$ is a local <strong>minimum</strong> (the curve sits above the origin everywhere else).</div></div>
<div class="calc-card"><div class="card-title">$f(x) = -x^4$</div><div class="card-body">$f'(0) = 0$, $f''(0) = 0$. Now $(0, 0)$ is a local <strong>maximum</strong>.</div></div>
<div class="calc-card"><div class="card-title">$f(x) = x^3$</div><div class="card-body">$f'(0) = 0$, $f''(0) = 0$. Here $(0, 0)$ is neither max nor min — it is a horizontal inflection.</div></div>
</div>

<p class="l-text">All three functions look identical from the second derivative test alone — $f''(0) = 0$ in every case — yet they have completely different behaviour. When the test fails, fall back to the First Derivative Test (sign chart of $f'$) or examine higher derivatives.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — APPLYING THE TEST</div><div class="example-body">Classify the critical numbers of $f(x) = x^3 - 12x + 5$.<br><br>$f'(x) = 3x^2 - 12 = 3(x-2)(x+2)$ → critical numbers $x = -2$ and $x = 2$.<br>$f''(x) = 6x$.<br><br>At $x = -2$: $f''(-2) = -12 < 0$ → <strong>local maximum</strong>. Value: $f(-2) = -8 + 24 + 5 = 21$.<br>At $x = 2$: $f''(2) = 12 > 0$ → <strong>local minimum</strong>. Value: $f(2) = 8 - 24 + 5 = -11$.<br><br>Done — no sign chart required.</div></div>

<h2 class="l-title">6. Worked Example 1: Full Analysis of $f(x) = x^3 - 6x^2 + 9x$</h2>

<p class="l-text">Let us combine everything into a single complete study. We will find intervals of monotonicity, concavity, local extrema, and inflection points for $f(x) = x^3 - 6x^2 + 9x$.</p>

<p class="l-text"><strong>Step 1 — Derivatives.</strong></p>
<p class="l-text">$f'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x-1)(x-3)$.</p>
<p class="l-text">$f''(x) = 6x - 12 = 6(x - 2)$.</p>

<p class="l-text"><strong>Step 2 — Critical numbers.</strong></p>
<p class="l-text">$f'(x) = 0 \\iff x = 1$ or $x = 3$.</p>

<p class="l-text"><strong>Step 3 — Second derivative test.</strong></p>
<p class="l-text">$f''(1) = 6(1-2) = -6 < 0$ → <strong>local max</strong> at $x = 1$. Value: $f(1) = 1 - 6 + 9 = 4$.</p>
<p class="l-text">$f''(3) = 6(3-2) = 6 > 0$ → <strong>local min</strong> at $x = 3$. Value: $f(3) = 27 - 54 + 27 = 0$.</p>

<p class="l-text"><strong>Step 4 — Concavity.</strong></p>
<p class="l-text">$f''(x) = 6(x-2)$. Sign of $f''$: negative for $x < 2$, positive for $x > 2$.</p>
<p class="l-text">Concave-down on $(-\\infty, 2)$, concave-up on $(2, \\infty)$. <strong>Inflection point</strong> at $x = 2$: $f(2) = 8 - 24 + 18 = 2$, so the point is $(2, 2)$.</p>

<p class="l-text"><strong>Step 5 — Monotonicity.</strong></p>
<p class="l-text">Sign chart for $f' = 3(x-1)(x-3)$: positive on $(-\\infty, 1)$, negative on $(1, 3)$, positive on $(3, \\infty)$.</p>
<p class="l-text">$f$ is increasing on $(-\\infty, 1)$, decreasing on $(1, 3)$, increasing on $(3, \\infty)$.</p>

<div class="calc-example"><div class="example-label">SUMMARY TABLE</div><div class="example-body"><strong>Local max</strong> at $(1, 4)$.<br><strong>Local min</strong> at $(3, 0)$.<br><strong>Inflection</strong> at $(2, 2)$.<br><strong>Increasing</strong> on $(-\\infty, 1) \\cup (3, \\infty)$.<br><strong>Decreasing</strong> on $(1, 3)$.<br><strong>Concave-down</strong> on $(-\\infty, 2)$.<br><strong>Concave-up</strong> on $(2, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l24-fppf-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $f$, $f'$, and $f''$ on the same axes for $f(x) = x^3 - 6x^2 + 9x$. Notice three alignments: (i) wherever $f'$ crosses zero (red dots), $f$ has a horizontal tangent. (ii) wherever $f''$ crosses zero (gold dot), $f$ has an inflection. (iii) wherever $f''$ is negative the original $f$ curves like a hill; where positive, like a bowl.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f=[];var fp=[];var fpp=[];for(var i=-5;i<=55;i++){var x=i/10;xs.push(x);f.push(x*x*x-6*x*x+9*x);fp.push(3*x*x-12*x+9);fpp.push(6*x-12);}
var c1={x:xs,y:f,mode:'lines',name:'f(x) = x³-6x²+9x',line:{color:'#3b82f6',width:3}};
var c2={x:xs,y:fp,mode:'lines',name:"f'(x) = 3(x-1)(x-3)",line:{color:'#ef4444',width:2.5,dash:'dot'}};
var c3={x:xs,y:fpp,mode:'lines',name:'f″(x) = 6(x-2)',line:{color:'#fbbf24',width:2.5,dash:'dashdot'}};
var critX=[1,3];var critY=[4,0];
var critF={x:critX,y:critY,mode:'markers+text',name:'extrema of f',marker:{color:'#3b82f6',size:12},text:['  max (1,4)','  min (3,0)'],textposition:'top right',textfont:{color:'#3b82f6',size:11},showlegend:false};
var inflF={x:[2],y:[2],mode:'markers+text',name:'inflection',marker:{color:'#fbbf24',size:12,symbol:'diamond'},text:['  infl (2,2)'],textposition:'top right',textfont:{color:'#fbbf24',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-0.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'value',range:[-15,15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l24-fppf-en',[c1,c2,c3,critF,inflF],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">7. Worked Example 2: When the Test Fails — $f(x) = x^4 - 4x^3$</h2>

<p class="l-text">Now a more delicate case where the Second Derivative Test runs into trouble at one of the critical numbers.</p>

<p class="l-text">$f(x) = x^4 - 4x^3$.</p>
<p class="l-text">$f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$.</p>
<p class="l-text">$f''(x) = 12x^2 - 24x = 12x(x - 2)$.</p>

<p class="l-text"><strong>Critical numbers.</strong> $f'(x) = 0 \\iff 4x^2(x-3) = 0 \\iff x = 0$ or $x = 3$.</p>

<p class="l-text"><strong>Apply the Second Derivative Test.</strong></p>
<p class="l-text">$f''(3) = 12 \\cdot 3 \\cdot 1 = 36 > 0$ → <strong>local minimum</strong> at $x = 3$. Value: $f(3) = 81 - 108 = -27$.</p>
<p class="l-text">$f''(0) = 0$ → <strong>test fails</strong>. We must use the First Derivative Test instead.</p>

<p class="l-text"><strong>First Derivative Test at $x = 0$.</strong> Sign of $f'(x) = 4x^2(x-3)$.</p>
<p class="l-text">Just to the left of $0$ (say $x = -0.5$): $f'(-0.5) = 4(0.25)(-3.5) = -3.5 < 0$.</p>
<p class="l-text">Just to the right of $0$ (say $x = 0.5$): $f'(0.5) = 4(0.25)(-2.5) = -2.5 < 0$.</p>
<p class="l-text">$f'$ does not change sign at $x = 0$ — both sides are negative. So $x = 0$ is <strong>neither a max nor a min</strong>. The function passes through with a horizontal tangent but keeps decreasing on both sides.</p>

<p class="l-text"><strong>Inflection points.</strong> $f''(x) = 12x(x-2) = 0 \\iff x = 0$ or $x = 2$. Sign chart for $f''$:</p>
<p class="l-text">$x < 0$: $f'' = +$ (concave-up). $0 < x < 2$: $f'' = -$ (concave-down). $x > 2$: $f'' = +$ (concave-up).</p>
<p class="l-text">$f''$ changes sign at both $x = 0$ and $x = 2$ → inflection at $(0, 0)$ and at $(2, f(2)) = (2, 16 - 32) = (2, -16)$.</p>

<div class="calc-example"><div class="example-label">LESSON FROM THIS EXAMPLE</div><div class="example-body">When the Second Derivative Test fails ($f''(c) = 0$), do <strong>not</strong> conclude anything about $c$. Reach for the First Derivative Test, examine $f'$ on each side, and let the sign change (or its absence) give the verdict.</div></div>

<h2 class="l-title">8. Inflection Points of $f(x) = \\sin x$</h2>

<p class="l-text">The trig functions provide an endless supply of inflection points. Take $f(x) = \\sin x$.</p>
<p class="l-text">$f'(x) = \\cos x$, $f''(x) = -\\sin x$.</p>
<p class="l-text">$f''(x) = 0 \\iff \\sin x = 0 \\iff x = k\\pi$ for every integer $k$.</p>

<p class="l-text"><strong>Sign check.</strong> $f''(x) = -\\sin x$ is positive on $(\\pi, 2\\pi)$ (because $\\sin x < 0$ there) and negative on $(0, \\pi)$ (because $\\sin x > 0$ there). So the sign of $f''$ alternates each time $x$ crosses a multiple of $\\pi$. Hence <strong>every</strong> point $x = k\\pi$ is an inflection point. The corresponding $y$-coordinates are $\\sin(k\\pi) = 0$, so the inflection points are $(k\\pi, 0)$ for every integer $k$.</p>

<p class="l-text">Geometrically: the sine wave bends downward on each "hill" $(2k\\pi, (2k+1)\\pi)$ and bends upward on each "valley" $((2k+1)\\pi, (2k+2)\\pi)$. The transitions are exactly the $x$-axis crossings.</p>

<div class="calc-graph"><div id="plot-l24-sine-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = \\sin x$ over $[-2\\pi, 2\\pi]$. The blue stretches are concave-up ($f'' > 0$), the red stretches are concave-down ($f'' < 0$), and the gold dots mark inflection points at every multiple of $\\pi$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var segs=[];var pi=Math.PI;
function piece(a,b,col){var xs=[];var ys=[];for(var i=0;i<=120;i++){var t=a+(b-a)*i/120;xs.push(t);ys.push(Math.sin(t));}return {x:xs,y:ys,mode:'lines',line:{color:col,width:3},showlegend:false};}
segs.push(piece(-2*pi,-pi,'#3b82f6'));
segs.push(piece(-pi,0,'#ef4444'));
segs.push(piece(0,pi,'#ef4444'));
segs.push(piece(pi,2*pi,'#3b82f6'));
var infl={x:[-2*pi,-pi,0,pi,2*pi],y:[0,0,0,0,0],mode:'markers',name:'inflection',marker:{color:'#fbbf24',size:11},showlegend:true};
var blueLeg={x:[null],y:[null],mode:'lines',name:'concave-up (f″>0)',line:{color:'#3b82f6',width:3}};
var redLeg={x:[null],y:[null],mode:'lines',name:'concave-down (f″<0)',line:{color:'#ef4444',width:3}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-2*pi-0.3,2*pi+0.3],tickvals:[-2*pi,-pi,0,pi,2*pi],ticktext:['-2π','-π','0','π','2π'],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'sin x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
var data=segs.concat([infl,blueLeg,redLeg]);
Plotly.newPlot('plot-l24-sine-en',data,lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">QUICK PRACTICE</div><div class="think-body">Where are the inflection points of $f(x) = \\cos x$? Compute: $f''(x) = -\\cos x$, so $f''(x) = 0 \\iff x = \\pi/2 + k\\pi$. Sign alternates at each — every $x = \\pi/2 + k\\pi$ is an inflection point of cosine.</div></div>

<h2 class="l-title">9. First Derivative Test vs Second Derivative Test</h2>

<p class="l-text">You now have two ways to classify critical points. Both are valid, both give the same answer when both apply, but each is convenient in different circumstances.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">FIRST DERIVATIVE TEST</div><div class="compare-item">Examine the sign of $f'$ on each side of the critical number</div><div class="compare-item">Always works — never inconclusive</div><div class="compare-item">Requires building a small sign chart for $f'$</div><div class="compare-item">Useful when $f''$ is messy or unknown</div><div class="compare-item">Handles cases where $f$ is not twice-differentiable</div></div><div class="compare-col"><div class="compare-title">SECOND DERIVATIVE TEST</div><div class="compare-item">Compute the single number $f''(c)$ and read the sign</div><div class="compare-item">Faster — no sign chart needed</div><div class="compare-item">Fails (inconclusive) when $f''(c) = 0$</div><div class="compare-item">Useful when $f''$ is easy to evaluate</div><div class="compare-item">Standard in optimisation and physics problems</div></div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use the Second Derivative Test when…</div><div class="card-body">$f''$ is simple (e.g. a polynomial of low degree), you have many critical numbers and want a fast verdict, or the problem already supplies $f''$.</div></div>
<div class="calc-card"><div class="card-title">Use the First Derivative Test when…</div><div class="card-body">$f''(c)$ turns out to be $0$, $f''$ is hard to compute, or you also need the intervals of monotonicity for your sketch.</div></div>
<div class="calc-card"><div class="card-title">In doubt, do both.</div><div class="card-body">They never disagree when both apply. The sign chart of $f'$ is the safety net behind the second derivative shortcut.</div></div>
</div>

<div class="calc-example"><div class="example-label">SAME PROBLEM, BOTH METHODS</div><div class="example-body">Classify the critical point of $f(x) = x^2 - 4x + 7$.<br><br>$f'(x) = 2x - 4 = 0 \\iff x = 2$.<br><br><strong>Second Derivative Test:</strong> $f''(x) = 2 > 0$ → local min at $x = 2$.<br><strong>First Derivative Test:</strong> $f'(1) = -2 < 0$, $f'(3) = 2 > 0$. Sign of $f'$ changes from $-$ to $+$ → local min at $x = 2$.<br><br>Both methods agree. $f(2) = 4 - 8 + 7 = 3$. Local min at $(2, 3)$.</div></div>

<h2 class="l-title">10. Classical Exercises</h2>

<p class="l-text">Work each problem with pencil and paper. Solutions follow each statement so that you can self-check after attempting.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>Problem.</strong> Determine intervals of concavity and find inflection points of $f(x) = x^3 - 9x^2 + 24x - 7$.<br><br><strong>Solution.</strong> $f''(x) = 6x - 18 = 6(x-3)$. Sign change at $x = 3$: concave-down on $(-\\infty, 3)$, concave-up on $(3, \\infty)$. Inflection at $x = 3$, $f(3) = 27 - 81 + 72 - 7 = 11$. Point: $(3, 11)$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Problem.</strong> Apply the Second Derivative Test to classify the critical points of $f(x) = 2x^3 - 3x^2 - 12x + 5$.<br><br><strong>Solution.</strong> $f'(x) = 6x^2 - 6x - 12 = 6(x^2 - x - 2) = 6(x-2)(x+1)$. Critical numbers: $x = -1, 2$. $f''(x) = 12x - 6$. At $x = -1$: $f''(-1) = -18 < 0$ → local max, $f(-1) = -2 - 3 + 12 + 5 = 12$. At $x = 2$: $f''(2) = 18 > 0$ → local min, $f(2) = 16 - 12 - 24 + 5 = -15$. Local max $(-1, 12)$, local min $(2, -15)$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>Problem.</strong> The function $f(x) = x^4 - 8x^2 + 3$. Find all extrema and inflection points.<br><br><strong>Solution.</strong> $f'(x) = 4x^3 - 16x = 4x(x^2 - 4) = 4x(x-2)(x+2)$. Critical numbers: $-2, 0, 2$. $f''(x) = 12x^2 - 16$. At $x = -2$: $f''(-2) = 48 - 16 = 32 > 0$ → local min, $f(-2) = 16 - 32 + 3 = -13$. At $x = 0$: $f''(0) = -16 < 0$ → local max, $f(0) = 3$. At $x = 2$: $f''(2) = 32 > 0$ → local min, $f(2) = -13$. Inflection: $f''(x) = 0 \\iff x^2 = 4/3 \\iff x = \\pm 2/\\sqrt{3}$. Sign change at each. Inflection points at $x = \\pm 2/\\sqrt{3}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4</div><div class="example-body"><strong>Problem.</strong> Show that $f(x) = x^5$ has $f''(0) = 0$ but $x = 0$ is not a local extremum.<br><br><strong>Solution.</strong> $f'(x) = 5x^4 \\geq 0$ everywhere, $f'(0) = 0$. $f''(x) = 20x^3$, $f''(0) = 0$. Test fails. Sign of $f'$: $f'(-0.1) = 5 \\cdot 0.0001 > 0$, $f'(0.1) > 0$. No sign change → $x = 0$ is a horizontal tangent but not an extremum. Sign of $f''$: $f''(-0.1) < 0$, $f''(0.1) > 0$ → $x = 0$ <strong>is</strong> an inflection point of $f$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5</div><div class="example-body"><strong>Problem.</strong> Find the inflection points of $f(x) = x \\, e^{-x}$ for $x \\in \\mathbb{R}$.<br><br><strong>Solution.</strong> $f'(x) = e^{-x} - x e^{-x} = e^{-x}(1-x)$. $f''(x) = -e^{-x}(1-x) + e^{-x}(-1) = e^{-x}(x-2)$. $f''(x) = 0 \\iff x = 2$ (since $e^{-x} > 0$ always). Sign of $f''$: $x < 2$ → negative, $x > 2$ → positive. Sign changes at $x = 2$ → inflection at $(2, 2e^{-2})$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6</div><div class="example-body"><strong>Problem.</strong> A cubic $f(x) = ax^3 + bx^2 + cx + d$ has a local max at $x = -1$ and a local min at $x = 3$. Show that its inflection point lies exactly at $x = 1$.<br><br><strong>Solution.</strong> $f'(x) = 3ax^2 + 2bx + c$. Its two roots are the critical numbers $-1$ and $3$. By Vieta's formulas, the sum of the roots is $-1 + 3 = 2 = -\\frac{2b}{3a}$, so $b = -3a$. The inflection point of a cubic occurs where $f''(x) = 6ax + 2b = 0$, i.e. at $x = -b/(3a) = -(-3a)/(3a) = 1$. The inflection point sits at the midpoint of the two critical numbers — a beautiful property of every cubic.</div></div>

<h2 class="l-title">11. Putting It All Together — A Full Curve-Sketching Recipe</h2>

<p class="l-text">Lessons 23 and 24 give you every ingredient you need to draw a polynomial or rational graph from scratch, without plugging in dozens of points. The art is doing the steps <em>in the right order</em>: each step narrows what the next step has to consider. The recipe below collects six steps that, when performed in sequence, produce a publication-quality sketch from $f$, $f'$, and $f''$ alone.</p>

<div class="calc-table-wrap" style="margin:1.4rem 0;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden">
<thead><tr style="background:rgba(59,130,246,0.12);color:#3b82f6">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(59,130,246,0.3)">Step</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(59,130,246,0.3)">What to find</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(59,130,246,0.3)">How / which tool</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.92)">
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">1. Domain</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Set of $x$ where $f(x)$ is defined</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Exclude division by zero, $\\sqrt{\\text{neg}}$, $\\ln$ of non-positive</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">2. Intercepts</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$x$-intercepts $f(x)=0$; $y$-intercept $f(0)$</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Solve / substitute directly</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">3. Asymptotes</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Vertical, horizontal, oblique lines the curve approaches</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$\\lim_{x\\to a^\\pm}=\\pm\\infty$ (vert.); $\\lim_{x\\to\\pm\\infty}f$ (horiz.); polynomial division (obl.)</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">4. Critical points</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Local max / min from $f'(x)=0$ + First Derivative Test</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Sign of $f'$ on each side: $-{\\to}+$ min, $+{\\to}-$ max</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">5. Inflection</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Concavity changes from $f''(x)=0$ + Second Derivative Test</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$f''>0$ concave-up, $f''<0$ concave-down; sign flip $\\Rightarrow$ inflection</td></tr>
<tr><td style="padding:0.6rem 0.9rem;font-weight:600;color:#3b82f6">6. Sketch</td><td style="padding:0.6rem 0.9rem">Combine everything into a single curve</td><td style="padding:0.6rem 0.9rem">Plot intercepts, extrema, inflection, asymptotes; connect with correct concavity</td></tr>
</tbody>
</table>
</div>

<p class="l-text"><strong>Worked example.</strong> Apply the recipe to $f(x) = \\frac{x^3}{3} - x$.</p>
<p class="l-text"><strong>1. Domain.</strong> Polynomial $\\Rightarrow$ all of $\\mathbb{R}$. <strong>2. Intercepts.</strong> $f(0) = 0$; $f(x) = 0 \\iff x(x^2 - 3)/3 = 0 \\iff x = 0,\\, \\pm\\sqrt{3}$. <strong>3. Asymptotes.</strong> None — a polynomial grows without bound (no vertical, horizontal, or oblique lines are approached). <strong>4. Critical points.</strong> $f'(x) = x^2 - 1 = 0 \\iff x = \\pm 1$. $f''(\\pm 1) = \\pm 2$: local max at $(-1, 2/3)$, local min at $(1, -2/3)$. <strong>5. Inflection.</strong> $f''(x) = 2x = 0 \\iff x = 0$; sign of $f''$ flips $- \\to +$, so $(0, 0)$ is an inflection point. <strong>6. Sketch.</strong> Concave-down on $(-\\infty, 0)$, concave-up on $(0, \\infty)$; passes through $(-\\sqrt{3},0), (0,0), (\\sqrt{3},0)$; peak at $(-1, 2/3)$, valley at $(1, -2/3)$.</p>

<div class="calc-graph"><div id="plot-l24-en-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the complete curve $f(x) = x^3/3 - x$ rendered from the six-step recipe. The local max $(-1, 2/3)$ and local min $(1, -2/3)$ (gold) come from step 4; the inflection point $(0, 0)$ (red) comes from step 5; the three $x$-intercepts $-\\sqrt{3}, 0, \\sqrt{3}$ (cyan) come from step 2. The curve is concave-down (red segment) to the left of $x = 0$ and concave-up (blue segment) to the right. A polynomial has no asymptotes — the dashed grey lines mark the absence: $y$ grows without bound as $|x| \\to \\infty$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(x){return x*x*x/3 - x;}
var xL=[];var yL=[];var xR=[];var yR=[];
for(var i=-180;i<=0;i++){var x=i/40;xL.push(x);yL.push(f(x));}
for(var j=0;j<=180;j++){var xj=j/40;xR.push(xj);yR.push(f(xj));}
var left={x:xL,y:yL,mode:'lines',name:'concave-down (f″<0)',line:{color:'#ef4444',width:3}};
var right={x:xR,y:yR,mode:'lines',name:'concave-up (f″>0)',line:{color:'#3b82f6',width:3}};
var crit={x:[-1,1],y:[f(-1),f(1)],mode:'markers+text',name:'critical pts',marker:{color:'#fbbf24',size:13,line:{color:'#0a0a0a',width:2}},text:['max (-1, 2/3)','min (1, -2/3)'],textposition:'top center',textfont:{color:'#fbbf24',size:11},showlegend:true};
var infl={x:[0],y:[0],mode:'markers+text',name:'inflection',marker:{color:'#ef4444',size:13,symbol:'diamond',line:{color:'#0a0a0a',width:2}},text:['inflection (0, 0)'],textposition:'bottom right',textfont:{color:'#ef4444',size:11},showlegend:true};
var sq3=Math.sqrt(3);
var ints={x:[-sq3,0,sq3],y:[0,0,0],mode:'markers',name:'x-intercepts',marker:{color:'#22d3ee',size:11,symbol:'circle-open',line:{width:3}},showlegend:true};
var noAsymp={x:[-3.2,3.2],y:[0,0],mode:'lines',name:'no asymptote (polynomial)',line:{color:'rgba(200,169,110,0.35)',width:1,dash:'dot'},showlegend:true};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',tickvals:[-sq3,-1,0,1,sq3],ticktext:['-√3','-1','0','1','√3']},yaxis:{title:'f(x) = x³/3 − x',range:[-3.2,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:40,r:30,b:55,l:65},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5,bgcolor:'rgba(0,0,0,0)',font:{size:10}}};
Plotly.newPlot('plot-l24-en-extra',[noAsymp,left,right,crit,infl,ints],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why this order matters.</strong> Domain is first because it constrains everything else — you cannot have an extremum or an intercept outside the domain. Intercepts and asymptotes go next because they anchor the curve in the plane. Critical points and inflection then add the local shape information. Only at the very end do you draw the curve, with every key point and every concavity interval already known. A sketch produced this way is never "wrong by a bump" — every feature has a reason.</div>

<div class="l-note"><strong>Closing thought:</strong> the second derivative completes the picture started by the first. Together $f'$ and $f''$ control the entire qualitative shape of a graph — where it rises and falls, where it bends one way or the other, where its extrema live and where the bending switches direction. With these two tools you can sketch any polynomial, predict the behaviour of optimisation problems, and read calculus textbook curves the way a musician reads a score.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Birinci türev, bir eğrinin nerede arttığını ve nerede azaldığını söyler.</strong> Fakat bu hikayenin yarısıdır. Düzenli olarak yükselen bir yol, iki farklı şekilde tırmanabilir: bir kasenin içi gibi <em>yukarı doğru bükülebilir</em>, ya da bir tepenin üstü gibi <em>aşağı doğru bükülebilir</em>. Bu iki yoldaki iki araç aynı yönde hareket eder ama hisleri çok farklıdır — biri hızlanıyor, diğeri yavaşlıyordur. Bu "bükülme" olgusunun matematikteki adı <strong>konkavlık (bükülme)</strong>, onu ölçen araç ise <strong>ikinci türev</strong>dir.</p>

<p class="l-text">Bu derste, $f''(x)$ işaretinden eğrinin şeklini okumayı, eğrinin bükülme yönünü değiştirdiği özel noktaları (<em>bükülme noktaları / inflection points</em>) bulmayı ve ikinci türevi yerel maksimum/minimum için kısa ve güçlü bir test olarak kullanmayı öğreneceğiz. 23. derste Birinci Türev Testi'ni öğrendin; İkinci Türev Testi onun hızlı ortağıdır. Dersin sonunda yalnızca $f$, $f'$ ve $f''$ verisiyle bir polinomun tam nitel grafiğini çizebileceksin — YKS-AYT'de her yıl çıkan tipte sorular için biçilmiş kaftan.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Konveks (yukarı bükümlü) ve konkav (aşağı bükümlü) eğrileri geometrik şekillerinden ayırt etmek</li>
<li>İkinci türev $f''(x)$ işareti ile her açık aralıkta bükülme yönünü belirlemek</li>
<li>Bükülme noktasını $f''$ işaretinin değiştiği nokta olarak tanımlamak</li>
<li>$f''(x) = 0$ (veya $f''$ tanımsız) çözerek bükülme adaylarını listelemek ve işaret testi ile doğrulamak</li>
<li>İkinci Türev Testi'ni uygulayarak bir kritik nokta $c$'yi yerel max, yerel min veya kararsız olarak sınıflamak</li>
<li>Problem türüne göre Birinci ile İkinci Türev Testi arasında doğru seçimi yapmak</li>
</ul>
</div>

<h2 class="l-title">1. Konveks (Yukarı Bükümlü) ve Konkav (Aşağı Bükümlü) Sezgisi</h2>

<div class="calc-highlight"><strong>Gündelik resim:</strong> bükülmüş bir metal parçasının üstüne su dök. Metal bir kasenin içi gibi görünüyorsa su üstte birikir. Bu şekle <strong>konkav-yukarı</strong> (ya da <em>konveks</em>) denir. Metal bir tepenin üstü gibi görünüyorsa su yanlara akar. Bu şekle <strong>konkav-aşağı</strong> denir. İkinci türevin ilk işi, herhangi bir fonksiyon için bu iki durumdan hangisinde olduğumuzu söylemektir.</div>

<p class="l-text">Formülleri bir an için unut ve iki basit eğriye bak: $y = x^2$ ve $y = -x^2$. $y = x^2$ parabolü yukarı açılır — grafiği U şeklindedir, su tutar. $y = -x^2$ parabolü aşağı açılır — grafiği ters U'dur, suyu döker. Her iki eğrinin de orijinde bir dönüş noktası vardır ama bükülme biçimleri farklıdır. Birincisi her yerde konkav-yukarı, ikincisi her yerde konkav-aşağıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Konkav-yukarı (konveks)</div><div class="card-body">Eğri bir kasenin içi gibi yukarı açılır. Grafik, her teğet doğrusunun <em>üstünde</em> kalır. Soldan sağa yürürken eğim sürekli <strong>artar</strong>.</div></div>
<div class="calc-card"><div class="card-title">Konkav-aşağı</div><div class="card-body">Eğri bir tepenin üstü gibi aşağı açılır. Grafik, her teğet doğrusunun <em>altında</em> kalır. Soldan sağa yürürken eğim sürekli <strong>azalır</strong>.</div></div>
<div class="calc-card"><div class="card-title">Belirleyici fikir</div><div class="card-body">Konkavlık, $f$'nin artıp azalmasıyla ilgili değildir — $f'$'nün artıp azalmasıyla ilgilidir. $f''$ tam da bunu ölçer.</div></div>
</div>

<p class="l-text"><strong>"Konveks" kelimesi neden?</strong> Düzlemdeki bir bölge, iki noktasını birleştiren doğru parçası bölgenin içinde kalıyorsa <em>konveks</em>tir. $\\{(x, y) : y \\geq x^2\\}$ kümesi — $y = x^2$'nin üstündeki bölge — konvekstir; bu yüzden $y = x^2$ konveks fonksiyon olarak adlandırılır. Bazı kitaplar "konveks" yerine "konkav-yukarı", "konkav" yerine "konkav-aşağı" der. İki adlandırma aynı şeyi söyler.</p>

<div class="calc-graph"><div id="plot-l24-shapes-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> solda $y = x^2$ — her yerde konkav-yukarı, su tutar. Sağda $y = -x^2$ — her yerde konkav-aşağı, suyu döker. Her iki durumda $x = 1$ noktasındaki teğetin (kesik çizgi) konveks eğrinin <em>altında</em>, konkav eğrinin <em>üstünde</em> kaldığına dikkat et.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y1=[];var y2=[];for(var i=-30;i<=30;i++){var x=i/10;xs.push(x);y1.push(x*x);y2.push(-x*x);}
var c1={x:xs,y:y1,mode:'lines',name:'y = x² (konveks)',line:{color:'#3b82f6',width:3}};
var c2={x:xs,y:y2,mode:'lines',name:'y = -x² (konkav)',line:{color:'#ef4444',width:3},xaxis:'x2',yaxis:'y2'};
var tx=[-1.5,3];var ty1=[2*1*(-1.5)-1,2*1*3-1];
var t1={x:tx,y:ty1,mode:'lines',name:'teğet x=1',line:{color:'#c8a96e',width:2,dash:'dash'}};
var tx2=[-3,1.5];var ty2=[-2*1*(-3)-(-1),-2*1*1.5-(-1)];
var t2={x:tx2,y:ty2,mode:'lines',name:'teğet x=1',line:{color:'#c8a96e',width:2,dash:'dash'},xaxis:'x2',yaxis:'y2',showlegend:false};
var m1={x:[1],y:[1],mode:'markers',marker:{color:'#fbbf24',size:10},showlegend:false};
var m2={x:[1],y:[-1],mode:'markers',marker:{color:'#fbbf24',size:10},xaxis:'x2',yaxis:'y2',showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{domain:[0,0.46],title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-9.5,9.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},xaxis2:{domain:[0.54,1],title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis2:{title:'y',range:[-9.5,9.5],anchor:'x2',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},showlegend:false};
Plotly.newPlot('plot-l24-shapes-tr',[c1,c2,t1,t2,m1,m2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL</div><div class="think-body">Aklında $y = e^x$ çiz. $x$ büyüdükçe eğim de büyüyor mu? Evet — fonksiyon daha hızlı yükselir. O hâlde $e^x$, $\\mathbb{R}$'nin tamamında konkav-yukarıdır. Şimdi $x > 0$ için $y = \\ln x$ çiz. $x=1$'de eğim $1$, $x=10$'da $0.1$, $x=100$'de $0.01$ — küçülüyor. Demek ki $\\ln x$, $(0, \\infty)$ üzerinde konkav-aşağıdır. Pek çok tanıdık fonksiyonun konkavlığını sadece eğiminin büyüyüp büyümediğini hatırlayarak söyleyebilirsin.</div></div>

<h2 class="l-title">2. $f''$ İşareti ve Konkavlık</h2>

<div class="calc-highlight"><strong>Kural tek satır:</strong> bir aralıkta $f''(x) > 0$ ise $f$ orada konkav-yukarıdır. $f''(x) < 0$ ise konkav-aşağıdır. Testin tamamı budur.</div>

<p class="l-text">Neden işliyor? $f''$, $f'$'nün türevidir. Bir açık aralıkta $f''(x) > 0$ ise $f'$ o aralıkta <em>artar</em> (Birinci Türev Testi'ni $f$ yerine $f'$'ye uygulayınca). Artan eğim, eğrinin teğetini saat yönünün tersine büktüğünü gösterir — yani yukarı açılır, yani konkav-yukarı. İşareti ters çevirince diğer yön de gelir.</p>

<div class="calc-formula"><div class="formula-label">KONKAVLIK TESTİ</div><div class="formula-main">$$f''(x) > 0 \\text{ aralık } (a, b) \\text{ üzerinde} \\;\\Longrightarrow\\; f \\text{ orada konkav-yukarıdır}$$<br>$$f''(x) < 0 \\text{ aralık } (a, b) \\text{ üzerinde} \\;\\Longrightarrow\\; f \\text{ orada konkav-aşağıdır}$$</div><div class="formula-sub">Test, $f''$'nün açık aralık boyunca tek bir işareti korumasını gerektirir. Tek bir noktadaki işaret yeterli değildir.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$f''(x) &gt; 0$</div><div class="compare-item">Eğim $f'$ artıyor</div><div class="compare-item">Eğri yukarı bükülüyor (konkav-yukarı / konveks)</div><div class="compare-item">Grafik teğet doğrularının üstünde</div><div class="compare-item">Örnek: $f(x) = x^2$ için $f''(x) = 2 &gt; 0$ her yerde</div></div><div class="compare-col"><div class="compare-title">$f''(x) &lt; 0$</div><div class="compare-item">Eğim $f'$ azalıyor</div><div class="compare-item">Eğri aşağı bükülüyor (konkav-aşağı)</div><div class="compare-item">Grafik teğet doğrularının altında</div><div class="compare-item">Örnek: $f(x) = -x^2$ için $f''(x) = -2 &lt; 0$ her yerde</div></div></div>

<div class="calc-example"><div class="example-label">HIZLI KONTROL</div><div class="example-body">$f(x) = x^3$ nerede konkav-yukarıdır?<br><br>$f'(x) = 3x^2$, $f''(x) = 6x$.<br>$f''(x) > 0 \\iff 6x > 0 \\iff x > 0$.<br>O hâlde $f(x) = x^3$, $(0, \\infty)$ üzerinde konkav-yukarı, $(-\\infty, 0)$ üzerinde konkav-aşağıdır. Bükülme yönü $x = 0$'da <strong>değişir</strong> — sonraki bölümde bu tür noktaya isim vereceğiz.</div></div>

<div class="l-note"><strong>Önemli ince nokta:</strong> bir tek noktada $f''(c) > 0$ olması, $f''$ sürekli değilse komşulukta konkavlığı tek başına garanti etmez (okul müfredatındaki polinom, rasyonel, trig, üstel ve log fonksiyonları için $f''$ genelde süreklidir). Her zaman tek bir sayıdaki işareti değil, <em>açık aralıktaki işareti</em> kontrol et.</div>

<h2 class="l-title">3. Bükülme Noktası (Inflection Point) Tanımı</h2>

<div class="calc-highlight"><strong>Bükülme noktası, eğrinin konkavlığını değiştirdiği nokta:</strong> konkav-yukarıdan konkav-aşağıya ya da tersi yönde geçişin yaşandığı yer. Hareketin yön değiştirdiği dönüş noktasının geometrik karşılığıdır — sadece bu kez değişen <em>bükülme</em> yönüdür.</div>

<p class="l-text">Bir yol düşün. Araç kullanıyorsun, sağa yatıyorsun (yol sağa dönüyor). Bir an geliyor, yol düzleşip hemen sola dönmeye başlıyor; sen de ters tarafa yatmak zorundasın. Sağa dönüşten sola dönüşe geçişin tam anı yolun bükülme noktasıdır. $y = f(x)$ grafiği için tam aynı şey olur; sadece "sağa dön" ve "sola dön" yerine konkav-yukarı ve konkav-aşağıyı koy.</p>

<div class="calc-formula"><div class="formula-label">TANIM — BÜKÜLME NOKTASI</div><div class="formula-main">$$\\big(c,\\, f(c)\\big) \\text{ noktası } f \\text{'nin bir } \\textbf{bükülme noktasıdır}$$<br>$$\\iff f \\text{ } c \\text{'de süreklidir ve } f''(x) \\text{ } x = c \\text{'de işaret değiştirir.}$$</div><div class="formula-sub">İki bileşene dikkat: $f$'nin $c$'deki sürekliliği ve $f''$'nün $c$'yi geçerken gerçek bir işaret değişimi.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İşaret değişimi şart</div><div class="card-body">$f''$, $c$'nin iki yanında da pozitifse ya da iki yanında da negatifse bükülme yoktur — eğri aynı konkavlığı korur.</div></div>
<div class="calc-card"><div class="card-title">$f''(c) = 0$ sadece aday</div><div class="card-body">$f''(x) = 0$ çözümlerinin her biri bükülme noktası değildir. Her iki yandaki işareti kontrol etmek zorundasın.</div></div>
<div class="calc-card"><div class="card-title">$f''$ tanımsız olabilir</div><div class="card-body">$f''$'nün tanımsız olduğu yerde de işaret değişimi olabilir (örn. $f(x) = x^{1/3}$, $x = 0$'da). Bunlar da adaydır.</div></div>
</div>

<p class="l-text"><strong>Geometrik resim.</strong> Grafiği soldan sağa yürü. Bükülme noktasından hemen önce eğri teğet doğrusunun bir tarafındadır. Hemen sonra diğer tarafa geçer. Teğet doğrusunun kendisi bükülme noktasında eğriyi <em>keser</em> — ders kitaplarındaki taslaklarda sıkça görülen görsel bir imzadır.</p>

<div class="calc-example"><div class="example-label">KLASİK KARŞI ÖRNEK</div><div class="example-body">$f(x) = x^4$ için: $f'(x) = 4x^3$, $f''(x) = 12x^2$. $f''(0) = 0$ bulduk. <strong>$x = 0$ bir bükülme noktası mı?</strong><br><br>Her $x$ için $f''(x) = 12x^2 \\geq 0$. $f''$ işareti $x = 0$'da değişmez — iki yanda da pozitiftir. O hâlde $(0, 0)$ <strong>bükülme noktası değildir</strong>. $y = x^4$ eğrisi baştan sona konkav-yukarı kalır. Bu yüzden "$f''(c) = 0$" tek başına asla kanıt değildir; işaret değişimini her zaman doğrulamalısın.</div></div>

<h2 class="l-title">4. Bükülme Noktası Bulma: Adaylar ve İşaret Testi</h2>

<div class="calc-highlight"><strong>Tarif, 23. derste kritik nokta için kullandığımızın ayna görüntüsü.</strong> Ekstremum adaylarını bulmak için $f'(x) = 0$ çözdüğümüz gibi, bükülme adaylarını bulmak için $f''(x) = 0$ çözer (ve $f''$'nün tanımsız olduğu yerleri ekler) ve her adayın her iki yanındaki $f''$ işaretini sınarız.</div>

<div class="calc-formula"><div class="formula-label">TARİF — BÜKÜLME NOKTALARI</div><div class="formula-main">$$\\text{1. } f''(x) \\text{'i hesapla.}$$<br>$$\\text{2. } f''(x) = 0 \\text{ çöz ve } f'' \\text{'nin tanımsız olduğu değerleri listele.}$$<br>$$\\text{3. } f'' \\text{ için işaret tablosu kur.}$$<br>$$\\text{4. } f'' \\text{ işareti gerçekten değişen adaylar bükülme noktalarıdır.}$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — $f(x) = x^3 - 3x$ BÜKÜLMESİ</div><div class="example-body">$f'(x) = 3x^2 - 3$, $f''(x) = 6x$.<br><br><strong>Adaylar:</strong> $f''(x) = 0 \\iff 6x = 0 \\iff x = 0$.<br><br><strong>İşaret tablosu $f'' = 6x$:</strong><br>$x < 0$ için $f''(x) = 6x < 0$ → konkav-aşağı.<br>$x > 0$ için $f''(x) = 6x > 0$ → konkav-yukarı.<br><br>$f''$ işareti $x = 0$'da $-$'dan $+$'ya değişir. O hâlde $(0, f(0)) = (0, 0)$ bir <strong>bükülme noktasıdır</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İKİ BÜKÜLME NOKTASI</div><div class="example-body">$f(x) = x^4 - 6x^2$ fonksiyonunun bükülme noktalarını bul.<br><br>$f'(x) = 4x^3 - 12x$.<br>$f''(x) = 12x^2 - 12 = 12(x^2 - 1) = 12(x-1)(x+1)$.<br><br>Adaylar: $f''(x) = 0 \\iff x = \\pm 1$.<br><br>$f''$ işaret tablosu:<br>$x < -1$: $f''(x) = +$ (konkav-yukarı)<br>$-1 < x < 1$: $f''(x) = -$ (konkav-aşağı)<br>$x > 1$: $f''(x) = +$ (konkav-yukarı)<br><br>İşaret hem $x = -1$ hem $x = 1$'de değişir; ikisi de bükülme noktasıdır.<br>$f(-1) = 1 - 6 = -5$, $f(1) = 1 - 6 = -5$.<br>Bükülme noktaları: $\\mathbf{(-1, -5)}$ ve $\\mathbf{(1, -5)}$.</div></div>

<div class="calc-graph"><div id="plot-l24-inflection-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> $f(x) = x^3 - 3x$ kübiği. Bükülme noktası $(0, 0)$'ın solu (kırmızı) konkav-aşağı, sağı (mavi) konkav-yukarıdır. Bükülme noktasındaki teğet (kesik altın) eğriyi keser — solda eğrinin üstünde, sağda altında kalır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=-25;i<=0;i++){var x=i/10;xL.push(x);yL.push(x*x*x-3*x);}
var xR=[];var yR=[];for(var i=0;i<=25;i++){var x=i/10;xR.push(x);yR.push(x*x*x-3*x);}
var leftSeg={x:xL,y:yL,mode:'lines',name:'konkav-aşağı (f″<0)',line:{color:'#ef4444',width:3}};
var rightSeg={x:xR,y:yR,mode:'lines',name:'konkav-yukarı (f″>0)',line:{color:'#3b82f6',width:3}};
var tan={x:[-2.5,2.5],y:[-3*(-2.5),-3*2.5],mode:'lines',name:'teğet (0,0)',line:{color:'#c8a96e',width:2,dash:'dash'}};
var infl={x:[0],y:[0],mode:'markers+text',name:'bükülme (0,0)',marker:{color:'#fbbf24',size:14},text:['  bükülme'],textposition:'top right',textfont:{color:'#fbbf24',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x) = x³ - 3x',range:[-8,8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l24-inflection-tr',[leftSeg,rightSeg,tan,infl],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">ANAHTAR GÖZLEM</div><div class="think-body">Bir bükülme noktası, $f$'nin kritik noktası olmak zorunda değildir. Yukarıdaki örnekte $f'(0) = -3 \\neq 0$ olduğundan $(0, 0)$ kritik nokta değildi — yine de bükülme noktasıdır. İki kavram bağımsızdır: kritik nokta $f'$'den, bükülme noktası $f''$'den gelir.</div></div>

<h2 class="l-title">5. İkinci Türev Testi</h2>

<div class="calc-highlight"><strong>İkinci Türev Testi, kritik noktaları sınıflandırmak için hızlı bir kısayoldur.</strong> $f'(c) = 0$ olan bir $c$ sayısı verildiğinde, $f''(c)$'yi hesaplar ve sonucu hemen okursun — işaret tablosuna gerek yok, komşu değerlere gerek yok, sadece tek bir sayı.</div>

<div class="calc-formula"><div class="formula-label">İKİNCİ TÜREV TESTİ</div><div class="formula-main">$$f'(c) = 0 \\text{ ve } f''(c) \\text{ tanımlı olsun.}$$<br>$$f''(c) > 0 \\;\\Longrightarrow\\; c \\text{ yerel } \\textbf{minimum}$$<br>$$f''(c) < 0 \\;\\Longrightarrow\\; c \\text{ yerel } \\textbf{maksimum}$$<br>$$f''(c) = 0 \\;\\Longrightarrow\\; \\textbf{test başarısız (kararsız)}$$</div><div class="formula-sub">İlk iki durum sezgiyle birebir örtüşür: minimumda kase yukarı açılır (konkav-yukarı, $f''>0$); maksimumda tepe aşağı açılır (konkav-aşağı, $f''<0$).</div></div>

<p class="l-text"><strong>Neden işliyor?</strong> $f'(c) = 0$ ve $f''(c) > 0$ olsun. $f''(c) > 0$, $f'$ eğiminin $c$'de arttığını söyler. $f'(c) = 0$ tam olarak verildiği için, eğim $c$'den hemen önce negatif, hemen sonra pozitif olmalıdır — bu yerel minimum için Birinci Türev Testi örüntüsüdür. $f''(c) < 0$ için kanıt simetriktir.</p>

<p class="l-text"><strong>Kararsız durum.</strong> $f''(c) = 0$ olduğunda test bir bilgi vermez. $f'(0) = 0$ ve $f''(0) = 0$ olan üç örneğe bak:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$f(x) = x^4$</div><div class="card-body">$f'(0) = 0$, $f''(0) = 0$. Yine de $(0, 0)$ yerel <strong>minimum</strong>dur (eğri her yerde orijinin üstünde).</div></div>
<div class="calc-card"><div class="card-title">$f(x) = -x^4$</div><div class="card-body">$f'(0) = 0$, $f''(0) = 0$. Şimdi $(0, 0)$ yerel <strong>maksimum</strong>dur.</div></div>
<div class="calc-card"><div class="card-title">$f(x) = x^3$</div><div class="card-body">$f'(0) = 0$, $f''(0) = 0$. Burada $(0, 0)$ ne max ne min — yatay bir bükülmedir.</div></div>
</div>

<p class="l-text">Üç fonksiyon da ikinci türev testi açısından özdeş görünür — her birinde $f''(0) = 0$ — ama davranışları tamamen farklıdır. Test başarısız olduğunda Birinci Türev Testi'ne (işareti tablosu) dön ya da daha yüksek türevleri incele.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TESTİ UYGULAMA</div><div class="example-body">$f(x) = x^3 - 12x + 5$ fonksiyonunun kritik sayılarını sınıflandır.<br><br>$f'(x) = 3x^2 - 12 = 3(x-2)(x+2)$ → kritik sayılar $x = -2$ ve $x = 2$.<br>$f''(x) = 6x$.<br><br>$x = -2$'de: $f''(-2) = -12 < 0$ → <strong>yerel maksimum</strong>. Değer: $f(-2) = -8 + 24 + 5 = 21$.<br>$x = 2$'de: $f''(2) = 12 > 0$ → <strong>yerel minimum</strong>. Değer: $f(2) = 8 - 24 + 5 = -11$.<br><br>Bitti — işaret tablosuna gerek yok.</div></div>

<h2 class="l-title">6. Çözümlü Örnek 1: $f(x) = x^3 - 6x^2 + 9x$ Tam Analizi</h2>

<p class="l-text">Şimdi tüm öğrendiklerimizi tek bir incelemede birleştirelim. $f(x) = x^3 - 6x^2 + 9x$ için monotonluk aralıklarını, konkavlığı, yerel ekstremumları ve bükülme noktalarını bulalım.</p>

<p class="l-text"><strong>Adım 1 — Türevler.</strong></p>
<p class="l-text">$f'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x-1)(x-3)$.</p>
<p class="l-text">$f''(x) = 6x - 12 = 6(x - 2)$.</p>

<p class="l-text"><strong>Adım 2 — Kritik sayılar.</strong></p>
<p class="l-text">$f'(x) = 0 \\iff x = 1$ veya $x = 3$.</p>

<p class="l-text"><strong>Adım 3 — İkinci türev testi.</strong></p>
<p class="l-text">$f''(1) = 6(1-2) = -6 < 0$ → $x = 1$'de <strong>yerel max</strong>. Değer: $f(1) = 1 - 6 + 9 = 4$.</p>
<p class="l-text">$f''(3) = 6(3-2) = 6 > 0$ → $x = 3$'te <strong>yerel min</strong>. Değer: $f(3) = 27 - 54 + 27 = 0$.</p>

<p class="l-text"><strong>Adım 4 — Konkavlık.</strong></p>
<p class="l-text">$f''(x) = 6(x-2)$. $f''$ işareti: $x < 2$ için negatif, $x > 2$ için pozitif.</p>
<p class="l-text">$(-\\infty, 2)$'de konkav-aşağı, $(2, \\infty)$'da konkav-yukarı. $x = 2$'de <strong>bükülme noktası</strong>: $f(2) = 8 - 24 + 18 = 2$, yani nokta $(2, 2)$.</p>

<p class="l-text"><strong>Adım 5 — Monotonluk.</strong></p>
<p class="l-text">$f' = 3(x-1)(x-3)$ işaret tablosu: $(-\\infty, 1)$'de pozitif, $(1, 3)$'te negatif, $(3, \\infty)$'da pozitif.</p>
<p class="l-text">$f$ artar: $(-\\infty, 1)$ ve $(3, \\infty)$. Azalır: $(1, 3)$.</p>

<div class="calc-example"><div class="example-label">ÖZET TABLO</div><div class="example-body"><strong>Yerel max</strong>: $(1, 4)$.<br><strong>Yerel min</strong>: $(3, 0)$.<br><strong>Bükülme</strong>: $(2, 2)$.<br><strong>Artan</strong>: $(-\\infty, 1) \\cup (3, \\infty)$.<br><strong>Azalan</strong>: $(1, 3)$.<br><strong>Konkav-aşağı</strong>: $(-\\infty, 2)$.<br><strong>Konkav-yukarı</strong>: $(2, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l24-fppf-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> $f(x) = x^3 - 6x^2 + 9x$ için $f$, $f'$, $f''$ aynı eksende. Üç hizalama: (i) $f'$ sıfırı geçtiği yerlerde (kırmızı nokta) $f$'nin yatay teğeti var. (ii) $f''$ sıfırı geçtiği yerde (altın nokta) $f$'nin bükülmesi var. (iii) $f''$ negatif olduğu yerde özgün $f$ tepe gibi, pozitif olduğu yerde kase gibi bükülür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var f=[];var fp=[];var fpp=[];for(var i=-5;i<=55;i++){var x=i/10;xs.push(x);f.push(x*x*x-6*x*x+9*x);fp.push(3*x*x-12*x+9);fpp.push(6*x-12);}
var c1={x:xs,y:f,mode:'lines',name:'f(x) = x³-6x²+9x',line:{color:'#3b82f6',width:3}};
var c2={x:xs,y:fp,mode:'lines',name:"f'(x) = 3(x-1)(x-3)",line:{color:'#ef4444',width:2.5,dash:'dot'}};
var c3={x:xs,y:fpp,mode:'lines',name:'f″(x) = 6(x-2)',line:{color:'#fbbf24',width:2.5,dash:'dashdot'}};
var critX=[1,3];var critY=[4,0];
var critF={x:critX,y:critY,mode:'markers+text',name:'f ekstremumları',marker:{color:'#3b82f6',size:12},text:['  max (1,4)','  min (3,0)'],textposition:'top right',textfont:{color:'#3b82f6',size:11},showlegend:false};
var inflF={x:[2],y:[2],mode:'markers+text',name:'bükülme',marker:{color:'#fbbf24',size:12,symbol:'diamond'},text:['  bük (2,2)'],textposition:'top right',textfont:{color:'#fbbf24',size:11},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-0.5,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'değer',range:[-15,15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l24-fppf-tr',[c1,c2,c3,critF,inflF],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="l-title">7. Çözümlü Örnek 2: Test Başarısız Olunca — $f(x) = x^4 - 4x^3$</h2>

<p class="l-text">Şimdi İkinci Türev Testi'nin bir kritik sayıda işe yaramadığı daha hassas bir durum.</p>

<p class="l-text">$f(x) = x^4 - 4x^3$.</p>
<p class="l-text">$f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$.</p>
<p class="l-text">$f''(x) = 12x^2 - 24x = 12x(x - 2)$.</p>

<p class="l-text"><strong>Kritik sayılar.</strong> $f'(x) = 0 \\iff 4x^2(x-3) = 0 \\iff x = 0$ veya $x = 3$.</p>

<p class="l-text"><strong>İkinci Türev Testi uygula.</strong></p>
<p class="l-text">$f''(3) = 12 \\cdot 3 \\cdot 1 = 36 > 0$ → $x = 3$'te <strong>yerel minimum</strong>. Değer: $f(3) = 81 - 108 = -27$.</p>
<p class="l-text">$f''(0) = 0$ → <strong>test başarısız</strong>. Bunun yerine Birinci Türev Testi'ni kullanmalıyız.</p>

<p class="l-text"><strong>$x = 0$'da Birinci Türev Testi.</strong> $f'(x) = 4x^2(x-3)$ işareti.</p>
<p class="l-text">$0$'ın hemen solunda (örn. $x = -0.5$): $f'(-0.5) = 4(0.25)(-3.5) = -3.5 < 0$.</p>
<p class="l-text">$0$'ın hemen sağında (örn. $x = 0.5$): $f'(0.5) = 4(0.25)(-2.5) = -2.5 < 0$.</p>
<p class="l-text">$f'$, $x = 0$'da işaret değiştirmiyor — iki yan da negatif. O hâlde $x = 0$ <strong>ne max ne min</strong>. Fonksiyon yatay teğet ile geçer ama her iki yanda da azalmaya devam eder.</p>

<p class="l-text"><strong>Bükülme noktaları.</strong> $f''(x) = 12x(x-2) = 0 \\iff x = 0$ veya $x = 2$. $f''$ işaret tablosu:</p>
<p class="l-text">$x < 0$: $f'' = +$ (konkav-yukarı). $0 < x < 2$: $f'' = -$ (konkav-aşağı). $x > 2$: $f'' = +$ (konkav-yukarı).</p>
<p class="l-text">$f''$ hem $x = 0$ hem $x = 2$'de işaret değiştirir → $(0, 0)$ ve $(2, f(2)) = (2, 16 - 32) = (2, -16)$'da bükülme.</p>

<div class="calc-example"><div class="example-label">BU ÖRNEKTEN DERS</div><div class="example-body">İkinci Türev Testi başarısız olduğunda ($f''(c) = 0$), $c$ hakkında <strong>hiçbir şey</strong> söyleme. Birinci Türev Testi'ne uzan, $f'$'yü her iki yandan incele ve işaret değişimi (ya da yokluğu) kararı versin.</div></div>

<h2 class="l-title">8. $f(x) = \\sin x$ Bükülme Noktaları</h2>

<p class="l-text">Trig fonksiyonlar bitmek bilmez bir bükülme noktası kaynağıdır. $f(x) = \\sin x$ alalım.</p>
<p class="l-text">$f'(x) = \\cos x$, $f''(x) = -\\sin x$.</p>
<p class="l-text">$f''(x) = 0 \\iff \\sin x = 0 \\iff x = k\\pi$, her tam sayı $k$ için.</p>

<p class="l-text"><strong>İşaret kontrolü.</strong> $f''(x) = -\\sin x$, $(\\pi, 2\\pi)$'de pozitiftir (çünkü $\\sin x < 0$ orada) ve $(0, \\pi)$'de negatiftir (çünkü $\\sin x > 0$ orada). Yani $x$ her $\\pi$ katından geçtiğinde $f''$ işareti değişir. O hâlde <strong>her</strong> $x = k\\pi$ noktası bir bükülme noktasıdır. Karşılık gelen $y$-koordinatları $\\sin(k\\pi) = 0$'dır; yani bükülme noktaları her tam sayı $k$ için $(k\\pi, 0)$ olur.</p>

<p class="l-text">Geometrik olarak: sinüs dalgası her "tepe" $(2k\\pi, (2k+1)\\pi)$'de aşağı bükülür, her "vadi" $((2k+1)\\pi, (2k+2)\\pi)$'de yukarı bükülür. Geçişler tam olarak $x$-eksenini kestiği yerlerdir.</p>

<div class="calc-graph"><div id="plot-l24-sine-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> $[-2\\pi, 2\\pi]$ üzerinde $y = \\sin x$. Mavi kısımlar konkav-yukarı ($f'' > 0$), kırmızı kısımlar konkav-aşağı ($f'' < 0$); altın noktalar her $\\pi$ katındaki bükülme noktalarını işaretler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var segs=[];var pi=Math.PI;
function piece(a,b,col){var xs=[];var ys=[];for(var i=0;i<=120;i++){var t=a+(b-a)*i/120;xs.push(t);ys.push(Math.sin(t));}return {x:xs,y:ys,mode:'lines',line:{color:col,width:3},showlegend:false};}
segs.push(piece(-2*pi,-pi,'#3b82f6'));
segs.push(piece(-pi,0,'#ef4444'));
segs.push(piece(0,pi,'#ef4444'));
segs.push(piece(pi,2*pi,'#3b82f6'));
var infl={x:[-2*pi,-pi,0,pi,2*pi],y:[0,0,0,0,0],mode:'markers',name:'bükülme',marker:{color:'#fbbf24',size:11},showlegend:true};
var blueLeg={x:[null],y:[null],mode:'lines',name:'konkav-yukarı (f″>0)',line:{color:'#3b82f6',width:3}};
var redLeg={x:[null],y:[null],mode:'lines',name:'konkav-aşağı (f″<0)',line:{color:'#ef4444',width:3}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-2*pi-0.3,2*pi+0.3],tickvals:[-2*pi,-pi,0,pi,2*pi],ticktext:['-2π','-π','0','π','2π'],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'sin x',range:[-1.3,1.3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
var data=segs.concat([infl,blueLeg,redLeg]);
Plotly.newPlot('plot-l24-sine-tr',data,lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">HIZLI ALIŞTIRMA</div><div class="think-body">$f(x) = \\cos x$ bükülme noktaları nerede? Hesap: $f''(x) = -\\cos x$, yani $f''(x) = 0 \\iff x = \\pi/2 + k\\pi$. Her birinde işaret değişir — kosinüsün her $x = \\pi/2 + k\\pi$ noktası bükülmedir.</div></div>

<h2 class="l-title">9. Birinci Türev Testi ile İkinci Türev Testi Karşılaştırma</h2>

<p class="l-text">Artık kritik noktaları sınıflamak için iki yöntemin var. İkisi de geçerlidir, ikisi birden uygulanabildiğinde aynı cevabı verir; ama her biri farklı koşullarda daha kullanışlıdır.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">BİRİNCİ TÜREV TESTİ</div><div class="compare-item">Kritik sayının iki yanında $f'$ işaretini incele</div><div class="compare-item">Her zaman çalışır — asla kararsız değil</div><div class="compare-item">Küçük bir $f'$ işaret tablosu kurmayı gerektirir</div><div class="compare-item">$f''$ karışıksa veya bilinmiyorsa elverişli</div><div class="compare-item">$f$ iki kez türevlenemediği durumları da idare eder</div></div><div class="compare-col"><div class="compare-title">İKİNCİ TÜREV TESTİ</div><div class="compare-item">Sadece tek bir $f''(c)$ sayısını hesapla ve işaretini oku</div><div class="compare-item">Daha hızlı — işaret tablosuna gerek yok</div><div class="compare-item">$f''(c) = 0$ olduğunda başarısız (kararsız)</div><div class="compare-item">$f''$ kolay hesaplanıyorsa elverişli</div><div class="compare-item">Optimizasyon ve fizik problemlerinde standart</div></div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İkinci Türev Testi'ni kullan…</div><div class="card-body">$f''$ sade ise (örn. düşük dereceli polinom), çok kritik sayı varsa ve hızlı bir karar istiyorsan, ya da problem $f''$'yi zaten veriyorsa.</div></div>
<div class="calc-card"><div class="card-title">Birinci Türev Testi'ni kullan…</div><div class="card-body">$f''(c) = 0$ çıkıyorsa, $f''$ hesaplaması zorsa, ya da çizimin için monotonluk aralıklarına da ihtiyacın varsa.</div></div>
<div class="calc-card"><div class="card-title">Tereddütte ikisini de yap.</div><div class="card-body">İkisi birden uygulandığında asla çelişmezler. $f'$ işaret tablosu, ikinci türev kısayolunun arkasındaki güvenlik ağıdır.</div></div>
</div>

<div class="calc-example"><div class="example-label">AYNI PROBLEM, İKİ YÖNTEM</div><div class="example-body">$f(x) = x^2 - 4x + 7$ kritik noktasını sınıflandır.<br><br>$f'(x) = 2x - 4 = 0 \\iff x = 2$.<br><br><strong>İkinci Türev Testi:</strong> $f''(x) = 2 > 0$ → $x = 2$'de yerel min.<br><strong>Birinci Türev Testi:</strong> $f'(1) = -2 < 0$, $f'(3) = 2 > 0$. $f'$ işareti $-$'dan $+$'ya geçer → $x = 2$'de yerel min.<br><br>İkisi de aynı şeyi söyler. $f(2) = 4 - 8 + 7 = 3$. Yerel min $(2, 3)$.</div></div>

<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Her problemi kâğıt-kalemle çöz. Çözümler her ifadenin ardından gelir; kendi çözümünden sonra karşılaştırarak kontrol et.</p>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1</div><div class="example-body"><strong>Problem.</strong> $f(x) = x^3 - 9x^2 + 24x - 7$ fonksiyonunun konkavlık aralıklarını ve bükülme noktalarını bul.<br><br><strong>Çözüm.</strong> $f''(x) = 6x - 18 = 6(x-3)$. $x = 3$'te işaret değişir: $(-\\infty, 3)$'te konkav-aşağı, $(3, \\infty)$'da konkav-yukarı. $x = 3$'te bükülme, $f(3) = 27 - 81 + 72 - 7 = 11$. Nokta: $(3, 11)$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2</div><div class="example-body"><strong>Problem.</strong> İkinci Türev Testi'ni $f(x) = 2x^3 - 3x^2 - 12x + 5$ kritik noktalarına uygula.<br><br><strong>Çözüm.</strong> $f'(x) = 6x^2 - 6x - 12 = 6(x^2 - x - 2) = 6(x-2)(x+1)$. Kritik sayılar: $x = -1, 2$. $f''(x) = 12x - 6$. $x = -1$'de: $f''(-1) = -18 < 0$ → yerel max, $f(-1) = -2 - 3 + 12 + 5 = 12$. $x = 2$'de: $f''(2) = 18 > 0$ → yerel min, $f(2) = 16 - 12 - 24 + 5 = -15$. Yerel max $(-1, 12)$, yerel min $(2, -15)$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3</div><div class="example-body"><strong>Problem.</strong> $f(x) = x^4 - 8x^2 + 3$ fonksiyonu. Tüm ekstremumları ve bükülme noktalarını bul.<br><br><strong>Çözüm.</strong> $f'(x) = 4x^3 - 16x = 4x(x^2 - 4) = 4x(x-2)(x+2)$. Kritik sayılar: $-2, 0, 2$. $f''(x) = 12x^2 - 16$. $x = -2$'de: $f''(-2) = 48 - 16 = 32 > 0$ → yerel min, $f(-2) = 16 - 32 + 3 = -13$. $x = 0$'da: $f''(0) = -16 < 0$ → yerel max, $f(0) = 3$. $x = 2$'de: $f''(2) = 32 > 0$ → yerel min, $f(2) = -13$. Bükülme: $f''(x) = 0 \\iff x^2 = 4/3 \\iff x = \\pm 2/\\sqrt{3}$. Her birinde işaret değişir. Bükülmeler $x = \\pm 2/\\sqrt{3}$'te.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4</div><div class="example-body"><strong>Problem.</strong> $f(x) = x^5$ için $f''(0) = 0$ olduğunu ama $x = 0$'ın yerel ekstremum olmadığını göster.<br><br><strong>Çözüm.</strong> $f'(x) = 5x^4 \\geq 0$ her yerde, $f'(0) = 0$. $f''(x) = 20x^3$, $f''(0) = 0$. Test başarısız. $f'$ işareti: $f'(-0.1) = 5 \\cdot 0.0001 > 0$, $f'(0.1) > 0$. İşaret değişmez → $x = 0$ yatay teğet ama ekstremum değil. $f''$ işareti: $f''(-0.1) < 0$, $f''(0.1) > 0$ → $x = 0$ aslında $f$'nin <strong>bükülme noktasıdır</strong>.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5</div><div class="example-body"><strong>Problem.</strong> $x \\in \\mathbb{R}$ için $f(x) = x \\, e^{-x}$ fonksiyonunun bükülme noktalarını bul.<br><br><strong>Çözüm.</strong> $f'(x) = e^{-x} - x e^{-x} = e^{-x}(1-x)$. $f''(x) = -e^{-x}(1-x) + e^{-x}(-1) = e^{-x}(x-2)$. $f''(x) = 0 \\iff x = 2$ ($e^{-x} > 0$ her zaman). $f''$ işareti: $x < 2$ → negatif, $x > 2$ → pozitif. $x = 2$'de işaret değişir → $(2, 2e^{-2})$'de bükülme.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6</div><div class="example-body"><strong>Problem.</strong> $f(x) = ax^3 + bx^2 + cx + d$ kübiği, $x = -1$'de yerel max ve $x = 3$'te yerel min'e sahiptir. Bükülme noktasının tam olarak $x = 1$'de olduğunu göster.<br><br><strong>Çözüm.</strong> $f'(x) = 3ax^2 + 2bx + c$. İki kökü kritik sayılar $-1$ ve $3$. Vieta formüllerinden, köklerin toplamı $-1 + 3 = 2 = -\\frac{2b}{3a}$ olur, yani $b = -3a$. Kübiğin bükülme noktası $f''(x) = 6ax + 2b = 0$ olduğu yerdedir, yani $x = -b/(3a) = -(-3a)/(3a) = 1$. Bükülme noktası iki kritik sayının tam ortasına denk gelir — her kübiğin güzel bir özelliği.</div></div>

<h2 class="l-title">11. Hepsini Birleştir — Tam Grafik Çizim Reçetesi</h2>

<p class="l-text">23. ve 24. dersler, bir polinom veya rasyonel fonksiyonun grafiğini onlarca nokta yerleştirmeden sıfırdan çizmen için gerekli tüm malzemeleri verir. İş, adımları <em>doğru sırada</em> yapmaktır: her adım, bir sonraki adımın dikkat etmesi gerekenleri daraltır. Aşağıdaki reçete, sırayla uygulandığında yalnızca $f$, $f'$ ve $f''$ kullanarak yayımlanabilir nitelikte bir çizim üreten altı adımı toplar.</p>

<div class="calc-table-wrap" style="margin:1.4rem 0;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden">
<thead><tr style="background:rgba(59,130,246,0.12);color:#3b82f6">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(59,130,246,0.3)">Adım</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(59,130,246,0.3)">Bulunacak</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;letter-spacing:0.04em;border-bottom:1px solid rgba(59,130,246,0.3)">Nasıl / hangi araç</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.92)">
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">1. Tanım kümesi</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$f(x)$'in tanımlı olduğu $x$ kümesi</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Sıfıra bölme, $\\sqrt{\\text{negatif}}$, $\\ln$'in pozitif-olmayanı dışla</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">2. Kesişimler</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$x$-kesişimleri $f(x)=0$; $y$-kesişim $f(0)$</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Doğrudan çöz / yerine koy</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">3. Asimptotlar</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Eğrinin yaklaştığı düşey, yatay, eğik doğrular</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$\\lim_{x\\to a^\\pm}=\\pm\\infty$ (düşey); $\\lim_{x\\to\\pm\\infty}f$ (yatay); polinom bölme (eğik)</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">4. Kritik noktalar</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$f'(x)=0$ + Birinci Türev Testi'nden yerel max / min</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">İki yanda $f'$ işareti: $-{\\to}+$ min, $+{\\to}-$ max</td></tr>
<tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#3b82f6">5. Bükülme</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$f''(x)=0$ + İkinci Türev Testi'nden konkavlık değişimi</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">$f''>0$ konkav-yukarı, $f''<0$ konkav-aşağı; işaret dönüşü $\\Rightarrow$ bükülme</td></tr>
<tr><td style="padding:0.6rem 0.9rem;font-weight:600;color:#3b82f6">6. Çizim</td><td style="padding:0.6rem 0.9rem">Hepsini tek bir eğride birleştir</td><td style="padding:0.6rem 0.9rem">Kesişimleri, ekstremumları, bükülmeyi, asimptotları çiz; doğru konkavlıkla birleştir</td></tr>
</tbody>
</table>
</div>

<p class="l-text"><strong>Çözümlü örnek.</strong> Reçeteyi $f(x) = \\frac{x^3}{3} - x$'e uygula.</p>
<p class="l-text"><strong>1. Tanım kümesi.</strong> Polinom $\\Rightarrow$ tüm $\\mathbb{R}$. <strong>2. Kesişimler.</strong> $f(0) = 0$; $f(x) = 0 \\iff x(x^2 - 3)/3 = 0 \\iff x = 0,\\, \\pm\\sqrt{3}$. <strong>3. Asimptotlar.</strong> Yok — bir polinom sınırsız büyür (yaklaştığı düşey, yatay ya da eğik doğru bulunmaz). <strong>4. Kritik noktalar.</strong> $f'(x) = x^2 - 1 = 0 \\iff x = \\pm 1$. $f''(\\pm 1) = \\pm 2$: $(-1, 2/3)$'te yerel max, $(1, -2/3)$'te yerel min. <strong>5. Bükülme.</strong> $f''(x) = 2x = 0 \\iff x = 0$; $f''$ işareti $- \\to +$ döner, yani $(0, 0)$ bir bükülme noktasıdır. <strong>6. Çizim.</strong> $(-\\infty, 0)$ üzerinde konkav-aşağı, $(0, \\infty)$ üzerinde konkav-yukarı; $(-\\sqrt{3},0), (0,0), (\\sqrt{3},0)$'dan geçer; tepe $(-1, 2/3)$, çukur $(1, -2/3)$.</p>

<div class="calc-graph"><div id="plot-l24-tr-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> altı adımlı reçeteyle çizilen $f(x) = x^3/3 - x$ eğrisinin tamamı. Yerel max $(-1, 2/3)$ ve yerel min $(1, -2/3)$ (altın) 4. adımdan; bükülme noktası $(0, 0)$ (kırmızı elmas) 5. adımdan; $-\\sqrt{3}, 0, \\sqrt{3}$ $x$-kesişimleri (camgöbeği) 2. adımdan gelir. Eğri $x = 0$'ın solunda konkav-aşağı (kırmızı parça), sağında konkav-yukarıdır (mavi parça). Polinomda asimptot yoktur — kesik gri çizgi yokluğu işaret eder: $|x| \\to \\infty$ iken $y$ sınırsız büyür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function f(x){return x*x*x/3 - x;}
var xL=[];var yL=[];var xR=[];var yR=[];
for(var i=-180;i<=0;i++){var x=i/40;xL.push(x);yL.push(f(x));}
for(var j=0;j<=180;j++){var xj=j/40;xR.push(xj);yR.push(f(xj));}
var left={x:xL,y:yL,mode:'lines',name:'konkav-aşağı (f″<0)',line:{color:'#ef4444',width:3}};
var right={x:xR,y:yR,mode:'lines',name:'konkav-yukarı (f″>0)',line:{color:'#3b82f6',width:3}};
var crit={x:[-1,1],y:[f(-1),f(1)],mode:'markers+text',name:'kritik noktalar',marker:{color:'#fbbf24',size:13,line:{color:'#0a0a0a',width:2}},text:['max (-1, 2/3)','min (1, -2/3)'],textposition:'top center',textfont:{color:'#fbbf24',size:11},showlegend:true};
var infl={x:[0],y:[0],mode:'markers+text',name:'bükülme',marker:{color:'#ef4444',size:13,symbol:'diamond',line:{color:'#0a0a0a',width:2}},text:['bükülme (0, 0)'],textposition:'bottom right',textfont:{color:'#ef4444',size:11},showlegend:true};
var sq3=Math.sqrt(3);
var ints={x:[-sq3,0,sq3],y:[0,0,0],mode:'markers',name:'x-kesişimleri',marker:{color:'#22d3ee',size:11,symbol:'circle-open',line:{width:3}},showlegend:true};
var noAsymp={x:[-3.2,3.2],y:[0,0],mode:'lines',name:'asimptot yok (polinom)',line:{color:'rgba(200,169,110,0.35)',width:1,dash:'dot'},showlegend:true};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',tickvals:[-sq3,-1,0,1,sq3],ticktext:['-√3','-1','0','1','√3']},yaxis:{title:'f(x) = x³/3 − x',range:[-3.2,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:40,r:30,b:55,l:65},legend:{orientation:'h',y:-0.18,xanchor:'center',x:0.5,bgcolor:'rgba(0,0,0,0)',font:{size:10}}};
Plotly.newPlot('plot-l24-tr-extra',[noAsymp,left,right,crit,infl,ints],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Bu sıralama neden önemli?</strong> Tanım kümesi ilk gelir çünkü diğer her şeyi sınırlar — tanım dışında bir ekstremum ya da kesişim olamaz. Kesişimler ve asimptotlar sıradakidir çünkü eğriyi düzleme sabitlerler. Kritik noktalar ve bükülme sonra yerel şekil bilgisini ekler. Eğriyi en sonda çizersin; o noktada her kilit nokta ve her konkavlık aralığı zaten bilinmiştir. Bu yöntemle yapılan çizim asla "bir tümsek kadar yanlış" olmaz — her özelliğin bir gerekçesi vardır.</div>

<div class="l-note"><strong>Kapanış düşüncesi:</strong> ikinci türev, birinci türevin başlattığı resmi tamamlar. $f'$ ve $f''$ birlikte bir grafiğin tüm nitel şeklini kontrol eder — nerede yükselip alçaldığını, nerede bir yöne ya da öteki yöne büküldüğünü, ekstremumlarının nerede ve bükülme yön değiştirmelerinin nerede yaşandığını. Bu iki araçla istediğin polinomu çizebilir, optimizasyon problemlerinin davranışını öngörebilir ve kalkülüs ders kitabı eğrilerini bir müzisyenin nota okuduğu gibi okuyabilirsin.</div>`
};
