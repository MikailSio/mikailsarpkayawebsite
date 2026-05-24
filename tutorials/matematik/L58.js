window.LISE_MAT_L58 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Equations with unknowns trapped inside a radical sign, or sitting in an exponent, look intimidating but yield to two simple ideas:</strong> isolate the radical (or the exponential) on one side of the equation, then apply the inverse operation that strips it off. For a square root, the inverse is squaring. For an exponential like $2^x$, the inverse is taking a logarithm — or, when both sides can be written with the same base, equating the exponents directly. The mechanics are short. The discipline of <em>checking your answer afterward</em> is the long part, because squaring is not a one-to-one operation and exponentials carry hidden domain restrictions.</p>

<p class="l-text">By the end of this lesson you will solve a single-radical equation by isolating and squaring, recognise and discard <em>extraneous</em> roots that the squaring step manufactures, handle two-radical equations by isolating and squaring twice, work with cube roots and higher-index radicals, solve same-base exponential equations by reading off the exponents, reduce mixed-base equations like $4^x = 8^{x-1}$ to a common base, use the substitution $u = a^x$ to convert quadratic-in-disguise equations like $9^x - 4 \\cdot 3^x + 3 = 0$ into ordinary quadratics, and know when to reach for a logarithm. Every step is illustrated with a worked example and, where appropriate, a picture of the underlying graphs.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Solve a single-radical equation by isolating the radical and squaring both sides, then verifying each candidate against the original equation</li>
<li>Spot and discard <em>extraneous</em> solutions that the squaring step introduces but the original equation rejects</li>
<li>Handle two-radical equations by isolating one radical, squaring, isolating the remaining radical, and squaring again</li>
<li>Solve higher-index radical equations such as $\\sqrt[3]{2x+1} = 3$ by raising both sides to the matching power</li>
<li>Solve same-base exponential equations by equating exponents: $a^{f(x)} = a^{g(x)} \\Longleftrightarrow f(x) = g(x)$</li>
<li>Reduce different-base equations to a common base when possible, e.g. $4^x = 8^{x-1} \\Longrightarrow 2^{2x} = 2^{3x-3}$</li>
<li>Use the substitution $u = a^x$ to turn quadratic-in-disguise exponentials into ordinary quadratics, then back-substitute</li>
</ul>
</div>

<h2 class="lesson-title">1. The Strategy for Radical Equations</h2>

<div class="calc-highlight"><strong>The recipe in one line:</strong> isolate the radical, raise both sides to the matching power, solve the resulting equation, <em>then check every candidate</em> in the original equation. The check is not optional — squaring (or any even power) is a many-to-one operation, so it can manufacture solutions the original equation does not accept. Those phantoms are called <em>extraneous</em> roots.</div>

<p class="l-text">Why does squaring create phantoms? Because the equations $a = b$ and $a^2 = b^2$ are not logically equivalent — the second is true whenever $a = b$ <em>or</em> $a = -b$. The moment you square both sides of an equation, you also pick up the solutions of the sign-flipped equation, free of charge. After squaring you do not know which group of solutions you have, so you go back to the original equation and test each candidate.</p>

<div class="calc-formula"><div class="formula-label">FIVE-STEP RECIPE FOR SINGLE-RADICAL EQUATIONS</div><div class="formula-main">$$\\text{Isolate the radical} \\;\\to\\; \\text{Square both sides} \\;\\to\\; \\text{Solve} \\;\\to\\; \\text{Check} \\;\\to\\; \\text{Discard extraneous}$$</div><div class="formula-sub">Steps 1 and 2 strip the radical sign. Step 3 is an ordinary algebraic equation. Steps 4 and 5 throw away the phantoms.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Domain restriction</div><div class="card-body">Inside an even-index radical, the expression must be non-negative. For $\\sqrt{x+5}$ you need $x + 5 \\geq 0$, i.e. $x \\geq -5$. Note this <em>before</em> you start; it can save you from chasing phantoms.</div></div>
<div class="calc-card"><div class="card-title">Range of a radical</div><div class="card-body">By convention $\\sqrt{\\cdot}$ denotes the <em>non-negative</em> square root. So the right side of $\\sqrt{x+5} = x - 1$ must also be non-negative: $x - 1 \\geq 0 \\Rightarrow x \\geq 1$. A negative right side immediately disqualifies the candidate.</div></div>
<div class="calc-card"><div class="card-title">Why "isolate first"</div><div class="card-body">If the radical is not alone on one side, squaring will leave a mess (you get cross terms involving the radical again). One radical, alone on one side, gets killed in a single squaring.</div></div>
</div>

<h2 class="lesson-title">2. Worked Example: $\\sqrt{x+5} = x - 1$</h2>

<p class="l-text">A textbook case that displays every step, including a real extraneous root.</p>

<div class="calc-example"><div class="example-label">STEP-BY-STEP</div><div class="example-body"><strong>Step 0 &mdash; domain.</strong> Need $x + 5 \\geq 0$, so $x \\geq -5$. Also the right side must be non-negative, so $x - 1 \\geq 0 \\Rightarrow x \\geq 1$. The combined domain is $x \\geq 1$.<br><br><strong>Step 1 &mdash; isolate.</strong> Already isolated: $\\sqrt{x+5} = x - 1$.<br><br><strong>Step 2 &mdash; square both sides.</strong><br>$\\bigl(\\sqrt{x+5}\\bigr)^2 = (x - 1)^2$<br>$x + 5 = x^2 - 2x + 1$<br><br><strong>Step 3 &mdash; solve.</strong> Move everything to one side:<br>$x^2 - 2x + 1 - x - 5 = 0$<br>$x^2 - 3x - 4 = 0$<br>$(x - 4)(x + 1) = 0$<br>Candidates: $x = 4$ or $x = -1$.<br><br><strong>Step 4 &mdash; check in the ORIGINAL equation.</strong><br>$x = 4$: $\\sqrt{4+5} = \\sqrt{9} = 3$ and $4 - 1 = 3$. ✓ Accepted.<br>$x = -1$: $\\sqrt{-1+5} = \\sqrt{4} = 2$ and $-1 - 1 = -2$. So we would need $2 = -2$. ✗ Rejected.<br><br><strong>Step 5 &mdash; final answer.</strong> Only $x = \\mathbf{4}$. The candidate $x = -1$ is extraneous — it satisfies the squared equation but not the original (it also fails the domain check $x \\geq 1$, since $-1 < 1$).</div></div>

<div class="calc-graph"><div id="plot-l58-rad-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the curve $y = \\sqrt{x+5}$ (blue) and the line $y = x - 1$ (orange). Real solutions of the equation are the $x$-coordinates of intersection points. There is exactly one intersection, at $(4, 3)$. The squared equation also "thinks" $x = -1$ is a solution, but at $x = -1$ the radical gives $+2$ while the line gives $-2$ — the two graphs are nowhere near each other there. The picture makes the extraneous root visible: $x = -1$ is where $y = \\sqrt{x+5}$ meets the reflection $y = -(x - 1)$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=240;i++){var x=-5+i*0.05;xs.push(x);ys.push(Math.sqrt(x+5));}
var rad={x:xs,y:ys,mode:'lines',name:'y = √(x+5)',line:{color:'#3b82f6',width:3}};
var xl=[];var yl=[];for(var j=0;j<=120;j++){var t=-3+j*0.075;xl.push(t);yl.push(t-1);}
var lin={x:xl,y:yl,mode:'lines',name:'y = x − 1',line:{color:'#f59e0b',width:3}};
var hit={x:[4],y:[3],mode:'markers+text',name:'real solution (4, 3)',marker:{color:'#10b981',size:12},text:['(4, 3) ✓'],textposition:'top right',textfont:{color:'#10b981',size:12}};
var ext={x:[-1],y:[2],mode:'markers+text',name:'extraneous (−1, 2)',marker:{color:'#ef4444',size:10,symbol:'x'},text:['extraneous: √ gives +2 but line gives −2'],textposition:'top right',textfont:{color:'#ef4444',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-4,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l58-rad-en',[rad,lin,hit,ext],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Geometric reading of the extraneous root.</strong> Squaring $\\sqrt{x+5} = x - 1$ produces $x + 5 = (x-1)^2$, which also represents $\\sqrt{x+5} = -(x-1) = 1 - x$. The graph $y = 1 - x$ passes through $(-1, 2)$ where it meets $y = \\sqrt{x+5}$. The squared equation cannot tell the two cases apart, so it offers both intersections. The original equation only wants the first.</div>

<h2 class="lesson-title">3. Two Radicals: Isolate Twice</h2>

<div class="calc-highlight"><strong>When the equation contains two radicals, isolate one of them, square once, and you will usually be left with one radical and ordinary terms.</strong> Isolate that surviving radical and square again. After two squarings the equation is rational, and you solve as usual — followed by the obligatory check.</div>

<p class="l-text">A clean example. Solve $\\sqrt{x+1} + \\sqrt{x-4} = 5$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Domain.</strong> Need $x + 1 \\geq 0$ and $x - 4 \\geq 0$, so $x \\geq 4$.<br><br><strong>Step 1 &mdash; isolate one radical.</strong><br>$\\sqrt{x+1} = 5 - \\sqrt{x-4}$<br><br><strong>Step 2 &mdash; square both sides.</strong><br>$(x+1) = 25 - 10\\sqrt{x-4} + (x-4)$<br>$x + 1 = x + 21 - 10\\sqrt{x-4}$<br>$10\\sqrt{x-4} = 20$<br><br><strong>Step 3 &mdash; isolate the surviving radical.</strong><br>$\\sqrt{x-4} = 2$<br><br><strong>Step 4 &mdash; square again.</strong><br>$x - 4 = 4$<br>$x = 8$<br><br><strong>Step 5 &mdash; check.</strong> $\\sqrt{8+1} + \\sqrt{8-4} = \\sqrt{9} + \\sqrt{4} = 3 + 2 = 5$. ✓<br><br>Solution: $x = \\mathbf{8}$.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Why did we choose to move $\\sqrt{x-4}$ across the equals sign before squaring? Because we wanted one radical alone on one side. We could have moved $\\sqrt{x+1}$ instead — the algebra ends up symmetric and the answer is the same. The choice is convenience, not correctness.</div></div>

<h2 class="lesson-title">4. Higher-Index Radicals: $\\sqrt[n]{\\;} \\to$ raise to the $n$-th power</h2>

<div class="calc-highlight"><strong>Cube roots and higher-index roots strip just as easily — you raise both sides to the matching power.</strong> Crucial difference: odd-index radicals like $\\sqrt[3]{\\;}$ are <em>one-to-one</em>, so they never introduce extraneous solutions. The domain restriction also disappears (cube roots of negative numbers exist). You still substitute back to catch arithmetic errors, but you won't lose a candidate to extraneousness.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; CUBE ROOT</div><div class="example-body">Solve $\\sqrt[3]{2x + 1} = 3$.<br><br><strong>Step 1.</strong> Already isolated.<br><br><strong>Step 2 &mdash; cube both sides.</strong><br>$\\bigl(\\sqrt[3]{2x+1}\\bigr)^3 = 3^3$<br>$2x + 1 = 27$<br><br><strong>Step 3 &mdash; solve.</strong><br>$2x = 26 \\Rightarrow x = \\mathbf{13}$.<br><br><strong>Check.</strong> $\\sqrt[3]{2 \\cdot 13 + 1} = \\sqrt[3]{27} = 3$. ✓ No extraneous root to discard.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Even-index radicals ($\\sqrt{\\;}, \\sqrt[4]{\\;}, \\ldots$)</div><div class="card-body">Domain: radicand $\\geq 0$. Range: result $\\geq 0$. Squaring (or fourth-powering) is many-to-one — always check.</div></div>
<div class="calc-card"><div class="card-title">Odd-index radicals ($\\sqrt[3]{\\;}, \\sqrt[5]{\\;}, \\ldots$)</div><div class="card-body">Domain: all real numbers. Range: all real numbers. Cubing is one-to-one — no extraneous roots are manufactured, though you should still verify the arithmetic.</div></div>
<div class="calc-card"><div class="card-title">General rule</div><div class="card-body">$\\sqrt[n]{A} = B \\;\\Longrightarrow\\; A = B^n$. The direction $\\Rightarrow$ is always safe; the converse $\\Leftarrow$ requires $B \\geq 0$ when $n$ is even.</div></div>
</div>

<h2 class="lesson-title">5. Common Errors in Radical Equations</h2>

<p class="l-text">Three mistakes account for almost every wrong answer on a radical problem.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">MISTAKE 1: NO CHECK</div><div class="compare-item">You solve the squared equation, find two candidates, and write both as the answer.</div><div class="compare-item">Fix: always substitute every candidate back into the <em>original</em> equation. Discard whichever fails.</div></div><div class="compare-col"><div class="compare-title">MISTAKE 2: SQUARE WITHOUT ISOLATING</div><div class="compare-item">From $\\sqrt{x+5} + 3 = x$ you square as is, getting $x + 5 + 6\\sqrt{x+5} + 9 = x^2$ — a mess that still contains a radical.</div><div class="compare-item">Fix: isolate the radical first. $\\sqrt{x+5} = x - 3$, <em>then</em> square.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">MISTAKE 3: SIGN FLIP ON SQUARING</div><div class="compare-item">From $\\sqrt{x+5} = x - 1$ you square the right side as $x^2 - 1$ instead of $(x - 1)^2 = x^2 - 2x + 1$.</div><div class="compare-item">Fix: $(a - b)^2 = a^2 - 2ab + b^2$ — never $a^2 - b^2$. Take the middle term seriously.</div></div><div class="compare-col"><div class="compare-title">MISTAKE 4: FORGOTTEN DOMAIN</div><div class="compare-item">You accept a candidate even though it lies outside the domain of the original radical (e.g. it makes the radicand negative).</div><div class="compare-item">Fix: write down the domain before you start, and intersect with your candidate set at the end.</div></div></div>

<h2 class="lesson-title">6. The Strategy for Exponential Equations</h2>

<div class="calc-highlight"><strong>An exponential equation has the unknown sitting in the exponent.</strong> Two situations are common at the high-school level. (i) Both sides can be written with the same base — then equate the exponents and solve. (ii) The equation is quadratic in disguise (say in $u = 2^x$) — substitute, solve the quadratic, back-substitute. When neither works, you have to take a logarithm, which we cover briefly in section 9.</div>

<div class="calc-formula"><div class="formula-label">SAME-BASE RULE</div><div class="formula-main">$$a^{f(x)} \\;=\\; a^{g(x)} \\quad\\Longleftrightarrow\\quad f(x) \\;=\\; g(x) \\qquad (a > 0,\\; a \\neq 1)$$</div><div class="formula-sub">The exponential function $y = a^x$ is one-to-one when $a > 0, a \\neq 1$ — different exponents give different values. So if two exponentials with the same base are equal, the exponents must be equal. No extraneous roots, no domain issues.</div></div>

<div class="calc-example"><div class="example-label">DIRECT SAME-BASE</div><div class="example-body">Solve $2^{x+1} = 2^{3x - 1}$.<br><br>Bases are already equal. Equate exponents:<br>$x + 1 = 3x - 1 \\;\\Rightarrow\\; 2 = 2x \\;\\Rightarrow\\; x = \\mathbf{1}$.<br><br>Check: $2^{1+1} = 4$ and $2^{3 \\cdot 1 - 1} = 2^2 = 4$. ✓</div></div>

<h2 class="lesson-title">7. Reducing to a Common Base</h2>

<div class="calc-highlight"><strong>When the bases are different but are powers of the same number, rewrite both sides as powers of that common base.</strong> Then the same-base rule applies. Powers of 2 are especially common: $4 = 2^2$, $8 = 2^3$, $16 = 2^4$, $32 = 2^5$, $\\tfrac{1}{2} = 2^{-1}$, $\\tfrac{1}{4} = 2^{-2}$, and so on. Memorise the first six and you can rewrite almost any high-school exam equation by inspection.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; POWERS OF 2</div><div class="example-body">Solve $4^x = 8^{x - 1}$.<br><br><strong>Step 1 &mdash; rewrite both sides as powers of 2.</strong><br>$4^x = (2^2)^x = 2^{2x}$<br>$8^{x-1} = (2^3)^{x-1} = 2^{3x - 3}$<br><br><strong>Step 2 &mdash; equate exponents.</strong><br>$2x = 3x - 3$<br><br><strong>Step 3 &mdash; solve.</strong><br>$3 = x \\;\\Rightarrow\\; x = \\mathbf{3}$.<br><br><strong>Check.</strong> $4^3 = 64$ and $8^{3-1} = 8^2 = 64$. ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; POWERS OF 3</div><div class="example-body">Solve $27^{x+1} = 9^{2x}$.<br><br>$27 = 3^3$ and $9 = 3^2$. So:<br>$3^{3(x+1)} = 3^{2 \\cdot 2x}$<br>$3(x+1) = 4x$<br>$3x + 3 = 4x \\;\\Rightarrow\\; x = \\mathbf{3}$.<br><br>Check: $27^4 = 531\\,441$ and $9^6 = 531\\,441$. ✓</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Negative exponents</div><div class="card-body">$\\tfrac{1}{a^n} = a^{-n}$. So $\\tfrac{1}{8} = 2^{-3}$ and an equation like $2^x = \\tfrac{1}{8}$ becomes $2^x = 2^{-3} \\Rightarrow x = -3$.</div></div>
<div class="calc-card"><div class="card-title">Fractional bases</div><div class="card-body">$(1/2)^x = 2^{-x}$, $(1/3)^x = 3^{-x}$. Any fraction whose numerator is 1 can be flipped at the cost of a sign on the exponent.</div></div>
<div class="calc-card"><div class="card-title">When bases share no common base</div><div class="card-body">If you cannot write both sides as powers of one number (e.g. $2^x = 3$), no algebraic trick will solve it cleanly — reach for a logarithm. See section 9.</div></div>
</div>

<h2 class="lesson-title">8. The Comparison Plot: Different Exponential Bases</h2>

<div class="calc-graph"><div id="plot-l58-exp-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three exponential curves $y = 2^x$ (blue), $y = 3^x$ (orange), $y = (1/2)^x$ (red). All three pass through $(0, 1)$ because any non-zero base raised to the zero is 1. For positive $x$, the curve with the bigger base climbs faster: $3^x > 2^x$ once $x > 0$. For negative $x$ the order flips — $(1/2)^x = 2^{-x}$ is the mirror of $2^x$ across the $y$-axis, so it dies out for positive $x$ and explodes for negative $x$. The intersection at $(0, 1)$ is the only point where all three agree.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y2=[];var y3=[];var yh=[];for(var i=0;i<=160;i++){var x=-3+i*0.05;xs.push(x);y2.push(Math.pow(2,x));y3.push(Math.pow(3,x));yh.push(Math.pow(0.5,x));}
var t2={x:xs,y:y2,mode:'lines',name:'y = 2^x',line:{color:'#3b82f6',width:3}};
var t3={x:xs,y:y3,mode:'lines',name:'y = 3^x',line:{color:'#f59e0b',width:3}};
var th={x:xs,y:yh,mode:'lines',name:'y = (1/2)^x',line:{color:'#ef4444',width:3}};
var hub={x:[0],y:[1],mode:'markers+text',name:'all pass (0,1)',marker:{color:'#10b981',size:10},text:['(0, 1)'],textposition:'top right',textfont:{color:'#10b981',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[0,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l58-exp-en',[t2,t3,th,hub],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Reading the picture for equations.</strong> Solving $2^x = 8$ graphically means finding where the blue curve crosses the horizontal line $y = 8$. It happens at $x = 3$, matching the algebraic $2^x = 2^3$. Solving $2^x = 3^x$ asks where the blue and orange curves meet — only at $x = 0$, because the curves agree only at the shared point $(0, 1)$.</div>

<h2 class="lesson-title">9. Logarithmic Preview: When No Common Base Exists</h2>

<div class="calc-highlight"><strong>When the two sides cannot be written with the same base, take a logarithm of both sides.</strong> This collapses the unknown out of the exponent and into a coefficient, where ordinary algebra can finish the job. We will treat logarithms in depth in a separate lesson; here is just enough to handle the leftover cases.</div>

<div class="calc-formula"><div class="formula-label">SOLVING $a^x = b$ BY LOGARITHM</div><div class="formula-main">$$a^x = b \\quad\\Longrightarrow\\quad x = \\frac{\\log b}{\\log a} \\qquad (a > 0,\\; a \\neq 1,\\; b > 0)$$</div><div class="formula-sub">Take $\\log$ of both sides, then use $\\log(a^x) = x \\log a$. The choice of base inside the log does not matter — natural log $\\ln$, common log $\\log_{10}$, anything works, as long as both numerator and denominator use the same base.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Solve $2^x = 7$.<br><br>$2$ is not a power of $7$ and vice versa — no common base. Take $\\log_{10}$ of both sides:<br>$x \\log 2 = \\log 7$<br>$x = \\dfrac{\\log 7}{\\log 2} \\approx \\dfrac{0.8451}{0.3010} \\approx \\mathbf{2.807}$.<br><br>Quick sanity: $2^2 = 4$ and $2^3 = 8$, so the answer should sit between 2 and 3, closer to 3. The decimal $2.807$ is in that band. ✓</div></div>

<h2 class="lesson-title">10. Substitution: Quadratics in Disguise</h2>

<div class="calc-highlight"><strong>An equation that looks like $A \\cdot (a^x)^2 + B \\cdot a^x + C = 0$ is a quadratic in the variable $u = a^x$.</strong> Substitute, solve the quadratic for $u$, then back-substitute $a^x = u$ and solve for $x$ — usually by the same-base rule, occasionally by a logarithm. Discard any negative $u$ (an exponential is never negative).</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; BASE 3</div><div class="example-body">Solve $9^x - 4 \\cdot 3^x + 3 = 0$.<br><br><strong>Step 1 &mdash; spot the pattern.</strong> $9^x = (3^2)^x = (3^x)^2$. Let $u = 3^x$, so $9^x = u^2$.<br><br><strong>Step 2 &mdash; substitute.</strong><br>$u^2 - 4u + 3 = 0$<br>$(u - 1)(u - 3) = 0 \\;\\Rightarrow\\; u = 1 \\text{ or } u = 3$.<br><br><strong>Step 3 &mdash; back-substitute.</strong><br>$3^x = 1 \\;\\Rightarrow\\; 3^x = 3^0 \\;\\Rightarrow\\; x = 0$.<br>$3^x = 3 \\;\\Rightarrow\\; 3^x = 3^1 \\;\\Rightarrow\\; x = 1$.<br><br><strong>Solutions:</strong> $x = \\mathbf{0}$ or $x = \\mathbf{1}$.<br><br><strong>Check.</strong> At $x = 0$: $9^0 - 4 \\cdot 3^0 + 3 = 1 - 4 + 3 = 0$. ✓. At $x = 1$: $9 - 12 + 3 = 0$. ✓</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; BASE 2</div><div class="example-body">Solve $2^{2x} - 5 \\cdot 2^x + 4 = 0$.<br><br>Note $2^{2x} = (2^x)^2$. Let $u = 2^x$.<br><br>$u^2 - 5u + 4 = 0$<br>$(u - 1)(u - 4) = 0 \\;\\Rightarrow\\; u = 1 \\text{ or } u = 4$.<br><br>$2^x = 1 \\;\\Rightarrow\\; x = 0$. $2^x = 4 = 2^2 \\;\\Rightarrow\\; x = 2$.<br><br><strong>Solutions:</strong> $x = \\mathbf{0}$ or $x = \\mathbf{2}$.</div></div>

<div class="calc-graph"><div id="plot-l58-sub-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $f(x) = 9^x - 4 \\cdot 3^x + 3$. Real solutions of $f(x) = 0$ are the $x$-axis crossings. The curve dips below zero between two roots and crosses the axis at exactly the two points predicted by the substitution: $x = 0$ (where $3^x = 1$) and $x = 1$ (where $3^x = 3$). The shape is the image of an upward parabola $u^2 - 4u + 3$ under the substitution $u = 3^x$ — both roots of the parabola are positive, so both back-substitute into real exponential equations.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=-0.5+i*0.012;xs.push(x);ys.push(Math.pow(9,x)-4*Math.pow(3,x)+3);}
var fcurve={x:xs,y:ys,mode:'lines',name:'f(x) = 9^x − 4·3^x + 3',line:{color:'#3b82f6',width:3}};
var zeros={x:[0,1],y:[0,0],mode:'markers+text',name:'zeros',marker:{color:'#10b981',size:11},text:['x = 0','x = 1'],textposition:'bottom right',textfont:{color:'#10b981',size:12}};
var axis={x:[-0.6,2.1],y:[0,0],mode:'lines',name:'y = 0',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dot'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-1.5,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l58-sub-en',[fcurve,axis,zeros],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why discard negative $u$.</strong> The substitution $u = a^x$ with $a > 0$ gives $u > 0$ always — an exponential is never zero and never negative. If your quadratic for $u$ produces a negative root, that root has no real $x$ behind it and must be thrown out. Check both roots before back-substituting.</div>

<h2 class="lesson-title">11. Practice Problems</h2>

<p class="l-text">Eight exercises, one per technique. Try each before reading the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; SINGLE RADICAL</div><div class="example-body"><strong>Solve</strong> $\\sqrt{2x + 3} = x$.<br><br>Domain: $2x + 3 \\geq 0 \\Rightarrow x \\geq -\\tfrac{3}{2}$, and right side $\\geq 0 \\Rightarrow x \\geq 0$.<br>Square: $2x + 3 = x^2 \\Rightarrow x^2 - 2x - 3 = 0 \\Rightarrow (x - 3)(x + 1) = 0$.<br>Candidates: $x = 3$ or $x = -1$.<br>Check: $x = 3$: $\\sqrt{9} = 3$. ✓. $x = -1$: fails $x \\geq 0$ — extraneous.<br>Answer: $x = \\mathbf{3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; TWO RADICALS</div><div class="example-body"><strong>Solve</strong> $\\sqrt{x + 8} - \\sqrt{x - 4} = 2$.<br><br>Domain: $x \\geq 4$. Isolate one radical: $\\sqrt{x+8} = 2 + \\sqrt{x-4}$.<br>Square: $x + 8 = 4 + 4\\sqrt{x-4} + (x-4) = x + 4\\sqrt{x-4}$.<br>Isolate: $4\\sqrt{x-4} = 8 \\Rightarrow \\sqrt{x-4} = 2 \\Rightarrow x - 4 = 4 \\Rightarrow x = 8$.<br>Check: $\\sqrt{16} - \\sqrt{4} = 4 - 2 = 2$. ✓<br>Answer: $x = \\mathbf{8}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; CUBE ROOT</div><div class="example-body"><strong>Solve</strong> $\\sqrt[3]{3x - 2} = 4$.<br><br>Cube: $3x - 2 = 64 \\Rightarrow 3x = 66 \\Rightarrow x = \\mathbf{22}$. Check: $\\sqrt[3]{64} = 4$. ✓ No extraneous risk (odd index).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SAME-BASE EXPONENTIAL</div><div class="example-body"><strong>Solve</strong> $5^{2x - 1} = 5^{x + 4}$.<br><br>Equate exponents: $2x - 1 = x + 4 \\Rightarrow x = \\mathbf{5}$.<br>Check: $5^{9} = 5^{9}$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; COMMON BASE</div><div class="example-body"><strong>Solve</strong> $25^{x} = \\tfrac{1}{125}$.<br><br>Rewrite: $25 = 5^2$, $\\tfrac{1}{125} = 5^{-3}$. So $5^{2x} = 5^{-3} \\Rightarrow 2x = -3 \\Rightarrow x = \\mathbf{-\\tfrac{3}{2}}$.<br>Check: $25^{-3/2} = (25^{1/2})^{-3} = 5^{-3} = \\tfrac{1}{125}$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; SUBSTITUTION (BASE 3)</div><div class="example-body"><strong>Solve</strong> $9^x - 12 \\cdot 3^x + 27 = 0$.<br><br>Let $u = 3^x$. Then $u^2 - 12u + 27 = 0 \\Rightarrow (u - 3)(u - 9) = 0 \\Rightarrow u = 3$ or $u = 9$.<br>Back-substitute: $3^x = 3 \\Rightarrow x = 1$; $3^x = 9 = 3^2 \\Rightarrow x = 2$.<br><strong>Solutions:</strong> $x = \\mathbf{1}$ or $x = \\mathbf{2}$.<br>Check $x = 2$: $81 - 12 \\cdot 9 + 27 = 81 - 108 + 27 = 0$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; SUBSTITUTION (BASE 2)</div><div class="example-body"><strong>Solve</strong> $4^x - 6 \\cdot 2^x + 8 = 0$.<br><br>$4^x = (2^x)^2$. Let $u = 2^x$. Then $u^2 - 6u + 8 = 0 \\Rightarrow (u - 2)(u - 4) = 0 \\Rightarrow u = 2$ or $u = 4$.<br>$2^x = 2 \\Rightarrow x = 1$; $2^x = 4 \\Rightarrow x = 2$.<br><strong>Solutions:</strong> $x = \\mathbf{1}$ or $x = \\mathbf{2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; MIXED (RADICAL TO POWER)</div><div class="example-body"><strong>Solve</strong> $\\sqrt{3x + 1} = x - 1$.<br><br>Domain: $3x + 1 \\geq 0 \\Rightarrow x \\geq -\\tfrac{1}{3}$, and right side $\\geq 0 \\Rightarrow x \\geq 1$.<br>Square: $3x + 1 = (x - 1)^2 = x^2 - 2x + 1 \\Rightarrow x^2 - 5x = 0 \\Rightarrow x(x - 5) = 0$.<br>Candidates: $x = 0$ or $x = 5$.<br>Check: $x = 0$ fails $x \\geq 1$ — extraneous. $x = 5$: $\\sqrt{16} = 4$ and $5 - 1 = 4$. ✓<br>Answer: $x = \\mathbf{5}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Radical equations: isolate the radical, raise to the matching power, solve, <em>check every candidate</em>, discard extraneous roots</li>
<li>Two radicals: isolate one, square, isolate the other, square again — then check</li>
<li>Cube roots and odd-index radicals are one-to-one and do not manufacture extraneous solutions; still verify arithmetic</li>
<li>Same-base exponentials: $a^{f(x)} = a^{g(x)} \\Leftrightarrow f(x) = g(x)$ (for $a > 0, a \\neq 1$)</li>
<li>Different bases: rewrite as powers of a common base when possible ($4 = 2^2$, $9 = 3^2$, etc.) — then equate exponents</li>
<li>Quadratics in disguise: substitute $u = a^x$, solve the quadratic, back-substitute. Discard non-positive $u$</li>
<li>When no common base exists, take a logarithm of both sides — full treatment in a later lesson</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bilinmeyenin bir kök işaretinin içine ya da bir üssün içine sıkıştığı denklemler ürkütücü görünür ama iki basit fikre boyun eğer:</strong> kökü (ya da üsteli) denklemin bir yanında yalnız bırak, sonra onu söken ters işlemi uygula. Karekök için ters işlem kareye almadır. $2^x$ gibi bir üstel için ters işlem logaritma almaktır — ya da her iki yan aynı tabana yazılabiliyorsa, üsleri doğrudan eşitlemektir. Mekanik kısa. Uzun olan, sonradan <em>cevabını denetleme</em> disiplinidir; çünkü kareye alma birebir bir işlem değildir ve üsteller gizli tanım kümesi kısıtlamaları taşır.</p>

<p class="l-text">Bu dersin sonunda tek kökü olan bir denklemi kökü yalnız bırakıp kareye alarak çözebileceksin, kareye alma adımının üreteceği <em>yabancı</em> kökleri tanıyıp atabileceksin, iki köklü denklemleri bir kökü yalnız bırakıp iki kez kareye alarak çözebileceksin, küp kökleri ve daha yüksek indeksli kökleri eşleşen kuvvete yükselterek çözebileceksin, aynı tabanlı üstel denklemleri üsleri okuyarak çözebileceksin, $4^x = 8^{x-1}$ gibi karışık tabanlı denklemleri olabildiğinde ortak tabana indirgeyebileceksin, $9^x - 4 \\cdot 3^x + 3 = 0$ gibi kılık değiştirmiş ikinci dereceden denklemleri $u = a^x$ ikamesiyle sıradan ikinci dereceden denklemlere çevirebileceksin ve ne zaman logaritmaya başvuracağını bileceksin. Her adım, çözümlü bir örnekle ve gerektiğinde temel grafiklerin bir resmiyle gösterilir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tek köklü bir denklemi kökü yalnız bırakıp iki yanın karesini alarak çözmeyi ve her adayı orijinal denkleme yerleştirip doğrulamayı</li>
<li>Kareye alma adımının ortaya çıkardığı ama orijinal denklemin reddettiği <em>yabancı</em> çözümleri ayırt edip atmayı</li>
<li>İki köklü denklemleri bir kökü yalnız bırakıp kareye alarak, sonra kalan kökü yalnız bırakıp tekrar kareye alarak çözmeyi</li>
<li>$\\sqrt[3]{2x+1} = 3$ gibi daha yüksek indeksli kök denklemlerini iki yanı eşleşen kuvvete yükselterek çözmeyi</li>
<li>Aynı tabanlı üstel denklemleri üsleri eşitleyerek çözmeyi: $a^{f(x)} = a^{g(x)} \\Longleftrightarrow f(x) = g(x)$</li>
<li>Mümkün olduğunda farklı tabanlı denklemleri ortak tabana indirgemeyi, örn. $4^x = 8^{x-1} \\Longrightarrow 2^{2x} = 2^{3x-3}$</li>
<li>Kılık değiştirmiş ikinci dereceden üstelleri sıradan ikinci dereceden denklemlere çevirmek için $u = a^x$ ikamesini kullanmayı, sonra geri yerine koymayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Köklü Denklemler İçin Strateji</h2>

<div class="calc-highlight"><strong>Tek satırlık tarif:</strong> kökü yalnız bırak, iki yanı eşleşen kuvvete yükselt, ortaya çıkan denklemi çöz ve <em>sonra her adayı</em> orijinal denkleme yerleştirip kontrol et. Denetim isteğe bağlı değildir — kareye alma (ya da herhangi bir çift kuvvet) çoktan-bire bir işlemdir, dolayısıyla orijinal denklemin kabul etmediği çözümler üretebilir. Bu hayaletlere <em>yabancı</em> kökler denir.</div>

<p class="l-text">Kareye alma neden hayalet üretir? Çünkü $a = b$ ve $a^2 = b^2$ denklemleri mantıksal olarak eşdeğer değildir — ikincisi $a = b$ <em>ya da</em> $a = -b$ olduğunda doğrudur. Bir denklemin iki yanının karesini aldığın anda, işaret değiştirilmiş denklemin çözümlerini de bedavadan toplarsın. Kareye aldıktan sonra hangi grup çözümle uğraştığını bilmezsin, bu yüzden orijinal denkleme geri döner ve her adayı test edersin.</p>

<div class="calc-formula"><div class="formula-label">TEK KÖKLÜ DENKLEMLER İÇİN BEŞ ADIMLI TARİF</div><div class="formula-main">$$\\text{Kökü yalnız bırak} \\;\\to\\; \\text{İki yanı kareye al} \\;\\to\\; \\text{Çöz} \\;\\to\\; \\text{Kontrol et} \\;\\to\\; \\text{Yabancı kökleri at}$$</div><div class="formula-sub">1. ve 2. adım kök işaretini söker. 3. adım sıradan bir cebir denklemidir. 4. ve 5. adım hayaletleri atar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tanım kümesi kısıtlaması</div><div class="card-body">Çift indeksli bir kökün içindeki ifade negatif olmamalıdır. $\\sqrt{x+5}$ için $x + 5 \\geq 0$, yani $x \\geq -5$ olması gerekir. Başlamadan <em>önce</em> bunu not et; seni hayalet kovalamaktan kurtarabilir.</div></div>
<div class="calc-card"><div class="card-title">Bir kökün değer kümesi</div><div class="card-body">Geleneksel olarak $\\sqrt{\\cdot}$ <em>negatif olmayan</em> karekökü gösterir. Bu nedenle $\\sqrt{x+5} = x - 1$ denkleminin sağ tarafı da negatif olmamalıdır: $x - 1 \\geq 0 \\Rightarrow x \\geq 1$. Negatif bir sağ taraf adayı anında diskalifiye eder.</div></div>
<div class="calc-card"><div class="card-title">Neden "önce yalnız bırak"</div><div class="card-body">Kök bir yanda yalnız değilse, kareye alma karmaşıklık bırakır (yine kökü içeren çapraz terimler alırsın). Bir tek kök, bir yanda yalnızken, tek bir kareye almayla yok edilir.</div></div>
</div>

<h2 class="lesson-title">2. Çözümlü Örnek: $\\sqrt{x+5} = x - 1$</h2>

<p class="l-text">Gerçek bir yabancı kök dahil her adımı gösteren ders kitabı vakası.</p>

<div class="calc-example"><div class="example-label">ADIM ADIM</div><div class="example-body"><strong>Adım 0 &mdash; tanım kümesi.</strong> $x + 5 \\geq 0$, yani $x \\geq -5$ olmalı. Ayrıca sağ taraf negatif olmamalı: $x - 1 \\geq 0 \\Rightarrow x \\geq 1$. Birleşik tanım kümesi $x \\geq 1$.<br><br><strong>Adım 1 &mdash; yalnız bırak.</strong> Zaten yalnız: $\\sqrt{x+5} = x - 1$.<br><br><strong>Adım 2 &mdash; iki yanı kareye al.</strong><br>$\\bigl(\\sqrt{x+5}\\bigr)^2 = (x - 1)^2$<br>$x + 5 = x^2 - 2x + 1$<br><br><strong>Adım 3 &mdash; çöz.</strong> Her şeyi tek yana taşı:<br>$x^2 - 2x + 1 - x - 5 = 0$<br>$x^2 - 3x - 4 = 0$<br>$(x - 4)(x + 1) = 0$<br>Adaylar: $x = 4$ ya da $x = -1$.<br><br><strong>Adım 4 &mdash; ORİJİNAL denklemde kontrol et.</strong><br>$x = 4$: $\\sqrt{4+5} = \\sqrt{9} = 3$ ve $4 - 1 = 3$. ✓ Kabul.<br>$x = -1$: $\\sqrt{-1+5} = \\sqrt{4} = 2$ ve $-1 - 1 = -2$. $2 = -2$ olmalı. ✗ Red.<br><br><strong>Adım 5 &mdash; son cevap.</strong> Yalnızca $x = \\mathbf{4}$. Aday $x = -1$ yabancıdır — kareye alınmış denklemi sağlar ama orijinali sağlamaz (ayrıca $x \\geq 1$ tanım kümesi kontrolünü de geçemez, çünkü $-1 < 1$).</div></div>

<div class="calc-graph"><div id="plot-l58-rad-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $y = \\sqrt{x+5}$ eğrisi (mavi) ve $y = x - 1$ doğrusu (turuncu). Denklemin gerçek çözümleri kesişim noktalarının $x$-koordinatlarıdır. Tam bir kesişim var, $(4, 3)$ noktasında. Kareye alınmış denklem $x = -1$'i de "çözüm sanır", ama $x = -1$'de kök $+2$, doğru ise $-2$ verir — iki grafik orada hiçbir yerde yan yana değildir. Resim yabancı kökü görünür kılar: $x = -1$, $y = \\sqrt{x+5}$ ile $y = -(x - 1)$ yansımasının buluştuğu yerdir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=240;i++){var x=-5+i*0.05;xs.push(x);ys.push(Math.sqrt(x+5));}
var rad={x:xs,y:ys,mode:'lines',name:'y = √(x+5)',line:{color:'#3b82f6',width:3}};
var xl=[];var yl=[];for(var j=0;j<=120;j++){var t=-3+j*0.075;xl.push(t);yl.push(t-1);}
var lin={x:xl,y:yl,mode:'lines',name:'y = x − 1',line:{color:'#f59e0b',width:3}};
var hit={x:[4],y:[3],mode:'markers+text',name:'gerçek çözüm (4, 3)',marker:{color:'#10b981',size:12},text:['(4, 3) ✓'],textposition:'top right',textfont:{color:'#10b981',size:12}};
var ext={x:[-1],y:[2],mode:'markers+text',name:'yabancı (−1, 2)',marker:{color:'#ef4444',size:10,symbol:'x'},text:['yabancı: √ +2 verir ama doğru −2 verir'],textposition:'top right',textfont:{color:'#ef4444',size:11}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-6,7],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[-4,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l58-rad-tr',[rad,lin,hit,ext],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Yabancı kökün geometrik okunuşu.</strong> $\\sqrt{x+5} = x - 1$ ifadesini kareye almak $x + 5 = (x-1)^2$ üretir; bu da $\\sqrt{x+5} = -(x-1) = 1 - x$ denklemini temsil eder. $y = 1 - x$ grafiği $(-1, 2)$ noktasından geçer, orada $y = \\sqrt{x+5}$ ile buluşur. Kareye alınmış denklem iki durumu birbirinden ayıramaz, dolayısıyla her iki kesişimi de sunar. Orijinal denklem yalnızca ilkini ister.</div>

<h2 class="lesson-title">3. İki Kök: İki Kez Yalnız Bırak</h2>

<div class="calc-highlight"><strong>Denklem iki kök içeriyorsa, birini yalnız bırak, bir kez kareye al — genellikle geriye bir kök ve sıradan terimler kalır.</strong> O hayatta kalan kökü de yalnız bırak ve yeniden kareye al. İki kareye almadan sonra denklem rasyoneldir ve her zamanki gibi çözersin — ardından zorunlu denetim gelir.</div>

<p class="l-text">Temiz bir örnek. $\\sqrt{x+1} + \\sqrt{x-4} = 5$ denklemini çöz.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Tanım kümesi.</strong> $x + 1 \\geq 0$ ve $x - 4 \\geq 0$ olmalı, yani $x \\geq 4$.<br><br><strong>Adım 1 &mdash; bir kökü yalnız bırak.</strong><br>$\\sqrt{x+1} = 5 - \\sqrt{x-4}$<br><br><strong>Adım 2 &mdash; iki yanı kareye al.</strong><br>$(x+1) = 25 - 10\\sqrt{x-4} + (x-4)$<br>$x + 1 = x + 21 - 10\\sqrt{x-4}$<br>$10\\sqrt{x-4} = 20$<br><br><strong>Adım 3 &mdash; hayatta kalan kökü yalnız bırak.</strong><br>$\\sqrt{x-4} = 2$<br><br><strong>Adım 4 &mdash; tekrar kareye al.</strong><br>$x - 4 = 4$<br>$x = 8$<br><br><strong>Adım 5 &mdash; kontrol.</strong> $\\sqrt{8+1} + \\sqrt{8-4} = \\sqrt{9} + \\sqrt{4} = 3 + 2 = 5$. ✓<br><br>Çözüm: $x = \\mathbf{8}$.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Neden kareye almadan önce $\\sqrt{x-4}$'ü eşittirin diğer yanına geçirdik? Çünkü bir yanda tek bir kök istiyorduk. $\\sqrt{x+1}$'i taşıyabilirdik — cebir simetrik biter ve cevap aynıdır. Seçim doğruluk değil, kolaylık meselesidir.</div></div>

<h2 class="lesson-title">4. Daha Yüksek İndeksli Kökler: $\\sqrt[n]{\\;} \\to$ $n$-inci kuvvete yükselt</h2>

<div class="calc-highlight"><strong>Küp kökler ve daha yüksek indeksli kökler de aynı kolaylıkla sökülür — iki yanı eşleşen kuvvete yükseltirsin.</strong> Kritik fark: $\\sqrt[3]{\\;}$ gibi tek indeksli kökler <em>birebirdir</em>, yani asla yabancı çözüm üretmezler. Tanım kümesi kısıtlaması da ortadan kalkar (negatif sayıların küp kökleri vardır). Yine de aritmetik hatalarını yakalamak için geri yerleştirme yaparsın, ama yabancılık nedeniyle bir adayı kaybetmezsin.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; KÜP KÖK</div><div class="example-body">$\\sqrt[3]{2x + 1} = 3$ denklemini çöz.<br><br><strong>Adım 1.</strong> Zaten yalnız.<br><br><strong>Adım 2 &mdash; iki yanın küpünü al.</strong><br>$\\bigl(\\sqrt[3]{2x+1}\\bigr)^3 = 3^3$<br>$2x + 1 = 27$<br><br><strong>Adım 3 &mdash; çöz.</strong><br>$2x = 26 \\Rightarrow x = \\mathbf{13}$.<br><br><strong>Kontrol.</strong> $\\sqrt[3]{2 \\cdot 13 + 1} = \\sqrt[3]{27} = 3$. ✓ Atılacak yabancı kök yok.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çift indeksli kökler ($\\sqrt{\\;}, \\sqrt[4]{\\;}, \\ldots$)</div><div class="card-body">Tanım kümesi: kök içi $\\geq 0$. Değer kümesi: sonuç $\\geq 0$. Kareye alma (ya da 4. kuvvete alma) çoktan-biredir — her zaman kontrol et.</div></div>
<div class="calc-card"><div class="card-title">Tek indeksli kökler ($\\sqrt[3]{\\;}, \\sqrt[5]{\\;}, \\ldots$)</div><div class="card-body">Tanım kümesi: tüm reel sayılar. Değer kümesi: tüm reel sayılar. Küp alma birebirdir — yabancı kök üretmez, yine de aritmetiği doğrulamalısın.</div></div>
<div class="calc-card"><div class="card-title">Genel kural</div><div class="card-body">$\\sqrt[n]{A} = B \\;\\Longrightarrow\\; A = B^n$. $\\Rightarrow$ yönü her zaman güvenlidir; ters yön $\\Leftarrow$, $n$ çift olduğunda $B \\geq 0$ gerektirir.</div></div>
</div>

<h2 class="lesson-title">5. Köklü Denklemlerde Sık Yapılan Hatalar</h2>

<p class="l-text">Üç hata, köklü problemlerdeki yanlış cevapların neredeyse tamamından sorumludur.</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA 1: KONTROL YOK</div><div class="compare-item">Kareye alınmış denklemi çözer, iki aday bulur ve ikisini de cevap olarak yazarsın.</div><div class="compare-item">Çözüm: her adayı her zaman <em>orijinal</em> denkleme yerleştir. Hangisi başarısız olursa onu at.</div></div><div class="compare-col"><div class="compare-title">HATA 2: YALNIZ BIRAKMADAN KAREYE ALMA</div><div class="compare-item">$\\sqrt{x+5} + 3 = x$ denklemini olduğu gibi kareye alır, $x + 5 + 6\\sqrt{x+5} + 9 = x^2$ elde edersin — hâlâ kök içeren bir karmaşa.</div><div class="compare-item">Çözüm: önce kökü yalnız bırak. $\\sqrt{x+5} = x - 3$, <em>sonra</em> kareye al.</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">HATA 3: KAREYE ALMADA İŞARET HATASI</div><div class="compare-item">$\\sqrt{x+5} = x - 1$'den sağ tarafı $(x - 1)^2 = x^2 - 2x + 1$ yerine $x^2 - 1$ olarak kareye alırsın.</div><div class="compare-item">Çözüm: $(a - b)^2 = a^2 - 2ab + b^2$ — asla $a^2 - b^2$. Orta terimi ciddiye al.</div></div><div class="compare-col"><div class="compare-title">HATA 4: UNUTULAN TANIM KÜMESİ</div><div class="compare-item">Orijinal kökün tanım kümesi dışında kalmasına rağmen (örneğin kök içini negatif yapsa bile) bir adayı kabul edersin.</div><div class="compare-item">Çözüm: başlamadan önce tanım kümesini yaz ve sonunda aday kümenle kesiştir.</div></div></div>

<h2 class="lesson-title">6. Üstel Denklemler İçin Strateji</h2>

<div class="calc-highlight"><strong>Bir üstel denklemde bilinmeyen üssün içinde oturur.</strong> Lise düzeyinde iki durum yaygındır. (i) İki yan aynı tabanla yazılabilir — o zaman üsleri eşitle ve çöz. (ii) Denklem kılık değiştirmiş ikinci dereceden bir denklemdir (diyelim $u = 2^x$'te) — ikame et, ikinci dereceden denklemi çöz, geri yerine koy. Hiçbiri işlemediğinde, bir logaritma almak zorunda kalırsın; bunu 9. bölümde kısaca ele alıyoruz.</div>

<div class="calc-formula"><div class="formula-label">AYNI TABAN KURALI</div><div class="formula-main">$$a^{f(x)} \\;=\\; a^{g(x)} \\quad\\Longleftrightarrow\\quad f(x) \\;=\\; g(x) \\qquad (a > 0,\\; a \\neq 1)$$</div><div class="formula-sub">$y = a^x$ üstel fonksiyonu $a > 0, a \\neq 1$ iken birebirdir — farklı üsler farklı değerler verir. Dolayısıyla aynı tabanlı iki üstel eşitse üsleri de eşit olmalıdır. Yabancı kök yok, tanım kümesi sorunu yok.</div></div>

<div class="calc-example"><div class="example-label">DOĞRUDAN AYNI TABAN</div><div class="example-body">$2^{x+1} = 2^{3x - 1}$ denklemini çöz.<br><br>Tabanlar zaten eşit. Üsleri eşitle:<br>$x + 1 = 3x - 1 \\;\\Rightarrow\\; 2 = 2x \\;\\Rightarrow\\; x = \\mathbf{1}$.<br><br>Kontrol: $2^{1+1} = 4$ ve $2^{3 \\cdot 1 - 1} = 2^2 = 4$. ✓</div></div>

<h2 class="lesson-title">7. Ortak Tabana İndirgeme</h2>

<div class="calc-highlight"><strong>Tabanlar farklı olduğunda ama aynı sayının kuvvetleriyse, iki yanı da o ortak tabanın kuvveti olarak yeniden yaz.</strong> Sonra aynı taban kuralı uygulanır. 2'nin kuvvetleri özellikle yaygındır: $4 = 2^2$, $8 = 2^3$, $16 = 2^4$, $32 = 2^5$, $\\tfrac{1}{2} = 2^{-1}$, $\\tfrac{1}{4} = 2^{-2}$ ve böyle devam eder. İlk altısını ezberle ve neredeyse her lise sınav denklemini ilk bakışta yeniden yazabilirsin.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; 2'NİN KUVVETLERİ</div><div class="example-body">$4^x = 8^{x - 1}$ denklemini çöz.<br><br><strong>Adım 1 &mdash; iki yanı da 2'nin kuvvetleri olarak yaz.</strong><br>$4^x = (2^2)^x = 2^{2x}$<br>$8^{x-1} = (2^3)^{x-1} = 2^{3x - 3}$<br><br><strong>Adım 2 &mdash; üsleri eşitle.</strong><br>$2x = 3x - 3$<br><br><strong>Adım 3 &mdash; çöz.</strong><br>$3 = x \\;\\Rightarrow\\; x = \\mathbf{3}$.<br><br><strong>Kontrol.</strong> $4^3 = 64$ ve $8^{3-1} = 8^2 = 64$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; 3'ÜN KUVVETLERİ</div><div class="example-body">$27^{x+1} = 9^{2x}$ denklemini çöz.<br><br>$27 = 3^3$ ve $9 = 3^2$. Yani:<br>$3^{3(x+1)} = 3^{2 \\cdot 2x}$<br>$3(x+1) = 4x$<br>$3x + 3 = 4x \\;\\Rightarrow\\; x = \\mathbf{3}$.<br><br>Kontrol: $27^4 = 531\\,441$ ve $9^6 = 531\\,441$. ✓</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Negatif üsler</div><div class="card-body">$\\tfrac{1}{a^n} = a^{-n}$. Yani $\\tfrac{1}{8} = 2^{-3}$ ve $2^x = \\tfrac{1}{8}$ gibi bir denklem $2^x = 2^{-3} \\Rightarrow x = -3$ olur.</div></div>
<div class="calc-card"><div class="card-title">Kesirli tabanlar</div><div class="card-body">$(1/2)^x = 2^{-x}$, $(1/3)^x = 3^{-x}$. Payı 1 olan herhangi bir kesir, üs üzerinde bir işaret pahasına ters çevrilebilir.</div></div>
<div class="calc-card"><div class="card-title">Tabanların ortak bir tabanı yoksa</div><div class="card-body">İki yanı tek bir sayının kuvvetleri olarak yazamıyorsan (örn. $2^x = 3$), hiçbir cebirsel hile bunu temiz çözmez — logaritmaya başvur. Bölüm 9'a bak.</div></div>
</div>

<h2 class="lesson-title">8. Karşılaştırma Grafiği: Farklı Üstel Tabanlar</h2>

<div class="calc-graph"><div id="plot-l58-exp-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> üç üstel eğri $y = 2^x$ (mavi), $y = 3^x$ (turuncu), $y = (1/2)^x$ (kırmızı). Üçü de $(0, 1)$'den geçer çünkü sıfırdan farklı herhangi bir tabanın sıfırıncı kuvveti 1'dir. Pozitif $x$ için, daha büyük tabanlı eğri daha hızlı tırmanır: $x > 0$ olunca $3^x > 2^x$. Negatif $x$ için sıralama tersine döner — $(1/2)^x = 2^{-x}$, $2^x$'in $y$-eksenine göre yansımasıdır, dolayısıyla pozitif $x$ için söner ve negatif $x$ için patlar. $(0, 1)$ kesişimi üçünün uzlaştığı tek noktadır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var y2=[];var y3=[];var yh=[];for(var i=0;i<=160;i++){var x=-3+i*0.05;xs.push(x);y2.push(Math.pow(2,x));y3.push(Math.pow(3,x));yh.push(Math.pow(0.5,x));}
var t2={x:xs,y:y2,mode:'lines',name:'y = 2^x',line:{color:'#3b82f6',width:3}};
var t3={x:xs,y:y3,mode:'lines',name:'y = 3^x',line:{color:'#f59e0b',width:3}};
var th={x:xs,y:yh,mode:'lines',name:'y = (1/2)^x',line:{color:'#ef4444',width:3}};
var hub={x:[0],y:[1],mode:'markers+text',name:'hepsi (0,1) geçer',marker:{color:'#10b981',size:10},text:['(0, 1)'],textposition:'top right',textfont:{color:'#10b981',size:12}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y',range:[0,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l58-exp-tr',[t2,t3,th,hub],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Resmi denklemler için okuma.</strong> $2^x = 8$ denklemini grafiksel çözmek, mavi eğrinin $y = 8$ yatay çizgisini kestiği yeri bulmak demektir. Bu $x = 3$'te olur ve cebirsel $2^x = 2^3$ ile örtüşür. $2^x = 3^x$ denklemini çözmek mavi ve turuncu eğrilerin nerede buluştuğunu sorar — yalnızca $x = 0$'da, çünkü eğriler yalnızca paylaşılan $(0, 1)$ noktasında uzlaşır.</div>

<h2 class="lesson-title">9. Logaritma Önizlemesi: Ortak Taban Yoksa</h2>

<div class="calc-highlight"><strong>İki yan aynı tabanla yazılamadığında, iki yanın logaritmasını al.</strong> Bu, bilinmeyeni üsten çıkarıp bir katsayı konumuna çeker, orada sıradan cebir işi bitirebilir. Logaritmaları ayrı bir derste derinlemesine ele alacağız; burada arta kalan vakaları çözmeye yetecek kadarını veriyoruz.</div>

<div class="calc-formula"><div class="formula-label">$a^x = b$'Yİ LOGARİTMA İLE ÇÖZME</div><div class="formula-main">$$a^x = b \\quad\\Longrightarrow\\quad x = \\frac{\\log b}{\\log a} \\qquad (a > 0,\\; a \\neq 1,\\; b > 0)$$</div><div class="formula-sub">İki yanın $\\log$'unu al, sonra $\\log(a^x) = x \\log a$'yı kullan. Logaritmanın içindeki taban seçimi önemli değildir — doğal logaritma $\\ln$, ortak logaritma $\\log_{10}$ ya da başka bir şey, hem pay hem de payda aynı tabanı kullandığı sürece her şey iş görür.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$2^x = 7$ denklemini çöz.<br><br>$2$, $7$'nin kuvveti değildir, tersi de geçerlidir — ortak taban yok. İki yanın $\\log_{10}$'unu al:<br>$x \\log 2 = \\log 7$<br>$x = \\dfrac{\\log 7}{\\log 2} \\approx \\dfrac{0.8451}{0.3010} \\approx \\mathbf{2.807}$.<br><br>Hızlı sağlama: $2^2 = 4$ ve $2^3 = 8$, dolayısıyla cevap 2 ile 3 arasında, 3'e daha yakın olmalı. Ondalık $2.807$ o bantta. ✓</div></div>

<h2 class="lesson-title">10. İkame: Kılık Değiştirmiş İkinci Dereceden Denklemler</h2>

<div class="calc-highlight"><strong>$A \\cdot (a^x)^2 + B \\cdot a^x + C = 0$ gibi görünen bir denklem, $u = a^x$ değişkeninde ikinci dereceden bir denklemdir.</strong> İkame et, $u$ için ikinci dereceden denklemi çöz, sonra $a^x = u$ ile geri yerine koy ve $x$ için çöz — genellikle aynı taban kuralıyla, bazen logaritma ile. Negatif $u$'yu at (bir üstel asla negatif değildir).</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 &mdash; TABAN 3</div><div class="example-body">$9^x - 4 \\cdot 3^x + 3 = 0$ denklemini çöz.<br><br><strong>Adım 1 &mdash; kalıbı yakala.</strong> $9^x = (3^2)^x = (3^x)^2$. $u = 3^x$ olsun, böylece $9^x = u^2$.<br><br><strong>Adım 2 &mdash; ikame et.</strong><br>$u^2 - 4u + 3 = 0$<br>$(u - 1)(u - 3) = 0 \\;\\Rightarrow\\; u = 1 \\text{ ya da } u = 3$.<br><br><strong>Adım 3 &mdash; geri yerine koy.</strong><br>$3^x = 1 \\;\\Rightarrow\\; 3^x = 3^0 \\;\\Rightarrow\\; x = 0$.<br>$3^x = 3 \\;\\Rightarrow\\; 3^x = 3^1 \\;\\Rightarrow\\; x = 1$.<br><br><strong>Çözümler:</strong> $x = \\mathbf{0}$ ya da $x = \\mathbf{1}$.<br><br><strong>Kontrol.</strong> $x = 0$'da: $9^0 - 4 \\cdot 3^0 + 3 = 1 - 4 + 3 = 0$. ✓. $x = 1$'de: $9 - 12 + 3 = 0$. ✓</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; TABAN 2</div><div class="example-body">$2^{2x} - 5 \\cdot 2^x + 4 = 0$ denklemini çöz.<br><br>$2^{2x} = (2^x)^2$ olduğuna dikkat. $u = 2^x$ olsun.<br><br>$u^2 - 5u + 4 = 0$<br>$(u - 1)(u - 4) = 0 \\;\\Rightarrow\\; u = 1 \\text{ ya da } u = 4$.<br><br>$2^x = 1 \\;\\Rightarrow\\; x = 0$. $2^x = 4 = 2^2 \\;\\Rightarrow\\; x = 2$.<br><br><strong>Çözümler:</strong> $x = \\mathbf{0}$ ya da $x = \\mathbf{2}$.</div></div>

<div class="calc-graph"><div id="plot-l58-sub-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $f(x) = 9^x - 4 \\cdot 3^x + 3$ fonksiyonu. $f(x) = 0$'ın gerçek çözümleri $x$-ekseni kesişimleridir. Eğri iki kök arasında sıfırın altına dalar ve ekseni tam olarak ikamenin tahmin ettiği iki noktada keser: $x = 0$ (burada $3^x = 1$) ve $x = 1$ (burada $3^x = 3$). Şekil, $u^2 - 4u + 3$ yukarı doğru parabolünün $u = 3^x$ ikamesi altındaki görüntüsüdür — parabolün her iki kökü de pozitiftir, dolayısıyla ikisi de reel üstel denklemlere geri yerine konabilir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=-0.5+i*0.012;xs.push(x);ys.push(Math.pow(9,x)-4*Math.pow(3,x)+3);}
var fcurve={x:xs,y:ys,mode:'lines',name:'f(x) = 9^x − 4·3^x + 3',line:{color:'#3b82f6',width:3}};
var zeros={x:[0,1],y:[0,0],mode:'markers+text',name:'sıfırlar',marker:{color:'#10b981',size:11},text:['x = 0','x = 1'],textposition:'bottom right',textfont:{color:'#10b981',size:12}};
var axis={x:[-0.6,2.1],y:[0,0],mode:'lines',name:'y = 0',line:{color:'rgba(255,255,255,0.35)',width:1,dash:'dot'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-0.5,2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-1.5,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l58-sub-tr',[fcurve,axis,zeros],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Neden negatif $u$ atılır.</strong> $a > 0$ ile $u = a^x$ ikamesi her zaman $u > 0$ verir — bir üstel asla sıfır ve asla negatif değildir. $u$ için kurduğun ikinci dereceden denklem negatif bir kök üretirse, o kökün arkasında reel bir $x$ yoktur ve atılmalıdır. Geri yerine koymadan önce iki kökü de kontrol et.</div>

<h2 class="lesson-title">11. Alıştırma Problemleri</h2>

<p class="l-text">Sekiz alıştırma, her teknik için bir tane. Çözümü okumadan önce her birini dene.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; TEK KÖK</div><div class="example-body"><strong>Çöz:</strong> $\\sqrt{2x + 3} = x$.<br><br>Tanım kümesi: $2x + 3 \\geq 0 \\Rightarrow x \\geq -\\tfrac{3}{2}$ ve sağ taraf $\\geq 0 \\Rightarrow x \\geq 0$.<br>Kareye al: $2x + 3 = x^2 \\Rightarrow x^2 - 2x - 3 = 0 \\Rightarrow (x - 3)(x + 1) = 0$.<br>Adaylar: $x = 3$ ya da $x = -1$.<br>Kontrol: $x = 3$: $\\sqrt{9} = 3$. ✓. $x = -1$: $x \\geq 0$ sağlanmaz — yabancı.<br>Cevap: $x = \\mathbf{3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; İKİ KÖK</div><div class="example-body"><strong>Çöz:</strong> $\\sqrt{x + 8} - \\sqrt{x - 4} = 2$.<br><br>Tanım kümesi: $x \\geq 4$. Bir kökü yalnız bırak: $\\sqrt{x+8} = 2 + \\sqrt{x-4}$.<br>Kareye al: $x + 8 = 4 + 4\\sqrt{x-4} + (x-4) = x + 4\\sqrt{x-4}$.<br>Yalnız bırak: $4\\sqrt{x-4} = 8 \\Rightarrow \\sqrt{x-4} = 2 \\Rightarrow x - 4 = 4 \\Rightarrow x = 8$.<br>Kontrol: $\\sqrt{16} - \\sqrt{4} = 4 - 2 = 2$. ✓<br>Cevap: $x = \\mathbf{8}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; KÜP KÖK</div><div class="example-body"><strong>Çöz:</strong> $\\sqrt[3]{3x - 2} = 4$.<br><br>Küpünü al: $3x - 2 = 64 \\Rightarrow 3x = 66 \\Rightarrow x = \\mathbf{22}$. Kontrol: $\\sqrt[3]{64} = 4$. ✓ Yabancı kök riski yok (tek indeks).</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; AYNI TABAN ÜSTEL</div><div class="example-body"><strong>Çöz:</strong> $5^{2x - 1} = 5^{x + 4}$.<br><br>Üsleri eşitle: $2x - 1 = x + 4 \\Rightarrow x = \\mathbf{5}$.<br>Kontrol: $5^{9} = 5^{9}$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; ORTAK TABAN</div><div class="example-body"><strong>Çöz:</strong> $25^{x} = \\tfrac{1}{125}$.<br><br>Yeniden yaz: $25 = 5^2$, $\\tfrac{1}{125} = 5^{-3}$. Yani $5^{2x} = 5^{-3} \\Rightarrow 2x = -3 \\Rightarrow x = \\mathbf{-\\tfrac{3}{2}}$.<br>Kontrol: $25^{-3/2} = (25^{1/2})^{-3} = 5^{-3} = \\tfrac{1}{125}$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; İKAME (TABAN 3)</div><div class="example-body"><strong>Çöz:</strong> $9^x - 12 \\cdot 3^x + 27 = 0$.<br><br>$u = 3^x$ olsun. O zaman $u^2 - 12u + 27 = 0 \\Rightarrow (u - 3)(u - 9) = 0 \\Rightarrow u = 3$ ya da $u = 9$.<br>Geri yerine koy: $3^x = 3 \\Rightarrow x = 1$; $3^x = 9 = 3^2 \\Rightarrow x = 2$.<br><strong>Çözümler:</strong> $x = \\mathbf{1}$ ya da $x = \\mathbf{2}$.<br>$x = 2$ kontrol: $81 - 12 \\cdot 9 + 27 = 81 - 108 + 27 = 0$. ✓</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; İKAME (TABAN 2)</div><div class="example-body"><strong>Çöz:</strong> $4^x - 6 \\cdot 2^x + 8 = 0$.<br><br>$4^x = (2^x)^2$. $u = 2^x$ olsun. Sonra $u^2 - 6u + 8 = 0 \\Rightarrow (u - 2)(u - 4) = 0 \\Rightarrow u = 2$ ya da $u = 4$.<br>$2^x = 2 \\Rightarrow x = 1$; $2^x = 4 \\Rightarrow x = 2$.<br><strong>Çözümler:</strong> $x = \\mathbf{1}$ ya da $x = \\mathbf{2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; KARMA (KÖK İLE KUVVET)</div><div class="example-body"><strong>Çöz:</strong> $\\sqrt{3x + 1} = x - 1$.<br><br>Tanım kümesi: $3x + 1 \\geq 0 \\Rightarrow x \\geq -\\tfrac{1}{3}$ ve sağ taraf $\\geq 0 \\Rightarrow x \\geq 1$.<br>Kareye al: $3x + 1 = (x - 1)^2 = x^2 - 2x + 1 \\Rightarrow x^2 - 5x = 0 \\Rightarrow x(x - 5) = 0$.<br>Adaylar: $x = 0$ ya da $x = 5$.<br>Kontrol: $x = 0$, $x \\geq 1$ sağlanmaz — yabancı. $x = 5$: $\\sqrt{16} = 4$ ve $5 - 1 = 4$. ✓<br>Cevap: $x = \\mathbf{5}$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Köklü denklemler: kökü yalnız bırak, eşleşen kuvvete yükselt, çöz, <em>her adayı kontrol et</em>, yabancı kökleri at</li>
<li>İki kök: birini yalnız bırak, kareye al, diğerini yalnız bırak, tekrar kareye al — sonra kontrol et</li>
<li>Küp kökler ve tek indeksli kökler birebirdir ve yabancı çözüm üretmezler; yine de aritmetiği doğrula</li>
<li>Aynı tabanlı üsteller: $a^{f(x)} = a^{g(x)} \\Leftrightarrow f(x) = g(x)$ ($a > 0, a \\neq 1$ için)</li>
<li>Farklı tabanlar: olabildiğinde ortak tabanın kuvvetleri olarak yeniden yaz ($4 = 2^2$, $9 = 3^2$ vb.) — sonra üsleri eşitle</li>
<li>Kılık değiştirmiş ikinci dereceden denklemler: $u = a^x$ ikame et, ikinci dereceden denklemi çöz, geri yerine koy. Pozitif olmayan $u$'yu at</li>
<li>Ortak taban yoksa, iki yanın logaritmasını al — eksiksiz işleme sonraki bir derste</li>
</ul>
</div>`
};
