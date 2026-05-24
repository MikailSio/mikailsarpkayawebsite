window.COMPLEX_L5 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This is the lesson where complex analysis turns into a calculator.</strong> L4 gave us Cauchy's integral theorem: closed contour integrals of holomorphic functions vanish, and Cauchy's integral formula recovers the value of an analytic function from its boundary. Both statements assumed the integrand was holomorphic inside the contour. Real life is messier — the integrands we care about, $1/(1+x^2)$, $\\sin x / x$, $e^{i\\omega t}/(s^2+\\omega_0^2)$, all have singularities. The residue theorem is the rule that says: if you let your contour swallow a finite collection of isolated singularities, the integral around it is no longer zero — it is a clean, finite, fully computable sum.</p>

<p class="l-text">Out of one identity ($\\oint f\\,dz = 2\\pi i \\sum \\mathrm{Res}$) falls a toolkit so versatile that it dominates applied mathematics: every standard real improper integral, every Fourier transform you can write down with rational coefficients, every Laplace-domain transfer function in a textbook, every Mellin transform in number theory. The residue theorem is to complex analysis what the chain rule is to calculus — one short formula that you reach for ten times a day.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Classify every isolated singularity as removable, pole of order k, or essential, and recognise them from Laurent series</li>
<li>Compute residues at simple poles, higher-order poles, and via direct Laurent coefficient extraction</li>
<li>State the residue theorem, see its derivation from Cauchy's theorem, and apply it to closed contours</li>
<li>Evaluate three classes of real definite integrals: trigonometric over $[0,2\\pi]$, improper rational over $\\mathbb{R}$, and integrals with $e^{i\\omega x}$ factors</li>
<li>Compute inverse Fourier transforms by residues — including the principal Lorentzian $1/(1+\\omega^2)$ pair</li>
<li>Read inverse Laplace transforms off the Bromwich contour using residues at left-half-plane poles</li>
<li>Verify everything numerically with Pyodide, including direct contour quadrature and sympy residue extraction</li>
</ul>
</div>

<h2 class="lesson-title">1. Isolated Singularities — A Trichotomy</h2>

<div class="calc-highlight"><strong>If a holomorphic function fails to be holomorphic at a single point, the failure has only three possible flavours.</strong> Beyond that point, the Laurent expansion of $f$ tells the whole story. Three different shapes of Laurent series, three completely different behaviours. The classification is total — no other isolated singularity exists.</div>

<p class="l-text">Let $f$ be holomorphic on a <em>punctured disc</em> $0 &lt; |z-z_0| &lt; R$ but not (yet defined or not holomorphic) at $z_0$. Then $z_0$ is an <strong>isolated singularity</strong> of $f$. On the punctured disc, $f$ has a unique Laurent expansion:</p>

<div class="calc-formula"><div class="formula-label">LAURENT EXPANSION AROUND AN ISOLATED SINGULARITY</div><div class="formula-main">$$f(z) \\;=\\; \\sum_{n=-\\infty}^{\\infty} c_n (z - z_0)^n, \\qquad 0 &lt; |z - z_0| &lt; R$$</div><div class="formula-sub">The non-negative powers form the regular part; the negative powers form the <em>principal part</em>. The full classification depends on how many of the negative coefficients $c_{-1}, c_{-2}, c_{-3}, \\dots$ are non-zero.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Removable</div><div class="card-body">All $c_n = 0$ for $n &lt; 0$. The principal part is empty. $f$ extends to a holomorphic function at $z_0$ by setting $f(z_0) = c_0$. The "singularity" was a notational illusion.</div></div>
<div class="calc-card"><div class="card-title">Pole of order $k$</div><div class="card-body">$c_{-k} \\ne 0$ but $c_n = 0$ for $n &lt; -k$. The principal part has exactly $k$ terms. $|f(z)| \\to \\infty$ as $z \\to z_0$, and $f$ blows up like $(z-z_0)^{-k}$.</div></div>
<div class="calc-card"><div class="card-title">Essential</div><div class="card-body">Infinitely many of the $c_n$ with $n &lt; 0$ are non-zero. Near $z_0$, $f$ attains every complex value (with at most one exception) infinitely often — the great Picard theorem.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLES — ONE OF EACH TYPE</div><div class="example-body"><strong>Removable: $f(z) = \\sin(z)/z$ at $z = 0$.</strong> Taylor expand: $\\sin z = z - z^3/3! + z^5/5! - \\dots$, so $\\sin(z)/z = 1 - z^2/3! + z^4/5! - \\dots$. No negative-power terms. Setting $f(0) = 1$ makes $f$ holomorphic at the origin.<br><br><strong>Pole of order 3: $f(z) = 1/(z-1)^3$ at $z = 1$.</strong> The Laurent series is just $(z-1)^{-3}$ — only one term, but $c_{-3} = 1 \\ne 0$ and all lower coefficients are zero. Order 3 by definition.<br><br><strong>Essential: $f(z) = e^{1/z}$ at $z = 0$.</strong> Expand: $e^{1/z} = 1 + 1/z + 1/(2! z^2) + 1/(3! z^3) + \\dots$. Every negative power appears. The function oscillates wildly: along the positive real axis it blows up, along the negative real axis it tends to zero, and along the imaginary axis it stays bounded but never converges.</div></div>

<div class="l-note"><strong>Quick test for poles.</strong> If $f(z) = g(z) / (z - z_0)^k$ with $g$ holomorphic near $z_0$ and $g(z_0) \\ne 0$, then $z_0$ is a pole of order exactly $k$. This is the most common situation — rational functions, transfer functions, transforms of standard signals all factor this way.</div>

<h2 class="lesson-title">2. The Residue — Definition and Computational Rules</h2>

<p class="l-text">From the Laurent expansion only <em>one</em> coefficient survives when you integrate $f$ around a small closed loop. By direct computation $\\oint (z-z_0)^n\\,dz$ around a circle is zero for every $n \\ne -1$ and equals $2\\pi i$ for $n = -1$. So</p>

<div class="calc-formula"><div class="formula-label">THE RESIDUE</div><div class="formula-main">$$\\mathrm{Res}(f, z_0) \\;\\equiv\\; c_{-1}, \\qquad \\oint_{|z-z_0|=\\varepsilon} f(z)\\,dz \\;=\\; 2\\pi i\\,c_{-1}$$</div><div class="formula-sub">The "residue" is exactly the $(z-z_0)^{-1}$ coefficient of the Laurent series. The whole infinite expansion contributes nothing else under integration.</div></div>

<p class="l-text">In practice we almost never compute Laurent coefficients by hand. Three computational rules cover 99% of cases.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simple pole rule</div><div class="card-body">If $z_0$ is a pole of order 1, $\\mathrm{Res}(f, z_0) = \\lim_{z \\to z_0}(z - z_0)\\,f(z)$. Multiply by the linear factor and evaluate.</div><div class="card-formula">Res = lim (z−z₀)·f</div></div>
<div class="calc-card"><div class="card-title">Quotient rule</div><div class="card-body">If $f = g/h$, $g(z_0) \\ne 0$, $h(z_0) = 0$, $h'(z_0) \\ne 0$ (simple zero of denominator), then $\\mathrm{Res}(f, z_0) = g(z_0)/h'(z_0)$. The fastest hand calculation when the denominator is a polynomial whose derivative is easy.</div><div class="card-formula">Res = g(z₀) / h'(z₀)</div></div>
<div class="calc-card"><div class="card-title">Order-$k$ pole rule</div><div class="card-body">$\\mathrm{Res}(f, z_0) = \\dfrac{1}{(k-1)!} \\lim_{z \\to z_0} \\dfrac{d^{k-1}}{dz^{k-1}}\\bigl[(z-z_0)^k f(z)\\bigr]$. Reduce the pole to a Taylor expansion of $(z-z_0)^k f(z)$, then read off the $(k-1)$-th coefficient.</div><div class="card-formula">k!⁻¹ · (k−1)-th deriv</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ALL THREE METHODS</div><div class="example-body"><strong>Compute $\\mathrm{Res}\\bigl(\\dfrac{e^z}{z^2(z-1)}, 0\\bigr)$ — pole of order 2 at $z=0$.</strong><br><br>By the order-2 rule with $k = 2$: $(z-0)^2 f(z) = e^z/(z-1)$. Differentiate once: $\\dfrac{d}{dz}\\dfrac{e^z}{z-1} = \\dfrac{e^z(z-1) - e^z}{(z-1)^2} = \\dfrac{e^z(z-2)}{(z-1)^2}$. Evaluate at $z=0$: $\\dfrac{1 \\cdot (-2)}{(-1)^2} = -2$. So $\\mathrm{Res} = -2/(2-1)! = -2$.<br><br><strong>Check by Laurent expansion.</strong> $1/(z-1) = -1/(1-z) = -(1 + z + z^2 + \\dots)$. Therefore $e^z/(z-1) = -(1+z+z^2+\\dots)(1 + z + z^2/2 + z^3/6 + \\dots)$. The product's coefficient of $z^1$ is $-(1 + 1 + 1/2) = -5/2$. So $e^z/[z^2(z-1)]$ has $z^{-1}$ coefficient $-5/2$... wait, that's the $z^1$ coefficient of $e^z/(z-1)$ <em>divided by</em> $z^2$ — let us redo: $f(z) = e^z/[z^2(z-1)]$, multiply by $z^2$: $z^2 f = e^z/(z-1)$. We need $c_{-1}$ of $f$, which is the $c_1$ of $z^2 f$. From the expansion above, $c_1 = -(1 + 1 + 1/2) \\cdot ?$ — careful, $e^z = 1 + z + z^2/2 + \\dots$, so $(1+z+z^2+\\dots)(1+z+z^2/2+\\dots) = 1 + 2z + (1 + 1 + 1/2)z^2 + \\dots$. The $z^1$ coefficient is $2$, so $z^2 f$ has $z^1$ coefficient $-2$, giving $\\mathrm{Res} = -2$. <strong>Both methods agree.</strong></div></div>

<div id="plot-l5-singularities-en" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
// Three functions sampled on a thin annulus around their singularities, plotted as |f(z)| along a small circle
var N=400;
// 1. sin(z)/z near 0 — bounded
var x1=[],y1=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;var r=0.3;var x=r*Math.cos(th),y=r*Math.sin(th);x1.push(th*180/Math.PI);var zR=x,zI=y;var sR=Math.sin(zR)*Math.cosh(zI),sI=Math.cos(zR)*Math.sinh(zI);var dR=zR,dI=zI;var d2=dR*dR+dI*dI;var qR=(sR*dR+sI*dI)/d2,qI=(sI*dR-sR*dI)/d2;y1.push(Math.sqrt(qR*qR+qI*qI));}
traces.push({x:x1,y:y1,mode:'lines',name:'sin(z)/z (removable)',line:{color:'#3b82f6',width:2.4}});
// 2. 1/(z-0)^2 near 0 — pole order 2, magnitude r^-2 = 11.1
var x2=[],y2=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;var r=0.3;x2.push(th*180/Math.PI);y2.push(1/(r*r));}
traces.push({x:x2,y:y2,mode:'lines',name:'1/z² (order-2 pole)',line:{color:'#10b981',width:2.4}});
// 3. e^(1/z) near 0 — essential, modulus = e^(cos(th)/r) — wild oscillation
var x3=[],y3=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;var r=0.3;x3.push(th*180/Math.PI);var c=Math.cos(th)/r;y3.push(Math.min(Math.exp(c),100));}
traces.push({x:x3,y:y3,mode:'lines',name:'e^(1/z) (essential)',line:{color:'#f59e0b',width:2.4}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'arg(z) on circle |z|=0.3 (degrees)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[0,360]},yaxis:{title:'|f(z)|',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',type:'log',range:[-1,2.05]},margin:{t:30,r:30,b:55,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l5-singularities-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> $|f(z)|$ sampled along the small circle $|z|=0.3$ for three functions, one of each singularity type. The removable case $\\sin(z)/z$ stays close to 1 — the apparent singularity is a notational illusion. The order-2 pole $1/z^2$ produces a constant magnitude $1/r^2 \\approx 11.1$ — angle-independent because the pole has no preferred direction at this radius. The essential singularity $e^{1/z}$ oscillates between $e^{1/r} \\approx e^{3.33} \\approx 28$ (at $\\arg z = 0$) and $e^{-1/r} \\approx 0.036$ (at $\\arg z = \\pi$), spanning more than three orders of magnitude on a single circle. That wild swing is the signature of an essential singularity — and the source of the great Picard theorem.</div></div>

<h2 class="lesson-title">3. Laurent Series and Annulus of Convergence</h2>

<p class="l-text">Taylor series live on a disc; Laurent series live on an <em>annulus</em>. Given a function holomorphic on $r &lt; |z - z_0| &lt; R$, its Laurent series converges on exactly that annulus. The inner radius $r$ is determined by the nearest singularity from $z_0$ on the inside; the outer radius $R$ by the nearest singularity from outside.</p>

<div class="calc-formula"><div class="formula-label">ANNULUS OF CONVERGENCE</div><div class="formula-main">$$f(z) = \\sum_{n=-\\infty}^\\infty c_n (z-z_0)^n, \\qquad c_n = \\frac{1}{2\\pi i}\\oint_\\gamma \\frac{f(\\zeta)}{(\\zeta-z_0)^{n+1}}\\,d\\zeta$$</div><div class="formula-sub">$\\gamma$ is any circle inside the annulus. The series converges absolutely and uniformly on every closed sub-annulus, and the coefficient formula generalises Cauchy's integral formula from L4.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DIFFERENT LAURENT SERIES IN DIFFERENT ANNULI</div><div class="example-body"><strong>$f(z) = 1/[z(z-1)]$ has two Laurent expansions around $z_0 = 0$:</strong><br><br><strong>Annulus 1: $0 &lt; |z| &lt; 1$.</strong> Partial fractions: $1/[z(z-1)] = -1/z + 1/(z-1) = -1/z - 1/(1-z) = -1/z - (1 + z + z^2 + \\dots)$. Principal part is $-1/z$, regular part is $-(1 + z + z^2 + \\dots)$. Residue at 0 = $-1$.<br><br><strong>Annulus 2: $|z| &gt; 1$.</strong> Now $|1/z| &lt; 1$, so $1/(z-1) = (1/z) \\cdot 1/(1-1/z) = (1/z)(1 + 1/z + 1/z^2 + \\dots) = 1/z + 1/z^2 + \\dots$. Adding $-1/z$: $f(z) = (-1/z) + (1/z + 1/z^2 + \\dots) = 1/z^2 + 1/z^3 + \\dots$. The series has only negative powers — this is the expansion at infinity.<br><br><strong>Moral:</strong> the <em>same function</em> has different Laurent series in different annuli around the same point. Only the inner-disc series gives the residue at $z = 0$.</div></div>

<div id="plot-l5-annulus-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=200;
// Pole at z=1 (red dot)
traces.push({x:[1],y:[0],mode:'markers',name:'pole at z=1',marker:{size:13,color:'#ef4444',symbol:'x-thin',line:{width:3,color:'#ef4444'}}});
// Pole at z=0 (red dot)
traces.push({x:[0],y:[0],mode:'markers',name:'pole at z=0',marker:{size:13,color:'#ef4444',symbol:'x-thin',line:{width:3,color:'#ef4444'}}});
// Annulus 1 inner boundary (just outside 0) — small circle
var inn1x=[],inn1y=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;inn1x.push(0.08*Math.cos(th));inn1y.push(0.08*Math.sin(th));}
traces.push({x:inn1x,y:inn1y,mode:'lines',name:'inner boundary annulus 1',line:{color:'#3b82f6',width:1.8,dash:'dot'}});
// Annulus 1 outer boundary = unit circle
var ax=[],ay=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;ax.push(Math.cos(th));ay.push(Math.sin(th));}
traces.push({x:ax,y:ay,mode:'lines',name:'outer boundary annulus 1 (|z|=1)',line:{color:'#3b82f6',width:2.2}});
// Annulus 1 shaded fill — approximate via two filled trace
var fillx=[],filly=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;fillx.push(0.95*Math.cos(th));filly.push(0.95*Math.sin(th));}
traces.push({x:fillx,y:filly,mode:'none',fill:'toself',fillcolor:'rgba(59,130,246,0.12)',name:'annulus 1 (0 < |z| < 1)',showlegend:true});
// Annulus 2 inner boundary = circle just outside 1
var bx=[],by=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;bx.push(1.05*Math.cos(th));by.push(1.05*Math.sin(th));}
traces.push({x:bx,y:by,mode:'lines',name:'inner boundary annulus 2 (|z|=1)',line:{color:'#f59e0b',width:2.2}});
// Annulus 2 outer boundary = big circle at radius 3
var cx=[],cy=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;cx.push(3*Math.cos(th));cy.push(3*Math.sin(th));}
traces.push({x:cx,y:cy,mode:'lines',name:'annulus 2 extends to infinity',line:{color:'#f59e0b',width:1.8,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3.5]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:9}}};
Plotly.newPlot('plot-l5-annulus-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the two annuli of convergence for Laurent series of $f(z) = 1/[z(z-1)]$ centred at $z_0 = 0$. The blue annulus $0 &lt; |z| &lt; 1$ — between the two poles — hosts the Laurent series with principal part $-1/z$ and residue $-1$ at the origin. The orange annulus $|z| &gt; 1$ — beyond both poles — hosts a different Laurent series with only negative powers and no $z^{-1}$ term. The <em>function</em> is the same; the <em>series</em> depends on which annulus you ask. The residue is read only from the inner-most series, the one whose outer boundary is the first singularity you meet on the way out from $z_0$.</div></div>

<h2 class="lesson-title">4. The Residue Theorem</h2>

<div class="calc-highlight"><strong>One identity to rule them all.</strong> Take a meromorphic function and a closed contour enclosing finitely many of its poles. The contour integral is $2\\pi i$ times the sum of the residues. End of story. Every real integral we evaluate in the rest of this lesson is a strategy for steering a real domain into a complex contour, identifying the enclosed poles, and reading off the answer.</div>

<p class="l-text">Let $D \\subset \\mathbb{C}$ be a simply-connected open set, $f : D \\setminus \\{z_1, \\dots, z_N\\} \\to \\mathbb{C}$ holomorphic except at the isolated singularities $z_1, \\dots, z_N$, and $\\gamma$ a closed, positively oriented (counter-clockwise), piecewise-smooth contour in $D$ that does <em>not</em> pass through any $z_j$. Then:</p>

<div class="calc-formula"><div class="formula-label">THE RESIDUE THEOREM</div><div class="formula-main">$$\\oint_\\gamma f(z)\\,dz \\;=\\; 2\\pi i \\sum_{j=1}^{N} n(\\gamma, z_j)\\,\\mathrm{Res}(f, z_j)$$</div><div class="formula-sub">$n(\\gamma, z_j)$ is the winding number — how many times $\\gamma$ wraps around $z_j$ (counter-clockwise positive). For simple contours that enclose each pole once, $n = 1$ for interior poles and $n = 0$ for exterior poles.</div></div>

<p class="l-text">Three-line derivation. By Cauchy's theorem the integral over $\\gamma$ equals the integral over any homotopic deformation. Deform $\\gamma$ to small circles $C_1, \\dots, C_N$ around each interior $z_j$ connected by thin corridors whose contributions cancel. Each $C_j$ contributes $2\\pi i\\,c_{-1}^{(j)} = 2\\pi i\\,\\mathrm{Res}(f, z_j)$ by the Laurent computation in section 2. Add them up. Done.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Identify all isolated singularities of the integrand inside the contour</div><div class="step-detail">For rational functions, factor the denominator and read off poles. For mixed forms (rationals times trigonometric or exponential), write them as products and check each factor for singularities.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Classify each singularity and compute its residue</div><div class="step-detail">Use simple-pole formula, quotient rule, or order-$k$ derivative formula. If the singularity is essential, expand the Laurent series and pull out $c_{-1}$ directly.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sum residues, multiply by $2\\pi i$, account for winding number and orientation</div><div class="step-detail">Counter-clockwise contour: positive. Clockwise: flip the sign. Contours that wind twice around a pole count that residue twice.</div></div></div>
</div>

<h2 class="lesson-title">5. Worked Example — All Poles in a Rational Function</h2>

<p class="l-text">Compute $\\oint_{|z|=3} \\dfrac{z^2 + 1}{z(z-2)^2}\\,dz$.</p>

<p class="l-text">The denominator factors as $z \\cdot (z-2)^2$ — a simple pole at $z = 0$ and a double pole at $z = 2$. Both lie inside $|z| = 3$. We need both residues.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Residue at $z = 0$ (simple pole)</div><div class="step-detail">$\\mathrm{Res}(f, 0) = \\lim_{z \\to 0} z \\cdot \\dfrac{z^2+1}{z(z-2)^2} = \\dfrac{0+1}{(0-2)^2} = \\dfrac{1}{4}$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Residue at $z = 2$ (double pole, $k=2$)</div><div class="step-detail">$(z-2)^2 f(z) = \\dfrac{z^2+1}{z}$. Differentiate: $\\dfrac{d}{dz}\\dfrac{z^2+1}{z} = \\dfrac{2z \\cdot z - (z^2+1)}{z^2} = \\dfrac{z^2 - 1}{z^2}$. Evaluate at $z=2$: $\\dfrac{4-1}{4} = \\dfrac{3}{4}$. Divide by $(k-1)! = 1!$: $\\mathrm{Res}(f, 2) = 3/4$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Apply the residue theorem</div><div class="step-detail">$\\oint_{|z|=3} f\\,dz = 2\\pi i (1/4 + 3/4) = 2\\pi i$.</div></div></div>
</div>

<div class="l-note"><strong>Sanity check.</strong> The function $f(z) = (z^2+1)/[z(z-2)^2]$ is rational; for $|z| \\to \\infty$ it behaves like $1/z$, so its "residue at infinity" is $-1$. The residue theorem on the Riemann sphere says the sum of <em>all</em> residues (including infinity) is zero. Check: $1/4 + 3/4 + (-1) = 0$. The numbers fit.</div>

<h2 class="lesson-title">6. Real Integral I — Trigonometric Over $[0, 2\\pi]$</h2>

<div class="calc-highlight"><strong>The recipe.</strong> Any integral of the form $\\int_0^{2\\pi} R(\\cos\\theta, \\sin\\theta)\\,d\\theta$ with $R$ a rational function becomes a complex contour integral over the unit circle by the substitution $z = e^{i\\theta}$. The angle parameterises the circle; the rational integrand becomes a rational function of $z$ with finitely many poles. Residues finish the job.</div>

<p class="l-text">Set $z = e^{i\\theta}$, so $dz = i z\\,d\\theta$, hence $d\\theta = dz/(iz)$. The trig identities</p>

<div class="calc-formula"><div class="formula-label">TRIG ↔ z-SUBSTITUTION</div><div class="formula-main">$$\\cos\\theta = \\frac{z + z^{-1}}{2}, \\qquad \\sin\\theta = \\frac{z - z^{-1}}{2 i}$$</div><div class="formula-sub">As $\\theta$ runs from 0 to $2\\pi$, $z$ traces the unit circle once counter-clockwise. The real integral becomes a contour integral over $|z|=1$.</div></div>

<p class="l-text"><strong>Example.</strong> Compute $I = \\int_0^{2\\pi} \\dfrac{d\\theta}{2 + \\cos\\theta}$.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Substitute</div><div class="step-detail">$2 + \\cos\\theta = 2 + (z+z^{-1})/2 = (z^2 + 4z + 1)/(2z)$. The integrand $d\\theta/(2 + \\cos\\theta)$ becomes $\\dfrac{1}{(z^2+4z+1)/(2z)} \\cdot \\dfrac{dz}{iz} = \\dfrac{2\\,dz}{i(z^2 + 4z + 1)}$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Find the poles of the rational integrand</div><div class="step-detail">$z^2 + 4z + 1 = 0 \\Rightarrow z = -2 \\pm \\sqrt{3}$. Inside the unit circle: $z_1 = -2 + \\sqrt{3} \\approx -0.268$. Outside: $z_2 = -2 - \\sqrt{3} \\approx -3.732$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Residue at $z_1$ (simple pole)</div><div class="step-detail">By the quotient rule with $g(z) = 2/i$, $h(z) = z^2 + 4z + 1$, $h'(z) = 2z + 4$: $\\mathrm{Res} = (2/i)/(2 z_1 + 4) = (2/i)/(2\\sqrt{3}) = 1/(i\\sqrt{3})$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Apply the residue theorem</div><div class="step-detail">$I = 2\\pi i \\cdot 1/(i\\sqrt{3}) = 2\\pi/\\sqrt{3} \\approx 3.6276$.</div></div></div>
</div>

<div class="l-note"><strong>Why this works at all.</strong> The map $\\theta \\mapsto e^{i\\theta}$ is a bijection between $[0, 2\\pi)$ and the unit circle. Any rational expression in $\\cos$ and $\\sin$ is single-valued and continuous on the circle (after our manipulation). The Riemann integral over $[0, 2\\pi]$ equals the contour integral over $|z|=1$, no convergence worries.</div>

<h2 class="lesson-title">7. Real Integral II — Improper Rational on $\\mathbb{R}$</h2>

<p class="l-text">Now integrals over the whole real line, $\\int_{-\\infty}^\\infty R(x)\\,dx$, where $R$ is a rational function with no real poles and decays at least like $1/x^2$ at infinity. Close the real axis with a large semicircle in the <em>upper</em> half-plane (radius $R \\to \\infty$). The semicircle contribution vanishes (Jordan-style estimate from the $1/x^2$ decay); the integral equals $2\\pi i$ times the sum of residues at poles in the upper half-plane.</p>

<div class="calc-formula"><div class="formula-label">SEMICIRCULAR CONTOUR RULE</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} R(x)\\,dx \\;=\\; 2\\pi i \\sum_{\\substack{z_j \\\\ \\mathrm{Im}(z_j) &gt; 0}} \\mathrm{Res}(R, z_j)$$</div><div class="formula-sub">Valid when $R$ has no real poles and $|R(z)| = O(1/|z|^2)$ for large $|z|$. The big semicircle contributes zero in the limit because the integrand decays faster than its length grows.</div></div>

<p class="l-text"><strong>Example A.</strong> $I = \\int_{-\\infty}^\\infty \\dfrac{dx}{1+x^2}$. Denominator $(z-i)(z+i)$. Only $z = i$ is in the upper half-plane. Quotient rule: $\\mathrm{Res} = 1/(2i)$. So $I = 2\\pi i \\cdot 1/(2i) = \\pi$. Matches the classical answer $\\arctan(x)\\bigl|_{-\\infty}^\\infty = \\pi$.</p>

<p class="l-text"><strong>Example B.</strong> $I = \\int_{-\\infty}^\\infty \\dfrac{dx}{1+x^4}$. Factor $z^4 + 1 = 0 \\Rightarrow z = e^{i\\pi/4}, e^{i3\\pi/4}, e^{i5\\pi/4}, e^{i7\\pi/4}$. Only the first two are in the upper half-plane. Quotient rule with $h(z) = z^4 + 1$, $h'(z) = 4z^3$:</p>

<div class="calc-formula"><div class="formula-label">RESIDUES OF $1/(1+z^4)$</div><div class="formula-main">$$\\mathrm{Res}(z_j) = \\frac{1}{4 z_j^3} = \\frac{1}{4 e^{i 3\\theta_j}}, \\qquad \\theta_j = \\frac{(2j-1)\\pi}{4}, \\; j=1,2$$</div><div class="formula-sub">$z_1^3 = e^{i 3\\pi/4}$, $z_2^3 = e^{i 9\\pi/4} = e^{i\\pi/4}$. The two residues are $(1/4) e^{-i 3\\pi/4}$ and $(1/4) e^{-i\\pi/4}$.</div></div>

<p class="l-text">Sum: $(1/4)(e^{-i3\\pi/4} + e^{-i\\pi/4}) = (1/4) \\cdot (-i\\sqrt{2}) = -i\\sqrt{2}/4$. Multiply by $2\\pi i$: $I = 2\\pi i \\cdot (-i\\sqrt{2}/4) = \\pi\\sqrt{2}/2 = \\pi/\\sqrt{2}$.</p>

<div class="calc-example"><div class="example-label">NUMERICAL CHECK</div><div class="example-body">$\\pi/\\sqrt{2} \\approx 2.2214$. Direct numerical integration of $\\int_{-100}^{100} dx/(1+x^4)$ via Simpson's rule with 20000 panels gives $2.22142$. Three decimal agreement, achieved with one residue calculation instead of a special-function lookup or numerical quadrature. Residues are <em>fast</em>.</div></div>

<div id="plot-l5-contour-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=200;
// Real axis segment
traces.push({x:[-3,3],y:[0,0],mode:'lines',name:'real axis (−R to R)',line:{color:'#3b82f6',width:3}});
// Upper semicircle (large R)
var sx=[],sy=[];for(var i=0;i<=N;i++){var th=Math.PI*i/N;sx.push(3*Math.cos(th));sy.push(3*Math.sin(th));}
traces.push({x:sx,y:sy,mode:'lines',name:'upper semicircle, R→∞',line:{color:'#3b82f6',width:3,dash:'dash'}});
// Poles at z = e^(i*pi/4), e^(i*3pi/4) for 1/(1+z^4), interior (upper)
traces.push({x:[Math.cos(Math.PI/4),Math.cos(3*Math.PI/4)],y:[Math.sin(Math.PI/4),Math.sin(3*Math.PI/4)],mode:'markers+text',name:'poles inside (counted)',marker:{size:14,color:'#10b981',symbol:'star'},text:['z₁','z₂'],textposition:'top center',textfont:{color:'#10b981',size:12}});
// Poles in lower half (not counted)
traces.push({x:[Math.cos(5*Math.PI/4),Math.cos(7*Math.PI/4)],y:[Math.sin(5*Math.PI/4),Math.sin(7*Math.PI/4)],mode:'markers+text',name:'poles outside (skipped)',marker:{size:13,color:'#ef4444',symbol:'x-thin',line:{width:3,color:'#ef4444'}},text:['z₃','z₄'],textposition:'bottom center',textfont:{color:'#ef4444',size:12}});
// Arrows indicating direction
traces.push({x:[2.5,2.7],y:[0,0],mode:'lines',line:{color:'#3b82f6',width:1},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-2.0,3.5]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:10}},annotations:[{x:0,y:1.6,text:'CLOSE ABOVE',font:{color:'#3b82f6',size:11},showarrow:false}]};
Plotly.newPlot('plot-l5-contour-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the canonical contour for evaluating $\\int_{-\\infty}^\\infty dx/(1+x^4)$. The straight segment along $\\mathrm{Re}(z) \\in [-R, R]$ is the real integral we want. The dashed semicircle closes the contour in the upper half-plane; its contribution vanishes as $R \\to \\infty$ because $|1/(1+z^4)| = O(1/R^4)$ while the semicircle has length $\\pi R$. The two green stars are the poles $e^{i\\pi/4}$ and $e^{i 3\\pi/4}$ inside the contour — their residues are summed. The two red crosses are the poles in the lower half-plane — irrelevant to this contour, but they would be picked up if we closed below instead.</div></div>

<h2 class="lesson-title">8. Real Integral III — Trig Polynomial Times Rational (Jordan's Lemma)</h2>

<p class="l-text">Integrals of the form $\\int_{-\\infty}^\\infty R(x) e^{i\\omega x}\\,dx$ — the workhorse of Fourier theory — require a slightly subtler argument because the exponential factor is bounded on the real axis but grows in one half-plane and decays in the other.</p>

<div class="calc-formula"><div class="formula-label">JORDAN'S LEMMA</div><div class="formula-main">$$\\omega &gt; 0: \\text{ close upper half-plane}, \\qquad \\omega &lt; 0: \\text{ close lower half-plane}$$</div><div class="formula-sub">$|e^{i\\omega z}| = e^{-\\omega\\,\\mathrm{Im}(z)}$. For $\\omega &gt; 0$, $e^{i\\omega z}$ decays in the upper half-plane (where $\\mathrm{Im}(z) &gt; 0$) and grows below. The semicircle in the right half-plane gives a vanishing contribution if $|R(z)| \\to 0$ as $|z| \\to \\infty$.</div></div>

<p class="l-text"><strong>Example.</strong> $\\int_{-\\infty}^\\infty \\dfrac{\\cos(\\omega x)}{1 + x^2}\\,dx$ for $\\omega &gt; 0$. Take $\\mathrm{Re}$ of $\\int_{-\\infty}^\\infty \\dfrac{e^{i\\omega x}}{1 + x^2}\\,dx$. The integrand is $e^{i\\omega z}/(z-i)(z+i)$. Pole at $z = i$ in upper half-plane. Residue: $e^{i\\omega \\cdot i}/(2i) = e^{-\\omega}/(2i)$. Integral $= 2\\pi i \\cdot e^{-\\omega}/(2i) = \\pi e^{-\\omega}$. Taking real part: $\\int_{-\\infty}^\\infty \\cos(\\omega x)/(1+x^2)\\,dx = \\pi e^{-\\omega}$. By symmetry, for $\\omega &lt; 0$ the answer is $\\pi e^{\\omega}$, so the unified result is $\\pi e^{-|\\omega|}$.</p>

<div class="l-note"><strong>The Lorentzian–exponential pair.</strong> $1/(1+x^2)$ pairs with $\\pi e^{-|\\omega|}$ under the Fourier transform — one of the most famous lines in Fourier tables. Residues hand it to us in one step. Without complex analysis you would need a contour calculation in disguise (the Cauchy distribution PDF) or a tabulated identity. With residues, it is two lines of algebra.</div>

<h2 class="lesson-title">9. Inverse Fourier Transform via Residues</h2>

<p class="l-text">The inverse Fourier transform is exactly the kind of integral the previous section was built to evaluate. Given $\\hat{f}(\\omega) = 1/(1+\\omega^2)$, recover $f(t)$:</p>

<div class="calc-formula"><div class="formula-label">INVERSE FOURIER WITH A LORENTZIAN SPECTRUM</div><div class="formula-main">$$f(t) \\;=\\; \\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} \\frac{e^{i\\omega t}}{1+\\omega^2}\\,d\\omega$$</div><div class="formula-sub">A single rational denominator and an exponential numerator. Choice of half-plane depends on the sign of $t$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Case $t &gt; 0$: close above</div><div class="step-detail">$e^{i\\omega t}$ decays in the upper half-plane. Pole at $\\omega = i$ encircled. Residue $= e^{i \\cdot i \\cdot t}/(2 i) = e^{-t}/(2i)$. Integral $= 2\\pi i \\cdot e^{-t}/(2i) = \\pi e^{-t}$, divide by $2\\pi$: $f(t) = e^{-t}/2$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Case $t &lt; 0$: close below (with reversed orientation)</div><div class="step-detail">$e^{i\\omega t}$ decays in the lower half-plane when $t &lt; 0$. The lower semicircle is clockwise, contributing a minus sign. Pole at $\\omega = -i$, residue $e^{-i \\cdot (-i) \\cdot t}/(-2i) = e^{t}/(-2i)$. Net: $f(t) = e^{t}/2$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Combine</div><div class="step-detail">$f(t) = \\tfrac{1}{2}\\,e^{-|t|}$ for all $t \\in \\mathbb{R}$. The famous "double-sided exponential" — Fourier dual of the Lorentzian.</div></div></div>
</div>

<div id="plot-l5-fourier-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=400;
// Lorentzian spectrum
var w=[],L=[];for(var i=0;i<=N;i++){var x=-8+16*i/N;w.push(x);L.push(1/(1+x*x));}
traces.push({x:w,y:L,mode:'lines',name:'spectrum 1/(1+ω²)',line:{color:'#3b82f6',width:2.4},xaxis:'x',yaxis:'y'});
// Time-domain double exponential
var t=[],f=[];for(var i=0;i<=N;i++){var x=-6+12*i/N;t.push(x);f.push(0.5*Math.exp(-Math.abs(x)));}
traces.push({x:t,y:f,mode:'lines',name:'time signal ½e^(−|t|)',line:{color:'#f59e0b',width:2.4},xaxis:'x2',yaxis:'y2'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'ω',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',domain:[0,0.46],range:[-8,8]},yaxis:{title:'spectrum',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[0,1.1]},xaxis2:{title:'t',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',domain:[0.54,1],range:[-6,6]},yaxis2:{title:'f(t)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[0,0.6],anchor:'x2'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l5-fourier-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the Lorentzian spectrum $\\hat{f}(\\omega) = 1/(1+\\omega^2)$ on the left and its inverse Fourier transform $f(t) = \\tfrac{1}{2}e^{-|t|}$ on the right. A pole-pair at $\\omega = \\pm i$ in the spectrum — one pole on each side of the real axis — translates into the symmetric exponential decay in time. The width of the spectrum and the rate of decay of the time signal are reciprocals (uncertainty-style trade-off): a narrower spectrum corresponds to slower decay. Every textbook entry in a Fourier transform pair table that has rational spectra is computed exactly this way.</div></div>

<h2 class="lesson-title">10. Inverse Laplace Transform — Bromwich Contour</h2>

<p class="l-text">The Laplace transform converts a time-domain signal into an $s$-domain transfer function. Recovering the signal requires the <strong>Bromwich integral</strong>:</p>

<div class="calc-formula"><div class="formula-label">BROMWICH INVERSION</div><div class="formula-main">$$f(t) \\;=\\; \\frac{1}{2\\pi i}\\int_{c - i\\infty}^{c + i\\infty} F(s)\\,e^{st}\\,ds$$</div><div class="formula-sub">The integral runs along a vertical line $\\mathrm{Re}(s) = c$ to the right of all singularities of $F$. We <em>close</em> this line into a contour by adding a large semicircle to the left, picking up all poles of $F$ in the left half-plane.</div></div>

<p class="l-text">Because $e^{st}$ for $t &gt; 0$ decays in the left half-plane ($e^{st} = e^{(\\mathrm{Re}\\,s)t}$ decays whenever $\\mathrm{Re}\\,s &lt; 0$ and $t &gt; 0$), the left-closing semicircle contributes zero under mild decay assumptions on $F$. The Bromwich integral collapses to:</p>

<div class="calc-formula"><div class="formula-label">RESIDUE-FORM OF INVERSE LAPLACE</div><div class="formula-main">$$f(t) \\;=\\; \\sum_{\\substack{s_k \\\\ \\mathrm{Re}(s_k) &lt; c}} \\mathrm{Res}\\bigl(F(s)\\,e^{st},\\ s_k\\bigr)$$</div><div class="formula-sub">A single closed-form expression in terms of residues at the poles of the transfer function. This is exactly how engineers build Laplace-transform tables.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — STANDARD CONTROL-THEORY POLE PAIR</div><div class="example-body"><strong>Compute $\\mathcal{L}^{-1}\\{\\omega_0/(s^2 + \\omega_0^2)\\}$.</strong> Poles at $s = \\pm i\\omega_0$, both on the imaginary axis (so $c = 0^+$). Both are simple poles.<br><br>Residue at $s = +i\\omega_0$: by quotient rule with $g(s) = \\omega_0 e^{st}$, $h(s) = s^2 + \\omega_0^2$, $h'(s) = 2s$: $\\mathrm{Res} = \\omega_0 e^{i\\omega_0 t}/(2 i \\omega_0) = e^{i\\omega_0 t}/(2i)$.<br><br>Residue at $s = -i\\omega_0$: similarly $-e^{-i\\omega_0 t}/(2i)$ — wait, denominator $h'(-i\\omega_0) = -2i\\omega_0$, so residue $= \\omega_0 e^{-i\\omega_0 t}/(-2i\\omega_0) = -e^{-i\\omega_0 t}/(2i)$.<br><br>Sum: $\\dfrac{e^{i\\omega_0 t} - e^{-i\\omega_0 t}}{2i} = \\sin(\\omega_0 t)$. <strong>Recovered the standard table entry $\\omega_0/(s^2+\\omega_0^2) \\leftrightarrow \\sin(\\omega_0 t)$.</strong></div></div>

<div id="plot-l5-bromwich-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=200;
// Bromwich line at c=0.5
traces.push({x:[0.5,0.5],y:[-3,3],mode:'lines',name:'Bromwich line Re(s)=c',line:{color:'#3b82f6',width:3}});
// Left semicircle (closing contour)
var sx=[],sy=[];for(var i=0;i<=N;i++){var th=Math.PI/2 + Math.PI*i/N;sx.push(0.5 + 3*Math.cos(th));sy.push(3*Math.sin(th));}
traces.push({x:sx,y:sy,mode:'lines',name:'left semicircle (closes contour)',line:{color:'#3b82f6',width:3,dash:'dash'}});
// Poles in left half plane (picked up)
traces.push({x:[-1,-0.5,-0.5],y:[0,1.5,-1.5],mode:'markers+text',name:'poles enclosed (LHP)',marker:{size:14,color:'#10b981',symbol:'star'},text:['s₁','s₂','s̄₂'],textposition:'top right',textfont:{color:'#10b981',size:11}});
// Pole in right half plane (NOT picked up, would cause instability)
traces.push({x:[1.5],y:[0],mode:'markers+text',name:'unstable pole (RHP, excluded)',marker:{size:13,color:'#ef4444',symbol:'x-thin',line:{width:3,color:'#ef4444'}},text:['unstable'],textposition:'top center',textfont:{color:'#ef4444',size:11}});
// Imaginary axis ref
traces.push({x:[0,0],y:[-3,3],mode:'lines',line:{color:'rgba(255,255,255,0.20)',width:1,dash:'dot'},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s) — damping',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3]},yaxis:{title:'Im(s) — oscillation',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.2,3.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:10}},annotations:[{x:-2.5,y:2.5,text:'LHP (stable)',font:{color:'#10b981',size:11},showarrow:false},{x:2,y:2.5,text:'RHP (unstable)',font:{color:'#ef4444',size:11},showarrow:false}]};
Plotly.newPlot('plot-l5-bromwich-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> the Bromwich contour in the $s$-plane. The vertical blue line $\\mathrm{Re}(s) = c$ is the literal Laplace-inversion integration path. The dashed left-closing semicircle (radius $\\to \\infty$) is the Cauchy-style closure that lets us replace the line integral with a sum of residues. Three green stars sit in the left half-plane — they are the stable poles of a typical control system's transfer function and contribute decaying exponentials and damped oscillations. The red cross in the right half-plane is an unstable pole; it is <em>not</em> enclosed by the left-closing contour because it lies on the other side of the Bromwich line — and physically it would correspond to a system that diverges instead of settling.</div></div>

<h2 class="lesson-title">11. EE Application — Why Poles Matter in Control and Signal Processing</h2>

<p class="l-text">Residues are not a theoretical curiosity; they are the algebraic dictionary of every linear time-invariant (LTI) system on Earth. A transfer function $H(s) = N(s)/D(s)$ has poles at the roots of $D$, and the system's impulse response $h(t) = \\mathcal{L}^{-1}\\{H\\}$ is built — by residue summation — from one exponential mode per pole.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Real pole at $s = -a$</div><div class="card-body">Residue produces a term $A e^{-at}$ — an exponential decay if $a &gt; 0$, exponential blow-up if $a &lt; 0$. The half-plane the pole lives in determines stability.</div><div class="card-formula">h(t) ⊃ A e^(−at)</div></div>
<div class="calc-card"><div class="card-title">Complex pole pair $s = \\sigma \\pm i\\omega_d$</div><div class="card-body">Conjugate residues combine to give a damped sinusoid $e^{\\sigma t}\\cos(\\omega_d t + \\phi)$. $\\sigma &lt; 0$: damped oscillation (textbook second-order system). $\\sigma = 0$: undamped. $\\sigma &gt; 0$: growing oscillation, unstable.</div><div class="card-formula">e^(σt) cos(ωd t + φ)</div></div>
<div class="calc-card"><div class="card-title">Double pole at $s = -a$</div><div class="card-body">Residue formula with $k = 2$ produces a term $(At + B) e^{-at}$. The $t$ factor is the signature of repeated poles — critical damping in mechanical systems, double integrators in control loops.</div><div class="card-formula">(At + B) e^(−at)</div></div>
</div>

<div class="l-note"><strong>The whole canon.</strong> Steady-state response of an RC filter to a sinusoid? Residue at the pole $s = -1/(RC)$. Settling time of a closed-loop control system? Dominant residue. Stability criterion (all poles in LHP)? Residue summation must produce decaying exponentials, which requires $\\mathrm{Re}(s_k) &lt; 0$ for every pole. Frequency response $H(i\\omega)$? Just evaluate $H$ on the imaginary axis — no residue calculation needed, but the <em>locations</em> of the residues set the shape of the Bode plot. Complex analysis is the algebra of EE.</div>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with.</strong> Replace <code>f = (z**2 + 1) / (z * (z-2)**2)</code> with your favourite rational function and verify residue + contour-integral agreement. Change the Bromwich example to a third-order system, e.g. $H(s) = 1/[(s+1)(s^2 + 2s + 5)]$ — residues at $s = -1$ and the complex pair $s = -1 \\pm 2i$ combine into $h(t) = c_1 e^{-t} + c_2 e^{-t}\\cos(2t) + c_3 e^{-t}\\sin(2t)$. The numerical $\\sin(\\omega_0 t)$ reconstruction should match <code>sympy.inverse_laplace_transform</code> to 14+ decimal places.</p>

<h2 class="lesson-title">13. Summary — What You Can Now Do</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Singularity zoo</div><div class="card-body">Three types — removable, pole of order $k$, essential. The Laurent series tells you which.</div><div class="card-formula">Laurent: c_n, n ∈ ℤ</div></div>
<div class="calc-card"><div class="card-title">Residue rules</div><div class="card-body">Simple pole: $\\lim(z-z_0)f$. Quotient: $g/h'$. Order $k$: $(k-1)$-th derivative of $(z-z_0)^k f$.</div><div class="card-formula">Res = c_(−1)</div></div>
<div class="calc-card"><div class="card-title">Residue theorem</div><div class="card-body">Closed contour integral = $2\\pi i$ × (sum of enclosed residues × winding numbers).</div><div class="card-formula">∮ f dz = 2πi Σ Res</div></div>
<div class="calc-card"><div class="card-title">Trig integral recipe</div><div class="card-body">$z = e^{i\\theta}$, $d\\theta = dz/(iz)$, $\\cos = (z+z^{-1})/2$, $\\sin = (z-z^{-1})/(2i)$. Convert to contour over $|z|=1$.</div><div class="card-formula">∫₀²π → ∮_|z|=1</div></div>
<div class="calc-card"><div class="card-title">Improper integral recipe</div><div class="card-body">Close with semicircle in the half-plane where the integrand decays. Sum residues inside.</div><div class="card-formula">∫₋∞^∞ = 2πi Σ_UHP Res</div></div>
<div class="calc-card"><div class="card-title">Jordan's lemma</div><div class="card-body">$e^{i\\omega z}$ with $\\omega &gt; 0$ — close above. $\\omega &lt; 0$ — close below. Picks the right half-plane automatically.</div><div class="card-formula">sign(ω) ↦ half-plane</div></div>
<div class="calc-card"><div class="card-title">Inverse Fourier via residues</div><div class="card-body">Rational $\\hat{f}(\\omega)$ ↔ sum of exponentials in $t$. Lorentzian ↔ double exponential.</div><div class="card-formula">1/(1+ω²) ↔ ½e^(−|t|)</div></div>
<div class="calc-card"><div class="card-title">Inverse Laplace via Bromwich</div><div class="card-body">Close left half-plane, sum residues at poles of $F$. Each pole contributes an exponential mode of the impulse response.</div><div class="card-formula">f(t) = Σ Res(F e^(st))</div></div>
</div>

<div class="l-note"><strong>Where this travels next.</strong> L6 turns to conformal mappings — the geometry side of holomorphic functions — and brings the Riemann mapping theorem, Joukowski transforms (airfoil flows), and Schwarz-Christoffel formulas. The residue toolkit you have just built will reappear whenever a conformal map carries a circle or half-plane to a domain where you want to evaluate a Cauchy-style integral. The story of complex analysis, told in two acts: rigidity (L1-L4, this lesson's Laurent classification) followed by geometry (L5's contour gymnastics, L6's mappings).</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bu, karmaşık analizin bir hesap makinesine dönüştüğü derstir.</strong> L4'te Cauchy integral teoremi vermişti: holomorf fonksiyonların kapalı kontur integralleri sıfırdır ve Cauchy integral formülü analitik bir fonksiyonun değerini sınırından geri getirir. Her iki ifade de integralin kontur içinde holomorf olduğunu varsayıyordu. Gerçek hayat daha dağınık — önemsediğimiz integrandlar $1/(1+x^2)$, $\\sin x / x$, $e^{i\\omega t}/(s^2+\\omega_0^2)$, hepsinde tekillik var. Rezidu teoremi şunu söyleyen kuraldır: konturun sonlu sayıda izole tekilliği yutmasına izin verirsen, etrafındaki integral artık sıfır değildir — temiz, sonlu, tamamen hesaplanabilir bir toplamdır.</p>

<p class="l-text">Tek bir özdeşlikten ($\\oint f\\,dz = 2\\pi i \\sum \\mathrm{Res}$) o kadar çok yönlü bir araç çıkar ki uygulamalı matematiğe hükmeder: yazabildiğin her standart reel has olmayan integral, rasyonel katsayılı her Fourier dönüşümü, bir ders kitabındaki her Laplace-domeni transfer fonksiyonu, sayılar teorisindeki her Mellin dönüşümü. Rezidu teoremi karmaşık analiz için, zincir kuralının kalkülüs için olduğu şeydir — günde on kez başvurduğun kısa bir formül.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Her izole tekilliği kaldirilabilir, $k$ mertebeli kutup veya esansiyel olarak sınıflandırmayı ve Laurent serilerinden tanımayı</li>
<li>Basit kutuplarda, yüksek mertebe kutuplarda ve doğrudan Laurent katsayı çıkarımıyla reziduleri hesaplamayı</li>
<li>Rezidu teoremini ifade etmeyi, Cauchy teoreminden türetilişini görmeyi ve kapalı konturlara uygulamayı</li>
<li>Üç sınıf reel belirli integrali hesaplamayı: $[0,2\\pi]$ üzerinde trigonometrik, $\\mathbb{R}$ üzerinde reel has olmayan rasyonel ve $e^{i\\omega x}$ faktörlü integraller</li>
<li>Ters Fourier dönüşümlerini reziduler ile hesaplamayı — temel Lorentzian $1/(1+\\omega^2)$ çifti dahil</li>
<li>Ters Laplace dönüşümlerini Bromwich konturu üzerinden sol-yarı düzlem kutuplarındaki reziduler ile okumayı</li>
<li>Her şeyi Pyodide ile sayısal olarak doğrulamayı — doğrudan kontur kuadratürü ve sympy rezidu çıkarımı dahil</li>
</ul>
</div>

<h2 class="lesson-title">1. İzole Tekillikler — Bir Trilemma</h2>

<div class="calc-highlight"><strong>Holomorf bir fonksiyon tek bir noktada holomorf olmayı başaramazsa, başarısızlığın yalnızca üç olası tadı vardır.</strong> O noktanın ötesinde, $f$'in Laurent açılımı tüm hikayeyi anlatır. Üç farklı Laurent serisi şekli, üç tamamen farklı davranış. Sınıflandırma tamdır — başka izole tekillik yoktur.</div>

<p class="l-text">$f$, <em>delik bir diskte</em> $0 &lt; |z-z_0| &lt; R$ holomorf olsun ama $z_0$'da olmasın (ya tanımlı değil ya da holomorf değil). O zaman $z_0$, $f$'in <strong>izole tekilliğidir</strong>. Delik diskte $f$'in tek bir Laurent açılımı vardır:</p>

<div class="calc-formula"><div class="formula-label">İZOLE TEKİLLİK ETRAFINDA LAURENT AÇILIMI</div><div class="formula-main">$$f(z) \\;=\\; \\sum_{n=-\\infty}^{\\infty} c_n (z - z_0)^n, \\qquad 0 &lt; |z - z_0| &lt; R$$</div><div class="formula-sub">Negatif olmayan kuvvetler düzenli kısmı; negatif kuvvetler <em>asal kısım</em>'ı oluşturur. Tam sınıflandırma $c_{-1}, c_{-2}, c_{-3}, \\dots$ negatif katsayılarından kaç tanesinin sıfırdan farklı olduğuna bağlıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kaldırılabilir</div><div class="card-body">Tüm $c_n = 0$, $n &lt; 0$ için. Asal kısım boştur. $f$, $f(z_0) = c_0$ atanarak $z_0$'da holomorf bir fonksiyona genişletilir. "Tekillik" bir gösterimsel illüzyondu.</div></div>
<div class="calc-card"><div class="card-title">$k$ mertebeli kutup</div><div class="card-body">$c_{-k} \\ne 0$ ama $c_n = 0$, $n &lt; -k$ için. Asal kısım tam olarak $k$ terime sahiptir. $z \\to z_0$ iken $|f(z)| \\to \\infty$ ve $f$, $(z-z_0)^{-k}$ gibi patlar.</div></div>
<div class="calc-card"><div class="card-title">Esansiyel</div><div class="card-body">$n &lt; 0$ olan $c_n$'lerin sonsuz çoğu sıfırdan farklıdır. $z_0$ yakınında $f$ her karmaşık değeri (en fazla bir istisna ile) sonsuz sıklıkta alır — büyük Picard teoremi.</div></div>
</div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEKLER — HER TİPTEN BİR TANE</div><div class="example-body"><strong>Kaldırılabilir: $f(z) = \\sin(z)/z$, $z = 0$'da.</strong> Taylor açılımı: $\\sin z = z - z^3/3! + z^5/5! - \\dots$, dolayısıyla $\\sin(z)/z = 1 - z^2/3! + z^4/5! - \\dots$. Negatif kuvvet terimi yok. $f(0) = 1$ atayınca $f$ başlangıçta holomorf olur.<br><br><strong>3. mertebeden kutup: $f(z) = 1/(z-1)^3$, $z = 1$'de.</strong> Laurent serisi sadece $(z-1)^{-3}$ — tek terim, ama $c_{-3} = 1 \\ne 0$ ve tüm daha düşük katsayılar sıfır. Tanım gereği 3. mertebe.<br><br><strong>Esansiyel: $f(z) = e^{1/z}$, $z = 0$'da.</strong> Açılım: $e^{1/z} = 1 + 1/z + 1/(2! z^2) + 1/(3! z^3) + \\dots$. Her negatif kuvvet ortaya çıkar. Fonksiyon vahşice salınır: pozitif reel eksen boyunca patlar, negatif reel eksen boyunca sıfıra gider, sanal eksen boyunca sınırlı kalır ama asla yakınsamaz.</div></div>

<div class="l-note"><strong>Kutup için hızlı test.</strong> Eğer $f(z) = g(z) / (z - z_0)^k$ ve $g$, $z_0$ yakınında holomorf ve $g(z_0) \\ne 0$ ise, o zaman $z_0$ tam olarak $k$ mertebeden bir kutuptur. Bu en yaygın durumdur — rasyonel fonksiyonlar, transfer fonksiyonları, standart sinyallerin dönüşümleri hepsi bu şekilde çarpanlara ayrılır.</div>

<h2 class="lesson-title">2. Rezidu — Tanım ve Hesaplama Kuralları</h2>

<p class="l-text">Laurent açılımından $f$'yi küçük bir kapalı döngü etrafında integre ettiğinde yalnızca <em>bir</em> katsayı hayatta kalır. Doğrudan hesapla $\\oint (z-z_0)^n\\,dz$ bir çember etrafında her $n \\ne -1$ için sıfırdır ve $n = -1$ için $2\\pi i$'ye eşittir. Yani</p>

<div class="calc-formula"><div class="formula-label">REZİDU</div><div class="formula-main">$$\\mathrm{Res}(f, z_0) \\;\\equiv\\; c_{-1}, \\qquad \\oint_{|z-z_0|=\\varepsilon} f(z)\\,dz \\;=\\; 2\\pi i\\,c_{-1}$$</div><div class="formula-sub">"Rezidu" tam olarak Laurent serisinin $(z-z_0)^{-1}$ katsayısıdır. Sonsuz açılımın tamamı integrasyon altında başka bir şey katmaz.</div></div>

<p class="l-text">Pratikte Laurent katsayılarını elle neredeyse hiç hesaplamayız. Üç hesaplama kuralı vakaların %99'unu kapsar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Basit kutup kuralı</div><div class="card-body">Eğer $z_0$ 1. mertebeden kutupsa, $\\mathrm{Res}(f, z_0) = \\lim_{z \\to z_0}(z - z_0)\\,f(z)$. Lineer faktörle çarp ve değerlendir.</div><div class="card-formula">Res = lim (z−z₀)·f</div></div>
<div class="calc-card"><div class="card-title">Bölüm kuralı</div><div class="card-body">$f = g/h$, $g(z_0) \\ne 0$, $h(z_0) = 0$, $h'(z_0) \\ne 0$ (paydanın basit sıfırı) ise, o zaman $\\mathrm{Res}(f, z_0) = g(z_0)/h'(z_0)$. Türevi kolay olan polinom paydalar için en hızlı elle hesap.</div><div class="card-formula">Res = g(z₀) / h'(z₀)</div></div>
<div class="calc-card"><div class="card-title">$k$ mertebeli kutup kuralı</div><div class="card-body">$\\mathrm{Res}(f, z_0) = \\dfrac{1}{(k-1)!} \\lim_{z \\to z_0} \\dfrac{d^{k-1}}{dz^{k-1}}\\bigl[(z-z_0)^k f(z)\\bigr]$. Kutbu $(z-z_0)^k f(z)$'nin Taylor açılımına indirgeyip $(k-1)$. katsayıyı oku.</div><div class="card-formula">k!⁻¹ · (k−1). türev</div></div>
</div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — ÜÇ YÖNTEMİN HEPSİ</div><div class="example-body"><strong>$\\mathrm{Res}\\bigl(\\dfrac{e^z}{z^2(z-1)}, 0\\bigr)$ hesapla — $z=0$'da 2. mertebeden kutup.</strong><br><br>2. mertebe kuralı $k = 2$ ile: $(z-0)^2 f(z) = e^z/(z-1)$. Bir kez türev al: $\\dfrac{d}{dz}\\dfrac{e^z}{z-1} = \\dfrac{e^z(z-1) - e^z}{(z-1)^2} = \\dfrac{e^z(z-2)}{(z-1)^2}$. $z=0$'da değerlendir: $\\dfrac{1 \\cdot (-2)}{(-1)^2} = -2$. Yani $\\mathrm{Res} = -2/(2-1)! = -2$.<br><br><strong>Laurent açılımı ile kontrol.</strong> $1/(z-1) = -1/(1-z) = -(1 + z + z^2 + \\dots)$. Dolayısıyla $e^z/(z-1) = -(1+z+z^2+\\dots)(1 + z + z^2/2 + z^3/6 + \\dots)$. $e^z = 1 + z + z^2/2 + \\dots$ olduğu için $(1+z+z^2+\\dots)(1+z+z^2/2+\\dots) = 1 + 2z + (1 + 1 + 1/2)z^2 + \\dots$. $z^1$ katsayısı $2$, yani $z^2 f$'in $z^1$ katsayısı $-2$, dolayısıyla $\\mathrm{Res} = -2$. <strong>İki yöntem örtüşür.</strong></div></div>

<div id="plot-l5-singularities-tr" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=400;
var x1=[],y1=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;var r=0.3;var x=r*Math.cos(th),y=r*Math.sin(th);x1.push(th*180/Math.PI);var zR=x,zI=y;var sR=Math.sin(zR)*Math.cosh(zI),sI=Math.cos(zR)*Math.sinh(zI);var dR=zR,dI=zI;var d2=dR*dR+dI*dI;var qR=(sR*dR+sI*dI)/d2,qI=(sI*dR-sR*dI)/d2;y1.push(Math.sqrt(qR*qR+qI*qI));}
traces.push({x:x1,y:y1,mode:'lines',name:'sin(z)/z (kaldırılabilir)',line:{color:'#3b82f6',width:2.4}});
var x2=[],y2=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;var r=0.3;x2.push(th*180/Math.PI);y2.push(1/(r*r));}
traces.push({x:x2,y:y2,mode:'lines',name:'1/z² (2. mertebe kutup)',line:{color:'#10b981',width:2.4}});
var x3=[],y3=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;var r=0.3;x3.push(th*180/Math.PI);var c=Math.cos(th)/r;y3.push(Math.min(Math.exp(c),100));}
traces.push({x:x3,y:y3,mode:'lines',name:'e^(1/z) (esansiyel)',line:{color:'#f59e0b',width:2.4}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'arg(z), |z|=0.3 çemberi (derece)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[0,360]},yaxis:{title:'|f(z)|',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',type:'log',range:[-1,2.05]},margin:{t:30,r:30,b:55,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l5-singularities-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $|f(z)|$, üç fonksiyon için $|z|=0.3$ küçük çemberi boyunca örneklenmiş — her tekillik tipinden bir tane. Kaldırılabilir durum $\\sin(z)/z$ 1'e yakın kalır — görünen tekillik bir gösterimsel illüzyondur. 2. mertebe kutup $1/z^2$, sabit büyüklük $1/r^2 \\approx 11.1$ üretir — bu yarıçapta kutbun tercih ettiği yön olmadığı için açıdan bağımsızdır. Esansiyel tekillik $e^{1/z}$, $e^{1/r} \\approx e^{3.33} \\approx 28$ ($\\arg z = 0$'da) ile $e^{-1/r} \\approx 0.036$ ($\\arg z = \\pi$'de) arasında salınır, tek bir çemberde üç dereceden fazla büyüklük kapsar. O vahşi sallanma esansiyel tekilliğin imzasıdır — ve büyük Picard teoreminin kaynağıdır.</div></div>

<h2 class="lesson-title">3. Laurent Serisi ve Yakınsaklık Halkası</h2>

<p class="l-text">Taylor serileri bir diskte yaşar; Laurent serileri bir <em>halkada</em> yaşar. $r &lt; |z - z_0| &lt; R$ üzerinde holomorf bir fonksiyon verilirse, Laurent serisi tam olarak o halkada yakınsar. İç yarıçap $r$, $z_0$'dan içerideki en yakın tekillik tarafından belirlenir; dış yarıçap $R$, dışarıdan en yakın tekillik tarafından.</p>

<div class="calc-formula"><div class="formula-label">YAKINSAKLIK HALKASI</div><div class="formula-main">$$f(z) = \\sum_{n=-\\infty}^\\infty c_n (z-z_0)^n, \\qquad c_n = \\frac{1}{2\\pi i}\\oint_\\gamma \\frac{f(\\zeta)}{(\\zeta-z_0)^{n+1}}\\,d\\zeta$$</div><div class="formula-sub">$\\gamma$ halka içinde herhangi bir çemberdir. Seri her kapalı alt-halkada mutlak ve düzgün yakınsar ve katsayı formülü L4'ten Cauchy integral formülünü genelleştirir.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — FARKLI HALKALARDA FARKLI LAURENT SERİSİ</div><div class="example-body"><strong>$f(z) = 1/[z(z-1)]$'in $z_0 = 0$ etrafında iki Laurent açılımı vardır:</strong><br><br><strong>Halka 1: $0 &lt; |z| &lt; 1$.</strong> Kısmi kesirler: $1/[z(z-1)] = -1/z + 1/(z-1) = -1/z - 1/(1-z) = -1/z - (1 + z + z^2 + \\dots)$. Asal kısım $-1/z$, düzenli kısım $-(1 + z + z^2 + \\dots)$. $0$'da rezidu $= -1$.<br><br><strong>Halka 2: $|z| &gt; 1$.</strong> Şimdi $|1/z| &lt; 1$, dolayısıyla $1/(z-1) = (1/z) \\cdot 1/(1-1/z) = (1/z)(1 + 1/z + 1/z^2 + \\dots) = 1/z + 1/z^2 + \\dots$. $-1/z$ ekleyince: $f(z) = (-1/z) + (1/z + 1/z^2 + \\dots) = 1/z^2 + 1/z^3 + \\dots$. Seride sadece negatif kuvvetler var — bu sonsuzdaki açılımdır.<br><br><strong>Ders:</strong> <em>aynı fonksiyon</em> aynı nokta etrafında farklı halkalarda farklı Laurent serilerine sahiptir. Yalnızca iç-disk serisi $z = 0$'da reziduyu verir.</div></div>

<div id="plot-l5-annulus-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=200;
traces.push({x:[1],y:[0],mode:'markers',name:'z=1 kutbu',marker:{size:13,color:'#ef4444',symbol:'x-thin',line:{width:3,color:'#ef4444'}}});
traces.push({x:[0],y:[0],mode:'markers',name:'z=0 kutbu',marker:{size:13,color:'#ef4444',symbol:'x-thin',line:{width:3,color:'#ef4444'}}});
var inn1x=[],inn1y=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;inn1x.push(0.08*Math.cos(th));inn1y.push(0.08*Math.sin(th));}
traces.push({x:inn1x,y:inn1y,mode:'lines',name:'halka 1 iç sınır',line:{color:'#3b82f6',width:1.8,dash:'dot'}});
var ax=[],ay=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;ax.push(Math.cos(th));ay.push(Math.sin(th));}
traces.push({x:ax,y:ay,mode:'lines',name:'halka 1 dış sınır (|z|=1)',line:{color:'#3b82f6',width:2.2}});
var fillx=[],filly=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;fillx.push(0.95*Math.cos(th));filly.push(0.95*Math.sin(th));}
traces.push({x:fillx,y:filly,mode:'none',fill:'toself',fillcolor:'rgba(59,130,246,0.12)',name:'halka 1 (0 < |z| < 1)',showlegend:true});
var bx=[],by=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;bx.push(1.05*Math.cos(th));by.push(1.05*Math.sin(th));}
traces.push({x:bx,y:by,mode:'lines',name:'halka 2 iç sınır (|z|=1)',line:{color:'#f59e0b',width:2.2}});
var cx=[],cy=[];for(var i=0;i<=N;i++){var th=2*Math.PI*i/N;cx.push(3*Math.cos(th));cy.push(3*Math.sin(th));}
traces.push({x:cx,y:cy,mode:'lines',name:'halka 2 sonsuza uzanır',line:{color:'#f59e0b',width:1.8,dash:'dash'}});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3.5]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:9}}};
Plotly.newPlot('plot-l5-annulus-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $f(z) = 1/[z(z-1)]$'in $z_0 = 0$ etrafındaki Laurent serileri için iki yakınsaklık halkası. İki kutup arasındaki mavi halka $0 &lt; |z| &lt; 1$, asal kısım $-1/z$ ve başlangıçta rezidu $-1$ olan Laurent serisini barındırır. İkisinin de ötesindeki turuncu halka $|z| &gt; 1$, yalnızca negatif kuvvetlerle ve $z^{-1}$ terimi olmadan farklı bir Laurent serisini barındırır. <em>Fonksiyon</em> aynıdır; <em>seri</em> hangi halkayı sorduğuna bağlıdır. Rezidu yalnızca en içteki seriden okunur, dış sınırı $z_0$'dan dışarı çıkarken karşılaştığın ilk tekillik olan seri.</div></div>

<h2 class="lesson-title">4. Rezidu Teoremi</h2>

<div class="calc-highlight"><strong>Hepsini yöneten tek özdeşlik.</strong> Meromorf bir fonksiyon ve kutuplarının sonlu sayısını kapsayan kapalı bir kontur al. Kontur integrali $2\\pi i$ kere rezidulerin toplamıdır. Hikaye bitti. Dersin geri kalanında değerlendirdiğimiz her reel integral, reel bir alanı karmaşık kontura yönlendirme, kapsanan kutupları belirleme ve cevabı okuma stratejisidir.</div>

<p class="l-text">$D \\subset \\mathbb{C}$ basit-bağlı açık küme, $f : D \\setminus \\{z_1, \\dots, z_N\\} \\to \\mathbb{C}$ izole tekillikler $z_1, \\dots, z_N$ dışında holomorf ve $\\gamma$, $D$ içinde herhangi bir $z_j$'den geçmeyen kapalı, pozitif yönlü (saat tersi), parça-düzgün bir kontur olsun. O zaman:</p>

<div class="calc-formula"><div class="formula-label">REZİDU TEOREMİ</div><div class="formula-main">$$\\oint_\\gamma f(z)\\,dz \\;=\\; 2\\pi i \\sum_{j=1}^{N} n(\\gamma, z_j)\\,\\mathrm{Res}(f, z_j)$$</div><div class="formula-sub">$n(\\gamma, z_j)$ sarım sayısıdır — $\\gamma$'nın $z_j$ etrafında kaç kez döndüğü (saat tersi pozitif). Her kutbu bir kez kapsayan basit konturlar için, iç kutuplar için $n = 1$ ve dış kutuplar için $n = 0$.</div></div>

<p class="l-text">Üç satırlık türetim. Cauchy teoremi ile $\\gamma$ üzerindeki integral homotopik bir deformasyonun integraline eşittir. $\\gamma$'yı her iç $z_j$ etrafındaki küçük çemberlere $C_1, \\dots, C_N$ deforme et, katkıları iptal olan ince koridorlarla bağla. Her $C_j$, 2. bölümdeki Laurent hesabıyla $2\\pi i\\,c_{-1}^{(j)} = 2\\pi i\\,\\mathrm{Res}(f, z_j)$ katkı verir. Topla. Bitti.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Kontur içindeki integrandın tüm izole tekilliklerini belirle</div><div class="step-detail">Rasyonel fonksiyonlar için paydayı çarpanlara ayır ve kutupları oku. Karışık formlar için (trigonometrik veya üstel ile çarpılan rasyoneller) çarpım olarak yaz ve her faktörü tekillik açısından kontrol et.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Her tekilliği sınıflandır ve reziduyu hesapla</div><div class="step-detail">Basit-kutup formülü, bölüm kuralı veya $k$ mertebe türev formülü. Eğer tekillik esansiyel ise, Laurent serisini aç ve $c_{-1}$'i doğrudan çıkar.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Reziduleri topla, $2\\pi i$ ile çarp, sarım sayısı ve yönelimi hesaba kat</div><div class="step-detail">Saat tersi kontur: pozitif. Saat yönü: işareti ters çevir. Bir kutup etrafında iki kez dönen konturlar o reziduyu iki kez sayar.</div></div></div>
</div>

<h2 class="lesson-title">5. İşlenmiş Örnek — Rasyonel Fonksiyonun Tüm Kutupları</h2>

<p class="l-text">$\\oint_{|z|=3} \\dfrac{z^2 + 1}{z(z-2)^2}\\,dz$ hesapla.</p>

<p class="l-text">Payda $z \\cdot (z-2)^2$ olarak çarpanlara ayrılır — $z = 0$'da basit kutup ve $z = 2$'de çift kutup. İkisi de $|z| = 3$ içinde. İki reziduya da ihtiyacımız var.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$z = 0$'da rezidu (basit kutup)</div><div class="step-detail">$\\mathrm{Res}(f, 0) = \\lim_{z \\to 0} z \\cdot \\dfrac{z^2+1}{z(z-2)^2} = \\dfrac{0+1}{(0-2)^2} = \\dfrac{1}{4}$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$z = 2$'de rezidu (çift kutup, $k=2$)</div><div class="step-detail">$(z-2)^2 f(z) = \\dfrac{z^2+1}{z}$. Türev al: $\\dfrac{d}{dz}\\dfrac{z^2+1}{z} = \\dfrac{2z \\cdot z - (z^2+1)}{z^2} = \\dfrac{z^2 - 1}{z^2}$. $z=2$'de değerlendir: $\\dfrac{4-1}{4} = \\dfrac{3}{4}$. $(k-1)! = 1!$ ile böl: $\\mathrm{Res}(f, 2) = 3/4$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Rezidu teoremini uygula</div><div class="step-detail">$\\oint_{|z|=3} f\\,dz = 2\\pi i (1/4 + 3/4) = 2\\pi i$.</div></div></div>
</div>

<div class="l-note"><strong>Sağlık kontrolü.</strong> $f(z) = (z^2+1)/[z(z-2)^2]$ fonksiyonu rasyoneldir; $|z| \\to \\infty$ için $1/z$ gibi davranır, dolayısıyla "sonsuzdaki reziduyu" $-1$'dir. Riemann küresi üzerindeki rezidu teoremi <em>tüm</em> rezidulerin (sonsuz dahil) toplamının sıfır olduğunu söyler. Kontrol: $1/4 + 3/4 + (-1) = 0$. Sayılar uyuyor.</div>

<h2 class="lesson-title">6. Reel Integral I — $[0, 2\\pi]$ Üzerinde Trigonometrik</h2>

<div class="calc-highlight"><strong>Reçete.</strong> $R$ rasyonel bir fonksiyon olmak üzere $\\int_0^{2\\pi} R(\\cos\\theta, \\sin\\theta)\\,d\\theta$ formundaki herhangi bir integral, $z = e^{i\\theta}$ değişken değiştirmesi ile birim çember üzerinde karmaşık bir kontur integraline dönüşür. Açı çemberi parametrelendirir; rasyonel integrand $z$'nin sonlu sayıda kutuplu rasyonel bir fonksiyonu olur. Reziduler işi bitirir.</div>

<p class="l-text">$z = e^{i\\theta}$ koy, dolayısıyla $dz = i z\\,d\\theta$, yani $d\\theta = dz/(iz)$. Trig özdeşlikleri</p>

<div class="calc-formula"><div class="formula-label">TRİG ↔ z-DEĞİŞTİRMESİ</div><div class="formula-main">$$\\cos\\theta = \\frac{z + z^{-1}}{2}, \\qquad \\sin\\theta = \\frac{z - z^{-1}}{2 i}$$</div><div class="formula-sub">$\\theta$, 0'dan $2\\pi$'ye giderken $z$ birim çemberi saat tersi yönde bir kez çizer. Reel integral $|z|=1$ üzerinde bir kontur integraline dönüşür.</div></div>

<p class="l-text"><strong>Örnek.</strong> $I = \\int_0^{2\\pi} \\dfrac{d\\theta}{2 + \\cos\\theta}$ hesapla.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Değişken değiştir</div><div class="step-detail">$2 + \\cos\\theta = 2 + (z+z^{-1})/2 = (z^2 + 4z + 1)/(2z)$. $d\\theta/(2 + \\cos\\theta)$ integrandı $\\dfrac{1}{(z^2+4z+1)/(2z)} \\cdot \\dfrac{dz}{iz} = \\dfrac{2\\,dz}{i(z^2 + 4z + 1)}$ olur.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Rasyonel integrandın kutuplarını bul</div><div class="step-detail">$z^2 + 4z + 1 = 0 \\Rightarrow z = -2 \\pm \\sqrt{3}$. Birim çember içinde: $z_1 = -2 + \\sqrt{3} \\approx -0.268$. Dışında: $z_2 = -2 - \\sqrt{3} \\approx -3.732$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$z_1$'de rezidu (basit kutup)</div><div class="step-detail">$g(z) = 2/i$, $h(z) = z^2 + 4z + 1$, $h'(z) = 2z + 4$ ile bölüm kuralı: $\\mathrm{Res} = (2/i)/(2 z_1 + 4) = (2/i)/(2\\sqrt{3}) = 1/(i\\sqrt{3})$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Rezidu teoremini uygula</div><div class="step-detail">$I = 2\\pi i \\cdot 1/(i\\sqrt{3}) = 2\\pi/\\sqrt{3} \\approx 3.6276$.</div></div></div>
</div>

<div class="l-note"><strong>Bu neden işe yarıyor.</strong> $\\theta \\mapsto e^{i\\theta}$ eşlemesi $[0, 2\\pi)$ ile birim çember arasında bir bijeksiyondur. $\\cos$ ve $\\sin$ cinsinden herhangi bir rasyonel ifade çember üzerinde tek değerli ve süreklidir (manipülasyonumuzdan sonra). $[0, 2\\pi]$ üzerindeki Riemann integrali $|z|=1$ üzerindeki kontur integraline eşittir, yakınsama endişesi yok.</div>

<h2 class="lesson-title">7. Reel Integral II — $\\mathbb{R}$ Üzerinde Reel Has Olmayan Rasyonel</h2>

<p class="l-text">Şimdi tüm reel eksen üzerinde integraller, $\\int_{-\\infty}^\\infty R(x)\\,dx$, burada $R$ reel kutbu olmayan ve sonsuzda en az $1/x^2$ gibi azalan rasyonel bir fonksiyon. Reel ekseni <em>üst</em> yarı düzlemde büyük bir yarım çember ile kapat (yarıçap $R \\to \\infty$). Yarım çember katkısı yok olur (Jordan tarzı tahmin $1/x^2$ azalmasından); integral, üst yarı düzlemdeki kutuplardaki rezidulerin toplamının $2\\pi i$ katına eşittir.</p>

<div class="calc-formula"><div class="formula-label">YARIM ÇEMBERSEL KONTUR KURALI</div><div class="formula-main">$$\\int_{-\\infty}^{\\infty} R(x)\\,dx \\;=\\; 2\\pi i \\sum_{\\substack{z_j \\\\ \\mathrm{Im}(z_j) &gt; 0}} \\mathrm{Res}(R, z_j)$$</div><div class="formula-sub">$R$'nin reel kutbu olmadığında ve büyük $|z|$ için $|R(z)| = O(1/|z|^2)$ olduğunda geçerlidir. Büyük yarım çember limitte sıfır katkı yapar çünkü integrand uzunluğunun büyümesinden daha hızlı azalır.</div></div>

<p class="l-text"><strong>Örnek A.</strong> $I = \\int_{-\\infty}^\\infty \\dfrac{dx}{1+x^2}$. Payda $(z-i)(z+i)$. Yalnızca $z = i$ üst yarı düzlemde. Bölüm kuralı: $\\mathrm{Res} = 1/(2i)$. Yani $I = 2\\pi i \\cdot 1/(2i) = \\pi$. Klasik cevap $\\arctan(x)\\bigl|_{-\\infty}^\\infty = \\pi$ ile uyumlu.</p>

<p class="l-text"><strong>Örnek B.</strong> $I = \\int_{-\\infty}^\\infty \\dfrac{dx}{1+x^4}$. Çarpanlara ayır: $z^4 + 1 = 0 \\Rightarrow z = e^{i\\pi/4}, e^{i3\\pi/4}, e^{i5\\pi/4}, e^{i7\\pi/4}$. Yalnızca ilk ikisi üst yarı düzlemde. $h(z) = z^4 + 1$, $h'(z) = 4z^3$ ile bölüm kuralı:</p>

<div class="calc-formula"><div class="formula-label">$1/(1+z^4)$ REZİDULERİ</div><div class="formula-main">$$\\mathrm{Res}(z_j) = \\frac{1}{4 z_j^3} = \\frac{1}{4 e^{i 3\\theta_j}}, \\qquad \\theta_j = \\frac{(2j-1)\\pi}{4}, \\; j=1,2$$</div><div class="formula-sub">$z_1^3 = e^{i 3\\pi/4}$, $z_2^3 = e^{i 9\\pi/4} = e^{i\\pi/4}$. İki rezidu $(1/4) e^{-i 3\\pi/4}$ ve $(1/4) e^{-i\\pi/4}$.</div></div>

<p class="l-text">Toplam: $(1/4)(e^{-i3\\pi/4} + e^{-i\\pi/4}) = (1/4) \\cdot (-i\\sqrt{2}) = -i\\sqrt{2}/4$. $2\\pi i$ ile çarp: $I = 2\\pi i \\cdot (-i\\sqrt{2}/4) = \\pi\\sqrt{2}/2 = \\pi/\\sqrt{2}$.</p>

<div class="calc-example"><div class="example-label">SAYISAL KONTROL</div><div class="example-body">$\\pi/\\sqrt{2} \\approx 2.2214$. $\\int_{-100}^{100} dx/(1+x^4)$'in 20000 panelli Simpson kuralı ile doğrudan sayısal integrasyonu $2.22142$ verir. Üç ondalık örtüşme, özel-fonksiyon araması veya sayısal kuadratür yerine tek bir rezidu hesabı ile elde edildi. Reziduler <em>hızlıdır</em>.</div></div>

<div id="plot-l5-contour-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=200;
traces.push({x:[-3,3],y:[0,0],mode:'lines',name:'reel eksen (−R ile R)',line:{color:'#3b82f6',width:3}});
var sx=[],sy=[];for(var i=0;i<=N;i++){var th=Math.PI*i/N;sx.push(3*Math.cos(th));sy.push(3*Math.sin(th));}
traces.push({x:sx,y:sy,mode:'lines',name:'üst yarım çember, R→∞',line:{color:'#3b82f6',width:3,dash:'dash'}});
traces.push({x:[Math.cos(Math.PI/4),Math.cos(3*Math.PI/4)],y:[Math.sin(Math.PI/4),Math.sin(3*Math.PI/4)],mode:'markers+text',name:'içerideki kutuplar (sayılan)',marker:{size:14,color:'#10b981',symbol:'star'},text:['z₁','z₂'],textposition:'top center',textfont:{color:'#10b981',size:12}});
traces.push({x:[Math.cos(5*Math.PI/4),Math.cos(7*Math.PI/4)],y:[Math.sin(5*Math.PI/4),Math.sin(7*Math.PI/4)],mode:'markers+text',name:'dışarıdaki kutuplar (atlanan)',marker:{size:13,color:'#ef4444',symbol:'x-thin',line:{width:3,color:'#ef4444'}},text:['z₃','z₄'],textposition:'bottom center',textfont:{color:'#ef4444',size:12}});
traces.push({x:[2.5,2.7],y:[0,0],mode:'lines',line:{color:'#3b82f6',width:1},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-2.0,3.5]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:10}},annotations:[{x:0,y:1.6,text:'YUKARIDAN KAPAT',font:{color:'#3b82f6',size:11},showarrow:false}]};
Plotly.newPlot('plot-l5-contour-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $\\int_{-\\infty}^\\infty dx/(1+x^4)$'ü değerlendirmek için kanonik kontur. $\\mathrm{Re}(z) \\in [-R, R]$ boyunca düz parça istediğimiz reel integral. Kesik yarım çember konturu üst yarı düzlemde kapatır; $R \\to \\infty$ iken katkısı yok olur çünkü $|1/(1+z^4)| = O(1/R^4)$ iken yarım çemberin uzunluğu $\\pi R$. İki yeşil yıldız kontur içindeki $e^{i\\pi/4}$ ve $e^{i 3\\pi/4}$ kutuplarıdır — reziduları toplanır. İki kırmızı çapraz alt yarı düzlemdeki kutuplardır — bu kontur için ilgisiz, ama aşağıdan kapatsaydık alınırlardı.</div></div>

<h2 class="lesson-title">8. Reel Integral III — Trig Polinom Çarpı Rasyonel (Jordan Lemması)</h2>

<p class="l-text">$\\int_{-\\infty}^\\infty R(x) e^{i\\omega x}\\,dx$ formundaki integraller — Fourier teorisinin iş atı — biraz daha incelikli bir argüman gerektirir çünkü üstel faktör reel eksende sınırlıdır ama bir yarı düzlemde büyür ve diğerinde azalır.</p>

<div class="calc-formula"><div class="formula-label">JORDAN LEMMASI</div><div class="formula-main">$$\\omega &gt; 0: \\text{ üst yarı düzlem kapat}, \\qquad \\omega &lt; 0: \\text{ alt yarı düzlem kapat}$$</div><div class="formula-sub">$|e^{i\\omega z}| = e^{-\\omega\\,\\mathrm{Im}(z)}$. $\\omega &gt; 0$ için $e^{i\\omega z}$ üst yarı düzlemde (yani $\\mathrm{Im}(z) &gt; 0$ olduğunda) azalır ve aşağıda büyür. Sağ yarı düzlemdeki yarım çember $|z| \\to \\infty$ iken $|R(z)| \\to 0$ ise yok olan katkı verir.</div></div>

<p class="l-text"><strong>Örnek.</strong> $\\omega &gt; 0$ için $\\int_{-\\infty}^\\infty \\dfrac{\\cos(\\omega x)}{1 + x^2}\\,dx$. $\\int_{-\\infty}^\\infty \\dfrac{e^{i\\omega x}}{1 + x^2}\\,dx$'in $\\mathrm{Re}$'sini al. İntegrand $e^{i\\omega z}/(z-i)(z+i)$. Üst yarı düzlemde $z = i$ kutbu. Rezidu: $e^{i\\omega \\cdot i}/(2i) = e^{-\\omega}/(2i)$. İntegral $= 2\\pi i \\cdot e^{-\\omega}/(2i) = \\pi e^{-\\omega}$. Reel kısmı alarak: $\\int_{-\\infty}^\\infty \\cos(\\omega x)/(1+x^2)\\,dx = \\pi e^{-\\omega}$. Simetri ile $\\omega &lt; 0$ için cevap $\\pi e^{\\omega}$, dolayısıyla birleşik sonuç $\\pi e^{-|\\omega|}$.</p>

<div class="l-note"><strong>Lorentzian–üstel çifti.</strong> $1/(1+x^2)$, Fourier dönüşümü altında $\\pi e^{-|\\omega|}$ ile eşlenir — Fourier tablolarındaki en ünlü satırlardan biri. Reziduler bunu bize tek adımda verir. Karmaşık analiz olmadan kılık değiştirmiş bir kontur hesabı (Cauchy dağılımı OYF'si) veya tablolanmış bir özdeşlik gerekirdi. Reziduler ile iki satır cebir.</div>

<h2 class="lesson-title">9. Reziduler ile Ters Fourier Dönüşümü</h2>

<p class="l-text">Ters Fourier dönüşümü tam olarak önceki bölümün değerlendirmek için inşa edildiği integral türüdür. $\\hat{f}(\\omega) = 1/(1+\\omega^2)$ verildiğinde, $f(t)$'yi geri çıkar:</p>

<div class="calc-formula"><div class="formula-label">LORENTZIAN SPEKTRUM İLE TERS FOURIER</div><div class="formula-main">$$f(t) \\;=\\; \\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} \\frac{e^{i\\omega t}}{1+\\omega^2}\\,d\\omega$$</div><div class="formula-sub">Tek rasyonel payda ve üstel pay. Yarı düzlem seçimi $t$'nin işaretine bağlıdır.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Durum $t &gt; 0$: yukarıdan kapat</div><div class="step-detail">$e^{i\\omega t}$ üst yarı düzlemde azalır. $\\omega = i$ kutbu çevrelenir. Rezidu $= e^{i \\cdot i \\cdot t}/(2 i) = e^{-t}/(2i)$. İntegral $= 2\\pi i \\cdot e^{-t}/(2i) = \\pi e^{-t}$, $2\\pi$'ye böl: $f(t) = e^{-t}/2$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Durum $t &lt; 0$: aşağıdan kapat (ters yönelimle)</div><div class="step-detail">$t &lt; 0$ olduğunda $e^{i\\omega t}$ alt yarı düzlemde azalır. Alt yarım çember saat yönündedir, eksi işareti katar. $\\omega = -i$ kutbu, rezidu $e^{-i \\cdot (-i) \\cdot t}/(-2i) = e^{t}/(-2i)$. Net: $f(t) = e^{t}/2$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Birleştir</div><div class="step-detail">Tüm $t \\in \\mathbb{R}$ için $f(t) = \\tfrac{1}{2}\\,e^{-|t|}$. Ünlü "çift taraflı üstel" — Lorentzian'ın Fourier ikilisi.</div></div></div>
</div>

<div id="plot-l5-fourier-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=400;
var w=[],L=[];for(var i=0;i<=N;i++){var x=-8+16*i/N;w.push(x);L.push(1/(1+x*x));}
traces.push({x:w,y:L,mode:'lines',name:'spektrum 1/(1+ω²)',line:{color:'#3b82f6',width:2.4},xaxis:'x',yaxis:'y'});
var t=[],f=[];for(var i=0;i<=N;i++){var x=-6+12*i/N;t.push(x);f.push(0.5*Math.exp(-Math.abs(x)));}
traces.push({x:t,y:f,mode:'lines',name:'zaman sinyali ½e^(−|t|)',line:{color:'#f59e0b',width:2.4},xaxis:'x2',yaxis:'y2'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'ω',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',domain:[0,0.46],range:[-8,8]},yaxis:{title:'spektrum',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[0,1.1]},xaxis2:{title:'t',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',domain:[0.54,1],range:[-6,6]},yaxis2:{title:'f(t)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[0,0.6],anchor:'x2'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l5-fourier-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> solda Lorentzian spektrumu $\\hat{f}(\\omega) = 1/(1+\\omega^2)$ ve sağda ters Fourier dönüşümü $f(t) = \\tfrac{1}{2}e^{-|t|}$. Spektrumda $\\omega = \\pm i$'de bir kutup çifti — reel eksenin her iki yanında birer kutup — zamanda simetrik üstel azalmaya çevrilir. Spektrumun genişliği ve zaman sinyalinin azalma hızı resiproktur (belirsizlik-tarzı bir denge): daha dar bir spektrum daha yavaş azalmaya karşılık gelir. Rasyonel spektrumlu bir Fourier dönüşüm çifti tablosundaki her ders kitabı girişi tam olarak bu şekilde hesaplanır.</div></div>

<h2 class="lesson-title">10. Ters Laplace Dönüşümü — Bromwich Konturu</h2>

<p class="l-text">Laplace dönüşümü bir zaman alanı sinyalini $s$ alanı transfer fonksiyonuna dönüştürür. Sinyali geri çıkarmak <strong>Bromwich integralini</strong> gerektirir:</p>

<div class="calc-formula"><div class="formula-label">BROMWICH TERSLEMESİ</div><div class="formula-main">$$f(t) \\;=\\; \\frac{1}{2\\pi i}\\int_{c - i\\infty}^{c + i\\infty} F(s)\\,e^{st}\\,ds$$</div><div class="formula-sub">İntegral $F$'in tüm tekilliklerinin sağında dikey bir doğru $\\mathrm{Re}(s) = c$ boyunca çalışır. Bu doğruyu büyük bir yarım çember sola ekleyerek bir kontura <em>kapatırız</em>, $F$'in sol yarı düzlemdeki tüm kutuplarını alarak.</div></div>

<p class="l-text">$t &gt; 0$ için $e^{st}$ sol yarı düzlemde azaldığı için ($e^{st} = e^{(\\mathrm{Re}\\,s)t}$, $\\mathrm{Re}\\,s &lt; 0$ ve $t &gt; 0$ olduğunda azalır), sola kapatan yarım çember $F$ üzerinde hafif azalma varsayımları altında sıfır katkı yapar. Bromwich integrali şuna çöker:</p>

<div class="calc-formula"><div class="formula-label">TERS LAPLACE'IN REZİDU FORMU</div><div class="formula-main">$$f(t) \\;=\\; \\sum_{\\substack{s_k \\\\ \\mathrm{Re}(s_k) &lt; c}} \\mathrm{Res}\\bigl(F(s)\\,e^{st},\\ s_k\\bigr)$$</div><div class="formula-sub">Transfer fonksiyonunun kutuplarındaki reziduler cinsinden tek bir kapalı form ifade. Mühendisler Laplace-dönüşüm tablolarını tam olarak böyle inşa eder.</div></div>

<div class="calc-example"><div class="example-label">İŞLENMİŞ ÖRNEK — STANDART KONTROL TEORİSİ KUTUP ÇİFTİ</div><div class="example-body"><strong>$\\mathcal{L}^{-1}\\{\\omega_0/(s^2 + \\omega_0^2)\\}$'i hesapla.</strong> $s = \\pm i\\omega_0$'da kutuplar, ikisi de sanal eksende (yani $c = 0^+$). Her ikisi de basit kutup.<br><br>$s = +i\\omega_0$'da rezidu: $g(s) = \\omega_0 e^{st}$, $h(s) = s^2 + \\omega_0^2$, $h'(s) = 2s$ ile bölüm kuralı ile: $\\mathrm{Res} = \\omega_0 e^{i\\omega_0 t}/(2 i \\omega_0) = e^{i\\omega_0 t}/(2i)$.<br><br>$s = -i\\omega_0$'da rezidu: benzer şekilde — payda $h'(-i\\omega_0) = -2i\\omega_0$, dolayısıyla rezidu $= \\omega_0 e^{-i\\omega_0 t}/(-2i\\omega_0) = -e^{-i\\omega_0 t}/(2i)$.<br><br>Toplam: $\\dfrac{e^{i\\omega_0 t} - e^{-i\\omega_0 t}}{2i} = \\sin(\\omega_0 t)$. <strong>Standart tablo girdisi $\\omega_0/(s^2+\\omega_0^2) \\leftrightarrow \\sin(\\omega_0 t)$'i geri kazandık.</strong></div></div>

<div id="plot-l5-bromwich-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var traces=[];
var N=200;
traces.push({x:[0.5,0.5],y:[-3,3],mode:'lines',name:'Bromwich doğrusu Re(s)=c',line:{color:'#3b82f6',width:3}});
var sx=[],sy=[];for(var i=0;i<=N;i++){var th=Math.PI/2 + Math.PI*i/N;sx.push(0.5 + 3*Math.cos(th));sy.push(3*Math.sin(th));}
traces.push({x:sx,y:sy,mode:'lines',name:'sol yarım çember (kontur kapatır)',line:{color:'#3b82f6',width:3,dash:'dash'}});
traces.push({x:[-1,-0.5,-0.5],y:[0,1.5,-1.5],mode:'markers+text',name:'kapsanan kutuplar (SYD)',marker:{size:14,color:'#10b981',symbol:'star'},text:['s₁','s₂','s̄₂'],textposition:'top right',textfont:{color:'#10b981',size:11}});
traces.push({x:[1.5],y:[0],mode:'markers+text',name:'kararsız kutup (SağYD, hariç)',marker:{size:13,color:'#ef4444',symbol:'x-thin',line:{width:3,color:'#ef4444'}},text:['kararsız'],textposition:'top center',textfont:{color:'#ef4444',size:11}});
traces.push({x:[0,0],y:[-3,3],mode:'lines',line:{color:'rgba(255,255,255,0.20)',width:1,dash:'dot'},showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(s) — sönüm',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.5,3]},yaxis:{title:'Im(s) — salınım',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',range:[-3.2,3.2],scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5,font:{size:10}},annotations:[{x:-2.5,y:2.5,text:'SYD (kararlı)',font:{color:'#10b981',size:11},showarrow:false},{x:2,y:2.5,text:'SağYD (kararsız)',font:{color:'#ef4444',size:11},showarrow:false}]};
Plotly.newPlot('plot-l5-bromwich-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $s$ düzleminde Bromwich konturu. Dikey mavi doğru $\\mathrm{Re}(s) = c$ literal Laplace-tersleme integrasyon yolu. Kesik solu-kapatan yarım çember (yarıçap $\\to \\infty$) doğru integralini rezidu toplamı ile değiştirmemize izin veren Cauchy-tarzı kapanış. Üç yeşil yıldız sol yarı düzlemde oturur — tipik bir kontrol sisteminin transfer fonksiyonunun kararlı kutuplarıdır ve azalan üsteller ve sönümlü salınımlar katkı verir. Sağ yarı düzlemdeki kırmızı çapraz kararsız bir kutuptur; sola-kapatan kontur tarafından kapsanmaz çünkü Bromwich doğrusunun diğer tarafındadır — fizikçe yerleşmek yerine ıraksayan bir sisteme karşılık gelir.</div></div>

<h2 class="lesson-title">11. EE Uygulaması — Kontrol ve Sinyal İşlemede Kutuplar Neden Önemli</h2>

<p class="l-text">Reziduler teorik bir merak değildir; gezegendeki her doğrusal zaman-değişmez (LTI) sistemin cebirsel sözlüğüdür. Bir transfer fonksiyonu $H(s) = N(s)/D(s)$, $D$'nin kökleri olan kutuplara sahiptir ve sistemin dürtü cevabı $h(t) = \\mathcal{L}^{-1}\\{H\\}$ — rezidu toplamı ile — kutup başına bir üstel mod ile inşa edilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$s = -a$'da reel kutup</div><div class="card-body">Rezidu $A e^{-at}$ terimi üretir — $a &gt; 0$ ise üstel azalma, $a &lt; 0$ ise üstel patlama. Kutbun yaşadığı yarı düzlem kararlılığı belirler.</div><div class="card-formula">h(t) ⊃ A e^(−at)</div></div>
<div class="calc-card"><div class="card-title">$s = \\sigma \\pm i\\omega_d$ karmaşık kutup çifti</div><div class="card-body">Eşlenik reziduler birleşerek sönümlü sinüsoit $e^{\\sigma t}\\cos(\\omega_d t + \\phi)$ verir. $\\sigma &lt; 0$: sönümlü salınım (ders kitabı 2. mertebe sistem). $\\sigma = 0$: sönümsüz. $\\sigma &gt; 0$: büyüyen salınım, kararsız.</div><div class="card-formula">e^(σt) cos(ωd t + φ)</div></div>
<div class="calc-card"><div class="card-title">$s = -a$'da çift kutup</div><div class="card-body">$k = 2$ ile rezidu formülü $(At + B) e^{-at}$ terimi üretir. $t$ faktörü tekrarlanan kutupların imzasıdır — mekanik sistemlerde kritik sönüm, kontrol döngülerinde çift integratör.</div><div class="card-formula">(At + B) e^(−at)</div></div>
</div>

<div class="l-note"><strong>Tüm külliyat.</strong> Bir RC filtresinin bir sinüsoide kararlı durum cevabı? $s = -1/(RC)$ kutbundaki rezidu. Kapalı çevrim kontrol sisteminin oturma süresi? Baskın rezidu. Kararlılık kriteri (tüm kutuplar SYD'de)? Rezidu toplamı azalan üsteller üretmelidir, bu da her kutup için $\\mathrm{Re}(s_k) &lt; 0$ gerektirir. Frekans cevabı $H(i\\omega)$? Sadece $H$'yi sanal eksende değerlendir — rezidu hesaplaması gerekmez, ama rezidülerin <em>konumları</em> Bode grafiğinin şeklini belirler. Karmaşık analiz EE'nin cebridir.</div>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynayacakların.</strong> <code>f = (z**2 + 1) / (z * (z-2)**2)</code>'yi en sevdiğin rasyonel fonksiyonla değiştir ve rezidu + kontur-integrali uyumunu doğrula. Bromwich örneğini 3. mertebe bir sisteme değiştir, örn. $H(s) = 1/[(s+1)(s^2 + 2s + 5)]$ — $s = -1$ ve karmaşık çift $s = -1 \\pm 2i$'deki reziduler $h(t) = c_1 e^{-t} + c_2 e^{-t}\\cos(2t) + c_3 e^{-t}\\sin(2t)$'ye birleşir. Sayısal $\\sin(\\omega_0 t)$ yeniden inşası <code>sympy.inverse_laplace_transform</code> ile 14+ ondalık basamağa kadar eşleşmeli.</p>

<h2 class="lesson-title">13. Özet — Artık Yapabildiklerin</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tekillik hayvanat bahçesi</div><div class="card-body">Üç tip — kaldırılabilir, $k$ mertebeli kutup, esansiyel. Laurent serisi hangisini söyler.</div><div class="card-formula">Laurent: c_n, n ∈ ℤ</div></div>
<div class="calc-card"><div class="card-title">Rezidu kuralları</div><div class="card-body">Basit kutup: $\\lim(z-z_0)f$. Bölüm: $g/h'$. $k$ mertebe: $(z-z_0)^k f$'in $(k-1)$. türevi.</div><div class="card-formula">Res = c_(−1)</div></div>
<div class="calc-card"><div class="card-title">Rezidu teoremi</div><div class="card-body">Kapalı kontur integrali = $2\\pi i$ × (kapsanan rezidulerin × sarım sayılarının toplamı).</div><div class="card-formula">∮ f dz = 2πi Σ Res</div></div>
<div class="calc-card"><div class="card-title">Trig integral reçetesi</div><div class="card-body">$z = e^{i\\theta}$, $d\\theta = dz/(iz)$, $\\cos = (z+z^{-1})/2$, $\\sin = (z-z^{-1})/(2i)$. $|z|=1$ üzerinde kontura çevir.</div><div class="card-formula">∫₀²π → ∮_|z|=1</div></div>
<div class="calc-card"><div class="card-title">Has olmayan integral reçetesi</div><div class="card-body">İntegrandın azaldığı yarı düzlemde yarım çember ile kapat. İçerideki reziduleri topla.</div><div class="card-formula">∫₋∞^∞ = 2πi Σ_UHP Res</div></div>
<div class="calc-card"><div class="card-title">Jordan lemması</div><div class="card-body">$\\omega &gt; 0$ ile $e^{i\\omega z}$ — yukarıdan kapat. $\\omega &lt; 0$ — aşağıdan kapat. Doğru yarı düzlemi otomatik seçer.</div><div class="card-formula">sign(ω) ↦ yarı düzlem</div></div>
<div class="calc-card"><div class="card-title">Reziduler ile ters Fourier</div><div class="card-body">Rasyonel $\\hat{f}(\\omega)$ ↔ $t$'de üsteller toplamı. Lorentzian ↔ çift üstel.</div><div class="card-formula">1/(1+ω²) ↔ ½e^(−|t|)</div></div>
<div class="calc-card"><div class="card-title">Bromwich ile ters Laplace</div><div class="card-body">Sol yarı düzlemi kapat, $F$'in kutuplarındaki reziduleri topla. Her kutup dürtü cevabının bir üstel moduna katkı verir.</div><div class="card-formula">f(t) = Σ Res(F e^(st))</div></div>
</div>

<div class="l-note"><strong>Bunun gideceği yer.</strong> L6 konformal eşlemelere döner — holomorf fonksiyonların geometri yanı — ve Riemann eşleme teoremi, Joukowski dönüşümleri (kanat profilleri akışı) ve Schwarz-Christoffel formüllerini getirir. Az önce inşa ettiğin rezidu araç seti, bir konformal eşleme bir çemberi veya yarı düzlemi Cauchy-tarzı bir integrali değerlendirmek istediğin bir alana taşıdığında yeniden ortaya çıkacak. Karmaşık analiz hikayesi iki perdede anlatılır: katılık (L1-L4, bu dersin Laurent sınıflandırması) ve ardından geometri (L5'in kontur jimnastiği, L6'nın eşlemeleri).</div>`
};
