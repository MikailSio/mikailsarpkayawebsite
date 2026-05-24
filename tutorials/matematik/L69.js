window.LISE_MAT_L69 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You already know how to add real numbers, multiply them and divide them.</strong> A complex number $z = a + bi$ is just an ordered pair of real numbers — the <em>real part</em> $a$ and the <em>imaginary part</em> $b$ — bolted together with the symbol $i$, the square root of $-1$. In this lesson we learn what it means to add, subtract, multiply and divide two such pairs, and we meet a brand-new operation that has no analogue in $\\mathbb{R}$: the <strong>conjugate</strong>. The conjugate is the secret that makes division work, and it is the bridge between algebra and the geometric picture you will see in lesson 70.</p>

<p class="l-text">Everything in this lesson follows from one single rule: <strong>treat $i$ like an ordinary variable, but the moment you see $i^2$, replace it with $-1$.</strong> If you keep that one rule in mind, the rest is mechanical — just like multiplying polynomials in lesson 30. By the end you will be able to perform every arithmetic operation on complex numbers fluently, recognise the conjugate at sight, and use it to rewrite an awkward fraction as a clean $a + bi$.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Add and subtract complex numbers component by component, just like vectors in the plane</li>
<li>Multiply complex numbers by distributing carefully and using $i^2 = -1$</li>
<li>Define the conjugate $\\bar{z} = a - bi$ and prove the identities $z + \\bar{z} = 2\\,\\mathrm{Re}(z)$, $z - \\bar{z} = 2i\\,\\mathrm{Im}(z)$, $z\\bar{z} = a^2 + b^2$</li>
<li>Use the linearity laws $\\overline{z+w} = \\bar{z} + \\bar{w}$ and $\\overline{zw} = \\bar{z}\\cdot\\bar{w}$ without re-deriving them</li>
<li>Divide one complex number by another by multiplying numerator and denominator by the conjugate</li>
<li>Solve simple linear equations involving $z$ and $\\bar{z}$ by writing $z = a + bi$ and matching real and imaginary parts</li>
</ul>
</div>

<h2 class="lesson-title">1. The Ground Rule: $i^2 = -1$</h2>

<div class="calc-highlight"><strong>One symbol, one rule.</strong> A complex number is written $z = a + bi$ where $a, b \\in \\mathbb{R}$ and $i$ is a brand-new symbol satisfying $i^2 = -1$. Every other formula in this lesson is just polynomial algebra plus this one substitution.</div>

<p class="l-text">In lesson 68 we introduced the symbol $i$ as a solution of the equation $x^2 + 1 = 0$ — an equation with no real solutions. Once we agree that such a number exists, we can write down expressions like $3 + 2i$, $-4i$, $\\pi - i$ and ask how to do arithmetic with them. The answer is: treat $i$ exactly as you would treat the variable $x$ in a polynomial, with the single proviso that whenever the expression $i^2$ appears, you immediately replace it with $-1$ and simplify.</p>

<div class="calc-formula"><div class="formula-label">THE FUNDAMENTAL RULE</div><div class="formula-main">$$i^2 \\;=\\; -1 \\qquad\\Longleftrightarrow\\qquad i \\;=\\; \\sqrt{-1}$$</div><div class="formula-sub">Everything below follows from this. Memorise it now, use it without hesitation throughout the lesson.</div></div>

<p class="l-text">A consequence worth noting: powers of $i$ cycle every four steps. $i^1 = i$, $i^2 = -1$, $i^3 = i^2 \\cdot i = -i$, $i^4 = i^2 \\cdot i^2 = 1$, and then we are back at $i^5 = i$ again. We will use $i^2 = -1$ constantly in section 3.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Real part</div><div class="card-body">$\\mathrm{Re}(z) = a$. The coefficient that sits without an $i$.</div></div>
<div class="calc-card"><div class="card-title">Imaginary part</div><div class="card-body">$\\mathrm{Im}(z) = b$. The coefficient of $i$ — note that this is a <em>real number</em>, not $bi$.</div></div>
<div class="calc-card"><div class="card-title">Equality</div><div class="card-body">$a + bi = c + di$ iff $a = c$ and $b = d$. Two complex numbers are equal exactly when both parts match.</div></div>
</div>

<h2 class="lesson-title">2. Addition and Subtraction</h2>

<div class="calc-highlight"><strong>Addition is component-wise.</strong> Add the real parts, add the imaginary parts, write the result as a single complex number. Subtraction is identical with a minus sign. This is exactly the rule for adding vectors in the plane — and that is no coincidence, as we will see in section 8.</div>

<div class="calc-formula"><div class="formula-label">ADDITION</div><div class="formula-main">$$(a + bi) + (c + di) \\;=\\; (a + c) + (b + d)\\,i$$</div><div class="formula-sub">Real parts add to real parts, imaginary parts add to imaginary parts. Never mix them.</div></div>

<div class="calc-formula"><div class="formula-label">SUBTRACTION</div><div class="formula-main">$$(a + bi) - (c + di) \\;=\\; (a - c) + (b - d)\\,i$$</div><div class="formula-sub">Same rule, just with minus signs. Think of it as adding $(-c) + (-d)i$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Compute $(3 + 2i) + (1 - 4i)$.<br><br>Real parts: $3 + 1 = 4$.<br>Imaginary parts: $2 + (-4) = -2$.<br><br>Answer: $\\mathbf{4 - 2i}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Compute $(5 - 3i) - (2 + 7i)$.<br><br>Real parts: $5 - 2 = 3$.<br>Imaginary parts: $-3 - 7 = -10$.<br><br>Answer: $\\mathbf{3 - 10i}$.</div></div>

<div class="calc-graph"><div id="plot-l69-add-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the addition $(3 + 2i) + (1 - 4i) = 4 - 2i$ as a vector sum in the Argand plane. The blue arrow is $z_1 = 3 + 2i$, the green arrow is $z_2 = 1 - 4i$, the orange arrow is their sum. Notice the parallelogram rule — exactly the same as adding force vectors in physics.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var z1={x:[0,3],y:[0,2],mode:'lines+markers',name:'z₁ = 3+2i',line:{color:'#3b82f6',width:3},marker:{size:[6,10],color:'#3b82f6'}};
var z2={x:[0,1],y:[0,-4],mode:'lines+markers',name:'z₂ = 1−4i',line:{color:'#10b981',width:3},marker:{size:[6,10],color:'#10b981'}};
var zsum={x:[0,4],y:[0,-2],mode:'lines+markers',name:'z₁+z₂ = 4−2i',line:{color:'#f59e0b',width:3.5},marker:{size:[6,12],color:'#f59e0b'}};
var dash1={x:[3,4],y:[2,-2],mode:'lines',name:'',line:{color:'rgba(16,185,129,0.5)',width:1.5,dash:'dot'},showlegend:false};
var dash2={x:[1,4],y:[-4,-2],mode:'lines',name:'',line:{color:'rgba(59,130,246,0.5)',width:1.5,dash:'dot'},showlegend:false};
var labels={x:[3,1,4],y:[2.2,-4.3,-2.3],mode:'text',name:'',text:['z₁','z₂','z₁+z₂'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'Im',range:[-5,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l69-add-en',[z1,z2,dash1,dash2,zsum,labels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Algebraic properties.</strong> Addition of complex numbers is commutative ($z + w = w + z$), associative ($(z + w) + u = z + (w + u)$), has an identity $0 = 0 + 0i$, and every $z$ has an additive inverse $-z = -a - bi$. In short: $\\mathbb{C}$ under addition behaves exactly like $\\mathbb{R}^2$ under vector addition.</div>

<h2 class="lesson-title">3. Multiplication</h2>

<div class="calc-highlight"><strong>Multiplication is distribution, plus the substitution $i^2 = -1$.</strong> Treat $(a + bi)(c + di)$ exactly as you would treat $(a + bx)(c + dx)$ — multiply term by term — and then replace any $i^2$ that appears with $-1$.</div>

<p class="l-text">Let us derive the formula once, slowly, so the final result feels obvious. Take two complex numbers $z = a + bi$ and $w = c + di$ and multiply:</p>

<div class="calc-formula"><div class="formula-label">MULTIPLICATION — DERIVATION</div><div class="formula-main">$$\\begin{aligned}(a + bi)(c + di) &= ac + adi + bci + bd\\,i^2 \\\\ &= ac + adi + bci - bd \\\\ &= (ac - bd) + (ad + bc)\\,i\\end{aligned}$$</div><div class="formula-sub">Step 1: expand by distribution. Step 2: replace $i^2$ with $-1$. Step 3: collect real and imaginary parts.</div></div>

<div class="calc-formula"><div class="formula-label">MULTIPLICATION — THE RESULT</div><div class="formula-main">$$(a + bi)(c + di) \\;=\\; (ac - bd) + (ad + bc)\\,i$$</div><div class="formula-sub">You can memorise the formula or — better — re-derive it each time by distribution. The latter is more robust because the rule scales to higher powers of $i$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Compute $(2 + 3i)(1 - i)$.<br><br>By distribution: $2 \\cdot 1 + 2 \\cdot (-i) + 3i \\cdot 1 + 3i \\cdot (-i)$<br>$\\quad = 2 - 2i + 3i - 3i^2$<br>$\\quad = 2 - 2i + 3i + 3$ (since $-3i^2 = -3(-1) = +3$)<br>$\\quad = (2 + 3) + (-2 + 3)i$<br>$\\quad = \\mathbf{5 + i}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4</div><div class="example-body">Compute $(4 - 2i)(3 + 5i)$.<br><br>By distribution: $12 + 20i - 6i - 10i^2 = 12 + 20i - 6i + 10 = (12 + 10) + (20 - 6)i = \\mathbf{22 + 14i}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5 — A SPECIAL CASE</div><div class="example-body">Compute $(1 + i)^2$.<br><br>$(1 + i)^2 = 1 + 2i + i^2 = 1 + 2i - 1 = \\mathbf{2i}$.<br><br>Note how the real parts cancelled exactly. This is a useful shortcut: $(1+i)^2 = 2i$, hence $(1+i)^4 = (2i)^2 = -4$.</div></div>

<div class="l-note"><strong>Algebraic properties of multiplication.</strong> Complex multiplication is commutative, associative, distributive over addition, has identity $1 = 1 + 0i$, and (as we will see in section 6) every non-zero $z$ has a multiplicative inverse. So $\\mathbb{C}$ is a <em>field</em>, with the same rich algebraic structure as $\\mathbb{R}$ — but bigger.</div>

<h2 class="lesson-title">4. The Conjugate</h2>

<div class="calc-highlight"><strong>The conjugate of $z = a + bi$ is $\\bar{z} = a - bi$.</strong> You flip the sign of the imaginary part and leave the real part alone. Geometrically (lesson 70 will draw this) the conjugate is the mirror image of $z$ across the real axis.</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF THE CONJUGATE</div><div class="formula-main">$$z = a + bi \\quad\\Longrightarrow\\quad \\bar{z} = a - bi$$</div><div class="formula-sub">Same real part, opposite imaginary part. Some textbooks write $z^{*}$ instead of $\\bar{z}$; both mean the same thing.</div></div>

<p class="l-text">Three identities follow immediately from the definition. They are short, useful, and worth memorising:</p>

<div class="calc-formula"><div class="formula-label">THREE KEY IDENTITIES</div><div class="formula-main">$$z + \\bar{z} \\;=\\; 2\\,\\mathrm{Re}(z) \\qquad z - \\bar{z} \\;=\\; 2i\\,\\mathrm{Im}(z) \\qquad z\\bar{z} \\;=\\; a^2 + b^2$$</div><div class="formula-sub">The first two pick out the real and imaginary parts; the third produces a non-negative real number.</div></div>

<p class="l-text"><strong>Why does $z\\bar{z}$ land in $\\mathbb{R}$?</strong> Let us verify with the multiplication rule. If $z = a + bi$, then $\\bar{z} = a - bi$ and</p>

<div class="calc-formula"><div class="formula-label">PROOF THAT $z\\bar{z} = a^2 + b^2$</div><div class="formula-main">$$z\\bar{z} \\;=\\; (a + bi)(a - bi) \\;=\\; a^2 - (bi)^2 \\;=\\; a^2 - b^2 i^2 \\;=\\; a^2 + b^2$$</div><div class="formula-sub">Difference of squares! The cross terms $-abi + abi$ cancel, the $i^2$ flips a sign, and we are left with a sum of real squares.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$z + \\bar{z}$</div><div class="card-body">$(a+bi) + (a-bi) = 2a = 2\\,\\mathrm{Re}(z)$. Twice the real part, no imaginary component.</div></div>
<div class="calc-card"><div class="card-title">$z - \\bar{z}$</div><div class="card-body">$(a+bi) - (a-bi) = 2bi = 2i\\,\\mathrm{Im}(z)$. Twice the imaginary part times $i$, no real component.</div></div>
<div class="calc-card"><div class="card-title">$z\\bar{z}$</div><div class="card-body">$a^2 + b^2 \\geq 0$. A real, non-negative number. This is the squared modulus $|z|^2$ — see lesson 70.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6</div><div class="example-body">Let $z = 3 + 4i$. Compute $\\bar{z}$, $z + \\bar{z}$, $z - \\bar{z}$ and $z\\bar{z}$.<br><br>$\\bar{z} = 3 - 4i$.<br>$z + \\bar{z} = (3+4i) + (3-4i) = 6 = 2 \\cdot 3 = 2\\,\\mathrm{Re}(z)$. ✓<br>$z - \\bar{z} = (3+4i) - (3-4i) = 8i = 2i \\cdot 4 = 2i\\,\\mathrm{Im}(z)$. ✓<br>$z\\bar{z} = (3+4i)(3-4i) = 9 - 16 i^2 = 9 + 16 = \\mathbf{25} = 3^2 + 4^2$. ✓<br><br>Notice that $z\\bar{z} = 25$ matches $a^2 + b^2 = 9 + 16$. In lesson 70 you will recognise $\\sqrt{25} = 5$ as the <em>modulus</em> of $z$.</div></div>

<div class="calc-graph"><div id="plot-l69-conj-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the point $z = 3 + 4i$ and its conjugate $\\bar{z} = 3 - 4i$ in the Argand plane. They sit at mirror-image positions across the real axis (the horizontal line). The dashed line marks the axis of reflection — the conjugate operation is geometrically a reflection.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var zArr={x:[0,3],y:[0,4],mode:'lines+markers',name:'z = 3+4i',line:{color:'#3b82f6',width:3},marker:{size:[6,11],color:'#3b82f6'}};
var zbarArr={x:[0,3],y:[0,-4],mode:'lines+markers',name:'z̄ = 3−4i',line:{color:'#ef4444',width:3},marker:{size:[6,11],color:'#ef4444'}};
var mirror={x:[3,3],y:[4,-4],mode:'lines',name:'reflection',line:{color:'rgba(245,158,11,0.7)',width:1.5,dash:'dot'}};
var realAx={x:[-1,5],y:[0,0],mode:'lines',name:'real axis',line:{color:'rgba(255,255,255,0.4)',width:1.5}};
var pointLabels={x:[3.3,3.3],y:[4,-4],mode:'text',name:'',text:['z','z̄'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'Im',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l69-conj-en',[realAx,zArr,zbarArr,mirror,pointLabels],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Conjugate of a Sum and Conjugate of a Product</h2>

<div class="calc-highlight"><strong>The conjugate is a linear operation — and more than linear, it commutes with multiplication too.</strong> Two laws cover everything: $\\overline{z + w} = \\bar{z} + \\bar{w}$ and $\\overline{zw} = \\bar{z}\\cdot\\bar{w}$. Once you have these, you almost never need to expand a conjugate by brute force again.</div>

<div class="calc-formula"><div class="formula-label">LINEARITY AND MULTIPLICATIVITY OF THE CONJUGATE</div><div class="formula-main">$$\\overline{z + w} \\;=\\; \\bar{z} + \\bar{w} \\qquad\\qquad \\overline{z \\cdot w} \\;=\\; \\bar{z} \\cdot \\bar{w}$$</div><div class="formula-sub">Conjugation distributes over sums and products. By induction, it also distributes over powers: $\\overline{z^n} = \\bar{z}^n$.</div></div>

<p class="l-text"><strong>Proof of the sum rule.</strong> Let $z = a + bi$ and $w = c + di$. Then $z + w = (a+c) + (b+d)i$, so</p>

<div class="calc-formula"><div class="formula-label">PROOF — SUM</div><div class="formula-main">$$\\overline{z + w} = (a+c) - (b+d)i = (a - bi) + (c - di) = \\bar{z} + \\bar{w}$$</div></div>

<p class="l-text"><strong>Proof of the product rule.</strong> Expand both sides. We have $\\overline{zw} = \\overline{(ac-bd) + (ad+bc)i} = (ac - bd) - (ad + bc)i$. On the other hand $\\bar{z} \\cdot \\bar{w} = (a-bi)(c-di) = ac - adi - bci + bd i^2 = (ac - bd) - (ad + bc)i$. The two match.</p>

<div class="calc-example"><div class="example-label">USE OF THE LINEARITY LAW</div><div class="example-body">Without expanding, find the conjugate of $z = (2 + 3i)(4 - i) + (1 - 2i)$.<br><br>Apply the rules: $\\overline{(2+3i)(4-i)} = (2 - 3i)(4 + i)$, and $\\overline{1 - 2i} = 1 + 2i$.<br><br>So $\\bar{z} = (2 - 3i)(4 + i) + (1 + 2i)$. We never had to compute $z$ itself — much faster than expanding.</div></div>

<h2 class="lesson-title">6. Division: the Conjugate Trick</h2>

<div class="calc-highlight"><strong>How do you divide $a + bi$ by $c + di$?</strong> You cannot just split it term by term, because the denominator has both a real and an imaginary part. The trick is to multiply numerator and denominator by $\\overline{c + di} = c - di$. The denominator then becomes the real number $c^2 + d^2$, and the fraction collapses to standard $a + bi$ form.</div>

<div class="calc-formula"><div class="formula-label">DIVISION FORMULA</div><div class="formula-main">$$\\frac{a + bi}{c + di} \\;=\\; \\frac{(a + bi)(c - di)}{(c + di)(c - di)} \\;=\\; \\frac{(ac + bd) + (bc - ad)\\,i}{c^2 + d^2}$$</div><div class="formula-sub">Multiply top and bottom by the conjugate of the denominator. The bottom becomes a sum of real squares — entirely real — and the top is a normal complex multiplication.</div></div>

<p class="l-text"><strong>Why does this work?</strong> Because of the identity $(c + di)(c - di) = c^2 + d^2$ from section 4. That identity is exactly the "rationalise the denominator" trick from lesson 14 ($\\sqrt{2}$ in denominators) lifted into the complex world: we kill the imaginary part of the denominator by multiplying by its conjugate.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7 — A FULL DIVISION STEP BY STEP</div><div class="example-body">Compute $\\dfrac{5 + 2i}{3 - i}$.<br><br><strong>Step 1.</strong> Identify the conjugate of the denominator: $\\overline{3 - i} = 3 + i$.<br><br><strong>Step 2.</strong> Multiply numerator and denominator by $3 + i$:<br>$\\dfrac{5 + 2i}{3 - i} = \\dfrac{(5 + 2i)(3 + i)}{(3 - i)(3 + i)}$.<br><br><strong>Step 3.</strong> Expand the denominator: $(3 - i)(3 + i) = 9 - i^2 = 9 + 1 = 10$.<br><br><strong>Step 4.</strong> Expand the numerator: $(5 + 2i)(3 + i) = 15 + 5i + 6i + 2i^2 = 15 + 11i - 2 = 13 + 11i$.<br><br><strong>Step 5.</strong> Divide each part: $\\dfrac{13 + 11i}{10} = \\mathbf{\\dfrac{13}{10} + \\dfrac{11}{10}i} = 1.3 + 1.1i$.<br><br>Verification: multiply the answer back by $3 - i$ and check it returns $5 + 2i$. $(1.3 + 1.1i)(3 - i) = 3.9 - 1.3i + 3.3i - 1.1 i^2 = 3.9 + 2i + 1.1 = 5 + 2i$. ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 8</div><div class="example-body">Compute $\\dfrac{1}{i}$.<br><br>Multiply top and bottom by $\\bar{i} = -i$: $\\dfrac{1}{i} \\cdot \\dfrac{-i}{-i} = \\dfrac{-i}{-i^2} = \\dfrac{-i}{1} = \\mathbf{-i}$.<br><br>So $\\dfrac{1}{i} = -i$ — a tiny surprise the first time you see it, but it falls right out of the rule. (Sanity check: $i \\cdot (-i) = -i^2 = 1$. ✓)</div></div>

<div class="l-note"><strong>Reciprocal formula.</strong> Setting the numerator to 1 in the division formula gives the reciprocal: $\\dfrac{1}{c + di} = \\dfrac{c - di}{c^2 + d^2}$. This is the explicit form of the multiplicative inverse, valid as long as $c$ and $d$ are not both zero.</div>

<h2 class="lesson-title">7. Squared Modulus as Distance</h2>

<div class="calc-highlight"><strong>The product $z\\bar{z}$ has a beautiful geometric reading: it is the <em>squared distance</em> from the point $z$ to the origin in the Argand plane.</strong> Lesson 70 will define the modulus $|z| = \\sqrt{z\\bar{z}}$ properly, but the identity $z\\bar{z} = a^2 + b^2$ is already nothing other than Pythagoras' theorem applied to the right triangle with legs $a$ and $b$.</div>

<div class="calc-graph"><div id="plot-l69-modulus-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the complex number $z = 3 + 4i$ as a point in the Argand plane, together with the right triangle whose horizontal leg is $a = 3$, whose vertical leg is $b = 4$, and whose hypotenuse is the segment from the origin to $z$. By Pythagoras, the squared hypotenuse is $9 + 16 = 25$, which is exactly $z\\bar{z}$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var hyp={x:[0,3],y:[0,4],mode:'lines+markers',name:'|z| = 5',line:{color:'#3b82f6',width:3.5},marker:{size:[6,11],color:'#3b82f6'}};
var legA={x:[0,3],y:[0,0],mode:'lines',name:'a = 3',line:{color:'#10b981',width:2.5}};
var legB={x:[3,3],y:[0,4],mode:'lines',name:'b = 4',line:{color:'#f59e0b',width:2.5}};
var rightAngle={x:[2.7,2.7,3],y:[0,0.3,0.3],mode:'lines',name:'',line:{color:'rgba(255,255,255,0.5)',width:1},showlegend:false};
var labs={x:[1.5,3.2,1.4],y:[-0.35,2,2.3],mode:'text',name:'',text:['a = 3','b = 4','|z|² = a²+b² = 25'],textfont:{color:['#10b981','#f59e0b','#3b82f6'],size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'Im',range:[-0.8,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l69-modulus-en',[legA,legB,rightAngle,hyp,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">This is the first hint that the algebra of complex numbers and the geometry of the plane are two views of the same object. Lesson 70 develops the geometric picture in full; lesson 71 will show that complex multiplication is rotation-plus-scaling. For now, just absorb the identity $z\\bar{z} = $ squared distance from origin.</p>

<h2 class="lesson-title">8. Geometric Interpretation of Operations</h2>

<div class="calc-highlight"><strong>Addition in $\\mathbb{C}$ is vector addition in $\\mathbb{R}^2$.</strong> Multiplication is more subtle — it combines rotation and scaling, as you saw in the section-2 plot of $(3+2i) + (1-4i)$ which closed a parallelogram exactly the way vectors in physics do.</div>

<p class="l-text">Let us make the connection precise. Identify each complex number $a + bi$ with the point $(a, b)$ in the plane. Then:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Addition</div><div class="card-body">$(a + bi) + (c + di) = (a + c) + (b + d)i$ matches $(a, b) + (c, d) = (a + c, b + d)$ — exactly the rule for vector addition. The parallelogram rule applies.</div></div>
<div class="calc-card"><div class="card-title">Negation</div><div class="card-body">$-z = -a - bi$ is the point reflected through the origin. So $z - w = z + (-w)$ is "go to $z$, then come back along $w$".</div></div>
<div class="calc-card"><div class="card-title">Conjugation</div><div class="card-body">$\\bar{z} = a - bi$ flips the y-coordinate — reflection across the real axis.</div></div>
<div class="calc-card"><div class="card-title">Multiplication (preview)</div><div class="card-body">$zw$ rotates the arrow for $z$ by the angle of $w$ and stretches it by $|w|$. We prove this in lesson 71.</div></div>
</div>

<p class="l-text">The dictionary is so clean that physicists and engineers routinely <em>identify</em> $\\mathbb{C}$ with the plane $\\mathbb{R}^2$ when they need to encode anything two-dimensional: alternating currents, signal phases, fluid flow, quantum states. Every formula in this lesson then has a geometric translation, and every geometric statement about the plane has an algebraic complex-number version.</p>

<h2 class="lesson-title">9. Solving Equations with $z$ and $\\bar{z}$</h2>

<div class="calc-highlight"><strong>A complex-number equation is really two real equations packed into one.</strong> Whenever you see an unknown $z$, write $z = a + bi$, expand both sides, and then match the real and the imaginary parts. Two unknowns, two equations — back to ordinary high-school algebra.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 9</div><div class="example-body">Solve $\\;2z + 3\\bar{z} \\;=\\; 5 - i\\;$ for $z = a + bi$.<br><br><strong>Step 1.</strong> Write $z = a + bi$, so $\\bar{z} = a - bi$.<br><br><strong>Step 2.</strong> Substitute and expand:<br>$2(a + bi) + 3(a - bi) = (2a + 3a) + (2b - 3b)i = 5a - bi$.<br><br><strong>Step 3.</strong> Set equal to $5 - i$: $\\;5a - bi = 5 - i$.<br><br><strong>Step 4.</strong> Match real and imaginary parts:<br>$5a = 5 \\Rightarrow a = 1$.<br>$-b = -1 \\Rightarrow b = 1$.<br><br><strong>Answer:</strong> $\\mathbf{z = 1 + i}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 10</div><div class="example-body">Find all $z$ with $z + \\bar{z} = 4$ and $z - \\bar{z} = 6i$.<br><br>From the first identity ($z + \\bar{z} = 2\\,\\mathrm{Re}(z)$): $2a = 4 \\Rightarrow a = 2$.<br>From the second identity ($z - \\bar{z} = 2i\\,\\mathrm{Im}(z)$): $2bi = 6i \\Rightarrow b = 3$.<br><br><strong>Answer:</strong> $\\mathbf{z = 2 + 3i}$.</div></div>

<h2 class="lesson-title">10. Common Errors and How to Avoid Them</h2>

<p class="l-text">Three mistakes account for most of the wrong answers students hand in on this material. Read them, recognise them, refuse to make them.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ERROR — $i^2 = +1$</div><div class="compare-item">Students sometimes "remember" that $i = \\sqrt{-1}$ and conclude $i^2 = +1$ by analogy with $\\sqrt{4}^2 = 4$.</div><div class="compare-item">The square of $\\sqrt{-1}$ is $-1$ by <em>definition</em> — that is the whole reason we introduced $i$. A sign flip ruins every multiplication and every division.</div><div class="compare-item">Fix: write "$i^2 = -1$" on every scratch sheet and circle it before starting.</div></div><div class="compare-col"><div class="compare-title">CORRECT — $i^2 = -1$</div><div class="compare-item">Every $i^2$ in any expansion is replaced by $-1$.</div><div class="compare-item">Then $-bd \\cdot i^2 = -bd \\cdot (-1) = +bd$, which is exactly the formula in section 3.</div><div class="compare-item">If you ever get $i^2 = +1$ in a derivation, stop and find your sign error.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ERROR — wrong sign in conjugate</div><div class="compare-item">Writing $\\overline{a + bi} = -a + bi$ (flipping the wrong part).</div><div class="compare-item">The conjugate flips the sign of $b$, not $a$. The <em>real</em> part stays, the <em>imaginary</em> part changes sign.</div><div class="compare-item">Fix: remember the geometric picture — the conjugate reflects $z$ across the real axis, so $a$ (which lives on the real axis) is unchanged.</div></div><div class="compare-col"><div class="compare-title">CORRECT — flip only the imaginary part</div><div class="compare-item">$\\overline{a + bi} = a - bi$.</div><div class="compare-item">Then $z + \\bar{z} = 2a$ is real (good — the imaginary parts cancelled).</div><div class="compare-item">And $z \\bar{z} = a^2 + b^2$ is real and non-negative (good — sum of two squares).</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ERROR — only multiplying the numerator</div><div class="compare-item">In division: students multiply only the top by the conjugate, then "simplify" the bottom by hand and forget that the bottom is changed too.</div><div class="compare-item">Result: the answer comes out a complex number divided by another complex number, which is exactly the form we were trying to escape.</div><div class="compare-item">Fix: rewrite the fraction as $\\dfrac{\\text{top} \\cdot \\bar{\\text{bot}}}{\\text{bot} \\cdot \\bar{\\text{bot}}}$ in one breath and only then expand.</div></div><div class="compare-col"><div class="compare-title">CORRECT — multiply BOTH ends</div><div class="compare-item">Apply the conjugate factor to numerator <em>and</em> denominator together.</div><div class="compare-item">The denominator becomes $c^2 + d^2$ — a positive real number.</div><div class="compare-item">Only then expand the numerator and divide each part by that real number.</div></div></div>

<h2 class="lesson-title">11. Worked Problems</h2>

<p class="l-text">A short set of practice problems pulling together everything in the lesson. Try each one yourself first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — ADDITION</div><div class="example-body"><strong>Compute $(7 - 5i) + (-2 + 3i)$.</strong><br><br>Real: $7 + (-2) = 5$.  Imaginary: $-5 + 3 = -2$.<br><br>Answer: $\\mathbf{5 - 2i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — SUBTRACTION</div><div class="example-body"><strong>Compute $(4 + 6i) - (1 - 2i)$.</strong><br><br>Real: $4 - 1 = 3$.  Imaginary: $6 - (-2) = 8$.<br><br>Answer: $\\mathbf{3 + 8i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — MULTIPLICATION</div><div class="example-body"><strong>Compute $(3 - 2i)(2 + 5i)$.</strong><br><br>Distribute: $6 + 15i - 4i - 10 i^2 = 6 + 11i + 10 = \\mathbf{16 + 11i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — CONJUGATE PRODUCT</div><div class="example-body"><strong>If $z = 2 - 7i$, compute $z\\bar{z}$.</strong><br><br>By the identity $z\\bar{z} = a^2 + b^2$ with $a = 2$, $b = -7$:<br>$z\\bar{z} = 4 + 49 = \\mathbf{53}$.<br><br>(Direct check: $(2 - 7i)(2 + 7i) = 4 + 14i - 14i - 49 i^2 = 4 + 49 = 53$. ✓)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — DIVISION</div><div class="example-body"><strong>Compute $\\dfrac{4 + 3i}{2 - i}$.</strong><br><br>Multiply top and bottom by $\\overline{2 - i} = 2 + i$:<br><br>Denominator: $(2 - i)(2 + i) = 4 + 1 = 5$.<br><br>Numerator: $(4 + 3i)(2 + i) = 8 + 4i + 6i + 3i^2 = 8 + 10i - 3 = 5 + 10i$.<br><br>So $\\dfrac{4 + 3i}{2 - i} = \\dfrac{5 + 10i}{5} = \\mathbf{1 + 2i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — POWERS OF $i$</div><div class="example-body"><strong>Compute $i^{27}$.</strong><br><br>Powers of $i$ cycle with period 4: $i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$.<br><br>Take $27 \\bmod 4 = 3$, so $i^{27} = i^3 = \\mathbf{-i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — SOLVE FOR $z$</div><div class="example-body"><strong>Solve $z + 2\\bar{z} = 9 + i$.</strong><br><br>Let $z = a + bi$, so $\\bar{z} = a - bi$.<br>$z + 2\\bar{z} = (a + bi) + 2(a - bi) = 3a - bi$.<br><br>Setting equal to $9 + i$: $3a = 9$ gives $a = 3$, and $-b = 1$ gives $b = -1$.<br><br>Answer: $\\mathbf{z = 3 - i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — RATIONALISE</div><div class="example-body"><strong>Write $\\dfrac{1 + i}{1 - i}$ in $a + bi$ form.</strong><br><br>Multiply top and bottom by $1 + i$:<br><br>Denominator: $(1 - i)(1 + i) = 1 + 1 = 2$.<br><br>Numerator: $(1 + i)(1 + i) = 1 + 2i + i^2 = 2i$.<br><br>So $\\dfrac{1 + i}{1 - i} = \\dfrac{2i}{2} = \\mathbf{i}$.<br><br>(A pretty surprise: the ratio of two specific complex numbers is purely imaginary.)</div></div>

<div class="l-note"><strong>Looking ahead.</strong> In lesson 70 we introduce the <em>modulus</em> $|z| = \\sqrt{z\\bar{z}}$ and the <em>argument</em> $\\arg(z)$, which together specify a complex number geometrically by its distance from the origin and the angle it makes with the positive real axis. That picture turns the algebraic operations of this lesson into beautiful geometric statements — multiplication becomes rotation-and-scaling, and the polar form $z = r\\,(\\cos\\theta + i\\sin\\theta)$ unlocks de Moivre's theorem and complex roots.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Addition and subtraction are component-wise: $(a+bi) \\pm (c+di) = (a \\pm c) + (b \\pm d)i$</li>
<li>Multiplication: distribute, then replace $i^2$ with $-1$; result is $(ac - bd) + (ad + bc)i$</li>
<li>Conjugate $\\bar{z} = a - bi$ flips the imaginary part; geometrically a reflection across the real axis</li>
<li>Key identities: $z + \\bar{z} = 2\\,\\mathrm{Re}(z)$, $z - \\bar{z} = 2i\\,\\mathrm{Im}(z)$, $z\\bar{z} = a^2 + b^2$</li>
<li>Conjugation is linear and multiplicative: $\\overline{z+w} = \\bar{z} + \\bar{w}$, $\\overline{zw} = \\bar{z}\\cdot\\bar{w}$</li>
<li>Division: multiply numerator and denominator by the conjugate of the denominator</li>
<li>Geometrically: addition = vector addition; conjugation = reflection across the real axis; $z\\bar{z}$ = squared distance from origin</li>
<li>To solve equations in $z$ and $\\bar{z}$: write $z = a + bi$ and match real and imaginary parts</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Gerçek sayıları toplamayı, çarpmayı ve bölmeyi zaten biliyorsun.</strong> Bir karmaşık sayı $z = a + bi$, sıralı bir gerçek sayı çifti — <em>gerçek kısım</em> $a$ ve <em>sanal kısım</em> $b$ — $i$ sembolüyle birleştirilmiş halidir; $i$ ise $-1$'in kareköküdür. Bu derste, böyle iki çifti toplamanın, çıkarmanın, çarpmanın ve bölmenin ne demek olduğunu öğreniyoruz. Ayrıca $\\mathbb{R}$'de karşılığı olmayan yepyeni bir işlemle tanışıyoruz: <strong>eşlenik</strong>. Eşlenik, bölmeyi mümkün kılan sırdır ve 70. derste göreceğin geometrik resmin cebire açılan köprüsüdür.</p>

<p class="l-text">Bu dersteki her şey tek bir kuraldan çıkar: <strong>$i$'yi sıradan bir değişken gibi ele al, ama $i^2$ gördüğün anda onu $-1$ ile değiştir.</strong> Bu tek kuralı aklında tutarsan, gerisi mekaniktir — tıpkı 30. derste polinomları çarpmak gibi. Dersin sonunda karmaşık sayılar üzerinde her aritmetik işlemi akıcı yapabilecek, eşleniği bakar bakmaz tanıyacak ve garip görünen bir kesri temiz bir $a + bi$ formuna sokmak için onu kullanabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Karmaşık sayıları, düzlemdeki vektörler gibi, bileşen bileşen toplamayı ve çıkarmayı</li>
<li>Dikkatli dağıtarak ve $i^2 = -1$ kullanarak karmaşık sayıları çarpmayı</li>
<li>Eşlenik $\\bar{z} = a - bi$ tanımını ve $z + \\bar{z} = 2\\,\\mathrm{Re}(z)$, $z - \\bar{z} = 2i\\,\\mathrm{Im}(z)$, $z\\bar{z} = a^2 + b^2$ özdeşliklerini kanıtlamayı</li>
<li>$\\overline{z+w} = \\bar{z} + \\bar{w}$ ve $\\overline{zw} = \\bar{z}\\cdot\\bar{w}$ doğrusallık kurallarını yeniden türetmeden kullanmayı</li>
<li>Bir karmaşık sayıyı diğerine, pay ve paydayı paydanın eşleniğiyle çarparak bölmeyi</li>
<li>$z$ ve $\\bar{z}$ içeren basit doğrusal denklemleri $z = a + bi$ yazıp gerçek ve sanal kısımları eşleyerek çözmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Temel Kural: $i^2 = -1$</h2>

<div class="calc-highlight"><strong>Tek sembol, tek kural.</strong> Karmaşık sayı $z = a + bi$ biçiminde yazılır; burada $a, b \\in \\mathbb{R}$ ve $i$, $i^2 = -1$ koşulunu sağlayan yepyeni bir semboldür. Bu derste göreceğin her formül, polinom cebrine artı bu tek yer değiştirme demektir.</div>

<p class="l-text">68. derste $i$ sembolünü, $x^2 + 1 = 0$ denkleminin — gerçek çözümü olmayan bir denklemin — bir çözümü olarak tanıttık. Böyle bir sayının var olduğunu kabul ettikten sonra, $3 + 2i$, $-4i$, $\\pi - i$ gibi ifadeler yazıp bunlarla nasıl aritmetik yapacağımızı sorabiliriz. Cevap şudur: $i$'yi bir polinomdaki $x$ değişkenine davrandığın gibi davran, tek koşul şu olsun: $i^2$ ifadesi ne zaman ortaya çıkarsa, onu hemen $-1$ ile değiştir ve sadeleştir.</p>

<div class="calc-formula"><div class="formula-label">TEMEL KURAL</div><div class="formula-main">$$i^2 \\;=\\; -1 \\qquad\\Longleftrightarrow\\qquad i \\;=\\; \\sqrt{-1}$$</div><div class="formula-sub">Aşağıdaki her şey bundan çıkar. Şimdi ezberle, ders boyunca tereddütsüz kullan.</div></div>

<p class="l-text">Not etmeye değer bir sonuç: $i$'nin kuvvetleri dört adımda bir döngüye girer. $i^1 = i$, $i^2 = -1$, $i^3 = i^2 \\cdot i = -i$, $i^4 = i^2 \\cdot i^2 = 1$ ve $i^5 = i$ ile tekrar başa dönüyoruz. 3. bölümde $i^2 = -1$'i sürekli kullanacağız.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gerçek kısım</div><div class="card-body">$\\mathrm{Re}(z) = a$. $i$ olmaksızın oturan katsayı.</div></div>
<div class="calc-card"><div class="card-title">Sanal kısım</div><div class="card-body">$\\mathrm{Im}(z) = b$. $i$'nin katsayısı — dikkat: bu $bi$ değil, <em>gerçek bir sayıdır</em>.</div></div>
<div class="calc-card"><div class="card-title">Eşitlik</div><div class="card-body">$a + bi = c + di$ olması için $a = c$ ve $b = d$ gerekir. İki karmaşık sayı, tam olarak her iki kısımları eşit olduğunda eşittir.</div></div>
</div>

<h2 class="lesson-title">2. Toplama ve Çıkarma</h2>

<div class="calc-highlight"><strong>Toplama bileşen bileşendir.</strong> Gerçek kısımları topla, sanal kısımları topla, sonucu tek bir karmaşık sayı olarak yaz. Çıkarma da aynı, sadece eksi işaretiyle. Bu, düzlemde vektör toplama kuralının ta kendisidir — 8. bölümde göreceğin gibi bu tesadüf değildir.</div>

<div class="calc-formula"><div class="formula-label">TOPLAMA</div><div class="formula-main">$$(a + bi) + (c + di) \\;=\\; (a + c) + (b + d)\\,i$$</div><div class="formula-sub">Gerçek kısımlar gerçek kısımlarla, sanal kısımlar sanal kısımlarla toplanır. Asla karıştırma.</div></div>

<div class="calc-formula"><div class="formula-label">ÇIKARMA</div><div class="formula-main">$$(a + bi) - (c + di) \\;=\\; (a - c) + (b - d)\\,i$$</div><div class="formula-sub">Aynı kural, sadece eksi işaretleriyle. $(-c) + (-d)i$ ekliyormuş gibi düşün.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$(3 + 2i) + (1 - 4i)$ değerini hesapla.<br><br>Gerçek kısımlar: $3 + 1 = 4$.<br>Sanal kısımlar: $2 + (-4) = -2$.<br><br>Cevap: $\\mathbf{4 - 2i}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$(5 - 3i) - (2 + 7i)$ değerini hesapla.<br><br>Gerçek kısımlar: $5 - 2 = 3$.<br>Sanal kısımlar: $-3 - 7 = -10$.<br><br>Cevap: $\\mathbf{3 - 10i}$.</div></div>

<div class="calc-graph"><div id="plot-l69-add-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $(3 + 2i) + (1 - 4i) = 4 - 2i$ toplamı, Argand düzleminde bir vektör toplamı olarak. Mavi ok $z_1 = 3 + 2i$, yeşil ok $z_2 = 1 - 4i$, turuncu ok ise toplamlarıdır. Paralelkenar kuralına dikkat — fizikteki kuvvet vektörlerini toplamayla bire bir aynı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var z1T={x:[0,3],y:[0,2],mode:'lines+markers',name:'z₁ = 3+2i',line:{color:'#3b82f6',width:3},marker:{size:[6,10],color:'#3b82f6'}};
var z2T={x:[0,1],y:[0,-4],mode:'lines+markers',name:'z₂ = 1−4i',line:{color:'#10b981',width:3},marker:{size:[6,10],color:'#10b981'}};
var zsumT={x:[0,4],y:[0,-2],mode:'lines+markers',name:'z₁+z₂ = 4−2i',line:{color:'#f59e0b',width:3.5},marker:{size:[6,12],color:'#f59e0b'}};
var dash1T={x:[3,4],y:[2,-2],mode:'lines',name:'',line:{color:'rgba(16,185,129,0.5)',width:1.5,dash:'dot'},showlegend:false};
var dash2T={x:[1,4],y:[-4,-2],mode:'lines',name:'',line:{color:'rgba(59,130,246,0.5)',width:1.5,dash:'dot'},showlegend:false};
var labelsT={x:[3,1,4],y:[2.2,-4.3,-2.3],mode:'text',name:'',text:['z₁','z₂','z₁+z₂'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'Im',range:[-5,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l69-add-tr',[z1T,z2T,dash1T,dash2T,zsumT,labelsT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Cebirsel özellikler.</strong> Karmaşık sayıların toplaması değişmeli ($z + w = w + z$), birleşmeli ($(z + w) + u = z + (w + u)$), birim eleman $0 = 0 + 0i$ vardır ve her $z$'nin toplamaya göre tersi $-z = -a - bi$ mevcuttur. Kısacası: toplama altında $\\mathbb{C}$, vektör toplaması altındaki $\\mathbb{R}^2$ ile tam olarak aynı davranır.</div>

<h2 class="lesson-title">3. Çarpma</h2>

<div class="calc-highlight"><strong>Çarpma; dağıtma artı $i^2 = -1$ yer değiştirmesidir.</strong> $(a + bi)(c + di)$ ifadesini tıpkı $(a + bx)(c + dx)$ gibi terim terim çarp, sonra ortaya çıkan $i^2$'leri $-1$ ile değiştir.</div>

<p class="l-text">Sonucun apaçık görünmesi için formülü bir kez yavaşça türetelim. İki karmaşık sayı al, $z = a + bi$ ve $w = c + di$, çarp:</p>

<div class="calc-formula"><div class="formula-label">ÇARPMA — TÜRETME</div><div class="formula-main">$$\\begin{aligned}(a + bi)(c + di) &= ac + adi + bci + bd\\,i^2 \\\\ &= ac + adi + bci - bd \\\\ &= (ac - bd) + (ad + bc)\\,i\\end{aligned}$$</div><div class="formula-sub">Adım 1: dağıtarak aç. Adım 2: $i^2$ yerine $-1$ koy. Adım 3: gerçek ve sanal kısımları topla.</div></div>

<div class="calc-formula"><div class="formula-label">ÇARPMA — SONUÇ</div><div class="formula-main">$$(a + bi)(c + di) \\;=\\; (ac - bd) + (ad + bc)\\,i$$</div><div class="formula-sub">Formülü ezberleyebilirsin ya da — daha iyisi — her seferinde dağıtarak yeniden türet. İkincisi daha sağlamdır; çünkü kural $i$'nin daha yüksek kuvvetlerine de aynı biçimde uygulanır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">$(2 + 3i)(1 - i)$ değerini hesapla.<br><br>Dağıtarak: $2 \\cdot 1 + 2 \\cdot (-i) + 3i \\cdot 1 + 3i \\cdot (-i)$<br>$\\quad = 2 - 2i + 3i - 3i^2$<br>$\\quad = 2 - 2i + 3i + 3$ (çünkü $-3i^2 = -3(-1) = +3$)<br>$\\quad = (2 + 3) + (-2 + 3)i$<br>$\\quad = \\mathbf{5 + i}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4</div><div class="example-body">$(4 - 2i)(3 + 5i)$ değerini hesapla.<br><br>Dağıtarak: $12 + 20i - 6i - 10i^2 = 12 + 20i - 6i + 10 = (12 + 10) + (20 - 6)i = \\mathbf{22 + 14i}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 5 — ÖZEL BİR DURUM</div><div class="example-body">$(1 + i)^2$ değerini hesapla.<br><br>$(1 + i)^2 = 1 + 2i + i^2 = 1 + 2i - 1 = \\mathbf{2i}$.<br><br>Gerçek kısımların tam olarak nasıl götürdüğüne dikkat. Bu, kullanışlı bir kısayoldur: $(1+i)^2 = 2i$, dolayısıyla $(1+i)^4 = (2i)^2 = -4$.</div></div>

<div class="l-note"><strong>Çarpmanın cebirsel özellikleri.</strong> Karmaşık çarpma değişmeli, birleşmeli, toplama üzerinde dağılır, birim eleman $1 = 1 + 0i$'dir ve (6. bölümde göreceğimiz gibi) sıfırdan farklı her $z$ için çarpmaya göre ters mevcuttur. Yani $\\mathbb{C}$, $\\mathbb{R}$ ile aynı zengin cebirsel yapıya sahip bir <em>cisimdir</em> — sadece daha büyüktür.</div>

<h2 class="lesson-title">4. Eşlenik</h2>

<div class="calc-highlight"><strong>$z = a + bi$ sayısının eşleniği $\\bar{z} = a - bi$'dir.</strong> Sanal kısmın işaretini ters çevirir, gerçek kısma dokunmazsın. Geometrik olarak (70. derste çizilecek), eşlenik, $z$'nin gerçek eksene göre ayna görüntüsüdür.</div>

<div class="calc-formula"><div class="formula-label">EŞLENİĞİN TANIMI</div><div class="formula-main">$$z = a + bi \\quad\\Longrightarrow\\quad \\bar{z} = a - bi$$</div><div class="formula-sub">Aynı gerçek kısım, ters işaretli sanal kısım. Bazı ders kitapları $\\bar{z}$ yerine $z^{*}$ yazar; her ikisi aynı anlama gelir.</div></div>

<p class="l-text">Tanımdan hemen üç özdeşlik çıkar. Kısalar, kullanışlılar, ezberlenmeye değerler:</p>

<div class="calc-formula"><div class="formula-label">ÜÇ TEMEL ÖZDEŞLİK</div><div class="formula-main">$$z + \\bar{z} \\;=\\; 2\\,\\mathrm{Re}(z) \\qquad z - \\bar{z} \\;=\\; 2i\\,\\mathrm{Im}(z) \\qquad z\\bar{z} \\;=\\; a^2 + b^2$$</div><div class="formula-sub">İlk ikisi gerçek ve sanal kısımları çekip alır; üçüncüsü negatif olmayan bir gerçek sayı üretir.</div></div>

<p class="l-text"><strong>$z\\bar{z}$ neden $\\mathbb{R}$'ye düşer?</strong> Çarpma kuralını uygulayarak doğrulayalım. Eğer $z = a + bi$ ise, $\\bar{z} = a - bi$ olur ve</p>

<div class="calc-formula"><div class="formula-label">$z\\bar{z} = a^2 + b^2$ KANITI</div><div class="formula-main">$$z\\bar{z} \\;=\\; (a + bi)(a - bi) \\;=\\; a^2 - (bi)^2 \\;=\\; a^2 - b^2 i^2 \\;=\\; a^2 + b^2$$</div><div class="formula-sub">Karelerin farkı! Karşılıklı terimler $-abi + abi$ götürür, $i^2$ bir işareti çevirir ve elimizde gerçek karelerin toplamı kalır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$z + \\bar{z}$</div><div class="card-body">$(a+bi) + (a-bi) = 2a = 2\\,\\mathrm{Re}(z)$. Gerçek kısmın iki katı, sanal bileşen yok.</div></div>
<div class="calc-card"><div class="card-title">$z - \\bar{z}$</div><div class="card-body">$(a+bi) - (a-bi) = 2bi = 2i\\,\\mathrm{Im}(z)$. Sanal kısmın iki katı çarpı $i$, gerçek bileşen yok.</div></div>
<div class="calc-card"><div class="card-title">$z\\bar{z}$</div><div class="card-body">$a^2 + b^2 \\geq 0$. Gerçek, negatif olmayan bir sayı. Bu, modülün karesi $|z|^2$'dir — 70. derse bak.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 6</div><div class="example-body">$z = 3 + 4i$ olsun. $\\bar{z}$, $z + \\bar{z}$, $z - \\bar{z}$ ve $z\\bar{z}$ değerlerini hesapla.<br><br>$\\bar{z} = 3 - 4i$.<br>$z + \\bar{z} = (3+4i) + (3-4i) = 6 = 2 \\cdot 3 = 2\\,\\mathrm{Re}(z)$. ✓<br>$z - \\bar{z} = (3+4i) - (3-4i) = 8i = 2i \\cdot 4 = 2i\\,\\mathrm{Im}(z)$. ✓<br>$z\\bar{z} = (3+4i)(3-4i) = 9 - 16 i^2 = 9 + 16 = \\mathbf{25} = 3^2 + 4^2$. ✓<br><br>$z\\bar{z} = 25$'in $a^2 + b^2 = 9 + 16$ ile eşleştiğine dikkat. 70. derste $\\sqrt{25} = 5$'in $z$'nin <em>modülü</em> olduğunu tanıyacaksın.</div></div>

<div class="calc-graph"><div id="plot-l69-conj-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $z = 3 + 4i$ noktası ve eşleniği $\\bar{z} = 3 - 4i$ Argand düzleminde. Bunlar gerçek eksen (yatay çizgi) etrafında ayna konumlarındadır. Kesikli çizgi yansıma eksenini işaretler — eşlenik işlemi geometrik olarak bir yansımadır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var zArrT={x:[0,3],y:[0,4],mode:'lines+markers',name:'z = 3+4i',line:{color:'#3b82f6',width:3},marker:{size:[6,11],color:'#3b82f6'}};
var zbarArrT={x:[0,3],y:[0,-4],mode:'lines+markers',name:'z̄ = 3−4i',line:{color:'#ef4444',width:3},marker:{size:[6,11],color:'#ef4444'}};
var mirrorT={x:[3,3],y:[4,-4],mode:'lines',name:'yansıma',line:{color:'rgba(245,158,11,0.7)',width:1.5,dash:'dot'}};
var realAxT={x:[-1,5],y:[0,0],mode:'lines',name:'gerçek eksen',line:{color:'rgba(255,255,255,0.4)',width:1.5}};
var pointLabelsT={x:[3.3,3.3],y:[4,-4],mode:'text',name:'',text:['z','z̄'],textfont:{color:'#e8e8e8',size:14},showlegend:false};
var layCT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'Im',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l69-conj-tr',[realAxT,zArrT,zbarArrT,mirrorT,pointLabelsT],layCT,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Toplamın ve Çarpımın Eşleniği</h2>

<div class="calc-highlight"><strong>Eşlenik doğrusal bir işlemdir — ve doğrusaldan da fazlası, çarpmayla da değişir.</strong> İki kural her şeyi kapsar: $\\overline{z + w} = \\bar{z} + \\bar{w}$ ve $\\overline{zw} = \\bar{z}\\cdot\\bar{w}$. Bunlara sahip olduğun anda, bir eşleniği kaba kuvvetle açmak neredeyse hiç gerekmez.</div>

<div class="calc-formula"><div class="formula-label">EŞLENİĞİN DOĞRUSALLIĞI VE ÇARPILABİLİRLİĞİ</div><div class="formula-main">$$\\overline{z + w} \\;=\\; \\bar{z} + \\bar{w} \\qquad\\qquad \\overline{z \\cdot w} \\;=\\; \\bar{z} \\cdot \\bar{w}$$</div><div class="formula-sub">Eşlenik, toplam ve çarpım üzerinde dağılır. Tümevarımla, kuvvetler üzerinde de dağılır: $\\overline{z^n} = \\bar{z}^n$.</div></div>

<p class="l-text"><strong>Toplam kuralının kanıtı.</strong> $z = a + bi$ ve $w = c + di$ olsun. O zaman $z + w = (a+c) + (b+d)i$, dolayısıyla</p>

<div class="calc-formula"><div class="formula-label">KANIT — TOPLAM</div><div class="formula-main">$$\\overline{z + w} = (a+c) - (b+d)i = (a - bi) + (c - di) = \\bar{z} + \\bar{w}$$</div></div>

<p class="l-text"><strong>Çarpım kuralının kanıtı.</strong> Her iki tarafı aç. $\\overline{zw} = \\overline{(ac-bd) + (ad+bc)i} = (ac - bd) - (ad + bc)i$. Öte yandan $\\bar{z} \\cdot \\bar{w} = (a-bi)(c-di) = ac - adi - bci + bd i^2 = (ac - bd) - (ad + bc)i$. İkisi eşleşir.</p>

<div class="calc-example"><div class="example-label">DOĞRUSALLIK KURALINI KULLANMA</div><div class="example-body">Açmadan, $z = (2 + 3i)(4 - i) + (1 - 2i)$ değerinin eşleniğini bul.<br><br>Kuralları uygula: $\\overline{(2+3i)(4-i)} = (2 - 3i)(4 + i)$ ve $\\overline{1 - 2i} = 1 + 2i$.<br><br>Yani $\\bar{z} = (2 - 3i)(4 + i) + (1 + 2i)$. $z$'nin kendisini hesaplamak zorunda kalmadık — açmaktan çok daha hızlı.</div></div>

<h2 class="lesson-title">6. Bölme: Eşlenik Hilesi</h2>

<div class="calc-highlight"><strong>$a + bi$ sayısını $c + di$'ye nasıl bölersin?</strong> Terim terim ayıramazsın, çünkü payda hem gerçek hem de sanal kısma sahiptir. Hile, pay ve paydayı $\\overline{c + di} = c - di$ ile çarpmaktır. Payda o zaman $c^2 + d^2$ gerçek sayısına dönüşür ve kesir standart $a + bi$ formuna çöker.</div>

<div class="calc-formula"><div class="formula-label">BÖLME FORMÜLÜ</div><div class="formula-main">$$\\frac{a + bi}{c + di} \\;=\\; \\frac{(a + bi)(c - di)}{(c + di)(c - di)} \\;=\\; \\frac{(ac + bd) + (bc - ad)\\,i}{c^2 + d^2}$$</div><div class="formula-sub">Pay ve paydayı paydanın eşleniğiyle çarp. Payda gerçek karelerin toplamı olur — tamamen gerçek — ve pay sıradan bir karmaşık çarpımdır.</div></div>

<p class="l-text"><strong>Neden işe yarıyor?</strong> Çünkü 4. bölümdeki $(c + di)(c - di) = c^2 + d^2$ özdeşliği. Bu özdeşlik, 14. dersteki "paydayı rasyonelleştir" hilesinin (paydalardaki $\\sqrt{2}$) karmaşık dünyaya yükseltilmiş halinden başka bir şey değil: paydayı, eşleniğiyle çarparak sanal kısmı öldürürüz.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 7 — ADIM ADIM TAM BİR BÖLME</div><div class="example-body">$\\dfrac{5 + 2i}{3 - i}$ değerini hesapla.<br><br><strong>Adım 1.</strong> Paydanın eşleniğini belirle: $\\overline{3 - i} = 3 + i$.<br><br><strong>Adım 2.</strong> Pay ve paydayı $3 + i$ ile çarp:<br>$\\dfrac{5 + 2i}{3 - i} = \\dfrac{(5 + 2i)(3 + i)}{(3 - i)(3 + i)}$.<br><br><strong>Adım 3.</strong> Paydayı aç: $(3 - i)(3 + i) = 9 - i^2 = 9 + 1 = 10$.<br><br><strong>Adım 4.</strong> Payı aç: $(5 + 2i)(3 + i) = 15 + 5i + 6i + 2i^2 = 15 + 11i - 2 = 13 + 11i$.<br><br><strong>Adım 5.</strong> Her parçayı böl: $\\dfrac{13 + 11i}{10} = \\mathbf{\\dfrac{13}{10} + \\dfrac{11}{10}i} = 1.3 + 1.1i$.<br><br>Doğrulama: cevabı $3 - i$ ile geri çarp, $5 + 2i$'yi vermesi gerek. $(1.3 + 1.1i)(3 - i) = 3.9 - 1.3i + 3.3i - 1.1 i^2 = 3.9 + 2i + 1.1 = 5 + 2i$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 8</div><div class="example-body">$\\dfrac{1}{i}$ değerini hesapla.<br><br>Pay ve paydayı $\\bar{i} = -i$ ile çarp: $\\dfrac{1}{i} \\cdot \\dfrac{-i}{-i} = \\dfrac{-i}{-i^2} = \\dfrac{-i}{1} = \\mathbf{-i}$.<br><br>Yani $\\dfrac{1}{i} = -i$ — ilk gördüğünde küçük bir sürpriz, ama kuralın doğrudan bir sonucu. (Akıl kontrolü: $i \\cdot (-i) = -i^2 = 1$. ✓)</div></div>

<div class="l-note"><strong>Ters çevirme formülü.</strong> Bölme formülünde payı 1'e ayarladığında çarpmaya göre ters bulunur: $\\dfrac{1}{c + di} = \\dfrac{c - di}{c^2 + d^2}$. $c$ ve $d$ aynı anda sıfır olmadıkça, bu açık çarpmaya göre tersin formülüdür.</div>

<h2 class="lesson-title">7. Modülün Karesi Uzaklık Olarak</h2>

<div class="calc-highlight"><strong>$z\\bar{z}$ çarpımının güzel bir geometrik okuması vardır: Argand düzleminde $z$ noktasının başlangıca olan <em>karesel uzaklığıdır</em>.</strong> 70. ders modülü $|z| = \\sqrt{z\\bar{z}}$ olarak doğru biçimde tanımlayacak, ama $z\\bar{z} = a^2 + b^2$ özdeşliği zaten dik kenarları $a$ ve $b$ olan dik üçgene uygulanan Pisagor teoreminden başka bir şey değildir.</div>

<div class="calc-graph"><div id="plot-l69-modulus-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $z = 3 + 4i$ karmaşık sayısı, Argand düzleminde bir nokta olarak; ve yatay dik kenarı $a = 3$, dikey dik kenarı $b = 4$ olan, hipotenüsü ise başlangıçtan $z$'ye giden parça olan dik üçgen. Pisagor'a göre hipotenüsün karesi $9 + 16 = 25$'tir; bu da tam olarak $z\\bar{z}$'dir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var hypT={x:[0,3],y:[0,4],mode:'lines+markers',name:'|z| = 5',line:{color:'#3b82f6',width:3.5},marker:{size:[6,11],color:'#3b82f6'}};
var legAT={x:[0,3],y:[0,0],mode:'lines',name:'a = 3',line:{color:'#10b981',width:2.5}};
var legBT={x:[3,3],y:[0,4],mode:'lines',name:'b = 4',line:{color:'#f59e0b',width:2.5}};
var rightAngleT={x:[2.7,2.7,3],y:[0,0.3,0.3],mode:'lines',name:'',line:{color:'rgba(255,255,255,0.5)',width:1},showlegend:false};
var labsT={x:[1.5,3.2,1.4],y:[-0.35,2,2.3],mode:'text',name:'',text:['a = 3','b = 4','|z|² = a²+b² = 25'],textfont:{color:['#10b981','#f59e0b','#3b82f6'],size:13},showlegend:false};
var layMT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-0.5,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'Im',range:[-0.8,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l69-modulus-tr',[legAT,legBT,rightAngleT,hypT,labsT],layMT,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Bu, karmaşık sayıların cebrinin ve düzlemin geometrisinin aynı nesnenin iki farklı bakışı olduğunun ilk ipucudur. 70. ders geometrik resmi tam olarak geliştirir; 71. ders karmaşık çarpmanın döndürme-ve-ölçekleme olduğunu gösterecek. Şimdilik, $z\\bar{z} = $ başlangıca olan karesel uzaklık özdeşliğini kavra yeter.</p>

<h2 class="lesson-title">8. İşlemlerin Geometrik Yorumu</h2>

<div class="calc-highlight"><strong>$\\mathbb{C}$'de toplama, $\\mathbb{R}^2$'de vektör toplamadır.</strong> Çarpma daha incedir — döndürme ve ölçeklemeyi birleştirir, bunu 2. bölümdeki $(3+2i) + (1-4i)$ grafiğinde gördün; tıpkı fizikteki vektörler gibi bir paralelkenarı kapatıyordu.</div>

<p class="l-text">Bağlantıyı kesinleştirelim. Her $a + bi$ karmaşık sayısını düzlemdeki $(a, b)$ noktasıyla özdeşleştir. O zaman:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Toplama</div><div class="card-body">$(a + bi) + (c + di) = (a + c) + (b + d)i$, $(a, b) + (c, d) = (a + c, b + d)$ vektör toplama kuralıyla eşleşir. Paralelkenar kuralı geçerli.</div></div>
<div class="calc-card"><div class="card-title">Negasyon</div><div class="card-body">$-z = -a - bi$, başlangıca göre yansıtılan noktadır. Yani $z - w = z + (-w)$ "$z$'ye git, sonra $w$ boyunca geri dön" demek.</div></div>
<div class="calc-card"><div class="card-title">Eşlenikleme</div><div class="card-body">$\\bar{z} = a - bi$, y-koordinatını ters çevirir — gerçek eksene göre yansıma.</div></div>
<div class="calc-card"><div class="card-title">Çarpma (önizleme)</div><div class="card-body">$zw$, $z$'nin okunu $w$'nun açısı kadar döndürür ve $|w|$ ile uzatır. Bunu 71. derste kanıtlıyoruz.</div></div>
</div>

<p class="l-text">Sözlük öyle temizdir ki, fizikçiler ve mühendisler iki boyutlu herhangi bir şeyi kodlamaları gerektiğinde $\\mathbb{C}$'yi düzlem $\\mathbb{R}^2$ ile rutin olarak <em>özdeşleştirir</em>: alternatif akımlar, sinyal fazları, akışkan akışı, kuantum durumları. Bu dersteki her formülün o zaman geometrik bir çevirisi vardır ve düzlem hakkındaki her geometrik ifadenin karmaşık sayılarla cebirsel bir karşılığı bulunur.</p>

<h2 class="lesson-title">9. $z$ ve $\\bar{z}$ İçeren Denklemleri Çözmek</h2>

<div class="calc-highlight"><strong>Bir karmaşık sayı denklemi aslında bire bir paketlenmiş iki gerçek denklemdir.</strong> Bilinmeyen $z$ gördüğünde $z = a + bi$ yaz, her iki tarafı aç, sonra gerçek ve sanal kısımları eşleştir. İki bilinmeyen, iki denklem — sıradan ortaokul cebirine geri.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 9</div><div class="example-body">$\\;2z + 3\\bar{z} \\;=\\; 5 - i\\;$ denklemini $z = a + bi$ için çöz.<br><br><strong>Adım 1.</strong> $z = a + bi$ yaz, dolayısıyla $\\bar{z} = a - bi$.<br><br><strong>Adım 2.</strong> Yerine koy ve aç:<br>$2(a + bi) + 3(a - bi) = (2a + 3a) + (2b - 3b)i = 5a - bi$.<br><br><strong>Adım 3.</strong> $5 - i$'ye eşitle: $\\;5a - bi = 5 - i$.<br><br><strong>Adım 4.</strong> Gerçek ve sanal kısımları eşleştir:<br>$5a = 5 \\Rightarrow a = 1$.<br>$-b = -1 \\Rightarrow b = 1$.<br><br><strong>Cevap:</strong> $\\mathbf{z = 1 + i}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 10</div><div class="example-body">$z + \\bar{z} = 4$ ve $z - \\bar{z} = 6i$ koşullarını sağlayan tüm $z$'leri bul.<br><br>İlk özdeşlikten ($z + \\bar{z} = 2\\,\\mathrm{Re}(z)$): $2a = 4 \\Rightarrow a = 2$.<br>İkinci özdeşlikten ($z - \\bar{z} = 2i\\,\\mathrm{Im}(z)$): $2bi = 6i \\Rightarrow b = 3$.<br><br><strong>Cevap:</strong> $\\mathbf{z = 2 + 3i}$.</div></div>

<h2 class="lesson-title">10. Yaygın Hatalar ve Nasıl Kaçınılır</h2>

<p class="l-text">Bu konuda öğrencilerin teslim ettiği yanlış cevapların çoğunun arkasında üç hata vardır. Bunları oku, tanı, yapmamayı reddet.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA — $i^2 = +1$</div><div class="compare-item">Öğrenciler bazen $i = \\sqrt{-1}$ olduğunu "hatırlıyor" ve $\\sqrt{4}^2 = 4$ benzetmesiyle $i^2 = +1$ sonucuna varıyor.</div><div class="compare-item">$\\sqrt{-1}$'in karesi <em>tanım gereği</em> $-1$'dir — $i$'yi tanıttığımız tüm neden bu. Bir işaret değişimi her çarpmayı ve her bölmeyi mahveder.</div><div class="compare-item">Çözüm: her müsvedde sayfasına "$i^2 = -1$" yaz ve başlamadan önce daire içine al.</div></div><div class="compare-col"><div class="compare-title">DOĞRU — $i^2 = -1$</div><div class="compare-item">Herhangi bir açılımdaki her $i^2$, $-1$ ile değiştirilir.</div><div class="compare-item">O zaman $-bd \\cdot i^2 = -bd \\cdot (-1) = +bd$ olur, yani 3. bölümdeki formül tam olarak.</div><div class="compare-item">Bir türetmede $i^2 = +1$ alırsan, dur ve işaret hatanı bul.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA — eşlenikte yanlış işaret</div><div class="compare-item">$\\overline{a + bi} = -a + bi$ yazmak (yanlış kısmı ters çevirmek).</div><div class="compare-item">Eşlenik $b$'nin işaretini, $a$'nın işaretini değil, ters çevirir. <em>Gerçek</em> kısım kalır, <em>sanal</em> kısım işaret değiştirir.</div><div class="compare-item">Çözüm: geometrik resmi hatırla — eşlenik $z$'yi gerçek eksene yansıtır, dolayısıyla gerçek eksende yaşayan $a$ değişmez.</div></div><div class="compare-col"><div class="compare-title">DOĞRU — sadece sanal kısmı ters çevir</div><div class="compare-item">$\\overline{a + bi} = a - bi$.</div><div class="compare-item">O zaman $z + \\bar{z} = 2a$ gerçektir (iyi — sanal kısımlar götürdü).</div><div class="compare-item">Ve $z \\bar{z} = a^2 + b^2$ gerçek ve negatif değildir (iyi — iki karenin toplamı).</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA — sadece payı çarpmak</div><div class="compare-item">Bölmede: öğrenciler yalnızca üstü eşlenikle çarpıp altı elden "sadeleştirir" ve altın da değiştiğini unutur.</div><div class="compare-item">Sonuç: cevap karmaşık sayının karmaşık sayıya bölünmüş hali olarak çıkar — tam da kaçmaya çalıştığımız form.</div><div class="compare-item">Çözüm: kesri tek nefeste $\\dfrac{\\text{üst} \\cdot \\bar{\\text{alt}}}{\\text{alt} \\cdot \\bar{\\text{alt}}}$ olarak yeniden yaz ve ancak ondan sonra aç.</div></div><div class="compare-col"><div class="compare-title">DOĞRU — HER İKİ ucu çarp</div><div class="compare-item">Eşlenik çarpanını hem paya hem paydaya birlikte uygula.</div><div class="compare-item">Payda $c^2 + d^2$ olur — pozitif gerçek sayı.</div><div class="compare-item">Ancak ondan sonra payı aç ve her parçayı o gerçek sayıya böl.</div></div></div>

<h2 class="lesson-title">11. Çözümlü Problemler</h2>

<p class="l-text">Dersteki her şeyi bir araya getiren kısa bir alıştırma seti. Önce kendin denemeyi dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — TOPLAMA</div><div class="example-body"><strong>$(7 - 5i) + (-2 + 3i)$ değerini hesapla.</strong><br><br>Gerçek: $7 + (-2) = 5$.  Sanal: $-5 + 3 = -2$.<br><br>Cevap: $\\mathbf{5 - 2i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — ÇIKARMA</div><div class="example-body"><strong>$(4 + 6i) - (1 - 2i)$ değerini hesapla.</strong><br><br>Gerçek: $4 - 1 = 3$.  Sanal: $6 - (-2) = 8$.<br><br>Cevap: $\\mathbf{3 + 8i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — ÇARPMA</div><div class="example-body"><strong>$(3 - 2i)(2 + 5i)$ değerini hesapla.</strong><br><br>Dağıt: $6 + 15i - 4i - 10 i^2 = 6 + 11i + 10 = \\mathbf{16 + 11i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — EŞLENİK ÇARPIMI</div><div class="example-body"><strong>$z = 2 - 7i$ ise $z\\bar{z}$ değerini hesapla.</strong><br><br>$z\\bar{z} = a^2 + b^2$ özdeşliğiyle, $a = 2$, $b = -7$ için:<br>$z\\bar{z} = 4 + 49 = \\mathbf{53}$.<br><br>(Doğrudan kontrol: $(2 - 7i)(2 + 7i) = 4 + 14i - 14i - 49 i^2 = 4 + 49 = 53$. ✓)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — BÖLME</div><div class="example-body"><strong>$\\dfrac{4 + 3i}{2 - i}$ değerini hesapla.</strong><br><br>Pay ve paydayı $\\overline{2 - i} = 2 + i$ ile çarp:<br><br>Payda: $(2 - i)(2 + i) = 4 + 1 = 5$.<br><br>Pay: $(4 + 3i)(2 + i) = 8 + 4i + 6i + 3i^2 = 8 + 10i - 3 = 5 + 10i$.<br><br>Dolayısıyla $\\dfrac{4 + 3i}{2 - i} = \\dfrac{5 + 10i}{5} = \\mathbf{1 + 2i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — $i$'NİN KUVVETLERİ</div><div class="example-body"><strong>$i^{27}$ değerini hesapla.</strong><br><br>$i$'nin kuvvetleri 4 periyotta döngüye girer: $i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$.<br><br>$27 \\bmod 4 = 3$ olduğundan, $i^{27} = i^3 = \\mathbf{-i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — $z$ İÇİN ÇÖZ</div><div class="example-body"><strong>$z + 2\\bar{z} = 9 + i$ denklemini çöz.</strong><br><br>$z = a + bi$ olsun, dolayısıyla $\\bar{z} = a - bi$.<br>$z + 2\\bar{z} = (a + bi) + 2(a - bi) = 3a - bi$.<br><br>$9 + i$'ye eşitleyince: $3a = 9$ verir $a = 3$ ve $-b = 1$ verir $b = -1$.<br><br>Cevap: $\\mathbf{z = 3 - i}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — RASYONELLEŞTİR</div><div class="example-body"><strong>$\\dfrac{1 + i}{1 - i}$ değerini $a + bi$ formunda yaz.</strong><br><br>Pay ve paydayı $1 + i$ ile çarp:<br><br>Payda: $(1 - i)(1 + i) = 1 + 1 = 2$.<br><br>Pay: $(1 + i)(1 + i) = 1 + 2i + i^2 = 2i$.<br><br>Dolayısıyla $\\dfrac{1 + i}{1 - i} = \\dfrac{2i}{2} = \\mathbf{i}$.<br><br>(Hoş bir sürpriz: belirli iki karmaşık sayının oranı tamamen sanaldır.)</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> 70. derste <em>modül</em> $|z| = \\sqrt{z\\bar{z}}$ ve <em>argüman</em> $\\arg(z)$ kavramlarını tanıtıyoruz; bunlar birlikte bir karmaşık sayıyı geometrik olarak başlangıçtan uzaklığı ve pozitif gerçek eksenle yaptığı açıyla belirler. O resim, bu dersin cebirsel işlemlerini güzel geometrik ifadelere dönüştürür — çarpma döndürme-ve-ölçekleme olur ve kutupsal form $z = r\\,(\\cos\\theta + i\\sin\\theta)$ de Moivre teoremini ve karmaşık kökleri açar.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Toplama ve çıkarma bileşen bileşendir: $(a+bi) \\pm (c+di) = (a \\pm c) + (b \\pm d)i$</li>
<li>Çarpma: dağıt, sonra $i^2$ yerine $-1$ koy; sonuç $(ac - bd) + (ad + bc)i$</li>
<li>Eşlenik $\\bar{z} = a - bi$ sanal kısmı ters çevirir; geometrik olarak gerçek eksene göre yansıma</li>
<li>Temel özdeşlikler: $z + \\bar{z} = 2\\,\\mathrm{Re}(z)$, $z - \\bar{z} = 2i\\,\\mathrm{Im}(z)$, $z\\bar{z} = a^2 + b^2$</li>
<li>Eşlenikleme doğrusal ve çarpılabilir: $\\overline{z+w} = \\bar{z} + \\bar{w}$, $\\overline{zw} = \\bar{z}\\cdot\\bar{w}$</li>
<li>Bölme: pay ve paydayı paydanın eşleniğiyle çarp</li>
<li>Geometrik olarak: toplama = vektör toplamı; eşlenikleme = gerçek eksene yansıma; $z\\bar{z}$ = başlangıca olan karesel uzaklık</li>
<li>$z$ ve $\\bar{z}$ içeren denklemleri çözmek için: $z = a + bi$ yaz ve gerçek-sanal kısımları eşleştir</li>
</ul>
</div>`
};
