window.CALCULUS_L7 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Almost every optimisation problem in the real world comes with strings attached.</strong> A portfolio manager maximises expected return — but only over allocations that sum to 100% of capital. A neural network designer minimises loss — but only over weights with bounded norm. A statistician finds the highest-entropy distribution — but only among those with a given mean and variance. An SVM separates two classes — but only with margins on the correct side. These are <em>constrained optimisation</em> problems, and the geometric trick that solves them is over two centuries old: <strong>Lagrange multipliers</strong>.</p>

<p class="l-text">In this lesson we develop Lagrange multipliers from a one-line geometric picture (the gradient must be perpendicular to the constraint surface), prove the method with a clean variational argument, walk through three fully worked examples, generalise to inequalities through the <em>Karush-Kuhn-Tucker</em> conditions, and finally derive — from scratch — the two applications that made Lagrange a household name in machine learning: the <strong>SVM dual</strong> (with the kernel trick falling out for free) and the <strong>maximum-entropy</strong> derivation of the Gaussian distribution.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read the geometric picture: at a constrained extremum, $\\nabla f$ is parallel to $\\nabla g$</li>
<li>Derive the method of Lagrange multipliers from a variational argument and apply it to multiple constraints</li>
<li>Work through three classic examples: $xy$ on the unit circle, volume of a box with fixed surface area, distance from a point to a plane</li>
<li>State and prove the Karush-Kuhn-Tucker (KKT) conditions for inequality constraints, including primal/dual feasibility, stationarity, and complementary slackness</li>
<li>Derive the SVM dual completely from the primal margin formulation, identify support vectors as the active KKT constraints, and recover the kernel trick</li>
<li>Use Lagrange to prove the maximum-entropy distribution under mean-variance constraints is exactly the Gaussian — the cleanest justification of the central role of $\\mathcal{N}(\\mu,\\sigma^2)$ in statistics</li>
<li>Implement constrained optimisation in Python with <code>scipy.optimize.minimize</code> and <code>cvxpy</code></li>
</ul>
</div>

<h2 class="lesson-title">1. The Constrained Optimisation Problem</h2>

<div class="calc-highlight"><strong>Vanilla gradient descent ignores constraints.</strong> If you simply follow $-\\nabla f$ on a parameter that has to stay on a unit sphere, you walk off the sphere on the very first step. The whole apparatus of constrained optimisation exists to fix this single failure: how do you find extrema that live <em>on</em> a constraint manifold, not in the whole ambient space?</div>

<p class="l-text">The general equality-constrained problem reads</p>

<div class="calc-formula"><div class="formula-label">EQUALITY-CONSTRAINED PROBLEM</div><div class="formula-main">$$\\min_{x \\in \\mathbb{R}^n} f(x) \\quad \\text{subject to} \\quad g_1(x) = 0, \\ldots, g_m(x) = 0$$</div><div class="formula-sub">The feasible set is the intersection of $m$ level surfaces $\\{x : g_j(x) = 0\\}$. We seek the smallest value of $f$ restricted to this set.</div></div>

<p class="l-text">Two examples make the picture concrete:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Portfolio</div><div class="card-body">$f(w) = -w^T \\mu$ (negative return); $g(w) = \\mathbf{1}^T w - 1$ (weights sum to 1).</div><div class="card-formula">$\\max w^T\\mu$ s.t. $\\sum w_i = 1$</div></div>
<div class="calc-card"><div class="card-title">Geometry</div><div class="card-body">$f(x,y) = x^2 + y^2$ (distance from origin); $g(x,y) = x + y - 1 = 0$ (a line). Closest point on a line.</div><div class="card-formula">$\\min x^2+y^2$ s.t. $x+y=1$</div></div>
<div class="calc-card"><div class="card-title">SVM</div><div class="card-body">$f(w) = \\tfrac12\\|w\\|^2$ (margin); $g_i(w,b) = 1 - y_i(w^T x_i + b) \\le 0$ (correctly classified with slack 1).</div><div class="card-formula">$\\min\\tfrac12\\|w\\|^2$ s.t. margin $\\ge 1$</div></div>
</div>

<p class="l-text">The naive approach of "substitute the constraint into $f$ and minimise in fewer variables" works only when the constraint is solvable in closed form. For a sphere $x_1^2 + \\cdots + x_n^2 = 1$ in many dimensions there is no useful substitution. We need a method that handles the constraint <em>implicitly</em>, treating $f$ and $g$ on equal footing.</p>

<h2 class="lesson-title">2. The Geometric Idea</h2>

<div class="calc-highlight"><strong>At an extremum on a smooth constraint, the gradient of $f$ must be parallel to the gradient of $g$.</strong> Anything else allows you to slide along the constraint and decrease $f$ — which contradicts being at an extremum. This single picture is the whole of Lagrange multipliers.</div>

<p class="l-text">Consider a level set $\\{g(x) = 0\\}$ in $\\mathbb{R}^2$. The gradient $\\nabla g$ at any point is the <em>normal</em> to that level set. Now look at the level curves of $f$, the sets $\\{x : f(x) = c\\}$ for various constants $c$. As $c$ varies, these curves sweep through the plane; somewhere they cross the constraint curve.</p>

<p class="l-text">At a typical crossing the level curve of $f$ enters the constraint at one side and exits the other — by continuity, $f$ is increasing along the constraint at the entry point and decreasing past it (or vice versa). So a typical crossing is <em>not</em> an extremum. The only crossings that are extrema are where the level curve of $f$ is <em>tangent</em> to the constraint:</p>

<div class="calc-formula"><div class="formula-label">TANGENCY CONDITION</div><div class="formula-main">$$\\nabla f(x^*) \\;=\\; \\lambda \\, \\nabla g(x^*) \\quad \\text{for some } \\lambda \\in \\mathbb{R}$$</div><div class="formula-sub">At a constrained extremum, the two gradients point in the same direction (up to a sign and scale). The scalar $\\lambda$ is the <strong>Lagrange multiplier</strong>.</div></div>

<p class="l-text"><strong>Why must they be parallel?</strong> Suppose at the candidate point $x^*$ the gradients are <em>not</em> parallel. Decompose $\\nabla f(x^*)$ into a component along $\\nabla g$ and a component perpendicular to it. The perpendicular component is tangent to the constraint surface. Moving a tiny step along the tangent direction stays on the surface to first order and increases (or decreases) $f$ linearly — so $x^*$ is not an extremum after all.</p>

<div class="calc-graph"><div id="plot-l7-geom-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> level curves of $f(x,y) = xy$ (blue contours) intersect the unit-circle constraint $g(x,y) = x^2+y^2-1 = 0$ (orange). At the four extrema marked in red, the level curve and the circle are tangent — equivalent to the algebraic condition $\\nabla f = \\lambda \\nabla g$. At any other point on the circle (illustrated in grey) the contours cross transversally, meaning we could move along the circle to increase or decrease $f$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=0;i<=80;i++){var rowx=[],rowy=[],rowz=[];for(var j=0;j<=80;j++){var x=-1.4+2.8*j/80,y=-1.4+2.8*i/80;rowx.push(x);rowy.push(y);rowz.push(x*y);}xs.push(rowx);ys.push(rowy);zs.push(rowz);}
var xline=[],yline=[],x1=[],y1=[],x2=[],y2=[],x3=[],y3=[],x4=[],y4=[];
for(var k=0;k<=200;k++){var t=2*Math.PI*k/200;xline.push(Math.cos(t));yline.push(Math.sin(t));}
var r=1/Math.sqrt(2);
var d1={type:'contour',x:xs[0],y:ys.map(function(r){return r[0];}),z:zs,colorscale:[[0,'rgba(59,130,246,0.05)'],[0.5,'rgba(59,130,246,0.35)'],[1,'rgba(59,130,246,0.85)']],contours:{coloring:'lines',start:-1,end:1,size:0.1},line:{width:1.2},name:'f = xy',showscale:false};
var d2={x:xline,y:yline,mode:'lines',name:'constraint x^2+y^2=1',line:{color:'#f59e0b',width:2.6}};
var d3={x:[r,r,-r,-r],y:[r,-r,r,-r],mode:'markers',name:'extrema',marker:{color:'#ef4444',size:11,symbol:'circle'}};
var d4={x:[1,0,-1,0],y:[0,1,0,-1],mode:'markers',name:'non-extrema',marker:{color:'#9ca3af',size:8,symbol:'x'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.4,1.4],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.4,1.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-geom-en',[d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. The Lagrangian and the Method</h2>

<div class="calc-highlight"><strong>Package both conditions into a single function whose unconstrained critical points are the constrained extrema.</strong> Introducing the multiplier $\\lambda$ as a new variable, define the <em>Lagrangian</em></div>

<div class="calc-formula"><div class="formula-label">THE LAGRANGIAN (ONE CONSTRAINT)</div><div class="formula-main">$$\\mathcal{L}(x, \\lambda) \\;=\\; f(x) \\;-\\; \\lambda \\, g(x)$$</div><div class="formula-sub">A scalar function of $n+1$ variables: the $n$ original variables and the multiplier. Its unconstrained stationary points are exactly the candidates we want.</div></div>

<p class="l-text">Setting all partial derivatives of $\\mathcal{L}$ to zero recovers both the tangency condition and the constraint:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$\\nabla_x \\mathcal{L} = 0$</div><div class="step-detail">$\\nabla f(x) - \\lambda \\nabla g(x) = 0$, i.e. $\\nabla f = \\lambda \\nabla g$. This is the tangency / parallel-gradient condition from section 2.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\partial \\mathcal{L} / \\partial \\lambda = 0$</div><div class="step-detail">$-g(x) = 0$, i.e. $g(x) = 0$. The constraint is automatically enforced.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Count equations and unknowns</div><div class="step-detail">$n$ equations from $\\nabla_x \\mathcal{L} = 0$, plus $1$ equation from $\\partial \\mathcal{L} / \\partial \\lambda = 0$, equals $n+1$ equations in $n+1$ unknowns $(x_1, \\ldots, x_n, \\lambda)$. Generically a discrete set of solutions.</div></div></div>
</div>

<p class="l-text"><strong>Variational proof of the method.</strong> Suppose $x^*$ minimises $f$ on $\\{g = 0\\}$ and let $x(t)$ be any smooth curve on the constraint with $x(0) = x^*$. Because $g(x(t)) = 0$ for all $t$, differentiating gives $\\nabla g(x^*) \\cdot x'(0) = 0$, so $x'(0)$ is tangent to the constraint. Because $f(x(t))$ has a minimum at $t = 0$, $\\tfrac{d}{dt} f(x(t)) \\big|_{t=0} = \\nabla f(x^*) \\cdot x'(0) = 0$.</p>

<p class="l-text">So $\\nabla f(x^*)$ is perpendicular to every tangent vector — which means $\\nabla f(x^*)$ lies in the one-dimensional <em>normal</em> direction to the constraint, spanned by $\\nabla g(x^*)$. Thus $\\nabla f(x^*) = \\lambda \\nabla g(x^*)$ for some scalar $\\lambda$. $\\square$</p>

<div class="l-note"><strong>The sign convention.</strong> Some texts write $\\mathcal{L} = f + \\lambda g$, others $\\mathcal{L} = f - \\lambda g$. The sign of $\\lambda$ flips between conventions; the geometry and the solution are identical. We use the minus convention, which makes the inequality-constraint version (KKT, section 6) match the dual-feasibility condition $\\mu \\ge 0$.</p>

<h2 class="lesson-title">4. Worked Example: Maximise $xy$ on the Unit Circle</h2>

<p class="l-text"><strong>Problem:</strong> maximise $f(x,y) = xy$ subject to $g(x,y) = x^2 + y^2 - 1 = 0$. This is the example illustrated in section 2's plot.</p>

<p class="l-text">Set up the Lagrangian:</p>

<div class="calc-formula"><div class="formula-label">LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(x, y, \\lambda) \\;=\\; xy \\;-\\; \\lambda(x^2 + y^2 - 1)$$</div><div class="formula-sub">Stationary points satisfy $\\partial \\mathcal{L} / \\partial x = \\partial \\mathcal{L} / \\partial y = \\partial \\mathcal{L} / \\partial \\lambda = 0$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Compute the partials</div><div class="step-detail">$\\partial_x \\mathcal{L} = y - 2\\lambda x = 0$, $\\partial_y \\mathcal{L} = x - 2\\lambda y = 0$, $\\partial_\\lambda \\mathcal{L} = -(x^2 + y^2 - 1) = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Eliminate $\\lambda$</div><div class="step-detail">From the first two equations: $y = 2\\lambda x$ and $x = 2\\lambda y$. Substituting the first into the second: $x = 2\\lambda(2\\lambda x) = 4\\lambda^2 x$. So $x(1 - 4\\lambda^2) = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Solve for $\\lambda$</div><div class="step-detail">Either $x = 0$ (and then $y = 2\\lambda \\cdot 0 = 0$, but $x^2 + y^2 = 0 \\ne 1$, contradiction) or $\\lambda = \\pm 1/2$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Recover $(x,y)$</div><div class="step-detail">With $\\lambda = 1/2$: $y = x$, and $x^2 + x^2 = 1$ gives $x = \\pm 1/\\sqrt{2}$, $y = \\pm 1/\\sqrt{2}$ (same signs). With $\\lambda = -1/2$: $y = -x$, giving $(\\pm 1/\\sqrt{2}, \\mp 1/\\sqrt{2})$.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Evaluate $f$</div><div class="step-detail">At $(1/\\sqrt{2}, 1/\\sqrt{2})$: $f = 1/2$. At $(-1/\\sqrt{2}, -1/\\sqrt{2})$: $f = 1/2$. At $(1/\\sqrt{2}, -1/\\sqrt{2})$: $f = -1/2$. At $(-1/\\sqrt{2}, 1/\\sqrt{2})$: $f = -1/2$. Maximum is $1/2$, minimum is $-1/2$.</div></div></div>
</div>

<p class="l-text"><strong>Sanity check on the multiplier.</strong> At the maximum, $\\nabla f = (y, x) = (1/\\sqrt 2, 1/\\sqrt 2)$ and $\\nabla g = (2x, 2y) = (\\sqrt 2, \\sqrt 2)$. Indeed $\\nabla f = \\tfrac12 \\nabla g$, recovering $\\lambda = 1/2$. The gradients are aligned, just as the geometry predicted.</p>

<h2 class="lesson-title">5. Worked Example: Box of Minimal Surface for Fixed Volume</h2>

<p class="l-text"><strong>Problem:</strong> find dimensions of a closed rectangular box with side lengths $x, y, z > 0$ that minimise the surface area subject to a given volume $V$.</p>

<p class="l-text">$f(x, y, z) = 2(xy + yz + zx)$, the surface area. $g(x, y, z) = xyz - V = 0$, the volume constraint. Lagrangian:</p>

<div class="calc-formula"><div class="formula-label">LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(x, y, z, \\lambda) \\;=\\; 2(xy + yz + zx) \\;-\\; \\lambda (xyz - V)$$</div><div class="formula-sub">A natural physical problem: shipping companies want to minimise cardboard for a fixed shipping volume.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Partial derivatives</div><div class="step-detail">$\\partial_x \\mathcal{L} = 2(y + z) - \\lambda yz = 0$, and by symmetry $\\partial_y \\mathcal{L} = 2(x + z) - \\lambda xz = 0$, $\\partial_z \\mathcal{L} = 2(x + y) - \\lambda xy = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Exploit symmetry</div><div class="step-detail">The three equations are invariant under permutations of $(x, y, z)$. The natural solution is $x = y = z$ — a cube.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Verify the cube is a critical point</div><div class="step-detail">Set $x = y = z = a$. From the first equation: $2(a + a) - \\lambda a^2 = 0 \\Rightarrow \\lambda = 4/a$. By symmetry the other two equations give the same $\\lambda$. Consistent.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Use the constraint</div><div class="step-detail">$a^3 = V \\Rightarrow a = V^{1/3}$. The minimal-surface box for fixed volume is a cube of side $V^{1/3}$.</div></div></div>
</div>

<p class="l-text"><strong>Interpretation of $\\lambda$.</strong> The multiplier $\\lambda = 4/a$ is the <em>marginal cost</em> of volume: if you relax the volume by a tiny $dV$, the surface area increases by $\\lambda \\, dV$. In economics this is called a shadow price; in physics it is a Lagrange multiplier; in convex optimisation it is a <em>dual variable</em>. All three are the same scalar.</p>

<h2 class="lesson-title">6. Multiple Constraints</h2>

<div class="calc-highlight"><strong>When several equality constraints are simultaneously imposed,</strong> $g_1(x) = \\cdots = g_m(x) = 0$, the gradient $\\nabla f$ at an extremum lies in the linear span of the constraint gradients: $\\nabla f = \\sum_j \\lambda_j \\nabla g_j$.</div>

<div class="calc-formula"><div class="formula-label">MULTI-CONSTRAINT LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(x, \\lambda_1, \\ldots, \\lambda_m) \\;=\\; f(x) \\;-\\; \\sum_{j=1}^{m} \\lambda_j \\, g_j(x)$$</div><div class="formula-sub">$\\nabla_x \\mathcal{L} = 0$ gives $\\nabla f = \\sum_j \\lambda_j \\nabla g_j$. $\\partial \\mathcal{L} / \\partial \\lambda_j = 0$ enforces $g_j(x) = 0$ for each $j$. Total: $n + m$ equations, $n + m$ unknowns.</div></div>

<p class="l-text"><strong>Geometric meaning.</strong> The feasible set is the intersection of the $m$ level surfaces $\\{g_j = 0\\}$, generically a manifold of dimension $n - m$ (if the constraint gradients are linearly independent). The <em>normal space</em> to this manifold at any point is the $m$-dimensional span of $\\{\\nabla g_1, \\ldots, \\nabla g_m\\}$. The extremum condition says $\\nabla f$ lies in this normal space — equivalently, $\\nabla f$ has no component tangent to the manifold.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TWO LINEAR CONSTRAINTS IN $\\mathbb{R}^3$</div><div class="example-body">Minimise $f(x,y,z) = x^2 + y^2 + z^2$ subject to $g_1 = x + y + z - 1 = 0$ and $g_2 = x + 2y + 3z - 4 = 0$. Geometrically: find the point on the line of intersection of two planes closest to the origin.<br><br>
$\\mathcal{L} = x^2 + y^2 + z^2 - \\lambda_1(x+y+z-1) - \\lambda_2(x+2y+3z-4)$.<br><br>
$\\partial_x: 2x = \\lambda_1 + \\lambda_2$<br>
$\\partial_y: 2y = \\lambda_1 + 2\\lambda_2$<br>
$\\partial_z: 2z = \\lambda_1 + 3\\lambda_2$<br><br>
Plug into the two constraints: $x + y + z = 1$ becomes $(3\\lambda_1 + 6\\lambda_2)/2 = 1$, and $x + 2y + 3z = 4$ becomes $(6\\lambda_1 + 14\\lambda_2)/2 = 4$. Solve the 2x2 system: $\\lambda_1 = -2/3$, $\\lambda_2 = 5/3$. Then $x = 1/2$, $y = 4/3$, $z = 13/6$ — but wait, these must satisfy the constraints. Quick check: $x+y+z = 1/2 + 4/3 + 13/6 = 3/6 + 8/6 + 13/6 = 24/6 = 4$. That is the second constraint value, not 1. Recomputing carefully: from $3\\lambda_1 + 6\\lambda_2 = 2$ and $6\\lambda_1 + 14\\lambda_2 = 8$, we get $\\lambda_2 = 2$, $\\lambda_1 = -10/3$. Then $x = -2/3$, $y = 1/3$, $z = 4/3$. Verify: $-2/3 + 1/3 + 4/3 = 3/3 = 1$ ✓; $-2/3 + 2/3 + 4 = 4$ ✓. Distance$^2$ = $4/9 + 1/9 + 16/9 = 21/9 = 7/3$.<br><br>
The closest point on this line to the origin is at distance $\\sqrt{7/3} \\approx 1.528$. Lagrange handled both constraints simultaneously, no substitution required.</div></div>

<h2 class="lesson-title">7. Inequality Constraints: KKT Conditions</h2>

<div class="calc-highlight"><strong>Most real problems mix equality and inequality constraints.</strong> A portfolio must sum to 1 (equality) <em>and</em> every weight must be non-negative (inequality). An SVM has margins that must be at least 1 (inequalities). The generalisation of Lagrange's method to inequalities is the <em>Karush-Kuhn-Tucker</em> (KKT) framework, named after Karush (1939) and Kuhn-Tucker (1951).</div>

<div class="calc-formula"><div class="formula-label">THE GENERAL INEQUALITY PROBLEM</div><div class="formula-main">$$\\min_x f(x) \\quad \\text{subject to} \\quad g_i(x) \\le 0 \\;\\;(i = 1, \\ldots, p), \\quad h_j(x) = 0 \\;\\;(j = 1, \\ldots, m)$$</div><div class="formula-sub">$p$ inequality constraints (negative when satisfied) and $m$ equality constraints. Convention: $g_i \\le 0$ rather than $\\ge 0$ keeps the sign of dual variables consistent.</div></div>

<p class="l-text">Form the Lagrangian with both types of multiplier:</p>

<div class="calc-formula"><div class="formula-label">KKT LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(x, \\mu, \\lambda) \\;=\\; f(x) \\;+\\; \\sum_{i=1}^{p} \\mu_i \\, g_i(x) \\;+\\; \\sum_{j=1}^{m} \\lambda_j \\, h_j(x)$$</div><div class="formula-sub">$\\mu_i$ are dual variables for the inequalities (sign-restricted), $\\lambda_j$ for the equalities (free sign). The KKT conditions are first-order necessary conditions for a local optimum.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Primal feasibility</div><div class="card-body">$g_i(x^*) \\le 0$ for all $i$, $h_j(x^*) = 0$ for all $j$. The point satisfies the constraints.</div><div class="card-formula">$g \\le 0$, $h = 0$</div></div>
<div class="calc-card"><div class="card-title">Dual feasibility</div><div class="card-body">$\\mu_i \\ge 0$. Multipliers for inequalities are non-negative.</div><div class="card-formula">$\\mu \\ge 0$</div></div>
<div class="calc-card"><div class="card-title">Stationarity</div><div class="card-body">$\\nabla f(x^*) + \\sum_i \\mu_i \\nabla g_i(x^*) + \\sum_j \\lambda_j \\nabla h_j(x^*) = 0$. Gradient balance.</div><div class="card-formula">$\\nabla_x \\mathcal{L} = 0$</div></div>
<div class="calc-card"><div class="card-title">Complementary slackness</div><div class="card-body">$\\mu_i \\, g_i(x^*) = 0$ for each $i$. Either the constraint is active ($g_i = 0$) or its multiplier is zero ($\\mu_i = 0$).</div><div class="card-formula">$\\mu_i g_i = 0$</div></div>
</div>

<p class="l-text"><strong>Why $\\mu \\ge 0$?</strong> Imagine $g_i(x) \\le 0$ is active at $x^*$, i.e. $g_i(x^*) = 0$. Moving in a direction $d$ with $\\nabla g_i \\cdot d < 0$ strictly decreases $g_i$ and thus stays feasible. If $\\mu_i < 0$ at the optimum, the stationarity condition would say $\\nabla f$ has a component <em>against</em> $\\nabla g_i$, so moving inward (where the constraint relaxes) would decrease $f$ — contradicting optimality. Hence $\\mu_i \\ge 0$.</p>

<p class="l-text"><strong>Why complementary slackness?</strong> If a constraint is <em>inactive</em> at the optimum ($g_i(x^*) < 0$), it does not influence the local geometry — we could ignore it. The constraint's multiplier must therefore be zero. Conversely, if $\\mu_i > 0$, the gradient term $\\mu_i \\nabla g_i$ pulls the stationarity equation, so the constraint must be tight: $g_i(x^*) = 0$.</p>

<div class="calc-graph"><div id="plot-l7-kkt-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> minimise $f(x,y) = (x-2)^2 + (y-2)^2$ (concentric blue circles centred at $(2,2)$) subject to $g(x,y) = x + y - 1 \\le 0$ (orange line; feasible region below-left). The unconstrained minimum at $(2,2)$ is infeasible. The constrained minimum sits on the boundary $x+y=1$ at the closest point $(0.5, 0.5)$, where $\\nabla f$ is parallel to $\\nabla g$ and the multiplier $\\mu > 0$ — the constraint is active.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=0;i<=80;i++){var rowx=[],rowy=[],rowz=[];for(var j=0;j<=80;j++){var x=-1+4*j/80,y=-1+4*i/80;rowx.push(x);rowy.push(y);rowz.push((x-2)*(x-2)+(y-2)*(y-2));}xs.push(rowx);ys.push(rowy);zs.push(rowz);}
var bx=[-1,3],by=[2,-2];
var fxs=[],fys=[];for(var k=-20;k<=20;k++){var t=k/10;fxs.push(t);fys.push(1-t);}
var d1={type:'contour',x:xs[0],y:ys.map(function(r){return r[0];}),z:zs,colorscale:[[0,'rgba(59,130,246,0.05)'],[0.5,'rgba(59,130,246,0.45)'],[1,'rgba(59,130,246,0.85)']],contours:{coloring:'lines',start:0,end:9,size:0.5},line:{width:1.2},showscale:false,name:'f contours'};
var d2={x:fxs,y:fys,mode:'lines',name:'constraint x+y=1',line:{color:'#f59e0b',width:2.6}};
var d3={x:[0.5],y:[0.5],mode:'markers',name:'constrained min',marker:{color:'#10b981',size:13,symbol:'star'}};
var d4={x:[2],y:[2],mode:'markers',name:'unconstrained min (infeasible)',marker:{color:'#ef4444',size:11,symbol:'x'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,3],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,3]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-kkt-en',[d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Constraint qualifications.</strong> The KKT conditions are <em>necessary</em> at a local optimum only if some regularity assumption (a <em>constraint qualification</em>) holds — most commonly, that the gradients of active constraints are linearly independent (LICQ). When the problem is <em>convex</em> (convex $f$, convex $g_i$, affine $h_j$), KKT conditions are also <em>sufficient</em>: any KKT point is a global minimum.</p>

<h2 class="lesson-title">8. Lagrangian Duality</h2>

<div class="calc-highlight"><strong>The deepest consequence of the Lagrangian setup is duality.</strong> Define the <em>dual function</em> $\\mathcal{D}(\\mu, \\lambda) = \\min_x \\mathcal{L}(x, \\mu, \\lambda)$. The <em>dual problem</em> is to maximise $\\mathcal{D}(\\mu, \\lambda)$ subject to $\\mu \\ge 0$. For convex problems, the dual maximum equals the primal minimum — <em>strong duality</em>. This single fact powers SVMs, OT, MaxEnt, RLHF, and a thousand other corners of ML.</div>

<div class="calc-formula"><div class="formula-label">PRIMAL AND DUAL</div><div class="formula-main">$$\\underbrace{\\min_x \\, \\max_{\\mu \\ge 0, \\lambda} \\mathcal{L}(x, \\mu, \\lambda)}_{\\text{primal}} \\;\\;\\geq\\;\\; \\underbrace{\\max_{\\mu \\ge 0, \\lambda} \\, \\min_x \\mathcal{L}(x, \\mu, \\lambda)}_{\\text{dual}}$$</div><div class="formula-sub">The weak-duality inequality always holds. Strong duality (equality) holds under convex problem + constraint qualification (Slater's condition).</div></div>

<p class="l-text"><strong>Why does weak duality hold?</strong> For any $x$ feasible for the primal and any $(\\mu, \\lambda)$ feasible for the dual,</p>

<div class="calc-formula"><div class="formula-label">CHAIN OF INEQUALITIES</div><div class="formula-main">$$\\mathcal{D}(\\mu, \\lambda) \\;=\\; \\min_{x'} \\mathcal{L}(x', \\mu, \\lambda) \\;\\le\\; \\mathcal{L}(x, \\mu, \\lambda) \\;=\\; f(x) + \\sum_i \\mu_i g_i(x) + \\sum_j \\lambda_j h_j(x) \\;\\le\\; f(x)$$</div><div class="formula-sub">The last inequality uses $\\mu_i \\ge 0$ and $g_i(x) \\le 0$ and $h_j(x) = 0$. So the dual objective never exceeds the primal — they sandwich the optimum.</div></div>

<p class="l-text"><strong>When strong duality matters.</strong> If we can solve the dual instead of the primal, we have flexibility: the dual is often easier (fewer variables, simpler constraints, convex even when the primal is not). The SVM dual in the next section illustrates this perfectly: $n$ training points give $n$ dual variables, but the dual is a clean quadratic program with the kernel matrix as its only data — no feature vectors required.</p>

<h2 class="lesson-title">9. Application: The SVM Dual from Scratch</h2>

<div class="calc-highlight"><strong>The Support Vector Machine is the canonical Lagrangian application.</strong> The primal problem is geometric and intuitive but lives in feature space; the dual problem trades geometry for an inner-product structure that admits the kernel trick — opening the door to non-linear separation in infinite-dimensional feature spaces. Both are exactly the same optimum, viewed from two sides.</div>

<p class="l-text"><strong>Setup.</strong> Given training data $\\{(x_i, y_i)\\}_{i=1}^n$ with $y_i \\in \\{-1, +1\\}$, the hard-margin SVM seeks the maximum-margin separating hyperplane $w^T x + b = 0$.</p>

<div class="calc-formula"><div class="formula-label">SVM PRIMAL</div><div class="formula-main">$$\\min_{w, b} \\;\\frac{1}{2} \\|w\\|^2 \\quad \\text{subject to} \\quad y_i(w^T x_i + b) \\ge 1, \\;\\; i = 1, \\ldots, n$$</div><div class="formula-sub">Minimise $\\tfrac12\\|w\\|^2$ (equivalent to maximising the margin $1/\\|w\\|$) subject to all training points lying on the correct side of the margin.</div></div>

<p class="l-text">Rewriting the constraint in standard form $g_i = 1 - y_i(w^T x_i + b) \\le 0$, the Lagrangian becomes:</p>

<div class="calc-formula"><div class="formula-label">SVM LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(w, b, \\alpha) \\;=\\; \\frac{1}{2}\\|w\\|^2 \\;+\\; \\sum_{i=1}^{n} \\alpha_i \\big(1 - y_i(w^T x_i + b)\\big), \\quad \\alpha_i \\ge 0$$</div><div class="formula-sub">$\\alpha_i$ is the dual variable (KKT multiplier) for the $i$-th margin constraint. Dual feasibility $\\alpha_i \\ge 0$ comes from the inequality nature of the constraint.</div></div>

<p class="l-text"><strong>Step 1: stationarity in $w$ and $b$.</strong> Take partial derivatives:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$\\nabla_w \\mathcal{L} = 0$</div><div class="step-detail">$w - \\sum_i \\alpha_i y_i x_i = 0 \\;\\Rightarrow\\; w = \\sum_i \\alpha_i y_i x_i$. The optimal weight vector is a linear combination of training points, weighted by $\\alpha_i y_i$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\partial \\mathcal{L} / \\partial b = 0$</div><div class="step-detail">$-\\sum_i \\alpha_i y_i = 0$. The signed sum of dual variables vanishes.</div></div></div>
</div>

<p class="l-text"><strong>Step 2: substitute back into $\\mathcal{L}$.</strong> Replacing $w$ with $\\sum_i \\alpha_i y_i x_i$:</p>

<div class="calc-formula"><div class="formula-label">SUBSTITUTION</div><div class="formula-main">$$\\mathcal{L} \\;=\\; \\frac{1}{2}\\Big\\|\\sum_i \\alpha_i y_i x_i\\Big\\|^2 \\;+\\; \\sum_i \\alpha_i \\;-\\; \\sum_i \\alpha_i y_i\\Big(\\sum_j \\alpha_j y_j x_j\\Big)^T x_i \\;-\\; b \\sum_i \\alpha_i y_i$$</div><div class="formula-sub">Expanding the norm gives $\\tfrac12 \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$. The cross term gives $-\\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$. The $b$-term vanishes by step 2.</div></div>

<p class="l-text">Combining:</p>

<div class="calc-formula"><div class="formula-label">SVM DUAL</div><div class="formula-main">$$\\boxed{\\;\\max_\\alpha \\;\\sum_{i=1}^{n} \\alpha_i \\;-\\; \\frac{1}{2} \\sum_{i, j = 1}^{n} \\alpha_i \\alpha_j y_i y_j \\, (x_i^T x_j) \\quad \\text{s.t.} \\quad \\alpha_i \\ge 0, \\;\\; \\sum_i \\alpha_i y_i = 0 \\;}$$</div><div class="formula-sub">A quadratic program in $n$ variables. The training data appears <em>only</em> through the inner products $x_i^T x_j$. This is the entire SVM dual.</div></div>

<p class="l-text"><strong>Step 3: identify support vectors.</strong> By complementary slackness, $\\alpha_i \\big(1 - y_i(w^T x_i + b)\\big) = 0$ for each $i$. So either $\\alpha_i = 0$ (the point is strictly inside the correct half-space, no constraint pressure) or $y_i(w^T x_i + b) = 1$ (the point sits exactly on the margin). The latter are the <em>support vectors</em> — and only they contribute to $w = \\sum_i \\alpha_i y_i x_i$. Everything else is filler.</p>

<div class="calc-graph"><div id="plot-l7-svm-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a synthetic linearly separable 2-class dataset. The optimal SVM hyperplane (solid blue) lies exactly between the two classes; the parallel margin lines (dashed) touch the support vectors (circled red). All other points have $\\alpha_i = 0$ by complementary slackness — removing them would not change the solution. The width of the margin is $2/\\|w\\|$, maximised by the dual optimum.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=1;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=Math.max(rng(),1e-9),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var p1x=[],p1y=[],p2x=[],p2y=[];
for(var i=0;i<20;i++){p1x.push(2+0.5*randn());p1y.push(2+0.5*randn());p2x.push(-1+0.5*randn());p2y.push(-1+0.5*randn());}
var w=[1,1],b=-1;
var hx=[],hy=[],m1y=[],m2y=[];
for(var k=-30;k<=30;k++){var t=k/10;hx.push(t);hy.push(-(w[0]*t+b)/w[1]);m1y.push(-(w[0]*t+b-1)/w[1]);m2y.push(-(w[0]*t+b+1)/w[1]);}
var svx=[p1x[0],p2x[0]],svy=[p1y[0],p2y[0]];
var d1={x:p1x,y:p1y,mode:'markers',name:'class +1',marker:{color:'#3b82f6',size:9,line:{color:'#0a0a0a',width:1}}};
var d2={x:p2x,y:p2y,mode:'markers',name:'class -1',marker:{color:'#f59e0b',size:9,line:{color:'#0a0a0a',width:1}}};
var d3={x:hx,y:hy,mode:'lines',name:'hyperplane',line:{color:'#10b981',width:2.6}};
var d4={x:hx,y:m1y,mode:'lines',name:'margin +1',line:{color:'#9ca3af',width:1.5,dash:'dash'}};
var d5={x:hx,y:m2y,mode:'lines',name:'margin -1',line:{color:'#9ca3af',width:1.5,dash:'dash'},showlegend:false};
var d6={x:svx,y:svy,mode:'markers',name:'support vectors',marker:{color:'rgba(239,68,68,0)',size:18,line:{color:'#ef4444',width:2.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,4],scaleanchor:'y'},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-svm-en',[d1,d2,d3,d4,d5,d6],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. The Kernel Trick</h2>

<div class="calc-highlight"><strong>The SVM dual uses only inner products $x_i^T x_j$ — never the feature vectors themselves.</strong> If we replace $x \\mapsto \\phi(x)$ with some non-linear feature map and never compute $\\phi$ explicitly, we get non-linear separation for the same computational cost. The function $K(x_i, x_j) = \\phi(x_i)^T \\phi(x_j)$ is called a <em>kernel</em>, and this substitution is the <em>kernel trick</em> — arguably the most influential consequence of Lagrangian duality in all of ML.</div>

<div class="calc-formula"><div class="formula-label">KERNELISED SVM DUAL</div><div class="formula-main">$$\\max_\\alpha \\;\\sum_i \\alpha_i \\;-\\; \\frac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j \\, K(x_i, x_j) \\quad \\text{s.t.} \\quad \\alpha_i \\ge 0, \\;\\; \\sum_i \\alpha_i y_i = 0$$</div><div class="formula-sub">Identical to the linear dual except $x_i^T x_j$ becomes $K(x_i, x_j)$. The decision function is $f(x) = \\sum_i \\alpha_i y_i K(x_i, x) + b$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Linear</div><div class="card-body">$K(x, y) = x^T y$. Recovers the standard linear SVM.</div><div class="card-formula">$\\phi(x) = x$</div></div>
<div class="calc-card"><div class="card-title">Polynomial</div><div class="card-body">$K(x, y) = (x^T y + 1)^d$. Feature map: monomials of degree $\\le d$. For $d=2$, includes interaction terms.</div><div class="card-formula">$\\phi$: degree-$d$ monomials</div></div>
<div class="calc-card"><div class="card-title">RBF / Gaussian</div><div class="card-body">$K(x, y) = \\exp(-\\gamma \\|x - y\\|^2)$. Feature map: infinite-dimensional. Universal approximator — any continuous decision boundary.</div><div class="card-formula">$\\phi$: infinite dim.</div></div>
</div>

<p class="l-text"><strong>Why does this work without computing $\\phi$?</strong> Mercer's theorem says: any symmetric, positive-semi-definite function $K$ <em>is</em> an inner product in some feature space. We never need to construct that space explicitly — we work entirely with the kernel matrix $K_{ij} = K(x_i, x_j)$, an $n \\times n$ Gram matrix, which is all the dual needs.</p>

<div class="l-note"><strong>Soft margin.</strong> Real data is rarely separable, so the practical SVM relaxes the margin constraint with slack variables $\\xi_i \\ge 0$: $y_i(w^T x_i + b) \\ge 1 - \\xi_i$, and penalises $C \\sum_i \\xi_i$ in the objective. The dual is identical except $\\alpha_i \\le C$ is added — a box constraint instead of a one-sided constraint. The kernel trick still applies, and $C$ becomes the inverse-regularisation hyperparameter you tune.</p>

<h2 class="lesson-title">11. Application: Maximum Entropy = Gaussian</h2>

<div class="calc-highlight"><strong>Among all probability distributions on $\\mathbb{R}$ with a given mean and variance, the one with the highest differential entropy is the Gaussian.</strong> This single fact justifies the central role of the normal distribution: it is the maximally uninformative distribution consistent with the moment constraints. The proof is a beautiful three-line Lagrangian calculation.</div>

<div class="calc-formula"><div class="formula-label">MAX-ENTROPY PROBLEM</div><div class="formula-main">$$\\max_p \\;\\Big[\\,-\\!\\int p(x) \\log p(x) \\, dx\\,\\Big] \\quad \\text{s.t.} \\quad \\int p \\, dx = 1, \\;\\int x \\, p \\, dx = \\mu, \\;\\int x^2 \\, p \\, dx = \\mu^2 + \\sigma^2$$</div><div class="formula-sub">Three integral constraints: normalisation, mean $\\mu$, second moment $\\mu^2 + \\sigma^2$ (equivalently variance $\\sigma^2$). The optimisation variable is the density $p$ itself.</div></div>

<p class="l-text">Form the Lagrangian with three multipliers $\\lambda_0, \\lambda_1, \\lambda_2$:</p>

<div class="calc-formula"><div class="formula-label">LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}[p] \\;=\\; -\\!\\int p \\log p \\, dx \\;-\\; \\lambda_0 \\Big(\\!\\int p \\, dx - 1\\Big) \\;-\\; \\lambda_1 \\Big(\\!\\int x p \\, dx - \\mu\\Big) \\;-\\; \\lambda_2 \\Big(\\!\\int x^2 p \\, dx - (\\mu^2 + \\sigma^2)\\Big)$$</div><div class="formula-sub">A functional of $p$. Take the functional derivative $\\delta \\mathcal{L} / \\delta p(x)$ and set to zero — the infinite-dimensional analogue of $\\nabla_x \\mathcal{L} = 0$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Functional derivative</div><div class="step-detail">$\\delta \\mathcal{L} / \\delta p(x) = -\\log p(x) - 1 - \\lambda_0 - \\lambda_1 x - \\lambda_2 x^2 = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Solve for $p$</div><div class="step-detail">$\\log p(x) = -1 - \\lambda_0 - \\lambda_1 x - \\lambda_2 x^2 \\;\\Rightarrow\\; p(x) = \\exp(-1 - \\lambda_0) \\cdot \\exp(-\\lambda_1 x - \\lambda_2 x^2)$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Recognise the Gaussian shape</div><div class="step-detail">$p(x) \\propto \\exp(-\\lambda_2 x^2 - \\lambda_1 x)$. Complete the square in the exponent: $-\\lambda_2(x + \\lambda_1/(2\\lambda_2))^2 + \\text{const}$. So $p$ is a Gaussian with mean $-\\lambda_1/(2\\lambda_2)$ and variance $1/(2\\lambda_2)$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Match the constraints</div><div class="step-detail">Setting mean $= \\mu$ and variance $= \\sigma^2$ gives $\\lambda_2 = 1/(2\\sigma^2)$, $\\lambda_1 = -\\mu/\\sigma^2$. Normalisation $\\lambda_0$ is determined by $\\int p = 1$, yielding the standard prefactor $1/\\sqrt{2\\pi\\sigma^2}$.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Conclusion</div><div class="step-detail">$p(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\!\\big( -\\tfrac{(x-\\mu)^2}{2\\sigma^2} \\big)$. The maximum-entropy distribution with prescribed mean and variance is exactly $\\mathcal{N}(\\mu, \\sigma^2)$. $\\square$</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l7-maxent-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three maximum-entropy distributions, each for a different set of constraints. (Blue) Uniform on $[0, 4]$ — max entropy when only the support is constrained. (Orange) Exponential with rate $1/2$ — max entropy when the mean is constrained but the support is $[0, \\infty)$. (Green) Gaussian $\\mathcal{N}(2, 1)$ — max entropy when both mean and variance are constrained on $\\mathbb{R}$. Each is the most uninformative distribution consistent with its constraints.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],pu=[],pe=[],pg=[];
for(var i=0;i<=400;i++){var x=-3+10*i/400;xs.push(x);pu.push((x>=0&&x<=4)?0.25:0);pe.push(x>=0?0.5*Math.exp(-0.5*x):0);pg.push(Math.exp(-0.5*(x-2)*(x-2))/Math.sqrt(2*Math.PI));}
var d1={x:xs,y:pu,mode:'lines',name:'Uniform[0,4]',line:{color:'#3b82f6',width:2.4}};
var d2={x:xs,y:pe,mode:'lines',name:'Exp(rate=0.5)',line:{color:'#f59e0b',width:2.4}};
var d3={x:xs,y:pg,mode:'lines',name:'Gaussian N(2,1)',line:{color:'#10b981',width:2.4}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,7]},yaxis:{title:'density p(x)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-maxent-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No constraints</div><div class="card-body">On a bounded interval $[a,b]$: max-entropy distribution is uniform. Equivalently, principle of insufficient reason.</div><div class="card-formula">$p(x) = 1/(b-a)$</div></div>
<div class="calc-card"><div class="card-title">Mean only</div><div class="card-body">On $[0, \\infty)$ with mean $\\mu$: max-entropy is exponential $\\mathrm{Exp}(1/\\mu)$. Birth-death processes, queueing.</div><div class="card-formula">$p(x) = \\tfrac{1}{\\mu} e^{-x/\\mu}$</div></div>
<div class="calc-card"><div class="card-title">Mean + variance</div><div class="card-body">On $\\mathbb{R}$: max-entropy is Gaussian $\\mathcal{N}(\\mu, \\sigma^2)$. The reason normal noise is the default assumption.</div><div class="card-formula">$p \\propto e^{-(x-\\mu)^2 / 2\\sigma^2}$</div></div>
<div class="calc-card"><div class="card-title">Discrete energy</div><div class="card-body">With $E[E(X)] = U$ fixed: max-entropy is Boltzmann $p(x) \\propto e^{-\\beta E(x)}$. The bridge to statistical mechanics.</div><div class="card-formula">$p(x) \\propto e^{-\\beta E(x)}$</div></div>
</div>

<div class="l-note"><strong>Why this matters in ML.</strong> When you place a Gaussian prior on a parameter, you are making the weakest assumption consistent with its mean and variance. When the central limit theorem produces approximately Gaussian residuals, max-entropy is the philosophical reason. Variational autoencoders, mean-field VI, and Gaussian processes all lean on max-entropy logic: in the absence of further information, the Gaussian is the maximally honest choice.</p>

<h2 class="lesson-title">12. Practical Pyodide Exercise</h2>

<p class="l-text">Now we put Lagrange to work in Python. The exercise has three parts: (1) solve a small constrained problem with <code>scipy.optimize.minimize</code> using the <code>constraints</code> argument; (2) implement a tiny SVM dual by solving a QP with <code>cvxpy</code> and read off the support vectors from the dual variables; (3) verify numerically that the max-entropy distribution with prescribed moments converges to the Gaussian by optimising over a discretised density.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize

<span class="cm"># ===== PART 1: scipy constrained optimisation =====</span>
<span class="cm"># minimise f(x,y) = x^2 + y^2 subject to x + y - 1 = 0</span>
<span class="kw">def</span> <span class="fn">f</span>(z):
    <span class="kw">return</span> z[<span class="num">0</span>]**<span class="num">2</span> + z[<span class="num">1</span>]**<span class="num">2</span>

<span class="kw">def</span> <span class="fn">grad_f</span>(z):
    <span class="kw">return</span> np.<span class="fn">array</span>([<span class="num">2</span>*z[<span class="num">0</span>], <span class="num">2</span>*z[<span class="num">1</span>]])

constraint = {<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> z: z[<span class="num">0</span>] + z[<span class="num">1</span>] - <span class="num">1</span>}
res = <span class="fn">minimize</span>(f, x0=[<span class="num">2.0</span>, <span class="num">2.0</span>], jac=grad_f, constraints=[constraint], method=<span class="str">'SLSQP'</span>)
<span class="fn">print</span>(<span class="str">f"Constrained min: x = {res.x},  f* = {res.fun:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"Expected: (0.5, 0.5), f* = 0.5"</span>)

<span class="cm"># ===== PART 2: SVM dual via quadratic programming =====</span>
<span class="cm"># Generate a small linearly separable dataset</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
n_per_class = <span class="num">10</span>
X1 = np.random.<span class="fn">randn</span>(n_per_class, <span class="num">2</span>) + np.<span class="fn">array</span>([<span class="num">2</span>, <span class="num">2</span>])
X2 = np.random.<span class="fn">randn</span>(n_per_class, <span class="num">2</span>) + np.<span class="fn">array</span>([-<span class="num">2</span>, -<span class="num">2</span>])
X = np.<span class="fn">vstack</span>([X1, X2])
y = np.<span class="fn">concatenate</span>([np.<span class="fn">ones</span>(n_per_class), -np.<span class="fn">ones</span>(n_per_class)])
n = <span class="fn">len</span>(y)

<span class="cm"># Build the Gram matrix K[i,j] = y[i] y[j] x[i].x[j]</span>
K = (y[:, <span class="kw">None</span>] * y[<span class="kw">None</span>, :]) * (X @ X.T)

<span class="cm"># Solve the SVM dual:</span>
<span class="cm"># maximise sum(alpha) - 0.5 alpha^T K alpha  s.t.  alpha &gt;= 0,  sum(alpha*y) = 0</span>
<span class="cm"># equivalently, minimise 0.5 alpha^T K alpha - sum(alpha)</span>
<span class="kw">def</span> <span class="fn">neg_dual</span>(alpha):
    <span class="kw">return</span> <span class="num">0.5</span> * alpha @ K @ alpha - alpha.<span class="fn">sum</span>()

<span class="kw">def</span> <span class="fn">grad_neg_dual</span>(alpha):
    <span class="kw">return</span> K @ alpha - np.<span class="fn">ones</span>(n)

cons = [{<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> a: np.<span class="fn">dot</span>(a, y)}]
bounds = [(<span class="num">0</span>, <span class="kw">None</span>)] * n
alpha0 = np.<span class="fn">zeros</span>(n)
res_svm = <span class="fn">minimize</span>(neg_dual, alpha0, jac=grad_neg_dual,
                   bounds=bounds, constraints=cons, method=<span class="str">'SLSQP'</span>)
alpha = res_svm.x

<span class="cm"># Recover w and b</span>
w = ((alpha * y)[:, <span class="kw">None</span>] * X).<span class="fn">sum</span>(axis=<span class="num">0</span>)
support = alpha &gt; <span class="num">1e-5</span>
<span class="cm"># average b over support vectors for stability</span>
b = (y[support] - X[support] @ w).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">f"\\nSVM dual solution:"</span>)
<span class="fn">print</span>(<span class="str">f"  number of support vectors: {support.<span class="fn">sum</span>()} out of {n}"</span>)
<span class="fn">print</span>(<span class="str">f"  w = {w}"</span>)
<span class="fn">print</span>(<span class="str">f"  b = {b:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"  margin width = {2 / np.<span class="fn">linalg</span>.<span class="fn">norm</span>(w):.4f}"</span>)

<span class="cm"># Check KKT: support vectors have y(wx+b) = 1, non-SVs have alpha = 0</span>
margin = y * (X @ w + b)
<span class="fn">print</span>(<span class="str">f"  min margin on support vectors: {margin[support].<span class="fn">min</span>():.4f}  (expect 1.0)"</span>)
<span class="fn">print</span>(<span class="str">f"  max alpha on non-support: {alpha[~support].<span class="fn">max</span>():.2e}"</span>)

<span class="cm"># ===== PART 3: Max-entropy density on a grid =====</span>
<span class="cm"># Discretise x in [-5, 5] and maximise -sum p log p</span>
<span class="cm"># subject to sum(p) = 1, sum(x p) = mu, sum(x^2 p) = mu^2 + sigma^2</span>
x_grid = np.<span class="fn">linspace</span>(-<span class="num">5</span>, <span class="num">5</span>, <span class="num">200</span>)
dx = x_grid[<span class="num">1</span>] - x_grid[<span class="num">0</span>]
mu, sigma = <span class="num">1.0</span>, <span class="num">1.5</span>

<span class="kw">def</span> <span class="fn">neg_entropy</span>(p):
    p_safe = np.<span class="fn">clip</span>(p, <span class="num">1e-12</span>, <span class="kw">None</span>)
    <span class="kw">return</span> np.<span class="fn">sum</span>(p_safe * np.<span class="fn">log</span>(p_safe)) * dx

cons_me = [
    {<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> p: np.<span class="fn">sum</span>(p) * dx - <span class="num">1</span>},
    {<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> p: np.<span class="fn">sum</span>(x_grid * p) * dx - mu},
    {<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> p: np.<span class="fn">sum</span>(x_grid**<span class="num">2</span> * p) * dx - (mu**<span class="num">2</span> + sigma**<span class="num">2</span>)},
]
bounds_me = [(<span class="num">1e-9</span>, <span class="num">1.0</span>)] * <span class="fn">len</span>(x_grid)
p0 = np.<span class="fn">ones_like</span>(x_grid) / (<span class="fn">len</span>(x_grid) * dx)
res_me = <span class="fn">minimize</span>(neg_entropy, p0, bounds=bounds_me, constraints=cons_me,
                  method=<span class="str">'SLSQP'</span>, options={<span class="str">'maxiter'</span>: <span class="num">200</span>})

<span class="cm"># Compare against the analytic Gaussian</span>
p_gauss = np.<span class="fn">exp</span>(-<span class="num">0.5</span> * ((x_grid - mu) / sigma)**<span class="num">2</span>) / (sigma * np.<span class="fn">sqrt</span>(<span class="num">2</span> * np.pi))
err = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(res_me.x - p_gauss))
<span class="fn">print</span>(<span class="str">f"\\nMax-entropy density fit: max |p_numeric - p_gauss| = {err:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"(Should be small — confirms numerically that max-entropy = Gaussian.)"</span>)
</code></pre></div>

<p class="l-text"><strong>What to play with.</strong> Try changing the initial guess in part 1 — SLSQP converges from anywhere. In part 2, regenerate the data with overlapping clusters (e.g. shift the means closer) and watch the number of support vectors explode as the problem becomes nearly non-separable. In part 3, change $\\mu, \\sigma$ and see the numeric density track the analytic Gaussian; remove the variance constraint and watch the result collapse to a half-Gaussian or improper limit, depending on the support.</p>

<h2 class="lesson-title">13. Summary &amp; Where Lagrange Lives in Modern AI</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Equality Lagrange</div><div class="card-body">$\\nabla f = \\lambda \\nabla g$. Geometric: gradients aligned at extremum. Algebraic: unconstrained critical points of $\\mathcal{L} = f - \\lambda g$.</div><div class="card-formula">$\\nabla \\mathcal{L} = 0$</div></div>
<div class="calc-card"><div class="card-title">KKT inequality</div><div class="card-body">Primal feas + dual feas + stationarity + complementary slackness. Four conditions, necessary at any local optimum (under CQ), sufficient under convexity.</div><div class="card-formula">$\\mu g = 0,\\;\\mu \\ge 0$</div></div>
<div class="calc-card"><div class="card-title">Duality</div><div class="card-body">$\\min \\max \\mathcal{L} \\ge \\max \\min \\mathcal{L}$ always. Strong duality (equality) under convex + Slater. Dual often simpler than primal.</div><div class="card-formula">$\\min_{\\text{primal}} = \\max_{\\text{dual}}$</div></div>
<div class="calc-card"><div class="card-title">SVM dual</div><div class="card-body">$\\max \\sum \\alpha_i - \\tfrac12 \\sum \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$. Support vectors are the active KKT constraints. Kernel trick replaces inner product.</div><div class="card-formula">$\\alpha_i \\ge 0$, $\\sum\\alpha_i y_i = 0$</div></div>
<div class="calc-card"><div class="card-title">Max-entropy</div><div class="card-body">Among densities with given moments, the Gaussian maximises differential entropy. Justifies normal priors and the central role of $\\mathcal{N}(\\mu, \\sigma^2)$ in statistics.</div><div class="card-formula">$p^* = \\mathcal{N}(\\mu, \\sigma^2)$</div></div>
<div class="calc-card"><div class="card-title">RLHF</div><div class="card-body">Direct Preference Optimization (DPO) derives from a KL-constrained RL objective: $\\max_\\pi \\mathbb{E}[r(x,y)] - \\beta \\, \\mathrm{KL}(\\pi \\| \\pi_{\\text{ref}})$. The closed-form solution comes from Lagrangian KKT with $\\beta$ as the multiplier.</div><div class="card-formula">$\\pi^*(y|x) \\propto \\pi_{\\text{ref}}(y|x) e^{r/\\beta}$</div></div>
<div class="calc-card"><div class="card-title">Optimal transport</div><div class="card-body">Earth-mover's distance is the value of an LP with marginal constraints. The dual variables are Kantorovich potentials — central in Sinkhorn divergences and Wasserstein GANs.</div><div class="card-formula">$W(p,q) = \\min \\int c \\, d\\gamma$</div></div>
<div class="calc-card"><div class="card-title">Constrained RL</div><div class="card-body">CMDPs add expected-cost constraints to the standard MDP. Lagrangian relaxation turns the constrained problem into a saddle-point game between policy and dual variable — used in safe-exploration and constraint-aware fine-tuning.</div><div class="card-formula">$\\max_\\pi \\min_\\lambda \\mathcal{L}$</div></div>
<div class="calc-card"><div class="card-title">VAE and ELBO</div><div class="card-body">The evidence lower bound $\\log p(x) \\ge \\mathcal{L}(x; \\phi, \\theta)$ is a Lagrangian relaxation of the marginal likelihood. The KL term is the multiplier-weighted prior penalty.</div><div class="card-formula">ELBO = recon $-$ KL</div></div>
</div>

<div class="l-warn"><strong>Coming next (Lesson 8 — Advanced Vector Analysis):</strong> Stokes' theorem, divergence theorem, and how vector calculus identities (curl, divergence, gradient flows) reappear in physics-informed neural networks, score-based diffusion models, and flow matching. Lagrange multipliers will return as the Lagrangian density in field theory and the action principle behind continuous-time optimisation. The two threads — vector calculus and constrained optimisation — meet at variational principles, which is where the deepest modern AI methods (diffusion models, optimal transport, gradient flows on Wasserstein space) all live.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Gerçek dünyadaki neredeyse her optimizasyon probleminin bir bedeli vardır.</strong> Bir portföy yöneticisi beklenen getiriyi maksimize eder — ama sadece sermayenin %100'üne eşit olan dağılımlar üzerinde. Bir sinir ağı tasarımcısı kaybı minimize eder — ama sadece normu sınırlı ağırlıklar üzerinde. Bir istatistikçi en yüksek entropili dağılımı bulur — ama sadece verilen ortalama ve varyansa sahip olanlar arasında. Bir SVM iki sınıfı ayırır — ama sadece doğru tarafta marjlarla. Bunlar <em>kısıtlı optimizasyon</em> problemleridir ve bunları çözen geometrik numara iki yüzyıldan eskidir: <strong>Lagrange çarpanları</strong>.</p>

<p class="l-text">Bu derste Lagrange çarpanlarını tek satırlık geometrik bir resimden geliştiriyoruz (gradyan kısıt yüzeyine dik olmalı), yöntemi temiz bir varyasyonel argümanla ispatlıyoruz, üç tamamen işlenmiş örnekten geçiyoruz, eşitsizliklere <em>Karush-Kuhn-Tucker</em> koşulları ile genelleştiriyoruz ve sonunda — sıfırdan — Lagrange'i makine öğrenmesinde tanıdık bir isim yapan iki uygulamayı türetiyoruz: <strong>SVM duali</strong> (kernel hilesi bedavaya geliyor) ve Gauss dağılımının <strong>maksimum entropi</strong> türevi.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKSIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Geometrik resmi okumayı: kisitli ekstremumda $\\nabla f$, $\\nabla g$'ye paraleldir</li>
<li>Lagrange carpanlari yontemini varyasyonel bir argumandan turetmeyi ve coklu kisitlara uygulamayi</li>
<li>Uc klasik ornek uzerinden gecmeyi: birim cemberde $xy$, sabit yuzey alanli kutunun hacmi, bir noktadan duzleme mesafe</li>
<li>Esitsizlik kisitlari icin Karush-Kuhn-Tucker (KKT) kosullarini ifade edip ispatlamayi: primal/dual yapilabilirlik, duraganlik ve tamamlayici gevseklik</li>
<li>SVM dualini birincil marj formulasyonundan tamamen turetmeyi, destek vektorlerini aktif KKT kisitlari olarak tanimlamayi ve kernel hilesini kazanmayi</li>
<li>Ortalama-varyans kisitlari altinda maksimum entropi dagiliminin tam olarak Gauss oldugunu Lagrange ile kanitlamayi — istatistikteki $\\mathcal{N}(\\mu, \\sigma^2)$'nin merkezi rolunun en temiz gerekcesi</li>
<li>Python'da <code>scipy.optimize.minimize</code> ve <code>cvxpy</code> ile kisitli optimizasyon uygulamayi</li>
</ul>
</div>

<h2 class="lesson-title">1. Kisitli Optimizasyon Problemi</h2>

<div class="calc-highlight"><strong>Vanilla gradyan inisi kisitlari yok sayar.</strong> Birim kurede kalmasi gereken bir parametre uzerinde basitce $-\\nabla f$'yi takip edersen, daha ilk adimda kurenin disina cikarsin. Tum kisitli optimizasyon makinesi bu tek basarisizligi cozmek icin var: tum cevre uzaya degil, bir kisit manifolduna <em>oturan</em> ekstremumlari nasil bulursun?</div>

<p class="l-text">Genel esitlik-kisitli problem soyle okunur:</p>

<div class="calc-formula"><div class="formula-label">ESITLIK-KISITLI PROBLEM</div><div class="formula-main">$$\\min_{x \\in \\mathbb{R}^n} f(x) \\quad \\text{subject to} \\quad g_1(x) = 0, \\ldots, g_m(x) = 0$$</div><div class="formula-sub">Yapilabilir kume $m$ duzey yuzeyinin $\\{x : g_j(x) = 0\\}$ kesisimidir. $f$'nin bu kumeye kisitlanmis en kucuk degerini ariyoruz.</div></div>

<p class="l-text">Iki ornek resmi somutlastiriyor:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Portfoy</div><div class="card-body">$f(w) = -w^T \\mu$ (negatif getiri); $g(w) = \\mathbf{1}^T w - 1$ (agirliklar 1'e toplanir).</div><div class="card-formula">$\\max w^T\\mu$ s.t. $\\sum w_i = 1$</div></div>
<div class="calc-card"><div class="card-title">Geometri</div><div class="card-body">$f(x,y) = x^2 + y^2$ (origin'e mesafe); $g(x,y) = x + y - 1 = 0$ (bir cizgi). Bir cizgi uzerindeki en yakin nokta.</div><div class="card-formula">$\\min x^2+y^2$ s.t. $x+y=1$</div></div>
<div class="calc-card"><div class="card-title">SVM</div><div class="card-body">$f(w) = \\tfrac12\\|w\\|^2$ (marj); $g_i(w,b) = 1 - y_i(w^T x_i + b) \\le 0$ (1 gevseklikle dogru siniflandirilmis).</div><div class="card-formula">$\\min\\tfrac12\\|w\\|^2$ s.t. marj $\\ge 1$</div></div>
</div>

<p class="l-text">"Kisiti $f$'ye yerlestir ve daha az degiskenle minimize et" naif yaklasimi yalnizca kisit kapali biçimde cozulebildiginde calisir. Cok boyutta bir kure $x_1^2 + \\cdots + x_n^2 = 1$ icin yararli bir ikame yoktur. Kisiti <em>orulu</em> sekilde isleyen, $f$ ve $g$'yi esit zeminde ele alan bir yontem gerekir.</p>

<h2 class="lesson-title">2. Geometrik Fikir</h2>

<div class="calc-highlight"><strong>Duzgun bir kisit uzerinde ekstremumda, $f$'nin gradyani $g$'nin gradyanina paralel olmali.</strong> Baska bir sey kisit boyunca kaymana ve $f$'yi azaltmana izin verir — bu da ekstremumda olmakla celisir. Bu tek resim Lagrange carpanlarinin tumudur.</div>

<p class="l-text">$\\mathbb{R}^2$'de bir duzey kumesi $\\{g(x) = 0\\}$ dusun. Herhangi bir noktada $\\nabla g$ gradyani, o duzey kumesinin <em>normal</em>idir. Simdi $f$'nin duzey egrilerine bak, cesitli sabitler $c$ icin $\\{x : f(x) = c\\}$ kumeleri. $c$ degistikce bu egriler duzlemi tarar; bir yerlerde kisit egrisini keserler.</p>

<p class="l-text">Tipik bir kesimde $f$'nin duzey egrisi kisita bir taraftan girer ve diger taraftan cikar — sureklilikle, $f$ giris noktasinda kisit boyunca artar ve sonra azalir (ya da tam tersi). Yani tipik bir kesim ekstremum <em>degildir</em>. Ekstremum olan tek kesimler $f$'nin duzey egrisi kisita <em>teget</em> oldugu yerlerdir:</p>

<div class="calc-formula"><div class="formula-label">TEGETLIK KOSULU</div><div class="formula-main">$$\\nabla f(x^*) \\;=\\; \\lambda \\, \\nabla g(x^*) \\quad \\text{for some } \\lambda \\in \\mathbb{R}$$</div><div class="formula-sub">Kisitli ekstremumda, iki gradyan ayni yone (isaret ve olcek farkina kadar) isaret eder. Skaler $\\lambda$ <strong>Lagrange carpani</strong>dir.</div></div>

<p class="l-text"><strong>Neden paralel olmalilar?</strong> Aday nokta $x^*$'da gradyanlarin paralel <em>olmadigini</em> varsay. $\\nabla f(x^*)$'yi $\\nabla g$ boyunca bir bilesene ve ona dik bir bilesene ayir. Dik bilesen kisit yuzeyine tegettir. Teget yon boyunca minik bir adim ilk dereceye kadar yuzeyde kalir ve $f$'yi dogrusal olarak arttirir (ya da azaltir) — yani $x^*$ ekstremum degildir.</p>

<div class="calc-graph"><div id="plot-l7-geom-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> $f(x,y) = xy$'nin duzey egrileri (mavi konturlar) birim cember kisiti $g(x,y) = x^2+y^2-1 = 0$ (turuncu) ile kesisir. Kirmizi ile isaretli dort ekstremumda duzey egrisi ve cember tegettir — cebirsel kosul $\\nabla f = \\lambda \\nabla g$'ye esdeger. Cember uzerindeki diger herhangi bir noktada (gri ile gosterilen) konturlar enine kesilir, yani $f$'yi artirmak ya da azaltmak icin cember boyunca hareket edebiliriz.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=0;i<=80;i++){var rowx=[],rowy=[],rowz=[];for(var j=0;j<=80;j++){var x=-1.4+2.8*j/80,y=-1.4+2.8*i/80;rowx.push(x);rowy.push(y);rowz.push(x*y);}xs.push(rowx);ys.push(rowy);zs.push(rowz);}
var xline=[],yline=[];
for(var k=0;k<=200;k++){var t=2*Math.PI*k/200;xline.push(Math.cos(t));yline.push(Math.sin(t));}
var r=1/Math.sqrt(2);
var d1={type:'contour',x:xs[0],y:ys.map(function(r){return r[0];}),z:zs,colorscale:[[0,'rgba(59,130,246,0.05)'],[0.5,'rgba(59,130,246,0.35)'],[1,'rgba(59,130,246,0.85)']],contours:{coloring:'lines',start:-1,end:1,size:0.1},line:{width:1.2},name:'f = xy',showscale:false};
var d2={x:xline,y:yline,mode:'lines',name:'kisit x^2+y^2=1',line:{color:'#f59e0b',width:2.6}};
var d3={x:[r,r,-r,-r],y:[r,-r,r,-r],mode:'markers',name:'ekstremumlar',marker:{color:'#ef4444',size:11,symbol:'circle'}};
var d4={x:[1,0,-1,0],y:[0,1,0,-1],mode:'markers',name:'ekstremum disi',marker:{color:'#9ca3af',size:8,symbol:'x'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.4,1.4],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1.4,1.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-geom-tr',[d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Lagrangian ve Yontem</h2>

<div class="calc-highlight"><strong>Her iki kosulu da kisitsiz kritik noktalari kisitli ekstremumlar olan tek bir fonksiyona paketle.</strong> Carpan $\\lambda$'yi yeni bir degisken olarak tanitarak <em>Lagrangian</em>'i tanimla.</div>

<div class="calc-formula"><div class="formula-label">LAGRANGIAN (TEK KISIT)</div><div class="formula-main">$$\\mathcal{L}(x, \\lambda) \\;=\\; f(x) \\;-\\; \\lambda \\, g(x)$$</div><div class="formula-sub">$n+1$ degiskenli bir skaler fonksiyon: $n$ orijinal degisken ve carpan. Kisitsiz duragan noktalari tam olarak istedigimiz adaylardir.</div></div>

<p class="l-text">$\\mathcal{L}$'nin tum kismi turevlerini sifira esitlemek hem tegetlik kosulunu hem de kisiti kurtarir:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$\\nabla_x \\mathcal{L} = 0$</div><div class="step-detail">$\\nabla f(x) - \\lambda \\nabla g(x) = 0$, yani $\\nabla f = \\lambda \\nabla g$. Bu bolum 2'deki tegetlik / paralel-gradyan kosulu.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\partial \\mathcal{L} / \\partial \\lambda = 0$</div><div class="step-detail">$-g(x) = 0$, yani $g(x) = 0$. Kisit otomatik olarak uygulanir.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Denklem ve bilinmeyenleri say</div><div class="step-detail">$\\nabla_x \\mathcal{L} = 0$'dan $n$ denklem, $\\partial \\mathcal{L} / \\partial \\lambda = 0$'dan 1 denklem, toplam $n+1$ bilinmeyenli $(x_1, \\ldots, x_n, \\lambda)$ $n+1$ denklem. Genel olarak ayrik bir cozum kumesi.</div></div></div>
</div>

<p class="l-text"><strong>Yontemin varyasyonel kaniti.</strong> $x^*$'in $\\{g = 0\\}$ uzerinde $f$'yi minimize ettigini ve $x(0) = x^*$ olan herhangi bir duzgun egri $x(t)$'nin kisit uzerinde oldugunu varsay. Tum $t$ icin $g(x(t)) = 0$ oldugundan, turev alarak $\\nabla g(x^*) \\cdot x'(0) = 0$ buluruz, yani $x'(0)$ kisita tegettir. $f(x(t))$'nin $t = 0$'da minimumu oldugundan, $\\tfrac{d}{dt} f(x(t)) \\big|_{t=0} = \\nabla f(x^*) \\cdot x'(0) = 0$.</p>

<p class="l-text">Yani $\\nabla f(x^*)$ her teget vektore diktir — bu da $\\nabla f(x^*)$'nin tek boyutlu <em>normal</em> yonde, $\\nabla g(x^*)$'nin gerdigi yonde yattigi anlamina gelir. Bu nedenle bir skaler $\\lambda$ icin $\\nabla f(x^*) = \\lambda \\nabla g(x^*)$. $\\square$</p>

<div class="l-note"><strong>Isaret konvansiyonu.</strong> Bazi kitaplar $\\mathcal{L} = f + \\lambda g$, bazilari $\\mathcal{L} = f - \\lambda g$ yazar. $\\lambda$'nin isareti konvansiyonlar arasinda donor; geometri ve cozum aynidir. Eksi konvansiyonu kullaniyoruz, bu da esitsizlik-kisit versiyonunu (KKT, bolum 6) dual-yapilabilirlik kosulu $\\mu \\ge 0$ ile esler.</p>

<h2 class="lesson-title">4. Islenmis Ornek: Birim Cemberde $xy$ Maksimize Et</h2>

<p class="l-text"><strong>Problem:</strong> $g(x,y) = x^2 + y^2 - 1 = 0$ kisiti altinda $f(x,y) = xy$'yi maksimize et. Bolum 2'nin grafiginde gosterilen ornek.</p>

<p class="l-text">Lagrangian'i kur:</p>

<div class="calc-formula"><div class="formula-label">LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(x, y, \\lambda) \\;=\\; xy \\;-\\; \\lambda(x^2 + y^2 - 1)$$</div><div class="formula-sub">Duragan noktalar $\\partial \\mathcal{L} / \\partial x = \\partial \\mathcal{L} / \\partial y = \\partial \\mathcal{L} / \\partial \\lambda = 0$'i saglar.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Kismi turevleri hesapla</div><div class="step-detail">$\\partial_x \\mathcal{L} = y - 2\\lambda x = 0$, $\\partial_y \\mathcal{L} = x - 2\\lambda y = 0$, $\\partial_\\lambda \\mathcal{L} = -(x^2 + y^2 - 1) = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\lambda$'yi yok et</div><div class="step-detail">Ilk iki denklemden: $y = 2\\lambda x$ ve $x = 2\\lambda y$. Birinciyi ikinciye yerlestirerek: $x = 2\\lambda(2\\lambda x) = 4\\lambda^2 x$. Yani $x(1 - 4\\lambda^2) = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\lambda$ icin coz</div><div class="step-detail">Ya $x = 0$ (bu durumda $y = 2\\lambda \\cdot 0 = 0$, ama $x^2 + y^2 = 0 \\ne 1$, celiski) ya da $\\lambda = \\pm 1/2$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$(x,y)$'yi kurtar</div><div class="step-detail">$\\lambda = 1/2$ ile: $y = x$ ve $x^2 + x^2 = 1$ verir $x = \\pm 1/\\sqrt{2}$, $y = \\pm 1/\\sqrt{2}$ (ayni isaretler). $\\lambda = -1/2$ ile: $y = -x$, $(\\pm 1/\\sqrt{2}, \\mp 1/\\sqrt{2})$.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">$f$'yi degerlendir</div><div class="step-detail">$(1/\\sqrt{2}, 1/\\sqrt{2})$'de: $f = 1/2$. $(-1/\\sqrt{2}, -1/\\sqrt{2})$'de: $f = 1/2$. $(1/\\sqrt{2}, -1/\\sqrt{2})$'de: $f = -1/2$. $(-1/\\sqrt{2}, 1/\\sqrt{2})$'de: $f = -1/2$. Maksimum 1/2, minimum -1/2.</div></div></div>
</div>

<p class="l-text"><strong>Carpan uzerinde dogruluk kontrolu.</strong> Maksimumda $\\nabla f = (y, x) = (1/\\sqrt 2, 1/\\sqrt 2)$ ve $\\nabla g = (2x, 2y) = (\\sqrt 2, \\sqrt 2)$. Gercekten $\\nabla f = \\tfrac12 \\nabla g$, $\\lambda = 1/2$'yi kurtarir. Gradyanlar tipki geometrinin ongordugu gibi hizalanmistir.</p>

<h2 class="lesson-title">5. Islenmis Ornek: Sabit Hacim Icin Minimal Yuzeyli Kutu</h2>

<p class="l-text"><strong>Problem:</strong> kenar uzunluklari $x, y, z > 0$ olan kapali bir dikdortgen kutunun yuzey alanini, verilen bir hacim $V$ kisiti altinda minimize eden boyutlari bul.</p>

<p class="l-text">$f(x, y, z) = 2(xy + yz + zx)$, yuzey alani. $g(x, y, z) = xyz - V = 0$, hacim kisiti. Lagrangian:</p>

<div class="calc-formula"><div class="formula-label">LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(x, y, z, \\lambda) \\;=\\; 2(xy + yz + zx) \\;-\\; \\lambda (xyz - V)$$</div><div class="formula-sub">Dogal bir fiziksel problem: kargo sirketleri sabit gonderme hacmi icin karton kullanimini minimize etmek ister.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Kismi turevler</div><div class="step-detail">$\\partial_x \\mathcal{L} = 2(y + z) - \\lambda yz = 0$ ve simetriyle $\\partial_y \\mathcal{L} = 2(x + z) - \\lambda xz = 0$, $\\partial_z \\mathcal{L} = 2(x + y) - \\lambda xy = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Simetriyi kullan</div><div class="step-detail">Uc denklem $(x, y, z)$ permutasyonlari altinda degismez. Dogal cozum $x = y = z$ — bir kup.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Kupun kritik nokta oldugunu dogrula</div><div class="step-detail">$x = y = z = a$ koy. Ilk denklemden: $2(a + a) - \\lambda a^2 = 0 \\Rightarrow \\lambda = 4/a$. Simetriyle diger iki denklem ayni $\\lambda$'yi verir. Tutarli.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Kisiti kullan</div><div class="step-detail">$a^3 = V \\Rightarrow a = V^{1/3}$. Sabit hacim icin minimal-yuzey kutusu kenar uzunlugu $V^{1/3}$ olan bir kuptur.</div></div></div>
</div>

<p class="l-text"><strong>$\\lambda$'nin yorumu.</strong> Carpan $\\lambda = 4/a$, hacmin <em>marjinal maliyetidir</em>: hacmi minik bir $dV$ ile rahatlatirsan, yuzey alani $\\lambda \\, dV$ kadar artar. Ekonomide buna golge fiyati denir; fizikte bir Lagrange carpanidir; konveks optimizasyonda bir <em>dual degisken</em>dir. Uçu de ayni skalerdir.</p>

<h2 class="lesson-title">6. Coklu Kisitlar</h2>

<div class="calc-highlight"><strong>Birkac esitlik kisiti es zamanli uygulandiginda,</strong> $g_1(x) = \\cdots = g_m(x) = 0$, ekstremumda $\\nabla f$ kisit gradyanlarinin dogrusal acilimida yatar: $\\nabla f = \\sum_j \\lambda_j \\nabla g_j$.</div>

<div class="calc-formula"><div class="formula-label">COKLU-KISIT LAGRANGIANI</div><div class="formula-main">$$\\mathcal{L}(x, \\lambda_1, \\ldots, \\lambda_m) \\;=\\; f(x) \\;-\\; \\sum_{j=1}^{m} \\lambda_j \\, g_j(x)$$</div><div class="formula-sub">$\\nabla_x \\mathcal{L} = 0$ verir $\\nabla f = \\sum_j \\lambda_j \\nabla g_j$. $\\partial \\mathcal{L} / \\partial \\lambda_j = 0$ her $j$ icin $g_j(x) = 0$'i uygular. Toplam: $n + m$ bilinmeyenli $n + m$ denklem.</div></div>

<p class="l-text"><strong>Geometrik anlam.</strong> Yapilabilir kume $m$ duzey yuzeyinin kesisimidir $\\{g_j = 0\\}$, kisit gradyanlari dogrusal bagimsizsa genel olarak $n - m$ boyutlu bir manifold. Bu manifolda herhangi bir noktadaki <em>normal uzayi</em> $\\{\\nabla g_1, \\ldots, \\nabla g_m\\}$'nin $m$-boyutlu acilimidir. Ekstremum kosulu $\\nabla f$'nin bu normal uzayda yattigini soyler — esdeger olarak, $\\nabla f$'nin manifolda teget bileseni yoktur.</p>

<div class="calc-example"><div class="example-label">ISLENMIS ORNEK — $\\mathbb{R}^3$'TE IKI DOGRUSAL KISIT</div><div class="example-body">$g_1 = x + y + z - 1 = 0$ ve $g_2 = x + 2y + 3z - 4 = 0$ kisitlari altinda $f(x,y,z) = x^2 + y^2 + z^2$'yi minimize et. Geometrik: iki duzlemin kesisim cizgisi uzerindeki origine en yakin noktayi bul.<br><br>
$\\mathcal{L} = x^2 + y^2 + z^2 - \\lambda_1(x+y+z-1) - \\lambda_2(x+2y+3z-4)$.<br><br>
$\\partial_x: 2x = \\lambda_1 + \\lambda_2$<br>
$\\partial_y: 2y = \\lambda_1 + 2\\lambda_2$<br>
$\\partial_z: 2z = \\lambda_1 + 3\\lambda_2$<br><br>
$3\\lambda_1 + 6\\lambda_2 = 2$ ve $6\\lambda_1 + 14\\lambda_2 = 8$'den $\\lambda_2 = 2$, $\\lambda_1 = -10/3$ elde ederiz. Sonra $x = -2/3$, $y = 1/3$, $z = 4/3$. Dogrula: $-2/3 + 1/3 + 4/3 = 1$ ✓; $-2/3 + 2/3 + 4 = 4$ ✓. Mesafe$^2$ = $4/9 + 1/9 + 16/9 = 21/9 = 7/3$.<br><br>
Bu cizgi uzerindeki origine en yakin nokta $\\sqrt{7/3} \\approx 1.528$ mesafededir. Lagrange iki kisiti es zamanli ele aldi, hicbir ikame gerekmedi.</div></div>

<h2 class="lesson-title">7. Esitsizlik Kisitlari: KKT Kosullari</h2>

<div class="calc-highlight"><strong>Cogu gercek problem esitlik ve esitsizlik kisitlarini karistirir.</strong> Bir portfoy 1'e toplanmali (esitlik) <em>ve</em> her agirlik negatif olmamali (esitsizlik). Bir SVM'in marjlari en az 1 olmali (esitsizlikler). Lagrange yonteminin esitsizliklere genellestirmesi Karush (1939) ve Kuhn-Tucker (1951) adina <em>Karush-Kuhn-Tucker</em> (KKT) cercevesidir.</div>

<div class="calc-formula"><div class="formula-label">GENEL ESITSIZLIK PROBLEMI</div><div class="formula-main">$$\\min_x f(x) \\quad \\text{subject to} \\quad g_i(x) \\le 0 \\;\\;(i = 1, \\ldots, p), \\quad h_j(x) = 0 \\;\\;(j = 1, \\ldots, m)$$</div><div class="formula-sub">$p$ esitsizlik kisiti (saglandiginda negatif) ve $m$ esitlik kisiti. Konvansiyon: $g_i \\le 0$, $\\ge 0$ degil, dual degisken isaretini tutarli tutar.</div></div>

<p class="l-text">Iki tur carpanla Lagrangian'i kur:</p>

<div class="calc-formula"><div class="formula-label">KKT LAGRANGIANI</div><div class="formula-main">$$\\mathcal{L}(x, \\mu, \\lambda) \\;=\\; f(x) \\;+\\; \\sum_{i=1}^{p} \\mu_i \\, g_i(x) \\;+\\; \\sum_{j=1}^{m} \\lambda_j \\, h_j(x)$$</div><div class="formula-sub">$\\mu_i$ esitsizlikler icin dual degiskenler (isaret-kisitli), $\\lambda_j$ esitlikler icin (serbest isaret). KKT kosullari yerel optimum icin ilk-dereceden gerekli kosullardir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Primal yapilabilirlik</div><div class="card-body">Tum $i$ icin $g_i(x^*) \\le 0$, tum $j$ icin $h_j(x^*) = 0$. Nokta kisitlari saglar.</div><div class="card-formula">$g \\le 0$, $h = 0$</div></div>
<div class="calc-card"><div class="card-title">Dual yapilabilirlik</div><div class="card-body">$\\mu_i \\ge 0$. Esitsizlikler icin carpanlar negatif degildir.</div><div class="card-formula">$\\mu \\ge 0$</div></div>
<div class="calc-card"><div class="card-title">Duraganlik</div><div class="card-body">$\\nabla f(x^*) + \\sum_i \\mu_i \\nabla g_i(x^*) + \\sum_j \\lambda_j \\nabla h_j(x^*) = 0$. Gradyan dengesi.</div><div class="card-formula">$\\nabla_x \\mathcal{L} = 0$</div></div>
<div class="calc-card"><div class="card-title">Tamamlayici gevseklik</div><div class="card-body">Her $i$ icin $\\mu_i \\, g_i(x^*) = 0$. Ya kisit aktiftir ($g_i = 0$) ya da carpani sifirdir ($\\mu_i = 0$).</div><div class="card-formula">$\\mu_i g_i = 0$</div></div>
</div>

<p class="l-text"><strong>Neden $\\mu \\ge 0$?</strong> $x^*$'da $g_i(x) \\le 0$'in aktif oldugunu, yani $g_i(x^*) = 0$ oldugunu hayal et. $\\nabla g_i \\cdot d < 0$ olan bir $d$ yonunde hareket etmek $g_i$'yi azaltir ve dolayisiyla yapilabilir kalir. Optimumda $\\mu_i < 0$ ise, duraganlik kosulu $\\nabla f$'nin $\\nabla g_i$'ye <em>karsi</em> bir bileseni oldugunu soyler, yani iceriye dogru hareket (kisitin gevsedigi yer) $f$'yi azaltir — optimallikle celisir. Bu nedenle $\\mu_i \\ge 0$.</p>

<p class="l-text"><strong>Neden tamamlayici gevseklik?</strong> Bir kisit optimumda <em>inaktif</em> ise ($g_i(x^*) < 0$), yerel geometriyi etkilemez — gormezden gelebiliriz. Kisitin carpani bu nedenle sifir olmalidir. Tersine, $\\mu_i > 0$ ise, $\\mu_i \\nabla g_i$ gradyan terimi duraganlik denklemini ceker, dolayisiyla kisit siki olmalidir: $g_i(x^*) = 0$.</p>

<div class="calc-graph"><div id="plot-l7-kkt-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> $g(x,y) = x + y - 1 \\le 0$ kisiti altinda (turuncu cizgi; yapilabilir bolge sol alt) $f(x,y) = (x-2)^2 + (y-2)^2$'yi (eskez merkezi $(2,2)$ olan mavi cemberler) minimize et. Kisitsiz minimum $(2,2)$ yapilabilir degil. Kisitli minimum $x+y=1$ sinirinda, en yakin nokta $(0.5, 0.5)$'te oturur; orada $\\nabla f$, $\\nabla g$'ye paraleldir ve carpan $\\mu > 0$ — kisit aktiftir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],ys=[],zs=[];
for(var i=0;i<=80;i++){var rowx=[],rowy=[],rowz=[];for(var j=0;j<=80;j++){var x=-1+4*j/80,y=-1+4*i/80;rowx.push(x);rowy.push(y);rowz.push((x-2)*(x-2)+(y-2)*(y-2));}xs.push(rowx);ys.push(rowy);zs.push(rowz);}
var fxs=[],fys=[];for(var k=-20;k<=20;k++){var t=k/10;fxs.push(t);fys.push(1-t);}
var d1={type:'contour',x:xs[0],y:ys.map(function(r){return r[0];}),z:zs,colorscale:[[0,'rgba(59,130,246,0.05)'],[0.5,'rgba(59,130,246,0.45)'],[1,'rgba(59,130,246,0.85)']],contours:{coloring:'lines',start:0,end:9,size:0.5},line:{width:1.2},showscale:false,name:'f konturlari'};
var d2={x:fxs,y:fys,mode:'lines',name:'kisit x+y=1',line:{color:'#f59e0b',width:2.6}};
var d3={x:[0.5],y:[0.5],mode:'markers',name:'kisitli min',marker:{color:'#10b981',size:13,symbol:'star'}};
var d4={x:[2],y:[2],mode:'markers',name:'kisitsiz min (yapilamaz)',marker:{color:'#ef4444',size:11,symbol:'x'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,3],scaleanchor:'y'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-1,3]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-kkt-tr',[d1,d2,d3,d4],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Kisit nitelikleri.</strong> KKT kosullari bir <em>duzenlilik</em> varsayimi (bir <em>kisit niteligi</em>) ancak gecerliyse yerel optimumda <em>gereklidir</em> — en yaygin olarak aktif kisitlarin gradyanlarinin dogrusal bagimsiz olmasi (LICQ). Problem <em>konveks</em> ise (konveks $f$, konveks $g_i$, afin $h_j$), KKT kosullari ayni zamanda <em>yeterlidir</em>: herhangi bir KKT noktasi global bir minimumdur.</p>

<h2 class="lesson-title">8. Lagrange Dualitesi</h2>

<div class="calc-highlight"><strong>Lagrangian kurulumunun en derin sonucu dualitedir.</strong> <em>Dual fonksiyonu</em> $\\mathcal{D}(\\mu, \\lambda) = \\min_x \\mathcal{L}(x, \\mu, \\lambda)$ olarak tanimla. <em>Dual problem</em> $\\mu \\ge 0$ kisiti altinda $\\mathcal{D}(\\mu, \\lambda)$'yi maksimize etmektir. Konveks problemler icin dual maksimum primal minimuma esittir — <em>kuvvetli dualite</em>. Bu tek olgu SVM'lere, OT'ye, MaxEnt'e, RLHF'e ve ML'in binlerce kosesine guc verir.</div>

<div class="calc-formula"><div class="formula-label">PRIMAL VE DUAL</div><div class="formula-main">$$\\underbrace{\\min_x \\, \\max_{\\mu \\ge 0, \\lambda} \\mathcal{L}(x, \\mu, \\lambda)}_{\\text{primal}} \\;\\;\\geq\\;\\; \\underbrace{\\max_{\\mu \\ge 0, \\lambda} \\, \\min_x \\mathcal{L}(x, \\mu, \\lambda)}_{\\text{dual}}$$</div><div class="formula-sub">Zayif dualite esitsizligi her zaman geçerlidir. Kuvvetli dualite (esitlik) konveks problem + kisit niteligi (Slater kosulu) altinda geçerlidir.</div></div>

<p class="l-text"><strong>Zayif dualite neden geçerlidir?</strong> Primal icin yapilabilir herhangi bir $x$ ve dual icin yapilabilir herhangi bir $(\\mu, \\lambda)$ icin,</p>

<div class="calc-formula"><div class="formula-label">ESITSIZLIK ZINCIRI</div><div class="formula-main">$$\\mathcal{D}(\\mu, \\lambda) \\;=\\; \\min_{x'} \\mathcal{L}(x', \\mu, \\lambda) \\;\\le\\; \\mathcal{L}(x, \\mu, \\lambda) \\;=\\; f(x) + \\sum_i \\mu_i g_i(x) + \\sum_j \\lambda_j h_j(x) \\;\\le\\; f(x)$$</div><div class="formula-sub">Son esitsizlik $\\mu_i \\ge 0$ ve $g_i(x) \\le 0$ ve $h_j(x) = 0$ kullanir. Yani dual amaci primali asla asmaz — optimumu sandvic gibi sikistirirlar.</div></div>

<p class="l-text"><strong>Kuvvetli dualite ne zaman onemli.</strong> Primal yerine dual'i cozebiliyorsak esnekligimiz var: dual cogu zaman daha kolaydir (daha az degisken, daha basit kisitlar, primal olmasa bile konveks). Sonraki bolumdeki SVM duali bunu mukemmel sekilde gosterir: $n$ egitim noktasi $n$ dual degisken verir, ama dual sadece kernel matrisini veri olarak alan temiz bir kuadratik programdir — ozellik vektorleri gerekmez.</p>

<h2 class="lesson-title">9. Uygulama: SVM Dualini Sifirdan Turetmek</h2>

<div class="calc-highlight"><strong>Destek Vektor Makinesi kanonik Lagrange uygulamasidir.</strong> Birincil problem geometriktir ve sezgiseldir ama ozellik uzayinda yasar; dual problem geometriyi kernel hilesini kabul eden bir ic-carpim yapisi ile takas eder — sonsuz boyutlu ozellik uzaylarinda dogrusal olmayan ayirma kapisini acar. Iki taraftan goruldugunde ikisi de tam olarak ayni optimumdur.</div>

<p class="l-text"><strong>Kurulum.</strong> $y_i \\in \\{-1, +1\\}$ olan egitim verisi $\\{(x_i, y_i)\\}_{i=1}^n$ veriliyor; sert-marj SVM maksimum-marj ayirici hiperduzlemi $w^T x + b = 0$'i arar.</p>

<div class="calc-formula"><div class="formula-label">SVM PRIMALI</div><div class="formula-main">$$\\min_{w, b} \\;\\frac{1}{2} \\|w\\|^2 \\quad \\text{subject to} \\quad y_i(w^T x_i + b) \\ge 1, \\;\\; i = 1, \\ldots, n$$</div><div class="formula-sub">$\\tfrac12\\|w\\|^2$'yi minimize et (marj $1/\\|w\\|$'i maksimize etmeye esdeger) tum egitim noktalarinin marjin dogru tarafinda yer almasi kisitinda.</div></div>

<p class="l-text">Kisiti standart bicimde $g_i = 1 - y_i(w^T x_i + b) \\le 0$ yazarsak, Lagrangian olur:</p>

<div class="calc-formula"><div class="formula-label">SVM LAGRANGIANI</div><div class="formula-main">$$\\mathcal{L}(w, b, \\alpha) \\;=\\; \\frac{1}{2}\\|w\\|^2 \\;+\\; \\sum_{i=1}^{n} \\alpha_i \\big(1 - y_i(w^T x_i + b)\\big), \\quad \\alpha_i \\ge 0$$</div><div class="formula-sub">$\\alpha_i$, $i$. marj kisiti icin dual degisken (KKT carpani). $\\alpha_i \\ge 0$ dual yapilabilirligi kisitin esitsizlik dogasindan gelir.</div></div>

<p class="l-text"><strong>Adim 1: $w$ ve $b$'de duraganlik.</strong> Kismi turevleri al:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$\\nabla_w \\mathcal{L} = 0$</div><div class="step-detail">$w - \\sum_i \\alpha_i y_i x_i = 0 \\;\\Rightarrow\\; w = \\sum_i \\alpha_i y_i x_i$. Optimal agirlik vektoru, egitim noktalarinin $\\alpha_i y_i$ ile agirlikli dogrusal kombinasyonudur.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\partial \\mathcal{L} / \\partial b = 0$</div><div class="step-detail">$-\\sum_i \\alpha_i y_i = 0$. Dual degiskenlerin isaretli toplami yok olur.</div></div></div>
</div>

<p class="l-text"><strong>Adim 2: $\\mathcal{L}$'ye geri yerlestir.</strong> $w$'yi $\\sum_i \\alpha_i y_i x_i$ ile degistirerek:</p>

<div class="calc-formula"><div class="formula-label">YERINE KOYMA</div><div class="formula-main">$$\\mathcal{L} \\;=\\; \\frac{1}{2}\\Big\\|\\sum_i \\alpha_i y_i x_i\\Big\\|^2 \\;+\\; \\sum_i \\alpha_i \\;-\\; \\sum_i \\alpha_i y_i\\Big(\\sum_j \\alpha_j y_j x_j\\Big)^T x_i \\;-\\; b \\sum_i \\alpha_i y_i$$</div><div class="formula-sub">Normu açmak $\\tfrac12 \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$ verir. Capraz terim $-\\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$ verir. $b$-terimi adim 2 ile yok olur.</div></div>

<p class="l-text">Birlestirerek:</p>

<div class="calc-formula"><div class="formula-label">SVM DUALI</div><div class="formula-main">$$\\boxed{\\;\\max_\\alpha \\;\\sum_{i=1}^{n} \\alpha_i \\;-\\; \\frac{1}{2} \\sum_{i, j = 1}^{n} \\alpha_i \\alpha_j y_i y_j \\, (x_i^T x_j) \\quad \\text{s.t.} \\quad \\alpha_i \\ge 0, \\;\\; \\sum_i \\alpha_i y_i = 0 \\;}$$</div><div class="formula-sub">$n$ degiskenli bir kuadratik program. Egitim verisi <em>sadece</em> $x_i^T x_j$ ic carpimlari uzerinden gorunur. Bu, tum SVM dualidir.</div></div>

<p class="l-text"><strong>Adim 3: destek vektorlerini tanimla.</strong> Tamamlayici gevseklikle her $i$ icin $\\alpha_i \\big(1 - y_i(w^T x_i + b)\\big) = 0$. Yani ya $\\alpha_i = 0$ (nokta dogru yari-uzayin tam icinde, kisit baskisi yok) ya da $y_i(w^T x_i + b) = 1$ (nokta tam marjin uzerinde). Ikincisi <em>destek vektorleridir</em> — ve sadece bunlar $w = \\sum_i \\alpha_i y_i x_i$'ye katkida bulunur. Geri kalan dolgu maddesidir.</p>

<div class="calc-graph"><div id="plot-l7-svm-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> sentetik dogrusal-ayrilabilir 2-sinif veri kumesi. Optimal SVM hiperduzlemi (mavi duz) iki sinif arasinda tam ortada yatar; paralel marj cizgileri (kesikli) destek vektorlerine (kirmizi cember) dokunur. Diger tum noktalarin tamamlayici gevseklikle $\\alpha_i = 0$ degeri vardir — onlari cikarmak cozumu degistirmezdi. Marjin genisligi $2/\\|w\\|$, dual optimum ile maksimize edilir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var seed=1;function rng(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;}
function randn(){var u=Math.max(rng(),1e-9),v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
var p1x=[],p1y=[],p2x=[],p2y=[];
for(var i=0;i<20;i++){p1x.push(2+0.5*randn());p1y.push(2+0.5*randn());p2x.push(-1+0.5*randn());p2y.push(-1+0.5*randn());}
var w=[1,1],b=-1;
var hx=[],hy=[],m1y=[],m2y=[];
for(var k=-30;k<=30;k++){var t=k/10;hx.push(t);hy.push(-(w[0]*t+b)/w[1]);m1y.push(-(w[0]*t+b-1)/w[1]);m2y.push(-(w[0]*t+b+1)/w[1]);}
var svx=[p1x[0],p2x[0]],svy=[p1y[0],p2y[0]];
var d1={x:p1x,y:p1y,mode:'markers',name:'sinif +1',marker:{color:'#3b82f6',size:9,line:{color:'#0a0a0a',width:1}}};
var d2={x:p2x,y:p2y,mode:'markers',name:'sinif -1',marker:{color:'#f59e0b',size:9,line:{color:'#0a0a0a',width:1}}};
var d3={x:hx,y:hy,mode:'lines',name:'hiperduzlem',line:{color:'#10b981',width:2.6}};
var d4={x:hx,y:m1y,mode:'lines',name:'marj +1',line:{color:'#9ca3af',width:1.5,dash:'dash'}};
var d5={x:hx,y:m2y,mode:'lines',name:'marj -1',line:{color:'#9ca3af',width:1.5,dash:'dash'},showlegend:false};
var d6={x:svx,y:svy,mode:'markers',name:'destek vektorleri',marker:{color:'rgba(239,68,68,0)',size:18,line:{color:'#ef4444',width:2.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x_1',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,4],scaleanchor:'y'},yaxis:{title:'x_2',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-svm-tr',[d1,d2,d3,d4,d5,d6],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Kernel Hilesi</h2>

<div class="calc-highlight"><strong>SVM duali sadece $x_i^T x_j$ ic carpimlarini kullanir — ozellik vektorlerinin kendisini asla.</strong> $x \\mapsto \\phi(x)$'i bir dogrusal olmayan ozellik haritasi ile degistirir ve $\\phi$'yi asla acikca hesaplamazsak, ayni hesaplama maliyetiyle dogrusal olmayan ayirma elde ederiz. $K(x_i, x_j) = \\phi(x_i)^T \\phi(x_j)$ fonksiyonuna <em>kernel</em> denir, ve bu ikame <em>kernel hilesi</em>dir — ML'in tumunde Lagrange dualitesinin tartismasiz en etkili sonucu.</div>

<div class="calc-formula"><div class="formula-label">KERNELLI SVM DUALI</div><div class="formula-main">$$\\max_\\alpha \\;\\sum_i \\alpha_i \\;-\\; \\frac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j \\, K(x_i, x_j) \\quad \\text{s.t.} \\quad \\alpha_i \\ge 0, \\;\\; \\sum_i \\alpha_i y_i = 0$$</div><div class="formula-sub">Dogrusal dual ile aynidir, $x_i^T x_j$ yerine $K(x_i, x_j)$ vardir. Karar fonksiyonu $f(x) = \\sum_i \\alpha_i y_i K(x_i, x) + b$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dogrusal</div><div class="card-body">$K(x, y) = x^T y$. Standart dogrusal SVM'i kurtarir.</div><div class="card-formula">$\\phi(x) = x$</div></div>
<div class="calc-card"><div class="card-title">Polinom</div><div class="card-body">$K(x, y) = (x^T y + 1)^d$. Ozellik haritasi: $d$ dereceden veya daha az monomlar. $d=2$ icin etkilesim terimleri dahil.</div><div class="card-formula">$\\phi$: $d$. derece monomlar</div></div>
<div class="calc-card"><div class="card-title">RBF / Gauss</div><div class="card-body">$K(x, y) = \\exp(-\\gamma \\|x - y\\|^2)$. Ozellik haritasi: sonsuz-boyutlu. Evrensel yaklasik — herhangi bir surekli karar siniri.</div><div class="card-formula">$\\phi$: sonsuz boyutlu</div></div>
</div>

<p class="l-text"><strong>$\\phi$ hesaplamadan bu neden calisir?</strong> Mercer teoremi soyle der: simetrik, pozitif-yari-belirli herhangi bir fonksiyon $K$ bir ozellik uzayinda <em>bir</em> ic carpimdir. Bu uzayi acikca insa etmek zorunda degiliz — tamamen kernel matrisi $K_{ij} = K(x_i, x_j)$ ile calisiriz, $n \\times n$ Gram matrisi, dualin ihtiyac duydugu her sey.</p>

<div class="l-note"><strong>Yumusak marj.</strong> Gercek veri nadiren ayrilabilirdir, bu yuzden pratik SVM gevseklik degiskenleri $\\xi_i \\ge 0$ ile marj kisitini gevsetir: $y_i(w^T x_i + b) \\ge 1 - \\xi_i$, ve $C \\sum_i \\xi_i$ amaca eklenir. Dual aynidir ancak $\\alpha_i \\le C$ eklenir — tek tarafli yerine kutu kisiti. Kernel hilesi hala uygulanir ve $C$ ayarlanan ters-duzenlileme hiperparametresi olur.</p>

<h2 class="lesson-title">11. Uygulama: Maksimum Entropi = Gauss</h2>

<div class="calc-highlight"><strong>$\\mathbb{R}$ uzerinde verilen bir ortalama ve varyansa sahip tum olasilik dagilimlari arasinda, en yuksek diferansiyel entropiye sahip olan Gauss'tur.</strong> Bu tek olgu normal dagilimin merkezi rolunu hakli cikarir: moment kisitlariyla tutarli en az bilgilendirici dagilimdir. Ispat guzel uc satirlik bir Lagrange hesabidir.</div>

<div class="calc-formula"><div class="formula-label">MAX-ENTROPI PROBLEMI</div><div class="formula-main">$$\\max_p \\;\\Big[\\,-\\!\\int p(x) \\log p(x) \\, dx\\,\\Big] \\quad \\text{s.t.} \\quad \\int p \\, dx = 1, \\;\\int x \\, p \\, dx = \\mu, \\;\\int x^2 \\, p \\, dx = \\mu^2 + \\sigma^2$$</div><div class="formula-sub">Uc integral kisit: normallestirme, ortalama $\\mu$, ikinci moment $\\mu^2 + \\sigma^2$ (esdeger olarak varyans $\\sigma^2$). Optimizasyon degiskeni yogunluk $p$'nin kendisidir.</div></div>

<p class="l-text">Uc carpanli $\\lambda_0, \\lambda_1, \\lambda_2$ Lagrangian'i kur:</p>

<div class="calc-formula"><div class="formula-label">LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}[p] \\;=\\; -\\!\\int p \\log p \\, dx \\;-\\; \\lambda_0 \\Big(\\!\\int p \\, dx - 1\\Big) \\;-\\; \\lambda_1 \\Big(\\!\\int x p \\, dx - \\mu\\Big) \\;-\\; \\lambda_2 \\Big(\\!\\int x^2 p \\, dx - (\\mu^2 + \\sigma^2)\\Big)$$</div><div class="formula-sub">$p$'nin bir fonksiyoneli. Fonksiyonel turev $\\delta \\mathcal{L} / \\delta p(x)$'i al ve sifira esitle — $\\nabla_x \\mathcal{L} = 0$'in sonsuz-boyutlu analogu.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Fonksiyonel turev</div><div class="step-detail">$\\delta \\mathcal{L} / \\delta p(x) = -\\log p(x) - 1 - \\lambda_0 - \\lambda_1 x - \\lambda_2 x^2 = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$p$ icin coz</div><div class="step-detail">$\\log p(x) = -1 - \\lambda_0 - \\lambda_1 x - \\lambda_2 x^2 \\;\\Rightarrow\\; p(x) = \\exp(-1 - \\lambda_0) \\cdot \\exp(-\\lambda_1 x - \\lambda_2 x^2)$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Gauss seklini tani</div><div class="step-detail">$p(x) \\propto \\exp(-\\lambda_2 x^2 - \\lambda_1 x)$. Ustelin karesini tamamla: $-\\lambda_2(x + \\lambda_1/(2\\lambda_2))^2 + \\text{const}$. Yani $p$, ortalama $-\\lambda_1/(2\\lambda_2)$ ve varyans $1/(2\\lambda_2)$ olan bir Gauss'tur.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Kisitlari eslestir</div><div class="step-detail">Ortalama $= \\mu$ ve varyans $= \\sigma^2$ koymak $\\lambda_2 = 1/(2\\sigma^2)$, $\\lambda_1 = -\\mu/\\sigma^2$ verir. Normallestirme $\\lambda_0$, $\\int p = 1$ ile belirlenir, standart on faktor $1/\\sqrt{2\\pi\\sigma^2}$'yi verir.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Sonuc</div><div class="step-detail">$p(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\!\\big( -\\tfrac{(x-\\mu)^2}{2\\sigma^2} \\big)$. Ongorulen ortalama ve varyansla maksimum-entropi dagilimi tam olarak $\\mathcal{N}(\\mu, \\sigma^2)$. $\\square$</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l7-maxent-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gosteriyor:</strong> her biri farkli bir kisit kumesi icin uc maksimum-entropi dagilimi. (Mavi) $[0, 4]$'te Uniform — yalnizca destek kisitlandiginda max entropi. (Turuncu) hiz $1/2$ olan Ustel — ortalama kisitlandiginda max entropi, destek $[0, \\infty)$. (Yesil) Gauss $\\mathcal{N}(2, 1)$ — $\\mathbb{R}$'de hem ortalama hem varyans kisitlandiginda max entropi. Her biri kisitlariyla tutarli en az bilgilendirici dagilimdir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[],pu=[],pe=[],pg=[];
for(var i=0;i<=400;i++){var x=-3+10*i/400;xs.push(x);pu.push((x>=0&&x<=4)?0.25:0);pe.push(x>=0?0.5*Math.exp(-0.5*x):0);pg.push(Math.exp(-0.5*(x-2)*(x-2))/Math.sqrt(2*Math.PI));}
var d1={x:xs,y:pu,mode:'lines',name:'Uniform[0,4]',line:{color:'#3b82f6',width:2.4}};
var d2={x:xs,y:pe,mode:'lines',name:'Exp(hiz=0.5)',line:{color:'#f59e0b',width:2.4}};
var d3={x:xs,y:pg,mode:'lines',name:'Gauss N(2,1)',line:{color:'#10b981',width:2.4}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)',range:[-3,7]},yaxis:{title:'yogunluk p(x)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.18)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l7-maxent-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kisit yok</div><div class="card-body">Sinirli bir aralikta $[a,b]$: max-entropi dagilimi uniformdur. Esdeger olarak, yetersiz neden ilkesi.</div><div class="card-formula">$p(x) = 1/(b-a)$</div></div>
<div class="calc-card"><div class="card-title">Sadece ortalama</div><div class="card-body">$[0, \\infty)$'da ortalama $\\mu$ ile: max-entropi ustel $\\mathrm{Exp}(1/\\mu)$. Dogum-olum sureçleri, kuyruklama.</div><div class="card-formula">$p(x) = \\tfrac{1}{\\mu} e^{-x/\\mu}$</div></div>
<div class="calc-card"><div class="card-title">Ortalama + varyans</div><div class="card-body">$\\mathbb{R}$'de: max-entropi Gauss $\\mathcal{N}(\\mu, \\sigma^2)$. Normal gurultunun varsayilan oldugu nedeni.</div><div class="card-formula">$p \\propto e^{-(x-\\mu)^2 / 2\\sigma^2}$</div></div>
<div class="calc-card"><div class="card-title">Ayrik enerji</div><div class="card-body">$E[E(X)] = U$ sabit: max-entropi Boltzmann $p(x) \\propto e^{-\\beta E(x)}$. Istatistiksel mekanige kopru.</div><div class="card-formula">$p(x) \\propto e^{-\\beta E(x)}$</div></div>
</div>

<div class="l-note"><strong>ML'de neden onemli.</strong> Bir parametre uzerine Gauss onceli koydugunda, onun ortalama ve varyansi ile tutarli en zayif varsayimi yapiyorsun. Merkezi limit teoremi yaklasik olarak Gauss kalintilari urettiginde, max-entropi felsefi nedendir. Varyasyonel otomatik kodlayicilar, ortalama-alan VI ve Gauss surecleri max-entropi mantigina yaslanir: ek bilgi yoklugunda, Gauss en durust seçimdir.</p>

<h2 class="lesson-title">12. Pratik Pyodide Egzersizi</h2>

<p class="l-text">Simdi Lagrange'i Python'da ise koyuyoruz. Egzersizin uc parcasi var: (1) <code>constraints</code> argumani ile <code>scipy.optimize.minimize</code> kullanarak kucuk bir kisitli problemi coz; (2) bir QP cozerek minik bir SVM duali uygula ve dual degiskenlerden destek vektorlerini oku; (3) ongorulen momentleri olan max-entropi dagiliminin Gauss'a yakinsadigini, ayrik bir yogunluk uzerinde optimize ederek sayisal olarak dogrula.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize

<span class="cm"># ===== BOLUM 1: scipy kisitli optimizasyon =====</span>
<span class="cm"># minimize f(x,y) = x^2 + y^2 s.t. x + y - 1 = 0</span>
<span class="kw">def</span> <span class="fn">f</span>(z):
    <span class="kw">return</span> z[<span class="num">0</span>]**<span class="num">2</span> + z[<span class="num">1</span>]**<span class="num">2</span>

<span class="kw">def</span> <span class="fn">grad_f</span>(z):
    <span class="kw">return</span> np.<span class="fn">array</span>([<span class="num">2</span>*z[<span class="num">0</span>], <span class="num">2</span>*z[<span class="num">1</span>]])

constraint = {<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> z: z[<span class="num">0</span>] + z[<span class="num">1</span>] - <span class="num">1</span>}
res = <span class="fn">minimize</span>(f, x0=[<span class="num">2.0</span>, <span class="num">2.0</span>], jac=grad_f, constraints=[constraint], method=<span class="str">'SLSQP'</span>)
<span class="fn">print</span>(<span class="str">f"Kisitli min: x = {res.x},  f* = {res.fun:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"Beklenen: (0.5, 0.5), f* = 0.5"</span>)

<span class="cm"># ===== BOLUM 2: kuadratik programlama ile SVM duali =====</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
n_per_class = <span class="num">10</span>
X1 = np.random.<span class="fn">randn</span>(n_per_class, <span class="num">2</span>) + np.<span class="fn">array</span>([<span class="num">2</span>, <span class="num">2</span>])
X2 = np.random.<span class="fn">randn</span>(n_per_class, <span class="num">2</span>) + np.<span class="fn">array</span>([-<span class="num">2</span>, -<span class="num">2</span>])
X = np.<span class="fn">vstack</span>([X1, X2])
y = np.<span class="fn">concatenate</span>([np.<span class="fn">ones</span>(n_per_class), -np.<span class="fn">ones</span>(n_per_class)])
n = <span class="fn">len</span>(y)

K = (y[:, <span class="kw">None</span>] * y[<span class="kw">None</span>, :]) * (X @ X.T)

<span class="kw">def</span> <span class="fn">neg_dual</span>(alpha):
    <span class="kw">return</span> <span class="num">0.5</span> * alpha @ K @ alpha - alpha.<span class="fn">sum</span>()

<span class="kw">def</span> <span class="fn">grad_neg_dual</span>(alpha):
    <span class="kw">return</span> K @ alpha - np.<span class="fn">ones</span>(n)

cons = [{<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> a: np.<span class="fn">dot</span>(a, y)}]
bounds = [(<span class="num">0</span>, <span class="kw">None</span>)] * n
alpha0 = np.<span class="fn">zeros</span>(n)
res_svm = <span class="fn">minimize</span>(neg_dual, alpha0, jac=grad_neg_dual,
                   bounds=bounds, constraints=cons, method=<span class="str">'SLSQP'</span>)
alpha = res_svm.x

w = ((alpha * y)[:, <span class="kw">None</span>] * X).<span class="fn">sum</span>(axis=<span class="num">0</span>)
support = alpha &gt; <span class="num">1e-5</span>
b = (y[support] - X[support] @ w).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">f"\\nSVM dual cozumu:"</span>)
<span class="fn">print</span>(<span class="str">f"  destek vektor sayisi: {support.<span class="fn">sum</span>()} / {n}"</span>)
<span class="fn">print</span>(<span class="str">f"  w = {w}"</span>)
<span class="fn">print</span>(<span class="str">f"  b = {b:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"  marj genisligi = {2 / np.<span class="fn">linalg</span>.<span class="fn">norm</span>(w):.4f}"</span>)

margin = y * (X @ w + b)
<span class="fn">print</span>(<span class="str">f"  destek vektorlerinde min marj: {margin[support].<span class="fn">min</span>():.4f}  (1.0 bekleniyor)"</span>)
<span class="fn">print</span>(<span class="str">f"  destek olmayan max alpha: {alpha[~support].<span class="fn">max</span>():.2e}"</span>)

<span class="cm"># ===== BOLUM 3: izgara uzerinde max-entropi yogunlugu =====</span>
x_grid = np.<span class="fn">linspace</span>(-<span class="num">5</span>, <span class="num">5</span>, <span class="num">200</span>)
dx = x_grid[<span class="num">1</span>] - x_grid[<span class="num">0</span>]
mu, sigma = <span class="num">1.0</span>, <span class="num">1.5</span>

<span class="kw">def</span> <span class="fn">neg_entropy</span>(p):
    p_safe = np.<span class="fn">clip</span>(p, <span class="num">1e-12</span>, <span class="kw">None</span>)
    <span class="kw">return</span> np.<span class="fn">sum</span>(p_safe * np.<span class="fn">log</span>(p_safe)) * dx

cons_me = [
    {<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> p: np.<span class="fn">sum</span>(p) * dx - <span class="num">1</span>},
    {<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> p: np.<span class="fn">sum</span>(x_grid * p) * dx - mu},
    {<span class="str">'type'</span>: <span class="str">'eq'</span>, <span class="str">'fun'</span>: <span class="kw">lambda</span> p: np.<span class="fn">sum</span>(x_grid**<span class="num">2</span> * p) * dx - (mu**<span class="num">2</span> + sigma**<span class="num">2</span>)},
]
bounds_me = [(<span class="num">1e-9</span>, <span class="num">1.0</span>)] * <span class="fn">len</span>(x_grid)
p0 = np.<span class="fn">ones_like</span>(x_grid) / (<span class="fn">len</span>(x_grid) * dx)
res_me = <span class="fn">minimize</span>(neg_entropy, p0, bounds=bounds_me, constraints=cons_me,
                  method=<span class="str">'SLSQP'</span>, options={<span class="str">'maxiter'</span>: <span class="num">200</span>})

p_gauss = np.<span class="fn">exp</span>(-<span class="num">0.5</span> * ((x_grid - mu) / sigma)**<span class="num">2</span>) / (sigma * np.<span class="fn">sqrt</span>(<span class="num">2</span> * np.pi))
err = np.<span class="fn">max</span>(np.<span class="fn">abs</span>(res_me.x - p_gauss))
<span class="fn">print</span>(<span class="str">f"\\nMax-entropi yogunluk uydurma: max |p_sayisal - p_gauss| = {err:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"(Kucuk olmali — max-entropi = Gauss'u sayisal olarak dogrular.)"</span>)
</code></pre></div>

<p class="l-text"><strong>Oynamak icin.</strong> Bolum 1'de baslangic tahminini degistir — SLSQP her yerden yakinsar. Bolum 2'de veriyi ust uste binen kumelerle yeniden uret (ortalamalari yakinlastir) ve problem neredeyse-ayrilamaz hale gelirken destek vektor sayisinin nasil patladigini izle. Bolum 3'te $\\mu, \\sigma$'yi degistir ve sayisal yogunlugun analitik Gauss'u nasil izledigini gor; varyans kisitini kaldir ve sonucun destege bagli olarak yari-Gauss'a veya uygun olmayan bir limite nasil cokugunu izle.</p>

<h2 class="lesson-title">13. Ozet &amp; Lagrange'in Modern AI'da Yasadigi Yerler</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Esitlik Lagrange</div><div class="card-body">$\\nabla f = \\lambda \\nabla g$. Geometrik: gradyanlar ekstremumda hizalanir. Cebirsel: $\\mathcal{L} = f - \\lambda g$'nin kisitsiz kritik noktalari.</div><div class="card-formula">$\\nabla \\mathcal{L} = 0$</div></div>
<div class="calc-card"><div class="card-title">KKT esitsizlik</div><div class="card-body">Primal yapilabilirlik + dual yapilabilirlik + duraganlik + tamamlayici gevseklik. Dort kosul, herhangi bir yerel optimumda gerekli (CQ altinda), konvekslik altinda yeterli.</div><div class="card-formula">$\\mu g = 0,\\;\\mu \\ge 0$</div></div>
<div class="calc-card"><div class="card-title">Dualite</div><div class="card-body">$\\min \\max \\mathcal{L} \\ge \\max \\min \\mathcal{L}$ daima. Kuvvetli dualite (esitlik) konveks + Slater altinda. Dual cogu zaman primalden daha basit.</div><div class="card-formula">$\\min_{\\text{primal}} = \\max_{\\text{dual}}$</div></div>
<div class="calc-card"><div class="card-title">SVM duali</div><div class="card-body">$\\max \\sum \\alpha_i - \\tfrac12 \\sum \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$. Destek vektorleri aktif KKT kisitlaridir. Kernel hilesi ic carpimi degistirir.</div><div class="card-formula">$\\alpha_i \\ge 0$, $\\sum\\alpha_i y_i = 0$</div></div>
<div class="calc-card"><div class="card-title">Max-entropi</div><div class="card-body">Verilen momentlere sahip yogunluklar arasinda, Gauss diferansiyel entropiyi maksimize eder. Normal oncelileri ve $\\mathcal{N}(\\mu, \\sigma^2)$'nin merkezi rolunu hakli cikarir.</div><div class="card-formula">$p^* = \\mathcal{N}(\\mu, \\sigma^2)$</div></div>
<div class="calc-card"><div class="card-title">RLHF</div><div class="card-body">Direct Preference Optimization (DPO) KL-kisitli bir RL amacindan turer: $\\max_\\pi \\mathbb{E}[r(x,y)] - \\beta \\, \\mathrm{KL}(\\pi \\| \\pi_{\\text{ref}})$. Kapali bicim cozumu Lagrange KKT'den $\\beta$ carpan olarak gelir.</div><div class="card-formula">$\\pi^*(y|x) \\propto \\pi_{\\text{ref}}(y|x) e^{r/\\beta}$</div></div>
<div class="calc-card"><div class="card-title">Optimal tasimacilik</div><div class="card-body">Earth-mover mesafesi marjinal kisitli bir LP'nin degeridir. Dual degiskenler Kantorovich potansiyelleridir — Sinkhorn diverjanslarinda ve Wasserstein GAN'larda merkezi.</div><div class="card-formula">$W(p,q) = \\min \\int c \\, d\\gamma$</div></div>
<div class="calc-card"><div class="card-title">Kisitli RL</div><div class="card-body">CMDP'ler standart MDP'ye beklenen-maliyet kisitlari ekler. Lagrange gevsemesi kisitli problemi politika ve dual degisken arasinda bir eyer-noktasi oyununa cevirir — guvenli-kesif ve kisit-bilincli ince ayarda kullanilir.</div><div class="card-formula">$\\max_\\pi \\min_\\lambda \\mathcal{L}$</div></div>
<div class="calc-card"><div class="card-title">VAE ve ELBO</div><div class="card-body">Kanit alt siniri $\\log p(x) \\ge \\mathcal{L}(x; \\phi, \\theta)$, marjinal olabilirligin bir Lagrange gevsemesidir. KL terimi carpan-agirlikli oncel cezasidir.</div><div class="card-formula">ELBO = recon $-$ KL</div></div>
</div>

<div class="l-warn"><strong>Sonraki (Ders 8 — Ileri Vektor Analizi):</strong> Stokes teoremi, diverjans teoremi ve vektor hesabi ozdesliklerinin (kivirma, diverjans, gradyan akislari) fizik-bilgili sinir aglarinda, skor-tabanli difuzyon modellerinde ve akis eslemesinde nasil yeniden gorundugu. Lagrange carpanlari alan teorisinde Lagrange yogunlugu olarak ve surekli-zaman optimizasyonunun arkasindaki eylem ilkesinde geri donecek. Iki iplik — vektor hesabi ve kisitli optimizasyon — varyasyonel ilkelerde bulusur, ki bu da en derin modern AI yontemlerinin (difuzyon modelleri, optimal tasimacilik, Wasserstein uzayinda gradyan akislari) yasadigi yerdir.</p>`
};
