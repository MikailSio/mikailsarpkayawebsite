window.COMPLEX_L4 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>This is where complex analysis stops being a curiosity and becomes a calculation engine.</strong> In L3 we set up the differential side of the theory — the Cauchy-Riemann equations and the rigidity of holomorphic functions. In this lesson we set up the <em>integral</em> side, and the marriage of the two produces consequences so unreasonable that no analogue exists in real analysis. A holomorphic function turns out to be uniquely determined by its values on a closed boundary; its derivatives of every order can be read off the same boundary; and every closed-loop integral of such a function is zero — unless the loop encloses a singularity, in which case the result is dictated by what is happening inside.</p>

<p class="l-text">The plan: define contour integrals carefully, prove the path-dependence on the canonical example $1/z$, state Cauchy's theorem and sketch the Green-theorem proof, introduce contour deformation, climb to the Cauchy integral formula and its derivative generalisation, finish with the maximum modulus principle. Along the way we will compute several integrals by hand and check them in Pyodide. By the end you will own the integral half of the engine that makes L5 (Laurent series and residues) possible.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define and compute contour integrals along piecewise-smooth oriented curves</li>
<li>Demonstrate path dependence with the canonical example $1/z$ and explain it geometrically</li>
<li>State Cauchy's theorem and outline its proof via Green's theorem</li>
<li>Apply contour deformation to evaluate awkward integrals by replacing the path with a simpler homotopic one</li>
<li>Use the Cauchy integral formula to recover interior values of a holomorphic function from boundary data</li>
<li>Derive the generalised formula for derivatives and read off $f^{(n)}(z_0)$ from a single boundary integral</li>
<li>Explain the maximum modulus principle and use it as a uniqueness lever</li>
<li>Connect the integral theorems to fluid flow, electrostatics, and the 2-D Laplace equation</li>
</ul>
</div>

<h2 class="lesson-title">1. Contour Integrals — Definition</h2>

<div class="calc-highlight"><strong>A contour integral is a path-aware version of the real integral.</strong> The integrand is a complex function; the variable of integration is a complex number tracing out a curve. Because the curve lives in two real dimensions and not one, "the path" suddenly carries information that a real definite integral simply has no way to express. Everything in this lesson grows from that one structural difference.</div>

<p class="l-text">A <strong>contour</strong> $\\gamma$ is a piecewise-smooth oriented curve in $\\mathbb{C}$, given by a continuous function $\\gamma : [a, b] \\to \\mathbb{C}$ that is differentiable except at finitely many corners. The orientation is part of the data — reversing the direction reverses the sign of every integral we are about to define.</p>

<div class="calc-formula"><div class="formula-label">CONTOUR INTEGRAL</div><div class="formula-main">$$\\int_\\gamma f(z)\\, dz \\;=\\; \\int_a^b f(\\gamma(t))\\, \\gamma'(t)\\, dt$$</div><div class="formula-sub">The right-hand side is an ordinary one-variable integral with a complex integrand; it always makes sense and reduces to two real integrals (real and imaginary part).</div></div>

<p class="l-text">In coordinates: write $f(z) = u(x, y) + i\\, v(x, y)$ and $dz = dx + i\\, dy$. Multiplying out gives the equivalent real form</p>

<div class="calc-formula"><div class="formula-label">REAL-FORM DECOMPOSITION</div><div class="formula-main">$$\\int_\\gamma f(z)\\, dz \\;=\\; \\int_\\gamma (u\\, dx - v\\, dy) \\;+\\; i \\int_\\gamma (v\\, dx + u\\, dy)$$</div><div class="formula-sub">Two real line integrals glued together. This form is what Green's theorem will eat in section 4.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\gamma : [a, b] \\to \\mathbb{C}$</div><div class="card-body">A parameterised oriented curve. The same geometric picture supports many parameterisations; the integral is invariant under orientation-preserving reparameterisation.</div></div>
<div class="calc-card"><div class="card-title">$\\gamma'(t)$</div><div class="card-body">The complex velocity along the curve. Its modulus is the speed, its argument the local heading. Reversing $\\gamma$ negates $\\gamma'$ and hence negates the integral.</div></div>
<div class="calc-card"><div class="card-title">Closed contour</div><div class="card-body">A contour with $\\gamma(a) = \\gamma(b)$. The integral over a closed contour is written $\\oint_\\gamma f\\, dz$ and is the central object of this lesson.</div></div>
<div class="calc-card"><div class="card-title">Simple contour</div><div class="card-body">A contour that does not cross itself (except possibly at the endpoints for a closed contour). The Jordan curve theorem then partitions the plane into an interior and an exterior.</div></div>
</div>

<div class="l-note"><strong>Standard parameterisations to memorise.</strong> The unit circle traversed counter-clockwise: $\\gamma(t) = e^{i t}$, $t \\in [0, 2\\pi]$, $\\gamma'(t) = i e^{i t}$. A line segment from $z_1$ to $z_2$: $\\gamma(t) = z_1 + t(z_2 - z_1)$, $t \\in [0, 1]$, $\\gamma'(t) = z_2 - z_1$. A circle of radius $r$ centred at $z_0$ counter-clockwise: $\\gamma(t) = z_0 + r e^{i t}$, $t \\in [0, 2\\pi]$, $\\gamma'(t) = i r e^{i t}$.</div>

<h2 class="lesson-title">2. First Worked Examples</h2>

<p class="l-text">Two short calculations to put the machinery to work before the path-dependence example bites.</p>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — $\\int_\\gamma z\\, dz$ over the segment from $0$ to $1 + i$</div><div class="example-body">Parameterise $\\gamma(t) = t(1 + i)$ with $t \\in [0, 1]$, so $\\gamma'(t) = 1 + i$.<br><br>$\\displaystyle \\int_\\gamma z\\, dz = \\int_0^1 t(1+i) \\cdot (1+i)\\, dt = (1+i)^2 \\int_0^1 t\\, dt = (1+i)^2 \\cdot \\tfrac{1}{2} = \\tfrac{1}{2}(2i) = i.$<br><br>Check against the would-be antiderivative $z^2/2$ evaluated at the endpoints: $\\frac{(1+i)^2}{2} - 0 = \\frac{2i}{2} = i$. Same answer. This is no coincidence — section 3 will show that whenever the integrand has a holomorphic antiderivative, the integral collapses to the fundamental-theorem form.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — $\\int_\\gamma \\bar{z}\\, dz$ over the same segment</div><div class="example-body">$\\bar{z} = \\overline{t(1+i)} = t(1-i)$.<br><br>$\\displaystyle \\int_\\gamma \\bar{z}\\, dz = \\int_0^1 t(1-i)(1+i)\\, dt = (1-i)(1+i) \\int_0^1 t\\, dt = 2 \\cdot \\tfrac{1}{2} = 1.$<br><br>Now try a different path from $0$ to $1 + i$: first go horizontally from $0$ to $1$, then vertically from $1$ to $1 + i$. On the horizontal leg $z = x$, $\\bar{z} = x$, $dz = dx$, so the contribution is $\\int_0^1 x\\, dx = 1/2$. On the vertical leg $z = 1 + i y$, $\\bar{z} = 1 - i y$, $dz = i\\, dy$, so the contribution is $\\int_0^1 (1 - i y) \\cdot i\\, dy = i - i \\cdot i / 2 = i + 1/2$. Sum: $1/2 + i + 1/2 = 1 + i$.<br><br>$1 \\ne 1 + i$. Two paths, two answers. $\\bar{z}$ is not holomorphic (L3, Example 2), so the integral genuinely depends on the path. Holomorphicity is precisely what kills path dependence.</div></div>

<h2 class="lesson-title">3. The Canonical Example — $\\oint dz/z$</h2>

<div class="calc-highlight"><strong>The single most important contour integral in the subject.</strong> Compute the integral of $1/z$ around the unit circle, then around a circle that misses the origin. The contrast is the entire content of complex integration in one example: closed-loop integrals of a holomorphic function are zero, with one exception — when the loop encloses a singularity, in which case the singularity dictates a fixed answer that is independent of the loop's exact shape.</div>

<p class="l-text">Take the unit circle $\\gamma$ with the counter-clockwise orientation, $\\gamma(t) = e^{i t}$, $t \\in [0, 2\\pi]$, so $\\gamma'(t) = i\\, e^{i t}$.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Substitute into the contour integral</div><div class="step-detail">$\\displaystyle \\oint_\\gamma \\frac{dz}{z} = \\int_0^{2\\pi} \\frac{1}{e^{i t}} \\cdot i\\, e^{i t}\\, dt = \\int_0^{2\\pi} i\\, dt = 2\\pi i$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Generalise to a circle of arbitrary radius $r$</div><div class="step-detail">$\\gamma(t) = r\\, e^{i t}$, $\\gamma'(t) = i r\\, e^{i t}$. $\\displaystyle \\oint_\\gamma \\frac{dz}{z} = \\int_0^{2\\pi} \\frac{1}{r e^{i t}} \\cdot i r\\, e^{i t}\\, dt = 2\\pi i$. The radius does not appear in the final answer — every counter-clockwise circle around the origin returns the same number.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Now move the centre off the origin: circle of radius $1/2$ centred at $2$</div><div class="step-detail">$\\gamma(t) = 2 + \\tfrac{1}{2} e^{i t}$, $\\gamma'(t) = \\tfrac{i}{2} e^{i t}$. The integral becomes $\\displaystyle \\int_0^{2\\pi} \\frac{1}{2 + \\tfrac{1}{2} e^{i t}} \\cdot \\tfrac{i}{2} e^{i t}\\, dt$. The integrand is now bounded ($1/z$ never blows up on this loop), and a direct calculation (or invoking Cauchy's theorem in section 4) gives $0$. The loop did not enclose the singularity, and so the integral collapses to zero.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">PATH-DEPENDENCE OF $1/z$</div><div class="formula-main">$$\\oint_{|z| = r} \\frac{dz}{z} = 2\\pi i \\quad \\text{(any } r > 0 \\text{)}, \\qquad \\oint_C \\frac{dz}{z} = 0 \\quad \\text{(} C \\text{ does not enclose } 0 \\text{)}$$</div><div class="formula-sub">The answer depends only on whether the singularity is inside the loop, not on the loop's exact shape. This is the prototype residue calculation; section 5 packages it as the Cauchy integral formula.</div></div>

<div class="calc-graph"><div id="plot-l4-1overz-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two contours in the plane. The blue contour is the unit circle, which encloses the singularity of $1/z$ at the origin — its integral evaluates to $2\\pi i$. The amber contour is a small circle of radius $0.5$ centred at $z = 2$, which does not enclose the origin — its integral evaluates to $0$. The picture is the geometric content of the path-dependence statement: the integral of a function with a singularity sees only whether the loop has wound around the singularity.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var inc_x=[],inc_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;inc_x.push(Math.cos(th));inc_y.push(Math.sin(th));}
var enc={x:inc_x,y:inc_y,mode:'lines',name:'unit circle — encloses 0, integral = 2πi',line:{color:'#3b82f6',width:2.4},fill:'toself',fillcolor:'rgba(59,130,246,0.10)'};
var ex_x=[],ex_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;ex_x.push(2+0.5*Math.cos(th));ex_y.push(0.5*Math.sin(th));}
var nonenc={x:ex_x,y:ex_y,mode:'lines',name:'circle at z=2 — misses 0, integral = 0',line:{color:'#f59e0b',width:2.4},fill:'toself',fillcolor:'rgba(245,158,11,0.10)'};
var sing={x:[0],y:[0],mode:'markers+text',marker:{size:14,color:'#ef4444',symbol:'x'},text:['singularity z=0'],textposition:'bottom right',textfont:{color:'#fca5a5',size:11},name:'singularity z=0',showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.8,3.2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l4-1overz-en',[enc,nonenc,sing],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If you ran the integral $\\oint dz/z$ around an ellipse with semi-axes $3$ and $5$ centred at the origin, what would you get? (Answer: $2\\pi i$ — the shape does not matter, only whether the loop encloses the singularity.) What if the loop wound around the origin twice? (Answer: $4\\pi i$ — the answer scales with the winding number, an integer counting net counter-clockwise rotations.)</div></div>

<h2 class="lesson-title">4. Cauchy's Theorem and the Green-Formula Proof</h2>

<div class="calc-highlight"><strong>The integral counterpart to Cauchy-Riemann.</strong> Sectioning 3 made it clear that the only thing standing between a closed-loop integral and the value zero is the presence of a singularity inside the loop. Cauchy's theorem makes this precise: if $f$ is holomorphic on and inside a closed contour, with no singularity in the way, the integral vanishes. The proof is a one-paragraph application of Green's theorem; the Cauchy-Riemann equations are exactly the algebraic identity that makes the Green integrand collapse to zero.</div>

<div class="calc-formula"><div class="formula-label">CAUCHY'S INTEGRAL THEOREM</div><div class="formula-main">$$\\text{If } f \\text{ is holomorphic on a simply-connected domain } D \\text{ and } \\gamma \\subset D \\text{ is a closed contour, then } \\oint_\\gamma f(z)\\, dz = 0.$$</div><div class="formula-sub">"Simply-connected" is essential — it forbids the contour from going around a hole in the domain. If $D$ has holes (e.g. $\\mathbb{C} \\setminus \\{0\\}$ for $1/z$), the conclusion can fail.</div></div>

<p class="l-text"><strong>Proof sketch via Green's theorem.</strong> Recall the real Green theorem: for $P$, $Q$ continuously differentiable on the closure of a region $\\Omega$ bounded by a simple closed curve $\\gamma$ (counter-clockwise oriented),</p>

<div class="calc-formula"><div class="formula-label">GREEN'S THEOREM</div><div class="formula-main">$$\\oint_\\gamma (P\\, dx + Q\\, dy) \\;=\\; \\iint_\\Omega \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dA$$</div><div class="formula-sub">A real two-dimensional version of the fundamental theorem of calculus: a line integral around a closed loop equals a curl-like double integral over the enclosed region.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Split the contour integral into real parts</div><div class="step-detail">From section 1, $\\oint_\\gamma f\\, dz = \\oint_\\gamma (u\\, dx - v\\, dy) + i \\oint_\\gamma (v\\, dx + u\\, dy)$. Two real line integrals.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Apply Green's theorem to each</div><div class="step-detail">For the first, $P = u$, $Q = -v$, so the area integrand becomes $-v_x - u_y$. For the second, $P = v$, $Q = u$, so the area integrand becomes $u_x - v_y$. Putting them together: $\\oint_\\gamma f\\, dz = -\\iint_\\Omega (v_x + u_y)\\, dA + i \\iint_\\Omega (u_x - v_y)\\, dA$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Invoke Cauchy-Riemann</div><div class="step-detail">$f$ is holomorphic, so $u_x = v_y$ (the imaginary integrand vanishes) and $u_y = -v_x$ (the real integrand vanishes). Both double integrals are identically zero on $\\Omega$. The closed-loop integral is zero.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">CAUCHY-RIEMANN GIVES THE RESULT FOR FREE</div><div class="formula-main">$$\\oint_\\gamma f\\, dz \\;=\\; -\\iint_\\Omega \\underbrace{(v_x + u_y)}_{=\\,0 \\text{ by CR}}\\, dA \\;+\\; i \\iint_\\Omega \\underbrace{(u_x - v_y)}_{=\\,0 \\text{ by CR}}\\, dA \\;=\\; 0$$</div><div class="formula-sub">The Cauchy-Riemann equations are exactly the algebraic identities that turn Green's theorem into Cauchy's theorem. The integral theorem is the Cauchy-Riemann equations integrated up.</div></div>

<p class="l-text"><strong>Caveats.</strong> The proof above quietly assumed $u_x, u_y, v_x, v_y$ are continuous so Green's theorem applies. Goursat's refinement (1900) removes that hypothesis at the cost of a longer, triangle-subdivision proof. For all practical purposes — and certainly throughout the rest of this course — the continuous-derivatives version is what we use.</p>

<div class="l-note"><strong>Why simply-connected matters.</strong> If $D$ has a hole, the region $\\Omega$ enclosed by $\\gamma$ may include points where $f$ is not defined. Green's theorem then does not apply directly. The standard example is $f(z) = 1/z$ on $D = \\mathbb{C} \\setminus \\{0\\}$: the unit circle is a closed contour in $D$, but the disk it encloses is not in $D$ (the origin is missing). So Cauchy's theorem does not apply, and indeed the integral is $2\\pi i$, not zero.</div>

<h2 class="lesson-title">5. Contour Deformation</h2>

<div class="calc-highlight"><strong>The freedom Cauchy's theorem gives us.</strong> If two contours can be continuously deformed into each other without crossing a singularity, they yield the same integral. We are free to replace an awkward contour with a simple one — a small circle around a singularity, for instance — and compute the integral over the simpler shape. This is the workhorse technique that makes the residue theorem of L5 a practical tool.</div>

<div class="calc-formula"><div class="formula-label">DEFORMATION INVARIANCE</div><div class="formula-main">$$\\gamma_1 \\simeq \\gamma_2 \\text{ in } D \\setminus \\{\\text{singularities}\\} \\;\\Longrightarrow\\; \\oint_{\\gamma_1} f\\, dz \\;=\\; \\oint_{\\gamma_2} f\\, dz$$</div><div class="formula-sub">Here $\\simeq$ denotes homotopy: a continuous family of contours connecting $\\gamma_1$ to $\\gamma_2$ that stays inside the holomorphy domain throughout the deformation.</div></div>

<p class="l-text"><strong>Why this is true.</strong> Consider the annular region between $\\gamma_1$ and $\\gamma_2$ (assume $\\gamma_2$ is inside $\\gamma_1$ for definiteness). The boundary of that region, oriented so the interior is on the left, is $\\gamma_1$ minus $\\gamma_2$ (the inner loop runs the opposite way). $f$ is holomorphic on this annular region, which is simply-connected after a "cut" connecting the two boundary loops. Cauchy's theorem on the cut region gives $\\oint_{\\gamma_1} f - \\oint_{\\gamma_2} f = 0$, hence the two integrals agree.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Practical recipe</div><div class="card-body">To evaluate $\\oint_\\gamma f\\, dz$, find the singularities inside $\\gamma$, replace $\\gamma$ by small circles around each singularity, evaluate the integral over each circle separately, and sum.</div></div>
<div class="calc-card"><div class="card-title">Star-shaped shortcut</div><div class="card-body">If $\\gamma$ encloses a single singularity at $z_0$, deform $\\gamma$ into a circle of radius $\\varepsilon$ centred at $z_0$, parameterise it, and compute the resulting one-dimensional integral.</div></div>
<div class="calc-card"><div class="card-title">Multiple singularities</div><div class="card-body">For several enclosed singularities, deform $\\gamma$ into a "pant-leg" shape that hugs each singularity by a small circle. The total integral is the sum of the contributions from the small circles.</div></div>
<div class="calc-card"><div class="card-title">Winding number</div><div class="card-body">The integer $n(\\gamma, z_0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{dz}{z - z_0}$ counts how many times $\\gamma$ wraps around $z_0$ in the counter-clockwise sense. For simple loops this is $0$ or $1$.</div></div>
</div>

<div class="calc-graph"><div id="plot-l4-deform-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a non-circular contour $\\gamma$ (blue, a slightly squashed loop) and a small circular contour $\\gamma'$ (amber) around the singularity at the origin. The two are homotopic in $\\mathbb{C} \\setminus \\{0\\}$ — you can deform one into the other without ever touching the singularity. By the deformation principle, $\\oint_\\gamma dz/z = \\oint_{\\gamma'} dz/z = 2\\pi i$, regardless of the wiggly outer shape.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var wig_x=[],wig_y=[];for(var i=0;i<=300;i++){var th=2*Math.PI*i/300;var r=1.5+0.4*Math.cos(3*th)+0.2*Math.sin(5*th);wig_x.push(r*Math.cos(th));wig_y.push(r*Math.sin(th));}
var outer={x:wig_x,y:wig_y,mode:'lines',name:'γ — wiggly outer contour',line:{color:'#3b82f6',width:2.4}};
var inn_x=[],inn_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;inn_x.push(0.35*Math.cos(th));inn_y.push(0.35*Math.sin(th));}
var inner={x:inn_x,y:inn_y,mode:'lines',name:"γ' — small circle around 0",line:{color:'#f59e0b',width:2.4}};
var arr=[];for(var k=0;k<8;k++){var th=2*Math.PI*k/8;var r1=1.5+0.4*Math.cos(3*th)+0.2*Math.sin(5*th);var x1=r1*Math.cos(th),y1=r1*Math.sin(th);var x2=0.35*Math.cos(th),y2=0.35*Math.sin(th);arr.push({x:[x1,x2],y:[y1,y2],mode:'lines',line:{color:'rgba(156,163,175,0.4)',width:1,dash:'dot'},showlegend:(k===0),name:'homotopy paths'});}
var sing={x:[0],y:[0],mode:'markers+text',marker:{size:14,color:'#ef4444',symbol:'x'},text:['z=0'],textposition:'top right',textfont:{color:'#fca5a5',size:11},name:'singularity',showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2.4,2.4],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2.4,2.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l4-deform-en',[outer,inner,sing].concat(arr),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DEFORMATION IN PRACTICE</div><div class="example-body">Evaluate $\\displaystyle \\oint_\\gamma \\frac{dz}{(z-1)(z-2)}$ where $\\gamma$ is the rectangle with corners $\\pm 3 \\pm 3i$.<br><br>The integrand has singularities at $z = 1$ and $z = 2$, both inside the rectangle. Deform $\\gamma$ into two small circles $C_1$ around $1$ and $C_2$ around $2$. By partial fractions, $\\frac{1}{(z-1)(z-2)} = \\frac{1}{z-2} - \\frac{1}{z-1}$.<br><br>On $C_1$ around $1$: $\\oint_{C_1} \\frac{dz}{z-2}$ is over a small loop around $1$, where $1/(z-2)$ is holomorphic (since $2$ is outside $C_1$). By Cauchy's theorem this integral is $0$. The second piece, $-\\oint_{C_1} \\frac{dz}{z-1} = -2\\pi i$ (using the canonical example shifted by $1$). Total on $C_1$: $-2\\pi i$.<br><br>On $C_2$ around $2$: $\\oint_{C_2} \\frac{dz}{z-2} = 2\\pi i$ and $\\oint_{C_2} \\frac{dz}{z-1} = 0$ (since $1$ is outside $C_2$). Total on $C_2$: $2\\pi i$.<br><br>Sum: $-2\\pi i + 2\\pi i = 0$. The rectangle integral is zero. The two singularities exactly cancel.</div></div>

<h2 class="lesson-title">6. Cauchy's Integral Formula</h2>

<div class="calc-highlight"><strong>The single most surprising formula in complex analysis.</strong> If $f$ is holomorphic on and inside a closed contour $\\gamma$, then the value of $f$ at any interior point $z_0$ is given by a specific integral of $f$ over the boundary $\\gamma$. In words: the values of a holomorphic function on a region are completely determined by its values on the boundary of the region. No real-variable analogue exists.</div>

<div class="calc-formula"><div class="formula-label">CAUCHY INTEGRAL FORMULA</div><div class="formula-main">$$f(z_0) \\;=\\; \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz$$</div><div class="formula-sub">Valid whenever $f$ is holomorphic on a region containing $\\gamma$ and its interior, $\\gamma$ is simple closed and counter-clockwise, and $z_0$ is strictly inside $\\gamma$.</div></div>

<p class="l-text"><strong>Derivation.</strong> Start from the assumption that $f$ is holomorphic in a region containing $\\gamma$ and the closed disk it bounds. Consider the auxiliary function $g(z) = \\frac{f(z) - f(z_0)}{z - z_0}$. This is holomorphic away from $z_0$, and (because $f$ is differentiable at $z_0$) the limit as $z \\to z_0$ is $f'(z_0)$, so $g$ is bounded near $z_0$. By the Riemann removable-singularity criterion, $g$ extends to a holomorphic function on the whole region.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Apply Cauchy's theorem to $g$</div><div class="step-detail">$\\oint_\\gamma g\\, dz = \\oint_\\gamma \\frac{f(z) - f(z_0)}{z - z_0}\\, dz = 0$, since $g$ is holomorphic on the simply-connected region bounded by $\\gamma$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Split the integrand</div><div class="step-detail">$0 = \\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz - f(z_0) \\oint_\\gamma \\frac{dz}{z - z_0}$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Evaluate the second integral</div><div class="step-detail">By deformation, $\\oint_\\gamma \\frac{dz}{z - z_0}$ equals the same integral over any small circle around $z_0$, which equals $2\\pi i$ (canonical example shifted to $z_0$).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Rearrange</div><div class="step-detail">$\\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz = f(z_0) \\cdot 2\\pi i$, hence $f(z_0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz$.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mean value property</div><div class="card-body">Specialising to a circle of radius $r$ centred at $z_0$ and parameterising by $z = z_0 + r e^{i t}$ gives $f(z_0) = \\frac{1}{2\\pi} \\int_0^{2\\pi} f(z_0 + r e^{i t})\\, dt$: $f$ at the centre equals its average over the boundary circle. A property shared by harmonic functions.</div></div>
<div class="calc-card"><div class="card-title">Holomorphic = analytic</div><div class="card-body">Expanding $1/(z - z_0)$ as a geometric series in powers of $(z_0 - a)/(z - a)$ for a nearby base point $a$, then plugging into the Cauchy formula, yields a power-series representation for $f$ around $a$. This is the L3 claim that holomorphic implies analytic, now proved.</div></div>
<div class="calc-card"><div class="card-title">Liouville</div><div class="card-body">Applying the formula to a circle of large radius $R$, using $|f| \\le M$ (boundedness) and the length of the circle, gives $|f'(z_0)| \\le M/R$, which goes to zero as $R \\to \\infty$. So $f' \\equiv 0$ and $f$ is constant. This is the proof of Liouville's theorem stated in L3.</div></div>
<div class="calc-card"><div class="card-title">Schwarz reflection, maximum modulus, ...</div><div class="card-body">A whole catalogue of theorems flows from the formula. Once you have integral representation of $f$ and all derivatives in terms of boundary data, structural rigidity follows by analytic gymnastics.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE — RECOVERING $f(0)$ FOR $f(z) = z^2 + 3$</div><div class="example-body">$f$ is entire, so apply the integral formula on the unit circle $\\gamma$: $f(0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{z^2 + 3}{z}\\, dz$.<br><br>Direct calculation: parameterise $z = e^{i t}$, $dz = i e^{i t} dt$. The integrand becomes $\\frac{e^{2 i t} + 3}{e^{i t}} \\cdot i\\, e^{i t}\\, dt = i (e^{2 i t} + 3)\\, dt$. Integrate from $0$ to $2\\pi$: $i \\int_0^{2\\pi} e^{2 i t}\\, dt + 3 i \\int_0^{2\\pi} dt = i \\cdot 0 + 3 i \\cdot 2\\pi = 6 \\pi i$.<br><br>Divide by $2\\pi i$: $f(0) = 6 \\pi i / (2 \\pi i) = 3$.<br><br>Direct check: $f(0) = 0^2 + 3 = 3$. The formula reproduces the value of $f$ at the centre of the circle from a sum of values on the boundary.</div></div>

<div class="calc-graph"><div id="plot-l4-cif-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a unit circle $\\gamma$ (blue) in the $z$-plane and an interior point $z_0 = 0.4 + 0.2 i$ (gold marker). The Cauchy integral formula says: take the values $f(z)$ on the boundary, weight each by $1/(z - z_0)$, integrate around the loop, and divide by $2\\pi i$. The number you get is exactly $f(z_0)$. The two arrows highlight that the formula sees every boundary value as a contributing voice.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var c_x=[],c_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;c_x.push(Math.cos(th));c_y.push(Math.sin(th));}
var circ={x:c_x,y:c_y,mode:'lines',name:'γ — boundary circle',line:{color:'#3b82f6',width:2.4}};
var z0={x:[0.4],y:[0.2],mode:'markers+text',marker:{size:12,color:'#f59e0b',symbol:'circle'},text:['z₀ = 0.4 + 0.2i'],textposition:'bottom right',textfont:{color:'#fcd34d',size:11},name:'interior point z₀'};
var arrows=[];var angs=[0,Math.PI/3,2*Math.PI/3,Math.PI,4*Math.PI/3,5*Math.PI/3];for(var k=0;k<angs.length;k++){var th=angs[k];arrows.push({x:[Math.cos(th),0.4],y:[Math.sin(th),0.2],mode:'lines',line:{color:'rgba(168,139,250,0.45)',width:1.2,dash:'dot'},showlegend:(k===0),name:'boundary → interior weighting'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.4,1.4],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.4,1.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l4-cif-en',[circ,z0].concat(arrows),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The boundary-rules-the-interior principle.</strong> In real analysis a smooth function on the interior of an interval is not at all determined by its values on the endpoints — there are infinitely many smooth interpolants. In complex analysis a holomorphic function on the interior of a region is <em>completely</em> determined by its values on the boundary. This is the precise sense in which complex analysis "knows more" than real analysis with the same data.</div>

<h2 class="lesson-title">7. The Generalised Formula for Derivatives</h2>

<div class="calc-highlight"><strong>The integral formula keeps giving.</strong> Differentiating both sides of the Cauchy integral formula with respect to $z_0$ produces the same formula with a higher power of $(z - z_0)$ in the denominator. Iterating gives a formula for every derivative of $f$ at $z_0$ in terms of one boundary integral. So not only $f(z_0)$ but all of $f', f'', \\dots, f^{(n)}, \\dots$ are determined by boundary data, with the same integral being computed against successively higher reciprocals.</div>

<div class="calc-formula"><div class="formula-label">CAUCHY FORMULA FOR DERIVATIVES</div><div class="formula-main">$$f^{(n)}(z_0) \\;=\\; \\frac{n!}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^{n+1}}\\, dz$$</div><div class="formula-sub">For every $n \\ge 0$, under the same hypotheses as the original Cauchy formula. The right-hand side is differentiation under the integral sign applied $n$ times, and the boundary integral always converges because the integrand stays bounded on $\\gamma$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Differentiate the Cauchy integral formula with respect to $z_0$</div><div class="step-detail">$\\frac{d}{d z_0} \\frac{1}{z - z_0} = \\frac{1}{(z - z_0)^2}$. So $f'(z_0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^2}\\, dz$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Differentiate again</div><div class="step-detail">$\\frac{d}{d z_0} \\frac{1}{(z - z_0)^2} = \\frac{2}{(z - z_0)^3}$. So $f''(z_0) = \\frac{2}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^3}\\, dz = \\frac{2!}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^3}\\, dz$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Induct</div><div class="step-detail">After $n$ differentiations the denominator carries $(z - z_0)^{n+1}$ and the prefactor accumulates $n!$. The pattern is the formula stated.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Crucial corollary</div><div class="step-detail">$f$ holomorphic implies $f$ has derivatives of every order on the interior of $\\gamma$. So once-differentiable implies infinitely-differentiable. This is the integral-side proof of holomorphic = analytic.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cauchy estimates</div><div class="card-body">Bounding the derivative formula gives $|f^{(n)}(z_0)| \\le n! M / R^n$ where $M = \\max_{|z - z_0| = R} |f(z)|$. The factor $1/R^n$ controls growth of derivatives, and is the source of many rigidity results.</div></div>
<div class="calc-card"><div class="card-title">Taylor coefficient formula</div><div class="card-body">The $n$-th Taylor coefficient of $f$ at $z_0$ is exactly $\\frac{f^{(n)}(z_0)}{n!} = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^{n+1}}\\, dz$. So Taylor coefficients themselves are boundary integrals.</div></div>
<div class="calc-card"><div class="card-title">Numerical use</div><div class="card-body">Quadrature on the right-hand side is a stable way to compute high-order derivatives of complicated holomorphic functions — finite differences notoriously amplify noise, while a boundary integral averages it out.</div></div>
<div class="calc-card"><div class="card-title">Power series</div><div class="card-body">$f(z) = \\sum_{n \\ge 0} \\frac{f^{(n)}(z_0)}{n!} (z - z_0)^n$ converges in the largest open disk around $z_0$ inside which $f$ remains holomorphic.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE — $f^{(3)}(0)$ for $f(z) = \\sin z$ via the integral formula</div><div class="example-body">$\\sin z$ is entire; use $\\gamma$ = unit circle.<br><br>$f^{(3)}(0) = \\frac{3!}{2 \\pi i} \\oint_\\gamma \\frac{\\sin z}{z^4}\\, dz$. The integrand has a pole of order $4$ at $0$. The Taylor expansion of $\\sin z$ is $z - z^3/6 + z^5/120 - \\cdots$, so $\\sin z / z^4 = 1/z^3 - 1/(6 z) + z/120 - \\cdots$. The only term whose integral over the unit circle is non-zero is the $1/z$ term (by the canonical example). The coefficient is $-1/6$, so $\\oint \\sin z / z^4 \\, dz = -1/6 \\cdot 2\\pi i = -\\pi i / 3$.<br><br>So $f^{(3)}(0) = 6 / (2\\pi i) \\cdot (-\\pi i / 3) = -1$. Direct check: $\\sin z$ has Taylor series $z - z^3/6 + \\cdots$, so $f^{(3)}(0) = -1$ (matching the coefficient of $z^3$ multiplied by $3! = 6$, with sign $-1/6 \\cdot 6 = -1$). The boundary integral reproduces the Taylor coefficient.</div></div>

<h2 class="lesson-title">8. The Maximum Modulus Principle</h2>

<div class="calc-highlight"><strong>A direct corollary of the mean-value property.</strong> Because $f(z_0)$ is the average of $f$ on every small circle around $z_0$, if $|f|$ attained a local maximum at $z_0$ in the interior of a domain, every value on the surrounding circles would have to be at most that maximum, and on average exactly equal to it — forcing $|f|$ to be locally constant. A connectedness argument extends "locally constant" to "constant on the whole connected component". The contrapositive is the maximum modulus principle: a non-constant holomorphic function never attains the maximum of $|f|$ in the interior of its domain.</div>

<div class="calc-formula"><div class="formula-label">MAXIMUM MODULUS PRINCIPLE</div><div class="formula-main">$$\\text{If } f \\text{ is holomorphic on a bounded domain } \\Omega \\text{ and continuous on } \\overline{\\Omega}, \\text{ then } \\max_{\\overline{\\Omega}} |f| \\text{ is attained on the boundary } \\partial \\Omega.$$</div><div class="formula-sub">Either the maximum is on the boundary, or $f$ is constant. There is no third option. The interior simply cannot host the peak of $|f|$ unless the function is degenerate.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Minimum modulus</div><div class="card-body">An analogous statement: if $f$ has no zeros in $\\Omega$, then $\\min |f|$ is also attained on the boundary (apply maximum modulus to $1/f$). Zeros in the interior allow $|f|$ to dip lower than any boundary value.</div></div>
<div class="calc-card"><div class="card-title">Uniqueness lever</div><div class="card-body">If two holomorphic functions $f, g$ agree on the boundary of $\\Omega$, then $|f - g|$ attains its max on $\\partial \\Omega$, where it is zero. Hence $f - g \\equiv 0$ on $\\Omega$. Boundary equality forces interior equality — once you commit to "holomorphic", the boundary is destiny.</div></div>
<div class="calc-card"><div class="card-title">Schwarz lemma</div><div class="card-body">For $f$ holomorphic on the unit disk with $f(0) = 0$ and $|f(z)| \\le 1$, the maximum modulus argument gives $|f(z)| \\le |z|$ everywhere and $|f'(0)| \\le 1$, with equality only for rotations $f(z) = e^{i \\theta} z$. A foundational rigidity statement.</div></div>
<div class="calc-card"><div class="card-title">Open mapping theorem</div><div class="card-body">A non-constant holomorphic map sends open sets to open sets. Equivalent (via maximum modulus) to the statement that interior points cannot be peak-modulus points.</div></div>
</div>

<div class="calc-graph"><div id="plot-l4-maxmod-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this surface shows:</strong> the modulus $|f(z)|$ for $f(z) = z^2 + 1$ over the unit disk $|z| \\le 1$. The surface is a smooth bowl shape; its largest value over the closed disk lives on the boundary circle, not at any interior point. Concretely, $|f(0)| = 1$ at the centre, but on the boundary $|z| = 1$ we have $|z^2 + 1|$ reaching its maximum $2$ at $z = \\pm 1$. The maximum modulus principle in pixel form: the peak sits on the rim.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=50;var xs=[],ys=[];var zs=[];
for(var i=0;i<N;i++){xs.push(-1+2*i/(N-1));ys.push(-1+2*i/(N-1));}
for(var j=0;j<N;j++){var row=[];for(var i=0;i<N;i++){var x=xs[i],y=ys[j];if(x*x+y*y>1.0001){row.push(null);}else{var u=x*x-y*y+1;var v=2*x*y;row.push(Math.sqrt(u*u+v*v));}}zs.push(row);}
var surf={type:'surface',x:xs,y:ys,z:zs,colorscale:[[0,'#1e3a8a'],[0.5,'#3b82f6'],[1,'#fef3c7']],showscale:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'Re(z)',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},yaxis:{title:'Im(z)',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},zaxis:{title:'|f(z)| = |z² + 1|',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},camera:{eye:{x:1.7,y:1.7,z:1.1}}},margin:{t:20,r:0,b:0,l:0}};
Plotly.newPlot('plot-l4-maxmod-en',[surf],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why this is harder than it sounds.</strong> Real functions can absolutely have interior maxima of $|f|$ — think of $f(x) = 1 - x^2$ on $[-1, 1]$, peaking at $0$ in the interior. The maximum modulus principle is a complex-only statement; it is the rigidity of holomorphic functions speaking through their absolute values. The mean-value property is the local mechanism; analytic continuation provides the global force.</div>

<h2 class="lesson-title">9. Classical Applications</h2>

<p class="l-text">The integral theorems of this lesson are not abstract decoration. They are the working machinery of several whole subfields of classical engineering mathematics and physics. We list a few sets of applications, all of which use the same trio (Cauchy theorem, integral formula, maximum modulus) as the toolkit.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2-D potential theory</div><div class="card-body">The real and imaginary parts of a holomorphic function are harmonic (L3, section 7). So Cauchy's formula gives a boundary integral representation for solutions of the 2-D Laplace equation $\\Delta u = 0$. This is the basis of the Poisson integral formula and the Dirichlet problem on the disk.</div></div>
<div class="calc-card"><div class="card-title">Electrostatics</div><div class="card-body">In two dimensions the electric potential satisfies Laplace's equation away from charges. Boundary conditions (e.g. constant potential on a conducting surface) plus the maximum modulus principle pin down the field uniquely. Configurations involving cylinders, edges, and corners are all attacked via complex-variable methods.</div></div>
<div class="calc-card"><div class="card-title">Ideal fluid flow</div><div class="card-body">Incompressible, irrotational 2-D flow has a complex potential $w(z) = \\phi + i \\psi$ holomorphic in the flow region, where $\\phi$ is the velocity potential and $\\psi$ the stream function. Cauchy's theorem gives circulation around closed curves; deformation gives the Kutta-Joukowski lift formula.</div></div>
<div class="calc-card"><div class="card-title">Aerofoil design</div><div class="card-body">The Joukowski transformation $w = z + 1/z$ maps a circle to an aerofoil shape; Cauchy formulas applied to the flow around the circle give the flow around the aerofoil. This is how lift coefficients were originally computed and remains a standard exposition exercise.</div></div>
<div class="calc-card"><div class="card-title">Signal processing</div><div class="card-body">The Fourier transform is a contour integral on the real line; the Laplace transform extends the contour into the complex plane. Inversion formulas (Bromwich integrals) are contour integrals over vertical lines, and analyticity of the transform encodes causality and stability of the underlying systems.</div></div>
<div class="calc-card"><div class="card-title">Definite real integrals via residues</div><div class="card-body">Many definite integrals over the real line — improper, with awkward integrands — yield to a contour-integral trick: close the contour in the upper half-plane, apply Cauchy's theorem / residue calculus, and read off the real integral as the sum of residues. L5 develops this systematically.</div></div>
</div>

<div class="l-note"><strong>One brief paragraph on the modern connection.</strong> Physics-informed neural networks (PINNs) solve PDEs — including Laplace's equation — by penalising the residual of the differential operator on sampled points. The harmonic functions that arise as real parts of holomorphic functions are exactly the solutions to 2-D Laplace, and the Cauchy formulas of this lesson provide a closed-form boundary-integral representation that can be used as ground truth or as a benchmark for trained networks. This is the same classical machinery, used now as a sanity check for new methods.</div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>What to play with.</strong> Swap $f(z) = z^2 + 3$ for $f(z) = e^z$, $\\cos z$, or any polynomial — the recovered values should still match. Replace the unit circle by a circle of radius $2$ and verify the recovery still works (the integral formula does not care about the radius, only that $z_0$ stays inside). Probe Cauchy's theorem failure mode: pass $f(z) = 1/z$ and observe that the value of the Cauchy formula at $z_0 = 0$ is meaningless because the integrand has a pole on the integration path's interior. Reproduce the worked example $\\oint_\\gamma dz / ((z-1)(z-2)) = 0$ over a circle of radius $3$ centred at the origin — the two singularities cancel exactly.</p>

<h2 class="lesson-title">11. Summary — What You Can Now Do</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Contour integral</div><div class="card-body">A path-aware integral with complex integrand. Reduces to a one-variable integral via $\\int f(\\gamma(t)) \\gamma'(t)\\, dt$.</div><div class="card-formula">$\\int_\\gamma f\\, dz$</div></div>
<div class="calc-card"><div class="card-title">Path dependence of $1/z$</div><div class="card-body">$2\\pi i$ if the loop encloses $0$, zero otherwise. The prototype of every residue calculation to come.</div><div class="card-formula">$\\oint dz/z = 2 \\pi i$</div></div>
<div class="calc-card"><div class="card-title">Cauchy's theorem</div><div class="card-body">Closed-loop integrals of holomorphic functions vanish. Proven by Green's theorem plus Cauchy-Riemann.</div><div class="card-formula">$\\oint_\\gamma f = 0$</div></div>
<div class="calc-card"><div class="card-title">Contour deformation</div><div class="card-body">Homotopic contours give the same integral. Replace awkward shapes by small circles around singularities.</div><div class="card-formula">$\\gamma_1 \\simeq \\gamma_2 \\Rightarrow \\int$ same</div></div>
<div class="calc-card"><div class="card-title">Cauchy integral formula</div><div class="card-body">Interior values from boundary data. The boundary determines $f$ everywhere inside.</div><div class="card-formula">$f(z_0) = \\frac{1}{2 \\pi i} \\oint \\frac{f}{z - z_0}$</div></div>
<div class="calc-card"><div class="card-title">Derivative formula</div><div class="card-body">Every derivative is a single boundary integral. Holomorphic implies infinitely differentiable.</div><div class="card-formula">$f^{(n)}(z_0) = \\frac{n!}{2 \\pi i} \\oint \\frac{f}{(z - z_0)^{n+1}}$</div></div>
<div class="calc-card"><div class="card-title">Maximum modulus</div><div class="card-body">$|f|$ attains its max on the boundary unless $f$ is constant. Uniqueness lever for boundary-value problems.</div><div class="card-formula">$\\max_{\\overline\\Omega} |f| \\in \\partial \\Omega$</div></div>
<div class="calc-card"><div class="card-title">Applications</div><div class="card-body">2-D potential theory, electrostatics, ideal flow, aerofoils, signal transforms — all share this integral toolkit.</div><div class="card-formula">$\\Delta \\phi = 0$, $w = \\phi + i \\psi$</div></div>
</div>

<div class="l-note"><strong>Where this travels next.</strong> L5 builds Laurent series and the residue theorem on top of the Cauchy integral formula. Once $f^{(n)}(z_0)$ is a boundary integral, expansion around singularities yields the Laurent expansion, and the coefficient of $1/(z - z_0)$ — the "residue" — becomes a single number that determines the integral around any contour enclosing $z_0$. The residue theorem packages everything in this lesson plus the deformation principle into one statement that computes both contour integrals and the seemingly unrelated real definite integrals that resist elementary methods. L6 returns to conformal mapping and uses Cauchy's formulas to solve boundary-value problems on regions other than the disk. Harmonic functions, briefly mentioned in section 9, are the bridge between this lesson and modern physics-informed neural networks, where the same boundary-integral representation provides ground-truth solutions for benchmarking neural surrogate models of the 2-D Laplace equation.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Karmaşık analizin merak konusu olmaktan çıkıp bir hesap motoruna dönüştüğü yer burası.</strong> L3'te teorinin diferansiyel tarafını — Cauchy-Riemann denklemlerini ve holomorf fonksiyonların katılığını — kurmuştuk. Bu derste <em>integral</em> tarafını kuruyoruz ve iki taraf evlendiğinde ortaya o kadar mantıksız sonuçlar çıkıyor ki gerçel analizde karşılığı yok. Bir holomorf fonksiyon, kapalı bir sınır üzerindeki değerleri tarafından tek olarak belirleniyor; her dereceden türevleri aynı sınırdan okunabiliyor; ve böyle bir fonksiyonun her kapalı çevrim integrali sıfır oluyor — çevrim bir tekilliği sarmadıkça, ki o durumda sonuç içerideki tekilliğin söylediği şey oluyor.</p>

<p class="l-text">Plan: kontur integrallerini dikkatli tanımlamak, kanonik örnek $1/z$ üzerinden yola bağımlılığı kanıtlamak, Cauchy teoremini ifade edip Green teoremiyle ispatın taslağını çıkarmak, kontur deformasyonunu tanıtmak, Cauchy integral formülüne ve onun türev genellemesine tırmanmak, maksimum modülüs ilkesiyle bitirmek. Yol boyunca birkaç integrali elle hesaplayıp Pyodide'da doğrulayacağız. Dersin sonunda L5 (Laurent serileri ve artıklar) için motoru çalışır halde elinde tutacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Parçalı düzgün yönlü eğriler boyunca kontur integrallerini tanımlamayı ve hesaplamayı</li>
<li>Kanonik örnek $1/z$ ile yola bağımlılığı göstermeyi ve geometrik olarak açıklamayı</li>
<li>Cauchy teoremini ifade etmeyi ve Green teoremi üzerinden ispatın taslağını çıkarmayı</li>
<li>İntegrali, homotopik daha basit bir yolla değiştirerek hesaplamak için kontur deformasyonunu uygulamayı</li>
<li>Cauchy integral formülünü kullanarak holomorf bir fonksiyonun iç değerlerini sınır verisinden kurtarmayı</li>
<li>Türevler için genelleştirilmiş formülü türetmeyi ve $f^{(n)}(z_0)$'ı tek bir sınır integralinden okumayı</li>
<li>Maksimum modülüs ilkesini açıklamayı ve onu bir teklik kaldıracı olarak kullanmayı</li>
<li>İntegral teoremlerini akışkan akışına, elektrostatiğe ve 2-B Laplace denklemine bağlamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Kontur İntegralleri — Tanım</h2>

<div class="calc-highlight"><strong>Bir kontur integrali, gerçel integralin yol-farkındalıklı versiyonudur.</strong> İntegrand bir karmaşık fonksiyon; integrasyon değişkeni bir eğri çizen bir karmaşık sayı. Eğri tek bir gerçel boyutta değil iki gerçel boyutta yaşadığından, "yol" birdenbire gerçel belirli integralin asla ifade edemediği bilgiyi taşır. Bu dersteki her şey o tek yapısal farktan filizleniyor.</div>

<p class="l-text">Bir <strong>kontur</strong> $\\gamma$, $\\mathbb{C}$'de parçalı düzgün yönlü bir eğridir; $\\gamma : [a, b] \\to \\mathbb{C}$ sürekli ve sonlu sayıda köşe haricinde türevlenebilir. Yön verinin parçasıdır — yönü tersine çevirmek tanımlayacağımız her integralin işaretini tersine çevirir.</p>

<div class="calc-formula"><div class="formula-label">KONTUR İNTEGRALİ</div><div class="formula-main">$$\\int_\\gamma f(z)\\, dz \\;=\\; \\int_a^b f(\\gamma(t))\\, \\gamma'(t)\\, dt$$</div><div class="formula-sub">Sağ taraf, karmaşık integrandlı sıradan tek değişkenli bir integraldir; her zaman anlamlıdır ve iki gerçel integrale (gerçel ve sanal kısım) indirgenir.</div></div>

<p class="l-text">Koordinatlarda: $f(z) = u(x, y) + i\\, v(x, y)$ ve $dz = dx + i\\, dy$ yaz. Çarpımı açarsak eşdeğer gerçel hal:</p>

<div class="calc-formula"><div class="formula-label">GERÇEL FORM AYRIŞTIRMA</div><div class="formula-main">$$\\int_\\gamma f(z)\\, dz \\;=\\; \\int_\\gamma (u\\, dx - v\\, dy) \\;+\\; i \\int_\\gamma (v\\, dx + u\\, dy)$$</div><div class="formula-sub">Birbirine yapışmış iki gerçel çizgi integrali. Bu form, 4. bölümde Green teoreminin yiyeceği şey.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\gamma : [a, b] \\to \\mathbb{C}$</div><div class="card-body">Parametrelenmiş yönlü eğri. Aynı geometrik resim birçok parametrizasyonu destekler; integral, yön-koruyan yeniden parametrizasyon altında değişmezdir.</div></div>
<div class="calc-card"><div class="card-title">$\\gamma'(t)$</div><div class="card-body">Eğri boyunca karmaşık hız. Modülü hız, argümanı yerel yön. $\\gamma$'yı tersine çevirmek $\\gamma'$'ı negatifleştirir ve dolayısıyla integrali.</div></div>
<div class="calc-card"><div class="card-title">Kapalı kontur</div><div class="card-body">$\\gamma(a) = \\gamma(b)$ olan bir kontur. Kapalı kontur üzerindeki integral $\\oint_\\gamma f\\, dz$ olarak yazılır ve bu dersin merkezi nesnesidir.</div></div>
<div class="calc-card"><div class="card-title">Basit kontur</div><div class="card-body">Kendisiyle kesişmeyen bir kontur (kapalı konturda uç noktalar haricinde). Jordan eğri teoremi düzlemi bir iç ve bir dış olarak böler.</div></div>
</div>

<div class="l-note"><strong>Ezberlenmesi gereken standart parametrizasyonlar.</strong> Saat yönünün tersine birim çember: $\\gamma(t) = e^{i t}$, $t \\in [0, 2\\pi]$, $\\gamma'(t) = i e^{i t}$. $z_1$'den $z_2$'ye doğru parçası: $\\gamma(t) = z_1 + t(z_2 - z_1)$, $t \\in [0, 1]$, $\\gamma'(t) = z_2 - z_1$. $z_0$ merkezli yarıçap $r$ saat yönünün tersine: $\\gamma(t) = z_0 + r e^{i t}$, $t \\in [0, 2\\pi]$, $\\gamma'(t) = i r e^{i t}$.</div>

<h2 class="lesson-title">2. İlk Çözülmüş Örnekler</h2>

<p class="l-text">Yola bağımlılık örneği ısırmadan önce mekanizmayı çalıştıran iki kısa hesap.</p>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — $0$'dan $1 + i$'ye doğru parçası üzerinde $\\int_\\gamma z\\, dz$</div><div class="example-body">$\\gamma(t) = t(1 + i)$ olarak parametrele, $t \\in [0, 1]$, dolayısıyla $\\gamma'(t) = 1 + i$.<br><br>$\\displaystyle \\int_\\gamma z\\, dz = \\int_0^1 t(1+i) \\cdot (1+i)\\, dt = (1+i)^2 \\int_0^1 t\\, dt = (1+i)^2 \\cdot \\tfrac{1}{2} = \\tfrac{1}{2}(2i) = i.$<br><br>Uç noktalarda değerlendirilen kuramsal ters türev $z^2/2$ ile karşılaştır: $\\frac{(1+i)^2}{2} - 0 = \\frac{2i}{2} = i$. Aynı cevap. Bu tesadüf değil — 3. bölüm gösterecek ki integrandın holomorf bir ters türevi olduğunda integral temel teorem formuna çöker.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — Aynı doğru parçası üzerinde $\\int_\\gamma \\bar{z}\\, dz$</div><div class="example-body">$\\bar{z} = \\overline{t(1+i)} = t(1-i)$.<br><br>$\\displaystyle \\int_\\gamma \\bar{z}\\, dz = \\int_0^1 t(1-i)(1+i)\\, dt = (1-i)(1+i) \\int_0^1 t\\, dt = 2 \\cdot \\tfrac{1}{2} = 1.$<br><br>Şimdi $0$'dan $1 + i$'ye farklı bir yol dene: önce $0$'dan $1$'e yatay, sonra $1$'den $1 + i$'ye dikey. Yatay parçada $z = x$, $\\bar{z} = x$, $dz = dx$, katkı $\\int_0^1 x\\, dx = 1/2$. Dikey parçada $z = 1 + i y$, $\\bar{z} = 1 - i y$, $dz = i\\, dy$, katkı $\\int_0^1 (1 - i y) \\cdot i\\, dy = i - i \\cdot i / 2 = i + 1/2$. Toplam: $1/2 + i + 1/2 = 1 + i$.<br><br>$1 \\ne 1 + i$. İki yol, iki cevap. $\\bar{z}$ holomorf değil (L3, Örnek 2), dolayısıyla integral gerçekten yola bağlı. Yola bağımlılığı tam olarak öldüren şey holomorfluktur.</div></div>

<h2 class="lesson-title">3. Kanonik Örnek — $\\oint dz/z$</h2>

<div class="calc-highlight"><strong>Konunun en önemli kontur integrali.</strong> $1/z$'nin birim çember etrafındaki integralini hesapla, sonra orjini ıskalayan bir çember etrafındaki integralini. Karşıtlık karmaşık integrasyonun tüm içeriğini tek bir örnekte sunar: holomorf bir fonksiyonun kapalı çevrim integralleri sıfırdır, bir istisnayla — çevrim bir tekilliği sardığında, ki o durumda tekillik, çevrimin tam şeklinden bağımsız sabit bir cevap dayatır.</div>

<p class="l-text">Birim çember $\\gamma$'yı saat yönünün tersi yönüyle al, $\\gamma(t) = e^{i t}$, $t \\in [0, 2\\pi]$, dolayısıyla $\\gamma'(t) = i\\, e^{i t}$.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Kontur integraline yerleştir</div><div class="step-detail">$\\displaystyle \\oint_\\gamma \\frac{dz}{z} = \\int_0^{2\\pi} \\frac{1}{e^{i t}} \\cdot i\\, e^{i t}\\, dt = \\int_0^{2\\pi} i\\, dt = 2\\pi i$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Keyfi yarıçap $r$ çemberine genelle</div><div class="step-detail">$\\gamma(t) = r\\, e^{i t}$, $\\gamma'(t) = i r\\, e^{i t}$. $\\displaystyle \\oint_\\gamma \\frac{dz}{z} = \\int_0^{2\\pi} \\frac{1}{r e^{i t}} \\cdot i r\\, e^{i t}\\, dt = 2\\pi i$. Yarıçap son cevapta görünmez — orjin etrafındaki her saat-yönünün-tersi çember aynı sayıyı verir.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Şimdi merkezi orjinden kaydır: $2$ merkezli $1/2$ yarıçaplı çember</div><div class="step-detail">$\\gamma(t) = 2 + \\tfrac{1}{2} e^{i t}$, $\\gamma'(t) = \\tfrac{i}{2} e^{i t}$. İntegral şu olur: $\\displaystyle \\int_0^{2\\pi} \\frac{1}{2 + \\tfrac{1}{2} e^{i t}} \\cdot \\tfrac{i}{2} e^{i t}\\, dt$. İntegrand artık sınırlı ($1/z$ bu çevrimde asla patlamaz) ve doğrudan bir hesap (ya da 4. bölümde Cauchy teoremine başvurma) $0$ verir. Çevrim tekilliği sarmadı ve dolayısıyla integral sıfıra çöker.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">$1/z$'NİN YOLA BAĞIMLILIĞI</div><div class="formula-main">$$\\oint_{|z| = r} \\frac{dz}{z} = 2\\pi i \\quad \\text{(her } r > 0 \\text{)}, \\qquad \\oint_C \\frac{dz}{z} = 0 \\quad \\text{(} C \\text{ } 0 \\text{'ı sarmıyor)}$$</div><div class="formula-sub">Cevap, tekilliğin çevrimin içinde olup olmadığına bağlıdır, çevrimin tam şekline değil. Bu, tüm artık hesabının prototipidir; 5. bölüm bunu Cauchy integral formülü olarak paketler.</div></div>

<div class="calc-graph"><div id="plot-l4-1overz-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> düzlemde iki kontur. Mavi kontur birim çember; $1/z$'nin orjindeki tekilliğini sarar — integral $2\\pi i$ değerinde. Amber kontur $z = 2$ merkezli $0.5$ yarıçaplı küçük çember; orjini sarmaz — integral $0$ değerinde. Resim yola bağımlılık ifadesinin geometrik içeriği: tekilliği olan bir fonksiyonun integrali yalnızca çevrimin tekilliğin etrafına sarılıp sarılmadığını görür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var inc_x=[],inc_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;inc_x.push(Math.cos(th));inc_y.push(Math.sin(th));}
var enc={x:inc_x,y:inc_y,mode:'lines',name:'birim çember — 0 sarılı, integral = 2πi',line:{color:'#3b82f6',width:2.4},fill:'toself',fillcolor:'rgba(59,130,246,0.10)'};
var ex_x=[],ex_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;ex_x.push(2+0.5*Math.cos(th));ex_y.push(0.5*Math.sin(th));}
var nonenc={x:ex_x,y:ex_y,mode:'lines',name:'z=2 çemberi — 0 dışta, integral = 0',line:{color:'#f59e0b',width:2.4},fill:'toself',fillcolor:'rgba(245,158,11,0.10)'};
var sing={x:[0],y:[0],mode:'markers+text',marker:{size:14,color:'#ef4444',symbol:'x'},text:['tekillik z=0'],textposition:'bottom right',textfont:{color:'#fca5a5',size:11},name:'tekillik z=0',showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.8,3.2],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.6,1.6]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l4-1overz-tr',[enc,nonenc,sing],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$\\oint dz/z$ integralini orjin merkezli yarı-eksenleri $3$ ve $5$ olan bir elips etrafında hesaplasaydın ne alırdın? (Cevap: $2\\pi i$ — şekil önemli değil, sadece çevrimin tekilliği sarıp sarmadığı.) Çevrim orjinin etrafına iki kez sarılırsa? (Cevap: $4\\pi i$ — cevap, net saat-yönünün-tersi dönme sayısını sayan tam sayı dolanma sayısıyla ölçeklenir.)</div></div>

<h2 class="lesson-title">4. Cauchy Teoremi ve Green-Formülü İspatı</h2>

<div class="calc-highlight"><strong>Cauchy-Riemann'ın integral karşılığı.</strong> 3. bölüm netleştirdi ki kapalı çevrim integrali ile sıfır değeri arasında duran tek şey çevrimin içindeki tekilliklerin varlığı. Cauchy teoremi bunu kesinleştirir: $f$ kapalı bir konturda ve içinde holomorf ise, yolda tekillik yoksa, integral sıfırlanır. İspat bir paragraflık Green teoremi uygulamasıdır; Cauchy-Riemann denklemleri Green integrandını sıfıra çöktüren cebirsel özdeşliklerdir.</div>

<div class="calc-formula"><div class="formula-label">CAUCHY İNTEGRAL TEOREMİ</div><div class="formula-main">$$\\text{Eğer } f, \\text{ basit-bağlı } D \\text{ bölgesinde holomorf ve } \\gamma \\subset D \\text{ kapalı kontursa, } \\oint_\\gamma f(z)\\, dz = 0.$$</div><div class="formula-sub">"Basit-bağlı" zorunlu — konturun bölgedeki bir delik etrafında dolanmasını yasaklar. $D$'de delikler varsa (örneğin $1/z$ için $\\mathbb{C} \\setminus \\{0\\}$), sonuç başarısız olabilir.</div></div>

<p class="l-text"><strong>Green teoremi üzerinden ispat taslağı.</strong> Gerçel Green teoremini hatırla: basit kapalı eğri $\\gamma$ ile sınırlı $\\Omega$ bölgesinin kapanışında sürekli türevlenebilir $P$, $Q$ için (saat-yönünün-tersi yönlü),</p>

<div class="calc-formula"><div class="formula-label">GREEN TEOREMİ</div><div class="formula-main">$$\\oint_\\gamma (P\\, dx + Q\\, dy) \\;=\\; \\iint_\\Omega \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dA$$</div><div class="formula-sub">Analizin temel teoreminin gerçel iki boyutlu versiyonu: kapalı çevrim etrafındaki çizgi integrali, sarılan bölge üzerinde curl-benzeri çift integrale eşit.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Kontur integralini gerçel kısımlara ayır</div><div class="step-detail">1. bölümden, $\\oint_\\gamma f\\, dz = \\oint_\\gamma (u\\, dx - v\\, dy) + i \\oint_\\gamma (v\\, dx + u\\, dy)$. İki gerçel çizgi integrali.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Her birine Green teoremini uygula</div><div class="step-detail">İlki için $P = u$, $Q = -v$, alan integrandı $-v_x - u_y$ olur. İkincisi için $P = v$, $Q = u$, alan integrandı $u_x - v_y$ olur. Birleştirince: $\\oint_\\gamma f\\, dz = -\\iint_\\Omega (v_x + u_y)\\, dA + i \\iint_\\Omega (u_x - v_y)\\, dA$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Cauchy-Riemann'a başvur</div><div class="step-detail">$f$ holomorf, dolayısıyla $u_x = v_y$ (sanal integrand sıfırlanır) ve $u_y = -v_x$ (gerçel integrand sıfırlanır). Her iki çift integral $\\Omega$'da özdeşçe sıfır. Kapalı çevrim integrali sıfır.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">CAUCHY-RIEMANN SONUCU BEDAVA VERİR</div><div class="formula-main">$$\\oint_\\gamma f\\, dz \\;=\\; -\\iint_\\Omega \\underbrace{(v_x + u_y)}_{=\\,0 \\text{ CR'dan}}\\, dA \\;+\\; i \\iint_\\Omega \\underbrace{(u_x - v_y)}_{=\\,0 \\text{ CR'dan}}\\, dA \\;=\\; 0$$</div><div class="formula-sub">Cauchy-Riemann denklemleri, Green teoremini Cauchy teoremine dönüştüren cebirsel özdeşliklerin ta kendileridir. İntegral teoremi, Cauchy-Riemann denklemlerinin integre edilmiş halidir.</div></div>

<p class="l-text"><strong>Uyarılar.</strong> Yukarıdaki ispat $u_x, u_y, v_x, v_y$'in sürekli olduğunu sessizce kabul etti ki Green teoremi uygulansın. Goursat'nın iyileştirmesi (1900) bu hipotezi daha uzun bir üçgen-bölme ispatı karşılığında kaldırır. Tüm pratik amaçlar için — ve elbette dersin geri kalanı boyunca — kullandığımız sürekli-türevler versiyonu.</p>

<div class="l-note"><strong>Basit-bağlı neden önemli.</strong> $D$'de bir delik varsa, $\\gamma$ ile çevrelenen $\\Omega$ bölgesi $f$'in tanımlı olmadığı noktaları içerebilir. O zaman Green teoremi doğrudan uygulanmaz. Standart örnek: $D = \\mathbb{C} \\setminus \\{0\\}$ üzerinde $f(z) = 1/z$: birim çember $D$'de kapalı bir konturdur, ama çevrelediği disk $D$'de değildir (orjin eksik). Dolayısıyla Cauchy teoremi uygulanmaz ve gerçekten de integral $2\\pi i$'dir, sıfır değil.</div>

<h2 class="lesson-title">5. Kontur Deformasyonu</h2>

<div class="calc-highlight"><strong>Cauchy teoreminin bize verdiği özgürlük.</strong> İki kontur bir tekilliği geçmeden sürekli olarak birbirine deforme edilebiliyorsa, aynı integrali verirler. Garip bir konturu basit bir konturla değiştirmekte özgürüz — örneğin bir tekilliğin etrafındaki küçük bir çemberle — ve integrali daha basit şekil üzerinde hesaplarız. L5'in artık teoremini pratik bir araç haline getiren iş gören tekniktir bu.</div>

<div class="calc-formula"><div class="formula-label">DEFORMASYON DEĞİŞMEZLİĞİ</div><div class="formula-main">$$\\gamma_1 \\simeq \\gamma_2 \\text{ } D \\setminus \\{\\text{tekillikler}\\} \\text{ içinde} \\;\\Longrightarrow\\; \\oint_{\\gamma_1} f\\, dz \\;=\\; \\oint_{\\gamma_2} f\\, dz$$</div><div class="formula-sub">Burada $\\simeq$ homotopiyi gösterir: deformasyon boyunca holomorfluk bölgesinde kalan, $\\gamma_1$'i $\\gamma_2$'ye bağlayan sürekli bir kontur ailesi.</div></div>

<p class="l-text"><strong>Bunun neden doğru olduğu.</strong> $\\gamma_1$ ile $\\gamma_2$ arasındaki halka bölgeyi düşün (kesinlik için $\\gamma_2$'nin $\\gamma_1$'in içinde olduğunu kabul et). O bölgenin sınırı, içerisi solda kalacak şekilde yönlendirildiğinde $\\gamma_1$ eksi $\\gamma_2$ olur (iç çevrim ters yönde gider). $f$ bu halka bölge üzerinde holomorftur ve bu bölge, iki sınır çevrimini bağlayan bir "kesik" ile basit-bağlı hale gelir. Kesik bölgede Cauchy teoremi $\\oint_{\\gamma_1} f - \\oint_{\\gamma_2} f = 0$ verir, dolayısıyla iki integral eşittir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pratik reçete</div><div class="card-body">$\\oint_\\gamma f\\, dz$'yi hesaplamak için $\\gamma$ içindeki tekillikleri bul, $\\gamma$'yı her tekilliğin etrafındaki küçük çemberlerle değiştir, her çember üzerindeki integrali ayrı ayrı hesapla, topla.</div></div>
<div class="calc-card"><div class="card-title">Yıldız-şekilli kısa yol</div><div class="card-body">$\\gamma$ $z_0$'da tek bir tekilliği sarıyorsa, $\\gamma$'yı $z_0$ merkezli $\\varepsilon$ yarıçaplı bir çembere deforme et, parametrele ve sonuçtaki tek boyutlu integrali hesapla.</div></div>
<div class="calc-card"><div class="card-title">Çoklu tekillikler</div><div class="card-body">Birden çok sarılı tekillik için $\\gamma$'yı her tekilliği küçük bir çemberle saran "pantolon paçası" şekline deforme et. Toplam integral, küçük çemberlerden gelen katkıların toplamı.</div></div>
<div class="calc-card"><div class="card-title">Dolanma sayısı</div><div class="card-body">$n(\\gamma, z_0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{dz}{z - z_0}$ tam sayısı $\\gamma$'nın $z_0$ etrafında saat-yönünün-tersi yönünde kaç kez sarıldığını sayar. Basit çevrimler için $0$ veya $1$'dir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l4-deform-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> dairesel olmayan bir kontur $\\gamma$ (mavi, hafifçe sıkıştırılmış çevrim) ve orjindeki tekilliğin etrafında küçük bir dairesel kontur $\\gamma'$ (amber). İkisi $\\mathbb{C} \\setminus \\{0\\}$'da homotopiktir — birini diğerine tekilliği hiç dokunmadan deforme edebilirsin. Deformasyon ilkesiyle, $\\oint_\\gamma dz/z = \\oint_{\\gamma'} dz/z = 2\\pi i$, dış kıvrılmış şekilden bağımsız.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var wig_x=[],wig_y=[];for(var i=0;i<=300;i++){var th=2*Math.PI*i/300;var r=1.5+0.4*Math.cos(3*th)+0.2*Math.sin(5*th);wig_x.push(r*Math.cos(th));wig_y.push(r*Math.sin(th));}
var outer={x:wig_x,y:wig_y,mode:'lines',name:'γ — kıvrılmış dış kontur',line:{color:'#3b82f6',width:2.4}};
var inn_x=[],inn_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;inn_x.push(0.35*Math.cos(th));inn_y.push(0.35*Math.sin(th));}
var inner={x:inn_x,y:inn_y,mode:'lines',name:"γ' — 0 etrafında küçük çember",line:{color:'#f59e0b',width:2.4}};
var arr=[];for(var k=0;k<8;k++){var th=2*Math.PI*k/8;var r1=1.5+0.4*Math.cos(3*th)+0.2*Math.sin(5*th);var x1=r1*Math.cos(th),y1=r1*Math.sin(th);var x2=0.35*Math.cos(th),y2=0.35*Math.sin(th);arr.push({x:[x1,x2],y:[y1,y2],mode:'lines',line:{color:'rgba(156,163,175,0.4)',width:1,dash:'dot'},showlegend:(k===0),name:'homotopi yolları'});}
var sing={x:[0],y:[0],mode:'markers+text',marker:{size:14,color:'#ef4444',symbol:'x'},text:['z=0'],textposition:'top right',textfont:{color:'#fca5a5',size:11},name:'tekillik',showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2.4,2.4],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-2.4,2.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l4-deform-tr',[outer,inner,sing].concat(arr),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — PRATİKTE DEFORMASYON</div><div class="example-body">$\\displaystyle \\oint_\\gamma \\frac{dz}{(z-1)(z-2)}$'yi hesapla; burada $\\gamma$ köşeleri $\\pm 3 \\pm 3i$ olan dikdörtgen.<br><br>İntegrandın $z = 1$ ve $z = 2$'de tekillikleri var, ikisi de dikdörtgenin içinde. $\\gamma$'yı $1$ etrafında küçük çember $C_1$ ve $2$ etrafında küçük çember $C_2$ olarak deforme et. Kısmi kesirlerle, $\\frac{1}{(z-1)(z-2)} = \\frac{1}{z-2} - \\frac{1}{z-1}$.<br><br>$1$ etrafındaki $C_1$'de: $\\oint_{C_1} \\frac{dz}{z-2}$, $1/(z-2)$'nin holomorf olduğu $1$ etrafındaki küçük çevrim üzerindedir ($2$ $C_1$'in dışında). Cauchy teoremiyle bu integral $0$. İkinci parça, $-\\oint_{C_1} \\frac{dz}{z-1} = -2\\pi i$ (kanonik örnek $1$ kadar kaydırılmış). $C_1$ üzerinde toplam: $-2\\pi i$.<br><br>$2$ etrafındaki $C_2$'de: $\\oint_{C_2} \\frac{dz}{z-2} = 2\\pi i$ ve $\\oint_{C_2} \\frac{dz}{z-1} = 0$ ($1$ $C_2$'in dışında). $C_2$ üzerinde toplam: $2\\pi i$.<br><br>Toplam: $-2\\pi i + 2\\pi i = 0$. Dikdörtgen integrali sıfır. İki tekillik tam olarak birbirini götürür.</div></div>

<h2 class="lesson-title">6. Cauchy İntegral Formülü</h2>

<div class="calc-highlight"><strong>Karmaşık analizdeki en şaşırtıcı formül.</strong> $f$ kapalı bir kontur $\\gamma$ üzerinde ve içinde holomorfsa, $f$'in herhangi bir iç nokta $z_0$'daki değeri $f$'in $\\gamma$ sınırı üzerindeki belirli bir integraliyle verilir. Sözle: bir bölgedeki holomorf fonksiyonun değerleri, bölgenin sınırındaki değerleri tarafından tamamen belirlenir. Gerçel değişkende karşılığı yok.</div>

<div class="calc-formula"><div class="formula-label">CAUCHY İNTEGRAL FORMÜLÜ</div><div class="formula-main">$$f(z_0) \\;=\\; \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz$$</div><div class="formula-sub">$f$, $\\gamma$ ve içini içeren bir bölgede holomorf, $\\gamma$ basit kapalı ve saat-yönünün-tersi, $z_0$ kesinlikle $\\gamma$'nın içindeyse geçerli.</div></div>

<p class="l-text"><strong>Türetme.</strong> $f$'in $\\gamma$ ve onun sınırladığı kapalı diski içeren bir bölgede holomorf olduğu varsayımıyla başla. Yardımcı fonksiyon $g(z) = \\frac{f(z) - f(z_0)}{z - z_0}$'ı düşün. Bu, $z_0$ haricinde holomorftur ve ($f$ $z_0$'da türevlenebilir olduğundan) $z \\to z_0$ limiti $f'(z_0)$'dur, dolayısıyla $g$ $z_0$ yakınında sınırlıdır. Riemann kaldırılabilir-tekillik kriteriyle, $g$ tüm bölgede holomorf bir fonksiyona genişler.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$g$'ye Cauchy teoremini uygula</div><div class="step-detail">$\\oint_\\gamma g\\, dz = \\oint_\\gamma \\frac{f(z) - f(z_0)}{z - z_0}\\, dz = 0$, çünkü $g$ $\\gamma$ ile sınırlı basit-bağlı bölgede holomorftur.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İntegrandı ayır</div><div class="step-detail">$0 = \\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz - f(z_0) \\oint_\\gamma \\frac{dz}{z - z_0}$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">İkinci integrali hesapla</div><div class="step-detail">Deformasyonla, $\\oint_\\gamma \\frac{dz}{z - z_0}$, $z_0$ etrafındaki herhangi küçük çember üzerindeki aynı integrale eşit, o da $2\\pi i$ (kanonik örnek $z_0$'a kaydırılmış).</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Yeniden düzenle</div><div class="step-detail">$\\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz = f(z_0) \\cdot 2\\pi i$, dolayısıyla $f(z_0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz$.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ortalama değer özelliği</div><div class="card-body">$z_0$ merkezli $r$ yarıçaplı çembere özelleştirip $z = z_0 + r e^{i t}$ olarak parametrelersen $f(z_0) = \\frac{1}{2\\pi} \\int_0^{2\\pi} f(z_0 + r e^{i t})\\, dt$ elde edersin: $f$'in merkezdeki değeri sınır çemberindeki ortalamasına eşit. Harmonik fonksiyonların paylaştığı bir özellik.</div></div>
<div class="calc-card"><div class="card-title">Holomorf = analitik</div><div class="card-body">Yakın bir taban nokta $a$ için $1/(z - z_0)$'ı $(z_0 - a)/(z - a)$ kuvvetlerinin geometrik serisi olarak açıp Cauchy formülüne yerleştirmek, $f$'in $a$ etrafında bir kuvvet serisi gösterimini verir. Bu, L3'ün holomorfun analitiği içerdiği iddiası, şimdi kanıtlandı.</div></div>
<div class="calc-card"><div class="card-title">Liouville</div><div class="card-body">Formülü büyük yarıçaplı $R$ çemberine uygulamak, $|f| \\le M$ (sınırlılık) ve çemberin uzunluğunu kullanarak $|f'(z_0)| \\le M/R$ verir, ki $R \\to \\infty$ olarak sıfıra gider. Dolayısıyla $f' \\equiv 0$ ve $f$ sabittir. Bu, L3'te ifade edilen Liouville teoreminin ispatı.</div></div>
<div class="calc-card"><div class="card-title">Schwarz yansıması, maksimum modülüs, ...</div><div class="card-body">Formülden bütün bir teorem kataloğu akar. $f$'in ve tüm türevlerinin integral gösterimi sınır verisi cinsinden eline geçince, yapısal katılık analitik jimnastikle takip eder.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — $f(z) = z^2 + 3$ İÇİN $f(0)$'I GERİ KAZANMAK</div><div class="example-body">$f$ tamdır, dolayısıyla birim çember $\\gamma$'da integral formülünü uygula: $f(0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{z^2 + 3}{z}\\, dz$.<br><br>Doğrudan hesap: $z = e^{i t}$, $dz = i e^{i t} dt$ olarak parametrele. İntegrand şu olur: $\\frac{e^{2 i t} + 3}{e^{i t}} \\cdot i\\, e^{i t}\\, dt = i (e^{2 i t} + 3)\\, dt$. $0$'dan $2\\pi$'ye entegrele: $i \\int_0^{2\\pi} e^{2 i t}\\, dt + 3 i \\int_0^{2\\pi} dt = i \\cdot 0 + 3 i \\cdot 2\\pi = 6 \\pi i$.<br><br>$2\\pi i$'ye böl: $f(0) = 6 \\pi i / (2 \\pi i) = 3$.<br><br>Doğrudan kontrol: $f(0) = 0^2 + 3 = 3$. Formül, $f$'in çemberin merkezindeki değerini sınırdaki değerlerin bir toplamından yeniden üretir.</div></div>

<div class="calc-graph"><div id="plot-l4-cif-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $z$-düzleminde bir birim çember $\\gamma$ (mavi) ve bir iç nokta $z_0 = 0.4 + 0.2 i$ (amber işaretçi). Cauchy integral formülü diyor ki: sınırdaki $f(z)$ değerlerini al, her birini $1/(z - z_0)$ ile ağırlıkla, çevrim etrafında integre et ve $2\\pi i$'ye böl. Aldığın sayı tam olarak $f(z_0)$. İki ok, formülün her sınır değerini katkıda bulunan bir ses olarak gördüğünü vurguluyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var c_x=[],c_y=[];for(var i=0;i<=200;i++){var th=2*Math.PI*i/200;c_x.push(Math.cos(th));c_y.push(Math.sin(th));}
var circ={x:c_x,y:c_y,mode:'lines',name:'γ — sınır çemberi',line:{color:'#3b82f6',width:2.4}};
var z0={x:[0.4],y:[0.2],mode:'markers+text',marker:{size:12,color:'#f59e0b',symbol:'circle'},text:['z₀ = 0.4 + 0.2i'],textposition:'bottom right',textfont:{color:'#fcd34d',size:11},name:'iç nokta z₀'};
var arrows=[];var angs=[0,Math.PI/3,2*Math.PI/3,Math.PI,4*Math.PI/3,5*Math.PI/3];for(var k=0;k<angs.length;k++){var th=angs[k];arrows.push({x:[Math.cos(th),0.4],y:[Math.sin(th),0.2],mode:'lines',line:{color:'rgba(168,139,250,0.45)',width:1.2,dash:'dot'},showlegend:(k===0),name:'sınır → iç ağırlıklandırma'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.4,1.4],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.20)',range:[-1.4,1.4]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l4-cif-tr',[circ,z0].concat(arrows),layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Sınır-içeriyi-yönetir ilkesi.</strong> Gerçel analizde bir aralığın iç kısmındaki düzgün bir fonksiyon, uç noktalardaki değerleri tarafından hiç de belirlenmez — sonsuz sayıda düzgün ara değer vardır. Karmaşık analizde bir bölgenin iç kısmındaki holomorf bir fonksiyon, bölgenin sınırındaki değerleri tarafından <em>tamamen</em> belirlenir. Karmaşık analizin aynı veriyle gerçel analizden "daha fazla bildiği" tam olarak budur.</div>

<h2 class="lesson-title">7. Türevler için Genelleştirilmiş Formül</h2>

<div class="calc-highlight"><strong>İntegral formülü vermeye devam ediyor.</strong> Cauchy integral formülünün iki tarafını da $z_0$'a göre türevlemek, paydanın $(z - z_0)$'nun daha yüksek bir kuvveti olduğu aynı formülü üretir. Tekrarlamak, $f$'in $z_0$'daki her türevi için sınır integrali cinsinden bir formül verir. Yalnızca $f(z_0)$ değil, $f', f'', \\dots, f^{(n)}, \\dots$'in hepsi sınır verisi tarafından belirlenir, aynı integral ardışık olarak daha yüksek karşılıklara karşı hesaplanır.</div>

<div class="calc-formula"><div class="formula-label">TÜREVLER İÇİN CAUCHY FORMÜLÜ</div><div class="formula-main">$$f^{(n)}(z_0) \\;=\\; \\frac{n!}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^{n+1}}\\, dz$$</div><div class="formula-sub">Her $n \\ge 0$ için, orijinal Cauchy formülüyle aynı hipotezler altında. Sağ taraf, $n$ kez uygulanan integral altında türevlemedir ve sınır integrali her zaman yakınsar çünkü integrand $\\gamma$ üzerinde sınırlı kalır.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Cauchy integral formülünü $z_0$'a göre türevle</div><div class="step-detail">$\\frac{d}{d z_0} \\frac{1}{z - z_0} = \\frac{1}{(z - z_0)^2}$. Dolayısıyla $f'(z_0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^2}\\, dz$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Tekrar türevle</div><div class="step-detail">$\\frac{d}{d z_0} \\frac{1}{(z - z_0)^2} = \\frac{2}{(z - z_0)^3}$. Dolayısıyla $f''(z_0) = \\frac{2}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^3}\\, dz = \\frac{2!}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^3}\\, dz$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Tümevarım yap</div><div class="step-detail">$n$ kez türevleme sonrasında payda $(z - z_0)^{n+1}$ taşır ve önceki katsayı $n!$ biriktirir. Örüntü ifade edilen formüldür.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Hayati sonuç</div><div class="step-detail">$f$ holomorf, $\\gamma$'nın iç kısmında her dereceden türeve sahip olduğu anlamına gelir. Yani bir kez türevlenebilirlik, sonsuz türevlenebilirliği ima eder. Bu, holomorf = analitik'in integral tarafındaki ispatı.</div></div></div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cauchy tahminleri</div><div class="card-body">Türev formülünü sınırlamak $|f^{(n)}(z_0)| \\le n! M / R^n$ verir; burada $M = \\max_{|z - z_0| = R} |f(z)|$. $1/R^n$ faktörü türevlerin büyümesini kontrol eder ve birçok katılık sonucunun kaynağıdır.</div></div>
<div class="calc-card"><div class="card-title">Taylor katsayı formülü</div><div class="card-body">$f$'in $z_0$'daki $n$. Taylor katsayısı tam olarak $\\frac{f^{(n)}(z_0)}{n!} = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^{n+1}}\\, dz$. Yani Taylor katsayılarının kendileri sınır integralleridir.</div></div>
<div class="calc-card"><div class="card-title">Sayısal kullanım</div><div class="card-body">Sağ tarafta kuadratür, karmaşık holomorf fonksiyonların yüksek mertebeli türevlerini hesaplamak için kararlı bir yoldur — sonlu farklar gürültüyü meşhur şekilde büyütür, sınır integrali ise ortalama alır.</div></div>
<div class="calc-card"><div class="card-title">Kuvvet serisi</div><div class="card-body">$f(z) = \\sum_{n \\ge 0} \\frac{f^{(n)}(z_0)}{n!} (z - z_0)^n$ serisi, $f$'in holomorf kaldığı $z_0$ etrafındaki en büyük açık diskte yakınsar.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK — İNTEGRAL FORMÜLÜYLE $f(z) = \\sin z$ İÇİN $f^{(3)}(0)$</div><div class="example-body">$\\sin z$ tamdır; $\\gamma$ = birim çember kullan.<br><br>$f^{(3)}(0) = \\frac{3!}{2 \\pi i} \\oint_\\gamma \\frac{\\sin z}{z^4}\\, dz$. İntegrand $0$'da $4$. mertebeden bir kutba sahiptir. $\\sin z$'nin Taylor açılımı $z - z^3/6 + z^5/120 - \\cdots$, dolayısıyla $\\sin z / z^4 = 1/z^3 - 1/(6 z) + z/120 - \\cdots$. Birim çember üzerinde integrali sıfırdan farklı olan tek terim $1/z$ terimidir (kanonik örnekten). Katsayı $-1/6$, dolayısıyla $\\oint \\sin z / z^4 \\, dz = -1/6 \\cdot 2\\pi i = -\\pi i / 3$.<br><br>Dolayısıyla $f^{(3)}(0) = 6 / (2\\pi i) \\cdot (-\\pi i / 3) = -1$. Doğrudan kontrol: $\\sin z$'nin Taylor serisi $z - z^3/6 + \\cdots$, dolayısıyla $f^{(3)}(0) = -1$ (z³ katsayısı $3! = 6$ ile çarpıldığında, işaret $-1/6 \\cdot 6 = -1$). Sınır integrali Taylor katsayısını yeniden üretir.</div></div>

<h2 class="lesson-title">8. Maksimum Modülüs İlkesi</h2>

<div class="calc-highlight"><strong>Ortalama değer özelliğinin doğrudan bir sonucu.</strong> $f(z_0)$, $z_0$ etrafındaki her küçük çember üzerinde $f$'in ortalaması olduğundan, $|f|$ bir bölgenin iç kısmında bir yerel maksimuma ulaşsaydı, çevreleyen çemberlerdeki tüm değerler en fazla o maksimumda olmak zorunda kalırdı ve ortalamada tam olarak ona eşit — $|f|$'yi yerel olarak sabit olmaya zorlayan. Bir bağlılık argümanı "yerel olarak sabit"i "bağlı bileşenin tamamında sabit"e genişletir. Kontrapozitif maksimum modülüs ilkesidir: sabit olmayan bir holomorf fonksiyon, tanım kümesinin iç kısmında $|f|$'in maksimumuna asla ulaşmaz.</div>

<div class="calc-formula"><div class="formula-label">MAKSİMUM MODÜLÜS İLKESİ</div><div class="formula-main">$$\\text{Eğer } f, \\text{ sınırlı bir } \\Omega \\text{ bölgesinde holomorf ve } \\overline{\\Omega} \\text{ üzerinde sürekliyse, } \\max_{\\overline{\\Omega}} |f|, \\text{ } \\partial \\Omega \\text{ sınırında ulaşılır.}$$</div><div class="formula-sub">Ya maksimum sınırda, ya da $f$ sabit. Üçüncü seçenek yok. İç kısım, fonksiyon dejenere olmadıkça $|f|$'in zirvesini barındıramaz.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Minimum modülüs</div><div class="card-body">Benzer bir ifade: $f$'in $\\Omega$'da sıfırı yoksa, $\\min |f|$ de sınırda ulaşılır ($1/f$'e maksimum modülüsü uygula). İçteki sıfırlar, $|f|$'in herhangi bir sınır değerinden daha aşağı düşmesine izin verir.</div></div>
<div class="calc-card"><div class="card-title">Teklik kaldıracı</div><div class="card-body">İki holomorf $f, g$ fonksiyonu $\\Omega$'nın sınırında uyuşuyorsa, $|f - g|$ maksimumuna $\\partial \\Omega$'da ulaşır, orada sıfırdır. Dolayısıyla $f - g \\equiv 0$ $\\Omega$'da. Sınır eşitliği iç eşitliği zorlar — "holomorf"a bağlanınca sınır kaderdir.</div></div>
<div class="calc-card"><div class="card-title">Schwarz lemması</div><div class="card-body">$f(0) = 0$ ve $|f(z)| \\le 1$ olan birim diskte holomorf $f$ için, maksimum modülüs argümanı $|f(z)| \\le |z|$'yi her yerde ve $|f'(0)| \\le 1$'i verir, eşitlik yalnızca dönmeler $f(z) = e^{i \\theta} z$ için. Temel bir katılık ifadesi.</div></div>
<div class="calc-card"><div class="card-title">Açık dönüşüm teoremi</div><div class="card-body">Sabit olmayan bir holomorf dönüşüm açık kümeleri açık kümelere gönderir. (Maksimum modülüs üzerinden) iç noktaların zirve-modülüs noktaları olamayacağı ifadesine eşdeğer.</div></div>
</div>

<div class="calc-graph"><div id="plot-l4-maxmod-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Yüzeyin gösterdiği:</strong> birim disk $|z| \\le 1$ üzerinde $f(z) = z^2 + 1$ için $|f(z)|$ modülüsü. Yüzey düzgün bir kase şeklindedir; kapalı disk üzerindeki en büyük değeri herhangi bir iç noktada değil sınır çemberinde yaşar. Somut olarak, merkezde $|f(0)| = 1$, ama sınır $|z| = 1$ üzerinde $|z^2 + 1|$ maksimumu $z = \\pm 1$'de $2$'ye ulaşır. Maksimum modülüs ilkesi piksel halinde: zirve kenarda oturur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=50;var xs=[],ys=[];var zs=[];
for(var i=0;i<N;i++){xs.push(-1+2*i/(N-1));ys.push(-1+2*i/(N-1));}
for(var j=0;j<N;j++){var row=[];for(var i=0;i<N;i++){var x=xs[i],y=ys[j];if(x*x+y*y>1.0001){row.push(null);}else{var u=x*x-y*y+1;var v=2*x*y;row.push(Math.sqrt(u*u+v*v));}}zs.push(row);}
var surf={type:'surface',x:xs,y:ys,z:zs,colorscale:[[0,'#1e3a8a'],[0.5,'#3b82f6'],[1,'#fef3c7']],showscale:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'Re(z)',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},yaxis:{title:'Im(z)',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},zaxis:{title:'|f(z)| = |z² + 1|',backgroundcolor:'#0a0a0a',gridcolor:'rgba(255,255,255,0.10)'},camera:{eye:{x:1.7,y:1.7,z:1.1}}},margin:{t:20,r:0,b:0,l:0}};
Plotly.newPlot('plot-l4-maxmod-tr',[surf],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Neden bu sananın kadar kolay değil.</strong> Gerçel fonksiyonların kesinlikle iç maksimumları olabilir — $[-1, 1]$ üzerinde $f(x) = 1 - x^2$'yi düşün, içteki $0$'da zirve yapıyor. Maksimum modülüs ilkesi yalnızca karmaşık olan bir ifadedir; mutlak değerleri aracılığıyla konuşan holomorf fonksiyonların katılığıdır. Ortalama değer özelliği yerel mekanizmadır; analitik devam küresel gücü sağlar.</div>

<h2 class="lesson-title">9. Klasik Uygulamalar</h2>

<p class="l-text">Bu dersin integral teoremleri soyut süs değildir. Birkaç klasik mühendislik matematiği ve fizik alt alanının iş gören makineleridir. Hepsi aynı üçlüyü (Cauchy teoremi, integral formülü, maksimum modülüs) araç olarak kullanan birkaç uygulama kümesi listeleyelim.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2-B potansiyel teorisi</div><div class="card-body">Holomorf bir fonksiyonun gerçel ve sanal kısımları harmoniktir (L3, 7. bölüm). Dolayısıyla Cauchy formülü, 2-B Laplace denklemi $\\Delta u = 0$ çözümleri için bir sınır integral gösterimi verir. Diskte Poisson integral formülünün ve Dirichlet probleminin temelidir.</div></div>
<div class="calc-card"><div class="card-title">Elektrostatik</div><div class="card-body">İki boyutta elektrik potansiyeli, yüklerden uzakta Laplace denklemini sağlar. Sınır koşulları (örneğin iletken yüzeyde sabit potansiyel) artı maksimum modülüs ilkesi alanı tek olarak belirler. Silindirler, kenarlar ve köşeler içeren konfigürasyonlar karmaşık değişken yöntemleriyle saldırılır.</div></div>
<div class="calc-card"><div class="card-title">İdeal akışkan akışı</div><div class="card-body">Sıkıştırılamaz, rotasyonsuz 2-B akış, akış bölgesinde holomorf karmaşık bir potansiyel $w(z) = \\phi + i \\psi$'a sahiptir; burada $\\phi$ hız potansiyeli, $\\psi$ akım fonksiyonudur. Cauchy teoremi kapalı eğriler etrafındaki sirkülasyonu verir; deformasyon Kutta-Joukowski kaldırma formülünü verir.</div></div>
<div class="calc-card"><div class="card-title">Kanat profili tasarımı</div><div class="card-body">Joukowski dönüşümü $w = z + 1/z$, bir çemberi bir kanat profili şekline eşler; çember etrafındaki akışa uygulanan Cauchy formülleri kanat profili etrafındaki akışı verir. Kaldırma katsayıları ilk olarak böyle hesaplandı ve standart sergi alıştırması olarak kalmaya devam ediyor.</div></div>
<div class="calc-card"><div class="card-title">Sinyal işleme</div><div class="card-body">Fourier dönüşümü gerçel doğru üzerinde bir kontur integralidir; Laplace dönüşümü konturu karmaşık düzleme genişletir. Ters formülleri (Bromwich integralleri) dikey doğrular üzerinde kontur integralleridir ve dönüşümün analitikliği altta yatan sistemlerin nedenselliğini ve kararlılığını kodlar.</div></div>
<div class="calc-card"><div class="card-title">Artıklar yoluyla belirli gerçel integraller</div><div class="card-body">Gerçel doğru üzerinde garip integrandlı, has olmayan birçok belirli integral, bir kontur integrali hilesine yenilir: konturu üst yarı düzlemde kapat, Cauchy teoremi / artık hesabını uygula ve gerçel integrali artıkların toplamı olarak oku. L5 bunu sistematik olarak geliştirir.</div></div>
</div>

<div class="l-note"><strong>Modern bağlantı üzerine kısa bir paragraf.</strong> Fizik bilgili sinir ağları (PINN'ler), KDD'leri — Laplace denklemi dahil — örneklenen noktalarda diferansiyel operatörünün kalıntısını cezalandırarak çözer. Holomorf fonksiyonların gerçel kısımları olarak ortaya çıkan harmonik fonksiyonlar tam olarak 2-B Laplace çözümleridir ve bu dersin Cauchy formülleri, eğitilmiş ağlar için referans değer veya kıyas olarak kullanılabilecek kapalı formlu bir sınır integral gösterimi sağlar. Yeni yöntemler için akıl sağlığı kontrolü olarak şimdi kullanılan aynı klasik makinedir.</div>

<h2 class="lesson-title">10. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynayacakların.</strong> $f(z) = z^2 + 3$'ü $f(z) = e^z$, $\\cos z$ veya herhangi bir polinomla değiştir — kurtarılan değerler hala uyuşmalı. Birim çemberi $2$ yarıçaplı bir çemberle değiştir ve kurtarmanın hala çalıştığını doğrula (integral formülü yarıçapı umursamaz, yalnızca $z_0$'ın içeride kalması). Cauchy teoremi başarısızlık modunu araştır: $f(z) = 1/z$'yi geç ve $z_0 = 0$'da Cauchy formülü değerinin anlamsız olduğunu gözlemle çünkü integrandın integrasyon yolu içinde bir kutbu var. $0$ merkezli $3$ yarıçaplı çember üzerinde çözülmüş örnek $\\oint_\\gamma dz / ((z-1)(z-2)) = 0$'ı yeniden üret — iki tekillik tam olarak birbirini götürür.</p>

<h2 class="lesson-title">11. Özet — Artık Yapabildiklerin</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kontur integrali</div><div class="card-body">Karmaşık integrandlı yol-farkındalıklı integral. $\\int f(\\gamma(t)) \\gamma'(t)\\, dt$ üzerinden tek değişkenli integrale indirgenir.</div><div class="card-formula">$\\int_\\gamma f\\, dz$</div></div>
<div class="calc-card"><div class="card-title">$1/z$'nin yola bağımlılığı</div><div class="card-body">Çevrim $0$'ı sararsa $2\\pi i$, yoksa sıfır. Gelecek her artık hesabının prototipi.</div><div class="card-formula">$\\oint dz/z = 2 \\pi i$</div></div>
<div class="calc-card"><div class="card-title">Cauchy teoremi</div><div class="card-body">Holomorf fonksiyonların kapalı çevrim integralleri sıfırlanır. Green teoremi artı Cauchy-Riemann ile ispatlanır.</div><div class="card-formula">$\\oint_\\gamma f = 0$</div></div>
<div class="calc-card"><div class="card-title">Kontur deformasyonu</div><div class="card-body">Homotopik konturlar aynı integrali verir. Garip şekilleri tekillikler etrafındaki küçük çemberlerle değiştir.</div><div class="card-formula">$\\gamma_1 \\simeq \\gamma_2 \\Rightarrow \\int$ aynı</div></div>
<div class="calc-card"><div class="card-title">Cauchy integral formülü</div><div class="card-body">Sınır verisinden iç değerler. Sınır, $f$'i içte her yerde belirler.</div><div class="card-formula">$f(z_0) = \\frac{1}{2 \\pi i} \\oint \\frac{f}{z - z_0}$</div></div>
<div class="calc-card"><div class="card-title">Türev formülü</div><div class="card-body">Her türev tek bir sınır integrali. Holomorf, sonsuz türevlenebilirliği ima eder.</div><div class="card-formula">$f^{(n)}(z_0) = \\frac{n!}{2 \\pi i} \\oint \\frac{f}{(z - z_0)^{n+1}}$</div></div>
<div class="calc-card"><div class="card-title">Maksimum modülüs</div><div class="card-body">$|f|$ maksimumuna sınırda ulaşır, $f$ sabit olmadıkça. Sınır-değer problemleri için teklik kaldıracı.</div><div class="card-formula">$\\max_{\\overline\\Omega} |f| \\in \\partial \\Omega$</div></div>
<div class="calc-card"><div class="card-title">Uygulamalar</div><div class="card-body">2-B potansiyel teorisi, elektrostatik, ideal akış, kanat profilleri, sinyal dönüşümleri — hepsi bu integral araç setini paylaşır.</div><div class="card-formula">$\\Delta \\phi = 0$, $w = \\phi + i \\psi$</div></div>
</div>

<div class="l-note"><strong>Bunun gideceği yer.</strong> L5, Laurent serilerini ve artık teoremini Cauchy integral formülü üzerine inşa eder. $f^{(n)}(z_0)$ bir sınır integrali olduğunda, tekillikler etrafında genişleme Laurent açılımını verir ve $1/(z - z_0)$'in katsayısı — "artık" — $z_0$'ı saran herhangi bir kontur etrafındaki integrali belirleyen tek bir sayı olur. Artık teoremi, bu dersteki her şeyi artı deformasyon ilkesini, hem kontur integrallerini hem de temel yöntemlere direnen görünüşte ilgisiz gerçel belirli integralleri hesaplayan tek bir ifadeye paketler. L6 konformal eşlemeye geri döner ve diskten başka bölgelerdeki sınır-değer problemlerini çözmek için Cauchy formüllerini kullanır. 9. bölümde kısaca bahsedilen harmonik fonksiyonlar, bu ders ile aynı sınır-integral gösteriminin 2-B Laplace denkleminin sinir vekil modellerini karşılaştırmak için referans çözümler sağladığı modern fizik bilgili sinir ağları arasındaki köprüdür.</div>`
};
