window.CALCULUS_L6 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Optimization</strong> is the branch of mathematics that asks the simplest practical question one can ask of any quantity: <em>what is its largest possible value, and what is its smallest?</em> A farmer asks how to fence a rectangular field of maximum area with a fixed length of wire. A manufacturer asks for the cylindrical can of fixed volume that uses the least metal. An engineer asks for the height of a beam that minimises deflection under load. An economist asks for the production level that maximises profit. In every case the answer comes from one mathematical engine: locate where the derivative vanishes, classify those points, and inspect the boundary.</p>

<p class="l-text">In this lesson we develop that engine from the ground up. We start with the geometric meaning of a critical point, prove and apply the first- and second-derivative tests for functions of one variable, find absolute extrema on closed intervals, work through a handful of the classical optimization problems that have decorated calculus textbooks for two hundred years, and then lift the entire machinery to several variables using the gradient and the Hessian. The two-dimensional second-derivative test will let us distinguish minima from maxima from saddle points just by looking at a 2 by 2 determinant.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a critical point of a one-variable function and explain its geometric meaning</li>
<li>Apply the first-derivative test using sign changes of $f'(x)$ to classify local extrema</li>
<li>Apply the second-derivative test using the sign of $f''(x_0)$ and recognise when it is inconclusive</li>
<li>Find absolute (global) extrema of a continuous function on a closed interval by combining critical points with boundary values</li>
<li>Set up and solve the classical optimization problems: maximum area with fixed perimeter, minimum surface area for a fixed volume, optimal profit, shortest distance from a point to a curve</li>
<li>Generalise to several variables: locate critical points where $\\nabla f = \\mathbf{0}$</li>
<li>Use the Hessian determinant $D = f_{xx} f_{yy} - f_{xy}^2$ to classify two-variable critical points as local minima, local maxima, or saddle points</li>
</ul>
</div>

<h2 class="l-title">1. Why Optimization?</h2>

<p class="l-text">Optimization problems are everywhere because <em>any</em> quantitative goal can be phrased as "find the input that makes this output as large as possible" or "as small as possible". The mathematical setup is always the same: a real-valued <strong>objective function</strong> $f$ is given, perhaps with a constraint, and the task is to locate the points where $f$ achieves its extreme values.</p>

<div class="calc-highlight"><strong>The fundamental observation.</strong> If $f$ is differentiable and attains a local extremum at an interior point $x_0$, then the tangent line at $x_0$ must be horizontal: $f'(x_0) = 0$. Otherwise we could move slightly in the uphill direction and find a larger value, contradicting the extremum. This single observation — known as <em>Fermat's theorem</em> — reduces a continuous search problem to an algebraic one: solve $f'(x) = 0$.</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Minimization</div>
<div class="compare-item">&bull; Find $x$ that makes $f(x)$ smallest</div>
<div class="compare-item">&bull; "Minimum surface area", "minimum cost"</div>
<div class="compare-item">&bull; At an interior min, $f''(x_0) \\ge 0$ (concave up)</div>
<div class="compare-item">&bull; Often subject to a constraint (volume, perimeter)</div></div>
<div class="compare-col"><div class="compare-title">Maximization</div>
<div class="compare-item">&bull; Find $x$ that makes $f(x)$ largest</div>
<div class="compare-item">&bull; "Maximum area", "maximum profit"</div>
<div class="compare-item">&bull; At an interior max, $f''(x_0) \\le 0$ (concave down)</div>
<div class="compare-item">&bull; Equivalent to minimising $-f(x)$</div></div>
</div>

<div class="calc-formula"><span class="formula-label">Fermat's Theorem (Interior Extremum)</span><div class="formula-main">$$\\text{If } f \\text{ is differentiable at an interior local extremum } x_0, \\text{ then } f'(x_0) = 0.$$</div><div class="formula-sub">The converse fails: $f'(x_0) = 0$ does not imply an extremum, e.g. $f(x) = x^3$ at $x_0 = 0$.</div></div>

<p class="l-text">Two important caveats accompany Fermat's theorem. First, the theorem is one-directional: <em>every</em> interior extremum is a critical point, but not every critical point is an extremum. The cubic $f(x) = x^3$ has $f'(0) = 0$ yet $x = 0$ is neither a minimum nor a maximum — it is an inflection point. We will need extra tests to decide. Second, the theorem only applies to <em>interior</em> points of a differentiable function. Extrema may also lie at endpoints of a closed interval or at points where the derivative fails to exist (corners, cusps). We will treat these explicitly when we discuss absolute extrema.</p>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If a function $f$ is continuous on a closed bounded interval $[a, b]$, the <em>extreme value theorem</em> guarantees that $f$ attains both a maximum and a minimum somewhere on that interval. Those points must lie either where $f'(x) = 0$, at an endpoint $a$ or $b$, or at a point where $f'$ is undefined. So a finite checklist exhausts all candidates.</div></div>

<h2 class="l-title">2. Critical Points and Local Extrema</h2>

<p class="l-text">Let $f$ be a real-valued function defined on an open interval. We say $f$ has a <strong>local maximum</strong> at $x_0$ if $f(x_0) \\ge f(x)$ for every $x$ in some open neighbourhood of $x_0$, and a <strong>local minimum</strong> if $f(x_0) \\le f(x)$ on some neighbourhood. A <strong>critical point</strong> of $f$ is a point $x_0$ in the domain where either $f'(x_0) = 0$ or $f'(x_0)$ does not exist.</p>

<div class="calc-formula"><span class="formula-label">Critical Point</span><div class="formula-main">$$x_0 \\text{ is a critical point of } f \\iff f'(x_0) = 0 \\text{ or } f'(x_0) \\text{ does not exist}$$</div><div class="formula-sub">Fermat's theorem says every interior local extremum is a critical point — so critical points are the only candidates.</div></div>

<p class="l-text">The three classical pictures one must keep in mind are: a smooth bowl, where $f'$ changes from negative to positive (local minimum); a smooth cap, where $f'$ changes from positive to negative (local maximum); and an inflection plateau, where $f'$ vanishes momentarily but does not change sign (no extremum). The cubic $f(x) = x^3$ is the textbook illustration of the third case — at $x = 0$ the slope is zero, but the function continues to increase through it.</p>

<div class="calc-graph"><div class="graph-title">Three Critical-Point Behaviours</div>
<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg">
<line x1="30" y1="180" x2="510" y2="180" stroke="rgba(255,255,255,.15)"/>
<text x="100" y="30" fill="#4ecdc4" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Local minimum</text>
<path d="M30,50 Q100,200 170,50" fill="none" stroke="#4ecdc4" stroke-width="2.5"/>
<circle cx="100" cy="155" r="4" fill="#4ecdc4"/>
<text x="100" y="200" fill="#4ecdc4" font-family="monospace" font-size="10" text-anchor="middle">f'(x_0)=0, f''&gt;0</text>
<text x="270" y="30" fill="#f87171" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Local maximum</text>
<path d="M200,180 Q270,30 340,180" fill="none" stroke="#f87171" stroke-width="2.5"/>
<circle cx="270" cy="75" r="4" fill="#f87171"/>
<text x="270" y="200" fill="#f87171" font-family="monospace" font-size="10" text-anchor="middle">f'(x_0)=0, f''&lt;0</text>
<text x="440" y="30" fill="#fbbf24" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Inflection (no extremum)</text>
<path d="M370,170 Q400,120 440,115 Q480,110 510,60" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
<circle cx="440" cy="115" r="4" fill="#fbbf24"/>
<text x="440" y="200" fill="#fbbf24" font-family="monospace" font-size="10" text-anchor="middle">f'(x_0)=0, f'' changes</text>
</svg>
<div class="graph-caption">Three different things can happen where $f'(x_0)=0$. The sign of $f''$ — or the sign change of $f'$ — tells them apart.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Smooth interior min</div><div class="card-body">$f'(x_0) = 0$ and $f$ is locally bowl-shaped. The classical "bottom of the curve" point.</div><div class="card-formula">$f'(x_0)=0,\\ f''(x_0)\\ge 0$</div></div>
<div class="calc-card"><div class="card-title">Smooth interior max</div><div class="card-body">$f'(x_0) = 0$ and $f$ is locally cap-shaped. The "peak of the hill" point.</div><div class="card-formula">$f'(x_0)=0,\\ f''(x_0)\\le 0$</div></div>
<div class="calc-card"><div class="card-title">Corner / cusp</div><div class="card-body">The derivative does not exist, yet an extremum may still occur there. Classic example: $f(x) = |x|$ at $x = 0$ is a minimum.</div><div class="card-formula">$f'(x_0)$ undefined</div></div>
<div class="calc-card"><div class="card-title">Inflection at zero slope</div><div class="card-body">$f'(x_0) = 0$ but the function continues monotonically through $x_0$. Classic example: $f(x) = x^3$ at $0$.</div><div class="card-formula">$f''(x_0)=0$, sign unchanged</div></div>
</div>

<h2 class="l-title">3. The First-Derivative Test</h2>

<p class="l-text">The most direct way to classify a critical point is to inspect the sign of $f'$ on either side of it. If the slope changes from negative to positive as we cross $x_0$, then the function was decreasing on the left and increasing on the right — a local minimum. If the slope changes from positive to negative, the function was increasing then decreasing — a local maximum. If the sign does not change, the critical point is neither.</p>

<div class="calc-formula"><span class="formula-label">First-Derivative Test</span><div class="formula-main">$$\\begin{aligned} f' \\text{ goes } -\\to + \\text{ at } x_0 &\\implies \\text{local minimum}\\\\ f' \\text{ goes } +\\to - \\text{ at } x_0 &\\implies \\text{local maximum}\\\\ f' \\text{ keeps the same sign across } x_0 &\\implies \\text{no extremum} \\end{aligned}$$</div><div class="formula-sub">Equivalently: a local min is where the function changes from decreasing to increasing.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Solve $f'(x) = 0$</div><div class="step-detail">Find every critical point. Also note where $f'$ is undefined.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Build a sign chart for $f'$</div><div class="step-detail">Test a value of $f'$ on each interval determined by the critical points.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Classify each critical point by the sign change</div><div class="step-detail">$- \\to +$ is a local min, $+ \\to -$ is a local max, no change means it is neither.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body"><strong>Classify the critical points of $f(x) = x^3 - 3x$.</strong><br><br>
$f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$, so the critical points are $x = -1$ and $x = 1$.<br><br>
Sign chart for $f'$:
<ul style="margin:0.4rem 0 0.4rem 1.5rem">
<li>For $x &lt; -1$: $f'(-2) = 9 &gt; 0$</li>
<li>For $-1 &lt; x &lt; 1$: $f'(0) = -3 &lt; 0$</li>
<li>For $x &gt; 1$: $f'(2) = 9 &gt; 0$</li>
</ul>
At $x = -1$: $f'$ changes $+ \\to -$, so this is a <strong>local maximum</strong> with value $f(-1) = -1 + 3 = 2$.<br>
At $x = 1$: $f'$ changes $- \\to +$, so this is a <strong>local minimum</strong> with value $f(1) = 1 - 3 = -2$.</div></div>

<div class="calc-graph"><div class="graph-title">$f(x) = x^3 - 3x$: a cubic with one local max and one local min</div>
<div id="plot-cubic-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];for(var i=-220;i<=220;i++){var x=i/100;xs.push(x);ys.push(x*x*x-3*x);}
var tCurve={x:xs,y:ys,mode:"lines",name:"f(x) = x³ - 3x",line:{color:"#c8a96e",width:2.5}};
var tMax={x:[-1],y:[2],mode:"markers+text",name:"local max",marker:{size:11,color:"#f87171",symbol:"star"},text:["(-1, 2)"],textposition:"top center",textfont:{color:"#f87171"}};
var tMin={x:[1],y:[-2],mode:"markers+text",name:"local min",marker:{size:11,color:"#4ecdc4",symbol:"star"},text:["(1, -2)"],textposition:"bottom center",textfont:{color:"#4ecdc4"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-2.5,2.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-4,4]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-cubic-en",[tCurve,tMax,tMin],layout,{responsive:true,displayModeBar:false});
},150)</script>
<div class="graph-caption">The function increases up to $x = -1$, decreases between $-1$ and $1$, then increases again — exactly the pattern predicted by the sign chart.</div>
</div>

<h2 class="l-title">4. The Second-Derivative Test</h2>

<p class="l-text">When the second derivative is easy to compute, the second-derivative test is often quicker than building a sign chart. The idea is geometric: a critical point sits at the bottom of a bowl precisely when the function is concave up there, and at the top of a cap precisely when it is concave down. Concavity is measured by the sign of $f''$.</p>

<div class="calc-formula"><span class="formula-label">Second-Derivative Test</span><div class="formula-main">$$f'(x_0) = 0 \\text{ and } \\begin{cases} f''(x_0) &gt; 0 &\\implies x_0 \\text{ is a local minimum} \\\\ f''(x_0) &lt; 0 &\\implies x_0 \\text{ is a local maximum} \\\\ f''(x_0) = 0 &\\implies \\text{test is inconclusive} \\end{cases}$$</div><div class="formula-sub">The test fails when $f''(x_0) = 0$; fall back on the first-derivative test or higher derivatives.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body"><strong>Re-classify the critical points of $f(x) = x^3 - 3x$ using the second-derivative test.</strong><br><br>
We already have $f'(x) = 3x^2 - 3$ and critical points $x = \\pm 1$.<br>
Second derivative: $f''(x) = 6x$.<br><br>
At $x = -1$: $f''(-1) = -6 &lt; 0$, so $x = -1$ is a <strong>local maximum</strong>.<br>
At $x = 1$: $f''(1) = 6 &gt; 0$, so $x = 1$ is a <strong>local minimum</strong>.<br><br>
Same answer as before, obtained with less work.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 (test inconclusive)</div><div class="example-body"><strong>Classify the critical points of $f(x) = x^4$.</strong><br><br>
$f'(x) = 4x^3 = 0$ gives $x = 0$. Then $f''(x) = 12x^2$, so $f''(0) = 0$: the test is inconclusive.<br><br>
Fall back on the first-derivative test. For $x &lt; 0$, $f'(x) = 4x^3 &lt; 0$; for $x &gt; 0$, $f'(x) &gt; 0$. So $f'$ changes $- \\to +$ at $x = 0$, and $x = 0$ is a local (indeed global) <strong>minimum</strong> with value $f(0) = 0$.</div></div>

<div class="l-note"><strong>Why the test sometimes fails.</strong> The second-derivative test reads only one number, $f''(x_0)$. When that number is zero, the curvature at $x_0$ is degenerate and the local behaviour is determined by higher-order terms in the Taylor expansion. For $f(x) = x^4$, the first non-vanishing derivative at $0$ is $f^{(4)}(0) = 24 &gt; 0$, which (by the general $n$th-derivative test) confirms a minimum.</div>

<h2 class="l-title">5. Absolute Extrema on Closed Intervals</h2>

<p class="l-text">In applied problems the variable is usually constrained to a closed interval $[a, b]$ — a beam length is between $0$ and the available stock, a manufacturing run is between zero and capacity. The extreme value theorem guarantees that a continuous function on a closed bounded interval attains both its absolute maximum and absolute minimum. The recipe for finding them is finite and mechanical.</p>

<div class="calc-formula"><span class="formula-label">Closed-Interval Recipe</span><div class="formula-main">$$\\max_{x\\in[a,b]} f(x) \\text{ and } \\min_{x\\in[a,b]} f(x) \\text{ occur among the values } f(a),\\ f(b),\\ \\text{and } f(c) \\text{ for each critical point } c \\in (a,b).$$</div><div class="formula-sub">Compute every candidate value, then pick the largest and smallest.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Find all critical points $c$ inside $(a, b)$</div><div class="step-detail">Solve $f'(x) = 0$, and note points where $f'$ is undefined. Keep only those in the open interval.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Evaluate $f$ at each critical point and at the endpoints</div><div class="step-detail">Compute $f(a)$, $f(b)$, and $f(c)$ for every interior critical point $c$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Compare values</div><div class="step-detail">The largest is the absolute maximum, the smallest is the absolute minimum.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4</div><div class="example-body"><strong>Find the absolute extrema of $f(x) = x^3 - 3x$ on $[-2, 3]$.</strong><br><br>
Critical points (from earlier): $x = -1$ and $x = 1$, both inside the interval.<br><br>
Evaluate at the four candidates:
<ul style="margin:0.4rem 0 0.4rem 1.5rem">
<li>$f(-2) = -8 + 6 = -2$</li>
<li>$f(-1) = -1 + 3 = 2$</li>
<li>$f(1) = 1 - 3 = -2$</li>
<li>$f(3) = 27 - 9 = 18$</li>
</ul>
Absolute maximum: $f(3) = 18$, attained at the right endpoint.<br>
Absolute minimum: $f(-2) = f(1) = -2$, attained both at the left endpoint and at the interior critical point.<br><br>
Notice that the absolute maximum on this interval is <em>not</em> a critical point — it lives at the boundary. This is exactly why the endpoints must always be checked.</div></div>

<h2 class="l-title">6. Classical Optimization Problems</h2>

<p class="l-text">We now apply the machinery to a family of geometric and physical problems that has been the testing ground for optimization since the seventeenth century. The general strategy is invariant: identify the quantity to be optimised, express it as a function of a single variable using the given constraint, find critical points, and check that they yield a true extremum (often by the second-derivative test or by sign analysis at the boundary).</p>

<div class="calc-highlight"><strong>The four-step recipe.</strong> (1) Draw a picture and label every quantity. (2) Write the <em>objective function</em> $f$ to be optimised. (3) Use the constraint to reduce $f$ to a single variable, taking note of the natural domain. (4) Differentiate, solve, classify. The hardest step is almost always (1)–(2): the calculus itself is mechanical once the function is in place.</div>

<h3 style="color:#c8a96e;margin-top:1.5rem">6.1 Maximum area of a rectangle with fixed perimeter</h3>

<div class="calc-example"><div class="example-label">CLASSIC PROBLEM</div><div class="example-body"><strong>Among all rectangles with perimeter $P$, find the one of maximum area.</strong><br><br>
Let the rectangle have sides $x$ and $y$. The perimeter constraint is $2x + 2y = P$, so $y = \\tfrac{P}{2} - x$. The area is
$$A(x) = xy = x\\!\\left(\\tfrac{P}{2} - x\\right) = \\tfrac{P}{2} x - x^2, \\qquad x \\in [0, \\tfrac{P}{2}].$$
Then $A'(x) = \\tfrac{P}{2} - 2x = 0 \\Rightarrow x = \\tfrac{P}{4}$, and $A''(x) = -2 &lt; 0$, confirming a maximum.<br><br>
With $x = P/4$ we get $y = P/4$ as well, so the maximum-area rectangle is the <strong>square</strong>, with area $A_{\\max} = (P/4)^2 = P^2/16$. The endpoints $x = 0$ and $x = P/2$ both give $A = 0$, so the square is the unique optimum.</div></div>

<h3 style="color:#c8a96e;margin-top:1.5rem">6.2 Minimum surface area of a cylindrical can with fixed volume</h3>

<div class="calc-example"><div class="example-label">CLASSIC PROBLEM</div><div class="example-body"><strong>Find the dimensions of a closed cylindrical can of volume $V$ that uses the least metal (smallest surface area).</strong><br><br>
Let $r$ be the base radius and $h$ the height. The volume constraint is $\\pi r^2 h = V$, so $h = V/(\\pi r^2)$. The total surface area (two circular ends plus the side) is
$$S(r) = 2\\pi r^2 + 2\\pi r h = 2\\pi r^2 + 2\\pi r \\cdot \\frac{V}{\\pi r^2} = 2\\pi r^2 + \\frac{2V}{r}, \\qquad r &gt; 0.$$
Differentiating, $S'(r) = 4\\pi r - \\dfrac{2V}{r^2} = 0$, hence $4\\pi r^3 = 2V$, so
$$r^* = \\sqrt[3]{\\frac{V}{2\\pi}}, \\qquad h^* = \\frac{V}{\\pi {r^*}^2} = 2 r^*.$$
The second derivative $S''(r) = 4\\pi + 4V/r^3 &gt; 0$ confirms this is a minimum.<br><br>
The remarkable conclusion: the optimal can has <strong>height equal to its diameter</strong>, $h^* = 2 r^*$. Real soup cans deviate from this proportion only because of manufacturing, labelling, and stacking considerations — purely geometrically, the squat shape is optimal.</div></div>

<h3 style="color:#c8a96e;margin-top:1.5rem">6.3 Shortest distance from a point to a parabola</h3>

<div class="calc-example"><div class="example-label">CLASSIC PROBLEM</div><div class="example-body"><strong>Find the point on the parabola $y = x^2$ that is closest to the point $(3, 0)$.</strong><br><br>
A point on the parabola has coordinates $(x, x^2)$. Its distance to $(3, 0)$ is
$$D(x) = \\sqrt{(x - 3)^2 + x^4}.$$
Since the square root is monotone increasing on non-negative arguments, minimising $D$ is equivalent to minimising
$$g(x) = (x-3)^2 + x^4.$$
Then $g'(x) = 2(x-3) + 4x^3 = 4x^3 + 2x - 6$. Setting $g'(x) = 0$ gives $2x^3 + x - 3 = 0$. The factorisation $2x^3 + x - 3 = (x-1)(2x^2 + 2x + 3)$ shows $x = 1$ is the only real root (the quadratic factor has discriminant $4 - 24 &lt; 0$).<br><br>
Check: $g''(x) = 12x^2 + 2 &gt; 0$ everywhere, so $x = 1$ is the global minimum. The closest point on the parabola is $(1, 1)$, and the shortest distance is $\\sqrt{(1-3)^2 + 1^2} = \\sqrt{5}$.</div></div>

<h3 style="color:#c8a96e;margin-top:1.5rem">6.4 Maximum profit (economics)</h3>

<div class="calc-example"><div class="example-label">CLASSIC PROBLEM</div><div class="example-body"><strong>A firm produces $q$ units of a good. Its revenue is $R(q) = 100 q - q^2$ and its cost is $C(q) = 20 q + 50$. Find the production level that maximises profit.</strong><br><br>
Profit is the difference $\\Pi(q) = R(q) - C(q) = (100q - q^2) - (20q + 50) = -q^2 + 80q - 50$, valid for $q \\ge 0$.<br>
$\\Pi'(q) = -2q + 80 = 0 \\Rightarrow q^* = 40$. Since $\\Pi''(q) = -2 &lt; 0$, this is a maximum.<br><br>
Maximum profit: $\\Pi(40) = -1600 + 3200 - 50 = 1550$.<br><br>
The economist reads the condition $\\Pi'(q) = 0$ as <em>marginal revenue equals marginal cost</em>: $R'(q^*) = 100 - 2(40) = 20 = C'(q^*)$. This is the classical optimality principle for profit-maximising firms.</div></div>

<h2 class="l-title">7. Multivariate Optimization</h2>

<p class="l-text">When the objective depends on several variables $f(x, y)$, $f(x, y, z)$, or more, the one-variable derivative is replaced by the <strong>gradient</strong> $\\nabla f$, the vector of all first partial derivatives. A critical point is one where the gradient vanishes — at such a point the function is momentarily flat in every direction.</p>

<div class="calc-formula"><span class="formula-label">Critical Point in Several Variables</span><div class="formula-main">$$\\nabla f(\\mathbf{x}_0) = \\mathbf{0} \\iff \\frac{\\partial f}{\\partial x_1}(\\mathbf{x}_0) = \\frac{\\partial f}{\\partial x_2}(\\mathbf{x}_0) = \\cdots = \\frac{\\partial f}{\\partial x_n}(\\mathbf{x}_0) = 0$$</div><div class="formula-sub">Every interior local extremum of a differentiable multivariate function is a critical point — the higher-dimensional Fermat theorem.</div></div>

<p class="l-text">The geometric picture is unchanged: the tangent plane at an extremum must be horizontal. In two variables, locating the critical points reduces to solving a system of two equations in two unknowns: $f_x = 0$ and $f_y = 0$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5</div><div class="example-body"><strong>Find the critical points of $f(x, y) = x^2 + y^2 - 4x$.</strong><br><br>
Partial derivatives:
$$f_x = 2x - 4, \\qquad f_y = 2y.$$
Setting both to zero: $2x - 4 = 0$ gives $x = 2$, and $2y = 0$ gives $y = 0$. The only critical point is $(2, 0)$.<br><br>
A quick check rewrites the function as $f(x, y) = (x - 2)^2 + y^2 - 4$, the equation of a paraboloid translated so its vertex is at $(2, 0, -4)$. So $(2, 0)$ is the global minimum, with value $f(2, 0) = -4$.</div></div>

<h2 class="l-title">8. The Hessian and the 2D Second-Derivative Test</h2>

<p class="l-text">In two variables, classifying a critical point requires the matrix of all second partial derivatives — the <strong>Hessian</strong>. For $f(x, y)$ it is</p>

<div class="calc-formula"><span class="formula-label">Hessian Matrix</span><div class="formula-main">$$H f(x, y) = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}, \\qquad f_{xy} = f_{yx} \\text{ (by Clairaut, when continuous)}.$$</div><div class="formula-sub">The Hessian captures curvature in all directions, generalising $f''$ from one variable.</div></div>

<p class="l-text">The two-dimensional second-derivative test uses the determinant of the Hessian at the critical point, often denoted $D$:</p>

<div class="calc-formula"><span class="formula-label">2D Second-Derivative Test</span><div class="formula-main">$$D = \\det Hf(x_0, y_0) = f_{xx} f_{yy} - f_{xy}^2.$$</div><div class="formula-sub">At a critical point $(x_0, y_0)$ with $\\nabla f = \\mathbf{0}$:</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$D &gt; 0$ and $f_{xx} &gt; 0$</div><div class="card-body">Function is concave up in every direction. Local <strong>minimum</strong>.</div><div class="card-formula">bowl-shape</div></div>
<div class="calc-card"><div class="card-title">$D &gt; 0$ and $f_{xx} &lt; 0$</div><div class="card-body">Function is concave down in every direction. Local <strong>maximum</strong>.</div><div class="card-formula">cap-shape</div></div>
<div class="calc-card"><div class="card-title">$D &lt; 0$</div><div class="card-body">Function curves up in one direction and down in another. <strong>Saddle point</strong> — neither min nor max.</div><div class="card-formula">horse-saddle</div></div>
<div class="calc-card"><div class="card-title">$D = 0$</div><div class="card-body">Test is <strong>inconclusive</strong>. The Hessian is degenerate and the local behaviour depends on higher-order terms.</div><div class="card-formula">need more info</div></div>
</div>

<div class="l-note"><strong>Why the determinant?</strong> In a small neighbourhood, $f(x, y) \\approx f(x_0, y_0) + \\tfrac{1}{2} (\\Delta\\mathbf{x})^T H (\\Delta\\mathbf{x})$. The quadratic form $\\mathbf{u}^T H \\mathbf{u}$ is positive for all directions $\\mathbf{u}$ iff $H$ has two positive eigenvalues, which (for a $2\\times 2$ symmetric matrix) is equivalent to $\\det H &gt; 0$ together with $H_{11} = f_{xx} &gt; 0$. The same logic gives the conditions for a maximum (two negative eigenvalues) and for a saddle (one positive, one negative — giving negative determinant).</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6 (saddle point)</div><div class="example-body"><strong>Classify the critical points of $f(x, y) = x^3 - 3xy + y^3$.</strong><br><br>
First partials: $f_x = 3x^2 - 3y$, $f_y = -3x + 3y^2$. Setting both to zero,
$$3x^2 - 3y = 0 \\implies y = x^2, \\qquad -3x + 3y^2 = 0 \\implies x = y^2.$$
Substituting $y = x^2$ into $x = y^2$ gives $x = x^4$, i.e. $x(x^3 - 1) = 0$, so $x = 0$ or $x = 1$.<br><br>
Two critical points: $(0, 0)$ and $(1, 1)$.<br><br>
Second partials: $f_{xx} = 6x$, $f_{yy} = 6y$, $f_{xy} = -3$. So $D(x, y) = (6x)(6y) - (-3)^2 = 36 xy - 9$.<br><br>
At $(0, 0)$: $D = -9 &lt; 0 \\Rightarrow$ <strong>saddle point</strong>.<br>
At $(1, 1)$: $D = 36 - 9 = 27 &gt; 0$ and $f_{xx}(1,1) = 6 &gt; 0 \\Rightarrow$ <strong>local minimum</strong>, with value $f(1, 1) = 1 - 3 + 1 = -1$.</div></div>

<div class="calc-graph"><div class="graph-title">A saddle: $z = x^2 - y^2$ at the origin</div>
<div id="plot-saddle-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];var zs=[];var n=41;
for(var i=0;i<n;i++){var row=[];var xv=-2+4*i/(n-1);xs.push(xv);var rrow=[];for(var j=0;j<n;j++){var yv=-2+4*j/(n-1);if(i===0)ys.push(yv);row.push(xv*xv-yv*yv);}zs.push(row);}
var data=[{type:"surface",x:xs,y:ys,z:zs,colorscale:[[0,"#3b82f6"],[0.5,"#c8a96e"],[1,"#f87171"]],showscale:false}];
var layout={paper_bgcolor:"rgba(0,0,0,0)",scene:{xaxis:{title:"x",gridcolor:"rgba(255,255,255,0.1)",color:"#ebe6dc"},yaxis:{title:"y",gridcolor:"rgba(255,255,255,0.1)",color:"#ebe6dc"},zaxis:{title:"z = x² - y²",gridcolor:"rgba(255,255,255,0.1)",color:"#ebe6dc"},bgcolor:"rgba(0,0,0,0)"},margin:{t:20,r:0,b:0,l:0},font:{color:"#ebe6dc"}};
Plotly.newPlot("plot-saddle-en",data,layout,{responsive:true,displayModeBar:false});
},250)</script>
<div class="graph-caption">For $f(x,y) = x^2 - y^2$, the origin is a critical point with $D = (2)(-2) - 0 = -4 &lt; 0$. The surface goes up in the $x$ direction and down in the $y$ direction — a textbook saddle.</div>
</div>

<h2 class="l-title">9. Klasik Alıştırmalar (Classical Exercises)</h2>

<p class="l-text">Work through these by hand to consolidate the methods of this lesson.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Exercise 1</div><div class="card-body">Find and classify the critical points of $f(x) = x^3 - 3x$. Verify both the first- and second-derivative tests give the same answer.</div><div class="card-formula">Answer: max at $x=-1$, min at $x=1$.</div></div>
<div class="calc-card"><div class="card-title">Exercise 2</div><div class="card-body">Find the absolute extrema of $f(x) = x^3 - 12x + 5$ on the closed interval $[-3, 3]$.</div><div class="card-formula">Answer: max $f(-2) = 21$; min $f(2) = -11$.</div></div>
<div class="calc-card"><div class="card-title">Exercise 3</div><div class="card-body">Among all rectangles with perimeter 100, find the one of maximum area.</div><div class="card-formula">Answer: $25 \\times 25$ square, area $625$.</div></div>
<div class="calc-card"><div class="card-title">Exercise 4</div><div class="card-body">A rectangular box (open top) is to be built with volume 32 m³. The base is square. Find the dimensions that minimise the total material used (base + 4 sides).</div><div class="card-formula">Answer: base $4\\times 4$ m, height 2 m.</div></div>
<div class="calc-card"><div class="card-title">Exercise 5</div><div class="card-body">Minimise $f(x, y) = x^2 + y^2 - 4x$. Find the critical point and classify it with the Hessian test.</div><div class="card-formula">Answer: min at $(2, 0)$, value $-4$.</div></div>
<div class="calc-card"><div class="card-title">Exercise 6</div><div class="card-body">Classify the critical points of $f(x, y) = x^3 - 3xy + y^3$ using $D = f_{xx}f_{yy} - f_{xy}^2$.</div><div class="card-formula">Answer: saddle at $(0,0)$, local min at $(1,1)$.</div></div>
<div class="calc-card"><div class="card-title">Exercise 7 (Pythagoras-style)</div><div class="card-body">A wire of length $L$ is bent into a right triangle with legs $x$ and $y$. Find the legs that maximise the area.</div><div class="card-formula">Answer: isoceles right triangle, $x = y = L(2-\\sqrt{2})/2$.</div></div>
<div class="calc-card"><div class="card-title">Exercise 8</div><div class="card-body">A firm's profit is $\\Pi(q) = -q^2 + 80q - 50$. Find the production level $q$ that maximises profit, and verify that marginal revenue equals marginal cost there.</div><div class="card-formula">Answer: $q^* = 40$, $\\Pi^* = 1550$.</div></div>
</div>

<div class="calc-highlight"><strong>Lesson summary.</strong> Optimization in one variable is governed by Fermat's theorem (extrema sit at critical points), the first- and second-derivative tests (which classify those critical points), and the closed-interval recipe (which adds endpoints to the list of candidates). The same logic extends to several variables: critical points solve $\\nabla f = \\mathbf{0}$, and the Hessian determinant $D = f_{xx}f_{yy} - f_{xy}^2$ classifies them as local minima, local maxima, or saddle points. Every classical optimization problem — maximum area, minimum surface area, optimal profit, shortest distance — reduces to applying this small set of tools to a function chosen carefully from the geometry of the problem.</div>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Optimizasyon</strong>, herhangi bir nicelige sorulabilecek en sade pratik soruyu cevaplayan matematik daldir: <em>en buyuk degeri nedir, en kucuk degeri nedir?</em> Bir ciftci, sabit uzunlukta bir telle en buyuk alani cevreleyen dikdortgen tarlayi sorar. Bir uretici, sabit hacimli silindirik bir kutuyu en az metalle yapmanin yolunu sorar. Bir muhendis, belirli yuk altinda en az sehim yapan kirisin yuksekligini sorar. Bir iktisatci, kari maksimize eden uretim duzeyini sorar. Her durumda cevap tek bir matematiksel mekanizmadan gelir: turevin sifirlandigi noktalari bul, bu noktalari siniflandir ve sinirlari kontrol et.</p>

<p class="l-text">Bu derste o mekanizmayi sifirdan kuracagiz. Tek degiskenli bir fonksiyonda kritik noktanin geometrik anlamiyla baslayip birinci ve ikinci turev testlerini kanitlayip uygulayacak, kapali araliklar uzerinde mutlak ekstremumlari bulacak, iki yuzyildir kalkulus kitaplarini susleyen klasik optimizasyon problemlerinin bir avucunu cozecek ve son olarak tum bu makineyi gradyan ve Hessian aracilgiyla cok degiskene tasiyacagiz. Iki boyutlu ikinci turev testi, minimumu, maksimumu ve eyer noktasini sadece 2x2 bir determinanta bakarak ayirt etmemizi saglayacak.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE OGRENECEKSIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tek degiskenli fonksiyonun kritik noktasini tanimlamayi ve geometrik anlamini aciklamayi</li>
<li>Birinci turev testini $f'(x)$ isaret degisimi araciligiyla yerel ekstremumlari siniflandirmak icin uygulamayi</li>
<li>Ikinci turev testini $f''(x_0)$ isaretiyle uygulamayi ve testin sonucsuz kaldigi durumu tanimayi</li>
<li>Surekli bir fonksiyonun kapali aralikta mutlak ekstremumlarini kritik noktalar ve sinir degerlerinin birlikte degerlendirilmesiyle bulmayi</li>
<li>Klasik optimizasyon problemlerini kurup cozmeyi: sabit cevreli en buyuk alan, sabit hacimli en kucuk yuzey alani, en yuksek kar, bir noktadan egriye en kisa mesafe</li>
<li>Cok degiskenli duruma genellestirmeyi: $\\nabla f = \\mathbf{0}$ olan kritik noktalari bulmayi</li>
<li>Hessian determinanti $D = f_{xx} f_{yy} - f_{xy}^2$ ile iki degiskenli kritik noktalari yerel minimum, yerel maksimum veya eyer noktasi olarak siniflandirmayi</li>
</ul>
</div>

<h2 class="l-title">1. Niye Optimizasyon?</h2>

<p class="l-text">Optimizasyon problemleri her yerdedir, cunku <em>herhangi</em> bir nicel amac "bu cikti olabildigince buyuk olsun" ya da "olabildigince kucuk olsun" diye ifade edilebilir. Matematiksel kurulum hep aynidir: gercek degerli bir <strong>amac fonksiyonu</strong> $f$ verilmistir, belki bir kisitla birlikte, ve gorev $f$'in en buyuk veya en kucuk degerlerine ulastigi noktalari bulmaktir.</p>

<div class="calc-highlight"><strong>Temel gozlem.</strong> $f$ turevlenebilir ve ic bir nokta $x_0$'da yerel ekstremum aliyorsa, $x_0$'daki teget dogru yatay olmak zorundadir: $f'(x_0) = 0$. Aksi halde biraz yokus yukari yonde hareket eder ve daha buyuk bir deger bulurduk, bu da ekstremum varsayimimizla celisirdi. Bu tek gozlem — <em>Fermat teoremi</em> olarak bilinir — surekli bir arama problemini cebirsel bir probleme indirger: $f'(x) = 0$'i coz.</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Minimizasyon</div>
<div class="compare-item">&bull; $f(x)$'i en kucuk yapan $x$'i bul</div>
<div class="compare-item">&bull; "En kucuk yuzey alani", "en az maliyet"</div>
<div class="compare-item">&bull; Ic minimumda $f''(x_0) \\ge 0$ (icbukey yukari)</div>
<div class="compare-item">&bull; Cogu zaman bir kisit altinda (hacim, cevre)</div></div>
<div class="compare-col"><div class="compare-title">Maksimizasyon</div>
<div class="compare-item">&bull; $f(x)$'i en buyuk yapan $x$'i bul</div>
<div class="compare-item">&bull; "En buyuk alan", "en yuksek kar"</div>
<div class="compare-item">&bull; Ic maksimumda $f''(x_0) \\le 0$ (icbukey asagi)</div>
<div class="compare-item">&bull; $-f(x)$'i minimize etmeye esdegerdir</div></div>
</div>

<div class="calc-formula"><span class="formula-label">Fermat Teoremi (Ic Ekstremum)</span><div class="formula-main">$$f \\text{ ic yerel ekstremum } x_0\\text{'da turevlenebilirse, } f'(x_0) = 0.$$</div><div class="formula-sub">Karsiti yanlistir: $f'(x_0) = 0$ ekstremumu ima etmez, ornegin $f(x) = x^3$ icin $x_0 = 0$.</div></div>

<p class="l-text">Fermat teoremine iki onemli uyari eslik eder. Birincisi, teorem tek yonludur: <em>her</em> ic ekstremum bir kritik noktadir, ama her kritik nokta bir ekstremum degildir. Kubik $f(x) = x^3$ icin $f'(0) = 0$'dir, fakat $x = 0$ ne minimum ne de maksimumdur — bir donum (inflection) noktasidir. Karar verebilmek icin ek testlere ihtiyacimiz olacak. Ikincisi, teorem yalnizca turevlenebilir bir fonksiyonun <em>ic</em> noktalarinda gecerlidir. Ekstremumlar kapali bir araligin uc noktalarinda veya turevin tanimsiz oldugu noktalarda da (koseler, yumrular) bulunabilir. Bu durumlari mutlak ekstremumlardan bahsederken acikca ele alacagiz.</p>

<div class="think-box"><div class="think-label">DUSUN BUNU</div><div class="think-body">Bir fonksiyon $f$ kapali sinirli bir aralikta $[a, b]$ surekliyse, <em>ekstrem deger teoremi</em> $f$'in bu aralikta hem maksimumunu hem de minimumunu ulasacagini garanti eder. Bu noktalar ya $f'(x) = 0$ olan yerlerde, ya $a$ veya $b$ uc noktalarinda, ya da $f'$'in tanimsiz oldugu bir noktada olmak zorundadir. Yani sonlu bir kontrol listesi tum adaylari tuketir.</div></div>

<h2 class="l-title">2. Kritik Noktalar ve Yerel Ekstremumlar</h2>

<p class="l-text">$f$ acik bir aralikta tanimli gercek degerli bir fonksiyon olsun. $f$'in $x_0$'da <strong>yerel maksimumu</strong> oldugunu soyleriz; eger $x_0$'in bir komsulugundaki her $x$ icin $f(x_0) \\ge f(x)$ ise. <strong>Yerel minimum</strong> ise bir komsulukta $f(x_0) \\le f(x)$ olmasi demektir. $f$'in bir <strong>kritik noktasi</strong>, tanim kumesinde $f'(x_0) = 0$ veya $f'(x_0)$ tanimsiz olan bir $x_0$ noktasidir.</p>

<div class="calc-formula"><span class="formula-label">Kritik Nokta</span><div class="formula-main">$$x_0 \\text{ kritik noktadir} \\iff f'(x_0) = 0 \\text{ ya da } f'(x_0) \\text{ tanimsizdir}$$</div><div class="formula-sub">Fermat teoremi her ic yerel ekstremumun bir kritik nokta oldugunu soyler — yani kritik noktalar tek adaylardir.</div></div>

<p class="l-text">Akilda tutulmasi gereken uc klasik gorsel sudur: duzgun bir cukur, $f'$'in negatiften pozitife dondugu (yerel minimum); duzgun bir tepe, $f'$'in pozitiften negatife dondugu (yerel maksimum); ve donum platosu, $f'$'in anlik sifirlandigi fakat isaret degistirmedigi (ekstremum yok). Kubik $f(x) = x^3$ ucuncu durumun ders kitabi orneklemesidir — $x = 0$'da egim sifirdir, ama fonksiyon noktadan gecerken artmaya devam eder.</p>

<div class="calc-graph"><div class="graph-title">Uc Kritik Nokta Davranisi</div>
<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg">
<line x1="30" y1="180" x2="510" y2="180" stroke="rgba(255,255,255,.15)"/>
<text x="100" y="30" fill="#4ecdc4" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Yerel minimum</text>
<path d="M30,50 Q100,200 170,50" fill="none" stroke="#4ecdc4" stroke-width="2.5"/>
<circle cx="100" cy="155" r="4" fill="#4ecdc4"/>
<text x="100" y="200" fill="#4ecdc4" font-family="monospace" font-size="10" text-anchor="middle">f'(x_0)=0, f''&gt;0</text>
<text x="270" y="30" fill="#f87171" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Yerel maksimum</text>
<path d="M200,180 Q270,30 340,180" fill="none" stroke="#f87171" stroke-width="2.5"/>
<circle cx="270" cy="75" r="4" fill="#f87171"/>
<text x="270" y="200" fill="#f87171" font-family="monospace" font-size="10" text-anchor="middle">f'(x_0)=0, f''&lt;0</text>
<text x="440" y="30" fill="#fbbf24" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Donum (ekstremum yok)</text>
<path d="M370,170 Q400,120 440,115 Q480,110 510,60" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
<circle cx="440" cy="115" r="4" fill="#fbbf24"/>
<text x="440" y="200" fill="#fbbf24" font-family="monospace" font-size="10" text-anchor="middle">f'(x_0)=0, f'' isaret degisimi</text>
</svg>
<div class="graph-caption">$f'(x_0)=0$ olan yerde uc farkli sey olabilir. $f''$'in isareti — ya da $f'$'in isaret degisimi — bunlari birbirinden ayirir.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Duzgun ic minimum</div><div class="card-body">$f'(x_0) = 0$ ve $f$ yerel olarak cukur bicimindedir. Klasik "egrinin dibi" noktasi.</div><div class="card-formula">$f'(x_0)=0,\\ f''(x_0)\\ge 0$</div></div>
<div class="calc-card"><div class="card-title">Duzgun ic maksimum</div><div class="card-body">$f'(x_0) = 0$ ve $f$ yerel olarak tepe bicimindedir. "Dagin zirvesi" noktasi.</div><div class="card-formula">$f'(x_0)=0,\\ f''(x_0)\\le 0$</div></div>
<div class="calc-card"><div class="card-title">Kose ya da yumru</div><div class="card-body">Turev tanimsizdir fakat orada bir ekstremum yine de olabilir. Klasik ornek: $f(x) = |x|$ icin $x = 0$ minimumdur.</div><div class="card-formula">$f'(x_0)$ tanimsiz</div></div>
<div class="calc-card"><div class="card-title">Sifir egimde donum</div><div class="card-body">$f'(x_0) = 0$'dir ama fonksiyon $x_0$'dan monoton gecer. Klasik ornek: $f(x) = x^3$ icin $0$.</div><div class="card-formula">$f''(x_0)=0$, isaret degismez</div></div>
</div>

<h2 class="l-title">3. Birinci Turev Testi</h2>

<p class="l-text">Bir kritik noktayi siniflandirmanin en dogrudan yolu, $f'$'in iki yanindaki isaretini incelemektir. $x_0$'i gecerken egim negatiften pozitife donerse, fonksiyon solunda azaliyordu ve saginda artiyor — yerel minimum. Egim pozitiften negatife donerse, fonksiyon artiyordu sonra azaldi — yerel maksimum. Isaret degismezse kritik nokta ne minimumdur ne de maksimum.</p>

<div class="calc-formula"><span class="formula-label">Birinci Turev Testi</span><div class="formula-main">$$\\begin{aligned} f' \\text{ } x_0\\text{'da } -\\to + &\\implies \\text{yerel minimum}\\\\ f' \\text{ } x_0\\text{'da } +\\to - &\\implies \\text{yerel maksimum}\\\\ f' \\text{ } x_0\\text{'da isaret degistirmezse} &\\implies \\text{ekstremum yok} \\end{aligned}$$</div><div class="formula-sub">Esdeger soylem: yerel minimum, fonksiyonun azalmaktan artmaya gectigi noktadir.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$f'(x) = 0$'i coz</div><div class="step-detail">Tum kritik noktalari bul. Ayrica $f'$'in tanimsiz oldugu noktalari da kaydet.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$f'$ icin isaret tablosu kur</div><div class="step-detail">Kritik noktalar tarafindan belirlenen her aralikta $f'$'in bir test degerini hesapla.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Her kritik noktayi isaret degisimine gore siniflandir</div><div class="step-detail">$- \\to +$ yerel minimumdur, $+ \\to -$ yerel maksimumdur, isaret degismezse ekstremum yoktur.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK 1</div><div class="example-body"><strong>$f(x) = x^3 - 3x$'in kritik noktalarini siniflandir.</strong><br><br>
$f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$, dolayisiyla kritik noktalar $x = -1$ ve $x = 1$'dir.<br><br>
$f'$ icin isaret tablosu:
<ul style="margin:0.4rem 0 0.4rem 1.5rem">
<li>$x &lt; -1$ icin: $f'(-2) = 9 &gt; 0$</li>
<li>$-1 &lt; x &lt; 1$ icin: $f'(0) = -3 &lt; 0$</li>
<li>$x &gt; 1$ icin: $f'(2) = 9 &gt; 0$</li>
</ul>
$x = -1$'de: $f'$ $+ \\to -$ doner, bu bir <strong>yerel maksimum</strong> ve degeri $f(-1) = -1 + 3 = 2$.<br>
$x = 1$'de: $f'$ $- \\to +$ doner, bu bir <strong>yerel minimum</strong> ve degeri $f(1) = 1 - 3 = -2$.</div></div>

<div class="calc-graph"><div class="graph-title">$f(x) = x^3 - 3x$: bir yerel max ve bir yerel min iceren kubik</div>
<div id="plot-cubic-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];for(var i=-220;i<=220;i++){var x=i/100;xs.push(x);ys.push(x*x*x-3*x);}
var tCurve={x:xs,y:ys,mode:"lines",name:"f(x) = x³ - 3x",line:{color:"#c8a96e",width:2.5}};
var tMax={x:[-1],y:[2],mode:"markers+text",name:"yerel max",marker:{size:11,color:"#f87171",symbol:"star"},text:["(-1, 2)"],textposition:"top center",textfont:{color:"#f87171"}};
var tMin={x:[1],y:[-2],mode:"markers+text",name:"yerel min",marker:{size:11,color:"#4ecdc4",symbol:"star"},text:["(1, -2)"],textposition:"bottom center",textfont:{color:"#4ecdc4"}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-2.5,2.5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[-4,4]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};
Plotly.newPlot("plot-cubic-tr",[tCurve,tMax,tMin],layout,{responsive:true,displayModeBar:false});
},150)</script>
<div class="graph-caption">Fonksiyon $x = -1$'e kadar artar, $-1$ ile $1$ arasinda azalir, sonra tekrar artar — isaret tablosunun ongordugu desen.</div>
</div>

<h2 class="l-title">4. Ikinci Turev Testi</h2>

<p class="l-text">Ikinci turevi kolay hesaplandiginda, ikinci turev testi cogu zaman isaret tablosundan hizlidir. Fikir geometriktir: bir kritik nokta yalnizca fonksiyon orada icbukey yukari ise bir cukurun dibinde, yalnizca icbukey asagi ise bir tepenin ustundedir. Icbukeylik $f''$'in isaretiyle olculur.</p>

<div class="calc-formula"><span class="formula-label">Ikinci Turev Testi</span><div class="formula-main">$$f'(x_0) = 0 \\text{ ve } \\begin{cases} f''(x_0) &gt; 0 &\\implies x_0 \\text{ yerel minimum} \\\\ f''(x_0) &lt; 0 &\\implies x_0 \\text{ yerel maksimum} \\\\ f''(x_0) = 0 &\\implies \\text{test sonucsuz} \\end{cases}$$</div><div class="formula-sub">$f''(x_0) = 0$ oldugunda test basarisiz olur; birinci turev testine veya daha yuksek turevlere donun.</div></div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK 2</div><div class="example-body"><strong>$f(x) = x^3 - 3x$'in kritik noktalarini ikinci turev testi ile yeniden siniflandir.</strong><br><br>
Zaten $f'(x) = 3x^2 - 3$ ve kritik noktalar $x = \\pm 1$.<br>
Ikinci turev: $f''(x) = 6x$.<br><br>
$x = -1$'de: $f''(-1) = -6 &lt; 0$, dolayisiyla $x = -1$ <strong>yerel maksimumdur</strong>.<br>
$x = 1$'de: $f''(1) = 6 &gt; 0$, dolayisiyla $x = 1$ <strong>yerel minimumdur</strong>.<br><br>
Daha once gibi ayni cevap, daha az is ile elde edildi.</div></div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK 3 (test sonucsuz)</div><div class="example-body"><strong>$f(x) = x^4$'un kritik noktalarini siniflandir.</strong><br><br>
$f'(x) = 4x^3 = 0$ verir $x = 0$. Sonra $f''(x) = 12x^2$, dolayisiyla $f''(0) = 0$: test sonucsuzdur.<br><br>
Birinci turev testine don. $x &lt; 0$ icin $f'(x) = 4x^3 &lt; 0$; $x &gt; 0$ icin $f'(x) &gt; 0$. Dolayisiyla $f'$ $x = 0$'da $- \\to +$ doner ve $x = 0$ yerel (aslinda global) <strong>minimumdur</strong>, degeri $f(0) = 0$.</div></div>

<div class="l-note"><strong>Test niye bazen basarisiz olur.</strong> Ikinci turev testi yalnizca bir sayi okur: $f''(x_0)$. Bu sayi sifir oldugunda $x_0$'daki egrilik dejenere olur ve yerel davranis Taylor aciliminin daha yuksek mertebeli terimleriyle belirlenir. $f(x) = x^4$ icin $0$'da sifirlanmayan ilk turev $f^{(4)}(0) = 24 &gt; 0$'dir, bu da (genel $n$inci turev testi araciligiyla) minimumu dogrular.</div>

<h2 class="l-title">5. Kapali Araliklar Uzerinde Mutlak Ekstremumlar</h2>

<p class="l-text">Uygulamali problemlerde degisken cogu zaman kapali bir araliga $[a, b]$ sinirlandirilir — bir kirisin uzunlugu 0 ile mevcut stok arasindadir, bir uretim turu sifir ile kapasite arasindadir. Ekstrem deger teoremi, kapali sinirli aralikta surekli bir fonksiyonun hem mutlak maksimumuna hem mutlak minimumuna ulastigini garanti eder. Bunlari bulma yontemi sonlu ve mekaniktir.</p>

<div class="calc-formula"><span class="formula-label">Kapali Aralik Yontemi</span><div class="formula-main">$$\\max_{x\\in[a,b]} f(x) \\text{ ve } \\min_{x\\in[a,b]} f(x) \\text{ degerleri } f(a),\\ f(b),\\ \\text{ve her kritik nokta } c \\in (a,b) \\text{ icin } f(c) \\text{ arasindadir.}$$</div><div class="formula-sub">Tum aday degerleri hesapla, sonra en buyugunu ve en kucugunu sec.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$(a, b)$'nin icindeki tum kritik noktalari $c$'yi bul</div><div class="step-detail">$f'(x) = 0$'i coz ve $f'$'in tanimsiz oldugu noktalari kaydet. Yalnizca acik aralik icinde olanlari tut.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$f$'i her kritik noktada ve uc noktalarda hesapla</div><div class="step-detail">$f(a)$, $f(b)$ ve her ic kritik nokta $c$ icin $f(c)$'yi hesapla.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Degerleri karsilastir</div><div class="step-detail">En buyugu mutlak maksimum, en kucugu mutlak minimumdur.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK 4</div><div class="example-body"><strong>$f(x) = x^3 - 3x$'in $[-2, 3]$ uzerindeki mutlak ekstremumlarini bul.</strong><br><br>
Kritik noktalar (oncekinden): $x = -1$ ve $x = 1$, ikisi de aralik icinde.<br><br>
Dort adayda hesapla:
<ul style="margin:0.4rem 0 0.4rem 1.5rem">
<li>$f(-2) = -8 + 6 = -2$</li>
<li>$f(-1) = -1 + 3 = 2$</li>
<li>$f(1) = 1 - 3 = -2$</li>
<li>$f(3) = 27 - 9 = 18$</li>
</ul>
Mutlak maksimum: $f(3) = 18$, sag uc noktada.<br>
Mutlak minimum: $f(-2) = f(1) = -2$, hem sol uc noktada hem ic kritik noktada.<br><br>
Dikkat: bu aralikta mutlak maksimum bir kritik nokta <em>degildir</em> — sinirda yasar. Uc noktalarin mutlaka kontrol edilmesi gereken sebep tam da budur.</div></div>

<h2 class="l-title">6. Klasik Optimizasyon Problemleri</h2>

<p class="l-text">Makineyi simdi onyedinci yuzyildan bu yana optimizasyonun deneme alani olmus bir geometrik ve fiziksel problem ailesine uyguluyoruz. Genel strateji degismez: optimize edilecek niceligi belirle, verilen kisiti kullanarak onu tek degiskenli bir fonksiyon olarak yaz, kritik noktalari bul ve bunlarin gercek bir ekstremum verdigini dogrula (cogu zaman ikinci turev testi veya sinirdaki isaret cozumlemesiyle).</p>

<div class="calc-highlight"><strong>Dort adimli yontem.</strong> (1) Bir resim ciz ve her niceligi etiketle. (2) Optimize edilecek <em>amac fonksiyonunu</em> $f$ yaz. (3) Kisiti kullanarak $f$'i tek bir degiskene indirge, dogal tanim kumesine dikkat et. (4) Turev al, coz, siniflandir. En zor adim neredeyse her zaman (1)-(2)'dir: fonksiyon yerine konulduktan sonra kalkulus mekaniktir.</div>

<h3 style="color:#c8a96e;margin-top:1.5rem">6.1 Sabit cevreli dikdortgenin en buyuk alani</h3>

<div class="calc-example"><div class="example-label">KLASIK PROBLEM</div><div class="example-body"><strong>Cevresi $P$ olan tum dikdortgenler arasinda alani en buyuk olani bul.</strong><br><br>
Dikdortgenin kenarlari $x$ ve $y$ olsun. Cevre kisiti $2x + 2y = P$'dir, dolayisiyla $y = \\tfrac{P}{2} - x$. Alan
$$A(x) = xy = x\\!\\left(\\tfrac{P}{2} - x\\right) = \\tfrac{P}{2} x - x^2, \\qquad x \\in [0, \\tfrac{P}{2}].$$
Sonra $A'(x) = \\tfrac{P}{2} - 2x = 0 \\Rightarrow x = \\tfrac{P}{4}$ ve $A''(x) = -2 &lt; 0$, maksimumu dogrular.<br><br>
$x = P/4$ ile $y = P/4$ de elde edilir, yani en buyuk alanli dikdortgen bir <strong>karedir</strong>, alani $A_{\\max} = (P/4)^2 = P^2/16$. Uc noktalar $x = 0$ ve $x = P/2$ her ikisi de $A = 0$ verir, kare tek optimumdur.</div></div>

<h3 style="color:#c8a96e;margin-top:1.5rem">6.2 Sabit hacimli silindirik bir kutunun en kucuk yuzey alani</h3>

<div class="calc-example"><div class="example-label">KLASIK PROBLEM</div><div class="example-body"><strong>En az metal kullanan (en kucuk yuzey alanli) hacmi $V$ olan kapali bir silindirik kutunun boyutlarini bul.</strong><br><br>
Taban yaricapi $r$, yukseklik $h$ olsun. Hacim kisiti $\\pi r^2 h = V$, dolayisiyla $h = V/(\\pi r^2)$. Toplam yuzey alani (iki dairesel kapak arti yan)
$$S(r) = 2\\pi r^2 + 2\\pi r h = 2\\pi r^2 + 2\\pi r \\cdot \\frac{V}{\\pi r^2} = 2\\pi r^2 + \\frac{2V}{r}, \\qquad r &gt; 0.$$
Turev: $S'(r) = 4\\pi r - \\dfrac{2V}{r^2} = 0$, dolayisiyla $4\\pi r^3 = 2V$, yani
$$r^* = \\sqrt[3]{\\frac{V}{2\\pi}}, \\qquad h^* = \\frac{V}{\\pi {r^*}^2} = 2 r^*.$$
Ikinci turev $S''(r) = 4\\pi + 4V/r^3 &gt; 0$ minimumu dogrular.<br><br>
Carpici sonuc: optimum kutu <strong>capi yuksekligine esit</strong> bir kutudur, $h^* = 2 r^*$. Gercek konserve kutular bu orandan yalnizca uretim, etiketleme ve istiflenme nedenleriyle sapar — saf geometrik olarak basik bicim optimumdur.</div></div>

<h3 style="color:#c8a96e;margin-top:1.5rem">6.3 Bir paraboldan bir noktaya en kisa mesafe</h3>

<div class="calc-example"><div class="example-label">KLASIK PROBLEM</div><div class="example-body"><strong>$(3, 0)$ noktasina en yakin $y = x^2$ parabolu uzerindeki noktayi bul.</strong><br><br>
Parabol uzerindeki bir nokta $(x, x^2)$ koordinatlarina sahiptir. $(3, 0)$'a uzakligi
$$D(x) = \\sqrt{(x - 3)^2 + x^4}.$$
Karekok negatif olmayan argumanlarda monoton arttigi icin $D$'yi minimize etmek
$$g(x) = (x-3)^2 + x^4$$
minimize etmeye esdegerdir. Sonra $g'(x) = 2(x-3) + 4x^3 = 4x^3 + 2x - 6$. $g'(x) = 0$'in cozumu $2x^3 + x - 3 = 0$'i verir. Carpanlara ayirma $2x^3 + x - 3 = (x-1)(2x^2 + 2x + 3)$ $x = 1$'in tek gercek kok oldugunu gosterir (kuadratik faktorun diskriminanti $4 - 24 &lt; 0$).<br><br>
Kontrol: $g''(x) = 12x^2 + 2 &gt; 0$ her yerde, dolayisiyla $x = 1$ global minimumdur. Paroboldeki en yakin nokta $(1, 1)$'dir ve en kisa mesafe $\\sqrt{(1-3)^2 + 1^2} = \\sqrt{5}$.</div></div>

<h3 style="color:#c8a96e;margin-top:1.5rem">6.4 En yuksek kar (iktisat)</h3>

<div class="calc-example"><div class="example-label">KLASIK PROBLEM</div><div class="example-body"><strong>Bir firma $q$ birim mal uretir. Geliri $R(q) = 100 q - q^2$ ve maliyeti $C(q) = 20 q + 50$. Kari maksimize eden uretim duzeyini bul.</strong><br><br>
Kar farktir: $\\Pi(q) = R(q) - C(q) = (100q - q^2) - (20q + 50) = -q^2 + 80q - 50$, $q \\ge 0$ icin gecerli.<br>
$\\Pi'(q) = -2q + 80 = 0 \\Rightarrow q^* = 40$. $\\Pi''(q) = -2 &lt; 0$ oldugundan bu maksimumdur.<br><br>
Maksimum kar: $\\Pi(40) = -1600 + 3200 - 50 = 1550$.<br><br>
Iktisatci $\\Pi'(q) = 0$ kosulunu <em>marjinal gelir marjinal maliyete esittir</em> diye okur: $R'(q^*) = 100 - 2(40) = 20 = C'(q^*)$. Bu kari maksimize eden firmalar icin klasik optimalite ilkesidir.</div></div>

<h2 class="l-title">7. Cok Degiskenli Optimizasyon</h2>

<p class="l-text">Amac fonksiyonu birden cok degiskene baglandiginda — $f(x, y)$, $f(x, y, z)$ veya daha fazla — tek degiskenli turev yerini <strong>gradyana</strong> $\\nabla f$ birakir; bu vektor butun birinci kismi turevleri icerir. Bir kritik nokta gradyanin sifirlandigi noktadir — boyle bir noktada fonksiyon her yonde anlik duzdur.</p>

<div class="calc-formula"><span class="formula-label">Cok Degiskenli Kritik Nokta</span><div class="formula-main">$$\\nabla f(\\mathbf{x}_0) = \\mathbf{0} \\iff \\frac{\\partial f}{\\partial x_1}(\\mathbf{x}_0) = \\frac{\\partial f}{\\partial x_2}(\\mathbf{x}_0) = \\cdots = \\frac{\\partial f}{\\partial x_n}(\\mathbf{x}_0) = 0$$</div><div class="formula-sub">Turevlenebilir cok degiskenli bir fonksiyonun her ic yerel ekstremumu bir kritik noktadir — yuksek boyutlu Fermat teoremi.</div></div>

<p class="l-text">Geometrik resim degismez: ekstremumdaki teget duzlem yatay olmak zorundadir. Iki degiskende kritik noktalari bulmak iki bilinmeyenli iki denklemlik bir sistemi cozmeye indirgenir: $f_x = 0$ ve $f_y = 0$.</p>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK 5</div><div class="example-body"><strong>$f(x, y) = x^2 + y^2 - 4x$'in kritik noktalarini bul.</strong><br><br>
Kismi turevler:
$$f_x = 2x - 4, \\qquad f_y = 2y.$$
Her ikisini sifira esitle: $2x - 4 = 0$ verir $x = 2$, $2y = 0$ verir $y = 0$. Tek kritik nokta $(2, 0)$'dir.<br><br>
Hizli kontrol fonksiyonu $f(x, y) = (x - 2)^2 + y^2 - 4$ olarak yeniden yazar, bu da $(2, 0, -4)$'te tepe noktasi olan bir paraboloid denklemidir. Dolayisiyla $(2, 0)$ global minimumdur ve degeri $f(2, 0) = -4$.</div></div>

<h2 class="l-title">8. Hessian ve 2B Ikinci Turev Testi</h2>

<p class="l-text">Iki degiskende bir kritik noktayi siniflandirmak tum ikinci kismi turevlerin matrisini gerektirir — <strong>Hessian</strong>. $f(x, y)$ icin</p>

<div class="calc-formula"><span class="formula-label">Hessian Matrisi</span><div class="formula-main">$$H f(x, y) = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}, \\qquad f_{xy} = f_{yx} \\text{ (Clairaut, surekli iken)}.$$</div><div class="formula-sub">Hessian her yondeki egriligi yakalar, tek degiskendeki $f''$'yi genellestirir.</div></div>

<p class="l-text">Iki boyutlu ikinci turev testi kritik noktadaki Hessian determinantini kullanir, sik sik $D$ olarak gosterilir:</p>

<div class="calc-formula"><span class="formula-label">2B Ikinci Turev Testi</span><div class="formula-main">$$D = \\det Hf(x_0, y_0) = f_{xx} f_{yy} - f_{xy}^2.$$</div><div class="formula-sub">$\\nabla f = \\mathbf{0}$ olan kritik nokta $(x_0, y_0)$'da:</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$D &gt; 0$ ve $f_{xx} &gt; 0$</div><div class="card-body">Fonksiyon her yonde icbukey yukaridir. Yerel <strong>minimum</strong>.</div><div class="card-formula">cukur bicimi</div></div>
<div class="calc-card"><div class="card-title">$D &gt; 0$ ve $f_{xx} &lt; 0$</div><div class="card-body">Fonksiyon her yonde icbukey asagidir. Yerel <strong>maksimum</strong>.</div><div class="card-formula">tepe bicimi</div></div>
<div class="calc-card"><div class="card-title">$D &lt; 0$</div><div class="card-body">Fonksiyon bir yonde yukari, baska bir yonde asagi kavislenir. <strong>Eyer noktasi</strong> — ne minimum ne maksimum.</div><div class="card-formula">at eyer</div></div>
<div class="calc-card"><div class="card-title">$D = 0$</div><div class="card-body">Test <strong>sonucsuzdur</strong>. Hessian dejeneredir ve yerel davranis daha yuksek mertebeli terimlere baglidir.</div><div class="card-formula">daha fazla bilgi gerekir</div></div>
</div>

<div class="l-note"><strong>Niye determinant?</strong> Kucuk bir komsulukta $f(x, y) \\approx f(x_0, y_0) + \\tfrac{1}{2} (\\Delta\\mathbf{x})^T H (\\Delta\\mathbf{x})$. Kuadratik form $\\mathbf{u}^T H \\mathbf{u}$ tum $\\mathbf{u}$ yonleri icin pozitiftir; ancak ve ancak $H$'in iki pozitif ozdegeri varsa — bu da (bir $2\\times 2$ simetrik matris icin) $\\det H &gt; 0$ ile birlikte $H_{11} = f_{xx} &gt; 0$ olmasiyla esdegerdir. Ayni mantik maksimum (iki negatif ozdeger) ve eyer (biri pozitif biri negatif — negatif determinant verir) icin kosullari sunar.</div>

<div class="calc-example"><div class="example-label">CALISILMIS ORNEK 6 (eyer noktasi)</div><div class="example-body"><strong>$f(x, y) = x^3 - 3xy + y^3$'un kritik noktalarini siniflandir.</strong><br><br>
Birinci kismi turevler: $f_x = 3x^2 - 3y$, $f_y = -3x + 3y^2$. Her ikisini sifira esitle:
$$3x^2 - 3y = 0 \\implies y = x^2, \\qquad -3x + 3y^2 = 0 \\implies x = y^2.$$
$y = x^2$'yi $x = y^2$'ye yerine koy: $x = x^4$, yani $x(x^3 - 1) = 0$, dolayisiyla $x = 0$ veya $x = 1$.<br><br>
Iki kritik nokta: $(0, 0)$ ve $(1, 1)$.<br><br>
Ikinci kismi turevler: $f_{xx} = 6x$, $f_{yy} = 6y$, $f_{xy} = -3$. Yani $D(x, y) = (6x)(6y) - (-3)^2 = 36 xy - 9$.<br><br>
$(0, 0)$'da: $D = -9 &lt; 0 \\Rightarrow$ <strong>eyer noktasi</strong>.<br>
$(1, 1)$'de: $D = 36 - 9 = 27 &gt; 0$ ve $f_{xx}(1,1) = 6 &gt; 0 \\Rightarrow$ <strong>yerel minimum</strong>, degeri $f(1, 1) = 1 - 3 + 1 = -1$.</div></div>

<div class="calc-graph"><div class="graph-title">Bir eyer: orijinde $z = x^2 - y^2$</div>
<div id="plot-saddle-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var xs=[];var ys=[];var zs=[];var n=41;
for(var i=0;i<n;i++){var row=[];var xv=-2+4*i/(n-1);xs.push(xv);var rrow=[];for(var j=0;j<n;j++){var yv=-2+4*j/(n-1);if(i===0)ys.push(yv);row.push(xv*xv-yv*yv);}zs.push(row);}
var data=[{type:"surface",x:xs,y:ys,z:zs,colorscale:[[0,"#3b82f6"],[0.5,"#c8a96e"],[1,"#f87171"]],showscale:false}];
var layout={paper_bgcolor:"rgba(0,0,0,0)",scene:{xaxis:{title:"x",gridcolor:"rgba(255,255,255,0.1)",color:"#ebe6dc"},yaxis:{title:"y",gridcolor:"rgba(255,255,255,0.1)",color:"#ebe6dc"},zaxis:{title:"z = x² - y²",gridcolor:"rgba(255,255,255,0.1)",color:"#ebe6dc"},bgcolor:"rgba(0,0,0,0)"},margin:{t:20,r:0,b:0,l:0},font:{color:"#ebe6dc"}};
Plotly.newPlot("plot-saddle-tr",data,layout,{responsive:true,displayModeBar:false});
},250)</script>
<div class="graph-caption">$f(x,y) = x^2 - y^2$ icin orijin bir kritik noktadir ve $D = (2)(-2) - 0 = -4 &lt; 0$. Yuzey $x$ yonunde yukari, $y$ yonunde asagi gider — ders kitabi eyer ornegi.</div>
</div>

<h2 class="l-title">9. Klasik Alistirmalar</h2>

<p class="l-text">Bu dersin yontemlerini pekistirmek icin bunlari elinizle yapin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Alistirma 1</div><div class="card-body">$f(x) = x^3 - 3x$'in kritik noktalarini bul ve siniflandir. Hem birinci hem ikinci turev testlerinin ayni cevabi verdigini dogrula.</div><div class="card-formula">Cevap: $x=-1$'de max, $x=1$'de min.</div></div>
<div class="calc-card"><div class="card-title">Alistirma 2</div><div class="card-body">$f(x) = x^3 - 12x + 5$'in $[-3, 3]$ kapali araliginda mutlak ekstremumlarini bul.</div><div class="card-formula">Cevap: max $f(-2) = 21$; min $f(2) = -11$.</div></div>
<div class="calc-card"><div class="card-title">Alistirma 3</div><div class="card-body">Cevresi 100 olan tum dikdortgenler arasinda alani en buyuk olani bul.</div><div class="card-formula">Cevap: $25 \\times 25$ kare, alan $625$.</div></div>
<div class="calc-card"><div class="card-title">Alistirma 4</div><div class="card-body">Tabani kare olan, ust ucu acik dikdortgen bir kutu hacmi 32 m³ olacak sekilde insa edilecek. Toplam malzemeyi (taban + 4 kenar) minimum yapan boyutlari bul.</div><div class="card-formula">Cevap: taban $4\\times 4$ m, yukseklik 2 m.</div></div>
<div class="calc-card"><div class="card-title">Alistirma 5</div><div class="card-body">$f(x, y) = x^2 + y^2 - 4x$'i minimize et. Kritik noktayi bul ve Hessian testi ile siniflandir.</div><div class="card-formula">Cevap: $(2, 0)$'da min, deger $-4$.</div></div>
<div class="calc-card"><div class="card-title">Alistirma 6</div><div class="card-body">$f(x, y) = x^3 - 3xy + y^3$'un kritik noktalarini $D = f_{xx}f_{yy} - f_{xy}^2$ ile siniflandir.</div><div class="card-formula">Cevap: $(0,0)$'da eyer, $(1,1)$'de yerel min.</div></div>
<div class="calc-card"><div class="card-title">Alistirma 7 (Pisagor benzeri)</div><div class="card-body">Uzunlugu $L$ olan bir tel, bacaklari $x$ ve $y$ olan bir dik ucgene bukulur. Alani maksimize eden bacaklari bul.</div><div class="card-formula">Cevap: ikizkenar dik ucgen, $x = y = L(2-\\sqrt{2})/2$.</div></div>
<div class="calc-card"><div class="card-title">Alistirma 8</div><div class="card-body">Bir firmanin kari $\\Pi(q) = -q^2 + 80q - 50$. Kari maksimize eden uretim duzeyi $q$'yi bul ve orada marjinal gelirin marjinal maliyete esit oldugunu dogrula.</div><div class="card-formula">Cevap: $q^* = 40$, $\\Pi^* = 1550$.</div></div>
</div>

<div class="calc-highlight"><strong>Ders ozeti.</strong> Tek degiskenli optimizasyon Fermat teoremi (ekstremumlar kritik noktalarda yasar), birinci ve ikinci turev testleri (bu kritik noktalari siniflandirir) ve kapali aralik yontemi (aday listesine uc noktalari ekler) tarafindan yonetilir. Ayni mantik cok degiskene uzanir: kritik noktalar $\\nabla f = \\mathbf{0}$'i cozer ve Hessian determinanti $D = f_{xx}f_{yy} - f_{xy}^2$ bunlari yerel minimum, yerel maksimum veya eyer noktasi olarak siniflandirir. Her klasik optimizasyon problemi — en buyuk alan, en kucuk yuzey alani, en yuksek kar, en kisa mesafe — bu kucuk arac kumesinin problemin geometrisinden ozenle secilmis bir fonksiyona uygulanmasina indirgenir.</div>
`
};
