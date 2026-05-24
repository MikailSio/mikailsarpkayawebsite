window.LISE_MAT_L21 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>So far every derivative you have computed has assumed that $y$ is written as an explicit function of $x$.</strong> You see $y = x^2 + 1$ or $y = \\sin(3x)$, you apply the rules of lessons 18–20, and out comes $y'$. But in geometry and physics most curves do not arrive in this convenient form. A circle is $x^2 + y^2 = 25$. An ellipse is $9x^2 + 4y^2 = 36$. The famous folium of Descartes is $x^3 + y^3 = 6xy$. None of these can be cleanly solved for $y$ as a single function — yet they all have well-defined tangent lines at almost every point.</p>

<p class="l-text">In this lesson you will learn two closely related techniques that handle exactly these situations. <em>Implicit differentiation</em> treats $y$ as an unknown function of $x$ and applies the chain rule to extract $\\dfrac{dy}{dx}$ from an equation of the form $F(x,y) = 0$. <em>Logarithmic differentiation</em> applies $\\ln$ to both sides before differentiating, which converts products into sums, quotients into differences, and powers into multiplications — turning monstrously complicated expressions into manageable ones, and giving us the only sensible way to differentiate $y = x^x$, $y = x^{\\sin x}$, and other functions where the variable appears in both base and exponent.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish an explicit function $y = f(x)$ from an implicit equation $F(x,y) = 0$ and explain why some curves resist being written explicitly</li>
<li>Apply the chain rule treating $y$ as an unknown function of $x$ to differentiate any equation containing $x$ and $y$</li>
<li>Follow a clean 5-step recipe for implicit differentiation and use it to find $\\dfrac{dy}{dx}$ symbolically</li>
<li>Compute slopes of tangent lines to circles, ellipses, and other classical curves at specified points</li>
<li>Recognise when logarithmic differentiation is the right tool: products of many factors, quotients, and expressions of the form $f(x)^{g(x)}$</li>
<li>Differentiate $y = x^x$, $y = x^{\\sin x}$, and complicated quotient-of-product expressions by taking $\\ln$ first</li>
<li>Solve mixed exercises that combine implicit and logarithmic techniques in YKS/AYT style</li>
</ul>
</div>

<h2 class="lesson-title">1. Explicit vs. Implicit Functions</h2>

<div class="calc-highlight"><strong>An explicit function</strong> is written in the form $y = f(x)$ — $y$ is isolated on the left, and the right side is a formula in $x$ alone. An <strong>implicit equation</strong> is an arbitrary relation $F(x, y) = 0$ that links $x$ and $y$ without isolating either. Many implicit equations cannot be solved explicitly, yet they still define perfectly good curves with tangent lines and slopes.</div>

<p class="l-text">Compare the two columns below. Every explicit function can be written implicitly (just move everything to one side: $y = x^2 \\iff y - x^2 = 0$), but the reverse is not always possible.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">EXPLICIT FORM</div><div class="compare-item">$y = x^2 + 3x - 1$ (parabola)</div><div class="compare-item">$y = \\sin(2x)$ (sine wave)</div><div class="compare-item">$y = e^x \\cdot \\cos x$ (decaying oscillation)</div><div class="compare-item">Easy to plot point-by-point: pick $x$, evaluate, plot $(x, y)$</div></div><div class="compare-col"><div class="compare-title">IMPLICIT FORM</div><div class="compare-item">$x^2 + y^2 = 25$ (circle of radius 5)</div><div class="compare-item">$x^3 + y^3 = 6xy$ (folium of Descartes)</div><div class="compare-item">$x \\cdot y + \\sin y = 5$ (transcendental curve)</div><div class="compare-item">Difficult or impossible to plot pointwise; needs special techniques</div></div></div>

<p class="l-text"><strong>Why some implicit equations cannot be made explicit.</strong> The unit circle $x^2 + y^2 = 1$ does have an explicit form — sort of. Solving for $y$ gives $y = \\pm\\sqrt{1 - x^2}$, which is two functions glued together (the upper and lower semicircles), not one. The plus-or-minus is not a defect of our algebra; it is the geometry itself telling us that for a given $x$ there are two possible $y$-values. For the folium $x^3 + y^3 = 6xy$, even this trick fails: solving for $y$ requires the cubic formula, which produces an unwieldy mess. For most implicit equations we simply cannot extract $y$ at all.</p>

<div class="think-box"><div class="think-label">WHY DO WE EVEN CARE?</div><div class="think-body">Many of the most important curves in geometry and physics are naturally implicit. The orbits of planets (Kepler's ellipses) are written $9x^2 + 4y^2 = 36$, not $y = \\text{something}(x)$. Equipotential lines in electrostatics, level curves of a temperature field, the boundary of a magnetic region — these all arrive as implicit equations. Implicit differentiation lets us compute slopes on these curves without ever having to "solve for $y$."</div></div>

<h2 class="lesson-title">2. The Logic of Implicit Differentiation</h2>

<div class="calc-highlight"><strong>The single key idea:</strong> in an equation like $x^2 + y^2 = 25$, treat $y$ as an unknown function of $x$ — call it $y(x)$. Then any expression containing $y$ becomes a composite function, and we differentiate it using the <em>chain rule</em>. After applying $\\dfrac{d}{dx}$ to both sides, we solve algebraically for $\\dfrac{dy}{dx}$.</div>

<p class="l-text">Let us trace this idea through one example, slowly. Start with $y^2 = $ some expression in $x$. Differentiating both sides with respect to $x$, what is $\\dfrac{d}{dx}(y^2)$? It is not simply $2y$ — that would be true if we were differentiating with respect to $y$ itself. Since $y$ is a function of $x$, we have a composite: outer function squaring, inner function $y(x)$. By the chain rule:</p>

<div class="calc-formula"><div class="formula-label">CHAIN RULE ON A POWER OF y</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(y^2\\bigr) = 2y \\cdot \\frac{dy}{dx}$$</div><div class="formula-sub">More generally, $\\dfrac{d}{dx}\\bigl(y^n\\bigr) = n y^{n-1} \\cdot \\dfrac{dy}{dx}$. The extra $\\dfrac{dy}{dx}$ factor is the chain rule's contribution.</div></div>

<p class="l-text">The same logic applies to <em>every</em> function of $y$. Differentiating with respect to $x$:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\dfrac{d}{dx}(\\sin y)$</div><div class="card-body">$= \\cos y \\cdot \\dfrac{dy}{dx}$ — outer derivative $\\cos$, inner derivative $y'$.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{d}{dx}(e^y)$</div><div class="card-body">$= e^y \\cdot \\dfrac{dy}{dx}$ — outer derivative $e^y$, inner derivative $y'$.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{d}{dx}(\\ln y)$</div><div class="card-body">$= \\dfrac{1}{y} \\cdot \\dfrac{dy}{dx}$ — outer derivative $1/y$, inner derivative $y'$.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{d}{dx}(x \\cdot y)$</div><div class="card-body">$= y + x \\cdot \\dfrac{dy}{dx}$ — product rule, with the second factor producing a $y'$.</div></div>
</div>

<p class="l-text"><strong>The mantra:</strong> "whenever you differentiate a term containing $y$, attach a $\\dfrac{dy}{dx}$ factor." Pure $x$ terms differentiate as usual; pure $y$ terms pick up an extra $y'$; mixed $xy$ terms need the product rule.</p>

<div class="l-note"><strong>Notation reminder.</strong> $\\dfrac{dy}{dx}$ and $y'$ mean exactly the same thing. The first emphasises that $y$ is a function of $x$; the second is shorter. Use whichever you find clearer; switch freely.</div>

<h2 class="lesson-title">3. The 5-Step Recipe</h2>

<div class="calc-highlight"><strong>Implicit differentiation in five mechanical steps.</strong> Memorise this recipe and apply it without thinking. It works for every implicit equation you will see at high-school or AYT level.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Both sides, $d/dx$</div><div class="card-body">Apply the operator $\\dfrac{d}{dx}$ to <em>every term</em> on both sides of the equation. The equality is preserved because two equal quantities have equal derivatives.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Differentiate pure $x$ terms</div><div class="card-body">Anything depending only on $x$ uses the ordinary rules: $\\dfrac{d}{dx}(x^3) = 3x^2$, $\\dfrac{d}{dx}(\\sin x) = \\cos x$, and so on. Constants disappear.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Chain rule on $y$ terms</div><div class="card-body">Anything containing $y$ generates the chain rule: $\\dfrac{d}{dx}\\bigl(y^n\\bigr) = n y^{n-1} y'$, $\\dfrac{d}{dx}(\\sin y) = \\cos y \\cdot y'$, etc. Always tack on the $y'$.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — Product rule on $xy$ terms</div><div class="card-body">Mixed terms like $xy$, $x^2 y$, $x \\sin y$ need the product rule. One factor produces an $x$ derivative; the other factor (containing $y$) produces a $y'$.</div></div>
<div class="calc-card"><div class="card-title">Step 5 — Solve for $y'$</div><div class="card-body">Collect every term containing $y'$ on one side, every other term on the other side, factor out $y'$, and divide. The answer typically depends on both $x$ and $y$.</div></div>
</div>

<p class="l-text">That last point is worth emphasising. With explicit differentiation, $y'$ is a function of $x$ alone. With implicit differentiation, $y'$ is generally a function of both $x$ and $y$ — and that is perfectly fine, because we can plug in a specific point $(x_0, y_0)$ on the curve to evaluate the slope there.</p>

<h2 class="lesson-title">4. Worked Example 1: The Circle $x^2 + y^2 = 25$</h2>

<div class="calc-highlight"><strong>The circle of radius 5</strong> centered at the origin. We will find $\\dfrac{dy}{dx}$ implicitly, interpret the answer geometrically, and write the equation of the tangent line at the point $(3, 4)$.</div>

<p class="l-text">Apply the operator $\\dfrac{d}{dx}$ to both sides of $x^2 + y^2 = 25$.</p>

<div class="calc-formula"><div class="formula-label">STEP 1 — APPLY d/dx</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(x^2 + y^2\\bigr) = \\frac{d}{dx}(25)$$</div><div class="formula-sub">The right side is a constant, so its derivative is zero.</div></div>

<p class="l-text"><strong>Step 2 — pure $x$ term:</strong> $\\dfrac{d}{dx}(x^2) = 2x$.</p>

<p class="l-text"><strong>Step 3 — $y$ term:</strong> $\\dfrac{d}{dx}(y^2) = 2y \\cdot y'$ (chain rule).</p>

<p class="l-text"><strong>Step 5 — solve.</strong> Putting it together:</p>

<div class="calc-formula"><div class="formula-label">SOLVING FOR y'</div><div class="formula-main">$$2x + 2y\\, y' = 0 \\;\\Longrightarrow\\; y' = -\\frac{x}{y}$$</div><div class="formula-sub">The slope on the circle at any point $(x, y)$ is $-x/y$. Notice the answer depends on both $x$ and $y$.</div></div>

<p class="l-text"><strong>Geometric check.</strong> The radius from the origin to the point $(x, y)$ has slope $y/x$. The tangent line should be perpendicular to the radius. Two lines are perpendicular when their slopes multiply to $-1$. And indeed:</p>

<div class="calc-formula"><div class="formula-label">PERPENDICULAR CHECK</div><div class="formula-main">$$\\text{slope of radius} \\times \\text{slope of tangent} = \\frac{y}{x} \\times \\left(-\\frac{x}{y}\\right) = -1. \\;\\checkmark$$</div><div class="formula-sub">Implicit differentiation has reproduced the classical fact "tangent perpendicular to radius."</div></div>

<div class="calc-graph"><div id="plot-l21-circle-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the circle $x^2 + y^2 = 25$ in blue with the point $(3, 4)$ marked, the radius shown as a dotted line, and the tangent line at $(3, 4)$ drawn in gold. The tangent line has slope $y' = -3/4$, exactly perpendicular to the radius.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var theta=[];var cx=[];var cy=[];for(var i=0;i<=360;i++){theta.push(i*Math.PI/180);cx.push(5*Math.cos(i*Math.PI/180));cy.push(5*Math.sin(i*Math.PI/180));}
var circle={x:cx,y:cy,mode:'lines',name:'x² + y² = 25',line:{color:'#3b82f6',width:3}};
var radius={x:[0,3],y:[0,4],mode:'lines',name:'radius',line:{color:'rgba(255,255,255,0.5)',width:1.5,dash:'dot'}};
var px=3;var py=4;var slope=-px/py;
var tx=[];var ty=[];for(var k=-6;k<=6;k++){var dx=k*0.5;tx.push(px+dx);ty.push(py+slope*dx);}
var tangent={x:tx,y:ty,mode:'lines',name:'tangent at (3,4)',line:{color:'#f59e0b',width:2.5}};
var point={x:[px],y:[py],mode:'markers+text',name:'(3, 4)',marker:{color:'#ef4444',size:13},text:['(3, 4)'],textposition:'top right',textfont:{color:'#ef4444',size:13}};
var origin={x:[0],y:[0],mode:'markers',name:'O',marker:{color:'rgba(255,255,255,0.7)',size:6},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l21-circle-en',[circle,radius,tangent,point,origin],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TANGENT LINE</div><div class="example-body"><strong>Find the equation of the tangent line to $x^2 + y^2 = 25$ at the point $(3, 4)$.</strong><br><br>From the formula $y' = -x/y$ we evaluate at $(3, 4)$:<br>$y'(3,4) = -3/4$.<br><br>Using point-slope form with slope $-3/4$ and point $(3, 4)$:<br>$y - 4 = -\\dfrac{3}{4}(x - 3)$<br>$y = -\\dfrac{3}{4}x + \\dfrac{9}{4} + 4 = -\\dfrac{3}{4}x + \\dfrac{25}{4}$.<br><br>The tangent line is $4y + 3x = 25$, or equivalently $3x + 4y - 25 = 0$. $\\blacksquare$</div></div>

<h2 class="lesson-title">5. Worked Example 2: The Folium of Descartes $x^3 + y^3 = 6xy$</h2>

<div class="calc-highlight"><strong>The folium of Descartes</strong> is a classical curve studied by Descartes in 1638. Its single loop sits in the first quadrant and the curve is one of the standard testing grounds for implicit differentiation because the equation contains <em>every</em> case: pure $x$, pure $y$, and a mixed product $xy$.</div>

<p class="l-text">Apply $\\dfrac{d}{dx}$ to both sides of $x^3 + y^3 = 6xy$:</p>

<p class="l-text"><strong>Left side, term by term:</strong></p>
<ul>
<li>$\\dfrac{d}{dx}(x^3) = 3x^2$ (pure $x$, standard rule)</li>
<li>$\\dfrac{d}{dx}(y^3) = 3y^2 \\cdot y'$ (chain rule)</li>
</ul>

<p class="l-text"><strong>Right side, product rule:</strong> $\\dfrac{d}{dx}(6xy) = 6 \\cdot \\bigl(y + x \\cdot y'\\bigr) = 6y + 6x \\, y'$.</p>

<div class="calc-formula"><div class="formula-label">AFTER DIFFERENTIATION</div><div class="formula-main">$$3x^2 + 3y^2 \\, y' = 6y + 6x \\, y'$$</div><div class="formula-sub">Now collect $y'$ terms on one side, everything else on the other.</div></div>

<p class="l-text"><strong>Step 5 — solve for $y'$:</strong></p>

<div class="calc-formula"><div class="formula-label">SOLVE</div><div class="formula-main">$$3y^2 \\, y' - 6x \\, y' = 6y - 3x^2 \\;\\Longrightarrow\\; y' = \\frac{6y - 3x^2}{3y^2 - 6x} = \\frac{2y - x^2}{y^2 - 2x}$$</div><div class="formula-sub">The slope at any point $(x, y)$ on the folium.</div></div>

<div class="calc-graph"><div id="plot-l21-folium-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the folium of Descartes $x^3 + y^3 = 6xy$. The curve has a loop in the first quadrant, passes through the origin (where it has a self-intersection), and has the diagonal $y = -x - 2$ as an asymptote in the third quadrant. The point $(3, 3)$ is marked — by symmetry the tangent there is horizontal-vertical balanced (slope $-1$).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var tvals=[];var fx=[];var fy=[];for(var i=-300;i<=300;i++){var t=i/100;if(Math.abs(t+1)<0.001)continue;var denom=1+t*t*t;var x=6*t/denom;var y=6*t*t/denom;if(isFinite(x)&&isFinite(y)&&Math.abs(x)<8&&Math.abs(y)<8){fx.push(x);fy.push(y);}}
var folium={x:fx,y:fy,mode:'markers',name:'x³ + y³ = 6xy',marker:{color:'#3b82f6',size:3}};
var asy=[];var ay=[];for(var k=-80;k<=20;k++){var xa=k/10;asy.push(xa);ay.push(-xa-2);}
var asymptote={x:asy,y:ay,mode:'lines',name:'asymptote y = -x - 2',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dash'}};
var pt={x:[3],y:[3],mode:'markers+text',name:'(3, 3)',marker:{color:'#ef4444',size:11},text:['(3, 3)'],textposition:'top right',textfont:{color:'#ef4444',size:12}};
var px2=3;var py2=3;var slope2=(2*py2-px2*px2)/(py2*py2-2*px2);
var tx2=[];var ty2=[];for(var m=-12;m<=12;m++){var dx2=m*0.25;tx2.push(px2+dx2);ty2.push(py2+slope2*dx2);}
var tan2={x:tx2,y:ty2,mode:'lines',name:'tangent at (3,3)',line:{color:'#f59e0b',width:2}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-5,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l21-folium-en',[folium,asymptote,tan2,pt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">SLOPE AT (3, 3)</div><div class="example-body">Plug $x = 3, y = 3$ into the formula:<br><br>$y'(3, 3) = \\dfrac{2 \\cdot 3 - 3^2}{3^2 - 2 \\cdot 3} = \\dfrac{6 - 9}{9 - 6} = \\dfrac{-3}{3} = -1$.<br><br>By the symmetry $x \\leftrightarrow y$ of the original equation (swapping $x$ and $y$ leaves $x^3 + y^3 = 6xy$ unchanged), the curve is symmetric about the line $y = x$. The point $(3, 3)$ lies on this line of symmetry, so it makes sense that the tangent there has slope $-1$ (perpendicular to $y = x$). $\\blacksquare$</div></div>

<h2 class="lesson-title">6. Worked Example 3: $x \\cdot y + \\sin y = 5$</h2>

<div class="calc-highlight"><strong>This equation cannot be solved for $y$ in closed form.</strong> There is no formula that isolates $y$ as a function of $x$ — yet implicit differentiation handles it without any difficulty at all. This is one of the technique's main strengths: it works on equations where everything else fails.</div>

<p class="l-text">Apply $\\dfrac{d}{dx}$ to both sides of $xy + \\sin y = 5$:</p>

<p class="l-text"><strong>Term 1 (product):</strong> $\\dfrac{d}{dx}(xy) = y + x \\, y'$ (product rule).</p>

<p class="l-text"><strong>Term 2 (function of $y$):</strong> $\\dfrac{d}{dx}(\\sin y) = \\cos y \\cdot y'$ (chain rule).</p>

<p class="l-text"><strong>Right side:</strong> $\\dfrac{d}{dx}(5) = 0$.</p>

<div class="calc-formula"><div class="formula-label">AFTER DIFFERENTIATION</div><div class="formula-main">$$y + x \\, y' + \\cos y \\cdot y' = 0$$</div><div class="formula-sub">Now collect $y'$ terms and solve.</div></div>

<div class="calc-formula"><div class="formula-label">SOLVING</div><div class="formula-main">$$y' \\, (x + \\cos y) = -y \\;\\Longrightarrow\\; y' = -\\frac{y}{x + \\cos y}$$</div><div class="formula-sub">The formula gives the slope at any point $(x, y)$ that satisfies the original equation.</div></div>

<p class="l-text"><strong>Special case.</strong> At a point where the original equation is satisfied with $y = \\pi$, the slope is $y' = -\\pi / (x + \\cos\\pi) = -\\pi / (x - 1)$. We do not have an explicit formula for $y(x)$, but we can still compute slopes anywhere on the curve.</p>

<div class="l-note"><strong>What if the denominator is zero?</strong> Whenever $x + \\cos y = 0$ at some point on the curve, the formula for $y'$ blows up — the tangent line becomes <em>vertical</em>. A vertical tangent is not a failure of the curve; it is a genuine geometric feature (the unit circle has vertical tangents at $(\\pm 5, 0)$ for instance). Implicit differentiation detects these places automatically.</div>

<h2 class="lesson-title">7. When to Reach for Logarithmic Differentiation</h2>

<div class="calc-highlight"><strong>Logarithmic differentiation is implicit differentiation's specialised cousin.</strong> Instead of working on an equation $F(x, y) = 0$, we start from a perfectly explicit $y = f(x)$, take $\\ln$ of both sides, then differentiate implicitly. The reason this is sometimes vastly easier is the algebra of logarithms: $\\ln$ turns products into sums, quotients into differences, and powers into multiplications.</div>

<p class="l-text">Recall the three logarithm identities you have used since lesson 11:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Product rule for $\\ln$</div><div class="card-body">$\\ln(a \\cdot b) = \\ln a + \\ln b$. A complicated product becomes a sum of simpler terms — and the derivative of a sum is the sum of derivatives.</div></div>
<div class="calc-card"><div class="card-title">Quotient rule for $\\ln$</div><div class="card-body">$\\ln(a / b) = \\ln a - \\ln b$. Differentiating a quotient by the quotient rule is messy; differentiating a difference is trivial.</div></div>
<div class="calc-card"><div class="card-title">Power rule for $\\ln$</div><div class="card-body">$\\ln(a^k) = k \\ln a$. This pulls the exponent down as a multiplier — vital for functions like $x^x$ where the variable appears in the exponent.</div></div>
</div>

<p class="l-text"><strong>Three signals to use logarithmic differentiation.</strong></p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIGNAL 1 — Variable in the exponent</div><div class="compare-item">$y = x^x$, $y = x^{\\sin x}$, $y = (\\sin x)^x$</div><div class="compare-item">Power rule does NOT apply (because the exponent is not constant)</div><div class="compare-item">Exponential rule does NOT apply (because the base is not constant)</div><div class="compare-item">Logarithmic differentiation is the <em>only</em> standard technique that works</div></div><div class="compare-col"><div class="compare-title">SIGNAL 2 — Product of many factors</div><div class="compare-item">$y = (x+1)^3 (x-2)^4 (x+5)^7$</div><div class="compare-item">Direct product rule would take many applications</div><div class="compare-item">Taking $\\ln$ converts to a sum: $\\ln y = 3\\ln(x+1) + 4\\ln(x-2) + 7\\ln(x+5)$</div><div class="compare-item">Then differentiate term by term</div></div></div>

<div class="calc-highlight"><strong>SIGNAL 3 — Complicated quotient of products.</strong> Anything looking like $y = \\dfrac{f_1(x)^{a_1} f_2(x)^{a_2}}{g_1(x)^{b_1} g_2(x)^{b_2}}$. Direct quotient + product rules would be a nightmare. $\\ln$ flattens everything to a sum and difference.</div>

<h2 class="lesson-title">8. The Logarithmic Differentiation Recipe</h2>

<div class="calc-highlight"><strong>Four steps</strong> that turn any of the situations above into a routine calculation.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Take $\\ln$ of both sides</div><div class="card-body">Starting from $y = f(x)$, write $\\ln y = \\ln f(x)$. Always assume we are working where $y > 0$; if $y$ might be negative we take $\\ln|y|$ instead.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Simplify with $\\ln$ identities</div><div class="card-body">Use $\\ln(ab) = \\ln a + \\ln b$, $\\ln(a/b) = \\ln a - \\ln b$, $\\ln(a^k) = k \\ln a$ to break the right side into the simplest possible pieces.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Differentiate both sides</div><div class="card-body">Left side: $\\dfrac{d}{dx}(\\ln y) = \\dfrac{1}{y} \\cdot y'$ (chain rule — this is the implicit step). Right side: differentiate each piece directly.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — Solve for $y'$ and substitute</div><div class="card-body">Multiply both sides by $y$ to isolate $y'$. Then substitute the original expression for $y$ to write the answer purely in $x$.</div></div>
</div>

<p class="l-text">That is the entire technique. Two examples will make it concrete.</p>

<h2 class="lesson-title">9. Worked Example: $y = x^x$</h2>

<div class="calc-highlight"><strong>The function $y = x^x$</strong> grows faster than any polynomial and faster than any ordinary exponential. It is defined for $x > 0$ (and at $x = 0$ by the convention $0^0 = 1$). Its derivative cannot be obtained by either the power rule (because the exponent is not constant) or the standard exponential rule (because the base is not constant). Logarithmic differentiation handles it cleanly.</div>

<p class="l-text"><strong>Step 1 — take $\\ln$:</strong> $\\ln y = \\ln(x^x)$.</p>

<p class="l-text"><strong>Step 2 — simplify:</strong> by the power rule for $\\ln$, $\\ln(x^x) = x \\ln x$. So $\\ln y = x \\ln x$.</p>

<p class="l-text"><strong>Step 3 — differentiate.</strong> Left side: $\\dfrac{1}{y} \\cdot y'$. Right side: product rule on $x \\ln x$, giving $1 \\cdot \\ln x + x \\cdot \\dfrac{1}{x} = \\ln x + 1$.</p>

<div class="calc-formula"><div class="formula-label">DIFFERENTIATED EQUATION</div><div class="formula-main">$$\\frac{y'}{y} = \\ln x + 1$$</div><div class="formula-sub">Now multiply both sides by $y$ and substitute $y = x^x$.</div></div>

<div class="calc-formula"><div class="formula-label">FINAL ANSWER</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(x^x\\bigr) = x^x \\, (\\ln x + 1)$$</div><div class="formula-sub">A clean closed-form derivative for one of the more exotic high-school functions.</div></div>

<div class="calc-graph"><div id="plot-l21-xpowerx-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $y = x^x$ in blue and its derivative $y' = x^x(\\ln x + 1)$ in gold, plotted for $0.1 \\leq x \\leq 3$. The function has a minimum at $x = 1/e \\approx 0.368$, where the derivative crosses zero (because $\\ln(1/e) + 1 = -1 + 1 = 0$). After this point both function and derivative grow explosively.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];var dys=[];for(var i=10;i<=300;i++){var x=i/100;xs.push(x);ys.push(Math.pow(x,x));dys.push(Math.pow(x,x)*(Math.log(x)+1));}
var fn={x:xs,y:ys,mode:'lines',name:'y = x^x',line:{color:'#3b82f6',width:3}};
var dfn={x:xs,y:dys,mode:'lines',name:"y' = x^x (ln x + 1)",line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var mn={x:[1/Math.E],y:[Math.pow(1/Math.E,1/Math.E)],mode:'markers+text',name:'min at x = 1/e',marker:{color:'#ef4444',size:11,symbol:'star'},text:['min'],textposition:'bottom right',textfont:{color:'#ef4444',size:12}};
var zero={x:[0,3.1],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0,3.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2,15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l21-xpowerx-en',[fn,dfn,zero,mn],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">WHY THE MINIMUM IS AT 1/e</div><div class="think-body">The derivative is zero when $\\ln x + 1 = 0$, i.e. $\\ln x = -1$, i.e. $x = e^{-1} = 1/e \\approx 0.368$. At that point $y = (1/e)^{1/e} \\approx 0.692$. This is the global minimum of $y = x^x$ on $(0, \\infty)$. A small but striking fact: $x^x$ is not monotonic, even though it looks like a simple exponential at first glance.</div></div>

<h2 class="lesson-title">10. Worked Example: A Messy Quotient</h2>

<div class="calc-highlight"><strong>The expression</strong> $y = \\dfrac{(x^2 + 1)^3 \\sqrt{x - 1}}{(x + 4)^5}$ would be a horror to differentiate directly. Quotient rule outside, product rule inside the numerator, power rule on each factor, chain rule on the square root. Logarithmic differentiation reduces it to four lines.</div>

<p class="l-text"><strong>Step 1 — take $\\ln$:</strong></p>

<div class="calc-formula"><div class="formula-label">LOG OF BOTH SIDES</div><div class="formula-main">$$\\ln y = \\ln\\!\\left(\\frac{(x^2 + 1)^3 (x - 1)^{1/2}}{(x + 4)^5}\\right)$$</div><div class="formula-sub">Note that $\\sqrt{x - 1} = (x - 1)^{1/2}$.</div></div>

<p class="l-text"><strong>Step 2 — simplify with $\\ln$ identities.</strong> Quotient becomes difference, product becomes sum, powers come down:</p>

<div class="calc-formula"><div class="formula-label">SIMPLIFIED LOG FORM</div><div class="formula-main">$$\\ln y = 3 \\ln(x^2 + 1) + \\tfrac{1}{2} \\ln(x - 1) - 5 \\ln(x + 4)$$</div><div class="formula-sub">A sum of three simple terms, each easy to differentiate.</div></div>

<p class="l-text"><strong>Step 3 — differentiate.</strong> Left side: $\\dfrac{1}{y} \\cdot y'$. Each $\\ln$ term on the right has derivative $\\dfrac{1}{\\text{argument}} \\cdot (\\text{argument})'$:</p>

<div class="calc-formula"><div class="formula-label">DIFFERENTIATED EQUATION</div><div class="formula-main">$$\\frac{y'}{y} = 3 \\cdot \\frac{2x}{x^2 + 1} + \\frac{1}{2} \\cdot \\frac{1}{x - 1} - 5 \\cdot \\frac{1}{x + 4} = \\frac{6x}{x^2 + 1} + \\frac{1}{2(x - 1)} - \\frac{5}{x + 4}$$</div><div class="formula-sub">No chain-rule trauma. No nested fractions. Just three clean pieces.</div></div>

<p class="l-text"><strong>Step 4 — solve for $y'$:</strong></p>

<div class="calc-formula"><div class="formula-label">FINAL ANSWER</div><div class="formula-main">$$y' = \\frac{(x^2 + 1)^3 \\sqrt{x - 1}}{(x + 4)^5} \\left[\\frac{6x}{x^2 + 1} + \\frac{1}{2(x - 1)} - \\frac{5}{x + 4}\\right]$$</div><div class="formula-sub">The bracketed sum is the "logarithmic derivative" $y' / y$.</div></div>

<div class="l-note"><strong>Compare effort.</strong> Direct quotient rule on the original would require at least 6–8 lines of algebra to reach a comparable form. Logarithmic differentiation gets there in 4 lines, with each step using only one identity at a time.</div>

<h2 class="lesson-title">11. AYT/YKS Practice Exercises</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — TANGENT TO AN ELLIPSE</div><div class="example-body"><strong>Find $\\dfrac{dy}{dx}$</strong> implicitly for the ellipse $9x^2 + 4y^2 = 36$, and write the tangent line at $(0, 3)$.<br><br><em>Solution.</em> Differentiate: $18x + 8y \\, y' = 0$, so $y' = -\\dfrac{9x}{4y}$.<br>At $(0, 3)$: $y' = 0$. The tangent is horizontal: $y = 3$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — POINT WITH GIVEN SLOPE</div><div class="example-body"><strong>On the circle</strong> $x^2 + y^2 = 100$, find all points where the tangent has slope $1$.<br><br><em>Solution.</em> $y' = -x/y = 1 \\implies x = -y$. Substitute into $x^2 + y^2 = 100$: $2y^2 = 100 \\implies y = \\pm\\sqrt{50} = \\pm 5\\sqrt{2}$.<br>The points are $(-5\\sqrt{2}, 5\\sqrt{2})$ and $(5\\sqrt{2}, -5\\sqrt{2})$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — IMPLICIT WITH TRIG</div><div class="example-body"><strong>Find $y'$</strong> if $\\sin(xy) = x + y$.<br><br><em>Solution.</em> Apply $\\dfrac{d}{dx}$: $\\cos(xy) \\cdot (y + x y') = 1 + y'$. Expand: $y \\cos(xy) + x \\cos(xy) \\, y' = 1 + y'$. Collect: $y'\\,[x \\cos(xy) - 1] = 1 - y \\cos(xy)$.<br>So $y' = \\dfrac{1 - y \\cos(xy)}{x \\cos(xy) - 1}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — IMPLICIT POLYNOMIAL</div><div class="example-body"><strong>Find</strong> $y'$ for $x^2 y + xy^2 = 6$ at the point $(1, 2)$.<br><br><em>Solution.</em> Differentiate term by term. $\\dfrac{d}{dx}(x^2 y) = 2xy + x^2 y'$. $\\dfrac{d}{dx}(xy^2) = y^2 + 2xy \\, y'$. So $2xy + x^2 y' + y^2 + 2xy \\, y' = 0$.<br>Collect: $y'(x^2 + 2xy) = -2xy - y^2$, hence $y' = -\\dfrac{2xy + y^2}{x^2 + 2xy} = -\\dfrac{y(2x + y)}{x(x + 2y)}$.<br>At $(1, 2)$: $y' = -\\dfrac{2 \\cdot (2 + 2)}{1 \\cdot (1 + 4)} = -\\dfrac{8}{5}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — LOG DIFF, BIG PRODUCT</div><div class="example-body"><strong>Differentiate</strong> $y = (x - 1)^2 (x + 2)^3 (x + 5)^4$ using logarithmic differentiation.<br><br><em>Solution.</em> Take $\\ln$: $\\ln y = 2\\ln(x - 1) + 3\\ln(x + 2) + 4\\ln(x + 5)$. Differentiate: $\\dfrac{y'}{y} = \\dfrac{2}{x - 1} + \\dfrac{3}{x + 2} + \\dfrac{4}{x + 5}$.<br>So $y' = (x - 1)^2 (x + 2)^3 (x + 5)^4 \\left[\\dfrac{2}{x - 1} + \\dfrac{3}{x + 2} + \\dfrac{4}{x + 5}\\right]$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — LOG DIFF, VARIABLE EXPONENT</div><div class="example-body"><strong>Find</strong> $\\dfrac{d}{dx}\\bigl((\\sin x)^x\\bigr)$ for $0 < x < \\pi$.<br><br><em>Solution.</em> Let $y = (\\sin x)^x$. Take $\\ln$: $\\ln y = x \\ln(\\sin x)$. Differentiate using the product rule on the right: $\\dfrac{y'}{y} = \\ln(\\sin x) + x \\cdot \\dfrac{\\cos x}{\\sin x} = \\ln(\\sin x) + x \\cot x$.<br>So $y' = (\\sin x)^x \\, [\\ln(\\sin x) + x \\cot x]$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — TANGENT TO ASTROID</div><div class="example-body">The <strong>astroid</strong> is the curve $x^{2/3} + y^{2/3} = 4$. Find $y'$ and evaluate at the point $(1, 3\\sqrt{3})$.<br><br><em>Solution.</em> Differentiate: $\\dfrac{2}{3} x^{-1/3} + \\dfrac{2}{3} y^{-1/3} y' = 0$, so $y' = -\\dfrac{x^{-1/3}}{y^{-1/3}} = -\\left(\\dfrac{y}{x}\\right)^{1/3}$.<br>At $(1, 3\\sqrt{3})$: $y/x = 3\\sqrt{3} = 3^{3/2}$, cube root gives $3^{1/2} = \\sqrt{3}$. So $y' = -\\sqrt{3}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — MIXED: $y = x^{\\ln x}$</div><div class="example-body"><strong>Find</strong> $y'$ if $y = x^{\\ln x}$ for $x > 0$.<br><br><em>Solution.</em> Take $\\ln$: $\\ln y = \\ln x \\cdot \\ln x = (\\ln x)^2$. Differentiate: $\\dfrac{y'}{y} = 2 \\ln x \\cdot \\dfrac{1}{x} = \\dfrac{2 \\ln x}{x}$.<br>So $y' = x^{\\ln x} \\cdot \\dfrac{2 \\ln x}{x} = \\dfrac{2 \\ln x \\cdot x^{\\ln x}}{x}$, which can also be written as $2 \\ln x \\cdot x^{\\ln x - 1}$. $\\blacksquare$</div></div>

<h2 class="lesson-title">12. Visual Recap: Circle Tangent at (3, 4) and Method Comparison</h2>

<div class="calc-highlight"><strong>One more look at the circle.</strong> The geometry below makes the formula $y' = -x/y = -3/4$ obvious: at $(3, 4)$, the radius rises 4 units for every 3 units of horizontal motion (slope $+4/3$), so the perpendicular tangent must descend 3 units for every 4 units (slope $-3/4$). Implicit differentiation simply automates this perpendicularity argument.</div>

<div class="calc-graph"><div id="plot-l21-circle-en-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the circle $x^2 + y^2 = 25$ with the radius from origin to $(3, 4)$ drawn as a dashed white line (slope $+4/3$) and the tangent line drawn in gold (slope $-3/4$). The product of these slopes is $-1$, confirming perpendicularity. The implicit derivative formula $\\dfrac{dy}{dx} = -\\dfrac{x}{y}$ encodes this geometric fact for every point on the circle.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var cx=[];var cy=[];for(var i=0;i<=360;i++){cx.push(5*Math.cos(i*Math.PI/180));cy.push(5*Math.sin(i*Math.PI/180));}
var circ={x:cx,y:cy,mode:'lines',name:'x² + y² = 25',line:{color:'#3b82f6',width:3}};
var rad={x:[0,3],y:[0,4],mode:'lines',name:'radius (slope +4/3)',line:{color:'rgba(255,255,255,0.55)',width:1.8,dash:'dash'}};
var px=3;var py=4;var slope=-px/py;
var tx=[];var ty=[];for(var k=-6;k<=6;k++){var dx=k*0.6;tx.push(px+dx);ty.push(py+slope*dx);}
var tan={x:tx,y:ty,mode:'lines',name:'tangent (slope -3/4)',line:{color:'#f59e0b',width:2.5}};
var pt={x:[px],y:[py],mode:'markers+text',name:'(3, 4)',marker:{color:'#ef4444',size:13},text:['(3, 4)'],textposition:'top right',textfont:{color:'#ef4444',size:13}};
var orig={x:[0],y:[0],mode:'markers+text',name:'origin',marker:{color:'rgba(255,255,255,0.75)',size:7},text:['O'],textposition:'bottom left',textfont:{color:'rgba(255,255,255,0.8)',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l21-circle-en-extra',[circ,rad,tan,pt,orig],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Method comparison.</strong> When you face an unfamiliar derivative, which technique should you reach for? The table below maps each common situation to the right tool and shows a representative example.</div>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.9rem;background:rgba(15,15,15,0.6);border:1px solid rgba(59,130,246,0.25)">
<thead>
<tr style="background:rgba(59,130,246,0.12)">
<th style="padding:0.7rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.35);color:#3b82f6;font-weight:700">When to use</th>
<th style="padding:0.7rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.35);color:#3b82f6;font-weight:700">Example function</th>
<th style="padding:0.7rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.35);color:#3b82f6;font-weight:700">Technique</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y$ isolated, simple algebraic form</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = x^3 + 2x - 1$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Power rule (direct)</td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Composite (function inside function)</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = \\sin(3x^2 + 1)$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Chain rule</td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$x$ and $y$ mixed, cannot isolate $y$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$x^2 + y^2 = 25$, $xy + \\sin y = 5$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)"><strong style="color:#3b82f6">Implicit differentiation</strong></td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Product of many factors</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = (x+1)^3 (x-2)^4 (x+5)^7$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)"><strong style="color:#3b82f6">Logarithmic differentiation</strong></td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Variable in both base and exponent</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = x^x$, $y = (\\sin x)^x$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)"><strong style="color:#3b82f6">Logarithmic differentiation</strong> (only choice)</td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Complicated quotient of products</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = \\dfrac{(x^2+1)^3 \\sqrt{x-1}}{(x+4)^5}$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)"><strong style="color:#3b82f6">Logarithmic differentiation</strong></td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)">Constant base, variable exponent</td>
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)">$y = 2^{3x+1}$, $y = e^{x^2}$</td>
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)">Exponential rule + chain</td>
</tr>
</tbody>
</table>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>Explicit vs. implicit:</strong> $y = f(x)$ isolates $y$; $F(x, y) = 0$ does not — yet still defines a curve</li>
<li><strong>The single key rule:</strong> when differentiating a term containing $y$, attach a $\\dfrac{dy}{dx}$ factor (chain rule)</li>
<li><strong>5-step recipe:</strong> $d/dx$ both sides, do pure $x$ terms, chain on $y$ terms, product rule on $xy$, solve for $y'$</li>
<li>Slopes typically depend on both $x$ and $y$ — plug in the point to evaluate</li>
<li><strong>Circle $x^2 + y^2 = r^2$:</strong> $y' = -x/y$, reproducing the radius-tangent perpendicularity</li>
<li><strong>Logarithmic differentiation</strong> = take $\\ln$, simplify with identities, differentiate implicitly, solve for $y'$</li>
<li>Three signals to use it: variable in exponent, big product, complicated quotient of products</li>
<li><strong>$\\dfrac{d}{dx}(x^x) = x^x (\\ln x + 1)$</strong> — minimum at $x = 1/e$</li>
<li>Next lesson: applying derivatives to find tangent lines and normal lines on any curve</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Şimdiye kadar hesapladığın her türev, $y$'nin $x$'in açık bir fonksiyonu olarak yazıldığını varsayıyordu.</strong> $y = x^2 + 1$ veya $y = \\sin(3x)$ görüyorsun, 18–20. derslerdeki kuralları uyguluyorsun, $y'$ çıkıyor. Ama geometri ve fizikte eğrilerin çoğu bu rahat biçimde gelmez. Bir çember $x^2 + y^2 = 25$'tir. Bir elips $9x^2 + 4y^2 = 36$'dır. Descartes'ın ünlü folium eğrisi $x^3 + y^3 = 6xy$'dir. Bunların hiçbiri $y$'yi tek bir fonksiyon olarak temiz çözülemez — yine de neredeyse her noktada iyi tanımlı teğet doğrularına sahiptirler.</p>

<p class="l-text">Bu derste, tam olarak bu durumları ele alan, birbirine yakından bağlı iki tekniği öğreneceksin. <em>Kapalı (implicit) türev</em>, $y$'yi $x$'in bilinmeyen bir fonksiyonu olarak ele alır ve $F(x, y) = 0$ biçimindeki bir denklemden $\\dfrac{dy}{dx}$'i çıkarmak için zincir kuralını uygular. <em>Logaritmik türev</em>, türevden önce her iki tarafa $\\ln$ uygular; bu, çarpımları toplamlara, bölümleri farklara, kuvvetleri çarpmalara dönüştürür — son derece karmaşık ifadeleri yönetilebilir hale getirir ve $y = x^x$, $y = x^{\\sin x}$ gibi değişkenin hem tabanda hem de üste göründüğü fonksiyonların türevini almanın tek mantıklı yolunu sunar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">ÖĞRENİM ÇIKTILARI</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Açık fonksiyon $y = f(x)$ ile kapalı denklem $F(x, y) = 0$ arasındaki farkı tanı ve bazı eğrilerin neden açık yazılamadığını açıkla</li>
<li>$y$'yi $x$'in bilinmeyen bir fonksiyonu sayarak zincir kuralı uygula ve $x$ ile $y$ içeren her denklemin türevini al</li>
<li>Kapalı türev için temiz 5-adımlı bir tarifi takip et ve $\\dfrac{dy}{dx}$'i sembolik olarak bul</li>
<li>Çember, elips ve diğer klasik eğrilere belirlenmiş noktalarda teğet eğimlerini hesapla</li>
<li>Logaritmik türevin ne zaman doğru araç olduğunu tanı: çok sayıda çarpan, bölümler ve $f(x)^{g(x)}$ biçimindeki ifadeler</li>
<li>Önce $\\ln$ alarak $y = x^x$, $y = x^{\\sin x}$ ve karmaşık çarpım-bölüm ifadelerinin türevini al</li>
<li>Kapalı ve logaritmik teknikleri birleştiren YKS/AYT tarzı karışık problemleri çöz</li>
</ul>
</div>

<h2 class="lesson-title">1. Açık ve Kapalı Fonksiyonlar</h2>

<div class="calc-highlight"><strong>Açık bir fonksiyon</strong> $y = f(x)$ biçiminde yazılır — $y$ sol tarafta yalnız, sağ taraf yalnızca $x$ içeren bir formüldür. <strong>Kapalı bir denklem</strong>, $x$ ve $y$'yi hiçbirini yalıtmadan bağlayan keyfi bir $F(x, y) = 0$ ilişkisidir. Kapalı denklemlerin çoğu açık olarak çözülemez ama yine de teğet doğrularına ve eğimlere sahip mükemmel eğriler tanımlar.</div>

<p class="l-text">Aşağıdaki iki sütunu karşılaştır. Her açık fonksiyon kapalı yazılabilir (sadece her şeyi bir tarafa taşı: $y = x^2 \\iff y - x^2 = 0$), ama tersi her zaman mümkün değildir.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">AÇIK BİÇİM</div><div class="compare-item">$y = x^2 + 3x - 1$ (parabol)</div><div class="compare-item">$y = \\sin(2x)$ (sinüs dalgası)</div><div class="compare-item">$y = e^x \\cdot \\cos x$ (sönümlü salınım)</div><div class="compare-item">Nokta nokta çizmek kolay: $x$ seç, hesapla, $(x, y)$'yi çiz</div></div><div class="compare-col"><div class="compare-title">KAPALI BİÇİM</div><div class="compare-item">$x^2 + y^2 = 25$ (yarıçapı 5 olan çember)</div><div class="compare-item">$x^3 + y^3 = 6xy$ (Descartes folium'u)</div><div class="compare-item">$x \\cdot y + \\sin y = 5$ (transandantal eğri)</div><div class="compare-item">Noktasal çizimi zor ya da imkansız; özel teknikler gerekir</div></div></div>

<p class="l-text"><strong>Bazı kapalı denklemler neden açık hale getirilemez?</strong> Birim çember $x^2 + y^2 = 1$'in aslında açık bir biçimi vardır — bir tür. $y$ için çözmek $y = \\pm\\sqrt{1 - x^2}$ verir; bu, birbirine yapıştırılmış iki fonksiyondur (üst ve alt yarım çemberler), tek değil. Bu artı-eksi cebrimizin bir kusuru değildir; geometrinin kendisi bize bir $x$ için iki olası $y$ değeri olduğunu söylüyor. Folium $x^3 + y^3 = 6xy$ için bu numara bile çalışmaz: $y$ için çözmek, kullanışsız bir karmaşa üreten kübik formülü gerektirir. Kapalı denklemlerin çoğu için $y$'yi tek başına çekemeyiz.</p>

<div class="think-box"><div class="think-label">NEDEN ÖNEMSİYORUZ?</div><div class="think-body">Geometride ve fizikte en önemli eğrilerin çoğu doğal olarak kapalıdır. Gezegenlerin yörüngeleri (Kepler elipsleri) $9x^2 + 4y^2 = 36$ olarak yazılır, $y = \\text{bir şey}(x)$ olarak değil. Elektrostatikte eş potansiyel çizgileri, bir sıcaklık alanının seviye eğrileri, bir manyetik bölgenin sınırı — bunların hepsi kapalı denklemler olarak gelir. Kapalı türev, asla "$y$ için çözmek" zorunda kalmadan bu eğrilerde eğim hesaplamamıza izin verir.</div></div>

<h2 class="lesson-title">2. Kapalı Türevin Mantığı</h2>

<div class="calc-highlight"><strong>Tek anahtar fikir:</strong> $x^2 + y^2 = 25$ gibi bir denklemde, $y$'yi $x$'in bilinmeyen bir fonksiyonu olarak ele al — buna $y(x)$ de. Bu durumda $y$ içeren her ifade bir bileşik fonksiyon olur ve <em>zincir kuralı</em> ile türevini alırız. Her iki tarafa $\\dfrac{d}{dx}$ uyguladıktan sonra cebirsel olarak $\\dfrac{dy}{dx}$'i çözeriz.</div>

<p class="l-text">Bu fikri tek bir örnekte yavaşça izleyelim. $y^2 = $ $x$ cinsinden bir ifade ile başla. Her iki tarafın $x$'e göre türevini alırsak, $\\dfrac{d}{dx}(y^2)$ nedir? Sadece $2y$ değildir — eğer $y$'nin kendisine göre türev alsaydık öyle olurdu. $y$, $x$'in bir fonksiyonu olduğundan bir bileşik elde ederiz: dış fonksiyon kareleme, iç fonksiyon $y(x)$. Zincir kuralına göre:</p>

<div class="calc-formula"><div class="formula-label">y'NİN KUVVETİNE ZİNCİR KURALI</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(y^2\\bigr) = 2y \\cdot \\frac{dy}{dx}$$</div><div class="formula-sub">Daha genel olarak, $\\dfrac{d}{dx}\\bigl(y^n\\bigr) = n y^{n-1} \\cdot \\dfrac{dy}{dx}$. Ekstra $\\dfrac{dy}{dx}$ çarpanı zincir kuralının katkısıdır.</div></div>

<p class="l-text">Aynı mantık $y$'nin <em>her</em> fonksiyonu için geçerlidir. $x$'e göre türev:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\dfrac{d}{dx}(\\sin y)$</div><div class="card-body">$= \\cos y \\cdot \\dfrac{dy}{dx}$ — dış türev $\\cos$, iç türev $y'$.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{d}{dx}(e^y)$</div><div class="card-body">$= e^y \\cdot \\dfrac{dy}{dx}$ — dış türev $e^y$, iç türev $y'$.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{d}{dx}(\\ln y)$</div><div class="card-body">$= \\dfrac{1}{y} \\cdot \\dfrac{dy}{dx}$ — dış türev $1/y$, iç türev $y'$.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{d}{dx}(x \\cdot y)$</div><div class="card-body">$= y + x \\cdot \\dfrac{dy}{dx}$ — çarpım kuralı, ikinci çarpan $y'$ üretir.</div></div>
</div>

<p class="l-text"><strong>Mantra:</strong> "$y$ içeren bir terimin türevini alırken bir $\\dfrac{dy}{dx}$ çarpanı ekle." Saf $x$ terimleri normal türev alınır; saf $y$ terimleri ekstra bir $y'$ alır; karışık $xy$ terimleri çarpım kuralına ihtiyaç duyar.</p>

<div class="l-note"><strong>Notasyon hatırlatması.</strong> $\\dfrac{dy}{dx}$ ve $y'$ tamamen aynı şeyi ifade eder. İlki $y$'nin $x$'in fonksiyonu olduğunu vurgular; ikincisi daha kısadır. Hangisini daha açık buluyorsan onu kullan; serbestçe geç.</div>

<h2 class="lesson-title">3. 5-Adımlı Tarif</h2>

<div class="calc-highlight"><strong>Beş mekanik adımda kapalı türev.</strong> Bu tarifi ezberle ve düşünmeden uygula. Lise veya AYT düzeyinde göreceğin her kapalı denklem için işe yarar.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Her iki tarafa $d/dx$</div><div class="card-body">Denklemin her iki tarafındaki <em>her terime</em> $\\dfrac{d}{dx}$ operatörünü uygula. Eşitlik korunur çünkü iki eşit niceliğin türevleri eşittir.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Saf $x$ terimlerinin türevi</div><div class="card-body">Yalnızca $x$'e bağlı her şey olağan kuralları kullanır: $\\dfrac{d}{dx}(x^3) = 3x^2$, $\\dfrac{d}{dx}(\\sin x) = \\cos x$ vb. Sabitler kaybolur.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — $y$ terimlerine zincir kuralı</div><div class="card-body">$y$ içeren her şey zincir kuralı üretir: $\\dfrac{d}{dx}\\bigl(y^n\\bigr) = n y^{n-1} y'$, $\\dfrac{d}{dx}(\\sin y) = \\cos y \\cdot y'$ vb. Her zaman $y'$'yü ekle.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — $xy$ terimlerine çarpım kuralı</div><div class="card-body">$xy$, $x^2 y$, $x \\sin y$ gibi karışık terimler çarpım kuralı gerektirir. Bir çarpan $x$ türevini üretir; diğer çarpan ($y$ içeren) bir $y'$ üretir.</div></div>
<div class="calc-card"><div class="card-title">Adım 5 — $y'$ için çöz</div><div class="card-body">$y'$ içeren her terimi bir tarafta, diğer her terimi diğer tarafta topla, $y'$'yü çarpan olarak ayır ve böl. Cevap genellikle hem $x$'e hem de $y$'ye bağlıdır.</div></div>
</div>

<p class="l-text">Son nokta vurgulamaya değer. Açık türevde $y'$ yalnızca $x$'in bir fonksiyonudur. Kapalı türevde $y'$ genellikle hem $x$'in hem de $y$'nin bir fonksiyonudur — ve bu tamamen uygundur, çünkü belirli bir nokta $(x_0, y_0)$ eğri üzerindeyse oradaki eğimi değerlendirebiliriz.</p>

<h2 class="lesson-title">4. Örnek 1: Çember $x^2 + y^2 = 25$</h2>

<div class="calc-highlight"><strong>Orijin merkezli, yarıçapı 5 olan çember.</strong> Kapalı olarak $\\dfrac{dy}{dx}$'i bulacağız, cevabı geometrik olarak yorumlayacağız ve $(3, 4)$ noktasındaki teğet doğrusunun denklemini yazacağız.</div>

<p class="l-text">$x^2 + y^2 = 25$'in her iki tarafına $\\dfrac{d}{dx}$ operatörünü uygula.</p>

<div class="calc-formula"><div class="formula-label">ADIM 1 — d/dx UYGULA</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(x^2 + y^2\\bigr) = \\frac{d}{dx}(25)$$</div><div class="formula-sub">Sağ taraf bir sabittir, dolayısıyla türevi sıfırdır.</div></div>

<p class="l-text"><strong>Adım 2 — saf $x$ terimi:</strong> $\\dfrac{d}{dx}(x^2) = 2x$.</p>

<p class="l-text"><strong>Adım 3 — $y$ terimi:</strong> $\\dfrac{d}{dx}(y^2) = 2y \\cdot y'$ (zincir kuralı).</p>

<p class="l-text"><strong>Adım 5 — çöz.</strong> Bir araya getirince:</p>

<div class="calc-formula"><div class="formula-label">y' İÇİN ÇÖZÜM</div><div class="formula-main">$$2x + 2y\\, y' = 0 \\;\\Longrightarrow\\; y' = -\\frac{x}{y}$$</div><div class="formula-sub">Herhangi bir $(x, y)$ noktasındaki çember üzerindeki eğim $-x/y$'dir. Cevabın hem $x$'e hem de $y$'ye bağlı olduğuna dikkat et.</div></div>

<p class="l-text"><strong>Geometrik kontrol.</strong> Orijinden $(x, y)$ noktasına olan yarıçapın eğimi $y/x$'tir. Teğet doğrusu yarıçapa dik olmalıdır. İki doğru, eğimlerinin çarpımı $-1$ olduğunda diktir. Gerçekten de:</p>

<div class="calc-formula"><div class="formula-label">DİKLİK KONTROLÜ</div><div class="formula-main">$$\\text{yarıçapın eğimi} \\times \\text{teğetin eğimi} = \\frac{y}{x} \\times \\left(-\\frac{x}{y}\\right) = -1. \\;\\checkmark$$</div><div class="formula-sub">Kapalı türev "teğet yarıçapa diktir" klasik gerçeğini yeniden üretti.</div></div>

<div class="calc-graph"><div id="plot-l21-circle-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> mavi renkte $x^2 + y^2 = 25$ çemberi, $(3, 4)$ noktası işaretli, yarıçap noktalı çizgi olarak gösteriliyor ve $(3, 4)$'teki teğet doğrusu altın renkte çizilmiş. Teğet doğrusunun eğimi $y' = -3/4$'tür, tam olarak yarıçapa dik.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var theta=[];var cx=[];var cy=[];for(var i=0;i<=360;i++){theta.push(i*Math.PI/180);cx.push(5*Math.cos(i*Math.PI/180));cy.push(5*Math.sin(i*Math.PI/180));}
var circle={x:cx,y:cy,mode:'lines',name:'x² + y² = 25',line:{color:'#3b82f6',width:3}};
var radius={x:[0,3],y:[0,4],mode:'lines',name:'yarıçap',line:{color:'rgba(255,255,255,0.5)',width:1.5,dash:'dot'}};
var px=3;var py=4;var slope=-px/py;
var tx=[];var ty=[];for(var k=-6;k<=6;k++){var dx=k*0.5;tx.push(px+dx);ty.push(py+slope*dx);}
var tangent={x:tx,y:ty,mode:'lines',name:'(3,4)\\'te teğet',line:{color:'#f59e0b',width:2.5}};
var point={x:[px],y:[py],mode:'markers+text',name:'(3, 4)',marker:{color:'#ef4444',size:13},text:['(3, 4)'],textposition:'top right',textfont:{color:'#ef4444',size:13}};
var origin={x:[0],y:[0],mode:'markers',name:'O',marker:{color:'rgba(255,255,255,0.7)',size:6},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l21-circle-tr',[circle,radius,tangent,point,origin],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÖRNEK — TEĞET DOĞRUSU</div><div class="example-body"><strong>$x^2 + y^2 = 25$ çemberine $(3, 4)$ noktasında teğet doğrusunun denklemini bul.</strong><br><br>$y' = -x/y$ formülünden $(3, 4)$'te değerlendiriyoruz:<br>$y'(3,4) = -3/4$.<br><br>Eğim $-3/4$ ve nokta $(3, 4)$ ile nokta-eğim biçimi:<br>$y - 4 = -\\dfrac{3}{4}(x - 3)$<br>$y = -\\dfrac{3}{4}x + \\dfrac{9}{4} + 4 = -\\dfrac{3}{4}x + \\dfrac{25}{4}$.<br><br>Teğet doğrusu $4y + 3x = 25$ veya eşdeğer olarak $3x + 4y - 25 = 0$'dır. $\\blacksquare$</div></div>

<h2 class="lesson-title">5. Örnek 2: Descartes Folium'u $x^3 + y^3 = 6xy$</h2>

<div class="calc-highlight"><strong>Descartes folium'u</strong>, Descartes tarafından 1638'de incelenen klasik bir eğridir. Tek halkası birinci bölgede bulunur ve eğri kapalı türev için standart test alanlarından biridir çünkü denklem <em>her</em> durumu içerir: saf $x$, saf $y$ ve karışık çarpım $xy$.</div>

<p class="l-text">$x^3 + y^3 = 6xy$'nin her iki tarafına $\\dfrac{d}{dx}$ uygula:</p>

<p class="l-text"><strong>Sol taraf, terim terim:</strong></p>
<ul>
<li>$\\dfrac{d}{dx}(x^3) = 3x^2$ (saf $x$, standart kural)</li>
<li>$\\dfrac{d}{dx}(y^3) = 3y^2 \\cdot y'$ (zincir kuralı)</li>
</ul>

<p class="l-text"><strong>Sağ taraf, çarpım kuralı:</strong> $\\dfrac{d}{dx}(6xy) = 6 \\cdot \\bigl(y + x \\cdot y'\\bigr) = 6y + 6x \\, y'$.</p>

<div class="calc-formula"><div class="formula-label">TÜREV ALINDIKTAN SONRA</div><div class="formula-main">$$3x^2 + 3y^2 \\, y' = 6y + 6x \\, y'$$</div><div class="formula-sub">Şimdi $y'$ terimlerini bir tarafa, geri kalan her şeyi diğerine topla.</div></div>

<p class="l-text"><strong>Adım 5 — $y'$ için çöz:</strong></p>

<div class="calc-formula"><div class="formula-label">ÇÖZ</div><div class="formula-main">$$3y^2 \\, y' - 6x \\, y' = 6y - 3x^2 \\;\\Longrightarrow\\; y' = \\frac{6y - 3x^2}{3y^2 - 6x} = \\frac{2y - x^2}{y^2 - 2x}$$</div><div class="formula-sub">Folium üzerindeki herhangi bir $(x, y)$ noktasındaki eğim.</div></div>

<div class="calc-graph"><div id="plot-l21-folium-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Descartes folium'u $x^3 + y^3 = 6xy$. Eğrinin birinci bölgede bir halkası vardır, orijinden geçer (öz-kesişimi vardır) ve üçüncü bölgede $y = -x - 2$ köşegeni asimptot olarak vardır. $(3, 3)$ noktası işaretli — simetri gereği oradaki teğetin eğimi $-1$ olarak dengededir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var tvals=[];var fx=[];var fy=[];for(var i=-300;i<=300;i++){var t=i/100;if(Math.abs(t+1)<0.001)continue;var denom=1+t*t*t;var x=6*t/denom;var y=6*t*t/denom;if(isFinite(x)&&isFinite(y)&&Math.abs(x)<8&&Math.abs(y)<8){fx.push(x);fy.push(y);}}
var folium={x:fx,y:fy,mode:'markers',name:'x³ + y³ = 6xy',marker:{color:'#3b82f6',size:3}};
var asy=[];var ay=[];for(var k=-80;k<=20;k++){var xa=k/10;asy.push(xa);ay.push(-xa-2);}
var asymptote={x:asy,y:ay,mode:'lines',name:'asimptot y = -x - 2',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dash'}};
var pt={x:[3],y:[3],mode:'markers+text',name:'(3, 3)',marker:{color:'#ef4444',size:11},text:['(3, 3)'],textposition:'top right',textfont:{color:'#ef4444',size:12}};
var px2=3;var py2=3;var slope2=(2*py2-px2*px2)/(py2*py2-2*px2);
var tx2=[];var ty2=[];for(var m=-12;m<=12;m++){var dx2=m*0.25;tx2.push(px2+dx2);ty2.push(py2+slope2*dx2);}
var tan2={x:tx2,y:ty2,mode:'lines',name:'(3,3)\\'te teğet',line:{color:'#f59e0b',width:2}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-5,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l21-folium-tr',[folium,asymptote,tan2,pt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">(3, 3)'TEKİ EĞİM</div><div class="example-body">$x = 3, y = 3$'i formüle koy:<br><br>$y'(3, 3) = \\dfrac{2 \\cdot 3 - 3^2}{3^2 - 2 \\cdot 3} = \\dfrac{6 - 9}{9 - 6} = \\dfrac{-3}{3} = -1$.<br><br>Orijinal denklemin $x \\leftrightarrow y$ simetrisi gereği ($x$ ve $y$'yi değiştirmek $x^3 + y^3 = 6xy$'yi değiştirmez), eğri $y = x$ doğrusu etrafında simetriktir. $(3, 3)$ noktası bu simetri doğrusu üzerinde olduğundan, oradaki teğetin eğiminin $-1$ ($y = x$'e dik) olması mantıklıdır. $\\blacksquare$</div></div>

<h2 class="lesson-title">6. Örnek 3: $x \\cdot y + \\sin y = 5$</h2>

<div class="calc-highlight"><strong>Bu denklem kapalı biçimde $y$ için çözülemez.</strong> $y$'yi $x$'in bir fonksiyonu olarak yalıtan hiçbir formül yoktur — yine de kapalı türev hiçbir zorluk çekmeden bunu halleder. Bu, tekniğin ana güçlerinden biridir: diğer her şeyin başarısız olduğu denklemlerde çalışır.</div>

<p class="l-text">$xy + \\sin y = 5$'in her iki tarafına $\\dfrac{d}{dx}$ uygula:</p>

<p class="l-text"><strong>1. terim (çarpım):</strong> $\\dfrac{d}{dx}(xy) = y + x \\, y'$ (çarpım kuralı).</p>

<p class="l-text"><strong>2. terim ($y$'nin fonksiyonu):</strong> $\\dfrac{d}{dx}(\\sin y) = \\cos y \\cdot y'$ (zincir kuralı).</p>

<p class="l-text"><strong>Sağ taraf:</strong> $\\dfrac{d}{dx}(5) = 0$.</p>

<div class="calc-formula"><div class="formula-label">TÜREV ALINDIKTAN SONRA</div><div class="formula-main">$$y + x \\, y' + \\cos y \\cdot y' = 0$$</div><div class="formula-sub">Şimdi $y'$ terimlerini topla ve çöz.</div></div>

<div class="calc-formula"><div class="formula-label">ÇÖZÜM</div><div class="formula-main">$$y' \\, (x + \\cos y) = -y \\;\\Longrightarrow\\; y' = -\\frac{y}{x + \\cos y}$$</div><div class="formula-sub">Formül, orijinal denklemi sağlayan herhangi bir $(x, y)$ noktasındaki eğimi verir.</div></div>

<p class="l-text"><strong>Özel durum.</strong> Orijinal denklemin $y = \\pi$ ile sağlandığı bir noktada eğim $y' = -\\pi / (x + \\cos\\pi) = -\\pi / (x - 1)$'dir. $y(x)$ için açık bir formülümüz yok ama eğri üzerinde her yerde eğim hesaplayabiliriz.</p>

<div class="l-note"><strong>Payda sıfır olursa ne olur?</strong> Eğri üzerinde bir noktada $x + \\cos y = 0$ olduğunda, $y'$ formülü patlar — teğet doğrusu <em>dikey</em> olur. Dikey teğet eğrinin bir başarısızlığı değildir; gerçek bir geometrik özelliktir (örneğin birim çemberin $(\\pm 5, 0)$'da dikey teğetleri vardır). Kapalı türev bu yerleri otomatik olarak tespit eder.</div>

<h2 class="lesson-title">7. Logaritmik Türeve Ne Zaman Başvurmalı</h2>

<div class="calc-highlight"><strong>Logaritmik türev, kapalı türevin uzmanlaşmış kuzenidir.</strong> Bir $F(x, y) = 0$ denklemi üzerinde çalışmak yerine, tamamen açık bir $y = f(x)$'ten başlarız, her iki tarafın $\\ln$'ini alırız, sonra kapalı türev alırız. Bu bazen büyük ölçüde daha kolay olmasının nedeni logaritmaların cebiridir: $\\ln$ çarpımları toplamlara, bölümleri farklara ve kuvvetleri çarpmalara dönüştürür.</div>

<p class="l-text">11. derstten beri kullandığın üç logaritma özdeşliğini hatırla:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\ln$ için çarpım kuralı</div><div class="card-body">$\\ln(a \\cdot b) = \\ln a + \\ln b$. Karmaşık bir çarpım, daha basit terimlerin toplamı olur — ve bir toplamın türevi, türevlerin toplamıdır.</div></div>
<div class="calc-card"><div class="card-title">$\\ln$ için bölüm kuralı</div><div class="card-body">$\\ln(a / b) = \\ln a - \\ln b$. Bir bölümün türevini bölüm kuralıyla almak dağınıktır; bir farkın türevini almak önemsizdir.</div></div>
<div class="calc-card"><div class="card-title">$\\ln$ için kuvvet kuralı</div><div class="card-body">$\\ln(a^k) = k \\ln a$. Bu, üssü çarpan olarak aşağı çeker — değişkenin üste göründüğü $x^x$ gibi fonksiyonlar için hayatidir.</div></div>
</div>

<p class="l-text"><strong>Logaritmik türev kullanmak için üç sinyal.</strong></p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SİNYAL 1 — Üste değişken</div><div class="compare-item">$y = x^x$, $y = x^{\\sin x}$, $y = (\\sin x)^x$</div><div class="compare-item">Kuvvet kuralı uygulanmaz (üs sabit değil)</div><div class="compare-item">Üstel kural uygulanmaz (taban sabit değil)</div><div class="compare-item">Logaritmik türev, işe yarayan <em>tek</em> standart tekniktir</div></div><div class="compare-col"><div class="compare-title">SİNYAL 2 — Çok sayıda çarpan</div><div class="compare-item">$y = (x+1)^3 (x-2)^4 (x+5)^7$</div><div class="compare-item">Doğrudan çarpım kuralı birçok uygulama gerektirir</div><div class="compare-item">$\\ln$ almak toplama dönüştürür: $\\ln y = 3\\ln(x+1) + 4\\ln(x-2) + 7\\ln(x+5)$</div><div class="compare-item">Sonra terim terim türev al</div></div></div>

<div class="calc-highlight"><strong>SİNYAL 3 — Çarpımların karmaşık bölümü.</strong> $y = \\dfrac{f_1(x)^{a_1} f_2(x)^{a_2}}{g_1(x)^{b_1} g_2(x)^{b_2}}$ benzeri her şey. Doğrudan bölüm + çarpım kuralları bir kabus olurdu. $\\ln$ her şeyi bir toplam ve farka dönüştürür.</div>

<h2 class="lesson-title">8. Logaritmik Türev Tarifi</h2>

<div class="calc-highlight"><strong>Yukarıdaki durumların herhangi birini rutin bir hesaplamaya dönüştüren dört adım.</strong></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Her iki tarafa $\\ln$ al</div><div class="card-body">$y = f(x)$'ten başlayarak $\\ln y = \\ln f(x)$ yaz. Her zaman $y > 0$ olduğu yerde çalıştığımızı varsayıyoruz; $y$ negatif olabilirse $\\ln|y|$ alırız.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — $\\ln$ özdeşlikleriyle sadeleştir</div><div class="card-body">Sağ tarafı mümkün olan en basit parçalara ayırmak için $\\ln(ab) = \\ln a + \\ln b$, $\\ln(a/b) = \\ln a - \\ln b$, $\\ln(a^k) = k \\ln a$ kullan.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — Her iki tarafın türevini al</div><div class="card-body">Sol taraf: $\\dfrac{d}{dx}(\\ln y) = \\dfrac{1}{y} \\cdot y'$ (zincir kuralı — kapalı adım budur). Sağ taraf: her parçanın doğrudan türevini al.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — $y'$ için çöz ve yerine koy</div><div class="card-body">$y'$'yü yalıtmak için her iki tarafı $y$ ile çarp. Sonra cevabı saf $x$ cinsinden yazmak için $y$'nin orijinal ifadesini yerine koy.</div></div>
</div>

<p class="l-text">Teknik bundan ibarettir. İki örnek bunu somutlaştıracaktır.</p>

<h2 class="lesson-title">9. Örnek: $y = x^x$</h2>

<div class="calc-highlight"><strong>$y = x^x$ fonksiyonu</strong>, herhangi bir polinomdan ve herhangi bir sıradan üstelden daha hızlı büyür. $x > 0$ için tanımlıdır (ve $0^0 = 1$ kuralıyla $x = 0$'da). Türevi ne kuvvet kuralıyla (üs sabit olmadığı için) ne de standart üstel kuralla (taban sabit olmadığı için) elde edilebilir. Logaritmik türev bunu temiz halleder.</div>

<p class="l-text"><strong>Adım 1 — $\\ln$ al:</strong> $\\ln y = \\ln(x^x)$.</p>

<p class="l-text"><strong>Adım 2 — sadeleştir:</strong> $\\ln$ için kuvvet kuralıyla $\\ln(x^x) = x \\ln x$. Yani $\\ln y = x \\ln x$.</p>

<p class="l-text"><strong>Adım 3 — türev al.</strong> Sol taraf: $\\dfrac{1}{y} \\cdot y'$. Sağ taraf: $x \\ln x$ üzerinde çarpım kuralı, $1 \\cdot \\ln x + x \\cdot \\dfrac{1}{x} = \\ln x + 1$ verir.</p>

<div class="calc-formula"><div class="formula-label">TÜREVİ ALINMIŞ DENKLEM</div><div class="formula-main">$$\\frac{y'}{y} = \\ln x + 1$$</div><div class="formula-sub">Şimdi her iki tarafı $y$ ile çarp ve $y = x^x$'i yerine koy.</div></div>

<div class="calc-formula"><div class="formula-label">SON CEVAP</div><div class="formula-main">$$\\frac{d}{dx}\\bigl(x^x\\bigr) = x^x \\, (\\ln x + 1)$$</div><div class="formula-sub">Lise düzeyindeki daha egzotik fonksiyonlardan biri için temiz bir kapalı biçim türev.</div></div>

<div class="calc-graph"><div id="plot-l21-xpowerx-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> mavi renkte $y = x^x$ ve altın renkte türevi $y' = x^x(\\ln x + 1)$, $0.1 \\leq x \\leq 3$ için çizilmiş. Fonksiyonun $x = 1/e \\approx 0.368$'de minimumu vardır; türev orada sıfırı keser (çünkü $\\ln(1/e) + 1 = -1 + 1 = 0$). Bu noktadan sonra hem fonksiyon hem türev patlayarak büyür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];var dys=[];for(var i=10;i<=300;i++){var x=i/100;xs.push(x);ys.push(Math.pow(x,x));dys.push(Math.pow(x,x)*(Math.log(x)+1));}
var fn={x:xs,y:ys,mode:'lines',name:'y = x^x',line:{color:'#3b82f6',width:3}};
var dfn={x:xs,y:dys,mode:'lines',name:"y' = x^x (ln x + 1)",line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var mn={x:[1/Math.E],y:[Math.pow(1/Math.E,1/Math.E)],mode:'markers+text',name:'x = 1/e\\'de min',marker:{color:'#ef4444',size:11,symbol:'star'},text:['min'],textposition:'bottom right',textfont:{color:'#ef4444',size:12}};
var zero={x:[0,3.1],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[0,3.1],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-2,15],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l21-xpowerx-tr',[fn,dfn,zero,mn],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">MİNİMUM NEDEN 1/e'DE</div><div class="think-body">Türev $\\ln x + 1 = 0$ olduğunda sıfırdır, yani $\\ln x = -1$, yani $x = e^{-1} = 1/e \\approx 0.368$. O noktada $y = (1/e)^{1/e} \\approx 0.692$. Bu, $(0, \\infty)$ üzerinde $y = x^x$'in global minimumudur. Küçük ama çarpıcı bir gerçek: $x^x$ ilk bakışta basit bir üstel gibi görünse de monoton değildir.</div></div>

<h2 class="lesson-title">10. Örnek: Karmaşık Bir Bölüm</h2>

<div class="calc-highlight"><strong>İfade</strong> $y = \\dfrac{(x^2 + 1)^3 \\sqrt{x - 1}}{(x + 4)^5}$, doğrudan türev almak için bir kabus olurdu. Dışta bölüm kuralı, payın içinde çarpım kuralı, her çarpana kuvvet kuralı, karekökte zincir kuralı. Logaritmik türev bunu dört satıra indirir.</div>

<p class="l-text"><strong>Adım 1 — $\\ln$ al:</strong></p>

<div class="calc-formula"><div class="formula-label">HER İKİ TARAFIN $\\ln$'İ</div><div class="formula-main">$$\\ln y = \\ln\\!\\left(\\frac{(x^2 + 1)^3 (x - 1)^{1/2}}{(x + 4)^5}\\right)$$</div><div class="formula-sub">$\\sqrt{x - 1} = (x - 1)^{1/2}$ olduğunu unutma.</div></div>

<p class="l-text"><strong>Adım 2 — $\\ln$ özdeşlikleriyle sadeleştir.</strong> Bölüm farka, çarpım toplama olur, kuvvetler aşağı iner:</p>

<div class="calc-formula"><div class="formula-label">SADELEŞTİRİLMİŞ LOG BİÇİMİ</div><div class="formula-main">$$\\ln y = 3 \\ln(x^2 + 1) + \\tfrac{1}{2} \\ln(x - 1) - 5 \\ln(x + 4)$$</div><div class="formula-sub">Her biri kolay türevlenebilen üç basit terimin toplamı.</div></div>

<p class="l-text"><strong>Adım 3 — türev al.</strong> Sol taraf: $\\dfrac{1}{y} \\cdot y'$. Sağdaki her $\\ln$ teriminin türevi $\\dfrac{1}{\\text{argüman}} \\cdot (\\text{argüman})'$:</p>

<div class="calc-formula"><div class="formula-label">TÜREVİ ALINMIŞ DENKLEM</div><div class="formula-main">$$\\frac{y'}{y} = 3 \\cdot \\frac{2x}{x^2 + 1} + \\frac{1}{2} \\cdot \\frac{1}{x - 1} - 5 \\cdot \\frac{1}{x + 4} = \\frac{6x}{x^2 + 1} + \\frac{1}{2(x - 1)} - \\frac{5}{x + 4}$$</div><div class="formula-sub">Zincir kuralı travması yok. İç içe kesirler yok. Sadece üç temiz parça.</div></div>

<p class="l-text"><strong>Adım 4 — $y'$ için çöz:</strong></p>

<div class="calc-formula"><div class="formula-label">SON CEVAP</div><div class="formula-main">$$y' = \\frac{(x^2 + 1)^3 \\sqrt{x - 1}}{(x + 4)^5} \\left[\\frac{6x}{x^2 + 1} + \\frac{1}{2(x - 1)} - \\frac{5}{x + 4}\\right]$$</div><div class="formula-sub">Parantez içindeki toplam "logaritmik türev" $y' / y$'dir.</div></div>

<div class="l-note"><strong>Çabayı karşılaştır.</strong> Orijinal üzerinde doğrudan bölüm kuralı, karşılaştırılabilir bir biçime ulaşmak için en az 6–8 satır cebir gerektirirdi. Logaritmik türev oraya 4 satırda ulaşır, her adımda yalnızca bir özdeşlik kullanarak.</div>

<h2 class="lesson-title">11. AYT/YKS Alıştırmaları</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 — ELİPSE TEĞET</div><div class="example-body"><strong>$9x^2 + 4y^2 = 36$</strong> elipsi için kapalı olarak $\\dfrac{dy}{dx}$'i bul ve $(0, 3)$'teki teğet doğrusunu yaz.<br><br><em>Çözüm.</em> Türev al: $18x + 8y \\, y' = 0$, yani $y' = -\\dfrac{9x}{4y}$.<br>$(0, 3)$'te: $y' = 0$. Teğet yataydır: $y = 3$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — VERİLEN EĞİMLİ NOKTA</div><div class="example-body"><strong>$x^2 + y^2 = 100$</strong> çemberi üzerinde teğetin eğiminin $1$ olduğu tüm noktaları bul.<br><br><em>Çözüm.</em> $y' = -x/y = 1 \\implies x = -y$. $x^2 + y^2 = 100$'e yerine koy: $2y^2 = 100 \\implies y = \\pm\\sqrt{50} = \\pm 5\\sqrt{2}$.<br>Noktalar $(-5\\sqrt{2}, 5\\sqrt{2})$ ve $(5\\sqrt{2}, -5\\sqrt{2})$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — TRİG İÇEREN KAPALI</div><div class="example-body"><strong>$\\sin(xy) = x + y$</strong> ise $y'$ bul.<br><br><em>Çözüm.</em> $\\dfrac{d}{dx}$ uygula: $\\cos(xy) \\cdot (y + x y') = 1 + y'$. Aç: $y \\cos(xy) + x \\cos(xy) \\, y' = 1 + y'$. Topla: $y'\\,[x \\cos(xy) - 1] = 1 - y \\cos(xy)$.<br>Yani $y' = \\dfrac{1 - y \\cos(xy)}{x \\cos(xy) - 1}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — KAPALI POLİNOM</div><div class="example-body">$x^2 y + xy^2 = 6$ için <strong>$(1, 2)$ noktasında $y'$ bul.</strong><br><br><em>Çözüm.</em> Terim terim türev al. $\\dfrac{d}{dx}(x^2 y) = 2xy + x^2 y'$. $\\dfrac{d}{dx}(xy^2) = y^2 + 2xy \\, y'$. Yani $2xy + x^2 y' + y^2 + 2xy \\, y' = 0$.<br>Topla: $y'(x^2 + 2xy) = -2xy - y^2$, dolayısıyla $y' = -\\dfrac{2xy + y^2}{x^2 + 2xy} = -\\dfrac{y(2x + y)}{x(x + 2y)}$.<br>$(1, 2)$'de: $y' = -\\dfrac{2 \\cdot (2 + 2)}{1 \\cdot (1 + 4)} = -\\dfrac{8}{5}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — LOG TÜREV, BÜYÜK ÇARPIM</div><div class="example-body">Logaritmik türev kullanarak <strong>$y = (x - 1)^2 (x + 2)^3 (x + 5)^4$</strong>'ün türevini al.<br><br><em>Çözüm.</em> $\\ln$ al: $\\ln y = 2\\ln(x - 1) + 3\\ln(x + 2) + 4\\ln(x + 5)$. Türev al: $\\dfrac{y'}{y} = \\dfrac{2}{x - 1} + \\dfrac{3}{x + 2} + \\dfrac{4}{x + 5}$.<br>Yani $y' = (x - 1)^2 (x + 2)^3 (x + 5)^4 \\left[\\dfrac{2}{x - 1} + \\dfrac{3}{x + 2} + \\dfrac{4}{x + 5}\\right]$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — LOG TÜREV, ÜSTE DEĞİŞKEN</div><div class="example-body">$0 < x < \\pi$ için <strong>$\\dfrac{d}{dx}\\bigl((\\sin x)^x\\bigr)$</strong> bul.<br><br><em>Çözüm.</em> $y = (\\sin x)^x$ olsun. $\\ln$ al: $\\ln y = x \\ln(\\sin x)$. Sağda çarpım kuralı ile türev al: $\\dfrac{y'}{y} = \\ln(\\sin x) + x \\cdot \\dfrac{\\cos x}{\\sin x} = \\ln(\\sin x) + x \\cot x$.<br>Yani $y' = (\\sin x)^x \\, [\\ln(\\sin x) + x \\cot x]$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — ASTROİDE TEĞET</div><div class="example-body"><strong>Astroid</strong>, $x^{2/3} + y^{2/3} = 4$ eğrisidir. $y'$ bul ve $(1, 3\\sqrt{3})$ noktasında değerlendir.<br><br><em>Çözüm.</em> Türev al: $\\dfrac{2}{3} x^{-1/3} + \\dfrac{2}{3} y^{-1/3} y' = 0$, yani $y' = -\\dfrac{x^{-1/3}}{y^{-1/3}} = -\\left(\\dfrac{y}{x}\\right)^{1/3}$.<br>$(1, 3\\sqrt{3})$'te: $y/x = 3\\sqrt{3} = 3^{3/2}$, küp kökü $3^{1/2} = \\sqrt{3}$ verir. Yani $y' = -\\sqrt{3}$. $\\blacksquare$</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — KARIŞIK: $y = x^{\\ln x}$</div><div class="example-body">$x > 0$ için <strong>$y = x^{\\ln x}$</strong> ise $y'$ bul.<br><br><em>Çözüm.</em> $\\ln$ al: $\\ln y = \\ln x \\cdot \\ln x = (\\ln x)^2$. Türev al: $\\dfrac{y'}{y} = 2 \\ln x \\cdot \\dfrac{1}{x} = \\dfrac{2 \\ln x}{x}$.<br>Yani $y' = x^{\\ln x} \\cdot \\dfrac{2 \\ln x}{x}$, bu $2 \\ln x \\cdot x^{\\ln x - 1}$ olarak da yazılabilir. $\\blacksquare$</div></div>

<h2 class="lesson-title">12. Görsel Özet: $(3, 4)$'te Çember Teğeti ve Yöntem Karşılaştırması</h2>

<div class="calc-highlight"><strong>Çembere bir kez daha bakalım.</strong> Aşağıdaki geometri $y' = -x/y = -3/4$ formülünü açık eder: $(3, 4)$ noktasında yarıçap her 3 birim yatay harekete karşı 4 birim yükselir (eğim $+4/3$), dolayısıyla dik teğet her 4 birime karşı 3 birim inmelidir (eğim $-3/4$). Kapalı türev, bu dikliğe dayanan argümanı sadece otomatikleştirir.</div>

<div class="calc-graph"><div id="plot-l21-circle-tr-extra" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafikte ne var:</strong> $x^2 + y^2 = 25$ çemberi, başlangıçtan $(3, 4)$'e çizilen yarıçap kesik beyaz çizgiyle (eğim $+4/3$), $(3, 4)$'teki teğet doğrusu da altın renkle (eğim $-3/4$) gösterilmiştir. Bu eğimlerin çarpımı $-1$'dir; bu da dikliği doğrular. Kapalı türev formülü $\\dfrac{dy}{dx} = -\\dfrac{x}{y}$ bu geometrik gerçeği çemberin her noktası için kodlar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var cx=[];var cy=[];for(var i=0;i<=360;i++){cx.push(5*Math.cos(i*Math.PI/180));cy.push(5*Math.sin(i*Math.PI/180));}
var circ={x:cx,y:cy,mode:'lines',name:'x² + y² = 25',line:{color:'#3b82f6',width:3}};
var rad={x:[0,3],y:[0,4],mode:'lines',name:'yarıçap (eğim +4/3)',line:{color:'rgba(255,255,255,0.55)',width:1.8,dash:'dash'}};
var px=3;var py=4;var slope=-px/py;
var tx=[];var ty=[];for(var k=-6;k<=6;k++){var dx=k*0.6;tx.push(px+dx);ty.push(py+slope*dx);}
var tan={x:tx,y:ty,mode:'lines',name:'teğet (eğim -3/4)',line:{color:'#f59e0b',width:2.5}};
var pt={x:[px],y:[py],mode:'markers+text',name:'(3, 4)',marker:{color:'#ef4444',size:13},text:['(3, 4)'],textposition:'top right',textfont:{color:'#ef4444',size:13}};
var orig={x:[0],y:[0],mode:'markers+text',name:'başlangıç',marker:{color:'rgba(255,255,255,0.75)',size:7},text:['O'],textposition:'bottom left',textfont:{color:'rgba(255,255,255,0.8)',size:12},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-7,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l21-circle-tr-extra',[circ,rad,tan,pt,orig],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Yöntem karşılaştırması.</strong> Tanımadığın bir türevle karşılaştığında hangi tekniği kullanmalısın? Aşağıdaki tablo her yaygın durumu doğru araçla eşleştirir ve temsili bir örnek gösterir.</div>

<div style="overflow-x:auto;margin:1.4rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.9rem;background:rgba(15,15,15,0.6);border:1px solid rgba(59,130,246,0.25)">
<thead>
<tr style="background:rgba(59,130,246,0.12)">
<th style="padding:0.7rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.35);color:#3b82f6;font-weight:700">Ne zaman kullanılır</th>
<th style="padding:0.7rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.35);color:#3b82f6;font-weight:700">Örnek fonksiyon</th>
<th style="padding:0.7rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.35);color:#3b82f6;font-weight:700">Teknik</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y$ yalıtılmış, basit cebirsel biçim</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = x^3 + 2x - 1$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Kuvvet kuralı (doğrudan)</td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Bileşke (fonksiyon içinde fonksiyon)</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = \\sin(3x^2 + 1)$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Zincir kuralı</td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$x$ ve $y$ karışık, $y$ yalıtılamıyor</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$x^2 + y^2 = 25$, $xy + \\sin y = 5$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)"><strong style="color:#3b82f6">Kapalı türev</strong></td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Çok sayıda çarpan</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = (x+1)^3 (x-2)^4 (x+5)^7$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)"><strong style="color:#3b82f6">Logaritmik türev</strong></td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Hem taban hem üst değişken</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = x^x$, $y = (\\sin x)^x$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)"><strong style="color:#3b82f6">Logaritmik türev</strong> (tek seçenek)</td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">Çarpımların karmaşık bölümü</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)">$y = \\dfrac{(x^2+1)^3 \\sqrt{x-1}}{(x+4)^5}$</td>
<td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(235,230,220,0.92)"><strong style="color:#3b82f6">Logaritmik türev</strong></td>
</tr>
<tr>
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)">Sabit taban, değişken üst</td>
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)">$y = 2^{3x+1}$, $y = e^{x^2}$</td>
<td style="padding:0.6rem 0.9rem;color:rgba(235,230,220,0.92)">Üstel kuralı + zincir</td>
</tr>
</tbody>
</table>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><strong>Açık ve kapalı:</strong> $y = f(x)$ $y$'yi yalıtır; $F(x, y) = 0$ yalıtmaz — yine de bir eğri tanımlar</li>
<li><strong>Tek anahtar kural:</strong> $y$ içeren bir terimin türevini alırken bir $\\dfrac{dy}{dx}$ çarpanı ekle (zincir kuralı)</li>
<li><strong>5-adımlı tarif:</strong> her iki tarafa $d/dx$, saf $x$ terimleri, $y$ terimlerine zincir, $xy$'ye çarpım kuralı, $y'$ için çöz</li>
<li>Eğimler genellikle hem $x$'e hem $y$'ye bağlıdır — değerlendirmek için noktayı yerine koy</li>
<li><strong>Çember $x^2 + y^2 = r^2$:</strong> $y' = -x/y$, yarıçap-teğet dikliğini yeniden üretir</li>
<li><strong>Logaritmik türev</strong> = $\\ln$ al, özdeşliklerle sadeleştir, kapalı türev al, $y'$ için çöz</li>
<li>Kullanmak için üç sinyal: üste değişken, büyük çarpım, çarpımların karmaşık bölümü</li>
<li><strong>$\\dfrac{d}{dx}(x^x) = x^x (\\ln x + 1)$</strong> — $x = 1/e$'de minimum</li>
<li>Sonraki ders: herhangi bir eğri üzerinde teğet ve normal doğruları bulmak için türev uygulamaları</li>
</ul>
</div>`

};
