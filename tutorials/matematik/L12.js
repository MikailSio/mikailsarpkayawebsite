window.LISE_MAT_L12 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The previous lesson built the idea of a limit from pictures and tables.</strong> That intuition is essential, but on its own it is too slow: you cannot tabulate a hundred values every time you want to evaluate $\\lim_{x \\to 2}(3x^2 - 5x + 4)$. What we need now is a set of <em>rules</em> — a small algebra of limits — that lets us replace numerical experiments with a few lines of clean arithmetic.</p>

<p class="l-text">This lesson is exactly that. We list the limit laws (sum, difference, product, quotient, constant multiple), apply them to polynomials and rational functions, and then move to the cases where direct substitution fails — the famous $\\tfrac{0}{0}$ indeterminate form — and learn two repair techniques: factoring and conjugate multiplication. We close with three special limits that appear constantly in calculus: the trigonometric limit $\\sin(x)/x$, the exponential limit $(1+1/n)^n$ that defines $e$, and the logarithmic companion $\\ln(1+x)/x$.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State and apply the five limit laws (sum, difference, product, quotient, constant multiple)</li>
<li>Evaluate any polynomial limit by direct substitution and explain why this works</li>
<li>Evaluate a rational function limit when the denominator does not vanish, and recognise when it does</li>
<li>Resolve the $0/0$ indeterminate form by factoring the numerator and cancelling the common factor</li>
<li>Resolve a limit involving square roots by multiplying numerator and denominator by the conjugate</li>
<li>Use the three special limits $\\lim_{x\\to 0}\\sin(x)/x = 1$, $\\lim_{n\\to\\infty}(1+1/n)^n = e$, and $\\lim_{x\\to 0}\\ln(1+x)/x = 1$</li>
</ul>
</div>

<h2 class="lesson-title">1. The Algebra of Limits: Five Laws</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> if two cars are approaching the same intersection — one from the north at a known speed, the other from the east at a known speed — their <em>combined</em> behaviour is entirely predictable from their separate behaviours. The limit laws say the same thing about functions: if you know what $f$ and $g$ do near $x = a$ separately, you know what $f+g$, $f-g$, $fg$, and $f/g$ do near $x = a$ together. No surprises.</div>

<p class="l-text">Suppose two limits exist: $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$, where $L$ and $M$ are finite real numbers. Then the following identities hold:</p>

<div class="calc-formula"><div class="formula-label">SUM LAW</div><div class="formula-main">$$\\lim_{x \\to a} \\bigl[ f(x) + g(x) \\bigr] \\;=\\; L + M$$</div><div class="formula-sub">The limit of a sum is the sum of the limits.</div></div>

<div class="calc-formula"><div class="formula-label">DIFFERENCE LAW</div><div class="formula-main">$$\\lim_{x \\to a} \\bigl[ f(x) - g(x) \\bigr] \\;=\\; L - M$$</div><div class="formula-sub">The limit of a difference is the difference of the limits.</div></div>

<div class="calc-formula"><div class="formula-label">PRODUCT LAW</div><div class="formula-main">$$\\lim_{x \\to a} \\bigl[ f(x) \\cdot g(x) \\bigr] \\;=\\; L \\cdot M$$</div><div class="formula-sub">The limit of a product is the product of the limits.</div></div>

<div class="calc-formula"><div class="formula-label">QUOTIENT LAW</div><div class="formula-main">$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} \\;=\\; \\frac{L}{M} \\qquad (M \\neq 0)$$</div><div class="formula-sub">The limit of a quotient is the quotient of the limits — provided the denominator's limit is not zero.</div></div>

<div class="calc-formula"><div class="formula-label">CONSTANT MULTIPLE LAW</div><div class="formula-main">$$\\lim_{x \\to a} \\bigl[ c \\cdot f(x) \\bigr] \\;=\\; c \\cdot L \\qquad (c \\in \\mathbb{R})$$</div><div class="formula-sub">A constant pulls out of the limit unchanged.</div></div>

<p class="l-text"><strong>Why these laws are true.</strong> Each one follows directly from the definition: "f gets close to L and g gets close to M, so f+g gets close to L+M." The proofs are short ε-δ arguments — you do not need them at high-school level, but you should believe that they exist and trust the laws as a working tool.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Both limits must exist</div><div class="card-body">If $\\lim f$ does not exist, you cannot use the sum law to compute $\\lim (f+g)$ — even if $\\lim g$ exists. The hypotheses matter.</div></div>
<div class="calc-card"><div class="card-title">Denominator must not vanish</div><div class="card-body">The quotient law requires $M \\neq 0$. When $M = 0$ we have to investigate by hand (sections 4 and 5).</div></div>
<div class="calc-card"><div class="card-title">Powers and roots follow</div><div class="card-body">From the product law you get $\\lim f^n = L^n$ for any positive integer $n$. For $n$-th roots, $\\lim \\sqrt[n]{f} = \\sqrt[n]{L}$ whenever the root is defined.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\lim_{x \\to 3} \\bigl[ 2x^2 - 5x + 7 \\bigr]$ using the limit laws step by step.<br><br>
Step 1 — sum/difference law:&nbsp; $\\lim_{x\\to 3}(2x^2) - \\lim_{x\\to 3}(5x) + \\lim_{x\\to 3} 7$.<br>
Step 2 — constant multiple law:&nbsp; $2 \\cdot \\lim_{x\\to 3} x^2 - 5 \\cdot \\lim_{x\\to 3} x + \\lim_{x\\to 3} 7$.<br>
Step 3 — power law and basic limits:&nbsp; $\\lim_{x\\to 3} x = 3$, so $\\lim_{x\\to 3} x^2 = 9$; the limit of the constant 7 is 7.<br>
Step 4 — combine:&nbsp; $2 \\cdot 9 - 5 \\cdot 3 + 7 = 18 - 15 + 7 = \\mathbf{10}$.<br><br>
Notice that the final number, 10, is exactly what you get by plugging $x = 3$ directly into the polynomial. Section 2 explains why this is always allowed.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If $\\lim_{x\\to 0} f(x)$ does not exist but $\\lim_{x\\to 0} [f(x) + g(x)]$ does exist, what can you say about $\\lim_{x\\to 0} g(x)$? It cannot exist either — if it did, the sum law applied in reverse would force $\\lim f$ to exist, contradiction. So "non-existent + existent = existent" is impossible.</div></div>

<h2 class="lesson-title">2. Polynomial Limits: Just Substitute</h2>

<div class="calc-highlight"><strong>The headline result:</strong> every polynomial $P(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0$ is <em>continuous</em> at every real number $a$. That means $\\lim_{x \\to a} P(x) = P(a)$. Computing a polynomial limit is therefore as easy as evaluating the polynomial at the point — no algebra needed.</div>

<p class="l-text">Why is this true? Look at the building blocks. The constant function $f(x) = c$ has $\\lim_{x \\to a} c = c$ for any $a$. The identity function $f(x) = x$ has $\\lim_{x \\to a} x = a$. Every polynomial is built from these two functions using addition, subtraction, multiplication, and constant multiples — and section 1 told us that all four operations preserve limits. So the limit of any polynomial as $x \\to a$ is obtained by substituting $a$ everywhere $x$ appears.</p>

<div class="calc-formula"><div class="formula-label">POLYNOMIAL LIMIT RULE</div><div class="formula-main">$$\\lim_{x \\to a} P(x) \\;=\\; P(a)$$</div><div class="formula-sub">Direct substitution: replace x with a in the polynomial and compute.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\lim_{x \\to -2} \\bigl[ x^3 + 4x^2 - x + 6 \\bigr]$.<br><br>
Substitute $x = -2$:<br><br>
$(-2)^3 + 4 \\cdot (-2)^2 - (-2) + 6 = -8 + 16 + 2 + 6 = \\mathbf{16}$.<br><br>
Total work: one substitution. No factoring, no tables, no ε-δ.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\lim_{x \\to 1} \\bigl[ 5x^4 - 3x^2 + 2x - 9 \\bigr]$.<br><br>
Substitute $x = 1$: $5 - 3 + 2 - 9 = \\mathbf{-5}$.</div></div>

<div class="l-note"><strong>Why this matters for the rest of calculus:</strong> polynomial limits are the warm-up. Derivatives of polynomials, integrals of polynomials, Taylor approximations — all rely silently on the fact that you can just plug in.</div>

<h2 class="lesson-title">3. Rational Function Limits</h2>

<div class="calc-highlight"><strong>A rational function</strong> is a quotient of two polynomials, $R(x) = P(x) / Q(x)$. As long as the denominator polynomial $Q$ does not vanish at the point $a$, the quotient law applies and the limit is computed by direct substitution — exactly the same trick as in section 2.</div>

<div class="calc-formula"><div class="formula-label">RATIONAL FUNCTION LIMIT RULE</div><div class="formula-main">$$\\lim_{x \\to a} \\frac{P(x)}{Q(x)} \\;=\\; \\frac{P(a)}{Q(a)} \\qquad \\text{when } Q(a) \\neq 0$$</div><div class="formula-sub">Plug a into the numerator and denominator separately. Divide.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 4} \\frac{x^2 - 3x + 5}{2x + 1}$.<br><br>
Denominator at $x = 4$: $2 \\cdot 4 + 1 = 9 \\neq 0$. We are safe to substitute everywhere.<br><br>
Numerator: $16 - 12 + 5 = 9$.<br>
Answer: $9 / 9 = \\mathbf{1}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to -1} \\frac{x^3 + 2x^2 - x}{x^2 + 3x + 4}$.<br><br>
Denominator at $x = -1$: $1 - 3 + 4 = 2 \\neq 0$.<br>
Numerator at $x = -1$: $-1 + 2 + 1 = 2$.<br>
Answer: $2 / 2 = \\mathbf{1}$.</div></div>

<p class="l-text"><strong>What if the denominator <em>does</em> vanish?</strong> Then the quotient law is silent and we have to dig deeper. Three sub-cases:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Numerator non-zero, denominator zero</div><div class="card-body">Form like $\\tfrac{5}{0}$. The limit is either $+\\infty$, $-\\infty$, or does not exist — we will study one-sided infinite limits in lesson 14.</div></div>
<div class="calc-card"><div class="card-title">Numerator zero, denominator zero ($0/0$)</div><div class="card-body">Indeterminate. The limit might be any real number, $\\pm\\infty$, or DNE. Section 4 shows how to disentangle it.</div></div>
<div class="calc-card"><div class="card-title">Numerator zero, denominator non-zero</div><div class="card-body">Form $\\tfrac{0}{k}$ with $k \\neq 0$. The limit is $0$. Easy case.</div></div>
</div>

<h2 class="lesson-title">4. The $0/0$ Form: Factor and Cancel</h2>

<div class="calc-highlight"><strong>The most common indeterminate form in high-school calculus is $0/0$.</strong> When you substitute $x = a$ into a rational expression and both pieces give zero, do <em>not</em> conclude that the limit is zero or that it does not exist. Instead, factor the numerator and the denominator, cancel the common factor that produced the zero, and try substitution again on the simplified expression.</div>

<p class="l-text">The reason this works: if $(x - a)$ is a factor of both $P(x)$ and $Q(x)$, then for every $x \\neq a$ we may cancel:</p>

<div class="calc-formula"><div class="formula-label">CANCELLATION IDENTITY</div><div class="formula-main">$$\\frac{(x-a) \\cdot \\widetilde{P}(x)}{(x-a) \\cdot \\widetilde{Q}(x)} \\;=\\; \\frac{\\widetilde{P}(x)}{\\widetilde{Q}(x)} \\qquad \\text{for all } x \\neq a$$</div><div class="formula-sub">The simplified function agrees with the original everywhere except at x = a. Because limits ignore the value at x = a, the two have the same limit.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DIFFERENCE OF SQUARES</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$.<br><br>
Direct substitution: $\\tfrac{1-1}{1-1} = \\tfrac{0}{0}$. Indeterminate.<br><br>
Factor the numerator using $a^2 - b^2 = (a-b)(a+b)$:<br>
$x^2 - 1 = (x-1)(x+1)$.<br><br>
So $\\displaystyle \\frac{x^2 - 1}{x - 1} = \\frac{(x-1)(x+1)}{x-1} = x + 1$ for every $x \\neq 1$.<br><br>
Take the limit of the simplified expression: $\\lim_{x \\to 1}(x+1) = \\mathbf{2}$.</div></div>

<div class="calc-graph"><div id="plot-l12-hole-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the function $f(x) = (x^2-1)/(x-1)$ traces the straight line $y = x + 1$ everywhere except at $x = 1$, where it has a "hole" (the function is undefined there). The open circle marks the hole; the value the function approaches from both sides is $y = 2$, which is the limit.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=-20;i<=98;i++){var x=i/20;xL.push(x);yL.push(x+1);}
var xR=[];var yR=[];for(var i=102;i<=200;i++){var x=i/20;xR.push(x);yR.push(x+1);}
var tL={x:xL,y:yL,mode:'lines',name:'f(x) left of 1',line:{color:'#3b82f6',width:2.5}};
var tR={x:xR,y:yR,mode:'lines',name:'f(x) right of 1',line:{color:'#3b82f6',width:2.5},showlegend:false};
var hole={x:[1],y:[2],mode:'markers',name:'hole at x = 1',marker:{size:14,color:'rgba(0,0,0,0)',line:{color:'#ef4444',width:2.5}}};
var limPt={x:[1],y:[2],mode:'markers+text',name:'limit = 2',marker:{size:6,color:'#ef4444'},text:['  limit = 2'],textposition:'middle right',textfont:{color:'#ef4444',size:13}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.2,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-0.6,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l12-hole-en',[tL,tR,hole,limPt],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TRINOMIAL FACTORING</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 2} \\frac{x^2 - 5x + 6}{x - 2}$.<br><br>
Direct substitution: $\\tfrac{4 - 10 + 6}{0} = \\tfrac{0}{0}$.<br><br>
Factor the numerator. We need two numbers that multiply to 6 and add to $-5$: those are $-2$ and $-3$.<br>
So $x^2 - 5x + 6 = (x-2)(x-3)$.<br><br>
Cancel: $\\displaystyle \\frac{(x-2)(x-3)}{x-2} = x - 3$ for $x \\neq 2$.<br><br>
$\\lim_{x \\to 2}(x - 3) = 2 - 3 = \\mathbf{-1}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — BOTH SIDES FACTOR</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to -3} \\frac{x^2 + 5x + 6}{x^2 - 9}$.<br><br>
Direct substitution: numerator $9 - 15 + 6 = 0$; denominator $9 - 9 = 0$. Indeterminate.<br><br>
Factor both: $x^2 + 5x + 6 = (x+2)(x+3)$; &nbsp; $x^2 - 9 = (x-3)(x+3)$.<br><br>
Cancel the common $(x+3)$: $\\displaystyle \\frac{(x+2)(x+3)}{(x-3)(x+3)} = \\frac{x+2}{x-3}$ for $x \\neq -3$.<br><br>
Substitute: $\\dfrac{-3 + 2}{-3 - 3} = \\dfrac{-1}{-6} = \\mathbf{\\dfrac{1}{6}}$.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Why is the cancellation legal even though we cannot divide by zero? Because we are looking at the limit as $x$ <em>approaches</em> $-3$, never reaching it. For every $x \\neq -3$ the factor $(x+3)$ is a non-zero number we may divide by. The simplified expression and the original agree on all those points, and that is all the limit ever sees.</div></div>

<h2 class="lesson-title">5. Radicals: The Conjugate Trick</h2>

<div class="calc-highlight"><strong>When square roots appear in a $0/0$ limit, factoring usually does not help directly.</strong> The standard repair is to multiply numerator and denominator by the <em>conjugate</em> of the radical expression. The conjugate of $\\sqrt{A} - \\sqrt{B}$ is $\\sqrt{A} + \\sqrt{B}$, and their product is the difference-of-squares $A - B$ — which kills the root.</div>

<div class="calc-formula"><div class="formula-label">CONJUGATE IDENTITY</div><div class="formula-main">$$(\\sqrt{A} - \\sqrt{B})(\\sqrt{A} + \\sqrt{B}) \\;=\\; A - B$$</div><div class="formula-sub">Multiplying by the conjugate turns a root difference into a polynomial difference.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — CLASSIC CONJUGATE</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sqrt{x + 4} - 2}{x}$.<br><br>
Direct substitution: $\\tfrac{\\sqrt{4} - 2}{0} = \\tfrac{0}{0}$. Indeterminate.<br><br>
Multiply numerator and denominator by the conjugate $\\sqrt{x+4} + 2$:<br><br>
$\\displaystyle \\frac{\\sqrt{x+4} - 2}{x} \\cdot \\frac{\\sqrt{x+4} + 2}{\\sqrt{x+4} + 2} \\;=\\; \\frac{(x+4) - 4}{x \\bigl( \\sqrt{x+4} + 2 \\bigr)} \\;=\\; \\frac{x}{x \\bigl( \\sqrt{x+4} + 2 \\bigr)}$.<br><br>
Cancel $x$ (legal for $x \\neq 0$): $\\displaystyle \\frac{1}{\\sqrt{x+4} + 2}$.<br><br>
Now substitute $x = 0$: $\\dfrac{1}{\\sqrt{4} + 2} = \\dfrac{1}{2 + 2} = \\mathbf{\\dfrac{1}{4}}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — CONJUGATE IN THE DENOMINATOR</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 9} \\frac{x - 9}{\\sqrt{x} - 3}$.<br><br>
Direct substitution: $\\tfrac{0}{0}$.<br><br>
Multiply top and bottom by $\\sqrt{x} + 3$ (the conjugate of the denominator):<br><br>
$\\displaystyle \\frac{(x - 9)(\\sqrt{x} + 3)}{(\\sqrt{x} - 3)(\\sqrt{x} + 3)} \\;=\\; \\frac{(x - 9)(\\sqrt{x} + 3)}{x - 9} \\;=\\; \\sqrt{x} + 3$ for $x \\neq 9$.<br><br>
Substitute: $\\sqrt{9} + 3 = 3 + 3 = \\mathbf{6}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TWO ROOTS</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sqrt{x + 1} - \\sqrt{1 - x}}{x}$.<br><br>
Direct substitution: $\\tfrac{1 - 1}{0} = \\tfrac{0}{0}$.<br><br>
Multiply by the conjugate $\\sqrt{x+1} + \\sqrt{1-x}$:<br><br>
$\\displaystyle \\frac{(x+1) - (1-x)}{x \\bigl( \\sqrt{x+1} + \\sqrt{1-x} \\bigr)} \\;=\\; \\frac{2x}{x \\bigl( \\sqrt{x+1} + \\sqrt{1-x} \\bigr)} \\;=\\; \\frac{2}{\\sqrt{x+1} + \\sqrt{1-x}}$.<br><br>
Substitute $x = 0$: $\\dfrac{2}{1 + 1} = \\mathbf{1}$.</div></div>

<div class="l-note"><strong>Strategy summary.</strong> When you see square roots and a $0/0$ form, your first instinct should be: multiply by the conjugate. The roots disappear, the algebra simplifies, and the limit usually pops out.</div>

<h2 class="lesson-title">6. The Trigonometric Limit: $\\sin(x)/x \\to 1$</h2>

<div class="calc-highlight"><strong>Among all special limits, the most fundamental is</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$. It is the doorway to the derivative of every trigonometric function, the cornerstone of small-angle approximation in physics ($\\sin\\theta \\approx \\theta$ when $\\theta$ is small), and a standard tool for evaluating any limit involving a sine near zero.</div>

<p class="l-text"><strong>Geometric proof outline.</strong> Place a sector of a unit circle with central angle $x$ (where $0 < x < \\pi/2$). The sector contains a small triangle of area $\\tfrac{1}{2} \\sin(x)$, the circular sector itself of area $\\tfrac{1}{2} x$, and a larger triangle of area $\\tfrac{1}{2} \\tan(x)$. Geometric inclusion gives the chain of inequalities:</p>

<div class="calc-formula"><div class="formula-label">SQUEEZE INEQUALITY (FOR $0 < x < \\pi/2$)</div><div class="formula-main">$$\\sin(x) \\;\\leq\\; x \\;\\leq\\; \\tan(x) \\;=\\; \\frac{\\sin(x)}{\\cos(x)}$$</div><div class="formula-sub">Divide every term by sin(x) (positive on this interval): $1 \\le x/\\sin(x) \\le 1/\\cos(x)$.</div></div>

<p class="l-text">Take reciprocals (which reverses inequalities for positives):</p>

<div class="calc-formula"><div class="formula-label">RECIPROCAL CHAIN</div><div class="formula-main">$$\\cos(x) \\;\\leq\\; \\frac{\\sin(x)}{x} \\;\\leq\\; 1$$</div><div class="formula-sub">As x → 0, cos(x) → 1, so sin(x)/x is squeezed between two quantities both heading to 1.</div></div>

<p class="l-text">By the <em>Squeeze Theorem</em> (any function trapped between two functions sharing the same limit must itself have that limit), we conclude $\\sin(x)/x \\to 1$ as $x \\to 0^+$. The same argument with $x$ replaced by $-x$ handles the left side. The two-sided limit therefore equals 1.</p>

<div class="calc-formula"><div class="formula-label">THE TRIGONOMETRIC LIMIT</div><div class="formula-main">$$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} \\;=\\; 1 \\qquad (x \\text{ in radians})$$</div><div class="formula-sub">This is true only if x is measured in radians — the very reason calculus prefers radians over degrees.</div></div>

<div class="calc-graph"><div id="plot-l12-sinc-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the graph of $\\sin(x)/x$ near $x = 0$. The function is undefined exactly at $x = 0$ (you would get 0/0), but the graph passes smoothly through the point $(0, 1)$ from both sides. The red dashed line marks the limit value 1.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-100;i<=100;i++){var x=i/20;if(Math.abs(x)<1e-9)continue;xs.push(x);ys.push(Math.sin(x)/x);}
var trace={x:xs,y:ys,mode:'lines',name:'sin(x)/x',line:{color:'#3b82f6',width:2.5}};
var lim={x:[-5,5],y:[1,1],mode:'lines',name:'limit = 1',line:{color:'#ef4444',width:1.5,dash:'dash'}};
var hole={x:[0],y:[1],mode:'markers',name:'hole at x = 0',marker:{size:14,color:'rgba(0,0,0,0)',line:{color:'#ef4444',width:2.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (radians)',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'sin(x)/x',range:[-0.3,1.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l12-sinc-en',[trace,lim,hole],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Useful variant.</strong> Replacing $x$ by $kx$ inside the limit gives $\\lim_{x \\to 0} \\sin(kx)/x = k$ (for any constant $k$), because $\\sin(kx)/(kx) \\to 1$ and we have to multiply through by $k$. This is the workhorse formula for problems like $\\lim_{x\\to 0} \\sin(5x)/(3x) = 5/3$.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sin(3x)}{x}$.<br><br>
Multiply and divide by 3: $\\displaystyle \\frac{\\sin(3x)}{x} = 3 \\cdot \\frac{\\sin(3x)}{3x}$.<br><br>
As $x \\to 0$ so does $3x$, and $\\sin(3x)/(3x) \\to 1$. Therefore the limit is $3 \\cdot 1 = \\mathbf{3}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sin(5x)}{\\sin(2x)}$.<br><br>
Rewrite as a product: $\\displaystyle \\frac{\\sin(5x)}{\\sin(2x)} = \\frac{\\sin(5x)}{5x} \\cdot \\frac{2x}{\\sin(2x)} \\cdot \\frac{5x}{2x}$.<br><br>
Each of the first two factors tends to 1; the last factor is the constant $5/2$. Answer: $\\mathbf{5/2}$.</div></div>

<h2 class="lesson-title">7. Exponential and Logarithmic Limits</h2>

<div class="calc-highlight"><strong>Two more special limits round out the list.</strong> The first one defines the natural constant $e$ itself; the second one is its logarithmic companion. Together with $\\sin(x)/x \\to 1$, these three limits cover essentially every "trick" limit you will meet in high school and first-year calculus.</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF $e$</div><div class="formula-main">$$\\lim_{n \\to \\infty} \\left( 1 + \\frac{1}{n} \\right)^{\\! n} \\;=\\; e \\;\\approx\\; 2.71828\\,18284\\ldots$$</div><div class="formula-sub">The number e — Euler's constant — is the limit of compound interest as the compounding period shrinks to zero.</div></div>

<p class="l-text"><strong>Intuition.</strong> Imagine a bank that pays 100% interest per year. If interest is paid once at the end of the year, $\\$1$ grows to $\\$2$. If interest is compounded twice a year at 50% each time, you get $1 \\cdot (1 + 1/2)^2 = \\$2.25$. Quarterly: $(1 + 1/4)^4 \\approx \\$2.44$. Monthly: $(1 + 1/12)^{12} \\approx \\$2.61$. Daily: $\\approx \\$2.7146$. Continuously: exactly $\\$e \\approx 2.71828$. That continuous limit is what the formula above captures.</p>

<div class="calc-graph"><div id="plot-l12-e-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the sequence $a_n = (1 + 1/n)^n$ for $n = 1, 2, 3, \\ldots$ climbs steadily and approaches the horizontal asymptote $y = e \\approx 2.718$. Already by $n = 50$ the value is within 1% of the true limit; by $n = 1000$ within 0.05%.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var ys=[];for(var n=1;n<=120;n++){ns.push(n);ys.push(Math.pow(1+1/n,n));}
var trace={x:ns,y:ys,mode:'lines+markers',name:'(1 + 1/n)^n',line:{color:'#3b82f6',width:2},marker:{size:4,color:'#3b82f6'}};
var lim={x:[0,120],y:[Math.E,Math.E],mode:'lines',name:'e ≈ 2.71828',line:{color:'#ef4444',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',range:[0,120],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'(1 + 1/n)^n',range:[1.9,2.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l12-e-en',[trace,lim],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>A continuous version.</strong> If we replace the integer index $n$ by a real variable, $\\lim_{x \\to 0}(1+x)^{1/x} = e$. Or, taking the natural logarithm of both sides:</p>

<div class="calc-formula"><div class="formula-label">THE LOGARITHMIC LIMIT</div><div class="formula-main">$$\\lim_{x \\to 0} \\frac{\\ln(1 + x)}{x} \\;=\\; 1$$</div><div class="formula-sub">Take ln of (1+x)^(1/x) = e: get ln(1+x)/x = 1 in the limit.</div></div>

<div class="calc-formula"><div class="formula-label">A COMPANION EXPONENTIAL LIMIT</div><div class="formula-main">$$\\lim_{x \\to 0} \\frac{e^x - 1}{x} \\;=\\; 1$$</div><div class="formula-sub">This is the same limit in disguise — substitute u = e^x − 1 and the logarithmic limit becomes this one.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\ln(1 + 5x)}{x}$.<br><br>
Multiply and divide by 5: $\\displaystyle \\frac{\\ln(1 + 5x)}{x} = 5 \\cdot \\frac{\\ln(1 + 5x)}{5x}$.<br><br>
As $x \\to 0$ so does $5x$, and $\\ln(1+5x)/(5x) \\to 1$. Answer: $\\mathbf{5}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{n \\to \\infty} \\left( 1 + \\frac{3}{n} \\right)^{\\! n}$.<br><br>
Write $\\dfrac{3}{n} = \\dfrac{1}{m}$ so $m = n/3$. Then $n = 3m$ and the expression becomes $\\bigl(1 + 1/m\\bigr)^{3m} = \\bigl[ (1 + 1/m)^m \\bigr]^3$.<br><br>
As $n \\to \\infty$ so does $m$, and the inner bracket tends to $e$. Therefore the whole expression tends to $\\mathbf{e^3}$.</div></div>

<div class="l-note"><strong>Pattern.</strong> $\\displaystyle \\lim_{n \\to \\infty}(1 + k/n)^n = e^k$ for any real constant $k$. This formula is the engine behind continuous compound interest and behind the relationship $e^x = \\lim_{n \\to \\infty}(1 + x/n)^n$.</div>

<h2 class="lesson-title">8. Classic Practice — Eight Problems</h2>

<p class="l-text">Try each problem before reading the solution. Cover the answer with your hand if you have to. Limits are a craft skill — the only way to get fast is to do many of them.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — POLYNOMIAL</div><div class="example-body"><strong>Compute</strong> $\\lim_{x \\to -1}(2x^3 - x^2 + 4x - 3)$.<br><br>
<em>Solution.</em> Substitute: $-2 - 1 - 4 - 3 = \\mathbf{-10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — RATIONAL, NON-VANISHING</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 2} \\frac{3x + 1}{x^2 + 5}$.<br><br>
<em>Solution.</em> Denominator at 2 is $9 \\neq 0$. Substitute: $\\dfrac{7}{9} = \\mathbf{7/9}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — DIFFERENCE OF SQUARES</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 5} \\frac{x^2 - 25}{x - 5}$.<br><br>
<em>Solution.</em> $0/0$. Factor: $\\dfrac{(x-5)(x+5)}{x-5} = x + 5$. Substitute: $5 + 5 = \\mathbf{10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — TRINOMIAL FACTOR</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 3} \\frac{x^2 - 4x + 3}{x^2 - 9}$.<br><br>
<em>Solution.</em> $0/0$. Numerator $= (x-1)(x-3)$; denominator $= (x-3)(x+3)$. Cancel: $\\dfrac{x-1}{x+3}$. Substitute $x = 3$: $\\dfrac{2}{6} = \\mathbf{1/3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — CONJUGATE</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sqrt{x + 9} - 3}{x}$.<br><br>
<em>Solution.</em> $0/0$. Multiply by conjugate: $\\dfrac{(x+9) - 9}{x(\\sqrt{x+9} + 3)} = \\dfrac{1}{\\sqrt{x+9} + 3}$. Substitute: $\\dfrac{1}{3 + 3} = \\mathbf{1/6}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — DIFFERENCE OF CUBES</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 2} \\frac{x^3 - 8}{x - 2}$.<br><br>
<em>Solution.</em> $0/0$. Factor using $a^3 - b^3 = (a-b)(a^2 + ab + b^2)$: $x^3 - 8 = (x-2)(x^2 + 2x + 4)$. Cancel: $\\lim_{x\\to 2}(x^2 + 2x + 4) = 4 + 4 + 4 = \\mathbf{12}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — TRIG</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sin(7x)}{2x}$.<br><br>
<em>Solution.</em> $\\dfrac{\\sin(7x)}{2x} = \\dfrac{7}{2} \\cdot \\dfrac{\\sin(7x)}{7x}$. As $x \\to 0$, $\\sin(7x)/(7x) \\to 1$. Answer: $\\mathbf{7/2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — TRIG WITH IDENTITY</div><div class="example-body"><strong>Compute</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2}$.<br><br>
<em>Solution.</em> Multiply by the conjugate $1 + \\cos(x)$: $\\dfrac{1 - \\cos(x)}{x^2} \\cdot \\dfrac{1 + \\cos(x)}{1 + \\cos(x)} = \\dfrac{1 - \\cos^2(x)}{x^2 (1 + \\cos(x))} = \\dfrac{\\sin^2(x)}{x^2 (1 + \\cos(x))}$.<br><br>
Now $\\sin^2(x)/x^2 = (\\sin(x)/x)^2 \\to 1$, and $1 + \\cos(x) \\to 1 + 1 = 2$. Answer: $1 / 2 = \\mathbf{1/2}$.</div></div>

<div class="l-note"><strong>Recap.</strong> Five laws give you the algebra. Polynomial and rational limits become direct substitution. The $0/0$ form is resolved by factoring or by conjugates. Three special limits — $\\sin x/x$, $(1+1/n)^n$, $\\ln(1+x)/x$ — handle the trigonometric, exponential, and logarithmic cases that substitution cannot. Memorise the pattern, practise the eight problems above twice a week, and limits will become automatic.</div>

<div class="calc-graph"><div id="plot-l12-hole-en-extra" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Visual recap — the hole at $x=1$.</strong> The function $f(x) = (x^2-1)/(x-1)$ is identical to the line $y = x+1$ for every $x \\neq 1$, but is <em>undefined</em> at $x=1$. The open red circle marks that hole; the dashed vertical guide makes the location obvious. From both sides the function's value heads toward $y=2$ — and that target value is the limit, even though the function itself never actually reaches it at the point. This single picture captures the whole idea of a limit: it is the value the function <em>approaches</em>, not the value it <em>attains</em>.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=-30;i<=97;i++){var x=i/20;xL.push(x);yL.push(x+1);}
var xR=[];var yR=[];for(var i=103;i<=210;i++){var x=i/20;xR.push(x);yR.push(x+1);}
var tL={x:xL,y:yL,mode:'lines',name:'f(x) for x < 1',line:{color:'#3b82f6',width:3}};
var tR={x:xR,y:yR,mode:'lines',name:'f(x) for x > 1',line:{color:'#3b82f6',width:3},showlegend:false};
var asy={x:[1,1],y:[-0.5,4.5],mode:'lines',name:'x = 1 (hole location)',line:{color:'#a3a3a3',width:1.2,dash:'dash'}};
var limGuide={x:[-1.5,3.8],y:[2,2],mode:'lines',name:'limit value y = 2',line:{color:'#ef4444',width:1.2,dash:'dot'}};
var hole={x:[1],y:[2],mode:'markers',name:'hole at (1, 2)',marker:{size:16,color:'rgba(0,0,0,0)',line:{color:'#ef4444',width:2.8}}};
var label={x:[1],y:[2.32],mode:'text',name:'',text:['limit = 2'],textfont:{color:'#ef4444',size:13},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,3.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x) = (x² − 1)/(x − 1)',range:[-0.7,4.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l12-hole-en-extra',[tL,tR,asy,limGuide,hole,label],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Reference card — limit laws at a glance.</strong> Memorise this table: each row gives a law name, its formula (assuming $\\lim_{x\\to a} f = L$ and $\\lim_{x\\to a} g = M$ exist), and a quick worked example. These rules together cover almost every limit you will compute by hand at high-school level.</div>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(255,255,255,0.02);font-size:0.92rem;border-radius:8px;overflow:hidden">
<thead><tr style="border-bottom:2px solid rgba(59,130,246,0.45);text-align:left;background:rgba(59,130,246,0.05)">
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Law</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Formula</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Example</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Sum / Difference</strong></td>
<td style="padding:0.55rem 0.9rem">$\\lim (f \\pm g) = L \\pm M$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 2}(x^2 + x) = 4 + 2 = 6$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Product</strong></td>
<td style="padding:0.55rem 0.9rem">$\\lim (f \\cdot g) = L \\cdot M$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 3}(x \\cdot \\sin(\\pi/6)) = 3 \\cdot \\tfrac{1}{2} = \\tfrac{3}{2}$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Quotient</strong> &nbsp;<em>($M \\neq 0$)</em></td>
<td style="padding:0.55rem 0.9rem">$\\lim (f / g) = L / M$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 4} \\tfrac{x^2 - 3x + 5}{2x + 1} = \\tfrac{9}{9} = 1$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Constant Multiple</strong></td>
<td style="padding:0.55rem 0.9rem">$\\lim (c \\cdot f) = c \\cdot L$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 2}(7 x^2) = 7 \\cdot 4 = 28$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Power</strong> &nbsp;<em>($n$ positive integer)</em></td>
<td style="padding:0.55rem 0.9rem">$\\lim f^n = L^n$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 2}(x + 1)^3 = 3^3 = 27$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Composition</strong> &nbsp;<em>($g$ continuous at $L$)</em></td>
<td style="padding:0.55rem 0.9rem">$\\lim g(f(x)) = g(L)$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 0} \\sqrt{x^2 + 9} = \\sqrt{9} = 3$</td>
</tr>
<tr>
<td style="padding:0.55rem 0.9rem"><strong>Squeeze</strong> &nbsp;<em>(if $h \\leq f \\leq k$ and $\\lim h = \\lim k = L$)</em></td>
<td style="padding:0.55rem 0.9rem">$\\lim f = L$</td>
<td style="padding:0.55rem 0.9rem">$-x^2 \\leq x^2 \\sin(1/x) \\leq x^2 \\Rightarrow \\lim_{x\\to 0} x^2 \\sin(1/x) = 0$</td>
</tr>
</tbody>
</table>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">YOU CAN NOW</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Apply the sum, difference, product, quotient, and constant multiple laws step by step</li>
<li>Evaluate any polynomial limit by direct substitution</li>
<li>Evaluate a rational limit by substitution when the denominator does not vanish</li>
<li>Recognise the $0/0$ indeterminate form and resolve it by factoring or by conjugate multiplication</li>
<li>Use $\\sin(x)/x \\to 1$, $(1 + 1/n)^n \\to e$, and $\\ln(1+x)/x \\to 1$ as the three workhorse special limits</li>
<li>Tackle the eight classic limit problems and recognise their patterns in new contexts</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Önceki ders, limit fikrini resimlerle ve tablolarla inşa etti.</strong> O sezgi şarttır, ama tek başına çok yavaştır: her $\\lim_{x \\to 2}(3x^2 - 5x + 4)$ hesabı için yüz değer tablo yapamazsın. Şimdi ihtiyacımız olan şey bir <em>kurallar</em> kümesidir — küçük bir limit cebri — sayısal denemelerin yerine birkaç satır temiz aritmetik koymamızı sağlayan.</p>

<p class="l-text">Bu ders tam olarak budur. Limit kurallarını (toplam, fark, çarpım, bölüm, sabit çarpan) listeliyoruz, polinom ve rasyonel fonksiyonlara uyguluyoruz, sonra doğrudan yerine koymanın başarısız olduğu durumlara geçiyoruz — meşhur $\\tfrac{0}{0}$ belirsiz formuna — ve iki onarım tekniği öğreniyoruz: çarpanlara ayırma ve eşlenikle çarpma. Dersi, calculus boyunca sürekli karşımıza çıkacak üç özel limitle kapatıyoruz: trigonometrik limit $\\sin(x)/x$, $e$ sayısını tanımlayan üstel limit $(1+1/n)^n$ ve logaritmik kuzeni $\\ln(1+x)/x$.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Beş limit kuralını (toplam, fark, çarpım, bölüm, sabit çarpan) ifade etmeyi ve uygulamayı</li>
<li>Herhangi bir polinom limitini doğrudan yerine koyarak hesaplamayı ve bunun neden geçerli olduğunu açıklamayı</li>
<li>Paydanın sıfır olmadığı bir rasyonel fonksiyon limitini hesaplamayı ve paydanın sıfır olduğu durumu tanımayı</li>
<li>$0/0$ belirsiz formunu pay polinomunu çarpanlarına ayırıp ortak çarpanı sadeleştirerek çözmeyi</li>
<li>Kareköklü ifadeler içeren limiti pay ve paydayı eşlenikle çarparak çözmeyi</li>
<li>$\\lim_{x\\to 0}\\sin(x)/x = 1$, $\\lim_{n\\to\\infty}(1+1/n)^n = e$ ve $\\lim_{x\\to 0}\\ln(1+x)/x = 1$ özel limitlerini kullanmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Limit Cebiri: Beş Kural</h2>

<div class="calc-highlight"><strong>Günlük bir resim:</strong> iki araba aynı kavşağa yaklaşıyorsa — biri kuzeyden bilinen bir hızla, diğeri doğudan bilinen bir hızla — <em>birleşik</em> davranışları, ayrı davranışlarından tamamen kestirilebilirdir. Limit kuralları, fonksiyonlar hakkında aynı şeyi söyler: $f$'in ve $g$'nin $x = a$ yakınında ayrı ayrı ne yaptığını biliyorsan, $f+g$, $f-g$, $fg$ ve $f/g$'nin $x = a$ yakınında birlikte ne yaptığını da biliyorsun. Sürpriz yok.</div>

<p class="l-text">İki limitin var olduğunu varsayalım: $\\lim_{x \\to a} f(x) = L$ ve $\\lim_{x \\to a} g(x) = M$, burada $L$ ve $M$ sonlu reel sayılardır. O zaman aşağıdaki özdeşlikler geçerlidir:</p>

<div class="calc-formula"><div class="formula-label">TOPLAM KURALI</div><div class="formula-main">$$\\lim_{x \\to a} \\bigl[ f(x) + g(x) \\bigr] \\;=\\; L + M$$</div><div class="formula-sub">Toplamın limiti, limitlerin toplamıdır.</div></div>

<div class="calc-formula"><div class="formula-label">FARK KURALI</div><div class="formula-main">$$\\lim_{x \\to a} \\bigl[ f(x) - g(x) \\bigr] \\;=\\; L - M$$</div><div class="formula-sub">Farkın limiti, limitlerin farkıdır.</div></div>

<div class="calc-formula"><div class="formula-label">ÇARPIM KURALI</div><div class="formula-main">$$\\lim_{x \\to a} \\bigl[ f(x) \\cdot g(x) \\bigr] \\;=\\; L \\cdot M$$</div><div class="formula-sub">Çarpımın limiti, limitlerin çarpımıdır.</div></div>

<div class="calc-formula"><div class="formula-label">BÖLÜM KURALI</div><div class="formula-main">$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} \\;=\\; \\frac{L}{M} \\qquad (M \\neq 0)$$</div><div class="formula-sub">Bölümün limiti, limitlerin bölümüdür — paydadaki limit sıfır değilse.</div></div>

<div class="calc-formula"><div class="formula-label">SABİT ÇARPAN KURALI</div><div class="formula-main">$$\\lim_{x \\to a} \\bigl[ c \\cdot f(x) \\bigr] \\;=\\; c \\cdot L \\qquad (c \\in \\mathbb{R})$$</div><div class="formula-sub">Bir sabit, limitin dışına değişmeden çekilebilir.</div></div>

<p class="l-text"><strong>Bu kurallar neden doğru?</strong> Her biri doğrudan tanımdan çıkar: "f, L'ye yaklaşır ve g, M'ye yaklaşır, yani f+g, L+M'ye yaklaşır." İspatlar kısa ε-δ argümanlarıdır — lise düzeyinde ihtiyaç yoktur, ama var olduklarına inanman ve kuralları çalışan bir araç olarak kullanman gerekir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki limit de var olmalı</div><div class="card-body">$\\lim f$ yoksa, $\\lim g$ var olsa bile, $\\lim (f+g)$'yi hesaplamak için toplam kuralını kullanamazsın. Varsayımlar önemlidir.</div></div>
<div class="calc-card"><div class="card-title">Payda sıfır olmamalı</div><div class="card-body">Bölüm kuralı $M \\neq 0$ ister. $M = 0$ olduğunda durumu elle incelemek zorundayız (bölüm 4 ve 5).</div></div>
<div class="calc-card"><div class="card-title">Üs ve kök buradan çıkar</div><div class="card-body">Çarpım kuralından, her pozitif $n$ tamsayısı için $\\lim f^n = L^n$ elde edilir. $n$. dereceden kök için, kök tanımlıysa $\\lim \\sqrt[n]{f} = \\sqrt[n]{L}$.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Limit kurallarını adım adım kullanarak hesapla:</strong> $\\lim_{x \\to 3} \\bigl[ 2x^2 - 5x + 7 \\bigr]$.<br><br>
Adım 1 — toplam/fark kuralı:&nbsp; $\\lim_{x\\to 3}(2x^2) - \\lim_{x\\to 3}(5x) + \\lim_{x\\to 3} 7$.<br>
Adım 2 — sabit çarpan kuralı:&nbsp; $2 \\cdot \\lim_{x\\to 3} x^2 - 5 \\cdot \\lim_{x\\to 3} x + \\lim_{x\\to 3} 7$.<br>
Adım 3 — üs kuralı ve temel limitler:&nbsp; $\\lim_{x\\to 3} x = 3$, dolayısıyla $\\lim_{x\\to 3} x^2 = 9$; 7 sabitinin limiti 7'dir.<br>
Adım 4 — birleştir:&nbsp; $2 \\cdot 9 - 5 \\cdot 3 + 7 = 18 - 15 + 7 = \\mathbf{10}$.<br><br>
Dikkat: son sayı 10, polinoma $x = 3$ doğrudan yerleştirilince elde edilenle aynıdır. Bölüm 2 bunun neden her zaman izinli olduğunu açıklıyor.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">$\\lim_{x\\to 0} f(x)$ yoksa ama $\\lim_{x\\to 0} [f(x) + g(x)]$ varsa, $\\lim_{x\\to 0} g(x)$ hakkında ne söyleyebilirsin? O da var olamaz — eğer var olsaydı, toplam kuralı tersinden uygulanarak $\\lim f$'in varlığını zorlar, çelişki çıkar. Yani "var olmayan + var olan = var olan" imkânsızdır.</div></div>

<h2 class="lesson-title">2. Polinom Limitleri: Sadece Yerine Koy</h2>

<div class="calc-highlight"><strong>Ana sonuç:</strong> her polinom $P(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0$, her gerçel $a$ sayısında <em>süreklidir</em>. Bu, $\\lim_{x \\to a} P(x) = P(a)$ demektir. Bir polinom limitini hesaplamak, polinomu o noktada değerlendirmek kadar kolaydır — cebire gerek yoktur.</div>

<p class="l-text">Bu neden doğru? Yapı taşlarına bak. $f(x) = c$ sabit fonksiyonu için her $a$'da $\\lim_{x \\to a} c = c$. $f(x) = x$ özdeşlik fonksiyonu için $\\lim_{x \\to a} x = a$. Her polinom, bu iki fonksiyondan toplama, çıkarma, çarpma ve sabit çarpanlar kullanılarak inşa edilir — ve bölüm 1 bize bu dört işlemin de limiti koruduğunu söyledi. Bu yüzden, $x \\to a$ giderken herhangi bir polinomun limiti, polinomda $x$ geçen her yere $a$ yerleştirilerek elde edilir.</p>

<div class="calc-formula"><div class="formula-label">POLİNOM LİMİT KURALI</div><div class="formula-main">$$\\lim_{x \\to a} P(x) \\;=\\; P(a)$$</div><div class="formula-sub">Doğrudan yerine koy: polinomda x'in yerine a yaz ve hesapla.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\lim_{x \\to -2} \\bigl[ x^3 + 4x^2 - x + 6 \\bigr]$.<br><br>
$x = -2$ yerine koy:<br><br>
$(-2)^3 + 4 \\cdot (-2)^2 - (-2) + 6 = -8 + 16 + 2 + 6 = \\mathbf{16}$.<br><br>
Toplam iş: bir yerine koyma. Çarpanlara ayırma yok, tablo yok, ε-δ yok.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\lim_{x \\to 1} \\bigl[ 5x^4 - 3x^2 + 2x - 9 \\bigr]$.<br><br>
$x = 1$ yerine koy: $5 - 3 + 2 - 9 = \\mathbf{-5}$.</div></div>

<div class="l-note"><strong>Bu, calculus'ün geri kalanı için neden önemli:</strong> polinom limitleri ısınma turudur. Polinomların türevleri, integralleri, Taylor yaklaşımları — hepsi sessizce şu gerçeğe dayanır: yerine koyabilirsin.</div>

<h2 class="lesson-title">3. Rasyonel Fonksiyon Limitleri</h2>

<div class="calc-highlight"><strong>Bir rasyonel fonksiyon,</strong> iki polinomun bölümüdür: $R(x) = P(x) / Q(x)$. Payda polinomu $Q$, $a$ noktasında sıfır olmadığı sürece, bölüm kuralı geçerlidir ve limit doğrudan yerine koymayla hesaplanır — bölüm 2'deki aynı oyun.</div>

<div class="calc-formula"><div class="formula-label">RASYONEL FONKSİYON LİMİT KURALI</div><div class="formula-main">$$\\lim_{x \\to a} \\frac{P(x)}{Q(x)} \\;=\\; \\frac{P(a)}{Q(a)} \\qquad Q(a) \\neq 0 \\text{ iken}$$</div><div class="formula-sub">a'yı pay ve paydaya ayrı ayrı yerleştir. Böl.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 4} \\frac{x^2 - 3x + 5}{2x + 1}$.<br><br>
$x = 4$'te payda: $2 \\cdot 4 + 1 = 9 \\neq 0$. Her yerine koymakta güvendeyiz.<br><br>
Pay: $16 - 12 + 5 = 9$.<br>
Cevap: $9 / 9 = \\mathbf{1}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to -1} \\frac{x^3 + 2x^2 - x}{x^2 + 3x + 4}$.<br><br>
$x = -1$'de payda: $1 - 3 + 4 = 2 \\neq 0$.<br>
$x = -1$'de pay: $-1 + 2 + 1 = 2$.<br>
Cevap: $2 / 2 = \\mathbf{1}$.</div></div>

<p class="l-text"><strong>Peki payda <em>sıfır olursa</em> ne olur?</strong> O zaman bölüm kuralı suskun kalır ve daha derine inmemiz gerekir. Üç alt durum:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pay sıfırdan farklı, payda sıfır</div><div class="card-body">$\\tfrac{5}{0}$ gibi bir form. Limit $+\\infty$, $-\\infty$ veya yoktur — tek taraflı sonsuz limitleri ders 14'te göreceğiz.</div></div>
<div class="calc-card"><div class="card-title">Pay sıfır, payda sıfır ($0/0$)</div><div class="card-body">Belirsiz. Limit herhangi bir reel sayı, $\\pm\\infty$ veya yok olabilir. Bölüm 4 bunu nasıl çözdüğümüzü gösteriyor.</div></div>
<div class="calc-card"><div class="card-title">Pay sıfır, payda sıfırdan farklı</div><div class="card-body">$k \\neq 0$ olmak üzere $\\tfrac{0}{k}$ formu. Limit $0$'dır. Kolay durum.</div></div>
</div>

<h2 class="lesson-title">4. $0/0$ Formu: Çarpanlara Ayır ve Sadeleştir</h2>

<div class="calc-highlight"><strong>Lise calculus'undeki en yaygın belirsiz form $0/0$'dır.</strong> Rasyonel bir ifadeye $x = a$ yerleştirip her iki parça da sıfır verirse, <em>limit sıfırdır</em> ya da <em>yoktur</em> sonucuna varma. Bunun yerine pay ve paydayı çarpanlarına ayır, sıfırı üreten ortak çarpanı sadeleştir ve sadeleşmiş ifade üzerinde yerine koymayı tekrar dene.</div>

<p class="l-text">Bunun çalışmasının nedeni: eğer $(x - a)$, hem $P(x)$'in hem de $Q(x)$'in bir çarpanıysa, her $x \\neq a$ için sadeleştirebiliriz:</p>

<div class="calc-formula"><div class="formula-label">SADELEŞTİRME ÖZDEŞLİĞİ</div><div class="formula-main">$$\\frac{(x-a) \\cdot \\widetilde{P}(x)}{(x-a) \\cdot \\widetilde{Q}(x)} \\;=\\; \\frac{\\widetilde{P}(x)}{\\widetilde{Q}(x)} \\qquad \\text{her } x \\neq a \\text{ için}$$</div><div class="formula-sub">Sadeleşmiş fonksiyon, orijinal fonksiyonla x = a hariç her yerde aynıdır. Limit, x = a'daki değeri görmezden geldiği için, ikisinin limiti aynıdır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İKİ KARENİN FARKI</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$.<br><br>
Doğrudan yerine koy: $\\tfrac{1-1}{1-1} = \\tfrac{0}{0}$. Belirsiz.<br><br>
Pay polinomunu $a^2 - b^2 = (a-b)(a+b)$ kullanarak çarpanlarına ayır:<br>
$x^2 - 1 = (x-1)(x+1)$.<br><br>
Bu yüzden $\\displaystyle \\frac{x^2 - 1}{x - 1} = \\frac{(x-1)(x+1)}{x-1} = x + 1$, her $x \\neq 1$ için.<br><br>
Sadeleşmiş ifadenin limitini al: $\\lim_{x \\to 1}(x+1) = \\mathbf{2}$.</div></div>

<div class="calc-graph"><div id="plot-l12-hole-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafikte ne var:</strong> $f(x) = (x^2-1)/(x-1)$ fonksiyonu $x = 1$ noktası hariç her yerde $y = x + 1$ doğrusunu çiziyor — $x = 1$'de bir "delik" var (fonksiyon orada tanımlı değil). Açık daire deliği işaretliyor; fonksiyonun iki taraftan yaklaştığı değer $y = 2$, yani limit.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=-20;i<=98;i++){var x=i/20;xL.push(x);yL.push(x+1);}
var xR=[];var yR=[];for(var i=102;i<=200;i++){var x=i/20;xR.push(x);yR.push(x+1);}
var tL={x:xL,y:yL,mode:'lines',name:'f(x) — x < 1',line:{color:'#3b82f6',width:2.5}};
var tR={x:xR,y:yR,mode:'lines',name:'f(x) — x > 1',line:{color:'#3b82f6',width:2.5},showlegend:false};
var hole={x:[1],y:[2],mode:'markers',name:'x = 1 deliği',marker:{size:14,color:'rgba(0,0,0,0)',line:{color:'#ef4444',width:2.5}}};
var limPt={x:[1],y:[2],mode:'markers+text',name:'limit = 2',marker:{size:6,color:'#ef4444'},text:['  limit = 2'],textposition:'middle right',textfont:{color:'#ef4444',size:13}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.2,3.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x)',range:[-0.6,4.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l12-hole-tr',[tL,tR,hole,limPt],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÜÇ TERİMLİYİ ÇARPANLARA AYIRMA</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 2} \\frac{x^2 - 5x + 6}{x - 2}$.<br><br>
Doğrudan yerine koy: $\\tfrac{4 - 10 + 6}{0} = \\tfrac{0}{0}$.<br><br>
Payı çarpanlarına ayır. Çarpımları 6, toplamları $-5$ olan iki sayı bulalım: $-2$ ve $-3$.<br>
Yani $x^2 - 5x + 6 = (x-2)(x-3)$.<br><br>
Sadeleştir: $\\displaystyle \\frac{(x-2)(x-3)}{x-2} = x - 3$, $x \\neq 2$ için.<br><br>
$\\lim_{x \\to 2}(x - 3) = 2 - 3 = \\mathbf{-1}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — HER İKİ TARAF ÇARPANLANIYOR</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to -3} \\frac{x^2 + 5x + 6}{x^2 - 9}$.<br><br>
Doğrudan yerine koy: pay $9 - 15 + 6 = 0$; payda $9 - 9 = 0$. Belirsiz.<br><br>
İkisini de çarpanlarına ayır: $x^2 + 5x + 6 = (x+2)(x+3)$; &nbsp; $x^2 - 9 = (x-3)(x+3)$.<br><br>
Ortak $(x+3)$'ü sadeleştir: $\\displaystyle \\frac{(x+2)(x+3)}{(x-3)(x+3)} = \\frac{x+2}{x-3}$, $x \\neq -3$ için.<br><br>
Yerine koy: $\\dfrac{-3 + 2}{-3 - 3} = \\dfrac{-1}{-6} = \\mathbf{\\dfrac{1}{6}}$.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Sıfıra bölemediğimiz halde sadeleştirme neden meşru? Çünkü $x$'in $-3$'e <em>yaklaştığı</em> limite bakıyoruz, hiçbir zaman ulaşmıyor. Her $x \\neq -3$ için $(x+3)$ çarpanı bölebileceğimiz sıfırdan farklı bir sayıdır. Sadeleşmiş ifade ve orijinali bu tüm noktalarda uyuşur, ve limit de zaten yalnız onları görür.</div></div>

<h2 class="lesson-title">5. Köklü İfadeler: Eşlenik Hilesi</h2>

<div class="calc-highlight"><strong>Bir $0/0$ limitinde kareköller varsa, çarpanlara ayırma genelde doğrudan işe yaramaz.</strong> Standart onarım, pay ve paydayı köklü ifadenin <em>eşleniği</em> ile çarpmaktır. $\\sqrt{A} - \\sqrt{B}$'nin eşleniği $\\sqrt{A} + \\sqrt{B}$'dir, ve çarpımları iki karenin farkı $A - B$ — bu da kökü öldürür.</div>

<div class="calc-formula"><div class="formula-label">EŞLENİK ÖZDEŞLİĞİ</div><div class="formula-main">$$(\\sqrt{A} - \\sqrt{B})(\\sqrt{A} + \\sqrt{B}) \\;=\\; A - B$$</div><div class="formula-sub">Eşlenikle çarpmak, kök farkını polinom farkına çevirir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KLASİK EŞLENİK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sqrt{x + 4} - 2}{x}$.<br><br>
Doğrudan yerine koy: $\\tfrac{\\sqrt{4} - 2}{0} = \\tfrac{0}{0}$. Belirsiz.<br><br>
Pay ve paydayı eşlenik $\\sqrt{x+4} + 2$ ile çarp:<br><br>
$\\displaystyle \\frac{\\sqrt{x+4} - 2}{x} \\cdot \\frac{\\sqrt{x+4} + 2}{\\sqrt{x+4} + 2} \\;=\\; \\frac{(x+4) - 4}{x \\bigl( \\sqrt{x+4} + 2 \\bigr)} \\;=\\; \\frac{x}{x \\bigl( \\sqrt{x+4} + 2 \\bigr)}$.<br><br>
$x$'i sadeleştir ($x \\neq 0$ için meşru): $\\displaystyle \\frac{1}{\\sqrt{x+4} + 2}$.<br><br>
Şimdi $x = 0$ yerine koy: $\\dfrac{1}{\\sqrt{4} + 2} = \\dfrac{1}{2 + 2} = \\mathbf{\\dfrac{1}{4}}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — PAYDADAKİ EŞLENİK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 9} \\frac{x - 9}{\\sqrt{x} - 3}$.<br><br>
Doğrudan yerine koy: $\\tfrac{0}{0}$.<br><br>
Üst ve altı $\\sqrt{x} + 3$ (paydanın eşleniği) ile çarp:<br><br>
$\\displaystyle \\frac{(x - 9)(\\sqrt{x} + 3)}{(\\sqrt{x} - 3)(\\sqrt{x} + 3)} \\;=\\; \\frac{(x - 9)(\\sqrt{x} + 3)}{x - 9} \\;=\\; \\sqrt{x} + 3$, $x \\neq 9$ için.<br><br>
Yerine koy: $\\sqrt{9} + 3 = 3 + 3 = \\mathbf{6}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İKİ KÖK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sqrt{x + 1} - \\sqrt{1 - x}}{x}$.<br><br>
Doğrudan yerine koy: $\\tfrac{1 - 1}{0} = \\tfrac{0}{0}$.<br><br>
Eşlenik $\\sqrt{x+1} + \\sqrt{1-x}$ ile çarp:<br><br>
$\\displaystyle \\frac{(x+1) - (1-x)}{x \\bigl( \\sqrt{x+1} + \\sqrt{1-x} \\bigr)} \\;=\\; \\frac{2x}{x \\bigl( \\sqrt{x+1} + \\sqrt{1-x} \\bigr)} \\;=\\; \\frac{2}{\\sqrt{x+1} + \\sqrt{1-x}}$.<br><br>
$x = 0$ yerine koy: $\\dfrac{2}{1 + 1} = \\mathbf{1}$.</div></div>

<div class="l-note"><strong>Strateji özeti.</strong> Karekök ve $0/0$ formu gördüğünde ilk içgüdün şu olmalı: eşlenikle çarp. Kökler kaybolur, cebir basitleşir, limit genellikle ortaya çıkar.</div>

<h2 class="lesson-title">6. Trigonometrik Limit: $\\sin(x)/x \\to 1$</h2>

<div class="calc-highlight"><strong>Tüm özel limitler arasında en temel olanı</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$. Her trigonometrik fonksiyonun türevine açılan kapıdır, fizikte küçük açı yaklaşımının ($\\theta$ küçükken $\\sin\\theta \\approx \\theta$) temel taşıdır ve sıfır yakınında sinüs içeren her limit için standart bir araçtır.</div>

<p class="l-text"><strong>Geometrik ispat taslağı.</strong> Merkez açısı $x$ olan ($0 < x < \\pi/2$ için) birim çember dilimini yerleştir. Dilim, $\\tfrac{1}{2} \\sin(x)$ alanında küçük bir üçgen, $\\tfrac{1}{2} x$ alanında dairesel dilimin kendisi ve $\\tfrac{1}{2} \\tan(x)$ alanında daha büyük bir üçgen içerir. Geometrik kapsama eşitsizlik zincirini verir:</p>

<div class="calc-formula"><div class="formula-label">SIKIŞTIRMA EŞİTSİZLİĞİ ($0 < x < \\pi/2$ İÇİN)</div><div class="formula-main">$$\\sin(x) \\;\\leq\\; x \\;\\leq\\; \\tan(x) \\;=\\; \\frac{\\sin(x)}{\\cos(x)}$$</div><div class="formula-sub">Tüm terimleri sin(x) ile böl (bu aralıkta pozitif): 1 ≤ x/sin(x) ≤ 1/cos(x).</div></div>

<p class="l-text">Çarpmaya tersini al (pozitifler için eşitsizlikleri ters çevirir):</p>

<div class="calc-formula"><div class="formula-label">TERS ZİNCİR</div><div class="formula-main">$$\\cos(x) \\;\\leq\\; \\frac{\\sin(x)}{x} \\;\\leq\\; 1$$</div><div class="formula-sub">x → 0 giderken, cos(x) → 1, yani sin(x)/x ikisi de 1'e giden iki büyüklük arasında sıkıştırılır.</div></div>

<p class="l-text"><em>Sıkıştırma Teoremi</em>'ne göre (aynı limite sahip iki fonksiyon arasında sıkışmış herhangi bir fonksiyonun da o limite sahip olması gerekir), $x \\to 0^+$ giderken $\\sin(x)/x \\to 1$ sonucuna ulaşırız. Aynı argüman $x$ yerine $-x$ konularak sol tarafı halleder. Dolayısıyla iki taraflı limit 1'e eşittir.</p>

<div class="calc-formula"><div class="formula-label">TRİGONOMETRİK LİMİT</div><div class="formula-main">$$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} \\;=\\; 1 \\qquad (x \\text{ radyan cinsinden})$$</div><div class="formula-sub">Bu sadece x radyan cinsindense doğrudur — calculus'un derece yerine radyan tercih etmesinin tam nedeni.</div></div>

<div class="calc-graph"><div id="plot-l12-sinc-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafikte ne var:</strong> $x = 0$ yakınında $\\sin(x)/x$ grafiği. Fonksiyon tam $x = 0$'da tanımsızdır (0/0 elde ederdin), ama grafik her iki taraftan da $(0, 1)$ noktasından düzgünce geçer. Kırmızı kesik çizgi limit değeri 1'i gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-100;i<=100;i++){var x=i/20;if(Math.abs(x)<1e-9)continue;xs.push(x);ys.push(Math.sin(x)/x);}
var trace={x:xs,y:ys,mode:'lines',name:'sin(x)/x',line:{color:'#3b82f6',width:2.5}};
var lim={x:[-5,5],y:[1,1],mode:'lines',name:'limit = 1',line:{color:'#ef4444',width:1.5,dash:'dash'}};
var hole={x:[0],y:[1],mode:'markers',name:'x = 0 deliği',marker:{size:14,color:'rgba(0,0,0,0)',line:{color:'#ef4444',width:2.5}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (radyan)',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'sin(x)/x',range:[-0.3,1.2],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l12-sinc-tr',[trace,lim,hole],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Yararlı varyant.</strong> Limit içinde $x$'i $kx$ ile değiştirmek (herhangi bir $k$ sabiti için) $\\lim_{x \\to 0} \\sin(kx)/x = k$ verir, çünkü $\\sin(kx)/(kx) \\to 1$ ve $k$ ile çarpmamız gerekir. Bu, $\\lim_{x\\to 0} \\sin(5x)/(3x) = 5/3$ gibi problemlerin iş atı formülüdür.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sin(3x)}{x}$.<br><br>
3 ile çarp ve böl: $\\displaystyle \\frac{\\sin(3x)}{x} = 3 \\cdot \\frac{\\sin(3x)}{3x}$.<br><br>
$x \\to 0$ giderken $3x$ de gider, ve $\\sin(3x)/(3x) \\to 1$. Yani limit $3 \\cdot 1 = \\mathbf{3}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sin(5x)}{\\sin(2x)}$.<br><br>
Çarpım olarak yaz: $\\displaystyle \\frac{\\sin(5x)}{\\sin(2x)} = \\frac{\\sin(5x)}{5x} \\cdot \\frac{2x}{\\sin(2x)} \\cdot \\frac{5x}{2x}$.<br><br>
İlk iki çarpan 1'e gider; son çarpan $5/2$ sabiti. Cevap: $\\mathbf{5/2}$.</div></div>

<h2 class="lesson-title">7. Üstel ve Logaritmik Limitler</h2>

<div class="calc-highlight"><strong>İki özel limit daha listeyi tamamlar.</strong> Birincisi $e$ sabitinin kendisini tanımlar; ikincisi de logaritmik kuzenidir. $\\sin(x)/x \\to 1$ ile birlikte bu üç limit, lisede ve birinci yıl calculus'da karşılaşacağın hemen her "hile" limitini kapsar.</div>

<div class="calc-formula"><div class="formula-label">$e$ TANIMI</div><div class="formula-main">$$\\lim_{n \\to \\infty} \\left( 1 + \\frac{1}{n} \\right)^{\\! n} \\;=\\; e \\;\\approx\\; 2.71828\\,18284\\ldots$$</div><div class="formula-sub">e sayısı — Euler sabiti — bileşik faizin, bileşikleme periyodu sıfıra giderken aldığı limittir.</div></div>

<p class="l-text"><strong>Sezgi.</strong> Yılda %100 faiz veren bir banka düşün. Faiz yıl sonunda bir kez ödenirse, $\\$1$ büyür ve $\\$2$ olur. Yılda iki kez %50 oranla bileşiklenirse $1 \\cdot (1 + 1/2)^2 = \\$2.25$ elde edersin. Üç ayda bir: $(1 + 1/4)^4 \\approx \\$2.44$. Ayda bir: $(1 + 1/12)^{12} \\approx \\$2.61$. Günlük: $\\approx \\$2.7146$. Sürekli olarak: tam $\\$e \\approx 2.71828$. İşte yukarıdaki formülün yakaladığı şey o sürekli limittir.</p>

<div class="calc-graph"><div id="plot-l12-e-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafikte ne var:</strong> $a_n = (1 + 1/n)^n$ dizisi $n = 1, 2, 3, \\ldots$ için istikrarlı bir şekilde yükselir ve $y = e \\approx 2.718$ yatay asimptotuna yaklaşır. $n = 50$'ye kadar gerçek limite %1'in altında yaklaşılmış; $n = 1000$'de %0.05'in altında.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var ns=[];var ys=[];for(var n=1;n<=120;n++){ns.push(n);ys.push(Math.pow(1+1/n,n));}
var trace={x:ns,y:ys,mode:'lines+markers',name:'(1 + 1/n)^n',line:{color:'#3b82f6',width:2},marker:{size:4,color:'#3b82f6'}};
var lim={x:[0,120],y:[Math.E,Math.E],mode:'lines',name:'e ≈ 2.71828',line:{color:'#ef4444',width:1.5,dash:'dash'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'n',range:[0,120],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'(1 + 1/n)^n',range:[1.9,2.9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l12-e-tr',[trace,lim],layout,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Sürekli versiyon.</strong> Tamsayı endeksi $n$'i reel bir değişkenle değiştirsek $\\lim_{x \\to 0}(1+x)^{1/x} = e$ olur. Veya iki tarafın doğal logaritmasını alarak:</p>

<div class="calc-formula"><div class="formula-label">LOGARİTMİK LİMİT</div><div class="formula-main">$$\\lim_{x \\to 0} \\frac{\\ln(1 + x)}{x} \\;=\\; 1$$</div><div class="formula-sub">(1+x)^(1/x) = e'nin ln'sini al: limitte ln(1+x)/x = 1 elde edersin.</div></div>

<div class="calc-formula"><div class="formula-label">EŞLİK EDEN ÜSTEL LİMİT</div><div class="formula-main">$$\\lim_{x \\to 0} \\frac{e^x - 1}{x} \\;=\\; 1$$</div><div class="formula-sub">Bu aynı limit kılık değiştirmiş halidir — u = e^x − 1 değişkeniyle logaritmik limit buna dönüşür.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\ln(1 + 5x)}{x}$.<br><br>
5 ile çarp ve böl: $\\displaystyle \\frac{\\ln(1 + 5x)}{x} = 5 \\cdot \\frac{\\ln(1 + 5x)}{5x}$.<br><br>
$x \\to 0$ giderken $5x$ de gider, ve $\\ln(1+5x)/(5x) \\to 1$. Cevap: $\\mathbf{5}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{n \\to \\infty} \\left( 1 + \\frac{3}{n} \\right)^{\\! n}$.<br><br>
$\\dfrac{3}{n} = \\dfrac{1}{m}$ yaz, böylece $m = n/3$. O zaman $n = 3m$ ve ifade $\\bigl(1 + 1/m\\bigr)^{3m} = \\bigl[ (1 + 1/m)^m \\bigr]^3$ olur.<br><br>
$n \\to \\infty$ giderken $m$ de gider, ve içerideki köşeli parantez $e$'ye gider. Yani tüm ifade $\\mathbf{e^3}$'e gider.</div></div>

<div class="l-note"><strong>Örüntü.</strong> Herhangi bir reel $k$ sabiti için $\\displaystyle \\lim_{n \\to \\infty}(1 + k/n)^n = e^k$. Bu formül, sürekli bileşik faizin arkasındaki motor ve $e^x = \\lim_{n \\to \\infty}(1 + x/n)^n$ ilişkisinin temelidir.</div>

<h2 class="lesson-title">8. Klasik Pratik — Sekiz Problem</h2>

<p class="l-text">Her problemi çözümü okumadan dene. Gerekirse cevabı elinle kapat. Limit bir zanaat becerisidir — hızlanmanın tek yolu çok sayıda yapmaktır.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — POLİNOM</div><div class="example-body"><strong>Hesapla:</strong> $\\lim_{x \\to -1}(2x^3 - x^2 + 4x - 3)$.<br><br>
<em>Çözüm.</em> Yerine koy: $-2 - 1 - 4 - 3 = \\mathbf{-10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — RASYONEL, PAYDA SIFIRDAN FARKLI</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 2} \\frac{3x + 1}{x^2 + 5}$.<br><br>
<em>Çözüm.</em> 2'de payda $9 \\neq 0$. Yerine koy: $\\dfrac{7}{9} = \\mathbf{7/9}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — İKİ KARENİN FARKI</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 5} \\frac{x^2 - 25}{x - 5}$.<br><br>
<em>Çözüm.</em> $0/0$. Çarpanlara ayır: $\\dfrac{(x-5)(x+5)}{x-5} = x + 5$. Yerine koy: $5 + 5 = \\mathbf{10}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — ÜÇ TERİMLİ ÇARPAN</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 3} \\frac{x^2 - 4x + 3}{x^2 - 9}$.<br><br>
<em>Çözüm.</em> $0/0$. Pay $= (x-1)(x-3)$; payda $= (x-3)(x+3)$. Sadeleştir: $\\dfrac{x-1}{x+3}$. $x = 3$ yerine koy: $\\dfrac{2}{6} = \\mathbf{1/3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — EŞLENİK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sqrt{x + 9} - 3}{x}$.<br><br>
<em>Çözüm.</em> $0/0$. Eşlenikle çarp: $\\dfrac{(x+9) - 9}{x(\\sqrt{x+9} + 3)} = \\dfrac{1}{\\sqrt{x+9} + 3}$. Yerine koy: $\\dfrac{1}{3 + 3} = \\mathbf{1/6}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — İKİ KÜPÜN FARKI</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 2} \\frac{x^3 - 8}{x - 2}$.<br><br>
<em>Çözüm.</em> $0/0$. $a^3 - b^3 = (a-b)(a^2 + ab + b^2)$ kullanarak çarpanlara ayır: $x^3 - 8 = (x-2)(x^2 + 2x + 4)$. Sadeleştir: $\\lim_{x\\to 2}(x^2 + 2x + 4) = 4 + 4 + 4 = \\mathbf{12}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — TRİG</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{\\sin(7x)}{2x}$.<br><br>
<em>Çözüm.</em> $\\dfrac{\\sin(7x)}{2x} = \\dfrac{7}{2} \\cdot \\dfrac{\\sin(7x)}{7x}$. $x \\to 0$ giderken $\\sin(7x)/(7x) \\to 1$. Cevap: $\\mathbf{7/2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — TRİG İLE ÖZDEŞLİK</div><div class="example-body"><strong>Hesapla:</strong> $\\displaystyle \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2}$.<br><br>
<em>Çözüm.</em> Eşlenik $1 + \\cos(x)$ ile çarp: $\\dfrac{1 - \\cos(x)}{x^2} \\cdot \\dfrac{1 + \\cos(x)}{1 + \\cos(x)} = \\dfrac{1 - \\cos^2(x)}{x^2 (1 + \\cos(x))} = \\dfrac{\\sin^2(x)}{x^2 (1 + \\cos(x))}$.<br><br>
Şimdi $\\sin^2(x)/x^2 = (\\sin(x)/x)^2 \\to 1$, ve $1 + \\cos(x) \\to 1 + 1 = 2$. Cevap: $1 / 2 = \\mathbf{1/2}$.</div></div>

<div class="l-note"><strong>Özet.</strong> Beş kural sana cebri verir. Polinom ve rasyonel limitler doğrudan yerine koyma haline gelir. $0/0$ formu çarpanlara ayırarak veya eşleniklerle çözülür. Üç özel limit — $\\sin x/x$, $(1+1/n)^n$, $\\ln(1+x)/x$ — yerine koymanın halledemediği trigonometrik, üstel ve logaritmik durumları kapsar. Örüntüyü ezberle, yukarıdaki sekiz problemi haftada iki kez tekrarla, ve limit otomatikleşecektir.</div>

<div class="calc-graph"><div id="plot-l12-hole-tr-extra" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Görsel özet — $x=1$'deki delik.</strong> $f(x) = (x^2-1)/(x-1)$ fonksiyonu her $x \\neq 1$ için $y = x+1$ doğrusuyla aynıdır, ama $x=1$'de <em>tanımsızdır</em>. Açık kırmızı çember o deliği işaretler; kesik çizgi dikey kılavuz konumu belirgin kılar. İki taraftan da fonksiyonun değeri $y=2$'ye doğru gider — ve fonksiyon o noktada o değere asla ulaşmasa bile, hedef değer limitin kendisidir. Bu tek resim limit fikrinin tamamını yakalar: limit, fonksiyonun <em>ulaştığı</em> değer değil, <em>yaklaştığı</em> değerdir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xL=[];var yL=[];for(var i=-30;i<=97;i++){var x=i/20;xL.push(x);yL.push(x+1);}
var xR=[];var yR=[];for(var i=103;i<=210;i++){var x=i/20;xR.push(x);yR.push(x+1);}
var tL={x:xL,y:yL,mode:'lines',name:'f(x) — x < 1',line:{color:'#3b82f6',width:3}};
var tR={x:xR,y:yR,mode:'lines',name:'f(x) — x > 1',line:{color:'#3b82f6',width:3},showlegend:false};
var asy={x:[1,1],y:[-0.5,4.5],mode:'lines',name:'x = 1 (delik konumu)',line:{color:'#a3a3a3',width:1.2,dash:'dash'}};
var limGuide={x:[-1.5,3.8],y:[2,2],mode:'lines',name:'limit değeri y = 2',line:{color:'#ef4444',width:1.2,dash:'dot'}};
var hole={x:[1],y:[2],mode:'markers',name:'(1, 2) deliği',marker:{size:16,color:'rgba(0,0,0,0)',line:{color:'#ef4444',width:2.8}}};
var label={x:[1],y:[2.32],mode:'text',name:'',text:['limit = 2'],textfont:{color:'#ef4444',size:13},showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,3.8],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'f(x) = (x² − 1)/(x − 1)',range:[-0.7,4.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l12-hole-tr-extra',[tL,tR,asy,limGuide,hole,label],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-highlight"><strong>Başvuru kartı — limit kuralları özet.</strong> Bu tabloyu ezberle: her satır bir kuralın adını, formülünü ($\\lim_{x\\to a} f = L$ ve $\\lim_{x\\to a} g = M$ var olduğu varsayımıyla) ve hızlı bir çözümlü örneği verir. Bu kurallar birlikte, lise düzeyinde elle hesaplayacağın hemen her limiti kapsar.</div>

<table style="width:100%;border-collapse:collapse;margin:1.2rem 0;background:rgba(255,255,255,0.02);font-size:0.92rem;border-radius:8px;overflow:hidden">
<thead><tr style="border-bottom:2px solid rgba(59,130,246,0.45);text-align:left;background:rgba(59,130,246,0.05)">
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Kural</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Formül</th>
<th style="padding:0.7rem 0.9rem;color:#3b82f6;font-weight:700">Örnek</th>
</tr></thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Toplam / Fark</strong></td>
<td style="padding:0.55rem 0.9rem">$\\lim (f \\pm g) = L \\pm M$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 2}(x^2 + x) = 4 + 2 = 6$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Çarpım</strong></td>
<td style="padding:0.55rem 0.9rem">$\\lim (f \\cdot g) = L \\cdot M$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 3}(x \\cdot \\sin(\\pi/6)) = 3 \\cdot \\tfrac{1}{2} = \\tfrac{3}{2}$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Bölüm</strong> &nbsp;<em>($M \\neq 0$)</em></td>
<td style="padding:0.55rem 0.9rem">$\\lim (f / g) = L / M$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 4} \\tfrac{x^2 - 3x + 5}{2x + 1} = \\tfrac{9}{9} = 1$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Sabit Çarpan</strong></td>
<td style="padding:0.55rem 0.9rem">$\\lim (c \\cdot f) = c \\cdot L$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 2}(7 x^2) = 7 \\cdot 4 = 28$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Üs</strong> &nbsp;<em>($n$ pozitif tamsayı)</em></td>
<td style="padding:0.55rem 0.9rem">$\\lim f^n = L^n$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 2}(x + 1)^3 = 3^3 = 27$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
<td style="padding:0.55rem 0.9rem"><strong>Bileşke</strong> &nbsp;<em>($g$, $L$'de sürekli)</em></td>
<td style="padding:0.55rem 0.9rem">$\\lim g(f(x)) = g(L)$</td>
<td style="padding:0.55rem 0.9rem">$\\lim_{x\\to 0} \\sqrt{x^2 + 9} = \\sqrt{9} = 3$</td>
</tr>
<tr>
<td style="padding:0.55rem 0.9rem"><strong>Sıkıştırma</strong> &nbsp;<em>($h \\leq f \\leq k$ ve $\\lim h = \\lim k = L$ ise)</em></td>
<td style="padding:0.55rem 0.9rem">$\\lim f = L$</td>
<td style="padding:0.55rem 0.9rem">$-x^2 \\leq x^2 \\sin(1/x) \\leq x^2 \\Rightarrow \\lim_{x\\to 0} x^2 \\sin(1/x) = 0$</td>
</tr>
</tbody>
</table>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">ARTIK YAPABİLİRSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Toplam, fark, çarpım, bölüm ve sabit çarpan kurallarını adım adım uygula</li>
<li>Herhangi bir polinom limitini doğrudan yerine koyarak hesapla</li>
<li>Payda sıfır olmadığında bir rasyonel limiti yerine koyarak hesapla</li>
<li>$0/0$ belirsiz formunu tanı ve çarpanlara ayırarak ya da eşlenikle çarparak çöz</li>
<li>$\\sin(x)/x \\to 1$, $(1 + 1/n)^n \\to e$ ve $\\ln(1+x)/x \\to 1$ özel limitlerini üç iş atı olarak kullan</li>
<li>Sekiz klasik limit problemini çöz ve örüntülerini yeni bağlamlarda tanı</li>
</ul>
</div>`
};
