window.LISE_MAT_L26 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Optimization is the art of finding the best.</strong> Out of all rectangles with a perimeter of 100 metres, which has the greatest area? Out of all soup cans with a fixed volume, which uses the least metal? Out of all production levels for a factory, which maximises profit? Questions of this shape appear everywhere — in geometry, economics, physics, biology, engineering — and they all share a single mathematical structure. You write down the quantity you want to make as large or as small as possible, you express it as a function of a single variable, and then you use the derivative to find the value at which the function attains its extreme.</p>

<p class="l-text">This lesson teaches you the standard five-step recipe and then walks through seven classical optimisation problems that have shaped two centuries of applied mathematics. By the end you will be able to translate a word problem into a function on an interval, locate its extreme value using $f'(x) = 0$, and confirm the answer with the Second Derivative Test or a boundary check. The skill you build here is the same one engineers and economists use every day — but the questions are written in the language of high school geometry and algebra so that nothing distracts you from the core idea.</p>

<div class="lesson-outcomes" style="background:rgba(168,85,247,0.06);border-left:3px solid #a855f7;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#a855f7;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read a word problem and identify the quantity to be maximised or minimised</li>
<li>Apply the standard five-step optimisation recipe (variable, formula, constraint, derivative, verify)</li>
<li>Solve fixed-perimeter and fixed-volume problems and recognise their hidden symmetries</li>
<li>Optimise material-use problems such as the can design and the open-top box</li>
<li>Find the point on a curve closest to a given external point</li>
<li>Apply optimisation to economics (maximum profit) and physics (Snell's law / least-time path)</li>
<li>Use the Second Derivative Test or a boundary check to confirm that a critical number is the true optimum</li>
</ul>
</div>

<h2 class="l-title">1. What Optimisation Means</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> a farmer has 100 metres of fence and wants to enclose the largest possible rectangular field along a straight wall. A canning company wants to pack a fixed volume of tomato sauce inside the smallest possible amount of tin. A shopkeeper wants to price a coat so that profit is maximum. In every case the question is the same — out of many possible designs, which one is best? Optimisation is the mathematics of choosing the best.</div>

<p class="l-text">An <strong>optimisation problem</strong> consists of two ingredients. First, an <em>objective</em> — a quantity (area, volume, cost, profit, time, distance) that you want to make as large or as small as possible. Second, one or more <em>constraints</em> — relations between the variables that any acceptable design must respect (a perimeter, a volume, a budget, a physical inequality). The optimum is the value of the design variable that pushes the objective to its extreme while staying inside the constraint set.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Objective function</div><div class="card-body">The quantity you want to maximise or minimise. We will always be able to write it as a function $f(x)$ of a single design variable $x$ (or, in section 10, of two variables).</div></div>
<div class="calc-card"><div class="card-title">Constraint</div><div class="card-body">A relation that the variables must obey — for example, "the perimeter is 100" or "the volume is 1 litre." Constraints let you eliminate variables and reduce the problem to one unknown.</div></div>
<div class="calc-card"><div class="card-title">Feasible set</div><div class="card-body">The interval (or region) of $x$ values that satisfy every constraint. Side lengths must be positive, prices must be non-negative, and so on.</div></div>
<div class="calc-card"><div class="card-title">Extreme value</div><div class="card-body">The maximum or minimum of $f(x)$ over the feasible set. It can occur either at a critical point inside the interval or at an endpoint.</div></div>
</div>

<div class="l-note"><strong>Connection to lessons 22–25.</strong> The derivative tools you built up — critical numbers, sign charts, the First and Second Derivative Tests, and the Extreme Value Theorem — are precisely the machinery needed to solve optimisation problems. This lesson does not introduce any new calculus rules; it teaches you how to <em>apply</em> the ones you already know to real-world questions.</div>

<h2 class="l-title">2. The Standard Five-Step Recipe</h2>

<div class="calc-highlight"><strong>Every optimisation problem can be attacked with the same five-step procedure.</strong> Memorising the steps is more valuable than memorising any single problem — once you know the recipe, all the problems in this lesson collapse into routine applications of it.</div>

<div class="calc-formula"><div class="formula-label">FIVE-STEP RECIPE</div><div class="formula-main">$$\\boxed{\\begin{aligned}
& \\text{1. Define variables and draw a picture.} \\\\
& \\text{2. Write the objective as a function of the variables.} \\\\
& \\text{3. Use the constraint to reduce to one variable.} \\\\
& \\text{4. Differentiate, solve } f'(x) = 0, \\text{ and test.} \\\\
& \\text{5. Verify with } f''(x) \\text{ or by checking endpoints.}
\\end{aligned}}$$</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Define variables and draw</div><div class="step-detail">Read the problem twice. Identify what quantity is being optimised and what quantities you are free to choose. Give each unknown a clear letter. A small sketch — a rectangle with sides labelled, a cylinder with $h$ and $r$, a triangle with the relevant angle — saves an enormous amount of confusion. Always include units.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Write the objective</div><div class="step-detail">Express the quantity to be optimised as a formula. Examples: area $A = x \\cdot y$, surface area $S = 2\\pi r^2 + 2\\pi r h$, profit $P = (\\text{price})(\\text{quantity}) - (\\text{cost})$. At this stage the formula may involve several variables — that is perfectly normal.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Use the constraint to reduce</div><div class="step-detail">The constraint is an equation that links the variables. Solve it for one variable in terms of another, and substitute into the objective so that the objective becomes a function of <em>one</em> variable only. Identify the feasible interval (for example $0 < x < 50$).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Differentiate and solve</div><div class="step-detail">Compute $f'(x)$, solve $f'(x) = 0$, and collect the critical numbers that lie inside the feasible interval. These are your candidates for the optimum.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Verify the optimum</div><div class="step-detail">Apply the Second Derivative Test: if $f''(c) < 0$ the candidate $c$ is a local maximum, if $f''(c) > 0$ it is a local minimum. Alternatively, evaluate $f$ at the critical points and at the endpoints of the feasible interval and compare values directly (the Closed Interval Method from lesson 22). Convert back to the original variables and state the answer in plain language with units.</div></div></div>
</div>

<div class="l-note"><strong>Why the recipe always works.</strong> The Extreme Value Theorem (lesson 22) guarantees that a continuous function on a closed bounded interval attains both a maximum and a minimum. Optimum candidates can come only from critical points inside the interval or from the endpoints. The five-step recipe is simply a clean accounting of all those candidates.</div>

<h2 class="l-title">3. Classical Problem 1 — Maximum Area with Fixed Perimeter</h2>

<div class="calc-highlight"><strong>The question:</strong> a farmer has 100 metres of fence and wants to enclose a rectangular field of maximum area. Which rectangle should he choose?</div>

<p class="l-text">Let the sides of the rectangle be $x$ and $y$. The perimeter constraint is $2x + 2y = 100$, so $y = 50 - x$. The area is $A = xy = x(50 - x) = 50x - x^2$. The feasible interval is $0 < x < 50$ (each side must be positive).</p>

<div class="calc-formula"><div class="formula-label">OBJECTIVE AND CONSTRAINT</div><div class="formula-main">$$A(x) = 50x - x^2, \\qquad 0 < x < 50$$</div></div>

<div class="calc-example"><div class="example-label">WORKED SOLUTION</div><div class="example-body"><strong>Step 4.</strong> $A'(x) = 50 - 2x$. Setting $A'(x) = 0$ gives $x = 25$.<br><br><strong>Step 5.</strong> $A''(x) = -2 < 0$, so $x = 25$ is a local maximum. (Indeed, since $A''$ is negative everywhere, the parabola opens downward and the vertex is the global max.)<br><br>Then $y = 50 - 25 = 25$. The optimal rectangle is a <strong>square</strong> with side 25 m. Its area is $25 \\times 25 = 625$ m².<br><br><strong>Sanity check at endpoints.</strong> If $x \\to 0$ or $x \\to 50$ the rectangle collapses to a line and the area tends to 0. The maximum is genuinely interior.</div></div>

<div class="calc-graph"><div id="plot-l26-area-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the area $A(x) = x(50 - x)$ for a rectangle with perimeter 100. The function is an inverted parabola attaining its peak at $x = 25$, where the rectangle is a $25 \\times 25$ square. As $x$ moves toward either endpoint, the area collapses to zero.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=1;i<=49;i++){var x=i;xs.push(x);ys.push(x*(50-x));}
var curve={x:xs,y:ys,mode:'lines',name:'A(x) = x(50 - x)',line:{color:'#a855f7',width:3}};
var peak={x:[25],y:[625],mode:'markers+text',name:'maximum (25, 625)',marker:{color:'#fbbf24',size:14},text:['  max'],textposition:'top right',textfont:{color:'#fbbf24',size:12}};
var endL={x:[0],y:[0],mode:'markers',marker:{color:'#ef4444',size:8},showlegend:false};
var endR={x:[50],y:[0],mode:'markers',marker:{color:'#ef4444',size:8},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'side x (m)',range:[-1,51],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'area A (m²)',range:[-30,700],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l26-area-en',[curve,peak,endL,endR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">A GENERAL FACT</div><div class="think-body">Among all rectangles of a fixed perimeter, the square has the largest area. Among all rectangles of a fixed area, the square has the smallest perimeter. This is the simplest case of the much deeper <em>isoperimetric inequality</em>: among all closed plane curves of a fixed perimeter, the circle encloses the largest area. The Greeks proved a version of this two millennia before calculus.</div></div>

<div class="calc-example"><div class="example-label">VARIATION (FENCE AGAINST A WALL)</div><div class="example-body"><strong>Same farmer, but one side runs along a straight wall.</strong> No fence is needed along the wall, so the constraint becomes $x + 2y = 100$ (one length $x$ plus two widths $y$). The area is $A = xy = x \\cdot \\frac{100 - x}{2}$.<br><br>$A(x) = 50x - x^2/2$. Then $A'(x) = 50 - x$, $A'(x) = 0$ at $x = 50$. So $y = 25$ and the optimal field is $50 \\times 25 = 1250$ m². The wall doubles the enclosed area because the fence is no longer "wasted" on one side.</div></div>

<h2 class="l-title">4. Classical Problem 2 — Minimum Surface for Fixed Volume</h2>

<div class="calc-highlight"><strong>The question:</strong> a cylindrical can must hold exactly one litre (1000 cm³). What dimensions minimise the surface area of metal used?</div>

<p class="l-text">Let $r$ be the radius and $h$ the height of the cylinder. The volume constraint is $V = \\pi r^2 h = 1000$. The total surface area (top, bottom, and side) is $S = 2\\pi r^2 + 2\\pi r h$.</p>

<div class="calc-formula"><div class="formula-label">REDUCING TO ONE VARIABLE</div><div class="formula-main">$$h = \\frac{1000}{\\pi r^2} \\;\\Longrightarrow\\; S(r) = 2\\pi r^2 + 2\\pi r \\cdot \\frac{1000}{\\pi r^2} = 2\\pi r^2 + \\frac{2000}{r}$$</div></div>

<div class="calc-example"><div class="example-label">WORKED SOLUTION</div><div class="example-body"><strong>Step 4.</strong> Differentiate: $S'(r) = 4\\pi r - \\dfrac{2000}{r^2}$.<br><br>Set $S'(r) = 0$: $4\\pi r = \\dfrac{2000}{r^2}$, so $4\\pi r^3 = 2000$, giving $r^3 = \\dfrac{500}{\\pi}$.<br><br>Therefore $r = \\sqrt[3]{500/\\pi} \\approx 5.42$ cm.<br><br><strong>Then</strong> $h = \\dfrac{1000}{\\pi r^2} \\approx \\dfrac{1000}{\\pi \\cdot 29.4} \\approx 10.84$ cm.<br><br>Notice that $h \\approx 2r$: <strong>the optimal can has height equal to its diameter.</strong> This is the famous "$h = 2r$" rule.<br><br><strong>Step 5.</strong> $S''(r) = 4\\pi + \\dfrac{4000}{r^3} > 0$ for $r > 0$. So $r \\approx 5.42$ is a local minimum, and since $S''>0$ throughout, it is the global minimum on $(0, \\infty)$.</div></div>

<div class="calc-graph"><div id="plot-l26-can-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the surface $S(r) = 2\\pi r^2 + 2000/r$ as a function of the radius. The curve plunges from a large value (a thin tall tube has a huge side area) to a single minimum near $r \\approx 5.42$ cm, then climbs again (a wide flat tin has a huge top and bottom). The minimum point corresponds to $h = 2r$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=15;i<=140;i++){var r=i/10;xs.push(r);ys.push(2*Math.PI*r*r+2000/r);}
var curve={x:xs,y:ys,mode:'lines',name:'S(r) = 2πr² + 2000/r',line:{color:'#a855f7',width:3}};
var rstar=Math.pow(500/Math.PI,1/3);var sstar=2*Math.PI*rstar*rstar+2000/rstar;
var peak={x:[rstar],y:[sstar],mode:'markers+text',name:'min (r ≈ 5.42, h = 2r)',marker:{color:'#fbbf24',size:14},text:['  min'],textposition:'top right',textfont:{color:'#fbbf24',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'radius r (cm)',range:[1,14],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'surface S (cm²)',range:[400,1500],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l26-can-en',[curve,peak],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">REALITY CHECK</div><div class="think-body">Look at any soup can in a kitchen cupboard. The height is roughly twice the radius, exactly the optimum we just derived. Manufacturers settled on this proportion long before calculus was used to justify it — the savings on metal are real, the geometry is real, and centuries of practical engineering converged on the same answer that $S'(r) = 0$ gives in two lines.</div></div>

<h2 class="l-title">5. Classical Problem 3 — Can Design With a Lid Constraint</h2>

<div class="calc-highlight"><strong>Refinement:</strong> in practice the metal disc on top and bottom is cut from a square sheet, so the actual material cost is higher than the disc area. Re-solving with that more realistic cost shifts the optimum.</div>

<p class="l-text">Suppose the top and bottom must be cut from square sheets of side $2r$, so each disc consumes an area of $4r^2$ (the disc itself uses only $\\pi r^2$, but the corners are scrap). The total material function becomes</p>

<div class="calc-formula"><div class="formula-main">$$M(r) = 2 \\cdot 4r^2 + 2\\pi r h = 8r^2 + 2\\pi r h.$$</div><div class="formula-sub">The side $2\\pi r h$ is unchanged; only the top/bottom term grows.</div></div>

<div class="calc-example"><div class="example-label">WORKED SOLUTION</div><div class="example-body">With $h = 1000/(\\pi r^2)$:<br><br>$M(r) = 8r^2 + 2\\pi r \\cdot \\dfrac{1000}{\\pi r^2} = 8r^2 + \\dfrac{2000}{r}$.<br><br>$M'(r) = 16r - \\dfrac{2000}{r^2}$, set to zero: $16r^3 = 2000$, so $r^3 = 125$, $r = 5$ cm.<br><br>Then $h = \\dfrac{1000}{\\pi \\cdot 25} = \\dfrac{40}{\\pi} \\approx 12.73$ cm.<br><br>The optimal ratio is now $\\dfrac{h}{r} = \\dfrac{40/\\pi}{5} = \\dfrac{8}{\\pi} \\approx 2.55$. <strong>Slightly taller than the ideal mathematical can</strong> — exactly because the top and bottom are now more expensive per disc. This is closer to the proportions used for tall slim cans of energy drinks and tomato paste.</div></div>

<div class="l-note"><strong>Modelling lesson.</strong> The same problem can have several different "optimal" answers depending on which costs you actually charge against the metal. A purely geometric minimum gives $h = 2r$; a manufacturing minimum that punishes wasted corner material gives the taller $h/r \\approx 2.55$. Optimisation is honest about its assumptions — change the cost function and the optimum moves with it.</div>

<h2 class="l-title">6. Classical Problem 4 — Open-Top Box from a Square Sheet</h2>

<div class="calc-highlight"><strong>The question:</strong> from a square piece of cardboard of side 30 cm, cut equal squares of side $x$ from each corner and fold up the flaps to form an open-top box. Which $x$ gives the box of maximum volume?</div>

<p class="l-text">After folding, the base of the box is a square of side $30 - 2x$ and the height is $x$. The feasible interval is $0 < x < 15$ (so that the base side stays positive).</p>

<div class="calc-formula"><div class="formula-label">VOLUME FUNCTION</div><div class="formula-main">$$V(x) = x \\,(30 - 2x)^2, \\qquad 0 < x < 15$$</div></div>

<div class="calc-example"><div class="example-label">WORKED SOLUTION</div><div class="example-body">Expand or differentiate via the product rule:<br><br>$V'(x) = (30 - 2x)^2 + x \\cdot 2(30 - 2x)(-2) = (30 - 2x)[(30 - 2x) - 4x] = (30 - 2x)(30 - 6x)$.<br><br>$V'(x) = 0 \\iff 30 - 2x = 0$ or $30 - 6x = 0$, giving $x = 15$ (boundary, base = 0) or $\\mathbf{x = 5}$ (interior).<br><br>Test with $V''(x)$ or note that $V$ is zero at both endpoints and positive in between, so the interior critical number is the maximum.<br><br>At $x = 5$ cm: base $= 30 - 10 = 20$ cm, $V = 5 \\cdot 400 = 2000$ cm³.<br><br><strong>Cut a 5 cm square from each corner</strong> to maximise the volume of the box.</div></div>

<div class="calc-graph"><div id="plot-l26-box-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the volume $V(x) = x(30 - 2x)^2$ of the open-top box as a function of the corner-cut $x$. The curve starts at zero (no cut means no height), rises to a single peak at $x = 5$ cm where $V = 2000$ cm³, and falls back to zero at $x = 15$ (the base disappears).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=150;i++){var x=i/10;xs.push(x);ys.push(x*(30-2*x)*(30-2*x));}
var curve={x:xs,y:ys,mode:'lines',name:'V(x) = x(30 - 2x)²',line:{color:'#a855f7',width:3}};
var peak={x:[5],y:[2000],mode:'markers+text',name:'max (5, 2000)',marker:{color:'#fbbf24',size:14},text:['  max'],textposition:'top right',textfont:{color:'#fbbf24',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'corner cut x (cm)',range:[-0.5,15.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'volume V (cm³)',range:[-100,2200],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l26-box-en',[curve,peak],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">PATTERN TO REMEMBER</div><div class="think-body">If the sheet has side $a$, the optimal corner cut is $x = a/6$. (Differentiate $V = x(a - 2x)^2$ and verify.) So for a 30 cm sheet you cut 5 cm; for a 60 cm sheet you would cut 10 cm. The ratio is universal — write it down once, recall it forever.</div></div>

<h2 class="l-title">7. Classical Problem 5 — Closest Point on a Curve</h2>

<div class="calc-highlight"><strong>The question:</strong> find the point on the parabola $y = x^2$ that is closest to the external point $(3, 0)$.</div>

<p class="l-text">Let $(x, x^2)$ be a generic point on the parabola. The distance to $(3, 0)$ is</p>

<div class="calc-formula"><div class="formula-main">$$D(x) = \\sqrt{(x - 3)^2 + (x^2 - 0)^2} = \\sqrt{(x - 3)^2 + x^4}.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED SOLUTION</div><div class="example-body"><strong>Trick.</strong> Distance and squared distance are minimised at the same $x$, so we minimise the simpler function<br><br>$f(x) = (x - 3)^2 + x^4$.<br><br>$f'(x) = 2(x - 3) + 4x^3 = 4x^3 + 2x - 6$.<br><br>Set $f'(x) = 0$: $4x^3 + 2x - 6 = 0$, i.e. $2x^3 + x - 3 = 0$.<br><br>Try $x = 1$: $2 + 1 - 3 = 0$ ✓.<br><br>Factor: $2x^3 + x - 3 = (x - 1)(2x^2 + 2x + 3)$. The quadratic factor has discriminant $4 - 24 = -20 < 0$, so $x = 1$ is the unique real critical number.<br><br>$f''(x) = 12x^2 + 2$. $f''(1) = 14 > 0$ → local minimum.<br><br>So the closest point is $(1, 1)$, and the minimum distance is $\\sqrt{4 + 1} = \\sqrt{5} \\approx 2.236$.</div></div>

<div class="l-note"><strong>Geometric check.</strong> The line from $(3, 0)$ to the closest point $(1, 1)$ must be perpendicular to the tangent of the parabola at $(1, 1)$. The slope of the tangent is $2x = 2$. The slope of our line is $(1 - 0)/(1 - 3) = -1/2$. Their product is $2 \\cdot (-1/2) = -1$, confirming perpendicularity. This is a beautiful general fact: <em>the shortest segment from a point to a curve is perpendicular to the curve at the foot.</em></div>

<h2 class="l-title">8. Classical Problem 6 — Maximum Profit in Economics</h2>

<div class="calc-highlight"><strong>The question:</strong> a shop sells $q$ units of a product per week. Market research suggests the demand obeys the linear law $p = 100 - 2q$ (lira per unit). The cost of producing $q$ units is $C(q) = 200 + 20q$ lira. At what price $p$ and quantity $q$ is the weekly profit maximised?</div>

<p class="l-text">Revenue is price times quantity: $R(q) = p \\cdot q = (100 - 2q) q = 100q - 2q^2$. Profit is revenue minus cost:</p>

<div class="calc-formula"><div class="formula-label">PROFIT FUNCTION</div><div class="formula-main">$$P(q) = R(q) - C(q) = (100q - 2q^2) - (200 + 20q) = -2q^2 + 80q - 200.$$</div></div>

<div class="calc-example"><div class="example-label">WORKED SOLUTION</div><div class="example-body">$P'(q) = -4q + 80$. Set $P'(q) = 0$: $q = 20$.<br><br>$P''(q) = -4 < 0$ → local maximum (and global, since the profit is a downward parabola).<br><br>Optimal quantity: $q = 20$ units/week.<br>Optimal price: $p = 100 - 2 \\cdot 20 = 60$ lira/unit.<br>Maximum profit: $P(20) = -800 + 1600 - 200 = 600$ lira/week.<br><br><strong>Economic interpretation.</strong> $P'(q) = 0$ is exactly the marginal-revenue-equals-marginal-cost condition that all economics textbooks emphasise: $R'(q) = 100 - 4q = 20 = C'(q)$ at $q = 20$. Calculus turns this slogan into a calculation.</div></div>

<div class="l-note"><strong>Why is the demand curve downward sloping?</strong> Real markets reward lower prices with higher sales. The simplest model is the linear "demand curve" $p = a - b q$ with $a, b > 0$. Then revenue $R = pq = aq - bq^2$ is an inverted parabola — already telling you that there is a unique $q^*$ where revenue is greatest. Subtracting a linear cost preserves this shape, so profit also has a unique optimum.</div>

<h2 class="l-title">9. Classical Problem 7 — Least Time and Snell's Law</h2>

<div class="calc-highlight"><strong>A physics classic:</strong> a lifeguard standing at point $A$ on the beach must reach a swimmer at point $B$ in the water as fast as possible. The lifeguard runs at speed $v_1$ on the sand and swims at the lower speed $v_2$ in the water. Where on the shoreline should she enter the water?</div>

<p class="l-text">Place coordinates with the straight shoreline on the $x$-axis. Let $A = (0, a)$ on the sand and $B = (d, -b)$ in the water (so $a, b, d > 0$). Let $(x, 0)$ be the point where the lifeguard enters the water.</p>

<div class="calc-formula"><div class="formula-label">TOTAL TIME</div><div class="formula-main">$$T(x) = \\frac{\\sqrt{x^2 + a^2}}{v_1} + \\frac{\\sqrt{(d - x)^2 + b^2}}{v_2}$$</div><div class="formula-sub">First term: time running on the sand. Second term: time swimming in the water. The unknown $x$ is the entry point.</div></div>

<div class="calc-example"><div class="example-label">WORKED DERIVATION</div><div class="example-body">$T'(x) = \\dfrac{x}{v_1 \\sqrt{x^2 + a^2}} - \\dfrac{d - x}{v_2 \\sqrt{(d - x)^2 + b^2}}$.<br><br>Setting $T'(x) = 0$:<br><br>$\\dfrac{x}{v_1 \\sqrt{x^2 + a^2}} = \\dfrac{d - x}{v_2 \\sqrt{(d - x)^2 + b^2}}$.<br><br>Recognise the trigonometry: if $\\theta_1$ is the angle the running path makes with the perpendicular to the shoreline at $(x, 0)$, then $\\sin \\theta_1 = \\dfrac{x}{\\sqrt{x^2 + a^2}}$. Similarly $\\sin \\theta_2 = \\dfrac{d - x}{\\sqrt{(d - x)^2 + b^2}}$.<br><br>The equation becomes<br><br>$\\dfrac{\\sin \\theta_1}{v_1} = \\dfrac{\\sin \\theta_2}{v_2}, \\qquad \\text{i.e.} \\qquad \\boxed{\\dfrac{\\sin \\theta_1}{\\sin \\theta_2} = \\dfrac{v_1}{v_2}}.$<br><br>This is <strong>Snell's law of refraction</strong>. A light ray crossing from a fast medium to a slow medium bends at exactly the angle that minimises travel time — Fermat's principle of least time, derived here as a high school optimisation problem.</div></div>

<div class="l-note"><strong>A historical surprise.</strong> Snell discovered the experimental law of refraction in 1621. Fermat derived it from "least time" in 1662, before calculus was invented. With the derivative, the whole argument fits on one page. That a single calculus identity unifies a lifeguard's strategy and the bending of light is one of the most beautiful illustrations of why mathematics is worth learning.</div>

<h2 class="l-title">10. Two-Variable Optimisation — A Brief Look</h2>

<div class="calc-highlight"><strong>What if the objective depends on two free variables and we cannot eliminate one with a constraint?</strong> Then we need partial derivatives, and at university the technique is the famous <em>Lagrange multiplier</em> method. Here we just sketch the idea so that you know where this trail leads.</div>

<p class="l-text">For a function $f(x, y)$ of two variables, the analogue of "$f'(x) = 0$" is the system</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\partial f}{\\partial x} = 0, \\qquad \\frac{\\partial f}{\\partial y} = 0.$$</div><div class="formula-sub">A pair $(x, y)$ that solves both equations is a <em>critical point</em> of the two-variable function.</div></div>

<p class="l-text">A <strong>partial derivative</strong> $\\partial f / \\partial x$ is computed by treating $y$ as a constant and differentiating $f$ with respect to $x$ alone. For example, if $f(x, y) = x^2 + xy + y^2$ then $\\partial f/\\partial x = 2x + y$ and $\\partial f/\\partial y = x + 2y$. Solving the system gives $x = y = 0$, which is the global minimum.</p>

<div class="l-note"><strong>Lagrange multipliers (preview).</strong> When the optimisation is <em>constrained</em> — say maximise $f(x, y)$ subject to $g(x, y) = 0$ — at the optimum the gradient of $f$ is parallel to the gradient of $g$. Lagrange wrote this as $\\nabla f = \\lambda \\nabla g$ and turned it into a clean recipe. The single-variable five-step procedure of this lesson is the toy case of the general Lagrange method you will meet in your first calculus course at university.</div>

<h2 class="l-title">11. Classical Exercises (Word → Mathematics → Solution)</h2>

<div class="calc-example"><div class="example-label">EXERCISE 1 — RECTANGULAR PARK</div><div class="example-body"><strong>Problem.</strong> A municipality has 240 m of fencing for a rectangular park along a riverbank (no fence needed on the river side). What dimensions maximise area?<br><br><strong>Solution.</strong> Let $x$ = side parallel to river, $y$ = each side perpendicular. Then $x + 2y = 240$, $A = xy = x \\cdot \\dfrac{240 - x}{2} = 120x - x^2/2$. $A'(x) = 120 - x = 0 \\Rightarrow x = 120$ m, $y = 60$ m. $A_{\\max} = 7200$ m².</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — POSTER WITH MARGINS</div><div class="example-body"><strong>Problem.</strong> A poster has a printed area of 600 cm². Top and bottom margins are 4 cm each; side margins are 3 cm each. Find the overall dimensions of the poster that minimise its total area.<br><br><strong>Solution.</strong> Let the printed region have width $x$ and height $y$, with $xy = 600$. Total poster area $T = (x + 6)(y + 8) = xy + 8x + 6y + 48 = 600 + 8x + 6y + 48$. Eliminate: $y = 600/x$. $T(x) = 648 + 8x + 3600/x$. $T'(x) = 8 - 3600/x^2 = 0 \\Rightarrow x^2 = 450 \\Rightarrow x = 15\\sqrt{2} \\approx 21.2$ cm. Then $y = 600/x \\approx 28.3$ cm. Overall poster: $\\approx 27.2 \\times 36.3$ cm.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — INSCRIBED RECTANGLE</div><div class="example-body"><strong>Problem.</strong> Inscribe a rectangle with two sides on the $x$-axis inside the semicircle $y = \\sqrt{4 - x^2}$. What rectangle has maximum area?<br><br><strong>Solution.</strong> By symmetry put the rectangle with corners at $(\\pm x, 0)$ and $(\\pm x, \\sqrt{4 - x^2})$. Area $A(x) = 2x \\cdot \\sqrt{4 - x^2}$ for $0 < x < 2$. Maximise $A^2 = 4x^2(4 - x^2)$. Differentiate $f(x) = 16x^2 - 4x^4$: $f'(x) = 32x - 16x^3 = 16x(2 - x^2) = 0 \\Rightarrow x = \\sqrt{2}$. Height $= \\sqrt{4 - 2} = \\sqrt{2}$. The optimal rectangle is $2\\sqrt{2} \\times \\sqrt{2}$, area $= 4$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — LADDER AROUND A CORNER</div><div class="example-body"><strong>Problem.</strong> Two corridors of widths $a$ and $b$ meet at a right angle. What is the length of the longest straight ladder that can be carried horizontally around the corner?<br><br><strong>Solution.</strong> Let $\\theta$ be the angle the ladder makes with the first corridor. The ladder's length must satisfy $L(\\theta) = a/\\sin\\theta + b/\\cos\\theta$. The longest ladder that <em>fits</em> is the minimum of $L$ over $\\theta \\in (0, \\pi/2)$. $L'(\\theta) = -a\\cos\\theta/\\sin^2\\theta + b\\sin\\theta/\\cos^2\\theta = 0 \\Rightarrow \\tan^3\\theta = a/b$, i.e. $\\tan\\theta = (a/b)^{1/3}$. Substituting back gives $L_{\\min} = (a^{2/3} + b^{2/3})^{3/2}$. (For $a = b = 1$: $L_{\\min} = 2^{3/2} \\approx 2.83$.)</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — TICKET PRICE</div><div class="example-body"><strong>Problem.</strong> A cinema currently charges 50 lira per ticket and sells 400 tickets per night. Surveys show that each 1-lira <em>reduction</em> in price brings 20 extra ticket sales. What price maximises revenue?<br><br><strong>Solution.</strong> Let $x$ = number of 1-lira reductions. Price $p = 50 - x$, quantity $q = 400 + 20x$. Revenue $R(x) = (50 - x)(400 + 20x) = 20000 + 1000x - 400x - 20x^2 = 20000 + 600x - 20x^2$. $R'(x) = 600 - 40x = 0 \\Rightarrow x = 15$. Price $= 50 - 15 = 35$ lira; quantity $= 400 + 300 = 700$ tickets; revenue $= 35 \\cdot 700 = 24\\,500$ lira (an increase of 4500 over the original 20000).</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — FOLDED PAGE</div><div class="example-body"><strong>Problem.</strong> The lower right corner of an A4 page is folded over to touch the left edge. Find the position of the fold that gives the <em>shortest</em> crease.<br><br><strong>Solution.</strong> Let the page have width $w$. Let the corner land at distance $x$ from the bottom-left corner along the left edge. By geometry, the crease length is $L(x) = \\sqrt{x^2 \\cdot w^2 / (2wx - x^2)}$ for $w/2 \\leq x \\leq w$. Differentiating and setting $L'(x) = 0$ gives $x = 3w/4$. The optimal crease length is $L = \\dfrac{3\\sqrt{3}}{4} w$. (A classical Martin Gardner puzzle from 1957.)</div></div>

<div class="l-note"><strong>Closing thought.</strong> Every optimisation problem in this lesson — whether about fences or cans or boxes or light rays — was solved with the same five steps. Identify the objective; write the formula; reduce to one variable; differentiate and set to zero; verify with the Second Derivative Test. That single procedure carries you from a high school word problem to research-level engineering. The questions get harder, but the recipe stays the same. Optimisation is, in this sense, the very first technique of applied mathematics — and the calculator with which the rest of mathematics is most often used in the real world.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Optimizasyon, en iyiyi bulma sanatıdır.</strong> Çevresi 100 metre olan tüm dikdörtgenler arasında alanı en büyük olanı hangisidir? Sabit hacimli tüm konserve kutuları arasında en az metal kullanan hangisidir? Bir fabrikanın tüm üretim seviyeleri arasında karı maksimum yapan hangisidir? Bu biçimdeki sorular geometriden ekonomiye, fizikten biyolojiye, mühendislikten her yerde karşımıza çıkar — ve hepsi tek bir matematiksel yapıyı paylaşır. Olabildiğince büyük (ya da küçük) yapmak istediğin niceliği yaz, onu tek bir değişkenin fonksiyonu olarak ifade et ve sonra türevi kullanarak fonksiyonun en uç değerine ulaştığı yeri bul.</p>

<p class="l-text">Bu derste önce beş adımlı standart tarifi öğreneceksin, ardından son iki yüzyılın uygulamalı matematiğini şekillendirmiş yedi klasik optimizasyon problemini birlikte çözeceğiz. Dersin sonunda bir kelime problemini bir aralık üzerindeki fonksiyona çevirmeyi, $f'(x) = 0$ ile en uç değerini bulmayı ve İkinci Türev Testi ya da uç nokta kontrolü ile cevabı doğrulamayı bileceksin. Burada kazandığın beceri, mühendislerin ve ekonomistlerin her gün kullandığıyla aynıdır — sadece sorular lise geometrisi ve cebirinin diliyle yazılmıştır, böylece dikkatin asıl fikirden dağılmaz.</p>

<div class="lesson-outcomes" style="background:rgba(168,85,247,0.06);border-left:3px solid #a855f7;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#a855f7;margin-bottom:0.6rem">ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir kelime problemini okuyup en büyük (ya da en küçük) yapılacak niceliği belirlemek</li>
<li>Standart beş adımlı optimizasyon tarifini uygulamak (değişken, formül, kısıt, türev, doğrula)</li>
<li>Sabit çevreli ve sabit hacimli problemleri çözmek ve gizli simetrilerini fark etmek</li>
<li>Konserve kutusu ve açık kutu gibi malzeme problemlerini optimize etmek</li>
<li>Bir eğri üzerinde, dışarıdaki bir noktaya en yakın noktayı bulmak</li>
<li>Optimizasyonu ekonomiye (maksimum kar) ve fiziğe (Snell yasası / en kısa zaman) uygulamak</li>
<li>Kritik bir sayının gerçek optimum olduğunu İkinci Türev Testi veya uç nokta kontrolüyle doğrulamak</li>
</ul>
</div>

<h2 class="l-title">1. Optimizasyon Nedir?</h2>

<div class="calc-highlight"><strong>Gündelik resim:</strong> bir çiftçinin 100 metre çiti var ve düz bir duvar boyunca olabildiğince büyük bir dikdörtgen tarla çevirmek istiyor. Bir konserve fabrikası sabit miktarda domates sosunu olabildiğince az teneke ile paketlemek istiyor. Bir esnaf bir paltoyu öyle fiyatlamak istiyor ki karı maksimum olsun. Her durumda soru aynı — pek çok olası tasarımdan hangisi en iyidir? Optimizasyon, en iyiyi seçmenin matematiğidir.</div>

<p class="l-text">Bir <strong>optimizasyon problemi</strong>nin iki bileşeni vardır. Birincisi <em>amaç</em> — büyük (ya da küçük) yapmak istediğin nicelik (alan, hacim, maliyet, kar, zaman, mesafe). İkincisi bir veya daha fazla <em>kısıt</em> — herhangi bir kabul edilebilir tasarımın uymak zorunda olduğu ilişkiler (bir çevre, bir hacim, bir bütçe, fiziksel bir eşitsizlik). Optimum, kısıt kümesi içinde kalırken amacı uç değere taşıyan tasarım değişkeninin değeridir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Amaç fonksiyonu</div><div class="card-body">Maksimize ya da minimize etmek istediğin nicelik. Onu daima tek bir tasarım değişkeni $x$'in fonksiyonu olarak (10. bölümde iki değişkenin) yazabileceğiz.</div></div>
<div class="calc-card"><div class="card-title">Kısıt</div><div class="card-body">Değişkenlerin uyması gereken bir ilişki — örneğin "çevre 100" veya "hacim 1 litre". Kısıtlar değişken eleme imkânı verir ve problemi tek bilinmeyene indirir.</div></div>
<div class="calc-card"><div class="card-title">Uygun küme</div><div class="card-body">Tüm kısıtları sağlayan $x$ değerlerinin aralığı (veya bölgesi). Kenar uzunlukları pozitif olmalı, fiyatlar negatif olmamalı, vb.</div></div>
<div class="calc-card"><div class="card-title">Uç değer</div><div class="card-body">Uygun küme üzerinde $f(x)$'in maksimumu veya minimumu. Aralık içinde bir kritik noktada ya da bir uç noktada ortaya çıkabilir.</div></div>
</div>

<div class="l-note"><strong>22–25. derslerle bağlantı.</strong> Oluşturduğun türev araçları — kritik sayılar, işaret tabloları, Birinci ve İkinci Türev Testleri, Uç Değer Teoremi — optimizasyon problemlerini çözmek için gereken makinedir. Bu ders yeni hiçbir kalkülüs kuralı tanıtmaz; sana zaten bildiklerini gerçek dünya sorularına nasıl <em>uygulayacağını</em> öğretir.</div>

<h2 class="l-title">2. Standart Beş Adımlı Tarif</h2>

<div class="calc-highlight"><strong>Her optimizasyon problemine aynı beş adımlı yordamla saldırabilirsin.</strong> Adımları ezberlemek herhangi bir tek problemi ezberlemekten çok daha değerlidir — tarifi öğrendiğinde, bu dersteki tüm problemler onun rutin uygulamalarına dönüşür.</div>

<div class="calc-formula"><div class="formula-label">BEŞ ADIMLI TARİF</div><div class="formula-main">$$\\boxed{\\begin{aligned}
& \\text{1. Değişkenleri tanımla ve bir şekil çiz.} \\\\
& \\text{2. Amacı değişkenlerin fonksiyonu olarak yaz.} \\\\
& \\text{3. Kısıtı kullanarak tek değişkene indir.} \\\\
& \\text{4. Türev al, } f'(x) = 0 \\text{'ı çöz ve test et.} \\\\
& \\text{5. } f''(x) \\text{ ile veya uç noktaları kontrol ederek doğrula.}
\\end{aligned}}$$</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Değişkenleri tanımla ve çiz</div><div class="step-detail">Problemi iki kez oku. Hangi nicelik optimize ediliyor, hangi nicelikler senin seçimine bağlı belirle. Her bilinmeyene açık bir harf ver. Küçük bir taslak — kenarları etiketli bir dikdörtgen, $h$ ve $r$ ile bir silindir, ilgili açısı işaretlenmiş bir üçgen — büyük miktarda karışıklığı önler. Birimleri her zaman yaz.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Amacı yaz</div><div class="step-detail">Optimize edilecek niceliği bir formül olarak ifade et. Örnekler: alan $A = x \\cdot y$, yüzey alanı $S = 2\\pi r^2 + 2\\pi r h$, kar $P = (\\text{fiyat})(\\text{miktar}) - (\\text{maliyet})$. Bu aşamada formül birkaç değişken içerebilir — bu son derece normaldir.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Kısıtı kullanarak indirge</div><div class="step-detail">Kısıt, değişkenleri bağlayan bir denklemdir. Onu bir değişkeni diğerinin cinsinden çöz ve amacın içine yerleştir; böylece amaç <em>tek</em> bir değişkenin fonksiyonu hâline gelir. Uygun aralığı belirle (örneğin $0 < x < 50$).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Türev al ve çöz</div><div class="step-detail">$f'(x)$'i hesapla, $f'(x) = 0$ çöz ve uygun aralık içinde kalan kritik sayıları topla. Bunlar optimum için adaylarındır.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Optimumu doğrula</div><div class="step-detail">İkinci Türev Testi'ni uygula: $f''(c) < 0$ ise aday $c$ yerel maksimum, $f''(c) > 0$ ise yerel minimumdur. Alternatif olarak $f$'yi tüm kritik noktalarda ve uygun aralığın uç noktalarında değerlendirerek doğrudan karşılaştır (22. derste gördüğümüz Kapalı Aralık Yöntemi). Orijinal değişkenlere geri dön ve cevabı birimleriyle sade bir cümleyle ifade et.</div></div></div>
</div>

<div class="l-note"><strong>Tarif neden her zaman çalışır.</strong> Uç Değer Teoremi (22. ders), kapalı sınırlı bir aralık üzerindeki sürekli bir fonksiyonun hem maksimumuna hem minimumuna ulaştığını garanti eder. Optimum adayları yalnızca aralık içindeki kritik noktalardan veya uç noktalardan gelebilir. Beş adımlı tarif, tüm o adayların düzenli bir muhasebesidir.</div>

<h2 class="l-title">3. Klasik Problem 1 — Sabit Çevrede Maksimum Alan</h2>

<div class="calc-highlight"><strong>Soru:</strong> bir çiftçinin 100 metre çiti var ve maksimum alanlı bir dikdörtgen tarla çevirmek istiyor. Hangi dikdörtgeni seçmeli?</div>

<p class="l-text">Dikdörtgenin kenarları $x$ ve $y$ olsun. Çevre kısıtı $2x + 2y = 100$, yani $y = 50 - x$. Alan $A = xy = x(50 - x) = 50x - x^2$. Uygun aralık $0 < x < 50$'dir (her kenar pozitif olmalı).</p>

<div class="calc-formula"><div class="formula-label">AMAÇ VE KISIT</div><div class="formula-main">$$A(x) = 50x - x^2, \\qquad 0 < x < 50$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Adım 4.</strong> $A'(x) = 50 - 2x$. $A'(x) = 0$ verir $x = 25$.<br><br><strong>Adım 5.</strong> $A''(x) = -2 < 0$ olduğundan $x = 25$ yerel maksimumdur. (Aslında $A''$ her yerde negatif olduğu için parabol aşağı açılır ve tepe noktası global maksimumdur.)<br><br>O hâlde $y = 50 - 25 = 25$. Optimum dikdörtgen, kenarı 25 m olan bir <strong>karedir</strong>. Alanı $25 \\times 25 = 625$ m².<br><br><strong>Uç nokta kontrolü.</strong> $x \\to 0$ veya $x \\to 50$ olduğunda dikdörtgen bir doğru parçasına indirgenir ve alan sıfıra düşer. Maksimum gerçekten içeridedir.</div></div>

<div class="calc-graph"><div id="plot-l26-area-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> çevresi 100 olan bir dikdörtgen için $A(x) = x(50 - x)$ alanı. Fonksiyon $x = 25$'te tepe yapan bir ters parabol; o noktada dikdörtgen $25 \\times 25$ karedir. $x$ uç noktalardan birine doğru gittikçe alan sıfıra çöker.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=1;i<=49;i++){var x=i;xs.push(x);ys.push(x*(50-x));}
var curve={x:xs,y:ys,mode:'lines',name:'A(x) = x(50 - x)',line:{color:'#a855f7',width:3}};
var peak={x:[25],y:[625],mode:'markers+text',name:'maks (25, 625)',marker:{color:'#fbbf24',size:14},text:['  maks'],textposition:'top right',textfont:{color:'#fbbf24',size:12}};
var endL={x:[0],y:[0],mode:'markers',marker:{color:'#ef4444',size:8},showlegend:false};
var endR={x:[50],y:[0],mode:'markers',marker:{color:'#ef4444',size:8},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'kenar x (m)',range:[-1,51],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'alan A (m²)',range:[-30,700],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l26-area-tr',[curve,peak,endL,endR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">GENEL BİR GERÇEK</div><div class="think-body">Sabit çevreli tüm dikdörtgenler arasında karenin alanı en büyüktür. Sabit alanlı tüm dikdörtgenler arasında karenin çevresi en küçüktür. Bu, çok daha derin <em>izoperimetrik eşitsizliğin</em> en basit hâlidir: sabit çevreli tüm kapalı düzlem eğrileri arasında çember en büyük alanı kapsar. Yunanlılar bunun bir versiyonunu kalkülüsten iki bin yıl önce kanıtladılar.</div></div>

<div class="calc-example"><div class="example-label">VARYASYON (DUVARA YASLI ÇİT)</div><div class="example-body"><strong>Aynı çiftçi, ama bir kenar düz bir duvara yaslı.</strong> Duvar tarafına çit gerekmediğinden kısıt $x + 2y = 100$ olur (bir uzun kenar $x$ artı iki kısa kenar $y$). Alan $A = xy = x \\cdot \\dfrac{100 - x}{2}$.<br><br>$A(x) = 50x - x^2/2$. $A'(x) = 50 - x$, $A'(x) = 0$ olunca $x = 50$. O hâlde $y = 25$ ve en iyi tarla $50 \\times 25 = 1250$ m². Duvar, çitin bir kenarda "boşa harcanmadığı" için kapsanan alanı iki katına çıkarır.</div></div>

<h2 class="l-title">4. Klasik Problem 2 — Sabit Hacim İçin Min Yüzey</h2>

<div class="calc-highlight"><strong>Soru:</strong> silindir biçiminde bir konserve kutusu tam olarak bir litre (1000 cm³) tutmalı. Hangi boyutlar kullanılan metalin yüzey alanını minimize eder?</div>

<p class="l-text">Silindirin yarıçapı $r$, yüksekliği $h$ olsun. Hacim kısıtı $V = \\pi r^2 h = 1000$. Toplam yüzey alanı (üst, alt, yan) $S = 2\\pi r^2 + 2\\pi r h$.</p>

<div class="calc-formula"><div class="formula-label">TEK DEĞİŞKENE İNDİRGEME</div><div class="formula-main">$$h = \\frac{1000}{\\pi r^2} \\;\\Longrightarrow\\; S(r) = 2\\pi r^2 + 2\\pi r \\cdot \\frac{1000}{\\pi r^2} = 2\\pi r^2 + \\frac{2000}{r}$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Adım 4.</strong> Türev al: $S'(r) = 4\\pi r - \\dfrac{2000}{r^2}$.<br><br>$S'(r) = 0$: $4\\pi r = \\dfrac{2000}{r^2}$, yani $4\\pi r^3 = 2000$, $r^3 = \\dfrac{500}{\\pi}$.<br><br>Bu yüzden $r = \\sqrt[3]{500/\\pi} \\approx 5{,}42$ cm.<br><br><strong>Sonra</strong> $h = \\dfrac{1000}{\\pi r^2} \\approx \\dfrac{1000}{\\pi \\cdot 29{,}4} \\approx 10{,}84$ cm.<br><br>Dikkat: $h \\approx 2r$. <strong>Optimum kutunun yüksekliği çapına eşittir.</strong> Bu, ünlü "$h = 2r$" kuralıdır.<br><br><strong>Adım 5.</strong> $S''(r) = 4\\pi + \\dfrac{4000}{r^3} > 0$ her $r > 0$ için. O hâlde $r \\approx 5{,}42$ yerel minimumdur ve $S'' > 0$ her yerde olduğundan $(0, \\infty)$ üzerinde global minimumdur.</div></div>

<div class="calc-graph"><div id="plot-l26-can-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> yarıçapın fonksiyonu olarak $S(r) = 2\\pi r^2 + 2000/r$ yüzeyi. Eğri büyük bir değerden (ince uzun bir borunun yan alanı çok büyüktür) tek bir minimuma ($r \\approx 5{,}42$ cm) iner, sonra tekrar yükselir (geniş yassı bir tenekenin alt ve üstü çok büyüktür). Minimum nokta $h = 2r$'ye karşılık gelir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=15;i<=140;i++){var r=i/10;xs.push(r);ys.push(2*Math.PI*r*r+2000/r);}
var curve={x:xs,y:ys,mode:'lines',name:'S(r) = 2πr² + 2000/r',line:{color:'#a855f7',width:3}};
var rstar=Math.pow(500/Math.PI,1/3);var sstar=2*Math.PI*rstar*rstar+2000/rstar;
var peak={x:[rstar],y:[sstar],mode:'markers+text',name:'min (r ≈ 5,42, h = 2r)',marker:{color:'#fbbf24',size:14},text:['  min'],textposition:'top right',textfont:{color:'#fbbf24',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'yarıçap r (cm)',range:[1,14],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'yüzey S (cm²)',range:[400,1500],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l26-can-tr',[curve,peak],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">GERÇEKLİK TESTİ</div><div class="think-body">Mutfak dolabındaki herhangi bir konserve kutusuna bak. Yüksekliği kabaca yarıçapının iki katıdır — tam da bizim türettiğimiz optimum. Üreticiler bu oranı kalkülüsle gerekçelendirilmeden çok önce belirlemiş; metal tasarrufu gerçek, geometri gerçek ve yüzyıllarca süren pratik mühendislik, $S'(r) = 0$'ın iki satırda verdiği yanıta yakınsadı.</div></div>

<h2 class="l-title">5. Klasik Problem 3 — Kapaklı Kutu Tasarımı</h2>

<div class="calc-highlight"><strong>İncelik:</strong> uygulamada üst ve alt metal diskler kare bir levhadan kesilir, bu yüzden gerçek malzeme maliyeti disk alanından yüksektir. Bu daha gerçekçi maliyeti ile yeniden çözmek optimumu kaydırır.</div>

<p class="l-text">Üst ve altın her birinin kenarı $2r$ olan kare levhalardan kesildiğini varsay; her disk $4r^2$ alan tüketir (disk yalnızca $\\pi r^2$ kullanır ama köşeler israftır). Toplam malzeme fonksiyonu</p>

<div class="calc-formula"><div class="formula-main">$$M(r) = 2 \\cdot 4r^2 + 2\\pi r h = 8r^2 + 2\\pi r h.$$</div><div class="formula-sub">Yan $2\\pi r h$ değişmez; sadece üst/alt terimi büyür.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$h = 1000/(\\pi r^2)$ ile:<br><br>$M(r) = 8r^2 + 2\\pi r \\cdot \\dfrac{1000}{\\pi r^2} = 8r^2 + \\dfrac{2000}{r}$.<br><br>$M'(r) = 16r - \\dfrac{2000}{r^2}$, sıfıra eşitle: $16r^3 = 2000$, yani $r^3 = 125$, $r = 5$ cm.<br><br>O hâlde $h = \\dfrac{1000}{\\pi \\cdot 25} = \\dfrac{40}{\\pi} \\approx 12{,}73$ cm.<br><br>Optimum oran şimdi $\\dfrac{h}{r} = \\dfrac{40/\\pi}{5} = \\dfrac{8}{\\pi} \\approx 2{,}55$. <strong>İdeal matematiksel kutudan biraz daha uzun</strong> — çünkü artık üst ve alt disk başına daha pahalıdır. Bu, enerji içeceği ve salça kutularının uzun ince oranlarına daha yakındır.</div></div>

<div class="l-note"><strong>Modelleme dersi.</strong> Aynı problemin, metale gerçekten yüklediğin maliyetlere bağlı olarak farklı "optimum" yanıtları olabilir. Tamamen geometrik minimum $h = 2r$ verir; köşe israfını cezalandıran üretim minimumu daha uzun $h/r \\approx 2{,}55$ verir. Optimizasyon varsayımları konusunda dürüsttür — maliyet fonksiyonunu değiştir, optimum onunla birlikte hareket eder.</div>

<h2 class="l-title">6. Klasik Problem 4 — Kare Kartondan Açık Kutu</h2>

<div class="calc-highlight"><strong>Soru:</strong> kenarı 30 cm olan kare bir kartonun her köşesinden kenarı $x$ olan eşit kareler kes ve kenarları yukarı katlayarak üstü açık bir kutu yap. Hangi $x$ maksimum hacim verir?</div>

<p class="l-text">Katlamadan sonra kutunun tabanı kenarı $30 - 2x$ olan bir kare, yüksekliği ise $x$'tir. Uygun aralık $0 < x < 15$ (taban kenarı pozitif kalsın diye).</p>

<div class="calc-formula"><div class="formula-label">HACİM FONKSİYONU</div><div class="formula-main">$$V(x) = x \\,(30 - 2x)^2, \\qquad 0 < x < 15$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Açarak ya da çarpma kuralıyla türev al:<br><br>$V'(x) = (30 - 2x)^2 + x \\cdot 2(30 - 2x)(-2) = (30 - 2x)[(30 - 2x) - 4x] = (30 - 2x)(30 - 6x)$.<br><br>$V'(x) = 0 \\iff 30 - 2x = 0$ veya $30 - 6x = 0$, yani $x = 15$ (sınır, taban = 0) ya da $\\mathbf{x = 5}$ (iç).<br><br>$V''(x)$ ile test et veya $V$'nin iki uç noktada sıfır, aralarında pozitif olduğunu gözlemle; iç kritik sayı maksimumdur.<br><br>$x = 5$ cm'de: taban $= 30 - 10 = 20$ cm, $V = 5 \\cdot 400 = 2000$ cm³.<br><br><strong>Her köşeden 5 cm kare kes</strong>, kutunun hacmi maksimum olur.</div></div>

<div class="calc-graph"><div id="plot-l26-box-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafikte görülen:</strong> açık üst kutunun köşe-kesimi $x$'in fonksiyonu olarak $V(x) = x(30 - 2x)^2$ hacmi. Eğri sıfırdan başlar (kesim yoksa yükseklik yok), $x = 5$ cm'de tek bir tepeye çıkar (orada $V = 2000$ cm³), sonra $x = 15$'te (taban kaybolur) tekrar sıfıra düşer.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=150;i++){var x=i/10;xs.push(x);ys.push(x*(30-2*x)*(30-2*x));}
var curve={x:xs,y:ys,mode:'lines',name:'V(x) = x(30 - 2x)²',line:{color:'#a855f7',width:3}};
var peak={x:[5],y:[2000],mode:'markers+text',name:'maks (5, 2000)',marker:{color:'#fbbf24',size:14},text:['  maks'],textposition:'top right',textfont:{color:'#fbbf24',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'köşe kesimi x (cm)',range:[-0.5,15.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'hacim V (cm³)',range:[-100,2200],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l26-box-tr',[curve,peak],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">HATIRLANACAK DESEN</div><div class="think-body">Levha kenarı $a$ ise optimum köşe kesimi $x = a/6$'dır. ($V = x(a - 2x)^2$'yi türev alıp doğrula.) Yani 30 cm'lik levhada 5 cm; 60 cm'lik levhada 10 cm kesersin. Oran evrenseldir — bir kez yaz, ömür boyu hatırla.</div></div>

<h2 class="l-title">7. Klasik Problem 5 — Bir Eğri Üzerinde En Yakın Nokta</h2>

<div class="calc-highlight"><strong>Soru:</strong> $y = x^2$ parabolü üzerinde, dışarıdaki $(3, 0)$ noktasına en yakın noktayı bul.</div>

<p class="l-text">Parabol üzerinde genel bir nokta $(x, x^2)$ olsun. $(3, 0)$'a uzaklığı</p>

<div class="calc-formula"><div class="formula-main">$$D(x) = \\sqrt{(x - 3)^2 + (x^2 - 0)^2} = \\sqrt{(x - 3)^2 + x^4}.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hile.</strong> Uzaklık ve karesi aynı $x$'te minimize olur, bu yüzden daha sade fonksiyonu minimize ediyoruz:<br><br>$f(x) = (x - 3)^2 + x^4$.<br><br>$f'(x) = 2(x - 3) + 4x^3 = 4x^3 + 2x - 6$.<br><br>$f'(x) = 0$: $4x^3 + 2x - 6 = 0$, yani $2x^3 + x - 3 = 0$.<br><br>$x = 1$ dene: $2 + 1 - 3 = 0$ ✓.<br><br>Çarpanlara ayır: $2x^3 + x - 3 = (x - 1)(2x^2 + 2x + 3)$. İkinci dereceden çarpanın diskriminantı $4 - 24 = -20 < 0$, dolayısıyla $x = 1$ tek reel kritik sayıdır.<br><br>$f''(x) = 12x^2 + 2$. $f''(1) = 14 > 0$ → yerel minimum.<br><br>O hâlde en yakın nokta $(1, 1)$ ve minimum uzaklık $\\sqrt{4 + 1} = \\sqrt{5} \\approx 2{,}236$.</div></div>

<div class="l-note"><strong>Geometrik kontrol.</strong> $(3, 0)$'dan en yakın nokta $(1, 1)$'e giden doğru, parabolün $(1, 1)$'deki teğetine dik olmalıdır. Teğetin eğimi $2x = 2$. Bizim doğrumuzun eğimi $(1 - 0)/(1 - 3) = -1/2$. Çarpımları $2 \\cdot (-1/2) = -1$, diklik onaylanır. Bu güzel bir genel olgudur: <em>bir noktadan bir eğriye en kısa doğru parçası, eğriye ayakta dik gelir.</em></div>

<h2 class="l-title">8. Klasik Problem 6 — Ekonomide Maksimum Kar</h2>

<div class="calc-highlight"><strong>Soru:</strong> bir dükkân haftada $q$ adet ürün satıyor. Pazar araştırması talep yasasının $p = 100 - 2q$ (birim başına lira) olduğunu gösteriyor. $q$ adet üretmenin maliyeti $C(q) = 200 + 20q$ lira. Haftalık karı maksimum yapan fiyat $p$ ve miktar $q$ nedir?</div>

<p class="l-text">Gelir = fiyat × miktar: $R(q) = p \\cdot q = (100 - 2q) q = 100q - 2q^2$. Kar = gelir − maliyet:</p>

<div class="calc-formula"><div class="formula-label">KAR FONKSİYONU</div><div class="formula-main">$$P(q) = R(q) - C(q) = (100q - 2q^2) - (200 + 20q) = -2q^2 + 80q - 200.$$</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$P'(q) = -4q + 80$. $P'(q) = 0$: $q = 20$.<br><br>$P''(q) = -4 < 0$ → yerel maksimum (ve aşağı açılan parabol olduğundan global).<br><br>Optimum miktar: haftada $q = 20$ adet.<br>Optimum fiyat: $p = 100 - 2 \\cdot 20 = 60$ lira/adet.<br>Maksimum kar: $P(20) = -800 + 1600 - 200 = 600$ lira/hafta.<br><br><strong>Ekonomik yorum.</strong> $P'(q) = 0$, tüm ekonomi kitaplarının vurguladığı marjinal-gelir = marjinal-maliyet koşulundan başka bir şey değildir: $q = 20$'de $R'(q) = 100 - 4q = 20 = C'(q)$. Kalkülüs bu sloganı bir hesaba çevirir.</div></div>

<div class="l-note"><strong>Talep eğrisi neden eğimi negatif?</strong> Gerçek pazarlar düşük fiyatları yüksek satışla ödüllendirir. En basit model $a, b > 0$ olmak üzere doğrusal "talep eğrisi" $p = a - b q$'dur. O zaman gelir $R = pq = aq - bq^2$ aşağı açılan bir paraboldür — gelirin en büyük olduğu tek bir $q^*$ değerinin var olduğunu zaten söyler. Üzerine doğrusal bir maliyet çıkarınca şekil korunur, kar da tek bir optimuma sahiptir.</div>

<h2 class="l-title">9. Klasik Problem 7 — Snell Yasası ve En Kısa Zaman</h2>

<div class="calc-highlight"><strong>Bir fizik klasiği:</strong> kıyıdaki $A$ noktasındaki bir cankurtaran, denizdeki $B$ noktasındaki bir yüzücüye olabildiğince çabuk ulaşmalı. Cankurtaran kumda $v_1$ hızıyla koşuyor, suda daha düşük $v_2$ hızıyla yüzüyor. Suya kıyının hangi noktasından girmeli?</div>

<p class="l-text">Düz kıyıyı $x$-ekseni üzerinde olacak biçimde yerleştir. Kumda $A = (0, a)$, suda $B = (d, -b)$ ($a, b, d > 0$). Cankurtaranın suya girdiği nokta $(x, 0)$ olsun.</p>

<div class="calc-formula"><div class="formula-label">TOPLAM ZAMAN</div><div class="formula-main">$$T(x) = \\frac{\\sqrt{x^2 + a^2}}{v_1} + \\frac{\\sqrt{(d - x)^2 + b^2}}{v_2}$$</div><div class="formula-sub">İlk terim: kumda koşma zamanı. İkinci terim: suda yüzme zamanı. Bilinmeyen $x$, suya giriş noktasıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ TÜRETME</div><div class="example-body">$T'(x) = \\dfrac{x}{v_1 \\sqrt{x^2 + a^2}} - \\dfrac{d - x}{v_2 \\sqrt{(d - x)^2 + b^2}}$.<br><br>$T'(x) = 0$:<br><br>$\\dfrac{x}{v_1 \\sqrt{x^2 + a^2}} = \\dfrac{d - x}{v_2 \\sqrt{(d - x)^2 + b^2}}$.<br><br>Trigonometriyi tanı: koşu yolunun $(x, 0)$'da kıyıya dikine yaptığı açı $\\theta_1$ olsun; $\\sin \\theta_1 = \\dfrac{x}{\\sqrt{x^2 + a^2}}$. Benzer şekilde $\\sin \\theta_2 = \\dfrac{d - x}{\\sqrt{(d - x)^2 + b^2}}$.<br><br>Denklem şuna döner:<br><br>$\\dfrac{\\sin \\theta_1}{v_1} = \\dfrac{\\sin \\theta_2}{v_2}, \\qquad \\text{yani} \\qquad \\boxed{\\dfrac{\\sin \\theta_1}{\\sin \\theta_2} = \\dfrac{v_1}{v_2}}.$<br><br>Bu, <strong>Snell'in kırılma yasasıdır</strong>. Hızlı bir ortamdan yavaş bir ortama geçen ışık ışını, tam olarak yolculuk süresini minimize eden açıda bükülür — Fermat'nın en kısa zaman ilkesi, burada bir lise optimizasyon problemi olarak türetildi.</div></div>

<div class="l-note"><strong>Tarihsel bir sürpriz.</strong> Snell deneysel kırılma yasasını 1621'de keşfetti. Fermat 1662'de onu "en kısa zaman"dan, henüz kalkülüs icat edilmemişken türetti. Türevle, tüm argüman bir sayfaya sığar. Tek bir kalkülüs özdeşliğinin bir cankurtaranın stratejisini ve ışığın bükülmesini birleştirmesi, matematiği öğrenmenin neden değdiğinin en güzel örneklerindendir.</div>

<h2 class="l-title">10. İki Değişkenli Optimizasyon — Kısa Bir Bakış</h2>

<div class="calc-highlight"><strong>Ya amaç iki serbest değişkene bağlıysa ve birini bir kısıtla eleyemiyorsak?</strong> O zaman kısmi türevlere ihtiyacımız var ve üniversitede bu tekniğin adı meşhur <em>Lagrange çarpanları</em> yöntemidir. Burada sadece fikrin nereye götürdüğünü göresin diye taslağı çizeceğiz.</div>

<p class="l-text">İki değişkenli bir fonksiyon $f(x, y)$ için "$f'(x) = 0$"ın karşılığı şu sistemdir:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{\\partial f}{\\partial x} = 0, \\qquad \\frac{\\partial f}{\\partial y} = 0.$$</div><div class="formula-sub">Her iki denklemi sağlayan bir çift $(x, y)$, iki değişkenli fonksiyonun bir <em>kritik noktasıdır</em>.</div></div>

<p class="l-text">Bir <strong>kısmi türev</strong> $\\partial f / \\partial x$, $y$'yi sabit kabul ederek $f$'nin yalnızca $x$'e göre türevidir. Örneğin $f(x, y) = x^2 + xy + y^2$ ise $\\partial f/\\partial x = 2x + y$ ve $\\partial f/\\partial y = x + 2y$ olur. Sistemi çözünce $x = y = 0$ gelir, bu global minimumdur.</p>

<div class="l-note"><strong>Lagrange çarpanları (önizleme).</strong> Optimizasyon <em>kısıtlıysa</em> — diyelim $g(x, y) = 0$ kısıtı altında $f(x, y)$'i maksimize et — optimumda $f$'in gradyenti $g$'nin gradyentine paraleldir. Lagrange bunu $\\nabla f = \\lambda \\nabla g$ olarak yazdı ve temiz bir tarife çevirdi. Bu dersin tek değişkenli beş adımlı yordamı, üniversitedeki ilk kalkülüs dersinde göreceğin genel Lagrange yönteminin oyuncak halidir.</div>

<h2 class="l-title">11. Klasik Alıştırmalar (Kelime → Matematik → Çözüm)</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — DİKDÖRTGEN PARK</div><div class="example-body"><strong>Problem.</strong> Bir belediyenin nehir kıyısı boyunca dikdörtgen bir park için 240 m çiti var (nehir tarafına çit gerekmiyor). Hangi boyutlar alanı maksimum yapar?<br><br><strong>Çözüm.</strong> $x$ = nehre paralel kenar, $y$ = ona dik her kenar. $x + 2y = 240$, $A = xy = x \\cdot \\dfrac{240 - x}{2} = 120x - x^2/2$. $A'(x) = 120 - x = 0 \\Rightarrow x = 120$ m, $y = 60$ m. $A_{\\max} = 7200$ m².</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — KENAR BOŞLUKLU AFİŞ</div><div class="example-body"><strong>Problem.</strong> Bir afişin baskı alanı 600 cm². Üst ve alt boşluklar 4'er cm; yan boşluklar 3'er cm. Afişin toplam alanını minimum yapan dış boyutları bul.<br><br><strong>Çözüm.</strong> Baskı bölgesi genişlik $x$, yükseklik $y$ ve $xy = 600$. Toplam afiş alanı $T = (x + 6)(y + 8) = xy + 8x + 6y + 48 = 600 + 8x + 6y + 48$. Elemine et: $y = 600/x$. $T(x) = 648 + 8x + 3600/x$. $T'(x) = 8 - 3600/x^2 = 0 \\Rightarrow x^2 = 450 \\Rightarrow x = 15\\sqrt{2} \\approx 21{,}2$ cm. Sonra $y = 600/x \\approx 28{,}3$ cm. Dış afiş: $\\approx 27{,}2 \\times 36{,}3$ cm.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — İÇERİYE YAZILMIŞ DİKDÖRTGEN</div><div class="example-body"><strong>Problem.</strong> İki kenarı $x$-ekseninde olacak şekilde $y = \\sqrt{4 - x^2}$ yarıçemberi içine bir dikdörtgen yazılsın. Hangi dikdörtgenin alanı maksimumdur?<br><br><strong>Çözüm.</strong> Simetri ile köşeleri $(\\pm x, 0)$ ve $(\\pm x, \\sqrt{4 - x^2})$ olsun. Alan $A(x) = 2x \\cdot \\sqrt{4 - x^2}$, $0 < x < 2$. $A^2 = 4x^2(4 - x^2)$'i maksimize et. $f(x) = 16x^2 - 4x^4$'i türev al: $f'(x) = 32x - 16x^3 = 16x(2 - x^2) = 0 \\Rightarrow x = \\sqrt{2}$. Yükseklik $= \\sqrt{4 - 2} = \\sqrt{2}$. Optimum dikdörtgen $2\\sqrt{2} \\times \\sqrt{2}$, alan $= 4$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — KÖŞEDEN DÖNEN MERDİVEN</div><div class="example-body"><strong>Problem.</strong> Genişlikleri $a$ ve $b$ olan iki koridor dik açıyla birleşiyor. Köşeden yatay olarak taşınabilen en uzun düz merdivenin boyu nedir?<br><br><strong>Çözüm.</strong> Merdivenin ilk koridorla yaptığı açı $\\theta$ olsun. Merdivenin boyu $L(\\theta) = a/\\sin\\theta + b/\\cos\\theta$ olmalı. <em>Sığabilen</em> en uzun merdiven, $L$'nin $\\theta \\in (0, \\pi/2)$ üzerindeki minimumudur. $L'(\\theta) = -a\\cos\\theta/\\sin^2\\theta + b\\sin\\theta/\\cos^2\\theta = 0 \\Rightarrow \\tan^3\\theta = a/b$, yani $\\tan\\theta = (a/b)^{1/3}$. Geri yerleştirince $L_{\\min} = (a^{2/3} + b^{2/3})^{3/2}$. ($a = b = 1$ için: $L_{\\min} = 2^{3/2} \\approx 2{,}83$.)</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — BİLET FİYATI</div><div class="example-body"><strong>Problem.</strong> Bir sinema şu an bilet başına 50 lira alıp gecede 400 bilet satıyor. Anketler, fiyatta her 1 lira <em>indirimin</em> 20 ek bilet sattırdığını gösteriyor. Hangi fiyat geliri maksimum yapar?<br><br><strong>Çözüm.</strong> $x$ = 1 liralık indirim sayısı. Fiyat $p = 50 - x$, miktar $q = 400 + 20x$. Gelir $R(x) = (50 - x)(400 + 20x) = 20000 + 1000x - 400x - 20x^2 = 20000 + 600x - 20x^2$. $R'(x) = 600 - 40x = 0 \\Rightarrow x = 15$. Fiyat $= 50 - 15 = 35$ lira; miktar $= 400 + 300 = 700$ bilet; gelir $= 35 \\cdot 700 = 24\\,500$ lira (başlangıçtaki 20000'den 4500 fazla).</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — KATLANMIŞ SAYFA</div><div class="example-body"><strong>Problem.</strong> Bir A4 sayfasının sağ alt köşesi, sol kenara değecek şekilde katlanır. <em>En kısa</em> kıvrımı veren katlama yerini bul.<br><br><strong>Çözüm.</strong> Sayfa genişliği $w$ olsun. Köşenin sol kenarda, sol alt köşeden $x$ uzaklığa düştüğünü düşün. Geometriden, kıvrım uzunluğu $w/2 \\leq x \\leq w$ için $L(x) = \\sqrt{x^2 \\cdot w^2 / (2wx - x^2)}$'tir. Türev alıp $L'(x) = 0$ koyunca $x = 3w/4$ çıkar. Optimum kıvrım uzunluğu $L = \\dfrac{3\\sqrt{3}}{4} w$. (1957'den klasik bir Martin Gardner bulmacası.)</div></div>

<div class="l-note"><strong>Kapanış düşüncesi.</strong> Bu dersteki her optimizasyon problemi — çitler, kutular, açık kutular ya da ışık ışınları üzerine — aynı beş adımla çözüldü. Amacı belirle; formülü yaz; tek değişkene indir; türev al ve sıfıra eşitle; İkinci Türev Testi ile doğrula. Bu tek yordam seni lise kelime probleminden araştırma seviyesinde mühendisliğe kadar taşır. Sorular zorlaşır ama tarif aynı kalır. Optimizasyon, bu anlamda, uygulamalı matematiğin ilk tekniğidir — ve matematiğin gerçek dünyada en sık kullanıldığı hesap makinesidir.</div>`
};
