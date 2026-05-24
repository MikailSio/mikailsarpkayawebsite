window.COMPLEX_L3 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This is the lesson where complex analysis becomes wildly different from real analysis.</strong> In L2 we defined complex functions and saw that they behave, on the surface, like maps from the plane to the plane. One could naively expect that "differentiable" should mean roughly what it does for a function of two real variables. It does not. The complex derivative is defined by an innocent-looking limit — but because the limit must give the <em>same answer</em> from every direction in the plane, the resulting condition is so restrictive that the class of complex-differentiable functions is fantastically rigid.</p>

<p class="l-text">Out of that rigidity falls a chain of theorems that have no real-variable analogue: once-differentiable means infinitely-differentiable, every complex-differentiable function equals its Taylor series, a bounded entire function must be constant, every polynomial has a complex root. This lesson sets up the engine — the Cauchy-Riemann equations — and then surveys the surprising landscape that engine produces.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write the complex derivative as a limit and explain why direction-independence is a strong constraint</li>
<li>Derive the Cauchy-Riemann equations from two directional limits and recognise their sufficient form</li>
<li>Test by hand whether common functions (z, z², z̄, |z|², eᶻ) are holomorphic and where</li>
<li>State the holomorphic = analytic equivalence and why it has no analogue for real-valued functions</li>
<li>Show that real and imaginary parts of any holomorphic function satisfy Laplace's equation</li>
<li>Convert Cauchy-Riemann into polar form and apply Liouville's theorem to argue about entire functions</li>
</ul>
</div>

<h2 class="lesson-title">1. The Complex Derivative — Definition</h2>

<div class="calc-highlight"><strong>The definition looks identical to the real case.</strong> Take a complex function f, a point z₀, and ask: as z gets closer and closer to z₀, does the difference quotient settle on a single complex number? If yes, that number is the derivative. The subtlety hides not in the formula but in the word "closer".</div>

<p class="l-text">Formally, let f : Ω → ℂ be a complex function on an open set Ω ⊂ ℂ, and let z₀ ∈ Ω. We say f is <strong>complex-differentiable</strong> at z₀ when the limit below exists:</p>

<div class="calc-formula"><div class="formula-label">THE COMPLEX DERIVATIVE</div><div class="formula-main">$$f'(z_0) \\;=\\; \\lim_{\\Delta z \\to 0} \\frac{f(z_0 + \\Delta z) - f(z_0)}{\\Delta z}$$</div><div class="formula-sub">Δz is a complex number tending to zero from any direction in the plane. The limit must give the same complex number regardless of the path.</div></div>

<p class="l-text">Notice that the symbol Δz is itself a complex number, so "Δz → 0" is a statement about a vanishing two-dimensional displacement, not a one-dimensional one. We can write Δz = Δx + i·Δy and let the pair (Δx, Δy) shrink toward (0, 0). The number of <em>distinct paths</em> to do this is infinite: along the real axis, along the imaginary axis, along any straight line through the origin, along a spiral, and so on. The limit is required to produce one and the same complex number no matter which of these paths is chosen.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f'(z₀)</div><div class="card-body">A single complex number. It carries a magnitude (the local scaling factor) and an argument (the local rotation angle). Both pieces of geometric information come from the same number.</div></div>
<div class="calc-card"><div class="card-title">Δz → 0</div><div class="card-body">A 2-D vanishing displacement, not a 1-D one. The limit must respect every direction of approach simultaneously.</div></div>
<div class="calc-card"><div class="card-title">Same notation</div><div class="card-body">Looks identical to the real derivative. The strength is buried in the dimension — that 2 instead of 1 is what changes everything in the next section.</div></div>
</div>

<div class="l-note"><strong>Comparison to one variable.</strong> A real function f : ℝ → ℝ has only two ways to approach a point: from the left or from the right. The limit only needs to agree on those two. A complex function has uncountably many directions to agree on. The same definition, applied to a higher-dimensional input, demands far more.</div>

<h2 class="lesson-title">2. Why "Any Direction" Is Restrictive</h2>

<div class="calc-highlight"><strong>The hammer falls already on the simplest non-trivial function.</strong> Consider the conjugation map f(z) = z̄ = x − iy. As a map ℝ² → ℝ² it is perfectly smooth — it is just a reflection across the real axis. Yet, we will see in one calculation that it is <em>nowhere</em> complex-differentiable. Two paths give two different answers, and that is enough to kill the limit forever.</div>

<p class="l-text">Pick z₀ = 0 for cleanness and let Δz approach 0 along two different directions:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Approach along the real axis: Δz = Δx ∈ ℝ</div><div class="step-detail">Then Δz̄ = Δx. The quotient becomes (Δz̄ − 0) / Δz = Δx / Δx = 1. So the limit along the real axis is +1.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Approach along the imaginary axis: Δz = i·Δy</div><div class="step-detail">Then Δz̄ = −i·Δy. The quotient becomes (−i·Δy) / (i·Δy) = −1. So the limit along the imaginary axis is −1.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">+1 ≠ −1, hence the limit does not exist</div><div class="step-detail">Different directions give different candidate limits. The complex derivative cannot exist at z = 0. The same argument works at every other z₀, so conjugation is nowhere complex-differentiable.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">CONJUGATION FAILS</div><div class="formula-main">$$\\lim_{\\Delta z \\to 0, \\Delta z \\in \\mathbb{R}} \\frac{\\overline{\\Delta z}}{\\Delta z} = +1 \\qquad \\lim_{\\Delta z \\to 0, \\Delta z \\in i\\mathbb{R}} \\frac{\\overline{\\Delta z}}{\\Delta z} = -1$$</div><div class="formula-sub">Two paths, two answers. The limit cannot heal this contradiction by averaging — it must be unanimous.</div></div>

<p class="l-text">Yet z̄, viewed as a function ℝ² → ℝ² mapping (x, y) ↦ (x, −y), is C^∞ — every partial derivative of every order exists and is continuous. So smoothness in the real-analytic sense is <em>not enough</em>. Complex differentiability asks for something genuinely more — a coupling between the way u depends on (x, y) and the way v depends on (x, y). The next section pins down exactly what that coupling is.</p>

<div class="calc-graph"><div id="plot-l3-directions-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a small disk around the origin with several straight approach paths drawn in different colours. For a complex-differentiable function the difference-quotient limit must take the same complex value along every one of these arrows. For f(z) = z̄, the path along +x gives +1 and the path along +iy gives −1 — the very first inconsistency kills differentiability.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var circ_x=[],circ_y=[];
for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;circ_x.push(0.9*Math.cos(th));circ_y.push(0.9*Math.sin(th));}
var disk={x:circ_x,y:circ_y,mode:'lines',name:'|z|=0.9',line:{color:'rgba(156,163,175,0.6)',width:1.5,dash:'dot'},showlegend:false};
var dirs=[];var colors=['#3b82f6','#f59e0b','#10b981','#ef4444','#a78bfa','#06b6d4'];var angles=[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,5*Math.PI/4];
for(var k=0;k<angles.length;k++){var a=angles[k];dirs.push({x:[0,0.85*Math.cos(a)],y:[0,0.85*Math.sin(a)],mode:'lines+markers',name:'θ='+a.toFixed(2),line:{color:colors[k%colors.length],width:2.4},marker:{size:[2,8],color:colors[k%colors.length]}});}
var origin={x:[0],y:[0],mode:'markers',name:'z₀=0',marker:{size:10,color:'#ffffff',symbol:'x'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(Δz)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.1,1.1],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(Δz)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.1,1.1]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l3-directions-en',[disk,origin].concat(dirs),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Convince yourself: if the limit along Δz = Δx and the limit along Δz = i·Δy disagree, no third path can rescue the situation, because "the limit exists" by definition requires every path to converge to one common value. One pair of disagreeing directions is a death sentence.</div></div>

<h2 class="lesson-title">3. Deriving the Cauchy-Riemann Equations</h2>

<div class="calc-highlight"><strong>If complex differentiability holds, the same trick we just used must give the same answer.</strong> We computed the derivative along the real axis and along the imaginary axis for z̄ and got a contradiction. Now let us do the same calculation symbolically, for a general f, and find out what conditions on f make the two answers agree. Those conditions are the Cauchy-Riemann equations.</div>

<p class="l-text">Write f as a complex-valued function of two real variables:</p>

<div class="calc-formula"><div class="formula-label">DECOMPOSITION INTO REAL AND IMAGINARY PARTS</div><div class="formula-main">$$f(z) \\;=\\; u(x, y) \\;+\\; i \\, v(x, y), \\quad z = x + iy$$</div><div class="formula-sub">u is the real part, v is the imaginary part. Both are real-valued functions of (x, y).</div></div>

<p class="l-text">Suppose f is complex-differentiable at z₀ = x₀ + i y₀. We will compute the limit defining f'(z₀) along two specific paths and force the answers to agree.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Path 1: Δz = Δx along the real axis</div><div class="step-detail">f(z₀ + Δx) − f(z₀) = [u(x₀+Δx, y₀) − u(x₀, y₀)] + i [v(x₀+Δx, y₀) − v(x₀, y₀)]. Divide by Δx and let Δx → 0: the limit is ∂u/∂x + i ∂v/∂x, evaluated at (x₀, y₀).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Path 2: Δz = i·Δy along the imaginary axis</div><div class="step-detail">f(z₀ + i·Δy) − f(z₀) = [u(x₀, y₀+Δy) − u(x₀, y₀)] + i [v(x₀, y₀+Δy) − v(x₀, y₀)]. Divide by i·Δy = (Δy)/i⁻¹ = −i·Δy / 1... let us be careful: 1/(i·Δy) = −i/Δy. So the quotient is −i [Δu]/Δy + [Δv]/Δy. As Δy → 0 this becomes ∂v/∂y − i ∂u/∂y.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Set the two answers equal</div><div class="step-detail">∂u/∂x + i ∂v/∂x = ∂v/∂y − i ∂u/∂y. Match real parts and imaginary parts separately: ∂u/∂x = ∂v/∂y AND ∂v/∂x = −∂u/∂y.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">CAUCHY-RIEMANN EQUATIONS</div><div class="formula-main">$$\\frac{\\partial u}{\\partial x} \\;=\\; \\frac{\\partial v}{\\partial y}, \\qquad \\frac{\\partial u}{\\partial y} \\;=\\; -\\frac{\\partial v}{\\partial x}$$</div><div class="formula-sub">Necessary conditions on (u, v) for f = u + i v to be complex-differentiable at a point.</div></div>

<p class="l-text">Two coupled partial differential equations. They are the cleanest statement of how restrictive complex differentiability actually is. They couple u and v: you cannot change one without recomputing the other to keep the system satisfied. Real-variable smoothness imposes no such coupling — u_x can be anything you like, independent of v_y. In complex analysis they must be twin siblings.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">First CR equation</div><div class="card-body">u_x = v_y. The horizontal stretching of u equals the vertical stretching of v.</div><div class="card-formula">u_x = v_y</div></div>
<div class="calc-card"><div class="card-title">Second CR equation</div><div class="card-body">u_y = −v_x. The vertical change of u is the negative of the horizontal change of v.</div><div class="card-formula">u_y = −v_x</div></div>
<div class="calc-card"><div class="card-title">Together</div><div class="card-body">They encode that the Jacobian of (u, v) is a "complex-multiplication" matrix: a rotation times a scaling, never an arbitrary 2×2 matrix.</div><div class="card-formula">J = sR_θ</div></div>
</div>

<div class="l-note"><strong>The Jacobian view.</strong> The Jacobian of f viewed as a real map (x, y) ↦ (u, v) is the 2×2 matrix [[u_x, u_y], [v_x, v_y]]. The Cauchy-Riemann equations say this matrix has the special form [[a, −b], [b, a]]. Such matrices represent multiplication by the complex number a + i b — equivalently, a rotation by arctan(b/a) followed by a uniform scaling by √(a² + b²). So Cauchy-Riemann is exactly the algebraic condition that the local linearisation of f is a complex multiplication. We unpack the geometric consequences (angle preservation) in section 11.</div>

<h2 class="lesson-title">4. Sufficient Conditions and Terminology</h2>

<p class="l-text">The derivation above showed that Cauchy-Riemann is <em>necessary</em>. The converse takes a small extra hypothesis but is also true.</p>

<div class="calc-formula"><div class="formula-label">SUFFICIENT CONDITION (LOOMAN-MENCHOFF, STANDARD VERSION)</div><div class="formula-main">$$\\text{If } u, v \\in C^1(\\Omega) \\text{ and satisfy CR on } \\Omega \\text{ then } f = u + iv \\text{ is holomorphic on } \\Omega.$$</div><div class="formula-sub">Continuously differentiable u and v plus the CR equations is enough to deduce complex differentiability — no extra path-by-path checking required.</div></div>

<p class="l-text">So in practice, the two-line check "are u and v continuously differentiable, and do they satisfy the CR equations?" completely answers whether f is complex-differentiable on Ω.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Holomorphic</div><div class="card-body">Complex-differentiable at every point of an open set. The standard adjective in complex analysis — used interchangeably with "complex-differentiable" by working analysts.</div></div>
<div class="calc-card"><div class="card-title">Analytic</div><div class="card-body">Equal to a convergent power series in a neighbourhood of every point. Historically a stronger condition; section 6 will reveal that for complex functions, holomorphic = analytic.</div></div>
<div class="calc-card"><div class="card-title">Entire</div><div class="card-body">Holomorphic on all of ℂ. Examples: every polynomial, eᶻ, sin z, cos z. Liouville's theorem will surprise us about how rigid this class is.</div></div>
<div class="calc-card"><div class="card-title">Meromorphic</div><div class="card-body">Holomorphic except for isolated poles. Examples: 1/z, tan z, every rational function. We meet poles formally in L4-L5.</div></div>
</div>

<div class="l-note"><strong>Two-line working procedure.</strong> Given f(z) = u(x, y) + i v(x, y): (1) compute u_x, u_y, v_x, v_y. (2) Check whether u_x = v_y and u_y = −v_x. If yes on an open set, f is holomorphic there. If the equations fail anywhere, f is not holomorphic at those points. Done.</div>

<h2 class="lesson-title">5. Worked Examples</h2>

<p class="l-text">Apply the recipe to the four most instructive cases.</p>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — f(z) = z²</div><div class="example-body">z² = (x + iy)² = x² + 2ixy + (iy)² = (x² − y²) + i(2xy). So u = x² − y², v = 2xy.<br><br>u_x = 2x, u_y = −2y, v_x = 2y, v_y = 2x.<br><br>Check: u_x = 2x = v_y ✓ and u_y = −2y = −v_x ✓. CR satisfied everywhere. <strong>z² is holomorphic on all of ℂ (entire), and f'(z) = u_x + i v_x = 2x + 2iy = 2z.</strong></div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — f(z) = z̄</div><div class="example-body">z̄ = x − iy. So u = x, v = −y.<br><br>u_x = 1, u_y = 0, v_x = 0, v_y = −1.<br><br>Check: u_x = 1 vs v_y = −1. Fails everywhere. <strong>z̄ is nowhere holomorphic</strong>, confirming the direct path argument from section 2.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — f(z) = |z|² = z·z̄</div><div class="example-body">|z|² = x² + y². So u = x² + y², v = 0.<br><br>u_x = 2x, u_y = 2y, v_x = 0, v_y = 0.<br><br>Check: u_x = 2x = v_y = 0 requires x = 0. u_y = 2y = −v_x = 0 requires y = 0. Both fail unless (x, y) = (0, 0). <strong>|z|² is complex-differentiable only at z = 0</strong>, but not holomorphic anywhere, because it is not differentiable on any open neighbourhood of 0.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — f(z) = eᶻ</div><div class="example-body">eᶻ = e^x · e^(iy) = e^x · (cos y + i sin y). So u = e^x cos y, v = e^x sin y.<br><br>u_x = e^x cos y, u_y = −e^x sin y, v_x = e^x sin y, v_y = e^x cos y.<br><br>Check: u_x = e^x cos y = v_y ✓ and u_y = −e^x sin y = −v_x ✓. CR satisfied everywhere. <strong>eᶻ is entire, with f'(z) = e^x cos y + i e^x sin y = eᶻ — the complex exponential is its own derivative, exactly like the real one.</strong></div></div>

<div class="calc-graph"><div id="plot-l3-cr-heat-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this heatmap shows:</strong> the maximum CR violation max(|u_x − v_y|, |u_y + v_x|) on the disk |z| ≤ 1, computed numerically for f(z) = z² (left half-grid) and f(z) = z̄ (right half-grid, conceptually overlaid as a comparison label). For z² the violation is essentially zero up to floating-point noise — the function is holomorphic. For z̄ the violation is a constant 2 everywhere — never holomorphic.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=41;var xs=[],ys=[];var zsq=[];var zbar=[];
for(var i=0;i<N;i++){xs.push(-1+2*i/(N-1));ys.push(-1+2*i/(N-1));}
for(var j=0;j<N;j++){var row1=[];var row2=[];for(var i=0;i<N;i++){var x=xs[i];var y=ys[j];var u1=x*x-y*y;var v1=2*x*y;var ux=2*x,uy=-2*y,vx=2*y,vy=2*x;var e1=Math.max(Math.abs(ux-vy),Math.abs(uy+vx));row1.push(e1);var u2=x;var v2=-y;var ux2=1,uy2=0,vx2=0,vy2=-1;var e2=Math.max(Math.abs(ux2-vy2),Math.abs(uy2+vx2));row2.push(e2);}zsq.push(row1);zbar.push(row2);}
var h1={z:zsq,x:xs,y:ys,type:'heatmap',name:'f(z)=z² violation',colorscale:[[0,'#0a3b6e'],[0.5,'#3b82f6'],[1,'#fef3c7']],showscale:true,colorbar:{title:'max CR violation',x:0.45,len:0.8}};
var h2={z:zbar,x:xs,y:ys,type:'heatmap',name:'f(z)=z̄ violation',colorscale:[[0,'#0a3b6e'],[0.5,'#ef4444'],[1,'#fef3c7']],showscale:true,xaxis:'x2',yaxis:'y2',colorbar:{title:'max CR violation',x:1.0,len:0.8}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'x (f=z²)',gridcolor:'rgba(255,255,255,0.07)',domain:[0,0.42]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)'},xaxis2:{title:'x (f=z̄)',gridcolor:'rgba(255,255,255,0.07)',domain:[0.55,1]},yaxis2:{title:'y',gridcolor:'rgba(255,255,255,0.07)',anchor:'x2'},margin:{t:40,r:30,b:50,l:55},showlegend:false};
Plotly.newPlot('plot-l3-cr-heat-en',[h1,h2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Which of these is holomorphic on all of ℂ: (a) Re(z), (b) z̄·z = |z|², (c) z³ − 2z + 1, (d) 1/z̄? (Answers: only (c). Re(z) has u=x, v=0, so u_x=1 ≠ v_y=0. (b) computed above. (d) involves z̄ which kills it. Polynomials in z are always entire.)</div></div>

<h2 class="lesson-title">6. Holomorphic = Analytic — A Result With No Real Analogue</h2>

<div class="calc-highlight"><strong>This is one of the strangest theorems in mathematics.</strong> Real functions can be differentiable once and not twice (e.g. f(x) = x²·sign(x) is C¹ but not C²). They can be C^∞ and yet equal to a power series only piecewise (e.g. e^(−1/x²) extended by zero at the origin — smooth everywhere, but its Taylor series at 0 is identically zero and disagrees with the function). In ℂ no such thing can happen.</div>

<div class="calc-formula"><div class="formula-label">EQUIVALENCE OF HOLOMORPHIC AND ANALYTIC</div><div class="formula-main">$$f \\text{ holomorphic on } \\Omega \\;\\Longleftrightarrow\\; f \\text{ equals its Taylor series in a neighbourhood of every point of } \\Omega$$</div><div class="formula-sub">If a complex function has even one complex derivative on an open set, then it has infinitely many, and the Taylor series converges to the function locally everywhere.</div></div>

<p class="l-text">The forward direction is the deep theorem (Cauchy's integral formula and the resulting Cauchy estimates make this go through; we will see the integral side of the story in L4-L5). The reverse direction is immediate — a convergent power series is differentiable term by term inside its disc of convergence.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">In ℝ: differentiable ≠ analytic</div><div class="card-body">There exist smooth functions whose Taylor series converge but to the wrong value, or diverge entirely. Real differentiability is a local condition that does not control function values far away.</div></div>
<div class="calc-card"><div class="card-title">In ℂ: differentiable = analytic</div><div class="card-body">Even a single complex derivative forces infinite differentiability and analytic representability. The class collapses: there is no gap between "smooth" and "given by a series".</div></div>
<div class="calc-card"><div class="card-title">Identity from local data</div><div class="card-body">Because every holomorphic function is analytic, knowing its values on a tiny disk determines it uniquely on the whole connected domain. This is the famous identity (or "rigidity") theorem.</div></div>
</div>

<div class="l-note"><strong>Practical consequence (rigidity).</strong> Two holomorphic functions that agree on a set with an accumulation point inside a connected open set must agree everywhere. There is no analogue in real analysis. This is why holomorphic functions are sometimes described as "frozen" — there is shockingly little freedom in how they can behave.</div>

<h2 class="lesson-title">7. Harmonic Functions Are Real Parts of Holomorphic</h2>

<div class="calc-highlight"><strong>The bridge to potential theory.</strong> Take any holomorphic f = u + i v. Differentiate the Cauchy-Riemann equations once more. The result will be that both u and v satisfy Laplace's equation — they are <em>harmonic</em>. This single fact is the reason complex analysis is the natural language for electrostatics in 2-D, for ideal fluid flow, for steady-state heat distribution, and for the partial differential equations behind physics-informed neural networks.</div>

<p class="l-text">Start from the CR equations and differentiate the first one with respect to x and the second with respect to y:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Differentiate u_x = v_y with respect to x</div><div class="step-detail">u_xx = v_yx.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Differentiate u_y = −v_x with respect to y</div><div class="step-detail">u_yy = −v_xy.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Add the two and use equality of mixed partials</div><div class="step-detail">u_xx + u_yy = v_yx − v_xy = 0, since v_xy = v_yx for sufficiently smooth v (which holomorphicity guarantees by section 6).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Same argument for v</div><div class="step-detail">Differentiate u_x = v_y with respect to y and u_y = −v_x with respect to x: subtracting gives v_xx + v_yy = 0.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">LAPLACE'S EQUATION FOR REAL AND IMAGINARY PARTS</div><div class="formula-main">$$u_{xx} + u_{yy} \\;=\\; 0, \\qquad v_{xx} + v_{yy} \\;=\\; 0$$</div><div class="formula-sub">Every real (resp. imaginary) part of a holomorphic function satisfies Laplace's equation. Such functions are called harmonic.</div></div>

<p class="l-text">Conversely, given any harmonic u on a simply-connected open set, one can construct a harmonic conjugate v (unique up to an additive constant) such that f = u + i v is holomorphic. So harmonic functions and holomorphic functions are two faces of the same object — the "real part" of complex analysis.</p>

<div class="calc-graph"><div id="plot-l3-harmonic-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this surface shows:</strong> the harmonic function u(x, y) = x² − y², which is the real part of f(z) = z². It is the textbook example of a "saddle" — strictly positive along the x-axis, strictly negative along the y-axis, zero only on the diagonals y = ±x. You can verify visually that the function curves upward in one direction and downward in the perpendicular direction by the same amount; that exact cancellation is Laplace's equation u_xx + u_yy = 2 + (−2) = 0.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=40;var xs=[],ys=[];var zs=[];
for(var i=0;i<N;i++){xs.push(-2+4*i/(N-1));ys.push(-2+4*i/(N-1));}
for(var j=0;j<N;j++){var row=[];for(var i=0;i<N;i++){row.push(xs[i]*xs[i]-ys[j]*ys[j]);}zs.push(row);}
var surf={type:'surface',x:xs,y:ys,z:zs,colorscale:[[0,'#1e3a8a'],[0.5,'#3b82f6'],[1,'#fef3c7']],showscale:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},yaxis:{title:'y',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},zaxis:{title:'u = x²−y²',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},camera:{eye:{x:1.6,y:1.6,z:1.2}}},margin:{t:20,r:0,b:0,l:0}};
Plotly.newPlot('plot-l3-harmonic-en',[surf],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l3-conjugates-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What these two contour plots show:</strong> a harmonic conjugate pair for f(z) = z². On the left, u(x, y) = x² − y² (the saddle). On the right, v(x, y) = 2xy (the hyperbolic xy-product, also a saddle, rotated by 45°). Their level curves are mutually orthogonal at every intersection — that orthogonality is exactly the CR equations in action, since the gradients (u_x, u_y) and (v_x, v_y) satisfy ∇u · ∇v = u_x v_x + u_y v_y = u_x (−u_y) + u_y u_x = 0 by CR.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=60;var xs=[],ys=[];var u=[],v=[];
for(var i=0;i<N;i++){xs.push(-2+4*i/(N-1));ys.push(-2+4*i/(N-1));}
for(var j=0;j<N;j++){var ru=[],rv=[];for(var i=0;i<N;i++){ru.push(xs[i]*xs[i]-ys[j]*ys[j]);rv.push(2*xs[i]*ys[j]);}u.push(ru);v.push(rv);}
var cu={type:'contour',x:xs,y:ys,z:u,colorscale:[[0,'#1e3a8a'],[0.5,'#3b82f6'],[1,'#fef3c7']],contours:{coloring:'heatmap'},showscale:false};
var cv={type:'contour',x:xs,y:ys,z:v,colorscale:[[0,'#7c1d6f'],[0.5,'#a78bfa'],[1,'#fef3c7']],contours:{coloring:'heatmap'},xaxis:'x2',yaxis:'y2',showscale:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'x — u = x²−y²',gridcolor:'rgba(255,255,255,0.07)',domain:[0,0.45]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',scaleanchor:'x',scaleratio:1},xaxis2:{title:'x — v = 2xy',gridcolor:'rgba(255,255,255,0.07)',domain:[0.55,1]},yaxis2:{title:'y',gridcolor:'rgba(255,255,255,0.07)',anchor:'x2',scaleanchor:'x2',scaleratio:1},margin:{t:30,r:30,b:50,l:55},showlegend:false};
Plotly.newPlot('plot-l3-conjugates-en',[cu,cv],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Recovering v from u.</strong> If u is harmonic on a simply-connected domain, the conjugate v is determined up to a constant by ∂v/∂x = −u_y and ∂v/∂y = u_x. Integrate the first with respect to x, differentiate the result with respect to y, force agreement with u_x. The procedure always succeeds on a simply-connected domain.</div>

<h2 class="lesson-title">8. Cauchy-Riemann in Polar Form</h2>

<p class="l-text">Many natural complex functions (z^n, log z, z^α) are far simpler in polar coordinates z = r e^(iθ) than in Cartesian. The Cauchy-Riemann equations in polar form let us work directly there without translating back to (x, y).</p>

<div class="calc-formula"><div class="formula-label">CAUCHY-RIEMANN IN POLAR FORM</div><div class="formula-main">$$\\frac{\\partial u}{\\partial r} \\;=\\; \\frac{1}{r} \\, \\frac{\\partial v}{\\partial \\theta}, \\qquad \\frac{1}{r} \\, \\frac{\\partial u}{\\partial \\theta} \\;=\\; -\\frac{\\partial v}{\\partial r}$$</div><div class="formula-sub">Valid for r > 0. The factor 1/r is the Jacobian correction switching between (x, y) and (r, θ).</div></div>

<p class="l-text"><strong>Derivation sketch.</strong> Using x = r cos θ, y = r sin θ, the chain rule gives ∂/∂x = cos θ · ∂/∂r − (sin θ / r) · ∂/∂θ and ∂/∂y = sin θ · ∂/∂r + (cos θ / r) · ∂/∂θ. Substitute into the Cartesian CR equations, multiply by the appropriate combinations of sin θ and cos θ, and the polar versions drop out after a paragraph of algebra.</p>

<div class="calc-example"><div class="example-label">EXAMPLE — log z in polar form</div><div class="example-body">log z = log(r e^(iθ)) = log r + i θ (for a chosen branch). So u = log r, v = θ.<br><br>u_r = 1/r, u_θ = 0, v_r = 0, v_θ = 1.<br><br>Polar CR: u_r = 1/r = (1/r)·v_θ ✓. (1/r)·u_θ = 0 = −v_r ✓. So log z is holomorphic on any simply-connected region avoiding the branch cut, with derivative 1/z. The polar form delivers this verification in three lines.</div></div>

<div class="calc-graph"><div id="plot-l3-polar-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the polar grid r = const (concentric circles, blue) and θ = const (radial rays, gold) on a unit disk centred at the origin. For a holomorphic f written in polar coordinates, these two families are the natural coordinate lines along which the polar CR equations are written. The picture is here to anchor the algebra in a concrete coordinate mesh.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
for(var k=1;k<=4;k++){var rr=k/4;var cx=[],cy=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;cx.push(rr*Math.cos(th));cy.push(rr*Math.sin(th));}traces.push({x:cx,y:cy,mode:'lines',name:'r='+rr.toFixed(2),line:{color:'#3b82f6',width:1.6},showlegend:(k===1)});}
for(var m=0;m<12;m++){var th=2*Math.PI*m/12;traces.push({x:[0,Math.cos(th)],y:[0,Math.sin(th)],mode:'lines',name:'θ='+(360*m/12).toFixed(0)+'°',line:{color:'#f59e0b',width:1.4},showlegend:(m===0)});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.2,1.2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.2,1.2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-polar-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Singularities — A Brief Preview</h2>

<p class="l-text">Points where f fails to be holomorphic are called <strong>singularities</strong>. A full classification waits for L4-L5, where the Laurent series gives us the right language. For now, the three types you should know by name:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Removable singularity</div><div class="card-body">f is undefined at a point but the limit exists and is finite — once you fill in the value, f becomes holomorphic. Canonical example: sin(z)/z at z = 0, which has limit 1 there.</div></div>
<div class="calc-card"><div class="card-title">Pole of order k</div><div class="card-body">Near the bad point a, f looks like c / (z − a)^k for some integer k ≥ 1 and constant c. Example: 1/(z − a)^k itself. The function blows up to ∞ at a no matter how you approach.</div></div>
<div class="calc-card"><div class="card-title">Essential singularity</div><div class="card-body">Neither removable nor a pole. The function behaves wildly — Picard's theorem says it takes every complex value (with at most one exception) infinitely often in every neighbourhood. Example: e^(1/z) at z = 0.</div></div>
</div>

<div class="l-note"><strong>Why this matters now.</strong> A function like 1/z fails to be holomorphic at z = 0, but it satisfies the Cauchy-Riemann equations on ℂ \\ {0}. The CR equations are pointwise; they say nothing about the global topology of the domain. Singularities live "outside the CR check" — they are the places we excise from Ω, and the integrals around them are where the Cauchy residue theorem (L5) becomes spectacular.</div>

<h2 class="lesson-title">10. Liouville's Theorem — The Payoff</h2>

<div class="calc-highlight"><strong>One theorem to make the whole subject feel alive.</strong> A bounded entire function must be constant. There is no analogue in real analysis: sin x is bounded by 1 and certainly not constant; cos x, the Gaussian e^(−x²), the sigmoid 1/(1 + e^(−x)) are all bounded smooth real functions that are not constant. In ℂ the situation is shockingly different.</div>

<div class="calc-formula"><div class="formula-label">LIOUVILLE'S THEOREM</div><div class="formula-main">$$f : \\mathbb{C} \\to \\mathbb{C} \\text{ holomorphic and bounded} \\;\\Longrightarrow\\; f \\text{ is constant.}$$</div><div class="formula-sub">An entire function with |f(z)| ≤ M for all z is just a constant. Holomorphic + global = essentially nothing left to vary.</div></div>

<p class="l-text">We do not prove it here — the proof needs the Cauchy integral formula from L4 — but the punchline is immediate and worth stating: if you stretch holomorphic = analytic far enough, the only way to keep the function from growing without bound is to keep it constant. Anything that grows at all, grows to infinity.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bounded</div><div class="card-body">|f(z)| ≤ M for some single constant M and all z ∈ ℂ. A finite ceiling everywhere.</div></div>
<div class="calc-card"><div class="card-title">Entire</div><div class="card-body">Holomorphic on the whole of ℂ. Polynomials, eᶻ, sin z, cos z qualify; rational functions with any pole do not.</div></div>
<div class="calc-card"><div class="card-title">Constant</div><div class="card-body">f(z) = c for all z. The most rigid possible function. Liouville says: bounded + entire forces this.</div></div>
</div>

<div class="calc-example"><div class="example-label">CONSEQUENCE — FUNDAMENTAL THEOREM OF ALGEBRA</div><div class="example-body">Let p(z) be a non-constant polynomial. Suppose p has no complex root. Then 1/p(z) is well-defined for all z, hence entire. Moreover |p(z)| → ∞ as |z| → ∞ (because p is a polynomial of degree ≥ 1), which forces |1/p(z)| → 0, hence 1/p is bounded. By Liouville, 1/p must be constant — but then p is constant, contradiction. So <strong>every non-constant complex polynomial has at least one complex root.</strong> This is the Fundamental Theorem of Algebra, and the entire proof took one short paragraph because Liouville did the heavy lifting.</div></div>

<div class="l-note"><strong>The deeper moral.</strong> The class of holomorphic functions on ℂ is so rigid that "bounded" is essentially incompatible with "non-trivial". Every interesting entire function (eᶻ, polynomials, sin z, cos z) is unbounded — it has to be. Real-variable intuition fails here because real differentiability is much weaker; complex differentiability is global in nature even though it is defined pointwise.</div>

<h2 class="lesson-title">11. Geometric Meaning — Conformal Maps Preview</h2>

<p class="l-text">The Jacobian view from section 3 gives the geometric interpretation of Cauchy-Riemann. A holomorphic map with non-zero derivative at z₀ acts, infinitesimally, as a rotation by arg f'(z₀) composed with a uniform scaling by |f'(z₀)|. In particular, the angle between any two curves passing through z₀ is preserved by f — such maps are called <strong>conformal</strong>.</p>

<div class="calc-formula"><div class="formula-label">CONFORMALITY</div><div class="formula-main">$$\\text{If } f \\text{ is holomorphic at } z_0 \\text{ and } f'(z_0) \\ne 0, \\text{ then } f \\text{ preserves angles at } z_0.$$</div><div class="formula-sub">Two curves crossing at angle α at z₀ have images crossing at the same angle α at f(z₀).</div></div>

<div class="calc-graph"><div id="plot-l3-conformal-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the left panel is a square grid in the z-plane (lines x = const in blue, y = const in gold). The right panel is its image under f(z) = z². The grid distorts heavily — straight lines become parabolas — but at every <em>intersection</em> point (except the origin, where f'(z) = 2z = 0) the two curves still cross at a right angle. That preserved 90° angle, despite the curving of the lines, is conformality in action and is the direct geometric consequence of the Cauchy-Riemann equations.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];var traces2=[];
var lines=[-1.5,-1,-0.5,0,0.5,1,1.5];
for(var k=0;k<lines.length;k++){var xv=lines[k];var x=[],y=[],ux=[],uy=[];for(var i=0;i<=80;i++){var yy=-1.6+3.2*i/80;x.push(xv);y.push(yy);ux.push(xv*xv-yy*yy);uy.push(2*xv*yy);}traces.push({x:x,y:y,mode:'lines',name:'x='+xv,line:{color:'#3b82f6',width:1.6},showlegend:(k===0)});traces2.push({x:ux,y:uy,mode:'lines',line:{color:'#3b82f6',width:1.6},showlegend:false,xaxis:'x2',yaxis:'y2'});}
for(var k=0;k<lines.length;k++){var yv=lines[k];var x=[],y=[],ux=[],uy=[];for(var i=0;i<=80;i++){var xx=-1.6+3.2*i/80;x.push(xx);y.push(yv);ux.push(xx*xx-yv*yv);uy.push(2*xx*yv);}traces.push({x:x,y:y,mode:'lines',name:'y='+yv,line:{color:'#f59e0b',width:1.6},showlegend:(k===0)});traces2.push({x:ux,y:uy,mode:'lines',line:{color:'#f59e0b',width:1.6},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — input grid',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[-2,2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2,2]},xaxis2:{title:'Re(z²) — image grid',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-4.5,4.5],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(z²)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-4.5,4.5],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-conformal-en',traces.concat(traces2),layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">L6 develops conformal mapping into a full toolkit — Möbius transformations, the Riemann mapping theorem, applications to boundary-value problems. For now, the take-away is the geometric reframing: the Cauchy-Riemann equations are <em>not</em> a strange algebraic accident. They are the algebraic shadow of one clean geometric demand: "preserve angles".</p>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with.</strong> Replace <code>lambda z: z**2</code> with <code>lambda z: 1/z</code> and check that the violation is essentially zero everywhere except near the origin (where 1/z is singular and the finite-difference approximation explodes). Try <code>lambda z: z.conjugate() * z</code> — algebraically the same as |z|², so the violation should be near zero only at the origin. Replace <code>u = xx**2 - yy**2</code> with <code>u = xx**3 - 3*xx*yy**2</code> (the real part of z³) and re-verify Laplace's equation. The Δu computation will again come out to numerical zero — that is the harmonic property of every Re(z^n).</p>

<h2 class="lesson-title">13. Summary — What You Can Now Do</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Complex derivative</div><div class="card-body">A limit that must agree along every direction in the plane. Strictly stronger than real differentiability of (u, v).</div><div class="card-formula">f'(z₀) = lim Δf/Δz</div></div>
<div class="calc-card"><div class="card-title">Cauchy-Riemann</div><div class="card-body">Necessary and (with C¹) sufficient for holomorphicity. Two coupled PDEs on (u, v).</div><div class="card-formula">u_x = v_y, u_y = −v_x</div></div>
<div class="calc-card"><div class="card-title">Holomorphic = analytic</div><div class="card-body">A single complex derivative implies infinite differentiability and a convergent Taylor series. No real analogue.</div><div class="card-formula">C¹(ℂ) = C^ω(ℂ)</div></div>
<div class="calc-card"><div class="card-title">Harmonic real parts</div><div class="card-body">Re f and Im f both satisfy Laplace's equation. Bridge to potential theory and PDEs.</div><div class="card-formula">u_xx + u_yy = 0</div></div>
<div class="calc-card"><div class="card-title">Polar CR</div><div class="card-body">Same content, polar coordinates. Useful for log z, z^α, z^n.</div><div class="card-formula">u_r = v_θ/r, u_θ/r = −v_r</div></div>
<div class="calc-card"><div class="card-title">Liouville</div><div class="card-body">Bounded entire ⇒ constant. Source of the Fundamental Theorem of Algebra and the deep rigidity of holomorphic functions.</div><div class="card-formula">|f| ≤ M, entire ⇒ f = c</div></div>
<div class="calc-card"><div class="card-title">Conformal</div><div class="card-body">Holomorphic + f' ≠ 0 ⇒ angle-preserving. CR equations recast as "Jacobian is a similarity".</div><div class="card-formula">J = |f'(z)| · R_θ</div></div>
</div>

<div class="l-note"><strong>Where this travels next.</strong> L4 introduces complex line integrals and Cauchy's theorem — the integral counterpart to Cauchy-Riemann that supplies the missing proof of holomorphic = analytic. L5 builds Laurent series and the residue calculus, where Liouville and the singularity classification of section 9 fuse into one of the most powerful computational tools in mathematics. L6 returns to conformal mapping in earnest. Harmonic functions reappear in any setting that hosts a 2-D Laplace equation — electrostatics, fluid flow, steady-state heat, and the PDE residuals at the heart of physics-informed neural networks.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu ders, karmaşık analizin gerçel analizden çılgınca farklılaştığı yer.</strong> L2'de karmaşık fonksiyonları tanımlamış ve yüzeyde düzlemden düzleme giden bir resim çizdiklerini görmüştük. İlk bakışta "türevlenebilirlik" iki gerçel değişkenli bir fonksiyonun türevlenebilirliğine yakın bir şey olmalıymış gibi gelir. Değil. Karmaşık türev masum görünen bir limitle tanımlanır — ama limitin düzlemin her yönünden <em>aynı</em> cevabı vermesi gerektiği için ortaya çıkan koşul o kadar dayatıcıdır ki karmaşık türevlenebilir fonksiyonlar sınıfı inanılmaz derecede katıdır.</p>

<p class="l-text">Bu katılıktan, gerçel değişkende karşılığı olmayan bir teoremler zinciri düşer: bir kez türevlenebilir olmak sonsuz kez türevlenebilir olmak demektir, her karmaşık türevlenebilir fonksiyon Taylor serisine eşittir, sınırlı bir tam fonksiyon sabit olmalıdır, her polinomun karmaşık bir kökü vardır. Bu ders motoru — Cauchy-Riemann denklemlerini — kurar ve sonra o motorun ürettiği şaşırtıcı manzarayı gezdirir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Karmaşık türevi bir limit olarak yazmayı ve yön bağımsızlığının neden güçlü bir kısıt olduğunu açıklamayı</li>
<li>İki yönlü limitten Cauchy-Riemann denklemlerini türetmeyi ve yeterli koşul biçimini tanımayı</li>
<li>Yaygın fonksiyonların (z, z², z̄, |z|², eᶻ) elle holomorfluk testlerini ve nerede holomorf olduklarını belirlemeyi</li>
<li>Holomorf = analitik eşdeğerliğini ifade etmeyi ve gerçel değerli fonksiyonlarda neden karşılığı olmadığını anlamayı</li>
<li>Her holomorf fonksiyonun gerçel ve sanal kısımlarının Laplace denklemini sağladığını göstermeyi</li>
<li>Cauchy-Riemann'ı kutupsal forma çevirmeyi ve Liouville teoremini tam fonksiyonlar hakkında akıl yürütmek için kullanmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Karmaşık Türev — Tanım</h2>

<div class="calc-highlight"><strong>Tanım gerçel haline çok benziyor.</strong> Bir karmaşık f fonksiyonu, bir z₀ noktası al ve sor: z, z₀'a daha da yaklaştıkça fark bölümü tek bir karmaşık sayıda kararlı bir şekilde mi oturuyor? Eğer öyleyse, o sayı türevdir. İncelik formülde değil, "yaklaşma" kelimesinde gizli.</div>

<p class="l-text">Resmi olarak, f : Ω → ℂ açık bir Ω ⊂ ℂ kümesi üzerinde tanımlı bir karmaşık fonksiyon, z₀ ∈ Ω ise, f'in z₀'da <strong>karmaşık türevlenebilir</strong> olduğunu söyleriz, ancak ve ancak aşağıdaki limit varsa:</p>

<div class="calc-formula"><div class="formula-label">KARMAŞIK TÜREV</div><div class="formula-main">$$f'(z_0) \\;=\\; \\lim_{\\Delta z \\to 0} \\frac{f(z_0 + \\Delta z) - f(z_0)}{\\Delta z}$$</div><div class="formula-sub">Δz, düzlemde herhangi bir yönden sıfıra giden bir karmaşık sayıdır. Limit, yoldan bağımsız olarak aynı karmaşık sayıyı vermelidir.</div></div>

<p class="l-text">Δz sembolünün kendisinin bir karmaşık sayı olduğuna dikkat et; dolayısıyla "Δz → 0" bir boyutlu değil iki boyutlu bir yer değiştirmenin sıfıra gitmesidir. Δz = Δx + i·Δy yazıp (Δx, Δy) çiftini (0, 0)'a daraltabiliriz. Bunu yapmak için <em>ayırt edici yol</em> sayısı sonsuzdur: gerçel eksen boyunca, sanal eksen boyunca, başlangıçtan geçen herhangi bir doğru boyunca, bir spiral boyunca, vs. Limitin hangi yol seçilirse seçilsin bir ve aynı karmaşık sayıyı vermesi şart koşuluyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">f'(z₀)</div><div class="card-body">Tek bir karmaşık sayı. Bir büyüklük (yerel ölçek faktörü) ve bir argüman (yerel dönme açısı) taşır. Her iki geometrik bilgi aynı sayıdan gelir.</div></div>
<div class="calc-card"><div class="card-title">Δz → 0</div><div class="card-body">Bir boyutlu değil iki boyutlu bir kaybolan yer değiştirme. Limit her yaklaşma yönüne aynı anda saygı göstermelidir.</div></div>
<div class="calc-card"><div class="card-title">Aynı gösterim</div><div class="card-body">Gerçel türeve benziyor. Güç, boyutun içinde gömülü — bir yerine iki olması, bir sonraki bölümde her şeyi değiştirecek olan farktır.</div></div>
</div>

<div class="l-note"><strong>Tek değişken karşılaştırması.</strong> Gerçel bir f : ℝ → ℝ fonksiyonunun bir noktaya iki yoldan yaklaşma şansı vardır: soldan ve sağdan. Limitin yalnızca bu ikisinde uyuşması gerekir. Karmaşık bir fonksiyonun uyuşması gereken sayılamayacak kadar çok yön vardır. Aynı tanım, yüksek boyutlu girdi üzerinde uygulandığında çok daha fazlasını ister.</div>

<h2 class="lesson-title">2. "Her Yön" Neden Kısıtlayıcı?</h2>

<div class="calc-highlight"><strong>Çekiç, daha en basit triviyal olmayan fonksiyonda iniyor.</strong> Eşlenik dönüşümü f(z) = z̄ = x − iy'yi düşün. Bir ℝ² → ℝ² eşlemesi olarak gayet pürüzsüz — gerçel eksen üzerinden bir yansımadan ibaret. Yine de tek bir hesap ile <em>hiçbir noktada</em> karmaşık türevlenebilir olmadığını göreceğiz. İki yol iki farklı cevap veriyor ve bu, limiti ebediyen öldürmeye yetiyor.</div>

<p class="l-text">Temizlik için z₀ = 0 seçelim ve Δz'nin sıfıra iki farklı yönden yaklaşmasına izin verelim:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Gerçel eksen boyunca yaklaşma: Δz = Δx ∈ ℝ</div><div class="step-detail">O zaman Δz̄ = Δx. Bölüm (Δz̄ − 0) / Δz = Δx / Δx = 1 olur. Yani gerçel eksen boyunca limit +1.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Sanal eksen boyunca yaklaşma: Δz = i·Δy</div><div class="step-detail">O zaman Δz̄ = −i·Δy. Bölüm (−i·Δy) / (i·Δy) = −1 olur. Yani sanal eksen boyunca limit −1.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">+1 ≠ −1, dolayısıyla limit yoktur</div><div class="step-detail">Farklı yönler farklı aday limitler veriyor. Karmaşık türev z = 0'da var olamaz. Aynı argüman diğer her z₀'da da geçerli, demek ki eşlenik dönüşümü hiçbir yerde karmaşık türevlenebilir değildir.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">EŞLENİK BAŞARISIZ</div><div class="formula-main">$$\\lim_{\\Delta z \\to 0, \\Delta z \\in \\mathbb{R}} \\frac{\\overline{\\Delta z}}{\\Delta z} = +1 \\qquad \\lim_{\\Delta z \\to 0, \\Delta z \\in i\\mathbb{R}} \\frac{\\overline{\\Delta z}}{\\Delta z} = -1$$</div><div class="formula-sub">İki yol, iki cevap. Limit bu çelişkiyi ortalama alarak iyileştiremez — oybirliği gerek.</div></div>

<p class="l-text">Yine de z̄, (x, y) ↦ (x, −y) eşlemesi olarak görüldüğünde C^∞'dir — her dereceden tüm kısmi türevler vardır ve süreklidir. Yani gerçel analitik anlamda pürüzsüzlük <em>yetmez</em>. Karmaşık türevlenebilirlik gerçekten daha fazlasını ister — u'nun (x, y)'ye bağımlılığı ile v'nin (x, y)'ye bağımlılığı arasında bir eşleşme. Bir sonraki bölüm o eşleşmenin ne olduğunu kesin olarak belirler.</p>

<div class="calc-graph"><div id="plot-l3-directions-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> başlangıç etrafında küçük bir disk ve farklı renklerde çizilmiş birkaç düz yaklaşma yolu. Karmaşık türevlenebilir bir fonksiyon için fark bölümü limiti bu okların her birinde aynı karmaşık değeri vermelidir. f(z) = z̄ için +x boyunca yol +1, +iy boyunca yol −1 verir — daha ilk tutarsızlık türevlenebilirliği öldürür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var circ_x=[],circ_y=[];
for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;circ_x.push(0.9*Math.cos(th));circ_y.push(0.9*Math.sin(th));}
var disk={x:circ_x,y:circ_y,mode:'lines',name:'|z|=0.9',line:{color:'rgba(156,163,175,0.6)',width:1.5,dash:'dot'},showlegend:false};
var dirs=[];var colors=['#3b82f6','#f59e0b','#10b981','#ef4444','#a78bfa','#06b6d4'];var angles=[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,5*Math.PI/4];
for(var k=0;k<angles.length;k++){var a=angles[k];dirs.push({x:[0,0.85*Math.cos(a)],y:[0,0.85*Math.sin(a)],mode:'lines+markers',name:'θ='+a.toFixed(2),line:{color:colors[k%colors.length],width:2.4},marker:{size:[2,8],color:colors[k%colors.length]}});}
var origin={x:[0],y:[0],mode:'markers',name:'z₀=0',marker:{size:10,color:'#ffffff',symbol:'x'},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(Δz)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.1,1.1],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(Δz)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-1.1,1.1]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l3-directions-tr',[disk,origin].concat(dirs),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">İkna ol: Δz = Δx boyunca limit ile Δz = i·Δy boyunca limit uyuşmuyorsa, üçüncü hiçbir yol durumu kurtaramaz; çünkü "limit vardır" tanım gereği her yolun tek bir ortak değere yakınsamasını gerektirir. Birbiriyle uyuşmayan bir yön çifti idam hükmüdür.</div></div>

<h2 class="lesson-title">3. Cauchy-Riemann Denklemlerinin Türetilmesi</h2>

<div class="calc-highlight"><strong>Eğer karmaşık türevlenebilirlik geçerliyse, az önce kullandığımız aynı numara aynı cevabı vermelidir.</strong> z̄ için gerçel eksen ve sanal eksen boyunca türevi hesapladık ve bir çelişki bulduk. Şimdi aynı hesabı simgesel olarak, genel bir f için yapalım ve iki cevabın uyuşmasını sağlayan f üzerindeki koşulları bulalım. Bu koşullar Cauchy-Riemann denklemleridir.</div>

<p class="l-text">f'i iki gerçel değişkenin karmaşık değerli fonksiyonu olarak yaz:</p>

<div class="calc-formula"><div class="formula-label">GERÇEL VE SANAL KISIMLARA AYRIŞTIRMA</div><div class="formula-main">$$f(z) \\;=\\; u(x, y) \\;+\\; i \\, v(x, y), \\quad z = x + iy$$</div><div class="formula-sub">u gerçel kısım, v sanal kısımdır. Her ikisi de (x, y)'nin gerçel değerli fonksiyonlarıdır.</div></div>

<p class="l-text">f'in z₀ = x₀ + i y₀'da karmaşık türevlenebilir olduğunu varsayalım. f'(z₀)'ı tanımlayan limiti iki belirli yol boyunca hesaplayacağız ve cevapların uyuşmasını zorlayacağız.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Yol 1: gerçel eksen boyunca Δz = Δx</div><div class="step-detail">f(z₀ + Δx) − f(z₀) = [u(x₀+Δx, y₀) − u(x₀, y₀)] + i [v(x₀+Δx, y₀) − v(x₀, y₀)]. Δx'e böl ve Δx → 0 limitini al: sonuç (x₀, y₀)'da hesaplanan ∂u/∂x + i ∂v/∂x.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Yol 2: sanal eksen boyunca Δz = i·Δy</div><div class="step-detail">f(z₀ + i·Δy) − f(z₀) = [u(x₀, y₀+Δy) − u(x₀, y₀)] + i [v(x₀, y₀+Δy) − v(x₀, y₀)]. i·Δy'ye böl; 1/(i·Δy) = −i/Δy olduğundan bölüm −i [Δu]/Δy + [Δv]/Δy olur. Δy → 0 limitinde bu ∂v/∂y − i ∂u/∂y'ye eşit.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">İki cevabı eşitle</div><div class="step-detail">∂u/∂x + i ∂v/∂x = ∂v/∂y − i ∂u/∂y. Gerçel ve sanal kısımları ayrı ayrı eşle: ∂u/∂x = ∂v/∂y VE ∂v/∂x = −∂u/∂y.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">CAUCHY-RIEMANN DENKLEMLERİ</div><div class="formula-main">$$\\frac{\\partial u}{\\partial x} \\;=\\; \\frac{\\partial v}{\\partial y}, \\qquad \\frac{\\partial u}{\\partial y} \\;=\\; -\\frac{\\partial v}{\\partial x}$$</div><div class="formula-sub">f = u + i v'nin bir noktada karmaşık türevlenebilir olması için (u, v) üzerindeki gerekli koşullar.</div></div>

<p class="l-text">İki bağlaşık kısmi diferansiyel denklem. Karmaşık türevlenebilirliğin gerçekte ne kadar kısıtlayıcı olduğunun en temiz ifadesi bu. u ile v'yi birleştirirler: sistemi sağlamak için birini değiştiremezsin, diğerini yeniden hesaplaman gerekir. Gerçel değişken pürüzsüzlüğü böyle bir bağ dayatmaz — u_x istediğin gibi olabilir, v_y'den bağımsız. Karmaşık analizde ise ikiz kardeş olmak zorundalar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birinci CR denklemi</div><div class="card-body">u_x = v_y. u'nun yatay esnemesi v'nin dikey esnemesine eşittir.</div><div class="card-formula">u_x = v_y</div></div>
<div class="calc-card"><div class="card-title">İkinci CR denklemi</div><div class="card-body">u_y = −v_x. u'nun dikey değişimi v'nin yatay değişiminin negatifidir.</div><div class="card-formula">u_y = −v_x</div></div>
<div class="calc-card"><div class="card-title">Birlikte</div><div class="card-body">(u, v)'nin Jacobyen'inin "karmaşık çarpma" matrisi olduğunu kodlarlar: rotasyon çarpı ölçekleme, asla keyfi 2×2 değil.</div><div class="card-formula">J = sR_θ</div></div>
</div>

<div class="l-note"><strong>Jacobyen bakışı.</strong> f gerçel eşleme (x, y) ↦ (u, v) olarak görüldüğünde Jacobyen 2×2 matris [[u_x, u_y], [v_x, v_y]]'dir. Cauchy-Riemann denklemleri bu matrisin [[a, −b], [b, a]] özel biçiminde olduğunu söyler. Bu tip matrisler a + i b karmaşık sayısıyla çarpmayı — eşdeğer olarak arctan(b/a) kadar dönme ve √(a² + b²) kadar tekdüze ölçeklemeyi — temsil eder. Yani Cauchy-Riemann tam olarak f'in yerel doğrusallaşmasının bir karmaşık çarpma olduğunun cebirsel koşuludur. Geometrik sonuçları (açı koruma) 11. bölümde açıyoruz.</div>

<h2 class="lesson-title">4. Yeterli Koşul ve Terminoloji</h2>

<p class="l-text">Yukarıdaki türetme Cauchy-Riemann'ın <em>gerekli</em> olduğunu gösterdi. Tersi küçük bir ek hipotez gerektirir ama o da doğrudur.</p>

<div class="calc-formula"><div class="formula-label">YETERLİ KOŞUL (LOOMAN-MENCHOFF, STANDART HALİ)</div><div class="formula-main">$$u, v \\in C^1(\\Omega) \\text{ ve } \\Omega \\text{ üzerinde CR sağlanıyorsa, } f = u + iv \\text{ Ω üzerinde holomorftur.}$$</div><div class="formula-sub">Sürekli türevlenebilir u ile v artı CR denklemleri karmaşık türevlenebilirliği çıkarmaya yeter — yol-yol kontrole gerek yok.</div></div>

<p class="l-text">Yani pratikte "u ile v sürekli türevlenebilir mi ve CR denklemlerini sağlıyorlar mı?" iki satırlık kontrol, f'in Ω üzerinde karmaşık türevlenebilir olup olmadığı sorusunu tam olarak cevaplar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Holomorf</div><div class="card-body">Açık bir kümenin her noktasında karmaşık türevlenebilir. Karmaşık analizdeki standart sıfat — çalışan analistler arasında "karmaşık türevlenebilir" ile yer değiştirebilir şekilde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Analitik</div><div class="card-body">Her noktanın bir komşuluğunda yakınsak bir kuvvet serisine eşit. Tarihsel olarak daha güçlü bir koşul; 6. bölüm karmaşık fonksiyonlar için holomorf = analitik olduğunu açıklayacak.</div></div>
<div class="calc-card"><div class="card-title">Tam (entire)</div><div class="card-body">Tüm ℂ üzerinde holomorf. Örnekler: her polinom, eᶻ, sin z, cos z. Liouville teoremi bu sınıfın ne kadar katı olduğunu konusunda bizi şaşırtacak.</div></div>
<div class="calc-card"><div class="card-title">Meromorf</div><div class="card-body">İzole kutuplar dışında holomorf. Örnekler: 1/z, tan z, her rasyonel fonksiyon. Kutuplara L4-L5'te resmi olarak rastlayacağız.</div></div>
</div>

<div class="l-note"><strong>İki satırlık çalışma prosedürü.</strong> f(z) = u(x, y) + i v(x, y) verildi: (1) u_x, u_y, v_x, v_y'yi hesapla. (2) u_x = v_y ve u_y = −v_x mı kontrol et. Eğer açık bir kümede evet ise, f orada holomorftur. Denklemler herhangi bir yerde başarısız olursa, f o noktalarda holomorf değildir. Bitti.</div>

<h2 class="lesson-title">5. Çözülmüş Örnekler</h2>

<p class="l-text">Reçeteyi en öğretici dört duruma uygulayalım.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — f(z) = z²</div><div class="example-body">z² = (x + iy)² = x² + 2ixy + (iy)² = (x² − y²) + i(2xy). Yani u = x² − y², v = 2xy.<br><br>u_x = 2x, u_y = −2y, v_x = 2y, v_y = 2x.<br><br>Kontrol: u_x = 2x = v_y ✓ ve u_y = −2y = −v_x ✓. CR her yerde sağlanıyor. <strong>z² tüm ℂ üzerinde holomorftur (tam fonksiyondur) ve f'(z) = u_x + i v_x = 2x + 2iy = 2z.</strong></div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — f(z) = z̄</div><div class="example-body">z̄ = x − iy. Yani u = x, v = −y.<br><br>u_x = 1, u_y = 0, v_x = 0, v_y = −1.<br><br>Kontrol: u_x = 1 v_y = −1'e karşı. Her yerde başarısız. <strong>z̄ hiçbir yerde holomorf değildir</strong>, bu da 2. bölümdeki doğrudan yol argümanını doğrular.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — f(z) = |z|² = z·z̄</div><div class="example-body">|z|² = x² + y². Yani u = x² + y², v = 0.<br><br>u_x = 2x, u_y = 2y, v_x = 0, v_y = 0.<br><br>Kontrol: u_x = 2x = v_y = 0 olması x = 0 gerektirir. u_y = 2y = −v_x = 0 olması y = 0 gerektirir. İkisi de (x, y) = (0, 0) olmadıkça başarısız. <strong>|z|² yalnızca z = 0'da karmaşık türevlenebilir</strong>, ama hiçbir yerde holomorf değildir, çünkü 0'ın hiçbir açık komşuluğunda türevlenebilir değildir.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — f(z) = eᶻ</div><div class="example-body">eᶻ = e^x · e^(iy) = e^x · (cos y + i sin y). Yani u = e^x cos y, v = e^x sin y.<br><br>u_x = e^x cos y, u_y = −e^x sin y, v_x = e^x sin y, v_y = e^x cos y.<br><br>Kontrol: u_x = e^x cos y = v_y ✓ ve u_y = −e^x sin y = −v_x ✓. CR her yerde sağlanıyor. <strong>eᶻ tamdır, f'(z) = e^x cos y + i e^x sin y = eᶻ — karmaşık üstel kendi türevidir, tam olarak gerçel hali gibi.</strong></div></div>

<div class="calc-graph"><div id="plot-l3-cr-heat-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu ısı haritasının gösterdiği:</strong> |z| ≤ 1 diski üzerinde max(|u_x − v_y|, |u_y + v_x|) maksimum CR ihlali; f(z) = z² (sol alt grid) ve f(z) = z̄ (sağ alt grid) için sayısal olarak hesaplanmış. z² için ihlal kayan noktalı gürültü düzeyinde sıfır — fonksiyon holomorf. z̄ için ihlal her yerde sabit 2 — hiçbir yerde holomorf değil.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=41;var xs=[],ys=[];var zsq=[];var zbar=[];
for(var i=0;i<N;i++){xs.push(-1+2*i/(N-1));ys.push(-1+2*i/(N-1));}
for(var j=0;j<N;j++){var row1=[];var row2=[];for(var i=0;i<N;i++){var x=xs[i];var y=ys[j];var u1=x*x-y*y;var v1=2*x*y;var ux=2*x,uy=-2*y,vx=2*y,vy=2*x;var e1=Math.max(Math.abs(ux-vy),Math.abs(uy+vx));row1.push(e1);var u2=x;var v2=-y;var ux2=1,uy2=0,vx2=0,vy2=-1;var e2=Math.max(Math.abs(ux2-vy2),Math.abs(uy2+vx2));row2.push(e2);}zsq.push(row1);zbar.push(row2);}
var h1={z:zsq,x:xs,y:ys,type:'heatmap',name:'f(z)=z² ihlali',colorscale:[[0,'#0a3b6e'],[0.5,'#3b82f6'],[1,'#fef3c7']],showscale:true,colorbar:{title:'maks CR ihlali',x:0.45,len:0.8}};
var h2={z:zbar,x:xs,y:ys,type:'heatmap',name:'f(z)=z̄ ihlali',colorscale:[[0,'#0a3b6e'],[0.5,'#ef4444'],[1,'#fef3c7']],showscale:true,xaxis:'x2',yaxis:'y2',colorbar:{title:'maks CR ihlali',x:1.0,len:0.8}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'x (f=z²)',gridcolor:'rgba(255,255,255,0.07)',domain:[0,0.42]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)'},xaxis2:{title:'x (f=z̄)',gridcolor:'rgba(255,255,255,0.07)',domain:[0.55,1]},yaxis2:{title:'y',gridcolor:'rgba(255,255,255,0.07)',anchor:'x2'},margin:{t:40,r:30,b:50,l:55},showlegend:false};
Plotly.newPlot('plot-l3-cr-heat-tr',[h1,h2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bunların hangisi tüm ℂ üzerinde holomorftur: (a) Re(z), (b) z̄·z = |z|², (c) z³ − 2z + 1, (d) 1/z̄? (Cevaplar: yalnızca (c). Re(z) için u=x, v=0, dolayısıyla u_x=1 ≠ v_y=0. (b) yukarıda hesaplandı. (d) z̄ içeriyor ve bu onu öldürür. z'nin polinomları her zaman tamdır.)</div></div>

<h2 class="lesson-title">6. Holomorf = Analitik — Gerçel Karşılığı Olmayan Bir Sonuç</h2>

<div class="calc-highlight"><strong>Bu matematikteki en garip teoremlerden biri.</strong> Gerçel fonksiyonlar bir kez türevlenebilir olup iki kez olmayabilir (örneğin f(x) = x²·sign(x) C¹'dir ama C² değildir). C^∞ olup aynı zamanda yalnızca parça parça bir kuvvet serisine eşit olabilirler (örneğin sıfırda sıfırla genişletilmiş e^(−1/x²) — her yerde pürüzsüz ama 0'daki Taylor serisi özdeş olarak sıfırdır ve fonksiyonla anlaşmazlık içindedir). ℂ'de böyle bir şey olamaz.</div>

<div class="calc-formula"><div class="formula-label">HOLOMORF VE ANALİTİK EŞDEĞERLİĞİ</div><div class="formula-main">$$f \\text{ Ω üzerinde holomorf } \\;\\Longleftrightarrow\\; f \\text{ Ω'nın her noktasının bir komşuluğunda Taylor serisine eşit}$$</div><div class="formula-sub">Bir karmaşık fonksiyonun açık bir kümede bir tek karmaşık türevi varsa, sonsuz tane vardır ve Taylor serisi yerel olarak her yerde fonksiyona yakınsar.</div></div>

<p class="l-text">İleri yön derin teorem (Cauchy integral formülü ve sonuçtaki Cauchy tahminleri bunu sağlar; L4-L5'te integral tarafının hikâyesini göreceğiz). Ters yön anlık — yakınsak bir kuvvet serisi, yakınsama diski içinde terim terim türevlenebilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ℝ'de: türevlenebilir ≠ analitik</div><div class="card-body">Taylor serileri yakınsayan ama yanlış değere yakınsayan veya tamamen ıraksayan pürüzsüz fonksiyonlar vardır. Gerçel türevlenebilirlik fonksiyon değerlerini uzaklardan kontrol etmeyen yerel bir koşuldur.</div></div>
<div class="calc-card"><div class="card-title">ℂ'de: türevlenebilir = analitik</div><div class="card-body">Tek bir karmaşık türev bile sonsuz türevlenebilirliği ve analitik temsil edilebilirliği zorlar. Sınıf çöker: "pürüzsüz" ile "seriyle verilmiş" arasında boşluk yoktur.</div></div>
<div class="calc-card"><div class="card-title">Yerel veriden tanımlanırlık</div><div class="card-body">Her holomorf fonksiyon analitik olduğundan, küçük bir disk üzerindeki değerlerini bilmek onu tüm bağlı tanım kümesinde tek olarak belirler. Bu meşhur özdeşlik (veya "katılık") teoremidir.</div></div>
</div>

<div class="l-note"><strong>Pratik sonuç (katılık).</strong> Bağlı bir açık kümede içinde bir birikim noktası olan bir kümede uyuşan iki holomorf fonksiyon her yerde uyuşmalıdır. Gerçel analizde karşılığı yoktur. Bu yüzden holomorf fonksiyonlar bazen "donmuş" olarak nitelenir — nasıl davranabilecekleri konusunda şaşırtıcı derecede az özgürlük vardır.</div>

<h2 class="lesson-title">7. Harmonik Fonksiyonlar Holomorfların Gerçel Kısımlarıdır</h2>

<div class="calc-highlight"><strong>Potansiyel teorisine köprü.</strong> Herhangi bir holomorf f = u + i v al. Cauchy-Riemann denklemlerini bir kez daha türevle. Sonuç u'nun ve v'nin Laplace denklemini sağlamasıdır — <em>harmoniktirler</em>. Bu tek olgu, karmaşık analizin 2-D'de elektrostatik için, ideal akışkan akışı için, kararlı durum ısı dağılımı için ve fizik bilgili sinir ağlarının arkasındaki kısmi diferansiyel denklemler için doğal dil olmasının nedenidir.</div>

<p class="l-text">CR denklemlerinden başla ve birincisini x'e göre, ikincisini y'ye göre türevle:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">u_x = v_y'yi x'e göre türevle</div><div class="step-detail">u_xx = v_yx.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">u_y = −v_x'i y'ye göre türevle</div><div class="step-detail">u_yy = −v_xy.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">İkisini topla ve karışık kısmi türevlerin eşitliğini kullan</div><div class="step-detail">u_xx + u_yy = v_yx − v_xy = 0; v yeterince pürüzsüz olduğunda v_xy = v_yx olduğundan (ki holomorfluk 6. bölüm sayesinde bunu garanti eder).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">v için aynı argüman</div><div class="step-detail">u_x = v_y'yi y'ye göre, u_y = −v_x'i x'e göre türevle: çıkararak v_xx + v_yy = 0 elde ederiz.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">GERÇEL VE SANAL KISIMLAR İÇİN LAPLACE DENKLEMİ</div><div class="formula-main">$$u_{xx} + u_{yy} \\;=\\; 0, \\qquad v_{xx} + v_{yy} \\;=\\; 0$$</div><div class="formula-sub">Bir holomorf fonksiyonun her gerçel (sırasıyla sanal) kısmı Laplace denklemini sağlar. Bu tür fonksiyonlara harmonik denir.</div></div>

<p class="l-text">Tersi de doğrudur: basit bağlı bir açık kümede herhangi bir harmonik u verildiğinde, bir harmonik eşlenik v (toplama sabiti dışında tek) inşa edilebilir, öyle ki f = u + i v holomorftur. Yani harmonik fonksiyonlar ile holomorf fonksiyonlar aynı nesnenin iki yüzüdür — karmaşık analizin "gerçel kısmı".</p>

<div class="calc-graph"><div id="plot-l3-harmonic-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu yüzeyin gösterdiği:</strong> f(z) = z²'nin gerçel kısmı olan harmonik fonksiyon u(x, y) = x² − y². "Eyer" şeklinin ders kitabı örneği — x ekseni boyunca kesin pozitif, y ekseni boyunca kesin negatif, sadece y = ±x köşegenleri üzerinde sıfır. Fonksiyonun bir yönde yukarı, dik yönde aynı miktarda aşağı kıvrıldığını görsel olarak doğrulayabilirsin; tam o iptal Laplace denklemi u_xx + u_yy = 2 + (−2) = 0'dır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=40;var xs=[],ys=[];var zs=[];
for(var i=0;i<N;i++){xs.push(-2+4*i/(N-1));ys.push(-2+4*i/(N-1));}
for(var j=0;j<N;j++){var row=[];for(var i=0;i<N;i++){row.push(xs[i]*xs[i]-ys[j]*ys[j]);}zs.push(row);}
var surf={type:'surface',x:xs,y:ys,z:zs,colorscale:[[0,'#1e3a8a'],[0.5,'#3b82f6'],[1,'#fef3c7']],showscale:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},yaxis:{title:'y',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},zaxis:{title:'u = x²−y²',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},camera:{eye:{x:1.6,y:1.6,z:1.2}}},margin:{t:20,r:0,b:0,l:0}};
Plotly.newPlot('plot-l3-harmonic-tr',[surf],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l3-conjugates-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu iki kontur grafiğinin gösterdiği:</strong> f(z) = z² için bir harmonik eşlenik çifti. Solda u(x, y) = x² − y² (eyer). Sağda v(x, y) = 2xy (xy-çarpımı hiperbolü, yine bir eyer, 45° döndürülmüş). Düzey eğrileri her kesişim noktasında karşılıklı diktir — bu diklik tam olarak CR denklemlerinin çalışması, çünkü (u_x, u_y) ve (v_x, v_y) gradyanları CR sayesinde ∇u · ∇v = u_x v_x + u_y v_y = u_x (−u_y) + u_y u_x = 0 koşulunu sağlar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=60;var xs=[],ys=[];var u=[],v=[];
for(var i=0;i<N;i++){xs.push(-2+4*i/(N-1));ys.push(-2+4*i/(N-1));}
for(var j=0;j<N;j++){var ru=[],rv=[];for(var i=0;i<N;i++){ru.push(xs[i]*xs[i]-ys[j]*ys[j]);rv.push(2*xs[i]*ys[j]);}u.push(ru);v.push(rv);}
var cu={type:'contour',x:xs,y:ys,z:u,colorscale:[[0,'#1e3a8a'],[0.5,'#3b82f6'],[1,'#fef3c7']],contours:{coloring:'heatmap'},showscale:false};
var cv={type:'contour',x:xs,y:ys,z:v,colorscale:[[0,'#7c1d6f'],[0.5,'#a78bfa'],[1,'#fef3c7']],contours:{coloring:'heatmap'},xaxis:'x2',yaxis:'y2',showscale:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'x — u = x²−y²',gridcolor:'rgba(255,255,255,0.07)',domain:[0,0.45]},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.07)',scaleanchor:'x',scaleratio:1},xaxis2:{title:'x — v = 2xy',gridcolor:'rgba(255,255,255,0.07)',domain:[0.55,1]},yaxis2:{title:'y',gridcolor:'rgba(255,255,255,0.07)',anchor:'x2',scaleanchor:'x2',scaleratio:1},margin:{t:30,r:30,b:50,l:55},showlegend:false};
Plotly.newPlot('plot-l3-conjugates-tr',[cu,cv],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>u'dan v'yi geri kazanma.</strong> u basit bağlı bir bölgede harmonik ise, eşlenik v ∂v/∂x = −u_y ve ∂v/∂y = u_x ile bir sabit dışında belirlenir. Birincisini x'e göre integralle, sonucu y'ye göre türevle, u_x ile anlaşmaya zorla. Prosedür basit bağlı bir bölgede her zaman başarılıdır.</div>

<h2 class="lesson-title">8. Cauchy-Riemann Kutupsal Formda</h2>

<p class="l-text">Birçok doğal karmaşık fonksiyon (z^n, log z, z^α) kutupsal koordinatlar z = r e^(iθ)'de Kartezyen'den çok daha basittir. Kutupsal formdaki Cauchy-Riemann denklemleri (x, y)'ye dönmeden doğrudan orada çalışmamıza izin verir.</p>

<div class="calc-formula"><div class="formula-label">CAUCHY-RIEMANN KUTUPSAL FORMDA</div><div class="formula-main">$$\\frac{\\partial u}{\\partial r} \\;=\\; \\frac{1}{r} \\, \\frac{\\partial v}{\\partial \\theta}, \\qquad \\frac{1}{r} \\, \\frac{\\partial u}{\\partial \\theta} \\;=\\; -\\frac{\\partial v}{\\partial r}$$</div><div class="formula-sub">r > 0 için geçerlidir. 1/r çarpanı (x, y) ile (r, θ) arasında geçişin Jacobyen düzeltmesidir.</div></div>

<p class="l-text"><strong>Türetme taslağı.</strong> x = r cos θ, y = r sin θ olduğundan zincir kuralı ∂/∂x = cos θ · ∂/∂r − (sin θ / r) · ∂/∂θ ve ∂/∂y = sin θ · ∂/∂r + (cos θ / r) · ∂/∂θ verir. Kartezyen CR denklemlerine yerleştir, uygun sin θ ile cos θ kombinasyonlarıyla çarp, ve bir paragraflık cebirden sonra kutupsal versiyonlar düşer.</p>

<div class="calc-example"><div class="example-label">ÖRNEK — log z kutupsal formda</div><div class="example-body">log z = log(r e^(iθ)) = log r + i θ (seçilen bir dal için). Yani u = log r, v = θ.<br><br>u_r = 1/r, u_θ = 0, v_r = 0, v_θ = 1.<br><br>Kutupsal CR: u_r = 1/r = (1/r)·v_θ ✓. (1/r)·u_θ = 0 = −v_r ✓. Yani log z, dal kesimini hariç tutan herhangi basit bağlı bir bölgede holomorftur, türevi 1/z'dir. Kutupsal form bu doğrulamayı üç satırda verir.</div></div>

<div class="calc-graph"><div id="plot-l3-polar-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> başlangıçta merkezli birim disk üzerinde kutupsal grid r = sabit (eş merkezli çemberler, mavi) ve θ = sabit (radyal ışınlar, altın). Kutupsal koordinatlarda yazılan holomorf bir f için bu iki aile, kutupsal CR denklemlerinin yazıldığı doğal koordinat çizgileridir. Resim cebiri somut bir koordinat ağına bağlamak için burada.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
for(var k=1;k<=4;k++){var rr=k/4;var cx=[],cy=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;cx.push(rr*Math.cos(th));cy.push(rr*Math.sin(th));}traces.push({x:cx,y:cy,mode:'lines',name:'r='+rr.toFixed(2),line:{color:'#3b82f6',width:1.6},showlegend:(k===1)});}
for(var m=0;m<12;m++){var th=2*Math.PI*m/12;traces.push({x:[0,Math.cos(th)],y:[0,Math.sin(th)],mode:'lines',name:'θ='+(360*m/12).toFixed(0)+'°',line:{color:'#f59e0b',width:1.4},showlegend:(m===0)});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.2,1.2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.2,1.2]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-polar-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Tekillikler — Kısa Bir Önizleme</h2>

<p class="l-text">f'in holomorf olmadığı noktalara <strong>tekillik</strong> denir. Tam bir sınıflandırma için L4-L5'i bekliyoruz; Laurent serisi bize doğru dili veriyor. Şimdilik adlarını bilmen gereken üç tip:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kaldırılabilir tekillik</div><div class="card-body">f bir noktada tanımlı değildir ama limit vardır ve sonludur — değeri doldurduğunda f holomorf olur. Klasik örnek: z = 0'da sin(z)/z; orada limit 1'dir.</div></div>
<div class="calc-card"><div class="card-title">k-ıncı dereceden kutup</div><div class="card-body">Kötü noktanın a yakınında f, c / (z − a)^k gibi görünür (k ≥ 1 tam sayı, c sabit). Örnek: 1/(z − a)^k. Fonksiyon a'ya nasıl yaklaşırsan yaklaş ∞'a patlar.</div></div>
<div class="calc-card"><div class="card-title">Esas (essential) tekillik</div><div class="card-body">Ne kaldırılabilir ne kutup. Fonksiyon vahşice davranır — Picard teoremine göre her komşulukta her karmaşık değeri (en fazla bir istisna ile) sonsuz kez alır. Örnek: z = 0'da e^(1/z).</div></div>
</div>

<div class="l-note"><strong>Bu neden şimdi önemli.</strong> 1/z gibi bir fonksiyon z = 0'da holomorf olmaktan başarısız olur, ama ℂ \\ {0} üzerinde Cauchy-Riemann denklemlerini sağlar. CR denklemleri noktasaldır; tanım kümesinin küresel topolojisi hakkında hiçbir şey söylemezler. Tekillikler "CR kontrolünün dışında" yaşar — Ω'dan çıkardığımız yerlerdir ve onları çevreleyen integraller Cauchy artık (residue) teoreminin (L5) muhteşemleştiği yerdir.</div>

<h2 class="lesson-title">10. Liouville Teoremi — Asıl Vuruş</h2>

<div class="calc-highlight"><strong>Tüm konuyu canlı hissettiren bir teorem.</strong> Sınırlı bir tam fonksiyon sabit olmalıdır. Gerçel analizde karşılığı yoktur: sin x 1 ile sınırlıdır ve kesinlikle sabit değildir; cos x, Gauss fonksiyonu e^(−x²), sigmoid 1/(1 + e^(−x)) — hepsi sınırlı pürüzsüz gerçel fonksiyonlar ve sabit değil. ℂ'de durum şaşırtıcı derecede farklı.</div>

<div class="calc-formula"><div class="formula-label">LIOUVILLE TEOREMİ</div><div class="formula-main">$$f : \\mathbb{C} \\to \\mathbb{C} \\text{ holomorf ve sınırlı} \\;\\Longrightarrow\\; f \\text{ sabittir.}$$</div><div class="formula-sub">|f(z)| ≤ M koşulunu tüm z için sağlayan tam bir fonksiyon yalnızca bir sabittir. Holomorf + global = pratikte değişebilecek hiçbir şey kalmaz.</div></div>

<p class="l-text">Burada kanıtlamıyoruz — kanıt L4'teki Cauchy integral formülünü gerektirir — ama vurucu fikir anında ve söylenmeye değer: holomorf = analitik eşitliğini yeterince uzağa esnetirsen, fonksiyonun sınırsız büyümesini engellemenin tek yolu onu sabit tutmaktır. Hiç büyüyen herhangi bir şey sonsuza büyür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sınırlı</div><div class="card-body">Tek bir M sabiti ve tüm z ∈ ℂ için |f(z)| ≤ M. Her yerde sonlu bir tavan.</div></div>
<div class="calc-card"><div class="card-title">Tam</div><div class="card-body">Tüm ℂ üzerinde holomorf. Polinomlar, eᶻ, sin z, cos z uygun; herhangi bir kutbu olan rasyonel fonksiyonlar değil.</div></div>
<div class="calc-card"><div class="card-title">Sabit</div><div class="card-body">Tüm z için f(z) = c. En katı olası fonksiyon. Liouville: sınırlı + tam bunu zorlar.</div></div>
</div>

<div class="calc-example"><div class="example-label">SONUÇ — CEBİRİN TEMEL TEOREMİ</div><div class="example-body">p(z) sabit olmayan bir polinom olsun. p'nin karmaşık kökü olmadığını varsay. O zaman 1/p(z) tüm z için tanımlıdır, dolayısıyla tamdır. Ayrıca |z| → ∞ iken |p(z)| → ∞ (çünkü p en az 1. dereceden bir polinom), bu da |1/p(z)| → 0'ı zorlar, dolayısıyla 1/p sınırlıdır. Liouville'e göre 1/p sabit olmalı — ama o zaman p de sabit, çelişki. Yani <strong>her sabit olmayan karmaşık polinomun en az bir karmaşık kökü vardır.</strong> Bu Cebirin Temel Teoremi'dir ve tüm kanıt tek bir kısa paragrafta gerçekleşti, çünkü ağır işi Liouville yaptı.</div></div>

<div class="l-note"><strong>Derin ders.</strong> ℂ üzerindeki holomorf fonksiyonlar sınıfı o kadar katıdır ki "sınırlı" pratikte "triviyal olmayan" ile bağdaşmaz. Her ilginç tam fonksiyon (eᶻ, polinomlar, sin z, cos z) sınırsızdır — olmak zorunda. Gerçel değişken sezgisi burada başarısız olur, çünkü gerçel türevlenebilirlik çok daha zayıftır; karmaşık türevlenebilirlik noktasal olarak tanımlansa bile küresel doğadadır.</div>

<h2 class="lesson-title">11. Geometrik Anlam — Konformal Eşlemeler Önizlemesi</h2>

<p class="l-text">3. bölümdeki Jacobyen bakışı Cauchy-Riemann'ın geometrik yorumunu verir. z₀'da türevi sıfırdan farklı olan bir holomorf eşleme, sonsuz küçük ölçekte, arg f'(z₀) kadar bir dönme ile |f'(z₀)| kadar tekdüze bir ölçeklemenin bileşimi olarak hareket eder. Özellikle, z₀'dan geçen herhangi iki eğri arasındaki açı f tarafından korunur — bu tür eşlemelere <strong>konformal</strong> denir.</p>

<div class="calc-formula"><div class="formula-label">KONFORMALLIK</div><div class="formula-main">$$f \\text{ z}_0 \\text{'da holomorf ve } f'(z_0) \\ne 0 \\text{ ise, } f \\text{ z}_0 \\text{'da açıları korur.}$$</div><div class="formula-sub">z₀'da α açısıyla kesişen iki eğri, görüntüleri f(z₀)'da aynı α açısıyla kesişir.</div></div>

<div class="calc-graph"><div id="plot-l3-conformal-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> sol panel z-düzleminde kare bir grid (x = sabit çizgileri mavi, y = sabit çizgileri altın). Sağ panel f(z) = z² altındaki görüntüsü. Grid ağır şekilde bozulur — düz çizgiler parabollere dönüşür — ama her <em>kesişim</em> noktasında (başlangıç hariç, orada f'(z) = 2z = 0) iki eğri hâlâ dik açıyla kesişir. Çizgilerin eğilmesine rağmen korunan o 90° açı, konformalliğin iş başında olmasıdır ve Cauchy-Riemann denklemlerinin doğrudan geometrik sonucudur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];var traces2=[];
var lines=[-1.5,-1,-0.5,0,0.5,1,1.5];
for(var k=0;k<lines.length;k++){var xv=lines[k];var x=[],y=[],ux=[],uy=[];for(var i=0;i<=80;i++){var yy=-1.6+3.2*i/80;x.push(xv);y.push(yy);ux.push(xv*xv-yy*yy);uy.push(2*xv*yy);}traces.push({x:x,y:y,mode:'lines',name:'x='+xv,line:{color:'#3b82f6',width:1.6},showlegend:(k===0)});traces2.push({x:ux,y:uy,mode:'lines',line:{color:'#3b82f6',width:1.6},showlegend:false,xaxis:'x2',yaxis:'y2'});}
for(var k=0;k<lines.length;k++){var yv=lines[k];var x=[],y=[],ux=[],uy=[];for(var i=0;i<=80;i++){var xx=-1.6+3.2*i/80;x.push(xx);y.push(yv);ux.push(xx*xx-yv*yv);uy.push(2*xx*yv);}traces.push({x:x,y:y,mode:'lines',name:'y='+yv,line:{color:'#f59e0b',width:1.6},showlegend:(k===0)});traces2.push({x:ux,y:uy,mode:'lines',line:{color:'#f59e0b',width:1.6},showlegend:false,xaxis:'x2',yaxis:'y2'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'Re(z) — girdi gridi',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0,0.45],range:[-2,2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2,2]},xaxis2:{title:'Re(z²) — görüntü gridi',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',domain:[0.55,1],range:[-4.5,4.5],scaleanchor:'y2',scaleratio:1},yaxis2:{title:'Im(z²)',gridcolor:'rgba(255,255,255,0.05)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-4.5,4.5],anchor:'x2'},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l3-conformal-tr',traces.concat(traces2),layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">L6 konformal eşlemeyi tam bir araç setine dönüştürür — Möbius dönüşümleri, Riemann eşleme teoremi, sınır değer problemlerine uygulamalar. Şimdilik çıkarılacak ders geometrik yeniden çerçeveleme: Cauchy-Riemann denklemleri <em>tuhaf</em> bir cebirsel kaza değildir. Tek bir temiz geometrik talebin cebirsel gölgesidirler: "açıları koru".</p>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynayacakların.</strong> <code>lambda z: z**2</code>'yi <code>lambda z: 1/z</code> ile değiştir ve başlangıç dışında her yerde ihlalin esasen sıfır olduğunu kontrol et (orada 1/z tekildir ve sonlu fark yaklaşımı patlar). <code>lambda z: z.conjugate() * z</code> dene — cebirsel olarak |z|² ile aynı, dolayısıyla ihlal yalnızca başlangıçta sıfıra yakın olmalı. <code>u = xx**2 - yy**2</code>'yi <code>u = xx**3 - 3*xx*yy**2</code> (z³'ün gerçel kısmı) ile değiştir ve Laplace denklemini yeniden doğrula. Δu hesabı yine sayısal sıfır verecek — bu her Re(z^n)'in harmonik özelliği.</p>

<h2 class="lesson-title">13. Özet — Artık Yapabildiklerin</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karmaşık türev</div><div class="card-body">Düzlemde her yönde uyuşması gereken bir limit. (u, v)'nin gerçel türevlenebilirliğinden kesinlikle daha güçlü.</div><div class="card-formula">f'(z₀) = lim Δf/Δz</div></div>
<div class="calc-card"><div class="card-title">Cauchy-Riemann</div><div class="card-body">Holomorfluk için gerekli ve (C¹ ile) yeterli. (u, v) üzerinde iki bağlaşık KDD.</div><div class="card-formula">u_x = v_y, u_y = −v_x</div></div>
<div class="calc-card"><div class="card-title">Holomorf = analitik</div><div class="card-body">Tek bir karmaşık türev sonsuz türevlenebilirliği ve yakınsak bir Taylor serisini ima eder. Gerçel karşılığı yok.</div><div class="card-formula">C¹(ℂ) = C^ω(ℂ)</div></div>
<div class="calc-card"><div class="card-title">Harmonik gerçel kısımlar</div><div class="card-body">Re f ve Im f Laplace denklemini sağlar. Potansiyel teorisine ve KDD'lere köprü.</div><div class="card-formula">u_xx + u_yy = 0</div></div>
<div class="calc-card"><div class="card-title">Kutupsal CR</div><div class="card-body">Aynı içerik, kutupsal koordinatlar. log z, z^α, z^n için faydalı.</div><div class="card-formula">u_r = v_θ/r, u_θ/r = −v_r</div></div>
<div class="calc-card"><div class="card-title">Liouville</div><div class="card-body">Sınırlı tam ⇒ sabit. Cebirin Temel Teoremi'nin ve holomorf fonksiyonların derin katılığının kaynağı.</div><div class="card-formula">|f| ≤ M, tam ⇒ f = c</div></div>
<div class="calc-card"><div class="card-title">Konformal</div><div class="card-body">Holomorf + f' ≠ 0 ⇒ açı korur. CR denklemleri "Jacobyen bir benzerlik" olarak yeniden ifade edilir.</div><div class="card-formula">J = |f'(z)| · R_θ</div></div>
</div>

<div class="l-note"><strong>Bunun gideceği yer.</strong> L4 karmaşık çizgi integrallerini ve Cauchy teoremini tanıtır — Cauchy-Riemann'ın integral karşılığı, holomorf = analitik'in eksik kanıtını sağlar. L5 Laurent serilerini ve artık (residue) hesabını inşa eder; orada Liouville ve 9. bölümün tekillik sınıflandırması matematiğin en güçlü hesaplama araçlarından birinde birleşir. L6 konformal eşlemeye ciddi bir şekilde geri döner. Harmonik fonksiyonlar 2-D Laplace denklemine ev sahipliği yapan herhangi bir ortamda yeniden ortaya çıkar — elektrostatik, akışkan akışı, kararlı durum ısı ve fizik bilgili sinir ağlarının kalbindeki KDD artıkları.</div>`
};
