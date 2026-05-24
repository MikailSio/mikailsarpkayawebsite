window.LISE_MAT_L68 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>For two thousand years, mathematicians had a problem they could not solve:</strong> the equation $x^2 + 1 = 0$. Square any real number, positive or negative, and you get something non-negative. So $x^2 = -1$ has no real solution. For most of history, mathematicians simply said "no solution" and moved on. Then, in the sixteenth century, Italian algebraists working on cubic equations noticed something strange: even when they only wanted real answers, they had to pass through square roots of negative numbers in the middle of the calculation. Reluctantly, they invented a new kind of number to keep the algebra alive. That number, $i$, is what this lesson is about.</p>

<p class="l-text">By the end of this lesson, you will treat $i$ as a normal symbol — multiplying by itself to give $-1$, combining with real numbers to form $a + bi$, drawing on a plane, and reducing high powers like $i^{100}$ to one of four values. None of this is a trick. The complex numbers obey every algebraic rule you already know; they simply enlarge the playing field. By the time we finish, $x^2 + 9 = 0$ will look as ordinary as $x^2 - 9 = 0$, and the "complex plane" will feel as concrete as the coordinate plane you have been drawing since middle school.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Understand why real numbers are not enough and how $i$ resolves $x^2 = -1$</li>
<li>Write any complex number in the standard form $z = a + bi$ and identify $\\text{Re}(z) = a$, $\\text{Im}(z) = b$</li>
<li>Distinguish real, purely imaginary, and zero complex numbers as special cases of $a + bi$</li>
<li>Reduce any integer power $i^n$ to one of $\\{1, i, -1, -i\\}$ using the period-4 cycle</li>
<li>Plot complex numbers as points on the Argand diagram and read their coordinates back</li>
<li>Use the equality rule $a + bi = c + di \\iff a = c$ and $b = d$ to solve elementary equations</li>
<li>Recognise the conjugate $\\bar{z} = a - bi$ and use $z = \\bar{z}$ to detect real numbers</li>
</ul>
</div>

<h2 class="lesson-title">1. The Problem with Real Numbers</h2>

<div class="calc-highlight"><strong>Square any real number and the result is greater than or equal to zero.</strong> That is the rock-solid wall the real numbers run into. $2^2 = 4$, $(-3)^2 = 9$, $0^2 = 0$. The graph of $y = x^2$ never dips below the x-axis. So the equation $x^2 = -1$ — which asks for a number whose square is $-1$ — has no real solution. The same problem hits every quadratic with negative discriminant: $x^2 + 1 = 0$, $x^2 + 4 = 0$, $x^2 + 9 = 0$, all unsolved over $\\mathbb{R}$.</div>

<p class="l-text">For most of history, this was the end of the story. If a problem asked for $\\sqrt{-1}$, the answer was "no solution exists." That is what your teachers in primary and middle school told you, and within the world of real numbers it is true. But mathematics does not stop at impossibility — it extends the system.</p>

<p class="l-text"><strong>The historical breakthrough</strong> came around 1545 when Italian mathematician Gerolamo Cardano was trying to solve cubic equations $x^3 = px + q$. His formula sometimes required taking the square root of a negative number <em>even when the final answer was a real number</em>. Cardano himself called the procedure "as subtle as it is useless" — but Rafael Bombelli, thirty years later, took the formulas seriously and showed that if you simply <em>pretend</em> $\\sqrt{-1}$ is a number and apply normal algebra, everything works out. That pretend number is what we now call $i$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">The blocked equation</div><div class="card-body">$x^2 + 1 = 0 \\Leftrightarrow x^2 = -1$. No real number has a negative square. The real line does not contain a solution.</div></div>
<div class="calc-card"><div class="card-title">The audacious idea</div><div class="card-body">Invent a new symbol $i$ and <em>declare by definition</em> that $i^2 = -1$. Treat $i$ like a normal number in algebra and see what happens.</div></div>
<div class="calc-card"><div class="card-title">The reward</div><div class="card-body">Every polynomial equation, including $x^2 = -1$, gets solutions. Algebra becomes complete. The two solutions of $x^2 = -1$ are $x = i$ and $x = -i$.</div></div>
</div>

<div class="l-note"><strong>A word about the name.</strong> Descartes labelled these numbers <em>imaginary</em> in 1637 as an insult — they felt fake to him. The name stuck even after mathematicians realised the numbers were no more imaginary than $\\sqrt{2}$ or $\\pi$. Today we treat $i$ as an ordinary algebraic object; the historical baggage in the name is just a curiosity.</div>

<h2 class="lesson-title">2. The Imaginary Unit $i$</h2>

<div class="calc-highlight"><strong>The defining property of $i$ is a single equation:</strong> $i^2 = -1$. Everything else about complex numbers — addition, multiplication, division, geometry, even the Euler identity $e^{i\\pi} + 1 = 0$ that you will meet in a few years — flows from this one rule plus the ordinary rules of algebra.</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF THE IMAGINARY UNIT</div><div class="formula-main">$$i^2 \\;=\\; -1$$</div><div class="formula-sub">By this single declaration we extend the real number line to a richer system in which every quadratic equation has solutions.</div></div>

<p class="l-text">A subtle point worth pausing on: <strong>you should think of $i^2 = -1$ as the definition, not $i = \\sqrt{-1}$ as the definition.</strong> The two look equivalent at a glance, but the square-root form hides a sign ambiguity (which root?) and runs into trouble when you naively apply rules like $\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$. The squared form is unambiguous: $i$ is <em>a</em> symbol whose square is $-1$, and the laws of algebra take it from there.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SAFE — USE THIS</div><div class="compare-item">Definition: $i^2 = -1$</div><div class="compare-item">No sign ambiguity</div><div class="compare-item">Works with all algebraic identities you know</div><div class="compare-item">Computes $i^2 \\cdot i^2 = (-1)(-1) = 1$ cleanly</div></div><div class="compare-col"><div class="compare-title">RISKY — AVOID AS A DEFINITION</div><div class="compare-item">Pseudo-definition: $i = \\sqrt{-1}$</div><div class="compare-item">"Which" square root?</div><div class="compare-item">Misleads into $\\sqrt{-1}\\sqrt{-1} = \\sqrt{1} = 1$ (wrong!)</div><div class="compare-item">Correct answer: $i \\cdot i = -1$, not $1$</div></div></div>

<p class="l-text">The naive equation $\\sqrt{(-1)(-1)} = \\sqrt{-1} \\cdot \\sqrt{-1}$ would give $1 = -1$, a contradiction. The resolution is to remember that the identity $\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$ holds for non-negative reals, not for negative numbers. When you work with $i$ symbolically, define it by $i^2 = -1$ and let normal algebra do the rest.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Why is $-i$ also a solution of $x^2 = -1$? Compute: $(-i)^2 = (-1)^2 \\cdot i^2 = 1 \\cdot (-1) = -1$. So both $i$ and $-i$ are roots. Just as $x^2 = 4$ has two real roots $\\pm 2$, the complex equation $x^2 = -1$ has two complex roots $\\pm i$.</div></div>

<h2 class="lesson-title">3. Complex Numbers: The Form $a + bi$</h2>

<div class="calc-highlight"><strong>A complex number is what you get by combining a real number with a real multiple of $i$.</strong> Specifically, a number of the form $a + bi$ where $a$ and $b$ are ordinary real numbers and $i$ is the imaginary unit. The set of all such numbers is denoted $\\mathbb{C}$ and contains every real number (when $b = 0$) plus many more besides.</div>

<div class="calc-formula"><div class="formula-label">STANDARD FORM OF A COMPLEX NUMBER</div><div class="formula-main">$$z \\;=\\; a + bi \\qquad a,\\,b \\in \\mathbb{R}, \\quad i^2 = -1$$</div><div class="formula-sub">The two real numbers $a$ and $b$ are called the real part and imaginary part of $z$.</div></div>

<p class="l-text"><strong>Names of the two parts.</strong> If $z = a + bi$ we call $a$ the <em>real part</em> of $z$ and $b$ the <em>imaginary part</em>. Note that the imaginary part is the real number multiplying $i$, not $bi$ itself — a common source of confusion. We write:</p>

<div class="calc-formula"><div class="formula-label">REAL AND IMAGINARY PARTS</div><div class="formula-main">$$\\text{Re}(z) \\;=\\; a \\qquad\\qquad \\text{Im}(z) \\;=\\; b$$</div><div class="formula-sub">$\\text{Re}(z)$ is a real number; $\\text{Im}(z)$ is also a real number (the coefficient of $i$, not the term $bi$).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$z = 3 + 4i$</div><div class="card-body">$\\text{Re}(z) = 3$, $\\text{Im}(z) = 4$. Three units along the real axis, four units along the imaginary axis.</div></div>
<div class="calc-card"><div class="card-title">$z = -2 + 7i$</div><div class="card-body">$\\text{Re}(z) = -2$, $\\text{Im}(z) = 7$. Two units left along the real axis, seven units up.</div></div>
<div class="calc-card"><div class="card-title">$z = 5 - 3i$</div><div class="card-body">$\\text{Re}(z) = 5$, $\\text{Im}(z) = -3$. Rewrite as $5 + (-3)i$ to see the imaginary part is $-3$, not $3$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">For each of the following complex numbers, identify $\\text{Re}(z)$ and $\\text{Im}(z)$.<br><br>(a) $z = 6 + 2i \\implies \\text{Re}(z) = 6$, $\\text{Im}(z) = 2$.<br>(b) $z = -1 - i \\implies$ rewrite as $-1 + (-1)i \\implies \\text{Re}(z) = -1$, $\\text{Im}(z) = -1$.<br>(c) $z = 5 \\implies$ rewrite as $5 + 0i \\implies \\text{Re}(z) = 5$, $\\text{Im}(z) = 0$.<br>(d) $z = 8i \\implies$ rewrite as $0 + 8i \\implies \\text{Re}(z) = 0$, $\\text{Im}(z) = 8$.</div></div>

<div class="l-note"><strong>Notation note:</strong> we usually write the imaginary part with no parentheses — $3 + 4i$, not $3 + (4)i$. When $b$ is negative we write $a - |b|i$ — for instance $2 - 5i$ rather than $2 + (-5)i$. Both forms mean the same thing.</div>

<h2 class="lesson-title">4. Special Cases: Real, Purely Imaginary, Zero</h2>

<div class="calc-highlight"><strong>The form $a + bi$ contains three important sub-families</strong> depending on whether $a$ or $b$ is zero. Recognising them at sight saves time and clarifies geometry.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Condition</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Form</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Name</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Examples</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$b = 0$</td><td style="padding:0.5rem 0.8rem">$z = a$</td><td style="padding:0.5rem 0.8rem"><strong>Real number</strong></td><td style="padding:0.5rem 0.8rem">$3$, $-7$, $\\pi$, $0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$a = 0$, $b \\neq 0$</td><td style="padding:0.5rem 0.8rem">$z = bi$</td><td style="padding:0.5rem 0.8rem"><strong>Purely imaginary</strong></td><td style="padding:0.5rem 0.8rem">$i$, $-5i$, $\\sqrt{2}\\,i$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$a = b = 0$</td><td style="padding:0.5rem 0.8rem">$z = 0$</td><td style="padding:0.5rem 0.8rem"><strong>Zero</strong></td><td style="padding:0.5rem 0.8rem">$0$ (only this)</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$a \\neq 0$, $b \\neq 0$</td><td style="padding:0.5rem 0.8rem">$z = a + bi$</td><td style="padding:0.5rem 0.8rem"><strong>Genuinely complex</strong></td><td style="padding:0.5rem 0.8rem">$2 + 3i$, $-1 - 4i$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Why this matters:</strong> the real numbers $\\mathbb{R}$ are a <em>subset</em> of the complex numbers $\\mathbb{C}$. Every real number you have ever worked with is also a complex number whose imaginary part happens to be zero. The complex system extends the real system without contradicting it — every theorem of real arithmetic still holds when you treat real numbers as complex.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$</div><div class="card-body">The chain of number systems. Each is contained in the next. The complex numbers are the "top" of the school-level hierarchy.</div></div>
<div class="calc-card"><div class="card-title">Zero is special</div><div class="card-body">$0$ is the only complex number that is simultaneously real and purely imaginary ($a = 0$ <em>and</em> $b = 0$).</div></div>
<div class="calc-card"><div class="card-title">Reading $bi$</div><div class="card-body">If you see $bi$ alone with no real part written, assume $a = 0$ and the number is purely imaginary. So $-3i$ means $0 + (-3)i$.</div></div>
</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Classify each as real, purely imaginary, or genuinely complex. (a) $z = -4i$: purely imaginary. (b) $z = 7$: real. (c) $z = 0$: real and purely imaginary (the only such number). (d) $z = 2 + i$: genuinely complex. (e) $z = i - 1$: rewrite as $-1 + i$, genuinely complex.</div></div>

<h2 class="lesson-title">5. Powers of $i$: The Period-4 Cycle</h2>

<div class="calc-highlight"><strong>Multiplying $i$ by itself repeatedly gives only four different values, in an endless cycle.</strong> Memorise the cycle: $i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$, then back to $i^5 = i$, and so on. Every integer power of $i$ reduces to one of $\\{1, i, -1, -i\\}$, and the rule for reducing is just "look at the remainder mod 4."</div>

<div class="calc-formula"><div class="formula-label">THE FOUR FUNDAMENTAL POWERS</div><div class="formula-main">$$i^1 \\;=\\; i, \\qquad i^2 \\;=\\; -1, \\qquad i^3 \\;=\\; -i, \\qquad i^4 \\;=\\; 1$$</div><div class="formula-sub">After $i^4$ the cycle restarts: $i^5 = i^4 \\cdot i = 1 \\cdot i = i$, and so on.</div></div>

<p class="l-text"><strong>Why does it cycle?</strong> Because $i^4 = (i^2)^2 = (-1)^2 = 1$. So multiplying by another $i$ takes us back to $i$. The pattern repeats every four steps. This is the simplest example of what mathematicians call a <em>period-4</em> sequence.</p>

<div class="calc-formula"><div class="formula-label">DERIVATION OF $i^3$</div><div class="formula-main">$$i^3 \\;=\\; i^2 \\cdot i \\;=\\; (-1) \\cdot i \\;=\\; -i$$</div></div>

<div class="calc-formula"><div class="formula-label">REDUCING $i^n$ BY REMAINDER MOD 4</div><div class="formula-main">$$i^n \\;=\\; i^{\\,n \\bmod 4}$$</div><div class="formula-sub">Divide $n$ by 4; the remainder tells you which of the four values you land on. Remainder 0 → 1, remainder 1 → $i$, remainder 2 → $-1$, remainder 3 → $-i$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$n \\bmod 4 = 0$</div><div class="card-body">$i^n = i^0 = 1$. Examples: $i^4 = 1$, $i^8 = 1$, $i^{100} = 1$.</div></div>
<div class="calc-card"><div class="card-title">$n \\bmod 4 = 1$</div><div class="card-body">$i^n = i$. Examples: $i^1 = i$, $i^5 = i$, $i^{101} = i$.</div></div>
<div class="calc-card"><div class="card-title">$n \\bmod 4 = 2$</div><div class="card-body">$i^n = -1$. Examples: $i^2 = -1$, $i^6 = -1$, $i^{102} = -1$.</div></div>
<div class="calc-card"><div class="card-title">$n \\bmod 4 = 3$</div><div class="card-body">$i^n = -i$. Examples: $i^3 = -i$, $i^7 = -i$, $i^{103} = -i$.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Compute $i^7$.<br><br>$7 \\div 4 = 1$ remainder $3$. So $i^7 = i^3 = -i$.<br><br>Alternative direct calculation: $i^7 = i^4 \\cdot i^3 = 1 \\cdot (-i) = -i$. Same answer.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Compute $i^{100}$.<br><br>$100 \\div 4 = 25$ remainder $0$. So $i^{100} = i^0 = 1$.<br><br>Another way: $100 = 4 \\cdot 25$, so $i^{100} = (i^4)^{25} = 1^{25} = 1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">Compute $i^{2027}$.<br><br>$2027 \\div 4 = 506$ remainder $3$. So $i^{2027} = i^3 = -i$.<br><br>Sanity check: $2027 = 4 \\cdot 506 + 3$, and $4 \\cdot 506 = 2024$, leaving $2027 - 2024 = 3$. Yes.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 — NEGATIVE POWER</div><div class="example-body">Compute $i^{-1}$.<br><br>By definition $i^{-1} = 1/i$. Multiply top and bottom by $i$: $i^{-1} = \\dfrac{1 \\cdot i}{i \\cdot i} = \\dfrac{i}{-1} = -i$.<br><br>Check: $i \\cdot i^{-1} = i \\cdot (-i) = -i^2 = -(-1) = 1$. Correct.</div></div>

<div class="calc-graph"><div id="plot-l68-cycle-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the four values $1$, $i$, $-1$, $-i$ marked on the unit circle in the complex plane. Each multiplication by $i$ rotates a point by 90° counter-clockwise, so the sequence $i^0, i^1, i^2, i^3, i^4, \\ldots$ visits these four points in order and then repeats. The arrows trace the rotation.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thE=[];var xE=[];var yE=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;thE.push(a);xE.push(Math.cos(a));yE.push(Math.sin(a));}
var ringE={x:xE,y:yE,mode:'lines',name:'unit circle',line:{color:'rgba(255,255,255,0.25)',width:1.4}};
var axE={x:[-1.5,1.5],y:[0,0],mode:'lines',name:'real axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ayE={x:[0,0],y:[-1.5,1.5],mode:'lines',name:'imaginary axis',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ptsE={x:[1,0,-1,0],y:[0,1,0,-1],mode:'markers+text',name:'powers of i',marker:{color:'#3b82f6',size:14},text:['1 = i⁴','i = i¹','-1 = i²','-i = i³'],textposition:['bottom right','top right','bottom left','bottom right'],textfont:{color:'#e8e8e8',size:13}};
var arrowsE={x:[],y:[],mode:'lines',name:'×i rotation',line:{color:'#f59e0b',width:2,dash:'dot'}};
var pts4=[[1,0],[0,1],[-1,0],[0,-1],[1,0]];
for(var k=0;k<4;k++){var x1=pts4[k][0],y1=pts4[k][1],x2=pts4[k+1][0],y2=pts4[k+1][1];for(var j=0;j<=30;j++){var t=j/30;var ang0=Math.atan2(y1,x1);var ang1=ang0+Math.PI/2;var ang=ang0+(ang1-ang0)*t;arrowsE.x.push(0.85*Math.cos(ang));arrowsE.y.push(0.85*Math.sin(ang));}arrowsE.x.push(null);arrowsE.y.push(null);}
var layE={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1.6,1.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-1.5,1.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l68-cycle-en',[ringE,axE,ayE,arrowsE,ptsE],layE,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Geometric interpretation:</strong> multiplying any complex number by $i$ rotates it 90° counter-clockwise in the complex plane. So starting from $1$, repeated multiplication by $i$ visits $i$, then $-1$, then $-i$, then back to $1$. The period-4 cycle is the algebraic shadow of a geometric rotation through a full turn.</div>

<h2 class="lesson-title">6. The Complex Plane (Argand Diagram)</h2>

<div class="calc-highlight"><strong>Every complex number $z = a + bi$ corresponds to a unique point $(a, b)$ in the plane.</strong> Plot the real part on the horizontal axis and the imaginary part on the vertical axis, and you get a one-to-one map between $\\mathbb{C}$ and $\\mathbb{R}^2$. The picture is called the <em>Argand diagram</em>, after Jean-Robert Argand who popularised it in 1806.</div>

<div class="calc-formula"><div class="formula-label">THE COMPLEX PLANE</div><div class="formula-main">$$z = a + bi \\;\\longleftrightarrow\\; \\text{point } (a, b)$$</div><div class="formula-sub">Horizontal axis = real axis ($\\text{Re}$). Vertical axis = imaginary axis ($\\text{Im}$). The real numbers live on the horizontal axis; the purely imaginary numbers live on the vertical axis.</div></div>

<p class="l-text"><strong>Reading off coordinates.</strong> Given $z = 3 + 4i$, plot the point $(3, 4)$ — three units to the right, four units up. Given $z = -1 + 2i$, plot $(-1, 2)$. Given $z = 2 - 3i$, plot $(2, -3)$. The negative imaginary part takes the point below the real axis.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Real axis (horizontal)</div><div class="card-body">Points $z = a + 0i = a$. The familiar real number line sits inside the complex plane as the horizontal axis.</div></div>
<div class="calc-card"><div class="card-title">Imaginary axis (vertical)</div><div class="card-body">Points $z = 0 + bi = bi$. Pure imaginary numbers form a separate line through the origin.</div></div>
<div class="calc-card"><div class="card-title">Origin</div><div class="card-body">The point $(0, 0)$ corresponds to $z = 0$, the only complex number on <em>both</em> axes.</div></div>
</div>

<div class="calc-graph"><div id="plot-l68-argand-en" class="plotly-graph" style="height:500px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three sample complex numbers placed on the Argand diagram. $z_1 = 3 + 4i$ sits in the upper right at coordinates $(3, 4)$. $z_2 = -1 + 2i$ sits in the upper left at $(-1, 2)$. $z_3 = 2 - 3i$ sits in the lower right at $(2, -3)$. The dotted lines drop down to the real axis and across to the imaginary axis, helping you read both coordinates of each point.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var axX={x:[-4,5],y:[0,0],mode:'lines',name:'real axis',line:{color:'rgba(255,255,255,0.35)',width:1.2}};
var axY={x:[0,0],y:[-4,5],mode:'lines',name:'imaginary axis',line:{color:'rgba(255,255,255,0.35)',width:1.2}};
var pts=[[3,4,'z₁ = 3 + 4i'],[-1,2,'z₂ = -1 + 2i'],[2,-3,'z₃ = 2 - 3i']];
var px=[],py=[],pt=[];for(var k=0;k<pts.length;k++){px.push(pts[k][0]);py.push(pts[k][1]);pt.push(pts[k][2]);}
var ptsTr={x:px,y:py,mode:'markers+text',name:'complex points',marker:{color:'#3b82f6',size:13},text:pt,textposition:['top right','top left','bottom right'],textfont:{color:'#e8e8e8',size:13}};
var dropsX=[],dropsY=[];
for(var k=0;k<pts.length;k++){dropsX.push(pts[k][0],pts[k][0],null,0,pts[k][0],null);dropsY.push(0,pts[k][1],null,pts[k][1],pts[k][1],null);}
var drops={x:dropsX,y:dropsY,mode:'lines',name:'coordinates',line:{color:'rgba(245,158,11,0.45)',width:1.2,dash:'dot'},showlegend:false};
var layA={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',range:[-4,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',dtick:1},yaxis:{title:'Im(z)',range:[-4,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1,dtick:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l68-argand-en',[axX,axY,drops,ptsTr],layA,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Without drawing: where does each of these complex numbers sit in the complex plane? (a) $z = 2i$ — on the positive imaginary axis, two units up. (b) $z = -3$ — on the negative real axis, three units left. (c) $z = -2 - i$ — in the third quadrant of the complex plane, at $(-2, -1)$. (d) $z = 0$ — at the origin.</div></div>

<h2 class="lesson-title">7. Equality of Complex Numbers</h2>

<div class="calc-highlight"><strong>Two complex numbers are equal if and only if their real parts are equal AND their imaginary parts are equal.</strong> A single complex equation $a + bi = c + di$ is secretly two real equations bundled together: $a = c$ and $b = d$. This decoupling is a powerful tool for solving problems with unknowns.</div>

<div class="calc-formula"><div class="formula-label">EQUALITY RULE</div><div class="formula-main">$$a + bi \\;=\\; c + di \\quad\\Longleftrightarrow\\quad a = c \\;\\text{ and }\\; b = d$$</div><div class="formula-sub">Real parts must match. Imaginary parts must match. One complex equation, two real equations.</div></div>

<p class="l-text"><strong>Why does this work?</strong> Because $\\{1, i\\}$ are <em>linearly independent</em> over the real numbers — you cannot write $i$ as a real multiple of $1$ or vice versa. So the only way for $a \\cdot 1 + b \\cdot i$ to equal $c \\cdot 1 + d \\cdot i$ is for the coefficients of $1$ and the coefficients of $i$ to match separately.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Find real $x$ and $y$ such that $(2x + 1) + (y - 3)i = 7 - 2i$.<br><br>Equating real parts: $2x + 1 = 7 \\implies 2x = 6 \\implies x = 3$.<br>Equating imaginary parts: $y - 3 = -2 \\implies y = 1$.<br><br>Answer: $x = 3$, $y = 1$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Find real $a$ and $b$ such that $(a + b) + (a - b)i = 6 + 2i$.<br><br>Real parts: $a + b = 6$.<br>Imaginary parts: $a - b = 2$.<br><br>Add the two equations: $2a = 8 \\implies a = 4$. Then $b = 6 - 4 = 2$.<br><br>Answer: $a = 4$, $b = 2$.</div></div>

<div class="l-note"><strong>Reading the rule the other way:</strong> if $a + bi = 0$ (the complex number zero), then both $a = 0$ and $b = 0$. There is no other way to make a complex number zero. We use this when solving polynomial equations with complex roots.</div>

<h2 class="lesson-title">8. The Conjugate $\\bar{z}$</h2>

<div class="calc-highlight"><strong>Flipping the sign of the imaginary part gives the conjugate of $z$.</strong> If $z = a + bi$ then $\\bar{z} = a - bi$. Geometrically, the conjugate is the reflection of $z$ across the real axis. Conjugation is one of the most useful operations on complex numbers — it shows up everywhere from division to absolute value to characteristic equations — and you will meet it repeatedly in the next two lessons.</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF THE CONJUGATE</div><div class="formula-main">$$z = a + bi \\;\\;\\implies\\;\\; \\bar{z} = a - bi$$</div><div class="formula-sub">The real part stays the same. The imaginary part flips sign.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$z = 3 + 4i$</div><div class="card-body">$\\bar{z} = 3 - 4i$. Real part 3 unchanged; imaginary part flips from $+4$ to $-4$.</div></div>
<div class="calc-card"><div class="card-title">$z = -2 + 5i$</div><div class="card-body">$\\bar{z} = -2 - 5i$. The real part can be negative — only the imaginary sign flips.</div></div>
<div class="calc-card"><div class="card-title">$z = 7$ (real)</div><div class="card-body">$\\bar{z} = 7$. A real number is its own conjugate, because its imaginary part is already 0.</div></div>
<div class="calc-card"><div class="card-title">$z = 4i$ (purely imaginary)</div><div class="card-body">$\\bar{z} = -4i$. A purely imaginary number conjugates to its own negative.</div></div>
</div>

<p class="l-text"><strong>A key observation that will pay off again and again:</strong> a complex number is real if and only if it equals its own conjugate. This is the algebraic version of saying "the point sits on the real axis."</p>

<div class="calc-formula"><div class="formula-label">REAL ⇔ $z = \\bar{z}$</div><div class="formula-main">$$z \\in \\mathbb{R} \\;\\Longleftrightarrow\\; z = \\bar{z}$$</div><div class="formula-sub">If $z = a + bi$ and $\\bar{z} = a - bi$, then $z = \\bar{z}$ forces $bi = -bi$, hence $b = 0$, hence $z$ is real. Conversely, every real number trivially equals its conjugate.</div></div>

<div class="calc-graph"><div id="plot-l68-conj-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a complex number $z = 2 + 3i$ at the point $(2, 3)$ and its conjugate $\\bar{z} = 2 - 3i$ at $(2, -3)$. The two points sit at mirror-image positions across the real axis. The vertical dashed line connecting them is perpendicular to the real axis, and the midpoint is on the real axis itself — exactly what you would expect from a reflection.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var axX2={x:[-1,4],y:[0,0],mode:'lines',name:'real axis',line:{color:'rgba(255,255,255,0.35)',width:1.2}};
var axY2={x:[0,0],y:[-4,4],mode:'lines',name:'imaginary axis',line:{color:'rgba(255,255,255,0.35)',width:1.2}};
var pZ={x:[2],y:[3],mode:'markers+text',name:'z',marker:{color:'#3b82f6',size:14},text:['z = 2 + 3i'],textposition:'top right',textfont:{color:'#e8e8e8',size:13}};
var pZbar={x:[2],y:[-3],mode:'markers+text',name:'z̄',marker:{color:'#ef4444',size:14},text:['z̄ = 2 - 3i'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:13}};
var mirror={x:[2,2],y:[3,-3],mode:'lines',name:'reflection',line:{color:'rgba(245,158,11,0.5)',width:1.5,dash:'dot'}};
var midpoint={x:[2],y:[0],mode:'markers+text',name:'midpoint',marker:{color:'#f59e0b',size:9,symbol:'square'},text:['midpoint (2,0)'],textposition:'top center',textfont:{color:'rgba(245,158,11,0.85)',size:11}};
var layC={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',range:[-1,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',dtick:1},yaxis:{title:'Im(z)',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1,dtick:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l68-conj-en',[axX2,axY2,mirror,pZ,pZbar,midpoint],layC,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Looking ahead:</strong> the conjugate is the secret ingredient in dividing complex numbers and in computing absolute values. We will return to it in detail in lesson 70 (operations on complex numbers). For now, just remember the definition $\\bar{z} = a - bi$ and the test "real $\\iff z = \\bar{z}$."</div>

<h2 class="lesson-title">9. Worked Problems</h2>

<p class="l-text">A set of practice problems pulling together every idea in the lesson. Read the statement, work it through yourself, then check against the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — POWER REDUCTION</div><div class="example-body"><strong>Compute $i^{50}$.</strong><br><br>$50 \\div 4 = 12$ remainder $2$. So $i^{50} = i^2 = -1$.<br><br>Check by another route: $i^{50} = (i^2)^{25} = (-1)^{25} = -1$. Same answer.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — SIMPLIFY A SUM OF POWERS</div><div class="example-body"><strong>Simplify $i^{15} + i^{27} + i^{40}$.</strong><br><br>$15 \\bmod 4 = 3 \\implies i^{15} = -i$.<br>$27 \\bmod 4 = 3 \\implies i^{27} = -i$.<br>$40 \\bmod 4 = 0 \\implies i^{40} = 1$.<br><br>Sum: $-i + (-i) + 1 = 1 - 2i$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — QUADRATIC WITH NEGATIVE DISCRIMINANT</div><div class="example-body"><strong>Solve $x^2 + 9 = 0$ in the complex numbers.</strong><br><br>Rearrange: $x^2 = -9$. So $x = \\pm\\sqrt{-9} = \\pm\\sqrt{9 \\cdot (-1)} = \\pm 3\\sqrt{-1} = \\pm 3i$.<br><br>Verify: $(3i)^2 = 9 \\cdot i^2 = 9 \\cdot (-1) = -9$. And $(-3i)^2 = 9 \\cdot i^2 = -9$. Both work.<br><br>Answer: $x = 3i$ or $x = -3i$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — EQUALITY OF COMPLEX NUMBERS</div><div class="example-body"><strong>Find real $x$ and $y$ such that $(x - 2) + (3y + 4)i = 5 + 7i$.</strong><br><br>Real parts: $x - 2 = 5 \\implies x = 7$.<br>Imaginary parts: $3y + 4 = 7 \\implies 3y = 3 \\implies y = 1$.<br><br>Answer: $x = 7$, $y = 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — REAL PART CONDITION</div><div class="example-body"><strong>Find $z = a + bi$ such that $\\text{Re}(z) + 2\\,\\text{Im}(z) = 5$ and $z = \\bar{z}$.</strong><br><br>The condition $z = \\bar{z}$ forces $b = 0$ — so $z$ is real.<br>With $b = 0$, the first condition becomes $a + 2 \\cdot 0 = 5 \\implies a = 5$.<br><br>Answer: $z = 5$. (A real number on the real axis.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — CLASSIFICATION</div><div class="example-body"><strong>Classify each as real, purely imaginary, or genuinely complex, and find $\\bar{z}$.</strong><br><br>(a) $z = 4 - 3i$: genuinely complex. $\\bar{z} = 4 + 3i$.<br>(b) $z = -6$: real. $\\bar{z} = -6$.<br>(c) $z = 2i$: purely imaginary. $\\bar{z} = -2i$.<br>(d) $z = i^3$: simplify first. $i^3 = -i$, so $z = -i$ is purely imaginary, and $\\bar{z} = i$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — POWER OF $-i$</div><div class="example-body"><strong>Compute $(-i)^{13}$.</strong><br><br>$(-i)^{13} = (-1)^{13} \\cdot i^{13} = -1 \\cdot i^{13}$.<br><br>$13 \\bmod 4 = 1$, so $i^{13} = i$.<br><br>Therefore $(-i)^{13} = -i$. <br><br>Alternative: notice $-i = i^3$, so $(-i)^{13} = (i^3)^{13} = i^{39}$. And $39 \\bmod 4 = 3$, giving $i^{39} = -i$. Same answer.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — TWO UNKNOWNS, COUPLED</div><div class="example-body"><strong>Find $a$ and $b$ such that $(2a - b) + (a + 3b)i = 4 + 13i$.</strong><br><br>Real part: $2a - b = 4$.<br>Imaginary part: $a + 3b = 13$.<br><br>From the first equation, $b = 2a - 4$. Substitute into the second: $a + 3(2a - 4) = 13 \\implies 7a - 12 = 13 \\implies 7a = 25 \\implies a = 25/7$. Then $b = 2 \\cdot 25/7 - 4 = 50/7 - 28/7 = 22/7$.<br><br>Answer: $a = 25/7$, $b = 22/7$. Verification: $2(25/7) - 22/7 = 50/7 - 22/7 = 28/7 = 4$. ✓ And $25/7 + 3(22/7) = 25/7 + 66/7 = 91/7 = 13$. ✓ Fractional answers are perfectly valid — equality of complex numbers does not require integer solutions.</div></div>

<h2 class="lesson-title">10. Common Mistakes</h2>

<div class="l-note"><strong>Mistake 1:</strong> writing $\\sqrt{-9} \\cdot \\sqrt{-4} = \\sqrt{36} = 6$. Wrong! The identity $\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$ requires $a, b \\geq 0$. Correct calculation: $\\sqrt{-9} \\cdot \\sqrt{-4} = (3i)(2i) = 6 i^2 = -6$. Always pull the negative inside $i$ first, then multiply.</div>

<div class="l-note"><strong>Mistake 2:</strong> confusing $\\text{Im}(z)$ with $bi$. If $z = 5 - 3i$, then $\\text{Im}(z) = -3$ (a real number), not $-3i$. The imaginary part is the coefficient of $i$, not the term containing $i$.</div>

<div class="l-note"><strong>Mistake 3:</strong> forgetting that the conjugate of a real number is itself. If $z = 7$, do not write $\\bar{z} = -7$ — that would flip the real part. The conjugate flips only the imaginary part, which is zero for a real number, so $\\bar{z} = 7$ unchanged.</div>

<div class="l-note"><strong>Mistake 4:</strong> when solving $z = \\bar{z}$, students sometimes conclude "$z$ is purely imaginary." The opposite is true: $z = \\bar{z}$ forces the imaginary part to be zero, so $z$ is <em>real</em>. (Purely imaginary numbers satisfy $z = -\\bar{z}$, not $z = \\bar{z}$.)</div>

<div class="l-note"><strong>Mistake 5:</strong> trying to compare complex numbers with $<$ or $>$. Inequalities like $2 + 3i < 5 - i$ do not make sense. The complex numbers cannot be totally ordered in a way that respects arithmetic. Only the real numbers (and subsets of $\\mathbb{C}$ that live on the real axis) have a meaningful order.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The imaginary unit $i$ is defined by $i^2 = -1$, resolving $x^2 + 1 = 0$</li>
<li>A complex number has the form $z = a + bi$ with $a, b \\in \\mathbb{R}$; $\\text{Re}(z) = a$, $\\text{Im}(z) = b$</li>
<li>Special cases: real ($b = 0$), purely imaginary ($a = 0$, $b \\neq 0$), zero ($a = b = 0$)</li>
<li>Powers of $i$ cycle with period 4: $i, -1, -i, 1, i, -1, \\ldots$; reduce $i^n$ by computing $n \\bmod 4$</li>
<li>Complex plane (Argand diagram): $z = a + bi$ corresponds to point $(a, b)$</li>
<li>Equality: $a + bi = c + di \\iff a = c$ AND $b = d$ — one complex equation = two real equations</li>
<li>Conjugate: $\\bar{z} = a - bi$ reflects $z$ across the real axis; $z$ is real $\\iff z = \\bar{z}$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İki bin yıl boyunca matematikçilerin çözemediği bir problem vardı:</strong> $x^2 + 1 = 0$ denklemi. Herhangi bir reel sayının karesini al, pozitif ya da negatif fark etmez, sonuç sıfırdan büyük ya da eşit çıkar. Yani $x^2 = -1$ denkleminin reel bir çözümü yoktur. Tarihin büyük bölümünde matematikçiler "çözüm yok" deyip yollarına devam etti. Sonra, on altıncı yüzyılda kübik denklemler üzerinde çalışan İtalyan cebircileri tuhaf bir şey fark etti: yalnızca reel cevaplar bulmak istediklerinde bile hesabın ortasında negatif sayıların karekökünden geçmek zorunda kalıyorlardı. İsteksizce, cebri canlı tutmak için yeni bir sayı türü icat ettiler. O sayı, $i$, bu dersin konusudur.</p>

<p class="l-text">Bu dersin sonunda $i$'yi normal bir sembol gibi göreceksin — kendisiyle çarpıldığında $-1$ vererek, reel sayılarla birleşerek $a + bi$ oluşturarak, bir düzlem üzerinde çizilerek ve $i^{100}$ gibi yüksek üsleri dört değerden birine indirgeyerek. Bunların hiçbiri hile değildir. Karmaşık sayılar zaten bildiğin tüm cebirsel kurallara uyar; sadece oyun alanını genişletir. Bitirdiğimizde $x^2 + 9 = 0$ denklemi $x^2 - 9 = 0$ kadar sıradan görünecek ve "karmaşık düzlem" ortaokuldan beri çizdiğin koordinat düzlemi kadar somut hissedilecek.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Reel sayıların neden yetersiz olduğunu ve $i$'nin $x^2 = -1$ problemini nasıl çözdüğünü</li>
<li>Her karmaşık sayıyı $z = a + bi$ standart biçiminde yazmayı ve $\\text{Re}(z) = a$, $\\text{Im}(z) = b$ değerlerini belirlemeyi</li>
<li>Reel, saf sanal ve sıfır karmaşık sayıları $a + bi$ biçiminin özel halleri olarak ayırt etmeyi</li>
<li>Herhangi bir tam sayı üs $i^n$ ifadesini periyot-4 döngüsünü kullanarak $\\{1, i, -1, -i\\}$ kümesinden birine indirgemeyi</li>
<li>Karmaşık sayıları Argand diyagramı üzerinde nokta olarak çizmeyi ve koordinatlarını okumayı</li>
<li>Eşitlik kuralı $a + bi = c + di \\iff a = c$ ve $b = d$ kullanarak temel denklemleri çözmeyi</li>
<li>Eşlenik $\\bar{z} = a - bi$ kavramını tanımayı ve $z = \\bar{z}$ koşuluyla reel sayıları tespit etmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Reel Sayıların Problemi</h2>

<div class="calc-highlight"><strong>Herhangi bir reel sayının karesini al, sonuç sıfırdan büyük ya da eşit çıkar.</strong> İşte reel sayıların çarptığı sağlam duvar. $2^2 = 4$, $(-3)^2 = 9$, $0^2 = 0$. $y = x^2$ grafiği asla x-ekseninin altına inmez. Yani karesi $-1$ olan bir sayıyı arayan $x^2 = -1$ denkleminin reel çözümü yoktur. Aynı problem, ayırıcısı negatif olan her ikinci dereceden denklemde karşımıza çıkar: $x^2 + 1 = 0$, $x^2 + 4 = 0$, $x^2 + 9 = 0$, hepsi $\\mathbb{R}$ üzerinde çözümsüz.</div>

<p class="l-text">Tarihin büyük bölümünde hikâyenin sonu buydu. Bir problem $\\sqrt{-1}$ değerini sorsa, cevap "çözüm yoktur" oluyordu. İlkokul ve ortaokul öğretmenlerin sana bunu söyledi ve reel sayılar dünyası içinde bu doğrudur. Ama matematik imkânsızlıkta durmaz — sistemi genişletir.</p>

<p class="l-text"><strong>Tarihsel kırılma</strong> yaklaşık 1545 yılında İtalyan matematikçi Gerolamo Cardano'nun $x^3 = px + q$ kübik denklemlerini çözmeye çalışmasıyla geldi. Formülü zaman zaman, <em>nihai cevap reel bir sayı olduğunda bile</em>, negatif bir sayının karekökünü almayı gerektiriyordu. Cardano'nun kendisi süreci "ne kadar incelikli ise o kadar yararsız" diye nitelendirdi — ama otuz yıl sonra Rafael Bombelli formülleri ciddiye aldı ve eğer $\\sqrt{-1}$ değerini bir sayı gibi <em>kabul edip</em> normal cebir uygularsan her şeyin yolunda gittiğini gösterdi. O kabul edilen sayı, bugün $i$ dediğimiz sayıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tıkanan denklem</div><div class="card-body">$x^2 + 1 = 0 \\Leftrightarrow x^2 = -1$. Hiçbir reel sayının karesi negatif değildir. Reel doğru çözüm içermez.</div></div>
<div class="calc-card"><div class="card-title">Cesur fikir</div><div class="card-body">Yeni bir sembol $i$ icat et ve <em>tanım gereği</em> $i^2 = -1$ olarak ilan et. $i$'ye cebirde normal bir sayı gibi davran ve ne olduğunu gör.</div></div>
<div class="calc-card"><div class="card-title">Ödül</div><div class="card-body">$x^2 = -1$ dahil her polinom denklemi çözüme kavuşur. Cebir tamamlanır. $x^2 = -1$ denkleminin iki çözümü $x = i$ ve $x = -i$'dir.</div></div>
</div>

<div class="l-note"><strong>İsim hakkında bir not.</strong> Descartes 1637'de bu sayılara hakaret olarak <em>sanal</em> (imaginary) adını verdi — ona göre sahteydiler. Matematikçiler sayıların $\\sqrt{2}$ veya $\\pi$'den daha sanal olmadığını fark ettikten sonra bile isim kaldı. Bugün $i$'yi sıradan bir cebirsel nesne olarak görüyoruz; isimdeki tarihsel yük sadece bir merak konusudur.</div>

<h2 class="lesson-title">2. Sanal Birim $i$</h2>

<div class="calc-highlight"><strong>$i$'nin tanımlayıcı özelliği tek bir denklemdir:</strong> $i^2 = -1$. Karmaşık sayılar hakkında her şey — toplama, çarpma, bölme, geometri, hatta birkaç yıl sonra göreceğin Euler özdeşliği $e^{i\\pi} + 1 = 0$ — bu tek kuraldan ve sıradan cebir kurallarından akar.</div>

<div class="calc-formula"><div class="formula-label">SANAL BİRİMİN TANIMI</div><div class="formula-main">$$i^2 \\;=\\; -1$$</div><div class="formula-sub">Bu tek ifadeyle reel sayı doğrusunu, her ikinci dereceden denklemin çözümünün bulunduğu daha zengin bir sisteme genişletiyoruz.</div></div>

<p class="l-text">Üzerinde durulması gereken ince bir nokta: <strong>$i^2 = -1$ ifadesini tanım olarak düşünmelisin, $i = \\sqrt{-1}$ ifadesini değil.</strong> İki form bir bakışta eşdeğer görünür, ama karekök biçimi bir işaret belirsizliği taşır (hangi kök?) ve $\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$ gibi kuralları saf saf uyguladığında soruna yol açar. Karesel biçim belirsizliksizdir: $i$, karesi $-1$ olan <em>bir</em> semboldür ve cebir kuralları gerisini hallederek alır.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">GÜVENLİ — BUNU KULLAN</div><div class="compare-item">Tanım: $i^2 = -1$</div><div class="compare-item">İşaret belirsizliği yok</div><div class="compare-item">Bildiğin tüm cebirsel özdeşliklerle çalışır</div><div class="compare-item">$i^2 \\cdot i^2 = (-1)(-1) = 1$ temiz şekilde hesaplanır</div></div><div class="compare-col"><div class="compare-title">RİSKLİ — TANIM OLARAK KULLANMA</div><div class="compare-item">Yarı-tanım: $i = \\sqrt{-1}$</div><div class="compare-item">"Hangi" karekök?</div><div class="compare-item">$\\sqrt{-1}\\sqrt{-1} = \\sqrt{1} = 1$ yanılgısına götürür (yanlış!)</div><div class="compare-item">Doğru cevap: $i \\cdot i = -1$, $1$ değil</div></div></div>

<p class="l-text">Saf eşitlik $\\sqrt{(-1)(-1)} = \\sqrt{-1} \\cdot \\sqrt{-1}$ ifadesi $1 = -1$ sonucunu verir, bu da çelişkidir. Çözüm, $\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$ özdeşliğinin negatif olmayan reeller için geçerli olduğunu, negatif sayılar için olmadığını hatırlamaktır. $i$ ile sembolik olarak çalışırken onu $i^2 = -1$ ile tanımla ve normal cebrin gerisini halletmesine izin ver.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Neden $-i$ de $x^2 = -1$ denkleminin çözümüdür? Hesapla: $(-i)^2 = (-1)^2 \\cdot i^2 = 1 \\cdot (-1) = -1$. Yani hem $i$ hem $-i$ köktür. Tıpkı $x^2 = 4$ denkleminin iki reel kökü $\\pm 2$ olduğu gibi, karmaşık denklem $x^2 = -1$ de iki karmaşık kök $\\pm i$ taşır.</div></div>

<h2 class="lesson-title">3. Karmaşık Sayılar: $a + bi$ Biçimi</h2>

<div class="calc-highlight"><strong>Karmaşık sayı, bir reel sayıyı $i$'nin bir reel katıyla birleştirdiğinde elde ettiğin sayıdır.</strong> Özellikle, $a$ ve $b$ sıradan reel sayılar, $i$ sanal birim olmak üzere $a + bi$ biçimindeki bir sayıdır. Tüm bu sayıların oluşturduğu küme $\\mathbb{C}$ ile gösterilir ve her reel sayıyı ($b = 0$ olduğunda) artı birçok başka sayıyı içerir.</div>

<div class="calc-formula"><div class="formula-label">KARMAŞIK SAYININ STANDART BİÇİMİ</div><div class="formula-main">$$z \\;=\\; a + bi \\qquad a,\\,b \\in \\mathbb{R}, \\quad i^2 = -1$$</div><div class="formula-sub">İki reel sayı $a$ ve $b$, $z$'nin reel kısmı ve sanal kısmı olarak adlandırılır.</div></div>

<p class="l-text"><strong>İki kısmın isimleri.</strong> Eğer $z = a + bi$ ise $a$'ya $z$'nin <em>reel kısmı</em>, $b$'ye ise <em>sanal kısmı</em> denir. Dikkat: sanal kısım $i$ ile çarpılan reel sayıdır, $bi$ ifadesinin kendisi değildir — yaygın bir karışıklık kaynağı. Şöyle yazarız:</p>

<div class="calc-formula"><div class="formula-label">REEL VE SANAL KISIMLAR</div><div class="formula-main">$$\\text{Re}(z) \\;=\\; a \\qquad\\qquad \\text{Im}(z) \\;=\\; b$$</div><div class="formula-sub">$\\text{Re}(z)$ bir reel sayıdır; $\\text{Im}(z)$ de bir reel sayıdır ($i$'nin katsayısıdır, $bi$ terimi değil).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$z = 3 + 4i$</div><div class="card-body">$\\text{Re}(z) = 3$, $\\text{Im}(z) = 4$. Reel eksende üç birim, sanal eksende dört birim.</div></div>
<div class="calc-card"><div class="card-title">$z = -2 + 7i$</div><div class="card-body">$\\text{Re}(z) = -2$, $\\text{Im}(z) = 7$. Reel eksende sola iki birim, yukarı yedi birim.</div></div>
<div class="calc-card"><div class="card-title">$z = 5 - 3i$</div><div class="card-body">$\\text{Re}(z) = 5$, $\\text{Im}(z) = -3$. $5 + (-3)i$ olarak yaz, sanal kısmın $3$ değil $-3$ olduğunu görürsün.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Aşağıdaki karmaşık sayıların her biri için $\\text{Re}(z)$ ve $\\text{Im}(z)$ değerlerini belirle.<br><br>(a) $z = 6 + 2i \\implies \\text{Re}(z) = 6$, $\\text{Im}(z) = 2$.<br>(b) $z = -1 - i \\implies$ $-1 + (-1)i$ olarak yaz $\\implies \\text{Re}(z) = -1$, $\\text{Im}(z) = -1$.<br>(c) $z = 5 \\implies$ $5 + 0i$ olarak yaz $\\implies \\text{Re}(z) = 5$, $\\text{Im}(z) = 0$.<br>(d) $z = 8i \\implies$ $0 + 8i$ olarak yaz $\\implies \\text{Re}(z) = 0$, $\\text{Im}(z) = 8$.</div></div>

<div class="l-note"><strong>Gösterim notu:</strong> sanal kısmı genellikle parantez olmadan yazarız — $3 + 4i$, $3 + (4)i$ değil. $b$ negatif olduğunda $a - |b|i$ yazarız — örneğin $2 + (-5)i$ yerine $2 - 5i$. İki biçim de aynı şeyi ifade eder.</div>

<h2 class="lesson-title">4. Özel Durumlar: Reel, Saf Sanal, Sıfır</h2>

<div class="calc-highlight"><strong>$a + bi$ biçimi, $a$ ya da $b$'nin sıfır olup olmamasına göre üç önemli alt aile içerir.</strong> Bunları görür görmez tanımak zaman kazandırır ve geometriyi netleştirir.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Koşul</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Biçim</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Adı</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Örnekler</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$b = 0$</td><td style="padding:0.5rem 0.8rem">$z = a$</td><td style="padding:0.5rem 0.8rem"><strong>Reel sayı</strong></td><td style="padding:0.5rem 0.8rem">$3$, $-7$, $\\pi$, $0$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$a = 0$, $b \\neq 0$</td><td style="padding:0.5rem 0.8rem">$z = bi$</td><td style="padding:0.5rem 0.8rem"><strong>Saf sanal</strong></td><td style="padding:0.5rem 0.8rem">$i$, $-5i$, $\\sqrt{2}\\,i$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$a = b = 0$</td><td style="padding:0.5rem 0.8rem">$z = 0$</td><td style="padding:0.5rem 0.8rem"><strong>Sıfır</strong></td><td style="padding:0.5rem 0.8rem">$0$ (yalnızca bu)</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$a \\neq 0$, $b \\neq 0$</td><td style="padding:0.5rem 0.8rem">$z = a + bi$</td><td style="padding:0.5rem 0.8rem"><strong>Gerçekten karmaşık</strong></td><td style="padding:0.5rem 0.8rem">$2 + 3i$, $-1 - 4i$</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Bu neden önemli:</strong> reel sayılar $\\mathbb{R}$, karmaşık sayılar $\\mathbb{C}$'nin bir <em>alt kümesidir</em>. Bugüne kadar üzerinde çalıştığın her reel sayı aynı zamanda sanal kısmı sıfır olan bir karmaşık sayıdır. Karmaşık sistem, reel sistemi onunla çelişmeden genişletir — reel aritmetiğin her teoremi reel sayıları karmaşık sayı olarak ele aldığında hâlâ geçerlidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$</div><div class="card-body">Sayı sistemleri zinciri. Her biri sonrakinin içindedir. Karmaşık sayılar lise düzeyi hiyerarşinin "tepesidir".</div></div>
<div class="calc-card"><div class="card-title">Sıfır özeldir</div><div class="card-body">$0$, aynı anda hem reel hem saf sanal olan tek karmaşık sayıdır ($a = 0$ <em>ve</em> $b = 0$).</div></div>
<div class="calc-card"><div class="card-title">$bi$'yi okumak</div><div class="card-body">Reel kısım yazılmamış tek başına $bi$ görürsen, $a = 0$ varsay ve sayının saf sanal olduğunu bil. Yani $-3i$, $0 + (-3)i$ anlamına gelir.</div></div>
</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Her birini reel, saf sanal veya gerçekten karmaşık olarak sınıflandır. (a) $z = -4i$: saf sanal. (b) $z = 7$: reel. (c) $z = 0$: reel ve saf sanal (tek böyle sayı). (d) $z = 2 + i$: gerçekten karmaşık. (e) $z = i - 1$: $-1 + i$ olarak yaz, gerçekten karmaşık.</div></div>

<h2 class="lesson-title">5. $i$'nin Kuvvetleri: Periyot-4 Döngüsü</h2>

<div class="calc-highlight"><strong>$i$'yi tekrar tekrar kendisiyle çarpınca yalnızca dört farklı değer alırsın, sonsuz bir döngü içinde.</strong> Döngüyü ezberle: $i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$, sonra tekrar $i^5 = i$, ve böyle devam eder. $i$'nin her tam sayı kuvveti $\\{1, i, -1, -i\\}$ kümesinden birine indirgenir ve indirgeme kuralı sadece "mod 4'teki kalana bak" şeklindedir.</div>

<div class="calc-formula"><div class="formula-label">DÖRT TEMEL KUVVET</div><div class="formula-main">$$i^1 \\;=\\; i, \\qquad i^2 \\;=\\; -1, \\qquad i^3 \\;=\\; -i, \\qquad i^4 \\;=\\; 1$$</div><div class="formula-sub">$i^4$'ten sonra döngü yeniden başlar: $i^5 = i^4 \\cdot i = 1 \\cdot i = i$, ve böyle devam eder.</div></div>

<p class="l-text"><strong>Neden döngüsel?</strong> Çünkü $i^4 = (i^2)^2 = (-1)^2 = 1$. Yani bir $i$ daha çarpmak bizi tekrar $i$'ye götürür. Örüntü dört adımda bir kendini tekrar eder. Bu, matematikçilerin <em>periyot-4</em> dediği dizilerin en basit örneğidir.</p>

<div class="calc-formula"><div class="formula-label">$i^3$ TÜRETME</div><div class="formula-main">$$i^3 \\;=\\; i^2 \\cdot i \\;=\\; (-1) \\cdot i \\;=\\; -i$$</div></div>

<div class="calc-formula"><div class="formula-label">$i^n$ DEĞERİNİ MOD 4 KALANIYLA İNDİRGEME</div><div class="formula-main">$$i^n \\;=\\; i^{\\,n \\bmod 4}$$</div><div class="formula-sub">$n$'yi 4'e böl; kalan sana dört değerden hangisine düştüğünü söyler. Kalan 0 → 1, kalan 1 → $i$, kalan 2 → $-1$, kalan 3 → $-i$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$n \\bmod 4 = 0$</div><div class="card-body">$i^n = i^0 = 1$. Örnekler: $i^4 = 1$, $i^8 = 1$, $i^{100} = 1$.</div></div>
<div class="calc-card"><div class="card-title">$n \\bmod 4 = 1$</div><div class="card-body">$i^n = i$. Örnekler: $i^1 = i$, $i^5 = i$, $i^{101} = i$.</div></div>
<div class="calc-card"><div class="card-title">$n \\bmod 4 = 2$</div><div class="card-body">$i^n = -1$. Örnekler: $i^2 = -1$, $i^6 = -1$, $i^{102} = -1$.</div></div>
<div class="calc-card"><div class="card-title">$n \\bmod 4 = 3$</div><div class="card-body">$i^n = -i$. Örnekler: $i^3 = -i$, $i^7 = -i$, $i^{103} = -i$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$i^7$ değerini hesapla.<br><br>$7 \\div 4 = 1$ kalan $3$. Yani $i^7 = i^3 = -i$.<br><br>Doğrudan alternatif hesap: $i^7 = i^4 \\cdot i^3 = 1 \\cdot (-i) = -i$. Aynı sonuç.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$i^{100}$ değerini hesapla.<br><br>$100 \\div 4 = 25$ kalan $0$. Yani $i^{100} = i^0 = 1$.<br><br>Başka bir yol: $100 = 4 \\cdot 25$, bu yüzden $i^{100} = (i^4)^{25} = 1^{25} = 1$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">$i^{2027}$ değerini hesapla.<br><br>$2027 \\div 4 = 506$ kalan $3$. Yani $i^{2027} = i^3 = -i$.<br><br>Tutarlılık kontrolü: $2027 = 4 \\cdot 506 + 3$, ve $4 \\cdot 506 = 2024$, kalan $2027 - 2024 = 3$. Doğru.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4 — NEGATİF KUVVET</div><div class="example-body">$i^{-1}$ değerini hesapla.<br><br>Tanım gereği $i^{-1} = 1/i$. Pay ve paydayı $i$ ile çarp: $i^{-1} = \\dfrac{1 \\cdot i}{i \\cdot i} = \\dfrac{i}{-1} = -i$.<br><br>Kontrol: $i \\cdot i^{-1} = i \\cdot (-i) = -i^2 = -(-1) = 1$. Doğru.</div></div>

<div class="calc-graph"><div id="plot-l68-cycle-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> karmaşık düzlemde birim çember üzerinde işaretlenmiş dört değer $1$, $i$, $-1$, $-i$. $i$ ile yapılan her çarpma bir noktayı saat yönünün tersine 90° döndürür, böylece $i^0, i^1, i^2, i^3, i^4, \\ldots$ dizisi bu dört noktayı sırayla ziyaret eder ve tekrar başa döner. Oklar dönmeyi izler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var thT=[];var xT=[];var yT=[];for(var i=0;i<=200;i++){var a=2*Math.PI*i/200;thT.push(a);xT.push(Math.cos(a));yT.push(Math.sin(a));}
var ringT={x:xT,y:yT,mode:'lines',name:'birim çember',line:{color:'rgba(255,255,255,0.25)',width:1.4}};
var axT={x:[-1.5,1.5],y:[0,0],mode:'lines',name:'reel eksen',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ayT={x:[0,0],y:[-1.5,1.5],mode:'lines',name:'sanal eksen',line:{color:'rgba(255,255,255,0.3)',width:1},showlegend:false};
var ptsT={x:[1,0,-1,0],y:[0,1,0,-1],mode:'markers+text',name:'i kuvvetleri',marker:{color:'#3b82f6',size:14},text:['1 = i⁴','i = i¹','-1 = i²','-i = i³'],textposition:['bottom right','top right','bottom left','bottom right'],textfont:{color:'#e8e8e8',size:13}};
var arrowsT={x:[],y:[],mode:'lines',name:'×i dönüşü',line:{color:'#f59e0b',width:2,dash:'dot'}};
var pts4t=[[1,0],[0,1],[-1,0],[0,-1],[1,0]];
for(var k=0;k<4;k++){var x1=pts4t[k][0],y1=pts4t[k][1],x2=pts4t[k+1][0],y2=pts4t[k+1][1];for(var j=0;j<=30;j++){var t=j/30;var ang0=Math.atan2(y1,x1);var ang1=ang0+Math.PI/2;var ang=ang0+(ang1-ang0)*t;arrowsT.x.push(0.85*Math.cos(ang));arrowsT.y.push(0.85*Math.sin(ang));}arrowsT.x.push(null);arrowsT.y.push(null);}
var layT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re',range:[-1.6,1.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'Im',range:[-1.5,1.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l68-cycle-tr',[ringT,axT,ayT,arrowsT,ptsT],layT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Geometrik yorum:</strong> herhangi bir karmaşık sayıyı $i$ ile çarpmak onu karmaşık düzlemde saat yönünün tersine 90° döndürür. Bu yüzden $1$'den başlayıp $i$ ile tekrar tekrar çarpmak sırayla $i$, sonra $-1$, sonra $-i$ noktalarını ziyaret eder ve tekrar $1$'e döner. Periyot-4 döngüsü, tam bir tur boyunca geometrik bir dönmenin cebirsel gölgesidir.</div>

<h2 class="lesson-title">6. Karmaşık Düzlem (Argand Diyagramı)</h2>

<div class="calc-highlight"><strong>Her $z = a + bi$ karmaşık sayısı düzlemde tek bir $(a, b)$ noktasına karşılık gelir.</strong> Reel kısmı yatay eksene, sanal kısmı dikey eksene koy, $\\mathbb{C}$ ile $\\mathbb{R}^2$ arasında bire bir bir eşleşme elde edersin. Resmin adı 1806'da yaygınlaştıran Jean-Robert Argand'dan dolayı <em>Argand diyagramıdır</em>.</div>

<div class="calc-formula"><div class="formula-label">KARMAŞIK DÜZLEM</div><div class="formula-main">$$z = a + bi \\;\\longleftrightarrow\\; (a, b) \\;\\text{noktası}$$</div><div class="formula-sub">Yatay eksen = reel eksen ($\\text{Re}$). Dikey eksen = sanal eksen ($\\text{Im}$). Reel sayılar yatay eksende yaşar; saf sanal sayılar dikey eksende yaşar.</div></div>

<p class="l-text"><strong>Koordinatları okuma.</strong> $z = 3 + 4i$ verilse, $(3, 4)$ noktasını çiz — sağa üç birim, yukarı dört birim. $z = -1 + 2i$ verilse $(-1, 2)$ noktasını çiz. $z = 2 - 3i$ verilse $(2, -3)$ noktasını çiz. Negatif sanal kısım, noktayı reel eksenin altına götürür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reel eksen (yatay)</div><div class="card-body">$z = a + 0i = a$ noktaları. Tanıdık reel sayı doğrusu karmaşık düzlemin içinde yatay eksen olarak oturur.</div></div>
<div class="calc-card"><div class="card-title">Sanal eksen (dikey)</div><div class="card-body">$z = 0 + bi = bi$ noktaları. Saf sanal sayılar orijinden geçen ayrı bir doğru oluşturur.</div></div>
<div class="calc-card"><div class="card-title">Orijin</div><div class="card-body">$(0, 0)$ noktası $z = 0$'a karşılık gelir, <em>her iki</em> eksen üzerinde bulunan tek karmaşık sayı.</div></div>
</div>

<div class="calc-graph"><div id="plot-l68-argand-tr" class="plotly-graph" style="height:500px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> Argand diyagramı üzerine yerleştirilmiş üç örnek karmaşık sayı. $z_1 = 3 + 4i$ sağ üstte $(3, 4)$ koordinatında oturuyor. $z_2 = -1 + 2i$ sol üstte $(-1, 2)$ koordinatında. $z_3 = 2 - 3i$ sağ altta $(2, -3)$ koordinatında. Kesikli çizgiler her noktadan reel eksene ve sanal eksene düşerek iki koordinatı da okumana yardım eder.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var axXt={x:[-4,5],y:[0,0],mode:'lines',name:'reel eksen',line:{color:'rgba(255,255,255,0.35)',width:1.2}};
var axYt={x:[0,0],y:[-4,5],mode:'lines',name:'sanal eksen',line:{color:'rgba(255,255,255,0.35)',width:1.2}};
var ptsT=[[3,4,'z₁ = 3 + 4i'],[-1,2,'z₂ = -1 + 2i'],[2,-3,'z₃ = 2 - 3i']];
var pxT=[],pyT=[],ptT=[];for(var k=0;k<ptsT.length;k++){pxT.push(ptsT[k][0]);pyT.push(ptsT[k][1]);ptT.push(ptsT[k][2]);}
var ptsTr={x:pxT,y:pyT,mode:'markers+text',name:'karmaşık noktalar',marker:{color:'#3b82f6',size:13},text:ptT,textposition:['top right','top left','bottom right'],textfont:{color:'#e8e8e8',size:13}};
var dropsXt=[],dropsYt=[];
for(var k=0;k<ptsT.length;k++){dropsXt.push(ptsT[k][0],ptsT[k][0],null,0,ptsT[k][0],null);dropsYt.push(0,ptsT[k][1],null,ptsT[k][1],ptsT[k][1],null);}
var dropsT={x:dropsXt,y:dropsYt,mode:'lines',name:'koordinatlar',line:{color:'rgba(245,158,11,0.45)',width:1.2,dash:'dot'},showlegend:false};
var layAt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',range:[-4,5.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',dtick:1},yaxis:{title:'Im(z)',range:[-4,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1,dtick:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l68-argand-tr',[axXt,axYt,dropsT,ptsTr],layAt,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Çizmeden: bu karmaşık sayıların her biri karmaşık düzlemde nerede oturuyor? (a) $z = 2i$ — pozitif sanal eksende, iki birim yukarıda. (b) $z = -3$ — negatif reel eksende, üç birim solda. (c) $z = -2 - i$ — karmaşık düzlemin üçüncü bölgesinde, $(-2, -1)$ noktasında. (d) $z = 0$ — orijinde.</div></div>

<h2 class="lesson-title">7. Karmaşık Sayıların Eşitliği</h2>

<div class="calc-highlight"><strong>İki karmaşık sayı, ancak ve ancak reel kısımları eşit VE sanal kısımları eşit ise eşittir.</strong> Tek bir karmaşık denklem $a + bi = c + di$ aslında iki reel denklemin gizli bir paketidir: $a = c$ ve $b = d$. Bu ayrıştırma, bilinmeyenli problemleri çözmek için güçlü bir araçtır.</div>

<div class="calc-formula"><div class="formula-label">EŞİTLİK KURALI</div><div class="formula-main">$$a + bi \\;=\\; c + di \\quad\\Longleftrightarrow\\quad a = c \\;\\text{ ve }\\; b = d$$</div><div class="formula-sub">Reel kısımlar eşleşmeli. Sanal kısımlar eşleşmeli. Bir karmaşık denklem, iki reel denklem.</div></div>

<p class="l-text"><strong>Bu neden işliyor?</strong> Çünkü $\\{1, i\\}$ reel sayılar üzerinde <em>lineer bağımsızdır</em> — $i$'yi $1$'in bir reel katı olarak yazamazsın ya da tam tersi. Bu yüzden $a \\cdot 1 + b \\cdot i$ ifadesinin $c \\cdot 1 + d \\cdot i$ ifadesine eşit olmasının tek yolu, $1$ katsayılarının ve $i$ katsayılarının ayrı ayrı eşleşmesidir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$(2x + 1) + (y - 3)i = 7 - 2i$ olacak şekilde reel $x$ ve $y$ değerlerini bul.<br><br>Reel kısımları eşitle: $2x + 1 = 7 \\implies 2x = 6 \\implies x = 3$.<br>Sanal kısımları eşitle: $y - 3 = -2 \\implies y = 1$.<br><br>Cevap: $x = 3$, $y = 1$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$(a + b) + (a - b)i = 6 + 2i$ olacak şekilde reel $a$ ve $b$ değerlerini bul.<br><br>Reel kısımlar: $a + b = 6$.<br>Sanal kısımlar: $a - b = 2$.<br><br>İki denklemi topla: $2a = 8 \\implies a = 4$. Sonra $b = 6 - 4 = 2$.<br><br>Cevap: $a = 4$, $b = 2$.</div></div>

<div class="l-note"><strong>Kuralı tersinden okuma:</strong> eğer $a + bi = 0$ (karmaşık sayı sıfırı) ise hem $a = 0$ hem $b = 0$ olmalıdır. Bir karmaşık sayıyı sıfır yapmanın başka yolu yoktur. Bu kuralı karmaşık köklü polinom denklemleri çözerken kullanırız.</div>

<h2 class="lesson-title">8. Eşlenik $\\bar{z}$</h2>

<div class="calc-highlight"><strong>Sanal kısmın işaretini ters çevirmek $z$'nin eşleniğini verir.</strong> Eğer $z = a + bi$ ise $\\bar{z} = a - bi$. Geometrik olarak eşlenik, $z$'nin reel eksene göre yansımasıdır. Eşleme işlemi karmaşık sayılar üzerindeki en kullanışlı işlemlerden biridir — bölmeden mutlak değere, karakteristik denklemlere kadar her yerde karşına çıkar — ve önümüzdeki iki derste tekrar tekrar göreceksin.</div>

<div class="calc-formula"><div class="formula-label">EŞLENİĞİN TANIMI</div><div class="formula-main">$$z = a + bi \\;\\;\\implies\\;\\; \\bar{z} = a - bi$$</div><div class="formula-sub">Reel kısım aynı kalır. Sanal kısım işaret değiştirir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$z = 3 + 4i$</div><div class="card-body">$\\bar{z} = 3 - 4i$. Reel kısım 3 değişmez; sanal kısım $+4$'ten $-4$'e döner.</div></div>
<div class="calc-card"><div class="card-title">$z = -2 + 5i$</div><div class="card-body">$\\bar{z} = -2 - 5i$. Reel kısım negatif olabilir — yalnızca sanal işaret döner.</div></div>
<div class="calc-card"><div class="card-title">$z = 7$ (reel)</div><div class="card-body">$\\bar{z} = 7$. Bir reel sayı kendi eşleniğidir, çünkü sanal kısmı zaten 0'dır.</div></div>
<div class="calc-card"><div class="card-title">$z = 4i$ (saf sanal)</div><div class="card-body">$\\bar{z} = -4i$. Saf sanal bir sayı kendi negatifine eşlenir.</div></div>
</div>

<p class="l-text"><strong>Defalarca işine yarayacak önemli bir gözlem:</strong> bir karmaşık sayı ancak ve ancak kendi eşleniğine eşitse reeldir. Bu, "nokta reel eksende oturuyor" demenin cebirsel halidir.</p>

<div class="calc-formula"><div class="formula-label">REEL ⇔ $z = \\bar{z}$</div><div class="formula-main">$$z \\in \\mathbb{R} \\;\\Longleftrightarrow\\; z = \\bar{z}$$</div><div class="formula-sub">Eğer $z = a + bi$ ve $\\bar{z} = a - bi$ ise $z = \\bar{z}$ olması $bi = -bi$, yani $b = 0$, yani $z$ reeldir zorunluluğunu doğurur. Tersine, her reel sayı zaten kendi eşleniğine eşittir.</div></div>

<div class="calc-graph"><div id="plot-l68-conj-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> bir karmaşık sayı $z = 2 + 3i$, $(2, 3)$ noktasında ve onun eşleniği $\\bar{z} = 2 - 3i$, $(2, -3)$ noktasında. İki nokta reel eksene göre simetrik ayna konumlarında bulunur. Onları birleştiren dikey kesikli çizgi reel eksene diktir ve orta noktası tam olarak reel eksen üzerindedir — bir yansımadan tam olarak beklediğin gibi.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var axX2t={x:[-1,4],y:[0,0],mode:'lines',name:'reel eksen',line:{color:'rgba(255,255,255,0.35)',width:1.2}};
var axY2t={x:[0,0],y:[-4,4],mode:'lines',name:'sanal eksen',line:{color:'rgba(255,255,255,0.35)',width:1.2}};
var pZt={x:[2],y:[3],mode:'markers+text',name:'z',marker:{color:'#3b82f6',size:14},text:['z = 2 + 3i'],textposition:'top right',textfont:{color:'#e8e8e8',size:13}};
var pZbarT={x:[2],y:[-3],mode:'markers+text',name:'z̄',marker:{color:'#ef4444',size:14},text:['z̄ = 2 - 3i'],textposition:'bottom right',textfont:{color:'#e8e8e8',size:13}};
var mirrorT={x:[2,2],y:[3,-3],mode:'lines',name:'yansıma',line:{color:'rgba(245,158,11,0.5)',width:1.5,dash:'dot'}};
var midpointT={x:[2],y:[0],mode:'markers+text',name:'orta nokta',marker:{color:'#f59e0b',size:9,symbol:'square'},text:['orta nokta (2,0)'],textposition:'top center',textfont:{color:'rgba(245,158,11,0.85)',size:11}};
var layCt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'Re(z)',range:[-1,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',dtick:1},yaxis:{title:'Im(z)',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)',scaleanchor:'x',scaleratio:1,dtick:1},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l68-conj-tr',[axX2t,axY2t,mirrorT,pZt,pZbarT,midpointT],layCt,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>İleriye bakış:</strong> eşlenik, karmaşık sayıları bölmenin ve mutlak değer hesaplamanın gizli içeriğidir. 70. derste (karmaşık sayılarda işlemler) ona detaylı dönüş yapacağız. Şimdilik $\\bar{z} = a - bi$ tanımını ve "reel $\\iff z = \\bar{z}$" testini hatırlamak yeterli.</div>

<h2 class="lesson-title">9. Çözümlü Problemler</h2>

<p class="l-text">Dersteki her fikri bir araya getiren bir alıştırma seti. İfadeyi oku, kendin çöz, sonra çözümle karşılaştır.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — KUVVET İNDİRGEME</div><div class="example-body">$i^{50}$ değerini hesapla.<br><br>$50 \\div 4 = 12$ kalan $2$. Yani $i^{50} = i^2 = -1$.<br><br>Başka yoldan kontrol: $i^{50} = (i^2)^{25} = (-1)^{25} = -1$. Aynı cevap.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — KUVVET TOPLAMINI SADELEŞTİRME</div><div class="example-body">$i^{15} + i^{27} + i^{40}$ ifadesini sadeleştir.<br><br>$15 \\bmod 4 = 3 \\implies i^{15} = -i$.<br>$27 \\bmod 4 = 3 \\implies i^{27} = -i$.<br>$40 \\bmod 4 = 0 \\implies i^{40} = 1$.<br><br>Toplam: $-i + (-i) + 1 = 1 - 2i$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — NEGATİF AYIRIÇLI İKİNCİ DERECEDEN</div><div class="example-body">$x^2 + 9 = 0$ denklemini karmaşık sayılarda çöz.<br><br>Düzenle: $x^2 = -9$. Yani $x = \\pm\\sqrt{-9} = \\pm\\sqrt{9 \\cdot (-1)} = \\pm 3\\sqrt{-1} = \\pm 3i$.<br><br>Doğrula: $(3i)^2 = 9 \\cdot i^2 = 9 \\cdot (-1) = -9$. Ve $(-3i)^2 = 9 \\cdot i^2 = -9$. İkisi de işliyor.<br><br>Cevap: $x = 3i$ veya $x = -3i$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — KARMAŞIK SAYILARDA EŞİTLİK</div><div class="example-body">$(x - 2) + (3y + 4)i = 5 + 7i$ olacak şekilde reel $x$ ve $y$ değerlerini bul.<br><br>Reel kısımlar: $x - 2 = 5 \\implies x = 7$.<br>Sanal kısımlar: $3y + 4 = 7 \\implies 3y = 3 \\implies y = 1$.<br><br>Cevap: $x = 7$, $y = 1$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — REEL KISIM KOŞULU</div><div class="example-body">$\\text{Re}(z) + 2\\,\\text{Im}(z) = 5$ ve $z = \\bar{z}$ olacak şekilde $z = a + bi$ değerini bul.<br><br>$z = \\bar{z}$ koşulu $b = 0$ olmasını zorlar — yani $z$ reeldir.<br>$b = 0$ iken birinci koşul $a + 2 \\cdot 0 = 5 \\implies a = 5$ olur.<br><br>Cevap: $z = 5$. (Reel eksen üzerinde bir reel sayı.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — SINIFLANDIRMA</div><div class="example-body">Her birini reel, saf sanal veya gerçekten karmaşık olarak sınıflandır ve $\\bar{z}$ değerini bul.<br><br>(a) $z = 4 - 3i$: gerçekten karmaşık. $\\bar{z} = 4 + 3i$.<br>(b) $z = -6$: reel. $\\bar{z} = -6$.<br>(c) $z = 2i$: saf sanal. $\\bar{z} = -2i$.<br>(d) $z = i^3$: önce sadeleştir. $i^3 = -i$, yani $z = -i$ saf sanaldır ve $\\bar{z} = i$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — $-i$'NİN KUVVETİ</div><div class="example-body">$(-i)^{13}$ değerini hesapla.<br><br>$(-i)^{13} = (-1)^{13} \\cdot i^{13} = -1 \\cdot i^{13}$.<br><br>$13 \\bmod 4 = 1$, yani $i^{13} = i$.<br><br>Bu yüzden $(-i)^{13} = -i$.<br><br>Alternatif: $-i = i^3$ olduğunu fark et, $(-i)^{13} = (i^3)^{13} = i^{39}$. Ve $39 \\bmod 4 = 3$, $i^{39} = -i$. Aynı cevap.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — İKİ BİLİNMEYENLİ, BAĞLI</div><div class="example-body">$(2a - b) + (a + 3b)i = 4 + 13i$ olacak şekilde $a$ ve $b$ değerlerini bul.<br><br>Reel kısım: $2a - b = 4$.<br>Sanal kısım: $a + 3b = 13$.<br><br>Birinci denklemden $b = 2a - 4$. İkinciye yerleştir: $a + 3(2a - 4) = 13 \\implies 7a - 12 = 13 \\implies 7a = 25 \\implies a = 25/7$. Sonra $b = 2 \\cdot 25/7 - 4 = 50/7 - 28/7 = 22/7$.<br><br>Cevap: $a = 25/7$, $b = 22/7$. Doğrulama: $2(25/7) - 22/7 = 50/7 - 22/7 = 28/7 = 4$. ✓ Ve $25/7 + 3(22/7) = 25/7 + 66/7 = 91/7 = 13$. ✓ Kesirli cevaplar tamamen geçerlidir — karmaşık sayıların eşitliği tam sayı çözüm gerektirmez.</div></div>

<h2 class="lesson-title">10. Yaygın Hatalar</h2>

<div class="l-note"><strong>Hata 1:</strong> $\\sqrt{-9} \\cdot \\sqrt{-4} = \\sqrt{36} = 6$ yazmak. Yanlış! $\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$ özdeşliği $a, b \\geq 0$ gerektirir. Doğru hesap: $\\sqrt{-9} \\cdot \\sqrt{-4} = (3i)(2i) = 6 i^2 = -6$. Önce negatifi $i$'nin içine çek, sonra çarp.</div>

<div class="l-note"><strong>Hata 2:</strong> $\\text{Im}(z)$ ile $bi$'yi karıştırmak. Eğer $z = 5 - 3i$ ise $\\text{Im}(z) = -3$ (bir reel sayı), $-3i$ değil. Sanal kısım $i$'nin katsayısıdır, $i$ içeren terim değil.</div>

<div class="l-note"><strong>Hata 3:</strong> bir reel sayının eşleniğinin kendisi olduğunu unutmak. Eğer $z = 7$ ise $\\bar{z} = -7$ yazma — bu reel kısmı ters çevirir. Eşlenik yalnızca sanal kısmı ters çevirir, reel sayıda sanal kısım sıfır olduğu için $\\bar{z} = 7$ değişmeden kalır.</div>

<div class="l-note"><strong>Hata 4:</strong> $z = \\bar{z}$ denklemini çözerken öğrenciler bazen "$z$ saf sanaldır" sonucuna varır. Tam tersi doğrudur: $z = \\bar{z}$ sanal kısmı sıfırlanmaya zorlar, yani $z$ <em>reeldir</em>. (Saf sanal sayılar $z = \\bar{z}$'yi değil, $z = -\\bar{z}$'yi sağlar.)</div>

<div class="l-note"><strong>Hata 5:</strong> karmaşık sayıları $<$ ya da $>$ ile karşılaştırmaya çalışmak. $2 + 3i < 5 - i$ gibi eşitsizlikler anlamsızdır. Karmaşık sayılar, aritmetiğe saygı duyacak şekilde tam olarak sıralanamaz. Yalnızca reel sayılar (ve reel eksende oturan $\\mathbb{C}$ alt kümeleri) anlamlı bir sıralamaya sahiptir.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sanal birim $i$, $i^2 = -1$ ile tanımlanır ve $x^2 + 1 = 0$ problemini çözer</li>
<li>Bir karmaşık sayının biçimi $z = a + bi$, $a, b \\in \\mathbb{R}$; $\\text{Re}(z) = a$, $\\text{Im}(z) = b$</li>
<li>Özel durumlar: reel ($b = 0$), saf sanal ($a = 0$, $b \\neq 0$), sıfır ($a = b = 0$)</li>
<li>$i$'nin kuvvetleri periyot 4 ile döngüseldir: $i, -1, -i, 1, i, -1, \\ldots$; $i^n$'yi $n \\bmod 4$ hesaplayarak indirge</li>
<li>Karmaşık düzlem (Argand diyagramı): $z = a + bi$ ile $(a, b)$ noktası karşılık gelir</li>
<li>Eşitlik: $a + bi = c + di \\iff a = c$ VE $b = d$ — bir karmaşık denklem = iki reel denklem</li>
<li>Eşlenik: $\\bar{z} = a - bi$, $z$'yi reel eksene göre yansıtır; $z$ reeldir $\\iff z = \\bar{z}$</li>
</ul>
</div>`
};
