window.LISE_MAT_L47 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A polynomial is the simplest infinite family of functions in mathematics.</strong> Add a few powers of x together with constant coefficients in front, and you have one. They are easy to write down, easy to evaluate, easy to differentiate, easy to integrate — and despite their simplicity, they approximate almost every smooth function we care about (this is the content of Taylor's theorem, which you will meet in calculus). Before any of that machinery is available, however, you need to be fluent with the basic language: what counts as a polynomial, what its degree is, which coefficient leads the show, and what the graph does when $x$ flies off to plus or minus infinity.</p>

<p class="l-text">By the end of this lesson you will recognise a polynomial on sight, refuse to be fooled by impostors (negative powers, fractional powers, $x$ hiding under a radical), name a polynomial by its degree using the standard vocabulary (linear, quadratic, cubic, quartic), add and subtract polynomials reliably by collecting like terms, evaluate $P(a)$ at any real number, and predict the four possible end-behaviour patterns of the graph from two pieces of information alone: the parity of the degree and the sign of the leading coefficient. None of this requires calculus. All of it is the launching pad for the next dozen lessons.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write the formal definition of a polynomial in one variable and check whether a given expression qualifies</li>
<li>Identify the <em>degree</em>, the <em>leading coefficient</em>, and the <em>constant term</em> of any polynomial in standard form</li>
<li>Distinguish polynomials from expressions that look similar but are not (negative or fractional exponents, $x$ in a denominator, $x$ inside a radical)</li>
<li>Name a polynomial by its degree: constant, linear, quadratic, cubic, quartic, quintic</li>
<li>Add and subtract polynomials by combining like terms; verify the degree of the sum</li>
<li>Evaluate $P(a)$ for any real number $a$ by direct substitution</li>
<li>Predict the four <em>end-behaviour</em> patterns of $P(x)$ from the parity of the degree and the sign of the leading coefficient</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Polynomial? The Formal Definition</h2>

<div class="calc-highlight"><strong>A polynomial is a finite sum of constant multiples of non-negative integer powers of a single variable.</strong> That is the whole rule. No square roots of $x$, no $1/x$ terms, no $x$ inside $\\sin$ or $\\ln$ — just $x$ raised to whole-number powers, each multiplied by a number, all added together.</div>

<p class="l-text">In symbols, every polynomial in the variable $x$ can be written in the form</p>

<div class="calc-formula"><div class="formula-label">POLYNOMIAL — STANDARD FORM</div><div class="formula-main">$$P(x) \\;=\\; a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_2 x^2 + a_1 x + a_0$$</div><div class="formula-sub">$n$ is a non-negative integer (0, 1, 2, 3, ...). The numbers $a_n, a_{n-1}, \\ldots, a_0$ are called the <em>coefficients</em>. They can be any real numbers (positive, negative, rational, irrational), but they must be <em>constants</em> — they cannot depend on $x$. We require $a_n \\neq 0$ so that the leading term is genuinely present.</div></div>

<p class="l-text">The condition $a_n \\neq 0$ deserves a sentence of explanation. We could always write a quadratic such as $P(x) = x^2 + 1$ as $0 \\cdot x^5 + 0 \\cdot x^4 + 0 \\cdot x^3 + x^2 + 0 \\cdot x + 1$ by padding it with zero coefficients. We do not. By insisting that the leading coefficient be non-zero, we make the <em>degree</em> of the polynomial uniquely defined: $P(x) = x^2 + 1$ has degree 2, full stop.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Coefficients $a_k$</div><div class="card-body">The constants in front of each power of $x$. They live in the real numbers. The index $k$ tells you which power they multiply.</div></div>
<div class="calc-card"><div class="card-title">Variable $x$</div><div class="card-body">A placeholder for any real number. We write $P(x)$ to emphasise that the polynomial is a <em>function</em>: feed in $x$, get out a number.</div></div>
<div class="calc-card"><div class="card-title">Degree $n$</div><div class="card-body">The largest exponent that appears with a non-zero coefficient. Lives in $\\mathbb{N}_0 = \\{0, 1, 2, 3, \\ldots\\}$.</div></div>
<div class="calc-card"><div class="card-title">Term $a_k x^k$</div><div class="card-body">One single coefficient-times-power building block. A polynomial is a finite sum of terms.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Write $P(x) = 5x^3 - 2x + 7 + x^4$ in standard form and identify $n$, the coefficients, and the constant term.<br><br>Reorder the terms by descending power: $P(x) = x^4 + 5x^3 + 0 \\cdot x^2 - 2x + 7$.<br><br>Degree: $n = 4$. Leading coefficient: $a_4 = 1$. Other coefficients: $a_3 = 5$, $a_2 = 0$, $a_1 = -2$, $a_0 = 7$. Constant term: $7$.</div></div>

<div class="l-note"><strong>Why "polynomial" — the word.</strong> From the Greek <em>poly</em> ("many") and the Latin <em>nomen</em> ("name" or "term"). A polynomial is literally a "many-term" expression — though by this naming a polynomial with a single term (like $5x^7$, a <em>monomial</em>) is also a polynomial, just a degenerate one.</div>

<h2 class="lesson-title">2. Impostors — Expressions That Are <em>Not</em> Polynomials</h2>

<div class="calc-highlight"><strong>The fastest way to learn what a polynomial is, is to recognise what it isn't.</strong> Three families of expressions look polynomial-ish but fail the definition: negative exponents, fractional exponents, and $x$ hiding inside another function (radicals, denominators, logarithms, trigonometric functions). Each one violates the "non-negative integer powers only" clause.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">POLYNOMIAL — YES</div><div class="compare-item">$P(x) = 3x^4 - 5x^2 + 7$ &nbsp; (all exponents are non-negative integers)</div><div class="compare-item">$P(x) = -2x + 1$ &nbsp; (a linear function is a degree-1 polynomial)</div><div class="compare-item">$P(x) = 9$ &nbsp; (a constant is a degree-0 polynomial; here $a_0 = 9$)</div><div class="compare-item">$P(x) = \\sqrt{2}\\, x^3 + \\pi$ &nbsp; (coefficients may be irrational — that is fine)</div><div class="compare-item">$P(x) = \\frac{2}{3} x^5 - \\frac{1}{7} x^2 + 6$ &nbsp; (fractional <em>coefficients</em> are allowed; fractional <em>exponents</em> are not)</div></div><div class="compare-col"><div class="compare-title">NOT A POLYNOMIAL</div><div class="compare-item">$f(x) = x^{-2} + 5 = \\dfrac{1}{x^2} + 5$ &nbsp; (negative exponent)</div><div class="compare-item">$f(x) = x^{1/2} - 3 = \\sqrt{x} - 3$ &nbsp; (fractional exponent)</div><div class="compare-item">$f(x) = \\dfrac{x + 1}{x - 2}$ &nbsp; ($x$ in the denominator)</div><div class="compare-item">$f(x) = \\sqrt{x^2 + 1}$ &nbsp; ($x$ under a radical)</div><div class="compare-item">$f(x) = 2^x$ &nbsp; ($x$ in the exponent — that is an <em>exponential</em>, not polynomial)</div><div class="compare-item">$f(x) = \\sin x + x^2$ &nbsp; ($\\sin x$ is not a power of $x$)</div></div></div>

<p class="l-text"><strong>The diagnostic test in two questions.</strong> Look at the expression. Ask: (1) every appearance of $x$ — is it raised to a power that is a non-negative whole number? (2) are all the coefficients constants? If both answers are yes, you are looking at a polynomial. If either is no, you are not.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Classify each of the following: $A(x) = 4x^3 - 2x + \\frac{1}{5}$, $B(x) = \\frac{1}{x} + x$, $C(x) = x^2 \\sqrt{3} - x$, $D(x) = x^{3/2} + 4$.<br><br>$A$: all exponents are 3, 1, 0 (whole numbers), all coefficients are constants. <strong>Polynomial</strong>, degree 3.<br>$B$: $\\frac{1}{x} = x^{-1}$, negative exponent. <strong>Not a polynomial.</strong><br>$C$: exponents are 2 and 1 (whole), coefficient $\\sqrt{3}$ is a constant (irrational, but constant). <strong>Polynomial</strong>, degree 2.<br>$D$: exponent $3/2$ is not a whole number. <strong>Not a polynomial.</strong></div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Is $P(x) = (x+1)(x-3)$ a polynomial? Yes — once you expand: $P(x) = x^2 - 2x - 3$. A polynomial does not have to be written in expanded standard form to qualify; it just has to be <em>expressible</em> as a finite sum of non-negative integer powers of $x$ with constant coefficients. Products of polynomials are themselves polynomials.</div></div>

<h2 class="lesson-title">3. The Degree of a Polynomial</h2>

<div class="calc-highlight"><strong>The degree is the most important single number attached to a polynomial.</strong> It tells you how the function behaves for large $x$ (next section), how many times the graph can cross the x-axis (at most $n$ times, lesson L48), how many times the derivative will drop the degree (each derivative reduces it by 1), and how many independent solutions a related differential equation will have. Get into the habit of reading off the degree immediately.</div>

<div class="calc-formula"><div class="formula-label">DEGREE — DEFINITION</div><div class="formula-main">$$\\deg P(x) \\;=\\; \\text{the largest } k \\text{ for which } a_k \\neq 0$$</div><div class="formula-sub">Equivalently: write $P(x)$ in standard form (descending powers), find the first term that appears, read off its exponent. That exponent is the degree.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Degree 0</div><div class="card-body">A non-zero constant. Example: $P(x) = 7$. The only term is $7 = 7 \\cdot x^0$.</div></div>
<div class="calc-card"><div class="card-title">Degree 1</div><div class="card-body">A linear polynomial. Example: $P(x) = -2x + 5$. The highest power is $x^1$.</div></div>
<div class="calc-card"><div class="card-title">Degree 2</div><div class="card-body">A quadratic. Example: $P(x) = x^2 - 4x + 1$. The highest power is $x^2$.</div></div>
<div class="calc-card"><div class="card-title">Degree $n$</div><div class="card-body">Whatever the highest non-zero power is. There is no upper bound: $P(x) = x^{100} + 1$ is a perfectly good polynomial of degree 100.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Find the degree of each polynomial.<br>(a) $P(x) = 4x^7 - 3x^5 + x$<br>(b) $Q(x) = 5$<br>(c) $R(x) = (x^2 - 1)(x^3 + 2x)$<br><br>(a) Largest exponent with a non-zero coefficient is 7. <strong>$\\deg P = 7$.</strong><br>(b) Constant 5 = $5 \\cdot x^0$. <strong>$\\deg Q = 0$.</strong><br>(c) Expand: $R(x) = x^5 + 2x^3 - x^3 - 2x = x^5 + x^3 - 2x$. Largest exponent is 5. <strong>$\\deg R = 5$.</strong> Shortcut: $\\deg(P \\cdot Q) = \\deg P + \\deg Q = 2 + 3 = 5$.</div></div>

<div class="l-note"><strong>A special case — the zero polynomial.</strong> The polynomial $P(x) = 0$ (every coefficient is zero) does not have a well-defined degree by the rule above. Some textbooks assign it degree $-\\infty$ for convenience; others say it is undefined. In this lesson we will simply exclude it from any statement about degree.</div>

<h2 class="lesson-title">4. The Leading Coefficient and the Constant Term</h2>

<div class="calc-highlight"><strong>Two coefficients have special names because they govern special behaviour.</strong> The <em>leading coefficient</em> $a_n$ controls what the graph does at infinity. The <em>constant term</em> $a_0$ is the value of the polynomial at $x = 0$, which is where the graph crosses the y-axis.</div>

<div class="calc-formula"><div class="formula-label">LEADING COEFFICIENT &amp; CONSTANT TERM</div><div class="formula-main">$$a_n \\;=\\; \\text{coefficient of } x^n \\;\\;(\\text{the leading term})$$ $$a_0 \\;=\\; P(0) \\;\\;(\\text{the constant term, } = y\\text{-intercept})$$</div></div>

<p class="l-text"><strong>Reading them off.</strong> Write the polynomial in standard form (highest power first). The number in front of the first term is $a_n$. The number with no $x$ attached is $a_0$. If $a_0$ is missing entirely, it equals zero.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">For each polynomial, give the degree, the leading coefficient, and the constant term.<br>(a) $P(x) = -3x^4 + 2x^2 - 7x + 5$<br>(b) $Q(x) = x^6 + 2x$<br>(c) $R(x) = \\dfrac{1}{2} x - 4$<br><br>(a) Degree 4, leading coeff $a_4 = -3$, constant term $a_0 = 5$.<br>(b) Degree 6, leading coeff $a_6 = 1$, constant term $a_0 = 0$ (no constant written).<br>(c) Degree 1, leading coeff $a_1 = 1/2$, constant term $a_0 = -4$.</div></div>

<div class="think-box"><div class="think-label">VISUAL INTERPRETATION</div><div class="think-body">The constant term $a_0 = P(0)$ is the y-coordinate where the graph crosses the y-axis. Try it: substitute $x = 0$ into $P(x) = -3x^4 + 2x^2 - 7x + 5$ — every term with $x$ vanishes, leaving $P(0) = 5$. The graph passes through the point $(0, 5)$. Always.</div></div>

<h2 class="lesson-title">5. Naming Polynomials by Degree</h2>

<div class="calc-highlight"><strong>Low-degree polynomials have classical names you should know on sight.</strong> These names appear in every textbook, every exam, every paper from now on — both in mathematics and in physics, engineering, and economics. Memorise the first five.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Degree</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Name</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">General form</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Typical graph</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem"><strong>Constant</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_0$</td><td style="padding:0.5rem 0.8rem">Horizontal line</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem"><strong>Linear</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_1 x + a_0$</td><td style="padding:0.5rem 0.8rem">Straight line, slope $a_1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem"><strong>Quadratic</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_2 x^2 + a_1 x + a_0$</td><td style="padding:0.5rem 0.8rem">Parabola (U or ∩)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">3</td><td style="padding:0.5rem 0.8rem"><strong>Cubic</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_3 x^3 + \\ldots$</td><td style="padding:0.5rem 0.8rem">S-shape, ends in opposite directions</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">4</td><td style="padding:0.5rem 0.8rem"><strong>Quartic</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_4 x^4 + \\ldots$</td><td style="padding:0.5rem 0.8rem">W or M-shape, both ends same direction</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">5</td><td style="padding:0.5rem 0.8rem"><strong>Quintic</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_5 x^5 + \\ldots$</td><td style="padding:0.5rem 0.8rem">Extended S, opposite ends</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$n$</td><td style="padding:0.5rem 0.8rem">Polynomial of degree $n$</td><td style="padding:0.5rem 0.8rem">$P(x) = a_n x^n + \\ldots$</td><td style="padding:0.5rem 0.8rem">Up to $n - 1$ turning points</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l47-types-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> one representative graph from each of the first five degree classes (1 through 5) drawn on the same axes so you can compare shapes by eye. Notice how the number of turns grows with the degree, and how cubic and quintic graphs end in <em>opposite</em> directions while linear, quadratic, and quartic graphs end in the <em>same</em> direction (up or down at both extremes).</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-25;i<=25;i++){xs.push(i*0.1);}
var lin=xs.map(function(x){return x;});
var qua=xs.map(function(x){return x*x-1;});
var cub=xs.map(function(x){return 0.4*x*x*x-x;});
var quart=xs.map(function(x){return 0.15*Math.pow(x,4)-x*x;});
var quint=xs.map(function(x){return 0.06*Math.pow(x,5)-0.5*x*x*x+x;});
var t1={x:xs,y:lin,mode:'lines',name:'Linear $y=x$',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:qua,mode:'lines',name:'Quadratic $y=x^2-1$',line:{color:'#10b981',width:2.5}};
var t3={x:xs,y:cub,mode:'lines',name:'Cubic $y=0.4x^3-x$',line:{color:'#f59e0b',width:2.5}};
var t4={x:xs,y:quart,mode:'lines',name:'Quartic $y=0.15x^4-x^2$',line:{color:'#ef4444',width:2.5}};
var t5={x:xs,y:quint,mode:'lines',name:'Quintic $y=0.06x^5-0.5x^3+x$',line:{color:'#a855f7',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y = P(x)',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l47-types-en',[t1,t2,t3,t4,t5],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">PATTERN</div><div class="think-body">A polynomial of degree $n$ has <strong>at most $n - 1$ turning points</strong> (places where the graph changes from going up to going down or vice versa). Linear (degree 1) has 0 turns. Quadratic (degree 2) has 1 turn (the vertex). Cubic (degree 3) has up to 2 turns. Quartic (degree 4) has up to 3 turns. This is the <em>maximum</em>; actual count can be lower if some turns happen at the same height or coincide.</div></div>

<h2 class="lesson-title">6. Adding and Subtracting Polynomials</h2>

<div class="calc-highlight"><strong>To add or subtract two polynomials, line up like terms (same power of $x$) and add or subtract their coefficients.</strong> Powers stay the same. The variable does nothing — it is just a placeholder for "this is the $x^k$ slot."</div>

<div class="calc-formula"><div class="formula-label">ADDITION OF POLYNOMIALS</div><div class="formula-main">$$P(x) + Q(x) \\;=\\; \\sum_{k} (a_k + b_k) x^k$$</div><div class="formula-sub">Where $a_k$ is the coefficient of $x^k$ in $P$ and $b_k$ is the coefficient of $x^k$ in $Q$. Treat missing terms as having coefficient 0.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">Compute $(3x^3 + 2x^2 - x + 5) + (x^3 - 4x^2 + 7)$.<br><br>Line up by power:<br>$x^3$: $3 + 1 = 4$<br>$x^2$: $2 + (-4) = -2$<br>$x^1$: $-1 + 0 = -1$<br>$x^0$: $5 + 7 = 12$<br><br>Sum: $\\mathbf{4x^3 - 2x^2 - x + 12}$. Degree unchanged: still 3.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">Compute $(2x^4 + 3x^2 - 1) - (x^4 - x^2 + 2x + 5)$.<br><br>Distribute the minus sign first: $-x^4 + x^2 - 2x - 5$. Then add:<br>$x^4$: $2 - 1 = 1$<br>$x^2$: $3 + 1 = 4$<br>$x^1$: $0 - 2 = -2$<br>$x^0$: $-1 - 5 = -6$<br><br>Difference: $\\mathbf{x^4 + 4x^2 - 2x - 6}$.</div></div>

<div class="l-note"><strong>Degree of a sum.</strong> Generally $\\deg(P + Q) = \\max(\\deg P, \\deg Q)$. But beware: if the leading terms <em>cancel</em>, the degree of the sum is smaller. For example, $(x^3 + x) + (-x^3 + 2x^2) = 2x^2 + x$, degree 2 even though both summands were degree 3.</div>

<div class="think-box"><div class="think-label">PROPERTIES</div><div class="think-body">Polynomial addition is <em>commutative</em> ($P + Q = Q + P$), <em>associative</em> ($(P + Q) + R = P + (Q + R)$), has an <em>identity element</em> (the zero polynomial: $P + 0 = P$), and every polynomial has an <em>additive inverse</em> ($P + (-P) = 0$). These are the same properties enjoyed by ordinary numbers; polynomials behave very much like an extended kind of arithmetic.</div></div>

<h2 class="lesson-title">7. Evaluating $P(a)$: The Value of a Polynomial at a Point</h2>

<div class="calc-highlight"><strong>To find $P(a)$, replace every occurrence of $x$ in the formula with the number $a$, then simplify arithmetically.</strong> That is all. The result is a single real number — the value of the polynomial at that point, equivalently the y-coordinate of the point on the graph above $x = a$.</div>

<div class="calc-formula"><div class="formula-label">EVALUATION</div><div class="formula-main">$$P(a) \\;=\\; a_n a^n + a_{n-1} a^{n-1} + \\cdots + a_1 a + a_0$$</div><div class="formula-sub">Substitute, calculate each power, multiply by the coefficient, add it all up.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1</div><div class="example-body">For $P(x) = 2x^3 - 5x^2 + 4x - 1$, find $P(2)$.<br><br>$P(2) = 2(2)^3 - 5(2)^2 + 4(2) - 1$<br>$\\quad\\;\\, = 2 \\cdot 8 - 5 \\cdot 4 + 8 - 1$<br>$\\quad\\;\\, = 16 - 20 + 8 - 1$<br>$\\quad\\;\\, = \\mathbf{3}$.<br><br>So the graph of $P$ passes through the point $(2, 3)$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2</div><div class="example-body">For $P(x) = x^4 - 3x^2 + 7$, find $P(-1)$.<br><br>$P(-1) = (-1)^4 - 3(-1)^2 + 7 = 1 - 3 + 7 = \\mathbf{5}$.<br><br><strong>Watch the signs of negative bases:</strong> $(-1)^4 = +1$ (even power), $(-1)^3 = -1$ (odd power), and so on. Use parentheses generously.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3</div><div class="example-body">For $P(x) = x^2 - 4$, find $P(0)$, $P(2)$, and $P(-2)$.<br><br>$P(0) = -4$ (y-intercept). $P(2) = 4 - 4 = 0$. $P(-2) = 4 - 4 = 0$.<br><br>Both $x = 2$ and $x = -2$ are <em>roots</em> of $P$ (values where $P(x) = 0$). We will study roots systematically in lesson L48.</div></div>

<div class="l-note"><strong>An efficient algorithm for evaluation.</strong> Horner's scheme (covered in L49 alongside synthetic division) rewrites $P(x) = a_n x^n + \\ldots + a_0$ as a nested product: $((\\ldots((a_n x + a_{n-1})x + a_{n-2})x + \\ldots)x + a_0$. This uses only $n$ multiplications and $n$ additions — minimal. For now, direct substitution is fine.</div>

<h2 class="lesson-title">8. End Behaviour: What Happens as $x \\to \\pm\\infty$</h2>

<div class="calc-highlight"><strong>For large $|x|$, the leading term $a_n x^n$ dominates everything else.</strong> All lower-degree terms ($a_{n-1} x^{n-1}, \\ldots, a_0$) become irrelevant in comparison. So the <em>end behaviour</em> of a polynomial graph — what it does on the far left and the far right — depends on only two things: whether $n$ is even or odd, and whether $a_n$ is positive or negative.</div>

<p class="l-text">Concretely: as $x$ becomes very large in absolute value, $|x^n|$ grows much faster than $|x^{n-1}|$. So $P(x) \\approx a_n x^n$ for $|x|$ large. This means the graph eventually rises or falls like the leading monomial $a_n x^n$. The four cases are:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Parity of $n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sign of $a_n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">As $x \\to -\\infty$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">As $x \\to +\\infty$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Mnemonic shape</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Even ($n=2,4,6,\\ldots$)</td><td style="padding:0.5rem 0.8rem">Positive ($a_n &gt; 0$)</td><td style="padding:0.5rem 0.8rem">$P(x) \\to +\\infty$</td><td style="padding:0.5rem 0.8rem">$P(x) \\to +\\infty$</td><td style="padding:0.5rem 0.8rem">Like $y = x^2$: both ends UP</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Even</td><td style="padding:0.5rem 0.8rem">Negative ($a_n &lt; 0$)</td><td style="padding:0.5rem 0.8rem">$P(x) \\to -\\infty$</td><td style="padding:0.5rem 0.8rem">$P(x) \\to -\\infty$</td><td style="padding:0.5rem 0.8rem">Like $y = -x^2$: both ends DOWN</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Odd ($n=1,3,5,\\ldots$)</td><td style="padding:0.5rem 0.8rem">Positive</td><td style="padding:0.5rem 0.8rem">$P(x) \\to -\\infty$</td><td style="padding:0.5rem 0.8rem">$P(x) \\to +\\infty$</td><td style="padding:0.5rem 0.8rem">Like $y = x^3$: down-left, up-right</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Odd</td><td style="padding:0.5rem 0.8rem">Negative</td><td style="padding:0.5rem 0.8rem">$P(x) \\to +\\infty$</td><td style="padding:0.5rem 0.8rem">$P(x) \\to -\\infty$</td><td style="padding:0.5rem 0.8rem">Like $y = -x^3$: up-left, down-right</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l47-end-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> all four end-behaviour patterns side by side. Top-left: even degree, positive leading coefficient ($y = x^4$, both ends up). Top-right: even degree, negative leading coefficient ($y = -x^4$, both ends down). Bottom-left: odd degree, positive leading coefficient ($y = x^3$, down-left up-right). Bottom-right: odd degree, negative leading coefficient ($y = -x^3$, up-left down-right). The interior wiggles (caused by lower-degree terms) do not affect the end behaviour at all.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=30;i++){xs.push(i*0.1);}
var ePP=xs.map(function(x){return Math.pow(x,4)-3*x*x;});
var eNN=xs.map(function(x){return -Math.pow(x,4)+3*x*x;});
var oPP=xs.map(function(x){return Math.pow(x,3)-3*x;});
var oNN=xs.map(function(x){return -Math.pow(x,3)+3*x;});
var s1={x:xs,y:ePP,mode:'lines',name:'Even +: $y=x^4-3x^2$',line:{color:'#3b82f6',width:2.5},xaxis:'x1',yaxis:'y1'};
var s2={x:xs,y:eNN,mode:'lines',name:'Even −: $y=-x^4+3x^2$',line:{color:'#ef4444',width:2.5},xaxis:'x2',yaxis:'y2'};
var s3={x:xs,y:oPP,mode:'lines',name:'Odd +: $y=x^3-3x$',line:{color:'#10b981',width:2.5},xaxis:'x3',yaxis:'y3'};
var s4={x:xs,y:oNN,mode:'lines',name:'Odd −: $y=-x^3+3x$',line:{color:'#f59e0b',width:2.5},xaxis:'x4',yaxis:'y4'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist',size:10},
xaxis:{domain:[0,0.46],range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},
yaxis:{domain:[0.55,1],range:[-6,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},
xaxis2:{domain:[0.54,1],range:[-3,3],anchor:'y2',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},
yaxis2:{domain:[0.55,1],range:[-12,6],anchor:'x2',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},
xaxis3:{domain:[0,0.46],range:[-3,3],anchor:'y3',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},
yaxis3:{domain:[0,0.45],range:[-12,12],anchor:'x3',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},
xaxis4:{domain:[0.54,1],range:[-3,3],anchor:'y4',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},
yaxis4:{domain:[0,0.45],range:[-12,12],anchor:'x4',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},
margin:{t:30,r:20,b:40,l:50},legend:{orientation:'h',y:-0.12,xanchor:'center',x:0.5,font:{size:9}},
annotations:[
{x:0.23,y:1.02,xref:'paper',yref:'paper',text:'<b>Even degree, +a<sub>n</sub></b>',showarrow:false,font:{color:'#3b82f6',size:11}},
{x:0.77,y:1.02,xref:'paper',yref:'paper',text:'<b>Even degree, −a<sub>n</sub></b>',showarrow:false,font:{color:'#ef4444',size:11}},
{x:0.23,y:0.47,xref:'paper',yref:'paper',text:'<b>Odd degree, +a<sub>n</sub></b>',showarrow:false,font:{color:'#10b981',size:11}},
{x:0.77,y:0.47,xref:'paper',yref:'paper',text:'<b>Odd degree, −a<sub>n</sub></b>',showarrow:false,font:{color:'#f59e0b',size:11}}
]};
Plotly.newPlot('plot-l47-end-en',[s1,s2,s3,s4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Predict the end behaviour of $P(x) = -2x^5 + 17x^3 - 1$ without graphing.<br><br>Degree $n = 5$ (odd). Leading coefficient $a_5 = -2$ (negative). Use the table row "odd / negative":<br>As $x \\to -\\infty$: $P(x) \\to +\\infty$ (graph rises on the left).<br>As $x \\to +\\infty$: $P(x) \\to -\\infty$ (graph falls on the right).<br><br>Quick check: leading term $-2x^5$. For very large positive $x$, this is very large negative. For very negative $x$, $(-2)(\\text{very neg})^5 = (-2)(\\text{very neg}) = +\\infty$. Consistent.</div></div>

<div class="calc-graph"><div id="plot-l47-cubic-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the graph of $P(x) = x^3 - 4x$ with its three real zeros highlighted: $x = -2, 0, +2$ (factor: $P(x) = x(x-2)(x+2)$). Degree 3 odd, positive leading coefficient: graph falls on the left and rises on the right, exactly as predicted. Between the zeros it wiggles up and down — degree 3 allows up to two turning points.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-28;i<=28;i++){var x=i*0.1;xs.push(x);ys.push(x*x*x-4*x);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x) = x³ − 4x',line:{color:'#3b82f6',width:3}};
var zeros={x:[-2,0,2],y:[0,0,0],mode:'markers+text',name:'Zeros',marker:{color:'#f59e0b',size:11},text:['x=−2','x=0','x=+2'],textposition:'top center',textfont:{color:'#e8e8e8',size:11}};
var ax={x:[-3,3],y:[0,0],mode:'lines',name:'x-axis',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y = P(x)',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l47-cubic-en',[curve,ax,zeros],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why this matters.</strong> The end behaviour determines how many roots a polynomial <em>must</em> have. An odd-degree polynomial must cross the x-axis at least once (because one end goes to $+\\infty$ and the other to $-\\infty$, and a continuous graph cannot jump over the axis). An even-degree polynomial may not cross at all (if both ends go up and the minimum value is positive). This is the connection between degree, leading coefficient, and number of real roots that L48 will develop in detail.</div>

<h2 class="lesson-title">9. Classical Exercises</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Exercise 1 — Polynomial or not?</div><div class="card-body">Decide whether each is a polynomial in $x$. (a) $f = 3x^2 - \\sqrt{5}\\, x + 1$; (b) $f = x^{-3} + x$; (c) $f = \\sqrt{x^4 + 1}$; (d) $f = (2x+1)^5$.<br><br><strong>Answer:</strong> (a) Yes, degree 2 (coefficient $-\\sqrt{5}$ is a constant). (b) No, negative exponent. (c) No, $x$ under a radical that does not simplify. (d) Yes, expansion gives a degree-5 polynomial.</div></div>

<div class="calc-card"><div class="card-title">Exercise 2 — Degree and coefficients</div><div class="card-body">For $P(x) = -4x^5 + x^4 - 7x^2 + 3$ identify the degree, leading coefficient, and constant term.<br><br><strong>Answer:</strong> $\\deg P = 5$, leading coefficient $a_5 = -4$, constant term $a_0 = 3$.</div></div>

<div class="calc-card"><div class="card-title">Exercise 3 — Add</div><div class="card-body">Compute $(2x^4 - x^3 + 5) + (-x^4 + 3x^3 - 2x + 1)$.<br><br><strong>Answer:</strong> $x^4 + 2x^3 - 2x + 6$. Degree 4.</div></div>

<div class="calc-card"><div class="card-title">Exercise 4 — Subtract</div><div class="card-body">Compute $(x^3 + 2x - 5) - (x^3 - x^2 + 4)$.<br><br><strong>Answer:</strong> $x^2 + 2x - 9$. Notice the cubic terms cancelled — the degree dropped from 3 to 2.</div></div>

<div class="calc-card"><div class="card-title">Exercise 5 — Evaluation</div><div class="card-body">For $P(x) = 3x^3 - 2x^2 + x - 4$, compute $P(1)$ and $P(-2)$.<br><br><strong>Answer:</strong> $P(1) = 3 - 2 + 1 - 4 = -2$. $P(-2) = 3(-8) - 2(4) + (-2) - 4 = -24 - 8 - 2 - 4 = -38$.</div></div>

<div class="calc-card"><div class="card-title">Exercise 6 — y-intercept</div><div class="card-body">Find the y-intercept of $P(x) = -x^4 + 3x^2 - 5x + 7$.<br><br><strong>Answer:</strong> The y-intercept is $P(0) = 7$. The constant term gives it directly.</div></div>

<div class="calc-card"><div class="card-title">Exercise 7 — End behaviour</div><div class="card-body">Describe the end behaviour of (a) $P(x) = 4x^6 - x^2 + 1$ and (b) $Q(x) = -3x^7 + x^4 - 2x$.<br><br><strong>Answer:</strong> (a) Degree 6 (even), leading coeff $+4 &gt; 0$. Both ends rise: $P \\to +\\infty$ as $x \\to \\pm\\infty$. (b) Degree 7 (odd), leading coeff $-3 &lt; 0$. Up-left, down-right: $Q \\to +\\infty$ as $x \\to -\\infty$ and $Q \\to -\\infty$ as $x \\to +\\infty$.</div></div>

<div class="calc-card"><div class="card-title">Exercise 8 — Find the unknown coefficient</div><div class="card-body">Polynomial $P(x) = 2x^3 + kx^2 - 5x + 1$ satisfies $P(1) = 0$. Find $k$.<br><br><strong>Answer:</strong> $P(1) = 2 + k - 5 + 1 = k - 2$. Set $k - 2 = 0 \\Rightarrow k = 2$. So $P(x) = 2x^3 + 2x^2 - 5x + 1$.</div></div>
</div>

<div class="lesson-outcomes" style="background:rgba(16,185,129,0.06);border-left:3px solid #10b981;padding:1rem 1.2rem;margin:2rem 0 1rem;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#10b981;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A polynomial is $P(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_0$ with $n \\in \\mathbb{N}_0$, $a_n \\neq 0$</li>
<li>Polynomials forbid: negative exponents, fractional exponents, $x$ in denominator, $x$ under radical</li>
<li>Degree = largest exponent with non-zero coefficient; leading coefficient = $a_n$; constant term = $a_0 = P(0)$</li>
<li>Names by degree: constant (0), linear (1), quadratic (2), cubic (3), quartic (4), quintic (5)</li>
<li>Add/subtract by collecting like terms (same power)</li>
<li>$P(a)$ = substitute $x = a$ and simplify; gives y-coordinate of graph at $x = a$</li>
<li>End behaviour decided by (parity of $n$) and (sign of $a_n$): four cases, all tabulated in section 8</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Polinom, matematikteki en sade sonsuz fonksiyon ailesidir.</strong> $x$'in birkaç kuvvetini sabit katsayılarla çarpıp toplarsın — işte bir polinom. Yazımı kolay, hesaplaması kolay, türevi kolay, integrali kolaydır — ve bu basitliğine rağmen önemsediğimiz hemen her düzgün fonksiyona iyi bir yaklaşım verirler (Taylor teoreminin içeriği budur; analiz dersinde karşılaşacaksın). Ancak bu makineye geçmeden önce temel dile akıcı olmalısın: bir ifadenin polinom sayılıp sayılmadığı, derecesinin ne olduğu, hangi katsayının baş rolde olduğu, ve $x$ artı veya eksi sonsuza giderken grafiğin ne yaptığı.</p>

<p class="l-text">Bu dersin sonunda bir polinomu görür görmez tanıyacak, sahtekarlara (negatif üsler, kesirli üsler, kök içindeki $x$) aldanmayacak, polinomu standart kelimelerle (doğrusal, ikinci derece, üçüncü derece, dördüncü derece) derecesine göre adlandıracak, benzer terimleri toplayarak polinom toplama-çıkarma yapabilecek, herhangi bir gerçek sayıda $P(a)$ değerini hesaplayabilecek, ve sadece iki bilgi parçasından — derecenin tek/çift olması ve baş katsayının işareti — yola çıkarak grafiğin dört olası sonsuz davranış biçimini tahmin edebileceksin. Bunların hiçbiri analiz gerektirmiyor. Hepsi önümüzdeki on iki dersin fırlatma rampasıdır.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tek değişkenli bir polinomun resmi tanımını yazmak ve verilen bir ifadenin polinom olup olmadığını kontrol etmek</li>
<li>Standart formdaki herhangi bir polinomun <em>derecesini</em>, <em>baş katsayısını</em> ve <em>sabit terimini</em> belirlemek</li>
<li>Polinom gibi görünen ama olmayan ifadeleri ayırt etmek (negatif veya kesirli üs, paydada $x$, kök içinde $x$)</li>
<li>Bir polinomu derecesine göre adlandırmak: sabit, doğrusal, ikinci, üçüncü, dördüncü, beşinci derece</li>
<li>Benzer terimleri birleştirerek polinom toplamak ve çıkarmak; toplamın derecesini doğrulamak</li>
<li>Herhangi bir gerçek sayı $a$ için doğrudan yerine koyma ile $P(a)$'yı hesaplamak</li>
<li>Derecenin tek/çift olmasından ve baş katsayının işaretinden $P(x)$'in dört <em>sonsuz davranış</em> örüntüsünü tahmin etmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Polinom Nedir? Resmi Tanım</h2>

<div class="calc-highlight"><strong>Polinom, tek bir değişkenin negatif olmayan tamsayı kuvvetlerinin sabit katsayılarla çarpımlarının sonlu toplamıdır.</strong> Kural budur. $x$'in karekökü yok, $1/x$ terimi yok, $\\sin$ veya $\\ln$ içindeki $x$ yok — sadece $x$'in tam sayı kuvvetleri, her biri bir sayıyla çarpılmış, hepsi toplanmış.</div>

<p class="l-text">Sembollerle, $x$ değişkenindeki her polinom şu formda yazılabilir:</p>

<div class="calc-formula"><div class="formula-label">POLİNOM — STANDART FORM</div><div class="formula-main">$$P(x) \\;=\\; a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_2 x^2 + a_1 x + a_0$$</div><div class="formula-sub">$n$, negatif olmayan bir tam sayıdır (0, 1, 2, 3, ...). $a_n, a_{n-1}, \\ldots, a_0$ sayılarına <em>katsayı</em> denir. Herhangi bir gerçek sayı olabilirler (pozitif, negatif, rasyonel, irrasyonel) ama <em>sabit</em> olmalıdırlar — $x$'e bağlı olamazlar. Baş terimin gerçekten var olması için $a_n \\neq 0$ koşulunu koyarız.</div></div>

<p class="l-text">$a_n \\neq 0$ koşulu bir cümlelik açıklamayı hak ediyor. $P(x) = x^2 + 1$ gibi bir ikinci dereceyi her zaman $0 \\cdot x^5 + 0 \\cdot x^4 + 0 \\cdot x^3 + x^2 + 0 \\cdot x + 1$ olarak sıfır katsayılarla doldurarak yazabilirdik. Yazmıyoruz. Baş katsayının sıfırdan farklı olmasını şart koşarak, polinomun <em>derecesini</em> tek anlamlı kılıyoruz: $P(x) = x^2 + 1$'in derecesi 2'dir, nokta.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katsayılar $a_k$</div><div class="card-body">$x$'in her kuvvetinin önündeki sabitler. Gerçek sayılarda yaşarlar. $k$ indeksi hangi kuvveti çarptıklarını söyler.</div></div>
<div class="calc-card"><div class="card-title">Değişken $x$</div><div class="card-body">Herhangi bir gerçek sayı için yer tutucu. Polinomun bir <em>fonksiyon</em> olduğunu vurgulamak için $P(x)$ yazarız: $x$'i ver, bir sayı al.</div></div>
<div class="calc-card"><div class="card-title">Derece $n$</div><div class="card-body">Sıfırdan farklı katsayıyla görünen en büyük üs. $\\mathbb{N}_0 = \\{0, 1, 2, 3, \\ldots\\}$'da yaşar.</div></div>
<div class="calc-card"><div class="card-title">Terim $a_k x^k$</div><div class="card-body">Tek bir katsayı-çarpı-kuvvet yapı taşı. Polinom, terimlerin sonlu bir toplamıdır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$P(x) = 5x^3 - 2x + 7 + x^4$ ifadesini standart formda yaz; $n$'yi, katsayıları ve sabit terimi belirt.<br><br>Terimleri azalan kuvvete göre yeniden sırala: $P(x) = x^4 + 5x^3 + 0 \\cdot x^2 - 2x + 7$.<br><br>Derece: $n = 4$. Baş katsayı: $a_4 = 1$. Diğer katsayılar: $a_3 = 5$, $a_2 = 0$, $a_1 = -2$, $a_0 = 7$. Sabit terim: $7$.</div></div>

<div class="l-note"><strong>"Polinom" — kelime nereden.</strong> Yunanca <em>poly</em> ("çok") ve Latince <em>nomen</em> ("ad" veya "terim") kelimelerinden. Polinom kelimesi tam olarak "çok-terimli" ifadedir — yine de bu adlandırmaya göre tek terimli bir polinom (örneğin $5x^7$, bir <em>monom</em>) da polinomdur, sadece dejenere bir polinomdur.</div>

<h2 class="lesson-title">2. Sahtekarlar — Polinom <em>Olmayan</em> İfadeler</h2>

<div class="calc-highlight"><strong>Polinomun ne olduğunu öğrenmenin en hızlı yolu, ne <em>olmadığını</em> tanımaktan geçer.</strong> Polinom gibi görünen ama tanımı sağlamayan üç aile vardır: negatif üsler, kesirli üsler ve başka bir fonksiyonun içine gizlenen $x$ (kök, payda, logaritma, trigonometrik fonksiyon). Her biri "yalnızca negatif olmayan tam sayı kuvvetleri" koşulunu çiğner.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">POLİNOM — EVET</div><div class="compare-item">$P(x) = 3x^4 - 5x^2 + 7$ &nbsp; (tüm üsler negatif olmayan tam sayılar)</div><div class="compare-item">$P(x) = -2x + 1$ &nbsp; (doğrusal fonksiyon, 1. derece polinom)</div><div class="compare-item">$P(x) = 9$ &nbsp; (sabit, 0. derece polinom; burada $a_0 = 9$)</div><div class="compare-item">$P(x) = \\sqrt{2}\\, x^3 + \\pi$ &nbsp; (katsayılar irrasyonel olabilir — sorun yok)</div><div class="compare-item">$P(x) = \\frac{2}{3} x^5 - \\frac{1}{7} x^2 + 6$ &nbsp; (kesirli <em>katsayılar</em> serbest; kesirli <em>üsler</em> değil)</div></div><div class="compare-col"><div class="compare-title">POLİNOM DEĞİL</div><div class="compare-item">$f(x) = x^{-2} + 5 = \\dfrac{1}{x^2} + 5$ &nbsp; (negatif üs)</div><div class="compare-item">$f(x) = x^{1/2} - 3 = \\sqrt{x} - 3$ &nbsp; (kesirli üs)</div><div class="compare-item">$f(x) = \\dfrac{x + 1}{x - 2}$ &nbsp; (paydada $x$)</div><div class="compare-item">$f(x) = \\sqrt{x^2 + 1}$ &nbsp; (kök içinde $x$)</div><div class="compare-item">$f(x) = 2^x$ &nbsp; (üste $x$ — bu polinom değil, <em>üstel</em>)</div><div class="compare-item">$f(x) = \\sin x + x^2$ &nbsp; ($\\sin x$, $x$'in bir kuvveti değil)</div></div></div>

<p class="l-text"><strong>İki soruluk teşhis testi.</strong> İfadeye bak. Sor: (1) $x$'in her görünümü — negatif olmayan tam sayı bir üsse mi yükseltilmiş? (2) tüm katsayılar sabit mi? İki cevap da evetse, polinoma bakıyorsundur. Herhangi biri hayırsa, bakmıyorsundur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Her birini sınıflandır: $A(x) = 4x^3 - 2x + \\frac{1}{5}$, $B(x) = \\frac{1}{x} + x$, $C(x) = x^2 \\sqrt{3} - x$, $D(x) = x^{3/2} + 4$.<br><br>$A$: tüm üsler 3, 1, 0 (tam sayı), tüm katsayılar sabit. <strong>Polinom</strong>, derece 3.<br>$B$: $\\frac{1}{x} = x^{-1}$, negatif üs. <strong>Polinom değil.</strong><br>$C$: üsler 2 ve 1 (tam), $\\sqrt{3}$ katsayısı sabit (irrasyonel ama sabit). <strong>Polinom</strong>, derece 2.<br>$D$: $3/2$ üssü tam sayı değil. <strong>Polinom değil.</strong></div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$P(x) = (x+1)(x-3)$ bir polinom mudur? Evet — açtığında: $P(x) = x^2 - 2x - 3$. Bir polinomun nitelik kazanması için açılmış standart formda yazılması şart değildir; yalnızca sabit katsayılarla $x$'in negatif olmayan tam sayı kuvvetlerinin sonlu bir toplamı olarak <em>ifade edilebilmesi</em> gerekir. Polinomların çarpımları da kendileri birer polinomdur.</div></div>

<h2 class="lesson-title">3. Polinomun Derecesi</h2>

<div class="calc-highlight"><strong>Derece, bir polinoma bağlı en önemli tek sayıdır.</strong> Fonksiyonun büyük $x$ için nasıl davrandığını (sonraki bölüm), grafiğin x-eksenini en fazla kaç kez kesebileceğini (en fazla $n$ kez, ders L48), türevin dereceyi kaç kez düşüreceğini (her türev 1 azaltır), ve ilgili bir diferansiyel denklemin kaç bağımsız çözümü olacağını söyler. Dereceyi hemen okuma alışkanlığı edin.</div>

<div class="calc-formula"><div class="formula-label">DERECE — TANIM</div><div class="formula-main">$$\\deg P(x) \\;=\\; a_k \\neq 0 \\text{ olduğu en büyük } k$$</div><div class="formula-sub">Eşdeğer ifadeyle: $P(x)$'i standart formda (azalan kuvvet) yaz, görünen ilk terimi bul, onun üssünü oku. O üs, derecedir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Derece 0</div><div class="card-body">Sıfırdan farklı bir sabit. Örnek: $P(x) = 7$. Tek terim $7 = 7 \\cdot x^0$.</div></div>
<div class="calc-card"><div class="card-title">Derece 1</div><div class="card-body">Doğrusal polinom. Örnek: $P(x) = -2x + 5$. En yüksek kuvvet $x^1$.</div></div>
<div class="calc-card"><div class="card-title">Derece 2</div><div class="card-body">İkinci derece (kuadratik). Örnek: $P(x) = x^2 - 4x + 1$. En yüksek kuvvet $x^2$.</div></div>
<div class="calc-card"><div class="card-title">Derece $n$</div><div class="card-body">En yüksek sıfırdan farklı kuvvet neyse o. Üst sınır yok: $P(x) = x^{100} + 1$ gayet geçerli bir 100. derece polinomdur.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Her polinomun derecesini bul.<br>(a) $P(x) = 4x^7 - 3x^5 + x$<br>(b) $Q(x) = 5$<br>(c) $R(x) = (x^2 - 1)(x^3 + 2x)$<br><br>(a) Sıfırdan farklı katsayıyla en büyük üs 7. <strong>$\\deg P = 7$.</strong><br>(b) Sabit 5 = $5 \\cdot x^0$. <strong>$\\deg Q = 0$.</strong><br>(c) Aç: $R(x) = x^5 + 2x^3 - x^3 - 2x = x^5 + x^3 - 2x$. En büyük üs 5. <strong>$\\deg R = 5$.</strong> Kısayol: $\\deg(P \\cdot Q) = \\deg P + \\deg Q = 2 + 3 = 5$.</div></div>

<div class="l-note"><strong>Özel bir durum — sıfır polinomu.</strong> $P(x) = 0$ polinomu (her katsayısı sıfır) yukarıdaki kurala göre iyi tanımlı bir dereceye sahip değildir. Bazı kitaplar kolaylık için $-\\infty$ atar; bazıları tanımsız der. Bu derste, derece ile ilgili her ifadeden basitçe dışlayacağız.</div>

<h2 class="lesson-title">4. Baş Katsayı ve Sabit Terim</h2>

<div class="calc-highlight"><strong>İki katsayının özel adları vardır çünkü özel davranışı yönetirler.</strong> <em>Baş katsayı</em> $a_n$, grafiğin sonsuzda ne yaptığını kontrol eder. <em>Sabit terim</em> $a_0$, $x = 0$'daki polinom değeridir — yani grafiğin y-eksenini kestiği nokta.</div>

<div class="calc-formula"><div class="formula-label">BAŞ KATSAYI &amp; SABİT TERİM</div><div class="formula-main">$$a_n \\;=\\; x^n \\text{ katsayısı} \\;\\;(\\text{baş terim})$$ $$a_0 \\;=\\; P(0) \\;\\;(\\text{sabit terim, } = y\\text{-kesim noktası})$$</div></div>

<p class="l-text"><strong>Okuma.</strong> Polinomu standart formda yaz (önce en yüksek kuvvet). İlk terimin önündeki sayı $a_n$'dir. Üzerinde $x$ olmayan sayı $a_0$'dır. Eğer $a_0$ tamamen eksikse, sıfıra eşittir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Her polinom için dereceyi, baş katsayıyı ve sabit terimi ver.<br>(a) $P(x) = -3x^4 + 2x^2 - 7x + 5$<br>(b) $Q(x) = x^6 + 2x$<br>(c) $R(x) = \\dfrac{1}{2} x - 4$<br><br>(a) Derece 4, baş katsayı $a_4 = -3$, sabit terim $a_0 = 5$.<br>(b) Derece 6, baş katsayı $a_6 = 1$, sabit terim $a_0 = 0$ (sabit yazılmamış).<br>(c) Derece 1, baş katsayı $a_1 = 1/2$, sabit terim $a_0 = -4$.</div></div>

<div class="think-box"><div class="think-label">GÖRSEL YORUM</div><div class="think-body">Sabit terim $a_0 = P(0)$, grafiğin y-eksenini kestiği y-koordinatıdır. Dene: $P(x) = -3x^4 + 2x^2 - 7x + 5$ ifadesinde $x = 0$ koy — $x$'li her terim yok olur, $P(0) = 5$ kalır. Grafik $(0, 5)$ noktasından geçer. Her zaman.</div></div>

<h2 class="lesson-title">5. Polinomları Dereceye Göre Adlandırma</h2>

<div class="calc-highlight"><strong>Düşük dereceli polinomların klasik adları vardır; bu adları görür görmez bilmelisin.</strong> Bu adlar bundan sonra her ders kitabında, her sınavda, her makalede karşına çıkacak — hem matematikte hem fizik, mühendislik ve ekonomide. İlk beşi ezberle.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Derece</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ad</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Genel form</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Tipik grafik</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">0</td><td style="padding:0.5rem 0.8rem"><strong>Sabit</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_0$</td><td style="padding:0.5rem 0.8rem">Yatay doğru</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">1</td><td style="padding:0.5rem 0.8rem"><strong>Doğrusal</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_1 x + a_0$</td><td style="padding:0.5rem 0.8rem">Düz çizgi, eğim $a_1$</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem"><strong>İkinci derece (kuadratik)</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_2 x^2 + a_1 x + a_0$</td><td style="padding:0.5rem 0.8rem">Parabol (U ya da ∩)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">3</td><td style="padding:0.5rem 0.8rem"><strong>Üçüncü derece (kübik)</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_3 x^3 + \\ldots$</td><td style="padding:0.5rem 0.8rem">S-şekli, uçlar zıt yönlerde</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">4</td><td style="padding:0.5rem 0.8rem"><strong>Dördüncü derece (kuartik)</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_4 x^4 + \\ldots$</td><td style="padding:0.5rem 0.8rem">W ya da M-şekli, iki uç aynı yönde</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">5</td><td style="padding:0.5rem 0.8rem"><strong>Beşinci derece (kuintik)</strong></td><td style="padding:0.5rem 0.8rem">$P(x) = a_5 x^5 + \\ldots$</td><td style="padding:0.5rem 0.8rem">Uzatılmış S, zıt uçlar</td></tr>
<tr><td style="padding:0.5rem 0.8rem">$n$</td><td style="padding:0.5rem 0.8rem">$n$. dereceden polinom</td><td style="padding:0.5rem 0.8rem">$P(x) = a_n x^n + \\ldots$</td><td style="padding:0.5rem 0.8rem">En fazla $n - 1$ dönüm noktası</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l47-types-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ilk beş derece sınıfından (1'den 5'e) birer temsilci grafik aynı eksende çizilmiş, böylece şekilleri gözle karşılaştırabilirsin. Dönüm sayısının dereceyle birlikte arttığına dikkat et; ve kübik ile kuintik grafiklerinin <em>zıt</em> yönlerde, doğrusal/ikinci/dördüncü dereceninse <em>aynı</em> yönde (her iki uçta da yukarı ya da aşağı) sonlandığına bak.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-25;i<=25;i++){xs.push(i*0.1);}
var lin=xs.map(function(x){return x;});
var qua=xs.map(function(x){return x*x-1;});
var cub=xs.map(function(x){return 0.4*x*x*x-x;});
var quart=xs.map(function(x){return 0.15*Math.pow(x,4)-x*x;});
var quint=xs.map(function(x){return 0.06*Math.pow(x,5)-0.5*x*x*x+x;});
var t1={x:xs,y:lin,mode:'lines',name:'Doğrusal $y=x$',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:qua,mode:'lines',name:'İkinci derece $y=x^2-1$',line:{color:'#10b981',width:2.5}};
var t3={x:xs,y:cub,mode:'lines',name:'Kübik $y=0.4x^3-x$',line:{color:'#f59e0b',width:2.5}};
var t4={x:xs,y:quart,mode:'lines',name:'Kuartik $y=0.15x^4-x^2$',line:{color:'#ef4444',width:2.5}};
var t5={x:xs,y:quint,mode:'lines',name:'Kuintik $y=0.06x^5-0.5x^3+x$',line:{color:'#a855f7',width:2.5}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-2.6,2.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y = P(x)',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l47-types-tr',[t1,t2,t3,t4,t5],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">ÖRÜNTÜ</div><div class="think-body">$n$. dereceden bir polinomun <strong>en fazla $n - 1$ dönüm noktası</strong> vardır (grafiğin çıkıştan inişe ya da tersine geçtiği yerler). Doğrusal (derece 1) 0 dönüme sahip. İkinci derece (derece 2) 1 dönüme sahip (tepe). Kübik (derece 3) en fazla 2 dönüm. Kuartik (derece 4) en fazla 3 dönüm. Bu, <em>maksimumdur</em>; gerçek sayı bazı dönümler aynı yükseklikte olursa veya çakışırsa daha az olabilir.</div></div>

<h2 class="lesson-title">6. Polinom Toplama ve Çıkarma</h2>

<div class="calc-highlight"><strong>İki polinomu toplamak veya çıkarmak için benzer terimleri (aynı $x$ kuvvetine sahip) yan yana getir ve katsayılarını topla veya çıkar.</strong> Kuvvetler aynı kalır. Değişken hiçbir şey yapmaz — sadece "burası $x^k$ kutusu" diyen bir yer tutucudur.</div>

<div class="calc-formula"><div class="formula-label">POLİNOM TOPLAMA</div><div class="formula-main">$$P(x) + Q(x) \\;=\\; \\sum_{k} (a_k + b_k) x^k$$</div><div class="formula-sub">Burada $a_k$, $P$'deki $x^k$'nin katsayısı; $b_k$ ise $Q$'daki $x^k$'nin katsayısıdır. Eksik terimleri katsayısı 0 olarak kabul et.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$(3x^3 + 2x^2 - x + 5) + (x^3 - 4x^2 + 7)$ ifadesini hesapla.<br><br>Kuvvete göre sırala:<br>$x^3$: $3 + 1 = 4$<br>$x^2$: $2 + (-4) = -2$<br>$x^1$: $-1 + 0 = -1$<br>$x^0$: $5 + 7 = 12$<br><br>Toplam: $\\mathbf{4x^3 - 2x^2 - x + 12}$. Derece değişmedi: hâlâ 3.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$(2x^4 + 3x^2 - 1) - (x^4 - x^2 + 2x + 5)$ ifadesini hesapla.<br><br>Önce eksi işaretini dağıt: $-x^4 + x^2 - 2x - 5$. Sonra topla:<br>$x^4$: $2 - 1 = 1$<br>$x^2$: $3 + 1 = 4$<br>$x^1$: $0 - 2 = -2$<br>$x^0$: $-1 - 5 = -6$<br><br>Fark: $\\mathbf{x^4 + 4x^2 - 2x - 6}$.</div></div>

<div class="l-note"><strong>Toplamın derecesi.</strong> Genellikle $\\deg(P + Q) = \\max(\\deg P, \\deg Q)$. Ama dikkat: baş terimler <em>sadeleşirse</em>, toplamın derecesi daha küçük olur. Örneğin, $(x^3 + x) + (-x^3 + 2x^2) = 2x^2 + x$ — her iki toplanan da 3. derece olduğu hâlde sonuç 2. derece.</div>

<div class="think-box"><div class="think-label">ÖZELLİKLER</div><div class="think-body">Polinom toplama <em>değişmelidir</em> ($P + Q = Q + P$), <em>birleşmelidir</em> ($(P + Q) + R = P + (Q + R)$), bir <em>birim eleman</em>a sahiptir (sıfır polinomu: $P + 0 = P$), ve her polinomun bir <em>toplamaya göre tersi</em> vardır ($P + (-P) = 0$). Bunlar, sıradan sayıların sahip olduğu özelliklerin aynısıdır; polinomlar genişletilmiş bir aritmetik gibi davranır.</div></div>

<h2 class="lesson-title">7. $P(a)$ Değerini Hesaplama: Bir Noktadaki Polinom Değeri</h2>

<div class="calc-highlight"><strong>$P(a)$'yı bulmak için formüldeki her $x$'in yerine $a$ sayısını koy, sonra aritmetik olarak sadeleştir.</strong> Hepsi bu kadar. Sonuç tek bir gerçek sayıdır — polinomun o noktadaki değeri, eşdeğer biçimde grafiğin $x = a$ üzerindeki noktasının y-koordinatı.</div>

<div class="calc-formula"><div class="formula-label">DEĞER HESAPLAMA</div><div class="formula-main">$$P(a) \\;=\\; a_n a^n + a_{n-1} a^{n-1} + \\cdots + a_1 a + a_0$$</div><div class="formula-sub">Yerine koy, her kuvveti hesapla, katsayıyla çarp, hepsini topla.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1</div><div class="example-body">$P(x) = 2x^3 - 5x^2 + 4x - 1$ için $P(2)$'yi bul.<br><br>$P(2) = 2(2)^3 - 5(2)^2 + 4(2) - 1$<br>$\\quad\\;\\, = 2 \\cdot 8 - 5 \\cdot 4 + 8 - 1$<br>$\\quad\\;\\, = 16 - 20 + 8 - 1$<br>$\\quad\\;\\, = \\mathbf{3}$.<br><br>Yani $P$'nin grafiği $(2, 3)$ noktasından geçer.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2</div><div class="example-body">$P(x) = x^4 - 3x^2 + 7$ için $P(-1)$'i bul.<br><br>$P(-1) = (-1)^4 - 3(-1)^2 + 7 = 1 - 3 + 7 = \\mathbf{5}$.<br><br><strong>Negatif tabanların işaretlerine dikkat:</strong> $(-1)^4 = +1$ (çift kuvvet), $(-1)^3 = -1$ (tek kuvvet) ve böyle devam. Parantezleri cömertçe kullan.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3</div><div class="example-body">$P(x) = x^2 - 4$ için $P(0)$, $P(2)$ ve $P(-2)$'yi bul.<br><br>$P(0) = -4$ (y-kesim noktası). $P(2) = 4 - 4 = 0$. $P(-2) = 4 - 4 = 0$.<br><br>Hem $x = 2$ hem de $x = -2$, $P$'nin <em>kökü</em>dür ($P(x) = 0$ olan değerler). Kökleri sistematik olarak L48 dersinde inceleyeceğiz.</div></div>

<div class="l-note"><strong>Verimli bir hesaplama algoritması.</strong> Horner şeması (L49'da sentetik bölme ile birlikte ele alınır) $P(x) = a_n x^n + \\ldots + a_0$ ifadesini iç içe çarpıma dönüştürür: $((\\ldots((a_n x + a_{n-1})x + a_{n-2})x + \\ldots)x + a_0$. Yalnızca $n$ çarpma ve $n$ toplama kullanır — minimum. Şimdilik doğrudan yerine koyma yeterlidir.</div>

<h2 class="lesson-title">8. Sonsuz Davranış: $x \\to \\pm\\infty$ İken Ne Olur</h2>

<div class="calc-highlight"><strong>Büyük $|x|$ için baş terim $a_n x^n$ her şeye baskındır.</strong> Daha düşük dereceli tüm terimler ($a_{n-1} x^{n-1}, \\ldots, a_0$) karşılaştırıldığında önemsiz hâle gelir. Yani bir polinom grafiğinin <em>sonsuz davranışı</em> — uzak sağda ve uzak solda ne yaptığı — yalnızca iki şeye bağlıdır: $n$'nin tek mi çift mi olduğu, ve $a_n$'nin pozitif mi negatif mi olduğu.</div>

<p class="l-text">Somut olarak: $x$ mutlak değerce çok büyürse, $|x^n|$, $|x^{n-1}|$'den çok daha hızlı büyür. Dolayısıyla büyük $|x|$ için $P(x) \\approx a_n x^n$. Bu, grafiğin sonunda baş monom $a_n x^n$ gibi yükseldiğini veya düştüğünü gösterir. Dört durum şunlardır:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$n$'nin paritesi</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$a_n$'nin işareti</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x \\to -\\infty$ iken</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x \\to +\\infty$ iken</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Şekil hatırlatıcı</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Çift ($n=2,4,6,\\ldots$)</td><td style="padding:0.5rem 0.8rem">Pozitif ($a_n &gt; 0$)</td><td style="padding:0.5rem 0.8rem">$P(x) \\to +\\infty$</td><td style="padding:0.5rem 0.8rem">$P(x) \\to +\\infty$</td><td style="padding:0.5rem 0.8rem">$y = x^2$ gibi: iki uç da YUKARI</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Çift</td><td style="padding:0.5rem 0.8rem">Negatif ($a_n &lt; 0$)</td><td style="padding:0.5rem 0.8rem">$P(x) \\to -\\infty$</td><td style="padding:0.5rem 0.8rem">$P(x) \\to -\\infty$</td><td style="padding:0.5rem 0.8rem">$y = -x^2$ gibi: iki uç da AŞAĞI</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Tek ($n=1,3,5,\\ldots$)</td><td style="padding:0.5rem 0.8rem">Pozitif</td><td style="padding:0.5rem 0.8rem">$P(x) \\to -\\infty$</td><td style="padding:0.5rem 0.8rem">$P(x) \\to +\\infty$</td><td style="padding:0.5rem 0.8rem">$y = x^3$ gibi: sol-aşağı, sağ-yukarı</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Tek</td><td style="padding:0.5rem 0.8rem">Negatif</td><td style="padding:0.5rem 0.8rem">$P(x) \\to +\\infty$</td><td style="padding:0.5rem 0.8rem">$P(x) \\to -\\infty$</td><td style="padding:0.5rem 0.8rem">$y = -x^3$ gibi: sol-yukarı, sağ-aşağı</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l47-end-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> dört sonsuz davranış örüntüsünün hepsi yan yana. Sol-üst: çift derece, pozitif baş katsayı ($y = x^4$, iki uç yukarı). Sağ-üst: çift derece, negatif baş katsayı ($y = -x^4$, iki uç aşağı). Sol-alt: tek derece, pozitif baş katsayı ($y = x^3$, sol-aşağı sağ-yukarı). Sağ-alt: tek derece, negatif baş katsayı ($y = -x^3$, sol-yukarı sağ-aşağı). İç kısımdaki kıvrımlar (düşük dereceli terimlerin sebep olduğu) sonsuz davranışı hiç etkilemez.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-30;i<=30;i++){xs.push(i*0.1);}
var ePP=xs.map(function(x){return Math.pow(x,4)-3*x*x;});
var eNN=xs.map(function(x){return -Math.pow(x,4)+3*x*x;});
var oPP=xs.map(function(x){return Math.pow(x,3)-3*x;});
var oNN=xs.map(function(x){return -Math.pow(x,3)+3*x;});
var s1={x:xs,y:ePP,mode:'lines',name:'Çift +: $y=x^4-3x^2$',line:{color:'#3b82f6',width:2.5},xaxis:'x1',yaxis:'y1'};
var s2={x:xs,y:eNN,mode:'lines',name:'Çift −: $y=-x^4+3x^2$',line:{color:'#ef4444',width:2.5},xaxis:'x2',yaxis:'y2'};
var s3={x:xs,y:oPP,mode:'lines',name:'Tek +: $y=x^3-3x$',line:{color:'#10b981',width:2.5},xaxis:'x3',yaxis:'y3'};
var s4={x:xs,y:oNN,mode:'lines',name:'Tek −: $y=-x^3+3x$',line:{color:'#f59e0b',width:2.5},xaxis:'x4',yaxis:'y4'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist',size:10},
xaxis:{domain:[0,0.46],range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},
yaxis:{domain:[0.55,1],range:[-6,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},
xaxis2:{domain:[0.54,1],range:[-3,3],anchor:'y2',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},
yaxis2:{domain:[0.55,1],range:[-12,6],anchor:'x2',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},
xaxis3:{domain:[0,0.46],range:[-3,3],anchor:'y3',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},
yaxis3:{domain:[0,0.45],range:[-12,12],anchor:'x3',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},
xaxis4:{domain:[0.54,1],range:[-3,3],anchor:'y4',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'x'},
yaxis4:{domain:[0,0.45],range:[-12,12],anchor:'x4',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',title:'y'},
margin:{t:30,r:20,b:40,l:50},legend:{orientation:'h',y:-0.12,xanchor:'center',x:0.5,font:{size:9}},
annotations:[
{x:0.23,y:1.02,xref:'paper',yref:'paper',text:'<b>Çift derece, +a<sub>n</sub></b>',showarrow:false,font:{color:'#3b82f6',size:11}},
{x:0.77,y:1.02,xref:'paper',yref:'paper',text:'<b>Çift derece, −a<sub>n</sub></b>',showarrow:false,font:{color:'#ef4444',size:11}},
{x:0.23,y:0.47,xref:'paper',yref:'paper',text:'<b>Tek derece, +a<sub>n</sub></b>',showarrow:false,font:{color:'#10b981',size:11}},
{x:0.77,y:0.47,xref:'paper',yref:'paper',text:'<b>Tek derece, −a<sub>n</sub></b>',showarrow:false,font:{color:'#f59e0b',size:11}}
]};
Plotly.newPlot('plot-l47-end-tr',[s1,s2,s3,s4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$P(x) = -2x^5 + 17x^3 - 1$ ifadesinin sonsuz davranışını grafik çizmeden tahmin et.<br><br>Derece $n = 5$ (tek). Baş katsayı $a_5 = -2$ (negatif). "Tek / negatif" tablo satırını kullan:<br>$x \\to -\\infty$ iken: $P(x) \\to +\\infty$ (sol uçta yükselir).<br>$x \\to +\\infty$ iken: $P(x) \\to -\\infty$ (sağ uçta düşer).<br><br>Hızlı doğrulama: baş terim $-2x^5$. Çok büyük pozitif $x$ için bu çok büyük negatif. Çok negatif $x$ için $(-2)(\\text{çok neg})^5 = (-2)(\\text{çok neg}) = +\\infty$. Tutarlı.</div></div>

<div class="calc-graph"><div id="plot-l47-cubic-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $P(x) = x^3 - 4x$ polinomunun grafiği ve üç gerçek sıfırı işaretli: $x = -2, 0, +2$ (çarpan: $P(x) = x(x-2)(x+2)$). Derece 3 (tek), pozitif baş katsayı: tam tahmin edildiği gibi sol uçta düşer, sağ uçta yükselir. Sıfırlar arasında aşağı-yukarı kıvrım çizer — derece 3, en fazla iki dönüm noktasına izin verir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-28;i<=28;i++){var x=i*0.1;xs.push(x);ys.push(x*x*x-4*x);}
var curve={x:xs,y:ys,mode:'lines',name:'P(x) = x³ − 4x',line:{color:'#3b82f6',width:3}};
var zeros={x:[-2,0,2],y:[0,0,0],mode:'markers+text',name:'Sıfırlar',marker:{color:'#f59e0b',size:11},text:['x=−2','x=0','x=+2'],textposition:'top center',textfont:{color:'#e8e8e8',size:11}};
var ax={x:[-3,3],y:[0,0],mode:'lines',name:'x-ekseni',line:{color:'rgba(255,255,255,0.25)',width:1},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-3,3],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'y = P(x)',range:[-6,6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l47-cubic-tr',[curve,ax,zeros],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Bu neden önemli.</strong> Sonsuz davranış, bir polinomun en az kaç köke sahip olmak <em>zorunda</em> olduğunu belirler. Tek dereceli bir polinom x-eksenini en az bir kez kesmek zorundadır (çünkü bir uç $+\\infty$'a, diğeri $-\\infty$'a gider; sürekli bir grafik ekseni atlayamaz). Çift dereceli bir polinom hiç kesmeyebilir (eğer iki uç da yukarı gidiyorsa ve minimum değer pozitifse). Derece, baş katsayı ve gerçek kök sayısı arasındaki bu bağlantı L48'in ayrıntılı geliştireceği konudur.</div>

<h2 class="lesson-title">9. Klasik Alıştırmalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Alıştırma 1 — Polinom mu, değil mi?</div><div class="card-body">Her birinin $x$'te polinom olup olmadığına karar ver. (a) $f = 3x^2 - \\sqrt{5}\\, x + 1$; (b) $f = x^{-3} + x$; (c) $f = \\sqrt{x^4 + 1}$; (d) $f = (2x+1)^5$.<br><br><strong>Cevap:</strong> (a) Evet, derece 2 (katsayı $-\\sqrt{5}$ sabit). (b) Hayır, negatif üs. (c) Hayır, sadeleşmeyen kök altındaki $x$. (d) Evet, açılım derece 5 polinom verir.</div></div>

<div class="calc-card"><div class="card-title">Alıştırma 2 — Derece ve katsayılar</div><div class="card-body">$P(x) = -4x^5 + x^4 - 7x^2 + 3$ için dereceyi, baş katsayıyı ve sabit terimi belirle.<br><br><strong>Cevap:</strong> $\\deg P = 5$, baş katsayı $a_5 = -4$, sabit terim $a_0 = 3$.</div></div>

<div class="calc-card"><div class="card-title">Alıştırma 3 — Topla</div><div class="card-body">$(2x^4 - x^3 + 5) + (-x^4 + 3x^3 - 2x + 1)$ ifadesini hesapla.<br><br><strong>Cevap:</strong> $x^4 + 2x^3 - 2x + 6$. Derece 4.</div></div>

<div class="calc-card"><div class="card-title">Alıştırma 4 — Çıkar</div><div class="card-body">$(x^3 + 2x - 5) - (x^3 - x^2 + 4)$ ifadesini hesapla.<br><br><strong>Cevap:</strong> $x^2 + 2x - 9$. Kübik terimlerin sadeleştiğine dikkat — derece 3'ten 2'ye düştü.</div></div>

<div class="calc-card"><div class="card-title">Alıştırma 5 — Değer hesaplama</div><div class="card-body">$P(x) = 3x^3 - 2x^2 + x - 4$ için $P(1)$ ve $P(-2)$'yi hesapla.<br><br><strong>Cevap:</strong> $P(1) = 3 - 2 + 1 - 4 = -2$. $P(-2) = 3(-8) - 2(4) + (-2) - 4 = -24 - 8 - 2 - 4 = -38$.</div></div>

<div class="calc-card"><div class="card-title">Alıştırma 6 — y-kesim noktası</div><div class="card-body">$P(x) = -x^4 + 3x^2 - 5x + 7$ ifadesinin y-kesim noktasını bul.<br><br><strong>Cevap:</strong> y-kesim noktası $P(0) = 7$. Sabit terim doğrudan verir.</div></div>

<div class="calc-card"><div class="card-title">Alıştırma 7 — Sonsuz davranış</div><div class="card-body">Şunların sonsuz davranışını açıkla: (a) $P(x) = 4x^6 - x^2 + 1$ ve (b) $Q(x) = -3x^7 + x^4 - 2x$.<br><br><strong>Cevap:</strong> (a) Derece 6 (çift), baş katsayı $+4 &gt; 0$. İki uç da yükselir: $x \\to \\pm\\infty$ iken $P \\to +\\infty$. (b) Derece 7 (tek), baş katsayı $-3 &lt; 0$. Sol-yukarı, sağ-aşağı: $x \\to -\\infty$ iken $Q \\to +\\infty$ ve $x \\to +\\infty$ iken $Q \\to -\\infty$.</div></div>

<div class="calc-card"><div class="card-title">Alıştırma 8 — Bilinmeyen katsayıyı bul</div><div class="card-body">$P(x) = 2x^3 + kx^2 - 5x + 1$ polinomu $P(1) = 0$ şartını sağlıyor. $k$'yı bul.<br><br><strong>Cevap:</strong> $P(1) = 2 + k - 5 + 1 = k - 2$. $k - 2 = 0 \\Rightarrow k = 2$ koy. Yani $P(x) = 2x^3 + 2x^2 - 5x + 1$.</div></div>
</div>

<div class="lesson-outcomes" style="background:rgba(16,185,129,0.06);border-left:3px solid #10b981;padding:1rem 1.2rem;margin:2rem 0 1rem;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#10b981;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Polinom $P(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_0$ formunda, $n \\in \\mathbb{N}_0$, $a_n \\neq 0$</li>
<li>Polinomlar şunları yasaklar: negatif üs, kesirli üs, paydada $x$, kök altında $x$</li>
<li>Derece = sıfırdan farklı katsayıyla en büyük üs; baş katsayı = $a_n$; sabit terim = $a_0 = P(0)$</li>
<li>Dereceye göre adlar: sabit (0), doğrusal (1), ikinci derece (2), üçüncü derece (3), dördüncü derece (4), beşinci derece (5)</li>
<li>Benzer terimleri (aynı kuvvet) toplayarak/çıkararak işlem</li>
<li>$P(a)$ = $x = a$ koy ve sadeleştir; $x = a$'da grafiğin y-koordinatını verir</li>
<li>Sonsuz davranış ($n$'nin paritesi) ve ($a_n$'nin işareti) ile belirlenir: dört durum, hepsi 8. bölümde tablo hâlinde</li>
</ul>
</div>`

};
