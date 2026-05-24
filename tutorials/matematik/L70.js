window.LISE_MAT_L70 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You already know how to add, subtract, multiply, and divide complex numbers in rectangular form</strong> $z = a + bi$. That picture — a point in the plane — is great for adding (just add coordinates) and for visualising what a complex number <em>is</em>. But it is clumsy for two of the most important operations in all of mathematics: <em>multiplication</em> and <em>powers</em>. In rectangular form, $(a + bi)(c + di)$ requires the FOIL expansion every single time. In <em>polar form</em>, multiplication collapses into a single rule: <strong>multiply the lengths, add the angles</strong>.</p>

<p class="l-text">This lesson introduces the two numbers that describe a complex number in polar coordinates — its <em>modulus</em> $r = |z|$ (the distance from the origin) and its <em>argument</em> $\\theta = \\arg z$ (the angle from the positive real axis). Together they give you a second address for the same point, and a much more powerful one for problems involving rotation, scaling, roots, and powers. By the end you will be able to convert in both directions and read off the geometry instantly.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the modulus $|z| = \\sqrt{a^2 + b^2}$ and read it geometrically as the distance from the origin</li>
<li>Define the argument $\\arg z$ as the angle from the positive real axis, and find the principal value in $(-\\pi, \\pi]$</li>
<li>Compute $\\arg z$ from $\\tan\\theta = b/a$ with the correct quadrant adjustment</li>
<li>Convert any complex number between rectangular $a + bi$ and polar $r(\\cos\\theta + i\\sin\\theta) = r\\,\\text{cis}\\,\\theta$ forms</li>
<li>Multiply and divide complex numbers in polar form using the rule: moduli multiply, arguments add</li>
<li>Preview Euler's form $z = r e^{i\\theta}$ and the identity $e^{i\\pi} + 1 = 0$</li>
</ul>
</div>

<h2 class="lesson-title">1. The Modulus: How Far From the Origin</h2>

<div class="calc-highlight"><strong>The modulus of a complex number is its distance from the origin in the complex plane.</strong> If $z = a + bi$ corresponds to the point $(a, b)$, then by the Pythagorean theorem its distance to $(0, 0)$ is $\\sqrt{a^2 + b^2}$. We call this number the <em>modulus</em> and write it $|z|$.</div>

<div class="calc-formula"><div class="formula-label">MODULUS OF A COMPLEX NUMBER</div><div class="formula-main">$$|z| \\;=\\; |a + bi| \\;=\\; \\sqrt{a^2 + b^2}$$</div><div class="formula-sub">The vertical bars are the same symbol as absolute value on the real line — and for good reason. If $z$ happens to be real ($b = 0$), then $|z| = \\sqrt{a^2} = |a|$, which is the ordinary absolute value. The modulus extends $|\\cdot|$ from the real line to the entire plane.</div></div>

<p class="l-text"><strong>The number $|z|$ is always non-negative,</strong> and it is zero only when $z = 0$. Geometrically it is the length of the arrow from the origin to the point representing $z$. Two complex numbers can sit anywhere in the plane and still have the same modulus — they just lie on the same circle around the origin.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the modulus of $z = 3 + 4i$.<br><br>$|z| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = \\mathbf{5}$.<br><br>Geometrically, the point $(3, 4)$ sits on a circle of radius 5 around the origin — the famous 3-4-5 right triangle made by the real part, imaginary part, and the modulus.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the modulus of $z = -2 + 2i$.<br><br>$|z| = \\sqrt{(-2)^2 + 2^2} = \\sqrt{4 + 4} = \\sqrt{8} = 2\\sqrt{2}$.<br><br>The signs of $a$ and $b$ never matter for the modulus — only their squares do.</div></div>

<h2 class="lesson-title">2. Three Properties of the Modulus</h2>

<p class="l-text">The modulus interacts beautifully with the arithmetic of complex numbers. Three identities are worth memorising — they will come up again and again.</p>

<div class="calc-formula"><div class="formula-label">PROPERTIES OF THE MODULUS</div><div class="formula-main">$$|zw| \\;=\\; |z|\\,|w| \\qquad \\left|\\frac{z}{w}\\right| \\;=\\; \\frac{|z|}{|w|} \\qquad |z + w| \\;\\leq\\; |z| + |w|$$</div><div class="formula-sub">The first two say modulus respects multiplication and division. The third is the <em>triangle inequality</em>: the side of a triangle is never longer than the sum of the other two sides.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Multiplicative</div><div class="card-body">$|zw| = |z|\\,|w|$. The length of a product equals the product of the lengths. This is what makes polar form so powerful for products.</div></div>
<div class="calc-card"><div class="card-title">Division</div><div class="card-body">$|z/w| = |z|/|w|$ (when $w \\neq 0$). Length of a ratio equals the ratio of the lengths.</div></div>
<div class="calc-card"><div class="card-title">Triangle inequality</div><div class="card-body">$|z + w| \\leq |z| + |w|$. Geometrically: adding two vectors tip-to-tail makes a triangle, and the third side cannot exceed the other two combined.</div></div>
</div>

<div class="l-note"><strong>Another useful identity:</strong> $|z|^2 = z \\bar z$, where $\\bar z = a - bi$ is the complex conjugate. Indeed $z \\bar z = (a+bi)(a-bi) = a^2 - (bi)^2 = a^2 + b^2$. This is the algebraic shortcut that powers the standard division formula in rectangular form.</div>

<h2 class="lesson-title">3. The Argument: The Angle From the Real Axis</h2>

<div class="calc-highlight"><strong>The argument of a complex number is the angle its vector makes with the positive real axis,</strong> measured counter-clockwise. We write it $\\arg z$ or $\\theta$. Combined with the modulus, the pair $(r, \\theta)$ specifies $z$ uniquely (except at the origin, where no angle is defined).</div>

<p class="l-text">The argument is not unique on its own — adding any whole multiple of $2\\pi$ gives the same direction. To avoid ambiguity, we pick a canonical range and call the value inside it the <strong>principal argument</strong>. Two common conventions are widely used:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">PRINCIPAL VALUE IN $(-\\pi,\\,\\pi]$</div><div class="compare-item">Symmetric around 0</div><div class="compare-item">Positive y half-plane: $\\theta \\in (0, \\pi]$</div><div class="compare-item">Negative y half-plane: $\\theta \\in (-\\pi, 0)$</div><div class="compare-item">Most common in mathematics and engineering</div></div><div class="compare-col"><div class="compare-title">PRINCIPAL VALUE IN $[0,\\,2\\pi)$</div><div class="compare-item">Always non-negative</div><div class="compare-item">Matches the unit-circle convention from lesson 1</div><div class="compare-item">Used in some textbooks and trigonometry contexts</div><div class="compare-item">Pick one convention and stick with it</div></div></div>

<p class="l-text">In this lesson we use the principal value in $(-\\pi, \\pi]$ — the symmetric one — but everything we derive translates directly to the other convention.</p>

<h2 class="lesson-title">4. Computing the Argument: tan, atan, and the Quadrant Trap</h2>

<div class="calc-highlight"><strong>From the rectangular form $z = a + bi$,</strong> the right triangle with legs $a$ and $b$ has $\\tan\\theta = b/a$. So you might think $\\theta = \\arctan(b/a)$. <strong>This is true only in the right half-plane</strong> ($a > 0$). In the left half-plane the standard $\\arctan$ gives the wrong answer because it always returns a value in $(-\\pi/2, \\pi/2)$.</div>

<div class="calc-formula"><div class="formula-label">ARGUMENT FROM RECTANGULAR FORM</div><div class="formula-main">$$\\arg(a + bi) \\;=\\; \\begin{cases} \\arctan(b/a) & a > 0 \\\\ \\arctan(b/a) + \\pi & a < 0,\\; b \\geq 0 \\\\ \\arctan(b/a) - \\pi & a < 0,\\; b < 0 \\\\ +\\pi/2 & a = 0,\\; b > 0 \\\\ -\\pi/2 & a = 0,\\; b < 0 \\end{cases}$$</div><div class="formula-sub">The cases distinguish the four quadrants and the two pure-imaginary half-axes. Programming languages provide a single function $\\text{atan2}(b, a)$ that handles all cases.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Quadrant I: $a>0, b>0$</div><div class="card-body">$\\theta = \\arctan(b/a)$. Result in $(0, \\pi/2)$. No adjustment needed.</div></div>
<div class="calc-card"><div class="card-title">Quadrant II: $a<0, b>0$</div><div class="card-body">Add $\\pi$ to $\\arctan(b/a)$. Result in $(\\pi/2, \\pi)$.</div></div>
<div class="calc-card"><div class="card-title">Quadrant III: $a<0, b<0$</div><div class="card-body">Subtract $\\pi$ from $\\arctan(b/a)$. Result in $(-\\pi, -\\pi/2)$.</div></div>
<div class="calc-card"><div class="card-title">Quadrant IV: $a>0, b<0$</div><div class="card-body">$\\theta = \\arctan(b/a)$. Result in $(-\\pi/2, 0)$. No adjustment.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the argument of $z = 1 + i$.<br><br>$a = 1, b = 1$, both positive — quadrant I. $\\tan\\theta = 1/1 = 1$, so $\\theta = \\arctan 1 = \\pi/4$.<br><br>Answer: $\\arg(1 + i) = \\mathbf{\\pi/4} = 45^\\circ$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the argument of $z = -1 + \\sqrt{3}\\,i$.<br><br>$a = -1, b = \\sqrt 3$ — quadrant II. $\\tan\\theta = \\sqrt 3 / (-1) = -\\sqrt 3$. The naive $\\arctan(-\\sqrt 3) = -\\pi/3$ — but that points into quadrant IV, the wrong place. Add $\\pi$:<br><br>$\\theta = -\\pi/3 + \\pi = \\mathbf{2\\pi/3} = 120^\\circ$. Quadrant II. Correct.</div></div>

<div class="l-note"><strong>Mental check.</strong> Before using the formula, sketch the point. Does the answer agree with the quadrant you see? If the formula gives $-\\pi/3$ for a point in quadrant II, you forgot the $+\\pi$ adjustment. The sketch is your safety net.</div>

<h2 class="lesson-title">5. Polar Form</h2>

<div class="calc-highlight"><strong>Once we have $r$ and $\\theta$, we can re-write any complex number in <em>polar form</em>:</strong></div>

<div class="calc-formula"><div class="formula-label">POLAR FORM OF A COMPLEX NUMBER</div><div class="formula-main">$$z \\;=\\; r(\\cos\\theta + i\\sin\\theta) \\;=\\; r\\,\\text{cis}\\,\\theta$$</div><div class="formula-sub">Here $r = |z|$ and $\\theta = \\arg z$. The notation $\\text{cis}\\,\\theta$ is shorthand for $\\cos\\theta + i\\sin\\theta$ — the abbreviation is mostly used in high-school texts and saves writing.</div></div>

<p class="l-text"><strong>Why does this formula work?</strong> Read off the rectangular form. The real part of $r(\\cos\\theta + i\\sin\\theta)$ is $r\\cos\\theta$. The imaginary part is $r\\sin\\theta$. So the point is at $(r\\cos\\theta, r\\sin\\theta)$. That is exactly the polar-to-Cartesian conversion from elementary geometry. The polar form is just a compact algebraic re-encoding of the polar coordinates.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Rectangular: $z = a + bi$</div><div class="card-body">Two real numbers $(a, b)$. Address by horizontal and vertical offsets. Best for addition and subtraction.</div></div>
<div class="calc-card"><div class="card-title">Polar: $z = r\\,\\text{cis}\\,\\theta$</div><div class="card-body">Two real numbers $(r, \\theta)$. Address by distance and angle. Best for multiplication, division, and powers.</div></div>
</div>

<h2 class="lesson-title">6. Euler's Form (A Preview)</h2>

<div class="calc-highlight"><strong>There is a third form that compresses polar form into a single symbol</strong> — and is so important that an entire wing of mathematics rests on it. We mention it now, will use it in advanced lessons, and let you absorb the picture for now: <em>Euler's form</em>.</div>

<div class="calc-formula"><div class="formula-label">EULER'S FORMULA</div><div class="formula-main">$$e^{i\\theta} \\;=\\; \\cos\\theta + i\\sin\\theta$$</div><div class="formula-sub">Exponentiating a pure imaginary number gives a point on the unit circle. We will prove this with Taylor series later; for now treat it as a definition.</div></div>

<p class="l-text">Substituting into the polar form:</p>

<div class="calc-formula"><div class="formula-label">EULER FORM OF A COMPLEX NUMBER</div><div class="formula-main">$$z \\;=\\; r e^{i\\theta}$$</div><div class="formula-sub">The most compact representation: a length $r$ times a unit-modulus rotation $e^{i\\theta}$. Multiplication becomes ordinary exponent arithmetic.</div></div>

<p class="l-text">Set $\\theta = \\pi$ in Euler's formula: $e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1 + 0i = -1$. Rearranging:</p>

<div class="calc-formula"><div class="formula-label">EULER'S IDENTITY</div><div class="formula-main">$$e^{i\\pi} + 1 \\;=\\; 0$$</div><div class="formula-sub">Often called "the most beautiful formula in mathematics" — it links the five most important constants ($e, i, \\pi, 1, 0$) in a single line.</div></div>

<h2 class="lesson-title">7. Converting Between Forms</h2>

<p class="l-text"><strong>Rectangular to polar:</strong> compute $r = \\sqrt{a^2 + b^2}$ and $\\theta$ from the case table above. Write $z = r\\,\\text{cis}\\,\\theta$.</p>

<p class="l-text"><strong>Polar to rectangular:</strong> multiply out. From $z = r(\\cos\\theta + i\\sin\\theta)$, the real part is $r\\cos\\theta$ and the imaginary part is $r\\sin\\theta$. Plug in numerical values for $\\cos\\theta$ and $\\sin\\theta$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RECTANGULAR TO POLAR</div><div class="example-body">Convert $z = 1 + i$ to polar form.<br><br>$r = \\sqrt{1^2 + 1^2} = \\sqrt 2$.<br>$\\theta = \\arctan(1/1) = \\pi/4$ (quadrant I, no adjustment).<br><br>Polar form: $z = \\mathbf{\\sqrt 2\\,\\text{cis}\\,(\\pi/4)} = \\sqrt 2\\,(\\cos 45^\\circ + i\\sin 45^\\circ)$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — RECTANGULAR TO POLAR</div><div class="example-body">Convert $z = -1 + \\sqrt 3 \\, i$ to polar form.<br><br>$r = \\sqrt{1 + 3} = 2$.<br>$\\theta$: $a < 0, b > 0$ — quadrant II. $\\arctan(\\sqrt 3 / (-1)) = \\arctan(-\\sqrt 3) = -\\pi/3$. Add $\\pi$: $\\theta = 2\\pi/3$.<br><br>Polar form: $z = \\mathbf{2\\,\\text{cis}\\,(2\\pi/3)} = 2(\\cos 120^\\circ + i\\sin 120^\\circ)$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — POLAR TO RECTANGULAR</div><div class="example-body">Convert $z = 2(\\cos 60^\\circ + i\\sin 60^\\circ)$ to rectangular form.<br><br>$\\cos 60^\\circ = 1/2$, $\\sin 60^\\circ = \\sqrt 3 / 2$.<br>Real part: $2 \\cdot 1/2 = 1$. Imaginary part: $2 \\cdot \\sqrt 3 / 2 = \\sqrt 3$.<br><br>Rectangular form: $z = \\mathbf{1 + \\sqrt 3\\, i}$.</div></div>

<div class="calc-graph"><div id="plot-l70-argand-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the complex number $z = 1 + i$ as a point in the Argand plane (the complex plane). The blue arrow is its position vector from the origin — its length is the modulus $r = \\sqrt 2$, and the angle it makes with the positive real axis is the argument $\\theta = \\pi/4 = 45^\\circ$. The dashed arc visualises the angle; the dotted vertical and horizontal segments show the real and imaginary parts.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ang=Math.PI/4;var r=Math.SQRT2;
var px=Math.cos(ang)*r,py=Math.sin(ang)*r;
var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(r*Math.cos(a));ringY.push(r*Math.sin(a));}
var ringCircle={x:ringX,y:ringY,mode:'lines',name:'|z| circle',line:{color:'rgba(255,255,255,0.25)',width:1.3,dash:'dot'}};
var vec={x:[0,px],y:[0,py],mode:'lines+markers',name:'z = 1 + i',line:{color:'#3b82f6',width:3},marker:{size:[0,10],color:'#3b82f6'}};
var realLine={x:[px,px],y:[0,py],mode:'lines',name:'imaginary part',line:{color:'rgba(245,158,11,0.8)',width:1.5,dash:'dot'}};
var imagLine={x:[0,px],y:[0,0],mode:'lines',name:'real part',line:{color:'rgba(16,185,129,0.8)',width:1.5,dash:'dot'}};
var arcX=[],arcY=[];for(var j=0;j<=40;j++){var b=ang*j/40;arcX.push(0.45*Math.cos(b));arcY.push(0.45*Math.sin(b));}
var arc={x:arcX,y:arcY,mode:'lines',name:'arg z = π/4',line:{color:'#ec4899',width:2,dash:'dash'}};
var labels={x:[px+0.08,px/2,px+0.08,0.55],y:[py+0.06,-0.08,py/2,0.18],mode:'text',name:'labels',text:['z = 1 + i','Re(z) = 1','Im(z) = 1','θ'],textfont:{color:['#3b82f6','#10b981','#f59e0b','#ec4899'],size:13},showlegend:false};
var axX={x:[-0.5,2],y:[0,0],mode:'lines',name:'real axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.5,2],mode:'lines',name:'imag axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-0.5,2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-0.5,2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l70-argand-en',[ringCircle,axX,axY,realLine,imagLine,vec,arc,labels],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Multiplication in Polar Form</h2>

<div class="calc-highlight"><strong>This is the killer feature of polar form.</strong> In rectangular form, multiplying two complex numbers requires FOIL, careful sign tracking on $i^2 = -1$, and two real multiplications combined awkwardly. In polar form, it is a single, transparent rule: <strong>multiply the moduli, add the arguments.</strong></div>

<div class="calc-formula"><div class="formula-label">MULTIPLICATION IN POLAR FORM</div><div class="formula-main">$$z_1 \\cdot z_2 \\;=\\; r_1 r_2 \\, \\text{cis}(\\theta_1 + \\theta_2)$$</div><div class="formula-sub">If $z_1 = r_1\\,\\text{cis}\\,\\theta_1$ and $z_2 = r_2\\,\\text{cis}\\,\\theta_2$, their product has modulus $r_1 r_2$ and argument $\\theta_1 + \\theta_2$. Lengths multiply; angles add.</div></div>

<p class="l-text"><strong>Why does this work?</strong> Multiply out using the cis form and apply the cosine and sine addition formulas:</p>

<div class="calc-formula"><div class="formula-label">PROOF (BY ADDITION FORMULAS)</div><div class="formula-main">$$\\begin{aligned} z_1 z_2 &= r_1(\\cos\\theta_1 + i\\sin\\theta_1) \\cdot r_2(\\cos\\theta_2 + i\\sin\\theta_2) \\\\ &= r_1 r_2 \\bigl[(\\cos\\theta_1\\cos\\theta_2 - \\sin\\theta_1\\sin\\theta_2) + i(\\sin\\theta_1\\cos\\theta_2 + \\cos\\theta_1\\sin\\theta_2)\\bigr] \\\\ &= r_1 r_2 \\bigl[\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)\\bigr] \\end{aligned}$$</div></div>

<p class="l-text"><strong>Geometric meaning.</strong> Multiplying by $z_2$ acts on the plane as a <em>scaling by $r_2$ combined with a rotation by $\\theta_2$</em>. If $|z_2| = 1$, multiplication is pure rotation. If $\\theta_2 = 0$, it is pure scaling. This is the cleanest description of complex multiplication you will ever see — and it justifies the central role of complex numbers in everything from quantum mechanics to AC circuit analysis.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Multiply $(1 + i)(\\sqrt 3 + i)$ in polar form.<br><br>Convert each factor.<br>$|1 + i| = \\sqrt 2$, $\\arg(1 + i) = \\pi/4$. So $1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$.<br>$|\\sqrt 3 + i| = \\sqrt{3 + 1} = 2$, $\\arg(\\sqrt 3 + i) = \\arctan(1/\\sqrt 3) = \\pi/6$. So $\\sqrt 3 + i = 2\\,\\text{cis}(\\pi/6)$.<br><br>Multiply: $\\sqrt 2 \\cdot 2 = 2\\sqrt 2$. Add arguments: $\\pi/4 + \\pi/6 = 3\\pi/12 + 2\\pi/12 = 5\\pi/12$.<br><br>Polar answer: $\\mathbf{2\\sqrt 2\\,\\text{cis}(5\\pi/12)}$.<br><br>Rectangular check: $5\\pi/12 = 75^\\circ$. $\\cos 75^\\circ \\approx 0.2588$, $\\sin 75^\\circ \\approx 0.9659$. Real part $\\approx 2\\sqrt 2 \\cdot 0.2588 \\approx 0.732$. Imag part $\\approx 2\\sqrt 2 \\cdot 0.9659 \\approx 2.732$.<br>Direct FOIL: $(1+i)(\\sqrt 3 + i) = \\sqrt 3 + i + i\\sqrt 3 + i^2 = (\\sqrt 3 - 1) + (1 + \\sqrt 3)i \\approx 0.732 + 2.732 i$. Match.</div></div>

<div class="calc-graph"><div id="plot-l70-product-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two complex numbers $z_1 = \\sqrt 2 \\, \\text{cis}(\\pi/4)$ (blue, length $\\sqrt 2 \\approx 1.41$, angle $45^\\circ$) and $z_2 = 2 \\, \\text{cis}(\\pi/6)$ (green, length 2, angle $30^\\circ$). Their product $z_1 z_2$ has modulus $2\\sqrt 2 \\approx 2.83$ (the lengths multiplied) and argument $75^\\circ$ (the angles added). The orange arrow is the product; notice how it lies along the angle $\\theta_1 + \\theta_2$ at the combined distance $r_1 r_2$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r1=Math.SQRT2,t1=Math.PI/4;var r2=2,t2=Math.PI/6;
var rp=r1*r2,tp=t1+t2;
var z1x=r1*Math.cos(t1),z1y=r1*Math.sin(t1);
var z2x=r2*Math.cos(t2),z2y=r2*Math.sin(t2);
var zpx=rp*Math.cos(tp),zpy=rp*Math.sin(tp);
var v1={x:[0,z1x],y:[0,z1y],mode:'lines+markers',name:'z₁ = √2 cis(π/4)',line:{color:'#3b82f6',width:3},marker:{size:[0,9]}};
var v2={x:[0,z2x],y:[0,z2y],mode:'lines+markers',name:'z₂ = 2 cis(π/6)',line:{color:'#10b981',width:3},marker:{size:[0,9]}};
var vp={x:[0,zpx],y:[0,zpy],mode:'lines+markers',name:'z₁z₂ = 2√2 cis(5π/12)',line:{color:'#f59e0b',width:3.5},marker:{size:[0,11]}};
var arc1X=[],arc1Y=[];for(var j=0;j<=40;j++){var b=t1*j/40;arc1X.push(0.4*Math.cos(b));arc1Y.push(0.4*Math.sin(b));}
var arc2X=[],arc2Y=[];for(var j=0;j<=40;j++){var b=t2*j/40;arc2X.push(0.55*Math.cos(b));arc2Y.push(0.55*Math.sin(b));}
var arcpX=[],arcpY=[];for(var j=0;j<=50;j++){var b=tp*j/50;arcpX.push(0.85*Math.cos(b));arcpY.push(0.85*Math.sin(b));}
var arc1={x:arc1X,y:arc1Y,mode:'lines',name:'θ₁ = π/4',line:{color:'rgba(59,130,246,0.7)',width:1.5,dash:'dash'}};
var arc2={x:arc2X,y:arc2Y,mode:'lines',name:'θ₂ = π/6',line:{color:'rgba(16,185,129,0.7)',width:1.5,dash:'dash'}};
var arcp={x:arcpX,y:arcpY,mode:'lines',name:'θ₁+θ₂ = 5π/12',line:{color:'rgba(245,158,11,0.8)',width:1.8,dash:'dot'}};
var axX={x:[-0.5,3.2],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.5,3.2],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-0.5,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-0.5,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l70-product-en',[axX,axY,v1,v2,vp,arc1,arc2,arcp],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Division in Polar Form</h2>

<div class="calc-highlight"><strong>The mirror image of multiplication.</strong> Dividing two complex numbers in polar form: divide the moduli, subtract the arguments.</div>

<div class="calc-formula"><div class="formula-label">DIVISION IN POLAR FORM</div><div class="formula-main">$$\\frac{z_1}{z_2} \\;=\\; \\frac{r_1}{r_2} \\, \\text{cis}(\\theta_1 - \\theta_2)$$</div><div class="formula-sub">Valid when $z_2 \\neq 0$. Geometrically: dividing by $z_2$ is the inverse of multiplying by $z_2$ — it shrinks by $r_2$ and rotates clockwise by $\\theta_2$.</div></div>

<p class="l-text"><strong>Special case: reciprocal.</strong> Set $z_1 = 1 = 1\\,\\text{cis}\\,0$. Then $1/z = (1/r)\\,\\text{cis}(-\\theta)$. The reciprocal of $z$ has reciprocal modulus and opposite-sign argument. If $|z| = 1$, then $1/z$ also has modulus 1 — and in fact $1/z = \\bar z$ for points on the unit circle. (Quick check: $z\\bar z = |z|^2 = 1$, so $\\bar z = 1/z$.)</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute $\\dfrac{2\\,\\text{cis}(\\pi/3)}{\\sqrt 2\\,\\text{cis}(\\pi/12)}$ in polar form.<br><br>Divide moduli: $2 / \\sqrt 2 = \\sqrt 2$.<br>Subtract arguments: $\\pi/3 - \\pi/12 = 4\\pi/12 - \\pi/12 = 3\\pi/12 = \\pi/4$.<br><br>Answer: $\\mathbf{\\sqrt 2 \\, \\text{cis}(\\pi/4)} = 1 + i$.</div></div>

<h2 class="lesson-title">10. Two Coordinates for the Same Point</h2>

<p class="l-text">The whole lesson hinges on recognising that <strong>rectangular and polar are two coordinate systems describing the same point in the plane</strong>. Neither is "more correct"; each is convenient for a different task. Adding? Use rectangular. Multiplying? Use polar. Sometimes a single problem requires both, with conversion in the middle.</p>

<div class="calc-graph"><div id="plot-l70-compare-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the complex number $z = 1 + i$ described in two ways. The blue arrow is the rectangular description (real part 1, imaginary part 1, like coordinates on a grid). The pink wedge plus the dashed arc is the polar description (distance $\\sqrt 2$ from the origin, angle $\\pi/4$ from the positive real axis). Same point. Two stories.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ang=Math.PI/4;var r=Math.SQRT2;var px=1,py=1;
var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(r*Math.cos(a));ringY.push(r*Math.sin(a));}
var ring={x:ringX,y:ringY,mode:'lines',name:'circle |z|=√2',line:{color:'rgba(236,72,153,0.35)',width:1.5,dash:'dot'}};
var grid={x:[1,1,1,0,1,1],y:[0,1,1,1,1,0],mode:'lines',name:'rectangular box',line:{color:'rgba(59,130,246,0.5)',width:1.4,dash:'dash'}};
var vec={x:[0,px],y:[0,py],mode:'lines+markers',name:'z = 1 + i',line:{color:'#3b82f6',width:3},marker:{size:[0,11],color:'#3b82f6'}};
var arcX=[],arcY=[];for(var j=0;j<=40;j++){var b=ang*j/40;arcX.push(0.5*Math.cos(b));arcY.push(0.5*Math.sin(b));}
var arc={x:arcX,y:arcY,mode:'lines',name:'angle θ = π/4',line:{color:'#ec4899',width:2.4}};
var lblRect={x:[0.5,1.05],y:[-0.12,0.5],mode:'text',name:'rect',text:['Re = 1','Im = 1'],textfont:{color:'#3b82f6',size:12},showlegend:false};
var lblPol={x:[0.62,0.62],y:[0.22,0.62],mode:'text',name:'pol',text:['θ = π/4','r = √2'],textfont:{color:'#ec4899',size:12},showlegend:false};
var axX={x:[-0.4,1.8],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.4,1.8],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-0.4,1.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-0.4,1.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l70-compare-en',[axX,axY,ring,grid,vec,arc,lblRect,lblPol],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wrong quadrant</div><div class="card-body">Blindly using $\\arctan(b/a)$ in quadrants II and III. Always check the sign of $a$ and adjust by $\\pm\\pi$ accordingly. Sketch the point first.</div></div>
<div class="calc-card"><div class="card-title">Missing parentheses in cis</div><div class="card-body">Writing $r\\,\\text{cis}\\,\\theta_1 + \\theta_2$ when you mean $r\\,\\text{cis}(\\theta_1 + \\theta_2)$. The cis applies only to the sum inside the parentheses.</div></div>
<div class="calc-card"><div class="card-title">Negative modulus</div><div class="card-body">Writing $z = -r\\,\\text{cis}\\,\\theta$ as if the minus could attach to $r$. The modulus is always non-negative; absorb the sign into $\\theta$ by adding $\\pi$.</div></div>
<div class="calc-card"><div class="card-title">Degrees vs radians</div><div class="card-body">Mixing $\\pi/4$ and $45^\\circ$ inside the same formula. Pick one unit per problem. Inside $\\cos$ and $\\sin$, radians are the default.</div></div>
</div>

<h2 class="lesson-title">12. Worked Practice Problems</h2>

<p class="l-text">Work each problem yourself before reading the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — MODULUS</div><div class="example-body"><strong>Find $|z|$ for $z = -5 + 12 i$.</strong><br><br>$|z| = \\sqrt{(-5)^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = \\mathbf{13}$. The familiar 5-12-13 right triangle.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — ARGUMENT</div><div class="example-body"><strong>Find $\\arg z$ for $z = -1 - i$.</strong><br><br>Both $a$ and $b$ are negative — quadrant III. $\\arctan(-1/-1) = \\arctan 1 = \\pi/4$. Subtract $\\pi$: $\\theta = \\pi/4 - \\pi = -3\\pi/4$.<br><br>Answer: $\\mathbf{-3\\pi/4}$ or equivalently $\\mathbf{225^\\circ}$ if we use $[0, 2\\pi)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — RECTANGULAR TO POLAR</div><div class="example-body"><strong>Convert $z = \\sqrt 3 - i$ to polar form (principal argument in $(-\\pi, \\pi]$).</strong><br><br>$r = \\sqrt{3 + 1} = 2$. Quadrant IV ($a > 0, b < 0$). $\\arctan(-1/\\sqrt 3) = -\\pi/6$. No adjustment in quadrant IV.<br><br>Polar: $\\mathbf{2\\,\\text{cis}(-\\pi/6)}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — POLAR TO RECTANGULAR</div><div class="example-body"><strong>Convert $z = 4\\,(\\cos 150^\\circ + i\\sin 150^\\circ)$ to rectangular form.</strong><br><br>$\\cos 150^\\circ = -\\sqrt 3 / 2$. $\\sin 150^\\circ = 1/2$.<br>Real: $4 \\cdot (-\\sqrt 3 / 2) = -2\\sqrt 3$. Imag: $4 \\cdot 1/2 = 2$.<br><br>Rectangular: $\\mathbf{-2\\sqrt 3 + 2 i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — PRODUCT IN POLAR FORM</div><div class="example-body"><strong>Multiply $(2\\,\\text{cis}\\,40^\\circ)(3\\,\\text{cis}\\,80^\\circ)$.</strong><br><br>Moduli multiply: $2 \\cdot 3 = 6$. Arguments add: $40^\\circ + 80^\\circ = 120^\\circ$.<br><br>Answer: $\\mathbf{6\\,\\text{cis}\\,120^\\circ} = 6(-1/2 + i\\sqrt 3 / 2) = -3 + 3\\sqrt 3\\, i$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — QUOTIENT IN POLAR FORM</div><div class="example-body"><strong>Compute $\\dfrac{8\\,\\text{cis}(5\\pi/6)}{4\\,\\text{cis}(\\pi/3)}$.</strong><br><br>Moduli: $8 / 4 = 2$. Arguments: $5\\pi/6 - \\pi/3 = 5\\pi/6 - 2\\pi/6 = 3\\pi/6 = \\pi/2$.<br><br>Answer: $\\mathbf{2\\,\\text{cis}(\\pi/2)} = 2i$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — MULTIPLICATION VIA CONVERSION</div><div class="example-body"><strong>Compute $(1 + i)(1 - i)$ in polar form, then convert back.</strong><br><br>$1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$. $1 - i = \\sqrt 2\\,\\text{cis}(-\\pi/4)$.<br>Product modulus: $\\sqrt 2 \\cdot \\sqrt 2 = 2$. Product argument: $\\pi/4 + (-\\pi/4) = 0$.<br><br>Result: $2\\,\\text{cis}\\,0 = 2(\\cos 0 + i\\sin 0) = \\mathbf{2}$.<br><br>Check by FOIL: $(1 + i)(1 - i) = 1 - i^2 = 1 - (-1) = 2$. Match.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — POWER VIA POLAR</div><div class="example-body"><strong>Compute $(1 + i)^4$ using polar form.</strong><br><br>$1 + i = \\sqrt 2 \\, \\text{cis}(\\pi/4)$. Multiply this by itself four times: modulus raises to the 4th, argument multiplies by 4.<br>$(\\sqrt 2)^4 = 4$. $4 \\cdot \\pi/4 = \\pi$.<br>Result: $4\\,\\text{cis}\\,\\pi = 4(\\cos\\pi + i\\sin\\pi) = 4(-1) = \\mathbf{-4}$.<br><br>This is De Moivre's theorem in action — we will study it formally next lesson.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> The next lesson uses polar form to derive <em>De Moivre's theorem</em>: $(r\\,\\text{cis}\\,\\theta)^n = r^n\\,\\text{cis}(n\\theta)$. The same trick that turned multiplication into adding angles will turn powers into multiplying them — and lead naturally to a formula for the $n$ complex $n$th roots of unity.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Modulus: $|z| = \\sqrt{a^2 + b^2}$, distance from origin; satisfies $|zw| = |z||w|$ and the triangle inequality</li>
<li>Argument: the angle $\\theta$ from the positive real axis; principal value lives in $(-\\pi, \\pi]$ or $[0, 2\\pi)$</li>
<li>Compute $\\theta$ with the quadrant table or atan2 — never blindly $\\arctan(b/a)$</li>
<li>Polar form: $z = r(\\cos\\theta + i\\sin\\theta) = r\\,\\text{cis}\\,\\theta$</li>
<li>Euler preview: $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$, so $z = r e^{i\\theta}$ and $e^{i\\pi} + 1 = 0$</li>
<li>Product: $r_1 r_2 \\, \\text{cis}(\\theta_1 + \\theta_2)$. Quotient: $(r_1/r_2)\\,\\text{cis}(\\theta_1 - \\theta_2)$</li>
<li>Multiplication = rotation + scaling. This is what makes polar form indispensable</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Karmaşık sayıları dikdörtgen formda $z = a + bi$ olarak toplamayı, çıkarmayı, çarpmayı ve bölmeyi zaten biliyorsun.</strong> Bu resim — düzlemde bir nokta — toplama için harikadır (sadece koordinatları topla) ve karmaşık sayının <em>ne olduğunu</em> görselleştirmek için idealdir. Ama matematiğin en önemli iki işlemi için hantaldır: <em>çarpma</em> ve <em>üs alma</em>. Dikdörtgen formda $(a + bi)(c + di)$ her seferinde FOIL açılımı gerektirir. <em>Kutupsal formda</em> ise çarpma tek bir kurala iner: <strong>uzunlukları çarp, açıları topla</strong>.</p>

<p class="l-text">Bu ders, bir karmaşık sayıyı kutupsal koordinatlarda tarif eden iki sayıyı tanıtıyor — <em>modülü</em> $r = |z|$ (başlangıç noktasına olan uzaklık) ve <em>argümanı</em> $\\theta = \\arg z$ (pozitif reel eksenden olan açı). Birlikte, aynı nokta için ikinci bir adres oluştururlar — ve dönme, ölçekleme, kök ve üs içeren problemler için çok daha güçlü bir adres. Dersin sonunda her iki yönde dönüşüm yapabileceksin ve geometriyi anında okuyabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$|z| = \\sqrt{a^2 + b^2}$ modülünü tanımlamayı ve başlangıç noktasına olan uzaklık olarak geometrik yorumlamayı</li>
<li>$\\arg z$ argümanını pozitif reel eksenden olan açı olarak tanımlamayı ve esas değerini $(-\\pi, \\pi]$ aralığında bulmayı</li>
<li>$\\tan\\theta = b/a$ formülünden $\\arg z$ değerini doğru bölge düzeltmesi ile hesaplamayı</li>
<li>Herhangi bir karmaşık sayıyı dikdörtgen $a + bi$ ve kutupsal $r(\\cos\\theta + i\\sin\\theta) = r\\,\\text{cis}\\,\\theta$ formları arasında dönüştürmeyi</li>
<li>Kutupsal formda karmaşık sayıları çarpıp bölmeyi: modüller çarpılır, argümanlar toplanır</li>
<li>Euler formu $z = r e^{i\\theta}$ ve $e^{i\\pi} + 1 = 0$ özdeşliğini önceden görmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Modül: Başlangıç Noktasından Ne Kadar Uzak</h2>

<div class="calc-highlight"><strong>Bir karmaşık sayının modülü, karmaşık düzlemde başlangıç noktasına olan uzaklığıdır.</strong> $z = a + bi$ noktası $(a, b)$ ile temsil ediliyorsa, Pisagor teoremine göre $(0, 0)$ noktasına olan uzaklığı $\\sqrt{a^2 + b^2}$'dir. Bu sayıya <em>modül</em> denir ve $|z|$ ile gösterilir.</div>

<div class="calc-formula"><div class="formula-label">BİR KARMAŞIK SAYININ MODÜLÜ</div><div class="formula-main">$$|z| \\;=\\; |a + bi| \\;=\\; \\sqrt{a^2 + b^2}$$</div><div class="formula-sub">Dikey çubuklar reel sayılardaki mutlak değer ile aynı semboldür — ve bu rastlantı değildir. $z$ reel ise ($b = 0$), $|z| = \\sqrt{a^2} = |a|$ olur, bu da sıradan mutlak değerdir. Modül, $|\\cdot|$ operatörünü reel doğrudan tüm düzleme genişletir.</div></div>

<p class="l-text"><strong>$|z|$ sayısı her zaman negatif değildir,</strong> ve sıfır olması yalnızca $z = 0$ olduğunda mümkündür. Geometrik olarak başlangıçtan $z$ noktasına çizilen okun uzunluğudur. İki karmaşık sayı düzlemde farklı yerlerde olup yine de aynı modüle sahip olabilir — sadece başlangıç çevresinde aynı çember üzerindedirler.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$z = 3 + 4i$ sayısının modülünü bul.<br><br>$|z| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = \\mathbf{5}$.<br><br>Geometrik olarak, $(3, 4)$ noktası başlangıç çevresinde yarıçapı 5 olan çember üzerindedir — reel kısım, sanal kısım ve modülün oluşturduğu ünlü 3-4-5 dik üçgeni.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$z = -2 + 2i$ sayısının modülünü bul.<br><br>$|z| = \\sqrt{(-2)^2 + 2^2} = \\sqrt{4 + 4} = \\sqrt{8} = 2\\sqrt{2}$.<br><br>$a$ ve $b$ işaretleri modül için asla önemli değildir — sadece kareleri önemlidir.</div></div>

<h2 class="lesson-title">2. Modülün Üç Özelliği</h2>

<p class="l-text">Modül, karmaşık sayıların aritmetiği ile güzelce etkileşir. Üç özdeşlik ezberlemeye değer — defalarca karşına çıkacaklar.</p>

<div class="calc-formula"><div class="formula-label">MODÜLÜN ÖZELLİKLERİ</div><div class="formula-main">$$|zw| \\;=\\; |z|\\,|w| \\qquad \\left|\\frac{z}{w}\\right| \\;=\\; \\frac{|z|}{|w|} \\qquad |z + w| \\;\\leq\\; |z| + |w|$$</div><div class="formula-sub">İlk ikisi modülün çarpma ve bölme ile uyumlu olduğunu söyler. Üçüncüsü <em>üçgen eşitsizliğidir</em>: bir üçgenin bir kenarı diğer iki kenarın toplamından asla uzun olamaz.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çarpımsal</div><div class="card-body">$|zw| = |z|\\,|w|$. Çarpımın uzunluğu, uzunlukların çarpımına eşittir. Kutupsal formu çarpım için bu kadar güçlü yapan özelliktir.</div></div>
<div class="calc-card"><div class="card-title">Bölme</div><div class="card-body">$|z/w| = |z|/|w|$ ($w \\neq 0$). Bölümün uzunluğu, uzunlukların bölümüne eşittir.</div></div>
<div class="calc-card"><div class="card-title">Üçgen eşitsizliği</div><div class="card-body">$|z + w| \\leq |z| + |w|$. Geometrik olarak: iki vektörü uç uca toplamak bir üçgen oluşturur ve üçüncü kenar diğer ikisinin toplamını geçemez.</div></div>
</div>

<div class="l-note"><strong>Başka bir yararlı özdeşlik:</strong> $|z|^2 = z \\bar z$, burada $\\bar z = a - bi$ karmaşık eşleniktir. Gerçekten $z \\bar z = (a+bi)(a-bi) = a^2 - (bi)^2 = a^2 + b^2$. Bu, dikdörtgen formda standart bölme formülünün arkasındaki cebirsel kestirmedir.</div>

<h2 class="lesson-title">3. Argüman: Reel Eksenden Olan Açı</h2>

<div class="calc-highlight"><strong>Bir karmaşık sayının argümanı, vektörünün pozitif reel eksenle yaptığı açıdır,</strong> saat yönünün tersine ölçülür. $\\arg z$ ya da $\\theta$ ile gösterilir. Modül ile birleştiğinde, $(r, \\theta)$ çifti $z$'yi tek olarak belirler (başlangıç hariç, orada açı tanımsızdır).</div>

<p class="l-text">Argüman tek başına benzersiz değildir — $2\\pi$'nin herhangi bir tam katı eklendiğinde aynı yön elde edilir. Belirsizliği gidermek için kanonik bir aralık seçeriz ve içindeki değere <strong>esas argüman</strong> deriz. İki yaygın sözleşme kullanılır:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ESAS DEĞER $(-\\pi,\\,\\pi]$ İÇİNDE</div><div class="compare-item">0 etrafında simetriktir</div><div class="compare-item">Üst yarı düzlem: $\\theta \\in (0, \\pi]$</div><div class="compare-item">Alt yarı düzlem: $\\theta \\in (-\\pi, 0)$</div><div class="compare-item">Matematik ve mühendislikte en yaygın</div></div><div class="compare-col"><div class="compare-title">ESAS DEĞER $[0,\\,2\\pi)$ İÇİNDE</div><div class="compare-item">Her zaman negatif değildir</div><div class="compare-item">Ders 1'deki birim çember kuralı ile uyumlu</div><div class="compare-item">Bazı ders kitapları ve trigonometri bağlamında kullanılır</div><div class="compare-item">Bir kuralı seç ve ona sadık kal</div></div></div>

<p class="l-text">Bu derste esas değeri $(-\\pi, \\pi]$ aralığında — yani simetrik olanı — kullanıyoruz, ama türetilen her şey doğrudan diğer sözleşmeye de uygulanır.</p>

<h2 class="lesson-title">4. Argümanı Hesaplama: tan, arctan ve Bölge Tuzağı</h2>

<div class="calc-highlight"><strong>$z = a + bi$ dikdörtgen formundan başlayarak,</strong> kenarları $a$ ve $b$ olan dik üçgen için $\\tan\\theta = b/a$ olur. Yani $\\theta = \\arctan(b/a)$ sanabilirsin. <strong>Bu yalnızca sağ yarı düzlemde doğrudur</strong> ($a > 0$). Sol yarı düzlemde standart $\\arctan$ yanlış cevap verir çünkü her zaman $(-\\pi/2, \\pi/2)$ aralığında bir değer döndürür.</div>

<div class="calc-formula"><div class="formula-label">DİKDÖRTGEN FORMDAN ARGÜMAN</div><div class="formula-main">$$\\arg(a + bi) \\;=\\; \\begin{cases} \\arctan(b/a) & a > 0 \\\\ \\arctan(b/a) + \\pi & a < 0,\\; b \\geq 0 \\\\ \\arctan(b/a) - \\pi & a < 0,\\; b < 0 \\\\ +\\pi/2 & a = 0,\\; b > 0 \\\\ -\\pi/2 & a = 0,\\; b < 0 \\end{cases}$$</div><div class="formula-sub">Dört durum, dört bölgeyi ve iki saf sanal yarı ekseni ayırt eder. Programlama dilleri tüm durumları tek seferde işleyen $\\text{atan2}(b, a)$ fonksiyonunu sağlar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bölge I: $a>0, b>0$</div><div class="card-body">$\\theta = \\arctan(b/a)$. Sonuç $(0, \\pi/2)$. Düzeltme gerekmez.</div></div>
<div class="calc-card"><div class="card-title">Bölge II: $a<0, b>0$</div><div class="card-body">$\\arctan(b/a)$ değerine $\\pi$ ekle. Sonuç $(\\pi/2, \\pi)$.</div></div>
<div class="calc-card"><div class="card-title">Bölge III: $a<0, b<0$</div><div class="card-body">$\\arctan(b/a)$ değerinden $\\pi$ çıkar. Sonuç $(-\\pi, -\\pi/2)$.</div></div>
<div class="calc-card"><div class="card-title">Bölge IV: $a>0, b<0$</div><div class="card-body">$\\theta = \\arctan(b/a)$. Sonuç $(-\\pi/2, 0)$. Düzeltme gerekmez.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$z = 1 + i$ argümanını bul.<br><br>$a = 1, b = 1$, ikisi de pozitif — bölge I. $\\tan\\theta = 1/1 = 1$, yani $\\theta = \\arctan 1 = \\pi/4$.<br><br>Cevap: $\\arg(1 + i) = \\mathbf{\\pi/4} = 45^\\circ$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$z = -1 + \\sqrt{3}\\,i$ argümanını bul.<br><br>$a = -1, b = \\sqrt 3$ — bölge II. $\\tan\\theta = \\sqrt 3 / (-1) = -\\sqrt 3$. Naif $\\arctan(-\\sqrt 3) = -\\pi/3$ verir — ama bu bölge IV'e işaret eder, yanlış yer. $\\pi$ ekle:<br><br>$\\theta = -\\pi/3 + \\pi = \\mathbf{2\\pi/3} = 120^\\circ$. Bölge II. Doğru.</div></div>

<div class="l-note"><strong>Zihinsel kontrol.</strong> Formülü kullanmadan önce noktayı çiz. Cevap gördüğün bölge ile uyuşuyor mu? Formül bölge II'deki bir nokta için $-\\pi/3$ veriyorsa, $+\\pi$ düzeltmesini unuttun. Çizim güvenlik ağındır.</div>

<h2 class="lesson-title">5. Kutupsal Form</h2>

<div class="calc-highlight"><strong>$r$ ve $\\theta$ elimizde olduğunda, herhangi bir karmaşık sayıyı <em>kutupsal formda</em> yeniden yazabiliriz:</strong></div>

<div class="calc-formula"><div class="formula-label">KARMAŞIK SAYININ KUTUPSAL FORMU</div><div class="formula-main">$$z \\;=\\; r(\\cos\\theta + i\\sin\\theta) \\;=\\; r\\,\\text{cis}\\,\\theta$$</div><div class="formula-sub">Burada $r = |z|$ ve $\\theta = \\arg z$. $\\text{cis}\\,\\theta$ gösterimi $\\cos\\theta + i\\sin\\theta$ için kısaltmadır — kısaltma genellikle lise metinlerinde kullanılır ve yazımdan tasarruf sağlar.</div></div>

<p class="l-text"><strong>Bu formül neden işe yarar?</strong> Dikdörtgen formu okuyalım. $r(\\cos\\theta + i\\sin\\theta)$ ifadesinin reel kısmı $r\\cos\\theta$, sanal kısmı $r\\sin\\theta$. Yani nokta $(r\\cos\\theta, r\\sin\\theta)$ konumundadır. Bu, ilköğretim geometrisinden kutupsal-Kartezyen dönüşümünün ta kendisidir. Kutupsal form, kutupsal koordinatların kompakt bir cebirsel yeniden kodlamasıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dikdörtgen: $z = a + bi$</div><div class="card-body">İki reel sayı $(a, b)$. Yatay ve dikey kaydırma ile adresleme. Toplama ve çıkarma için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Kutupsal: $z = r\\,\\text{cis}\\,\\theta$</div><div class="card-body">İki reel sayı $(r, \\theta)$. Uzaklık ve açı ile adresleme. Çarpma, bölme ve üs alma için en iyisi.</div></div>
</div>

<h2 class="lesson-title">6. Euler Formu (Ön İzleme)</h2>

<div class="calc-highlight"><strong>Kutupsal formu tek bir sembole sıkıştıran üçüncü bir form vardır</strong> — ve o kadar önemlidir ki matematiğin tüm bir kanadı üzerine kuruludur. Şimdilik bahsediyoruz, ileri derslerde kullanacağız ve resmi senin sindirebilmen için bırakıyoruz: <em>Euler formu</em>.</div>

<div class="calc-formula"><div class="formula-label">EULER FORMÜLÜ</div><div class="formula-main">$$e^{i\\theta} \\;=\\; \\cos\\theta + i\\sin\\theta$$</div><div class="formula-sub">Saf sanal bir sayının üssünü almak birim çember üzerinde bir nokta verir. Bunu sonra Taylor serileri ile kanıtlayacağız; şimdilik tanım olarak kabul et.</div></div>

<p class="l-text">Kutupsal formda yerine koyarak:</p>

<div class="calc-formula"><div class="formula-label">KARMAŞIK SAYININ EULER FORMU</div><div class="formula-main">$$z \\;=\\; r e^{i\\theta}$$</div><div class="formula-sub">En kompakt gösterim: bir uzunluk $r$ çarpı birim modüllü bir dönme $e^{i\\theta}$. Çarpma sıradan üs aritmetiğine dönüşür.</div></div>

<p class="l-text">Euler formülünde $\\theta = \\pi$ koy: $e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1 + 0i = -1$. Yeniden düzenle:</p>

<div class="calc-formula"><div class="formula-label">EULER ÖZDEŞLİĞİ</div><div class="formula-main">$$e^{i\\pi} + 1 \\;=\\; 0$$</div><div class="formula-sub">Sıklıkla "matematiğin en güzel formülü" denir — en önemli beş sabiti ($e, i, \\pi, 1, 0$) tek bir satırda birleştirir.</div></div>

<h2 class="lesson-title">7. Formlar Arasında Dönüşüm</h2>

<p class="l-text"><strong>Dikdörtgenden kutupsala:</strong> $r = \\sqrt{a^2 + b^2}$ değerini ve $\\theta$ değerini yukarıdaki tablodan hesapla. $z = r\\,\\text{cis}\\,\\theta$ yaz.</p>

<p class="l-text"><strong>Kutupsaldan dikdörtgene:</strong> aç. $z = r(\\cos\\theta + i\\sin\\theta)$ ifadesinde reel kısım $r\\cos\\theta$, sanal kısım $r\\sin\\theta$. $\\cos\\theta$ ve $\\sin\\theta$ için sayısal değerleri yerine koy.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DİKDÖRTGENDEN KUTUPSALA</div><div class="example-body">$z = 1 + i$ sayısını kutupsal forma dönüştür.<br><br>$r = \\sqrt{1^2 + 1^2} = \\sqrt 2$.<br>$\\theta = \\arctan(1/1) = \\pi/4$ (bölge I, düzeltme yok).<br><br>Kutupsal form: $z = \\mathbf{\\sqrt 2\\,\\text{cis}\\,(\\pi/4)} = \\sqrt 2\\,(\\cos 45^\\circ + i\\sin 45^\\circ)$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — DİKDÖRTGENDEN KUTUPSALA</div><div class="example-body">$z = -1 + \\sqrt 3 \\, i$ sayısını kutupsal forma dönüştür.<br><br>$r = \\sqrt{1 + 3} = 2$.<br>$\\theta$: $a < 0, b > 0$ — bölge II. $\\arctan(\\sqrt 3 / (-1)) = \\arctan(-\\sqrt 3) = -\\pi/3$. $\\pi$ ekle: $\\theta = 2\\pi/3$.<br><br>Kutupsal form: $z = \\mathbf{2\\,\\text{cis}\\,(2\\pi/3)} = 2(\\cos 120^\\circ + i\\sin 120^\\circ)$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KUTUPSALDAN DİKDÖRTGENE</div><div class="example-body">$z = 2(\\cos 60^\\circ + i\\sin 60^\\circ)$ sayısını dikdörtgen forma dönüştür.<br><br>$\\cos 60^\\circ = 1/2$, $\\sin 60^\\circ = \\sqrt 3 / 2$.<br>Reel kısım: $2 \\cdot 1/2 = 1$. Sanal kısım: $2 \\cdot \\sqrt 3 / 2 = \\sqrt 3$.<br><br>Dikdörtgen form: $z = \\mathbf{1 + \\sqrt 3\\, i}$.</div></div>

<div class="calc-graph"><div id="plot-l70-argand-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $z = 1 + i$ karmaşık sayısı Argand düzleminde (karmaşık düzlemde) bir nokta olarak. Mavi ok başlangıçtan onun konum vektörüdür — uzunluğu $r = \\sqrt 2$ modülüdür ve pozitif reel eksenle yaptığı açı $\\theta = \\pi/4 = 45^\\circ$ argümanıdır. Kesik yay açıyı görselleştirir; noktalı dikey ve yatay parçalar reel ve sanal kısımları gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ang=Math.PI/4;var r=Math.SQRT2;
var px=Math.cos(ang)*r,py=Math.sin(ang)*r;
var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(r*Math.cos(a));ringY.push(r*Math.sin(a));}
var ringCircle={x:ringX,y:ringY,mode:'lines',name:'|z| çemberi',line:{color:'rgba(255,255,255,0.25)',width:1.3,dash:'dot'}};
var vec={x:[0,px],y:[0,py],mode:'lines+markers',name:'z = 1 + i',line:{color:'#3b82f6',width:3},marker:{size:[0,10],color:'#3b82f6'}};
var realLine={x:[px,px],y:[0,py],mode:'lines',name:'sanal kısım',line:{color:'rgba(245,158,11,0.8)',width:1.5,dash:'dot'}};
var imagLine={x:[0,px],y:[0,0],mode:'lines',name:'reel kısım',line:{color:'rgba(16,185,129,0.8)',width:1.5,dash:'dot'}};
var arcX=[],arcY=[];for(var j=0;j<=40;j++){var b=ang*j/40;arcX.push(0.45*Math.cos(b));arcY.push(0.45*Math.sin(b));}
var arc={x:arcX,y:arcY,mode:'lines',name:'arg z = π/4',line:{color:'#ec4899',width:2,dash:'dash'}};
var labels={x:[px+0.08,px/2,px+0.08,0.55],y:[py+0.06,-0.08,py/2,0.18],mode:'text',name:'etiketler',text:['z = 1 + i','Re(z) = 1','Im(z) = 1','θ'],textfont:{color:['#3b82f6','#10b981','#f59e0b','#ec4899'],size:13},showlegend:false};
var axX={x:[-0.5,2],y:[0,0],mode:'lines',name:'reel eksen',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.5,2],mode:'lines',name:'sanal eksen',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-0.5,2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-0.5,2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l70-argand-tr',[ringCircle,axX,axY,realLine,imagLine,vec,arc,labels],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Kutupsal Formda Çarpma</h2>

<div class="calc-highlight"><strong>Kutupsal formun en büyük üstünlüğü budur.</strong> Dikdörtgen formda iki karmaşık sayıyı çarpmak için FOIL, $i^2 = -1$ üzerinde dikkatli işaret takibi ve iki gerçek çarpmanın hantalca birleştirilmesi gerekir. Kutupsal formda tek bir, şeffaf bir kuraldır: <strong>modülleri çarp, argümanları topla.</strong></div>

<div class="calc-formula"><div class="formula-label">KUTUPSAL FORMDA ÇARPMA</div><div class="formula-main">$$z_1 \\cdot z_2 \\;=\\; r_1 r_2 \\, \\text{cis}(\\theta_1 + \\theta_2)$$</div><div class="formula-sub">$z_1 = r_1\\,\\text{cis}\\,\\theta_1$ ve $z_2 = r_2\\,\\text{cis}\\,\\theta_2$ ise, çarpımları $r_1 r_2$ modülüne ve $\\theta_1 + \\theta_2$ argümanına sahiptir. Uzunluklar çarpılır; açılar toplanır.</div></div>

<p class="l-text"><strong>Neden işe yarar?</strong> cis formunu açıp kosinüs ve sinüs toplam formüllerini uygula:</p>

<div class="calc-formula"><div class="formula-label">İSPAT (TOPLAM FORMÜLLERİYLE)</div><div class="formula-main">$$\\begin{aligned} z_1 z_2 &= r_1(\\cos\\theta_1 + i\\sin\\theta_1) \\cdot r_2(\\cos\\theta_2 + i\\sin\\theta_2) \\\\ &= r_1 r_2 \\bigl[(\\cos\\theta_1\\cos\\theta_2 - \\sin\\theta_1\\sin\\theta_2) + i(\\sin\\theta_1\\cos\\theta_2 + \\cos\\theta_1\\sin\\theta_2)\\bigr] \\\\ &= r_1 r_2 \\bigl[\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)\\bigr] \\end{aligned}$$</div></div>

<p class="l-text"><strong>Geometrik anlam.</strong> $z_2$ ile çarpma düzlem üzerinde <em>$r_2$ ile ölçekleme ve $\\theta_2$ kadar dönme</em> olarak etki eder. $|z_2| = 1$ ise, çarpma saf dönmedir. $\\theta_2 = 0$ ise, saf ölçeklemedir. Bu, göreceğin karmaşık çarpmanın en temiz tanımıdır — ve karmaşık sayıların kuantum mekaniğinden AC devre analizine kadar her alanda merkezi rolünü açıklar.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$(1 + i)(\\sqrt 3 + i)$ ifadesini kutupsal formda çarp.<br><br>Her çarpanı dönüştür.<br>$|1 + i| = \\sqrt 2$, $\\arg(1 + i) = \\pi/4$. Yani $1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$.<br>$|\\sqrt 3 + i| = \\sqrt{3 + 1} = 2$, $\\arg(\\sqrt 3 + i) = \\arctan(1/\\sqrt 3) = \\pi/6$. Yani $\\sqrt 3 + i = 2\\,\\text{cis}(\\pi/6)$.<br><br>Çarp: $\\sqrt 2 \\cdot 2 = 2\\sqrt 2$. Argümanları topla: $\\pi/4 + \\pi/6 = 3\\pi/12 + 2\\pi/12 = 5\\pi/12$.<br><br>Kutupsal cevap: $\\mathbf{2\\sqrt 2\\,\\text{cis}(5\\pi/12)}$.<br><br>Dikdörtgen kontrolü: $5\\pi/12 = 75^\\circ$. $\\cos 75^\\circ \\approx 0.2588$, $\\sin 75^\\circ \\approx 0.9659$. Reel kısım $\\approx 2\\sqrt 2 \\cdot 0.2588 \\approx 0.732$. Sanal kısım $\\approx 2\\sqrt 2 \\cdot 0.9659 \\approx 2.732$.<br>Doğrudan FOIL: $(1+i)(\\sqrt 3 + i) = \\sqrt 3 + i + i\\sqrt 3 + i^2 = (\\sqrt 3 - 1) + (1 + \\sqrt 3)i \\approx 0.732 + 2.732 i$. Uyuşur.</div></div>

<div class="calc-graph"><div id="plot-l70-product-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> iki karmaşık sayı $z_1 = \\sqrt 2 \\, \\text{cis}(\\pi/4)$ (mavi, uzunluk $\\sqrt 2 \\approx 1.41$, açı $45^\\circ$) ve $z_2 = 2 \\, \\text{cis}(\\pi/6)$ (yeşil, uzunluk 2, açı $30^\\circ$). Çarpımları $z_1 z_2$, $2\\sqrt 2 \\approx 2.83$ modülüne (uzunlukların çarpımı) ve $75^\\circ$ argümanına (açıların toplamı) sahiptir. Turuncu ok çarpımdır; toplam uzaklık $r_1 r_2$'de $\\theta_1 + \\theta_2$ açısı boyunca nasıl uzandığına dikkat et.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var r1=Math.SQRT2,t1=Math.PI/4;var r2=2,t2=Math.PI/6;
var rp=r1*r2,tp=t1+t2;
var z1x=r1*Math.cos(t1),z1y=r1*Math.sin(t1);
var z2x=r2*Math.cos(t2),z2y=r2*Math.sin(t2);
var zpx=rp*Math.cos(tp),zpy=rp*Math.sin(tp);
var v1={x:[0,z1x],y:[0,z1y],mode:'lines+markers',name:'z₁ = √2 cis(π/4)',line:{color:'#3b82f6',width:3},marker:{size:[0,9]}};
var v2={x:[0,z2x],y:[0,z2y],mode:'lines+markers',name:'z₂ = 2 cis(π/6)',line:{color:'#10b981',width:3},marker:{size:[0,9]}};
var vp={x:[0,zpx],y:[0,zpy],mode:'lines+markers',name:'z₁z₂ = 2√2 cis(5π/12)',line:{color:'#f59e0b',width:3.5},marker:{size:[0,11]}};
var arc1X=[],arc1Y=[];for(var j=0;j<=40;j++){var b=t1*j/40;arc1X.push(0.4*Math.cos(b));arc1Y.push(0.4*Math.sin(b));}
var arc2X=[],arc2Y=[];for(var j=0;j<=40;j++){var b=t2*j/40;arc2X.push(0.55*Math.cos(b));arc2Y.push(0.55*Math.sin(b));}
var arcpX=[],arcpY=[];for(var j=0;j<=50;j++){var b=tp*j/50;arcpX.push(0.85*Math.cos(b));arcpY.push(0.85*Math.sin(b));}
var arc1={x:arc1X,y:arc1Y,mode:'lines',name:'θ₁ = π/4',line:{color:'rgba(59,130,246,0.7)',width:1.5,dash:'dash'}};
var arc2={x:arc2X,y:arc2Y,mode:'lines',name:'θ₂ = π/6',line:{color:'rgba(16,185,129,0.7)',width:1.5,dash:'dash'}};
var arcp={x:arcpX,y:arcpY,mode:'lines',name:'θ₁+θ₂ = 5π/12',line:{color:'rgba(245,158,11,0.8)',width:1.8,dash:'dot'}};
var axX={x:[-0.5,3.2],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.5,3.2],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-0.5,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-0.5,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l70-product-tr',[axX,axY,v1,v2,vp,arc1,arc2,arcp],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Kutupsal Formda Bölme</h2>

<div class="calc-highlight"><strong>Çarpmanın ayna görüntüsü.</strong> Kutupsal formda iki karmaşık sayıyı bölme: modülleri böl, argümanları çıkar.</div>

<div class="calc-formula"><div class="formula-label">KUTUPSAL FORMDA BÖLME</div><div class="formula-main">$$\\frac{z_1}{z_2} \\;=\\; \\frac{r_1}{r_2} \\, \\text{cis}(\\theta_1 - \\theta_2)$$</div><div class="formula-sub">$z_2 \\neq 0$ olduğunda geçerli. Geometrik olarak: $z_2$ ile bölme, $z_2$ ile çarpmanın tersidir — $r_2$ ile küçültür ve $\\theta_2$ kadar saat yönünde döndürür.</div></div>

<p class="l-text"><strong>Özel durum: tersini alma.</strong> $z_1 = 1 = 1\\,\\text{cis}\\,0$ koy. O zaman $1/z = (1/r)\\,\\text{cis}(-\\theta)$. $z$ sayısının tersi, ters modüle ve ters işaretli argümana sahiptir. $|z| = 1$ ise, $1/z$ de modülü 1'dir — ve aslında birim çember üzerindeki noktalar için $1/z = \\bar z$. (Hızlı kontrol: $z\\bar z = |z|^2 = 1$, dolayısıyla $\\bar z = 1/z$.)</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\dfrac{2\\,\\text{cis}(\\pi/3)}{\\sqrt 2\\,\\text{cis}(\\pi/12)}$ ifadesini kutupsal formda hesapla.<br><br>Modülleri böl: $2 / \\sqrt 2 = \\sqrt 2$.<br>Argümanları çıkar: $\\pi/3 - \\pi/12 = 4\\pi/12 - \\pi/12 = 3\\pi/12 = \\pi/4$.<br><br>Cevap: $\\mathbf{\\sqrt 2 \\, \\text{cis}(\\pi/4)} = 1 + i$.</div></div>

<h2 class="lesson-title">10. Aynı Nokta İçin İki Koordinat</h2>

<p class="l-text">Tüm ders şu fark üzerine kurulur: <strong>dikdörtgen ve kutupsal, düzlemdeki aynı noktayı tarif eden iki koordinat sistemidir</strong>. Hiçbiri "daha doğru" değildir; her biri farklı bir iş için uygundur. Toplama mı yapıyorsun? Dikdörtgen kullan. Çarpma mı? Kutupsal kullan. Bazen tek bir problem her ikisini de gerektirir, ortada dönüşüm ile.</p>

<div class="calc-graph"><div id="plot-l70-compare-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $z = 1 + i$ karmaşık sayısı iki şekilde tarif edilmiş. Mavi ok dikdörtgen tarifidir (reel kısım 1, sanal kısım 1, bir tablodaki koordinatlar gibi). Pembe yay artı kesik yay kutupsal tarifidir (başlangıçtan $\\sqrt 2$ uzakta, pozitif reel eksenden $\\pi/4$ açı). Aynı nokta. İki hikaye.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ang=Math.PI/4;var r=Math.SQRT2;var px=1,py=1;
var ringX=[],ringY=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;ringX.push(r*Math.cos(a));ringY.push(r*Math.sin(a));}
var ring={x:ringX,y:ringY,mode:'lines',name:'çember |z|=√2',line:{color:'rgba(236,72,153,0.35)',width:1.5,dash:'dot'}};
var grid={x:[1,1,1,0,1,1],y:[0,1,1,1,1,0],mode:'lines',name:'dikdörtgen kutu',line:{color:'rgba(59,130,246,0.5)',width:1.4,dash:'dash'}};
var vec={x:[0,px],y:[0,py],mode:'lines+markers',name:'z = 1 + i',line:{color:'#3b82f6',width:3},marker:{size:[0,11],color:'#3b82f6'}};
var arcX=[],arcY=[];for(var j=0;j<=40;j++){var b=ang*j/40;arcX.push(0.5*Math.cos(b));arcY.push(0.5*Math.sin(b));}
var arc={x:arcX,y:arcY,mode:'lines',name:'açı θ = π/4',line:{color:'#ec4899',width:2.4}};
var lblRect={x:[0.5,1.05],y:[-0.12,0.5],mode:'text',name:'rect',text:['Re = 1','Im = 1'],textfont:{color:'#3b82f6',size:12},showlegend:false};
var lblPol={x:[0.62,0.62],y:[0.22,0.62],mode:'text',name:'pol',text:['θ = π/4','r = √2'],textfont:{color:'#ec4899',size:12},showlegend:false};
var axX={x:[-0.4,1.8],y:[0,0],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var axY={x:[0,0],y:[-0.4,1.8],mode:'lines',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-0.4,1.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-0.4,1.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l70-compare-tr',[axX,axY,ring,grid,vec,arc,lblRect,lblPol],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yanlış bölge</div><div class="card-body">Bölge II ve III'te körü körüne $\\arctan(b/a)$ kullanmak. Her zaman $a$ işaretini kontrol et ve $\\pm\\pi$ ile gerektiği gibi düzelt. Önce noktayı çiz.</div></div>
<div class="calc-card"><div class="card-title">cis'de eksik parantez</div><div class="card-body">$r\\,\\text{cis}(\\theta_1 + \\theta_2)$ yerine $r\\,\\text{cis}\\,\\theta_1 + \\theta_2$ yazmak. cis yalnızca parantez içindeki toplama uygulanır.</div></div>
<div class="calc-card"><div class="card-title">Negatif modül</div><div class="card-body">Eksi $r$ ile birleştirilebilirmiş gibi $z = -r\\,\\text{cis}\\,\\theta$ yazmak. Modül her zaman negatif değildir; işareti $\\theta$'ya $\\pi$ ekleyerek emdir.</div></div>
<div class="calc-card"><div class="card-title">Derece ve radyan</div><div class="card-body">Aynı formülde $\\pi/4$ ile $45^\\circ$ karıştırmak. Problem başına bir birim seç. $\\cos$ ve $\\sin$ içinde radyan varsayılandır.</div></div>
</div>

<h2 class="lesson-title">12. Çözümlü Pratik Soruları</h2>

<p class="l-text">Çözümü okumadan önce her soruyu kendin yap.</p>

<div class="calc-example"><div class="example-label">SORU 1 — MODÜL</div><div class="example-body"><strong>$z = -5 + 12 i$ için $|z|$ bul.</strong><br><br>$|z| = \\sqrt{(-5)^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = \\mathbf{13}$. Tanıdık 5-12-13 dik üçgeni.</div></div>

<div class="calc-example"><div class="example-label">SORU 2 — ARGÜMAN</div><div class="example-body"><strong>$z = -1 - i$ için $\\arg z$ bul.</strong><br><br>$a$ ve $b$ her ikisi de negatif — bölge III. $\\arctan(-1/-1) = \\arctan 1 = \\pi/4$. $\\pi$ çıkar: $\\theta = \\pi/4 - \\pi = -3\\pi/4$.<br><br>Cevap: $\\mathbf{-3\\pi/4}$ ya da eşdeğer olarak $[0, 2\\pi)$ aralığında $\\mathbf{225^\\circ}$.</div></div>

<div class="calc-example"><div class="example-label">SORU 3 — DİKDÖRTGENDEN KUTUPSALA</div><div class="example-body"><strong>$z = \\sqrt 3 - i$ sayısını kutupsal forma dönüştür (esas argüman $(-\\pi, \\pi]$).</strong><br><br>$r = \\sqrt{3 + 1} = 2$. Bölge IV ($a > 0, b < 0$). $\\arctan(-1/\\sqrt 3) = -\\pi/6$. Bölge IV'te düzeltme yok.<br><br>Kutupsal: $\\mathbf{2\\,\\text{cis}(-\\pi/6)}$.</div></div>

<div class="calc-example"><div class="example-label">SORU 4 — KUTUPSALDAN DİKDÖRTGENE</div><div class="example-body"><strong>$z = 4\\,(\\cos 150^\\circ + i\\sin 150^\\circ)$ sayısını dikdörtgen forma dönüştür.</strong><br><br>$\\cos 150^\\circ = -\\sqrt 3 / 2$. $\\sin 150^\\circ = 1/2$.<br>Reel: $4 \\cdot (-\\sqrt 3 / 2) = -2\\sqrt 3$. Sanal: $4 \\cdot 1/2 = 2$.<br><br>Dikdörtgen: $\\mathbf{-2\\sqrt 3 + 2 i}$.</div></div>

<div class="calc-example"><div class="example-label">SORU 5 — KUTUPSAL FORMDA ÇARPIM</div><div class="example-body"><strong>$(2\\,\\text{cis}\\,40^\\circ)(3\\,\\text{cis}\\,80^\\circ)$ çarpımını hesapla.</strong><br><br>Modüller çarpılır: $2 \\cdot 3 = 6$. Argümanlar toplanır: $40^\\circ + 80^\\circ = 120^\\circ$.<br><br>Cevap: $\\mathbf{6\\,\\text{cis}\\,120^\\circ} = 6(-1/2 + i\\sqrt 3 / 2) = -3 + 3\\sqrt 3\\, i$.</div></div>

<div class="calc-example"><div class="example-label">SORU 6 — KUTUPSAL FORMDA BÖLÜM</div><div class="example-body"><strong>$\\dfrac{8\\,\\text{cis}(5\\pi/6)}{4\\,\\text{cis}(\\pi/3)}$ ifadesini hesapla.</strong><br><br>Modüller: $8 / 4 = 2$. Argümanlar: $5\\pi/6 - \\pi/3 = 5\\pi/6 - 2\\pi/6 = 3\\pi/6 = \\pi/2$.<br><br>Cevap: $\\mathbf{2\\,\\text{cis}(\\pi/2)} = 2i$.</div></div>

<div class="calc-example"><div class="example-label">SORU 7 — DÖNÜŞÜM ARACILIĞIYLA ÇARPMA</div><div class="example-body"><strong>$(1 + i)(1 - i)$ ifadesini kutupsal formda hesapla, sonra geri dönüştür.</strong><br><br>$1 + i = \\sqrt 2\\,\\text{cis}(\\pi/4)$. $1 - i = \\sqrt 2\\,\\text{cis}(-\\pi/4)$.<br>Çarpım modülü: $\\sqrt 2 \\cdot \\sqrt 2 = 2$. Çarpım argümanı: $\\pi/4 + (-\\pi/4) = 0$.<br><br>Sonuç: $2\\,\\text{cis}\\,0 = 2(\\cos 0 + i\\sin 0) = \\mathbf{2}$.<br><br>FOIL ile kontrol: $(1 + i)(1 - i) = 1 - i^2 = 1 - (-1) = 2$. Uyuşur.</div></div>

<div class="calc-example"><div class="example-label">SORU 8 — KUTUPSAL ARACILIĞIYLA ÜS</div><div class="example-body"><strong>$(1 + i)^4$ ifadesini kutupsal form kullanarak hesapla.</strong><br><br>$1 + i = \\sqrt 2 \\, \\text{cis}(\\pi/4)$. Bunu dört kez kendisi ile çarp: modül 4. üsse yükselir, argüman 4 ile çarpılır.<br>$(\\sqrt 2)^4 = 4$. $4 \\cdot \\pi/4 = \\pi$.<br>Sonuç: $4\\,\\text{cis}\\,\\pi = 4(\\cos\\pi + i\\sin\\pi) = 4(-1) = \\mathbf{-4}$.<br><br>Bu işin içinde De Moivre teoremi var — sonraki derste resmi olarak inceleyeceğiz.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Sonraki ders kutupsal formu kullanarak <em>De Moivre teoremini</em> türetir: $(r\\,\\text{cis}\\,\\theta)^n = r^n\\,\\text{cis}(n\\theta)$. Çarpmayı açıları toplamaya çeviren aynı numara, üs almayı açıları çarpmaya çevirecek — ve $n$-inci birim köklerini bulmaya doğal olarak götürecek.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Modül: $|z| = \\sqrt{a^2 + b^2}$, başlangıca olan uzaklık; $|zw| = |z||w|$ ve üçgen eşitsizliğini sağlar</li>
<li>Argüman: pozitif reel eksenden olan $\\theta$ açısı; esas değer $(-\\pi, \\pi]$ veya $[0, 2\\pi)$ aralığında</li>
<li>$\\theta$'yı bölge tablosu veya atan2 ile hesapla — asla körü körüne $\\arctan(b/a)$ kullanma</li>
<li>Kutupsal form: $z = r(\\cos\\theta + i\\sin\\theta) = r\\,\\text{cis}\\,\\theta$</li>
<li>Euler ön izleme: $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$, dolayısıyla $z = r e^{i\\theta}$ ve $e^{i\\pi} + 1 = 0$</li>
<li>Çarpım: $r_1 r_2 \\, \\text{cis}(\\theta_1 + \\theta_2)$. Bölüm: $(r_1/r_2)\\,\\text{cis}(\\theta_1 - \\theta_2)$</li>
<li>Çarpma = dönme + ölçekleme. Kutupsal formu vazgeçilmez yapan budur</li>
</ul>
</div>`
};
