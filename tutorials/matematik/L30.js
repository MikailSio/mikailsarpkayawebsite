/* ============================================================
   tutorials/matematik/L30.js
   Lesson 30 — Kısmi İntegrasyon (Integration by Parts)
   Pure educational content for Turkish high school students.
   No Python, no ML. Bilingual EN/TR with KaTeX + Plotly.
   ============================================================ */

window.LISE_MAT_L30 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `
<p class="l-text"><strong>Integration by parts is the integral version of the product rule.</strong> In Lesson 29 we tackled integrals where the integrand was a function composed with another, using the substitution method — the reverse of the chain rule. But what about integrals where the integrand is a <em>product</em> of two unrelated functions, like $\\int x \\cdot e^x \\, dx$ or $\\int x \\cdot \\ln x \\, dx$? Substitution alone cannot break these apart. We need a different reverse-engineering move: <strong>integration by parts</strong>.</p>

<p class="l-text">The idea is elegant. The product rule $(uv)' = u'v + uv'$ relates the derivative of a product to a sum of two products. Integrating both sides turns this around: it becomes a rule that exchanges one integral for another, often a simpler one. With the right choice of which factor is $u$ and which is $dv$, a hopeless-looking integral collapses in two or three lines. This single technique handles polynomial-times-exponential, polynomial-times-trig, polynomial-times-log, log alone, inverse trig alone, and many integrals that recur back to themselves.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the integration by parts formula $\\int u \\, dv = uv - \\int v \\, du$ directly from the product rule</li>
<li>Choose $u$ and $dv$ wisely using the <strong>LIATE</strong> mnemonic (Log, Inverse trig, Algebraic, Trig, Exponential)</li>
<li>Compute classic integrals: $\\int x e^x dx$, $\\int x \\ln x \\, dx$, $\\int x^2 \\sin x \\, dx$, and $\\int \\ln x \\, dx$</li>
<li>Apply the method <em>twice</em> when one pass is not enough — and recognise the cyclic case $\\int e^x \\sin x \\, dx$</li>
<li>Evaluate definite integrals with the bracket form $\\int_a^b u \\, dv = [uv]_a^b - \\int_a^b v \\, du$</li>
<li>Recognise when integration by parts is the right tool versus substitution or partial fractions</li>
</ul>
</div>

<!-- ============================================================
     SECTION 1: Product Rule Reminder
     ============================================================ -->
<h2 class="l-title">1. Reminder: The Product Rule</h2>

<p class="l-text">Recall from Lesson 24 that the derivative of a product of two differentiable functions $u(x)$ and $v(x)$ is</p>

$$\\frac{d}{dx}\\bigl[u(x) \\, v(x)\\bigr] = u'(x) \\, v(x) + u(x) \\, v'(x).$$

<p class="l-text">In compact notation, dropping the $(x)$:</p>

$$(uv)' = u'v + uv'.$$

<div class="l-highlight"><strong>Verbal reading.</strong> "The derivative of a product equals the derivative of the first times the second, plus the first times the derivative of the second." Two terms — never one. Forgetting the second term is the most common error in differentiation.</div>

<p class="l-text"><strong>Mini-check.</strong> Let $u = x^2$ and $v = \\sin x$. Then $u' = 2x$ and $v' = \\cos x$, so</p>

$$\\frac{d}{dx}[x^2 \\sin x] = 2x \\sin x + x^2 \\cos x.$$

<p class="l-text">Notice how, even on the right-hand side, we still have a sum of products — both terms involve $x$ and a trigonometric function. The product rule mixes things further, not less. That is exactly the structural fact integration by parts will exploit, in reverse.</p>

<!-- ============================================================
     SECTION 2: Deriving Integration by Parts
     ============================================================ -->
<h2 class="l-title">2. Deriving Integration by Parts</h2>

<p class="l-text">Start from the product rule and integrate both sides with respect to $x$:</p>

$$\\int (uv)' \\, dx = \\int \\bigl(u'v + uv'\\bigr) \\, dx.$$

<p class="l-text">The left side is, by the Fundamental Theorem of Calculus, simply</p>

$$\\int (uv)' \\, dx = uv + C_1.$$

<p class="l-text">The right side splits by linearity:</p>

$$\\int u'v \\, dx + \\int uv' \\, dx.$$

<p class="l-text">So</p>

$$uv = \\int u'v \\, dx + \\int uv' \\, dx \\quad (\\text{absorbing the constant}).$$

<p class="l-text">Now <strong>solve for one of the two integrals</strong>:</p>

$$\\int uv' \\, dx = uv - \\int u'v \\, dx.$$

<p class="l-text">Switching to differential notation — $dv = v' \\, dx$ and $du = u' \\, dx$ — this becomes</p>

<div class="l-highlight" style="text-align:center"><strong>INTEGRATION BY PARTS</strong><br>
$$\\boxed{\\;\\int u \\, dv = uv - \\int v \\, du\\;}$$</div>

<p class="l-text"><strong>What just happened?</strong> We turned the product rule into a tool that <em>exchanges</em> one integral $\\int u \\, dv$ for another integral $\\int v \\, du$, plus a known boundary term $uv$. The hope is that the new integral $\\int v \\, du$ is <em>simpler</em> than the original. If we choose $u$ and $dv$ wisely, it will be. If we choose them poorly, the new integral will be even worse than the one we started with.</p>

<div class="l-note"><strong>Geometric picture.</strong> Imagine the rectangle in the $u$-$v$ plane swept out as $x$ varies. The area $uv$ at the endpoints, minus the area swept under one direction, equals the area swept under the other direction. This is exactly the inverse of the product rule: instead of "splitting" a derivative across two pieces, we are "splitting" an integral across two regions.</p></div>

<!-- ============================================================
     SECTION 3: The Formula and Notation
     ============================================================ -->
<h2 class="l-title">3. The Formula and How to Use It</h2>

<p class="l-text">The recipe has five steps:</p>

<ol class="l-list">
<li><strong>Identify $u$ and $dv$.</strong> Look at the integrand as a product. Pick one factor to call $u$ and the rest — including the $dx$ — to call $dv$.</li>
<li><strong>Differentiate $u$</strong> to get $du = u'(x) \\, dx$.</li>
<li><strong>Integrate $dv$</strong> to get $v$ (you do not need a $+C$ here — any antiderivative will do).</li>
<li><strong>Plug into the formula</strong> $\\int u \\, dv = uv - \\int v \\, du$.</li>
<li><strong>Evaluate the new integral</strong> $\\int v \\, du$. If it is easy, you are done. If not, apply integration by parts again, or try a substitution.</li>
</ol>

<p class="l-text">The whole technique stands or falls on Step 1: <em>choosing $u$ and $dv$</em>. Choose badly and you create a harder integral. Choose well and you trivialise it.</p>

<div class="l-note"><strong>Why two different letters?</strong> The pairing $(u, du)$ comes from differentiation; the pairing $(v, dv)$ comes from integration. Keeping the letters distinct reminds you which side of the formula each is on.</div>

<!-- ============================================================
     SECTION 4: LIATE — Choosing u and dv
     ============================================================ -->
<h2 class="l-title">4. Choosing $u$ and $dv$ — the LIATE Rule</h2>

<p class="l-text">There is a beautifully simple priority rule due to Herbert Kasube (1983) called <strong>LIATE</strong>. Read it as a priority list — the function type appearing <em>earlier</em> in the list should usually be chosen as $u$:</p>

<div class="l-highlight" style="text-align:center">
<strong>L</strong> — Logarithmic ($\\ln x$, $\\log_a x$)<br>
<strong>I</strong> — Inverse trigonometric ($\\arctan x$, $\\arcsin x$)<br>
<strong>A</strong> — Algebraic (polynomials $x^n$, $x^2 + 1$, etc.)<br>
<strong>T</strong> — Trigonometric ($\\sin x$, $\\cos x$)<br>
<strong>E</strong> — Exponential ($e^x$, $a^x$)
</div>

<p class="l-text"><strong>Why this order works.</strong> Reading top to bottom:</p>

<ul class="l-list">
<li>Logarithms <em>simplify dramatically</em> when differentiated: $\\frac{d}{dx}\\ln x = \\frac{1}{x}$ is just a rational function — easier than $\\ln x$.</li>
<li>Inverse trig functions also simplify when differentiated: $\\frac{d}{dx}\\arctan x = \\frac{1}{1+x^2}$ is rational.</li>
<li>Polynomials lose one degree with each differentiation. After enough rounds, they become a constant.</li>
<li>Trig functions cycle: $\\sin \\to \\cos \\to -\\sin \\to -\\cos \\to \\sin$. They neither grow simpler nor more complex.</li>
<li>Exponentials are self-similar: $\\frac{d}{dx} e^x = e^x$ — no simplification, no complication.</li>
</ul>

<p class="l-text">The idea: pick $u$ to be the type that gets <em>simpler</em> when differentiated; pick $dv$ to be the type that stays manageable or stays the same when integrated. So $u$ comes from the top of the list (logs simplify the most), $dv$ from the bottom (exponentials integrate trivially).</p>

<div class="l-note"><strong>LIATE is a guideline, not a law.</strong> It works for the vast majority of textbook problems. A few integrals (notably $\\int e^x \\sin x \\, dx$) call for a different strategy — see Section 8.</p></div>

<!-- ============================================================
     SECTION 5: Worked Example 1 — ∫ x · e^x dx
     ============================================================ -->
<h2 class="l-title">5. Worked Example 1: $\\displaystyle\\int x \\, e^x \\, dx$</h2>

<p class="l-text">The integrand $x \\cdot e^x$ is Algebraic times Exponential. By LIATE, A precedes E, so</p>

$$u = x, \\qquad dv = e^x \\, dx.$$

<p class="l-text">Differentiate $u$ and integrate $dv$:</p>

$$du = dx, \\qquad v = \\int e^x \\, dx = e^x.$$

<p class="l-text">Plug into $\\int u \\, dv = uv - \\int v \\, du$:</p>

$$\\int x \\, e^x \\, dx = x \\cdot e^x - \\int e^x \\cdot dx = x e^x - e^x + C.$$

<p class="l-text">Factor for elegance:</p>

$$\\boxed{\\;\\int x \\, e^x \\, dx = (x - 1) e^x + C.\\;}$$

<p class="l-text"><strong>Verification by differentiation.</strong> Differentiate the answer using the product rule:</p>

$$\\frac{d}{dx}\\bigl[(x-1) e^x\\bigr] = 1 \\cdot e^x + (x-1) e^x = e^x (1 + x - 1) = x e^x. \\;\\checkmark$$

<p class="l-text"><strong>What if we had chosen the opposite?</strong> Try $u = e^x$, $dv = x \\, dx$. Then $du = e^x dx$ and $v = \\frac{x^2}{2}$, giving</p>

$$\\int x e^x dx = \\frac{x^2}{2} e^x - \\int \\frac{x^2}{2} e^x \\, dx.$$

<p class="l-text">The new integral has $x^2$ instead of $x$ — strictly <em>harder</em>. LIATE pays off.</p>

<div id="plot-xex-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var xs=[], ys=[], Fs=[];
  for(var i=0;i<=120;i++){ var x=-2+4*i/120; xs.push(x); ys.push(x*Math.exp(x)); Fs.push((x-1)*Math.exp(x)+1); }
  var t1={x:xs, y:ys, mode:"lines", name:"f(x) = x · eˣ", line:{color:"#c8a96e",width:2.6}};
  var t2={x:xs, y:Fs, mode:"lines", name:"F(x) = (x−1)eˣ + 1", line:{color:"#06b6d4",width:2.2,dash:"dash"}};
  var t3={x:xs, y:xs.map(function(){return 0;}), mode:"lines", line:{color:"rgba(255,255,255,0.15)",width:1}, showlegend:false};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"value",zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-xex-en",[t3,t1,t2],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">The integrand $x e^x$ and an antiderivative $(x-1) e^x + 1$. Notice that wherever $f$ is positive, $F$ is increasing — exactly as the Fundamental Theorem requires.</p>

<h3 class="l-subtitle">Geometric picture of $\\int_0^2 x \\, e^x \\, dx$</h3>

<p class="l-text">Plot the parametric curve $\\bigl(u(x), v(x)\\bigr) = (x, e^x)$ in the $u$-$v$ plane as $x$ runs from $0$ to $2$. The curve sweeps from $(0,1)$ up to $(2, e^2)$. The bounding rectangle has area $u(2) \\cdot v(2) - u(0) \\cdot v(0) = 2 e^2$. Integration by parts splits this rectangle into two regions:</p>

<ul class="l-list">
<li>The blue region <em>below the curve</em> has area $\\int u \\, dv = \\int_0^2 x \\, e^x \\, dx$.</li>
<li>The gold region <em>to the left of the curve</em> has area $\\int v \\, du = \\int_0^2 e^x \\, dx = e^2 - 1$.</li>
</ul>

<p class="l-text">Their sum equals the bracket boundary $[uv]_0^2 = 2 e^2$, giving $\\int_0^2 x e^x \\, dx = 2 e^2 - (e^2 - 1) = e^2 + 1 \\approx 8.389$.</p>

<div id="plot-ibp-geom-en-extra" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
  var us=[], vs=[];
  for(var i=0;i<=80;i++){ var x=2*i/80; us.push(x); vs.push(Math.exp(x)); }
  var U2=2, V2=Math.exp(2);
  // Region 1: below the curve (between curve and u-axis from u=0 to u=2). Polygon: (0,0) -> curve points -> (2,0) -> (0,0)
  var below_u=[0].concat(us).concat([U2,0]);
  var below_v=[0].concat(vs).concat([0,0]);
  // Region 2: left of the curve (between curve and v-axis from v=1 to v=e^2). Polygon: (0,1) -> curve points -> (0,e^2) -> (0,1)
  var left_u=[0].concat(us).concat([0,0]);
  var left_v=[1].concat(vs).concat([V2,1]);
  var regBelow={x:below_u, y:below_v, fill:"toself", fillcolor:"rgba(59,130,246,0.30)", line:{color:"rgba(59,130,246,0)"}, name:"∫ u dv (below)", hoverinfo:"skip"};
  var regLeft={x:left_u, y:left_v, fill:"toself", fillcolor:"rgba(200,169,110,0.28)", line:{color:"rgba(200,169,110,0)"}, name:"∫ v du (left)", hoverinfo:"skip"};
  var rect={x:[0,U2,U2,0,0], y:[0,0,V2,V2,0], mode:"lines", line:{color:"rgba(255,255,255,0.35)",width:1.4,dash:"dot"}, name:"rectangle uv", hoverinfo:"skip"};
  var curve={x:us, y:vs, mode:"lines", line:{color:"#3b82f6",width:3.2}, name:"v = eᵘ  (u = x, v = eˣ)"};
  var pts={x:[0,U2], y:[1,V2], mode:"markers+text", text:["(0, 1)","(2, e²)"], textposition:"top right", marker:{size:9,color:"#3b82f6"}, showlegend:false, textfont:{color:"#ebe6dc",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"u = x",zeroline:true,zerolinecolor:"rgba(255,255,255,0.25)",gridcolor:"rgba(255,255,255,0.05)",range:[-0.25,2.5]},yaxis:{title:"v = eˣ",zeroline:true,zerolinecolor:"rgba(255,255,255,0.25)",gridcolor:"rgba(255,255,255,0.05)",range:[-0.5,V2+1.2]},margin:{t:30,r:20,b:70,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.22},annotations:[{x:1.05,y:1.6,text:"∫ u dv",showarrow:false,font:{color:"#93c5fd",size:13}},{x:0.18,y:4.0,text:"∫ v du",showarrow:false,font:{color:"#c8a96e",size:13}},{x:1.0,y:V2+0.6,text:"[uv]₀² = 2e²",showarrow:false,font:{color:"rgba(235,230,220,0.75)",size:11}}]};
  Plotly.newPlot("plot-ibp-geom-en-extra",[regBelow,regLeft,rect,curve,pts],layout,{responsive:true,displayModeBar:false});
},250)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Geometric meaning of integration by parts. The dotted rectangle of area $[uv]_0^2 = 2e^2$ splits along the curve $v = e^u$ into two regions: blue ($\\int u \\, dv$, the unknown we want) and gold ($\\int v \\, du$, the easy integral). The formula $\\int u \\, dv = uv - \\int v \\, du$ is exactly this picture.</p>

<h3 class="l-subtitle">LIATE mnemonic — at a glance</h3>

<p class="l-text">When the integrand is a product of two function types, pick whichever letter appears <em>earlier</em> in <strong>LIATE</strong> as $u$. The other factor becomes $dv$.</p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(0,0,0,0.18);border:1px solid rgba(59,130,246,0.25);border-radius:6px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.18);color:#93c5fd;text-align:left">
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Letter</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Type</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Example function</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Pick as $u$ when…</th>
</tr>
</thead>
<tbody style="color:rgba(235,230,220,0.92)">
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)"><strong style="color:#3b82f6">L</strong></td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">Logarithmic</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\ln x$, $\\log_a x$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">a log appears — always</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)"><strong style="color:#3b82f6">I</strong></td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">Inverse trig</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\arctan x$, $\\arcsin x$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">no log in sight, inverse trig present</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)"><strong style="color:#3b82f6">A</strong></td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">Algebraic</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x$, $x^2$, $x^2 + 1$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">paired with T or E</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)"><strong style="color:#3b82f6">T</strong></td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">Trigonometric</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\sin x$, $\\cos x$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">paired with E (self-referential)</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong style="color:#3b82f6">E</strong></td><td style="padding:0.5rem 0.8rem">Exponential</td><td style="padding:0.5rem 0.8rem">$e^x$, $a^x$</td><td style="padding:0.5rem 0.8rem">almost never — usually $dv$</td></tr>
</tbody>
</table>
</div>

<h3 class="l-subtitle">Common $\\int u \\, dv$ setups</h3>

<p class="l-text">A quick reference for the most-encountered integrals. The third column shows the LIATE pick; the fourth shows the closed-form result (omit $+C$ for brevity).</p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(0,0,0,0.18);border:1px solid rgba(59,130,246,0.25);border-radius:6px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.18);color:#93c5fd;text-align:left">
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Integral</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">$u$</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">$dv$</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Result</th>
</tr>
</thead>
<tbody style="color:rgba(235,230,220,0.92)">
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x \\, e^x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$e^x \\, dx$ (E)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$(x - 1) e^x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x \\, \\sin x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\sin x \\, dx$ (T)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$-x \\cos x + \\sin x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x \\, \\cos x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\cos x \\, dx$ (T)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x \\sin x + \\cos x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x \\, \\ln x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\ln x$ (L)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x \\, dx$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\tfrac{x^2}{2} \\ln x - \\tfrac{x^2}{4}$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int \\ln x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\ln x$ (L)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$dx$ (trick)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x \\ln x - x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int \\arctan x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\arctan x$ (I)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$dx$ (trick)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x \\arctan x - \\tfrac{1}{2} \\ln(1 + x^2)$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x^2 \\, e^x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x^2$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$e^x \\, dx$ (E)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$(x^2 - 2x + 2) e^x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><em>$\\int e^x \\sin x \\, dx$</em></td><td style="padding:0.5rem 0.8rem">either (cyclic)</td><td style="padding:0.5rem 0.8rem">either</td><td style="padding:0.5rem 0.8rem">$\\tfrac{1}{2} e^x (\\sin x - \\cos x)$</td></tr>
</tbody>
</table>
</div>

<!-- ============================================================
     SECTION 6: Worked Example 2 — ∫ x · ln x dx
     ============================================================ -->
<h2 class="l-title">6. Worked Example 2: $\\displaystyle\\int x \\, \\ln x \\, dx$</h2>

<p class="l-text">This is Logarithm times Algebraic. LIATE puts L before A, so</p>

$$u = \\ln x, \\qquad dv = x \\, dx.$$

<p class="l-text">Differentiate $u$ and integrate $dv$:</p>

$$du = \\frac{1}{x} \\, dx, \\qquad v = \\frac{x^2}{2}.$$

<p class="l-text">Apply the formula:</p>

$$\\int x \\ln x \\, dx = \\frac{x^2}{2} \\ln x - \\int \\frac{x^2}{2} \\cdot \\frac{1}{x} \\, dx = \\frac{x^2}{2} \\ln x - \\int \\frac{x}{2} \\, dx.$$

<p class="l-text">The new integral is elementary:</p>

$$\\int \\frac{x}{2} \\, dx = \\frac{x^2}{4}.$$

<p class="l-text">Combining,</p>

$$\\boxed{\\;\\int x \\ln x \\, dx = \\frac{x^2}{2} \\ln x - \\frac{x^2}{4} + C.\\;}$$

<p class="l-text"><strong>Verification.</strong> Differentiate:</p>

$$\\frac{d}{dx}\\left[\\frac{x^2}{2} \\ln x - \\frac{x^2}{4}\\right] = x \\ln x + \\frac{x^2}{2} \\cdot \\frac{1}{x} - \\frac{x}{2} = x \\ln x + \\frac{x}{2} - \\frac{x}{2} = x \\ln x. \\;\\checkmark$$

<p class="l-text"><strong>Wrong choice trap.</strong> If we had picked $u = x$ and $dv = \\ln x \\, dx$, we would first need to know $\\int \\ln x \\, dx$ — which is itself a non-trivial integration-by-parts problem (see Section 9)! Always start with the easier antiderivative on the $dv$ side.</p>

<!-- ============================================================
     SECTION 7: Worked Example 3 — ∫ x² · sin x dx (Two passes)
     ============================================================ -->
<h2 class="l-title">7. Worked Example 3: $\\displaystyle\\int x^2 \\sin x \\, dx$ — Two Passes</h2>

<p class="l-text">Algebraic times Trigonometric. By LIATE,</p>

$$u = x^2, \\qquad dv = \\sin x \\, dx, \\qquad du = 2x \\, dx, \\qquad v = -\\cos x.$$

<p class="l-text">First application:</p>

$$\\int x^2 \\sin x \\, dx = -x^2 \\cos x - \\int (-\\cos x)(2x \\, dx) = -x^2 \\cos x + 2 \\int x \\cos x \\, dx.$$

<p class="l-text">The new integral $\\int x \\cos x \\, dx$ is <em>simpler</em> — the polynomial dropped from $x^2$ to $x$ — but still requires integration by parts. Apply it again with</p>

$$u_2 = x, \\qquad dv_2 = \\cos x \\, dx, \\qquad du_2 = dx, \\qquad v_2 = \\sin x.$$

$$\\int x \\cos x \\, dx = x \\sin x - \\int \\sin x \\, dx = x \\sin x + \\cos x + C_1.$$

<p class="l-text">Substitute back:</p>

$$\\int x^2 \\sin x \\, dx = -x^2 \\cos x + 2(x \\sin x + \\cos x) + C.$$

$$\\boxed{\\;\\int x^2 \\sin x \\, dx = -x^2 \\cos x + 2x \\sin x + 2 \\cos x + C.\\;}$$

<p class="l-text"><strong>Pattern.</strong> For $\\int x^n \\cdot e^x dx$ or $\\int x^n \\sin x \\, dx$ or $\\int x^n \\cos x \\, dx$ with $n$ a positive integer, integration by parts must be applied $n$ times — once per power of $x$. Each pass reduces the polynomial degree by one, until the polynomial vanishes and only a known antiderivative remains.</p>

<div class="l-note"><strong>Tabular shortcut.</strong> When the same kind of repetition is needed, professional integrators use a "tabular" or "DI" method (Differentiate $u$ in one column, Integrate $dv$ in another, multiply diagonally with alternating signs). For this lesson we use the explicit two-pass form — it makes the structure visible.</p></div>

<!-- ============================================================
     SECTION 8: Self-Referential — ∫ eˣ sin x dx
     ============================================================ -->
<h2 class="l-title">8. The Self-Referential Case: $\\displaystyle\\int e^x \\sin x \\, dx$</h2>

<p class="l-text">Trigonometric and Exponential are both "non-simplifying" — neither LIATE letter clearly dominates. Apply integration by parts and watch what happens. Try $u = \\sin x$, $dv = e^x dx$, so $du = \\cos x \\, dx$ and $v = e^x$:</p>

$$\\int e^x \\sin x \\, dx = e^x \\sin x - \\int e^x \\cos x \\, dx.$$

<p class="l-text">The new integral $\\int e^x \\cos x \\, dx$ is not obviously simpler — but it has the same form. Apply integration by parts again, this time with $u = \\cos x$, $dv = e^x dx$, so $du = -\\sin x \\, dx$ and $v = e^x$:</p>

$$\\int e^x \\cos x \\, dx = e^x \\cos x - \\int e^x (-\\sin x) \\, dx = e^x \\cos x + \\int e^x \\sin x \\, dx.$$

<p class="l-text">Substituting back into our first equation:</p>

$$\\int e^x \\sin x \\, dx = e^x \\sin x - \\left[ e^x \\cos x + \\int e^x \\sin x \\, dx \\right].$$

<p class="l-text">The original integral has returned on the right! Let $I = \\int e^x \\sin x \\, dx$. Then</p>

$$I = e^x \\sin x - e^x \\cos x - I.$$

<p class="l-text">Solve algebraically:</p>

$$2I = e^x (\\sin x - \\cos x), \\qquad I = \\frac{e^x (\\sin x - \\cos x)}{2} + C.$$

$$\\boxed{\\;\\int e^x \\sin x \\, dx = \\frac{e^x (\\sin x - \\cos x)}{2} + C.\\;}$$

<p class="l-text">By a parallel calculation (or by the same approach with $\\cos$ swapped in),</p>

$$\\int e^x \\cos x \\, dx = \\frac{e^x (\\sin x + \\cos x)}{2} + C.$$

<p class="l-text"><strong>Lesson.</strong> When integration by parts produces the <em>original integral on the right side</em>, do not despair — that is a feature, not a bug. Treat the equation as algebra and solve for the unknown integral. This trick works whenever the integrand satisfies a kind of "differential closure," cycling back to itself after two applications.</p>

<div class="l-note"><strong>Why the same sign choice?</strong> Crucially, both applications must put the same type of function in $u$ (both trig, or both exponential). If you switch types mid-derivation, the integrals cancel and you get $0 = 0$ — a true but useless statement.</p></div>

<!-- ============================================================
     SECTION 9: ∫ ln x dx — The Surprise
     ============================================================ -->
<h2 class="l-title">9. Worked Example 4: $\\displaystyle\\int \\ln x \\, dx$</h2>

<p class="l-text">There is no obvious "product" in $\\ln x$. But integration by parts handles this too, with a clever choice:</p>

$$u = \\ln x, \\qquad dv = dx.$$

<p class="l-text">That is, treat the entire integrand as the product $\\ln x \\cdot 1$. Then</p>

$$du = \\frac{1}{x} \\, dx, \\qquad v = \\int 1 \\, dx = x.$$

<p class="l-text">Apply the formula:</p>

$$\\int \\ln x \\, dx = x \\ln x - \\int x \\cdot \\frac{1}{x} \\, dx = x \\ln x - \\int 1 \\, dx = x \\ln x - x + C.$$

$$\\boxed{\\;\\int \\ln x \\, dx = x \\ln x - x + C = x(\\ln x - 1) + C.\\;}$$

<p class="l-text"><strong>Verification.</strong> $\\frac{d}{dx}[x \\ln x - x] = \\ln x + x \\cdot \\frac{1}{x} - 1 = \\ln x + 1 - 1 = \\ln x.$ Checks out.</p>

<p class="l-text">The same trick works for $\\int \\arctan x \\, dx$, $\\int \\arcsin x \\, dx$, and any "lone" function that does not look like a product:</p>

$$\\int \\arctan x \\, dx = x \\arctan x - \\frac{1}{2} \\ln(1 + x^2) + C.$$

<p class="l-text">(Set $u = \\arctan x$, $dv = dx$, then $du = \\frac{1}{1+x^2} dx$, $v = x$, and the resulting $\\int \\frac{x}{1+x^2} dx$ is a standard substitution.)</p>

<!-- ============================================================
     SECTION 10: Definite Integrals
     ============================================================ -->
<h2 class="l-title">10. Definite Integrals with Integration by Parts</h2>

<p class="l-text">When the integral is definite — bounded by $a$ and $b$ — both the $uv$ "boundary term" and the remaining integral are evaluated between those bounds:</p>

<div class="l-highlight" style="text-align:center"><strong>DEFINITE FORM</strong><br>
$$\\boxed{\\;\\int_a^b u \\, dv = \\bigl[u(x) v(x)\\bigr]_a^b - \\int_a^b v \\, du\\;}$$<br>
where $\\bigl[u(x) v(x)\\bigr]_a^b = u(b)v(b) - u(a)v(a)$.</div>

<p class="l-text"><strong>Example.</strong> Compute $\\displaystyle\\int_0^1 x e^x \\, dx$.</p>

<p class="l-text">Take $u = x$, $dv = e^x dx$, so $du = dx$, $v = e^x$.</p>

$$\\int_0^1 x e^x \\, dx = \\bigl[x e^x\\bigr]_0^1 - \\int_0^1 e^x \\, dx = (1 \\cdot e^1 - 0 \\cdot e^0) - \\bigl[e^x\\bigr]_0^1.$$

$$= e - (e - 1) = e - e + 1 = 1.$$

<p class="l-text">A clean answer: the area under $x e^x$ from $0$ to $1$ is exactly $1$ square unit.</p>

<div id="plot-area-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var xs=[], ys=[], fillX=[], fillY=[];
  for(var i=0;i<=80;i++){ var x=-0.2+1.4*i/80; xs.push(x); ys.push(x*Math.exp(x)); }
  for(var j=0;j<=60;j++){ var xx=0+1*j/60; fillX.push(xx); fillY.push(xx*Math.exp(xx)); }
  fillX.push(1); fillY.push(0); fillX.push(0); fillY.push(0);
  var area={x:fillX, y:fillY, fill:"toself", fillcolor:"rgba(200,169,110,0.25)", line:{color:"rgba(200,169,110,0)"}, name:"Area = 1", hoverinfo:"skip"};
  var curve={x:xs, y:ys, mode:"lines", name:"f(x) = x · eˣ", line:{color:"#c8a96e",width:2.8}};
  var endpts={x:[0,1], y:[0,Math.exp(1)], mode:"markers+text", text:["x=0","x=1"], textposition:"top center", marker:{size:8,color:"#06b6d4"}, showlegend:false, textfont:{color:"#06b6d4",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"f(x)",zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-area-en",[area,curve,endpts],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">The shaded region is $\\int_0^1 x e^x \\, dx = 1$. Integration by parts converts this area calculation into a one-line algebraic exercise.</p>

<!-- ============================================================
     SECTION 11: Classic Exercises
     ============================================================ -->
<h2 class="l-title">11. Classic Exercises</h2>

<p class="l-text">Solve each. Solutions are sketched below.</p>

<ol class="l-list">
<li>$\\displaystyle\\int x \\cos x \\, dx$</li>
<li>$\\displaystyle\\int x^2 e^x \\, dx$</li>
<li>$\\displaystyle\\int \\ln(2x) \\, dx$</li>
<li>$\\displaystyle\\int_0^{\\pi/2} x \\sin x \\, dx$</li>
<li>$\\displaystyle\\int e^{2x} \\cos(3x) \\, dx$</li>
<li>$\\displaystyle\\int x \\arctan x \\, dx$</li>
<li>$\\displaystyle\\int_1^e x^2 \\ln x \\, dx$</li>
<li>$\\displaystyle\\int (\\ln x)^2 \\, dx$</li>
</ol>

<h3 class="l-subtitle">Solutions</h3>

<p class="l-text"><strong>1.</strong> $u = x$, $dv = \\cos x \\, dx$ gives $\\int x \\cos x \\, dx = x \\sin x + \\cos x + C$.</p>

<p class="l-text"><strong>2.</strong> Two passes. First with $u = x^2$, $dv = e^x dx$:</p>

$$\\int x^2 e^x dx = x^2 e^x - 2 \\int x e^x dx = x^2 e^x - 2(x - 1) e^x + C = (x^2 - 2x + 2) e^x + C.$$

<p class="l-text"><strong>3.</strong> $u = \\ln(2x)$, $dv = dx$; $du = \\frac{1}{x} dx$, $v = x$. Then $\\int \\ln(2x) \\, dx = x \\ln(2x) - \\int dx = x \\ln(2x) - x + C$.</p>

<p class="l-text"><strong>4.</strong> $u = x$, $dv = \\sin x \\, dx$; $v = -\\cos x$. So $\\int_0^{\\pi/2} x \\sin x \\, dx = [-x \\cos x]_0^{\\pi/2} + \\int_0^{\\pi/2} \\cos x \\, dx = 0 + [\\sin x]_0^{\\pi/2} = 1$.</p>

<p class="l-text"><strong>5.</strong> Self-referential. By the method of Section 8:</p>

$$\\int e^{2x} \\cos(3x) \\, dx = \\frac{e^{2x}(2 \\cos 3x + 3 \\sin 3x)}{13} + C.$$

<p class="l-text"><strong>6.</strong> $u = \\arctan x$, $dv = x \\, dx$; $du = \\frac{1}{1+x^2} dx$, $v = \\frac{x^2}{2}$. Then</p>

$$\\int x \\arctan x \\, dx = \\frac{x^2}{2} \\arctan x - \\frac{1}{2} \\int \\frac{x^2}{1+x^2} dx = \\frac{x^2}{2} \\arctan x - \\frac{1}{2}(x - \\arctan x) + C.$$

<p class="l-text"><strong>7.</strong> $u = \\ln x$, $dv = x^2 dx$; $v = \\frac{x^3}{3}$. So</p>

$$\\int_1^e x^2 \\ln x \\, dx = \\left[\\frac{x^3 \\ln x}{3}\\right]_1^e - \\int_1^e \\frac{x^2}{3} dx = \\frac{e^3}{3} - \\frac{1}{9}(e^3 - 1) = \\frac{2 e^3 + 1}{9}.$$

<p class="l-text"><strong>8.</strong> $u = (\\ln x)^2$, $dv = dx$; $du = \\frac{2 \\ln x}{x} dx$, $v = x$. So</p>

$$\\int (\\ln x)^2 dx = x (\\ln x)^2 - 2 \\int \\ln x \\, dx = x(\\ln x)^2 - 2(x \\ln x - x) + C.$$

<div class="l-highlight"><strong>Takeaway.</strong> Integration by parts converts the product rule into a tool for trading one integral for another. The LIATE mnemonic gives a reliable first guess for $u$ and $dv$. Apply repeatedly for higher polynomial powers, look for self-referential loops in exponential-trig pairs, and remember that "lone" functions like $\\ln x$ and $\\arctan x$ yield to $dv = dx$. With substitution (Lesson 29) and integration by parts (Lesson 30), you can handle the overwhelming majority of integrals that appear in lise mat and beyond.</div>

<p class="l-text">In the next lesson we will see how definite integrals translate into <strong>areas and volumes</strong> — the application that motivated Newton and Leibniz to invent calculus in the first place.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `
<p class="l-text"><strong>Kısmi integrasyon, çarpım kuralının integral hâlidir.</strong> 29. derste, içeriği bir başka fonksiyonla birleşik olan integralleri zincir kuralının tersini kullanan değişken değiştirme yöntemiyle çözdük. Peki integrali alınanın iki ilişkisiz fonksiyonun <em>çarpımı</em> olduğu durumlar — örneğin $\\int x \\cdot e^x \\, dx$ veya $\\int x \\cdot \\ln x \\, dx$? Bu tür integralleri sadece değişken değiştirme parçalayamaz. Farklı bir ters mühendislik gerekir: <strong>kısmi integrasyon</strong>.</p>

<p class="l-text">Fikir zariftir. Çarpım kuralı $(uv)' = u'v + uv'$ bir çarpımın türevini iki çarpımın toplamına bağlar. Her iki tarafı integre etmek bunu tersine çevirir: bir integrali başka bir integralle değiştiren bir kurala dönüşür — üstelik genellikle daha basit olanıyla. Hangi çarpanın $u$, hangisinin $dv$ olacağını doğru seçersek umutsuz görünen bir integral iki üç satırda biter. Bu tek teknik; polinom-çarpı-üstel, polinom-çarpı-trigonometri, polinom-çarpı-logaritma, yalnız logaritma, yalnız ters trigonometrik fonksiyon ve kendine geri dönen pek çok integrali halleder.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kısmi integrasyon formülü $\\int u \\, dv = uv - \\int v \\, du$'yu çarpım kuralından doğrudan türetme</li>
<li>$u$ ve $dv$'yi akıllıca seçmek için <strong>LIATE</strong> kuralı (Logaritma, Ters trig., Cebirsel, Trig., Üstel)</li>
<li>Klasik integralleri hesaplama: $\\int x e^x dx$, $\\int x \\ln x \\, dx$, $\\int x^2 \\sin x \\, dx$ ve $\\int \\ln x \\, dx$</li>
<li>Tek geçiş yetmediğinde yöntemi <em>iki kez</em> uygulama — ve döngüsel durumu tanıma: $\\int e^x \\sin x \\, dx$</li>
<li>Köşeli parantezli formla belirli integraller: $\\int_a^b u \\, dv = [uv]_a^b - \\int_a^b v \\, du$</li>
<li>Kısmi integrasyonun ne zaman doğru araç olduğunu, değişken değiştirme ya da basit kesirlere karşı ayırt etme</li>
</ul>
</div>

<!-- ============================================================
     BÖLÜM 1: Çarpım Kuralı Hatırlatma
     ============================================================ -->
<h2 class="l-title">1. Hatırlatma: Çarpım Kuralı</h2>

<p class="l-text">24. dersten hatırlayalım: iki türevlenebilir $u(x)$ ve $v(x)$ fonksiyonunun çarpımının türevi</p>

$$\\frac{d}{dx}\\bigl[u(x) \\, v(x)\\bigr] = u'(x) \\, v(x) + u(x) \\, v'(x).$$

<p class="l-text">Daha kısa, $(x)$'i düşürerek:</p>

$$(uv)' = u'v + uv'.$$

<div class="l-highlight"><strong>Sözel okuma.</strong> "Çarpımın türevi; birincinin türevi çarpı ikinci, artı birinci çarpı ikincinin türevi." İki terim — asla bir tane değil. İkinci terimi unutmak türev almanın en sık hatasıdır.</div>

<p class="l-text"><strong>Hızlı kontrol.</strong> $u = x^2$ ve $v = \\sin x$ alalım. O zaman $u' = 2x$ ve $v' = \\cos x$, böylece</p>

$$\\frac{d}{dx}[x^2 \\sin x] = 2x \\sin x + x^2 \\cos x.$$

<p class="l-text">Dikkat: sağ tarafta bile hâlâ çarpımların toplamı var — iki terim de $x$ ile bir trigonometrik fonksiyonu içeriyor. Çarpım kuralı durumu sadeleştirmek yerine daha karıştırıyor. Kısmi integrasyonun tersten istismar edeceği yapısal gerçek de tam budur.</p>

<!-- ============================================================
     BÖLÜM 2: Kısmi İntegrasyonu Türetme
     ============================================================ -->
<h2 class="l-title">2. Kısmi İntegrasyonun Türetimi</h2>

<p class="l-text">Çarpım kuralıyla başlayıp her iki tarafı $x$'e göre integre edelim:</p>

$$\\int (uv)' \\, dx = \\int \\bigl(u'v + uv'\\bigr) \\, dx.$$

<p class="l-text">Sol taraf, Analizin Temel Teoremi gereği, doğrudan</p>

$$\\int (uv)' \\, dx = uv + C_1.$$

<p class="l-text">Sağ taraf doğrusallık sayesinde ayrışır:</p>

$$\\int u'v \\, dx + \\int uv' \\, dx.$$

<p class="l-text">Yani</p>

$$uv = \\int u'v \\, dx + \\int uv' \\, dx \\quad (\\text{sabit absorbe edildi}).$$

<p class="l-text">Şimdi <strong>iki integralden birini yalnız bırakalım</strong>:</p>

$$\\int uv' \\, dx = uv - \\int u'v \\, dx.$$

<p class="l-text">Diferansiyel gösterime geçelim — $dv = v' \\, dx$ ve $du = u' \\, dx$ — sonuç:</p>

<div class="l-highlight" style="text-align:center"><strong>KISMİ İNTEGRASYON</strong><br>
$$\\boxed{\\;\\int u \\, dv = uv - \\int v \\, du\\;}$$</div>

<p class="l-text"><strong>Ne oldu burada?</strong> Çarpım kuralını, bir $\\int u \\, dv$ integralini başka bir $\\int v \\, du$ integraliyle <em>takas eden</em> ve bilinen bir $uv$ sınır terimi ekleyen araca dönüştürdük. Umut şu: yeni integral $\\int v \\, du$ orijinalinden <em>daha basit</em> olsun. $u$ ve $dv$'yi akıllıca seçersek öyle olur. Kötü seçersek yeni integral daha beter çıkar.</p>

<div class="l-note"><strong>Geometrik resim.</strong> $u$-$v$ düzleminde, $x$ değişirken taranan dikdörtgeni düşün. Uçlardaki $uv$ alanı, bir yönde taranan alanı çıkardığımızda diğer yönde taranan alana eşittir. Bu, çarpım kuralının tam tersi: bir türevi iki parçaya "bölmek" yerine, bir integrali iki bölgeye "böleriz."</p></div>

<!-- ============================================================
     BÖLÜM 3: Formül ve Notasyon
     ============================================================ -->
<h2 class="l-title">3. Formül ve Nasıl Kullanılır</h2>

<p class="l-text">Tarif beş adımdan oluşur:</p>

<ol class="l-list">
<li><strong>$u$ ve $dv$'yi belirle.</strong> İntegrali alınanı bir çarpım gibi gör. Bir çarpana $u$ de, geri kalanın $dx$ ile birlikte $dv$ olsun.</li>
<li><strong>$u$'yu türevle</strong> ve $du = u'(x) \\, dx$ elde et.</li>
<li><strong>$dv$'yi integre et</strong> ve $v$'yi bul (burada $+C$'ye gerek yok — herhangi bir antiderivatif iş görür).</li>
<li><strong>Formüle yerleştir:</strong> $\\int u \\, dv = uv - \\int v \\, du$.</li>
<li><strong>Yeni integrali çöz:</strong> $\\int v \\, du$. Kolaysa bitirdin. Değilse tekrar kısmi integrasyon uygula ya da değişken değiştirmeyi dene.</li>
</ol>

<p class="l-text">Yöntemin ayağa kalkıp düşmesi 1. adıma bağlıdır: <em>$u$ ve $dv$ seçimi</em>. Kötü seç, daha zor bir integral üret. İyi seç, sorunu önemsizleştir.</p>

<div class="l-note"><strong>Neden farklı harfler?</strong> $(u, du)$ ikilisi türevden, $(v, dv)$ ikilisi integralden gelir. Harfleri ayrı tutmak, hangisinin formülün hangi tarafında olduğunu hatırlamana yardımcı olur.</div>

<!-- ============================================================
     BÖLÜM 4: LIATE — u ve dv Seçimi
     ============================================================ -->
<h2 class="l-title">4. $u$ ve $dv$'yi Seçme — LIATE Kuralı</h2>

<p class="l-text">Herbert Kasube'nin (1983) öne sürdüğü harika bir öncelik kuralı var: <strong>LIATE</strong>. Aşağıdaki listeyi bir öncelik sırası gibi oku — <em>daha üstte</em> görünen fonksiyon tipi genellikle $u$ olarak seçilmelidir:</p>

<div class="l-highlight" style="text-align:center">
<strong>L</strong> — Logaritma ($\\ln x$, $\\log_a x$)<br>
<strong>I</strong> — Ters trigonometrik ($\\arctan x$, $\\arcsin x$)<br>
<strong>A</strong> — Cebirsel (polinomlar $x^n$, $x^2 + 1$, vb.)<br>
<strong>T</strong> — Trigonometrik ($\\sin x$, $\\cos x$)<br>
<strong>E</strong> — Üstel ($e^x$, $a^x$)
</div>

<p class="l-text"><strong>Neden bu sıra işe yarıyor?</strong> Yukarıdan aşağıya:</p>

<ul class="l-list">
<li>Logaritma türev alındığında <em>dramatik biçimde sadeleşir</em>: $\\frac{d}{dx}\\ln x = \\frac{1}{x}$ — rasyonel bir fonksiyon, $\\ln x$'ten kolay.</li>
<li>Ters trigonometrik fonksiyonlar da türevlenince sadeleşir: $\\frac{d}{dx}\\arctan x = \\frac{1}{1+x^2}$ rasyoneldir.</li>
<li>Polinomlar her türev alındığında bir derece kaybeder. Yeterli geçişten sonra sabite düşer.</li>
<li>Trigonometrik fonksiyonlar döngü oluşturur: $\\sin \\to \\cos \\to -\\sin \\to -\\cos \\to \\sin$. Ne sadeleşir ne karmaşıklaşır.</li>
<li>Üstel fonksiyonlar kendine benzerdir: $\\frac{d}{dx} e^x = e^x$ — sadeleşme yok, karmaşıklaşma yok.</li>
</ul>

<p class="l-text">Fikir şu: $u$ olarak türevlenince <em>daha basitleşen</em> tipi seç; $dv$ olarak integre edilince yönetilebilir kalan ya da değişmeyen tipi seç. Yani $u$ listenin tepesinden gelir (en çok sadeleşen logaritma), $dv$ alttan (önemsizce integre edilen üstel).</p>

<div class="l-note"><strong>LIATE bir rehberdir, kanun değil.</strong> Ders kitabı problemlerinin ezici çoğunluğunda işler. Birkaç integral (özellikle $\\int e^x \\sin x \\, dx$) farklı bir strateji ister — Bölüm 8'e bak.</p></div>

<!-- ============================================================
     BÖLÜM 5: Çözümlü Örnek 1 — ∫ x · e^x dx
     ============================================================ -->
<h2 class="l-title">5. Çözümlü Örnek 1: $\\displaystyle\\int x \\, e^x \\, dx$</h2>

<p class="l-text">İntegrali alınan $x \\cdot e^x$, Cebirsel çarpı Üstel. LIATE'de A, E'den önce gelir, dolayısıyla</p>

$$u = x, \\qquad dv = e^x \\, dx.$$

<p class="l-text">$u$'yu türevle, $dv$'yi integre et:</p>

$$du = dx, \\qquad v = \\int e^x \\, dx = e^x.$$

<p class="l-text">$\\int u \\, dv = uv - \\int v \\, du$ formülünde yerine koy:</p>

$$\\int x \\, e^x \\, dx = x \\cdot e^x - \\int e^x \\cdot dx = x e^x - e^x + C.$$

<p class="l-text">Daha şık bir gösterim için ortak çarpan al:</p>

$$\\boxed{\\;\\int x \\, e^x \\, dx = (x - 1) e^x + C.\\;}$$

<p class="l-text"><strong>Türevle doğrulama.</strong> Cevabı çarpım kuralıyla türevlersek:</p>

$$\\frac{d}{dx}\\bigl[(x-1) e^x\\bigr] = 1 \\cdot e^x + (x-1) e^x = e^x (1 + x - 1) = x e^x. \\;\\checkmark$$

<p class="l-text"><strong>Ters seçim yapsaydık?</strong> $u = e^x$, $dv = x \\, dx$ deneyelim. O zaman $du = e^x dx$, $v = \\frac{x^2}{2}$, ve</p>

$$\\int x e^x dx = \\frac{x^2}{2} e^x - \\int \\frac{x^2}{2} e^x \\, dx.$$

<p class="l-text">Yeni integralde $x$ yerine $x^2$ var — kesinlikle <em>daha zor</em>. LIATE'in karşılığını burada görüyoruz.</p>

<div id="plot-xex-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var xs=[], ys=[], Fs=[];
  for(var i=0;i<=120;i++){ var x=-2+4*i/120; xs.push(x); ys.push(x*Math.exp(x)); Fs.push((x-1)*Math.exp(x)+1); }
  var t1={x:xs, y:ys, mode:"lines", name:"f(x) = x · eˣ", line:{color:"#c8a96e",width:2.6}};
  var t2={x:xs, y:Fs, mode:"lines", name:"F(x) = (x−1)eˣ + 1", line:{color:"#06b6d4",width:2.2,dash:"dash"}};
  var t3={x:xs, y:xs.map(function(){return 0;}), mode:"lines", line:{color:"rgba(255,255,255,0.15)",width:1}, showlegend:false};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"değer",zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-xex-tr",[t3,t1,t2],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">$x e^x$ integrali alınanı ve bir antiderivatifi $(x-1) e^x + 1$. $f$'nin pozitif olduğu her yerde $F$'nin arttığı dikkat çekiyor — Analizin Temel Teoremi tam olarak bunu söylüyor.</p>

<h3 class="l-subtitle">$\\int_0^2 x \\, e^x \\, dx$'in geometrik resmi</h3>

<p class="l-text">$\\bigl(u(x), v(x)\\bigr) = (x, e^x)$ parametrik eğrisini $u$-$v$ düzleminde, $x$ değişkeni $0$'dan $2$'ye giderken çiz. Eğri $(0,1)$'den $(2, e^2)$'ye yükselir. Çevreleyen dikdörtgenin alanı $u(2) \\cdot v(2) - u(0) \\cdot v(0) = 2 e^2$ olur. Kısmi integrasyon bu dikdörtgeni iki bölgeye ayırır:</p>

<ul class="l-list">
<li>Mavi bölge — eğrinin <em>altında</em> kalan — $\\int u \\, dv = \\int_0^2 x \\, e^x \\, dx$ alanına eşittir.</li>
<li>Altın bölge — eğrinin <em>solunda</em> kalan — $\\int v \\, du = \\int_0^2 e^x \\, dx = e^2 - 1$ alanına eşittir.</li>
</ul>

<p class="l-text">Toplamları sınır terimi $[uv]_0^2 = 2 e^2$'ye eşit; bu da $\\int_0^2 x e^x \\, dx = 2 e^2 - (e^2 - 1) = e^2 + 1 \\approx 8{,}389$ sonucunu verir.</p>

<div id="plot-ibp-geom-tr-extra" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
  var us=[], vs=[];
  for(var i=0;i<=80;i++){ var x=2*i/80; us.push(x); vs.push(Math.exp(x)); }
  var U2=2, V2=Math.exp(2);
  var below_u=[0].concat(us).concat([U2,0]);
  var below_v=[0].concat(vs).concat([0,0]);
  var left_u=[0].concat(us).concat([0,0]);
  var left_v=[1].concat(vs).concat([V2,1]);
  var regBelow={x:below_u, y:below_v, fill:"toself", fillcolor:"rgba(59,130,246,0.30)", line:{color:"rgba(59,130,246,0)"}, name:"∫ u dv (alt)", hoverinfo:"skip"};
  var regLeft={x:left_u, y:left_v, fill:"toself", fillcolor:"rgba(200,169,110,0.28)", line:{color:"rgba(200,169,110,0)"}, name:"∫ v du (sol)", hoverinfo:"skip"};
  var rect={x:[0,U2,U2,0,0], y:[0,0,V2,V2,0], mode:"lines", line:{color:"rgba(255,255,255,0.35)",width:1.4,dash:"dot"}, name:"dikdörtgen uv", hoverinfo:"skip"};
  var curve={x:us, y:vs, mode:"lines", line:{color:"#3b82f6",width:3.2}, name:"v = eᵘ  (u = x, v = eˣ)"};
  var pts={x:[0,U2], y:[1,V2], mode:"markers+text", text:["(0, 1)","(2, e²)"], textposition:"top right", marker:{size:9,color:"#3b82f6"}, showlegend:false, textfont:{color:"#ebe6dc",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"u = x",zeroline:true,zerolinecolor:"rgba(255,255,255,0.25)",gridcolor:"rgba(255,255,255,0.05)",range:[-0.25,2.5]},yaxis:{title:"v = eˣ",zeroline:true,zerolinecolor:"rgba(255,255,255,0.25)",gridcolor:"rgba(255,255,255,0.05)",range:[-0.5,V2+1.2]},margin:{t:30,r:20,b:70,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.22},annotations:[{x:1.05,y:1.6,text:"∫ u dv",showarrow:false,font:{color:"#93c5fd",size:13}},{x:0.18,y:4.0,text:"∫ v du",showarrow:false,font:{color:"#c8a96e",size:13}},{x:1.0,y:V2+0.6,text:"[uv]₀² = 2e²",showarrow:false,font:{color:"rgba(235,230,220,0.75)",size:11}}]};
  Plotly.newPlot("plot-ibp-geom-tr-extra",[regBelow,regLeft,rect,curve,pts],layout,{responsive:true,displayModeBar:false});
},250)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Kısmi integrasyonun geometrik anlamı. $[uv]_0^2 = 2e^2$ alanlı noktalı dikdörtgen, $v = e^u$ eğrisi boyunca iki bölgeye ayrılıyor: mavi ($\\int u \\, dv$, aradığımız büyüklük) ve altın ($\\int v \\, du$, kolay olan integral). $\\int u \\, dv = uv - \\int v \\, du$ formülü tam olarak bu resimdir.</p>

<h3 class="l-subtitle">LIATE kuralı — bir bakışta</h3>

<p class="l-text">İntegrali alınan iki fonksiyon türünün çarpımıysa, <strong>LIATE</strong>'de <em>önce</em> gelen harfi $u$ olarak seç. Diğer çarpan $dv$ olur.</p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(0,0,0,0.18);border:1px solid rgba(59,130,246,0.25);border-radius:6px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.18);color:#93c5fd;text-align:left">
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Harf</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Tür</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Örnek fonksiyon</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">$u$ olarak seç…</th>
</tr>
</thead>
<tbody style="color:rgba(235,230,220,0.92)">
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)"><strong style="color:#3b82f6">L</strong></td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">Logaritmik</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\ln x$, $\\log_a x$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">log varsa — her zaman</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)"><strong style="color:#3b82f6">I</strong></td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">Ters trig.</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\arctan x$, $\\arcsin x$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">log yok, ters trig var</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)"><strong style="color:#3b82f6">A</strong></td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">Cebirsel</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x$, $x^2$, $x^2 + 1$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">T veya E ile eşlenmişse</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)"><strong style="color:#3b82f6">T</strong></td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">Trigonometrik</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\sin x$, $\\cos x$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">E ile eşlenmişse (döngüsel)</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong style="color:#3b82f6">E</strong></td><td style="padding:0.5rem 0.8rem">Üstel</td><td style="padding:0.5rem 0.8rem">$e^x$, $a^x$</td><td style="padding:0.5rem 0.8rem">neredeyse hiç — genelde $dv$</td></tr>
</tbody>
</table>
</div>

<h3 class="l-subtitle">Sık karşılaşılan $\\int u \\, dv$ kurulumları</h3>

<p class="l-text">En sık görülen integraller için kısa referans. Üçüncü sütun LIATE seçimini, dördüncü sütun kapalı form sonucu gösterir ($+C$ kısa olsun diye yazılmadı).</p>

<div style="overflow-x:auto;margin:1rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(0,0,0,0.18);border:1px solid rgba(59,130,246,0.25);border-radius:6px;overflow:hidden">
<thead>
<tr style="background:rgba(59,130,246,0.18);color:#93c5fd;text-align:left">
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">İntegral</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">$u$</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">$dv$</th>
<th style="padding:0.55rem 0.8rem;border-bottom:1px solid rgba(59,130,246,0.3)">Sonuç</th>
</tr>
</thead>
<tbody style="color:rgba(235,230,220,0.92)">
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x \\, e^x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$e^x \\, dx$ (E)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$(x - 1) e^x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x \\, \\sin x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\sin x \\, dx$ (T)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$-x \\cos x + \\sin x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x \\, \\cos x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\cos x \\, dx$ (T)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x \\sin x + \\cos x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x \\, \\ln x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\ln x$ (L)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x \\, dx$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\tfrac{x^2}{2} \\ln x - \\tfrac{x^2}{4}$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int \\ln x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\ln x$ (L)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$dx$ (numara)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x \\ln x - x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int \\arctan x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\arctan x$ (I)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$dx$ (numara)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x \\arctan x - \\tfrac{1}{2} \\ln(1 + x^2)$</td></tr>
<tr><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$\\int x^2 \\, e^x \\, dx$</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$x^2$ (A)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$e^x \\, dx$ (E)</td><td style="padding:0.5rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.05)">$(x^2 - 2x + 2) e^x$</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><em>$\\int e^x \\sin x \\, dx$</em></td><td style="padding:0.5rem 0.8rem">ikisinden biri (döngüsel)</td><td style="padding:0.5rem 0.8rem">diğeri</td><td style="padding:0.5rem 0.8rem">$\\tfrac{1}{2} e^x (\\sin x - \\cos x)$</td></tr>
</tbody>
</table>
</div>

<!-- ============================================================
     BÖLÜM 6: Çözümlü Örnek 2 — ∫ x · ln x dx
     ============================================================ -->
<h2 class="l-title">6. Çözümlü Örnek 2: $\\displaystyle\\int x \\, \\ln x \\, dx$</h2>

<p class="l-text">Bu, Logaritma çarpı Cebirsel. LIATE L'yi A'dan önce koyar, yani</p>

$$u = \\ln x, \\qquad dv = x \\, dx.$$

<p class="l-text">$u$'yu türevle, $dv$'yi integre et:</p>

$$du = \\frac{1}{x} \\, dx, \\qquad v = \\frac{x^2}{2}.$$

<p class="l-text">Formülü uygula:</p>

$$\\int x \\ln x \\, dx = \\frac{x^2}{2} \\ln x - \\int \\frac{x^2}{2} \\cdot \\frac{1}{x} \\, dx = \\frac{x^2}{2} \\ln x - \\int \\frac{x}{2} \\, dx.$$

<p class="l-text">Yeni integral temel:</p>

$$\\int \\frac{x}{2} \\, dx = \\frac{x^2}{4}.$$

<p class="l-text">Birleştirerek,</p>

$$\\boxed{\\;\\int x \\ln x \\, dx = \\frac{x^2}{2} \\ln x - \\frac{x^2}{4} + C.\\;}$$

<p class="l-text"><strong>Doğrulama.</strong> Türevle:</p>

$$\\frac{d}{dx}\\left[\\frac{x^2}{2} \\ln x - \\frac{x^2}{4}\\right] = x \\ln x + \\frac{x^2}{2} \\cdot \\frac{1}{x} - \\frac{x}{2} = x \\ln x + \\frac{x}{2} - \\frac{x}{2} = x \\ln x. \\;\\checkmark$$

<p class="l-text"><strong>Yanlış seçim tuzağı.</strong> $u = x$ ve $dv = \\ln x \\, dx$ seçseydik, önce $\\int \\ln x \\, dx$ değerini bilmemiz gerekirdi — ki bu da başlı başına önemsiz olmayan bir kısmi integrasyon problemidir (Bölüm 9'a bak)! $dv$ tarafında daima daha kolay antiderivatife sahip olanı koy.</p>

<!-- ============================================================
     BÖLÜM 7: Çözümlü Örnek 3 — ∫ x² · sin x dx (İki geçiş)
     ============================================================ -->
<h2 class="l-title">7. Çözümlü Örnek 3: $\\displaystyle\\int x^2 \\sin x \\, dx$ — İki Geçiş</h2>

<p class="l-text">Cebirsel çarpı Trigonometrik. LIATE'e göre,</p>

$$u = x^2, \\qquad dv = \\sin x \\, dx, \\qquad du = 2x \\, dx, \\qquad v = -\\cos x.$$

<p class="l-text">Birinci uygulama:</p>

$$\\int x^2 \\sin x \\, dx = -x^2 \\cos x - \\int (-\\cos x)(2x \\, dx) = -x^2 \\cos x + 2 \\int x \\cos x \\, dx.$$

<p class="l-text">Yeni integral $\\int x \\cos x \\, dx$ <em>daha basit</em> — polinom $x^2$'den $x$'e indi — ama hâlâ kısmi integrasyon istiyor. Yeniden uygula:</p>

$$u_2 = x, \\qquad dv_2 = \\cos x \\, dx, \\qquad du_2 = dx, \\qquad v_2 = \\sin x.$$

$$\\int x \\cos x \\, dx = x \\sin x - \\int \\sin x \\, dx = x \\sin x + \\cos x + C_1.$$

<p class="l-text">Yerine koy:</p>

$$\\int x^2 \\sin x \\, dx = -x^2 \\cos x + 2(x \\sin x + \\cos x) + C.$$

$$\\boxed{\\;\\int x^2 \\sin x \\, dx = -x^2 \\cos x + 2x \\sin x + 2 \\cos x + C.\\;}$$

<p class="l-text"><strong>Örüntü.</strong> $n$ pozitif tamsayıyla $\\int x^n \\cdot e^x dx$ ya da $\\int x^n \\sin x \\, dx$ veya $\\int x^n \\cos x \\, dx$ türü integrallerde, kısmi integrasyon $n$ kez uygulanmalı — her $x$ kuvveti için bir kez. Her geçişte polinomun derecesi bir azalır; sonunda polinom kaybolur ve bilinen bir antiderivatif kalır.</p>

<div class="l-note"><strong>Tabüler kısayol.</strong> Aynı tür tekrar gerekiyorsa profesyonel integratörler "tabüler" ya da "DI" yöntemini kullanır (bir sütunda $u$'yu Türev, diğerinde $dv$'yi İntegral, diyagonal çarpımlar değişen işaretlerle). Bu derste yapıyı görünür kılmak için açık iki-geçiş formunu kullanıyoruz.</p></div>

<!-- ============================================================
     BÖLÜM 8: Kendine Geri Dönen — ∫ eˣ sin x dx
     ============================================================ -->
<h2 class="l-title">8. Kendine Geri Dönen Durum: $\\displaystyle\\int e^x \\sin x \\, dx$</h2>

<p class="l-text">Trigonometrik ve Üstel ikisi de "sadeleşmeyen" türden — LIATE harflerinden hiçbiri net üstün değil. Kısmi integrasyonu uygulayalım ve neler olduğuna bakalım. $u = \\sin x$, $dv = e^x dx$ alalım; $du = \\cos x \\, dx$, $v = e^x$:</p>

$$\\int e^x \\sin x \\, dx = e^x \\sin x - \\int e^x \\cos x \\, dx.$$

<p class="l-text">Yeni integral $\\int e^x \\cos x \\, dx$ açıkça daha basit değil — ama aynı formda. Tekrar uygulayalım; bu kez $u = \\cos x$, $dv = e^x dx$, $du = -\\sin x \\, dx$, $v = e^x$:</p>

$$\\int e^x \\cos x \\, dx = e^x \\cos x - \\int e^x (-\\sin x) \\, dx = e^x \\cos x + \\int e^x \\sin x \\, dx.$$

<p class="l-text">İlk denkleme geri yerleştir:</p>

$$\\int e^x \\sin x \\, dx = e^x \\sin x - \\left[ e^x \\cos x + \\int e^x \\sin x \\, dx \\right].$$

<p class="l-text">Orijinal integral sağ tarafta yeniden ortaya çıktı! $I = \\int e^x \\sin x \\, dx$ diyelim. O zaman</p>

$$I = e^x \\sin x - e^x \\cos x - I.$$

<p class="l-text">Cebirsel olarak çöz:</p>

$$2I = e^x (\\sin x - \\cos x), \\qquad I = \\frac{e^x (\\sin x - \\cos x)}{2} + C.$$

$$\\boxed{\\;\\int e^x \\sin x \\, dx = \\frac{e^x (\\sin x - \\cos x)}{2} + C.\\;}$$

<p class="l-text">Paralel bir hesapla (ya da $\\cos$ ile aynı yaklaşımı uygulayarak),</p>

$$\\int e^x \\cos x \\, dx = \\frac{e^x (\\sin x + \\cos x)}{2} + C.$$

<p class="l-text"><strong>Ders.</strong> Kısmi integrasyon <em>orijinal integrali sağ tarafta</em> yeniden ürettiğinde umutsuzluğa kapılma — bu bir hata değil özellik. Denklemi cebir gibi gör ve bilinmeyen integrali yalnız bırak. Bu numara, integrali alınanın iki uygulama sonra kendine dönen bir "diferansiyel kapanış" sergilediği her durumda işler.</p>

<div class="l-note"><strong>Neden aynı işaret seçimi?</strong> Çok önemli: her iki uygulamada da $u$ olarak aynı fonksiyon tipi (her ikisi de trig veya her ikisi de üstel) seçilmelidir. Türetme sırasında tip değiştirirsen integraller birbirini götürür ve $0 = 0$ — doğru ama işe yaramaz bir ifade — çıkar.</p></div>

<!-- ============================================================
     BÖLÜM 9: ∫ ln x dx — Sürpriz
     ============================================================ -->
<h2 class="l-title">9. Çözümlü Örnek 4: $\\displaystyle\\int \\ln x \\, dx$</h2>

<p class="l-text">$\\ln x$ içinde aşikâr bir "çarpım" yok. Ama kısmi integrasyon, akıllı bir seçimle bunu da halleder:</p>

$$u = \\ln x, \\qquad dv = dx.$$

<p class="l-text">Yani tüm integrali alınanı $\\ln x \\cdot 1$ çarpımı gibi düşünüyoruz. O zaman</p>

$$du = \\frac{1}{x} \\, dx, \\qquad v = \\int 1 \\, dx = x.$$

<p class="l-text">Formülü uygula:</p>

$$\\int \\ln x \\, dx = x \\ln x - \\int x \\cdot \\frac{1}{x} \\, dx = x \\ln x - \\int 1 \\, dx = x \\ln x - x + C.$$

$$\\boxed{\\;\\int \\ln x \\, dx = x \\ln x - x + C = x(\\ln x - 1) + C.\\;}$$

<p class="l-text"><strong>Doğrulama.</strong> $\\frac{d}{dx}[x \\ln x - x] = \\ln x + x \\cdot \\frac{1}{x} - 1 = \\ln x + 1 - 1 = \\ln x.$ Tutuyor.</p>

<p class="l-text">Aynı numara $\\int \\arctan x \\, dx$, $\\int \\arcsin x \\, dx$ ve çarpım gibi görünmeyen "yalnız" her fonksiyon için çalışır:</p>

$$\\int \\arctan x \\, dx = x \\arctan x - \\frac{1}{2} \\ln(1 + x^2) + C.$$

<p class="l-text">($u = \\arctan x$, $dv = dx$ al, $du = \\frac{1}{1+x^2} dx$, $v = x$ olur; ortaya çıkan $\\int \\frac{x}{1+x^2} dx$ ise standart bir değişken değiştirmedir.)</p>

<!-- ============================================================
     BÖLÜM 10: Belirli İntegraller
     ============================================================ -->
<h2 class="l-title">10. Belirli İntegrallerde Kısmi İntegrasyon</h2>

<p class="l-text">Integral $a$ ve $b$ ile sınırlı (belirli) ise, hem $uv$ "sınır terimi" hem de kalan integral bu sınırlarla hesaplanır:</p>

<div class="l-highlight" style="text-align:center"><strong>BELİRLİ HÂLİ</strong><br>
$$\\boxed{\\;\\int_a^b u \\, dv = \\bigl[u(x) v(x)\\bigr]_a^b - \\int_a^b v \\, du\\;}$$<br>
burada $\\bigl[u(x) v(x)\\bigr]_a^b = u(b)v(b) - u(a)v(a)$.</div>

<p class="l-text"><strong>Örnek.</strong> $\\displaystyle\\int_0^1 x e^x \\, dx$'i hesaplayalım.</p>

<p class="l-text">$u = x$, $dv = e^x dx$, $du = dx$, $v = e^x$ alalım.</p>

$$\\int_0^1 x e^x \\, dx = \\bigl[x e^x\\bigr]_0^1 - \\int_0^1 e^x \\, dx = (1 \\cdot e^1 - 0 \\cdot e^0) - \\bigl[e^x\\bigr]_0^1.$$

$$= e - (e - 1) = e - e + 1 = 1.$$

<p class="l-text">Temiz bir sonuç: $x e^x$ eğrisinin altındaki $0$ ile $1$ arasındaki alan tam olarak $1$ birim karedir.</p>

<div id="plot-area-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var xs=[], ys=[], fillX=[], fillY=[];
  for(var i=0;i<=80;i++){ var x=-0.2+1.4*i/80; xs.push(x); ys.push(x*Math.exp(x)); }
  for(var j=0;j<=60;j++){ var xx=0+1*j/60; fillX.push(xx); fillY.push(xx*Math.exp(xx)); }
  fillX.push(1); fillY.push(0); fillX.push(0); fillY.push(0);
  var area={x:fillX, y:fillY, fill:"toself", fillcolor:"rgba(200,169,110,0.25)", line:{color:"rgba(200,169,110,0)"}, name:"Alan = 1", hoverinfo:"skip"};
  var curve={x:xs, y:ys, mode:"lines", name:"f(x) = x · eˣ", line:{color:"#c8a96e",width:2.8}};
  var endpts={x:[0,1], y:[0,Math.exp(1)], mode:"markers+text", text:["x=0","x=1"], textposition:"top center", marker:{size:8,color:"#06b6d4"}, showlegend:false, textfont:{color:"#06b6d4",size:11}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"f(x)",zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-area-tr",[area,curve,endpts],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Taranan bölge $\\int_0^1 x e^x \\, dx = 1$. Kısmi integrasyon, bu alan hesabını tek satırlık cebirsel egzersize dönüştürüyor.</p>

<!-- ============================================================
     BÖLÜM 11: Klasik Alıştırmalar
     ============================================================ -->
<h2 class="l-title">11. Klasik Alıştırmalar</h2>

<p class="l-text">Her birini çöz. Çözümler aşağıda taslak hâlinde verilmiştir.</p>

<ol class="l-list">
<li>$\\displaystyle\\int x \\cos x \\, dx$</li>
<li>$\\displaystyle\\int x^2 e^x \\, dx$</li>
<li>$\\displaystyle\\int \\ln(2x) \\, dx$</li>
<li>$\\displaystyle\\int_0^{\\pi/2} x \\sin x \\, dx$</li>
<li>$\\displaystyle\\int e^{2x} \\cos(3x) \\, dx$</li>
<li>$\\displaystyle\\int x \\arctan x \\, dx$</li>
<li>$\\displaystyle\\int_1^e x^2 \\ln x \\, dx$</li>
<li>$\\displaystyle\\int (\\ln x)^2 \\, dx$</li>
</ol>

<h3 class="l-subtitle">Çözümler</h3>

<p class="l-text"><strong>1.</strong> $u = x$, $dv = \\cos x \\, dx$ alınınca $\\int x \\cos x \\, dx = x \\sin x + \\cos x + C$.</p>

<p class="l-text"><strong>2.</strong> İki geçiş. Önce $u = x^2$, $dv = e^x dx$:</p>

$$\\int x^2 e^x dx = x^2 e^x - 2 \\int x e^x dx = x^2 e^x - 2(x - 1) e^x + C = (x^2 - 2x + 2) e^x + C.$$

<p class="l-text"><strong>3.</strong> $u = \\ln(2x)$, $dv = dx$; $du = \\frac{1}{x} dx$, $v = x$. O hâlde $\\int \\ln(2x) \\, dx = x \\ln(2x) - \\int dx = x \\ln(2x) - x + C$.</p>

<p class="l-text"><strong>4.</strong> $u = x$, $dv = \\sin x \\, dx$; $v = -\\cos x$. Böylece $\\int_0^{\\pi/2} x \\sin x \\, dx = [-x \\cos x]_0^{\\pi/2} + \\int_0^{\\pi/2} \\cos x \\, dx = 0 + [\\sin x]_0^{\\pi/2} = 1$.</p>

<p class="l-text"><strong>5.</strong> Kendine dönen. Bölüm 8'in yöntemiyle:</p>

$$\\int e^{2x} \\cos(3x) \\, dx = \\frac{e^{2x}(2 \\cos 3x + 3 \\sin 3x)}{13} + C.$$

<p class="l-text"><strong>6.</strong> $u = \\arctan x$, $dv = x \\, dx$; $du = \\frac{1}{1+x^2} dx$, $v = \\frac{x^2}{2}$. Sonra</p>

$$\\int x \\arctan x \\, dx = \\frac{x^2}{2} \\arctan x - \\frac{1}{2} \\int \\frac{x^2}{1+x^2} dx = \\frac{x^2}{2} \\arctan x - \\frac{1}{2}(x - \\arctan x) + C.$$

<p class="l-text"><strong>7.</strong> $u = \\ln x$, $dv = x^2 dx$; $v = \\frac{x^3}{3}$. Yani</p>

$$\\int_1^e x^2 \\ln x \\, dx = \\left[\\frac{x^3 \\ln x}{3}\\right]_1^e - \\int_1^e \\frac{x^2}{3} dx = \\frac{e^3}{3} - \\frac{1}{9}(e^3 - 1) = \\frac{2 e^3 + 1}{9}.$$

<p class="l-text"><strong>8.</strong> $u = (\\ln x)^2$, $dv = dx$; $du = \\frac{2 \\ln x}{x} dx$, $v = x$. Yani</p>

$$\\int (\\ln x)^2 dx = x (\\ln x)^2 - 2 \\int \\ln x \\, dx = x(\\ln x)^2 - 2(x \\ln x - x) + C.$$

<div class="l-highlight"><strong>Çıkarım.</strong> Kısmi integrasyon, çarpım kuralını bir integrali başka bir integralle takas eden araca dönüştürür. LIATE kuralı $u$ ve $dv$ için güvenilir bir ilk tahmin verir. Yüksek polinom kuvvetlerinde tekrar tekrar uygula, üstel-trig çiftlerinde kendine geri dönen döngüleri kolla ve $\\ln x$ ile $\\arctan x$ gibi "yalnız" fonksiyonların $dv = dx$ seçimiyle çözüldüğünü unutma. Değişken değiştirme (Ders 29) ile kısmi integrasyon (Ders 30) bir arada, lise mat'ta ve ötesinde karşılaşacağın integrallerin ezici çoğunluğunu halleder.</div>

<p class="l-text">Sonraki derste belirli integrallerin <strong>alanlara ve hacimlere</strong> nasıl çevrildiğini göreceğiz — Newton ile Leibniz'i analizi icat etmeye iten asıl uygulama.</p>
`

};
