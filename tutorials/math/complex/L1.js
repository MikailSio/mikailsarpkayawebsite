window.COMPLEX_L1 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/68" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Complex Numbers Intro</a> <span style="opacity:0.55;font-size:0.82em">(Math L68)</span></li>
<li><a href="/tutorials/matematik/69" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Complex Arithmetic</a> <span style="opacity:0.55;font-size:0.82em">(Math L69)</span></li>
<li><a href="/tutorials/matematik/70" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Polar Form</a> <span style="opacity:0.55;font-size:0.82em">(Math L70)</span></li>
<li><a href="/tutorials/matematik/71" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">De Moivre &amp; Roots</a> <span style="opacity:0.55;font-size:0.82em">(Math L71)</span></li>
</ul>
</div>
<p class="l-text"><strong>Complex numbers are 2D numbers.</strong> That sentence should arrive with no fanfare and no apology — because once you take it seriously, almost every confusing thing about <em>i</em> evaporates. The "imaginary" part is not a metaphysical claim; it is simply the second coordinate of a point in the plane. The rule <em>i² = −1</em> is the one rule that makes the algebra of these points <em>do</em> something interesting — and what it does, geometrically, is rotate.</p>

<p class="l-text">In high school the symbol <em>i</em> was probably handed to you as a curiosity: "We invented a number whose square is −1, because we wanted to." That description is technically true but emotionally misleading. Complex numbers were not invented out of boredom. They were forced on mathematicians who could not finish a problem without them. This lesson recovers that necessity, then builds the geometric picture that makes <em>i</em> stop feeling imaginary at all.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the historical reason complex numbers were unavoidable — Cardano's cubic and the path from Bombelli to Argand to Hamilton</li>
<li>Read every complex number z = a + bi as a single point in a 2D plane, with modulus |z| and argument arg(z)</li>
<li>Add, subtract, multiply, divide complex numbers fluently in rectangular form, and know which form to choose for which task</li>
<li>Derive Euler's formula from Taylor series and use the polar/exponential form z = r·e^{iθ} to compute</li>
<li>Interpret complex multiplication as "rotate by the argument, scale by the modulus" — the geometric heart of the lesson</li>
<li>Apply De Moivre's theorem to compute roots of unity and use complex impedance to describe AC circuits in one elegant equation</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Complex Numbers? A Historical Necessity</h2>

<div class="calc-highlight"><strong>The clean story:</strong> mathematicians did not sit around inventing a "square root of minus one" for fun. They were trying to solve real polynomial equations whose <em>real</em> roots could only be reached by passing through square roots of negatives in the middle of the calculation. The intermediate steps demanded a wider number system; the final answers came back to the real line. Complex numbers earned their existence the hard way.</div>

<p class="l-text">The decisive episode is Gerolamo Cardano's 1545 treatise <em>Ars Magna</em>, where he published a formula for solving the cubic equation x³ + px + q = 0. The formula is genuine and works:</p>

<div class="calc-formula"><div class="formula-label">CARDANO'S FORMULA</div><div class="formula-main">$$x = \\sqrt[3]{-\\tfrac{q}{2} + \\sqrt{\\tfrac{q^2}{4} + \\tfrac{p^3}{27}}} + \\sqrt[3]{-\\tfrac{q}{2} - \\sqrt{\\tfrac{q^2}{4} + \\tfrac{p^3}{27}}}$$</div><div class="formula-sub">Plug in p and q, take cube roots, add. For many cubics it returns the real root cleanly.</div></div>

<p class="l-text">But try x³ − 15x − 4 = 0. By inspection x = 4 is a root (64 − 60 − 4 = 0). Cardano's formula, however, demands the quantity under the inner square root:</p>

<div class="calc-formula"><div class="formula-label">THE EMBARRASSMENT</div><div class="formula-main">$$\\frac{q^2}{4} + \\frac{p^3}{27} = \\frac{16}{4} + \\frac{(-15)^3}{27} = 4 - 125 = -121$$</div><div class="formula-sub">A negative number under a square root, blocking the entire calculation — even though the final answer x = 4 is perfectly real.</div></div>

<p class="l-text">Sixteenth-century mathematicians faced a fork in the road: either declare the formula broken and walk away, or accept that <strong>the path to a real answer can require passing through square roots of negatives</strong>. Rafael Bombelli (1572) chose the second road. He formally manipulated $\\sqrt{-121}$ as $11\\sqrt{-1}$, performed the algebra with the rule $(\\sqrt{-1})^2 = -1$, and watched the imaginary parts cancel exactly to leave x = 4. The "impossible" detour worked. From that moment, complex numbers were no longer a curiosity — they were a tool.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cardano (1545)</div><div class="card-body">Publishes the cubic formula. Notes that some cubics force "sophistic" quantities (his word for square roots of negatives) but cannot interpret them.</div></div>
<div class="calc-card"><div class="card-title">Bombelli (1572)</div><div class="card-body">Establishes the algebraic rules: how to add, multiply, and simplify expressions containing √(−1). The first person to take i seriously as a manipulable symbol.</div></div>
<div class="calc-card"><div class="card-title">Argand &amp; Gauss (~1800)</div><div class="card-body">Independently propose the geometric interpretation: each complex number is a point in a 2D plane. The mystery of "imaginary" dissolves into vectors and angles.</div></div>
<div class="calc-card"><div class="card-title">Hamilton (1837)</div><div class="card-body">Reformulates complex numbers as ordered pairs (a, b) of real numbers with rigorous addition and multiplication rules. No appeal to mysterious √(−1) — only definitions.</div></div>
</div>

<div class="l-note"><strong>Lesson from the history:</strong> the symbol <em>i</em> is not a number we discovered floating in nature. It is a notational device whose rules were chosen so that polynomial equations behave consistently. The geometric meaning came later — but once it arrived, it became impossible to imagine algebra without it.</div>

<h2 class="lesson-title">2. Definition</h2>

<p class="l-text">Following Hamilton, we define the system cleanly and without mystery.</p>

<div class="calc-formula"><div class="formula-label">THE IMAGINARY UNIT</div><div class="formula-main">$$i^2 = -1$$</div><div class="formula-sub">This is the entire definition. Everything else follows from algebra and this one rule.</div></div>

<div class="calc-formula"><div class="formula-label">A COMPLEX NUMBER</div><div class="formula-main">$$z = a + b\\,i, \\qquad a, b \\in \\mathbb{R}$$</div><div class="formula-sub">Two real numbers a and b joined by the symbol i. The real part is a; the imaginary part is b (a real number, despite the name).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Real part Re(z)</div><div class="card-body">The number a in z = a + bi. Written Re(z) = a. Plotted along the horizontal axis when we draw z.</div></div>
<div class="calc-card"><div class="card-title">Imaginary part Im(z)</div><div class="card-body">The number b in z = a + bi. Written Im(z) = b. Despite the historical name, b is just a plain real number — the coefficient of i.</div></div>
<div class="calc-card"><div class="card-title">The set ℂ</div><div class="card-body">The set of all complex numbers. Contains ℝ as the subset where b = 0, and the pure imaginary axis as the subset where a = 0.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EQUALITY</div><div class="formula-main">$$z = w \\iff \\operatorname{Re}(z) = \\operatorname{Re}(w) \\;\\text{and}\\; \\operatorname{Im}(z) = \\operatorname{Im}(w)$$</div><div class="formula-sub">Two complex numbers are equal exactly when both coordinates match. This is what it means for them to be ordered pairs.</div></div>

<div class="calc-example"><div class="example-label">QUICK CHECKS</div><div class="example-body">z = 3 + 4i &nbsp;→&nbsp; Re(z) = 3, Im(z) = 4.<br>z = −2 &nbsp;→&nbsp; Re(z) = −2, Im(z) = 0. A real number is a complex number with zero imaginary part.<br>z = 5i &nbsp;→&nbsp; Re(z) = 0, Im(z) = 5. A pure imaginary number sits on the vertical axis.<br>z = 0 &nbsp;→&nbsp; Re(z) = 0, Im(z) = 0. The origin of the plane.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Is "i" greater than zero, less than zero, or neither? Trick question — complex numbers cannot be ordered the way real numbers can. There is no consistent way to say one complex number is "less than" another. We will measure their <em>size</em> with the modulus instead.</div></div>

<h2 class="lesson-title">3. Algebraic Operations</h2>

<p class="l-text">All four arithmetic operations carry over from real numbers, treating <em>i</em> as a symbol and reducing $i^2$ to −1 whenever it appears.</p>

<div class="calc-formula"><div class="formula-label">ADDITION (COORDINATE-WISE)</div><div class="formula-main">$$(a + b\\,i) + (c + d\\,i) = (a + c) + (b + d)\\,i$$</div><div class="formula-sub">Real parts add. Imaginary parts add. Exactly the rule for 2D vector addition.</div></div>

<div class="calc-formula"><div class="formula-label">MULTIPLICATION (DISTRIBUTE, THEN USE i² = −1)</div><div class="formula-main">$$(a + b\\,i)(c + d\\,i) = a c + a d\\,i + b c\\,i + b d\\,i^2 = (a c - b d) + (a d + b c)\\,i$$</div><div class="formula-sub">The bd·i² term flips sign and joins the real part. The remaining cross terms become the new imaginary part.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Multiply (2 + 3i)(4 − i):</strong><br><br>= 2·4 + 2·(−i) + 3i·4 + 3i·(−i)<br>= 8 − 2i + 12i − 3i²<br>= 8 − 2i + 12i + 3 &nbsp;&nbsp;(since i² = −1)<br>= <strong>11 + 10i</strong> ✔</div></div>

<p class="l-text">These rules make ℂ a <strong>field</strong> — the same algebraic structure as ℝ. Addition is commutative and associative, multiplication is commutative and associative, multiplication distributes over addition, every non-zero element has an inverse:</p>

<div class="calc-formula"><div class="formula-label">MULTIPLICATIVE INVERSE</div><div class="formula-main">$$\\frac{1}{a + b\\,i} = \\frac{a - b\\,i}{a^2 + b^2}$$</div><div class="formula-sub">Multiply top and bottom by the conjugate (a − bi). The denominator becomes the real number a² + b². No more i in the denominator.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Closed under +, −, ×, ÷</div><div class="card-body">Any arithmetic combination of complex numbers (with non-zero denominators) is again complex. The system does not leak.</div></div>
<div class="calc-card"><div class="card-title">Distributive law</div><div class="card-body">z(w + v) = zw + zv. Allows you to expand products of sums just as in real algebra.</div></div>
<div class="calc-card"><div class="card-title">Commutative</div><div class="card-body">zw = wz and z + w = w + z. The order of operands does not matter for either operation.</div></div>
<div class="calc-card"><div class="card-title">Associative</div><div class="card-body">(zw)v = z(wv). Parentheses can be re-grouped freely in long products and sums.</div></div>
</div>

<div class="calc-example"><div class="example-label">DIVISION EXAMPLE</div><div class="example-body"><strong>Compute (3 + 2i) / (1 − i):</strong><br><br>Multiply top and bottom by the conjugate of the denominator, (1 + i):<br>= [(3 + 2i)(1 + i)] / [(1 − i)(1 + i)]<br>= (3 + 3i + 2i + 2i²) / (1 − i²)<br>= (3 + 5i − 2) / (1 + 1)<br>= (1 + 5i) / 2 = <strong>½ + (5/2)i</strong></div></div>

<div class="l-note"><strong>What we lose compared to ℝ:</strong> the ordering. There is no notion of "z is positive" or "z > w" that is consistent with multiplication. What we gain is enormous: every polynomial of degree n with complex coefficients has exactly n complex roots (counted with multiplicity). This is the Fundamental Theorem of Algebra, proved fully only after complex numbers were accepted.</div>

<h2 class="lesson-title">4. The Complex Plane (Argand Diagram)</h2>

<div class="calc-highlight"><strong>The single most important picture in the lesson.</strong> Plot z = a + bi as the point with coordinates (a, b). The horizontal axis carries the real part; the vertical axis carries the imaginary part. The whole 2D plane is now ℂ. From this picture forward, every algebraic identity acquires a geometric meaning.</div>

<p class="l-text">Two consequences land immediately:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Addition is vector addition</div><div class="card-body">(a + bi) + (c + di) = (a + c) + (b + d)i — the same rule as adding the position vectors (a, b) and (c, d) tip-to-tail. The geometry of complex addition is the parallelogram rule.</div></div>
<div class="calc-card"><div class="card-title">Subtraction gives displacement</div><div class="card-body">z − w is the vector pointing from w to z. Its modulus |z − w| is the Euclidean distance between the two points — a fact we will use constantly in Section 10.</div></div>
<div class="calc-card"><div class="card-title">Real numbers live on the x-axis</div><div class="card-body">When b = 0 the point sits exactly on the real axis. The familiar real number line is embedded inside the complex plane as one horizontal slice.</div></div>
<div class="calc-card"><div class="card-title">Pure imaginaries on the y-axis</div><div class="card-body">When a = 0 the point sits on the imaginary axis. The set of pure imaginary numbers is a vertical line through the origin. Multiplying by i moves you 90° between these two axes.</div></div>
</div>

<div id="plot-l1-argand-en" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pts={x:[3,-2,0,1.5,-1.5,2.5],y:[2,1,-2.5,-1,2,0],mode:'markers+text',name:'sample numbers',marker:{size:10,color:'#3b82f6'},text:['3+2i','-2+i','-2.5i','1.5-i','-1.5+2i','2.5'],textposition:'top right',textfont:{color:'#e8e8e8',size:12}};
var arrows=[];
var samples=[[3,2],[-2,1],[0,-2.5],[1.5,-1],[-1.5,2],[2.5,0]];
for(var i=0;i<samples.length;i++){arrows.push({x:[0,samples[i][0]],y:[0,samples[i][1]],mode:'lines',line:{color:'rgba(59,130,246,0.4)',width:1.5},showlegend:false,hoverinfo:'skip'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4,4.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-3.5,3]},margin:{t:40,r:30,b:50,l:60},showlegend:true,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
var data=arrows.concat([pts]);
Plotly.newPlot('plot-l1-argand-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the Argand diagram with six sample complex numbers plotted as labelled points, each drawn as a position vector from the origin. Real numbers sit on the horizontal axis (2.5), pure imaginaries on the vertical axis (−2.5i), and general complex numbers fill the rest of the plane. The axes are drawn to equal scale so that distances and angles are honest.</div></div>

<h2 class="lesson-title">5. Modulus and Argument</h2>

<p class="l-text">Once z is a point in the plane, two further numbers describe it: <strong>how far</strong> from the origin and <strong>at what angle</strong>. These are the modulus and the argument.</p>

<div class="calc-formula"><div class="formula-label">MODULUS</div><div class="formula-main">$$|z| = \\sqrt{a^2 + b^2}$$</div><div class="formula-sub">The Euclidean distance from the origin to the point (a, b). Always a non-negative real number. Also called the absolute value or magnitude.</div></div>

<div class="calc-formula"><div class="formula-label">ARGUMENT</div><div class="formula-main">$$\\arg(z) = \\operatorname{atan2}(b, a)$$</div><div class="formula-sub">The angle, measured counter-clockwise from the positive real axis to the vector z. The atan2 function returns the correct quadrant; plain atan(b/a) loses the sign and confuses opposite directions.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">|z| ≥ 0</div><div class="card-body">The modulus is zero only when z = 0. For any other complex number it is strictly positive — distances cannot be negative.</div></div>
<div class="calc-card"><div class="card-title">arg(z) is multi-valued</div><div class="card-body">Adding any multiple of 2π to an angle gives the same direction. So arg(z), arg(z) + 2π, arg(z) − 2π, etc. all describe the same z. To pin a unique value we use the principal argument Arg(z) in the range (−π, π].</div></div>
<div class="calc-card"><div class="card-title">arg(0) is undefined</div><div class="card-body">The zero vector has no direction. The origin has modulus 0 and no argument; this single exception is harmless but worth knowing.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">POLAR (TRIGONOMETRIC) FORM</div><div class="formula-main">$$z = r\\,(\\cos \\theta + i\\,\\sin \\theta), \\qquad r = |z|, \\quad \\theta = \\arg(z)$$</div><div class="formula-sub">Read directly from the Argand picture: project the radius vector onto the two axes, multiply by r. The rectangular form (a, b) and the polar form (r, θ) carry the same information through different coordinates.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Take z = 3 + 4i:</strong><br><br>|z| = √(3² + 4²) = √(9 + 16) = √25 = <strong>5</strong>.<br>arg(z) = atan2(4, 3) ≈ 0.9273 rad ≈ <strong>53.13°</strong> — first quadrant, just above the line y = x.<br><br>Polar form: z = 5·(cos 53.13° + i sin 53.13°). Same point, named by distance and angle instead of horizontal and vertical components.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Take z = −1 + i:</strong><br><br>|z| = √(1 + 1) = √2 ≈ <strong>1.414</strong>.<br>arg(z) = atan2(1, −1) = 3π/4 = <strong>135°</strong> — second quadrant. Plain atan(1/−1) = atan(−1) = −π/4 would have given the wrong answer; atan2 sees both coordinates and picks the right quadrant.</div></div>

<div id="plot-l1-modarg-en" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var samples=[{x:3,y:4,n:'3+4i',c:'#3b82f6'},{x:-1,y:1,n:'-1+i',c:'#f97316'},{x:-2,y:-2,n:'-2-2i',c:'#10b981'},{x:0,y:-3,n:'-3i',c:'#a855f7'}];
var traces=[];
for(var i=0;i<samples.length;i++){
  var s=samples[i];var r=Math.sqrt(s.x*s.x+s.y*s.y);var th=Math.atan2(s.y,s.x);
  traces.push({x:[0,s.x],y:[0,s.y],mode:'lines',name:s.n+' (|z|='+r.toFixed(2)+')',line:{color:s.c,width:2.4}});
  traces.push({x:[s.x],y:[s.y],mode:'markers+text',text:[s.n],textposition:'top right',marker:{size:10,color:s.c},textfont:{color:s.c,size:12},showlegend:false});
  var arc=[];var arcx=[];var arcy=[];var R=0.55;
  var start=0;var end=th;var step=(end-start)/40;
  for(var k=0;k<=40;k++){var a=start+k*step;arcx.push(R*Math.cos(a));arcy.push(R*Math.sin(a));}
  traces.push({x:arcx,y:arcy,mode:'lines',line:{color:s.c,width:1.2,dash:'dot'},showlegend:false,hoverinfo:'skip'});
}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4,5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4,5]},margin:{t:40,r:30,b:50,l:60},showlegend:true,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-modarg-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> four sample complex numbers as radius vectors from the origin. The length of each vector is the modulus |z|; the dotted arc indicates the argument (signed angle from the positive real axis, counter-clockwise positive). Notice the green vector in the third quadrant has a <em>negative</em> argument when measured by atan2, and the purple vector pointing straight down has argument −π/2 exactly.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Compute the modulus and principal argument of z = 1 − i, then write z in polar form. (Answer: |z| = √2, arg(z) = −π/4, so z = √2·(cos(−π/4) + i sin(−π/4)).)</div></div>

<h2 class="lesson-title">6. Euler's Formula — The Bridge</h2>

<div class="calc-highlight"><strong>The most consequential identity in all of mathematics:</strong> $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$. It looks like a typographical accident — an exponential with an imaginary argument — but it is forced upon us by the Taylor series. Once it lands, the polar form collapses into something far cleaner than (cos θ + i sin θ): a single exponential.</div>

<p class="l-text">Recall three Taylor series you have met in calculus:</p>

<div class="calc-formula"><div class="formula-label">TAYLOR SERIES — THREE BUILDING BLOCKS</div><div class="formula-main">$$e^{x} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\frac{x^5}{5!} + \\cdots$$</div><div class="formula-sub">The exponential, valid for every real x.</div></div>

<div class="calc-formula"><div class="formula-label"></div><div class="formula-main">$$\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\cdots$$</div><div class="formula-sub">Only even powers, signs alternating + − + − ...</div></div>

<div class="calc-formula"><div class="formula-label"></div><div class="formula-main">$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\cdots$$</div><div class="formula-sub">Only odd powers, signs alternating + − + − ...</div></div>

<p class="l-text">Now <strong>substitute</strong> x = iθ into the exponential series. Taylor series are infinite polynomials, and polynomials accept any input — real, imaginary, complex.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Substitute x = iθ into the e<sup>x</sup> series</div><div class="step-detail">$$e^{i\\theta} = 1 + i\\theta + \\frac{(i\\theta)^2}{2!} + \\frac{(i\\theta)^3}{3!} + \\frac{(i\\theta)^4}{4!} + \\frac{(i\\theta)^5}{5!} + \\cdots$$</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Simplify the powers of i — they cycle with period 4</div><div class="step-detail">i¹ = i, &nbsp;i² = −1, &nbsp;i³ = −i, &nbsp;i⁴ = 1, &nbsp;i⁵ = i, &nbsp;i⁶ = −1, ... This cycle is the engine of the whole derivation.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Apply the cycle term by term</div><div class="step-detail">$$e^{i\\theta} = 1 + i\\theta - \\frac{\\theta^2}{2!} - i\\frac{\\theta^3}{3!} + \\frac{\\theta^4}{4!} + i\\frac{\\theta^5}{5!} - \\frac{\\theta^6}{6!} - i\\frac{\\theta^7}{7!} + \\cdots$$</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Group real and imaginary terms separately</div><div class="step-detail">$$e^{i\\theta} = \\underbrace{\\Bigl(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\frac{\\theta^6}{6!} + \\cdots\\Bigr)}_{=\\,\\cos\\theta} + i\\underbrace{\\Bigl(\\theta - \\frac{\\theta^3}{3!} + \\frac{\\theta^5}{5!} - \\frac{\\theta^7}{7!} + \\cdots\\Bigr)}_{=\\,\\sin\\theta}$$</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Recognise the cosine and sine series exactly</div><div class="step-detail">The real-part bracket is the Taylor series for cos θ. The imaginary-part bracket is the Taylor series for sin θ. They line up perfectly, term for term.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">EULER'S FORMULA</div><div class="formula-main">$$\\boxed{\\,e^{i\\theta} = \\cos\\theta + i\\sin\\theta\\,}$$</div><div class="formula-sub">Not a definition, not a convention — a consequence. Cosine and sine were hiding inside the exponential, waiting for an imaginary argument to reveal them.</div></div>

<p class="l-text">The immediate payoff is a much sleeker version of the polar form:</p>

<div class="calc-formula"><div class="formula-label">EXPONENTIAL FORM OF A COMPLEX NUMBER</div><div class="formula-main">$$z = r\\,e^{i\\theta}, \\qquad r = |z|, \\quad \\theta = \\arg(z)$$</div><div class="formula-sub">Modulus times a unit complex exponential. The cleanest notation in all of complex analysis — and the form we will use from Section 7 onward.</div></div>

<div class="l-highlight"><strong>The most beautiful corollary.</strong> Set θ = π in Euler's formula. We get $e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1 + 0\\,i = -1$. Rearranging: $\\boxed{e^{i\\pi} + 1 = 0}$. Five fundamental constants — 0, 1, π, e, i — bound into one short equation, with addition, multiplication, and exponentiation each appearing exactly once. Many mathematicians call it the most beautiful identity ever written.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Rewrite z = 3 + 4i in exponential form.</strong><br><br>From Section 5: |z| = 5, arg(z) ≈ 0.9273 rad. Therefore<br><br>z = 5·e<sup>i·0.9273</sup>.<br><br>Three pieces of information (real part, imaginary part, the symbol i) just collapsed into two (modulus, argument) packaged in a single exponential.</div></div>

<h2 class="lesson-title">7. Multiplication as Rotation and Scaling</h2>

<div class="calc-highlight"><strong>This is the geometric punchline of complex numbers.</strong> Once both factors are in exponential form, complex multiplication splits into two independent moves: <em>multiply the lengths, add the angles</em>. Algebra in rectangular form looks like a tangled cross-multiplication; in exponential form it becomes one line.</div>

<p class="l-text">Take two complex numbers in exponential form: $z = r_1 e^{i\\theta_1}$ and $w = r_2 e^{i\\theta_2}$. The usual laws of exponents apply:</p>

<div class="calc-formula"><div class="formula-label">MULTIPLICATION IN EXPONENTIAL FORM</div><div class="formula-main">$$z\\,w = (r_1 r_2)\\,e^{i(\\theta_1 + \\theta_2)}$$</div><div class="formula-sub">Moduli multiply: |zw| = |z|·|w|. Arguments add: arg(zw) = arg(z) + arg(w). Two scalar rules instead of one mess.</div></div>

<p class="l-text">Translated back into geometry: <strong>multiplying by w rotates the plane by arg(w) and scales it by |w|</strong>. Each complex number, viewed as a multiplier, is a rotation-plus-scaling operator on the plane.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Multiply by i = rotate 90°</div><div class="card-body">i = e<sup>iπ/2</sup>, so |i| = 1 and arg(i) = π/2. Multiplying any z by i rotates it 90° counter-clockwise without changing its length. Multiplying by i four times (i⁴ = 1) returns to the start.</div></div>
<div class="calc-card"><div class="card-title">Multiply by −1 = rotate 180°</div><div class="card-body">−1 = e<sup>iπ</sup>. Length unchanged, direction flipped. The familiar "negation" is just a half-turn rotation in the plane.</div></div>
<div class="calc-card"><div class="card-title">Multiply by 2 = scale by 2</div><div class="card-body">2 = 2·e<sup>i·0</sup>. Length doubles, angle unchanged. Multiplication by a positive real is pure scaling.</div></div>
<div class="calc-card"><div class="card-title">Multiply by ½·e<sup>iπ/3</sup></div><div class="card-body">Length halved, rotation by 60° counter-clockwise. The two effects are independent and you can read them straight off the multiplier.</div></div>
</div>

<div id="plot-l1-rotscale-en" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var z={r:2,th:Math.PI/6};
var zx=z.r*Math.cos(z.th),zy=z.r*Math.sin(z.th);
var rotations=[{name:'z (start)',mult:1,col:'#3b82f6',ang:0},{name:'z · e^{iπ/4} (rot 45°)',mult:1,col:'#f97316',ang:Math.PI/4},{name:'z · e^{iπ/2} = iz (rot 90°)',mult:1,col:'#10b981',ang:Math.PI/2},{name:'2z · e^{iπ/4} (scale ×2, rot 45°)',mult:2,col:'#a855f7',ang:Math.PI/4}];
var traces=[];
for(var i=0;i<rotations.length;i++){
  var R=rotations[i];var r2=z.r*R.mult;var th2=z.th+R.ang;
  var x=r2*Math.cos(th2);var y=r2*Math.sin(th2);
  traces.push({x:[0,x],y:[0,y],mode:'lines+markers',name:R.name,line:{color:R.col,width:2.4},marker:{size:[0,10],color:R.col}});
}
var circle1x=[],circle1y=[];for(var k=0;k<=120;k++){var a=k*2*Math.PI/120;circle1x.push(2*Math.cos(a));circle1y.push(2*Math.sin(a));}
var circle2x=[],circle2y=[];for(var k=0;k<=120;k++){var a=k*2*Math.PI/120;circle2x.push(4*Math.cos(a));circle2y.push(4*Math.sin(a));}
traces.push({x:circle1x,y:circle1y,mode:'lines',name:'|w|=2 (original radius)',line:{color:'rgba(255,255,255,0.18)',width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'});
traces.push({x:circle2x,y:circle2y,mode:'lines',name:'|w|=4 (scaled radius)',line:{color:'rgba(255,255,255,0.12)',width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4.5,4.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4.5,4.5]},margin:{t:40,r:30,b:50,l:60},showlegend:true,legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-rotscale-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the starting vector z = 2·e<sup>iπ/6</sup> (blue) is rotated and scaled by various multipliers. Orange: rotate 45° (multiply by e<sup>iπ/4</sup>). Green: rotate 90° (multiply by i = e<sup>iπ/2</sup>). Purple: rotate 45° <em>and</em> double the length (multiply by 2·e<sup>iπ/4</sup>). The dotted circles mark the modulus rings |w| = 2 and |w| = 4. Each operation is independent: rotation does not change length, scaling does not change angle.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute (1 + i)(1 − i) two ways.</strong><br><br><em>Rectangular:</em> (1 + i)(1 − i) = 1 − i + i − i² = 1 − (−1) = <strong>2</strong>.<br><br><em>Polar:</em> 1 + i = √2·e<sup>iπ/4</sup>, 1 − i = √2·e<sup>−iπ/4</sup>. Product: (√2)(√2)·e<sup>i(π/4 − π/4)</sup> = 2·e<sup>0</sup> = <strong>2</strong>.<br><br>The polar route reveals the cancellation: opposite arguments add to zero, the result lands on the positive real axis. The rectangular route works but hides the geometry.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If multiplying by i rotates 90° counter-clockwise, what does multiplying by −i do? Same length, opposite angle: rotate 90° <em>clockwise</em>. Two clockwise quarter-turns = one half-turn, matching (−i)² = i²·(−1)² = −1. Geometry and algebra march in step.</div></div>

<h2 class="lesson-title">8. Complex Conjugate</h2>

<p class="l-text">The complex conjugate is a small operation with outsized usefulness. It reflects a complex number across the real axis.</p>

<div class="calc-formula"><div class="formula-label">DEFINITION</div><div class="formula-main">$$\\overline{z} = \\overline{a + b\\,i} = a - b\\,i$$</div><div class="formula-sub">Flip the sign of the imaginary part. Geometrically, reflect z across the real axis.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">|z|² = z·z̄</div><div class="card-body">Multiplying z by its conjugate gives a²+b² — a real, non-negative number, exactly the squared modulus. This identity is the workhorse behind every division in ℂ.</div></div>
<div class="calc-card"><div class="card-title">Re(z) = (z + z̄)/2</div><div class="card-body">Adding z and z̄ cancels the imaginary parts, leaving 2a. Dividing by 2 recovers Re(z). Symmetric average.</div></div>
<div class="calc-card"><div class="card-title">Im(z) = (z − z̄)/(2i)</div><div class="card-body">Subtracting z̄ from z cancels the real parts, leaving 2bi. Dividing by 2i recovers Im(z). Antisymmetric difference.</div></div>
<div class="calc-card"><div class="card-title">Conjugate distributes</div><div class="card-body">$\\overline{z + w} = \\overline{z} + \\overline{w}$, $\\overline{z\\,w} = \\overline{z}\\cdot\\overline{w}$, $\\overline{z^n} = \\overline{z}^{\\,n}$. The conjugation operation respects every algebraic operation.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">CONJUGATE IN EXPONENTIAL FORM</div><div class="formula-main">$$z = r\\,e^{i\\theta} \\;\\implies\\; \\overline{z} = r\\,e^{-i\\theta}$$</div><div class="formula-sub">The modulus is unchanged; the argument flips sign. Reflection across the real axis = angle negation.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Take z = 3 + 4i.</strong> Then z̄ = 3 − 4i.<br><br>z·z̄ = (3 + 4i)(3 − 4i) = 9 − 12i + 12i − 16i² = 9 + 16 = <strong>25</strong>.<br><br>And |z|² = 5² = 25. ✔ The identity |z|² = z·z̄ checks out.</div></div>

<div class="l-note"><strong>Why we love conjugates:</strong> they are the cleanest way to extract a real number from a complex one. Division by w becomes "multiply by w̄ / |w|²". Inner products in complex vector spaces are defined with a conjugate to keep the result a real, non-negative norm. Every "complex thing has a real measurement" statement in physics and engineering ultimately rests on the conjugate.</div>

<h2 class="lesson-title">9. De Moivre's Theorem and Roots of Unity</h2>

<p class="l-text">Applying the multiplication rule to a number multiplied by itself n times gives an immediate generalisation:</p>

<div class="calc-formula"><div class="formula-label">DE MOIVRE'S THEOREM</div><div class="formula-main">$$(\\cos\\theta + i\\sin\\theta)^{n} = \\cos(n\\theta) + i\\sin(n\\theta)$$</div><div class="formula-sub">Or in exponential form: $(e^{i\\theta})^{n} = e^{i n \\theta}$. The argument scales linearly with the power; the modulus (here 1) is unchanged.</div></div>

<p class="l-text">Reversing the process gives a recipe for n-th roots. To solve $z^n = w$ for z, write w in exponential form and take the n-th root of the modulus and the (k-shifted) n-th of the argument:</p>

<div class="calc-formula"><div class="formula-label">N-TH ROOTS OF w</div><div class="formula-main">$$z_k = r^{1/n}\\,e^{\\,i\\,(\\theta + 2\\pi k)/n}, \\qquad k = 0, 1, 2, \\dots, n-1$$</div><div class="formula-sub">There are exactly n distinct n-th roots. The factor 2πk reflects the multi-valuedness of arg: adding a full turn before dividing by n gives a new root.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Roots of unity</div><div class="card-body">The n-th roots of 1 are $e^{2\\pi i k / n}$ for k = 0, 1, ..., n−1. All have modulus 1, so they sit on the unit circle, equally spaced by angle 2π/n.</div></div>
<div class="calc-card"><div class="card-title">They form a regular polygon</div><div class="card-body">Connect successive roots and you get a regular n-gon inscribed in the unit circle, with one vertex at z = 1. The 8th roots draw an octagon; the 6th roots draw a hexagon.</div></div>
<div class="calc-card"><div class="card-title">They sum to zero</div><div class="card-body">For n ≥ 2, the n-th roots of unity always sum to zero (geometric symmetry: the regular polygon's centroid is the origin). A small but useful identity.</div></div>
</div>

<div id="plot-l1-roots-en" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=8;
var rx=[];var ry=[];var labels=[];
for(var k=0;k<n;k++){var a=2*Math.PI*k/n;rx.push(Math.cos(a));ry.push(Math.sin(a));labels.push('ω^'+k);}
var poly={x:rx.concat([rx[0]]),y:ry.concat([ry[0]]),mode:'lines',name:'regular octagon',line:{color:'rgba(59,130,246,0.45)',width:1.6}};
var pts={x:rx,y:ry,mode:'markers+text',name:'8th roots of unity',marker:{size:11,color:'#3b82f6'},text:labels,textposition:'top right',textfont:{color:'#e8e8e8',size:11}};
var circx=[],circy=[];for(var k=0;k<=200;k++){var a=k*2*Math.PI/200;circx.push(Math.cos(a));circy.push(Math.sin(a));}
var circ={x:circx,y:circy,mode:'lines',name:'unit circle |z|=1',line:{color:'rgba(255,255,255,0.20)',width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'};
var spokes=[];for(var k=0;k<n;k++){var a=2*Math.PI*k/n;spokes.push({x:[0,Math.cos(a)],y:[0,Math.sin(a)],mode:'lines',line:{color:'rgba(59,130,246,0.30)',width:1},showlegend:false,hoverinfo:'skip'});}
var data=spokes.concat([circ,poly,pts]);
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-1.5,1.6],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-1.4,1.4]},margin:{t:40,r:30,b:50,l:60},showlegend:true,legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-roots-en',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> the eight 8th roots of unity, ω<sup>k</sup> = e<sup>2πik/8</sup>, plotted on the unit circle. Spoke segments connect each root to the origin; the outer polygon connects successive roots to make a regular octagon. The same pattern repeats for any n: n equally spaced points on the unit circle, forming a regular n-gon.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Find all cube roots of 8.</strong> Write 8 = 8·e<sup>i·0</sup>. The cube roots are<br><br>z<sub>k</sub> = 8<sup>1/3</sup>·e<sup>i·(0 + 2πk)/3</sup> = 2·e<sup>i·2πk/3</sup>, &nbsp;k = 0, 1, 2.<br><br>k = 0: 2·e<sup>0</sup> = <strong>2</strong> (the obvious real cube root).<br>k = 1: 2·e<sup>i·2π/3</sup> = 2(cos 120° + i sin 120°) = <strong>−1 + i√3</strong>.<br>k = 2: 2·e<sup>i·4π/3</sup> = 2(cos 240° + i sin 240°) = <strong>−1 − i√3</strong>.<br><br>Three distinct cube roots — exactly what the Fundamental Theorem of Algebra promises for the cubic z³ − 8 = 0.</div></div>

<h2 class="lesson-title">10. Geometry of Complex Numbers</h2>

<p class="l-text">Many classical geometric constructions become one-line algebraic statements in the complex plane.</p>

<div class="calc-formula"><div class="formula-label">DISTANCE BETWEEN TWO POINTS</div><div class="formula-main">$$d(z, w) = |z - w|$$</div><div class="formula-sub">The Euclidean distance between the points z and w is the modulus of their difference. Same fact as $\\sqrt{(a-c)^2 + (b-d)^2}$, written shorter.</div></div>

<div class="calc-formula"><div class="formula-label">CIRCLE OF RADIUS r CENTRED AT z<sub>0</sub></div><div class="formula-main">$$|z - z_0| = r$$</div><div class="formula-sub">All points whose distance from z<sub>0</sub> equals r — the defining property of a circle, expressed in one symbol.</div></div>

<div class="calc-formula"><div class="formula-label">PERPENDICULAR BISECTOR OF a AND b</div><div class="formula-main">$$|z - a| = |z - b|$$</div><div class="formula-sub">The set of points equidistant from a and b — the perpendicular bisector of the segment joining them. Whole locus, one equation.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Disk |z − z<sub>0</sub>| &lt; r</div><div class="card-body">Open disk of radius r around z<sub>0</sub>. Strict inequality excludes the boundary. Used for "neighbourhood" in complex analysis.</div></div>
<div class="calc-card"><div class="card-title">Half-plane Re(z) &gt; 0</div><div class="card-body">The right half-plane (all points with positive real part). Inequalities on Re and Im carve out exactly the regions you would expect from Cartesian coordinates.</div></div>
<div class="calc-card"><div class="card-title">Ray arg(z) = π/4</div><div class="card-body">All non-zero points at angle 45°. A ray from the origin. Fixing arg gives a half-line; fixing modulus gives a circle.</div></div>
<div class="calc-card"><div class="card-title">Triangle inequality</div><div class="card-body">|z + w| ≤ |z| + |w|, with equality only when z and w point in the same direction. The familiar 2D triangle inequality, written in complex notation.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Describe the locus |z − (1 + i)| = 2.</strong><br><br>Distance from z to the point 1 + i equals 2. That is a <strong>circle of radius 2 centred at (1, 1)</strong>. One equation, full picture.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">What region of the plane is described by |z − 1| &lt; |z + 1|? (Hint: "closer to 1 than to −1" — the right half-plane Re(z) &gt; 0.)</div></div>

<h2 class="lesson-title">11. Application: AC Circuits and Impedance</h2>

<p class="l-text">The first big payoff outside pure mathematics arrived in the 1890s with electrical engineering. For DC circuits Ohm's law reads V = IR — voltage equals current times resistance. For AC circuits at angular frequency ω, the same equation works if we replace the real resistance R with a complex <strong>impedance</strong> Z that captures both the magnitude of opposition to current and the phase shift between current and voltage.</p>

<div class="calc-formula"><div class="formula-label">COMPLEX OHM'S LAW</div><div class="formula-main">$$V = I\\,Z$$</div><div class="formula-sub">All three quantities are complex phasors — magnitudes paired with phase angles. One equation for both amplitude and phase.</div></div>

<div class="calc-formula"><div class="formula-label">IMPEDANCES OF THE THREE BASIC COMPONENTS</div><div class="formula-main">$$Z_R = R, \\qquad Z_L = i\\omega L, \\qquad Z_C = \\frac{1}{i\\omega C}$$</div><div class="formula-sub">Resistor: real. Inductor: positive imaginary (current lags voltage by 90°). Capacitor: negative imaginary (current leads voltage by 90°). The geometry of multiplication does the work.</div></div>

<p class="l-text">In a series RLC circuit the total impedance is the sum $Z = R + i\\omega L + 1/(i\\omega C) = R + i(\\omega L - 1/(\\omega C))$. Its modulus tells you how much the circuit resists current of frequency ω; its argument tells you the phase lag between voltage and current. The complex algebra of Sections 3 and 7 collapses pages of differential equations into a single line.</p>

<div class="l-note"><strong>The elegance:</strong> without complex numbers, AC circuit analysis is sinusoidal trigonometry — every quantity carries an amplitude and a phase, and combining them means trig identities everywhere. With impedances, every component is a single complex number, and Kirchhoff's laws become linear algebra over ℂ. The complex multiplication rule (|z||w|, arg z + arg w) is exactly the right operation for combining sinusoidal amplitudes and phases — a coincidence in arithmetic that turned out to be the physics.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>RLC series with R = 10 Ω, L = 0.1 H, C = 100 μF, ω = 100 rad/s.</strong><br><br>Z<sub>L</sub> = i·100·0.1 = 10i Ω.<br>Z<sub>C</sub> = 1/(i·100·100·10⁻⁶) = 1/(0.01i) = −100i Ω.<br>Z = 10 + 10i − 100i = 10 − 90i Ω.<br><br>|Z| = √(100 + 8100) = √8200 ≈ 90.55 Ω.<br>arg(Z) = atan2(−90, 10) ≈ −1.46 rad ≈ −83.7°.<br><br>So a 1 A current would produce a voltage of ~90.55 V leading the current by about 83.7° (since arg is negative — the load looks capacitive at this frequency).</div></div>

<h2 class="lesson-title">12. Brief Modern Glimpses</h2>

<p class="l-text">Complex numbers underpin a remarkable range of modern physics and engineering, far beyond the classical scope of this lesson. A short tour to show where the road leads:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Quantum mechanics</div><div class="card-body">A particle's state is described by a complex-valued wavefunction ψ. Probabilities come from |ψ|². The Schrödinger equation, $i\\hbar\\,\\partial_t \\psi = \\hat{H}\\psi$, has an explicit i in it — complex numbers are not optional, they are constitutive.</div></div>
<div class="calc-card"><div class="card-title">Fourier analysis</div><div class="card-body">Every Fourier transform integral is written as $\\int f(t)\\,e^{-i\\omega t}\\,dt$ — a complex-valued projection. The whole spectral picture (modulus = amplitude, argument = phase) only works because complex numbers exist.</div></div>
<div class="calc-card"><div class="card-title">Holomorphic functions</div><div class="card-body">Functions ℂ → ℂ that are differentiable in the complex sense (Cauchy-Riemann, Lesson 2) have astonishing rigidity: differentiable once means differentiable infinitely many times, determined globally by their values on a tiny disk. Real analysis has no analog.</div></div>
<div class="calc-card"><div class="card-title">Complex-valued neural networks</div><div class="card-body">A niche but active research area (CV-Net, CVNN). Useful for tasks where phase matters intrinsically — MRI reconstruction, radar, certain wireless signal models. Mainstream machine learning is overwhelmingly real-valued; complex networks are a small specialised branch, worth knowing exists but not where most of the field lives.</div></div>
</div>

<div class="l-note"><strong>Honest about the AI link:</strong> unlike calculus, linear algebra, or probability, complex numbers are <em>not</em> a daily tool in modern machine learning. The vast majority of ML — gradient descent, transformers, diffusion models — runs on real-valued tensors. Where complex numbers do appear in ML, it is usually borrowed from signal processing or physics. Do not let anyone sell you complex numbers as an "ML prerequisite" beyond a working comfort with phasors when you encounter Fourier-based papers. The reason to learn them is that they are gorgeous mathematics with deep applications in physics, electrical engineering, and the rest of complex analysis — which is where Lessons 2 through 6 will take you.</div>

<h2 class="lesson-title">13. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<div class="l-note"><strong>What to take away from the exercise:</strong> Python treats complex numbers as a built-in scalar type — no third-party library needed for arithmetic. NumPy extends the same machinery to arrays, so you can do element-wise complex operations on entire datasets. <code>cmath</code> supplies the complex versions of math functions (exp, log, sqrt, sin, etc.) that return complex outputs for any complex input. The Argand plot, the impedance computation, the n-th roots — all of it is two-line code once you internalise that complex numbers are 2D numbers obeying the multiplication rule (multiply moduli, add arguments).</div>

<div class="l-warn"><strong>Next (Lesson 2):</strong> we promote z from a number to the input of a function. Complex functions f: ℂ → ℂ; limits, continuity, and the surprisingly strict notion of being "differentiable in the complex sense." That single condition — the Cauchy-Riemann equations — turns out to be so restrictive that any function passing it inherits an entire universe of consequences. We will set up the stage in Lesson 2 and unleash the consequences (Cauchy's theorem, residues, conformal maps) in Lessons 3 through 6.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/68" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Karmaşık Sayılar Giriş</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L68)</span></li>
<li><a href="/tutorials/matematik/69" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Karmaşık İşlemler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L69)</span></li>
<li><a href="/tutorials/matematik/70" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Kutupsal Form</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L70)</span></li>
<li><a href="/tutorials/matematik/71" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">De Moivre &amp; Kökler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L71)</span></li>
</ul>
</div>
<p class="l-text"><strong>Karmaşık sayılar, 2 boyutlu sayılardır.</strong> Bu cümle hiç fanfar veya özür gerektirmeden gelmeli — çünkü onu ciddiye aldığınızda, <em>i</em> hakkında kafa karıştırıcı olan neredeyse her şey buharlaşıyor. "Sanal" kısım metafiziksel bir iddia değil; sadece düzlemdeki bir noktanın ikinci koordinatıdır. <em>i² = −1</em> kuralı ise bu noktaların cebrini <em>ilginç</em> kılan tek kuraldır — ve geometrik olarak yaptığı şey döndürmektir.</p>

<p class="l-text">Lisede size <em>i</em> sembolü muhtemelen bir tuhaflık olarak verildi: "Karesi −1 olan bir sayı icat ettik, çünkü istedik." Bu açıklama teknik olarak doğru ama duygusal olarak yanıltıcıdır. Karmaşık sayılar can sıkıntısından icat edilmedi. Onlarsız bir problemi bitiremeyen matematikçilere zorla kabul ettirildi. Bu ders o zorunluluğu geri kazanır, ardından <em>i</em>'nin artık sanal hissettirmemesini sağlayan geometrik resmi kurar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Karmaşık sayıların kaçınılmaz olduğu tarihsel nedeni — Cardano'nun kübiği ve Bombelli'den Argand'a, Hamilton'a uzanan yol</li>
<li>Her z = a + bi karmaşık sayısını 2B düzlemde tek bir nokta olarak okumayı; modül |z| ve argüman arg(z) ile</li>
<li>Karmaşık sayıları dikdörtgen formda akıcı biçimde toplayıp çıkarmayı, çarpmayı, bölmeyi ve hangi formun hangi işe uygun olduğunu bilmeyi</li>
<li>Euler formülünü Taylor serilerinden türetmeyi ve hesaplama için kutupsal/üstel form z = r·e^{iθ} kullanmayı</li>
<li>Karmaşık çarpmayı "argümana göre döndür, modüle göre ölçekle" olarak yorumlamayı — dersin geometrik kalbi</li>
<li>De Moivre teoremini uygulayıp birim köklerini hesaplamayı ve AC devreleri tek zarif denklemle tanımlamak için karmaşık empedansı kullanmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Neden Karmaşık Sayılar? Tarihsel Zorunluluk</h2>

<div class="calc-highlight"><strong>Net hikaye:</strong> matematikçiler oturup eğlence olsun diye "eksi birin karekökü" icat etmediler. <em>Gerçel</em> köklerine ancak hesabın ortasında negatif sayıların kareköklerinden geçerek ulaşılabilen gerçel polinom denklemlerini çözmeye çalışıyorlardı. Ara adımlar daha geniş bir sayı sistemi talep etti; nihai cevaplar gerçel doğruya geri döndü. Karmaşık sayılar varlıklarını zor yoldan kazandı.</div>

<p class="l-text">Belirleyici olay Gerolamo Cardano'nun 1545 tarihli <em>Ars Magna</em> adlı çalışmasıdır; orada x³ + px + q = 0 kübik denklemini çözen bir formül yayımladı. Formül gerçektir ve çalışır:</p>

<div class="calc-formula"><div class="formula-label">CARDANO FORMÜLÜ</div><div class="formula-main">$$x = \\sqrt[3]{-\\tfrac{q}{2} + \\sqrt{\\tfrac{q^2}{4} + \\tfrac{p^3}{27}}} + \\sqrt[3]{-\\tfrac{q}{2} - \\sqrt{\\tfrac{q^2}{4} + \\tfrac{p^3}{27}}}$$</div><div class="formula-sub">p ve q'yu yerine koy, küp kökleri al, topla. Birçok kübik için gerçel kökü temizce verir.</div></div>

<p class="l-text">Ama x³ − 15x − 4 = 0 deneyin. Gözle x = 4 bir köktür (64 − 60 − 4 = 0). Cardano formülü ise iç karekökün altındaki ifadeyi gerektirir:</p>

<div class="calc-formula"><div class="formula-label">UTANÇ</div><div class="formula-main">$$\\frac{q^2}{4} + \\frac{p^3}{27} = \\frac{16}{4} + \\frac{(-15)^3}{27} = 4 - 125 = -121$$</div><div class="formula-sub">Karekök altında negatif bir sayı — nihai cevap x = 4 mükemmel biçimde gerçel olmasına rağmen tüm hesabı tıkayan bir engel.</div></div>

<p class="l-text">16. yüzyıl matematikçileri bir yol ayrımıyla karşılaştı: ya formülü bozuk ilan edip uzaklaşacak ya da <strong>gerçel bir cevaba giden yolun negatif sayıların kareköklerinden geçmeyi gerektirebileceğini</strong> kabul edecekti. Rafael Bombelli (1572) ikinci yolu seçti. $\\sqrt{-121}$'i $11\\sqrt{-1}$ olarak biçimsel biçimde manipüle etti, $(\\sqrt{-1})^2 = -1$ kuralıyla cebri yürüttü ve sanal kısımların tam olarak iptal olup x = 4'ü bıraktığını izledi. "İmkansız" sapma işe yaradı. O andan itibaren karmaşık sayılar artık bir tuhaflık değil — bir araç haline geldi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cardano (1545)</div><div class="card-body">Kübik formülü yayımlar. Bazı kübiklerin "sofistik" miktarları (negatif sayıların kareköklerini böyle isimlendirir) zorladığını not eder ama onları yorumlayamaz.</div></div>
<div class="calc-card"><div class="card-title">Bombelli (1572)</div><div class="card-body">Cebirsel kuralları kurar: √(−1) içeren ifadeleri nasıl toplayacağını, çarpacağını ve sadeleştireceğini gösterir. i'yi manipüle edilebilir bir sembol olarak ciddiye alan ilk kişi.</div></div>
<div class="calc-card"><div class="card-title">Argand &amp; Gauss (~1800)</div><div class="card-body">Bağımsız olarak geometrik yorumu önerirler: her karmaşık sayı 2B düzlemde bir noktadır. "Sanal" gizemi vektörlere ve açılara çözünür.</div></div>
<div class="calc-card"><div class="card-title">Hamilton (1837)</div><div class="card-body">Karmaşık sayıları, sıkı toplama ve çarpma kurallarıyla reel sayıların sıralı çiftleri (a, b) olarak yeniden formüle eder. Gizemli √(−1)'e başvurmaz — sadece tanımlar.</div></div>
</div>

<div class="l-note"><strong>Tarihten ders:</strong> <em>i</em> sembolü doğada yüzerken keşfettiğimiz bir sayı değil. Polinom denklemlerinin tutarlı davranması için kuralları seçilmiş bir gösterim aracıdır. Geometrik anlam sonradan geldi — ama geldiğinde, ondan başka bir cebir hayal etmek imkansız hale geldi.</div>

<h2 class="lesson-title">2. Tanım</h2>

<p class="l-text">Hamilton'ı izleyerek sistemi temiz ve gizemsiz biçimde tanımlıyoruz.</p>

<div class="calc-formula"><div class="formula-label">SANAL BİRİM</div><div class="formula-main">$$i^2 = -1$$</div><div class="formula-sub">Tüm tanım bundan ibaret. Geri kalan her şey cebirden ve bu tek kuraldan gelir.</div></div>

<div class="calc-formula"><div class="formula-label">BİR KARMAŞIK SAYI</div><div class="formula-main">$$z = a + b\\,i, \\qquad a, b \\in \\mathbb{R}$$</div><div class="formula-sub">i sembolü ile bağlanmış iki reel sayı a ve b. Reel kısım a; sanal kısım b'dir (isme rağmen reel bir sayıdır).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reel kısım Re(z)</div><div class="card-body">z = a + bi içindeki a sayısı. Re(z) = a olarak yazılır. z çizildiğinde yatay eksende yer alır.</div></div>
<div class="calc-card"><div class="card-title">Sanal kısım Im(z)</div><div class="card-body">z = a + bi içindeki b sayısı. Im(z) = b olarak yazılır. Tarihsel isme rağmen b sıradan bir reel sayıdır — i'nin katsayısı.</div></div>
<div class="calc-card"><div class="card-title">ℂ kümesi</div><div class="card-body">Tüm karmaşık sayıların kümesi. b = 0 alt kümesi olarak ℝ'yi, a = 0 alt kümesi olarak da saf sanal ekseni içerir.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">EŞİTLİK</div><div class="formula-main">$$z = w \\iff \\operatorname{Re}(z) = \\operatorname{Re}(w) \\;\\text{and}\\; \\operatorname{Im}(z) = \\operatorname{Im}(w)$$</div><div class="formula-sub">İki karmaşık sayı, tam olarak iki koordinat eşleştiğinde eşittir. Sıralı çiftler olmalarının anlamı budur.</div></div>

<div class="calc-example"><div class="example-label">HIZLI KONTROLLER</div><div class="example-body">z = 3 + 4i &nbsp;→&nbsp; Re(z) = 3, Im(z) = 4.<br>z = −2 &nbsp;→&nbsp; Re(z) = −2, Im(z) = 0. Reel bir sayı, sanal kısmı sıfır olan karmaşık sayıdır.<br>z = 5i &nbsp;→&nbsp; Re(z) = 0, Im(z) = 5. Saf sanal sayı düşey eksende oturur.<br>z = 0 &nbsp;→&nbsp; Re(z) = 0, Im(z) = 0. Düzlemin başlangıç noktası.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">"i" sıfırdan büyük mü, küçük mü, yoksa hiçbiri mi? Tuzak soru — karmaşık sayılar, reel sayılar gibi sıralanamaz. Bir karmaşık sayının diğerinden "küçük" olduğunu tutarlı biçimde söylemenin bir yolu yoktur. Onların <em>büyüklüğünü</em> bunun yerine modül ile ölçeceğiz.</div></div>

<h2 class="lesson-title">3. Cebirsel İşlemler</h2>

<p class="l-text">Dört aritmetik işlem de reel sayılardan taşınır; <em>i</em>'yi bir sembol olarak ele alıp her görüldüğünde $i^2$'yi −1'e indirgeriz.</p>

<div class="calc-formula"><div class="formula-label">TOPLAMA (KOORDİNAT KOORDİNAT)</div><div class="formula-main">$$(a + b\\,i) + (c + d\\,i) = (a + c) + (b + d)\\,i$$</div><div class="formula-sub">Reel kısımlar toplanır. Sanal kısımlar toplanır. Tam olarak 2B vektör toplama kuralı.</div></div>

<div class="calc-formula"><div class="formula-label">ÇARPMA (DAĞIT, SONRA i² = −1 KULLAN)</div><div class="formula-main">$$(a + b\\,i)(c + d\\,i) = a c + a d\\,i + b c\\,i + b d\\,i^2 = (a c - b d) + (a d + b c)\\,i$$</div><div class="formula-sub">bd·i² terimi işaret değiştirir ve reel kısma katılır. Kalan çapraz terimler yeni sanal kısmı oluşturur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>(2 + 3i)(4 − i) çarpımı:</strong><br><br>= 2·4 + 2·(−i) + 3i·4 + 3i·(−i)<br>= 8 − 2i + 12i − 3i²<br>= 8 − 2i + 12i + 3 &nbsp;&nbsp;(i² = −1 olduğundan)<br>= <strong>11 + 10i</strong> ✔</div></div>

<p class="l-text">Bu kurallar ℂ'yi bir <strong>cisim</strong> yapar — ℝ ile aynı cebirsel yapı. Toplama değişmeli ve birleşmelidir, çarpma değişmeli ve birleşmelidir, çarpma toplama üzerine dağılır, her sıfırdan farklı eleman bir tersine sahiptir:</p>

<div class="calc-formula"><div class="formula-label">ÇARPMA TERSİ</div><div class="formula-main">$$\\frac{1}{a + b\\,i} = \\frac{a - b\\,i}{a^2 + b^2}$$</div><div class="formula-sub">Pay ve paydayı eşlenikle (a − bi) çarp. Payda reel a² + b² sayısına dönüşür. Paydada artık i yok.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">+, −, ×, ÷ altında kapalı</div><div class="card-body">Karmaşık sayıların herhangi bir aritmetik kombinasyonu (paydası sıfırdan farklı olmak üzere) yine karmaşıktır. Sistem sızdırmaz.</div></div>
<div class="calc-card"><div class="card-title">Dağılma yasası</div><div class="card-body">z(w + v) = zw + zv. Reel cebirde olduğu gibi toplam çarpımlarını açmanıza olanak verir.</div></div>
<div class="calc-card"><div class="card-title">Değişmeli</div><div class="card-body">zw = wz ve z + w = w + z. Operandların sırası her iki işlem için de önemli değil.</div></div>
<div class="calc-card"><div class="card-title">Birleşmeli</div><div class="card-body">(zw)v = z(wv). Uzun çarpımlarda ve toplamlarda parantezler serbestçe yeniden gruplanabilir.</div></div>
</div>

<div class="calc-example"><div class="example-label">BÖLME ÖRNEĞİ</div><div class="example-body"><strong>(3 + 2i) / (1 − i) hesabı:</strong><br><br>Pay ve paydayı paydanın eşleniğiyle, (1 + i) ile çarp:<br>= [(3 + 2i)(1 + i)] / [(1 − i)(1 + i)]<br>= (3 + 3i + 2i + 2i²) / (1 − i²)<br>= (3 + 5i − 2) / (1 + 1)<br>= (1 + 5i) / 2 = <strong>½ + (5/2)i</strong></div></div>

<div class="l-note"><strong>ℝ'ye göre kaybettiğimiz:</strong> sıralama. Çarpma ile tutarlı bir "z pozitiftir" veya "z > w" kavramı yoktur. Kazandığımız muazzamdır: karmaşık katsayılı n. dereceden her polinomun (çokluklarla sayıldığında) tam olarak n karmaşık kökü vardır. Bu, Cebirin Temel Teoremidir ve karmaşık sayılar kabul edildikten sonra tam olarak kanıtlanmıştır.</div>

<h2 class="lesson-title">4. Karmaşık Düzlem (Argand Diyagramı)</h2>

<div class="calc-highlight"><strong>Dersteki en önemli resim.</strong> z = a + bi'yi (a, b) koordinatlarına sahip nokta olarak çiz. Yatay eksen reel kısmı; düşey eksen sanal kısmı taşır. Bütün 2B düzlem artık ℂ'dir. Bu resimden sonra her cebirsel özdeşlik geometrik bir anlam kazanır.</div>

<p class="l-text">İki sonuç hemen yerine oturur:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Toplama, vektör toplamasıdır</div><div class="card-body">(a + bi) + (c + di) = (a + c) + (b + d)i — (a, b) ve (c, d) konum vektörlerini uç uca eklemekle aynı kural. Karmaşık toplamanın geometrisi paralelkenar kuralıdır.</div></div>
<div class="calc-card"><div class="card-title">Çıkarma yer değiştirmeyi verir</div><div class="card-body">z − w, w'den z'ye işaret eden vektördür. Modülü |z − w| iki nokta arasındaki Öklit uzaklığıdır — 10. Bölümde sürekli kullanacağımız bir gerçek.</div></div>
<div class="calc-card"><div class="card-title">Reel sayılar x-ekseninde yaşar</div><div class="card-body">b = 0 olduğunda nokta tam olarak reel ekseninde oturur. Tanıdık reel sayı doğrusu, karmaşık düzlemin içine yatay bir dilim olarak gömülmüştür.</div></div>
<div class="calc-card"><div class="card-title">Saf sanallar y-ekseninde</div><div class="card-body">a = 0 olduğunda nokta sanal eksende oturur. Saf sanal sayılar kümesi başlangıç noktasından geçen düşey bir doğrudur. i ile çarpmak sizi bu iki eksen arasında 90° hareket ettirir.</div></div>
</div>

<div id="plot-l1-argand-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pts={x:[3,-2,0,1.5,-1.5,2.5],y:[2,1,-2.5,-1,2,0],mode:'markers+text',name:'örnek sayılar',marker:{size:10,color:'#3b82f6'},text:['3+2i','-2+i','-2.5i','1.5-i','-1.5+2i','2.5'],textposition:'top right',textfont:{color:'#e8e8e8',size:12}};
var arrows=[];
var samples=[[3,2],[-2,1],[0,-2.5],[1.5,-1],[-1.5,2],[2.5,0]];
for(var i=0;i<samples.length;i++){arrows.push({x:[0,samples[i][0]],y:[0,samples[i][1]],mode:'lines',line:{color:'rgba(59,130,246,0.4)',width:1.5},showlegend:false,hoverinfo:'skip'});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4,4.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-3.5,3]},margin:{t:40,r:30,b:50,l:60},showlegend:true,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
var data=arrows.concat([pts]);
Plotly.newPlot('plot-l1-argand-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> Argand diyagramı, etiketli noktalar olarak çizilmiş altı örnek karmaşık sayı ile; her biri başlangıç noktasından çıkan bir konum vektörü olarak çizilmiş. Reel sayılar yatay eksende oturur (2.5), saf sanallar düşey eksende (−2.5i), genel karmaşık sayılar ise düzlemin geri kalanını doldurur. Eksenler, uzaklıkların ve açıların dürüst olması için eşit ölçekte çizilmiştir.</div></div>

<h2 class="lesson-title">5. Modül ve Argüman</h2>

<p class="l-text">z düzlemde bir nokta olduğunda iki başka sayı onu tanımlar: <strong>başlangıçtan ne kadar uzakta</strong> ve <strong>hangi açıda</strong>. Bunlar modül ve argümandır.</p>

<div class="calc-formula"><div class="formula-label">MODÜL</div><div class="formula-main">$$|z| = \\sqrt{a^2 + b^2}$$</div><div class="formula-sub">Başlangıç noktasından (a, b) noktasına Öklit uzaklığı. Daima negatif olmayan reel sayı. Mutlak değer ya da büyüklük olarak da bilinir.</div></div>

<div class="calc-formula"><div class="formula-label">ARGÜMAN</div><div class="formula-main">$$\\arg(z) = \\operatorname{atan2}(b, a)$$</div><div class="formula-sub">Pozitif reel eksenden z vektörüne saat yönünün tersine ölçülen açı. atan2 fonksiyonu doğru bölgeyi seçer; düz atan(b/a) işareti kaybeder ve zıt yönleri karıştırır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">|z| ≥ 0</div><div class="card-body">Modül yalnızca z = 0 olduğunda sıfırdır. Diğer her karmaşık sayı için kesinlikle pozitiftir — uzaklıklar negatif olamaz.</div></div>
<div class="calc-card"><div class="card-title">arg(z) çok değerlidir</div><div class="card-body">Bir açıya 2π'nin herhangi bir katını eklemek aynı yönü verir. Yani arg(z), arg(z) + 2π, arg(z) − 2π vb. hepsi aynı z'yi tanımlar. Tek bir değeri sabitlemek için (−π, π] aralığındaki temel argüman Arg(z)'yi kullanırız.</div></div>
<div class="calc-card"><div class="card-title">arg(0) tanımsızdır</div><div class="card-body">Sıfır vektörünün yönü yoktur. Başlangıç noktasının modülü 0'dır ve argümanı yoktur; bu tek istisna zararsız ama bilinmeye değer.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">KUTUPSAL (TRİGONOMETRİK) FORM</div><div class="formula-main">$$z = r\\,(\\cos \\theta + i\\,\\sin \\theta), \\qquad r = |z|, \\quad \\theta = \\arg(z)$$</div><div class="formula-sub">Argand resminden doğrudan okunur: yarıçap vektörünü iki eksene izdüşür, r ile çarp. Dikdörtgen form (a, b) ve kutupsal form (r, θ) aynı bilgiyi farklı koordinatlarla taşır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>z = 3 + 4i alalım:</strong><br><br>|z| = √(3² + 4²) = √(9 + 16) = √25 = <strong>5</strong>.<br>arg(z) = atan2(4, 3) ≈ 0.9273 rad ≈ <strong>53.13°</strong> — birinci bölge, y = x doğrusunun hemen üstünde.<br><br>Kutupsal form: z = 5·(cos 53.13° + i sin 53.13°). Aynı nokta, yatay-düşey bileşenler yerine uzaklık ve açıyla adlandırılmış.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>z = −1 + i alalım:</strong><br><br>|z| = √(1 + 1) = √2 ≈ <strong>1.414</strong>.<br>arg(z) = atan2(1, −1) = 3π/4 = <strong>135°</strong> — ikinci bölge. Düz atan(1/−1) = atan(−1) = −π/4 yanlış cevabı verirdi; atan2 her iki koordinatı da gördüğünden doğru bölgeyi seçer.</div></div>

<div id="plot-l1-modarg-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var samples=[{x:3,y:4,n:'3+4i',c:'#3b82f6'},{x:-1,y:1,n:'-1+i',c:'#f97316'},{x:-2,y:-2,n:'-2-2i',c:'#10b981'},{x:0,y:-3,n:'-3i',c:'#a855f7'}];
var traces=[];
for(var i=0;i<samples.length;i++){
  var s=samples[i];var r=Math.sqrt(s.x*s.x+s.y*s.y);var th=Math.atan2(s.y,s.x);
  traces.push({x:[0,s.x],y:[0,s.y],mode:'lines',name:s.n+' (|z|='+r.toFixed(2)+')',line:{color:s.c,width:2.4}});
  traces.push({x:[s.x],y:[s.y],mode:'markers+text',text:[s.n],textposition:'top right',marker:{size:10,color:s.c},textfont:{color:s.c,size:12},showlegend:false});
  var arcx=[];var arcy=[];var R=0.55;
  var start=0;var end=th;var step=(end-start)/40;
  for(var k=0;k<=40;k++){var a=start+k*step;arcx.push(R*Math.cos(a));arcy.push(R*Math.sin(a));}
  traces.push({x:arcx,y:arcy,mode:'lines',line:{color:s.c,width:1.2,dash:'dot'},showlegend:false,hoverinfo:'skip'});
}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4,5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im(z)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4,5]},margin:{t:40,r:30,b:50,l:60},showlegend:true,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-modarg-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> dört örnek karmaşık sayı, başlangıç noktasından çıkan yarıçap vektörleri olarak. Her vektörün uzunluğu modül |z|; noktalı yay argümanı (pozitif reel eksenden işaretli açı, saat yönünün tersi pozitiftir) gösterir. Üçüncü bölgedeki yeşil vektörün atan2 ile ölçüldüğünde <em>negatif</em> argümanı olduğuna ve doğrudan aşağı işaret eden mor vektörün argümanının tam olarak −π/2 olduğuna dikkat edin.</div></div>

<div class="think-box"><div class="think-label">KONTROL</div><div class="think-body">z = 1 − i'nin modülünü ve temel argümanını hesapla, ardından z'yi kutupsal formda yaz. (Cevap: |z| = √2, arg(z) = −π/4, yani z = √2·(cos(−π/4) + i sin(−π/4)).)</div></div>

<h2 class="lesson-title">6. Euler Formülü — Köprü</h2>

<div class="calc-highlight"><strong>Tüm matematikteki en önemli özdeşlik:</strong> $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$. Tipografik bir kaza gibi görünür — sanal argümanlı bir üstel — ama Taylor serileri tarafından bize zorla kabul ettirilir. Bir kez yerleştiğinde, kutupsal form (cos θ + i sin θ)'den çok daha temiz bir şeye dönüşür: tek bir üstel.</div>

<p class="l-text">Kalkülüsten tanıdığınız üç Taylor serisini hatırlayın:</p>

<div class="calc-formula"><div class="formula-label">TAYLOR SERİLERİ — ÜÇ YAPI TAŞI</div><div class="formula-main">$$e^{x} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\frac{x^5}{5!} + \\cdots$$</div><div class="formula-sub">Üstel fonksiyon, her reel x için geçerli.</div></div>

<div class="calc-formula"><div class="formula-label"></div><div class="formula-main">$$\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\cdots$$</div><div class="formula-sub">Sadece çift kuvvetler, işaretler + − + − ...</div></div>

<div class="calc-formula"><div class="formula-label"></div><div class="formula-main">$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\cdots$$</div><div class="formula-sub">Sadece tek kuvvetler, işaretler + − + − ...</div></div>

<p class="l-text">Şimdi üstel seriye x = iθ <strong>yerleştirin</strong>. Taylor serileri sonsuz polinomlardır ve polinomlar her girdiyi kabul eder — reel, sanal, karmaşık.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">e<sup>x</sup> serisine x = iθ yerleştir</div><div class="step-detail">$$e^{i\\theta} = 1 + i\\theta + \\frac{(i\\theta)^2}{2!} + \\frac{(i\\theta)^3}{3!} + \\frac{(i\\theta)^4}{4!} + \\frac{(i\\theta)^5}{5!} + \\cdots$$</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">i'nin kuvvetlerini sadeleştir — 4 periyodu ile döngü yaparlar</div><div class="step-detail">i¹ = i, &nbsp;i² = −1, &nbsp;i³ = −i, &nbsp;i⁴ = 1, &nbsp;i⁵ = i, &nbsp;i⁶ = −1, ... Bu döngü tüm türetmenin motorudur.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Döngüyü terim terim uygula</div><div class="step-detail">$$e^{i\\theta} = 1 + i\\theta - \\frac{\\theta^2}{2!} - i\\frac{\\theta^3}{3!} + \\frac{\\theta^4}{4!} + i\\frac{\\theta^5}{5!} - \\frac{\\theta^6}{6!} - i\\frac{\\theta^7}{7!} + \\cdots$$</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Reel ve sanal terimleri ayrı ayrı grupla</div><div class="step-detail">$$e^{i\\theta} = \\underbrace{\\Bigl(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\frac{\\theta^6}{6!} + \\cdots\\Bigr)}_{=\\,\\cos\\theta} + i\\underbrace{\\Bigl(\\theta - \\frac{\\theta^3}{3!} + \\frac{\\theta^5}{5!} - \\frac{\\theta^7}{7!} + \\cdots\\Bigr)}_{=\\,\\sin\\theta}$$</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Kosinüs ve sinüs serilerini tam olarak tanı</div><div class="step-detail">Reel parça parantezi cos θ'nin Taylor serisidir. Sanal parça parantezi sin θ'nin Taylor serisidir. Terim terim mükemmel biçimde örtüşürler.</div></div></div>
</div>

<div class="calc-formula"><div class="formula-label">EULER FORMÜLÜ</div><div class="formula-main">$$\\boxed{\\,e^{i\\theta} = \\cos\\theta + i\\sin\\theta\\,}$$</div><div class="formula-sub">Bir tanım, bir uzlaşma değil — bir sonuç. Kosinüs ve sinüs üstelin içinde gizlenmiş, sanal argümanın onları açığa çıkarmasını bekliyordu.</div></div>

<p class="l-text">Hemen kazanılan, kutupsal formun çok daha şık bir versiyonudur:</p>

<div class="calc-formula"><div class="formula-label">BİR KARMAŞIK SAYININ ÜSTEL FORMU</div><div class="formula-main">$$z = r\\,e^{i\\theta}, \\qquad r = |z|, \\quad \\theta = \\arg(z)$$</div><div class="formula-sub">Modül çarpı birim karmaşık üstel. Tüm karmaşık analizdeki en temiz gösterim — ve 7. Bölümden itibaren kullanacağımız form.</div></div>

<div class="l-highlight"><strong>En güzel sonuç.</strong> Euler formülünde θ = π koyun. $e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1 + 0\\,i = -1$ elde ederiz. Düzenleyince: $\\boxed{e^{i\\pi} + 1 = 0}$. Beş temel sabit — 0, 1, π, e, i — kısa tek bir denkleme bağlanmış; toplama, çarpma ve üs alma her biri tam olarak bir kez görünüyor. Birçok matematikçi bunu yazılmış en güzel özdeşlik olarak nitelendirir.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>z = 3 + 4i'yi üstel formda yeniden yaz.</strong><br><br>5. Bölümden: |z| = 5, arg(z) ≈ 0.9273 rad. Bu nedenle<br><br>z = 5·e<sup>i·0.9273</sup>.<br><br>Üç bilgi parçası (reel kısım, sanal kısım, i sembolü) az önce tek bir üstel içinde paketlenmiş iki bilgiye (modül, argüman) çöktü.</div></div>

<h2 class="lesson-title">7. Çarpma: Döndürme ve Ölçekleme</h2>

<div class="calc-highlight"><strong>Bu, karmaşık sayıların geometrik vuruşudur.</strong> Her iki çarpan da üstel formda olduğunda, karmaşık çarpma iki bağımsız harekete ayrılır: <em>uzunlukları çarp, açıları topla</em>. Dikdörtgen formdaki cebir, karışık çapraz çarpıma benziyor; üstel formda tek satır olur.</div>

<p class="l-text">İki karmaşık sayıyı üstel formda alalım: $z = r_1 e^{i\\theta_1}$ ve $w = r_2 e^{i\\theta_2}$. Olağan üs yasaları geçerlidir:</p>

<div class="calc-formula"><div class="formula-label">ÜSTEL FORMDA ÇARPMA</div><div class="formula-main">$$z\\,w = (r_1 r_2)\\,e^{i(\\theta_1 + \\theta_2)}$$</div><div class="formula-sub">Modüller çarpılır: |zw| = |z|·|w|. Argümanlar toplanır: arg(zw) = arg(z) + arg(w). Bir karmaşa yerine iki skaler kural.</div></div>

<p class="l-text">Geometriye çevrildiğinde: <strong>w ile çarpmak düzlemi arg(w) kadar döndürür ve |w| kadar ölçekler</strong>. Her karmaşık sayı, bir çarpan olarak görüldüğünde, düzlem üzerinde bir döndürme-artı-ölçekleme operatörüdür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">i ile çarp = 90° döndür</div><div class="card-body">i = e<sup>iπ/2</sup>, dolayısıyla |i| = 1 ve arg(i) = π/2. Herhangi bir z'yi i ile çarpmak, uzunluğunu değiştirmeden onu saat yönünün tersine 90° döndürür. i ile dört kez çarpmak (i⁴ = 1) başlangıca döner.</div></div>
<div class="calc-card"><div class="card-title">−1 ile çarp = 180° döndür</div><div class="card-body">−1 = e<sup>iπ</sup>. Uzunluk değişmez, yön ters döner. Tanıdık "negasyon" düzlemde sadece yarım turluk bir döndürmedir.</div></div>
<div class="calc-card"><div class="card-title">2 ile çarp = 2 katına ölçekle</div><div class="card-body">2 = 2·e<sup>i·0</sup>. Uzunluk iki katına çıkar, açı değişmez. Pozitif bir reel ile çarpma saf ölçeklemedir.</div></div>
<div class="calc-card"><div class="card-title">½·e<sup>iπ/3</sup> ile çarp</div><div class="card-body">Uzunluk yarıya iner, saat yönünün tersine 60° döner. İki etki bağımsızdır ve doğrudan çarpandan okunabilir.</div></div>
</div>

<div id="plot-l1-rotscale-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var z={r:2,th:Math.PI/6};
var rotations=[{name:'z (başlangıç)',mult:1,col:'#3b82f6',ang:0},{name:'z · e^{iπ/4} (45° dön)',mult:1,col:'#f97316',ang:Math.PI/4},{name:'z · e^{iπ/2} = iz (90° dön)',mult:1,col:'#10b981',ang:Math.PI/2},{name:'2z · e^{iπ/4} (×2 ölçek, 45° dön)',mult:2,col:'#a855f7',ang:Math.PI/4}];
var traces=[];
for(var i=0;i<rotations.length;i++){
  var R=rotations[i];var r2=z.r*R.mult;var th2=z.th+R.ang;
  var x=r2*Math.cos(th2);var y=r2*Math.sin(th2);
  traces.push({x:[0,x],y:[0,y],mode:'lines+markers',name:R.name,line:{color:R.col,width:2.4},marker:{size:[0,10],color:R.col}});
}
var circle1x=[],circle1y=[];for(var k=0;k<=120;k++){var a=k*2*Math.PI/120;circle1x.push(2*Math.cos(a));circle1y.push(2*Math.sin(a));}
var circle2x=[],circle2y=[];for(var k=0;k<=120;k++){var a=k*2*Math.PI/120;circle2x.push(4*Math.cos(a));circle2y.push(4*Math.sin(a));}
traces.push({x:circle1x,y:circle1y,mode:'lines',name:'|w|=2 (orijinal yarıçap)',line:{color:'rgba(255,255,255,0.18)',width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'});
traces.push({x:circle2x,y:circle2y,mode:'lines',name:'|w|=4 (ölçeklenmiş yarıçap)',line:{color:'rgba(255,255,255,0.12)',width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4.5,4.5],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-4.5,4.5]},margin:{t:40,r:30,b:50,l:60},showlegend:true,legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-rotscale-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> başlangıç vektörü z = 2·e<sup>iπ/6</sup> (mavi) çeşitli çarpanlar tarafından döndürülüp ölçekleniyor. Turuncu: 45° dön (e<sup>iπ/4</sup> ile çarp). Yeşil: 90° dön (i = e<sup>iπ/2</sup> ile çarp). Mor: 45° dön <em>ve</em> uzunluğu ikiye katla (2·e<sup>iπ/4</sup> ile çarp). Noktalı çemberler modül halkalarını |w| = 2 ve |w| = 4 işaretler. Her işlem bağımsızdır: döndürme uzunluğu değiştirmez, ölçekleme açıyı değiştirmez.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>(1 + i)(1 − i)'yi iki şekilde hesapla.</strong><br><br><em>Dikdörtgen:</em> (1 + i)(1 − i) = 1 − i + i − i² = 1 − (−1) = <strong>2</strong>.<br><br><em>Kutupsal:</em> 1 + i = √2·e<sup>iπ/4</sup>, 1 − i = √2·e<sup>−iπ/4</sup>. Çarpım: (√2)(√2)·e<sup>i(π/4 − π/4)</sup> = 2·e<sup>0</sup> = <strong>2</strong>.<br><br>Kutupsal yol iptali ortaya koyar: zıt argümanlar sıfıra toplanır, sonuç pozitif reel eksende oturur. Dikdörtgen yol işliyor ama geometriyi gizliyor.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">i ile çarpmak saat yönünün tersine 90° döndürüyorsa, −i ile çarpmak ne yapar? Aynı uzunluk, zıt açı: <em>saat yönünde</em> 90° döner. İki saat yönünde çeyrek dönüş = bir yarım dönüş, (−i)² = i²·(−1)² = −1 ile eşleşir. Geometri ve cebir aynı adımda yürür.</div></div>

<h2 class="lesson-title">8. Karmaşık Eşlenik</h2>

<p class="l-text">Karmaşık eşlenik, kullanışlılığı boyutunu aşan küçük bir işlemdir. Karmaşık sayıyı reel eksen etrafında yansıtır.</p>

<div class="calc-formula"><div class="formula-label">TANIM</div><div class="formula-main">$$\\overline{z} = \\overline{a + b\\,i} = a - b\\,i$$</div><div class="formula-sub">Sanal kısmın işaretini ters çevir. Geometrik olarak, z'yi reel eksen etrafında yansıt.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">|z|² = z·z̄</div><div class="card-body">z'yi eşleniğiyle çarpmak a² + b² verir — reel, negatif olmayan bir sayı, tam olarak modülün karesi. Bu özdeşlik ℂ'deki her bölmenin arkasındaki iş atıdır.</div></div>
<div class="calc-card"><div class="card-title">Re(z) = (z + z̄)/2</div><div class="card-body">z ve z̄'yi toplamak sanal kısımları iptal eder, 2a bırakır. 2'ye bölmek Re(z)'yi geri verir. Simetrik ortalama.</div></div>
<div class="calc-card"><div class="card-title">Im(z) = (z − z̄)/(2i)</div><div class="card-body">z'den z̄'yi çıkarmak reel kısımları iptal eder, 2bi bırakır. 2i'ye bölmek Im(z)'yi geri verir. Anti-simetrik fark.</div></div>
<div class="calc-card"><div class="card-title">Eşlenik dağılır</div><div class="card-body">$\\overline{z + w} = \\overline{z} + \\overline{w}$, $\\overline{z\\,w} = \\overline{z}\\cdot\\overline{w}$, $\\overline{z^n} = \\overline{z}^{\\,n}$. Eşleniklik işlemi her cebirsel işleme saygı duyar.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">ÜSTEL FORMDA EŞLENİK</div><div class="formula-main">$$z = r\\,e^{i\\theta} \\;\\implies\\; \\overline{z} = r\\,e^{-i\\theta}$$</div><div class="formula-sub">Modül değişmez; argüman işaret değiştirir. Reel eksen etrafında yansıma = açı negasyonu.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>z = 3 + 4i alalım.</strong> O zaman z̄ = 3 − 4i.<br><br>z·z̄ = (3 + 4i)(3 − 4i) = 9 − 12i + 12i − 16i² = 9 + 16 = <strong>25</strong>.<br><br>Ve |z|² = 5² = 25. ✔ |z|² = z·z̄ özdeşliği doğrulandı.</div></div>

<div class="l-note"><strong>Eşlenikleri neden seviyoruz:</strong> bir karmaşıktan reel sayı çıkarmanın en temiz yolu. w'ye bölme "w̄ / |w|² ile çarpma" haline gelir. Karmaşık vektör uzaylarındaki iç çarpımlar, sonucu reel, negatif olmayan bir norm tutmak için bir eşlenikle tanımlanır. Fizik ve mühendislikte "karmaşık şeyin reel bir ölçümü var" ifadelerinin tümü sonunda eşleniğe dayanır.</div>

<h2 class="lesson-title">9. De Moivre Teoremi ve Birim Kökler</h2>

<p class="l-text">Çarpma kuralını bir sayıyı kendisiyle n kez çarparak uygulamak doğrudan bir genelleme verir:</p>

<div class="calc-formula"><div class="formula-label">DE MOIVRE TEOREMİ</div><div class="formula-main">$$(\\cos\\theta + i\\sin\\theta)^{n} = \\cos(n\\theta) + i\\sin(n\\theta)$$</div><div class="formula-sub">Ya da üstel formda: $(e^{i\\theta})^{n} = e^{i n \\theta}$. Argüman kuvvetle doğrusal ölçeklenir; modül (burada 1) değişmez.</div></div>

<p class="l-text">Süreci tersine çevirmek n. kökler için bir tarif verir. $z^n = w$'yi z için çözmek için, w'yi üstel formda yaz ve modülün n. kökünü ve argümanın (k-kaydırılmış) n. inci'sini al:</p>

<div class="calc-formula"><div class="formula-label">w'NİN N. KÖKLERİ</div><div class="formula-main">$$z_k = r^{1/n}\\,e^{\\,i\\,(\\theta + 2\\pi k)/n}, \\qquad k = 0, 1, 2, \\dots, n-1$$</div><div class="formula-sub">Tam olarak n farklı n. kök vardır. 2πk faktörü arg'ın çok değerliliğini yansıtır: n'ye bölmeden önce tam bir tur eklemek yeni bir kök verir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birim kökler</div><div class="card-body">1'in n. kökleri k = 0, 1, ..., n−1 için $e^{2\\pi i k / n}$'dir. Hepsi modül 1'e sahiptir, bu yüzden birim çember üzerinde 2π/n açısıyla eşit aralıklı otururlar.</div></div>
<div class="calc-card"><div class="card-title">Düzgün çokgen oluştururlar</div><div class="card-body">Ardışık kökleri birleştirin; bir köşesi z = 1'de olan, birim çember içine yazılmış düzgün bir n-gen elde edersiniz. 8. kökler bir sekizgen çizer; 6. kökler bir altıgen çizer.</div></div>
<div class="calc-card"><div class="card-title">Sıfıra toplanırlar</div><div class="card-body">n ≥ 2 için, 1'in n. kökleri her zaman sıfıra toplanır (geometrik simetri: düzgün çokgenin ağırlık merkezi başlangıçtır). Küçük ama kullanışlı bir özdeşlik.</div></div>
</div>

<div id="plot-l1-roots-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var n=8;
var rx=[];var ry=[];var labels=[];
for(var k=0;k<n;k++){var a=2*Math.PI*k/n;rx.push(Math.cos(a));ry.push(Math.sin(a));labels.push('ω^'+k);}
var poly={x:rx.concat([rx[0]]),y:ry.concat([ry[0]]),mode:'lines',name:'düzgün sekizgen',line:{color:'rgba(59,130,246,0.45)',width:1.6}};
var pts={x:rx,y:ry,mode:'markers+text',name:"1'in 8. kökleri",marker:{size:11,color:'#3b82f6'},text:labels,textposition:'top right',textfont:{color:'#e8e8e8',size:11}};
var circx=[],circy=[];for(var k=0;k<=200;k++){var a=k*2*Math.PI/200;circx.push(Math.cos(a));circy.push(Math.sin(a));}
var circ={x:circx,y:circy,mode:'lines',name:'birim çember |z|=1',line:{color:'rgba(255,255,255,0.20)',width:1,dash:'dot'},showlegend:false,hoverinfo:'skip'};
var spokes=[];for(var k=0;k<n;k++){var a=2*Math.PI*k/n;spokes.push({x:[0,Math.cos(a)],y:[0,Math.sin(a)],mode:'lines',line:{color:'rgba(59,130,246,0.30)',width:1},showlegend:false,hoverinfo:'skip'});}
var data=spokes.concat([circ,poly,pts]);
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-1.5,1.6],scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'rgba(255,255,255,0.30)',range:[-1.4,1.4]},margin:{t:40,r:30,b:50,l:60},showlegend:true,legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-roots-tr',data,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> 1'in sekiz adet 8. kökü, ω<sup>k</sup> = e<sup>2πik/8</sup>, birim çember üzerinde çizilmiş. Spoke (ışın) parçaları her kökü başlangıç noktasına bağlar; dış çokgen, ardışık kökleri birleştirerek düzgün bir sekizgen oluşturur. Aynı desen herhangi bir n için tekrarlanır: birim çember üzerinde n eşit aralıklı nokta, düzgün bir n-gen oluşturur.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>8'in tüm küp köklerini bul.</strong> 8 = 8·e<sup>i·0</sup> yaz. Küp kökleri:<br><br>z<sub>k</sub> = 8<sup>1/3</sup>·e<sup>i·(0 + 2πk)/3</sup> = 2·e<sup>i·2πk/3</sup>, &nbsp;k = 0, 1, 2.<br><br>k = 0: 2·e<sup>0</sup> = <strong>2</strong> (bariz reel küp kök).<br>k = 1: 2·e<sup>i·2π/3</sup> = 2(cos 120° + i sin 120°) = <strong>−1 + i√3</strong>.<br>k = 2: 2·e<sup>i·4π/3</sup> = 2(cos 240° + i sin 240°) = <strong>−1 − i√3</strong>.<br><br>Üç farklı küp kök — Cebirin Temel Teoremi'nin z³ − 8 = 0 kübiği için söz verdiği şey.</div></div>

<h2 class="lesson-title">10. Karmaşık Sayıların Geometrisi</h2>

<p class="l-text">Pek çok klasik geometrik kuruluş karmaşık düzlemde tek satırlık cebirsel ifadelere dönüşür.</p>

<div class="calc-formula"><div class="formula-label">İKİ NOKTA ARASINDAKİ UZAKLIK</div><div class="formula-main">$$d(z, w) = |z - w|$$</div><div class="formula-sub">z ve w noktaları arasındaki Öklit uzaklığı, farklarının modülüdür. $\\sqrt{(a-c)^2 + (b-d)^2}$ ile aynı gerçek, daha kısa yazılmış.</div></div>

<div class="calc-formula"><div class="formula-label">z<sub>0</sub> MERKEZLİ r YARIÇAPLI ÇEMBER</div><div class="formula-main">$$|z - z_0| = r$$</div><div class="formula-sub">z<sub>0</sub>'a uzaklığı r olan tüm noktalar — çemberin tanımlayıcı özelliği, tek sembolle.</div></div>

<div class="calc-formula"><div class="formula-label">a VE b'NİN DİK ORTASI</div><div class="formula-main">$$|z - a| = |z - b|$$</div><div class="formula-sub">a ve b'ye eşit uzaklıktaki noktalar kümesi — onları birleştiren parçanın dik ortayı. Tüm yer, tek denklem.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Disk |z − z<sub>0</sub>| &lt; r</div><div class="card-body">z<sub>0</sub> etrafında r yarıçaplı açık disk. Katı eşitsizlik sınırı dışlar. Karmaşık analizde "komşuluk" için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Yarı düzlem Re(z) &gt; 0</div><div class="card-body">Sağ yarı düzlem (pozitif reel kısma sahip tüm noktalar). Re ve Im üzerindeki eşitsizlikler tam olarak Kartezyen koordinatlardan bekleyeceğiniz bölgeleri keser.</div></div>
<div class="calc-card"><div class="card-title">Işın arg(z) = π/4</div><div class="card-body">45° açısındaki sıfırdan farklı tüm noktalar. Başlangıçtan çıkan bir ışın. arg'ı sabitlemek yarım doğru verir; modülü sabitlemek çember verir.</div></div>
<div class="calc-card"><div class="card-title">Üçgen eşitsizliği</div><div class="card-body">|z + w| ≤ |z| + |w|, eşitlik yalnızca z ve w aynı yönü gösterdiğinde. Tanıdık 2B üçgen eşitsizliği, karmaşık gösterimle yazılmış.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>|z − (1 + i)| = 2 yerini tanımla.</strong><br><br>z'den 1 + i noktasına uzaklık 2'ye eşit. Bu, <strong>(1, 1) merkezli 2 yarıçaplı bir çember</strong>. Tek denklem, tam resim.</div></div>

<div class="think-box"><div class="think-label">KONTROL</div><div class="think-body">|z − 1| &lt; |z + 1| ile tanımlanan düzlemin bölgesi nedir? (İpucu: "1'e −1'den daha yakın" — sağ yarı düzlem Re(z) &gt; 0.)</div></div>

<h2 class="lesson-title">11. Uygulama: AC Devreleri ve Empedans</h2>

<p class="l-text">Saf matematiğin dışındaki ilk büyük kazanç, elektrik mühendisliği ile 1890'larda geldi. DC devreler için Ohm yasası V = IR der — gerilim, akım çarpı dirence eşittir. ω açısal frekansındaki AC devreler için aynı denklem, reel R direncini akıma karşı muhalefetin büyüklüğünü ve akım ile gerilim arasındaki faz kaymasını birlikte yakalayan karmaşık <strong>empedans</strong> Z ile değiştirirsek çalışır.</p>

<div class="calc-formula"><div class="formula-label">KARMAŞIK OHM YASASI</div><div class="formula-main">$$V = I\\,Z$$</div><div class="formula-sub">Üç miktar da karmaşık faz vektörleri (phasors) — büyüklükler ile faz açıları eşleşmiş. Hem genlik hem faz için tek denklem.</div></div>

<div class="calc-formula"><div class="formula-label">ÜÇ TEMEL BİLEŞENİN EMPEDANSLARI</div><div class="formula-main">$$Z_R = R, \\qquad Z_L = i\\omega L, \\qquad Z_C = \\frac{1}{i\\omega C}$$</div><div class="formula-sub">Direnç: reel. İndüktör: pozitif sanal (akım gerilimi 90° geriden takip eder). Kondansatör: negatif sanal (akım gerilimi 90° ileriden götürür). Çarpmanın geometrisi işi yapar.</div></div>

<p class="l-text">Seri bir RLC devresinde toplam empedans toplamdır: $Z = R + i\\omega L + 1/(i\\omega C) = R + i(\\omega L - 1/(\\omega C))$. Modülü, devrenin ω frekanslı akıma ne kadar direndiğini söyler; argümanı, gerilim ile akım arasındaki faz gecikmesini söyler. Bölüm 3 ve 7'nin karmaşık cebri, diferansiyel denklemlerin sayfalarını tek satıra çöker.</p>

<div class="l-note"><strong>Şıklık:</strong> karmaşık sayılar olmadan, AC devre analizi sinüsoidal trigonometridir — her miktar bir genlik ve bir faz taşır ve onları birleştirmek her yerde trig özdeşlikleri demektir. Empedanslarla, her bileşen tek bir karmaşık sayıdır ve Kirchhoff yasaları ℂ üzerinde lineer cebir olur. Karmaşık çarpma kuralı (|z||w|, arg z + arg w), sinüsoidal genlikleri ve fazları birleştirmek için tam olarak doğru işlemdir — aritmetikte bir tesadüf fiziğin kendisi olarak ortaya çıktı.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>RLC seri: R = 10 Ω, L = 0.1 H, C = 100 μF, ω = 100 rad/s.</strong><br><br>Z<sub>L</sub> = i·100·0.1 = 10i Ω.<br>Z<sub>C</sub> = 1/(i·100·100·10⁻⁶) = 1/(0.01i) = −100i Ω.<br>Z = 10 + 10i − 100i = 10 − 90i Ω.<br><br>|Z| = √(100 + 8100) = √8200 ≈ 90.55 Ω.<br>arg(Z) = atan2(−90, 10) ≈ −1.46 rad ≈ −83.7°.<br><br>Yani 1 A'lık bir akım, akımdan yaklaşık 83.7° önde bir ~90.55 V gerilim üretir (arg negatif olduğundan — yük bu frekansta kapasitif görünür).</div></div>

<h2 class="lesson-title">12. Modern Bakışlar (Kısa)</h2>

<p class="l-text">Karmaşık sayılar, bu dersin klasik kapsamının çok ötesinde modern fizik ve mühendislikteki dikkat çekici bir yelpazenin temelini oluşturur. Yolun nereye götürdüğünü göstermek için kısa bir tur:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kuantum mekaniği</div><div class="card-body">Bir parçacığın durumu karmaşık değerli bir dalga fonksiyonu ψ ile tanımlanır. Olasılıklar |ψ|² ile gelir. Schrödinger denklemi $i\\hbar\\,\\partial_t \\psi = \\hat{H}\\psi$, içinde açık bir i taşır — karmaşık sayılar isteğe bağlı değil, yapısaldır.</div></div>
<div class="calc-card"><div class="card-title">Fourier analizi</div><div class="card-body">Her Fourier dönüşümü integrali $\\int f(t)\\,e^{-i\\omega t}\\,dt$ — karmaşık değerli bir izdüşüm olarak yazılır. Tüm spektral resim (modül = genlik, argüman = faz) yalnızca karmaşık sayılar var olduğu için çalışır.</div></div>
<div class="calc-card"><div class="card-title">Holomorf fonksiyonlar</div><div class="card-body">Karmaşık anlamda türevlenebilir (Cauchy-Riemann, Ders 2) ℂ → ℂ fonksiyonlarının inanılmaz katılığı vardır: bir kez türevlenebilir demek sonsuz kez türevlenebilir demektir, küçük bir diskteki değerlerinden global olarak belirlenir. Reel analizin bir benzeri yoktur.</div></div>
<div class="calc-card"><div class="card-title">Karmaşık değerli sinir ağları</div><div class="card-body">Niş ama aktif bir araştırma alanı (CV-Net, CVNN). Fazın temelde önemli olduğu görevler için yararlı — MRI yeniden yapılandırma, radar, belirli kablosuz sinyal modelleri. Ana akım makine öğrenmesi büyük ölçüde reel değerlidir; karmaşık ağlar küçük, uzmanlaşmış bir koldur, varlığı bilinmeye değer ama alanın çoğunun yaşadığı yer değil.</div></div>
</div>

<div class="l-note"><strong>Yapay zeka bağı için dürüst olmak:</strong> kalkülüsün, lineer cebrin veya olasılığın aksine, karmaşık sayılar modern makine öğreniminde günlük bir araç <em>değildir</em>. ML'nin büyük çoğunluğu — gradient descent, transformerlar, difüzyon modelleri — reel değerli tensörler üzerinde çalışır. Karmaşık sayıların ML'de göründüğü yerler genellikle sinyal işlemden veya fizikten ödünç alınmıştır. Karmaşık sayıları, Fourier tabanlı makalelerle karşılaştığınızda fazlarla rahat çalışma yetisinin ötesinde size "ML ön koşulu" olarak kimsenin satmasına izin vermeyin. Onları öğrenmenin nedeni, fizik, elektrik mühendisliği ve karmaşık analizin geri kalanında derin uygulamaları olan muhteşem matematik olmalarıdır — ki Dersler 2'den 6'ya bu yerleri gezeceğiz.</div>

<h2 class="lesson-title">13. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<div class="l-note"><strong>Egzersizden alınacak şey:</strong> Python karmaşık sayıları yerleşik bir skaler tip olarak ele alır — aritmetik için üçüncü taraf kütüphaneye gerek yok. NumPy aynı mekanizmayı dizilere genişletir, böylece tüm veri kümeleri üzerinde eleman bazında karmaşık işlemler yapabilirsiniz. <code>cmath</code>, herhangi bir karmaşık girdi için karmaşık çıktı veren math fonksiyonlarının karmaşık versiyonlarını (exp, log, sqrt, sin, vb.) sağlar. Argand çizimi, empedans hesabı, n. kökler — karmaşık sayıların çarpma kuralına (modülleri çarp, argümanları topla) uyan 2B sayılar olduğunu içselleştirdiğinizde hepsi iki satır kod.</div>

<div class="l-warn"><strong>Sıradaki (Ders 2):</strong> z'yi bir sayıdan bir fonksiyonun girdisine yükseltiyoruz. Karmaşık fonksiyonlar f: ℂ → ℂ; limitler, süreklilik ve "karmaşık anlamda türevlenebilir" olmanın şaşırtıcı derecede katı kavramı. Bu tek koşul — Cauchy-Riemann denklemleri — o kadar kısıtlayıcı çıkıyor ki onu geçen her fonksiyon bütün bir sonuçlar evrenine miras kalıyor. Sahneyi Ders 2'de kuracağız ve sonuçları (Cauchy teoremi, kalıntılar, konformal haritalar) Dersler 3 ile 6 arasında serbest bırakacağız.</p>`

};
