window.MATH_L7 = {
en: `<p class="l-text"><strong>Convex optimization is the one corner of nonlinear optimization where we can prove things.</strong> If your loss function is convex, gradient descent finds the global minimum — not a global minimum, the global minimum — at a known rate. There are no spurious local minima to escape, no saddle points to worry about, no luck involved in the initialization. The price you pay is that "convex" is a strong assumption: it holds for linear regression, ridge, lasso, logistic regression, support vector machines, maximum-entropy models, and a wide swath of signal processing — but breaks for neural networks, Gaussian mixtures, and most modern deep learning. Knowing where the convex world ends is the single most useful piece of optimization theory a practitioner can carry around.</p>

<p class="l-text">In this lesson we build the language: convex sets, convex functions, Jensen's inequality, the KKT conditions, and the convergence guarantees of gradient descent on convex versus strongly convex objectives. We then run projected gradient descent on a constrained problem (the positive orthant, used everywhere in non-negative matrix factorization), solve a small KKT problem with <code>scipy.optimize.minimize</code>, and look at the gap between what theory promises and what optimizers actually deliver. The reference is Boyd &amp; Vandenberghe's <em>Convex Optimization</em> (2004) — still the cleanest book on the subject after twenty years.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognize a convex set and a convex function from their definitions</li>
<li>Prove and apply Jensen's inequality — the single inequality behind variational bounds, ELBO, and Jensen-Shannon divergence</li>
<li>Write KKT conditions for a constrained optimization problem and verify them with scipy</li>
<li>Quote the convergence rate of gradient descent on convex (<code>O(1/k)</code>) vs strongly convex (linear) objectives</li>
<li>Implement projected gradient descent and watch it converge on a constrained problem</li>
<li>Tell when a real loss is convex (linear / logistic regression, SVMs) vs not (deep nets, mixtures, k-means)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Convex Sets</h2>
<p class="l-text">A set $C \\subseteq \\mathbb{R}^n$ is <strong>convex</strong> if for any two points $x, y \\in C$ and any $\\lambda \\in [0,1]$, the line segment between them stays inside:</p>

<div class="katex-block">$$\\lambda x + (1-\\lambda) y \\in C \\quad \\forall x,y \\in C,\\ \\lambda \\in [0,1].$$</div>

<p class="l-text">Geometrically: no dents. A solid disk is convex; a crescent moon is not. The intersection of any number of convex sets is convex (the proof is one line). Most constraint sets you meet in practice are convex by construction: half-spaces $\\{x : a^\\top x \\leq b\\}$, the positive orthant $\\mathbb{R}^n_+$, the probability simplex $\\{p : p_i \\geq 0, \\sum p_i = 1\\}$, the unit ball, the cone of positive semidefinite matrices.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Half-space</div><div class="card-body">$\\{x : a^\\top x \\leq b\\}$. Linear inequality constraints. Used everywhere in linear programming and SVMs.</div></div>
<div class="calc-card"><div class="card-title">Positive orthant</div><div class="card-body">$\\mathbb{R}^n_+ = \\{x : x_i \\geq 0\\}$. Non-negativity constraints in NMF, Poisson regression, count models.</div></div>
<div class="calc-card"><div class="card-title">Probability simplex</div><div class="card-body">$\\{p : p_i \\geq 0,\\ \\sum_i p_i = 1\\}$. The natural constraint set for any discrete distribution.</div></div>
<div class="calc-card"><div class="card-title">PSD cone</div><div class="card-body">$\\{X \\succeq 0\\}$. Covariance matrices live here. Used in semidefinite programming.</div></div>
</div>

<div class="calc-highlight"><strong>One-line operations that preserve convexity:</strong> intersection, affine image $Ax+b$, perspective transform, partial minimization. If you build your constraint set from convex pieces with these operations, the result is automatically convex.</div>

<div id="plot-ml7-convexset-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var thA=[],xA=[],yA=[];
  for(var i=0;i<=100;i++){var a=i*Math.PI*2/100; thA.push(a); xA.push(-1.6+1.0*Math.cos(a)); yA.push(1.0*Math.sin(a));}
  var xB=[],yB=[];
  for(var j=0;j<=200;j++){var b=j*Math.PI*2/200; var r=1.0+0.45*Math.cos(3*b); xB.push(1.6+r*Math.cos(b)); yB.push(r*Math.sin(b));}
  var convex={x:xA,y:yA,mode:"lines",name:"Convex (disk)",line:{color:"#4ade80",width:2.5},fill:"toself",fillcolor:"rgba(74,222,128,0.18)"};
  var nonconvex={x:xB,y:yB,mode:"lines",name:"Non-convex (lobed)",line:{color:"#f87171",width:2.5},fill:"toself",fillcolor:"rgba(248,113,113,0.18)"};
  var chordOK={x:[-2.3,-0.9],y:[-0.4,0.6],mode:"lines+markers",line:{color:"#4ade80",width:3,dash:"dot"},marker:{size:8,color:"#4ade80"},name:"chord stays inside",showlegend:false};
  var chordBAD={x:[0.85,2.35],y:[0.95,-0.95],mode:"lines+markers",line:{color:"#f87171",width:3,dash:"dot"},marker:{size:8,color:"#f87171"},name:"chord exits set",showlegend:false};
  var ann=[{x:-1.6,y:-1.4,text:"convex",showarrow:false,font:{color:"#4ade80",size:14}},{x:1.6,y:-1.7,text:"non-convex",showarrow:false,font:{color:"#f87171",size:14}}];
  var layout={title:{text:"Convex set vs non-convex set: chord test",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.08)",range:[-3.2,3.4],showticklabels:false},yaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.08)",range:[-2.0,1.8],showticklabels:false,scaleanchor:"x"},margin:{t:40,r:20,b:20,l:20},annotations:ann,showlegend:true,legend:{font:{color:"#ebe6dc"}}};
  Plotly.newPlot("plot-ml7-convexset-en",[convex,nonconvex,chordOK,chordBAD],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The green disk is convex — every chord between two interior points stays inside. The red lobed shape is non-convex — the dashed chord crosses out of the set into the surrounding region. This is the geometric definition: convex = no dents, every chord is contained.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Convex Functions and Jensen's Inequality</h2>
<p class="l-text">A function $f : \\mathbb{R}^n \\to \\mathbb{R}$ is <strong>convex</strong> if its domain is a convex set and:</p>

<div class="katex-block">$$f(\\lambda x_1 + (1-\\lambda) x_2) \\leq \\lambda f(x_1) + (1-\\lambda) f(x_2) \\quad \\forall x_1, x_2,\\ \\lambda \\in [0,1].$$</div>

<p class="l-text">Geometrically: the chord between any two points on the graph lies above the graph. Strict convexity requires strict inequality for $\\lambda \\in (0,1)$ and $x_1 \\neq x_2$.</p>

<p class="l-text">If $f$ is twice differentiable, convexity is equivalent to $\\nabla^2 f(x) \\succeq 0$ everywhere — the Hessian is positive semidefinite. This is the test you actually run in practice.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Convex examples</div><div class="card-body">$x^2$, $e^x$, $-\\log x$ (on $x &gt; 0$), $\\|x\\|_p$ for $p \\geq 1$, $\\max(0, 1-yx)$ (hinge loss), $\\log(1+e^{-yx})$ (logistic loss).</div></div>
<div class="calc-card"><div class="card-title">Concave examples</div><div class="card-body">$\\log x$, $\\sqrt{x}$, $-x^2$. A function $f$ is concave iff $-f$ is convex.</div></div>
<div class="calc-card"><div class="card-title">Operations that preserve convexity</div><div class="card-body">Non-negative weighted sum, pointwise max, composition with affine ($f(Ax+b)$), perspective. This is how you certify a loss is convex.</div></div>
<div class="calc-card"><div class="card-title">Strongly convex</div><div class="card-body">$\\nabla^2 f(x) \\succeq \\mu I$ for some $\\mu &gt; 0$. Stronger curvature → faster convergence. Ridge regression is strongly convex; plain linear regression is convex but not strongly convex when features are collinear.</div></div>
</div>

<p class="l-text"><strong>Jensen's inequality</strong> generalizes the convexity definition to any random variable: for convex $f$ and integrable $X$,</p>

<div class="katex-block">$$f(\\mathbb{E}[X]) \\leq \\mathbb{E}[f(X)].$$</div>

<p class="l-text">This single line is the engine behind the variational lower bound (ELBO) in VAEs, the Jensen-Shannon divergence in GANs, the analysis of EM, and most concentration inequalities. Apply it once with $f(x)=-\\log x$ and you derive the AM-GM inequality. Apply it with $f(x)=x \\log x$ and you derive the data-processing inequality for KL.</p>

<div id="plot-ml7-jensen-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var xs=[],ys=[];
  for(var i=0;i<=200;i++){var x=-2.5+5*i/200; xs.push(x); ys.push(x*x);}
  var fx={x:xs,y:ys,mode:"lines",name:"f(x)=x² (convex)",line:{color:"#c8a96e",width:3}};
  var x1=-1.8, x2=2.0, lam=0.5;
  var midx=lam*x1+(1-lam)*x2;
  var midf=lam*x1*x1+(1-lam)*x2*x2;
  var fmid=midx*midx;
  var chord={x:[x1,x2],y:[x1*x1,x2*x2],mode:"lines+markers",name:"chord",line:{color:"#4ecdc4",width:2.5,dash:"dot"},marker:{size:10,color:"#4ecdc4"}};
  var jensenLine={x:[midx,midx],y:[fmid,midf],mode:"lines+markers",name:"Jensen gap",line:{color:"#f87171",width:2.5},marker:{size:9,color:"#f87171"}};
  var ann=[{x:midx,y:fmid,text:"f(E[X])",showarrow:true,arrowhead:2,ax:-30,ay:30,font:{color:"#c8a96e",size:12},arrowcolor:"#c8a96e"},{x:midx,y:midf,text:"E[f(X)]",showarrow:true,arrowhead:2,ax:30,ay:-25,font:{color:"#4ecdc4",size:12},arrowcolor:"#4ecdc4"}];
  var layout={title:{text:"Jensen: f(E[X]) ≤ E[f(X)] for convex f",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"x",font:{color:"#ebe6dc"}}},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"f(x)",font:{color:"#ebe6dc"}}},margin:{t:40,r:20,b:50,l:50},annotations:ann,showlegend:true,legend:{font:{color:"#ebe6dc"}}};
  Plotly.newPlot("plot-ml7-jensen-en",[fx,chord,jensenLine],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The convex parabola f(x)=x² lies below every chord. For two points x₁, x₂, the chord at the midpoint sits at E[f(X)] (cyan dot) while the curve is at f(E[X]) (gold dot below). The red gap between them is exactly Jensen's inequality — strictly positive whenever f is strictly convex and X is non-degenerate.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Verifying Convexity Numerically</h2>
<p class="l-text">In practice we often want to spot-check whether a loss is convex without proving it formally. The Hessian eigenvalue test does the job: sample some points, compute the Hessian, check that all eigenvalues are non-negative.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Logistic loss for binary classification: L(w) = mean log(1 + exp(-y * Xw))</span>
<span class="cm"># Theory says this is convex in w. Let's verify numerically.</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
n, d = <span class="num">200</span>, <span class="num">5</span>
X = rng.<span class="fn">standard_normal</span>((n, d))
y = np.<span class="fn">sign</span>(rng.<span class="fn">standard_normal</span>(n))

<span class="kw">def</span> <span class="fn">loss</span>(w):
    z = -y * (X @ w)
    <span class="kw">return</span> np.<span class="fn">mean</span>(np.<span class="fn">log1p</span>(np.<span class="fn">exp</span>(z)))

<span class="kw">def</span> <span class="fn">hessian</span>(w, eps=<span class="num">1e-4</span>):
    H = np.<span class="fn">zeros</span>((d, d))
    f0 = <span class="fn">loss</span>(w)
    g = np.<span class="fn">zeros</span>(d)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(d):
        e = np.<span class="fn">zeros</span>(d); e[i] = eps
        g[i] = (<span class="fn">loss</span>(w+e) - <span class="fn">loss</span>(w-e)) / (<span class="num">2</span>*eps)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(d):
        ei = np.<span class="fn">zeros</span>(d); ei[i] = eps
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(d):
            ej = np.<span class="fn">zeros</span>(d); ej[j] = eps
            H[i,j] = (<span class="fn">loss</span>(w+ei+ej) - <span class="fn">loss</span>(w+ei-ej) - <span class="fn">loss</span>(w-ei+ej) + <span class="fn">loss</span>(w-ei-ej)) / (<span class="num">4</span>*eps*eps)
    <span class="kw">return</span> (H + H.T) / <span class="num">2</span>

<span class="cm"># Sample 20 random weight vectors, check Hessian eigenvalues</span>
min_eigs = []
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    w = rng.<span class="fn">standard_normal</span>(d) * <span class="num">0.5</span>
    H = <span class="fn">hessian</span>(w)
    min_eigs.<span class="fn">append</span>(np.linalg.<span class="fn">eigvalsh</span>(H).<span class="fn">min</span>())

min_eigs = np.<span class="fn">array</span>(min_eigs)
<span class="fn">print</span>(f<span class="str">"Smallest Hessian eigenvalue across 20 random points:"</span>)
<span class="fn">print</span>(f<span class="str">"  min:  {min_eigs.min():.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"  mean: {min_eigs.mean():.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"  All non-negative? {bool((min_eigs &gt;= -1e-6).all())}  &lt;- convexity confirmed"</span>)
</code></pre></div>

<p class="l-text">All eigenvalues come out non-negative within numerical tolerance, as theory predicts. Try the same test on a non-convex loss — say <code>loss(w) = (X@w - y)**4 - (X@w - y)**2</code> — and you will see negative eigenvalues at points where the function dips below its tangent.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Gradient Descent — Convergence on Convex Objectives</h2>
<p class="l-text">For an unconstrained convex problem $\\min_x f(x)$ with $L$-Lipschitz gradient, plain gradient descent</p>

<div class="katex-block">$$x_{k+1} = x_k - \\frac{1}{L} \\nabla f(x_k)$$</div>

<p class="l-text">satisfies $f(x_k) - f^\\star \\leq \\frac{L \\|x_0 - x^\\star\\|^2}{2k}$. Linearly in $1/k$ — sublinear convergence. To halve the suboptimality you need to double the iterations.</p>

<p class="l-text">If $f$ is in addition $\\mu$-strongly convex (Hessian $\\succeq \\mu I$), the rate becomes <strong>linear</strong>:</p>

<div class="katex-block">$$f(x_k) - f^\\star \\leq \\left(1 - \\frac{\\mu}{L}\\right)^k \\bigl(f(x_0) - f^\\star\\bigr).$$</div>

<p class="l-text">The ratio $\\kappa = L/\\mu$ is the <strong>condition number</strong>. Each iteration shrinks the gap by a factor $1 - 1/\\kappa$. Well-conditioned problems ($\\kappa \\approx 1$) converge in tens of iterations; badly-conditioned problems ($\\kappa = 10^4$) take tens of thousands. This is why preconditioning, Newton's method, and Adam all exist — they aim to reduce the effective $\\kappa$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Convex, smooth</div><div class="card-body">$O(1/k)$ — sublinear. Slow but guaranteed.</div></div>
<div class="calc-card"><div class="card-title">Strongly convex, smooth</div><div class="card-body">$O((1 - 1/\\kappa)^k)$ — linear. Fast when $\\kappa$ is small.</div></div>
<div class="calc-card"><div class="card-title">Convex, smooth + Nesterov momentum</div><div class="card-body">$O(1/k^2)$ — accelerated. Optimal among first-order methods (Nesterov 1983).</div></div>
<div class="calc-card"><div class="card-title">Newton's method</div><div class="card-body">Quadratic convergence near optimum: errors square each step. Costs $O(d^3)$ per step.</div></div>
</div>

<div id="plot-ml7-gdpath-en" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var xs=[],ys=[];
  for(var i=0;i<=200;i++){var x=-3+6*i/200; xs.push(x); ys.push(0.4*x*x);}
  var conv={x:xs,y:ys,mode:"lines",name:"convex bowl 0.4x²",line:{color:"#4ade80",width:2.5}};
  var xs2=[],ys2=[];
  for(var i=0;i<=300;i++){var x=-3+6*i/300; xs2.push(x); ys2.push(0.18*x*x + 1.2*Math.sin(2.2*x));}
  var nonc={x:xs2,y:ys2,mode:"lines",name:"non-convex 0.18x²+1.2sin(2.2x)",line:{color:"#f87171",width:2.5}};
  // GD on convex bowl from x0=2.6
  var gxC=[],gyC=[]; var x=2.6;
  for(var k=0;k<14;k++){gxC.push(x); gyC.push(0.4*x*x); x = x - 0.5*(0.8*x);}
  var pathC={x:gxC,y:gyC,mode:"lines+markers",name:"GD on convex → global min",line:{color:"#4ade80",width:2,dash:"dot"},marker:{size:7,color:"#4ade80",symbol:"circle"}};
  // GD on non-convex from x0=2.6 — gets stuck in local min near x≈1.8
  var gxN=[],gyN=[]; var xn=2.6;
  function gradN(x){return 0.36*x + 1.2*2.2*Math.cos(2.2*x);}
  function fN(x){return 0.18*x*x + 1.2*Math.sin(2.2*x);}
  for(var k=0;k<14;k++){gxN.push(xn); gyN.push(fN(xn)); xn = xn - 0.18*gradN(xn);}
  var pathN={x:gxN,y:gyN,mode:"lines+markers",name:"GD on non-convex → local min",line:{color:"#f87171",width:2,dash:"dot"},marker:{size:7,color:"#f87171",symbol:"x"}};
  var layout={title:{text:"Gradient descent: convex (always global) vs non-convex (can stick)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",title:{text:"x",font:{color:"#ebe6dc"}}},yaxis:{gridcolor:"rgba(255,255,255,0.06)",title:{text:"f(x)",font:{color:"#ebe6dc"}},range:[-2.0,4.0]},margin:{t:40,r:20,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.98}};
  Plotly.newPlot("plot-ml7-gdpath-en",[conv,nonc,pathC,pathN],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Same gradient-descent algorithm, two losses. On the green convex bowl, every initialization marches monotonically to the global minimum at x=0. On the red wavy non-convex loss, the iterates settle into a local minimum near x≈1.8 — the global minimum on the left is invisible to local information. This is exactly why "convex" is a load-bearing assumption in optimization theory.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Projected Gradient Descent on the Positive Orthant</h2>
<p class="l-text">Constrained convex optimization $\\min_{x \\in C} f(x)$ has a beautiful first-order method: take a gradient step, then project back onto $C$. Convergence rates carry over from the unconstrained case as long as the projection is exact.</p>

<div class="katex-block">$$x_{k+1} = \\Pi_C\\bigl(x_k - \\eta\\, \\nabla f(x_k)\\bigr)$$</div>

<p class="l-text">For the positive orthant, the projection is just clipping: $\\Pi_{\\mathbb{R}^n_+}(x) = \\max(x, 0)$. This is exactly what non-negative matrix factorization does at every step.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Constrained least squares: min_{x &gt;= 0} (1/2) ||Ax - b||^2</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
m, n = <span class="num">200</span>, <span class="num">20</span>
A = rng.<span class="fn">standard_normal</span>((m, n))
x_true = np.<span class="fn">maximum</span>(rng.<span class="fn">standard_normal</span>(n), <span class="num">0</span>)
b = A @ x_true + <span class="num">0.05</span> * rng.<span class="fn">standard_normal</span>(m)

<span class="kw">def</span> <span class="fn">f</span>(x):    <span class="kw">return</span> <span class="num">0.5</span> * np.<span class="fn">sum</span>((A @ x - b)**<span class="num">2</span>)
<span class="kw">def</span> <span class="fn">grad</span>(x): <span class="kw">return</span> A.T @ (A @ x - b)

<span class="cm"># Step size = 1 / largest eigenvalue of A^T A</span>
L = np.linalg.<span class="fn">eigvalsh</span>(A.T @ A).<span class="fn">max</span>()
eta = <span class="num">1.0</span> / L
<span class="fn">print</span>(f<span class="str">"Lipschitz constant L = {L:.2f}, step size = {eta:.5f}"</span>)

x = np.<span class="fn">zeros</span>(n)
trace = []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>):
    x = np.<span class="fn">maximum</span>(x - eta * <span class="fn">grad</span>(x), <span class="num">0</span>)   <span class="cm"># project onto positive orthant</span>
    trace.<span class="fn">append</span>(<span class="fn">f</span>(x))

trace = np.<span class="fn">array</span>(trace)
<span class="fn">print</span>(f<span class="str">"\\nIter 0:    f = {f(np.zeros(n)):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Iter 50:   f = {trace[49]:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Iter 500:  f = {trace[-1]:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"All x &gt;= 0? {bool((x &gt;= 0).all())}"</span>)
<span class="fn">print</span>(f<span class="str">"Reconstruction error vs x_true: {np.linalg.norm(x - x_true):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"\\n1/k convergence check: f(x_50)/f(x_500) approx {trace[49]/trace[-1]:.2f}"</span>)
</code></pre></div>

<p class="l-text">Two observations to internalize. First, the constraint $x \\geq 0$ is enforced by a single <code>np.maximum(...,0)</code> after every step — that is the entire algorithm. Second, the suboptimality drops roughly as $1/k$, exactly matching the convex theoretical rate; if we replaced $A$ with a strongly convex matrix (e.g. $A^\\top A + \\mu I$), the curve would become linear instead.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. KKT Conditions — Constrained Optimality</h2>
<p class="l-text">For a constrained convex problem</p>

<div class="katex-block">$$\\min_x f(x) \\quad \\text{s.t.} \\quad g_i(x) \\leq 0,\\ h_j(x) = 0,$$</div>

<p class="l-text">a point $x^\\star$ with multipliers $\\lambda_i \\geq 0$ and $\\nu_j$ is optimal iff the <strong>KKT conditions</strong> hold:</p>

<div class="katex-block">$$\\begin{aligned}
&amp;\\nabla f(x^\\star) + \\sum_i \\lambda_i \\nabla g_i(x^\\star) + \\sum_j \\nu_j \\nabla h_j(x^\\star) = 0 \\quad \\text{(stationarity)} \\\\
&amp;g_i(x^\\star) \\leq 0,\\quad h_j(x^\\star) = 0 \\quad \\text{(primal feasibility)} \\\\
&amp;\\lambda_i \\geq 0 \\quad \\text{(dual feasibility)} \\\\
&amp;\\lambda_i \\, g_i(x^\\star) = 0 \\quad \\text{(complementary slackness)}
\\end{aligned}$$</div>

<p class="l-text">For convex problems with a Slater point, KKT is necessary and sufficient. The complementary-slackness line is the most useful in practice: either a constraint is <em>active</em> (binding, $g_i=0$) and its multiplier $\\lambda_i$ can be positive, or it is <em>inactive</em> ($g_i &lt; 0$) and its multiplier must be zero. Active-set methods exploit this directly.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize

<span class="cm"># min  x1^2 + x2^2</span>
<span class="cm"># s.t. x1 + x2 = 1            (equality)</span>
<span class="cm">#      x1 &gt;= 0, x2 &gt;= 0       (inequalities)</span>
<span class="cm"># Analytic solution: x1 = x2 = 1/2, lambda=0 (inequalities inactive), nu=1</span>
<span class="kw">def</span> <span class="fn">f</span>(x):     <span class="kw">return</span> x[<span class="num">0</span>]**<span class="num">2</span> + x[<span class="num">1</span>]**<span class="num">2</span>
<span class="kw">def</span> <span class="fn">grad</span>(x):  <span class="kw">return</span> np.<span class="fn">array</span>([<span class="num">2</span>*x[<span class="num">0</span>], <span class="num">2</span>*x[<span class="num">1</span>]])

cons = [{<span class="str">"type"</span>:<span class="str">"eq"</span>,   <span class="str">"fun"</span>: <span class="kw">lambda</span> x: x[<span class="num">0</span>] + x[<span class="num">1</span>] - <span class="num">1</span>, <span class="str">"jac"</span>: <span class="kw">lambda</span> x: np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">1.0</span>])}]
bnds = [(<span class="num">0</span>, <span class="kw">None</span>), (<span class="num">0</span>, <span class="kw">None</span>)]

res = <span class="fn">minimize</span>(f, x0=np.<span class="fn">array</span>([<span class="num">0.1</span>, <span class="num">0.9</span>]), jac=grad,
               method=<span class="str">"SLSQP"</span>, bounds=bnds, constraints=cons,
               options={<span class="str">"ftol"</span>:<span class="num">1e-12</span>})
x_star = res.x
<span class="fn">print</span>(f<span class="str">"Optimal x* = {x_star}"</span>)
<span class="fn">print</span>(f<span class="str">"f(x*) = {res.fun:.6f}     (expected 0.5)"</span>)
<span class="fn">print</span>(f<span class="str">"Constraint x1+x2-1 = {x_star.sum() - 1:.2e}   (should be ~0)"</span>)
<span class="fn">print</span>(f<span class="str">"Both x_i &gt; 0? {bool((x_star &gt; 0).all())}  =&gt; inequality constraints inactive (lambda=0)"</span>)

<span class="cm"># Check stationarity: grad f + nu * grad h = 0</span>
<span class="cm"># grad h = (1,1), so nu = -grad f[i]; both components should give same nu</span>
g = <span class="fn">grad</span>(x_star)
<span class="fn">print</span>(f<span class="str">"\\nStationarity check: grad f(x*) = {g}"</span>)
<span class="fn">print</span>(f<span class="str">"Implied nu (Lagrange mult for equality): -g[0] = {-g[0]:.4f}, -g[1] = {-g[1]:.4f}  (should match)"</span>)
</code></pre></div>

<p class="l-text">SLSQP finds $x^\\star = (1/2, 1/2)$, the inequalities are inactive (so their KKT multipliers are zero), and the equality multiplier $\\nu$ comes out to $-1$ from stationarity. This is the smallest non-trivial example that exercises every line of the KKT conditions — copy it, change $f$ and the constraints, and you can verify any constrained convex problem on your desk.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Where Convexity Ends</h2>
<p class="l-text">A short tour of "are these losses convex?", which is the question that decides whether to celebrate or worry.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Convex (you have global guarantees)</div><div class="card-body">Linear regression, ridge, lasso (after smoothing or via subgradients), logistic regression, SVM hinge loss, Poisson regression, max-entropy / softmax with linear features, LP / QP / SOCP / SDP.</div></div>
<div class="calc-card"><div class="card-title">Convex in some variables, not jointly</div><div class="card-body">Matrix factorization $\\min_{U,V} \\|UV^\\top - X\\|^2$ — convex in $U$ for fixed $V$, and vice versa. Alternating minimization works but no global guarantee.</div></div>
<div class="calc-card"><div class="card-title">Non-convex but well-behaved</div><div class="card-body">Deep networks (overparameterized regime), k-means, Gaussian mixtures with EM. No global guarantees, but local minima are often "good enough" empirically.</div></div>
<div class="calc-card"><div class="card-title">Hard non-convex</div><div class="card-body">Combinatorial / discrete losses (0-1 loss, max-likelihood with discrete latents without relaxation), reinforcement learning value optimization, bilevel problems. Need approximations or heuristics.</div></div>
</div>

<div class="calc-highlight"><strong>Practical heuristic:</strong> if your loss is a sum / max / composition of convex functions of $w$ alone (not coupled through nonlinear hidden layers), it is probably convex. The moment you add a hidden layer with a nonlinear activation, all bets are off.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Convex optimization is the well-understood corner of the field: convexity = no spurious local minima, gradient descent converges at known rates, and the KKT conditions give a complete characterization of constrained optima. You have to earn convexity (the loss must be built from convex pieces, the constraints must be convex sets), but when you have it the tools are decisive — and most of classical statistics and signal processing do have it.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>A set is convex if line segments stay inside; a function is convex if chords lie above its graph.</li>
<li>Twice-differentiable convex ⇔ Hessian is PSD everywhere. This is the test you can run with <code>np.linalg.eigvalsh</code>.</li>
<li>Jensen: $f(\\mathbb{E}[X]) \\leq \\mathbb{E}[f(X)]$. Behind ELBO, JS divergence, and most concentration inequalities.</li>
<li>Convergence: convex smooth $O(1/k)$, strongly convex linear, Nesterov accelerated $O(1/k^2)$, Newton quadratic.</li>
<li>Projected GD: gradient step, then $\\Pi_C(\\cdot)$. For the positive orthant, project = clip.</li>
<li>KKT: stationarity + primal feasibility + dual feasibility + complementary slackness. Necessary and sufficient under Slater.</li>
<li>Convex in real ML: linear / logistic / ridge / lasso / SVM / max-ent. Not convex: deep nets, mixtures, k-means.</li>
</ul>
</div>

<p class="l-text">In <strong>math-L8</strong> we leave the flat Euclidean world and enter <em>manifolds</em> — the right setting for optimization on the sphere (orientation problems), the Stiefel manifold (orthogonal matrices in PCA / attention), and the cone of positive-definite matrices (covariance estimation). Then in <strong>math-L9</strong> we meet <em>information geometry</em>, where the manifold is a family of probability distributions and the metric is the Fisher information. Together these three lessons take you from "gradient descent on $\\mathbb{R}^n$" to the geometry that underpins natural-gradient methods and modern second-order optimizers.</p>
</div>`,
tr: `<p class="l-text"><strong>Konveks optimizasyon, doğrusal olmayan optimizasyonun bir şeyleri kanıtlayabildiğimiz tek köşesidir.</strong> Kayıp fonksiyonun konveks ise, gradient inişi global minimumu bulur — bir global minimumu değil, global minimumu — bilinen bir hızda. Kaçılacak sahte yerel minimumlar, endişelenecek eyer noktaları, ilklendirmede şans yoktur. Ödediğin bedel "konveks"in güçlü bir varsayım olmasıdır: doğrusal regresyon, ridge, lasso, lojistik regresyon, destek vektör makineleri, maksimum-entropi modelleri ve sinyal işlemenin geniş bir kesiti için geçerlidir — ancak sinir ağları, Gauss karışımları ve çoğu modern derin öğrenme için bozulur. Konveks dünyanın nerede bittiğini bilmek, bir uygulayıcının taşıyabileceği en faydalı tek optimizasyon teorisi parçasıdır.</p>

<p class="l-text">Bu derste dili kuruyoruz: konveks kümeler, konveks fonksiyonlar, Jensen eşitsizliği, KKT koşulları ve konveks ile güçlü konveks hedefler üzerinde gradient inişinin yakınsama garantileri. Sonra kısıtlı bir problem (negatif olmayan matris çarpanlarına ayırmada her yerde kullanılan pozitif ortant) üzerinde projeksiyonlu gradient inişi çalıştırıyor, <code>scipy.optimize.minimize</code> ile küçük bir KKT problemi çözüyor ve teorinin vaatleriyle optimize edicilerin gerçekten verdiği arasındaki boşluğa bakıyoruz. Referans Boyd &amp; Vandenberghe'nin <em>Convex Optimization</em>'ı (2004) — yirmi yıl sonra hâlâ konunun en temiz kitabı.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir konveks kümeyi ve konveks fonksiyonu tanımlarından tanımak</li>
<li>Jensen eşitsizliğini kanıtlamak ve uygulamak — varyasyonel sınırlar, ELBO ve Jensen-Shannon ıraksaklığının arkasındaki tek eşitsizlik</li>
<li>Kısıtlı bir optimizasyon problemi için KKT koşullarını yazmak ve scipy ile doğrulamak</li>
<li>Konveks (<code>O(1/k)</code>) vs güçlü konveks (doğrusal) hedefler üzerinde gradient inişinin yakınsama hızını söylemek</li>
<li>Projeksiyonlu gradient inişini uygulamak ve kısıtlı bir problemde yakınsamasını izlemek</li>
<li>Gerçek bir kaybın ne zaman konveks olduğunu (doğrusal / lojistik regresyon, SVM'ler) ve ne zaman olmadığını (derin ağlar, karışımlar, k-means) söylemek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Konveks Kümeler</h2>
<p class="l-text">Bir küme $C \\subseteq \\mathbb{R}^n$, herhangi iki nokta $x, y \\in C$ ve herhangi $\\lambda \\in [0,1]$ için aralarındaki doğru parçası içeride kalıyorsa <strong>konveks</strong>tir:</p>

<div class="katex-block">$$\\lambda x + (1-\\lambda) y \\in C \\quad \\forall x,y \\in C,\\ \\lambda \\in [0,1].$$</div>

<p class="l-text">Geometrik olarak: çukur yok. Dolu bir disk konvekstir; bir hilal değildir. Herhangi sayıda konveks kümenin kesişimi konvekstir (ispat tek satır). Pratikte karşılaştığın çoğu kısıt kümesi yapısal olarak konvekstir: yarı-uzaylar $\\{x : a^\\top x \\leq b\\}$, pozitif ortant $\\mathbb{R}^n_+$, olasılık simpleksi $\\{p : p_i \\geq 0, \\sum p_i = 1\\}$, birim küre, pozitif yarı-tanımlı matrisler konisi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yarı-uzay</div><div class="card-body">$\\{x : a^\\top x \\leq b\\}$. Doğrusal eşitsizlik kısıtları. Doğrusal programlama ve SVM'lerde her yerde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Pozitif ortant</div><div class="card-body">$\\mathbb{R}^n_+ = \\{x : x_i \\geq 0\\}$. NMF, Poisson regresyonu, sayım modellerinde negatif olmama kısıtları.</div></div>
<div class="calc-card"><div class="card-title">Olasılık simpleksi</div><div class="card-body">$\\{p : p_i \\geq 0,\\ \\sum_i p_i = 1\\}$. Herhangi bir ayrık dağılım için doğal kısıt kümesi.</div></div>
<div class="calc-card"><div class="card-title">PSD koni</div><div class="card-body">$\\{X \\succeq 0\\}$. Kovaryans matrisleri burada yaşar. Yarı-tanımlı programlamada kullanılır.</div></div>
</div>

<div class="calc-highlight"><strong>Konveksliği koruyan tek-satır işlemleri:</strong> kesişim, afin imge $Ax+b$, perspektif dönüşümü, kısmi minimizasyon. Kısıt kümeni konveks parçalardan bu işlemlerle inşa edersen, sonuç otomatik olarak konvekstir.</div>

<div id="plot-ml7-convexset-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var thA=[],xA=[],yA=[];
  for(var i=0;i<=100;i++){var a=i*Math.PI*2/100; thA.push(a); xA.push(-1.6+1.0*Math.cos(a)); yA.push(1.0*Math.sin(a));}
  var xB=[],yB=[];
  for(var j=0;j<=200;j++){var b=j*Math.PI*2/200; var r=1.0+0.45*Math.cos(3*b); xB.push(1.6+r*Math.cos(b)); yB.push(r*Math.sin(b));}
  var convex={x:xA,y:yA,mode:"lines",name:"Konveks (disk)",line:{color:"#4ade80",width:2.5},fill:"toself",fillcolor:"rgba(74,222,128,0.18)"};
  var nonconvex={x:xB,y:yB,mode:"lines",name:"Konveks değil",line:{color:"#f87171",width:2.5},fill:"toself",fillcolor:"rgba(248,113,113,0.18)"};
  var chordOK={x:[-2.3,-0.9],y:[-0.4,0.6],mode:"lines+markers",line:{color:"#4ade80",width:3,dash:"dot"},marker:{size:8,color:"#4ade80"},name:"kiriş içeride",showlegend:false};
  var chordBAD={x:[0.85,2.35],y:[0.95,-0.95],mode:"lines+markers",line:{color:"#f87171",width:3,dash:"dot"},marker:{size:8,color:"#f87171"},name:"kiriş dışarı çıkıyor",showlegend:false};
  var ann=[{x:-1.6,y:-1.4,text:"konveks",showarrow:false,font:{color:"#4ade80",size:14}},{x:1.6,y:-1.7,text:"konveks değil",showarrow:false,font:{color:"#f87171",size:14}}];
  var layout={title:{text:"Konveks küme vs konveks olmayan küme: kiriş testi",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.08)",range:[-3.2,3.4],showticklabels:false},yaxis:{gridcolor:"rgba(255,255,255,0.05)",zerolinecolor:"rgba(255,255,255,0.08)",range:[-2.0,1.8],showticklabels:false,scaleanchor:"x"},margin:{t:40,r:20,b:20,l:20},annotations:ann,showlegend:true,legend:{font:{color:"#ebe6dc"}}};
  Plotly.newPlot("plot-ml7-convexset-tr",[convex,nonconvex,chordOK,chordBAD],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Yeşil disk konvekstir — iki iç nokta arasındaki her kiriş kümenin içinde kalır. Kırmızı loblu şekil konveks değildir — kesik çizgili kiriş kümenin dışına çıkar. Konveksliğin geometrik tanımı budur: çukur yok, her kiriş içeride.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Konveks Fonksiyonlar ve Jensen Eşitsizliği</h2>
<p class="l-text">Bir fonksiyon $f : \\mathbb{R}^n \\to \\mathbb{R}$, tanım kümesi konveks bir küme olduğunda ve aşağıdaki sağlandığında <strong>konveks</strong>tir:</p>

<div class="katex-block">$$f(\\lambda x_1 + (1-\\lambda) x_2) \\leq \\lambda f(x_1) + (1-\\lambda) f(x_2) \\quad \\forall x_1, x_2,\\ \\lambda \\in [0,1].$$</div>

<p class="l-text">Geometrik olarak: grafik üzerindeki herhangi iki nokta arasındaki kiriş grafiğin üzerinde uzanır. Kesin konvekslik $\\lambda \\in (0,1)$ ve $x_1 \\neq x_2$ için kesin eşitsizlik gerektirir.</p>

<p class="l-text">$f$ iki kez türevlenebilir ise, konvekslik $\\nabla^2 f(x) \\succeq 0$ her yerde — Hessian pozitif yarı-tanımlı — koşuluna eşdeğerdir. Pratikte gerçekten çalıştırdığın test budur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Konveks örnekler</div><div class="card-body">$x^2$, $e^x$, $-\\log x$ ($x &gt; 0$ üzerinde), $\\|x\\|_p$ for $p \\geq 1$, $\\max(0, 1-yx)$ (hinge kaybı), $\\log(1+e^{-yx})$ (lojistik kayıp).</div></div>
<div class="calc-card"><div class="card-title">Konkav örnekler</div><div class="card-body">$\\log x$, $\\sqrt{x}$, $-x^2$. $f$ konkavdır ancak ve ancak $-f$ konvekstir.</div></div>
<div class="calc-card"><div class="card-title">Konveksliği koruyan işlemler</div><div class="card-body">Negatif olmayan ağırlıklı toplam, noktasal max, afin ile bileşim ($f(Ax+b)$), perspektif. Bir kaybın konveks olduğunu bu şekilde sertifikalandırırsın.</div></div>
<div class="calc-card"><div class="card-title">Güçlü konveks</div><div class="card-body">Bir $\\mu &gt; 0$ için $\\nabla^2 f(x) \\succeq \\mu I$. Daha güçlü eğrilik → daha hızlı yakınsama. Ridge regresyonu güçlü konvekstir; özellikler doğrusal bağımlı olduğunda saf doğrusal regresyon konvekstir ama güçlü konveks değildir.</div></div>
</div>

<p class="l-text"><strong>Jensen eşitsizliği</strong> konvekslik tanımını herhangi bir rastgele değişkene genelleştirir: konveks $f$ ve integrallenebilir $X$ için,</p>

<div class="katex-block">$$f(\\mathbb{E}[X]) \\leq \\mathbb{E}[f(X)].$$</div>

<p class="l-text">Bu tek satır VAE'lerdeki varyasyonel alt sınır (ELBO), GAN'lardaki Jensen-Shannon ıraksaklığı, EM'nin analizi ve çoğu yoğunlaşma eşitsizliğinin arkasındaki motordur. Bir kez $f(x)=-\\log x$ ile uygula AM-GM eşitsizliğini türet. $f(x)=x \\log x$ ile uygula ve KL için veri-işleme eşitsizliğini türet.</p>

<div id="plot-ml7-jensen-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var xs=[],ys=[];
  for(var i=0;i<=200;i++){var x=-2.5+5*i/200; xs.push(x); ys.push(x*x);}
  var fx={x:xs,y:ys,mode:"lines",name:"f(x)=x² (konveks)",line:{color:"#c8a96e",width:3}};
  var x1=-1.8, x2=2.0, lam=0.5;
  var midx=lam*x1+(1-lam)*x2;
  var midf=lam*x1*x1+(1-lam)*x2*x2;
  var fmid=midx*midx;
  var chord={x:[x1,x2],y:[x1*x1,x2*x2],mode:"lines+markers",name:"kiriş",line:{color:"#4ecdc4",width:2.5,dash:"dot"},marker:{size:10,color:"#4ecdc4"}};
  var jensenLine={x:[midx,midx],y:[fmid,midf],mode:"lines+markers",name:"Jensen boşluğu",line:{color:"#f87171",width:2.5},marker:{size:9,color:"#f87171"}};
  var ann=[{x:midx,y:fmid,text:"f(E[X])",showarrow:true,arrowhead:2,ax:-30,ay:30,font:{color:"#c8a96e",size:12},arrowcolor:"#c8a96e"},{x:midx,y:midf,text:"E[f(X)]",showarrow:true,arrowhead:2,ax:30,ay:-25,font:{color:"#4ecdc4",size:12},arrowcolor:"#4ecdc4"}];
  var layout={title:{text:"Jensen: konveks f için f(E[X]) ≤ E[f(X)]",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"x",font:{color:"#ebe6dc"}}},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.10)",title:{text:"f(x)",font:{color:"#ebe6dc"}}},margin:{t:40,r:20,b:50,l:50},annotations:ann,showlegend:true,legend:{font:{color:"#ebe6dc"}}};
  Plotly.newPlot("plot-ml7-jensen-tr",[fx,chord,jensenLine],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Konveks parabol f(x)=x² her kirişin altında kalır. İki nokta x₁, x₂ için orta noktadaki kiriş E[f(X)]'te (camgöbeği nokta), eğri ise altındaki f(E[X])'tedir (altın nokta). Aralarındaki kırmızı boşluk tam olarak Jensen eşitsizliğidir — f kesin konveks ve X dejenere değilse her zaman pozitiftir.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Konveksliği Sayısal Olarak Doğrulama</h2>
<p class="l-text">Pratikte sıklıkla bir kaybın konveks olup olmadığını formal olarak kanıtlamadan kontrol etmek isteriz. Hessian özdeğer testi işi görür: bazı noktalar örnekle, Hessian'ı hesapla, tüm özdeğerlerin negatif olmadığını kontrol et.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># İkili sınıflandırma için lojistik kayıp: L(w) = mean log(1 + exp(-y * Xw))</span>
<span class="cm"># Teori bunun w'de konveks olduğunu söyler. Sayısal olarak doğrulayalım.</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
n, d = <span class="num">200</span>, <span class="num">5</span>
X = rng.<span class="fn">standard_normal</span>((n, d))
y = np.<span class="fn">sign</span>(rng.<span class="fn">standard_normal</span>(n))

<span class="kw">def</span> <span class="fn">loss</span>(w):
    z = -y * (X @ w)
    <span class="kw">return</span> np.<span class="fn">mean</span>(np.<span class="fn">log1p</span>(np.<span class="fn">exp</span>(z)))

<span class="kw">def</span> <span class="fn">hessian</span>(w, eps=<span class="num">1e-4</span>):
    H = np.<span class="fn">zeros</span>((d, d))
    f0 = <span class="fn">loss</span>(w)
    g = np.<span class="fn">zeros</span>(d)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(d):
        e = np.<span class="fn">zeros</span>(d); e[i] = eps
        g[i] = (<span class="fn">loss</span>(w+e) - <span class="fn">loss</span>(w-e)) / (<span class="num">2</span>*eps)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(d):
        ei = np.<span class="fn">zeros</span>(d); ei[i] = eps
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(d):
            ej = np.<span class="fn">zeros</span>(d); ej[j] = eps
            H[i,j] = (<span class="fn">loss</span>(w+ei+ej) - <span class="fn">loss</span>(w+ei-ej) - <span class="fn">loss</span>(w-ei+ej) + <span class="fn">loss</span>(w-ei-ej)) / (<span class="num">4</span>*eps*eps)
    <span class="kw">return</span> (H + H.T) / <span class="num">2</span>

<span class="cm"># 20 rastgele ağırlık vektörü örnekle, Hessian özdeğerlerini kontrol et</span>
min_eigs = []
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    w = rng.<span class="fn">standard_normal</span>(d) * <span class="num">0.5</span>
    H = <span class="fn">hessian</span>(w)
    min_eigs.<span class="fn">append</span>(np.linalg.<span class="fn">eigvalsh</span>(H).<span class="fn">min</span>())

min_eigs = np.<span class="fn">array</span>(min_eigs)
<span class="fn">print</span>(f<span class="str">"20 rastgele nokta üzerinde en küçük Hessian özdeğeri:"</span>)
<span class="fn">print</span>(f<span class="str">"  min:  {min_eigs.min():.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"  mean: {min_eigs.mean():.6f}"</span>)
<span class="fn">print</span>(f<span class="str">"  Hepsi negatif değil mi? {bool((min_eigs &gt;= -1e-6).all())}  &lt;- konvekslik onaylandı"</span>)
</code></pre></div>

<p class="l-text">Tüm özdeğerler teorinin öngördüğü gibi sayısal tolerans dahilinde negatif olmayan çıkıyor. Aynı testi konveks olmayan bir kayıpta dene — diyelim ki <code>loss(w) = (X@w - y)**4 - (X@w - y)**2</code> — fonksiyonun teğetinin altına daldığı noktalarda negatif özdeğerler göreceksin.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Gradient İnişi — Konveks Hedeflerde Yakınsama</h2>
<p class="l-text">$L$-Lipschitz gradientli kısıtsız bir konveks problem $\\min_x f(x)$ için, sade gradient inişi</p>

<div class="katex-block">$$x_{k+1} = x_k - \\frac{1}{L} \\nabla f(x_k)$$</div>

<p class="l-text">$f(x_k) - f^\\star \\leq \\frac{L \\|x_0 - x^\\star\\|^2}{2k}$'yı sağlar. $1/k$'da doğrusal — alt-doğrusal yakınsama. Sub-optimaliteyi yarıya indirmek için iterasyonları iki katına çıkarman gerekir.</p>

<p class="l-text">$f$ ek olarak $\\mu$-güçlü konveks ise (Hessian $\\succeq \\mu I$), hız <strong>doğrusal</strong> olur:</p>

<div class="katex-block">$$f(x_k) - f^\\star \\leq \\left(1 - \\frac{\\mu}{L}\\right)^k \\bigl(f(x_0) - f^\\star\\bigr).$$</div>

<p class="l-text">Oran $\\kappa = L/\\mu$ <strong>koşul sayısı</strong>dır. Her iterasyon boşluğu $1 - 1/\\kappa$ faktörüyle daraltır. İyi koşullu problemler ($\\kappa \\approx 1$) onlarca iterasyonda yakınsar; kötü koşullu problemler ($\\kappa = 10^4$) on binlerce alır. Ön-koşullandırma, Newton yöntemi ve Adam'ın hepsinin var olma sebebi budur — etkin $\\kappa$'yı azaltmayı amaçlarlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Konveks, pürüzsüz</div><div class="card-body">$O(1/k)$ — alt-doğrusal. Yavaş ama garantili.</div></div>
<div class="calc-card"><div class="card-title">Güçlü konveks, pürüzsüz</div><div class="card-body">$O((1 - 1/\\kappa)^k)$ — doğrusal. $\\kappa$ küçük olduğunda hızlı.</div></div>
<div class="calc-card"><div class="card-title">Konveks, pürüzsüz + Nesterov momentum</div><div class="card-body">$O(1/k^2)$ — hızlandırılmış. Birinci-mertebe yöntemler arasında optimal (Nesterov 1983).</div></div>
<div class="calc-card"><div class="card-title">Newton yöntemi</div><div class="card-body">Optimum yakınında kuadratik yakınsama: hatalar her adımda kareye çıkar. Adım başına $O(d^3)$ maliyetli.</div></div>
</div>

<div id="plot-ml7-gdpath-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var xs=[],ys=[];
  for(var i=0;i<=200;i++){var x=-3+6*i/200; xs.push(x); ys.push(0.4*x*x);}
  var conv={x:xs,y:ys,mode:"lines",name:"konveks çukur 0.4x²",line:{color:"#4ade80",width:2.5}};
  var xs2=[],ys2=[];
  for(var i=0;i<=300;i++){var x=-3+6*i/300; xs2.push(x); ys2.push(0.18*x*x + 1.2*Math.sin(2.2*x));}
  var nonc={x:xs2,y:ys2,mode:"lines",name:"konveks değil 0.18x²+1.2sin(2.2x)",line:{color:"#f87171",width:2.5}};
  var gxC=[],gyC=[]; var x=2.6;
  for(var k=0;k<14;k++){gxC.push(x); gyC.push(0.4*x*x); x = x - 0.5*(0.8*x);}
  var pathC={x:gxC,y:gyC,mode:"lines+markers",name:"GD konveks → global min",line:{color:"#4ade80",width:2,dash:"dot"},marker:{size:7,color:"#4ade80",symbol:"circle"}};
  var gxN=[],gyN=[]; var xn=2.6;
  function gradN(x){return 0.36*x + 1.2*2.2*Math.cos(2.2*x);}
  function fN(x){return 0.18*x*x + 1.2*Math.sin(2.2*x);}
  for(var k=0;k<14;k++){gxN.push(xn); gyN.push(fN(xn)); xn = xn - 0.18*gradN(xn);}
  var pathN={x:gxN,y:gyN,mode:"lines+markers",name:"GD non-konveks → yerel min",line:{color:"#f87171",width:2,dash:"dot"},marker:{size:7,color:"#f87171",symbol:"x"}};
  var layout={title:{text:"Gradient inişi: konveks (her zaman global) vs non-konveks (sıkışabilir)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",title:{text:"x",font:{color:"#ebe6dc"}}},yaxis:{gridcolor:"rgba(255,255,255,0.06)",title:{text:"f(x)",font:{color:"#ebe6dc"}},range:[-2.0,4.0]},margin:{t:40,r:20,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.98}};
  Plotly.newPlot("plot-ml7-gdpath-tr",[conv,nonc,pathC,pathN],layout,{responsive:true,displayModeBar:false});
},250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Aynı gradient-inişi algoritması, iki farklı kayıp. Yeşil konveks çukurda her ilklendirme monoton olarak x=0'daki global minimuma yürür. Kırmızı dalgalı non-konveks kayıpta iterasyonlar x≈1.8 yakınındaki yerel minimuma yerleşir — soldaki global minimum yerel bilgiyle görünmez. "Konveks" varsayımının optimizasyon teorisinde neden taşıyıcı olduğunun sebebi tam olarak budur.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Pozitif Ortant Üzerinde Projeksiyonlu Gradient İnişi</h2>
<p class="l-text">Kısıtlı konveks optimizasyon $\\min_{x \\in C} f(x)$'in güzel bir birinci-mertebe yöntemi vardır: bir gradient adımı at, sonra $C$'ye geri projekte et. Projeksiyon kesin olduğu sürece yakınsama hızları kısıtsız durumdan taşınır.</p>

<div class="katex-block">$$x_{k+1} = \\Pi_C\\bigl(x_k - \\eta\\, \\nabla f(x_k)\\bigr)$$</div>

<p class="l-text">Pozitif ortant için projeksiyon sadece kırpma: $\\Pi_{\\mathbb{R}^n_+}(x) = \\max(x, 0)$. Negatif olmayan matris çarpanlarına ayırmanın her adımda yaptığı tam olarak budur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Kısıtlı en küçük kareler: min_{x &gt;= 0} (1/2) ||Ax - b||^2</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
m, n = <span class="num">200</span>, <span class="num">20</span>
A = rng.<span class="fn">standard_normal</span>((m, n))
x_true = np.<span class="fn">maximum</span>(rng.<span class="fn">standard_normal</span>(n), <span class="num">0</span>)
b = A @ x_true + <span class="num">0.05</span> * rng.<span class="fn">standard_normal</span>(m)

<span class="kw">def</span> <span class="fn">f</span>(x):    <span class="kw">return</span> <span class="num">0.5</span> * np.<span class="fn">sum</span>((A @ x - b)**<span class="num">2</span>)
<span class="kw">def</span> <span class="fn">grad</span>(x): <span class="kw">return</span> A.T @ (A @ x - b)

<span class="cm"># Adım boyutu = 1 / A^T A'nın en büyük özdeğeri</span>
L = np.linalg.<span class="fn">eigvalsh</span>(A.T @ A).<span class="fn">max</span>()
eta = <span class="num">1.0</span> / L
<span class="fn">print</span>(f<span class="str">"Lipschitz sabiti L = {L:.2f}, adım boyutu = {eta:.5f}"</span>)

x = np.<span class="fn">zeros</span>(n)
trace = []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>):
    x = np.<span class="fn">maximum</span>(x - eta * <span class="fn">grad</span>(x), <span class="num">0</span>)   <span class="cm"># pozitif ortantta projekte et</span>
    trace.<span class="fn">append</span>(<span class="fn">f</span>(x))

trace = np.<span class="fn">array</span>(trace)
<span class="fn">print</span>(f<span class="str">"\\nIter 0:    f = {f(np.zeros(n)):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Iter 50:   f = {trace[49]:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Iter 500:  f = {trace[-1]:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Tüm x &gt;= 0 mı? {bool((x &gt;= 0).all())}"</span>)
<span class="fn">print</span>(f<span class="str">"x_true'ya karşı yeniden yapılandırma hatası: {np.linalg.norm(x - x_true):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"\\n1/k yakınsama kontrolü: f(x_50)/f(x_500) yaklaşık {trace[49]/trace[-1]:.2f}"</span>)
</code></pre></div>

<p class="l-text">İçselleştirilecek iki gözlem. Birincisi, $x \\geq 0$ kısıtı her adımdan sonra tek bir <code>np.maximum(...,0)</code> ile uygulanır — algoritmanın tamamı budur. İkincisi, sub-optimalite kabaca $1/k$ olarak düşer, konveks teorik hıza tam olarak uyar; $A$'yı güçlü konveks bir matrisle (örn. $A^\\top A + \\mu I$) değiştirseydik, eğri yerine doğrusal olurdu.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. KKT Koşulları — Kısıtlı Optimallik</h2>
<p class="l-text">Kısıtlı bir konveks problem için</p>

<div class="katex-block">$$\\min_x f(x) \\quad \\text{s.t.} \\quad g_i(x) \\leq 0,\\ h_j(x) = 0,$$</div>

<p class="l-text">çarpanlar $\\lambda_i \\geq 0$ ve $\\nu_j$ ile bir $x^\\star$ noktası, ancak ve ancak <strong>KKT koşulları</strong> sağlandığında optimaldir:</p>

<div class="katex-block">$$\\begin{aligned}
&amp;\\nabla f(x^\\star) + \\sum_i \\lambda_i \\nabla g_i(x^\\star) + \\sum_j \\nu_j \\nabla h_j(x^\\star) = 0 \\quad \\text{(stationarity)} \\\\
&amp;g_i(x^\\star) \\leq 0,\\quad h_j(x^\\star) = 0 \\quad \\text{(primal feasibility)} \\\\
&amp;\\lambda_i \\geq 0 \\quad \\text{(dual feasibility)} \\\\
&amp;\\lambda_i \\, g_i(x^\\star) = 0 \\quad \\text{(complementary slackness)}
\\end{aligned}$$</div>

<p class="l-text">Slater noktası olan konveks problemler için KKT gerekli ve yeterlidir. Tamamlayıcı gevşeklik satırı pratikte en faydalısıdır: ya bir kısıt <em>aktif</em>tir (bağlayıcı, $g_i=0$) ve çarpanı $\\lambda_i$ pozitif olabilir, ya da <em>inaktif</em>tir ($g_i &lt; 0$) ve çarpanı sıfır olmalıdır. Aktif-küme yöntemleri bunu doğrudan sömürür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize

<span class="cm"># min  x1^2 + x2^2</span>
<span class="cm"># s.t. x1 + x2 = 1            (eşitlik)</span>
<span class="cm">#      x1 &gt;= 0, x2 &gt;= 0       (eşitsizlikler)</span>
<span class="cm"># Analitik çözüm: x1 = x2 = 1/2, lambda=0 (eşitsizlikler inaktif), nu=1</span>
<span class="kw">def</span> <span class="fn">f</span>(x):     <span class="kw">return</span> x[<span class="num">0</span>]**<span class="num">2</span> + x[<span class="num">1</span>]**<span class="num">2</span>
<span class="kw">def</span> <span class="fn">grad</span>(x):  <span class="kw">return</span> np.<span class="fn">array</span>([<span class="num">2</span>*x[<span class="num">0</span>], <span class="num">2</span>*x[<span class="num">1</span>]])

cons = [{<span class="str">"type"</span>:<span class="str">"eq"</span>,   <span class="str">"fun"</span>: <span class="kw">lambda</span> x: x[<span class="num">0</span>] + x[<span class="num">1</span>] - <span class="num">1</span>, <span class="str">"jac"</span>: <span class="kw">lambda</span> x: np.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">1.0</span>])}]
bnds = [(<span class="num">0</span>, <span class="kw">None</span>), (<span class="num">0</span>, <span class="kw">None</span>)]

res = <span class="fn">minimize</span>(f, x0=np.<span class="fn">array</span>([<span class="num">0.1</span>, <span class="num">0.9</span>]), jac=grad,
               method=<span class="str">"SLSQP"</span>, bounds=bnds, constraints=cons,
               options={<span class="str">"ftol"</span>:<span class="num">1e-12</span>})
x_star = res.x
<span class="fn">print</span>(f<span class="str">"Optimal x* = {x_star}"</span>)
<span class="fn">print</span>(f<span class="str">"f(x*) = {res.fun:.6f}     (beklenen 0.5)"</span>)
<span class="fn">print</span>(f<span class="str">"Kısıt x1+x2-1 = {x_star.sum() - 1:.2e}   (~0 olmalı)"</span>)
<span class="fn">print</span>(f<span class="str">"Her ikisi de x_i &gt; 0 mı? {bool((x_star &gt; 0).all())}  =&gt; eşitsizlik kısıtları inaktif (lambda=0)"</span>)

<span class="cm"># Stationerlik kontrolü: grad f + nu * grad h = 0</span>
<span class="cm"># grad h = (1,1), bu yüzden nu = -grad f[i]; her iki bileşen aynı nu vermeli</span>
g = <span class="fn">grad</span>(x_star)
<span class="fn">print</span>(f<span class="str">"\\nStationerlik kontrolü: grad f(x*) = {g}"</span>)
<span class="fn">print</span>(f<span class="str">"İmgelenen nu (eşitlik için Lagrange çarpanı): -g[0] = {-g[0]:.4f}, -g[1] = {-g[1]:.4f}  (eşleşmeli)"</span>)
</code></pre></div>

<p class="l-text">SLSQP $x^\\star = (1/2, 1/2)$'yi bulur, eşitsizlikler inaktiftir (bu yüzden KKT çarpanları sıfırdır) ve eşitlik çarpanı $\\nu$ stationerlikten $-1$ çıkar. Bu, KKT koşullarının her satırını çalıştıran en küçük önemsiz olmayan örnektir — kopyala, $f$ ve kısıtları değiştir ve masandaki herhangi bir kısıtlı konveks problemi doğrulayabilirsin.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Konveksliğin Bittiği Yer</h2>
<p class="l-text">"Bu kayıplar konveks mi?" sorusunun kısa bir turu — kutlamak veya endişelenmek arasında karar veren soru.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Konveks (global garantilerin var)</div><div class="card-body">Doğrusal regresyon, ridge, lasso (yumuşatma sonrası veya alt-gradientler aracılığıyla), lojistik regresyon, SVM hinge kaybı, Poisson regresyonu, doğrusal özelliklerle max-entropi / softmax, LP / QP / SOCP / SDP.</div></div>
<div class="calc-card"><div class="card-title">Bazı değişkenlerde konveks, ortak değil</div><div class="card-body">Matris çarpanlarına ayırma $\\min_{U,V} \\|UV^\\top - X\\|^2$ — sabit $V$ için $U$'da konveks ve tersi. Alternatif minimizasyon çalışır ama global garanti yok.</div></div>
<div class="calc-card"><div class="card-title">Konveks olmayan ama iyi davranan</div><div class="card-body">Derin ağlar (aşırı parametreli rejim), k-means, EM ile Gauss karışımları. Global garanti yok, ama yerel minimumlar genellikle ampirik olarak "yeterince iyi"dir.</div></div>
<div class="calc-card"><div class="card-title">Sert konveks olmayan</div><div class="card-body">Kombinatoryal / ayrık kayıplar (0-1 kayıp, gevşetme olmadan ayrık gizlilerle max-likelihood), pekiştirmeli öğrenme değer optimizasyonu, iki-seviyeli problemler. Yaklaşımlar veya buluşsallar gerekir.</div></div>
</div>

<div class="calc-highlight"><strong>Pratik buluşsal:</strong> kaybın yalnızca $w$'nin (doğrusal olmayan gizli katmanlar üzerinden bağlantılı değil) konveks fonksiyonlarının bir toplamı / max'ı / bileşimi ise, muhtemelen konvekstir. Doğrusal olmayan aktivasyonlu bir gizli katman eklediğin an, tüm bahisler boştur.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradaki</h2>
<p class="l-text">Konveks optimizasyon alanın iyi anlaşılan köşesidir: konvekslik = sahte yerel minimumlar yok, gradient inişi bilinen hızlarda yakınsar ve KKT koşulları kısıtlı optimumların tam karakterizasyonunu verir. Konveksliği kazanman gerek (kayıp konveks parçalardan inşa edilmeli, kısıtlar konveks kümeler olmalı), ama elde ettiğinde araçlar belirleyicidir — ve klasik istatistik ve sinyal işlemenin çoğu buna sahiptir.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Doğru parçaları içeride kalıyorsa küme konvekstir; kirişler grafiğin üzerinde uzanıyorsa fonksiyon konvekstir.</li>
<li>İki kez türevlenebilir konveks ⇔ Hessian her yerde PSD'dir. Bu, <code>np.linalg.eigvalsh</code> ile çalıştırabileceğin testtir.</li>
<li>Jensen: $f(\\mathbb{E}[X]) \\leq \\mathbb{E}[f(X)]$. ELBO, JS ıraksaklığı ve çoğu yoğunlaşma eşitsizliğinin arkasında.</li>
<li>Yakınsama: konveks pürüzsüz $O(1/k)$, güçlü konveks doğrusal, Nesterov hızlandırılmış $O(1/k^2)$, Newton kuadratik.</li>
<li>Projeksiyonlu GD: gradient adımı, sonra $\\Pi_C(\\cdot)$. Pozitif ortant için projeksiyon = kırpma.</li>
<li>KKT: stationerlik + primal uygunluk + dual uygunluk + tamamlayıcı gevşeklik. Slater altında gerekli ve yeterli.</li>
<li>Gerçek ML'de konveks: doğrusal / lojistik / ridge / lasso / SVM / max-ent. Konveks değil: derin ağlar, karışımlar, k-means.</li>
</ul>
</div>

<p class="l-text"><strong>math-L8</strong>'de düz Öklid dünyasını bırakıyor ve <em>manifold</em>lara giriyoruz — küre üzerinde optimizasyon (yönlendirme problemleri), Stiefel manifoldu (PCA / dikkatte ortogonal matrisler) ve pozitif tanımlı matrisler konisi (kovaryans tahmini) için doğru ortam. Sonra <strong>math-L9</strong>'da <em>bilgi geometrisi</em> ile tanışıyoruz, manifoldun bir olasılık dağılımları ailesi olduğu ve metriğin Fisher bilgisi olduğu yer. Birlikte bu üç ders seni "$\\mathbb{R}^n$ üzerinde gradient inişi"nden doğal-gradient yöntemleri ve modern ikinci-mertebe optimize edicilerin temelindeki geometriye götürür.</p>
</div>`
};
