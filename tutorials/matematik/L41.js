window.LISE_MAT_L41 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A function is a rule, but rules come in families.</strong> In Lesson 40 you learned how to write a function with the notation $f: A \\to B$, identify its domain and range, and tell a function apart from a relation that fails the vertical line test. In this lesson we open a catalogue: the seven families of functions you will meet again and again throughout high school and into university. Each family has its own graph shape, its own algebraic skeleton, its own typical domain restrictions, and its own real-world story.</p>

<p class="l-text">By the time you reach the end you will recognise a function on sight — given a formula, you will know which family it belongs to before you have plotted a single point; given a graph, you will recognise the family by its silhouette. This pattern recognition is what every later topic (limits, derivatives, integrals, modelling) silently assumes you can do without thinking.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise the seven main function families: linear, constant, quadratic, polynomial, rational, radical, and absolute value</li>
<li>Read the slope $m$ and $y$-intercept $b$ of a linear function $y = mx + b$ directly from formula or graph</li>
<li>Identify the parabola of $y = ax^2 + bx + c$: opening direction (sign of $a$), vertex coordinates, axis of symmetry</li>
<li>Find the natural domain of a rational function by excluding zeros of the denominator</li>
<li>Find the natural domain of a square-root function by requiring the radicand to be non-negative</li>
<li>Sketch $y = |x|$ and its translations, recognise the V-shape, and split absolute value into a piecewise definition</li>
</ul>
</div>

<h2 class="lesson-title">1. Linear Function — $y = mx + b$</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a taxi ride. You pay a fixed boarding fee of 30 TL the moment you sit down, then 15 TL for every kilometre travelled. The total fare $y$ after $x$ kilometres is $y = 15x + 30$. The graph of this rule is a straight line, the slope is the per-kilometre rate, and the $y$-intercept is what you owe before the wheels even turn.</div>

<p class="l-text">A <strong>linear function</strong> is a function of the form</p>

<div class="calc-formula"><div class="formula-label">LINEAR FUNCTION &mdash; DEFINITION</div><div class="formula-main">$$f(x) \\;=\\; mx + b, \\qquad m, b \\in \\mathbb{R}, \\; m \\neq 0.$$</div><div class="formula-sub">The constant $m$ is the <em>slope</em> (Turkish: <em>e&#287;im</em>). The constant $b$ is the <em>$y$-intercept</em> — the value of $f$ at $x = 0$.</div></div>

<p class="l-text">Two parameters, two pieces of geometric information. Change the slope and the line tilts; change the intercept and the line slides up or down without changing tilt. Together $(m, b)$ pin the line down completely. Domain is all of $\\mathbb{R}$, range is all of $\\mathbb{R}$, and the graph is a perfectly straight line that extends forever in both directions.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Slope $m$</div><div class="card-body">The rise over run between any two points on the line: $m = (y_2 - y_1) / (x_2 - x_1)$. Positive $m$ tilts up to the right; negative $m$ tilts down.</div></div>
<div class="calc-card"><div class="card-title">$y$-intercept $b$</div><div class="card-body">Where the line crosses the $y$-axis. Substitute $x = 0$ into the formula and you read $b$ off directly. If $b = 0$ the line passes through the origin.</div></div>
<div class="calc-card"><div class="card-title">$x$-intercept</div><div class="card-body">Where the line crosses the $x$-axis. Set $y = 0$ and solve: $x = -b/m$ (exists because we required $m \\neq 0$).</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Sketch $f(x) = 2x - 3$.<br><br>Slope $m = 2$ (positive, so the line rises). Intercept $b = -3$, so the line crosses the $y$-axis at $(0, -3)$. The $x$-intercept comes from $2x - 3 = 0 \\Rightarrow x = 1.5$, so the line also passes through $(1.5, 0)$. Two points are enough to draw the line.</div></div>

<div class="calc-graph"><div id="plot-l41-linear-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three linear functions with the same intercept $b = 0$ but three different slopes: $m = 0.5$ (gentle climb), $m = 2$ (steeper climb), and $m = -1$ (descending). Notice how all three pass through the origin and how the slope alone controls the tilt.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-50;i<=50;i++)x.push(i/10);
var y1=x.map(function(v){return 0.5*v;});
var y2=x.map(function(v){return 2*v;});
var y3=x.map(function(v){return -v;});
var t1={x:x,y:y1,mode:'lines',name:'y = 0.5x',line:{color:'#3b82f6',width:2.5}};
var t2={x:x,y:y2,mode:'lines',name:'y = 2x',line:{color:'#10b981',width:2.5}};
var t3={x:x,y:y3,mode:'lines',name:'y = -x',line:{color:'#f87171',width:2.5}};
var origin={x:[0],y:[0],mode:'markers',name:'origin',marker:{size:9,color:'#fbbf24',line:{color:'#0a0a0a',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-5,5]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-6,6]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l41-linear-en',[t1,t2,t3,origin],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>A common confusion:</strong> in middle school you may have learned that a "linear" function is one whose graph is a straight line. In senior-school terms this includes the case $b = 0$, which is sometimes called <em>linear in the strict sense</em> (it is the only one preserving $f(0) = 0$). When $b \\neq 0$ the formula is called <em>affine</em> in some textbooks, but in Turkish high-school curriculum we keep calling both "do&#287;rusal".</div>

<h2 class="lesson-title">2. Constant Function — $y = c$</h2>

<div class="calc-highlight"><strong>The simplest function imaginable.</strong> Every input is sent to the same output. The graph is a perfectly horizontal line at height $c$. Slope is zero, no $x$-intercept (unless $c = 0$), and the function value never changes.</div>

<p class="l-text">A <strong>constant function</strong> is the special case of a linear function with slope zero:</p>

<div class="calc-formula"><div class="formula-label">CONSTANT FUNCTION &mdash; DEFINITION</div><div class="formula-main">$$f(x) \\;=\\; c, \\qquad c \\in \\mathbb{R}, \\; \\text{for all } x \\in \\mathbb{R}.$$</div><div class="formula-sub">No matter what you put in, you get $c$ back. Domain $\\mathbb{R}$, range $\\{c\\}$ (a single point).</div></div>

<p class="l-text">Why does this deserve a separate name? Because it is the boundary case that fails the strict definition $y = mx + b$ with $m \\neq 0$, but it still appears constantly (no pun intended) in modelling. The temperature of an ice bath while ice is still present is constant at $0^\\circ\\text{C}$. The atmospheric pressure on a tabletop is (to first approximation) constant. A subscription fee that does not depend on how much you use the service is a constant function of usage.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Slope</div><div class="card-body">$m = 0$. The line is perfectly horizontal — no rise no matter how far you run.</div></div>
<div class="calc-card"><div class="card-title">$y$-intercept</div><div class="card-body">$b = c$. The line crosses the $y$-axis at height $c$.</div></div>
<div class="calc-card"><div class="card-title">$x$-intercept</div><div class="card-body">If $c \\neq 0$, none. If $c = 0$ the function is the $x$-axis itself, intersecting at every point.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Let $f(x) = 4$. Then $f(0) = 4$, $f(100) = 4$, $f(-7.3) = 4$, $f(\\pi) = 4$. The graph is the horizontal line $y = 4$ — flat, never tilting, never crossing the $x$-axis.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Is the constant function injective (one-to-one)? <em>No</em> — every input maps to the same output, so any two distinct inputs collide on the output side. Is it surjective onto $\\mathbb{R}$? <em>No</em> — only the single value $c$ ever appears as output.</div></div>

<h2 class="lesson-title">3. Quadratic Function — $y = ax^2 + bx + c$</h2>

<div class="calc-highlight"><strong>The first nonlinear function you ever meet.</strong> The graph is a U-shape called a <em>parabola</em>. The parabola has a single highest or lowest point (the <em>vertex</em>), is perfectly symmetric across a vertical line through that vertex, and is the shape of every projectile motion, every flashlight reflector, every satellite dish, and every cable hanging in (almost) a parabola.</div>

<p class="l-text">A <strong>quadratic function</strong> has the general form</p>

<div class="calc-formula"><div class="formula-label">QUADRATIC FUNCTION &mdash; DEFINITION</div><div class="formula-main">$$f(x) \\;=\\; a x^2 + b x + c, \\qquad a, b, c \\in \\mathbb{R}, \\; a \\neq 0.$$</div><div class="formula-sub">The leading coefficient $a$ controls opening direction and width. Coefficients $b$ and $c$ shift the parabola sideways and vertically.</div></div>

<p class="l-text">Domain is all of $\\mathbb{R}$, just like the linear case. But the range is no longer all of $\\mathbb{R}$ — it is a half-line because the parabola has a finite top or bottom. Determining that top or bottom is half the work of working with quadratics.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$a > 0$ &mdash; OPENS UPWARD</div><div class="compare-item">U-shape, like a smile</div><div class="compare-item">Vertex is the <strong>minimum</strong></div><div class="compare-item">Range $[y_{\\min}, \\infty)$</div><div class="compare-item">Larger $|a|$ &Rightarrow; narrower parabola</div></div><div class="compare-col"><div class="compare-title">$a < 0$ &mdash; OPENS DOWNWARD</div><div class="compare-item">&Cap;-shape, like a frown</div><div class="compare-item">Vertex is the <strong>maximum</strong></div><div class="compare-item">Range $(-\\infty, y_{\\max}]$</div><div class="compare-item">Larger $|a|$ &Rightarrow; narrower parabola</div></div></div>

<p class="l-text"><strong>The vertex.</strong> The $x$-coordinate of the vertex is found by</p>

<div class="calc-formula"><div class="formula-label">VERTEX OF A PARABOLA</div><div class="formula-main">$$x_V \\;=\\; -\\frac{b}{2a}, \\qquad y_V \\;=\\; f(x_V) \\;=\\; c - \\frac{b^2}{4a}.$$</div><div class="formula-sub">The vertical line $x = -b/(2a)$ is the <em>axis of symmetry</em> — the parabola is its own mirror image across this line.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Locate the vertex of $f(x) = x^2 - 4x + 7$.<br><br>Here $a = 1$, $b = -4$, $c = 7$. So $x_V = -(-4)/(2 \\cdot 1) = 2$. Then $y_V = f(2) = 4 - 8 + 7 = 3$. The vertex is $(2, 3)$. Because $a = 1 > 0$, the parabola opens upward and $(2, 3)$ is the <strong>minimum</strong>. Range: $[3, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l41-parabola-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three parabolas with vertex at the origin and three different leading coefficients: $a = 1$ (standard upward), $a = 0.4$ (wider, opens upward more slowly), $a = -1$ (reflection, opens downward). The sign of $a$ flips the opening direction; the absolute value of $a$ controls the width.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-40;i<=40;i++)x.push(i/10);
var y1=x.map(function(v){return v*v;});
var y2=x.map(function(v){return 0.4*v*v;});
var y3=x.map(function(v){return -v*v;});
var t1={x:x,y:y1,mode:'lines',name:'y = x²',line:{color:'#3b82f6',width:2.5}};
var t2={x:x,y:y2,mode:'lines',name:'y = 0.4x²',line:{color:'#10b981',width:2.5}};
var t3={x:x,y:y3,mode:'lines',name:'y = -x²',line:{color:'#f87171',width:2.5}};
var vertex={x:[0],y:[0],mode:'markers',name:'vertex',marker:{size:9,color:'#fbbf24',line:{color:'#0a0a0a',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-4,4]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-10,10]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l41-parabola-en',[t1,t2,t3,vertex],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Roots of the quadratic.</strong> The $x$-intercepts are the solutions of $ax^2 + bx + c = 0$, given by the quadratic formula $x = (-b \\pm \\sqrt{b^2 - 4ac}) / (2a)$. The discriminant $\\Delta = b^2 - 4ac$ tells us how many real roots: $\\Delta > 0$ two distinct, $\\Delta = 0$ one repeated, $\\Delta < 0$ none.</div>

<h2 class="lesson-title">4. General Polynomial Function</h2>

<div class="calc-highlight"><strong>Polynomials are the well-behaved citizens of the function world.</strong> They are defined on all of $\\mathbb{R}$, they are smooth everywhere, they have no vertical asymptotes, and they are the easiest functions to differentiate, integrate, and evaluate by hand. Linear and quadratic functions are simply polynomials of low degree.</div>

<p class="l-text">A <strong>polynomial function</strong> of degree $n$ is</p>

<div class="calc-formula"><div class="formula-label">POLYNOMIAL FUNCTION &mdash; DEFINITION</div><div class="formula-main">$$f(x) \\;=\\; a_n x^n + a_{n-1} x^{n-1} + \\dots + a_1 x + a_0, \\qquad a_n \\neq 0.$$</div><div class="formula-sub">The non-negative integer $n$ is the <em>degree</em>. The number $a_n$ is the <em>leading coefficient</em>. The number $a_0$ is the <em>constant term</em> — equivalently $f(0)$.</div></div>

<p class="l-text">The degree determines the overall shape of the graph at the extremes (so-called <em>end behaviour</em>). It also controls the maximum possible number of turning points (at most $n - 1$) and the maximum number of real roots (at most $n$).</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Degree $n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Name</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Typical formula</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Max turning points</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem">Constant</td><td style="padding:0.5rem 0.8rem">$f(x) = a_0$</td><td style="padding:0.5rem 0.8rem">0</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">Linear</td><td style="padding:0.5rem 0.8rem">$f(x) = a_1 x + a_0$</td><td style="padding:0.5rem 0.8rem">0</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">Quadratic</td><td style="padding:0.5rem 0.8rem">$f(x) = a_2 x^2 + a_1 x + a_0$</td><td style="padding:0.5rem 0.8rem">1</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">3</td><td style="padding:0.5rem 0.8rem">Cubic</td><td style="padding:0.5rem 0.8rem">$f(x) = a_3 x^3 + \\dots + a_0$</td><td style="padding:0.5rem 0.8rem">2</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">4</td><td style="padding:0.5rem 0.8rem">Quartic</td><td style="padding:0.5rem 0.8rem">$f(x) = a_4 x^4 + \\dots + a_0$</td><td style="padding:0.5rem 0.8rem">3</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$n$</td><td style="padding:0.5rem 0.8rem">$n$-th degree</td><td style="padding:0.5rem 0.8rem">$f(x) = a_n x^n + \\dots + a_0$</td><td style="padding:0.5rem 0.8rem">$n - 1$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>End behaviour.</strong> For large $|x|$, only the leading term $a_n x^n$ matters. So:</p>

<ul class="l-text" style="line-height:1.7">
<li>If $n$ is even and $a_n > 0$: both ends rise to $+\\infty$ (like a wide U).</li>
<li>If $n$ is even and $a_n < 0$: both ends fall to $-\\infty$ (like an upside-down U).</li>
<li>If $n$ is odd and $a_n > 0$: left end falls to $-\\infty$, right end rises to $+\\infty$ (rising overall).</li>
<li>If $n$ is odd and $a_n < 0$: left end rises, right end falls (falling overall).</li>
</ul>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Classify $g(x) = -2x^3 + 4x^2 - x + 5$. Degree is $3$ (cubic), leading coefficient $-2$ (negative, odd degree). End behaviour: rises on the left, falls on the right. Maximum number of turning points: $3 - 1 = 2$. Maximum number of real roots: $3$.</div></div>

<div class="l-note"><strong>Every polynomial is the sum of a finite number of power terms.</strong> The graph of $f(x) = x^n$ for various $n$ is the canonical building block; everything else is built from these by addition, subtraction, and scaling.</div>

<h2 class="lesson-title">5. Rational Function &mdash; $y = P(x) / Q(x)$</h2>

<div class="calc-highlight"><strong>A rational function is one polynomial divided by another.</strong> The first nontrivial restriction on the domain appears here: we must exclude every $x$ for which the denominator equals zero, because division by zero is undefined. These excluded points often (but not always) become <em>vertical asymptotes</em> — values of $x$ where the function shoots off to $\\pm\\infty$.</div>

<p class="l-text">Formally, a <strong>rational function</strong> is</p>

<div class="calc-formula"><div class="formula-label">RATIONAL FUNCTION &mdash; DEFINITION</div><div class="formula-main">$$f(x) \\;=\\; \\frac{P(x)}{Q(x)}, \\qquad P, Q \\text{ polynomials}, \\; Q(x) \\not\\equiv 0.$$</div><div class="formula-sub">The natural domain is $\\{x \\in \\mathbb{R} : Q(x) \\neq 0\\}$ — all real numbers except the roots of the denominator.</div></div>

<p class="l-text">Polynomials themselves are a special case: take $Q(x) = 1$ and you have $f = P$. The interesting new behaviour comes when $Q$ has roots that $P$ does not share — these are <em>true</em> singularities and lead to asymptotes.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vertical asymptote</div><div class="card-body">At each root $x = a$ of $Q$ that is not also a root of $P$ (after simplification), the function diverges. Draw a dashed vertical line at $x = a$.</div></div>
<div class="calc-card"><div class="card-title">Horizontal asymptote</div><div class="card-body">If $\\deg P < \\deg Q$, asymptote $y = 0$. If $\\deg P = \\deg Q$, asymptote $y = a_n / b_n$ (ratio of leading coefficients). If $\\deg P > \\deg Q$, no horizontal asymptote.</div></div>
<div class="calc-card"><div class="card-title">Removable hole</div><div class="card-body">If the same factor cancels from $P$ and $Q$, the singularity at that point is a "hole" in the graph, not a vertical asymptote.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the natural domain of $f(x) = (x + 1)/(x^2 - 4)$.<br><br>Set the denominator equal to zero: $x^2 - 4 = 0 \\Rightarrow x = \\pm 2$. Excluded points: $\\{-2, 2\\}$. Domain: $\\mathbb{R} \\setminus \\{-2, 2\\}$. The function has vertical asymptotes at $x = -2$ and $x = 2$ (neither cancels with the numerator). Since $\\deg P = 1 < \\deg Q = 2$, the horizontal asymptote is $y = 0$.</div></div>

<div class="calc-graph"><div id="plot-l41-rational-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the classic rational function $y = 1/x$ together with its asymptotes. The two branches lie in opposite quadrants (I and III). The vertical line $x = 0$ and the horizontal line $y = 0$ are dashed because the graph never touches them — it only approaches them as limits.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];for(var i=-30;i<=-2;i++)xL.push(i/10);
var xR=[];for(var i=2;i<=30;i++)xR.push(i/10);
var yL=xL.map(function(v){return 1/v;});
var yR=xR.map(function(v){return 1/v;});
var tL={x:xL,y:yL,mode:'lines',name:'y = 1/x (left branch)',line:{color:'#3b82f6',width:2.5}};
var tR={x:xR,y:yR,mode:'lines',name:'y = 1/x (right branch)',line:{color:'#3b82f6',width:2.5},showlegend:false};
var vAsym={x:[0,0],y:[-10,10],mode:'lines',name:'x = 0 (vertical asymptote)',line:{color:'#f87171',width:1.6,dash:'dash'}};
var hAsym={x:[-3,3],y:[0,0],mode:'lines',name:'y = 0 (horizontal asymptote)',line:{color:'#fbbf24',width:1.6,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-6,6]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l41-rational-en',[tL,tR,vAsym,hAsym],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">What is the natural domain of $f(x) = 3/(x - 5)$? Answer: $\\mathbb{R} \\setminus \\{5\\}$, because the denominator vanishes only at $x = 5$. The graph has a vertical asymptote at $x = 5$ and a horizontal asymptote at $y = 0$.</div></div>

<h2 class="lesson-title">6. Radical Function (Root Function) &mdash; $y = \\sqrt{x}$</h2>

<div class="calc-highlight"><strong>A second source of domain restrictions: square roots.</strong> The square root of a negative number is not a real number. So if the formula contains $\\sqrt{\\text{expression}}$, we must require the expression to be non-negative. Cube roots, on the other hand, are defined for all real numbers (because we can take the cube root of a negative — $\\sqrt[3]{-8} = -2$ is perfectly well-defined).</div>

<p class="l-text">The basic <strong>square root function</strong> is</p>

<div class="calc-formula"><div class="formula-label">SQUARE ROOT FUNCTION</div><div class="formula-main">$$f(x) \\;=\\; \\sqrt{x}, \\qquad x \\geq 0.$$</div><div class="formula-sub">Domain $[0, \\infty)$, range $[0, \\infty)$. Graph starts at the origin and rises slowly to the upper right — the right half of a sideways parabola.</div></div>

<p class="l-text">More generally, for any function inside a square root, the radicand must satisfy</p>

<div class="calc-formula"><div class="formula-label">DOMAIN CONDITION FOR $\\sqrt{g(x)}$</div><div class="formula-main">$$g(x) \\;\\geq\\; 0.$$</div></div>

<p class="l-text"><strong>Cube root.</strong> The function $f(x) = \\sqrt[3]{x}$ has domain $\\mathbb{R}$ and range $\\mathbb{R}$ — no restriction. Its graph is an odd reflection: it rises through the origin, with infinite slope at $x = 0$, smoothly extending into the third quadrant for negative inputs. More generally, $\\sqrt[n]{x}$ has domain $\\mathbb{R}$ when $n$ is odd, and domain $[0, \\infty)$ when $n$ is even.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sqrt{x}$ (even root)</div><div class="card-body">Domain $[0, \\infty)$, range $[0, \\infty)$. Starts at origin, increases without bound but with decreasing slope.</div></div>
<div class="calc-card"><div class="card-title">$\\sqrt[3]{x}$ (odd root)</div><div class="card-body">Domain $\\mathbb{R}$, range $\\mathbb{R}$. Symmetric under $x \\to -x, y \\to -y$ (an odd function). Vertical tangent at the origin.</div></div>
<div class="calc-card"><div class="card-title">Compound radicand</div><div class="card-body">For $\\sqrt{g(x)}$: solve $g(x) \\geq 0$ to find the domain. Example: $\\sqrt{x - 3}$ has domain $[3, \\infty)$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the natural domain of $f(x) = \\sqrt{2x + 6}$.<br><br>Require the radicand non-negative: $2x + 6 \\geq 0 \\Rightarrow x \\geq -3$. Domain $[-3, \\infty)$.</div></div>

<div class="l-note"><strong>Compound case &mdash; both restrictions at once.</strong> Consider $f(x) = \\sqrt{x + 2} / (x - 4)$. Two requirements: (i) $x + 2 \\geq 0 \\Rightarrow x \\geq -2$, and (ii) $x - 4 \\neq 0 \\Rightarrow x \\neq 4$. Combined: domain is $[-2, 4) \\cup (4, \\infty)$. Always handle each restriction separately, then intersect the answers.</div>

<h2 class="lesson-title">7. Absolute Value Function &mdash; $y = |x|$</h2>

<div class="calc-highlight"><strong>Distance from the origin.</strong> The absolute value of a number is its distance from $0$ on the number line. Distance is always non-negative, so $|x| \\geq 0$ for every real $x$. The graph of $y = |x|$ is a perfect V-shape — two straight lines meeting at the origin at a right angle.</div>

<p class="l-text">Formally, the <strong>absolute value function</strong> is defined piecewise:</p>

<div class="calc-formula"><div class="formula-label">ABSOLUTE VALUE FUNCTION</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} x & \\text{if } x \\geq 0 \\\\ -x & \\text{if } x < 0 \\end{cases}$$</div><div class="formula-sub">For non-negative inputs the output equals the input. For negative inputs the output is the input flipped to positive. Domain $\\mathbb{R}$, range $[0, \\infty)$.</div></div>

<p class="l-text">The two-case definition is what gives the V its sharp corner at the origin: the right branch is $y = x$ (slope $+1$), the left branch is $y = -x$ (slope $-1$). They meet exactly at the vertex $(0, 0)$.</p>

<div class="calc-graph"><div id="plot-l41-abs-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the V-shape of $y = |x|$ alongside two of its translations. The function $|x - 2|$ is the V shifted right by $2$ units (vertex at $(2, 0)$). The function $|x| + 1$ is the V lifted up by $1$ unit (vertex at $(0, 1)$). The shape is rigid; only its position moves.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-50;i<=50;i++)x.push(i/10);
var y1=x.map(function(v){return Math.abs(v);});
var y2=x.map(function(v){return Math.abs(v-2);});
var y3=x.map(function(v){return Math.abs(v)+1;});
var t1={x:x,y:y1,mode:'lines',name:'y = |x|',line:{color:'#3b82f6',width:2.5}};
var t2={x:x,y:y2,mode:'lines',name:'y = |x - 2|',line:{color:'#10b981',width:2.5}};
var t3={x:x,y:y3,mode:'lines',name:'y = |x| + 1',line:{color:'#f87171',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-5,5]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-0.5,6]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l41-abs-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Key transformations.</strong> The pattern $|x - h| + k$ is a V shifted to vertex $(h, k)$. The pattern $a|x|$ stretches or compresses the V vertically (and reflects it if $a < 0$). Together you can place a V with any vertex and any opening direction.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Sketch $f(x) = |x + 3| - 2$. The pattern $|x - h| + k$ with $h = -3$, $k = -2$ gives a V with vertex at $(-3, -2)$, opening upward. The two arms have slopes $+1$ and $-1$, identical to the standard $|x|$ rotated only in position.</div></div>

<div class="l-note"><strong>Connection to square roots.</strong> A useful identity: $|x| = \\sqrt{x^2}$. The square first kills any negative sign, then the principal square root returns the positive value. This will be the standard trick later when computing distances.</div>

<h2 class="lesson-title">8. Exponential and Logarithmic &mdash; Brief Reminder</h2>

<div class="calc-highlight"><strong>You met these in Lessons 35&ndash;37.</strong> They are non-polynomial families with their own dedicated graphs and properties. We list them here only for completeness in the catalogue; revisit those lessons for the full treatment.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Exponential</div><div class="card-body">$f(x) = a^x$ with $a > 0$, $a \\neq 1$. Domain $\\mathbb{R}$, range $(0, \\infty)$. Passes through $(0, 1)$. Increasing if $a > 1$, decreasing if $0 < a < 1$. Horizontal asymptote $y = 0$. (Lesson 35.)</div></div>
<div class="calc-card"><div class="card-title">Logarithmic</div><div class="card-body">$f(x) = \\log_a x$ with $a > 0$, $a \\neq 1$. Domain $(0, \\infty)$, range $\\mathbb{R}$. Passes through $(1, 0)$. Inverse of $a^x$. Vertical asymptote $x = 0$. (Lesson 36.)</div></div>
<div class="calc-card"><div class="card-title">Natural exponential / log</div><div class="card-body">Special bases $e \\approx 2.71828$ and $\\ln = \\log_e$. The pair $(e^x, \\ln x)$ is the calculus-friendly default. (Lesson 37.)</div></div>
</div>

<p class="l-text">The key feature that distinguishes these families from polynomials and rationals is the role of the variable. In a polynomial, $x$ is in the <em>base</em>; the exponent is fixed. In an exponential, $x$ is in the <em>exponent</em>; the base is fixed. This positional swap creates fundamentally different growth (or decay) behaviour: exponentials eventually outpace every polynomial.</p>

<h2 class="lesson-title">9. Trigonometric Functions &mdash; Brief Reminder</h2>

<div class="calc-highlight"><strong>Covered in detail in the Trigonometry track.</strong> The six trig functions (sine, cosine, tangent, cotangent, secant, cosecant) are <em>periodic</em>: their graphs repeat at fixed intervals. This is a property no polynomial or rational function can have.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sine $\\sin x$</div><div class="card-body">Domain $\\mathbb{R}$, range $[-1, 1]$. Period $2\\pi$. Passes through origin; oscillates between $-1$ and $+1$. (Trig Lesson 2.)</div></div>
<div class="calc-card"><div class="card-title">Cosine $\\cos x$</div><div class="card-body">Domain $\\mathbb{R}$, range $[-1, 1]$. Period $2\\pi$. Passes through $(0, 1)$. Shifted version of sine: $\\cos x = \\sin(x + \\pi/2)$.</div></div>
<div class="calc-card"><div class="card-title">Tangent $\\tan x$</div><div class="card-body">Domain $\\mathbb{R} \\setminus \\{\\pi/2 + k\\pi\\}$. Range $\\mathbb{R}$. Period $\\pi$. Vertical asymptotes at every $\\pi/2 + k\\pi$.</div></div>
</div>

<p class="l-text">Trigonometric functions are the bridge between angles and ratios. Every wave, oscillation, vibration, or rotation in physics and engineering ultimately uses one or more of them. We mention them here so the catalogue feels complete; for the algebraic properties and full graphs, consult the Trig lessons.</p>

<h2 class="lesson-title">10. Worked Problems &mdash; Recognise the Family</h2>

<p class="l-text">Eight short practice problems pulling together the catalogue. Try each one first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; FAMILY FROM FORMULA</div><div class="example-body"><strong>Name the family of $f(x) = 7x - 2$.</strong><br><br>Two parameters $m = 7$ and $b = -2$, no powers higher than $1$. <strong>Linear function</strong>. Slope $7$, $y$-intercept $-2$. Domain and range both $\\mathbb{R}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; FAMILY FROM FORMULA</div><div class="example-body"><strong>Name the family of $g(x) = 5$.</strong><br><br>No $x$ at all in the formula. <strong>Constant function</strong>. Horizontal line at $y = 5$. Range is the single point $\\{5\\}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; FAMILY FROM FORMULA</div><div class="example-body"><strong>Name the family of $h(x) = -3x^2 + x + 1$.</strong><br><br>Highest power is $x^2$. <strong>Quadratic function</strong> with $a = -3 < 0$, so the parabola opens downward. Vertex maximum. $x_V = -1/(2 \\cdot (-3)) = 1/6$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; DEGREE OF A POLYNOMIAL</div><div class="example-body"><strong>What is the degree of $p(x) = 4x^5 - 2x^3 + 7x - 9$?</strong><br><br>The highest power of $x$ that appears is $x^5$. <strong>Degree $5$ (quintic)</strong>. Leading coefficient $a_5 = 4 > 0$, odd degree, so end behaviour: falls on the left, rises on the right.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; DOMAIN OF RATIONAL</div><div class="example-body"><strong>Find the natural domain of $f(x) = (2x + 1)/(x^2 - 9)$.</strong><br><br>Set denominator to zero: $x^2 - 9 = 0 \\Rightarrow x = \\pm 3$. Excluded: $\\{-3, 3\\}$. <strong>Domain: $\\mathbb{R} \\setminus \\{-3, 3\\}$</strong>. Vertical asymptotes at $\\pm 3$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; DOMAIN OF SQUARE ROOT</div><div class="example-body"><strong>Find the natural domain of $g(x) = \\sqrt{9 - x^2}$.</strong><br><br>Require $9 - x^2 \\geq 0 \\Rightarrow x^2 \\leq 9 \\Rightarrow -3 \\leq x \\leq 3$. <strong>Domain: $[-3, 3]$</strong>. (The graph is the upper half of a circle of radius $3$.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; SOLVE ABSOLUTE VALUE</div><div class="example-body"><strong>Solve $|x - 4| = 7$.</strong><br><br>By definition $|y| = 7 \\Leftrightarrow y = \\pm 7$. So $x - 4 = 7$ or $x - 4 = -7$, giving $x = 11$ or $x = -3$. <strong>Solutions: $\\{-3, 11\\}$</strong>. Geometric meaning: the two numbers whose distance from $4$ is $7$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; MATCH FORMULA TO GRAPH</div><div class="example-body"><strong>Below are four formulae. Sketch each mentally and assign it to one of the four graph silhouettes: straight line / parabola / hyperbola branch / V-shape.</strong><br><br>(a) $y = -2x + 1$ &rarr; straight line (linear).<br>(b) $y = x^2 - 4$ &rarr; parabola opening upward, vertex $(0, -4)$.<br>(c) $y = 2/x$ &rarr; two hyperbola branches in quadrants I and III.<br>(d) $y = |x - 1|$ &rarr; V-shape, vertex $(1, 0)$.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> Lesson 42 begins the algebra of functions: how to add, subtract, multiply, divide, and (most importantly) <em>compose</em> two functions to build a new one. Make sure each of the seven families in today's lesson feels familiar by formula and by sketch before moving on.</div>

<h2 class="lesson-title">11. Side-by-Side Comparison</h2>

<p class="l-text">A single panel comparing six of the most common families on one set of axes makes the silhouettes immediate: each curve has its own colour, and the eye learns to associate shape with formula in one glance.</p>

<div class="calc-graph"><div id="plot-l41-compare-en-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> six function families on a single panel &mdash; linear $y = 2x + 1$ (blue), quadratic $y = x^2$ (green), cubic $y = x^3$ (amber), rational $y = 1/x$ in two branches (red), square root $y = \\sqrt{x}$ defined only for $x \\geq 0$ (purple), and absolute value $y = |x|$ (cyan). Use this as a visual mnemonic: each silhouette is unique, and recognising the silhouette is the first step in classifying a new function.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xFull=[];for(var i=-40;i<=40;i++)xFull.push(i/10);
var xPos=[];for(var i=0;i<=40;i++)xPos.push(i/10);
var xRatL=[];for(var i=-40;i<=-3;i++)xRatL.push(i/10);
var xRatR=[];for(var i=3;i<=40;i++)xRatR.push(i/10);
var tLin={x:xFull,y:xFull.map(function(v){return 2*v+1;}),mode:'lines',name:'linear y = 2x + 1',line:{color:'#3b82f6',width:2.4}};
var tQuad={x:xFull,y:xFull.map(function(v){return v*v;}),mode:'lines',name:'quadratic y = x²',line:{color:'#10b981',width:2.4}};
var tCub={x:xFull,y:xFull.map(function(v){return v*v*v;}),mode:'lines',name:'cubic y = x³',line:{color:'#fbbf24',width:2.4}};
var tRatL={x:xRatL,y:xRatL.map(function(v){return 1/v;}),mode:'lines',name:'rational y = 1/x',line:{color:'#f87171',width:2.4}};
var tRatR={x:xRatR,y:xRatR.map(function(v){return 1/v;}),mode:'lines',name:'rational y = 1/x',line:{color:'#f87171',width:2.4},showlegend:false};
var tSqrt={x:xPos,y:xPos.map(function(v){return Math.sqrt(v);}),mode:'lines',name:'square root y = √x',line:{color:'#a78bfa',width:2.4}};
var tAbs={x:xFull,y:xFull.map(function(v){return Math.abs(v);}),mode:'lines',name:'absolute value y = |x|',line:{color:'#22d3ee',width:2.4}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-4,4]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-6,6]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.14,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l41-compare-en-extra',[tLin,tQuad,tCub,tRatL,tRatR,tSqrt,tAbs],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">The summary table below lays out ten function families with their general form, a concrete example, and the shape of the graph &mdash; a quick-reference card you can return to whenever you meet an unfamiliar formula.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Type</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">General form</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Example</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Graph shape</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Linear</td><td style="padding:0.5rem 0.8rem">$f(x) = mx + b$</td><td style="padding:0.5rem 0.8rem">$y = 2x + 1$</td><td style="padding:0.5rem 0.8rem">Straight line</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Quadratic</td><td style="padding:0.5rem 0.8rem">$f(x) = ax^2 + bx + c$</td><td style="padding:0.5rem 0.8rem">$y = x^2$</td><td style="padding:0.5rem 0.8rem">Parabola (U / &Cap;)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Cubic</td><td style="padding:0.5rem 0.8rem">$f(x) = ax^3 + bx^2 + cx + d$</td><td style="padding:0.5rem 0.8rem">$y = x^3$</td><td style="padding:0.5rem 0.8rem">S-curve through origin</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Polynomial (deg $n$)</td><td style="padding:0.5rem 0.8rem">$f(x) = a_n x^n + \\dots + a_0$</td><td style="padding:0.5rem 0.8rem">$y = x^4 - 3x^2 + 1$</td><td style="padding:0.5rem 0.8rem">Smooth, up to $n - 1$ turns</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Rational</td><td style="padding:0.5rem 0.8rem">$f(x) = P(x) / Q(x)$</td><td style="padding:0.5rem 0.8rem">$y = 1/x$</td><td style="padding:0.5rem 0.8rem">Hyperbola branches, asymptotes</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Square root</td><td style="padding:0.5rem 0.8rem">$f(x) = \\sqrt{g(x)}$</td><td style="padding:0.5rem 0.8rem">$y = \\sqrt{x}$</td><td style="padding:0.5rem 0.8rem">Half-parabola, $x \\geq 0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Exponential</td><td style="padding:0.5rem 0.8rem">$f(x) = a^x$, $a > 0$, $a \\neq 1$</td><td style="padding:0.5rem 0.8rem">$y = 2^x$</td><td style="padding:0.5rem 0.8rem">Rapid growth (or decay), $y > 0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Logarithmic</td><td style="padding:0.5rem 0.8rem">$f(x) = \\log_a x$</td><td style="padding:0.5rem 0.8rem">$y = \\ln x$</td><td style="padding:0.5rem 0.8rem">Slow growth, $x > 0$, asymptote at $x = 0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Absolute value</td><td style="padding:0.5rem 0.8rem">$f(x) = |g(x)|$</td><td style="padding:0.5rem 0.8rem">$y = |x|$</td><td style="padding:0.5rem 0.8rem">V-shape with corner</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Piecewise</td><td style="padding:0.5rem 0.8rem">$f(x) = \\begin{cases} g_1(x), & x \\in I_1 \\\\ g_2(x), & x \\in I_2 \\end{cases}$</td><td style="padding:0.5rem 0.8rem">$y = \\text{sgn}(x)$</td><td style="padding:0.5rem 0.8rem">Different curves on different intervals</td></tr>
</tbody></table>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Linear $y = mx + b$: straight line, slope $m$, intercept $b$, both domain and range $\\mathbb{R}$.</li>
<li>Constant $y = c$: horizontal line, range is the single point $\\{c\\}$.</li>
<li>Quadratic $y = ax^2 + bx + c$: parabola with vertex at $x = -b/(2a)$. Opens up if $a > 0$, down if $a < 0$.</li>
<li>Polynomial of degree $n$: smooth, defined on all $\\mathbb{R}$, at most $n - 1$ turning points, at most $n$ real roots.</li>
<li>Rational $P/Q$: domain excludes zeros of $Q$. Possible vertical asymptotes there; horizontal asymptote depends on degree comparison.</li>
<li>Square root $\\sqrt{g(x)}$: domain requires $g(x) \\geq 0$. Cube root is defined on all $\\mathbb{R}$.</li>
<li>Absolute value $|x|$: V-shape, vertex at origin, range $[0, \\infty)$. Translations of the form $|x - h| + k$ move the vertex to $(h, k)$.</li>
</ul>
</div>`,

/* ============================================================
   T&Uuml;RK&Ccedil;E S&Uuml;R&Uuml;M
   ============================================================ */
tr: `<p class="l-text"><strong>Fonksiyon bir kuraldır, ama kurallar aileler hâlinde gelir.</strong> Ders 40'ta $f: A \\to B$ gösterimini, tanım ve görüntü kümelerini ve bir bağıntının dikey doğru testini sağlayıp sağlamadığını öğrendiniz. Bu derste bir katalog açıyoruz: lise ve üniversitede defalarca karşınıza çıkacak yedi temel fonksiyon ailesi. Her ailenin kendine özgü grafik şekli, cebirsel iskeleti, tipik tanım kümesi kısıtlaması ve gerçek dünya hikâyesi vardır.</p>

<p class="l-text">Bu dersi bitirdiğinizde fonksiyonu görür görmez tanıyacaksınız: bir formül verildiğinde tek bir nokta çizmeden önce hangi aileye ait olduğunu bileceksiniz; bir grafik verildiğinde aileyi siluetinden tanıyacaksınız. Bu örüntü tanıma, sonraki tüm konuların (limit, türev, integral, modelleme) sessizce yapabildiğinizi varsaydığı şeydir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">NELER &Ouml;&#286;RENECEKS&#304;N&#304;Z</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yedi ana fonksiyon ailesini tanıyın: doğrusal, sabit, karesel (ikinci derece), polinom, rasyonel, köklü ve mutlak değer</li>
<li>$y = mx + b$ doğrusal fonksiyonunda eğim $m$ ve $y$-kesim noktası $b$'yi formülden ya da grafikten doğrudan okuyun</li>
<li>$y = ax^2 + bx + c$ parabolünün açılma yönünü ($a$'nın işareti), tepe noktasının koordinatlarını ve simetri eksenini bulun</li>
<li>Rasyonel fonksiyonun doğal tanım kümesini paydanın köklerini hariç tutarak belirleyin</li>
<li>Karekök fonksiyonunun doğal tanım kümesini, kök içinin negatif olmaması koşulundan hesaplayın</li>
<li>$y = |x|$'i ve dönüşümlerini çizin, V şeklini tanıyın ve mutlak değeri parçalı tanıma açın</li>
</ul>
</div>

<h2 class="lesson-title">1. Doğrusal Fonksiyon &mdash; $y = mx + b$</h2>

<div class="calc-highlight"><strong>Günlük örnek:</strong> bir taksi yolculuğu. Taksiye bindiğinizde 30 TL açılış ücreti, ardından her kilometre için 15 TL ödüyorsunuz. $x$ kilometre sonra ödenecek toplam ücret $y = 15x + 30$ olur. Bu kuralın grafiği bir doğrudur, eğim kilometre başına ücrettir, $y$-kesim noktası ise taksi tekerlek çevirmeden önce zaten borçlu olduğunuz tutardır.</div>

<p class="l-text">Bir <strong>doğrusal fonksiyon</strong> şu biçimde verilir:</p>

<div class="calc-formula"><div class="formula-label">DO&#286;RUSAL FONKS&#304;YON &mdash; TANIM</div><div class="formula-main">$$f(x) \\;=\\; mx + b, \\qquad m, b \\in \\mathbb{R}, \\; m \\neq 0.$$</div><div class="formula-sub">$m$ sabitine <em>eğim</em>, $b$ sabitine <em>$y$-kesim noktası</em> denir; yani $f(0) = b$.</div></div>

<p class="l-text">İki parametre, iki geometrik bilgi. Eğim değişirse doğru eğilir; kesim noktası değişirse doğru yukarı ya da aşağı kayar ama eğilmez. Birlikte $(m, b)$ doğruyu tamamen sabitler. Tanım kümesi tüm $\\mathbb{R}$, görüntü kümesi tüm $\\mathbb{R}$ ve grafik iki yöne sonsuza uzanan bir düz çizgidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eğim $m$</div><div class="card-body">Doğrudaki herhangi iki nokta arasındaki dik mesafenin yatay mesafeye oranı: $m = (y_2 - y_1) / (x_2 - x_1)$. Pozitif $m$ sağa yukarı, negatif $m$ sağa aşağı eğer.</div></div>
<div class="calc-card"><div class="card-title">$y$-kesim noktası $b$</div><div class="card-body">Doğrunun $y$-eksenini kestiği nokta. Formüle $x = 0$ koyduğunuzda doğrudan $b$'yi okursunuz. Eğer $b = 0$ ise doğru orijinden geçer.</div></div>
<div class="calc-card"><div class="card-title">$x$-kesim noktası</div><div class="card-body">Doğrunun $x$-eksenini kestiği nokta. $y = 0$ koyup çözün: $x = -b/m$ ($m \\neq 0$ olduğundan vardır).</div></div>
</div>

<div class="calc-example"><div class="example-label">&Ccedil;&Ouml;Z&Uuml;ML&Uuml; &Ouml;RNEK</div><div class="example-body">$f(x) = 2x - 3$'ün grafiğini çizin.<br><br>Eğim $m = 2$ (pozitif, yani doğru yukarı eğimli). Kesim $b = -3$, dolayısıyla doğru $y$-eksenini $(0, -3)$'te keser. $x$-kesimi $2x - 3 = 0 \\Rightarrow x = 1.5$, yani doğru $(1.5, 0)$ noktasından da geçer. İki nokta, doğruyu çizmek için yeterlidir.</div></div>

<div class="calc-graph"><div id="plot-l41-linear-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafikte:</strong> aynı kesim noktası $b = 0$ ile üç farklı eğime sahip üç doğrusal fonksiyon: $m = 0.5$ (yumuşak yükseliş), $m = 2$ (daha dik yükseliş) ve $m = -1$ (azalan). Üçü de orijinden geçer ve eğilmeyi sadece eğim belirler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-50;i<=50;i++)x.push(i/10);
var y1=x.map(function(v){return 0.5*v;});
var y2=x.map(function(v){return 2*v;});
var y3=x.map(function(v){return -v;});
var t1={x:x,y:y1,mode:'lines',name:'y = 0.5x',line:{color:'#3b82f6',width:2.5}};
var t2={x:x,y:y2,mode:'lines',name:'y = 2x',line:{color:'#10b981',width:2.5}};
var t3={x:x,y:y3,mode:'lines',name:'y = -x',line:{color:'#f87171',width:2.5}};
var origin={x:[0],y:[0],mode:'markers',name:'orijin',marker:{size:9,color:'#fbbf24',line:{color:'#0a0a0a',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-5,5]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-6,6]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l41-linear-tr',[t1,t2,t3,origin],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Sık karıştırılan nokta:</strong> ortaokulda "doğrusal" terimini "grafiği düz bir çizgi olan fonksiyon" diye öğrenmiş olabilirsiniz. Lise terminolojisinde bu, $b = 0$ durumunu da kapsar; bazı kaynaklar $b = 0$ koşulunu sağlayan duruma <em>dar anlamda doğrusal</em> der (sadece o $f(0) = 0$ özelliğini korur). $b \\neq 0$ olduğunda formül bazı kitaplarda <em>afin</em> olarak adlandırılır ama Türk lise müfredatında her ikisine de "doğrusal" denir.</div>

<h2 class="lesson-title">2. Sabit Fonksiyon &mdash; $y = c$</h2>

<div class="calc-highlight"><strong>Düşünülebilecek en basit fonksiyon.</strong> Her girdiyi aynı çıktıya gönderir. Grafiği $c$ yüksekliğinde mükemmel bir yatay çizgidir. Eğim sıfır, $x$-kesimi yok ($c = 0$ değilse), fonksiyon değeri asla değişmez.</div>

<p class="l-text">Bir <strong>sabit fonksiyon</strong>, eğimi sıfır olan özel bir doğrusal fonksiyondur:</p>

<div class="calc-formula"><div class="formula-label">SAB&#304;T FONKS&#304;YON &mdash; TANIM</div><div class="formula-main">$$f(x) \\;=\\; c, \\qquad c \\in \\mathbb{R}, \\; \\text{her } x \\in \\mathbb{R} \\text{ için}.$$</div><div class="formula-sub">Ne girersek girelim çıkış $c$'dir. Tanım kümesi $\\mathbb{R}$, görüntü kümesi $\\{c\\}$ (tek nokta).</div></div>

<p class="l-text">Neden bu ayrı bir isim hak ediyor? Çünkü $y = mx + b$, $m \\neq 0$ olan dar tanımın dışında kalır, ama modellemede sürekli karşımıza çıkar. Buz, henüz erimemişken buz banyosunun sıcaklığı sabit olarak $0^\\circ\\text{C}$'dir. Masa üstündeki atmosfer basıncı (ilk yaklaşıma göre) sabittir. Kullanım miktarından bağımsız sabit bir aylık abonelik ücreti, kullanımın sabit fonksiyonudur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eğim</div><div class="card-body">$m = 0$. Doğru tamamen yataydır; ne kadar koşarsanız koşun yükselme yoktur.</div></div>
<div class="calc-card"><div class="card-title">$y$-kesim noktası</div><div class="card-body">$b = c$. Doğru $y$-eksenini $c$ yüksekliğinde keser.</div></div>
<div class="calc-card"><div class="card-title">$x$-kesim noktası</div><div class="card-body">$c \\neq 0$ ise yok. $c = 0$ ise fonksiyon $x$-ekseninin kendisidir, her noktada kesişir.</div></div>
</div>

<div class="calc-example"><div class="example-label">&Ccedil;&Ouml;Z&Uuml;ML&Uuml; &Ouml;RNEK</div><div class="example-body">$f(x) = 4$ olsun. O hâlde $f(0) = 4$, $f(100) = 4$, $f(-7.3) = 4$, $f(\\pi) = 4$. Grafik $y = 4$ yatay doğrusudur — düz, asla eğilmez, asla $x$-ekseni ile kesişmez.</div></div>

<div class="think-box"><div class="think-label">DENET&#304;M NOKTASI</div><div class="think-body">Sabit fonksiyon birebir (injektif) midir? <em>Hayır</em> — her girdi aynı çıktıya gider, bu yüzden iki farklı girdi çıktı tarafında çakışır. Tüm $\\mathbb{R}$ üzerine örten (sürjektif) midir? <em>Hayır</em> — yalnızca tek bir $c$ değeri çıktı olarak görünür.</div></div>

<h2 class="lesson-title">3. &#304;kinci Derece (Karesel) Fonksiyon &mdash; $y = ax^2 + bx + c$</h2>

<div class="calc-highlight"><strong>Karşınıza çıkacak ilk doğrusal olmayan fonksiyon.</strong> Grafiği <em>parabol</em> denilen U şeklidir. Parabolün tek bir en yüksek ya da en düşük noktası vardır (<em>tepe noktası</em>), bu noktadan geçen dikey doğruya göre tam simetriktir ve her atışın, her el feneri reflektörünün, her uydu çanağının ve aşağı yukarı hemen her sarkan kablonun şeklidir.</div>

<p class="l-text">Bir <strong>karesel fonksiyon</strong> genel olarak şu biçimdedir:</p>

<div class="calc-formula"><div class="formula-label">&#304;K&#304;NC&#304; DERECE FONKS&#304;YON &mdash; TANIM</div><div class="formula-main">$$f(x) \\;=\\; a x^2 + b x + c, \\qquad a, b, c \\in \\mathbb{R}, \\; a \\neq 0.$$</div><div class="formula-sub">Baş katsayı $a$, açılma yönünü ve genişliği belirler. $b$ ve $c$ katsayıları parabolü yatay ve dikey olarak kaydırır.</div></div>

<p class="l-text">Tanım kümesi tüm $\\mathbb{R}$'dir, doğrusal durumda olduğu gibi. Ancak görüntü kümesi artık tüm $\\mathbb{R}$ değildir — parabolün sonlu bir tepesi ya da tabanı olduğundan görüntü bir yarı doğrudur. Bu tepe ya da tabanı belirlemek, kareselle çalışmanın işinin yarısıdır.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">$a > 0$ &mdash; YUKARI A&Ccedil;ILIR</div><div class="compare-item">U şekli, gülümseme gibi</div><div class="compare-item">Tepe noktası <strong>minimum</strong></div><div class="compare-item">Görüntü kümesi $[y_{\\min}, \\infty)$</div><div class="compare-item">Daha büyük $|a|$ &Rightarrow; daha dar parabol</div></div><div class="compare-col"><div class="compare-title">$a < 0$ &mdash; A&#350;A&#286;I A&Ccedil;ILIR</div><div class="compare-item">&Cap; şekli, asık surat gibi</div><div class="compare-item">Tepe noktası <strong>maksimum</strong></div><div class="compare-item">Görüntü kümesi $(-\\infty, y_{\\max}]$</div><div class="compare-item">Daha büyük $|a|$ &Rightarrow; daha dar parabol</div></div></div>

<p class="l-text"><strong>Tepe noktası.</strong> Tepe noktasının $x$-koordinatı şu formülle bulunur:</p>

<div class="calc-formula"><div class="formula-label">PARABOL&Uuml;N TEPE NOKTASI</div><div class="formula-main">$$x_T \\;=\\; -\\frac{b}{2a}, \\qquad y_T \\;=\\; f(x_T) \\;=\\; c - \\frac{b^2}{4a}.$$</div><div class="formula-sub">$x = -b/(2a)$ dikey doğrusu <em>simetri eksenidir</em> — parabol bu doğruya göre kendi ayna görüntüsüdür.</div></div>

<div class="calc-example"><div class="example-label">&Ccedil;&Ouml;Z&Uuml;ML&Uuml; &Ouml;RNEK</div><div class="example-body">$f(x) = x^2 - 4x + 7$ parabolünün tepe noktasını bulun.<br><br>Burada $a = 1$, $b = -4$, $c = 7$. O hâlde $x_T = -(-4)/(2 \\cdot 1) = 2$. Sonra $y_T = f(2) = 4 - 8 + 7 = 3$. Tepe noktası $(2, 3)$. $a = 1 > 0$ olduğundan parabol yukarı açılır ve $(2, 3)$ <strong>minimumdur</strong>. Görüntü kümesi: $[3, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l41-parabola-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafikte:</strong> tepe noktası orijinde olan üç parabol ve üç farklı baş katsayı: $a = 1$ (standart, yukarı), $a = 0.4$ (daha geniş, yukarı ama daha yavaş), $a = -1$ (yansıma, aşağı açılır). $a$'nın işareti açılma yönünü ters çevirir; mutlak değeri genişliği kontrol eder.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-40;i<=40;i++)x.push(i/10);
var y1=x.map(function(v){return v*v;});
var y2=x.map(function(v){return 0.4*v*v;});
var y3=x.map(function(v){return -v*v;});
var t1={x:x,y:y1,mode:'lines',name:'y = x²',line:{color:'#3b82f6',width:2.5}};
var t2={x:x,y:y2,mode:'lines',name:'y = 0.4x²',line:{color:'#10b981',width:2.5}};
var t3={x:x,y:y3,mode:'lines',name:'y = -x²',line:{color:'#f87171',width:2.5}};
var vertex={x:[0],y:[0],mode:'markers',name:'tepe',marker:{size:9,color:'#fbbf24',line:{color:'#0a0a0a',width:1.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-4,4]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-10,10]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l41-parabola-tr',[t1,t2,t3,vertex],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Karesel denklemin kökleri.</strong> $x$-kesimleri $ax^2 + bx + c = 0$ denkleminin çözümleridir: $x = (-b \\pm \\sqrt{b^2 - 4ac}) / (2a)$. Diskriminant $\\Delta = b^2 - 4ac$ kaç tane reel kök olduğunu söyler: $\\Delta > 0$ iki farklı, $\\Delta = 0$ tek katlı, $\\Delta < 0$ reel kök yok.</div>

<h2 class="lesson-title">4. Genel Polinom Fonksiyonu</h2>

<div class="calc-highlight"><strong>Polinomlar, fonksiyon dünyasının uslu vatandaşlarıdır.</strong> Tüm $\\mathbb{R}$ üzerinde tanımlıdır, her yerde düzgündür, dikey asimptotları yoktur ve elle türev/integral/değer hesaplamak için en kolay fonksiyonlardır. Doğrusal ve karesel fonksiyonlar yalnızca düşük dereceli polinomlardır.</div>

<p class="l-text">$n$ dereceli bir <strong>polinom fonksiyonu</strong>:</p>

<div class="calc-formula"><div class="formula-label">POL&#304;NOM FONKS&#304;YONU &mdash; TANIM</div><div class="formula-main">$$f(x) \\;=\\; a_n x^n + a_{n-1} x^{n-1} + \\dots + a_1 x + a_0, \\qquad a_n \\neq 0.$$</div><div class="formula-sub">Negatif olmayan tam sayı $n$ <em>derece</em>dir. $a_n$ sayısı <em>baş katsayı</em>dır. $a_0$ sayısı <em>sabit terim</em> ya da eşdeğer biçimde $f(0)$'dır.</div></div>

<p class="l-text">Derece, grafiğin uçlardaki genel davranışını belirler (uç davranış). Aynı zamanda olası en fazla dönme noktası sayısını ($n - 1$ en fazla) ve olası en fazla reel kök sayısını (en fazla $n$) sınırlar.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Derece $n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">&#304;sim</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Tipik formül</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">En fazla d&ouml;nme noktası</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem">Sabit</td><td style="padding:0.5rem 0.8rem">$f(x) = a_0$</td><td style="padding:0.5rem 0.8rem">0</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem">Do&#287;rusal</td><td style="padding:0.5rem 0.8rem">$f(x) = a_1 x + a_0$</td><td style="padding:0.5rem 0.8rem">0</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">Karesel</td><td style="padding:0.5rem 0.8rem">$f(x) = a_2 x^2 + a_1 x + a_0$</td><td style="padding:0.5rem 0.8rem">1</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">3</td><td style="padding:0.5rem 0.8rem">K&uuml;bik</td><td style="padding:0.5rem 0.8rem">$f(x) = a_3 x^3 + \\dots + a_0$</td><td style="padding:0.5rem 0.8rem">2</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">4</td><td style="padding:0.5rem 0.8rem">Kuartik</td><td style="padding:0.5rem 0.8rem">$f(x) = a_4 x^4 + \\dots + a_0$</td><td style="padding:0.5rem 0.8rem">3</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$n$</td><td style="padding:0.5rem 0.8rem">$n$-inci derece</td><td style="padding:0.5rem 0.8rem">$f(x) = a_n x^n + \\dots + a_0$</td><td style="padding:0.5rem 0.8rem">$n - 1$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Uç davranış.</strong> Büyük $|x|$ değerleri için yalnızca baş terim $a_n x^n$ önemlidir. Dolayısıyla:</p>

<ul class="l-text" style="line-height:1.7">
<li>$n$ çift ve $a_n > 0$ ise: her iki uç da $+\\infty$'a yükselir (geniş bir U gibi).</li>
<li>$n$ çift ve $a_n < 0$ ise: her iki uç da $-\\infty$'a iner (ters U gibi).</li>
<li>$n$ tek ve $a_n > 0$ ise: sol uç $-\\infty$'a iner, sağ uç $+\\infty$'a yükselir (genel olarak yükselir).</li>
<li>$n$ tek ve $a_n < 0$ ise: sol uç yükselir, sağ uç iner (genel olarak iner).</li>
</ul>

<div class="calc-example"><div class="example-label">&Ccedil;&Ouml;Z&Uuml;ML&Uuml; &Ouml;RNEK</div><div class="example-body">$g(x) = -2x^3 + 4x^2 - x + 5$'i sınıflandırın. Derece $3$ (kübik), baş katsayı $-2$ (negatif, tek derece). Uç davranış: solda yükselir, sağda iner. En fazla dönme noktası: $3 - 1 = 2$. En fazla reel kök: $3$.</div></div>

<div class="l-note"><strong>Her polinom, sonlu sayıda kuvvet teriminin toplamıdır.</strong> Çeşitli $n$ için $f(x) = x^n$ grafiği temel yapı taşıdır; geri kalan her şey bunların toplama, çıkarma ve ölçeklemeyle birleştirilmesiyle inşa edilir.</div>

<h2 class="lesson-title">5. Rasyonel Fonksiyon &mdash; $y = P(x) / Q(x)$</h2>

<div class="calc-highlight"><strong>Rasyonel fonksiyon, bir polinomun başka bir polinoma bölümüdür.</strong> Tanım kümesindeki ilk önemsiz kısıtlama burada ortaya çıkar: paydanın sıfıra eşit olduğu her $x$'i hariç tutmamız gerekir, çünkü sıfıra bölme tanımsızdır. Bu dışlanan noktalar genellikle (ama her zaman değil) <em>dikey asimptot</em> hâline gelir — fonksiyonun $\\pm\\infty$'a fırladığı $x$ değerleri.</div>

<p class="l-text">Resmî olarak, bir <strong>rasyonel fonksiyon</strong>:</p>

<div class="calc-formula"><div class="formula-label">RASYONEL FONKS&#304;YON &mdash; TANIM</div><div class="formula-main">$$f(x) \\;=\\; \\frac{P(x)}{Q(x)}, \\qquad P, Q \\text{ polinom}, \\; Q(x) \\not\\equiv 0.$$</div><div class="formula-sub">Doğal tanım kümesi $\\{x \\in \\mathbb{R} : Q(x) \\neq 0\\}$ — paydanın kökleri hariç tüm reel sayılar.</div></div>

<p class="l-text">Polinomların kendisi özel bir durumdur: $Q(x) = 1$ alın, $f = P$ olur. İlginç yeni davranış, $Q$'nun $P$ ile paylaşmadığı kökleri olduğunda ortaya çıkar — bunlar <em>gerçek</em> tekilliklerdir ve asimptotlara yol açar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dikey asimptot</div><div class="card-body">$Q$'nun her kökü $x = a$'da, eğer (sadeleştirme sonrası) $P$'nin de kökü değilse, fonksiyon ıraksar. $x = a$'da kesik dikey çizgi çizin.</div></div>
<div class="calc-card"><div class="card-title">Yatay asimptot</div><div class="card-body">$\\deg P < \\deg Q$ ise asimptot $y = 0$. $\\deg P = \\deg Q$ ise asimptot $y = a_n / b_n$ (baş katsayıların oranı). $\\deg P > \\deg Q$ ise yatay asimptot yoktur.</div></div>
<div class="calc-card"><div class="card-title">Kaldırılabilir delik</div><div class="card-body">Aynı çarpan $P$ ve $Q$'dan sadeleşirse, o noktadaki tekillik grafikte bir "delik"tir, dikey asimptot değil.</div></div>
</div>

<div class="calc-example"><div class="example-label">&Ccedil;&Ouml;Z&Uuml;ML&Uuml; &Ouml;RNEK</div><div class="example-body">$f(x) = (x + 1)/(x^2 - 4)$'ün doğal tanım kümesini bulun.<br><br>Paydayı sıfıra eşitleyin: $x^2 - 4 = 0 \\Rightarrow x = \\pm 2$. Dışlanan noktalar: $\\{-2, 2\\}$. Tanım kümesi: $\\mathbb{R} \\setminus \\{-2, 2\\}$. Fonksiyonun $x = -2$ ve $x = 2$'de dikey asimptotları vardır (hiçbiri paydan sadeleşmiyor). $\\deg P = 1 < \\deg Q = 2$ olduğundan yatay asimptot $y = 0$'dır.</div></div>

<div class="calc-graph"><div id="plot-l41-rational-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafikte:</strong> klasik rasyonel fonksiyon $y = 1/x$ ve asimptotları. İki dal karşıt bölgelerdedir (I ve III). $x = 0$ dikey doğrusu ve $y = 0$ yatay doğrusu kesik çizilmiştir, çünkü grafik onlara asla dokunmaz — sadece limit olarak yaklaşır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];for(var i=-30;i<=-2;i++)xL.push(i/10);
var xR=[];for(var i=2;i<=30;i++)xR.push(i/10);
var yL=xL.map(function(v){return 1/v;});
var yR=xR.map(function(v){return 1/v;});
var tL={x:xL,y:yL,mode:'lines',name:'y = 1/x (sol dal)',line:{color:'#3b82f6',width:2.5}};
var tR={x:xR,y:yR,mode:'lines',name:'y = 1/x (sa&#287; dal)',line:{color:'#3b82f6',width:2.5},showlegend:false};
var vAsym={x:[0,0],y:[-10,10],mode:'lines',name:'x = 0 (dikey asimptot)',line:{color:'#f87171',width:1.6,dash:'dash'}};
var hAsym={x:[-3,3],y:[0,0],mode:'lines',name:'y = 0 (yatay asimptot)',line:{color:'#fbbf24',width:1.6,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-3,3]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-6,6]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l41-rational-tr',[tL,tR,vAsym,hAsym],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">DENET&#304;M NOKTASI</div><div class="think-body">$f(x) = 3/(x - 5)$'in doğal tanım kümesi nedir? Cevap: $\\mathbb{R} \\setminus \\{5\\}$, çünkü payda yalnızca $x = 5$'te sıfırlanır. Grafiğin $x = 5$'te dikey asimptotu ve $y = 0$'da yatay asimptotu vardır.</div></div>

<h2 class="lesson-title">6. K&ouml;kl&uuml; Fonksiyon &mdash; $y = \\sqrt{x}$</h2>

<div class="calc-highlight"><strong>Tanım kümesi kısıtlamasının ikinci kaynağı: karekökler.</strong> Negatif bir sayının karekökü reel bir sayı değildir. Bu nedenle formülde $\\sqrt{\\text{ifade}}$ varsa, ifadenin negatif olmamasını istemeliyiz. Küp kökler ise tüm reel sayılar için tanımlıdır (çünkü negatifin küp kökünü alabiliriz — $\\sqrt[3]{-8} = -2$ tamamen anlamlıdır).</div>

<p class="l-text">Temel <strong>karekök fonksiyonu</strong>:</p>

<div class="calc-formula"><div class="formula-label">KAREK&Ouml;K FONKS&#304;YONU</div><div class="formula-main">$$f(x) \\;=\\; \\sqrt{x}, \\qquad x \\geq 0.$$</div><div class="formula-sub">Tanım kümesi $[0, \\infty)$, görüntü kümesi $[0, \\infty)$. Grafik orijinden başlar ve sağ üste yavaşça yükselir — yan parabolün sağ yarısı.</div></div>

<p class="l-text">Daha genel olarak, karekök içindeki herhangi bir fonksiyon için kök içi şu koşulu sağlamalıdır:</p>

<div class="calc-formula"><div class="formula-label">$\\sqrt{g(x)}$ &#304;&Ccedil;&#304;N TANIM K&Uuml;MES&#304; KO&#350;ULU</div><div class="formula-main">$$g(x) \\;\\geq\\; 0.$$</div></div>

<p class="l-text"><strong>Küp kök.</strong> $f(x) = \\sqrt[3]{x}$ fonksiyonunun tanım kümesi $\\mathbb{R}$ ve görüntü kümesi $\\mathbb{R}$'dir — kısıtlama yoktur. Grafiği tek bir yansımadır: orijinden geçerek yükselir, $x = 0$'da sonsuz eğimle, negatif girdiler için sorunsuz biçimde üçüncü bölgeye uzanır. Daha genel olarak, $\\sqrt[n]{x}$'in tanım kümesi $n$ tek olduğunda $\\mathbb{R}$, $n$ çift olduğunda $[0, \\infty)$'dur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sqrt{x}$ (&ccedil;ift k&ouml;k)</div><div class="card-body">Tanım kümesi $[0, \\infty)$, görüntü kümesi $[0, \\infty)$. Orijinden başlar, sınırsız artar ama eğim azalır.</div></div>
<div class="calc-card"><div class="card-title">$\\sqrt[3]{x}$ (tek k&ouml;k)</div><div class="card-body">Tanım kümesi $\\mathbb{R}$, görüntü kümesi $\\mathbb{R}$. $x \\to -x, y \\to -y$ altında simetriktir (tek fonksiyon). Orijinde dikey teğet.</div></div>
<div class="calc-card"><div class="card-title">Bile&#351;ik k&ouml;k i&ccedil;i</div><div class="card-body">$\\sqrt{g(x)}$ için: $g(x) \\geq 0$'ı çözerek tanım kümesini bulun. Örnek: $\\sqrt{x - 3}$ için tanım kümesi $[3, \\infty)$.</div></div>
</div>

<div class="calc-example"><div class="example-label">&Ccedil;&Ouml;Z&Uuml;ML&Uuml; &Ouml;RNEK</div><div class="example-body">$f(x) = \\sqrt{2x + 6}$'nın doğal tanım kümesini bulun.<br><br>Kök içinin negatif olmaması koşulu: $2x + 6 \\geq 0 \\Rightarrow x \\geq -3$. Tanım kümesi $[-3, \\infty)$.</div></div>

<div class="l-note"><strong>Bileşik durum &mdash; iki kısıtlama bir arada.</strong> $f(x) = \\sqrt{x + 2} / (x - 4)$'ü düşünün. İki koşul: (i) $x + 2 \\geq 0 \\Rightarrow x \\geq -2$ ve (ii) $x - 4 \\neq 0 \\Rightarrow x \\neq 4$. Birleştirilince: tanım kümesi $[-2, 4) \\cup (4, \\infty)$. Her kısıtlamayı ayrı ayrı ele alın, sonra cevapları kesiştirin.</div>

<h2 class="lesson-title">7. Mutlak De&#287;er Fonksiyonu &mdash; $y = |x|$</h2>

<div class="calc-highlight"><strong>Orijinden uzaklık.</strong> Bir sayının mutlak değeri, onun sayı doğrusunda $0$'a olan uzaklığıdır. Uzaklık her zaman negatif değildir, bu nedenle her reel $x$ için $|x| \\geq 0$. $y = |x|$'in grafiği mükemmel bir V şeklidir — orijinde dik açıda buluşan iki düz çizgi.</div>

<p class="l-text">Resmî olarak, <strong>mutlak değer fonksiyonu</strong> parçalı olarak tanımlanır:</p>

<div class="calc-formula"><div class="formula-label">MUTLAK DE&#286;ER FONKS&#304;YONU</div><div class="formula-main">$$|x| \\;=\\; \\begin{cases} x & x \\geq 0 \\text{ ise} \\\\ -x & x < 0 \\text{ ise} \\end{cases}$$</div><div class="formula-sub">Negatif olmayan girdiler için çıktı girdiye eşittir. Negatif girdiler için çıktı, girdinin pozitife çevrilmiş hâlidir. Tanım kümesi $\\mathbb{R}$, görüntü kümesi $[0, \\infty)$.</div></div>

<p class="l-text">İki durumlu tanım, V'ye orijindeki keskin köşesini verir: sağ kol $y = x$'tir (eğim $+1$), sol kol $y = -x$'tir (eğim $-1$). Tepe noktası tam olarak $(0, 0)$'da buluşurlar.</p>

<div class="calc-graph"><div id="plot-l41-abs-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafikte:</strong> $y = |x|$ V şekli ve iki dönüşümü. $|x - 2|$ fonksiyonu, V'nin $2$ birim sağa kaydırılmış hâlidir (tepe $(2, 0)$). $|x| + 1$ fonksiyonu V'nin $1$ birim yukarı kaldırılmış hâlidir (tepe $(0, 1)$). Şekil sabittir; yalnızca konumu hareket eder.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var x=[];for(var i=-50;i<=50;i++)x.push(i/10);
var y1=x.map(function(v){return Math.abs(v);});
var y2=x.map(function(v){return Math.abs(v-2);});
var y3=x.map(function(v){return Math.abs(v)+1;});
var t1={x:x,y:y1,mode:'lines',name:'y = |x|',line:{color:'#3b82f6',width:2.5}};
var t2={x:x,y:y2,mode:'lines',name:'y = |x - 2|',line:{color:'#10b981',width:2.5}};
var t3={x:x,y:y3,mode:'lines',name:'y = |x| + 1',line:{color:'#f87171',width:2.5}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-5,5]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-0.5,6]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l41-abs-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Temel dönüşümler.</strong> $|x - h| + k$ örüntüsü, tepe noktası $(h, k)$ olan bir V'dir. $a|x|$ örüntüsü V'yi dikey olarak gerer veya sıkıştırır (ve $a < 0$ ise yansıtır). Birlikte istediğiniz tepe noktası ve istediğiniz açılma yönüne sahip bir V yerleştirebilirsiniz.</p>

<div class="calc-example"><div class="example-label">&Ccedil;&Ouml;Z&Uuml;ML&Uuml; &Ouml;RNEK</div><div class="example-body">$f(x) = |x + 3| - 2$'yi çizin. $|x - h| + k$ örüntüsünde $h = -3$, $k = -2$ verir; tepe noktası $(-3, -2)$ olan, yukarı açılan bir V. İki kol eğimleri $+1$ ve $-1$, standart $|x|$ ile yalnızca konum bakımından farklıdır.</div></div>

<div class="l-note"><strong>Karekökle bağlantı.</strong> Faydalı bir özdeşlik: $|x| = \\sqrt{x^2}$. Kare önce negatif işareti yok eder, sonra ana karekök pozitif değeri döndürür. Daha sonra uzaklıkları hesaplarken bu standart hile olacaktır.</div>

<h2 class="lesson-title">8. &Uuml;stel ve Logaritmik &mdash; Kısa Hatırlatma</h2>

<div class="calc-highlight"><strong>Bunlarla Ders 35&ndash;37'de tanıştınız.</strong> Polinom olmayan, kendi özel grafikleri ve özellikleri olan ailelerdir. Burada yalnızca katalogun tamamlanması için listeliyoruz; tam tedavi için o derslere geri dönün.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">&Uuml;stel</div><div class="card-body">$f(x) = a^x$, $a > 0$, $a \\neq 1$ ile. Tanım kümesi $\\mathbb{R}$, görüntü kümesi $(0, \\infty)$. $(0, 1)$'den geçer. $a > 1$ ise artan, $0 < a < 1$ ise azalan. Yatay asimptot $y = 0$. (Ders 35.)</div></div>
<div class="calc-card"><div class="card-title">Logaritmik</div><div class="card-body">$f(x) = \\log_a x$, $a > 0$, $a \\neq 1$ ile. Tanım kümesi $(0, \\infty)$, görüntü kümesi $\\mathbb{R}$. $(1, 0)$'dan geçer. $a^x$'in tersi. Dikey asimptot $x = 0$. (Ders 36.)</div></div>
<div class="calc-card"><div class="card-title">Do&#287;al &uuml;stel / log</div><div class="card-body">Özel tabanlar $e \\approx 2.71828$ ve $\\ln = \\log_e$. $(e^x, \\ln x)$ çifti, kalkülüs dostu varsayılandır. (Ders 37.)</div></div>
</div>

<p class="l-text">Bu aileleri polinom ve rasyonellerden ayıran kilit özellik, değişkenin rolüdür. Polinomlarda $x$ <em>tabandadır</em>; üs sabittir. Üstellerde $x$ <em>üstedir</em>; taban sabittir. Bu konumsal yer değiştirme, temelden farklı büyüme (veya azalma) davranışı yaratır: üsteller, eninde sonunda her polinomu geride bırakır.</p>

<h2 class="lesson-title">9. Trigonometrik Fonksiyonlar &mdash; Kısa Hatırlatma</h2>

<div class="calc-highlight"><strong>Trigonometri parkurunda ayrıntılı işlenir.</strong> Altı trig fonksiyonu (sinüs, kosinüs, tanjant, kotanjant, sekant, kosekant) <em>periyodiktir</em>: grafikleri sabit aralıklarla tekrarlanır. Bu, hiçbir polinom ya da rasyonel fonksiyonun sahip olamayacağı bir özelliktir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sin&uuml;s $\\sin x$</div><div class="card-body">Tanım kümesi $\\mathbb{R}$, görüntü kümesi $[-1, 1]$. Periyot $2\\pi$. Orijinden geçer; $-1$ ile $+1$ arasında salınır. (Trig Ders 2.)</div></div>
<div class="calc-card"><div class="card-title">Kosin&uuml;s $\\cos x$</div><div class="card-body">Tanım kümesi $\\mathbb{R}$, görüntü kümesi $[-1, 1]$. Periyot $2\\pi$. $(0, 1)$'den geçer. Sinüsün kaydırılmış hâli: $\\cos x = \\sin(x + \\pi/2)$.</div></div>
<div class="calc-card"><div class="card-title">Tanjant $\\tan x$</div><div class="card-body">Tanım kümesi $\\mathbb{R} \\setminus \\{\\pi/2 + k\\pi\\}$. Görüntü kümesi $\\mathbb{R}$. Periyot $\\pi$. Her $\\pi/2 + k\\pi$ noktasında dikey asimptot.</div></div>
</div>

<p class="l-text">Trigonometrik fonksiyonlar açılar ile oranlar arasındaki köprüdür. Fizik ve mühendislikteki her dalga, salınım, titreşim ya da dönme, nihayetinde bir veya birden fazlasını kullanır. Katalogun tamamlanması için burada bahsediyoruz; cebirsel özellikler ve tam grafikler için Trig derslerine bakın.</p>

<h2 class="lesson-title">10. Klasik Alı&#351;tırmalar &mdash; Aileyi Tanıyın</h2>

<p class="l-text">Katalogu birleştiren sekiz kısa alıştırma. Önce kendiniz çözmeyi deneyin, sonra çözümlü açıklamayı okuyun.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; FORM&Uuml;LDEN A&#304;LE</div><div class="example-body"><strong>$f(x) = 7x - 2$'nin ailesini söyleyin.</strong><br><br>İki parametre $m = 7$ ve $b = -2$, $1$'den yüksek kuvvet yok. <strong>Doğrusal fonksiyon</strong>. Eğim $7$, $y$-kesim noktası $-2$. Tanım kümesi ve görüntü kümesi $\\mathbb{R}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; FORM&Uuml;LDEN A&#304;LE</div><div class="example-body"><strong>$g(x) = 5$'in ailesini söyleyin.</strong><br><br>Formülde $x$ hiç yok. <strong>Sabit fonksiyon</strong>. $y = 5$'te yatay doğru. Görüntü kümesi tek nokta $\\{5\\}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; FORM&Uuml;LDEN A&#304;LE</div><div class="example-body"><strong>$h(x) = -3x^2 + x + 1$'in ailesini söyleyin.</strong><br><br>En yüksek kuvvet $x^2$. <strong>Karesel fonksiyon</strong>, $a = -3 < 0$, yani parabol aşağı açılır. Tepe noktası maksimum. $x_T = -1/(2 \\cdot (-3)) = 1/6$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; POL&#304;NOMUN DERECES&#304;</div><div class="example-body"><strong>$p(x) = 4x^5 - 2x^3 + 7x - 9$'un derecesi nedir?</strong><br><br>$x$'in görünen en yüksek kuvveti $x^5$. <strong>Derece $5$ (kuintik)</strong>. Baş katsayı $a_5 = 4 > 0$, tek derece, dolayısıyla uç davranış: solda iner, sağda yükselir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; RASYONELDE TANIM K&Uuml;MES&#304;</div><div class="example-body"><strong>$f(x) = (2x + 1)/(x^2 - 9)$'un doğal tanım kümesini bulun.</strong><br><br>Paydayı sıfıra eşitleyin: $x^2 - 9 = 0 \\Rightarrow x = \\pm 3$. Dışlanan: $\\{-3, 3\\}$. <strong>Tanım kümesi: $\\mathbb{R} \\setminus \\{-3, 3\\}$</strong>. $\\pm 3$'te dikey asimptotlar.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; KAREK&Ouml;KTE TANIM K&Uuml;MES&#304;</div><div class="example-body"><strong>$g(x) = \\sqrt{9 - x^2}$'in doğal tanım kümesini bulun.</strong><br><br>$9 - x^2 \\geq 0 \\Rightarrow x^2 \\leq 9 \\Rightarrow -3 \\leq x \\leq 3$ koşulunu sağlayın. <strong>Tanım kümesi: $[-3, 3]$</strong>. (Grafik, yarıçapı $3$ olan dairenin üst yarısıdır.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; MUTLAK DE&#286;ER &Ccedil;&Ouml;Z</div><div class="example-body"><strong>$|x - 4| = 7$'yi çözün.</strong><br><br>Tanım gereği $|y| = 7 \\Leftrightarrow y = \\pm 7$. Dolayısıyla $x - 4 = 7$ ya da $x - 4 = -7$, yani $x = 11$ ya da $x = -3$. <strong>Çözümler: $\\{-3, 11\\}$</strong>. Geometrik anlam: $4$'e uzaklığı $7$ olan iki sayı.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; FORM&Uuml;L&Uuml; GRAF&#304;KLE E&#350;LE&#350;T&#304;R</div><div class="example-body"><strong>Aşağıda dört formül var. Her birini zihninizde çizin ve dört grafik siluetinden birine atayın: düz çizgi / parabol / hiperbol dalı / V şekli.</strong><br><br>(a) $y = -2x + 1$ &rarr; düz çizgi (doğrusal).<br>(b) $y = x^2 - 4$ &rarr; yukarı açılan parabol, tepe $(0, -4)$.<br>(c) $y = 2/x$ &rarr; I ve III bölgelerinde iki hiperbol dalı.<br>(d) $y = |x - 1|$ &rarr; V şekli, tepe $(1, 0)$.</div></div>

<div class="l-note"><strong>İleri bakış.</strong> Ders 42, fonksiyon cebirine başlar: iki fonksiyonu toplama, çıkarma, çarpma, bölme ve (en önemlisi) <em>bileştirme</em>. Devam etmeden önce bugünün dersindeki yedi ailenin her birinin hem formülden hem de çizimden tanıdık geldiğinden emin olun.</div>

<h2 class="lesson-title">11. Yan Yana Kar&#351;ıla&#351;tırma</h2>

<p class="l-text">En çok karşılaşılan altı aileyi tek bir eksen takımı üzerinde karşılaştıran tek panel, siluetleri anında belirgin kılar: her eğrinin kendi rengi vardır ve göz, tek bir bakışta şekli formülle eşleştirmeyi öğrenir.</p>

<div class="calc-graph"><div id="plot-l41-compare-tr-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafikte ne görüyoruz:</strong> tek panelde altı fonksiyon ailesi &mdash; doğrusal $y = 2x + 1$ (mavi), karesel $y = x^2$ (yeşil), kübik $y = x^3$ (kehribar), rasyonel $y = 1/x$ iki dalla (kırmızı), karekök $y = \\sqrt{x}$ yalnızca $x \\geq 0$ için tanımlı (mor) ve mutlak değer $y = |x|$ (camgöbeği). Bunu görsel bir bellek aracı olarak kullanın: her siluet benzersizdir ve yeni bir fonksiyonu sınıflandırmanın ilk adımı silueti tanımaktır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xFull=[];for(var i=-40;i<=40;i++)xFull.push(i/10);
var xPos=[];for(var i=0;i<=40;i++)xPos.push(i/10);
var xRatL=[];for(var i=-40;i<=-3;i++)xRatL.push(i/10);
var xRatR=[];for(var i=3;i<=40;i++)xRatR.push(i/10);
var tLin={x:xFull,y:xFull.map(function(v){return 2*v+1;}),mode:'lines',name:'doğrusal y = 2x + 1',line:{color:'#3b82f6',width:2.4}};
var tQuad={x:xFull,y:xFull.map(function(v){return v*v;}),mode:'lines',name:'karesel y = x²',line:{color:'#10b981',width:2.4}};
var tCub={x:xFull,y:xFull.map(function(v){return v*v*v;}),mode:'lines',name:'kübik y = x³',line:{color:'#fbbf24',width:2.4}};
var tRatL={x:xRatL,y:xRatL.map(function(v){return 1/v;}),mode:'lines',name:'rasyonel y = 1/x',line:{color:'#f87171',width:2.4}};
var tRatR={x:xRatR,y:xRatR.map(function(v){return 1/v;}),mode:'lines',name:'rasyonel y = 1/x',line:{color:'#f87171',width:2.4},showlegend:false};
var tSqrt={x:xPos,y:xPos.map(function(v){return Math.sqrt(v);}),mode:'lines',name:'karekök y = √x',line:{color:'#a78bfa',width:2.4}};
var tAbs={x:xFull,y:xFull.map(function(v){return Math.abs(v);}),mode:'lines',name:'mutlak değer y = |x|',line:{color:'#22d3ee',width:2.4}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-4,4]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-6,6]},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.14,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l41-compare-tr-extra',[tLin,tQuad,tCub,tRatL,tRatR,tSqrt,tAbs],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Aşağıdaki özet tablo on fonksiyon ailesini, genel biçimini, somut bir örneğini ve grafik şeklini bir arada gösterir &mdash; tanımadığınız bir formülle karşılaştığınızda geri dönebileceğiniz hızlı bir referans kartı.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">T&uuml;r</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Genel bi&ccedil;im</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">&Ouml;rnek</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Grafik &#351;ekli</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Doğrusal</td><td style="padding:0.5rem 0.8rem">$f(x) = mx + b$</td><td style="padding:0.5rem 0.8rem">$y = 2x + 1$</td><td style="padding:0.5rem 0.8rem">Düz çizgi</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Karesel</td><td style="padding:0.5rem 0.8rem">$f(x) = ax^2 + bx + c$</td><td style="padding:0.5rem 0.8rem">$y = x^2$</td><td style="padding:0.5rem 0.8rem">Parabol (U / &Cap;)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Kübik</td><td style="padding:0.5rem 0.8rem">$f(x) = ax^3 + bx^2 + cx + d$</td><td style="padding:0.5rem 0.8rem">$y = x^3$</td><td style="padding:0.5rem 0.8rem">Orijinden geçen S eğrisi</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Polinom (derece $n$)</td><td style="padding:0.5rem 0.8rem">$f(x) = a_n x^n + \\dots + a_0$</td><td style="padding:0.5rem 0.8rem">$y = x^4 - 3x^2 + 1$</td><td style="padding:0.5rem 0.8rem">Düzgün, en fazla $n - 1$ dönüş</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Rasyonel</td><td style="padding:0.5rem 0.8rem">$f(x) = P(x) / Q(x)$</td><td style="padding:0.5rem 0.8rem">$y = 1/x$</td><td style="padding:0.5rem 0.8rem">Hiperbol dalları, asimptotlar</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Karekök</td><td style="padding:0.5rem 0.8rem">$f(x) = \\sqrt{g(x)}$</td><td style="padding:0.5rem 0.8rem">$y = \\sqrt{x}$</td><td style="padding:0.5rem 0.8rem">Yarım parabol, $x \\geq 0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Üstel</td><td style="padding:0.5rem 0.8rem">$f(x) = a^x$, $a > 0$, $a \\neq 1$</td><td style="padding:0.5rem 0.8rem">$y = 2^x$</td><td style="padding:0.5rem 0.8rem">Hızlı büyüme (ya da azalma), $y > 0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Logaritmik</td><td style="padding:0.5rem 0.8rem">$f(x) = \\log_a x$</td><td style="padding:0.5rem 0.8rem">$y = \\ln x$</td><td style="padding:0.5rem 0.8rem">Yavaş büyüme, $x > 0$, $x = 0$'da asimptot</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Mutlak değer</td><td style="padding:0.5rem 0.8rem">$f(x) = |g(x)|$</td><td style="padding:0.5rem 0.8rem">$y = |x|$</td><td style="padding:0.5rem 0.8rem">Köşeli V şekli</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Parçalı</td><td style="padding:0.5rem 0.8rem">$f(x) = \\begin{cases} g_1(x), & x \\in I_1 \\\\ g_2(x), & x \\in I_2 \\end{cases}$</td><td style="padding:0.5rem 0.8rem">$y = \\text{sgn}(x)$</td><td style="padding:0.5rem 0.8rem">Aralıklarda farklı eğriler</td></tr>
</tbody></table>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">&Ouml;ZET &Ccedil;IKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Doğrusal $y = mx + b$: düz çizgi, eğim $m$, kesim $b$, hem tanım kümesi hem görüntü kümesi $\\mathbb{R}$.</li>
<li>Sabit $y = c$: yatay doğru, görüntü kümesi tek nokta $\\{c\\}$.</li>
<li>Karesel $y = ax^2 + bx + c$: tepe noktası $x = -b/(2a)$ olan parabol. $a > 0$ ise yukarı, $a < 0$ ise aşağı açılır.</li>
<li>$n$ dereceli polinom: düzgün, $\\mathbb{R}$ üzerinde tanımlı, en fazla $n - 1$ dönme noktası, en fazla $n$ reel kök.</li>
<li>Rasyonel $P/Q$: tanım kümesi $Q$'nun köklerini dışlar. Orada olası dikey asimptotlar; yatay asimptot derece karşılaştırmasına bağlı.</li>
<li>Karekök $\\sqrt{g(x)}$: tanım kümesi için $g(x) \\geq 0$. Küp kök tüm $\\mathbb{R}$ üzerinde tanımlıdır.</li>
<li>Mutlak değer $|x|$: V şekli, tepe orijinde, görüntü $[0, \\infty)$. $|x - h| + k$ formundaki dönüşümler tepeyi $(h, k)$'ye taşır.</li>
</ul>
</div>`
};
